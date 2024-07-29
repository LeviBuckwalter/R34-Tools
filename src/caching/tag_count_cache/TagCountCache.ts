import { Cache } from "cache/classes/Cache.ts"
import { caches } from "../../globals.ts"

export const Tag$: Cache<number> = new Cache("Tags$", 15000)
caches.push(Tag$)