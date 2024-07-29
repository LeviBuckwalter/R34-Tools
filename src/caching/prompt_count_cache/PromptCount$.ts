import { Cache } from "cache/classes/Cache.ts"
import { caches } from "../../globals.ts";

export const PromptCount$: Cache<number> = new Cache("PromptCount$", 50000)
caches.push(PromptCount$)