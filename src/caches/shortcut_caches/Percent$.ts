import { Cache } from "cache/classes/Cache.ts"
import { caches } from "../../globals.ts";

type Percent$Entry = {
    percent: number,
    amtPosts: number,
    allPostsChecked: boolean
}
export const Percents$: Cache<Percent$Entry> = new Cache("Percent$", 5)
caches.push(Percents$)