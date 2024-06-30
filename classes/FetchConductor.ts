type Chain = {
    topLink: Promise<any>
    links: number
}

export class FetchConductor {
    amtChains: number
    chains: Chain[]

    
    constructor(amtChains: number) {
        this.amtChains = amtChains
        this.chains = []
        for (let n = 1; n <= this.amtChains; n++) {
            this.chains.push({ topLink: Promise.resolve(), links: 0 })
        }
    }
    shortestChain(): Chain {
        let sc = this.chains[0]
        for (let chain of this.chains) {
            if (chain.links < sc.links) {
                sc = chain
            }
        }
        return sc
    }
    normalizeChains(): void {
        const fewestLinks = this.shortestChain().links
        for (let chain of this.chains) {
            chain.links -= fewestLinks
        }
    }
    ticket<T>(egg: () => Promise<T>): Promise<T> {
        const sc: Chain = this.shortestChain()
        sc.links++
        async function retThunk() {
            await sc.topLink
            return await egg()
        }
        const ret = retThunk()
        sc.topLink = ret

        if (Math.random() < 0.01) {
            this.normalizeChains()
        }

        return ret
    }
}