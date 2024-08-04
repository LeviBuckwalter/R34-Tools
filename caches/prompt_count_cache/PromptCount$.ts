import { Cache } from "cache-tools/classes/Cache.ts"
import { normalizePrompt } from "../../general_functions/utility_functions.ts";

export const PromptCount$: Cache<number> = new Cache("PromptCount$", 50000)
PromptCount$.makeKey = function(prompt: string): string {
    prompt = normalizePrompt(prompt)
    const key = prompt.replace(" ", "-")
    return key
}