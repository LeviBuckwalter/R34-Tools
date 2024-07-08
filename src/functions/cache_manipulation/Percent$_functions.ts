import { Percent$ } from "../../caches/shortcut_caches/Percent$.ts";
import { getPosts } from "../end_user.ts";
import { normalizePrompt } from "../utility_functions.ts";


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
    function key(tag: string): string {
        return`${prompt.replace(" ", "_")}:${tag}`
    }
    
    //create return object to be filled:
    const percents: {[tag: string]: number} = {}

    //check Percent$ for previous data:
    const toDoTags: string[] = []
    for (const tag of tags) {
        const Percents$Ret = Percent$.retrieve(key(tag))
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
            key(tag),
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
