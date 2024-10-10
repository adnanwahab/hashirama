class hi {
  constructor() {
    (this.callbacks = {}), (this.callbacks.base = {});
  }
  on(e, t) {
    const i = this;
    return typeof e > "u" || e === ""
      ? (console.warn("wrong names"), !1)
      : typeof t > "u"
        ? (console.warn("wrong callback"), !1)
        : (this.resolveNames(e).forEach(function (n) {
            const s = i.resolveName(n);
            i.callbacks[s.namespace] instanceof Object ||
              (i.callbacks[s.namespace] = {}),
              i.callbacks[s.namespace][s.value] instanceof Array ||
                (i.callbacks[s.namespace][s.value] = []),
              i.callbacks[s.namespace][s.value].push(t);
          }),
          this);
  }
  off(e) {
    const t = this;
    return typeof e > "u" || e === ""
      ? (console.warn("wrong name"), !1)
      : (this.resolveNames(e).forEach(function (r) {
          const n = t.resolveName(r);
          if (n.namespace !== "base" && n.value === "")
            delete t.callbacks[n.namespace];
          else if (n.namespace === "base")
            for (const s in t.callbacks)
              t.callbacks[s] instanceof Object &&
                t.callbacks[s][n.value] instanceof Array &&
                (delete t.callbacks[s][n.value],
                Object.keys(t.callbacks[s]).length === 0 &&
                  delete t.callbacks[s]);
          else
            t.callbacks[n.namespace] instanceof Object &&
              t.callbacks[n.namespace][n.value] instanceof Array &&
              (delete t.callbacks[n.namespace][n.value],
              Object.keys(t.callbacks[n.namespace]).length === 0 &&
                delete t.callbacks[n.namespace]);
        }),
        this);
  }
  trigger(e, t) {
    if (typeof e > "u" || e === "") return console.warn("wrong name"), !1;
    const i = this;
    let r = null;
    const n = t instanceof Array ? t : [];
    let s = this.resolveNames(e);
    if (((s = this.resolveName(s[0])), s.namespace === "base"))
      for (const a in i.callbacks)
        i.callbacks[a] instanceof Object &&
          i.callbacks[a][s.value] instanceof Array &&
          i.callbacks[a][s.value].forEach(function (o) {
            o.apply(i, n);
          });
    else if (this.callbacks[s.namespace] instanceof Object) {
      if (s.value === "") return console.warn("wrong name"), this;
      i.callbacks[s.namespace][s.value].forEach(function (a) {
        a.apply(i, n);
      });
    }
    return r;
  }
  resolveNames(e) {
    let t = e;
    return (
      (t = t.replace(/[^a-zA-Z0-9 ,/.]/g, "")),
      (t = t.replace(/[,/]+/g, " ")),
      (t = t.split(" ")),
      t
    );
  }
  resolveName(e) {
    const t = {},
      i = e.split(".");
    return (
      (t.original = e),
      (t.value = i[0]),
      (t.namespace = "base"),
      i.length > 1 && i[1] !== "" && (t.namespace = i[1]),
      t
    );
  }
}
class rn extends hi {
  constructor() {
    super(),
      (this.viewport = {}),
      (this.$sizeViewport = document.createElement("div")),
      this.$sizeViewport.classList.add("sizes-viewport-dummy"),
      (this.$sizeViewport.style.width = "100vw"),
      (this.$sizeViewport.style.position = "absolute"),
      (this.$sizeViewport.style.top = 0),
      (this.$sizeViewport.style.left = 0),
      (this.$sizeViewport.style.pointerEvents = "none"),
      (this.$sizeViewport.style.backgroundColor = "red"),
      (this.$sizeViewport.style.zIndex = 999),
      (this.resize = this.resize.bind(this)),
      window.addEventListener("resize", this.resize),
      this.resize();
  }
  resize() {
    const e = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${e}px`),
      document.body.appendChild(this.$sizeViewport),
      (this.viewport.width = this.$sizeViewport.offsetWidth),
      (this.viewport.height = this.$sizeViewport.offsetHeight),
      document.body.removeChild(this.$sizeViewport),
      (this.width = window.innerWidth),
      (this.height = window.innerHeight),
      this.trigger("resize");
  }
}
class nn extends hi {
  constructor() {
    super(),
      (this.start = Date.now()),
      (this.current = this.start),
      (this.elapsed = 0),
      (this.delta = 16),
      (this.tick = this.tick.bind(this)),
      this.tick();
  }
  tick() {
    this.ticker = window.requestAnimationFrame(this.tick);
    const e = Date.now();
    (this.delta = e - this.current),
      (this.elapsed = e - this.start),
      (this.current = e),
      this.delta > 60 && (this.delta = 60),
      this.trigger("tick");
  }
  stop() {
    window.cancelAnimationFrame(this.ticker);
  }
}
var ci = {};
(function u(e, t, i, r) {
  var n = !!(
    e.Worker &&
    e.Blob &&
    e.Promise &&
    e.OffscreenCanvas &&
    e.OffscreenCanvasRenderingContext2D &&
    e.HTMLCanvasElement &&
    e.HTMLCanvasElement.prototype.transferControlToOffscreen &&
    e.URL &&
    e.URL.createObjectURL
  );
  function s() {}
  function a(m) {
    var p = t.exports.Promise,
      O = p !== void 0 ? p : e.Promise;
    return typeof O == "function" ? new O(m) : (m(s, s), null);
  }
  var o = (function () {
      var m = Math.floor(16.666666666666668),
        p,
        O,
        P = {},
        E = 0;
      return (
        typeof requestAnimationFrame == "function" &&
        typeof cancelAnimationFrame == "function"
          ? ((p = function (D) {
              var A = Math.random();
              return (
                (P[A] = requestAnimationFrame(function L(I) {
                  E === I || E + m - 1 < I
                    ? ((E = I), delete P[A], D())
                    : (P[A] = requestAnimationFrame(L));
                })),
                A
              );
            }),
            (O = function (D) {
              P[D] && cancelAnimationFrame(P[D]);
            }))
          : ((p = function (D) {
              return setTimeout(D, m);
            }),
            (O = function (D) {
              return clearTimeout(D);
            })),
        { frame: p, cancel: O }
      );
    })(),
    l = (function () {
      var m,
        p,
        O = {};
      function P(E) {
        function D(A, L) {
          E.postMessage({ options: A || {}, callback: L });
        }
        (E.init = function (L) {
          var I = L.transferControlToOffscreen();
          E.postMessage({ canvas: I }, [I]);
        }),
          (E.fire = function (L, I, ce) {
            if (p) return D(L, null), p;
            var z = Math.random().toString(36).slice(2);
            return (
              (p = a(function (Q) {
                function fe(B) {
                  B.data.callback === z &&
                    (delete O[z],
                    E.removeEventListener("message", fe),
                    (p = null),
                    ce(),
                    Q());
                }
                E.addEventListener("message", fe),
                  D(L, z),
                  (O[z] = fe.bind(null, { data: { callback: z } }));
              })),
              p
            );
          }),
          (E.reset = function () {
            E.postMessage({ reset: !0 });
            for (var L in O) O[L](), delete O[L];
          });
      }
      return function () {
        if (m) return m;
        if (!i && n) {
          var E = [
            "var CONFETTI, SIZE = {}, module = {};",
            "(" + u.toString() + ")(this, module, true, SIZE);",
            "onmessage = function(msg) {",
            "  if (msg.data.options) {",
            "    CONFETTI(msg.data.options).then(function () {",
            "      if (msg.data.callback) {",
            "        postMessage({ callback: msg.data.callback });",
            "      }",
            "    });",
            "  } else if (msg.data.reset) {",
            "    CONFETTI && CONFETTI.reset();",
            "  } else if (msg.data.resize) {",
            "    SIZE.width = msg.data.resize.width;",
            "    SIZE.height = msg.data.resize.height;",
            "  } else if (msg.data.canvas) {",
            "    SIZE.width = msg.data.canvas.width;",
            "    SIZE.height = msg.data.canvas.height;",
            "    CONFETTI = module.exports.create(msg.data.canvas);",
            "  }",
            "}",
          ].join(`
`);
          try {
            m = new Worker(URL.createObjectURL(new Blob([E])));
          } catch (D) {
            return (
              typeof console !== void 0 &&
                typeof console.warn == "function" &&
                console.warn("🎊 Could not load worker", D),
              null
            );
          }
          P(m);
        }
        return m;
      };
    })(),
    h = {
      particleCount: 50,
      angle: 90,
      spread: 45,
      startVelocity: 45,
      decay: 0.9,
      gravity: 1,
      drift: 0,
      ticks: 200,
      x: 0.5,
      y: 0.5,
      shapes: ["square", "circle"],
      zIndex: 100,
      colors: [
        "#26ccff",
        "#a25afd",
        "#ff5e7e",
        "#88ff5a",
        "#fcff42",
        "#ffa62d",
        "#ff36ff",
      ],
      disableForReducedMotion: !1,
      scalar: 1,
    };
  function f(m, p) {
    return p ? p(m) : m;
  }
  function d(m) {
    return m != null;
  }
  function _(m, p, O) {
    return f(m && d(m[p]) ? m[p] : h[p], O);
  }
  function g(m) {
    return m < 0 ? 0 : Math.floor(m);
  }
  function c(m, p) {
    return Math.floor(Math.random() * (p - m)) + m;
  }
  function y(m) {
    return parseInt(m, 16);
  }
  function v(m) {
    return m.map(w);
  }
  function w(m) {
    var p = String(m).replace(/[^0-9a-f]/gi, "");
    return (
      p.length < 6 && (p = p[0] + p[0] + p[1] + p[1] + p[2] + p[2]),
      {
        r: y(p.substring(0, 2)),
        g: y(p.substring(2, 4)),
        b: y(p.substring(4, 6)),
      }
    );
  }
  function x(m) {
    var p = _(m, "origin", Object);
    return (p.x = _(p, "x", Number)), (p.y = _(p, "y", Number)), p;
  }
  function T(m) {
    (m.width = document.documentElement.clientWidth),
      (m.height = document.documentElement.clientHeight);
  }
  function b(m) {
    var p = m.getBoundingClientRect();
    (m.width = p.width), (m.height = p.height);
  }
  function M(m) {
    var p = document.createElement("canvas");
    return (
      (p.style.position = "fixed"),
      (p.style.top = "0px"),
      (p.style.left = "0px"),
      (p.style.pointerEvents = "none"),
      (p.style.zIndex = m),
      p
    );
  }
  function C(m, p, O, P, E, D, A, L, I) {
    m.save(),
      m.translate(p, O),
      m.rotate(D),
      m.scale(P, E),
      m.arc(0, 0, 1, A, L, I),
      m.restore();
  }
  function S(m) {
    var p = m.angle * (Math.PI / 180),
      O = m.spread * (Math.PI / 180);
    return {
      x: m.x,
      y: m.y,
      wobble: Math.random() * 10,
      wobbleSpeed: Math.min(0.11, Math.random() * 0.1 + 0.05),
      velocity: m.startVelocity * 0.5 + Math.random() * m.startVelocity,
      angle2D: -p + (0.5 * O - Math.random() * O),
      tiltAngle: (Math.random() * (0.75 - 0.25) + 0.25) * Math.PI,
      color: m.color,
      shape: m.shape,
      tick: 0,
      totalTicks: m.ticks,
      decay: m.decay,
      drift: m.drift,
      random: Math.random() + 2,
      tiltSin: 0,
      tiltCos: 0,
      wobbleX: 0,
      wobbleY: 0,
      gravity: m.gravity * 3,
      ovalScalar: 0.6,
      scalar: m.scalar,
    };
  }
  function k(m, p) {
    (p.x += Math.cos(p.angle2D) * p.velocity + p.drift),
      (p.y += Math.sin(p.angle2D) * p.velocity + p.gravity),
      (p.wobble += p.wobbleSpeed),
      (p.velocity *= p.decay),
      (p.tiltAngle += 0.1),
      (p.tiltSin = Math.sin(p.tiltAngle)),
      (p.tiltCos = Math.cos(p.tiltAngle)),
      (p.random = Math.random() + 2),
      (p.wobbleX = p.x + 10 * p.scalar * Math.cos(p.wobble)),
      (p.wobbleY = p.y + 10 * p.scalar * Math.sin(p.wobble));
    var O = p.tick++ / p.totalTicks,
      P = p.x + p.random * p.tiltCos,
      E = p.y + p.random * p.tiltSin,
      D = p.wobbleX + p.random * p.tiltCos,
      A = p.wobbleY + p.random * p.tiltSin;
    if (
      ((m.fillStyle =
        "rgba(" +
        p.color.r +
        ", " +
        p.color.g +
        ", " +
        p.color.b +
        ", " +
        (1 - O) +
        ")"),
      m.beginPath(),
      p.shape === "circle")
    )
      m.ellipse
        ? m.ellipse(
            p.x,
            p.y,
            Math.abs(D - P) * p.ovalScalar,
            Math.abs(A - E) * p.ovalScalar,
            (Math.PI / 10) * p.wobble,
            0,
            2 * Math.PI,
          )
        : C(
            m,
            p.x,
            p.y,
            Math.abs(D - P) * p.ovalScalar,
            Math.abs(A - E) * p.ovalScalar,
            (Math.PI / 10) * p.wobble,
            0,
            2 * Math.PI,
          );
    else if (p.shape === "star")
      for (
        var L = (Math.PI / 2) * 3,
          I = 4 * p.scalar,
          ce = 8 * p.scalar,
          z = p.x,
          Q = p.y,
          fe = 5,
          B = Math.PI / fe;
        fe--;

      )
        (z = p.x + Math.cos(L) * ce),
          (Q = p.y + Math.sin(L) * ce),
          m.lineTo(z, Q),
          (L += B),
          (z = p.x + Math.cos(L) * I),
          (Q = p.y + Math.sin(L) * I),
          m.lineTo(z, Q),
          (L += B);
    else
      m.moveTo(Math.floor(p.x), Math.floor(p.y)),
        m.lineTo(Math.floor(p.wobbleX), Math.floor(E)),
        m.lineTo(Math.floor(D), Math.floor(A)),
        m.lineTo(Math.floor(P), Math.floor(p.wobbleY));
    return m.closePath(), m.fill(), p.tick < p.totalTicks;
  }
  function R(m, p, O, P, E) {
    var D = p.slice(),
      A = m.getContext("2d"),
      L,
      I,
      ce = a(function (z) {
        function Q() {
          (L = I = null), A.clearRect(0, 0, P.width, P.height), E(), z();
        }
        function fe() {
          i &&
            !(P.width === r.width && P.height === r.height) &&
            ((P.width = m.width = r.width), (P.height = m.height = r.height)),
            !P.width &&
              !P.height &&
              (O(m), (P.width = m.width), (P.height = m.height)),
            A.clearRect(0, 0, P.width, P.height),
            (D = D.filter(function (B) {
              return k(A, B);
            })),
            D.length ? (L = o.frame(fe)) : Q();
        }
        (L = o.frame(fe)), (I = Q);
      });
    return {
      addFettis: function (z) {
        return (D = D.concat(z)), ce;
      },
      canvas: m,
      promise: ce,
      reset: function () {
        L && o.cancel(L), I && I();
      },
    };
  }
  function F(m, p) {
    var O = !m,
      P = !!_(p || {}, "resize"),
      E = _(p, "disableForReducedMotion", Boolean),
      D = n && !!_(p || {}, "useWorker"),
      A = D ? l() : null,
      L = O ? T : b,
      I = m && A ? !!m.__confetti_initialized : !1,
      ce =
        typeof matchMedia == "function" &&
        matchMedia("(prefers-reduced-motion)").matches,
      z;
    function Q(B, Ft, It) {
      for (
        var Xe = _(B, "particleCount", g),
          wt = _(B, "angle", Number),
          bt = _(B, "spread", Number),
          Re = _(B, "startVelocity", Number),
          Gr = _(B, "decay", Number),
          Qr = _(B, "gravity", Number),
          Zr = _(B, "drift", Number),
          Oi = _(B, "colors", v),
          Kr = _(B, "ticks", Number),
          Ei = _(B, "shapes"),
          Jr = _(B, "scalar"),
          Ai = x(B),
          Li = Xe,
          Nt = [],
          en = m.width * Ai.x,
          tn = m.height * Ai.y;
        Li--;

      )
        Nt.push(
          S({
            x: en,
            y: tn,
            angle: wt,
            spread: bt,
            startVelocity: Re,
            color: Oi[Li % Oi.length],
            shape: Ei[c(0, Ei.length)],
            ticks: Kr,
            decay: Gr,
            gravity: Qr,
            drift: Zr,
            scalar: Jr,
          }),
        );
      return z ? z.addFettis(Nt) : ((z = R(m, Nt, L, Ft, It)), z.promise);
    }
    function fe(B) {
      var Ft = E || _(B, "disableForReducedMotion", Boolean),
        It = _(B, "zIndex", Number);
      if (Ft && ce)
        return a(function (Re) {
          Re();
        });
      O && z
        ? (m = z.canvas)
        : O && !m && ((m = M(It)), document.body.appendChild(m)),
        P && !I && L(m);
      var Xe = { width: m.width, height: m.height };
      A && !I && A.init(m), (I = !0), A && (m.__confetti_initialized = !0);
      function wt() {
        if (A) {
          var Re = {
            getBoundingClientRect: function () {
              if (!O) return m.getBoundingClientRect();
            },
          };
          L(Re),
            A.postMessage({ resize: { width: Re.width, height: Re.height } });
          return;
        }
        Xe.width = Xe.height = null;
      }
      function bt() {
        (z = null),
          P && e.removeEventListener("resize", wt),
          O && m && (document.body.removeChild(m), (m = null), (I = !1));
      }
      return (
        P && e.addEventListener("resize", wt, !1),
        A ? A.fire(B, Xe, bt) : Q(B, Xe, bt)
      );
    }
    return (
      (fe.reset = function () {
        A && A.reset(), z && z.reset();
      }),
      fe
    );
  }
  var V;
  function U() {
    return V || (V = F(null, { useWorker: !0, resize: !0 })), V;
  }
  (t.exports = function () {
    return U().apply(this, arguments);
  }),
    (t.exports.reset = function () {
      U().reset();
    }),
    (t.exports.create = F);
})(
  (function () {
    return typeof window < "u" ? window : typeof self < "u" ? self : this || {};
  })(),
  ci,
  !1,
);
const sn = ci.exports;
ci.exports.create;
function ke(u) {
  if (u === void 0)
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called",
    );
  return u;
}
function Qi(u, e) {
  (u.prototype = Object.create(e.prototype)),
    (u.prototype.constructor = u),
    (u.__proto__ = e);
}
/*!
 * GSAP 3.12.2
 * https://greensock.com
 *
 * @license Copyright 2008-2023, GreenSock. All rights reserved.
 * Subject to the terms at https://greensock.com/standard-license or for
 * Club GreenSock members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
 */ var le = {
    autoSleep: 120,
    force3D: "auto",
    nullTargetWarn: 1,
    units: { lineHeight: "" },
  },
  et = { duration: 0.5, overwrite: !1, delay: 0 },
  fi,
  ee,
  Y,
  pe = 1e8,
  q = 1 / pe,
  Gt = Math.PI * 2,
  an = Gt / 4,
  on = 0,
  Zi = Math.sqrt,
  un = Math.cos,
  ln = Math.sin,
  Z = function (e) {
    return typeof e == "string";
  },
  X = function (e) {
    return typeof e == "function";
  },
  Ce = function (e) {
    return typeof e == "number";
  },
  di = function (e) {
    return typeof e > "u";
  },
  Te = function (e) {
    return typeof e == "object";
  },
  re = function (e) {
    return e !== !1;
  },
  _i = function () {
    return typeof window < "u";
  },
  xt = function (e) {
    return X(e) || Z(e);
  },
  Ki =
    (typeof ArrayBuffer == "function" && ArrayBuffer.isView) || function () {},
  te = Array.isArray,
  Qt = /(?:-?\.?\d|\.)+/gi,
  Ji = /[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g,
  Ge = /[-+=.]*\d+[.e-]*\d*[a-z%]*/g,
  qt = /[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi,
  er = /[+-]=-?[.\d]+/,
  tr = /[^,'"\[\]\s]+/gi,
  hn = /^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i,
  j,
  _e,
  Zt,
  pi,
  he = {},
  Ct = {},
  ir,
  rr = function (e) {
    return (Ct = We(e, he)) && ae;
  },
  mi = function (e, t) {
    return console.warn(
      "Invalid property",
      e,
      "set to",
      t,
      "Missing plugin? gsap.registerPlugin()",
    );
  },
  Mt = function (e, t) {
    return !t && console.warn(e);
  },
  nr = function (e, t) {
    return (e && (he[e] = t) && Ct && (Ct[e] = t)) || he;
  },
  ct = function () {
    return 0;
  },
  cn = { suppressEvents: !0, isStart: !0, kill: !1 },
  Tt = { suppressEvents: !0, kill: !1 },
  fn = { suppressEvents: !0 },
  gi = {},
  Ae = [],
  Kt = {},
  sr,
  oe = {},
  Vt = {},
  Di = 30,
  kt = [],
  yi = "",
  vi = function (e) {
    var t = e[0],
      i,
      r;
    if ((Te(t) || X(t) || (e = [e]), !(i = (t._gsap || {}).harness))) {
      for (r = kt.length; r-- && !kt[r].targetTest(t); );
      i = kt[r];
    }
    for (r = e.length; r--; )
      (e[r] && (e[r]._gsap || (e[r]._gsap = new Or(e[r], i)))) ||
        e.splice(r, 1);
    return e;
  },
  Ve = function (e) {
    return e._gsap || vi(me(e))[0]._gsap;
  },
  ar = function (e, t, i) {
    return (i = e[t]) && X(i)
      ? e[t]()
      : (di(i) && e.getAttribute && e.getAttribute(t)) || i;
  },
  ne = function (e, t) {
    return (e = e.split(",")).forEach(t) || e;
  },
  H = function (e) {
    return Math.round(e * 1e5) / 1e5 || 0;
  },
  K = function (e) {
    return Math.round(e * 1e7) / 1e7 || 0;
  },
  Ze = function (e, t) {
    var i = t.charAt(0),
      r = parseFloat(t.substr(2));
    return (
      (e = parseFloat(e)),
      i === "+" ? e + r : i === "-" ? e - r : i === "*" ? e * r : e / r
    );
  },
  dn = function (e, t) {
    for (var i = t.length, r = 0; e.indexOf(t[r]) < 0 && ++r < i; );
    return r < i;
  },
  Pt = function () {
    var e = Ae.length,
      t = Ae.slice(0),
      i,
      r;
    for (Kt = {}, Ae.length = 0, i = 0; i < e; i++)
      (r = t[i]),
        r && r._lazy && (r.render(r._lazy[0], r._lazy[1], !0)._lazy = 0);
  },
  or = function (e, t, i, r) {
    Ae.length && !ee && Pt(),
      e.render(t, i, r || (ee && t < 0 && (e._initted || e._startAt))),
      Ae.length && !ee && Pt();
  },
  ur = function (e) {
    var t = parseFloat(e);
    return (t || t === 0) && (e + "").match(tr).length < 2
      ? t
      : Z(e)
        ? e.trim()
        : e;
  },
  lr = function (e) {
    return e;
  },
  ye = function (e, t) {
    for (var i in t) i in e || (e[i] = t[i]);
    return e;
  },
  _n = function (e) {
    return function (t, i) {
      for (var r in i)
        r in t || (r === "duration" && e) || r === "ease" || (t[r] = i[r]);
    };
  },
  We = function (e, t) {
    for (var i in t) e[i] = t[i];
    return e;
  },
  $i = function u(e, t) {
    for (var i in t)
      i !== "__proto__" &&
        i !== "constructor" &&
        i !== "prototype" &&
        (e[i] = Te(t[i]) ? u(e[i] || (e[i] = {}), t[i]) : t[i]);
    return e;
  },
  Ot = function (e, t) {
    var i = {},
      r;
    for (r in e) r in t || (i[r] = e[r]);
    return i;
  },
  ut = function (e) {
    var t = e.parent || j,
      i = e.keyframes ? _n(te(e.keyframes)) : ye;
    if (re(e.inherit))
      for (; t; ) i(e, t.vars.defaults), (t = t.parent || t._dp);
    return e;
  },
  pn = function (e, t) {
    for (var i = e.length, r = i === t.length; r && i-- && e[i] === t[i]; );
    return i < 0;
  },
  hr = function (e, t, i, r, n) {
    i === void 0 && (i = "_first"), r === void 0 && (r = "_last");
    var s = e[r],
      a;
    if (n) for (a = t[n]; s && s[n] > a; ) s = s._prev;
    return (
      s ? ((t._next = s._next), (s._next = t)) : ((t._next = e[i]), (e[i] = t)),
      t._next ? (t._next._prev = t) : (e[r] = t),
      (t._prev = s),
      (t.parent = t._dp = e),
      t
    );
  },
  $t = function (e, t, i, r) {
    i === void 0 && (i = "_first"), r === void 0 && (r = "_last");
    var n = t._prev,
      s = t._next;
    n ? (n._next = s) : e[i] === t && (e[i] = s),
      s ? (s._prev = n) : e[r] === t && (e[r] = n),
      (t._next = t._prev = t.parent = null);
  },
  De = function (e, t) {
    e.parent &&
      (!t || e.parent.autoRemoveChildren) &&
      e.parent.remove &&
      e.parent.remove(e),
      (e._act = 0);
  },
  Be = function (e, t) {
    if (e && (!t || t._end > e._dur || t._start < 0))
      for (var i = e; i; ) (i._dirty = 1), (i = i.parent);
    return e;
  },
  mn = function (e) {
    for (var t = e.parent; t && t.parent; )
      (t._dirty = 1), t.totalDuration(), (t = t.parent);
    return e;
  },
  Jt = function (e, t, i, r) {
    return (
      e._startAt &&
      (ee
        ? e._startAt.revert(Tt)
        : (e.vars.immediateRender && !e.vars.autoRevert) ||
          e._startAt.render(t, !0, r))
    );
  },
  gn = function u(e) {
    return !e || (e._ts && u(e.parent));
  },
  zi = function (e) {
    return e._repeat ? tt(e._tTime, (e = e.duration() + e._rDelay)) * e : 0;
  },
  tt = function (e, t) {
    var i = Math.floor((e /= t));
    return e && i === e ? i - 1 : i;
  },
  Et = function (e, t) {
    return (
      (e - t._start) * t._ts +
      (t._ts >= 0 ? 0 : t._dirty ? t.totalDuration() : t._tDur)
    );
  },
  zt = function (e) {
    return (e._end = K(
      e._start + (e._tDur / Math.abs(e._ts || e._rts || q) || 0),
    ));
  },
  Rt = function (e, t) {
    var i = e._dp;
    return (
      i &&
        i.smoothChildTiming &&
        e._ts &&
        ((e._start = K(
          i._time -
            (e._ts > 0
              ? t / e._ts
              : ((e._dirty ? e.totalDuration() : e._tDur) - t) / -e._ts),
        )),
        zt(e),
        i._dirty || Be(i, e)),
      e
    );
  },
  cr = function (e, t) {
    var i;
    if (
      ((t._time ||
        (!t._dur && t._initted) ||
        (t._start < e._time && (t._dur || !t.add))) &&
        ((i = Et(e.rawTime(), t)),
        (!t._dur || vt(0, t.totalDuration(), i) - t._tTime > q) &&
          t.render(i, !0)),
      Be(e, t)._dp && e._initted && e._time >= e._dur && e._ts)
    ) {
      if (e._dur < e.duration())
        for (i = e; i._dp; )
          i.rawTime() >= 0 && i.totalTime(i._tTime), (i = i._dp);
      e._zTime = -q;
    }
  },
  we = function (e, t, i, r) {
    return (
      t.parent && De(t),
      (t._start = K(
        (Ce(i) ? i : i || e !== j ? de(e, i, t) : e._time) + t._delay,
      )),
      (t._end = K(
        t._start + (t.totalDuration() / Math.abs(t.timeScale()) || 0),
      )),
      hr(e, t, "_first", "_last", e._sort ? "_start" : 0),
      ei(t) || (e._recent = t),
      r || cr(e, t),
      e._ts < 0 && Rt(e, e._tTime),
      e
    );
  },
  fr = function (e, t) {
    return (
      (he.ScrollTrigger || mi("scrollTrigger", t)) &&
      he.ScrollTrigger.create(t, e)
    );
  },
  dr = function (e, t, i, r, n) {
    if ((bi(e, t, n), !e._initted)) return 1;
    if (
      !i &&
      e._pt &&
      !ee &&
      ((e._dur && e.vars.lazy !== !1) || (!e._dur && e.vars.lazy)) &&
      sr !== ue.frame
    )
      return Ae.push(e), (e._lazy = [n, r]), 1;
  },
  yn = function u(e) {
    var t = e.parent;
    return t && t._ts && t._initted && !t._lock && (t.rawTime() < 0 || u(t));
  },
  ei = function (e) {
    var t = e.data;
    return t === "isFromStart" || t === "isStart";
  },
  vn = function (e, t, i, r) {
    var n = e.ratio,
      s =
        t < 0 ||
        (!t &&
          ((!e._start && yn(e) && !(!e._initted && ei(e))) ||
            ((e._ts < 0 || e._dp._ts < 0) && !ei(e))))
          ? 0
          : 1,
      a = e._rDelay,
      o = 0,
      l,
      h,
      f;
    if (
      (a &&
        e._repeat &&
        ((o = vt(0, e._tDur, t)),
        (h = tt(o, a)),
        e._yoyo && h & 1 && (s = 1 - s),
        h !== tt(e._tTime, a) &&
          ((n = 1 - s), e.vars.repeatRefresh && e._initted && e.invalidate())),
      s !== n || ee || r || e._zTime === q || (!t && e._zTime))
    ) {
      if (!e._initted && dr(e, t, r, i, o)) return;
      for (
        f = e._zTime,
          e._zTime = t || (i ? q : 0),
          i || (i = t && !f),
          e.ratio = s,
          e._from && (s = 1 - s),
          e._time = 0,
          e._tTime = o,
          l = e._pt;
        l;

      )
        l.r(s, l.d), (l = l._next);
      t < 0 && Jt(e, t, i, !0),
        e._onUpdate && !i && ge(e, "onUpdate"),
        o && e._repeat && !i && e.parent && ge(e, "onRepeat"),
        (t >= e._tDur || t < 0) &&
          e.ratio === s &&
          (s && De(e, 1),
          !i &&
            !ee &&
            (ge(e, s ? "onComplete" : "onReverseComplete", !0),
            e._prom && e._prom()));
    } else e._zTime || (e._zTime = t);
  },
  wn = function (e, t, i) {
    var r;
    if (i > t)
      for (r = e._first; r && r._start <= i; ) {
        if (r.data === "isPause" && r._start > t) return r;
        r = r._next;
      }
    else
      for (r = e._last; r && r._start >= i; ) {
        if (r.data === "isPause" && r._start < t) return r;
        r = r._prev;
      }
  },
  it = function (e, t, i, r) {
    var n = e._repeat,
      s = K(t) || 0,
      a = e._tTime / e._tDur;
    return (
      a && !r && (e._time *= s / e._dur),
      (e._dur = s),
      (e._tDur = n ? (n < 0 ? 1e10 : K(s * (n + 1) + e._rDelay * n)) : s),
      a > 0 && !r && Rt(e, (e._tTime = e._tDur * a)),
      e.parent && zt(e),
      i || Be(e.parent, e),
      e
    );
  },
  Ri = function (e) {
    return e instanceof ie ? Be(e) : it(e, e._dur);
  },
  bn = { _start: 0, endTime: ct, totalDuration: ct },
  de = function u(e, t, i) {
    var r = e.labels,
      n = e._recent || bn,
      s = e.duration() >= pe ? n.endTime(!1) : e._dur,
      a,
      o,
      l;
    return Z(t) && (isNaN(t) || t in r)
      ? ((o = t.charAt(0)),
        (l = t.substr(-1) === "%"),
        (a = t.indexOf("=")),
        o === "<" || o === ">"
          ? (a >= 0 && (t = t.replace(/=/, "")),
            (o === "<" ? n._start : n.endTime(n._repeat >= 0)) +
              (parseFloat(t.substr(1)) || 0) *
                (l ? (a < 0 ? n : i).totalDuration() / 100 : 1))
          : a < 0
            ? (t in r || (r[t] = s), r[t])
            : ((o = parseFloat(t.charAt(a - 1) + t.substr(a + 1))),
              l && i && (o = (o / 100) * (te(i) ? i[0] : i).totalDuration()),
              a > 1 ? u(e, t.substr(0, a - 1), i) + o : s + o))
      : t == null
        ? s
        : +t;
  },
  lt = function (e, t, i) {
    var r = Ce(t[1]),
      n = (r ? 2 : 1) + (e < 2 ? 0 : 1),
      s = t[n],
      a,
      o;
    if ((r && (s.duration = t[1]), (s.parent = i), e)) {
      for (a = s, o = i; o && !("immediateRender" in a); )
        (a = o.vars.defaults || {}), (o = re(o.vars.inherit) && o.parent);
      (s.immediateRender = re(a.immediateRender)),
        e < 2 ? (s.runBackwards = 1) : (s.startAt = t[n - 1]);
    }
    return new G(t[0], s, t[n + 1]);
  },
  ze = function (e, t) {
    return e || e === 0 ? t(e) : t;
  },
  vt = function (e, t, i) {
    return i < e ? e : i > t ? t : i;
  },
  J = function (e, t) {
    return !Z(e) || !(t = hn.exec(e)) ? "" : t[1];
  },
  xn = function (e, t, i) {
    return ze(i, function (r) {
      return vt(e, t, r);
    });
  },
  ti = [].slice,
  _r = function (e, t) {
    return (
      e &&
      Te(e) &&
      "length" in e &&
      ((!t && !e.length) || (e.length - 1 in e && Te(e[0]))) &&
      !e.nodeType &&
      e !== _e
    );
  },
  Tn = function (e, t, i) {
    return (
      i === void 0 && (i = []),
      e.forEach(function (r) {
        var n;
        return (Z(r) && !t) || _r(r, 1)
          ? (n = i).push.apply(n, me(r))
          : i.push(r);
      }) || i
    );
  },
  me = function (e, t, i) {
    return Y && !t && Y.selector
      ? Y.selector(e)
      : Z(e) && !i && (Zt || !rt())
        ? ti.call((t || pi).querySelectorAll(e), 0)
        : te(e)
          ? Tn(e, i)
          : _r(e)
            ? ti.call(e, 0)
            : e
              ? [e]
              : [];
  },
  ii = function (e) {
    return (
      (e = me(e)[0] || Mt("Invalid scope") || {}),
      function (t) {
        var i = e.current || e.nativeElement || e;
        return me(
          t,
          i.querySelectorAll
            ? i
            : i === e
              ? Mt("Invalid scope") || pi.createElement("div")
              : e,
        );
      }
    );
  },
  pr = function (e) {
    return e.sort(function () {
      return 0.5 - Math.random();
    });
  },
  mr = function (e) {
    if (X(e)) return e;
    var t = Te(e) ? e : { each: e },
      i = Ue(t.ease),
      r = t.from || 0,
      n = parseFloat(t.base) || 0,
      s = {},
      a = r > 0 && r < 1,
      o = isNaN(r) || a,
      l = t.axis,
      h = r,
      f = r;
    return (
      Z(r)
        ? (h = f = { center: 0.5, edges: 0.5, end: 1 }[r] || 0)
        : !a && o && ((h = r[0]), (f = r[1])),
      function (d, _, g) {
        var c = (g || t).length,
          y = s[c],
          v,
          w,
          x,
          T,
          b,
          M,
          C,
          S,
          k;
        if (!y) {
          if (((k = t.grid === "auto" ? 0 : (t.grid || [1, pe])[1]), !k)) {
            for (
              C = -pe;
              C < (C = g[k++].getBoundingClientRect().left) && k < c;

            );
            k--;
          }
          for (
            y = s[c] = [],
              v = o ? Math.min(k, c) * h - 0.5 : r % k,
              w = k === pe ? 0 : o ? (c * f) / k - 0.5 : (r / k) | 0,
              C = 0,
              S = pe,
              M = 0;
            M < c;
            M++
          )
            (x = (M % k) - v),
              (T = w - ((M / k) | 0)),
              (y[M] = b = l ? Math.abs(l === "y" ? T : x) : Zi(x * x + T * T)),
              b > C && (C = b),
              b < S && (S = b);
          r === "random" && pr(y),
            (y.max = C - S),
            (y.min = S),
            (y.v = c =
              (parseFloat(t.amount) ||
                parseFloat(t.each) *
                  (k > c
                    ? c - 1
                    : l
                      ? l === "y"
                        ? c / k
                        : k
                      : Math.max(k, c / k)) ||
                0) * (r === "edges" ? -1 : 1)),
            (y.b = c < 0 ? n - c : n),
            (y.u = J(t.amount || t.each) || 0),
            (i = i && c < 0 ? Cr(i) : i);
        }
        return (
          (c = (y[d] - y.min) / y.max || 0), K(y.b + (i ? i(c) : c) * y.v) + y.u
        );
      }
    );
  },
  ri = function (e) {
    var t = Math.pow(10, ((e + "").split(".")[1] || "").length);
    return function (i) {
      var r = K(Math.round(parseFloat(i) / e) * e * t);
      return (r - (r % 1)) / t + (Ce(i) ? 0 : J(i));
    };
  },
  gr = function (e, t) {
    var i = te(e),
      r,
      n;
    return (
      !i &&
        Te(e) &&
        ((r = i = e.radius || pe),
        e.values
          ? ((e = me(e.values)), (n = !Ce(e[0])) && (r *= r))
          : (e = ri(e.increment))),
      ze(
        t,
        i
          ? X(e)
            ? function (s) {
                return (n = e(s)), Math.abs(n - s) <= r ? n : s;
              }
            : function (s) {
                for (
                  var a = parseFloat(n ? s.x : s),
                    o = parseFloat(n ? s.y : 0),
                    l = pe,
                    h = 0,
                    f = e.length,
                    d,
                    _;
                  f--;

                )
                  n
                    ? ((d = e[f].x - a), (_ = e[f].y - o), (d = d * d + _ * _))
                    : (d = Math.abs(e[f] - a)),
                    d < l && ((l = d), (h = f));
                return (
                  (h = !r || l <= r ? e[h] : s),
                  n || h === s || Ce(s) ? h : h + J(s)
                );
              }
          : ri(e),
      )
    );
  },
  yr = function (e, t, i, r) {
    return ze(te(e) ? !t : i === !0 ? !!(i = 0) : !r, function () {
      return te(e)
        ? e[~~(Math.random() * e.length)]
        : (i = i || 1e-5) &&
            (r = i < 1 ? Math.pow(10, (i + "").length - 2) : 1) &&
            Math.floor(
              Math.round((e - i / 2 + Math.random() * (t - e + i * 0.99)) / i) *
                i *
                r,
            ) / r;
    });
  },
  kn = function () {
    for (var e = arguments.length, t = new Array(e), i = 0; i < e; i++)
      t[i] = arguments[i];
    return function (r) {
      return t.reduce(function (n, s) {
        return s(n);
      }, r);
    };
  },
  Sn = function (e, t) {
    return function (i) {
      return e(parseFloat(i)) + (t || J(i));
    };
  },
  Cn = function (e, t, i) {
    return wr(e, t, 0, 1, i);
  },
  vr = function (e, t, i) {
    return ze(i, function (r) {
      return e[~~t(r)];
    });
  },
  Mn = function u(e, t, i) {
    var r = t - e;
    return te(e)
      ? vr(e, u(0, e.length), t)
      : ze(i, function (n) {
          return ((r + ((n - e) % r)) % r) + e;
        });
  },
  Pn = function u(e, t, i) {
    var r = t - e,
      n = r * 2;
    return te(e)
      ? vr(e, u(0, e.length - 1), t)
      : ze(i, function (s) {
          return (s = (n + ((s - e) % n)) % n || 0), e + (s > r ? n - s : s);
        });
  },
  ft = function (e) {
    for (var t = 0, i = "", r, n, s, a; ~(r = e.indexOf("random(", t)); )
      (s = e.indexOf(")", r)),
        (a = e.charAt(r + 7) === "["),
        (n = e.substr(r + 7, s - r - 7).match(a ? tr : Qt)),
        (i +=
          e.substr(t, r - t) + yr(a ? n : +n[0], a ? 0 : +n[1], +n[2] || 1e-5)),
        (t = s + 1);
    return i + e.substr(t, e.length - t);
  },
  wr = function (e, t, i, r, n) {
    var s = t - e,
      a = r - i;
    return ze(n, function (o) {
      return i + (((o - e) / s) * a || 0);
    });
  },
  On = function u(e, t, i, r) {
    var n = isNaN(e + t)
      ? 0
      : function (_) {
          return (1 - _) * e + _ * t;
        };
    if (!n) {
      var s = Z(e),
        a = {},
        o,
        l,
        h,
        f,
        d;
      if ((i === !0 && (r = 1) && (i = null), s))
        (e = { p: e }), (t = { p: t });
      else if (te(e) && !te(t)) {
        for (h = [], f = e.length, d = f - 2, l = 1; l < f; l++)
          h.push(u(e[l - 1], e[l]));
        f--,
          (n = function (g) {
            g *= f;
            var c = Math.min(d, ~~g);
            return h[c](g - c);
          }),
          (i = t);
      } else r || (e = We(te(e) ? [] : {}, e));
      if (!h) {
        for (o in t) wi.call(a, e, o, "get", t[o]);
        n = function (g) {
          return ki(g, a) || (s ? e.p : e);
        };
      }
    }
    return ze(i, n);
  },
  Fi = function (e, t, i) {
    var r = e.labels,
      n = pe,
      s,
      a,
      o;
    for (s in r)
      (a = r[s] - t),
        a < 0 == !!i && a && n > (a = Math.abs(a)) && ((o = s), (n = a));
    return o;
  },
  ge = function (e, t, i) {
    var r = e.vars,
      n = r[t],
      s = Y,
      a = e._ctx,
      o,
      l,
      h;
    if (n)
      return (
        (o = r[t + "Params"]),
        (l = r.callbackScope || e),
        i && Ae.length && Pt(),
        a && (Y = a),
        (h = o ? n.apply(l, o) : n.call(l)),
        (Y = s),
        h
      );
  },
  at = function (e) {
    return (
      De(e),
      e.scrollTrigger && e.scrollTrigger.kill(!!ee),
      e.progress() < 1 && ge(e, "onInterrupt"),
      e
    );
  },
  Qe,
  br = [],
  xr = function (e) {
    if (_i() && e) {
      e = (!e.name && e.default) || e;
      var t = e.name,
        i = X(e),
        r =
          t && !i && e.init
            ? function () {
                this._props = [];
              }
            : e,
        n = {
          init: ct,
          render: ki,
          add: wi,
          kill: Wn,
          modifier: jn,
          rawVars: 0,
        },
        s = { targetTest: 0, get: 0, getSetter: Ti, aliases: {}, register: 0 };
      if ((rt(), e !== r)) {
        if (oe[t]) return;
        ye(r, ye(Ot(e, n), s)),
          We(r.prototype, We(n, Ot(e, s))),
          (oe[(r.prop = t)] = r),
          e.targetTest && (kt.push(r), (gi[t] = 1)),
          (t =
            (t === "css" ? "CSS" : t.charAt(0).toUpperCase() + t.substr(1)) +
            "Plugin");
      }
      nr(t, r), e.register && e.register(ae, r, se);
    } else e && br.push(e);
  },
  N = 255,
  ot = {
    aqua: [0, N, N],
    lime: [0, N, 0],
    silver: [192, 192, 192],
    black: [0, 0, 0],
    maroon: [128, 0, 0],
    teal: [0, 128, 128],
    blue: [0, 0, N],
    navy: [0, 0, 128],
    white: [N, N, N],
    olive: [128, 128, 0],
    yellow: [N, N, 0],
    orange: [N, 165, 0],
    gray: [128, 128, 128],
    purple: [128, 0, 128],
    green: [0, 128, 0],
    red: [N, 0, 0],
    pink: [N, 192, 203],
    cyan: [0, N, N],
    transparent: [N, N, N, 0],
  },
  Bt = function (e, t, i) {
    return (
      (e += e < 0 ? 1 : e > 1 ? -1 : 0),
      ((e * 6 < 1
        ? t + (i - t) * e * 6
        : e < 0.5
          ? i
          : e * 3 < 2
            ? t + (i - t) * (2 / 3 - e) * 6
            : t) *
        N +
        0.5) |
        0
    );
  },
  Tr = function (e, t, i) {
    var r = e ? (Ce(e) ? [e >> 16, (e >> 8) & N, e & N] : 0) : ot.black,
      n,
      s,
      a,
      o,
      l,
      h,
      f,
      d,
      _,
      g;
    if (!r) {
      if ((e.substr(-1) === "," && (e = e.substr(0, e.length - 1)), ot[e]))
        r = ot[e];
      else if (e.charAt(0) === "#") {
        if (
          (e.length < 6 &&
            ((n = e.charAt(1)),
            (s = e.charAt(2)),
            (a = e.charAt(3)),
            (e =
              "#" +
              n +
              n +
              s +
              s +
              a +
              a +
              (e.length === 5 ? e.charAt(4) + e.charAt(4) : ""))),
          e.length === 9)
        )
          return (
            (r = parseInt(e.substr(1, 6), 16)),
            [r >> 16, (r >> 8) & N, r & N, parseInt(e.substr(7), 16) / 255]
          );
        (e = parseInt(e.substr(1), 16)), (r = [e >> 16, (e >> 8) & N, e & N]);
      } else if (e.substr(0, 3) === "hsl") {
        if (((r = g = e.match(Qt)), !t))
          (o = (+r[0] % 360) / 360),
            (l = +r[1] / 100),
            (h = +r[2] / 100),
            (s = h <= 0.5 ? h * (l + 1) : h + l - h * l),
            (n = h * 2 - s),
            r.length > 3 && (r[3] *= 1),
            (r[0] = Bt(o + 1 / 3, n, s)),
            (r[1] = Bt(o, n, s)),
            (r[2] = Bt(o - 1 / 3, n, s));
        else if (~e.indexOf("="))
          return (r = e.match(Ji)), i && r.length < 4 && (r[3] = 1), r;
      } else r = e.match(Qt) || ot.transparent;
      r = r.map(Number);
    }
    return (
      t &&
        !g &&
        ((n = r[0] / N),
        (s = r[1] / N),
        (a = r[2] / N),
        (f = Math.max(n, s, a)),
        (d = Math.min(n, s, a)),
        (h = (f + d) / 2),
        f === d
          ? (o = l = 0)
          : ((_ = f - d),
            (l = h > 0.5 ? _ / (2 - f - d) : _ / (f + d)),
            (o =
              f === n
                ? (s - a) / _ + (s < a ? 6 : 0)
                : f === s
                  ? (a - n) / _ + 2
                  : (n - s) / _ + 4),
            (o *= 60)),
        (r[0] = ~~(o + 0.5)),
        (r[1] = ~~(l * 100 + 0.5)),
        (r[2] = ~~(h * 100 + 0.5))),
      i && r.length < 4 && (r[3] = 1),
      r
    );
  },
  kr = function (e) {
    var t = [],
      i = [],
      r = -1;
    return (
      e.split(Le).forEach(function (n) {
        var s = n.match(Ge) || [];
        t.push.apply(t, s), i.push((r += s.length + 1));
      }),
      (t.c = i),
      t
    );
  },
  Ii = function (e, t, i) {
    var r = "",
      n = (e + r).match(Le),
      s = t ? "hsla(" : "rgba(",
      a = 0,
      o,
      l,
      h,
      f;
    if (!n) return e;
    if (
      ((n = n.map(function (d) {
        return (
          (d = Tr(d, t, 1)) &&
          s +
            (t ? d[0] + "," + d[1] + "%," + d[2] + "%," + d[3] : d.join(",")) +
            ")"
        );
      })),
      i && ((h = kr(e)), (o = i.c), o.join(r) !== h.c.join(r)))
    )
      for (l = e.replace(Le, "1").split(Ge), f = l.length - 1; a < f; a++)
        r +=
          l[a] +
          (~o.indexOf(a)
            ? n.shift() || s + "0,0,0,0)"
            : (h.length ? h : n.length ? n : i).shift());
    if (!l)
      for (l = e.split(Le), f = l.length - 1; a < f; a++) r += l[a] + n[a];
    return r + l[f];
  },
  Le = (function () {
    var u =
        "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b",
      e;
    for (e in ot) u += "|" + e + "\\b";
    return new RegExp(u + ")", "gi");
  })(),
  En = /hsl[a]?\(/,
  Sr = function (e) {
    var t = e.join(" "),
      i;
    if (((Le.lastIndex = 0), Le.test(t)))
      return (
        (i = En.test(t)),
        (e[1] = Ii(e[1], i)),
        (e[0] = Ii(e[0], i, kr(e[1]))),
        !0
      );
  },
  dt,
  ue = (function () {
    var u = Date.now,
      e = 500,
      t = 33,
      i = u(),
      r = i,
      n = 1e3 / 240,
      s = n,
      a = [],
      o,
      l,
      h,
      f,
      d,
      _,
      g = function c(y) {
        var v = u() - r,
          w = y === !0,
          x,
          T,
          b,
          M;
        if (
          (v > e && (i += v - t),
          (r += v),
          (b = r - i),
          (x = b - s),
          (x > 0 || w) &&
            ((M = ++f.frame),
            (d = b - f.time * 1e3),
            (f.time = b = b / 1e3),
            (s += x + (x >= n ? 4 : n - x)),
            (T = 1)),
          w || (o = l(c)),
          T)
        )
          for (_ = 0; _ < a.length; _++) a[_](b, d, M, y);
      };
    return (
      (f = {
        time: 0,
        frame: 0,
        tick: function () {
          g(!0);
        },
        deltaRatio: function (y) {
          return d / (1e3 / (y || 60));
        },
        wake: function () {
          ir &&
            (!Zt &&
              _i() &&
              ((_e = Zt = window),
              (pi = _e.document || {}),
              (he.gsap = ae),
              (_e.gsapVersions || (_e.gsapVersions = [])).push(ae.version),
              rr(Ct || _e.GreenSockGlobals || (!_e.gsap && _e) || {}),
              (h = _e.requestAnimationFrame),
              br.forEach(xr)),
            o && f.sleep(),
            (l =
              h ||
              function (y) {
                return setTimeout(y, (s - f.time * 1e3 + 1) | 0);
              }),
            (dt = 1),
            g(2));
        },
        sleep: function () {
          (h ? _e.cancelAnimationFrame : clearTimeout)(o), (dt = 0), (l = ct);
        },
        lagSmoothing: function (y, v) {
          (e = y || 1 / 0), (t = Math.min(v || 33, e));
        },
        fps: function (y) {
          (n = 1e3 / (y || 240)), (s = f.time * 1e3 + n);
        },
        add: function (y, v, w) {
          var x = v
            ? function (T, b, M, C) {
                y(T, b, M, C), f.remove(x);
              }
            : y;
          return f.remove(y), a[w ? "unshift" : "push"](x), rt(), x;
        },
        remove: function (y, v) {
          ~(v = a.indexOf(y)) && a.splice(v, 1) && _ >= v && _--;
        },
        _listeners: a,
      }),
      f
    );
  })(),
  rt = function () {
    return !dt && ue.wake();
  },
  $ = {},
  An = /^[\d.\-M][\d.\-,\s]/,
  Ln = /["']/g,
  Dn = function (e) {
    for (
      var t = {},
        i = e.substr(1, e.length - 3).split(":"),
        r = i[0],
        n = 1,
        s = i.length,
        a,
        o,
        l;
      n < s;
      n++
    )
      (o = i[n]),
        (a = n !== s - 1 ? o.lastIndexOf(",") : o.length),
        (l = o.substr(0, a)),
        (t[r] = isNaN(l) ? l.replace(Ln, "").trim() : +l),
        (r = o.substr(a + 1).trim());
    return t;
  },
  $n = function (e) {
    var t = e.indexOf("(") + 1,
      i = e.indexOf(")"),
      r = e.indexOf("(", t);
    return e.substring(t, ~r && r < i ? e.indexOf(")", i + 1) : i);
  },
  zn = function (e) {
    var t = (e + "").split("("),
      i = $[t[0]];
    return i && t.length > 1 && i.config
      ? i.config.apply(
          null,
          ~e.indexOf("{") ? [Dn(t[1])] : $n(e).split(",").map(ur),
        )
      : $._CE && An.test(e)
        ? $._CE("", e)
        : i;
  },
  Cr = function (e) {
    return function (t) {
      return 1 - e(1 - t);
    };
  },
  Mr = function u(e, t) {
    for (var i = e._first, r; i; )
      i instanceof ie
        ? u(i, t)
        : i.vars.yoyoEase &&
          (!i._yoyo || !i._repeat) &&
          i._yoyo !== t &&
          (i.timeline
            ? u(i.timeline, t)
            : ((r = i._ease),
              (i._ease = i._yEase),
              (i._yEase = r),
              (i._yoyo = t))),
        (i = i._next);
  },
  Ue = function (e, t) {
    return (e && (X(e) ? e : $[e] || zn(e))) || t;
  },
  Ye = function (e, t, i, r) {
    i === void 0 &&
      (i = function (o) {
        return 1 - t(1 - o);
      }),
      r === void 0 &&
        (r = function (o) {
          return o < 0.5 ? t(o * 2) / 2 : 1 - t((1 - o) * 2) / 2;
        });
    var n = { easeIn: t, easeOut: i, easeInOut: r },
      s;
    return (
      ne(e, function (a) {
        ($[a] = he[a] = n), ($[(s = a.toLowerCase())] = i);
        for (var o in n)
          $[
            s + (o === "easeIn" ? ".in" : o === "easeOut" ? ".out" : ".inOut")
          ] = $[a + "." + o] = n[o];
      }),
      n
    );
  },
  Pr = function (e) {
    return function (t) {
      return t < 0.5 ? (1 - e(1 - t * 2)) / 2 : 0.5 + e((t - 0.5) * 2) / 2;
    };
  },
  Ut = function u(e, t, i) {
    var r = t >= 1 ? t : 1,
      n = (i || (e ? 0.3 : 0.45)) / (t < 1 ? t : 1),
      s = (n / Gt) * (Math.asin(1 / r) || 0),
      a = function (h) {
        return h === 1 ? 1 : r * Math.pow(2, -10 * h) * ln((h - s) * n) + 1;
      },
      o =
        e === "out"
          ? a
          : e === "in"
            ? function (l) {
                return 1 - a(1 - l);
              }
            : Pr(a);
    return (
      (n = Gt / n),
      (o.config = function (l, h) {
        return u(e, l, h);
      }),
      o
    );
  },
  jt = function u(e, t) {
    t === void 0 && (t = 1.70158);
    var i = function (s) {
        return s ? --s * s * ((t + 1) * s + t) + 1 : 0;
      },
      r =
        e === "out"
          ? i
          : e === "in"
            ? function (n) {
                return 1 - i(1 - n);
              }
            : Pr(i);
    return (
      (r.config = function (n) {
        return u(e, n);
      }),
      r
    );
  };
ne("Linear,Quad,Cubic,Quart,Quint,Strong", function (u, e) {
  var t = e < 5 ? e + 1 : e;
  Ye(
    u + ",Power" + (t - 1),
    e
      ? function (i) {
          return Math.pow(i, t);
        }
      : function (i) {
          return i;
        },
    function (i) {
      return 1 - Math.pow(1 - i, t);
    },
    function (i) {
      return i < 0.5
        ? Math.pow(i * 2, t) / 2
        : 1 - Math.pow((1 - i) * 2, t) / 2;
    },
  );
});
$.Linear.easeNone = $.none = $.Linear.easeIn;
Ye("Elastic", Ut("in"), Ut("out"), Ut());
(function (u, e) {
  var t = 1 / e,
    i = 2 * t,
    r = 2.5 * t,
    n = function (a) {
      return a < t
        ? u * a * a
        : a < i
          ? u * Math.pow(a - 1.5 / e, 2) + 0.75
          : a < r
            ? u * (a -= 2.25 / e) * a + 0.9375
            : u * Math.pow(a - 2.625 / e, 2) + 0.984375;
    };
  Ye(
    "Bounce",
    function (s) {
      return 1 - n(1 - s);
    },
    n,
  );
})(7.5625, 2.75);
Ye("Expo", function (u) {
  return u ? Math.pow(2, 10 * (u - 1)) : 0;
});
Ye("Circ", function (u) {
  return -(Zi(1 - u * u) - 1);
});
Ye("Sine", function (u) {
  return u === 1 ? 1 : -un(u * an) + 1;
});
Ye("Back", jt("in"), jt("out"), jt());
$.SteppedEase =
  $.steps =
  he.SteppedEase =
    {
      config: function (e, t) {
        e === void 0 && (e = 1);
        var i = 1 / e,
          r = e + (t ? 0 : 1),
          n = t ? 1 : 0,
          s = 1 - q;
        return function (a) {
          return (((r * vt(0, s, a)) | 0) + n) * i;
        };
      },
    };
et.ease = $["quad.out"];
ne(
  "onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt",
  function (u) {
    return (yi += u + "," + u + "Params,");
  },
);
var Or = function (e, t) {
    (this.id = on++),
      (e._gsap = this),
      (this.target = e),
      (this.harness = t),
      (this.get = t ? t.get : ar),
      (this.set = t ? t.getSetter : Ti);
  },
  _t = (function () {
    function u(t) {
      (this.vars = t),
        (this._delay = +t.delay || 0),
        (this._repeat = t.repeat === 1 / 0 ? -2 : t.repeat || 0) &&
          ((this._rDelay = t.repeatDelay || 0),
          (this._yoyo = !!t.yoyo || !!t.yoyoEase)),
        (this._ts = 1),
        it(this, +t.duration, 1, 1),
        (this.data = t.data),
        Y && ((this._ctx = Y), Y.data.push(this)),
        dt || ue.wake();
    }
    var e = u.prototype;
    return (
      (e.delay = function (i) {
        return i || i === 0
          ? (this.parent &&
              this.parent.smoothChildTiming &&
              this.startTime(this._start + i - this._delay),
            (this._delay = i),
            this)
          : this._delay;
      }),
      (e.duration = function (i) {
        return arguments.length
          ? this.totalDuration(
              this._repeat > 0 ? i + (i + this._rDelay) * this._repeat : i,
            )
          : this.totalDuration() && this._dur;
      }),
      (e.totalDuration = function (i) {
        return arguments.length
          ? ((this._dirty = 0),
            it(
              this,
              this._repeat < 0
                ? i
                : (i - this._repeat * this._rDelay) / (this._repeat + 1),
            ))
          : this._tDur;
      }),
      (e.totalTime = function (i, r) {
        if ((rt(), !arguments.length)) return this._tTime;
        var n = this._dp;
        if (n && n.smoothChildTiming && this._ts) {
          for (Rt(this, i), !n._dp || n.parent || cr(n, this); n && n.parent; )
            n.parent._time !==
              n._start +
                (n._ts >= 0
                  ? n._tTime / n._ts
                  : (n.totalDuration() - n._tTime) / -n._ts) &&
              n.totalTime(n._tTime, !0),
              (n = n.parent);
          !this.parent &&
            this._dp.autoRemoveChildren &&
            ((this._ts > 0 && i < this._tDur) ||
              (this._ts < 0 && i > 0) ||
              (!this._tDur && !i)) &&
            we(this._dp, this, this._start - this._delay);
        }
        return (
          (this._tTime !== i ||
            (!this._dur && !r) ||
            (this._initted && Math.abs(this._zTime) === q) ||
            (!i && !this._initted && (this.add || this._ptLookup))) &&
            (this._ts || (this._pTime = i), or(this, i, r)),
          this
        );
      }),
      (e.time = function (i, r) {
        return arguments.length
          ? this.totalTime(
              Math.min(this.totalDuration(), i + zi(this)) %
                (this._dur + this._rDelay) || (i ? this._dur : 0),
              r,
            )
          : this._time;
      }),
      (e.totalProgress = function (i, r) {
        return arguments.length
          ? this.totalTime(this.totalDuration() * i, r)
          : this.totalDuration()
            ? Math.min(1, this._tTime / this._tDur)
            : this.ratio;
      }),
      (e.progress = function (i, r) {
        return arguments.length
          ? this.totalTime(
              this.duration() *
                (this._yoyo && !(this.iteration() & 1) ? 1 - i : i) +
                zi(this),
              r,
            )
          : this.duration()
            ? Math.min(1, this._time / this._dur)
            : this.ratio;
      }),
      (e.iteration = function (i, r) {
        var n = this.duration() + this._rDelay;
        return arguments.length
          ? this.totalTime(this._time + (i - 1) * n, r)
          : this._repeat
            ? tt(this._tTime, n) + 1
            : 1;
      }),
      (e.timeScale = function (i) {
        if (!arguments.length) return this._rts === -q ? 0 : this._rts;
        if (this._rts === i) return this;
        var r =
          this.parent && this._ts ? Et(this.parent._time, this) : this._tTime;
        return (
          (this._rts = +i || 0),
          (this._ts = this._ps || i === -q ? 0 : this._rts),
          this.totalTime(vt(-Math.abs(this._delay), this._tDur, r), !0),
          zt(this),
          mn(this)
        );
      }),
      (e.paused = function (i) {
        return arguments.length
          ? (this._ps !== i &&
              ((this._ps = i),
              i
                ? ((this._pTime =
                    this._tTime || Math.max(-this._delay, this.rawTime())),
                  (this._ts = this._act = 0))
                : (rt(),
                  (this._ts = this._rts),
                  this.totalTime(
                    this.parent && !this.parent.smoothChildTiming
                      ? this.rawTime()
                      : this._tTime || this._pTime,
                    this.progress() === 1 &&
                      Math.abs(this._zTime) !== q &&
                      (this._tTime -= q),
                  ))),
            this)
          : this._ps;
      }),
      (e.startTime = function (i) {
        if (arguments.length) {
          this._start = i;
          var r = this.parent || this._dp;
          return (
            r && (r._sort || !this.parent) && we(r, this, i - this._delay), this
          );
        }
        return this._start;
      }),
      (e.endTime = function (i) {
        return (
          this._start +
          (re(i) ? this.totalDuration() : this.duration()) /
            Math.abs(this._ts || 1)
        );
      }),
      (e.rawTime = function (i) {
        var r = this.parent || this._dp;
        return r
          ? i &&
            (!this._ts ||
              (this._repeat && this._time && this.totalProgress() < 1))
            ? this._tTime % (this._dur + this._rDelay)
            : this._ts
              ? Et(r.rawTime(i), this)
              : this._tTime
          : this._tTime;
      }),
      (e.revert = function (i) {
        i === void 0 && (i = fn);
        var r = ee;
        return (
          (ee = i),
          (this._initted || this._startAt) &&
            (this.timeline && this.timeline.revert(i),
            this.totalTime(-0.01, i.suppressEvents)),
          this.data !== "nested" && i.kill !== !1 && this.kill(),
          (ee = r),
          this
        );
      }),
      (e.globalTime = function (i) {
        for (var r = this, n = arguments.length ? i : r.rawTime(); r; )
          (n = r._start + n / (r._ts || 1)), (r = r._dp);
        return !this.parent && this._sat
          ? this._sat.vars.immediateRender
            ? -1 / 0
            : this._sat.globalTime(i)
          : n;
      }),
      (e.repeat = function (i) {
        return arguments.length
          ? ((this._repeat = i === 1 / 0 ? -2 : i), Ri(this))
          : this._repeat === -2
            ? 1 / 0
            : this._repeat;
      }),
      (e.repeatDelay = function (i) {
        if (arguments.length) {
          var r = this._time;
          return (this._rDelay = i), Ri(this), r ? this.time(r) : this;
        }
        return this._rDelay;
      }),
      (e.yoyo = function (i) {
        return arguments.length ? ((this._yoyo = i), this) : this._yoyo;
      }),
      (e.seek = function (i, r) {
        return this.totalTime(de(this, i), re(r));
      }),
      (e.restart = function (i, r) {
        return this.play().totalTime(i ? -this._delay : 0, re(r));
      }),
      (e.play = function (i, r) {
        return i != null && this.seek(i, r), this.reversed(!1).paused(!1);
      }),
      (e.reverse = function (i, r) {
        return (
          i != null && this.seek(i || this.totalDuration(), r),
          this.reversed(!0).paused(!1)
        );
      }),
      (e.pause = function (i, r) {
        return i != null && this.seek(i, r), this.paused(!0);
      }),
      (e.resume = function () {
        return this.paused(!1);
      }),
      (e.reversed = function (i) {
        return arguments.length
          ? (!!i !== this.reversed() &&
              this.timeScale(-this._rts || (i ? -q : 0)),
            this)
          : this._rts < 0;
      }),
      (e.invalidate = function () {
        return (this._initted = this._act = 0), (this._zTime = -q), this;
      }),
      (e.isActive = function () {
        var i = this.parent || this._dp,
          r = this._start,
          n;
        return !!(
          !i ||
          (this._ts &&
            this._initted &&
            i.isActive() &&
            (n = i.rawTime(!0)) >= r &&
            n < this.endTime(!0) - q)
        );
      }),
      (e.eventCallback = function (i, r, n) {
        var s = this.vars;
        return arguments.length > 1
          ? (r
              ? ((s[i] = r),
                n && (s[i + "Params"] = n),
                i === "onUpdate" && (this._onUpdate = r))
              : delete s[i],
            this)
          : s[i];
      }),
      (e.then = function (i) {
        var r = this;
        return new Promise(function (n) {
          var s = X(i) ? i : lr,
            a = function () {
              var l = r.then;
              (r.then = null),
                X(s) && (s = s(r)) && (s.then || s === r) && (r.then = l),
                n(s),
                (r.then = l);
            };
          (r._initted && r.totalProgress() === 1 && r._ts >= 0) ||
          (!r._tTime && r._ts < 0)
            ? a()
            : (r._prom = a);
        });
      }),
      (e.kill = function () {
        at(this);
      }),
      u
    );
  })();
ye(_t.prototype, {
  _time: 0,
  _start: 0,
  _end: 0,
  _tTime: 0,
  _tDur: 0,
  _dirty: 0,
  _repeat: 0,
  _yoyo: !1,
  parent: null,
  _initted: !1,
  _rDelay: 0,
  _ts: 1,
  _dp: 0,
  ratio: 0,
  _zTime: -q,
  _prom: 0,
  _ps: !1,
  _rts: 1,
});
var ie = (function (u) {
  Qi(e, u);
  function e(i, r) {
    var n;
    return (
      i === void 0 && (i = {}),
      (n = u.call(this, i) || this),
      (n.labels = {}),
      (n.smoothChildTiming = !!i.smoothChildTiming),
      (n.autoRemoveChildren = !!i.autoRemoveChildren),
      (n._sort = re(i.sortChildren)),
      j && we(i.parent || j, ke(n), r),
      i.reversed && n.reverse(),
      i.paused && n.paused(!0),
      i.scrollTrigger && fr(ke(n), i.scrollTrigger),
      n
    );
  }
  var t = e.prototype;
  return (
    (t.to = function (r, n, s) {
      return lt(0, arguments, this), this;
    }),
    (t.from = function (r, n, s) {
      return lt(1, arguments, this), this;
    }),
    (t.fromTo = function (r, n, s, a) {
      return lt(2, arguments, this), this;
    }),
    (t.set = function (r, n, s) {
      return (
        (n.duration = 0),
        (n.parent = this),
        ut(n).repeatDelay || (n.repeat = 0),
        (n.immediateRender = !!n.immediateRender),
        new G(r, n, de(this, s), 1),
        this
      );
    }),
    (t.call = function (r, n, s) {
      return we(this, G.delayedCall(0, r, n), s);
    }),
    (t.staggerTo = function (r, n, s, a, o, l, h) {
      return (
        (s.duration = n),
        (s.stagger = s.stagger || a),
        (s.onComplete = l),
        (s.onCompleteParams = h),
        (s.parent = this),
        new G(r, s, de(this, o)),
        this
      );
    }),
    (t.staggerFrom = function (r, n, s, a, o, l, h) {
      return (
        (s.runBackwards = 1),
        (ut(s).immediateRender = re(s.immediateRender)),
        this.staggerTo(r, n, s, a, o, l, h)
      );
    }),
    (t.staggerFromTo = function (r, n, s, a, o, l, h, f) {
      return (
        (a.startAt = s),
        (ut(a).immediateRender = re(a.immediateRender)),
        this.staggerTo(r, n, a, o, l, h, f)
      );
    }),
    (t.render = function (r, n, s) {
      var a = this._time,
        o = this._dirty ? this.totalDuration() : this._tDur,
        l = this._dur,
        h = r <= 0 ? 0 : K(r),
        f = this._zTime < 0 != r < 0 && (this._initted || !l),
        d,
        _,
        g,
        c,
        y,
        v,
        w,
        x,
        T,
        b,
        M,
        C;
      if (
        (this !== j && h > o && r >= 0 && (h = o), h !== this._tTime || s || f)
      ) {
        if (
          (a !== this._time &&
            l &&
            ((h += this._time - a), (r += this._time - a)),
          (d = h),
          (T = this._start),
          (x = this._ts),
          (v = !x),
          f && (l || (a = this._zTime), (r || !n) && (this._zTime = r)),
          this._repeat)
        ) {
          if (
            ((M = this._yoyo),
            (y = l + this._rDelay),
            this._repeat < -1 && r < 0)
          )
            return this.totalTime(y * 100 + r, n, s);
          if (
            ((d = K(h % y)),
            h === o
              ? ((c = this._repeat), (d = l))
              : ((c = ~~(h / y)),
                c && c === h / y && ((d = l), c--),
                d > l && (d = l)),
            (b = tt(this._tTime, y)),
            !a &&
              this._tTime &&
              b !== c &&
              this._tTime - b * y - this._dur <= 0 &&
              (b = c),
            M && c & 1 && ((d = l - d), (C = 1)),
            c !== b && !this._lock)
          ) {
            var S = M && b & 1,
              k = S === (M && c & 1);
            if (
              (c < b && (S = !S),
              (a = S ? 0 : h % l ? l : h),
              (this._lock = 1),
              (this.render(a || (C ? 0 : K(c * y)), n, !l)._lock = 0),
              (this._tTime = h),
              !n && this.parent && ge(this, "onRepeat"),
              this.vars.repeatRefresh && !C && (this.invalidate()._lock = 1),
              (a && a !== this._time) ||
                v !== !this._ts ||
                (this.vars.onRepeat && !this.parent && !this._act))
            )
              return this;
            if (
              ((l = this._dur),
              (o = this._tDur),
              k &&
                ((this._lock = 2),
                (a = S ? l : -1e-4),
                this.render(a, !0),
                this.vars.repeatRefresh && !C && this.invalidate()),
              (this._lock = 0),
              !this._ts && !v)
            )
              return this;
            Mr(this, C);
          }
        }
        if (
          (this._hasPause &&
            !this._forcing &&
            this._lock < 2 &&
            ((w = wn(this, K(a), K(d))), w && (h -= d - (d = w._start))),
          (this._tTime = h),
          (this._time = d),
          (this._act = !x),
          this._initted ||
            ((this._onUpdate = this.vars.onUpdate),
            (this._initted = 1),
            (this._zTime = r),
            (a = 0)),
          !a && d && !n && !c && (ge(this, "onStart"), this._tTime !== h))
        )
          return this;
        if (d >= a && r >= 0)
          for (_ = this._first; _; ) {
            if (
              ((g = _._next), (_._act || d >= _._start) && _._ts && w !== _)
            ) {
              if (_.parent !== this) return this.render(r, n, s);
              if (
                (_.render(
                  _._ts > 0
                    ? (d - _._start) * _._ts
                    : (_._dirty ? _.totalDuration() : _._tDur) +
                        (d - _._start) * _._ts,
                  n,
                  s,
                ),
                d !== this._time || (!this._ts && !v))
              ) {
                (w = 0), g && (h += this._zTime = -q);
                break;
              }
            }
            _ = g;
          }
        else {
          _ = this._last;
          for (var R = r < 0 ? r : d; _; ) {
            if (((g = _._prev), (_._act || R <= _._end) && _._ts && w !== _)) {
              if (_.parent !== this) return this.render(r, n, s);
              if (
                (_.render(
                  _._ts > 0
                    ? (R - _._start) * _._ts
                    : (_._dirty ? _.totalDuration() : _._tDur) +
                        (R - _._start) * _._ts,
                  n,
                  s || (ee && (_._initted || _._startAt)),
                ),
                d !== this._time || (!this._ts && !v))
              ) {
                (w = 0), g && (h += this._zTime = R ? -q : q);
                break;
              }
            }
            _ = g;
          }
        }
        if (
          w &&
          !n &&
          (this.pause(),
          (w.render(d >= a ? 0 : -q)._zTime = d >= a ? 1 : -1),
          this._ts)
        )
          return (this._start = T), zt(this), this.render(r, n, s);
        this._onUpdate && !n && ge(this, "onUpdate", !0),
          ((h === o && this._tTime >= this.totalDuration()) || (!h && a)) &&
            (T === this._start || Math.abs(x) !== Math.abs(this._ts)) &&
            (this._lock ||
              ((r || !l) &&
                ((h === o && this._ts > 0) || (!h && this._ts < 0)) &&
                De(this, 1),
              !n &&
                !(r < 0 && !a) &&
                (h || a || !o) &&
                (ge(
                  this,
                  h === o && r >= 0 ? "onComplete" : "onReverseComplete",
                  !0,
                ),
                this._prom &&
                  !(h < o && this.timeScale() > 0) &&
                  this._prom())));
      }
      return this;
    }),
    (t.add = function (r, n) {
      var s = this;
      if ((Ce(n) || (n = de(this, n, r)), !(r instanceof _t))) {
        if (te(r))
          return (
            r.forEach(function (a) {
              return s.add(a, n);
            }),
            this
          );
        if (Z(r)) return this.addLabel(r, n);
        if (X(r)) r = G.delayedCall(0, r);
        else return this;
      }
      return this !== r ? we(this, r, n) : this;
    }),
    (t.getChildren = function (r, n, s, a) {
      r === void 0 && (r = !0),
        n === void 0 && (n = !0),
        s === void 0 && (s = !0),
        a === void 0 && (a = -pe);
      for (var o = [], l = this._first; l; )
        l._start >= a &&
          (l instanceof G
            ? n && o.push(l)
            : (s && o.push(l), r && o.push.apply(o, l.getChildren(!0, n, s)))),
          (l = l._next);
      return o;
    }),
    (t.getById = function (r) {
      for (var n = this.getChildren(1, 1, 1), s = n.length; s--; )
        if (n[s].vars.id === r) return n[s];
    }),
    (t.remove = function (r) {
      return Z(r)
        ? this.removeLabel(r)
        : X(r)
          ? this.killTweensOf(r)
          : ($t(this, r),
            r === this._recent && (this._recent = this._last),
            Be(this));
    }),
    (t.totalTime = function (r, n) {
      return arguments.length
        ? ((this._forcing = 1),
          !this._dp &&
            this._ts &&
            (this._start = K(
              ue.time -
                (this._ts > 0
                  ? r / this._ts
                  : (this.totalDuration() - r) / -this._ts),
            )),
          u.prototype.totalTime.call(this, r, n),
          (this._forcing = 0),
          this)
        : this._tTime;
    }),
    (t.addLabel = function (r, n) {
      return (this.labels[r] = de(this, n)), this;
    }),
    (t.removeLabel = function (r) {
      return delete this.labels[r], this;
    }),
    (t.addPause = function (r, n, s) {
      var a = G.delayedCall(0, n || ct, s);
      return (
        (a.data = "isPause"), (this._hasPause = 1), we(this, a, de(this, r))
      );
    }),
    (t.removePause = function (r) {
      var n = this._first;
      for (r = de(this, r); n; )
        n._start === r && n.data === "isPause" && De(n), (n = n._next);
    }),
    (t.killTweensOf = function (r, n, s) {
      for (var a = this.getTweensOf(r, s), o = a.length; o--; )
        Pe !== a[o] && a[o].kill(r, n);
      return this;
    }),
    (t.getTweensOf = function (r, n) {
      for (var s = [], a = me(r), o = this._first, l = Ce(n), h; o; )
        o instanceof G
          ? dn(o._targets, a) &&
            (l
              ? (!Pe || (o._initted && o._ts)) &&
                o.globalTime(0) <= n &&
                o.globalTime(o.totalDuration()) > n
              : !n || o.isActive()) &&
            s.push(o)
          : (h = o.getTweensOf(a, n)).length && s.push.apply(s, h),
          (o = o._next);
      return s;
    }),
    (t.tweenTo = function (r, n) {
      n = n || {};
      var s = this,
        a = de(s, r),
        o = n,
        l = o.startAt,
        h = o.onStart,
        f = o.onStartParams,
        d = o.immediateRender,
        _,
        g = G.to(
          s,
          ye(
            {
              ease: n.ease || "none",
              lazy: !1,
              immediateRender: !1,
              time: a,
              overwrite: "auto",
              duration:
                n.duration ||
                Math.abs(
                  (a - (l && "time" in l ? l.time : s._time)) / s.timeScale(),
                ) ||
                q,
              onStart: function () {
                if ((s.pause(), !_)) {
                  var y =
                    n.duration ||
                    Math.abs(
                      (a - (l && "time" in l ? l.time : s._time)) /
                        s.timeScale(),
                    );
                  g._dur !== y && it(g, y, 0, 1).render(g._time, !0, !0),
                    (_ = 1);
                }
                h && h.apply(g, f || []);
              },
            },
            n,
          ),
        );
      return d ? g.render(0) : g;
    }),
    (t.tweenFromTo = function (r, n, s) {
      return this.tweenTo(n, ye({ startAt: { time: de(this, r) } }, s));
    }),
    (t.recent = function () {
      return this._recent;
    }),
    (t.nextLabel = function (r) {
      return r === void 0 && (r = this._time), Fi(this, de(this, r));
    }),
    (t.previousLabel = function (r) {
      return r === void 0 && (r = this._time), Fi(this, de(this, r), 1);
    }),
    (t.currentLabel = function (r) {
      return arguments.length
        ? this.seek(r, !0)
        : this.previousLabel(this._time + q);
    }),
    (t.shiftChildren = function (r, n, s) {
      s === void 0 && (s = 0);
      for (var a = this._first, o = this.labels, l; a; )
        a._start >= s && ((a._start += r), (a._end += r)), (a = a._next);
      if (n) for (l in o) o[l] >= s && (o[l] += r);
      return Be(this);
    }),
    (t.invalidate = function (r) {
      var n = this._first;
      for (this._lock = 0; n; ) n.invalidate(r), (n = n._next);
      return u.prototype.invalidate.call(this, r);
    }),
    (t.clear = function (r) {
      r === void 0 && (r = !0);
      for (var n = this._first, s; n; ) (s = n._next), this.remove(n), (n = s);
      return (
        this._dp && (this._time = this._tTime = this._pTime = 0),
        r && (this.labels = {}),
        Be(this)
      );
    }),
    (t.totalDuration = function (r) {
      var n = 0,
        s = this,
        a = s._last,
        o = pe,
        l,
        h,
        f;
      if (arguments.length)
        return s.timeScale(
          (s._repeat < 0 ? s.duration() : s.totalDuration()) /
            (s.reversed() ? -r : r),
        );
      if (s._dirty) {
        for (f = s.parent; a; )
          (l = a._prev),
            a._dirty && a.totalDuration(),
            (h = a._start),
            h > o && s._sort && a._ts && !s._lock
              ? ((s._lock = 1), (we(s, a, h - a._delay, 1)._lock = 0))
              : (o = h),
            h < 0 &&
              a._ts &&
              ((n -= h),
              ((!f && !s._dp) || (f && f.smoothChildTiming)) &&
                ((s._start += h / s._ts), (s._time -= h), (s._tTime -= h)),
              s.shiftChildren(-h, !1, -1 / 0),
              (o = 0)),
            a._end > n && a._ts && (n = a._end),
            (a = l);
        it(s, s === j && s._time > n ? s._time : n, 1, 1), (s._dirty = 0);
      }
      return s._tDur;
    }),
    (e.updateRoot = function (r) {
      if ((j._ts && (or(j, Et(r, j)), (sr = ue.frame)), ue.frame >= Di)) {
        Di += le.autoSleep || 120;
        var n = j._first;
        if ((!n || !n._ts) && le.autoSleep && ue._listeners.length < 2) {
          for (; n && !n._ts; ) n = n._next;
          n || ue.sleep();
        }
      }
    }),
    e
  );
})(_t);
ye(ie.prototype, { _lock: 0, _hasPause: 0, _forcing: 0 });
var Rn = function (e, t, i, r, n, s, a) {
    var o = new se(this._pt, e, t, 0, 1, zr, null, n),
      l = 0,
      h = 0,
      f,
      d,
      _,
      g,
      c,
      y,
      v,
      w;
    for (
      o.b = i,
        o.e = r,
        i += "",
        r += "",
        (v = ~r.indexOf("random(")) && (r = ft(r)),
        s && ((w = [i, r]), s(w, e, t), (i = w[0]), (r = w[1])),
        d = i.match(qt) || [];
      (f = qt.exec(r));

    )
      (g = f[0]),
        (c = r.substring(l, f.index)),
        _ ? (_ = (_ + 1) % 5) : c.substr(-5) === "rgba(" && (_ = 1),
        g !== d[h++] &&
          ((y = parseFloat(d[h - 1]) || 0),
          (o._pt = {
            _next: o._pt,
            p: c || h === 1 ? c : ",",
            s: y,
            c: g.charAt(1) === "=" ? Ze(y, g) - y : parseFloat(g) - y,
            m: _ && _ < 4 ? Math.round : 0,
          }),
          (l = qt.lastIndex));
    return (
      (o.c = l < r.length ? r.substring(l, r.length) : ""),
      (o.fp = a),
      (er.test(r) || v) && (o.e = 0),
      (this._pt = o),
      o
    );
  },
  wi = function (e, t, i, r, n, s, a, o, l, h) {
    X(r) && (r = r(n || 0, e, s));
    var f = e[t],
      d =
        i !== "get"
          ? i
          : X(f)
            ? l
              ? e[
                  t.indexOf("set") || !X(e["get" + t.substr(3)])
                    ? t
                    : "get" + t.substr(3)
                ](l)
              : e[t]()
            : f,
      _ = X(f) ? (l ? Vn : Dr) : xi,
      g;
    if (
      (Z(r) &&
        (~r.indexOf("random(") && (r = ft(r)),
        r.charAt(1) === "=" &&
          ((g = Ze(d, r) + (J(d) || 0)), (g || g === 0) && (r = g))),
      !h || d !== r || ni)
    )
      return !isNaN(d * r) && r !== ""
        ? ((g = new se(
            this._pt,
            e,
            t,
            +d || 0,
            r - (d || 0),
            typeof f == "boolean" ? Un : $r,
            0,
            _,
          )),
          l && (g.fp = l),
          a && g.modifier(a, this, e),
          (this._pt = g))
        : (!f && !(t in e) && mi(t, r),
          Rn.call(this, e, t, d, r, _, o || le.stringFilter, l));
  },
  Fn = function (e, t, i, r, n) {
    if (
      (X(e) && (e = ht(e, n, t, i, r)),
      !Te(e) || (e.style && e.nodeType) || te(e) || Ki(e))
    )
      return Z(e) ? ht(e, n, t, i, r) : e;
    var s = {},
      a;
    for (a in e) s[a] = ht(e[a], n, t, i, r);
    return s;
  },
  Er = function (e, t, i, r, n, s) {
    var a, o, l, h;
    if (
      oe[e] &&
      (a = new oe[e]()).init(
        n,
        a.rawVars ? t[e] : Fn(t[e], r, n, s, i),
        i,
        r,
        s,
      ) !== !1 &&
      ((i._pt = o = new se(i._pt, n, e, 0, 1, a.render, a, 0, a.priority)),
      i !== Qe)
    )
      for (l = i._ptLookup[i._targets.indexOf(n)], h = a._props.length; h--; )
        l[a._props[h]] = o;
    return a;
  },
  Pe,
  ni,
  bi = function u(e, t, i) {
    var r = e.vars,
      n = r.ease,
      s = r.startAt,
      a = r.immediateRender,
      o = r.lazy,
      l = r.onUpdate,
      h = r.onUpdateParams,
      f = r.callbackScope,
      d = r.runBackwards,
      _ = r.yoyoEase,
      g = r.keyframes,
      c = r.autoRevert,
      y = e._dur,
      v = e._startAt,
      w = e._targets,
      x = e.parent,
      T = x && x.data === "nested" ? x.vars.targets : w,
      b = e._overwrite === "auto" && !fi,
      M = e.timeline,
      C,
      S,
      k,
      R,
      F,
      V,
      U,
      m,
      p,
      O,
      P,
      E,
      D;
    if (
      (M && (!g || !n) && (n = "none"),
      (e._ease = Ue(n, et.ease)),
      (e._yEase = _ ? Cr(Ue(_ === !0 ? n : _, et.ease)) : 0),
      _ &&
        e._yoyo &&
        !e._repeat &&
        ((_ = e._yEase), (e._yEase = e._ease), (e._ease = _)),
      (e._from = !M && !!r.runBackwards),
      !M || (g && !r.stagger))
    ) {
      if (
        ((m = w[0] ? Ve(w[0]).harness : 0),
        (E = m && r[m.prop]),
        (C = Ot(r, gi)),
        v &&
          (v._zTime < 0 && v.progress(1),
          t < 0 && d && a && !c ? v.render(-1, !0) : v.revert(d && y ? Tt : cn),
          (v._lazy = 0)),
        s)
      ) {
        if (
          (De(
            (e._startAt = G.set(
              w,
              ye(
                {
                  data: "isStart",
                  overwrite: !1,
                  parent: x,
                  immediateRender: !0,
                  lazy: !v && re(o),
                  startAt: null,
                  delay: 0,
                  onUpdate: l,
                  onUpdateParams: h,
                  callbackScope: f,
                  stagger: 0,
                },
                s,
              ),
            )),
          ),
          (e._startAt._dp = 0),
          (e._startAt._sat = e),
          t < 0 && (ee || (!a && !c)) && e._startAt.revert(Tt),
          a && y && t <= 0 && i <= 0)
        ) {
          t && (e._zTime = t);
          return;
        }
      } else if (d && y && !v) {
        if (
          (t && (a = !1),
          (k = ye(
            {
              overwrite: !1,
              data: "isFromStart",
              lazy: a && !v && re(o),
              immediateRender: a,
              stagger: 0,
              parent: x,
            },
            C,
          )),
          E && (k[m.prop] = E),
          De((e._startAt = G.set(w, k))),
          (e._startAt._dp = 0),
          (e._startAt._sat = e),
          t < 0 && (ee ? e._startAt.revert(Tt) : e._startAt.render(-1, !0)),
          (e._zTime = t),
          !a)
        )
          u(e._startAt, q, q);
        else if (!t) return;
      }
      for (
        e._pt = e._ptCache = 0, o = (y && re(o)) || (o && !y), S = 0;
        S < w.length;
        S++
      ) {
        if (
          ((F = w[S]),
          (U = F._gsap || vi(w)[S]._gsap),
          (e._ptLookup[S] = O = {}),
          Kt[U.id] && Ae.length && Pt(),
          (P = T === w ? S : T.indexOf(F)),
          m &&
            (p = new m()).init(F, E || C, e, P, T) !== !1 &&
            ((e._pt = R =
              new se(e._pt, F, p.name, 0, 1, p.render, p, 0, p.priority)),
            p._props.forEach(function (A) {
              O[A] = R;
            }),
            p.priority && (V = 1)),
          !m || E)
        )
          for (k in C)
            oe[k] && (p = Er(k, C, e, P, F, T))
              ? p.priority && (V = 1)
              : (O[k] = R =
                  wi.call(e, F, k, "get", C[k], P, T, 0, r.stringFilter));
        e._op && e._op[S] && e.kill(F, e._op[S]),
          b &&
            e._pt &&
            ((Pe = e),
            j.killTweensOf(F, O, e.globalTime(t)),
            (D = !e.parent),
            (Pe = 0)),
          e._pt && o && (Kt[U.id] = 1);
      }
      V && Rr(e), e._onInit && e._onInit(e);
    }
    (e._onUpdate = l),
      (e._initted = (!e._op || e._pt) && !D),
      g && t <= 0 && M.render(pe, !0, !0);
  },
  In = function (e, t, i, r, n, s, a) {
    var o = ((e._pt && e._ptCache) || (e._ptCache = {}))[t],
      l,
      h,
      f,
      d;
    if (!o)
      for (
        o = e._ptCache[t] = [], f = e._ptLookup, d = e._targets.length;
        d--;

      ) {
        if (((l = f[d][t]), l && l.d && l.d._pt))
          for (l = l.d._pt; l && l.p !== t && l.fp !== t; ) l = l._next;
        if (!l) return (ni = 1), (e.vars[t] = "+=0"), bi(e, a), (ni = 0), 1;
        o.push(l);
      }
    for (d = o.length; d--; )
      (h = o[d]),
        (l = h._pt || h),
        (l.s = (r || r === 0) && !n ? r : l.s + (r || 0) + s * l.c),
        (l.c = i - l.s),
        h.e && (h.e = H(i) + J(h.e)),
        h.b && (h.b = l.s + J(h.b));
  },
  Nn = function (e, t) {
    var i = e[0] ? Ve(e[0]).harness : 0,
      r = i && i.aliases,
      n,
      s,
      a,
      o;
    if (!r) return t;
    n = We({}, t);
    for (s in r)
      if (s in n) for (o = r[s].split(","), a = o.length; a--; ) n[o[a]] = n[s];
    return n;
  },
  qn = function (e, t, i, r) {
    var n = t.ease || r || "power1.inOut",
      s,
      a;
    if (te(t))
      (a = i[e] || (i[e] = [])),
        t.forEach(function (o, l) {
          return a.push({ t: (l / (t.length - 1)) * 100, v: o, e: n });
        });
    else
      for (s in t)
        (a = i[s] || (i[s] = [])),
          s === "ease" || a.push({ t: parseFloat(e), v: t[s], e: n });
  },
  ht = function (e, t, i, r, n) {
    return X(e)
      ? e.call(t, i, r, n)
      : Z(e) && ~e.indexOf("random(")
        ? ft(e)
        : e;
  },
  Ar = yi + "repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,autoRevert",
  Lr = {};
ne(Ar + ",id,stagger,delay,duration,paused,scrollTrigger", function (u) {
  return (Lr[u] = 1);
});
var G = (function (u) {
  Qi(e, u);
  function e(i, r, n, s) {
    var a;
    typeof r == "number" && ((n.duration = r), (r = n), (n = null)),
      (a = u.call(this, s ? r : ut(r)) || this);
    var o = a.vars,
      l = o.duration,
      h = o.delay,
      f = o.immediateRender,
      d = o.stagger,
      _ = o.overwrite,
      g = o.keyframes,
      c = o.defaults,
      y = o.scrollTrigger,
      v = o.yoyoEase,
      w = r.parent || j,
      x = (te(i) || Ki(i) ? Ce(i[0]) : "length" in r) ? [i] : me(i),
      T,
      b,
      M,
      C,
      S,
      k,
      R,
      F;
    if (
      ((a._targets = x.length
        ? vi(x)
        : Mt(
            "GSAP target " + i + " not found. https://greensock.com",
            !le.nullTargetWarn,
          ) || []),
      (a._ptLookup = []),
      (a._overwrite = _),
      g || d || xt(l) || xt(h))
    ) {
      if (
        ((r = a.vars),
        (T = a.timeline =
          new ie({
            data: "nested",
            defaults: c || {},
            targets: w && w.data === "nested" ? w.vars.targets : x,
          })),
        T.kill(),
        (T.parent = T._dp = ke(a)),
        (T._start = 0),
        d || xt(l) || xt(h))
      ) {
        if (((C = x.length), (R = d && mr(d)), Te(d)))
          for (S in d) ~Ar.indexOf(S) && (F || (F = {}), (F[S] = d[S]));
        for (b = 0; b < C; b++)
          (M = Ot(r, Lr)),
            (M.stagger = 0),
            v && (M.yoyoEase = v),
            F && We(M, F),
            (k = x[b]),
            (M.duration = +ht(l, ke(a), b, k, x)),
            (M.delay = (+ht(h, ke(a), b, k, x) || 0) - a._delay),
            !d &&
              C === 1 &&
              M.delay &&
              ((a._delay = h = M.delay), (a._start += h), (M.delay = 0)),
            T.to(k, M, R ? R(b, k, x) : 0),
            (T._ease = $.none);
        T.duration() ? (l = h = 0) : (a.timeline = 0);
      } else if (g) {
        ut(ye(T.vars.defaults, { ease: "none" })),
          (T._ease = Ue(g.ease || r.ease || "none"));
        var V = 0,
          U,
          m,
          p;
        if (te(g))
          g.forEach(function (O) {
            return T.to(x, O, ">");
          }),
            T.duration();
        else {
          M = {};
          for (S in g)
            S === "ease" || S === "easeEach" || qn(S, g[S], M, g.easeEach);
          for (S in M)
            for (
              U = M[S].sort(function (O, P) {
                return O.t - P.t;
              }),
                V = 0,
                b = 0;
              b < U.length;
              b++
            )
              (m = U[b]),
                (p = {
                  ease: m.e,
                  duration: ((m.t - (b ? U[b - 1].t : 0)) / 100) * l,
                }),
                (p[S] = m.v),
                T.to(x, p, V),
                (V += p.duration);
          T.duration() < l && T.to({}, { duration: l - T.duration() });
        }
      }
      l || a.duration((l = T.duration()));
    } else a.timeline = 0;
    return (
      _ === !0 && !fi && ((Pe = ke(a)), j.killTweensOf(x), (Pe = 0)),
      we(w, ke(a), n),
      r.reversed && a.reverse(),
      r.paused && a.paused(!0),
      (f ||
        (!l &&
          !g &&
          a._start === K(w._time) &&
          re(f) &&
          gn(ke(a)) &&
          w.data !== "nested")) &&
        ((a._tTime = -q), a.render(Math.max(0, -h) || 0)),
      y && fr(ke(a), y),
      a
    );
  }
  var t = e.prototype;
  return (
    (t.render = function (r, n, s) {
      var a = this._time,
        o = this._tDur,
        l = this._dur,
        h = r < 0,
        f = r > o - q && !h ? o : r < q ? 0 : r,
        d,
        _,
        g,
        c,
        y,
        v,
        w,
        x,
        T;
      if (!l) vn(this, r, n, s);
      else if (
        f !== this._tTime ||
        !r ||
        s ||
        (!this._initted && this._tTime) ||
        (this._startAt && this._zTime < 0 !== h)
      ) {
        if (((d = f), (x = this.timeline), this._repeat)) {
          if (((c = l + this._rDelay), this._repeat < -1 && h))
            return this.totalTime(c * 100 + r, n, s);
          if (
            ((d = K(f % c)),
            f === o
              ? ((g = this._repeat), (d = l))
              : ((g = ~~(f / c)),
                g && g === f / c && ((d = l), g--),
                d > l && (d = l)),
            (v = this._yoyo && g & 1),
            v && ((T = this._yEase), (d = l - d)),
            (y = tt(this._tTime, c)),
            d === a && !s && this._initted)
          )
            return (this._tTime = f), this;
          g !== y &&
            (x && this._yEase && Mr(x, v),
            this.vars.repeatRefresh &&
              !v &&
              !this._lock &&
              ((this._lock = s = 1),
              (this.render(K(c * g), !0).invalidate()._lock = 0)));
        }
        if (!this._initted) {
          if (dr(this, h ? r : d, s, n, f)) return (this._tTime = 0), this;
          if (a !== this._time) return this;
          if (l !== this._dur) return this.render(r, n, s);
        }
        if (
          ((this._tTime = f),
          (this._time = d),
          !this._act && this._ts && ((this._act = 1), (this._lazy = 0)),
          (this.ratio = w = (T || this._ease)(d / l)),
          this._from && (this.ratio = w = 1 - w),
          d && !a && !n && !g && (ge(this, "onStart"), this._tTime !== f))
        )
          return this;
        for (_ = this._pt; _; ) _.r(w, _.d), (_ = _._next);
        (x &&
          x.render(
            r < 0 ? r : !d && v ? -q : x._dur * x._ease(d / this._dur),
            n,
            s,
          )) ||
          (this._startAt && (this._zTime = r)),
          this._onUpdate &&
            !n &&
            (h && Jt(this, r, n, s), ge(this, "onUpdate")),
          this._repeat &&
            g !== y &&
            this.vars.onRepeat &&
            !n &&
            this.parent &&
            ge(this, "onRepeat"),
          (f === this._tDur || !f) &&
            this._tTime === f &&
            (h && !this._onUpdate && Jt(this, r, !0, !0),
            (r || !l) &&
              ((f === this._tDur && this._ts > 0) || (!f && this._ts < 0)) &&
              De(this, 1),
            !n &&
              !(h && !a) &&
              (f || a || v) &&
              (ge(this, f === o ? "onComplete" : "onReverseComplete", !0),
              this._prom && !(f < o && this.timeScale() > 0) && this._prom()));
      }
      return this;
    }),
    (t.targets = function () {
      return this._targets;
    }),
    (t.invalidate = function (r) {
      return (
        (!r || !this.vars.runBackwards) && (this._startAt = 0),
        (this._pt = this._op = this._onUpdate = this._lazy = this.ratio = 0),
        (this._ptLookup = []),
        this.timeline && this.timeline.invalidate(r),
        u.prototype.invalidate.call(this, r)
      );
    }),
    (t.resetTo = function (r, n, s, a) {
      dt || ue.wake(), this._ts || this.play();
      var o = Math.min(this._dur, (this._dp._time - this._start) * this._ts),
        l;
      return (
        this._initted || bi(this, o),
        (l = this._ease(o / this._dur)),
        In(this, r, n, s, a, l, o)
          ? this.resetTo(r, n, s, a)
          : (Rt(this, 0),
            this.parent ||
              hr(
                this._dp,
                this,
                "_first",
                "_last",
                this._dp._sort ? "_start" : 0,
              ),
            this.render(0))
      );
    }),
    (t.kill = function (r, n) {
      if ((n === void 0 && (n = "all"), !r && (!n || n === "all")))
        return (this._lazy = this._pt = 0), this.parent ? at(this) : this;
      if (this.timeline) {
        var s = this.timeline.totalDuration();
        return (
          this.timeline.killTweensOf(r, n, Pe && Pe.vars.overwrite !== !0)
            ._first || at(this),
          this.parent &&
            s !== this.timeline.totalDuration() &&
            it(this, (this._dur * this.timeline._tDur) / s, 0, 1),
          this
        );
      }
      var a = this._targets,
        o = r ? me(r) : a,
        l = this._ptLookup,
        h = this._pt,
        f,
        d,
        _,
        g,
        c,
        y,
        v;
      if ((!n || n === "all") && pn(a, o))
        return n === "all" && (this._pt = 0), at(this);
      for (
        f = this._op = this._op || [],
          n !== "all" &&
            (Z(n) &&
              ((c = {}),
              ne(n, function (w) {
                return (c[w] = 1);
              }),
              (n = c)),
            (n = Nn(a, n))),
          v = a.length;
        v--;

      )
        if (~o.indexOf(a[v])) {
          (d = l[v]),
            n === "all"
              ? ((f[v] = n), (g = d), (_ = {}))
              : ((_ = f[v] = f[v] || {}), (g = n));
          for (c in g)
            (y = d && d[c]),
              y &&
                ((!("kill" in y.d) || y.d.kill(c) === !0) && $t(this, y, "_pt"),
                delete d[c]),
              _ !== "all" && (_[c] = 1);
        }
      return this._initted && !this._pt && h && at(this), this;
    }),
    (e.to = function (r, n) {
      return new e(r, n, arguments[2]);
    }),
    (e.from = function (r, n) {
      return lt(1, arguments);
    }),
    (e.delayedCall = function (r, n, s, a) {
      return new e(n, 0, {
        immediateRender: !1,
        lazy: !1,
        overwrite: !1,
        delay: r,
        onComplete: n,
        onReverseComplete: n,
        onCompleteParams: s,
        onReverseCompleteParams: s,
        callbackScope: a,
      });
    }),
    (e.fromTo = function (r, n, s) {
      return lt(2, arguments);
    }),
    (e.set = function (r, n) {
      return (n.duration = 0), n.repeatDelay || (n.repeat = 0), new e(r, n);
    }),
    (e.killTweensOf = function (r, n, s) {
      return j.killTweensOf(r, n, s);
    }),
    e
  );
})(_t);
ye(G.prototype, { _targets: [], _lazy: 0, _startAt: 0, _op: 0, _onInit: 0 });
ne("staggerTo,staggerFrom,staggerFromTo", function (u) {
  G[u] = function () {
    var e = new ie(),
      t = ti.call(arguments, 0);
    return t.splice(u === "staggerFromTo" ? 5 : 4, 0, 0), e[u].apply(e, t);
  };
});
var xi = function (e, t, i) {
    return (e[t] = i);
  },
  Dr = function (e, t, i) {
    return e[t](i);
  },
  Vn = function (e, t, i, r) {
    return e[t](r.fp, i);
  },
  Bn = function (e, t, i) {
    return e.setAttribute(t, i);
  },
  Ti = function (e, t) {
    return X(e[t]) ? Dr : di(e[t]) && e.setAttribute ? Bn : xi;
  },
  $r = function (e, t) {
    return t.set(t.t, t.p, Math.round((t.s + t.c * e) * 1e6) / 1e6, t);
  },
  Un = function (e, t) {
    return t.set(t.t, t.p, !!(t.s + t.c * e), t);
  },
  zr = function (e, t) {
    var i = t._pt,
      r = "";
    if (!e && t.b) r = t.b;
    else if (e === 1 && t.e) r = t.e;
    else {
      for (; i; )
        (r =
          i.p +
          (i.m ? i.m(i.s + i.c * e) : Math.round((i.s + i.c * e) * 1e4) / 1e4) +
          r),
          (i = i._next);
      r += t.c;
    }
    t.set(t.t, t.p, r, t);
  },
  ki = function (e, t) {
    for (var i = t._pt; i; ) i.r(e, i.d), (i = i._next);
  },
  jn = function (e, t, i, r) {
    for (var n = this._pt, s; n; )
      (s = n._next), n.p === r && n.modifier(e, t, i), (n = s);
  },
  Wn = function (e) {
    for (var t = this._pt, i, r; t; )
      (r = t._next),
        (t.p === e && !t.op) || t.op === e
          ? $t(this, t, "_pt")
          : t.dep || (i = 1),
        (t = r);
    return !i;
  },
  Yn = function (e, t, i, r) {
    r.mSet(e, t, r.m.call(r.tween, i, r.mt), r);
  },
  Rr = function (e) {
    for (var t = e._pt, i, r, n, s; t; ) {
      for (i = t._next, r = n; r && r.pr > t.pr; ) r = r._next;
      (t._prev = r ? r._prev : s) ? (t._prev._next = t) : (n = t),
        (t._next = r) ? (r._prev = t) : (s = t),
        (t = i);
    }
    e._pt = n;
  },
  se = (function () {
    function u(t, i, r, n, s, a, o, l, h) {
      (this.t = i),
        (this.s = n),
        (this.c = s),
        (this.p = r),
        (this.r = a || $r),
        (this.d = o || this),
        (this.set = l || xi),
        (this.pr = h || 0),
        (this._next = t),
        t && (t._prev = this);
    }
    var e = u.prototype;
    return (
      (e.modifier = function (i, r, n) {
        (this.mSet = this.mSet || this.set),
          (this.set = Yn),
          (this.m = i),
          (this.mt = n),
          (this.tween = r);
      }),
      u
    );
  })();
ne(
  yi +
    "parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger",
  function (u) {
    return (gi[u] = 1);
  },
);
he.TweenMax = he.TweenLite = G;
he.TimelineLite = he.TimelineMax = ie;
j = new ie({
  sortChildren: !1,
  defaults: et,
  autoRemoveChildren: !0,
  id: "root",
  smoothChildTiming: !0,
});
le.stringFilter = Sr;
var je = [],
  St = {},
  Xn = [],
  Ni = 0,
  Hn = 0,
  Wt = function (e) {
    return (St[e] || Xn).map(function (t) {
      return t();
    });
  },
  si = function () {
    var e = Date.now(),
      t = [];
    e - Ni > 2 &&
      (Wt("matchMediaInit"),
      je.forEach(function (i) {
        var r = i.queries,
          n = i.conditions,
          s,
          a,
          o,
          l;
        for (a in r)
          (s = _e.matchMedia(r[a]).matches),
            s && (o = 1),
            s !== n[a] && ((n[a] = s), (l = 1));
        l && (i.revert(), o && t.push(i));
      }),
      Wt("matchMediaRevert"),
      t.forEach(function (i) {
        return i.onMatch(i);
      }),
      (Ni = e),
      Wt("matchMedia"));
  },
  Fr = (function () {
    function u(t, i) {
      (this.selector = i && ii(i)),
        (this.data = []),
        (this._r = []),
        (this.isReverted = !1),
        (this.id = Hn++),
        t && this.add(t);
    }
    var e = u.prototype;
    return (
      (e.add = function (i, r, n) {
        X(i) && ((n = r), (r = i), (i = X));
        var s = this,
          a = function () {
            var l = Y,
              h = s.selector,
              f;
            return (
              l && l !== s && l.data.push(s),
              n && (s.selector = ii(n)),
              (Y = s),
              (f = r.apply(s, arguments)),
              X(f) && s._r.push(f),
              (Y = l),
              (s.selector = h),
              (s.isReverted = !1),
              f
            );
          };
        return (s.last = a), i === X ? a(s) : i ? (s[i] = a) : a;
      }),
      (e.ignore = function (i) {
        var r = Y;
        (Y = null), i(this), (Y = r);
      }),
      (e.getTweens = function () {
        var i = [];
        return (
          this.data.forEach(function (r) {
            return r instanceof u
              ? i.push.apply(i, r.getTweens())
              : r instanceof G &&
                  !(r.parent && r.parent.data === "nested") &&
                  i.push(r);
          }),
          i
        );
      }),
      (e.clear = function () {
        this._r.length = this.data.length = 0;
      }),
      (e.kill = function (i, r) {
        var n = this;
        if (i) {
          var s = this.getTweens();
          this.data.forEach(function (o) {
            o.data === "isFlip" &&
              (o.revert(),
              o.getChildren(!0, !0, !1).forEach(function (l) {
                return s.splice(s.indexOf(l), 1);
              }));
          }),
            s
              .map(function (o) {
                return { g: o.globalTime(0), t: o };
              })
              .sort(function (o, l) {
                return l.g - o.g || -1 / 0;
              })
              .forEach(function (o) {
                return o.t.revert(i);
              }),
            this.data.forEach(function (o) {
              return !(o instanceof G) && o.revert && o.revert(i);
            }),
            this._r.forEach(function (o) {
              return o(i, n);
            }),
            (this.isReverted = !0);
        } else
          this.data.forEach(function (o) {
            return o.kill && o.kill();
          });
        if ((this.clear(), r))
          for (var a = je.length; a--; )
            je[a].id === this.id && je.splice(a, 1);
      }),
      (e.revert = function (i) {
        this.kill(i || {});
      }),
      u
    );
  })(),
  Gn = (function () {
    function u(t) {
      (this.contexts = []), (this.scope = t);
    }
    var e = u.prototype;
    return (
      (e.add = function (i, r, n) {
        Te(i) || (i = { matches: i });
        var s = new Fr(0, n || this.scope),
          a = (s.conditions = {}),
          o,
          l,
          h;
        Y && !s.selector && (s.selector = Y.selector),
          this.contexts.push(s),
          (r = s.add("onMatch", r)),
          (s.queries = i);
        for (l in i)
          l === "all"
            ? (h = 1)
            : ((o = _e.matchMedia(i[l])),
              o &&
                (je.indexOf(s) < 0 && je.push(s),
                (a[l] = o.matches) && (h = 1),
                o.addListener
                  ? o.addListener(si)
                  : o.addEventListener("change", si)));
        return h && r(s), this;
      }),
      (e.revert = function (i) {
        this.kill(i || {});
      }),
      (e.kill = function (i) {
        this.contexts.forEach(function (r) {
          return r.kill(i, !0);
        });
      }),
      u
    );
  })(),
  At = {
    registerPlugin: function () {
      for (var e = arguments.length, t = new Array(e), i = 0; i < e; i++)
        t[i] = arguments[i];
      t.forEach(function (r) {
        return xr(r);
      });
    },
    timeline: function (e) {
      return new ie(e);
    },
    getTweensOf: function (e, t) {
      return j.getTweensOf(e, t);
    },
    getProperty: function (e, t, i, r) {
      Z(e) && (e = me(e)[0]);
      var n = Ve(e || {}).get,
        s = i ? lr : ur;
      return (
        i === "native" && (i = ""),
        e &&
          (t
            ? s(((oe[t] && oe[t].get) || n)(e, t, i, r))
            : function (a, o, l) {
                return s(((oe[a] && oe[a].get) || n)(e, a, o, l));
              })
      );
    },
    quickSetter: function (e, t, i) {
      if (((e = me(e)), e.length > 1)) {
        var r = e.map(function (h) {
            return ae.quickSetter(h, t, i);
          }),
          n = r.length;
        return function (h) {
          for (var f = n; f--; ) r[f](h);
        };
      }
      e = e[0] || {};
      var s = oe[t],
        a = Ve(e),
        o = (a.harness && (a.harness.aliases || {})[t]) || t,
        l = s
          ? function (h) {
              var f = new s();
              (Qe._pt = 0),
                f.init(e, i ? h + i : h, Qe, 0, [e]),
                f.render(1, f),
                Qe._pt && ki(1, Qe);
            }
          : a.set(e, o);
      return s
        ? l
        : function (h) {
            return l(e, o, i ? h + i : h, a, 1);
          };
    },
    quickTo: function (e, t, i) {
      var r,
        n = ae.to(
          e,
          We(((r = {}), (r[t] = "+=0.1"), (r.paused = !0), r), i || {}),
        ),
        s = function (o, l, h) {
          return n.resetTo(t, o, l, h);
        };
      return (s.tween = n), s;
    },
    isTweening: function (e) {
      return j.getTweensOf(e, !0).length > 0;
    },
    defaults: function (e) {
      return e && e.ease && (e.ease = Ue(e.ease, et.ease)), $i(et, e || {});
    },
    config: function (e) {
      return $i(le, e || {});
    },
    registerEffect: function (e) {
      var t = e.name,
        i = e.effect,
        r = e.plugins,
        n = e.defaults,
        s = e.extendTimeline;
      (r || "").split(",").forEach(function (a) {
        return (
          a && !oe[a] && !he[a] && Mt(t + " effect requires " + a + " plugin.")
        );
      }),
        (Vt[t] = function (a, o, l) {
          return i(me(a), ye(o || {}, n), l);
        }),
        s &&
          (ie.prototype[t] = function (a, o, l) {
            return this.add(Vt[t](a, Te(o) ? o : (l = o) && {}, this), l);
          });
    },
    registerEase: function (e, t) {
      $[e] = Ue(t);
    },
    parseEase: function (e, t) {
      return arguments.length ? Ue(e, t) : $;
    },
    getById: function (e) {
      return j.getById(e);
    },
    exportRoot: function (e, t) {
      e === void 0 && (e = {});
      var i = new ie(e),
        r,
        n;
      for (
        i.smoothChildTiming = re(e.smoothChildTiming),
          j.remove(i),
          i._dp = 0,
          i._time = i._tTime = j._time,
          r = j._first;
        r;

      )
        (n = r._next),
          (t ||
            !(
              !r._dur &&
              r instanceof G &&
              r.vars.onComplete === r._targets[0]
            )) &&
            we(i, r, r._start - r._delay),
          (r = n);
      return we(j, i, 0), i;
    },
    context: function (e, t) {
      return e ? new Fr(e, t) : Y;
    },
    matchMedia: function (e) {
      return new Gn(e);
    },
    matchMediaRefresh: function () {
      return (
        je.forEach(function (e) {
          var t = e.conditions,
            i,
            r;
          for (r in t) t[r] && ((t[r] = !1), (i = 1));
          i && e.revert();
        }) || si()
      );
    },
    addEventListener: function (e, t) {
      var i = St[e] || (St[e] = []);
      ~i.indexOf(t) || i.push(t);
    },
    removeEventListener: function (e, t) {
      var i = St[e],
        r = i && i.indexOf(t);
      r >= 0 && i.splice(r, 1);
    },
    utils: {
      wrap: Mn,
      wrapYoyo: Pn,
      distribute: mr,
      random: yr,
      snap: gr,
      normalize: Cn,
      getUnit: J,
      clamp: xn,
      splitColor: Tr,
      toArray: me,
      selector: ii,
      mapRange: wr,
      pipe: kn,
      unitize: Sn,
      interpolate: On,
      shuffle: pr,
    },
    install: rr,
    effects: Vt,
    ticker: ue,
    updateRoot: ie.updateRoot,
    plugins: oe,
    globalTimeline: j,
    core: {
      PropTween: se,
      globals: nr,
      Tween: G,
      Timeline: ie,
      Animation: _t,
      getCache: Ve,
      _removeLinkedListItem: $t,
      reverting: function () {
        return ee;
      },
      context: function (e) {
        return e && Y && (Y.data.push(e), (e._ctx = Y)), Y;
      },
      suppressOverwrites: function (e) {
        return (fi = e);
      },
    },
  };
ne("to,from,fromTo,delayedCall,set,killTweensOf", function (u) {
  return (At[u] = G[u]);
});
ue.add(ie.updateRoot);
Qe = At.to({}, { duration: 0 });
var Qn = function (e, t) {
    for (var i = e._pt; i && i.p !== t && i.op !== t && i.fp !== t; )
      i = i._next;
    return i;
  },
  Zn = function (e, t) {
    var i = e._targets,
      r,
      n,
      s;
    for (r in t)
      for (n = i.length; n--; )
        (s = e._ptLookup[n][r]),
          s &&
            (s = s.d) &&
            (s._pt && (s = Qn(s, r)),
            s && s.modifier && s.modifier(t[r], e, i[n], r));
  },
  Yt = function (e, t) {
    return {
      name: e,
      rawVars: 1,
      init: function (r, n, s) {
        s._onInit = function (a) {
          var o, l;
          if (
            (Z(n) &&
              ((o = {}),
              ne(n, function (h) {
                return (o[h] = 1);
              }),
              (n = o)),
            t)
          ) {
            o = {};
            for (l in n) o[l] = t(n[l]);
            n = o;
          }
          Zn(a, n);
        };
      },
    };
  },
  ae =
    At.registerPlugin(
      {
        name: "attr",
        init: function (e, t, i, r, n) {
          var s, a, o;
          this.tween = i;
          for (s in t)
            (o = e.getAttribute(s) || ""),
              (a = this.add(
                e,
                "setAttribute",
                (o || 0) + "",
                t[s],
                r,
                n,
                0,
                0,
                s,
              )),
              (a.op = s),
              (a.b = o),
              this._props.push(s);
        },
        render: function (e, t) {
          for (var i = t._pt; i; )
            ee ? i.set(i.t, i.p, i.b, i) : i.r(e, i.d), (i = i._next);
        },
      },
      {
        name: "endArray",
        init: function (e, t) {
          for (var i = t.length; i--; )
            this.add(e, i, e[i] || 0, t[i], 0, 0, 0, 0, 0, 1);
        },
      },
      Yt("roundProps", ri),
      Yt("modifiers"),
      Yt("snap", gr),
    ) || At;
G.version = ie.version = ae.version = "3.12.2";
ir = 1;
_i() && rt();
$.Power0;
$.Power1;
$.Power2;
$.Power3;
var qi = $.Power4;
$.Linear;
$.Quad;
$.Cubic;
$.Quart;
$.Quint;
$.Strong;
$.Elastic;
$.Back;
$.SteppedEase;
$.Bounce;
$.Sine;
$.Expo;
$.Circ;
/*!
 * CSSPlugin 3.12.2
 * https://greensock.com
 *
 * Copyright 2008-2023, GreenSock. All rights reserved.
 * Subject to the terms at https://greensock.com/standard-license or for
 * Club GreenSock members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
 */ var Vi,
  Oe,
  Ke,
  Si,
  qe,
  Bi,
  Ci,
  Kn = function () {
    return typeof window < "u";
  },
  Me = {},
  Ne = 180 / Math.PI,
  Je = Math.PI / 180,
  He = Math.atan2,
  Ui = 1e8,
  Mi = /([A-Z])/g,
  Jn = /(left|right|width|margin|padding|x)/i,
  es = /[\s,\(]\S/,
  be = {
    autoAlpha: "opacity,visibility",
    scale: "scaleX,scaleY",
    alpha: "opacity",
  },
  ai = function (e, t) {
    return t.set(t.t, t.p, Math.round((t.s + t.c * e) * 1e4) / 1e4 + t.u, t);
  },
  ts = function (e, t) {
    return t.set(
      t.t,
      t.p,
      e === 1 ? t.e : Math.round((t.s + t.c * e) * 1e4) / 1e4 + t.u,
      t,
    );
  },
  is = function (e, t) {
    return t.set(
      t.t,
      t.p,
      e ? Math.round((t.s + t.c * e) * 1e4) / 1e4 + t.u : t.b,
      t,
    );
  },
  rs = function (e, t) {
    var i = t.s + t.c * e;
    t.set(t.t, t.p, ~~(i + (i < 0 ? -0.5 : 0.5)) + t.u, t);
  },
  Ir = function (e, t) {
    return t.set(t.t, t.p, e ? t.e : t.b, t);
  },
  Nr = function (e, t) {
    return t.set(t.t, t.p, e !== 1 ? t.b : t.e, t);
  },
  ns = function (e, t, i) {
    return (e.style[t] = i);
  },
  ss = function (e, t, i) {
    return e.style.setProperty(t, i);
  },
  as = function (e, t, i) {
    return (e._gsap[t] = i);
  },
  os = function (e, t, i) {
    return (e._gsap.scaleX = e._gsap.scaleY = i);
  },
  us = function (e, t, i, r, n) {
    var s = e._gsap;
    (s.scaleX = s.scaleY = i), s.renderTransform(n, s);
  },
  ls = function (e, t, i, r, n) {
    var s = e._gsap;
    (s[t] = i), s.renderTransform(n, s);
  },
  W = "transform",
  ve = W + "Origin",
  hs = function u(e, t) {
    var i = this,
      r = this.target,
      n = r.style;
    if (e in Me && n) {
      if (((this.tfm = this.tfm || {}), e !== "transform"))
        (e = be[e] || e),
          ~e.indexOf(",")
            ? e.split(",").forEach(function (s) {
                return (i.tfm[s] = Se(r, s));
              })
            : (this.tfm[e] = r._gsap.x ? r._gsap[e] : Se(r, e));
      else
        return be.transform.split(",").forEach(function (s) {
          return u.call(i, s, t);
        });
      if (this.props.indexOf(W) >= 0) return;
      r._gsap.svg &&
        ((this.svgo = r.getAttribute("data-svg-origin")),
        this.props.push(ve, t, "")),
        (e = W);
    }
    (n || t) && this.props.push(e, t, n[e]);
  },
  qr = function (e) {
    e.translate &&
      (e.removeProperty("translate"),
      e.removeProperty("scale"),
      e.removeProperty("rotate"));
  },
  cs = function () {
    var e = this.props,
      t = this.target,
      i = t.style,
      r = t._gsap,
      n,
      s;
    for (n = 0; n < e.length; n += 3)
      e[n + 1]
        ? (t[e[n]] = e[n + 2])
        : e[n + 2]
          ? (i[e[n]] = e[n + 2])
          : i.removeProperty(
              e[n].substr(0, 2) === "--"
                ? e[n]
                : e[n].replace(Mi, "-$1").toLowerCase(),
            );
    if (this.tfm) {
      for (s in this.tfm) r[s] = this.tfm[s];
      r.svg &&
        (r.renderTransform(),
        t.setAttribute("data-svg-origin", this.svgo || "")),
        (n = Ci()),
        (!n || !n.isStart) && !i[W] && (qr(i), (r.uncache = 1));
    }
  },
  Vr = function (e, t) {
    var i = { target: e, props: [], revert: cs, save: hs };
    return (
      e._gsap || ae.core.getCache(e),
      t &&
        t.split(",").forEach(function (r) {
          return i.save(r);
        }),
      i
    );
  },
  Br,
  oi = function (e, t) {
    var i = Oe.createElementNS
      ? Oe.createElementNS(
          (t || "http://www.w3.org/1999/xhtml").replace(/^https/, "http"),
          e,
        )
      : Oe.createElement(e);
    return i.style ? i : Oe.createElement(e);
  },
  xe = function u(e, t, i) {
    var r = getComputedStyle(e);
    return (
      r[t] ||
      r.getPropertyValue(t.replace(Mi, "-$1").toLowerCase()) ||
      r.getPropertyValue(t) ||
      (!i && u(e, nt(t) || t, 1)) ||
      ""
    );
  },
  ji = "O,Moz,ms,Ms,Webkit".split(","),
  nt = function (e, t, i) {
    var r = t || qe,
      n = r.style,
      s = 5;
    if (e in n && !i) return e;
    for (
      e = e.charAt(0).toUpperCase() + e.substr(1);
      s-- && !(ji[s] + e in n);

    );
    return s < 0 ? null : (s === 3 ? "ms" : s >= 0 ? ji[s] : "") + e;
  },
  ui = function () {
    Kn() &&
      window.document &&
      ((Vi = window),
      (Oe = Vi.document),
      (Ke = Oe.documentElement),
      (qe = oi("div") || { style: {} }),
      oi("div"),
      (W = nt(W)),
      (ve = W + "Origin"),
      (qe.style.cssText =
        "border-width:0;line-height:0;position:absolute;padding:0"),
      (Br = !!nt("perspective")),
      (Ci = ae.core.reverting),
      (Si = 1));
  },
  Xt = function u(e) {
    var t = oi(
        "svg",
        (this.ownerSVGElement && this.ownerSVGElement.getAttribute("xmlns")) ||
          "http://www.w3.org/2000/svg",
      ),
      i = this.parentNode,
      r = this.nextSibling,
      n = this.style.cssText,
      s;
    if (
      (Ke.appendChild(t),
      t.appendChild(this),
      (this.style.display = "block"),
      e)
    )
      try {
        (s = this.getBBox()),
          (this._gsapBBox = this.getBBox),
          (this.getBBox = u);
      } catch {}
    else this._gsapBBox && (s = this._gsapBBox());
    return (
      i && (r ? i.insertBefore(this, r) : i.appendChild(this)),
      Ke.removeChild(t),
      (this.style.cssText = n),
      s
    );
  },
  Wi = function (e, t) {
    for (var i = t.length; i--; )
      if (e.hasAttribute(t[i])) return e.getAttribute(t[i]);
  },
  Ur = function (e) {
    var t;
    try {
      t = e.getBBox();
    } catch {
      t = Xt.call(e, !0);
    }
    return (
      (t && (t.width || t.height)) || e.getBBox === Xt || (t = Xt.call(e, !0)),
      t && !t.width && !t.x && !t.y
        ? {
            x: +Wi(e, ["x", "cx", "x1"]) || 0,
            y: +Wi(e, ["y", "cy", "y1"]) || 0,
            width: 0,
            height: 0,
          }
        : t
    );
  },
  jr = function (e) {
    return !!(e.getCTM && (!e.parentNode || e.ownerSVGElement) && Ur(e));
  },
  pt = function (e, t) {
    if (t) {
      var i = e.style;
      t in Me && t !== ve && (t = W),
        i.removeProperty
          ? ((t.substr(0, 2) === "ms" || t.substr(0, 6) === "webkit") &&
              (t = "-" + t),
            i.removeProperty(t.replace(Mi, "-$1").toLowerCase()))
          : i.removeAttribute(t);
    }
  },
  Ee = function (e, t, i, r, n, s) {
    var a = new se(e._pt, t, i, 0, 1, s ? Nr : Ir);
    return (e._pt = a), (a.b = r), (a.e = n), e._props.push(i), a;
  },
  Yi = { deg: 1, rad: 1, turn: 1 },
  fs = { grid: 1, flex: 1 },
  $e = function u(e, t, i, r) {
    var n = parseFloat(i) || 0,
      s = (i + "").trim().substr((n + "").length) || "px",
      a = qe.style,
      o = Jn.test(t),
      l = e.tagName.toLowerCase() === "svg",
      h = (l ? "client" : "offset") + (o ? "Width" : "Height"),
      f = 100,
      d = r === "px",
      _ = r === "%",
      g,
      c,
      y,
      v;
    return r === s || !n || Yi[r] || Yi[s]
      ? n
      : (s !== "px" && !d && (n = u(e, t, i, "px")),
        (v = e.getCTM && jr(e)),
        (_ || s === "%") && (Me[t] || ~t.indexOf("adius"))
          ? ((g = v ? e.getBBox()[o ? "width" : "height"] : e[h]),
            H(_ ? (n / g) * f : (n / 100) * g))
          : ((a[o ? "width" : "height"] = f + (d ? s : r)),
            (c =
              ~t.indexOf("adius") || (r === "em" && e.appendChild && !l)
                ? e
                : e.parentNode),
            v && (c = (e.ownerSVGElement || {}).parentNode),
            (!c || c === Oe || !c.appendChild) && (c = Oe.body),
            (y = c._gsap),
            y && _ && y.width && o && y.time === ue.time && !y.uncache
              ? H((n / y.width) * f)
              : ((_ || s === "%") &&
                  !fs[xe(c, "display")] &&
                  (a.position = xe(e, "position")),
                c === e && (a.position = "static"),
                c.appendChild(qe),
                (g = qe[h]),
                c.removeChild(qe),
                (a.position = "absolute"),
                o && _ && ((y = Ve(c)), (y.time = ue.time), (y.width = c[h])),
                H(d ? (g * n) / f : g && n ? (f / g) * n : 0))));
  },
  Se = function (e, t, i, r) {
    var n;
    return (
      Si || ui(),
      t in be &&
        t !== "transform" &&
        ((t = be[t]), ~t.indexOf(",") && (t = t.split(",")[0])),
      Me[t] && t !== "transform"
        ? ((n = gt(e, r)),
          (n =
            t !== "transformOrigin"
              ? n[t]
              : n.svg
                ? n.origin
                : Dt(xe(e, ve)) + " " + n.zOrigin + "px"))
        : ((n = e.style[t]),
          (!n || n === "auto" || r || ~(n + "").indexOf("calc(")) &&
            (n =
              (Lt[t] && Lt[t](e, t, i)) ||
              xe(e, t) ||
              ar(e, t) ||
              (t === "opacity" ? 1 : 0))),
      i && !~(n + "").trim().indexOf(" ") ? $e(e, t, n, i) + i : n
    );
  },
  ds = function (e, t, i, r) {
    if (!i || i === "none") {
      var n = nt(t, e, 1),
        s = n && xe(e, n, 1);
      s && s !== i
        ? ((t = n), (i = s))
        : t === "borderColor" && (i = xe(e, "borderTopColor"));
    }
    var a = new se(this._pt, e.style, t, 0, 1, zr),
      o = 0,
      l = 0,
      h,
      f,
      d,
      _,
      g,
      c,
      y,
      v,
      w,
      x,
      T,
      b;
    if (
      ((a.b = i),
      (a.e = r),
      (i += ""),
      (r += ""),
      r === "auto" && ((e.style[t] = r), (r = xe(e, t) || r), (e.style[t] = i)),
      (h = [i, r]),
      Sr(h),
      (i = h[0]),
      (r = h[1]),
      (d = i.match(Ge) || []),
      (b = r.match(Ge) || []),
      b.length)
    ) {
      for (; (f = Ge.exec(r)); )
        (y = f[0]),
          (w = r.substring(o, f.index)),
          g
            ? (g = (g + 1) % 5)
            : (w.substr(-5) === "rgba(" || w.substr(-5) === "hsla(") && (g = 1),
          y !== (c = d[l++] || "") &&
            ((_ = parseFloat(c) || 0),
            (T = c.substr((_ + "").length)),
            y.charAt(1) === "=" && (y = Ze(_, y) + T),
            (v = parseFloat(y)),
            (x = y.substr((v + "").length)),
            (o = Ge.lastIndex - x.length),
            x ||
              ((x = x || le.units[t] || T),
              o === r.length && ((r += x), (a.e += x))),
            T !== x && (_ = $e(e, t, c, x) || 0),
            (a._pt = {
              _next: a._pt,
              p: w || l === 1 ? w : ",",
              s: _,
              c: v - _,
              m: (g && g < 4) || t === "zIndex" ? Math.round : 0,
            }));
      a.c = o < r.length ? r.substring(o, r.length) : "";
    } else a.r = t === "display" && r === "none" ? Nr : Ir;
    return er.test(r) && (a.e = 0), (this._pt = a), a;
  },
  Xi = { top: "0%", bottom: "100%", left: "0%", right: "100%", center: "50%" },
  _s = function (e) {
    var t = e.split(" "),
      i = t[0],
      r = t[1] || "50%";
    return (
      (i === "top" || i === "bottom" || r === "left" || r === "right") &&
        ((e = i), (i = r), (r = e)),
      (t[0] = Xi[i] || i),
      (t[1] = Xi[r] || r),
      t.join(" ")
    );
  },
  ps = function (e, t) {
    if (t.tween && t.tween._time === t.tween._dur) {
      var i = t.t,
        r = i.style,
        n = t.u,
        s = i._gsap,
        a,
        o,
        l;
      if (n === "all" || n === !0) (r.cssText = ""), (o = 1);
      else
        for (n = n.split(","), l = n.length; --l > -1; )
          (a = n[l]),
            Me[a] && ((o = 1), (a = a === "transformOrigin" ? ve : W)),
            pt(i, a);
      o &&
        (pt(i, W),
        s &&
          (s.svg && i.removeAttribute("transform"),
          gt(i, 1),
          (s.uncache = 1),
          qr(r)));
    }
  },
  Lt = {
    clearProps: function (e, t, i, r, n) {
      if (n.data !== "isFromStart") {
        var s = (e._pt = new se(e._pt, t, i, 0, 0, ps));
        return (s.u = r), (s.pr = -10), (s.tween = n), e._props.push(i), 1;
      }
    },
  },
  mt = [1, 0, 0, 1, 0, 0],
  Wr = {},
  Yr = function (e) {
    return e === "matrix(1, 0, 0, 1, 0, 0)" || e === "none" || !e;
  },
  Hi = function (e) {
    var t = xe(e, W);
    return Yr(t) ? mt : t.substr(7).match(Ji).map(H);
  },
  Pi = function (e, t) {
    var i = e._gsap || Ve(e),
      r = e.style,
      n = Hi(e),
      s,
      a,
      o,
      l;
    return i.svg && e.getAttribute("transform")
      ? ((o = e.transform.baseVal.consolidate().matrix),
        (n = [o.a, o.b, o.c, o.d, o.e, o.f]),
        n.join(",") === "1,0,0,1,0,0" ? mt : n)
      : (n === mt &&
          !e.offsetParent &&
          e !== Ke &&
          !i.svg &&
          ((o = r.display),
          (r.display = "block"),
          (s = e.parentNode),
          (!s || !e.offsetParent) &&
            ((l = 1), (a = e.nextElementSibling), Ke.appendChild(e)),
          (n = Hi(e)),
          o ? (r.display = o) : pt(e, "display"),
          l &&
            (a
              ? s.insertBefore(e, a)
              : s
                ? s.appendChild(e)
                : Ke.removeChild(e))),
        t && n.length > 6 ? [n[0], n[1], n[4], n[5], n[12], n[13]] : n);
  },
  li = function (e, t, i, r, n, s) {
    var a = e._gsap,
      o = n || Pi(e, !0),
      l = a.xOrigin || 0,
      h = a.yOrigin || 0,
      f = a.xOffset || 0,
      d = a.yOffset || 0,
      _ = o[0],
      g = o[1],
      c = o[2],
      y = o[3],
      v = o[4],
      w = o[5],
      x = t.split(" "),
      T = parseFloat(x[0]) || 0,
      b = parseFloat(x[1]) || 0,
      M,
      C,
      S,
      k;
    i
      ? o !== mt &&
        (C = _ * y - g * c) &&
        ((S = T * (y / C) + b * (-c / C) + (c * w - y * v) / C),
        (k = T * (-g / C) + b * (_ / C) - (_ * w - g * v) / C),
        (T = S),
        (b = k))
      : ((M = Ur(e)),
        (T = M.x + (~x[0].indexOf("%") ? (T / 100) * M.width : T)),
        (b = M.y + (~(x[1] || x[0]).indexOf("%") ? (b / 100) * M.height : b))),
      r || (r !== !1 && a.smooth)
        ? ((v = T - l),
          (w = b - h),
          (a.xOffset = f + (v * _ + w * c) - v),
          (a.yOffset = d + (v * g + w * y) - w))
        : (a.xOffset = a.yOffset = 0),
      (a.xOrigin = T),
      (a.yOrigin = b),
      (a.smooth = !!r),
      (a.origin = t),
      (a.originIsAbsolute = !!i),
      (e.style[ve] = "0px 0px"),
      s &&
        (Ee(s, a, "xOrigin", l, T),
        Ee(s, a, "yOrigin", h, b),
        Ee(s, a, "xOffset", f, a.xOffset),
        Ee(s, a, "yOffset", d, a.yOffset)),
      e.setAttribute("data-svg-origin", T + " " + b);
  },
  gt = function (e, t) {
    var i = e._gsap || new Or(e);
    if ("x" in i && !t && !i.uncache) return i;
    var r = e.style,
      n = i.scaleX < 0,
      s = "px",
      a = "deg",
      o = getComputedStyle(e),
      l = xe(e, ve) || "0",
      h,
      f,
      d,
      _,
      g,
      c,
      y,
      v,
      w,
      x,
      T,
      b,
      M,
      C,
      S,
      k,
      R,
      F,
      V,
      U,
      m,
      p,
      O,
      P,
      E,
      D,
      A,
      L,
      I,
      ce,
      z,
      Q;
    return (
      (h = f = d = c = y = v = w = x = T = 0),
      (_ = g = 1),
      (i.svg = !!(e.getCTM && jr(e))),
      o.translate &&
        ((o.translate !== "none" ||
          o.scale !== "none" ||
          o.rotate !== "none") &&
          (r[W] =
            (o.translate !== "none"
              ? "translate3d(" +
                (o.translate + " 0 0").split(" ").slice(0, 3).join(", ") +
                ") "
              : "") +
            (o.rotate !== "none" ? "rotate(" + o.rotate + ") " : "") +
            (o.scale !== "none"
              ? "scale(" + o.scale.split(" ").join(",") + ") "
              : "") +
            (o[W] !== "none" ? o[W] : "")),
        (r.scale = r.rotate = r.translate = "none")),
      (C = Pi(e, i.svg)),
      i.svg &&
        (i.uncache
          ? ((E = e.getBBox()),
            (l = i.xOrigin - E.x + "px " + (i.yOrigin - E.y) + "px"),
            (P = ""))
          : (P = !t && e.getAttribute("data-svg-origin")),
        li(e, P || l, !!P || i.originIsAbsolute, i.smooth !== !1, C)),
      (b = i.xOrigin || 0),
      (M = i.yOrigin || 0),
      C !== mt &&
        ((F = C[0]),
        (V = C[1]),
        (U = C[2]),
        (m = C[3]),
        (h = p = C[4]),
        (f = O = C[5]),
        C.length === 6
          ? ((_ = Math.sqrt(F * F + V * V)),
            (g = Math.sqrt(m * m + U * U)),
            (c = F || V ? He(V, F) * Ne : 0),
            (w = U || m ? He(U, m) * Ne + c : 0),
            w && (g *= Math.abs(Math.cos(w * Je))),
            i.svg && ((h -= b - (b * F + M * U)), (f -= M - (b * V + M * m))))
          : ((Q = C[6]),
            (ce = C[7]),
            (A = C[8]),
            (L = C[9]),
            (I = C[10]),
            (z = C[11]),
            (h = C[12]),
            (f = C[13]),
            (d = C[14]),
            (S = He(Q, I)),
            (y = S * Ne),
            S &&
              ((k = Math.cos(-S)),
              (R = Math.sin(-S)),
              (P = p * k + A * R),
              (E = O * k + L * R),
              (D = Q * k + I * R),
              (A = p * -R + A * k),
              (L = O * -R + L * k),
              (I = Q * -R + I * k),
              (z = ce * -R + z * k),
              (p = P),
              (O = E),
              (Q = D)),
            (S = He(-U, I)),
            (v = S * Ne),
            S &&
              ((k = Math.cos(-S)),
              (R = Math.sin(-S)),
              (P = F * k - A * R),
              (E = V * k - L * R),
              (D = U * k - I * R),
              (z = m * R + z * k),
              (F = P),
              (V = E),
              (U = D)),
            (S = He(V, F)),
            (c = S * Ne),
            S &&
              ((k = Math.cos(S)),
              (R = Math.sin(S)),
              (P = F * k + V * R),
              (E = p * k + O * R),
              (V = V * k - F * R),
              (O = O * k - p * R),
              (F = P),
              (p = E)),
            y &&
              Math.abs(y) + Math.abs(c) > 359.9 &&
              ((y = c = 0), (v = 180 - v)),
            (_ = H(Math.sqrt(F * F + V * V + U * U))),
            (g = H(Math.sqrt(O * O + Q * Q))),
            (S = He(p, O)),
            (w = Math.abs(S) > 2e-4 ? S * Ne : 0),
            (T = z ? 1 / (z < 0 ? -z : z) : 0)),
        i.svg &&
          ((P = e.getAttribute("transform")),
          (i.forceCSS = e.setAttribute("transform", "") || !Yr(xe(e, W))),
          P && e.setAttribute("transform", P))),
      Math.abs(w) > 90 &&
        Math.abs(w) < 270 &&
        (n
          ? ((_ *= -1), (w += c <= 0 ? 180 : -180), (c += c <= 0 ? 180 : -180))
          : ((g *= -1), (w += w <= 0 ? 180 : -180))),
      (t = t || i.uncache),
      (i.x =
        h -
        ((i.xPercent =
          h &&
          ((!t && i.xPercent) ||
            (Math.round(e.offsetWidth / 2) === Math.round(-h) ? -50 : 0)))
          ? (e.offsetWidth * i.xPercent) / 100
          : 0) +
        s),
      (i.y =
        f -
        ((i.yPercent =
          f &&
          ((!t && i.yPercent) ||
            (Math.round(e.offsetHeight / 2) === Math.round(-f) ? -50 : 0)))
          ? (e.offsetHeight * i.yPercent) / 100
          : 0) +
        s),
      (i.z = d + s),
      (i.scaleX = H(_)),
      (i.scaleY = H(g)),
      (i.rotation = H(c) + a),
      (i.rotationX = H(y) + a),
      (i.rotationY = H(v) + a),
      (i.skewX = w + a),
      (i.skewY = x + a),
      (i.transformPerspective = T + s),
      (i.zOrigin = parseFloat(l.split(" ")[2]) || 0) && (r[ve] = Dt(l)),
      (i.xOffset = i.yOffset = 0),
      (i.force3D = le.force3D),
      (i.renderTransform = i.svg ? gs : Br ? Xr : ms),
      (i.uncache = 0),
      i
    );
  },
  Dt = function (e) {
    return (e = e.split(" "))[0] + " " + e[1];
  },
  Ht = function (e, t, i) {
    var r = J(t);
    return H(parseFloat(t) + parseFloat($e(e, "x", i + "px", r))) + r;
  },
  ms = function (e, t) {
    (t.z = "0px"),
      (t.rotationY = t.rotationX = "0deg"),
      (t.force3D = 0),
      Xr(e, t);
  },
  Fe = "0deg",
  st = "0px",
  Ie = ") ",
  Xr = function (e, t) {
    var i = t || this,
      r = i.xPercent,
      n = i.yPercent,
      s = i.x,
      a = i.y,
      o = i.z,
      l = i.rotation,
      h = i.rotationY,
      f = i.rotationX,
      d = i.skewX,
      _ = i.skewY,
      g = i.scaleX,
      c = i.scaleY,
      y = i.transformPerspective,
      v = i.force3D,
      w = i.target,
      x = i.zOrigin,
      T = "",
      b = (v === "auto" && e && e !== 1) || v === !0;
    if (x && (f !== Fe || h !== Fe)) {
      var M = parseFloat(h) * Je,
        C = Math.sin(M),
        S = Math.cos(M),
        k;
      (M = parseFloat(f) * Je),
        (k = Math.cos(M)),
        (s = Ht(w, s, C * k * -x)),
        (a = Ht(w, a, -Math.sin(M) * -x)),
        (o = Ht(w, o, S * k * -x + x));
    }
    y !== st && (T += "perspective(" + y + Ie),
      (r || n) && (T += "translate(" + r + "%, " + n + "%) "),
      (b || s !== st || a !== st || o !== st) &&
        (T +=
          o !== st || b
            ? "translate3d(" + s + ", " + a + ", " + o + ") "
            : "translate(" + s + ", " + a + Ie),
      l !== Fe && (T += "rotate(" + l + Ie),
      h !== Fe && (T += "rotateY(" + h + Ie),
      f !== Fe && (T += "rotateX(" + f + Ie),
      (d !== Fe || _ !== Fe) && (T += "skew(" + d + ", " + _ + Ie),
      (g !== 1 || c !== 1) && (T += "scale(" + g + ", " + c + Ie),
      (w.style[W] = T || "translate(0, 0)");
  },
  gs = function (e, t) {
    var i = t || this,
      r = i.xPercent,
      n = i.yPercent,
      s = i.x,
      a = i.y,
      o = i.rotation,
      l = i.skewX,
      h = i.skewY,
      f = i.scaleX,
      d = i.scaleY,
      _ = i.target,
      g = i.xOrigin,
      c = i.yOrigin,
      y = i.xOffset,
      v = i.yOffset,
      w = i.forceCSS,
      x = parseFloat(s),
      T = parseFloat(a),
      b,
      M,
      C,
      S,
      k;
    (o = parseFloat(o)),
      (l = parseFloat(l)),
      (h = parseFloat(h)),
      h && ((h = parseFloat(h)), (l += h), (o += h)),
      o || l
        ? ((o *= Je),
          (l *= Je),
          (b = Math.cos(o) * f),
          (M = Math.sin(o) * f),
          (C = Math.sin(o - l) * -d),
          (S = Math.cos(o - l) * d),
          l &&
            ((h *= Je),
            (k = Math.tan(l - h)),
            (k = Math.sqrt(1 + k * k)),
            (C *= k),
            (S *= k),
            h &&
              ((k = Math.tan(h)),
              (k = Math.sqrt(1 + k * k)),
              (b *= k),
              (M *= k))),
          (b = H(b)),
          (M = H(M)),
          (C = H(C)),
          (S = H(S)))
        : ((b = f), (S = d), (M = C = 0)),
      ((x && !~(s + "").indexOf("px")) || (T && !~(a + "").indexOf("px"))) &&
        ((x = $e(_, "x", s, "px")), (T = $e(_, "y", a, "px"))),
      (g || c || y || v) &&
        ((x = H(x + g - (g * b + c * C) + y)),
        (T = H(T + c - (g * M + c * S) + v))),
      (r || n) &&
        ((k = _.getBBox()),
        (x = H(x + (r / 100) * k.width)),
        (T = H(T + (n / 100) * k.height))),
      (k =
        "matrix(" + b + "," + M + "," + C + "," + S + "," + x + "," + T + ")"),
      _.setAttribute("transform", k),
      w && (_.style[W] = k);
  },
  ys = function (e, t, i, r, n) {
    var s = 360,
      a = Z(n),
      o = parseFloat(n) * (a && ~n.indexOf("rad") ? Ne : 1),
      l = o - r,
      h = r + l + "deg",
      f,
      d;
    return (
      a &&
        ((f = n.split("_")[1]),
        f === "short" && ((l %= s), l !== l % (s / 2) && (l += l < 0 ? s : -s)),
        f === "cw" && l < 0
          ? (l = ((l + s * Ui) % s) - ~~(l / s) * s)
          : f === "ccw" && l > 0 && (l = ((l - s * Ui) % s) - ~~(l / s) * s)),
      (e._pt = d = new se(e._pt, t, i, r, l, ts)),
      (d.e = h),
      (d.u = "deg"),
      e._props.push(i),
      d
    );
  },
  Gi = function (e, t) {
    for (var i in t) e[i] = t[i];
    return e;
  },
  vs = function (e, t, i) {
    var r = Gi({}, i._gsap),
      n = "perspective,force3D,transformOrigin,svgOrigin",
      s = i.style,
      a,
      o,
      l,
      h,
      f,
      d,
      _,
      g;
    r.svg
      ? ((l = i.getAttribute("transform")),
        i.setAttribute("transform", ""),
        (s[W] = t),
        (a = gt(i, 1)),
        pt(i, W),
        i.setAttribute("transform", l))
      : ((l = getComputedStyle(i)[W]), (s[W] = t), (a = gt(i, 1)), (s[W] = l));
    for (o in Me)
      (l = r[o]),
        (h = a[o]),
        l !== h &&
          n.indexOf(o) < 0 &&
          ((_ = J(l)),
          (g = J(h)),
          (f = _ !== g ? $e(i, o, l, g) : parseFloat(l)),
          (d = parseFloat(h)),
          (e._pt = new se(e._pt, a, o, f, d - f, ai)),
          (e._pt.u = g || 0),
          e._props.push(o));
    Gi(a, r);
  };
ne("padding,margin,Width,Radius", function (u, e) {
  var t = "Top",
    i = "Right",
    r = "Bottom",
    n = "Left",
    s = (e < 3 ? [t, i, r, n] : [t + n, t + i, r + i, r + n]).map(function (a) {
      return e < 2 ? u + a : "border" + a + u;
    });
  Lt[e > 1 ? "border" + u : u] = function (a, o, l, h, f) {
    var d, _;
    if (arguments.length < 4)
      return (
        (d = s.map(function (g) {
          return Se(a, g, l);
        })),
        (_ = d.join(" ")),
        _.split(d[0]).length === 5 ? d[0] : _
      );
    (d = (h + "").split(" ")),
      (_ = {}),
      s.forEach(function (g, c) {
        return (_[g] = d[c] = d[c] || d[((c - 1) / 2) | 0]);
      }),
      a.init(o, _, f);
  };
});
var Hr = {
  name: "css",
  register: ui,
  targetTest: function (e) {
    return e.style && e.nodeType;
  },
  init: function (e, t, i, r, n) {
    var s = this._props,
      a = e.style,
      o = i.vars.startAt,
      l,
      h,
      f,
      d,
      _,
      g,
      c,
      y,
      v,
      w,
      x,
      T,
      b,
      M,
      C,
      S;
    Si || ui(),
      (this.styles = this.styles || Vr(e)),
      (S = this.styles.props),
      (this.tween = i);
    for (c in t)
      if (c !== "autoRound" && ((h = t[c]), !(oe[c] && Er(c, t, i, r, e, n)))) {
        if (
          ((_ = typeof h),
          (g = Lt[c]),
          _ === "function" && ((h = h.call(i, r, e, n)), (_ = typeof h)),
          _ === "string" && ~h.indexOf("random(") && (h = ft(h)),
          g)
        )
          g(this, e, c, h, i) && (C = 1);
        else if (c.substr(0, 2) === "--")
          (l = (getComputedStyle(e).getPropertyValue(c) + "").trim()),
            (h += ""),
            (Le.lastIndex = 0),
            Le.test(l) || ((y = J(l)), (v = J(h))),
            v ? y !== v && (l = $e(e, c, l, v) + v) : y && (h += y),
            this.add(a, "setProperty", l, h, r, n, 0, 0, c),
            s.push(c),
            S.push(c, 0, a[c]);
        else if (_ !== "undefined") {
          if (
            (o && c in o
              ? ((l = typeof o[c] == "function" ? o[c].call(i, r, e, n) : o[c]),
                Z(l) && ~l.indexOf("random(") && (l = ft(l)),
                J(l + "") || (l += le.units[c] || J(Se(e, c)) || ""),
                (l + "").charAt(1) === "=" && (l = Se(e, c)))
              : (l = Se(e, c)),
            (d = parseFloat(l)),
            (w = _ === "string" && h.charAt(1) === "=" && h.substr(0, 2)),
            w && (h = h.substr(2)),
            (f = parseFloat(h)),
            c in be &&
              (c === "autoAlpha" &&
                (d === 1 && Se(e, "visibility") === "hidden" && f && (d = 0),
                S.push("visibility", 0, a.visibility),
                Ee(
                  this,
                  a,
                  "visibility",
                  d ? "inherit" : "hidden",
                  f ? "inherit" : "hidden",
                  !f,
                )),
              c !== "scale" &&
                c !== "transform" &&
                ((c = be[c]), ~c.indexOf(",") && (c = c.split(",")[0]))),
            (x = c in Me),
            x)
          ) {
            if (
              (this.styles.save(c),
              T ||
                ((b = e._gsap),
                (b.renderTransform && !t.parseTransform) ||
                  gt(e, t.parseTransform),
                (M = t.smoothOrigin !== !1 && b.smooth),
                (T = this._pt =
                  new se(this._pt, a, W, 0, 1, b.renderTransform, b, 0, -1)),
                (T.dep = 1)),
              c === "scale")
            )
              (this._pt = new se(
                this._pt,
                b,
                "scaleY",
                b.scaleY,
                (w ? Ze(b.scaleY, w + f) : f) - b.scaleY || 0,
                ai,
              )),
                (this._pt.u = 0),
                s.push("scaleY", c),
                (c += "X");
            else if (c === "transformOrigin") {
              S.push(ve, 0, a[ve]),
                (h = _s(h)),
                b.svg
                  ? li(e, h, 0, M, 0, this)
                  : ((v = parseFloat(h.split(" ")[2]) || 0),
                    v !== b.zOrigin && Ee(this, b, "zOrigin", b.zOrigin, v),
                    Ee(this, a, c, Dt(l), Dt(h)));
              continue;
            } else if (c === "svgOrigin") {
              li(e, h, 1, M, 0, this);
              continue;
            } else if (c in Wr) {
              ys(this, b, c, d, w ? Ze(d, w + h) : h);
              continue;
            } else if (c === "smoothOrigin") {
              Ee(this, b, "smooth", b.smooth, h);
              continue;
            } else if (c === "force3D") {
              b[c] = h;
              continue;
            } else if (c === "transform") {
              vs(this, h, e);
              continue;
            }
          } else c in a || (c = nt(c) || c);
          if (x || ((f || f === 0) && (d || d === 0) && !es.test(h) && c in a))
            (y = (l + "").substr((d + "").length)),
              f || (f = 0),
              (v = J(h) || (c in le.units ? le.units[c] : y)),
              y !== v && (d = $e(e, c, l, v)),
              (this._pt = new se(
                this._pt,
                x ? b : a,
                c,
                d,
                (w ? Ze(d, w + f) : f) - d,
                !x && (v === "px" || c === "zIndex") && t.autoRound !== !1
                  ? rs
                  : ai,
              )),
              (this._pt.u = v || 0),
              y !== v && v !== "%" && ((this._pt.b = l), (this._pt.r = is));
          else if (c in a) ds.call(this, e, c, l, w ? w + h : h);
          else if (c in e) this.add(e, c, l || e[c], w ? w + h : h, r, n);
          else if (c !== "parseTransform") {
            mi(c, h);
            continue;
          }
          x || (c in a ? S.push(c, 0, a[c]) : S.push(c, 1, l || e[c])),
            s.push(c);
        }
      }
    C && Rr(this);
  },
  render: function (e, t) {
    if (t.tween._time || !Ci())
      for (var i = t._pt; i; ) i.r(e, i.d), (i = i._next);
    else t.styles.revert();
  },
  get: Se,
  aliases: be,
  getSetter: function (e, t, i) {
    var r = be[t];
    return (
      r && r.indexOf(",") < 0 && (t = r),
      t in Me && t !== ve && (e._gsap.x || Se(e, "x"))
        ? i && Bi === i
          ? t === "scale"
            ? os
            : as
          : (Bi = i || {}) && (t === "scale" ? us : ls)
        : e.style && !di(e.style[t])
          ? ns
          : ~t.indexOf("-")
            ? ss
            : Ti(e, t)
    );
  },
  core: { _removeProperty: pt, _getMatrix: Pi },
};
ae.utils.checkPrefix = nt;
ae.core.getStyleSaver = Vr;
(function (u, e, t, i) {
  var r = ne(u + "," + e + "," + t, function (n) {
    Me[n] = 1;
  });
  ne(e, function (n) {
    (le.units[n] = "deg"), (Wr[n] = 1);
  }),
    (be[r[13]] = u + "," + e),
    ne(i, function (n) {
      var s = n.split(":");
      be[s[1]] = r[s[0]];
    });
})(
  "x,y,z,scale,scaleX,scaleY,xPercent,yPercent",
  "rotation,rotationX,rotationY,skewX,skewY",
  "transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective",
  "0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY",
);
ne(
  "x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective",
  function (u) {
    le.units[u] = "px";
  },
);
ae.registerPlugin(Hr);
var yt = ae.registerPlugin(Hr) || ae;
yt.core.Tween;
class ws extends hi {
  constructor() {
    super(),
      (this.isOpen = !1),
      (this.$element = document.querySelector(".js-popins")),
      (this.$background = this.$element.querySelector(".js-background")),
      (this.$popins = []),
      (this.$triggers = []),
      (this.$current = null),
      window.addEventListener("keydown", (e) => {
        e.code === "Escape" && this.close();
      }),
      this.$background.addEventListener("click", (e) => {
        this.close();
      }),
      this.setConffeti(),
      this.setFullscreen(),
      this.update();
  }
  setConffeti() {
    (this.conffeti = {}),
      (this.conffeti.$canvas = this.$element.querySelector(
        ".js-popins-confetti-canvas",
      )),
      (this.conffeti.interval = null),
      (this.conffeti.start = () => {
        this.conffeti.end(),
          window.setTimeout(this.conffeti.pop, 500),
          window.setTimeout(this.conffeti.pop, 700),
          (this.conffeti.interval = window.setInterval(this.conffeti.pop, 2e3));
      }),
      (this.conffeti.end = () => {
        this.conffeti.interval &&
          (window.clearInterval(this.conffeti.interval),
          (this.conffeti.interval = null));
      }),
      (this.conffeti.pop = () => {
        document.hidden ||
          this.conffeti.instance({
            angle: 90 + (Math.random() - 0.5) * 120,
            spread: 50,
            particleCount: 100,
            origin: { y: 0.5 },
          });
      }),
      (this.conffeti.instance = sn.create(this.conffeti.$canvas, {
        resize: !0,
        useWorker: !0,
      }));
  }
  setFullscreen() {
    (this.fullscreen = {}),
      (this.fullscreen.change = () => {
        document.fullscreenElement
          ? document.fullscreenElement.appendChild(this.$element)
          : document.body.appendChild(this.$element);
      }),
      (this.fullscreen.webkitChange = () => {
        document.webkitFullscreenElement
          ? document.webkitFullscreenElement.appendChild(this.$element)
          : document.body.appendChild(this.$element);
      }),
      document.addEventListener("fullscreenchange", this.fullscreen.change),
      document.addEventListener(
        "webkitfullscreenchange",
        this.fullscreen.webkitChange,
      );
  }
  update() {
    this.$triggers = this.$triggers.filter((i) => document.body.contains(i));
    const e = [...document.querySelectorAll(".js-popin-trigger")];
    for (const i of e)
      this.$triggers.includes(i) ||
        (this.$triggers.push(i),
        i.addEventListener("click", (r) => {
          r.preventDefault(), this.open(i.dataset.popinName);
        }));
    this.$popins = this.$popins.filter((i) => typeof i.dataset.preserve < "u");
    const t = [...document.querySelectorAll(".js-popin")];
    for (const i of t)
      if (!this.$popins.includes(i)) {
        this.$popins.push(i);
        const r = [...i.querySelectorAll(".js-close")],
          n = i.querySelector(".js-remember");
        n &&
          n.addEventListener("click", (s) => {
            s.stopPropagation();
          });
        for (const s of r)
          s.addEventListener("click", (a) => {
            a.preventDefault(), this.close();
          });
      }
  }
  open(e, t = !1) {
    if (this.isOpen) {
      this.$current.classList.remove("is-active"),
        yt.delayedCall(0.3, () => {
          this.$element.removeChild(this.$current),
            (this.isOpen = !1),
            this.open(e, t);
        });
      return;
    }
    const i = this.$popins.find((n) => n.classList.contains(e));
    if (typeof i > "u") return;
    const r = i.dataset.name;
    (r && window.localStorage.getItem(`popinRemember${r}`)) ||
      ((this.isOpen = !0),
      (this.$current = i),
      this.$element.appendChild(this.$current),
      this.$element.classList.add("is-open"),
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          this.$current.classList.add("is-active");
        });
      }),
      t && this.conffeti.start());
  }
  close(e) {
    if (!this.isOpen) return;
    const t = this.$current.querySelector(".js-remember .js-input");
    if (t && t.checked) {
      const r = this.$current.dataset.name;
      r && window.localStorage.setItem(`popinRemember${r}`, "1");
    }
    const i = this.$current;
    this.$element.classList.remove("is-open"),
      i.classList.remove("is-active"),
      yt.delayedCall(0.3, () => {
        this.$element.removeChild(i);
      }),
      this.conffeti.end(),
      (this.isOpen = !1),
      (this.$current = null),
      this.trigger("close", [i]);
  }
  destroy() {}
}
class bs {
  constructor(e) {
    (this.$element = e.$element), this.setGroups();
  }
  setGroups() {
    const e = document.querySelectorAll(".js-input-group");
    for (const t of e) {
      const i = t.querySelectorAll(".js-input");
      for (const r of i) {
        let n = null;
        t.classList.contains("is-error") &&
          (r.type === "checkbox"
            ? (n = !!r.checked)
            : r.type === "radio"
              ? (n = t.querySelector(`input[name="${r.name}"]:checked`)?.value)
              : (n = r.value));
        const s = () => {
          let a = null;
          r.type === "checkbox"
            ? (a = !!r.checked)
            : r.type === "radio"
              ? (a = t.querySelector(`input[name="${r.name}"]:checked`)?.value)
              : (a = r.value),
            a !== ""
              ? t.classList.add("is-filled")
              : t.classList.remove("is-filled"),
            n !== null &&
              (a !== n
                ? t.classList.remove("is-error")
                : t.classList.add("is-error")),
            r.type == "textarea" &&
              ((r.style.height = "auto"),
              (r.style.height = `${r.scrollHeight}px`));
        };
        r.addEventListener("input", s),
          s(),
          r.addEventListener("focus", () => {
            t.classList.add("is-focused");
          }),
          r.addEventListener("blur", () => {
            t.classList.remove("is-focused");
          });
      }
    }
  }
}
class xs {
  constructor(e) {
    (this.$element = e.$element),
      (this.$fields = this.$element.querySelectorAll(".js-field"));
    for (const t of this.$fields) {
      const i = t.querySelector(".js-input");
      if (i && t.classList.contains("has-error")) {
        const r = i.value;
        i.addEventListener("input", () => {
          i.value !== r
            ? t.classList.remove("has-error")
            : t.classList.add("has-error");
        });
      }
    }
  }
}
class Ts {
  constructor() {
    this.parseAndLoad();
  }
  parseAndLoad(e = null) {
    const i = [...(e || document).querySelectorAll(".js-lazy:not(.is-loaded)")];
    for (const r of i) {
      const n = new Image();
      n.addEventListener("load", () => {
        r.classList.add("is-loaded");
      }),
        (n.src = r.src);
    }
  }
}
class ks {
  constructor(e) {
    (this.$element = e.$element),
      (this.$chapters = this.$element.querySelectorAll(".js-chapter"));
    for (const t of this.$chapters) {
      let i = t.classList.contains("is-open");
      t.querySelector(".js-chapter-head").addEventListener("click", () => {
        (i = !i),
          i ? t.classList.add("is-open") : t.classList.remove("is-open");
      });
    }
  }
}
class Ss {
  constructor(e) {
    this.$wrapper = e.$wrapper;
  }
  onEnter() {
    this.setForms(),
      this.setAbyssForms(),
      this.setQuizzesIndexes(),
      (this.lazyLoader = new Ts());
  }
  onEnterCompleted() {}
  onLeave() {}
  onLeaveCompleted() {}
  setForms() {
    const e = this.$wrapper.querySelectorAll(".js-form");
    for (const t of e) new xs({ $element: t });
  }
  setAbyssForms() {
    const e = this.$wrapper.querySelectorAll(".js-abyss-form");
    for (const t of e) new bs({ $element: t });
  }
  setQuizzesIndexes() {
    const e = this.$wrapper.querySelectorAll(".js-quiz-index");
    for (const t of e) new ks({ $element: t });
  }
}
class Cs {
  constructor() {
    (this.app = window.app),
      (this.popins = app.popins),
      (this.header = app.header),
      (this.videosAutoplay = app.videosAutoplay),
      (this.$wrapper = document.querySelector("[data-router-wrapper]")),
      (this.$view = document.querySelector("[data-router-view]")),
      (this.viewName = this.$view.dataset.routerView),
      this.getPage(this.viewName, (e) => {
        (this.page = e), this.page.onEnter(), this.page.onEnterCompleted();
      }),
      (this.origin = window.location.origin),
      this.parseLinks(document),
      (this.previousHash = window.location.hash),
      (this.previousHref = window.location.href.replace(this.previousHash, "")),
      window.addEventListener("popstate", (e) => {
        const t = window.location.hash,
          i = window.location.href.replace(t, "");
        this.previousHref !== i && this.load(window.location.href, !0),
          (this.previousHash = t),
          (this.previousHref = i);
      });
  }
  parseLinks(e) {
    const t = e.querySelectorAll("a");
    for (const i of t) this.trySetLink(i);
  }
  trySetLink(e) {
    typeof e.dataset.routerDisabled < "u" ||
      typeof e.dataset.routerSet < "u" ||
      (e.href.startsWith(this.origin) &&
        (e.getAttribute("href").trim().startsWith("#") ||
          ((e.dataset.routerSet = ""),
          e.addEventListener("click", (t) => {
            t.ctrlKey ||
              t.shiftKey ||
              t.metaKey ||
              (t.button && t.button == 1) ||
              (t.preventDefault(), this.load(e.href));
          }))));
  }
  getPage(e, t) {
    const r = {
      lessons: () => import("./LessonsPage-73d46ef6.js"),
      certificateQuiz: () => import("./QuizPage-59d32ba6.js"),
      complete: () => import("./CompletePage-ec17f56a.js"),
      home: () => import("./HomePage-69247ec2.js"),
      highlights: () => import("./HighlightsPage-debcd17b.js"),
      discord: () => import("./DiscordPage-8d2894b1.js"),
      challenges: () => import("./ChallengesPage-12e2eb33.js"),
      accountSettings: () => import("./AccountSettingsPage-e22a153c.js"),
      join: () => import("./JoinPage-85927b8a.js"),
      experience: () => import("./ExperiencePage-3160c759.js"),
    }[e];
    typeof r == "function"
      ? r().then((n) => {
          t(new n.default(this));
        })
      : window.requestAnimationFrame(() => {
          t(new Ss(this));
        });
  }
  load(e, t = !1) {
    let i = !1,
      r = !1,
      n = !1,
      s = null,
      a = null,
      o = null;
    const l = () => {
      if (
        (n &&
          !r &&
          ((a = s.dataset.routerView),
          this.getPage(a, (h) => {
            (o = h), (r = !0), l();
          })),
        i && n && r)
      ) {
        window.scrollTo(0, 0),
          document.documentElement.classList.remove(this.viewName),
          document.documentElement.classList.add(a),
          (this.viewName = a);
        const h = s.querySelectorAll("script");
        for (const f of h) {
          const d = document.createElement("script");
          d.setAttribute("src", f.getAttribute("src")),
            document.body.appendChild(d),
            f.remove();
        }
        this.$view.remove(),
          (this.$view = s),
          this.$wrapper.appendChild(this.$view),
          this.popins.update(),
          this.header.updateForNavigation(this.viewName),
          this.videosAutoplay.update(),
          this.parseLinks(this.$view),
          (this.page = o),
          this.page.onEnter(),
          yt.fromTo(
            this.$view,
            { opacity: 0 },
            {
              opacity: 1,
              duration: 0.3,
              ease: qi.easeIn,
              onComplete: () => {
                this.page.onEnterCompleted();
              },
            },
          );
      }
    };
    this.page.onLeave(),
      this.popins.close(),
      yt.fromTo(
        this.$view,
        { opacity: 1 },
        {
          opacity: 0,
          duration: 0.3,
          ease: qi.easeOut,
          onComplete: () => {
            this.page.onLeaveCompleted(), (i = !0), l();
          },
        },
      ),
      window
        .fetch(e)
        .then(
          (h) => (
            t ||
              (history.pushState({}, null, h.url),
              (this.previousHash = window.location.hash),
              (this.previousHref = h.url.replace(this.previousHash, ""))),
            h.text()
          ),
        )
        .then((h) => {
          const f = document.createElement("template");
          (f.innerHTML = h),
            (s = f.content.querySelector("[data-router-view]"));
          const d = f.content.querySelector("title");
          d && (document.title = d.textContent), (n = !0), l();
        });
  }
}
class Ms {
  constructor() {
    (this.container = document.querySelector(".js-header")),
      this.container &&
        ((this.opened = !1), this.setTriggers(), this.setLinks());
  }
  setTriggers() {
    this.container
      .querySelector(".js-menu-trigger")
      .addEventListener("click", (n) => {
        n.preventDefault(), this.toggle();
      }),
      window.addEventListener("keydown", (n) => {
        n.code === "Escape" && this.close();
      }),
      this.container
        .querySelector(".js-menu-background")
        .addEventListener("click", (n) => {
          n.preventDefault(), this.close();
        });
    const i = window.matchMedia("(max-width: 1080px)"),
      r = (n) => {
        n.matches || this.close();
      };
    i.addListener
      ? i.addListener(r)
      : i.addEventListener && i.addEventListener(r);
  }
  setLinks() {
    (this.links = {}),
      (this.links.$items = this.container.querySelectorAll(".js-link"));
  }
  open() {
    this.opened ||
      (this.container.classList.add("is-menu-open"), (this.opened = !0));
  }
  close() {
    this.opened &&
      (this.container.classList.remove("is-menu-open"), (this.opened = !1));
  }
  toggle() {
    this.opened ? this.close() : this.open();
  }
  updateForNavigation(e) {
    if (this.container) {
      for (const t of this.links.$items)
        t.classList.contains(`link-${e}`)
          ? t.classList.add("is-active")
          : t.classList.remove("is-active");
      this.close();
    }
  }
}
class Ps {
  constructor() {
    (this.observer = new IntersectionObserver(
      (e) => {
        for (const t of e)
          t.isVisible || t.isIntersecting ? t.target.play() : t.target.pause();
      },
      { threshold: 0 },
    )),
      this.update();
  }
  update() {
    const e = document.querySelectorAll(".js-video-autoplay");
    for (const t of e) this.observer.observe(t);
  }
}
class Os {
  constructor() {
    (this.element = document.querySelector(".js-black-friday")),
      this.element && this.setTime();
  }
  setTime() {
    (this.time = {}),
      (this.time.element = this.element.querySelector(".js-time")),
      (this.time.hours = this.time.element.querySelector(".js-hours")),
      (this.time.minutes = this.time.element.querySelector(".js-minutes")),
      (this.time.seconds = this.time.element.querySelector(".js-seconds")),
      (this.time.start = parseInt(this.element.dataset.start)),
      (this.time.end = parseInt(this.element.dataset.end)),
      (this.time.duration = this.time.end - this.time.start),
      (this.time.update = () => {
        const e = Date.now() / 1e3;
        let t = Math.max(0, this.time.end - e);
        const i = "" + Math.floor(t / 60 / 60);
        t -= i * 60 * 60;
        const r = "" + Math.floor(t / 60);
        t -= r * 60;
        const n = "" + Math.floor(t);
        (this.time.hours.textContent = i.padStart(2, "0")),
          (this.time.minutes.textContent = r.padStart(2, "0")),
          (this.time.seconds.textContent = n.padStart(2, "0"));
      }),
      window.setInterval(this.time.update, 1e3),
      this.time.update();
  }
}
class Es {
  constructor() {
    (window.app = this),
      (this.time = new nn()),
      (this.sizes = new rn()),
      (this.popins = new ws()),
      (this.header = new Ms()),
      (this.videosAutoplay = new Ps()),
      (this.blackFriday = new Os()),
      this.setStorage(),
      this.setTouch(),
      this.setUserWitness(),
      this.setAsyncNavigation();
  }
  setStorage() {
    const e = new URLSearchParams(window.location.search);
    e.has("c") && window.localStorage.setItem("c", e.get("c"));
  }
  setTouch() {
    (this.touch = !1),
      (this.mouse = !1),
      window.addEventListener(
        "mousemove",
        () => {
          document.documentElement.classList.add("has-mouse"),
            (this.mouse = !0);
        },
        { once: !0 },
      ),
      window.addEventListener(
        "touchstart",
        () => {
          document.documentElement.classList.add("has-touch"),
            (this.touch = !0);
        },
        { once: !0 },
      );
  }
  setUserWitness() {
    (this.userWitness = {}),
      (this.userWitness.connected =
        !!document.querySelector(".js-user-witness")),
      (this.userWitness.test = () => {
        !!!document.querySelector(".js-user-witness") &&
          this.userWitness.connected &&
          window.location.reload();
      });
  }
  setAsyncNavigation() {
    this.asyncNavigation = new Cs();
  }
}
window.app || (window.app = new Es());
export { Ss as D, hi as E, Ts as L, ae as a, sn as c, yt as g };
//# sourceMappingURL=index.js.map
