import { FetchConductor } from "./classes/FetchConductor.ts"
import { Cache } from "cache/classes/Cache.ts"
import { Post } from "./classes/Post.ts";

export const FC: FetchConductor = new FetchConductor(10)
export const PostCache: Cache<{refs: number, post: Post}> = new Cache("PostCache", Infinity, [Post])
export const SearchCache: Cache<{prompt: string, pid: number, postIds: number[]}> = new Cache("SearchCache", 1, [Post])
const originalDiscard: (key: string) => void = SearchCache.discard
SearchCache.discard = function(key: string): void {
    const postIds = this.entries[key].contents.postIds
    for (const id of postIds) {
        const PCEntry = PostCache.entries[id].contents
        PCEntry.refs--
        if (PCEntry.refs <= 0) {
            PostCache.discard(`${id}`)
        }
    }
    originalDiscard(key)
}
export const GeneralCache: Cache<any> = new Cache("GeneralCache", Infinity)