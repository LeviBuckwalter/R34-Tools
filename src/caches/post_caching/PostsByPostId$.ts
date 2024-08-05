import { Post } from "../../classes/Post"
import { Cache } from "cache-tools/src/classes/Cache"

/*
stores posts, indexed by postIds.
*/

export const PostsByPostId$: Cache<Post> = new Cache("PostsByPostId$", 50000)
PostsByPostId$.makeKey = function(postId: number): string {
    return `${postId}`
}