import * as functions from "./functions.ts"
import { Cache } from "cache/classes/Cache.ts"
import { AsyncFunctionCache } from "cache/classes/FunctionCache/Async.ts"
import { Census } from "./classes/Census.ts"

export const GeneralCache: Cache<any> = new Cache("GeneralCache", Infinity)
export const PercentCache: Cache<{percent: number, amtPosts: number, allPostsChecked: boolean}> = new Cache("PercentCache", 5)
export const ValidTagFC: AsyncFunctionCache<(tag: string) => Promise<boolean>> = new AsyncFunctionCache("ValidTags", functions.validTag, 5, [], 1000*60*60*24*7*2)
export const GetCensusFC: AsyncFunctionCache<(prompt: string, amtPosts: number) => Promise<Census>> = new AsyncFunctionCache("GetCensus", functions.getCensus, 5, [Census], 1000*60*60*24*7)