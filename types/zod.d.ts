declare module "zod" {
  export const z: {
    object: (...schema: any[]) => any;
    record: (...schema: any[]) => any;
    string: (...args: any[]) => any;
    any: (...args: any[]) => any;
    enum: (...values: any[]) => any;
  };
}
