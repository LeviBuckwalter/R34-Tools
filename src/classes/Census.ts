import { Post } from "./Post.ts"

export class Census {
    counts: Map<string, number>
    size: number

    constructor(given: Post[] | {counts: Map<string, number>, size: number}) {
        if (Array.isArray(given)) {
            //assuming you're given an array of posts:
            this.counts = new Map()
            this.size = 0
            for (const post of given) {
                this.size++
                for (const tag of post.tags.values()) {
                    if (this.counts.has(tag)) {
                        this.counts.set(tag, this.counts.get(tag)!+1)
                    } else {
                        this.counts.set(tag, 1)
                    }
                }
            }
        } else {
            this.counts = given.counts
            this.size = given.size
        }
    }

    count(tag: string): number {
        if (this.counts.has(tag)) {
            return this.counts.get(tag)!
        } else {
            return 0
        }
    }

    percent(tag: string): number {
        if (this.counts.has(tag)) {
            return this.counts.get(tag)!/this.size
        } else {
            return 0
        }
    }

    toArray(amtTags?: number): {tag: string, count: number}[] {
        const ret: {tag: string, count: number}[] = []
        for (const [tag, count] of this.counts.entries()) {
            ret.push({tag: tag, count: count})
        }
        ret.sort(function(a, b) {
            return b.count - a.count
        })
        
        if (amtTags) {
            return ret.slice(0, amtTags)
        } else {
            return ret
        }
    }

    toSeed(): {counts: Map<string, number>, size: number} {
        return {counts: this.counts, size: this.size}
    }
}