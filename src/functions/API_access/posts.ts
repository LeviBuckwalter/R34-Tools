import { FetchConductor } from "../../classes/FetchConductor.ts";
import { Post } from "../../classes/Post.ts";
import { processRawPosts } from "../utility_functions.ts";

const FC: FetchConductor = new FetchConductor(10)
export async function postsApi(prompt: string, pid: number, limit?: number, json?: boolean): Promise<Post[]> {
    pid = (pid === undefined) ? 0 : pid
    limit = (limit === undefined) ? 1000 : limit
    json = (json === undefined) ? true : json
    const url = `https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&tags=${prompt}&pid=${pid}&limit=${limit}&json=${(json === true) ? 1 : 0}`

    async function myEgg(): Promise<Post[]> {
        const resp = await fetch(url)
        return processRawPosts(await resp.json())
        
    }
    const ret = await FC.ticket(myEgg)
    return ret
}