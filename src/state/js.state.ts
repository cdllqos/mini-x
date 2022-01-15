export type JSImportMap = Map<string, Set<string>>;
const jsImportMap: JSImportMap = new Map();
const copiedLib = new Set<string>();

export const addJsImport = (
  packageName: string,
  importedIndentifier: string[],
) => {
  if (!jsImportMap.get(packageName)) {
    jsImportMap.set(packageName, new Set<string>());
  }

  const set = jsImportMap.get(packageName);
  importedIndentifier.forEach((i) => {
    set.add(i);
  });
};

export const getJsImports = (packageName: string) => {
  return jsImportMap.get(packageName);
};

export const hasCopiedLib = (libName: string) => {
  return copiedLib.has(libName);
};

export const setCopiedLib = (libName: string) => {
  copiedLib.add(libName);
};
