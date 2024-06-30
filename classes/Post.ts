import { Cache } from "cache/classes/Cache.ts"

export function test() {
    console.log(new Cache("myFirstCache", 10))
}

export class Post {
    constructor(
        public id: number,
        public tags: Set<string>,
        public score: number,
        public commentCount: number,
        public thumbnailUrl: string
    ) {}

    get siteUrl(): string {
        return `https://rule34.xxx/index.php?page=post&s=view&id=${this.id}`
    }

    toSeed(): [number, Set<string>, number, number, string] {
        return [this.id, this.tags, this.score, this.commentCount, this.thumbnailUrl]
    }
}