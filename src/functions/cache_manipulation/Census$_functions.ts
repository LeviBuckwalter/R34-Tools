import { Census$ } from "../../caches/shortcut_caches/Census$.ts";
import { Census } from "../../classes/Census.ts";
import { Post } from "../../classes/Post.ts";
import { getPosts } from "../end_user.ts";

export async function getCensus(prompt: string, amtPosts: number): Promise<Census> {
    const Census$Key = prompt.replace(" ", "-")
    const Census$Ret = Census$.retrieve(Census$Key)
    if (Census$Ret && Census$Ret.size >= amtPosts) {
        return Census$Ret
    } //else:

    const posts: Post[] = await getPosts(prompt, amtPosts)
    const census = new Census(posts)
    Census$.store(Census$Key, census, 1000*60*60*24*3.5)
    return census
}