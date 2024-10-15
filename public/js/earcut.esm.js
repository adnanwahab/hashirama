/**
 * Bundled by jsDelivr using Rollup v2.79.1 and Terser v5.19.2.
 * Original file: /npm/earcut@3.0.0/src/earcut.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
function e(e, n, x = 2) {
  const i = n && n.length;
  const o = i ? n[0] * x : e.length;
  let u = t(e, 0, o, x, !0);
  const c = [];
  if (!u || u.next === u.prev) return c;
  let y, v, s;
  if (
    (i &&
      (u = (function (e, n, r, x) {
        const i = [];
        for (let r = 0, o = n.length; r < o; r++) {
          const u = t(e, n[r] * x, r < o - 1 ? n[r + 1] * x : e.length, x, !1);
          u === u.next && (u.steiner = !0), i.push(p(u));
        }
        i.sort(l);
        for (let e = 0; e < i.length; e++) r = f(i[e], r);
        return r;
      })(e, n, u, x)),
    e.length > 80 * x)
  ) {
    (y = 1 / 0), (v = 1 / 0);
    let t = -1 / 0;
    let n = -1 / 0;
    for (let r = x; r < o; r += x) {
      const x = e[r];
      const i = e[r + 1];
      x < y && (y = x), i < v && (v = i), x > t && (t = x), i > n && (n = i);
    }
    (s = Math.max(t - y, n - v)), (s = s !== 0 ? 32767 / s : 0);
  }
  return r(u, c, x, y, v, s, 0), c;
}
function t(e, t, n, r, x) {
  let i;
  if (x === j(e, t, n, r) > 0)
    for (let x = t; x < n; x += r) i = z((x / r) | 0, e[x], e[x + 1], i);
  else
    for (let x = n - r; x >= t; x -= r) i = z((x / r) | 0, e[x], e[x + 1], i);
  return i && Z(i, i.next) && (b(i), (i = i.next)), i;
}
function n(e, t) {
  if (!e) return e;
  t || (t = e);
  let n;
  let r = e;
  do {
    if (((n = !1), r.steiner || (!Z(r, r.next) && h(r.prev, r, r.next) !== 0)))
      r = r.next;
    else {
      if ((b(r), (r = t = r.prev), r === r.next)) break;
      n = !0;
    }
  } while (n || r !== t);
  return t;
}
function r(e, t, l, f, c, p, v) {
  if (!e) return;
  !v &&
    p &&
    (function (e, t, n, r) {
      let x = e;
      do {
        x.z === 0 && (x.z = y(x.x, x.y, t, n, r)),
          (x.prevZ = x.prev),
          (x.nextZ = x.next),
          (x = x.next);
      } while (x !== e);
      (x.prevZ.nextZ = null),
        (x.prevZ = null),
        (function (e) {
          let t;
          let n = 1;
          do {
            let r;
            let x = e;
            e = null;
            let i = null;
            for (t = 0; x; ) {
              t++;
              let o = x;
              let u = 0;
              for (let e = 0; e < n && (u++, (o = o.nextZ), o); e++);
              let l = n;
              for (; u > 0 || (l > 0 && o); )
                u !== 0 && (l === 0 || !o || x.z <= o.z)
                  ? ((r = x), (x = x.nextZ), u--)
                  : ((r = o), (o = o.nextZ), l--),
                  i ? (i.nextZ = r) : (e = r),
                  (r.prevZ = i),
                  (i = r);
              x = o;
            }
            (i.nextZ = null), (n *= 2);
          } while (t > 1);
        })(x);
    })(e, f, c, p);
  let s = e;
  for (; e.prev !== e.next; ) {
    const y = e.prev;
    const h = e.next;
    if (p ? i(e, f, c, p) : x(e))
      t.push(y.i, e.i, h.i), b(e), (e = h.next), (s = h.next);
    else if ((e = h) === s) {
      v
        ? v === 1
          ? r((e = o(n(e), t)), t, l, f, c, p, 2)
          : v === 2 && u(e, t, l, f, c, p)
        : r(n(e), t, l, f, c, p, 1);
      break;
    }
  }
}
function x(e) {
  const t = e.prev;
  const n = e;
  const r = e.next;
  if (h(t, n, r) >= 0) return !1;
  const x = t.x;
  const i = n.x;
  const o = r.x;
  const u = t.y;
  const l = n.y;
  const f = r.y;
  const c = x < i ? (x < o ? x : o) : i < o ? i : o;
  const y = u < l ? (u < f ? u : f) : l < f ? l : f;
  const p = x > i ? (x > o ? x : o) : i > o ? i : o;
  const s = u > l ? (u > f ? u : f) : l > f ? l : f;
  let Z = r.next;
  for (; Z !== t; ) {
    if (
      Z.x >= c &&
      Z.x <= p &&
      Z.y >= y &&
      Z.y <= s &&
      v(x, u, i, l, o, f, Z.x, Z.y) &&
      h(Z.prev, Z, Z.next) >= 0
    )
      return !1;
    Z = Z.next;
  }
  return !0;
}
function i(e, t, n, r) {
  const x = e.prev;
  const i = e;
  const o = e.next;
  if (h(x, i, o) >= 0) return !1;
  const u = x.x;
  const l = i.x;
  const f = o.x;
  const c = x.y;
  const p = i.y;
  const s = o.y;
  const Z = u < l ? (u < f ? u : f) : l < f ? l : f;
  const a = c < p ? (c < s ? c : s) : p < s ? p : s;
  const d = u > l ? (u > f ? u : f) : l > f ? l : f;
  const g = c > p ? (c > s ? c : s) : p > s ? p : s;
  const w = y(Z, a, t, n, r);
  const M = y(d, g, t, n, r);
  let z = e.prevZ;
  let b = e.nextZ;
  for (; z && z.z >= w && b && b.z <= M; ) {
    if (
      z.x >= Z &&
      z.x <= d &&
      z.y >= a &&
      z.y <= g &&
      z !== x &&
      z !== o &&
      v(u, c, l, p, f, s, z.x, z.y) &&
      h(z.prev, z, z.next) >= 0
    )
      return !1;
    if (
      ((z = z.prevZ),
      b.x >= Z &&
        b.x <= d &&
        b.y >= a &&
        b.y <= g &&
        b !== x &&
        b !== o &&
        v(u, c, l, p, f, s, b.x, b.y) &&
        h(b.prev, b, b.next) >= 0)
    )
      return !1;
    b = b.nextZ;
  }
  for (; z && z.z >= w; ) {
    if (
      z.x >= Z &&
      z.x <= d &&
      z.y >= a &&
      z.y <= g &&
      z !== x &&
      z !== o &&
      v(u, c, l, p, f, s, z.x, z.y) &&
      h(z.prev, z, z.next) >= 0
    )
      return !1;
    z = z.prevZ;
  }
  for (; b && b.z <= M; ) {
    if (
      b.x >= Z &&
      b.x <= d &&
      b.y >= a &&
      b.y <= g &&
      b !== x &&
      b !== o &&
      v(u, c, l, p, f, s, b.x, b.y) &&
      h(b.prev, b, b.next) >= 0
    )
      return !1;
    b = b.nextZ;
  }
  return !0;
}
function o(e, t) {
  let r = e;
  do {
    const n = r.prev;
    const x = r.next.next;
    !Z(n, x) &&
      a(n, r, r.next, x) &&
      w(n, x) &&
      w(x, n) &&
      (t.push(n.i, r.i, x.i), b(r), b(r.next), (r = e = x)),
      (r = r.next);
  } while (r !== e);
  return n(r);
}
function u(e, t, x, i, o, u) {
  let l = e;
  do {
    let e = l.next.next;
    for (; e !== l.prev; ) {
      if (l.i !== e.i && s(l, e)) {
        let f = M(l, e);
        return (
          (l = n(l, l.next)),
          (f = n(f, f.next)),
          r(l, t, x, i, o, u, 0),
          void r(f, t, x, i, o, u, 0)
        );
      }
      e = e.next;
    }
    l = l.next;
  } while (l !== e);
}
function l(e, t) {
  return e.x - t.x;
}
function f(e, t) {
  const r = (function (e, t) {
    let n = t;
    const r = e.x;
    const x = e.y;
    let i;
    let o = -1 / 0;
    do {
      if (x <= n.y && x >= n.next.y && n.next.y !== n.y) {
        const e = n.x + ((x - n.y) * (n.next.x - n.x)) / (n.next.y - n.y);
        if (
          e <= r &&
          e > o &&
          ((o = e), (i = n.x < n.next.x ? n : n.next), e === r)
        )
          return i;
      }
      n = n.next;
    } while (n !== t);
    if (!i) return null;
    const u = i;
    const l = i.x;
    const f = i.y;
    let y = 1 / 0;
    n = i;
    do {
      if (
        r >= n.x &&
        n.x >= l &&
        r !== n.x &&
        v(x < f ? r : o, x, l, f, x < f ? o : r, x, n.x, n.y)
      ) {
        const t = Math.abs(x - n.y) / (r - n.x);
        w(n, e) &&
          (t < y || (t === y && (n.x > i.x || (n.x === i.x && c(i, n))))) &&
          ((i = n), (y = t));
      }
      n = n.next;
    } while (n !== u);
    return i;
  })(e, t);
  if (!r) return t;
  const x = M(r, e);
  return n(x, x.next), n(r, r.next);
}
function c(e, t) {
  return h(e.prev, e, t.prev) < 0 && h(t.next, e, e.next) < 0;
}
function y(e, t, n, r, x) {
  return (
    (e =
      1431655765 &
      ((e =
        858993459 &
        ((e =
          252645135 &
          ((e = 16711935 & ((e = ((e - n) * x) | 0) | (e << 8))) | (e << 4))) |
          (e << 2))) |
        (e << 1))) |
    ((t =
      1431655765 &
      ((t =
        858993459 &
        ((t =
          252645135 &
          ((t = 16711935 & ((t = ((t - r) * x) | 0) | (t << 8))) | (t << 4))) |
          (t << 2))) |
        (t << 1))) <<
      1)
  );
}
function p(e) {
  let t = e;
  let n = e;
  do {
    (t.x < n.x || (t.x === n.x && t.y < n.y)) && (n = t), (t = t.next);
  } while (t !== e);
  return n;
}
function v(e, t, n, r, x, i, o, u) {
  return (
    (x - o) * (t - u) >= (e - o) * (i - u) &&
    (e - o) * (r - u) >= (n - o) * (t - u) &&
    (n - o) * (i - u) >= (x - o) * (r - u)
  );
}
function s(e, t) {
  return (
    e.next.i !== t.i &&
    e.prev.i !== t.i &&
    !(function (e, t) {
      let n = e;
      do {
        if (
          n.i !== e.i &&
          n.next.i !== e.i &&
          n.i !== t.i &&
          n.next.i !== t.i &&
          a(n, n.next, e, t)
        )
          return !0;
        n = n.next;
      } while (n !== e);
      return !1;
    })(e, t) &&
    ((w(e, t) &&
      w(t, e) &&
      (function (e, t) {
        let n = e;
        let r = !1;
        const x = (e.x + t.x) / 2;
        const i = (e.y + t.y) / 2;
        do {
          n.y > i != n.next.y > i &&
            n.next.y !== n.y &&
            x < ((n.next.x - n.x) * (i - n.y)) / (n.next.y - n.y) + n.x &&
            (r = !r),
            (n = n.next);
        } while (n !== e);
        return r;
      })(e, t) &&
      (h(e.prev, e, t.prev) || h(e, t.prev, t))) ||
      (Z(e, t) && h(e.prev, e, e.next) > 0 && h(t.prev, t, t.next) > 0))
  );
}
function h(e, t, n) {
  return (t.y - e.y) * (n.x - t.x) - (t.x - e.x) * (n.y - t.y);
}
function Z(e, t) {
  return e.x === t.x && e.y === t.y;
}
function a(e, t, n, r) {
  const x = g(h(e, t, n));
  const i = g(h(e, t, r));
  const o = g(h(n, r, e));
  const u = g(h(n, r, t));
  return (
    (x !== i && o !== u) ||
    !(x !== 0 || !d(e, n, t)) ||
    !(i !== 0 || !d(e, r, t)) ||
    !(o !== 0 || !d(n, e, r)) ||
    !(u !== 0 || !d(n, t, r))
  );
}
function d(e, t, n) {
  return (
    t.x <= Math.max(e.x, n.x) &&
    t.x >= Math.min(e.x, n.x) &&
    t.y <= Math.max(e.y, n.y) &&
    t.y >= Math.min(e.y, n.y)
  );
}
function g(e) {
  return e > 0 ? 1 : e < 0 ? -1 : 0;
}
function w(e, t) {
  return h(e.prev, e, e.next) < 0
    ? h(e, t, e.next) >= 0 && h(e, e.prev, t) >= 0
    : h(e, t, e.prev) < 0 || h(e, e.next, t) < 0;
}
function M(e, t) {
  const n = m(e.i, e.x, e.y);
  const r = m(t.i, t.x, t.y);
  const x = e.next;
  const i = t.prev;
  return (
    (e.next = t),
    (t.prev = e),
    (n.next = x),
    (x.prev = n),
    (r.next = n),
    (n.prev = r),
    (i.next = r),
    (r.prev = i),
    r
  );
}
function z(e, t, n, r) {
  const x = m(e, t, n);
  return (
    r
      ? ((x.next = r.next), (x.prev = r), (r.next.prev = x), (r.next = x))
      : ((x.prev = x), (x.next = x)),
    x
  );
}
function b(e) {
  (e.next.prev = e.prev),
    (e.prev.next = e.next),
    e.prevZ && (e.prevZ.nextZ = e.nextZ),
    e.nextZ && (e.nextZ.prevZ = e.prevZ);
}
function m(e, t, n) {
  return {
    i: e,
    x: t,
    y: n,
    prev: null,
    next: null,
    z: 0,
    prevZ: null,
    nextZ: null,
    steiner: !1,
  };
}
function k(e, t, n, r) {
  const x = t && t.length;
  const i = x ? t[0] * n : e.length;
  let o = Math.abs(j(e, 0, i, n));
  if (x)
    for (let r = 0, x = t.length; r < x; r++) {
      const i = t[r] * n;
      const u = r < x - 1 ? t[r + 1] * n : e.length;
      o -= Math.abs(j(e, i, u, n));
    }
  let u = 0;
  for (let t = 0; t < r.length; t += 3) {
    const x = r[t] * n;
    const i = r[t + 1] * n;
    const o = r[t + 2] * n;
    u += Math.abs(
      (e[x] - e[o]) * (e[i + 1] - e[x + 1]) -
        (e[x] - e[i]) * (e[o + 1] - e[x + 1]),
    );
  }
  return o === 0 && u === 0 ? 0 : Math.abs((u - o) / o);
}
function j(e, t, n, r) {
  let x = 0;
  for (let i = t, o = n - r; i < n; i += r)
    (x += (e[o] - e[i]) * (e[i + 1] + e[o + 1])), (o = i);
  return x;
}
function q(e) {
  const t = [];
  const n = [];
  const r = e[0][0].length;
  let x = 0;
  let i = 0;
  for (const o of e) {
    for (const e of o) for (let n = 0; n < r; n++) t.push(e[n]);
    i && ((x += i), n.push(x)), (i = o.length);
  }
  return { vertices: t, holes: n, dimensions: r };
}
export { e as default, k as deviation, q as flatten };
// # sourceMappingURL=/sm/19b2e0b29da4ba866757a4f4949ed43657158c85b05a00988d0126ecb1a2aab9.map
