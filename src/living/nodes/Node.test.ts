import type { CheckStrictCompatible, Equal, Expect } from "../../type.utils";
import { NodeImpl } from './Node';

type IncompatibleFields = CheckStrictCompatible<Node, NodeImpl>;

type cases = [
  Expect<Equal<{}, IncompatibleFields>>,
];
