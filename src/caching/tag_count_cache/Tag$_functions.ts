import { Tag$ } from "./TagCountCache.ts";
import { count } from "../../general_functions/API_access/tags.ts";

export async function countWithCache(tag: string): Promise<number> {
    const key = tag
    const Tag$Ret = Tag$.retrieve(key)
    if (Tag$Ret) {
        return Tag$Ret
    }//else
    const c = count(tag)
    Tag$.store(key, await c, 1000*60*60*24)
    return await c
}