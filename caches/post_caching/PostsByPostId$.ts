import { Post } from "../../classes/Post.ts";
import { Cache } from "../../cache tools/classes/Cache.ts";

/*
stores posts, indexed by postIds.
*/

export const PostsByPostId$: Cache<Post> = new Cache("PostsByPostId$", 50000, [Post], true)
PostsByPostId$.makeKey = function(postId: number): string {
    return `${postId}`
}