declare module "zod" {
  export const z: {
    object: (...schema: any[]) => any;
    record: (...schema: any[]) => any;
    string: (...args: any[]) => any;
    any: (...args: any[]) => any;
    enum: (...values: any[]) => any;
    literal: (...value: any[]) => any;
    number: (...args: any[]) => any;
    array: (...args: any[]) => any;
    union: (schemas: any[]) => any;
    boolean: (...args: any[]) => any;
  };
}
