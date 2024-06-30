import { Post } from "./Post.ts"

export class Census {
    counts: {[tag: string]: number}
    size: number

    constructor(posts: Post[]) {
        this.counts = {}
        this.size = 0
        for (let post of posts) {
            this.size++
            for (let tag of post.tags.values()) {
                if (tag in this.counts) {
                    this.counts[tag]++
                } else {
                    this.counts[tag] = 1
                }
            }
        }
    }

    count(tag: string): number {
        if (tag in this.counts) {
            return this.counts[tag]
        } else {
            return 0
        }
    }
}