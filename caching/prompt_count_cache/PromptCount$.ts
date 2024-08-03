import { Cache } from "../../Cache/classes/Cache.ts"

export const PromptCount$: Cache<number> = new Cache("PromptCount$", 50000)
