import { Post } from "../../classes/Post.ts";
import { Cache } from "cache/classes/Cache.ts";
import { caches } from "../../globals.ts";

/*
stores posts, indexed by postIds.
*/

export const PostsByPostId$: Cache<Post> = new Cache("PostsByPostId$", 30, [Post])

caches.push(PostsByPostId$)