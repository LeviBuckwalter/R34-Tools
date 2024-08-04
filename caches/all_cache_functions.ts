import { General$ } from "./General$.ts";
import {postsApi} from "../general_functions/API_access/posts.ts"
import { PostsByPostId$ } from "./post_caching/PostsByPostId$.ts";
import { PostIdsBySearch$ } from "./post_caching/PostIdsBySearch$.ts";

export async function resetAnchor(): Promise<void> {
    General$.store("maxId", (await postsApi("", 0, 1))[0].id)
    PostIdsBySearch$.clear()
    PostsByPostId$.clear()
}