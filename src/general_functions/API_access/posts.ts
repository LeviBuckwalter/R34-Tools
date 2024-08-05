import { Post } from "../../classes/Post"
import { processRawPosts } from "../utility_functions";
import { FC } from "./the_fetch_conductor"

export async function postsApi(prompt: string, pid: number, limit?: number): Promise<Post[]> {
    pid = (pid === undefined) ? 0 : pid
    limit = (limit === undefined) ? 1000 : limit
    const url = `https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&tags=${prompt}&pid=${pid}&limit=${limit}&json=1`

    async function myEgg(): Promise<Post[]> {
        const resp = await fetch(url)
        return processRawPosts(await resp.json())
        
    }
    const ret = await FC.ticket(myEgg)
    return ret
}