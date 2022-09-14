const { SegTree } = require('segtree')

function op(a, b) {
    expect(a === '$' || b === '$' || a <= b).toBe(true)
    if (a === '$') return b
    if (b === '$') return a
    return a + b
}
function e() {
    return '$'
}

class NaiveSegTree {
    constructor(nOrArray, options) {
        const { op, e } = options
        const d = Array.isArray(nOrArray) ? nOrArray : Array(nOrArray).fill(0).map(() => e())
        this.n = d.length
        this.d = d
        this.op = op
        this.e = e
    }
    set(p, x) {
        this.d[p] = x
    }
    get(p) {
        return this.d[p]
    }
    prod(l, r) {
        let sum = this.e()
        for (let i = l; i < r; i++) {
            sum = op(sum, this.d[i])
        }
        return sum
    }
    allProd() {
        return this.prod(0, this.n)
    }
    maxRight(l, f) {
        const { n, d, op, e } = this
        let sum = e()
        for (let i = l; i < n; i++) {
            sum = op(sum, d[i])
            if (!f(sum)) return i
        }
        return n
    }
    minLeft(r, f) {
        const { d, op, e } = this
        let sum = e()
        for (let i = r - 1; i >= 0; i--) {
            sum = op(d[i], sum)
            if (!f(sum)) return i + 1
        }
        return 0
    }
}

describe('SegTree', () => {
    it('Zero', () => {
        const s = new SegTree(0, { op, e })
        expect(s.allProd()).toBe('$')
    })
    it('One', () => {
        const s = new SegTree(1, { op, e })
        expect(s.allProd()).toBe('$')
        expect(s.get(0)).toBe('$')
        expect(s.prod(0, 1)).toBe('$')
        s.set(0, 'dummy')
        expect(s.get(0)).toBe('dummy')
        expect(s.prod(0, 0)).toBe('$')
        expect(s.prod(0, 1)).toBe('dummy')
        expect(s.prod(1, 1)).toBe('$')
    })
    it.skip('CompareNaive', () => {
        let y
        function leq_y(x) {
            return x.length <= y.length
        }
        for (let n = 0; n < 30; n++) {
            const seg0 = new NaiveSegTree(n, { op, e })
            const seg1 = new SegTree(n, { op, e })
            for (let i = 0; i < n; i++) {
                const s = String.fromCharCode('a'.charCodeAt(0) + i)
                seg0.set(i, s)
                seg1.set(i, s)
            }

            for (let l = 0; l <= n; l++) {
                for (let r = l; r <= n; r++) {
                    expect(seg1.prod(l, r)).toEqual(seg0.prod(l, r))
                }
            }

            for (let l = 0; l <= n; l++) {
                for (let r = l; r <= n; r++) {
                    y = seg1.prod(l, r)
                    expect(seg1.maxRight(l, leq_y)).toEqual(seg0.maxRight(l, leq_y))
                }
            }

            for (let r = 0; r <= n; r++) {
                for (let l = 0; l <= r; l++) {
                    y = seg1.prod(l, r)
                    expect(seg1.minLeft(r, leq_y)).toEqual(seg0.minLeft(r, leq_y))
                }
            }
        }
    })
    it('Sum', () => {
        const n = 10
        const s = new SegTree(n, {
            op: (a, b) => a + b,
            e: () => 0,
        })
        for (let i = 0; i < n; i++) {
            s.set(i, i)
        }
        for (let l = 0; l <= n; l++) {
            for (let r = l; r <= n; r++) {
                expect(s.prod(l, r)).toEqual(Math.max(0, l + r - 1) * (r - l) / 2)
            }
        }
    })
    it('Max', () => {
        const n = 10
        const s = new SegTree(n, {
            op: (a, b) => Math.max(a, b),
            e: () => -Infinity,
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
        const s = new SegTree(n, {
            op: (a, b) => Math.min(a, b),
            e: () => Infinity,
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
        const s = new SegTree(n, {
            op: (a, b) => {
                return a[0] <= b[0] ? a : b
            },
            e: () => [Infinity, -1],
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
