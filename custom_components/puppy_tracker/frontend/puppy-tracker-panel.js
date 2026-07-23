/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const M = globalThis, R = M.ShadowRoot && (M.ShadyCSS === void 0 || M.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, L = Symbol(), F = /* @__PURE__ */ new WeakMap();
let ot = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== L) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (R && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = F.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && F.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const lt = (s) => new ot(typeof s == "string" ? s : s + "", void 0, L), dt = (s, ...t) => {
  const e = s.length === 1 ? s[0] : t.reduce((i, o, a) => i + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(o) + s[a + 1], s[0]);
  return new ot(e, s, L);
}, pt = (s, t) => {
  if (R) s.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), o = M.litNonce;
    o !== void 0 && i.setAttribute("nonce", o), i.textContent = e.cssText, s.appendChild(i);
  }
}, K = R ? (s) => s : (s) => s instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return lt(e);
})(s) : s;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: ht, defineProperty: ut, getOwnPropertyDescriptor: mt, getOwnPropertyNames: gt, getOwnPropertySymbols: ft, getPrototypeOf: _t } = Object, D = globalThis, Z = D.trustedTypes, $t = Z ? Z.emptyScript : "", yt = D.reactiveElementPolyfillSupport, S = (s, t) => s, N = { toAttribute(s, t) {
  switch (t) {
    case Boolean:
      s = s ? $t : null;
      break;
    case Object:
    case Array:
      s = s == null ? s : JSON.stringify(s);
  }
  return s;
}, fromAttribute(s, t) {
  let e = s;
  switch (t) {
    case Boolean:
      e = s !== null;
      break;
    case Number:
      e = s === null ? null : Number(s);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(s);
      } catch {
        e = null;
      }
  }
  return e;
} }, I = (s, t) => !ht(s, t), G = { attribute: !0, type: String, converter: N, reflect: !1, useDefault: !1, hasChanged: I };
Symbol.metadata ??= Symbol("metadata"), D.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let b = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = G) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = Symbol(), o = this.getPropertyDescriptor(t, i, e);
      o !== void 0 && ut(this.prototype, t, o);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: o, set: a } = mt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(r) {
      this[e] = r;
    } };
    return { get: o, set(r) {
      const l = o?.call(this);
      a?.call(this, r), this.requestUpdate(t, l, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? G;
  }
  static _$Ei() {
    if (this.hasOwnProperty(S("elementProperties"))) return;
    const t = _t(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(S("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(S("properties"))) {
      const e = this.properties, i = [...gt(e), ...ft(e)];
      for (const o of i) this.createProperty(o, e[o]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [i, o] of e) this.elementProperties.set(i, o);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, i] of this.elementProperties) {
      const o = this._$Eu(e, i);
      o !== void 0 && this._$Eh.set(o, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const o of i) e.unshift(K(o));
    } else t !== void 0 && e.push(K(t));
    return e;
  }
  static _$Eu(t, e) {
    const i = e.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof t == "string" ? t.toLowerCase() : void 0;
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
    for (const i of e.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return pt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, e, i) {
    this._$AK(t, i);
  }
  _$ET(t, e) {
    const i = this.constructor.elementProperties.get(t), o = this.constructor._$Eu(t, i);
    if (o !== void 0 && i.reflect === !0) {
      const a = (i.converter?.toAttribute !== void 0 ? i.converter : N).toAttribute(e, i.type);
      this._$Em = t, a == null ? this.removeAttribute(o) : this.setAttribute(o, a), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const i = this.constructor, o = i._$Eh.get(t);
    if (o !== void 0 && this._$Em !== o) {
      const a = i.getPropertyOptions(o), r = typeof a.converter == "function" ? { fromAttribute: a.converter } : a.converter?.fromAttribute !== void 0 ? a.converter : N;
      this._$Em = o;
      const l = r.fromAttribute(e, a.type);
      this[o] = l ?? this._$Ej?.get(o) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, o = !1, a) {
    if (t !== void 0) {
      const r = this.constructor;
      if (o === !1 && (a = this[t]), i ??= r.getPropertyOptions(t), !((i.hasChanged ?? I)(a, e) || i.useDefault && i.reflect && a === this._$Ej?.get(t) && !this.hasAttribute(r._$Eu(t, i)))) return;
      this.C(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: o, wrapped: a }, r) {
    i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, r ?? e ?? this[t]), a !== !0 || r !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), o === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
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
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [o, a] of i) {
        const { wrapped: r } = a, l = this[o];
        r !== !0 || this._$AL.has(o) || l === void 0 || this.C(o, void 0, a, l);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), this._$EO?.forEach((i) => i.hostUpdate?.()), this.update(e)) : this._$EM();
    } catch (i) {
      throw t = !1, this._$EM(), i;
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
b.elementStyles = [], b.shadowRootOptions = { mode: "open" }, b[S("elementProperties")] = /* @__PURE__ */ new Map(), b[S("finalized")] = /* @__PURE__ */ new Map(), yt?.({ ReactiveElement: b }), (D.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const B = globalThis, Y = (s) => s, O = B.trustedTypes, Q = O ? O.createPolicy("lit-html", { createHTML: (s) => s }) : void 0, at = "$lit$", f = `lit$${Math.random().toFixed(9).slice(2)}$`, rt = "?" + f, vt = `<${rt}>`, v = document, T = () => v.createComment(""), P = (s) => s === null || typeof s != "object" && typeof s != "function", q = Array.isArray, bt = (s) => q(s) || typeof s?.[Symbol.iterator] == "function", j = `[ 	
\f\r]`, A = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, X = /-->/g, tt = />/g, $ = RegExp(`>|${j}(?:([^\\s"'>=/]+)(${j}*=${j}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), et = /'/g, st = /"/g, nt = /^(?:script|style|textarea|title)$/i, xt = (s) => (t, ...e) => ({ _$litType$: s, strings: t, values: e }), n = xt(1), x = Symbol.for("lit-noChange"), d = Symbol.for("lit-nothing"), it = /* @__PURE__ */ new WeakMap(), y = v.createTreeWalker(v, 129);
function ct(s, t) {
  if (!q(s) || !s.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Q !== void 0 ? Q.createHTML(t) : t;
}
const wt = (s, t) => {
  const e = s.length - 1, i = [];
  let o, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", r = A;
  for (let l = 0; l < e; l++) {
    const c = s[l];
    let h, u, p = -1, m = 0;
    for (; m < c.length && (r.lastIndex = m, u = r.exec(c), u !== null); ) m = r.lastIndex, r === A ? u[1] === "!--" ? r = X : u[1] !== void 0 ? r = tt : u[2] !== void 0 ? (nt.test(u[2]) && (o = RegExp("</" + u[2], "g")), r = $) : u[3] !== void 0 && (r = $) : r === $ ? u[0] === ">" ? (r = o ?? A, p = -1) : u[1] === void 0 ? p = -2 : (p = r.lastIndex - u[2].length, h = u[1], r = u[3] === void 0 ? $ : u[3] === '"' ? st : et) : r === st || r === et ? r = $ : r === X || r === tt ? r = A : (r = $, o = void 0);
    const g = r === $ && s[l + 1].startsWith("/>") ? " " : "";
    a += r === A ? c + vt : p >= 0 ? (i.push(h), c.slice(0, p) + at + c.slice(p) + f + g) : c + f + (p === -2 ? l : g);
  }
  return [ct(s, a + (s[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class C {
  constructor({ strings: t, _$litType$: e }, i) {
    let o;
    this.parts = [];
    let a = 0, r = 0;
    const l = t.length - 1, c = this.parts, [h, u] = wt(t, e);
    if (this.el = C.createElement(h, i), y.currentNode = this.el.content, e === 2 || e === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (o = y.nextNode()) !== null && c.length < l; ) {
      if (o.nodeType === 1) {
        if (o.hasAttributes()) for (const p of o.getAttributeNames()) if (p.endsWith(at)) {
          const m = u[r++], g = o.getAttribute(p).split(f), U = /([.?@])?(.*)/.exec(m);
          c.push({ type: 1, index: a, name: U[2], strings: g, ctor: U[1] === "." ? At : U[1] === "?" ? St : U[1] === "@" ? Et : H }), o.removeAttribute(p);
        } else p.startsWith(f) && (c.push({ type: 6, index: a }), o.removeAttribute(p));
        if (nt.test(o.tagName)) {
          const p = o.textContent.split(f), m = p.length - 1;
          if (m > 0) {
            o.textContent = O ? O.emptyScript : "";
            for (let g = 0; g < m; g++) o.append(p[g], T()), y.nextNode(), c.push({ type: 2, index: ++a });
            o.append(p[m], T());
          }
        }
      } else if (o.nodeType === 8) if (o.data === rt) c.push({ type: 2, index: a });
      else {
        let p = -1;
        for (; (p = o.data.indexOf(f, p + 1)) !== -1; ) c.push({ type: 7, index: a }), p += f.length - 1;
      }
      a++;
    }
  }
  static createElement(t, e) {
    const i = v.createElement("template");
    return i.innerHTML = t, i;
  }
}
function w(s, t, e = s, i) {
  if (t === x) return t;
  let o = i !== void 0 ? e._$Co?.[i] : e._$Cl;
  const a = P(t) ? void 0 : t._$litDirective$;
  return o?.constructor !== a && (o?._$AO?.(!1), a === void 0 ? o = void 0 : (o = new a(s), o._$AT(s, e, i)), i !== void 0 ? (e._$Co ??= [])[i] = o : e._$Cl = o), o !== void 0 && (t = w(s, o._$AS(s, t.values), o, i)), t;
}
class kt {
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
    const { el: { content: e }, parts: i } = this._$AD, o = (t?.creationScope ?? v).importNode(e, !0);
    y.currentNode = o;
    let a = y.nextNode(), r = 0, l = 0, c = i[0];
    for (; c !== void 0; ) {
      if (r === c.index) {
        let h;
        c.type === 2 ? h = new z(a, a.nextSibling, this, t) : c.type === 1 ? h = new c.ctor(a, c.name, c.strings, this, t) : c.type === 6 && (h = new Tt(a, this, t)), this._$AV.push(h), c = i[++l];
      }
      r !== c?.index && (a = y.nextNode(), r++);
    }
    return y.currentNode = v, o;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
class z {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, i, o) {
    this.type = 2, this._$AH = d, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = o, this._$Cv = o?.isConnected ?? !0;
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
    t = w(this, t, e), P(t) ? t === d || t == null || t === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : t !== this._$AH && t !== x && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : bt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== d && P(this._$AH) ? this._$AA.nextSibling.data = t : this.T(v.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: i } = t, o = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = C.createElement(ct(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === o) this._$AH.p(e);
    else {
      const a = new kt(o, this), r = a.u(this.options);
      a.p(e), this.T(r), this._$AH = a;
    }
  }
  _$AC(t) {
    let e = it.get(t.strings);
    return e === void 0 && it.set(t.strings, e = new C(t)), e;
  }
  k(t) {
    q(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, o = 0;
    for (const a of t) o === e.length ? e.push(i = new z(this.O(T()), this.O(T()), this, this.options)) : i = e[o], i._$AI(a), o++;
    o < e.length && (this._$AR(i && i._$AB.nextSibling, o), e.length = o);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const i = Y(t).nextSibling;
      Y(t).remove(), t = i;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class H {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, o, a) {
    this.type = 1, this._$AH = d, this._$AN = void 0, this.element = t, this.name = e, this._$AM = o, this.options = a, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = d;
  }
  _$AI(t, e = this, i, o) {
    const a = this.strings;
    let r = !1;
    if (a === void 0) t = w(this, t, e, 0), r = !P(t) || t !== this._$AH && t !== x, r && (this._$AH = t);
    else {
      const l = t;
      let c, h;
      for (t = a[0], c = 0; c < a.length - 1; c++) h = w(this, l[i + c], e, c), h === x && (h = this._$AH[c]), r ||= !P(h) || h !== this._$AH[c], h === d ? t = d : t !== d && (t += (h ?? "") + a[c + 1]), this._$AH[c] = h;
    }
    r && !o && this.j(t);
  }
  j(t) {
    t === d ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class At extends H {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === d ? void 0 : t;
  }
}
class St extends H {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== d);
  }
}
class Et extends H {
  constructor(t, e, i, o, a) {
    super(t, e, i, o, a), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = w(this, t, e, 0) ?? d) === x) return;
    const i = this._$AH, o = t === d && i !== d || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, a = t !== d && (i === d || o);
    o && this.element.removeEventListener(this.name, this, i), a && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Tt {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    w(this, t);
  }
}
const Pt = B.litHtmlPolyfillSupport;
Pt?.(C, z), (B.litHtmlVersions ??= []).push("3.3.3");
const Ct = (s, t, e) => {
  const i = e?.renderBefore ?? t;
  let o = i._$litPart$;
  if (o === void 0) {
    const a = e?.renderBefore ?? null;
    i._$litPart$ = o = new z(t.insertBefore(T(), a), a, void 0, e ?? {});
  }
  return o._$AI(s), o;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const V = globalThis;
class E extends b {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Ct(e, this.renderRoot, this.renderOptions);
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
}
E._$litElement$ = !0, E.finalized = !0, V.litElementHydrateSupport?.({ LitElement: E });
const zt = V.litElementPolyfillSupport;
zt?.({ LitElement: E });
(V.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ut = (s) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(s, t);
  }) : customElements.define(s, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Mt = { attribute: !0, type: String, converter: N, reflect: !1, hasChanged: I }, Nt = (s = Mt, t, e) => {
  const { kind: i, metadata: o } = e;
  let a = globalThis.litPropertyMetadata.get(o);
  if (a === void 0 && globalThis.litPropertyMetadata.set(o, a = /* @__PURE__ */ new Map()), i === "setter" && ((s = Object.create(s)).wrapped = !0), a.set(e.name, s), i === "accessor") {
    const { name: r } = e;
    return { set(l) {
      const c = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(r, c, s, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(r, void 0, s, l), l;
    } };
  }
  if (i === "setter") {
    const { name: r } = e;
    return function(l) {
      const c = this[r];
      t.call(this, l), this.requestUpdate(r, c, s, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function J(s) {
  return (t, e) => typeof e == "object" ? Nt(s, t, e) : ((i, o, a) => {
    const r = o.hasOwnProperty(a);
    return o.constructor.createProperty(a, i), r ? Object.getOwnPropertyDescriptor(o, a) : void 0;
  })(s, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function W(s) {
  return J({ ...s, state: !0, attribute: !1 });
}
var Ot = Object.defineProperty, Dt = Object.getOwnPropertyDescriptor, k = (s, t, e, i) => {
  for (var o = i > 1 ? void 0 : i ? Dt(t, e) : t, a = s.length - 1, r; a >= 0; a--)
    (r = s[a]) && (o = (i ? r(t, e, o) : r(o)) || o);
  return i && o && Ot(t, e, o), o;
};
const Ht = [
  { id: "vandaag", label: "Vandaag" },
  { id: "fases", label: "Fases" },
  { id: "socialisatie", label: "Socialisatie" },
  { id: "schemas", label: "Schema's" },
  { id: "config", label: "Configuratie" }
], jt = new Intl.DateTimeFormat("nl-NL", { weekday: "short", day: "numeric", month: "short" }), Rt = new Intl.DateTimeFormat("nl-NL", { weekday: "long", day: "numeric", month: "short" });
let _ = class extends E {
  constructor() {
    super(...arguments), this.narrow = !1, this._error = "", this._tab = "vandaag", this._loaded = !1;
  }
  connectedCallback() {
    super.connectedCallback(), this._timer = window.setInterval(() => this.requestUpdate(), 1e3);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._timer && window.clearInterval(this._timer);
  }
  updated(s) {
    s.has("hass") && this.hass && !this._loaded && (this._loaded = !0, this._load());
  }
  async _ws(s, t = {}) {
    if (this.hass)
      try {
        return await this.hass.connection.sendMessagePromise({ type: `puppy_tracker/${s}`, ...t });
      } catch (e) {
        this._error = String(e?.message ?? e);
        return;
      }
  }
  async _load() {
    const s = await this._ws("get_state");
    s && s.puppy !== void 0 && (this._state = s);
  }
  _merge(s) {
    !s || !this._state || (this._state = { ...this._state, ...s });
  }
  // ---- Actions -----------------------------------------------------------
  _toggleMenu() {
    this.dispatchEvent(new CustomEvent("hass-toggle-menu", { bubbles: !0, composed: !0 }));
  }
  async _markPee() {
    const s = await this._ws("mark_pee");
    s && s.puppy !== void 0 && (this._state = s);
  }
  async _snoozePee() {
    const s = await this._ws("snooze_pee", { minutes: 30 });
    s && s.puppy !== void 0 && (this._state = s);
  }
  async _toggleDaily(s, t) {
    const e = await this._ws("toggle_daily_check", { item_key: s, done: t });
    e && this._merge({ daily_checks: e.daily_checks });
  }
  async _clearToday() {
    const s = await this._ws("clear_daily_checks");
    s && this._merge({ daily_checks: s.daily_checks });
  }
  async _toggleStep(s) {
    const t = await this._ws("set_step_done", { step_id: s.id, done: !s.done_at });
    t && this._merge({ protocols: t.protocols });
  }
  async _deferStep(s) {
    const t = window.prompt("Hoeveel dagen uitstellen? (negatief = vervroegen)", "1");
    if (t === null) return;
    const e = parseInt(t, 10);
    if (Number.isNaN(e) || e === 0) return;
    const i = await this._ws("defer_step", { step_id: s.id, days: e });
    i && this._merge({ protocols: i.protocols });
  }
  async _toggleTask(s) {
    const t = await this._ws("set_task_done", { task_id: s.id, done: !s.done_at });
    t && this._merge({ tasks: t.tasks });
  }
  async _removeTask(s) {
    if (!window.confirm(`Taak "${s.title}" verwijderen?`)) return;
    const t = await this._ws("remove_task", { task_id: s.id });
    t && this._merge({ tasks: t.tasks });
  }
  async _addTask() {
    const s = window.prompt("Titel van de taak (bv. Dierenarts)");
    if (!s) return;
    const t = window.prompt("Datum (JJJJ-MM-DD), leeg = geen datum", this._state?.today ?? ""), e = await this._ws("add_task", { title: s, date: t || null });
    e && this._merge({ tasks: e.tasks });
  }
  async _addProtocol() {
    const s = window.prompt("Naam van het schema");
    if (!s) return;
    const t = window.prompt("Startdatum (JJJJ-MM-DD)", this._state?.today ?? ""), e = await this._ws("add_protocol", { name: s, anchor: "fixed", start_date: t || null });
    e && this._merge({ protocols: e.protocols });
  }
  async _addStep(s) {
    const t = window.prompt("Titel van de stap");
    if (!t) return;
    const e = window.prompt("Dag-offset t.o.v. startdatum", String(s.steps.length)), i = await this._ws("add_step", { protocol_id: s.id, title: t, day_offset: parseInt(e ?? "0", 10) || 0 });
    i && this._merge({ protocols: i.protocols });
  }
  async _removeProtocol(s) {
    if (!window.confirm(`Schema "${s.name}" verwijderen?`)) return;
    const t = await this._ws("remove_protocol", { protocol_id: s.id });
    t && this._merge({ protocols: t.protocols });
  }
  async _saveConfig() {
    const s = (e) => this.renderRoot.querySelector(e)?.value ?? "", t = await this._ws("update_puppy", {
      name: s("#name"),
      birth_date: s("#birth") || null,
      homecoming_date: s("#home") || null,
      photo_url: s("#photo")
    });
    t && t.puppy !== void 0 && (this._state = t);
  }
  // ---- Derived helpers ---------------------------------------------------
  _fmt(s) {
    return s ? jt.format(/* @__PURE__ */ new Date(s + "T00:00:00")) : "";
  }
  _isToday(s) {
    return !!s && s === this._state?.today;
  }
  _isPast(s) {
    return !!s && !!this._state && s < this._state.today;
  }
  _isNight(s) {
    const t = this._state;
    return s >= t.night.start || s < t.night.end;
  }
  _ageText() {
    const s = this._state?.age_days;
    if (s == null) return "leeftijd onbekend";
    const t = Math.floor(s / 7), e = s % 7;
    return `${t} ${t === 1 ? "week" : "weken"} & ${e} ${e === 1 ? "dag" : "dagen"} oud`;
  }
  _countdown() {
    const s = this._state?.next_pee;
    if (!s) return "";
    const t = Math.max(0, Math.round((new Date(s.at).getTime() - Date.now()) / 1e3)), e = Math.floor(t / 3600), i = Math.floor(t % 3600 / 60);
    return e > 0 ? `over ${e} u ${i} min` : `over ${i} min`;
  }
  _restToday() {
    return this._state?.protocols.find((t) => t.seed_key === "socialization")?.steps.find((t) => this._isToday(t.effective_date) && t.category === "rust");
  }
  _todaySteps() {
    const s = [];
    for (const t of this._state?.protocols ?? [])
      for (const e of t.steps) this._isToday(e.effective_date) && s.push({ protocol: t, step: e });
    return s;
  }
  _todayTasks() {
    return (this._state?.tasks ?? []).filter((s) => this._isToday(s.date));
  }
  _upcoming() {
    const s = this._state;
    if (!s) return [];
    const t = /* @__PURE__ */ new Date(s.today + "T00:00:00");
    t.setDate(t.getDate() + 7);
    const e = t.toISOString().slice(0, 10), i = (a) => !!a && a >= s.today && a < e, o = [];
    for (const a of s.tasks)
      i(a.date) && o.push({ date: a.date, color: "var(--primary-color)", icon: "mdi:calendar-check", title: a.title });
    for (const a of s.protocols)
      for (const r of a.steps) {
        if (!i(r.effective_date)) continue;
        const l = s.socialization_categories[r.category];
        o.push({
          date: r.effective_date,
          color: l?.color ?? "var(--primary-color)",
          icon: l?.icon ?? "mdi:flag-outline",
          title: a.seed_key === "socialization" ? r.title : `${r.title} — ${a.name}`,
          step: r
        });
      }
    return o.sort((a, r) => a.date < r.date ? -1 : a.date > r.date ? 1 : 0), o;
  }
  // ---- Render ------------------------------------------------------------
  render() {
    const s = this._state;
    return n`
      <div class="app">
        ${this._renderHeader()}
        ${this._error ? n`<div class="err">${this._error}</div>` : d}
        <div class="content">
          ${s ? this._renderTab(s) : n`<div class="loading">Laden…</div>`}
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
        ${Ht.map(
      (s) => n`<button class="tab ${this._tab === s.id ? "active" : ""}" @click=${() => this._tab = s.id}>${s.label}</button>`
    )}
      </div>
    `;
  }
  _renderTab(s) {
    switch (this._tab) {
      case "fases":
        return this._renderPhases(s);
      case "socialisatie":
        return this._renderSocialization(s);
      case "schemas":
        return this._renderSchedules(s);
      case "config":
        return this._renderConfig(s);
      default:
        return this._renderToday(s);
    }
  }
  // ---- Tab: Vandaag ------------------------------------------------------
  _renderToday(s) {
    return n`
      ${this._renderHero(s)}
      <div class="cols ${this.narrow ? "narrow" : ""}">
        <div class="col-main">${this._renderDaySchedule(s)}</div>
        <div class="col-side">${this._renderUpcoming()}</div>
      </div>
    `;
  }
  _renderHero(s) {
    const t = s.phase, e = s.puppy?.photo_url;
    return n`
      <div class="hero">
        <div class="hero-photo">
          ${e ? n`<img src=${e} alt="foto" />` : n`<ha-icon icon="mdi:dog"></ha-icon>`}
        </div>
        <div class="hero-body">
          <div class="hero-name">${s.puppy?.name ?? "Puppy"}</div>
          <div class="hero-age">${this._ageText()}</div>
          ${t ? n`
                <div class="hero-phase">
                  <span class="dot green"></span>
                  <strong>${t.title}</strong>
                  <small>(${t.week_start}-${t.week_end} wkn)</small>
                </div>
                <div class="hero-focus">Focus: ${t.focus.join(" · ")}</div>
              ` : n`<div class="hero-focus">Stel een geboortedatum in bij Configuratie.</div>`}
          ${s.walk_minutes != null ? n`<div class="hero-rule">🐾 Berner-regel: 5-minutenregel — richtlijn ~${s.walk_minutes} min wandelen.</div>` : d}
          ${s.in_fear_period ? n`<div class="hero-fear">⚠ Angstperiode: nieuwe prikkels positief en rustig opbouwen.</div>` : d}
          <div class="pee">
            <span class="pee-text">
              Volgende plaspauze:
              <strong>${s.next_pee ? new Date(s.next_pee.at).toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" }) : "—"}</strong>
              ${s.next_pee ? n`<em>${this._countdown()} · ${s.next_pee.interval_hours}u interval</em>` : d}
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
  _renderDaySchedule(s) {
    const t = new Set(s.daily_checks), e = this._restToday(), i = this._todaySteps(), o = this._todayTasks();
    return n`
      <section>
        <div class="sec-head">
          <h2><ha-icon icon="mdi:clock-outline"></ha-icon> Dagschema & taken (vandaag)</h2>
          <button class="ghost" @click=${this._clearToday}>Wis vandaag</button>
        </div>
        ${e ? n`<div class="rest-banner">💥 Rustdag — ${e.title}</div>` : d}
        <div class="schedule">
          ${s.daily_schedule.map((a) => {
      const r = s.schedule_types[a.type], l = this._isNight(a.time), c = t.has(a.key);
      return n`
              <label class="row ${l ? "night" : ""} ${c ? "checked" : ""}" style="--rc:${r?.color ?? "#888"}">
                <span class="time">${a.time}</span>
                <span class="bar"></span>
                <span class="row-main">
                  <span class="row-title">${a.label}</span>
                  ${a.note ? n`<span class="row-note">${a.note}</span>` : d}
                </span>
                <input type="checkbox" .checked=${c}
                  @change=${(h) => this._toggleDaily(a.key, h.target.checked)} />
              </label>
            `;
    })}
        </div>

        ${i.length || o.length ? n`
              <div class="subhead">Taken & schema-stappen vandaag</div>
              <div class="today-items">
                ${o.map(
      (a) => n`
                    <label class="row ${a.done_at ? "checked" : ""}" style="--rc:var(--primary-color)">
                      <ha-icon icon="mdi:calendar-check"></ha-icon>
                      <span class="row-main"><span class="row-title">${a.title}</span></span>
                      <input type="checkbox" .checked=${!!a.done_at} @change=${() => this._toggleTask(a)} />
                    </label>
                  `
    )}
                ${i.map(
      ({ protocol: a, step: r }) => n`
                    <label class="row ${r.done_at ? "checked" : ""}" style="--rc:#a05ac0">
                      <ha-icon icon="mdi:flag-outline"></ha-icon>
                      <span class="row-main">
                        <span class="row-title">${r.title}</span>
                        <span class="row-note">${a.name}</span>
                      </span>
                      <button class="link" @click=${() => this._deferStep(r)}>Uitstellen…</button>
                      <input type="checkbox" .checked=${!!r.done_at} @change=${() => this._toggleStep(r)} />
                    </label>
                  `
    )}
              </div>
            ` : d}
      </section>
    `;
  }
  _renderUpcoming() {
    const s = this._upcoming();
    let t = "";
    return n`
      <section>
        <h2><ha-icon icon="mdi:calendar-star"></ha-icon> Belangrijke gebeurtenissen (deze week)</h2>
        ${s.length === 0 ? n`<p class="muted">Niets gepland deze week.</p>` : d}
        <div class="events">
          ${s.map((e) => {
      const i = e.date !== t;
      return t = e.date, n`
              ${i ? n`<div class="ev-date">${Rt.format(/* @__PURE__ */ new Date(e.date + "T00:00:00"))}</div>` : d}
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
  _renderPhases(s) {
    return n`
      <section>
        <h2>Fases</h2>
        ${s.phases.map((t) => {
      const e = s.phase?.key === t.key;
      return n`
            <details class="phase" ?open=${e}>
              <summary>
                <span>${t.title} <small>(${t.week_start}-${t.week_end} wkn)</small></span>
                ${e ? n`<span class="badge">Nu</span>` : d}
              </summary>
              <div class="phase-body">
                <ul class="focus">${t.focus.map((i) => n`<li>${i}</li>`)}</ul>
                <div class="cards">
                  ${t.info_cards.map(
        (i) => n`
                      <div class="info-card">
                        <h4><ha-icon icon=${i.icon}></ha-icon> ${i.title}</h4>
                        <ul>${i.items.map((o) => n`<li>${o}</li>`)}</ul>
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
  _renderSocialization(s) {
    const t = s.protocols.find((e) => e.seed_key === "socialization");
    return t ? n`
      <section>
        <h2>Socialisatie <small class="muted">(7-12 weken · vanaf thuiskomst)</small></h2>
        <div class="legend">
          ${Object.entries(s.socialization_categories).map(
      ([, e]) => n`<span class="tag"><span class="dot" style="background:${e.color}"></span>${e.label}</span>`
    )}
        </div>
        <div class="socia">${t.steps.map((e) => this._renderSocDay(s, e))}</div>
      </section>
    ` : n`<section><p class="muted">Geen socialisatieprogramma. Stel een thuiskomstdatum in.</p></section>`;
  }
  _renderSocDay(s, t) {
    const e = s.socialization_categories[t.category], i = this._isToday(t.effective_date), o = this._isPast(t.effective_date);
    return n`
      <div class="soc-day ${i ? "today" : ""} ${o ? "past" : ""} ${t.done_at ? "done" : ""}"
        style="border-left-color:${e?.color ?? "#888"}">
        <div class="soc-top">
          <span class="soc-date">${this._fmt(t.effective_date)}</span>
          <input type="checkbox" .checked=${!!t.done_at} @change=${() => this._toggleStep(t)} />
        </div>
        <div class="soc-act">${t.title}</div>
        ${t.notes ? n`<div class="soc-note">${t.notes}</div>` : d}
        <button class="link" @click=${() => this._deferStep(t)}>Uitstellen…</button>
      </div>
    `;
  }
  // ---- Tab: Schema's -----------------------------------------------------
  _renderSchedules(s) {
    const t = s.protocols.filter((e) => e.seed_key !== "socialization");
    return n`
      <section>
        <div class="sec-head">
          <h2>Schema's & taken</h2>
          <span>
            <button class="ghost" @click=${this._addTask}>+ Taak</button>
            <button class="ghost" @click=${this._addProtocol}>+ Schema</button>
          </span>
        </div>

        ${s.tasks.length ? n`<div class="tasks">
              ${s.tasks.map(
      (e) => n`
                  <div class="task ${e.done_at ? "done" : ""}">
                    <input type="checkbox" .checked=${!!e.done_at} @change=${() => this._toggleTask(e)} />
                    <span class="task-main">
                      <span class="task-title">${e.title}</span>
                      ${e.date ? n`<span class="task-date">${this._fmt(e.date)}</span>` : d}
                    </span>
                    <button class="link danger" @click=${() => this._removeTask(e)}>×</button>
                  </div>
                `
    )}
            </div>` : d}

        ${t.map(
      (e) => n`
            <div class="proto">
              <div class="proto-head">
                <strong>${e.name}</strong>
                <span>
                  <button class="link" @click=${() => this._addStep(e)}>+ Stap</button>
                  <button class="link danger" @click=${() => this._removeProtocol(e)}>Verwijderen</button>
                </span>
              </div>
              ${e.notes ? n`<div class="proto-note">${e.notes}</div>` : d}
              <div class="steps">
                ${e.steps.map(
        (i) => n`
                    <div class="step ${this._isToday(i.effective_date) ? "today" : ""} ${i.done_at ? "done" : ""}">
                      <input type="checkbox" .checked=${!!i.done_at} @change=${() => this._toggleStep(i)} />
                      <span class="step-date">${this._fmt(i.effective_date)}</span>
                      <span class="step-title">${i.title}</span>
                      <button class="link" @click=${() => this._deferStep(i)}>Uitstellen…</button>
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
  _renderConfig(s) {
    const t = s.puppy;
    return n`
      <section>
        <h2>Configuratie</h2>
        <div class="settings">
          <label>Naam<input type="text" id="name" .value=${t?.name ?? ""} /></label>
          <label>Geboortedatum<input type="date" id="birth" .value=${t?.birth_date ?? ""} /></label>
          <label>Thuiskomstdatum<input type="date" id="home" .value=${t?.homecoming_date ?? ""} /></label>
          <label>Foto-URL (optioneel)<input type="text" id="photo" placeholder="https://… of /local/beer.jpg" .value=${t?.photo_url ?? ""} /></label>
          <button class="primary" @click=${this._saveConfig}>Opslaan</button>
          <p class="muted">Bij het wijzigen van de thuiskomstdatum schuift het socialisatie- en benchschema automatisch mee.</p>
        </div>
      </section>
    `;
  }
};
_.styles = dt`
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

    /* Config */
    .settings { display: flex; flex-direction: column; gap: 10px; max-width: 360px; }
    .settings label { display: flex; flex-direction: column; font-size: .85rem; gap: 4px; }
    .settings input { padding: 8px; border-radius: 8px; border: 1px solid var(--divider-color, #ccc); background: var(--card-background-color); color: inherit; }
  `;
k([
  J({ attribute: !1 })
], _.prototype, "hass", 2);
k([
  J({ attribute: !1 })
], _.prototype, "narrow", 2);
k([
  W()
], _.prototype, "_state", 2);
k([
  W()
], _.prototype, "_error", 2);
k([
  W()
], _.prototype, "_tab", 2);
_ = k([
  Ut("puppy-tracker-panel")
], _);
export {
  _ as PuppyTrackerPanel
};
