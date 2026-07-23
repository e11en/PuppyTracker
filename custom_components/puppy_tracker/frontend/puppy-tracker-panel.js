/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const H = globalThis, q = H.ShadowRoot && (H.ShadyCSS === void 0 || H.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, B = Symbol(), Q = /* @__PURE__ */ new WeakMap();
let dt = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== B) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (q && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = Q.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && Q.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const _t = (i) => new dt(typeof i == "string" ? i : i + "", void 0, B), vt = (i, ...t) => {
  const e = i.length === 1 ? i[0] : t.reduce((s, o, r) => s + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(o) + i[r + 1], i[0]);
  return new dt(e, i, B);
}, bt = (i, t) => {
  if (q) i.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), o = H.litNonce;
    o !== void 0 && s.setAttribute("nonce", o), s.textContent = e.cssText, i.appendChild(s);
  }
}, X = q ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return _t(e);
})(i) : i;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: yt, defineProperty: xt, getOwnPropertyDescriptor: $t, getOwnPropertyNames: kt, getOwnPropertySymbols: wt, getPrototypeOf: St } = Object, j = globalThis, tt = j.trustedTypes, At = tt ? tt.emptyScript : "", Et = j.reactiveElementPolyfillSupport, z = (i, t) => i, N = { toAttribute(i, t) {
  switch (t) {
    case Boolean:
      i = i ? At : null;
      break;
    case Object:
    case Array:
      i = i == null ? i : JSON.stringify(i);
  }
  return i;
}, fromAttribute(i, t) {
  let e = i;
  switch (t) {
    case Boolean:
      e = i !== null;
      break;
    case Number:
      e = i === null ? null : Number(i);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(i);
      } catch {
        e = null;
      }
  }
  return e;
} }, V = (i, t) => !yt(i, t), et = { attribute: !0, type: String, converter: N, reflect: !1, useDefault: !1, hasChanged: V };
Symbol.metadata ??= Symbol("metadata"), j.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let w = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = et) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = Symbol(), o = this.getPropertyDescriptor(t, s, e);
      o !== void 0 && xt(this.prototype, t, o);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: o, set: r } = $t(this.prototype, t) ?? { get() {
      return this[e];
    }, set(a) {
      this[e] = a;
    } };
    return { get: o, set(a) {
      const c = o?.call(this);
      r?.call(this, a), this.requestUpdate(t, c, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? et;
  }
  static _$Ei() {
    if (this.hasOwnProperty(z("elementProperties"))) return;
    const t = St(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(z("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(z("properties"))) {
      const e = this.properties, s = [...kt(e), ...wt(e)];
      for (const o of s) this.createProperty(o, e[o]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [s, o] of e) this.elementProperties.set(s, o);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, s] of this.elementProperties) {
      const o = this._$Eu(e, s);
      o !== void 0 && this._$Eh.set(o, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const o of s) e.unshift(X(o));
    } else t !== void 0 && e.push(X(t));
    return e;
  }
  static _$Eu(t, e) {
    const s = e.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
  }
  addController(t) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t), this.renderRoot !== void 0 && this.isConnected && t.hostConnected?.();
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const s of e.keys()) this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return bt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, e, s) {
    this._$AK(t, s);
  }
  _$ET(t, e) {
    const s = this.constructor.elementProperties.get(t), o = this.constructor._$Eu(t, s);
    if (o !== void 0 && s.reflect === !0) {
      const r = (s.converter?.toAttribute !== void 0 ? s.converter : N).toAttribute(e, s.type);
      this._$Em = t, r == null ? this.removeAttribute(o) : this.setAttribute(o, r), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const s = this.constructor, o = s._$Eh.get(t);
    if (o !== void 0 && this._$Em !== o) {
      const r = s.getPropertyOptions(o), a = typeof r.converter == "function" ? { fromAttribute: r.converter } : r.converter?.fromAttribute !== void 0 ? r.converter : N;
      this._$Em = o;
      const c = a.fromAttribute(e, r.type);
      this[o] = c ?? this._$Ej?.get(o) ?? c, this._$Em = null;
    }
  }
  requestUpdate(t, e, s, o = !1, r) {
    if (t !== void 0) {
      const a = this.constructor;
      if (o === !1 && (r = this[t]), s ??= a.getPropertyOptions(t), !((s.hasChanged ?? V)(r, e) || s.useDefault && s.reflect && r === this._$Ej?.get(t) && !this.hasAttribute(a._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: o, wrapped: r }, a) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, a ?? e ?? this[t]), r !== !0 || a !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), o === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [o, r] of this._$Ep) this[o] = r;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [o, r] of s) {
        const { wrapped: a } = r, c = this[o];
        a !== !0 || this._$AL.has(o) || c === void 0 || this.C(o, void 0, r, c);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), this._$EO?.forEach((s) => s.hostUpdate?.()), this.update(e)) : this._$EM();
    } catch (s) {
      throw t = !1, this._$EM(), s;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
w.elementStyles = [], w.shadowRootOptions = { mode: "open" }, w[z("elementProperties")] = /* @__PURE__ */ new Map(), w[z("finalized")] = /* @__PURE__ */ new Map(), Et?.({ ReactiveElement: w }), (j.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const J = globalThis, it = (i) => i, R = J.trustedTypes, st = R ? R.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, pt = "$lit$", y = `lit$${Math.random().toFixed(9).slice(2)}$`, ht = "?" + y, Tt = `<${ht}>`, k = document, M = () => k.createComment(""), D = (i) => i === null || typeof i != "object" && typeof i != "function", Z = Array.isArray, Pt = (i) => Z(i) || typeof i?.[Symbol.iterator] == "function", I = `[ 	
\f\r]`, T = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ot = /-->/g, rt = />/g, x = RegExp(`>|${I}(?:([^\\s"'>=/]+)(${I}*=${I}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), at = /'/g, nt = /"/g, ut = /^(?:script|style|textarea|title)$/i, zt = (i) => (t, ...e) => ({ _$litType$: i, strings: t, values: e }), n = zt(1), S = Symbol.for("lit-noChange"), d = Symbol.for("lit-nothing"), lt = /* @__PURE__ */ new WeakMap(), $ = k.createTreeWalker(k, 129);
function mt(i, t) {
  if (!Z(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return st !== void 0 ? st.createHTML(t) : t;
}
const Ct = (i, t) => {
  const e = i.length - 1, s = [];
  let o, r = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", a = T;
  for (let c = 0; c < e; c++) {
    const l = i[c];
    let u, m, h = -1, v = 0;
    for (; v < l.length && (a.lastIndex = v, m = a.exec(l), m !== null); ) v = a.lastIndex, a === T ? m[1] === "!--" ? a = ot : m[1] !== void 0 ? a = rt : m[2] !== void 0 ? (ut.test(m[2]) && (o = RegExp("</" + m[2], "g")), a = x) : m[3] !== void 0 && (a = x) : a === x ? m[0] === ">" ? (a = o ?? T, h = -1) : m[1] === void 0 ? h = -2 : (h = a.lastIndex - m[2].length, u = m[1], a = m[3] === void 0 ? x : m[3] === '"' ? nt : at) : a === nt || a === at ? a = x : a === ot || a === rt ? a = T : (a = x, o = void 0);
    const p = a === x && i[c + 1].startsWith("/>") ? " " : "";
    r += a === T ? l + Tt : h >= 0 ? (s.push(u), l.slice(0, h) + pt + l.slice(h) + y + p) : l + y + (h === -2 ? c : p);
  }
  return [mt(i, r + (i[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class O {
  constructor({ strings: t, _$litType$: e }, s) {
    let o;
    this.parts = [];
    let r = 0, a = 0;
    const c = t.length - 1, l = this.parts, [u, m] = Ct(t, e);
    if (this.el = O.createElement(u, s), $.currentNode = this.el.content, e === 2 || e === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (o = $.nextNode()) !== null && l.length < c; ) {
      if (o.nodeType === 1) {
        if (o.hasAttributes()) for (const h of o.getAttributeNames()) if (h.endsWith(pt)) {
          const v = m[a++], p = o.getAttribute(h).split(y), f = /([.?@])?(.*)/.exec(v);
          l.push({ type: 1, index: r, name: f[2], strings: p, ctor: f[1] === "." ? Dt : f[1] === "?" ? Ot : f[1] === "@" ? Ut : F }), o.removeAttribute(h);
        } else h.startsWith(y) && (l.push({ type: 6, index: r }), o.removeAttribute(h));
        if (ut.test(o.tagName)) {
          const h = o.textContent.split(y), v = h.length - 1;
          if (v > 0) {
            o.textContent = R ? R.emptyScript : "";
            for (let p = 0; p < v; p++) o.append(h[p], M()), $.nextNode(), l.push({ type: 2, index: ++r });
            o.append(h[v], M());
          }
        }
      } else if (o.nodeType === 8) if (o.data === ht) l.push({ type: 2, index: r });
      else {
        let h = -1;
        for (; (h = o.data.indexOf(y, h + 1)) !== -1; ) l.push({ type: 7, index: r }), h += y.length - 1;
      }
      r++;
    }
  }
  static createElement(t, e) {
    const s = k.createElement("template");
    return s.innerHTML = t, s;
  }
}
function A(i, t, e = i, s) {
  if (t === S) return t;
  let o = s !== void 0 ? e._$Co?.[s] : e._$Cl;
  const r = D(t) ? void 0 : t._$litDirective$;
  return o?.constructor !== r && (o?._$AO?.(!1), r === void 0 ? o = void 0 : (o = new r(i), o._$AT(i, e, s)), s !== void 0 ? (e._$Co ??= [])[s] = o : e._$Cl = o), o !== void 0 && (t = A(i, o._$AS(i, t.values), o, s)), t;
}
class Mt {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: s } = this._$AD, o = (t?.creationScope ?? k).importNode(e, !0);
    $.currentNode = o;
    let r = $.nextNode(), a = 0, c = 0, l = s[0];
    for (; l !== void 0; ) {
      if (a === l.index) {
        let u;
        l.type === 2 ? u = new U(r, r.nextSibling, this, t) : l.type === 1 ? u = new l.ctor(r, l.name, l.strings, this, t) : l.type === 6 && (u = new Ht(r, this, t)), this._$AV.push(u), l = s[++c];
      }
      a !== l?.index && (r = $.nextNode(), a++);
    }
    return $.currentNode = k, o;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class U {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, s, o) {
    this.type = 2, this._$AH = d, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = o, this._$Cv = o?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && t?.nodeType === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = A(this, t, e), D(t) ? t === d || t == null || t === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : t !== this._$AH && t !== S && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Pt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== d && D(this._$AH) ? this._$AA.nextSibling.data = t : this.T(k.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: s } = t, o = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = O.createElement(mt(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === o) this._$AH.p(e);
    else {
      const r = new Mt(o, this), a = r.u(this.options);
      r.p(e), this.T(a), this._$AH = r;
    }
  }
  _$AC(t) {
    let e = lt.get(t.strings);
    return e === void 0 && lt.set(t.strings, e = new O(t)), e;
  }
  k(t) {
    Z(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, o = 0;
    for (const r of t) o === e.length ? e.push(s = new U(this.O(M()), this.O(M()), this, this.options)) : s = e[o], s._$AI(r), o++;
    o < e.length && (this._$AR(s && s._$AB.nextSibling, o), e.length = o);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const s = it(t).nextSibling;
      it(t).remove(), t = s;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class F {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, s, o, r) {
    this.type = 1, this._$AH = d, this._$AN = void 0, this.element = t, this.name = e, this._$AM = o, this.options = r, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = d;
  }
  _$AI(t, e = this, s, o) {
    const r = this.strings;
    let a = !1;
    if (r === void 0) t = A(this, t, e, 0), a = !D(t) || t !== this._$AH && t !== S, a && (this._$AH = t);
    else {
      const c = t;
      let l, u;
      for (t = r[0], l = 0; l < r.length - 1; l++) u = A(this, c[s + l], e, l), u === S && (u = this._$AH[l]), a ||= !D(u) || u !== this._$AH[l], u === d ? t = d : t !== d && (t += (u ?? "") + r[l + 1]), this._$AH[l] = u;
    }
    a && !o && this.j(t);
  }
  j(t) {
    t === d ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Dt extends F {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === d ? void 0 : t;
  }
}
class Ot extends F {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== d);
  }
}
class Ut extends F {
  constructor(t, e, s, o, r) {
    super(t, e, s, o, r), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = A(this, t, e, 0) ?? d) === S) return;
    const s = this._$AH, o = t === d && s !== d || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, r = t !== d && (s === d || o);
    o && this.element.removeEventListener(this.name, this, s), r && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Ht {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    A(this, t);
  }
}
const Nt = J.litHtmlPolyfillSupport;
Nt?.(O, U), (J.litHtmlVersions ??= []).push("3.3.3");
const Rt = (i, t, e) => {
  const s = e?.renderBefore ?? t;
  let o = s._$litPart$;
  if (o === void 0) {
    const r = e?.renderBefore ?? null;
    s._$litPart$ = o = new U(t.insertBefore(M(), r), r, void 0, e ?? {});
  }
  return o._$AI(i), o;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const K = globalThis;
class C extends w {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Rt(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return S;
  }
}
C._$litElement$ = !0, C.finalized = !0, K.litElementHydrateSupport?.({ LitElement: C });
const jt = K.litElementPolyfillSupport;
jt?.({ LitElement: C });
(K.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ft = (i) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(i, t);
  }) : customElements.define(i, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const It = { attribute: !0, type: String, converter: N, reflect: !1, hasChanged: V }, Lt = (i = It, t, e) => {
  const { kind: s, metadata: o } = e;
  let r = globalThis.litPropertyMetadata.get(o);
  if (r === void 0 && globalThis.litPropertyMetadata.set(o, r = /* @__PURE__ */ new Map()), s === "setter" && ((i = Object.create(i)).wrapped = !0), r.set(e.name, i), s === "accessor") {
    const { name: a } = e;
    return { set(c) {
      const l = t.get.call(this);
      t.set.call(this, c), this.requestUpdate(a, l, i, !0, c);
    }, init(c) {
      return c !== void 0 && this.C(a, void 0, i, c), c;
    } };
  }
  if (s === "setter") {
    const { name: a } = e;
    return function(c) {
      const l = this[a];
      t.call(this, c), this.requestUpdate(a, l, i, !0, c);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function G(i) {
  return (t, e) => typeof e == "object" ? Lt(i, t, e) : ((s, o, r) => {
    const a = o.hasOwnProperty(r);
    return o.constructor.createProperty(r, s), a ? Object.getOwnPropertyDescriptor(o, r) : void 0;
  })(i, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function b(i) {
  return G({ ...i, state: !0, attribute: !1 });
}
var Wt = Object.defineProperty, qt = Object.getOwnPropertyDescriptor, _ = (i, t, e, s) => {
  for (var o = s > 1 ? void 0 : s ? qt(t, e) : t, r = i.length - 1, a; r >= 0; r--)
    (a = i[r]) && (o = (s ? a(t, e, o) : a(o)) || o);
  return s && o && Wt(t, e, o), o;
};
const ct = [
  { id: "vandaag", label: "Vandaag" },
  { id: "fases", label: "Fases" },
  { id: "socialisatie", label: "Socialisatie" },
  { id: "schemas", label: "Schema's" },
  { id: "config", label: "Configuratie" }
], Bt = new Intl.DateTimeFormat("nl-NL", { weekday: "short", day: "numeric", month: "short" }), Vt = new Intl.DateTimeFormat("nl-NL", { weekday: "long", day: "numeric", month: "short" }), ft = 7, P = 60;
function W(i, t) {
  let e = i * 60 + t - ft * 60;
  return e < 0 && (e += 1440), e;
}
function L(i) {
  const [t, e] = i.split(":").map(Number);
  return W(t, e);
}
let g = class extends C {
  constructor() {
    super(...arguments), this.narrow = !1, this._error = "", this._tab = "vandaag", this._taskForm = !1, this._protoForm = !1, this._loaded = !1, this._didScroll = !1;
  }
  connectedCallback() {
    super.connectedCallback(), this._timer = window.setInterval(() => this.requestUpdate(), 1e3);
    const i = localStorage.getItem("pt-tab");
    i && ct.some((t) => t.id === i) && (this._tab = i);
  }
  _selectTab(i) {
    this._tab = i, i === "vandaag" && (this._didScroll = !1);
    try {
      localStorage.setItem("pt-tab", i);
    } catch {
    }
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._timer && window.clearInterval(this._timer);
  }
  updated(i) {
    if (i.has("hass") && this.hass && !this._loaded && (this._loaded = !0, this._load()), this._tab === "vandaag" && this._state && !this._didScroll) {
      const t = this.renderRoot.querySelector(".timeline-scroll");
      if (t && t.clientHeight > 0) {
        const e = /* @__PURE__ */ new Date(), s = W(e.getHours(), e.getMinutes()) / 60 * P;
        t.scrollTop = Math.max(0, s - t.clientHeight / 2), this._didScroll = !0;
      }
    }
  }
  async _ws(i, t = {}) {
    if (this.hass)
      try {
        return await this.hass.connection.sendMessagePromise({ type: `puppy_tracker/${i}`, ...t });
      } catch (e) {
        this._error = String(e?.message ?? e);
        return;
      }
  }
  async _load() {
    const i = await this._ws("get_state");
    i && i.puppy !== void 0 && (this._state = i);
  }
  _merge(i) {
    !i || !this._state || (this._state = { ...this._state, ...i });
  }
  // ---- Actions -----------------------------------------------------------
  _toggleMenu() {
    this.dispatchEvent(new CustomEvent("hass-toggle-menu", { bubbles: !0, composed: !0 }));
  }
  async _markPee() {
    const i = await this._ws("mark_pee");
    i && i.puppy !== void 0 && (this._state = i);
  }
  async _snoozePee() {
    const i = await this._ws("snooze_pee", { minutes: 30 });
    i && i.puppy !== void 0 && (this._state = i);
  }
  async _toggleDaily(i, t) {
    const e = await this._ws("toggle_daily_check", { item_key: i, done: t });
    e && this._merge({ daily_checks: e.daily_checks });
  }
  async _clearToday() {
    const i = await this._ws("clear_daily_checks");
    i && this._merge({ daily_checks: i.daily_checks });
  }
  async _toggleStep(i) {
    const t = await this._ws("set_step_done", { step_id: i.id, done: !i.done_at });
    t && this._merge({ protocols: t.protocols });
  }
  async _applyDefer() {
    if (!this._defer || this._defer.days === 0) {
      this._defer = void 0;
      return;
    }
    const { stepId: i, days: t } = this._defer;
    this._defer = void 0;
    const e = await this._ws("defer_step", { step_id: i, days: t });
    e && this._merge({ protocols: e.protocols });
  }
  async _toggleTask(i) {
    const t = await this._ws("set_task_done", { task_id: i.id, done: !i.done_at });
    t && this._merge({ tasks: t.tasks });
  }
  async _removeTask(i) {
    this._confirm = void 0;
    const t = await this._ws("remove_task", { task_id: i });
    t && this._merge({ tasks: t.tasks });
  }
  async _submitTask() {
    const i = this.renderRoot.querySelector("#nt-title")?.value.trim(), t = this.renderRoot.querySelector("#nt-date")?.value;
    if (!i) return;
    this._taskForm = !1;
    const e = await this._ws("add_task", { title: i, date: t || null });
    e && this._merge({ tasks: e.tasks });
  }
  async _submitProtocol() {
    const i = (s) => this.renderRoot.querySelector(s)?.value ?? "", t = i("#np-name").trim();
    if (!t) return;
    this._protoForm = !1;
    const e = await this._ws("add_protocol", {
      name: t,
      anchor: "fixed",
      start_date: i("#np-start") || null,
      notes: i("#np-notes")
    });
    e && this._merge({ protocols: e.protocols });
  }
  async _submitProtoEdit(i) {
    const t = (o) => this.renderRoot.querySelector(o)?.value ?? "", e = t("#ep-name").trim();
    if (!e) return;
    this._editProto = void 0;
    const s = await this._ws("update_protocol", {
      protocol_id: i.id,
      name: e,
      start_date: t("#ep-start") || null,
      notes: t("#ep-notes")
    });
    s && this._merge({ protocols: s.protocols });
  }
  async _submitStep(i) {
    const t = this.renderRoot.querySelector("#ns-title")?.value.trim(), e = this.renderRoot.querySelector("#ns-date")?.value;
    if (!t) return;
    this._stepForm = void 0;
    const s = this._dateToOffset(i.start_date, e), o = await this._ws("add_step", {
      protocol_id: i.id,
      title: t,
      day_offset: s ?? 0
    });
    o && this._merge({ protocols: o.protocols });
  }
  async _removeProtocol(i) {
    this._confirm = void 0;
    const t = await this._ws("remove_protocol", { protocol_id: i });
    t && this._merge({ protocols: t.protocols });
  }
  _isoLocal(i) {
    const t = i.getFullYear(), e = String(i.getMonth() + 1).padStart(2, "0"), s = String(i.getDate()).padStart(2, "0");
    return `${t}-${e}-${s}`;
  }
  _nextStepDate(i, t) {
    const e = i.steps.length ? i.steps[i.steps.length - 1].effective_date : null;
    if (e) {
      const s = /* @__PURE__ */ new Date(e + "T00:00:00");
      return s.setDate(s.getDate() + 1), this._isoLocal(s);
    }
    return i.start_date ?? t;
  }
  _dateToOffset(i, t) {
    if (!i || !t) return null;
    const e = (/* @__PURE__ */ new Date(i + "T00:00:00")).getTime(), s = (/* @__PURE__ */ new Date(t + "T00:00:00")).getTime();
    return Math.round((s - e) / 864e5);
  }
  async _submitStepEdit(i, t) {
    const e = this.renderRoot.querySelector("#es-title")?.value.trim(), s = this.renderRoot.querySelector("#es-date")?.value, o = this.renderRoot.querySelector("#es-notes")?.value ?? "";
    if (!e) return;
    const r = this._dateToOffset(t.start_date, s);
    this._editStep = void 0;
    const a = { step_id: i.id, title: e, notes: o };
    r !== null && (a.day_offset = r);
    const c = await this._ws("update_step", a);
    c && this._merge({ protocols: c.protocols });
  }
  async _saveConfig() {
    const i = (e) => this.renderRoot.querySelector(e)?.value ?? "", t = await this._ws("update_puppy", {
      name: i("#name"),
      birth_date: i("#birth") || null,
      homecoming_date: i("#home") || null
    });
    t && t.puppy !== void 0 && (this._state = t);
  }
  async _savePhoto(i) {
    const t = await this._ws("update_puppy", { photo_url: i });
    t && t.puppy !== void 0 && (this._state = t);
  }
  _onPhotoFile(i) {
    const t = i.target, e = t.files?.[0];
    if (!e) return;
    const s = new FileReader();
    s.onload = () => {
      const o = new Image();
      o.onload = () => {
        const a = Math.min(1, 400 / Math.max(o.width, o.height)), c = Math.round(o.width * a), l = Math.round(o.height * a), u = document.createElement("canvas");
        u.width = c, u.height = l;
        const m = u.getContext("2d");
        if (!m) return;
        m.drawImage(o, 0, 0, c, l);
        const h = u.toDataURL("image/jpeg", 0.82);
        this._savePhoto(h);
      }, o.src = s.result;
    }, s.readAsDataURL(e), t.value = "";
  }
  // ---- Derived helpers ---------------------------------------------------
  _fmt(i) {
    return i ? Bt.format(/* @__PURE__ */ new Date(i + "T00:00:00")) : "";
  }
  _isToday(i) {
    return !!i && i === this._state?.today;
  }
  _ageText() {
    const i = this._state?.age_days;
    if (i == null) return "leeftijd onbekend";
    const t = Math.floor(i / 7), e = i % 7;
    return `${t} ${t === 1 ? "week" : "weken"} & ${e} ${e === 1 ? "dag" : "dagen"} oud`;
  }
  _countdown() {
    const i = this._state?.next_pee;
    if (!i) return "";
    const t = Math.max(0, Math.round((new Date(i.at).getTime() - Date.now()) / 1e3)), e = Math.floor(t / 3600), s = Math.floor(t % 3600 / 60);
    return e > 0 ? `over ${e} u ${s} min` : `over ${s} min`;
  }
  _restToday() {
    return this._state?.protocols.find((t) => t.seed_key === "socialization")?.steps.find((t) => this._isToday(t.effective_date) && t.category === "rust");
  }
  _todaySteps() {
    const i = [];
    for (const t of this._state?.protocols ?? [])
      for (const e of t.steps) this._isToday(e.effective_date) && i.push({ protocol: t, step: e });
    return i;
  }
  _todayTasks() {
    return (this._state?.tasks ?? []).filter((i) => this._isToday(i.date));
  }
  _upcoming() {
    const i = this._state;
    if (!i) return [];
    const t = /* @__PURE__ */ new Date(i.today + "T00:00:00");
    t.setDate(t.getDate() + 7);
    const e = t.toISOString().slice(0, 10), s = (r) => !!r && r >= i.today && r < e, o = [];
    for (const r of i.tasks)
      s(r.date) && o.push({ date: r.date, color: "var(--primary-color)", icon: "mdi:calendar-check", title: r.title });
    for (const r of i.protocols)
      for (const a of r.steps) {
        if (!s(a.effective_date)) continue;
        const c = i.socialization_categories[a.category];
        o.push({
          date: a.effective_date,
          color: c?.color ?? "var(--primary-color)",
          icon: c?.icon ?? "mdi:flag-outline",
          title: r.seed_key === "socialization" ? a.title : `${a.title} — ${r.name}`,
          step: a
        });
      }
    return o.sort((r, a) => r.date < a.date ? -1 : r.date > a.date ? 1 : 0), o;
  }
  _deferControls(i) {
    return this._defer?.stepId === i.id ? n`
        <span class="defer-inline">
          <input type="number" .value=${String(this._defer.days)}
            @input=${(t) => this._defer = { stepId: i.id, days: parseInt(t.target.value, 10) || 0 }} />
          <span class="dagen">dagen</span>
          <button class="link" @click=${this._applyDefer}>Toepassen</button>
          <button class="link" @click=${() => this._defer = void 0}>Annuleer</button>
        </span>
      ` : n`<button class="link" @click=${() => this._defer = { stepId: i.id, days: 1 }}>Uitstellen…</button>`;
  }
  // ---- Render ------------------------------------------------------------
  render() {
    const i = this._state;
    return n`
      <div class="app">
        ${this._renderHeader()}
        ${this._error ? n`<div class="err">${this._error}</div>` : d}
        <div class="content">
          ${i ? this._renderTab(i) : n`<div class="loading">Laden…</div>`}
        </div>
      </div>
    `;
  }
  _renderHeader() {
    return n`
      <div class="topbar">
        <ha-icon-button class="menu" @click=${this._toggleMenu} title="Menu">
          <ha-icon icon="mdi:menu"></ha-icon>
        </ha-icon-button>
        <div class="title">Puppy Tracker</div>
      </div>
      <div class="tabs">
        ${ct.map(
      (i) => n`<button class="tab ${this._tab === i.id ? "active" : ""}" @click=${() => this._selectTab(i.id)}>${i.label}</button>`
    )}
      </div>
    `;
  }
  _renderTab(i) {
    switch (this._tab) {
      case "fases":
        return this._renderPhases(i);
      case "socialisatie":
        return this._renderSocialization(i);
      case "schemas":
        return this._renderSchedules(i);
      case "config":
        return this._renderConfig(i);
      default:
        return this._renderToday(i);
    }
  }
  // ---- Tab: Vandaag ------------------------------------------------------
  _renderToday(i) {
    return n`
      ${this._renderHero(i)}
      <div class="cols ${this.narrow ? "narrow" : ""}">
        <div class="col-main">${this._renderDaySchedule(i)}</div>
        <div class="col-side">${this._renderUpcoming()}</div>
      </div>
    `;
  }
  _renderHero(i) {
    const t = i.phase, e = i.puppy?.photo_url;
    return n`
      <div class="hero">
        <div class="hero-photo">
          ${e ? n`<img src=${e} alt="foto" />` : n`<ha-icon icon="mdi:dog"></ha-icon>`}
        </div>
        <div class="hero-body">
          <div class="hero-name">${i.puppy?.name ?? "Puppy"}</div>
          <div class="hero-age">${this._ageText()}</div>
          ${t ? n`
                <div class="hero-phase">
                  <span class="dot green"></span>
                  <strong>${t.title}</strong>
                  <small>(${t.week_start}-${t.week_end} wkn)</small>
                </div>
                <div class="hero-focus">Focus: ${t.focus.join(" · ")}</div>
              ` : n`<div class="hero-focus">Stel een geboortedatum in bij Configuratie.</div>`}
          ${i.walk_minutes != null ? n`<div class="hero-rule">🐾 Berner-regel: 5-minutenregel — richtlijn ~${i.walk_minutes} min wandelen.</div>` : d}
          ${i.in_fear_period ? n`<div class="hero-fear">⚠ Angstperiode: nieuwe prikkels positief en rustig opbouwen.</div>` : d}
          <div class="pee">
            <span class="pee-text">
              Volgende plaspauze:
              <strong>${i.next_pee ? new Date(i.next_pee.at).toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" }) : "—"}</strong>
              ${i.next_pee ? n`<em>${this._countdown()} · ${i.next_pee.interval_hours}u interval</em>` : d}
            </span>
            <span class="pee-btns">
              <button class="chip" @click=${this._markPee}>Nu geplast</button>
              <button class="chip ghost" @click=${this._snoozePee}>+30 min</button>
            </span>
          </div>
        </div>
      </div>
    `;
  }
  _renderDaySchedule(i) {
    const t = new Set(i.daily_checks), e = this._restToday(), s = this._todaySteps(), o = this._todayTasks(), r = 24 * P, a = /* @__PURE__ */ new Date(), c = W(a.getHours(), a.getMinutes()) / 60 * P, l = 26, u = [...i.daily_schedule].sort((p, f) => L(p.time) - L(f.time));
    let m = -100;
    const h = u.map((p) => {
      let f = L(p.time) / 60 * P;
      return f < m + 2 && (f = m + 2), m = f + l, { it: p, top: f };
    }), v = Array.from({ length: 24 }, (p, f) => {
      const E = (ft + f) % 24;
      return { hour: E, night: E >= 22 || E < 6, top: f * P };
    });
    return n`
      <section>
        <div class="sec-head">
          <h2><ha-icon icon="mdi:clock-outline"></ha-icon> Dagschema & taken (vandaag)</h2>
          <button class="ghost" @click=${this._clearToday}>Wis vandaag</button>
        </div>
        ${e ? n`<div class="rest-banner">💥 Rustdag — ${e.title}</div>` : d}
        <div class="timeline-scroll">
          <div class="timeline" style="height:${r}px">
            ${v.map(
      (p) => n`
                <div class="hour-line ${p.night ? "night" : ""}" style="top:${p.top}px">
                  <span class="hour-label">${String(p.hour).padStart(2, "0")}:00</span>
                </div>
              `
    )}
            ${h.map(({ it: p, top: f }) => {
      const E = i.schedule_types[p.type], Y = t.has(p.key);
      return n`
                <div class="tl-item ${Y ? "checked" : ""}" style="top:${f}px;--rc:${E?.color ?? "#888"}" title=${p.note || p.label}>
                  <span class="tl-time">${p.time}</span>
                  <span class="tl-label">${p.label}</span>
                  <input type="checkbox" .checked=${Y}
                    @change=${(gt) => this._toggleDaily(p.key, gt.target.checked)} />
                </div>
              `;
    })}
            <div class="now-line" style="top:${c}px">
              <span class="now-dot"></span>
              <span class="now-time">${a.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })}</span>
            </div>
          </div>
        </div>

        ${s.length || o.length ? n`
              <div class="subhead">Taken & schema-stappen vandaag</div>
              <div class="today-items">
                ${o.map(
      (p) => n`
                    <label class="row ${p.done_at ? "checked" : ""}" style="--rc:var(--primary-color)">
                      <ha-icon icon="mdi:calendar-check"></ha-icon>
                      <span class="row-main"><span class="row-title">${p.title}</span></span>
                      <input type="checkbox" .checked=${!!p.done_at} @change=${() => this._toggleTask(p)} />
                    </label>
                  `
    )}
                ${s.map(
      ({ protocol: p, step: f }) => n`
                    <label class="row ${f.done_at ? "checked" : ""}" style="--rc:#a05ac0">
                      <ha-icon icon="mdi:flag-outline"></ha-icon>
                      <span class="row-main">
                        <span class="row-title">${f.title}</span>
                        <span class="row-note">${p.name}</span>
                      </span>
                      ${this._deferControls(f)}
                      <input type="checkbox" .checked=${!!f.done_at} @change=${() => this._toggleStep(f)} />
                    </label>
                  `
    )}
              </div>
            ` : d}
      </section>
    `;
  }
  _renderUpcoming() {
    const i = this._upcoming();
    let t = "";
    return n`
      <section>
        <h2><ha-icon icon="mdi:calendar-star"></ha-icon> Belangrijke gebeurtenissen (deze week)</h2>
        ${i.length === 0 ? n`<p class="muted">Niets gepland deze week.</p>` : d}
        <div class="events">
          ${i.map((e) => {
      const s = e.date !== t;
      return t = e.date, n`
              ${s ? n`<div class="ev-date">${Vt.format(/* @__PURE__ */ new Date(e.date + "T00:00:00"))}</div>` : d}
              <div class="ev">
                <span class="dot" style="background:${e.color}"></span>
                <ha-icon icon=${e.icon}></ha-icon>
                <span class="ev-title">${e.title}</span>
              </div>
            `;
    })}
        </div>
      </section>
    `;
  }
  // ---- Tab: Fases --------------------------------------------------------
  _renderPhases(i) {
    return n`
      <section>
        <h2>Fases</h2>
        ${i.phases.map((t) => {
      const e = i.phase?.key === t.key;
      return n`
            <details class="phase" ?open=${e}>
              <summary>
                <span>${t.title} <small>(${t.week_start}-${t.week_end} wkn)</small></span>
                ${e ? n`<span class="badge">Nu</span>` : d}
              </summary>
              <div class="phase-body">
                <ul class="focus">${t.focus.map((s) => n`<li>${s}</li>`)}</ul>
                <div class="cards">
                  ${t.info_cards.map(
        (s) => n`
                      <div class="info-card">
                        <h4><ha-icon icon=${s.icon}></ha-icon> ${s.title}</h4>
                        <ul>${s.items.map((o) => n`<li>${o}</li>`)}</ul>
                      </div>
                    `
      )}
                </div>
              </div>
            </details>
          `;
    })}
      </section>
    `;
  }
  // ---- Tab: Socialisatie -------------------------------------------------
  async _removeStep(i) {
    this._confirm = void 0;
    const t = await this._ws("remove_step", { step_id: i });
    t && this._merge({ protocols: t.protocols });
  }
  _stepDelete(i) {
    return this._confirm?.kind === "step" && this._confirm.id === i.id ? n`<span class="confirm">Verwijderen?
          <button class="link danger" @click=${() => this._removeStep(i.id)}>Ja</button>
          <button class="link" @click=${() => this._confirm = void 0}>Nee</button></span>` : n`<button class="link danger" title="Verwijderen" @click=${() => this._confirm = { kind: "step", id: i.id }}>×</button>`;
  }
  async _moveStepWeek(i, t) {
    const e = await this._ws("update_step", {
      step_id: i.id,
      day_offset: i.day_offset + t * 7
    });
    e && this._merge({ protocols: e.protocols });
  }
  _currentSocWeek(i) {
    if (!i.start_date || !this._state) return null;
    const t = (/* @__PURE__ */ new Date(i.start_date + "T00:00:00")).getTime(), e = (/* @__PURE__ */ new Date(this._state.today + "T00:00:00")).getTime();
    return e < t ? -1 : Math.floor((e - t) / (7 * 864e5));
  }
  _renderSocialization(i) {
    const t = i.protocols.find((r) => r.seed_key === "socialization");
    if (!t) return n`<section><p class="muted">Geen socialisatieprogramma. Stel een thuiskomstdatum in.</p></section>`;
    const e = 5, s = this._currentSocWeek(t), o = Array.from({ length: e }, () => []);
    for (const r of t.steps) {
      const a = Math.min(e - 1, Math.max(0, Math.floor(r.day_offset / 7)));
      o[a].push(r);
    }
    return n`
      <section>
        <div class="sec-head">
          <h2>Socialisatie <small class="muted">(7-12 weken · weekchecklist)</small></h2>
        </div>
        <div class="legend">
          ${Object.entries(i.socialization_categories).map(
      ([, r]) => n`<span class="tag"><span class="dot" style="background:${r.color}"></span>${r.label}</span>`
    )}
        </div>
        <div class="weeks">
          ${o.map((r, a) => this._renderSocWeek(i, t, r, a, s, e))}
        </div>
      </section>
    `;
  }
  _renderSocWeek(i, t, e, s, o, r) {
    const a = e.filter((l) => l.done_at).length, c = o === s;
    return n`
      <div class="week-card ${c ? "current" : ""}">
        <div class="week-head">
          <div>
            <strong>Week ${s + 1}</strong>
            <small class="muted">${7 + s}-${8 + s} wk</small>
            ${c ? n`<span class="badge">Nu</span>` : d}
          </div>
          <span class="week-progress">${a}/${e.length}</span>
        </div>
        <div class="week-items">
          ${e.length === 0 ? n`<div class="muted small">Geen activiteiten deze week.</div>` : d}
          ${e.map((l) => this._renderSocItem(i, t, l, s, r))}
        </div>
      </div>
    `;
  }
  _renderSocItem(i, t, e, s, o) {
    const r = i.socialization_categories[e.category];
    return this._editStep === e.id ? n`
        <div class="soc-item editing">
          <input id="es-title" type="text" .value=${e.title} placeholder="activiteit" />
          <input id="es-notes" type="text" .value=${e.notes} placeholder="notitie (optioneel)" />
          <input id="es-date" type="hidden" .value=${e.effective_date ?? ""} />
          <div class="soc-item-actions">
            <button class="primary" @click=${() => this._submitStepEdit(e, t)}>Opslaan</button>
            <button class="link" @click=${() => this._editStep = void 0}>Annuleer</button>
          </div>
        </div>
      ` : n`
      <div class="soc-item ${e.done_at ? "done" : ""}" style="--rc:${r?.color ?? "#888"}">
        <input type="checkbox" .checked=${!!e.done_at} @change=${() => this._toggleStep(e)} />
        <span class="cat-dot" style="background:${r?.color ?? "#888"}" title=${r?.label ?? ""}></span>
        <span class="soc-item-main">
          <span class="soc-item-title">${e.title}</span>
          ${e.notes ? n`<span class="soc-item-note">${e.notes}</span>` : d}
        </span>
        <span class="soc-item-actions">
          <button class="iconbtn" title="Vorige week" ?disabled=${s === 0} @click=${() => this._moveStepWeek(e, -1)}>←</button>
          <button class="iconbtn" title="Volgende week" ?disabled=${s === o - 1} @click=${() => this._moveStepWeek(e, 1)}>→</button>
          <button class="link" @click=${() => this._editStep = e.id}>Bewerken</button>
          ${this._stepDelete(e)}
        </span>
      </div>
    `;
  }
  // ---- Tab: Schema's -----------------------------------------------------
  _renderSchedules(i) {
    const t = i.protocols.filter((e) => e.seed_key !== "socialization");
    return n`
      <section>
        <div class="sec-head">
          <h2>Schema's & taken</h2>
          <span>
            <button class="ghost" @click=${() => {
      this._taskForm = !this._taskForm, this._protoForm = !1;
    }}>+ Taak</button>
            <button class="ghost" @click=${() => {
      this._protoForm = !this._protoForm, this._taskForm = !1;
    }}>+ Schema</button>
          </span>
        </div>

        ${this._taskForm ? n`<div class="inline-form">
              <input id="nt-title" type="text" placeholder="Titel (bv. Dierenarts)" />
              <input id="nt-date" type="date" .value=${i.today} />
              <button class="primary" @click=${this._submitTask}>Toevoegen</button>
              <button class="link" @click=${() => this._taskForm = !1}>Annuleer</button>
            </div>` : d}
        ${this._protoForm ? n`<div class="inline-form">
              <label class="fld grow">Naam<input id="np-name" type="text" placeholder="bv. Bench verplaatsen" /></label>
              <label class="fld">Startdatum<input id="np-start" type="date" .value=${i.today} /></label>
              <label class="fld grow">Omschrijving (optioneel)<input id="np-notes" type="text" placeholder="Waar gaat dit schema over?" /></label>
              <button class="primary" @click=${this._submitProtocol}>Toevoegen</button>
              <button class="link" @click=${() => this._protoForm = !1}>Annuleer</button>
            </div>` : d}

        ${i.tasks.length ? n`<div class="tasks">
              ${i.tasks.map(
      (e) => n`
                  <div class="task ${e.done_at ? "done" : ""}">
                    <input type="checkbox" .checked=${!!e.done_at} @change=${() => this._toggleTask(e)} />
                    <span class="task-main">
                      <span class="task-title">${e.title}</span>
                      ${e.date ? n`<span class="task-date">${this._fmt(e.date)}</span>` : d}
                    </span>
                    ${this._confirm?.kind === "task" && this._confirm.id === e.id ? n`<span class="confirm">Zeker?
                          <button class="link danger" @click=${() => this._removeTask(e.id)}>Ja</button>
                          <button class="link" @click=${() => this._confirm = void 0}>Nee</button></span>` : n`<button class="link danger" @click=${() => this._confirm = { kind: "task", id: e.id }}>×</button>`}
                  </div>
                `
    )}
            </div>` : d}

        ${t.map(
      (e) => n`
            <div class="proto">
              ${this._editProto === e.id ? n`<div class="inline-form">
                    <label class="fld grow">Naam<input id="ep-name" type="text" .value=${e.name} /></label>
                    <label class="fld">Startdatum<input id="ep-start" type="date" .value=${e.start_date ?? ""} /></label>
                    <label class="fld grow">Omschrijving<input id="ep-notes" type="text" .value=${e.notes} placeholder="Waar gaat dit schema over?" /></label>
                    <button class="primary" @click=${() => this._submitProtoEdit(e)}>Opslaan</button>
                    <button class="link" @click=${() => this._editProto = void 0}>Annuleer</button>
                  </div>` : n`
                    <div class="proto-head">
                      <strong>${e.name}</strong>
                      <span>
                        <button class="link" @click=${() => this._editProto = e.id}>Bewerken</button>
                        <button class="link" @click=${() => {
        this._stepForm = this._stepForm === e.id ? void 0 : e.id;
      }}>+ Stap</button>
                        ${this._confirm?.kind === "protocol" && this._confirm.id === e.id ? n`<span class="confirm">Zeker?
                              <button class="link danger" @click=${() => this._removeProtocol(e.id)}>Ja</button>
                              <button class="link" @click=${() => this._confirm = void 0}>Nee</button></span>` : n`<button class="link danger" @click=${() => this._confirm = { kind: "protocol", id: e.id }}>Verwijderen</button>`}
                      </span>
                    </div>
                    ${e.notes ? n`<div class="proto-note">${e.notes}</div>` : d}
                  `}
              ${this._stepForm === e.id ? n`<div class="inline-form">
                    <label class="fld grow">Titel<input id="ns-title" type="text" placeholder="Titel van de stap" /></label>
                    <label class="fld">Datum<input id="ns-date" type="date" .value=${this._nextStepDate(e, i.today)} /></label>
                    <button class="primary" @click=${() => this._submitStep(e)}>Toevoegen</button>
                    <button class="link" @click=${() => this._stepForm = void 0}>Annuleer</button>
                  </div>` : d}
              <div class="steps">
                ${e.steps.map(
        (s) => this._editStep === s.id ? n`
                        <div class="step editing">
                          <input id="es-title" type="text" .value=${s.title} placeholder="titel" />
                          <input id="es-date" type="date" .value=${s.effective_date ?? ""} />
                          <input id="es-notes" type="text" .value=${s.notes} placeholder="notitie (optioneel)" />
                          <button class="primary" @click=${() => this._submitStepEdit(s, e)}>Opslaan</button>
                          <button class="link" @click=${() => this._editStep = void 0}>Annuleer</button>
                        </div>
                      ` : n`
                        <div class="step ${this._isToday(s.effective_date) ? "today" : ""} ${s.done_at ? "done" : ""}">
                          <input type="checkbox" .checked=${!!s.done_at} @change=${() => this._toggleStep(s)} />
                          <span class="step-date">${this._fmt(s.effective_date)}</span>
                          <span class="step-title">${s.title}</span>
                          <button class="link" @click=${() => this._editStep = s.id}>Bewerken</button>
                          ${this._deferControls(s)}
                          ${this._stepDelete(s)}
                        </div>
                      `
      )}
              </div>
            </div>
          `
    )}
      </section>
    `;
  }
  // ---- Tab: Configuratie -------------------------------------------------
  _renderConfig(i) {
    const t = i.puppy;
    return n`
      <section>
        <h2>Configuratie</h2>
        <div class="settings">
          <div class="photo-field">
            <div class="photo-preview">
              ${t?.photo_url ? n`<img src=${t.photo_url} alt="foto van ${t.name}" />` : n`<ha-icon icon="mdi:dog"></ha-icon>`}
            </div>
            <div class="photo-actions">
              <label class="filebtn">
                Foto kiezen…
                <input type="file" accept="image/*" @change=${this._onPhotoFile} hidden />
              </label>
              ${t?.photo_url ? n`<button class="link danger" @click=${() => this._savePhoto("")}>Verwijderen</button>` : d}
              <div class="muted small">Wordt automatisch verkleind en opgeslagen.</div>
            </div>
          </div>
          <label>Naam<input type="text" id="name" .value=${t?.name ?? ""} /></label>
          <label>Geboortedatum<input type="date" id="birth" .value=${t?.birth_date ?? ""} /></label>
          <label>Thuiskomstdatum<input type="date" id="home" .value=${t?.homecoming_date ?? ""} /></label>
          <button class="primary" @click=${this._saveConfig}>Opslaan</button>
          <p class="muted">Bij het wijzigen van de thuiskomstdatum schuift het socialisatie- en benchschema automatisch mee.</p>
        </div>
      </section>
    `;
  }
};
g.styles = vt`
    :host { display: block; color: var(--primary-text-color); background: var(--primary-background-color); min-height: 100vh; }
    .app { display: flex; flex-direction: column; min-height: 100vh; }

    .topbar { display: flex; align-items: center; gap: 8px; height: 56px; padding: 0 12px; background: var(--app-header-background-color, var(--primary-color)); color: var(--app-header-text-color, var(--text-primary-color, #fff)); }
    .topbar .title { font-size: 1.2rem; font-weight: 500; }
    .menu { --mdc-icon-button-size: 40px; color: inherit; background: none; border: none; cursor: pointer; }

    .tabs { display: flex; gap: 4px; background: var(--app-header-background-color, var(--primary-color)); padding: 0 8px; overflow-x: auto; }
    .tab { background: none; border: none; color: var(--app-header-text-color, #fff); opacity: .8; padding: 12px 16px; cursor: pointer; font: inherit; border-bottom: 3px solid transparent; white-space: nowrap; }
    .tab.active { opacity: 1; border-bottom-color: var(--app-header-text-color, #fff); font-weight: 600; }

    .content { padding: 16px; max-width: 1100px; width: 100%; margin: 0 auto; box-sizing: border-box; }
    .loading { padding: 40px; text-align: center; opacity: .6; }
    .err { background: var(--error-color, #b00020); color: #fff; padding: 8px 12px; }
    .muted { opacity: .6; }

    section { background: var(--card-background-color); border-radius: 14px; padding: 14px 16px; margin-bottom: 14px; box-shadow: var(--ha-card-box-shadow, 0 2px 6px rgba(0,0,0,.1)); }
    .sec-head { display: flex; align-items: center; justify-content: space-between; }
    h2 { font-size: 1.05rem; margin: 0 0 10px; display: flex; align-items: center; gap: 6px; }
    h4 { margin: 0 0 6px; font-size: .9rem; display: flex; align-items: center; gap: 6px; }
    .subhead { font-weight: 600; margin: 14px 0 6px; opacity: .85; }

    button { font: inherit; cursor: pointer; border-radius: 8px; border: none; padding: 6px 10px; }
    button.ghost { background: transparent; border: 1px solid var(--divider-color, #ccc); color: inherit; }
    button.primary { background: var(--primary-color); color: var(--text-primary-color, #fff); }
    button.link { background: none; border: none; color: var(--primary-color); padding: 2px 4px; font-size: .8rem; }
    button.link.danger { color: var(--error-color, #b00020); }
    .chip { border-radius: 999px; padding: 6px 14px; background: var(--primary-color); color: var(--text-primary-color, #fff); border: none; }
    .chip.ghost { background: transparent; border: 1px solid var(--primary-color); color: var(--primary-color); }

    /* Hero */
    .hero { display: flex; gap: 16px; background: var(--card-background-color); border-radius: 14px; padding: 16px; margin-bottom: 14px; box-shadow: var(--ha-card-box-shadow, 0 2px 6px rgba(0,0,0,.12)); }
    .hero-photo { flex: 0 0 auto; width: 128px; height: 128px; border-radius: 12px; overflow: hidden; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, var(--primary-color), color-mix(in srgb, var(--primary-color) 40%, #000)); color: #fff; }
    .hero-photo img { width: 100%; height: 100%; object-fit: cover; }
    .hero-photo ha-icon { --mdc-icon-size: 64px; }
    .hero-body { flex: 1; min-width: 0; }
    .hero-name { font-size: 1.5rem; font-weight: 700; }
    .hero-age { opacity: .7; margin-bottom: 8px; }
    .hero-phase { display: flex; align-items: center; gap: 6px; }
    .hero-phase small { opacity: .6; }
    .hero-focus { font-size: .9rem; opacity: .85; margin: 2px 0; }
    .hero-rule { font-size: .85rem; margin-top: 6px; }
    .hero-fear { font-size: .85rem; color: var(--warning-color, #ffa600); margin-top: 4px; }
    .pee { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 10px; margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--divider-color, #eee); }
    .pee-text em { font-style: normal; opacity: .7; font-size: .85rem; margin-left: 6px; }
    .pee-btns { display: flex; gap: 8px; }

    .dot { width: 10px; height: 10px; border-radius: 50%; flex: 0 0 auto; display: inline-block; }
    .dot.green { background: #43a047; }

    /* Two columns */
    .cols { display: grid; grid-template-columns: 2fr 1fr; gap: 14px; align-items: start; }
    .cols.narrow { grid-template-columns: 1fr; }

    /* Day-view timeline */
    .timeline-scroll { position: relative; max-height: 620px; overflow-y: auto; border: 1px solid var(--divider-color, #eee); border-radius: 10px; padding: 4px 0; }
    .timeline { position: relative; margin-left: 54px; margin-right: 8px; }
    .hour-line { position: absolute; left: -54px; right: 0; height: 0; border-top: 1px solid var(--divider-color, #eee); }
    .hour-line.night::before { content: ""; position: absolute; left: 0; right: 0; top: 0; height: 60px; background: color-mix(in srgb, var(--primary-text-color) 7%, transparent); z-index: 0; pointer-events: none; }
    .hour-label { position: absolute; left: 0; top: -8px; width: 46px; text-align: right; font-size: .72rem; opacity: .6; font-variant-numeric: tabular-nums; }
    .tl-item { position: absolute; left: 4px; right: 4px; height: 24px; display: flex; align-items: center; gap: 8px; padding: 0 8px; border-radius: 6px; box-sizing: border-box; z-index: 1; background: color-mix(in srgb, var(--rc) 20%, var(--card-background-color)); border-left: 3px solid var(--rc); }
    .tl-item.checked { opacity: .5; }
    .tl-item.checked .tl-label { text-decoration: line-through; }
    .tl-time { font-size: .72rem; opacity: .8; font-variant-numeric: tabular-nums; flex: 0 0 auto; }
    .tl-label { flex: 1; font-size: .82rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .tl-item input { width: 16px; height: 16px; flex: 0 0 auto; }
    .now-line { position: absolute; left: -54px; right: 0; height: 0; border-top: 2px solid var(--error-color, #d33); z-index: 3; pointer-events: none; }
    .now-dot { position: absolute; left: -4px; top: -5px; width: 9px; height: 9px; border-radius: 50%; background: var(--error-color, #d33); }
    .now-time { position: absolute; left: 6px; top: -18px; font-size: .68rem; font-weight: 600; color: var(--error-color, #d33); background: var(--card-background-color); padding: 0 3px; border-radius: 3px; }

    /* Schedule rows */
    .schedule, .today-items { display: flex; flex-direction: column; gap: 2px; }
    .row { display: flex; align-items: center; gap: 10px; padding: 8px; border-radius: 8px; border-left: 4px solid var(--rc, #888); }
    .row.night { background: color-mix(in srgb, var(--primary-text-color) 8%, transparent); }
    .row.checked .row-title { text-decoration: line-through; opacity: .5; }
    .row .time { font-variant-numeric: tabular-nums; width: 44px; opacity: .8; font-size: .9rem; }
    .row .bar { display: none; }
    .row-main { display: flex; flex-direction: column; flex: 1; min-width: 0; }
    .row-title { font-weight: 500; }
    .row-note { font-size: .78rem; opacity: .65; }
    input[type="checkbox"] { width: 20px; height: 20px; accent-color: var(--primary-color); flex: 0 0 auto; }
    .rest-banner { background: color-mix(in srgb, #c8863b 22%, transparent); border-radius: 8px; padding: 8px 12px; font-weight: 600; margin-bottom: 8px; }

    /* Events */
    .events { display: flex; flex-direction: column; gap: 4px; }
    .ev-date { font-weight: 600; margin-top: 10px; font-size: .85rem; text-transform: capitalize; }
    .ev { display: flex; align-items: center; gap: 8px; padding: 4px 2px; }
    .ev-title { font-size: .9rem; }

    /* Phases */
    details.phase, details { margin-bottom: 8px; }
    summary { cursor: pointer; display: flex; align-items: center; justify-content: space-between; font-weight: 600; padding: 6px 0; list-style: none; }
    summary::-webkit-details-marker { display: none; }
    summary small { font-weight: 400; opacity: .6; }
    .badge { background: var(--primary-color); color: var(--text-primary-color, #fff); border-radius: 999px; font-size: .7rem; padding: 2px 8px; }
    .focus { margin: 4px 0 10px; padding-left: 18px; }
    .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 10px; }
    .info-card { background: color-mix(in srgb, var(--primary-text-color) 5%, transparent); border-radius: 10px; padding: 10px 12px; }
    .info-card ul { margin: 0; padding-left: 16px; font-size: .82rem; }

    /* Socialization */
    .legend { display: flex; flex-wrap: wrap; gap: 10px; margin: 6px 0 10px; font-size: .78rem; }
    .tag { display: inline-flex; align-items: center; gap: 5px; }
    .socia { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 8px; }
    .soc-day { border-left: 4px solid #888; background: color-mix(in srgb, var(--primary-text-color) 4%, transparent); border-radius: 8px; padding: 8px 10px; }
    .soc-day.past { opacity: .5; }
    .soc-day.today { outline: 2px solid var(--error-color, #d33); }
    .soc-day.done .soc-act { text-decoration: line-through; }
    .soc-top { display: flex; justify-content: space-between; align-items: center; }
    .soc-date { font-size: .75rem; opacity: .7; }
    .soc-act { font-weight: 600; font-size: .85rem; margin: 2px 0; }
    .soc-note { font-size: .75rem; opacity: .7; }

    /* Socialization week checklist */
    .weeks { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 12px; }
    .week-card { border: 1px solid var(--divider-color, #ddd); border-radius: 12px; padding: 10px 12px; background: color-mix(in srgb, var(--primary-text-color) 3%, transparent); }
    .week-card.current { border-color: var(--primary-color); box-shadow: 0 0 0 1px var(--primary-color) inset; }
    .week-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
    .week-head .badge { margin-left: 6px; }
    .week-progress { font-size: .8rem; opacity: .7; font-variant-numeric: tabular-nums; }
    .week-items { display: flex; flex-direction: column; gap: 4px; }
    .soc-item { display: flex; align-items: center; gap: 8px; padding: 6px 4px; border-radius: 8px; }
    .soc-item.done .soc-item-title { text-decoration: line-through; opacity: .5; }
    .cat-dot { width: 9px; height: 9px; border-radius: 50%; flex: 0 0 auto; }
    .soc-item-main { display: flex; flex-direction: column; flex: 1; min-width: 0; }
    .soc-item-title { font-size: .88rem; }
    .soc-item-note { font-size: .74rem; opacity: .65; }
    .soc-item-actions { display: flex; align-items: center; gap: 4px; flex: 0 0 auto; }
    .iconbtn { background: transparent; border: 1px solid var(--divider-color, #ccc); border-radius: 6px; width: 24px; height: 24px; padding: 0; cursor: pointer; color: inherit; line-height: 1; }
    .iconbtn:disabled { opacity: .3; cursor: default; }
    .soc-item.editing { flex-wrap: wrap; gap: 6px; }
    .soc-item.editing input[type="text"] { flex: 1 1 140px; padding: 6px; border-radius: 6px; border: 1px solid var(--divider-color, #ccc); background: var(--card-background-color); color: inherit; font: inherit; }

    /* Schedules */
    .tasks { display: flex; flex-direction: column; gap: 4px; margin-bottom: 10px; }
    .task, .step { display: flex; align-items: center; gap: 8px; padding: 4px 6px; border-radius: 8px; }
    .task.done .task-title, .step.done .step-title { text-decoration: line-through; opacity: .5; }
    .task-main { display: flex; gap: 8px; align-items: baseline; flex: 1; }
    .task-date, .step-date { font-size: .75rem; opacity: .7; font-variant-numeric: tabular-nums; }
    .step-title { flex: 1; }
    .step.today { background: color-mix(in srgb, var(--error-color, #d33) 12%, transparent); }
    .proto { border: 1px solid var(--divider-color, #ddd); border-radius: 10px; padding: 10px; margin-top: 10px; }
    .proto-head { display: flex; justify-content: space-between; align-items: center; }
    .proto-note { font-size: .8rem; opacity: .7; margin: 4px 0; }
    .steps { display: flex; flex-direction: column; gap: 2px; margin-top: 6px; }

    .defer-inline { display: inline-flex; align-items: center; flex-wrap: wrap; gap: 2px 6px; }
    .defer-inline input { width: 48px; padding: 4px; border-radius: 6px; border: 1px solid var(--divider-color, #ccc); background: var(--card-background-color); color: inherit; }
    .defer-inline .dagen { font-size: .78rem; opacity: .7; }

    .soc-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 10px; margin-top: 8px; }
    .soc-actions .defer-inline { flex-basis: 100%; }
    .soc-day.editing { display: flex; flex-direction: column; gap: 6px; }
    .soc-day.editing input { padding: 6px; border-radius: 6px; border: 1px solid var(--divider-color, #ccc); background: var(--card-background-color); color: inherit; font: inherit; }
    .step.editing { flex-wrap: wrap; gap: 6px; padding: 8px 6px; }
    .step.editing input[type="text"] { flex: 1 1 160px; }
    .step.editing input { padding: 6px; border-radius: 6px; border: 1px solid var(--divider-color, #ccc); background: var(--card-background-color); color: inherit; font: inherit; }
    .confirm { font-size: .8rem; display: inline-flex; align-items: center; gap: 4px; }
    .inline-form { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin: 8px 0; padding: 10px; border: 1px dashed var(--divider-color, #ccc); border-radius: 10px; }
    .inline-form input[type="text"] { flex: 1; min-width: 160px; }
    .inline-form input { padding: 8px; border-radius: 8px; border: 1px solid var(--divider-color, #ccc); background: var(--card-background-color); color: inherit; }
    .inline-form .fld { display: flex; flex-direction: column; gap: 3px; font-size: .72rem; opacity: .85; }
    .inline-form .fld.grow { flex: 1 1 160px; }
    .inline-form .fld input { width: 100%; box-sizing: border-box; }

    /* Config */
    .settings { display: flex; flex-direction: column; gap: 10px; max-width: 360px; }
    .settings label { display: flex; flex-direction: column; font-size: .85rem; gap: 4px; }
    .settings input { padding: 8px; border-radius: 8px; border: 1px solid var(--divider-color, #ccc); background: var(--card-background-color); color: inherit; }
    .photo-field { display: flex; gap: 14px; align-items: center; }
    .photo-preview { width: 96px; height: 96px; border-radius: 12px; overflow: hidden; flex: 0 0 auto; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, var(--primary-color), color-mix(in srgb, var(--primary-color) 40%, #000)); color: #fff; }
    .photo-preview img { width: 100%; height: 100%; object-fit: cover; }
    .photo-preview ha-icon { --mdc-icon-size: 48px; }
    .photo-actions { display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }
    .filebtn { display: inline-block; cursor: pointer; background: transparent; border: 1px solid var(--primary-color); color: var(--primary-color); border-radius: 8px; padding: 8px 14px; font-size: .9rem; }
    .small { font-size: .78rem; }
  `;
_([
  G({ attribute: !1 })
], g.prototype, "hass", 2);
_([
  G({ attribute: !1 })
], g.prototype, "narrow", 2);
_([
  b()
], g.prototype, "_state", 2);
_([
  b()
], g.prototype, "_error", 2);
_([
  b()
], g.prototype, "_tab", 2);
_([
  b()
], g.prototype, "_defer", 2);
_([
  b()
], g.prototype, "_taskForm", 2);
_([
  b()
], g.prototype, "_protoForm", 2);
_([
  b()
], g.prototype, "_stepForm", 2);
_([
  b()
], g.prototype, "_editStep", 2);
_([
  b()
], g.prototype, "_editProto", 2);
_([
  b()
], g.prototype, "_confirm", 2);
g = _([
  Ft("puppy-tracker-panel")
], g);
export {
  g as PuppyTrackerPanel
};
