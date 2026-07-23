/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const I = globalThis, J = I.ShadowRoot && (I.ShadyCSS === void 0 || I.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, K = Symbol(), se = /* @__PURE__ */ new WeakMap();
let fe = class {
  constructor(e, t, s) {
    if (this._$cssResult$ = !0, s !== K) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (J && e === void 0) {
      const s = t !== void 0 && t.length === 1;
      s && (e = se.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), s && se.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const xe = (i) => new fe(typeof i == "string" ? i : i + "", void 0, K), $e = (i, ...e) => {
  const t = i.length === 1 ? i[0] : e.reduce((s, o, r) => s + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(o) + i[r + 1], i[0]);
  return new fe(t, i, K);
}, ke = (i, e) => {
  if (J) i.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const s = document.createElement("style"), o = I.litNonce;
    o !== void 0 && s.setAttribute("nonce", o), s.textContent = t.cssText, i.appendChild(s);
  }
}, oe = J ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const s of e.cssRules) t += s.cssText;
  return xe(t);
})(i) : i;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: we, defineProperty: Se, getOwnPropertyDescriptor: Ae, getOwnPropertyNames: Te, getOwnPropertySymbols: Ee, getPrototypeOf: Pe } = Object, W = globalThis, re = W.trustedTypes, ze = re ? re.emptyScript : "", De = W.reactiveElementPolyfillSupport, O = (i, e) => i, B = { toAttribute(i, e) {
  switch (e) {
    case Boolean:
      i = i ? ze : null;
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
} }, Z = (i, e) => !we(i, e), ae = { attribute: !0, type: String, converter: B, reflect: !1, useDefault: !1, hasChanged: Z };
Symbol.metadata ??= Symbol("metadata"), W.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let E = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = ae) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const s = Symbol(), o = this.getPropertyDescriptor(e, s, t);
      o !== void 0 && Se(this.prototype, e, o);
    }
  }
  static getPropertyDescriptor(e, t, s) {
    const { get: o, set: r } = Ae(this.prototype, e) ?? { get() {
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
    return this.elementProperties.get(e) ?? ae;
  }
  static _$Ei() {
    if (this.hasOwnProperty(O("elementProperties"))) return;
    const e = Pe(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(O("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(O("properties"))) {
      const t = this.properties, s = [...Te(t), ...Ee(t)];
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
      for (const o of s) t.unshift(oe(o));
    } else e !== void 0 && t.push(oe(e));
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
    return ke(e, this.constructor.elementStyles), e;
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
      const r = (s.converter?.toAttribute !== void 0 ? s.converter : B).toAttribute(t, s.type);
      this._$Em = e, r == null ? this.removeAttribute(o) : this.setAttribute(o, r), this._$Em = null;
    }
  }
  _$AK(e, t) {
    const s = this.constructor, o = s._$Eh.get(e);
    if (o !== void 0 && this._$Em !== o) {
      const r = s.getPropertyOptions(o), a = typeof r.converter == "function" ? { fromAttribute: r.converter } : r.converter?.fromAttribute !== void 0 ? r.converter : B;
      this._$Em = o;
      const c = a.fromAttribute(t, r.type);
      this[o] = c ?? this._$Ej?.get(o) ?? c, this._$Em = null;
    }
  }
  requestUpdate(e, t, s, o = !1, r) {
    if (e !== void 0) {
      const a = this.constructor;
      if (o === !1 && (r = this[e]), s ??= a.getPropertyOptions(e), !((s.hasChanged ?? Z)(r, t) || s.useDefault && s.reflect && r === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, s)))) return;
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
E.elementStyles = [], E.shadowRootOptions = { mode: "open" }, E[O("elementProperties")] = /* @__PURE__ */ new Map(), E[O("finalized")] = /* @__PURE__ */ new Map(), De?.({ ReactiveElement: E }), (W.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const G = globalThis, ne = (i) => i, q = G.trustedTypes, le = q ? q.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, ge = "$lit$", k = `lit$${Math.random().toFixed(9).slice(2)}$`, _e = "?" + k, Ce = `<${_e}>`, A = document, M = () => A.createComment(""), U = (i) => i === null || typeof i != "object" && typeof i != "function", Q = Array.isArray, Oe = (i) => Q(i) || typeof i?.[Symbol.iterator] == "function", Y = `[ 	
\f\r]`, D = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ce = /-->/g, de = />/g, w = RegExp(`>|${Y}(?:([^\\s"'>=/]+)(${Y}*=${Y}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), pe = /'/g, he = /"/g, ve = /^(?:script|style|textarea|title)$/i, Re = (i) => (e, ...t) => ({ _$litType$: i, strings: e, values: t }), n = Re(1), x = Symbol.for("lit-noChange"), d = Symbol.for("lit-nothing"), ue = /* @__PURE__ */ new WeakMap(), S = A.createTreeWalker(A, 129);
function be(i, e) {
  if (!Q(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return le !== void 0 ? le.createHTML(e) : e;
}
const Me = (i, e) => {
  const t = i.length - 1, s = [];
  let o, r = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", a = D;
  for (let c = 0; c < t; c++) {
    const l = i[c];
    let p, h, u = -1, b = 0;
    for (; b < l.length && (a.lastIndex = b, h = a.exec(l), h !== null); ) b = a.lastIndex, a === D ? h[1] === "!--" ? a = ce : h[1] !== void 0 ? a = de : h[2] !== void 0 ? (ve.test(h[2]) && (o = RegExp("</" + h[2], "g")), a = w) : h[3] !== void 0 && (a = w) : a === w ? h[0] === ">" ? (a = o ?? D, u = -1) : h[1] === void 0 ? u = -2 : (u = a.lastIndex - h[2].length, p = h[1], a = h[3] === void 0 ? w : h[3] === '"' ? he : pe) : a === he || a === pe ? a = w : a === ce || a === de ? a = D : (a = w, o = void 0);
    const y = a === w && i[c + 1].startsWith("/>") ? " " : "";
    r += a === D ? l + Ce : u >= 0 ? (s.push(p), l.slice(0, u) + ge + l.slice(u) + k + y) : l + k + (u === -2 ? c : y);
  }
  return [be(i, r + (i[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), s];
};
class N {
  constructor({ strings: e, _$litType$: t }, s) {
    let o;
    this.parts = [];
    let r = 0, a = 0;
    const c = e.length - 1, l = this.parts, [p, h] = Me(e, t);
    if (this.el = N.createElement(p, s), S.currentNode = this.el.content, t === 2 || t === 3) {
      const u = this.el.content.firstChild;
      u.replaceWith(...u.childNodes);
    }
    for (; (o = S.nextNode()) !== null && l.length < c; ) {
      if (o.nodeType === 1) {
        if (o.hasAttributes()) for (const u of o.getAttributeNames()) if (u.endsWith(ge)) {
          const b = h[a++], y = o.getAttribute(u).split(k), m = /([.?@])?(.*)/.exec(b);
          l.push({ type: 1, index: r, name: m[2], strings: y, ctor: m[1] === "." ? Ne : m[1] === "?" ? je : m[1] === "@" ? He : V }), o.removeAttribute(u);
        } else u.startsWith(k) && (l.push({ type: 6, index: r }), o.removeAttribute(u));
        if (ve.test(o.tagName)) {
          const u = o.textContent.split(k), b = u.length - 1;
          if (b > 0) {
            o.textContent = q ? q.emptyScript : "";
            for (let y = 0; y < b; y++) o.append(u[y], M()), S.nextNode(), l.push({ type: 2, index: ++r });
            o.append(u[b], M());
          }
        }
      } else if (o.nodeType === 8) if (o.data === _e) l.push({ type: 2, index: r });
      else {
        let u = -1;
        for (; (u = o.data.indexOf(k, u + 1)) !== -1; ) l.push({ type: 7, index: r }), u += k.length - 1;
      }
      r++;
    }
  }
  static createElement(e, t) {
    const s = A.createElement("template");
    return s.innerHTML = e, s;
  }
}
function P(i, e, t = i, s) {
  if (e === x) return e;
  let o = s !== void 0 ? t._$Co?.[s] : t._$Cl;
  const r = U(e) ? void 0 : e._$litDirective$;
  return o?.constructor !== r && (o?._$AO?.(!1), r === void 0 ? o = void 0 : (o = new r(i), o._$AT(i, t, s)), s !== void 0 ? (t._$Co ??= [])[s] = o : t._$Cl = o), o !== void 0 && (e = P(i, o._$AS(i, e.values), o, s)), e;
}
class Ue {
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
    const { el: { content: t }, parts: s } = this._$AD, o = (e?.creationScope ?? A).importNode(t, !0);
    S.currentNode = o;
    let r = S.nextNode(), a = 0, c = 0, l = s[0];
    for (; l !== void 0; ) {
      if (a === l.index) {
        let p;
        l.type === 2 ? p = new j(r, r.nextSibling, this, e) : l.type === 1 ? p = new l.ctor(r, l.name, l.strings, this, e) : l.type === 6 && (p = new Ie(r, this, e)), this._$AV.push(p), l = s[++c];
      }
      a !== l?.index && (r = S.nextNode(), a++);
    }
    return S.currentNode = A, o;
  }
  p(e) {
    let t = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(e, s, t), t += s.strings.length - 2) : s._$AI(e[t])), t++;
  }
}
class j {
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
    e = P(this, e, t), U(e) ? e === d || e == null || e === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : e !== this._$AH && e !== x && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Oe(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== d && U(this._$AH) ? this._$AA.nextSibling.data = e : this.T(A.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: t, _$litType$: s } = e, o = typeof s == "number" ? this._$AC(e) : (s.el === void 0 && (s.el = N.createElement(be(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === o) this._$AH.p(t);
    else {
      const r = new Ue(o, this), a = r.u(this.options);
      r.p(t), this.T(a), this._$AH = r;
    }
  }
  _$AC(e) {
    let t = ue.get(e.strings);
    return t === void 0 && ue.set(e.strings, t = new N(e)), t;
  }
  k(e) {
    Q(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let s, o = 0;
    for (const r of e) o === t.length ? t.push(s = new j(this.O(M()), this.O(M()), this, this.options)) : s = t[o], s._$AI(r), o++;
    o < t.length && (this._$AR(s && s._$AB.nextSibling, o), t.length = o);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    for (this._$AP?.(!1, !0, t); e !== this._$AB; ) {
      const s = ne(e).nextSibling;
      ne(e).remove(), e = s;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class V {
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
    if (r === void 0) e = P(this, e, t, 0), a = !U(e) || e !== this._$AH && e !== x, a && (this._$AH = e);
    else {
      const c = e;
      let l, p;
      for (e = r[0], l = 0; l < r.length - 1; l++) p = P(this, c[s + l], t, l), p === x && (p = this._$AH[l]), a ||= !U(p) || p !== this._$AH[l], p === d ? e = d : e !== d && (e += (p ?? "") + r[l + 1]), this._$AH[l] = p;
    }
    a && !o && this.j(e);
  }
  j(e) {
    e === d ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Ne extends V {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === d ? void 0 : e;
  }
}
class je extends V {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== d);
  }
}
class He extends V {
  constructor(e, t, s, o, r) {
    super(e, t, s, o, r), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = P(this, e, t, 0) ?? d) === x) return;
    const s = this._$AH, o = e === d && s !== d || e.capture !== s.capture || e.once !== s.once || e.passive !== s.passive, r = e !== d && (s === d || o);
    o && this.element.removeEventListener(this.name, this, s), r && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Ie {
  constructor(e, t, s) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    P(this, e);
  }
}
const Fe = G.litHtmlPolyfillSupport;
Fe?.(N, j), (G.litHtmlVersions ??= []).push("3.3.3");
const Le = (i, e, t) => {
  const s = t?.renderBefore ?? e;
  let o = s._$litPart$;
  if (o === void 0) {
    const r = t?.renderBefore ?? null;
    s._$litPart$ = o = new j(e.insertBefore(M(), r), r, void 0, t ?? {});
  }
  return o._$AI(i), o;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const X = globalThis;
let R = class extends E {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Le(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return x;
  }
};
R._$litElement$ = !0, R.finalized = !0, X.litElementHydrateSupport?.({ LitElement: R });
const Be = X.litElementPolyfillSupport;
Be?.({ LitElement: R });
(X.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const qe = (i) => (e, t) => {
  t !== void 0 ? t.addInitializer(() => {
    customElements.define(i, e);
  }) : customElements.define(i, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const We = { attribute: !0, type: String, converter: B, reflect: !1, hasChanged: Z }, Ve = (i = We, e, t) => {
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
function ee(i) {
  return (e, t) => typeof t == "object" ? Ve(i, e, t) : ((s, o, r) => {
    const a = o.hasOwnProperty(r);
    return o.constructor.createProperty(r, s), a ? Object.getOwnPropertyDescriptor(o, r) : void 0;
  })(i, e, t);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function v(i) {
  return ee({ ...i, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const T = { ATTRIBUTE: 1, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4 }, Ye = (i) => (...e) => ({ _$litDirective$: i, values: e });
class Je {
  constructor(e) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(e, t, s) {
    this._$Ct = e, this._$AM = t, this._$Ci = s;
  }
  _$AS(e, t) {
    return this.update(e, t);
  }
  update(e, t) {
    return this.render(...t);
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ke = (i) => i.strings === void 0, Ze = {}, Ge = (i, e = Ze) => i._$AH = e;
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const $ = Ye(class extends Je {
  constructor(i) {
    if (super(i), i.type !== T.PROPERTY && i.type !== T.ATTRIBUTE && i.type !== T.BOOLEAN_ATTRIBUTE) throw Error("The `live` directive is not allowed on child or event bindings");
    if (!Ke(i)) throw Error("`live` bindings can only contain a single expression");
  }
  render(i) {
    return i;
  }
  update(i, [e]) {
    if (e === x || e === d) return e;
    const t = i.element, s = i.name;
    if (i.type === T.PROPERTY) {
      if (e === t[s]) return x;
    } else if (i.type === T.BOOLEAN_ATTRIBUTE) {
      if (!!e === t.hasAttribute(s)) return x;
    } else if (i.type === T.ATTRIBUTE && t.getAttribute(s) === e + "") return x;
    return Ge(i), e;
  }
});
var Qe = Object.defineProperty, Xe = Object.getOwnPropertyDescriptor, g = (i, e, t, s) => {
  for (var o = s > 1 ? void 0 : s ? Xe(e, t) : e, r = i.length - 1, a; r >= 0; r--)
    (a = i[r]) && (o = (s ? a(e, t, o) : a(o)) || o);
  return s && o && Qe(e, t, o), o;
};
const me = [
  { id: "vandaag", label: "Vandaag" },
  { id: "fases", label: "Fases" },
  { id: "socialisatie", label: "Socialisatie" },
  { id: "config", label: "Configuratie" }
], et = new Intl.DateTimeFormat("nl-NL", { weekday: "short", day: "numeric", month: "short" }), tt = new Intl.DateTimeFormat("nl-NL", { weekday: "long", day: "numeric", month: "short" }), it = new Intl.DateTimeFormat("nl-NL", { weekday: "short", day: "numeric" }), F = 7, C = 60;
function L(i, e) {
  let t = i * 60 + e - F * 60;
  return t < 0 && (t += 1440), t;
}
function H(i) {
  const [e, t] = i.split(":").map(Number);
  return L(e, t);
}
let f = class extends R {
  constructor() {
    super(...arguments), this.narrow = !1, this._error = "", this._tab = "vandaag", this._taskForm = !1, this._protoForm = !1, this._loaded = !1, this._didScroll = !1;
  }
  connectedCallback() {
    super.connectedCallback(), this._timer = window.setInterval(() => this.requestUpdate(), 1e3);
    const i = localStorage.getItem("pt-tab");
    i && me.some((e) => e.id === i) && (this._tab = i);
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
        const t = /* @__PURE__ */ new Date(), s = L(t.getHours(), t.getMinutes()) / 60 * C;
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
    const t = this.renderRoot.querySelector("#es-title")?.value.trim(), s = this.renderRoot.querySelector("#es-date")?.value, o = this.renderRoot.querySelector("#es-notes")?.value ?? "", r = this.renderRoot.querySelector("#es-cat"), a = this.renderRoot.querySelector("#es-day");
    if (!t) return;
    const c = this._dateToOffset(e.start_date, s);
    this._editStep = void 0;
    const l = { step_id: i.id, title: t, notes: o };
    a ? l.day_offset = parseInt(a.value, 10) : c !== null && (l.day_offset = c), r && (l.category = r.value);
    const p = await this._ws("update_step", l);
    p && this._merge({ protocols: p.protocols });
  }
  _socCatOptions(i, e) {
    return Object.entries(i.socialization_categories).map(
      ([t, s]) => n`<option value=${t} ?selected=${t === e}>${s.label}</option>`
    );
  }
  _dateForOffset(i, e) {
    if (!i) return null;
    const t = /* @__PURE__ */ new Date(i + "T00:00:00");
    return t.setDate(t.getDate() + e), this._isoLocal(t);
  }
  _weekDayOptions(i, e, t) {
    return Array.from({ length: 7 }, (s, o) => {
      const r = e * 7 + o, a = this._dateForOffset(i.start_date, r), c = a ? this._dayLabel(a) : `Dag ${o + 1}`;
      return n`<option value=${r} ?selected=${r === t}>${c}</option>`;
    });
  }
  async _submitSocAdd(i, e) {
    const t = this.renderRoot.querySelector("#sa-title")?.value.trim(), s = this.renderRoot.querySelector("#sa-cat")?.value ?? "omgeving", o = this.renderRoot.querySelector("#sa-day");
    if (!t) return;
    this._socAddWeek = void 0;
    const r = await this._ws("add_step", {
      protocol_id: i.id,
      title: t,
      category: s,
      day_offset: o ? parseInt(o.value, 10) : e * 7,
      check_mode: "milestone"
    });
    r && this._merge({ protocols: r.protocols });
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
        const a = Math.min(1, 400 / Math.max(o.width, o.height)), c = Math.round(o.width * a), l = Math.round(o.height * a), p = document.createElement("canvas");
        p.width = c, p.height = l;
        const h = p.getContext("2d");
        if (!h) return;
        h.drawImage(o, 0, 0, c, l);
        const u = p.toDataURL("image/jpeg", 0.82);
        this._savePhoto(u);
      }, o.src = s.result;
    }, s.readAsDataURL(t), e.value = "";
  }
  // ---- Derived helpers ---------------------------------------------------
  _fmt(i) {
    return i ? et.format(/* @__PURE__ */ new Date(i + "T00:00:00")) : "";
  }
  _dayLabel(i) {
    return i ? it.format(/* @__PURE__ */ new Date(i + "T00:00:00")) : "";
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
  _countdownTo(i) {
    const e = Math.max(0, Math.round((i.getTime() - Date.now()) / 1e3)), t = Math.floor(e / 3600), s = Math.floor(e % 3600 / 60);
    return t > 0 ? `over ${t} u ${s} min` : `over ${s} min`;
  }
  /** Next pee = the first 'plassen' item in the active-phase schedule after now. */
  _nextPee(i) {
    const t = (i.phase && i.schedules[i.phase.key] || []).filter((h) => h.type === "plassen");
    if (!t.length) return null;
    const s = /* @__PURE__ */ new Date(), o = L(s.getHours(), s.getMinutes()), r = t.map((h) => ({ p: h, mins: H(h.time) })).sort((h, u) => h.mins - u.mins);
    let a = r.find((h) => h.mins > o), c = 0;
    a || (a = r[0], c = 1440);
    const l = new Date(s);
    l.setHours(F, 0, 0, 0), s.getHours() < F && l.setDate(l.getDate() - 1);
    const p = new Date(l.getTime() + (a.mins + c) * 6e4);
    return { time: a.p.time, at: p };
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
        ${me.map(
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
          ${i.in_fear_period ? n`<div class="hero-fear">⚠ Angstperiode: nieuwe prikkels positief en rustig opbouwen.</div>` : d}
          ${(() => {
      const s = this._nextPee(i);
      return n`
              <div class="pee">
                <span class="pee-text">
                  Volgende plaspauze:
                  <strong>${s ? s.time : "—"}</strong>
                  ${s ? n`<em>${this._countdownTo(s.at)}</em>` : d}
                </span>
              </div>
            `;
    })()}
        </div>
      </div>
    `;
  }
  _renderDaySchedule(i) {
    const e = new Set(i.daily_checks), t = this._restToday(), s = this._todaySteps(), o = this._todayTasks(), r = 24 * C, a = /* @__PURE__ */ new Date(), c = L(a.getHours(), a.getMinutes()) / 60 * C, l = i.phase && i.schedules[i.phase.key] || [], p = 26, h = [...l].sort((m, _) => H(m.time) - H(_.time));
    let u = -100;
    const b = h.map((m) => {
      let _ = H(m.time) / 60 * C;
      return _ < u + 2 && (_ = u + 2), u = _ + p, { it: m, top: _ };
    }), y = Array.from({ length: 24 }, (m, _) => {
      const z = (F + _) % 24;
      return { hour: z, night: z >= 22 || z < 6, top: _ * C };
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
      (m) => n`
                <div class="hour-line ${m.night ? "night" : ""}" style="top:${m.top}px">
                  <span class="hour-label">${String(m.hour).padStart(2, "0")}:00</span>
                </div>
              `
    )}
            ${b.map(({ it: m, top: _ }) => {
      const z = i.schedule_types[m.type], te = String(m.id), ie = e.has(te);
      return n`
                <div class="tl-item ${ie ? "checked" : ""}" style="top:${_}px;--rc:${z?.color ?? "#888"}" title=${m.notes || m.label}>
                  <span class="tl-time">${m.time}</span>
                  <span class="tl-label">${m.label}</span>
                  <input type="checkbox" .checked=${ie}
                    @change=${(ye) => this._toggleDaily(te, ye.target.checked)} />
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
      (m) => n`
                    <label class="row ${m.done_at ? "checked" : ""}" style="--rc:var(--primary-color)">
                      <ha-icon icon="mdi:calendar-check"></ha-icon>
                      <span class="row-main"><span class="row-title">${m.title}</span></span>
                      <input type="checkbox" .checked=${!!m.done_at} @change=${() => this._toggleTask(m)} />
                    </label>
                  `
    )}
                ${s.map(
      ({ protocol: m, step: _ }) => n`
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
    let e = "";
    return n`
      <section>
        <h2><ha-icon icon="mdi:calendar-star"></ha-icon> Belangrijke gebeurtenissen (deze week)</h2>
        ${i.length === 0 ? n`<p class="muted">Niets gepland deze week.</p>` : d}
        <div class="events">
          ${i.map((t) => {
      const s = t.date !== e;
      return e = t.date, n`
              ${s ? n`<div class="ev-date">${tt.format(/* @__PURE__ */ new Date(t.date + "T00:00:00"))}</div>` : d}
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
                ${this._editPhase === e.key ? this._renderPhaseEditForm(e) : n`
                      <div class="phase-toolbar">
                        <button class="icon-link" title="Fase bewerken" @click=${() => this._startPhaseEdit(e)}>
                          <ha-icon icon="mdi:pencil"></ha-icon><span class="lbl">Fase bewerken</span>
                        </button>
                      </div>
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
                    `}
                ${this._renderPhaseSchedule(i, e)}
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
      cards: (i.info_cards ?? []).map((e) => ({
        title: e.title,
        icon: e.icon,
        itemsText: (e.items ?? []).join(`
`)
      }))
    };
  }
  _pd(i) {
    this._phaseDraft = { ...this._phaseDraft, ...i };
  }
  _pdCard(i, e) {
    const t = [...this._phaseDraft.cards];
    t[i] = { ...t[i], ...e }, this._phaseDraft = { ...this._phaseDraft, cards: t };
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
      cards: this._phaseDraft.cards.filter((e, t) => t !== i)
    };
  }
  async _submitPhaseEdit(i) {
    const e = this._phaseDraft;
    if (!e) return;
    const t = e.focusText.split(`
`).map((r) => r.trim()).filter(Boolean), s = e.cards.map((r) => ({
      title: r.title.trim(),
      icon: r.icon.trim() || "mdi:information-outline",
      items: r.itemsText.split(`
`).map((a) => a.trim()).filter(Boolean)
    })).filter((r) => r.title || r.items.length);
    this._editPhase = void 0, this._phaseDraft = void 0;
    const o = await this._ws("update_phase", {
      key: i,
      title: e.title,
      week_start: e.week_start,
      week_end: e.week_end,
      pee_interval_hours: e.pee_interval_hours,
      focus: t,
      info_cards: s
    });
    o && o.puppy !== void 0 && (this._state = o);
  }
  _renderPhaseEditForm(i) {
    const e = this._phaseDraft;
    if (!e) return d;
    const t = (s) => s.target.value;
    return n`
      <div class="phase-edit">
        <label class="fld grow">Titel
          <input type="text" .value=${$(e.title)} @input=${(s) => this._pd({ title: t(s) })} />
        </label>
        <div class="row3">
          <label class="fld">Vanaf (wk)
            <input type="number" .value=${$(String(e.week_start))} @input=${(s) => this._pd({ week_start: parseInt(t(s), 10) || 0 })} />
          </label>
          <label class="fld">Tot (wk)
            <input type="number" .value=${$(String(e.week_end))} @input=${(s) => this._pd({ week_end: parseInt(t(s), 10) || 0 })} />
          </label>
          <label class="fld">Plas-interval (u)
            <input type="number" .value=${$(String(e.pee_interval_hours))} @input=${(s) => this._pd({ pee_interval_hours: parseInt(t(s), 10) || 1 })} />
          </label>
        </div>
        <label class="fld grow">Focuspunten (één per regel)
          <textarea rows="4" .value=${$(e.focusText)} @input=${(s) => this._pd({ focusText: s.target.value })}></textarea>
        </label>
        <div class="cards-edit">
          <div class="ce-head"><strong>Info-kaarten</strong><button class="link" @click=${this._pdAddCard}>+ kaart</button></div>
          ${e.cards.map(
      (s, o) => n`
              <div class="ce-card">
                <div class="ce-row">
                  <input type="text" placeholder="Titel" .value=${$(s.title)} @input=${(r) => this._pdCard(o, { title: t(r) })} />
                  <input type="text" placeholder="Icoon (mdi:...)" .value=${$(s.icon)} @input=${(r) => this._pdCard(o, { icon: t(r) })} />
                  <button class="icon-link danger" title="Kaart verwijderen" @click=${() => this._pdRemoveCard(o)}><ha-icon icon="mdi:delete-outline"></ha-icon></button>
                </div>
                <textarea rows="3" placeholder="Punten (één per regel)" .value=${$(s.itemsText)} @input=${(r) => this._pdCard(o, { itemsText: r.target.value })}></textarea>
              </div>
            `
    )}
        </div>
        <div class="phase-edit-actions">
          <button class="primary" @click=${() => this._submitPhaseEdit(i.key)}>Opslaan</button>
          <button class="link" @click=${() => {
      this._editPhase = void 0, this._phaseDraft = void 0;
    }}>Annuleer</button>
        </div>
      </div>
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
    const a = t.filter((p) => p.done_at).length, c = o === s, l = [...t].sort((p, h) => p.day_offset - h.day_offset || p.id - h.id);
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
          ${l.length === 0 ? n`<div class="muted small">Geen activiteiten deze week.</div>` : d}
          ${l.map((p) => this._renderSocItem(i, e, p, s, r))}
        </div>
        ${this._socAddWeek === s ? n`<div class="inline-form">
              <label class="fld grow">Activiteit<input id="sa-title" type="text" placeholder="bv. Trein horen" /></label>
              <label class="fld">Dag<select id="sa-day">${this._weekDayOptions(e, s, s * 7)}</select></label>
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
          <label class="fld">Dag<select id="es-day">${this._weekDayOptions(e, Math.floor(t.day_offset / 7), t.day_offset)}</select></label>
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
      ${this._renderSchedules(i)}
    `;
  }
};
f.styles = $e`
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
g([
  ee({ attribute: !1 })
], f.prototype, "hass", 2);
g([
  ee({ attribute: !1 })
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
], f.prototype, "_confirm", 2);
f = g([
  qe("puppy-tracker-panel")
], f);
export {
  f as PuppyTrackerPanel
};
