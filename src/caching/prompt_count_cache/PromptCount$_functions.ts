import { getPosts } from "../../general_functions/end_user.ts";
import { countWithCache } from "../../../outdated_scripts/tag_count_cache/Tag$_functions.ts";
import { idToTs, tsToId } from "../../general_functions/id_timestamp_conversion.ts";
import { postsApi } from "../../general_functions/API_access/posts.ts";
import { FC } from "../../general_functions/API_access/the_fetch_conductor.ts";
import { normalizePrompt } from "../../general_functions/utility_functions.ts";
import { PromptCount$ } from "./PromptCount$.ts";

export async function getCount(prompt: string, readFromCache?: boolean, storeInCache?: boolean): Promise<number> {
    prompt = normalizePrompt(prompt)

    const cacheKey = prompt.replace(" ", "-")
    if (readFromCache) {
        const pc$Ret = PromptCount$.retrieve(cacheKey)
        if (pc$Ret) {
            return pc$Ret
        }
    }

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
        PromptCount$.store(cacheKey, ret, 1000*60*60*24*7)
        return ret
    } else {
        return ret
    }
}