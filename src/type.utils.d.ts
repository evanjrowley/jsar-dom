export type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? true : false;

export type NotEqual<X, Y> = true extends Equal<X, Y> ? false : true;
export type Expect<T extends true> = T;

export type FindValidFields<T> = {
  [K in keyof T]: T[K] extends never ? never : K;
}[keyof T];

export type CheckStrictCompatible<StandardType, ImplType extends StandardType, Checked = {[k in keyof StandardType]: Equal<StandardType[k], ImplType[k]> extends true ? never : [StandardType[k], ImplType[k]]}> = Pick<Checked, FindValidFields<Checked>>;
