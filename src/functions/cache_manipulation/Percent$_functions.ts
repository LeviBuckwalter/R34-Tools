import { Percent$ } from "../../caches/shortcut_caches/Percent$.ts";
import { Census } from "../../classes/Census.ts";
import { Post } from "../../classes/Post.ts";
import { getPosts } from "../end_user.ts";
import { normalizePrompt } from "../utility_functions.ts";


function Percent$Key(prompt: string, tag: string): string {
    return`${prompt.replace(" ", "_")}:${tag}`
}


export async function getCensus(prompt: string, amtPosts: number, cache?: boolean): Promise<Census> {
    const posts: Post[] = await getPosts(prompt, amtPosts)
    const census = new Census(posts)

    if (!cache) {
        return census
    }//else:

    const tagCounts: {tag: string, count: number}[] = census.toArray()
    for (const tagCount of tagCounts) {
        if (census.percent(tagCount.tag) > 0.05) {
            //add to Percent$
            Percent$.store(
                Percent$Key(prompt, tagCount.tag),
                {
                    percent: census.percent(tagCount.tag),
                    amtPosts: amtPosts,
                    allPostsChecked: census.size < amtPosts
                },
                1000*60*60*24*7
            )
        }
    }
    return census
}


export async function percentTags(
    tags: string[],
    prompt: string,
    amtPosts: number,
    cacheOthers?: boolean
): Promise<{[tag: string]: number}> {
    /*
    use this function to find the percent of any given tag in a sample of posts. Tell the function what tags you want to find the percents of (in the form of an array of strings), and then describe the sample of posts by saying what prompt you want to use to search, and how many posts you want checked.

    This function will then:
    1) search the percent cache to see if the answer to your question is already stored. If everything you need to know is in the percent cache, then this function will return you the information in the percent cache. (making sure that the size of the sample is at least as big as you specified, or the sample encompassed all the posts returned by your search prompt.)
    2) if not everything you wanted to know is in the percent cache, then the function will run the getCensus function to take count of the sample you described (sidenote: the getCensus function automatically stores the most popular tags in the percent cache). This function will then find the percent of each of your tags in the sample that was just taken and return that to you, making sure that every tag you asked for is stored in the percent cache.
    */

    // if (!(await validTags(tags))) {
    //     console.log(tags)
    //     throw new Error(`percentTags was given an invalid tag`)
    // }
    
    prompt = normalizePrompt(prompt)
    
    //create return object to be filled:
    const percents: {[tag: string]: number} = {}

    //are all tags able to be found in Percent$?
    let allAnswersInCache = true
    for (const tag of tags) {
        const Percent$Entry = Percent$.entries[Percent$Key(prompt, tag)]
        if (!Percent$Entry || (Percent$Entry.contents.amtPosts < amtPosts && !Percent$Entry.contents.allPostsChecked)) {
            allAnswersInCache = false
        }
    }
    
    //if so, return answers from cache:
    if (allAnswersInCache) {
        for (const tag of tags) {
            const Percent$Ret = Percent$.retrieve(Percent$Key(prompt, tag))!
            percents[tag] = Percent$Ret.percent
        }
        return percents
    } //else:
    
    //find percent data manually:
    const census = await getCensus(prompt, amtPosts, cacheOthers)
    for (const tag of tags) {
        //fill return object:
        percents[tag] = census.percent(tag)
        //store in cache in case getCensus didn't already:
        Percent$.store(
            Percent$Key(prompt, tag),
            {
                percent: census.percent(tag),
                amtPosts: amtPosts,
                allPostsChecked: census.size < amtPosts
            }
        )
    }

    //return filled percents object:
    return percents
}