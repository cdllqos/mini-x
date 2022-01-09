type AnyObject = Record<string, any> | string | boolean;
export type VoidCallback = (...args: AnyObject[]) => void;

export interface MiniProgramInfo {
  packageName: string;
  miniprogram: string;
}
