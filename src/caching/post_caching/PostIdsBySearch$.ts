import { Cache } from "../../../Cache/classes/Cache.ts";
import { PostsByPostId$ } from "./PostsByPostId$.ts";

/*
stores the results of specific searches. This cache doesn't store any actual posts, just postIds. If someone asks for the results of a given search, and this cache has an entry for it, but not every post has an entry in the PostsByPostIds cache, then this cache will delete its entry and return undefined.

This cache's size is unlimited, because I'm assuming the PostsByPostIds cache will limit its own size, and thereby keep this cache from growing past a certain point.
*/

type postId = number
export const PostIdsBySearch$: Cache<postId[]> = new Cache("PostIdsBySearch$", Infinity)
PostIdsBySearch$.retrieve = function(key: string): number[] | undefined {
    const originalRetrieve: (key: string) => number[] | undefined = Cache.prototype.retrieve.bind(this)
    const originalRet = originalRetrieve(key)
    if (originalRet) {
        for (const id of originalRet) {
            const posts$Ret = PostsByPostId$.retrieve(`${id}`)
            if (!posts$Ret) {
                PostIdsBySearch$.discard(key)
                return undefined
            }
        }
    }
    return originalRet
}