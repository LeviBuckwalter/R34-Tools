export class FetchConductor {
    constructor(amtChains) {
        this.amtChains = amtChains
        this.chains = []
        for (let n = 0; n < this.amtChains; n++) {
            this.chains.push({ topLink: Promise.resolve(), links: 0 })
        }
    }
    shortestChain() {
        let sc = this.chains[0]
        for (let chain of this.chains) {
            if (chain.links < sc.links) {
                sc = chain
            }
        }
        return sc
    }
    normalizeChains() {
        const fewestLinks = this.shortestChain().links
        for (let chain of this.chains) {
            chain.links -= fewestLinks
        }
    }
    ticket(egg) {
        const sc = this.shortestChain()
        sc.links++
        async function retThunk() {
            await sc.topLink
            return await egg()
        }
        let ret = retThunk()
        sc.topLink = ret

        if (Math.random() < 0.01) {
            this.normalizeChains()
        }

        return ret
    }
}