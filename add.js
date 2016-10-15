var define;
var require;
var esl;
(function (b) {
    var o = {};
    var w = 1;
    var g = 2;
    var r = 3;
    var p = 4;
    var aj = {};

    function M(an) {
        if (!k(an, p)) {
            aj[an] = 1
        }
    }
    var y = {
        require: ak,
        exports: 1,
        module: 1
    };
    var ag = W();
    var N;
    var n = {
        baseUrl: "./",
        paths: {},
        config: {},
        map: {},
        packages: [],
        shim: {},
        waitSeconds: 0,
        bundles: {},
        urlArgs: {}
    };

    function ak(aq, ar) {
        var ao = [];

        function an(at) {
            if (at.indexOf(".") === 0) {
                ao.push(at)
            }
        }
        if (typeof aq === "string") {
            an(aq)
        } else {
            ab(aq, function (at) {
                an(at)
            })
        }
        if (ao.length > 0) {
            throw new Error("[REQUIRE_FATAL]Relative ID is not allowed in global require: " + ao.join(", "))
        }
        var ap = n.waitSeconds;
        if (ap && (aq instanceof Array)) {
            if (N) {
                clearTimeout(N)
            }
            N = setTimeout(F, ap * 1000)
        }
        return ag(aq, ar)
    }
    ak.version = "2.1.4";
    ak.loader = "esl";
    ak.toUrl = ag.toUrl;

    function F() {
        var ar = [];
        var at = [];
        var ap = {};
        var aq = {};
        var ao = {};

        function an(ax, aw) {
            if (ao[ax] || k(ax, p)) {
                return
            }
            ao[ax] = 1;
            var av = o[ax];
            if (!av) {
                if (!aq[ax]) {
                    aq[ax] = 1;
                    at.push(ax)
                }
            } else {
                if (aw || !k(ax, r) || av.hang) {
                    if (!ap[ax]) {
                        ap[ax] = 1;
                        ar.push(ax)
                    }
                    ab(av.depMs, function (ay) {
                        an(ay.absId, ay.hard)
                    })
                }
            }
        }
        for (var au in aj) {
            an(au, 1)
        }
        if (ar.length || at.length) {
            throw new Error("[MODULE_TIMEOUT]Hang(" + (ar.join(", ") || "none") + ") Miss(" + (at.join(", ") || "none") + ")")
        }
    }
    var q = [];

    function Z(an) {
        ab(q, function (ao) {
            x(an, ao.deps, ao.factory)
        });
        q.length = 0
    }

    function D(ar, aq, ap) {
        if (ap == null) {
            if (aq == null) {
                ap = ar;
                ar = null
            } else {
                ap = aq;
                aq = null;
                if (ar instanceof Array) {
                    aq = ar;
                    ar = null
                }
            }
        }
        if (ap == null) {
            return
        }
        var an = window.opera;
        if (!ar && document.attachEvent && (!(an && an.toString() === "[object Opera]"))) {
            var ao = t();
            ar = ao && ao.getAttribute("data-require-id")
        }
        if (ar) {
            x(ar, aq, ap)
        } else {
            q[0] = {
                deps: aq,
                factory: ap
            }
        }
    }
    D.amd = {};

    function ad() {
        var an = n.config[this.id];
        if (an && typeof an === "object") {
            return an
        }
        return {}
    }

    function x(ap, ao, an) {
        if (!o[ap]) {
            o[ap] = {
                id: ap,
                depsDec: ao,
                deps: ao || ["require", "exports", "module"],
                factoryDeps: [],
                factory: an,
                exports: {},
                config: ad,
                state: w,
                require: W(ap),
                depMs: [],
                depMkv: {},
                depRs: [],
                hang: 0
            }
        }
    }

    function I(au) {
        var aq = o[au];
        if (!aq || k(au, g)) {
            return
        }
        var at = aq.deps;
        var ap = aq.factory;
        var ar = 0;
        if (typeof ap === "function") {
            ar = Math.min(ap.length, at.length);
            !aq.depsDec && ap.toString().replace(/(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg, "").replace(/require\(\s*(['"])([^'"]+)\1\s*\)/g, function (aw, av, ax) {
                at.push(ax)
            })
        }
        var ao = [];
        var an = [];
        ab(at, function (aw, av) {
            var az = V(aw);
            var ay = af(az.mod, au);
            var aA;
            var ax;
            if (ay && !y[ay]) {
                if (az.res) {
                    ax = {
                        id: aw,
                        mod: ay,
                        res: az.res
                    };
                    an.push(aw);
                    aq.depRs.push(ax)
                }
                aA = aq.depMkv[ay];
                if (!aA) {
                    aA = {
                        id: az.mod,
                        absId: ay,
                        hard: av < ar
                    };
                    aq.depMs.push(aA);
                    aq.depMkv[ay] = aA;
                    ao.push(ay)
                }
            } else {
                aA = {
                    absId: ay
                }
            }
            if (av < ar) {
                aq.factoryDeps.push(ax || aA)
            }
        });
        aq.state = g;
        O(au);
        m(ao);
        an.length && aq.require(an, function () {
            ab(aq.depRs, function (av) {
                if (!av.absId) {
                    av.absId = af(av.id, au)
                }
            });
            X()
        })
    }

    function X() {
        for (var an in aj) {
            I(an);
            B(an);
            am(an)
        }
    }

    function B(ap) {
        var an = {};
        ao(ap);

        function ao(at) {
            I(at);
            if (!k(at, g)) {
                return false
            }
            if (k(at, r) || an[at]) {
                return true
            }
            an[at] = 1;
            var aq = o[at];
            var ar = true;
            ab(aq.depMs, function (au) {
                ar = ao(au.absId) && ar
            });
            ar && ab(aq.depRs, function (au) {
                ar = !!au.absId;
                return ar
            });
            if (ar && !k(at, r)) {
                aq.state = r
            }
            an[at] = 0;
            return ar
        }
    }

    function O(aq) {
        var ao = o[aq];
        var ap;
        ao.invokeFactory = an;

        function an() {
            if (ap || ao.state !== r) {
                return
            }
            ap = 1;
            var av = 1;
            ab(ao.factoryDeps, function (ax) {
                var aw = ax.absId;
                if (!y[aw]) {
                    am(aw);
                    return (av = k(aw, p))
                }
            });
            if (av) {
                try {
                    var at = ao.factory;
                    var ar = typeof at === "function" ? at.apply(b, ae(ao.factoryDeps, {
                        require: ao.require,
                        exports: ao.exports,
                        module: ao
                    })) : at;
                    if (ar != null) {
                        ao.exports = ar
                    }
                    ao.invokeFactory = null
                } catch (au) {
                    ao.hang = 1;
                    throw au
                }
                z(aq)
            }
        }
    }

    function k(ao, an) {
        return o[ao] && o[ao].state >= an
    }

    function am(ao) {
        var an = o[ao];
        if (an && an.invokeFactory) {
            an.invokeFactory()
        }
    }

    function ae(ao, ap) {
        var an = [];
        ab(ao, function (ar, aq) {
            if (typeof ar === "object") {
                ar = ar.absId
            }
            an[aq] = ap[ar] || o[ar].exports
        });
        return an
    }
    var U = {};

    function f(ap, ao) {
        if (k(ap, p)) {
            ao();
            return
        }
        var an = U[ap];
        if (!an) {
            an = U[ap] = []
        }
        an.push(ao)
    }

    function z(aq) {
        var ao = o[aq];
        ao.state = p;
        delete aj[aq];
        var ap = U[aq] || [];
        var an = ap.length;
        while (an--) {
            ap[an]()
        }
        ap.length = 0;
        U[aq] = null
    }

    function m(ap, ar, an) {
        var aq = 0;
        ab(ap, function (at) {
            if (!(y[at] || k(at, p))) {
                f(at, ao);
                (at.indexOf("!") > 0 ? C : i)(at, an)
            }
        });
        ao();

        function ao() {
            if (typeof ar === "function" && !aq) {
                var at = 1;
                ab(ap, function (au) {
                    if (!y[au]) {
                        return (at = !!k(au, p))
                    }
                });
                if (at) {
                    aq = 1;
                    ar.apply(b, ae(ap, y))
                }
            }
        }
    }
    var P = {};

    function i(ap) {
        if (P[ap] || o[ap]) {
            return
        }
        P[ap] = 1;
        var ar = n.shim[ap];
        if (ar instanceof Array) {
            n.shim[ap] = ar = {
                deps: ar
            }
        }
        var ao = ar && (ar.deps || []);
        if (ao) {
            ab(ao, function (at) {
                if (!n.shim[at]) {
                    n.shim[at] = {}
                }
            });
            ag(ao, aq)
        } else {
            aq()
        }

        function aq() {
            var at = T[ap];
            s(at || ap, an)
        }

        function an() {
            if (ar) {
                var at;
                if (typeof ar.init === "function") {
                    at = ar.init.apply(b, ae(ao, y))
                }
                if (at == null && ar.exports) {
                    at = b;
                    ab(ar.exports.split("."), function (au) {
                        at = at[au];
                        return !!at
                    })
                }
                D(ap, ao, function () {
                    return at || {}
                })
            } else {
                Z(ap)
            }
            X()
        }
    }

    function C(an, aq) {
        if (o[an]) {
            return
        }
        var ap = T[an];
        if (ap) {
            i(ap);
            return
        }
        var au = V(an);
        var at = {
            id: an,
            state: g
        };
        o[an] = at;

        function ao(av) {
            at.exports = av || true;
            z(an)
        }
        ao.fromText = function (aw, av) {
            new Function(av)();
            Z(aw)
        };

        function ar(av) {
            var aw = aq ? o[aq].require : ag;
            av.load(au.res, aw, ao, ad.call({
                id: an
            }))
        }
        ar(ag(au.mod))
    }
    ak.config = function (ap) {
        if (ap) {
            for (var aq in n) {
                var ar = ap[aq];
                var ao = n[aq];
                if (!ar) {
                    continue
                }
                if (aq === "urlArgs" && typeof ar === "string") {
                    n.urlArgs["*"] = ar
                } else {
                    if (ao instanceof Array) {
                        ao.push.apply(ao, ar)
                    } else {
                        if (typeof ao === "object") {
                            for (var an in ar) {
                                ao[an] = ar[an]
                            }
                        } else {
                            n[aq] = ar
                        }
                    }
                }
            }
            ah()
        }
    };
    ah();
    var K;
    var H;
    var L;
    var T;
    var ac;

    function E(ap, an) {
        var ao = S(ap, 1, an);
        ao.sort(l);
        return ao
    }

    function ah() {
        n.baseUrl = n.baseUrl.replace(/\/$/, "") + "/";
        K = E(n.paths);
        L = E(n.map, 1);
        ab(L, function (aq) {
            aq.v = E(aq.v)
        });
        var ao = L[L.length - 1];
        if (ao && ao.k === "*") {
            ab(L, function (aq) {
                if (aq != ao) {
                    aq.v = aq.v.concat(ao.v)
                }
            })
        }
        H = [];
        ab(n.packages, function (aq) {
            var ar = aq;
            if (typeof aq === "string") {
                ar = {
                    name: aq.split("/")[0],
                    location: aq,
                    main: "main"
                }
            }
            ar.location = ar.location || ar.name;
            ar.main = (ar.main || "main").replace(/\.js$/i, "");
            ar.reg = Y(ar.name);
            H.push(ar)
        });
        H.sort(l);
        ac = E(n.urlArgs, 1);
        T = {};

        function an(aq) {
            T[al(aq)] = ap
        }
        for (var ap in n.bundles) {
            ab(n.bundles[ap], an)
        }
    }

    function aa(ao, an, ap) {
        ab(an, function (aq) {
            if (aq.reg.test(ao)) {
                ap(aq.v, aq.k, aq);
                return false
            }
        })
    }

    function J(an, av) {
        var aq = /(\.[a-z0-9]+)$/i;
        var aw = /(\?[^#]*)$/;
        var ar = "";
        var ap = an;
        var at = "";
        if (aw.test(an)) {
            at = RegExp.$1;
            an = an.replace(aw, "")
        }
        if (aq.test(an)) {
            ar = RegExp.$1;
            ap = an.replace(aq, "")
        }
        if (av != null) {
            ap = af(ap, av)
        }
        var ao = ap;
        var au;
        aa(ap, K, function (ay, ax) {
            ao = ao.replace(ax, ay);
            au = 1
        });
        if (!au) {
            aa(ap, H, function (az, ax, ay) {
                ao = ao.replace(ay.name, ay.location)
            })
        }
        if (!/^([a-z]{2,10}:\/)?\//i.test(ao)) {
            ao = n.baseUrl + ao
        }
        ao += ar + at;
        aa(ap, ac, function (ax) {
            ao += (ao.indexOf("?") > 0 ? "&" : "?") + ax
        });
        return ao
    }

    function W(an) {
        var ap = {};

        function ao(at, av) {
            if (typeof at === "string") {
                if (!ap[at]) {
                    var ar = af(at, an);
                    am(ar);
                    if (!k(ar, p)) {
                        throw new Error('[MODULE_MISS]"' + ar + '" is not exists!')
                    }
                    ap[at] = o[ar].exports
                }
                return ap[at]
            } else {
                if (at instanceof Array) {
                    var aq = [];
                    var au = [];
                    ab(at, function (aC, ay) {
                        var aA = V(aC);
                        var az = af(aA.mod, an);
                        var aB = aA.res;
                        var aw = az;
                        if (aB) {
                            var ax = az + "!" + aB;
                            if (aB.indexOf(".") !== 0 && T[ax]) {
                                az = aw = ax
                            } else {
                                aw = null
                            }
                        }
                        au[ay] = aw;
                        M(az);
                        aq.push(az)
                    });
                    m(aq, function () {
                        ab(au, function (ax, aw) {
                            if (ax == null) {
                                ax = au[aw] = af(at[aw], an);
                                M(ax)
                            }
                        });
                        m(au, av, an);
                        X()
                    }, an);
                    X()
                }
            }
        }
        ao.toUrl = function (aq) {
            return J(aq, an || "")
        };
        return ao
    }

    function af(at, an) {
        if (!at) {
            return ""
        }
        an = an || "";
        var aq = V(at);
        if (!aq) {
            return at
        }
        var ar = aq.res;
        var ap = j(aq.mod, an);
        aa(an, L, function (au) {
            aa(ap, au, function (aw, av) {
                ap = ap.replace(av, aw)
            })
        });
        ap = al(ap);
        if (ar) {
            var ao = k(ap, p) && ag(ap);
            ar = ao && ao.normalize ? ao.normalize(ar, function (au) {
                return af(au, an)
            }) : af(ar, an);
            ap += "!" + ar
        }
        return ap
    }

    function al(an) {
        ab(H, function (ao) {
            var ap = ao.name;
            if (ap === an) {
                an = ap + "/" + ao.main;
                return false
            }
        });
        return an
    }

    function j(at, ap) {
        if (at.indexOf(".") !== 0) {
            return at
        }
        var ao = ap.split("/").slice(0, -1).concat(at.split("/"));
        var ar = [];
        for (var aq = 0; aq < ao.length; aq++) {
            var an = ao[aq];
            switch (an) {
            case ".":
                break;
            case "..":
                if (ar.length && ar[ar.length - 1] !== "..") {
                    ar.pop()
                } else {
                    ar.push(an)
                }
                break;
            default:
                an && ar.push(an)
            }
        }
        return ar.join("/")
    }

    function V(ao) {
        var an = ao.split("!");
        if (an[0]) {
            return {
                mod: an[0],
                res: an[1]
            }
        }
    }

    function S(at, aq, an) {
        var ar = [];
        for (var ao in at) {
            if (at.hasOwnProperty(ao)) {
                var ap = {
                    k: ao,
                    v: at[ao]
                };
                ar.push(ap);
                if (aq) {
                    ap.reg = ao === "*" && an ? /^/ : Y(ao)
                }
            }
        }
        return ar
    }

    function Y(an) {
        return new RegExp("^" + an + "(/|$)")
    }

    function ab(aq, ap) {
        if (aq instanceof Array) {
            for (var ao = 0, an = aq.length; ao < an; ao++) {
                if (ap(aq[ao], ao) === false) {
                    break
                }
            }
        }
    }

    function l(ao, an) {
        var aq = ao.k || ao.name;
        var ap = an.k || an.name;
        if (ap === "*") {
            return -1
        }
        if (aq === "*") {
            return 1
        }
        return ap.length - aq.length
    }
    var Q;
    var u;

    function t() {
        if (Q) {
            return Q
        } else {
            if (u && u.readyState === "interactive") {
                return u
            }
        }
        var an = document.getElementsByTagName("script");
        var ap = an.length;
        while (ap--) {
            var ao = an[ap];
            if (ao.readyState === "interactive") {
                u = ao;
                return ao
            }
        }
    }
    var R = document.getElementsByTagName("head")[0];
    var d = document.getElementsByTagName("base")[0];
    if (d) {
        R = d.parentNode
    }

    function s(ap, aq) {
        var an = document.createElement("script");
        an.setAttribute("data-require-id", ap);
        an.src = J(ap + ".js");
        an.async = true;
        if (an.readyState) {
            an.onreadystatechange = ao
        } else {
            an.onload = ao
        }

        function ao() {
            var ar = an.readyState;
            if (typeof ar === "undefined" || /^(loaded|complete)$/.test(ar)) {
                an.onload = an.onreadystatechange = null;
                an = null;
                aq()
            }
        }
        Q = an;
        d ? R.insertBefore(an, d) : R.appendChild(an);
        Q = null
    }
    if (!define) {
        define = D;
        if (!require) {
            require = ak
        }
        esl = ak
    }
    var a;
    (function () {
        var ao = document.getElementsByTagName("script");
        var an = ao.length;
        while (an--) {
            var ap = ao[an];
            if ((a = ap.getAttribute("data-main"))) {
                break
            }
        }
    })();
    a && setTimeout(function () {
        ak([a])
    }, 4)
})(this);
define("jquery", [], function () {
    return window.jQuery
});
if (bds && bds.comm) {
    bds.comm.did = (function () {
        var a = "";
        for (var b = 0; b < 32; b++) {
            a += Math.floor(Math.random() * 16).toString(16)
        }
        return a
    })();
    bds.comm.isAsync = (function () {
        var a = "onhashchange" in window;
        var b = "onpopstate" in window;
        return (b || a) && Cookie.get("ISSW") != 1 && !window.__disable_preload
    })()
}
jQuery && jQuery.extend({
    stringify: function stringify(b) {
        if ("JSON" in window) {
            return JSON.stringify(b)
        }
        var l = typeof (b);
        if (l != "object" || b === null) {
            if (l == "string") {
                b = '"' + b + '"'
            }
            return String(b)
        } else {
            var d = {
                "\b": "\\b",
                "\t": "\\t",
                "\n": "\\n",
                "\f": "\\f",
                "\r": "\\r",
                '"': '\\"',
                "\\": "\\\\"
            };

            function i(n) {
                if (/["\\\x00-\x1f]/.test(n)) {
                    n = n.replace(/["\\\x00-\x1f]/g, function (o) {
                        var p = d[o];
                        if (p) {
                            return p
                        }
                        p = o.charCodeAt();
                        return "\\u00" + Math.floor(p / 16).toString(16) + (p % 16).toString(16)
                    })
                }
                return '"' + n + '"'
            }

            function a(s) {
                var o = ["["],
                    p = s.length,
                    n, q, r;
                for (q = 0; q < p; q++) {
                    r = s[q];
                    switch (typeof r) {
                    case "undefined":
                    case "function":
                    case "unknown":
                        break;
                    default:
                        if (n) {
                            o.push(",")
                        }
                        o.push($.stringify(r));
                        n = 1
                    }
                }
                o.push("]");
                return o.join("")
            }
            switch (typeof b) {
            case "undefined":
                return "undefined";
            case "number":
                return isFinite(b) ? String(b) : "null";
            case "string":
                return i(b);
            case "boolean":
                return String(b);
            default:
                if (b === null) {
                    return "null"
                } else {
                    if (Object.prototype.toString.call(b) === "[object Array]") {
                        return a(b)
                    } else {
                        var m = ["{"],
                            g = $.stringify,
                            f, k;
                        for (var j in b) {
                            if (Object.prototype.hasOwnProperty.call(b, j)) {
                                k = b[j];
                                switch (typeof k) {
                                case "undefined":
                                case "unknown":
                                case "function":
                                    break;
                                default:
                                    if (f) {
                                        m.push(",")
                                    }
                                    f = 1;
                                    m.push(g(j) + ":" + g(k))
                                }
                            }
                        }
                        m.push("}");
                        return m.join("")
                    }
                }
            }
        }
    },
    format: function (d, a) {
        d = String(d);
        var b = Array.prototype.slice.call(arguments, 1),
            f = Object.prototype.toString;
        if (b.length) {
            b = b.length == 1 ? (a !== null && (/\[object Array\]|\[object Object\]/.test(f.call(a))) ? a : b) : b;
            return d.replace(/#\{(.+?)\}/g, function (g, j) {
                var i = b[j];
                if ("[object Function]" == f.call(i)) {
                    i = i(j)
                }
                return ("undefined" == typeof i ? "" : i)
            })
        }
        return d
    },
    subByte: function (m, b, g) {
        var f = [],
            k = m.split("");
        g = g || "…";
        for (var j = 0, d = k.length; j < d; j++) {
            if (k[j].charCodeAt(0) > 255) {
                f.push("*")
            }
            f.push(k[j])
        }
        if (b && b > 0 && f.length > b) {
            k = f.join("").substring(0, b - 1).replace(/\*/g, "") + g
        } else {
            return m
        }
        return k
    },
    getByteLength: function (j) {
        var d = [],
            g = j.split("");
        for (var f = 0, b = g.length; f < b; f++) {
            if (g[f].charCodeAt(0) > 255) {
                d.push("*")
            }
            d.push(g[f])
        }
        return d.length
    },
    _isValidKey: function (a) {
        return (new RegExp('^[^\\x00-\\x20\\x7f\\(\\)<>@,;:\\\\\\"\\[\\]\\?=\\{\\}\\/\\u0080-\\uffff]+\x24')).test(a)
    },
    setCookie: function (d, f, b) {
        f = encodeURIComponent(f);
        if (!jQuery._isValidKey(d)) {
            return
        }
        b = b || {};
        var a = b.expires;
        if ("number" == typeof b.expires) {
            a = new Date();
            a.setTime(a.getTime() + b.expires)
        }
        document.cookie = d + "=" + f + (b.path ? "; path=" + b.path : "") + (a ? "; expires=" + a.toGMTString() : "") + (b.domain ? "; domain=" + b.domain : "") + (b.secure ? "; secure" : "")
    },
    getCookie: function (b) {
        var f = "";
        if (jQuery._isValidKey(b)) {
            var d = new RegExp("(^| )" + b + "=([^;]*)(;|\x24)"),
                a = d.exec(document.cookie);
            if (a) {
                f = a[2] || null;
                if ("string" == typeof f) {
                    f = decodeURIComponent(f);
                    return f
                }
            }
        }
        return null
    },
    removeCookie: function (b, a) {
        a = a || {};
        a.expires = new Date(0);
        jQuery.setCookie(b, "", a)
    },
    limitWd: function (n, b) {
        if (n === "") {
            return ""
        }
        n = n + "";
        var f = [],
            j = n.split(""),
            d = j.length,
            k = 0,
            m = b || 255;
        if (d <= parseInt(m / 2)) {
            return n
        }
        for (var g = 0; g < d; g++) {
            if (j[g].charCodeAt(0) > 255) {
                k += 2
            } else {
                k += 1
            }
            if (k === m) {
                j = n.substring(0, g + 1);
                return j
            } else {
                if (k > m) {
                    j = n.substring(0, g);
                    return j
                }
            }
        }
        return n
    }
});

function addEV(d, b, a) {
    if (window.attachEvent) {
        d.attachEvent("on" + b, a)
    } else {
        if (window.addEventListener) {
            d.addEventListener(b, a, false)
        }
    }
}

function _aMC(d) {
    var b = d,
        a = -1;
    while (b = b.parentNode) {
        a = parseInt(b.getAttribute("id"));
        if (a > 0) {
            return a
        }
    }
}

function al_c(a) {
    while (a.tagName != "TABLE") {
        a = a.parentNode
    }
    return a.getAttribute("id")
}

function al_c2(b, a) {
    while (a--) {
        while ((b = b.parentNode).tagName != "TABLE") {}
    }
    return b.getAttribute("id")
}

function c(a) {
    var k = a.p1;
    if (a.fm == "alop" && !("rsv_xpath" in a)) {
        if (k && G(k).getAttribute("srcid") == "6677") {} else {
            return true
        }
    }
    if (k && !("p5" in a)) {
        a.p5 = k
    }
    var b = window.document.location.href,
        g = "",
        d = "",
        m = "",
        f = window["BD_PS_C" + (new Date()).getTime()] = new Image();
    for (v in a) {
        switch (v) {
        case "title":
            d = a[v].replace(/<[^<>]+>/g, "");
            if (d && d.length > 100) {
                d = d.substring(0, 100)
            }
            d = encodeURIComponent(d);
            break;
        case "mu":
        case "url":
            d = escape(a[v]);
            break;
        default:
            d = a[v]
        }
        g += "&" + v + "=" + d
    }
    if (!("mu" in a)) {
        try {
            if (("p2" in a) && G(a.p1).getAttribute("mu") && a.fm != "pl") {
                m = "&mu=" + escape(G(a.p1).getAttribute("mu"))
            }
        } catch (i) {}
    }
    if (window.bds && bds.comm) {
        var j = bds.comm.ubsurl + "?q=" + bds.comm.queryEnc + g + m + "&rsv_sid=" + bds.comm.sid + "&cid=" + bds.comm.cid + "&qid=" + bds.comm.queryId + "&t=" + new Date().getTime();
        if (bds.comm.inter) {
            j = j + "&rsv_inter=" + bds.comm.inter
        }
        if (bds.comm.seinfo && bds.comm.seinfo.rsv_pstg) {
            j = j + "&rsv_pstg=" + bds.comm.seinfo.rsv_pstg
        }
        if (bds.comm.cftime && bds.comm.cftime != 0) {
            j = j + "&rsv_cftime=" + bds.comm.cftime
        }
        if (bds.comm.resultPage) {
            j = j + "&rsv_iorr=1"
        } else {
            j = j + "&rsv_iorr=0"
        }
        if (bds.comm.tn) {
            j = j + "&rsv_tn=" + bds.comm.tn
        }
        if (bds.comm.indexSid) {
            j += "&rsv_isid=" + bds.comm.indexSid
        }
        if (bds.comm.lastVoiceQuery) {
            j += "&rsv_lavo=" + encodeURIComponent(bds.comm.lastVoiceQuery)
        }
        if (Cookie.get("ispeed")) {
            j += "&rsv_ispeed=" + Cookie.get("ispeed")
        }
        if (/ssl_sample/.test(location.href)) {
            var l = location.href.match(/ssl_sample=[^=&]+/i);
            j += "&rsv_" + l[0]
        }
        if (/ssl_s=/.test(location.href)) {
            var l = location.href.match(/ssl_s=[^=&]+/i);
            j += "&rsv_" + l[0]
        }
        j += "&rsv_ssl=" + (location.protocol === "https:" ? 1 : 0);
        j += "&path=" + encodeURIComponent(b);
        j += "&rsv_did=" + (bds.comm.did ? bds.comm.did : "");
        f.src = j
    }
    return true
}
$(window).on("resize", function () {
    if ("pageState" in window && pageState != 0) {
        bds.util.setContainerWidth();
        bds.event.trigger("se.window_resize")
    }
});
(function () {
    var b = bds.util && bds.util.domain ? bds.util.domain.get("http://s1.bdstatic.com") : "http://s1.bdstatic.com";
    var a = bds.util && bds.util.domain ? bds.util.domain.get("http://ecmb.bdimg.com") : "http://ecmb.bdimg.com";
    require.config({
        baseUrl: b + "/r/www/cache/biz",
        packages: [{
            name: "ecma",
            location: a + "/public01"
        }, {
            name: "ecmb",
            location: a + "/public01"
        }],
        paths: {
            aladdin: b + "/r/www/aladdin",
            ui: b + "/r/www/cache/amd/ui",
            "ui/config": b + "/r/www/cache/amd/ui/Control",
            "ui/lib": b + "/r/www/cache/amd/ui/Control",
            "ui/Control": b + "/r/www/cache/amd/ui/Control"
        },
        urlArgs: {
            "ui/ImgZoomHover": "20141104",
            "ui/ImgZoomHover1": "20141104",
            "ui/ImgZoomHover2": "20141104",
            "ui/ImgZoomHover3": "20141104"
        }
    })
})();

function TagQ(a, b) {
    return b.getElementsByTagName(a)
}

function h(b) {
    b.style.behavior = "url(#default#homepage)";
    b.setHomePage(bds.comm.domain);
    var a = window["BD_PS_C" + (new Date()).getTime()] = new Image();
    a.src = bds.comm.ubsurl + "?fm=hp&tn=" + bds.comm.tn + "&t=" + new Date().getTime()
}

function setHeadUrl(b) {
    var d = G("kw").value;
    d = encodeURIComponent(d);
    var a = b.href;
    a = a.replace(new RegExp("(" + b.getAttribute("wdfield") + "=)[^&]*"), "\x241" + d);
    b.href = a
}
bds.util.addStyle = function (b) {
    if (isIE) {
        var d = document.createStyleSheet();
        d.cssText = b
    } else {
        var a = document.createElement("style");
        a.type = "text/css";
        a.appendChild(document.createTextNode(b));
        document.getElementsByTagName("HEAD")[0].appendChild(a)
    }
};
bds.util.getContentRightHeight = function () {
    return ($("#content_right").get(0)) ? $("#content_right").get(0).offsetHeight : 0
};
bds.util.getContentLeftHeight = function () {
    return ($("#content_left").get(0)) ? $("#content_left").get(0).offsetHeight : 0
};
if (!window.A) {
    function G(a) {
        return document.getElementById(a)
    }
    window.bds = window.bds || {};
    bds.util = bds.util || {};
    bds.util.getWinWidth = function () {
        return window.document.documentElement.clientWidth
    };
    bds.util.setContainerWidth = function () {
        var g = G("container"),
            b = G("wrapper"),
            a = function (i, j) {
                j.className = j.className.replace(i, "")
            },
            f = function (i, j) {
                j.className = (j.className + " " + i).replace(/^\s+/g, "")
            },
            d = function (i, j) {
                return i.test(j.className)
            };
        if (bds.util.getWinWidth() < 1207) {
            if (g) {
                a(/\bcontainer_l\b/g, g);
                if (!d(/\bcontainer_s\b/, g)) {
                    f("container_s", g)
                }
            }
            if (b) {
                a(/\bwrapper_l\b/g, b);
                if (!d(/\bwrapper_s\b/, b)) {
                    f("wrapper_s", b)
                }
            }
            bds.comm.containerSize = "s"
        } else {
            if (g) {
                a(/\bcontainer_s\b/g, g);
                if (!d(/\bcontainer_l\b/, g)) {
                    f("container_l", g)
                }
            }
            if (b) {
                a(/\bwrapper_s\b/g, b);
                if (!d(/\bwrapper_l\b/, b)) {
                    f("wrapper_l", b)
                }
            }
            bds.comm.containerSize = "l"
        }
    };
    (function () {
        var d = [],
            i = false;
        var b = function (k, j) {
                try {
                    k.call(j)
                } catch (l) {}
            },
            f = function () {
                this.ids = [];
                this.has = true;
                this.list = [];
                this.logs = [];
                this.loadTimes = [];
                this.groupData = [];
                this.mergeFns = [];
                this._currentContainer = null
            };
        window.A = bds.aladdin = {};
        b(f, window.A);
        bds.ready = function (j) {
            if (typeof j != "function") {
                return
            }
            if (i) {
                b(j)
            } else {
                d.push(j)
            }
        };
        bds.doReady = function () {
            i = true;
            while (d.length) {
                b(d.shift())
            }
        };
        bds.clearReady = function () {
            i = false;
            d = []
        };
        A.__reset = f;
        var a = (function () {
                var j = document.getElementsByTagName("script");
                return function () {
                    var l = j[j.length - 1];
                    if (window.currentScriptElem) {
                        l = window.currentScriptElem
                    }
                    var k = l;
                    while (k) {
                        if (k.className) {
                            if (/(?:^|\s)result(?:-op)?(?:$|\s)/.test(k.className)) {
                                if (tplname = k.getAttribute("tpl")) {
                                    return k
                                }
                            }
                        }
                        k = k.parentNode
                    }
                }
            })(),
            g = function (j, m, l) {
                var n;
                if (!j.initIndex) {
                    n = {
                        container: j,
                        data: {},
                        handlers: []
                    };
                    j.initIndex = A.groupData.length + 1;
                    A.groupData.push(n)
                } else {
                    n = A.groupData[j.initIndex - 1]
                }
                if (typeof m == "function") {
                    n.handlers.push(m)
                } else {
                    if (typeof m == "object") {
                        for (var o in m) {
                            if (m.hasOwnProperty(o)) {
                                n.data[o] = m[o]
                            }
                        }
                    } else {
                        n.data[m] = l
                    }
                }
            };
        A.init = A.setup = function (m, l) {
            if (m === undefined || m === null) {
                return
            }
            var j = A._currentContainer || a();
            if (!j) {
                return
            }
            g(j, m, l)
        };
        A.merge = function (k, j) {
            A.mergeFns.push({
                tplName: k,
                fn: j
            })
        }
    })()
}

function ns_c_pj(a, d) {
    var b = encodeURIComponent(window.document.location.href),
        g = "",
        f = "",
        l = "",
        k = bds && bds.comm && bds.comm.did ? bds.comm.did : "";
    wd = bds.comm.queryEnc, nsclickDomain = bds && bds.util && bds.util.domain ? bds.util.domain.get("http://nsclick.baidu.com") : "http://nsclick.baidu.com", img = window["BD_PS_C" + (new Date()).getTime()] = new Image(), src = "";
    for (v in a) {
        switch (v) {
        case "title":
            f = encodeURIComponent(a[v].replace(/<[^<>]+>/g, ""));
            break;
        case "url":
            f = encodeURIComponent(a[v]);
            break;
        default:
            f = a[v]
        }
        g += v + "=" + f + "&"
    }
    l = "&mu=" + b;
    src = nsclickDomain + "/v.gif?pid=201&" + (d || "") + g + "path=" + b + "&wd=" + wd + "&rsv_sid=" + (bds.comm.ishome && bds.comm.indexSid ? bds.comm.indexSid : bds.comm.sid) + "&rsv_did=" + k + "&t=" + new Date().getTime();
    if (typeof Cookie != "undefined" && typeof Cookie.get != "undefined") {
        if (Cookie.get("H_PS_SKIN") && Cookie.get("H_PS_SKIN") != "0") {
            src += "&rsv_skin=1"
        }
    } else {
        var j = "";
        try {
            j = parseInt(document.cookie.match(new RegExp("(^| )H_PS_SKIN=([^;]*)(;|$)"))[2])
        } catch (i) {}
        if (j && j != "0") {
            src += "&rsv_skin=1"
        }
    }
    img.src = src;
    return true
}

function ns_c(b, a) {
    if (a === true) {
        return ns_c_pj(b, "pj=www&rsv_sample=1&")
    }
    return ns_c_pj(b, "pj=www&")
}
A.uiPrefix = "//www.baidu.com/cache/aladdin/ui/";
(function () {
    var b = window.bds.aladdin;
    var g = [];
    var l = {},
        i = 0;
    var d = function (q, p) {
        try {
            q.call(p)
        } catch (r) {}
    };
    var f = function (p) {
        p.ajaxId = ++i;
        l[p.ajaxId] = p
    };
    var n = function (p) {
        delete l[p.ajaxId]
    };
    var k = function (p) {
        if (!p.ajaxId) {
            return false
        }
        return l.hasOwnProperty(p.ajaxId)
    };
    var m = function (q) {
            var p = {};
            if (q) {
                try {
                    var s = new Function("return " + q)();
                    if (s) {
                        p = s
                    }
                } catch (t) {}
            }
            return p
        },
        a = function () {
            var r = $(".result-op").get().concat($(".result").get()),
                t = {};
            for (var q = 0, p, s; s = r[q]; q++) {
                if (p = s.getAttribute("tpl")) {
                    if (t[p]) {
                        t[p].push(s)
                    } else {
                        t[p] = [s]
                    }
                }
            }
            return t
        };
    var o = [],
        j = [];
    b.addDisposeHandler = function (p) {
        j.push(p)
    };
    b.dispose = function () {
        while (o.length) {
            var r = o.shift();
            d(r.fn, r.obj)
        }
        var p = j;
        for (var q = 0; q < p.length; q++) {
            var r = p[q];
            d(r.fn, r.obj)
        }
    };
    b.__clearDispose = function () {
        o = [];
        j = []
    };
    b.addDisposeHandler({
        obj: l,
        fn: function () {
            for (var p in l) {
                if (l.hasOwnProperty(p)) {
                    delete l[p]
                }
            }
        }
    });
    b._Aladdin = function () {
        this.p1 = 0;
        this.mu = null
    };
    $.extend(b._Aladdin.prototype, {
        _init: function () {
            var r = this,
                p;
            p = r.container;
            var q = m(r.container.getAttribute("data-click"));
            r.p1 = q.p1 || p.id;
            r.mu = q.mu || p.getAttribute("mu");
            r.srcid = q.rsv_srcid || p.getAttribute("srcid")
        },
        q: function (q, p) {
            p = p || "";
            return $(this.container).find(p + "." + q).get()
        },
        qq: function (q, p) {
            return this.q(q, p)[0]
        },
        find: function (p) {
            return window.jQuery(p, this.container)
        },
        ready: function () {
            $(document).ready.apply(this, arguments)
        },
        ajax: function (C, F, u) {
            var D = b.AJAX;
            var H = +new Date();
            var s = u.params || {};
            var w = {
                query: C,
                co: u.co || "",
                resource_id: F,
                t: H
            };
            $.extend(w, D.PARAMS);
            $.extend(w, s);
            var C = $.param(w);
            var r = D.API_URL + "?" + C;
            var B = function () {
                var p = new Image();
                p.src = $.format(D.ERR_URL, {
                    url: r
                });
                b.logs.push(p)
            };
            var z = new Date().getTime();
            var y = function (p) {
                var t = new Date().getTime() - z;
                var I = {
                    fm: "opendataajax",
                    srcid: F,
                    time: t,
                    status: p
                };
                ns_c(I)
            };
            var E = function (p) {
                if (!k(E)) {
                    return
                }
                q();
                if (p.status == 0) {
                    u.success(p.data)
                } else {
                    u.error && u.error(p.status);
                    B()
                }
                y(0)
            };
            var x = function () {
                if (!k(x)) {
                    return
                }
                q();
                u.timeout && u.timeout();
                B();
                y(1)
            };
            var q = function () {
                n(E);
                n(x)
            };
            f(E);
            f(x);
            $.ajax({
                url: r,
                scriptCharset: D.PARAMS.oe,
                timeout: D.TIMEOUT,
                dataType: "jsonp",
                jsonp: "cb",
                success: E,
                error: x
            })
        }
    });
    b.AJAX = {
        API_URL: bds.util.domain && bds.util.domain.get ? bds.util.domain.get("http://opendata.baidu.com/api.php") : "http://opendata.baidu.com/api.php",
        ERR_URL: bds.util.domain && bds.util.domain.get ? bds.util.domain.get("http://open.baidu.com/stat/al_e.gif?ajax_err_url=#{url}") : "http://open.baidu.com/stat/al_e.gif?ajax_err_url=#{url}",
        PARAMS: {
            ie: "utf8",
            oe: "gbk",
            cb: "op_aladdin_callback",
            format: "json",
            tn: "baidu"
        },
        TIMEOUT: 6000
    };
    g.push(function (p) {
        var q = /msie (\d+\.\d+)/i.test(navigator.userAgent) ? (document.documentMode || +RegExp["\x241"]) : undefined;
        if (q) {
            var r = document.charset;
            $.each(p.container.getElementsByTagName("form"), function (t, u) {
                var w = function () {
                    var x = u.acceptCharset;
                    if (x && x.toString().toUpperCase() != "UNKNOWN" && x != document.charset) {
                        document.charset = x;
                        setTimeout(function () {
                            document.charset = r
                        }, 1000)
                    }
                };
                $(u).on("submit", w);
                var s = u.submit;
                u.submit = function () {
                    w();
                    try {
                        s.call(u)
                    } catch (x) {
                        s()
                    }
                }
            })
        }
    });
    b.__runAla = function () {
        var p = a();
        $.each(b.mergeFns, function (s, q) {
            var r = p[q.tplName];
            if (r) {
                $.each(r, function (t, u) {
                    b._currentContainer = u;
                    q.fn();
                    b._currentContainer = null
                })
            }
        });
        $.each(b.groupData, function (t, s) {
            var w = new b._Aladdin(),
                r, u, x;
            w.container = s.container;
            w.data = s.data;
            w._init();
            b.list.push(w);
            var q = s.handlers;
            r = new Date();
            while (q.length) {
                d(q.shift(), w)
            }
            if (typeof w.dispose == "function") {
                o.push({
                    obj: w,
                    fn: w.dispose
                });
                w.dispose = null
            }
            u = new Date(), x = {
                srcid: w.srcid
            };
            x.tpl = w.container.getAttribute("tpl");
            x.time = u - r;
            b.loadTimes.push(x);
            $.each(g, function (y, z) {
                z.call(w, w)
            })
        })
    }
})();
(function () {
    var g = window.A,
        b = {},
        j = {},
        s = {},
        p = document,
        n = p.getElementsByTagName("head")[0],
        i = false,
        f = ["baidu"],
        q = false,
        d = g.baidu,
        m = function () {};
    var l = {
        "*": function (t, u) {
            return u + "?v=2014010100"
        },
        scrollbarv: function (t, u) {
            return u + "?v=20150226"
        },
        likeshare4: function (t, u) {
            return u + "?v=20140116"
        },
        mboxsingleton: function (t, u) {
            return u + "?v=20141008"
        },
        sms: function (t, u) {
            return u + "?v=20140508"
        },
        tab: function (t, u) {
            return u + "?v=20140117"
        },
        tabs: function (t, u) {
            return u + "?v=20140116"
        },
        musicplayer: function (t, u) {
            return u + "?v=20150310"
        },
        slider: function (t, u) {
            return u + "?v=20140123"
        },
        suggestion: function (t, u) {
            return u + "?v=20140924"
        },
        tabs5: function (t, u) {
            return u + "?v=20150429"
        },
        tabx: function (t, u) {
            return u + "?v=20140117"
        },
        dropdown1: function (t, u) {
            return u + "?v=20140117"
        },
        dropdown21: function (t, u) {
            return u + "?v=20140227"
        },
        advert: function (t, u) {
            return u + "?v=20140523"
        },
        advert2: function (t, u) {
            return u + "?v=20141127"
        },
        honourCard: function (t, u) {
            return u + "?v=20140926"
        },
        honourCard3: function (t, u) {
            return u + "?v=20160415"
        },
        honourCard4: function (t, u) {
            return u + "?v=20160901"
        },
        share: function (t, u) {
            return u + "?v=20141107"
        },
        qHotCity: function (t, u) {
            return u + "?v=20150326"
        },
        mapapi: function (t, u) {
            return u + "?v=20150310"
        },
        qunarfilters: function (t, u) {
            return u + "?v=20141114"
        },
        renderIframe3: function (t, u) {
            return u + "?v=20150310"
        },
        share2: function (t, u) {
            return u + "?v=20150212"
        },
        ALD_feedback: function (t, u) {
            return u + "?v=20150113"
        },
        addtohome: function (t, u) {
            return u + "?v=20150310"
        },
        addtohome2: function (t, u) {
            return u + "?v=20150310"
        },
        gpsApi: function (t, u) {
            return u + "?v=20150310"
        },
        simGps: function (t, u) {
            return u + "?v=20150310"
        }
    };
    $(document).ready(function () {
        i = true
    });
    g.addDisposeHandler({
        obj: g,
        fn: function () {
            for (var t in s) {
                if (s.hasOwnProperty(t)) {
                    var u = s[t];
                    while (u.length) {
                        u.pop()
                    }
                }
            }
        }
    });

    function a(u, z) {
        var x = typeof u === "string" ? u.split(/\s*,\s*/) : u;
        if (x.length > 1) {
            if (z) {
                a(x.shift(), function () {
                    if (x.length > 0) {
                        a(x, z)
                    }
                })
            } else {
                while (x.length) {
                    a(x.shift())
                }
            }
            return
        }
        u = x[0];
        if (u === "jquery" && window.jQuery) {
            !g.ui.jquery && (g.ui.jquery = window.jQuery);
            z && z();
            return
        }
        var y = u.replace(/\./g, "/");
        var t = u.replace(/^[\s\S]*\./, "");
        var w = g.uiPrefix + y + "/" + t;
        if (y.search("style/") == 0) {
            o(w + ".css", z)
        } else {
            w += ".js";
            if (l.hasOwnProperty(u)) {
                if (typeof l[u] == "function") {
                    w = l[u](u, w)
                } else {
                    if (typeof l[u] == "string") {
                        w = l[u]
                    }
                }
            } else {
                if (l.hasOwnProperty("*")) {
                    w = l["*"](u, w)
                }
            }
            if (z) {
                r(w, z)
            } else {
                k(w)
            }
        }
    }
    a.cache = b;

    function o(u, w) {
        w = w || m;
        if (u in b) {
            w();
            return
        }
        var t = p.createElement("link");
        t.rel = "stylesheet";
        t.type = "text/css";
        t.href = u;
        t.setAttribute("data-for", "A.ui");
        n.appendChild(t);
        b[u] = 1;
        w()
    }

    function k(t) {
        if (i) {
            r(t, m);
            return
        }
        if (t in b) {
            return
        }
        p.write('<script charset="gb2312" type="text/javascript" src="' + t + '"><\/script>');
        b[t] = 1
    }

    function r(w, x) {
        x = x || m;
        if (w in b) {
            x();
            return
        }
        if (w in j) {
            s[w].push(x);
            return
        }
        j[w] = 1;
        var u = s[w] = [x];
        var t = p.createElement("script");
        t.type = "text/javascript";
        t.charset = "gb2312";
        t.onload = t.onreadystatechange = function () {
            if ((!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
                while (u.length) {
                    u.shift()()
                }
                delete j[w];
                b[w] = 1;
                t.onload = t.onreadystatechange = null
            }
        };
        t.src = w;
        t.setAttribute("data-for", "A.ui");
        n.insertBefore(t, n.firstChild)
    }
    g.uicss = function (t) {
        o(g.uiPrefix + t)
    };
    g.uijs = function (t, u) {
        r(g.uiPrefix + t, u)
    };
    g.uijsPathMap = function (t) {
        $.extend(l, t)
    };
    g.use = a;
    g.ui = g.ui || {};
    g.addCssText = function (x) {
        var B = "opui-style-tag-id",
            u = "data-for",
            t = "A.ui",
            w = document.getElementById(B);
        if (!w) {
            w = document.createElement("style");
            w.setAttribute("type", "text/css");
            w.setAttribute(u, t);
            w.id = B;
            document.getElementsByTagName("head")[0].appendChild(w)
        }
        try {
            var y = document.createTextNode(x);
            w.appendChild(y)
        } catch (z) {
            if (w.styleSheet) {
                w.styleSheet.cssText += x
            }
        }
    };
    $(window).on("swap_end", function () {
        var u = /MSIE\s?6/.test(window.navigator.userAgent);
        var t = function (w, y, x) {
            $(w).each(function (C, B) {
                var D = $(B),
                    z = new Image(),
                    E = D.attr("src");
                z.onload = function () {
                    var K = y,
                        H = x,
                        J = this.width,
                        F = this.height,
                        I = (J / F) / (K / H);
                    if (I > 1) {
                        if (J > K) {
                            J = K
                        } else {
                            J = "auto"
                        }
                        F = "auto"
                    } else {
                        if (F > H) {
                            F = H
                        } else {
                            F = "auto"
                        }
                        J = "auto"
                    }
                    D.css({
                        height: F,
                        width: J
                    });
                    z.onload = null;
                    z = null
                };
                z.src = E
            })
        };
        if (u) {
            t("img.result-left-img", 98, 121)
        }
        $(".c-feedback").bind("click", function () {
            var w = this;
            g.use("ALD_feedback", function () {
                var D = "right",
                    x, z, C = $(w);
                if (C.parents("#content_left").length) {
                    D = "left";
                    z = C.parents(".result-op"), x = z.attr("srcid")
                } else {
                    if (C.parents("#content_right").length) {
                        z = C.parents("#con-ar")
                    }
                }
                var y = {
                    query: bds.comm.query,
                    srcid: x,
                    target: z,
                    username: bds.comm.username,
                    flag: D
                };
                var B = g.ui.ALD_feedback(y);
                g.addDisposeHandler({
                    obj: B,
                    fn: B.dispose
                })
            })
        })
    })
})();
$(window).on("swap_begin", function () {
    A.dispose();
    A.__reset();
    A.__clearDispose()
});
$(window).on("swap_dom_ready", function () {
    bds.ready(A.__runAla);
    bds.doReady()
});
bds.event = new function () {
    var i = {};

    function d(j, l) {
        if (typeof l == "function" || l instanceof Function) {
            var k = a(j);
            i[k.name] = i[k.name] || [];
            i[k.name].push({
                prod: k.prod,
                callback: l
            })
        }
    }

    function g(l, o) {
        var n = a(l),
            k = i[n.name] || [],
            j = 0;
        while (j < k.length) {
            var m = k[j];
            if (o === m.callback && f(n.prod, m.prod)) {
                k.splice(j, 1)
            } else {
                j++
            }
        }
    }

    function b(j, m) {
        var q = a(j),
            k = i[q.name] || [],
            r = {
                data: m,
                eventId: j
            };
        for (var n = 0, o = k.length; n < o; n++) {
            var l = k[n];
            try {
                if (f(l.prod, q.prod)) {
                    l.callback.call(this, r)
                }
            } catch (p) {}
        }
    }

    function f(j, k) {
        return new RegExp("^" + j.replace(/\./g, "\\.").replace(/\*/g, ".+") + "$").test(k)
    }

    function a(j) {
        var k = j.match(/(.+)\.(.+)/);
        if (k && k[2]) {
            return {
                prod: k[1],
                name: k[2]
            }
        } else {
            return {}
        }
    }
    this.on = d;
    this.off = g;
    this.trigger = b;
    this.events = i
};

function escapeHTML(a) {
    return a.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/ /g, "&nbsp;").replace(/"/g, "&#34;").replace(/'/g, "&#39;")
}

function initPreload(bg) {
    document.write = document.writeln = function () {};

    function K() {
        Cookie.set("ISSW", "1", null, null, new Date(new Date().getTime() + 300 * 1000))
    }
    if (bds && bds.comm && bds.comm.query == "clearissw") {
        Cookie.clear("ISSW")
    }(function () {
        var bu = $.Deferred();
        bds.comm.registerUnloadHandler = function (bv) {
            bu.done(bv)
        };
        bds.comm.resolveUnloadHandler = function () {
            bu.resolve();
            bu = $.Deferred()
        }
    })();

    function bb(bu) {
        if (bu && typeof bu == "string") {
            bu = $.parseJSON(bu)
        }
        if (bu && bu.length) {
            $.each(bu, function (bw, bx) {
                if (bx.indexOf(bj.protocol) === 0) {
                    var bv = new Image();
                    bv.src = bx
                }
            })
        }
    }

    function a7(bu) {
        return $.trim(bu).replace(/\s+/g, " ")
    }

    function aC(bw) {
        if (typeof bw == "string") {
            var bu, bv = 0;
            for (bu = 0; bu < bw.length; bu++) {
                bv += bw.charCodeAt(bu)
            }
            return bv
        }
        return 0
    }

    function br(bz) {
        var bu = {};
        var by, bv, bB, bw;
        if (bz.indexOf("?") > -1) {
            bB = bz.split("?");
            bw = bB[1]
        } else {
            bw = bz
        }
        if (bw.indexOf("&") > -1) {
            by = bw.split("&")
        } else {
            by = new Array(bw)
        }
        for (var bx = 0; bx < by.length; bx++) {
            try {
                by[bx] = by[bx].indexOf("=") > -1 ? by[bx] : by[bx] + "=";
                bv = by[bx].split("=");
                bu[bv[0]] = decodeURIComponent(bv[1].replace(/\+/g, " "))
            } catch (bA) {}
        }
        return bu
    }
    window.b_rec = function (bw) {
        var bu;
        if (bw) {
            bu = navigator.userAgent
        } else {
            try {
                bu = (window.external && window.external.twGetRunPath) ? window.external.twGetRunPath() : ""
            } catch (bv) {
                bu = ""
            }
        }
        bu = bu.replace(/:/, "~").replace(/\t/, "`");
        return bu
    };
    window.scr_rec = function () {
        var bu = "";
        try {
            bu += [document.body.clientWidth, document.body.clientHeight, window.screenTop, window.screenLeft, window.screen.height, window.screen.width].join("_")
        } catch (bv) {}
        return bu
    };
    window.reh_rec = function () {
        var bw = [],
            bu = [];
        try {
            $("#content_left").children(".result,.result-op").each(function (bx, by) {
                bw.push($(by).height())
            })
        } catch (bv) {}
        try {
            $("#con-ar").children(".result,.result-op").each(function (bx, by) {
                bu.push($(by).height())
            })
        } catch (bv) {}
        return bw.join("_") + "|" + bu.join("_")
    };
    window.onerror = function () {
        if (window.console && console.debug) {
            console.debug(arguments)
        }
        bds.comm.jserror = Array.prototype.slice.call(arguments).join("\t");
        aG(bds.comm.jserror)
    };
    window.hash = function (bv, bu) {
        if (!bv) {
            return
        }
        if (bv && !bu && ad) {
            return ad.p(bv)
        }
        if (bv && bu && ad) {
            ad.p(bv, bu);
            bj.href = ad.buildSearchUrl()
        }
    };
    var ar, aL, ae, a1, p, bt = false;
    var bp;

    function u(bu) {
        function bv(bC, bA) {
            if (document.all) {
                $("style[data-for='result']").get(0).styleSheet.cssText += bC
            } else {
                var bB = document.createElement("style");
                bB.type = "text/css";
                bB.appendChild(document.createTextNode(bC));
                bB.setAttribute("data-for", "result");
                document.getElementsByTagName("HEAD")[0].appendChild(bB)
            }
        }
        if (!bt) {
            var bu = $.extend({
                top: 93,
                "z-index": 300
            }, bu);
            var bz = $(window).height();
            if (!ar) {
                ar = $("<div id='_mask'/>")
            }
            ar.css({
                filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=30)",
                opacity: 0.3,
                position: "absolute",
                background: "#fff",
                "z-index": bu["z-index"],
                top: bu.top + "px",
                left: "0"
            });
            bt = true;
            ar.width(B.width());
            ar.height(Math.max(bz, B.height()) - bu.top);
            ar.appendTo(B);
            var bw = $(window).scrollTop();

            function by() {
                ar.css({
                    filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=95)",
                    opacity: 0.95
                });
                if (!aL) {
                    bv(".slowmsg{z-index:301;background-color:#fff;border:1px solid #f0f0f0;position:fixed;_position:absolute;top:144px;left:212px;height:95px;width:360px;box-shadow:0 0 5px rgba(0,0,0,0.05)}.slowmsg .ball{width:40px;margin:41px auto 0;position:relative;}.slowmsg .b{left:20px;position:absolute;width:10px;height:10px;-moz-border-radius: 50%;-webkit-border-radius: 50%;border-radius: 50%;}");
                    aL = $('<div class="slowmsg"><div class="ball"><div class="b"/><div class="b"/><div class="b"/></div></div>');
                    aL.find(".b").each(function (bD, bF) {
                        var bA = [[0, 40], [20, 20], [40, 0]][bD];
                        var bC = ["rgb(55,137,250)", "rgb(99,99,99)", "rgb(235,67,70)"];
                        var bE = 0;
                        $(bF).css({
                            "background-color": bC[bD]
                        });
                        (function bB() {
                            if (!ae) {
                                setTimeout(bB, 400);
                                return
                            }
                            $(bF).animate({
                                left: bA[bE % 2]
                            }, {
                                duration: 800,
                                easing: "swing",
                                progress: function (bH, bG) {
                                    if (bG >= 0.5) {
                                        $(bF).css({
                                            "background-color": bC[(bE + bD) % 3]
                                        })
                                    }
                                },
                                complete: function () {
                                    bB()
                                }
                            });
                            bE++
                        })()
                    })
                }
                aL.appendTo(B);
                ns_c({
                    pj_name: "loading_msg"
                })
            }

            function bx() {
                var bA, bB = new Date().getTime();
                Cookie.set("rsv_jmp_slow", bB);
                Cookie.set("WWW_ST", bB, null, null, new Date(bB + 30000));
                bA = bj.href + (bj.href.indexOf("?") > 0 ? "&" : "?") + "rsv_jmp=slow";
                bj.replace(bA)
            }
            ae = setTimeout(by, 3000);
            p = setTimeout(bx, 7000);
            bp = function () {
                if (ae) {
                    clearTimeout(ae);
                    ae = setTimeout(by, 3000)
                }
                if (p) {
                    clearTimeout(p);
                    p = setTimeout(bx, 7000)
                }
            }
        }
    }

    function aV() {
        if (ar && bt) {
            bt = false;
            ar.remove();
            if (aL) {
                aL.remove()
            }
            if (ae) {
                clearTimeout(ae);
                ae = false
            }
            if (a1) {
                a1.remove()
            }
            if (p) {
                clearTimeout(p);
                p = false
            }
        }
    }

    function q(bu, bx, bv) {
        bv || (bv = 0);
        var bw = bu.length;
        if (bv < 0) {
            bv = bw + bv
        }
        for (; bv < bw; bv++) {
            if (bu[bv] === bx) {
                return bv
            }
        }
        return -1
    }(function () {
        var bu = $.globalEval;
        $.globalEval = function (bv) {
            var bx = new Date().getTime();
            try {
                bu.apply($, arguments)
            } catch (bw) {}
            if (new Date().getTime() - bx > 500) {}
        }
    })();
    if (bds.comm.isDebug) {
        $('<style data-for="debug">#debug{display:none!important;}</style>').appendTo("head");
        $('<div id="debug" style="display:block;position:absolute;top:30px;right:30px;border:1px solid;padding:5px 10px;z-index:10000"></div>').appendTo("#wrapper");
        $(window).on("swap_end", function (by, bv) {
            if (bv) {
                var bu = $("#isDebugInfo");
                if (!bu.size()) {
                    bu = $('<div id="isDebugInfo"></div>').appendTo("#debug")
                }
                bu.html(bv.html.find("#__isDebugInfo").html());
                var bx = "<table>";
                for (var bw in bv.log) {
                    if (bv.log.hasOwnProperty(bw)) {
                        bx += "<tr><td>" + bw + "</td><td>" + encodeURIComponent(bv.log[bw]) + "</td></tr>"
                    }
                }
                bx += "</table>";
                $("#debug").html(bx)
            }
        })
    }

    function N(by, bx, bz) {
        var bw = bx.find("script:not([src])"),
            bv = 0;
        var bu = $.globalEval;
        $.globalEval = function (bA) {
            window.currentScriptElem = bw[bv];
            bv++;
            try {
                bu.apply($, arguments)
            } catch (bB) {
                if (window.console && console.debug) {
                    console.debug(bA);
                    console.debug(bB)
                }
            }
        };
        if (bz == "insertBefore") {
            bx.insertBefore(by)
        } else {
            by.append(bx)
        }
        window.currentScriptElem = undefined;
        $.globalEval = bu
    }

    function bm(bu) {
        try {
            bu()
        } catch (bv) {
            if (window.console && console.debug) {
                console.debug(bv)
            }
            aG(bv.toString())
        }
    }
    var aG = (function () {
        var bu;
        return function (bv) {
            if (bds.comm.isDebug) {
                alert(bv)
            }
            if (bds && bds.comm && bds.comm.js_error_monitor) {
                bu = new Image();
                bu.src = bds.comm.js_error_monitor + "?" + $.param({
                    url: bj.href,
                    time: bds.comm.serverTime,
                    explore: navigator.userAgent,
                    info: bv,
                    info_type: 1
                })
            }
        }
    })();
    window.setSugKey = function (bu) {
        if (a && bu) {
            if (o && o.setKey) {
                o.setKey(bu)
            } else {
                a.val(bu)
            }
        }
    };
    window.getCursortPosition = function (bw) {
        var bv = 0;
        try {
            if (document.selection) {
                var bu = document.selection.createRange();
                bu.moveStart("character", -bw.value.length);
                bv = bu.text.length
            } else {
                if (bw.selectionStart || bw.selectionStart == "0") {
                    bv = bw.selectionStart
                }
            }
        } catch (bx) {
            bv = bw.value.length
        }
        return (bv)
    };
    if (bds.comm.flagTranslateResult) {
        $("#wrapper_wrapper").delegate(".result", "mouseenter", function () {
            $(".c-fanyi", $(this)).show()
        });
        $("#wrapper_wrapper").delegate(".result", "mouseleave", function () {
            $(".c-fanyi", $(this)).hide()
        });
        $("#wrapper_wrapper").delegate(".result .c-fanyi", "click", function () {
            var by = $(this).closest(".result"),
                bv = $("h3 a:first", by),
                bw = $(".c-abstract:first", by),
                bu = $(".c-fanyi-abstract", by).val(0).html(),
                bx = $(".c-fanyi-title", by).val(0).html();
            $(".c-fanyi-abstract", by).val(0).html(bw.html());
            $(".c-fanyi-title", by).val(0).html(bv.html());
            bv.html(bx);
            bw.html(bu)
        })
    }
    var at = {
        use_cache_repeatedly: true,
        index_form: "#form",
        kw: "#kw",
        result_form: "#form"
    };
    if (bg) {
        $.extend(at, bg)
    }
    var a6 = 15;
    var bq = 60000;
    var a0 = window.__confirm_timeout ? window.__confirm_timeout : 10000;
    var f = !bds.comm.supportis ? 10 : 4;
    var n = (function () {
        var bu = [];

        function bv(bw) {
            if (typeof bw != "object" || bw == null) {
                return
            }
            if (bw.xhr && bw.xhr.abort) {
                bw.xhr.abort()
            }
            if (bw.base64) {
                bw.base64.destroy()
            }
            if (bw.pdc) {
                bw.pdc.destroy()
            }
            if (bw.backspace_preload_timeout_id) {
                clearTimeout(bw.backspace_preload_timeout_id)
            }
            delete bw.xhr;
            delete bw.html
        }
        return {
            find: function (bw) {
                return $.grep(bu, bw)
            },
            getCacheList: function () {
                var bw = $.map(bu, function (bx) {
                    if (bx && (new Date().getTime() - bx.startTime > bq)) {
                        return false
                    } else {
                        return bx.querySign
                    }
                });
                bw = $.grep(bw, function (bx) {
                    return !!bx
                });
                return bw.join("\t")
            },
            hasCache: function (by, bx) {
                if (!bx) {
                    bx = {}
                }
                var bw = bz(by);
                if (bw && (new Date().getTime() - bw.startTime > bq)) {
                    this.deleteCache(bw);
                    bw = null
                }
                return bw;

                function bz(bA) {
                    var bB, bC;
                    bC = bA.p("wd");
                    if (!bC) {
                        return false
                    }
                    $.grep(bu, function (bD) {
                        if (bx.loaded && !bD.loaded) {
                            return false
                        }
                        if (bD.real_wd ? (bA.equals(bD.env.clone({
                                wd: bD.real_wd
                            }))) : (bA.equals(bD.env))) {
                            bB = bD
                        }
                    });
                    if (bB) {
                        return bB
                    }
                    return null
                }
            },
            shouldShow: function (bw) {
                if (bw.force) {
                    return true
                }
                if (!bw.shouldShow && !bw.force && bw.no_predict) {
                    return false
                }
                var bx = a7(a.val());
                if (!bx || (aA && bw.env.equals(aA.env))) {
                    return false
                }
                if (bw.env.p("wd").indexOf(bx) == 0) {
                    return true
                }
                if (bw.real_wd.indexOf(bx) == 0) {
                    return true
                }
                return false
            },
            getCacheBySign: function (bx) {
                var bw = false;
                $.each(bu, function (bz, by) {
                    if (!bw && by.loaded && by.querySign == bx && (!by.env.p("pn") || by.env.p("pn") == 0)) {
                        bw = by
                    }
                });
                return bw
            },
            addCache: function (bw) {
                if (q(bu, bw) != -1) {
                    return
                }
                if (bw.env.p("srcid") || bw.env.p("cq")) {
                    return
                }
                bu.unshift(bw);
                while (bu.length > a6) {
                    bv(bu.pop())
                }
            },
            deleteCache: function (bw) {
                bv(bw);
                bu = $.grep(bu, function (bx) {
                    return bx !== bw
                })
            },
            deleteCacheByEnv: function (bw) {
                bu = $.grep(bu, function (by) {
                    var bx = by.env.equals(by.env);
                    if (bx) {
                        bv(by)
                    }
                    return !bx
                })
            },
            clearCache: function () {
                bu = $.grep(bu, function (bx, bw) {
                    if (bw !== aA) {
                        bv(bw);
                        return false
                    } else {
                        return true
                    }
                });
                bu = []
            }
        }
    })();
    var bj = document.location;
    var am = bj.protocol + "//" + bj.host + bj.pathname + bj.search;
    var aw = {
        onurlchange: function () {}
    };
    (function () {
        var by = "onhashchange" in window;
        var bv = "onpopstate" in window;
        if (window.__disable_popstate) {
            bv = false
        }
        var bA = bj.pathname.length > 1 ? bj.pathname : "/s";
        if (navigator.userAgent.match(/MSIE (6|7)/) || document.documentMode < 8) {
            by = false;
            bv = false
        }
        if (at.disable_popstate) {
            bv = false
        }
        if (!by && !bv) {
            K()
        }

        function bx() {
            var bE = bj.href.match(/#+(.*)$/);
            return bE ? bE[1].replace(/\+/g, "%2B") : ""
        }
        var bu = (function () {
            var bF = "",
                bE;
            return function (bH, bG) {
                if (bG) {
                    bF = bG.buildQueryString();
                    bj.hash = bF
                }
                if (bH || bF != bx()) {
                    bz(bH);
                    bF = bx()
                }
            }
        })();
        aw.setUrl = function (bE) {
            if (bv) {
                bw(false, bE)
            } else {
                if (by) {
                    bu(false, bE)
                }
            }
        };

        function bB() {
            var bE = bj.href.match(/\?([^#]+)/);
            return bE ? bE[1].replace(/\?/g, "&") : ""
        }

        function bD(bH, bE) {
            var bG = "";
            if (window._thirdLinkSpeed === "1") {
                bG = "&qid=" + bds.comm.queryId
            }
            if (window._bdlksmp > 0) {
                bG = "&bdlksmp=" + window._bdlksmp
            }
            if (window._eclipse === "1" && /^\/link\?/.test(bE)) {
                return "wd=&eqid=" + bds.comm.eqid + bC(["pn", "rn", "ie"], bH) + bG
            }
            var bF = new W(br(bH));
            if (bF.p("wd")) {
                return bF.buildQueryString().replace(/&rsv[^=]*=[^&]*/g, "").replace(/[^a-zA-Z0-9]url=/g, "") + bG
            }
        }

        function bC(bG, bI) {
            var bH = "",
                bF = br(bI);
            for (var bE in bG) {
                if (bF.hasOwnProperty(bE)) {
                    bH += "&" + encodeURIComponent(bF[bE])
                }
            }
            return bH
        }

        function bz(bE) {
            var bF = new W(br(aw.getQueryString()), true);
            if (!bF.hashCode()) {
                if (pageState != 0) {
                    bj.replace(bj.pathname + bj.search.replace(/([?&])isidx=[^&*]&?/, "$1"))
                } else {
                    if (bj.search != bj.search.replace(/([?&])isidx=[^&*]&?/, "$1")) {
                        bj.replace(bj.pathname + bj.search.replace(/([?&])isidx=[^&*]&?/, "$1"))
                    }
                }
            } else {
                if (pageState == 0) {
                    az(bF)
                }
            }
            aw.onurlchange(bF, bE)
        }
        var bw = (function () {
            var bE = bB(),
                bF;
            return function (bH, bG) {
                if (bG) {
                    bE = bG.buildQueryString();
                    window.history.pushState(bG, "", bG.buildSyncSearchUrl())
                }
                if (bH || bE != bB()) {
                    bz(bH);
                    bE = bB()
                } else {
                    aV()
                }
            }
        })();
        aw.getQueryString = function () {
            if (bv) {
                return bB()
            } else {
                if (/wd=/.test(bx())) {
                    return bx()
                } else {
                    return bB()
                }
            }
        };
        aw.init = function () {
            if (bv) {
                (function () {
                    var bF = bj.href;
                    var bG = false;
                    $(window).on("swap_begin", function () {
                        bG = true
                    });
                    $(window).bind("popstate", function () {
                        if (bG || !bF || bF != bj.href) {
                            bw()
                        }
                        bF = null
                    });
                    $(window).bind("hashchange", function () {
                        var bH = bx();
                        if (/wd=/.test(bH)) {
                            bj.replace(bA + "?" + bH)
                        }
                    })
                })()
            } else {
                if (by) {
                    $(window).bind("hashchange", function () {
                        bu()
                    });
                    $(function () {
                        bu()
                    })
                }
            }
            var bE = bx();
            if (/wd=/.test(bE)) {
                if (bv) {
                    window.history.replaceState(null, "", bA + "?" + bE);
                    bw()
                } else {
                    if (by) {
                        bu()
                    } else {
                        bj.replace(bA + "?" + bE)
                    }
                }
            }
        };
        aw.support = function () {
            return (bv || by) && Cookie.get("ISSW") != 1 && !window.__disable_preload
        };
        aw.getLinkParams = function (bF) {
            if (!bv) {
                var bE = bx();
                if (bE == "") {
                    bE = bB()
                }
                return bD(bE, bF)
            }
            if (bj.protocol === "https:" || window._eclipse === "1") {
                var bG = bB();
                if (!bG) {
                    bG = bx()
                }
                return bD(bG, bF)
            }
            return false
        };
        aw.clickResultLink = function (bE, bG, bF) {
            if (bv) {
                window.history.pushState(null, "", new W(bF, true).buildSyncSearchUrl());
                bw();
                return false
            } else {
                bE.attr("href", bG.buildSearchUrl(bF)).attr("target", "_self")
            }
        };
        aw.submit = function (bF, bE) {
            setTimeout(function () {
                if (bv) {
                    window.history.pushState(bF, "", bF.buildSyncSearchUrl());
                    bw(bE)
                } else {
                    if (by) {
                        bj.href = bF.buildSearchUrl();
                        bu(bE)
                    } else {
                        bj.href = bF.buildSyncSearchUrl()
                    }
                }
            }, 0)
        };
        window.changeUrl = function (bF) {
            var bE = new W(br(bF));
            aw.submit(bE, true)
        }
    })();
    aw.onurlchange = function (bw, bv) {
        Y.done(function () {
            a3.setKey(bw.p("wd"));
            a3.hide()
        });
        aZ = new Date().getTime();
        a.val(bw.p("wd"));
        a4("");
        var bu = true;
        if (bv && aA && aA.env && aA.env.equals(bw)) {
            bu = false
        }
        w({
            env: bw,
            force: true,
            use_cache: bu,
            no_predict: true
        })
    };
    var ay = at.disable ? at.disable : false;
    if (window.__disable_preload) {
        ay = true
    }
    var T = ay;
    var F = false;
    if (window.__disable_predict) {
        F = true
    }
    var bi = F;
    var m = 200;
    var a9 = 250;
    var aP = 2000;
    var aW = 100;
    var aI = 800;
    var aU = bds.comm.switchAddMask ? bds.comm.switchAddMask : false;
    if (!aU) {
        aU = window.__switch_add_mask ? window.__switch_add_mask : false
    }
    aU = true;
    var k = bds.comm.preloadMouseMoveDistance ? bds.comm.preloadMouseMoveDistance : 5;
    var d = 300,
        b = 50,
        z = 80;
    var E = 0,
        aB = 0;
    var aM = function () {};
    var av = br(bj.search);
    if (!aw.support()) {
        ! function () {
            function bu() {
                bj.hash && bj.hash.match(/[^a-zA-Z0-9](wd|word)=/) && bj.replace("//www.baidu.com/s?" + bj.href.match(/#(.*)$/)[1])
            }
            bj.hash.match(/[^a-zA-Z0-9](wd|word)=/) ? (bj.replace("//www.baidu.com/s?" + bj.href.match(/#(.*)$/)[1]), (function () {
                throw new Error("redirect to sync")
            })()) : (document.getElementById("wrapper").style.display = "block", "onhashchange" in window ? window.onhashchange = bu : setInterval(bu, 200))
        }();
        T = ay = true
    }
    var M = Cookie.get("BAIDUID", "nobdid").split(":")[0];
    var aH = M.substr(0, 6) + M.substr(M.length - 5, 5) + parseInt(Math.random() * 99999);
    while (aH.length < 16) {
        aH += "0"
    }
    aH = encodeURIComponent(aH);
    var ax, bn, bk, g, a, ac, be;
    bk = g = a = $(at.kw);
    var aZ;
    var aa, ap, V, a2, ab, aN;
    var ak = $("#wrapper_wrapper");
    var bd = [];
    var Q = window.__async_strategy;
    ax = $(at.index_form);
    if (ax.attr("target") == "_blank") {
        window.__disable_index_predict = true;
        T = ay = true
    }
    var bh = ax.serializeArray();
    bn = $(at.result_form);
    var a5 = new Date().getTime();

    function W(by, bB) {
        if (!W.__init) {
            W.__init = true;
            var bA = ["wd", "pn", "nojc", "cl", "cq", "srcid", "gpc", "tfflag", "si", "sl_lang", "rsv_srlang", "rqlang"];
            var bw = ["wd", "cl", "ct", "tn", "rn", "ie", "f", "lm", "si", "gpc", "tfflag", "usm", "z", "ch", "sts", "vit", "dsp", "trh", "trb", "tre", "la", "lo", "st", "nojc", "haobd", "rtt", "bsst", "gvideo", "__eis", "__eist", "oq", "fenlei", "sid", "rsv_idx", "rsv_stat", "rsv_bp", "rqlang"];
            var bx = ["w", "word"];
            W.prototype.clone = function (bD) {
                var bE = new W(bz(this.params));
                if (typeof bD == "object") {
                    for (var bC in bD) {
                        if (bD.hasOwnProperty(bC) && q(bw, bC) >= 0) {
                            bE.p(bC, bD[bC])
                        }
                    }
                }
                return bE
            };
            W.prototype.h = function (bD) {
                this.header_params = this.header_params || {};
                for (var bC in bD) {
                    this.header_params[bC] = bD[bC]
                }
                return this
            };
            W.prototype.buildHeaders = function (bE) {
                if (bE) {
                    this.setHeader(bE)
                }
                var bH = {};
                for (var bD in this.header_params) {
                    if (typeof this.header_params[bD] == "object") {
                        var bG = [];
                        for (var bF in this.header_params[bD]) {
                            var bC = this.header_params[bD][bF];
                            if (bC instanceof Array) {
                                bC = bC.join("|")
                            }
                            bG.push(bF + "=" + bC)
                        }
                        bH[bD] = bG.join("&")
                    } else {
                        bH[bD] = this.header_params[bD]
                    }
                }
                return bH
            };
            W.prototype.buildSearchUrl = function (bC) {
                return bj.protocol + "//" + bj.host + bj.pathname + bj.search + "#" + this.buildQueryString(bC)
            };
            W.prototype.buildSyncSearchUrl = function (bC) {
                return bj.protocol + "//" + bj.host + "/s?" + this.buildQueryString(bC)
            };
            W.prototype.buildQueryString = function (bE) {
                var bD = bz(this.params);
                if (typeof bE == "object") {
                    for (var bC in bE) {
                        if (bE.hasOwnProperty(bC)) {
                            bD[bC] = bE[bC]
                        }
                    }
                }
                var bF = "";
                bD.wd = $.limitWd(bD.wd);
                for (param in bD) {
                    if (param && bD.hasOwnProperty(param) && bD[param] !== "") {
                        bF += param + "=" + encodeURIComponent(bD[param]).replace(/'/g, "%27") + "&"
                    }
                }
                return bF.substr(0, bF.length - 1)
            };
            W.prototype.equals = function (bD) {
                if (!bD || !bD.p) {
                    return false
                }
                for (var bE = 0; bE < bA.length; bE++) {
                    var bC = bA[bE];
                    if (bC == "pn") {
                        var bG = this.p(bC) ? this.p(bC) : "0";
                        var bF = bD.p(bC) ? bD.p(bC) : "0";
                        if (bG != bF) {
                            return false
                        }
                    } else {
                        if (this.p(bC) != bD.p(bC)) {
                            return false
                        }
                    }
                }
                return true
            };
            W.prototype.p = function (bD, bC) {
                if (q(bx, bD) >= 0) {
                    bD = "wd"
                }
                if (bC === undefined) {
                    return this.params[bD]
                }
                this.params[bD] = bC;
                return this
            };
            W.prototype.hashCode = function () {
                var bD = [];
                if (!this.p("wd")) {
                    return ""
                }
                for (var bE = 0; bE < bA.length; bE++) {
                    var bC = bA[bE];
                    if (bC == "pn" && !this.p(bC)) {
                        bD.push("0")
                    } else {
                        bD.push(this.p(bC))
                    }
                }
                return bD.join("\t")
            };
            W.prototype.filterOtherParams = function () {
                for (var bC in this.params) {
                    if (this.params.hasOwnProperty(bC) && q(bw, bC) < 0) {
                        delete this.params[bC]
                    }
                }
            };
            W.prototype.wdSameName = function () {
                var bC;
                for (bC = 0; bC < bx.length; bC++) {
                    if (this.params && this.params[bx[bC]]) {
                        this.params.wd = this.params[bx[bC]];
                        delete this.params[bx[bC]]
                    }
                }
            }
        }
        this.params = {};
        if (!bB) {
            bh = ax.serializeArray();
            for (var bv = 0; bv < bh.length; bv++) {
                if (!this.p(bh[bv].name)) {
                    this.p(bh[bv].name, bh[bv].value)
                }
            }
        }
        if (typeof by == "object") {
            for (var bu in by) {
                if (by.hasOwnProperty(bu)) {
                    this.p(bu, by[bu])
                }
            }
        }
        this.wdSameName();

        function bz(bD) {
            if (typeof bD == "object") {
                var bC = {};
                for (bu in bD) {
                    if (bD.hasOwnProperty(bu)) {
                        bC[bu] = bD[bu]
                    }
                }
            } else {
                bC = bD
            }
            return bC
        }
    }
    window.pageState = 0;
    var ad = null;
    var aA = null;
    var bc = document.location.href;
    var au = false;
    var a3, aQ, o;
    var Y = $.ajax({
        dataType: "script",
        cache: true,
        url: bds.comm.logFlagSug === 1 ? "https://ss1.bdstatic.com/5eN1bjq8AAUYm2zgoY3K/r/www/cache/static/protocol/https/sug/js/bdsug_async_sam_sug_337f5f1d.js" : "https://ss1.bdstatic.com/5eN1bjq8AAUYm2zgoY3K/r/www/cache/static/protocol/https/sug/js/bdsug_async_50f4eb41.js"
    });
    var aq;
    var s = "focus";
    var P;
    (function () {
        window.PDC_ASYNC = {
            setParam: function (bw, bx) {
                if (aA && aA.pdc) {
                    aA.pdc.setParam(bw, bx)
                }
            },
            setLinkData: function (bw, bx) {
                bu[bw] = bx
            },
            sendLinkLog: function () {
                var bz = "//www.baidu.com/nocache/fesplg/s.gif?log_type=linksp",
                    bA = "";
                bA += "&link_t=" + (new Date().getTime() - bu.click_t) + "&query=" + bds.comm.queryEnc + "&qid=" + bds.comm.queryId + "&linkpreload=" + bu.linkpreload;
                var by = Math.random();
                if (by < 0.01) {
                    var bw = new Image(),
                        bx = "LINK_IMG_" + (new Date());
                    window[bx] = bw;
                    bw.onload = function () {
                        delete window[bx]
                    };
                    bw.src = bz + bA
                }
            }
        };
        var bv = window.PDC_ASYNC.log = {};
        var bu = {};
        window.bds && (bds.pdc = window.PDC_ASYNC)
    })();

    function aJ(bQ) {
        var bJ = {
                product_id: 45,
                page_id: 317,
                page_type: 0
            },
            by = {},
            bU = {
                st: 0,
                pt: 0,
                net: 0,
                dom: 0,
                fs: 0
            },
            bN = [],
            bv = $.Callbacks(),
            bw = {},
            bC = null,
            bz = null,
            bA = 600;

        function bF(bV) {
            if (typeof bV === "string") {
                bU[bV] = Date.now ? Date.now() : +new Date()
            }
        }

        function bO(bV, bW) {
            if (typeof bV === "string") {
                by[bV] = bW
            }
        }

        function bH() {
            by.cus_net = bU.net > bU.st && bU.net - bU.st - by.cus_srv > 0 ? bU.net - bU.st - by.cus_srv : 1;
            by.cus_tti2 = bU.dom > bU.st ? bU.dom - bU.st : 1;
            by.cus_frdom = bU.dom - bU.pt;
            by.cus_fs = bU.fs > bU.st ? bU.fs - bU.st : by.cus_tti2;
            by.cus_frext = by.cus_fs - by.cus_tti2
        }

        function bG(bW) {
            var bX = "";
            for (var bV in bW) {
                if (bV && bW.hasOwnProperty(bV) && bW[bV] !== "") {
                    bX += "&" + bV + "=" + encodeURIComponent(bW[bV])
                }
            }
            return bX
        }

        function bM(bW) {
            var bW = [];
            for (var bX in bw) {
                bW.push(bw[bX])
            }
            var bV = bC = $.when.apply($, bW);
            bC.always(function () {
                if (bV !== bC) {
                    return
                }
                bR()
            })
        }

        function bL() {
            var bW = Array.apply(null, arguments);
            if (!bW.length > 0) {
                return
            }
            for (var bV = 0; bV < bW.length; bV++) {
                bw[bW[bV]] = $.Deferred()
            }
        }

        function bD() {
            bO("qid", bQ.qid);
            bO("cus_q", (bQ.real_wd || bQ.env.p("wd")));
            bO("sid", bds.comm.sid);
            bO("cus_newindex", bds.comm.newindex);
            bO("supportis", bds.comm.supportis)
        }

        function bT() {
            bQ = null;
            bz = null
        }

        function bI(bV) {
            bw[bV].resolve();
            if (bV == "swap_end") {
                setTimeout(function () {
                    bI("swap_end_5s")
                }, 5000)
            }
        }

        function bB() {
            bL("swap_end", "swap_end_5s");
            if (bds.comm.supportis || true) {
                bL("confirm")
            }
            bM()
        }

        function bP() {
            bB();
            bU.st = 0;
            bU.fs = 0;
            bU.dom = 0
        }

        function bR() {
            var bZ = Math.random(),
                b1 = /21035|21036|21213|21215|21215|21216/,
                bV = bZ > 0.51 && bZ < 0.52;
            if (((bZ > 0.51 && bZ < 0.52) || (b1.test(bds.comm.sid) && (bZ > 0 && bZ < 0.2)) || bds.comm.intrSid)) {
                if (b1.test(bds.comm.sid)) {
                    if (!bV) {
                        bO("issam", 1)
                    } else {
                        bO("issam", 2)
                    }
                }
                bH();
                bE(bz);
                bx(bz);
                bO("srvInfo", bK());
                bO("sysv", navigator.appMinorVersion);
                bD();
                bv.fire();
                var b0 = "//www.baidu.com/nocache/fesplg/s.gif?log_type=sp",
                    b2 = "";
                b2 += bG(bJ) + bG(by);
                var bX = b0 + b2,
                    bW = new Image(),
                    bY = "_LOG_" + new Date().getTime();
                bW.onload = function () {
                    delete window[bY]
                };
                window[bY] = bW;
                bW.src = bX
            }
        }

        function bu(bV) {
            bz = bV;
            bV.find("img").one("load", function () {
                var b0 = $(this).offset(),
                    bY = b0.top,
                    bZ = b0.left,
                    bX = "";
                if (bY < bA && bY > 0) {
                    bF("fs");
                    var bW = bU.fs - bU.dom;
                    bN.push(bY + "_" + bZ + "_" + bW);
                    if ($(this).attr("data-src") || /^http/.test($(this).attr("src"))) {
                        bX = $(this).attr("data-src") || $(this).attr("src")
                    } else {
                        bX = "base64"
                    }
                    bO("ic_lis", bX)
                }
            })
        }

        function bK() {
            var bY = $.parseJSON(bds.comm.speedInfo),
                bV = "",
                bX = [],
                b1, b0;
            for (var bZ in bY) {
                b1 = bY[bZ];
                b0 = b1.ModuleId + "_" + b1.TimeCost + "_" + b1.TimeSelf + "_" + b1.Idc;
                if (b1.hasOwnProperty("SubProcess")) {
                    for (var bW in b1.SubProcess) {
                        b0 += "," + b1.SubProcess[bW].ProcessId + "_" + b1.SubProcess[bW].TimeCost + "_" + b1.SubProcess[bW].isHitCache + "_" + b1.SubProcess[bW].Idc
                    }
                }
                bX.push(b0)
            }
            return encodeURIComponent(bX.join("|"))
        }

        function bE(bW) {
            var b1 = 0,
                b0 = bW.find("img"),
                bZ = bW.find("#content_left").find("img"),
                b2 = 0,
                bV = 0,
                bY = 0;
            for (var bX = 0; bX < b0.length; bX++) {
                bY = b0.eq(bX).offset().top;
                if (bY < bA && bY > 0) {
                    b1++
                }
            }
            bO("cus_ic", b0.length);
            bO("cus_extic", b1);
            bO("cus_extlic", b2);
            bO("cus_icl", bZ.length);
            bO("cus_icr", bW.find("#content_right").find("img").length);
            bO("img_info", bN.join(","));
            bO("psize", bW.html().length)
        }

        function bx(bV) {
            var b0 = {},
                bZ = [],
                bY = bV.find("#content_left,#con-ar").children("*[tpl]"),
                bW = "";
            if (bY.length > 0) {
                for (var bX = 0; bX < bY.length; bX++) {
                    bW = bY.eq(bX).attr("tpl");
                    if (!b0.hasOwnProperty(bW)) {
                        b0[bW] = 1;
                        bZ.push(bW)
                    }
                }
            }
            if (bZ.length > 0) {
                bO("tplp", bZ.join("|"))
            }
        }

        function bS(bV) {
            bv.add(bV)
        }
        bB();
        return {
            trigger: bI,
            mark: bF,
            setParam: bO,
            onSendlog: bS,
            bindImgLoad: bu,
            destroy: bT,
            init: bP
        }
    }
    var aO = (function (by) {
        function bw() {
            if (bA != 1, (bA = 1, bC()), bA == 1) {
                var bF = new Date(),
                    bG = false,
                    bH = function () {
                        var bK = new Date(),
                            bI = bK - bF - by,
                            bJ = bx();
                        0 > bI && (bI = 0);
                        if (!bJ && !bG) {
                            bu[bD] = bI;
                            bD = (bD + 1) % 20
                        }
                        bG = bJ;
                        1 == bA && (bF = bK, bv = setTimeout(bH, by))
                    };
                bv = setTimeout(bH, by)
            }
        }

        function bC() {
            window.clearTimeout(bv)
        }

        function bx() {
            var bG = ["webkit", "moz", "ms", "o"];
            if ("hidden" in document) {
                return document.hidden
            }
            for (var bF = 0; bF < bG.length; bF++) {
                if (bG[bF] + "Hidden" in document) {
                    return document[bG[bF] + "Hidden"]
                }
            }
            return false
        }

        function bB() {
            bu.slice(bD).concat(bu.slice(0, bD))
        }

        function bE(bP) {
            try {
                var bL = 0,
                    bO = Math.max.apply(null, bP);
                var bQ = 10,
                    bH = 60,
                    bG = 4,
                    bN = 40;
                var bJ = Cookie.get("ispeed_lsm"),
                    bF = 0,
                    bS = new Date(),
                    bK = 0;
                bS.setTime(bS.getTime() + 30 * 86400000);
                for (var bI = 0; bI < bP.length; bI++) {
                    var bR = bP[bI];
                    bL += bR
                }
                bL = Math.round(bL / bP.length);
                if (bO > 1000 || bL > 150) {
                    bF = bJ ? parseInt(bJ) : 0;
                    if (bF >= bN - bQ && bF < bN) {
                        bK = 1;
                        Cookie.set("ispeed", 2, document.domain, "/", bS)
                    }
                    if (bF < bH) {
                        bF = bF + bQ > bH ? bH : bF + bQ;
                        Cookie.set("ispeed_lsm", bF, document.domain, "/", bS)
                    }
                } else {
                    if (bJ && parseInt(bJ) > bN) {
                        bG = 5
                    }
                    if (bJ && parseInt(bJ) >= bG) {
                        if (parseInt(bJ) <= bN + bG && parseInt(bJ) > bN) {
                            bK = 2;
                            Cookie.set("ispeed", 1, document.domain, "/", bS)
                        }
                        bF = parseInt(bJ) - bG;
                        Cookie.set("ispeed_lsm", bF, document.domain, "/", bS)
                    }
                }
                return bK
            } catch (bM) {}
            return 0
        }

        function bz() {
            if (Cookie.get("ispeed") && UPS.get("isSwitch") == 1) {
                return parseInt(Cookie.get("ispeed")) == 2 ? true : false
            }
            return false
        }
        var bu = [],
            bD = 0,
            bA = 0,
            bv = false,
            by = by || 250;
        return {
            start: bw,
            stop: function () {
                window.clearTimeout(bv);
                bA = 0
            },
            getData: function () {
                return bu.slice(bD).concat(bu.slice(0, bD))
            },
            isSlow: bz,
            monitor: bE
        }
    })();
    if (bds.comm.supportis && UPS.get("isSwitch") == 1) {
        aO.start()
    }
    var U;
    Y.done(function () {
        a3 = aQ = o = bds.se.sug({
            maxNum: 10,
            withoutRich: bds.comm.supportis,
            withoutZhixin: true,
            form: bn[0],
            ipt: a[0],
            cbname: "bdsugresultcb",
            submission: aK
        });
        a.keydown(function (bw) {
            var bx = getCursortPosition(this);
            if ((bw.keyCode == 9 || (bw.keyCode == 39 && bx == this.value.length)) && bds.comm.supportis && aA && ac.text()) {
                bw.preventDefault();
                if (aA.real_wd != this.value) {
                    a.val(aA.real_wd);
                    a3.check()
                }
                a3.show();
                a4("");
                x(aA, au, 22)({
                    tipConfirm: true
                })
            }
        });
        a3.on("start", function () {
            s = "focus"
        });
        $(window).on("blur", function () {
            a3.hide()
        });
        $(document).on("click", function (bw) {
            if (bw.isTrigger == 2 || bw.isTrigger == 3) {
                return false
            }
            a3.hide()
        });
        var bu, bv;
        a3.on("inputChange", function (bB, bA) {
            if (!bu) {
                bu = a.val()
            }
            a4("");
            ba();
            clearTimeout(U);
            if ((pageState == 0 && window.__disable_index_predict) || ay || F || aO.isSlow()) {
                a3.setMaxNum(10);
                return
            }
            a3.setMaxNum(f);
            var bC = new W({
                pn: "",
                wd: bA.value
            });
            if (bds && bds.comm && bds.comm.logFlagSug && bds.comm.logFlagSug === 1) {
                bC.p("rsv_slog", "ipt_change")
            }
            if (pageState == 0 && bds.comm.supportis && $.trim(a.val())) {
                az(bC);
                var bz = $("<div id='ent_sug'>请按“回车”键发起检索</div>").insertBefore("#head");
                $(window).one("swap_begin", function () {
                    bz.remove()
                })
            }
            if (P) {
                P = false;
                return
            }
            if (window.__restart_confirm_timeout) {
                an()
            }
            s = "input";
            aZ = new Date().getTime();
            if (bv) {
                clearTimeout(bv);
                bv = false
            }
            if ($.trim(bA.value) == "") {
                i();
                return
            }
            aq = bA.checkStore();
            if (!/^[a-zA-Z0-9~!@#$%^&*()_+=-]$/.test(bA.value)) {
                var bx = a.val();
                var bw = bA.imt.getLog();
                if (bw.length > 0) {
                    if (bw[bw.length - 1].type.indexOf("link") > -1) {
                        bC.p("_sglink", "1")
                    }
                }
                var by = bA.imt.diffLog();
                if (by && by.length > 1) {
                    by = by.slice(-3 * 5).join(".");
                    bC.h({
                        is_params: {
                            imes: encodeURIComponent(by)
                        }
                    })
                }
                if (!window.__disable_is2 && bu.length > bx.length && bu.indexOf(bx) === 0) {
                    bv = setTimeout(function () {
                        w({
                            env: bC,
                            use_cache: true,
                            force: false,
                            pstg: 5,
                            shouldShow: bds.comm.supportis
                        });
                        bv = false
                    }, 250)
                } else {
                    w({
                        env: bC,
                        use_cache: true,
                        force: false,
                        pstg: 5,
                        shouldShow: bds.comm.supportis
                    })
                }
            }
            bu = bx
        });
        a3.on("selectSug", function (bA, bz, by, bx) {
            a4("");
            clearTimeout(U);
            if ((pageState == 0 && window.__disable_index_predict) || ay || F || aO.isSlow()) {
                return
            }
            if (by == -1) {
                if (aA) {
                    a3.setVisibleSug(aA.real_wd)
                }
                var bB = new W({
                    pn: "",
                    wd: bz.value
                });
                if (bds && bds.comm && bds.comm.logFlagSug && bds.comm.logFlagSug === 1) {
                    bB.p("rsv_slog", "sug_select")
                }
                w({
                    env: bB,
                    use_cache: true,
                    force: false,
                    shouldShow: bds.comm.supportis,
                    pstg: 3
                })
            } else {
                a3.setVisibleSug();
                a4("");
                var bB = new W({
                    pn: "",
                    wd: bx
                });
                if (bds && bds.comm && bds.comm.logFlagSug && bds.comm.logFlagSug === 1) {
                    bB.p("rsv_slog", "sug_select")
                }
                var bw = (bz.stopRefresh) ? false : (bds.comm.supportis);
                w({
                    env: bB,
                    force: false,
                    use_cache: true,
                    no_predict: true,
                    shouldShow: bw,
                    pstg: 3
                })
            }
        });
        a3.on("render", function (bx, bw) {
            if (aA) {
                a3.setVisibleSug(aA.real_wd)
            }
        });
        a3.on("dataReady", function (bz, by) {
            var bx = by && by.queryValue && by.dataCached && by.dataCached[by.queryValue];
            if (bx && bx.gl) {
                for (var bw in bx.gl) {
                    if (bx.gl[bw] * 1 > 0) {
                        var bA = new W({
                            pn: "",
                            wd: bx.s[bw]
                        });
                        w({
                            env: bA,
                            force: false,
                            use_cache: true,
                            no_predict: true,
                            shouldShow: false,
                            pstg: 7
                        })
                    }
                }
            }
        });
        if (pageState == 0) {
            a3.start()
        }
    });

    function aS(bu, bv) {
        if (bu) {
            bv = $.extend(bu.log, bv)
        }
    }

    function aX() {
        if (bds.comm.seinfo) {
            bds.comm.seinfo.rsv_pre = encodeURIComponent(D());
            bds.comm.seinfo.rsv_reh = reh_rec();
            bds.comm.seinfo.rsv_scr = scr_rec();
            var bv = null;
            if (bds && bds.comm && bds.comm.personalData) {
                try {
                    if (typeof bds.comm.personalData == "string") {
                        bds.comm.personalData = $.parseJSON(bds.comm.personalData)
                    }
                    if (!bds.comm.personalData) {
                        bv = null
                    } else {
                        bv = bds.comm.personalData.fullSkinName && bds.comm.personalData.fullSkinName.value
                    }
                } catch (bw) {
                    bv = null
                }
            }
            if (bv) {
                bds.comm.seinfo.rsv_skin = bv
            }
            bds.comm.seinfo.rsv_psid = $.getCookie("BIDUPSID");
            bds.comm.seinfo.rsv_pstm = $.getCookie("PSTM");
            bds.comm.seinfo.rsv_idc = (function () {
                var bA = bds.comm.speedInfo || [];
                try {
                    bA = $.parseJSON(bA)
                } catch (bC) {
                    bA = []
                }
                for (var bB = 0, bz = bA.length; bB < bz; bB++) {
                    if (bA[bB]["ModuleId"] == 9540) {
                        return bA[bB]["Idc"] || ""
                    }
                }
                return ""
            })();
            c(bds.comm.seinfo);
            if (bds.comm._se_click_track_flag === "ON") {
                var bx = new Image(),
                    by = "//www.baidu.com/s?wd=" + bds.comm.queryEnc + "&qid=" + bds.comm.queryId + "&lts=91";
                bx.src = by
            }
        }
        if (bds.comm.cgif) {
            var bu = bds.comm.cgifimg = new Image();
            bu.src = bds.comm.cgif
        }(function () {
            var bE = Math.random(),
                bC = [],
                bD = function (bG, bI) {
                    var bF = $(bG),
                        bK = "",
                        bJ;
                    if (bG == "link" && bF.attr("rel") != "stylesheet") {
                        return
                    }
                    for (var bH = 0; bH < bF.length; bH++) {
                        bJ = bF.eq(bH);
                        bK = bJ.attr(bI);
                        if (bB(bK)) {
                            bC.push(encodeURIComponent(bK))
                        }
                    }
                },
                bB = function (bF) {
                    if (/^http:\/\//.test(bF)) {
                        return true
                    }
                    return false
                },
                bA = function () {
                    var bH = "//www.baidu.com/nocache/fesplg/s.gif?log_type=hm",
                        bI = "";
                    bI += "&q=" + bds.comm.query;
                    bI += "&error=" + bC.join(",");
                    var bF = new Image(),
                        bG = "_HM_LOG_" + new Date().getTime();
                    bF.onload = function () {
                        delete window[bG]
                    };
                    window[bG] = bF;
                    bF.src = bH + bI
                },
                bz = function (bF) {
                    var bI = Math.floor(Math.random() * 2);
                    var bF = bF;
                    var bG = {
                        www: "https://www.baidu.com/nocache/pdns/az.gif?t=" + (+new Date()),
                        gsp: "https://gst" + bI + ".baidu.com/nocache/az.gif?t=" + (+new Date()),
                        gs0: "https://gs" + bI + ".baidu.com/nocache/pdns/az.gif?t=" + (+new Date()),
                        cdn: "https://ss" + bI + ".baidu.com/6ONWsjip0QIZ8tyhnq/ps_default.gif?t=" + (+new Date()),
                        idc: "https://sp" + bI + ".baidu.com/htpoty.gif?t=" + (+new Date())
                    };
                    if (bj.protocol == "http:" && /8501/.test(bds.comm.sid)) {
                        bG = {
                            bwww2: "http://bwww2.baidu.com/static/tj.gif?t=" + (+new Date()),
                            bwww3: "http://bwww3.baidu.com/static/tj.gif?t=" + (+new Date()),
                            bwww4: "http://bwww4.baidu.com/static/tj.gif?t=" + (+new Date()),
                            bwww5: "http://bwww5.baidu.com/static/tj.gif?t=" + (+new Date())
                        }
                    }
                    var bH = [],
                        bK = [],
                        bM = {};
                    for (var bJ in bG) {
                        (function (bQ) {
                            var bP = "_SSL_LOG_" + bQ + "_" + (+new Date()),
                                bN = new Image(),
                                bO = new Date();
                            bM[bQ] = $.Deferred();
                            bK.push(bM[bQ]);
                            bN.onload = function () {
                                bM[bQ].resolve();
                                delete window[bP]
                            };
                            bN.onerror = function () {
                                bM[bQ].resolve();
                                bH.push(bQ + "_" + bI + "=" + (new Date() - bO));
                                delete window[bP]
                            };
                            bN.src = bG[bQ]
                        })(bJ)
                    }
                    var bL = $.when.apply($, bK);
                    bL.always(function () {
                        var bP = "//www.baidu.com/nocache/fesplg/s.gif?log_type=hm&type=ssl&",
                            bQ = bH.join("&");
                        bP += "sysv=" + navigator.appMinorVersion + "&tag=" + bF + "&";
                        var bN = new Image(),
                            bO = "_HM_LOG_" + new Date().getTime();
                        bN.onload = function () {
                            delete window[bO]
                        };
                        window[bO] = bN;
                        bN.src = bP + bQ
                    })
                };
            if (bj.protocol === "https:" && bE < 0.03) {
                bD("img", "src");
                bD("script", "src");
                bD("iframe", "src");
                bD("link", "href");
                if (bC.length > 0) {
                    bA()
                }
            }
            if (bE < 0.01 || /8501/.test(bds.comm.sid)) {
                bz()
            }
            if (window.ctwin) {}
        })()
    }

    function D() {
        return bd.length
    }
    var ah, H, bl, y;
    (function () {
        var bx;
        var bB = -1,
            bA = 0;
        var bv = -1,
            by = -1,
            bu = -1,
            bw = -1;
        var bz = 0;
        ah = function (bD) {
            if (!bD) {
                return
            }
            bu = bD.pageX;
            bw = bD.pageY;
            bx = bD.target;
            var bC = $(bD.target);
            if (bC.attr("type") == "submit") {
                bz = 1
            }
            var bE = bC.offset();
            bv = bu - bE.left;
            by = bw - bE.top;
            bA = new Date().getTime()
        };
        H = function (bC) {
            if (!bC || bC.target != bx) {
                return
            }
            bB = new Date().getTime() - bA
        };
        y = function (bD) {
            if (bds && bds.comm && bds.comm.query) {
                bD = bds.comm.query
            }
            var bC = bz + "." + bB + "." + bv + "." + by + "." + bu + "." + bw;
            bC = aC(bC + bD) + "." + bC;
            return bC
        };
        bl = function () {
            bB = -1;
            bA = 0;
            bv = -1;
            by = -1;
            bu = -1;
            bw = -1;
            bz = 0
        };
        $(window).on("confirm", function () {
            setTimeout(bl, 0)
        })
    })();
    $(function () {
        $("#head").delegate(".index_tab_top>a,.index_tab_bottom>a,#u1>a,#u>a", "mousedown", function () {
            if ($(this).attr("name")) {
                return ns_c({
                    fm: "behs",
                    tab: $(this).attr("name"),
                    query: "",
                    un: encodeURIComponent(bds.comm.user || "")
                })
            }
        })
    });
    $(document).delegate("a", "mousedown", function () {
        x(aA, au, 22)()
    });

    function J(bu) {
        $(document).delegate("a", "mousedown", (function () {
            return function () {
                var bw = $(this);
                var bv = ao(bw, bu)
            }
        })())
    }

    function ao(bz, by) {
        var bA = by.prefix;
        var bu;
        var bv = bz.attr("href");
        if (bA && bv && bv.indexOf(bA) == 0) {
            bv = bv.substring(bA.length)
        }
        if (!bA && bv) {
            var bw = bv.match(/^http:\/\/[^\/]+/);
            if (bw) {
                bA = bw[0]
            } else {
                return
            }
            bv = bv.replace(/^http:\/\/[^\/]+/, "")
        }
        if (bv) {
            bu = bv.match(/^\/*(link|baidu.php)\?(.*)$/);
            bu = bv.match(by.regex)
        }
        if (bu && bu[2] && bu[2].match(/&(wd|word)=/)) {
            return
        }
        if (bv && bu) {
            if (by.convertTable && by.convertTable[bu[1]]) {
                bu[1] = by.convertTable[bu[1]]
            }
            var bx = aw.getLinkParams(bv);
            if (bx) {
                if (bj.protocol === "https:" && /Chrome|Safari/.test(navigator.userAgent)) {
                    bA = bA.replace(/^http:\/\/www\.baidu\.com/, "https://www.baidu.com")
                }
                bv = bA + "/" + bu[1] + "?" + bu[2] + "&" + bx;
                bz.attr("href", bA + "/" + bu[1] + "?" + bu[2] + "&" + bx);
                bz.click(function () {
                    window.PDC_ASYNC.setLinkData("click_t", new Date().getTime());
                    window.PDC_ASYNC.setLinkData("linkpreload", $(this).attr("linkpreload"))
                })
            }
        }
        return bv
    }
    J({
        prefix: "http://www.baidu.com",
        regex: /^\/*(link)\?(.*)$/
    });
    J({
        prefix: "//www.baidu.com",
        regex: /^\/*(link)\?(.*)$/
    });
    J({
        prefix: "http://www.baidu.com",
        convertTable: {
            "baidu.php": "baidu.php",
            "aladdin.php": "aladdin.php",
            "siva.php": "siva.php",
            "adrc.php": "adrc.php",
            "zhixin.php": "zhixin.php"
        },
        regex: /^\/*(baidu\.php|aladdin\.php|siva\.php|adrc\.php|zhixin\.php)\?(.*)$/
    });
    if (bj.host != "www.baidu.com") {
        J({
            prefix: "",
            convertTable: {
                "baidu.php": "baidu.php",
                "aladdin.php": "aladdin.php",
                "siva.php": "siva.php",
                "adrc.php": "adrc.php",
                "zhixin.php": "zhixin.php"
            },
            regex: /^\/*(baidu\.php|aladdin\.php|siva\.php|adrc\.php|zhixin\.php)\?(.*)$/
        })
    }
    J({
        prefix: "http://bzclk.baidu.com",
        regex: /^\/*(adrc\.php)\?(.*)$/
    });
    if (bj.protocol == "https:" && bds.comm.ishome && !/Chrome/.test(navigator.userAgent)) {
        $(document).delegate("a", "mousedown", function () {
            var bw = $(this);
            var bu = bw.attr("href");
            var bv = {
                "http://v.baidu.com": "/?fr=bd"
            };
            if (bv && bv.hasOwnProperty(bu)) {
                bw.attr("href", bu + bv[bu])
            }
        })
    }
    $(document).delegate("a", "mousedown", function () {
        var bA = $(this),
            bv = bA.attr("href"),
            bu = new Image(),
            bz = "//www.baidu.com/nocache/fesplg/s.gif?log_type=hm";
        var by = Math.random();
        if (by < 0.01 && !/www\.baidu\.com\//.test(bv) && /^http/.test(bv)) {
            var bw = bz + "&c_url=" + encodeURIComponent(bv),
                bu = new Image(),
                bx = "_LOG_" + new Date().getTime();
            bu.onload = function () {
                delete window[bx]
            };
            window[bx] = bu;
            bu.src = bw
        }
    });
    if (aw.support()) {
        $(document).delegate("a", "click", (function () {
            var bu = bj.protocol + "//" + bj.host;
            return function (bz) {
                var by = $(this);
                if (by.attr("target") && by.attr("target") != "_self") {
                    return
                }
                var bw = $.trim(by.attr("href"));
                if (bw && bw.indexOf(bu) == 0) {
                    bw = bw.substring(bu.length)
                }
                if (bw) {
                    matched = bw.match(/^\/*s\?(.*)/)
                }
                if (bw && matched) {
                    var bA = br(matched[0]);
                    if (!bA.pn) {
                        bA.pn = ""
                    }
                    if (q(["baidurt", "baiduwb", "baidufir", "SE_baiduxueshu_c1gjeupa"], bA.tn) < 0) {
                        var bv = by.parents("#con-at");
                        if (bv.size() > 0) {
                            u({
                                top: bv.offset().top + bv.height()
                            })
                        }
                        var bx = aw.clickResultLink(by, ad, bA)
                    }
                    return bx
                }
            }
        })())
    }
    $(document).delegate("a", "mousedown", function (bu) {
        ah(bu)
    });
    $(document).delegate("a", "mouseup", function (bu) {
        H(bu)
    });
    $(document).delegate("#su,#su1", "mouseup", function (bu) {
        H(bu)
    });
    $(document).delegate("#su,#su1", "mousedown", function (bu) {
        ah(bu)
    });
    (function () {
        var bu;
        if (window._bdlkc >= 1) {
            $(document).delegate(".c-container", "mouseenter", (function () {
                return function () {
                    var bv = $(this),
                        bw = 300;
                    if (window._bdlkc == 2) {
                        bw = 100
                    }
                    bu = setTimeout(function () {
                        var bz = bv.find(".t>a"),
                            bx = ao(bz, {
                                prefix: "http://www.baidu.com",
                                regex: /^\/*(link)\?(.*)$/
                            }),
                            bB = bv.attr("mu") || bv.find(".f13 .g").text(),
                            by = /^(http[s]?:\/\/)?([^\/]+)(.*)/,
                            bA = bB.match(by);
                        if (bx && bx.match(bj.protocol) && /www\.baidu\.com\/link/.test(bx) && !/bdlkc=1/.test(bx)) {
                            if (bA[2]) {
                                bB = "http://" + bA[2];
                                bv.append('<link rel="dns-prefetch" href="' + bB + '" />')
                            }
                            $.ajax({
                                url: bx + "&bdlkc=1",
                                type: "GET",
                                contentType: "text/html",
                                success: function () {
                                    bz.attr("linkpreload", "1")
                                }
                            });
                            bz.attr("href", bx + "&bdlkc=1")
                        }
                    }, 300)
                }
            })());
            $(document).delegate(".c-container", "mouseleave", (function () {
                return function () {
                    clearTimeout(bu)
                }
            })())
        }
    })();
    var B = $("body");
    var X = document.title;
    (function (bv) {
        var bu;
        bv.fn.textWidth = function () {
            if (!bu) {
                bu = bv('<div data-for="result" style="clear:both;display:block;visibility:hidden;position:absolute;top:0;"><span style="width;inherit;margin:0;font:16px/22px arial;"></span></div>').appendTo("body").find("span")
            }
            bu.html(escapeHTML(bv(this).val()));
            var bw = bu.width();
            return bw
        }
    })(jQuery);

    function a4(bu) {
        if (window.__disable_is2 && $.trim(bu) == $.trim(a.val())) {
            return
        }
        if (C || !bds.comm.supportis) {
            if (ac) {
                ac.html("")
            }
            return
        }
        if (pageState == 0) {
            return
        }
        if (window.__disable_kw_tip) {
            return
        }
        if (!ac) {
            ac = $('<div id="kw_tip" style="width:initial" unselectable="on" onselectstart="return false;" class="s_ipt_tip"/>').insertBefore(a);
            ac.parent().click(function (bz) {
                var by = a.get(0);
                if (bz.target === by) {
                    return true
                }
                by.focus();
                var bw = by.value.length;
                if (document.selection) {
                    var bx = by.createTextRange();
                    bx.moveStart("character", bw);
                    bx.collapse();
                    bx.select()
                } else {
                    if (typeof by.selectionStart == "number" && typeof by.selectionEnd == "number") {
                        by.selectionStart = by.selectionEnd = bw
                    }
                }
                return false
            });
            ac.get(0).onselectstart = function () {
                return false
            }
        }
        ac.text(bu);
        if (bu != "") {
            var bv = a.textWidth();
            ac.css({
                "margin-left": bv + 10 + "px",
                "max-width": ac.parent().width() - bv - 14 + "px"
            }).text(bu);
            if (window.__disable_is2) {
                ac.css("z-index", 1)
            }
            ac.show()
        } else {
            ac.hide()
        }
    }
    var C = false;

    function aE() {
        C = false
    }

    function i(bu) {
        C = true;
        if (aA && aA.real_wd && $.trim(a.val())) {
            a4(aA.real_wd);
            O(aA)
        } else {
            a4("");
            O()
        }
    }

    function O(bu) {
        var bv = a7(a.val());
        if (bu && bv == bu.real_wd) {
            $("#super_se_tip").remove()
        }
    }
    $(window).on("swap_dom_ready", function (bw, bu) {
        var bv = "";
        if (bu && bu.real_wd && (!bu.no_predict || bu.pstg == 6)) {
            bv = bu.real_wd
        }
        a4(bv);
        O(bu)
    });
    $(window).on("swap_end", function (bv, bu) {
        if (!bu) {
            return
        }
        window.cfpromise = new $.Deferred();
        if (ab) {
            clearTimeout(ab);
            ab = false;
            aN = null
        }
        bu.confirm = false;
        if (!bu.force) {
            aN = x(bu, au, 21);
            ab = setTimeout(aN, a0)
        } else {
            x(bu, au, 20)()
        }
    });

    function aY(bz, by) {
        var bx = new Date().getTime();
        if (!by.force) {
            aS(by, {
                utime: new Date().getTime() - a5
            })
        }
        if (!by || !by.loaded) {
            return false
        }
        if (typeof by.html == "string") {
            by.html = $(by.html)
        }
        $(by).trigger("swap_begin");
        bm(function () {
            by.pdc.mark("pt");
            $(window).trigger("swap_begin", [by, bz]);
            var bD = aO && aO.getData();
            if (bD) {
                setTimeout(function () {
                    by.pdc.setParam("ispeed", aO.monitor(bD))
                }, 3000);
                by.pdc.setParam("upm", bD.join(","))
            }
        });
        bm(function () {
            by.base64.restart();
            try {
                if (!by.base64_loaded) {
                    var bE = $.parseJSON(by.html.find("#img_list").text());
                    by.base64.loadImg(bE.right, bE.left)
                }
            } catch (bD) {}
            by.base64.end()
        });
        var bB = [$(window).scrollLeft(), $(window).scrollTop()];
        ak.hide();
        oldEnv = ad;
        ad = bz;
        au = aA;
        aA = by;
        bds.comm.cur_disp_query = bz.p("wd");
        bf();
        if (bds && bds.se && bds.se.certification && bds.se.certification.data) {
            bds.se.certification.data = []
        }
        if (pageState == 0) {
            az(bz)
        }
        bm(function () {
            aM()
        });
        bds.clearReady();
        ak.empty();
        var bA = by.html;
        if (at.use_cache_repeatedly) {
            bA = bA.clone()
        }
        bm(function () {
            bA.find("#head_style").children().removeAttr("data-for").appendTo("head")
        });
        bm(function () {
            $.globalEval(bA.find("#head_script").html())
        });
        if (bds.comm && bds.comm.jsversion && bds.comm.jsversion != "006") {
            var bu = ad.buildSyncSearchUrl({
                jmp: "jsver",
                _vr: Math.random()
            });
            bj.replace(bu);
            return
        }
        bm(function () {
            bA.find("#content_script script").each(function (bD, bE) {
                $.globalEval($(bE).html())
            })
        });
        bm(function () {
            var bD = bA.find("#s_tab");
            if (!bD.size()) {
                return
            }
            var bE = $("#s_tab");
            if (bE.size()) {
                bE.replaceWith(bD)
            } else {
                bD.insertBefore(ak)
            }
        });
        var bw = false;
        (function () {
            var bF = bA.find("#con-at");
            var bD = $("#con-at");
            var bG = bD.children().children();
            if (!bG.size()) {
                if (bF.children().size()) {
                    N(ak, bF, "insertBefore")
                }
            } else {
                if (!bF.children().size()) {
                    bD.remove();
                    $(window).trigger("top_result_removed")
                } else {
                    var bE = bF.children().children();
                    if (bG.attr("cq") != bE.attr("cq") || bG.attr("srcid") != bE.attr("srcid") || (by.force && oldEnv && oldEnv.equals(ad)) || (!ad.p("cq") || !ad.p("srcid")) || (ad.p("_trf") == 1)) {
                        bD.remove();
                        $(window).trigger("top_result_removed");
                        N(ak, bF, "insertBefore")
                    } else {
                        bw = true
                    }
                }
            }
        })();
        var bv = bA.find("#container");
        by.pdc.bindImgLoad(bv);
        N(ak, bv);
        if (!$("#footer").size()) {
            var bC = bA.find("#footer").children();
            N(ak, bC)
        }
        bm(function () {
            var bD = new Date().getTime();
            if (bA) {
                $.globalEval(bA.find("#jsMerge").html())
            }
            aS(by, {
                jsmergetime: new Date().getTime() - bD
            })
        });
        if (bds && bds.comm && bds.comm.templateName == bds.comm.resTemplateName) {
            if (bds.comm.seinfo) {
                bds.comm.seinfo.rsv_tpfail = 0
            }
        } else {
            if (bds.comm.seinfo) {
                bds.comm.seinfo.rsv_tpfail = 1
            }
        }
        if (pageState != 0 && bds && bds.util && bds.util.setContainerWidth) {
            bds.util.setContainerWidth()
        }
        document.title = bz.p("wd") + "_百度搜索";
        ak.show();
        aV();
        aS(by, {
            domtime: new Date().getTime() - bx
        });
        aS(by, {
            waittime: new Date().getTime() - aZ
        });
        by.pdc.mark("dom");
        $(window).trigger("swap_dom_ready", [by, bz]);
        if (window.__lazy_foot_js) {
            setTimeout(function () {
                Z(bz, by, bx)
            }, 0)
        } else {
            Z(bz, by, bx)
        }
        if (!bw) {
            window.scrollTo(0, 0)
        } else {
            window.scrollTo(bB[0], bB[1])
        }
        $(window).trigger("scroll");
        swap_wait = false
    }

    function Z(bv, bu, bx) {
        var bw;
        if (!bx) {
            bx = 0
        }
        if (bu) {
            bw = bu.html
        }
        bm(function () {
            bn.get(0).f.value = 8
        });
        bm(function () {
            var by = new Date().getTime();
            if (bu && bu.base64) {
                bu.base64.setDomLoad("left");
                bu.base64.setDomLoad("right")
            }
            aS(bu, {
                base64time: new Date().getTime() - by
            })
        });
        $("#search").find("form").submit(function () {
            var bz = a;
            a = $(this).find("[name='wd']");
            var by = aK.call(this);
            a = bz;
            return by
        });
        bm(function () {
            var by = new Date().getTime();
            bds.doReady();
            aS(bu, {
                bdstime: new Date().getTime() - by
            })
        });
        bm(function () {
            var by = new Date().getTime();
            if (bw) {
                $.globalEval(bw.find("#ecomScript").html())
            }
            aS(bu, {
                ecomtime: new Date().getTime() - by
            })
        });
        bm(function () {
            var by = new Date().getTime();
            if (bds.se.tools) {
                if (V) {
                    clearTimeout(V)
                }
                V = setTimeout(function () {
                    bds.se.tools()
                }, 600)
            }
            if (bds && bds.se && bds.se.certification && bds.se.certification.build) {
                if (ap) {
                    clearTimeout(ap)
                }
                ap = setTimeout(function () {
                    if ($(".certification").size() > 0) {
                        bds.se.certification.build.init()
                    }
                }, 1000)
            }
            if (bds && bds.se && bds.se.safeTip) {
                if (aa) {
                    clearTimeout(aa)
                }
                aa = setTimeout(function () {
                    if ($(".unsafe_ico_new").size() > 0) {
                        bds.se.safeTip.init()
                    }
                }, 1200)
            }
            aS(bu, {
                tiptime: new Date().getTime() - by
            })
        });
        bm(function () {
            var by = new Date().getTime();
            window.initResultClickLog();
            aS(bu, {
                clicktime: new Date().getTime() - by
            })
        });
        bm(function () {
            aS(bu, {
                rtime: new Date().getTime() - bx,
                used: 1
            });
            if (bds.comm.seinfo && bu) {
                bds.comm.seinfo.rsv_pstg = bu.type
            }
        });
        bm(function () {
            $(window).trigger("swap_end", [bu, bv]);
            bo();
            a5 = new Date().getTime();
            if (bu && bu.pdc) {
                bu.pdc.mark("js");
                bu.pdc.trigger("swap_end")
            }
        })
    }

    function bf() {
        bm(function () {
            $.each(bds.comm.tips, function (bu, bv) {
                if (bv && bv.destroy) {
                    bv.destroy()
                }
            });
            $("#c-tips-container").empty();
            bds.comm.tips = []
        });
        bm(function () {
            if (window.app && window.app.dispose) {
                window.app.dispose()
            }
        });
        bm(function () {
            bds.comm.resolveUnloadHandler()
        });
        if (bds && bds.se && bds.se.certification && bds.se.certification.data) {
            bds.se.certification.data = []
        }
        if (bds && bds.se && bds.se.userAction) {
            bds.se.userAction.destroy()
        }
    }

    function an() {
        if (ab && aN) {
            clearTimeout(ab);
            ab = setTimeout(aN, a0)
        }
    }

    function x(bu, bw, bv) {
        return function (bx) {
            var by = $.extend({}, bx);
            if (!bu || bu.confirm) {
                return
            }
            bds.comm.cur_query = bu.real_wd;
            if (!bds.comm.supportis && bu) {
                bv = bu.pstg || 0
            }
            bu.confirm = true;
            ab = false;
            aN = null;
            var bC = {};
            bC.is_referer = am;
            bC.is_xhr = "1";
            var bz = new W(br(aw.getQueryString()), true);
            if (!bu.env.equals(bz) && !bu.env.clone({
                    wd: bu.prw
                }).equals(bz)) {
                aw.setUrl(bu.env)
            }
            am = bj.protocol + "//" + bj.host + bj.pathname + bj.search;
            if (!bu.seq) {
                bu.seq = 1
            } else {
                bu.seq++
            }
            if (bu.pdc) {
                if (bv != 20 && bds.comm.supportis) {
                    bu.pdc.mark("st")
                }
                if (bu.pdc && bu.pdc.setParam) {
                    bu.pdc.setParam("cus_pstg", bv)
                }
                if (bu.force) {
                    bu.pdc.setParam("f4s", 1)
                }
                bu.pdc.trigger("confirm");
                window.PRE_CONN.startTimer()
            }
            bm(function () {
                $(window).trigger("confirm", [bu, bv])
            });
            var bD = "/s?ie=utf-8&csq=" + bu.seq + "&pstg=" + bv + (by.tipConfirm ? "&_cktip=1" : "") + "&mod=2" + (bds.comm.supportis ? "&isbd=1" : "") + "&cqid=" + bu.qid + "&istc=" + (new Date().getTime() - bu.startTime) + "&ver=" + bds.comm.baiduis_verify + "&chk=" + bu.chk + "&isid=" + aH + "&" + bu.env.buildQueryString() + (bu.force ? "&f4s=1" : "") + (typeof y == "function" ? "&_ck=" + y(bu.env.p("wd")) : "");
            if (bds.comm.indexSid) {
                if (/9998_/.test(bds.comm.indexSid) && bj.protocol === "https:") {
                    bds.comm.indexSid = bds.comm.indexSid.replace("9998", "8499")
                }
                bD += "&rsv_isid=" + bds.comm.indexSid
            }
            if (bu.no_predict) {
                bD += "&isnop=" + (aB <= 1 ? 0 : 1)
            }
            aB = 0;
            if (true && a3 && a3.getRsvStatus) {
                try {
                    bD += "&rsv_stat=" + a3.getRsvStatus(bu.env.p("wd"))
                } catch (bB) {}
            }
            Y.done(function () {
                if (a3.getStat("rsv_sug6")) {
                    bD += "&rsv_sug6=" + a3.getStat("rsv_sug6");
                    if (bds.comm.seinfo) {
                        bds.comm.seinfo.rsv_sug6 = a3.getStat("rsv_sug6")
                    }
                }
                if (a3.getStat("rsv_sug7")) {
                    bD += "&rsv_sug7=" + a3.getStat("rsv_sug7")
                }
                if (a3.getStat("rsv_sug9")) {
                    bD += "&rsv_sug9=" + a3.getStat("rsv_sug9")
                }
                if (a3.getStat("rsv_bp")) {
                    bD += "&rsv_bp=" + a3.getStat("rsv_bp")
                }
            });
            $.ajax({
                headers: bC,
                url: bD
            }).done(function (bE) {
                $('#form input[name="rqlang"]').val(bds.comm.search_tool.actualResultLang || "cn");
                $('#form input[name="rsv_bp"]').val(1);
                var bF = $(bE);
                return
            }).fail(function () {});
            if (bds.comm.seinfo) {
                bds.comm.seinfo.rsv_prw = encodeURIComponent(a.val());
                bds.comm.seinfo.rsv_pstg = bv;
                bds.comm.seinfo.rsv_svoice = window.__supportvoice ? "1" : "0";
                bu.cftime += 1;
                bds.comm.cftime = bu.cftime + "";
                var bA = bu.env.p("rsv_bak");
                if (bA) {
                    bds.comm.seinfo.rsv_bak = bA
                }
            }
            bds.comm.confirmQuery = bds.comm.query;
            bds.comm.confirmQid = bds.comm.qid;
            aX();
            aH = bu.qid;
            Y.done(function () {
                if (bv == 20) {
                    a3.updateInitData()
                } else {
                    if (bv == 22) {} else {
                        if (!bds.comm.supportis) {
                            if (bv >= 0 && bv <= 5) {
                                a3.updateInitData()
                            }
                        }
                    }
                }
                a3.clearStat()
            });
            window.cfpromise.resolve()
        }
    }
    $(window).on("indexOff", function (bv, bu) {
        Y.done(function () {
            a4(bu.p("wd"))
        })
    });
    if (aw.support() && ax.attr("target") != "_blank") {
        Y.done(function () {
            a3.setMaxNum(f)
        })
    }
    var aD = false,
        R;
    var a8 = false;
    bn.mousedown(function () {
        a8 = false
    }).delegate("a,input", "focus", function () {
        a8 = false
    });

    function aK(bv) {
        if (!aw.support()) {
            return true
        }
        if (a8) {
            return false
        }
        a8 = true;
        a.blur();
        a4("");
        if ($(this).attr("target")) {
            return true
        }
        aD = true;
        R = setTimeout(function () {
            aD = false
        }, 1000);
        try {
            if (!$.trim(a.val())) {
                bj.href = "/";
                return false
            }
            var by = new W();
            var bx = $(this).serializeArray(),
                bu;
            for (bu = 0; bu < bx.length; bu++) {
                by.p(bx[bu].name, bx[bu].value)
            }
            by.p("wd", a.val());
            if (by.p("nojc")) {
                by.p("nojc", "")
            }
            if (aA) {
                if ((by.equals(aA.env.clone({
                        wd: aA.real_wd
                    }))) && !aA.force) {
                    x(aA, au, 22)();
                    aA.force = true;
                    a4("");
                    O(aA);
                    return false
                }
                if (aA.env.p("rsv_spt")) {
                    by.p("rsv_spt", aA.env.p("rsv_spt"))
                }
            }
            aw.submit(by, !!bv)
        } catch (bw) {}
        return false
    }
    var aT = {};

    function w(bw) {
        var bx = {
            force: false,
            no_predict: false,
            use_cache: false,
            shouldShow: true,
            pstg: -1
        };
        if (bw) {
            $.extend(bx, bw)
        }
        var bz = bx.env,
            bB = bx.force,
            bA = bx.no_predict,
            bv = bx.shouldShow,
            by = bx.use_cache,
            bu;
        if (!bz || !bz.p("wd") || !bz.hashCode()) {
            return
        }
        if ((ay || Cookie.get("ISSW") == 1) && !bB && bA) {
            return
        }
        if ((F || Cookie.get("ISSW") == 1) && !bB && !bA) {
            return
        }
        if (by && (bu = n.hasCache(bz, {
                loaded: true
            }))) {
            if (bv) {
                if (!aA || !bu.env.clone({
                        wd: bu.real_wd
                    }).equals(aA.env.clone({
                        wd: aA.real_wd
                    }))) {
                    bu.force = bx.force;
                    bu.no_predict = bx.no_predict;
                    bu.pdc.init();
                    if (bu.force) {
                        bu.pdc.mark("st");
                        if (window.bds && bds.comm && !bds.comm.supportis) {
                            bu.pdc.mark("net");
                            bu.pdc.setParam("cus_hitpreload", 1)
                        }
                    }
                    aY(bz, bu)
                }
                a4((bx.no_predict && bx.pstg != 6) ? "" : bu.real_wd);
                O(bu)
            }
            return
        }
        if (bB && bv && bA) {
            u()
        }
        bu = {
            env: bz,
            cftime: 0,
            no_predict: bA,
            shouldShow: bv,
            loaded: false,
            force: bB,
            startTime: new Date().getTime(),
            log: {
                ctime: new Date().getTime() - a5,
                wd: bz.p("wd"),
                ntime: 0,
                stat: 0,
                used: 0,
                rtime: 0,
                utime: (bB ? new Date().getTime() - a5 : 0),
                res: 0
            }
        };
        bu.pdc = aJ(bu);
        if (bx.pstg > 0) {
            bu.pstg = bx.pstg
        }
        if (bu.force) {
            bu.pdc.mark("st")
        }
        bu.base64 = isbase64(bu.pdc);
        bd.push(bu.log);
        E++;
        aB++;
        j(bu)
    }

    function aR() {
        var bu = [];
        if (aq) {
            bu = $.map(aq.slice(0, 2), function (bv) {
                return bv.value
            })
        }
        return bu.join("\t")
    }

    function bs(bu) {
        K();
        bj.replace(bu.buildSyncSearchUrl())
    }
    var I, L;

    function al(bv, bu) {
        if (!bu) {
            ay = true;
            if (I) {
                clearTimeout(I);
                I = false
            }
            I = setTimeout(function () {
                ay = T
            }, bv)
        } else {
            F = true;
            if (L) {
                clearTimeout(L);
                L = false
            }
            L = setTimeout(function () {
                F = bi
            }, bv)
        }
    }

    function j(bC) {
        var bB;
        var bD = bC.env;
        var bz = {};
        var bu;
        if (aA && aA.env) {
            bz.is_referer = aA.env.buildSyncSearchUrl()
        } else {
            bz.is_referer = bc.replace(/\#.*$/, "")
        }
        $.extend(bz, bD.buildHeaders());
        bz.is_xhr = "1";
        if (window.bds && bds.comm && bds.comm.cur_query) {
            bD.p("bs", bds.comm.cur_query)
        } else {
            bD.p("bs", "")
        }
        if (window.bds && bds.comm && bds.comm.cur_disp_query) {
            bz.is_pbs = encodeURIComponent(bds.comm.cur_disp_query)
        }
        var bv = "ie=utf-8" + (bds.comm.newindex ? "&newi=1" : "") + (av.sid ? "&sid=" + encodeURIComponent(av.sid) : "") + (av.tnp ? "&tnp=" + encodeURIComponent(av.tnp) : "") + "&mod=" + (bC.no_predict || !bds.comm.supportis ? "1" : "11") + (bds.comm.supportis ? "&isbd=1" : "") + "&isid=" + aH + "&" + bD.buildQueryString() + "&rsv_sid=" + bds.comm.indexSid + "&_ss=1&clist=" + encodeURIComponent(n.getCacheList()) + "&hsug=" + encodeURIComponent(aR()) + (bC.force ? "&f4s=1" : "") + "&csor=" + getCursortPosition(a.get(0));
        if (bC.pstg) {
            bv += "&pstg=" + bC.pstg
        }
        var bw = "/s?" + bv;
        bw += "&_cr1=" + aC(bw);
        if (!bC.no_predict) {
            bu = n.find(function (bG) {
                if (!bG.loaded && !bG.no_predict) {
                    return true
                }
            });
            for (bB = 0; bB < bu.length; bB++) {
                n.deleteCache(bu[bB])
            }
        }
        if (bC.no_predict && !bC.force) {
            bu = n.find(function (bG) {
                if (bG.force && bD.equals(bG.env)) {
                    return true
                }
            });
            if (bu.length > 0) {
                return
            }
        }
        if (bC.force && bC.shouldShow) {
            var bE = false;
            var bx = new Date().getTime();
            bu = n.find(function (bH) {
                var bG = bD.equals(bH.env);
                if (!bH.loaded && !bH.no_predict && bG && bH !== bC) {
                    bH.shouldShow = false
                }
                if (!bH.loaded && bH.no_predict && bH.force && bG && bH !== bC) {
                    bH.shouldShow = bH.shouldShow || bC.shouldShow;
                    if (bH.startTime && bx - bH.startTime < 2000) {
                        bE = true
                    }
                    if (!window.__sam_backup_request) {
                        bE = true
                    }
                }
                if (!bH.loaded && !bG) {
                    return true
                } else {
                    bH.pdc.mark("st")
                }
            });
            if (bE) {
                return
            }
            for (bB = 0; bB < bu.length; bB++) {
                n.deleteCache(bu[bB])
            }
        }
        var by = function (bI, bH, bK) {
            if (bH == 0) {
                bA(bI, bK);
                if (bC.pdc) {
                    bC.pdc.setParam("cus_srv", bds.se.mon.srvt);
                    bC.pdc.setParam("bsi", Cookie.get("__bsi"))
                }
            } else {
                if (bH == 1) {
                    try {
                        var bG = new Date() * 1;
                        bC.b64ildata = $.parseJSON(bI);
                        bC.base64.ilparseTime = new Date() * 1 - bG;
                        if (bC === aA) {
                            bC.base64.inline(bC.b64ildata);
                            bC.base64.ilrenderTime = new Date() * 1 - bG
                        }
                        $(bC).one("swap_begin", function () {
                            this.base64.inline(this.b64ildata, this.html.get(0))
                        })
                    } catch (bJ) {}
                } else {
                    if (bH == 2) {
                        if (bC.base64) {
                            bC.base64.ilsum = bI
                        }
                    }
                }
            }
        };
        var bA = function (bY, bO) {
            if ((bO && bO.status == "302") || (bY && bY.indexOf("<div>") > 10)) {
                if (bC.force) {
                    bs(bD)
                } else {
                    n.deleteCache(bC)
                }
                return
            }
            aS(bC, {
                ntime: new Date().getTime() - bC.startTime,
                res: 1
            });
            var bV;
            var bX = "<!--data-->";
            var bM = bY.indexOf(bX);
            if (bM != -1) {
                bV = $(bY.substr(0, bM));
                bC.html = bY.substr(bM + bX.length);
                if (window.__dom_pre_parse && bV.find("#__need_parse_dom").html() == "1") {
                    bC.html = $(bC.html)
                }
                try {
                    var bN = $.parseJSON(bV.find("#img_list").text());
                    bC.base64.loadImg(bN.right, bN.left);
                    bC.base64_loaded = true
                } catch (bU) {}
                try {
                    bb(bV.find("#limg_list").text())
                } catch (bU) {}
            } else {
                bV = bC.html = $(bY)
            }
            var bI = parseInt(bV.find("#__status").eq(0).html());
            var bG = parseInt(bV.find("#__switchtime").eq(0).html());
            var bJ = parseInt(bV.find("#__redirect").eq(0).html());
            var bS = {};
            try {
                bS = $.parseJSON(bV.find("#__sugPreInfo:eq(0)").html() || "{}") || {}
            } catch (bU) {}
            bC.real_wd = bV.find("#__real_wd").eq(0).text();
            bC.real_wd_org = bV.find("#__real_wd_org").eq(0).text();
            bC.real_wd_nosynx = bV.find("#__real_wd_nosynx").eq(0).text();
            if (bC.env && bC.env.p("nojc") && bC.real_wd_nosynx) {
                bC.real_wd = bC.real_wd_nosynx
            }
            var bP = false;
            if ((bD.p("wd") == a7(a.val()) || bC.force) && bC.shouldShow) {
                bP = true
            }
            if (bC.real_wd) {
                bC.prw = bD.p("wd");
                bD.p("wd", bC.real_wd)
            }
            var bK = bV.find("#__queryId").html();
            var bH = bV.find("#__querySign").html();
            bC.querySign = bH;
            aS(bC, {
                stat: (bI ? bI : 0)
            });
            if (bds.comm.isDebug) {
                $("#isDebugInfo").html(bV.find("#__isDebugInfo").html())
            }
            if (bK) {
                bC.qid = bK
            }
            var bW = bV.find("#__chk").html();
            bC.chk = bW ? bW : 0;
            if (!bY || (!bK && !bG && !bJ && !bI) || (!bH && bC.force)) {
                if (bC.force) {
                    bD.p("__eis", 1);
                    bD.p("__eist", bY ? bY.length : 0);
                    bD.p("real_wd", bC.real_wd);
                    bs(bD);
                    return
                } else {
                    n.deleteCache(bC);
                    return
                }
            }
            if (bG > 0) {
                al(bG * 1000, !bC.no_predict)
            }
            if (bI == -11) {
                var bR = n.getCacheBySign(bH);
                if (!bR) {
                    w({
                        env: bC.env.clone({
                            wd: bC.real_wd
                        }),
                        force: bC.force,
                        use_cache: false,
                        no_predict: true
                    });
                    n.deleteCache(bC);
                    return
                }
                bR.force = bC.force;
                aE();
                a4(bR.real_wd);
                O(bR);
                n.deleteCache(bC);
                bC = bR;
                if (!aA || bC.real_wd != aA.real_wd) {
                    bP = true
                }
            } else {
                if (bI < 0) {
                    if (bJ == 1 && bC.force) {
                        aS(bC, {
                            redirect: 1
                        });
                        bs(bD);
                        return
                    }
                    i();
                    if (bI == -12 && bS && bS.wait_time > 0) {
                        var bQ = bC.env.clone();
                        U = setTimeout(function () {
                            w({
                                env: bQ,
                                force: false,
                                use_cache: true,
                                no_predict: true,
                                shouldShow: false,
                                pstg: 6
                            })
                        }, bS.wait_time)
                    }
                    n.deleteCache(bC);
                    return
                } else {
                    if (bI > 0) {
                        n.deleteCache(bC);
                        return
                    }
                }
            }
            var bL = n.find(function (bZ) {
                if (!bZ.loaded && bZ !== bC && bZ.no_predict && bD.equals(bZ.env)) {
                    if (bZ.shouldShow) {
                        bP = true
                    }
                    if (bZ.force) {
                        bC.force = true;
                        bC.no_predict = true
                    }
                    return true
                }
            });
            for (var bT = 0; bT < bL.length; bT++) {
                n.deleteCache(bL[bT])
            }
            if (bC.backup_request_timeout) {
                clearTimeout(bC.backup_request_timeout)
            }
            bC.loaded = true;
            if (!bds.comm.supportis && !bP) {
                return true
            }
            if (bP && bC !== aA || bC.force) {
                aE();
                bC.shouldShow = false;
                if (bI == -11) {
                    bC.pdc.init()
                } else {
                    bC.pdc.mark("net")
                }
                aY(bD, bC)
            }
        };
        var bF;
        bF = $.ajax({
            dataType: "parts",
            url: bw,
            headers: bz,
            delimiter: "</*3*/>"
        });
        bF.parts(function (bH, bG, bI) {
            by(bH, bG, bF)
        });
        bF.fail(function (bH, bG) {
            if (bC.force && bC.shouldShow && bG != "abort" && bC.env) {
                bj.replace(bC.env.buildSyncSearchUrl() + "&rsv_jmp=fail")
            }
            n.deleteCache(bC)
        });
        bC.xhr = bF;
        n.addCache(bC)
    }

    function bo() {
        var bu;
        bd = [];
        E = 0;
        aD = false;
        clearTimeout(R)
    }
    $(window).on("swap_end", function (bv, bu) {
        if (!bu) {
            bds.comm.confirmQuery = bds.comm.query;
            bds.comm.confirmQid = bds.comm.qid;
            aX()
        }
    });

    function t() {
        if (window.index_off) {
            window.index_off()
        }
        if (g[0] !== bk[0]) {
            g.val("")
        }
        a = bk;
        pageState = 1;
        bds.comm.ishome = 0;
        bds.comm.cur_query = bds.comm.query;
        ad = new W();
        aA = {
            env: ad,
            real_wd: bds.comm.query,
            force: true,
            confirm: true
        };
        Y.done((function (bu) {
            return function () {
                o.start()
            }
        })());
        $(window).trigger("index_off");
        bds.util.setContainerWidth();
        bm(function () {
            $(window).trigger("swap_dom_ready")
        });
        if (window.__lazy_foot_js) {
            setTimeout(function () {
                Z()
            }, 0)
        } else {
            Z()
        }
    }

    function az(bu) {
        if (window.index_off) {
            window.index_off()
        }
        if (g.get(0) !== bk.get(0)) {
            g.val("");
            bk.val(bu.p("wd"))
        }
        a = bk;
        pageState = 1;
        bds.comm.ishome = 0;
        Y.done(function () {
            if (aQ !== o) {
                aQ.stop();
                o.hide();
                o.setKey(bu.p("wd"));
                o.start()
            }
        });
        bds.util.setContainerWidth();
        $(window).trigger("index_off", bu)
    }
    aw.init();
    $(function () {
        var bu = $("script").last();
        var bv = $("head");
        aM = function () {
            bu.nextAll().not("[data-for]").not("#passport-login-pop").remove();
            bv.find("*").not("[data-for]").not("meta").not("title").not("script[async]").not('link[href*="passport"]').remove()
        }
    });
    if (bds.comm.resultPage) {
        t()
    }
    B.delegate("#s_tab a", "mousedown", function () {
        setHeadUrl(this)
    }).delegate("#s_tab a", "focusin", function () {
        setHeadUrl(this)
    });
    ak.delegate("#page strong+a,#page a.n", "mouseover", function () {
        w({
            env: new W(br($(this).attr("href"))),
            force: false,
            use_cache: true,
            no_predict: true,
            shouldShow: false,
            pstg: 4
        })
    });
    var aj, ag;
    var l, af, S;

    function ba() {
        aj = false;
        ag = false;
        af = [];
        clearTimeout(S);
        S = false
    }

    function r(bu) {
        if (!aj) {
            aj = {
                x: bu.pageX,
                y: bu.pageY
            }
        }
        l = {
            x: bu.pageX,
            y: bu.pageY
        };
        if (!ag && aj.x != bu.pageX && aj.y != bu.pageY) {
            ag = true;
            af = [aj];
            aF()
        }
    }

    function aF() {
        af.push(l);
        var bv = af.length;
        if (Math.pow((l.x - aj.x), 2) + Math.pow((l.y - aj.y), 2) >= Math.pow(z, 2) || bv * b >= d) {
            var bu = a3;
            var bx = !bds.comm.supportis ? 2 : 1;
            if (bx && bu && bu.data() && bu.data()[0] && bu.visible()) {
                var bw = new W().clone({
                    wd: bu.data()[0].value
                });
                w({
                    env: bw,
                    force: false,
                    no_predict: true,
                    use_cache: true,
                    shouldShow: false,
                    pstg: 1
                });
                bx--
            }
            if (bx && bu && bu.data() && bu.data()[1] && bu.visible()) {
                var bw = new W().clone({
                    wd: bu.data()[1].value
                });
                w({
                    env: bw,
                    force: false,
                    no_predict: true,
                    use_cache: true,
                    shouldShow: false,
                    pstg: 1
                });
                bx--
            }
            if (!bds.comm.supportis && bx && $.trim(a.val()) && (!aA || aA.env.p("wd") != $.trim(a.val()))) {
                var bw = new W().clone({
                    wd: $.trim(a.val())
                });
                w({
                    env: bw,
                    force: false,
                    no_predict: true,
                    use_cache: true,
                    shouldShow: false,
                    pstg: 1
                });
                bx--
            }
        } else {
            S = setTimeout(function () {
                aF()
            }, b)
        }

        function by(bA, bz) {
            return Math.sqrt((bA.x - bz.x) * (bA.x - bz.x) + (bA.y - bz.y) * (bA.y - bz.y))
        }
    }
    Y.done(function () {
        $(document).mousemove(r)
    });
    $("#u .back_org").click(function () {
        var bu = new Date();
        bu.setTime(new Date().getTime() + 1103760000000);
        Cookie.set("ORIGIN", 2, document.domain, "/", bu);
        if (ad) {
            bj.replace(ad.buildSyncSearchUrl({
                _r: Math.random()
            }))
        } else {
            bj.href = "/"
        }
    });
    $(window).scroll((function () {
        var bw = $("#head"),
            bu = $(window);
        var bv = 40;
        var bz;
        var by = bw.offset().top;
        var bx = function () {
            if (bz) {
                clearTimeout(bz);
                bz = false
            }
            bz = setTimeout(function () {
                var bA = bu.scrollTop();
                if (bA > bv + by) {
                    bz = setTimeout(function () {
                        bw.addClass("s_down");
                        Y.done(function () {
                            o.hide()
                        })
                    }, 0)
                } else {
                    if (bA <= bv + by) {
                        bz = setTimeout(function () {
                            bw.removeClass("s_down")
                        }, 0)
                    }
                }
            }, 50)
        };
        bx();
        return bx
    })());
    a.bind("paste", function (bv) {
        if ((window.__disable_index_predict && pageState == 0) || ay || F) {
            return
        }
        var bw = this;
        var bu = this.value;
        P = true;
        setTimeout(function () {
            if (bw.value && bw.value != bu) {
                w({
                    env: new W().clone({
                        wd: $.trim(bw.value)
                    }),
                    force: false,
                    use_cache: true,
                    no_predict: true,
                    shouldShow: bds.comm.supportis,
                    pstg: 2
                })
            }
        }, 0)
    })
}(function (A) {
    var baidu = window.baidu;
    var LOG_CLASS = ["TITLE", "LINK", "IMG", "BTN", "INPUT", "OTHERS"];
    var C_LOG_CLASS = ["btn"];
    var contentLeft, contentRight, contentTop;

    function clickDebug(e) {}
    window.initResultClickLog = function () {
        contentLeft = $("#content_left").get(0);
        contentRight = $("#con-ar").get(0);
        contentTop = $("#con-at").get(0);
        if (A.has) {
            var aladdin_tables = $(".result-op").get(),
                srcid;
            $.each(aladdin_tables, function (i, v) {
                if (srcid = v.getAttribute("srcid")) {
                    A.ids.push([v.id, srcid])
                }
            })
        }
        bindP5()
    };
    $(document).ready(function () {
        bindLogEvent()
    });

    function bindP5() {
        var item, index = (bds.comm.pageNum - 1) * bds.comm.pageSize + 1,
            leftItems = (contentLeft && contentLeft.children) || [],
            rightItems = (contentRight && contentRight.children) || [],
            topItems = (contentTop && contentTop.children) || [],
            isResult = function (o) {
                return (o.nodeType == 1 && o.className && /\bresult(\-op)?\b/.test(o.className))
            },
            isFrame = function (o) {
                return (o.nodeType == 1 && o.className && /\bc\-frame\b/.test(o.className))
            },
            setClickData = function (wrap, data) {
                var sData = wrap.getAttribute("data-click") || "{}";
                try {
                    var oData = eval("(" + sData + ")");
                    sData = $.stringify($.extend(oData, data));
                    wrap.setAttribute("data-click", sData)
                } catch (e) {
                    clickDebug(e)
                }
            },
            bindP5ClickData = function (items) {
                for (var i = 0, l = items.length; i < l; i++) {
                    item = items[i];
                    if (isResult(item)) {
                        setClickData(item, {
                            p5: index++
                        })
                    } else {
                        if (isFrame(item)) {
                            try {
                                var frameItems = item.children[0].children;
                                for (var j = 0, lj = frameItems.length; j < lj; j++) {
                                    var frameItem = frameItems[j];
                                    if (isResult(frameItem)) {
                                        setClickData(frameItem, {
                                            p5: index++
                                        })
                                    }
                                }
                            } catch (e) {
                                clickDebug(e)
                            }
                        }
                    }
                }
                index = (bds.comm.pageNum - 1) * bds.comm.pageSize + 1
            };
        bindP5ClickData(leftItems);
        bindP5ClickData(rightItems);
        bindP5ClickData(topItems)
    }

    function getXPath(node, wrap, path) {
        path = path || [];
        wrap = wrap || document;
        if (node === wrap) {
            return path
        }
        if (node.parentNode !== wrap) {
            path = getXPath(node.parentNode, wrap, path)
        }
        if (node.previousSibling) {
            var count = 1;
            var sibling = node.previousSibling;
            do {
                if (sibling.nodeType == 1 && sibling.nodeName == node.nodeName) {
                    count++
                }
                sibling = sibling.previousSibling
            } while (sibling)
        }
        if (node.nodeType == 1) {
            path.push(node.nodeName.toLowerCase() + (count > 1 ? count : ""))
        }
        return path
    }

    function bindLogEvent() {
        $body = $("body");
        $body.on("mousedown", function (e) {
            var e = window.event || e,
                t = e.srcElement || e.target,
                $t = $(t);
            try {
                var $parent = $t,
                    fm, wrap;
                while ($parent.length && !($parent.hasClass("result") || $parent.hasClass("result-op") || $parent.hasClass("xpath-log"))) {
                    $parent = $parent.parent()
                }
                if (!$parent.length) {
                    return
                }
                if ($parent.hasClass("result-op")) {
                    fm = "alop"
                } else {
                    if ($parent.hasClass("result")) {
                        fm = "as"
                    }
                }
                wrap = $parent.get(0);
                var xpath = getXPath(t, wrap);
                if (check(xpath, t, wrap)) {
                    log(xpath, t, wrap, fm)
                }
            } catch (e) {
                clickDebug(e)
            }
        })
    }

    function getType(xpath, t, wrap) {
        var node = t,
            cs = LOG_CLASS,
            cl = cs.length,
            clc = C_LOG_CLASS,
            clcl = clc.length,
            xstr = xpath.join(" "),
            i = 0;
        while (node !== wrap) {
            for (i = 0; i < cl; i++) {
                if ($(node).hasClass("OP_LOG_" + cs[i])) {
                    return cs[i].toLowerCase()
                }
            }
            for (i = 0; i < clcl; i++) {
                if ($(node).hasClass("c-" + clc[i])) {
                    return clc[i]
                }
            }
            node = node.parentNode
        }
        if (/\bh3\d*\b/.test(xstr)) {
            return "title"
        }
        if (/\ba\d*\b/.test(xstr)) {
            if (/\bimg\d*\b/.test(xstr)) {
                return "img"
            }
            return "link"
        }
        if (/\b(input|select|button|textarea|datalist)\d*\b/.test(xstr)) {
            return "input"
        }
        if (/\blabel\d*\b/.test(xstr) && t.getElementsByTagName("input").length > 0) {
            return "input"
        }
        return ""
    }

    function check(xpath, t, wrap) {
        if (A.LOGTOOL) {
            A.LOGTOOL.call(t, xpath, t, wrap);
            return false
        }
        return true
    }

    function log(xpath, t, wrap, fm) {
        if (t.getAttribute("data-nolog") != null) {
            return
        }
        var type = getType(xpath, t, wrap);
        if (!type) {
            return false
        }
        if (type == "title" && !/\ba\d*\b/.test(xpath)) {
            return false
        }
        var nourl = "http://nourl.ubs.baidu.com";
        var mu = wrap.getAttribute("mu") || nourl;
        if (mu == nourl) {
            var h3 = wrap.getElementsByTagName("h3");
            if (h3 && h3[0]) {
                var a = h3[0].getElementsByTagName("a");
                mu = (a && a[0]) ? a[0].href : mu
            }
        }
        var l = xpath.length,
            url, p = t,
            srcid = wrap.getAttribute("srcid");
        var title = "";
        var tag = t.nodeType == 1 ? t.tagName.toLowerCase() : "";
        if (type == "input") {
            if (/input|textarea/.test(tag)) {
                title = t.value;
                if (t.type && t.type.toLowerCase() == "password") {
                    title = ""
                }
            } else {
                if (/select|datalist/.test(tag)) {
                    if (t.children.length > 0) {
                        var index = t.selectedIndex || 0;
                        title = t.children[index > -1 ? index : 0].innerHTML
                    }
                } else {
                    title = t.innerHTML || t.value || ""
                }
            }
        } else {
            if (tag == "img") {
                title = t.title
            }
            if (!title) {
                while (l > 0) {
                    l--;
                    if (/^a\d*\b/.test(xpath[l])) {
                        url = p.href;
                        title = p.innerHTML;
                        if (p.getAttribute("data-nolog") != null) {
                            return
                        }
                        break
                    } else {
                        if (p.className && (/OP_LOG_/.test(p.className))) {
                            title = p.innerHTML;
                            break
                        }
                        p = p.parentNode
                    }
                }
            }
        }
        title = $.trim(title);
        if (!url || url.slice(-1) === "#" || !(/^http/.test(url))) {
            url = mu
        }
        var data = {
            rsv_xpath: xpath.join("-") + "(" + type + ")",
            title: title,
            url: url,
            rsv_height: wrap.offsetHeight,
            rsv_width: wrap.offsetWidth,
            rsv_tpl: wrap.getAttribute("tpl")
        };
        var rewritedatakey = {
            url: 1,
            title: 1
        };
        if (wrap.id && wrap.id.match(/^\d+$/)) {
            data.p1 = wrap.id
        }
        if (srcid) {
            data.rsv_srcid = srcid
        }
        var ext_data, attr, is_fm_null;
        p = t;
        do {
            if (p.getAttribute("data-nolog") != null) {
                return
            }
            if (ext_data = p.getAttribute("data-click")) {
                try {
                    ext_data = (new Function("return " + ext_data))();
                    for (attr in ext_data) {
                        if (attr == "fm" && ext_data.fm === null) {
                            is_fm_null = true
                        }
                        if (ext_data.hasOwnProperty(attr) && ((typeof data[attr] == "undefined") || rewritedatakey[attr])) {
                            data[attr] = ext_data[attr]
                        }
                    }
                } catch (e) {
                    clickDebug(e)
                }
            }
            p = p.parentNode
        } while (p && p !== wrap.parentNode);
        for (var i in data) {
            if (data[i] === null) {
                delete data[i]
            }
        }
        if (type == "title") {
            if ("mu" in data) {
                delete data.mu
            }
        } else {
            if (!data.mu) {
                data.mu = mu
            }
        }
        if (is_fm_null) {
            if ("fm" in data) {
                delete data.fm
            }
        } else {
            if (type == "input") {
                data.fm = "beha";
                data.url = nourl
            }
            if (!data.fm) {
                data.fm = fm
            }
            if (!data.fm) {
                return
            }
        }
        window.c(data)
    }
})(window.bds.aladdin);
for (ai in al_arr) {
    al_arr[ai]()
}
$(document).ready(function () {
    var a;
    $(document).on("click", ".t>a,.op-se-listen-recommend", function (i) {
        i = window.event || i;
        var d = $("#wrapper_wrapper"),
            b = $(this).closest(".c-container"),
            g = b.length ? b.find(".c-recommend").eq(0) : [],
            f = b.length ? b.find(".wnor-fanli-wrap") : [];
        if (!i.ctrlKey && (g.length && g.css("display") === "none" || f.length && f.css("display") === "none")) {
            a = setTimeout(function () {
                d.find(".c-recommend").hide();
                g.show();
                d.find(".wnor-fanli-wrap").hide();
                f.show()
            }, 150)
        }
    });
    $(window).on("swap_begin", function () {
        this.clearTimeout(a)
    })
});
window.onunload = function () {};

function addEV(d, b, a) {
    if (window.attachEvent) {
        d.attachEvent("on" + b, a)
    } else {
        if (window.addEventListener) {
            d.addEventListener(b, a, false)
        }
    }
}
bds.se.openime = function (a) {
    if (!window.bdime) {
        $.ajax({
            cache: true,
            dataType: "script",
            url: "https://ss1.bdstatic.com/5eN1bjq8AAUYm2zgoY3K/r/www/cache/static/protocol/https/plugins/ime_fc2e9dc6.js",
            success: function () {
                if (a) {
                    openIme.set("py", true)
                }
            }
        })
    } else {
        openIme.set("py", true)
    }
};
(function () {
    if (/\bbdime=[12]/.test(document.cookie)) {} else {
        $(window).one("swap_end", function () {
            var a = function () {
                var b = "";
                if (bds.comm.newad && bds.comm.newad == 1) {
                    b = $("<span class=\"shouji\"><a href=\"http://www.nuomi.com/?cid=bdsywzl\" target=\"_blank\" onmousedown=\"return ns_c({'fm':'behs','pj_name':'bdyx_right_link','tab':'bdnuomi'})\">百度糯米718，满百返百大放价！</a></span>");
                    if (b) {
                        if (bds.comm.containerSize === "s") {
                            b.hide()
                        }
                        b.insertAfter("#mHolder");
                        $(window).on("container_resize", function (f, d) {
                            var g = $("#mHolder").nextAll(".shouji").eq(0);
                            if (g.length) {
                                if (g.css("display") === "none" && d === "l") {
                                    g.show()
                                }
                                if (d === "s") {
                                    g.hide()
                                }
                            }
                        })
                    }
                }
            }
        })
    }
})();
(function () {
    var b = function (g) {
        var i = bds.comm.personalData;
        var f;
        if (!i || !isFinite(+g) || !(f = String(i.duRobotState.value))) {
            return false
        }
        var d = f.charAt(+g);
        if (+g !== 0 && !b(0)) {
            return false
        }
        if (!d.length) {
            return true
        }
        return +d == 1
    };
    var a = $(window);
    a.on("load", function () {
        if (window.pageState === 0) {
            var d = navigator.userAgent;
            if (!b(0) || !b(1)) {
                return
            }
            var i = d.match(/MSIE\s*(\d+)/i);
            if (!bds.comm.user || (i && (!document.documentMode || document.documentMode <= 8 || i[1] <= 8))) {
                return
            }
            var f = $("#s_main");
            if (!f.size() || !f.children().length) {
                f = $('<div class="bd_bear_home_nocard"></div>').appendTo(document.body)
            } else {
                if (f.css("position") == "static") {
                    f.css("position", "relative")
                }
            }
            var g = $('<div class="bd_bear_home_weaker"></div>').appendTo(f);
            g.show().get(0).className = "bd_bear_home_show";
            g.append($('<a class="bd_bear_home_bear_head" href="http://xiaodu.baidu.com/?from=home_bg" target="_blank"></a>'));
            a.one("index_off", function () {
                g && g.remove && g.remove()
            })
        }
    })
})();
if (bds && bds.comm && !bds.comm.containerSize) {
    bds.comm.containerSize = "s"
}
bds.util.setContainerWidth = function () {
    var f = $("#container"),
        a = $("#wrapper"),
        b = bds.util.getWinWidth();
    var d = bds.comm.containerSize;
    if (b < 1217) {
        f.removeClass("container_l container_xl").addClass("container_s");
        a.removeClass("wrapper_l").addClass("wrapper_s");
        bds.comm.containerSize = "s"
    } else {
        if (b >= 1217) {
            f.removeClass("container_s container_xl").addClass("container_l");
            a.removeClass("wrapper_s").addClass("wrapper_l");
            bds.comm.containerSize = "l"
        } else {
            return
        }
    }
    if (d != bds.comm.containerSize) {
        $(window).trigger("container_resize", bds.comm.containerSize)
    }
};
bds.util.setFootStyle = function () {
    this.init();
    this.bindEvent()
};
$.extend(bds.util.setFootStyle.prototype, {
    ie6: bds.comm.upn && bds.comm.upn.browser === "msie" && bds.comm.upn.ie == 6,
    init: function () {
        var a = $("#foot");
        a.addClass("foot_fixed_bottom");
        if (this.ie6) {
            var b = $(window).height() + $(window).scrollTop() - a.outerHeight(true);
            a.css("top", b + "px")
        }
    },
    setFixedIe6: function () {
        var a = $("#foot");
        var b = $(window).height() + $(window).scrollTop() - a.outerHeight(true);
        a.css("top", b + "px")
    },
    bindEvent: function () {
        var a = this;
        if (a.ie6) {
            $(window).on("resize.setFootStyle, scroll.setFootStyle", function () {
                a.setFixedIe6()
            })
        }
    }
});
var bds = bds || {};
bds.se = bds.se || {};
bds.se.tip = bds.se.tip || {};
bds.comm.tipZIndex = 220;
bds.comm.tips = [];
bds.se.tip = function (a) {
    this.init = function () {
        this.op = {
            target: a.target || {},
            mode: a.mode || "over",
            title: a.title || null,
            content: a.content || null,
            uncontrolled: (a.uncontrolled) ? true : false,
            arrow: {
                has: 1,
                offset: 10,
                r: false,
                c: false
            },
            close: a.close || 0,
            align: a.align || "left",
            offset: {
                x: 10,
                y: 20
            },
            arrowSize: 16
        };
        if (a.arrow) {
            this.op.arrow.has = (a.arrow.has == 0) ? 0 : 1;
            this.op.arrow.offset = (a.arrow.offset >= 0) ? a.arrow.offset : 10;
            this.op.arrow.r = a.arrow.r;
            this.op.arrow.c = a.arrow.c
        }
        if (a.offset) {
            this.op.offset.x = (a.offset.x || a.offset.x == 0) ? a.offset.x : 10;
            this.op.offset.y = (a.offset.y || a.offset.y == 0) ? a.offset.y : 20
        }
        this.ext = a.ext || {};
        this.dom = $("<div>", {
            "class": "c-tip-con"
        });
        this.visible = false;
        this.rendered = false;
        this.isAuto = (this.op.align === "auto") ? true : false;
        this.bindEvent()
    };
    this.render = function () {
        if (this.op.close) {
            this.enableCloseIcon()
        }
        if (this.op.title) {
            this.setTitle(this.op.title)
        }
        if (this.op.content) {
            this.setContent(this.op.content)
        }
        if (this.op.arrow.has) {
            this.enableArrow()
        }
        $("#c-tips-container").append(this.dom)
    };
    this.bindEvent = function () {
        this.delay = {
            overIcon: null,
            outIcon: null,
            overDom: null,
            outDom: null
        };
        if (this.op.mode == "over") {
            var b = this;
            $(b.op.target).on("mouseenter", function () {
                window.clearTimeout(b.delay.outIcon);
                window.clearTimeout(b.delay.outDom);
                b.delay.overIcon = setTimeout(function () {
                    b.show()
                }, 200)
            });
            b.dom.on("mouseenter", function () {
                window.clearTimeout(b.delay.outIcon);
                window.clearTimeout(b.delay.outDom);
                b.delay.overDom = setTimeout(function () {
                    b.show()
                }, 200)
            });
            $(b.op.target).on("mouseleave", function () {
                window.clearTimeout(b.delay.overIcon);
                window.clearTimeout(b.delay.overDom);
                b.delay.outIcon = setTimeout(function () {
                    b.hide()
                }, 200)
            });
            b.dom.on("mouseleave", function () {
                window.clearTimeout(b.delay.overIcon);
                window.clearTimeout(b.delay.overDom);
                b.delay.outIcon = setTimeout(function () {
                    b.hide()
                }, 200)
            })
        } else {
            if (this.op.mode == "none") {
                var b = this;
                b.show()
            }
        }
    };
    this.enableArrow = function () {
        if (this.op.arrow.r) {
            var b = $("<div>", {
                "class": "c-tip-arrow"
            }).html("<em></em><ins class='c-tip-arrow-r'></ins>").appendTo(this.dom)
        } else {
            if (this.op.arrow.c) {
                var b = $("<div>", {
                    "class": "c-tip-arrow"
                }).html("<em></em><ins class='c-tip-arrow-c'></ins>").appendTo(this.dom)
            } else {
                var b = $("<div>", {
                    "class": "c-tip-arrow"
                }).html("<em></em><ins></ins>").appendTo(this.dom)
            }
        }
        this.arrow = b
    };
    this.enableCloseIcon = function () {
        var d = this;
        var b = $("<div>", {
            "class": "c-tip-close"
        }).html("<i class='c-icon c-icon-close'></i>").appendTo(this.dom).click(function () {
            d.hide()
        });
        this.close = b
    };
    this.setTitle = function (b) {
        if (b.nodeType) {
            var d = $("<h3>", {
                "class": "c-tip-title"
            }).append(b).appendTo(this.dom)
        } else {
            var d = $("<h3>", {
                "class": "c-tip-title"
            }).html(b).appendTo(this.dom)
        }
        this.title = d
    };
    this.setContent = function (d) {
        var b = $("<div>").html(d).appendTo(this.dom);
        this.content = b
    };
    this.setArrow = function (b) {
        if (b) {
            if (b.offset >= 0) {
                this.op.arrow.offset = b.offset
            }
        }
        if (this.op.arrow.has && this.arrow) {
            switch (this.op.align) {
            case "left":
                this.arrow.css({
                    left: this.op.arrow.offset + "px"
                });
                break;
            case "right":
                this.arrow.css({
                    right: this.op.arrow.offset + 16 + "px"
                });
                break;
            default:
                break
            }
        }
    };
    this.setOffset = function (b) {
        if (b) {
            this.op.offset.x = (b.x || b.x == 0) ? b.x : this.op.offset.x;
            this.op.offset.y = (b.y || b.y == 0) ? b.y : this.op.offset.y
        }
        switch (this.op.align) {
        case "left":
            var d = $(this.getTarget()).offset();
            this.getDom().css({
                top: d.top + this.op.offset.y + "px",
                left: d.left - this.op.offset.x + "px"
            });
            break;
        case "right":
            var d = $(this.getTarget()).offset();
            this.getDom().css({
                top: d.top + this.op.offset.y + "px",
                left: d.left + this.op.offset.x + $(this.getTarget()).width() - this.getDom().width() + "px"
            });
            break;
        default:
            break
        }
    };
    this.autoOffset = function (o) {
        var d = {
                w: this.dom.outerWidth(),
                h: this.dom.outerHeight()
            },
            m = $(this.getTarget()),
            n = m.offset(),
            i = {
                w: m.outerWidth(),
                h: m.outerHeight()
            },
            l = $(window),
            f = l.scrollTop(),
            k = {
                w: l.width(),
                h: l.height()
            },
            b = {
                left: 0,
                top: 0
            },
            j = {},
            g;
        if ((k.h + f - i.h - n.top) > d.h) {
            b.top = i.h + n.top + this.op.arrowSize / 2;
            if (this.arrow) {
                this.arrow.removeClass("c-tip-arrow-down")
            }
        } else {
            if (n.top - f > d.h) {
                b.top = n.top - d.h - this.op.arrowSize / 2;
                if (this.arrow) {
                    this.arrow.addClass("c-tip-arrow-down")
                }
            } else {
                b.top = i.h + n.top + this.op.arrowSize / 2;
                if (this.arrow) {
                    this.arrow.removeClass("c-tip-arrow-down")
                }
            }
        }
        g = n.left + i.w / 2 - this.op.arrow.offset - this.op.arrowSize / 2;
        b.left = g;
        if (b.left > 0 && (b.left + d.w) > k.w) {
            b.left = n.left + i.w / 2 - d.w + this.op.arrow.offset + this.op.arrowSize / 2;
            j.right = this.op.arrow.offset + this.op.arrowSize;
            j.left = "auto";
            if (b.left < 0) {
                b.left = g;
                j.left = this.op.arrow.offset;
                j.right = "auto"
            }
        } else {
            j.left = this.op.arrow.offset;
            j.right = "auto"
        }
        this.dom.css(b);
        if (this.arrow) {
            this.arrow.css(j)
        }
    };
    this.enable = function () {};
    this.disable = function () {};
    this.destroy = function () {};
    this.show = function () {
        if (!this.visible) {
            this.onShow();
            if (!this.rendered) {
                bds.comm.tips.push(this);
                this.render();
                this.rendered = true
            }
            if (this.isAuto) {
                this.autoOffset()
            } else {
                this.setOffset();
                this.setArrow()
            }
            this.dom.css({
                "z-index": bds.comm.tipZIndex
            });
            bds.comm.tipZIndex++;
            this.dom.css({
                display: "block"
            });
            this.visible = true
        }
    };
    this.hide = function () {
        if (this.visible) {
            this.dom.css({
                display: "none"
            });
            this.onHide();
            this.visible = false
        }
    };
    this.onShow = a.onShow || function () {};
    this.onHide = a.onHide || function () {};
    this.getTarget = function () {
        return this.op.target
    };
    this.getDom = function () {
        return this.dom
    };
    this.init()
};
bds.event.trigger("se.api_tip_ready");
$(document).mousedown(function (b) {
    b = b || window.event;
    var a = b.target || b.srcElement;
    while (a && a.tagName && a != document.body && a.tagName.toLowerCase() != "html") {
        if (a.className == "c-tip-con") {
            break
        }
        a = a.parentNode
    }
    if (a && a.className != "c-tip-con") {
        $(bds.comm.tips).each(function () {
            if (!this.op.uncontrolled) {
                if (this.op.close) {
                    this.hide()
                }
            }
        })
    }
});
var sethfPos = sethfPos || 0;
(function () {
    var q = "//www.baidu.com/",
        n = navigator.userAgent.indexOf("MSIE") != -1 && !window.opera,
        r = Math.random() * 100,
        w = "百度一下，你就知道",
        d = "";
    window.fa = function (z) {
        try {
            if (window.sidebar) {
                window.sidebar.addPanel(w, q, "")
            } else {
                if (window.opera && window.print) {
                    z.setAttribute("rel", "sidebar");
                    z.setAttribute("href", q);
                    z.setAttribute("title", w);
                    z.click()
                } else {
                    window.external.AddFavorite(q, w)
                }
            }
        } catch (y) {}
    };

    function f(z) {
        if (z) {
            var y = z.parentNode;
            if (y) {
                y.style.marginBottom = "20px";
                y.style.marginTop = "2px"
            }
        }
    }
    if (n) {
        try {
            var x = /se /gi.test(navigator.userAgent);
            var o = /AppleWebKit/gi.test(navigator.userAgent) && /theworld/gi.test(navigator.userAgent);
            var l = /theworld/gi.test(navigator.userAgent);
            var p = /360se/gi.test(navigator.userAgent);
            var a = /360chrome/gi.test(navigator.userAgent);
            var g = /greenbrowser/gi.test(navigator.userAgent);
            var t = /qqbrowser/gi.test(navigator.userAgent);
            var m = /tencenttraveler/gi.test(navigator.userAgent);
            var k = /maxthon/gi.test(navigator.userAgent);
            var u = /krbrowser/gi.test(navigator.userAgent);
            var b = false;
            try {
                b = +external.twGetVersion(external.twGetSecurityID(window)).replace(/\./g, "") > 1013
            } catch (s) {}
            if (x || b || o || l || p || a || g || t || m || k || u) {
                var j = sethfPos ? document.getElementById("set_f") : document.getElementById("setf");
                if (j) {
                    if (sethfPos) {
                        f(j);
                        d = "favorites"
                    }
                }
            } else {
                var i = sethfPos ? document.getElementById("set_f") : document.getElementById("setf");
                if (i) {
                    if (sethfPos) {
                        f(i);
                        d = "home"
                    }
                }
                i.setAttribute("onClick", "h(this)");
                i.setAttribute("onmousedown", "return ns_c({'fm':'behs','tab':'homepage','pos':0})");
                i.href = "/";
                i.target = "_self";
                i.id = "seth"
            }
        } catch (s) {}
    } else {
        var j = sethfPos ? document.getElementById("set_f") : document.getElementById("setf");
        if (sethfPos) {
            f(j);
            d = "favorites"
        }
    }
    if (d && sethfPos) {
        ns_c({
            fm: "sethf_show",
            tab: d
        })
    }
})();

function user_c(i) {
    var g = "",
        f = "",
        a = "",
        b = "",
        k = encodeURIComponent(window.document.location.href),
        d = window["BD_PS_C" + (new Date()).getTime()] = new Image(),
        j = bds && bds.util && bds.util.domain ? bds.util.domain.get("http://nsclick.baidu.com") : "http://nsclick.baidu.com";
    for (v in i) {
        switch (v) {
        case "title":
            a = encodeURIComponent(i[v].replace(/<[^<>]+>/g, ""));
            break;
        case "url":
            a = encodeURIComponent(i[v]);
            break;
        default:
            a = i[v]
        }
        g += v + "=" + a + "&"
    }
    b = "&mu=" + k;
    d.src = j + "/v.gif?pid=201&pj=psuser&" + g + "path=" + k + "&wd=" + f + "&t=" + new Date().getTime();
    return true
}

function initPassV3() {
    var a = bds.comm.passnew ? 3 : 2;
    bds.se.passv3 = passport.pop.init({
        apiOpt: {
            loginType: 1,
            product: "mn",
            u: window.document.location.href,
            safeFlag: 0,
            qrcode: a,
            staticPage: location.protocol + "//www.baidu.com/cache/user/html/v3Jump.html"
        },
        cache: false,
        tangram: true,
        authsite: ["qzone", "tsina"],
        authsiteCfg: {
            act: "implicit",
            display: "popup",
            jumpUrl: location.protocol + "//www.baidu.com/cache/user/html/xd.html",
            onBindSuccess: function (d, f) {
                var b = decodeURIComponent(f.passport_uname || f.displayname);
                bds.se.login.success(b);
                return false
            }
        },
        onLoginSuccess: function (d) {
            d.returnValue = false;
            var b = d.rsp.data.userName || d.rsp.data.mail || d.rsp.data.phoneNumber;
            bds.se.login.success(b)
        },
        onSubmitStart: function (b) {},
        onSubmitedErr: function (b) {},
        onSystemErr: function (b) {},
        onShow: function () {},
        onHide: function () {
            bds.se.login.setSubpro("");
            bds.se.login.setMakeText("")
        },
        onDestroy: function () {}
    })
}
bds.se.loginCallbackFunc = null;
bds.se.login = (function () {
    var f = "",
        g = false,
        a = "";
    var l = function () {
            this.setUserInfo();
            var m = this;
            bds.comm.loginAction.push(function (n, o) {
                m.setUserInfo(o)
            })
        },
        d = function (n) {
            var m = n || bds.comm.user;
            if (!m) {
                return
            }
            $("#lb").replaceWith('<a href="http://i.baidu.com" class="username">' + escapeHTML(bds.comm.username) + '<i class="c-icon"></i></a>')
        },
        i = function (n, m) {
            if (!g) {
                $.getScript(location.protocol + "//passport.baidu.com/passApi/js/uni_login_wrapper.js?cdnversion=" + new Date().getTime(), function () {
                    initPassV3();
                    g = true;
                    bds.se.passv3.setSubpro(f);
                    bds.se.passv3.setMakeText(a);
                    bds.se.loginCallbackFunc = n || function () {
                        window.document.location.reload(true)
                    };
                    bds.se.passv3.show()
                })
            } else {
                bds.se.passv3.setSubpro(f);
                bds.se.passv3.setMakeText(a);
                bds.se.loginCallbackFunc = n || function () {
                    window.document.location.reload(true)
                };
                bds.se.passv3.show()
            }
        },
        k = function (m) {
            if (!bds.comm) {
                return
            }
            bds.comm.user = m;
            bds.comm.username = m;
            window.bdUser = m;
            bds.se.passv3.hide();
            bds.se.loginCallbackFunc.call(window, 1, m);
            for (var n = 0; n < bds.comm.loginAction.length; n++) {
                bds.comm.loginAction[n].call(window, 1, m)
            }
        },
        b = function (m) {
            f = m
        },
        j = function (m) {
            a = m
        };
    return {
        setUserInfo: d,
        open: i,
        success: k,
        setSubpro: b,
        setMakeText: j
    };
    l()
})();
window._invoke_login = function (b, a) {
    bds.se.login.open(b, a)
};

function isp_hijack(g) {
    var i = document.getElementById("wrapper"),
        b, a = false,
        d, f;
    if (!bds.comm.query) {
        a = true
    }
    if (g.stat == 1) {
        b = document.createElement("div");
        b.innerHTML = '<div style="zoom:1;_margin-left:1024px;"><div style="position:relative;_float:left;_margin-left:-1024px;"><div style="width:100%;min-width:1024px;"><div style="border:2px solid #fd9162;zoom:1;overflow:hidden;padding:0 0 6px 12px;"><div style="position:relative;width:100%;*overflow:auto;padding-top:10px;"><div style="height:18px;margin-bottom:6px;"><i class="c-icon" style="width:18px;height:18px;background-position:-168px -72px;"></i><strong style="display:inline-block;margin-left:8px;font-size:14px;color:#666;">百度提示您：</strong></div><span style="display:block;color:#333;text-indent:26px;font-size:13px;">我们发现当前您可能受到异常广告弹窗的影响，通常这是受第三方恶意劫持导致。使用 <a href="http://shadu.baidu.com/landingpage/competing.html?from=10064" target="_blank" style="color:#0000D0;text-decoration:underline">防恶意广告专版杀毒软件</a>，可有效改善您的上网体验，免受恶意广告的困扰。</span><a id="isp-close-btn" style="display:inline-block;width:9px;height:9px;position:absolute;top:6px;right:6px;background:url(../global/img/wsCloseBtn2.png) no-repeat;" href="javascript:void(0);"></a></div></div></div></div></div>';
        if (!a) {
            i.style.position = "relative";
            document.getElementById("u").style.top = 0;
            b.style.margin = "-6px 0 8px 0";
            document.body.insertBefore(b, i)
        } else {
            i.insertBefore(b, i.children[0])
        }
        d = document.getElementById("isp-close-btn");
        f = d.parentNode.getElementsByTagName("a")[0];
        d.onclick = function () {
            if (a) {
                i.removeChild(b)
            } else {
                document.body.removeChild(b);
                i.style.position = "";
                document.getElementById("u").style.top = "4px"
            }
        };
        d.onmousedown = function () {
            ns_c({
                fm: "behs",
                tab: "tj_notice",
                cont: "jcbro",
                action: "close",
                area: "topbar"
            })
        };
        f.onmousedown = function () {
            ns_c({
                fm: "behs",
                tab: "tj_notice",
                cont: "jcbro",
                action: "click",
                area: "topbar"
            })
        };
        ns_c({
            fm: "behs",
            tab: "tj_notice",
            cont: "jcbro",
            action: "show",
            area: "topbar"
        })
    }
}(function () {
    function a() {
        var d, f = "http://isphijack.baidu.com/index.php?cb=isp_hijack",
            j = [];
        if (top.location != self.location) {
            try {
                var b = top.document.getElementsByTagName("frame");
                var l = top.document.getElementsByTagName("iframe");
                for (var g = 0; g < b.length; g++) {
                    j.push(b[g].getAttribute("src"))
                }
                for (var g = 0; g < l.length; g++) {
                    j.push(l[g].getAttribute("src"))
                }
            } catch (k) {}
            ns_c({
                fm: "frm",
                top: encodeURIComponent(top.location.href),
                furls: encodeURIComponent(j.join("|"))
            });
            if (j) {
                d = document.createElement("script");
                d.src = f + "&urls=" + encodeURIComponent(j.join("|")) + "&t=" + (+new Date());
                document.body.appendChild(d)
            }
        }
    }
    $(a)
})();
try {
    if (window.console && window.console.log) {
        console.log("一张网页，要经历怎样的过程，才能抵达用户面前？\n一位新人，要经历怎样的成长，才能站在技术之巅？\n探寻这里的秘密；\n体验这里的挑战；\n成为这里的主人；\n加入百度，加入网页搜索，你，可以影响世界。\n");
        console.log("请将简历发送至 %c ps_recruiter@baidu.com（ 邮件标题请以“姓名-应聘XX职位-来自console”命名）", "color:red");
        console.log("职位介绍：http://dwz.cn/hr2013")
    }
} catch (e) {}
var bds = bds || {};
bds.se = bds.se || {};
bds.se.tool = bds.se.tool || {};
bds.comm.host = {
    bfe: "//www.baidu.com/tools",
    favo: bds.util.domain && bds.util.domain.get ? bds.util.domain.get("http://i.baidu.com") : "http://i.baidu.com",
    share: bds.util.domain && bds.util.domain.get ? bds.util.domain.get("http://bdimg.share.baidu.com/static/api/js/custom/resultshare.js") : "http://bdimg.share.baidu.com/static/api/js/custom/resultshare.js",
    report: "http://jubao.baidu.com",
    koubei: "http://koubei.baidu.com"
};
bds.se.tool = function (item) {
    this.init = function () {
        this.render()
    };
    this.render = function () {
        var ops = eval("(" + item.getAttribute("data-tools") + ")");
        var toolsDom = $("<div>", {
            "class": "c-tip-menu"
        });
        var toolsList = $("<ul>");
        var toolsFavo = $("<li>");
        var toolsFavoLink = $("<a>").html("收藏");
        toolsFavoLink.on("mousedown", function () {
            bds.se.tool.favo(ops, item.getAttribute("id"));
            ns_c({
                fm: "tools",
                tab: "favo"
            })
        });
        toolsFavoLink.on("mouseover", function () {
            $(this).css("background-color", "#ebebeb")
        });
        toolsFavoLink.on("mouseout", function () {
            $(this).css("background-color", "#fff")
        });
        toolsFavo.append(toolsFavoLink);
        toolsList.append(toolsFavo);
        var toolsShare = $("<li>");
        var toolsShareLink = $("<a>").html("分享");
        toolsShareLink.on("mousedown", function () {
            bds.se.tool.share(ops, item);
            ns_c({
                fm: "tools",
                tab: "share"
            })
        });
        toolsShareLink.on("mouseover", function () {
            $(this).css("background-color", "#ebebeb")
        });
        toolsShareLink.on("mouseout", function () {
            $(this).css("background-color", "#fff")
        });
        toolsShare.append(toolsShareLink);
        toolsList.append(toolsShare);
        var fromType;
        if ($(item).parent().find(".c-pingjia a").attr("data-from")) {
            fromType = $(item).parent().find(".c-pingjia a").attr("data-from")
        } else {
            fromType = "ps_pc"
        }
        var toolsKoubei = $("<li>").html("<a target=\"_blank\" onmousedown=\"ns_c({'fm': 'tools','tab':'koubei'})\" href=\"" + bds.comm.host.bfe + "?url=" + encodeURIComponent(ops.url) + "&jump=" + encodeURIComponent(bds.comm.host.koubei + "/p/sentry?title=" + encodeURIComponent(ops.title) + "&q=" + encodeURIComponent(bds.comm.query) + "&from=" + encodeURIComponent(fromType)) + '&key=surl">评价</a>');
        toolsList.append(toolsKoubei);
        var officalLogo = $($(item).closest(".c-container").find("h3.t").children()[1]),
            vLogo = $(item).parent().find(".vstar"),
            isOffical = 0,
            vLevel = 0;
        if (officalLogo && officalLogo.html() == "官网") {
            isOffical = 1
        }
        if (vLogo && vLogo.attr("hint-data")) {
            vLevel = $.parseJSON(vLogo.attr("hint-data")).hint[0].vlevel
        }
        var toolsReport = $("<li>").html("<a target=\"_blank\" onmousedown=\"ns_c({'fm': 'tools','tab':'report'})\" href=\"" + bds.comm.host.bfe + "?url=" + encodeURIComponent(ops.url) + "&jump=" + encodeURIComponent(bds.comm.host.report + "/jubao/accu/?title=" + encodeURIComponent(ops.title) + "&q=" + encodeURIComponent(bds.comm.query) + "&has_gw=" + isOffical + "&has_v=" + vLevel) + '&key=surl">举报</a>');
        toolsList.append(toolsReport);
        toolsDom.append(toolsList);
        var tTip = new bds.se.tip({
            target: $(".c-icon", item)[0],
            mode: "none",
            align: "left",
            offset: {
                x: 33
            },
            arrow: {
                has: 1,
                offset: 30
            },
            content: toolsDom,
            ext: {
                category: "tools"
            }
        });
        tTip.onShow = function () {
            ns_c({
                fm: "tools",
                tab: "show"
            })
        }
    };
    this.init()
};
bds.se.tool.share = function (b, a) {
    this.op = b || {};
    this.init = (function (f, d) {
        $.getScript(bds.comm.host.share, function () {
            $(bds.comm.tips).each(function () {
                if (!this.op.uncontrolled) {
                    this.hide()
                }
            });
            var g = new bds.se.tip({
                target: $(".c-icon", d)[0],
                mode: "none",
                offset: {
                    x: 33
                },
                arrow: {
                    has: 0
                },
                close: 1,
                content: '<div class="c-tools-share" style="width:200px;"></div>'
            });
            var i = $(".c-tools-share", g.dom.get(0))[0];
            __bdshare.render({
                boxEle: i,
                url: f.url,
                txt: f.title + " -- 分享自百度搜索"
            })
        })
    })(this.op, a)
};
bds.se.tool.favo = function (d, b) {
    this.op = d || {};
    this.init = function (k, j) {
        if (k) {
            var f = document.createElement("script");
            var g = bds.comm.host.bfe,
                i = bds.comm.host.favo;
            f.src = g + "?url=" + encodeURIComponent(k.url) + "&jump=" + encodeURIComponent(i + "/myfavorite/set?irt=1&t=" + encodeURIComponent(k.title) + "&id=" + encodeURIComponent(j) + "&c=bds.se.tool.favo.succ") + "&key=url";
            document.body.appendChild(f)
        }
    };
    if (bds.comm.user) {
        this.init(this.op, b)
    } else {
        if (bds.se.login && bds.se.login.open) {
            var a = this;
            bds.se.login.open(function (g, f) {
                if (g == 1) {
                    a.init(a.op, b)
                }
            })
        }
    }
};
bds.se.tool.favo.succ = function (json) {
    if (json.suc) {
        if (json.status) {
            switch (json.status) {
            case 302:
                if (bds.se.login && bds.se.login.open) {
                    bds.se.login.open(function (stat, user) {
                        if (stat == 1) {
                            bds.se.tool.favo(eval("(" + $("#" + json.id)[0].getAttribute("data-tools") + ")"), json.id)
                        }
                    })
                }
                break;
            case 5:
                var succContent = '<div class="c-tip-notice">';
                succContent += '<h3 class="c-tip-notice-fail">收藏失败，请稍后再试</h3>';
                succContent += "</div>";
                break
            }
        }
    } else {
        if (json.status) {
            var succContent = '<div class="c-tip-notice">';
            succContent += '<h3 class="c-tip-notice-succ">已收藏至：</h3>';
            succContent += "<ul>";
            switch (json.status) {
            case 2:
                succContent += '<li class="c-tip-item-succ"><i class="c-icon c-icon-success"></i>个人中心“<a href="http://i.baidu.com/my/collect" target="_blank">我的收藏</a>”</li>';
                succContent += '<li class="c-tip-item-succ"><i class="c-icon c-icon-success"></i>百度首页“<a href="http://www.baidu.com" target="_blank">我的导航</a>”</li>';
                break;
            case 3:
                succContent += '<li class="c-tip-item-succ"><i class="c-icon c-icon-success"></i>个人中心“<a href="http://i.baidu.com/my/collect" target="_blank">我的收藏</a>”</li>';
                succContent += '<li class="c-tip-item-fail"><i class="c-icon c-icon-fail"></i>百度首页“<a href="http://www.baidu.com" target="_blank">我的导航</a>”</li>';
                break;
            case 4:
                succContent += '<li class="c-tip-item-fail"><i class="c-icon c-icon-fail"></i>个人中心“<a href="http://i.baidu.com/my/collect" target="_blank">我的收藏</a>”</li>';
                succContent += '<li class="c-tip-item-succ"><i class="c-icon c-icon-success"></i>百度首页“<a href="http://www.baidu.com" target="_blank">我的导航</a>”</li>';
                break;
            default:
                break
            }
            succContent += "</ul>";
            succContent += "</div>"
        }
    }
    $(bds.comm.tips).each(function () {
        if (!this.op.uncontrolled) {
            this.hide()
        }
    });
    new bds.se.tip({
        target: $(".c-icon", document.getElementById(json.id))[0],
        offset: {
            x: 33
        },
        arrow: {
            has: 0
        },
        mode: "none",
        arrow: {
            has: 0
        },
        close: 1,
        content: succContent
    })
};
var bds = bds || {};
bds.se = bds.se || {};
bds.se.tools = bds.se.tools || {};
bds.se.tools = function () {
    var a = delayHideOnIcon = delayShowOnTip = delayHideOnTip = {};
    $("#container").delegate(".c-tools", "mouseover", function () {
        var b = this;
        window.clearTimeout(delayHideOnIcon);
        window.clearTimeout(delayHideOnTip);
        a = setTimeout(function () {
            var d = 1;
            $(bds.comm.tips).each(function (f) {
                if (this.getTarget() == $(".c-icon", b)[0]) {
                    d = 0;
                    this.show();
                    return false
                }
            });
            if (d) {
                tools = new bds.se.tool(b)
            }
        }, 200)
    }).delegate(".c-tools", "mouseout", function () {
        window.clearTimeout(a);
        window.clearTimeout(delayShowOnTip);
        var b = this;
        delayHideOnIcon = setTimeout(function () {
            $(bds.comm.tips).each(function (d) {
                if (this.getTarget() == $(".c-icon", b)[0]) {
                    this.hide();
                    return false
                }
            })
        }, 200)
    });
    $("#c-tips-container").delegate(".c-tip-con", "mouseover", function () {
        var b = this;
        window.clearTimeout(delayHideOnIcon);
        window.clearTimeout(delayHideOnTip);
        delayShowOnTip = setTimeout(function () {
            $(bds.comm.tips).each(function (d) {
                if (this.getDom().get(0) == b && this.ext.category && this.ext.category == "tools") {
                    this.show();
                    return false
                }
            })
        }, 200)
    }).delegate(".c-tip-con", "mouseout", function () {
        window.clearTimeout(a);
        window.clearTimeout(delayShowOnTip);
        var b = this;
        delayHideOnTip = setTimeout(function () {
            $(bds.comm.tips).each(function (d) {
                if (this.getDom().get(0) == b && this.ext.category && this.ext.category == "tools") {
                    this.hide();
                    return false
                }
            })
        }, 200)
    })
};
var bds = bds || {};
bds.se = bds.se || {};
bds.se.slide = function (n) {
    var g = this,
        f = {},
        i, l, b, j = [],
        a = 0,
        m = null,
        k, d;
    this._default = {
        target: $("#lg"),
        src: "",
        width: 270,
        height: 129,
        offsetLeft: 0,
        isPad: false,
        frames: 103,
        animations: [{
            isAutoPlay: true,
            frame_start: 1,
            frame_end: 30,
            delay: 0,
            duration: 100,
            repeats: 0,
            process_before: function () {},
            event_loop: 0,
            process_after: function () {}
        }, {
            trigger_type: "click",
            trigger_duration: 100,
            trigger_frame: 31,
            trigger_fn: function () {},
            frame_start: 32,
            frame_end: 103,
            process_before: function () {},
            process_after: function () {},
            delay: 0,
            duration: 100,
            repeats: 1,
            event_loop: 0
        }]
    };
    this.timer = [];
    this.otherTimer = [];
    this.op = $.extend({}, g._default, n);
    this.init = function () {
        if (!g.op.src) {
            g.createPlayer();
            return
        }
        g.createDom();
        if (bds.comm.ishome && g.op.target.length) {
            g.initAnimate()
        }
    };
    this.createPlayer = function () {
        var q = g.op.target.find("map"),
            o = q.length ? q.find("area").eq(0) : "",
            p = g.op.play;
        if (p) {
            l = $('<img class="logo_player" src="' + p.src + '" style="width:' + p.width + "px; height:" + p.height + "px; position:absolute; top:50%; left:50%; margin-left: -" + (p.width / 2) + "px; margin-top: -" + (p.height / 2) + "px; cursor:pointer;\" onmousedown=\"return c({'tab':'logo_button_click'})\" />").appendTo(g.op.target);
            if (o.length) {
                l.wrap('<a style="position:absolute;top:0;left:50%;width:' + g.op.width + "px;height:" + g.op.height + "px;margin-left:-" + (g.op.width / 2) + 'px;" href="' + o.attr("href") + '" target="' + o.attr("target") + '"></a>');
                if (o.attr("title")) {
                    l.attr("title", o.attr("title"))
                }
            } else {
                l.wrap('<div style="position:absolute;top:0;left:50%;width:' + g.op.width + "px;height:" + g.op.height + "px;margin-left:-" + (g.op.width / 2) + 'px;"></div>')
            }
            l.on(p.trigger_type, function () {
                if (p.trigger_duration) {
                    g.timer.push(window.setTimeout(function () {
                        p.trigger_fn.call(g.op)
                    }, p.trigger_duration))
                } else {
                    p.trigger_fn.call(g.op)
                }
                return false
            })
        }
    };
    this.createDom = function () {
        var s = '<div style="position:absolute;top:0;left:50%;background:url(#{0}) no-repeat #{1};cursor:#{2};width:#{3}px;height:#{4}px;margin-left:-#{5}px;display:none;"></div>',
            w = g.op.offsetLeft + "px 0",
            u = g.op.target.find("map"),
            B = u.length ? u.find("area").eq(0) : "",
            x = B ? "pointer" : x,
            z = g.op.animations instanceof Array ? g.op.animations : [g.op.animations],
            p = g.op.width,
            y = g.op.height;
        j = z;
        k = p;
        d = y;
        s = $.format(s, g.op.src, w, x, g.op.width, g.op.height, g.op.width / 2);
        if (g.op.target.css("position") === "static") {
            g.op.target.css({
                position: "relative",
                width: "100%"
            })
        }
        g.op.target.append(s);
        i = b = g.op.target.find("div").eq(0);
        if (g.op.play) {
            l = $('<img src="' + g.op.play.src + '" style="width:' + g.op.play.width + "px; height:" + g.op.play.height + "px; position:absolute; top:50%; left:50%; margin-left: -" + (g.op.play.width / 2) + "px; margin-top: -" + (g.op.play.height / 2) + "px; \" onmousedown=\"return c({'tab':'logo_button_click'})\" />").insertAfter(i);
            b = l
        }
        if (g.op.isPad) {
            i.css("background-size", (g.op.width * g.op.frames / 2) + "px " + g.op.height + "px")
        }
        if (B.length) {
            i.wrap('<a href="' + B.attr("href") + '" target="' + B.attr("target") + '"></a>');
            if (B.attr("title")) {
                i.attr("title", B.attr("title"))
            }
        } else {
            i.on("mousedown", function () {
                c({
                    tab: "logo_button_click"
                })
            })
        }
        for (var r = 0, q = j.length; r < q; r++) {
            var o = j[r];
            var t = o.frame_start;
            w = -((t - 1) * p) + "px 0";
            f[r] = {
                "background-position": w,
                cursor: x
            }
        }
    };
    this.initAnimate = function () {
        if (a >= j.length) {
            return
        }
        var r = j[a],
            u = r.isAutoPlay,
            s = r.trigger_type,
            p = r.trigger_fn,
            w = r.trigger_duration,
            t = r.trigger_frame;
        var q = $("#lg area");
        if (q.length && q.attr("onmousedown")) {
            i.on("mousedown", function () {
                return (new Function(q.attr("onmousedown")))()
            })
        }
        m = new Image();
        m.src = g.op.src;
        i.bind("first_animate", function () {
            if (!m.complete) {
                m.onload = o
            } else {
                o()
            }
        });
        if (u) {
            i.trigger("first_animate")
        } else {
            if (s) {
                g.enablePointer();
                b.show().on(s, function () {
                    if (p) {
                        if (t) {
                            g.toPos(t)
                        }
                        p.call(g.op);
                        if (w) {
                            g.timer.push(setTimeout(function () {
                                i.trigger("first_animate")
                            }, w))
                        } else {
                            i.trigger("first_animate")
                        }
                    }
                })
            }
        }

        function o() {
            i.show();
            g.play()
        }
    };
    this.enablePointer = function () {
        if (!(bds.comm.upn && bds.comm.upn.browser === "msie" && bds.comm.upn.ie === "6")) {
            i.css("cursor", "pointer")
        } else {
            alert("pointer")
        }
    };
    this.disablePointer = function () {
        i.css("cursor", "default")
    };
    this.play = function () {
        if (a >= j.length) {
            g.dispose();
            return
        }
        var o = j[a],
            p = o.process_before;
        g.dispose();
        if (p) {
            p.call(g)
        }
        g.animation()
    };
    this.toPos = function (o) {
        var p = -((o - 1) * k) + "px 0";
        i.css("background-position", p)
    };
    this.animation = function () {
        var u = j[a],
            x = u.duration,
            B = u.frame_start,
            y = u.frame_end,
            z = u.delay,
            w = u.repeats,
            t = u.process_after,
            q = u.trigger_type,
            p = B - 1 > 0 ? B - 1 : 0,
            E = u.event_loop || 0,
            s = 0;
        var o;
        if (E) {
            o = j[a]
        } else {
            o = a + 1 >= j.length ? j[a] : j[a + 1]
        }
        if (o) {
            var D = o.trigger_type,
                r = o.trigger_fn,
                C = o.trigger_duration,
                F = o.trigger_frame;
            if (D) {
                if (q) {
                    b.off(q)
                }
                if (a < (j.length - 1) || E) {
                    g.enablePointer();
                    b.on(D, function () {
                        if (!E) {
                            a++
                        }
                        if (t) {
                            t.call(g)
                        }
                        if (r) {
                            r.call(g)
                        }
                        if (F) {
                            g.toPos(F)
                        }
                        if (C) {
                            g.dispose();
                            g.timer.push(setTimeout(function () {
                                g.play()
                            }, C))
                        } else {
                            g.play()
                        }
                    })
                } else {
                    g.disablePointer()
                }
            }
        }(function () {
            var H = arguments.callee;
            g.timer.push(setTimeout(function () {
                i.css("background-position", -(k * p) + "px 0");
                p++;
                if (p >= y) {
                    g.dispose();
                    s++;
                    if (w !== 0 && s >= w) {
                        p = null;
                        s = null;
                        if (t) {
                            t.call(g)
                        }
                        a++;
                        if (a < j.length) {
                            g.play()
                        }
                        if (E) {
                            a--
                        }
                    } else {
                        p = B - 1 > 0 ? B - 1 : 0;
                        g.timer.push(setTimeout(arguments.callee, x))
                    }
                } else {
                    g.timer.push(setTimeout(arguments.callee, x))
                }
            }, z))
        })()
    };
    this.dispose = function (p) {
        p = p || g.timer;
        for (var q = 0, o = p.length; q < o; q++) {
            window.clearTimeout(p[q])
        }
        p.length = 0
    };
    this.disposeOther = function (p) {
        p = p || g.otherTimer;
        for (var q = 0, o = p.length; q < o; q++) {
            window.clearTimeout(p[q])
        }
        p.length = 0
    };
    this.clear = function () {
        g.dispose();
        g.disposeOther();
        b.off("click").off("hover")
    };
    this.reset = function (o) {
        o = o || 0;
        i.css(f[o])
    };
    this.init()
};
var bds = bds || {};
bds.se = bds.se || {};
bds.se.banner = function (a, d, b) {
    this.init = function () {
        b = b || {};
        this.$dom_panel = $(a);
        this.hintText = d;
        this.hintIcon = b.iconClass || "";
        this.downUrl = b.downUrl || "";
        this.hintCookie = b.cookie || "";
        this.showNum = (this.hintCookie && $.getCookie(this.hintCookie)) ? Number($.getCookie(this.hintCookie)) : 0;
        this.nscTab = b.nscTab || "";
        this.ishome = (bds.comm && bds.comm.ishome == 1) ? 1 : 0;
        this.bannerType = b.bannerType || "";
        if (a && d && this.showNum < 5 && !$(".baiduapp_banner")[0] && !$(".res_top_banner")[0] && !$(".res_top_banner_for_win")[0]) {
            this.show()
        }
    };
    this.show = function () {
        this.render();
        this.showNum += 1;
        $.setCookie(this.hintCookie, this.showNum, {
            expires: 30 * 24 * 60 * 60 * 1000
        });
        this.$dom_panel.prepend(this.bannerHtml);
        if (this.ishome != 1) {
            this.headFloat()
        }
        this.bindEvent();
        ns_c({
            fm: "behs",
            tab: ((this.ishome == 1) ? "tj_" : "") + "baidu_" + (this.nscTab ? this.nscTab : "topbanner") + "show"
        })
    };
    this.render = function () {
        var f = [];
        if (this.bannerType !== "WIN") {
            f = f.concat(['<div class="res_top_banner">', '<i class="c-icon ' + (this.hintIcon ? this.hintIcon : "res_top_banner_icon") + '"></i>', "<span>" + this.hintText + "</span>", (this.downUrl) ? '<a href="' + this.downUrl + '" class="res_top_banner_download">立即体验</a>' : "", '<i class="c-icon res_top_banner_close"></i>', "</div>"])
        } else {
            f = f.concat(['<div class="res_top_banner_for_win">', '<i class="c-icon ' + (this.hintIcon ? this.hintIcon : "res_top_banner_icon") + '"></i>', "<span>" + this.hintText + "</span>", (this.downUrl) ? '<a href="' + this.downUrl + '" class="res_top_banner_download">立即体验</a>' : "", '<i class="c-icon res_top_banner_close"></i>', "</div>"])
        }
        this.bannerHtml = f.join("")
    };
    this.headFloat = function () {
        var g = $("#head"),
            j = $(window),
            f = $(".res_top_banner");
        var i = g.css("position");
        $(window).scroll(function () {
            var l = f.height() || 0,
                k = j.scrollTop();
            if (k <= l) {
                g.attr("style", "position:absolute;")
            } else {
                g.attr("style", "top:0px;_top:" + l + "px;")
            }
        })
    };
    this.bindEvent = function () {
        if (this.bannerType !== "WIN") {
            var f = $(".res_top_banner"),
                g = this;
            $(".res_top_banner_download", f).on("mousedown", function () {
                g.hintCookie && $.setCookie(g.hintCookie, 5, {
                    expires: 30 * 24 * 60 * 60 * 1000
                });
                ns_c({
                    fm: "behs",
                    tab: ((g.ishome == 1) ? "tj_" : "") + "baidu_" + (g.nscTab ? g.nscTab : "topbanner") + "down"
                })
            });
            $(".res_top_banner_close", f).on("mousedown", function () {
                f.detach();
                g.hintCookie && $.setCookie(g.hintCookie, 5, {
                    expires: 30 * 24 * 60 * 60 * 1000
                });
                ns_c({
                    fm: "behs",
                    tab: ((g.ishome == 1) ? "tj_" : "") + "baidu_" + (g.nscTab ? g.nscTab : "topbanner") + "close"
                })
            });
            $(window).on("swap_begin", function () {
                f.detach()
            })
        } else {
            var f = $(".res_top_banner_for_win"),
                g = this;
            $(".res_top_banner_download", f).on("mousedown", function () {
                g.hintCookie && $.setCookie(g.hintCookie, 5, {
                    expires: 30 * 24 * 60 * 60 * 1000
                });
                ns_c({
                    fm: "behs",
                    tab: ((g.ishome == 1) ? "tj_" : "") + "baidu_" + (g.nscTab ? g.nscTab : "topbanner") + "down"
                })
            });
            $(".res_top_banner_close", f).on("mousedown", function () {
                f.detach();
                g.hintCookie && $.setCookie(g.hintCookie, 5, {
                    expires: 30 * 24 * 60 * 60 * 1000
                });
                ns_c({
                    fm: "behs",
                    tab: ((g.ishome == 1) ? "tj_" : "") + "baidu_" + (g.nscTab ? g.nscTab : "topbanner") + "close"
                })
            });
            $(window).on("swap_begin", function () {
                f.detach()
            })
        }
    };
    this.init()
};
(function () {
    $(window).on("swap_end", function () {
        var a = ["union", "union2baidu", "union_cpro", "union_nosearch", "redbull", "hao123"],
            g = bds.comm.upn,
            b = navigator.userAgent.toLowerCase().search(/msie [6-7]/);
        winFilter = /NT 6.1|NT 6.2|NT 6.3/i.test(navigator.userAgent);
        if (bds.comm.topHijack) {
            for (var d = 0; d < bds.comm.topHijack.length; d++) {
                if (bds.comm.topHijack[d].templateName == "hint_topHijack") {
                    var f = bds.comm.topHijack[d].hintData.hintText;
                    bds.se.banner($("body")[0], f, {
                        downUrl: "https://www.baidu.com/help/hijack.html",
                        cookie: "H_PS_HIJACK",
                        nscTab: "hijack"
                    })
                }
            }
        }
        if (bds.comm.tng && $.inArray(bds.comm.tng, a) == -1) {
            if (g && g.browser && g.browser == "msie" && g.ie && (g.ie == "6" || g.ie == "7") && b > 0) {
                var f = (g.ie == "6") ? "您的浏览器采用的IE6内核已停止维护，推荐升级到更快更安全的百度浏览器！" : "您的IE浏览器版本较低，即将停止更新维护，建议升级到更快、更安全的百度浏览器。";
                bds.se.banner($("body")[0], f, {
                    downUrl: "http://j.br.baidu.com/v1/t/ui/p/browser/tn/10105001/ch_dl_url",
                    cookie: "H_PS_BBANNER",
                    nscTab: "browser"
                })
            }
        }
    })
})();
bds.se.safeTip = (function () {
    function a() {
        var g = 0,
            f = ["bd"],
            d = "",
            b = [];
        $(".unsafe_ico_new").each(function (j, l) {
            b.push(l.getAttribute("data-id"));
            d = l.getAttribute("data-tpl");
            var m = $(l).attr("data-href"),
                k = $(l).attr("href"),
                i = m ? m : k;
            $("h3 a", $(l).parents(".result")).attr("href", i);
            g++
        });
        if (g > 0) {
            ns_c({
                tab: "safetip",
                num_unsafe: g,
                prd: f.join("|"),
                hintId: b,
                hintTpl: d
            })
        }
    }
    return {
        init: a
    }
})();
var bds = bds || {};
bds.se = bds.se || {};
bds.se.trust = bds.se.trust || {};
bds.se.trust = function () {
    var p = 4;
    var q = [];
    var o = [];
    if (bds.util && bds.util.domain && bds.util.domain.get) {
        var d = bds.util.domain.get("http://tag.baidu.com")
    } else {
        var d = "http://tag.baidu.com"
    }
    var k = null;
    var n = null;
    var m = false;
    var s = null;
    var t = 0;

    function r() {
        q = [], o = [];
        $(".c-trust").each(function () {
            var w = $(this);
            var u = this.getAttribute("data_key");
            if (w.parent(".c-icons-inner").length == 0) {
                w.wrap("<span class='c-icons-outer'><span class='c-icons-inner'></span></span>")
            }
            if ($.inArray(u, q) == -1) {
                q.push(this.getAttribute("data_key"))
            }
            if ($.inArray(this, o) == -1) {
                o.push(this)
            }
        });
        $(".c-trust-as").each(function () {
            n = $.parseJSON($(this).attr("hint-data"));
            if (n && !$(this).attr("render")) {
                k = $(this);
                l(n, $(this).attr("hint-type"));
                $(this).attr("render", "render")
            }
        });
        if (q.length < 1) {
            return
        }
        if (m && t < q.length) {
            m = false;
            if (s) {
                s.abort()
            }
        }
        j();
        t = q.length
    }

    function j() {
        if (m) {
            return
        }
        s = $.getJSON(d + "/?urls=" + q.join(",") + "&sid=" + bds.comm.sid + "&qid=" + bds.comm.qid + "&v=" + p + "&callback=?", b);
        m = true
    }

    function b(u) {
        m = false;
        if (u.code != 0) {
            return
        }
        $(o).each(function () {
            var w = this.getAttribute("data_key");
            n = u.data[w];
            if (!n) {
                return
            }
            k = $(this);
            k.html("");
            if (n.vstar && n.vstar.hint && n.vstar.hint.length > 0) {
                f(n.vstar.hint[0].vlevel, n.vstar.url)
            }
            if (n.medical) {
                g()
            }
            if (n.aviation) {
                i()
            }
        })
    }

    function f(y, u) {
        var w = $("<span>", {
            "class": "c-vline"
        });
        var x = $("<a>", {
            "class": "c-icon c-icon-v" + y,
            target: "_blank",
            onclick: "return false",
            href: "#"
        });
        if (u) {
            x.attr({
                href: u,
                onclick: ""
            })
        }
        k.append(w);
        k.append(x);
        l(n.vstar, "vstar")
    }

    function g() {
        var u = $("<span>", {
            "class": "c-vline"
        });
        var w = $("<a>", {
            "class": "c-icon c-icon-med",
            target: "_blank",
            onclick: "return false",
            href: "#"
        });
        k.append(u);
        k.append(w);
        l(n.medical, "medical")
    }

    function i() {
        var u = $("<span>", {
            "class": "c-vline"
        });
        var w = $("<a>", {
            "class": "c-icon c-icon-air",
            target: "_blank",
            onclick: "return false",
            href: "#"
        });
        k.append(u);
        k.append(w);
        l(n.aviation, "aviation")
    }

    function l(D, F) {
        var z = D.hint;
        var C = "over";
        var w = D.url;
        var x = D.webIMUrl;
        if (!D || !z) {
            return
        }
        if (F == "vstar" || F == "baozhang" || F == "baozhang-v" || F == "chengqi") {
            var E = "<div class='c-tip-cer hitcon'><ul>"
        } else {
            var E = "<div class='c-tip-info hitcon'><ul>"
        }
        for (var B = 0; B < z.length; B++) {
            if (z[B] == "") {
                C = "none";
                continue
            }
            E += "<li ";
            if (z[B].icon) {
                E += "class='c-tip-item-i'><img src='" + z[B].icon + "' class='c-customicon c-gap-icon-right-small c-tip-item-icon' />"
            } else {
                E += ">"
            }
            E += a(z[B].txt);
            E += "</li>"
        }
        E += "</ul></div>";
        var y = false,
            H = false;
        if (F == "baozhang-v") {
            y = true
        } else {
            if (F == "chengqi") {
                H = true
            }
        }
        var u = new bds.se.tip({
            target: k,
            mode: C,
            align: "auto",
            content: E,
            arrow: {
                has: 1,
                offset: 35,
                r: y,
                c: H
            },
            offset: {
                x: 0,
                y: 25
            }
        });
        u.onShow = function () {
            A.use("honourCard4", function () {});
            var J = z[0].vlevel,
                I = z[0].unfixedInfo;
            ns_c({
                hintUrl: k.attr("data_key"),
                hintTpl: F,
                hintId: J
            });
            if (E.indexOf("ecard") != -1) {
                setTimeout(function () {
                    A.use("honourCard4", function () {
                        var M = $(u.getDom()).find(".c-trust-ecard3");
                        var N = "",
                            K = 0;
                        if (u.getTarget().hasClass("baozhang")) {
                            N = "baozhang";
                            K = z[0].bzAppliCounts
                        } else {
                            if (u.getTarget().hasClass("baozhang-v")) {
                                N = "baozhang-v"
                            } else {
                                if (u.getTarget().hasClass("chengqi")) {
                                    N = "chengqi"
                                }
                            }
                        }
                        var L = {
                            compName: D.label,
                            vLevel: J,
                            centerPageUrl: w
                        };
                        if (I) {
                            L.unfixedInfo = I
                        }
                        if (x) {
                            L.webIMUrl = x
                        }
                        if (N) {
                            L.type = N
                        }
                        if (K) {
                            L.bzAppliCounts = K
                        }
                        if (y) {
                            if (D.brandName) {
                                L.brandName = D.brandName
                            }
                            if (D.brandLogo) {
                                L.brandLogo = D.brandLogo
                            }
                            if (D.brandScope) {
                                L.brandScope = D.brandScope
                            }
                            if (D.brandRelation) {
                                L.brandRelation = D.brandRelation
                            }
                        }
                        A.ui.honourCard4(M, L)
                    })
                }, 0)
            }
            $("li", this.dom).each(function (K) {
                $("a", this).each(function (L) {
                    this.onmousedown = function () {
                        ns_c({
                            hintUrl: w,
                            hintTpl: F,
                            title: this.innerHTML,
                            pos: L
                        })
                    }
                })
            })
        }
    }

    function a(w) {
        var u = w;
        u = u.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&#39;").replace(/"/g, "&quot;");
        u = u.replace("[/url]", "</a>").replace(/\[url ([^\s]*)\]/, "<a href='$1' target='_blank'>");
        u = u.replace(/\[img ([^\s]*)\]/, "<img src='$1' />");
        u = u.replace(/\[ecard (-?[\d]{0,3})\]/, "<div class='c-trust-ecard3' value='$1'></div>");
        return u
    }
    r();
    return {
        init: r,
        render: b
    }
}();
var __callback_names = {};

function isbase64(p) {
    var w;
    if (bds && bds._base64) {
        w = bds._base64
    } else {
        w = {
            domain: bds.util.domain && bds.util.domain.get ? bds.util.domain.get("http://b1.bdstatic.com/") : "http://b1.bdstatic.com/",
            b64Exp: -1,
            pdc: false,
            sep: 16
        };
        bds._base64 = w
    }
    var d = {
        left: "content_left",
        right: "container"
    };
    var D = w.domain;
    var o = {};
    var m = [];
    var t = {
        left: $.Deferred(),
        right: $.Deferred()
    };
    var M = {
        left: {},
        right: {}
    };
    var u = false;
    var H = 0;
    var s = 0;
    var B = 0;
    var O = null;
    var g = 1;
    w.inline = false;
    var f = [];

    function L() {
        t = {
            left: $.Deferred(),
            right: $.Deferred()
        }
    }
    p.onSendlog(function () {
        var Q = [];
        if (o) {
            $.each(o, function (R, S) {
                Q.push(R + "_" + S)
            })
        }
        p.setParam("cus_cusval", Q.join("|"));
        if (b.isinline()) {
            p.setParam("cus_b64il", b.ilsum);
            if (b.ilparseTime) {
                p.setParam("cus_b64ilpt", b.ilparseTime)
            }
            if (b.ilrenderTime) {
                p.setParam("cus_b64ilrt", b.ilrenderTime)
            }
        }
    });

    function P(S, U) {
        B++;
        var S = S || [],
            U = U || [];
        S = $.grep(S, function (V) {
            if (M.right.hasOwnProperty(V)) {
                return false
            }
            M.right[V] = false;
            return true
        });
        U = $.grep(U, function (V) {
            if (M.left.hasOwnProperty(V)) {
                return false
            }
            M.left[V] = false;
            return true
        });
        if (w.b64Exp == 2) {
            if (U.length > 0) {
                u = true;
                k(U, "left", "reql")
            }
        }
        if (S.length > 0) {
            if (S.length > 12) {
                var T = Math.round(S.length / 2);
                var R = [],
                    Q = [];
                $.each(S, function (V, W) {
                    V < T ? R.push(W) : Q.push(W)
                });
                k(R, "right", "reqr2");
                k(Q, "right", "reqr1")
            } else {
                k(S, "right", "reqr")
            }
        }
    }

    function C(Q) {
        var S = Q,
            R = 0;
        while (__callback_names.hasOwnProperty(Q) || window[Q]) {
            Q = S + "_" + R;
            R++
        }
        __callback_names[Q] = 1;
        return Q
    }

    function a(T) {
        if (typeof T == "string") {
            var R, S = 0,
                Q = 0;
            for (R = 0; R < T.length; R++) {
                Q = R % 20 + 1;
                S += T.charCodeAt(R) << Q
            }
            return Math.abs(S)
        }
        return 0
    }

    function k(Q, U, V) {
        var S = D + "image?imglist=" + Q.join(",");
        var R = a(Q.join(""));
        R = "cb_" + (R + "").substr(Math.max(0, R.length - 8), 8) + "_" + f.length;
        R = C(R);
        S += "&cb=" + R;
        var T = new Date() * 1;
        var W = $.ajax({
            url: S,
            cache: true,
            dataType: "jsonp",
            jsonp: false,
            timeout: 1500,
            jsonpCallback: R,
            success: function (X) {
                o[V] = new Date() * 1 - T;
                if (U == "right") {
                    q(X)
                } else {
                    if (U == "left") {
                        y(X)
                    }
                }
            }
        });
        W.always(function () {
            delete __callback_names[R]
        });
        f.push(W)
    }

    function r() {
        var R = f.concat(t.left, t.right);
        var Q = O = $.when.apply($, R);
        O.always(function () {
            var S = +(new Date());
            if (Q !== O) {
                return
            }
            if (w.b64Exp == 2) {
                N("left")
            }
            N("right")
        })
    }
    var x = function (U, T, Q, R) {
        if (!R) {
            R = document.getElementById(d[T])
        } else {
            R = $(R).find("#" + d[T])[0]
        }
        if (!R) {
            return
        }
        var W = R.getElementsByTagName("IMG");
        for (var S = 0; S < W.length; S++) {
            var V = W[S].getAttribute(Q);
            if (V) {
                if (U.hasOwnProperty(V) && U[V]) {
                    z(W[S], U[V])
                } else {
                    E(W[S])
                }
            }
        }
    };
    var N = function (Q) {
        x(M[Q], Q, "data-b64-id")
    };
    var K = false;
    var I = false;
    var n = function (R, Q) {
        if (!K) {
            x(R, "right", "data-b64il-id", Q)
        }
        if (Q) {
            K = true
        }
        I = true
    };

    function i() {
        setTimeout(function () {
            for (var Q = 0; Q < m.length; Q++) {
                var R = m[Q];
                if (!R.loaded) {
                    E(R.obj)
                }
            }
            m = []
        }, 200)
    }

    function z(Q, R) {
        try {
            Q.onerror = function () {
                E(this)
            };
            m.push({
                obj: Q,
                loaded: false
            });
            Q.onload = function () {
                for (var U = 0; U < m.length; U++) {
                    var T = m[U];
                    if (T.obj == this) {
                        T.loaded = true
                    }
                }
            };
            Q.src = "data:image/jpeg;base64," + R
        } catch (S) {
            E(Q)
        }
    }
    var j = 0;
    var E = function (Q) {
        if ((Q.getAttribute("data-b64-id") || Q.getAttribute("data-b64il-id")) && Q.getAttribute("data-src") != null) {
            Q.src = Q.getAttribute("data-src");
            p.setParam("cus_b64fails", ++j)
        }
    };
    var q = function (Q) {
        F(Q, "right")
    };
    var y = function (Q) {
        F(Q, "left")
    };
    var F = function (S, R) {
        for (var Q in S) {
            if (S.hasOwnProperty(Q)) {
                M[R][Q] = S[Q]
            }
        }
    };
    var l = function (Q) {
        t[Q].resolve()
    };
    var J = function () {
        M = null;
        m = null;
        t = null;
        $.each(f, function () {
            this.abort()
        })
    };
    var b = {
        loadImg: P,
        setDomLoad: l,
        end: r,
        isinline: function () {
            return I
        },
        restart: L,
        destroy: J,
        reqT: o,
        inline: n
    };
    return b
}
$(function () {
    if (bds.comm.user && bds.comm.user != "") {
        setTimeout(function () {
            $.ajax({
                dataType: "script",
                cache: true,
                url: (bds.su && bds.su.urStatic ? bds.su.urStatic : "http://ss.bdimg.com") + "/static/message/js/mt_show_1.8.js",
                success: function () {
                    function a() {
                        if ($("#imsg")[0] && $("#u")[0] && $("#user")[0]) {
                            bds.se.message && bds.se.message.init && bds.se.message.init({
                                button: $("#imsg"),
                                refer: $("#u")
                            });
                            $("#user").on("mouseover", function () {
                                $("#s_mod_msg").hide()
                            })
                        }
                        if ($("#imsg1")[0] && $("#u1")[0] && $("#user1")[0]) {
                            bds.se.message && bds.se.message.init && bds.se.message.init({
                                button: $("#imsg1"),
                                refer: $("#u1")
                            });
                            $("#user1").on("mouseover", function () {
                                $("#s_mod_msg").hide()
                            })
                        }
                    }

                    function b() {
                        bds.se.message && bds.se.message.addStyle && bds.se.message.addStyle()
                    }
                    bds.comm.loginAction.push(function (d, f) {
                        if (d == 1) {
                            a();
                            b()
                        }
                    });
                    if (bds.comm.newindex) {
                        $(window).on("index_off", function () {
                            setTimeout(function () {
                                a();
                                b()
                            }, 0)
                        })
                    } else {
                        a();
                        b()
                    }
                    $(window).on("swap_end", b)
                }
            })
        }, 0)
    }
});
$(window).on("swap_end", function () {
    var f = '<div id="_FP_userDataDiv" style="behavior:url(#default#userdata);width:0px;height:0px;position:absolute;top:-1000px;left:-1000px"></div><div id="_FP_comDiv" style="behavior:url(#default#clientCaps);width:0px;height:0px;position:absolute;top:-1000px;left:-1000px"></div>';
    var p = "//www.baidu.com/cache/fpid/o_0108.swf";
    var l = "//www.baidu.com/cache/fpid/ielib_0108.js";
    var d = "//www.baidu.com/cache/fpid/chromelib_0108.js";
    var j = document.title;
    var i = {
        flashDomId: "_FP_userDataDiv",
        flashUrl: p,
        comDomId: "_FP_comDiv",
        IEStoreDomId: "_FP_userDataDiv"
    };
    var b = navigator.userAgent.toLowerCase();
    var g = false;
    if (b.indexOf("msie") >= 0 || new RegExp("trident(.*)rv.(\\d+)\\.(\\d+)").test(b)) {
        g = true
    }
    var a = false;
    var n;
    var k = new RegExp("chrome/(\\d+)");
    var m = b.match(k);
    if (!!m) {
        a = true;
        n = m[1]
    }
    if (a && n >= 39) {
        return
    }
    $("body").append(f);
    var o = function (s) {
        if (g) {
            window.setTimeout(function () {
                document.title = j
            }, 0)
        }
        window._FPID_CACHE = s;
        $("#_FP_userDataDiv").remove();
        $("#_FP_comDiv").remove();
        var y = bds.comm.qid;
        var x = "_WWW_BR_API_" + (new Date()).getTime();
        var r = window[x] = new Image();
        r.onload = function () {
            window[x] = null
        };
        var q = $.getCookie("BAIDUID");
        var u = $.getCookie("BIDUPSID");
        var w = bds && bds.util && bds.util.domain ? bds.util.domain.get("http://eclick.baidu.com/ps_fp.htm?") : "http://eclick.baidu.com/ps_fp.htm?";
        var t = w + "pid=ps&fp=" + s.data.fp + "&im=" + s.data.im + "&wf=" + s.data.wf + "&br=" + s.data.br + "&qid=" + y + "&bi=" + q + "&psid=" + u;
        r.src = t
    };
    if (window._FPID_CACHE) {
        window._FPIDTimer = window.setTimeout(function () {
            o(window._FPID_CACHE)
        }, 2500);
        return
    }
    window._FPIDTimer = window.setTimeout(function () {
        var q = "";
        if (g) {
            q = l
        } else {
            q = d
        }
        $.ajax({
            url: q,
            cache: true,
            dataType: "script",
            success: function () {
                fpLib.getFp(o, i)
            }
        })
    }, 2500)
});
$(window).on("swap_begin", function () {
    if (window._FPIDTimer) {
        window.clearTimeout(window._FPIDTimer);
        $("#_FP_userDataDiv").remove();
        $("#_FP_comDiv").remove()
    }
});
var bds = bds || {};
bds.se = bds.se || {};
bds.se.upn = {
    regexp: /BD_UPN=([\w|\d]*)/,
    cookieset: [],
    write: function (a) {
        document.cookie = "BD_UPN=" + a + "; expires=" + (new Date(new Date().getTime() + 864000000)).toGMTString()
    },
    set: function (a) {
        var b = this;
        try {
            if ($.isArray(a)) {
                b.cookieset = b.cookieset.concat(a)
            }
        } catch (d) {}
    },
    run: function () {
        var f = this;
        try {
            var g = "";
            for (var d = 0; d < f.cookieset.length; d++) {
                if (f.cookieset[d] && f.cookieset[d].k && f.cookieset[d].v) {
                    var b = f.cookieset[d].k + "";
                    var a = f.cookieset[d].v + "";
                    if (b.length == a.length == 1) {
                        var l = {};
                        l[b] = a;
                        g = g + b + a
                    }
                }
            }
            f.write(g)
        } catch (j) {}
    }
};
bds.se.upn.set((function () {
    var a = navigator.userAgent;
    var g = a.toLowerCase();

    function m() {
        if (g.indexOf("lbbrowser") > 0) {
            return g.match(/lbbrowser/gi)
        }
        if (g.indexOf("maxthon") > 0) {
            return g.match(/maxthon\/[\d.]+/gi)
        }
        if (g.indexOf("bidubrowser") > 0) {
            return g.match(/bidubrowser/gi)
        }
        if (g.indexOf("baiduclient") > 0) {
            return g.match(/baiduclient/gi)
        }
        if (g.indexOf("metasr") > 0) {
            return g.match(/metasr/gi)
        }
        if (g.indexOf("qqbrowser") > 0) {
            return g.match(/qqbrowser/gi)
        }
        if (!(function () {
                if (navigator.mimeTypes.length > 0) {
                    var b;
                    for (b in navigator.mimeTypes) {
                        if (navigator.mimeTypes[b]["type"] == "application/vnd.chromium.remoting-viewer") {
                            return true
                        }
                    }
                }
                return false
            })() && (("track" in document.createElement("track")) && !("scoped" in document.createElement("style")) && !("v8Locale" in window) && /Gecko\)\s+Chrome/.test(navigator.appVersion)) && (("track" in document.createElement("track")) && ("scoped" in document.createElement("style")) && ("v8Locale" in window))) {
            return "qihu"
        }
        if (g.indexOf("msie") > 0) {
            return g.match(/msie [\d.]+;/gi)
        }
        if (window.document.documentMode) {
            return "msie"
        }
        if (g.indexOf("edge") > 0) {
            return g.match(/edge\/[\d.]+/gi)
        }
        if (g.indexOf("firefox") > 0) {
            return g.match(/firefox\/[\d.]+/gi)
        }
        if (g.indexOf("opr") > 0) {
            return g.match(/opr\/[\d.]+/gi)
        }
        if (g.indexOf("chrome") > 0) {
            return g.match(/chrome\/[\d.]+/gi)
        }
        if (g.indexOf("safari") > 0 && g.indexOf("chrome") < 0) {
            return g.match(/safari\/[\d.]+/gi)
        }
        return ""
    }
    browser = (m() + "").replace(/[0-9.\/|;|\s]/ig, "");
    browserversion = (function () {
        if (browser == "msie") {
            if (a.search(/MSIE [2-5]/) > 0) {
                return "ie5"
            }
            if (a.indexOf("MSIE 6") > 0) {
                return "ie6"
            }
            if (a.indexOf("MSIE 7") > 0) {
                return "ie7"
            }
            if (a.indexOf("MSIE 8") > 0) {
                return "ie8"
            }
            if (a.indexOf("MSIE 9") > 0) {
                return "ie9"
            }
            if (a.indexOf("MSIE 10") > 0) {
                return "ie10"
            }
            if (window.document.documentMode == "11") {
                return "ie11"
            }
            return "other"
        } else {
            return ""
        }
    })();
    browsertype = (function () {
        if (g.indexOf("msie") > 0 || new RegExp("trident(.*)rv.(\\d+)\\.(\\d+)").test(g)) {
            return "ie"
        }
        if (g.indexOf("firefox") > 0) {
            return "firefox"
        }
        if (g.indexOf("chrome") > 0) {
            return "chrome"
        }
        if (g.indexOf("safari") > 0 && g.indexOf("chrome") < 0) {
            return "safari"
        }
        return "other"
    })();

    function l() {
        var n = (navigator.platform == "Win32") || (navigator.platform == "Windows");
        var o = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
        if (o) {
            return "mac"
        }
        var b = (navigator.platform == "X11") && !n && !o;
        if (b) {
            return "unix"
        }
        var p = (String(navigator.platform).indexOf("Linux") > -1);
        if (p) {
            return "linux"
        }
        if (n) {
            return "windows"
        }
        return "other"
    }
    os = l();
    osversion = (function () {
        if (os == "windows") {
            if (a.indexOf("Windows NT 5.1") > -1 || a.indexOf("Windows XP") > -1) {
                return "xp"
            }
            if (isWinVista = a.indexOf("Windows NT 6.0") > -1 || a.indexOf("Windows Vista") > -1) {
                return "vista"
            }
            if (a.indexOf("Windows NT 6.1") > -1 || a.indexOf("Windows 7") > -1) {
                return "win7"
            }
            if (a.indexOf("Windows NT 6.2") > -1 || a.indexOf("Windows 8") > -1) {
                return "win8"
            }
            if (a.indexOf("Windows NT 6.3") > -1 || a.indexOf("Windows 8.1") > -1) {
                return "win8.1"
            }
            if (a.indexOf("Windows NT 10") > -1) {
                return "win10"
            }
            return "other"
        }
    })();
    var i = (function (n) {
        var b = 0;
        switch (n) {
        case "msie":
            b = 1;
            break;
        case "chrome":
            b = 2;
            break;
        case "firefox":
            b = 3;
            break;
        case "safari":
            b = 4;
            break;
        case "opr":
            b = 5;
            break;
        case "lbbrowser":
            b = 6;
            break;
        case "maxthon":
            b = 7;
            break;
        case "bidubrowser":
            b = 8;
            break;
        case "metasr":
            b = 9;
            break;
        case "qqbrowser":
            b = "a";
            break;
        case "qihu":
            b = "b";
            break;
        case "baiduclient":
            b = "c";
            break;
        case "edge":
            b = "d";
            break
        }
        return b
    })(browser);
    var j = (function (n) {
        var b = 0;
        switch (n) {
        case "ie6":
            b = 1;
            break;
        case "ie7":
            b = 2;
            break;
        case "ie8":
            b = 3;
            break;
        case "ie9":
            b = 4;
            break;
        case "ie10":
            b = 5;
            break;
        case "ie11":
            b = 6;
            break;
        case "other":
            b = 7;
            break;
        case "ie5":
            b = 8;
            break
        }
        return b
    })(browserversion);
    var d = (function (n) {
        var b = 0;
        switch (n) {
        case "windows":
            b = 1;
            break;
        case "mac":
            b = 2;
            break;
        case "linux":
            b = 3;
            break;
        case "unix":
            b = 4;
            break
        }
        return b
    })(os);
    var f = (function (n) {
        var b = 0;
        switch (n) {
        case "xp":
            b = 1;
            break;
        case "vista":
            b = 2;
            break;
        case "win7":
            b = 3;
            break;
        case "win8":
            b = 4;
            break;
        case "win8.1":
            b = 5;
            break;
        case "other":
            b = 6;
            break;
        case "win10":
            b = 7;
            break
        }
        return b
    })(osversion);
    var k = (function (n) {
        var b = 0;
        switch (n) {
        case "ie":
            b = 1;
            break;
        case "firefox":
            b = 2;
            break;
        case "chrome":
            b = 3;
            break;
        case "safari":
            b = 4;
            break
        }
        return b
    })(browsertype);
    return [{
        k: 1,
        v: i
    }, {
        k: 2,
        v: j
    }, {
        k: 3,
        v: d
    }, {
        k: 4,
        v: f
    }, {
        k: 5,
        v: k
    }]
})());
bds.se.upn.run();
bds.se.heightControl = {
    check: function () {
        return $("#content_right").height() > $("#content_left").height()
    },
    cleanEC: function () {
        var d = $(".ec_bdtg"),
            b = $("#ec_im_container").children("div"),
            g = b.length,
            f = g - 1;
        if (bds.se.heightControl.check()) {
            if (d && d.length) {
                d.css("display", "none")
            }
        }
        while (bds.se.heightControl.check() && f >= 0) {
            var a = b[f];
            $(a).css("display", "none");
            f--
        }
    },
    cleanRes: function () {
        var g = $("#content_right").find(".result-op"),
            b = g.length,
            a = b - 1;
        if (a == 0) {
            var f = $(g[0]).parent();
            if (($("#content_right").height() + g.height()) < $("#content_left").height()) {
                f.css({
                    position: "static"
                })
            }
        } else {
            while (bds.se.heightControl.check() && a > 0) {
                var d = g[a];
                $(d).css("display", "none");
                a--
            }
        }
    },
    init: function () {
        bds.se.heightControl.cleanEC();
        bds.se.heightControl.cleanRes()
    }
};
(function () {
    function a() {
        this.start = null;
        this.mouse = [];
        this.mouseTime = null;
        this.mouseSpeed = 500;
        this.key = [];
        this.scroll = [];
        this.scrollTime = null;
        this.scrollSpeed = 500;
        this.debug = false;
        this.dataStore = {};
        this.t = null;
        this.cycle = null;
        this.MIN_SPEED = 2 * 1000;
        this.MAX_SPEED = 10 * 1000;
        this.curSpeed = 5 * 1000;
        this.stayTime = 0;
        this.heartTime = [];
        this.heartT = null;
        this.MAX_LEN = 2000;
        this.storeLen = -1;
        this.MAX_SEND = 100;
        this.hostEnum = {
            SCLICK: 0,
            NSCLICK: 1,
            SESTAT: 2
        };
        this.keyMap = {
            new_input: 2,
            new_disp: 2,
            new_view: 2,
            new_user: 2,
            new_heart: 2
        };
        this.hostAddr = [bds && bds.comm && bds.comm.ubsurl ? bds.comm.ubsurl + "?" : "", (bds && bds.util && bds.util.domain ? bds.util.domain.get("http://nsclick.baidu.com") : "http://nsclick.baidu.com") + "/v.gif?", (bds && bds.util && bds.util.domain ? bds.util.domain.get("http://sestat.baidu.com") : "http://sestat.baidu.com") + "/wb.gif?"];
        this.commLog = {};
        this.isFirst = true;
        this.sendNum = {};
        this.init()
    }
    a.prototype = {
        setCommLog: function (g, f, b) {
            if (!bds || !bds.comm) {
                return false
            }
            if (!(g in this.commLog)) {
                var d = {};
                if (f && b) {
                    d.log = f;
                    d.len = b
                } else {
                    d.log = "&q=" + bds.comm.queryEnc + "&qid=" + bds.comm.qid + "&rsv_did=" + bds.comm.did + "&rsv_tn=" + bds.comm.tn + "&rsv_sid=" + bds.comm.sid;
                    d.len = (d.log + "&t=" + new Date().getTime()).length
                }
                this.commLog[g] = d
            }
            return true
        },
        fb: function () {
            var b = this.heartTime.length;
            var d;
            if (b === 0 || b === 1) {
                d = 3 * 1000
            } else {
                d = this.heartTime[b - 1] + this.heartTime[b - 2]
            }
            this.heartTime.push(d);
            return d
        },
        sendHeart: function (b) {
            var f = b === 0 ? this.stayTime : new Date().getTime() - this.start;
            var g = bds && bds.comm && bds.comm.qid;
            if (g && g in this.commLog && g in this.sendNum) {
                var d = [{
                    stay_time: f,
                    send_num: this.sendNum[g]
                }];
                this.send({
                    type: b,
                    fm: "new_heart",
                    data: d
                }, this.keyMap.new_heart)
            } else {
                return
            }
        },
        startHeart: function () {
            var d = this;
            var b = d.fb();
            d.stayTime += b;
            d.heartT = setTimeout(function () {
                d.sendHeart(0);
                d.startHeart()
            }, b)
        },
        preInit: function () {
            this.start = new Date().getTime();
            this.mouse = [];
            if (this.mouseTime !== null) {
                clearTimeout(this.mouseTime)
            }
            this.mouseTime = null;
            this.key = [];
            this.scroll = [];
            if (this.scrollTime !== null) {
                clearTimeout(this.scrollTime)
            }
            this.scrollTime = null;
            this.cycle = null;
            if (this.t !== null) {
                clearTimeout(this.t)
            }
            this.t = null;
            this.storeLen = -1;
            var b = bds && bds.comm && bds.comm.qid ? bds.comm.qid : "";
            if (b) {
                this.setCommLog(b);
                this.sendNum[b] = 0
            }
            if (bds && bds.comm && (bds.comm.logFlagSug === 1 || bds.comm.globalLogFlag === 1) && bds.comm.ishome === 0) {
                if (this.heartT !== null) {
                    clearTimeout(this.heartT)
                }
                this.heartT = null;
                this.stayTime = 0;
                this.heartTime = [];
                this.startHeart()
            }
        },
        collectPoint: function (d, j) {
            var f = d + "Time";
            var i = this[d + "Speed"];
            var k = this;
            if (k[d].length === 0) {
                var b = g(d, j);
                if (b.length < 2) {
                    return
                }
                k[d].push([new Date().getTime() - k.start, b[0], b[1]]);
                return
            }
            if (k[f] === null) {
                k[f] = setTimeout(function () {
                    var l = g(d, j);
                    if (l.length < 2) {
                        k[f] = null;
                        return
                    }
                    k[d].push([new Date().getTime() - k.start, l[0], l[1]]);
                    k[f] = null
                }, i)
            }

            function g(m, n) {
                var l = [];
                if (m === "mouse") {
                    l[0] = n.pageX;
                    l[1] = n.pageY
                } else {
                    if (m === "scroll") {
                        var o = $(window);
                        l[0] = o.scrollLeft();
                        l[1] = o.scrollTop()
                    }
                }
                return l
            }
        },
        singleInit: function () {
            var b = this;
            $("body").on("mousemove", function (d) {
                b.collectPoint("mouse", d)
            }).on("keydown", function (d) {
                b.key.push([new Date().getTime() - b.start, d.keyCode])
            });
            $(window).on("scroll", function (d) {
                b.collectPoint("scroll", d)
            });
            b.singleInit = function () {}
        },
        flushData: function (b) {
            if (this.t !== null) {
                clearTimeout(this.t);
                this.t = null
            }
            this.startSend(this.fetchData(b, true), true);
            this.startSend(this.fetchData(b, true));
            if (bds && bds.comm && (bds.comm.logFlagSug === 1 || bds.comm.globalLogFlag === 1)) {
                if (this.heartT !== null) {
                    clearTimeout(this.heartT);
                    this.heartT = null
                }
                this.sendHeart(b)
            }
        },
        init: function () {
            var b = this;
            b.preInit();
            $(window).on("swap_begin", function () {
                if (b.t !== null) {
                    clearTimeout(b.t);
                    b.t = null
                }
                if (bds && bds.comm && bds.comm.ishome === 0 && (bds.comm.logFlag === 1 || bds.comm.globalLogFlag === 1) && b.isFirst === false) {
                    b.sendHeart(1)
                }
            }).on("unload", function () {
                if (bds && bds.comm && bds.comm.ishome === 0 && (bds.comm.logFlagSug === 1 || bds.comm.globalLogFlag === 1)) {
                    b.flushData(2)
                }
            }).on("swap_end", function () {
                b.preInit();
                if (b.isFirst === true) {
                    b.isFirst = false
                }
                if (!b.hostAddr[0] && bds && bds.comm && bds.comm.ubsurl) {
                    b.hostAddr[0] = bds.comm.ubsurl + "?"
                }
            })
        },
        getData: function (j, l, b) {
            if (this.start === null || j.length === 0) {
                return {
                    startTime: this.start,
                    record: []
                }
            }
            var d = {
                startTime: this.start,
                record: []
            };
            var g = l;
            var k = b;
            if (g === undefined) {
                g = 0;
                k = j[j.length - 1][0]
            } else {
                if (g !== undefined && typeof g === "number" && k === undefined) {
                    g = g - this.start;
                    k = j[j.length - 1][0]
                } else {
                    if (g !== undefined && typeof g === "number" && k !== undefined && typeof k === "number") {
                        g = g - this.start;
                        k = k - this.start
                    } else {
                        g = 0;
                        k = 0
                    }
                }
            }
            for (var f in j) {
                if (j[f][0] < g) {
                    continue
                }
                if (j[f][0] < k) {
                    d.record.push(j[f])
                }
                if (j[f][0] >= k) {
                    break
                }
            }
            return d
        },
        send: function (j, g, m) {
            if (!j) {
                return false
            }
            if (this.debug) {}
            if (g === 0 && !this.hostAddr[0]) {
                if (bds && bds.comm && bds.comm.ubsurl) {
                    this.hostAddr[0] = bds.comm.ubsurl + "?"
                } else {
                    return false
                }
            }
            var f = "";
            var i = "";
            var l = "";
            if (typeof j === "object") {
                for (var d in j) {
                    f = j[d];
                    if (typeof f === "object") {
                        f = $.stringify(f)
                    }
                    i += d + "=" + encodeURIComponent(f) + "&"
                }
                i = i.substring(0, i.length - 1)
            } else {
                if (typeof j === "string") {
                    i = j
                }
            }
            if (!m && bds && bds.comm && bds.comm.qid) {
                m = bds.comm.qid
            }
            if (m && m in this.commLog) {
                i += this.commLog[m]["log"];
                i += "&t=" + new Date().getTime()
            } else {
                return false
            }
            if (typeof g !== "number" || g < 0 || g >= this.hostAddr.length) {
                g = 0
            }
            l = this.hostAddr[g] + i;
            if (l.length > this.MAX_LEN) {
                return false
            } else {
                var b = window["BD_PS_C" + (new Date()).getTime()] = new Image();
                b.src = this.hostAddr[g] + i
            }
            return true
        },
        sendNow: function (b, g, d) {
            if (!b || typeof b !== "string" || !(b in this.keyMap) || !g) {
                return
            }
            var f = "type=3&fm=" + b + "&data=" + encodeURIComponent($.stringify([g]));
            if (d && d.qid && d.log && d.len) {
                this.setCommLog(d.qid, d.log, d);
                this.send(f, this.keyMap[b], d.qid)
            } else {
                send(f, this.keyMap[b])
            }
        },
        pushData: function (b, g, d) {
            var i = bds && bds.comm && bds.comm.qid ? bds.comm.qid : "";
            if (!i) {
                return false
            }
            if (d && d.qid && d.log && d.len) {
                this.setCommLog(d.qid, d.log, d.len);
                i = d.qid
            } else {
                this.setCommLog(i)
            }
            if (!(i in this.dataStore)) {
                this.dataStore[i] = {}
            }
            var f = this.dataStore[i];
            if (!(b in f)) {
                f[b] = [[], []]
            }
            if (d && d.level === true) {
                f[b][0].push(encodeURIComponent($.stringify(g)))
            } else {
                f[b][1].push(encodeURIComponent($.stringify(g)))
            }
        },
        fetchData: function (l, b) {
            var f = this.dataStore;
            var k;
            var o;
            var n = [];
            var p = 0;
            var i = false;
            var d = bds && bds.comm && bds.comm.qid ? bds.comm.qid : "";
            if (!d) {
                return []
            }
            for (var j in f) {
                if (j !== d) {
                    i = true
                } else {
                    i = false
                }
                k = f[j];
                for (var m in k) {
                    if (!(m in this.keyMap)) {
                        continue
                    }
                    p = this.keyMap[m];
                    if (typeof p !== "number" || this.hostAddr[p] === undefined) {
                        continue
                    }
                    if (k[m][0].length > 0) {
                        o = k[m][0]
                    } else {
                        o = k[m][1]
                    }
                    g.call(this);
                    if ((i === true || b !== true) && o.length === 0 && k[m][1].length > 0) {
                        o = k[m][1];
                        g.call(this)
                    }
                    if (i === true) {
                        delete this.dataStore[j]
                    }
                }
            }
            return n;

            function g() {
                var q;
                var x = 0;
                var t = [];
                var z = false;
                var u = this.commLog[j]["len"];
                var y = this.hostAddr[p].length;
                var w = y + ("type=" + l + "&fm=" + m + "&data=").length + u;
                var s = w + 6;
                var r = s;
                while (o.length !== 0 && x < this.MAX_SEND) {
                    if (i === false && l === 0) {
                        x++
                    }
                    q = o.shift();
                    t.push(q);
                    r = s + q.length + 3;
                    if (s >= this.MAX_LEN || r >= this.MAX_LEN) {
                        if (t.length >= 2) {
                            t.pop();
                            z = true
                        }
                        n.push({
                            qid: j,
                            key: m,
                            type: l,
                            data: "%5B" + t.join("%2C") + "%5D",
                            host: p
                        });
                        t = [];
                        if (z) {
                            t[0] = q;
                            z = false
                        }
                        if (t.length > 0) {
                            r = w + 3 + q.length + 3
                        } else {
                            r = w + 6
                        }
                    }
                    s = r
                }
                if (t.length > 0) {
                    n.push({
                        qid: j,
                        key: m,
                        type: l,
                        data: "%5B" + t.join("%2C") + "%5D",
                        host: p
                    })
                }
            }
        },
        startSend: function (i, j) {
            var k = this;
            var b;
            var g;
            var f = j === true ? 0 : 100;
            var d = setInterval(function () {
                if (i.length <= 0) {
                    clearInterval(d);
                    return
                }
                b = i.shift();
                if (b && b.qid && b.qid in k.commLog) {
                    g = "type=" + b.type + "&fm=" + b.key + "&data=" + b.data
                } else {
                    return
                }
                k.send(g, b.host, b.qid);
                if (b.qid in k.sendNum) {
                    k.sendNum[b.qid] += 1
                }
            }, f)
        },
        startCycle: function () {
            var b = this;
            if (b.cycle === null) {
                b.cycle = 1
            }
            b.t = setTimeout(function () {
                var f = b.fetchData(0);
                var d = f.length;
                if (b.storeLen === -1) {
                    b.storeLen = d
                }
                if (b.storeLen !== 0 && d / b.storeLen >= 2 && b.curSpeed > b.MIN_SPEED) {
                    b.curSpeed -= 1000
                }
                if ((d === 0 || b.storeLen / d >= 2) && b.curSpeed < b.MAX_SPEED) {
                    b.curSpeed += 1000
                }
                b.startSend(f, 0);
                b.startCycle()
            }, b.curSpeed)
        },
        outInterface: function () {
            var b = this;
            return {
                hostEnum: b.hostEnum,
                api: {
                    getMouseLocus: function (f, d) {
                        return b.getData(b.mouse, f, d)
                    },
                    getKeyRecord: function (f, d) {
                        return b.getData(b.key, f, d)
                    },
                    getScrollRecord: function (f, d) {
                        return b.getData(b.scroll, f, d)
                    },
                    startAPI: function () {
                        b.singleInit()
                    }
                },
                send: {
                    debug: function () {
                        b.debug = true
                    },
                    send: function (f, d) {
                        return b.send(f, d)
                    },
                    sendNow: function (d, g, f) {
                        return b.sendNow(d, g, f)
                    },
                    sendPack: function (d, g, f) {
                        if (!d || typeof d !== "string" || !(d in b.keyMap) || !g) {
                            return
                        }
                        b.pushData(d, g, f);
                        if (b.cycle === null) {
                            b.startCycle()
                        }
                    }
                }
            }
        }
    };
    bds.log = new a().outInterface()
})();
$(window).on("swap_end", function () {
    if (bds.comm.encTn) {
        $.setCookie("H_PS_645EC", bds.comm.encTn, {
            expires: 24 * 60 * 60 * 30
        })
    }
    if (bds.se.trust) {
        bds.se.trust.init()
    }
    bds.se.heightControl.init();
    bds.util.setContainerWidth();
    if ($(".content_none").length > 0) {
        new bds.util.setFootStyle()
    }
    $(document).delegate(".feedback", "click", function () {
        var b = this;
        $.getScript("https://ss1.bdstatic.com/5eN1bjq8AAUYm2zgoY3K/r/www/cache/static/protocol/https/plugins/feedback_e510124a.js", function () {
            var g = b.getAttribute("data-feedbackid") || 1;
            var f = {
                product_id: 18,
                entrance_id: g
            };
            var d = {
                username: bds.comm.username,
                query: bds.comm.query,
                fb_qid: bds.comm.qid
            };
            bds.qa.ShortCut.initRightBar(f, d)
        })
    });
    var a = $("#form").find('input[type="hidden"][name=rsv_t]');
    if (a.length) {
        $(a).val(bds.comm.encTn)
    } else {
        $("#form").append('<input type="hidden" name="rsv_t" value="' + bds.comm.encTn + '"/>')
    }
    bds.comm.did = (function () {
        var b = "";
        for (var d = 0; d < 32; d++) {
            b += Math.floor(Math.random() * 16).toString(16)
        }
        return b
    })()
});
(function () {
    $(window).one("swap_end", function () {
        $("body").on("mousedown", ".se_common_hint a", function () {
            var a = $(this),
                f = a.parents(".se_common_hint"),
                g = f.attr("data-id") || "",
                d = f.attr("data-tpl") || "",
                b = f.find("a").index(a);
            ns_c_pj({
                hintId: g,
                hintTpl: d,
                title: a.html(),
                pos: b,
                qid: bds.comm.qid || ""
            }, "pj=hint&")
        })
    })
})();
$(function () {
    $("#u,#u1").delegate(".lb", "click", function () {
        var a = $(this).attr("data-subpro");
        if (a) {
            bds.se.login.setSubpro(a)
        }
        try {
            bds.se.login.open()
        } catch (b) {}
    })
});
$.ajax({
    dataType: "script",
    cache: true,
    url: "https://ss1.bdstatic.com/5eN1bjq8AAUYm2zgoY3K/r/www/cache/static/protocol/https/home/js/nu_instant_search_a9a7b32b.js"
});
window.PRE_CONN = (function () {
    var d = function (l, m) {
            var p = new Date() * 1;
            l = bds.util.domain && bds.util.domain.get ? bds.util.domain.get(l) : l;
            var n = /^(http[s]?:\/\/)?([^\/]+)(.*)/,
                o = l.match(n);
            if (o[2] && !b[o[2]]) {
                b.push(o[2]);
                var q = new Image();
                q.src = l + "?_t=" + (m ? m : p);
                q.onload = (q.onerror = function () {
                    q = null
                })
            }
        },
        k, g = 0,
        b = [],
        j = function () {
            try {
                if (!window.pageState || window.pageState == 0 || g == 1) {
                    $("#kw1,#kw").one("keydown", function () {
                        if (location.protocol === "https:") {
                            d("https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/ps_default.gif");
                            d("https://ss1.baidu.com/6ONWsjip0QIZ8tyhnq/ps_default.gif");
                            d("https://ss2.baidu.com/6ONWsjip0QIZ8tyhnq/ps_default.gif");
                            d("https://ss3.baidu.com/6ONWsjip0QIZ8tyhnq/ps_default.gif")
                        } else {
                            d("http://b1.bdstatic.com/img/pc.gif", parseInt(Math.random() * 1000));
                            d("http://ecmb.bdimg.com/public03/pc.gif");
                            $.each(["i7", "i8", "i9", "t10", "t11", "t12"], function (m, n) {
                                d("http://" + n + ".baidu.com/ps_default.gif")
                            })
                        }
                    });
                    if (g == 1) {
                        $("#kw1,#kw").one("focus", function () {
                            if (location.protocol === "https:") {
                                d("https://www.baidu.com/con?from=self")
                            }
                        })
                    }
                }
            } catch (l) {}
        },
        a = function () {
            g = 1;
            j();
            i()
        },
        f = function () {
            i();
            k = setTimeout(a, 1000 * 55)
        },
        i = function () {
            clearTimeout(k);
            g = 0
        };
    j();
    return {
        init: j,
        startTimer: f
    }
})();
(function () {
    $.ajaxPrefilter("parts", function (b, a, d) {
        b.__partsCallback = [];
        b.__partsIndex = 0;
        d.parts = function (f) {
            b.__partsCallback.push(f)
        };
        if (b.parts) {
            d.parts(b.parts)
        }
        b.converters["* parts"] = function (f) {
            return f
        }
    });
    $.ajaxTransport("parts", function (a) {
        if (!a.crossDomain || support.cors) {
            var b;
            return {
                send: function (j, d) {
                    var f, g = a.xhr();
                    g.open(a.type, a.url, a.async, a.username, a.password);
                    if (a.xhrFields) {
                        for (f in a.xhrFields) {
                            g[f] = a.xhrFields[f]
                        }
                    }
                    if (a.mimeType && g.overrideMimeType) {
                        g.overrideMimeType(a.mimeType)
                    }
                    if (!a.crossDomain && !j["X-Requested-With"]) {
                        j["X-Requested-With"] = "XMLHttpRequest"
                    }
                    for (f in j) {
                        if (j[f] !== undefined) {
                            g.setRequestHeader(f, j[f] + "")
                        }
                    }
                    g.send((a.hasContent && a.data) || null);
                    b = function (m, l) {
                        var k, q, o, n;
                        if ((g.readyState === 3 || g.readyState === 4) && !l) {
                            (function () {
                                var r = a.delimiter;
                                var w = "";
                                try {
                                    w = g.responseText
                                } catch (x) {}
                                if (w == "") {
                                    return
                                }
                                var y = -1,
                                    u, t = 0,
                                    s;
                                if (r) {
                                    while (true) {
                                        for (; t <= a.__partsIndex; t++) {
                                            u = (y == -1) ? 0 : y + r.length;
                                            y = w.indexOf(r, u);
                                            if (y == -1) {
                                                break
                                            }
                                        }
                                        if (y == -1 && g.readyState !== 4) {
                                            return
                                        }
                                        for (s = 0; s < a.__partsCallback.length; s++) {
                                            a.__partsCallback[s].call(g, w.substring(u, y == -1 ? w.length : y), a.__partsIndex, w)
                                        }
                                        a.__partsIndex++;
                                        if (y == -1) {
                                            return
                                        }
                                    }
                                } else {
                                    for (t = 0; t < a.__partsCallback.length; t++) {
                                        a.__partsCallback[t].call(g, w)
                                    }
                                }
                            })()
                        }
                        if (b && (l || g.readyState === 4)) {
                            b = undefined;
                            g.onreadystatechange = jQuery.noop;
                            if (l) {
                                if (g.readyState !== 4) {
                                    g.abort()
                                }
                            } else {
                                o = {};
                                k = g.status;
                                if (typeof g.responseText === "string") {
                                    o.text = g.responseText
                                }
                                try {
                                    q = g.statusText
                                } catch (p) {
                                    q = ""
                                }
                                if (!k && a.isLocal && !a.crossDomain) {
                                    k = o.text ? 200 : 404
                                } else {
                                    if (k === 1223) {
                                        k = 204
                                    }
                                }
                            }
                        }
                        if (o) {
                            d(k, q, o, g.getAllResponseHeaders())
                        }
                    };
                    if (!a.async) {
                        b()
                    } else {
                        if (g.readyState === 4) {
                            setTimeout(b)
                        } else {
                            g.onreadystatechange = b
                        }
                    }
                },
                abort: function () {
                    if (b) {
                        b(undefined, true)
                    }
                }
            }
        }
    })
})();
(function () {
    var defaultOptions = {
            sugSet: 1,
            sugStoreSet: 1,
            isSwitch: 1,
            isJumpHttps: 1,
            imeSwitch: 0,
            resultNum: 10,
            skinOpen: 1,
            resultLang: 0,
            duRobotState: "000"
        },
        options = {},
        tmpName;
    var expire30y = new Date();
    expire30y.setTime(expire30y.getTime() + 30 * 365 * 86400000);
    try {
        if (bds && bds.comm && bds.comm.personalData) {
            if (typeof bds.comm.personalData == "string") {
                bds.comm.personalData = eval("(" + bds.comm.personalData + ")")
            }
            if (!bds.comm.personalData) {
                return
            }
            for (tmpName in bds.comm.personalData) {
                if (defaultOptions.hasOwnProperty(tmpName) && bds.comm.personalData.hasOwnProperty(tmpName)) {
                    if (bds.comm.personalData[tmpName].ErrMsg == "SUCCESS") {
                        options[tmpName] = bds.comm.personalData[tmpName].value
                    }
                }
            }
        }
        try {
            if (!parseInt(options.resultNum)) {
                delete(options.resultNum)
            }
            if (!parseInt(options.resultLang) && options.resultLang != "0") {
                delete(options.resultLang)
            }
        } catch (e) {}
        writeCookie();
        if (!("sugSet" in options)) {
            options.sugSet = (Cookie.get("sug", 3) != 3 ? 0 : 1)
        }
        if (!("sugStoreSet" in options)) {
            options.sugStoreSet = Cookie.get("sugstore", 0)
        }
        var BAIDUID = Cookie.get("BAIDUID");
        if (!("resultNum" in options)) {
            if (/NR=(\d+)/.test(BAIDUID)) {
                options.resultNum = RegExp.$1 ? parseInt(RegExp.$1) : 10
            } else {
                options.resultNum = 10
            }
        }
        if (!("resultLang" in options)) {
            if (/SL=(\d+)/.test(BAIDUID)) {
                options.resultLang = RegExp.$1 ? parseInt(RegExp.$1) : 0
            } else {
                options.resultLang = 0
            }
        }
        if (!("isSwitch" in options)) {
            options.isSwitch = (Cookie.get("ORIGIN", 0) == 2 ? 0 : (Cookie.get("ORIGIN", 0) == 1 ? 2 : 1))
        }
        if (!("imeSwitch" in options)) {
            options.imeSwitch = Cookie.get("bdime", 0)
        }
    } catch (e) {}

    function save(callback) {
        var optionsStr = [];
        for (tmpName in options) {
            if (options.hasOwnProperty(tmpName) && tmpName !== "duRobotState") {
                optionsStr.push('"' + tmpName + '":"' + options[tmpName] + '"')
            }
        }
        var str = "{" + optionsStr.join(",") + "}";
        if (bds.comm.personalData) {
            $.ajax({
                url: "//www.baidu.com/ups/submit/addtips/?product=ps&tips=" + encodeURIComponent(str) + "&_r=" + new Date().getTime(),
                success: function () {
                    writeCookie();
                    if (typeof callback == "function") {
                        callback()
                    }
                }
            })
        } else {
            writeCookie();
            if (typeof callback == "function") {
                setTimeout(callback, 0)
            }
        }
    }

    function set(optionName, value) {
        options[optionName] = value
    }

    function get(optionName) {
        return options[optionName]
    }

    function writeCookie() {
        if (options.hasOwnProperty("sugSet")) {
            var value = options.sugSet == "0" ? "0" : "3";
            clearCookie("sug");
            Cookie.set("sug", value, document.domain, "/", expire30y)
        }
        if (options.hasOwnProperty("sugStoreSet")) {
            var value = options.sugStoreSet == 0 ? "0" : "1";
            clearCookie("sugstore");
            Cookie.set("sugstore", value, document.domain, "/", expire30y)
        }
        if (options.hasOwnProperty("isSwitch")) {
            var ORINGIN_MAP = {
                0: "2",
                1: "0",
                2: "1"
            };
            var value = ORINGIN_MAP[options.isSwitch];
            clearCookie("ORIGIN");
            Cookie.set("ORIGIN", value, document.domain, "/", expire30y)
        }
        if (options.hasOwnProperty("imeSwitch")) {
            var value = options.imeSwitch;
            clearCookie("bdime");
            Cookie.set("bdime", value, document.domain, "/", expire30y)
        }
    }

    function writeBAIDUID() {
        var BAIDUID = Cookie.get("BAIDUID"),
            NR, FG, SL;
        if (/FG=(\d+)/.test(BAIDUID)) {
            FG = RegExp.$1
        }
        if (/SL=(\d+)/.test(BAIDUID)) {
            SL = RegExp.$1
        }
        if (/NR=(\d+)/.test(BAIDUID)) {
            NR = RegExp.$1
        }
        if (options.hasOwnProperty("resultNum")) {
            NR = options.resultNum
        }
        if (options.hasOwnProperty("resultLang")) {
            SL = options.resultLang
        }
        Cookie.set("BAIDUID", BAIDUID.replace(/:.*$/, "") + (typeof SL != "undefined" ? ":SL=" + SL : "") + (typeof NR != "undefined" ? ":NR=" + NR : "") + (typeof FG != "undefined" ? ":FG=" + FG : ""), ".baidu.com", "/", expire30y, true)
    }

    function clearCookie(name) {
        Cookie.clear(name, "/");
        Cookie.clear(name, "/", document.domain);
        Cookie.clear(name, "/", "." + document.domain);
        Cookie.clear(name, "/", ".baidu.com")
    }

    function reset(callback) {
        options = defaultOptions;
        save(callback)
    }
    window.UPS = {
        writeBAIDUID: writeBAIDUID,
        reset: reset,
        get: get,
        set: set,
        save: save
    }
})();
var ie = navigator.userAgent.toLowerCase().match(/msie\s+(\d*)/);
var ie6 = ie && ie[1] == 6;
if (window._is_skin_sam && !ie6) {
    var url = "";
    if (window._is_skin_sam == "1") {
        url = "https://ss1.bdstatic.com/5eN1bjq8AAUYm2zgoY3K/r/www/cache/static/protocol/https/skin/js/skin_1_47132044.js"
    } else {
        if (window._is_skin_sam == "2") {
            url = "https://ss1.bdstatic.com/5eN1bjq8AAUYm2zgoY3K/r/www/cache/static/protocol/https/skin/js/skin_2_29b21d24.js"
        } else {
            if (window._is_skin_sam == "3") {
                url = "https://ss1.bdstatic.com/5eN1bjq8AAUYm2zgoY3K/r/www/cache/static/protocol/https/skin/js/skin_3_ddcfc386.js"
            }
        }
    }
    var skinDefer = null;
    if (url) {
        var skinDefer = $.ajax({
            dataType: "script",
            cache: true,
            url: url
        })
    }
    skinDefer && skinDefer.done(function () {
        $(window).on("swap_end", function () {
            bds.se.skin && new bds.se.skin()
        });
        $(window).on("swap_begin", function () {
            bds.se.skin && bds.se.skin.prototype.dispose()
        })
    })
}(function () {
    var i = {};
    var d = function (k) {
            var j = f(k);
            a(j)
        },
        b = function (j, l) {
            var m = Math.random();
            if (m > 0.2 && m < 0.201 && location.protocol == "http:") {
                i.url = j;
                i.headers = l;
                var k = $.ajax({
                    url: j,
                    headers: l,
                    success: d
                })
            }
        },
        f = function (j) {
            if (typeof j === "string" && typeof i.headers === "object") {
                if (i.headers.hasOwnProperty("content_syni") && j.length !== 12495) {
                    return j
                }
                if (i.headers.hasOwnProperty("content_syns") && j.length !== 19295) {
                    return j
                }
            }
            return "normal"
        },
        a = function (j) {
            $.ajax({
                url: "//www.baidu.com/r/plog",
                type: "post",
                data: {
                    page_html: j
                }
            })
        };
    var g = window.ctwin = {
        sendRequest: b
    }
})();
var bds = bds || {};
bds.se = bds.se || {};
bds.se.speedTester = (function () {
    function a() {}

    function b(j, i, g) {
        g = g || 19558;
        f(j, (function (k) {
            return function (m, n, l) {
                d(k, n, l)
            }
        })(i), (function (k) {
            return function (l) {
                d(k)
            }
        })(i), g)
    }

    function f(k, l, m, g) {
        l = l || a;
        m = m || a;
        var i = new Image();
        i.onload = function () {
            this.onload = this.onerror = null;
            g = this.fileSize || g;
            var o = new Date(),
                p = o - j,
                n = g / p;
            l(this, p, n)
        };
        i.onerror = function () {
            this.onload = this.onerror = null;
            m(this)
        };
        var j = new Date();
        i.src = k
    }

    function d(j, k, i) {
        var g = new Image();
        g.onload = g.onerror = function () {
            this.onload = this.onerror = null
        };
        g.src = (j + (k ? ("&t=" + k + "&v=" + i) : "&t=-1&v=-1") + "&r=" + Math.random())
    }
    return {
        start: b
    }
})();
bds.se.speedMonitor = function (k) {
    var b = k.logPath || "",
        l = k.flag || "default",
        j = k.sleep || "1000",
        i = false,
        n = null;
    var g = [];
    var a = b + "?flag=" + l;

    function f() {
        var o = g.pop();
        if (o) {
            d(o)
        }
        if (i) {
            n = window.setTimeout(f, j)
        }
    }

    function d(o) {
        var r = o.url,
            p = o.size || -1,
            q = [];
        q.push("id=" + encodeURIComponent(o.id));
        q.push("name=" + encodeURIComponent(o.name));
        q.push("url=" + encodeURIComponent(o.url));
        q.push("size=" + encodeURIComponent(o.id));
        for (key in o.logData) {
            q.push(key + "=" + encodeURIComponent(o.logData[key]))
        }
        bds.se.speedTester.start(r, a + "&" + q.join("&"), p)
    }

    function m() {
        return true
    }
    this.start = function () {
        this.stop();
        i = true;
        f()
    };
    this.stop = function () {
        i = false;
        window.clearInterval(n)
    };
    this.addTask = function (o) {
        if (m(o)) {
            g.push(o)
        }
    };
    this.clear = function () {
        g = []
    }
};
setTimeout(function () {
    var b = Math.random();
    if (/14461/.test(bds.comm.sid) && location.protocol == "http:") {
        var a = document.createElement("script");
        a.src = "http://velocity.baidu.com/sp.php";
        document.body.appendChild(a)
    }
}, 1000);
(function (a) {
    var a = a || {};
    a.se = a.se || {};
    a.se.QuickDelete = function (f, d) {
        this.form = f;
        this.options = d;
        this._init()
    };
    a.se.QuickDelete.prototype = {
        constructor: a.se.QuickDelete,
        _init: function () {
            this._create_elem();
            this._bind_event()
        },
        _create_elem: function () {
            var g = this.form,
                i = this.options,
                m = i.top || 0,
                j = i.right || 0,
                f = $.trim(g.val()) ? "block" : "none",
                l = "quickdelete",
                k = g.parent(),
                d = $('<a href="javascript:;"></a>').attr("id", l).attr("title", "清空").addClass("quickdelete");
            k.addClass("quickdelete-wrap").append(d);
            d.css({
                top: m + "px",
                right: j + "px",
                display: f
            });
            i.wrapElem = k;
            i.elem = d
        },
        _show: function () {
            if (a.comm.ishome === 0) {
                this.options.elem.show()
            }
        },
        _hide: function () {
            this.options.elem.hide()
        },
        _bind_event: function () {
            var f = this.form,
                d = this.options.elem,
                g = this;
            f.on("focus", function () {
                $.trim(f.val()) ? g._show() : g._hide()
            }).on("keyup input propertychange", function () {
                $.trim(f.val()) ? g._show() : g._hide()
            });
            d.on("click", function () {
                var i = a.comm.supportis ? 2 : 0;
                ns_c({
                    input_clear: a.comm.ishome + i,
                    delete_query: encodeURIComponent(f.val())
                });
                f.val("").focus();
                g._hide();
                return false
            });
            $(window).on("swap_end index_off", function () {
                $.trim(f.val()) ? g._show() : g._hide()
            })
        }
    };
    var b = new a.se.QuickDelete($("#kw"), {
        top: 0,
        right: 0
    })
})(bds);
if (window.bds && bds.comm && bds.comm.ishome) {
    $(window).on("load", function () {
        if (window.ctwin) {
            window.ctwin.sendRequest("//www.baidu.com/?tn=baidu", {
                content_syni: 1
            })
        }
        if (window.performance && performance.timing) {
            var f = function () {
                var i = g("navigation"),
                    n = g("domainLookup"),
                    q = g("connect"),
                    j = g("secureConnection"),
                    o = g("redirect"),
                    m = g("request"),
                    k = g("response"),
                    l = {
                        start: performance.timing.domLoading,
                        end: performance.timing.domComplete
                    },
                    p = g("loadEvent");
                return {
                    navigation: q.start - i.start,
                    dns: n.value,
                    tcp: q.value,
                    ssl: j.start > 0 ? q.end - j.start : 0,
                    request: k.start - m.start,
                    response: k.value,
                    dom: l.end - l.start,
                    loadEvent: p.end - i.start
                }
            };
            var a = Cookie.get("__bsi");
            var g = function (i) {
                var k = performance.timing,
                    l = k[i + "Start"] ? k[i + "Start"] : 0,
                    j = k[i + "End"] ? k[i + "End"] : 0;
                return {
                    start: l,
                    end: j,
                    value: j - l > 0 ? j - l : 0
                }
            };
            var b = function () {
                var o = [],
                    n = f();
                for (var l in n) {
                    o.push(l + "=" + n[l])
                }
                o.push("protocol=" + encodeURIComponent(location.protocol));
                var p = "//www.baidu.com/nocache/fesplg/s.gif?log_type=hm&type=timing&",
                    q = "";
                q += o.join("&");
                q += "&newindex=" + (window.bds && bds.comm ? bds.comm.newindex : -1);
                if (a) {
                    q += "&bsi=" + a
                }
                var k = p + q,
                    j = new Image(),
                    m = "_LOG_" + new Date().getTime();
                j.onload = function () {
                    delete window[m]
                };
                window[m] = j;
                j.src = k
            };
            var d = Math.random();
            if (/8498/.test(bds.comm.indexSid) && d < 0.01) {
                setTimeout(b, 500)
            }
        }
    })
}

function formatDate(a, d) {
    var b = function (f) {
        return f > 9 ? f : "0" + f
    };
    if (typeof (a) == "number" || typeof (a) == "string") {
        a = new Date(a)
    }
    return [a.getFullYear(), b(a.getMonth() + 1), b(a.getDate())].join(d || "")
}

function baseChangeUrl(a) {
    if (bds.comm.search_tool.st && bds.comm.search_tool.et && bds.comm.search_tool.stftype) {
        if (a.indexOf("&gpc=") < 0) {
            a += "&gpc=" + encodeURIComponent("stf=" + bds.comm.search_tool.st + "," + bds.comm.search_tool.et + "|stftype=" + bds.comm.search_tool.stftype + "")
        }
    }
    if (bds.comm.search_tool.si) {
        if (a.indexOf("&si=") < 0) {
            a += "&si=" + encodeURIComponent(bds.comm.search_tool.si) + "&ct=2097152"
        }
    }
    if (bds.comm.search_tool.sl_lang) {
        if (a.indexOf("&sl_lang=") < 0) {
            a += "&rsv_srlang=" + encodeURIComponent(bds.comm.search_tool.sl_lang);
            a += "&sl_lang=" + encodeURIComponent(bds.comm.search_tool.sl_lang);
            a += "&rsv_rq=" + encodeURIComponent(bds.comm.search_tool.sl_lang)
        }
    }
    changeUrl(a)
}

function langChangeUrl(a, d, b) {
    ns_c({
        fm: "advTool",
        qid: bds.comm.qid,
        title: encodeURI(b),
        rsv_advTool_lang: d
    });
    baseChangeUrl("wd=" + encodeURIComponent($("#kw").val()) + "&" + a + "=" + encodeURIComponent(d) + "&rsv_srlang=" + encodeURIComponent(d) + "&rsv_rq=" + encodeURIComponent(d))
}

function advChangeUrl(d, g, f, a) {
    if (g.indexOf("=") != -1) {
        var b = 1
    } else {
        var b = 0
    }
    ns_c({
        fm: "advTool",
        qid: bds.comm.qid,
        title: encodeURI(f),
        rsv_advTool_time: a,
        rsv_advTool_stet: g.substr(4).replace(",", "_")
    });
    baseChangeUrl("wd=" + encodeURIComponent($("#kw").val()) + "&" + d + "=" + encodeURIComponent(g) + "&tfflag=" + b)
}

function fileChangeUrl(d, b, a) {
    ns_c({
        fm: "advTool",
        qid: bds.comm.qid,
        title: encodeURI(b),
        rsv_advTool_ft: a
    });
    baseChangeUrl("wd=" + encodeURIComponent(queryReplace("filetype", d)))
}

function queryReplace(f, d) {
    if (f && (f == "filetype" || f == "site")) {
        var b = new RegExp("(" + f + "):[^\\s]*[ ]?");
        var a = $("#kw").val();
        if (d == " " || d == null) {
            return a.replace(b, "")
        } else {
            if (a.match(b)) {
                return a.replace(b, "$1:" + d + " ")
            } else {
                return f + ":" + d + " " + a
            }
        }
    } else {
        return a
    }
}

function extChangeUrl(a) {
    if (a) {
        ns_c({
            fm: "advTool",
            qid: bds.comm.qid,
            title: encodeURI("精确匹配"),
            rsv_advTool_ext: 1
        });
        baseChangeUrl('wd="' + encodeURIComponent($("#kw").val()) + '"')
    } else {
        ns_c({
            fm: "advTool",
            qid: bds.comm.qid,
            title: encodeURI("智能匹配"),
            rsv_advTool_ext: 0
        });
        baseChangeUrl("wd=" + encodeURIComponent($("#kw").val().replace(/^\"(.*)\"$/, "$1")))
    }
}
$(window).on("swap_end", function () {
    bds.comm.search_tool && (bds.comm.search_tool.init = false)
});
$(window).on("swap_begin", function () {
    $(document).off("click.searchTool")
});
var langfilterTip, timefilterTip, fileTypeTip, insideSearchTip;
$(document).delegate(".head_nums_cont_outer", "mousedown", function (b) {
    if (typeof (bds.comm.search_tool) != "undefined") {
        if (bds.comm.search_tool.init) {
            return
        }
        bds.comm.search_tool.init = true;
        var f = $(this),
            q = f.find(".search_tool").eq(0),
            d = f.find(".search_tool_close").eq(0),
            a = f.find(".head_nums_cont_inner").eq(0);
        q.on("click", function () {
            a.animate({
                top: 0
            }, 250);
            ns_c({
                fm: "advTool",
                qid: bds.comm.qid,
                title: encodeURI("搜索工具"),
                rsv_advTool: 0
            })
        });
        d.on("click", function () {
            a.animate({
                top: -42
            }, 250, function () {
                if (bds.comm.search_tool.sl_lang == "en" || bds.comm.search_tool.st || bds.comm.search_tool.et || bds.comm.search_tool.si || bds.comm.search_tool.ft || bds.comm.search_tool.exact) {
                    ns_c({
                        fm: "advTool",
                        qid: bds.comm.qid,
                        title: encodeURI("清除"),
                        rsv_advTool: 2
                    });
                    baseChangeUrl("wd=" + encodeURIComponent($("#kw").val().replace(/(filetype:[^\s]* )|(site:[^\s]*)/g, "").replace(/^\"+(.+)\"+$/, "$1")) + "&sl_lang=cn&rsv_srlang=cn&rsv_rq=cn&ct=0&si=&tfflag=0&gpc=" + encodeURIComponent("stf="));
                    $("input[name='gpc'],input[name='si'],input[name='ct']", "form").val("")
                } else {
                    ns_c({
                        fm: "advTool",
                        qid: bds.comm.qid,
                        title: encodeURI("收起工具"),
                        rsv_advTool: 1
                    })
                }
            })
        });
        var p = f.find(".search_tool_la").eq(0);
        if (p.length > 0) {
            var g = "<div class='c-tip-menu c-tip-langfilter'><ul>";
            if (bds.comm.search_tool.sl_lang == "en") {
                g += "<li><a href='javascript:;' onClick='langChangeUrl(\"sl_lang\",\"cn\",this.innerHTML)'>所有网页</a></li>";
                g += "<li><span>英文网页</span></li>"
            } else {
                if (bds.comm.search_tool.sl_lang == "cn") {
                    g += "<li><span>所有网页</span></li>";
                    g += "<li><a href='javascript:;' onClick='langChangeUrl(\"sl_lang\",\"en\",this.innerHTML)'>英文网页</a></li>"
                }
            }
            g += "</li></ul></div>";
            langfilterTip = new bds.se.tip({
                target: p,
                mode: "none",
                content: $(g),
                arrow: {
                    has: 0,
                    offset: 0
                },
                offset: {
                    x: 15,
                    y: 21
                }
            });
            langfilterTip.hide()
        }
        var n = f.find(".search_tool_tf").eq(0);
        if (n.length > 0) {
            var t = "<div class='c-tip-menu c-tip-timerfilter'><ul>";
            if (!bds.comm.search_tool.st && !bds.comm.search_tool.et) {
                t += " <li><span>时间不限</span></li>"
            } else {
                t += " <li><a href='javascript:;' onClick='advChangeUrl(\"gpc\",\"stf\",this.innerHTML,0)'>时间不限</a></li>"
            }
            if (bds.comm.search_tool.st >= bds.comm.search_tool.thisDay && bds.comm.search_tool.stftype == "1") {
                t += " <li><span>一天内</span></li>"
            } else {
                t += " <li><a href='javascript:;' onClick='advChangeUrl(\"gpc\",\"stf=" + bds.comm.search_tool.oneDay + "," + bds.comm.serverTime + "|stftype=1\",this.innerHTML,1)'>一天内</a></li>"
            }
            if (bds.comm.search_tool.st >= bds.comm.search_tool.thisWeek && bds.comm.search_tool.st < bds.comm.search_tool.thisDay && bds.comm.search_tool.stftype == "1") {
                t += " <li><span>一周内</span></li>"
            } else {
                t += " <li><a href='javascript:;' onClick='advChangeUrl(\"gpc\",\"stf=" + bds.comm.search_tool.oneWeek + "," + bds.comm.serverTime + "|stftype=1\",this.innerHTML,2)'>一周内</a></li>"
            }
            if (bds.comm.search_tool.st >= bds.comm.search_tool.thisMonth && bds.comm.search_tool.st < bds.comm.search_tool.thisWeek && bds.comm.search_tool.stftype == "1") {
                t += " <li><span>一月内</span></li>"
            } else {
                t += " <li><a href='javascript:;' onClick='advChangeUrl(\"gpc\",\"stf=" + bds.comm.search_tool.oneMonth + "," + bds.comm.serverTime + "|stftype=1\",this.innerHTML,3)'>一月内</a></li>"
            }
            if (bds.comm.search_tool.st >= bds.comm.search_tool.thisYear && bds.comm.search_tool.st < bds.comm.search_tool.thisMonth && bds.comm.search_tool.stftype == "1") {
                t += " <li><span>一年内</span></li>"
            } else {
                t += " <li><a href='javascript:;' onClick='advChangeUrl(\"gpc\",\"stf=" + bds.comm.search_tool.oneYear + "," + bds.comm.serverTime + "|stftype=1\",this.innerHTML,4)'>一年内</a></li>"
            }
            t += " <li class='c-tip-custom'>";
            t += " <hr />自定义";
            t += " <p class='c-tip-custom-st'>从<input name='st' date-min='0' date-max='" + formatDate(bds.comm.serverTime * 1000) + "' type='txt' autocomplete='off' ";
            if (bds.comm.search_tool.st && bds.comm.search_tool.et && bds.comm.search_tool.stftype == "2") {
                t += "value='" + formatDate(bds.comm.search_tool.st * 1000, "-") + "' data-value='" + bds.comm.search_tool.st * 1000 + "' class='c-tip-custom-input'/></p>"
            } else {
                t += "value='" + formatDate(bds.comm.serverTime * 1000, "-") + "' data-value='' class='c-tip-custom-input c-tip-custom-input-init'/></p>"
            }
            t += "  <p class='c-tip-custom-et'>至<input name='et' date-min='0' date-max='" + formatDate(bds.comm.serverTime * 1000) + "' type='txt' autocomplete='off' ";
            if (bds.comm.search_tool.st && bds.comm.search_tool.et && bds.comm.search_tool.stftype == "2") {
                t += "value='" + formatDate(bds.comm.search_tool.et * 1000, "-") + "' data-value='" + bds.comm.search_tool.et * 1000 + "' class='c-tip-custom-input'/></p>"
            } else {
                t += "value='" + formatDate(bds.comm.serverTime * 1000, "-") + "' data-value='' class='c-tip-custom-input c-tip-custom-input-init'/></p>"
            }
            t += "<div class='c-tip-timerfilter-custom-error'>自定义时间错误！</div>";
            t += "<a href='javascript:;' class='c-tip-custom-submit'>确认</a>";
            t += "</li></ul></div>";
            timefilterTip = new bds.se.tip({
                target: n,
                mode: "none",
                content: $(t),
                arrow: {
                    has: 0,
                    offset: 0
                },
                offset: {
                    x: 15,
                    y: 21
                },
                onShow: function () {
                    if ($(this.getTarget()).width() > 95) {
                        $("ul", this.getDom()).width($(this.getTarget()).width() + 20)
                    }
                    $(".c-tip-custom-input").on("click", function (D) {
                        var E = this,
                            y = null,
                            x = new Date(),
                            C = $(E).parents(".c-tip-custom"),
                            w = C.find("input[name='st']"),
                            z = C.find("input[name='et']");
                        if ($(E).attr("data-value")) {
                            x.setTime($(E).attr("data-value"))
                        }
                        $(E).parents(".c-tip-custom").find(".c-tip-custom-input").removeClass("c-tip-custom-input-focus");
                        $(E).addClass("c-tip-custom-input-focus");
                        if ($("#c-tip-custom-calenderCont").length == 0) {
                            $(E).parents(".c-tip-custom").append("<div id='c-tip-custom-calenderCont'></div>")
                        }
                        $("#c-tip-custom-calenderCont").html("");
                        var B = {
                            element: "c-tip-custom-calenderCont",
                            date: formatDate(x),
                            between: [$(E).attr("date-min") - 0, $(E).attr("date-max") - 0],
                            onSelectDay: function (H, I) {
                                H += "";
                                if (E.name == "st") {
                                    var F = new Date(H.substr(0, 4), H.substr(4, 2) - 1, H.substr(6, 2), 0, 0, 0);
                                    z.attr("date-min", H)
                                } else {
                                    var F = new Date(H.substr(0, 4), H.substr(4, 2) - 1, H.substr(6, 2), 23, 59, 59);
                                    w.attr("date-max", H)
                                }
                                $(E).val(formatDate(F, "-"));
                                $(E).attr("data-value", F.getTime());
                                $("#c-tip-custom-calenderCont").hide();
                                $(E).removeClass("c-tip-custom-input-focus").removeClass("c-tip-custom-input-init")
                            }
                        };
                        if (typeof (WCal) == "undefined") {
                            $.getScript("https://ss1.bdstatic.com/5eN1bjq8AAUYm2zgoY3K/r/www/cache/static/protocol/https/plugins/new_wcal_caae086b.js", function () {
                                y = new WCal(B);
                                if (x) {
                                    y.setDay(formatDate(x), function (F) {
                                        F.className += " op_mon_day_selected"
                                    })
                                }
                            })
                        } else {
                            y = new WCal(B);
                            if (x) {
                                y.setDay(formatDate(x), function (F) {
                                    F.className += " op_mon_day_selected"
                                })
                            }
                        }
                        $("#c-tip-custom-calenderCont").css({
                            top: $(this).position().top - 2,
                            left: $(this).position().left + $(this).width() + 15,
                            display: "block"
                        });
                        D.stopPropagation()
                    });
                    $(".c-tip-custom-input").on("focus", function (w) {
                        $(this).removeClass("c-tip-custom-input-init")
                    });
                    $(".c-tip-custom-input").on("blur", function (x) {
                        var z = this;

                        function y(D) {
                            var C = /^\s*(\d{4})-(\d\d)-(\d\d)\s*$/,
                                B = new Date(NaN),
                                F, E = C.exec(D);
                            if (E) {
                                F = +E[2];
                                B.setFullYear(E[1], F - 1, E[3]);
                                if (F != B.getMonth() + 1) {
                                    B.setTime(NaN)
                                }
                            }
                            return B
                        }
                        var w = y($(z).val());
                        if (w instanceof Date && w.getTime()) {
                            $(z).attr("data-value", w.getTime());
                            $(".c-tip-timerfilter-custom-error").hide()
                        } else {
                            if ($(z).val() == "") {
                                $(z).attr("data-value", "0");
                                $(".c-tip-timerfilter-custom-error").hide()
                            } else {
                                $(z).attr("data-value", "");
                                $(".c-tip-timerfilter-custom-error").show()
                            }
                        }
                    });
                    try {
                        $(".c-tip-custom-submit").off("click.searchTool").on("click.searchTool", function (y) {
                            var B = this,
                                z = $(B).parents(".c-tip-custom"),
                                w = parseInt($(".c-tip-custom-input", z)[0].getAttribute("data-value") / 1000),
                                x = parseInt($(".c-tip-custom-input", z)[1].getAttribute("data-value") / 1000);
                            $("#c-tip-custom-calenderCont").hide();
                            if (w == "" || !w) {
                                w = 0
                            }
                            if ((x == "" || !x) && w && w != "") {
                                x = parseInt((new Date()).setHours(23, 59, 58) / 1000)
                            }
                            if (x > bds.comm.serverTime) {
                                if (w <= 0) {
                                    w = "", x = ""
                                } else {
                                    x = parseInt((new Date()).setHours(23, 59, 58) / 1000)
                                }
                            }
                            if (w > x || w > bds.comm.serverTime) {
                                $(".c-tip-timerfilter-custom-error").show();
                                y.stopPropagation();
                                return
                            }
                            if (w == 0 && x == 0) {
                                w = "", x = ""
                            }
                            $(".c-tip-timerfilter-custom-error").hide();
                            advChangeUrl("gpc", "stf=" + w + "," + x + "|stftype=2", "自定义时间:" + w + "|" + x, 5)
                        })
                    } catch (u) {}
                }
            });
            timefilterTip.hide()
        }
        var m = f.find(".search_tool_ft").eq(0);
        if (m.length > 0) {
            var l = "<div class='c-tip-menu c-tip-timerfilter c-tip-timerfilter-ft'><ul>";
            if (!bds.comm.search_tool.ft) {
                l += " <li><span>所有网页和文件(不限格式)</span></li>"
            } else {
                l += " <li><a href='javascript:;' onClick='fileChangeUrl(null,this.innerHTML,0)'>所有网页和文件(不限格式)</a></li>"
            }
            if (bds.comm.search_tool.ft == "pdf") {
                l += " <li><span>Adobe Acrobat PDF(.pdf)</span></li>"
            } else {
                l += " <li><a href='javascript:;' onClick='fileChangeUrl(\"pdf\",this.innerHTML,1)'>Adobe Acrobat PDF(.pdf)</a></li>"
            }
            if (bds.comm.search_tool.ft == "doc") {
                l += " <li><span>微软 Word(.doc)</span></li>"
            } else {
                l += " <li><a href='javascript:;' onClick='fileChangeUrl(\"doc\",this.innerHTML,2)'>微软 Word(.doc)</a></li>"
            }
            if (bds.comm.search_tool.ft == "xls") {
                l += " <li><span>微软 Excel(.xls)</span></li>"
            } else {
                l += " <li><a href='javascript:;' onClick='fileChangeUrl(\"xls\",this.innerHTML,3)'>微软 Excel(.xls)</a></li>"
            }
            if (bds.comm.search_tool.ft == "ppt") {
                l += " <li><span>微软 PowerPoint(.ppt)</span></li>"
            } else {
                l += " <li><a href='javascript:;' onClick='fileChangeUrl(\"ppt\",this.innerHTML,4)'>微软 PowerPoint(.ppt)</a></li>"
            }
            if (bds.comm.search_tool.ft == "rtf") {
                l += " <li><span>RTF 文件(.rtf)</span></li>"
            } else {
                l += " <li><a href='javascript:;' onClick='fileChangeUrl(\"rtf\",this.innerHTML,5)'>RTF 文件(.rtf)</a></li>"
            }
            l += "</ul></div>";
            var o = new bds.se.tip({
                target: m,
                mode: "none",
                content: $(l),
                arrow: {
                    has: 0,
                    offset: 0
                },
                offset: {
                    x: 15,
                    y: 21
                }
            });
            o.hide()
        }
        var k = f.find(".search_tool_si").eq(0);
        if (k.length > 0) {
            insideSearchTip = new bds.se.tip({
                target: k,
                mode: "none",
                content: $("<div class='c-tip-menu c-tip-timerfilter c-tip-timerfilter-si'><ul> <li><input name='si' type='txt' class='c-tip-si-input c-gap-bottom-small c-gap-right-small' autocomplete='off' value='" + bds.comm.search_tool.si + "' placeholder='例如:baidu.com' /><a href='javascript:;' class='c-tip-timerfilter-si-submit'>确认</a></li> <li><p class='c-tip-timerfilter-si-error'>无法识别，正确格式：baidu.com</p></li></ul></div>"),
                arrow: {
                    has: 0,
                    offset: 0
                },
                offset: {
                    x: 15,
                    y: 21
                },
                onShow: function () {
                    $(".c-tip-si-input").on("focus", function (w) {
                        $(this).addClass("c-tip-si-input-focus")
                    });
                    $(".c-tip-si-input").on("blur", function (w) {
                        $(this).removeClass("c-tip-si-input-focus")
                    });
                    try {
                        $(".c-tip-timerfilter-si-submit").off("click.searchTool").on("click.searchTool", function (y) {
                            var B = this,
                                z = $(B).parents(".c-tip-timerfilter-si"),
                                w = $("input", z).val(),
                                x = queryReplace("site");
                            if (w == "") {
                                ns_c({
                                    fm: "advTool",
                                    qid: bds.comm.qid,
                                    title: encodeURI("站内检索:" + w),
                                    rsv_advTool_si: encodeURI(w)
                                });
                                baseChangeUrl("wd=" + encodeURIComponent(x) + "&si=&ct=0")
                            } else {
                                if (w.match(/^[\w\-_]+(\.[\w\-_]+)+$/)) {
                                    $(".c-tip-timerfilter-si-error").hide();
                                    ns_c({
                                        fm: "advTool",
                                        qid: bds.comm.qid,
                                        title: encodeURI("站内检索:" + w),
                                        rsv_advTool_si: encodeURI(w)
                                    });
                                    baseChangeUrl("wd=" + encodeURIComponent(x) + "&si=" + encodeURIComponent(w) + "&ct=2097152")
                                } else {
                                    $(".c-tip-timerfilter-si-error").show();
                                    y.stopPropagation();
                                    y.preventDefault();
                                    return false
                                }
                            }
                        })
                    } catch (u) {}
                }
            });
            insideSearchTip.hide()
        }
        var j = true;
        p.on("click", function (u) {
            if (j) {
                langfilterTip && langfilterTip.show();
                j = false;
                timefilterTip && timefilterTip.hide();
                i = true;
                o && o.hide();
                s = true;
                insideSearchTip && insideSearchTip.hide();
                r = true;
                ns_c({
                    fm: "advTool",
                    qid: bds.comm.qid,
                    title: encodeURI("语言筛选浮层展现"),
                    rsv_advTool_tip: 1
                });
                $(document).on("click.searchTool", function (w) {
                    if ($(w.target).parents(".c-tip-langfilter").length == 0 && langfilterTip) {
                        langfilterTip.hide();
                        j = true;
                        $(document).off("click.searchTool")
                    }
                })
            } else {
                langfilterTip && langfilterTip.hide();
                j = true;
                $(document).off("click.searchTool")
            }
            u.stopPropagation()
        });
        var i = true;
        n.on("click", function (u) {
            if (i) {
                langfilterTip && langfilterTip.hide();
                j = true;
                timefilterTip && timefilterTip.show();
                i = false;
                o && o.hide();
                s = true;
                insideSearchTip && insideSearchTip.hide();
                r = true;
                ns_c({
                    fm: "advTool",
                    qid: bds.comm.qid,
                    title: encodeURI("时间筛选浮层展现"),
                    rsv_advTool_tip: 0
                });
                $(document).on("click.searchTool", function (w) {
                    if ($(w.target).parents(".c-tips-container,#c-tip-custom-calenderCont").length == 0 && timefilterTip) {
                        timefilterTip.hide();
                        $("#c-tip-custom-calenderCont").hide();
                        timefilterTip.getDom().find(".c-tip-custom-input-focus").removeClass("c-tip-custom-input-focus");
                        i = true;
                        $(document).off("click.searchTool")
                    }
                })
            } else {
                timefilterTip && timefilterTip.hide();
                i = true;
                $(document).off("click.searchTool")
            }
            u.stopPropagation()
        });
        var s = true;
        m.on("click", function (u) {
            if (s) {
                langfilterTip && langfilterTip.hide();
                j = true;
                timefilterTip && timefilterTip.hide();
                i = true;
                o && o.show();
                s = false;
                insideSearchTip && insideSearchTip.hide();
                r = true;
                ns_c({
                    fm: "advTool",
                    qid: bds.comm.qid,
                    title: encodeURI("网页格式浮层展现"),
                    rsv_advTool_tip: 2
                });
                $(document).on("click.searchTool", function (w) {
                    if ($(w.target).parents(".c-tip-timerfilter-ft").length == 0 && o) {
                        o.hide();
                        s = true;
                        $(document).off("click.searchTool")
                    }
                })
            } else {
                o && o.hide();
                s = true;
                $(document).off("click.searchTool")
            }
            u.stopPropagation()
        });
        var r = true;
        k.on("click", function (u) {
            if (r) {
                langfilterTip && langfilterTip.hide();
                j = true;
                timefilterTip && timefilterTip.hide();
                i = true;
                o && o.hide();
                s = true;
                insideSearchTip && insideSearchTip.show();
                r = false;
                ns_c({
                    fm: "advTool",
                    qid: bds.comm.qid,
                    title: encodeURI("站内搜索浮层展现"),
                    rsv_advTool_tip: 3
                });
                $(document).on("click.searchTool", function (w) {
                    if ($(w.target).parents(".c-tip-timerfilter-si").length == 0 && insideSearchTip) {
                        insideSearchTip.hide();
                        r = true;
                        $(document).off("click.searchTool")
                    }
                })
            } else {
                insideSearchTip && insideSearchTip.hide();
                r = true;
                $(document).off("click.searchTool")
            }
            u.stopPropagation()
        })
    }
});
(function () {
    bds.se.skeleton = function () {
        var b;
        return function () {
            if (!b) {
                b = a();
                $(window).one("swap_begin", function () {
                    b = null
                })
            }
            return b
        }
    }();

    function a() {
        var d = {},
            b = {};
        var g = $("#wrapper");
        d.topResult = g.find("#con-at").find(".result-op");
        d.rightResult = g.find("#con-ar").find(".result-op");
        d.leftResult = g.find("#content_left").find(".result, .result-op");
        if (d.topResult.length) {
            b.T = [];
            d.topResult.each(function () {
                b.T.push(f("T", $(this)))
            })
        }
        if (d.rightResult.length) {
            b.R = [];
            d.rightResult.each(function () {
                b.R.push(f("R", $(this)))
            })
        }
        if (d.leftResult.length) {
            b.L = [];
            d.leftResult.each(function () {
                b.L.push(f("L", $(this)))
            })
        }
        return b;

        function f(j, i) {
            var n = {
                top: i.offset().top,
                left: i.offset().left
            };
            var k = {
                width: i.width(),
                height: i.height()
            };
            var l = function () {
                var p = i.attr("data-click");
                if (p) {
                    try {
                        return $.parseJSON(p)
                    } catch (o) {}
                }
            }() || {};
            var m = j + (l.p5 || "");
            return {
                id: m,
                pos: n,
                size: k,
                dataClick: l,
                dom: i
            }
        }
    }
})();
(function () {
    $(window).on("swap_end", function () {
        var a = function () {
            var f = [];
            var b = bds.se.skeleton();
            var d = b.L;
            $.each(d, function (j, g) {
                var k = {};
                k.dom = g.dom;
                k.id = g.id;
                k.itime = 0;
                k.time = 0;
                f.push(k)
            });
            return f
        };
        bds.comm.orderplay = a()
    })
})();
(function () {
    bds.se.display = function () {
        var b = new a()
    };

    function a() {
        var b = this;
        b.display = {};
        b.expand = {};
        b.dom = {};
        b.init()
    }
    a.prototype = {
        init: function () {
            var b = this;
            b.dom = bds.se.skeleton();
            var d = $("#wrapper");
            b.dom.rsResult = d.find("#rs a");
            b.dom.hintResult = d.find(".se_common_hint");
            b.rs = b.dom.rsResult.length || 0;
            b.hint = b.dom.hintResult.length || 0;
            b.display.base = b.getBase();
            b.dom.L && b.getResult(b.dom.L);
            b.dom.R && b.getResult(b.dom.R);
            b.dom.T && b.getResult(b.dom.T);
            if (b.rs) {
                b.display.rs = b.getRS()
            }
            if (b.hint) {
                b.display.hint = b.getHint()
            }
            b.send()
        },
        send: function () {
            var j = this;
            for (var m in j.display) {
                var g = {};
                g[m] = j.display[m];
                bds.log.send.sendPack("new_disp", g)
            }
            for (var l in j.expand) {
                if (l && j.expand[l]) {
                    for (var d in j.expand[l]) {
                        if (d && j.expand[l][d] && j.expand[l][d].length) {
                            var k = j.expand[l][d];
                            for (var b = 0; b < k.length; b++) {
                                var f = {};
                                f[l] = {
                                    expand: {}
                                };
                                f[l].expand[d] = {};
                                f[l].expand[d][b] = k[b];
                                bds.log.send.sendPack("new_disp", f)
                            }
                        }
                    }
                }
            }
        },
        getBase: function () {
            var b = this;
            var d = {};
            d.qid = bds.comm.qid || "";
            d.tpl = bds.comm.resTemplateName || "";
            d.async = bds.comm.supportis ? 1 : 0;
            d.page = bds.comm.pageNum || 1;
            d.upn = $.getCookie("BD_UPN") || "";
            b.dom.L && (d.left = b.dom.L.length);
            b.dom.R && (d.right = b.dom.R.length);
            b.dom.T && (d.top = b.dom.T.length);
            d.size = {};
            d.size.doc = {
                w: $(document).width(),
                h: $(document).height()
            };
            d.size.wind = {
                w: $(window).width(),
                h: $(window).height()
            };
            d.size.scr = {
                w: screen.width,
                h: screen.height
            };
            return d
        },
        getRS: function () {
            var d = this;
            var b = {};
            b.num = d.rs;
            b.query = [];
            d.dom.rsResult.each(function (g) {
                var f = this.textContent || this.innerText;
                b.query.push(f)
            });
            return b
        },
        getHint: function () {
            var b = this;
            var d = {};
            d.result = [];
            b.dom.hintResult.each(function (g) {
                var f = {};
                f.id = this.getAttribute("data-id") || 0;
                f.tpl = this.getAttribute("data-tpl") || "";
                d.result.push(f)
            });
            return d
        },
        getResult: function (d) {
            var j = this,
                b = d;
            for (var g = 0, f = Math.min(b.length, 10); g < f; g++) {
                var l = b[g].id,
                    k = j.getResultDisplay(b[g]);
                j.expand[l] = k.expand;
                delete k.expand;
                j.display[l] = k
            }
        },
        getResultDisplay: function (d) {
            var m = this;
            var s = d.dom,
                j = d.dataClick,
                g = {};
            g.id = j.p5 || "";
            g.srcid = j.rsv_srcid || s.attr("srcid") || 0;
            g.tpl = s.attr("tpl") || "";
            g.mu = j.mu || s.attr("mu") || "";
            g.fm = j.fm || "as";
            s.is(":hidden") && (g.show = 0);
            if (g.show == 0) {
                return g
            }
            g.size = r();
            g.pos = l();
            q() && (g.bdr = q());
            g.com = i();
            var f = n(),
                k = b(),
                o = p();
            if (f || k || o) {
                g.expand = {};
                if (f) {
                    g.link = f.length;
                    g.expand.links = f
                }
                if (k) {
                    g.img = k.length;
                    g.expand.imgs = k
                }
                if (o) {
                    g.app = o.length;
                    g.expand.apps = o
                }
            }
            return g;

            function r() {
                var t = d.size;
                return {
                    w: t.width || 0,
                    h: t.height || 0
                }
            }

            function l() {
                var t = d.pos;
                return {
                    t: t.top || 0,
                    l: t.left || 0
                }
            }

            function q() {
                if (j.rsv_bdr && j.rsv_bdr != 0) {
                    return j.rsv_bdr
                } else {
                    if (s.hasClass(".c-border") || s.find(".c-border").length) {
                        return 5
                    } else {
                        return 0
                    }
                }
            }

            function i() {
                var u = {};
                t(".favurl") && (u.fi = 1);
                t(".c-text-public.c-text-mult") && (u.gwi = 1);
                t(".icon-unsafe-icon") && (u.fxi = 1);
                t(".c-icon-v") && (u.vi = 1);
                t(".c-icon-med") && (u.yjji = 1);
                t(".c-icon-air") && (u.hxi = 1);
                t(".c-recommend") && (u.cr = 1);
                return u;

                function t(x) {
                    var w;
                    if (x) {
                        w = s.find(x)
                    }
                    if (w && w.length) {
                        return true
                    } else {
                        return false
                    }
                }
            }

            function n() {
                var w = s.find("a").not(":hidden").not("h3 a, .m");
                var t = [];
                var x = /^((https?:)?\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*(:\d+)*(\/.*)*/;
                var u = /^(\/s\?)/;
                w.each(function (B) {
                    var y = this.getAttribute("href");
                    if (y && x.test(y)) {
                        var z = y && y.match(/.*\/link\?url=([^&]*).*/);
                        if (z && z.length && z.length > 0 && z[1]) {
                            t.push(z[1])
                        } else {
                            t.push(y)
                        }
                    } else {
                        if (y && u.test(y)) {
                            t.push(y)
                        }
                    }
                });
                if (t.length) {
                    return t
                } else {
                    return false
                }
            }

            function b() {
                var t = [];
                var u = s.find("img").not(":hidden").not("[data-nolog]");
                if (u.length) {
                    u.each(function (x) {
                        var w = {
                            w: this.width,
                            h: this.height
                        };
                        t.push({
                            size: w
                        })
                    });
                    return t
                } else {
                    return false
                }
            }

            function p() {
                var u = [];
                var t = s.find("object, video, audio");
                if (t.length) {
                    t.each(function (x) {
                        var w = $(this);
                        var y = {};
                        if (w.is("object") && w.attr("type") && w.attr("type").indexOf("flash") >= 0) {
                            y.type = 1
                        } else {
                            if (w.is("video")) {
                                y.type = 2
                            } else {
                                if (w.is("audio")) {
                                    y.type = 3
                                } else {
                                    y.type = 0
                                }
                            }
                        }
                        y.size = {
                            w: w.width(),
                            h: w.height()
                        };
                        u.push(y)
                    });
                    return u
                } else {
                    return false
                }
            }
        }
    }
})();
(function () {
    function a() {
        this.pageElementsList = [];
        this.scrollTime = null;
        this.scrollChange = false;
        this.resizeTime = null;
        this.resizeChange = false;
        this.scrollTop = $(document).scrollTop();
        this.scrollLeft = $(document).scrollLeft();
        this.windowHeight = $(window).height();
        this.windowWidth = $(window).width()
    }
    a.prototype = {
        init: function () {
            var b = bds.se.skeleton();
            var d = this;
            $.each(["L", "R", "T"], function (f, g) {
                if (b[g]) {
                    $.merge(d.pageElementsList, d.getDom(b[g]));
                    d.bindEvent(b[g])
                }
            })
        },
        getDom: function (b) {
            var d = [];
            $.each(b, function (f, j) {
                var g = {};
                g.top = j.pos.top;
                g.height = j.size.height;
                g.id = j.id;
                g.visible = 0;
                d.push(g)
            });
            return d
        },
        sendLog: function (d, b) {
            if (bds.comm.globalLogFlag && bds.comm.globalLogFlag == 1) {
                bds.log.send.sendPack(d, b)
            }
        },
        bindEvent: function (b) {
            var d = this;
            $.each(b, function (g, l) {
                var k = 200;
                var j = false;
                var f = null;
                l.dom.bind("mouseenter.useraction", function () {
                    if (f !== null) {
                        clearTimeout(f)
                    }
                    f = setTimeout(function () {
                        d.sendLog("new_view", {
                            type: "mouseIn",
                            id: l.id,
                            t: new Date().getTime()
                        });
                        j = true;
                        f = null
                    }, k)
                }).bind("mouseleave.useraction", function () {
                    if (f !== null) {
                        clearTimeout(f);
                        f = null
                    }
                    if (j) {
                        d.sendLog("new_view", {
                            type: "mouseOut",
                            id: l.id,
                            t: new Date().getTime()
                        });
                        j = false
                    }
                })
            })
        },
        destroy: function () {
            $(window).unbind(".useraction");
            this.pageElementsList.splice(0, this.pageElementsList.length)
        },
        sight: function () {
            var b = this;
            $.each(this.pageElementsList, function (g, k) {
                var j = (b.scrollTop < k.top + k.height) && (b.scrollTop + b.windowHeight > k.top);
                if (k.visible === 1 && !j) {
                    b.sendLog("new_view", {
                        type: "sight",
                        resid: k.id,
                        action: "out",
                        t: new Date().getTime()
                    });
                    if (bds.comm.orderplay && bds.comm.orderplay.length && k.id.substr(0, 1) == "L" && bds.comm.pageSize) {
                        var d = (parseInt(k.id.substr(1)) - 1) % bds.comm.pageSize;
                        var f = bds.comm.orderplay[d];
                        if (f) {
                            f.time += new Date().getTime() - f.itime;
                            f.itime = new Date().getTime()
                        }
                    }
                    k.visible = 0
                } else {
                    if (k.visible === 0 && j) {
                        b.sendLog("new_view", {
                            type: "sight",
                            resid: k.id,
                            action: "in",
                            t: new Date().getTime()
                        });
                        if (bds.comm.orderplay && bds.comm.orderplay.length && k.id.substr(0, 1) == "L" && bds.comm.pageSize) {
                            var d = (parseInt(k.id.substr(1)) - 1) % bds.comm.pageSize;
                            var f = bds.comm.orderplay[d];
                            if (f && !f.itime) {
                                f.itime = new Date().getTime()
                            }
                        }
                        k.visible = 1
                    }
                }
            })
        },
        collectPoint: function (d, i) {
            var f = d + "Time";
            var k = d + "Change";
            var j = this;
            if (j[f] === null) {
                g()
            }

            function g() {
                j[f] = setTimeout(function () {
                    j.sendLog("new_view", b(d));
                    j[k] = false;
                    j.sight();
                    if (j[k]) {
                        g()
                    } else {
                        j[f] = null
                    }
                }, 1000)
            }

            function b(l) {
                if (l === "resize") {
                    var n = $(window);
                    j.windowHeight = n.height();
                    j.windowWidth = n.width();
                    return {
                        type: "resize",
                        t: new Date().getTime(),
                        height: j.windowHeight,
                        width: j.windowWidth
                    }
                } else {
                    if (l === "scroll") {
                        var m = $(document);
                        j.scrollTop = m.scrollTop();
                        j.scrollLeft = m.scrollLeft();
                        return {
                            type: "scroll",
                            t: new Date().getTime(),
                            offsetX: j.scrollTop,
                            offsetY: j.scrollLeft
                        }
                    }
                }
            }
        },
        collect: function () {
            this.init();
            var b = this;
            if (this.resizeTime !== null) {
                clearTimeout(this.resizeTime)
            }
            this.resizeTime = null;
            if (this.scrollTime !== null) {
                clearTimeout(this.scrollTime)
            }
            this.scrollTime = null;
            $(window).bind("focus.useraction", function () {
                b.sendLog("new_view", {
                    type: "focus",
                    t: new Date().getTime()
                })
            }).bind("blur.useraction", function () {
                b.sendLog("new_view", {
                    type: "blur",
                    t: new Date().getTime()
                })
            }).bind("resize.useraction", function (d) {
                b.resizeChange = true;
                b.collectPoint("resize", d)
            }).bind("scroll.useraction", function (d) {
                b.scrollChange = true;
                b.collectPoint("scroll", d)
            });
            this.sight()
        },
        outInterface: function () {
            var b = this;
            return {
                collect: function () {
                    b.collect()
                },
                destroy: function () {
                    b.destroy()
                }
            }
        }
    };
    bds.se.userAction = new a().outInterface()
})();
bds.comm.recommends = {};
bds.comm.recommends.recommWidth = 0;
bds.se.recommend = function (b) {
    var a = this;
    a.op = $.extend({}, a._default, b);
    a.id = a.op.target.attr("id");
    a.init()
};
bds.se.recommend.prototype = {
    constructor: bds.se.recommend,
    __init__: false,
    currInstance: null,
    recommDom: null,
    arrowDom: null,
    cssDom: null,
    loadDom: null,
    global: {},
    _default: {
        target: "",
        arrowOffset_s: -54,
        arrowOffset_l: -151,
        container_s: 276,
        container_l: 368,
        startOpacity: 0.3,
        endOpacity: 1
    },
    init: function () {
        var a = this;
        if (a.currInstance && a.currInstance.id == a.id) {
            return
        }
        a.delay = {
            overIcon: null,
            loader: null,
            overArrow: null
        };
        a.doWhat(function () {
            if (!a.__init__) {
                bds.se.recommend.prototype.__init__ = true;
                a.createRecommDom()
            }
            a.createArrowDom();
            a.delay.overArrow = setTimeout(function () {
                var b = a.op.arrowDom.find(".rrecom-btn");
                if (b.css("display") == "none") {
                    b.show()
                }
                a.moveArrow(function () {
                    b.addClass("rrecom-btn-hover");
                    a.showRecommDom()
                })
            }, 100)
        })
    },
    dispose: function () {
        bds.se.recommend.prototype.currInstance = null;
        bds.se.recommend.prototype.recommDom && bds.se.recommend.prototype.recommDom.remove();
        bds.se.recommend.prototype.cssDom && bds.se.recommend.prototype.cssDom.remove();
        bds.comm.recommends = {};
        bds.se.recommend.prototype.__init__ = false;
        $(window).off("resize.recommend container_resize.recommend scroll.recommend")
    },
    createArrowDom: function () {
        var d = this;
        var a = d.op.target.find(".rrecom-btn-parent");
        if (a.length) {
            d.op.arrowDom = a
        } else {
            var b = ['<span class="rrecom-btn-parent rrecom-btn-s">', '<span class="rrecom-btn">', "<span></span>", "</span>", "</span>"].join("");
            d.op.arrowDom = $(b);
            d.op.arrowDom.on("click", ".rrecom-btn", function () {
                d.hideRecommDom();
                return
            });
            d.op.target.css({
                position: "relative"
            }).append(d.op.arrowDom)
        }
    },
    resetArrow: function () {
        var a = this;
        a.op.arrowDom.css({
            right: a.op.arrowOffset_s
        }).removeClass("rrecom-btn-click rrecom-btn-moving").find(".rrecom-btn").stop().hide().removeClass("rrecom-btn-hover")
    },
    setArrowPos: function () {
        var a = this;
        if (a.currInstance) {
            if (bds.comm.containerSize === "l") {
                a.currInstance.op.arrowDom.css("right", a.op.arrowOffset_l)
            } else {
                a.currInstance.op.arrowDom.css("right", a.op.arrowOffset_s)
            }
        }
    },
    moveArrow: function (a) {
        var d = this;
        var b = {
            opacity: d.op.endOpacity
        };
        if (bds.comm.containerSize === "l") {
            b.right = d.op.arrowOffset_l
        } else {
            b.right = d.op.arrowOffset_s
        }
        d.op.arrowDom.stop().addClass("rrecom-btn-moving rrecom-btn-click").animate(b, 0, function () {
            if (d.currInstance && d.currInstance !== d) {
                d.currInstance.resetArrow()
            }
            a()
        })
    },
    log: function (a) {
        var g = {};
        var l = this.op.target.attr("data-click");
        var o = this.op.target.attr("srcid");
        var k = this.op.target.attr("tpl");
        var p = this.op.target.attr("mu");
        if (o) {
            g.rsv_srcid = o
        }
        if (k) {
            g.rsv_tpl = k
        }
        if (p) {
            g.mu = p
        }
        if (l) {
            $.extend(g, $.parseJSON(l))
        }
        if (g.p1 && !g.p5) {
            g.p5 = g.p1
        }
        if (g.p5 && !g.p1) {
            g.p1 = g.p5
        }
        if (!g.p1 && !g.p5) {
            var n = $("#content_left").get(0);
            var d = n.children;
            var m = 1;
            for (var f = 0, j = d.length; f < j; f++) {
                if (d[f].nodeType == 1 && d[f].className && /\bresult(\-op)?\b/.test(d[f].className)) {
                    if (d[f] === this.op.target.get(0)) {
                        g.p1 = m;
                        g.p5 = m;
                        break
                    }
                    m++
                }
            }
        }
        g.fm = "beha";
        var b = this.op.target.find(".t>a").eq(0);
        g.rsv_re_fcurl = b.length ? b.attr("href") : p;
        g.rsv_re_fcurl = g.rsv_re_fcurl || "";
        g.rsv_re_fcurl = encodeURIComponent(g.rsv_re_fcurl);
        return c($.extend(g, a))
    },
    getLeftP: function () {
        var a = this.op.target.attr("data-click");
        a = $.parseJSON(a) || {};
        if (a.p1 && !a.p5) {
            a.p5 = a.p1
        }
        if (a.p5 && !a.p1) {
            a.p1 = a.p5
        }
        if (!a.p5 && !a.p1) {
            a.p1 = 1;
            a.p5 = 1
        }
        return {
            p1: a.p1,
            p5: a.p5
        }
    },
    s_log: function () {
        this.log({
            rsv_re_fc: 2
        })
    },
    setCacheData: function (a) {
        bds.comm.recommends[this.id] = a
    },
    getCacheData: function () {
        return bds.comm.recommends[this.id]
    },
    doWhat: function (a) {
        var b = this.getCacheData();
        if (b !== "[NO DATA]") {
            if (b) {
                a()
            } else {
                this.getRemoteData(a)
            }
        } else {}
    },
    getJsonp: function (a) {
        var j = this.op.target.find(".t>a").eq(0);
        var f = (j.length ? j.attr("href") : this.op.target.attr("mu")) || "";
        var d = f && f.match(/.*url=([^&]*).*/);
        var i = bds.comm.query;
        if (d && d.length && d.length > 0 && d[1]) {
            f = d[1];
            var b = "http://lcr.open.baidu.com/link?url=" + encodeURIComponent(f) + "&query=" + encodeURIComponent(i);
            var g = window.bds && bds.util && bds.util.domain && bds.util.domain.get(b);
            return ($.ajax({
                url: g,
                dataType: "jsonp",
                jsonp: "cb",
                data: {
                    data_name: a,
                    ie: "utf-8",
                    oe: "utf-8",
                    format: "json",
                    t: Date.parse(new Date())
                }
            }))
        }
    },
    getRemoteData: function (a) {
        var b = this;
        $.when(this.getJsonp("recommend_common_merger_rcmd")).then(function (d) {
            if (d && d.data && d.data.length && d.data[0]) {
                if (d.data[0].hintData) {
                    b.asynClkRcmd(d.data[0].hintData)
                }
                if (d.data[0].extData || d.data[0].tplData) {
                    b.setCacheData(d.data);
                    a()
                }
            } else {
                b.setCacheData("[NO DATA]")
            }
        }, function (d) {})
    },
    asynClkRcmd: function (f) {
        var d = this,
            f = f[0] || {};
        if (f && f.linkInfo) {
            var b = d.op.target.find(".c-recommend"),
                a = b.find("a");
            if (a && a.length) {
                a.remove();
                b.append(d.buildRcmdDom(f))
            }
            if (!b || !b.length) {
                var g = $('<div class="c-gap-top c-recommend"><i class="c-icon c-icon-bear-circle c-gap-right-small"></i><span class="c-gray">为您推荐：</span></div>');
                g.append(d.buildRcmdDom(f));
                d.op.target.append(g)
            }
        }
    },
    buildRcmdDom: function (j) {
        var o = this,
            p = "";
        var s = j.tip || "为您推荐：",
            f = j.defaultHide,
            m = j.linkInfo;
        var d = 50;
        d = d - s.length;
        for (var k = 0, l = m.length; k < l; k++) {
            var g = m[k].txt,
                b = m[k].wd,
                q = m[k].sa,
                r = d;
            d = d - g.length;
            if (d <= 0) {
                break
            }
            var n = "c-gap-left-large";
            if (k == 0) {
                n = ""
            }
            var a = "wd=" + b + "&rsv_crq=" + q + "&bs=" + bds.comm.query,
                t = o.buildURL(a);
            p += "<a class='" + n + "' href='" + t + "' title='" + g + "' target='_blank'>" + g + "</a>"
        }
        return p
    },
    buildURL: function (f) {
        var i = "/s?";
        var d = {
            tn: bds.comm.tn
        };
        var b = $("#form");
        var a = b.find("input[name=rsv_idx]");
        var g = "";
        d.rsv_idx = a.length ? a.val() : "";
        for (var j in d) {
            if (d.hasOwnProperty(j) && d[j]) {
                g += j + "=" + encodeURIComponent(d[j]) + "&"
            }
        }
        return (i + g + f)
    },
    renderTpl: function (f, d) {
        var b = this;
        if (!f || !d) {
            return
        }
        var a = {};
        a.url_right_recommends_merge = function (k) {
            var k = k || d;
            var p = "";
            var j = 12;
            var m = 0;
            if (k.Right_Resources.card && !k.Right_Resources.card.length) {
                k.Right_Resources.card = [k.Right_Resources.card]
            }
            for (var n = 0, g = k.Right_Resources.card.length; n < g; n++) {
                var l = k.Right_Resources.card[n];
                m += parseInt(l.shownums || 0);
                if (m > j) {
                    break
                }
                p += o(l, (n + 1))
            }
            return p;

            function o(t, w) {
                var F = '<div class="cr-content" data-click=\'#{2}\'><div class="cr-title c-clearfix"><span title="#{0}">#{1}</span></div>';
                var y = '<div class="c-row c-gap-top">';
                var B = '<div class="c-span4#{5} rrecom-item" data-click=\'#{6}\'><div class="rrecom-p"><a target="_blank" href="#{0}"><img class="c-img c-img4 rrecom-img" src="#{1}"></a></div><div class="c-gap-top-small"><a target="_blank" title="#{2}" href="#{3}">#{4}</a></div><div><img src="#{7}" class="opr-recommends-merge-imgtext" data-nolog="1"></div>';
                var q = '<div class="c-span4#{5} rrecom-item" data-click=\'#{6}\'><div class="rrecom-p"><a target="_blank" href="#{0}"><img class="c-img c-img4 rrecom-img" src="#{1}"></a></div><div class="c-gap-top-small"><a target="_blank" title="#{2}" href="#{3}">#{4}</a></div>';
                var J = "</div>";
                var z = "";
                var x = t.showrow;
                var i = t.shownums;
                var I;
                var u = {
                    rsv_srcid: k.StdStg || 0
                };
                if (t.list && !t.list.length) {
                    t.list = [t.list]
                }
                z += $.format(F, t.subtitle, t.subtitle, $.stringify(u));
                z += '<div class="rrecom-panel">';
                var r = b.op.target.find(".t>a").eq(0);
                var s = r.length ? r.attr("href") : b.op.target.attr("mu");
                for (var C = 0, E = t.list.length; C < E; C++) {
                    I = t.list[C];
                    var H = {
                        rsv_re_ename: I.name,
                        rsv_re_uri: I.uri,
                        rsv_re_fcpoi: w + "-" + (C + 1),
                        rsv_clk_url: s
                    };
                    var D = b.buildURL(I.params + "&euri=" + (I.uri || ""));
                    if (C == i) {
                        break
                    }
                    if (C % 4 === 0) {
                        z += y
                    }
                    if (bds.util && bds.util.domain && bds.util.domain.get) {
                        I.img = bds.util.domain.get(I.img)
                    }
                    z += $.format(q, D, I.img, I.name, D, $.subByte(I.name, 20), ((C + 1) % 4 === 0) ? " c-span-last rrecom-item-rowLast" : (((C + 1) % 4 === 3) ? " rrecom-item-s" : ""), $.stringify(H), I.attrpic);
                    z += J;
                    if ((C + 1) % 4 === 0 || C == E - 1) {
                        z += J
                    }
                }
                z += J;
                z += J;
                return z
            }
        };
        if (a[f]) {
            return a[f]()
        }
    },
    render: function (f) {
        var b = "";
        for (var a = 0; a < f.length; a++) {
            b += this.renderTpl(f[a].extData.tplt, f[a].tplData)
        }
        var d = this.getLeftP();
        d.fm = "alxr";
        this.recommDom.attr("data-click", $.stringify(d)).find(".rrecom-content").eq(0).empty().append(b);
        this.setRecommPosition()
    },
    createRecommDom: function () {
        var d = ['<div style="position:fixed;left:-1px;background:#fff;border:1px solid #eee;z-index:103" class="result-op xpath-log" data-click=\'{"fm":"alxr","p1":1,"p5":1}\'>', '<div class="rrecom-ajax-loading c-loading"></div>', '<div class="rrecom-container">', '<a href="javascript:;" class="rrecom-btn-close" data-click=\'{"rsv_re_fc":4,"fm":"beha"}\'></a>', '<div class="rrecom-content"></div>', "</div>", "</div>"].join("");
        var b = ["<style>", ".rrecom-btn-close,.rrecom-btn span{background:url(https://ss1.bdstatic.com/5eN1bjq8AAUYm2zgoY3K/r/www/cache/static/protocol/https/global/img/rrecom_icon_034abe03.png) no-repeat;}", ".rrecom-btn-close{display:inline-block;width:13px;height:13px;position:absolute;top:26px;right:10px;background-position:0 -20px;}", ".rrecom-btn-parent{z-index:104;position:absolute;right:-37px;top:50%;margin-top:-50px;height:59px;width:40px;cursor:default;padding:20px 0px;}", ".rrecom-btn{display:none;background-color:#fff;padding:20px 5px;position:absolute;right:10px;width:20px;height:19px;border:1px solid transparent;}", ".rrecom-btn-hover{right:-1px;border:1px solid #eee;border-right:1px solid #fff;z-index:104;box-shadow:0px 2px 0px rgba(0,0,0,0.072);-webkit-box-shadow:0px 2px 0px rgba(0,0,0,0.072);-moz-box-shadow:0px 2px 0px rgba(0,0,0,0.072);-o-box-shadow:0px 2px 0px rgba(0,0,0,0.072);}", ".rrecom-btn span{cursor:pointer;background-position:0 0;width:20px;height:19px;position:absolute;top:50%;left:50%;margin:-10px 0 0 -10px;}", ".rrecom-container{width:368px;padding-top:43px;overflow:hidden;background-color:#fff;}", ".rrecom-ajax-loading{position:absolute;left:50%;margin-left:-25px;top:50px;display:none;}", ".rrecom-content{margin-left:17px;}", ".rrecom-content .cr-content{width:100%;margin-bottom:28px;}", ".rrecom_content_s{padding-left:0px;width:276px;}", ".rrecom_content_s .rrecom-item-rowLast{display:none}", ".rrecom_content_s .rrecom-item-s{margin-right:0;}", ".rrecom-panel{text-align:center;}", "</style>"].join("");
        bds.se.recommend.prototype.recommDom = $(d);
        bds.se.recommend.prototype.cssDom = $(b);
        bds.se.recommend.prototype.loadDom = this.recommDom.find(".rrecom-ajax-loading");
        this.setRecommSize();
        $("body").append(this.cssDom).append(this.recommDom.hide());
        this.bindRecommEvent();
        $(window).trigger("container_resize.recommend", bds.comm.containerSize);
        var a = $("#foot");
        if (a.css("position") === "static") {
            a.css({
                position: "relative",
                "z-index": 104
            })
        }
    },
    setRecommSize: function () {
        var g = $("#content_right");
        var d = $("#wrapper_wrapper");
        var f = $("body");
        var b = $(window);
        var j = g.offset();
        var a = {
            w: f.width()
        };
        var i = {
            h: b.height()
        };
        var m = b.scrollTop();
        d.prevAll().each(function () {
            var n;
            if (this.nodeName.toLowerCase() === "div") {
                n = parseInt($(this).css("margin-bottom"));
                bds.se.recommend.prototype.global.topGap = isNaN(n) ? 0 : n;
                return false
            }
        });
        bds.se.recommend.prototype.global.topDom = d;
        bds.se.recommend.prototype.global.headDom = $("#head");
        var k = {
            top: this.global.topDom.offset().top - this.global.topGap
        };
        var l = this.global.headDom.offset().top - m + 56;
        this.recommDom.height(i.h);
        bds.comm.recommends.recommWidth = a.w - j.left - 2, this.recommDom.css({
            width: a.w - j.left - 2,
            top: (m <= (k.top - l)) ? (k.top) : l,
            position: (m <= (k.top - l)) ? "absolute" : "fixed",
            left: j.left
        })
    },
    setRecommPosition: function () {
        this.setRecommTop();
        this.setRecommLeft()
    },
    setRecommTop: function () {
        var b = $(window).scrollTop();
        var a = {
            top: this.global.topDom.offset().top - this.global.topGap
        };
        var d = this.global.headDom.offset().top - b + 56;
        this.recommDom.css({
            top: (b <= (a.top - d)) ? (a.top) : d,
            position: (b <= (a.top - d)) ? "absolute" : "fixed"
        }).find(".rrecom-container").css({
            "margin-top": "0px"
        });
        bds.se.recommend.prototype.global.originalTop = (b < a.top - d) ? a.top - d : b
    },
    setRecommLeft: function () {
        var b, a;
        if (this.recommDom.css("position") === "fixed") {
            b = $("#content_right").offset().left;
            a = $(window).scrollLeft();
            this.recommDom.css("left", parseInt(b) - a)
        }
    },
    bindRecommEvent: function () {
        var a = this;
        this.recommDom.find(".rrecom-btn-close").eq(0).on("click", function () {
            a.hideRecommDom()
        });
        $(window).on("scroll.recommend", function (i) {
            var b = {
                top: a.global.topDom.offset().top - a.global.topGap
            };
            var l = a.global.headDom.offset().top + a.global.headDom.outerHeight();
            var g = $(this);
            var k;
            var d;
            var f;
            if (a.recommDom && a.recommDom.css("display") !== "none") {
                k = g.scrollTop();
                d = g.scrollLeft();
                l -= k;
                if (k <= (b.top - l)) {
                    if (a.recommDom.css("position") === "fixed") {
                        a.recommDom.css("position", "absolute");
                        a.recommDom.css("top", b.top)
                    }
                } else {
                    if (a.recommDom.css("position") === "absolute") {
                        a.recommDom.css("position", "fixed");
                        a.recommDom.css("top", l)
                    }
                }
                var j = a.recommDom.find(".rrecom-container");
                if (a.global.originalTop < k) {
                    maxMargin = Math.min(a.recommDom.height() - j.height() - 82 - 75, 0);
                    j.css({
                        "margin-top": Math.max(a.global.originalTop - k, maxMargin)
                    })
                } else {
                    j.css({
                        "margin-top": "0px"
                    })
                }
                if (d) {
                    f = $("#content_right").offset().left;
                    if (a.recommDom.css("position") === "fixed") {
                        a.recommDom.css("left", parseInt(f) - d)
                    } else {
                        a.recommDom.css("left", parseInt(f))
                    }
                }
            }
        }).on("resize.recommend", function () {
            a.setRecommSize();
            a.setArrowPos()
        }).on("container_resize.recommend", function (d, b) {
            var f = a.recommDom.find(".rrecom-container");
            if (b === "s" && !f.hasClass("rrecom_content_s")) {
                f.addClass("rrecom_content_s");
                f.find(".rrecom-content").css("width", (a.op.container_s - 17) + "px")
            } else {
                if (b === "l") {
                    f.removeClass("rrecom_content_s");
                    f.find(".rrecom-content").css("width", (a.op.container_l - 17) + "px")
                }
            }
        })
    },
    hideRecommDom: function () {
        var a = this;
        a.recommDom.find(".rrecom-container").animate({
            width: "0px"
        }, 200, function () {
            a.recommDom.hide()
        });
        a.currInstance && window.clearTimeout(a.currInstance.delay.overArrow);
        a.currInstance && a.currInstance.resetArrow();
        bds.se.recommend.prototype.currInstance = null
    },
    showRecommDom: function () {
        var d = this;
        if (d.currInstance !== d) {}
        if (d.recommDom.css("display") === "none") {
            d.recommDom.css({
                opacity: 0.3
            }).show().animate({
                opacity: 1
            }, 100);
            var b = d.recommDom.find(".rrecom-container");
            var a = bds.comm.recommends.recommWidth;
            b.css({
                width: 0
            }).animate({
                width: a + "px"
            }, 200)
        }
        if (d.recommDom.find(".rrecom_content_s").length > 0) {
            d.recommDom.find(".rrecom-content").css("width", (d.op.container_s - 17) + "px")
        } else {
            d.recommDom.find(".rrecom-content").css("width", (d.op.container_l - 17) + "px")
        }
        bds.se.recommend.prototype.currInstance = d;
        d.render(d.getCacheData())
    },
    showLoading: function () {
        this.loadDom.show()
    },
    hideLoading: function () {
        this.loadDom.hide()
    }
};
$(window).one("swap_end", function () {
    if (!(bds.comm.upn.ie && bds.comm.upn.ie == 6)) {
        $(document).on("click", "#content_left .result .t>a, #content_left .result-op .t>a", function (b) {
            if (!b.ctrlKey && bds.comm.urlRecFlag == "0") {
                var a = $(this).closest(".result, .result-op");
                new bds.se.recommend({
                    target: a
                })
            }
        })
    }
});
$(window).on("swap_begin", function () {
    bds.se.recommend.prototype.currInstance && bds.se.recommend.prototype.hideRecommDom();
    bds.se.recommend.prototype.currInstance = null;
    bds.se.recommend.prototype.__init__ = false;
    bds.comm.recommends = {}
});
bds.se.asynAds = function (a) {
    var l = a.dom || "",
        d = a.id || "",
        b = a.tnp || "",
        g = a.wd || "",
        j = (a.cb && typeof (a.cb) == "function") ? a.cb : null;
    if (l && b && g && d) {
        c({
            fm: "inlo",
            rsv_ad: "ad_asyn_start"
        });
        var q = ["wd", "tnp", "tn", "pn", "bs", "fenlei", "adext"];
        var k = "ie=utf-8&oe=utf-8&dsp=pc";
        for (var n = 0; n < q.length; n++) {
            var u = q[n];
            if (a[u]) {
                k += "&" + u + "=" + a[u]
            }
        }
        var m = bds.comm.orderplay;
        var o = "";
        var t = function (w) {
            if (bds && bds.comm && bds.comm.upn && bds.comm.upn.browser && bds.comm.upn.browser == "firefox") {
                var y = w.textContent
            } else {
                var y = w.innerText
            }
            var i = y.indexOf("\n");
            var x = y.substr(0, i);
            return encodeURIComponent(x)
        };
        var p = function (i) {
            var w = $(".c-showurl", i).text().split(/\s+/)[0];
            w = w.replace(/(\.\.\.$)/g, "");
            return w
        };
        $.each(m, function (x, w) {
            w.t = t(w.dom[0]) || "";
            w.u = p(w.dom[0]) || "";
            if (w.u && !new RegExp("baidu.com").test(w.u)) {
                o += w.u + ":"
            }
            if (w.itime) {
                w.time = new Date().getTime() - w.itime
            }
        });
        m.sort(function (w, i) {
            if (w.time > i.time) {
                return -1
            }
            if (w.time < i.time) {
                return 1
            }
            if (w.time = i.time) {
                if (w.id < i.id) {
                    return -1
                }
            }
            return 0
        });
        var f = m[0];
        var s = m[1];
        var r = "";
        if (f.time) {
            r += f.t + "@" + f.time;
            if (s.time) {
                r += "," + s.t + "@" + s.time
            }
        }
        if (r) {
            k += "&rlist=" + encodeURIComponent(r)
        }
        if (o) {
            k += "&furl=" + encodeURIComponent(o.substring(0, o.length - 1))
        }
        $.ajax({
            url: "/s",
            dataType: "json",
            data: k,
            success: function (x) {
                var i = $(l);
                if (x && x.results && x.results.length && i.length) {
                    var w = "";
                    $.each(x.results, function (z, B) {
                        if (B.id == d) {
                            var y = B;
                            w += "<style>" + y.css + "</style>";
                            w += y.html;
                            w += "<script>" + y.js + "<\/script>"
                        }
                    });
                    i.html(w);
                    if (($(document).scrollTop() < i.position().top + i.height()) && ($(document).scrollTop() + $(window).height() > i.position().top)) {
                        c({
                            fm: "inlo",
                            rsv_ad: "ad_asyn_shake"
                        })
                    }
                    if (j) {
                        j()
                    }
                } else {
                    c({
                        fm: "inlo",
                        rsv_ad: "ad_asyn_net_error"
                    })
                }
            },
            error: function () {
                c({
                    fm: "inlo",
                    rsv_ad: "ad_asyn_net_error"
                })
            }
        })
    } else {
        c({
            fm: "inlo",
            rsv_ad: "ad_asyn_param_error"
        })
    }
};
(function () {
    var d, a;
    var b = bds && bds.util && bds.util.domain && bds.util.domain.get("http://sensearch.baidu.com/sensearch/selecttext");
    $(window).one("swap_end", function () {
        if (bds.comm.upn && bds.comm.upn.ie && bds.comm.upn.ie == 6) {
            return
        }
        $(document).on("mousedown", function (f) {
            if (d && $(f.target).closest(d.getDom()).length == 0) {
                d.getDom().hide();
                a && a.abort()
            }
        }).on("mouseup", function (k) {
            var g, i, j, l;
            var f;
            if (d && $(k.target).closest(d.getDom()).length) {
                return
            }
            try {
                setTimeout(function () {
                    if (window.getSelection) {
                        g = window.getSelection();
                        if (g.rangeCount == 0) {
                            return
                        }
                        i = g.getRangeAt(0);
                        j = i.getBoundingClientRect();
                        l = $.trim(g.toString());
                        f = (i.commonAncestorContainer.nodeName == "#text") ? $(i.commonAncestorContainer.parentNode) : $(i.commonAncestorContainer)
                    } else {
                        if (document.selection) {
                            g = document.selection.createRange();
                            i = g;
                            j = i.getBoundingClientRect();
                            l = $.trim(g.text.toString());
                            f = $(i.parentElement())
                        }
                    }
                    if (l && l.length > 1 && f.closest("#content_left .result .c-abstract,#content_left .result .t").length) {
                        a && a.abort();
                        var m = /[^(\u4E00-\u9FA5)]+/i;
                        if (!m.test(l)) {
                            return
                        }
                        a = $.ajax({
                            url: b,
                            dataType: "jsonp",
                            jsonp: "cb",
                            timeout: 5000,
                            data: {
                                q: l
                            },
                            success: function (r) {
                                var q = "";
                                if (r && r.data && r.data.type && r.data.to && r.data.to == "zh" && r.data.result && r.data.result.length && r.data.result != l) {
                                    if (r.data.type == 1) {
                                        var o = r.data.result;
                                        for (var p = 0, n = Math.min(o.length, 2); p < n; p++) {
                                            q += (p == 0 ? "" : "<br/>") + (o[p].pre ? o[p].pre + "&nbsp;" : "");
                                            q += (o[p].cont ? $.subByte(o[p].cont, 46 * (n == 1 ? 2 : 1) + 1) : "")
                                        }
                                    } else {
                                        if (r.data.type == 2) {
                                            q = '<span style="color:#999">译：</span>' + r.data.result
                                        }
                                    }
                                }
                                if (q) {
                                    d = d || new bds.se.tip({
                                        target: $("body"),
                                        mode: "none",
                                        content: '<div class="translateContent"></div>',
                                        align: "left",
                                        arrow: {
                                            has: 1,
                                            offset: 10
                                        }
                                    });
                                    var s = d.getDom();
                                    s.find(".translateContent").html('<p style="margin:0 8px">' + q + "</p>");
                                    s.css({
                                        top: j.bottom + $(window).scrollTop() + 8,
                                        left: (j.left + j.right) / 2 + $(window).scrollLeft() - 20
                                    }).show();
                                    ns_c({
                                        rsv_trans_type: "showresult",
                                        rsv_trans_st: encodeURIComponent(l),
                                        rsv_qid: bds.comm.qid || ""
                                    })
                                } else {}
                            }
                        })
                    }
                }, 0)
            } catch (k) {}
        })
    });
    $(window).on("swap_begin", function () {
        d = null;
        a && a.abort()
    })
})();
$(window).on("swap_begin", function () {
    if (bds && bds.se && bds.se.displayTime !== undefined && bds.se.displayTime !== null) {
        clearTimeout(bds.se.displayTime);
        bds.se.displayTime = null
    }
}).on("confirm", function () {
    if (bds && bds.comm && bds.comm.globalLogFlag && bds.comm.globalLogFlag == 1) {
        if (bds.comm.logFlagNoNetwork == 1 || bds.comm.logFlagNoIntegration == 1) {} else {
            bds.se.displayTime = setTimeout(function () {
                bds && bds.se && bds.se.display();
                bds.se.displayTime = null
            }, 5000)
        }
    }
    if (bds) {
        bds.se.userAction.collect()
    }
}).on("swap_end", function (b, a) {
    if (!a && bds && bds.comm && bds.comm.globalLogFlag && bds.comm.globalLogFlag == 1) {
        if (bds.comm.logFlagNoNetwork == 1 || bds.comm.logFlagNoIntegration == 1) {} else {
            bds.se.displayTime = setTimeout(function () {
                bds && bds.se && bds.se.display();
                bds.se.displayTime = null
            }, 5000)
        }
    }
    if (!a && bds) {
        bds.se.userAction.collect()
    }
});
$(window).on("swap_end", function () {
    if (bds.comm.__rdNum && bds.comm.__rdNum > 9000) {
        setTimeout(function () {
            $.ajax({
                dataType: "script",
                cache: true,
                url: "https://ss1.bdstatic.com/5eN1bjq8AAUYm2zgoY3K/r/www/cache/static/protocol/https/plugins/clean_3ed4e35f.js",
                success: function () {
                    bds.se.cleanCookie.init()
                }
            })
        }, 0)
    }
});
(function () {
    var d = navigator.userAgent;
    var f = d.match(/MSIE\s*(\d+)/);
    var a = f && f[1] && (+f[1] <= 9);
    if (a) {
        return
    }
    var b = "https://ss1.bdstatic.com/5eN1bjq8AAUYm2zgoY3K/r/www/cache/static/protocol/https/soutu/js/tu_cfd9e720.js".replace(/\.js$/, "");
    require.config({
        paths: {
            soutuIndex: b
        }
    });
    require.config({
        paths: {
            swfobject: "https://ss1.bdstatic.com/5eN1bjq8AAUYm2zgoY3K/r/www/cache/static/protocol/https/plugins/swfobject_c1c7185a.js".replace(/\.js$/, "")
        }
    });
    require(["swfobject", "soutuIndex"], function (j, i) {
        if (/^\/imgsearch/.test(location.pathname)) {
            var k = $("#content_left").find(".result-op");
            var g = [];
            k.each(function () {
                var m = $(this);
                var l = m.attr("tpl");
                if (l === "tu_relate_site") {
                    l += "@" + m.find(".op-tu-relate-site-result").length
                }
                g.push(l)
            });
            i.log({
                rsv_imageshow: g.join(":")
            });
            $("#page").hide();
            if ($("#wrapper").outerHeight() < $(document).outerHeight()) {
                $("#foot").addClass("foot_fixed_bottom")
            }
        }
    })
})();
(function () {
    if (!location.href.match(/voice=1/) && !navigator.userAgent.match(/mac os x/i)) {
        return
    }
    require.config({
        paths: {
            Recorder: "https://ss1.bdstatic.com/5eN1bjq8AAUYm2zgoY3K/r/www/cache/static/protocol/https/voice/js/voice_8e6294f2.js".replace(/\.js$/, "")
        }
    });
    require.config({
        paths: {
            swfobject: "https://ss1.bdstatic.com/5eN1bjq8AAUYm2zgoY3K/r/www/cache/static/protocol/https/plugins/swfobject_c1c7185a.js".replace(/\.js$/, "")
        }
    });

    function a(i) {
        var g = ["voice_beha=1"],
            f = window.bds && bds.util && bds.util.domain ? bds.util.domain.get("http://nsclick.baidu.com") : "http://nsclick.baidu.com";
        for (var d in i) {
            if (i.hasOwnProperty(d)) {
                g.push(d + "=" + i[d])
            }
        }
        var b = window["nsIMG" + (+new Date())] = new Image();
        b.src = f + "/v.gif?pid=201&" + g.join("&");
        return true
    }
    require(["swfobject", "Recorder"], function (d, b) {
        b.log = a;
        if (!b || !b.support()) {
            return
        }
        b.addStyle();
        window.__supportvoice = true;
        var f = $("#form .ipt_rec");
        f.css("display", "block");
        f.click(function () {
            var g = b.init({
                url: bds.util.domain.get("http://vse.baidu.com") + "/echo.fcgi"
            });
            g.done(function (i) {
                i.openUI();
                i.onfinish(function (j) {
                    var l = j.content.item[0];
                    var k = (j && j.result) ? j.result.corpus_no : "";
                    changeUrl("wd=" + encodeURIComponent(l) + "&rsv_voice=1&hsug_mtype=2&rsv_vcorpus=" + encodeURIComponent(k));
                    bds.comm.lastVoiceQuery = l
                });
                b.log({
                    q: "resolve"
                })
            }).fail(function () {
                b.log({
                    q: "reject"
                });
                alert("不能获得麦克风的权限")
            });
            b.log({
                q: "start"
            })
        })
    })
})();
