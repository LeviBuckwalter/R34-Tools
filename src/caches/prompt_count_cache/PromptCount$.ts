import { Cache } from "../../../node_modules/cache-tools/src/classes/Cache.js"
import { normalizePrompt } from "../../functions/general_functions/utility_functions.js"

export const PromptCount$: Cache<number> = new Cache("PromptCount$", 50000)
PromptCount$.makeKey = function(prompt: string): string {
    prompt = normalizePrompt(prompt)
    const key = prompt.replace(" ", "-")
    return key
}