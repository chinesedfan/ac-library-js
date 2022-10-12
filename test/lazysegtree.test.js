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
    it('Sum', () => {
        const n = 10
        const s = new LazySegTree(n, {
            op: (a, b) => [a[0] + b[0], a[1] + b[1]],
            e: () => [0, 0], // val, len
            mapping: (f, a) => [f * a[1] + a[0], a[1]],
            composition: (fa, fb) => fa + fb,
            id: () => 0,
        })
        for (let i = 0; i < n; i++) {
            s.set(i, [0, 1])
        }
        s.applyRange(0, n, 5)
        for (let l = 0; l <= n; l++) {
            for (let r = l; r <= n; r++) {
                expect(s.prod(l, r)[0]).toEqual((r - l) * 5)
            }
        }
    })
    it('Max', () => {
        const n = 10
        const s = new LazySegTree(n, {
            op: Math.max,
            e: () => -Infinity,
            mapping: Math.max,
            composition: Math.max,
            id: () => -Infinity,
        })
        for (let i = 0; i < n; i++) {
            s.set(i, i)
        }
        for (let l = 0; l <= n; l++) {
            for (let r = l; r <= n; r++) {
                expect(s.prod(l, r)).toEqual(l < r ? r - 1 : -Infinity)
            }
        }
    })
    it('Min', () => {
        const n = 10
        const s = new LazySegTree(n, {
            op: Math.min,
            e: () => Infinity,
            mapping: Math.min,
            composition: Math.min,
            id: () => Infinity,
        })
        for (let i = 0; i < n; i++) {
            s.set(i, i)
        }
        for (let l = 0; l <= n; l++) {
            for (let r = l; r <= n; r++) {
                expect(s.prod(l, r)).toEqual(l < r ? l : Infinity)
            }
        }
    })
    it('MinPos', () => {
        const n = 10
        const fmin = (a, b) => {
            return a[0] <= b[0] ? a : b
        }
        const s = new LazySegTree(n, {
            op: fmin,
            e: () => [Infinity, -1],
            mapping: fmin,
            composition: fmin,
            id: () => [Infinity, -1],
        })
        for (let i = 0; i < n; i++) {
            s.set(i, [i, i]) // [value, position]
        }
        for (let l = 0; l <= n; l++) {
            for (let r = l; r <= n; r++) {
                expect(s.prod(l, r)).toEqual(l < r ? [l, l] : [Infinity, -1])
            }
        }
    })
})
