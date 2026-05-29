export const GO_MODULE_PATH_REGEX = /^[a-zA-Z0-9][a-zA-Z0-9._/\-~]*$/;

export function isValidImportPath(importPath: string): boolean {
  return importPath.length <= 300 && GO_MODULE_PATH_REGEX.test(importPath);
}
