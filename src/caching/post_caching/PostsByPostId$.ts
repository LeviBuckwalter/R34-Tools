import { Post } from "../../classes/Post.ts";
import { Cache } from "../../../Cache/classes/Cache.ts";

/*
stores posts, indexed by postIds.
*/

export const PostsByPostId$: Cache<Post> = new Cache("PostsByPostId$", 50000, [Post], true)