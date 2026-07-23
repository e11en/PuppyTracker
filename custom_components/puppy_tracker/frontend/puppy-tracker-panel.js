/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const U = globalThis, B = U.ShadowRoot && (U.ShadyCSS === void 0 || U.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, V = Symbol(), ee = /* @__PURE__ */ new WeakMap();
let he = class {
  constructor(e, t, s) {
    if (this._$cssResult$ = !0, s !== V) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (B && e === void 0) {
      const s = t !== void 0 && t.length === 1;
      s && (e = ee.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), s && ee.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const ve = (i) => new he(typeof i == "string" ? i : i + "", void 0, V), ye = (i, ...e) => {
  const t = i.length === 1 ? i[0] : e.reduce((s, o, r) => s + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(o) + i[r + 1], i[0]);
  return new he(t, i, V);
}, xe = (i, e) => {
  if (B) i.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const s = document.createElement("style"), o = U.litNonce;
    o !== void 0 && s.setAttribute("nonce", o), s.textContent = t.cssText, i.appendChild(s);
  }
}, te = B ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const s of e.cssRules) t += s.cssText;
  return ve(t);
})(i) : i;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: $e, defineProperty: ke, getOwnPropertyDescriptor: we, getOwnPropertyNames: Se, getOwnPropertySymbols: Ae, getPrototypeOf: Te } = Object, F = globalThis, ie = F.trustedTypes, Ee = ie ? ie.emptyScript : "", ze = F.reactiveElementPolyfillSupport, C = (i, e) => i, j = { toAttribute(i, e) {
  switch (e) {
    case Boolean:
      i = i ? Ee : null;
      break;
    case Object:
    case Array:
      i = i == null ? i : JSON.stringify(i);
  }
  return i;
}, fromAttribute(i, e) {
  let t = i;
  switch (e) {
    case Boolean:
      t = i !== null;
      break;
    case Number:
      t = i === null ? null : Number(i);
      break;
    case Object:
    case Array:
      try {
        t = JSON.parse(i);
      } catch {
        t = null;
      }
  }
  return t;
} }, J = (i, e) => !$e(i, e), se = { attribute: !0, type: String, converter: j, reflect: !1, useDefault: !1, hasChanged: J };
Symbol.metadata ??= Symbol("metadata"), F.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let S = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = se) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const s = Symbol(), o = this.getPropertyDescriptor(e, s, t);
      o !== void 0 && ke(this.prototype, e, o);
    }
  }
  static getPropertyDescriptor(e, t, s) {
    const { get: o, set: r } = we(this.prototype, e) ?? { get() {
      return this[t];
    }, set(a) {
      this[t] = a;
    } };
    return { get: o, set(a) {
      const c = o?.call(this);
      r?.call(this, a), this.requestUpdate(e, c, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? se;
  }
  static _$Ei() {
    if (this.hasOwnProperty(C("elementProperties"))) return;
    const e = Te(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(C("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(C("properties"))) {
      const t = this.properties, s = [...Se(t), ...Ae(t)];
      for (const o of s) this.createProperty(o, t[o]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [s, o] of t) this.elementProperties.set(s, o);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, s] of this.elementProperties) {
      const o = this._$Eu(t, s);
      o !== void 0 && this._$Eh.set(o, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const s = new Set(e.flat(1 / 0).reverse());
      for (const o of s) t.unshift(te(o));
    } else e !== void 0 && t.push(te(e));
    return t;
  }
  static _$Eu(e, t) {
    const s = t.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
  }
  addController(e) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
  }
  removeController(e) {
    this._$EO?.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
    for (const s of t.keys()) this.hasOwnProperty(s) && (e.set(s, this[s]), delete this[s]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return xe(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((e) => e.hostDisconnected?.());
  }
  attributeChangedCallback(e, t, s) {
    this._$AK(e, s);
  }
  _$ET(e, t) {
    const s = this.constructor.elementProperties.get(e), o = this.constructor._$Eu(e, s);
    if (o !== void 0 && s.reflect === !0) {
      const r = (s.converter?.toAttribute !== void 0 ? s.converter : j).toAttribute(t, s.type);
      this._$Em = e, r == null ? this.removeAttribute(o) : this.setAttribute(o, r), this._$Em = null;
    }
  }
  _$AK(e, t) {
    const s = this.constructor, o = s._$Eh.get(e);
    if (o !== void 0 && this._$Em !== o) {
      const r = s.getPropertyOptions(o), a = typeof r.converter == "function" ? { fromAttribute: r.converter } : r.converter?.fromAttribute !== void 0 ? r.converter : j;
      this._$Em = o;
      const c = a.fromAttribute(t, r.type);
      this[o] = c ?? this._$Ej?.get(o) ?? c, this._$Em = null;
    }
  }
  requestUpdate(e, t, s, o = !1, r) {
    if (e !== void 0) {
      const a = this.constructor;
      if (o === !1 && (r = this[e]), s ??= a.getPropertyOptions(e), !((s.hasChanged ?? J)(r, t) || s.useDefault && s.reflect && r === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, s)))) return;
      this.C(e, t, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: s, reflect: o, wrapped: r }, a) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, a ?? t ?? this[e]), r !== !0 || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || s || (t = void 0), this._$AL.set(e, t)), o === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (t) {
      Promise.reject(t);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
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
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), this._$EO?.forEach((s) => s.hostUpdate?.()), this.update(t)) : this._$EM();
    } catch (s) {
      throw e = !1, this._$EM(), s;
    }
    e && this._$AE(t);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    this._$EO?.forEach((t) => t.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
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
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Eq &&= this._$Eq.forEach((t) => this._$ET(t, this[t])), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
S.elementStyles = [], S.shadowRootOptions = { mode: "open" }, S[C("elementProperties")] = /* @__PURE__ */ new Map(), S[C("finalized")] = /* @__PURE__ */ new Map(), ze?.({ ReactiveElement: S }), (F.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Z = globalThis, oe = (i) => i, H = Z.trustedTypes, re = H ? H.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, ue = "$lit$", x = `lit$${Math.random().toFixed(9).slice(2)}$`, me = "?" + x, Pe = `<${me}>`, w = document, D = () => w.createComment(""), M = (i) => i === null || typeof i != "object" && typeof i != "function", K = Array.isArray, Ce = (i) => K(i) || typeof i?.[Symbol.iterator] == "function", L = `[ 	
\f\r]`, z = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ae = /-->/g, ne = />/g, $ = RegExp(`>|${L}(?:([^\\s"'>=/]+)(${L}*=${L}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), le = /'/g, ce = /"/g, fe = /^(?:script|style|textarea|title)$/i, Oe = (i) => (e, ...t) => ({ _$litType$: i, strings: e, values: t }), n = Oe(1), A = Symbol.for("lit-noChange"), d = Symbol.for("lit-nothing"), de = /* @__PURE__ */ new WeakMap(), k = w.createTreeWalker(w, 129);
function ge(i, e) {
  if (!K(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return re !== void 0 ? re.createHTML(e) : e;
}
const De = (i, e) => {
  const t = i.length - 1, s = [];
  let o, r = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", a = z;
  for (let c = 0; c < t; c++) {
    const l = i[c];
    let u, m, p = -1, v = 0;
    for (; v < l.length && (a.lastIndex = v, m = a.exec(l), m !== null); ) v = a.lastIndex, a === z ? m[1] === "!--" ? a = ae : m[1] !== void 0 ? a = ne : m[2] !== void 0 ? (fe.test(m[2]) && (o = RegExp("</" + m[2], "g")), a = $) : m[3] !== void 0 && (a = $) : a === $ ? m[0] === ">" ? (a = o ?? z, p = -1) : m[1] === void 0 ? p = -2 : (p = a.lastIndex - m[2].length, u = m[1], a = m[3] === void 0 ? $ : m[3] === '"' ? ce : le) : a === ce || a === le ? a = $ : a === ae || a === ne ? a = z : (a = $, o = void 0);
    const y = a === $ && i[c + 1].startsWith("/>") ? " " : "";
    r += a === z ? l + Pe : p >= 0 ? (s.push(u), l.slice(0, p) + ue + l.slice(p) + x + y) : l + x + (p === -2 ? c : y);
  }
  return [ge(i, r + (i[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), s];
};
class R {
  constructor({ strings: e, _$litType$: t }, s) {
    let o;
    this.parts = [];
    let r = 0, a = 0;
    const c = e.length - 1, l = this.parts, [u, m] = De(e, t);
    if (this.el = R.createElement(u, s), k.currentNode = this.el.content, t === 2 || t === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (o = k.nextNode()) !== null && l.length < c; ) {
      if (o.nodeType === 1) {
        if (o.hasAttributes()) for (const p of o.getAttributeNames()) if (p.endsWith(ue)) {
          const v = m[a++], y = o.getAttribute(p).split(x), h = /([.?@])?(.*)/.exec(v);
          l.push({ type: 1, index: r, name: h[2], strings: y, ctor: h[1] === "." ? Re : h[1] === "?" ? Ne : h[1] === "@" ? Ue : I }), o.removeAttribute(p);
        } else p.startsWith(x) && (l.push({ type: 6, index: r }), o.removeAttribute(p));
        if (fe.test(o.tagName)) {
          const p = o.textContent.split(x), v = p.length - 1;
          if (v > 0) {
            o.textContent = H ? H.emptyScript : "";
            for (let y = 0; y < v; y++) o.append(p[y], D()), k.nextNode(), l.push({ type: 2, index: ++r });
            o.append(p[v], D());
          }
        }
      } else if (o.nodeType === 8) if (o.data === me) l.push({ type: 2, index: r });
      else {
        let p = -1;
        for (; (p = o.data.indexOf(x, p + 1)) !== -1; ) l.push({ type: 7, index: r }), p += x.length - 1;
      }
      r++;
    }
  }
  static createElement(e, t) {
    const s = w.createElement("template");
    return s.innerHTML = e, s;
  }
}
function T(i, e, t = i, s) {
  if (e === A) return e;
  let o = s !== void 0 ? t._$Co?.[s] : t._$Cl;
  const r = M(e) ? void 0 : e._$litDirective$;
  return o?.constructor !== r && (o?._$AO?.(!1), r === void 0 ? o = void 0 : (o = new r(i), o._$AT(i, t, s)), s !== void 0 ? (t._$Co ??= [])[s] = o : t._$Cl = o), o !== void 0 && (e = T(i, o._$AS(i, e.values), o, s)), e;
}
class Me {
  constructor(e, t) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: t }, parts: s } = this._$AD, o = (e?.creationScope ?? w).importNode(t, !0);
    k.currentNode = o;
    let r = k.nextNode(), a = 0, c = 0, l = s[0];
    for (; l !== void 0; ) {
      if (a === l.index) {
        let u;
        l.type === 2 ? u = new N(r, r.nextSibling, this, e) : l.type === 1 ? u = new l.ctor(r, l.name, l.strings, this, e) : l.type === 6 && (u = new je(r, this, e)), this._$AV.push(u), l = s[++c];
      }
      a !== l?.index && (r = k.nextNode(), a++);
    }
    return k.currentNode = w, o;
  }
  p(e) {
    let t = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(e, s, t), t += s.strings.length - 2) : s._$AI(e[t])), t++;
  }
}
class N {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, t, s, o) {
    this.type = 2, this._$AH = d, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = s, this.options = o, this._$Cv = o?.isConnected ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const t = this._$AM;
    return t !== void 0 && e?.nodeType === 11 && (e = t.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, t = this) {
    e = T(this, e, t), M(e) ? e === d || e == null || e === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : e !== this._$AH && e !== A && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Ce(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== d && M(this._$AH) ? this._$AA.nextSibling.data = e : this.T(w.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: t, _$litType$: s } = e, o = typeof s == "number" ? this._$AC(e) : (s.el === void 0 && (s.el = R.createElement(ge(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === o) this._$AH.p(t);
    else {
      const r = new Me(o, this), a = r.u(this.options);
      r.p(t), this.T(a), this._$AH = r;
    }
  }
  _$AC(e) {
    let t = de.get(e.strings);
    return t === void 0 && de.set(e.strings, t = new R(e)), t;
  }
  k(e) {
    K(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let s, o = 0;
    for (const r of e) o === t.length ? t.push(s = new N(this.O(D()), this.O(D()), this, this.options)) : s = t[o], s._$AI(r), o++;
    o < t.length && (this._$AR(s && s._$AB.nextSibling, o), t.length = o);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    for (this._$AP?.(!1, !0, t); e !== this._$AB; ) {
      const s = oe(e).nextSibling;
      oe(e).remove(), e = s;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class I {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, s, o, r) {
    this.type = 1, this._$AH = d, this._$AN = void 0, this.element = e, this.name = t, this._$AM = o, this.options = r, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = d;
  }
  _$AI(e, t = this, s, o) {
    const r = this.strings;
    let a = !1;
    if (r === void 0) e = T(this, e, t, 0), a = !M(e) || e !== this._$AH && e !== A, a && (this._$AH = e);
    else {
      const c = e;
      let l, u;
      for (e = r[0], l = 0; l < r.length - 1; l++) u = T(this, c[s + l], t, l), u === A && (u = this._$AH[l]), a ||= !M(u) || u !== this._$AH[l], u === d ? e = d : e !== d && (e += (u ?? "") + r[l + 1]), this._$AH[l] = u;
    }
    a && !o && this.j(e);
  }
  j(e) {
    e === d ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Re extends I {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === d ? void 0 : e;
  }
}
class Ne extends I {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== d);
  }
}
class Ue extends I {
  constructor(e, t, s, o, r) {
    super(e, t, s, o, r), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = T(this, e, t, 0) ?? d) === A) return;
    const s = this._$AH, o = e === d && s !== d || e.capture !== s.capture || e.once !== s.once || e.passive !== s.passive, r = e !== d && (s === d || o);
    o && this.element.removeEventListener(this.name, this, s), r && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class je {
  constructor(e, t, s) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    T(this, e);
  }
}
const He = Z.litHtmlPolyfillSupport;
He?.(R, N), (Z.litHtmlVersions ??= []).push("3.3.3");
const Fe = (i, e, t) => {
  const s = t?.renderBefore ?? e;
  let o = s._$litPart$;
  if (o === void 0) {
    const r = t?.renderBefore ?? null;
    s._$litPart$ = o = new N(e.insertBefore(D(), r), r, void 0, t ?? {});
  }
  return o._$AI(i), o;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Y = globalThis;
class O extends S {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Fe(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return A;
  }
}
O._$litElement$ = !0, O.finalized = !0, Y.litElementHydrateSupport?.({ LitElement: O });
const Ie = Y.litElementPolyfillSupport;
Ie?.({ LitElement: O });
(Y.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Le = (i) => (e, t) => {
  t !== void 0 ? t.addInitializer(() => {
    customElements.define(i, e);
  }) : customElements.define(i, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const qe = { attribute: !0, type: String, converter: j, reflect: !1, hasChanged: J }, We = (i = qe, e, t) => {
  const { kind: s, metadata: o } = t;
  let r = globalThis.litPropertyMetadata.get(o);
  if (r === void 0 && globalThis.litPropertyMetadata.set(o, r = /* @__PURE__ */ new Map()), s === "setter" && ((i = Object.create(i)).wrapped = !0), r.set(t.name, i), s === "accessor") {
    const { name: a } = t;
    return { set(c) {
      const l = e.get.call(this);
      e.set.call(this, c), this.requestUpdate(a, l, i, !0, c);
    }, init(c) {
      return c !== void 0 && this.C(a, void 0, i, c), c;
    } };
  }
  if (s === "setter") {
    const { name: a } = t;
    return function(c) {
      const l = this[a];
      e.call(this, c), this.requestUpdate(a, l, i, !0, c);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function G(i) {
  return (e, t) => typeof t == "object" ? We(i, e, t) : ((s, o, r) => {
    const a = o.hasOwnProperty(r);
    return o.constructor.createProperty(r, s), a ? Object.getOwnPropertyDescriptor(o, r) : void 0;
  })(i, e, t);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function b(i) {
  return G({ ...i, state: !0, attribute: !1 });
}
var Be = Object.defineProperty, Ve = Object.getOwnPropertyDescriptor, _ = (i, e, t, s) => {
  for (var o = s > 1 ? void 0 : s ? Ve(e, t) : e, r = i.length - 1, a; r >= 0; r--)
    (a = i[r]) && (o = (s ? a(e, t, o) : a(o)) || o);
  return s && o && Be(e, t, o), o;
};
const pe = [
  { id: "vandaag", label: "Vandaag" },
  { id: "fases", label: "Fases" },
  { id: "socialisatie", label: "Socialisatie" },
  { id: "schemas", label: "Schema's" },
  { id: "config", label: "Configuratie" }
], Je = new Intl.DateTimeFormat("nl-NL", { weekday: "short", day: "numeric", month: "short" }), Ze = new Intl.DateTimeFormat("nl-NL", { weekday: "long", day: "numeric", month: "short" }), Ke = new Intl.DateTimeFormat("nl-NL", { weekday: "short", day: "numeric" }), _e = 7, P = 60;
function W(i, e) {
  let t = i * 60 + e - _e * 60;
  return t < 0 && (t += 1440), t;
}
function q(i) {
  const [e, t] = i.split(":").map(Number);
  return W(e, t);
}
let f = class extends O {
  constructor() {
    super(...arguments), this.narrow = !1, this._error = "", this._tab = "vandaag", this._taskForm = !1, this._protoForm = !1, this._loaded = !1, this._didScroll = !1;
  }
  connectedCallback() {
    super.connectedCallback(), this._timer = window.setInterval(() => this.requestUpdate(), 1e3);
    const i = localStorage.getItem("pt-tab");
    i && pe.some((e) => e.id === i) && (this._tab = i);
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
      const e = this.renderRoot.querySelector(".timeline-scroll");
      if (e && e.clientHeight > 0) {
        const t = /* @__PURE__ */ new Date(), s = W(t.getHours(), t.getMinutes()) / 60 * P;
        e.scrollTop = Math.max(0, s - e.clientHeight / 2), this._didScroll = !0;
      }
    }
  }
  async _ws(i, e = {}) {
    if (this.hass)
      try {
        return await this.hass.connection.sendMessagePromise({ type: `puppy_tracker/${i}`, ...e });
      } catch (t) {
        this._error = String(t?.message ?? t);
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
  async _toggleDaily(i, e) {
    const t = await this._ws("toggle_daily_check", { item_key: i, done: e });
    t && this._merge({ daily_checks: t.daily_checks });
  }
  async _clearToday() {
    const i = await this._ws("clear_daily_checks");
    i && this._merge({ daily_checks: i.daily_checks });
  }
  async _toggleStep(i) {
    const e = await this._ws("set_step_done", { step_id: i.id, done: !i.done_at });
    e && this._merge({ protocols: e.protocols });
  }
  async _applyDefer() {
    if (!this._defer || this._defer.days === 0) {
      this._defer = void 0;
      return;
    }
    const { stepId: i, days: e } = this._defer;
    this._defer = void 0;
    const t = await this._ws("defer_step", { step_id: i, days: e });
    t && this._merge({ protocols: t.protocols });
  }
  async _toggleTask(i) {
    const e = await this._ws("set_task_done", { task_id: i.id, done: !i.done_at });
    e && this._merge({ tasks: e.tasks });
  }
  async _removeTask(i) {
    this._confirm = void 0;
    const e = await this._ws("remove_task", { task_id: i });
    e && this._merge({ tasks: e.tasks });
  }
  async _submitTask() {
    const i = this.renderRoot.querySelector("#nt-title")?.value.trim(), e = this.renderRoot.querySelector("#nt-date")?.value;
    if (!i) return;
    this._taskForm = !1;
    const t = await this._ws("add_task", { title: i, date: e || null });
    t && this._merge({ tasks: t.tasks });
  }
  async _submitProtocol() {
    const i = (s) => this.renderRoot.querySelector(s)?.value ?? "", e = i("#np-name").trim();
    if (!e) return;
    this._protoForm = !1;
    const t = await this._ws("add_protocol", {
      name: e,
      anchor: "fixed",
      start_date: i("#np-start") || null,
      notes: i("#np-notes")
    });
    t && this._merge({ protocols: t.protocols });
  }
  async _submitProtoEdit(i) {
    const e = (o) => this.renderRoot.querySelector(o)?.value ?? "", t = e("#ep-name").trim();
    if (!t) return;
    this._editProto = void 0;
    const s = await this._ws("update_protocol", {
      protocol_id: i.id,
      name: t,
      start_date: e("#ep-start") || null,
      notes: e("#ep-notes")
    });
    s && this._merge({ protocols: s.protocols });
  }
  async _submitStep(i) {
    const e = this.renderRoot.querySelector("#ns-title")?.value.trim(), t = this.renderRoot.querySelector("#ns-date")?.value;
    if (!e) return;
    this._stepForm = void 0;
    const s = this._dateToOffset(i.start_date, t), o = await this._ws("add_step", {
      protocol_id: i.id,
      title: e,
      day_offset: s ?? 0
    });
    o && this._merge({ protocols: o.protocols });
  }
  async _removeProtocol(i) {
    this._confirm = void 0;
    const e = await this._ws("remove_protocol", { protocol_id: i });
    e && this._merge({ protocols: e.protocols });
  }
  _isoLocal(i) {
    const e = i.getFullYear(), t = String(i.getMonth() + 1).padStart(2, "0"), s = String(i.getDate()).padStart(2, "0");
    return `${e}-${t}-${s}`;
  }
  _nextStepDate(i, e) {
    const t = i.steps.length ? i.steps[i.steps.length - 1].effective_date : null;
    if (t) {
      const s = /* @__PURE__ */ new Date(t + "T00:00:00");
      return s.setDate(s.getDate() + 1), this._isoLocal(s);
    }
    return i.start_date ?? e;
  }
  _dateToOffset(i, e) {
    if (!i || !e) return null;
    const t = (/* @__PURE__ */ new Date(i + "T00:00:00")).getTime(), s = (/* @__PURE__ */ new Date(e + "T00:00:00")).getTime();
    return Math.round((s - t) / 864e5);
  }
  async _submitStepEdit(i, e) {
    const t = this.renderRoot.querySelector("#es-title")?.value.trim(), s = this.renderRoot.querySelector("#es-date")?.value, o = this.renderRoot.querySelector("#es-notes")?.value ?? "", r = this.renderRoot.querySelector("#es-cat");
    if (!t) return;
    const a = this._dateToOffset(e.start_date, s);
    this._editStep = void 0;
    const c = { step_id: i.id, title: t, notes: o };
    a !== null && (c.day_offset = a), r && (c.category = r.value);
    const l = await this._ws("update_step", c);
    l && this._merge({ protocols: l.protocols });
  }
  _socCatOptions(i, e) {
    return Object.entries(i.socialization_categories).map(
      ([t, s]) => n`<option value=${t} ?selected=${t === e}>${s.label}</option>`
    );
  }
  async _submitSocAdd(i, e) {
    const t = this.renderRoot.querySelector("#sa-title")?.value.trim(), s = this.renderRoot.querySelector("#sa-cat")?.value ?? "omgeving";
    if (!t) return;
    this._socAddWeek = void 0;
    const o = await this._ws("add_step", {
      protocol_id: i.id,
      title: t,
      category: s,
      day_offset: e * 7,
      check_mode: "milestone"
    });
    o && this._merge({ protocols: o.protocols });
  }
  async _submitSchedItem(i) {
    const e = (r) => this.renderRoot.querySelector(r)?.value ?? "", t = e("#sc-time"), s = e("#sc-label").trim();
    if (!t || !s) return;
    this._schedForm = void 0;
    const o = await this._ws("add_schedule_item", {
      phase_key: i,
      time: t,
      label: s,
      item_type: e("#sc-type") || "rust",
      notes: e("#sc-notes")
    });
    o && this._merge({ schedules: o.schedules });
  }
  async _submitSchedEdit(i) {
    const e = (r) => this.renderRoot.querySelector(r)?.value ?? "", t = e("#se-label").trim(), s = e("#se-time");
    if (!s || !t) return;
    this._editSched = void 0;
    const o = await this._ws("update_schedule_item", {
      item_id: i.id,
      time: s,
      label: t,
      item_type: e("#se-type"),
      notes: e("#se-notes")
    });
    o && this._merge({ schedules: o.schedules });
  }
  async _removeSchedItem(i) {
    const e = await this._ws("remove_schedule_item", { item_id: i });
    e && this._merge({ schedules: e.schedules });
  }
  async _saveConfig() {
    const i = (t) => this.renderRoot.querySelector(t)?.value ?? "", e = await this._ws("update_puppy", {
      name: i("#name"),
      birth_date: i("#birth") || null,
      homecoming_date: i("#home") || null
    });
    e && e.puppy !== void 0 && (this._state = e);
  }
  async _savePhoto(i) {
    const e = await this._ws("update_puppy", { photo_url: i });
    e && e.puppy !== void 0 && (this._state = e);
  }
  _onPhotoFile(i) {
    const e = i.target, t = e.files?.[0];
    if (!t) return;
    const s = new FileReader();
    s.onload = () => {
      const o = new Image();
      o.onload = () => {
        const a = Math.min(1, 400 / Math.max(o.width, o.height)), c = Math.round(o.width * a), l = Math.round(o.height * a), u = document.createElement("canvas");
        u.width = c, u.height = l;
        const m = u.getContext("2d");
        if (!m) return;
        m.drawImage(o, 0, 0, c, l);
        const p = u.toDataURL("image/jpeg", 0.82);
        this._savePhoto(p);
      }, o.src = s.result;
    }, s.readAsDataURL(t), e.value = "";
  }
  // ---- Derived helpers ---------------------------------------------------
  _fmt(i) {
    return i ? Je.format(/* @__PURE__ */ new Date(i + "T00:00:00")) : "";
  }
  _dayLabel(i) {
    return i ? Ke.format(/* @__PURE__ */ new Date(i + "T00:00:00")) : "";
  }
  _isToday(i) {
    return !!i && i === this._state?.today;
  }
  _ageText() {
    const i = this._state?.age_days;
    if (i == null) return "leeftijd onbekend";
    const e = Math.floor(i / 7), t = i % 7;
    return `${e} ${e === 1 ? "week" : "weken"} & ${t} ${t === 1 ? "dag" : "dagen"} oud`;
  }
  _countdown() {
    const i = this._state?.next_pee;
    if (!i) return "";
    const e = Math.max(0, Math.round((new Date(i.at).getTime() - Date.now()) / 1e3)), t = Math.floor(e / 3600), s = Math.floor(e % 3600 / 60);
    return t > 0 ? `over ${t} u ${s} min` : `over ${s} min`;
  }
  _restToday() {
    return this._state?.protocols.find((e) => e.seed_key === "socialization")?.steps.find((e) => this._isToday(e.effective_date) && e.category === "rust");
  }
  _todaySteps() {
    const i = [];
    for (const e of this._state?.protocols ?? [])
      for (const t of e.steps) this._isToday(t.effective_date) && i.push({ protocol: e, step: t });
    return i;
  }
  _todayTasks() {
    return (this._state?.tasks ?? []).filter((i) => this._isToday(i.date));
  }
  _upcoming() {
    const i = this._state;
    if (!i) return [];
    const e = /* @__PURE__ */ new Date(i.today + "T00:00:00");
    e.setDate(e.getDate() + 7);
    const t = e.toISOString().slice(0, 10), s = (r) => !!r && r >= i.today && r < t, o = [];
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
            @input=${(e) => this._defer = { stepId: i.id, days: parseInt(e.target.value, 10) || 0 }} />
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
        ${pe.map(
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
    const e = i.phase, t = i.puppy?.photo_url;
    return n`
      <div class="hero">
        <div class="hero-photo">
          ${t ? n`<img src=${t} alt="foto" />` : n`<ha-icon icon="mdi:dog"></ha-icon>`}
        </div>
        <div class="hero-body">
          <div class="hero-name">${i.puppy?.name ?? "Puppy"}</div>
          <div class="hero-age">${this._ageText()}</div>
          ${e ? n`
                <div class="hero-phase">
                  <span class="dot green"></span>
                  <strong>${e.title}</strong>
                  <small>(${e.week_start}-${e.week_end} wkn)</small>
                </div>
                <div class="hero-focus">Focus: ${e.focus.join(" · ")}</div>
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
    const e = new Set(i.daily_checks), t = this._restToday(), s = this._todaySteps(), o = this._todayTasks(), r = 24 * P, a = /* @__PURE__ */ new Date(), c = W(a.getHours(), a.getMinutes()) / 60 * P, l = i.phase && i.schedules[i.phase.key] || [], u = 26, m = [...l].sort((h, g) => q(h.time) - q(g.time));
    let p = -100;
    const v = m.map((h) => {
      let g = q(h.time) / 60 * P;
      return g < p + 2 && (g = p + 2), p = g + u, { it: h, top: g };
    }), y = Array.from({ length: 24 }, (h, g) => {
      const E = (_e + g) % 24;
      return { hour: E, night: E >= 22 || E < 6, top: g * P };
    });
    return n`
      <section>
        <div class="sec-head">
          <h2><ha-icon icon="mdi:clock-outline"></ha-icon> Dagschema & taken (vandaag)</h2>
          <button class="ghost" @click=${this._clearToday}>Wis vandaag</button>
        </div>
        ${t ? n`<div class="rest-banner">💥 Rustdag — ${t.title}</div>` : d}
        <div class="timeline-scroll">
          <div class="timeline" style="height:${r}px">
            ${y.map(
      (h) => n`
                <div class="hour-line ${h.night ? "night" : ""}" style="top:${h.top}px">
                  <span class="hour-label">${String(h.hour).padStart(2, "0")}:00</span>
                </div>
              `
    )}
            ${v.map(({ it: h, top: g }) => {
      const E = i.schedule_types[h.type], Q = String(h.id), X = e.has(Q);
      return n`
                <div class="tl-item ${X ? "checked" : ""}" style="top:${g}px;--rc:${E?.color ?? "#888"}" title=${h.notes || h.label}>
                  <span class="tl-time">${h.time}</span>
                  <span class="tl-label">${h.label}</span>
                  <input type="checkbox" .checked=${X}
                    @change=${(be) => this._toggleDaily(Q, be.target.checked)} />
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
      (h) => n`
                    <label class="row ${h.done_at ? "checked" : ""}" style="--rc:var(--primary-color)">
                      <ha-icon icon="mdi:calendar-check"></ha-icon>
                      <span class="row-main"><span class="row-title">${h.title}</span></span>
                      <input type="checkbox" .checked=${!!h.done_at} @change=${() => this._toggleTask(h)} />
                    </label>
                  `
    )}
                ${s.map(
      ({ protocol: h, step: g }) => n`
                    <label class="row ${g.done_at ? "checked" : ""}" style="--rc:#a05ac0">
                      <ha-icon icon="mdi:flag-outline"></ha-icon>
                      <span class="row-main">
                        <span class="row-title">${g.title}</span>
                        <span class="row-note">${h.name}</span>
                      </span>
                      ${this._deferControls(g)}
                      <input type="checkbox" .checked=${!!g.done_at} @change=${() => this._toggleStep(g)} />
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
    let e = "";
    return n`
      <section>
        <h2><ha-icon icon="mdi:calendar-star"></ha-icon> Belangrijke gebeurtenissen (deze week)</h2>
        ${i.length === 0 ? n`<p class="muted">Niets gepland deze week.</p>` : d}
        <div class="events">
          ${i.map((t) => {
      const s = t.date !== e;
      return e = t.date, n`
              ${s ? n`<div class="ev-date">${Ze.format(/* @__PURE__ */ new Date(t.date + "T00:00:00"))}</div>` : d}
              <div class="ev">
                <span class="dot" style="background:${t.color}"></span>
                <ha-icon icon=${t.icon}></ha-icon>
                <span class="ev-title">${t.title}</span>
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
        ${i.phases.map((e) => {
      const t = i.phase?.key === e.key;
      return n`
            <details class="phase" ?open=${t}>
              <summary>
                <span>${e.title} <small>(${e.week_start}-${e.week_end} wkn)</small></span>
                ${t ? n`<span class="badge">Nu</span>` : d}
              </summary>
              <div class="phase-body">
                <ul class="focus">${e.focus.map((s) => n`<li>${s}</li>`)}</ul>
                <div class="cards">
                  ${e.info_cards.map(
        (s) => n`
                      <div class="info-card">
                        <h4><ha-icon icon=${s.icon}></ha-icon> ${s.title}</h4>
                        <ul>${s.items.map((o) => n`<li>${o}</li>`)}</ul>
                      </div>
                    `
      )}
                </div>
                ${this._renderPhaseSchedule(i, e)}
              </div>
            </details>
          `;
    })}
      </section>
    `;
  }
  _typeOptions(i, e) {
    return Object.entries(i.schedule_types).map(
      ([t, s]) => n`<option value=${t} ?selected=${t === e}>${s.label}</option>`
    );
  }
  _renderPhaseSchedule(i, e) {
    const t = [...i.schedules[e.key] ?? []].sort((s, o) => s.time < o.time ? -1 : 1);
    return n`
      <details class="phase-sched">
        <summary>
          <span class="ps-summary">
            <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
            <ha-icon icon="mdi:clock-outline"></ha-icon> Dagschema voor deze fase
          </span>
          <small class="muted">${t.length} items</small>
        </summary>
        <div class="ps-actions">
          <button class="link" @click=${() => this._schedForm = this._schedForm === e.key ? void 0 : e.key}>+ Item</button>
        </div>
        ${this._schedForm === e.key ? n`<div class="inline-form">
              <label class="fld">Tijd<input id="sc-time" type="time" value="12:00" /></label>
              <label class="fld grow">Label<input id="sc-label" type="text" placeholder="bv. Plaspauze" /></label>
              <label class="fld">Type<select id="sc-type">${this._typeOptions(i, "rust")}</select></label>
              <label class="fld grow">Notitie<input id="sc-notes" type="text" placeholder="uitvoering (optioneel)" /></label>
              <button class="primary" @click=${() => this._submitSchedItem(e.key)}>Toevoegen</button>
              <button class="link" @click=${() => this._schedForm = void 0}>Annuleer</button>
            </div>` : d}
        <div class="ps-list">
          ${t.length === 0 ? n`<div class="muted small">Nog geen items voor deze fase.</div>` : d}
          ${t.map(
      (s) => this._editSched === s.id ? n`<div class="ps-item editing">
                  <input id="se-time" type="time" .value=${s.time} />
                  <input id="se-label" type="text" .value=${s.label} />
                  <select id="se-type">${this._typeOptions(i, s.type)}</select>
                  <input id="se-notes" type="text" .value=${s.notes} placeholder="notitie" />
                  <button class="primary" @click=${() => this._submitSchedEdit(s)}>Opslaan</button>
                  <button class="link" @click=${() => this._editSched = void 0}>Annuleer</button>
                </div>` : n`<div class="ps-item">
                  <span class="ps-time">${s.time}</span>
                  <span class="cat-dot" style="background:${i.schedule_types[s.type]?.color ?? "#888"}" title=${i.schedule_types[s.type]?.label ?? ""}></span>
                  <span class="ps-main">
                    <span>${s.label}</span>
                    ${s.notes ? n`<span class="ps-note">${s.notes}</span>` : d}
                  </span>
                  <button class="icon-link" title="Bewerken" @click=${() => this._editSched = s.id}><ha-icon icon="mdi:pencil"></ha-icon></button>
                  <button class="icon-link danger" title="Verwijderen" @click=${() => this._removeSchedItem(s.id)}><ha-icon icon="mdi:delete-outline"></ha-icon></button>
                </div>`
    )}
        </div>
      </details>
    `;
  }
  // ---- Tab: Socialisatie -------------------------------------------------
  async _removeStep(i) {
    this._confirm = void 0;
    const e = await this._ws("remove_step", { step_id: i });
    e && this._merge({ protocols: e.protocols });
  }
  _stepDelete(i) {
    return this._confirm?.kind === "step" && this._confirm.id === i.id ? n`<span class="confirm">Verwijderen?
          <button class="link danger" @click=${() => this._removeStep(i.id)}>Ja</button>
          <button class="link" @click=${() => this._confirm = void 0}>Nee</button></span>` : n`<button class="link danger" title="Verwijderen" @click=${() => this._confirm = { kind: "step", id: i.id }}>×</button>`;
  }
  async _moveStepWeek(i, e) {
    const t = await this._ws("update_step", {
      step_id: i.id,
      day_offset: i.day_offset + e * 7
    });
    t && this._merge({ protocols: t.protocols });
  }
  _currentSocWeek(i) {
    if (!i.start_date || !this._state) return null;
    const e = (/* @__PURE__ */ new Date(i.start_date + "T00:00:00")).getTime(), t = (/* @__PURE__ */ new Date(this._state.today + "T00:00:00")).getTime();
    return t < e ? -1 : Math.floor((t - e) / (7 * 864e5));
  }
  _renderSocialization(i) {
    const e = i.protocols.find((r) => r.seed_key === "socialization");
    if (!e) return n`<section><p class="muted">Geen socialisatieprogramma. Stel een thuiskomstdatum in.</p></section>`;
    const t = 5, s = this._currentSocWeek(e), o = Array.from({ length: t }, () => []);
    for (const r of e.steps) {
      const a = Math.min(t - 1, Math.max(0, Math.floor(r.day_offset / 7)));
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
          ${o.map((r, a) => this._renderSocWeek(i, e, r, a, s, t))}
        </div>
      </section>
    `;
  }
  _renderSocWeek(i, e, t, s, o, r) {
    const a = t.filter((l) => l.done_at).length, c = o === s;
    return n`
      <div class="week-card ${c ? "current" : ""}">
        <div class="week-head">
          <div>
            <strong>Week ${s + 1}</strong>
            <small class="muted">${7 + s}-${8 + s} wk</small>
            ${c ? n`<span class="badge">Nu</span>` : d}
          </div>
          <span class="week-progress">${a}/${t.length}</span>
        </div>
        <div class="week-items">
          ${t.length === 0 ? n`<div class="muted small">Geen activiteiten deze week.</div>` : d}
          ${t.map((l) => this._renderSocItem(i, e, l, s, r))}
        </div>
        ${this._socAddWeek === s ? n`<div class="inline-form">
              <label class="fld grow">Activiteit<input id="sa-title" type="text" placeholder="bv. Trein horen" /></label>
              <label class="fld">Categorie<select id="sa-cat">${this._socCatOptions(i, "omgeving")}</select></label>
              <button class="primary" @click=${() => this._submitSocAdd(e, s)}>Toevoegen</button>
              <button class="link" @click=${() => this._socAddWeek = void 0}>Annuleer</button>
            </div>` : n`<button class="link add-week" @click=${() => this._socAddWeek = s}>+ activiteit</button>`}
      </div>
    `;
  }
  _renderSocItem(i, e, t, s, o) {
    const r = i.socialization_categories[t.category];
    return this._editStep === t.id ? n`
        <div class="soc-item editing">
          <input id="es-title" type="text" .value=${t.title} placeholder="activiteit" />
          <input id="es-notes" type="text" .value=${t.notes} placeholder="notitie (optioneel)" />
          <input id="es-date" type="hidden" .value=${t.effective_date ?? ""} />
          <label class="fld">Categorie<select id="es-cat">${this._socCatOptions(i, t.category)}</select></label>
          <div class="soc-edit-row">
            <span class="wk-move">
              Week:
              <button class="iconbtn" title="Vorige week" ?disabled=${s === 0} @click=${() => this._moveStepWeek(t, -1)}>←</button>
              <button class="iconbtn" title="Volgende week" ?disabled=${s === o - 1} @click=${() => this._moveStepWeek(t, 1)}>→</button>
            </span>
            <span class="spacer"></span>
            <button class="link danger" @click=${() => this._removeStep(t.id)}>Verwijderen</button>
            <button class="primary" @click=${() => this._submitStepEdit(t, e)}>Opslaan</button>
            <button class="link" @click=${() => this._editStep = void 0}>Annuleer</button>
          </div>
        </div>
      ` : n`
      <div class="soc-item ${t.done_at ? "done" : ""}" style="--rc:${r?.color ?? "#888"}">
        <input type="checkbox" .checked=${!!t.done_at} @change=${() => this._toggleStep(t)} />
        <span class="day-chip" title=${this._fmt(t.effective_date)}>${this._dayLabel(t.effective_date)}</span>
        <span class="cat-dot" style="background:${r?.color ?? "#888"}" title=${r?.label ?? ""}></span>
        <span class="soc-item-main">
          <span class="soc-item-title">${t.title}</span>
          ${t.notes ? n`<span class="soc-item-note">${t.notes}</span>` : d}
        </span>
        <button class="icon-link edit-btn" title="Bewerken" @click=${() => this._editStep = t.id}><ha-icon icon="mdi:pencil"></ha-icon></button>
      </div>
    `;
  }
  // ---- Tab: Schema's -----------------------------------------------------
  _renderSchedules(i) {
    const e = i.protocols.filter((t) => t.seed_key !== "socialization");
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
      (t) => n`
                  <div class="task ${t.done_at ? "done" : ""}">
                    <input type="checkbox" .checked=${!!t.done_at} @change=${() => this._toggleTask(t)} />
                    <span class="task-main">
                      <span class="task-title">${t.title}</span>
                      ${t.date ? n`<span class="task-date">${this._fmt(t.date)}</span>` : d}
                    </span>
                    ${this._confirm?.kind === "task" && this._confirm.id === t.id ? n`<span class="confirm">Zeker?
                          <button class="link danger" @click=${() => this._removeTask(t.id)}>Ja</button>
                          <button class="link" @click=${() => this._confirm = void 0}>Nee</button></span>` : n`<button class="link danger" @click=${() => this._confirm = { kind: "task", id: t.id }}>×</button>`}
                  </div>
                `
    )}
            </div>` : d}

        ${e.map(
      (t) => n`
            <div class="proto">
              ${this._editProto === t.id ? n`<div class="inline-form">
                    <label class="fld grow">Naam<input id="ep-name" type="text" .value=${t.name} /></label>
                    <label class="fld">Startdatum<input id="ep-start" type="date" .value=${t.start_date ?? ""} /></label>
                    <label class="fld grow">Omschrijving<input id="ep-notes" type="text" .value=${t.notes} placeholder="Waar gaat dit schema over?" /></label>
                    <button class="primary" @click=${() => this._submitProtoEdit(t)}>Opslaan</button>
                    <button class="link" @click=${() => this._editProto = void 0}>Annuleer</button>
                  </div>` : n`
                    <div class="proto-head">
                      <strong>${t.name}</strong>
                      <span>
                        <button class="icon-link" title="Bewerken" @click=${() => this._editProto = t.id}><ha-icon icon="mdi:pencil"></ha-icon></button>
                        <button class="link" @click=${() => {
        this._stepForm = this._stepForm === t.id ? void 0 : t.id;
      }}>+ Stap</button>
                        ${this._confirm?.kind === "protocol" && this._confirm.id === t.id ? n`<span class="confirm">Zeker?
                              <button class="link danger" @click=${() => this._removeProtocol(t.id)}>Ja</button>
                              <button class="link" @click=${() => this._confirm = void 0}>Nee</button></span>` : n`<button class="link danger" @click=${() => this._confirm = { kind: "protocol", id: t.id }}>Verwijderen</button>`}
                      </span>
                    </div>
                    ${t.notes ? n`<div class="proto-note">${t.notes}</div>` : d}
                  `}
              ${this._stepForm === t.id ? n`<div class="inline-form">
                    <label class="fld grow">Titel<input id="ns-title" type="text" placeholder="Titel van de stap" /></label>
                    <label class="fld">Datum<input id="ns-date" type="date" .value=${this._nextStepDate(t, i.today)} /></label>
                    <button class="primary" @click=${() => this._submitStep(t)}>Toevoegen</button>
                    <button class="link" @click=${() => this._stepForm = void 0}>Annuleer</button>
                  </div>` : d}
              <div class="steps">
                ${t.steps.map(
        (s) => this._editStep === s.id ? n`
                        <div class="step editing">
                          <input id="es-title" type="text" .value=${s.title} placeholder="titel" />
                          <input id="es-date" type="date" .value=${s.effective_date ?? ""} />
                          <input id="es-notes" type="text" .value=${s.notes} placeholder="notitie (optioneel)" />
                          <button class="primary" @click=${() => this._submitStepEdit(s, t)}>Opslaan</button>
                          <button class="link" @click=${() => this._editStep = void 0}>Annuleer</button>
                        </div>
                      ` : n`
                        <div class="step ${this._isToday(s.effective_date) ? "today" : ""} ${s.done_at ? "done" : ""}">
                          <input type="checkbox" .checked=${!!s.done_at} @change=${() => this._toggleStep(s)} />
                          <span class="step-date">${this._fmt(s.effective_date)}</span>
                          <span class="step-title">${s.title}</span>
                          <button class="icon-link" title="Bewerken" @click=${() => this._editStep = s.id}><ha-icon icon="mdi:pencil"></ha-icon></button>
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
    const e = i.puppy;
    return n`
      <section>
        <h2>Configuratie</h2>
        <div class="settings">
          <div class="photo-field">
            <div class="photo-preview">
              ${e?.photo_url ? n`<img src=${e.photo_url} alt="foto van ${e.name}" />` : n`<ha-icon icon="mdi:dog"></ha-icon>`}
            </div>
            <div class="photo-actions">
              <label class="filebtn">
                Foto kiezen…
                <input type="file" accept="image/*" @change=${this._onPhotoFile} hidden />
              </label>
              ${e?.photo_url ? n`<button class="link danger" @click=${() => this._savePhoto("")}>Verwijderen</button>` : d}
              <div class="muted small">Wordt automatisch verkleind en opgeslagen.</div>
            </div>
          </div>
          <label>Naam<input type="text" id="name" .value=${e?.name ?? ""} /></label>
          <label>Geboortedatum<input type="date" id="birth" .value=${e?.birth_date ?? ""} /></label>
          <label>Thuiskomstdatum<input type="date" id="home" .value=${e?.homecoming_date ?? ""} /></label>
          <button class="primary" @click=${this._saveConfig}>Opslaan</button>
          <p class="muted">Bij het wijzigen van de thuiskomstdatum schuift het socialisatie- en benchschema automatisch mee.</p>
        </div>
      </section>
    `;
  }
};
f.styles = ye`
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
], f.prototype, "hass", 2);
_([
  G({ attribute: !1 })
], f.prototype, "narrow", 2);
_([
  b()
], f.prototype, "_state", 2);
_([
  b()
], f.prototype, "_error", 2);
_([
  b()
], f.prototype, "_tab", 2);
_([
  b()
], f.prototype, "_defer", 2);
_([
  b()
], f.prototype, "_taskForm", 2);
_([
  b()
], f.prototype, "_protoForm", 2);
_([
  b()
], f.prototype, "_stepForm", 2);
_([
  b()
], f.prototype, "_editStep", 2);
_([
  b()
], f.prototype, "_editProto", 2);
_([
  b()
], f.prototype, "_schedForm", 2);
_([
  b()
], f.prototype, "_editSched", 2);
_([
  b()
], f.prototype, "_socAddWeek", 2);
_([
  b()
], f.prototype, "_confirm", 2);
f = _([
  Le("puppy-tracker-panel")
], f);
export {
  f as PuppyTrackerPanel
};
