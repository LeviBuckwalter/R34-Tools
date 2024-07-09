import { Percent$ } from "../../caches/shortcut_caches/Percent$.ts";
import { Census } from "../../classes/Census.ts";
import { Post } from "../../classes/Post.ts";
import { getPosts } from "../end_user.ts";
import { normalizePrompt } from "../utility_functions.ts";

function Percent$Key(prompt: string, tag: string): string {
    return`${prompt.replace(" ", "_")}:${tag}`
}


export async function percentTags(
    tags: string[],
    prompt: string,
    amtPosts: number
): Promise<{[tag: string]: number}> {
    
    // if (!(await validTags(tags))) {
    //     console.log(tags)
    //     throw new Error(`percentTags was given an invalid tag`)
    // }
    
    prompt = normalizePrompt(prompt)
    
    
    //create return object to be filled:
    const percents: {[tag: string]: number} = {}

    //check Percent$ for previous data:
    const toDoTags: string[] = []
    for (const tag of tags) {
        const Percents$Ret = Percent$.retrieve(Percent$Key(prompt, tag))
        if (Percents$Ret && (Percents$Ret.amtPosts >= amtPosts || Percents$Ret.allPostsChecked)) {
            percents[tag] = Percents$Ret.percent
        } else {
            toDoTags.push(tag)
        }
    }

    //has every tag been filled in?
    if (toDoTags.length === 0) {
        return percents
    } //else:
    
    //find percent data manually:
    const posts = await getPosts(prompt, amtPosts)
    const counts: {[tag: string]: number} = {}
    for (const tag of toDoTags) {
        counts[tag] = 0
    }
    for (const post of posts) {
        for (const toDoTag of toDoTags) {
            if (post.tags.has(toDoTag)) {
                counts[toDoTag]++
            }
        }
    }

    //store newfound percent data:
    const allPostsChecked = posts.length < amtPosts
    for (const tag of toDoTags) {
        percents[tag] = counts[tag]/posts.length
        Percent$.store(
            Percent$Key(prompt, tag),
            {
                percent: percents[tag],
                amtPosts: posts.length,
                allPostsChecked: allPostsChecked
            },
            1000*60*60*24*7
        )
    }
    await Percent$.save()
    
    //return filled percents object:
    return percents
}


export async function getCensus(prompt: string, amtPosts: number): Promise<Census> {
    const posts: Post[] = await getPosts(prompt, amtPosts)
    const census = new Census(posts)

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