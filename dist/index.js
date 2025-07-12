var qa = Object.defineProperty;
var Ga = (r, e, t) => e in r ? qa(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t;
var ce = (r, e, t) => Ga(r, typeof e != "symbol" ? e + "" : e, t);
import * as ke from "react";
import cn, { useMemo as vo, useCallback as se, useRef as Dn, useState as Lr, useEffect as T0 } from "react";
function Ya(r) {
  return crypto.getRandomValues(new Uint8Array(r));
}
function Za(r = 32) {
  return Ya(r);
}
function jr(r) {
  r.fill(0);
}
var Wr = /* @__PURE__ */ ((r) => (r[r.BIG_ENDIAN = 0] = "BIG_ENDIAN", r[r.LITTLE_ENDIAN = 1] = "LITTLE_ENDIAN", r))(Wr || {});
class Pt {
  constructor(e) {
    this.buf = new Uint8Array(e), this.pos = 0, this.byteOrder = 0;
  }
  /**
   * Creates a new ByteBuffer with the given capacity
   */
  static allocate(e) {
    return new Pt(e);
  }
  /**
   * Creates a new ByteBuffer that wraps the given array
   */
  static wrap(e) {
    const t = new Pt(e.length);
    return t.buf.set(e), t;
  }
  /**
   * Sets this buffer's byte order
   */
  order(e) {
    return this.byteOrder = e, this;
  }
  /**
   * Sets or gets this buffer's position
   */
  position(e) {
    if (e === void 0)
      return this.pos;
    if (e < 0 || e > this.buf.length)
      throw new Error("Invalid position, position: " + e + ", length: " + this.buf.length);
    return this.pos = e, this;
  }
  /**
   * Returns this buffer's capacity
   */
  capacity() {
    return this.buf.length;
  }
  /**
   * Writes a byte or bytes into this buffer
   */
  put(e, t, n) {
    if (typeof e == "number") {
      if (this.pos >= this.buf.length)
        throw new Error("Buffer overflow");
      return this.buf[this.pos++] = e & 255, this;
    }
    const o = t || 0, s = n || e.length;
    if (o < 0 || o > e.length)
      throw new Error("Invalid offset");
    if (s < 0 || o + s > e.length)
      throw new Error("Invalid length");
    if (this.pos + s > this.buf.length)
      throw new Error("Buffer overflow");
    return this.buf.set(e.subarray(o, o + s), this.pos), this.pos += s, this;
  }
  /**
   * Writes an integer into this buffer
   */
  putInt(e) {
    if (this.pos + 4 > this.buf.length)
      throw new Error("Buffer overflow");
    return this.byteOrder === 0 ? (this.buf[this.pos++] = e >>> 24 & 255, this.buf[this.pos++] = e >>> 16 & 255, this.buf[this.pos++] = e >>> 8 & 255, this.buf[this.pos++] = e & 255) : (this.buf[this.pos++] = e & 255, this.buf[this.pos++] = e >>> 8 & 255, this.buf[this.pos++] = e >>> 16 & 255, this.buf[this.pos++] = e >>> 24 & 255), this;
  }
  /**
   * Gets bytes from the buffer into the destination array
   */
  get(e) {
    if (this.pos + e.length > this.buf.length)
      throw new Error("Buffer underflow");
    for (let t = 0; t < e.length; t++)
      e[t] = this.buf[this.pos++];
    return this;
  }
  /**
   * Gets a single byte from the buffer
   */
  get_() {
    if (this.pos >= this.buf.length)
      throw new Error("Buffer underflow");
    return this.buf[this.pos++];
  }
  /**
   * Returns a copy of the backing array
   */
  array() {
    return new Uint8Array(this.buf);
  }
  /**
   * Rewinds this buffer. Sets the position to zero
   */
  rewind() {
    return this.pos = 0, this;
  }
}
const wo = "0123456789abcdef";
class We {
  /**
   * Create a copy of a byte array
   */
  static copyOf(e, t) {
    const n = new Uint8Array(t);
    return n.set(e.slice(0, t)), n;
  }
  /**
   * Convert a hexadecimal string to a byte array
   * @param hex The hexadecimal string to convert
   */
  static hexToBytes(e) {
    let t = e.toLowerCase();
    t.startsWith("0x") && (t = t.slice(2)), t.length % 2 !== 0 && (t = "0" + t);
    const n = new Uint8Array(t.length / 2);
    for (let o = 0; o < t.length; o += 2)
      n[o / 2] = parseInt(t.slice(o, o + 2), 16);
    return n;
  }
  /**
   * Compares two byte arrays
   */
  static compareBytes(e, t) {
    if (e.length !== t.length)
      return !1;
    for (let n = 0; n < e.length; n++)
      if (e[n] !== t[n])
        return !1;
    return !0;
  }
  /**
   * Reads little-endian unsigned values from a buffer
   */
  static readLittleEndianUnsigned(e, t = 8) {
    const n = new Uint8Array(t);
    e.get(n);
    let o = 0n;
    for (let s = t - 1; s >= 0; s--)
      o = o << 8n | BigInt(n[s]);
    return o;
  }
  /**
   * Trims address for display
   */
  static trimAddress(e) {
    return `${e.substring(0, 32)}...${e.substring(e.length - 24)}`;
  }
  /**
   * Converts number to little-endian bytes
   */
  static numberToLittleEndian(e, t) {
    const n = new Uint8Array(t);
    let o = e;
    for (let s = 0; s < t; s++)
      n[s] = o & 255, o = o >>> 8;
    return n;
  }
  /**
   * Converts byte array to little-endian
   */
  static bytesToLittleEndian(e) {
    const t = new Uint8Array(e.length);
    for (let n = 0; n < e.length; n++)
      t[n] = e[e.length - 1 - n];
    return t;
  }
  /**
   * Fits byte array or string to specified length
   */
  static fit(e, t) {
    if (typeof e == "string") {
      const s = BigInt(e), c = new Uint8Array(t);
      let a = s;
      for (let l = 0; l < t; l++)
        c[l] = Number(a & 0xffn), a >>= 8n;
      return c;
    }
    const n = new Uint8Array(t), o = Math.min(e.length, t);
    return n.set(e.subarray(0, o)), n;
  }
  /**
   * Convert a byte array to its hexadecimal string representation
   * @param bytes The byte array to convert
   * @param offset Optional starting offset in the byte array
   * @param length Optional number of bytes to convert
   */
  static bytesToHex(e, t = 0, n = e.length) {
    const o = new Array(n * 2);
    for (let s = 0; s < n; s++) {
      const c = e[s + t] & 255;
      o[s * 2] = wo[c >>> 4], o[s * 2 + 1] = wo[c & 15];
    }
    return o.join("");
  }
  /**
   * Convert a number to a byte array of specified length
   * @param value The number to convert
   * @param length The desired length of the resulting byte array
   */
  static toBytes(e, t) {
    const n = e.toString(16).padStart(t * 2, "0");
    return We.hexToBytes(n);
  }
  /**
   * Convert a byte array to little-endian format
   * @param value The byte array to convert
   * @param offset Optional starting offset
   * @param length Optional number of bytes to convert
   */
  static toLittleEndian(e, t = 0, n = e.length) {
    const o = new Uint8Array(n);
    o.set(e.slice(t, t + n));
    for (let s = 0; s < o.length >> 1; s++) {
      const c = o[s];
      o[s] = o[o.length - s - 1], o[o.length - s - 1] = c;
    }
    return o;
  }
  /**
   * Clear a byte array by filling it with zeros
   */
  static clear(e) {
    e.fill(0);
  }
  /**
       * Compare two byte arrays for equality
       */
  static areEqual(e, t) {
    if (e.length !== t.length) return !1;
    for (let n = 0; n < e.length; n++)
      if (e[n] !== t[n]) return !1;
    return !0;
  }
}
function bo(r) {
  if (!Number.isSafeInteger(r) || r < 0)
    throw new Error("positive integer expected, got " + r);
}
function Xa(r) {
  return r instanceof Uint8Array || ArrayBuffer.isView(r) && r.constructor.name === "Uint8Array";
}
function Y0(r, ...e) {
  if (!Xa(r))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(r.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + r.length);
}
function Kr(r, e = !0) {
  if (r.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && r.finished)
    throw new Error("Hash#digest() has already been called");
}
function vi(r, e) {
  Y0(r);
  const t = e.outputLen;
  if (r.length < t)
    throw new Error("digestInto() expects output buffer of length at least " + t);
}
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Ja = (r) => new Uint32Array(r.buffer, r.byteOffset, Math.floor(r.byteLength / 4)), Sn = (r) => new DataView(r.buffer, r.byteOffset, r.byteLength), Pe = (r, e) => r << 32 - e | r >>> e, Ar = (r, e) => r << e | r >>> 32 - e >>> 0, mo = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68, Qa = (r) => r << 24 & 4278190080 | r << 8 & 16711680 | r >>> 8 & 65280 | r >>> 24 & 255;
function Eo(r) {
  for (let e = 0; e < r.length; e++)
    r[e] = Qa(r[e]);
}
function ec(r) {
  if (typeof r != "string")
    throw new Error("utf8ToBytes expected string, got " + typeof r);
  return new Uint8Array(new TextEncoder().encode(r));
}
function Z0(r) {
  return typeof r == "string" && (r = ec(r)), Y0(r), r;
}
class wi {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function X0(r) {
  const e = (n) => r().update(Z0(n)).digest(), t = r();
  return e.outputLen = t.outputLen, e.blockLen = t.blockLen, e.create = () => r(), e;
}
function tc(r, e, t, n) {
  if (typeof r.setBigUint64 == "function")
    return r.setBigUint64(e, t, n);
  const o = BigInt(32), s = BigInt(4294967295), c = Number(t >> o & s), a = Number(t & s), l = n ? 4 : 0, i = n ? 0 : 4;
  r.setUint32(e + l, c, n), r.setUint32(e + i, a, n);
}
const rc = (r, e, t) => r & e ^ ~r & t, nc = (r, e, t) => r & e ^ r & t ^ e & t;
class bi extends wi {
  constructor(e, t, n, o) {
    super(), this.blockLen = e, this.outputLen = t, this.padOffset = n, this.isLE = o, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Sn(this.buffer);
  }
  update(e) {
    Kr(this);
    const { view: t, buffer: n, blockLen: o } = this;
    e = Z0(e);
    const s = e.length;
    for (let c = 0; c < s; ) {
      const a = Math.min(o - this.pos, s - c);
      if (a === o) {
        const l = Sn(e);
        for (; o <= s - c; c += o)
          this.process(l, c);
        continue;
      }
      n.set(e.subarray(c, c + a), this.pos), this.pos += a, c += a, this.pos === o && (this.process(t, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Kr(this), vi(e, this), this.finished = !0;
    const { buffer: t, view: n, blockLen: o, isLE: s } = this;
    let { pos: c } = this;
    t[c++] = 128, this.buffer.subarray(c).fill(0), this.padOffset > o - c && (this.process(n, 0), c = 0);
    for (let h = c; h < o; h++)
      t[h] = 0;
    tc(n, o - 8, BigInt(this.length * 8), s), this.process(n, 0);
    const a = Sn(e), l = this.outputLen;
    if (l % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const i = l / 4, u = this.get();
    if (i > u.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let h = 0; h < i; h++)
      a.setUint32(4 * h, u[h], s);
  }
  digest() {
    const { buffer: e, outputLen: t } = this;
    this.digestInto(e);
    const n = e.slice(0, t);
    return this.destroy(), n;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: t, buffer: n, length: o, finished: s, destroyed: c, pos: a } = this;
    return e.length = o, e.pos = a, e.finished = s, e.destroyed = c, o % t && e.buffer.set(n), e;
  }
}
const oc = /* @__PURE__ */ new Uint32Array([
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
]), rt = /* @__PURE__ */ new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), nt = /* @__PURE__ */ new Uint32Array(64);
class sc extends bi {
  constructor() {
    super(64, 32, 8, !1), this.A = rt[0] | 0, this.B = rt[1] | 0, this.C = rt[2] | 0, this.D = rt[3] | 0, this.E = rt[4] | 0, this.F = rt[5] | 0, this.G = rt[6] | 0, this.H = rt[7] | 0;
  }
  get() {
    const { A: e, B: t, C: n, D: o, E: s, F: c, G: a, H: l } = this;
    return [e, t, n, o, s, c, a, l];
  }
  // prettier-ignore
  set(e, t, n, o, s, c, a, l) {
    this.A = e | 0, this.B = t | 0, this.C = n | 0, this.D = o | 0, this.E = s | 0, this.F = c | 0, this.G = a | 0, this.H = l | 0;
  }
  process(e, t) {
    for (let h = 0; h < 16; h++, t += 4)
      nt[h] = e.getUint32(t, !1);
    for (let h = 16; h < 64; h++) {
      const d = nt[h - 15], f = nt[h - 2], x = Pe(d, 7) ^ Pe(d, 18) ^ d >>> 3, w = Pe(f, 17) ^ Pe(f, 19) ^ f >>> 10;
      nt[h] = w + nt[h - 7] + x + nt[h - 16] | 0;
    }
    let { A: n, B: o, C: s, D: c, E: a, F: l, G: i, H: u } = this;
    for (let h = 0; h < 64; h++) {
      const d = Pe(a, 6) ^ Pe(a, 11) ^ Pe(a, 25), f = u + d + rc(a, l, i) + oc[h] + nt[h] | 0, x = (Pe(n, 2) ^ Pe(n, 13) ^ Pe(n, 22)) + nc(n, o, s) | 0;
      u = i, i = l, l = a, a = c + f | 0, c = s, s = o, o = n, n = f + x | 0;
    }
    n = n + this.A | 0, o = o + this.B | 0, s = s + this.C | 0, c = c + this.D | 0, a = a + this.E | 0, l = l + this.F | 0, i = i + this.G | 0, u = u + this.H | 0, this.set(n, o, s, c, a, l, i, u);
  }
  roundClean() {
    nt.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
const ic = /* @__PURE__ */ X0(() => new sc()), _r = /* @__PURE__ */ BigInt(2 ** 32 - 1), Ao = /* @__PURE__ */ BigInt(32);
function ac(r, e = !1) {
  return e ? { h: Number(r & _r), l: Number(r >> Ao & _r) } : { h: Number(r >> Ao & _r) | 0, l: Number(r & _r) | 0 };
}
function cc(r, e = !1) {
  let t = new Uint32Array(r.length), n = new Uint32Array(r.length);
  for (let o = 0; o < r.length; o++) {
    const { h: s, l: c } = ac(r[o], e);
    [t[o], n[o]] = [s, c];
  }
  return [t, n];
}
const uc = (r, e, t) => r << t | e >>> 32 - t, lc = (r, e, t) => e << t | r >>> 32 - t, fc = (r, e, t) => e << t - 32 | r >>> 64 - t, dc = (r, e, t) => r << t - 32 | e >>> 64 - t, mi = [], Ei = [], Ai = [], hc = /* @__PURE__ */ BigInt(0), Yt = /* @__PURE__ */ BigInt(1), xc = /* @__PURE__ */ BigInt(2), pc = /* @__PURE__ */ BigInt(7), gc = /* @__PURE__ */ BigInt(256), yc = /* @__PURE__ */ BigInt(113);
for (let r = 0, e = Yt, t = 1, n = 0; r < 24; r++) {
  [t, n] = [n, (2 * t + 3 * n) % 5], mi.push(2 * (5 * n + t)), Ei.push((r + 1) * (r + 2) / 2 % 64);
  let o = hc;
  for (let s = 0; s < 7; s++)
    e = (e << Yt ^ (e >> pc) * yc) % gc, e & xc && (o ^= Yt << (Yt << /* @__PURE__ */ BigInt(s)) - Yt);
  Ai.push(o);
}
const [vc, wc] = /* @__PURE__ */ cc(Ai, !0), _o = (r, e, t) => t > 32 ? fc(r, e, t) : uc(r, e, t), Bo = (r, e, t) => t > 32 ? dc(r, e, t) : lc(r, e, t);
function bc(r, e = 24) {
  const t = new Uint32Array(10);
  for (let n = 24 - e; n < 24; n++) {
    for (let c = 0; c < 10; c++)
      t[c] = r[c] ^ r[c + 10] ^ r[c + 20] ^ r[c + 30] ^ r[c + 40];
    for (let c = 0; c < 10; c += 2) {
      const a = (c + 8) % 10, l = (c + 2) % 10, i = t[l], u = t[l + 1], h = _o(i, u, 1) ^ t[a], d = Bo(i, u, 1) ^ t[a + 1];
      for (let f = 0; f < 50; f += 10)
        r[c + f] ^= h, r[c + f + 1] ^= d;
    }
    let o = r[2], s = r[3];
    for (let c = 0; c < 24; c++) {
      const a = Ei[c], l = _o(o, s, a), i = Bo(o, s, a), u = mi[c];
      o = r[u], s = r[u + 1], r[u] = l, r[u + 1] = i;
    }
    for (let c = 0; c < 50; c += 10) {
      for (let a = 0; a < 10; a++)
        t[a] = r[c + a];
      for (let a = 0; a < 10; a++)
        r[c + a] ^= ~t[(a + 2) % 10] & t[(a + 4) % 10];
    }
    r[0] ^= vc[n], r[1] ^= wc[n];
  }
  t.fill(0);
}
class J0 extends wi {
  // NOTE: we accept arguments in bytes instead of bits here.
  constructor(e, t, n, o = !1, s = 24) {
    if (super(), this.blockLen = e, this.suffix = t, this.outputLen = n, this.enableXOF = o, this.rounds = s, this.pos = 0, this.posOut = 0, this.finished = !1, this.destroyed = !1, bo(n), 0 >= this.blockLen || this.blockLen >= 200)
      throw new Error("Sha3 supports only keccak-f1600 function");
    this.state = new Uint8Array(200), this.state32 = Ja(this.state);
  }
  keccak() {
    mo || Eo(this.state32), bc(this.state32, this.rounds), mo || Eo(this.state32), this.posOut = 0, this.pos = 0;
  }
  update(e) {
    Kr(this);
    const { blockLen: t, state: n } = this;
    e = Z0(e);
    const o = e.length;
    for (let s = 0; s < o; ) {
      const c = Math.min(t - this.pos, o - s);
      for (let a = 0; a < c; a++)
        n[this.pos++] ^= e[s++];
      this.pos === t && this.keccak();
    }
    return this;
  }
  finish() {
    if (this.finished)
      return;
    this.finished = !0;
    const { state: e, suffix: t, pos: n, blockLen: o } = this;
    e[n] ^= t, t & 128 && n === o - 1 && this.keccak(), e[o - 1] ^= 128, this.keccak();
  }
  writeInto(e) {
    Kr(this, !1), Y0(e), this.finish();
    const t = this.state, { blockLen: n } = this;
    for (let o = 0, s = e.length; o < s; ) {
      this.posOut >= n && this.keccak();
      const c = Math.min(n - this.posOut, s - o);
      e.set(t.subarray(this.posOut, this.posOut + c), o), this.posOut += c, o += c;
    }
    return e;
  }
  xofInto(e) {
    if (!this.enableXOF)
      throw new Error("XOF is not possible for this instance");
    return this.writeInto(e);
  }
  xof(e) {
    return bo(e), this.xofInto(new Uint8Array(e));
  }
  digestInto(e) {
    if (vi(e, this), this.finished)
      throw new Error("digest() was already called");
    return this.writeInto(e), this.destroy(), e;
  }
  digest() {
    return this.digestInto(new Uint8Array(this.outputLen));
  }
  destroy() {
    this.destroyed = !0, this.state.fill(0);
  }
  _cloneInto(e) {
    const { blockLen: t, suffix: n, outputLen: o, rounds: s, enableXOF: c } = this;
    return e || (e = new J0(t, n, o, c, s)), e.state32.set(this.state32), e.pos = this.pos, e.posOut = this.posOut, e.finished = this.finished, e.rounds = s, e.suffix = n, e.outputLen = o, e.enableXOF = c, e.destroyed = this.destroyed, e;
  }
}
const mc = (r, e, t) => X0(() => new J0(e, r, t)), Ec = /* @__PURE__ */ mc(6, 72, 512 / 8), Ac = /* @__PURE__ */ new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), _i = /* @__PURE__ */ new Uint8Array(new Array(16).fill(0).map((r, e) => e)), _c = /* @__PURE__ */ _i.map((r) => (9 * r + 5) % 16);
let Q0 = [_i], eo = [_c];
for (let r = 0; r < 4; r++)
  for (let e of [Q0, eo])
    e.push(e[r].map((t) => Ac[t]));
const Bi = /* @__PURE__ */ [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((r) => new Uint8Array(r)), Bc = /* @__PURE__ */ Q0.map((r, e) => r.map((t) => Bi[e][t])), Cc = /* @__PURE__ */ eo.map((r, e) => r.map((t) => Bi[e][t])), kc = /* @__PURE__ */ new Uint32Array([
  0,
  1518500249,
  1859775393,
  2400959708,
  2840853838
]), Dc = /* @__PURE__ */ new Uint32Array([
  1352829926,
  1548603684,
  1836072691,
  2053994217,
  0
]);
function Co(r, e, t, n) {
  return r === 0 ? e ^ t ^ n : r === 1 ? e & t | ~e & n : r === 2 ? (e | ~t) ^ n : r === 3 ? e & n | t & ~n : e ^ (t | ~n);
}
const Br = /* @__PURE__ */ new Uint32Array(16);
class Sc extends bi {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: e, h1: t, h2: n, h3: o, h4: s } = this;
    return [e, t, n, o, s];
  }
  set(e, t, n, o, s) {
    this.h0 = e | 0, this.h1 = t | 0, this.h2 = n | 0, this.h3 = o | 0, this.h4 = s | 0;
  }
  process(e, t) {
    for (let f = 0; f < 16; f++, t += 4)
      Br[f] = e.getUint32(t, !0);
    let n = this.h0 | 0, o = n, s = this.h1 | 0, c = s, a = this.h2 | 0, l = a, i = this.h3 | 0, u = i, h = this.h4 | 0, d = h;
    for (let f = 0; f < 5; f++) {
      const x = 4 - f, w = kc[f], v = Dc[f], b = Q0[f], p = eo[f], g = Bc[f], y = Cc[f];
      for (let m = 0; m < 16; m++) {
        const _ = Ar(n + Co(f, s, a, i) + Br[b[m]] + w, g[m]) + h | 0;
        n = h, h = i, i = Ar(a, 10) | 0, a = s, s = _;
      }
      for (let m = 0; m < 16; m++) {
        const _ = Ar(o + Co(x, c, l, u) + Br[p[m]] + v, y[m]) + d | 0;
        o = d, d = u, u = Ar(l, 10) | 0, l = c, c = _;
      }
    }
    this.set(this.h1 + a + u | 0, this.h2 + i + d | 0, this.h3 + h + o | 0, this.h4 + n + c | 0, this.h0 + s + l | 0);
  }
  roundClean() {
    Br.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const Fc = /* @__PURE__ */ X0(() => new Sc());
class Ie {
  constructor(e = "sha256") {
    this.algorithm = e, this.hasher = this.createHasher(e);
  }
  createHasher(e) {
    switch (e.toLowerCase()) {
      case "sha256":
        return ic.create();
      case "sha3-512":
        return Ec.create();
      case "ripemd160":
        return Fc.create();
      default:
        throw new Error(`Unsupported hash algorithm: ${e}`);
    }
  }
  /**
   * Updates the hash with the given data
   */
  update(e, t = 0, n = e.length) {
    if (t < 0 || t > e.length)
      throw new Error("Invalid offset");
    if (n < 0 || t + n > e.length)
      throw new Error("Invalid length");
    const o = e.subarray(t, t + n);
    this.hasher.update(o);
  }
  /**
   * Returns the final hash value
   */
  digest() {
    const e = this.hasher.digest();
    return this.hasher = this.createHasher(this.algorithm), e;
  }
  static hash(e, t, n) {
    const o = new Ie();
    return t !== void 0 && n !== void 0 ? o.update(new Uint8Array(e.subarray(t, t + n))) : o.update(new Uint8Array(e)), o.digest();
  }
  static hashWith(e, t) {
    const n = new Ie(e);
    return n.update(t), n.digest();
  }
}
const R0 = class {
  /**
   * Set chain address in the address buffer
   */
  static setChainAddr(e, t) {
    e.position(20), e.putInt(t);
  }
  /**
   * Set hash address in the address buffer
   */
  static setHashAddr(e, t) {
    e.position(24), e.putInt(t);
  }
  /**
   * Set key and mask in the address buffer
   */
  static setKeyAndMask(e, t) {
    e.position(28), e.putInt(t);
  }
  /**
   * Convert address buffer to bytes in little-endian format
   */
  static addrToBytes(e) {
    e.position(0);
    const t = new Uint8Array(e.capacity());
    for (let n = 0; n < t.length; n += 4) {
      const o = e.get_(), s = e.get_(), c = e.get_(), a = e.get_();
      t[n] = a, t[n + 1] = c, t[n + 2] = s, t[n + 3] = o;
    }
    return t;
  }
  /**
   * PRF function
   */
  static prf(e, t, n, o) {
    const s = new Uint8Array(96), c = new Uint8Array(32);
    c[31] = this.XMSS_HASH_PADDING_PRF, s.set(c, 0), s.set(o, 32), s.set(n, 64);
    const a = new Ie();
    a.update(s);
    const l = a.digest();
    return e.set(l, t), e;
  }
  /**
   * F hash function
   */
  static thashF(e, t, n, o, s, c) {
    const a = new Uint8Array(96), l = new Uint8Array(32);
    l[31] = this.XMSS_HASH_PADDING_F, a.set(l, 0), this.setKeyAndMask(c, 0);
    let i = this.addrToBytes(c);
    this.prf(a, 32, i, s), this.setKeyAndMask(c, 1), i = this.addrToBytes(c);
    const u = new Uint8Array(32);
    this.prf(u, 0, i, s);
    for (let f = 0; f < 32; f++)
      a[64 + f] = n[f + o] ^ u[f];
    const h = new Ie();
    h.update(a);
    const d = h.digest();
    e.set(d, t);
  }
};
R0.XMSS_HASH_PADDING_F = 0, R0.XMSS_HASH_PADDING_PRF = 3;
let Rt = R0;
const Ci = class Jt {
  /**
   * Gets the tag from an address
   */
  static getTag(e) {
    if (e.length !== 2208)
      throw new Error("Invalid address length");
    const t = new Uint8Array(Jt.TAG_LENGTH);
    return t.set(e.subarray(e.length - Jt.TAG_LENGTH)), t;
  }
  /**
   * Checks if a tag is all zeros
   */
  static isZero(e) {
    return !e || e.length !== Jt.TAG_LENGTH ? !1 : e.every((t) => t === 0);
  }
  /**
   * Validates a tag
   */
  static isValid(e) {
    return !(!e || e.length !== Jt.TAG_LENGTH);
  }
  /**
   * Tags an address with the specified tag
   */
  static tag(e, t) {
    if (!this.isValid(t))
      throw new Error("Invalid tag");
    if (e.length !== 2208)
      throw new Error("Invalid address length");
    if (t.length !== 12)
      throw new Error("Invalid tag length");
    const n = new Uint8Array(e);
    return n.set(t, n.length - t.length), n;
  }
};
Ci.TAG_LENGTH = 12;
let ko = Ci;
const Ge = class Le {
  /**
   * Generates chains for WOTS
   */
  static gen_chain(e, t, n, o, s, c, a, l) {
    e.set(n.subarray(o, o + Le.PARAMSN), t);
    for (let i = s; i < s + c && i < 16; i++)
      Rt.setHashAddr(l, i), Rt.thashF(e, t, e, t, a, l);
  }
  /**
   * Expands seed into WOTS private key
   */
  static expand_seed(e, t) {
    for (let n = 0; n < Le.WOTSLEN; n++) {
      const o = We.toBytes(n, 32);
      Rt.prf(e, n * 32, o, t);
    }
  }
  /**
   * Converts message to base w (convenience overload)
   */
  static base_w(e, t) {
    return this.base_w_(e, t, 0, t.length);
  }
  /**
   * Converts message to base w
   */
  static base_w_(e, t, n = 0, o = t.length) {
    let s = 0, c = 0, a = 0, l = 0;
    for (let i = 0; i < o; i++)
      l === 0 && (a = e[s++], l += 8), l -= 4, t[c++ + n] = a >> l & 15;
    return t;
  }
  /**
   * Computes WOTS checksum
   */
  static wotsChecksum(e, t) {
    let n = 0;
    for (let s = 0; s < 64; s++)
      n += 15 - e[s];
    n <<= 4;
    const o = new Uint8Array(2);
    return o[0] = n >> 8 & 255, o[1] = n & 255, this.base_w_(o, e, t, e.length - t);
  }
  /**
   * Computes chain lengths
   */
  static chain_lengths(e, t) {
    const n = this.base_w_(e, t, 0, 64);
    return this.wotsChecksum(n, 64);
  }
  /**
   * Generates WOTS public key
   */
  static wots_pkgen(e, t, n, o, s) {
    this.expand_seed(e, t);
    const c = Pt.wrap(s);
    c.order(Wr.LITTLE_ENDIAN);
    for (let a = 0; a < Le.WOTSLEN; a++)
      Rt.setChainAddr(c, a), this.gen_chain(e, a * 32, e, a * 32, 0, 15, n.subarray(o), c);
  }
  /**
   * Signs a message using WOTS
   */
  static wots_sign(e, t, n, o, s, c) {
    const a = new Array(Le.WOTSLEN);
    this.chain_lengths(t, a), this.expand_seed(e, n);
    const l = Pt.wrap(c);
    l.order(Wr.LITTLE_ENDIAN);
    for (let i = 0; i < Le.WOTSLEN; i++)
      Rt.setChainAddr(l, i), this.gen_chain(e, i * 32, e, i * 32, 0, a[i], o.subarray(s), l);
  }
  /**
   * Verifies a WOTS signature
   */
  static wots_pk_from_sig(e, t, n, o) {
    const s = new Uint8Array(Le.WOTSSIGBYTES), c = new Array(Le.WOTSLEN), a = new Uint8Array(o), l = Pt.wrap(a);
    l.order(Wr.LITTLE_ENDIAN), this.chain_lengths(t, c);
    for (let i = 0; i < Le.WOTSLEN; i++)
      Rt.setChainAddr(l, i), this.gen_chain(s, i * 32, e, i * 32, c[i], 15 - c[i], n, l);
    return s;
  }
  /**
   * Generates a WOTS address using the componentsGenerator. 
   * Note:: use you own componentsGenerator that fills in deterministic bytes if you want to generate a specific address
   */
  static generateAddress(e, t, n) {
    if (!n)
      throw new Error("Invalid componentsGenerator");
    if (t.length !== 32)
      throw new Error("Invalid secret length");
    if (e !== null && e.length !== 12)
      throw new Error("Invalid tag");
    const o = new Uint8Array(2144), s = n(t);
    Le.wots_pkgen(o, s.private_seed, s.public_seed, 0, s.addr_seed);
    const c = new Uint8Array(2208);
    c.set(o, 0), c.set(s.public_seed, 2144), c.set(s.addr_seed, 2176);
    const a = e ? ko.tag(c, e) : c;
    for (let l = 0; l < 10; l++)
      if (!this.isValid(s.private_seed, a, Cr))
        throw new Error("Invalid WOTS");
    return a;
  }
  /**
   * Validates WOTS components
   */
  static isValidWithComponents(e, t, n, o, s) {
    if (e.length !== 32)
      throw new Error("Invalid secret length");
    if (t.length !== 2144)
      throw new Error("Invalid pk length");
    if (n.length !== 32)
      throw new Error("Invalid pubSeed length");
    if (o.length !== 32)
      throw new Error("Invalid rnd2 length");
    const c = new Uint8Array(32);
    s(c);
    const a = new Uint8Array(2144);
    this.wots_sign(a, c, e, n, 0, o);
    const l = this.wots_pk_from_sig(a, c, n, o);
    return We.compareBytes(l, t);
  }
  /**
   * Splits a WOTS address into its components
   */
  static splitAddress(e, t, n, o, s) {
    if (e.length !== 2208)
      throw new Error("Invalid address length");
    if (t.length !== 2144)
      throw new Error("Invalid pk length");
    if (n.length !== 32)
      throw new Error("Invalid pubSeed length");
    if (o.length !== 32)
      throw new Error("Invalid rnd2 length");
    if (s !== null && s.length !== 12)
      throw new Error("Invalid tag length");
    t.set(e.subarray(0, 2144)), n.set(e.subarray(2144, 2176)), o.set(e.subarray(2176, 2208)), s !== null && s.set(o.subarray(20, 32));
  }
  /**
   * Validates a WOTS address using a Random generator
   */
  static isValid(e, t, n = Cr) {
    const o = new Uint8Array(2144), s = new Uint8Array(32), c = new Uint8Array(32);
    return this.splitAddress(t, o, s, c, null), this.isValidWithComponents(e, o, s, c, Cr);
  }
  /**
   * Generates a random WOTS address using the randomGenerator
   * Note:: use you own randomGenerator that fills in deterministic bytes if you want to generate a specific address
   */
  static generateRandomAddress(e, t, n = Cr) {
    if (t.length !== 32)
      throw new Error("Invalid secret length");
    if (e !== null && e.length !== 12)
      throw new Error("Invalid tag");
    const o = new Uint8Array(2208), s = new Uint8Array(32);
    n(o), s.set(o.subarray(2176, 2208)), this.wots_pkgen(o, t, o, 2144, s), o.set(s, 2176);
    const c = e ? ko.tag(o, e) : o;
    for (let a = 0; a < 10; a++)
      if (!this.isValid(t, c, n))
        throw new Error("Invalid WOTS");
    return c;
  }
};
Ge.WOTSW = 16, Ge.WOTSLOGW = 4, Ge.PARAMSN = 32, Ge.WOTSLEN1 = 64, Ge.WOTSLEN2 = 3, Ge.WOTSLEN = 67, Ge.WOTSSIGBYTES = 2144, Ge.TXSIGLEN = 2144;
let re = Ge;
function Cr(r) {
  for (let e = 0; e < r.length; e++)
    r[e] = Math.floor(Math.random() * 256);
}
const me = 40, Ee = 20, Fn = 2144, Tn = 8;
class vt {
  constructor() {
    this.address = new Uint8Array(me), this.amount = BigInt(0);
  }
  bytes() {
    const e = new Uint8Array(me + Tn);
    return e.set(this.address), e.set(this.getAmountBytes(), me), e;
  }
  getTag() {
    return this.address.slice(0, Ee);
  }
  setTag(e) {
    this.address.set(e.slice(0, Ee), 0);
  }
  getAddrHash() {
    return this.address.slice(Ee, me);
  }
  getAddress() {
    return this.address.slice(0, me);
  }
  setAddrHash(e) {
    this.address.set(e.slice(0, Ee), Ee);
  }
  setAmountBytes(e) {
    this.amount = BigInt(
      new DataView(e.buffer).getBigUint64(0, !0)
    );
  }
  getAmount() {
    return this.amount;
  }
  getAmountBytes() {
    const e = new ArrayBuffer(Tn);
    return new DataView(e).setBigUint64(0, this.amount, !0), new Uint8Array(e);
  }
  static wotsAddressFromBytes(e) {
    const t = new vt();
    if (e.length === Fn) {
      const n = this.addrFromWots(e);
      n && (t.setTag(n.slice(0, Ee)), t.setAddrHash(n.slice(Ee, me)));
    } else e.length === me ? (t.setTag(e.slice(0, Ee)), t.setAddrHash(e.slice(Ee, me))) : e.length === me + Tn && (t.setTag(e.slice(0, Ee)), t.setAddrHash(e.slice(Ee, me)), t.setAmountBytes(e.slice(me)));
    return t;
  }
  static wotsAddressFromHex(e) {
    const t = Buffer.from(e, "hex");
    return t.length !== me ? new vt() : this.wotsAddressFromBytes(t);
  }
  static addrFromImplicit(e) {
    const t = new Uint8Array(me);
    return t.set(e.slice(0, Ee), 0), t.set(e.slice(0, me - Ee), Ee), t;
  }
  static addrHashGenerate(e) {
    const t = Ie.hashWith("sha3-512", e);
    return Ie.hashWith("ripemd160", t);
  }
  static addrFromWots(e) {
    if (e.length !== Fn)
      return null;
    const t = this.addrHashGenerate(e.slice(0, Fn));
    return this.addrFromImplicit(t);
  }
}
const Tc = [
  0,
  4129,
  8258,
  12387,
  16516,
  20645,
  24774,
  28903,
  33032,
  37161,
  41290,
  45419,
  49548,
  53677,
  57806,
  61935,
  4657,
  528,
  12915,
  8786,
  21173,
  17044,
  29431,
  25302,
  37689,
  33560,
  45947,
  41818,
  54205,
  50076,
  62463,
  58334,
  9314,
  13379,
  1056,
  5121,
  25830,
  29895,
  17572,
  21637,
  42346,
  46411,
  34088,
  38153,
  58862,
  62927,
  50604,
  54669,
  13907,
  9842,
  5649,
  1584,
  30423,
  26358,
  22165,
  18100,
  46939,
  42874,
  38681,
  34616,
  63455,
  59390,
  55197,
  51132,
  18628,
  22757,
  26758,
  30887,
  2112,
  6241,
  10242,
  14371,
  51660,
  55789,
  59790,
  63919,
  35144,
  39273,
  43274,
  47403,
  23285,
  19156,
  31415,
  27286,
  6769,
  2640,
  14899,
  10770,
  56317,
  52188,
  64447,
  60318,
  39801,
  35672,
  47931,
  43802,
  27814,
  31879,
  19684,
  23749,
  11298,
  15363,
  3168,
  7233,
  60846,
  64911,
  52716,
  56781,
  44330,
  48395,
  36200,
  40265,
  32407,
  28342,
  24277,
  20212,
  15891,
  11826,
  7761,
  3696,
  65439,
  61374,
  57309,
  53244,
  48923,
  44858,
  40793,
  36728,
  37256,
  33193,
  45514,
  41451,
  53516,
  49453,
  61774,
  57711,
  4224,
  161,
  12482,
  8419,
  20484,
  16421,
  28742,
  24679,
  33721,
  37784,
  41979,
  46042,
  49981,
  54044,
  58239,
  62302,
  689,
  4752,
  8947,
  13010,
  16949,
  21012,
  25207,
  29270,
  46570,
  42443,
  38312,
  34185,
  62830,
  58703,
  54572,
  50445,
  13538,
  9411,
  5280,
  1153,
  29798,
  25671,
  21540,
  17413,
  42971,
  47098,
  34713,
  38840,
  59231,
  63358,
  50973,
  55100,
  9939,
  14066,
  1681,
  5808,
  26199,
  30326,
  17941,
  22068,
  55628,
  51565,
  63758,
  59695,
  39368,
  35305,
  47498,
  43435,
  22596,
  18533,
  30726,
  26663,
  6336,
  2273,
  14466,
  10403,
  52093,
  56156,
  60223,
  64286,
  35833,
  39896,
  43963,
  48026,
  19061,
  23124,
  27191,
  31254,
  2801,
  6864,
  10931,
  14994,
  64814,
  60687,
  56684,
  52557,
  48554,
  44427,
  40424,
  36297,
  31782,
  27655,
  23652,
  19525,
  15522,
  11395,
  7392,
  3265,
  61215,
  65342,
  53085,
  57212,
  44955,
  49082,
  36825,
  40952,
  28183,
  32310,
  20053,
  24180,
  11923,
  16050,
  3793,
  7920
];
function Rc(r, e, t) {
  if (e + t > r.length)
    throw new Error("Offset + length exceeds array bounds");
  let n = 0;
  for (let o = e; o < e + t; o++) {
    const s = r[o] & 255, c = (n >>> 8 ^ s) & 255;
    n = (n << 8 ^ Tc[c]) & 65535;
  }
  return n;
}
function Oc(r) {
  if (r.length >= 255)
    throw new TypeError("Alphabet too long");
  const e = new Uint8Array(256);
  for (let i = 0; i < e.length; i++)
    e[i] = 255;
  for (let i = 0; i < r.length; i++) {
    const u = r.charAt(i), h = u.charCodeAt(0);
    if (e[h] !== 255)
      throw new TypeError(u + " is ambiguous");
    e[h] = i;
  }
  const t = r.length, n = r.charAt(0), o = Math.log(t) / Math.log(256), s = Math.log(256) / Math.log(t);
  function c(i) {
    if (i instanceof Uint8Array || (ArrayBuffer.isView(i) ? i = new Uint8Array(i.buffer, i.byteOffset, i.byteLength) : Array.isArray(i) && (i = Uint8Array.from(i))), !(i instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (i.length === 0)
      return "";
    let u = 0, h = 0, d = 0;
    const f = i.length;
    for (; d !== f && i[d] === 0; )
      d++, u++;
    const x = (f - d) * s + 1 >>> 0, w = new Uint8Array(x);
    for (; d !== f; ) {
      let p = i[d], g = 0;
      for (let y = x - 1; (p !== 0 || g < h) && y !== -1; y--, g++)
        p += 256 * w[y] >>> 0, w[y] = p % t >>> 0, p = p / t >>> 0;
      if (p !== 0)
        throw new Error("Non-zero carry");
      h = g, d++;
    }
    let v = x - h;
    for (; v !== x && w[v] === 0; )
      v++;
    let b = n.repeat(u);
    for (; v < x; ++v)
      b += r.charAt(w[v]);
    return b;
  }
  function a(i) {
    if (typeof i != "string")
      throw new TypeError("Expected String");
    if (i.length === 0)
      return new Uint8Array();
    let u = 0, h = 0, d = 0;
    for (; i[u] === n; )
      h++, u++;
    const f = (i.length - u) * o + 1 >>> 0, x = new Uint8Array(f);
    for (; i[u]; ) {
      let p = e[i.charCodeAt(u)];
      if (p === 255)
        return;
      let g = 0;
      for (let y = f - 1; (p !== 0 || g < d) && y !== -1; y--, g++)
        p += t * x[y] >>> 0, x[y] = p % 256 >>> 0, p = p / 256 >>> 0;
      if (p !== 0)
        throw new Error("Non-zero carry");
      d = g, u++;
    }
    let w = f - d;
    for (; w !== f && x[w] === 0; )
      w++;
    const v = new Uint8Array(h + (f - w));
    let b = h;
    for (; w !== f; )
      v[b++] = x[w++];
    return v;
  }
  function l(i) {
    const u = a(i);
    if (u)
      return u;
    throw new Error("Non-base" + t + " character");
  }
  return {
    encode: c,
    decodeUnsafe: a,
    decode: l
  };
}
var Ic = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const Nc = Oc(Ic);
function Hc(r) {
  if (!r) return null;
  if (r.length !== 20) throw new Error("Invalid address tag length");
  const e = Rc(r, 0, 20), t = new Uint8Array(22);
  t.set(r);
  const n = [e & 255, e >> 8 & 255];
  return t.set(n, r.length), Nc.encode(t);
}
let wt = class ki {
  /**
   * Creates a new WOTS wallet
   */
  constructor({
    name: e = null,
    wots: t = null,
    addrTag: n = null,
    secret: o = null
  }) {
    var s;
    if (o && o.length !== 32)
      throw new Error("Invalid secret length");
    if (n && n.length !== 20)
      throw new Error("Invalid address tag");
    this.name = e, this.wots = t ? new Uint8Array(t) : null, this.addrTag = n ? new Uint8Array(n) : null, this.secret = o ? new Uint8Array(o) : null, this.wotsAddrHex = this.wots ? We.bytesToHex(this.wots) : null, this.addrTagHex = this.addrTag ? We.bytesToHex(this.addrTag) : null, this.mochimoAddr = this.wots ? vt.wotsAddressFromBytes(this.wots.slice(0, 2144)) : null, (s = this.mochimoAddr) == null || s.setTag(this.addrTag);
  }
  getName() {
    return this.name;
  }
  /**
   * Get the full wots address (2208 bytes)
   * @returns 
   */
  getWots() {
    return this.wots ? new Uint8Array(this.wots) : null;
  }
  /**
  * Get the hex string of the full wots address
  */
  getWotsHex() {
    return this.wotsAddrHex;
  }
  /**
   * Get the wots public key (2144 bytes)
   */
  getWotsPk() {
    return this.wots ? new Uint8Array(this.wots.slice(0, re.WOTSSIGBYTES)) : null;
  }
  /**
  * Get the public seed used when generating the wots address
  */
  getWotsPubSeed() {
    return this.wots ? this.wots.subarray(re.WOTSSIGBYTES, re.WOTSSIGBYTES + 32) : null;
  }
  /**
  * Get the wots+ address scheme used when generating the address
  */
  getWotsAdrs() {
    return this.wots ? this.wots.subarray(re.WOTSSIGBYTES + 32, re.WOTSSIGBYTES + 64) : null;
  }
  /**
   * Get the wots+ tag used when generating the address
   */
  getWotsTag() {
    return this.wots ? this.wots.subarray(re.WOTSSIGBYTES + 64 - 12, re.WOTSSIGBYTES + 64) : null;
  }
  /**
   * Get the 40 byte mochimo address [20 bytes tag + 20 bytes address]
   */
  getAddress() {
    return this.mochimoAddr ? this.mochimoAddr.bytes().slice(0, 40) : null;
  }
  /**
   * Get the address tag (20 bytes)
   */
  getAddrTag() {
    return this.addrTag ? new Uint8Array(this.addrTag) : null;
  }
  getAddrTagHex() {
    return this.addrTagHex;
  }
  getAddrTagBase58() {
    return this.addrTag ? Hc(this.getAddrTag()) : null;
  }
  /**
   * Get the address hash of mochimo address (20 bytes)
   */
  getAddrHash() {
    return this.mochimoAddr ? this.mochimoAddr.getAddrHash() : null;
  }
  getSecret() {
    return this.secret ? new Uint8Array(this.secret) : null;
  }
  hasSecret() {
    return this.secret !== null;
  }
  /**
   * Sign data using the secret key
   */
  sign(e) {
    const t = this.secret, n = this.wots;
    if (!t || !n)
      throw new Error("Cannot sign without secret key or address");
    if (t.length !== 32)
      throw new Error("Invalid sourceSeed length, expected 32, got " + t.length);
    if (n.length !== 2208)
      throw new Error("Invalid sourceWots length, expected 2208, got " + n.length);
    n.subarray(0, re.WOTSSIGBYTES);
    const o = n.subarray(re.WOTSSIGBYTES, re.WOTSSIGBYTES + 32), s = n.subarray(re.WOTSSIGBYTES + 32, re.WOTSSIGBYTES + 64), c = new Uint8Array(re.WOTSSIGBYTES);
    return re.wots_sign(c, e, t, o, 0, s), c;
  }
  /**
   * Verifies whether a signature is valid for a given message
   */
  verify(e, t) {
    if (!this.wots)
      throw new Error("Cannot verify without public key (address)");
    const n = this.wots, o = n.subarray(0, re.WOTSSIGBYTES), s = n.subarray(re.WOTSSIGBYTES, re.WOTSSIGBYTES + 32), c = n.subarray(re.WOTSSIGBYTES + 32, re.WOTSSIGBYTES + 64), a = re.wots_pk_from_sig(t, e, s, c);
    return We.areEqual(a, o);
  }
  /**
   * Address components generator used for generating address components for pk generation
   * @param wotsSeed 
   * @returns 
   */
  static componentsGenerator(e) {
    const t = Buffer.from(e).toString("ascii"), n = Ie.hash(Buffer.from(t + "seed", "ascii")), o = Ie.hash(Buffer.from(t + "publ", "ascii")), s = Ie.hash(Buffer.from(t + "addr", "ascii"));
    return {
      private_seed: n,
      public_seed: o,
      addr_seed: s
    };
  }
  clear() {
    this.secret && We.clear(this.secret), this.wots && We.clear(this.wots), this.addrTag && We.clear(this.addrTag), this.addrTagHex && (this.addrTagHex = null), this.wotsAddrHex && (this.wotsAddrHex = null), this.mochimoAddr && (this.mochimoAddr = null);
  }
  toString() {
    let e = "Empty address";
    return this.wotsAddrHex ? e = `${this.wotsAddrHex.substring(0, 32)}...${this.wotsAddrHex.substring(this.wotsAddrHex.length - 24)}` : this.addrTagHex && (e = `tag-${this.addrTagHex}`), e;
  }
  /**
       * Creates a wallet instance
  
       */
  static create(e, t, n, o) {
    if (t.length !== 32)
      throw new Error("Invalid secret length");
    let s = t, c = null;
    const a = Buffer.from("420000000e00000001000000", "hex");
    if (o ? c = re.generateRandomAddress(a, t, o) : ({ private_seed: s } = this.componentsGenerator(t), c = re.generateAddress(a, t, this.componentsGenerator)), c.length !== 2208)
      throw new Error("Invalid sourcePK length");
    let l = n;
    if (l || (l = vt.wotsAddressFromBytes(c.slice(0, 2144)).getTag()), l.length !== 20)
      throw new Error("Invalid tag");
    return new ki({ name: e, wots: c, addrTag: l, secret: s });
  }
  toJSON() {
    return {
      name: this.name,
      wots: this.wots,
      addrTag: this.addrTag,
      secret: this.secret,
      addrTagHex: this.addrTagHex,
      wotsAddrHex: this.wotsAddrHex
    };
  }
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function Pc(r) {
  return r instanceof Uint8Array || ArrayBuffer.isView(r) && r.constructor.name === "Uint8Array";
}
function tr(r) {
  if (!Number.isSafeInteger(r) || r < 0)
    throw new Error("positive integer expected, got " + r);
}
function Lt(r, ...e) {
  if (!Pc(r))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(r.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + r.length);
}
function Di(r) {
  if (typeof r != "function" || typeof r.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  tr(r.outputLen), tr(r.blockLen);
}
function $r(r, e = !0) {
  if (r.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && r.finished)
    throw new Error("Hash#digest() has already been called");
}
function Uc(r, e) {
  Lt(r);
  const t = e.outputLen;
  if (r.length < t)
    throw new Error("digestInto() expects output buffer of length at least " + t);
}
function bt(...r) {
  for (let e = 0; e < r.length; e++)
    r[e].fill(0);
}
function zr(r) {
  return new DataView(r.buffer, r.byteOffset, r.byteLength);
}
function Ue(r, e) {
  return r << 32 - e | r >>> e;
}
const Mc = async () => {
};
async function Lc(r, e, t) {
  let n = Date.now();
  for (let o = 0; o < r; o++) {
    t(o);
    const s = Date.now() - n;
    s >= 0 && s < e || (await Mc(), n += s);
  }
}
function Si(r) {
  if (typeof r != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(r));
}
function to(r) {
  return typeof r == "string" && (r = Si(r)), Lt(r), r;
}
function Do(r) {
  return typeof r == "string" && (r = Si(r)), Lt(r), r;
}
function Wc(r, e) {
  if (e !== void 0 && {}.toString.call(e) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(r, e);
}
class Fi {
}
function Ti(r) {
  const e = (n) => r().update(to(n)).digest(), t = r();
  return e.outputLen = t.outputLen, e.blockLen = t.blockLen, e.create = () => r(), e;
}
class Ri extends Fi {
  constructor(e, t) {
    super(), this.finished = !1, this.destroyed = !1, Di(e);
    const n = to(t);
    if (this.iHash = e.create(), typeof this.iHash.update != "function")
      throw new Error("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const o = this.blockLen, s = new Uint8Array(o);
    s.set(n.length > o ? e.create().update(n).digest() : n);
    for (let c = 0; c < s.length; c++)
      s[c] ^= 54;
    this.iHash.update(s), this.oHash = e.create();
    for (let c = 0; c < s.length; c++)
      s[c] ^= 106;
    this.oHash.update(s), bt(s);
  }
  update(e) {
    return $r(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    $r(this), Lt(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
  }
  digest() {
    const e = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(e), e;
  }
  _cloneInto(e) {
    e || (e = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: t, iHash: n, finished: o, destroyed: s, blockLen: c, outputLen: a } = this;
    return e = e, e.finished = o, e.destroyed = s, e.blockLen = c, e.outputLen = a, e.oHash = t._cloneInto(e.oHash), e.iHash = n._cloneInto(e.iHash), e;
  }
  clone() {
    return this._cloneInto();
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
}
const Oi = (r, e, t) => new Ri(r, e).update(t).digest();
Oi.create = (r, e) => new Ri(r, e);
function zc(r, e, t, n) {
  Di(r);
  const o = Wc({ dkLen: 32, asyncTick: 10 }, n), { c: s, dkLen: c, asyncTick: a } = o;
  if (tr(s), tr(c), tr(a), s < 1)
    throw new Error("iterations (c) should be >= 1");
  const l = Do(e), i = Do(t), u = new Uint8Array(c), h = Oi.create(r, l), d = h._cloneInto().update(i);
  return { c: s, dkLen: c, asyncTick: a, DK: u, PRF: h, PRFSalt: d };
}
function jc(r, e, t, n, o) {
  return r.destroy(), e.destroy(), n && n.destroy(), bt(o), t;
}
async function Kc(r, e, t, n) {
  const { c: o, dkLen: s, asyncTick: c, DK: a, PRF: l, PRFSalt: i } = zc(r, e, t, n);
  let u;
  const h = new Uint8Array(4), d = zr(h), f = new Uint8Array(l.outputLen);
  for (let x = 1, w = 0; w < s; x++, w += l.outputLen) {
    const v = a.subarray(w, w + l.outputLen);
    d.setInt32(0, x, !1), (u = i._cloneInto(u)).update(h).digestInto(f), v.set(f.subarray(0, v.length)), await Lc(o - 1, c, () => {
      l._cloneInto(u).update(f).digestInto(f);
      for (let b = 0; b < v.length; b++)
        v[b] ^= f[b];
    });
  }
  return jc(l, i, a, u, f);
}
function $c(r, e, t, n) {
  if (typeof r.setBigUint64 == "function")
    return r.setBigUint64(e, t, n);
  const o = BigInt(32), s = BigInt(4294967295), c = Number(t >> o & s), a = Number(t & s), l = n ? 4 : 0, i = n ? 0 : 4;
  r.setUint32(e + l, c, n), r.setUint32(e + i, a, n);
}
function Vc(r, e, t) {
  return r & e ^ ~r & t;
}
function qc(r, e, t) {
  return r & e ^ r & t ^ e & t;
}
class Ii extends Fi {
  constructor(e, t, n, o) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = t, this.padOffset = n, this.isLE = o, this.buffer = new Uint8Array(e), this.view = zr(this.buffer);
  }
  update(e) {
    $r(this), e = to(e), Lt(e);
    const { view: t, buffer: n, blockLen: o } = this, s = e.length;
    for (let c = 0; c < s; ) {
      const a = Math.min(o - this.pos, s - c);
      if (a === o) {
        const l = zr(e);
        for (; o <= s - c; c += o)
          this.process(l, c);
        continue;
      }
      n.set(e.subarray(c, c + a), this.pos), this.pos += a, c += a, this.pos === o && (this.process(t, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    $r(this), Uc(e, this), this.finished = !0;
    const { buffer: t, view: n, blockLen: o, isLE: s } = this;
    let { pos: c } = this;
    t[c++] = 128, bt(this.buffer.subarray(c)), this.padOffset > o - c && (this.process(n, 0), c = 0);
    for (let h = c; h < o; h++)
      t[h] = 0;
    $c(n, o - 8, BigInt(this.length * 8), s), this.process(n, 0);
    const a = zr(e), l = this.outputLen;
    if (l % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const i = l / 4, u = this.get();
    if (i > u.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let h = 0; h < i; h++)
      a.setUint32(4 * h, u[h], s);
  }
  digest() {
    const { buffer: e, outputLen: t } = this;
    this.digestInto(e);
    const n = e.slice(0, t);
    return this.destroy(), n;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: t, buffer: n, length: o, finished: s, destroyed: c, pos: a } = this;
    return e.destroyed = c, e.finished = s, e.length = o, e.pos = a, o % t && e.buffer.set(n), e;
  }
  clone() {
    return this._cloneInto();
  }
}
const ot = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), xe = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  4089235720,
  3144134277,
  2227873595,
  1013904242,
  4271175723,
  2773480762,
  1595750129,
  1359893119,
  2917565137,
  2600822924,
  725511199,
  528734635,
  4215389547,
  1541459225,
  327033209
]), kr = /* @__PURE__ */ BigInt(2 ** 32 - 1), So = /* @__PURE__ */ BigInt(32);
function Gc(r, e = !1) {
  return e ? { h: Number(r & kr), l: Number(r >> So & kr) } : { h: Number(r >> So & kr) | 0, l: Number(r & kr) | 0 };
}
function Yc(r, e = !1) {
  const t = r.length;
  let n = new Uint32Array(t), o = new Uint32Array(t);
  for (let s = 0; s < t; s++) {
    const { h: c, l: a } = Gc(r[s], e);
    [n[s], o[s]] = [c, a];
  }
  return [n, o];
}
const Fo = (r, e, t) => r >>> t, To = (r, e, t) => r << 32 - t | e >>> t, Ot = (r, e, t) => r >>> t | e << 32 - t, It = (r, e, t) => r << 32 - t | e >>> t, Dr = (r, e, t) => r << 64 - t | e >>> t - 32, Sr = (r, e, t) => r >>> t - 32 | e << 64 - t;
function Ve(r, e, t, n) {
  const o = (e >>> 0) + (n >>> 0);
  return { h: r + t + (o / 2 ** 32 | 0) | 0, l: o | 0 };
}
const Zc = (r, e, t) => (r >>> 0) + (e >>> 0) + (t >>> 0), Xc = (r, e, t, n) => e + t + n + (r / 2 ** 32 | 0) | 0, Jc = (r, e, t, n) => (r >>> 0) + (e >>> 0) + (t >>> 0) + (n >>> 0), Qc = (r, e, t, n, o) => e + t + n + o + (r / 2 ** 32 | 0) | 0, eu = (r, e, t, n, o) => (r >>> 0) + (e >>> 0) + (t >>> 0) + (n >>> 0) + (o >>> 0), tu = (r, e, t, n, o, s) => e + t + n + o + s + (r / 2 ** 32 | 0) | 0, ru = /* @__PURE__ */ Uint32Array.from([
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
]), st = /* @__PURE__ */ new Uint32Array(64);
class nu extends Ii {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = ot[0] | 0, this.B = ot[1] | 0, this.C = ot[2] | 0, this.D = ot[3] | 0, this.E = ot[4] | 0, this.F = ot[5] | 0, this.G = ot[6] | 0, this.H = ot[7] | 0;
  }
  get() {
    const { A: e, B: t, C: n, D: o, E: s, F: c, G: a, H: l } = this;
    return [e, t, n, o, s, c, a, l];
  }
  // prettier-ignore
  set(e, t, n, o, s, c, a, l) {
    this.A = e | 0, this.B = t | 0, this.C = n | 0, this.D = o | 0, this.E = s | 0, this.F = c | 0, this.G = a | 0, this.H = l | 0;
  }
  process(e, t) {
    for (let h = 0; h < 16; h++, t += 4)
      st[h] = e.getUint32(t, !1);
    for (let h = 16; h < 64; h++) {
      const d = st[h - 15], f = st[h - 2], x = Ue(d, 7) ^ Ue(d, 18) ^ d >>> 3, w = Ue(f, 17) ^ Ue(f, 19) ^ f >>> 10;
      st[h] = w + st[h - 7] + x + st[h - 16] | 0;
    }
    let { A: n, B: o, C: s, D: c, E: a, F: l, G: i, H: u } = this;
    for (let h = 0; h < 64; h++) {
      const d = Ue(a, 6) ^ Ue(a, 11) ^ Ue(a, 25), f = u + d + Vc(a, l, i) + ru[h] + st[h] | 0, w = (Ue(n, 2) ^ Ue(n, 13) ^ Ue(n, 22)) + qc(n, o, s) | 0;
      u = i, i = l, l = a, a = c + f | 0, c = s, s = o, o = n, n = f + w | 0;
    }
    n = n + this.A | 0, o = o + this.B | 0, s = s + this.C | 0, c = c + this.D | 0, a = a + this.E | 0, l = l + this.F | 0, i = i + this.G | 0, u = u + this.H | 0, this.set(n, o, s, c, a, l, i, u);
  }
  roundClean() {
    bt(st);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), bt(this.buffer);
  }
}
const Ni = Yc([
  "0x428a2f98d728ae22",
  "0x7137449123ef65cd",
  "0xb5c0fbcfec4d3b2f",
  "0xe9b5dba58189dbbc",
  "0x3956c25bf348b538",
  "0x59f111f1b605d019",
  "0x923f82a4af194f9b",
  "0xab1c5ed5da6d8118",
  "0xd807aa98a3030242",
  "0x12835b0145706fbe",
  "0x243185be4ee4b28c",
  "0x550c7dc3d5ffb4e2",
  "0x72be5d74f27b896f",
  "0x80deb1fe3b1696b1",
  "0x9bdc06a725c71235",
  "0xc19bf174cf692694",
  "0xe49b69c19ef14ad2",
  "0xefbe4786384f25e3",
  "0x0fc19dc68b8cd5b5",
  "0x240ca1cc77ac9c65",
  "0x2de92c6f592b0275",
  "0x4a7484aa6ea6e483",
  "0x5cb0a9dcbd41fbd4",
  "0x76f988da831153b5",
  "0x983e5152ee66dfab",
  "0xa831c66d2db43210",
  "0xb00327c898fb213f",
  "0xbf597fc7beef0ee4",
  "0xc6e00bf33da88fc2",
  "0xd5a79147930aa725",
  "0x06ca6351e003826f",
  "0x142929670a0e6e70",
  "0x27b70a8546d22ffc",
  "0x2e1b21385c26c926",
  "0x4d2c6dfc5ac42aed",
  "0x53380d139d95b3df",
  "0x650a73548baf63de",
  "0x766a0abb3c77b2a8",
  "0x81c2c92e47edaee6",
  "0x92722c851482353b",
  "0xa2bfe8a14cf10364",
  "0xa81a664bbc423001",
  "0xc24b8b70d0f89791",
  "0xc76c51a30654be30",
  "0xd192e819d6ef5218",
  "0xd69906245565a910",
  "0xf40e35855771202a",
  "0x106aa07032bbd1b8",
  "0x19a4c116b8d2d0c8",
  "0x1e376c085141ab53",
  "0x2748774cdf8eeb99",
  "0x34b0bcb5e19b48a8",
  "0x391c0cb3c5c95a63",
  "0x4ed8aa4ae3418acb",
  "0x5b9cca4f7763e373",
  "0x682e6ff3d6b2b8a3",
  "0x748f82ee5defb2fc",
  "0x78a5636f43172f60",
  "0x84c87814a1f0ab72",
  "0x8cc702081a6439ec",
  "0x90befffa23631e28",
  "0xa4506cebde82bde9",
  "0xbef9a3f7b2c67915",
  "0xc67178f2e372532b",
  "0xca273eceea26619c",
  "0xd186b8c721c0c207",
  "0xeada7dd6cde0eb1e",
  "0xf57d4f7fee6ed178",
  "0x06f067aa72176fba",
  "0x0a637dc5a2c898a6",
  "0x113f9804bef90dae",
  "0x1b710b35131c471b",
  "0x28db77f523047d84",
  "0x32caab7b40c72493",
  "0x3c9ebe0a15c9bebc",
  "0x431d67c49c100d4c",
  "0x4cc5d4becb3e42b6",
  "0x597f299cfc657e2a",
  "0x5fcb6fab3ad6faec",
  "0x6c44198c4a475817"
].map((r) => BigInt(r))), ou = Ni[0], su = Ni[1], it = /* @__PURE__ */ new Uint32Array(80), at = /* @__PURE__ */ new Uint32Array(80);
class iu extends Ii {
  constructor(e = 64) {
    super(128, e, 16, !1), this.Ah = xe[0] | 0, this.Al = xe[1] | 0, this.Bh = xe[2] | 0, this.Bl = xe[3] | 0, this.Ch = xe[4] | 0, this.Cl = xe[5] | 0, this.Dh = xe[6] | 0, this.Dl = xe[7] | 0, this.Eh = xe[8] | 0, this.El = xe[9] | 0, this.Fh = xe[10] | 0, this.Fl = xe[11] | 0, this.Gh = xe[12] | 0, this.Gl = xe[13] | 0, this.Hh = xe[14] | 0, this.Hl = xe[15] | 0;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: t, Bh: n, Bl: o, Ch: s, Cl: c, Dh: a, Dl: l, Eh: i, El: u, Fh: h, Fl: d, Gh: f, Gl: x, Hh: w, Hl: v } = this;
    return [e, t, n, o, s, c, a, l, i, u, h, d, f, x, w, v];
  }
  // prettier-ignore
  set(e, t, n, o, s, c, a, l, i, u, h, d, f, x, w, v) {
    this.Ah = e | 0, this.Al = t | 0, this.Bh = n | 0, this.Bl = o | 0, this.Ch = s | 0, this.Cl = c | 0, this.Dh = a | 0, this.Dl = l | 0, this.Eh = i | 0, this.El = u | 0, this.Fh = h | 0, this.Fl = d | 0, this.Gh = f | 0, this.Gl = x | 0, this.Hh = w | 0, this.Hl = v | 0;
  }
  process(e, t) {
    for (let g = 0; g < 16; g++, t += 4)
      it[g] = e.getUint32(t), at[g] = e.getUint32(t += 4);
    for (let g = 16; g < 80; g++) {
      const y = it[g - 15] | 0, m = at[g - 15] | 0, _ = Ot(y, m, 1) ^ Ot(y, m, 8) ^ Fo(y, m, 7), E = It(y, m, 1) ^ It(y, m, 8) ^ To(y, m, 7), C = it[g - 2] | 0, D = at[g - 2] | 0, A = Ot(C, D, 19) ^ Dr(C, D, 61) ^ Fo(C, D, 6), k = It(C, D, 19) ^ Sr(C, D, 61) ^ To(C, D, 6), S = Jc(E, k, at[g - 7], at[g - 16]), F = Qc(S, _, A, it[g - 7], it[g - 16]);
      it[g] = F | 0, at[g] = S | 0;
    }
    let { Ah: n, Al: o, Bh: s, Bl: c, Ch: a, Cl: l, Dh: i, Dl: u, Eh: h, El: d, Fh: f, Fl: x, Gh: w, Gl: v, Hh: b, Hl: p } = this;
    for (let g = 0; g < 80; g++) {
      const y = Ot(h, d, 14) ^ Ot(h, d, 18) ^ Dr(h, d, 41), m = It(h, d, 14) ^ It(h, d, 18) ^ Sr(h, d, 41), _ = h & f ^ ~h & w, E = d & x ^ ~d & v, C = eu(p, m, E, su[g], at[g]), D = tu(C, b, y, _, ou[g], it[g]), A = C | 0, k = Ot(n, o, 28) ^ Dr(n, o, 34) ^ Dr(n, o, 39), S = It(n, o, 28) ^ Sr(n, o, 34) ^ Sr(n, o, 39), F = n & s ^ n & a ^ s & a, H = o & c ^ o & l ^ c & l;
      b = w | 0, p = v | 0, w = f | 0, v = x | 0, f = h | 0, x = d | 0, { h, l: d } = Ve(i | 0, u | 0, D | 0, A | 0), i = a | 0, u = l | 0, a = s | 0, l = c | 0, s = n | 0, c = o | 0;
      const U = Zc(A, S, H);
      n = Xc(U, D, k, F), o = U | 0;
    }
    ({ h: n, l: o } = Ve(this.Ah | 0, this.Al | 0, n | 0, o | 0)), { h: s, l: c } = Ve(this.Bh | 0, this.Bl | 0, s | 0, c | 0), { h: a, l } = Ve(this.Ch | 0, this.Cl | 0, a | 0, l | 0), { h: i, l: u } = Ve(this.Dh | 0, this.Dl | 0, i | 0, u | 0), { h, l: d } = Ve(this.Eh | 0, this.El | 0, h | 0, d | 0), { h: f, l: x } = Ve(this.Fh | 0, this.Fl | 0, f | 0, x | 0), { h: w, l: v } = Ve(this.Gh | 0, this.Gl | 0, w | 0, v | 0), { h: b, l: p } = Ve(this.Hh | 0, this.Hl | 0, b | 0, p | 0), this.set(n, o, s, c, a, l, i, u, h, d, f, x, w, v, b, p);
  }
  roundClean() {
    bt(it, at);
  }
  destroy() {
    bt(this.buffer), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
const au = /* @__PURE__ */ Ti(() => new nu()), cu = /* @__PURE__ */ Ti(() => new iu());
/*! scure-base - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function Vr(r) {
  return r instanceof Uint8Array || ArrayBuffer.isView(r) && r.constructor.name === "Uint8Array";
}
function Hi(r, e) {
  return Array.isArray(e) ? e.length === 0 ? !0 : r ? e.every((t) => typeof t == "string") : e.every((t) => Number.isSafeInteger(t)) : !1;
}
function uu(r) {
  if (typeof r != "function")
    throw new Error("function expected");
  return !0;
}
function qr(r, e) {
  if (typeof e != "string")
    throw new Error(`${r}: string expected`);
  return !0;
}
function Wt(r) {
  if (!Number.isSafeInteger(r))
    throw new Error(`invalid integer: ${r}`);
}
function Gr(r) {
  if (!Array.isArray(r))
    throw new Error("array expected");
}
function Yr(r, e) {
  if (!Hi(!0, e))
    throw new Error(`${r}: array of strings expected`);
}
function Pi(r, e) {
  if (!Hi(!1, e))
    throw new Error(`${r}: array of numbers expected`);
}
// @__NO_SIDE_EFFECTS__
function lu(...r) {
  const e = (s) => s, t = (s, c) => (a) => s(c(a)), n = r.map((s) => s.encode).reduceRight(t, e), o = r.map((s) => s.decode).reduce(t, e);
  return { encode: n, decode: o };
}
// @__NO_SIDE_EFFECTS__
function fu(r) {
  const e = typeof r == "string" ? r.split("") : r, t = e.length;
  Yr("alphabet", e);
  const n = new Map(e.map((o, s) => [o, s]));
  return {
    encode: (o) => (Gr(o), o.map((s) => {
      if (!Number.isSafeInteger(s) || s < 0 || s >= t)
        throw new Error(`alphabet.encode: digit index outside alphabet "${s}". Allowed: ${r}`);
      return e[s];
    })),
    decode: (o) => (Gr(o), o.map((s) => {
      qr("alphabet.decode", s);
      const c = n.get(s);
      if (c === void 0)
        throw new Error(`Unknown letter: "${s}". Allowed: ${r}`);
      return c;
    }))
  };
}
// @__NO_SIDE_EFFECTS__
function du(r = "") {
  return qr("join", r), {
    encode: (e) => (Yr("join.decode", e), e.join(r)),
    decode: (e) => (qr("join.decode", e), e.split(r))
  };
}
// @__NO_SIDE_EFFECTS__
function hu(r, e = "=") {
  return Wt(r), qr("padding", e), {
    encode(t) {
      for (Yr("padding.encode", t); t.length * r % 8; )
        t.push(e);
      return t;
    },
    decode(t) {
      Yr("padding.decode", t);
      let n = t.length;
      if (n * r % 8)
        throw new Error("padding: invalid, string should have whole number of bytes");
      for (; n > 0 && t[n - 1] === e; n--)
        if ((n - 1) * r % 8 === 0)
          throw new Error("padding: invalid, string has too much padding");
      return t.slice(0, n);
    }
  };
}
function O0(r, e, t) {
  if (e < 2)
    throw new Error(`convertRadix: invalid from=${e}, base cannot be less than 2`);
  if (t < 2)
    throw new Error(`convertRadix: invalid to=${t}, base cannot be less than 2`);
  if (Gr(r), !r.length)
    return [];
  let n = 0;
  const o = [], s = Array.from(r, (a) => {
    if (Wt(a), a < 0 || a >= e)
      throw new Error(`invalid integer: ${a}`);
    return a;
  }), c = s.length;
  for (; ; ) {
    let a = 0, l = !0;
    for (let i = n; i < c; i++) {
      const u = s[i], h = e * a, d = h + u;
      if (!Number.isSafeInteger(d) || h / e !== a || d - u !== h)
        throw new Error("convertRadix: carry overflow");
      const f = d / t;
      a = d % t;
      const x = Math.floor(f);
      if (s[i] = x, !Number.isSafeInteger(x) || x * t + a !== d)
        throw new Error("convertRadix: carry overflow");
      if (l)
        x ? l = !1 : n = i;
      else continue;
    }
    if (o.push(a), l)
      break;
  }
  for (let a = 0; a < r.length - 1 && r[a] === 0; a++)
    o.push(0);
  return o.reverse();
}
const Ui = (r, e) => e === 0 ? r : Ui(e, r % e), Zr = /* @__NO_SIDE_EFFECTS__ */ (r, e) => r + (e - Ui(r, e)), Rn = /* @__PURE__ */ (() => {
  let r = [];
  for (let e = 0; e < 40; e++)
    r.push(2 ** e);
  return r;
})();
function I0(r, e, t, n) {
  if (Gr(r), e <= 0 || e > 32)
    throw new Error(`convertRadix2: wrong from=${e}`);
  if (t <= 0 || t > 32)
    throw new Error(`convertRadix2: wrong to=${t}`);
  if (/* @__PURE__ */ Zr(e, t) > 32)
    throw new Error(`convertRadix2: carry overflow from=${e} to=${t} carryBits=${/* @__PURE__ */ Zr(e, t)}`);
  let o = 0, s = 0;
  const c = Rn[e], a = Rn[t] - 1, l = [];
  for (const i of r) {
    if (Wt(i), i >= c)
      throw new Error(`convertRadix2: invalid data word=${i} from=${e}`);
    if (o = o << e | i, s + e > 32)
      throw new Error(`convertRadix2: carry overflow pos=${s} from=${e}`);
    for (s += e; s >= t; s -= t)
      l.push((o >> s - t & a) >>> 0);
    const u = Rn[s];
    if (u === void 0)
      throw new Error("invalid carry");
    o &= u - 1;
  }
  if (o = o << t - s & a, !n && s >= e)
    throw new Error("Excess padding");
  if (!n && o > 0)
    throw new Error(`Non-zero padding: ${o}`);
  return n && s > 0 && l.push(o >>> 0), l;
}
// @__NO_SIDE_EFFECTS__
function xu(r) {
  Wt(r);
  const e = 2 ** 8;
  return {
    encode: (t) => {
      if (!Vr(t))
        throw new Error("radix.encode input should be Uint8Array");
      return O0(Array.from(t), e, r);
    },
    decode: (t) => (Pi("radix.decode", t), Uint8Array.from(O0(t, r, e)))
  };
}
// @__NO_SIDE_EFFECTS__
function pu(r, e = !1) {
  if (Wt(r), r <= 0 || r > 32)
    throw new Error("radix2: bits should be in (0..32]");
  if (/* @__PURE__ */ Zr(8, r) > 32 || /* @__PURE__ */ Zr(r, 8) > 32)
    throw new Error("radix2: carry overflow");
  return {
    encode: (t) => {
      if (!Vr(t))
        throw new Error("radix2.encode input should be Uint8Array");
      return I0(Array.from(t), 8, r, !e);
    },
    decode: (t) => (Pi("radix2.decode", t), Uint8Array.from(I0(t, r, 8, e)))
  };
}
function gu(r, e) {
  return Wt(r), uu(e), {
    encode(t) {
      if (!Vr(t))
        throw new Error("checksum.encode: input should be Uint8Array");
      const n = e(t).slice(0, r), o = new Uint8Array(t.length + r);
      return o.set(t), o.set(n, t.length), o;
    },
    decode(t) {
      if (!Vr(t))
        throw new Error("checksum.decode: input should be Uint8Array");
      const n = t.slice(0, -r), o = t.slice(-r), s = e(n).slice(0, r);
      for (let c = 0; c < r; c++)
        if (s[c] !== o[c])
          throw new Error("Invalid checksum");
      return n;
    }
  };
}
const Fr = {
  alphabet: fu,
  chain: lu,
  checksum: gu,
  convertRadix: O0,
  convertRadix2: I0,
  radix: xu,
  radix2: pu,
  join: du,
  padding: hu
};
/*! scure-bip39 - MIT License (c) 2022 Patricio Palladino, Paul Miller (paulmillr.com) */
const yu = (r) => r[0] === "あいこくしん";
function Mi(r) {
  if (typeof r != "string")
    throw new TypeError("invalid mnemonic type: " + typeof r);
  return r.normalize("NFKD");
}
function Li(r) {
  const e = Mi(r), t = e.split(" ");
  if (![12, 15, 18, 21, 24].includes(t.length))
    throw new Error("Invalid mnemonic");
  return { nfkd: e, words: t };
}
function Wi(r) {
  Lt(r, 16, 20, 24, 28, 32);
}
const vu = (r) => {
  const e = 8 - r.length / 4;
  return new Uint8Array([au(r)[0] >> e << e]);
};
function zi(r) {
  if (!Array.isArray(r) || r.length !== 2048 || typeof r[0] != "string")
    throw new Error("Wordlist: expected array of 2048 strings");
  return r.forEach((e) => {
    if (typeof e != "string")
      throw new Error("wordlist: non-string element: " + e);
  }), Fr.chain(Fr.checksum(1, vu), Fr.radix2(11, !0), Fr.alphabet(r));
}
function ji(r, e) {
  const { words: t } = Li(r), n = zi(e).decode(t);
  return Wi(n), n;
}
function Ro(r, e) {
  return Wi(r), zi(e).encode(r).join(yu(e) ? "　" : " ");
}
function wu(r, e) {
  try {
    ji(r, e);
  } catch {
    return !1;
  }
  return !0;
}
const bu = (r) => Mi("mnemonic" + r);
function mu(r, e = "") {
  return Kc(cu, Li(r).nfkd, bu(e), { c: 2048, dkLen: 64 });
}
const Tr = `abandon
ability
able
about
above
absent
absorb
abstract
absurd
abuse
access
accident
account
accuse
achieve
acid
acoustic
acquire
across
act
action
actor
actress
actual
adapt
add
addict
address
adjust
admit
adult
advance
advice
aerobic
affair
afford
afraid
again
age
agent
agree
ahead
aim
air
airport
aisle
alarm
album
alcohol
alert
alien
all
alley
allow
almost
alone
alpha
already
also
alter
always
amateur
amazing
among
amount
amused
analyst
anchor
ancient
anger
angle
angry
animal
ankle
announce
annual
another
answer
antenna
antique
anxiety
any
apart
apology
appear
apple
approve
april
arch
arctic
area
arena
argue
arm
armed
armor
army
around
arrange
arrest
arrive
arrow
art
artefact
artist
artwork
ask
aspect
assault
asset
assist
assume
asthma
athlete
atom
attack
attend
attitude
attract
auction
audit
august
aunt
author
auto
autumn
average
avocado
avoid
awake
aware
away
awesome
awful
awkward
axis
baby
bachelor
bacon
badge
bag
balance
balcony
ball
bamboo
banana
banner
bar
barely
bargain
barrel
base
basic
basket
battle
beach
bean
beauty
because
become
beef
before
begin
behave
behind
believe
below
belt
bench
benefit
best
betray
better
between
beyond
bicycle
bid
bike
bind
biology
bird
birth
bitter
black
blade
blame
blanket
blast
bleak
bless
blind
blood
blossom
blouse
blue
blur
blush
board
boat
body
boil
bomb
bone
bonus
book
boost
border
boring
borrow
boss
bottom
bounce
box
boy
bracket
brain
brand
brass
brave
bread
breeze
brick
bridge
brief
bright
bring
brisk
broccoli
broken
bronze
broom
brother
brown
brush
bubble
buddy
budget
buffalo
build
bulb
bulk
bullet
bundle
bunker
burden
burger
burst
bus
business
busy
butter
buyer
buzz
cabbage
cabin
cable
cactus
cage
cake
call
calm
camera
camp
can
canal
cancel
candy
cannon
canoe
canvas
canyon
capable
capital
captain
car
carbon
card
cargo
carpet
carry
cart
case
cash
casino
castle
casual
cat
catalog
catch
category
cattle
caught
cause
caution
cave
ceiling
celery
cement
census
century
cereal
certain
chair
chalk
champion
change
chaos
chapter
charge
chase
chat
cheap
check
cheese
chef
cherry
chest
chicken
chief
child
chimney
choice
choose
chronic
chuckle
chunk
churn
cigar
cinnamon
circle
citizen
city
civil
claim
clap
clarify
claw
clay
clean
clerk
clever
click
client
cliff
climb
clinic
clip
clock
clog
close
cloth
cloud
clown
club
clump
cluster
clutch
coach
coast
coconut
code
coffee
coil
coin
collect
color
column
combine
come
comfort
comic
common
company
concert
conduct
confirm
congress
connect
consider
control
convince
cook
cool
copper
copy
coral
core
corn
correct
cost
cotton
couch
country
couple
course
cousin
cover
coyote
crack
cradle
craft
cram
crane
crash
crater
crawl
crazy
cream
credit
creek
crew
cricket
crime
crisp
critic
crop
cross
crouch
crowd
crucial
cruel
cruise
crumble
crunch
crush
cry
crystal
cube
culture
cup
cupboard
curious
current
curtain
curve
cushion
custom
cute
cycle
dad
damage
damp
dance
danger
daring
dash
daughter
dawn
day
deal
debate
debris
decade
december
decide
decline
decorate
decrease
deer
defense
define
defy
degree
delay
deliver
demand
demise
denial
dentist
deny
depart
depend
deposit
depth
deputy
derive
describe
desert
design
desk
despair
destroy
detail
detect
develop
device
devote
diagram
dial
diamond
diary
dice
diesel
diet
differ
digital
dignity
dilemma
dinner
dinosaur
direct
dirt
disagree
discover
disease
dish
dismiss
disorder
display
distance
divert
divide
divorce
dizzy
doctor
document
dog
doll
dolphin
domain
donate
donkey
donor
door
dose
double
dove
draft
dragon
drama
drastic
draw
dream
dress
drift
drill
drink
drip
drive
drop
drum
dry
duck
dumb
dune
during
dust
dutch
duty
dwarf
dynamic
eager
eagle
early
earn
earth
easily
east
easy
echo
ecology
economy
edge
edit
educate
effort
egg
eight
either
elbow
elder
electric
elegant
element
elephant
elevator
elite
else
embark
embody
embrace
emerge
emotion
employ
empower
empty
enable
enact
end
endless
endorse
enemy
energy
enforce
engage
engine
enhance
enjoy
enlist
enough
enrich
enroll
ensure
enter
entire
entry
envelope
episode
equal
equip
era
erase
erode
erosion
error
erupt
escape
essay
essence
estate
eternal
ethics
evidence
evil
evoke
evolve
exact
example
excess
exchange
excite
exclude
excuse
execute
exercise
exhaust
exhibit
exile
exist
exit
exotic
expand
expect
expire
explain
expose
express
extend
extra
eye
eyebrow
fabric
face
faculty
fade
faint
faith
fall
false
fame
family
famous
fan
fancy
fantasy
farm
fashion
fat
fatal
father
fatigue
fault
favorite
feature
february
federal
fee
feed
feel
female
fence
festival
fetch
fever
few
fiber
fiction
field
figure
file
film
filter
final
find
fine
finger
finish
fire
firm
first
fiscal
fish
fit
fitness
fix
flag
flame
flash
flat
flavor
flee
flight
flip
float
flock
floor
flower
fluid
flush
fly
foam
focus
fog
foil
fold
follow
food
foot
force
forest
forget
fork
fortune
forum
forward
fossil
foster
found
fox
fragile
frame
frequent
fresh
friend
fringe
frog
front
frost
frown
frozen
fruit
fuel
fun
funny
furnace
fury
future
gadget
gain
galaxy
gallery
game
gap
garage
garbage
garden
garlic
garment
gas
gasp
gate
gather
gauge
gaze
general
genius
genre
gentle
genuine
gesture
ghost
giant
gift
giggle
ginger
giraffe
girl
give
glad
glance
glare
glass
glide
glimpse
globe
gloom
glory
glove
glow
glue
goat
goddess
gold
good
goose
gorilla
gospel
gossip
govern
gown
grab
grace
grain
grant
grape
grass
gravity
great
green
grid
grief
grit
grocery
group
grow
grunt
guard
guess
guide
guilt
guitar
gun
gym
habit
hair
half
hammer
hamster
hand
happy
harbor
hard
harsh
harvest
hat
have
hawk
hazard
head
health
heart
heavy
hedgehog
height
hello
helmet
help
hen
hero
hidden
high
hill
hint
hip
hire
history
hobby
hockey
hold
hole
holiday
hollow
home
honey
hood
hope
horn
horror
horse
hospital
host
hotel
hour
hover
hub
huge
human
humble
humor
hundred
hungry
hunt
hurdle
hurry
hurt
husband
hybrid
ice
icon
idea
identify
idle
ignore
ill
illegal
illness
image
imitate
immense
immune
impact
impose
improve
impulse
inch
include
income
increase
index
indicate
indoor
industry
infant
inflict
inform
inhale
inherit
initial
inject
injury
inmate
inner
innocent
input
inquiry
insane
insect
inside
inspire
install
intact
interest
into
invest
invite
involve
iron
island
isolate
issue
item
ivory
jacket
jaguar
jar
jazz
jealous
jeans
jelly
jewel
job
join
joke
journey
joy
judge
juice
jump
jungle
junior
junk
just
kangaroo
keen
keep
ketchup
key
kick
kid
kidney
kind
kingdom
kiss
kit
kitchen
kite
kitten
kiwi
knee
knife
knock
know
lab
label
labor
ladder
lady
lake
lamp
language
laptop
large
later
latin
laugh
laundry
lava
law
lawn
lawsuit
layer
lazy
leader
leaf
learn
leave
lecture
left
leg
legal
legend
leisure
lemon
lend
length
lens
leopard
lesson
letter
level
liar
liberty
library
license
life
lift
light
like
limb
limit
link
lion
liquid
list
little
live
lizard
load
loan
lobster
local
lock
logic
lonely
long
loop
lottery
loud
lounge
love
loyal
lucky
luggage
lumber
lunar
lunch
luxury
lyrics
machine
mad
magic
magnet
maid
mail
main
major
make
mammal
man
manage
mandate
mango
mansion
manual
maple
marble
march
margin
marine
market
marriage
mask
mass
master
match
material
math
matrix
matter
maximum
maze
meadow
mean
measure
meat
mechanic
medal
media
melody
melt
member
memory
mention
menu
mercy
merge
merit
merry
mesh
message
metal
method
middle
midnight
milk
million
mimic
mind
minimum
minor
minute
miracle
mirror
misery
miss
mistake
mix
mixed
mixture
mobile
model
modify
mom
moment
monitor
monkey
monster
month
moon
moral
more
morning
mosquito
mother
motion
motor
mountain
mouse
move
movie
much
muffin
mule
multiply
muscle
museum
mushroom
music
must
mutual
myself
mystery
myth
naive
name
napkin
narrow
nasty
nation
nature
near
neck
need
negative
neglect
neither
nephew
nerve
nest
net
network
neutral
never
news
next
nice
night
noble
noise
nominee
noodle
normal
north
nose
notable
note
nothing
notice
novel
now
nuclear
number
nurse
nut
oak
obey
object
oblige
obscure
observe
obtain
obvious
occur
ocean
october
odor
off
offer
office
often
oil
okay
old
olive
olympic
omit
once
one
onion
online
only
open
opera
opinion
oppose
option
orange
orbit
orchard
order
ordinary
organ
orient
original
orphan
ostrich
other
outdoor
outer
output
outside
oval
oven
over
own
owner
oxygen
oyster
ozone
pact
paddle
page
pair
palace
palm
panda
panel
panic
panther
paper
parade
parent
park
parrot
party
pass
patch
path
patient
patrol
pattern
pause
pave
payment
peace
peanut
pear
peasant
pelican
pen
penalty
pencil
people
pepper
perfect
permit
person
pet
phone
photo
phrase
physical
piano
picnic
picture
piece
pig
pigeon
pill
pilot
pink
pioneer
pipe
pistol
pitch
pizza
place
planet
plastic
plate
play
please
pledge
pluck
plug
plunge
poem
poet
point
polar
pole
police
pond
pony
pool
popular
portion
position
possible
post
potato
pottery
poverty
powder
power
practice
praise
predict
prefer
prepare
present
pretty
prevent
price
pride
primary
print
priority
prison
private
prize
problem
process
produce
profit
program
project
promote
proof
property
prosper
protect
proud
provide
public
pudding
pull
pulp
pulse
pumpkin
punch
pupil
puppy
purchase
purity
purpose
purse
push
put
puzzle
pyramid
quality
quantum
quarter
question
quick
quit
quiz
quote
rabbit
raccoon
race
rack
radar
radio
rail
rain
raise
rally
ramp
ranch
random
range
rapid
rare
rate
rather
raven
raw
razor
ready
real
reason
rebel
rebuild
recall
receive
recipe
record
recycle
reduce
reflect
reform
refuse
region
regret
regular
reject
relax
release
relief
rely
remain
remember
remind
remove
render
renew
rent
reopen
repair
repeat
replace
report
require
rescue
resemble
resist
resource
response
result
retire
retreat
return
reunion
reveal
review
reward
rhythm
rib
ribbon
rice
rich
ride
ridge
rifle
right
rigid
ring
riot
ripple
risk
ritual
rival
river
road
roast
robot
robust
rocket
romance
roof
rookie
room
rose
rotate
rough
round
route
royal
rubber
rude
rug
rule
run
runway
rural
sad
saddle
sadness
safe
sail
salad
salmon
salon
salt
salute
same
sample
sand
satisfy
satoshi
sauce
sausage
save
say
scale
scan
scare
scatter
scene
scheme
school
science
scissors
scorpion
scout
scrap
screen
script
scrub
sea
search
season
seat
second
secret
section
security
seed
seek
segment
select
sell
seminar
senior
sense
sentence
series
service
session
settle
setup
seven
shadow
shaft
shallow
share
shed
shell
sheriff
shield
shift
shine
ship
shiver
shock
shoe
shoot
shop
short
shoulder
shove
shrimp
shrug
shuffle
shy
sibling
sick
side
siege
sight
sign
silent
silk
silly
silver
similar
simple
since
sing
siren
sister
situate
six
size
skate
sketch
ski
skill
skin
skirt
skull
slab
slam
sleep
slender
slice
slide
slight
slim
slogan
slot
slow
slush
small
smart
smile
smoke
smooth
snack
snake
snap
sniff
snow
soap
soccer
social
sock
soda
soft
solar
soldier
solid
solution
solve
someone
song
soon
sorry
sort
soul
sound
soup
source
south
space
spare
spatial
spawn
speak
special
speed
spell
spend
sphere
spice
spider
spike
spin
spirit
split
spoil
sponsor
spoon
sport
spot
spray
spread
spring
spy
square
squeeze
squirrel
stable
stadium
staff
stage
stairs
stamp
stand
start
state
stay
steak
steel
stem
step
stereo
stick
still
sting
stock
stomach
stone
stool
story
stove
strategy
street
strike
strong
struggle
student
stuff
stumble
style
subject
submit
subway
success
such
sudden
suffer
sugar
suggest
suit
summer
sun
sunny
sunset
super
supply
supreme
sure
surface
surge
surprise
surround
survey
suspect
sustain
swallow
swamp
swap
swarm
swear
sweet
swift
swim
swing
switch
sword
symbol
symptom
syrup
system
table
tackle
tag
tail
talent
talk
tank
tape
target
task
taste
tattoo
taxi
teach
team
tell
ten
tenant
tennis
tent
term
test
text
thank
that
theme
then
theory
there
they
thing
this
thought
three
thrive
throw
thumb
thunder
ticket
tide
tiger
tilt
timber
time
tiny
tip
tired
tissue
title
toast
tobacco
today
toddler
toe
together
toilet
token
tomato
tomorrow
tone
tongue
tonight
tool
tooth
top
topic
topple
torch
tornado
tortoise
toss
total
tourist
toward
tower
town
toy
track
trade
traffic
tragic
train
transfer
trap
trash
travel
tray
treat
tree
trend
trial
tribe
trick
trigger
trim
trip
trophy
trouble
truck
true
truly
trumpet
trust
truth
try
tube
tuition
tumble
tuna
tunnel
turkey
turn
turtle
twelve
twenty
twice
twin
twist
two
type
typical
ugly
umbrella
unable
unaware
uncle
uncover
under
undo
unfair
unfold
unhappy
uniform
unique
unit
universe
unknown
unlock
until
unusual
unveil
update
upgrade
uphold
upon
upper
upset
urban
urge
usage
use
used
useful
useless
usual
utility
vacant
vacuum
vague
valid
valley
valve
van
vanish
vapor
various
vast
vault
vehicle
velvet
vendor
venture
venue
verb
verify
version
very
vessel
veteran
viable
vibrant
vicious
victory
video
view
village
vintage
violin
virtual
virus
visa
visit
visual
vital
vivid
vocal
voice
void
volcano
volume
vote
voyage
wage
wagon
wait
walk
wall
walnut
want
warfare
warm
warrior
wash
wasp
waste
water
wave
way
wealth
weapon
wear
weasel
weather
web
wedding
weekend
weird
welcome
west
wet
whale
what
wheat
wheel
when
where
whip
whisper
wide
width
wife
wild
will
win
window
wine
wing
wink
winner
winter
wire
wisdom
wise
wish
witness
wolf
woman
wonder
wood
wool
word
work
world
worry
worth
wrap
wreck
wrestle
wrist
write
wrong
yard
year
yellow
you
young
youth
zebra
zero
zone
zoo`.split(`
`);
var z = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Eu(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
function Au(r) {
  if (r.__esModule) return r;
  var e = r.default;
  if (typeof e == "function") {
    var t = function n() {
      return this instanceof n ? Reflect.construct(e, arguments, this.constructor) : e.apply(this, arguments);
    };
    t.prototype = e.prototype;
  } else t = {};
  return Object.defineProperty(t, "__esModule", { value: !0 }), Object.keys(r).forEach(function(n) {
    var o = Object.getOwnPropertyDescriptor(r, n);
    Object.defineProperty(t, n, o.get ? o : {
      enumerable: !0,
      get: function() {
        return r[n];
      }
    });
  }), t;
}
var Ki = { exports: {} };
function _u(r) {
  throw new Error('Could not dynamically require "' + r + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var On = { exports: {} };
const Bu = {}, Cu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Bu
}, Symbol.toStringTag, { value: "Module" })), ku = /* @__PURE__ */ Au(Cu);
var Oo;
function K() {
  return Oo || (Oo = 1, function(r, e) {
    (function(t, n) {
      r.exports = n();
    })(z, function() {
      var t = t || function(n, o) {
        var s;
        if (typeof window < "u" && window.crypto && (s = window.crypto), typeof self < "u" && self.crypto && (s = self.crypto), typeof globalThis < "u" && globalThis.crypto && (s = globalThis.crypto), !s && typeof window < "u" && window.msCrypto && (s = window.msCrypto), !s && typeof z < "u" && z.crypto && (s = z.crypto), !s && typeof _u == "function")
          try {
            s = ku;
          } catch {
          }
        var c = function() {
          if (s) {
            if (typeof s.getRandomValues == "function")
              try {
                return s.getRandomValues(new Uint32Array(1))[0];
              } catch {
              }
            if (typeof s.randomBytes == "function")
              try {
                return s.randomBytes(4).readInt32LE();
              } catch {
              }
          }
          throw new Error("Native crypto module could not be used to get secure random number.");
        }, a = Object.create || /* @__PURE__ */ function() {
          function p() {
          }
          return function(g) {
            var y;
            return p.prototype = g, y = new p(), p.prototype = null, y;
          };
        }(), l = {}, i = l.lib = {}, u = i.Base = /* @__PURE__ */ function() {
          return {
            /**
             * Creates a new object that inherits from this object.
             *
             * @param {Object} overrides Properties to copy into the new object.
             *
             * @return {Object} The new object.
             *
             * @static
             *
             * @example
             *
             *     var MyType = CryptoJS.lib.Base.extend({
             *         field: 'value',
             *
             *         method: function () {
             *         }
             *     });
             */
            extend: function(p) {
              var g = a(this);
              return p && g.mixIn(p), (!g.hasOwnProperty("init") || this.init === g.init) && (g.init = function() {
                g.$super.init.apply(this, arguments);
              }), g.init.prototype = g, g.$super = this, g;
            },
            /**
             * Extends this object and runs the init method.
             * Arguments to create() will be passed to init().
             *
             * @return {Object} The new object.
             *
             * @static
             *
             * @example
             *
             *     var instance = MyType.create();
             */
            create: function() {
              var p = this.extend();
              return p.init.apply(p, arguments), p;
            },
            /**
             * Initializes a newly created object.
             * Override this method to add some logic when your objects are created.
             *
             * @example
             *
             *     var MyType = CryptoJS.lib.Base.extend({
             *         init: function () {
             *             // ...
             *         }
             *     });
             */
            init: function() {
            },
            /**
             * Copies properties into this object.
             *
             * @param {Object} properties The properties to mix in.
             *
             * @example
             *
             *     MyType.mixIn({
             *         field: 'value'
             *     });
             */
            mixIn: function(p) {
              for (var g in p)
                p.hasOwnProperty(g) && (this[g] = p[g]);
              p.hasOwnProperty("toString") && (this.toString = p.toString);
            },
            /**
             * Creates a copy of this object.
             *
             * @return {Object} The clone.
             *
             * @example
             *
             *     var clone = instance.clone();
             */
            clone: function() {
              return this.init.prototype.extend(this);
            }
          };
        }(), h = i.WordArray = u.extend({
          /**
           * Initializes a newly created word array.
           *
           * @param {Array} words (Optional) An array of 32-bit words.
           * @param {number} sigBytes (Optional) The number of significant bytes in the words.
           *
           * @example
           *
           *     var wordArray = CryptoJS.lib.WordArray.create();
           *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
           *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
           */
          init: function(p, g) {
            p = this.words = p || [], g != o ? this.sigBytes = g : this.sigBytes = p.length * 4;
          },
          /**
           * Converts this word array to a string.
           *
           * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
           *
           * @return {string} The stringified word array.
           *
           * @example
           *
           *     var string = wordArray + '';
           *     var string = wordArray.toString();
           *     var string = wordArray.toString(CryptoJS.enc.Utf8);
           */
          toString: function(p) {
            return (p || f).stringify(this);
          },
          /**
           * Concatenates a word array to this word array.
           *
           * @param {WordArray} wordArray The word array to append.
           *
           * @return {WordArray} This word array.
           *
           * @example
           *
           *     wordArray1.concat(wordArray2);
           */
          concat: function(p) {
            var g = this.words, y = p.words, m = this.sigBytes, _ = p.sigBytes;
            if (this.clamp(), m % 4)
              for (var E = 0; E < _; E++) {
                var C = y[E >>> 2] >>> 24 - E % 4 * 8 & 255;
                g[m + E >>> 2] |= C << 24 - (m + E) % 4 * 8;
              }
            else
              for (var D = 0; D < _; D += 4)
                g[m + D >>> 2] = y[D >>> 2];
            return this.sigBytes += _, this;
          },
          /**
           * Removes insignificant bits.
           *
           * @example
           *
           *     wordArray.clamp();
           */
          clamp: function() {
            var p = this.words, g = this.sigBytes;
            p[g >>> 2] &= 4294967295 << 32 - g % 4 * 8, p.length = n.ceil(g / 4);
          },
          /**
           * Creates a copy of this word array.
           *
           * @return {WordArray} The clone.
           *
           * @example
           *
           *     var clone = wordArray.clone();
           */
          clone: function() {
            var p = u.clone.call(this);
            return p.words = this.words.slice(0), p;
          },
          /**
           * Creates a word array filled with random bytes.
           *
           * @param {number} nBytes The number of random bytes to generate.
           *
           * @return {WordArray} The random word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.lib.WordArray.random(16);
           */
          random: function(p) {
            for (var g = [], y = 0; y < p; y += 4)
              g.push(c());
            return new h.init(g, p);
          }
        }), d = l.enc = {}, f = d.Hex = {
          /**
           * Converts a word array to a hex string.
           *
           * @param {WordArray} wordArray The word array.
           *
           * @return {string} The hex string.
           *
           * @static
           *
           * @example
           *
           *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
           */
          stringify: function(p) {
            for (var g = p.words, y = p.sigBytes, m = [], _ = 0; _ < y; _++) {
              var E = g[_ >>> 2] >>> 24 - _ % 4 * 8 & 255;
              m.push((E >>> 4).toString(16)), m.push((E & 15).toString(16));
            }
            return m.join("");
          },
          /**
           * Converts a hex string to a word array.
           *
           * @param {string} hexStr The hex string.
           *
           * @return {WordArray} The word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
           */
          parse: function(p) {
            for (var g = p.length, y = [], m = 0; m < g; m += 2)
              y[m >>> 3] |= parseInt(p.substr(m, 2), 16) << 24 - m % 8 * 4;
            return new h.init(y, g / 2);
          }
        }, x = d.Latin1 = {
          /**
           * Converts a word array to a Latin1 string.
           *
           * @param {WordArray} wordArray The word array.
           *
           * @return {string} The Latin1 string.
           *
           * @static
           *
           * @example
           *
           *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
           */
          stringify: function(p) {
            for (var g = p.words, y = p.sigBytes, m = [], _ = 0; _ < y; _++) {
              var E = g[_ >>> 2] >>> 24 - _ % 4 * 8 & 255;
              m.push(String.fromCharCode(E));
            }
            return m.join("");
          },
          /**
           * Converts a Latin1 string to a word array.
           *
           * @param {string} latin1Str The Latin1 string.
           *
           * @return {WordArray} The word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
           */
          parse: function(p) {
            for (var g = p.length, y = [], m = 0; m < g; m++)
              y[m >>> 2] |= (p.charCodeAt(m) & 255) << 24 - m % 4 * 8;
            return new h.init(y, g);
          }
        }, w = d.Utf8 = {
          /**
           * Converts a word array to a UTF-8 string.
           *
           * @param {WordArray} wordArray The word array.
           *
           * @return {string} The UTF-8 string.
           *
           * @static
           *
           * @example
           *
           *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
           */
          stringify: function(p) {
            try {
              return decodeURIComponent(escape(x.stringify(p)));
            } catch {
              throw new Error("Malformed UTF-8 data");
            }
          },
          /**
           * Converts a UTF-8 string to a word array.
           *
           * @param {string} utf8Str The UTF-8 string.
           *
           * @return {WordArray} The word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
           */
          parse: function(p) {
            return x.parse(unescape(encodeURIComponent(p)));
          }
        }, v = i.BufferedBlockAlgorithm = u.extend({
          /**
           * Resets this block algorithm's data buffer to its initial state.
           *
           * @example
           *
           *     bufferedBlockAlgorithm.reset();
           */
          reset: function() {
            this._data = new h.init(), this._nDataBytes = 0;
          },
          /**
           * Adds new data to this block algorithm's buffer.
           *
           * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
           *
           * @example
           *
           *     bufferedBlockAlgorithm._append('data');
           *     bufferedBlockAlgorithm._append(wordArray);
           */
          _append: function(p) {
            typeof p == "string" && (p = w.parse(p)), this._data.concat(p), this._nDataBytes += p.sigBytes;
          },
          /**
           * Processes available data blocks.
           *
           * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
           *
           * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
           *
           * @return {WordArray} The processed data.
           *
           * @example
           *
           *     var processedData = bufferedBlockAlgorithm._process();
           *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
           */
          _process: function(p) {
            var g, y = this._data, m = y.words, _ = y.sigBytes, E = this.blockSize, C = E * 4, D = _ / C;
            p ? D = n.ceil(D) : D = n.max((D | 0) - this._minBufferSize, 0);
            var A = D * E, k = n.min(A * 4, _);
            if (A) {
              for (var S = 0; S < A; S += E)
                this._doProcessBlock(m, S);
              g = m.splice(0, A), y.sigBytes -= k;
            }
            return new h.init(g, k);
          },
          /**
           * Creates a copy of this object.
           *
           * @return {Object} The clone.
           *
           * @example
           *
           *     var clone = bufferedBlockAlgorithm.clone();
           */
          clone: function() {
            var p = u.clone.call(this);
            return p._data = this._data.clone(), p;
          },
          _minBufferSize: 0
        });
        i.Hasher = v.extend({
          /**
           * Configuration options.
           */
          cfg: u.extend(),
          /**
           * Initializes a newly created hasher.
           *
           * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
           *
           * @example
           *
           *     var hasher = CryptoJS.algo.SHA256.create();
           */
          init: function(p) {
            this.cfg = this.cfg.extend(p), this.reset();
          },
          /**
           * Resets this hasher to its initial state.
           *
           * @example
           *
           *     hasher.reset();
           */
          reset: function() {
            v.reset.call(this), this._doReset();
          },
          /**
           * Updates this hasher with a message.
           *
           * @param {WordArray|string} messageUpdate The message to append.
           *
           * @return {Hasher} This hasher.
           *
           * @example
           *
           *     hasher.update('message');
           *     hasher.update(wordArray);
           */
          update: function(p) {
            return this._append(p), this._process(), this;
          },
          /**
           * Finalizes the hash computation.
           * Note that the finalize operation is effectively a destructive, read-once operation.
           *
           * @param {WordArray|string} messageUpdate (Optional) A final message update.
           *
           * @return {WordArray} The hash.
           *
           * @example
           *
           *     var hash = hasher.finalize();
           *     var hash = hasher.finalize('message');
           *     var hash = hasher.finalize(wordArray);
           */
          finalize: function(p) {
            p && this._append(p);
            var g = this._doFinalize();
            return g;
          },
          blockSize: 16,
          /**
           * Creates a shortcut function to a hasher's object interface.
           *
           * @param {Hasher} hasher The hasher to create a helper for.
           *
           * @return {Function} The shortcut function.
           *
           * @static
           *
           * @example
           *
           *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
           */
          _createHelper: function(p) {
            return function(g, y) {
              return new p.init(y).finalize(g);
            };
          },
          /**
           * Creates a shortcut function to the HMAC's object interface.
           *
           * @param {Hasher} hasher The hasher to use in this HMAC helper.
           *
           * @return {Function} The shortcut function.
           *
           * @static
           *
           * @example
           *
           *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
           */
          _createHmacHelper: function(p) {
            return function(g, y) {
              return new b.HMAC.init(p, y).finalize(g);
            };
          }
        });
        var b = l.algo = {};
        return l;
      }(Math);
      return t;
    });
  }(On)), On.exports;
}
var In = { exports: {} }, Io;
function un() {
  return Io || (Io = 1, function(r, e) {
    (function(t, n) {
      r.exports = n(K());
    })(z, function(t) {
      return function(n) {
        var o = t, s = o.lib, c = s.Base, a = s.WordArray, l = o.x64 = {};
        l.Word = c.extend({
          /**
           * Initializes a newly created 64-bit word.
           *
           * @param {number} high The high 32 bits.
           * @param {number} low The low 32 bits.
           *
           * @example
           *
           *     var x64Word = CryptoJS.x64.Word.create(0x00010203, 0x04050607);
           */
          init: function(i, u) {
            this.high = i, this.low = u;
          }
          /**
           * Bitwise NOTs this word.
           *
           * @return {X64Word} A new x64-Word object after negating.
           *
           * @example
           *
           *     var negated = x64Word.not();
           */
          // not: function () {
          // var high = ~this.high;
          // var low = ~this.low;
          // return X64Word.create(high, low);
          // },
          /**
           * Bitwise ANDs this word with the passed word.
           *
           * @param {X64Word} word The x64-Word to AND with this word.
           *
           * @return {X64Word} A new x64-Word object after ANDing.
           *
           * @example
           *
           *     var anded = x64Word.and(anotherX64Word);
           */
          // and: function (word) {
          // var high = this.high & word.high;
          // var low = this.low & word.low;
          // return X64Word.create(high, low);
          // },
          /**
           * Bitwise ORs this word with the passed word.
           *
           * @param {X64Word} word The x64-Word to OR with this word.
           *
           * @return {X64Word} A new x64-Word object after ORing.
           *
           * @example
           *
           *     var ored = x64Word.or(anotherX64Word);
           */
          // or: function (word) {
          // var high = this.high | word.high;
          // var low = this.low | word.low;
          // return X64Word.create(high, low);
          // },
          /**
           * Bitwise XORs this word with the passed word.
           *
           * @param {X64Word} word The x64-Word to XOR with this word.
           *
           * @return {X64Word} A new x64-Word object after XORing.
           *
           * @example
           *
           *     var xored = x64Word.xor(anotherX64Word);
           */
          // xor: function (word) {
          // var high = this.high ^ word.high;
          // var low = this.low ^ word.low;
          // return X64Word.create(high, low);
          // },
          /**
           * Shifts this word n bits to the left.
           *
           * @param {number} n The number of bits to shift.
           *
           * @return {X64Word} A new x64-Word object after shifting.
           *
           * @example
           *
           *     var shifted = x64Word.shiftL(25);
           */
          // shiftL: function (n) {
          // if (n < 32) {
          // var high = (this.high << n) | (this.low >>> (32 - n));
          // var low = this.low << n;
          // } else {
          // var high = this.low << (n - 32);
          // var low = 0;
          // }
          // return X64Word.create(high, low);
          // },
          /**
           * Shifts this word n bits to the right.
           *
           * @param {number} n The number of bits to shift.
           *
           * @return {X64Word} A new x64-Word object after shifting.
           *
           * @example
           *
           *     var shifted = x64Word.shiftR(7);
           */
          // shiftR: function (n) {
          // if (n < 32) {
          // var low = (this.low >>> n) | (this.high << (32 - n));
          // var high = this.high >>> n;
          // } else {
          // var low = this.high >>> (n - 32);
          // var high = 0;
          // }
          // return X64Word.create(high, low);
          // },
          /**
           * Rotates this word n bits to the left.
           *
           * @param {number} n The number of bits to rotate.
           *
           * @return {X64Word} A new x64-Word object after rotating.
           *
           * @example
           *
           *     var rotated = x64Word.rotL(25);
           */
          // rotL: function (n) {
          // return this.shiftL(n).or(this.shiftR(64 - n));
          // },
          /**
           * Rotates this word n bits to the right.
           *
           * @param {number} n The number of bits to rotate.
           *
           * @return {X64Word} A new x64-Word object after rotating.
           *
           * @example
           *
           *     var rotated = x64Word.rotR(7);
           */
          // rotR: function (n) {
          // return this.shiftR(n).or(this.shiftL(64 - n));
          // },
          /**
           * Adds this word with the passed word.
           *
           * @param {X64Word} word The x64-Word to add with this word.
           *
           * @return {X64Word} A new x64-Word object after adding.
           *
           * @example
           *
           *     var added = x64Word.add(anotherX64Word);
           */
          // add: function (word) {
          // var low = (this.low + word.low) | 0;
          // var carry = (low >>> 0) < (this.low >>> 0) ? 1 : 0;
          // var high = (this.high + word.high + carry) | 0;
          // return X64Word.create(high, low);
          // }
        }), l.WordArray = c.extend({
          /**
           * Initializes a newly created word array.
           *
           * @param {Array} words (Optional) An array of CryptoJS.x64.Word objects.
           * @param {number} sigBytes (Optional) The number of significant bytes in the words.
           *
           * @example
           *
           *     var wordArray = CryptoJS.x64.WordArray.create();
           *
           *     var wordArray = CryptoJS.x64.WordArray.create([
           *         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
           *         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
           *     ]);
           *
           *     var wordArray = CryptoJS.x64.WordArray.create([
           *         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
           *         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
           *     ], 10);
           */
          init: function(i, u) {
            i = this.words = i || [], u != n ? this.sigBytes = u : this.sigBytes = i.length * 8;
          },
          /**
           * Converts this 64-bit word array to a 32-bit word array.
           *
           * @return {CryptoJS.lib.WordArray} This word array's data as a 32-bit word array.
           *
           * @example
           *
           *     var x32WordArray = x64WordArray.toX32();
           */
          toX32: function() {
            for (var i = this.words, u = i.length, h = [], d = 0; d < u; d++) {
              var f = i[d];
              h.push(f.high), h.push(f.low);
            }
            return a.create(h, this.sigBytes);
          },
          /**
           * Creates a copy of this word array.
           *
           * @return {X64WordArray} The clone.
           *
           * @example
           *
           *     var clone = x64WordArray.clone();
           */
          clone: function() {
            for (var i = c.clone.call(this), u = i.words = this.words.slice(0), h = u.length, d = 0; d < h; d++)
              u[d] = u[d].clone();
            return i;
          }
        });
      }(), t;
    });
  }(In)), In.exports;
}
var Nn = { exports: {} }, No;
function Du() {
  return No || (No = 1, function(r, e) {
    (function(t, n) {
      r.exports = n(K());
    })(z, function(t) {
      return function() {
        if (typeof ArrayBuffer == "function") {
          var n = t, o = n.lib, s = o.WordArray, c = s.init, a = s.init = function(l) {
            if (l instanceof ArrayBuffer && (l = new Uint8Array(l)), (l instanceof Int8Array || typeof Uint8ClampedArray < "u" && l instanceof Uint8ClampedArray || l instanceof Int16Array || l instanceof Uint16Array || l instanceof Int32Array || l instanceof Uint32Array || l instanceof Float32Array || l instanceof Float64Array) && (l = new Uint8Array(l.buffer, l.byteOffset, l.byteLength)), l instanceof Uint8Array) {
              for (var i = l.byteLength, u = [], h = 0; h < i; h++)
                u[h >>> 2] |= l[h] << 24 - h % 4 * 8;
              c.call(this, u, i);
            } else
              c.apply(this, arguments);
          };
          a.prototype = s;
        }
      }(), t.lib.WordArray;
    });
  }(Nn)), Nn.exports;
}
var Hn = { exports: {} }, Ho;
function Su() {
  return Ho || (Ho = 1, function(r, e) {
    (function(t, n) {
      r.exports = n(K());
    })(z, function(t) {
      return function() {
        var n = t, o = n.lib, s = o.WordArray, c = n.enc;
        c.Utf16 = c.Utf16BE = {
          /**
           * Converts a word array to a UTF-16 BE string.
           *
           * @param {WordArray} wordArray The word array.
           *
           * @return {string} The UTF-16 BE string.
           *
           * @static
           *
           * @example
           *
           *     var utf16String = CryptoJS.enc.Utf16.stringify(wordArray);
           */
          stringify: function(l) {
            for (var i = l.words, u = l.sigBytes, h = [], d = 0; d < u; d += 2) {
              var f = i[d >>> 2] >>> 16 - d % 4 * 8 & 65535;
              h.push(String.fromCharCode(f));
            }
            return h.join("");
          },
          /**
           * Converts a UTF-16 BE string to a word array.
           *
           * @param {string} utf16Str The UTF-16 BE string.
           *
           * @return {WordArray} The word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.enc.Utf16.parse(utf16String);
           */
          parse: function(l) {
            for (var i = l.length, u = [], h = 0; h < i; h++)
              u[h >>> 1] |= l.charCodeAt(h) << 16 - h % 2 * 16;
            return s.create(u, i * 2);
          }
        }, c.Utf16LE = {
          /**
           * Converts a word array to a UTF-16 LE string.
           *
           * @param {WordArray} wordArray The word array.
           *
           * @return {string} The UTF-16 LE string.
           *
           * @static
           *
           * @example
           *
           *     var utf16Str = CryptoJS.enc.Utf16LE.stringify(wordArray);
           */
          stringify: function(l) {
            for (var i = l.words, u = l.sigBytes, h = [], d = 0; d < u; d += 2) {
              var f = a(i[d >>> 2] >>> 16 - d % 4 * 8 & 65535);
              h.push(String.fromCharCode(f));
            }
            return h.join("");
          },
          /**
           * Converts a UTF-16 LE string to a word array.
           *
           * @param {string} utf16Str The UTF-16 LE string.
           *
           * @return {WordArray} The word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.enc.Utf16LE.parse(utf16Str);
           */
          parse: function(l) {
            for (var i = l.length, u = [], h = 0; h < i; h++)
              u[h >>> 1] |= a(l.charCodeAt(h) << 16 - h % 2 * 16);
            return s.create(u, i * 2);
          }
        };
        function a(l) {
          return l << 8 & 4278255360 | l >>> 8 & 16711935;
        }
      }(), t.enc.Utf16;
    });
  }(Hn)), Hn.exports;
}
var Pn = { exports: {} }, Po;
function _t() {
  return Po || (Po = 1, function(r, e) {
    (function(t, n) {
      r.exports = n(K());
    })(z, function(t) {
      return function() {
        var n = t, o = n.lib, s = o.WordArray, c = n.enc;
        c.Base64 = {
          /**
           * Converts a word array to a Base64 string.
           *
           * @param {WordArray} wordArray The word array.
           *
           * @return {string} The Base64 string.
           *
           * @static
           *
           * @example
           *
           *     var base64String = CryptoJS.enc.Base64.stringify(wordArray);
           */
          stringify: function(l) {
            var i = l.words, u = l.sigBytes, h = this._map;
            l.clamp();
            for (var d = [], f = 0; f < u; f += 3)
              for (var x = i[f >>> 2] >>> 24 - f % 4 * 8 & 255, w = i[f + 1 >>> 2] >>> 24 - (f + 1) % 4 * 8 & 255, v = i[f + 2 >>> 2] >>> 24 - (f + 2) % 4 * 8 & 255, b = x << 16 | w << 8 | v, p = 0; p < 4 && f + p * 0.75 < u; p++)
                d.push(h.charAt(b >>> 6 * (3 - p) & 63));
            var g = h.charAt(64);
            if (g)
              for (; d.length % 4; )
                d.push(g);
            return d.join("");
          },
          /**
           * Converts a Base64 string to a word array.
           *
           * @param {string} base64Str The Base64 string.
           *
           * @return {WordArray} The word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.enc.Base64.parse(base64String);
           */
          parse: function(l) {
            var i = l.length, u = this._map, h = this._reverseMap;
            if (!h) {
              h = this._reverseMap = [];
              for (var d = 0; d < u.length; d++)
                h[u.charCodeAt(d)] = d;
            }
            var f = u.charAt(64);
            if (f) {
              var x = l.indexOf(f);
              x !== -1 && (i = x);
            }
            return a(l, i, h);
          },
          _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
        };
        function a(l, i, u) {
          for (var h = [], d = 0, f = 0; f < i; f++)
            if (f % 4) {
              var x = u[l.charCodeAt(f - 1)] << f % 4 * 2, w = u[l.charCodeAt(f)] >>> 6 - f % 4 * 2, v = x | w;
              h[d >>> 2] |= v << 24 - d % 4 * 8, d++;
            }
          return s.create(h, d);
        }
      }(), t.enc.Base64;
    });
  }(Pn)), Pn.exports;
}
var Un = { exports: {} }, Uo;
function Fu() {
  return Uo || (Uo = 1, function(r, e) {
    (function(t, n) {
      r.exports = n(K());
    })(z, function(t) {
      return function() {
        var n = t, o = n.lib, s = o.WordArray, c = n.enc;
        c.Base64url = {
          /**
           * Converts a word array to a Base64url string.
           *
           * @param {WordArray} wordArray The word array.
           *
           * @param {boolean} urlSafe Whether to use url safe
           *
           * @return {string} The Base64url string.
           *
           * @static
           *
           * @example
           *
           *     var base64String = CryptoJS.enc.Base64url.stringify(wordArray);
           */
          stringify: function(l, i) {
            i === void 0 && (i = !0);
            var u = l.words, h = l.sigBytes, d = i ? this._safe_map : this._map;
            l.clamp();
            for (var f = [], x = 0; x < h; x += 3)
              for (var w = u[x >>> 2] >>> 24 - x % 4 * 8 & 255, v = u[x + 1 >>> 2] >>> 24 - (x + 1) % 4 * 8 & 255, b = u[x + 2 >>> 2] >>> 24 - (x + 2) % 4 * 8 & 255, p = w << 16 | v << 8 | b, g = 0; g < 4 && x + g * 0.75 < h; g++)
                f.push(d.charAt(p >>> 6 * (3 - g) & 63));
            var y = d.charAt(64);
            if (y)
              for (; f.length % 4; )
                f.push(y);
            return f.join("");
          },
          /**
           * Converts a Base64url string to a word array.
           *
           * @param {string} base64Str The Base64url string.
           *
           * @param {boolean} urlSafe Whether to use url safe
           *
           * @return {WordArray} The word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.enc.Base64url.parse(base64String);
           */
          parse: function(l, i) {
            i === void 0 && (i = !0);
            var u = l.length, h = i ? this._safe_map : this._map, d = this._reverseMap;
            if (!d) {
              d = this._reverseMap = [];
              for (var f = 0; f < h.length; f++)
                d[h.charCodeAt(f)] = f;
            }
            var x = h.charAt(64);
            if (x) {
              var w = l.indexOf(x);
              w !== -1 && (u = w);
            }
            return a(l, u, d);
          },
          _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
          _safe_map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"
        };
        function a(l, i, u) {
          for (var h = [], d = 0, f = 0; f < i; f++)
            if (f % 4) {
              var x = u[l.charCodeAt(f - 1)] << f % 4 * 2, w = u[l.charCodeAt(f)] >>> 6 - f % 4 * 2, v = x | w;
              h[d >>> 2] |= v << 24 - d % 4 * 8, d++;
            }
          return s.create(h, d);
        }
      }(), t.enc.Base64url;
    });
  }(Un)), Un.exports;
}
var Mn = { exports: {} }, Mo;
function Bt() {
  return Mo || (Mo = 1, function(r, e) {
    (function(t, n) {
      r.exports = n(K());
    })(z, function(t) {
      return function(n) {
        var o = t, s = o.lib, c = s.WordArray, a = s.Hasher, l = o.algo, i = [];
        (function() {
          for (var w = 0; w < 64; w++)
            i[w] = n.abs(n.sin(w + 1)) * 4294967296 | 0;
        })();
        var u = l.MD5 = a.extend({
          _doReset: function() {
            this._hash = new c.init([
              1732584193,
              4023233417,
              2562383102,
              271733878
            ]);
          },
          _doProcessBlock: function(w, v) {
            for (var b = 0; b < 16; b++) {
              var p = v + b, g = w[p];
              w[p] = (g << 8 | g >>> 24) & 16711935 | (g << 24 | g >>> 8) & 4278255360;
            }
            var y = this._hash.words, m = w[v + 0], _ = w[v + 1], E = w[v + 2], C = w[v + 3], D = w[v + 4], A = w[v + 5], k = w[v + 6], S = w[v + 7], F = w[v + 8], H = w[v + 9], U = w[v + 10], W = w[v + 11], X = w[v + 12], V = w[v + 13], Z = w[v + 14], q = w[v + 15], T = y[0], O = y[1], I = y[2], R = y[3];
            T = h(T, O, I, R, m, 7, i[0]), R = h(R, T, O, I, _, 12, i[1]), I = h(I, R, T, O, E, 17, i[2]), O = h(O, I, R, T, C, 22, i[3]), T = h(T, O, I, R, D, 7, i[4]), R = h(R, T, O, I, A, 12, i[5]), I = h(I, R, T, O, k, 17, i[6]), O = h(O, I, R, T, S, 22, i[7]), T = h(T, O, I, R, F, 7, i[8]), R = h(R, T, O, I, H, 12, i[9]), I = h(I, R, T, O, U, 17, i[10]), O = h(O, I, R, T, W, 22, i[11]), T = h(T, O, I, R, X, 7, i[12]), R = h(R, T, O, I, V, 12, i[13]), I = h(I, R, T, O, Z, 17, i[14]), O = h(O, I, R, T, q, 22, i[15]), T = d(T, O, I, R, _, 5, i[16]), R = d(R, T, O, I, k, 9, i[17]), I = d(I, R, T, O, W, 14, i[18]), O = d(O, I, R, T, m, 20, i[19]), T = d(T, O, I, R, A, 5, i[20]), R = d(R, T, O, I, U, 9, i[21]), I = d(I, R, T, O, q, 14, i[22]), O = d(O, I, R, T, D, 20, i[23]), T = d(T, O, I, R, H, 5, i[24]), R = d(R, T, O, I, Z, 9, i[25]), I = d(I, R, T, O, C, 14, i[26]), O = d(O, I, R, T, F, 20, i[27]), T = d(T, O, I, R, V, 5, i[28]), R = d(R, T, O, I, E, 9, i[29]), I = d(I, R, T, O, S, 14, i[30]), O = d(O, I, R, T, X, 20, i[31]), T = f(T, O, I, R, A, 4, i[32]), R = f(R, T, O, I, F, 11, i[33]), I = f(I, R, T, O, W, 16, i[34]), O = f(O, I, R, T, Z, 23, i[35]), T = f(T, O, I, R, _, 4, i[36]), R = f(R, T, O, I, D, 11, i[37]), I = f(I, R, T, O, S, 16, i[38]), O = f(O, I, R, T, U, 23, i[39]), T = f(T, O, I, R, V, 4, i[40]), R = f(R, T, O, I, m, 11, i[41]), I = f(I, R, T, O, C, 16, i[42]), O = f(O, I, R, T, k, 23, i[43]), T = f(T, O, I, R, H, 4, i[44]), R = f(R, T, O, I, X, 11, i[45]), I = f(I, R, T, O, q, 16, i[46]), O = f(O, I, R, T, E, 23, i[47]), T = x(T, O, I, R, m, 6, i[48]), R = x(R, T, O, I, S, 10, i[49]), I = x(I, R, T, O, Z, 15, i[50]), O = x(O, I, R, T, A, 21, i[51]), T = x(T, O, I, R, X, 6, i[52]), R = x(R, T, O, I, C, 10, i[53]), I = x(I, R, T, O, U, 15, i[54]), O = x(O, I, R, T, _, 21, i[55]), T = x(T, O, I, R, F, 6, i[56]), R = x(R, T, O, I, q, 10, i[57]), I = x(I, R, T, O, k, 15, i[58]), O = x(O, I, R, T, V, 21, i[59]), T = x(T, O, I, R, D, 6, i[60]), R = x(R, T, O, I, W, 10, i[61]), I = x(I, R, T, O, E, 15, i[62]), O = x(O, I, R, T, H, 21, i[63]), y[0] = y[0] + T | 0, y[1] = y[1] + O | 0, y[2] = y[2] + I | 0, y[3] = y[3] + R | 0;
          },
          _doFinalize: function() {
            var w = this._data, v = w.words, b = this._nDataBytes * 8, p = w.sigBytes * 8;
            v[p >>> 5] |= 128 << 24 - p % 32;
            var g = n.floor(b / 4294967296), y = b;
            v[(p + 64 >>> 9 << 4) + 15] = (g << 8 | g >>> 24) & 16711935 | (g << 24 | g >>> 8) & 4278255360, v[(p + 64 >>> 9 << 4) + 14] = (y << 8 | y >>> 24) & 16711935 | (y << 24 | y >>> 8) & 4278255360, w.sigBytes = (v.length + 1) * 4, this._process();
            for (var m = this._hash, _ = m.words, E = 0; E < 4; E++) {
              var C = _[E];
              _[E] = (C << 8 | C >>> 24) & 16711935 | (C << 24 | C >>> 8) & 4278255360;
            }
            return m;
          },
          clone: function() {
            var w = a.clone.call(this);
            return w._hash = this._hash.clone(), w;
          }
        });
        function h(w, v, b, p, g, y, m) {
          var _ = w + (v & b | ~v & p) + g + m;
          return (_ << y | _ >>> 32 - y) + v;
        }
        function d(w, v, b, p, g, y, m) {
          var _ = w + (v & p | b & ~p) + g + m;
          return (_ << y | _ >>> 32 - y) + v;
        }
        function f(w, v, b, p, g, y, m) {
          var _ = w + (v ^ b ^ p) + g + m;
          return (_ << y | _ >>> 32 - y) + v;
        }
        function x(w, v, b, p, g, y, m) {
          var _ = w + (b ^ (v | ~p)) + g + m;
          return (_ << y | _ >>> 32 - y) + v;
        }
        o.MD5 = a._createHelper(u), o.HmacMD5 = a._createHmacHelper(u);
      }(Math), t.MD5;
    });
  }(Mn)), Mn.exports;
}
var Ln = { exports: {} }, Lo;
function $i() {
  return Lo || (Lo = 1, function(r, e) {
    (function(t, n) {
      r.exports = n(K());
    })(z, function(t) {
      return function() {
        var n = t, o = n.lib, s = o.WordArray, c = o.Hasher, a = n.algo, l = [], i = a.SHA1 = c.extend({
          _doReset: function() {
            this._hash = new s.init([
              1732584193,
              4023233417,
              2562383102,
              271733878,
              3285377520
            ]);
          },
          _doProcessBlock: function(u, h) {
            for (var d = this._hash.words, f = d[0], x = d[1], w = d[2], v = d[3], b = d[4], p = 0; p < 80; p++) {
              if (p < 16)
                l[p] = u[h + p] | 0;
              else {
                var g = l[p - 3] ^ l[p - 8] ^ l[p - 14] ^ l[p - 16];
                l[p] = g << 1 | g >>> 31;
              }
              var y = (f << 5 | f >>> 27) + b + l[p];
              p < 20 ? y += (x & w | ~x & v) + 1518500249 : p < 40 ? y += (x ^ w ^ v) + 1859775393 : p < 60 ? y += (x & w | x & v | w & v) - 1894007588 : y += (x ^ w ^ v) - 899497514, b = v, v = w, w = x << 30 | x >>> 2, x = f, f = y;
            }
            d[0] = d[0] + f | 0, d[1] = d[1] + x | 0, d[2] = d[2] + w | 0, d[3] = d[3] + v | 0, d[4] = d[4] + b | 0;
          },
          _doFinalize: function() {
            var u = this._data, h = u.words, d = this._nDataBytes * 8, f = u.sigBytes * 8;
            return h[f >>> 5] |= 128 << 24 - f % 32, h[(f + 64 >>> 9 << 4) + 14] = Math.floor(d / 4294967296), h[(f + 64 >>> 9 << 4) + 15] = d, u.sigBytes = h.length * 4, this._process(), this._hash;
          },
          clone: function() {
            var u = c.clone.call(this);
            return u._hash = this._hash.clone(), u;
          }
        });
        n.SHA1 = c._createHelper(i), n.HmacSHA1 = c._createHmacHelper(i);
      }(), t.SHA1;
    });
  }(Ln)), Ln.exports;
}
var Wn = { exports: {} }, Wo;
function ro() {
  return Wo || (Wo = 1, function(r, e) {
    (function(t, n) {
      r.exports = n(K());
    })(z, function(t) {
      return function(n) {
        var o = t, s = o.lib, c = s.WordArray, a = s.Hasher, l = o.algo, i = [], u = [];
        (function() {
          function f(b) {
            for (var p = n.sqrt(b), g = 2; g <= p; g++)
              if (!(b % g))
                return !1;
            return !0;
          }
          function x(b) {
            return (b - (b | 0)) * 4294967296 | 0;
          }
          for (var w = 2, v = 0; v < 64; )
            f(w) && (v < 8 && (i[v] = x(n.pow(w, 1 / 2))), u[v] = x(n.pow(w, 1 / 3)), v++), w++;
        })();
        var h = [], d = l.SHA256 = a.extend({
          _doReset: function() {
            this._hash = new c.init(i.slice(0));
          },
          _doProcessBlock: function(f, x) {
            for (var w = this._hash.words, v = w[0], b = w[1], p = w[2], g = w[3], y = w[4], m = w[5], _ = w[6], E = w[7], C = 0; C < 64; C++) {
              if (C < 16)
                h[C] = f[x + C] | 0;
              else {
                var D = h[C - 15], A = (D << 25 | D >>> 7) ^ (D << 14 | D >>> 18) ^ D >>> 3, k = h[C - 2], S = (k << 15 | k >>> 17) ^ (k << 13 | k >>> 19) ^ k >>> 10;
                h[C] = A + h[C - 7] + S + h[C - 16];
              }
              var F = y & m ^ ~y & _, H = v & b ^ v & p ^ b & p, U = (v << 30 | v >>> 2) ^ (v << 19 | v >>> 13) ^ (v << 10 | v >>> 22), W = (y << 26 | y >>> 6) ^ (y << 21 | y >>> 11) ^ (y << 7 | y >>> 25), X = E + W + F + u[C] + h[C], V = U + H;
              E = _, _ = m, m = y, y = g + X | 0, g = p, p = b, b = v, v = X + V | 0;
            }
            w[0] = w[0] + v | 0, w[1] = w[1] + b | 0, w[2] = w[2] + p | 0, w[3] = w[3] + g | 0, w[4] = w[4] + y | 0, w[5] = w[5] + m | 0, w[6] = w[6] + _ | 0, w[7] = w[7] + E | 0;
          },
          _doFinalize: function() {
            var f = this._data, x = f.words, w = this._nDataBytes * 8, v = f.sigBytes * 8;
            return x[v >>> 5] |= 128 << 24 - v % 32, x[(v + 64 >>> 9 << 4) + 14] = n.floor(w / 4294967296), x[(v + 64 >>> 9 << 4) + 15] = w, f.sigBytes = x.length * 4, this._process(), this._hash;
          },
          clone: function() {
            var f = a.clone.call(this);
            return f._hash = this._hash.clone(), f;
          }
        });
        o.SHA256 = a._createHelper(d), o.HmacSHA256 = a._createHmacHelper(d);
      }(Math), t.SHA256;
    });
  }(Wn)), Wn.exports;
}
var zn = { exports: {} }, zo;
function Tu() {
  return zo || (zo = 1, function(r, e) {
    (function(t, n, o) {
      r.exports = n(K(), ro());
    })(z, function(t) {
      return function() {
        var n = t, o = n.lib, s = o.WordArray, c = n.algo, a = c.SHA256, l = c.SHA224 = a.extend({
          _doReset: function() {
            this._hash = new s.init([
              3238371032,
              914150663,
              812702999,
              4144912697,
              4290775857,
              1750603025,
              1694076839,
              3204075428
            ]);
          },
          _doFinalize: function() {
            var i = a._doFinalize.call(this);
            return i.sigBytes -= 4, i;
          }
        });
        n.SHA224 = a._createHelper(l), n.HmacSHA224 = a._createHmacHelper(l);
      }(), t.SHA224;
    });
  }(zn)), zn.exports;
}
var jn = { exports: {} }, jo;
function Vi() {
  return jo || (jo = 1, function(r, e) {
    (function(t, n, o) {
      r.exports = n(K(), un());
    })(z, function(t) {
      return function() {
        var n = t, o = n.lib, s = o.Hasher, c = n.x64, a = c.Word, l = c.WordArray, i = n.algo;
        function u() {
          return a.create.apply(a, arguments);
        }
        var h = [
          u(1116352408, 3609767458),
          u(1899447441, 602891725),
          u(3049323471, 3964484399),
          u(3921009573, 2173295548),
          u(961987163, 4081628472),
          u(1508970993, 3053834265),
          u(2453635748, 2937671579),
          u(2870763221, 3664609560),
          u(3624381080, 2734883394),
          u(310598401, 1164996542),
          u(607225278, 1323610764),
          u(1426881987, 3590304994),
          u(1925078388, 4068182383),
          u(2162078206, 991336113),
          u(2614888103, 633803317),
          u(3248222580, 3479774868),
          u(3835390401, 2666613458),
          u(4022224774, 944711139),
          u(264347078, 2341262773),
          u(604807628, 2007800933),
          u(770255983, 1495990901),
          u(1249150122, 1856431235),
          u(1555081692, 3175218132),
          u(1996064986, 2198950837),
          u(2554220882, 3999719339),
          u(2821834349, 766784016),
          u(2952996808, 2566594879),
          u(3210313671, 3203337956),
          u(3336571891, 1034457026),
          u(3584528711, 2466948901),
          u(113926993, 3758326383),
          u(338241895, 168717936),
          u(666307205, 1188179964),
          u(773529912, 1546045734),
          u(1294757372, 1522805485),
          u(1396182291, 2643833823),
          u(1695183700, 2343527390),
          u(1986661051, 1014477480),
          u(2177026350, 1206759142),
          u(2456956037, 344077627),
          u(2730485921, 1290863460),
          u(2820302411, 3158454273),
          u(3259730800, 3505952657),
          u(3345764771, 106217008),
          u(3516065817, 3606008344),
          u(3600352804, 1432725776),
          u(4094571909, 1467031594),
          u(275423344, 851169720),
          u(430227734, 3100823752),
          u(506948616, 1363258195),
          u(659060556, 3750685593),
          u(883997877, 3785050280),
          u(958139571, 3318307427),
          u(1322822218, 3812723403),
          u(1537002063, 2003034995),
          u(1747873779, 3602036899),
          u(1955562222, 1575990012),
          u(2024104815, 1125592928),
          u(2227730452, 2716904306),
          u(2361852424, 442776044),
          u(2428436474, 593698344),
          u(2756734187, 3733110249),
          u(3204031479, 2999351573),
          u(3329325298, 3815920427),
          u(3391569614, 3928383900),
          u(3515267271, 566280711),
          u(3940187606, 3454069534),
          u(4118630271, 4000239992),
          u(116418474, 1914138554),
          u(174292421, 2731055270),
          u(289380356, 3203993006),
          u(460393269, 320620315),
          u(685471733, 587496836),
          u(852142971, 1086792851),
          u(1017036298, 365543100),
          u(1126000580, 2618297676),
          u(1288033470, 3409855158),
          u(1501505948, 4234509866),
          u(1607167915, 987167468),
          u(1816402316, 1246189591)
        ], d = [];
        (function() {
          for (var x = 0; x < 80; x++)
            d[x] = u();
        })();
        var f = i.SHA512 = s.extend({
          _doReset: function() {
            this._hash = new l.init([
              new a.init(1779033703, 4089235720),
              new a.init(3144134277, 2227873595),
              new a.init(1013904242, 4271175723),
              new a.init(2773480762, 1595750129),
              new a.init(1359893119, 2917565137),
              new a.init(2600822924, 725511199),
              new a.init(528734635, 4215389547),
              new a.init(1541459225, 327033209)
            ]);
          },
          _doProcessBlock: function(x, w) {
            for (var v = this._hash.words, b = v[0], p = v[1], g = v[2], y = v[3], m = v[4], _ = v[5], E = v[6], C = v[7], D = b.high, A = b.low, k = p.high, S = p.low, F = g.high, H = g.low, U = y.high, W = y.low, X = m.high, V = m.low, Z = _.high, q = _.low, T = E.high, O = E.low, I = C.high, R = C.low, Q = D, G = A, ue = k, L = S, ze = F, Re = H, jt = U, Xe = W, Be = X, ye = V, je = Z, Oe = q, ft = T, Je = O, Qe = I, dt = R, Ce = 0; Ce < 80; Ce++) {
              var de, Ne, Dt = d[Ce];
              if (Ce < 16)
                Ne = Dt.high = x[w + Ce * 2] | 0, de = Dt.low = x[w + Ce * 2 + 1] | 0;
              else {
                var Kt = d[Ce - 15], Ke = Kt.high, et = Kt.low, bn = (Ke >>> 1 | et << 31) ^ (Ke >>> 8 | et << 24) ^ Ke >>> 7, $t = (et >>> 1 | Ke << 31) ^ (et >>> 8 | Ke << 24) ^ (et >>> 7 | Ke << 25), Vt = d[Ce - 2], tt = Vt.high, ht = Vt.low, mn = (tt >>> 19 | ht << 13) ^ (tt << 3 | ht >>> 29) ^ tt >>> 6, hr = (ht >>> 19 | tt << 13) ^ (ht << 3 | tt >>> 29) ^ (ht >>> 6 | tt << 26), xr = d[Ce - 7], En = xr.high, An = xr.low, St = d[Ce - 16], pr = St.high, $e = St.low;
                de = $t + An, Ne = bn + En + (de >>> 0 < $t >>> 0 ? 1 : 0), de = de + hr, Ne = Ne + mn + (de >>> 0 < hr >>> 0 ? 1 : 0), de = de + $e, Ne = Ne + pr + (de >>> 0 < $e >>> 0 ? 1 : 0), Dt.high = Ne, Dt.low = de;
              }
              var qt = Be & je ^ ~Be & ft, Ft = ye & Oe ^ ~ye & Je, gr = Q & ue ^ Q & ze ^ ue & ze, _n = G & L ^ G & Re ^ L & Re, yr = (Q >>> 28 | G << 4) ^ (Q << 30 | G >>> 2) ^ (Q << 25 | G >>> 7), vr = (G >>> 28 | Q << 4) ^ (G << 30 | Q >>> 2) ^ (G << 25 | Q >>> 7), wr = (Be >>> 14 | ye << 18) ^ (Be >>> 18 | ye << 14) ^ (Be << 23 | ye >>> 9), br = (ye >>> 14 | Be << 18) ^ (ye >>> 18 | Be << 14) ^ (ye << 23 | Be >>> 9), mr = h[Ce], Bn = mr.high, Gt = mr.low, he = dt + br, He = Qe + wr + (he >>> 0 < dt >>> 0 ? 1 : 0), he = he + Ft, He = He + qt + (he >>> 0 < Ft >>> 0 ? 1 : 0), he = he + Gt, He = He + Bn + (he >>> 0 < Gt >>> 0 ? 1 : 0), he = he + de, He = He + Ne + (he >>> 0 < de >>> 0 ? 1 : 0), Er = vr + _n, Cn = yr + gr + (Er >>> 0 < vr >>> 0 ? 1 : 0);
              Qe = ft, dt = Je, ft = je, Je = Oe, je = Be, Oe = ye, ye = Xe + he | 0, Be = jt + He + (ye >>> 0 < Xe >>> 0 ? 1 : 0) | 0, jt = ze, Xe = Re, ze = ue, Re = L, ue = Q, L = G, G = he + Er | 0, Q = He + Cn + (G >>> 0 < he >>> 0 ? 1 : 0) | 0;
            }
            A = b.low = A + G, b.high = D + Q + (A >>> 0 < G >>> 0 ? 1 : 0), S = p.low = S + L, p.high = k + ue + (S >>> 0 < L >>> 0 ? 1 : 0), H = g.low = H + Re, g.high = F + ze + (H >>> 0 < Re >>> 0 ? 1 : 0), W = y.low = W + Xe, y.high = U + jt + (W >>> 0 < Xe >>> 0 ? 1 : 0), V = m.low = V + ye, m.high = X + Be + (V >>> 0 < ye >>> 0 ? 1 : 0), q = _.low = q + Oe, _.high = Z + je + (q >>> 0 < Oe >>> 0 ? 1 : 0), O = E.low = O + Je, E.high = T + ft + (O >>> 0 < Je >>> 0 ? 1 : 0), R = C.low = R + dt, C.high = I + Qe + (R >>> 0 < dt >>> 0 ? 1 : 0);
          },
          _doFinalize: function() {
            var x = this._data, w = x.words, v = this._nDataBytes * 8, b = x.sigBytes * 8;
            w[b >>> 5] |= 128 << 24 - b % 32, w[(b + 128 >>> 10 << 5) + 30] = Math.floor(v / 4294967296), w[(b + 128 >>> 10 << 5) + 31] = v, x.sigBytes = w.length * 4, this._process();
            var p = this._hash.toX32();
            return p;
          },
          clone: function() {
            var x = s.clone.call(this);
            return x._hash = this._hash.clone(), x;
          },
          blockSize: 1024 / 32
        });
        n.SHA512 = s._createHelper(f), n.HmacSHA512 = s._createHmacHelper(f);
      }(), t.SHA512;
    });
  }(jn)), jn.exports;
}
var Kn = { exports: {} }, Ko;
function Ru() {
  return Ko || (Ko = 1, function(r, e) {
    (function(t, n, o) {
      r.exports = n(K(), un(), Vi());
    })(z, function(t) {
      return function() {
        var n = t, o = n.x64, s = o.Word, c = o.WordArray, a = n.algo, l = a.SHA512, i = a.SHA384 = l.extend({
          _doReset: function() {
            this._hash = new c.init([
              new s.init(3418070365, 3238371032),
              new s.init(1654270250, 914150663),
              new s.init(2438529370, 812702999),
              new s.init(355462360, 4144912697),
              new s.init(1731405415, 4290775857),
              new s.init(2394180231, 1750603025),
              new s.init(3675008525, 1694076839),
              new s.init(1203062813, 3204075428)
            ]);
          },
          _doFinalize: function() {
            var u = l._doFinalize.call(this);
            return u.sigBytes -= 16, u;
          }
        });
        n.SHA384 = l._createHelper(i), n.HmacSHA384 = l._createHmacHelper(i);
      }(), t.SHA384;
    });
  }(Kn)), Kn.exports;
}
var $n = { exports: {} }, $o;
function Ou() {
  return $o || ($o = 1, function(r, e) {
    (function(t, n, o) {
      r.exports = n(K(), un());
    })(z, function(t) {
      return function(n) {
        var o = t, s = o.lib, c = s.WordArray, a = s.Hasher, l = o.x64, i = l.Word, u = o.algo, h = [], d = [], f = [];
        (function() {
          for (var v = 1, b = 0, p = 0; p < 24; p++) {
            h[v + 5 * b] = (p + 1) * (p + 2) / 2 % 64;
            var g = b % 5, y = (2 * v + 3 * b) % 5;
            v = g, b = y;
          }
          for (var v = 0; v < 5; v++)
            for (var b = 0; b < 5; b++)
              d[v + 5 * b] = b + (2 * v + 3 * b) % 5 * 5;
          for (var m = 1, _ = 0; _ < 24; _++) {
            for (var E = 0, C = 0, D = 0; D < 7; D++) {
              if (m & 1) {
                var A = (1 << D) - 1;
                A < 32 ? C ^= 1 << A : E ^= 1 << A - 32;
              }
              m & 128 ? m = m << 1 ^ 113 : m <<= 1;
            }
            f[_] = i.create(E, C);
          }
        })();
        var x = [];
        (function() {
          for (var v = 0; v < 25; v++)
            x[v] = i.create();
        })();
        var w = u.SHA3 = a.extend({
          /**
           * Configuration options.
           *
           * @property {number} outputLength
           *   The desired number of bits in the output hash.
           *   Only values permitted are: 224, 256, 384, 512.
           *   Default: 512
           */
          cfg: a.cfg.extend({
            outputLength: 512
          }),
          _doReset: function() {
            for (var v = this._state = [], b = 0; b < 25; b++)
              v[b] = new i.init();
            this.blockSize = (1600 - 2 * this.cfg.outputLength) / 32;
          },
          _doProcessBlock: function(v, b) {
            for (var p = this._state, g = this.blockSize / 2, y = 0; y < g; y++) {
              var m = v[b + 2 * y], _ = v[b + 2 * y + 1];
              m = (m << 8 | m >>> 24) & 16711935 | (m << 24 | m >>> 8) & 4278255360, _ = (_ << 8 | _ >>> 24) & 16711935 | (_ << 24 | _ >>> 8) & 4278255360;
              var E = p[y];
              E.high ^= _, E.low ^= m;
            }
            for (var C = 0; C < 24; C++) {
              for (var D = 0; D < 5; D++) {
                for (var A = 0, k = 0, S = 0; S < 5; S++) {
                  var E = p[D + 5 * S];
                  A ^= E.high, k ^= E.low;
                }
                var F = x[D];
                F.high = A, F.low = k;
              }
              for (var D = 0; D < 5; D++)
                for (var H = x[(D + 4) % 5], U = x[(D + 1) % 5], W = U.high, X = U.low, A = H.high ^ (W << 1 | X >>> 31), k = H.low ^ (X << 1 | W >>> 31), S = 0; S < 5; S++) {
                  var E = p[D + 5 * S];
                  E.high ^= A, E.low ^= k;
                }
              for (var V = 1; V < 25; V++) {
                var A, k, E = p[V], Z = E.high, q = E.low, T = h[V];
                T < 32 ? (A = Z << T | q >>> 32 - T, k = q << T | Z >>> 32 - T) : (A = q << T - 32 | Z >>> 64 - T, k = Z << T - 32 | q >>> 64 - T);
                var O = x[d[V]];
                O.high = A, O.low = k;
              }
              var I = x[0], R = p[0];
              I.high = R.high, I.low = R.low;
              for (var D = 0; D < 5; D++)
                for (var S = 0; S < 5; S++) {
                  var V = D + 5 * S, E = p[V], Q = x[V], G = x[(D + 1) % 5 + 5 * S], ue = x[(D + 2) % 5 + 5 * S];
                  E.high = Q.high ^ ~G.high & ue.high, E.low = Q.low ^ ~G.low & ue.low;
                }
              var E = p[0], L = f[C];
              E.high ^= L.high, E.low ^= L.low;
            }
          },
          _doFinalize: function() {
            var v = this._data, b = v.words;
            this._nDataBytes * 8;
            var p = v.sigBytes * 8, g = this.blockSize * 32;
            b[p >>> 5] |= 1 << 24 - p % 32, b[(n.ceil((p + 1) / g) * g >>> 5) - 1] |= 128, v.sigBytes = b.length * 4, this._process();
            for (var y = this._state, m = this.cfg.outputLength / 8, _ = m / 8, E = [], C = 0; C < _; C++) {
              var D = y[C], A = D.high, k = D.low;
              A = (A << 8 | A >>> 24) & 16711935 | (A << 24 | A >>> 8) & 4278255360, k = (k << 8 | k >>> 24) & 16711935 | (k << 24 | k >>> 8) & 4278255360, E.push(k), E.push(A);
            }
            return new c.init(E, m);
          },
          clone: function() {
            for (var v = a.clone.call(this), b = v._state = this._state.slice(0), p = 0; p < 25; p++)
              b[p] = b[p].clone();
            return v;
          }
        });
        o.SHA3 = a._createHelper(w), o.HmacSHA3 = a._createHmacHelper(w);
      }(Math), t.SHA3;
    });
  }($n)), $n.exports;
}
var Vn = { exports: {} }, Vo;
function Iu() {
  return Vo || (Vo = 1, function(r, e) {
    (function(t, n) {
      r.exports = n(K());
    })(z, function(t) {
      /** @preserve
      			(c) 2012 by Cédric Mesnil. All rights reserved.
      
      			Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
      
      			    - Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
      			    - Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
      
      			THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
      			*/
      return function(n) {
        var o = t, s = o.lib, c = s.WordArray, a = s.Hasher, l = o.algo, i = c.create([
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15,
          7,
          4,
          13,
          1,
          10,
          6,
          15,
          3,
          12,
          0,
          9,
          5,
          2,
          14,
          11,
          8,
          3,
          10,
          14,
          4,
          9,
          15,
          8,
          1,
          2,
          7,
          0,
          6,
          13,
          11,
          5,
          12,
          1,
          9,
          11,
          10,
          0,
          8,
          12,
          4,
          13,
          3,
          7,
          15,
          14,
          5,
          6,
          2,
          4,
          0,
          5,
          9,
          7,
          12,
          2,
          10,
          14,
          1,
          3,
          8,
          11,
          6,
          15,
          13
        ]), u = c.create([
          5,
          14,
          7,
          0,
          9,
          2,
          11,
          4,
          13,
          6,
          15,
          8,
          1,
          10,
          3,
          12,
          6,
          11,
          3,
          7,
          0,
          13,
          5,
          10,
          14,
          15,
          8,
          12,
          4,
          9,
          1,
          2,
          15,
          5,
          1,
          3,
          7,
          14,
          6,
          9,
          11,
          8,
          12,
          2,
          10,
          0,
          4,
          13,
          8,
          6,
          4,
          1,
          3,
          11,
          15,
          0,
          5,
          12,
          2,
          13,
          9,
          7,
          10,
          14,
          12,
          15,
          10,
          4,
          1,
          5,
          8,
          7,
          6,
          2,
          13,
          14,
          0,
          3,
          9,
          11
        ]), h = c.create([
          11,
          14,
          15,
          12,
          5,
          8,
          7,
          9,
          11,
          13,
          14,
          15,
          6,
          7,
          9,
          8,
          7,
          6,
          8,
          13,
          11,
          9,
          7,
          15,
          7,
          12,
          15,
          9,
          11,
          7,
          13,
          12,
          11,
          13,
          6,
          7,
          14,
          9,
          13,
          15,
          14,
          8,
          13,
          6,
          5,
          12,
          7,
          5,
          11,
          12,
          14,
          15,
          14,
          15,
          9,
          8,
          9,
          14,
          5,
          6,
          8,
          6,
          5,
          12,
          9,
          15,
          5,
          11,
          6,
          8,
          13,
          12,
          5,
          12,
          13,
          14,
          11,
          8,
          5,
          6
        ]), d = c.create([
          8,
          9,
          9,
          11,
          13,
          15,
          15,
          5,
          7,
          7,
          8,
          11,
          14,
          14,
          12,
          6,
          9,
          13,
          15,
          7,
          12,
          8,
          9,
          11,
          7,
          7,
          12,
          7,
          6,
          15,
          13,
          11,
          9,
          7,
          15,
          11,
          8,
          6,
          6,
          14,
          12,
          13,
          5,
          14,
          13,
          13,
          7,
          5,
          15,
          5,
          8,
          11,
          14,
          14,
          6,
          14,
          6,
          9,
          12,
          9,
          12,
          5,
          15,
          8,
          8,
          5,
          12,
          9,
          12,
          5,
          14,
          6,
          8,
          13,
          6,
          5,
          15,
          13,
          11,
          11
        ]), f = c.create([0, 1518500249, 1859775393, 2400959708, 2840853838]), x = c.create([1352829926, 1548603684, 1836072691, 2053994217, 0]), w = l.RIPEMD160 = a.extend({
          _doReset: function() {
            this._hash = c.create([1732584193, 4023233417, 2562383102, 271733878, 3285377520]);
          },
          _doProcessBlock: function(_, E) {
            for (var C = 0; C < 16; C++) {
              var D = E + C, A = _[D];
              _[D] = (A << 8 | A >>> 24) & 16711935 | (A << 24 | A >>> 8) & 4278255360;
            }
            var k = this._hash.words, S = f.words, F = x.words, H = i.words, U = u.words, W = h.words, X = d.words, V, Z, q, T, O, I, R, Q, G, ue;
            I = V = k[0], R = Z = k[1], Q = q = k[2], G = T = k[3], ue = O = k[4];
            for (var L, C = 0; C < 80; C += 1)
              L = V + _[E + H[C]] | 0, C < 16 ? L += v(Z, q, T) + S[0] : C < 32 ? L += b(Z, q, T) + S[1] : C < 48 ? L += p(Z, q, T) + S[2] : C < 64 ? L += g(Z, q, T) + S[3] : L += y(Z, q, T) + S[4], L = L | 0, L = m(L, W[C]), L = L + O | 0, V = O, O = T, T = m(q, 10), q = Z, Z = L, L = I + _[E + U[C]] | 0, C < 16 ? L += y(R, Q, G) + F[0] : C < 32 ? L += g(R, Q, G) + F[1] : C < 48 ? L += p(R, Q, G) + F[2] : C < 64 ? L += b(R, Q, G) + F[3] : L += v(R, Q, G) + F[4], L = L | 0, L = m(L, X[C]), L = L + ue | 0, I = ue, ue = G, G = m(Q, 10), Q = R, R = L;
            L = k[1] + q + G | 0, k[1] = k[2] + T + ue | 0, k[2] = k[3] + O + I | 0, k[3] = k[4] + V + R | 0, k[4] = k[0] + Z + Q | 0, k[0] = L;
          },
          _doFinalize: function() {
            var _ = this._data, E = _.words, C = this._nDataBytes * 8, D = _.sigBytes * 8;
            E[D >>> 5] |= 128 << 24 - D % 32, E[(D + 64 >>> 9 << 4) + 14] = (C << 8 | C >>> 24) & 16711935 | (C << 24 | C >>> 8) & 4278255360, _.sigBytes = (E.length + 1) * 4, this._process();
            for (var A = this._hash, k = A.words, S = 0; S < 5; S++) {
              var F = k[S];
              k[S] = (F << 8 | F >>> 24) & 16711935 | (F << 24 | F >>> 8) & 4278255360;
            }
            return A;
          },
          clone: function() {
            var _ = a.clone.call(this);
            return _._hash = this._hash.clone(), _;
          }
        });
        function v(_, E, C) {
          return _ ^ E ^ C;
        }
        function b(_, E, C) {
          return _ & E | ~_ & C;
        }
        function p(_, E, C) {
          return (_ | ~E) ^ C;
        }
        function g(_, E, C) {
          return _ & C | E & ~C;
        }
        function y(_, E, C) {
          return _ ^ (E | ~C);
        }
        function m(_, E) {
          return _ << E | _ >>> 32 - E;
        }
        o.RIPEMD160 = a._createHelper(w), o.HmacRIPEMD160 = a._createHmacHelper(w);
      }(), t.RIPEMD160;
    });
  }(Vn)), Vn.exports;
}
var qn = { exports: {} }, qo;
function no() {
  return qo || (qo = 1, function(r, e) {
    (function(t, n) {
      r.exports = n(K());
    })(z, function(t) {
      (function() {
        var n = t, o = n.lib, s = o.Base, c = n.enc, a = c.Utf8, l = n.algo;
        l.HMAC = s.extend({
          /**
           * Initializes a newly created HMAC.
           *
           * @param {Hasher} hasher The hash algorithm to use.
           * @param {WordArray|string} key The secret key.
           *
           * @example
           *
           *     var hmacHasher = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, key);
           */
          init: function(i, u) {
            i = this._hasher = new i.init(), typeof u == "string" && (u = a.parse(u));
            var h = i.blockSize, d = h * 4;
            u.sigBytes > d && (u = i.finalize(u)), u.clamp();
            for (var f = this._oKey = u.clone(), x = this._iKey = u.clone(), w = f.words, v = x.words, b = 0; b < h; b++)
              w[b] ^= 1549556828, v[b] ^= 909522486;
            f.sigBytes = x.sigBytes = d, this.reset();
          },
          /**
           * Resets this HMAC to its initial state.
           *
           * @example
           *
           *     hmacHasher.reset();
           */
          reset: function() {
            var i = this._hasher;
            i.reset(), i.update(this._iKey);
          },
          /**
           * Updates this HMAC with a message.
           *
           * @param {WordArray|string} messageUpdate The message to append.
           *
           * @return {HMAC} This HMAC instance.
           *
           * @example
           *
           *     hmacHasher.update('message');
           *     hmacHasher.update(wordArray);
           */
          update: function(i) {
            return this._hasher.update(i), this;
          },
          /**
           * Finalizes the HMAC computation.
           * Note that the finalize operation is effectively a destructive, read-once operation.
           *
           * @param {WordArray|string} messageUpdate (Optional) A final message update.
           *
           * @return {WordArray} The HMAC.
           *
           * @example
           *
           *     var hmac = hmacHasher.finalize();
           *     var hmac = hmacHasher.finalize('message');
           *     var hmac = hmacHasher.finalize(wordArray);
           */
          finalize: function(i) {
            var u = this._hasher, h = u.finalize(i);
            u.reset();
            var d = u.finalize(this._oKey.clone().concat(h));
            return d;
          }
        });
      })();
    });
  }(qn)), qn.exports;
}
var Gn = { exports: {} }, Go;
function Nu() {
  return Go || (Go = 1, function(r, e) {
    (function(t, n, o) {
      r.exports = n(K(), ro(), no());
    })(z, function(t) {
      return function() {
        var n = t, o = n.lib, s = o.Base, c = o.WordArray, a = n.algo, l = a.SHA256, i = a.HMAC, u = a.PBKDF2 = s.extend({
          /**
           * Configuration options.
           *
           * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
           * @property {Hasher} hasher The hasher to use. Default: SHA256
           * @property {number} iterations The number of iterations to perform. Default: 250000
           */
          cfg: s.extend({
            keySize: 128 / 32,
            hasher: l,
            iterations: 25e4
          }),
          /**
           * Initializes a newly created key derivation function.
           *
           * @param {Object} cfg (Optional) The configuration options to use for the derivation.
           *
           * @example
           *
           *     var kdf = CryptoJS.algo.PBKDF2.create();
           *     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8 });
           *     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8, iterations: 1000 });
           */
          init: function(h) {
            this.cfg = this.cfg.extend(h);
          },
          /**
           * Computes the Password-Based Key Derivation Function 2.
           *
           * @param {WordArray|string} password The password.
           * @param {WordArray|string} salt A salt.
           *
           * @return {WordArray} The derived key.
           *
           * @example
           *
           *     var key = kdf.compute(password, salt);
           */
          compute: function(h, d) {
            for (var f = this.cfg, x = i.create(f.hasher, h), w = c.create(), v = c.create([1]), b = w.words, p = v.words, g = f.keySize, y = f.iterations; b.length < g; ) {
              var m = x.update(d).finalize(v);
              x.reset();
              for (var _ = m.words, E = _.length, C = m, D = 1; D < y; D++) {
                C = x.finalize(C), x.reset();
                for (var A = C.words, k = 0; k < E; k++)
                  _[k] ^= A[k];
              }
              w.concat(m), p[0]++;
            }
            return w.sigBytes = g * 4, w;
          }
        });
        n.PBKDF2 = function(h, d, f) {
          return u.create(f).compute(h, d);
        };
      }(), t.PBKDF2;
    });
  }(Gn)), Gn.exports;
}
var Yn = { exports: {} }, Yo;
function lt() {
  return Yo || (Yo = 1, function(r, e) {
    (function(t, n, o) {
      r.exports = n(K(), $i(), no());
    })(z, function(t) {
      return function() {
        var n = t, o = n.lib, s = o.Base, c = o.WordArray, a = n.algo, l = a.MD5, i = a.EvpKDF = s.extend({
          /**
           * Configuration options.
           *
           * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
           * @property {Hasher} hasher The hash algorithm to use. Default: MD5
           * @property {number} iterations The number of iterations to perform. Default: 1
           */
          cfg: s.extend({
            keySize: 128 / 32,
            hasher: l,
            iterations: 1
          }),
          /**
           * Initializes a newly created key derivation function.
           *
           * @param {Object} cfg (Optional) The configuration options to use for the derivation.
           *
           * @example
           *
           *     var kdf = CryptoJS.algo.EvpKDF.create();
           *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8 });
           *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8, iterations: 1000 });
           */
          init: function(u) {
            this.cfg = this.cfg.extend(u);
          },
          /**
           * Derives a key from a password.
           *
           * @param {WordArray|string} password The password.
           * @param {WordArray|string} salt A salt.
           *
           * @return {WordArray} The derived key.
           *
           * @example
           *
           *     var key = kdf.compute(password, salt);
           */
          compute: function(u, h) {
            for (var d, f = this.cfg, x = f.hasher.create(), w = c.create(), v = w.words, b = f.keySize, p = f.iterations; v.length < b; ) {
              d && x.update(d), d = x.update(u).finalize(h), x.reset();
              for (var g = 1; g < p; g++)
                d = x.finalize(d), x.reset();
              w.concat(d);
            }
            return w.sigBytes = b * 4, w;
          }
        });
        n.EvpKDF = function(u, h, d) {
          return i.create(d).compute(u, h);
        };
      }(), t.EvpKDF;
    });
  }(Yn)), Yn.exports;
}
var Zn = { exports: {} }, Zo;
function le() {
  return Zo || (Zo = 1, function(r, e) {
    (function(t, n, o) {
      r.exports = n(K(), lt());
    })(z, function(t) {
      t.lib.Cipher || function(n) {
        var o = t, s = o.lib, c = s.Base, a = s.WordArray, l = s.BufferedBlockAlgorithm, i = o.enc;
        i.Utf8;
        var u = i.Base64, h = o.algo, d = h.EvpKDF, f = s.Cipher = l.extend({
          /**
           * Configuration options.
           *
           * @property {WordArray} iv The IV to use for this operation.
           */
          cfg: c.extend(),
          /**
           * Creates this cipher in encryption mode.
           *
           * @param {WordArray} key The key.
           * @param {Object} cfg (Optional) The configuration options to use for this operation.
           *
           * @return {Cipher} A cipher instance.
           *
           * @static
           *
           * @example
           *
           *     var cipher = CryptoJS.algo.AES.createEncryptor(keyWordArray, { iv: ivWordArray });
           */
          createEncryptor: function(A, k) {
            return this.create(this._ENC_XFORM_MODE, A, k);
          },
          /**
           * Creates this cipher in decryption mode.
           *
           * @param {WordArray} key The key.
           * @param {Object} cfg (Optional) The configuration options to use for this operation.
           *
           * @return {Cipher} A cipher instance.
           *
           * @static
           *
           * @example
           *
           *     var cipher = CryptoJS.algo.AES.createDecryptor(keyWordArray, { iv: ivWordArray });
           */
          createDecryptor: function(A, k) {
            return this.create(this._DEC_XFORM_MODE, A, k);
          },
          /**
           * Initializes a newly created cipher.
           *
           * @param {number} xformMode Either the encryption or decryption transormation mode constant.
           * @param {WordArray} key The key.
           * @param {Object} cfg (Optional) The configuration options to use for this operation.
           *
           * @example
           *
           *     var cipher = CryptoJS.algo.AES.create(CryptoJS.algo.AES._ENC_XFORM_MODE, keyWordArray, { iv: ivWordArray });
           */
          init: function(A, k, S) {
            this.cfg = this.cfg.extend(S), this._xformMode = A, this._key = k, this.reset();
          },
          /**
           * Resets this cipher to its initial state.
           *
           * @example
           *
           *     cipher.reset();
           */
          reset: function() {
            l.reset.call(this), this._doReset();
          },
          /**
           * Adds data to be encrypted or decrypted.
           *
           * @param {WordArray|string} dataUpdate The data to encrypt or decrypt.
           *
           * @return {WordArray} The data after processing.
           *
           * @example
           *
           *     var encrypted = cipher.process('data');
           *     var encrypted = cipher.process(wordArray);
           */
          process: function(A) {
            return this._append(A), this._process();
          },
          /**
           * Finalizes the encryption or decryption process.
           * Note that the finalize operation is effectively a destructive, read-once operation.
           *
           * @param {WordArray|string} dataUpdate The final data to encrypt or decrypt.
           *
           * @return {WordArray} The data after final processing.
           *
           * @example
           *
           *     var encrypted = cipher.finalize();
           *     var encrypted = cipher.finalize('data');
           *     var encrypted = cipher.finalize(wordArray);
           */
          finalize: function(A) {
            A && this._append(A);
            var k = this._doFinalize();
            return k;
          },
          keySize: 128 / 32,
          ivSize: 128 / 32,
          _ENC_XFORM_MODE: 1,
          _DEC_XFORM_MODE: 2,
          /**
           * Creates shortcut functions to a cipher's object interface.
           *
           * @param {Cipher} cipher The cipher to create a helper for.
           *
           * @return {Object} An object with encrypt and decrypt shortcut functions.
           *
           * @static
           *
           * @example
           *
           *     var AES = CryptoJS.lib.Cipher._createHelper(CryptoJS.algo.AES);
           */
          _createHelper: /* @__PURE__ */ function() {
            function A(k) {
              return typeof k == "string" ? D : _;
            }
            return function(k) {
              return {
                encrypt: function(S, F, H) {
                  return A(F).encrypt(k, S, F, H);
                },
                decrypt: function(S, F, H) {
                  return A(F).decrypt(k, S, F, H);
                }
              };
            };
          }()
        });
        s.StreamCipher = f.extend({
          _doFinalize: function() {
            var A = this._process(!0);
            return A;
          },
          blockSize: 1
        });
        var x = o.mode = {}, w = s.BlockCipherMode = c.extend({
          /**
           * Creates this mode for encryption.
           *
           * @param {Cipher} cipher A block cipher instance.
           * @param {Array} iv The IV words.
           *
           * @static
           *
           * @example
           *
           *     var mode = CryptoJS.mode.CBC.createEncryptor(cipher, iv.words);
           */
          createEncryptor: function(A, k) {
            return this.Encryptor.create(A, k);
          },
          /**
           * Creates this mode for decryption.
           *
           * @param {Cipher} cipher A block cipher instance.
           * @param {Array} iv The IV words.
           *
           * @static
           *
           * @example
           *
           *     var mode = CryptoJS.mode.CBC.createDecryptor(cipher, iv.words);
           */
          createDecryptor: function(A, k) {
            return this.Decryptor.create(A, k);
          },
          /**
           * Initializes a newly created mode.
           *
           * @param {Cipher} cipher A block cipher instance.
           * @param {Array} iv The IV words.
           *
           * @example
           *
           *     var mode = CryptoJS.mode.CBC.Encryptor.create(cipher, iv.words);
           */
          init: function(A, k) {
            this._cipher = A, this._iv = k;
          }
        }), v = x.CBC = function() {
          var A = w.extend();
          A.Encryptor = A.extend({
            /**
             * Processes the data block at offset.
             *
             * @param {Array} words The data words to operate on.
             * @param {number} offset The offset where the block starts.
             *
             * @example
             *
             *     mode.processBlock(data.words, offset);
             */
            processBlock: function(S, F) {
              var H = this._cipher, U = H.blockSize;
              k.call(this, S, F, U), H.encryptBlock(S, F), this._prevBlock = S.slice(F, F + U);
            }
          }), A.Decryptor = A.extend({
            /**
             * Processes the data block at offset.
             *
             * @param {Array} words The data words to operate on.
             * @param {number} offset The offset where the block starts.
             *
             * @example
             *
             *     mode.processBlock(data.words, offset);
             */
            processBlock: function(S, F) {
              var H = this._cipher, U = H.blockSize, W = S.slice(F, F + U);
              H.decryptBlock(S, F), k.call(this, S, F, U), this._prevBlock = W;
            }
          });
          function k(S, F, H) {
            var U, W = this._iv;
            W ? (U = W, this._iv = n) : U = this._prevBlock;
            for (var X = 0; X < H; X++)
              S[F + X] ^= U[X];
          }
          return A;
        }(), b = o.pad = {}, p = b.Pkcs7 = {
          /**
           * Pads data using the algorithm defined in PKCS #5/7.
           *
           * @param {WordArray} data The data to pad.
           * @param {number} blockSize The multiple that the data should be padded to.
           *
           * @static
           *
           * @example
           *
           *     CryptoJS.pad.Pkcs7.pad(wordArray, 4);
           */
          pad: function(A, k) {
            for (var S = k * 4, F = S - A.sigBytes % S, H = F << 24 | F << 16 | F << 8 | F, U = [], W = 0; W < F; W += 4)
              U.push(H);
            var X = a.create(U, F);
            A.concat(X);
          },
          /**
           * Unpads data that had been padded using the algorithm defined in PKCS #5/7.
           *
           * @param {WordArray} data The data to unpad.
           *
           * @static
           *
           * @example
           *
           *     CryptoJS.pad.Pkcs7.unpad(wordArray);
           */
          unpad: function(A) {
            var k = A.words[A.sigBytes - 1 >>> 2] & 255;
            A.sigBytes -= k;
          }
        };
        s.BlockCipher = f.extend({
          /**
           * Configuration options.
           *
           * @property {Mode} mode The block mode to use. Default: CBC
           * @property {Padding} padding The padding strategy to use. Default: Pkcs7
           */
          cfg: f.cfg.extend({
            mode: v,
            padding: p
          }),
          reset: function() {
            var A;
            f.reset.call(this);
            var k = this.cfg, S = k.iv, F = k.mode;
            this._xformMode == this._ENC_XFORM_MODE ? A = F.createEncryptor : (A = F.createDecryptor, this._minBufferSize = 1), this._mode && this._mode.__creator == A ? this._mode.init(this, S && S.words) : (this._mode = A.call(F, this, S && S.words), this._mode.__creator = A);
          },
          _doProcessBlock: function(A, k) {
            this._mode.processBlock(A, k);
          },
          _doFinalize: function() {
            var A, k = this.cfg.padding;
            return this._xformMode == this._ENC_XFORM_MODE ? (k.pad(this._data, this.blockSize), A = this._process(!0)) : (A = this._process(!0), k.unpad(A)), A;
          },
          blockSize: 128 / 32
        });
        var g = s.CipherParams = c.extend({
          /**
           * Initializes a newly created cipher params object.
           *
           * @param {Object} cipherParams An object with any of the possible cipher parameters.
           *
           * @example
           *
           *     var cipherParams = CryptoJS.lib.CipherParams.create({
           *         ciphertext: ciphertextWordArray,
           *         key: keyWordArray,
           *         iv: ivWordArray,
           *         salt: saltWordArray,
           *         algorithm: CryptoJS.algo.AES,
           *         mode: CryptoJS.mode.CBC,
           *         padding: CryptoJS.pad.PKCS7,
           *         blockSize: 4,
           *         formatter: CryptoJS.format.OpenSSL
           *     });
           */
          init: function(A) {
            this.mixIn(A);
          },
          /**
           * Converts this cipher params object to a string.
           *
           * @param {Format} formatter (Optional) The formatting strategy to use.
           *
           * @return {string} The stringified cipher params.
           *
           * @throws Error If neither the formatter nor the default formatter is set.
           *
           * @example
           *
           *     var string = cipherParams + '';
           *     var string = cipherParams.toString();
           *     var string = cipherParams.toString(CryptoJS.format.OpenSSL);
           */
          toString: function(A) {
            return (A || this.formatter).stringify(this);
          }
        }), y = o.format = {}, m = y.OpenSSL = {
          /**
           * Converts a cipher params object to an OpenSSL-compatible string.
           *
           * @param {CipherParams} cipherParams The cipher params object.
           *
           * @return {string} The OpenSSL-compatible string.
           *
           * @static
           *
           * @example
           *
           *     var openSSLString = CryptoJS.format.OpenSSL.stringify(cipherParams);
           */
          stringify: function(A) {
            var k, S = A.ciphertext, F = A.salt;
            return F ? k = a.create([1398893684, 1701076831]).concat(F).concat(S) : k = S, k.toString(u);
          },
          /**
           * Converts an OpenSSL-compatible string to a cipher params object.
           *
           * @param {string} openSSLStr The OpenSSL-compatible string.
           *
           * @return {CipherParams} The cipher params object.
           *
           * @static
           *
           * @example
           *
           *     var cipherParams = CryptoJS.format.OpenSSL.parse(openSSLString);
           */
          parse: function(A) {
            var k, S = u.parse(A), F = S.words;
            return F[0] == 1398893684 && F[1] == 1701076831 && (k = a.create(F.slice(2, 4)), F.splice(0, 4), S.sigBytes -= 16), g.create({ ciphertext: S, salt: k });
          }
        }, _ = s.SerializableCipher = c.extend({
          /**
           * Configuration options.
           *
           * @property {Formatter} format The formatting strategy to convert cipher param objects to and from a string. Default: OpenSSL
           */
          cfg: c.extend({
            format: m
          }),
          /**
           * Encrypts a message.
           *
           * @param {Cipher} cipher The cipher algorithm to use.
           * @param {WordArray|string} message The message to encrypt.
           * @param {WordArray} key The key.
           * @param {Object} cfg (Optional) The configuration options to use for this operation.
           *
           * @return {CipherParams} A cipher params object.
           *
           * @static
           *
           * @example
           *
           *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key);
           *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv });
           *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv, format: CryptoJS.format.OpenSSL });
           */
          encrypt: function(A, k, S, F) {
            F = this.cfg.extend(F);
            var H = A.createEncryptor(S, F), U = H.finalize(k), W = H.cfg;
            return g.create({
              ciphertext: U,
              key: S,
              iv: W.iv,
              algorithm: A,
              mode: W.mode,
              padding: W.padding,
              blockSize: A.blockSize,
              formatter: F.format
            });
          },
          /**
           * Decrypts serialized ciphertext.
           *
           * @param {Cipher} cipher The cipher algorithm to use.
           * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
           * @param {WordArray} key The key.
           * @param {Object} cfg (Optional) The configuration options to use for this operation.
           *
           * @return {WordArray} The plaintext.
           *
           * @static
           *
           * @example
           *
           *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, key, { iv: iv, format: CryptoJS.format.OpenSSL });
           *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, key, { iv: iv, format: CryptoJS.format.OpenSSL });
           */
          decrypt: function(A, k, S, F) {
            F = this.cfg.extend(F), k = this._parse(k, F.format);
            var H = A.createDecryptor(S, F).finalize(k.ciphertext);
            return H;
          },
          /**
           * Converts serialized ciphertext to CipherParams,
           * else assumed CipherParams already and returns ciphertext unchanged.
           *
           * @param {CipherParams|string} ciphertext The ciphertext.
           * @param {Formatter} format The formatting strategy to use to parse serialized ciphertext.
           *
           * @return {CipherParams} The unserialized ciphertext.
           *
           * @static
           *
           * @example
           *
           *     var ciphertextParams = CryptoJS.lib.SerializableCipher._parse(ciphertextStringOrParams, format);
           */
          _parse: function(A, k) {
            return typeof A == "string" ? k.parse(A, this) : A;
          }
        }), E = o.kdf = {}, C = E.OpenSSL = {
          /**
           * Derives a key and IV from a password.
           *
           * @param {string} password The password to derive from.
           * @param {number} keySize The size in words of the key to generate.
           * @param {number} ivSize The size in words of the IV to generate.
           * @param {WordArray|string} salt (Optional) A 64-bit salt to use. If omitted, a salt will be generated randomly.
           *
           * @return {CipherParams} A cipher params object with the key, IV, and salt.
           *
           * @static
           *
           * @example
           *
           *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32);
           *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32, 'saltsalt');
           */
          execute: function(A, k, S, F, H) {
            if (F || (F = a.random(64 / 8)), H)
              var U = d.create({ keySize: k + S, hasher: H }).compute(A, F);
            else
              var U = d.create({ keySize: k + S }).compute(A, F);
            var W = a.create(U.words.slice(k), S * 4);
            return U.sigBytes = k * 4, g.create({ key: U, iv: W, salt: F });
          }
        }, D = s.PasswordBasedCipher = _.extend({
          /**
           * Configuration options.
           *
           * @property {KDF} kdf The key derivation function to use to generate a key and IV from a password. Default: OpenSSL
           */
          cfg: _.cfg.extend({
            kdf: C
          }),
          /**
           * Encrypts a message using a password.
           *
           * @param {Cipher} cipher The cipher algorithm to use.
           * @param {WordArray|string} message The message to encrypt.
           * @param {string} password The password.
           * @param {Object} cfg (Optional) The configuration options to use for this operation.
           *
           * @return {CipherParams} A cipher params object.
           *
           * @static
           *
           * @example
           *
           *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password');
           *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password', { format: CryptoJS.format.OpenSSL });
           */
          encrypt: function(A, k, S, F) {
            F = this.cfg.extend(F);
            var H = F.kdf.execute(S, A.keySize, A.ivSize, F.salt, F.hasher);
            F.iv = H.iv;
            var U = _.encrypt.call(this, A, k, H.key, F);
            return U.mixIn(H), U;
          },
          /**
           * Decrypts serialized ciphertext using a password.
           *
           * @param {Cipher} cipher The cipher algorithm to use.
           * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
           * @param {string} password The password.
           * @param {Object} cfg (Optional) The configuration options to use for this operation.
           *
           * @return {WordArray} The plaintext.
           *
           * @static
           *
           * @example
           *
           *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, 'password', { format: CryptoJS.format.OpenSSL });
           *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, 'password', { format: CryptoJS.format.OpenSSL });
           */
          decrypt: function(A, k, S, F) {
            F = this.cfg.extend(F), k = this._parse(k, F.format);
            var H = F.kdf.execute(S, A.keySize, A.ivSize, k.salt, F.hasher);
            F.iv = H.iv;
            var U = _.decrypt.call(this, A, k, H.key, F);
            return U;
          }
        });
      }();
    });
  }(Zn)), Zn.exports;
}
var Xn = { exports: {} }, Xo;
function Hu() {
  return Xo || (Xo = 1, function(r, e) {
    (function(t, n, o) {
      r.exports = n(K(), le());
    })(z, function(t) {
      return t.mode.CFB = function() {
        var n = t.lib.BlockCipherMode.extend();
        n.Encryptor = n.extend({
          processBlock: function(s, c) {
            var a = this._cipher, l = a.blockSize;
            o.call(this, s, c, l, a), this._prevBlock = s.slice(c, c + l);
          }
        }), n.Decryptor = n.extend({
          processBlock: function(s, c) {
            var a = this._cipher, l = a.blockSize, i = s.slice(c, c + l);
            o.call(this, s, c, l, a), this._prevBlock = i;
          }
        });
        function o(s, c, a, l) {
          var i, u = this._iv;
          u ? (i = u.slice(0), this._iv = void 0) : i = this._prevBlock, l.encryptBlock(i, 0);
          for (var h = 0; h < a; h++)
            s[c + h] ^= i[h];
        }
        return n;
      }(), t.mode.CFB;
    });
  }(Xn)), Xn.exports;
}
var Jn = { exports: {} }, Jo;
function Pu() {
  return Jo || (Jo = 1, function(r, e) {
    (function(t, n, o) {
      r.exports = n(K(), le());
    })(z, function(t) {
      return t.mode.CTR = function() {
        var n = t.lib.BlockCipherMode.extend(), o = n.Encryptor = n.extend({
          processBlock: function(s, c) {
            var a = this._cipher, l = a.blockSize, i = this._iv, u = this._counter;
            i && (u = this._counter = i.slice(0), this._iv = void 0);
            var h = u.slice(0);
            a.encryptBlock(h, 0), u[l - 1] = u[l - 1] + 1 | 0;
            for (var d = 0; d < l; d++)
              s[c + d] ^= h[d];
          }
        });
        return n.Decryptor = o, n;
      }(), t.mode.CTR;
    });
  }(Jn)), Jn.exports;
}
var Qn = { exports: {} }, Qo;
function Uu() {
  return Qo || (Qo = 1, function(r, e) {
    (function(t, n, o) {
      r.exports = n(K(), le());
    })(z, function(t) {
      /** @preserve
       * Counter block mode compatible with  Dr Brian Gladman fileenc.c
       * derived from CryptoJS.mode.CTR
       * Jan Hruby jhruby.web@gmail.com
       */
      return t.mode.CTRGladman = function() {
        var n = t.lib.BlockCipherMode.extend();
        function o(a) {
          if ((a >> 24 & 255) === 255) {
            var l = a >> 16 & 255, i = a >> 8 & 255, u = a & 255;
            l === 255 ? (l = 0, i === 255 ? (i = 0, u === 255 ? u = 0 : ++u) : ++i) : ++l, a = 0, a += l << 16, a += i << 8, a += u;
          } else
            a += 1 << 24;
          return a;
        }
        function s(a) {
          return (a[0] = o(a[0])) === 0 && (a[1] = o(a[1])), a;
        }
        var c = n.Encryptor = n.extend({
          processBlock: function(a, l) {
            var i = this._cipher, u = i.blockSize, h = this._iv, d = this._counter;
            h && (d = this._counter = h.slice(0), this._iv = void 0), s(d);
            var f = d.slice(0);
            i.encryptBlock(f, 0);
            for (var x = 0; x < u; x++)
              a[l + x] ^= f[x];
          }
        });
        return n.Decryptor = c, n;
      }(), t.mode.CTRGladman;
    });
  }(Qn)), Qn.exports;
}
var e0 = { exports: {} }, es;
function Mu() {
  return es || (es = 1, function(r, e) {
    (function(t, n, o) {
      r.exports = n(K(), le());
    })(z, function(t) {
      return t.mode.OFB = function() {
        var n = t.lib.BlockCipherMode.extend(), o = n.Encryptor = n.extend({
          processBlock: function(s, c) {
            var a = this._cipher, l = a.blockSize, i = this._iv, u = this._keystream;
            i && (u = this._keystream = i.slice(0), this._iv = void 0), a.encryptBlock(u, 0);
            for (var h = 0; h < l; h++)
              s[c + h] ^= u[h];
          }
        });
        return n.Decryptor = o, n;
      }(), t.mode.OFB;
    });
  }(e0)), e0.exports;
}
var t0 = { exports: {} }, ts;
function Lu() {
  return ts || (ts = 1, function(r, e) {
    (function(t, n, o) {
      r.exports = n(K(), le());
    })(z, function(t) {
      return t.mode.ECB = function() {
        var n = t.lib.BlockCipherMode.extend();
        return n.Encryptor = n.extend({
          processBlock: function(o, s) {
            this._cipher.encryptBlock(o, s);
          }
        }), n.Decryptor = n.extend({
          processBlock: function(o, s) {
            this._cipher.decryptBlock(o, s);
          }
        }), n;
      }(), t.mode.ECB;
    });
  }(t0)), t0.exports;
}
var r0 = { exports: {} }, rs;
function Wu() {
  return rs || (rs = 1, function(r, e) {
    (function(t, n, o) {
      r.exports = n(K(), le());
    })(z, function(t) {
      return t.pad.AnsiX923 = {
        pad: function(n, o) {
          var s = n.sigBytes, c = o * 4, a = c - s % c, l = s + a - 1;
          n.clamp(), n.words[l >>> 2] |= a << 24 - l % 4 * 8, n.sigBytes += a;
        },
        unpad: function(n) {
          var o = n.words[n.sigBytes - 1 >>> 2] & 255;
          n.sigBytes -= o;
        }
      }, t.pad.Ansix923;
    });
  }(r0)), r0.exports;
}
var n0 = { exports: {} }, ns;
function zu() {
  return ns || (ns = 1, function(r, e) {
    (function(t, n, o) {
      r.exports = n(K(), le());
    })(z, function(t) {
      return t.pad.Iso10126 = {
        pad: function(n, o) {
          var s = o * 4, c = s - n.sigBytes % s;
          n.concat(t.lib.WordArray.random(c - 1)).concat(t.lib.WordArray.create([c << 24], 1));
        },
        unpad: function(n) {
          var o = n.words[n.sigBytes - 1 >>> 2] & 255;
          n.sigBytes -= o;
        }
      }, t.pad.Iso10126;
    });
  }(n0)), n0.exports;
}
var o0 = { exports: {} }, os;
function ju() {
  return os || (os = 1, function(r, e) {
    (function(t, n, o) {
      r.exports = n(K(), le());
    })(z, function(t) {
      return t.pad.Iso97971 = {
        pad: function(n, o) {
          n.concat(t.lib.WordArray.create([2147483648], 1)), t.pad.ZeroPadding.pad(n, o);
        },
        unpad: function(n) {
          t.pad.ZeroPadding.unpad(n), n.sigBytes--;
        }
      }, t.pad.Iso97971;
    });
  }(o0)), o0.exports;
}
var s0 = { exports: {} }, ss;
function Ku() {
  return ss || (ss = 1, function(r, e) {
    (function(t, n, o) {
      r.exports = n(K(), le());
    })(z, function(t) {
      return t.pad.ZeroPadding = {
        pad: function(n, o) {
          var s = o * 4;
          n.clamp(), n.sigBytes += s - (n.sigBytes % s || s);
        },
        unpad: function(n) {
          for (var o = n.words, s = n.sigBytes - 1, s = n.sigBytes - 1; s >= 0; s--)
            if (o[s >>> 2] >>> 24 - s % 4 * 8 & 255) {
              n.sigBytes = s + 1;
              break;
            }
        }
      }, t.pad.ZeroPadding;
    });
  }(s0)), s0.exports;
}
var i0 = { exports: {} }, is;
function $u() {
  return is || (is = 1, function(r, e) {
    (function(t, n, o) {
      r.exports = n(K(), le());
    })(z, function(t) {
      return t.pad.NoPadding = {
        pad: function() {
        },
        unpad: function() {
        }
      }, t.pad.NoPadding;
    });
  }(i0)), i0.exports;
}
var a0 = { exports: {} }, as;
function Vu() {
  return as || (as = 1, function(r, e) {
    (function(t, n, o) {
      r.exports = n(K(), le());
    })(z, function(t) {
      return function(n) {
        var o = t, s = o.lib, c = s.CipherParams, a = o.enc, l = a.Hex, i = o.format;
        i.Hex = {
          /**
           * Converts the ciphertext of a cipher params object to a hexadecimally encoded string.
           *
           * @param {CipherParams} cipherParams The cipher params object.
           *
           * @return {string} The hexadecimally encoded string.
           *
           * @static
           *
           * @example
           *
           *     var hexString = CryptoJS.format.Hex.stringify(cipherParams);
           */
          stringify: function(u) {
            return u.ciphertext.toString(l);
          },
          /**
           * Converts a hexadecimally encoded ciphertext string to a cipher params object.
           *
           * @param {string} input The hexadecimally encoded string.
           *
           * @return {CipherParams} The cipher params object.
           *
           * @static
           *
           * @example
           *
           *     var cipherParams = CryptoJS.format.Hex.parse(hexString);
           */
          parse: function(u) {
            var h = l.parse(u);
            return c.create({ ciphertext: h });
          }
        };
      }(), t.format.Hex;
    });
  }(a0)), a0.exports;
}
var c0 = { exports: {} }, cs;
function qu() {
  return cs || (cs = 1, function(r, e) {
    (function(t, n, o) {
      r.exports = n(K(), _t(), Bt(), lt(), le());
    })(z, function(t) {
      return function() {
        var n = t, o = n.lib, s = o.BlockCipher, c = n.algo, a = [], l = [], i = [], u = [], h = [], d = [], f = [], x = [], w = [], v = [];
        (function() {
          for (var g = [], y = 0; y < 256; y++)
            y < 128 ? g[y] = y << 1 : g[y] = y << 1 ^ 283;
          for (var m = 0, _ = 0, y = 0; y < 256; y++) {
            var E = _ ^ _ << 1 ^ _ << 2 ^ _ << 3 ^ _ << 4;
            E = E >>> 8 ^ E & 255 ^ 99, a[m] = E, l[E] = m;
            var C = g[m], D = g[C], A = g[D], k = g[E] * 257 ^ E * 16843008;
            i[m] = k << 24 | k >>> 8, u[m] = k << 16 | k >>> 16, h[m] = k << 8 | k >>> 24, d[m] = k;
            var k = A * 16843009 ^ D * 65537 ^ C * 257 ^ m * 16843008;
            f[E] = k << 24 | k >>> 8, x[E] = k << 16 | k >>> 16, w[E] = k << 8 | k >>> 24, v[E] = k, m ? (m = C ^ g[g[g[A ^ C]]], _ ^= g[g[_]]) : m = _ = 1;
          }
        })();
        var b = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54], p = c.AES = s.extend({
          _doReset: function() {
            var g;
            if (!(this._nRounds && this._keyPriorReset === this._key)) {
              for (var y = this._keyPriorReset = this._key, m = y.words, _ = y.sigBytes / 4, E = this._nRounds = _ + 6, C = (E + 1) * 4, D = this._keySchedule = [], A = 0; A < C; A++)
                A < _ ? D[A] = m[A] : (g = D[A - 1], A % _ ? _ > 6 && A % _ == 4 && (g = a[g >>> 24] << 24 | a[g >>> 16 & 255] << 16 | a[g >>> 8 & 255] << 8 | a[g & 255]) : (g = g << 8 | g >>> 24, g = a[g >>> 24] << 24 | a[g >>> 16 & 255] << 16 | a[g >>> 8 & 255] << 8 | a[g & 255], g ^= b[A / _ | 0] << 24), D[A] = D[A - _] ^ g);
              for (var k = this._invKeySchedule = [], S = 0; S < C; S++) {
                var A = C - S;
                if (S % 4)
                  var g = D[A];
                else
                  var g = D[A - 4];
                S < 4 || A <= 4 ? k[S] = g : k[S] = f[a[g >>> 24]] ^ x[a[g >>> 16 & 255]] ^ w[a[g >>> 8 & 255]] ^ v[a[g & 255]];
              }
            }
          },
          encryptBlock: function(g, y) {
            this._doCryptBlock(g, y, this._keySchedule, i, u, h, d, a);
          },
          decryptBlock: function(g, y) {
            var m = g[y + 1];
            g[y + 1] = g[y + 3], g[y + 3] = m, this._doCryptBlock(g, y, this._invKeySchedule, f, x, w, v, l);
            var m = g[y + 1];
            g[y + 1] = g[y + 3], g[y + 3] = m;
          },
          _doCryptBlock: function(g, y, m, _, E, C, D, A) {
            for (var k = this._nRounds, S = g[y] ^ m[0], F = g[y + 1] ^ m[1], H = g[y + 2] ^ m[2], U = g[y + 3] ^ m[3], W = 4, X = 1; X < k; X++) {
              var V = _[S >>> 24] ^ E[F >>> 16 & 255] ^ C[H >>> 8 & 255] ^ D[U & 255] ^ m[W++], Z = _[F >>> 24] ^ E[H >>> 16 & 255] ^ C[U >>> 8 & 255] ^ D[S & 255] ^ m[W++], q = _[H >>> 24] ^ E[U >>> 16 & 255] ^ C[S >>> 8 & 255] ^ D[F & 255] ^ m[W++], T = _[U >>> 24] ^ E[S >>> 16 & 255] ^ C[F >>> 8 & 255] ^ D[H & 255] ^ m[W++];
              S = V, F = Z, H = q, U = T;
            }
            var V = (A[S >>> 24] << 24 | A[F >>> 16 & 255] << 16 | A[H >>> 8 & 255] << 8 | A[U & 255]) ^ m[W++], Z = (A[F >>> 24] << 24 | A[H >>> 16 & 255] << 16 | A[U >>> 8 & 255] << 8 | A[S & 255]) ^ m[W++], q = (A[H >>> 24] << 24 | A[U >>> 16 & 255] << 16 | A[S >>> 8 & 255] << 8 | A[F & 255]) ^ m[W++], T = (A[U >>> 24] << 24 | A[S >>> 16 & 255] << 16 | A[F >>> 8 & 255] << 8 | A[H & 255]) ^ m[W++];
            g[y] = V, g[y + 1] = Z, g[y + 2] = q, g[y + 3] = T;
          },
          keySize: 256 / 32
        });
        n.AES = s._createHelper(p);
      }(), t.AES;
    });
  }(c0)), c0.exports;
}
var u0 = { exports: {} }, us;
function Gu() {
  return us || (us = 1, function(r, e) {
    (function(t, n, o) {
      r.exports = n(K(), _t(), Bt(), lt(), le());
    })(z, function(t) {
      return function() {
        var n = t, o = n.lib, s = o.WordArray, c = o.BlockCipher, a = n.algo, l = [
          57,
          49,
          41,
          33,
          25,
          17,
          9,
          1,
          58,
          50,
          42,
          34,
          26,
          18,
          10,
          2,
          59,
          51,
          43,
          35,
          27,
          19,
          11,
          3,
          60,
          52,
          44,
          36,
          63,
          55,
          47,
          39,
          31,
          23,
          15,
          7,
          62,
          54,
          46,
          38,
          30,
          22,
          14,
          6,
          61,
          53,
          45,
          37,
          29,
          21,
          13,
          5,
          28,
          20,
          12,
          4
        ], i = [
          14,
          17,
          11,
          24,
          1,
          5,
          3,
          28,
          15,
          6,
          21,
          10,
          23,
          19,
          12,
          4,
          26,
          8,
          16,
          7,
          27,
          20,
          13,
          2,
          41,
          52,
          31,
          37,
          47,
          55,
          30,
          40,
          51,
          45,
          33,
          48,
          44,
          49,
          39,
          56,
          34,
          53,
          46,
          42,
          50,
          36,
          29,
          32
        ], u = [1, 2, 4, 6, 8, 10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28], h = [
          {
            0: 8421888,
            268435456: 32768,
            536870912: 8421378,
            805306368: 2,
            1073741824: 512,
            1342177280: 8421890,
            1610612736: 8389122,
            1879048192: 8388608,
            2147483648: 514,
            2415919104: 8389120,
            2684354560: 33280,
            2952790016: 8421376,
            3221225472: 32770,
            3489660928: 8388610,
            3758096384: 0,
            4026531840: 33282,
            134217728: 0,
            402653184: 8421890,
            671088640: 33282,
            939524096: 32768,
            1207959552: 8421888,
            1476395008: 512,
            1744830464: 8421378,
            2013265920: 2,
            2281701376: 8389120,
            2550136832: 33280,
            2818572288: 8421376,
            3087007744: 8389122,
            3355443200: 8388610,
            3623878656: 32770,
            3892314112: 514,
            4160749568: 8388608,
            1: 32768,
            268435457: 2,
            536870913: 8421888,
            805306369: 8388608,
            1073741825: 8421378,
            1342177281: 33280,
            1610612737: 512,
            1879048193: 8389122,
            2147483649: 8421890,
            2415919105: 8421376,
            2684354561: 8388610,
            2952790017: 33282,
            3221225473: 514,
            3489660929: 8389120,
            3758096385: 32770,
            4026531841: 0,
            134217729: 8421890,
            402653185: 8421376,
            671088641: 8388608,
            939524097: 512,
            1207959553: 32768,
            1476395009: 8388610,
            1744830465: 2,
            2013265921: 33282,
            2281701377: 32770,
            2550136833: 8389122,
            2818572289: 514,
            3087007745: 8421888,
            3355443201: 8389120,
            3623878657: 0,
            3892314113: 33280,
            4160749569: 8421378
          },
          {
            0: 1074282512,
            16777216: 16384,
            33554432: 524288,
            50331648: 1074266128,
            67108864: 1073741840,
            83886080: 1074282496,
            100663296: 1073758208,
            117440512: 16,
            134217728: 540672,
            150994944: 1073758224,
            167772160: 1073741824,
            184549376: 540688,
            201326592: 524304,
            218103808: 0,
            234881024: 16400,
            251658240: 1074266112,
            8388608: 1073758208,
            25165824: 540688,
            41943040: 16,
            58720256: 1073758224,
            75497472: 1074282512,
            92274688: 1073741824,
            109051904: 524288,
            125829120: 1074266128,
            142606336: 524304,
            159383552: 0,
            176160768: 16384,
            192937984: 1074266112,
            209715200: 1073741840,
            226492416: 540672,
            243269632: 1074282496,
            260046848: 16400,
            268435456: 0,
            285212672: 1074266128,
            301989888: 1073758224,
            318767104: 1074282496,
            335544320: 1074266112,
            352321536: 16,
            369098752: 540688,
            385875968: 16384,
            402653184: 16400,
            419430400: 524288,
            436207616: 524304,
            452984832: 1073741840,
            469762048: 540672,
            486539264: 1073758208,
            503316480: 1073741824,
            520093696: 1074282512,
            276824064: 540688,
            293601280: 524288,
            310378496: 1074266112,
            327155712: 16384,
            343932928: 1073758208,
            360710144: 1074282512,
            377487360: 16,
            394264576: 1073741824,
            411041792: 1074282496,
            427819008: 1073741840,
            444596224: 1073758224,
            461373440: 524304,
            478150656: 0,
            494927872: 16400,
            511705088: 1074266128,
            528482304: 540672
          },
          {
            0: 260,
            1048576: 0,
            2097152: 67109120,
            3145728: 65796,
            4194304: 65540,
            5242880: 67108868,
            6291456: 67174660,
            7340032: 67174400,
            8388608: 67108864,
            9437184: 67174656,
            10485760: 65792,
            11534336: 67174404,
            12582912: 67109124,
            13631488: 65536,
            14680064: 4,
            15728640: 256,
            524288: 67174656,
            1572864: 67174404,
            2621440: 0,
            3670016: 67109120,
            4718592: 67108868,
            5767168: 65536,
            6815744: 65540,
            7864320: 260,
            8912896: 4,
            9961472: 256,
            11010048: 67174400,
            12058624: 65796,
            13107200: 65792,
            14155776: 67109124,
            15204352: 67174660,
            16252928: 67108864,
            16777216: 67174656,
            17825792: 65540,
            18874368: 65536,
            19922944: 67109120,
            20971520: 256,
            22020096: 67174660,
            23068672: 67108868,
            24117248: 0,
            25165824: 67109124,
            26214400: 67108864,
            27262976: 4,
            28311552: 65792,
            29360128: 67174400,
            30408704: 260,
            31457280: 65796,
            32505856: 67174404,
            17301504: 67108864,
            18350080: 260,
            19398656: 67174656,
            20447232: 0,
            21495808: 65540,
            22544384: 67109120,
            23592960: 256,
            24641536: 67174404,
            25690112: 65536,
            26738688: 67174660,
            27787264: 65796,
            28835840: 67108868,
            29884416: 67109124,
            30932992: 67174400,
            31981568: 4,
            33030144: 65792
          },
          {
            0: 2151682048,
            65536: 2147487808,
            131072: 4198464,
            196608: 2151677952,
            262144: 0,
            327680: 4198400,
            393216: 2147483712,
            458752: 4194368,
            524288: 2147483648,
            589824: 4194304,
            655360: 64,
            720896: 2147487744,
            786432: 2151678016,
            851968: 4160,
            917504: 4096,
            983040: 2151682112,
            32768: 2147487808,
            98304: 64,
            163840: 2151678016,
            229376: 2147487744,
            294912: 4198400,
            360448: 2151682112,
            425984: 0,
            491520: 2151677952,
            557056: 4096,
            622592: 2151682048,
            688128: 4194304,
            753664: 4160,
            819200: 2147483648,
            884736: 4194368,
            950272: 4198464,
            1015808: 2147483712,
            1048576: 4194368,
            1114112: 4198400,
            1179648: 2147483712,
            1245184: 0,
            1310720: 4160,
            1376256: 2151678016,
            1441792: 2151682048,
            1507328: 2147487808,
            1572864: 2151682112,
            1638400: 2147483648,
            1703936: 2151677952,
            1769472: 4198464,
            1835008: 2147487744,
            1900544: 4194304,
            1966080: 64,
            2031616: 4096,
            1081344: 2151677952,
            1146880: 2151682112,
            1212416: 0,
            1277952: 4198400,
            1343488: 4194368,
            1409024: 2147483648,
            1474560: 2147487808,
            1540096: 64,
            1605632: 2147483712,
            1671168: 4096,
            1736704: 2147487744,
            1802240: 2151678016,
            1867776: 4160,
            1933312: 2151682048,
            1998848: 4194304,
            2064384: 4198464
          },
          {
            0: 128,
            4096: 17039360,
            8192: 262144,
            12288: 536870912,
            16384: 537133184,
            20480: 16777344,
            24576: 553648256,
            28672: 262272,
            32768: 16777216,
            36864: 537133056,
            40960: 536871040,
            45056: 553910400,
            49152: 553910272,
            53248: 0,
            57344: 17039488,
            61440: 553648128,
            2048: 17039488,
            6144: 553648256,
            10240: 128,
            14336: 17039360,
            18432: 262144,
            22528: 537133184,
            26624: 553910272,
            30720: 536870912,
            34816: 537133056,
            38912: 0,
            43008: 553910400,
            47104: 16777344,
            51200: 536871040,
            55296: 553648128,
            59392: 16777216,
            63488: 262272,
            65536: 262144,
            69632: 128,
            73728: 536870912,
            77824: 553648256,
            81920: 16777344,
            86016: 553910272,
            90112: 537133184,
            94208: 16777216,
            98304: 553910400,
            102400: 553648128,
            106496: 17039360,
            110592: 537133056,
            114688: 262272,
            118784: 536871040,
            122880: 0,
            126976: 17039488,
            67584: 553648256,
            71680: 16777216,
            75776: 17039360,
            79872: 537133184,
            83968: 536870912,
            88064: 17039488,
            92160: 128,
            96256: 553910272,
            100352: 262272,
            104448: 553910400,
            108544: 0,
            112640: 553648128,
            116736: 16777344,
            120832: 262144,
            124928: 537133056,
            129024: 536871040
          },
          {
            0: 268435464,
            256: 8192,
            512: 270532608,
            768: 270540808,
            1024: 268443648,
            1280: 2097152,
            1536: 2097160,
            1792: 268435456,
            2048: 0,
            2304: 268443656,
            2560: 2105344,
            2816: 8,
            3072: 270532616,
            3328: 2105352,
            3584: 8200,
            3840: 270540800,
            128: 270532608,
            384: 270540808,
            640: 8,
            896: 2097152,
            1152: 2105352,
            1408: 268435464,
            1664: 268443648,
            1920: 8200,
            2176: 2097160,
            2432: 8192,
            2688: 268443656,
            2944: 270532616,
            3200: 0,
            3456: 270540800,
            3712: 2105344,
            3968: 268435456,
            4096: 268443648,
            4352: 270532616,
            4608: 270540808,
            4864: 8200,
            5120: 2097152,
            5376: 268435456,
            5632: 268435464,
            5888: 2105344,
            6144: 2105352,
            6400: 0,
            6656: 8,
            6912: 270532608,
            7168: 8192,
            7424: 268443656,
            7680: 270540800,
            7936: 2097160,
            4224: 8,
            4480: 2105344,
            4736: 2097152,
            4992: 268435464,
            5248: 268443648,
            5504: 8200,
            5760: 270540808,
            6016: 270532608,
            6272: 270540800,
            6528: 270532616,
            6784: 8192,
            7040: 2105352,
            7296: 2097160,
            7552: 0,
            7808: 268435456,
            8064: 268443656
          },
          {
            0: 1048576,
            16: 33555457,
            32: 1024,
            48: 1049601,
            64: 34604033,
            80: 0,
            96: 1,
            112: 34603009,
            128: 33555456,
            144: 1048577,
            160: 33554433,
            176: 34604032,
            192: 34603008,
            208: 1025,
            224: 1049600,
            240: 33554432,
            8: 34603009,
            24: 0,
            40: 33555457,
            56: 34604032,
            72: 1048576,
            88: 33554433,
            104: 33554432,
            120: 1025,
            136: 1049601,
            152: 33555456,
            168: 34603008,
            184: 1048577,
            200: 1024,
            216: 34604033,
            232: 1,
            248: 1049600,
            256: 33554432,
            272: 1048576,
            288: 33555457,
            304: 34603009,
            320: 1048577,
            336: 33555456,
            352: 34604032,
            368: 1049601,
            384: 1025,
            400: 34604033,
            416: 1049600,
            432: 1,
            448: 0,
            464: 34603008,
            480: 33554433,
            496: 1024,
            264: 1049600,
            280: 33555457,
            296: 34603009,
            312: 1,
            328: 33554432,
            344: 1048576,
            360: 1025,
            376: 34604032,
            392: 33554433,
            408: 34603008,
            424: 0,
            440: 34604033,
            456: 1049601,
            472: 1024,
            488: 33555456,
            504: 1048577
          },
          {
            0: 134219808,
            1: 131072,
            2: 134217728,
            3: 32,
            4: 131104,
            5: 134350880,
            6: 134350848,
            7: 2048,
            8: 134348800,
            9: 134219776,
            10: 133120,
            11: 134348832,
            12: 2080,
            13: 0,
            14: 134217760,
            15: 133152,
            2147483648: 2048,
            2147483649: 134350880,
            2147483650: 134219808,
            2147483651: 134217728,
            2147483652: 134348800,
            2147483653: 133120,
            2147483654: 133152,
            2147483655: 32,
            2147483656: 134217760,
            2147483657: 2080,
            2147483658: 131104,
            2147483659: 134350848,
            2147483660: 0,
            2147483661: 134348832,
            2147483662: 134219776,
            2147483663: 131072,
            16: 133152,
            17: 134350848,
            18: 32,
            19: 2048,
            20: 134219776,
            21: 134217760,
            22: 134348832,
            23: 131072,
            24: 0,
            25: 131104,
            26: 134348800,
            27: 134219808,
            28: 134350880,
            29: 133120,
            30: 2080,
            31: 134217728,
            2147483664: 131072,
            2147483665: 2048,
            2147483666: 134348832,
            2147483667: 133152,
            2147483668: 32,
            2147483669: 134348800,
            2147483670: 134217728,
            2147483671: 134219808,
            2147483672: 134350880,
            2147483673: 134217760,
            2147483674: 134219776,
            2147483675: 0,
            2147483676: 133120,
            2147483677: 2080,
            2147483678: 131104,
            2147483679: 134350848
          }
        ], d = [
          4160749569,
          528482304,
          33030144,
          2064384,
          129024,
          8064,
          504,
          2147483679
        ], f = a.DES = c.extend({
          _doReset: function() {
            for (var b = this._key, p = b.words, g = [], y = 0; y < 56; y++) {
              var m = l[y] - 1;
              g[y] = p[m >>> 5] >>> 31 - m % 32 & 1;
            }
            for (var _ = this._subKeys = [], E = 0; E < 16; E++) {
              for (var C = _[E] = [], D = u[E], y = 0; y < 24; y++)
                C[y / 6 | 0] |= g[(i[y] - 1 + D) % 28] << 31 - y % 6, C[4 + (y / 6 | 0)] |= g[28 + (i[y + 24] - 1 + D) % 28] << 31 - y % 6;
              C[0] = C[0] << 1 | C[0] >>> 31;
              for (var y = 1; y < 7; y++)
                C[y] = C[y] >>> (y - 1) * 4 + 3;
              C[7] = C[7] << 5 | C[7] >>> 27;
            }
            for (var A = this._invSubKeys = [], y = 0; y < 16; y++)
              A[y] = _[15 - y];
          },
          encryptBlock: function(b, p) {
            this._doCryptBlock(b, p, this._subKeys);
          },
          decryptBlock: function(b, p) {
            this._doCryptBlock(b, p, this._invSubKeys);
          },
          _doCryptBlock: function(b, p, g) {
            this._lBlock = b[p], this._rBlock = b[p + 1], x.call(this, 4, 252645135), x.call(this, 16, 65535), w.call(this, 2, 858993459), w.call(this, 8, 16711935), x.call(this, 1, 1431655765);
            for (var y = 0; y < 16; y++) {
              for (var m = g[y], _ = this._lBlock, E = this._rBlock, C = 0, D = 0; D < 8; D++)
                C |= h[D][((E ^ m[D]) & d[D]) >>> 0];
              this._lBlock = E, this._rBlock = _ ^ C;
            }
            var A = this._lBlock;
            this._lBlock = this._rBlock, this._rBlock = A, x.call(this, 1, 1431655765), w.call(this, 8, 16711935), w.call(this, 2, 858993459), x.call(this, 16, 65535), x.call(this, 4, 252645135), b[p] = this._lBlock, b[p + 1] = this._rBlock;
          },
          keySize: 64 / 32,
          ivSize: 64 / 32,
          blockSize: 64 / 32
        });
        function x(b, p) {
          var g = (this._lBlock >>> b ^ this._rBlock) & p;
          this._rBlock ^= g, this._lBlock ^= g << b;
        }
        function w(b, p) {
          var g = (this._rBlock >>> b ^ this._lBlock) & p;
          this._lBlock ^= g, this._rBlock ^= g << b;
        }
        n.DES = c._createHelper(f);
        var v = a.TripleDES = c.extend({
          _doReset: function() {
            var b = this._key, p = b.words;
            if (p.length !== 2 && p.length !== 4 && p.length < 6)
              throw new Error("Invalid key length - 3DES requires the key length to be 64, 128, 192 or >192.");
            var g = p.slice(0, 2), y = p.length < 4 ? p.slice(0, 2) : p.slice(2, 4), m = p.length < 6 ? p.slice(0, 2) : p.slice(4, 6);
            this._des1 = f.createEncryptor(s.create(g)), this._des2 = f.createEncryptor(s.create(y)), this._des3 = f.createEncryptor(s.create(m));
          },
          encryptBlock: function(b, p) {
            this._des1.encryptBlock(b, p), this._des2.decryptBlock(b, p), this._des3.encryptBlock(b, p);
          },
          decryptBlock: function(b, p) {
            this._des3.decryptBlock(b, p), this._des2.encryptBlock(b, p), this._des1.decryptBlock(b, p);
          },
          keySize: 192 / 32,
          ivSize: 64 / 32,
          blockSize: 64 / 32
        });
        n.TripleDES = c._createHelper(v);
      }(), t.TripleDES;
    });
  }(u0)), u0.exports;
}
var l0 = { exports: {} }, ls;
function Yu() {
  return ls || (ls = 1, function(r, e) {
    (function(t, n, o) {
      r.exports = n(K(), _t(), Bt(), lt(), le());
    })(z, function(t) {
      return function() {
        var n = t, o = n.lib, s = o.StreamCipher, c = n.algo, a = c.RC4 = s.extend({
          _doReset: function() {
            for (var u = this._key, h = u.words, d = u.sigBytes, f = this._S = [], x = 0; x < 256; x++)
              f[x] = x;
            for (var x = 0, w = 0; x < 256; x++) {
              var v = x % d, b = h[v >>> 2] >>> 24 - v % 4 * 8 & 255;
              w = (w + f[x] + b) % 256;
              var p = f[x];
              f[x] = f[w], f[w] = p;
            }
            this._i = this._j = 0;
          },
          _doProcessBlock: function(u, h) {
            u[h] ^= l.call(this);
          },
          keySize: 256 / 32,
          ivSize: 0
        });
        function l() {
          for (var u = this._S, h = this._i, d = this._j, f = 0, x = 0; x < 4; x++) {
            h = (h + 1) % 256, d = (d + u[h]) % 256;
            var w = u[h];
            u[h] = u[d], u[d] = w, f |= u[(u[h] + u[d]) % 256] << 24 - x * 8;
          }
          return this._i = h, this._j = d, f;
        }
        n.RC4 = s._createHelper(a);
        var i = c.RC4Drop = a.extend({
          /**
           * Configuration options.
           *
           * @property {number} drop The number of keystream words to drop. Default 192
           */
          cfg: a.cfg.extend({
            drop: 192
          }),
          _doReset: function() {
            a._doReset.call(this);
            for (var u = this.cfg.drop; u > 0; u--)
              l.call(this);
          }
        });
        n.RC4Drop = s._createHelper(i);
      }(), t.RC4;
    });
  }(l0)), l0.exports;
}
var f0 = { exports: {} }, fs;
function Zu() {
  return fs || (fs = 1, function(r, e) {
    (function(t, n, o) {
      r.exports = n(K(), _t(), Bt(), lt(), le());
    })(z, function(t) {
      return function() {
        var n = t, o = n.lib, s = o.StreamCipher, c = n.algo, a = [], l = [], i = [], u = c.Rabbit = s.extend({
          _doReset: function() {
            for (var d = this._key.words, f = this.cfg.iv, x = 0; x < 4; x++)
              d[x] = (d[x] << 8 | d[x] >>> 24) & 16711935 | (d[x] << 24 | d[x] >>> 8) & 4278255360;
            var w = this._X = [
              d[0],
              d[3] << 16 | d[2] >>> 16,
              d[1],
              d[0] << 16 | d[3] >>> 16,
              d[2],
              d[1] << 16 | d[0] >>> 16,
              d[3],
              d[2] << 16 | d[1] >>> 16
            ], v = this._C = [
              d[2] << 16 | d[2] >>> 16,
              d[0] & 4294901760 | d[1] & 65535,
              d[3] << 16 | d[3] >>> 16,
              d[1] & 4294901760 | d[2] & 65535,
              d[0] << 16 | d[0] >>> 16,
              d[2] & 4294901760 | d[3] & 65535,
              d[1] << 16 | d[1] >>> 16,
              d[3] & 4294901760 | d[0] & 65535
            ];
            this._b = 0;
            for (var x = 0; x < 4; x++)
              h.call(this);
            for (var x = 0; x < 8; x++)
              v[x] ^= w[x + 4 & 7];
            if (f) {
              var b = f.words, p = b[0], g = b[1], y = (p << 8 | p >>> 24) & 16711935 | (p << 24 | p >>> 8) & 4278255360, m = (g << 8 | g >>> 24) & 16711935 | (g << 24 | g >>> 8) & 4278255360, _ = y >>> 16 | m & 4294901760, E = m << 16 | y & 65535;
              v[0] ^= y, v[1] ^= _, v[2] ^= m, v[3] ^= E, v[4] ^= y, v[5] ^= _, v[6] ^= m, v[7] ^= E;
              for (var x = 0; x < 4; x++)
                h.call(this);
            }
          },
          _doProcessBlock: function(d, f) {
            var x = this._X;
            h.call(this), a[0] = x[0] ^ x[5] >>> 16 ^ x[3] << 16, a[1] = x[2] ^ x[7] >>> 16 ^ x[5] << 16, a[2] = x[4] ^ x[1] >>> 16 ^ x[7] << 16, a[3] = x[6] ^ x[3] >>> 16 ^ x[1] << 16;
            for (var w = 0; w < 4; w++)
              a[w] = (a[w] << 8 | a[w] >>> 24) & 16711935 | (a[w] << 24 | a[w] >>> 8) & 4278255360, d[f + w] ^= a[w];
          },
          blockSize: 128 / 32,
          ivSize: 64 / 32
        });
        function h() {
          for (var d = this._X, f = this._C, x = 0; x < 8; x++)
            l[x] = f[x];
          f[0] = f[0] + 1295307597 + this._b | 0, f[1] = f[1] + 3545052371 + (f[0] >>> 0 < l[0] >>> 0 ? 1 : 0) | 0, f[2] = f[2] + 886263092 + (f[1] >>> 0 < l[1] >>> 0 ? 1 : 0) | 0, f[3] = f[3] + 1295307597 + (f[2] >>> 0 < l[2] >>> 0 ? 1 : 0) | 0, f[4] = f[4] + 3545052371 + (f[3] >>> 0 < l[3] >>> 0 ? 1 : 0) | 0, f[5] = f[5] + 886263092 + (f[4] >>> 0 < l[4] >>> 0 ? 1 : 0) | 0, f[6] = f[6] + 1295307597 + (f[5] >>> 0 < l[5] >>> 0 ? 1 : 0) | 0, f[7] = f[7] + 3545052371 + (f[6] >>> 0 < l[6] >>> 0 ? 1 : 0) | 0, this._b = f[7] >>> 0 < l[7] >>> 0 ? 1 : 0;
          for (var x = 0; x < 8; x++) {
            var w = d[x] + f[x], v = w & 65535, b = w >>> 16, p = ((v * v >>> 17) + v * b >>> 15) + b * b, g = ((w & 4294901760) * w | 0) + ((w & 65535) * w | 0);
            i[x] = p ^ g;
          }
          d[0] = i[0] + (i[7] << 16 | i[7] >>> 16) + (i[6] << 16 | i[6] >>> 16) | 0, d[1] = i[1] + (i[0] << 8 | i[0] >>> 24) + i[7] | 0, d[2] = i[2] + (i[1] << 16 | i[1] >>> 16) + (i[0] << 16 | i[0] >>> 16) | 0, d[3] = i[3] + (i[2] << 8 | i[2] >>> 24) + i[1] | 0, d[4] = i[4] + (i[3] << 16 | i[3] >>> 16) + (i[2] << 16 | i[2] >>> 16) | 0, d[5] = i[5] + (i[4] << 8 | i[4] >>> 24) + i[3] | 0, d[6] = i[6] + (i[5] << 16 | i[5] >>> 16) + (i[4] << 16 | i[4] >>> 16) | 0, d[7] = i[7] + (i[6] << 8 | i[6] >>> 24) + i[5] | 0;
        }
        n.Rabbit = s._createHelper(u);
      }(), t.Rabbit;
    });
  }(f0)), f0.exports;
}
var d0 = { exports: {} }, ds;
function Xu() {
  return ds || (ds = 1, function(r, e) {
    (function(t, n, o) {
      r.exports = n(K(), _t(), Bt(), lt(), le());
    })(z, function(t) {
      return function() {
        var n = t, o = n.lib, s = o.StreamCipher, c = n.algo, a = [], l = [], i = [], u = c.RabbitLegacy = s.extend({
          _doReset: function() {
            var d = this._key.words, f = this.cfg.iv, x = this._X = [
              d[0],
              d[3] << 16 | d[2] >>> 16,
              d[1],
              d[0] << 16 | d[3] >>> 16,
              d[2],
              d[1] << 16 | d[0] >>> 16,
              d[3],
              d[2] << 16 | d[1] >>> 16
            ], w = this._C = [
              d[2] << 16 | d[2] >>> 16,
              d[0] & 4294901760 | d[1] & 65535,
              d[3] << 16 | d[3] >>> 16,
              d[1] & 4294901760 | d[2] & 65535,
              d[0] << 16 | d[0] >>> 16,
              d[2] & 4294901760 | d[3] & 65535,
              d[1] << 16 | d[1] >>> 16,
              d[3] & 4294901760 | d[0] & 65535
            ];
            this._b = 0;
            for (var v = 0; v < 4; v++)
              h.call(this);
            for (var v = 0; v < 8; v++)
              w[v] ^= x[v + 4 & 7];
            if (f) {
              var b = f.words, p = b[0], g = b[1], y = (p << 8 | p >>> 24) & 16711935 | (p << 24 | p >>> 8) & 4278255360, m = (g << 8 | g >>> 24) & 16711935 | (g << 24 | g >>> 8) & 4278255360, _ = y >>> 16 | m & 4294901760, E = m << 16 | y & 65535;
              w[0] ^= y, w[1] ^= _, w[2] ^= m, w[3] ^= E, w[4] ^= y, w[5] ^= _, w[6] ^= m, w[7] ^= E;
              for (var v = 0; v < 4; v++)
                h.call(this);
            }
          },
          _doProcessBlock: function(d, f) {
            var x = this._X;
            h.call(this), a[0] = x[0] ^ x[5] >>> 16 ^ x[3] << 16, a[1] = x[2] ^ x[7] >>> 16 ^ x[5] << 16, a[2] = x[4] ^ x[1] >>> 16 ^ x[7] << 16, a[3] = x[6] ^ x[3] >>> 16 ^ x[1] << 16;
            for (var w = 0; w < 4; w++)
              a[w] = (a[w] << 8 | a[w] >>> 24) & 16711935 | (a[w] << 24 | a[w] >>> 8) & 4278255360, d[f + w] ^= a[w];
          },
          blockSize: 128 / 32,
          ivSize: 64 / 32
        });
        function h() {
          for (var d = this._X, f = this._C, x = 0; x < 8; x++)
            l[x] = f[x];
          f[0] = f[0] + 1295307597 + this._b | 0, f[1] = f[1] + 3545052371 + (f[0] >>> 0 < l[0] >>> 0 ? 1 : 0) | 0, f[2] = f[2] + 886263092 + (f[1] >>> 0 < l[1] >>> 0 ? 1 : 0) | 0, f[3] = f[3] + 1295307597 + (f[2] >>> 0 < l[2] >>> 0 ? 1 : 0) | 0, f[4] = f[4] + 3545052371 + (f[3] >>> 0 < l[3] >>> 0 ? 1 : 0) | 0, f[5] = f[5] + 886263092 + (f[4] >>> 0 < l[4] >>> 0 ? 1 : 0) | 0, f[6] = f[6] + 1295307597 + (f[5] >>> 0 < l[5] >>> 0 ? 1 : 0) | 0, f[7] = f[7] + 3545052371 + (f[6] >>> 0 < l[6] >>> 0 ? 1 : 0) | 0, this._b = f[7] >>> 0 < l[7] >>> 0 ? 1 : 0;
          for (var x = 0; x < 8; x++) {
            var w = d[x] + f[x], v = w & 65535, b = w >>> 16, p = ((v * v >>> 17) + v * b >>> 15) + b * b, g = ((w & 4294901760) * w | 0) + ((w & 65535) * w | 0);
            i[x] = p ^ g;
          }
          d[0] = i[0] + (i[7] << 16 | i[7] >>> 16) + (i[6] << 16 | i[6] >>> 16) | 0, d[1] = i[1] + (i[0] << 8 | i[0] >>> 24) + i[7] | 0, d[2] = i[2] + (i[1] << 16 | i[1] >>> 16) + (i[0] << 16 | i[0] >>> 16) | 0, d[3] = i[3] + (i[2] << 8 | i[2] >>> 24) + i[1] | 0, d[4] = i[4] + (i[3] << 16 | i[3] >>> 16) + (i[2] << 16 | i[2] >>> 16) | 0, d[5] = i[5] + (i[4] << 8 | i[4] >>> 24) + i[3] | 0, d[6] = i[6] + (i[5] << 16 | i[5] >>> 16) + (i[4] << 16 | i[4] >>> 16) | 0, d[7] = i[7] + (i[6] << 8 | i[6] >>> 24) + i[5] | 0;
        }
        n.RabbitLegacy = s._createHelper(u);
      }(), t.RabbitLegacy;
    });
  }(d0)), d0.exports;
}
var h0 = { exports: {} }, hs;
function Ju() {
  return hs || (hs = 1, function(r, e) {
    (function(t, n, o) {
      r.exports = n(K(), _t(), Bt(), lt(), le());
    })(z, function(t) {
      return function() {
        var n = t, o = n.lib, s = o.BlockCipher, c = n.algo;
        const a = 16, l = [
          608135816,
          2242054355,
          320440878,
          57701188,
          2752067618,
          698298832,
          137296536,
          3964562569,
          1160258022,
          953160567,
          3193202383,
          887688300,
          3232508343,
          3380367581,
          1065670069,
          3041331479,
          2450970073,
          2306472731
        ], i = [
          [
            3509652390,
            2564797868,
            805139163,
            3491422135,
            3101798381,
            1780907670,
            3128725573,
            4046225305,
            614570311,
            3012652279,
            134345442,
            2240740374,
            1667834072,
            1901547113,
            2757295779,
            4103290238,
            227898511,
            1921955416,
            1904987480,
            2182433518,
            2069144605,
            3260701109,
            2620446009,
            720527379,
            3318853667,
            677414384,
            3393288472,
            3101374703,
            2390351024,
            1614419982,
            1822297739,
            2954791486,
            3608508353,
            3174124327,
            2024746970,
            1432378464,
            3864339955,
            2857741204,
            1464375394,
            1676153920,
            1439316330,
            715854006,
            3033291828,
            289532110,
            2706671279,
            2087905683,
            3018724369,
            1668267050,
            732546397,
            1947742710,
            3462151702,
            2609353502,
            2950085171,
            1814351708,
            2050118529,
            680887927,
            999245976,
            1800124847,
            3300911131,
            1713906067,
            1641548236,
            4213287313,
            1216130144,
            1575780402,
            4018429277,
            3917837745,
            3693486850,
            3949271944,
            596196993,
            3549867205,
            258830323,
            2213823033,
            772490370,
            2760122372,
            1774776394,
            2652871518,
            566650946,
            4142492826,
            1728879713,
            2882767088,
            1783734482,
            3629395816,
            2517608232,
            2874225571,
            1861159788,
            326777828,
            3124490320,
            2130389656,
            2716951837,
            967770486,
            1724537150,
            2185432712,
            2364442137,
            1164943284,
            2105845187,
            998989502,
            3765401048,
            2244026483,
            1075463327,
            1455516326,
            1322494562,
            910128902,
            469688178,
            1117454909,
            936433444,
            3490320968,
            3675253459,
            1240580251,
            122909385,
            2157517691,
            634681816,
            4142456567,
            3825094682,
            3061402683,
            2540495037,
            79693498,
            3249098678,
            1084186820,
            1583128258,
            426386531,
            1761308591,
            1047286709,
            322548459,
            995290223,
            1845252383,
            2603652396,
            3431023940,
            2942221577,
            3202600964,
            3727903485,
            1712269319,
            422464435,
            3234572375,
            1170764815,
            3523960633,
            3117677531,
            1434042557,
            442511882,
            3600875718,
            1076654713,
            1738483198,
            4213154764,
            2393238008,
            3677496056,
            1014306527,
            4251020053,
            793779912,
            2902807211,
            842905082,
            4246964064,
            1395751752,
            1040244610,
            2656851899,
            3396308128,
            445077038,
            3742853595,
            3577915638,
            679411651,
            2892444358,
            2354009459,
            1767581616,
            3150600392,
            3791627101,
            3102740896,
            284835224,
            4246832056,
            1258075500,
            768725851,
            2589189241,
            3069724005,
            3532540348,
            1274779536,
            3789419226,
            2764799539,
            1660621633,
            3471099624,
            4011903706,
            913787905,
            3497959166,
            737222580,
            2514213453,
            2928710040,
            3937242737,
            1804850592,
            3499020752,
            2949064160,
            2386320175,
            2390070455,
            2415321851,
            4061277028,
            2290661394,
            2416832540,
            1336762016,
            1754252060,
            3520065937,
            3014181293,
            791618072,
            3188594551,
            3933548030,
            2332172193,
            3852520463,
            3043980520,
            413987798,
            3465142937,
            3030929376,
            4245938359,
            2093235073,
            3534596313,
            375366246,
            2157278981,
            2479649556,
            555357303,
            3870105701,
            2008414854,
            3344188149,
            4221384143,
            3956125452,
            2067696032,
            3594591187,
            2921233993,
            2428461,
            544322398,
            577241275,
            1471733935,
            610547355,
            4027169054,
            1432588573,
            1507829418,
            2025931657,
            3646575487,
            545086370,
            48609733,
            2200306550,
            1653985193,
            298326376,
            1316178497,
            3007786442,
            2064951626,
            458293330,
            2589141269,
            3591329599,
            3164325604,
            727753846,
            2179363840,
            146436021,
            1461446943,
            4069977195,
            705550613,
            3059967265,
            3887724982,
            4281599278,
            3313849956,
            1404054877,
            2845806497,
            146425753,
            1854211946
          ],
          [
            1266315497,
            3048417604,
            3681880366,
            3289982499,
            290971e4,
            1235738493,
            2632868024,
            2414719590,
            3970600049,
            1771706367,
            1449415276,
            3266420449,
            422970021,
            1963543593,
            2690192192,
            3826793022,
            1062508698,
            1531092325,
            1804592342,
            2583117782,
            2714934279,
            4024971509,
            1294809318,
            4028980673,
            1289560198,
            2221992742,
            1669523910,
            35572830,
            157838143,
            1052438473,
            1016535060,
            1802137761,
            1753167236,
            1386275462,
            3080475397,
            2857371447,
            1040679964,
            2145300060,
            2390574316,
            1461121720,
            2956646967,
            4031777805,
            4028374788,
            33600511,
            2920084762,
            1018524850,
            629373528,
            3691585981,
            3515945977,
            2091462646,
            2486323059,
            586499841,
            988145025,
            935516892,
            3367335476,
            2599673255,
            2839830854,
            265290510,
            3972581182,
            2759138881,
            3795373465,
            1005194799,
            847297441,
            406762289,
            1314163512,
            1332590856,
            1866599683,
            4127851711,
            750260880,
            613907577,
            1450815602,
            3165620655,
            3734664991,
            3650291728,
            3012275730,
            3704569646,
            1427272223,
            778793252,
            1343938022,
            2676280711,
            2052605720,
            1946737175,
            3164576444,
            3914038668,
            3967478842,
            3682934266,
            1661551462,
            3294938066,
            4011595847,
            840292616,
            3712170807,
            616741398,
            312560963,
            711312465,
            1351876610,
            322626781,
            1910503582,
            271666773,
            2175563734,
            1594956187,
            70604529,
            3617834859,
            1007753275,
            1495573769,
            4069517037,
            2549218298,
            2663038764,
            504708206,
            2263041392,
            3941167025,
            2249088522,
            1514023603,
            1998579484,
            1312622330,
            694541497,
            2582060303,
            2151582166,
            1382467621,
            776784248,
            2618340202,
            3323268794,
            2497899128,
            2784771155,
            503983604,
            4076293799,
            907881277,
            423175695,
            432175456,
            1378068232,
            4145222326,
            3954048622,
            3938656102,
            3820766613,
            2793130115,
            2977904593,
            26017576,
            3274890735,
            3194772133,
            1700274565,
            1756076034,
            4006520079,
            3677328699,
            720338349,
            1533947780,
            354530856,
            688349552,
            3973924725,
            1637815568,
            332179504,
            3949051286,
            53804574,
            2852348879,
            3044236432,
            1282449977,
            3583942155,
            3416972820,
            4006381244,
            1617046695,
            2628476075,
            3002303598,
            1686838959,
            431878346,
            2686675385,
            1700445008,
            1080580658,
            1009431731,
            832498133,
            3223435511,
            2605976345,
            2271191193,
            2516031870,
            1648197032,
            4164389018,
            2548247927,
            300782431,
            375919233,
            238389289,
            3353747414,
            2531188641,
            2019080857,
            1475708069,
            455242339,
            2609103871,
            448939670,
            3451063019,
            1395535956,
            2413381860,
            1841049896,
            1491858159,
            885456874,
            4264095073,
            4001119347,
            1565136089,
            3898914787,
            1108368660,
            540939232,
            1173283510,
            2745871338,
            3681308437,
            4207628240,
            3343053890,
            4016749493,
            1699691293,
            1103962373,
            3625875870,
            2256883143,
            3830138730,
            1031889488,
            3479347698,
            1535977030,
            4236805024,
            3251091107,
            2132092099,
            1774941330,
            1199868427,
            1452454533,
            157007616,
            2904115357,
            342012276,
            595725824,
            1480756522,
            206960106,
            497939518,
            591360097,
            863170706,
            2375253569,
            3596610801,
            1814182875,
            2094937945,
            3421402208,
            1082520231,
            3463918190,
            2785509508,
            435703966,
            3908032597,
            1641649973,
            2842273706,
            3305899714,
            1510255612,
            2148256476,
            2655287854,
            3276092548,
            4258621189,
            236887753,
            3681803219,
            274041037,
            1734335097,
            3815195456,
            3317970021,
            1899903192,
            1026095262,
            4050517792,
            356393447,
            2410691914,
            3873677099,
            3682840055
          ],
          [
            3913112168,
            2491498743,
            4132185628,
            2489919796,
            1091903735,
            1979897079,
            3170134830,
            3567386728,
            3557303409,
            857797738,
            1136121015,
            1342202287,
            507115054,
            2535736646,
            337727348,
            3213592640,
            1301675037,
            2528481711,
            1895095763,
            1721773893,
            3216771564,
            62756741,
            2142006736,
            835421444,
            2531993523,
            1442658625,
            3659876326,
            2882144922,
            676362277,
            1392781812,
            170690266,
            3921047035,
            1759253602,
            3611846912,
            1745797284,
            664899054,
            1329594018,
            3901205900,
            3045908486,
            2062866102,
            2865634940,
            3543621612,
            3464012697,
            1080764994,
            553557557,
            3656615353,
            3996768171,
            991055499,
            499776247,
            1265440854,
            648242737,
            3940784050,
            980351604,
            3713745714,
            1749149687,
            3396870395,
            4211799374,
            3640570775,
            1161844396,
            3125318951,
            1431517754,
            545492359,
            4268468663,
            3499529547,
            1437099964,
            2702547544,
            3433638243,
            2581715763,
            2787789398,
            1060185593,
            1593081372,
            2418618748,
            4260947970,
            69676912,
            2159744348,
            86519011,
            2512459080,
            3838209314,
            1220612927,
            3339683548,
            133810670,
            1090789135,
            1078426020,
            1569222167,
            845107691,
            3583754449,
            4072456591,
            1091646820,
            628848692,
            1613405280,
            3757631651,
            526609435,
            236106946,
            48312990,
            2942717905,
            3402727701,
            1797494240,
            859738849,
            992217954,
            4005476642,
            2243076622,
            3870952857,
            3732016268,
            765654824,
            3490871365,
            2511836413,
            1685915746,
            3888969200,
            1414112111,
            2273134842,
            3281911079,
            4080962846,
            172450625,
            2569994100,
            980381355,
            4109958455,
            2819808352,
            2716589560,
            2568741196,
            3681446669,
            3329971472,
            1835478071,
            660984891,
            3704678404,
            4045999559,
            3422617507,
            3040415634,
            1762651403,
            1719377915,
            3470491036,
            2693910283,
            3642056355,
            3138596744,
            1364962596,
            2073328063,
            1983633131,
            926494387,
            3423689081,
            2150032023,
            4096667949,
            1749200295,
            3328846651,
            309677260,
            2016342300,
            1779581495,
            3079819751,
            111262694,
            1274766160,
            443224088,
            298511866,
            1025883608,
            3806446537,
            1145181785,
            168956806,
            3641502830,
            3584813610,
            1689216846,
            3666258015,
            3200248200,
            1692713982,
            2646376535,
            4042768518,
            1618508792,
            1610833997,
            3523052358,
            4130873264,
            2001055236,
            3610705100,
            2202168115,
            4028541809,
            2961195399,
            1006657119,
            2006996926,
            3186142756,
            1430667929,
            3210227297,
            1314452623,
            4074634658,
            4101304120,
            2273951170,
            1399257539,
            3367210612,
            3027628629,
            1190975929,
            2062231137,
            2333990788,
            2221543033,
            2438960610,
            1181637006,
            548689776,
            2362791313,
            3372408396,
            3104550113,
            3145860560,
            296247880,
            1970579870,
            3078560182,
            3769228297,
            1714227617,
            3291629107,
            3898220290,
            166772364,
            1251581989,
            493813264,
            448347421,
            195405023,
            2709975567,
            677966185,
            3703036547,
            1463355134,
            2715995803,
            1338867538,
            1343315457,
            2802222074,
            2684532164,
            233230375,
            2599980071,
            2000651841,
            3277868038,
            1638401717,
            4028070440,
            3237316320,
            6314154,
            819756386,
            300326615,
            590932579,
            1405279636,
            3267499572,
            3150704214,
            2428286686,
            3959192993,
            3461946742,
            1862657033,
            1266418056,
            963775037,
            2089974820,
            2263052895,
            1917689273,
            448879540,
            3550394620,
            3981727096,
            150775221,
            3627908307,
            1303187396,
            508620638,
            2975983352,
            2726630617,
            1817252668,
            1876281319,
            1457606340,
            908771278,
            3720792119,
            3617206836,
            2455994898,
            1729034894,
            1080033504
          ],
          [
            976866871,
            3556439503,
            2881648439,
            1522871579,
            1555064734,
            1336096578,
            3548522304,
            2579274686,
            3574697629,
            3205460757,
            3593280638,
            3338716283,
            3079412587,
            564236357,
            2993598910,
            1781952180,
            1464380207,
            3163844217,
            3332601554,
            1699332808,
            1393555694,
            1183702653,
            3581086237,
            1288719814,
            691649499,
            2847557200,
            2895455976,
            3193889540,
            2717570544,
            1781354906,
            1676643554,
            2592534050,
            3230253752,
            1126444790,
            2770207658,
            2633158820,
            2210423226,
            2615765581,
            2414155088,
            3127139286,
            673620729,
            2805611233,
            1269405062,
            4015350505,
            3341807571,
            4149409754,
            1057255273,
            2012875353,
            2162469141,
            2276492801,
            2601117357,
            993977747,
            3918593370,
            2654263191,
            753973209,
            36408145,
            2530585658,
            25011837,
            3520020182,
            2088578344,
            530523599,
            2918365339,
            1524020338,
            1518925132,
            3760827505,
            3759777254,
            1202760957,
            3985898139,
            3906192525,
            674977740,
            4174734889,
            2031300136,
            2019492241,
            3983892565,
            4153806404,
            3822280332,
            352677332,
            2297720250,
            60907813,
            90501309,
            3286998549,
            1016092578,
            2535922412,
            2839152426,
            457141659,
            509813237,
            4120667899,
            652014361,
            1966332200,
            2975202805,
            55981186,
            2327461051,
            676427537,
            3255491064,
            2882294119,
            3433927263,
            1307055953,
            942726286,
            933058658,
            2468411793,
            3933900994,
            4215176142,
            1361170020,
            2001714738,
            2830558078,
            3274259782,
            1222529897,
            1679025792,
            2729314320,
            3714953764,
            1770335741,
            151462246,
            3013232138,
            1682292957,
            1483529935,
            471910574,
            1539241949,
            458788160,
            3436315007,
            1807016891,
            3718408830,
            978976581,
            1043663428,
            3165965781,
            1927990952,
            4200891579,
            2372276910,
            3208408903,
            3533431907,
            1412390302,
            2931980059,
            4132332400,
            1947078029,
            3881505623,
            4168226417,
            2941484381,
            1077988104,
            1320477388,
            886195818,
            18198404,
            3786409e3,
            2509781533,
            112762804,
            3463356488,
            1866414978,
            891333506,
            18488651,
            661792760,
            1628790961,
            3885187036,
            3141171499,
            876946877,
            2693282273,
            1372485963,
            791857591,
            2686433993,
            3759982718,
            3167212022,
            3472953795,
            2716379847,
            445679433,
            3561995674,
            3504004811,
            3574258232,
            54117162,
            3331405415,
            2381918588,
            3769707343,
            4154350007,
            1140177722,
            4074052095,
            668550556,
            3214352940,
            367459370,
            261225585,
            2610173221,
            4209349473,
            3468074219,
            3265815641,
            314222801,
            3066103646,
            3808782860,
            282218597,
            3406013506,
            3773591054,
            379116347,
            1285071038,
            846784868,
            2669647154,
            3771962079,
            3550491691,
            2305946142,
            453669953,
            1268987020,
            3317592352,
            3279303384,
            3744833421,
            2610507566,
            3859509063,
            266596637,
            3847019092,
            517658769,
            3462560207,
            3443424879,
            370717030,
            4247526661,
            2224018117,
            4143653529,
            4112773975,
            2788324899,
            2477274417,
            1456262402,
            2901442914,
            1517677493,
            1846949527,
            2295493580,
            3734397586,
            2176403920,
            1280348187,
            1908823572,
            3871786941,
            846861322,
            1172426758,
            3287448474,
            3383383037,
            1655181056,
            3139813346,
            901632758,
            1897031941,
            2986607138,
            3066810236,
            3447102507,
            1393639104,
            373351379,
            950779232,
            625454576,
            3124240540,
            4148612726,
            2007998917,
            544563296,
            2244738638,
            2330496472,
            2058025392,
            1291430526,
            424198748,
            50039436,
            29584100,
            3605783033,
            2429876329,
            2791104160,
            1057563949,
            3255363231,
            3075367218,
            3463963227,
            1469046755,
            985887462
          ]
        ];
        var u = {
          pbox: [],
          sbox: []
        };
        function h(v, b) {
          let p = b >> 24 & 255, g = b >> 16 & 255, y = b >> 8 & 255, m = b & 255, _ = v.sbox[0][p] + v.sbox[1][g];
          return _ = _ ^ v.sbox[2][y], _ = _ + v.sbox[3][m], _;
        }
        function d(v, b, p) {
          let g = b, y = p, m;
          for (let _ = 0; _ < a; ++_)
            g = g ^ v.pbox[_], y = h(v, g) ^ y, m = g, g = y, y = m;
          return m = g, g = y, y = m, y = y ^ v.pbox[a], g = g ^ v.pbox[a + 1], { left: g, right: y };
        }
        function f(v, b, p) {
          let g = b, y = p, m;
          for (let _ = a + 1; _ > 1; --_)
            g = g ^ v.pbox[_], y = h(v, g) ^ y, m = g, g = y, y = m;
          return m = g, g = y, y = m, y = y ^ v.pbox[1], g = g ^ v.pbox[0], { left: g, right: y };
        }
        function x(v, b, p) {
          for (let E = 0; E < 4; E++) {
            v.sbox[E] = [];
            for (let C = 0; C < 256; C++)
              v.sbox[E][C] = i[E][C];
          }
          let g = 0;
          for (let E = 0; E < a + 2; E++)
            v.pbox[E] = l[E] ^ b[g], g++, g >= p && (g = 0);
          let y = 0, m = 0, _ = 0;
          for (let E = 0; E < a + 2; E += 2)
            _ = d(v, y, m), y = _.left, m = _.right, v.pbox[E] = y, v.pbox[E + 1] = m;
          for (let E = 0; E < 4; E++)
            for (let C = 0; C < 256; C += 2)
              _ = d(v, y, m), y = _.left, m = _.right, v.sbox[E][C] = y, v.sbox[E][C + 1] = m;
          return !0;
        }
        var w = c.Blowfish = s.extend({
          _doReset: function() {
            if (this._keyPriorReset !== this._key) {
              var v = this._keyPriorReset = this._key, b = v.words, p = v.sigBytes / 4;
              x(u, b, p);
            }
          },
          encryptBlock: function(v, b) {
            var p = d(u, v[b], v[b + 1]);
            v[b] = p.left, v[b + 1] = p.right;
          },
          decryptBlock: function(v, b) {
            var p = f(u, v[b], v[b + 1]);
            v[b] = p.left, v[b + 1] = p.right;
          },
          blockSize: 64 / 32,
          keySize: 128 / 32,
          ivSize: 64 / 32
        });
        n.Blowfish = s._createHelper(w);
      }(), t.Blowfish;
    });
  }(h0)), h0.exports;
}
(function(r, e) {
  (function(t, n, o) {
    r.exports = n(K(), un(), Du(), Su(), _t(), Fu(), Bt(), $i(), ro(), Tu(), Vi(), Ru(), Ou(), Iu(), no(), Nu(), lt(), le(), Hu(), Pu(), Uu(), Mu(), Lu(), Wu(), zu(), ju(), Ku(), $u(), Vu(), qu(), Gu(), Yu(), Zu(), Xu(), Ju());
  })(z, function(t) {
    return t;
  });
})(Ki);
var ln = Ki.exports;
const ie = /* @__PURE__ */ Eu(ln);
function qi(r) {
  return new Uint8Array([
    r >> 24 & 255,
    r >> 16 & 255,
    r >> 8 & 255,
    r & 255
  ]);
}
function oo(r) {
  const e = r.words, t = new Uint8Array(e.length * 4);
  for (let n = 0; n < e.length * 4; n++)
    t[n] = e[n >>> 2] >>> 24 - n % 4 * 8 & 255;
  return t;
}
const sn = class sn {
  constructor() {
    ce(this, "stateCounter", 1);
    ce(this, "seedCounter", 1);
    ce(this, "state");
    ce(this, "seed");
    this.seed = new Uint8Array(64).fill(0), this.state = new Uint8Array(64).fill(0);
  }
  digestAddCounter(e) {
    const t = new Uint8Array(8);
    return t[0] = e & 255, t[1] = e >>> 8 & 255, t[2] = e >>> 16 & 255, t[3] = e >>> 24 & 255, t[4] = 0, t[5] = 0, t[6] = 0, t[7] = 0, t;
  }
  digest(e) {
    const t = ie.lib.WordArray.create(e), n = ie.SHA512(t);
    return oo(n);
  }
  cycleSeed() {
    const e = this.digestAddCounter(this.seedCounter++), t = [...this.seed, ...e];
    this.seed = this.digest(new Uint8Array(t));
  }
  generateState() {
    const t = [...this.digestAddCounter(this.stateCounter++), ...this.state, ...this.seed];
    this.state = this.digest(new Uint8Array(t)), this.stateCounter % sn.CYCLE_COUNT === 0 && this.cycleSeed();
  }
  addSeedMaterial(e) {
    const t = [...e, ...this.seed];
    this.seed = this.digest(new Uint8Array(t));
  }
  nextBytes(e) {
    const t = new Uint8Array(e);
    let n = 0;
    const o = Math.ceil(e / this.state.length);
    for (let s = 0; s < o; s++) {
      this.generateState();
      const c = e - n, a = Math.min(this.state.length, c);
      t.set(this.state.subarray(0, a), n), n += a;
    }
    return t;
  }
};
ce(sn, "CYCLE_COUNT", 10);
let Xr = sn;
class gt {
  static deriveAccountTag(e, t) {
    const { secret: n, prng: o } = this.deriveSeed(e, t);
    return wt.create("", n, void 0, (c) => {
      if (o) {
        const a = c.length, l = o.nextBytes(a);
        c.set(l);
      }
    }).getAddrTag();
  }
  static deriveSeed(e, t) {
    const n = qi(t), o = [...e, ...n], s = ie.lib.WordArray.create(new Uint8Array(o)), c = ie.SHA512(s), a = oo(c), l = new Xr();
    return l.addSeedMaterial(a), { secret: new Uint8Array(l.nextBytes(32)), prng: l };
  }
  static deriveWotsSeedAndAddress(e, t, n) {
    if (t < 0)
      throw new Error("Invalid wots index");
    const o = Buffer.from(n, "hex");
    if (o.length !== 20) throw new Error("Invalid tag length, expected 20  bytes, got " + o.length);
    const s = this.deriveSeed(e, t), c = wt.create("", s.secret, o, (a) => {
      if (s.prng) {
        const l = a.length, i = s.prng.nextBytes(l);
        a.set(i);
      }
    });
    return { secret: c.getSecret(), address: c.getAddress(), wotsWallet: c };
  }
}
const xs = process.env.NODE_ENV === "test" ? 1e3 : 1e5;
class pe {
  constructor(e, t) {
    ce(this, "seed");
    ce(this, "entropy");
    // Store original entropy for phrase generation
    ce(this, "_isLocked", !0);
    this.seed = e, this.entropy = t, this._isLocked = !1;
  }
  /**
   * Creates a new master seed with random entropy
   */
  static async create() {
    const e = Za();
    return new pe(e);
  }
  /**
   * Creates a master seed from a BIP39 mnemonic phrase
   */
  static async fromPhrase(e) {
    try {
      if (!wu(e, Tr))
        throw new Error("Invalid seed phrase");
      const n = ji(e, Tr), o = await mu(e), s = new Uint8Array(o.slice(0, 32));
      return new pe(s, n);
    } catch (t) {
      throw t instanceof Error && t.message === "Invalid seed phrase" ? t : (console.error("Seed phrase error:", t), new Error("Failed to create master seed from phrase"));
    }
  }
  /**
   * Exports the seed phrase for this master seed
   */
  async toPhrase() {
    if (!this.seed)
      throw new Error("Master seed is locked / does not exist");
    try {
      if (this.entropy)
        return Ro(this.entropy, Tr);
      const e = new Uint8Array(32);
      return e.set(this.seed), Ro(e, Tr);
    } catch (e) {
      throw console.error("Phrase generation error:", e), new Error("Failed to generate seed phrase");
    }
  }
  /**
   * Locks the master seed by wiping it from memory
   */
  lock() {
    this.seed && (jr(this.seed), this.seed = void 0), this.entropy && (jr(this.entropy), this.entropy = void 0), this._isLocked = !0;
  }
  /**
   * Checks if the master seed is locked
   */
  get isLocked() {
    return this._isLocked;
  }
  deriveAccount(e) {
    if (this._isLocked || !this.seed)
      throw new Error("Master seed is locked");
    const t = gt.deriveAccountTag(this.seed, e), { secret: n, prng: o } = gt.deriveSeed(this.seed, e), s = re.generateRandomAddress(new Uint8Array(12).fill(1), n, (c) => {
      if (o) {
        const a = c.length, l = o.nextBytes(a);
        c.set(l);
      }
    });
    return {
      tag: Buffer.from(t).toString("hex"),
      seed: n,
      wotsSeed: n,
      address: s
    };
  }
  /**
   * Derives an account seed for the given index
   * @throws Error if the master seed is locked
   */
  deriveAccountSeed(e) {
    if (this._isLocked || !this.seed)
      throw new Error("Master seed is locked");
    return gt.deriveSeed(this.seed, e).secret;
  }
  /**
   * Derives an account tag for the given index
   * @throws Error if the master seed is locked
   */
  async deriveAccountTag(e) {
    if (this._isLocked || !this.seed)
      throw new Error("Master seed is locked");
    return gt.deriveAccountTag(this.seed, e);
  }
  static deriveWotsIndexFromWotsAddrHash(e, t, n, o = 0, s = 1e4) {
    if (!e) throw new Error("Account seed is empty");
    let c = -1;
    const a = vt.wotsAddressFromBytes(n.slice(0, 2144));
    if (Buffer.from(a.getAddrHash()).toString("hex") === Buffer.from(t).toString("hex"))
      return -1;
    for (let l = o; l < s; l++) {
      const i = gt.deriveSeed(e, l), u = wt.create("", i.secret, void 0, (h) => {
        if (i.prng) {
          const d = h.length, f = i.prng.nextBytes(d);
          h.set(f);
        }
      });
      if (Buffer.from(u.getAddrHash()).toString("hex") === Buffer.from(t).toString("hex")) {
        c = l;
        break;
      }
    }
    return c;
  }
  /**
   * Exports the master seed in encrypted form
   */
  async export(e) {
    if (!this.seed)
      throw new Error("No seed to export");
    const t = crypto.getRandomValues(new Uint8Array(16)), n = crypto.getRandomValues(new Uint8Array(16)), o = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(e),
      "PBKDF2",
      !1,
      ["deriveBits", "deriveKey"]
    ), s = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: t,
        iterations: xs,
        hash: "SHA-256"
      },
      o,
      { name: "AES-GCM", length: 256 },
      !1,
      ["encrypt"]
    ), c = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: n },
      s,
      this.seed
    );
    return {
      data: Buffer.from(c).toString("base64"),
      iv: Buffer.from(n).toString("base64"),
      salt: Buffer.from(t).toString("base64")
    };
  }
  static async deriveKey(e, t) {
    const n = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(t),
      "PBKDF2",
      !1,
      ["deriveBits", "deriveKey"]
    );
    return await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: Buffer.from(e.salt, "base64"),
        iterations: xs,
        hash: "SHA-256"
      },
      n,
      { name: "AES-GCM", length: 256 },
      !0,
      ["decrypt"]
    );
  }
  /**
   * Creates a MasterSeed instance from an encrypted seed
   */
  static async import(e, t) {
    try {
      const n = Buffer.from(e.data, "base64"), o = Buffer.from(e.iv, "base64"), s = await this.deriveKey(e, t), c = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: o },
        s,
        n
      );
      return new pe(new Uint8Array(c));
    } catch (n) {
      throw console.error("Decryption error:", n), new Error("Failed to decrypt master seed - invalid password");
    }
  }
  static async importFromDerivedKey(e, t) {
    const n = Buffer.from(e.data, "base64"), o = Buffer.from(e.iv, "base64"), s = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: o },
      t,
      n
    );
    return new pe(new Uint8Array(s));
  }
  static async importFromDerivedKeyJWK(e, t) {
    const n = await crypto.subtle.importKey(
      "jwk",
      t,
      { name: "AES-GCM", length: 256 },
      !0,
      ["decrypt"]
    );
    return this.importFromDerivedKey(e, n);
  }
  /**
   * Derives a storage key from the master seed using HKDF-like construction
   * Returns a 32-byte key suitable for AES-256
   */
  deriveStorageKey() {
    if (this._isLocked || !this.seed)
      throw new Error("Master seed is locked");
    const e = ie.enc.Hex.parse(
      Buffer.from(this.seed).toString("hex")
    ), t = ie.SHA256(
      ie.enc.Utf8.parse("mochimo_storage_key_v1").concat(e)
    ), n = ie.HmacSHA256(
      t,
      "mochimo_storage_salt"
    ), o = ie.HmacSHA256(
      "mochimo_storage_info",
      n
    );
    return new Uint8Array(
      Buffer.from(o.toString(ie.enc.Hex), "hex")
    );
  }
  /**
   * Derives a storage key using native Web Crypto API
   */
  async deriveStorageKeyNative() {
    if (this._isLocked || !this.seed)
      throw new Error("Master seed is locked");
    const e = new TextEncoder(), t = e.encode("mochimo_storage_key_v1"), n = this.seed, o = new Uint8Array(t.length + n.length);
    o.set(t), o.set(n, t.length);
    const s = await crypto.subtle.digest("SHA-256", o), c = new Uint8Array(s), a = await crypto.subtle.importKey(
      "raw",
      e.encode("mochimo_storage_salt"),
      {
        name: "HMAC",
        hash: "SHA-256"
      },
      !1,
      ["sign"]
    ), l = await crypto.subtle.sign(
      "HMAC",
      a,
      c
    ), i = new Uint8Array(l), u = await crypto.subtle.importKey(
      "raw",
      i,
      {
        name: "HMAC",
        hash: "SHA-256"
      },
      !1,
      ["sign"]
    ), h = await crypto.subtle.sign(
      "HMAC",
      u,
      e.encode("mochimo_storage_info")
    );
    return new Uint8Array(h);
  }
}
class Qu {
  constructor(e) {
    ce(this, "apiUrl");
    this.apiUrl = e;
  }
  getAccountBalance(e) {
    throw new Error("Method not implemented.");
  }
  getMempoolTransactions() {
    throw new Error("Method not implemented.");
  }
  getMempoolTransaction(e) {
    throw new Error("Method not implemented.");
  }
  waitForTransaction(e, t, n) {
    throw new Error("Method not implemented.");
  }
  getNetworkOptions() {
    throw new Error("Method not implemented.");
  }
  getBlock(e) {
    throw new Error("Method not implemented.");
  }
  getBlockTransaction(e, t) {
    throw new Error("Method not implemented.");
  }
  submit(e) {
    throw new Error("Method not implemented.");
  }
  derive(e, t) {
    throw new Error("Method not implemented.");
  }
  preprocess(e, t) {
    throw new Error("Method not implemented.");
  }
  metadata(e, t) {
    throw new Error("Method not implemented.");
  }
  payloads(e, t, n) {
    throw new Error("Method not implemented.");
  }
  combine(e, t) {
    throw new Error("Method not implemented.");
  }
  parse(e, t) {
    throw new Error("Method not implemented.");
  }
  searchTransactionsByAddress(e, t) {
    throw new Error("Method not implemented.");
  }
  searchTransactionsByBlock(e, t) {
    throw new Error("Method not implemented.");
  }
  searchTransactionsByTxId(e, t) {
    throw new Error("Method not implemented.");
  }
  getEventsBlocks(e) {
    throw new Error("Method not implemented.");
  }
  getStatsRichlist(e) {
    throw new Error("Method not implemented.");
  }
  getNetworkStatus() {
    throw new Error("Method not implemented.");
  }
  getBalance(e) {
    throw new Error("Method not implemented.");
  }
  async resolveTag(e) {
    try {
      const t = await fetch(`${this.apiUrl}/net/resolve/${e}`);
      if (!t.ok)
        throw new Error(`HTTP error! status: ${t.status}`);
      return await t.json();
    } catch (t) {
      throw console.error("Error resolving tag:", t), t;
    }
  }
  async pushTransaction(e, t) {
    try {
      const n = await fetch(`${this.apiUrl}/push`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ transaction: e, recipients: t })
      });
      if (!n.ok)
        throw new Error(`HTTP error! status: ${n.status}`);
      return {
        status: "success",
        data: await n.json()
      };
    } catch (n) {
      return console.error("Error pushing transaction:", n), {
        status: "error",
        error: n instanceof Error ? n.message : "Unknown error"
      };
    }
  }
  async activateTag(e) {
    try {
      const t = await fetch(`${this.apiUrl}/fund/${e}`);
      if (!t.ok)
        throw new Error(`HTTP error! status: ${t.status}`);
      return await t.json();
    } catch (t) {
      throw console.error("Error activating tag:", t), t;
    }
  }
}
var x0 = {
  symbol: "MCM",
  decimals: 9
}, el = {
  blockchain: "mochimo",
  network: "mainnet"
}, tl = class Qt {
  constructor() {
    this.isDebug = !1;
  }
  static getInstance() {
    return Qt.instance || (Qt.instance = new Qt()), Qt.instance;
  }
  enableDebug() {
    this.isDebug = !0;
  }
  replaceBigInt(e, t) {
    return typeof t == "bigint" ? t.toString() : t;
  }
  formatMessage(e, t, n) {
    const o = (/* @__PURE__ */ new Date()).toISOString(), s = n ? `
Data: ${JSON.stringify(n, this.replaceBigInt, 2)}` : "";
    return `[${o}] ${e.toUpperCase()}: ${t}${s}`;
  }
  debug(e, t) {
    this.isDebug && console.debug(this.formatMessage("debug", e, t));
  }
  info(e, t) {
    console.info(this.formatMessage("info", e, t));
  }
  warn(e, t) {
    console.warn(this.formatMessage("warn", e, t));
  }
  error(e, t) {
    console.error(this.formatMessage("error", e, t));
  }
}, ne = tl.getInstance(), Gi = class {
  constructor(r) {
    this.baseUrl = r, this.networkIdentifier = el, ne.debug("Construction initialized", { baseUrl: r, networkIdentifier: this.networkIdentifier });
  }
  headersToObject(r) {
    const e = {};
    return r.forEach((t, n) => {
      e[n] = t;
    }), e;
  }
  async handleResponse(r) {
    const e = await r.json();
    if (ne.debug("API Response", {
      status: r.status,
      url: r.url,
      data: e,
      headers: this.headersToObject(r.headers)
    }), "code" in e)
      throw ne.error("API Error", {
        endpoint: r.url,
        status: r.status,
        error: e
      }), new Error(`Rosetta API Error: ${e.message}`);
    return e;
  }
  async makeRequest(r, e) {
    const t = `${this.baseUrl}${r}`;
    ne.debug(`Making request to ${r}`, {
      url: t,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: e
    });
    try {
      const n = await fetch(t, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(e)
      });
      return this.handleResponse(n);
    } catch (n) {
      throw ne.error(`Request failed to ${r}`, {
        url: t,
        error: n instanceof Error ? n.message : n
      }), n;
    }
  }
  async derive(r, e) {
    return ne.debug("Deriving address", { publicKey: r, tag: e }), this.makeRequest("/construction/derive", {
      network_identifier: this.networkIdentifier,
      public_key: {
        hex_bytes: r,
        curve_type: "wotsp"
      },
      metadata: { tag: e }
    });
  }
  async preprocess(r, e) {
    return ne.debug("Preprocessing transaction", { operations: r, metadata: e }), this.makeRequest("/construction/preprocess", {
      network_identifier: this.networkIdentifier,
      operations: r,
      metadata: e
    });
  }
  async metadata(r, e) {
    return ne.debug("Fetching metadata", { options: r, publicKeys: e }), this.makeRequest("/construction/metadata", {
      network_identifier: this.networkIdentifier,
      options: r,
      public_keys: e
    });
  }
  async payloads(r, e, t) {
    return ne.debug("Fetching payloads", { operations: r, metadata: e, publicKeys: t }), this.makeRequest("/construction/payloads", {
      network_identifier: this.networkIdentifier,
      operations: r,
      metadata: e,
      public_keys: t
    });
  }
  async combine(r, e) {
    return ne.debug("Combining transaction", { unsignedTransaction: r, signatures: e }), this.makeRequest("/construction/combine", {
      network_identifier: this.networkIdentifier,
      unsigned_transaction: r,
      signatures: e
    });
  }
  async submit(r) {
    return ne.debug("Submitting transaction", { signedTransaction: r }), this.makeRequest("/construction/submit", {
      network_identifier: this.networkIdentifier,
      signed_transaction: r
    });
  }
  async parse(r, e) {
    return ne.debug("Parsing transaction", { transaction: r, signed: e }), this.makeRequest("/construction/parse", {
      network_identifier: this.networkIdentifier,
      transaction: r,
      signed: e
    });
  }
  async resolveTag(r) {
    return this.makeRequest("/call", {
      network_identifier: this.networkIdentifier,
      parameters: {
        tag: r
      },
      method: "tag_resolve"
    });
  }
  async getAccountBalance(r) {
    return this.makeRequest("/account/balance", {
      network_identifier: this.networkIdentifier,
      account_identifier: { address: r }
    });
  }
  async getBlock(r) {
    return this.makeRequest("/block", {
      network_identifier: this.networkIdentifier,
      block_identifier: r
    });
  }
  /**
   * Get network options (operation types, statuses, errors, etc)
   */
  async getNetworkOptions() {
    return this.makeRequest("/network/options", {
      network_identifier: this.networkIdentifier
    });
  }
  /**
   * Get a transaction inside a block by block identifier and transaction hash
   * @param blockIdentifier {BlockIdentifier}
   * @param transactionHash {string}
   */
  async getBlockTransaction(r, e) {
    return this.makeRequest("/block/transaction", {
      network_identifier: this.networkIdentifier,
      block_identifier: r,
      transaction_identifier: { hash: e }
    });
  }
  /**
   * Search transactions by account address, with optional filters
   * @param address {string}
   * @param options {object} Optional: limit, offset, max_block, status
   */
  async searchTransactionsByAddress(r, e) {
    const t = {
      network_identifier: this.networkIdentifier,
      account_identifier: { address: r }
    };
    return e && (e.limit !== void 0 && (t.limit = e.limit), e.offset !== void 0 && (t.offset = e.offset), e.max_block !== void 0 && (t.max_block = e.max_block), e.status !== void 0 && (t.status = e.status)), this.makeRequest("/search/transactions", t);
  }
  /**
   * Search transactions by block index/hash, with optional filters
   * @param blockIdentifier {BlockIdentifier}
   * @param options {object} Optional: limit, offset, status
   */
  async searchTransactionsByBlock(r, e) {
    const t = {
      network_identifier: this.networkIdentifier,
      block_identifier: r
    };
    return e && (e.limit !== void 0 && (t.limit = e.limit), e.offset !== void 0 && (t.offset = e.offset), e.status !== void 0 && (t.status = e.status)), this.makeRequest("/search/transactions", t);
  }
  /**
   * Search transactions by transaction hash, with optional filters
   * @param transactionHash {string}
   * @param options {object} Optional: max_block, status
   */
  async searchTransactionsByTxId(r, e) {
    const t = {
      network_identifier: this.networkIdentifier,
      transaction_identifier: { hash: r }
    };
    return e && (e.max_block !== void 0 && (t.max_block = e.max_block), e.status !== void 0 && (t.status = e.status)), this.makeRequest("/search/transactions", t);
  }
  /**
   * Get block events (additions/removals) with optional limit/offset
   * @param options {object} Optional: limit, offset
   */
  async getEventsBlocks(r) {
    const e = {
      network_identifier: this.networkIdentifier
    };
    return r && (r.limit !== void 0 && (e.limit = r.limit), r.offset !== void 0 && (e.offset = r.offset)), this.makeRequest("/events/blocks", e);
  }
  /**
   * Get the richlist (accounts with highest balances)
   * @param options {object} Optional: ascending, offset, limit
   */
  async getStatsRichlist(r) {
    const e = {
      network_identifier: this.networkIdentifier
    };
    return r && (r.ascending !== void 0 && (e.ascending = r.ascending), r.offset !== void 0 && (e.offset = r.offset), r.limit !== void 0 && (e.limit = r.limit)), this.makeRequest("/stats/richlist", e);
  }
  async getNetworkStatus() {
    return this.makeRequest("/network/status", {
      network_identifier: this.networkIdentifier
    });
  }
  /**
   * Get all transaction identifiers in the mempool
   */
  async getMempoolTransactions() {
    return ne.debug("Fetching mempool transactions"), this.makeRequest("/mempool", {
      network_identifier: this.networkIdentifier
    });
  }
  /**
   * Get a specific transaction from the mempool
   * @param transactionHash - The hash of the transaction to fetch
   */
  async getMempoolTransaction(r) {
    return ne.debug("Fetching mempool transaction", { transactionHash: r }), this.makeRequest("/mempool/transaction", {
      network_identifier: this.networkIdentifier,
      transaction_identifier: {
        hash: r
      }
    });
  }
  /**
   * Monitor the mempool for a specific transaction
   * @param transactionHash - The hash of the transaction to monitor
   * @param timeout - Maximum time to wait in milliseconds
   * @param interval - Check interval in milliseconds
   */
  async waitForTransaction(r, e = 6e4, t = 1e3) {
    ne.debug("Monitoring mempool for transaction", {
      transactionHash: r,
      timeout: e,
      interval: t
    });
    const n = Date.now();
    for (; Date.now() - n < e; )
      try {
        return await this.getMempoolTransaction(r);
      } catch {
        if (Date.now() - n >= e)
          throw new Error(`Transaction ${r} not found in mempool after ${e}ms`);
        await new Promise((s) => setTimeout(s, t));
      }
    throw new Error(`Timeout waiting for transaction ${r}`);
  }
}, rl = class {
  constructor(r) {
    this.construction = new Gi(r), ne.debug("TransactionBuilder initialized", { baseUrl: r });
  }
  createTransactionBytes(r) {
    const e = r.sourceAddress.startsWith("0x") ? r.sourceAddress.slice(2) : r.sourceAddress, t = r.destinationTag.startsWith("0x") ? r.destinationTag.slice(2) : r.destinationTag, n = r.changePk.startsWith("0x") ? r.changePk.slice(2) : r.changePk, o = Buffer.alloc(2304);
    if (o.writeUInt32LE(0, 0), Buffer.from(e, "hex").copy(o, 4), Buffer.from(n, "hex").copy(o, 44), Buffer.from(t, "hex").copy(o, 84), o.writeBigUInt64LE(r.amount, 124), o.writeBigUInt64LE(r.fee, 132), o.writeUInt32LE(r.blockToLive, 140), r.memo) {
      const s = Buffer.from(r.memo);
      s.copy(o, 144, 0, Math.min(s.length, 32));
    }
    return o;
  }
  async buildTransaction(r) {
    var e;
    try {
      const t = {
        ...r,
        amount: r.amount.toString(),
        fee: r.fee.toString(),
        sourceBalance: (e = r.sourceBalance) == null ? void 0 : e.toString()
      };
      ne.info("Building transaction", t);
      const n = this.createTransactionBytes(r);
      ne.debug("Created transaction bytes", {
        length: n.length,
        hex: n.toString("hex")
      });
      const o = [
        {
          operation_identifier: { index: 0 },
          type: "SOURCE_TRANSFER",
          status: "SUCCESS",
          account: { address: r.sourceTag },
          amount: {
            value: (-r.amount).toString(),
            currency: x0
          }
        },
        {
          operation_identifier: { index: 1 },
          type: "DESTINATION_TRANSFER",
          status: "SUCCESS",
          account: { address: r.destinationTag },
          amount: {
            value: r.amount.toString(),
            currency: x0
          },
          metadata: { memo: r.memo || "" }
        },
        {
          operation_identifier: { index: 2 },
          type: "FEE",
          status: "SUCCESS",
          account: { address: r.sourceTag },
          amount: {
            value: r.fee.toString(),
            currency: x0
          }
        }
      ];
      ne.debug("Created operations", o);
      const s = await this.construction.preprocess(o, {
        block_to_live: r.blockToLive.toString(),
        change_pk: r.changePk,
        change_addr: r.changePk,
        source_balance: r.sourceBalance ? r.sourceBalance.toString() : "179999501"
      });
      ne.debug("Preprocess response", s);
      const c = await this.construction.metadata(
        s.options,
        [{ hex_bytes: r.publicKey, curve_type: "wotsp" }]
      );
      return ne.debug("Metadata response", c), await this.construction.payloads(
        o,
        c.metadata,
        [{ hex_bytes: r.publicKey, curve_type: "wotsp" }]
      );
    } catch (t) {
      throw ne.error("Error building transaction", t), t instanceof Error ? t : new Error("Unknown error occurred");
    }
  }
  async submitSignedTransaction(r) {
    return await this.construction.submit(r);
  }
  createSignature(r, e, t) {
    return {
      signing_payload: {
        hex_bytes: e,
        signature_type: "wotsp"
      },
      public_key: {
        hex_bytes: Buffer.from(r).toString("hex"),
        curve_type: "wotsp"
      },
      signature_type: "wotsp",
      hex_bytes: Buffer.from(t).toString("hex")
    };
  }
  /**
   * Submit a transaction and wait for it to appear in the mempool
   * @param signedTransaction - The signed transaction to submit
   * @param timeout - Maximum time to wait for mempool appearance
   */
  async submitAndMonitor(r, e = 6e4) {
    var n;
    const t = await this.submitSignedTransaction(r);
    if (ne.debug("Transaction submitted", t), !((n = t.transaction_identifier) != null && n.hash))
      throw new Error("No transaction hash in submit response");
    return await this.construction.waitForTransaction(
      t.transaction_identifier.hash,
      e
    );
  }
  /**
   * Get all transactions currently in the mempool
   */
  async getMempoolTransactions() {
    return this.construction.getMempoolTransactions();
  }
  /**
   * Get a specific transaction from the mempool
   */
  async getMempoolTransaction(r) {
    return this.construction.getMempoolTransaction(r);
  }
  async buildAndSignTransaction(r, e, t, n, o, s, c = 0) {
    const a = {
      sourceTag: "0x" + Buffer.from(r.getAddrTag()).toString("hex"),
      sourceAddress: "0x" + Buffer.from(r.getAddress()).toString("hex"),
      destinationTag: t,
      amount: n,
      fee: o,
      publicKey: Buffer.from(r.getWots().slice(0, 2144)).toString("hex"),
      changePk: "0x" + Buffer.from(e.getAddrHash()).toString("hex"),
      memo: s,
      blockToLive: c,
      sourceBalance: n + o
      // This should be fetched from network in production
    }, l = await this.buildTransaction(a), i = l.unsigned_transaction, u = r.sign(
      Ie.hash(new Uint8Array(Buffer.from(i, "hex")))
    ), h = r.getWots().slice(2144, 2176), d = r.getWots().slice(2176, 2208), f = new Uint8Array([
      ...u,
      ...h,
      ...d
    ]), x = this.createSignature(
      r.getAddress(),
      i,
      f
    ), w = await this.construction.combine(i, [x]), v = await this.submitSignedTransaction(w.signed_transaction);
    return {
      buildResult: l,
      submitResult: v,
      signedTransaction: w.signed_transaction
    };
  }
  // used for testing;  gives out two wots wallet instances from a seed and index
  static createWallets(r, e, t) {
    const n = ie.SHA256(r + e).toString(), o = ie.SHA256(r + (e + 1)).toString(), s = wt.create(
      "source",
      Buffer.from(n, "hex"),
      t == null ? void 0 : t.getAddrHash()
    ), c = wt.create(
      "change",
      Buffer.from(o, "hex"),
      t == null ? void 0 : t.getAddrHash()
    );
    return { sourceWallet: s, changeWallet: c };
  }
};
function nl(r) {
  if (!r) return !0;
  if (!/^[A-Z0-9-]+$/.test(r) || r.startsWith("-") || r.endsWith("-"))
    return !1;
  const e = r.split("-");
  for (let t = 0; t < e.length; t++) {
    const n = e[t];
    if (!n) return !1;
    const o = /^[A-Z]+$/.test(n), s = /^[0-9]+$/.test(n);
    if (!o && !s)
      return !1;
    if (t > 0) {
      const c = e[t - 1], a = /^[A-Z]+$/.test(c);
      if (o === a)
        return !1;
    }
  }
  return !0;
}
class Zh {
  constructor(e) {
    ce(this, "apiUrl");
    ce(this, "apiClient");
    this.apiUrl = e, this.apiClient = new Gi(e);
  }
  getNetworkStatus() {
    return this.apiClient.getNetworkStatus().then((e) => {
      var t, n;
      return {
        height: parseInt(((n = (t = e == null ? void 0 : e.current_block_identifier) == null ? void 0 : t.index) == null ? void 0 : n.toString()) ?? "0"),
        nodes: []
      };
    });
  }
  getAccountBalance(e) {
    return this.apiClient.getAccountBalance(e);
  }
  getMempoolTransactions() {
    return this.apiClient.getMempoolTransactions();
  }
  getMempoolTransaction(e) {
    return this.apiClient.getMempoolTransaction(e);
  }
  waitForTransaction(e, t, n) {
    return this.apiClient.waitForTransaction(e, t, n);
  }
  getNetworkOptions() {
    return this.apiClient.getNetworkOptions();
  }
  getBlock(e) {
    return this.apiClient.getBlock(e);
  }
  getBlockTransaction(e, t) {
    return this.apiClient.getBlockTransaction(e, t);
  }
  submit(e) {
    return this.apiClient.submit(e);
  }
  derive(e, t) {
    return this.apiClient.derive(e, t);
  }
  preprocess(e, t) {
    return this.apiClient.preprocess(e, t);
  }
  metadata(e, t) {
    return this.apiClient.metadata(e, t);
  }
  payloads(e, t, n) {
    return this.apiClient.payloads(e, t, n);
  }
  combine(e, t) {
    return this.apiClient.combine(e, t);
  }
  parse(e, t) {
    return this.apiClient.parse(e, t);
  }
  searchTransactionsByAddress(e, t) {
    return this.apiClient.searchTransactionsByAddress(e, t);
  }
  searchTransactionsByBlock(e, t) {
    return this.apiClient.searchTransactionsByBlock(e, t);
  }
  searchTransactionsByTxId(e, t) {
    return this.apiClient.searchTransactionsByTxId(e, t);
  }
  getEventsBlocks(e) {
    return this.apiClient.getEventsBlocks(e);
  }
  getStatsRichlist(e) {
    return this.apiClient.getStatsRichlist(e);
  }
  getBalance(e) {
    return this.apiClient.getAccountBalance(e).then((t) => t.balances[0].value).catch((t) => {
      if (t.message.includes("Account not found"))
        return "0";
      throw t;
    });
  }
  resolveTag(e) {
    return this.apiClient.resolveTag("0x" + e).then((t) => ({
      success: !0,
      unanimous: !0,
      addressConsensus: t.result.address,
      balanceConsensus: t.result.amount,
      quorum: []
    }));
  }
  async pushTransaction(e, t) {
    try {
      return {
        status: "success",
        data: {
          sent: 0,
          txid: (await this.apiClient.submit(e)).transaction_identifier.hash
        }
      };
    } catch {
      return {
        status: "error",
        error: "Could not submit transaction"
      };
    }
  }
  activateTag(e) {
    return Promise.resolve({ status: "success", data: { txid: "", amount: "" }, message: "Successfully activated tag" });
  }
}
var N0 = { exports: {} }, Zt = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ps;
function ol() {
  if (ps) return Zt;
  ps = 1;
  var r = cn, e = Symbol.for("react.element"), t = Symbol.for("react.fragment"), n = Object.prototype.hasOwnProperty, o = r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, s = { key: !0, ref: !0, __self: !0, __source: !0 };
  function c(a, l, i) {
    var u, h = {}, d = null, f = null;
    i !== void 0 && (d = "" + i), l.key !== void 0 && (d = "" + l.key), l.ref !== void 0 && (f = l.ref);
    for (u in l) n.call(l, u) && !s.hasOwnProperty(u) && (h[u] = l[u]);
    if (a && a.defaultProps) for (u in l = a.defaultProps, l) h[u] === void 0 && (h[u] = l[u]);
    return { $$typeof: e, type: a, key: d, ref: f, props: h, _owner: o.current };
  }
  return Zt.Fragment = t, Zt.jsx = c, Zt.jsxs = c, Zt;
}
var Xt = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var gs;
function sl() {
  return gs || (gs = 1, process.env.NODE_ENV !== "production" && function() {
    var r = cn, e = Symbol.for("react.element"), t = Symbol.for("react.portal"), n = Symbol.for("react.fragment"), o = Symbol.for("react.strict_mode"), s = Symbol.for("react.profiler"), c = Symbol.for("react.provider"), a = Symbol.for("react.context"), l = Symbol.for("react.forward_ref"), i = Symbol.for("react.suspense"), u = Symbol.for("react.suspense_list"), h = Symbol.for("react.memo"), d = Symbol.for("react.lazy"), f = Symbol.for("react.offscreen"), x = Symbol.iterator, w = "@@iterator";
    function v(B) {
      if (B === null || typeof B != "object")
        return null;
      var N = x && B[x] || B[w];
      return typeof N == "function" ? N : null;
    }
    var b = r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function p(B) {
      {
        for (var N = arguments.length, P = new Array(N > 1 ? N - 1 : 0), M = 1; M < N; M++)
          P[M - 1] = arguments[M];
        g("error", B, P);
      }
    }
    function g(B, N, P) {
      {
        var M = b.ReactDebugCurrentFrame, Y = M.getStackAddendum();
        Y !== "" && (N += "%s", P = P.concat([Y]));
        var J = P.map(function($) {
          return String($);
        });
        J.unshift("Warning: " + N), Function.prototype.apply.call(console[B], console, J);
      }
    }
    var y = !1, m = !1, _ = !1, E = !1, C = !1, D;
    D = Symbol.for("react.module.reference");
    function A(B) {
      return !!(typeof B == "string" || typeof B == "function" || B === n || B === s || C || B === o || B === i || B === u || E || B === f || y || m || _ || typeof B == "object" && B !== null && (B.$$typeof === d || B.$$typeof === h || B.$$typeof === c || B.$$typeof === a || B.$$typeof === l || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      B.$$typeof === D || B.getModuleId !== void 0));
    }
    function k(B, N, P) {
      var M = B.displayName;
      if (M)
        return M;
      var Y = N.displayName || N.name || "";
      return Y !== "" ? P + "(" + Y + ")" : P;
    }
    function S(B) {
      return B.displayName || "Context";
    }
    function F(B) {
      if (B == null)
        return null;
      if (typeof B.tag == "number" && p("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof B == "function")
        return B.displayName || B.name || null;
      if (typeof B == "string")
        return B;
      switch (B) {
        case n:
          return "Fragment";
        case t:
          return "Portal";
        case s:
          return "Profiler";
        case o:
          return "StrictMode";
        case i:
          return "Suspense";
        case u:
          return "SuspenseList";
      }
      if (typeof B == "object")
        switch (B.$$typeof) {
          case a:
            var N = B;
            return S(N) + ".Consumer";
          case c:
            var P = B;
            return S(P._context) + ".Provider";
          case l:
            return k(B, B.render, "ForwardRef");
          case h:
            var M = B.displayName || null;
            return M !== null ? M : F(B.type) || "Memo";
          case d: {
            var Y = B, J = Y._payload, $ = Y._init;
            try {
              return F($(J));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var H = Object.assign, U = 0, W, X, V, Z, q, T, O;
    function I() {
    }
    I.__reactDisabledLog = !0;
    function R() {
      {
        if (U === 0) {
          W = console.log, X = console.info, V = console.warn, Z = console.error, q = console.group, T = console.groupCollapsed, O = console.groupEnd;
          var B = {
            configurable: !0,
            enumerable: !0,
            value: I,
            writable: !0
          };
          Object.defineProperties(console, {
            info: B,
            log: B,
            warn: B,
            error: B,
            group: B,
            groupCollapsed: B,
            groupEnd: B
          });
        }
        U++;
      }
    }
    function Q() {
      {
        if (U--, U === 0) {
          var B = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: H({}, B, {
              value: W
            }),
            info: H({}, B, {
              value: X
            }),
            warn: H({}, B, {
              value: V
            }),
            error: H({}, B, {
              value: Z
            }),
            group: H({}, B, {
              value: q
            }),
            groupCollapsed: H({}, B, {
              value: T
            }),
            groupEnd: H({}, B, {
              value: O
            })
          });
        }
        U < 0 && p("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var G = b.ReactCurrentDispatcher, ue;
    function L(B, N, P) {
      {
        if (ue === void 0)
          try {
            throw Error();
          } catch (Y) {
            var M = Y.stack.trim().match(/\n( *(at )?)/);
            ue = M && M[1] || "";
          }
        return `
` + ue + B;
      }
    }
    var ze = !1, Re;
    {
      var jt = typeof WeakMap == "function" ? WeakMap : Map;
      Re = new jt();
    }
    function Xe(B, N) {
      if (!B || ze)
        return "";
      {
        var P = Re.get(B);
        if (P !== void 0)
          return P;
      }
      var M;
      ze = !0;
      var Y = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var J;
      J = G.current, G.current = null, R();
      try {
        if (N) {
          var $ = function() {
            throw Error();
          };
          if (Object.defineProperty($.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct($, []);
            } catch (be) {
              M = be;
            }
            Reflect.construct(B, [], $);
          } else {
            try {
              $.call();
            } catch (be) {
              M = be;
            }
            B.call($.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (be) {
            M = be;
          }
          B();
        }
      } catch (be) {
        if (be && M && typeof be.stack == "string") {
          for (var j = be.stack.split(`
`), ve = M.stack.split(`
`), oe = j.length - 1, ae = ve.length - 1; oe >= 1 && ae >= 0 && j[oe] !== ve[ae]; )
            ae--;
          for (; oe >= 1 && ae >= 0; oe--, ae--)
            if (j[oe] !== ve[ae]) {
              if (oe !== 1 || ae !== 1)
                do
                  if (oe--, ae--, ae < 0 || j[oe] !== ve[ae]) {
                    var Fe = `
` + j[oe].replace(" at new ", " at ");
                    return B.displayName && Fe.includes("<anonymous>") && (Fe = Fe.replace("<anonymous>", B.displayName)), typeof B == "function" && Re.set(B, Fe), Fe;
                  }
                while (oe >= 1 && ae >= 0);
              break;
            }
        }
      } finally {
        ze = !1, G.current = J, Q(), Error.prepareStackTrace = Y;
      }
      var Tt = B ? B.displayName || B.name : "", xt = Tt ? L(Tt) : "";
      return typeof B == "function" && Re.set(B, xt), xt;
    }
    function Be(B, N, P) {
      return Xe(B, !1);
    }
    function ye(B) {
      var N = B.prototype;
      return !!(N && N.isReactComponent);
    }
    function je(B, N, P) {
      if (B == null)
        return "";
      if (typeof B == "function")
        return Xe(B, ye(B));
      if (typeof B == "string")
        return L(B);
      switch (B) {
        case i:
          return L("Suspense");
        case u:
          return L("SuspenseList");
      }
      if (typeof B == "object")
        switch (B.$$typeof) {
          case l:
            return Be(B.render);
          case h:
            return je(B.type, N, P);
          case d: {
            var M = B, Y = M._payload, J = M._init;
            try {
              return je(J(Y), N, P);
            } catch {
            }
          }
        }
      return "";
    }
    var Oe = Object.prototype.hasOwnProperty, ft = {}, Je = b.ReactDebugCurrentFrame;
    function Qe(B) {
      if (B) {
        var N = B._owner, P = je(B.type, B._source, N ? N.type : null);
        Je.setExtraStackFrame(P);
      } else
        Je.setExtraStackFrame(null);
    }
    function dt(B, N, P, M, Y) {
      {
        var J = Function.call.bind(Oe);
        for (var $ in B)
          if (J(B, $)) {
            var j = void 0;
            try {
              if (typeof B[$] != "function") {
                var ve = Error((M || "React class") + ": " + P + " type `" + $ + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof B[$] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw ve.name = "Invariant Violation", ve;
              }
              j = B[$](N, $, M, P, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (oe) {
              j = oe;
            }
            j && !(j instanceof Error) && (Qe(Y), p("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", M || "React class", P, $, typeof j), Qe(null)), j instanceof Error && !(j.message in ft) && (ft[j.message] = !0, Qe(Y), p("Failed %s type: %s", P, j.message), Qe(null));
          }
      }
    }
    var Ce = Array.isArray;
    function de(B) {
      return Ce(B);
    }
    function Ne(B) {
      {
        var N = typeof Symbol == "function" && Symbol.toStringTag, P = N && B[Symbol.toStringTag] || B.constructor.name || "Object";
        return P;
      }
    }
    function Dt(B) {
      try {
        return Kt(B), !1;
      } catch {
        return !0;
      }
    }
    function Kt(B) {
      return "" + B;
    }
    function Ke(B) {
      if (Dt(B))
        return p("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", Ne(B)), Kt(B);
    }
    var et = b.ReactCurrentOwner, bn = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, $t, Vt;
    function tt(B) {
      if (Oe.call(B, "ref")) {
        var N = Object.getOwnPropertyDescriptor(B, "ref").get;
        if (N && N.isReactWarning)
          return !1;
      }
      return B.ref !== void 0;
    }
    function ht(B) {
      if (Oe.call(B, "key")) {
        var N = Object.getOwnPropertyDescriptor(B, "key").get;
        if (N && N.isReactWarning)
          return !1;
      }
      return B.key !== void 0;
    }
    function mn(B, N) {
      typeof B.ref == "string" && et.current;
    }
    function hr(B, N) {
      {
        var P = function() {
          $t || ($t = !0, p("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", N));
        };
        P.isReactWarning = !0, Object.defineProperty(B, "key", {
          get: P,
          configurable: !0
        });
      }
    }
    function xr(B, N) {
      {
        var P = function() {
          Vt || (Vt = !0, p("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", N));
        };
        P.isReactWarning = !0, Object.defineProperty(B, "ref", {
          get: P,
          configurable: !0
        });
      }
    }
    var En = function(B, N, P, M, Y, J, $) {
      var j = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: e,
        // Built-in properties that belong on the element
        type: B,
        key: N,
        ref: P,
        props: $,
        // Record the component responsible for creating this element.
        _owner: J
      };
      return j._store = {}, Object.defineProperty(j._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(j, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: M
      }), Object.defineProperty(j, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: Y
      }), Object.freeze && (Object.freeze(j.props), Object.freeze(j)), j;
    };
    function An(B, N, P, M, Y) {
      {
        var J, $ = {}, j = null, ve = null;
        P !== void 0 && (Ke(P), j = "" + P), ht(N) && (Ke(N.key), j = "" + N.key), tt(N) && (ve = N.ref, mn(N, Y));
        for (J in N)
          Oe.call(N, J) && !bn.hasOwnProperty(J) && ($[J] = N[J]);
        if (B && B.defaultProps) {
          var oe = B.defaultProps;
          for (J in oe)
            $[J] === void 0 && ($[J] = oe[J]);
        }
        if (j || ve) {
          var ae = typeof B == "function" ? B.displayName || B.name || "Unknown" : B;
          j && hr($, ae), ve && xr($, ae);
        }
        return En(B, j, ve, Y, M, et.current, $);
      }
    }
    var St = b.ReactCurrentOwner, pr = b.ReactDebugCurrentFrame;
    function $e(B) {
      if (B) {
        var N = B._owner, P = je(B.type, B._source, N ? N.type : null);
        pr.setExtraStackFrame(P);
      } else
        pr.setExtraStackFrame(null);
    }
    var qt;
    qt = !1;
    function Ft(B) {
      return typeof B == "object" && B !== null && B.$$typeof === e;
    }
    function gr() {
      {
        if (St.current) {
          var B = F(St.current.type);
          if (B)
            return `

Check the render method of \`` + B + "`.";
        }
        return "";
      }
    }
    function _n(B) {
      return "";
    }
    var yr = {};
    function vr(B) {
      {
        var N = gr();
        if (!N) {
          var P = typeof B == "string" ? B : B.displayName || B.name;
          P && (N = `

Check the top-level render call using <` + P + ">.");
        }
        return N;
      }
    }
    function wr(B, N) {
      {
        if (!B._store || B._store.validated || B.key != null)
          return;
        B._store.validated = !0;
        var P = vr(N);
        if (yr[P])
          return;
        yr[P] = !0;
        var M = "";
        B && B._owner && B._owner !== St.current && (M = " It was passed a child from " + F(B._owner.type) + "."), $e(B), p('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', P, M), $e(null);
      }
    }
    function br(B, N) {
      {
        if (typeof B != "object")
          return;
        if (de(B))
          for (var P = 0; P < B.length; P++) {
            var M = B[P];
            Ft(M) && wr(M, N);
          }
        else if (Ft(B))
          B._store && (B._store.validated = !0);
        else if (B) {
          var Y = v(B);
          if (typeof Y == "function" && Y !== B.entries)
            for (var J = Y.call(B), $; !($ = J.next()).done; )
              Ft($.value) && wr($.value, N);
        }
      }
    }
    function mr(B) {
      {
        var N = B.type;
        if (N == null || typeof N == "string")
          return;
        var P;
        if (typeof N == "function")
          P = N.propTypes;
        else if (typeof N == "object" && (N.$$typeof === l || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        N.$$typeof === h))
          P = N.propTypes;
        else
          return;
        if (P) {
          var M = F(N);
          dt(P, B.props, "prop", M, B);
        } else if (N.PropTypes !== void 0 && !qt) {
          qt = !0;
          var Y = F(N);
          p("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", Y || "Unknown");
        }
        typeof N.getDefaultProps == "function" && !N.getDefaultProps.isReactClassApproved && p("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function Bn(B) {
      {
        for (var N = Object.keys(B.props), P = 0; P < N.length; P++) {
          var M = N[P];
          if (M !== "children" && M !== "key") {
            $e(B), p("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", M), $e(null);
            break;
          }
        }
        B.ref !== null && ($e(B), p("Invalid attribute `ref` supplied to `React.Fragment`."), $e(null));
      }
    }
    var Gt = {};
    function he(B, N, P, M, Y, J) {
      {
        var $ = A(B);
        if (!$) {
          var j = "";
          (B === void 0 || typeof B == "object" && B !== null && Object.keys(B).length === 0) && (j += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var ve = _n();
          ve ? j += ve : j += gr();
          var oe;
          B === null ? oe = "null" : de(B) ? oe = "array" : B !== void 0 && B.$$typeof === e ? (oe = "<" + (F(B.type) || "Unknown") + " />", j = " Did you accidentally export a JSX literal instead of a component?") : oe = typeof B, p("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", oe, j);
        }
        var ae = An(B, N, P, Y, J);
        if (ae == null)
          return ae;
        if ($) {
          var Fe = N.children;
          if (Fe !== void 0)
            if (M)
              if (de(Fe)) {
                for (var Tt = 0; Tt < Fe.length; Tt++)
                  br(Fe[Tt], B);
                Object.freeze && Object.freeze(Fe);
              } else
                p("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              br(Fe, B);
        }
        if (Oe.call(N, "key")) {
          var xt = F(B), be = Object.keys(N).filter(function(Va) {
            return Va !== "key";
          }), kn = be.length > 0 ? "{key: someKey, " + be.join(": ..., ") + ": ...}" : "{key: someKey}";
          if (!Gt[xt + kn]) {
            var $a = be.length > 0 ? "{" + be.join(": ..., ") + ": ...}" : "{}";
            p(`A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`, kn, xt, $a, xt), Gt[xt + kn] = !0;
          }
        }
        return B === n ? Bn(ae) : mr(ae), ae;
      }
    }
    function He(B, N, P) {
      return he(B, N, P, !0);
    }
    function Er(B, N, P) {
      return he(B, N, P, !1);
    }
    var Cn = Er, Ka = He;
    Xt.Fragment = n, Xt.jsx = Cn, Xt.jsxs = Ka;
  }()), Xt;
}
process.env.NODE_ENV === "production" ? N0.exports = ol() : N0.exports = sl();
var Jr = N0.exports, H0 = { exports: {} }, p0 = {};
/**
 * @license React
 * use-sync-external-store-with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ys;
function il() {
  if (ys) return p0;
  ys = 1;
  var r = cn;
  function e(l, i) {
    return l === i && (l !== 0 || 1 / l === 1 / i) || l !== l && i !== i;
  }
  var t = typeof Object.is == "function" ? Object.is : e, n = r.useSyncExternalStore, o = r.useRef, s = r.useEffect, c = r.useMemo, a = r.useDebugValue;
  return p0.useSyncExternalStoreWithSelector = function(l, i, u, h, d) {
    var f = o(null);
    if (f.current === null) {
      var x = { hasValue: !1, value: null };
      f.current = x;
    } else x = f.current;
    f = c(
      function() {
        function v(m) {
          if (!b) {
            if (b = !0, p = m, m = h(m), d !== void 0 && x.hasValue) {
              var _ = x.value;
              if (d(_, m))
                return g = _;
            }
            return g = m;
          }
          if (_ = g, t(p, m)) return _;
          var E = h(m);
          return d !== void 0 && d(_, E) ? (p = m, _) : (p = m, g = E);
        }
        var b = !1, p, g, y = u === void 0 ? null : u;
        return [
          function() {
            return v(i());
          },
          y === null ? void 0 : function() {
            return v(y());
          }
        ];
      },
      [i, u, h, d]
    );
    var w = n(l, f[0], f[1]);
    return s(
      function() {
        x.hasValue = !0, x.value = w;
      },
      [w]
    ), a(w), w;
  }, p0;
}
var g0 = {};
/**
 * @license React
 * use-sync-external-store-with-selector.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var vs;
function al() {
  return vs || (vs = 1, process.env.NODE_ENV !== "production" && function() {
    function r(l, i) {
      return l === i && (l !== 0 || 1 / l === 1 / i) || l !== l && i !== i;
    }
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
    var e = cn, t = typeof Object.is == "function" ? Object.is : r, n = e.useSyncExternalStore, o = e.useRef, s = e.useEffect, c = e.useMemo, a = e.useDebugValue;
    g0.useSyncExternalStoreWithSelector = function(l, i, u, h, d) {
      var f = o(null);
      if (f.current === null) {
        var x = { hasValue: !1, value: null };
        f.current = x;
      } else x = f.current;
      f = c(
        function() {
          function v(m) {
            if (!b) {
              if (b = !0, p = m, m = h(m), d !== void 0 && x.hasValue) {
                var _ = x.value;
                if (d(_, m))
                  return g = _;
              }
              return g = m;
            }
            if (_ = g, t(p, m))
              return _;
            var E = h(m);
            return d !== void 0 && d(_, E) ? (p = m, _) : (p = m, g = E);
          }
          var b = !1, p, g, y = u === void 0 ? null : u;
          return [
            function() {
              return v(i());
            },
            y === null ? void 0 : function() {
              return v(y());
            }
          ];
        },
        [i, u, h, d]
      );
      var w = n(l, f[0], f[1]);
      return s(
        function() {
          x.hasValue = !0, x.value = w;
        },
        [w]
      ), a(w), w;
    }, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
  }()), g0;
}
process.env.NODE_ENV === "production" ? H0.exports = il() : H0.exports = al();
var cl = H0.exports;
function ul(r) {
  r();
}
function ll() {
  let r = null, e = null;
  return {
    clear() {
      r = null, e = null;
    },
    notify() {
      ul(() => {
        let t = r;
        for (; t; )
          t.callback(), t = t.next;
      });
    },
    get() {
      const t = [];
      let n = r;
      for (; n; )
        t.push(n), n = n.next;
      return t;
    },
    subscribe(t) {
      let n = !0;
      const o = e = {
        callback: t,
        next: null,
        prev: e
      };
      return o.prev ? o.prev.next = o : r = o, function() {
        !n || r === null || (n = !1, o.next ? o.next.prev = o.prev : e = o.prev, o.prev ? o.prev.next = o.next : r = o.next);
      };
    }
  };
}
var ws = {
  notify() {
  },
  get: () => []
};
function fl(r, e) {
  let t, n = ws, o = 0, s = !1;
  function c(w) {
    u();
    const v = n.subscribe(w);
    let b = !1;
    return () => {
      b || (b = !0, v(), h());
    };
  }
  function a() {
    n.notify();
  }
  function l() {
    x.onStateChange && x.onStateChange();
  }
  function i() {
    return s;
  }
  function u() {
    o++, t || (t = r.subscribe(l), n = ll());
  }
  function h() {
    o--, t && o === 0 && (t(), t = void 0, n.clear(), n = ws);
  }
  function d() {
    s || (s = !0, u());
  }
  function f() {
    s && (s = !1, h());
  }
  const x = {
    addNestedSub: c,
    notifyNestedSubs: a,
    handleChangeWrapper: l,
    isSubscribed: i,
    trySubscribe: d,
    tryUnsubscribe: f,
    getListeners: () => n
  };
  return x;
}
var dl = () => typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u", hl = /* @__PURE__ */ dl(), xl = () => typeof navigator < "u" && navigator.product === "ReactNative", pl = /* @__PURE__ */ xl(), gl = () => hl || pl ? ke.useLayoutEffect : ke.useEffect, yl = /* @__PURE__ */ gl(), y0 = /* @__PURE__ */ Symbol.for("react-redux-context"), v0 = typeof globalThis < "u" ? globalThis : (
  /* fall back to a per-module scope (pre-8.1 behaviour) if `globalThis` is not available */
  {}
);
function vl() {
  if (!ke.createContext) return {};
  const r = v0[y0] ?? (v0[y0] = /* @__PURE__ */ new Map());
  let e = r.get(ke.createContext);
  return e || (e = ke.createContext(
    null
  ), process.env.NODE_ENV !== "production" && (e.displayName = "ReactRedux"), r.set(ke.createContext, e)), e;
}
var ut = /* @__PURE__ */ vl();
function wl(r) {
  const { children: e, context: t, serverState: n, store: o } = r, s = ke.useMemo(() => {
    const l = fl(o), i = {
      store: o,
      subscription: l,
      getServerState: n ? () => n : void 0
    };
    if (process.env.NODE_ENV === "production")
      return i;
    {
      const { identityFunctionCheck: u = "once", stabilityCheck: h = "once" } = r;
      return /* @__PURE__ */ Object.assign(i, {
        stabilityCheck: h,
        identityFunctionCheck: u
      });
    }
  }, [o, n]), c = ke.useMemo(() => o.getState(), [o]);
  yl(() => {
    const { subscription: l } = s;
    return l.onStateChange = l.notifyNestedSubs, l.trySubscribe(), c !== o.getState() && l.notifyNestedSubs(), () => {
      l.tryUnsubscribe(), l.onStateChange = void 0;
    };
  }, [s, c]);
  const a = t || ut;
  return /* @__PURE__ */ ke.createElement(a.Provider, { value: s }, e);
}
var bl = wl;
function so(r = ut) {
  return function() {
    const t = ke.useContext(r);
    if (process.env.NODE_ENV !== "production" && !t)
      throw new Error(
        "could not find react-redux context value; please ensure the component is wrapped in a <Provider>"
      );
    return t;
  };
}
var Yi = /* @__PURE__ */ so();
function Zi(r = ut) {
  const e = r === ut ? Yi : (
    // @ts-ignore
    so(r)
  ), t = () => {
    const { store: n } = e();
    return n;
  };
  return Object.assign(t, {
    withTypes: () => t
  }), t;
}
var ml = /* @__PURE__ */ Zi();
function El(r = ut) {
  const e = r === ut ? ml : Zi(r), t = () => e().dispatch;
  return Object.assign(t, {
    withTypes: () => t
  }), t;
}
var Xi = /* @__PURE__ */ El(), Al = (r, e) => r === e;
function _l(r = ut) {
  const e = r === ut ? Yi : so(r), t = (n, o = {}) => {
    const { equalityFn: s = Al } = typeof o == "function" ? { equalityFn: o } : o;
    if (process.env.NODE_ENV !== "production") {
      if (!n)
        throw new Error("You must pass a selector to useSelector");
      if (typeof n != "function")
        throw new Error("You must pass a function as a selector to useSelector");
      if (typeof s != "function")
        throw new Error(
          "You must pass a function as an equality function to useSelector"
        );
    }
    const c = e(), { store: a, subscription: l, getServerState: i } = c, u = ke.useRef(!0), h = ke.useCallback(
      {
        [n.name](f) {
          const x = n(f);
          if (process.env.NODE_ENV !== "production") {
            const { devModeChecks: w = {} } = typeof o == "function" ? {} : o, { identityFunctionCheck: v, stabilityCheck: b } = c, {
              identityFunctionCheck: p,
              stabilityCheck: g
            } = {
              stabilityCheck: b,
              identityFunctionCheck: v,
              ...w
            };
            if (g === "always" || g === "once" && u.current) {
              const y = n(f);
              if (!s(x, y)) {
                let m;
                try {
                  throw new Error();
                } catch (_) {
                  ({ stack: m } = _);
                }
                console.warn(
                  "Selector " + (n.name || "unknown") + ` returned a different result when called with the same parameters. This can lead to unnecessary rerenders.
Selectors that return a new reference (such as an object or an array) should be memoized: https://redux.js.org/usage/deriving-data-selectors#optimizing-selectors-with-memoization`,
                  {
                    state: f,
                    selected: x,
                    selected2: y,
                    stack: m
                  }
                );
              }
            }
            if ((p === "always" || p === "once" && u.current) && x === f) {
              let y;
              try {
                throw new Error();
              } catch (m) {
                ({ stack: y } = m);
              }
              console.warn(
                "Selector " + (n.name || "unknown") + ` returned the root state when called. This can lead to unnecessary rerenders.
Selectors that return the entire state are almost certainly a mistake, as they will cause a rerender whenever *anything* in state changes.`,
                { stack: y }
              );
            }
            u.current && (u.current = !1);
          }
          return x;
        }
      }[n.name],
      [n]
    ), d = cl.useSyncExternalStoreWithSelector(
      l.addNestedSub,
      a.getState,
      i || a.getState,
      h,
      s
    );
    return ke.useDebugValue(d), d;
  };
  return Object.assign(t, {
    withTypes: () => t
  }), t;
}
var Ht = /* @__PURE__ */ _l();
function fe(r) {
  return `Minified Redux error #${r}; visit https://redux.js.org/Errors?code=${r} for the full message or use the non-minified dev environment for full errors. `;
}
var Bl = typeof Symbol == "function" && Symbol.observable || "@@observable", bs = Bl, w0 = () => Math.random().toString(36).substring(7).split("").join("."), Cl = {
  INIT: `@@redux/INIT${/* @__PURE__ */ w0()}`,
  REPLACE: `@@redux/REPLACE${/* @__PURE__ */ w0()}`,
  PROBE_UNKNOWN_ACTION: () => `@@redux/PROBE_UNKNOWN_ACTION${w0()}`
}, yt = Cl;
function ur(r) {
  if (typeof r != "object" || r === null)
    return !1;
  let e = r;
  for (; Object.getPrototypeOf(e) !== null; )
    e = Object.getPrototypeOf(e);
  return Object.getPrototypeOf(r) === e || Object.getPrototypeOf(r) === null;
}
function kl(r) {
  if (r === void 0)
    return "undefined";
  if (r === null)
    return "null";
  const e = typeof r;
  switch (e) {
    case "boolean":
    case "string":
    case "number":
    case "symbol":
    case "function":
      return e;
  }
  if (Array.isArray(r))
    return "array";
  if (Fl(r))
    return "date";
  if (Sl(r))
    return "error";
  const t = Dl(r);
  switch (t) {
    case "Symbol":
    case "Promise":
    case "WeakMap":
    case "WeakSet":
    case "Map":
    case "Set":
      return t;
  }
  return Object.prototype.toString.call(r).slice(8, -1).toLowerCase().replace(/\s/g, "");
}
function Dl(r) {
  return typeof r.constructor == "function" ? r.constructor.name : null;
}
function Sl(r) {
  return r instanceof Error || typeof r.message == "string" && r.constructor && typeof r.constructor.stackTraceLimit == "number";
}
function Fl(r) {
  return r instanceof Date ? !0 : typeof r.toDateString == "function" && typeof r.getDate == "function" && typeof r.setDate == "function";
}
function ct(r) {
  let e = typeof r;
  return process.env.NODE_ENV !== "production" && (e = kl(r)), e;
}
function Ji(r, e, t) {
  if (typeof r != "function")
    throw new Error(process.env.NODE_ENV === "production" ? fe(2) : `Expected the root reducer to be a function. Instead, received: '${ct(r)}'`);
  if (typeof e == "function" && typeof t == "function" || typeof t == "function" && typeof arguments[3] == "function")
    throw new Error(process.env.NODE_ENV === "production" ? fe(0) : "It looks like you are passing several store enhancers to createStore(). This is not supported. Instead, compose them together to a single function. See https://redux.js.org/tutorials/fundamentals/part-4-store#creating-a-store-with-enhancers for an example.");
  if (typeof e == "function" && typeof t > "u" && (t = e, e = void 0), typeof t < "u") {
    if (typeof t != "function")
      throw new Error(process.env.NODE_ENV === "production" ? fe(1) : `Expected the enhancer to be a function. Instead, received: '${ct(t)}'`);
    return t(Ji)(r, e);
  }
  let n = r, o = e, s = /* @__PURE__ */ new Map(), c = s, a = 0, l = !1;
  function i() {
    c === s && (c = /* @__PURE__ */ new Map(), s.forEach((v, b) => {
      c.set(b, v);
    }));
  }
  function u() {
    if (l)
      throw new Error(process.env.NODE_ENV === "production" ? fe(3) : "You may not call store.getState() while the reducer is executing. The reducer has already received the state as an argument. Pass it down from the top reducer instead of reading it from the store.");
    return o;
  }
  function h(v) {
    if (typeof v != "function")
      throw new Error(process.env.NODE_ENV === "production" ? fe(4) : `Expected the listener to be a function. Instead, received: '${ct(v)}'`);
    if (l)
      throw new Error(process.env.NODE_ENV === "production" ? fe(5) : "You may not call store.subscribe() while the reducer is executing. If you would like to be notified after the store has been updated, subscribe from a component and invoke store.getState() in the callback to access the latest state. See https://redux.js.org/api/store#subscribelistener for more details.");
    let b = !0;
    i();
    const p = a++;
    return c.set(p, v), function() {
      if (b) {
        if (l)
          throw new Error(process.env.NODE_ENV === "production" ? fe(6) : "You may not unsubscribe from a store listener while the reducer is executing. See https://redux.js.org/api/store#subscribelistener for more details.");
        b = !1, i(), c.delete(p), s = null;
      }
    };
  }
  function d(v) {
    if (!ur(v))
      throw new Error(process.env.NODE_ENV === "production" ? fe(7) : `Actions must be plain objects. Instead, the actual type was: '${ct(v)}'. You may need to add middleware to your store setup to handle dispatching other values, such as 'redux-thunk' to handle dispatching functions. See https://redux.js.org/tutorials/fundamentals/part-4-store#middleware and https://redux.js.org/tutorials/fundamentals/part-6-async-logic#using-the-redux-thunk-middleware for examples.`);
    if (typeof v.type > "u")
      throw new Error(process.env.NODE_ENV === "production" ? fe(8) : 'Actions may not have an undefined "type" property. You may have misspelled an action type string constant.');
    if (typeof v.type != "string")
      throw new Error(process.env.NODE_ENV === "production" ? fe(17) : `Action "type" property must be a string. Instead, the actual type was: '${ct(v.type)}'. Value was: '${v.type}' (stringified)`);
    if (l)
      throw new Error(process.env.NODE_ENV === "production" ? fe(9) : "Reducers may not dispatch actions.");
    try {
      l = !0, o = n(o, v);
    } finally {
      l = !1;
    }
    return (s = c).forEach((p) => {
      p();
    }), v;
  }
  function f(v) {
    if (typeof v != "function")
      throw new Error(process.env.NODE_ENV === "production" ? fe(10) : `Expected the nextReducer to be a function. Instead, received: '${ct(v)}`);
    n = v, d({
      type: yt.REPLACE
    });
  }
  function x() {
    const v = h;
    return {
      /**
       * The minimal observable subscription method.
       * @param observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe(b) {
        if (typeof b != "object" || b === null)
          throw new Error(process.env.NODE_ENV === "production" ? fe(11) : `Expected the observer to be an object. Instead, received: '${ct(b)}'`);
        function p() {
          const y = b;
          y.next && y.next(u());
        }
        return p(), {
          unsubscribe: v(p)
        };
      },
      [bs]() {
        return this;
      }
    };
  }
  return d({
    type: yt.INIT
  }), {
    dispatch: d,
    subscribe: h,
    getState: u,
    replaceReducer: f,
    [bs]: x
  };
}
function ms(r) {
  typeof console < "u" && typeof console.error == "function" && console.error(r);
  try {
    throw new Error(r);
  } catch {
  }
}
function Tl(r, e, t, n) {
  const o = Object.keys(e), s = t && t.type === yt.INIT ? "preloadedState argument passed to createStore" : "previous state received by the reducer";
  if (o.length === 0)
    return "Store does not have a valid reducer. Make sure the argument passed to combineReducers is an object whose values are reducers.";
  if (!ur(r))
    return `The ${s} has unexpected type of "${ct(r)}". Expected argument to be an object with the following keys: "${o.join('", "')}"`;
  const c = Object.keys(r).filter((a) => !e.hasOwnProperty(a) && !n[a]);
  if (c.forEach((a) => {
    n[a] = !0;
  }), !(t && t.type === yt.REPLACE) && c.length > 0)
    return `Unexpected ${c.length > 1 ? "keys" : "key"} "${c.join('", "')}" found in ${s}. Expected to find one of the known reducer keys instead: "${o.join('", "')}". Unexpected keys will be ignored.`;
}
function Rl(r) {
  Object.keys(r).forEach((e) => {
    const t = r[e];
    if (typeof t(void 0, {
      type: yt.INIT
    }) > "u")
      throw new Error(process.env.NODE_ENV === "production" ? fe(12) : `The slice reducer for key "${e}" returned undefined during initialization. If the state passed to the reducer is undefined, you must explicitly return the initial state. The initial state may not be undefined. If you don't want to set a value for this reducer, you can use null instead of undefined.`);
    if (typeof t(void 0, {
      type: yt.PROBE_UNKNOWN_ACTION()
    }) > "u")
      throw new Error(process.env.NODE_ENV === "production" ? fe(13) : `The slice reducer for key "${e}" returned undefined when probed with a random type. Don't try to handle '${yt.INIT}' or other actions in "redux/*" namespace. They are considered private. Instead, you must return the current state for any unknown actions, unless it is undefined, in which case you must return the initial state, regardless of the action type. The initial state may not be undefined, but can be null.`);
  });
}
function Ol(r) {
  const e = Object.keys(r), t = {};
  for (let c = 0; c < e.length; c++) {
    const a = e[c];
    process.env.NODE_ENV !== "production" && typeof r[a] > "u" && ms(`No reducer provided for key "${a}"`), typeof r[a] == "function" && (t[a] = r[a]);
  }
  const n = Object.keys(t);
  let o;
  process.env.NODE_ENV !== "production" && (o = {});
  let s;
  try {
    Rl(t);
  } catch (c) {
    s = c;
  }
  return function(a = {}, l) {
    if (s)
      throw s;
    if (process.env.NODE_ENV !== "production") {
      const h = Tl(a, t, l, o);
      h && ms(h);
    }
    let i = !1;
    const u = {};
    for (let h = 0; h < n.length; h++) {
      const d = n[h], f = t[d], x = a[d], w = f(x, l);
      if (typeof w > "u") {
        const v = l && l.type;
        throw new Error(process.env.NODE_ENV === "production" ? fe(14) : `When called with an action of type ${v ? `"${String(v)}"` : "(unknown type)"}, the slice reducer for key "${d}" returned undefined. To ignore an action, you must explicitly return the previous state. If you want this reducer to hold no value, you can return null instead of undefined.`);
      }
      u[d] = w, i = i || w !== x;
    }
    return i = i || n.length !== Object.keys(a).length, i ? u : a;
  };
}
function Qr(...r) {
  return r.length === 0 ? (e) => e : r.length === 1 ? r[0] : r.reduce((e, t) => (...n) => e(t(...n)));
}
function Il(...r) {
  return (e) => (t, n) => {
    const o = e(t, n);
    let s = () => {
      throw new Error(process.env.NODE_ENV === "production" ? fe(15) : "Dispatching while constructing your middleware is not allowed. Other middleware would not be applied to this dispatch.");
    };
    const c = {
      getState: o.getState,
      dispatch: (l, ...i) => s(l, ...i)
    }, a = r.map((l) => l(c));
    return s = Qr(...a)(o.dispatch), {
      ...o,
      dispatch: s
    };
  };
}
function Qi(r) {
  return ur(r) && "type" in r && typeof r.type == "string";
}
var ea = Symbol.for("immer-nothing"), Es = Symbol.for("immer-draftable"), De = Symbol.for("immer-state"), Nl = process.env.NODE_ENV !== "production" ? [
  // All error codes, starting by 0:
  function(r) {
    return `The plugin for '${r}' has not been loaded into Immer. To enable the plugin, import and call \`enable${r}()\` when initializing your application.`;
  },
  function(r) {
    return `produce can only be called on things that are draftable: plain objects, arrays, Map, Set or classes that are marked with '[immerable]: true'. Got '${r}'`;
  },
  "This object has been frozen and should not be mutated",
  function(r) {
    return "Cannot use a proxy that has been revoked. Did you pass an object from inside an immer function to an async process? " + r;
  },
  "An immer producer returned a new value *and* modified its draft. Either return a new value *or* modify the draft.",
  "Immer forbids circular references",
  "The first or second argument to `produce` must be a function",
  "The third argument to `produce` must be a function or undefined",
  "First argument to `createDraft` must be a plain object, an array, or an immerable object",
  "First argument to `finishDraft` must be a draft returned by `createDraft`",
  function(r) {
    return `'current' expects a draft, got: ${r}`;
  },
  "Object.defineProperty() cannot be used on an Immer draft",
  "Object.setPrototypeOf() cannot be used on an Immer draft",
  "Immer only supports deleting array indices",
  "Immer only supports setting array indices and the 'length' property",
  function(r) {
    return `'original' expects a draft, got: ${r}`;
  }
  // Note: if more errors are added, the errorOffset in Patches.ts should be increased
  // See Patches.ts for additional errors
] : [];
function Ae(r, ...e) {
  if (process.env.NODE_ENV !== "production") {
    const t = Nl[r], n = typeof t == "function" ? t.apply(null, e) : t;
    throw new Error(`[Immer] ${n}`);
  }
  throw new Error(
    `[Immer] minified error nr: ${r}. Full error at: https://bit.ly/3cXEKWf`
  );
}
var Mt = Object.getPrototypeOf;
function mt(r) {
  return !!r && !!r[De];
}
function Ze(r) {
  var e;
  return r ? ta(r) || Array.isArray(r) || !!r[Es] || !!((e = r.constructor) != null && e[Es]) || dn(r) || hn(r) : !1;
}
var Hl = Object.prototype.constructor.toString();
function ta(r) {
  if (!r || typeof r != "object")
    return !1;
  const e = Mt(r);
  if (e === null)
    return !0;
  const t = Object.hasOwnProperty.call(e, "constructor") && e.constructor;
  return t === Object ? !0 : typeof t == "function" && Function.toString.call(t) === Hl;
}
function en(r, e) {
  fn(r) === 0 ? Reflect.ownKeys(r).forEach((t) => {
    e(t, r[t], r);
  }) : r.forEach((t, n) => e(n, t, r));
}
function fn(r) {
  const e = r[De];
  return e ? e.type_ : Array.isArray(r) ? 1 : dn(r) ? 2 : hn(r) ? 3 : 0;
}
function P0(r, e) {
  return fn(r) === 2 ? r.has(e) : Object.prototype.hasOwnProperty.call(r, e);
}
function ra(r, e, t) {
  const n = fn(r);
  n === 2 ? r.set(e, t) : n === 3 ? r.add(t) : r[e] = t;
}
function Pl(r, e) {
  return r === e ? r !== 0 || 1 / r === 1 / e : r !== r && e !== e;
}
function dn(r) {
  return r instanceof Map;
}
function hn(r) {
  return r instanceof Set;
}
function pt(r) {
  return r.copy_ || r.base_;
}
function U0(r, e) {
  if (dn(r))
    return new Map(r);
  if (hn(r))
    return new Set(r);
  if (Array.isArray(r))
    return Array.prototype.slice.call(r);
  const t = ta(r);
  if (e === !0 || e === "class_only" && !t) {
    const n = Object.getOwnPropertyDescriptors(r);
    delete n[De];
    let o = Reflect.ownKeys(n);
    for (let s = 0; s < o.length; s++) {
      const c = o[s], a = n[c];
      a.writable === !1 && (a.writable = !0, a.configurable = !0), (a.get || a.set) && (n[c] = {
        configurable: !0,
        writable: !0,
        // could live with !!desc.set as well here...
        enumerable: a.enumerable,
        value: r[c]
      });
    }
    return Object.create(Mt(r), n);
  } else {
    const n = Mt(r);
    if (n !== null && t)
      return { ...r };
    const o = Object.create(n);
    return Object.assign(o, r);
  }
}
function io(r, e = !1) {
  return xn(r) || mt(r) || !Ze(r) || (fn(r) > 1 && (r.set = r.add = r.clear = r.delete = Ul), Object.freeze(r), e && Object.entries(r).forEach(([t, n]) => io(n, !0))), r;
}
function Ul() {
  Ae(2);
}
function xn(r) {
  return Object.isFrozen(r);
}
var Ml = {};
function Et(r) {
  const e = Ml[r];
  return e || Ae(0, r), e;
}
var or;
function na() {
  return or;
}
function Ll(r, e) {
  return {
    drafts_: [],
    parent_: r,
    immer_: e,
    // Whenever the modified draft contains a draft from another scope, we
    // need to prevent auto-freezing so the unowned draft can be finalized.
    canAutoFreeze_: !0,
    unfinalizedDrafts_: 0
  };
}
function As(r, e) {
  e && (Et("Patches"), r.patches_ = [], r.inversePatches_ = [], r.patchListener_ = e);
}
function M0(r) {
  L0(r), r.drafts_.forEach(Wl), r.drafts_ = null;
}
function L0(r) {
  r === or && (or = r.parent_);
}
function _s(r) {
  return or = Ll(or, r);
}
function Wl(r) {
  const e = r[De];
  e.type_ === 0 || e.type_ === 1 ? e.revoke_() : e.revoked_ = !0;
}
function Bs(r, e) {
  e.unfinalizedDrafts_ = e.drafts_.length;
  const t = e.drafts_[0];
  return r !== void 0 && r !== t ? (t[De].modified_ && (M0(e), Ae(4)), Ze(r) && (r = tn(e, r), e.parent_ || rn(e, r)), e.patches_ && Et("Patches").generateReplacementPatches_(
    t[De].base_,
    r,
    e.patches_,
    e.inversePatches_
  )) : r = tn(e, t, []), M0(e), e.patches_ && e.patchListener_(e.patches_, e.inversePatches_), r !== ea ? r : void 0;
}
function tn(r, e, t) {
  if (xn(e))
    return e;
  const n = e[De];
  if (!n)
    return en(
      e,
      (o, s) => Cs(r, n, e, o, s, t)
    ), e;
  if (n.scope_ !== r)
    return e;
  if (!n.modified_)
    return rn(r, n.base_, !0), n.base_;
  if (!n.finalized_) {
    n.finalized_ = !0, n.scope_.unfinalizedDrafts_--;
    const o = n.copy_;
    let s = o, c = !1;
    n.type_ === 3 && (s = new Set(o), o.clear(), c = !0), en(
      s,
      (a, l) => Cs(r, n, o, a, l, t, c)
    ), rn(r, o, !1), t && r.patches_ && Et("Patches").generatePatches_(
      n,
      t,
      r.patches_,
      r.inversePatches_
    );
  }
  return n.copy_;
}
function Cs(r, e, t, n, o, s, c) {
  if (process.env.NODE_ENV !== "production" && o === t && Ae(5), mt(o)) {
    const a = s && e && e.type_ !== 3 && // Set objects are atomic since they have no keys.
    !P0(e.assigned_, n) ? s.concat(n) : void 0, l = tn(r, o, a);
    if (ra(t, n, l), mt(l))
      r.canAutoFreeze_ = !1;
    else
      return;
  } else c && t.add(o);
  if (Ze(o) && !xn(o)) {
    if (!r.immer_.autoFreeze_ && r.unfinalizedDrafts_ < 1)
      return;
    tn(r, o), (!e || !e.scope_.parent_) && typeof n != "symbol" && Object.prototype.propertyIsEnumerable.call(t, n) && rn(r, o);
  }
}
function rn(r, e, t = !1) {
  !r.parent_ && r.immer_.autoFreeze_ && r.canAutoFreeze_ && io(e, t);
}
function zl(r, e) {
  const t = Array.isArray(r), n = {
    type_: t ? 1 : 0,
    // Track which produce call this is associated with.
    scope_: e ? e.scope_ : na(),
    // True for both shallow and deep changes.
    modified_: !1,
    // Used during finalization.
    finalized_: !1,
    // Track which properties have been assigned (true) or deleted (false).
    assigned_: {},
    // The parent draft state.
    parent_: e,
    // The base state.
    base_: r,
    // The base proxy.
    draft_: null,
    // set below
    // The base copy with any updated values.
    copy_: null,
    // Called by the `produce` function.
    revoke_: null,
    isManual_: !1
  };
  let o = n, s = ao;
  t && (o = [n], s = sr);
  const { revoke: c, proxy: a } = Proxy.revocable(o, s);
  return n.draft_ = a, n.revoke_ = c, a;
}
var ao = {
  get(r, e) {
    if (e === De)
      return r;
    const t = pt(r);
    if (!P0(t, e))
      return jl(r, t, e);
    const n = t[e];
    return r.finalized_ || !Ze(n) ? n : n === b0(r.base_, e) ? (m0(r), r.copy_[e] = z0(n, r)) : n;
  },
  has(r, e) {
    return e in pt(r);
  },
  ownKeys(r) {
    return Reflect.ownKeys(pt(r));
  },
  set(r, e, t) {
    const n = oa(pt(r), e);
    if (n != null && n.set)
      return n.set.call(r.draft_, t), !0;
    if (!r.modified_) {
      const o = b0(pt(r), e), s = o == null ? void 0 : o[De];
      if (s && s.base_ === t)
        return r.copy_[e] = t, r.assigned_[e] = !1, !0;
      if (Pl(t, o) && (t !== void 0 || P0(r.base_, e)))
        return !0;
      m0(r), W0(r);
    }
    return r.copy_[e] === t && // special case: handle new props with value 'undefined'
    (t !== void 0 || e in r.copy_) || // special case: NaN
    Number.isNaN(t) && Number.isNaN(r.copy_[e]) || (r.copy_[e] = t, r.assigned_[e] = !0), !0;
  },
  deleteProperty(r, e) {
    return b0(r.base_, e) !== void 0 || e in r.base_ ? (r.assigned_[e] = !1, m0(r), W0(r)) : delete r.assigned_[e], r.copy_ && delete r.copy_[e], !0;
  },
  // Note: We never coerce `desc.value` into an Immer draft, because we can't make
  // the same guarantee in ES5 mode.
  getOwnPropertyDescriptor(r, e) {
    const t = pt(r), n = Reflect.getOwnPropertyDescriptor(t, e);
    return n && {
      writable: !0,
      configurable: r.type_ !== 1 || e !== "length",
      enumerable: n.enumerable,
      value: t[e]
    };
  },
  defineProperty() {
    Ae(11);
  },
  getPrototypeOf(r) {
    return Mt(r.base_);
  },
  setPrototypeOf() {
    Ae(12);
  }
}, sr = {};
en(ao, (r, e) => {
  sr[r] = function() {
    return arguments[0] = arguments[0][0], e.apply(this, arguments);
  };
});
sr.deleteProperty = function(r, e) {
  return process.env.NODE_ENV !== "production" && isNaN(parseInt(e)) && Ae(13), sr.set.call(this, r, e, void 0);
};
sr.set = function(r, e, t) {
  return process.env.NODE_ENV !== "production" && e !== "length" && isNaN(parseInt(e)) && Ae(14), ao.set.call(this, r[0], e, t, r[0]);
};
function b0(r, e) {
  const t = r[De];
  return (t ? pt(t) : r)[e];
}
function jl(r, e, t) {
  var o;
  const n = oa(e, t);
  return n ? "value" in n ? n.value : (
    // This is a very special case, if the prop is a getter defined by the
    // prototype, we should invoke it with the draft as context!
    (o = n.get) == null ? void 0 : o.call(r.draft_)
  ) : void 0;
}
function oa(r, e) {
  if (!(e in r))
    return;
  let t = Mt(r);
  for (; t; ) {
    const n = Object.getOwnPropertyDescriptor(t, e);
    if (n)
      return n;
    t = Mt(t);
  }
}
function W0(r) {
  r.modified_ || (r.modified_ = !0, r.parent_ && W0(r.parent_));
}
function m0(r) {
  r.copy_ || (r.copy_ = U0(
    r.base_,
    r.scope_.immer_.useStrictShallowCopy_
  ));
}
var Kl = class {
  constructor(r) {
    this.autoFreeze_ = !0, this.useStrictShallowCopy_ = !1, this.produce = (e, t, n) => {
      if (typeof e == "function" && typeof t != "function") {
        const s = t;
        t = e;
        const c = this;
        return function(l = s, ...i) {
          return c.produce(l, (u) => t.call(this, u, ...i));
        };
      }
      typeof t != "function" && Ae(6), n !== void 0 && typeof n != "function" && Ae(7);
      let o;
      if (Ze(e)) {
        const s = _s(this), c = z0(e, void 0);
        let a = !0;
        try {
          o = t(c), a = !1;
        } finally {
          a ? M0(s) : L0(s);
        }
        return As(s, n), Bs(o, s);
      } else if (!e || typeof e != "object") {
        if (o = t(e), o === void 0 && (o = e), o === ea && (o = void 0), this.autoFreeze_ && io(o, !0), n) {
          const s = [], c = [];
          Et("Patches").generateReplacementPatches_(e, o, s, c), n(s, c);
        }
        return o;
      } else
        Ae(1, e);
    }, this.produceWithPatches = (e, t) => {
      if (typeof e == "function")
        return (c, ...a) => this.produceWithPatches(c, (l) => e(l, ...a));
      let n, o;
      return [this.produce(e, t, (c, a) => {
        n = c, o = a;
      }), n, o];
    }, typeof (r == null ? void 0 : r.autoFreeze) == "boolean" && this.setAutoFreeze(r.autoFreeze), typeof (r == null ? void 0 : r.useStrictShallowCopy) == "boolean" && this.setUseStrictShallowCopy(r.useStrictShallowCopy);
  }
  createDraft(r) {
    Ze(r) || Ae(8), mt(r) && (r = $l(r));
    const e = _s(this), t = z0(r, void 0);
    return t[De].isManual_ = !0, L0(e), t;
  }
  finishDraft(r, e) {
    const t = r && r[De];
    (!t || !t.isManual_) && Ae(9);
    const { scope_: n } = t;
    return As(n, e), Bs(void 0, n);
  }
  /**
   * Pass true to automatically freeze all copies created by Immer.
   *
   * By default, auto-freezing is enabled.
   */
  setAutoFreeze(r) {
    this.autoFreeze_ = r;
  }
  /**
   * Pass true to enable strict shallow copy.
   *
   * By default, immer does not copy the object descriptors such as getter, setter and non-enumrable properties.
   */
  setUseStrictShallowCopy(r) {
    this.useStrictShallowCopy_ = r;
  }
  applyPatches(r, e) {
    let t;
    for (t = e.length - 1; t >= 0; t--) {
      const o = e[t];
      if (o.path.length === 0 && o.op === "replace") {
        r = o.value;
        break;
      }
    }
    t > -1 && (e = e.slice(t + 1));
    const n = Et("Patches").applyPatches_;
    return mt(r) ? n(r, e) : this.produce(
      r,
      (o) => n(o, e)
    );
  }
};
function z0(r, e) {
  const t = dn(r) ? Et("MapSet").proxyMap_(r, e) : hn(r) ? Et("MapSet").proxySet_(r, e) : zl(r, e);
  return (e ? e.scope_ : na()).drafts_.push(t), t;
}
function $l(r) {
  return mt(r) || Ae(10, r), sa(r);
}
function sa(r) {
  if (!Ze(r) || xn(r))
    return r;
  const e = r[De];
  let t;
  if (e) {
    if (!e.modified_)
      return e.base_;
    e.finalized_ = !0, t = U0(r, e.scope_.immer_.useStrictShallowCopy_);
  } else
    t = U0(r, !0);
  return en(t, (n, o) => {
    ra(t, n, sa(o));
  }), e && (e.finalized_ = !1), t;
}
var Se = new Kl(), ia = Se.produce;
Se.produceWithPatches.bind(
  Se
);
Se.setAutoFreeze.bind(Se);
Se.setUseStrictShallowCopy.bind(Se);
Se.applyPatches.bind(Se);
Se.createDraft.bind(Se);
Se.finishDraft.bind(Se);
var Vl = (r, e, t) => {
  if (e.length === 1 && e[0] === t) {
    let n = !1;
    try {
      const o = {};
      r(o) === o && (n = !0);
    } catch {
    }
    if (n) {
      let o;
      try {
        throw new Error();
      } catch (s) {
        ({ stack: o } = s);
      }
      console.warn(
        `The result function returned its own inputs without modification. e.g
\`createSelector([state => state.todos], todos => todos)\`
This could lead to inefficient memoization and unnecessary re-renders.
Ensure transformation logic is in the result function, and extraction logic is in the input selectors.`,
        { stack: o }
      );
    }
  }
}, ql = (r, e, t) => {
  const { memoize: n, memoizeOptions: o } = e, { inputSelectorResults: s, inputSelectorResultsCopy: c } = r, a = n(() => ({}), ...o);
  if (!(a.apply(null, s) === a.apply(null, c))) {
    let i;
    try {
      throw new Error();
    } catch (u) {
      ({ stack: i } = u);
    }
    console.warn(
      `An input selector returned a different result when passed same arguments.
This means your output selector will likely run more frequently than intended.
Avoid returning a new reference inside your input selector, e.g.
\`createSelector([state => state.todos.map(todo => todo.id)], todoIds => todoIds.length)\``,
      {
        arguments: t,
        firstInputs: s,
        secondInputs: c,
        stack: i
      }
    );
  }
}, Gl = {
  inputStabilityCheck: "once",
  identityFunctionCheck: "once"
};
function Yl(r, e = `expected a function, instead received ${typeof r}`) {
  if (typeof r != "function")
    throw new TypeError(e);
}
function Zl(r, e = `expected an object, instead received ${typeof r}`) {
  if (typeof r != "object")
    throw new TypeError(e);
}
function Xl(r, e = "expected all items to be functions, instead received the following types: ") {
  if (!r.every((t) => typeof t == "function")) {
    const t = r.map(
      (n) => typeof n == "function" ? `function ${n.name || "unnamed"}()` : typeof n
    ).join(", ");
    throw new TypeError(`${e}[${t}]`);
  }
}
var ks = (r) => Array.isArray(r) ? r : [r];
function Jl(r) {
  const e = Array.isArray(r[0]) ? r[0] : r;
  return Xl(
    e,
    "createSelector expects all input-selectors to be functions, but received the following types: "
  ), e;
}
function Ds(r, e) {
  const t = [], { length: n } = r;
  for (let o = 0; o < n; o++)
    t.push(r[o].apply(null, e));
  return t;
}
var Ql = (r, e) => {
  const { identityFunctionCheck: t, inputStabilityCheck: n } = {
    ...Gl,
    ...e
  };
  return {
    identityFunctionCheck: {
      shouldRun: t === "always" || t === "once" && r,
      run: Vl
    },
    inputStabilityCheck: {
      shouldRun: n === "always" || n === "once" && r,
      run: ql
    }
  };
}, ef = class {
  constructor(r) {
    this.value = r;
  }
  deref() {
    return this.value;
  }
}, tf = typeof WeakRef < "u" ? WeakRef : ef, rf = 0, Ss = 1;
function Rr() {
  return {
    s: rf,
    v: void 0,
    o: null,
    p: null
  };
}
function aa(r, e = {}) {
  let t = Rr();
  const { resultEqualityCheck: n } = e;
  let o, s = 0;
  function c() {
    var h;
    let a = t;
    const { length: l } = arguments;
    for (let d = 0, f = l; d < f; d++) {
      const x = arguments[d];
      if (typeof x == "function" || typeof x == "object" && x !== null) {
        let w = a.o;
        w === null && (a.o = w = /* @__PURE__ */ new WeakMap());
        const v = w.get(x);
        v === void 0 ? (a = Rr(), w.set(x, a)) : a = v;
      } else {
        let w = a.p;
        w === null && (a.p = w = /* @__PURE__ */ new Map());
        const v = w.get(x);
        v === void 0 ? (a = Rr(), w.set(x, a)) : a = v;
      }
    }
    const i = a;
    let u;
    if (a.s === Ss)
      u = a.v;
    else if (u = r.apply(null, arguments), s++, n) {
      const d = ((h = o == null ? void 0 : o.deref) == null ? void 0 : h.call(o)) ?? o;
      d != null && n(d, u) && (u = d, s !== 0 && s--), o = typeof u == "object" && u !== null || typeof u == "function" ? new tf(u) : u;
    }
    return i.s = Ss, i.v = u, u;
  }
  return c.clearCache = () => {
    t = Rr(), c.resetResultsCount();
  }, c.resultsCount = () => s, c.resetResultsCount = () => {
    s = 0;
  }, c;
}
function nf(r, ...e) {
  const t = typeof r == "function" ? {
    memoize: r,
    memoizeOptions: e
  } : r, n = (...o) => {
    let s = 0, c = 0, a, l = {}, i = o.pop();
    typeof i == "object" && (l = i, i = o.pop()), Yl(
      i,
      `createSelector expects an output function after the inputs, but received: [${typeof i}]`
    );
    const u = {
      ...t,
      ...l
    }, {
      memoize: h,
      memoizeOptions: d = [],
      argsMemoize: f = aa,
      argsMemoizeOptions: x = [],
      devModeChecks: w = {}
    } = u, v = ks(d), b = ks(x), p = Jl(o), g = h(function() {
      return s++, i.apply(
        null,
        arguments
      );
    }, ...v);
    let y = !0;
    const m = f(function() {
      c++;
      const E = Ds(
        p,
        arguments
      );
      if (a = g.apply(null, E), process.env.NODE_ENV !== "production") {
        const { identityFunctionCheck: C, inputStabilityCheck: D } = Ql(y, w);
        if (C.shouldRun && C.run(
          i,
          E,
          a
        ), D.shouldRun) {
          const A = Ds(
            p,
            arguments
          );
          D.run(
            { inputSelectorResults: E, inputSelectorResultsCopy: A },
            { memoize: h, memoizeOptions: v },
            arguments
          );
        }
        y && (y = !1);
      }
      return a;
    }, ...b);
    return Object.assign(m, {
      resultFunc: i,
      memoizedResultFunc: g,
      dependencies: p,
      dependencyRecomputations: () => c,
      resetDependencyRecomputations: () => {
        c = 0;
      },
      lastResult: () => a,
      recomputations: () => s,
      resetRecomputations: () => {
        s = 0;
      },
      memoize: h,
      argsMemoize: f
    });
  };
  return Object.assign(n, {
    withTypes: () => n
  }), n;
}
var Ct = /* @__PURE__ */ nf(aa), of = Object.assign(
  (r, e = Ct) => {
    Zl(
      r,
      `createStructuredSelector expects first argument to be an object where each property is a selector, instead received a ${typeof r}`
    );
    const t = Object.keys(r), n = t.map(
      (s) => r[s]
    );
    return e(
      n,
      (...s) => s.reduce((c, a, l) => (c[t[l]] = a, c), {})
    );
  },
  { withTypes: () => of }
);
function ca(r) {
  return ({ dispatch: t, getState: n }) => (o) => (s) => typeof s == "function" ? s(t, n, r) : o(s);
}
var sf = ca(), af = ca, cf = typeof window < "u" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : function() {
  if (arguments.length !== 0)
    return typeof arguments[0] == "object" ? Qr : Qr.apply(null, arguments);
}, ua = (r) => r && typeof r.match == "function";
function rr(r, e) {
  function t(...n) {
    if (e) {
      let o = e(...n);
      if (!o)
        throw new Error(process.env.NODE_ENV === "production" ? ee(0) : "prepareAction did not return an object");
      return {
        type: r,
        payload: o.payload,
        ..."meta" in o && {
          meta: o.meta
        },
        ..."error" in o && {
          error: o.error
        }
      };
    }
    return {
      type: r,
      payload: n[0]
    };
  }
  return t.toString = () => `${r}`, t.type = r, t.match = (n) => Qi(n) && n.type === r, t;
}
function uf(r) {
  return typeof r == "function" && "type" in r && // hasMatchFunction only wants Matchers but I don't see the point in rewriting it
  ua(r);
}
function lf(r) {
  const e = r ? `${r}`.split("/") : [], t = e[e.length - 1] || "actionCreator";
  return `Detected an action creator with type "${r || "unknown"}" being dispatched. 
Make sure you're calling the action creator before dispatching, i.e. \`dispatch(${t}())\` instead of \`dispatch(${t})\`. This is necessary even if the action has no payload.`;
}
function ff(r = {}) {
  if (process.env.NODE_ENV === "production")
    return () => (t) => (n) => t(n);
  const {
    isActionCreator: e = uf
  } = r;
  return () => (t) => (n) => (e(n) && console.warn(lf(n.type)), t(n));
}
function la(r, e) {
  let t = 0;
  return {
    measureTime(n) {
      const o = Date.now();
      try {
        return n();
      } finally {
        const s = Date.now();
        t += s - o;
      }
    },
    warnIfExceeded() {
      t > r && console.warn(`${e} took ${t}ms, which is more than the warning threshold of ${r}ms. 
If your state or actions are very large, you may want to disable the middleware as it might cause too much of a slowdown in development mode. See https://redux-toolkit.js.org/api/getDefaultMiddleware for instructions.
It is disabled in production builds, so you don't need to worry about that.`);
    }
  };
}
var fa = class er extends Array {
  constructor(...e) {
    super(...e), Object.setPrototypeOf(this, er.prototype);
  }
  static get [Symbol.species]() {
    return er;
  }
  concat(...e) {
    return super.concat.apply(this, e);
  }
  prepend(...e) {
    return e.length === 1 && Array.isArray(e[0]) ? new er(...e[0].concat(this)) : new er(...e.concat(this));
  }
};
function Fs(r) {
  return Ze(r) ? ia(r, () => {
  }) : r;
}
function Or(r, e, t) {
  return r.has(e) ? r.get(e) : r.set(e, t(e)).get(e);
}
function df(r) {
  return typeof r != "object" || r == null || Object.isFrozen(r);
}
function hf(r, e, t) {
  const n = da(r, e, t);
  return {
    detectMutations() {
      return ha(r, e, n, t);
    }
  };
}
function da(r, e = [], t, n = "", o = /* @__PURE__ */ new Set()) {
  const s = {
    value: t
  };
  if (!r(t) && !o.has(t)) {
    o.add(t), s.children = {};
    for (const c in t) {
      const a = n ? n + "." + c : c;
      e.length && e.indexOf(a) !== -1 || (s.children[c] = da(r, e, t[c], a));
    }
  }
  return s;
}
function ha(r, e = [], t, n, o = !1, s = "") {
  const c = t ? t.value : void 0, a = c === n;
  if (o && !a && !Number.isNaN(n))
    return {
      wasMutated: !0,
      path: s
    };
  if (r(c) || r(n))
    return {
      wasMutated: !1
    };
  const l = {};
  for (let u in t.children)
    l[u] = !0;
  for (let u in n)
    l[u] = !0;
  const i = e.length > 0;
  for (let u in l) {
    const h = s ? s + "." + u : u;
    if (i && e.some((x) => x instanceof RegExp ? x.test(h) : h === x))
      continue;
    const d = ha(r, e, t.children[u], n[u], a, h);
    if (d.wasMutated)
      return d;
  }
  return {
    wasMutated: !1
  };
}
function xf(r = {}) {
  if (process.env.NODE_ENV === "production")
    return () => (e) => (t) => e(t);
  {
    let e = function(a, l, i, u) {
      return JSON.stringify(a, t(l, u), i);
    }, t = function(a, l) {
      let i = [], u = [];
      return l || (l = function(h, d) {
        return i[0] === d ? "[Circular ~]" : "[Circular ~." + u.slice(0, i.indexOf(d)).join(".") + "]";
      }), function(h, d) {
        if (i.length > 0) {
          var f = i.indexOf(this);
          ~f ? i.splice(f + 1) : i.push(this), ~f ? u.splice(f, 1 / 0, h) : u.push(h), ~i.indexOf(d) && (d = l.call(this, h, d));
        } else i.push(d);
        return a == null ? d : a.call(this, h, d);
      };
    }, {
      isImmutable: n = df,
      ignoredPaths: o,
      warnAfter: s = 32
    } = r;
    const c = hf.bind(null, n, o);
    return ({
      getState: a
    }) => {
      let l = a(), i = c(l), u;
      return (h) => (d) => {
        const f = la(s, "ImmutableStateInvariantMiddleware");
        f.measureTime(() => {
          if (l = a(), u = i.detectMutations(), i = c(l), u.wasMutated)
            throw new Error(process.env.NODE_ENV === "production" ? ee(19) : `A state mutation was detected between dispatches, in the path '${u.path || ""}'.  This may cause incorrect behavior. (https://redux.js.org/style-guide/style-guide#do-not-mutate-state)`);
        });
        const x = h(d);
        return f.measureTime(() => {
          if (l = a(), u = i.detectMutations(), i = c(l), u.wasMutated)
            throw new Error(process.env.NODE_ENV === "production" ? ee(20) : `A state mutation was detected inside a dispatch, in the path: ${u.path || ""}. Take a look at the reducer(s) handling the action ${e(d)}. (https://redux.js.org/style-guide/style-guide#do-not-mutate-state)`);
        }), f.warnIfExceeded(), x;
      };
    };
  }
}
function xa(r) {
  const e = typeof r;
  return r == null || e === "string" || e === "boolean" || e === "number" || Array.isArray(r) || ur(r);
}
function j0(r, e = "", t = xa, n, o = [], s) {
  let c;
  if (!t(r))
    return {
      keyPath: e || "<root>",
      value: r
    };
  if (typeof r != "object" || r === null || s != null && s.has(r)) return !1;
  const a = n != null ? n(r) : Object.entries(r), l = o.length > 0;
  for (const [i, u] of a) {
    const h = e ? e + "." + i : i;
    if (!(l && o.some((f) => f instanceof RegExp ? f.test(h) : h === f))) {
      if (!t(u))
        return {
          keyPath: h,
          value: u
        };
      if (typeof u == "object" && (c = j0(u, h, t, n, o, s), c))
        return c;
    }
  }
  return s && pa(r) && s.add(r), !1;
}
function pa(r) {
  if (!Object.isFrozen(r)) return !1;
  for (const e of Object.values(r))
    if (!(typeof e != "object" || e === null) && !pa(e))
      return !1;
  return !0;
}
function pf(r = {}) {
  if (process.env.NODE_ENV === "production")
    return () => (e) => (t) => e(t);
  {
    const {
      isSerializable: e = xa,
      getEntries: t,
      ignoredActions: n = [],
      ignoredActionPaths: o = ["meta.arg", "meta.baseQueryMeta"],
      ignoredPaths: s = [],
      warnAfter: c = 32,
      ignoreState: a = !1,
      ignoreActions: l = !1,
      disableCache: i = !1
    } = r, u = !i && WeakSet ? /* @__PURE__ */ new WeakSet() : void 0;
    return (h) => (d) => (f) => {
      if (!Qi(f))
        return d(f);
      const x = d(f), w = la(c, "SerializableStateInvariantMiddleware");
      return !l && !(n.length && n.indexOf(f.type) !== -1) && w.measureTime(() => {
        const v = j0(f, "", e, t, o, u);
        if (v) {
          const {
            keyPath: b,
            value: p
          } = v;
          console.error(`A non-serializable value was detected in an action, in the path: \`${b}\`. Value:`, p, `
Take a look at the logic that dispatched this action: `, f, `
(See https://redux.js.org/faq/actions#why-should-type-be-a-string-or-at-least-serializable-why-should-my-action-types-be-constants)`, `
(To allow non-serializable values see: https://redux-toolkit.js.org/usage/usage-guide#working-with-non-serializable-data)`);
        }
      }), a || (w.measureTime(() => {
        const v = h.getState(), b = j0(v, "", e, t, s, u);
        if (b) {
          const {
            keyPath: p,
            value: g
          } = b;
          console.error(`A non-serializable value was detected in the state, in the path: \`${p}\`. Value:`, g, `
Take a look at the reducer(s) handling this action type: ${f.type}.
(See https://redux.js.org/faq/organizing-state#can-i-put-functions-promises-or-other-non-serializable-items-in-my-store-state)`);
        }
      }), w.warnIfExceeded()), x;
    };
  }
}
function Ir(r) {
  return typeof r == "boolean";
}
var gf = () => function(e) {
  const {
    thunk: t = !0,
    immutableCheck: n = !0,
    serializableCheck: o = !0,
    actionCreatorCheck: s = !0
  } = e ?? {};
  let c = new fa();
  if (t && (Ir(t) ? c.push(sf) : c.push(af(t.extraArgument))), process.env.NODE_ENV !== "production") {
    if (n) {
      let a = {};
      Ir(n) || (a = n), c.unshift(xf(a));
    }
    if (o) {
      let a = {};
      Ir(o) || (a = o), c.push(pf(a));
    }
    if (s) {
      let a = {};
      Ir(s) || (a = s), c.unshift(ff(a));
    }
  }
  return c;
}, yf = "RTK_autoBatch", Ts = (r) => (e) => {
  setTimeout(e, r);
}, vf = (r = {
  type: "raf"
}) => (e) => (...t) => {
  const n = e(...t);
  let o = !0, s = !1, c = !1;
  const a = /* @__PURE__ */ new Set(), l = r.type === "tick" ? queueMicrotask : r.type === "raf" ? (
    // requestAnimationFrame won't exist in SSR environments. Fall back to a vague approximation just to keep from erroring.
    typeof window < "u" && window.requestAnimationFrame ? window.requestAnimationFrame : Ts(10)
  ) : r.type === "callback" ? r.queueNotification : Ts(r.timeout), i = () => {
    c = !1, s && (s = !1, a.forEach((u) => u()));
  };
  return Object.assign({}, n, {
    // Override the base `store.subscribe` method to keep original listeners
    // from running if we're delaying notifications
    subscribe(u) {
      const h = () => o && u(), d = n.subscribe(h);
      return a.add(u), () => {
        d(), a.delete(u);
      };
    },
    // Override the base `store.dispatch` method so that we can check actions
    // for the `shouldAutoBatch` flag and determine if batching is active
    dispatch(u) {
      var h;
      try {
        return o = !((h = u == null ? void 0 : u.meta) != null && h[yf]), s = !o, s && (c || (c = !0, l(i))), n.dispatch(u);
      } finally {
        o = !0;
      }
    }
  });
}, wf = (r) => function(t) {
  const {
    autoBatch: n = !0
  } = t ?? {};
  let o = new fa(r);
  return n && o.push(vf(typeof n == "object" ? n : void 0)), o;
};
function bf(r) {
  const e = gf(), {
    reducer: t = void 0,
    middleware: n,
    devTools: o = !0,
    duplicateMiddlewareCheck: s = !0,
    preloadedState: c = void 0,
    enhancers: a = void 0
  } = r || {};
  let l;
  if (typeof t == "function")
    l = t;
  else if (ur(t))
    l = Ol(t);
  else
    throw new Error(process.env.NODE_ENV === "production" ? ee(1) : "`reducer` is a required argument, and must be a function or an object of functions that can be passed to combineReducers");
  if (process.env.NODE_ENV !== "production" && n && typeof n != "function")
    throw new Error(process.env.NODE_ENV === "production" ? ee(2) : "`middleware` field must be a callback");
  let i;
  if (typeof n == "function") {
    if (i = n(e), process.env.NODE_ENV !== "production" && !Array.isArray(i))
      throw new Error(process.env.NODE_ENV === "production" ? ee(3) : "when using a middleware builder function, an array of middleware must be returned");
  } else
    i = e();
  if (process.env.NODE_ENV !== "production" && i.some((w) => typeof w != "function"))
    throw new Error(process.env.NODE_ENV === "production" ? ee(4) : "each middleware provided to configureStore must be a function");
  if (process.env.NODE_ENV !== "production" && s) {
    let w = /* @__PURE__ */ new Set();
    i.forEach((v) => {
      if (w.has(v))
        throw new Error(process.env.NODE_ENV === "production" ? ee(42) : "Duplicate middleware references found when creating the store. Ensure that each middleware is only included once.");
      w.add(v);
    });
  }
  let u = Qr;
  o && (u = cf({
    // Enable capture of stack traces for dispatched Redux actions
    trace: process.env.NODE_ENV !== "production",
    ...typeof o == "object" && o
  }));
  const h = Il(...i), d = wf(h);
  if (process.env.NODE_ENV !== "production" && a && typeof a != "function")
    throw new Error(process.env.NODE_ENV === "production" ? ee(5) : "`enhancers` field must be a callback");
  let f = typeof a == "function" ? a(d) : d();
  if (process.env.NODE_ENV !== "production" && !Array.isArray(f))
    throw new Error(process.env.NODE_ENV === "production" ? ee(6) : "`enhancers` callback must return an array");
  if (process.env.NODE_ENV !== "production" && f.some((w) => typeof w != "function"))
    throw new Error(process.env.NODE_ENV === "production" ? ee(7) : "each enhancer provided to configureStore must be a function");
  process.env.NODE_ENV !== "production" && i.length && !f.includes(h) && console.error("middlewares were provided, but middleware enhancer was not included in final enhancers - make sure to call `getDefaultEnhancers`");
  const x = u(...f);
  return Ji(l, c, x);
}
function ga(r) {
  const e = {}, t = [];
  let n;
  const o = {
    addCase(s, c) {
      if (process.env.NODE_ENV !== "production") {
        if (t.length > 0)
          throw new Error(process.env.NODE_ENV === "production" ? ee(26) : "`builder.addCase` should only be called before calling `builder.addMatcher`");
        if (n)
          throw new Error(process.env.NODE_ENV === "production" ? ee(27) : "`builder.addCase` should only be called before calling `builder.addDefaultCase`");
      }
      const a = typeof s == "string" ? s : s.type;
      if (!a)
        throw new Error(process.env.NODE_ENV === "production" ? ee(28) : "`builder.addCase` cannot be called with an empty action type");
      if (a in e)
        throw new Error(process.env.NODE_ENV === "production" ? ee(29) : `\`builder.addCase\` cannot be called with two reducers for the same action type '${a}'`);
      return e[a] = c, o;
    },
    addMatcher(s, c) {
      if (process.env.NODE_ENV !== "production" && n)
        throw new Error(process.env.NODE_ENV === "production" ? ee(30) : "`builder.addMatcher` should only be called before calling `builder.addDefaultCase`");
      return t.push({
        matcher: s,
        reducer: c
      }), o;
    },
    addDefaultCase(s) {
      if (process.env.NODE_ENV !== "production" && n)
        throw new Error(process.env.NODE_ENV === "production" ? ee(31) : "`builder.addDefaultCase` can only be called once");
      return n = s, o;
    }
  };
  return r(o), [e, t, n];
}
function mf(r) {
  return typeof r == "function";
}
function Ef(r, e) {
  if (process.env.NODE_ENV !== "production" && typeof e == "object")
    throw new Error(process.env.NODE_ENV === "production" ? ee(8) : "The object notation for `createReducer` has been removed. Please use the 'builder callback' notation instead: https://redux-toolkit.js.org/api/createReducer");
  let [t, n, o] = ga(e), s;
  if (mf(r))
    s = () => Fs(r());
  else {
    const a = Fs(r);
    s = () => a;
  }
  function c(a = s(), l) {
    let i = [t[l.type], ...n.filter(({
      matcher: u
    }) => u(l)).map(({
      reducer: u
    }) => u)];
    return i.filter((u) => !!u).length === 0 && (i = [o]), i.reduce((u, h) => {
      if (h)
        if (mt(u)) {
          const f = h(u, l);
          return f === void 0 ? u : f;
        } else {
          if (Ze(u))
            return ia(u, (d) => h(d, l));
          {
            const d = h(u, l);
            if (d === void 0) {
              if (u === null)
                return u;
              throw Error("A case reducer on a non-draftable value must not return undefined");
            }
            return d;
          }
        }
      return u;
    }, a);
  }
  return c.getInitialState = s, c;
}
var Af = (r, e) => ua(r) ? r.match(e) : r(e);
function _f(...r) {
  return (e) => r.some((t) => Af(t, e));
}
var Bf = "ModuleSymbhasOwnPr-0123456789ABCDEFGHNRVfgctiUvz_KqYTJkLxpZXIjQW", Cf = (r = 21) => {
  let e = "", t = r;
  for (; t--; )
    e += Bf[Math.random() * 64 | 0];
  return e;
}, kf = ["name", "message", "stack", "code"], E0 = class {
  constructor(r, e) {
    /*
    type-only property to distinguish between RejectWithValue and FulfillWithMeta
    does not exist at runtime
    */
    ce(this, "_type");
    this.payload = r, this.meta = e;
  }
}, Rs = class {
  constructor(r, e) {
    /*
    type-only property to distinguish between RejectWithValue and FulfillWithMeta
    does not exist at runtime
    */
    ce(this, "_type");
    this.payload = r, this.meta = e;
  }
}, Df = (r) => {
  if (typeof r == "object" && r !== null) {
    const e = {};
    for (const t of kf)
      typeof r[t] == "string" && (e[t] = r[t]);
    return e;
  }
  return {
    message: String(r)
  };
}, Os = "External signal was aborted", lr = /* @__PURE__ */ (() => {
  function r(e, t, n) {
    const o = rr(e + "/fulfilled", (l, i, u, h) => ({
      payload: l,
      meta: {
        ...h || {},
        arg: u,
        requestId: i,
        requestStatus: "fulfilled"
      }
    })), s = rr(e + "/pending", (l, i, u) => ({
      payload: void 0,
      meta: {
        ...u || {},
        arg: i,
        requestId: l,
        requestStatus: "pending"
      }
    })), c = rr(e + "/rejected", (l, i, u, h, d) => ({
      payload: h,
      error: (n && n.serializeError || Df)(l || "Rejected"),
      meta: {
        ...d || {},
        arg: u,
        requestId: i,
        rejectedWithValue: !!h,
        requestStatus: "rejected",
        aborted: (l == null ? void 0 : l.name) === "AbortError",
        condition: (l == null ? void 0 : l.name) === "ConditionError"
      }
    }));
    function a(l, {
      signal: i
    } = {}) {
      return (u, h, d) => {
        const f = n != null && n.idGenerator ? n.idGenerator(l) : Cf(), x = new AbortController();
        let w, v;
        function b(g) {
          v = g, x.abort();
        }
        i && (i.aborted ? b(Os) : i.addEventListener("abort", () => b(Os), {
          once: !0
        }));
        const p = async function() {
          var m, _;
          let g;
          try {
            let E = (m = n == null ? void 0 : n.condition) == null ? void 0 : m.call(n, l, {
              getState: h,
              extra: d
            });
            if (Ff(E) && (E = await E), E === !1 || x.signal.aborted)
              throw {
                name: "ConditionError",
                message: "Aborted due to condition callback returning false."
              };
            const C = new Promise((D, A) => {
              w = () => {
                A({
                  name: "AbortError",
                  message: v || "Aborted"
                });
              }, x.signal.addEventListener("abort", w);
            });
            u(s(f, l, (_ = n == null ? void 0 : n.getPendingMeta) == null ? void 0 : _.call(n, {
              requestId: f,
              arg: l
            }, {
              getState: h,
              extra: d
            }))), g = await Promise.race([C, Promise.resolve(t(l, {
              dispatch: u,
              getState: h,
              extra: d,
              requestId: f,
              signal: x.signal,
              abort: b,
              rejectWithValue: (D, A) => new E0(D, A),
              fulfillWithValue: (D, A) => new Rs(D, A)
            })).then((D) => {
              if (D instanceof E0)
                throw D;
              return D instanceof Rs ? o(D.payload, f, l, D.meta) : o(D, f, l);
            })]);
          } catch (E) {
            g = E instanceof E0 ? c(null, f, l, E.payload, E.meta) : c(E, f, l);
          } finally {
            w && x.signal.removeEventListener("abort", w);
          }
          return n && !n.dispatchConditionRejection && c.match(g) && g.meta.condition || u(g), g;
        }();
        return Object.assign(p, {
          abort: b,
          requestId: f,
          arg: l,
          unwrap() {
            return p.then(Sf);
          }
        });
      };
    }
    return Object.assign(a, {
      pending: s,
      rejected: c,
      fulfilled: o,
      settled: _f(c, o),
      typePrefix: e
    });
  }
  return r.withTypes = () => r, r;
})();
function Sf(r) {
  if (r.meta && r.meta.rejectedWithValue)
    throw r.payload;
  if (r.error)
    throw r.error;
  return r.payload;
}
function Ff(r) {
  return r !== null && typeof r == "object" && typeof r.then == "function";
}
var Tf = /* @__PURE__ */ Symbol.for("rtk-slice-createasyncthunk");
function Rf(r, e) {
  return `${r}/${e}`;
}
function Of({
  creators: r
} = {}) {
  var t;
  const e = (t = r == null ? void 0 : r.asyncThunk) == null ? void 0 : t[Tf];
  return function(o) {
    const {
      name: s,
      reducerPath: c = s
    } = o;
    if (!s)
      throw new Error(process.env.NODE_ENV === "production" ? ee(11) : "`name` is a required option for createSlice");
    typeof process < "u" && process.env.NODE_ENV === "development" && o.initialState === void 0 && console.error("You must provide an `initialState` value that is not `undefined`. You may have misspelled `initialState`");
    const a = (typeof o.reducers == "function" ? o.reducers(Nf()) : o.reducers) || {}, l = Object.keys(a), i = {
      sliceCaseReducersByName: {},
      sliceCaseReducersByType: {},
      actionCreators: {},
      sliceMatchers: []
    }, u = {
      addCase(y, m) {
        const _ = typeof y == "string" ? y : y.type;
        if (!_)
          throw new Error(process.env.NODE_ENV === "production" ? ee(12) : "`context.addCase` cannot be called with an empty action type");
        if (_ in i.sliceCaseReducersByType)
          throw new Error(process.env.NODE_ENV === "production" ? ee(13) : "`context.addCase` cannot be called with two reducers for the same action type: " + _);
        return i.sliceCaseReducersByType[_] = m, u;
      },
      addMatcher(y, m) {
        return i.sliceMatchers.push({
          matcher: y,
          reducer: m
        }), u;
      },
      exposeAction(y, m) {
        return i.actionCreators[y] = m, u;
      },
      exposeCaseReducer(y, m) {
        return i.sliceCaseReducersByName[y] = m, u;
      }
    };
    l.forEach((y) => {
      const m = a[y], _ = {
        reducerName: y,
        type: Rf(s, y),
        createNotation: typeof o.reducers == "function"
      };
      Pf(m) ? Mf(_, m, u, e) : Hf(_, m, u);
    });
    function h() {
      if (process.env.NODE_ENV !== "production" && typeof o.extraReducers == "object")
        throw new Error(process.env.NODE_ENV === "production" ? ee(14) : "The object notation for `createSlice.extraReducers` has been removed. Please use the 'builder callback' notation instead: https://redux-toolkit.js.org/api/createSlice");
      const [y = {}, m = [], _ = void 0] = typeof o.extraReducers == "function" ? ga(o.extraReducers) : [o.extraReducers], E = {
        ...y,
        ...i.sliceCaseReducersByType
      };
      return Ef(o.initialState, (C) => {
        for (let D in E)
          C.addCase(D, E[D]);
        for (let D of i.sliceMatchers)
          C.addMatcher(D.matcher, D.reducer);
        for (let D of m)
          C.addMatcher(D.matcher, D.reducer);
        _ && C.addDefaultCase(_);
      });
    }
    const d = (y) => y, f = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new WeakMap();
    let w;
    function v(y, m) {
      return w || (w = h()), w(y, m);
    }
    function b() {
      return w || (w = h()), w.getInitialState();
    }
    function p(y, m = !1) {
      function _(C) {
        let D = C[y];
        if (typeof D > "u") {
          if (m)
            D = Or(x, _, b);
          else if (process.env.NODE_ENV !== "production")
            throw new Error(process.env.NODE_ENV === "production" ? ee(15) : "selectSlice returned undefined for an uninjected slice reducer");
        }
        return D;
      }
      function E(C = d) {
        const D = Or(f, m, () => /* @__PURE__ */ new WeakMap());
        return Or(D, C, () => {
          const A = {};
          for (const [k, S] of Object.entries(o.selectors ?? {}))
            A[k] = If(S, C, () => Or(x, C, b), m);
          return A;
        });
      }
      return {
        reducerPath: y,
        getSelectors: E,
        get selectors() {
          return E(_);
        },
        selectSlice: _
      };
    }
    const g = {
      name: s,
      reducer: v,
      actions: i.actionCreators,
      caseReducers: i.sliceCaseReducersByName,
      getInitialState: b,
      ...p(c),
      injectInto(y, {
        reducerPath: m,
        ..._
      } = {}) {
        const E = m ?? c;
        return y.inject({
          reducerPath: E,
          reducer: v
        }, _), {
          ...g,
          ...p(E, !0)
        };
      }
    };
    return g;
  };
}
function If(r, e, t, n) {
  function o(s, ...c) {
    let a = e(s);
    if (typeof a > "u") {
      if (n)
        a = t();
      else if (process.env.NODE_ENV !== "production")
        throw new Error(process.env.NODE_ENV === "production" ? ee(16) : "selectState returned undefined for an uninjected slice reducer");
    }
    return r(a, ...c);
  }
  return o.unwrapped = r, o;
}
var pn = /* @__PURE__ */ Of();
function Nf() {
  function r(e, t) {
    return {
      _reducerDefinitionType: "asyncThunk",
      payloadCreator: e,
      ...t
    };
  }
  return r.withTypes = () => r, {
    reducer(e) {
      return Object.assign({
        // hack so the wrapping function has the same name as the original
        // we need to create a wrapper so the `reducerDefinitionType` is not assigned to the original
        [e.name](...t) {
          return e(...t);
        }
      }[e.name], {
        _reducerDefinitionType: "reducer"
        /* reducer */
      });
    },
    preparedReducer(e, t) {
      return {
        _reducerDefinitionType: "reducerWithPrepare",
        prepare: e,
        reducer: t
      };
    },
    asyncThunk: r
  };
}
function Hf({
  type: r,
  reducerName: e,
  createNotation: t
}, n, o) {
  let s, c;
  if ("reducer" in n) {
    if (t && !Uf(n))
      throw new Error(process.env.NODE_ENV === "production" ? ee(17) : "Please use the `create.preparedReducer` notation for prepared action creators with the `create` notation.");
    s = n.reducer, c = n.prepare;
  } else
    s = n;
  o.addCase(r, s).exposeCaseReducer(e, s).exposeAction(e, c ? rr(r, c) : rr(r));
}
function Pf(r) {
  return r._reducerDefinitionType === "asyncThunk";
}
function Uf(r) {
  return r._reducerDefinitionType === "reducerWithPrepare";
}
function Mf({
  type: r,
  reducerName: e
}, t, n, o) {
  if (!o)
    throw new Error(process.env.NODE_ENV === "production" ? ee(18) : "Cannot use `create.asyncThunk` in the built-in `createSlice`. Use `buildCreateSlice({ creators: { asyncThunk: asyncThunkCreator } })` to create a customised version of `createSlice`.");
  const {
    payloadCreator: s,
    fulfilled: c,
    pending: a,
    rejected: l,
    settled: i,
    options: u
  } = t, h = o(r, s, u);
  n.exposeAction(e, h), c && n.addCase(h.fulfilled, c), a && n.addCase(h.pending, a), l && n.addCase(h.rejected, l), i && n.addMatcher(h.settled, i), n.exposeCaseReducer(e, {
    fulfilled: c || Nr,
    pending: a || Nr,
    rejected: l || Nr,
    settled: i || Nr
  });
}
function Nr() {
}
function ee(r) {
  return `Minified Redux Toolkit error #${r}; visit https://redux-toolkit.js.org/Errors?code=${r} for the full message or use the non-minified dev environment for full errors. `;
}
const Is = {
  initialized: !1,
  locked: !0,
  hasWallet: !1,
  network: "mainnet",
  error: null,
  highestAccountIndex: -1
}, ya = pn({
  name: "wallet",
  initialState: Is,
  reducers: {
    setInitialized: (r, e) => {
      r.initialized = e.payload;
    },
    setLocked: (r, e) => {
      r.locked = e.payload;
    },
    setHasWallet: (r, e) => {
      r.hasWallet = e.payload;
    },
    setNetwork: (r, e) => {
      r.network = e.payload;
    },
    setError: (r, e) => {
      r.error = e.payload;
    },
    reset: () => Is,
    incrementHighestIndex: (r) => {
      r.highestAccountIndex += 1;
    },
    setHighestIndex: (r, e) => {
      r.highestAccountIndex = e.payload;
    }
  }
}), {
  setInitialized: gn,
  setLocked: fr,
  setHasWallet: dr,
  setNetwork: Xh,
  setError: _e,
  reset: Jh,
  incrementHighestIndex: Qh,
  setHighestIndex: yn
} = ya.actions, Lf = ya.reducer, Wf = {
  blockHeight: 0,
  isConnected: !1,
  error: null
}, va = pn({
  name: "network",
  initialState: Wf,
  reducers: {
    setBlockHeight: (r, e) => {
      r.blockHeight = e.payload;
    },
    setNetworkStatus: (r, e) => {
      r.isConnected = e.payload.isConnected, r.error = e.payload.error || null;
    }
  }
}), { setBlockHeight: zf, setNetworkStatus: ex } = va.actions, jf = va.reducer, Kf = {
  isLoading: !1,
  error: null,
  pendingTransactions: []
}, wa = pn({
  name: "transaction",
  initialState: Kf,
  reducers: {
    setLoading: (r, e) => {
      r.isLoading = e.payload;
    },
    setError: (r, e) => {
      r.error = e.payload;
    },
    addPendingTransaction: (r, e) => {
      r.pendingTransactions.push(e.payload);
    },
    removePendingTransaction: (r, e) => {
      r.pendingTransactions = r.pendingTransactions.filter(
        (t) => t !== e.payload
      );
    }
  }
}), {
  setLoading: Ns,
  setError: Hs,
  addPendingTransaction: $f,
  removePendingTransaction: Vf
} = wa.actions, qf = wa.reducer, Ps = {
  accounts: {},
  selectedAccount: null,
  loading: !1,
  error: null
}, ba = pn({
  name: "accounts",
  initialState: Ps,
  reducers: {
    addAccount: (r, e) => {
      r.accounts[e.payload.id] = e.payload.account;
    },
    updateAccount: (r, e) => {
      r.accounts[e.payload.id] && (r.accounts[e.payload.id] = {
        ...r.accounts[e.payload.id],
        ...e.payload.updates
      });
    },
    removeAccount: (r, e) => {
      delete r.accounts[e.payload], r.selectedAccount === e.payload && (r.selectedAccount = null);
    },
    setSelectedAccount: (r, e) => {
      r.selectedAccount = e.payload;
    },
    setLoading: (r, e) => {
      r.loading = e.payload;
    },
    setError: (r, e) => {
      r.error = e.payload;
    },
    reset: () => Ps,
    renameAccount: (r, e) => {
      r.accounts[e.payload.id] && (r.accounts[e.payload.id].name = e.payload.name);
    },
    reorderAccounts: (r, e) => {
      Object.entries(e.payload).forEach(([t, n]) => {
        r.accounts[t] && (r.accounts[t].order = n);
      });
    },
    moveAccount: (r, e) => {
      const { id: t, direction: n } = e.payload, o = Object.entries(r.accounts).sort(([, a], [, l]) => (a.order ?? 0) - (l.order ?? 0)), s = o.findIndex(([a]) => a === t);
      if (s === -1) return;
      const c = n === "up" ? Math.max(0, s - 1) : Math.min(o.length - 1, s + 1);
      if (s !== c) {
        const a = o[s][1].order ?? 0, l = o[c][1].order ?? 0;
        r.accounts[t].order = l, r.accounts[o[c][0]].order = a;
      }
    },
    bulkAddAccounts: (r, e) => {
      r.accounts = {
        ...r.accounts,
        ...e.payload
      };
    }
  }
}), {
  addAccount: Gf,
  updateAccount: ma,
  removeAccount: tx,
  setSelectedAccount: co,
  setLoading: rx,
  setError: nx,
  renameAccount: ox,
  reorderAccounts: Yf,
  moveAccount: sx,
  reset: ix,
  bulkAddAccounts: uo
} = ba.actions, Zf = ba.reducer, Xf = bf({
  reducer: {
    wallet: Lf,
    network: jf,
    transaction: qf,
    accounts: Zf
  },
  middleware: (r) => r({
    serializableCheck: !1,
    thunk: !0
  })
}), lo = "AES-CBC", Jf = 256, Qf = 16, ed = 16, td = process.env.NODE_ENV === "test" ? 10 : 1e5;
async function Ea(r, e) {
  const t = new TextEncoder(), n = await crypto.subtle.importKey(
    "raw",
    t.encode(r),
    "PBKDF2",
    !1,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: e,
      iterations: td,
      hash: "SHA-256"
    },
    n,
    {
      name: lo,
      length: Jf
    },
    !1,
    ["encrypt", "decrypt"]
  );
}
async function rd(r, e) {
  const t = crypto.getRandomValues(new Uint8Array(Qf)), n = crypto.getRandomValues(new Uint8Array(ed)), o = r.length > 0 ? Buffer.from(r).toString("base64") : "", s = new TextEncoder().encode(o), c = await Ea(e, t), a = await crypto.subtle.encrypt(
    {
      name: lo,
      iv: n
    },
    c,
    s
  );
  return {
    data: btoa(String.fromCharCode(...new Uint8Array(a))),
    iv: btoa(String.fromCharCode(...n)),
    salt: btoa(String.fromCharCode(...t))
  };
}
async function nd(r, e) {
  try {
    const t = Uint8Array.from(atob(r.data), (l) => l.charCodeAt(0)), n = Uint8Array.from(atob(r.iv), (l) => l.charCodeAt(0)), o = Uint8Array.from(atob(r.salt), (l) => l.charCodeAt(0)), s = await Ea(e, o), c = await crypto.subtle.decrypt(
      {
        name: lo,
        iv: n
      },
      s,
      t
    ), a = new TextDecoder().decode(c);
    return new Uint8Array(Buffer.from(a, "base64"));
  } catch {
    throw new Error("Failed to decrypt - invalid password");
  }
}
function ax(r = 32) {
  return crypto.getRandomValues(new Uint8Array(r));
}
async function cx(r, e) {
  const n = new TextEncoder().encode(e.toString()), o = await crypto.subtle.importKey(
    "raw",
    r,
    {
      name: "HMAC",
      hash: "SHA-256"
    },
    !1,
    ["sign"]
  ), s = await crypto.subtle.sign(
    "HMAC",
    o,
    n
  );
  return new Uint8Array(s);
}
const fo = async (r, e) => {
  const t = Buffer.from(JSON.stringify(r), "utf-8"), n = await rd(t, Buffer.from(e).toString("hex"));
  return {
    tag: r.tag,
    encryptedData: n
  };
}, ir = async (r, e) => {
  const t = await nd(r.encryptedData, Buffer.from(e).toString("hex")), n = Buffer.from(t).toString("utf-8");
  return JSON.parse(n);
};
class od {
  constructor(e = "mochimo_wallet_") {
    ce(this, "prefix");
    this.prefix = e;
  }
  getKey(e) {
    return `${this.prefix}${e}`;
  }
  async saveMasterSeed(e) {
    localStorage.setItem(
      this.getKey("masterSeed"),
      JSON.stringify(e)
    );
  }
  async loadMasterSeed() {
    const e = localStorage.getItem(this.getKey("masterSeed"));
    return e ? JSON.parse(e) : null;
  }
  async saveAccount(e, t) {
    const n = localStorage.getItem(this.getKey("accounts")), o = n ? JSON.parse(n) : {};
    o[e.tag] = await fo(e, t), localStorage.setItem(
      this.getKey("accounts"),
      JSON.stringify(o)
    );
  }
  async loadAccount(e, t) {
    const n = localStorage.getItem(this.getKey("accounts")), s = (n ? JSON.parse(n) : {})[e];
    return s ? ir(s, t) : null;
  }
  async loadAccounts(e) {
    const t = localStorage.getItem(this.getKey("accounts")), n = t ? JSON.parse(t) : {};
    return Promise.all(
      Object.values(n).map(
        (o) => ir(o, e)
      )
    );
  }
  async deleteAccount(e) {
    const t = localStorage.getItem(this.getKey("accounts")), n = t ? JSON.parse(t) : {};
    delete n[e], localStorage.setItem(
      this.getKey("accounts"),
      JSON.stringify(n)
    );
  }
  async saveActiveAccount(e) {
    localStorage.setItem(
      this.getKey("activeAccount"),
      JSON.stringify(e)
    );
  }
  async loadActiveAccount() {
    const e = localStorage.getItem(this.getKey("activeAccount"));
    return e ? JSON.parse(e) : null;
  }
  async saveHighestIndex(e) {
    localStorage.setItem(
      this.getKey("highestIndex"),
      JSON.stringify(e)
    );
  }
  async loadHighestIndex() {
    const e = localStorage.getItem(this.getKey("highestIndex"));
    return e ? JSON.parse(e) : -1;
  }
  async clear() {
    Object.keys(localStorage).filter(
      (t) => t.startsWith(this.prefix)
    ).forEach((t) => localStorage.removeItem(t));
  }
}
class sd {
  constructor(e = "mochimo_wallet_") {
    ce(this, "storage");
    ce(this, "prefix");
    this.storage = id(), this.prefix = e;
  }
  getKey(e) {
    return this.prefix ? `${this.prefix}_${e}` : e;
  }
  async saveMasterSeed(e) {
    await this.storage.set({
      [this.getKey("masterSeed")]: e
    });
  }
  async loadMasterSeed() {
    return (await this.storage.get(this.getKey("masterSeed")))[this.getKey("masterSeed")] || null;
  }
  async saveAccount(e, t) {
    const o = (await this.storage.get(this.getKey("accounts")))[this.getKey("accounts")] || {};
    o[e.tag] = await fo(e, t), await this.storage.set({
      [this.getKey("accounts")]: o
    });
  }
  async loadAccount(e, t) {
    const s = ((await this.storage.get(this.getKey("accounts")))[this.getKey("accounts")] || {})[e];
    return s ? ir(s, t) : null;
  }
  async loadAccounts(e) {
    const n = (await this.storage.get(this.getKey("accounts")))[this.getKey("accounts")] || {};
    return Promise.all(
      Object.values(n).map(
        (o) => ir(o, e)
      )
    );
  }
  async deleteAccount(e) {
    const n = (await this.storage.get(this.getKey("accounts")))[this.getKey("accounts")] || {};
    delete n[e], await this.storage.set({
      [this.getKey("accounts")]: n
    });
  }
  async saveActiveAccount(e) {
    await this.storage.set({
      [this.getKey("activeAccount")]: e
    });
  }
  async loadActiveAccount() {
    return (await this.storage.get(this.getKey("activeAccount")))[this.getKey("activeAccount")] || null;
  }
  async saveHighestIndex(e) {
    await this.storage.set({
      [this.getKey("highestIndex")]: e
    });
  }
  async loadHighestIndex() {
    let t = (await this.storage.get(this.getKey("highestIndex")))[this.getKey("highestIndex")];
    return t ?? -1;
  }
  async clear() {
    const e = await this.storage.get(), t = Object.keys(e).filter((n) => n.startsWith(this.prefix));
    t.length > 0 && await this.storage.remove(t);
  }
}
function id() {
  if (typeof browser < "u" && browser.storage)
    return browser.storage.local;
  if (typeof chrome < "u" && chrome.storage)
    return chrome.storage.local;
  throw new Error("No extension storage API available");
}
class ad {
  /**
   * Creates appropriate storage implementation based on environment
   */
  static create(e = "mochimo_wallet_") {
    if (typeof browser < "u" || typeof chrome < "u")
      try {
        return new sd(e);
      } catch {
        console.warn("Extension storage not available, falling back to local storage");
      }
    return new od(e);
  }
}
let Us = ad.create();
const we = {
  setStorage: (r) => {
    Us = r;
  },
  getStorage: () => Us
}, an = class an {
  constructor() {
    ce(this, "masterSeed", null);
    ce(this, "storageKey", null);
  }
  static getInstance() {
    return this.instance || (this.instance = new an()), this.instance;
  }
  async unlock(e, t) {
    try {
      const n = await t.loadMasterSeed();
      if (!n) throw new Error("No master seed found");
      const o = await pe.deriveKey(n, e);
      this.masterSeed = await pe.importFromDerivedKey(n, o);
      const s = this.masterSeed.deriveStorageKey();
      return this.storageKey = s, { jwk: await crypto.subtle.exportKey("jwk", o), storageKey: s };
    } catch (n) {
      throw console.error("Error unlocking wallet", n), new Error("Invalid password");
    }
  }
  async unlockWithSeed(e) {
    try {
      this.masterSeed = new pe(Buffer.from(e, "hex")), this.storageKey = this.masterSeed.deriveStorageKey();
    } catch {
      throw new Error("Invalid seed");
    }
  }
  async unlockWithMnemonic(e) {
    try {
      this.masterSeed = await pe.fromPhrase(e), this.storageKey = this.masterSeed.deriveStorageKey();
    } catch {
      throw new Error("Invalid mnemonic");
    }
  }
  async unlockWithDerivedKey(e, t) {
    try {
      const n = await t.loadMasterSeed();
      if (!n) throw new Error("No master seed found");
      this.masterSeed = await pe.importFromDerivedKeyJWK(n, e), this.storageKey = this.masterSeed.deriveStorageKey();
    } catch {
      throw new Error("Invalid derived key");
    }
  }
  getMasterSeed() {
    if (!this.masterSeed) throw new Error("Wallet is locked");
    return this.masterSeed;
  }
  getStorageKey() {
    if (!this.storageKey) throw new Error("Wallet is locked");
    return this.storageKey;
  }
  lock() {
    this.masterSeed && (this.masterSeed.lock(), this.masterSeed = null), this.storageKey && (this.storageKey.fill(0), this.storageKey = null);
  }
  setMasterSeed(e) {
    this.masterSeed = e, this.storageKey = e.deriveStorageKey();
  }
};
ce(an, "instance");
let ge = an;
const ho = (r, e) => async (t) => {
  try {
    const n = we.getStorage(), o = await n.loadAccount(r, ge.getInstance().getStorageKey());
    if (!o) throw new Error("Account not found");
    const s = { ...o, ...e };
    await n.saveAccount(s, ge.getInstance().getStorageKey()), t(ma({ id: r, updates: e }));
  } catch (n) {
    throw t(_e("Failed to update account")), n;
  }
}, cd = (r, e) => async (t) => t(ho(r, { name: e })), ud = lr(
  "accounts/delete",
  async (r, { dispatch: e, getState: t }) => {
    try {
      const n = t();
      if (!n.accounts.accounts[r])
        throw new Error("Account not found");
      if (Object.keys(n.accounts.accounts).length <= 1)
        throw new Error("Cannot delete last account");
      const c = we.getStorage();
      await e(ho(r, { isDeleted: !0 })), n.accounts.selectedAccount === r && await c.saveActiveAccount(""), r === n.accounts.selectedAccount && e(co(null));
    } catch (n) {
      throw e(_e("Failed to delete account")), n;
    }
  }
), ld = (r) => async (e, t) => {
  try {
    const o = t().accounts.accounts, s = new Set(Object.keys(o).filter((u) => !o[u].isDeleted)), c = new Set(Object.keys(r));
    if (s.size !== c.size || ![...s].every((u) => c.has(u)))
      throw new Error("New order must include all accounts");
    const a = Object.values(r);
    if (new Set(a).size !== a.length)
      throw new Error("Order numbers must be unique");
    const i = we.getStorage();
    await Promise.all(
      Object.entries(r).map(
        ([u, h]) => i.saveAccount({ ...o[u], order: h }, ge.getInstance().getStorageKey())
      )
    ), e(Yf(r));
  } catch (n) {
    throw e(_e("Failed to reorder accounts")), n;
  }
}, fd = lr(
  "wallet/create",
  async ({ password: r, mnemonic: e }, { dispatch: t, rejectWithValue: n }) => {
    try {
      let o, s;
      e ? o = await pe.fromPhrase(e) : (o = await pe.create(), s = await o.toPhrase());
      const c = we.getStorage(), a = await o.export(r);
      return await c.saveMasterSeed(a), t(dr(!0)), t(gn(!0)), t(fr(!0)), { mnemonic: s };
    } catch (o) {
      return console.error("Failed to create wallet:", o), t(_e("Failed to create wallet")), n("Failed to create wallet");
    }
  }
), dd = (r, e = "password") => async (t) => {
  try {
    let n = null, o = null;
    const s = we.getStorage();
    if (e === "seed")
      await ge.getInstance().unlockWithSeed(r);
    else if (e === "jwk") {
      const h = JSON.parse(r);
      await ge.getInstance().unlockWithDerivedKey(h, s);
    } else if (e === "mnemonic")
      await ge.getInstance().unlockWithMnemonic(r);
    else {
      const h = await ge.getInstance().unlock(r, s);
      n = h.jwk, o = h.storageKey;
    }
    const c = ge.getInstance().getStorageKey(), [a, l, i] = await Promise.all([
      s.loadAccounts(c),
      s.loadHighestIndex(),
      s.loadActiveAccount()
    ]), u = a.reduce((h, d) => (d.tag && (h[d.tag] = d), h), {});
    return t(uo(u)), t(yn(l)), t(co(i)), t(fr(!1)), t(dr(!0)), t(gn(!0)), { jwk: n, storageKey: c };
  } catch (n) {
    throw t(_e("Invalid password")), n;
  }
}, hd = (r) => async (e, t) => {
  try {
    const n = we.getStorage(), o = ge.getInstance(), s = o.getMasterSeed(), c = t(), a = c.wallet.highestAccountIndex + 1, l = s.deriveAccount(a), i = {
      name: r || "Account " + (a + 1),
      type: "standard",
      faddress: Buffer.from(l.address).toString("hex"),
      balance: "0",
      index: a,
      tag: l.tag,
      source: "mnemonic",
      wotsIndex: -1,
      //first wots address is created using account seed
      seed: Buffer.from(l.seed).toString("hex"),
      order: Object.keys(c.accounts.accounts).length
      // Use index as initial order
    }, u = o.getStorageKey();
    return await Promise.all([
      n.saveAccount(i, u),
      n.saveHighestIndex(a)
    ]), e(Gf({ id: i.tag, account: i })), e(yn(a)), i;
  } catch (n) {
    throw e(_e("Failed to create account")), n;
  }
}, xd = (r) => async (e, t) => {
  try {
    const n = t();
    if (!n.wallet.initialized || !n.wallet.hasWallet)
      throw new Error("Wallet not initialized");
    const o = ge.getInstance(), s = await o.getMasterSeed();
    if (!s)
      throw new Error("Wallet is locked");
    const c = o.getStorageKey(), a = await we.getStorage().loadAccounts(c), l = {};
    for (const i of a)
      l[i.tag] = await fo(i, c);
    return console.log("encryptedAccounts", l), {
      version: "1.0.0",
      timestamp: Date.now(),
      encrypted: await s.export(r),
      accounts: l
    };
  } catch (n) {
    throw e(_e("Failed to export wallet")), n;
  }
}, pd = (r, e) => async (t) => {
  try {
    const n = we.getStorage(), o = ge.getInstance(), s = r.encrypted;
    if (!s)
      throw new Error("Invalid wallet JSON");
    if (!await pe.import(s, e))
      throw new Error("Invalid password");
    await n.clear(), await n.saveMasterSeed(r.encrypted), await o.unlock(e, n);
    let a = -1;
    const l = o.getStorageKey(), u = (await Promise.all(
      Object.values(r.accounts).map(async (h) => await ir(h, l))
    )).reduce((h, d) => (h[d.tag] = d, h), {});
    for (let h of Object.values(u))
      await n.saveAccount(h, l), h.index !== void 0 && h.index > a && (a = h.index);
    await n.saveHighestIndex(a), t(uo(u)), t(yn(a)), t(dr(!0)), t(fr(!1)), t(gn(!0));
  } catch (n) {
    throw t(_e("Failed to load wallet from JSON")), n;
  }
}, gd = () => async (r) => {
  try {
    await ge.getInstance().lock(), r(fr(!0));
  } catch {
    r(_e("Failed to lock wallet"));
  }
}, yd = (r) => async (e, t) => {
  try {
    const n = we.getStorage(), s = t().accounts.accounts;
    r && s[r] && (e(co(r)), await n.saveActiveAccount(r));
  } catch (n) {
    throw e(_e("Failed to set active account")), n;
  }
}, vd = lr(
  "wallet/importFromMcm",
  async ({ mcmData: r, password: e, accountFilter: t }, { dispatch: n }) => {
    try {
      n(_e(null));
      const o = we.getStorage();
      await o.clear();
      const { entries: s, privateHeader: c } = r, a = c["deterministic seed hex"], l = new pe(Buffer.from(a, "hex")), i = await l.export(e);
      await o.saveMasterSeed(i), n(dr(!0)), n(gn(!0)), n(fr(!1)), ge.getInstance().setMasterSeed(l);
      const h = await n(K0({
        mcmData: r,
        accountFilter: t,
        source: "mnemonic"
      })).unwrap();
      return {
        entries: s,
        totalEntries: s.length,
        importedCount: h.importedCount
      };
    } catch (o) {
      throw console.error("Import error:", o), n(_e(o instanceof Error ? o.message : "Unknown error")), o;
    }
  }
), K0 = lr(
  "wallet/importAccounts",
  async ({ mcmData: r, accountFilter: e, source: t }, { dispatch: n, getState: o }) => {
    try {
      n(_e(null));
      const s = o();
      if (!s.wallet.hasWallet || s.wallet.locked)
        throw new Error("Wallet must be unlocked to import accounts");
      const { entries: c } = r;
      let a = c;
      if (e && (a = c.filter((f, x) => !!e(x, Buffer.from(f.secret, "hex"), f.name))), a.length === 0)
        throw new Error("No accounts matched the filter criteria");
      const l = we.getStorage(), u = ge.getInstance().getStorageKey(), h = s.wallet.highestAccountIndex, d = a.map((f, x) => {
        const w = new Uint8Array(Buffer.from(f.address, "hex").subarray(0, 2144)), v = vt.addrFromWots(w), b = Buffer.from(v == null ? void 0 : v.subarray(0, 20)).toString("hex");
        return {
          name: f.name || `Imported Account ${x + 1}`,
          type: t === "mnemonic" ? "standard" : "imported",
          faddress: f.address,
          balance: "0",
          index: t === "mnemonic" ? h + 1 + x : void 0,
          // Continue from current highest
          tag: b,
          source: t,
          wotsIndex: -1,
          seed: f.secret,
          order: Object.keys(s.accounts.accounts).length + x
          // Add to end
        };
      });
      for (let f of d)
        await l.saveAccount(f, u);
      return await l.saveHighestIndex(h + d.length), n(yn(h + d.length)), n(uo(
        d.reduce((f, x) => (f[x.tag] = x, f), {})
      )), {
        importedAccounts: d,
        totalAvailable: c.length,
        importedCount: d.length
      };
    } catch (s) {
      throw console.error("Import accounts error:", s), n(_e(s instanceof Error ? s.message : "Unknown error")), s;
    }
  }
), wd = (r) => r.accounts.accounts, xo = (r) => {
  const e = r.accounts.selectedAccount;
  return e ? r.accounts.accounts[e] : null;
};
Ct(
  wd,
  (r) => Object.values(r).filter((e) => !e.isDeleted).sort((e, t) => (e.order ?? 0) - (t.order ?? 0))
);
const Aa = Ct(
  [xo],
  (r) => {
    if (!r) return null;
    if (r.wotsIndex === -1)
      return {
        address: r.faddress,
        secret: r.seed,
        wotsWallet: wt.create("test", Buffer.from(r.seed, "hex"), void 0, (o) => {
          const s = Buffer.from(r.faddress, "hex");
          for (let c = 0; c < s.length; c++)
            o[c] = s[c];
        })
      };
    const { address: e, secret: t, wotsWallet: n } = gt.deriveWotsSeedAndAddress(
      Buffer.from(r.seed, "hex"),
      r.wotsIndex,
      r.tag
    );
    return { address: Buffer.from(e).toString("hex"), secret: Buffer.from(t).toString("hex"), wotsWallet: n };
  }
), _a = Ct(
  [xo],
  (r) => {
    if (!r) return null;
    if (!r.seed)
      throw new Error("Account has no seed");
    const { address: e, secret: t, wotsWallet: n } = gt.deriveWotsSeedAndAddress(
      Buffer.from(r.seed, "hex"),
      r.wotsIndex + 1,
      // Next index
      r.tag
    );
    return {
      address: Buffer.from(e).toString("hex"),
      secret: Buffer.from(t).toString("hex"),
      wotsWallet: n
    };
  }
), bd = () => {
  const r = Xi(), e = Ht((f) => f.accounts.accounts), t = Ht((f) => f.accounts.selectedAccount), n = Ht(Aa), o = Ht(_a), s = vo(() => Object.values(e).filter((f) => !f.isDeleted).sort((f, x) => (f.order ?? 0) - (x.order ?? 0)), [e]), c = vo(() => Object.values(e).filter((f) => f.isDeleted), [e]), a = se(async (f) => await r(hd(f)), [r]), l = se(async (f, x) => await r(cd(f, x)), [r]), i = se(async (f) => await r(ud(f)), [r]), u = se(async (f) => await r(ld(f)), [r]), h = se(async (f) => await r(yd(f)), [r]), d = se(async (f, x) => await r(ho(f, x)), [r]);
  return {
    accounts: s,
    deletedAccounts: c,
    selectedAccount: t,
    createAccount: a,
    renameAccount: l,
    deleteAccount: i,
    reorderAccounts: u,
    setSelectedAccount: h,
    updateAccount: d,
    currentWOTSKeyPair: n,
    nextWOTSKeyPair: o
  };
};
let Ms = new Qu("https://api.mochimo.org");
const nn = {
  setNetwork: (r) => {
    Ms = r;
  },
  getNetwork: () => Ms
}, po = () => Xi(), Ut = Ht, md = (r = 1e4) => {
  const { accounts: e } = bd(), t = po(), n = Dn(), [o, s] = Lr(0), [c, a] = Lr({}), [l, i] = Lr(0), u = Dn(!1), h = Dn(c);
  T0(() => {
    h.current = c;
  }, [c]);
  const d = async (x) => {
    const w = h.current[x] || {}, v = await Promise.all(e.map(async (b) => {
      if (!(b != null && b.tag) || w[b.tag])
        return null;
      try {
        const p = await nn.getNetwork().getBalance("0x" + b.tag);
        if (!/^\d+$/.test(p))
          throw new Error("Invalid balance format received");
        return { tag: b.tag, balance: p };
      } catch (p) {
        return console.error(`Balance fetch error for account ${b.tag}:`, p), null;
      }
    }).filter(Boolean));
    v.length > 0 && a((b) => {
      const p = { ...b };
      return p[x] = { ...w }, v.forEach((g) => {
        g && (p[x][g.tag] = g.balance, t(ma({
          id: g.tag,
          updates: { balance: g.balance }
        })));
      }), p;
    });
  }, f = se(async () => {
    if (!e.length || u.current) {
      n.current = setTimeout(f, r);
      return;
    }
    try {
      u.current = !0;
      const x = await nn.getNetwork().getNetworkStatus();
      if (!(x != null && x.height) || typeof x.height != "number")
        throw new Error("Invalid network status response");
      const w = x.height;
      if (w < 0)
        throw new Error("Invalid block height received");
      t(zf(w)), (w > o || e.some((b) => {
        var p;
        return !((p = h.current[w]) != null && p[b.tag]);
      })) && (await d(w), s(w)), i(0);
    } catch (x) {
      console.error("Balance polling error:", x), i((w) => w + 1);
    } finally {
      u.current = !1, n.current = setTimeout(f, r);
    }
  }, [e, r, o]);
  T0(() => (f(), () => {
    n.current && (clearTimeout(n.current), n.current = void 0);
  }), [f]);
}, Ed = ({ children: r }) => (md(), /* @__PURE__ */ Jr.jsx(Jr.Fragment, { children: r })), ux = ({ children: r }) => /* @__PURE__ */ Jr.jsx(bl, { store: Xf, children: /* @__PURE__ */ Jr.jsx(Ed, { children: r }) }), go = (r) => r.wallet, Ad = Ct(
  go,
  (r) => ({
    isLocked: r.locked,
    hasWallet: r.hasWallet,
    isInitialized: r.initialized
  })
), _d = Ct(
  go,
  (r) => r.error
), Bd = Ct(
  go,
  (r) => r.network
), lx = () => {
  const r = po(), { isLocked: e, hasWallet: t, isInitialized: n } = Ut(Ad), o = Ut(_d), s = Ut(Bd), c = se(async (p, g) => r(fd({ password: p, mnemonic: g })), [r]), a = se(async (p, g = "password") => r(dd(p, g)), [r]), l = se(async (p) => {
    const g = await we.getStorage().loadMasterSeed();
    if (!g) return !1;
    try {
      return await pe.import(g, p), !0;
    } catch {
      return !1;
    }
  }, [r]), i = se(async (p) => {
    const g = await we.getStorage().loadMasterSeed();
    if (!g) return !1;
    try {
      return (await pe.import(g, p)).toPhrase();
    } catch {
      throw new Error("Invalid password for mnemonic export");
    }
  }, [r]), u = se(() => {
    if (!t)
      throw new Error("No wallet exists");
    r(gd());
  }, [r, t]), h = se(async () => !!await we.getStorage().loadMasterSeed(), [r]), d = se(async (p, g, y) => r(vd({ mcmData: p, password: g, accountFilter: y })), [r]), f = se(async (p, g) => r(K0({ mcmData: p, accountFilter: g, source: "mcm" })), [r]), x = se(async (p, g, y) => r(K0({ mcmData: g, accountFilter: y, source: p })), [r]), w = se((p) => {
    r(dr(p));
  }, [r]), v = se(async (p) => r(xd(p)), [r]), b = se(async (p, g) => r(pd(p, g)), [r]);
  return {
    isLocked: e,
    hasWallet: t,
    isInitialized: n,
    error: o,
    network: s,
    createWallet: c,
    unlockWallet: a,
    lockWallet: u,
    checkWallet: h,
    importFromMcmFile: d,
    importAccountsFromMcm: f,
    setHasWalletStatus: w,
    importWalletJSON: b,
    exportWalletJSON: v,
    verifyWalletOwnership: l,
    getMnemonic: i,
    importAccountsFrom: x
  };
}, fx = () => {
  const r = Ht((e) => e.network);
  return {
    blockHeight: r.blockHeight,
    isConnected: r.isConnected,
    error: r.error
  };
}, Cd = lr(
  "transaction/send",
  async (r, { getState: e, dispatch: t }) => {
    var a;
    const n = e(), o = xo(n), s = Aa(n), c = _a(n);
    if (!o || !s || !c)
      throw new Error("No account selected");
    t(Ns(!0)), t(Hs(null));
    try {
      const l = await nn.getNetwork().resolveTag(o.tag), i = BigInt(l.balanceConsensus);
      if (r.memo && !nl(r.memo))
        throw new Error("Invalid memo");
      const { amount: u } = r, h = await kd(
        s.wotsWallet,
        c.wotsWallet,
        Buffer.from(r.to, "hex"),
        u,
        i,
        { memo: r.memo }
      );
      if ((a = h == null ? void 0 : h.tx) != null && a.hash)
        return t($f(h.tx.hash)), h.tx.hash;
      throw new Error("Failed to create transaction");
    } catch (l) {
      console.error("Transaction error:", l);
      const i = l instanceof Error ? l.message : "Unknown error";
      throw t(Hs(i)), new Error(i);
    } finally {
      t(Ns(!1));
    }
  }
);
async function kd(r, e, t, n, o = BigInt(0), s = {}) {
  var i;
  if (!r || !t || !e)
    throw new Error("No current or next WOTS key pair");
  const c = s.fee || BigInt(500);
  return { tx: (i = (await new rl(nn.getNetwork().apiUrl).buildAndSignTransaction(
    r,
    e,
    "0x" + Buffer.from(t).toString("hex"),
    n,
    c,
    s.memo || ""
  )).submitResult) == null ? void 0 : i.transaction_identifier };
}
const dx = () => {
  const r = po(), e = Ut((c) => c.transaction.isLoading), t = Ut((c) => c.transaction.error), n = Ut((c) => c.transaction.pendingTransactions), o = se(async (c, a, l) => r(Cd({ to: c, amount: a, memo: l })).unwrap(), [r]), s = se((c) => {
    r(Vf(c));
  }, [r]);
  return {
    isLoading: e,
    error: t,
    pendingTransactions: n,
    sendTransaction: o,
    removePending: s
  };
}, hx = () => {
  const [r, e] = Lr(!1);
  return T0(() => {
    (async () => {
      const n = await we.getStorage().loadMasterSeed();
      e(!!n);
    })();
  }, []), {
    hasWallet: r
  };
};
function zt(r) {
  let e = r.length;
  for (; --e >= 0; )
    r[e] = 0;
}
const Dd = 3, Sd = 258, Ba = 29, Fd = 256, Td = Fd + 1 + Ba, Ca = 30, Rd = 512, Od = new Array((Td + 2) * 2);
zt(Od);
const Id = new Array(Ca * 2);
zt(Id);
const Nd = new Array(Rd);
zt(Nd);
const Hd = new Array(Sd - Dd + 1);
zt(Hd);
const Pd = new Array(Ba);
zt(Pd);
const Ud = new Array(Ca);
zt(Ud);
const Md = (r, e, t, n) => {
  let o = r & 65535 | 0, s = r >>> 16 & 65535 | 0, c = 0;
  for (; t !== 0; ) {
    c = t > 2e3 ? 2e3 : t, t -= c;
    do
      o = o + e[n++] | 0, s = s + o | 0;
    while (--c);
    o %= 65521, s %= 65521;
  }
  return o | s << 16 | 0;
};
var $0 = Md;
const Ld = () => {
  let r, e = [];
  for (var t = 0; t < 256; t++) {
    r = t;
    for (var n = 0; n < 8; n++)
      r = r & 1 ? 3988292384 ^ r >>> 1 : r >>> 1;
    e[t] = r;
  }
  return e;
}, Wd = new Uint32Array(Ld()), zd = (r, e, t, n) => {
  const o = Wd, s = n + t;
  r ^= -1;
  for (let c = n; c < s; c++)
    r = r >>> 8 ^ o[(r ^ e[c]) & 255];
  return r ^ -1;
};
var Me = zd, V0 = {
  2: "need dictionary",
  /* Z_NEED_DICT       2  */
  1: "stream end",
  /* Z_STREAM_END      1  */
  0: "",
  /* Z_OK              0  */
  "-1": "file error",
  /* Z_ERRNO         (-1) */
  "-2": "stream error",
  /* Z_STREAM_ERROR  (-2) */
  "-3": "data error",
  /* Z_DATA_ERROR    (-3) */
  "-4": "insufficient memory",
  /* Z_MEM_ERROR     (-4) */
  "-5": "buffer error",
  /* Z_BUF_ERROR     (-5) */
  "-6": "incompatible version"
  /* Z_VERSION_ERROR (-6) */
}, ka = {
  /* Allowed flush values; see deflate() and inflate() below for details */
  Z_NO_FLUSH: 0,
  Z_FINISH: 4,
  Z_BLOCK: 5,
  Z_TREES: 6,
  /* Return codes for the compression/decompression functions. Negative values
  * are errors, positive values are used for special but normal events.
  */
  Z_OK: 0,
  Z_STREAM_END: 1,
  Z_NEED_DICT: 2,
  Z_STREAM_ERROR: -2,
  Z_DATA_ERROR: -3,
  Z_MEM_ERROR: -4,
  Z_BUF_ERROR: -5,
  /* The deflate compression method */
  Z_DEFLATED: 8
  //Z_NULL:                 null // Use -1 or null inline, depending on var type
};
const jd = (r, e) => Object.prototype.hasOwnProperty.call(r, e);
var Kd = function(r) {
  const e = Array.prototype.slice.call(arguments, 1);
  for (; e.length; ) {
    const t = e.shift();
    if (t) {
      if (typeof t != "object")
        throw new TypeError(t + "must be non-object");
      for (const n in t)
        jd(t, n) && (r[n] = t[n]);
    }
  }
  return r;
}, $d = (r) => {
  let e = 0;
  for (let n = 0, o = r.length; n < o; n++)
    e += r[n].length;
  const t = new Uint8Array(e);
  for (let n = 0, o = 0, s = r.length; n < s; n++) {
    let c = r[n];
    t.set(c, o), o += c.length;
  }
  return t;
}, Da = {
  assign: Kd,
  flattenChunks: $d
};
let Sa = !0;
try {
  String.fromCharCode.apply(null, new Uint8Array(1));
} catch {
  Sa = !1;
}
const ar = new Uint8Array(256);
for (let r = 0; r < 256; r++)
  ar[r] = r >= 252 ? 6 : r >= 248 ? 5 : r >= 240 ? 4 : r >= 224 ? 3 : r >= 192 ? 2 : 1;
ar[254] = ar[254] = 1;
var Vd = (r) => {
  if (typeof TextEncoder == "function" && TextEncoder.prototype.encode)
    return new TextEncoder().encode(r);
  let e, t, n, o, s, c = r.length, a = 0;
  for (o = 0; o < c; o++)
    t = r.charCodeAt(o), (t & 64512) === 55296 && o + 1 < c && (n = r.charCodeAt(o + 1), (n & 64512) === 56320 && (t = 65536 + (t - 55296 << 10) + (n - 56320), o++)), a += t < 128 ? 1 : t < 2048 ? 2 : t < 65536 ? 3 : 4;
  for (e = new Uint8Array(a), s = 0, o = 0; s < a; o++)
    t = r.charCodeAt(o), (t & 64512) === 55296 && o + 1 < c && (n = r.charCodeAt(o + 1), (n & 64512) === 56320 && (t = 65536 + (t - 55296 << 10) + (n - 56320), o++)), t < 128 ? e[s++] = t : t < 2048 ? (e[s++] = 192 | t >>> 6, e[s++] = 128 | t & 63) : t < 65536 ? (e[s++] = 224 | t >>> 12, e[s++] = 128 | t >>> 6 & 63, e[s++] = 128 | t & 63) : (e[s++] = 240 | t >>> 18, e[s++] = 128 | t >>> 12 & 63, e[s++] = 128 | t >>> 6 & 63, e[s++] = 128 | t & 63);
  return e;
};
const qd = (r, e) => {
  if (e < 65534 && r.subarray && Sa)
    return String.fromCharCode.apply(null, r.length === e ? r : r.subarray(0, e));
  let t = "";
  for (let n = 0; n < e; n++)
    t += String.fromCharCode(r[n]);
  return t;
};
var Gd = (r, e) => {
  const t = e || r.length;
  if (typeof TextDecoder == "function" && TextDecoder.prototype.decode)
    return new TextDecoder().decode(r.subarray(0, e));
  let n, o;
  const s = new Array(t * 2);
  for (o = 0, n = 0; n < t; ) {
    let c = r[n++];
    if (c < 128) {
      s[o++] = c;
      continue;
    }
    let a = ar[c];
    if (a > 4) {
      s[o++] = 65533, n += a - 1;
      continue;
    }
    for (c &= a === 2 ? 31 : a === 3 ? 15 : 7; a > 1 && n < t; )
      c = c << 6 | r[n++] & 63, a--;
    if (a > 1) {
      s[o++] = 65533;
      continue;
    }
    c < 65536 ? s[o++] = c : (c -= 65536, s[o++] = 55296 | c >> 10 & 1023, s[o++] = 56320 | c & 1023);
  }
  return qd(s, o);
}, Yd = (r, e) => {
  e = e || r.length, e > r.length && (e = r.length);
  let t = e - 1;
  for (; t >= 0 && (r[t] & 192) === 128; )
    t--;
  return t < 0 || t === 0 ? e : t + ar[r[t]] > e ? t : e;
}, q0 = {
  string2buf: Vd,
  buf2string: Gd,
  utf8border: Yd
};
function Zd() {
  this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
}
var Xd = Zd;
const Hr = 16209, Jd = 16191;
var Qd = function(e, t) {
  let n, o, s, c, a, l, i, u, h, d, f, x, w, v, b, p, g, y, m, _, E, C, D, A;
  const k = e.state;
  n = e.next_in, D = e.input, o = n + (e.avail_in - 5), s = e.next_out, A = e.output, c = s - (t - e.avail_out), a = s + (e.avail_out - 257), l = k.dmax, i = k.wsize, u = k.whave, h = k.wnext, d = k.window, f = k.hold, x = k.bits, w = k.lencode, v = k.distcode, b = (1 << k.lenbits) - 1, p = (1 << k.distbits) - 1;
  e:
    do {
      x < 15 && (f += D[n++] << x, x += 8, f += D[n++] << x, x += 8), g = w[f & b];
      t:
        for (; ; ) {
          if (y = g >>> 24, f >>>= y, x -= y, y = g >>> 16 & 255, y === 0)
            A[s++] = g & 65535;
          else if (y & 16) {
            m = g & 65535, y &= 15, y && (x < y && (f += D[n++] << x, x += 8), m += f & (1 << y) - 1, f >>>= y, x -= y), x < 15 && (f += D[n++] << x, x += 8, f += D[n++] << x, x += 8), g = v[f & p];
            r:
              for (; ; ) {
                if (y = g >>> 24, f >>>= y, x -= y, y = g >>> 16 & 255, y & 16) {
                  if (_ = g & 65535, y &= 15, x < y && (f += D[n++] << x, x += 8, x < y && (f += D[n++] << x, x += 8)), _ += f & (1 << y) - 1, _ > l) {
                    e.msg = "invalid distance too far back", k.mode = Hr;
                    break e;
                  }
                  if (f >>>= y, x -= y, y = s - c, _ > y) {
                    if (y = _ - y, y > u && k.sane) {
                      e.msg = "invalid distance too far back", k.mode = Hr;
                      break e;
                    }
                    if (E = 0, C = d, h === 0) {
                      if (E += i - y, y < m) {
                        m -= y;
                        do
                          A[s++] = d[E++];
                        while (--y);
                        E = s - _, C = A;
                      }
                    } else if (h < y) {
                      if (E += i + h - y, y -= h, y < m) {
                        m -= y;
                        do
                          A[s++] = d[E++];
                        while (--y);
                        if (E = 0, h < m) {
                          y = h, m -= y;
                          do
                            A[s++] = d[E++];
                          while (--y);
                          E = s - _, C = A;
                        }
                      }
                    } else if (E += h - y, y < m) {
                      m -= y;
                      do
                        A[s++] = d[E++];
                      while (--y);
                      E = s - _, C = A;
                    }
                    for (; m > 2; )
                      A[s++] = C[E++], A[s++] = C[E++], A[s++] = C[E++], m -= 3;
                    m && (A[s++] = C[E++], m > 1 && (A[s++] = C[E++]));
                  } else {
                    E = s - _;
                    do
                      A[s++] = A[E++], A[s++] = A[E++], A[s++] = A[E++], m -= 3;
                    while (m > 2);
                    m && (A[s++] = A[E++], m > 1 && (A[s++] = A[E++]));
                  }
                } else if (y & 64) {
                  e.msg = "invalid distance code", k.mode = Hr;
                  break e;
                } else {
                  g = v[(g & 65535) + (f & (1 << y) - 1)];
                  continue r;
                }
                break;
              }
          } else if (y & 64)
            if (y & 32) {
              k.mode = Jd;
              break e;
            } else {
              e.msg = "invalid literal/length code", k.mode = Hr;
              break e;
            }
          else {
            g = w[(g & 65535) + (f & (1 << y) - 1)];
            continue t;
          }
          break;
        }
    } while (n < o && s < a);
  m = x >> 3, n -= m, x -= m << 3, f &= (1 << x) - 1, e.next_in = n, e.next_out = s, e.avail_in = n < o ? 5 + (o - n) : 5 - (n - o), e.avail_out = s < a ? 257 + (a - s) : 257 - (s - a), k.hold = f, k.bits = x;
};
const Nt = 15, Ls = 852, Ws = 592, zs = 0, A0 = 1, js = 2, eh = new Uint16Array([
  /* Length codes 257..285 base */
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  13,
  15,
  17,
  19,
  23,
  27,
  31,
  35,
  43,
  51,
  59,
  67,
  83,
  99,
  115,
  131,
  163,
  195,
  227,
  258,
  0,
  0
]), th = new Uint8Array([
  /* Length codes 257..285 extra */
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  17,
  17,
  17,
  17,
  18,
  18,
  18,
  18,
  19,
  19,
  19,
  19,
  20,
  20,
  20,
  20,
  21,
  21,
  21,
  21,
  16,
  72,
  78
]), rh = new Uint16Array([
  /* Distance codes 0..29 base */
  1,
  2,
  3,
  4,
  5,
  7,
  9,
  13,
  17,
  25,
  33,
  49,
  65,
  97,
  129,
  193,
  257,
  385,
  513,
  769,
  1025,
  1537,
  2049,
  3073,
  4097,
  6145,
  8193,
  12289,
  16385,
  24577,
  0,
  0
]), nh = new Uint8Array([
  /* Distance codes 0..29 extra */
  16,
  16,
  16,
  16,
  17,
  17,
  18,
  18,
  19,
  19,
  20,
  20,
  21,
  21,
  22,
  22,
  23,
  23,
  24,
  24,
  25,
  25,
  26,
  26,
  27,
  27,
  28,
  28,
  29,
  29,
  64,
  64
]), oh = (r, e, t, n, o, s, c, a) => {
  const l = a.bits;
  let i = 0, u = 0, h = 0, d = 0, f = 0, x = 0, w = 0, v = 0, b = 0, p = 0, g, y, m, _, E, C = null, D;
  const A = new Uint16Array(Nt + 1), k = new Uint16Array(Nt + 1);
  let S = null, F, H, U;
  for (i = 0; i <= Nt; i++)
    A[i] = 0;
  for (u = 0; u < n; u++)
    A[e[t + u]]++;
  for (f = l, d = Nt; d >= 1 && A[d] === 0; d--)
    ;
  if (f > d && (f = d), d === 0)
    return o[s++] = 1 << 24 | 64 << 16 | 0, o[s++] = 1 << 24 | 64 << 16 | 0, a.bits = 1, 0;
  for (h = 1; h < d && A[h] === 0; h++)
    ;
  for (f < h && (f = h), v = 1, i = 1; i <= Nt; i++)
    if (v <<= 1, v -= A[i], v < 0)
      return -1;
  if (v > 0 && (r === zs || d !== 1))
    return -1;
  for (k[1] = 0, i = 1; i < Nt; i++)
    k[i + 1] = k[i] + A[i];
  for (u = 0; u < n; u++)
    e[t + u] !== 0 && (c[k[e[t + u]]++] = u);
  if (r === zs ? (C = S = c, D = 20) : r === A0 ? (C = eh, S = th, D = 257) : (C = rh, S = nh, D = 0), p = 0, u = 0, i = h, E = s, x = f, w = 0, m = -1, b = 1 << f, _ = b - 1, r === A0 && b > Ls || r === js && b > Ws)
    return 1;
  for (; ; ) {
    F = i - w, c[u] + 1 < D ? (H = 0, U = c[u]) : c[u] >= D ? (H = S[c[u] - D], U = C[c[u] - D]) : (H = 96, U = 0), g = 1 << i - w, y = 1 << x, h = y;
    do
      y -= g, o[E + (p >> w) + y] = F << 24 | H << 16 | U | 0;
    while (y !== 0);
    for (g = 1 << i - 1; p & g; )
      g >>= 1;
    if (g !== 0 ? (p &= g - 1, p += g) : p = 0, u++, --A[i] === 0) {
      if (i === d)
        break;
      i = e[t + c[u]];
    }
    if (i > f && (p & _) !== m) {
      for (w === 0 && (w = f), E += h, x = i - w, v = 1 << x; x + w < d && (v -= A[x + w], !(v <= 0)); )
        x++, v <<= 1;
      if (b += 1 << x, r === A0 && b > Ls || r === js && b > Ws)
        return 1;
      m = p & _, o[m] = f << 24 | x << 16 | E - s | 0;
    }
  }
  return p !== 0 && (o[E + p] = i - w << 24 | 64 << 16 | 0), a.bits = f, 0;
};
var nr = oh;
const sh = 0, Fa = 1, Ta = 2, {
  Z_FINISH: Ks,
  Z_BLOCK: ih,
  Z_TREES: Pr,
  Z_OK: At,
  Z_STREAM_END: ah,
  Z_NEED_DICT: ch,
  Z_STREAM_ERROR: Te,
  Z_DATA_ERROR: Ra,
  Z_MEM_ERROR: Oa,
  Z_BUF_ERROR: uh,
  Z_DEFLATED: $s
} = ka, vn = 16180, Vs = 16181, qs = 16182, Gs = 16183, Ys = 16184, Zs = 16185, Xs = 16186, Js = 16187, Qs = 16188, ei = 16189, on = 16190, qe = 16191, _0 = 16192, ti = 16193, B0 = 16194, ri = 16195, ni = 16196, oi = 16197, si = 16198, Ur = 16199, Mr = 16200, ii = 16201, ai = 16202, ci = 16203, ui = 16204, li = 16205, C0 = 16206, fi = 16207, di = 16208, te = 16209, Ia = 16210, Na = 16211, lh = 852, fh = 592, dh = 15, hh = dh, hi = (r) => (r >>> 24 & 255) + (r >>> 8 & 65280) + ((r & 65280) << 8) + ((r & 255) << 24);
function xh() {
  this.strm = null, this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new Uint16Array(320), this.work = new Uint16Array(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
}
const kt = (r) => {
  if (!r)
    return 1;
  const e = r.state;
  return !e || e.strm !== r || e.mode < vn || e.mode > Na ? 1 : 0;
}, Ha = (r) => {
  if (kt(r))
    return Te;
  const e = r.state;
  return r.total_in = r.total_out = e.total = 0, r.msg = "", e.wrap && (r.adler = e.wrap & 1), e.mode = vn, e.last = 0, e.havedict = 0, e.flags = -1, e.dmax = 32768, e.head = null, e.hold = 0, e.bits = 0, e.lencode = e.lendyn = new Int32Array(lh), e.distcode = e.distdyn = new Int32Array(fh), e.sane = 1, e.back = -1, At;
}, Pa = (r) => {
  if (kt(r))
    return Te;
  const e = r.state;
  return e.wsize = 0, e.whave = 0, e.wnext = 0, Ha(r);
}, Ua = (r, e) => {
  let t;
  if (kt(r))
    return Te;
  const n = r.state;
  return e < 0 ? (t = 0, e = -e) : (t = (e >> 4) + 5, e < 48 && (e &= 15)), e && (e < 8 || e > 15) ? Te : (n.window !== null && n.wbits !== e && (n.window = null), n.wrap = t, n.wbits = e, Pa(r));
}, Ma = (r, e) => {
  if (!r)
    return Te;
  const t = new xh();
  r.state = t, t.strm = r, t.window = null, t.mode = vn;
  const n = Ua(r, e);
  return n !== At && (r.state = null), n;
}, ph = (r) => Ma(r, hh);
let xi = !0, k0, D0;
const gh = (r) => {
  if (xi) {
    k0 = new Int32Array(512), D0 = new Int32Array(32);
    let e = 0;
    for (; e < 144; )
      r.lens[e++] = 8;
    for (; e < 256; )
      r.lens[e++] = 9;
    for (; e < 280; )
      r.lens[e++] = 7;
    for (; e < 288; )
      r.lens[e++] = 8;
    for (nr(Fa, r.lens, 0, 288, k0, 0, r.work, { bits: 9 }), e = 0; e < 32; )
      r.lens[e++] = 5;
    nr(Ta, r.lens, 0, 32, D0, 0, r.work, { bits: 5 }), xi = !1;
  }
  r.lencode = k0, r.lenbits = 9, r.distcode = D0, r.distbits = 5;
}, La = (r, e, t, n) => {
  let o;
  const s = r.state;
  return s.window === null && (s.wsize = 1 << s.wbits, s.wnext = 0, s.whave = 0, s.window = new Uint8Array(s.wsize)), n >= s.wsize ? (s.window.set(e.subarray(t - s.wsize, t), 0), s.wnext = 0, s.whave = s.wsize) : (o = s.wsize - s.wnext, o > n && (o = n), s.window.set(e.subarray(t - n, t - n + o), s.wnext), n -= o, n ? (s.window.set(e.subarray(t - n, t), 0), s.wnext = n, s.whave = s.wsize) : (s.wnext += o, s.wnext === s.wsize && (s.wnext = 0), s.whave < s.wsize && (s.whave += o))), 0;
}, yh = (r, e) => {
  let t, n, o, s, c, a, l, i, u, h, d, f, x, w, v = 0, b, p, g, y, m, _, E, C;
  const D = new Uint8Array(4);
  let A, k;
  const S = (
    /* permutation of code lengths */
    new Uint8Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15])
  );
  if (kt(r) || !r.output || !r.input && r.avail_in !== 0)
    return Te;
  t = r.state, t.mode === qe && (t.mode = _0), c = r.next_out, o = r.output, l = r.avail_out, s = r.next_in, n = r.input, a = r.avail_in, i = t.hold, u = t.bits, h = a, d = l, C = At;
  e:
    for (; ; )
      switch (t.mode) {
        case vn:
          if (t.wrap === 0) {
            t.mode = _0;
            break;
          }
          for (; u < 16; ) {
            if (a === 0)
              break e;
            a--, i += n[s++] << u, u += 8;
          }
          if (t.wrap & 2 && i === 35615) {
            t.wbits === 0 && (t.wbits = 15), t.check = 0, D[0] = i & 255, D[1] = i >>> 8 & 255, t.check = Me(t.check, D, 2, 0), i = 0, u = 0, t.mode = Vs;
            break;
          }
          if (t.head && (t.head.done = !1), !(t.wrap & 1) || /* check if zlib header allowed */
          (((i & 255) << 8) + (i >> 8)) % 31) {
            r.msg = "incorrect header check", t.mode = te;
            break;
          }
          if ((i & 15) !== $s) {
            r.msg = "unknown compression method", t.mode = te;
            break;
          }
          if (i >>>= 4, u -= 4, E = (i & 15) + 8, t.wbits === 0 && (t.wbits = E), E > 15 || E > t.wbits) {
            r.msg = "invalid window size", t.mode = te;
            break;
          }
          t.dmax = 1 << t.wbits, t.flags = 0, r.adler = t.check = 1, t.mode = i & 512 ? ei : qe, i = 0, u = 0;
          break;
        case Vs:
          for (; u < 16; ) {
            if (a === 0)
              break e;
            a--, i += n[s++] << u, u += 8;
          }
          if (t.flags = i, (t.flags & 255) !== $s) {
            r.msg = "unknown compression method", t.mode = te;
            break;
          }
          if (t.flags & 57344) {
            r.msg = "unknown header flags set", t.mode = te;
            break;
          }
          t.head && (t.head.text = i >> 8 & 1), t.flags & 512 && t.wrap & 4 && (D[0] = i & 255, D[1] = i >>> 8 & 255, t.check = Me(t.check, D, 2, 0)), i = 0, u = 0, t.mode = qs;
        case qs:
          for (; u < 32; ) {
            if (a === 0)
              break e;
            a--, i += n[s++] << u, u += 8;
          }
          t.head && (t.head.time = i), t.flags & 512 && t.wrap & 4 && (D[0] = i & 255, D[1] = i >>> 8 & 255, D[2] = i >>> 16 & 255, D[3] = i >>> 24 & 255, t.check = Me(t.check, D, 4, 0)), i = 0, u = 0, t.mode = Gs;
        case Gs:
          for (; u < 16; ) {
            if (a === 0)
              break e;
            a--, i += n[s++] << u, u += 8;
          }
          t.head && (t.head.xflags = i & 255, t.head.os = i >> 8), t.flags & 512 && t.wrap & 4 && (D[0] = i & 255, D[1] = i >>> 8 & 255, t.check = Me(t.check, D, 2, 0)), i = 0, u = 0, t.mode = Ys;
        case Ys:
          if (t.flags & 1024) {
            for (; u < 16; ) {
              if (a === 0)
                break e;
              a--, i += n[s++] << u, u += 8;
            }
            t.length = i, t.head && (t.head.extra_len = i), t.flags & 512 && t.wrap & 4 && (D[0] = i & 255, D[1] = i >>> 8 & 255, t.check = Me(t.check, D, 2, 0)), i = 0, u = 0;
          } else t.head && (t.head.extra = null);
          t.mode = Zs;
        case Zs:
          if (t.flags & 1024 && (f = t.length, f > a && (f = a), f && (t.head && (E = t.head.extra_len - t.length, t.head.extra || (t.head.extra = new Uint8Array(t.head.extra_len)), t.head.extra.set(
            n.subarray(
              s,
              // extra field is limited to 65536 bytes
              // - no need for additional size check
              s + f
            ),
            /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
            E
          )), t.flags & 512 && t.wrap & 4 && (t.check = Me(t.check, n, f, s)), a -= f, s += f, t.length -= f), t.length))
            break e;
          t.length = 0, t.mode = Xs;
        case Xs:
          if (t.flags & 2048) {
            if (a === 0)
              break e;
            f = 0;
            do
              E = n[s + f++], t.head && E && t.length < 65536 && (t.head.name += String.fromCharCode(E));
            while (E && f < a);
            if (t.flags & 512 && t.wrap & 4 && (t.check = Me(t.check, n, f, s)), a -= f, s += f, E)
              break e;
          } else t.head && (t.head.name = null);
          t.length = 0, t.mode = Js;
        case Js:
          if (t.flags & 4096) {
            if (a === 0)
              break e;
            f = 0;
            do
              E = n[s + f++], t.head && E && t.length < 65536 && (t.head.comment += String.fromCharCode(E));
            while (E && f < a);
            if (t.flags & 512 && t.wrap & 4 && (t.check = Me(t.check, n, f, s)), a -= f, s += f, E)
              break e;
          } else t.head && (t.head.comment = null);
          t.mode = Qs;
        case Qs:
          if (t.flags & 512) {
            for (; u < 16; ) {
              if (a === 0)
                break e;
              a--, i += n[s++] << u, u += 8;
            }
            if (t.wrap & 4 && i !== (t.check & 65535)) {
              r.msg = "header crc mismatch", t.mode = te;
              break;
            }
            i = 0, u = 0;
          }
          t.head && (t.head.hcrc = t.flags >> 9 & 1, t.head.done = !0), r.adler = t.check = 0, t.mode = qe;
          break;
        case ei:
          for (; u < 32; ) {
            if (a === 0)
              break e;
            a--, i += n[s++] << u, u += 8;
          }
          r.adler = t.check = hi(i), i = 0, u = 0, t.mode = on;
        case on:
          if (t.havedict === 0)
            return r.next_out = c, r.avail_out = l, r.next_in = s, r.avail_in = a, t.hold = i, t.bits = u, ch;
          r.adler = t.check = 1, t.mode = qe;
        case qe:
          if (e === ih || e === Pr)
            break e;
        case _0:
          if (t.last) {
            i >>>= u & 7, u -= u & 7, t.mode = C0;
            break;
          }
          for (; u < 3; ) {
            if (a === 0)
              break e;
            a--, i += n[s++] << u, u += 8;
          }
          switch (t.last = i & 1, i >>>= 1, u -= 1, i & 3) {
            case 0:
              t.mode = ti;
              break;
            case 1:
              if (gh(t), t.mode = Ur, e === Pr) {
                i >>>= 2, u -= 2;
                break e;
              }
              break;
            case 2:
              t.mode = ni;
              break;
            case 3:
              r.msg = "invalid block type", t.mode = te;
          }
          i >>>= 2, u -= 2;
          break;
        case ti:
          for (i >>>= u & 7, u -= u & 7; u < 32; ) {
            if (a === 0)
              break e;
            a--, i += n[s++] << u, u += 8;
          }
          if ((i & 65535) !== (i >>> 16 ^ 65535)) {
            r.msg = "invalid stored block lengths", t.mode = te;
            break;
          }
          if (t.length = i & 65535, i = 0, u = 0, t.mode = B0, e === Pr)
            break e;
        case B0:
          t.mode = ri;
        case ri:
          if (f = t.length, f) {
            if (f > a && (f = a), f > l && (f = l), f === 0)
              break e;
            o.set(n.subarray(s, s + f), c), a -= f, s += f, l -= f, c += f, t.length -= f;
            break;
          }
          t.mode = qe;
          break;
        case ni:
          for (; u < 14; ) {
            if (a === 0)
              break e;
            a--, i += n[s++] << u, u += 8;
          }
          if (t.nlen = (i & 31) + 257, i >>>= 5, u -= 5, t.ndist = (i & 31) + 1, i >>>= 5, u -= 5, t.ncode = (i & 15) + 4, i >>>= 4, u -= 4, t.nlen > 286 || t.ndist > 30) {
            r.msg = "too many length or distance symbols", t.mode = te;
            break;
          }
          t.have = 0, t.mode = oi;
        case oi:
          for (; t.have < t.ncode; ) {
            for (; u < 3; ) {
              if (a === 0)
                break e;
              a--, i += n[s++] << u, u += 8;
            }
            t.lens[S[t.have++]] = i & 7, i >>>= 3, u -= 3;
          }
          for (; t.have < 19; )
            t.lens[S[t.have++]] = 0;
          if (t.lencode = t.lendyn, t.lenbits = 7, A = { bits: t.lenbits }, C = nr(sh, t.lens, 0, 19, t.lencode, 0, t.work, A), t.lenbits = A.bits, C) {
            r.msg = "invalid code lengths set", t.mode = te;
            break;
          }
          t.have = 0, t.mode = si;
        case si:
          for (; t.have < t.nlen + t.ndist; ) {
            for (; v = t.lencode[i & (1 << t.lenbits) - 1], b = v >>> 24, p = v >>> 16 & 255, g = v & 65535, !(b <= u); ) {
              if (a === 0)
                break e;
              a--, i += n[s++] << u, u += 8;
            }
            if (g < 16)
              i >>>= b, u -= b, t.lens[t.have++] = g;
            else {
              if (g === 16) {
                for (k = b + 2; u < k; ) {
                  if (a === 0)
                    break e;
                  a--, i += n[s++] << u, u += 8;
                }
                if (i >>>= b, u -= b, t.have === 0) {
                  r.msg = "invalid bit length repeat", t.mode = te;
                  break;
                }
                E = t.lens[t.have - 1], f = 3 + (i & 3), i >>>= 2, u -= 2;
              } else if (g === 17) {
                for (k = b + 3; u < k; ) {
                  if (a === 0)
                    break e;
                  a--, i += n[s++] << u, u += 8;
                }
                i >>>= b, u -= b, E = 0, f = 3 + (i & 7), i >>>= 3, u -= 3;
              } else {
                for (k = b + 7; u < k; ) {
                  if (a === 0)
                    break e;
                  a--, i += n[s++] << u, u += 8;
                }
                i >>>= b, u -= b, E = 0, f = 11 + (i & 127), i >>>= 7, u -= 7;
              }
              if (t.have + f > t.nlen + t.ndist) {
                r.msg = "invalid bit length repeat", t.mode = te;
                break;
              }
              for (; f--; )
                t.lens[t.have++] = E;
            }
          }
          if (t.mode === te)
            break;
          if (t.lens[256] === 0) {
            r.msg = "invalid code -- missing end-of-block", t.mode = te;
            break;
          }
          if (t.lenbits = 9, A = { bits: t.lenbits }, C = nr(Fa, t.lens, 0, t.nlen, t.lencode, 0, t.work, A), t.lenbits = A.bits, C) {
            r.msg = "invalid literal/lengths set", t.mode = te;
            break;
          }
          if (t.distbits = 6, t.distcode = t.distdyn, A = { bits: t.distbits }, C = nr(Ta, t.lens, t.nlen, t.ndist, t.distcode, 0, t.work, A), t.distbits = A.bits, C) {
            r.msg = "invalid distances set", t.mode = te;
            break;
          }
          if (t.mode = Ur, e === Pr)
            break e;
        case Ur:
          t.mode = Mr;
        case Mr:
          if (a >= 6 && l >= 258) {
            r.next_out = c, r.avail_out = l, r.next_in = s, r.avail_in = a, t.hold = i, t.bits = u, Qd(r, d), c = r.next_out, o = r.output, l = r.avail_out, s = r.next_in, n = r.input, a = r.avail_in, i = t.hold, u = t.bits, t.mode === qe && (t.back = -1);
            break;
          }
          for (t.back = 0; v = t.lencode[i & (1 << t.lenbits) - 1], b = v >>> 24, p = v >>> 16 & 255, g = v & 65535, !(b <= u); ) {
            if (a === 0)
              break e;
            a--, i += n[s++] << u, u += 8;
          }
          if (p && !(p & 240)) {
            for (y = b, m = p, _ = g; v = t.lencode[_ + ((i & (1 << y + m) - 1) >> y)], b = v >>> 24, p = v >>> 16 & 255, g = v & 65535, !(y + b <= u); ) {
              if (a === 0)
                break e;
              a--, i += n[s++] << u, u += 8;
            }
            i >>>= y, u -= y, t.back += y;
          }
          if (i >>>= b, u -= b, t.back += b, t.length = g, p === 0) {
            t.mode = li;
            break;
          }
          if (p & 32) {
            t.back = -1, t.mode = qe;
            break;
          }
          if (p & 64) {
            r.msg = "invalid literal/length code", t.mode = te;
            break;
          }
          t.extra = p & 15, t.mode = ii;
        case ii:
          if (t.extra) {
            for (k = t.extra; u < k; ) {
              if (a === 0)
                break e;
              a--, i += n[s++] << u, u += 8;
            }
            t.length += i & (1 << t.extra) - 1, i >>>= t.extra, u -= t.extra, t.back += t.extra;
          }
          t.was = t.length, t.mode = ai;
        case ai:
          for (; v = t.distcode[i & (1 << t.distbits) - 1], b = v >>> 24, p = v >>> 16 & 255, g = v & 65535, !(b <= u); ) {
            if (a === 0)
              break e;
            a--, i += n[s++] << u, u += 8;
          }
          if (!(p & 240)) {
            for (y = b, m = p, _ = g; v = t.distcode[_ + ((i & (1 << y + m) - 1) >> y)], b = v >>> 24, p = v >>> 16 & 255, g = v & 65535, !(y + b <= u); ) {
              if (a === 0)
                break e;
              a--, i += n[s++] << u, u += 8;
            }
            i >>>= y, u -= y, t.back += y;
          }
          if (i >>>= b, u -= b, t.back += b, p & 64) {
            r.msg = "invalid distance code", t.mode = te;
            break;
          }
          t.offset = g, t.extra = p & 15, t.mode = ci;
        case ci:
          if (t.extra) {
            for (k = t.extra; u < k; ) {
              if (a === 0)
                break e;
              a--, i += n[s++] << u, u += 8;
            }
            t.offset += i & (1 << t.extra) - 1, i >>>= t.extra, u -= t.extra, t.back += t.extra;
          }
          if (t.offset > t.dmax) {
            r.msg = "invalid distance too far back", t.mode = te;
            break;
          }
          t.mode = ui;
        case ui:
          if (l === 0)
            break e;
          if (f = d - l, t.offset > f) {
            if (f = t.offset - f, f > t.whave && t.sane) {
              r.msg = "invalid distance too far back", t.mode = te;
              break;
            }
            f > t.wnext ? (f -= t.wnext, x = t.wsize - f) : x = t.wnext - f, f > t.length && (f = t.length), w = t.window;
          } else
            w = o, x = c - t.offset, f = t.length;
          f > l && (f = l), l -= f, t.length -= f;
          do
            o[c++] = w[x++];
          while (--f);
          t.length === 0 && (t.mode = Mr);
          break;
        case li:
          if (l === 0)
            break e;
          o[c++] = t.length, l--, t.mode = Mr;
          break;
        case C0:
          if (t.wrap) {
            for (; u < 32; ) {
              if (a === 0)
                break e;
              a--, i |= n[s++] << u, u += 8;
            }
            if (d -= l, r.total_out += d, t.total += d, t.wrap & 4 && d && (r.adler = t.check = /*UPDATE_CHECK(state.check, put - _out, _out);*/
            t.flags ? Me(t.check, o, d, c - d) : $0(t.check, o, d, c - d)), d = l, t.wrap & 4 && (t.flags ? i : hi(i)) !== t.check) {
              r.msg = "incorrect data check", t.mode = te;
              break;
            }
            i = 0, u = 0;
          }
          t.mode = fi;
        case fi:
          if (t.wrap && t.flags) {
            for (; u < 32; ) {
              if (a === 0)
                break e;
              a--, i += n[s++] << u, u += 8;
            }
            if (t.wrap & 4 && i !== (t.total & 4294967295)) {
              r.msg = "incorrect length check", t.mode = te;
              break;
            }
            i = 0, u = 0;
          }
          t.mode = di;
        case di:
          C = ah;
          break e;
        case te:
          C = Ra;
          break e;
        case Ia:
          return Oa;
        case Na:
        default:
          return Te;
      }
  return r.next_out = c, r.avail_out = l, r.next_in = s, r.avail_in = a, t.hold = i, t.bits = u, (t.wsize || d !== r.avail_out && t.mode < te && (t.mode < C0 || e !== Ks)) && La(r, r.output, r.next_out, d - r.avail_out), h -= r.avail_in, d -= r.avail_out, r.total_in += h, r.total_out += d, t.total += d, t.wrap & 4 && d && (r.adler = t.check = /*UPDATE_CHECK(state.check, strm.next_out - _out, _out);*/
  t.flags ? Me(t.check, o, d, r.next_out - d) : $0(t.check, o, d, r.next_out - d)), r.data_type = t.bits + (t.last ? 64 : 0) + (t.mode === qe ? 128 : 0) + (t.mode === Ur || t.mode === B0 ? 256 : 0), (h === 0 && d === 0 || e === Ks) && C === At && (C = uh), C;
}, vh = (r) => {
  if (kt(r))
    return Te;
  let e = r.state;
  return e.window && (e.window = null), r.state = null, At;
}, wh = (r, e) => {
  if (kt(r))
    return Te;
  const t = r.state;
  return t.wrap & 2 ? (t.head = e, e.done = !1, At) : Te;
}, bh = (r, e) => {
  const t = e.length;
  let n, o, s;
  return kt(r) || (n = r.state, n.wrap !== 0 && n.mode !== on) ? Te : n.mode === on && (o = 1, o = $0(o, e, t, 0), o !== n.check) ? Ra : (s = La(r, e, t, t), s ? (n.mode = Ia, Oa) : (n.havedict = 1, At));
};
var mh = Pa, Eh = Ua, Ah = Ha, _h = ph, Bh = Ma, Ch = yh, kh = vh, Dh = wh, Sh = bh, Fh = "pako inflate (from Nodeca project)", Ye = {
  inflateReset: mh,
  inflateReset2: Eh,
  inflateResetKeep: Ah,
  inflateInit: _h,
  inflateInit2: Bh,
  inflate: Ch,
  inflateEnd: kh,
  inflateGetHeader: Dh,
  inflateSetDictionary: Sh,
  inflateInfo: Fh
};
function Th() {
  this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
}
var Rh = Th;
const Wa = Object.prototype.toString, {
  Z_NO_FLUSH: Oh,
  Z_FINISH: Ih,
  Z_OK: cr,
  Z_STREAM_END: S0,
  Z_NEED_DICT: F0,
  Z_STREAM_ERROR: Nh,
  Z_DATA_ERROR: pi,
  Z_MEM_ERROR: Hh
} = ka;
function wn(r) {
  this.options = Da.assign({
    chunkSize: 1024 * 64,
    windowBits: 15,
    to: ""
  }, r || {});
  const e = this.options;
  e.raw && e.windowBits >= 0 && e.windowBits < 16 && (e.windowBits = -e.windowBits, e.windowBits === 0 && (e.windowBits = -15)), e.windowBits >= 0 && e.windowBits < 16 && !(r && r.windowBits) && (e.windowBits += 32), e.windowBits > 15 && e.windowBits < 48 && (e.windowBits & 15 || (e.windowBits |= 15)), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new Xd(), this.strm.avail_out = 0;
  let t = Ye.inflateInit2(
    this.strm,
    e.windowBits
  );
  if (t !== cr)
    throw new Error(V0[t]);
  if (this.header = new Rh(), Ye.inflateGetHeader(this.strm, this.header), e.dictionary && (typeof e.dictionary == "string" ? e.dictionary = q0.string2buf(e.dictionary) : Wa.call(e.dictionary) === "[object ArrayBuffer]" && (e.dictionary = new Uint8Array(e.dictionary)), e.raw && (t = Ye.inflateSetDictionary(this.strm, e.dictionary), t !== cr)))
    throw new Error(V0[t]);
}
wn.prototype.push = function(r, e) {
  const t = this.strm, n = this.options.chunkSize, o = this.options.dictionary;
  let s, c, a;
  if (this.ended) return !1;
  for (e === ~~e ? c = e : c = e === !0 ? Ih : Oh, Wa.call(r) === "[object ArrayBuffer]" ? t.input = new Uint8Array(r) : t.input = r, t.next_in = 0, t.avail_in = t.input.length; ; ) {
    for (t.avail_out === 0 && (t.output = new Uint8Array(n), t.next_out = 0, t.avail_out = n), s = Ye.inflate(t, c), s === F0 && o && (s = Ye.inflateSetDictionary(t, o), s === cr ? s = Ye.inflate(t, c) : s === pi && (s = F0)); t.avail_in > 0 && s === S0 && t.state.wrap > 0 && r[t.next_in] !== 0; )
      Ye.inflateReset(t), s = Ye.inflate(t, c);
    switch (s) {
      case Nh:
      case pi:
      case F0:
      case Hh:
        return this.onEnd(s), this.ended = !0, !1;
    }
    if (a = t.avail_out, t.next_out && (t.avail_out === 0 || s === S0))
      if (this.options.to === "string") {
        let l = q0.utf8border(t.output, t.next_out), i = t.next_out - l, u = q0.buf2string(t.output, l);
        t.next_out = i, t.avail_out = n - i, i && t.output.set(t.output.subarray(l, l + i), 0), this.onData(u);
      } else
        this.onData(t.output.length === t.next_out ? t.output : t.output.subarray(0, t.next_out));
    if (!(s === cr && a === 0)) {
      if (s === S0)
        return s = Ye.inflateEnd(this.strm), this.onEnd(s), this.ended = !0, !0;
      if (t.avail_in === 0) break;
    }
  }
  return !0;
};
wn.prototype.onData = function(r) {
  this.chunks.push(r);
};
wn.prototype.onEnd = function(r) {
  r === cr && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = Da.flattenChunks(this.chunks)), this.chunks = [], this.err = r, this.msg = this.strm.msg;
};
function Ph(r, e) {
  const t = new wn(e);
  if (t.push(r), t.err) throw t.msg || V0[t.err];
  return t.result;
}
var Uh = Ph, Mh = {
  inflate: Uh
};
const { inflate: Lh } = Mh;
var Wh = Lh;
class xx {
  static parseJavaByteArray(e) {
    const t = e.slice(1, -1).split(",").map((n) => {
      let o = parseInt(n.trim());
      return o < 0 && (o += 256), o;
    });
    return new Uint8Array(t);
  }
  static arrayBufferToWordArray(e) {
    const t = [];
    let n = 0;
    const o = e.length;
    for (; n < o; )
      t.push(
        e[n++] << 24 | e[n++] << 16 | e[n++] << 8 | e[n++]
      );
    return ie.lib.WordArray.create(t, e.length);
  }
  static wordArrayToUint8Array(e) {
    const t = e.words, n = e.sigBytes, o = new Uint8Array(n);
    let s = 0;
    for (let c = 0; c < n; c += 4) {
      const a = t[c / 4];
      for (let l = 0; l < Math.min(4, n - c); l++)
        o[s++] = a >>> 24 - l * 8 & 255;
    }
    return o;
  }
  static decryptData(e, t, n) {
    try {
      const o = this.arrayBufferToWordArray(e), s = this.arrayBufferToWordArray(t), c = ie.AES.decrypt(
        ie.lib.CipherParams.create({
          ciphertext: o
        }),
        n,
        {
          iv: s,
          mode: ie.mode.CBC,
          padding: ie.pad.Pkcs7
        }
      );
      return this.wordArrayToUint8Array(c);
    } catch (o) {
      throw console.error("Decryption error:", o), new Error("Failed to decrypt data - invalid password");
    }
  }
  static generateDeterministicSecret(e, t, n) {
    const o = zh(e, t), s = Buffer.from(n, "hex"), c = re.generateRandomAddress(s, o.secret, (a) => {
      if (o.prng) {
        const l = a.length, i = o.prng.nextBytes(l);
        a.set(i);
      }
    });
    return { secret: o.secret, address: c };
  }
  static async decode(e, t) {
    try {
      let n = 0;
      const o = new Uint8Array(e), s = Buffer.from(o.slice(0, 32)).toString("hex");
      n += 32;
      const c = new DataView(o.buffer).getUint32(n);
      n += 4;
      const a = o.slice(n, n + c), l = JSON.parse(
        new TextDecoder().decode(a)
      );
      n += c;
      const i = this.parseJavaByteArray(l["pbkdf2 salt"]), u = ie.PBKDF2(
        t,
        this.arrayBufferToWordArray(i),
        {
          keySize: 128 / 32,
          iterations: parseInt(l["pbkdf2 iteration"]),
          hasher: ie.algo.SHA1
        }
      ), h = o.slice(n, n + 16);
      n += 16;
      const d = new DataView(o.buffer).getUint32(n);
      n += 4;
      const f = o.slice(n, n + d);
      n += d;
      const x = this.decryptData(f, h, u);
      let w = 0;
      for (; w < x.length && x[w] !== 125; )
        w++;
      w++;
      const v = JSON.parse(
        new TextDecoder().decode(x.slice(0, w))
      ), b = [];
      for (; n < o.length; ) {
        const p = o.slice(n, n + 16);
        n += 16;
        const g = new DataView(o.buffer).getUint32(n);
        n += 4;
        const y = o.slice(n, n + g);
        n += g;
        const m = this.decryptData(y, p, u), _ = Wh(m);
        let E = 0;
        for (; E < _.length && _[E] !== 125; )
          E++;
        E++;
        const C = JSON.parse(
          new TextDecoder().decode(_.slice(0, E))
        );
        C.address = Buffer.from(
          this.parseJavaByteArray(C.address)
        ).toString("hex"), C.secret = Buffer.from(
          this.parseJavaByteArray(C.secret)
        ).toString("hex"), b.push(C);
      }
      return { publicHeader: l, privateHeader: v, entries: b };
    } catch (n) {
      throw console.error("MCM decoding error:", n), n instanceof Error ? new Error(`Failed to decode MCM file: ${n.message}`) : new Error("Failed to decode MCM file");
    }
  }
}
function zh(r, e) {
  const t = qi(e), n = [...r, ...t], o = ie.lib.WordArray.create(new Uint8Array(n)), s = ie.SHA512(o), c = oo(s), a = new Xr();
  return a.addSeedMaterial(c), { secret: new Uint8Array(a.nextBytes(32)), prng: a };
}
function G0(r) {
  const e = [];
  for (let t = 0; t < r.length; t += 4)
    e.push(
      r[t] << 24 | (r[t + 1] || 0) << 16 | (r[t + 2] || 0) << 8 | (r[t + 3] || 0)
    );
  return ln.lib.WordArray.create(e, r.length);
}
function za(r) {
  const e = r.words, t = r.sigBytes, n = new Uint8Array(t);
  for (let o = 0; o < t; o++) {
    const s = e[o >>> 2] >>> 24 - o % 4 * 8 & 255;
    n[o] = s;
  }
  return n;
}
function px(r) {
  const e = G0(r), t = ln.SHA256(e);
  return za(t);
}
function gi(r, e) {
  const t = G0(r), n = G0(e), o = ln.HmacSHA256(n, t);
  return za(o);
}
const jh = (process.env.NODE_ENV === "test", 1e5);
async function yo(r, e, t) {
  return ja(r, e, t);
}
async function Kh(r, e) {
  const t = new TextEncoder().encode(`account_${e}`);
  return yo(r, e, {
    salt: t,
    keyLength: 32
    // WOTS secret must be 32 bytes
  });
}
async function $h(r, e) {
  const t = new TextEncoder().encode(`wots_${e}`);
  return yo(r, e, {
    salt: t,
    keyLength: 32
    // WOTS secret must be 32 bytes
  });
}
const yi = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
async function Vh(r, e) {
  const t = new TextEncoder().encode(`tag_${e}`), n = await yo(r, e, {
    salt: t,
    keyLength: 32,
    iterations: 1e4
  }), o = new Uint8Array(12);
  for (let s = 0; s < 12; s++) {
    const c = n[s] % yi.length;
    o[s] = yi.charCodeAt(c);
  }
  return o;
}
async function gx(r, e, t, n = `Account ${e} - WOTS ${t}`) {
  const o = await Kh(r, e), s = await Vh(r, e), c = await $h(o, t);
  try {
    return wt.create(n, c, s);
  } finally {
    jr(o);
  }
}
async function yx(r, e, t) {
  return ja(r, e, t);
}
function ja(r, e, t) {
  const o = new TextEncoder().encode(e.toString()), s = r.length + o.length + t.salt.length, c = new Uint8Array(s);
  c.set(r), c.set(o, r.length), c.set(t.salt, r.length + o.length);
  try {
    let a = c;
    const l = Math.ceil((t.iterations || jh) / 100);
    for (let i = 0; i < l; i++)
      a = gi(a, t.salt), a = gi(a, c);
    return t.keyLength && t.keyLength !== a.length && (a = a.slice(0, t.keyLength)), a;
  } finally {
    jr(c);
  }
}
export {
  gt as Derivation,
  Xr as DigestRandomGenerator,
  xx as MCMDecoder,
  pe as MasterSeed,
  Zh as MeshNetworkService,
  ux as MochimoWalletProvider,
  nn as NetworkProvider,
  Qu as ProxyNetworkService,
  ge as SessionManager,
  we as StorageProvider,
  gx as createWOTSWallet,
  nd as decrypt,
  ir as decryptAccount,
  Kh as deriveAccountSeed,
  Vh as deriveAccountTag,
  yo as deriveKey,
  yx as deriveKeyCrypto,
  ja as deriveKeyFast,
  zh as deriveSecret,
  cx as deriveSubkey,
  $h as deriveWotsSeed,
  rd as encrypt,
  fo as encryptAccount,
  ax as generateRandomKey,
  gi as hmacSHA256,
  qi as intToBytes,
  px as sha256,
  Xf as store,
  bd as useAccounts,
  fx as useNetwork,
  md as useNetworkSync,
  hx as useStorage,
  dx as useTransaction,
  lx as useWallet,
  oo as wordArrayToBytes
};
