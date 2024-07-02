import { FetchConductor } from "./classes/FetchConductor.ts"


export const FC: FetchConductor = new FetchConductor(10)
//the count cache houses individual percentages of tags ({percent: 0.2314, amtPosts: 1000}) indexed by prompt+tag
