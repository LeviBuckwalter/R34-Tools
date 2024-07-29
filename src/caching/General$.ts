import { Cache } from "cache/classes/Cache.ts"
import { caches } from "../globals.ts";

export const General$: Cache<any> = new Cache("General$", Infinity)

caches.push(General$)