import { FetchConductor } from "../objects/FetchConductor.js"

export class Search {
    constructor(prompt, pid, limit, json) {
        this.prompt = prompt
        this.pid = (pid === undefined) ? 0 : pid
        this.limit = (limit === undefined) ? 1000 : limit
        this.json = (json === undefined) ? true : json
    }

    get url() {
        return `https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&tags=${this.prompt}&pid=${this.pid}&limit=${this.limit}&json=${(this.json === true) ? 1 : 0}`
    }

    async fetch() {
        function myEgg() {
            //return httpGet(this.url)
        }
        return await FetchConductor.ticket(myEgg)
    }
}