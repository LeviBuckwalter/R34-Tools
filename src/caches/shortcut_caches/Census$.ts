import { Cache } from "cache/classes/Cache.ts";
import { Census } from "../../classes/Census.ts";
import { caches } from "../../globals.ts";

export const Census$: Cache<Census> = new Cache("Census$", 5, [Census])
caches.push(Census$)