import { Storage } from "shared/storage/schema";
import { localKeys } from "../core";

export default (items: Storage): void => expect(Object.keys(items)).toEqual(localKeys);
