import { General$ } from "../../caches/General$.ts";
import {postsApi} from "../API_access/posts.ts"
import { PostsByPostId$ } from "../../caches/post_caches/PostsByPostId$.ts";
import { PostIdsBySearch$ } from "../../caches/post_caches/PostIdsBySearch$.ts";
import { caches } from "../../globals.ts";

export async function saveAll(): Promise<void> {
    for (const cache of caches) {
        await cache.save()
    }
}
export async function loadAll(): Promise<void> {
    for (const cache of caches) {
        await cache.load()
    }
}

export async function resetAnchor(): Promise<void> {
    General$.store("maxId", (await postsApi("", 0, 1))[0].id)
    PostIdsBySearch$.clear()
    PostsByPostId$.clear()
    await saveAll()
}