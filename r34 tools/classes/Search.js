import { FetchConductor } from "../objects/FetchConductor.js"

export class Search {
    constructor(prompt, pid, limit) {
        this.prompt = prompt
        this.pid = pid
        this.limit = limit
    }

    get url() {
        return `www.somethingsomething.com/search=${this.prompt}&pid=${this.pid}`
    }

    async fetch() {
        function myEgg() {
            //return httpGet(this.url)
        }
        return await FetchConductor.ticket(myEgg)
    }
}