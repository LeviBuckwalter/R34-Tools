import { FC } from "../global variables.js"

export class Search {
    constructor(prompt, pid, limit, json) {
        this.prompt = (prompt === undefined) ? "" : prompt
        this.pid = (pid === undefined) ? 0 : pid
        this.limit = (limit === undefined) ? 1000 : limit
        this.json = (json === undefined) ? true : json
    }

    get url() {
        return `https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&tags=${this.prompt}&pid=${this.pid}&limit=${this.limit}&json=${(this.json === true) ? 1 : 0}`
    }

    async fetch() {
        const url = this.url
        async function myEgg() {
            const resp = await fetch(url)
            return resp.json()
        }
        return await FC.ticket(myEgg)
    }
}