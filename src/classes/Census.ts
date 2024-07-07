import { Post } from "./Post.ts"

export class Census {
    counts: {[tag: string]: number}
    size: number

    constructor(given: Post[] | {counts: {[tag: string]: number}, size: number}) {
        if (Array.isArray(given)) {
            this.counts = {}
            this.size = 0
            for (const post of given) {
                this.size++
                for (const tag of post.tags.values()) {
                    if (tag in this.counts) {
                        this.counts[tag]++
                    } else {
                        this.counts[tag] = 1
                    }
                }
            }
        } else {
            this.counts = given.counts
            this.size = given.size
        }
    }

    count(tag: string): number {
        if (tag in this.counts) {
            return this.counts[tag]
        } else {
            return 0
        }
    }

    percent(tag: string): number {
        if (tag in this.counts) {
            return this.counts[tag]/this.size
        } else {
            return 0
        }
    }

    toArray(amtTags?: number): {tag: string, count: number}[] {
        const tags: string[] = Object.keys(this.counts)
        const ret: {tag: string, count: number}[] = []
        for (const tag of tags) {
            ret.push({tag: tag, count: this.counts[tag]})
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

    toSeed(): {counts: {[tag: string]: number}, size: number} {
        return {counts: this.counts, size: this.size}
    }
}