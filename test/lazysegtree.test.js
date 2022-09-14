const { LazySegTree } = require('lazysegtree')

const segOptions = {
    op: Math.max,
    e: () => -1e9,
    mapping: (a, b) => a + b,
    composition: (a, b) => a + b,
    id: () => 0,
}

describe('LazySegTree', () => {
    it('Zero', () => {
        const s1 = new LazySegTree(0, segOptions)
        expect(s1.allProd()).toBe(-1e9)
        const s2 = new LazySegTree(10, segOptions)
        expect(s2.allProd()).toBe(-1e9)
    })
    it('Naive', () => {
        for (let n = 0; n <= 50; n++) {
            const seg = new LazySegTree(n, segOptions)
            const p = Array(n)
            for (let i = 0; i < n; i++) {
                p[i] = (i * i + 100) % 31
                seg.set(i, p[i])
            }
            for (let l = 0; l <= n; l++) {
                for (let r = l; r <= n; r++) {
                    let e = -1e9
                    for (let i = l; i < r; i++) {
                        e = Math.max(e, p[i])
                    }
                    expect(seg.prod(l, r)).toEqual(e)
                }
            }
        }
    })
    it('Usage', () => {
        const seg = new LazySegTree(Array(10).fill(0), segOptions)
        expect(seg.allProd()).toEqual(0)
        seg.applyRange(0, 3, 5)
        expect(seg.allProd()).toEqual(5)
        seg.apply(2, -10)
        expect(seg.prod(2, 3)).toEqual(-5)
        expect(seg.prod(2, 4)).toEqual(0)
    })
})
