import {
  ExportAllDeclaration,
  ImportDeclaration,
  ModuleDeclaration,
  NamedImportSpecifier,
  transformFileSync,
} from '@swc/core';
import { MINI_PROGRAM_NPM, NODE_MODULES } from '@src/constrants';
import { ThirdImports, VoidCallback } from '@src/models';

import { Visitor } from '@swc/core/Visitor.js';
import { build } from 'esbuild';
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

class GetThirdImportVisitor extends Visitor {
  private callback: VoidCallback;
  private fname: string;

  constructor(fname: string, callback: VoidCallback) {
    super();
    this.callback = callback;
    this.fname = fname;
  }

  visitImportDeclaration(n: ImportDeclaration): ImportDeclaration {
    const packageName = n.source.value;
    if (this.fname.includes(NODE_MODULES) || packageName.startsWith('.')) {
      return n;
    }

    const imports = n.specifiers
      .filter((m) => m.type === 'ImportSpecifier')
      .map((i: NamedImportSpecifier) => {
        if (i.imported) {
          return i.imported.value;
        }
        return i.local.value;
      });

    this.callback(packageName, imports);
    return n;
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
      target: 'es2022',
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
    getConfig().miniprogramTarget,
    MINI_PROGRAM_NPM,
    packageName,
    relativePath,
  );
  return target;
};

export const getThirdImports = (fname: string): ThirdImports[] => {
  const importsMap: ThirdImports[] = [];
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
      new GetThirdImportVisitor(
        fname,
        (packageName: string, imports: string[]) => {
          importsMap.push({
            packageName,
            identifiers: imports,
          });
        },
      ).visitProgram(m),
  });
  return importsMap;
};

export const getExportContent = (
  packageName: string,
  identifiers: Set<string>,
) => {
  if (!Array.from(identifiers.values()).length) {
    const importContent = `import lib from '${packageName}';\n`;
    const exportContent = `export default lib\n`;
    return importContent + exportContent;
  }

  const importContent = Array.from(identifiers.values()).join(', ');
  const exportContent = Array.from(identifiers.values())
    .map((e) => {
      return `export { ${e} }\n`;
    })
    .join('');
  const tsContent =
    `import { ${importContent} } from '${packageName}';\n` + exportContent;
  return tsContent;
};

export const packThirdLib = (entry: string, outDir: string) => {
  build({
    entryPoints: [entry],
    bundle: true,
    outdir: outDir,
    platform: 'browser',
    format: 'esm',
  });
};
