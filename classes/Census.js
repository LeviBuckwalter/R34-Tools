export class Census {
    constructor(posts) {
        this.counts = {}
        this.size = 0
        for (let post of posts) {
            this.size++
            for (let tag of post.tags.values()) {
                if (this.counts.hasOwnProperty(tag)) {
                    this.counts[tag]++
                } else {
                    this.counts[tag] = 1
                }
            }
        }
    }

    amt(tag) {
        if (this.counts.hasOwnProperty(tag)) {
            return this.counts[tag]
        } else {
            return 0
        }
    }
}