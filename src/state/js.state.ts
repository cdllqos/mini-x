export type JSImportMap = Map<string, Set<string>>;
const jsImportMap: JSImportMap = new Map();

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
