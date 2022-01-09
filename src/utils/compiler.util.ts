import {
  ExportAllDeclaration,
  ImportDeclaration,
  ModuleDeclaration,
  transformFileSync,
} from '@swc/core';
import { MINI_PROGRAM_NPM, NODE_MODULES } from '@src/constrants';

import { Visitor } from '@swc/core/Visitor.js';
import { VoidCallback } from '@src/models';
import { getConfig } from '@src/config';
import { getMiniProgramInfo } from './utils';
import { pathProxy } from './path.util';

class ImportCollectVisitor extends Visitor {
  private callback: VoidCallback;
  private fname: string;

  private pickPackName = (n: ImportDeclaration | ExportAllDeclaration) => {
    if (!this.fname.includes(NODE_MODULES)) {
      return n;
    }

    const packageName = n.source.value;
    if (packageName.startsWith('.')) {
      const path = pathProxy.resolve(
        pathProxy.dirname(this.fname),
        packageName + '.js',
      );
      this.callback(path);
      return n;
    }

    const miniProgramInfo = getMiniProgramInfo(this.fname);
    const path = pathProxy.resolve(
      NODE_MODULES,
      miniProgramInfo.packageName,
      miniProgramInfo.miniprogram,
      MINI_PROGRAM_NPM,
      packageName,
      'index.js',
    );
    this.callback(path);
    return n;
  };

  constructor(fname: string, callback: VoidCallback) {
    super();
    this.callback = callback;
    this.fname = fname;
  }

  visitImportDeclaration(n: ImportDeclaration): ImportDeclaration {
    return this.pickPackName(n) as ImportDeclaration;
  }

  visitExportAllDeclaration(n: ExportAllDeclaration): ExportAllDeclaration {
    return this.pickPackName(n) as ExportAllDeclaration;
  }
}

export const getTranspileContent = (fname: string) => {
  const output = transformFileSync(fname, {
    sourceMaps: false,
    jsc: {
      parser: {
        syntax: 'typescript',
        tsx: false,
      },
    },
    module: {
      type: 'es6',
    },
  });
  return output.code;
};

export const getLibImportedtFiles = (fname: string) => {
  const files: string[] = [];
  transformFileSync(fname, {
    sourceMaps: false,
    jsc: {
      parser: {
        syntax: 'typescript',
        tsx: false,
      },
    },
    module: {
      type: 'es6',
    },
    plugin: (m) =>
      new ImportCollectVisitor(fname, (n) => {
        files.push(n as string);
      }).visitProgram(m),
  });
  return files;
};

export const getLibTarget = (fname: string) => {
  const { miniprogram, packageName } = getMiniProgramInfo(fname);
  const miniprogramRoot = pathProxy.resolve(
    NODE_MODULES,
    packageName,
    miniprogram,
  );
  const relativePath = fname.replace(miniprogramRoot + '/', '');
  const target = pathProxy.resolve(
    getConfig().dist,
    MINI_PROGRAM_NPM,
    packageName,
    relativePath,
  );
  return target;
};
