export type EnumValues<T extends Record<string, string>> = T[keyof T];
