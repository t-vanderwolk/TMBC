export type JsonPrimitive = string | number | boolean | null;
export type JsonArray = JsonValue[];
export type JsonMap = Record<string, JsonValue>;
export type JsonValue = JsonPrimitive | JsonArray | JsonMap;
