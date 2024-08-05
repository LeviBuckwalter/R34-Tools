import { getPosts } from "../../general_functions/end_user"
import { idToTs, tsToId } from "../../general_functions/id_timestamp_conversion"
import { postsApi } from "../../general_functions/API_access/posts"
import { FC } from "../../general_functions/API_access/the_fetch_conductor"
import { normalizePrompt } from "../../general_functions/utility_functions"
import { PromptCount$ } from "./PromptCount$"

export async function getCount(
    prompt: string,
    options: {
        lookInCache?: boolean,
        storeInCache?: boolean
    }
): Promise<number> {
    const {lookInCache = true, storeInCache = true} = options
    
    const key = PromptCount$.makeKey(prompt)
    if (lookInCache) {
        const pc$Ret = PromptCount$.retrieve(key)
        if (pc$Ret) {
            return pc$Ret
        }
    }//else:

    const url = `https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&tags=${prompt}&pid=0&limit=1`
    async function myEgg(): Promise<string> {
        const resp = await fetch(url)
        return await resp.text()
    }
    const text: string | null = await FC.ticket(myEgg)
    const m = text.match(/<posts count="\d*/)
    let ret
    if (m === null) {
        throw new Error("posts count was not found in corpus")
    } else {
        ret = Number(m[0].replace(`<posts count="`, ""))
    }

    if (storeInCache) {
        PromptCount$.store(key, ret, 1000*60*60*24*7)
    }
    return ret
}