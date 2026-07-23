/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const j = globalThis, K = j.ShadowRoot && (j.ShadyCSS === void 0 || j.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Q = Symbol(), st = /* @__PURE__ */ new WeakMap();
let ft = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== Q) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (K && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = st.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && st.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const bt = (i) => new ft(typeof i == "string" ? i : i + "", void 0, Q), xt = (i, ...t) => {
  const e = i.length === 1 ? i[0] : t.reduce((s, o, a) => s + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(o) + i[a + 1], i[0]);
  return new ft(e, i, Q);
}, kt = (i, t) => {
  if (K) i.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), o = j.litNonce;
    o !== void 0 && s.setAttribute("nonce", o), s.textContent = e.cssText, i.appendChild(s);
  }
}, ot = K ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return bt(e);
})(i) : i;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: wt, defineProperty: St, getOwnPropertyDescriptor: At, getOwnPropertyNames: Tt, getOwnPropertySymbols: Pt, getPrototypeOf: Et } = Object, q = globalThis, at = q.trustedTypes, Ct = at ? at.emptyScript : "", Dt = q.reactiveElementPolyfillSupport, O = (i, t) => i, W = { toAttribute(i, t) {
  switch (t) {
    case Boolean:
      i = i ? Ct : null;
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
} }, J = (i, t) => !wt(i, t), nt = { attribute: !0, type: String, converter: W, reflect: !1, useDefault: !1, hasChanged: J };
Symbol.metadata ??= Symbol("metadata"), q.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let P = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = nt) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = Symbol(), o = this.getPropertyDescriptor(t, s, e);
      o !== void 0 && St(this.prototype, t, o);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: o, set: a } = At(this.prototype, t) ?? { get() {
      return this[e];
    }, set(n) {
      this[e] = n;
    } };
    return { get: o, set(n) {
      const c = o?.call(this);
      a?.call(this, n), this.requestUpdate(t, c, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? nt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(O("elementProperties"))) return;
    const t = Et(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(O("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(O("properties"))) {
      const e = this.properties, s = [...Tt(e), ...Pt(e)];
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
      for (const o of s) e.unshift(ot(o));
    } else t !== void 0 && e.push(ot(t));
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
    return kt(t, this.constructor.elementStyles), t;
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
      const a = (s.converter?.toAttribute !== void 0 ? s.converter : W).toAttribute(e, s.type);
      this._$Em = t, a == null ? this.removeAttribute(o) : this.setAttribute(o, a), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const s = this.constructor, o = s._$Eh.get(t);
    if (o !== void 0 && this._$Em !== o) {
      const a = s.getPropertyOptions(o), n = typeof a.converter == "function" ? { fromAttribute: a.converter } : a.converter?.fromAttribute !== void 0 ? a.converter : W;
      this._$Em = o;
      const c = n.fromAttribute(e, a.type);
      this[o] = c ?? this._$Ej?.get(o) ?? c, this._$Em = null;
    }
  }
  requestUpdate(t, e, s, o = !1, a) {
    if (t !== void 0) {
      const n = this.constructor;
      if (o === !1 && (a = this[t]), s ??= n.getPropertyOptions(t), !((s.hasChanged ?? J)(a, e) || s.useDefault && s.reflect && a === this._$Ej?.get(t) && !this.hasAttribute(n._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: o, wrapped: a }, n) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, n ?? e ?? this[t]), a !== !0 || n !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), o === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
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
        for (const [o, a] of this._$Ep) this[o] = a;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [o, a] of s) {
        const { wrapped: n } = a, c = this[o];
        n !== !0 || this._$AL.has(o) || c === void 0 || this.C(o, void 0, a, c);
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
P.elementStyles = [], P.shadowRootOptions = { mode: "open" }, P[O("elementProperties")] = /* @__PURE__ */ new Map(), P[O("finalized")] = /* @__PURE__ */ new Map(), Dt?.({ ReactiveElement: P }), (q.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Z = globalThis, rt = (i) => i, B = Z.trustedTypes, lt = B ? B.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, gt = "$lit$", k = `lit$${Math.random().toFixed(9).slice(2)}$`, _t = "?" + k, zt = `<${_t}>`, A = document, M = () => A.createComment(""), H = (i) => i === null || typeof i != "object" && typeof i != "function", G = Array.isArray, Ot = (i) => G(i) || typeof i?.[Symbol.iterator] == "function", Y = `[ 	
\f\r]`, D = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ct = /-->/g, dt = />/g, w = RegExp(`>|${Y}(?:([^\\s"'>=/]+)(${Y}*=${Y}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), pt = /'/g, ht = /"/g, vt = /^(?:script|style|textarea|title)$/i, Rt = (i) => (t, ...e) => ({ _$litType$: i, strings: t, values: e }), r = Rt(1), b = Symbol.for("lit-noChange"), d = Symbol.for("lit-nothing"), ut = /* @__PURE__ */ new WeakMap(), S = A.createTreeWalker(A, 129);
function $t(i, t) {
  if (!G(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return lt !== void 0 ? lt.createHTML(t) : t;
}
const Mt = (i, t) => {
  const e = i.length - 1, s = [];
  let o, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", n = D;
  for (let c = 0; c < e; c++) {
    const l = i[c];
    let u, p, h = -1, $ = 0;
    for (; $ < l.length && (n.lastIndex = $, p = n.exec(l), p !== null); ) $ = n.lastIndex, n === D ? p[1] === "!--" ? n = ct : p[1] !== void 0 ? n = dt : p[2] !== void 0 ? (vt.test(p[2]) && (o = RegExp("</" + p[2], "g")), n = w) : p[3] !== void 0 && (n = w) : n === w ? p[0] === ">" ? (n = o ?? D, h = -1) : p[1] === void 0 ? h = -2 : (h = n.lastIndex - p[2].length, u = p[1], n = p[3] === void 0 ? w : p[3] === '"' ? ht : pt) : n === ht || n === pt ? n = w : n === ct || n === dt ? n = D : (n = w, o = void 0);
    const y = n === w && i[c + 1].startsWith("/>") ? " " : "";
    a += n === D ? l + zt : h >= 0 ? (s.push(u), l.slice(0, h) + gt + l.slice(h) + k + y) : l + k + (h === -2 ? c : y);
  }
  return [$t(i, a + (i[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class N {
  constructor({ strings: t, _$litType$: e }, s) {
    let o;
    this.parts = [];
    let a = 0, n = 0;
    const c = t.length - 1, l = this.parts, [u, p] = Mt(t, e);
    if (this.el = N.createElement(u, s), S.currentNode = this.el.content, e === 2 || e === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (o = S.nextNode()) !== null && l.length < c; ) {
      if (o.nodeType === 1) {
        if (o.hasAttributes()) for (const h of o.getAttributeNames()) if (h.endsWith(gt)) {
          const $ = p[n++], y = o.getAttribute(h).split(k), m = /([.?@])?(.*)/.exec($);
          l.push({ type: 1, index: a, name: m[2], strings: y, ctor: m[1] === "." ? Nt : m[1] === "?" ? Ut : m[1] === "@" ? It : V }), o.removeAttribute(h);
        } else h.startsWith(k) && (l.push({ type: 6, index: a }), o.removeAttribute(h));
        if (vt.test(o.tagName)) {
          const h = o.textContent.split(k), $ = h.length - 1;
          if ($ > 0) {
            o.textContent = B ? B.emptyScript : "";
            for (let y = 0; y < $; y++) o.append(h[y], M()), S.nextNode(), l.push({ type: 2, index: ++a });
            o.append(h[$], M());
          }
        }
      } else if (o.nodeType === 8) if (o.data === _t) l.push({ type: 2, index: a });
      else {
        let h = -1;
        for (; (h = o.data.indexOf(k, h + 1)) !== -1; ) l.push({ type: 7, index: a }), h += k.length - 1;
      }
      a++;
    }
  }
  static createElement(t, e) {
    const s = A.createElement("template");
    return s.innerHTML = t, s;
  }
}
function E(i, t, e = i, s) {
  if (t === b) return t;
  let o = s !== void 0 ? e._$Co?.[s] : e._$Cl;
  const a = H(t) ? void 0 : t._$litDirective$;
  return o?.constructor !== a && (o?._$AO?.(!1), a === void 0 ? o = void 0 : (o = new a(i), o._$AT(i, e, s)), s !== void 0 ? (e._$Co ??= [])[s] = o : e._$Cl = o), o !== void 0 && (t = E(i, o._$AS(i, t.values), o, s)), t;
}
class Ht {
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
    const { el: { content: e }, parts: s } = this._$AD, o = (t?.creationScope ?? A).importNode(e, !0);
    S.currentNode = o;
    let a = S.nextNode(), n = 0, c = 0, l = s[0];
    for (; l !== void 0; ) {
      if (n === l.index) {
        let u;
        l.type === 2 ? u = new U(a, a.nextSibling, this, t) : l.type === 1 ? u = new l.ctor(a, l.name, l.strings, this, t) : l.type === 6 && (u = new jt(a, this, t)), this._$AV.push(u), l = s[++c];
      }
      n !== l?.index && (a = S.nextNode(), n++);
    }
    return S.currentNode = A, o;
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
    t = E(this, t, e), H(t) ? t === d || t == null || t === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : t !== this._$AH && t !== b && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Ot(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== d && H(this._$AH) ? this._$AA.nextSibling.data = t : this.T(A.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: s } = t, o = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = N.createElement($t(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === o) this._$AH.p(e);
    else {
      const a = new Ht(o, this), n = a.u(this.options);
      a.p(e), this.T(n), this._$AH = a;
    }
  }
  _$AC(t) {
    let e = ut.get(t.strings);
    return e === void 0 && ut.set(t.strings, e = new N(t)), e;
  }
  k(t) {
    G(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, o = 0;
    for (const a of t) o === e.length ? e.push(s = new U(this.O(M()), this.O(M()), this, this.options)) : s = e[o], s._$AI(a), o++;
    o < e.length && (this._$AR(s && s._$AB.nextSibling, o), e.length = o);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const s = rt(t).nextSibling;
      rt(t).remove(), t = s;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class V {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, s, o, a) {
    this.type = 1, this._$AH = d, this._$AN = void 0, this.element = t, this.name = e, this._$AM = o, this.options = a, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = d;
  }
  _$AI(t, e = this, s, o) {
    const a = this.strings;
    let n = !1;
    if (a === void 0) t = E(this, t, e, 0), n = !H(t) || t !== this._$AH && t !== b, n && (this._$AH = t);
    else {
      const c = t;
      let l, u;
      for (t = a[0], l = 0; l < a.length - 1; l++) u = E(this, c[s + l], e, l), u === b && (u = this._$AH[l]), n ||= !H(u) || u !== this._$AH[l], u === d ? t = d : t !== d && (t += (u ?? "") + a[l + 1]), this._$AH[l] = u;
    }
    n && !o && this.j(t);
  }
  j(t) {
    t === d ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Nt extends V {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === d ? void 0 : t;
  }
}
class Ut extends V {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== d);
  }
}
class It extends V {
  constructor(t, e, s, o, a) {
    super(t, e, s, o, a), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = E(this, t, e, 0) ?? d) === b) return;
    const s = this._$AH, o = t === d && s !== d || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, a = t !== d && (s === d || o);
    o && this.element.removeEventListener(this.name, this, s), a && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class jt {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    E(this, t);
  }
}
const Ft = Z.litHtmlPolyfillSupport;
Ft?.(N, U), (Z.litHtmlVersions ??= []).push("3.3.3");
const Lt = (i, t, e) => {
  const s = e?.renderBefore ?? t;
  let o = s._$litPart$;
  if (o === void 0) {
    const a = e?.renderBefore ?? null;
    s._$litPart$ = o = new U(t.insertBefore(M(), a), a, void 0, e ?? {});
  }
  return o._$AI(i), o;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const X = globalThis;
let R = class extends P {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Lt(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return b;
  }
};
R._$litElement$ = !0, R.finalized = !0, X.litElementHydrateSupport?.({ LitElement: R });
const Wt = X.litElementPolyfillSupport;
Wt?.({ LitElement: R });
(X.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Bt = (i) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(i, t);
  }) : customElements.define(i, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const qt = { attribute: !0, type: String, converter: W, reflect: !1, hasChanged: J }, Vt = (i = qt, t, e) => {
  const { kind: s, metadata: o } = e;
  let a = globalThis.litPropertyMetadata.get(o);
  if (a === void 0 && globalThis.litPropertyMetadata.set(o, a = /* @__PURE__ */ new Map()), s === "setter" && ((i = Object.create(i)).wrapped = !0), a.set(e.name, i), s === "accessor") {
    const { name: n } = e;
    return { set(c) {
      const l = t.get.call(this);
      t.set.call(this, c), this.requestUpdate(n, l, i, !0, c);
    }, init(c) {
      return c !== void 0 && this.C(n, void 0, i, c), c;
    } };
  }
  if (s === "setter") {
    const { name: n } = e;
    return function(c) {
      const l = this[n];
      t.call(this, c), this.requestUpdate(n, l, i, !0, c);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function tt(i) {
  return (t, e) => typeof e == "object" ? Vt(i, t, e) : ((s, o, a) => {
    const n = o.hasOwnProperty(a);
    return o.constructor.createProperty(a, s), n ? Object.getOwnPropertyDescriptor(o, a) : void 0;
  })(i, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function v(i) {
  return tt({ ...i, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const T = { ATTRIBUTE: 1, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4 }, Yt = (i) => (...t) => ({ _$litDirective$: i, values: t });
class Kt {
  constructor(t) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t, e, s) {
    this._$Ct = t, this._$AM = e, this._$Ci = s;
  }
  _$AS(t, e) {
    return this.update(t, e);
  }
  update(t, e) {
    return this.render(...e);
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Qt = (i) => i.strings === void 0, Jt = {}, Zt = (i, t = Jt) => i._$AH = t;
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const x = Yt(class extends Kt {
  constructor(i) {
    if (super(i), i.type !== T.PROPERTY && i.type !== T.ATTRIBUTE && i.type !== T.BOOLEAN_ATTRIBUTE) throw Error("The `live` directive is not allowed on child or event bindings");
    if (!Qt(i)) throw Error("`live` bindings can only contain a single expression");
  }
  render(i) {
    return i;
  }
  update(i, [t]) {
    if (t === b || t === d) return t;
    const e = i.element, s = i.name;
    if (i.type === T.PROPERTY) {
      if (t === e[s]) return b;
    } else if (i.type === T.BOOLEAN_ATTRIBUTE) {
      if (!!t === e.hasAttribute(s)) return b;
    } else if (i.type === T.ATTRIBUTE && e.getAttribute(s) === t + "") return b;
    return Zt(i), t;
  }
});
var Gt = Object.defineProperty, Xt = Object.getOwnPropertyDescriptor, g = (i, t, e, s) => {
  for (var o = s > 1 ? void 0 : s ? Xt(t, e) : t, a = i.length - 1, n; a >= 0; a--)
    (n = i[a]) && (o = (s ? n(t, e, o) : n(o)) || o);
  return s && o && Gt(t, e, o), o;
};
const mt = ["vandaag", "config"], te = {
  "tab.vandaag": { nl: "Vandaag", en: "Today" },
  "tab.config": { nl: "Configuratie", en: "Configuration" },
  loading: { nl: "Laden…", en: "Loading…" },
  menu: { nl: "Menu", en: "Menu" },
  ageUnknown: { nl: "leeftijd onbekend", en: "age unknown" },
  week: { nl: "week", en: "week" },
  weeks: { nl: "weken", en: "weeks" },
  day: { nl: "dag", en: "day" },
  days: { nl: "dagen", en: "days" },
  old: { nl: "oud", en: "old" },
  wkn: { nl: "wkn", en: "wks" },
  wk: { nl: "wk", en: "wk" },
  focus: { nl: "Focus", en: "Focus" },
  setBirthdate: { nl: "Stel een geboortedatum in bij Configuratie.", en: "Set a birth date in Configuration." },
  fear: { nl: "Angstperiode: nieuwe prikkels positief en rustig opbouwen.", en: "Fear period: introduce new stimuli positively and calmly." },
  nextPee: { nl: "Volgende plaspauze:", en: "Next potty break:" },
  inHrsMin: { nl: "over {h} u {m} min", en: "in {h} h {m} min" },
  inMin: { nl: "over {m} min", en: "in {m} min" },
  daySchedule: { nl: "Dagschema & taken (vandaag)", en: "Day schedule & tasks (today)" },
  restDay: { nl: "Rustdag", en: "Rest day" },
  todayItems: { nl: "Taken & schema-stappen vandaag", en: "Tasks & schedule steps today" },
  upcoming: { nl: "Belangrijke gebeurtenissen (komende 7 dagen)", en: "Important events (next 7 days)" },
  nothingPlanned: { nl: "Niets gepland deze week.", en: "Nothing planned this week." },
  now: { nl: "Nu", en: "Now" },
  past: { nl: "voorbij", en: "past" },
  socialization: { nl: "Socialisatie", en: "Socialization" },
  socializationSub: { nl: "(7-12 weken · weekchecklist)", en: "(7-12 weeks · weekly checklist)" },
  noSocProgram: { nl: "Geen socialisatieprogramma. Stel een thuiskomstdatum in.", en: "No socialization program. Set a homecoming date." },
  noActivities: { nl: "Geen activiteiten deze week.", en: "No activities this week." },
  addActivity: { nl: "+ activiteit", en: "+ activity" },
  activity: { nl: "Activiteit", en: "Activity" },
  category: { nl: "Categorie", en: "Category" },
  prevWeek: { nl: "Vorige week", en: "Previous week" },
  nextWeek: { nl: "Volgende week", en: "Next week" },
  schedulesTasks: { nl: "Schema's & taken", en: "Schedules & tasks" },
  addTask: { nl: "+ Taak", en: "+ Task" },
  addSchema: { nl: "+ Schema", en: "+ Schedule" },
  addStep: { nl: "+ Stap", en: "+ Step" },
  addItem: { nl: "+ Item", en: "+ Item" },
  addCard: { nl: "+ kaart", en: "+ card" },
  name: { nl: "Naam", en: "Name" },
  title: { nl: "Titel", en: "Title" },
  date: { nl: "Datum", en: "Date" },
  time: { nl: "Tijd", en: "Time" },
  type: { nl: "Type", en: "Type" },
  label: { nl: "Label", en: "Label" },
  note: { nl: "Notitie", en: "Note" },
  noteOptional: { nl: "notitie (optioneel)", en: "note (optional)" },
  startDate: { nl: "Startdatum", en: "Start date" },
  description: { nl: "Omschrijving", en: "Description" },
  descriptionOptional: { nl: "Omschrijving (optioneel)", en: "Description (optional)" },
  add: { nl: "Toevoegen", en: "Add" },
  save: { nl: "Opslaan", en: "Save" },
  cancel: { nl: "Annuleer", en: "Cancel" },
  edit: { nl: "Bewerken", en: "Edit" },
  remove: { nl: "Verwijderen", en: "Remove" },
  removeQ: { nl: "Verwijderen?", en: "Remove?" },
  sureQ: { nl: "Zeker?", en: "Sure?" },
  yes: { nl: "Ja", en: "Yes" },
  no: { nl: "Nee", en: "No" },
  defer: { nl: "Uitstellen…", en: "Postpone…" },
  apply: { nl: "Toepassen", en: "Apply" },
  taskTitlePh: { nl: "Titel (bv. Dierenarts)", en: "Title (e.g. Vet)" },
  schemaNamePh: { nl: "bv. Bench verplaatsen", en: "e.g. Move the crate" },
  schemaAboutPh: { nl: "Waar gaat dit schema over?", en: "What is this schedule about?" },
  stepTitlePh: { nl: "Titel van de stap", en: "Step title" },
  activityPh: { nl: "bv. Trein horen", en: "e.g. Hear a train" },
  phases: { nl: "Fases", en: "Phases" },
  editPhase: { nl: "Fase bewerken", en: "Edit phase" },
  phaseSchedule: { nl: "Dagschema voor deze fase", en: "Day schedule for this phase" },
  items: { nl: "items", en: "items" },
  noPhaseItems: { nl: "Nog geen items voor deze fase.", en: "No items for this phase yet." },
  fromWk: { nl: "Vanaf (wk)", en: "From (wk)" },
  toWk: { nl: "Tot (wk)", en: "To (wk)" },
  peeInterval: { nl: "Plas-interval (u)", en: "Potty interval (h)" },
  focusPoints: { nl: "Focuspunten (één per regel)", en: "Focus points (one per line)" },
  infoCards: { nl: "Info-kaarten", en: "Info cards" },
  iconPh: { nl: "Icoon (mdi:...)", en: "Icon (mdi:...)" },
  pointsPh: { nl: "Punten (één per regel)", en: "Points (one per line)" },
  removeCard: { nl: "Kaart verwijderen", en: "Remove card" },
  config: { nl: "Configuratie", en: "Configuration" },
  puppy: { nl: "Puppy", en: "Puppy" },
  choosePhoto: { nl: "Foto kiezen…", en: "Choose photo…" },
  photoHint: { nl: "Wordt automatisch verkleind en opgeslagen.", en: "Automatically resized and saved." },
  birthDate: { nl: "Geboortedatum", en: "Birth date" },
  homecomingDate: { nl: "Thuiskomstdatum", en: "Homecoming date" },
  homecomingHint: { nl: "Bij het wijzigen van de thuiskomstdatum schuift het socialisatie- en benchschema automatisch mee.", en: "Changing the homecoming date shifts the socialization and crate schedules along." },
  language: { nl: "Taal", en: "Language" },
  reloadDefaults: { nl: "Standaardinhoud herladen (huidige taal)", en: "Reload default content (current language)" },
  reloadDefaultsHint: { nl: "Vervangt de standaard fase-teksten, socialisatie, dagschema's en bench door de standaard in de gekozen taal. Je eigen taken en schema's blijven.", en: "Replaces the default phase texts, socialization, day schedules and crate protocol with the defaults in the chosen language. Your own tasks and schedules stay." },
  reloadConfirm: { nl: "Weet je het zeker? Dit vervangt de standaardinhoud.", en: "Are you sure? This replaces the default content." },
  deferPrompt: { nl: "dagen", en: "days" },
  deferWeek: { nl: "Week", en: "Week" }
}, ee = new Intl.DateTimeFormat("nl-NL", { weekday: "short", day: "numeric", month: "short" }), ie = new Intl.DateTimeFormat("nl-NL", { weekday: "long", day: "numeric", month: "short" }), se = new Intl.DateTimeFormat("nl-NL", { weekday: "short", day: "numeric" }), F = 7, z = 60;
function L(i, t) {
  let e = i * 60 + t - F * 60;
  return e < 0 && (e += 1440), e;
}
function I(i) {
  const [t, e] = i.split(":").map(Number);
  return L(t, e);
}
let f = class extends R {
  constructor() {
    super(...arguments), this.narrow = !1, this._error = "", this._tab = "vandaag", this._taskForm = !1, this._protoForm = !1, this._reseedConfirm = !1, this._loaded = !1, this._didScroll = !1;
  }
  connectedCallback() {
    super.connectedCallback(), this._timer = window.setInterval(() => this.requestUpdate(), 1e3);
    const i = localStorage.getItem("pt-tab");
    i && mt.includes(i) && (this._tab = i);
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
        const e = /* @__PURE__ */ new Date(), s = L(e.getHours(), e.getMinutes()) / 60 * z;
        t.scrollTop = Math.max(0, s - t.clientHeight / 2), this._didScroll = !0;
      }
    }
  }
  get _lang() {
    return this._state?.language === "en" ? "en" : "nl";
  }
  t(i, t) {
    const e = te[i];
    let s = e ? e[this._lang] : i;
    if (t) for (const [o, a] of Object.entries(t)) s = s.replace(`{${o}}`, String(a));
    return s;
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
  async _toggleDaily(i, t) {
    const e = await this._ws("toggle_daily_check", { item_key: i, done: t });
    e && this._merge({ daily_checks: e.daily_checks });
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
    const e = this.renderRoot.querySelector("#es-title")?.value.trim(), s = this.renderRoot.querySelector("#es-date")?.value, o = this.renderRoot.querySelector("#es-notes")?.value ?? "", a = this.renderRoot.querySelector("#es-cat"), n = this.renderRoot.querySelector("#es-day");
    if (!e) return;
    const c = this._dateToOffset(t.start_date, s);
    this._editStep = void 0;
    const l = { step_id: i.id, title: e, notes: o };
    n ? l.day_offset = parseInt(n.value, 10) : c !== null && (l.day_offset = c), a && (l.category = a.value);
    const u = await this._ws("update_step", l);
    u && this._merge({ protocols: u.protocols });
  }
  _socCatOptions(i, t) {
    return Object.entries(i.socialization_categories).map(
      ([e, s]) => r`<option value=${e} ?selected=${e === t}>${s.label}</option>`
    );
  }
  _dateForOffset(i, t) {
    if (!i) return null;
    const e = /* @__PURE__ */ new Date(i + "T00:00:00");
    return e.setDate(e.getDate() + t), this._isoLocal(e);
  }
  _weekDayOptions(i, t, e) {
    return Array.from({ length: 7 }, (s, o) => {
      const a = t * 7 + o, n = this._dateForOffset(i.start_date, a), c = n ? this._dayLabel(n) : `Dag ${o + 1}`;
      return r`<option value=${a} ?selected=${a === e}>${c}</option>`;
    });
  }
  async _submitSocAdd(i, t) {
    const e = this.renderRoot.querySelector("#sa-title")?.value.trim(), s = this.renderRoot.querySelector("#sa-cat")?.value ?? "omgeving", o = this.renderRoot.querySelector("#sa-day");
    if (!e) return;
    this._socAddWeek = void 0;
    const a = await this._ws("add_step", {
      protocol_id: i.id,
      title: e,
      category: s,
      day_offset: o ? parseInt(o.value, 10) : t * 7,
      check_mode: "milestone"
    });
    a && this._merge({ protocols: a.protocols });
  }
  async _submitSchedItem(i) {
    const t = (a) => this.renderRoot.querySelector(a)?.value ?? "", e = t("#sc-time"), s = t("#sc-label").trim();
    if (!e || !s) return;
    this._schedForm = void 0;
    const o = await this._ws("add_schedule_item", {
      phase_key: i,
      time: e,
      label: s,
      item_type: t("#sc-type") || "rust",
      notes: t("#sc-notes")
    });
    o && this._merge({ schedules: o.schedules });
  }
  async _submitSchedEdit(i) {
    const t = (a) => this.renderRoot.querySelector(a)?.value ?? "", e = t("#se-label").trim(), s = t("#se-time");
    if (!s || !e) return;
    this._editSched = void 0;
    const o = await this._ws("update_schedule_item", {
      item_id: i.id,
      time: s,
      label: e,
      item_type: t("#se-type"),
      notes: t("#se-notes")
    });
    o && this._merge({ schedules: o.schedules });
  }
  async _removeSchedItem(i) {
    const t = await this._ws("remove_schedule_item", { item_id: i });
    t && this._merge({ schedules: t.schedules });
  }
  async _setLanguage(i) {
    const t = await this._ws("set_language", { language: i });
    t && t.puppy !== void 0 && (this._state = t);
  }
  async _reloadDefaults() {
    this._reseedConfirm = !1;
    const i = await this._ws("reseed_defaults");
    i && i.puppy !== void 0 && (this._state = i);
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
        const n = Math.min(1, 400 / Math.max(o.width, o.height)), c = Math.round(o.width * n), l = Math.round(o.height * n), u = document.createElement("canvas");
        u.width = c, u.height = l;
        const p = u.getContext("2d");
        if (!p) return;
        p.drawImage(o, 0, 0, c, l);
        const h = u.toDataURL("image/jpeg", 0.82);
        this._savePhoto(h);
      }, o.src = s.result;
    }, s.readAsDataURL(e), t.value = "";
  }
  // ---- Derived helpers ---------------------------------------------------
  _fmt(i) {
    return i ? ee.format(/* @__PURE__ */ new Date(i + "T00:00:00")) : "";
  }
  _dayLabel(i) {
    return i ? se.format(/* @__PURE__ */ new Date(i + "T00:00:00")) : "";
  }
  _isToday(i) {
    return !!i && i === this._state?.today;
  }
  _ageText() {
    const i = this._state?.age_days;
    if (i == null) return this.t("ageUnknown");
    const t = Math.floor(i / 7), e = i % 7;
    return `${t} ${this.t(t === 1 ? "week" : "weeks")} & ${e} ${this.t(e === 1 ? "day" : "days")} ${this.t("old")}`;
  }
  _countdownTo(i) {
    const t = Math.max(0, Math.round((i.getTime() - Date.now()) / 1e3)), e = Math.floor(t / 3600), s = Math.floor(t % 3600 / 60);
    return e > 0 ? this.t("inHrsMin", { h: e, m: s }) : this.t("inMin", { m: s });
  }
  /** Next pee = the first 'plassen' item in the active-phase schedule after now. */
  _nextPee(i) {
    const e = (i.phase && i.schedules[i.phase.key] || []).filter((p) => p.type === "plassen");
    if (!e.length) return null;
    const s = /* @__PURE__ */ new Date(), o = L(s.getHours(), s.getMinutes()), a = e.map((p) => ({ p, mins: I(p.time) })).sort((p, h) => p.mins - h.mins);
    let n = a.find((p) => p.mins > o), c = 0;
    n || (n = a[0], c = 1440);
    const l = new Date(s);
    l.setHours(F, 0, 0, 0), s.getHours() < F && l.setDate(l.getDate() - 1);
    const u = new Date(l.getTime() + (n.mins + c) * 6e4);
    return { time: n.p.time, at: u };
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
    const e = this._isoLocal(t), s = (a) => !!a && a >= i.today && a < e, o = [];
    for (const a of i.tasks)
      s(a.date) && o.push({ date: a.date, color: "var(--primary-color)", icon: "mdi:calendar-check", title: a.title });
    for (const a of i.protocols)
      for (const n of a.steps) {
        if (!s(n.effective_date)) continue;
        const c = i.socialization_categories[n.category];
        o.push({
          date: n.effective_date,
          color: c?.color ?? "var(--primary-color)",
          icon: c?.icon ?? "mdi:flag-outline",
          title: a.seed_key === "socialization" ? n.title : `${n.title} — ${a.name}`,
          step: n
        });
      }
    return o.sort((a, n) => a.date < n.date ? -1 : a.date > n.date ? 1 : 0), o;
  }
  _deferControls(i) {
    return this._defer?.stepId === i.id ? r`
        <span class="defer-inline">
          <input type="number" .value=${String(this._defer.days)}
            @input=${(t) => this._defer = { stepId: i.id, days: parseInt(t.target.value, 10) || 0 }} />
          <span class="dagen">${this.t("days")}</span>
          <button class="link" @click=${this._applyDefer}>${this.t("apply")}</button>
          <button class="link" @click=${() => this._defer = void 0}>${this.t("cancel")}</button>
        </span>
      ` : r`<button class="link" @click=${() => this._defer = { stepId: i.id, days: 1 }}>${this.t("defer")}</button>`;
  }
  // ---- Render ------------------------------------------------------------
  render() {
    const i = this._state;
    return r`
      <div class="app">
        ${this._renderHeader()}
        ${this._error ? r`<div class="err">${this._error}</div>` : d}
        <div class="content">
          ${i ? this._renderTab(i) : r`<div class="loading">${this.t("loading")}</div>`}
        </div>
      </div>
    `;
  }
  _renderHeader() {
    return r`
      <div class="topbar">
        <ha-icon-button class="menu" @click=${this._toggleMenu} title=${this.t("menu")}>
          <ha-icon icon="mdi:menu"></ha-icon>
        </ha-icon-button>
        <div class="title">Puppy Tracker</div>
      </div>
      <div class="tabs">
        ${mt.map(
      (i) => r`<button class="tab ${this._tab === i ? "active" : ""}" @click=${() => this._selectTab(i)}>${this.t("tab." + i)}</button>`
    )}
      </div>
    `;
  }
  _renderTab(i) {
    switch (this._tab) {
      case "config":
        return this._renderConfig(i);
      default:
        return this._renderToday(i);
    }
  }
  // ---- Tab: Vandaag ------------------------------------------------------
  _renderToday(i) {
    return r`
      ${this._renderHero(i)}
      <div class="cols ${this.narrow ? "narrow" : ""}">
        <div class="col-main">${this._renderDaySchedule(i)}</div>
        <div class="col-side">${this._renderUpcoming()}</div>
      </div>
    `;
  }
  _renderHero(i) {
    const t = i.phase, e = i.puppy?.photo_url, s = this._nextPee(i);
    return r`
      <div class="hero">
        <div class="hero-top">
          <div class="hero-photo">
            ${e ? r`<img src=${e} alt="foto" />` : r`<ha-icon icon="mdi:dog"></ha-icon>`}
          </div>
          <div class="hero-body">
            <div class="hero-name">${i.puppy?.name ?? "Puppy"}</div>
            <div class="hero-age">${this._ageText()}</div>
            ${t ? r`
                  <div class="hero-phase">
                    <span class="dot green"></span>
                    <strong>${t.title}</strong>
                    <small>(${t.week_start}-${t.week_end} ${this.t("wkn")})</small>
                  </div>
                  <div class="hero-focus">${this.t("focus")}: ${t.focus.join(" · ")}</div>
                ` : r`<div class="hero-focus">${this.t("setBirthdate")}</div>`}
            ${i.in_fear_period ? r`<div class="hero-fear">⚠ ${this.t("fear")}</div>` : d}
            <div class="pee">
              <span class="pee-text">
                ${this.t("nextPee")}
                <strong>${s ? s.time : "—"}</strong>
                ${s ? r`<em>${this._countdownTo(s.at)}</em>` : d}
              </span>
            </div>
          </div>
        </div>
        ${t && t.info_cards?.length ? r`<div class="hero-cards">
              ${t.info_cards.map(
      (o) => r`
                  <div class="info-card">
                    <h4><ha-icon icon=${o.icon}></ha-icon> ${o.title}</h4>
                    <ul>${o.items.map((a) => r`<li>${a}</li>`)}</ul>
                  </div>
                `
    )}
            </div>` : d}
      </div>
    `;
  }
  _renderDaySchedule(i) {
    const t = new Set(i.daily_checks), e = this._restToday(), s = this._todaySteps(), o = this._todayTasks(), a = 24 * z, n = /* @__PURE__ */ new Date(), c = L(n.getHours(), n.getMinutes()) / 60 * z, l = i.phase && i.schedules[i.phase.key] || [], u = 26, p = [...l].sort((m, _) => I(m.time) - I(_.time));
    let h = -100;
    const $ = p.map((m) => {
      let _ = I(m.time) / 60 * z;
      return _ < h + 2 && (_ = h + 2), h = _ + u, { it: m, top: _ };
    }), y = Array.from({ length: 24 }, (m, _) => {
      const C = (F + _) % 24;
      return { hour: C, night: C >= 22 || C < 6, top: _ * z };
    });
    return r`
      <section>
        <div class="sec-head">
          <h2><ha-icon icon="mdi:clock-outline"></ha-icon> ${this.t("daySchedule")}</h2>
        </div>
        ${e ? r`<div class="rest-banner">💥 ${this.t("restDay")} — ${e.title}</div>` : d}
        <div class="timeline-scroll">
          <div class="timeline" style="height:${a}px">
            ${y.map(
      (m) => r`
                <div class="hour-line ${m.night ? "night" : ""}" style="top:${m.top}px">
                  <span class="hour-label">${String(m.hour).padStart(2, "0")}:00</span>
                </div>
              `
    )}
            ${$.map(({ it: m, top: _ }) => {
      const C = i.schedule_types[m.type], et = String(m.id), it = t.has(et);
      return r`
                <div class="tl-item ${it ? "checked" : ""}" style="top:${_}px;--rc:${C?.color ?? "#888"}" title=${m.notes || m.label}>
                  <span class="tl-time">${m.time}</span>
                  <span class="tl-label">${m.label}</span>
                  <input type="checkbox" .checked=${it}
                    @change=${(yt) => this._toggleDaily(et, yt.target.checked)} />
                </div>
              `;
    })}
            <div class="now-line" style="top:${c}px">
              <span class="now-dot"></span>
              <span class="now-time">${n.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })}</span>
            </div>
          </div>
        </div>

        ${s.length || o.length ? r`
              <div class="subhead">${this.t("todayItems")}</div>
              <div class="today-items">
                ${o.map(
      (m) => r`
                    <label class="row ${m.done_at ? "checked" : ""}" style="--rc:var(--primary-color)">
                      <ha-icon icon="mdi:calendar-check"></ha-icon>
                      <span class="row-main"><span class="row-title">${m.title}</span></span>
                      <input type="checkbox" .checked=${!!m.done_at} @change=${() => this._toggleTask(m)} />
                    </label>
                  `
    )}
                ${s.map(
      ({ protocol: m, step: _ }) => r`
                    <label class="row ${_.done_at ? "checked" : ""}" style="--rc:#a05ac0">
                      <ha-icon icon="mdi:flag-outline"></ha-icon>
                      <span class="row-main">
                        <span class="row-title">${_.title}</span>
                        <span class="row-note">${m.name}</span>
                      </span>
                      ${this._deferControls(_)}
                      <input type="checkbox" .checked=${!!_.done_at} @change=${() => this._toggleStep(_)} />
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
    return r`
      <section>
        <h2><ha-icon icon="mdi:calendar-star"></ha-icon> ${this.t("upcoming")}</h2>
        ${i.length === 0 ? r`<p class="muted">${this.t("nothingPlanned")}</p>` : d}
        <div class="events">
          ${i.map((e) => {
      const s = e.date !== t;
      return t = e.date, r`
              ${s ? r`<div class="ev-date">${ie.format(/* @__PURE__ */ new Date(e.date + "T00:00:00"))}</div>` : d}
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
    return r`
      <section>
        <h2>${this.t("phases")}</h2>
        ${i.phases.map((t) => {
      const e = i.phase?.key === t.key;
      return r`
            <details class="phase" ?open=${e}>
              <summary>
                <span>${t.title} <small>(${t.week_start}-${t.week_end} ${this.t("wkn")})</small></span>
                ${e ? r`<span class="badge">${this.t("now")}</span>` : d}
              </summary>
              <div class="phase-body">
                ${this._editPhase === t.key ? this._renderPhaseEditForm(t) : r`
                      <div class="phase-toolbar">
                        <button class="icon-link" title=${this.t("editPhase")} @click=${() => this._startPhaseEdit(t)}>
                          <ha-icon icon="mdi:pencil"></ha-icon><span class="lbl">${this.t("editPhase")}</span>
                        </button>
                      </div>
                      <ul class="focus">${t.focus.map((s) => r`<li>${s}</li>`)}</ul>
                      <div class="cards">
                        ${t.info_cards.map(
        (s) => r`
                            <div class="info-card">
                              <h4><ha-icon icon=${s.icon}></ha-icon> ${s.title}</h4>
                              <ul>${s.items.map((o) => r`<li>${o}</li>`)}</ul>
                            </div>
                          `
      )}
                      </div>
                    `}
                ${this._renderPhaseSchedule(i, t)}
              </div>
            </details>
          `;
    })}
      </section>
    `;
  }
  _startPhaseEdit(i) {
    this._editPhase = i.key, this._phaseDraft = {
      title: i.title,
      week_start: i.week_start,
      week_end: i.week_end,
      pee_interval_hours: i.pee_interval_hours,
      focusText: (i.focus ?? []).join(`
`),
      cards: (i.info_cards ?? []).map((t) => ({
        title: t.title,
        icon: t.icon,
        itemsText: (t.items ?? []).join(`
`)
      }))
    };
  }
  _pd(i) {
    this._phaseDraft = { ...this._phaseDraft, ...i };
  }
  _pdCard(i, t) {
    const e = [...this._phaseDraft.cards];
    e[i] = { ...e[i], ...t }, this._phaseDraft = { ...this._phaseDraft, cards: e };
  }
  _pdAddCard() {
    this._phaseDraft = {
      ...this._phaseDraft,
      cards: [...this._phaseDraft.cards, { title: "", icon: "mdi:information-outline", itemsText: "" }]
    };
  }
  _pdRemoveCard(i) {
    this._phaseDraft = {
      ...this._phaseDraft,
      cards: this._phaseDraft.cards.filter((t, e) => e !== i)
    };
  }
  async _submitPhaseEdit(i) {
    const t = this._phaseDraft;
    if (!t) return;
    const e = t.focusText.split(`
`).map((a) => a.trim()).filter(Boolean), s = t.cards.map((a) => ({
      title: a.title.trim(),
      icon: a.icon.trim() || "mdi:information-outline",
      items: a.itemsText.split(`
`).map((n) => n.trim()).filter(Boolean)
    })).filter((a) => a.title || a.items.length);
    this._editPhase = void 0, this._phaseDraft = void 0;
    const o = await this._ws("update_phase", {
      key: i,
      title: t.title,
      week_start: t.week_start,
      week_end: t.week_end,
      pee_interval_hours: t.pee_interval_hours,
      focus: e,
      info_cards: s
    });
    o && o.puppy !== void 0 && (this._state = o);
  }
  _renderPhaseEditForm(i) {
    const t = this._phaseDraft;
    if (!t) return d;
    const e = (s) => s.target.value;
    return r`
      <div class="phase-edit">
        <label class="fld grow">${this.t("title")}
          <input type="text" .value=${x(t.title)} @input=${(s) => this._pd({ title: e(s) })} />
        </label>
        <div class="row3">
          <label class="fld">${this.t("fromWk")}
            <input type="number" .value=${x(String(t.week_start))} @input=${(s) => this._pd({ week_start: parseInt(e(s), 10) || 0 })} />
          </label>
          <label class="fld">${this.t("toWk")}
            <input type="number" .value=${x(String(t.week_end))} @input=${(s) => this._pd({ week_end: parseInt(e(s), 10) || 0 })} />
          </label>
          <label class="fld">${this.t("peeInterval")}
            <input type="number" .value=${x(String(t.pee_interval_hours))} @input=${(s) => this._pd({ pee_interval_hours: parseInt(e(s), 10) || 1 })} />
          </label>
        </div>
        <label class="fld grow">${this.t("focusPoints")}
          <textarea rows="4" .value=${x(t.focusText)} @input=${(s) => this._pd({ focusText: s.target.value })}></textarea>
        </label>
        <div class="cards-edit">
          <div class="ce-head"><strong>${this.t("infoCards")}</strong><button class="link" @click=${this._pdAddCard}>${this.t("addCard")}</button></div>
          ${t.cards.map(
      (s, o) => r`
              <div class="ce-card">
                <div class="ce-row">
                  <input type="text" placeholder=${this.t("title")} .value=${x(s.title)} @input=${(a) => this._pdCard(o, { title: e(a) })} />
                  <input type="text" placeholder=${this.t("iconPh")} .value=${x(s.icon)} @input=${(a) => this._pdCard(o, { icon: e(a) })} />
                  <button class="icon-link danger" title=${this.t("removeCard")} @click=${() => this._pdRemoveCard(o)}><ha-icon icon="mdi:delete-outline"></ha-icon></button>
                </div>
                <textarea rows="3" placeholder=${this.t("pointsPh")} .value=${x(s.itemsText)} @input=${(a) => this._pdCard(o, { itemsText: a.target.value })}></textarea>
              </div>
            `
    )}
        </div>
        <div class="phase-edit-actions">
          <button class="primary" @click=${() => this._submitPhaseEdit(i.key)}>${this.t("save")}</button>
          <button class="link" @click=${() => {
      this._editPhase = void 0, this._phaseDraft = void 0;
    }}>${this.t("cancel")}</button>
        </div>
      </div>
    `;
  }
  _typeOptions(i, t) {
    return Object.entries(i.schedule_types).map(
      ([e, s]) => r`<option value=${e} ?selected=${e === t}>${s.label}</option>`
    );
  }
  _renderPhaseSchedule(i, t) {
    const e = [...i.schedules[t.key] ?? []].sort((s, o) => s.time < o.time ? -1 : 1);
    return r`
      <details class="phase-sched">
        <summary>
          <span class="ps-summary">
            <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
            <ha-icon icon="mdi:clock-outline"></ha-icon> ${this.t("phaseSchedule")}
          </span>
          <small class="muted">${e.length} ${this.t("items")}</small>
        </summary>
        <div class="ps-actions">
          <button class="link" @click=${() => this._schedForm = this._schedForm === t.key ? void 0 : t.key}>${this.t("addItem")}</button>
        </div>
        ${this._schedForm === t.key ? r`<div class="inline-form">
              <label class="fld">${this.t("time")}<input id="sc-time" type="time" value="12:00" /></label>
              <label class="fld grow">${this.t("label")}<input id="sc-label" type="text" placeholder=${this.t("label")} /></label>
              <label class="fld">${this.t("type")}<select id="sc-type">${this._typeOptions(i, "rust")}</select></label>
              <label class="fld grow">${this.t("note")}<input id="sc-notes" type="text" placeholder=${this.t("noteOptional")} /></label>
              <button class="primary" @click=${() => this._submitSchedItem(t.key)}>${this.t("add")}</button>
              <button class="link" @click=${() => this._schedForm = void 0}>${this.t("cancel")}</button>
            </div>` : d}
        <div class="ps-list">
          ${e.length === 0 ? r`<div class="muted small">${this.t("noPhaseItems")}</div>` : d}
          ${e.map(
      (s) => this._editSched === s.id ? r`<div class="ps-item editing">
                  <input id="se-time" type="time" .value=${s.time} />
                  <input id="se-label" type="text" .value=${s.label} />
                  <select id="se-type">${this._typeOptions(i, s.type)}</select>
                  <input id="se-notes" type="text" .value=${s.notes} placeholder=${this.t("note")} />
                  <button class="primary" @click=${() => this._submitSchedEdit(s)}>${this.t("save")}</button>
                  <button class="link" @click=${() => this._editSched = void 0}>${this.t("cancel")}</button>
                </div>` : r`<div class="ps-item">
                  <span class="ps-time">${s.time}</span>
                  <span class="cat-dot" style="background:${i.schedule_types[s.type]?.color ?? "#888"}" title=${i.schedule_types[s.type]?.label ?? ""}></span>
                  <span class="ps-main">
                    <span>${s.label}</span>
                    ${s.notes ? r`<span class="ps-note">${s.notes}</span>` : d}
                  </span>
                  <button class="icon-link" title=${this.t("edit")} @click=${() => this._editSched = s.id}><ha-icon icon="mdi:pencil"></ha-icon></button>
                  <button class="icon-link danger" title=${this.t("remove")} @click=${() => this._removeSchedItem(s.id)}><ha-icon icon="mdi:delete-outline"></ha-icon></button>
                </div>`
    )}
        </div>
      </details>
    `;
  }
  // ---- Tab: Socialisatie -------------------------------------------------
  async _removeStep(i) {
    this._confirm = void 0;
    const t = await this._ws("remove_step", { step_id: i });
    t && this._merge({ protocols: t.protocols });
  }
  _stepDelete(i) {
    return this._confirm?.kind === "step" && this._confirm.id === i.id ? r`<span class="confirm">${this.t("removeQ")}
          <button class="link danger" @click=${() => this._removeStep(i.id)}>${this.t("yes")}</button>
          <button class="link" @click=${() => this._confirm = void 0}>${this.t("no")}</button></span>` : r`<button class="link danger" title=${this.t("remove")} @click=${() => this._confirm = { kind: "step", id: i.id }}>×</button>`;
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
    const t = i.protocols.find((a) => a.seed_key === "socialization");
    if (!t) return r`<section><p class="muted">${this.t("noSocProgram")}</p></section>`;
    const e = 5, s = this._currentSocWeek(t), o = Array.from({ length: e }, () => []);
    for (const a of t.steps) {
      const n = Math.min(e - 1, Math.max(0, Math.floor(a.day_offset / 7)));
      o[n].push(a);
    }
    return r`
      <section>
        <div class="sec-head">
          <h2>${this.t("socialization")} <small class="muted">${this.t("socializationSub")}</small></h2>
        </div>
        <div class="legend">
          ${Object.entries(i.socialization_categories).map(
      ([, a]) => r`<span class="tag"><span class="dot" style="background:${a.color}"></span>${a.label}</span>`
    )}
        </div>
        <div class="weeks">
          ${o.map((a, n) => this._renderSocWeek(i, t, a, n, s, e))}
        </div>
      </section>
    `;
  }
  _renderSocWeek(i, t, e, s, o, a) {
    const n = e.filter((p) => p.done_at).length, c = o === s, l = o !== null && o >= 0 && s < o, u = [...e].sort((p, h) => p.day_offset - h.day_offset || p.id - h.id);
    return r`
      <div class="week-card ${c ? "current" : ""} ${l ? "past" : ""}">
        <div class="week-head">
          <div>
            <strong>${this.t("deferWeek")} ${s + 1}</strong>
            <small class="muted">${7 + s}-${8 + s} ${this.t("wk")}</small>
            ${c ? r`<span class="badge">${this.t("now")}</span>` : d}
            ${l ? r`<span class="past-tag">${this.t("past")}</span>` : d}
          </div>
          <span class="week-progress">${n}/${e.length}</span>
        </div>
        <div class="week-items">
          ${u.length === 0 ? r`<div class="muted small">${this.t("noActivities")}</div>` : d}
          ${u.map((p) => this._renderSocItem(i, t, p, s, a))}
        </div>
        ${this._socAddWeek === s ? r`<div class="inline-form">
              <label class="fld grow">${this.t("activity")}<input id="sa-title" type="text" placeholder=${this.t("activityPh")} /></label>
              <label class="fld">${this.t("day")}<select id="sa-day">${this._weekDayOptions(t, s, s * 7)}</select></label>
              <label class="fld">${this.t("category")}<select id="sa-cat">${this._socCatOptions(i, "omgeving")}</select></label>
              <button class="primary" @click=${() => this._submitSocAdd(t, s)}>${this.t("add")}</button>
              <button class="link" @click=${() => this._socAddWeek = void 0}>${this.t("cancel")}</button>
            </div>` : r`<button class="link add-week" @click=${() => this._socAddWeek = s}>${this.t("addActivity")}</button>`}
      </div>
    `;
  }
  _renderSocItem(i, t, e, s, o) {
    const a = i.socialization_categories[e.category];
    return this._editStep === e.id ? r`
        <div class="soc-item editing">
          <input id="es-title" type="text" .value=${e.title} placeholder=${this.t("activity")} />
          <input id="es-notes" type="text" .value=${e.notes} placeholder=${this.t("noteOptional")} />
          <input id="es-date" type="hidden" .value=${e.effective_date ?? ""} />
          <label class="fld">${this.t("day")}<select id="es-day">${this._weekDayOptions(t, Math.floor(e.day_offset / 7), e.day_offset)}</select></label>
          <label class="fld">${this.t("category")}<select id="es-cat">${this._socCatOptions(i, e.category)}</select></label>
          <div class="soc-edit-row">
            <span class="wk-move">
              ${this.t("deferWeek")}:
              <button class="iconbtn" title=${this.t("prevWeek")} ?disabled=${s === 0} @click=${() => this._moveStepWeek(e, -1)}>←</button>
              <button class="iconbtn" title=${this.t("nextWeek")} ?disabled=${s === o - 1} @click=${() => this._moveStepWeek(e, 1)}>→</button>
            </span>
            <span class="spacer"></span>
            <button class="link danger" @click=${() => this._removeStep(e.id)}>${this.t("remove")}</button>
            <button class="primary" @click=${() => this._submitStepEdit(e, t)}>${this.t("save")}</button>
            <button class="link" @click=${() => this._editStep = void 0}>${this.t("cancel")}</button>
          </div>
        </div>
      ` : r`
      <div class="soc-item ${e.done_at ? "done" : ""}" style="--rc:${a?.color ?? "#888"}">
        <span class="day-chip" title=${this._fmt(e.effective_date)}>${this._dayLabel(e.effective_date)}</span>
        <span class="cat-dot" style="background:${a?.color ?? "#888"}" title=${a?.label ?? ""}></span>
        <span class="soc-item-main">
          <span class="soc-item-title">${e.title}</span>
          ${e.notes ? r`<span class="soc-item-note">${e.notes}</span>` : d}
        </span>
        <button class="icon-link edit-btn" title=${this.t("edit")} @click=${() => this._editStep = e.id}><ha-icon icon="mdi:pencil"></ha-icon></button>
      </div>
    `;
  }
  // ---- Tab: Schema's -----------------------------------------------------
  _renderSchedules(i) {
    const t = i.protocols.filter((e) => e.seed_key !== "socialization");
    return r`
      <section>
        <div class="sec-head">
          <h2>${this.t("schedulesTasks")}</h2>
          <span>
            <button class="ghost" @click=${() => {
      this._taskForm = !this._taskForm, this._protoForm = !1;
    }}>${this.t("addTask")}</button>
            <button class="ghost" @click=${() => {
      this._protoForm = !this._protoForm, this._taskForm = !1;
    }}>${this.t("addSchema")}</button>
          </span>
        </div>

        ${this._taskForm ? r`<div class="inline-form">
              <input id="nt-title" type="text" placeholder=${this.t("taskTitlePh")} />
              <input id="nt-date" type="date" .value=${i.today} />
              <button class="primary" @click=${this._submitTask}>${this.t("add")}</button>
              <button class="link" @click=${() => this._taskForm = !1}>${this.t("cancel")}</button>
            </div>` : d}
        ${this._protoForm ? r`<div class="inline-form">
              <label class="fld grow">${this.t("name")}<input id="np-name" type="text" placeholder=${this.t("schemaNamePh")} /></label>
              <label class="fld">${this.t("startDate")}<input id="np-start" type="date" .value=${i.today} /></label>
              <label class="fld grow">${this.t("descriptionOptional")}<input id="np-notes" type="text" placeholder=${this.t("schemaAboutPh")} /></label>
              <button class="primary" @click=${this._submitProtocol}>${this.t("add")}</button>
              <button class="link" @click=${() => this._protoForm = !1}>${this.t("cancel")}</button>
            </div>` : d}

        ${i.tasks.length ? r`<div class="tasks">
              ${i.tasks.map(
      (e) => r`
                  <div class="task ${e.done_at ? "done" : ""}">
                    <span class="task-main">
                      <span class="task-title">${e.title}</span>
                      ${e.date ? r`<span class="task-date">${this._fmt(e.date)}</span>` : d}
                    </span>
                    ${this._confirm?.kind === "task" && this._confirm.id === e.id ? r`<span class="confirm">${this.t("sureQ")}
                          <button class="link danger" @click=${() => this._removeTask(e.id)}>${this.t("yes")}</button>
                          <button class="link" @click=${() => this._confirm = void 0}>${this.t("no")}</button></span>` : r`<button class="link danger" @click=${() => this._confirm = { kind: "task", id: e.id }}>×</button>`}
                  </div>
                `
    )}
            </div>` : d}

        ${t.map(
      (e) => r`
            <div class="proto">
              ${this._editProto === e.id ? r`<div class="inline-form">
                    <label class="fld grow">${this.t("name")}<input id="ep-name" type="text" .value=${e.name} /></label>
                    <label class="fld">${this.t("startDate")}<input id="ep-start" type="date" .value=${e.start_date ?? ""} /></label>
                    <label class="fld grow">${this.t("description")}<input id="ep-notes" type="text" .value=${e.notes} placeholder=${this.t("schemaAboutPh")} /></label>
                    <button class="primary" @click=${() => this._submitProtoEdit(e)}>${this.t("save")}</button>
                    <button class="link" @click=${() => this._editProto = void 0}>${this.t("cancel")}</button>
                  </div>` : r`
                    <div class="proto-head">
                      <strong>${e.name}</strong>
                      <span>
                        <button class="icon-link" title=${this.t("edit")} @click=${() => this._editProto = e.id}><ha-icon icon="mdi:pencil"></ha-icon></button>
                        <button class="link" @click=${() => {
        this._stepForm = this._stepForm === e.id ? void 0 : e.id;
      }}>${this.t("addStep")}</button>
                        ${this._confirm?.kind === "protocol" && this._confirm.id === e.id ? r`<span class="confirm">${this.t("sureQ")}
                              <button class="link danger" @click=${() => this._removeProtocol(e.id)}>${this.t("yes")}</button>
                              <button class="link" @click=${() => this._confirm = void 0}>${this.t("no")}</button></span>` : r`<button class="link danger" @click=${() => this._confirm = { kind: "protocol", id: e.id }}>${this.t("remove")}</button>`}
                      </span>
                    </div>
                    ${e.notes ? r`<div class="proto-note">${e.notes}</div>` : d}
                  `}
              ${this._stepForm === e.id ? r`<div class="inline-form">
                    <label class="fld grow">${this.t("title")}<input id="ns-title" type="text" placeholder=${this.t("stepTitlePh")} /></label>
                    <label class="fld">${this.t("date")}<input id="ns-date" type="date" .value=${this._nextStepDate(e, i.today)} /></label>
                    <button class="primary" @click=${() => this._submitStep(e)}>${this.t("add")}</button>
                    <button class="link" @click=${() => this._stepForm = void 0}>${this.t("cancel")}</button>
                  </div>` : d}
              <div class="steps">
                ${e.steps.map(
        (s) => this._editStep === s.id ? r`
                        <div class="step editing">
                          <input id="es-title" type="text" .value=${s.title} placeholder=${this.t("title")} />
                          <input id="es-date" type="date" .value=${s.effective_date ?? ""} />
                          <input id="es-notes" type="text" .value=${s.notes} placeholder=${this.t("noteOptional")} />
                          <button class="primary" @click=${() => this._submitStepEdit(s, e)}>${this.t("save")}</button>
                          <button class="link" @click=${() => this._editStep = void 0}>${this.t("cancel")}</button>
                        </div>
                      ` : r`
                        <div class="step ${this._isToday(s.effective_date) ? "today" : ""} ${s.done_at ? "done" : ""}">
                          <span class="step-date">${this._fmt(s.effective_date)}</span>
                          <span class="step-title">${s.title}</span>
                          <button class="icon-link" title=${this.t("edit")} @click=${() => this._editStep = s.id}><ha-icon icon="mdi:pencil"></ha-icon></button>
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
    return r`
      <section>
        <h2>${this.t("config")}</h2>
        <div class="settings">
          <label>${this.t("language")}
            <select @change=${(e) => this._setLanguage(e.target.value)}>
              <option value="nl" ?selected=${this._lang === "nl"}>Nederlands</option>
              <option value="en" ?selected=${this._lang === "en"}>English</option>
            </select>
          </label>
          <div class="photo-field">
            <div class="photo-preview">
              ${t?.photo_url ? r`<img src=${t.photo_url} alt=${t.name} />` : r`<ha-icon icon="mdi:dog"></ha-icon>`}
            </div>
            <div class="photo-actions">
              <label class="filebtn">
                ${this.t("choosePhoto")}
                <input type="file" accept="image/*" @change=${this._onPhotoFile} hidden />
              </label>
              ${t?.photo_url ? r`<button class="link danger" @click=${() => this._savePhoto("")}>${this.t("remove")}</button>` : d}
              <div class="muted small">${this.t("photoHint")}</div>
            </div>
          </div>
          <label>${this.t("name")}<input type="text" id="name" .value=${t?.name ?? ""} /></label>
          <label>${this.t("birthDate")}<input type="date" id="birth" .value=${t?.birth_date ?? ""} /></label>
          <label>${this.t("homecomingDate")}<input type="date" id="home" .value=${t?.homecoming_date ?? ""} /></label>
          <button class="primary" @click=${this._saveConfig}>${this.t("save")}</button>
          <p class="muted">${this.t("homecomingHint")}</p>
          <div class="reseed">
            ${this._reseedConfirm ? r`<span class="confirm">${this.t("reloadConfirm")}
                  <button class="link danger" @click=${this._reloadDefaults}>${this.t("yes")}</button>
                  <button class="link" @click=${() => this._reseedConfirm = !1}>${this.t("no")}</button></span>` : r`<button class="ghost" @click=${() => this._reseedConfirm = !0}>${this.t("reloadDefaults")}</button>`}
            <div class="muted small">${this.t("reloadDefaultsHint")}</div>
          </div>
        </div>
      </section>
      ${this._renderPhases(i)}
      ${this._renderSocialization(i)}
      ${this._renderSchedules(i)}
    `;
  }
};
f.styles = xt`
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
    .icon-link { background: none; border: none; cursor: pointer; color: var(--secondary-text-color, var(--primary-color)); padding: 2px; display: inline-flex; align-items: center; border-radius: 6px; flex: 0 0 auto; }
    .icon-link:hover { color: var(--primary-color); background: color-mix(in srgb, var(--primary-text-color) 8%, transparent); }
    .icon-link.danger { color: var(--secondary-text-color, #888); }
    .icon-link.danger:hover { color: var(--error-color, #b00020); }
    .icon-link ha-icon { --mdc-icon-size: 18px; width: 18px; height: 18px; }
    .chip { border-radius: 999px; padding: 6px 14px; background: var(--primary-color); color: var(--text-primary-color, #fff); border: none; }
    .chip.ghost { background: transparent; border: 1px solid var(--primary-color); color: var(--primary-color); }

    /* Hero */
    .hero { display: flex; flex-direction: column; gap: 14px; background: var(--card-background-color); border-radius: 14px; padding: 16px; margin-bottom: 14px; box-shadow: var(--ha-card-box-shadow, 0 2px 6px rgba(0,0,0,.12)); }
    .hero-top { display: flex; gap: 16px; }
    .hero-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 10px; padding-top: 12px; border-top: 1px solid var(--divider-color, #eee); }
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
    .phase-toolbar { display: flex; justify-content: flex-end; margin-bottom: 4px; }
    .phase-toolbar .icon-link { gap: 4px; padding: 4px 8px; }
    .phase-toolbar .lbl { font-size: .8rem; }
    .phase-edit { display: flex; flex-direction: column; gap: 10px; }
    .phase-edit .fld { display: flex; flex-direction: column; gap: 3px; font-size: .74rem; opacity: .9; }
    .phase-edit input, .phase-edit textarea { padding: 8px; border-radius: 8px; border: 1px solid var(--divider-color, #ccc); background: var(--card-background-color); color: inherit; font: inherit; box-sizing: border-box; width: 100%; }
    .phase-edit textarea { resize: vertical; }
    .phase-edit .row3 { display: flex; gap: 10px; flex-wrap: wrap; }
    .phase-edit .row3 .fld { flex: 1 1 90px; }
    .cards-edit { display: flex; flex-direction: column; gap: 8px; }
    .ce-head { display: flex; align-items: center; justify-content: space-between; }
    .ce-card { border: 1px solid var(--divider-color, #ddd); border-radius: 8px; padding: 8px; display: flex; flex-direction: column; gap: 6px; }
    .ce-row { display: flex; gap: 6px; align-items: center; }
    .ce-row input:first-child { flex: 2; }
    .ce-row input:nth-child(2) { flex: 1; }
    .phase-edit-actions { display: flex; gap: 8px; }

    .phase-sched { margin-top: 14px; border-top: 1px solid var(--divider-color, #eee); padding-top: 10px; }
    .phase-sched > summary { font-size: .92rem; }
    .ps-summary { display: inline-flex; align-items: center; gap: 6px; }
    .chev { --mdc-icon-size: 18px; width: 18px; height: 18px; opacity: .6; transition: transform .15s; }
    details.phase-sched[open] > summary .chev { transform: rotate(90deg); }
    .ps-actions { margin: 8px 0 4px; }
    .add-week { margin-top: 6px; }
    .soc-item.editing select, .fld select { padding: 6px; border-radius: 6px; border: 1px solid var(--divider-color, #ccc); background: var(--card-background-color); color: inherit; font: inherit; }
    .ps-head { display: flex; align-items: center; justify-content: space-between; }
    .ps-head h4 { margin: 0; }
    .ps-list { display: flex; flex-direction: column; gap: 2px; margin-top: 6px; }
    .ps-item { display: flex; align-items: center; gap: 8px; padding: 5px 6px; border-radius: 8px; }
    .ps-item:hover { background: color-mix(in srgb, var(--primary-text-color) 5%, transparent); }
    .ps-time { font-variant-numeric: tabular-nums; width: 44px; font-size: .82rem; opacity: .85; flex: 0 0 auto; }
    .ps-main { display: flex; flex-direction: column; flex: 1; min-width: 0; }
    .ps-note { font-size: .74rem; opacity: .65; }
    .ps-item.editing { flex-wrap: wrap; }
    .ps-item.editing input[type="text"] { flex: 1 1 140px; }
    .ps-item select, .inline-form select, .ps-item input, .inline-form .fld select {
      padding: 6px; border-radius: 6px; border: 1px solid var(--divider-color, #ccc); background: var(--card-background-color); color: inherit; font: inherit;
    }

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
    .week-card.past { opacity: .5; }
    .week-card.past:hover, .week-card.past:focus-within { opacity: 1; }
    .past-tag { font-size: .68rem; text-transform: uppercase; letter-spacing: .04em; background: color-mix(in srgb, var(--primary-text-color) 12%, transparent); border-radius: 999px; padding: 2px 8px; margin-left: 6px; }
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
    .day-chip { font-size: .72rem; opacity: .7; flex: 0 0 auto; min-width: 40px; font-variant-numeric: tabular-nums; }
    .soc-item .edit-btn { flex: 0 0 auto; }
    .soc-edit-row { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 8px; width: 100%; }
    .soc-edit-row .spacer { flex: 1; }
    .wk-move { display: inline-flex; align-items: center; gap: 4px; font-size: .78rem; opacity: .8; }
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
    .settings input, .settings select { padding: 8px; border-radius: 8px; border: 1px solid var(--divider-color, #ccc); background: var(--card-background-color); color: inherit; font: inherit; }
    .reseed { margin-top: 6px; display: flex; flex-direction: column; gap: 4px; align-items: flex-start; }
    .photo-field { display: flex; gap: 14px; align-items: center; }
    .photo-preview { width: 96px; height: 96px; border-radius: 12px; overflow: hidden; flex: 0 0 auto; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, var(--primary-color), color-mix(in srgb, var(--primary-color) 40%, #000)); color: #fff; }
    .photo-preview img { width: 100%; height: 100%; object-fit: cover; }
    .photo-preview ha-icon { --mdc-icon-size: 48px; }
    .photo-actions { display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }
    .filebtn { display: inline-block; cursor: pointer; background: transparent; border: 1px solid var(--primary-color); color: var(--primary-color); border-radius: 8px; padding: 8px 14px; font-size: .9rem; }
    .small { font-size: .78rem; }
  `;
g([
  tt({ attribute: !1 })
], f.prototype, "hass", 2);
g([
  tt({ attribute: !1 })
], f.prototype, "narrow", 2);
g([
  v()
], f.prototype, "_state", 2);
g([
  v()
], f.prototype, "_error", 2);
g([
  v()
], f.prototype, "_tab", 2);
g([
  v()
], f.prototype, "_defer", 2);
g([
  v()
], f.prototype, "_taskForm", 2);
g([
  v()
], f.prototype, "_protoForm", 2);
g([
  v()
], f.prototype, "_stepForm", 2);
g([
  v()
], f.prototype, "_editStep", 2);
g([
  v()
], f.prototype, "_editProto", 2);
g([
  v()
], f.prototype, "_schedForm", 2);
g([
  v()
], f.prototype, "_editSched", 2);
g([
  v()
], f.prototype, "_socAddWeek", 2);
g([
  v()
], f.prototype, "_editPhase", 2);
g([
  v()
], f.prototype, "_phaseDraft", 2);
g([
  v()
], f.prototype, "_reseedConfirm", 2);
g([
  v()
], f.prototype, "_confirm", 2);
f = g([
  Bt("puppy-tracker-panel")
], f);
export {
  f as PuppyTrackerPanel
};
