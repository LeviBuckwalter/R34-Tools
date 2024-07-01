import { FetchConductor } from "./classes/FetchConductor.ts"
import { Cache } from "cache/classes/Cache.ts"
import { Post } from "./classes/Post.ts";

export const FC: FetchConductor = new FetchConductor(10)
//the count cache houses individual percentages of tags ({percent: 0.2314, amtPosts: 1000}) indexed by prompt+tag
export const PercentCache: Cache<{percent: number, amtPosts: number, allPostsChecked: boolean}> = new Cache("PercentCache", 5)
export const GeneralCache: Cache<any> = new Cache("GeneralCache", Infinity)