var Sl = Object.defineProperty;
var Dl = (e, r, t) => r in e ? Sl(e, r, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[r] = t;
var de = (e, r, t) => Dl(e, typeof r != "symbol" ? r + "" : r, t);
import * as Ie from "react";
import Yn, { useState as ct, useEffect as Ir, useCallback as ce, useMemo as ki, useRef as vo } from "react";
const J0 = "AES-CBC", Fl = 256, Tl = 16, Rl = 16, Ol = process.env.NODE_ENV === "test" ? 10 : 1e5;
async function Os(e, r) {
  const t = new TextEncoder(), n = await crypto.subtle.importKey(
    "raw",
    t.encode(e),
    "PBKDF2",
    !1,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: r,
      iterations: Ol,
      hash: "SHA-256"
    },
    n,
    {
      name: J0,
      length: Fl
    },
    !1,
    ["encrypt", "decrypt"]
  );
}
async function Il(e, r) {
  const t = crypto.getRandomValues(new Uint8Array(Tl)), n = crypto.getRandomValues(new Uint8Array(Rl)), o = e.length > 0 ? Buffer.from(e).toString("base64") : "", i = new TextEncoder().encode(o), c = await Os(r, t), s = await crypto.subtle.encrypt(
    {
      name: J0,
      iv: n
    },
    c,
    i
  );
  return {
    data: btoa(String.fromCharCode(...new Uint8Array(s))),
    iv: btoa(String.fromCharCode(...n)),
    salt: btoa(String.fromCharCode(...t))
  };
}
async function Nl(e, r) {
  try {
    const t = Uint8Array.from(atob(e.data), (u) => u.charCodeAt(0)), n = Uint8Array.from(atob(e.iv), (u) => u.charCodeAt(0)), o = Uint8Array.from(atob(e.salt), (u) => u.charCodeAt(0)), i = await Os(r, o), c = await crypto.subtle.decrypt(
      {
        name: J0,
        iv: n
      },
      i,
      t
    ), s = new TextDecoder().decode(c);
    return new Uint8Array(Buffer.from(s, "base64"));
  } catch {
    throw new Error("Failed to decrypt - invalid password");
  }
}
function s2(e = 32) {
  return crypto.getRandomValues(new Uint8Array(e));
}
async function c2(e, r) {
  const n = new TextEncoder().encode(r.toString()), o = await crypto.subtle.importKey(
    "raw",
    e,
    {
      name: "HMAC",
      hash: "SHA-256"
    },
    !1,
    ["sign"]
  ), i = await crypto.subtle.sign(
    "HMAC",
    o,
    n
  );
  return new Uint8Array(i);
}
const Q0 = async (e, r) => {
  const t = Buffer.from(JSON.stringify(e), "utf-8"), n = await Il(t, Buffer.from(r).toString("hex"));
  return {
    tag: e.tag,
    encryptedData: n
  };
}, Nr = async (e, r) => {
  const t = await Nl(e.encryptedData, Buffer.from(r).toString("hex")), n = Buffer.from(t).toString("utf-8");
  return JSON.parse(n);
};
class Hl {
  constructor(r = "mochimo_wallet_") {
    de(this, "prefix");
    this.prefix = r;
  }
  getKey(r) {
    return `${this.prefix}${r}`;
  }
  async saveMasterSeed(r) {
    localStorage.setItem(
      this.getKey("masterSeed"),
      JSON.stringify(r)
    );
  }
  async loadMasterSeed() {
    const r = localStorage.getItem(this.getKey("masterSeed"));
    return r ? JSON.parse(r) : null;
  }
  async saveAccount(r, t) {
    const n = localStorage.getItem(this.getKey("accounts")), o = n ? JSON.parse(n) : {};
    o[r.tag] = await Q0(r, t), localStorage.setItem(
      this.getKey("accounts"),
      JSON.stringify(o)
    );
  }
  async loadAccount(r, t) {
    const n = localStorage.getItem(this.getKey("accounts")), i = (n ? JSON.parse(n) : {})[r];
    return i ? Nr(i, t) : null;
  }
  async loadAccounts(r) {
    const t = localStorage.getItem(this.getKey("accounts")), n = t ? JSON.parse(t) : {};
    return Promise.all(
      Object.values(n).map(
        (o) => Nr(o, r)
      )
    );
  }
  async deleteAccount(r) {
    const t = localStorage.getItem(this.getKey("accounts")), n = t ? JSON.parse(t) : {};
    delete n[r], localStorage.setItem(
      this.getKey("accounts"),
      JSON.stringify(n)
    );
  }
  async saveActiveAccount(r) {
    localStorage.setItem(
      this.getKey("activeAccount"),
      JSON.stringify(r)
    );
  }
  async loadActiveAccount() {
    const r = localStorage.getItem(this.getKey("activeAccount"));
    return r ? JSON.parse(r) : null;
  }
  async saveHighestIndex(r) {
    localStorage.setItem(
      this.getKey("highestIndex"),
      JSON.stringify(r)
    );
  }
  async loadHighestIndex() {
    const r = localStorage.getItem(this.getKey("highestIndex"));
    return r ? JSON.parse(r) : -1;
  }
  async clear() {
    Object.keys(localStorage).filter(
      (t) => t.startsWith(this.prefix)
    ).forEach((t) => localStorage.removeItem(t));
  }
  async setItem(r, t) {
    localStorage.setItem(this.getKey(r), t);
  }
  async getItem(r) {
    return localStorage.getItem(this.getKey(r));
  }
  async removeItem(r) {
    localStorage.removeItem(this.getKey(r));
  }
}
class zl {
  constructor(r = "mochimo_wallet_") {
    de(this, "storage");
    de(this, "prefix");
    this.storage = Ll(), this.prefix = r;
  }
  getKey(r) {
    return this.prefix ? `${this.prefix}_${r}` : r;
  }
  async saveMasterSeed(r) {
    await this.storage.set({
      [this.getKey("masterSeed")]: r
    });
  }
  async loadMasterSeed() {
    return (await this.storage.get(this.getKey("masterSeed")))[this.getKey("masterSeed")] || null;
  }
  async saveAccount(r, t) {
    const o = (await this.storage.get(this.getKey("accounts")))[this.getKey("accounts")] || {};
    o[r.tag] = await Q0(r, t), await this.storage.set({
      [this.getKey("accounts")]: o
    });
  }
  async loadAccount(r, t) {
    const i = ((await this.storage.get(this.getKey("accounts")))[this.getKey("accounts")] || {})[r];
    return i ? Nr(i, t) : null;
  }
  async loadAccounts(r) {
    const n = (await this.storage.get(this.getKey("accounts")))[this.getKey("accounts")] || {};
    return Promise.all(
      Object.values(n).map(
        (o) => Nr(o, r)
      )
    );
  }
  async deleteAccount(r) {
    const n = (await this.storage.get(this.getKey("accounts")))[this.getKey("accounts")] || {};
    delete n[r], await this.storage.set({
      [this.getKey("accounts")]: n
    });
  }
  async saveActiveAccount(r) {
    await this.storage.set({
      [this.getKey("activeAccount")]: r
    });
  }
  async loadActiveAccount() {
    return (await this.storage.get(this.getKey("activeAccount")))[this.getKey("activeAccount")] || null;
  }
  async saveHighestIndex(r) {
    await this.storage.set({
      [this.getKey("highestIndex")]: r
    });
  }
  async loadHighestIndex() {
    let t = (await this.storage.get(this.getKey("highestIndex")))[this.getKey("highestIndex")];
    return t ?? -1;
  }
  async clear() {
    const r = await this.storage.get(), t = Object.keys(r).filter((n) => n.startsWith(this.prefix));
    t.length > 0 && await this.storage.remove(t);
  }
  async setItem(r, t) {
    await this.storage.set({
      [this.getKey(r)]: t
    });
  }
  async getItem(r) {
    return (await this.storage.get(this.getKey(r)))[this.getKey(r)] || null;
  }
  async removeItem(r) {
    await this.storage.remove(this.getKey(r));
  }
}
function Ll() {
  if (typeof browser < "u" && browser.storage)
    return browser.storage.local;
  if (typeof chrome < "u" && chrome.storage)
    return chrome.storage.local;
  throw new Error("No extension storage API available");
}
class Ul {
  /**
   * Creates appropriate storage implementation based on environment
   */
  static create(r = "mochimo_wallet_") {
    if (typeof browser < "u" || typeof chrome < "u")
      try {
        return new zl(r);
      } catch {
        console.warn("Extension storage not available, falling back to local storage");
      }
    return new Hl(r);
  }
}
let Si = Ul.create();
const be = {
  setStorage: (e) => {
    Si = e;
  },
  getStorage: () => Si
}, ei = [
  { label: "api.mochimo.org", url: "https://api.mochimo.org" },
  { label: "Nick's Dev API", url: "https://dev-api.mochiscan.org:8443" },
  { label: "backup - US Central", url: "https://api-usc.mochimo.org" },
  { label: "backup - Singapore", url: "https://api-sgp.mochimo.org" },
  { label: "backup - Germany", url: "https://api-deu.mochimo.org" },
  { label: "backup - Australia", url: "http://api-aus.mochimo.org:8080" },
  { label: "Custom API", url: "custom" }
], Is = "api-endpoint";
function Ns() {
  return be.getStorage();
}
function l2() {
  return ei;
}
async function Ml() {
  try {
    const r = await Ns().getItem(Is);
    if (r) return r;
  } catch {
  }
  return ei[0].url;
}
async function Pl(e) {
  if (!Hs(e)) return !1;
  try {
    return await Ns().setItem(Is, e), !0;
  } catch {
    return !1;
  }
}
function Hs(e) {
  if (e === "custom") return !0;
  try {
    const r = new URL(e);
    return r.protocol === "https:" || r.protocol === "http:";
  } catch {
    return !1;
  }
}
function u2() {
  const [e, r] = ct(ei[0].url), [t, n] = ct(!0), [o, i] = ct(null);
  Ir(() => {
    let s = !1;
    return n(!0), (async () => {
      try {
        const u = await Ml();
        s || r(u), n(!1);
      } catch {
        i("Failed to load endpoint"), n(!1);
      }
    })(), () => {
      s = !0;
    };
  }, []);
  const c = ce(async (s) => {
    if (!Hs(s))
      return i("Invalid endpoint URL"), !1;
    n(!0);
    const u = await Pl(s);
    return u ? (r(s), i(null)) : i("Failed to save endpoint"), n(!1), u;
  }, []);
  return [e, c, t, o];
}
class Wl {
  constructor(r) {
    de(this, "apiUrl");
    this.apiUrl = r;
  }
  getAccountBalance(r) {
    throw new Error("Method not implemented.");
  }
  getMempoolTransactions() {
    throw new Error("Method not implemented.");
  }
  getMempoolTransaction(r) {
    throw new Error("Method not implemented.");
  }
  waitForTransaction(r, t, n) {
    throw new Error("Method not implemented.");
  }
  getNetworkOptions() {
    throw new Error("Method not implemented.");
  }
  getBlock(r) {
    throw new Error("Method not implemented.");
  }
  getBlockTransaction(r, t) {
    throw new Error("Method not implemented.");
  }
  submit(r) {
    throw new Error("Method not implemented.");
  }
  derive(r, t) {
    throw new Error("Method not implemented.");
  }
  preprocess(r, t) {
    throw new Error("Method not implemented.");
  }
  metadata(r, t) {
    throw new Error("Method not implemented.");
  }
  payloads(r, t, n) {
    throw new Error("Method not implemented.");
  }
  combine(r, t) {
    throw new Error("Method not implemented.");
  }
  parse(r, t) {
    throw new Error("Method not implemented.");
  }
  searchTransactionsByAddress(r, t) {
    throw new Error("Method not implemented.");
  }
  searchTransactionsByBlock(r, t) {
    throw new Error("Method not implemented.");
  }
  searchTransactionsByTxId(r, t) {
    throw new Error("Method not implemented.");
  }
  getEventsBlocks(r) {
    throw new Error("Method not implemented.");
  }
  getStatsRichlist(r) {
    throw new Error("Method not implemented.");
  }
  getNetworkStatus() {
    throw new Error("Method not implemented.");
  }
  getBalance(r) {
    throw new Error("Method not implemented.");
  }
  async resolveTag(r) {
    try {
      const t = await fetch(`${this.apiUrl}/net/resolve/${r}`);
      if (!t.ok)
        throw new Error(`HTTP error! status: ${t.status}`);
      return await t.json();
    } catch (t) {
      throw console.error("Error resolving tag:", t), t;
    }
  }
  async pushTransaction(r, t) {
    try {
      const n = await fetch(`${this.apiUrl}/push`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ transaction: r, recipients: t })
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
  async activateTag(r) {
    try {
      const t = await fetch(`${this.apiUrl}/fund/${r}`);
      if (!t.ok)
        throw new Error(`HTTP error! status: ${t.status}`);
      return await t.json();
    } catch (t) {
      throw console.error("Error activating tag:", t), t;
    }
  }
}
let Di = new Wl("https://api.mochimo.org");
const Hr = {
  setNetwork: (e) => {
    Di = e;
  },
  getNetwork: () => Di
};
async function jl(e) {
  var s, u, a, l, h, d, f, x, v, w, _, p, g, y, b, A, m, C, S, E, k, T, R, z;
  const r = Hr.getNetwork(), t = "0x" + e.tag;
  let n = [], o = [], i = [];
  try {
    const H = await r.searchTransactionsByAddress(t, { limit: 20 });
    if (H && Array.isArray(H.transactions))
      for (const L of H.transactions) {
        if (!((s = L.transaction_identifier) != null && s.hash) || !L.operations || !((u = L.block_identifier) != null && u.index)) continue;
        const Q = (a = L.block_identifier) == null ? void 0 : a.index.toString(), K = (l = L.block_identifier) == null ? void 0 : l.index, J = L.timestamp || Date.now();
        let V = BigInt(0);
        L.metadata && L.metadata.fee_total && (V = BigInt(L.metadata.fee_total));
        const O = L.operations.filter(
          (F) => {
            var D, W;
            return F.type === "SOURCE_TRANSFER" && ((W = (D = F.account) == null ? void 0 : D.address) == null ? void 0 : W.toLowerCase()) === t.toLowerCase();
          }
        );
        for (const F of O) {
          const D = (d = (h = F.account) == null ? void 0 : h.address) == null ? void 0 : d.toLowerCase(), W = L.operations.filter(
            (ne) => {
              var M, Le;
              return ne.type === "DESTINATION_TRANSFER" && ((Le = (M = ne.account) == null ? void 0 : M.address) == null ? void 0 : Le.toLowerCase()) !== D;
            }
          ), G = W.length > 0 ? V / BigInt(W.length) : BigInt(0);
          for (const ne of W)
            n.push({
              type: "send",
              amount: ((f = ne.amount) == null ? void 0 : f.value) || "0",
              timestamp: J,
              address: (x = ne.account) == null ? void 0 : x.address,
              txid: (v = L.transaction_identifier) == null ? void 0 : v.hash,
              blockNumber: K,
              pending: !1,
              fee: G.toString(),
              memo: (w = ne.metadata) == null ? void 0 : w.memo
            });
        }
        const I = L.operations.filter(
          (F) => {
            var D, W;
            return F.type === "DESTINATION_TRANSFER" && ((W = (D = F.account) == null ? void 0 : D.address) == null ? void 0 : W.toLowerCase()) === t.toLowerCase();
          }
        );
        for (const F of I) {
          const D = L.operations.find((W) => W.type === "SOURCE_TRANSFER");
          D && ((p = (_ = D.account) == null ? void 0 : _.address) == null ? void 0 : p.toLowerCase()) !== t.toLowerCase() && n.push({
            type: "receive",
            amount: ((g = F.amount) == null ? void 0 : g.value) || "0",
            timestamp: J,
            address: D ? (y = D.account) == null ? void 0 : y.address : "Unknown",
            txid: (b = L.transaction_identifier) == null ? void 0 : b.hash,
            blockNumber: K,
            memo: (A = F.metadata) == null ? void 0 : A.memo
          });
        }
      }
  } catch {
  }
  try {
    const H = await r.getMempoolTransactions();
    if (H && Array.isArray(H.transactions))
      for (const L of H.transactions) {
        if (!((m = L.transaction_identifier) != null && m.hash) || !L.operations) continue;
        const Q = L.timestamp || Date.now(), K = (C = L.transaction_identifier) == null ? void 0 : C.hash;
        if (!L.operations.some(
          (I) => {
            var F, D;
            return ((D = (F = I.account) == null ? void 0 : F.address) == null ? void 0 : D.toLowerCase()) === t.toLowerCase();
          }
        )) continue;
        const V = L.operations.filter(
          (I) => {
            var F, D;
            return I.type === "SOURCE_TRANSFER" && ((D = (F = I.account) == null ? void 0 : F.address) == null ? void 0 : D.toLowerCase()) === t.toLowerCase();
          }
        );
        for (const I of V) {
          const F = L.operations.filter(
            (D) => {
              var W, G;
              return D.type === "DESTINATION_TRANSFER" && ((G = (W = D.account) == null ? void 0 : W.address) == null ? void 0 : G.toLowerCase()) !== t.toLowerCase();
            }
          );
          for (const D of F)
            i.push({
              type: "send",
              amount: ((S = D.amount) == null ? void 0 : S.value) || "0",
              timestamp: Q,
              address: (E = D.account) == null ? void 0 : E.address,
              txid: K,
              pending: !0
            });
        }
        const O = L.operations.filter(
          (I) => {
            var F, D;
            return I.type === "DESTINATION_TRANSFER" && ((D = (F = I.account) == null ? void 0 : F.address) == null ? void 0 : D.toLowerCase()) === t.toLowerCase();
          }
        );
        for (const I of O) {
          const F = L.operations.find((D) => D.type === "SOURCE_TRANSFER");
          F && ((T = (k = F.account) == null ? void 0 : k.address) == null ? void 0 : T.toLowerCase()) !== t.toLowerCase() && i.push({
            type: "receive",
            amount: ((R = I.amount) == null ? void 0 : R.value) || "0",
            timestamp: Q,
            address: F ? (z = F.account) == null ? void 0 : z.address : "Unknown",
            txid: K,
            pending: !0
          });
        }
      }
  } catch {
  }
  const c = [...n, ...o, ...i];
  return c.sort((H, L) => L.timestamp - H.timestamp), c;
}
function f2(e) {
  const [r, t] = ct([]), [n, o] = ct(!1), i = async () => {
    o(!0), t(await jl(e)), o(!1);
  };
  return Ir(() => {
    e != null && e.tag && i();
  }, [e == null ? void 0 : e.tag]), { transactions: r, loading: n, refresh: i };
}
class d2 {
  getBalance(r) {
    throw new Error("Method not implemented.");
  }
  getAccountBalance(r) {
    throw new Error("Method not implemented.");
  }
  getMempoolTransactions() {
    throw new Error("Method not implemented.");
  }
  getMempoolTransaction(r) {
    throw new Error("Method not implemented.");
  }
  waitForTransaction(r, t, n) {
    throw new Error("Method not implemented.");
  }
  getNetworkOptions() {
    throw new Error("Method not implemented.");
  }
  getBlock(r) {
    throw new Error("Method not implemented.");
  }
  getBlockTransaction(r, t) {
    throw new Error("Method not implemented.");
  }
  submit(r) {
    throw new Error("Method not implemented.");
  }
  derive(r, t) {
    throw new Error("Method not implemented.");
  }
  preprocess(r, t) {
    throw new Error("Method not implemented.");
  }
  metadata(r, t) {
    throw new Error("Method not implemented.");
  }
  payloads(r, t, n) {
    throw new Error("Method not implemented.");
  }
  combine(r, t) {
    throw new Error("Method not implemented.");
  }
  parse(r, t) {
    throw new Error("Method not implemented.");
  }
  searchTransactionsByAddress(r, t) {
    throw new Error("Method not implemented.");
  }
  searchTransactionsByBlock(r, t) {
    throw new Error("Method not implemented.");
  }
  searchTransactionsByTxId(r, t) {
    throw new Error("Method not implemented.");
  }
  getEventsBlocks(r) {
    throw new Error("Method not implemented.");
  }
  getStatsRichlist(r) {
    throw new Error("Method not implemented.");
  }
  async resolveTag(r) {
    throw new Error("Method not implemented.");
  }
  async pushTransaction(r, t) {
    throw new Error("Method not implemented.");
  }
  async activateTag(r) {
    throw new Error("Method not implemented.");
  }
}
function $l(e) {
  return crypto.getRandomValues(new Uint8Array(e));
}
function Kl(e = 32) {
  return $l(e);
}
function Tn(e) {
  e.fill(0);
}
var Sn = /* @__PURE__ */ ((e) => (e[e.BIG_ENDIAN = 0] = "BIG_ENDIAN", e[e.LITTLE_ENDIAN = 1] = "LITTLE_ENDIAN", e))(Sn || {});
class nr {
  constructor(r) {
    this.buf = new Uint8Array(r), this.pos = 0, this.byteOrder = 0;
  }
  /**
   * Creates a new ByteBuffer with the given capacity
   */
  static allocate(r) {
    return new nr(r);
  }
  /**
   * Creates a new ByteBuffer that wraps the given array
   */
  static wrap(r) {
    const t = new nr(r.length);
    return t.buf.set(r), t;
  }
  /**
   * Sets this buffer's byte order
   */
  order(r) {
    return this.byteOrder = r, this;
  }
  /**
   * Sets or gets this buffer's position
   */
  position(r) {
    if (r === void 0)
      return this.pos;
    if (r < 0 || r > this.buf.length)
      throw new Error("Invalid position, position: " + r + ", length: " + this.buf.length);
    return this.pos = r, this;
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
  put(r, t, n) {
    if (typeof r == "number") {
      if (this.pos >= this.buf.length)
        throw new Error("Buffer overflow");
      return this.buf[this.pos++] = r & 255, this;
    }
    const o = t || 0, i = n || r.length;
    if (o < 0 || o > r.length)
      throw new Error("Invalid offset");
    if (i < 0 || o + i > r.length)
      throw new Error("Invalid length");
    if (this.pos + i > this.buf.length)
      throw new Error("Buffer overflow");
    return this.buf.set(r.subarray(o, o + i), this.pos), this.pos += i, this;
  }
  /**
   * Writes an integer into this buffer
   */
  putInt(r) {
    if (this.pos + 4 > this.buf.length)
      throw new Error("Buffer overflow");
    return this.byteOrder === 0 ? (this.buf[this.pos++] = r >>> 24 & 255, this.buf[this.pos++] = r >>> 16 & 255, this.buf[this.pos++] = r >>> 8 & 255, this.buf[this.pos++] = r & 255) : (this.buf[this.pos++] = r & 255, this.buf[this.pos++] = r >>> 8 & 255, this.buf[this.pos++] = r >>> 16 & 255, this.buf[this.pos++] = r >>> 24 & 255), this;
  }
  /**
   * Gets bytes from the buffer into the destination array
   */
  get(r) {
    if (this.pos + r.length > this.buf.length)
      throw new Error("Buffer underflow");
    for (let t = 0; t < r.length; t++)
      r[t] = this.buf[this.pos++];
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
const Fi = "0123456789abcdef";
class Xe {
  /**
   * Create a copy of a byte array
   */
  static copyOf(r, t) {
    const n = new Uint8Array(t);
    return n.set(r.slice(0, t)), n;
  }
  /**
   * Convert a hexadecimal string to a byte array
   * @param hex The hexadecimal string to convert
   */
  static hexToBytes(r) {
    let t = r.toLowerCase();
    t.startsWith("0x") && (t = t.slice(2)), t.length % 2 !== 0 && (t = "0" + t);
    const n = new Uint8Array(t.length / 2);
    for (let o = 0; o < t.length; o += 2)
      n[o / 2] = parseInt(t.slice(o, o + 2), 16);
    return n;
  }
  /**
   * Compares two byte arrays
   */
  static compareBytes(r, t) {
    if (r.length !== t.length)
      return !1;
    for (let n = 0; n < r.length; n++)
      if (r[n] !== t[n])
        return !1;
    return !0;
  }
  /**
   * Reads little-endian unsigned values from a buffer
   */
  static readLittleEndianUnsigned(r, t = 8) {
    const n = new Uint8Array(t);
    r.get(n);
    let o = 0n;
    for (let i = t - 1; i >= 0; i--)
      o = o << 8n | BigInt(n[i]);
    return o;
  }
  /**
   * Trims address for display
   */
  static trimAddress(r) {
    return `${r.substring(0, 32)}...${r.substring(r.length - 24)}`;
  }
  /**
   * Converts number to little-endian bytes
   */
  static numberToLittleEndian(r, t) {
    const n = new Uint8Array(t);
    let o = r;
    for (let i = 0; i < t; i++)
      n[i] = o & 255, o = o >>> 8;
    return n;
  }
  /**
   * Converts byte array to little-endian
   */
  static bytesToLittleEndian(r) {
    const t = new Uint8Array(r.length);
    for (let n = 0; n < r.length; n++)
      t[n] = r[r.length - 1 - n];
    return t;
  }
  /**
   * Fits byte array or string to specified length
   */
  static fit(r, t) {
    if (typeof r == "string") {
      const i = BigInt(r), c = new Uint8Array(t);
      let s = i;
      for (let u = 0; u < t; u++)
        c[u] = Number(s & 0xffn), s >>= 8n;
      return c;
    }
    const n = new Uint8Array(t), o = Math.min(r.length, t);
    return n.set(r.subarray(0, o)), n;
  }
  /**
   * Convert a byte array to its hexadecimal string representation
   * @param bytes The byte array to convert
   * @param offset Optional starting offset in the byte array
   * @param length Optional number of bytes to convert
   */
  static bytesToHex(r, t = 0, n = r.length) {
    const o = new Array(n * 2);
    for (let i = 0; i < n; i++) {
      const c = r[i + t] & 255;
      o[i * 2] = Fi[c >>> 4], o[i * 2 + 1] = Fi[c & 15];
    }
    return o.join("");
  }
  /**
   * Convert a number to a byte array of specified length
   * @param value The number to convert
   * @param length The desired length of the resulting byte array
   */
  static toBytes(r, t) {
    const n = r.toString(16).padStart(t * 2, "0");
    return Xe.hexToBytes(n);
  }
  /**
   * Convert a byte array to little-endian format
   * @param value The byte array to convert
   * @param offset Optional starting offset
   * @param length Optional number of bytes to convert
   */
  static toLittleEndian(r, t = 0, n = r.length) {
    const o = new Uint8Array(n);
    o.set(r.slice(t, t + n));
    for (let i = 0; i < o.length >> 1; i++) {
      const c = o[i];
      o[i] = o[o.length - i - 1], o[o.length - i - 1] = c;
    }
    return o;
  }
  /**
   * Clear a byte array by filling it with zeros
   */
  static clear(r) {
    r.fill(0);
  }
  /**
       * Compare two byte arrays for equality
       */
  static areEqual(r, t) {
    if (r.length !== t.length) return !1;
    for (let n = 0; n < r.length; n++)
      if (r[n] !== t[n]) return !1;
    return !0;
  }
}
function Ti(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error("positive integer expected, got " + e);
}
function Vl(e) {
  return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function ti(e, ...r) {
  if (!Vl(e))
    throw new Error("Uint8Array expected");
  if (r.length > 0 && !r.includes(e.length))
    throw new Error("Uint8Array expected of length " + r + ", got length=" + e.length);
}
function Rn(e, r = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (r && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function zs(e, r) {
  ti(e);
  const t = r.outputLen;
  if (e.length < t)
    throw new Error("digestInto() expects output buffer of length at least " + t);
}
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const ql = (e) => new Uint32Array(e.buffer, e.byteOffset, Math.floor(e.byteLength / 4)), _o = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), qe = (e, r) => e << 32 - r | e >>> r, hn = (e, r) => e << r | e >>> 32 - r >>> 0, Ri = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68, Gl = (e) => e << 24 & 4278190080 | e << 8 & 16711680 | e >>> 8 & 65280 | e >>> 24 & 255;
function Oi(e) {
  for (let r = 0; r < e.length; r++)
    e[r] = Gl(e[r]);
}
function Zl(e) {
  if (typeof e != "string")
    throw new Error("utf8ToBytes expected string, got " + typeof e);
  return new Uint8Array(new TextEncoder().encode(e));
}
function ri(e) {
  return typeof e == "string" && (e = Zl(e)), ti(e), e;
}
class Ls {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function ni(e) {
  const r = (n) => e().update(ri(n)).digest(), t = e();
  return r.outputLen = t.outputLen, r.blockLen = t.blockLen, r.create = () => e(), r;
}
function Yl(e, r, t, n) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(r, t, n);
  const o = BigInt(32), i = BigInt(4294967295), c = Number(t >> o & i), s = Number(t & i), u = n ? 4 : 0, a = n ? 0 : 4;
  e.setUint32(r + u, c, n), e.setUint32(r + a, s, n);
}
const Xl = (e, r, t) => e & r ^ ~e & t, Jl = (e, r, t) => e & r ^ e & t ^ r & t;
class Us extends Ls {
  constructor(r, t, n, o) {
    super(), this.blockLen = r, this.outputLen = t, this.padOffset = n, this.isLE = o, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(r), this.view = _o(this.buffer);
  }
  update(r) {
    Rn(this);
    const { view: t, buffer: n, blockLen: o } = this;
    r = ri(r);
    const i = r.length;
    for (let c = 0; c < i; ) {
      const s = Math.min(o - this.pos, i - c);
      if (s === o) {
        const u = _o(r);
        for (; o <= i - c; c += o)
          this.process(u, c);
        continue;
      }
      n.set(r.subarray(c, c + s), this.pos), this.pos += s, c += s, this.pos === o && (this.process(t, 0), this.pos = 0);
    }
    return this.length += r.length, this.roundClean(), this;
  }
  digestInto(r) {
    Rn(this), zs(r, this), this.finished = !0;
    const { buffer: t, view: n, blockLen: o, isLE: i } = this;
    let { pos: c } = this;
    t[c++] = 128, this.buffer.subarray(c).fill(0), this.padOffset > o - c && (this.process(n, 0), c = 0);
    for (let h = c; h < o; h++)
      t[h] = 0;
    Yl(n, o - 8, BigInt(this.length * 8), i), this.process(n, 0);
    const s = _o(r), u = this.outputLen;
    if (u % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const a = u / 4, l = this.get();
    if (a > l.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let h = 0; h < a; h++)
      s.setUint32(4 * h, l[h], i);
  }
  digest() {
    const { buffer: r, outputLen: t } = this;
    this.digestInto(r);
    const n = r.slice(0, t);
    return this.destroy(), n;
  }
  _cloneInto(r) {
    r || (r = new this.constructor()), r.set(...this.get());
    const { blockLen: t, buffer: n, length: o, finished: i, destroyed: c, pos: s } = this;
    return r.length = o, r.pos = s, r.finished = i, r.destroyed = c, o % t && r.buffer.set(n), r;
  }
}
const Ql = /* @__PURE__ */ new Uint32Array([
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
]), pt = /* @__PURE__ */ new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), gt = /* @__PURE__ */ new Uint32Array(64);
class eu extends Us {
  constructor() {
    super(64, 32, 8, !1), this.A = pt[0] | 0, this.B = pt[1] | 0, this.C = pt[2] | 0, this.D = pt[3] | 0, this.E = pt[4] | 0, this.F = pt[5] | 0, this.G = pt[6] | 0, this.H = pt[7] | 0;
  }
  get() {
    const { A: r, B: t, C: n, D: o, E: i, F: c, G: s, H: u } = this;
    return [r, t, n, o, i, c, s, u];
  }
  // prettier-ignore
  set(r, t, n, o, i, c, s, u) {
    this.A = r | 0, this.B = t | 0, this.C = n | 0, this.D = o | 0, this.E = i | 0, this.F = c | 0, this.G = s | 0, this.H = u | 0;
  }
  process(r, t) {
    for (let h = 0; h < 16; h++, t += 4)
      gt[h] = r.getUint32(t, !1);
    for (let h = 16; h < 64; h++) {
      const d = gt[h - 15], f = gt[h - 2], x = qe(d, 7) ^ qe(d, 18) ^ d >>> 3, v = qe(f, 17) ^ qe(f, 19) ^ f >>> 10;
      gt[h] = v + gt[h - 7] + x + gt[h - 16] | 0;
    }
    let { A: n, B: o, C: i, D: c, E: s, F: u, G: a, H: l } = this;
    for (let h = 0; h < 64; h++) {
      const d = qe(s, 6) ^ qe(s, 11) ^ qe(s, 25), f = l + d + Xl(s, u, a) + Ql[h] + gt[h] | 0, x = (qe(n, 2) ^ qe(n, 13) ^ qe(n, 22)) + Jl(n, o, i) | 0;
      l = a, a = u, u = s, s = c + f | 0, c = i, i = o, o = n, n = f + x | 0;
    }
    n = n + this.A | 0, o = o + this.B | 0, i = i + this.C | 0, c = c + this.D | 0, s = s + this.E | 0, u = u + this.F | 0, a = a + this.G | 0, l = l + this.H | 0, this.set(n, o, i, c, s, u, a, l);
  }
  roundClean() {
    gt.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
const tu = /* @__PURE__ */ ni(() => new eu()), xn = /* @__PURE__ */ BigInt(2 ** 32 - 1), Ii = /* @__PURE__ */ BigInt(32);
function ru(e, r = !1) {
  return r ? { h: Number(e & xn), l: Number(e >> Ii & xn) } : { h: Number(e >> Ii & xn) | 0, l: Number(e & xn) | 0 };
}
function nu(e, r = !1) {
  let t = new Uint32Array(e.length), n = new Uint32Array(e.length);
  for (let o = 0; o < e.length; o++) {
    const { h: i, l: c } = ru(e[o], r);
    [t[o], n[o]] = [i, c];
  }
  return [t, n];
}
const ou = (e, r, t) => e << t | r >>> 32 - t, iu = (e, r, t) => r << t | e >>> 32 - t, au = (e, r, t) => r << t - 32 | e >>> 64 - t, su = (e, r, t) => e << t - 32 | r >>> 64 - t, Ms = [], Ps = [], Ws = [], cu = /* @__PURE__ */ BigInt(0), _r = /* @__PURE__ */ BigInt(1), lu = /* @__PURE__ */ BigInt(2), uu = /* @__PURE__ */ BigInt(7), fu = /* @__PURE__ */ BigInt(256), du = /* @__PURE__ */ BigInt(113);
for (let e = 0, r = _r, t = 1, n = 0; e < 24; e++) {
  [t, n] = [n, (2 * t + 3 * n) % 5], Ms.push(2 * (5 * n + t)), Ps.push((e + 1) * (e + 2) / 2 % 64);
  let o = cu;
  for (let i = 0; i < 7; i++)
    r = (r << _r ^ (r >> uu) * du) % fu, r & lu && (o ^= _r << (_r << /* @__PURE__ */ BigInt(i)) - _r);
  Ws.push(o);
}
const [hu, xu] = /* @__PURE__ */ nu(Ws, !0), Ni = (e, r, t) => t > 32 ? au(e, r, t) : ou(e, r, t), Hi = (e, r, t) => t > 32 ? su(e, r, t) : iu(e, r, t);
function pu(e, r = 24) {
  const t = new Uint32Array(10);
  for (let n = 24 - r; n < 24; n++) {
    for (let c = 0; c < 10; c++)
      t[c] = e[c] ^ e[c + 10] ^ e[c + 20] ^ e[c + 30] ^ e[c + 40];
    for (let c = 0; c < 10; c += 2) {
      const s = (c + 8) % 10, u = (c + 2) % 10, a = t[u], l = t[u + 1], h = Ni(a, l, 1) ^ t[s], d = Hi(a, l, 1) ^ t[s + 1];
      for (let f = 0; f < 50; f += 10)
        e[c + f] ^= h, e[c + f + 1] ^= d;
    }
    let o = e[2], i = e[3];
    for (let c = 0; c < 24; c++) {
      const s = Ps[c], u = Ni(o, i, s), a = Hi(o, i, s), l = Ms[c];
      o = e[l], i = e[l + 1], e[l] = u, e[l + 1] = a;
    }
    for (let c = 0; c < 50; c += 10) {
      for (let s = 0; s < 10; s++)
        t[s] = e[c + s];
      for (let s = 0; s < 10; s++)
        e[c + s] ^= ~t[(s + 2) % 10] & t[(s + 4) % 10];
    }
    e[0] ^= hu[n], e[1] ^= xu[n];
  }
  t.fill(0);
}
class oi extends Ls {
  // NOTE: we accept arguments in bytes instead of bits here.
  constructor(r, t, n, o = !1, i = 24) {
    if (super(), this.blockLen = r, this.suffix = t, this.outputLen = n, this.enableXOF = o, this.rounds = i, this.pos = 0, this.posOut = 0, this.finished = !1, this.destroyed = !1, Ti(n), 0 >= this.blockLen || this.blockLen >= 200)
      throw new Error("Sha3 supports only keccak-f1600 function");
    this.state = new Uint8Array(200), this.state32 = ql(this.state);
  }
  keccak() {
    Ri || Oi(this.state32), pu(this.state32, this.rounds), Ri || Oi(this.state32), this.posOut = 0, this.pos = 0;
  }
  update(r) {
    Rn(this);
    const { blockLen: t, state: n } = this;
    r = ri(r);
    const o = r.length;
    for (let i = 0; i < o; ) {
      const c = Math.min(t - this.pos, o - i);
      for (let s = 0; s < c; s++)
        n[this.pos++] ^= r[i++];
      this.pos === t && this.keccak();
    }
    return this;
  }
  finish() {
    if (this.finished)
      return;
    this.finished = !0;
    const { state: r, suffix: t, pos: n, blockLen: o } = this;
    r[n] ^= t, t & 128 && n === o - 1 && this.keccak(), r[o - 1] ^= 128, this.keccak();
  }
  writeInto(r) {
    Rn(this, !1), ti(r), this.finish();
    const t = this.state, { blockLen: n } = this;
    for (let o = 0, i = r.length; o < i; ) {
      this.posOut >= n && this.keccak();
      const c = Math.min(n - this.posOut, i - o);
      r.set(t.subarray(this.posOut, this.posOut + c), o), this.posOut += c, o += c;
    }
    return r;
  }
  xofInto(r) {
    if (!this.enableXOF)
      throw new Error("XOF is not possible for this instance");
    return this.writeInto(r);
  }
  xof(r) {
    return Ti(r), this.xofInto(new Uint8Array(r));
  }
  digestInto(r) {
    if (zs(r, this), this.finished)
      throw new Error("digest() was already called");
    return this.writeInto(r), this.destroy(), r;
  }
  digest() {
    return this.digestInto(new Uint8Array(this.outputLen));
  }
  destroy() {
    this.destroyed = !0, this.state.fill(0);
  }
  _cloneInto(r) {
    const { blockLen: t, suffix: n, outputLen: o, rounds: i, enableXOF: c } = this;
    return r || (r = new oi(t, n, o, c, i)), r.state32.set(this.state32), r.pos = this.pos, r.posOut = this.posOut, r.finished = this.finished, r.rounds = i, r.suffix = n, r.outputLen = o, r.enableXOF = c, r.destroyed = this.destroyed, r;
  }
}
const gu = (e, r, t) => ni(() => new oi(r, e, t)), yu = /* @__PURE__ */ gu(6, 72, 512 / 8), wu = /* @__PURE__ */ new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), js = /* @__PURE__ */ new Uint8Array(new Array(16).fill(0).map((e, r) => r)), vu = /* @__PURE__ */ js.map((e) => (9 * e + 5) % 16);
let ii = [js], ai = [vu];
for (let e = 0; e < 4; e++)
  for (let r of [ii, ai])
    r.push(r[e].map((t) => wu[t]));
const $s = /* @__PURE__ */ [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), _u = /* @__PURE__ */ ii.map((e, r) => e.map((t) => $s[r][t])), bu = /* @__PURE__ */ ai.map((e, r) => e.map((t) => $s[r][t])), mu = /* @__PURE__ */ new Uint32Array([
  0,
  1518500249,
  1859775393,
  2400959708,
  2840853838
]), Eu = /* @__PURE__ */ new Uint32Array([
  1352829926,
  1548603684,
  1836072691,
  2053994217,
  0
]);
function zi(e, r, t, n) {
  return e === 0 ? r ^ t ^ n : e === 1 ? r & t | ~r & n : e === 2 ? (r | ~t) ^ n : e === 3 ? r & n | t & ~n : r ^ (t | ~n);
}
const pn = /* @__PURE__ */ new Uint32Array(16);
class Au extends Us {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: r, h1: t, h2: n, h3: o, h4: i } = this;
    return [r, t, n, o, i];
  }
  set(r, t, n, o, i) {
    this.h0 = r | 0, this.h1 = t | 0, this.h2 = n | 0, this.h3 = o | 0, this.h4 = i | 0;
  }
  process(r, t) {
    for (let f = 0; f < 16; f++, t += 4)
      pn[f] = r.getUint32(t, !0);
    let n = this.h0 | 0, o = n, i = this.h1 | 0, c = i, s = this.h2 | 0, u = s, a = this.h3 | 0, l = a, h = this.h4 | 0, d = h;
    for (let f = 0; f < 5; f++) {
      const x = 4 - f, v = mu[f], w = Eu[f], _ = ii[f], p = ai[f], g = _u[f], y = bu[f];
      for (let b = 0; b < 16; b++) {
        const A = hn(n + zi(f, i, s, a) + pn[_[b]] + v, g[b]) + h | 0;
        n = h, h = a, a = hn(s, 10) | 0, s = i, i = A;
      }
      for (let b = 0; b < 16; b++) {
        const A = hn(o + zi(x, c, u, l) + pn[p[b]] + w, y[b]) + d | 0;
        o = d, d = l, l = hn(u, 10) | 0, u = c, c = A;
      }
    }
    this.set(this.h1 + s + l | 0, this.h2 + a + d | 0, this.h3 + h + o | 0, this.h4 + n + c | 0, this.h0 + i + u | 0);
  }
  roundClean() {
    pn.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const Bu = /* @__PURE__ */ ni(() => new Au());
class $e {
  constructor(r = "sha256") {
    this.algorithm = r, this.hasher = this.createHasher(r);
  }
  createHasher(r) {
    switch (r.toLowerCase()) {
      case "sha256":
        return tu.create();
      case "sha3-512":
        return yu.create();
      case "ripemd160":
        return Bu.create();
      default:
        throw new Error(`Unsupported hash algorithm: ${r}`);
    }
  }
  /**
   * Updates the hash with the given data
   */
  update(r, t = 0, n = r.length) {
    if (t < 0 || t > r.length)
      throw new Error("Invalid offset");
    if (n < 0 || t + n > r.length)
      throw new Error("Invalid length");
    const o = r.subarray(t, t + n);
    this.hasher.update(o);
  }
  /**
   * Returns the final hash value
   */
  digest() {
    const r = this.hasher.digest();
    return this.hasher = this.createHasher(this.algorithm), r;
  }
  static hash(r, t, n) {
    const o = new $e();
    return t !== void 0 && n !== void 0 ? o.update(new Uint8Array(r.subarray(t, t + n))) : o.update(new Uint8Array(r)), o.digest();
  }
  static hashWith(r, t) {
    const n = new $e(r);
    return n.update(t), n.digest();
  }
}
const S0 = class {
  /**
   * Set chain address in the address buffer
   */
  static setChainAddr(r, t) {
    r.position(20), r.putInt(t);
  }
  /**
   * Set hash address in the address buffer
   */
  static setHashAddr(r, t) {
    r.position(24), r.putInt(t);
  }
  /**
   * Set key and mask in the address buffer
   */
  static setKeyAndMask(r, t) {
    r.position(28), r.putInt(t);
  }
  /**
   * Convert address buffer to bytes in little-endian format
   */
  static addrToBytes(r) {
    r.position(0);
    const t = new Uint8Array(r.capacity());
    for (let n = 0; n < t.length; n += 4) {
      const o = r.get_(), i = r.get_(), c = r.get_(), s = r.get_();
      t[n] = s, t[n + 1] = c, t[n + 2] = i, t[n + 3] = o;
    }
    return t;
  }
  /**
   * PRF function
   */
  static prf(r, t, n, o) {
    const i = new Uint8Array(96), c = new Uint8Array(32);
    c[31] = this.XMSS_HASH_PADDING_PRF, i.set(c, 0), i.set(o, 32), i.set(n, 64);
    const s = new $e();
    s.update(i);
    const u = s.digest();
    return r.set(u, t), r;
  }
  /**
   * F hash function
   */
  static thashF(r, t, n, o, i, c) {
    const s = new Uint8Array(96), u = new Uint8Array(32);
    u[31] = this.XMSS_HASH_PADDING_F, s.set(u, 0), this.setKeyAndMask(c, 0);
    let a = this.addrToBytes(c);
    this.prf(s, 32, a, i), this.setKeyAndMask(c, 1), a = this.addrToBytes(c);
    const l = new Uint8Array(32);
    this.prf(l, 0, a, i);
    for (let f = 0; f < 32; f++)
      s[64 + f] = n[f + o] ^ l[f];
    const h = new $e();
    h.update(s);
    const d = h.digest();
    r.set(d, t);
  }
};
S0.XMSS_HASH_PADDING_F = 0, S0.XMSS_HASH_PADDING_PRF = 3;
let Qt = S0;
const Ks = class Ar {
  /**
   * Gets the tag from an address
   */
  static getTag(r) {
    if (r.length !== 2208)
      throw new Error("Invalid address length");
    const t = new Uint8Array(Ar.TAG_LENGTH);
    return t.set(r.subarray(r.length - Ar.TAG_LENGTH)), t;
  }
  /**
   * Checks if a tag is all zeros
   */
  static isZero(r) {
    return !r || r.length !== Ar.TAG_LENGTH ? !1 : r.every((t) => t === 0);
  }
  /**
   * Validates a tag
   */
  static isValid(r) {
    return !(!r || r.length !== Ar.TAG_LENGTH);
  }
  /**
   * Tags an address with the specified tag
   */
  static tag(r, t) {
    if (!this.isValid(t))
      throw new Error("Invalid tag");
    if (r.length !== 2208)
      throw new Error("Invalid address length");
    if (t.length !== 12)
      throw new Error("Invalid tag length");
    const n = new Uint8Array(r);
    return n.set(t, n.length - t.length), n;
  }
};
Ks.TAG_LENGTH = 12;
let Li = Ks;
const it = class Ye {
  /**
   * Generates chains for WOTS
   */
  static gen_chain(r, t, n, o, i, c, s, u) {
    r.set(n.subarray(o, o + Ye.PARAMSN), t);
    for (let a = i; a < i + c && a < 16; a++)
      Qt.setHashAddr(u, a), Qt.thashF(r, t, r, t, s, u);
  }
  /**
   * Expands seed into WOTS private key
   */
  static expand_seed(r, t) {
    for (let n = 0; n < Ye.WOTSLEN; n++) {
      const o = Xe.toBytes(n, 32);
      Qt.prf(r, n * 32, o, t);
    }
  }
  /**
   * Converts message to base w (convenience overload)
   */
  static base_w(r, t) {
    return this.base_w_(r, t, 0, t.length);
  }
  /**
   * Converts message to base w
   */
  static base_w_(r, t, n = 0, o = t.length) {
    let i = 0, c = 0, s = 0, u = 0;
    for (let a = 0; a < o; a++)
      u === 0 && (s = r[i++], u += 8), u -= 4, t[c++ + n] = s >> u & 15;
    return t;
  }
  /**
   * Computes WOTS checksum
   */
  static wotsChecksum(r, t) {
    let n = 0;
    for (let i = 0; i < 64; i++)
      n += 15 - r[i];
    n <<= 4;
    const o = new Uint8Array(2);
    return o[0] = n >> 8 & 255, o[1] = n & 255, this.base_w_(o, r, t, r.length - t);
  }
  /**
   * Computes chain lengths
   */
  static chain_lengths(r, t) {
    const n = this.base_w_(r, t, 0, 64);
    return this.wotsChecksum(n, 64);
  }
  /**
   * Generates WOTS public key
   */
  static wots_pkgen(r, t, n, o, i) {
    this.expand_seed(r, t);
    const c = nr.wrap(i);
    c.order(Sn.LITTLE_ENDIAN);
    for (let s = 0; s < Ye.WOTSLEN; s++)
      Qt.setChainAddr(c, s), this.gen_chain(r, s * 32, r, s * 32, 0, 15, n.subarray(o), c);
  }
  /**
   * Signs a message using WOTS
   */
  static wots_sign(r, t, n, o, i, c) {
    const s = new Array(Ye.WOTSLEN);
    this.chain_lengths(t, s), this.expand_seed(r, n);
    const u = nr.wrap(c);
    u.order(Sn.LITTLE_ENDIAN);
    for (let a = 0; a < Ye.WOTSLEN; a++)
      Qt.setChainAddr(u, a), this.gen_chain(r, a * 32, r, a * 32, 0, s[a], o.subarray(i), u);
  }
  /**
   * Verifies a WOTS signature
   */
  static wots_pk_from_sig(r, t, n, o) {
    const i = new Uint8Array(Ye.WOTSSIGBYTES), c = new Array(Ye.WOTSLEN), s = new Uint8Array(o), u = nr.wrap(s);
    u.order(Sn.LITTLE_ENDIAN), this.chain_lengths(t, c);
    for (let a = 0; a < Ye.WOTSLEN; a++)
      Qt.setChainAddr(u, a), this.gen_chain(i, a * 32, r, a * 32, c[a], 15 - c[a], n, u);
    return i;
  }
  /**
   * Generates a WOTS address using the componentsGenerator. 
   * Note:: use you own componentsGenerator that fills in deterministic bytes if you want to generate a specific address
   */
  static generateAddress(r, t, n) {
    if (!n)
      throw new Error("Invalid componentsGenerator");
    if (t.length !== 32)
      throw new Error("Invalid secret length");
    if (r !== null && r.length !== 12)
      throw new Error("Invalid tag");
    const o = new Uint8Array(2144), i = n(t);
    Ye.wots_pkgen(o, i.private_seed, i.public_seed, 0, i.addr_seed);
    const c = new Uint8Array(2208);
    c.set(o, 0), c.set(i.public_seed, 2144), c.set(i.addr_seed, 2176);
    const s = r ? Li.tag(c, r) : c;
    for (let u = 0; u < 10; u++)
      if (!this.isValid(i.private_seed, s, gn))
        throw new Error("Invalid WOTS");
    return s;
  }
  /**
   * Validates WOTS components
   */
  static isValidWithComponents(r, t, n, o, i) {
    if (r.length !== 32)
      throw new Error("Invalid secret length");
    if (t.length !== 2144)
      throw new Error("Invalid pk length");
    if (n.length !== 32)
      throw new Error("Invalid pubSeed length");
    if (o.length !== 32)
      throw new Error("Invalid rnd2 length");
    const c = new Uint8Array(32);
    i(c);
    const s = new Uint8Array(2144);
    this.wots_sign(s, c, r, n, 0, o);
    const u = this.wots_pk_from_sig(s, c, n, o);
    return Xe.compareBytes(u, t);
  }
  /**
   * Splits a WOTS address into its components
   */
  static splitAddress(r, t, n, o, i) {
    if (r.length !== 2208)
      throw new Error("Invalid address length");
    if (t.length !== 2144)
      throw new Error("Invalid pk length");
    if (n.length !== 32)
      throw new Error("Invalid pubSeed length");
    if (o.length !== 32)
      throw new Error("Invalid rnd2 length");
    if (i !== null && i.length !== 12)
      throw new Error("Invalid tag length");
    t.set(r.subarray(0, 2144)), n.set(r.subarray(2144, 2176)), o.set(r.subarray(2176, 2208)), i !== null && i.set(o.subarray(20, 32));
  }
  /**
   * Validates a WOTS address using a Random generator
   */
  static isValid(r, t, n = gn) {
    const o = new Uint8Array(2144), i = new Uint8Array(32), c = new Uint8Array(32);
    return this.splitAddress(t, o, i, c, null), this.isValidWithComponents(r, o, i, c, gn);
  }
  /**
   * Generates a random WOTS address using the randomGenerator
   * Note:: use you own randomGenerator that fills in deterministic bytes if you want to generate a specific address
   */
  static generateRandomAddress(r, t, n = gn) {
    if (t.length !== 32)
      throw new Error("Invalid secret length");
    if (r !== null && r.length !== 12)
      throw new Error("Invalid tag");
    const o = new Uint8Array(2208), i = new Uint8Array(32);
    n(o), i.set(o.subarray(2176, 2208)), this.wots_pkgen(o, t, o, 2144, i), o.set(i, 2176);
    const c = r ? Li.tag(o, r) : o;
    for (let s = 0; s < 10; s++)
      if (!this.isValid(t, c, n))
        throw new Error("Invalid WOTS");
    return c;
  }
};
it.WOTSW = 16, it.WOTSLOGW = 4, it.PARAMSN = 32, it.WOTSLEN1 = 64, it.WOTSLEN2 = 3, it.WOTSLEN = 67, it.WOTSSIGBYTES = 2144, it.TXSIGLEN = 2144;
let ae = it;
function gn(e) {
  for (let r = 0; r < e.length; r++)
    e[r] = Math.floor(Math.random() * 256);
}
const Ce = 40, ke = 20, bo = 2144, mo = 8;
class Ut {
  constructor() {
    this.address = new Uint8Array(Ce), this.amount = BigInt(0);
  }
  bytes() {
    const r = new Uint8Array(Ce + mo);
    return r.set(this.address), r.set(this.getAmountBytes(), Ce), r;
  }
  getTag() {
    return this.address.slice(0, ke);
  }
  setTag(r) {
    this.address.set(r.slice(0, ke), 0);
  }
  getAddrHash() {
    return this.address.slice(ke, Ce);
  }
  getAddress() {
    return this.address.slice(0, Ce);
  }
  setAddrHash(r) {
    this.address.set(r.slice(0, ke), ke);
  }
  setAmountBytes(r) {
    this.amount = BigInt(
      new DataView(r.buffer).getBigUint64(0, !0)
    );
  }
  getAmount() {
    return this.amount;
  }
  getAmountBytes() {
    const r = new ArrayBuffer(mo);
    return new DataView(r).setBigUint64(0, this.amount, !0), new Uint8Array(r);
  }
  static wotsAddressFromBytes(r) {
    const t = new Ut();
    if (r.length === bo) {
      const n = this.addrFromWots(r);
      n && (t.setTag(n.slice(0, ke)), t.setAddrHash(n.slice(ke, Ce)));
    } else r.length === Ce ? (t.setTag(r.slice(0, ke)), t.setAddrHash(r.slice(ke, Ce))) : r.length === Ce + mo && (t.setTag(r.slice(0, ke)), t.setAddrHash(r.slice(ke, Ce)), t.setAmountBytes(r.slice(Ce)));
    return t;
  }
  static wotsAddressFromHex(r) {
    const t = Buffer.from(r, "hex");
    return t.length !== Ce ? new Ut() : this.wotsAddressFromBytes(t);
  }
  static addrFromImplicit(r) {
    const t = new Uint8Array(Ce);
    return t.set(r.slice(0, ke), 0), t.set(r.slice(0, Ce - ke), ke), t;
  }
  static addrHashGenerate(r) {
    const t = $e.hashWith("sha3-512", r);
    return $e.hashWith("ripemd160", t);
  }
  static addrFromWots(r) {
    if (r.length !== bo)
      return null;
    const t = this.addrHashGenerate(r.slice(0, bo));
    return this.addrFromImplicit(t);
  }
}
const Cu = [
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
function ku(e, r, t) {
  if (r + t > e.length)
    throw new Error("Offset + length exceeds array bounds");
  let n = 0;
  for (let o = r; o < r + t; o++) {
    const i = e[o] & 255, c = (n >>> 8 ^ i) & 255;
    n = (n << 8 ^ Cu[c]) & 65535;
  }
  return n;
}
function Su(e) {
  if (e.length >= 255)
    throw new TypeError("Alphabet too long");
  const r = new Uint8Array(256);
  for (let a = 0; a < r.length; a++)
    r[a] = 255;
  for (let a = 0; a < e.length; a++) {
    const l = e.charAt(a), h = l.charCodeAt(0);
    if (r[h] !== 255)
      throw new TypeError(l + " is ambiguous");
    r[h] = a;
  }
  const t = e.length, n = e.charAt(0), o = Math.log(t) / Math.log(256), i = Math.log(256) / Math.log(t);
  function c(a) {
    if (a instanceof Uint8Array || (ArrayBuffer.isView(a) ? a = new Uint8Array(a.buffer, a.byteOffset, a.byteLength) : Array.isArray(a) && (a = Uint8Array.from(a))), !(a instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (a.length === 0)
      return "";
    let l = 0, h = 0, d = 0;
    const f = a.length;
    for (; d !== f && a[d] === 0; )
      d++, l++;
    const x = (f - d) * i + 1 >>> 0, v = new Uint8Array(x);
    for (; d !== f; ) {
      let p = a[d], g = 0;
      for (let y = x - 1; (p !== 0 || g < h) && y !== -1; y--, g++)
        p += 256 * v[y] >>> 0, v[y] = p % t >>> 0, p = p / t >>> 0;
      if (p !== 0)
        throw new Error("Non-zero carry");
      h = g, d++;
    }
    let w = x - h;
    for (; w !== x && v[w] === 0; )
      w++;
    let _ = n.repeat(l);
    for (; w < x; ++w)
      _ += e.charAt(v[w]);
    return _;
  }
  function s(a) {
    if (typeof a != "string")
      throw new TypeError("Expected String");
    if (a.length === 0)
      return new Uint8Array();
    let l = 0, h = 0, d = 0;
    for (; a[l] === n; )
      h++, l++;
    const f = (a.length - l) * o + 1 >>> 0, x = new Uint8Array(f);
    for (; a[l]; ) {
      let p = r[a.charCodeAt(l)];
      if (p === 255)
        return;
      let g = 0;
      for (let y = f - 1; (p !== 0 || g < d) && y !== -1; y--, g++)
        p += t * x[y] >>> 0, x[y] = p % 256 >>> 0, p = p / 256 >>> 0;
      if (p !== 0)
        throw new Error("Non-zero carry");
      d = g, l++;
    }
    let v = f - d;
    for (; v !== f && x[v] === 0; )
      v++;
    const w = new Uint8Array(h + (f - v));
    let _ = h;
    for (; v !== f; )
      w[_++] = x[v++];
    return w;
  }
  function u(a) {
    const l = s(a);
    if (l)
      return l;
    throw new Error("Non-base" + t + " character");
  }
  return {
    encode: c,
    decodeUnsafe: s,
    decode: u
  };
}
var Du = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const Fu = Su(Du);
function Tu(e) {
  if (!e) return null;
  if (e.length !== 20) throw new Error("Invalid address tag length");
  const r = ku(e, 0, 20), t = new Uint8Array(22);
  t.set(e);
  const n = [r & 255, r >> 8 & 255];
  return t.set(n, e.length), Fu.encode(t);
}
let Mt = class Vs {
  /**
   * Creates a new WOTS wallet
   */
  constructor({
    name: r = null,
    wots: t = null,
    addrTag: n = null,
    secret: o = null
  }) {
    var i;
    if (o && o.length !== 32)
      throw new Error("Invalid secret length");
    if (n && n.length !== 20)
      throw new Error("Invalid address tag");
    this.name = r, this.wots = t ? new Uint8Array(t) : null, this.addrTag = n ? new Uint8Array(n) : null, this.secret = o ? new Uint8Array(o) : null, this.wotsAddrHex = this.wots ? Xe.bytesToHex(this.wots) : null, this.addrTagHex = this.addrTag ? Xe.bytesToHex(this.addrTag) : null, this.mochimoAddr = this.wots ? Ut.wotsAddressFromBytes(this.wots.slice(0, 2144)) : null, (i = this.mochimoAddr) == null || i.setTag(this.addrTag);
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
    return this.wots ? new Uint8Array(this.wots.slice(0, ae.WOTSSIGBYTES)) : null;
  }
  /**
  * Get the public seed used when generating the wots address
  */
  getWotsPubSeed() {
    return this.wots ? this.wots.subarray(ae.WOTSSIGBYTES, ae.WOTSSIGBYTES + 32) : null;
  }
  /**
  * Get the wots+ address scheme used when generating the address
  */
  getWotsAdrs() {
    return this.wots ? this.wots.subarray(ae.WOTSSIGBYTES + 32, ae.WOTSSIGBYTES + 64) : null;
  }
  /**
   * Get the wots+ tag used when generating the address
   */
  getWotsTag() {
    return this.wots ? this.wots.subarray(ae.WOTSSIGBYTES + 64 - 12, ae.WOTSSIGBYTES + 64) : null;
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
    return this.addrTag ? Tu(this.getAddrTag()) : null;
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
  sign(r) {
    const t = this.secret, n = this.wots;
    if (!t || !n)
      throw new Error("Cannot sign without secret key or address");
    if (t.length !== 32)
      throw new Error("Invalid sourceSeed length, expected 32, got " + t.length);
    if (n.length !== 2208)
      throw new Error("Invalid sourceWots length, expected 2208, got " + n.length);
    n.subarray(0, ae.WOTSSIGBYTES);
    const o = n.subarray(ae.WOTSSIGBYTES, ae.WOTSSIGBYTES + 32), i = n.subarray(ae.WOTSSIGBYTES + 32, ae.WOTSSIGBYTES + 64), c = new Uint8Array(ae.WOTSSIGBYTES);
    return ae.wots_sign(c, r, t, o, 0, i), c;
  }
  /**
   * Verifies whether a signature is valid for a given message
   */
  verify(r, t) {
    if (!this.wots)
      throw new Error("Cannot verify without public key (address)");
    const n = this.wots, o = n.subarray(0, ae.WOTSSIGBYTES), i = n.subarray(ae.WOTSSIGBYTES, ae.WOTSSIGBYTES + 32), c = n.subarray(ae.WOTSSIGBYTES + 32, ae.WOTSSIGBYTES + 64), s = ae.wots_pk_from_sig(t, r, i, c);
    return Xe.areEqual(s, o);
  }
  /**
   * Address components generator used for generating address components for pk generation
   * @param wotsSeed 
   * @returns 
   */
  static componentsGenerator(r) {
    const t = Buffer.from(r).toString("ascii"), n = $e.hash(Buffer.from(t + "seed", "ascii")), o = $e.hash(Buffer.from(t + "publ", "ascii")), i = $e.hash(Buffer.from(t + "addr", "ascii"));
    return {
      private_seed: n,
      public_seed: o,
      addr_seed: i
    };
  }
  clear() {
    this.secret && Xe.clear(this.secret), this.wots && Xe.clear(this.wots), this.addrTag && Xe.clear(this.addrTag), this.addrTagHex && (this.addrTagHex = null), this.wotsAddrHex && (this.wotsAddrHex = null), this.mochimoAddr && (this.mochimoAddr = null);
  }
  toString() {
    let r = "Empty address";
    return this.wotsAddrHex ? r = `${this.wotsAddrHex.substring(0, 32)}...${this.wotsAddrHex.substring(this.wotsAddrHex.length - 24)}` : this.addrTagHex && (r = `tag-${this.addrTagHex}`), r;
  }
  /**
       * Creates a wallet instance
  
       */
  static create(r, t, n, o) {
    if (t.length !== 32)
      throw new Error("Invalid secret length");
    let i = t, c = null;
    const s = Buffer.from("420000000e00000001000000", "hex");
    if (o ? c = ae.generateRandomAddress(s, t, o) : ({ private_seed: i } = this.componentsGenerator(t), c = ae.generateAddress(s, t, this.componentsGenerator)), c.length !== 2208)
      throw new Error("Invalid sourcePK length");
    let u = n;
    if (u || (u = Ut.wotsAddressFromBytes(c.slice(0, 2144)).getTag()), u.length !== 20)
      throw new Error("Invalid tag");
    return new Vs({ name: r, wots: c, addrTag: u, secret: i });
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
function Dr(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error("positive integer expected, got " + e);
}
function Ru(e) {
  return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function Xn(e, ...r) {
  if (!Ru(e))
    throw new Error("Uint8Array expected");
  if (r.length > 0 && !r.includes(e.length))
    throw new Error("Uint8Array expected of length " + r + ", got length=" + e.length);
}
function qs(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Dr(e.outputLen), Dr(e.blockLen);
}
function On(e, r = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (r && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function Ou(e, r) {
  Xn(e);
  const t = r.outputLen;
  if (e.length < t)
    throw new Error("digestInto() expects output buffer of length at least " + t);
}
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Dn = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), Ge = (e, r) => e << 32 - r | e >>> r, Iu = async () => {
};
async function Nu(e, r, t) {
  let n = Date.now();
  for (let o = 0; o < e; o++) {
    t(o);
    const i = Date.now() - n;
    i >= 0 && i < r || (await Iu(), n += i);
  }
}
function Hu(e) {
  if (typeof e != "string")
    throw new Error("utf8ToBytes expected string, got " + typeof e);
  return new Uint8Array(new TextEncoder().encode(e));
}
function zr(e) {
  return typeof e == "string" && (e = Hu(e)), Xn(e), e;
}
class Gs {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function zu(e, r) {
  if (r !== void 0 && {}.toString.call(r) !== "[object Object]")
    throw new Error("Options should be object or undefined");
  return Object.assign(e, r);
}
function Zs(e) {
  const r = (n) => e().update(zr(n)).digest(), t = e();
  return r.outputLen = t.outputLen, r.blockLen = t.blockLen, r.create = () => e(), r;
}
class Ys extends Gs {
  constructor(r, t) {
    super(), this.finished = !1, this.destroyed = !1, qs(r);
    const n = zr(t);
    if (this.iHash = r.create(), typeof this.iHash.update != "function")
      throw new Error("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const o = this.blockLen, i = new Uint8Array(o);
    i.set(n.length > o ? r.create().update(n).digest() : n);
    for (let c = 0; c < i.length; c++)
      i[c] ^= 54;
    this.iHash.update(i), this.oHash = r.create();
    for (let c = 0; c < i.length; c++)
      i[c] ^= 106;
    this.oHash.update(i), i.fill(0);
  }
  update(r) {
    return On(this), this.iHash.update(r), this;
  }
  digestInto(r) {
    On(this), Xn(r, this.outputLen), this.finished = !0, this.iHash.digestInto(r), this.oHash.update(r), this.oHash.digestInto(r), this.destroy();
  }
  digest() {
    const r = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(r), r;
  }
  _cloneInto(r) {
    r || (r = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: t, iHash: n, finished: o, destroyed: i, blockLen: c, outputLen: s } = this;
    return r = r, r.finished = o, r.destroyed = i, r.blockLen = c, r.outputLen = s, r.oHash = t._cloneInto(r.oHash), r.iHash = n._cloneInto(r.iHash), r;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
}
const Xs = (e, r, t) => new Ys(e, r).update(t).digest();
Xs.create = (e, r) => new Ys(e, r);
function Lu(e, r, t, n) {
  qs(e);
  const o = zu({ dkLen: 32, asyncTick: 10 }, n), { c: i, dkLen: c, asyncTick: s } = o;
  if (Dr(i), Dr(c), Dr(s), i < 1)
    throw new Error("PBKDF2: iterations (c) should be >= 1");
  const u = zr(r), a = zr(t), l = new Uint8Array(c), h = Xs.create(e, u), d = h._cloneInto().update(a);
  return { c: i, dkLen: c, asyncTick: s, DK: l, PRF: h, PRFSalt: d };
}
function Uu(e, r, t, n, o) {
  return e.destroy(), r.destroy(), n && n.destroy(), o.fill(0), t;
}
async function Mu(e, r, t, n) {
  const { c: o, dkLen: i, asyncTick: c, DK: s, PRF: u, PRFSalt: a } = Lu(e, r, t, n);
  let l;
  const h = new Uint8Array(4), d = Dn(h), f = new Uint8Array(u.outputLen);
  for (let x = 1, v = 0; v < i; x++, v += u.outputLen) {
    const w = s.subarray(v, v + u.outputLen);
    d.setInt32(0, x, !1), (l = a._cloneInto(l)).update(h).digestInto(f), w.set(f.subarray(0, w.length)), await Nu(o - 1, c, () => {
      u._cloneInto(l).update(f).digestInto(f);
      for (let _ = 0; _ < w.length; _++)
        w[_] ^= f[_];
    });
  }
  return Uu(u, a, s, l, f);
}
function Pu(e, r, t, n) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(r, t, n);
  const o = BigInt(32), i = BigInt(4294967295), c = Number(t >> o & i), s = Number(t & i), u = n ? 4 : 0, a = n ? 0 : 4;
  e.setUint32(r + u, c, n), e.setUint32(r + a, s, n);
}
const Wu = (e, r, t) => e & r ^ ~e & t, ju = (e, r, t) => e & r ^ e & t ^ r & t;
class Js extends Gs {
  constructor(r, t, n, o) {
    super(), this.blockLen = r, this.outputLen = t, this.padOffset = n, this.isLE = o, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(r), this.view = Dn(this.buffer);
  }
  update(r) {
    On(this);
    const { view: t, buffer: n, blockLen: o } = this;
    r = zr(r);
    const i = r.length;
    for (let c = 0; c < i; ) {
      const s = Math.min(o - this.pos, i - c);
      if (s === o) {
        const u = Dn(r);
        for (; o <= i - c; c += o)
          this.process(u, c);
        continue;
      }
      n.set(r.subarray(c, c + s), this.pos), this.pos += s, c += s, this.pos === o && (this.process(t, 0), this.pos = 0);
    }
    return this.length += r.length, this.roundClean(), this;
  }
  digestInto(r) {
    On(this), Ou(r, this), this.finished = !0;
    const { buffer: t, view: n, blockLen: o, isLE: i } = this;
    let { pos: c } = this;
    t[c++] = 128, this.buffer.subarray(c).fill(0), this.padOffset > o - c && (this.process(n, 0), c = 0);
    for (let h = c; h < o; h++)
      t[h] = 0;
    Pu(n, o - 8, BigInt(this.length * 8), i), this.process(n, 0);
    const s = Dn(r), u = this.outputLen;
    if (u % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const a = u / 4, l = this.get();
    if (a > l.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let h = 0; h < a; h++)
      s.setUint32(4 * h, l[h], i);
  }
  digest() {
    const { buffer: r, outputLen: t } = this;
    this.digestInto(r);
    const n = r.slice(0, t);
    return this.destroy(), n;
  }
  _cloneInto(r) {
    r || (r = new this.constructor()), r.set(...this.get());
    const { blockLen: t, buffer: n, length: o, finished: i, destroyed: c, pos: s } = this;
    return r.length = o, r.pos = s, r.finished = i, r.destroyed = c, o % t && r.buffer.set(n), r;
  }
}
const $u = /* @__PURE__ */ new Uint32Array([
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
]), yt = /* @__PURE__ */ new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), wt = /* @__PURE__ */ new Uint32Array(64);
class Ku extends Js {
  constructor() {
    super(64, 32, 8, !1), this.A = yt[0] | 0, this.B = yt[1] | 0, this.C = yt[2] | 0, this.D = yt[3] | 0, this.E = yt[4] | 0, this.F = yt[5] | 0, this.G = yt[6] | 0, this.H = yt[7] | 0;
  }
  get() {
    const { A: r, B: t, C: n, D: o, E: i, F: c, G: s, H: u } = this;
    return [r, t, n, o, i, c, s, u];
  }
  // prettier-ignore
  set(r, t, n, o, i, c, s, u) {
    this.A = r | 0, this.B = t | 0, this.C = n | 0, this.D = o | 0, this.E = i | 0, this.F = c | 0, this.G = s | 0, this.H = u | 0;
  }
  process(r, t) {
    for (let h = 0; h < 16; h++, t += 4)
      wt[h] = r.getUint32(t, !1);
    for (let h = 16; h < 64; h++) {
      const d = wt[h - 15], f = wt[h - 2], x = Ge(d, 7) ^ Ge(d, 18) ^ d >>> 3, v = Ge(f, 17) ^ Ge(f, 19) ^ f >>> 10;
      wt[h] = v + wt[h - 7] + x + wt[h - 16] | 0;
    }
    let { A: n, B: o, C: i, D: c, E: s, F: u, G: a, H: l } = this;
    for (let h = 0; h < 64; h++) {
      const d = Ge(s, 6) ^ Ge(s, 11) ^ Ge(s, 25), f = l + d + Wu(s, u, a) + $u[h] + wt[h] | 0, v = (Ge(n, 2) ^ Ge(n, 13) ^ Ge(n, 22)) + ju(n, o, i) | 0;
      l = a, a = u, u = s, s = c + f | 0, c = i, i = o, o = n, n = f + v | 0;
    }
    n = n + this.A | 0, o = o + this.B | 0, i = i + this.C | 0, c = c + this.D | 0, s = s + this.E | 0, u = u + this.F | 0, a = a + this.G | 0, l = l + this.H | 0, this.set(n, o, i, c, s, u, a, l);
  }
  roundClean() {
    wt.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
const Vu = /* @__PURE__ */ Zs(() => new Ku()), yn = /* @__PURE__ */ BigInt(2 ** 32 - 1), D0 = /* @__PURE__ */ BigInt(32);
function Qs(e, r = !1) {
  return r ? { h: Number(e & yn), l: Number(e >> D0 & yn) } : { h: Number(e >> D0 & yn) | 0, l: Number(e & yn) | 0 };
}
function qu(e, r = !1) {
  let t = new Uint32Array(e.length), n = new Uint32Array(e.length);
  for (let o = 0; o < e.length; o++) {
    const { h: i, l: c } = Qs(e[o], r);
    [t[o], n[o]] = [i, c];
  }
  return [t, n];
}
const Gu = (e, r) => BigInt(e >>> 0) << D0 | BigInt(r >>> 0), Zu = (e, r, t) => e >>> t, Yu = (e, r, t) => e << 32 - t | r >>> t, Xu = (e, r, t) => e >>> t | r << 32 - t, Ju = (e, r, t) => e << 32 - t | r >>> t, Qu = (e, r, t) => e << 64 - t | r >>> t - 32, ef = (e, r, t) => e >>> t - 32 | r << 64 - t, tf = (e, r) => r, rf = (e, r) => e, nf = (e, r, t) => e << t | r >>> 32 - t, of = (e, r, t) => r << t | e >>> 32 - t, af = (e, r, t) => r << t - 32 | e >>> 64 - t, sf = (e, r, t) => e << t - 32 | r >>> 64 - t;
function cf(e, r, t, n) {
  const o = (r >>> 0) + (n >>> 0);
  return { h: e + t + (o / 2 ** 32 | 0) | 0, l: o | 0 };
}
const lf = (e, r, t) => (e >>> 0) + (r >>> 0) + (t >>> 0), uf = (e, r, t, n) => r + t + n + (e / 2 ** 32 | 0) | 0, ff = (e, r, t, n) => (e >>> 0) + (r >>> 0) + (t >>> 0) + (n >>> 0), df = (e, r, t, n, o) => r + t + n + o + (e / 2 ** 32 | 0) | 0, hf = (e, r, t, n, o) => (e >>> 0) + (r >>> 0) + (t >>> 0) + (n >>> 0) + (o >>> 0), xf = (e, r, t, n, o, i) => r + t + n + o + i + (e / 2 ** 32 | 0) | 0, j = {
  fromBig: Qs,
  split: qu,
  toBig: Gu,
  shrSH: Zu,
  shrSL: Yu,
  rotrSH: Xu,
  rotrSL: Ju,
  rotrBH: Qu,
  rotrBL: ef,
  rotr32H: tf,
  rotr32L: rf,
  rotlSH: nf,
  rotlSL: of,
  rotlBH: af,
  rotlBL: sf,
  add: cf,
  add3L: lf,
  add3H: uf,
  add4L: ff,
  add4H: df,
  add5H: xf,
  add5L: hf
}, [pf, gf] = j.split([
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
].map((e) => BigInt(e))), vt = /* @__PURE__ */ new Uint32Array(80), _t = /* @__PURE__ */ new Uint32Array(80);
class yf extends Js {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: r, Al: t, Bh: n, Bl: o, Ch: i, Cl: c, Dh: s, Dl: u, Eh: a, El: l, Fh: h, Fl: d, Gh: f, Gl: x, Hh: v, Hl: w } = this;
    return [r, t, n, o, i, c, s, u, a, l, h, d, f, x, v, w];
  }
  // prettier-ignore
  set(r, t, n, o, i, c, s, u, a, l, h, d, f, x, v, w) {
    this.Ah = r | 0, this.Al = t | 0, this.Bh = n | 0, this.Bl = o | 0, this.Ch = i | 0, this.Cl = c | 0, this.Dh = s | 0, this.Dl = u | 0, this.Eh = a | 0, this.El = l | 0, this.Fh = h | 0, this.Fl = d | 0, this.Gh = f | 0, this.Gl = x | 0, this.Hh = v | 0, this.Hl = w | 0;
  }
  process(r, t) {
    for (let g = 0; g < 16; g++, t += 4)
      vt[g] = r.getUint32(t), _t[g] = r.getUint32(t += 4);
    for (let g = 16; g < 80; g++) {
      const y = vt[g - 15] | 0, b = _t[g - 15] | 0, A = j.rotrSH(y, b, 1) ^ j.rotrSH(y, b, 8) ^ j.shrSH(y, b, 7), m = j.rotrSL(y, b, 1) ^ j.rotrSL(y, b, 8) ^ j.shrSL(y, b, 7), C = vt[g - 2] | 0, S = _t[g - 2] | 0, E = j.rotrSH(C, S, 19) ^ j.rotrBH(C, S, 61) ^ j.shrSH(C, S, 6), k = j.rotrSL(C, S, 19) ^ j.rotrBL(C, S, 61) ^ j.shrSL(C, S, 6), T = j.add4L(m, k, _t[g - 7], _t[g - 16]), R = j.add4H(T, A, E, vt[g - 7], vt[g - 16]);
      vt[g] = R | 0, _t[g] = T | 0;
    }
    let { Ah: n, Al: o, Bh: i, Bl: c, Ch: s, Cl: u, Dh: a, Dl: l, Eh: h, El: d, Fh: f, Fl: x, Gh: v, Gl: w, Hh: _, Hl: p } = this;
    for (let g = 0; g < 80; g++) {
      const y = j.rotrSH(h, d, 14) ^ j.rotrSH(h, d, 18) ^ j.rotrBH(h, d, 41), b = j.rotrSL(h, d, 14) ^ j.rotrSL(h, d, 18) ^ j.rotrBL(h, d, 41), A = h & f ^ ~h & v, m = d & x ^ ~d & w, C = j.add5L(p, b, m, gf[g], _t[g]), S = j.add5H(C, _, y, A, pf[g], vt[g]), E = C | 0, k = j.rotrSH(n, o, 28) ^ j.rotrBH(n, o, 34) ^ j.rotrBH(n, o, 39), T = j.rotrSL(n, o, 28) ^ j.rotrBL(n, o, 34) ^ j.rotrBL(n, o, 39), R = n & i ^ n & s ^ i & s, z = o & c ^ o & u ^ c & u;
      _ = v | 0, p = w | 0, v = f | 0, w = x | 0, f = h | 0, x = d | 0, { h, l: d } = j.add(a | 0, l | 0, S | 0, E | 0), a = s | 0, l = u | 0, s = i | 0, u = c | 0, i = n | 0, c = o | 0;
      const H = j.add3L(E, T, z);
      n = j.add3H(H, S, k, R), o = H | 0;
    }
    ({ h: n, l: o } = j.add(this.Ah | 0, this.Al | 0, n | 0, o | 0)), { h: i, l: c } = j.add(this.Bh | 0, this.Bl | 0, i | 0, c | 0), { h: s, l: u } = j.add(this.Ch | 0, this.Cl | 0, s | 0, u | 0), { h: a, l } = j.add(this.Dh | 0, this.Dl | 0, a | 0, l | 0), { h, l: d } = j.add(this.Eh | 0, this.El | 0, h | 0, d | 0), { h: f, l: x } = j.add(this.Fh | 0, this.Fl | 0, f | 0, x | 0), { h: v, l: w } = j.add(this.Gh | 0, this.Gl | 0, v | 0, w | 0), { h: _, l: p } = j.add(this.Hh | 0, this.Hl | 0, _ | 0, p | 0), this.set(n, o, i, c, s, u, a, l, h, d, f, x, v, w, _, p);
  }
  roundClean() {
    vt.fill(0), _t.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
const wf = /* @__PURE__ */ Zs(() => new yf());
/*! scure-base - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function In(e) {
  return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function ec(e, r) {
  return Array.isArray(r) ? r.length === 0 ? !0 : e ? r.every((t) => typeof t == "string") : r.every((t) => Number.isSafeInteger(t)) : !1;
}
function vf(e) {
  if (typeof e != "function")
    throw new Error("function expected");
  return !0;
}
function Nn(e, r) {
  if (typeof r != "string")
    throw new Error(`${e}: string expected`);
  return !0;
}
function ur(e) {
  if (!Number.isSafeInteger(e))
    throw new Error(`invalid integer: ${e}`);
}
function Hn(e) {
  if (!Array.isArray(e))
    throw new Error("array expected");
}
function zn(e, r) {
  if (!ec(!0, r))
    throw new Error(`${e}: array of strings expected`);
}
function tc(e, r) {
  if (!ec(!1, r))
    throw new Error(`${e}: array of numbers expected`);
}
// @__NO_SIDE_EFFECTS__
function _f(...e) {
  const r = (i) => i, t = (i, c) => (s) => i(c(s)), n = e.map((i) => i.encode).reduceRight(t, r), o = e.map((i) => i.decode).reduce(t, r);
  return { encode: n, decode: o };
}
// @__NO_SIDE_EFFECTS__
function bf(e) {
  const r = typeof e == "string" ? e.split("") : e, t = r.length;
  zn("alphabet", r);
  const n = new Map(r.map((o, i) => [o, i]));
  return {
    encode: (o) => (Hn(o), o.map((i) => {
      if (!Number.isSafeInteger(i) || i < 0 || i >= t)
        throw new Error(`alphabet.encode: digit index outside alphabet "${i}". Allowed: ${e}`);
      return r[i];
    })),
    decode: (o) => (Hn(o), o.map((i) => {
      Nn("alphabet.decode", i);
      const c = n.get(i);
      if (c === void 0)
        throw new Error(`Unknown letter: "${i}". Allowed: ${e}`);
      return c;
    }))
  };
}
// @__NO_SIDE_EFFECTS__
function mf(e = "") {
  return Nn("join", e), {
    encode: (r) => (zn("join.decode", r), r.join(e)),
    decode: (r) => (Nn("join.decode", r), r.split(e))
  };
}
// @__NO_SIDE_EFFECTS__
function Ef(e, r = "=") {
  return ur(e), Nn("padding", r), {
    encode(t) {
      for (zn("padding.encode", t); t.length * e % 8; )
        t.push(r);
      return t;
    },
    decode(t) {
      zn("padding.decode", t);
      let n = t.length;
      if (n * e % 8)
        throw new Error("padding: invalid, string should have whole number of bytes");
      for (; n > 0 && t[n - 1] === r; n--)
        if ((n - 1) * e % 8 === 0)
          throw new Error("padding: invalid, string has too much padding");
      return t.slice(0, n);
    }
  };
}
function F0(e, r, t) {
  if (r < 2)
    throw new Error(`convertRadix: invalid from=${r}, base cannot be less than 2`);
  if (t < 2)
    throw new Error(`convertRadix: invalid to=${t}, base cannot be less than 2`);
  if (Hn(e), !e.length)
    return [];
  let n = 0;
  const o = [], i = Array.from(e, (s) => {
    if (ur(s), s < 0 || s >= r)
      throw new Error(`invalid integer: ${s}`);
    return s;
  }), c = i.length;
  for (; ; ) {
    let s = 0, u = !0;
    for (let a = n; a < c; a++) {
      const l = i[a], h = r * s, d = h + l;
      if (!Number.isSafeInteger(d) || h / r !== s || d - l !== h)
        throw new Error("convertRadix: carry overflow");
      const f = d / t;
      s = d % t;
      const x = Math.floor(f);
      if (i[a] = x, !Number.isSafeInteger(x) || x * t + s !== d)
        throw new Error("convertRadix: carry overflow");
      if (u)
        x ? u = !1 : n = a;
      else continue;
    }
    if (o.push(s), u)
      break;
  }
  for (let s = 0; s < e.length - 1 && e[s] === 0; s++)
    o.push(0);
  return o.reverse();
}
const rc = (e, r) => r === 0 ? e : rc(r, e % r), Ln = /* @__NO_SIDE_EFFECTS__ */ (e, r) => e + (r - rc(e, r)), Eo = /* @__PURE__ */ (() => {
  let e = [];
  for (let r = 0; r < 40; r++)
    e.push(2 ** r);
  return e;
})();
function T0(e, r, t, n) {
  if (Hn(e), r <= 0 || r > 32)
    throw new Error(`convertRadix2: wrong from=${r}`);
  if (t <= 0 || t > 32)
    throw new Error(`convertRadix2: wrong to=${t}`);
  if (/* @__PURE__ */ Ln(r, t) > 32)
    throw new Error(`convertRadix2: carry overflow from=${r} to=${t} carryBits=${/* @__PURE__ */ Ln(r, t)}`);
  let o = 0, i = 0;
  const c = Eo[r], s = Eo[t] - 1, u = [];
  for (const a of e) {
    if (ur(a), a >= c)
      throw new Error(`convertRadix2: invalid data word=${a} from=${r}`);
    if (o = o << r | a, i + r > 32)
      throw new Error(`convertRadix2: carry overflow pos=${i} from=${r}`);
    for (i += r; i >= t; i -= t)
      u.push((o >> i - t & s) >>> 0);
    const l = Eo[i];
    if (l === void 0)
      throw new Error("invalid carry");
    o &= l - 1;
  }
  if (o = o << t - i & s, !n && i >= r)
    throw new Error("Excess padding");
  if (!n && o > 0)
    throw new Error(`Non-zero padding: ${o}`);
  return n && i > 0 && u.push(o >>> 0), u;
}
// @__NO_SIDE_EFFECTS__
function Af(e) {
  ur(e);
  const r = 2 ** 8;
  return {
    encode: (t) => {
      if (!In(t))
        throw new Error("radix.encode input should be Uint8Array");
      return F0(Array.from(t), r, e);
    },
    decode: (t) => (tc("radix.decode", t), Uint8Array.from(F0(t, e, r)))
  };
}
// @__NO_SIDE_EFFECTS__
function Bf(e, r = !1) {
  if (ur(e), e <= 0 || e > 32)
    throw new Error("radix2: bits should be in (0..32]");
  if (/* @__PURE__ */ Ln(8, e) > 32 || /* @__PURE__ */ Ln(e, 8) > 32)
    throw new Error("radix2: carry overflow");
  return {
    encode: (t) => {
      if (!In(t))
        throw new Error("radix2.encode input should be Uint8Array");
      return T0(Array.from(t), 8, e, !r);
    },
    decode: (t) => (tc("radix2.decode", t), Uint8Array.from(T0(t, e, 8, r)))
  };
}
function Cf(e, r) {
  return ur(e), vf(r), {
    encode(t) {
      if (!In(t))
        throw new Error("checksum.encode: input should be Uint8Array");
      const n = r(t).slice(0, e), o = new Uint8Array(t.length + e);
      return o.set(t), o.set(n, t.length), o;
    },
    decode(t) {
      if (!In(t))
        throw new Error("checksum.decode: input should be Uint8Array");
      const n = t.slice(0, -e), o = t.slice(-e), i = r(n).slice(0, e);
      for (let c = 0; c < e; c++)
        if (i[c] !== o[c])
          throw new Error("Invalid checksum");
      return n;
    }
  };
}
const wn = {
  alphabet: bf,
  chain: _f,
  checksum: Cf,
  convertRadix: F0,
  convertRadix2: T0,
  radix: Af,
  radix2: Bf,
  join: mf,
  padding: Ef
};
/*! scure-bip39 - MIT License (c) 2022 Patricio Palladino, Paul Miller (paulmillr.com) */
const kf = (e) => e[0] === "あいこくしん";
function nc(e) {
  if (typeof e != "string")
    throw new TypeError("invalid mnemonic type: " + typeof e);
  return e.normalize("NFKD");
}
function oc(e) {
  const r = nc(e), t = r.split(" ");
  if (![12, 15, 18, 21, 24].includes(t.length))
    throw new Error("Invalid mnemonic");
  return { nfkd: r, words: t };
}
function ic(e) {
  Xn(e, 16, 20, 24, 28, 32);
}
const Sf = (e) => {
  const r = 8 - e.length / 4;
  return new Uint8Array([Vu(e)[0] >> r << r]);
};
function ac(e) {
  if (!Array.isArray(e) || e.length !== 2048 || typeof e[0] != "string")
    throw new Error("Wordlist: expected array of 2048 strings");
  return e.forEach((r) => {
    if (typeof r != "string")
      throw new Error("wordlist: non-string element: " + r);
  }), wn.chain(wn.checksum(1, Sf), wn.radix2(11, !0), wn.alphabet(e));
}
function sc(e, r) {
  const { words: t } = oc(e), n = ac(r).decode(t);
  return ic(n), n;
}
function Ui(e, r) {
  return ic(e), ac(r).encode(e).join(kf(r) ? "　" : " ");
}
function Df(e, r) {
  try {
    sc(e, r);
  } catch {
    return !1;
  }
  return !0;
}
const Ff = (e) => nc("mnemonic" + e);
function Tf(e, r = "") {
  return Mu(wf, oc(e).nfkd, Ff(r), { c: 2048, dkLen: 64 });
}
const vn = `abandon
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
var $ = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Rf(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
function Of(e) {
  if (e.__esModule) return e;
  var r = e.default;
  if (typeof r == "function") {
    var t = function n() {
      return this instanceof n ? Reflect.construct(r, arguments, this.constructor) : r.apply(this, arguments);
    };
    t.prototype = r.prototype;
  } else t = {};
  return Object.defineProperty(t, "__esModule", { value: !0 }), Object.keys(e).forEach(function(n) {
    var o = Object.getOwnPropertyDescriptor(e, n);
    Object.defineProperty(t, n, o.get ? o : {
      enumerable: !0,
      get: function() {
        return e[n];
      }
    });
  }), t;
}
var cc = { exports: {} };
function If(e) {
  throw new Error('Could not dynamically require "' + e + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var Ao = { exports: {} };
const Nf = {}, Hf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Nf
}, Symbol.toStringTag, { value: "Module" })), zf = /* @__PURE__ */ Of(Hf);
var Mi;
function Y() {
  return Mi || (Mi = 1, function(e, r) {
    (function(t, n) {
      e.exports = n();
    })($, function() {
      var t = t || function(n, o) {
        var i;
        if (typeof window < "u" && window.crypto && (i = window.crypto), typeof self < "u" && self.crypto && (i = self.crypto), typeof globalThis < "u" && globalThis.crypto && (i = globalThis.crypto), !i && typeof window < "u" && window.msCrypto && (i = window.msCrypto), !i && typeof $ < "u" && $.crypto && (i = $.crypto), !i && typeof If == "function")
          try {
            i = zf;
          } catch {
          }
        var c = function() {
          if (i) {
            if (typeof i.getRandomValues == "function")
              try {
                return i.getRandomValues(new Uint32Array(1))[0];
              } catch {
              }
            if (typeof i.randomBytes == "function")
              try {
                return i.randomBytes(4).readInt32LE();
              } catch {
              }
          }
          throw new Error("Native crypto module could not be used to get secure random number.");
        }, s = Object.create || /* @__PURE__ */ function() {
          function p() {
          }
          return function(g) {
            var y;
            return p.prototype = g, y = new p(), p.prototype = null, y;
          };
        }(), u = {}, a = u.lib = {}, l = a.Base = /* @__PURE__ */ function() {
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
              var g = s(this);
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
        }(), h = a.WordArray = l.extend({
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
            var g = this.words, y = p.words, b = this.sigBytes, A = p.sigBytes;
            if (this.clamp(), b % 4)
              for (var m = 0; m < A; m++) {
                var C = y[m >>> 2] >>> 24 - m % 4 * 8 & 255;
                g[b + m >>> 2] |= C << 24 - (b + m) % 4 * 8;
              }
            else
              for (var S = 0; S < A; S += 4)
                g[b + S >>> 2] = y[S >>> 2];
            return this.sigBytes += A, this;
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
            var p = l.clone.call(this);
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
        }), d = u.enc = {}, f = d.Hex = {
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
            for (var g = p.words, y = p.sigBytes, b = [], A = 0; A < y; A++) {
              var m = g[A >>> 2] >>> 24 - A % 4 * 8 & 255;
              b.push((m >>> 4).toString(16)), b.push((m & 15).toString(16));
            }
            return b.join("");
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
            for (var g = p.length, y = [], b = 0; b < g; b += 2)
              y[b >>> 3] |= parseInt(p.substr(b, 2), 16) << 24 - b % 8 * 4;
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
            for (var g = p.words, y = p.sigBytes, b = [], A = 0; A < y; A++) {
              var m = g[A >>> 2] >>> 24 - A % 4 * 8 & 255;
              b.push(String.fromCharCode(m));
            }
            return b.join("");
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
            for (var g = p.length, y = [], b = 0; b < g; b++)
              y[b >>> 2] |= (p.charCodeAt(b) & 255) << 24 - b % 4 * 8;
            return new h.init(y, g);
          }
        }, v = d.Utf8 = {
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
        }, w = a.BufferedBlockAlgorithm = l.extend({
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
            typeof p == "string" && (p = v.parse(p)), this._data.concat(p), this._nDataBytes += p.sigBytes;
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
            var g, y = this._data, b = y.words, A = y.sigBytes, m = this.blockSize, C = m * 4, S = A / C;
            p ? S = n.ceil(S) : S = n.max((S | 0) - this._minBufferSize, 0);
            var E = S * m, k = n.min(E * 4, A);
            if (E) {
              for (var T = 0; T < E; T += m)
                this._doProcessBlock(b, T);
              g = b.splice(0, E), y.sigBytes -= k;
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
            var p = l.clone.call(this);
            return p._data = this._data.clone(), p;
          },
          _minBufferSize: 0
        });
        a.Hasher = w.extend({
          /**
           * Configuration options.
           */
          cfg: l.extend(),
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
            w.reset.call(this), this._doReset();
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
              return new _.HMAC.init(p, y).finalize(g);
            };
          }
        });
        var _ = u.algo = {};
        return u;
      }(Math);
      return t;
    });
  }(Ao)), Ao.exports;
}
var Bo = { exports: {} }, Pi;
function Jn() {
  return Pi || (Pi = 1, function(e, r) {
    (function(t, n) {
      e.exports = n(Y());
    })($, function(t) {
      return function(n) {
        var o = t, i = o.lib, c = i.Base, s = i.WordArray, u = o.x64 = {};
        u.Word = c.extend({
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
          init: function(a, l) {
            this.high = a, this.low = l;
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
        }), u.WordArray = c.extend({
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
          init: function(a, l) {
            a = this.words = a || [], l != n ? this.sigBytes = l : this.sigBytes = a.length * 8;
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
            for (var a = this.words, l = a.length, h = [], d = 0; d < l; d++) {
              var f = a[d];
              h.push(f.high), h.push(f.low);
            }
            return s.create(h, this.sigBytes);
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
            for (var a = c.clone.call(this), l = a.words = this.words.slice(0), h = l.length, d = 0; d < h; d++)
              l[d] = l[d].clone();
            return a;
          }
        });
      }(), t;
    });
  }(Bo)), Bo.exports;
}
var Co = { exports: {} }, Wi;
function Lf() {
  return Wi || (Wi = 1, function(e, r) {
    (function(t, n) {
      e.exports = n(Y());
    })($, function(t) {
      return function() {
        if (typeof ArrayBuffer == "function") {
          var n = t, o = n.lib, i = o.WordArray, c = i.init, s = i.init = function(u) {
            if (u instanceof ArrayBuffer && (u = new Uint8Array(u)), (u instanceof Int8Array || typeof Uint8ClampedArray < "u" && u instanceof Uint8ClampedArray || u instanceof Int16Array || u instanceof Uint16Array || u instanceof Int32Array || u instanceof Uint32Array || u instanceof Float32Array || u instanceof Float64Array) && (u = new Uint8Array(u.buffer, u.byteOffset, u.byteLength)), u instanceof Uint8Array) {
              for (var a = u.byteLength, l = [], h = 0; h < a; h++)
                l[h >>> 2] |= u[h] << 24 - h % 4 * 8;
              c.call(this, l, a);
            } else
              c.apply(this, arguments);
          };
          s.prototype = i;
        }
      }(), t.lib.WordArray;
    });
  }(Co)), Co.exports;
}
var ko = { exports: {} }, ji;
function Uf() {
  return ji || (ji = 1, function(e, r) {
    (function(t, n) {
      e.exports = n(Y());
    })($, function(t) {
      return function() {
        var n = t, o = n.lib, i = o.WordArray, c = n.enc;
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
          stringify: function(u) {
            for (var a = u.words, l = u.sigBytes, h = [], d = 0; d < l; d += 2) {
              var f = a[d >>> 2] >>> 16 - d % 4 * 8 & 65535;
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
          parse: function(u) {
            for (var a = u.length, l = [], h = 0; h < a; h++)
              l[h >>> 1] |= u.charCodeAt(h) << 16 - h % 2 * 16;
            return i.create(l, a * 2);
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
          stringify: function(u) {
            for (var a = u.words, l = u.sigBytes, h = [], d = 0; d < l; d += 2) {
              var f = s(a[d >>> 2] >>> 16 - d % 4 * 8 & 65535);
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
          parse: function(u) {
            for (var a = u.length, l = [], h = 0; h < a; h++)
              l[h >>> 1] |= s(u.charCodeAt(h) << 16 - h % 2 * 16);
            return i.create(l, a * 2);
          }
        };
        function s(u) {
          return u << 8 & 4278255360 | u >>> 8 & 16711935;
        }
      }(), t.enc.Utf16;
    });
  }(ko)), ko.exports;
}
var So = { exports: {} }, $i;
function Kt() {
  return $i || ($i = 1, function(e, r) {
    (function(t, n) {
      e.exports = n(Y());
    })($, function(t) {
      return function() {
        var n = t, o = n.lib, i = o.WordArray, c = n.enc;
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
          stringify: function(u) {
            var a = u.words, l = u.sigBytes, h = this._map;
            u.clamp();
            for (var d = [], f = 0; f < l; f += 3)
              for (var x = a[f >>> 2] >>> 24 - f % 4 * 8 & 255, v = a[f + 1 >>> 2] >>> 24 - (f + 1) % 4 * 8 & 255, w = a[f + 2 >>> 2] >>> 24 - (f + 2) % 4 * 8 & 255, _ = x << 16 | v << 8 | w, p = 0; p < 4 && f + p * 0.75 < l; p++)
                d.push(h.charAt(_ >>> 6 * (3 - p) & 63));
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
          parse: function(u) {
            var a = u.length, l = this._map, h = this._reverseMap;
            if (!h) {
              h = this._reverseMap = [];
              for (var d = 0; d < l.length; d++)
                h[l.charCodeAt(d)] = d;
            }
            var f = l.charAt(64);
            if (f) {
              var x = u.indexOf(f);
              x !== -1 && (a = x);
            }
            return s(u, a, h);
          },
          _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
        };
        function s(u, a, l) {
          for (var h = [], d = 0, f = 0; f < a; f++)
            if (f % 4) {
              var x = l[u.charCodeAt(f - 1)] << f % 4 * 2, v = l[u.charCodeAt(f)] >>> 6 - f % 4 * 2, w = x | v;
              h[d >>> 2] |= w << 24 - d % 4 * 8, d++;
            }
          return i.create(h, d);
        }
      }(), t.enc.Base64;
    });
  }(So)), So.exports;
}
var Do = { exports: {} }, Ki;
function Mf() {
  return Ki || (Ki = 1, function(e, r) {
    (function(t, n) {
      e.exports = n(Y());
    })($, function(t) {
      return function() {
        var n = t, o = n.lib, i = o.WordArray, c = n.enc;
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
          stringify: function(u, a) {
            a === void 0 && (a = !0);
            var l = u.words, h = u.sigBytes, d = a ? this._safe_map : this._map;
            u.clamp();
            for (var f = [], x = 0; x < h; x += 3)
              for (var v = l[x >>> 2] >>> 24 - x % 4 * 8 & 255, w = l[x + 1 >>> 2] >>> 24 - (x + 1) % 4 * 8 & 255, _ = l[x + 2 >>> 2] >>> 24 - (x + 2) % 4 * 8 & 255, p = v << 16 | w << 8 | _, g = 0; g < 4 && x + g * 0.75 < h; g++)
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
          parse: function(u, a) {
            a === void 0 && (a = !0);
            var l = u.length, h = a ? this._safe_map : this._map, d = this._reverseMap;
            if (!d) {
              d = this._reverseMap = [];
              for (var f = 0; f < h.length; f++)
                d[h.charCodeAt(f)] = f;
            }
            var x = h.charAt(64);
            if (x) {
              var v = u.indexOf(x);
              v !== -1 && (l = v);
            }
            return s(u, l, d);
          },
          _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
          _safe_map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"
        };
        function s(u, a, l) {
          for (var h = [], d = 0, f = 0; f < a; f++)
            if (f % 4) {
              var x = l[u.charCodeAt(f - 1)] << f % 4 * 2, v = l[u.charCodeAt(f)] >>> 6 - f % 4 * 2, w = x | v;
              h[d >>> 2] |= w << 24 - d % 4 * 8, d++;
            }
          return i.create(h, d);
        }
      }(), t.enc.Base64url;
    });
  }(Do)), Do.exports;
}
var Fo = { exports: {} }, Vi;
function Vt() {
  return Vi || (Vi = 1, function(e, r) {
    (function(t, n) {
      e.exports = n(Y());
    })($, function(t) {
      return function(n) {
        var o = t, i = o.lib, c = i.WordArray, s = i.Hasher, u = o.algo, a = [];
        (function() {
          for (var v = 0; v < 64; v++)
            a[v] = n.abs(n.sin(v + 1)) * 4294967296 | 0;
        })();
        var l = u.MD5 = s.extend({
          _doReset: function() {
            this._hash = new c.init([
              1732584193,
              4023233417,
              2562383102,
              271733878
            ]);
          },
          _doProcessBlock: function(v, w) {
            for (var _ = 0; _ < 16; _++) {
              var p = w + _, g = v[p];
              v[p] = (g << 8 | g >>> 24) & 16711935 | (g << 24 | g >>> 8) & 4278255360;
            }
            var y = this._hash.words, b = v[w + 0], A = v[w + 1], m = v[w + 2], C = v[w + 3], S = v[w + 4], E = v[w + 5], k = v[w + 6], T = v[w + 7], R = v[w + 8], z = v[w + 9], H = v[w + 10], L = v[w + 11], Q = v[w + 12], K = v[w + 13], J = v[w + 14], V = v[w + 15], O = y[0], I = y[1], F = y[2], D = y[3];
            O = h(O, I, F, D, b, 7, a[0]), D = h(D, O, I, F, A, 12, a[1]), F = h(F, D, O, I, m, 17, a[2]), I = h(I, F, D, O, C, 22, a[3]), O = h(O, I, F, D, S, 7, a[4]), D = h(D, O, I, F, E, 12, a[5]), F = h(F, D, O, I, k, 17, a[6]), I = h(I, F, D, O, T, 22, a[7]), O = h(O, I, F, D, R, 7, a[8]), D = h(D, O, I, F, z, 12, a[9]), F = h(F, D, O, I, H, 17, a[10]), I = h(I, F, D, O, L, 22, a[11]), O = h(O, I, F, D, Q, 7, a[12]), D = h(D, O, I, F, K, 12, a[13]), F = h(F, D, O, I, J, 17, a[14]), I = h(I, F, D, O, V, 22, a[15]), O = d(O, I, F, D, A, 5, a[16]), D = d(D, O, I, F, k, 9, a[17]), F = d(F, D, O, I, L, 14, a[18]), I = d(I, F, D, O, b, 20, a[19]), O = d(O, I, F, D, E, 5, a[20]), D = d(D, O, I, F, H, 9, a[21]), F = d(F, D, O, I, V, 14, a[22]), I = d(I, F, D, O, S, 20, a[23]), O = d(O, I, F, D, z, 5, a[24]), D = d(D, O, I, F, J, 9, a[25]), F = d(F, D, O, I, C, 14, a[26]), I = d(I, F, D, O, R, 20, a[27]), O = d(O, I, F, D, K, 5, a[28]), D = d(D, O, I, F, m, 9, a[29]), F = d(F, D, O, I, T, 14, a[30]), I = d(I, F, D, O, Q, 20, a[31]), O = f(O, I, F, D, E, 4, a[32]), D = f(D, O, I, F, R, 11, a[33]), F = f(F, D, O, I, L, 16, a[34]), I = f(I, F, D, O, J, 23, a[35]), O = f(O, I, F, D, A, 4, a[36]), D = f(D, O, I, F, S, 11, a[37]), F = f(F, D, O, I, T, 16, a[38]), I = f(I, F, D, O, H, 23, a[39]), O = f(O, I, F, D, K, 4, a[40]), D = f(D, O, I, F, b, 11, a[41]), F = f(F, D, O, I, C, 16, a[42]), I = f(I, F, D, O, k, 23, a[43]), O = f(O, I, F, D, z, 4, a[44]), D = f(D, O, I, F, Q, 11, a[45]), F = f(F, D, O, I, V, 16, a[46]), I = f(I, F, D, O, m, 23, a[47]), O = x(O, I, F, D, b, 6, a[48]), D = x(D, O, I, F, T, 10, a[49]), F = x(F, D, O, I, J, 15, a[50]), I = x(I, F, D, O, E, 21, a[51]), O = x(O, I, F, D, Q, 6, a[52]), D = x(D, O, I, F, C, 10, a[53]), F = x(F, D, O, I, H, 15, a[54]), I = x(I, F, D, O, A, 21, a[55]), O = x(O, I, F, D, R, 6, a[56]), D = x(D, O, I, F, V, 10, a[57]), F = x(F, D, O, I, k, 15, a[58]), I = x(I, F, D, O, K, 21, a[59]), O = x(O, I, F, D, S, 6, a[60]), D = x(D, O, I, F, L, 10, a[61]), F = x(F, D, O, I, m, 15, a[62]), I = x(I, F, D, O, z, 21, a[63]), y[0] = y[0] + O | 0, y[1] = y[1] + I | 0, y[2] = y[2] + F | 0, y[3] = y[3] + D | 0;
          },
          _doFinalize: function() {
            var v = this._data, w = v.words, _ = this._nDataBytes * 8, p = v.sigBytes * 8;
            w[p >>> 5] |= 128 << 24 - p % 32;
            var g = n.floor(_ / 4294967296), y = _;
            w[(p + 64 >>> 9 << 4) + 15] = (g << 8 | g >>> 24) & 16711935 | (g << 24 | g >>> 8) & 4278255360, w[(p + 64 >>> 9 << 4) + 14] = (y << 8 | y >>> 24) & 16711935 | (y << 24 | y >>> 8) & 4278255360, v.sigBytes = (w.length + 1) * 4, this._process();
            for (var b = this._hash, A = b.words, m = 0; m < 4; m++) {
              var C = A[m];
              A[m] = (C << 8 | C >>> 24) & 16711935 | (C << 24 | C >>> 8) & 4278255360;
            }
            return b;
          },
          clone: function() {
            var v = s.clone.call(this);
            return v._hash = this._hash.clone(), v;
          }
        });
        function h(v, w, _, p, g, y, b) {
          var A = v + (w & _ | ~w & p) + g + b;
          return (A << y | A >>> 32 - y) + w;
        }
        function d(v, w, _, p, g, y, b) {
          var A = v + (w & p | _ & ~p) + g + b;
          return (A << y | A >>> 32 - y) + w;
        }
        function f(v, w, _, p, g, y, b) {
          var A = v + (w ^ _ ^ p) + g + b;
          return (A << y | A >>> 32 - y) + w;
        }
        function x(v, w, _, p, g, y, b) {
          var A = v + (_ ^ (w | ~p)) + g + b;
          return (A << y | A >>> 32 - y) + w;
        }
        o.MD5 = s._createHelper(l), o.HmacMD5 = s._createHmacHelper(l);
      }(Math), t.MD5;
    });
  }(Fo)), Fo.exports;
}
var To = { exports: {} }, qi;
function lc() {
  return qi || (qi = 1, function(e, r) {
    (function(t, n) {
      e.exports = n(Y());
    })($, function(t) {
      return function() {
        var n = t, o = n.lib, i = o.WordArray, c = o.Hasher, s = n.algo, u = [], a = s.SHA1 = c.extend({
          _doReset: function() {
            this._hash = new i.init([
              1732584193,
              4023233417,
              2562383102,
              271733878,
              3285377520
            ]);
          },
          _doProcessBlock: function(l, h) {
            for (var d = this._hash.words, f = d[0], x = d[1], v = d[2], w = d[3], _ = d[4], p = 0; p < 80; p++) {
              if (p < 16)
                u[p] = l[h + p] | 0;
              else {
                var g = u[p - 3] ^ u[p - 8] ^ u[p - 14] ^ u[p - 16];
                u[p] = g << 1 | g >>> 31;
              }
              var y = (f << 5 | f >>> 27) + _ + u[p];
              p < 20 ? y += (x & v | ~x & w) + 1518500249 : p < 40 ? y += (x ^ v ^ w) + 1859775393 : p < 60 ? y += (x & v | x & w | v & w) - 1894007588 : y += (x ^ v ^ w) - 899497514, _ = w, w = v, v = x << 30 | x >>> 2, x = f, f = y;
            }
            d[0] = d[0] + f | 0, d[1] = d[1] + x | 0, d[2] = d[2] + v | 0, d[3] = d[3] + w | 0, d[4] = d[4] + _ | 0;
          },
          _doFinalize: function() {
            var l = this._data, h = l.words, d = this._nDataBytes * 8, f = l.sigBytes * 8;
            return h[f >>> 5] |= 128 << 24 - f % 32, h[(f + 64 >>> 9 << 4) + 14] = Math.floor(d / 4294967296), h[(f + 64 >>> 9 << 4) + 15] = d, l.sigBytes = h.length * 4, this._process(), this._hash;
          },
          clone: function() {
            var l = c.clone.call(this);
            return l._hash = this._hash.clone(), l;
          }
        });
        n.SHA1 = c._createHelper(a), n.HmacSHA1 = c._createHmacHelper(a);
      }(), t.SHA1;
    });
  }(To)), To.exports;
}
var Ro = { exports: {} }, Gi;
function si() {
  return Gi || (Gi = 1, function(e, r) {
    (function(t, n) {
      e.exports = n(Y());
    })($, function(t) {
      return function(n) {
        var o = t, i = o.lib, c = i.WordArray, s = i.Hasher, u = o.algo, a = [], l = [];
        (function() {
          function f(_) {
            for (var p = n.sqrt(_), g = 2; g <= p; g++)
              if (!(_ % g))
                return !1;
            return !0;
          }
          function x(_) {
            return (_ - (_ | 0)) * 4294967296 | 0;
          }
          for (var v = 2, w = 0; w < 64; )
            f(v) && (w < 8 && (a[w] = x(n.pow(v, 1 / 2))), l[w] = x(n.pow(v, 1 / 3)), w++), v++;
        })();
        var h = [], d = u.SHA256 = s.extend({
          _doReset: function() {
            this._hash = new c.init(a.slice(0));
          },
          _doProcessBlock: function(f, x) {
            for (var v = this._hash.words, w = v[0], _ = v[1], p = v[2], g = v[3], y = v[4], b = v[5], A = v[6], m = v[7], C = 0; C < 64; C++) {
              if (C < 16)
                h[C] = f[x + C] | 0;
              else {
                var S = h[C - 15], E = (S << 25 | S >>> 7) ^ (S << 14 | S >>> 18) ^ S >>> 3, k = h[C - 2], T = (k << 15 | k >>> 17) ^ (k << 13 | k >>> 19) ^ k >>> 10;
                h[C] = E + h[C - 7] + T + h[C - 16];
              }
              var R = y & b ^ ~y & A, z = w & _ ^ w & p ^ _ & p, H = (w << 30 | w >>> 2) ^ (w << 19 | w >>> 13) ^ (w << 10 | w >>> 22), L = (y << 26 | y >>> 6) ^ (y << 21 | y >>> 11) ^ (y << 7 | y >>> 25), Q = m + L + R + l[C] + h[C], K = H + z;
              m = A, A = b, b = y, y = g + Q | 0, g = p, p = _, _ = w, w = Q + K | 0;
            }
            v[0] = v[0] + w | 0, v[1] = v[1] + _ | 0, v[2] = v[2] + p | 0, v[3] = v[3] + g | 0, v[4] = v[4] + y | 0, v[5] = v[5] + b | 0, v[6] = v[6] + A | 0, v[7] = v[7] + m | 0;
          },
          _doFinalize: function() {
            var f = this._data, x = f.words, v = this._nDataBytes * 8, w = f.sigBytes * 8;
            return x[w >>> 5] |= 128 << 24 - w % 32, x[(w + 64 >>> 9 << 4) + 14] = n.floor(v / 4294967296), x[(w + 64 >>> 9 << 4) + 15] = v, f.sigBytes = x.length * 4, this._process(), this._hash;
          },
          clone: function() {
            var f = s.clone.call(this);
            return f._hash = this._hash.clone(), f;
          }
        });
        o.SHA256 = s._createHelper(d), o.HmacSHA256 = s._createHmacHelper(d);
      }(Math), t.SHA256;
    });
  }(Ro)), Ro.exports;
}
var Oo = { exports: {} }, Zi;
function Pf() {
  return Zi || (Zi = 1, function(e, r) {
    (function(t, n, o) {
      e.exports = n(Y(), si());
    })($, function(t) {
      return function() {
        var n = t, o = n.lib, i = o.WordArray, c = n.algo, s = c.SHA256, u = c.SHA224 = s.extend({
          _doReset: function() {
            this._hash = new i.init([
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
            var a = s._doFinalize.call(this);
            return a.sigBytes -= 4, a;
          }
        });
        n.SHA224 = s._createHelper(u), n.HmacSHA224 = s._createHmacHelper(u);
      }(), t.SHA224;
    });
  }(Oo)), Oo.exports;
}
var Io = { exports: {} }, Yi;
function uc() {
  return Yi || (Yi = 1, function(e, r) {
    (function(t, n, o) {
      e.exports = n(Y(), Jn());
    })($, function(t) {
      return function() {
        var n = t, o = n.lib, i = o.Hasher, c = n.x64, s = c.Word, u = c.WordArray, a = n.algo;
        function l() {
          return s.create.apply(s, arguments);
        }
        var h = [
          l(1116352408, 3609767458),
          l(1899447441, 602891725),
          l(3049323471, 3964484399),
          l(3921009573, 2173295548),
          l(961987163, 4081628472),
          l(1508970993, 3053834265),
          l(2453635748, 2937671579),
          l(2870763221, 3664609560),
          l(3624381080, 2734883394),
          l(310598401, 1164996542),
          l(607225278, 1323610764),
          l(1426881987, 3590304994),
          l(1925078388, 4068182383),
          l(2162078206, 991336113),
          l(2614888103, 633803317),
          l(3248222580, 3479774868),
          l(3835390401, 2666613458),
          l(4022224774, 944711139),
          l(264347078, 2341262773),
          l(604807628, 2007800933),
          l(770255983, 1495990901),
          l(1249150122, 1856431235),
          l(1555081692, 3175218132),
          l(1996064986, 2198950837),
          l(2554220882, 3999719339),
          l(2821834349, 766784016),
          l(2952996808, 2566594879),
          l(3210313671, 3203337956),
          l(3336571891, 1034457026),
          l(3584528711, 2466948901),
          l(113926993, 3758326383),
          l(338241895, 168717936),
          l(666307205, 1188179964),
          l(773529912, 1546045734),
          l(1294757372, 1522805485),
          l(1396182291, 2643833823),
          l(1695183700, 2343527390),
          l(1986661051, 1014477480),
          l(2177026350, 1206759142),
          l(2456956037, 344077627),
          l(2730485921, 1290863460),
          l(2820302411, 3158454273),
          l(3259730800, 3505952657),
          l(3345764771, 106217008),
          l(3516065817, 3606008344),
          l(3600352804, 1432725776),
          l(4094571909, 1467031594),
          l(275423344, 851169720),
          l(430227734, 3100823752),
          l(506948616, 1363258195),
          l(659060556, 3750685593),
          l(883997877, 3785050280),
          l(958139571, 3318307427),
          l(1322822218, 3812723403),
          l(1537002063, 2003034995),
          l(1747873779, 3602036899),
          l(1955562222, 1575990012),
          l(2024104815, 1125592928),
          l(2227730452, 2716904306),
          l(2361852424, 442776044),
          l(2428436474, 593698344),
          l(2756734187, 3733110249),
          l(3204031479, 2999351573),
          l(3329325298, 3815920427),
          l(3391569614, 3928383900),
          l(3515267271, 566280711),
          l(3940187606, 3454069534),
          l(4118630271, 4000239992),
          l(116418474, 1914138554),
          l(174292421, 2731055270),
          l(289380356, 3203993006),
          l(460393269, 320620315),
          l(685471733, 587496836),
          l(852142971, 1086792851),
          l(1017036298, 365543100),
          l(1126000580, 2618297676),
          l(1288033470, 3409855158),
          l(1501505948, 4234509866),
          l(1607167915, 987167468),
          l(1816402316, 1246189591)
        ], d = [];
        (function() {
          for (var x = 0; x < 80; x++)
            d[x] = l();
        })();
        var f = a.SHA512 = i.extend({
          _doReset: function() {
            this._hash = new u.init([
              new s.init(1779033703, 4089235720),
              new s.init(3144134277, 2227873595),
              new s.init(1013904242, 4271175723),
              new s.init(2773480762, 1595750129),
              new s.init(1359893119, 2917565137),
              new s.init(2600822924, 725511199),
              new s.init(528734635, 4215389547),
              new s.init(1541459225, 327033209)
            ]);
          },
          _doProcessBlock: function(x, v) {
            for (var w = this._hash.words, _ = w[0], p = w[1], g = w[2], y = w[3], b = w[4], A = w[5], m = w[6], C = w[7], S = _.high, E = _.low, k = p.high, T = p.low, R = g.high, z = g.low, H = y.high, L = y.low, Q = b.high, K = b.low, J = A.high, V = A.low, O = m.high, I = m.low, F = C.high, D = C.low, W = S, G = E, ne = k, M = T, Le = R, We = z, xr = H, ut = L, Te = Q, me = K, tt = J, je = V, Dt = O, ft = I, dt = F, Ft = D, Re = 0; Re < 80; Re++) {
              var ye, Ke, Zt = d[Re];
              if (Re < 16)
                Ke = Zt.high = x[v + Re * 2] | 0, ye = Zt.low = x[v + Re * 2 + 1] | 0;
              else {
                var pr = d[Re - 15], rt = pr.high, ht = pr.low, uo = (rt >>> 1 | ht << 31) ^ (rt >>> 8 | ht << 24) ^ rt >>> 7, gr = (ht >>> 1 | rt << 31) ^ (ht >>> 8 | rt << 24) ^ (ht >>> 7 | rt << 25), yr = d[Re - 2], xt = yr.high, Tt = yr.low, fo = (xt >>> 19 | Tt << 13) ^ (xt << 3 | Tt >>> 29) ^ xt >>> 6, rn = (Tt >>> 19 | xt << 13) ^ (Tt << 3 | xt >>> 29) ^ (Tt >>> 6 | xt << 26), nn = d[Re - 7], ho = nn.high, xo = nn.low, Yt = d[Re - 16], on = Yt.high, nt = Yt.low;
                ye = gr + xo, Ke = uo + ho + (ye >>> 0 < gr >>> 0 ? 1 : 0), ye = ye + rn, Ke = Ke + fo + (ye >>> 0 < rn >>> 0 ? 1 : 0), ye = ye + nt, Ke = Ke + on + (ye >>> 0 < nt >>> 0 ? 1 : 0), Zt.high = Ke, Zt.low = ye;
              }
              var wr = Te & tt ^ ~Te & Dt, Xt = me & je ^ ~me & ft, an = W & ne ^ W & Le ^ ne & Le, po = G & M ^ G & We ^ M & We, sn = (W >>> 28 | G << 4) ^ (W << 30 | G >>> 2) ^ (W << 25 | G >>> 7), cn = (G >>> 28 | W << 4) ^ (G << 30 | W >>> 2) ^ (G << 25 | W >>> 7), ln = (Te >>> 14 | me << 18) ^ (Te >>> 18 | me << 14) ^ (Te << 23 | me >>> 9), un = (me >>> 14 | Te << 18) ^ (me >>> 18 | Te << 14) ^ (me << 23 | Te >>> 9), fn = h[Re], go = fn.high, vr = fn.low, we = Ft + un, Ve = dt + ln + (we >>> 0 < Ft >>> 0 ? 1 : 0), we = we + Xt, Ve = Ve + wr + (we >>> 0 < Xt >>> 0 ? 1 : 0), we = we + vr, Ve = Ve + go + (we >>> 0 < vr >>> 0 ? 1 : 0), we = we + ye, Ve = Ve + Ke + (we >>> 0 < ye >>> 0 ? 1 : 0), dn = cn + po, yo = sn + an + (dn >>> 0 < cn >>> 0 ? 1 : 0);
              dt = Dt, Ft = ft, Dt = tt, ft = je, tt = Te, je = me, me = ut + we | 0, Te = xr + Ve + (me >>> 0 < ut >>> 0 ? 1 : 0) | 0, xr = Le, ut = We, Le = ne, We = M, ne = W, M = G, G = we + dn | 0, W = Ve + yo + (G >>> 0 < we >>> 0 ? 1 : 0) | 0;
            }
            E = _.low = E + G, _.high = S + W + (E >>> 0 < G >>> 0 ? 1 : 0), T = p.low = T + M, p.high = k + ne + (T >>> 0 < M >>> 0 ? 1 : 0), z = g.low = z + We, g.high = R + Le + (z >>> 0 < We >>> 0 ? 1 : 0), L = y.low = L + ut, y.high = H + xr + (L >>> 0 < ut >>> 0 ? 1 : 0), K = b.low = K + me, b.high = Q + Te + (K >>> 0 < me >>> 0 ? 1 : 0), V = A.low = V + je, A.high = J + tt + (V >>> 0 < je >>> 0 ? 1 : 0), I = m.low = I + ft, m.high = O + Dt + (I >>> 0 < ft >>> 0 ? 1 : 0), D = C.low = D + Ft, C.high = F + dt + (D >>> 0 < Ft >>> 0 ? 1 : 0);
          },
          _doFinalize: function() {
            var x = this._data, v = x.words, w = this._nDataBytes * 8, _ = x.sigBytes * 8;
            v[_ >>> 5] |= 128 << 24 - _ % 32, v[(_ + 128 >>> 10 << 5) + 30] = Math.floor(w / 4294967296), v[(_ + 128 >>> 10 << 5) + 31] = w, x.sigBytes = v.length * 4, this._process();
            var p = this._hash.toX32();
            return p;
          },
          clone: function() {
            var x = i.clone.call(this);
            return x._hash = this._hash.clone(), x;
          },
          blockSize: 1024 / 32
        });
        n.SHA512 = i._createHelper(f), n.HmacSHA512 = i._createHmacHelper(f);
      }(), t.SHA512;
    });
  }(Io)), Io.exports;
}
var No = { exports: {} }, Xi;
function Wf() {
  return Xi || (Xi = 1, function(e, r) {
    (function(t, n, o) {
      e.exports = n(Y(), Jn(), uc());
    })($, function(t) {
      return function() {
        var n = t, o = n.x64, i = o.Word, c = o.WordArray, s = n.algo, u = s.SHA512, a = s.SHA384 = u.extend({
          _doReset: function() {
            this._hash = new c.init([
              new i.init(3418070365, 3238371032),
              new i.init(1654270250, 914150663),
              new i.init(2438529370, 812702999),
              new i.init(355462360, 4144912697),
              new i.init(1731405415, 4290775857),
              new i.init(2394180231, 1750603025),
              new i.init(3675008525, 1694076839),
              new i.init(1203062813, 3204075428)
            ]);
          },
          _doFinalize: function() {
            var l = u._doFinalize.call(this);
            return l.sigBytes -= 16, l;
          }
        });
        n.SHA384 = u._createHelper(a), n.HmacSHA384 = u._createHmacHelper(a);
      }(), t.SHA384;
    });
  }(No)), No.exports;
}
var Ho = { exports: {} }, Ji;
function jf() {
  return Ji || (Ji = 1, function(e, r) {
    (function(t, n, o) {
      e.exports = n(Y(), Jn());
    })($, function(t) {
      return function(n) {
        var o = t, i = o.lib, c = i.WordArray, s = i.Hasher, u = o.x64, a = u.Word, l = o.algo, h = [], d = [], f = [];
        (function() {
          for (var w = 1, _ = 0, p = 0; p < 24; p++) {
            h[w + 5 * _] = (p + 1) * (p + 2) / 2 % 64;
            var g = _ % 5, y = (2 * w + 3 * _) % 5;
            w = g, _ = y;
          }
          for (var w = 0; w < 5; w++)
            for (var _ = 0; _ < 5; _++)
              d[w + 5 * _] = _ + (2 * w + 3 * _) % 5 * 5;
          for (var b = 1, A = 0; A < 24; A++) {
            for (var m = 0, C = 0, S = 0; S < 7; S++) {
              if (b & 1) {
                var E = (1 << S) - 1;
                E < 32 ? C ^= 1 << E : m ^= 1 << E - 32;
              }
              b & 128 ? b = b << 1 ^ 113 : b <<= 1;
            }
            f[A] = a.create(m, C);
          }
        })();
        var x = [];
        (function() {
          for (var w = 0; w < 25; w++)
            x[w] = a.create();
        })();
        var v = l.SHA3 = s.extend({
          /**
           * Configuration options.
           *
           * @property {number} outputLength
           *   The desired number of bits in the output hash.
           *   Only values permitted are: 224, 256, 384, 512.
           *   Default: 512
           */
          cfg: s.cfg.extend({
            outputLength: 512
          }),
          _doReset: function() {
            for (var w = this._state = [], _ = 0; _ < 25; _++)
              w[_] = new a.init();
            this.blockSize = (1600 - 2 * this.cfg.outputLength) / 32;
          },
          _doProcessBlock: function(w, _) {
            for (var p = this._state, g = this.blockSize / 2, y = 0; y < g; y++) {
              var b = w[_ + 2 * y], A = w[_ + 2 * y + 1];
              b = (b << 8 | b >>> 24) & 16711935 | (b << 24 | b >>> 8) & 4278255360, A = (A << 8 | A >>> 24) & 16711935 | (A << 24 | A >>> 8) & 4278255360;
              var m = p[y];
              m.high ^= A, m.low ^= b;
            }
            for (var C = 0; C < 24; C++) {
              for (var S = 0; S < 5; S++) {
                for (var E = 0, k = 0, T = 0; T < 5; T++) {
                  var m = p[S + 5 * T];
                  E ^= m.high, k ^= m.low;
                }
                var R = x[S];
                R.high = E, R.low = k;
              }
              for (var S = 0; S < 5; S++)
                for (var z = x[(S + 4) % 5], H = x[(S + 1) % 5], L = H.high, Q = H.low, E = z.high ^ (L << 1 | Q >>> 31), k = z.low ^ (Q << 1 | L >>> 31), T = 0; T < 5; T++) {
                  var m = p[S + 5 * T];
                  m.high ^= E, m.low ^= k;
                }
              for (var K = 1; K < 25; K++) {
                var E, k, m = p[K], J = m.high, V = m.low, O = h[K];
                O < 32 ? (E = J << O | V >>> 32 - O, k = V << O | J >>> 32 - O) : (E = V << O - 32 | J >>> 64 - O, k = J << O - 32 | V >>> 64 - O);
                var I = x[d[K]];
                I.high = E, I.low = k;
              }
              var F = x[0], D = p[0];
              F.high = D.high, F.low = D.low;
              for (var S = 0; S < 5; S++)
                for (var T = 0; T < 5; T++) {
                  var K = S + 5 * T, m = p[K], W = x[K], G = x[(S + 1) % 5 + 5 * T], ne = x[(S + 2) % 5 + 5 * T];
                  m.high = W.high ^ ~G.high & ne.high, m.low = W.low ^ ~G.low & ne.low;
                }
              var m = p[0], M = f[C];
              m.high ^= M.high, m.low ^= M.low;
            }
          },
          _doFinalize: function() {
            var w = this._data, _ = w.words;
            this._nDataBytes * 8;
            var p = w.sigBytes * 8, g = this.blockSize * 32;
            _[p >>> 5] |= 1 << 24 - p % 32, _[(n.ceil((p + 1) / g) * g >>> 5) - 1] |= 128, w.sigBytes = _.length * 4, this._process();
            for (var y = this._state, b = this.cfg.outputLength / 8, A = b / 8, m = [], C = 0; C < A; C++) {
              var S = y[C], E = S.high, k = S.low;
              E = (E << 8 | E >>> 24) & 16711935 | (E << 24 | E >>> 8) & 4278255360, k = (k << 8 | k >>> 24) & 16711935 | (k << 24 | k >>> 8) & 4278255360, m.push(k), m.push(E);
            }
            return new c.init(m, b);
          },
          clone: function() {
            for (var w = s.clone.call(this), _ = w._state = this._state.slice(0), p = 0; p < 25; p++)
              _[p] = _[p].clone();
            return w;
          }
        });
        o.SHA3 = s._createHelper(v), o.HmacSHA3 = s._createHmacHelper(v);
      }(Math), t.SHA3;
    });
  }(Ho)), Ho.exports;
}
var zo = { exports: {} }, Qi;
function $f() {
  return Qi || (Qi = 1, function(e, r) {
    (function(t, n) {
      e.exports = n(Y());
    })($, function(t) {
      /** @preserve
      			(c) 2012 by Cédric Mesnil. All rights reserved.
      
      			Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
      
      			    - Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
      			    - Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
      
      			THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
      			*/
      return function(n) {
        var o = t, i = o.lib, c = i.WordArray, s = i.Hasher, u = o.algo, a = c.create([
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
        ]), l = c.create([
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
        ]), f = c.create([0, 1518500249, 1859775393, 2400959708, 2840853838]), x = c.create([1352829926, 1548603684, 1836072691, 2053994217, 0]), v = u.RIPEMD160 = s.extend({
          _doReset: function() {
            this._hash = c.create([1732584193, 4023233417, 2562383102, 271733878, 3285377520]);
          },
          _doProcessBlock: function(A, m) {
            for (var C = 0; C < 16; C++) {
              var S = m + C, E = A[S];
              A[S] = (E << 8 | E >>> 24) & 16711935 | (E << 24 | E >>> 8) & 4278255360;
            }
            var k = this._hash.words, T = f.words, R = x.words, z = a.words, H = l.words, L = h.words, Q = d.words, K, J, V, O, I, F, D, W, G, ne;
            F = K = k[0], D = J = k[1], W = V = k[2], G = O = k[3], ne = I = k[4];
            for (var M, C = 0; C < 80; C += 1)
              M = K + A[m + z[C]] | 0, C < 16 ? M += w(J, V, O) + T[0] : C < 32 ? M += _(J, V, O) + T[1] : C < 48 ? M += p(J, V, O) + T[2] : C < 64 ? M += g(J, V, O) + T[3] : M += y(J, V, O) + T[4], M = M | 0, M = b(M, L[C]), M = M + I | 0, K = I, I = O, O = b(V, 10), V = J, J = M, M = F + A[m + H[C]] | 0, C < 16 ? M += y(D, W, G) + R[0] : C < 32 ? M += g(D, W, G) + R[1] : C < 48 ? M += p(D, W, G) + R[2] : C < 64 ? M += _(D, W, G) + R[3] : M += w(D, W, G) + R[4], M = M | 0, M = b(M, Q[C]), M = M + ne | 0, F = ne, ne = G, G = b(W, 10), W = D, D = M;
            M = k[1] + V + G | 0, k[1] = k[2] + O + ne | 0, k[2] = k[3] + I + F | 0, k[3] = k[4] + K + D | 0, k[4] = k[0] + J + W | 0, k[0] = M;
          },
          _doFinalize: function() {
            var A = this._data, m = A.words, C = this._nDataBytes * 8, S = A.sigBytes * 8;
            m[S >>> 5] |= 128 << 24 - S % 32, m[(S + 64 >>> 9 << 4) + 14] = (C << 8 | C >>> 24) & 16711935 | (C << 24 | C >>> 8) & 4278255360, A.sigBytes = (m.length + 1) * 4, this._process();
            for (var E = this._hash, k = E.words, T = 0; T < 5; T++) {
              var R = k[T];
              k[T] = (R << 8 | R >>> 24) & 16711935 | (R << 24 | R >>> 8) & 4278255360;
            }
            return E;
          },
          clone: function() {
            var A = s.clone.call(this);
            return A._hash = this._hash.clone(), A;
          }
        });
        function w(A, m, C) {
          return A ^ m ^ C;
        }
        function _(A, m, C) {
          return A & m | ~A & C;
        }
        function p(A, m, C) {
          return (A | ~m) ^ C;
        }
        function g(A, m, C) {
          return A & C | m & ~C;
        }
        function y(A, m, C) {
          return A ^ (m | ~C);
        }
        function b(A, m) {
          return A << m | A >>> 32 - m;
        }
        o.RIPEMD160 = s._createHelper(v), o.HmacRIPEMD160 = s._createHmacHelper(v);
      }(), t.RIPEMD160;
    });
  }(zo)), zo.exports;
}
var Lo = { exports: {} }, ea;
function ci() {
  return ea || (ea = 1, function(e, r) {
    (function(t, n) {
      e.exports = n(Y());
    })($, function(t) {
      (function() {
        var n = t, o = n.lib, i = o.Base, c = n.enc, s = c.Utf8, u = n.algo;
        u.HMAC = i.extend({
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
          init: function(a, l) {
            a = this._hasher = new a.init(), typeof l == "string" && (l = s.parse(l));
            var h = a.blockSize, d = h * 4;
            l.sigBytes > d && (l = a.finalize(l)), l.clamp();
            for (var f = this._oKey = l.clone(), x = this._iKey = l.clone(), v = f.words, w = x.words, _ = 0; _ < h; _++)
              v[_] ^= 1549556828, w[_] ^= 909522486;
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
            var a = this._hasher;
            a.reset(), a.update(this._iKey);
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
          update: function(a) {
            return this._hasher.update(a), this;
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
          finalize: function(a) {
            var l = this._hasher, h = l.finalize(a);
            l.reset();
            var d = l.finalize(this._oKey.clone().concat(h));
            return d;
          }
        });
      })();
    });
  }(Lo)), Lo.exports;
}
var Uo = { exports: {} }, ta;
function Kf() {
  return ta || (ta = 1, function(e, r) {
    (function(t, n, o) {
      e.exports = n(Y(), si(), ci());
    })($, function(t) {
      return function() {
        var n = t, o = n.lib, i = o.Base, c = o.WordArray, s = n.algo, u = s.SHA256, a = s.HMAC, l = s.PBKDF2 = i.extend({
          /**
           * Configuration options.
           *
           * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
           * @property {Hasher} hasher The hasher to use. Default: SHA256
           * @property {number} iterations The number of iterations to perform. Default: 250000
           */
          cfg: i.extend({
            keySize: 128 / 32,
            hasher: u,
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
            for (var f = this.cfg, x = a.create(f.hasher, h), v = c.create(), w = c.create([1]), _ = v.words, p = w.words, g = f.keySize, y = f.iterations; _.length < g; ) {
              var b = x.update(d).finalize(w);
              x.reset();
              for (var A = b.words, m = A.length, C = b, S = 1; S < y; S++) {
                C = x.finalize(C), x.reset();
                for (var E = C.words, k = 0; k < m; k++)
                  A[k] ^= E[k];
              }
              v.concat(b), p[0]++;
            }
            return v.sigBytes = g * 4, v;
          }
        });
        n.PBKDF2 = function(h, d, f) {
          return l.create(f).compute(h, d);
        };
      }(), t.PBKDF2;
    });
  }(Uo)), Uo.exports;
}
var Mo = { exports: {} }, ra;
function St() {
  return ra || (ra = 1, function(e, r) {
    (function(t, n, o) {
      e.exports = n(Y(), lc(), ci());
    })($, function(t) {
      return function() {
        var n = t, o = n.lib, i = o.Base, c = o.WordArray, s = n.algo, u = s.MD5, a = s.EvpKDF = i.extend({
          /**
           * Configuration options.
           *
           * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
           * @property {Hasher} hasher The hash algorithm to use. Default: MD5
           * @property {number} iterations The number of iterations to perform. Default: 1
           */
          cfg: i.extend({
            keySize: 128 / 32,
            hasher: u,
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
          init: function(l) {
            this.cfg = this.cfg.extend(l);
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
          compute: function(l, h) {
            for (var d, f = this.cfg, x = f.hasher.create(), v = c.create(), w = v.words, _ = f.keySize, p = f.iterations; w.length < _; ) {
              d && x.update(d), d = x.update(l).finalize(h), x.reset();
              for (var g = 1; g < p; g++)
                d = x.finalize(d), x.reset();
              v.concat(d);
            }
            return v.sigBytes = _ * 4, v;
          }
        });
        n.EvpKDF = function(l, h, d) {
          return a.create(d).compute(l, h);
        };
      }(), t.EvpKDF;
    });
  }(Mo)), Mo.exports;
}
var Po = { exports: {} }, na;
function xe() {
  return na || (na = 1, function(e, r) {
    (function(t, n, o) {
      e.exports = n(Y(), St());
    })($, function(t) {
      t.lib.Cipher || function(n) {
        var o = t, i = o.lib, c = i.Base, s = i.WordArray, u = i.BufferedBlockAlgorithm, a = o.enc;
        a.Utf8;
        var l = a.Base64, h = o.algo, d = h.EvpKDF, f = i.Cipher = u.extend({
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
          createEncryptor: function(E, k) {
            return this.create(this._ENC_XFORM_MODE, E, k);
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
          createDecryptor: function(E, k) {
            return this.create(this._DEC_XFORM_MODE, E, k);
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
          init: function(E, k, T) {
            this.cfg = this.cfg.extend(T), this._xformMode = E, this._key = k, this.reset();
          },
          /**
           * Resets this cipher to its initial state.
           *
           * @example
           *
           *     cipher.reset();
           */
          reset: function() {
            u.reset.call(this), this._doReset();
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
          process: function(E) {
            return this._append(E), this._process();
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
          finalize: function(E) {
            E && this._append(E);
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
            function E(k) {
              return typeof k == "string" ? S : A;
            }
            return function(k) {
              return {
                encrypt: function(T, R, z) {
                  return E(R).encrypt(k, T, R, z);
                },
                decrypt: function(T, R, z) {
                  return E(R).decrypt(k, T, R, z);
                }
              };
            };
          }()
        });
        i.StreamCipher = f.extend({
          _doFinalize: function() {
            var E = this._process(!0);
            return E;
          },
          blockSize: 1
        });
        var x = o.mode = {}, v = i.BlockCipherMode = c.extend({
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
          createEncryptor: function(E, k) {
            return this.Encryptor.create(E, k);
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
          createDecryptor: function(E, k) {
            return this.Decryptor.create(E, k);
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
          init: function(E, k) {
            this._cipher = E, this._iv = k;
          }
        }), w = x.CBC = function() {
          var E = v.extend();
          E.Encryptor = E.extend({
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
            processBlock: function(T, R) {
              var z = this._cipher, H = z.blockSize;
              k.call(this, T, R, H), z.encryptBlock(T, R), this._prevBlock = T.slice(R, R + H);
            }
          }), E.Decryptor = E.extend({
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
            processBlock: function(T, R) {
              var z = this._cipher, H = z.blockSize, L = T.slice(R, R + H);
              z.decryptBlock(T, R), k.call(this, T, R, H), this._prevBlock = L;
            }
          });
          function k(T, R, z) {
            var H, L = this._iv;
            L ? (H = L, this._iv = n) : H = this._prevBlock;
            for (var Q = 0; Q < z; Q++)
              T[R + Q] ^= H[Q];
          }
          return E;
        }(), _ = o.pad = {}, p = _.Pkcs7 = {
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
          pad: function(E, k) {
            for (var T = k * 4, R = T - E.sigBytes % T, z = R << 24 | R << 16 | R << 8 | R, H = [], L = 0; L < R; L += 4)
              H.push(z);
            var Q = s.create(H, R);
            E.concat(Q);
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
          unpad: function(E) {
            var k = E.words[E.sigBytes - 1 >>> 2] & 255;
            E.sigBytes -= k;
          }
        };
        i.BlockCipher = f.extend({
          /**
           * Configuration options.
           *
           * @property {Mode} mode The block mode to use. Default: CBC
           * @property {Padding} padding The padding strategy to use. Default: Pkcs7
           */
          cfg: f.cfg.extend({
            mode: w,
            padding: p
          }),
          reset: function() {
            var E;
            f.reset.call(this);
            var k = this.cfg, T = k.iv, R = k.mode;
            this._xformMode == this._ENC_XFORM_MODE ? E = R.createEncryptor : (E = R.createDecryptor, this._minBufferSize = 1), this._mode && this._mode.__creator == E ? this._mode.init(this, T && T.words) : (this._mode = E.call(R, this, T && T.words), this._mode.__creator = E);
          },
          _doProcessBlock: function(E, k) {
            this._mode.processBlock(E, k);
          },
          _doFinalize: function() {
            var E, k = this.cfg.padding;
            return this._xformMode == this._ENC_XFORM_MODE ? (k.pad(this._data, this.blockSize), E = this._process(!0)) : (E = this._process(!0), k.unpad(E)), E;
          },
          blockSize: 128 / 32
        });
        var g = i.CipherParams = c.extend({
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
          init: function(E) {
            this.mixIn(E);
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
          toString: function(E) {
            return (E || this.formatter).stringify(this);
          }
        }), y = o.format = {}, b = y.OpenSSL = {
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
          stringify: function(E) {
            var k, T = E.ciphertext, R = E.salt;
            return R ? k = s.create([1398893684, 1701076831]).concat(R).concat(T) : k = T, k.toString(l);
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
          parse: function(E) {
            var k, T = l.parse(E), R = T.words;
            return R[0] == 1398893684 && R[1] == 1701076831 && (k = s.create(R.slice(2, 4)), R.splice(0, 4), T.sigBytes -= 16), g.create({ ciphertext: T, salt: k });
          }
        }, A = i.SerializableCipher = c.extend({
          /**
           * Configuration options.
           *
           * @property {Formatter} format The formatting strategy to convert cipher param objects to and from a string. Default: OpenSSL
           */
          cfg: c.extend({
            format: b
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
          encrypt: function(E, k, T, R) {
            R = this.cfg.extend(R);
            var z = E.createEncryptor(T, R), H = z.finalize(k), L = z.cfg;
            return g.create({
              ciphertext: H,
              key: T,
              iv: L.iv,
              algorithm: E,
              mode: L.mode,
              padding: L.padding,
              blockSize: E.blockSize,
              formatter: R.format
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
          decrypt: function(E, k, T, R) {
            R = this.cfg.extend(R), k = this._parse(k, R.format);
            var z = E.createDecryptor(T, R).finalize(k.ciphertext);
            return z;
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
          _parse: function(E, k) {
            return typeof E == "string" ? k.parse(E, this) : E;
          }
        }), m = o.kdf = {}, C = m.OpenSSL = {
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
          execute: function(E, k, T, R, z) {
            if (R || (R = s.random(64 / 8)), z)
              var H = d.create({ keySize: k + T, hasher: z }).compute(E, R);
            else
              var H = d.create({ keySize: k + T }).compute(E, R);
            var L = s.create(H.words.slice(k), T * 4);
            return H.sigBytes = k * 4, g.create({ key: H, iv: L, salt: R });
          }
        }, S = i.PasswordBasedCipher = A.extend({
          /**
           * Configuration options.
           *
           * @property {KDF} kdf The key derivation function to use to generate a key and IV from a password. Default: OpenSSL
           */
          cfg: A.cfg.extend({
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
          encrypt: function(E, k, T, R) {
            R = this.cfg.extend(R);
            var z = R.kdf.execute(T, E.keySize, E.ivSize, R.salt, R.hasher);
            R.iv = z.iv;
            var H = A.encrypt.call(this, E, k, z.key, R);
            return H.mixIn(z), H;
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
          decrypt: function(E, k, T, R) {
            R = this.cfg.extend(R), k = this._parse(k, R.format);
            var z = R.kdf.execute(T, E.keySize, E.ivSize, k.salt, R.hasher);
            R.iv = z.iv;
            var H = A.decrypt.call(this, E, k, z.key, R);
            return H;
          }
        });
      }();
    });
  }(Po)), Po.exports;
}
var Wo = { exports: {} }, oa;
function Vf() {
  return oa || (oa = 1, function(e, r) {
    (function(t, n, o) {
      e.exports = n(Y(), xe());
    })($, function(t) {
      return t.mode.CFB = function() {
        var n = t.lib.BlockCipherMode.extend();
        n.Encryptor = n.extend({
          processBlock: function(i, c) {
            var s = this._cipher, u = s.blockSize;
            o.call(this, i, c, u, s), this._prevBlock = i.slice(c, c + u);
          }
        }), n.Decryptor = n.extend({
          processBlock: function(i, c) {
            var s = this._cipher, u = s.blockSize, a = i.slice(c, c + u);
            o.call(this, i, c, u, s), this._prevBlock = a;
          }
        });
        function o(i, c, s, u) {
          var a, l = this._iv;
          l ? (a = l.slice(0), this._iv = void 0) : a = this._prevBlock, u.encryptBlock(a, 0);
          for (var h = 0; h < s; h++)
            i[c + h] ^= a[h];
        }
        return n;
      }(), t.mode.CFB;
    });
  }(Wo)), Wo.exports;
}
var jo = { exports: {} }, ia;
function qf() {
  return ia || (ia = 1, function(e, r) {
    (function(t, n, o) {
      e.exports = n(Y(), xe());
    })($, function(t) {
      return t.mode.CTR = function() {
        var n = t.lib.BlockCipherMode.extend(), o = n.Encryptor = n.extend({
          processBlock: function(i, c) {
            var s = this._cipher, u = s.blockSize, a = this._iv, l = this._counter;
            a && (l = this._counter = a.slice(0), this._iv = void 0);
            var h = l.slice(0);
            s.encryptBlock(h, 0), l[u - 1] = l[u - 1] + 1 | 0;
            for (var d = 0; d < u; d++)
              i[c + d] ^= h[d];
          }
        });
        return n.Decryptor = o, n;
      }(), t.mode.CTR;
    });
  }(jo)), jo.exports;
}
var $o = { exports: {} }, aa;
function Gf() {
  return aa || (aa = 1, function(e, r) {
    (function(t, n, o) {
      e.exports = n(Y(), xe());
    })($, function(t) {
      /** @preserve
       * Counter block mode compatible with  Dr Brian Gladman fileenc.c
       * derived from CryptoJS.mode.CTR
       * Jan Hruby jhruby.web@gmail.com
       */
      return t.mode.CTRGladman = function() {
        var n = t.lib.BlockCipherMode.extend();
        function o(s) {
          if ((s >> 24 & 255) === 255) {
            var u = s >> 16 & 255, a = s >> 8 & 255, l = s & 255;
            u === 255 ? (u = 0, a === 255 ? (a = 0, l === 255 ? l = 0 : ++l) : ++a) : ++u, s = 0, s += u << 16, s += a << 8, s += l;
          } else
            s += 1 << 24;
          return s;
        }
        function i(s) {
          return (s[0] = o(s[0])) === 0 && (s[1] = o(s[1])), s;
        }
        var c = n.Encryptor = n.extend({
          processBlock: function(s, u) {
            var a = this._cipher, l = a.blockSize, h = this._iv, d = this._counter;
            h && (d = this._counter = h.slice(0), this._iv = void 0), i(d);
            var f = d.slice(0);
            a.encryptBlock(f, 0);
            for (var x = 0; x < l; x++)
              s[u + x] ^= f[x];
          }
        });
        return n.Decryptor = c, n;
      }(), t.mode.CTRGladman;
    });
  }($o)), $o.exports;
}
var Ko = { exports: {} }, sa;
function Zf() {
  return sa || (sa = 1, function(e, r) {
    (function(t, n, o) {
      e.exports = n(Y(), xe());
    })($, function(t) {
      return t.mode.OFB = function() {
        var n = t.lib.BlockCipherMode.extend(), o = n.Encryptor = n.extend({
          processBlock: function(i, c) {
            var s = this._cipher, u = s.blockSize, a = this._iv, l = this._keystream;
            a && (l = this._keystream = a.slice(0), this._iv = void 0), s.encryptBlock(l, 0);
            for (var h = 0; h < u; h++)
              i[c + h] ^= l[h];
          }
        });
        return n.Decryptor = o, n;
      }(), t.mode.OFB;
    });
  }(Ko)), Ko.exports;
}
var Vo = { exports: {} }, ca;
function Yf() {
  return ca || (ca = 1, function(e, r) {
    (function(t, n, o) {
      e.exports = n(Y(), xe());
    })($, function(t) {
      return t.mode.ECB = function() {
        var n = t.lib.BlockCipherMode.extend();
        return n.Encryptor = n.extend({
          processBlock: function(o, i) {
            this._cipher.encryptBlock(o, i);
          }
        }), n.Decryptor = n.extend({
          processBlock: function(o, i) {
            this._cipher.decryptBlock(o, i);
          }
        }), n;
      }(), t.mode.ECB;
    });
  }(Vo)), Vo.exports;
}
var qo = { exports: {} }, la;
function Xf() {
  return la || (la = 1, function(e, r) {
    (function(t, n, o) {
      e.exports = n(Y(), xe());
    })($, function(t) {
      return t.pad.AnsiX923 = {
        pad: function(n, o) {
          var i = n.sigBytes, c = o * 4, s = c - i % c, u = i + s - 1;
          n.clamp(), n.words[u >>> 2] |= s << 24 - u % 4 * 8, n.sigBytes += s;
        },
        unpad: function(n) {
          var o = n.words[n.sigBytes - 1 >>> 2] & 255;
          n.sigBytes -= o;
        }
      }, t.pad.Ansix923;
    });
  }(qo)), qo.exports;
}
var Go = { exports: {} }, ua;
function Jf() {
  return ua || (ua = 1, function(e, r) {
    (function(t, n, o) {
      e.exports = n(Y(), xe());
    })($, function(t) {
      return t.pad.Iso10126 = {
        pad: function(n, o) {
          var i = o * 4, c = i - n.sigBytes % i;
          n.concat(t.lib.WordArray.random(c - 1)).concat(t.lib.WordArray.create([c << 24], 1));
        },
        unpad: function(n) {
          var o = n.words[n.sigBytes - 1 >>> 2] & 255;
          n.sigBytes -= o;
        }
      }, t.pad.Iso10126;
    });
  }(Go)), Go.exports;
}
var Zo = { exports: {} }, fa;
function Qf() {
  return fa || (fa = 1, function(e, r) {
    (function(t, n, o) {
      e.exports = n(Y(), xe());
    })($, function(t) {
      return t.pad.Iso97971 = {
        pad: function(n, o) {
          n.concat(t.lib.WordArray.create([2147483648], 1)), t.pad.ZeroPadding.pad(n, o);
        },
        unpad: function(n) {
          t.pad.ZeroPadding.unpad(n), n.sigBytes--;
        }
      }, t.pad.Iso97971;
    });
  }(Zo)), Zo.exports;
}
var Yo = { exports: {} }, da;
function ed() {
  return da || (da = 1, function(e, r) {
    (function(t, n, o) {
      e.exports = n(Y(), xe());
    })($, function(t) {
      return t.pad.ZeroPadding = {
        pad: function(n, o) {
          var i = o * 4;
          n.clamp(), n.sigBytes += i - (n.sigBytes % i || i);
        },
        unpad: function(n) {
          for (var o = n.words, i = n.sigBytes - 1, i = n.sigBytes - 1; i >= 0; i--)
            if (o[i >>> 2] >>> 24 - i % 4 * 8 & 255) {
              n.sigBytes = i + 1;
              break;
            }
        }
      }, t.pad.ZeroPadding;
    });
  }(Yo)), Yo.exports;
}
var Xo = { exports: {} }, ha;
function td() {
  return ha || (ha = 1, function(e, r) {
    (function(t, n, o) {
      e.exports = n(Y(), xe());
    })($, function(t) {
      return t.pad.NoPadding = {
        pad: function() {
        },
        unpad: function() {
        }
      }, t.pad.NoPadding;
    });
  }(Xo)), Xo.exports;
}
var Jo = { exports: {} }, xa;
function rd() {
  return xa || (xa = 1, function(e, r) {
    (function(t, n, o) {
      e.exports = n(Y(), xe());
    })($, function(t) {
      return function(n) {
        var o = t, i = o.lib, c = i.CipherParams, s = o.enc, u = s.Hex, a = o.format;
        a.Hex = {
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
          stringify: function(l) {
            return l.ciphertext.toString(u);
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
          parse: function(l) {
            var h = u.parse(l);
            return c.create({ ciphertext: h });
          }
        };
      }(), t.format.Hex;
    });
  }(Jo)), Jo.exports;
}
var Qo = { exports: {} }, pa;
function nd() {
  return pa || (pa = 1, function(e, r) {
    (function(t, n, o) {
      e.exports = n(Y(), Kt(), Vt(), St(), xe());
    })($, function(t) {
      return function() {
        var n = t, o = n.lib, i = o.BlockCipher, c = n.algo, s = [], u = [], a = [], l = [], h = [], d = [], f = [], x = [], v = [], w = [];
        (function() {
          for (var g = [], y = 0; y < 256; y++)
            y < 128 ? g[y] = y << 1 : g[y] = y << 1 ^ 283;
          for (var b = 0, A = 0, y = 0; y < 256; y++) {
            var m = A ^ A << 1 ^ A << 2 ^ A << 3 ^ A << 4;
            m = m >>> 8 ^ m & 255 ^ 99, s[b] = m, u[m] = b;
            var C = g[b], S = g[C], E = g[S], k = g[m] * 257 ^ m * 16843008;
            a[b] = k << 24 | k >>> 8, l[b] = k << 16 | k >>> 16, h[b] = k << 8 | k >>> 24, d[b] = k;
            var k = E * 16843009 ^ S * 65537 ^ C * 257 ^ b * 16843008;
            f[m] = k << 24 | k >>> 8, x[m] = k << 16 | k >>> 16, v[m] = k << 8 | k >>> 24, w[m] = k, b ? (b = C ^ g[g[g[E ^ C]]], A ^= g[g[A]]) : b = A = 1;
          }
        })();
        var _ = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54], p = c.AES = i.extend({
          _doReset: function() {
            var g;
            if (!(this._nRounds && this._keyPriorReset === this._key)) {
              for (var y = this._keyPriorReset = this._key, b = y.words, A = y.sigBytes / 4, m = this._nRounds = A + 6, C = (m + 1) * 4, S = this._keySchedule = [], E = 0; E < C; E++)
                E < A ? S[E] = b[E] : (g = S[E - 1], E % A ? A > 6 && E % A == 4 && (g = s[g >>> 24] << 24 | s[g >>> 16 & 255] << 16 | s[g >>> 8 & 255] << 8 | s[g & 255]) : (g = g << 8 | g >>> 24, g = s[g >>> 24] << 24 | s[g >>> 16 & 255] << 16 | s[g >>> 8 & 255] << 8 | s[g & 255], g ^= _[E / A | 0] << 24), S[E] = S[E - A] ^ g);
              for (var k = this._invKeySchedule = [], T = 0; T < C; T++) {
                var E = C - T;
                if (T % 4)
                  var g = S[E];
                else
                  var g = S[E - 4];
                T < 4 || E <= 4 ? k[T] = g : k[T] = f[s[g >>> 24]] ^ x[s[g >>> 16 & 255]] ^ v[s[g >>> 8 & 255]] ^ w[s[g & 255]];
              }
            }
          },
          encryptBlock: function(g, y) {
            this._doCryptBlock(g, y, this._keySchedule, a, l, h, d, s);
          },
          decryptBlock: function(g, y) {
            var b = g[y + 1];
            g[y + 1] = g[y + 3], g[y + 3] = b, this._doCryptBlock(g, y, this._invKeySchedule, f, x, v, w, u);
            var b = g[y + 1];
            g[y + 1] = g[y + 3], g[y + 3] = b;
          },
          _doCryptBlock: function(g, y, b, A, m, C, S, E) {
            for (var k = this._nRounds, T = g[y] ^ b[0], R = g[y + 1] ^ b[1], z = g[y + 2] ^ b[2], H = g[y + 3] ^ b[3], L = 4, Q = 1; Q < k; Q++) {
              var K = A[T >>> 24] ^ m[R >>> 16 & 255] ^ C[z >>> 8 & 255] ^ S[H & 255] ^ b[L++], J = A[R >>> 24] ^ m[z >>> 16 & 255] ^ C[H >>> 8 & 255] ^ S[T & 255] ^ b[L++], V = A[z >>> 24] ^ m[H >>> 16 & 255] ^ C[T >>> 8 & 255] ^ S[R & 255] ^ b[L++], O = A[H >>> 24] ^ m[T >>> 16 & 255] ^ C[R >>> 8 & 255] ^ S[z & 255] ^ b[L++];
              T = K, R = J, z = V, H = O;
            }
            var K = (E[T >>> 24] << 24 | E[R >>> 16 & 255] << 16 | E[z >>> 8 & 255] << 8 | E[H & 255]) ^ b[L++], J = (E[R >>> 24] << 24 | E[z >>> 16 & 255] << 16 | E[H >>> 8 & 255] << 8 | E[T & 255]) ^ b[L++], V = (E[z >>> 24] << 24 | E[H >>> 16 & 255] << 16 | E[T >>> 8 & 255] << 8 | E[R & 255]) ^ b[L++], O = (E[H >>> 24] << 24 | E[T >>> 16 & 255] << 16 | E[R >>> 8 & 255] << 8 | E[z & 255]) ^ b[L++];
            g[y] = K, g[y + 1] = J, g[y + 2] = V, g[y + 3] = O;
          },
          keySize: 256 / 32
        });
        n.AES = i._createHelper(p);
      }(), t.AES;
    });
  }(Qo)), Qo.exports;
}
var e0 = { exports: {} }, ga;
function od() {
  return ga || (ga = 1, function(e, r) {
    (function(t, n, o) {
      e.exports = n(Y(), Kt(), Vt(), St(), xe());
    })($, function(t) {
      return function() {
        var n = t, o = n.lib, i = o.WordArray, c = o.BlockCipher, s = n.algo, u = [
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
        ], a = [
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
        ], l = [1, 2, 4, 6, 8, 10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28], h = [
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
        ], f = s.DES = c.extend({
          _doReset: function() {
            for (var _ = this._key, p = _.words, g = [], y = 0; y < 56; y++) {
              var b = u[y] - 1;
              g[y] = p[b >>> 5] >>> 31 - b % 32 & 1;
            }
            for (var A = this._subKeys = [], m = 0; m < 16; m++) {
              for (var C = A[m] = [], S = l[m], y = 0; y < 24; y++)
                C[y / 6 | 0] |= g[(a[y] - 1 + S) % 28] << 31 - y % 6, C[4 + (y / 6 | 0)] |= g[28 + (a[y + 24] - 1 + S) % 28] << 31 - y % 6;
              C[0] = C[0] << 1 | C[0] >>> 31;
              for (var y = 1; y < 7; y++)
                C[y] = C[y] >>> (y - 1) * 4 + 3;
              C[7] = C[7] << 5 | C[7] >>> 27;
            }
            for (var E = this._invSubKeys = [], y = 0; y < 16; y++)
              E[y] = A[15 - y];
          },
          encryptBlock: function(_, p) {
            this._doCryptBlock(_, p, this._subKeys);
          },
          decryptBlock: function(_, p) {
            this._doCryptBlock(_, p, this._invSubKeys);
          },
          _doCryptBlock: function(_, p, g) {
            this._lBlock = _[p], this._rBlock = _[p + 1], x.call(this, 4, 252645135), x.call(this, 16, 65535), v.call(this, 2, 858993459), v.call(this, 8, 16711935), x.call(this, 1, 1431655765);
            for (var y = 0; y < 16; y++) {
              for (var b = g[y], A = this._lBlock, m = this._rBlock, C = 0, S = 0; S < 8; S++)
                C |= h[S][((m ^ b[S]) & d[S]) >>> 0];
              this._lBlock = m, this._rBlock = A ^ C;
            }
            var E = this._lBlock;
            this._lBlock = this._rBlock, this._rBlock = E, x.call(this, 1, 1431655765), v.call(this, 8, 16711935), v.call(this, 2, 858993459), x.call(this, 16, 65535), x.call(this, 4, 252645135), _[p] = this._lBlock, _[p + 1] = this._rBlock;
          },
          keySize: 64 / 32,
          ivSize: 64 / 32,
          blockSize: 64 / 32
        });
        function x(_, p) {
          var g = (this._lBlock >>> _ ^ this._rBlock) & p;
          this._rBlock ^= g, this._lBlock ^= g << _;
        }
        function v(_, p) {
          var g = (this._rBlock >>> _ ^ this._lBlock) & p;
          this._lBlock ^= g, this._rBlock ^= g << _;
        }
        n.DES = c._createHelper(f);
        var w = s.TripleDES = c.extend({
          _doReset: function() {
            var _ = this._key, p = _.words;
            if (p.length !== 2 && p.length !== 4 && p.length < 6)
              throw new Error("Invalid key length - 3DES requires the key length to be 64, 128, 192 or >192.");
            var g = p.slice(0, 2), y = p.length < 4 ? p.slice(0, 2) : p.slice(2, 4), b = p.length < 6 ? p.slice(0, 2) : p.slice(4, 6);
            this._des1 = f.createEncryptor(i.create(g)), this._des2 = f.createEncryptor(i.create(y)), this._des3 = f.createEncryptor(i.create(b));
          },
          encryptBlock: function(_, p) {
            this._des1.encryptBlock(_, p), this._des2.decryptBlock(_, p), this._des3.encryptBlock(_, p);
          },
          decryptBlock: function(_, p) {
            this._des3.decryptBlock(_, p), this._des2.encryptBlock(_, p), this._des1.decryptBlock(_, p);
          },
          keySize: 192 / 32,
          ivSize: 64 / 32,
          blockSize: 64 / 32
        });
        n.TripleDES = c._createHelper(w);
      }(), t.TripleDES;
    });
  }(e0)), e0.exports;
}
var t0 = { exports: {} }, ya;
function id() {
  return ya || (ya = 1, function(e, r) {
    (function(t, n, o) {
      e.exports = n(Y(), Kt(), Vt(), St(), xe());
    })($, function(t) {
      return function() {
        var n = t, o = n.lib, i = o.StreamCipher, c = n.algo, s = c.RC4 = i.extend({
          _doReset: function() {
            for (var l = this._key, h = l.words, d = l.sigBytes, f = this._S = [], x = 0; x < 256; x++)
              f[x] = x;
            for (var x = 0, v = 0; x < 256; x++) {
              var w = x % d, _ = h[w >>> 2] >>> 24 - w % 4 * 8 & 255;
              v = (v + f[x] + _) % 256;
              var p = f[x];
              f[x] = f[v], f[v] = p;
            }
            this._i = this._j = 0;
          },
          _doProcessBlock: function(l, h) {
            l[h] ^= u.call(this);
          },
          keySize: 256 / 32,
          ivSize: 0
        });
        function u() {
          for (var l = this._S, h = this._i, d = this._j, f = 0, x = 0; x < 4; x++) {
            h = (h + 1) % 256, d = (d + l[h]) % 256;
            var v = l[h];
            l[h] = l[d], l[d] = v, f |= l[(l[h] + l[d]) % 256] << 24 - x * 8;
          }
          return this._i = h, this._j = d, f;
        }
        n.RC4 = i._createHelper(s);
        var a = c.RC4Drop = s.extend({
          /**
           * Configuration options.
           *
           * @property {number} drop The number of keystream words to drop. Default 192
           */
          cfg: s.cfg.extend({
            drop: 192
          }),
          _doReset: function() {
            s._doReset.call(this);
            for (var l = this.cfg.drop; l > 0; l--)
              u.call(this);
          }
        });
        n.RC4Drop = i._createHelper(a);
      }(), t.RC4;
    });
  }(t0)), t0.exports;
}
var r0 = { exports: {} }, wa;
function ad() {
  return wa || (wa = 1, function(e, r) {
    (function(t, n, o) {
      e.exports = n(Y(), Kt(), Vt(), St(), xe());
    })($, function(t) {
      return function() {
        var n = t, o = n.lib, i = o.StreamCipher, c = n.algo, s = [], u = [], a = [], l = c.Rabbit = i.extend({
          _doReset: function() {
            for (var d = this._key.words, f = this.cfg.iv, x = 0; x < 4; x++)
              d[x] = (d[x] << 8 | d[x] >>> 24) & 16711935 | (d[x] << 24 | d[x] >>> 8) & 4278255360;
            var v = this._X = [
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
            for (var x = 0; x < 4; x++)
              h.call(this);
            for (var x = 0; x < 8; x++)
              w[x] ^= v[x + 4 & 7];
            if (f) {
              var _ = f.words, p = _[0], g = _[1], y = (p << 8 | p >>> 24) & 16711935 | (p << 24 | p >>> 8) & 4278255360, b = (g << 8 | g >>> 24) & 16711935 | (g << 24 | g >>> 8) & 4278255360, A = y >>> 16 | b & 4294901760, m = b << 16 | y & 65535;
              w[0] ^= y, w[1] ^= A, w[2] ^= b, w[3] ^= m, w[4] ^= y, w[5] ^= A, w[6] ^= b, w[7] ^= m;
              for (var x = 0; x < 4; x++)
                h.call(this);
            }
          },
          _doProcessBlock: function(d, f) {
            var x = this._X;
            h.call(this), s[0] = x[0] ^ x[5] >>> 16 ^ x[3] << 16, s[1] = x[2] ^ x[7] >>> 16 ^ x[5] << 16, s[2] = x[4] ^ x[1] >>> 16 ^ x[7] << 16, s[3] = x[6] ^ x[3] >>> 16 ^ x[1] << 16;
            for (var v = 0; v < 4; v++)
              s[v] = (s[v] << 8 | s[v] >>> 24) & 16711935 | (s[v] << 24 | s[v] >>> 8) & 4278255360, d[f + v] ^= s[v];
          },
          blockSize: 128 / 32,
          ivSize: 64 / 32
        });
        function h() {
          for (var d = this._X, f = this._C, x = 0; x < 8; x++)
            u[x] = f[x];
          f[0] = f[0] + 1295307597 + this._b | 0, f[1] = f[1] + 3545052371 + (f[0] >>> 0 < u[0] >>> 0 ? 1 : 0) | 0, f[2] = f[2] + 886263092 + (f[1] >>> 0 < u[1] >>> 0 ? 1 : 0) | 0, f[3] = f[3] + 1295307597 + (f[2] >>> 0 < u[2] >>> 0 ? 1 : 0) | 0, f[4] = f[4] + 3545052371 + (f[3] >>> 0 < u[3] >>> 0 ? 1 : 0) | 0, f[5] = f[5] + 886263092 + (f[4] >>> 0 < u[4] >>> 0 ? 1 : 0) | 0, f[6] = f[6] + 1295307597 + (f[5] >>> 0 < u[5] >>> 0 ? 1 : 0) | 0, f[7] = f[7] + 3545052371 + (f[6] >>> 0 < u[6] >>> 0 ? 1 : 0) | 0, this._b = f[7] >>> 0 < u[7] >>> 0 ? 1 : 0;
          for (var x = 0; x < 8; x++) {
            var v = d[x] + f[x], w = v & 65535, _ = v >>> 16, p = ((w * w >>> 17) + w * _ >>> 15) + _ * _, g = ((v & 4294901760) * v | 0) + ((v & 65535) * v | 0);
            a[x] = p ^ g;
          }
          d[0] = a[0] + (a[7] << 16 | a[7] >>> 16) + (a[6] << 16 | a[6] >>> 16) | 0, d[1] = a[1] + (a[0] << 8 | a[0] >>> 24) + a[7] | 0, d[2] = a[2] + (a[1] << 16 | a[1] >>> 16) + (a[0] << 16 | a[0] >>> 16) | 0, d[3] = a[3] + (a[2] << 8 | a[2] >>> 24) + a[1] | 0, d[4] = a[4] + (a[3] << 16 | a[3] >>> 16) + (a[2] << 16 | a[2] >>> 16) | 0, d[5] = a[5] + (a[4] << 8 | a[4] >>> 24) + a[3] | 0, d[6] = a[6] + (a[5] << 16 | a[5] >>> 16) + (a[4] << 16 | a[4] >>> 16) | 0, d[7] = a[7] + (a[6] << 8 | a[6] >>> 24) + a[5] | 0;
        }
        n.Rabbit = i._createHelper(l);
      }(), t.Rabbit;
    });
  }(r0)), r0.exports;
}
var n0 = { exports: {} }, va;
function sd() {
  return va || (va = 1, function(e, r) {
    (function(t, n, o) {
      e.exports = n(Y(), Kt(), Vt(), St(), xe());
    })($, function(t) {
      return function() {
        var n = t, o = n.lib, i = o.StreamCipher, c = n.algo, s = [], u = [], a = [], l = c.RabbitLegacy = i.extend({
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
            for (var w = 0; w < 4; w++)
              h.call(this);
            for (var w = 0; w < 8; w++)
              v[w] ^= x[w + 4 & 7];
            if (f) {
              var _ = f.words, p = _[0], g = _[1], y = (p << 8 | p >>> 24) & 16711935 | (p << 24 | p >>> 8) & 4278255360, b = (g << 8 | g >>> 24) & 16711935 | (g << 24 | g >>> 8) & 4278255360, A = y >>> 16 | b & 4294901760, m = b << 16 | y & 65535;
              v[0] ^= y, v[1] ^= A, v[2] ^= b, v[3] ^= m, v[4] ^= y, v[5] ^= A, v[6] ^= b, v[7] ^= m;
              for (var w = 0; w < 4; w++)
                h.call(this);
            }
          },
          _doProcessBlock: function(d, f) {
            var x = this._X;
            h.call(this), s[0] = x[0] ^ x[5] >>> 16 ^ x[3] << 16, s[1] = x[2] ^ x[7] >>> 16 ^ x[5] << 16, s[2] = x[4] ^ x[1] >>> 16 ^ x[7] << 16, s[3] = x[6] ^ x[3] >>> 16 ^ x[1] << 16;
            for (var v = 0; v < 4; v++)
              s[v] = (s[v] << 8 | s[v] >>> 24) & 16711935 | (s[v] << 24 | s[v] >>> 8) & 4278255360, d[f + v] ^= s[v];
          },
          blockSize: 128 / 32,
          ivSize: 64 / 32
        });
        function h() {
          for (var d = this._X, f = this._C, x = 0; x < 8; x++)
            u[x] = f[x];
          f[0] = f[0] + 1295307597 + this._b | 0, f[1] = f[1] + 3545052371 + (f[0] >>> 0 < u[0] >>> 0 ? 1 : 0) | 0, f[2] = f[2] + 886263092 + (f[1] >>> 0 < u[1] >>> 0 ? 1 : 0) | 0, f[3] = f[3] + 1295307597 + (f[2] >>> 0 < u[2] >>> 0 ? 1 : 0) | 0, f[4] = f[4] + 3545052371 + (f[3] >>> 0 < u[3] >>> 0 ? 1 : 0) | 0, f[5] = f[5] + 886263092 + (f[4] >>> 0 < u[4] >>> 0 ? 1 : 0) | 0, f[6] = f[6] + 1295307597 + (f[5] >>> 0 < u[5] >>> 0 ? 1 : 0) | 0, f[7] = f[7] + 3545052371 + (f[6] >>> 0 < u[6] >>> 0 ? 1 : 0) | 0, this._b = f[7] >>> 0 < u[7] >>> 0 ? 1 : 0;
          for (var x = 0; x < 8; x++) {
            var v = d[x] + f[x], w = v & 65535, _ = v >>> 16, p = ((w * w >>> 17) + w * _ >>> 15) + _ * _, g = ((v & 4294901760) * v | 0) + ((v & 65535) * v | 0);
            a[x] = p ^ g;
          }
          d[0] = a[0] + (a[7] << 16 | a[7] >>> 16) + (a[6] << 16 | a[6] >>> 16) | 0, d[1] = a[1] + (a[0] << 8 | a[0] >>> 24) + a[7] | 0, d[2] = a[2] + (a[1] << 16 | a[1] >>> 16) + (a[0] << 16 | a[0] >>> 16) | 0, d[3] = a[3] + (a[2] << 8 | a[2] >>> 24) + a[1] | 0, d[4] = a[4] + (a[3] << 16 | a[3] >>> 16) + (a[2] << 16 | a[2] >>> 16) | 0, d[5] = a[5] + (a[4] << 8 | a[4] >>> 24) + a[3] | 0, d[6] = a[6] + (a[5] << 16 | a[5] >>> 16) + (a[4] << 16 | a[4] >>> 16) | 0, d[7] = a[7] + (a[6] << 8 | a[6] >>> 24) + a[5] | 0;
        }
        n.RabbitLegacy = i._createHelper(l);
      }(), t.RabbitLegacy;
    });
  }(n0)), n0.exports;
}
var o0 = { exports: {} }, _a;
function cd() {
  return _a || (_a = 1, function(e, r) {
    (function(t, n, o) {
      e.exports = n(Y(), Kt(), Vt(), St(), xe());
    })($, function(t) {
      return function() {
        var n = t, o = n.lib, i = o.BlockCipher, c = n.algo;
        const s = 16, u = [
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
        ], a = [
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
        var l = {
          pbox: [],
          sbox: []
        };
        function h(w, _) {
          let p = _ >> 24 & 255, g = _ >> 16 & 255, y = _ >> 8 & 255, b = _ & 255, A = w.sbox[0][p] + w.sbox[1][g];
          return A = A ^ w.sbox[2][y], A = A + w.sbox[3][b], A;
        }
        function d(w, _, p) {
          let g = _, y = p, b;
          for (let A = 0; A < s; ++A)
            g = g ^ w.pbox[A], y = h(w, g) ^ y, b = g, g = y, y = b;
          return b = g, g = y, y = b, y = y ^ w.pbox[s], g = g ^ w.pbox[s + 1], { left: g, right: y };
        }
        function f(w, _, p) {
          let g = _, y = p, b;
          for (let A = s + 1; A > 1; --A)
            g = g ^ w.pbox[A], y = h(w, g) ^ y, b = g, g = y, y = b;
          return b = g, g = y, y = b, y = y ^ w.pbox[1], g = g ^ w.pbox[0], { left: g, right: y };
        }
        function x(w, _, p) {
          for (let m = 0; m < 4; m++) {
            w.sbox[m] = [];
            for (let C = 0; C < 256; C++)
              w.sbox[m][C] = a[m][C];
          }
          let g = 0;
          for (let m = 0; m < s + 2; m++)
            w.pbox[m] = u[m] ^ _[g], g++, g >= p && (g = 0);
          let y = 0, b = 0, A = 0;
          for (let m = 0; m < s + 2; m += 2)
            A = d(w, y, b), y = A.left, b = A.right, w.pbox[m] = y, w.pbox[m + 1] = b;
          for (let m = 0; m < 4; m++)
            for (let C = 0; C < 256; C += 2)
              A = d(w, y, b), y = A.left, b = A.right, w.sbox[m][C] = y, w.sbox[m][C + 1] = b;
          return !0;
        }
        var v = c.Blowfish = i.extend({
          _doReset: function() {
            if (this._keyPriorReset !== this._key) {
              var w = this._keyPriorReset = this._key, _ = w.words, p = w.sigBytes / 4;
              x(l, _, p);
            }
          },
          encryptBlock: function(w, _) {
            var p = d(l, w[_], w[_ + 1]);
            w[_] = p.left, w[_ + 1] = p.right;
          },
          decryptBlock: function(w, _) {
            var p = f(l, w[_], w[_ + 1]);
            w[_] = p.left, w[_ + 1] = p.right;
          },
          blockSize: 64 / 32,
          keySize: 128 / 32,
          ivSize: 64 / 32
        });
        n.Blowfish = i._createHelper(v);
      }(), t.Blowfish;
    });
  }(o0)), o0.exports;
}
(function(e, r) {
  (function(t, n, o) {
    e.exports = n(Y(), Jn(), Lf(), Uf(), Kt(), Mf(), Vt(), lc(), si(), Pf(), uc(), Wf(), jf(), $f(), ci(), Kf(), St(), xe(), Vf(), qf(), Gf(), Zf(), Yf(), Xf(), Jf(), Qf(), ed(), td(), rd(), nd(), od(), id(), ad(), sd(), cd());
  })($, function(t) {
    return t;
  });
})(cc);
var Qn = cc.exports;
const ue = /* @__PURE__ */ Rf(Qn);
function fc(e) {
  return new Uint8Array([
    e >> 24 & 255,
    e >> 16 & 255,
    e >> 8 & 255,
    e & 255
  ]);
}
function li(e) {
  const r = e.words, t = new Uint8Array(r.length * 4);
  for (let n = 0; n < r.length * 4; n++)
    t[n] = r[n >>> 2] >>> 24 - n % 4 * 8 & 255;
  return t;
}
const Gn = class Gn {
  constructor() {
    de(this, "stateCounter", 1);
    de(this, "seedCounter", 1);
    de(this, "state");
    de(this, "seed");
    this.seed = new Uint8Array(64).fill(0), this.state = new Uint8Array(64).fill(0);
  }
  digestAddCounter(r) {
    const t = new Uint8Array(8);
    return t[0] = r & 255, t[1] = r >>> 8 & 255, t[2] = r >>> 16 & 255, t[3] = r >>> 24 & 255, t[4] = 0, t[5] = 0, t[6] = 0, t[7] = 0, t;
  }
  digest(r) {
    const t = ue.lib.WordArray.create(r), n = ue.SHA512(t);
    return li(n);
  }
  cycleSeed() {
    const r = this.digestAddCounter(this.seedCounter++), t = [...this.seed, ...r];
    this.seed = this.digest(new Uint8Array(t));
  }
  generateState() {
    const t = [...this.digestAddCounter(this.stateCounter++), ...this.state, ...this.seed];
    this.state = this.digest(new Uint8Array(t)), this.stateCounter % Gn.CYCLE_COUNT === 0 && this.cycleSeed();
  }
  addSeedMaterial(r) {
    const t = [...r, ...this.seed];
    this.seed = this.digest(new Uint8Array(t));
  }
  nextBytes(r) {
    const t = new Uint8Array(r);
    let n = 0;
    const o = Math.ceil(r / this.state.length);
    for (let i = 0; i < o; i++) {
      this.generateState();
      const c = r - n, s = Math.min(this.state.length, c);
      t.set(this.state.subarray(0, s), n), n += s;
    }
    return t;
  }
};
de(Gn, "CYCLE_COUNT", 10);
let Un = Gn;
class It {
  static deriveAccountTag(r, t) {
    const { secret: n, prng: o } = this.deriveSeed(r, t);
    return Mt.create("", n, void 0, (c) => {
      if (o) {
        const s = c.length, u = o.nextBytes(s);
        c.set(u);
      }
    }).getAddrTag();
  }
  static deriveSeed(r, t) {
    const n = fc(t), o = [...r, ...n], i = ue.lib.WordArray.create(new Uint8Array(o)), c = ue.SHA512(i), s = li(c), u = new Un();
    return u.addSeedMaterial(s), { secret: new Uint8Array(u.nextBytes(32)), prng: u };
  }
  static deriveWotsSeedAndAddress(r, t, n) {
    if (t < 0)
      throw new Error("Invalid wots index");
    const o = Buffer.from(n, "hex");
    if (o.length !== 20) throw new Error("Invalid tag length, expected 20  bytes, got " + o.length);
    const i = this.deriveSeed(r, t), c = Mt.create("", i.secret, o, (s) => {
      if (i.prng) {
        const u = s.length, a = i.prng.nextBytes(u);
        s.set(a);
      }
    });
    return { secret: c.getSecret(), address: c.getAddress(), wotsWallet: c };
  }
}
const ba = process.env.NODE_ENV === "test" ? 1e3 : 1e5;
class ve {
  constructor(r, t) {
    de(this, "seed");
    de(this, "entropy");
    // Store original entropy for phrase generation
    de(this, "_isLocked", !0);
    this.seed = r, this.entropy = t, this._isLocked = !1;
  }
  /**
   * Creates a new master seed with random entropy
   */
  static async create() {
    const r = Kl();
    return new ve(r);
  }
  /**
   * Creates a master seed from a BIP39 mnemonic phrase
   */
  static async fromPhrase(r) {
    try {
      if (!Df(r, vn))
        throw new Error("Invalid seed phrase");
      const n = sc(r, vn), o = await Tf(r), i = new Uint8Array(o.slice(0, 32));
      return new ve(i, n);
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
        return Ui(this.entropy, vn);
      const r = new Uint8Array(32);
      return r.set(this.seed), Ui(r, vn);
    } catch (r) {
      throw console.error("Phrase generation error:", r), new Error("Failed to generate seed phrase");
    }
  }
  /**
   * Locks the master seed by wiping it from memory
   */
  lock() {
    this.seed && (Tn(this.seed), this.seed = void 0), this.entropy && (Tn(this.entropy), this.entropy = void 0), this._isLocked = !0;
  }
  /**
   * Checks if the master seed is locked
   */
  get isLocked() {
    return this._isLocked;
  }
  deriveAccount(r) {
    if (this._isLocked || !this.seed)
      throw new Error("Master seed is locked");
    const t = It.deriveAccountTag(this.seed, r), { secret: n, prng: o } = It.deriveSeed(this.seed, r), i = ae.generateRandomAddress(new Uint8Array(12).fill(1), n, (c) => {
      if (o) {
        const s = c.length, u = o.nextBytes(s);
        c.set(u);
      }
    });
    return {
      tag: Buffer.from(t).toString("hex"),
      seed: n,
      wotsSeed: n,
      address: i
    };
  }
  /**
   * Derives an account seed for the given index
   * @throws Error if the master seed is locked
   */
  deriveAccountSeed(r) {
    if (this._isLocked || !this.seed)
      throw new Error("Master seed is locked");
    return It.deriveSeed(this.seed, r).secret;
  }
  /**
   * Derives an account tag for the given index
   * @throws Error if the master seed is locked
   */
  async deriveAccountTag(r) {
    if (this._isLocked || !this.seed)
      throw new Error("Master seed is locked");
    return It.deriveAccountTag(this.seed, r);
  }
  static deriveWotsIndexFromWotsAddrHash(r, t, n, o = 0, i = 1e4) {
    if (!r) throw new Error("Account seed is empty");
    let c = -1;
    const s = Ut.wotsAddressFromBytes(n.slice(0, 2144));
    if (Buffer.from(s.getAddrHash()).toString("hex") === Buffer.from(t).toString("hex"))
      return -1;
    for (let u = o; u < i; u++) {
      const a = It.deriveSeed(r, u), l = Mt.create("", a.secret, void 0, (h) => {
        if (a.prng) {
          const d = h.length, f = a.prng.nextBytes(d);
          h.set(f);
        }
      });
      if (Buffer.from(l.getAddrHash()).toString("hex") === Buffer.from(t).toString("hex")) {
        c = u;
        break;
      }
    }
    return c;
  }
  /**
   * Exports the master seed in encrypted form
   */
  async export(r) {
    if (!this.seed)
      throw new Error("No seed to export");
    const t = crypto.getRandomValues(new Uint8Array(16)), n = crypto.getRandomValues(new Uint8Array(16)), o = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(r),
      "PBKDF2",
      !1,
      ["deriveBits", "deriveKey"]
    ), i = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: t,
        iterations: ba,
        hash: "SHA-256"
      },
      o,
      { name: "AES-GCM", length: 256 },
      !1,
      ["encrypt"]
    ), c = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: n },
      i,
      this.seed
    );
    return {
      data: Buffer.from(c).toString("base64"),
      iv: Buffer.from(n).toString("base64"),
      salt: Buffer.from(t).toString("base64")
    };
  }
  static async deriveKey(r, t) {
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
        salt: Buffer.from(r.salt, "base64"),
        iterations: ba,
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
  static async import(r, t) {
    try {
      const n = Buffer.from(r.data, "base64"), o = Buffer.from(r.iv, "base64"), i = await this.deriveKey(r, t), c = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: o },
        i,
        n
      );
      return new ve(new Uint8Array(c));
    } catch (n) {
      throw console.error("Decryption error:", n), new Error("Failed to decrypt master seed - invalid password");
    }
  }
  static async importFromDerivedKey(r, t) {
    const n = Buffer.from(r.data, "base64"), o = Buffer.from(r.iv, "base64"), i = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: o },
      t,
      n
    );
    return new ve(new Uint8Array(i));
  }
  static async importFromDerivedKeyJWK(r, t) {
    const n = await crypto.subtle.importKey(
      "jwk",
      t,
      { name: "AES-GCM", length: 256 },
      !0,
      ["decrypt"]
    );
    return this.importFromDerivedKey(r, n);
  }
  /**
   * Derives a storage key from the master seed using HKDF-like construction
   * Returns a 32-byte key suitable for AES-256
   */
  deriveStorageKey() {
    if (this._isLocked || !this.seed)
      throw new Error("Master seed is locked");
    const r = ue.enc.Hex.parse(
      Buffer.from(this.seed).toString("hex")
    ), t = ue.SHA256(
      ue.enc.Utf8.parse("mochimo_storage_key_v1").concat(r)
    ), n = ue.HmacSHA256(
      t,
      "mochimo_storage_salt"
    ), o = ue.HmacSHA256(
      "mochimo_storage_info",
      n
    );
    return new Uint8Array(
      Buffer.from(o.toString(ue.enc.Hex), "hex")
    );
  }
  /**
   * Derives a storage key using native Web Crypto API
   */
  async deriveStorageKeyNative() {
    if (this._isLocked || !this.seed)
      throw new Error("Master seed is locked");
    const r = new TextEncoder(), t = r.encode("mochimo_storage_key_v1"), n = this.seed, o = new Uint8Array(t.length + n.length);
    o.set(t), o.set(n, t.length);
    const i = await crypto.subtle.digest("SHA-256", o), c = new Uint8Array(i), s = await crypto.subtle.importKey(
      "raw",
      r.encode("mochimo_storage_salt"),
      {
        name: "HMAC",
        hash: "SHA-256"
      },
      !1,
      ["sign"]
    ), u = await crypto.subtle.sign(
      "HMAC",
      s,
      c
    ), a = new Uint8Array(u), l = await crypto.subtle.importKey(
      "raw",
      a,
      {
        name: "HMAC",
        hash: "SHA-256"
      },
      !1,
      ["sign"]
    ), h = await crypto.subtle.sign(
      "HMAC",
      l,
      r.encode("mochimo_storage_info")
    );
    return new Uint8Array(h);
  }
}
var i0 = {
  symbol: "MCM",
  decimals: 9
}, ld = {
  blockchain: "mochimo",
  network: "mainnet"
}, ud = class Br {
  constructor() {
    this.isDebug = !1;
  }
  static getInstance() {
    return Br.instance || (Br.instance = new Br()), Br.instance;
  }
  enableDebug() {
    this.isDebug = !0;
  }
  replaceBigInt(r, t) {
    return typeof t == "bigint" ? t.toString() : t;
  }
  formatMessage(r, t, n) {
    const o = (/* @__PURE__ */ new Date()).toISOString(), i = n ? `
Data: ${JSON.stringify(n, this.replaceBigInt, 2)}` : "";
    return `[${o}] ${r.toUpperCase()}: ${t}${i}`;
  }
  debug(r, t) {
    this.isDebug && console.debug(this.formatMessage("debug", r, t));
  }
  info(r, t) {
    console.info(this.formatMessage("info", r, t));
  }
  warn(r, t) {
    console.warn(this.formatMessage("warn", r, t));
  }
  error(r, t) {
    console.error(this.formatMessage("error", r, t));
  }
}, se = ud.getInstance(), dc = class {
  constructor(e) {
    this.baseUrl = e, this.networkIdentifier = ld, se.debug("Construction initialized", { baseUrl: e, networkIdentifier: this.networkIdentifier });
  }
  headersToObject(e) {
    const r = {};
    return e.forEach((t, n) => {
      r[n] = t;
    }), r;
  }
  async handleResponse(e) {
    const r = await e.json();
    if (se.debug("API Response", {
      status: e.status,
      url: e.url,
      data: r,
      headers: this.headersToObject(e.headers)
    }), "code" in r)
      throw se.error("API Error", {
        endpoint: e.url,
        status: e.status,
        error: r
      }), new Error(`Rosetta API Error: ${r.message}`);
    return r;
  }
  async makeRequest(e, r) {
    const t = `${this.baseUrl}${e}`;
    se.debug(`Making request to ${e}`, {
      url: t,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: r
    });
    try {
      const n = await fetch(t, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(r)
      });
      return this.handleResponse(n);
    } catch (n) {
      throw se.error(`Request failed to ${e}`, {
        url: t,
        error: n instanceof Error ? n.message : n
      }), n;
    }
  }
  async derive(e, r) {
    return se.debug("Deriving address", { publicKey: e, tag: r }), this.makeRequest("/construction/derive", {
      network_identifier: this.networkIdentifier,
      public_key: {
        hex_bytes: e,
        curve_type: "wotsp"
      },
      metadata: { tag: r }
    });
  }
  async preprocess(e, r) {
    return se.debug("Preprocessing transaction", { operations: e, metadata: r }), this.makeRequest("/construction/preprocess", {
      network_identifier: this.networkIdentifier,
      operations: e,
      metadata: r
    });
  }
  async metadata(e, r) {
    return se.debug("Fetching metadata", { options: e, publicKeys: r }), this.makeRequest("/construction/metadata", {
      network_identifier: this.networkIdentifier,
      options: e,
      public_keys: r
    });
  }
  async payloads(e, r, t) {
    return se.debug("Fetching payloads", { operations: e, metadata: r, publicKeys: t }), this.makeRequest("/construction/payloads", {
      network_identifier: this.networkIdentifier,
      operations: e,
      metadata: r,
      public_keys: t
    });
  }
  async combine(e, r) {
    return se.debug("Combining transaction", { unsignedTransaction: e, signatures: r }), this.makeRequest("/construction/combine", {
      network_identifier: this.networkIdentifier,
      unsigned_transaction: e,
      signatures: r
    });
  }
  async submit(e) {
    return se.debug("Submitting transaction", { signedTransaction: e }), this.makeRequest("/construction/submit", {
      network_identifier: this.networkIdentifier,
      signed_transaction: e
    });
  }
  async parse(e, r) {
    return se.debug("Parsing transaction", { transaction: e, signed: r }), this.makeRequest("/construction/parse", {
      network_identifier: this.networkIdentifier,
      transaction: e,
      signed: r
    });
  }
  async resolveTag(e) {
    return this.makeRequest("/call", {
      network_identifier: this.networkIdentifier,
      parameters: {
        tag: e
      },
      method: "tag_resolve"
    });
  }
  async getAccountBalance(e) {
    return this.makeRequest("/account/balance", {
      network_identifier: this.networkIdentifier,
      account_identifier: { address: e }
    });
  }
  async getBlock(e) {
    return this.makeRequest("/block", {
      network_identifier: this.networkIdentifier,
      block_identifier: e
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
  async getBlockTransaction(e, r) {
    return this.makeRequest("/block/transaction", {
      network_identifier: this.networkIdentifier,
      block_identifier: e,
      transaction_identifier: { hash: r }
    });
  }
  /**
   * Search transactions by account address, with optional filters
   * @param address {string}
   * @param options {object} Optional: limit, offset, max_block, status
   */
  async searchTransactionsByAddress(e, r) {
    const t = {
      network_identifier: this.networkIdentifier,
      account_identifier: { address: e }
    };
    return r && (r.limit !== void 0 && (t.limit = r.limit), r.offset !== void 0 && (t.offset = r.offset), r.max_block !== void 0 && (t.max_block = r.max_block), r.status !== void 0 && (t.status = r.status)), this.makeRequest("/search/transactions", t);
  }
  /**
   * Search transactions by block index/hash, with optional filters
   * @param blockIdentifier {BlockIdentifier}
   * @param options {object} Optional: limit, offset, status
   */
  async searchTransactionsByBlock(e, r) {
    const t = {
      network_identifier: this.networkIdentifier,
      block_identifier: e
    };
    return r && (r.limit !== void 0 && (t.limit = r.limit), r.offset !== void 0 && (t.offset = r.offset), r.status !== void 0 && (t.status = r.status)), this.makeRequest("/search/transactions", t);
  }
  /**
   * Search transactions by transaction hash, with optional filters
   * @param transactionHash {string}
   * @param options {object} Optional: max_block, status
   */
  async searchTransactionsByTxId(e, r) {
    const t = {
      network_identifier: this.networkIdentifier,
      transaction_identifier: { hash: e }
    };
    return r && (r.max_block !== void 0 && (t.max_block = r.max_block), r.status !== void 0 && (t.status = r.status)), this.makeRequest("/search/transactions", t);
  }
  /**
   * Get block events (additions/removals) with optional limit/offset
   * @param options {object} Optional: limit, offset
   */
  async getEventsBlocks(e) {
    const r = {
      network_identifier: this.networkIdentifier
    };
    return e && (e.limit !== void 0 && (r.limit = e.limit), e.offset !== void 0 && (r.offset = e.offset)), this.makeRequest("/events/blocks", r);
  }
  /**
   * Get the richlist (accounts with highest balances)
   * @param options {object} Optional: ascending, offset, limit
   */
  async getStatsRichlist(e) {
    const r = {
      network_identifier: this.networkIdentifier
    };
    return e && (e.ascending !== void 0 && (r.ascending = e.ascending), e.offset !== void 0 && (r.offset = e.offset), e.limit !== void 0 && (r.limit = e.limit)), this.makeRequest("/stats/richlist", r);
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
    return se.debug("Fetching mempool transactions"), this.makeRequest("/mempool", {
      network_identifier: this.networkIdentifier
    });
  }
  /**
   * Get a specific transaction from the mempool
   * @param transactionHash - The hash of the transaction to fetch
   */
  async getMempoolTransaction(e) {
    return se.debug("Fetching mempool transaction", { transactionHash: e }), this.makeRequest("/mempool/transaction", {
      network_identifier: this.networkIdentifier,
      transaction_identifier: {
        hash: e
      }
    });
  }
  /**
   * Monitor the mempool for a specific transaction
   * @param transactionHash - The hash of the transaction to monitor
   * @param timeout - Maximum time to wait in milliseconds
   * @param interval - Check interval in milliseconds
   */
  async waitForTransaction(e, r = 6e4, t = 1e3) {
    se.debug("Monitoring mempool for transaction", {
      transactionHash: e,
      timeout: r,
      interval: t
    });
    const n = Date.now();
    for (; Date.now() - n < r; )
      try {
        return await this.getMempoolTransaction(e);
      } catch {
        if (Date.now() - n >= r)
          throw new Error(`Transaction ${e} not found in mempool after ${r}ms`);
        await new Promise((i) => setTimeout(i, t));
      }
    throw new Error(`Timeout waiting for transaction ${e}`);
  }
}, fd = class {
  constructor(e) {
    this.construction = new dc(e), se.debug("TransactionBuilder initialized", { baseUrl: e });
  }
  createTransactionBytes(e) {
    const r = e.sourceAddress.startsWith("0x") ? e.sourceAddress.slice(2) : e.sourceAddress, t = e.destinationTag.startsWith("0x") ? e.destinationTag.slice(2) : e.destinationTag, n = e.changePk.startsWith("0x") ? e.changePk.slice(2) : e.changePk, o = Buffer.alloc(2304);
    if (o.writeUInt32LE(0, 0), Buffer.from(r, "hex").copy(o, 4), Buffer.from(n, "hex").copy(o, 44), Buffer.from(t, "hex").copy(o, 84), o.writeBigUInt64LE(e.amount, 124), o.writeBigUInt64LE(e.fee, 132), o.writeUInt32LE(e.blockToLive, 140), e.memo) {
      const i = Buffer.from(e.memo);
      i.copy(o, 144, 0, Math.min(i.length, 32));
    }
    return o;
  }
  async buildTransaction(e) {
    var r;
    try {
      const t = {
        ...e,
        amount: e.amount.toString(),
        fee: e.fee.toString(),
        sourceBalance: (r = e.sourceBalance) == null ? void 0 : r.toString()
      };
      se.info("Building transaction", t);
      const n = this.createTransactionBytes(e);
      se.debug("Created transaction bytes", {
        length: n.length,
        hex: n.toString("hex")
      });
      const o = [
        {
          operation_identifier: { index: 0 },
          type: "SOURCE_TRANSFER",
          status: "SUCCESS",
          account: { address: e.sourceTag },
          amount: {
            value: (-e.amount).toString(),
            currency: i0
          }
        },
        {
          operation_identifier: { index: 1 },
          type: "DESTINATION_TRANSFER",
          status: "SUCCESS",
          account: { address: e.destinationTag },
          amount: {
            value: e.amount.toString(),
            currency: i0
          },
          metadata: { memo: e.memo || "" }
        },
        {
          operation_identifier: { index: 2 },
          type: "FEE",
          status: "SUCCESS",
          account: { address: e.sourceTag },
          amount: {
            value: e.fee.toString(),
            currency: i0
          }
        }
      ];
      se.debug("Created operations", o);
      const i = await this.construction.preprocess(o, {
        block_to_live: e.blockToLive.toString(),
        change_pk: e.changePk,
        change_addr: e.changePk,
        source_balance: e.sourceBalance ? e.sourceBalance.toString() : "179999501"
      });
      se.debug("Preprocess response", i);
      const c = await this.construction.metadata(
        i.options,
        [{ hex_bytes: e.publicKey, curve_type: "wotsp" }]
      );
      return se.debug("Metadata response", c), await this.construction.payloads(
        o,
        c.metadata,
        [{ hex_bytes: e.publicKey, curve_type: "wotsp" }]
      );
    } catch (t) {
      throw se.error("Error building transaction", t), t instanceof Error ? t : new Error("Unknown error occurred");
    }
  }
  async submitSignedTransaction(e) {
    return await this.construction.submit(e);
  }
  createSignature(e, r, t) {
    return {
      signing_payload: {
        hex_bytes: r,
        signature_type: "wotsp"
      },
      public_key: {
        hex_bytes: Buffer.from(e).toString("hex"),
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
  async submitAndMonitor(e, r = 6e4) {
    var n;
    const t = await this.submitSignedTransaction(e);
    if (se.debug("Transaction submitted", t), !((n = t.transaction_identifier) != null && n.hash))
      throw new Error("No transaction hash in submit response");
    return await this.construction.waitForTransaction(
      t.transaction_identifier.hash,
      r
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
  async getMempoolTransaction(e) {
    return this.construction.getMempoolTransaction(e);
  }
  async buildAndSignTransaction(e, r, t, n, o, i, c = 0) {
    const s = {
      sourceTag: "0x" + Buffer.from(e.getAddrTag()).toString("hex"),
      sourceAddress: "0x" + Buffer.from(e.getAddress()).toString("hex"),
      destinationTag: t,
      amount: n,
      fee: o,
      publicKey: Buffer.from(e.getWots().slice(0, 2144)).toString("hex"),
      changePk: "0x" + Buffer.from(r.getAddrHash()).toString("hex"),
      memo: i,
      blockToLive: c,
      sourceBalance: n + o
      // This should be fetched from network in production
    }, u = await this.buildTransaction(s), a = u.unsigned_transaction, l = e.sign(
      $e.hash(new Uint8Array(Buffer.from(a, "hex")))
    ), h = e.getWots().slice(2144, 2176), d = e.getWots().slice(2176, 2208), f = new Uint8Array([
      ...l,
      ...h,
      ...d
    ]), x = this.createSignature(
      e.getAddress(),
      a,
      f
    ), v = await this.construction.combine(a, [x]), w = await this.submitSignedTransaction(v.signed_transaction);
    return {
      buildResult: u,
      submitResult: w,
      signedTransaction: v.signed_transaction
    };
  }
  // used for testing;  gives out two wots wallet instances from a seed and index
  static createWallets(e, r, t) {
    const n = ue.SHA256(e + r).toString(), o = ue.SHA256(e + (r + 1)).toString(), i = Mt.create(
      "source",
      Buffer.from(n, "hex"),
      t == null ? void 0 : t.getAddrHash()
    ), c = Mt.create(
      "change",
      Buffer.from(o, "hex"),
      t == null ? void 0 : t.getAddrHash()
    );
    return { sourceWallet: i, changeWallet: c };
  }
};
function dd(e) {
  if (!e) return !0;
  if (!/^[A-Z0-9-]+$/.test(e) || e.startsWith("-") || e.endsWith("-"))
    return !1;
  const r = e.split("-");
  for (let t = 0; t < r.length; t++) {
    const n = r[t];
    if (!n) return !1;
    const o = /^[A-Z]+$/.test(n), i = /^[0-9]+$/.test(n);
    if (!o && !i)
      return !1;
    if (t > 0) {
      const c = r[t - 1], s = /^[A-Z]+$/.test(c);
      if (o === s)
        return !1;
    }
  }
  return !0;
}
class x2 {
  constructor(r) {
    de(this, "apiUrl");
    de(this, "apiClient");
    this.apiUrl = r, this.apiClient = new dc(r);
  }
  getNetworkStatus() {
    return this.apiClient.getNetworkStatus().then((r) => {
      var t, n;
      return {
        height: parseInt(((n = (t = r == null ? void 0 : r.current_block_identifier) == null ? void 0 : t.index) == null ? void 0 : n.toString()) ?? "0"),
        nodes: []
      };
    });
  }
  getAccountBalance(r) {
    const t = r.startsWith("0x") ? r : "0x" + r.slice(0, 40);
    return this.apiClient.getAccountBalance(t);
  }
  getMempoolTransactions() {
    return this.apiClient.getMempoolTransactions();
  }
  getMempoolTransaction(r) {
    return this.apiClient.getMempoolTransaction(r);
  }
  waitForTransaction(r, t, n) {
    return this.apiClient.waitForTransaction(r, t, n);
  }
  getNetworkOptions() {
    return this.apiClient.getNetworkOptions();
  }
  getBlock(r) {
    return this.apiClient.getBlock(r);
  }
  getBlockTransaction(r, t) {
    return this.apiClient.getBlockTransaction(r, t);
  }
  submit(r) {
    return this.apiClient.submit(r);
  }
  derive(r, t) {
    return this.apiClient.derive(r, t);
  }
  preprocess(r, t) {
    return this.apiClient.preprocess(r, t);
  }
  metadata(r, t) {
    return this.apiClient.metadata(r, t);
  }
  payloads(r, t, n) {
    return this.apiClient.payloads(r, t, n);
  }
  combine(r, t) {
    return this.apiClient.combine(r, t);
  }
  parse(r, t) {
    return this.apiClient.parse(r, t);
  }
  searchTransactionsByAddress(r, t) {
    const n = r.startsWith("0x") ? r : "0x" + r.slice(0, 40);
    return this.apiClient.searchTransactionsByAddress(n, t);
  }
  searchTransactionsByBlock(r, t) {
    return this.apiClient.searchTransactionsByBlock(r, t);
  }
  searchTransactionsByTxId(r, t) {
    return this.apiClient.searchTransactionsByTxId(r, t);
  }
  getEventsBlocks(r) {
    return this.apiClient.getEventsBlocks(r);
  }
  getStatsRichlist(r) {
    return this.apiClient.getStatsRichlist(r);
  }
  getBalance(r) {
    return this.apiClient.getAccountBalance(r.startsWith("0x") ? r : "0x" + r).then((t) => t.balances[0].value).catch((t) => {
      if (t.message.includes("Account not found"))
        return "0";
      throw t;
    });
  }
  resolveTag(r) {
    const t = r.startsWith("0x") ? r : "0x" + r;
    return this.apiClient.resolveTag(t).then((n) => ({
      success: !0,
      unanimous: !0,
      addressConsensus: n.result.address,
      balanceConsensus: n.result.amount,
      quorum: []
    }));
  }
  async pushTransaction(r, t) {
    try {
      return {
        status: "success",
        data: {
          sent: 0,
          txid: (await this.apiClient.submit(r)).transaction_identifier.hash
        }
      };
    } catch {
      return {
        status: "error",
        error: "Could not submit transaction"
      };
    }
  }
  activateTag(r) {
    return Promise.resolve({ status: "success", data: { txid: "", amount: "" }, message: "Successfully activated tag" });
  }
}
var R0 = { exports: {} }, br = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ma;
function hd() {
  if (ma) return br;
  ma = 1;
  var e = Yn, r = Symbol.for("react.element"), t = Symbol.for("react.fragment"), n = Object.prototype.hasOwnProperty, o = e.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, i = { key: !0, ref: !0, __self: !0, __source: !0 };
  function c(s, u, a) {
    var l, h = {}, d = null, f = null;
    a !== void 0 && (d = "" + a), u.key !== void 0 && (d = "" + u.key), u.ref !== void 0 && (f = u.ref);
    for (l in u) n.call(u, l) && !i.hasOwnProperty(l) && (h[l] = u[l]);
    if (s && s.defaultProps) for (l in u = s.defaultProps, u) h[l] === void 0 && (h[l] = u[l]);
    return { $$typeof: r, type: s, key: d, ref: f, props: h, _owner: o.current };
  }
  return br.Fragment = t, br.jsx = c, br.jsxs = c, br;
}
var mr = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ea;
function xd() {
  return Ea || (Ea = 1, process.env.NODE_ENV !== "production" && function() {
    var e = Yn, r = Symbol.for("react.element"), t = Symbol.for("react.portal"), n = Symbol.for("react.fragment"), o = Symbol.for("react.strict_mode"), i = Symbol.for("react.profiler"), c = Symbol.for("react.provider"), s = Symbol.for("react.context"), u = Symbol.for("react.forward_ref"), a = Symbol.for("react.suspense"), l = Symbol.for("react.suspense_list"), h = Symbol.for("react.memo"), d = Symbol.for("react.lazy"), f = Symbol.for("react.offscreen"), x = Symbol.iterator, v = "@@iterator";
    function w(B) {
      if (B === null || typeof B != "object")
        return null;
      var N = x && B[x] || B[v];
      return typeof N == "function" ? N : null;
    }
    var _ = e.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function p(B) {
      {
        for (var N = arguments.length, U = new Array(N > 1 ? N - 1 : 0), P = 1; P < N; P++)
          U[P - 1] = arguments[P];
        g("error", B, U);
      }
    }
    function g(B, N, U) {
      {
        var P = _.ReactDebugCurrentFrame, te = P.getStackAddendum();
        te !== "" && (N += "%s", U = U.concat([te]));
        var re = U.map(function(X) {
          return String(X);
        });
        re.unshift("Warning: " + N), Function.prototype.apply.call(console[B], console, re);
      }
    }
    var y = !1, b = !1, A = !1, m = !1, C = !1, S;
    S = Symbol.for("react.module.reference");
    function E(B) {
      return !!(typeof B == "string" || typeof B == "function" || B === n || B === i || C || B === o || B === a || B === l || m || B === f || y || b || A || typeof B == "object" && B !== null && (B.$$typeof === d || B.$$typeof === h || B.$$typeof === c || B.$$typeof === s || B.$$typeof === u || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      B.$$typeof === S || B.getModuleId !== void 0));
    }
    function k(B, N, U) {
      var P = B.displayName;
      if (P)
        return P;
      var te = N.displayName || N.name || "";
      return te !== "" ? U + "(" + te + ")" : U;
    }
    function T(B) {
      return B.displayName || "Context";
    }
    function R(B) {
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
        case i:
          return "Profiler";
        case o:
          return "StrictMode";
        case a:
          return "Suspense";
        case l:
          return "SuspenseList";
      }
      if (typeof B == "object")
        switch (B.$$typeof) {
          case s:
            var N = B;
            return T(N) + ".Consumer";
          case c:
            var U = B;
            return T(U._context) + ".Provider";
          case u:
            return k(B, B.render, "ForwardRef");
          case h:
            var P = B.displayName || null;
            return P !== null ? P : R(B.type) || "Memo";
          case d: {
            var te = B, re = te._payload, X = te._init;
            try {
              return R(X(re));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var z = Object.assign, H = 0, L, Q, K, J, V, O, I;
    function F() {
    }
    F.__reactDisabledLog = !0;
    function D() {
      {
        if (H === 0) {
          L = console.log, Q = console.info, K = console.warn, J = console.error, V = console.group, O = console.groupCollapsed, I = console.groupEnd;
          var B = {
            configurable: !0,
            enumerable: !0,
            value: F,
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
        H++;
      }
    }
    function W() {
      {
        if (H--, H === 0) {
          var B = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: z({}, B, {
              value: L
            }),
            info: z({}, B, {
              value: Q
            }),
            warn: z({}, B, {
              value: K
            }),
            error: z({}, B, {
              value: J
            }),
            group: z({}, B, {
              value: V
            }),
            groupCollapsed: z({}, B, {
              value: O
            }),
            groupEnd: z({}, B, {
              value: I
            })
          });
        }
        H < 0 && p("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var G = _.ReactCurrentDispatcher, ne;
    function M(B, N, U) {
      {
        if (ne === void 0)
          try {
            throw Error();
          } catch (te) {
            var P = te.stack.trim().match(/\n( *(at )?)/);
            ne = P && P[1] || "";
          }
        return `
` + ne + B;
      }
    }
    var Le = !1, We;
    {
      var xr = typeof WeakMap == "function" ? WeakMap : Map;
      We = new xr();
    }
    function ut(B, N) {
      if (!B || Le)
        return "";
      {
        var U = We.get(B);
        if (U !== void 0)
          return U;
      }
      var P;
      Le = !0;
      var te = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var re;
      re = G.current, G.current = null, D();
      try {
        if (N) {
          var X = function() {
            throw Error();
          };
          if (Object.defineProperty(X.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(X, []);
            } catch (Be) {
              P = Be;
            }
            Reflect.construct(B, [], X);
          } else {
            try {
              X.call();
            } catch (Be) {
              P = Be;
            }
            B.call(X.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (Be) {
            P = Be;
          }
          B();
        }
      } catch (Be) {
        if (Be && P && typeof Be.stack == "string") {
          for (var q = Be.stack.split(`
`), Ee = P.stack.split(`
`), le = q.length - 1, fe = Ee.length - 1; le >= 1 && fe >= 0 && q[le] !== Ee[fe]; )
            fe--;
          for (; le >= 1 && fe >= 0; le--, fe--)
            if (q[le] !== Ee[fe]) {
              if (le !== 1 || fe !== 1)
                do
                  if (le--, fe--, fe < 0 || q[le] !== Ee[fe]) {
                    var Ue = `
` + q[le].replace(" at new ", " at ");
                    return B.displayName && Ue.includes("<anonymous>") && (Ue = Ue.replace("<anonymous>", B.displayName)), typeof B == "function" && We.set(B, Ue), Ue;
                  }
                while (le >= 1 && fe >= 0);
              break;
            }
        }
      } finally {
        Le = !1, G.current = re, W(), Error.prepareStackTrace = te;
      }
      var Jt = B ? B.displayName || B.name : "", Rt = Jt ? M(Jt) : "";
      return typeof B == "function" && We.set(B, Rt), Rt;
    }
    function Te(B, N, U) {
      return ut(B, !1);
    }
    function me(B) {
      var N = B.prototype;
      return !!(N && N.isReactComponent);
    }
    function tt(B, N, U) {
      if (B == null)
        return "";
      if (typeof B == "function")
        return ut(B, me(B));
      if (typeof B == "string")
        return M(B);
      switch (B) {
        case a:
          return M("Suspense");
        case l:
          return M("SuspenseList");
      }
      if (typeof B == "object")
        switch (B.$$typeof) {
          case u:
            return Te(B.render);
          case h:
            return tt(B.type, N, U);
          case d: {
            var P = B, te = P._payload, re = P._init;
            try {
              return tt(re(te), N, U);
            } catch {
            }
          }
        }
      return "";
    }
    var je = Object.prototype.hasOwnProperty, Dt = {}, ft = _.ReactDebugCurrentFrame;
    function dt(B) {
      if (B) {
        var N = B._owner, U = tt(B.type, B._source, N ? N.type : null);
        ft.setExtraStackFrame(U);
      } else
        ft.setExtraStackFrame(null);
    }
    function Ft(B, N, U, P, te) {
      {
        var re = Function.call.bind(je);
        for (var X in B)
          if (re(B, X)) {
            var q = void 0;
            try {
              if (typeof B[X] != "function") {
                var Ee = Error((P || "React class") + ": " + U + " type `" + X + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof B[X] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw Ee.name = "Invariant Violation", Ee;
              }
              q = B[X](N, X, P, U, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (le) {
              q = le;
            }
            q && !(q instanceof Error) && (dt(te), p("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", P || "React class", U, X, typeof q), dt(null)), q instanceof Error && !(q.message in Dt) && (Dt[q.message] = !0, dt(te), p("Failed %s type: %s", U, q.message), dt(null));
          }
      }
    }
    var Re = Array.isArray;
    function ye(B) {
      return Re(B);
    }
    function Ke(B) {
      {
        var N = typeof Symbol == "function" && Symbol.toStringTag, U = N && B[Symbol.toStringTag] || B.constructor.name || "Object";
        return U;
      }
    }
    function Zt(B) {
      try {
        return pr(B), !1;
      } catch {
        return !0;
      }
    }
    function pr(B) {
      return "" + B;
    }
    function rt(B) {
      if (Zt(B))
        return p("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", Ke(B)), pr(B);
    }
    var ht = _.ReactCurrentOwner, uo = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, gr, yr;
    function xt(B) {
      if (je.call(B, "ref")) {
        var N = Object.getOwnPropertyDescriptor(B, "ref").get;
        if (N && N.isReactWarning)
          return !1;
      }
      return B.ref !== void 0;
    }
    function Tt(B) {
      if (je.call(B, "key")) {
        var N = Object.getOwnPropertyDescriptor(B, "key").get;
        if (N && N.isReactWarning)
          return !1;
      }
      return B.key !== void 0;
    }
    function fo(B, N) {
      typeof B.ref == "string" && ht.current;
    }
    function rn(B, N) {
      {
        var U = function() {
          gr || (gr = !0, p("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", N));
        };
        U.isReactWarning = !0, Object.defineProperty(B, "key", {
          get: U,
          configurable: !0
        });
      }
    }
    function nn(B, N) {
      {
        var U = function() {
          yr || (yr = !0, p("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", N));
        };
        U.isReactWarning = !0, Object.defineProperty(B, "ref", {
          get: U,
          configurable: !0
        });
      }
    }
    var ho = function(B, N, U, P, te, re, X) {
      var q = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: r,
        // Built-in properties that belong on the element
        type: B,
        key: N,
        ref: U,
        props: X,
        // Record the component responsible for creating this element.
        _owner: re
      };
      return q._store = {}, Object.defineProperty(q._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(q, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: P
      }), Object.defineProperty(q, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: te
      }), Object.freeze && (Object.freeze(q.props), Object.freeze(q)), q;
    };
    function xo(B, N, U, P, te) {
      {
        var re, X = {}, q = null, Ee = null;
        U !== void 0 && (rt(U), q = "" + U), Tt(N) && (rt(N.key), q = "" + N.key), xt(N) && (Ee = N.ref, fo(N, te));
        for (re in N)
          je.call(N, re) && !uo.hasOwnProperty(re) && (X[re] = N[re]);
        if (B && B.defaultProps) {
          var le = B.defaultProps;
          for (re in le)
            X[re] === void 0 && (X[re] = le[re]);
        }
        if (q || Ee) {
          var fe = typeof B == "function" ? B.displayName || B.name || "Unknown" : B;
          q && rn(X, fe), Ee && nn(X, fe);
        }
        return ho(B, q, Ee, te, P, ht.current, X);
      }
    }
    var Yt = _.ReactCurrentOwner, on = _.ReactDebugCurrentFrame;
    function nt(B) {
      if (B) {
        var N = B._owner, U = tt(B.type, B._source, N ? N.type : null);
        on.setExtraStackFrame(U);
      } else
        on.setExtraStackFrame(null);
    }
    var wr;
    wr = !1;
    function Xt(B) {
      return typeof B == "object" && B !== null && B.$$typeof === r;
    }
    function an() {
      {
        if (Yt.current) {
          var B = R(Yt.current.type);
          if (B)
            return `

Check the render method of \`` + B + "`.";
        }
        return "";
      }
    }
    function po(B) {
      return "";
    }
    var sn = {};
    function cn(B) {
      {
        var N = an();
        if (!N) {
          var U = typeof B == "string" ? B : B.displayName || B.name;
          U && (N = `

Check the top-level render call using <` + U + ">.");
        }
        return N;
      }
    }
    function ln(B, N) {
      {
        if (!B._store || B._store.validated || B.key != null)
          return;
        B._store.validated = !0;
        var U = cn(N);
        if (sn[U])
          return;
        sn[U] = !0;
        var P = "";
        B && B._owner && B._owner !== Yt.current && (P = " It was passed a child from " + R(B._owner.type) + "."), nt(B), p('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', U, P), nt(null);
      }
    }
    function un(B, N) {
      {
        if (typeof B != "object")
          return;
        if (ye(B))
          for (var U = 0; U < B.length; U++) {
            var P = B[U];
            Xt(P) && ln(P, N);
          }
        else if (Xt(B))
          B._store && (B._store.validated = !0);
        else if (B) {
          var te = w(B);
          if (typeof te == "function" && te !== B.entries)
            for (var re = te.call(B), X; !(X = re.next()).done; )
              Xt(X.value) && ln(X.value, N);
        }
      }
    }
    function fn(B) {
      {
        var N = B.type;
        if (N == null || typeof N == "string")
          return;
        var U;
        if (typeof N == "function")
          U = N.propTypes;
        else if (typeof N == "object" && (N.$$typeof === u || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        N.$$typeof === h))
          U = N.propTypes;
        else
          return;
        if (U) {
          var P = R(N);
          Ft(U, B.props, "prop", P, B);
        } else if (N.PropTypes !== void 0 && !wr) {
          wr = !0;
          var te = R(N);
          p("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", te || "Unknown");
        }
        typeof N.getDefaultProps == "function" && !N.getDefaultProps.isReactClassApproved && p("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function go(B) {
      {
        for (var N = Object.keys(B.props), U = 0; U < N.length; U++) {
          var P = N[U];
          if (P !== "children" && P !== "key") {
            nt(B), p("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", P), nt(null);
            break;
          }
        }
        B.ref !== null && (nt(B), p("Invalid attribute `ref` supplied to `React.Fragment`."), nt(null));
      }
    }
    var vr = {};
    function we(B, N, U, P, te, re) {
      {
        var X = E(B);
        if (!X) {
          var q = "";
          (B === void 0 || typeof B == "object" && B !== null && Object.keys(B).length === 0) && (q += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var Ee = po();
          Ee ? q += Ee : q += an();
          var le;
          B === null ? le = "null" : ye(B) ? le = "array" : B !== void 0 && B.$$typeof === r ? (le = "<" + (R(B.type) || "Unknown") + " />", q = " Did you accidentally export a JSX literal instead of a component?") : le = typeof B, p("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", le, q);
        }
        var fe = xo(B, N, U, te, re);
        if (fe == null)
          return fe;
        if (X) {
          var Ue = N.children;
          if (Ue !== void 0)
            if (P)
              if (ye(Ue)) {
                for (var Jt = 0; Jt < Ue.length; Jt++)
                  un(Ue[Jt], B);
                Object.freeze && Object.freeze(Ue);
              } else
                p("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              un(Ue, B);
        }
        if (je.call(N, "key")) {
          var Rt = R(B), Be = Object.keys(N).filter(function(kl) {
            return kl !== "key";
          }), wo = Be.length > 0 ? "{key: someKey, " + Be.join(": ..., ") + ": ...}" : "{key: someKey}";
          if (!vr[Rt + wo]) {
            var Cl = Be.length > 0 ? "{" + Be.join(": ..., ") + ": ...}" : "{}";
            p(`A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`, wo, Rt, Cl, Rt), vr[Rt + wo] = !0;
          }
        }
        return B === n ? go(fe) : fn(fe), fe;
      }
    }
    function Ve(B, N, U) {
      return we(B, N, U, !0);
    }
    function dn(B, N, U) {
      return we(B, N, U, !1);
    }
    var yo = dn, Bl = Ve;
    mr.Fragment = n, mr.jsx = yo, mr.jsxs = Bl;
  }()), mr;
}
process.env.NODE_ENV === "production" ? R0.exports = hd() : R0.exports = xd();
var Mn = R0.exports, O0 = { exports: {} }, a0 = {};
/**
 * @license React
 * use-sync-external-store-with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Aa;
function pd() {
  if (Aa) return a0;
  Aa = 1;
  var e = Yn;
  function r(u, a) {
    return u === a && (u !== 0 || 1 / u === 1 / a) || u !== u && a !== a;
  }
  var t = typeof Object.is == "function" ? Object.is : r, n = e.useSyncExternalStore, o = e.useRef, i = e.useEffect, c = e.useMemo, s = e.useDebugValue;
  return a0.useSyncExternalStoreWithSelector = function(u, a, l, h, d) {
    var f = o(null);
    if (f.current === null) {
      var x = { hasValue: !1, value: null };
      f.current = x;
    } else x = f.current;
    f = c(
      function() {
        function w(b) {
          if (!_) {
            if (_ = !0, p = b, b = h(b), d !== void 0 && x.hasValue) {
              var A = x.value;
              if (d(A, b))
                return g = A;
            }
            return g = b;
          }
          if (A = g, t(p, b)) return A;
          var m = h(b);
          return d !== void 0 && d(A, m) ? (p = b, A) : (p = b, g = m);
        }
        var _ = !1, p, g, y = l === void 0 ? null : l;
        return [
          function() {
            return w(a());
          },
          y === null ? void 0 : function() {
            return w(y());
          }
        ];
      },
      [a, l, h, d]
    );
    var v = n(u, f[0], f[1]);
    return i(
      function() {
        x.hasValue = !0, x.value = v;
      },
      [v]
    ), s(v), v;
  }, a0;
}
var s0 = {};
/**
 * @license React
 * use-sync-external-store-with-selector.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ba;
function gd() {
  return Ba || (Ba = 1, process.env.NODE_ENV !== "production" && function() {
    function e(u, a) {
      return u === a && (u !== 0 || 1 / u === 1 / a) || u !== u && a !== a;
    }
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
    var r = Yn, t = typeof Object.is == "function" ? Object.is : e, n = r.useSyncExternalStore, o = r.useRef, i = r.useEffect, c = r.useMemo, s = r.useDebugValue;
    s0.useSyncExternalStoreWithSelector = function(u, a, l, h, d) {
      var f = o(null);
      if (f.current === null) {
        var x = { hasValue: !1, value: null };
        f.current = x;
      } else x = f.current;
      f = c(
        function() {
          function w(b) {
            if (!_) {
              if (_ = !0, p = b, b = h(b), d !== void 0 && x.hasValue) {
                var A = x.value;
                if (d(A, b))
                  return g = A;
              }
              return g = b;
            }
            if (A = g, t(p, b))
              return A;
            var m = h(b);
            return d !== void 0 && d(A, m) ? (p = b, A) : (p = b, g = m);
          }
          var _ = !1, p, g, y = l === void 0 ? null : l;
          return [
            function() {
              return w(a());
            },
            y === null ? void 0 : function() {
              return w(y());
            }
          ];
        },
        [a, l, h, d]
      );
      var v = n(u, f[0], f[1]);
      return i(
        function() {
          x.hasValue = !0, x.value = v;
        },
        [v]
      ), s(v), v;
    }, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
  }()), s0;
}
process.env.NODE_ENV === "production" ? O0.exports = pd() : O0.exports = gd();
var yd = O0.exports;
function wd(e) {
  e();
}
function vd() {
  let e = null, r = null;
  return {
    clear() {
      e = null, r = null;
    },
    notify() {
      wd(() => {
        let t = e;
        for (; t; )
          t.callback(), t = t.next;
      });
    },
    get() {
      const t = [];
      let n = e;
      for (; n; )
        t.push(n), n = n.next;
      return t;
    },
    subscribe(t) {
      let n = !0;
      const o = r = {
        callback: t,
        next: null,
        prev: r
      };
      return o.prev ? o.prev.next = o : e = o, function() {
        !n || e === null || (n = !1, o.next ? o.next.prev = o.prev : r = o.prev, o.prev ? o.prev.next = o.next : e = o.next);
      };
    }
  };
}
var Ca = {
  notify() {
  },
  get: () => []
};
function _d(e, r) {
  let t, n = Ca, o = 0, i = !1;
  function c(v) {
    l();
    const w = n.subscribe(v);
    let _ = !1;
    return () => {
      _ || (_ = !0, w(), h());
    };
  }
  function s() {
    n.notify();
  }
  function u() {
    x.onStateChange && x.onStateChange();
  }
  function a() {
    return i;
  }
  function l() {
    o++, t || (t = e.subscribe(u), n = vd());
  }
  function h() {
    o--, t && o === 0 && (t(), t = void 0, n.clear(), n = Ca);
  }
  function d() {
    i || (i = !0, l());
  }
  function f() {
    i && (i = !1, h());
  }
  const x = {
    addNestedSub: c,
    notifyNestedSubs: s,
    handleChangeWrapper: u,
    isSubscribed: a,
    trySubscribe: d,
    tryUnsubscribe: f,
    getListeners: () => n
  };
  return x;
}
var bd = () => typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u", md = /* @__PURE__ */ bd(), Ed = () => typeof navigator < "u" && navigator.product === "ReactNative", Ad = /* @__PURE__ */ Ed(), Bd = () => md || Ad ? Ie.useLayoutEffect : Ie.useEffect, Cd = /* @__PURE__ */ Bd(), c0 = /* @__PURE__ */ Symbol.for("react-redux-context"), l0 = typeof globalThis < "u" ? globalThis : (
  /* fall back to a per-module scope (pre-8.1 behaviour) if `globalThis` is not available */
  {}
);
function kd() {
  if (!Ie.createContext) return {};
  const e = l0[c0] ?? (l0[c0] = /* @__PURE__ */ new Map());
  let r = e.get(Ie.createContext);
  return r || (r = Ie.createContext(
    null
  ), process.env.NODE_ENV !== "production" && (r.displayName = "ReactRedux"), e.set(Ie.createContext, r)), r;
}
var kt = /* @__PURE__ */ kd();
function Sd(e) {
  const { children: r, context: t, serverState: n, store: o } = e, i = Ie.useMemo(() => {
    const u = _d(o), a = {
      store: o,
      subscription: u,
      getServerState: n ? () => n : void 0
    };
    if (process.env.NODE_ENV === "production")
      return a;
    {
      const { identityFunctionCheck: l = "once", stabilityCheck: h = "once" } = e;
      return /* @__PURE__ */ Object.assign(a, {
        stabilityCheck: h,
        identityFunctionCheck: l
      });
    }
  }, [o, n]), c = Ie.useMemo(() => o.getState(), [o]);
  Cd(() => {
    const { subscription: u } = i;
    return u.onStateChange = u.notifyNestedSubs, u.trySubscribe(), c !== o.getState() && u.notifyNestedSubs(), () => {
      u.tryUnsubscribe(), u.onStateChange = void 0;
    };
  }, [i, c]);
  const s = t || kt;
  return /* @__PURE__ */ Ie.createElement(s.Provider, { value: i }, r);
}
var Dd = Sd;
function ui(e = kt) {
  return function() {
    const t = Ie.useContext(e);
    if (process.env.NODE_ENV !== "production" && !t)
      throw new Error(
        "could not find react-redux context value; please ensure the component is wrapped in a <Provider>"
      );
    return t;
  };
}
var hc = /* @__PURE__ */ ui();
function xc(e = kt) {
  const r = e === kt ? hc : (
    // @ts-ignore
    ui(e)
  ), t = () => {
    const { store: n } = r();
    return n;
  };
  return Object.assign(t, {
    withTypes: () => t
  }), t;
}
var Fd = /* @__PURE__ */ xc();
function Td(e = kt) {
  const r = e === kt ? Fd : xc(e), t = () => r().dispatch;
  return Object.assign(t, {
    withTypes: () => t
  }), t;
}
var pc = /* @__PURE__ */ Td(), Rd = (e, r) => e === r;
function Od(e = kt) {
  const r = e === kt ? hc : ui(e), t = (n, o = {}) => {
    const { equalityFn: i = Rd } = typeof o == "function" ? { equalityFn: o } : o;
    if (process.env.NODE_ENV !== "production") {
      if (!n)
        throw new Error("You must pass a selector to useSelector");
      if (typeof n != "function")
        throw new Error("You must pass a function as a selector to useSelector");
      if (typeof i != "function")
        throw new Error(
          "You must pass a function as an equality function to useSelector"
        );
    }
    const c = r(), { store: s, subscription: u, getServerState: a } = c, l = Ie.useRef(!0), h = Ie.useCallback(
      {
        [n.name](f) {
          const x = n(f);
          if (process.env.NODE_ENV !== "production") {
            const { devModeChecks: v = {} } = typeof o == "function" ? {} : o, { identityFunctionCheck: w, stabilityCheck: _ } = c, {
              identityFunctionCheck: p,
              stabilityCheck: g
            } = {
              stabilityCheck: _,
              identityFunctionCheck: w,
              ...v
            };
            if (g === "always" || g === "once" && l.current) {
              const y = n(f);
              if (!i(x, y)) {
                let b;
                try {
                  throw new Error();
                } catch (A) {
                  ({ stack: b } = A);
                }
                console.warn(
                  "Selector " + (n.name || "unknown") + ` returned a different result when called with the same parameters. This can lead to unnecessary rerenders.
Selectors that return a new reference (such as an object or an array) should be memoized: https://redux.js.org/usage/deriving-data-selectors#optimizing-selectors-with-memoization`,
                  {
                    state: f,
                    selected: x,
                    selected2: y,
                    stack: b
                  }
                );
              }
            }
            if ((p === "always" || p === "once" && l.current) && x === f) {
              let y;
              try {
                throw new Error();
              } catch (b) {
                ({ stack: y } = b);
              }
              console.warn(
                "Selector " + (n.name || "unknown") + ` returned the root state when called. This can lead to unnecessary rerenders.
Selectors that return the entire state are almost certainly a mistake, as they will cause a rerender whenever *anything* in state changes.`,
                { stack: y }
              );
            }
            l.current && (l.current = !1);
          }
          return x;
        }
      }[n.name],
      [n]
    ), d = yd.useSyncExternalStoreWithSelector(
      u.addNestedSub,
      s.getState,
      a || s.getState,
      h,
      i
    );
    return Ie.useDebugValue(d), d;
  };
  return Object.assign(t, {
    withTypes: () => t
  }), t;
}
var rr = /* @__PURE__ */ Od();
function pe(e) {
  return `Minified Redux error #${e}; visit https://redux.js.org/Errors?code=${e} for the full message or use the non-minified dev environment for full errors. `;
}
var Id = typeof Symbol == "function" && Symbol.observable || "@@observable", ka = Id, u0 = () => Math.random().toString(36).substring(7).split("").join("."), Nd = {
  INIT: `@@redux/INIT${/* @__PURE__ */ u0()}`,
  REPLACE: `@@redux/REPLACE${/* @__PURE__ */ u0()}`,
  PROBE_UNKNOWN_ACTION: () => `@@redux/PROBE_UNKNOWN_ACTION${u0()}`
}, Lt = Nd;
function Gr(e) {
  if (typeof e != "object" || e === null)
    return !1;
  let r = e;
  for (; Object.getPrototypeOf(r) !== null; )
    r = Object.getPrototypeOf(r);
  return Object.getPrototypeOf(e) === r || Object.getPrototypeOf(e) === null;
}
function Hd(e) {
  if (e === void 0)
    return "undefined";
  if (e === null)
    return "null";
  const r = typeof e;
  switch (r) {
    case "boolean":
    case "string":
    case "number":
    case "symbol":
    case "function":
      return r;
  }
  if (Array.isArray(e))
    return "array";
  if (Ud(e))
    return "date";
  if (Ld(e))
    return "error";
  const t = zd(e);
  switch (t) {
    case "Symbol":
    case "Promise":
    case "WeakMap":
    case "WeakSet":
    case "Map":
    case "Set":
      return t;
  }
  return Object.prototype.toString.call(e).slice(8, -1).toLowerCase().replace(/\s/g, "");
}
function zd(e) {
  return typeof e.constructor == "function" ? e.constructor.name : null;
}
function Ld(e) {
  return e instanceof Error || typeof e.message == "string" && e.constructor && typeof e.constructor.stackTraceLimit == "number";
}
function Ud(e) {
  return e instanceof Date ? !0 : typeof e.toDateString == "function" && typeof e.getDate == "function" && typeof e.setDate == "function";
}
function bt(e) {
  let r = typeof e;
  return process.env.NODE_ENV !== "production" && (r = Hd(e)), r;
}
function gc(e, r, t) {
  if (typeof e != "function")
    throw new Error(process.env.NODE_ENV === "production" ? pe(2) : `Expected the root reducer to be a function. Instead, received: '${bt(e)}'`);
  if (typeof r == "function" && typeof t == "function" || typeof t == "function" && typeof arguments[3] == "function")
    throw new Error(process.env.NODE_ENV === "production" ? pe(0) : "It looks like you are passing several store enhancers to createStore(). This is not supported. Instead, compose them together to a single function. See https://redux.js.org/tutorials/fundamentals/part-4-store#creating-a-store-with-enhancers for an example.");
  if (typeof r == "function" && typeof t > "u" && (t = r, r = void 0), typeof t < "u") {
    if (typeof t != "function")
      throw new Error(process.env.NODE_ENV === "production" ? pe(1) : `Expected the enhancer to be a function. Instead, received: '${bt(t)}'`);
    return t(gc)(e, r);
  }
  let n = e, o = r, i = /* @__PURE__ */ new Map(), c = i, s = 0, u = !1;
  function a() {
    c === i && (c = /* @__PURE__ */ new Map(), i.forEach((w, _) => {
      c.set(_, w);
    }));
  }
  function l() {
    if (u)
      throw new Error(process.env.NODE_ENV === "production" ? pe(3) : "You may not call store.getState() while the reducer is executing. The reducer has already received the state as an argument. Pass it down from the top reducer instead of reading it from the store.");
    return o;
  }
  function h(w) {
    if (typeof w != "function")
      throw new Error(process.env.NODE_ENV === "production" ? pe(4) : `Expected the listener to be a function. Instead, received: '${bt(w)}'`);
    if (u)
      throw new Error(process.env.NODE_ENV === "production" ? pe(5) : "You may not call store.subscribe() while the reducer is executing. If you would like to be notified after the store has been updated, subscribe from a component and invoke store.getState() in the callback to access the latest state. See https://redux.js.org/api/store#subscribelistener for more details.");
    let _ = !0;
    a();
    const p = s++;
    return c.set(p, w), function() {
      if (_) {
        if (u)
          throw new Error(process.env.NODE_ENV === "production" ? pe(6) : "You may not unsubscribe from a store listener while the reducer is executing. See https://redux.js.org/api/store#subscribelistener for more details.");
        _ = !1, a(), c.delete(p), i = null;
      }
    };
  }
  function d(w) {
    if (!Gr(w))
      throw new Error(process.env.NODE_ENV === "production" ? pe(7) : `Actions must be plain objects. Instead, the actual type was: '${bt(w)}'. You may need to add middleware to your store setup to handle dispatching other values, such as 'redux-thunk' to handle dispatching functions. See https://redux.js.org/tutorials/fundamentals/part-4-store#middleware and https://redux.js.org/tutorials/fundamentals/part-6-async-logic#using-the-redux-thunk-middleware for examples.`);
    if (typeof w.type > "u")
      throw new Error(process.env.NODE_ENV === "production" ? pe(8) : 'Actions may not have an undefined "type" property. You may have misspelled an action type string constant.');
    if (typeof w.type != "string")
      throw new Error(process.env.NODE_ENV === "production" ? pe(17) : `Action "type" property must be a string. Instead, the actual type was: '${bt(w.type)}'. Value was: '${w.type}' (stringified)`);
    if (u)
      throw new Error(process.env.NODE_ENV === "production" ? pe(9) : "Reducers may not dispatch actions.");
    try {
      u = !0, o = n(o, w);
    } finally {
      u = !1;
    }
    return (i = c).forEach((p) => {
      p();
    }), w;
  }
  function f(w) {
    if (typeof w != "function")
      throw new Error(process.env.NODE_ENV === "production" ? pe(10) : `Expected the nextReducer to be a function. Instead, received: '${bt(w)}`);
    n = w, d({
      type: Lt.REPLACE
    });
  }
  function x() {
    const w = h;
    return {
      /**
       * The minimal observable subscription method.
       * @param observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe(_) {
        if (typeof _ != "object" || _ === null)
          throw new Error(process.env.NODE_ENV === "production" ? pe(11) : `Expected the observer to be an object. Instead, received: '${bt(_)}'`);
        function p() {
          const y = _;
          y.next && y.next(l());
        }
        return p(), {
          unsubscribe: w(p)
        };
      },
      [ka]() {
        return this;
      }
    };
  }
  return d({
    type: Lt.INIT
  }), {
    dispatch: d,
    subscribe: h,
    getState: l,
    replaceReducer: f,
    [ka]: x
  };
}
function Sa(e) {
  typeof console < "u" && typeof console.error == "function" && console.error(e);
  try {
    throw new Error(e);
  } catch {
  }
}
function Md(e, r, t, n) {
  const o = Object.keys(r), i = t && t.type === Lt.INIT ? "preloadedState argument passed to createStore" : "previous state received by the reducer";
  if (o.length === 0)
    return "Store does not have a valid reducer. Make sure the argument passed to combineReducers is an object whose values are reducers.";
  if (!Gr(e))
    return `The ${i} has unexpected type of "${bt(e)}". Expected argument to be an object with the following keys: "${o.join('", "')}"`;
  const c = Object.keys(e).filter((s) => !r.hasOwnProperty(s) && !n[s]);
  if (c.forEach((s) => {
    n[s] = !0;
  }), !(t && t.type === Lt.REPLACE) && c.length > 0)
    return `Unexpected ${c.length > 1 ? "keys" : "key"} "${c.join('", "')}" found in ${i}. Expected to find one of the known reducer keys instead: "${o.join('", "')}". Unexpected keys will be ignored.`;
}
function Pd(e) {
  Object.keys(e).forEach((r) => {
    const t = e[r];
    if (typeof t(void 0, {
      type: Lt.INIT
    }) > "u")
      throw new Error(process.env.NODE_ENV === "production" ? pe(12) : `The slice reducer for key "${r}" returned undefined during initialization. If the state passed to the reducer is undefined, you must explicitly return the initial state. The initial state may not be undefined. If you don't want to set a value for this reducer, you can use null instead of undefined.`);
    if (typeof t(void 0, {
      type: Lt.PROBE_UNKNOWN_ACTION()
    }) > "u")
      throw new Error(process.env.NODE_ENV === "production" ? pe(13) : `The slice reducer for key "${r}" returned undefined when probed with a random type. Don't try to handle '${Lt.INIT}' or other actions in "redux/*" namespace. They are considered private. Instead, you must return the current state for any unknown actions, unless it is undefined, in which case you must return the initial state, regardless of the action type. The initial state may not be undefined, but can be null.`);
  });
}
function Wd(e) {
  const r = Object.keys(e), t = {};
  for (let c = 0; c < r.length; c++) {
    const s = r[c];
    process.env.NODE_ENV !== "production" && typeof e[s] > "u" && Sa(`No reducer provided for key "${s}"`), typeof e[s] == "function" && (t[s] = e[s]);
  }
  const n = Object.keys(t);
  let o;
  process.env.NODE_ENV !== "production" && (o = {});
  let i;
  try {
    Pd(t);
  } catch (c) {
    i = c;
  }
  return function(s = {}, u) {
    if (i)
      throw i;
    if (process.env.NODE_ENV !== "production") {
      const h = Md(s, t, u, o);
      h && Sa(h);
    }
    let a = !1;
    const l = {};
    for (let h = 0; h < n.length; h++) {
      const d = n[h], f = t[d], x = s[d], v = f(x, u);
      if (typeof v > "u") {
        const w = u && u.type;
        throw new Error(process.env.NODE_ENV === "production" ? pe(14) : `When called with an action of type ${w ? `"${String(w)}"` : "(unknown type)"}, the slice reducer for key "${d}" returned undefined. To ignore an action, you must explicitly return the previous state. If you want this reducer to hold no value, you can return null instead of undefined.`);
      }
      l[d] = v, a = a || v !== x;
    }
    return a = a || n.length !== Object.keys(s).length, a ? l : s;
  };
}
function Pn(...e) {
  return e.length === 0 ? (r) => r : e.length === 1 ? e[0] : e.reduce((r, t) => (...n) => r(t(...n)));
}
function jd(...e) {
  return (r) => (t, n) => {
    const o = r(t, n);
    let i = () => {
      throw new Error(process.env.NODE_ENV === "production" ? pe(15) : "Dispatching while constructing your middleware is not allowed. Other middleware would not be applied to this dispatch.");
    };
    const c = {
      getState: o.getState,
      dispatch: (u, ...a) => i(u, ...a)
    }, s = e.map((u) => u(c));
    return i = Pn(...s)(o.dispatch), {
      ...o,
      dispatch: i
    };
  };
}
function yc(e) {
  return Gr(e) && "type" in e && typeof e.type == "string";
}
var wc = Symbol.for("immer-nothing"), Da = Symbol.for("immer-draftable"), He = Symbol.for("immer-state"), $d = process.env.NODE_ENV !== "production" ? [
  // All error codes, starting by 0:
  function(e) {
    return `The plugin for '${e}' has not been loaded into Immer. To enable the plugin, import and call \`enable${e}()\` when initializing your application.`;
  },
  function(e) {
    return `produce can only be called on things that are draftable: plain objects, arrays, Map, Set or classes that are marked with '[immerable]: true'. Got '${e}'`;
  },
  "This object has been frozen and should not be mutated",
  function(e) {
    return "Cannot use a proxy that has been revoked. Did you pass an object from inside an immer function to an async process? " + e;
  },
  "An immer producer returned a new value *and* modified its draft. Either return a new value *or* modify the draft.",
  "Immer forbids circular references",
  "The first or second argument to `produce` must be a function",
  "The third argument to `produce` must be a function or undefined",
  "First argument to `createDraft` must be a plain object, an array, or an immerable object",
  "First argument to `finishDraft` must be a draft returned by `createDraft`",
  function(e) {
    return `'current' expects a draft, got: ${e}`;
  },
  "Object.defineProperty() cannot be used on an Immer draft",
  "Object.setPrototypeOf() cannot be used on an Immer draft",
  "Immer only supports deleting array indices",
  "Immer only supports setting array indices and the 'length' property",
  function(e) {
    return `'original' expects a draft, got: ${e}`;
  }
  // Note: if more errors are added, the errorOffset in Patches.ts should be increased
  // See Patches.ts for additional errors
] : [];
function Se(e, ...r) {
  if (process.env.NODE_ENV !== "production") {
    const t = $d[e], n = typeof t == "function" ? t.apply(null, r) : t;
    throw new Error(`[Immer] ${n}`);
  }
  throw new Error(
    `[Immer] minified error nr: ${e}. Full error at: https://bit.ly/3cXEKWf`
  );
}
var ar = Object.getPrototypeOf;
function Pt(e) {
  return !!e && !!e[He];
}
function lt(e) {
  var r;
  return e ? vc(e) || Array.isArray(e) || !!e[Da] || !!((r = e.constructor) != null && r[Da]) || to(e) || ro(e) : !1;
}
var Kd = Object.prototype.constructor.toString();
function vc(e) {
  if (!e || typeof e != "object")
    return !1;
  const r = ar(e);
  if (r === null)
    return !0;
  const t = Object.hasOwnProperty.call(r, "constructor") && r.constructor;
  return t === Object ? !0 : typeof t == "function" && Function.toString.call(t) === Kd;
}
function Wn(e, r) {
  eo(e) === 0 ? Reflect.ownKeys(e).forEach((t) => {
    r(t, e[t], e);
  }) : e.forEach((t, n) => r(n, t, e));
}
function eo(e) {
  const r = e[He];
  return r ? r.type_ : Array.isArray(e) ? 1 : to(e) ? 2 : ro(e) ? 3 : 0;
}
function I0(e, r) {
  return eo(e) === 2 ? e.has(r) : Object.prototype.hasOwnProperty.call(e, r);
}
function _c(e, r, t) {
  const n = eo(e);
  n === 2 ? e.set(r, t) : n === 3 ? e.add(t) : e[r] = t;
}
function Vd(e, r) {
  return e === r ? e !== 0 || 1 / e === 1 / r : e !== e && r !== r;
}
function to(e) {
  return e instanceof Map;
}
function ro(e) {
  return e instanceof Set;
}
function Ot(e) {
  return e.copy_ || e.base_;
}
function N0(e, r) {
  if (to(e))
    return new Map(e);
  if (ro(e))
    return new Set(e);
  if (Array.isArray(e))
    return Array.prototype.slice.call(e);
  const t = vc(e);
  if (r === !0 || r === "class_only" && !t) {
    const n = Object.getOwnPropertyDescriptors(e);
    delete n[He];
    let o = Reflect.ownKeys(n);
    for (let i = 0; i < o.length; i++) {
      const c = o[i], s = n[c];
      s.writable === !1 && (s.writable = !0, s.configurable = !0), (s.get || s.set) && (n[c] = {
        configurable: !0,
        writable: !0,
        // could live with !!desc.set as well here...
        enumerable: s.enumerable,
        value: e[c]
      });
    }
    return Object.create(ar(e), n);
  } else {
    const n = ar(e);
    if (n !== null && t)
      return { ...e };
    const o = Object.create(n);
    return Object.assign(o, e);
  }
}
function fi(e, r = !1) {
  return no(e) || Pt(e) || !lt(e) || (eo(e) > 1 && (e.set = e.add = e.clear = e.delete = qd), Object.freeze(e), r && Object.entries(e).forEach(([t, n]) => fi(n, !0))), e;
}
function qd() {
  Se(2);
}
function no(e) {
  return Object.isFrozen(e);
}
var Gd = {};
function Wt(e) {
  const r = Gd[e];
  return r || Se(0, e), r;
}
var Lr;
function bc() {
  return Lr;
}
function Zd(e, r) {
  return {
    drafts_: [],
    parent_: e,
    immer_: r,
    // Whenever the modified draft contains a draft from another scope, we
    // need to prevent auto-freezing so the unowned draft can be finalized.
    canAutoFreeze_: !0,
    unfinalizedDrafts_: 0
  };
}
function Fa(e, r) {
  r && (Wt("Patches"), e.patches_ = [], e.inversePatches_ = [], e.patchListener_ = r);
}
function H0(e) {
  z0(e), e.drafts_.forEach(Yd), e.drafts_ = null;
}
function z0(e) {
  e === Lr && (Lr = e.parent_);
}
function Ta(e) {
  return Lr = Zd(Lr, e);
}
function Yd(e) {
  const r = e[He];
  r.type_ === 0 || r.type_ === 1 ? r.revoke_() : r.revoked_ = !0;
}
function Ra(e, r) {
  r.unfinalizedDrafts_ = r.drafts_.length;
  const t = r.drafts_[0];
  return e !== void 0 && e !== t ? (t[He].modified_ && (H0(r), Se(4)), lt(e) && (e = jn(r, e), r.parent_ || $n(r, e)), r.patches_ && Wt("Patches").generateReplacementPatches_(
    t[He].base_,
    e,
    r.patches_,
    r.inversePatches_
  )) : e = jn(r, t, []), H0(r), r.patches_ && r.patchListener_(r.patches_, r.inversePatches_), e !== wc ? e : void 0;
}
function jn(e, r, t) {
  if (no(r))
    return r;
  const n = r[He];
  if (!n)
    return Wn(
      r,
      (o, i) => Oa(e, n, r, o, i, t)
    ), r;
  if (n.scope_ !== e)
    return r;
  if (!n.modified_)
    return $n(e, n.base_, !0), n.base_;
  if (!n.finalized_) {
    n.finalized_ = !0, n.scope_.unfinalizedDrafts_--;
    const o = n.copy_;
    let i = o, c = !1;
    n.type_ === 3 && (i = new Set(o), o.clear(), c = !0), Wn(
      i,
      (s, u) => Oa(e, n, o, s, u, t, c)
    ), $n(e, o, !1), t && e.patches_ && Wt("Patches").generatePatches_(
      n,
      t,
      e.patches_,
      e.inversePatches_
    );
  }
  return n.copy_;
}
function Oa(e, r, t, n, o, i, c) {
  if (process.env.NODE_ENV !== "production" && o === t && Se(5), Pt(o)) {
    const s = i && r && r.type_ !== 3 && // Set objects are atomic since they have no keys.
    !I0(r.assigned_, n) ? i.concat(n) : void 0, u = jn(e, o, s);
    if (_c(t, n, u), Pt(u))
      e.canAutoFreeze_ = !1;
    else
      return;
  } else c && t.add(o);
  if (lt(o) && !no(o)) {
    if (!e.immer_.autoFreeze_ && e.unfinalizedDrafts_ < 1)
      return;
    jn(e, o), (!r || !r.scope_.parent_) && typeof n != "symbol" && Object.prototype.propertyIsEnumerable.call(t, n) && $n(e, o);
  }
}
function $n(e, r, t = !1) {
  !e.parent_ && e.immer_.autoFreeze_ && e.canAutoFreeze_ && fi(r, t);
}
function Xd(e, r) {
  const t = Array.isArray(e), n = {
    type_: t ? 1 : 0,
    // Track which produce call this is associated with.
    scope_: r ? r.scope_ : bc(),
    // True for both shallow and deep changes.
    modified_: !1,
    // Used during finalization.
    finalized_: !1,
    // Track which properties have been assigned (true) or deleted (false).
    assigned_: {},
    // The parent draft state.
    parent_: r,
    // The base state.
    base_: e,
    // The base proxy.
    draft_: null,
    // set below
    // The base copy with any updated values.
    copy_: null,
    // Called by the `produce` function.
    revoke_: null,
    isManual_: !1
  };
  let o = n, i = di;
  t && (o = [n], i = Ur);
  const { revoke: c, proxy: s } = Proxy.revocable(o, i);
  return n.draft_ = s, n.revoke_ = c, s;
}
var di = {
  get(e, r) {
    if (r === He)
      return e;
    const t = Ot(e);
    if (!I0(t, r))
      return Jd(e, t, r);
    const n = t[r];
    return e.finalized_ || !lt(n) ? n : n === f0(e.base_, r) ? (d0(e), e.copy_[r] = U0(n, e)) : n;
  },
  has(e, r) {
    return r in Ot(e);
  },
  ownKeys(e) {
    return Reflect.ownKeys(Ot(e));
  },
  set(e, r, t) {
    const n = mc(Ot(e), r);
    if (n != null && n.set)
      return n.set.call(e.draft_, t), !0;
    if (!e.modified_) {
      const o = f0(Ot(e), r), i = o == null ? void 0 : o[He];
      if (i && i.base_ === t)
        return e.copy_[r] = t, e.assigned_[r] = !1, !0;
      if (Vd(t, o) && (t !== void 0 || I0(e.base_, r)))
        return !0;
      d0(e), L0(e);
    }
    return e.copy_[r] === t && // special case: handle new props with value 'undefined'
    (t !== void 0 || r in e.copy_) || // special case: NaN
    Number.isNaN(t) && Number.isNaN(e.copy_[r]) || (e.copy_[r] = t, e.assigned_[r] = !0), !0;
  },
  deleteProperty(e, r) {
    return f0(e.base_, r) !== void 0 || r in e.base_ ? (e.assigned_[r] = !1, d0(e), L0(e)) : delete e.assigned_[r], e.copy_ && delete e.copy_[r], !0;
  },
  // Note: We never coerce `desc.value` into an Immer draft, because we can't make
  // the same guarantee in ES5 mode.
  getOwnPropertyDescriptor(e, r) {
    const t = Ot(e), n = Reflect.getOwnPropertyDescriptor(t, r);
    return n && {
      writable: !0,
      configurable: e.type_ !== 1 || r !== "length",
      enumerable: n.enumerable,
      value: t[r]
    };
  },
  defineProperty() {
    Se(11);
  },
  getPrototypeOf(e) {
    return ar(e.base_);
  },
  setPrototypeOf() {
    Se(12);
  }
}, Ur = {};
Wn(di, (e, r) => {
  Ur[e] = function() {
    return arguments[0] = arguments[0][0], r.apply(this, arguments);
  };
});
Ur.deleteProperty = function(e, r) {
  return process.env.NODE_ENV !== "production" && isNaN(parseInt(r)) && Se(13), Ur.set.call(this, e, r, void 0);
};
Ur.set = function(e, r, t) {
  return process.env.NODE_ENV !== "production" && r !== "length" && isNaN(parseInt(r)) && Se(14), di.set.call(this, e[0], r, t, e[0]);
};
function f0(e, r) {
  const t = e[He];
  return (t ? Ot(t) : e)[r];
}
function Jd(e, r, t) {
  var o;
  const n = mc(r, t);
  return n ? "value" in n ? n.value : (
    // This is a very special case, if the prop is a getter defined by the
    // prototype, we should invoke it with the draft as context!
    (o = n.get) == null ? void 0 : o.call(e.draft_)
  ) : void 0;
}
function mc(e, r) {
  if (!(r in e))
    return;
  let t = ar(e);
  for (; t; ) {
    const n = Object.getOwnPropertyDescriptor(t, r);
    if (n)
      return n;
    t = ar(t);
  }
}
function L0(e) {
  e.modified_ || (e.modified_ = !0, e.parent_ && L0(e.parent_));
}
function d0(e) {
  e.copy_ || (e.copy_ = N0(
    e.base_,
    e.scope_.immer_.useStrictShallowCopy_
  ));
}
var Qd = class {
  constructor(e) {
    this.autoFreeze_ = !0, this.useStrictShallowCopy_ = !1, this.produce = (r, t, n) => {
      if (typeof r == "function" && typeof t != "function") {
        const i = t;
        t = r;
        const c = this;
        return function(u = i, ...a) {
          return c.produce(u, (l) => t.call(this, l, ...a));
        };
      }
      typeof t != "function" && Se(6), n !== void 0 && typeof n != "function" && Se(7);
      let o;
      if (lt(r)) {
        const i = Ta(this), c = U0(r, void 0);
        let s = !0;
        try {
          o = t(c), s = !1;
        } finally {
          s ? H0(i) : z0(i);
        }
        return Fa(i, n), Ra(o, i);
      } else if (!r || typeof r != "object") {
        if (o = t(r), o === void 0 && (o = r), o === wc && (o = void 0), this.autoFreeze_ && fi(o, !0), n) {
          const i = [], c = [];
          Wt("Patches").generateReplacementPatches_(r, o, i, c), n(i, c);
        }
        return o;
      } else
        Se(1, r);
    }, this.produceWithPatches = (r, t) => {
      if (typeof r == "function")
        return (c, ...s) => this.produceWithPatches(c, (u) => r(u, ...s));
      let n, o;
      return [this.produce(r, t, (c, s) => {
        n = c, o = s;
      }), n, o];
    }, typeof (e == null ? void 0 : e.autoFreeze) == "boolean" && this.setAutoFreeze(e.autoFreeze), typeof (e == null ? void 0 : e.useStrictShallowCopy) == "boolean" && this.setUseStrictShallowCopy(e.useStrictShallowCopy);
  }
  createDraft(e) {
    lt(e) || Se(8), Pt(e) && (e = eh(e));
    const r = Ta(this), t = U0(e, void 0);
    return t[He].isManual_ = !0, z0(r), t;
  }
  finishDraft(e, r) {
    const t = e && e[He];
    (!t || !t.isManual_) && Se(9);
    const { scope_: n } = t;
    return Fa(n, r), Ra(void 0, n);
  }
  /**
   * Pass true to automatically freeze all copies created by Immer.
   *
   * By default, auto-freezing is enabled.
   */
  setAutoFreeze(e) {
    this.autoFreeze_ = e;
  }
  /**
   * Pass true to enable strict shallow copy.
   *
   * By default, immer does not copy the object descriptors such as getter, setter and non-enumrable properties.
   */
  setUseStrictShallowCopy(e) {
    this.useStrictShallowCopy_ = e;
  }
  applyPatches(e, r) {
    let t;
    for (t = r.length - 1; t >= 0; t--) {
      const o = r[t];
      if (o.path.length === 0 && o.op === "replace") {
        e = o.value;
        break;
      }
    }
    t > -1 && (r = r.slice(t + 1));
    const n = Wt("Patches").applyPatches_;
    return Pt(e) ? n(e, r) : this.produce(
      e,
      (o) => n(o, r)
    );
  }
};
function U0(e, r) {
  const t = to(e) ? Wt("MapSet").proxyMap_(e, r) : ro(e) ? Wt("MapSet").proxySet_(e, r) : Xd(e, r);
  return (r ? r.scope_ : bc()).drafts_.push(t), t;
}
function eh(e) {
  return Pt(e) || Se(10, e), Ec(e);
}
function Ec(e) {
  if (!lt(e) || no(e))
    return e;
  const r = e[He];
  let t;
  if (r) {
    if (!r.modified_)
      return r.base_;
    r.finalized_ = !0, t = N0(e, r.scope_.immer_.useStrictShallowCopy_);
  } else
    t = N0(e, !0);
  return Wn(t, (n, o) => {
    _c(t, n, Ec(o));
  }), r && (r.finalized_ = !1), t;
}
var ze = new Qd(), Ac = ze.produce;
ze.produceWithPatches.bind(
  ze
);
ze.setAutoFreeze.bind(ze);
ze.setUseStrictShallowCopy.bind(ze);
ze.applyPatches.bind(ze);
ze.createDraft.bind(ze);
ze.finishDraft.bind(ze);
var th = (e, r, t) => {
  if (r.length === 1 && r[0] === t) {
    let n = !1;
    try {
      const o = {};
      e(o) === o && (n = !0);
    } catch {
    }
    if (n) {
      let o;
      try {
        throw new Error();
      } catch (i) {
        ({ stack: o } = i);
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
}, rh = (e, r, t) => {
  const { memoize: n, memoizeOptions: o } = r, { inputSelectorResults: i, inputSelectorResultsCopy: c } = e, s = n(() => ({}), ...o);
  if (!(s.apply(null, i) === s.apply(null, c))) {
    let a;
    try {
      throw new Error();
    } catch (l) {
      ({ stack: a } = l);
    }
    console.warn(
      `An input selector returned a different result when passed same arguments.
This means your output selector will likely run more frequently than intended.
Avoid returning a new reference inside your input selector, e.g.
\`createSelector([state => state.todos.map(todo => todo.id)], todoIds => todoIds.length)\``,
      {
        arguments: t,
        firstInputs: i,
        secondInputs: c,
        stack: a
      }
    );
  }
}, nh = {
  inputStabilityCheck: "once",
  identityFunctionCheck: "once"
};
function oh(e, r = `expected a function, instead received ${typeof e}`) {
  if (typeof e != "function")
    throw new TypeError(r);
}
function ih(e, r = `expected an object, instead received ${typeof e}`) {
  if (typeof e != "object")
    throw new TypeError(r);
}
function ah(e, r = "expected all items to be functions, instead received the following types: ") {
  if (!e.every((t) => typeof t == "function")) {
    const t = e.map(
      (n) => typeof n == "function" ? `function ${n.name || "unnamed"}()` : typeof n
    ).join(", ");
    throw new TypeError(`${r}[${t}]`);
  }
}
var Ia = (e) => Array.isArray(e) ? e : [e];
function sh(e) {
  const r = Array.isArray(e[0]) ? e[0] : e;
  return ah(
    r,
    "createSelector expects all input-selectors to be functions, but received the following types: "
  ), r;
}
function Na(e, r) {
  const t = [], { length: n } = e;
  for (let o = 0; o < n; o++)
    t.push(e[o].apply(null, r));
  return t;
}
var ch = (e, r) => {
  const { identityFunctionCheck: t, inputStabilityCheck: n } = {
    ...nh,
    ...r
  };
  return {
    identityFunctionCheck: {
      shouldRun: t === "always" || t === "once" && e,
      run: th
    },
    inputStabilityCheck: {
      shouldRun: n === "always" || n === "once" && e,
      run: rh
    }
  };
}, lh = class {
  constructor(e) {
    this.value = e;
  }
  deref() {
    return this.value;
  }
}, uh = typeof WeakRef < "u" ? WeakRef : lh, fh = 0, Ha = 1;
function _n() {
  return {
    s: fh,
    v: void 0,
    o: null,
    p: null
  };
}
function Bc(e, r = {}) {
  let t = _n();
  const { resultEqualityCheck: n } = r;
  let o, i = 0;
  function c() {
    var h;
    let s = t;
    const { length: u } = arguments;
    for (let d = 0, f = u; d < f; d++) {
      const x = arguments[d];
      if (typeof x == "function" || typeof x == "object" && x !== null) {
        let v = s.o;
        v === null && (s.o = v = /* @__PURE__ */ new WeakMap());
        const w = v.get(x);
        w === void 0 ? (s = _n(), v.set(x, s)) : s = w;
      } else {
        let v = s.p;
        v === null && (s.p = v = /* @__PURE__ */ new Map());
        const w = v.get(x);
        w === void 0 ? (s = _n(), v.set(x, s)) : s = w;
      }
    }
    const a = s;
    let l;
    if (s.s === Ha)
      l = s.v;
    else if (l = e.apply(null, arguments), i++, n) {
      const d = ((h = o == null ? void 0 : o.deref) == null ? void 0 : h.call(o)) ?? o;
      d != null && n(d, l) && (l = d, i !== 0 && i--), o = typeof l == "object" && l !== null || typeof l == "function" ? new uh(l) : l;
    }
    return a.s = Ha, a.v = l, l;
  }
  return c.clearCache = () => {
    t = _n(), c.resetResultsCount();
  }, c.resultsCount = () => i, c.resetResultsCount = () => {
    i = 0;
  }, c;
}
function dh(e, ...r) {
  const t = typeof e == "function" ? {
    memoize: e,
    memoizeOptions: r
  } : e, n = (...o) => {
    let i = 0, c = 0, s, u = {}, a = o.pop();
    typeof a == "object" && (u = a, a = o.pop()), oh(
      a,
      `createSelector expects an output function after the inputs, but received: [${typeof a}]`
    );
    const l = {
      ...t,
      ...u
    }, {
      memoize: h,
      memoizeOptions: d = [],
      argsMemoize: f = Bc,
      argsMemoizeOptions: x = [],
      devModeChecks: v = {}
    } = l, w = Ia(d), _ = Ia(x), p = sh(o), g = h(function() {
      return i++, a.apply(
        null,
        arguments
      );
    }, ...w);
    let y = !0;
    const b = f(function() {
      c++;
      const m = Na(
        p,
        arguments
      );
      if (s = g.apply(null, m), process.env.NODE_ENV !== "production") {
        const { identityFunctionCheck: C, inputStabilityCheck: S } = ch(y, v);
        if (C.shouldRun && C.run(
          a,
          m,
          s
        ), S.shouldRun) {
          const E = Na(
            p,
            arguments
          );
          S.run(
            { inputSelectorResults: m, inputSelectorResultsCopy: E },
            { memoize: h, memoizeOptions: w },
            arguments
          );
        }
        y && (y = !1);
      }
      return s;
    }, ..._);
    return Object.assign(b, {
      resultFunc: a,
      memoizedResultFunc: g,
      dependencies: p,
      dependencyRecomputations: () => c,
      resetDependencyRecomputations: () => {
        c = 0;
      },
      lastResult: () => s,
      recomputations: () => i,
      resetRecomputations: () => {
        i = 0;
      },
      memoize: h,
      argsMemoize: f
    });
  };
  return Object.assign(n, {
    withTypes: () => n
  }), n;
}
var qt = /* @__PURE__ */ dh(Bc), hh = Object.assign(
  (e, r = qt) => {
    ih(
      e,
      `createStructuredSelector expects first argument to be an object where each property is a selector, instead received a ${typeof e}`
    );
    const t = Object.keys(e), n = t.map(
      (i) => e[i]
    );
    return r(
      n,
      (...i) => i.reduce((c, s, u) => (c[t[u]] = s, c), {})
    );
  },
  { withTypes: () => hh }
);
function Cc(e) {
  return ({ dispatch: t, getState: n }) => (o) => (i) => typeof i == "function" ? i(t, n, e) : o(i);
}
var xh = Cc(), ph = Cc, gh = typeof window < "u" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : function() {
  if (arguments.length !== 0)
    return typeof arguments[0] == "object" ? Pn : Pn.apply(null, arguments);
}, kc = (e) => e && typeof e.match == "function";
function Fr(e, r) {
  function t(...n) {
    if (r) {
      let o = r(...n);
      if (!o)
        throw new Error(process.env.NODE_ENV === "production" ? oe(0) : "prepareAction did not return an object");
      return {
        type: e,
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
      type: e,
      payload: n[0]
    };
  }
  return t.toString = () => `${e}`, t.type = e, t.match = (n) => yc(n) && n.type === e, t;
}
function yh(e) {
  return typeof e == "function" && "type" in e && // hasMatchFunction only wants Matchers but I don't see the point in rewriting it
  kc(e);
}
function wh(e) {
  const r = e ? `${e}`.split("/") : [], t = r[r.length - 1] || "actionCreator";
  return `Detected an action creator with type "${e || "unknown"}" being dispatched. 
Make sure you're calling the action creator before dispatching, i.e. \`dispatch(${t}())\` instead of \`dispatch(${t})\`. This is necessary even if the action has no payload.`;
}
function vh(e = {}) {
  if (process.env.NODE_ENV === "production")
    return () => (t) => (n) => t(n);
  const {
    isActionCreator: r = yh
  } = e;
  return () => (t) => (n) => (r(n) && console.warn(wh(n.type)), t(n));
}
function Sc(e, r) {
  let t = 0;
  return {
    measureTime(n) {
      const o = Date.now();
      try {
        return n();
      } finally {
        const i = Date.now();
        t += i - o;
      }
    },
    warnIfExceeded() {
      t > e && console.warn(`${r} took ${t}ms, which is more than the warning threshold of ${e}ms. 
If your state or actions are very large, you may want to disable the middleware as it might cause too much of a slowdown in development mode. See https://redux-toolkit.js.org/api/getDefaultMiddleware for instructions.
It is disabled in production builds, so you don't need to worry about that.`);
    }
  };
}
var Dc = class Cr extends Array {
  constructor(...r) {
    super(...r), Object.setPrototypeOf(this, Cr.prototype);
  }
  static get [Symbol.species]() {
    return Cr;
  }
  concat(...r) {
    return super.concat.apply(this, r);
  }
  prepend(...r) {
    return r.length === 1 && Array.isArray(r[0]) ? new Cr(...r[0].concat(this)) : new Cr(...r.concat(this));
  }
};
function za(e) {
  return lt(e) ? Ac(e, () => {
  }) : e;
}
function La(e, r, t) {
  return e.has(r) ? e.get(r) : e.set(r, t(r)).get(r);
}
function _h(e) {
  return typeof e != "object" || e == null || Object.isFrozen(e);
}
function bh(e, r, t) {
  const n = Fc(e, r, t);
  return {
    detectMutations() {
      return Tc(e, r, n, t);
    }
  };
}
function Fc(e, r = [], t, n = "", o = /* @__PURE__ */ new Set()) {
  const i = {
    value: t
  };
  if (!e(t) && !o.has(t)) {
    o.add(t), i.children = {};
    for (const c in t) {
      const s = n ? n + "." + c : c;
      r.length && r.indexOf(s) !== -1 || (i.children[c] = Fc(e, r, t[c], s));
    }
  }
  return i;
}
function Tc(e, r = [], t, n, o = !1, i = "") {
  const c = t ? t.value : void 0, s = c === n;
  if (o && !s && !Number.isNaN(n))
    return {
      wasMutated: !0,
      path: i
    };
  if (e(c) || e(n))
    return {
      wasMutated: !1
    };
  const u = {};
  for (let l in t.children)
    u[l] = !0;
  for (let l in n)
    u[l] = !0;
  const a = r.length > 0;
  for (let l in u) {
    const h = i ? i + "." + l : l;
    if (a && r.some((x) => x instanceof RegExp ? x.test(h) : h === x))
      continue;
    const d = Tc(e, r, t.children[l], n[l], s, h);
    if (d.wasMutated)
      return d;
  }
  return {
    wasMutated: !1
  };
}
function mh(e = {}) {
  if (process.env.NODE_ENV === "production")
    return () => (r) => (t) => r(t);
  {
    let r = function(s, u, a, l) {
      return JSON.stringify(s, t(u, l), a);
    }, t = function(s, u) {
      let a = [], l = [];
      return u || (u = function(h, d) {
        return a[0] === d ? "[Circular ~]" : "[Circular ~." + l.slice(0, a.indexOf(d)).join(".") + "]";
      }), function(h, d) {
        if (a.length > 0) {
          var f = a.indexOf(this);
          ~f ? a.splice(f + 1) : a.push(this), ~f ? l.splice(f, 1 / 0, h) : l.push(h), ~a.indexOf(d) && (d = u.call(this, h, d));
        } else a.push(d);
        return s == null ? d : s.call(this, h, d);
      };
    }, {
      isImmutable: n = _h,
      ignoredPaths: o,
      warnAfter: i = 32
    } = e;
    const c = bh.bind(null, n, o);
    return ({
      getState: s
    }) => {
      let u = s(), a = c(u), l;
      return (h) => (d) => {
        const f = Sc(i, "ImmutableStateInvariantMiddleware");
        f.measureTime(() => {
          if (u = s(), l = a.detectMutations(), a = c(u), l.wasMutated)
            throw new Error(process.env.NODE_ENV === "production" ? oe(19) : `A state mutation was detected between dispatches, in the path '${l.path || ""}'.  This may cause incorrect behavior. (https://redux.js.org/style-guide/style-guide#do-not-mutate-state)`);
        });
        const x = h(d);
        return f.measureTime(() => {
          if (u = s(), l = a.detectMutations(), a = c(u), l.wasMutated)
            throw new Error(process.env.NODE_ENV === "production" ? oe(20) : `A state mutation was detected inside a dispatch, in the path: ${l.path || ""}. Take a look at the reducer(s) handling the action ${r(d)}. (https://redux.js.org/style-guide/style-guide#do-not-mutate-state)`);
        }), f.warnIfExceeded(), x;
      };
    };
  }
}
function Rc(e) {
  const r = typeof e;
  return e == null || r === "string" || r === "boolean" || r === "number" || Array.isArray(e) || Gr(e);
}
function M0(e, r = "", t = Rc, n, o = [], i) {
  let c;
  if (!t(e))
    return {
      keyPath: r || "<root>",
      value: e
    };
  if (typeof e != "object" || e === null || i != null && i.has(e)) return !1;
  const s = n != null ? n(e) : Object.entries(e), u = o.length > 0;
  for (const [a, l] of s) {
    const h = r ? r + "." + a : a;
    if (!(u && o.some((f) => f instanceof RegExp ? f.test(h) : h === f))) {
      if (!t(l))
        return {
          keyPath: h,
          value: l
        };
      if (typeof l == "object" && (c = M0(l, h, t, n, o, i), c))
        return c;
    }
  }
  return i && Oc(e) && i.add(e), !1;
}
function Oc(e) {
  if (!Object.isFrozen(e)) return !1;
  for (const r of Object.values(e))
    if (!(typeof r != "object" || r === null) && !Oc(r))
      return !1;
  return !0;
}
function Eh(e = {}) {
  if (process.env.NODE_ENV === "production")
    return () => (r) => (t) => r(t);
  {
    const {
      isSerializable: r = Rc,
      getEntries: t,
      ignoredActions: n = [],
      ignoredActionPaths: o = ["meta.arg", "meta.baseQueryMeta"],
      ignoredPaths: i = [],
      warnAfter: c = 32,
      ignoreState: s = !1,
      ignoreActions: u = !1,
      disableCache: a = !1
    } = e, l = !a && WeakSet ? /* @__PURE__ */ new WeakSet() : void 0;
    return (h) => (d) => (f) => {
      if (!yc(f))
        return d(f);
      const x = d(f), v = Sc(c, "SerializableStateInvariantMiddleware");
      return !u && !(n.length && n.indexOf(f.type) !== -1) && v.measureTime(() => {
        const w = M0(f, "", r, t, o, l);
        if (w) {
          const {
            keyPath: _,
            value: p
          } = w;
          console.error(`A non-serializable value was detected in an action, in the path: \`${_}\`. Value:`, p, `
Take a look at the logic that dispatched this action: `, f, `
(See https://redux.js.org/faq/actions#why-should-type-be-a-string-or-at-least-serializable-why-should-my-action-types-be-constants)`, `
(To allow non-serializable values see: https://redux-toolkit.js.org/usage/usage-guide#working-with-non-serializable-data)`);
        }
      }), s || (v.measureTime(() => {
        const w = h.getState(), _ = M0(w, "", r, t, i, l);
        if (_) {
          const {
            keyPath: p,
            value: g
          } = _;
          console.error(`A non-serializable value was detected in the state, in the path: \`${p}\`. Value:`, g, `
Take a look at the reducer(s) handling this action type: ${f.type}.
(See https://redux.js.org/faq/organizing-state#can-i-put-functions-promises-or-other-non-serializable-items-in-my-store-state)`);
        }
      }), v.warnIfExceeded()), x;
    };
  }
}
function bn(e) {
  return typeof e == "boolean";
}
var Ah = () => function(r) {
  const {
    thunk: t = !0,
    immutableCheck: n = !0,
    serializableCheck: o = !0,
    actionCreatorCheck: i = !0
  } = r ?? {};
  let c = new Dc();
  if (t && (bn(t) ? c.push(xh) : c.push(ph(t.extraArgument))), process.env.NODE_ENV !== "production") {
    if (n) {
      let s = {};
      bn(n) || (s = n), c.unshift(mh(s));
    }
    if (o) {
      let s = {};
      bn(o) || (s = o), c.push(Eh(s));
    }
    if (i) {
      let s = {};
      bn(i) || (s = i), c.unshift(vh(s));
    }
  }
  return c;
}, Bh = "RTK_autoBatch", Ua = (e) => (r) => {
  setTimeout(r, e);
}, Ch = (e = {
  type: "raf"
}) => (r) => (...t) => {
  const n = r(...t);
  let o = !0, i = !1, c = !1;
  const s = /* @__PURE__ */ new Set(), u = e.type === "tick" ? queueMicrotask : e.type === "raf" ? (
    // requestAnimationFrame won't exist in SSR environments. Fall back to a vague approximation just to keep from erroring.
    typeof window < "u" && window.requestAnimationFrame ? window.requestAnimationFrame : Ua(10)
  ) : e.type === "callback" ? e.queueNotification : Ua(e.timeout), a = () => {
    c = !1, i && (i = !1, s.forEach((l) => l()));
  };
  return Object.assign({}, n, {
    // Override the base `store.subscribe` method to keep original listeners
    // from running if we're delaying notifications
    subscribe(l) {
      const h = () => o && l(), d = n.subscribe(h);
      return s.add(l), () => {
        d(), s.delete(l);
      };
    },
    // Override the base `store.dispatch` method so that we can check actions
    // for the `shouldAutoBatch` flag and determine if batching is active
    dispatch(l) {
      var h;
      try {
        return o = !((h = l == null ? void 0 : l.meta) != null && h[Bh]), i = !o, i && (c || (c = !0, u(a))), n.dispatch(l);
      } finally {
        o = !0;
      }
    }
  });
}, kh = (e) => function(t) {
  const {
    autoBatch: n = !0
  } = t ?? {};
  let o = new Dc(e);
  return n && o.push(Ch(typeof n == "object" ? n : void 0)), o;
};
function Sh(e) {
  const r = Ah(), {
    reducer: t = void 0,
    middleware: n,
    devTools: o = !0,
    preloadedState: i = void 0,
    enhancers: c = void 0
  } = e;
  let s;
  if (typeof t == "function")
    s = t;
  else if (Gr(t))
    s = Wd(t);
  else
    throw new Error(process.env.NODE_ENV === "production" ? oe(1) : "`reducer` is a required argument, and must be a function or an object of functions that can be passed to combineReducers");
  if (process.env.NODE_ENV !== "production" && n && typeof n != "function")
    throw new Error(process.env.NODE_ENV === "production" ? oe(2) : "`middleware` field must be a callback");
  let u;
  if (typeof n == "function") {
    if (u = n(r), process.env.NODE_ENV !== "production" && !Array.isArray(u))
      throw new Error(process.env.NODE_ENV === "production" ? oe(3) : "when using a middleware builder function, an array of middleware must be returned");
  } else
    u = r();
  if (process.env.NODE_ENV !== "production" && u.some((x) => typeof x != "function"))
    throw new Error(process.env.NODE_ENV === "production" ? oe(4) : "each middleware provided to configureStore must be a function");
  let a = Pn;
  o && (a = gh({
    // Enable capture of stack traces for dispatched Redux actions
    trace: process.env.NODE_ENV !== "production",
    ...typeof o == "object" && o
  }));
  const l = jd(...u), h = kh(l);
  if (process.env.NODE_ENV !== "production" && c && typeof c != "function")
    throw new Error(process.env.NODE_ENV === "production" ? oe(5) : "`enhancers` field must be a callback");
  let d = typeof c == "function" ? c(h) : h();
  if (process.env.NODE_ENV !== "production" && !Array.isArray(d))
    throw new Error(process.env.NODE_ENV === "production" ? oe(6) : "`enhancers` callback must return an array");
  if (process.env.NODE_ENV !== "production" && d.some((x) => typeof x != "function"))
    throw new Error(process.env.NODE_ENV === "production" ? oe(7) : "each enhancer provided to configureStore must be a function");
  process.env.NODE_ENV !== "production" && u.length && !d.includes(l) && console.error("middlewares were provided, but middleware enhancer was not included in final enhancers - make sure to call `getDefaultEnhancers`");
  const f = a(...d);
  return gc(s, i, f);
}
function Ic(e) {
  const r = {}, t = [];
  let n;
  const o = {
    addCase(i, c) {
      if (process.env.NODE_ENV !== "production") {
        if (t.length > 0)
          throw new Error(process.env.NODE_ENV === "production" ? oe(26) : "`builder.addCase` should only be called before calling `builder.addMatcher`");
        if (n)
          throw new Error(process.env.NODE_ENV === "production" ? oe(27) : "`builder.addCase` should only be called before calling `builder.addDefaultCase`");
      }
      const s = typeof i == "string" ? i : i.type;
      if (!s)
        throw new Error(process.env.NODE_ENV === "production" ? oe(28) : "`builder.addCase` cannot be called with an empty action type");
      if (s in r)
        throw new Error(process.env.NODE_ENV === "production" ? oe(29) : `\`builder.addCase\` cannot be called with two reducers for the same action type '${s}'`);
      return r[s] = c, o;
    },
    addMatcher(i, c) {
      if (process.env.NODE_ENV !== "production" && n)
        throw new Error(process.env.NODE_ENV === "production" ? oe(30) : "`builder.addMatcher` should only be called before calling `builder.addDefaultCase`");
      return t.push({
        matcher: i,
        reducer: c
      }), o;
    },
    addDefaultCase(i) {
      if (process.env.NODE_ENV !== "production" && n)
        throw new Error(process.env.NODE_ENV === "production" ? oe(31) : "`builder.addDefaultCase` can only be called once");
      return n = i, o;
    }
  };
  return e(o), [r, t, n];
}
function Dh(e) {
  return typeof e == "function";
}
function Fh(e, r) {
  if (process.env.NODE_ENV !== "production" && typeof r == "object")
    throw new Error(process.env.NODE_ENV === "production" ? oe(8) : "The object notation for `createReducer` has been removed. Please use the 'builder callback' notation instead: https://redux-toolkit.js.org/api/createReducer");
  let [t, n, o] = Ic(r), i;
  if (Dh(e))
    i = () => za(e());
  else {
    const s = za(e);
    i = () => s;
  }
  function c(s = i(), u) {
    let a = [t[u.type], ...n.filter(({
      matcher: l
    }) => l(u)).map(({
      reducer: l
    }) => l)];
    return a.filter((l) => !!l).length === 0 && (a = [o]), a.reduce((l, h) => {
      if (h)
        if (Pt(l)) {
          const f = h(l, u);
          return f === void 0 ? l : f;
        } else {
          if (lt(l))
            return Ac(l, (d) => h(d, u));
          {
            const d = h(l, u);
            if (d === void 0) {
              if (l === null)
                return l;
              throw Error("A case reducer on a non-draftable value must not return undefined");
            }
            return d;
          }
        }
      return l;
    }, s);
  }
  return c.getInitialState = i, c;
}
var Th = (e, r) => kc(e) ? e.match(r) : e(r);
function Rh(...e) {
  return (r) => e.some((t) => Th(t, r));
}
var Oh = "ModuleSymbhasOwnPr-0123456789ABCDEFGHNRVfgctiUvz_KqYTJkLxpZXIjQW", Ih = (e = 21) => {
  let r = "", t = e;
  for (; t--; )
    r += Oh[Math.random() * 64 | 0];
  return r;
}, Nh = ["name", "message", "stack", "code"], h0 = class {
  constructor(e, r) {
    /*
    type-only property to distinguish between RejectWithValue and FulfillWithMeta
    does not exist at runtime
    */
    de(this, "_type");
    this.payload = e, this.meta = r;
  }
}, Ma = class {
  constructor(e, r) {
    /*
    type-only property to distinguish between RejectWithValue and FulfillWithMeta
    does not exist at runtime
    */
    de(this, "_type");
    this.payload = e, this.meta = r;
  }
}, Hh = (e) => {
  if (typeof e == "object" && e !== null) {
    const r = {};
    for (const t of Nh)
      typeof e[t] == "string" && (r[t] = e[t]);
    return r;
  }
  return {
    message: String(e)
  };
}, Zr = /* @__PURE__ */ (() => {
  function e(r, t, n) {
    const o = Fr(r + "/fulfilled", (u, a, l, h) => ({
      payload: u,
      meta: {
        ...h || {},
        arg: l,
        requestId: a,
        requestStatus: "fulfilled"
      }
    })), i = Fr(r + "/pending", (u, a, l) => ({
      payload: void 0,
      meta: {
        ...l || {},
        arg: a,
        requestId: u,
        requestStatus: "pending"
      }
    })), c = Fr(r + "/rejected", (u, a, l, h, d) => ({
      payload: h,
      error: (n && n.serializeError || Hh)(u || "Rejected"),
      meta: {
        ...d || {},
        arg: l,
        requestId: a,
        rejectedWithValue: !!h,
        requestStatus: "rejected",
        aborted: (u == null ? void 0 : u.name) === "AbortError",
        condition: (u == null ? void 0 : u.name) === "ConditionError"
      }
    }));
    function s(u) {
      return (a, l, h) => {
        const d = n != null && n.idGenerator ? n.idGenerator(u) : Ih(), f = new AbortController();
        let x, v;
        function w(p) {
          v = p, f.abort();
        }
        const _ = async function() {
          var y, b;
          let p;
          try {
            let A = (y = n == null ? void 0 : n.condition) == null ? void 0 : y.call(n, u, {
              getState: l,
              extra: h
            });
            if (Lh(A) && (A = await A), A === !1 || f.signal.aborted)
              throw {
                name: "ConditionError",
                message: "Aborted due to condition callback returning false."
              };
            const m = new Promise((C, S) => {
              x = () => {
                S({
                  name: "AbortError",
                  message: v || "Aborted"
                });
              }, f.signal.addEventListener("abort", x);
            });
            a(i(d, u, (b = n == null ? void 0 : n.getPendingMeta) == null ? void 0 : b.call(n, {
              requestId: d,
              arg: u
            }, {
              getState: l,
              extra: h
            }))), p = await Promise.race([m, Promise.resolve(t(u, {
              dispatch: a,
              getState: l,
              extra: h,
              requestId: d,
              signal: f.signal,
              abort: w,
              rejectWithValue: (C, S) => new h0(C, S),
              fulfillWithValue: (C, S) => new Ma(C, S)
            })).then((C) => {
              if (C instanceof h0)
                throw C;
              return C instanceof Ma ? o(C.payload, d, u, C.meta) : o(C, d, u);
            })]);
          } catch (A) {
            p = A instanceof h0 ? c(null, d, u, A.payload, A.meta) : c(A, d, u);
          } finally {
            x && f.signal.removeEventListener("abort", x);
          }
          return n && !n.dispatchConditionRejection && c.match(p) && p.meta.condition || a(p), p;
        }();
        return Object.assign(_, {
          abort: w,
          requestId: d,
          arg: u,
          unwrap() {
            return _.then(zh);
          }
        });
      };
    }
    return Object.assign(s, {
      pending: i,
      rejected: c,
      fulfilled: o,
      settled: Rh(c, o),
      typePrefix: r
    });
  }
  return e.withTypes = () => e, e;
})();
function zh(e) {
  if (e.meta && e.meta.rejectedWithValue)
    throw e.payload;
  if (e.error)
    throw e.error;
  return e.payload;
}
function Lh(e) {
  return e !== null && typeof e == "object" && typeof e.then == "function";
}
var Uh = /* @__PURE__ */ Symbol.for("rtk-slice-createasyncthunk");
function Mh(e, r) {
  return `${e}/${r}`;
}
function Ph({
  creators: e
} = {}) {
  var t;
  const r = (t = e == null ? void 0 : e.asyncThunk) == null ? void 0 : t[Uh];
  return function(o) {
    const {
      name: i,
      reducerPath: c = i
    } = o;
    if (!i)
      throw new Error(process.env.NODE_ENV === "production" ? oe(11) : "`name` is a required option for createSlice");
    typeof process < "u" && process.env.NODE_ENV === "development" && o.initialState === void 0 && console.error("You must provide an `initialState` value that is not `undefined`. You may have misspelled `initialState`");
    const s = (typeof o.reducers == "function" ? o.reducers(jh()) : o.reducers) || {}, u = Object.keys(s), a = {
      sliceCaseReducersByName: {},
      sliceCaseReducersByType: {},
      actionCreators: {},
      sliceMatchers: []
    }, l = {
      addCase(g, y) {
        const b = typeof g == "string" ? g : g.type;
        if (!b)
          throw new Error(process.env.NODE_ENV === "production" ? oe(12) : "`context.addCase` cannot be called with an empty action type");
        if (b in a.sliceCaseReducersByType)
          throw new Error(process.env.NODE_ENV === "production" ? oe(13) : "`context.addCase` cannot be called with two reducers for the same action type: " + b);
        return a.sliceCaseReducersByType[b] = y, l;
      },
      addMatcher(g, y) {
        return a.sliceMatchers.push({
          matcher: g,
          reducer: y
        }), l;
      },
      exposeAction(g, y) {
        return a.actionCreators[g] = y, l;
      },
      exposeCaseReducer(g, y) {
        return a.sliceCaseReducersByName[g] = y, l;
      }
    };
    u.forEach((g) => {
      const y = s[g], b = {
        reducerName: g,
        type: Mh(i, g),
        createNotation: typeof o.reducers == "function"
      };
      Kh(y) ? qh(b, y, l, r) : $h(b, y, l);
    });
    function h() {
      if (process.env.NODE_ENV !== "production" && typeof o.extraReducers == "object")
        throw new Error(process.env.NODE_ENV === "production" ? oe(14) : "The object notation for `createSlice.extraReducers` has been removed. Please use the 'builder callback' notation instead: https://redux-toolkit.js.org/api/createSlice");
      const [g = {}, y = [], b = void 0] = typeof o.extraReducers == "function" ? Ic(o.extraReducers) : [o.extraReducers], A = {
        ...g,
        ...a.sliceCaseReducersByType
      };
      return Fh(o.initialState, (m) => {
        for (let C in A)
          m.addCase(C, A[C]);
        for (let C of a.sliceMatchers)
          m.addMatcher(C.matcher, C.reducer);
        for (let C of y)
          m.addMatcher(C.matcher, C.reducer);
        b && m.addDefaultCase(b);
      });
    }
    const d = (g) => g, f = /* @__PURE__ */ new Map();
    let x;
    function v(g, y) {
      return x || (x = h()), x(g, y);
    }
    function w() {
      return x || (x = h()), x.getInitialState();
    }
    function _(g, y = !1) {
      function b(m) {
        let C = m[g];
        if (typeof C > "u") {
          if (y)
            C = w();
          else if (process.env.NODE_ENV !== "production")
            throw new Error(process.env.NODE_ENV === "production" ? oe(15) : "selectSlice returned undefined for an uninjected slice reducer");
        }
        return C;
      }
      function A(m = d) {
        const C = La(f, y, () => /* @__PURE__ */ new WeakMap());
        return La(C, m, () => {
          const S = {};
          for (const [E, k] of Object.entries(o.selectors ?? {}))
            S[E] = Wh(k, m, w, y);
          return S;
        });
      }
      return {
        reducerPath: g,
        getSelectors: A,
        get selectors() {
          return A(b);
        },
        selectSlice: b
      };
    }
    const p = {
      name: i,
      reducer: v,
      actions: a.actionCreators,
      caseReducers: a.sliceCaseReducersByName,
      getInitialState: w,
      ..._(c),
      injectInto(g, {
        reducerPath: y,
        ...b
      } = {}) {
        const A = y ?? c;
        return g.inject({
          reducerPath: A,
          reducer: v
        }, b), {
          ...p,
          ..._(A, !0)
        };
      }
    };
    return p;
  };
}
function Wh(e, r, t, n) {
  function o(i, ...c) {
    let s = r(i);
    if (typeof s > "u") {
      if (n)
        s = t();
      else if (process.env.NODE_ENV !== "production")
        throw new Error(process.env.NODE_ENV === "production" ? oe(16) : "selectState returned undefined for an uninjected slice reducer");
    }
    return e(s, ...c);
  }
  return o.unwrapped = e, o;
}
var oo = /* @__PURE__ */ Ph();
function jh() {
  function e(r, t) {
    return {
      _reducerDefinitionType: "asyncThunk",
      payloadCreator: r,
      ...t
    };
  }
  return e.withTypes = () => e, {
    reducer(r) {
      return Object.assign({
        // hack so the wrapping function has the same name as the original
        // we need to create a wrapper so the `reducerDefinitionType` is not assigned to the original
        [r.name](...t) {
          return r(...t);
        }
      }[r.name], {
        _reducerDefinitionType: "reducer"
        /* reducer */
      });
    },
    preparedReducer(r, t) {
      return {
        _reducerDefinitionType: "reducerWithPrepare",
        prepare: r,
        reducer: t
      };
    },
    asyncThunk: e
  };
}
function $h({
  type: e,
  reducerName: r,
  createNotation: t
}, n, o) {
  let i, c;
  if ("reducer" in n) {
    if (t && !Vh(n))
      throw new Error(process.env.NODE_ENV === "production" ? oe(17) : "Please use the `create.preparedReducer` notation for prepared action creators with the `create` notation.");
    i = n.reducer, c = n.prepare;
  } else
    i = n;
  o.addCase(e, i).exposeCaseReducer(r, i).exposeAction(r, c ? Fr(e, c) : Fr(e));
}
function Kh(e) {
  return e._reducerDefinitionType === "asyncThunk";
}
function Vh(e) {
  return e._reducerDefinitionType === "reducerWithPrepare";
}
function qh({
  type: e,
  reducerName: r
}, t, n, o) {
  if (!o)
    throw new Error(process.env.NODE_ENV === "production" ? oe(18) : "Cannot use `create.asyncThunk` in the built-in `createSlice`. Use `buildCreateSlice({ creators: { asyncThunk: asyncThunkCreator } })` to create a customised version of `createSlice`.");
  const {
    payloadCreator: i,
    fulfilled: c,
    pending: s,
    rejected: u,
    settled: a,
    options: l
  } = t, h = o(e, i, l);
  n.exposeAction(r, h), c && n.addCase(h.fulfilled, c), s && n.addCase(h.pending, s), u && n.addCase(h.rejected, u), a && n.addMatcher(h.settled, a), n.exposeCaseReducer(r, {
    fulfilled: c || mn,
    pending: s || mn,
    rejected: u || mn,
    settled: a || mn
  });
}
function mn() {
}
function oe(e) {
  return `Minified Redux Toolkit error #${e}; visit https://redux-toolkit.js.org/Errors?code=${e} for the full message or use the non-minified dev environment for full errors. `;
}
const Pa = {
  initialized: !1,
  locked: !0,
  hasWallet: !1,
  network: "mainnet",
  error: null,
  highestAccountIndex: -1
}, Nc = oo({
  name: "wallet",
  initialState: Pa,
  reducers: {
    setInitialized: (e, r) => {
      e.initialized = r.payload;
    },
    setLocked: (e, r) => {
      e.locked = r.payload;
    },
    setHasWallet: (e, r) => {
      e.hasWallet = r.payload;
    },
    setNetwork: (e, r) => {
      e.network = r.payload;
    },
    setError: (e, r) => {
      e.error = r.payload;
    },
    reset: () => Pa,
    incrementHighestIndex: (e) => {
      e.highestAccountIndex += 1;
    },
    setHighestIndex: (e, r) => {
      e.highestAccountIndex = r.payload;
    }
  }
}), {
  setInitialized: io,
  setLocked: Yr,
  setHasWallet: Xr,
  setNetwork: p2,
  setError: Fe,
  reset: g2,
  incrementHighestIndex: y2,
  setHighestIndex: ao
} = Nc.actions, Gh = Nc.reducer, Zh = {
  blockHeight: 0,
  isConnected: !1,
  error: null
}, Hc = oo({
  name: "network",
  initialState: Zh,
  reducers: {
    setBlockHeight: (e, r) => {
      e.blockHeight = r.payload;
    },
    setNetworkStatus: (e, r) => {
      e.isConnected = r.payload.isConnected, e.error = r.payload.error || null;
    }
  }
}), { setBlockHeight: Yh, setNetworkStatus: w2 } = Hc.actions, Xh = Hc.reducer, Jh = {
  isLoading: !1,
  error: null,
  pendingTransactions: []
}, zc = oo({
  name: "transaction",
  initialState: Jh,
  reducers: {
    setLoading: (e, r) => {
      e.isLoading = r.payload;
    },
    setError: (e, r) => {
      e.error = r.payload;
    },
    addPendingTransaction: (e, r) => {
      e.pendingTransactions.push(r.payload);
    },
    removePendingTransaction: (e, r) => {
      e.pendingTransactions = e.pendingTransactions.filter(
        (t) => t !== r.payload
      );
    }
  }
}), {
  setLoading: Wa,
  setError: ja,
  addPendingTransaction: Qh,
  removePendingTransaction: ex
} = zc.actions, tx = zc.reducer, $a = {
  accounts: {},
  selectedAccount: null,
  loading: !1,
  error: null
}, Lc = oo({
  name: "accounts",
  initialState: $a,
  reducers: {
    addAccount: (e, r) => {
      e.accounts[r.payload.id] = r.payload.account;
    },
    updateAccount: (e, r) => {
      e.accounts[r.payload.id] && (e.accounts[r.payload.id] = {
        ...e.accounts[r.payload.id],
        ...r.payload.updates
      });
    },
    removeAccount: (e, r) => {
      delete e.accounts[r.payload], e.selectedAccount === r.payload && (e.selectedAccount = null);
    },
    setSelectedAccount: (e, r) => {
      e.selectedAccount = r.payload;
    },
    setLoading: (e, r) => {
      e.loading = r.payload;
    },
    setError: (e, r) => {
      e.error = r.payload;
    },
    reset: () => $a,
    renameAccount: (e, r) => {
      e.accounts[r.payload.id] && (e.accounts[r.payload.id].name = r.payload.name);
    },
    reorderAccounts: (e, r) => {
      Object.entries(r.payload).forEach(([t, n]) => {
        e.accounts[t] && (e.accounts[t].order = n);
      });
    },
    moveAccount: (e, r) => {
      const { id: t, direction: n } = r.payload, o = Object.entries(e.accounts).sort(([, s], [, u]) => (s.order ?? 0) - (u.order ?? 0)), i = o.findIndex(([s]) => s === t);
      if (i === -1) return;
      const c = n === "up" ? Math.max(0, i - 1) : Math.min(o.length - 1, i + 1);
      if (i !== c) {
        const s = o[i][1].order ?? 0, u = o[c][1].order ?? 0;
        e.accounts[t].order = u, e.accounts[o[c][0]].order = s;
      }
    },
    bulkAddAccounts: (e, r) => {
      e.accounts = {
        ...e.accounts,
        ...r.payload
      };
    }
  }
}), {
  addAccount: rx,
  updateAccount: Uc,
  removeAccount: v2,
  setSelectedAccount: hi,
  setLoading: _2,
  setError: b2,
  renameAccount: m2,
  reorderAccounts: nx,
  moveAccount: E2,
  reset: A2,
  bulkAddAccounts: xi
} = Lc.actions, ox = Lc.reducer, ix = Sh({
  reducer: {
    wallet: Gh,
    network: Xh,
    transaction: tx,
    accounts: ox
  },
  middleware: (e) => e({
    serializableCheck: !1,
    thunk: !0
  })
}), Zn = class Zn {
  constructor() {
    de(this, "masterSeed", null);
    de(this, "storageKey", null);
  }
  static getInstance() {
    return this.instance || (this.instance = new Zn()), this.instance;
  }
  async unlock(r, t) {
    try {
      const n = await t.loadMasterSeed();
      if (!n) throw new Error("No master seed found");
      const o = await ve.deriveKey(n, r);
      this.masterSeed = await ve.importFromDerivedKey(n, o);
      const i = this.masterSeed.deriveStorageKey();
      return this.storageKey = i, { jwk: await crypto.subtle.exportKey("jwk", o), storageKey: i };
    } catch (n) {
      throw console.error("Error unlocking wallet", n), new Error("Invalid password");
    }
  }
  async unlockWithSeed(r) {
    try {
      this.masterSeed = new ve(Buffer.from(r, "hex")), this.storageKey = this.masterSeed.deriveStorageKey();
    } catch {
      throw new Error("Invalid seed");
    }
  }
  async unlockWithMnemonic(r) {
    try {
      this.masterSeed = await ve.fromPhrase(r), this.storageKey = this.masterSeed.deriveStorageKey();
    } catch {
      throw new Error("Invalid mnemonic");
    }
  }
  async unlockWithDerivedKey(r, t) {
    try {
      const n = await t.loadMasterSeed();
      if (!n) throw new Error("No master seed found");
      this.masterSeed = await ve.importFromDerivedKeyJWK(n, r), this.storageKey = this.masterSeed.deriveStorageKey();
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
  setMasterSeed(r) {
    this.masterSeed = r, this.storageKey = r.deriveStorageKey();
  }
};
de(Zn, "instance");
let _e = Zn;
const pi = (e, r) => async (t) => {
  try {
    const n = be.getStorage(), o = await n.loadAccount(e, _e.getInstance().getStorageKey());
    if (!o) throw new Error("Account not found");
    const i = { ...o, ...r };
    await n.saveAccount(i, _e.getInstance().getStorageKey()), t(Uc({ id: e, updates: r }));
  } catch (n) {
    throw t(Fe("Failed to update account")), n;
  }
}, ax = (e, r) => async (t) => t(pi(e, { name: r })), sx = Zr(
  "accounts/delete",
  async (e, { dispatch: r, getState: t }) => {
    try {
      const n = t();
      if (!n.accounts.accounts[e])
        throw new Error("Account not found");
      if (Object.keys(n.accounts.accounts).length <= 1)
        throw new Error("Cannot delete last account");
      const c = be.getStorage();
      await r(pi(e, { isDeleted: !0 })), n.accounts.selectedAccount === e && await c.saveActiveAccount(""), e === n.accounts.selectedAccount && r(hi(null));
    } catch (n) {
      throw r(Fe("Failed to delete account")), n;
    }
  }
), cx = (e) => async (r, t) => {
  try {
    const o = t().accounts.accounts, i = new Set(Object.keys(o).filter((l) => !o[l].isDeleted)), c = new Set(Object.keys(e));
    if (i.size !== c.size || ![...i].every((l) => c.has(l)))
      throw new Error("New order must include all accounts");
    const s = Object.values(e);
    if (new Set(s).size !== s.length)
      throw new Error("Order numbers must be unique");
    const a = be.getStorage();
    await Promise.all(
      Object.entries(e).map(
        ([l, h]) => a.saveAccount({ ...o[l], order: h }, _e.getInstance().getStorageKey())
      )
    ), r(nx(e));
  } catch (n) {
    throw r(Fe("Failed to reorder accounts")), n;
  }
}, lx = Zr(
  "wallet/create",
  async ({ password: e, mnemonic: r }, { dispatch: t, rejectWithValue: n }) => {
    try {
      let o, i;
      r ? o = await ve.fromPhrase(r) : (o = await ve.create(), i = await o.toPhrase());
      const c = be.getStorage(), s = await o.export(e);
      return await c.saveMasterSeed(s), t(Xr(!0)), t(io(!0)), t(Yr(!0)), { mnemonic: i };
    } catch (o) {
      return console.error("Failed to create wallet:", o), t(Fe("Failed to create wallet")), n("Failed to create wallet");
    }
  }
), ux = (e, r = "password") => async (t) => {
  try {
    let n = null, o = null;
    const i = be.getStorage();
    if (r === "seed")
      await _e.getInstance().unlockWithSeed(e);
    else if (r === "jwk") {
      const h = JSON.parse(e);
      await _e.getInstance().unlockWithDerivedKey(h, i);
    } else if (r === "mnemonic")
      await _e.getInstance().unlockWithMnemonic(e);
    else {
      const h = await _e.getInstance().unlock(e, i);
      n = h.jwk, o = h.storageKey;
    }
    const c = _e.getInstance().getStorageKey(), [s, u, a] = await Promise.all([
      i.loadAccounts(c),
      i.loadHighestIndex(),
      i.loadActiveAccount()
    ]), l = s.reduce((h, d) => (d.tag && (h[d.tag] = d), h), {});
    return t(xi(l)), t(ao(u)), t(hi(a)), t(Yr(!1)), t(Xr(!0)), t(io(!0)), { jwk: n, storageKey: c };
  } catch (n) {
    throw t(Fe("Invalid password")), n;
  }
}, fx = (e) => async (r, t) => {
  try {
    const n = be.getStorage(), o = _e.getInstance(), i = o.getMasterSeed(), c = t(), s = c.wallet.highestAccountIndex + 1, u = i.deriveAccount(s), a = {
      name: e || "Account " + (s + 1),
      type: "standard",
      faddress: "0x" + Buffer.from(u.address).toString("hex").slice(0, 40),
      balance: "0",
      index: s,
      tag: u.tag,
      source: "mnemonic",
      wotsIndex: -1,
      //first wots address is created using account seed
      seed: Buffer.from(u.seed).toString("hex"),
      order: Object.keys(c.accounts.accounts).length
      // Use index as initial order
    }, l = o.getStorageKey();
    return await Promise.all([
      n.saveAccount(a, l),
      n.saveHighestIndex(s)
    ]), r(rx({ id: a.tag, account: a })), r(ao(s)), a;
  } catch (n) {
    throw r(Fe("Failed to create account")), n;
  }
}, dx = (e) => async (r, t) => {
  try {
    const n = t();
    if (!n.wallet.initialized || !n.wallet.hasWallet)
      throw new Error("Wallet not initialized");
    const o = _e.getInstance(), i = await o.getMasterSeed();
    if (!i)
      throw new Error("Wallet is locked");
    const c = o.getStorageKey(), s = await be.getStorage().loadAccounts(c), u = {};
    for (const a of s)
      u[a.tag] = await Q0(a, c);
    return console.log("encryptedAccounts", u), {
      version: "1.0.0",
      timestamp: Date.now(),
      encrypted: await i.export(e),
      accounts: u
    };
  } catch (n) {
    throw r(Fe("Failed to export wallet")), n;
  }
}, hx = (e, r) => async (t) => {
  try {
    const n = be.getStorage(), o = _e.getInstance(), i = e.encrypted;
    if (!i)
      throw new Error("Invalid wallet JSON");
    if (!await ve.import(i, r))
      throw new Error("Invalid password");
    await n.clear(), await n.saveMasterSeed(e.encrypted), await o.unlock(r, n);
    let s = -1;
    const u = o.getStorageKey(), l = (await Promise.all(
      Object.values(e.accounts).map(async (h) => await Nr(h, u))
    )).reduce((h, d) => (h[d.tag] = d, h), {});
    for (let h of Object.values(l))
      await n.saveAccount(h, u), h.index !== void 0 && h.index > s && (s = h.index);
    await n.saveHighestIndex(s), t(xi(l)), t(ao(s)), t(Xr(!0)), t(Yr(!1)), t(io(!0));
  } catch (n) {
    throw t(Fe("Failed to load wallet from JSON")), n;
  }
}, xx = () => async (e) => {
  try {
    await _e.getInstance().lock(), e(Yr(!0));
  } catch {
    e(Fe("Failed to lock wallet"));
  }
}, px = (e) => async (r, t) => {
  try {
    const n = be.getStorage(), i = t().accounts.accounts;
    e && i[e] && (r(hi(e)), await n.saveActiveAccount(e));
  } catch (n) {
    throw r(Fe("Failed to set active account")), n;
  }
}, gx = Zr(
  "wallet/importFromMcm",
  async ({ mcmData: e, password: r, accountFilter: t }, { dispatch: n }) => {
    try {
      n(Fe(null));
      const o = be.getStorage();
      await o.clear();
      const { entries: i, privateHeader: c } = e, s = c["deterministic seed hex"], u = new ve(Buffer.from(s, "hex")), a = await u.export(r);
      await o.saveMasterSeed(a), n(Xr(!0)), n(io(!0)), n(Yr(!1)), _e.getInstance().setMasterSeed(u);
      const h = await n(P0({
        mcmData: e,
        accountFilter: t,
        source: "mnemonic"
      })).unwrap();
      return {
        entries: i,
        totalEntries: i.length,
        importedCount: h.importedCount
      };
    } catch (o) {
      throw console.error("Import error:", o), n(Fe(o instanceof Error ? o.message : "Unknown error")), o;
    }
  }
), P0 = Zr(
  "wallet/importAccounts",
  async ({ mcmData: e, accountFilter: r, source: t }, { dispatch: n, getState: o }) => {
    try {
      n(Fe(null));
      const i = o();
      if (!i.wallet.hasWallet || i.wallet.locked)
        throw new Error("Wallet must be unlocked to import accounts");
      const { entries: c } = e;
      let s = c;
      if (r && (s = c.filter((f, x) => !!r(x, Buffer.from(f.secret, "hex"), f.name))), s.length === 0)
        throw new Error("No accounts matched the filter criteria");
      const u = be.getStorage(), l = _e.getInstance().getStorageKey(), h = i.wallet.highestAccountIndex, d = s.map((f, x) => {
        const v = new Uint8Array(Buffer.from(f.address, "hex").subarray(0, 2144)), w = Ut.addrFromWots(v), _ = Buffer.from(w == null ? void 0 : w.subarray(0, 20)).toString("hex");
        return {
          name: f.name || `Imported Account ${x + 1}`,
          type: t === "mnemonic" ? "standard" : "imported",
          faddress: "0x" + Buffer.from(f.address).toString("hex").slice(0, 40),
          balance: "0",
          index: t === "mnemonic" ? h + 1 + x : void 0,
          // Continue from current highest
          tag: _,
          source: t,
          wotsIndex: -1,
          seed: f.secret,
          order: Object.keys(i.accounts.accounts).length + x
          // Add to end
        };
      });
      for (let f of d)
        await u.saveAccount(f, l);
      return await u.saveHighestIndex(h + d.length), n(ao(h + d.length)), n(xi(
        d.reduce((f, x) => (f[x.tag] = x, f), {})
      )), {
        importedAccounts: d,
        totalAvailable: c.length,
        importedCount: d.length
      };
    } catch (i) {
      throw console.error("Import accounts error:", i), n(Fe(i instanceof Error ? i.message : "Unknown error")), i;
    }
  }
), yx = (e) => e.accounts.accounts, gi = (e) => {
  const r = e.accounts.selectedAccount;
  return r ? e.accounts.accounts[r] : null;
};
qt(
  yx,
  (e) => Object.values(e).filter((r) => !r.isDeleted).sort((r, t) => (r.order ?? 0) - (t.order ?? 0))
);
const Mc = qt(
  [gi],
  (e) => {
    if (!e) return null;
    let r;
    if (e.wotsIndex === -1)
      return r = Buffer.from(e.faddress, "hex").toString("hex").slice(0, 40), {
        address: "0x" + r,
        secret: e.seed,
        wotsWallet: Mt.create("test", Buffer.from(e.seed, "hex"), void 0, (i) => {
          const c = Buffer.from(e.faddress, "hex");
          for (let s = 0; s < c.length; s++)
            i[s] = c[s];
        })
      };
    const { address: t, secret: n, wotsWallet: o } = It.deriveWotsSeedAndAddress(
      Buffer.from(e.seed, "hex"),
      e.wotsIndex,
      e.tag
    );
    return r = Buffer.from(t).toString("hex").slice(0, 40), { address: "0x" + r, secret: Buffer.from(n).toString("hex"), wotsWallet: o };
  }
), Pc = qt(
  [gi],
  (e) => {
    if (!e) return null;
    if (!e.seed)
      throw new Error("Account has no seed");
    const { address: r, secret: t, wotsWallet: n } = It.deriveWotsSeedAndAddress(
      Buffer.from(e.seed, "hex"),
      e.wotsIndex + 1,
      // Next index
      e.tag
    );
    return {
      address: "0x" + Buffer.from(r).toString("hex").slice(0, 40),
      secret: Buffer.from(t).toString("hex"),
      wotsWallet: n
    };
  }
), wx = () => {
  const e = pc(), r = rr((f) => f.accounts.accounts), t = rr((f) => f.accounts.selectedAccount), n = rr(Mc), o = rr(Pc), i = ki(() => Object.values(r).filter((f) => !f.isDeleted).sort((f, x) => (f.order ?? 0) - (x.order ?? 0)), [r]), c = ki(() => Object.values(r).filter((f) => f.isDeleted), [r]), s = ce(async (f) => await e(fx(f)), [e]), u = ce(async (f, x) => await e(ax(f, x)), [e]), a = ce(async (f) => await e(sx(f)), [e]), l = ce(async (f) => await e(cx(f)), [e]), h = ce(async (f) => await e(px(f)), [e]), d = ce(async (f, x) => await e(pi(f, x)), [e]);
  return {
    accounts: i,
    deletedAccounts: c,
    selectedAccount: t,
    createAccount: s,
    renameAccount: u,
    deleteAccount: a,
    reorderAccounts: l,
    setSelectedAccount: h,
    updateAccount: d,
    currentWOTSKeyPair: n,
    nextWOTSKeyPair: o
  };
}, yi = () => pc(), or = rr, vx = (e = 1e4) => {
  const { accounts: r } = wx(), t = yi(), n = vo(), [o, i] = ct(0), [c, s] = ct({}), [u, a] = ct(0), l = vo(!1), h = vo(c);
  Ir(() => {
    h.current = c;
  }, [c]);
  const d = async (x) => {
    const v = h.current[x] || {}, w = await Promise.all(r.map(async (_) => {
      if (!(_ != null && _.tag) || v[_.tag])
        return null;
      try {
        const p = await Hr.getNetwork().getBalance("0x" + _.tag);
        if (!/^\d+$/.test(p))
          throw new Error("Invalid balance format received");
        return { tag: _.tag, balance: p };
      } catch (p) {
        return console.error(`Balance fetch error for account ${_.tag}:`, p), null;
      }
    }).filter(Boolean));
    w.length > 0 && s((_) => {
      const p = { ..._ };
      return p[x] = { ...v }, w.forEach((g) => {
        g && (p[x][g.tag] = g.balance, t(Uc({
          id: g.tag,
          updates: { balance: g.balance }
        })));
      }), p;
    });
  }, f = ce(async () => {
    if (!r.length || l.current) {
      n.current = setTimeout(f, e);
      return;
    }
    try {
      l.current = !0;
      const x = await Hr.getNetwork().getNetworkStatus();
      if (!(x != null && x.height) || typeof x.height != "number")
        throw new Error("Invalid network status response");
      const v = x.height;
      if (v < 0)
        throw new Error("Invalid block height received");
      t(Yh(v)), (v > o || r.some((_) => {
        var p;
        return !((p = h.current[v]) != null && p[_.tag]);
      })) && (await d(v), i(v)), a(0);
    } catch (x) {
      console.error("Balance polling error:", x), a((v) => v + 1);
    } finally {
      l.current = !1, n.current = setTimeout(f, e);
    }
  }, [r, e, o]);
  Ir(() => (f(), () => {
    n.current && (clearTimeout(n.current), n.current = void 0);
  }), [f]);
}, _x = ({ children: e }) => (vx(), /* @__PURE__ */ Mn.jsx(Mn.Fragment, { children: e })), B2 = ({ children: e }) => /* @__PURE__ */ Mn.jsx(Dd, { store: ix, children: /* @__PURE__ */ Mn.jsx(_x, { children: e }) }), wi = (e) => e.wallet, bx = qt(
  wi,
  (e) => ({
    isLocked: e.locked,
    hasWallet: e.hasWallet,
    isInitialized: e.initialized
  })
), mx = qt(
  wi,
  (e) => e.error
), Ex = qt(
  wi,
  (e) => e.network
), C2 = () => {
  const e = yi(), { isLocked: r, hasWallet: t, isInitialized: n } = or(bx), o = or(mx), i = or(Ex), c = ce(async (p, g) => e(lx({ password: p, mnemonic: g })), [e]), s = ce(async (p, g = "password") => e(ux(p, g)), [e]), u = ce(async (p) => {
    const g = await be.getStorage().loadMasterSeed();
    if (!g) return !1;
    try {
      return await ve.import(g, p), !0;
    } catch {
      return !1;
    }
  }, [e]), a = ce(async (p) => {
    const g = await be.getStorage().loadMasterSeed();
    if (!g) return !1;
    try {
      return (await ve.import(g, p)).toPhrase();
    } catch {
      throw new Error("Invalid password for mnemonic export");
    }
  }, [e]), l = ce(() => {
    if (!t)
      throw new Error("No wallet exists");
    e(xx());
  }, [e, t]), h = ce(async () => !!await be.getStorage().loadMasterSeed(), [e]), d = ce(async (p, g, y) => e(gx({ mcmData: p, password: g, accountFilter: y })), [e]), f = ce(async (p, g) => e(P0({ mcmData: p, accountFilter: g, source: "mcm" })), [e]), x = ce(async (p, g, y) => e(P0({ mcmData: g, accountFilter: y, source: p })), [e]), v = ce((p) => {
    e(Xr(p));
  }, [e]), w = ce(async (p) => e(dx(p)), [e]), _ = ce(async (p, g) => e(hx(p, g)), [e]);
  return {
    isLocked: r,
    hasWallet: t,
    isInitialized: n,
    error: o,
    network: i,
    createWallet: c,
    unlockWallet: s,
    lockWallet: l,
    checkWallet: h,
    importFromMcmFile: d,
    importAccountsFromMcm: f,
    setHasWalletStatus: v,
    importWalletJSON: _,
    exportWalletJSON: w,
    verifyWalletOwnership: u,
    getMnemonic: a,
    importAccountsFrom: x
  };
}, k2 = () => {
  const e = rr((r) => r.network);
  return {
    blockHeight: e.blockHeight,
    isConnected: e.isConnected,
    error: e.error
  };
}, Ax = Zr(
  "transaction/send",
  async (e, { getState: r, dispatch: t }) => {
    var s;
    const n = r(), o = gi(n), i = Mc(n), c = Pc(n);
    if (!o || !i || !c)
      throw new Error("No account selected");
    t(Wa(!0)), t(ja(null));
    try {
      const u = await Hr.getNetwork().resolveTag(o.tag), a = BigInt(u.balanceConsensus);
      if (e.memo && !dd(e.memo))
        throw new Error("Invalid memo");
      const { amount: l } = e, h = await Bx(
        i.wotsWallet,
        c.wotsWallet,
        Buffer.from(e.to, "hex"),
        l,
        a,
        { memo: e.memo }
      );
      if ((s = h == null ? void 0 : h.tx) != null && s.hash)
        return t(Qh(h.tx.hash)), h.tx.hash;
      throw new Error("Failed to create transaction");
    } catch (u) {
      console.error("Transaction error:", u);
      const a = u instanceof Error ? u.message : "Unknown error";
      throw t(ja(a)), new Error(a);
    } finally {
      t(Wa(!1));
    }
  }
);
async function Bx(e, r, t, n, o = BigInt(0), i = {}) {
  var a;
  if (!e || !t || !r)
    throw new Error("No current or next WOTS key pair");
  const c = i.fee || BigInt(500);
  return { tx: (a = (await new fd(Hr.getNetwork().apiUrl).buildAndSignTransaction(
    e,
    r,
    "0x" + Buffer.from(t).toString("hex"),
    n,
    c,
    i.memo || ""
  )).submitResult) == null ? void 0 : a.transaction_identifier };
}
const S2 = () => {
  const e = yi(), r = or((c) => c.transaction.isLoading), t = or((c) => c.transaction.error), n = or((c) => c.transaction.pendingTransactions), o = ce(async (c, s, u) => e(Ax({ to: c, amount: s, memo: u })).unwrap(), [e]), i = ce((c) => {
    e(ex(c));
  }, [e]);
  return {
    isLoading: r,
    error: t,
    pendingTransactions: n,
    sendTransaction: o,
    removePending: i
  };
}, D2 = () => {
  const [e, r] = ct(!1);
  return Ir(() => {
    (async () => {
      const n = await be.getStorage().loadMasterSeed();
      r(!!n);
    })();
  }, []), {
    hasWallet: e
  };
};
/*! pako 2.1.0 https://github.com/nodeca/pako @license (MIT AND Zlib) */
const Cx = 4, Ka = 0, Va = 1, kx = 2;
function fr(e) {
  let r = e.length;
  for (; --r >= 0; )
    e[r] = 0;
}
const Sx = 0, Wc = 1, Dx = 2, Fx = 3, Tx = 258, vi = 29, Jr = 256, Mr = Jr + 1 + vi, ir = 30, _i = 19, jc = 2 * Mr + 1, Nt = 15, x0 = 16, Rx = 7, bi = 256, $c = 16, Kc = 17, Vc = 18, W0 = (
  /* extra bits for each length code */
  new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0])
), Fn = (
  /* extra bits for each distance code */
  new Uint8Array([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13])
), Ox = (
  /* extra bits for each bit length code */
  new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7])
), qc = new Uint8Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]), Ix = 512, at = new Array((Mr + 2) * 2);
fr(at);
const Tr = new Array(ir * 2);
fr(Tr);
const Pr = new Array(Ix);
fr(Pr);
const Wr = new Array(Tx - Fx + 1);
fr(Wr);
const mi = new Array(vi);
fr(mi);
const Kn = new Array(ir);
fr(Kn);
function p0(e, r, t, n, o) {
  this.static_tree = e, this.extra_bits = r, this.extra_base = t, this.elems = n, this.max_length = o, this.has_stree = e && e.length;
}
let Gc, Zc, Yc;
function g0(e, r) {
  this.dyn_tree = e, this.max_code = 0, this.stat_desc = r;
}
const Xc = (e) => e < 256 ? Pr[e] : Pr[256 + (e >>> 7)], jr = (e, r) => {
  e.pending_buf[e.pending++] = r & 255, e.pending_buf[e.pending++] = r >>> 8 & 255;
}, De = (e, r, t) => {
  e.bi_valid > x0 - t ? (e.bi_buf |= r << e.bi_valid & 65535, jr(e, e.bi_buf), e.bi_buf = r >> x0 - e.bi_valid, e.bi_valid += t - x0) : (e.bi_buf |= r << e.bi_valid & 65535, e.bi_valid += t);
}, Je = (e, r, t) => {
  De(
    e,
    t[r * 2],
    t[r * 2 + 1]
    /*.Len*/
  );
}, Jc = (e, r) => {
  let t = 0;
  do
    t |= e & 1, e >>>= 1, t <<= 1;
  while (--r > 0);
  return t >>> 1;
}, Nx = (e) => {
  e.bi_valid === 16 ? (jr(e, e.bi_buf), e.bi_buf = 0, e.bi_valid = 0) : e.bi_valid >= 8 && (e.pending_buf[e.pending++] = e.bi_buf & 255, e.bi_buf >>= 8, e.bi_valid -= 8);
}, Hx = (e, r) => {
  const t = r.dyn_tree, n = r.max_code, o = r.stat_desc.static_tree, i = r.stat_desc.has_stree, c = r.stat_desc.extra_bits, s = r.stat_desc.extra_base, u = r.stat_desc.max_length;
  let a, l, h, d, f, x, v = 0;
  for (d = 0; d <= Nt; d++)
    e.bl_count[d] = 0;
  for (t[e.heap[e.heap_max] * 2 + 1] = 0, a = e.heap_max + 1; a < jc; a++)
    l = e.heap[a], d = t[t[l * 2 + 1] * 2 + 1] + 1, d > u && (d = u, v++), t[l * 2 + 1] = d, !(l > n) && (e.bl_count[d]++, f = 0, l >= s && (f = c[l - s]), x = t[l * 2], e.opt_len += x * (d + f), i && (e.static_len += x * (o[l * 2 + 1] + f)));
  if (v !== 0) {
    do {
      for (d = u - 1; e.bl_count[d] === 0; )
        d--;
      e.bl_count[d]--, e.bl_count[d + 1] += 2, e.bl_count[u]--, v -= 2;
    } while (v > 0);
    for (d = u; d !== 0; d--)
      for (l = e.bl_count[d]; l !== 0; )
        h = e.heap[--a], !(h > n) && (t[h * 2 + 1] !== d && (e.opt_len += (d - t[h * 2 + 1]) * t[h * 2], t[h * 2 + 1] = d), l--);
  }
}, Qc = (e, r, t) => {
  const n = new Array(Nt + 1);
  let o = 0, i, c;
  for (i = 1; i <= Nt; i++)
    o = o + t[i - 1] << 1, n[i] = o;
  for (c = 0; c <= r; c++) {
    let s = e[c * 2 + 1];
    s !== 0 && (e[c * 2] = Jc(n[s]++, s));
  }
}, zx = () => {
  let e, r, t, n, o;
  const i = new Array(Nt + 1);
  for (t = 0, n = 0; n < vi - 1; n++)
    for (mi[n] = t, e = 0; e < 1 << W0[n]; e++)
      Wr[t++] = n;
  for (Wr[t - 1] = n, o = 0, n = 0; n < 16; n++)
    for (Kn[n] = o, e = 0; e < 1 << Fn[n]; e++)
      Pr[o++] = n;
  for (o >>= 7; n < ir; n++)
    for (Kn[n] = o << 7, e = 0; e < 1 << Fn[n] - 7; e++)
      Pr[256 + o++] = n;
  for (r = 0; r <= Nt; r++)
    i[r] = 0;
  for (e = 0; e <= 143; )
    at[e * 2 + 1] = 8, e++, i[8]++;
  for (; e <= 255; )
    at[e * 2 + 1] = 9, e++, i[9]++;
  for (; e <= 279; )
    at[e * 2 + 1] = 7, e++, i[7]++;
  for (; e <= 287; )
    at[e * 2 + 1] = 8, e++, i[8]++;
  for (Qc(at, Mr + 1, i), e = 0; e < ir; e++)
    Tr[e * 2 + 1] = 5, Tr[e * 2] = Jc(e, 5);
  Gc = new p0(at, W0, Jr + 1, Mr, Nt), Zc = new p0(Tr, Fn, 0, ir, Nt), Yc = new p0(new Array(0), Ox, 0, _i, Rx);
}, el = (e) => {
  let r;
  for (r = 0; r < Mr; r++)
    e.dyn_ltree[r * 2] = 0;
  for (r = 0; r < ir; r++)
    e.dyn_dtree[r * 2] = 0;
  for (r = 0; r < _i; r++)
    e.bl_tree[r * 2] = 0;
  e.dyn_ltree[bi * 2] = 1, e.opt_len = e.static_len = 0, e.sym_next = e.matches = 0;
}, tl = (e) => {
  e.bi_valid > 8 ? jr(e, e.bi_buf) : e.bi_valid > 0 && (e.pending_buf[e.pending++] = e.bi_buf), e.bi_buf = 0, e.bi_valid = 0;
}, qa = (e, r, t, n) => {
  const o = r * 2, i = t * 2;
  return e[o] < e[i] || e[o] === e[i] && n[r] <= n[t];
}, y0 = (e, r, t) => {
  const n = e.heap[t];
  let o = t << 1;
  for (; o <= e.heap_len && (o < e.heap_len && qa(r, e.heap[o + 1], e.heap[o], e.depth) && o++, !qa(r, n, e.heap[o], e.depth)); )
    e.heap[t] = e.heap[o], t = o, o <<= 1;
  e.heap[t] = n;
}, Ga = (e, r, t) => {
  let n, o, i = 0, c, s;
  if (e.sym_next !== 0)
    do
      n = e.pending_buf[e.sym_buf + i++] & 255, n += (e.pending_buf[e.sym_buf + i++] & 255) << 8, o = e.pending_buf[e.sym_buf + i++], n === 0 ? Je(e, o, r) : (c = Wr[o], Je(e, c + Jr + 1, r), s = W0[c], s !== 0 && (o -= mi[c], De(e, o, s)), n--, c = Xc(n), Je(e, c, t), s = Fn[c], s !== 0 && (n -= Kn[c], De(e, n, s)));
    while (i < e.sym_next);
  Je(e, bi, r);
}, j0 = (e, r) => {
  const t = r.dyn_tree, n = r.stat_desc.static_tree, o = r.stat_desc.has_stree, i = r.stat_desc.elems;
  let c, s, u = -1, a;
  for (e.heap_len = 0, e.heap_max = jc, c = 0; c < i; c++)
    t[c * 2] !== 0 ? (e.heap[++e.heap_len] = u = c, e.depth[c] = 0) : t[c * 2 + 1] = 0;
  for (; e.heap_len < 2; )
    a = e.heap[++e.heap_len] = u < 2 ? ++u : 0, t[a * 2] = 1, e.depth[a] = 0, e.opt_len--, o && (e.static_len -= n[a * 2 + 1]);
  for (r.max_code = u, c = e.heap_len >> 1; c >= 1; c--)
    y0(e, t, c);
  a = i;
  do
    c = e.heap[
      1
      /*SMALLEST*/
    ], e.heap[
      1
      /*SMALLEST*/
    ] = e.heap[e.heap_len--], y0(
      e,
      t,
      1
      /*SMALLEST*/
    ), s = e.heap[
      1
      /*SMALLEST*/
    ], e.heap[--e.heap_max] = c, e.heap[--e.heap_max] = s, t[a * 2] = t[c * 2] + t[s * 2], e.depth[a] = (e.depth[c] >= e.depth[s] ? e.depth[c] : e.depth[s]) + 1, t[c * 2 + 1] = t[s * 2 + 1] = a, e.heap[
      1
      /*SMALLEST*/
    ] = a++, y0(
      e,
      t,
      1
      /*SMALLEST*/
    );
  while (e.heap_len >= 2);
  e.heap[--e.heap_max] = e.heap[
    1
    /*SMALLEST*/
  ], Hx(e, r), Qc(t, u, e.bl_count);
}, Za = (e, r, t) => {
  let n, o = -1, i, c = r[0 * 2 + 1], s = 0, u = 7, a = 4;
  for (c === 0 && (u = 138, a = 3), r[(t + 1) * 2 + 1] = 65535, n = 0; n <= t; n++)
    i = c, c = r[(n + 1) * 2 + 1], !(++s < u && i === c) && (s < a ? e.bl_tree[i * 2] += s : i !== 0 ? (i !== o && e.bl_tree[i * 2]++, e.bl_tree[$c * 2]++) : s <= 10 ? e.bl_tree[Kc * 2]++ : e.bl_tree[Vc * 2]++, s = 0, o = i, c === 0 ? (u = 138, a = 3) : i === c ? (u = 6, a = 3) : (u = 7, a = 4));
}, Ya = (e, r, t) => {
  let n, o = -1, i, c = r[0 * 2 + 1], s = 0, u = 7, a = 4;
  for (c === 0 && (u = 138, a = 3), n = 0; n <= t; n++)
    if (i = c, c = r[(n + 1) * 2 + 1], !(++s < u && i === c)) {
      if (s < a)
        do
          Je(e, i, e.bl_tree);
        while (--s !== 0);
      else i !== 0 ? (i !== o && (Je(e, i, e.bl_tree), s--), Je(e, $c, e.bl_tree), De(e, s - 3, 2)) : s <= 10 ? (Je(e, Kc, e.bl_tree), De(e, s - 3, 3)) : (Je(e, Vc, e.bl_tree), De(e, s - 11, 7));
      s = 0, o = i, c === 0 ? (u = 138, a = 3) : i === c ? (u = 6, a = 3) : (u = 7, a = 4);
    }
}, Lx = (e) => {
  let r;
  for (Za(e, e.dyn_ltree, e.l_desc.max_code), Za(e, e.dyn_dtree, e.d_desc.max_code), j0(e, e.bl_desc), r = _i - 1; r >= 3 && e.bl_tree[qc[r] * 2 + 1] === 0; r--)
    ;
  return e.opt_len += 3 * (r + 1) + 5 + 5 + 4, r;
}, Ux = (e, r, t, n) => {
  let o;
  for (De(e, r - 257, 5), De(e, t - 1, 5), De(e, n - 4, 4), o = 0; o < n; o++)
    De(e, e.bl_tree[qc[o] * 2 + 1], 3);
  Ya(e, e.dyn_ltree, r - 1), Ya(e, e.dyn_dtree, t - 1);
}, Mx = (e) => {
  let r = 4093624447, t;
  for (t = 0; t <= 31; t++, r >>>= 1)
    if (r & 1 && e.dyn_ltree[t * 2] !== 0)
      return Ka;
  if (e.dyn_ltree[9 * 2] !== 0 || e.dyn_ltree[10 * 2] !== 0 || e.dyn_ltree[13 * 2] !== 0)
    return Va;
  for (t = 32; t < Jr; t++)
    if (e.dyn_ltree[t * 2] !== 0)
      return Va;
  return Ka;
};
let Xa = !1;
const Px = (e) => {
  Xa || (zx(), Xa = !0), e.l_desc = new g0(e.dyn_ltree, Gc), e.d_desc = new g0(e.dyn_dtree, Zc), e.bl_desc = new g0(e.bl_tree, Yc), e.bi_buf = 0, e.bi_valid = 0, el(e);
}, rl = (e, r, t, n) => {
  De(e, (Sx << 1) + (n ? 1 : 0), 3), tl(e), jr(e, t), jr(e, ~t), t && e.pending_buf.set(e.window.subarray(r, r + t), e.pending), e.pending += t;
}, Wx = (e) => {
  De(e, Wc << 1, 3), Je(e, bi, at), Nx(e);
}, jx = (e, r, t, n) => {
  let o, i, c = 0;
  e.level > 0 ? (e.strm.data_type === kx && (e.strm.data_type = Mx(e)), j0(e, e.l_desc), j0(e, e.d_desc), c = Lx(e), o = e.opt_len + 3 + 7 >>> 3, i = e.static_len + 3 + 7 >>> 3, i <= o && (o = i)) : o = i = t + 5, t + 4 <= o && r !== -1 ? rl(e, r, t, n) : e.strategy === Cx || i === o ? (De(e, (Wc << 1) + (n ? 1 : 0), 3), Ga(e, at, Tr)) : (De(e, (Dx << 1) + (n ? 1 : 0), 3), Ux(e, e.l_desc.max_code + 1, e.d_desc.max_code + 1, c + 1), Ga(e, e.dyn_ltree, e.dyn_dtree)), el(e), n && tl(e);
}, $x = (e, r, t) => (e.pending_buf[e.sym_buf + e.sym_next++] = r, e.pending_buf[e.sym_buf + e.sym_next++] = r >> 8, e.pending_buf[e.sym_buf + e.sym_next++] = t, r === 0 ? e.dyn_ltree[t * 2]++ : (e.matches++, r--, e.dyn_ltree[(Wr[t] + Jr + 1) * 2]++, e.dyn_dtree[Xc(r) * 2]++), e.sym_next === e.sym_end);
var Kx = Px, Vx = rl, qx = jx, Gx = $x, Zx = Wx, Yx = {
  _tr_init: Kx,
  _tr_stored_block: Vx,
  _tr_flush_block: qx,
  _tr_tally: Gx,
  _tr_align: Zx
};
const Xx = (e, r, t, n) => {
  let o = e & 65535 | 0, i = e >>> 16 & 65535 | 0, c = 0;
  for (; t !== 0; ) {
    c = t > 2e3 ? 2e3 : t, t -= c;
    do
      o = o + r[n++] | 0, i = i + o | 0;
    while (--c);
    o %= 65521, i %= 65521;
  }
  return o | i << 16 | 0;
};
var $r = Xx;
const Jx = () => {
  let e, r = [];
  for (var t = 0; t < 256; t++) {
    e = t;
    for (var n = 0; n < 8; n++)
      e = e & 1 ? 3988292384 ^ e >>> 1 : e >>> 1;
    r[t] = e;
  }
  return r;
}, Qx = new Uint32Array(Jx()), e1 = (e, r, t, n) => {
  const o = Qx, i = n + t;
  e ^= -1;
  for (let c = n; c < i; c++)
    e = e >>> 8 ^ o[(e ^ r[c]) & 255];
  return e ^ -1;
};
var he = e1, sr = {
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
}, Qr = {
  /* Allowed flush values; see deflate() and inflate() below for details */
  Z_NO_FLUSH: 0,
  Z_PARTIAL_FLUSH: 1,
  Z_SYNC_FLUSH: 2,
  Z_FULL_FLUSH: 3,
  Z_FINISH: 4,
  Z_BLOCK: 5,
  Z_TREES: 6,
  /* Return codes for the compression/decompression functions. Negative values
  * are errors, positive values are used for special but normal events.
  */
  Z_OK: 0,
  Z_STREAM_END: 1,
  Z_NEED_DICT: 2,
  Z_ERRNO: -1,
  Z_STREAM_ERROR: -2,
  Z_DATA_ERROR: -3,
  Z_MEM_ERROR: -4,
  Z_BUF_ERROR: -5,
  //Z_VERSION_ERROR: -6,
  /* compression levels */
  Z_NO_COMPRESSION: 0,
  Z_BEST_SPEED: 1,
  Z_BEST_COMPRESSION: 9,
  Z_DEFAULT_COMPRESSION: -1,
  Z_FILTERED: 1,
  Z_HUFFMAN_ONLY: 2,
  Z_RLE: 3,
  Z_FIXED: 4,
  Z_DEFAULT_STRATEGY: 0,
  /* Possible values of the data_type field (though see inflate()) */
  Z_BINARY: 0,
  Z_TEXT: 1,
  //Z_ASCII:                1, // = Z_TEXT (deprecated)
  Z_UNKNOWN: 2,
  /* The deflate compression method */
  Z_DEFLATED: 8
  //Z_NULL:                 null // Use -1 or null inline, depending on var type
};
const { _tr_init: t1, _tr_stored_block: $0, _tr_flush_block: r1, _tr_tally: At, _tr_align: n1 } = Yx, {
  Z_NO_FLUSH: Bt,
  Z_PARTIAL_FLUSH: o1,
  Z_FULL_FLUSH: i1,
  Z_FINISH: Me,
  Z_BLOCK: Ja,
  Z_OK: ge,
  Z_STREAM_END: Qa,
  Z_STREAM_ERROR: Qe,
  Z_DATA_ERROR: a1,
  Z_BUF_ERROR: w0,
  Z_DEFAULT_COMPRESSION: s1,
  Z_FILTERED: c1,
  Z_HUFFMAN_ONLY: En,
  Z_RLE: l1,
  Z_FIXED: u1,
  Z_DEFAULT_STRATEGY: f1,
  Z_UNKNOWN: d1,
  Z_DEFLATED: so
} = Qr, h1 = 9, x1 = 15, p1 = 8, g1 = 29, y1 = 256, K0 = y1 + 1 + g1, w1 = 30, v1 = 19, _1 = 2 * K0 + 1, b1 = 15, Z = 3, Et = 258, et = Et + Z + 1, m1 = 32, cr = 42, Ei = 57, V0 = 69, q0 = 73, G0 = 91, Z0 = 103, Ht = 113, kr = 666, Ae = 1, dr = 2, jt = 3, hr = 4, E1 = 3, zt = (e, r) => (e.msg = sr[r], r), es = (e) => e * 2 - (e > 4 ? 9 : 0), mt = (e) => {
  let r = e.length;
  for (; --r >= 0; )
    e[r] = 0;
}, A1 = (e) => {
  let r, t, n, o = e.w_size;
  r = e.hash_size, n = r;
  do
    t = e.head[--n], e.head[n] = t >= o ? t - o : 0;
  while (--r);
  r = o, n = r;
  do
    t = e.prev[--n], e.prev[n] = t >= o ? t - o : 0;
  while (--r);
};
let B1 = (e, r, t) => (r << e.hash_shift ^ t) & e.hash_mask, Ct = B1;
const Oe = (e) => {
  const r = e.state;
  let t = r.pending;
  t > e.avail_out && (t = e.avail_out), t !== 0 && (e.output.set(r.pending_buf.subarray(r.pending_out, r.pending_out + t), e.next_out), e.next_out += t, r.pending_out += t, e.total_out += t, e.avail_out -= t, r.pending -= t, r.pending === 0 && (r.pending_out = 0));
}, Ne = (e, r) => {
  r1(e, e.block_start >= 0 ? e.block_start : -1, e.strstart - e.block_start, r), e.block_start = e.strstart, Oe(e.strm);
}, ee = (e, r) => {
  e.pending_buf[e.pending++] = r;
}, Er = (e, r) => {
  e.pending_buf[e.pending++] = r >>> 8 & 255, e.pending_buf[e.pending++] = r & 255;
}, Y0 = (e, r, t, n) => {
  let o = e.avail_in;
  return o > n && (o = n), o === 0 ? 0 : (e.avail_in -= o, r.set(e.input.subarray(e.next_in, e.next_in + o), t), e.state.wrap === 1 ? e.adler = $r(e.adler, r, o, t) : e.state.wrap === 2 && (e.adler = he(e.adler, r, o, t)), e.next_in += o, e.total_in += o, o);
}, nl = (e, r) => {
  let t = e.max_chain_length, n = e.strstart, o, i, c = e.prev_length, s = e.nice_match;
  const u = e.strstart > e.w_size - et ? e.strstart - (e.w_size - et) : 0, a = e.window, l = e.w_mask, h = e.prev, d = e.strstart + Et;
  let f = a[n + c - 1], x = a[n + c];
  e.prev_length >= e.good_match && (t >>= 2), s > e.lookahead && (s = e.lookahead);
  do
    if (o = r, !(a[o + c] !== x || a[o + c - 1] !== f || a[o] !== a[n] || a[++o] !== a[n + 1])) {
      n += 2, o++;
      do
        ;
      while (a[++n] === a[++o] && a[++n] === a[++o] && a[++n] === a[++o] && a[++n] === a[++o] && a[++n] === a[++o] && a[++n] === a[++o] && a[++n] === a[++o] && a[++n] === a[++o] && n < d);
      if (i = Et - (d - n), n = d - Et, i > c) {
        if (e.match_start = r, c = i, i >= s)
          break;
        f = a[n + c - 1], x = a[n + c];
      }
    }
  while ((r = h[r & l]) > u && --t !== 0);
  return c <= e.lookahead ? c : e.lookahead;
}, lr = (e) => {
  const r = e.w_size;
  let t, n, o;
  do {
    if (n = e.window_size - e.lookahead - e.strstart, e.strstart >= r + (r - et) && (e.window.set(e.window.subarray(r, r + r - n), 0), e.match_start -= r, e.strstart -= r, e.block_start -= r, e.insert > e.strstart && (e.insert = e.strstart), A1(e), n += r), e.strm.avail_in === 0)
      break;
    if (t = Y0(e.strm, e.window, e.strstart + e.lookahead, n), e.lookahead += t, e.lookahead + e.insert >= Z)
      for (o = e.strstart - e.insert, e.ins_h = e.window[o], e.ins_h = Ct(e, e.ins_h, e.window[o + 1]); e.insert && (e.ins_h = Ct(e, e.ins_h, e.window[o + Z - 1]), e.prev[o & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = o, o++, e.insert--, !(e.lookahead + e.insert < Z)); )
        ;
  } while (e.lookahead < et && e.strm.avail_in !== 0);
}, ol = (e, r) => {
  let t = e.pending_buf_size - 5 > e.w_size ? e.w_size : e.pending_buf_size - 5, n, o, i, c = 0, s = e.strm.avail_in;
  do {
    if (n = 65535, i = e.bi_valid + 42 >> 3, e.strm.avail_out < i || (i = e.strm.avail_out - i, o = e.strstart - e.block_start, n > o + e.strm.avail_in && (n = o + e.strm.avail_in), n > i && (n = i), n < t && (n === 0 && r !== Me || r === Bt || n !== o + e.strm.avail_in)))
      break;
    c = r === Me && n === o + e.strm.avail_in ? 1 : 0, $0(e, 0, 0, c), e.pending_buf[e.pending - 4] = n, e.pending_buf[e.pending - 3] = n >> 8, e.pending_buf[e.pending - 2] = ~n, e.pending_buf[e.pending - 1] = ~n >> 8, Oe(e.strm), o && (o > n && (o = n), e.strm.output.set(e.window.subarray(e.block_start, e.block_start + o), e.strm.next_out), e.strm.next_out += o, e.strm.avail_out -= o, e.strm.total_out += o, e.block_start += o, n -= o), n && (Y0(e.strm, e.strm.output, e.strm.next_out, n), e.strm.next_out += n, e.strm.avail_out -= n, e.strm.total_out += n);
  } while (c === 0);
  return s -= e.strm.avail_in, s && (s >= e.w_size ? (e.matches = 2, e.window.set(e.strm.input.subarray(e.strm.next_in - e.w_size, e.strm.next_in), 0), e.strstart = e.w_size, e.insert = e.strstart) : (e.window_size - e.strstart <= s && (e.strstart -= e.w_size, e.window.set(e.window.subarray(e.w_size, e.w_size + e.strstart), 0), e.matches < 2 && e.matches++, e.insert > e.strstart && (e.insert = e.strstart)), e.window.set(e.strm.input.subarray(e.strm.next_in - s, e.strm.next_in), e.strstart), e.strstart += s, e.insert += s > e.w_size - e.insert ? e.w_size - e.insert : s), e.block_start = e.strstart), e.high_water < e.strstart && (e.high_water = e.strstart), c ? hr : r !== Bt && r !== Me && e.strm.avail_in === 0 && e.strstart === e.block_start ? dr : (i = e.window_size - e.strstart, e.strm.avail_in > i && e.block_start >= e.w_size && (e.block_start -= e.w_size, e.strstart -= e.w_size, e.window.set(e.window.subarray(e.w_size, e.w_size + e.strstart), 0), e.matches < 2 && e.matches++, i += e.w_size, e.insert > e.strstart && (e.insert = e.strstart)), i > e.strm.avail_in && (i = e.strm.avail_in), i && (Y0(e.strm, e.window, e.strstart, i), e.strstart += i, e.insert += i > e.w_size - e.insert ? e.w_size - e.insert : i), e.high_water < e.strstart && (e.high_water = e.strstart), i = e.bi_valid + 42 >> 3, i = e.pending_buf_size - i > 65535 ? 65535 : e.pending_buf_size - i, t = i > e.w_size ? e.w_size : i, o = e.strstart - e.block_start, (o >= t || (o || r === Me) && r !== Bt && e.strm.avail_in === 0 && o <= i) && (n = o > i ? i : o, c = r === Me && e.strm.avail_in === 0 && n === o ? 1 : 0, $0(e, e.block_start, n, c), e.block_start += n, Oe(e.strm)), c ? jt : Ae);
}, v0 = (e, r) => {
  let t, n;
  for (; ; ) {
    if (e.lookahead < et) {
      if (lr(e), e.lookahead < et && r === Bt)
        return Ae;
      if (e.lookahead === 0)
        break;
    }
    if (t = 0, e.lookahead >= Z && (e.ins_h = Ct(e, e.ins_h, e.window[e.strstart + Z - 1]), t = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart), t !== 0 && e.strstart - t <= e.w_size - et && (e.match_length = nl(e, t)), e.match_length >= Z)
      if (n = At(e, e.strstart - e.match_start, e.match_length - Z), e.lookahead -= e.match_length, e.match_length <= e.max_lazy_match && e.lookahead >= Z) {
        e.match_length--;
        do
          e.strstart++, e.ins_h = Ct(e, e.ins_h, e.window[e.strstart + Z - 1]), t = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart;
        while (--e.match_length !== 0);
        e.strstart++;
      } else
        e.strstart += e.match_length, e.match_length = 0, e.ins_h = e.window[e.strstart], e.ins_h = Ct(e, e.ins_h, e.window[e.strstart + 1]);
    else
      n = At(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++;
    if (n && (Ne(e, !1), e.strm.avail_out === 0))
      return Ae;
  }
  return e.insert = e.strstart < Z - 1 ? e.strstart : Z - 1, r === Me ? (Ne(e, !0), e.strm.avail_out === 0 ? jt : hr) : e.sym_next && (Ne(e, !1), e.strm.avail_out === 0) ? Ae : dr;
}, er = (e, r) => {
  let t, n, o;
  for (; ; ) {
    if (e.lookahead < et) {
      if (lr(e), e.lookahead < et && r === Bt)
        return Ae;
      if (e.lookahead === 0)
        break;
    }
    if (t = 0, e.lookahead >= Z && (e.ins_h = Ct(e, e.ins_h, e.window[e.strstart + Z - 1]), t = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart), e.prev_length = e.match_length, e.prev_match = e.match_start, e.match_length = Z - 1, t !== 0 && e.prev_length < e.max_lazy_match && e.strstart - t <= e.w_size - et && (e.match_length = nl(e, t), e.match_length <= 5 && (e.strategy === c1 || e.match_length === Z && e.strstart - e.match_start > 4096) && (e.match_length = Z - 1)), e.prev_length >= Z && e.match_length <= e.prev_length) {
      o = e.strstart + e.lookahead - Z, n = At(e, e.strstart - 1 - e.prev_match, e.prev_length - Z), e.lookahead -= e.prev_length - 1, e.prev_length -= 2;
      do
        ++e.strstart <= o && (e.ins_h = Ct(e, e.ins_h, e.window[e.strstart + Z - 1]), t = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart);
      while (--e.prev_length !== 0);
      if (e.match_available = 0, e.match_length = Z - 1, e.strstart++, n && (Ne(e, !1), e.strm.avail_out === 0))
        return Ae;
    } else if (e.match_available) {
      if (n = At(e, 0, e.window[e.strstart - 1]), n && Ne(e, !1), e.strstart++, e.lookahead--, e.strm.avail_out === 0)
        return Ae;
    } else
      e.match_available = 1, e.strstart++, e.lookahead--;
  }
  return e.match_available && (n = At(e, 0, e.window[e.strstart - 1]), e.match_available = 0), e.insert = e.strstart < Z - 1 ? e.strstart : Z - 1, r === Me ? (Ne(e, !0), e.strm.avail_out === 0 ? jt : hr) : e.sym_next && (Ne(e, !1), e.strm.avail_out === 0) ? Ae : dr;
}, C1 = (e, r) => {
  let t, n, o, i;
  const c = e.window;
  for (; ; ) {
    if (e.lookahead <= Et) {
      if (lr(e), e.lookahead <= Et && r === Bt)
        return Ae;
      if (e.lookahead === 0)
        break;
    }
    if (e.match_length = 0, e.lookahead >= Z && e.strstart > 0 && (o = e.strstart - 1, n = c[o], n === c[++o] && n === c[++o] && n === c[++o])) {
      i = e.strstart + Et;
      do
        ;
      while (n === c[++o] && n === c[++o] && n === c[++o] && n === c[++o] && n === c[++o] && n === c[++o] && n === c[++o] && n === c[++o] && o < i);
      e.match_length = Et - (i - o), e.match_length > e.lookahead && (e.match_length = e.lookahead);
    }
    if (e.match_length >= Z ? (t = At(e, 1, e.match_length - Z), e.lookahead -= e.match_length, e.strstart += e.match_length, e.match_length = 0) : (t = At(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++), t && (Ne(e, !1), e.strm.avail_out === 0))
      return Ae;
  }
  return e.insert = 0, r === Me ? (Ne(e, !0), e.strm.avail_out === 0 ? jt : hr) : e.sym_next && (Ne(e, !1), e.strm.avail_out === 0) ? Ae : dr;
}, k1 = (e, r) => {
  let t;
  for (; ; ) {
    if (e.lookahead === 0 && (lr(e), e.lookahead === 0)) {
      if (r === Bt)
        return Ae;
      break;
    }
    if (e.match_length = 0, t = At(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++, t && (Ne(e, !1), e.strm.avail_out === 0))
      return Ae;
  }
  return e.insert = 0, r === Me ? (Ne(e, !0), e.strm.avail_out === 0 ? jt : hr) : e.sym_next && (Ne(e, !1), e.strm.avail_out === 0) ? Ae : dr;
};
function Ze(e, r, t, n, o) {
  this.good_length = e, this.max_lazy = r, this.nice_length = t, this.max_chain = n, this.func = o;
}
const Sr = [
  /*      good lazy nice chain */
  new Ze(0, 0, 0, 0, ol),
  /* 0 store only */
  new Ze(4, 4, 8, 4, v0),
  /* 1 max speed, no lazy matches */
  new Ze(4, 5, 16, 8, v0),
  /* 2 */
  new Ze(4, 6, 32, 32, v0),
  /* 3 */
  new Ze(4, 4, 16, 16, er),
  /* 4 lazy matches */
  new Ze(8, 16, 32, 32, er),
  /* 5 */
  new Ze(8, 16, 128, 128, er),
  /* 6 */
  new Ze(8, 32, 128, 256, er),
  /* 7 */
  new Ze(32, 128, 258, 1024, er),
  /* 8 */
  new Ze(32, 258, 258, 4096, er)
  /* 9 max compression */
], S1 = (e) => {
  e.window_size = 2 * e.w_size, mt(e.head), e.max_lazy_match = Sr[e.level].max_lazy, e.good_match = Sr[e.level].good_length, e.nice_match = Sr[e.level].nice_length, e.max_chain_length = Sr[e.level].max_chain, e.strstart = 0, e.block_start = 0, e.lookahead = 0, e.insert = 0, e.match_length = e.prev_length = Z - 1, e.match_available = 0, e.ins_h = 0;
};
function D1() {
  this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = so, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new Uint16Array(_1 * 2), this.dyn_dtree = new Uint16Array((2 * w1 + 1) * 2), this.bl_tree = new Uint16Array((2 * v1 + 1) * 2), mt(this.dyn_ltree), mt(this.dyn_dtree), mt(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new Uint16Array(b1 + 1), this.heap = new Uint16Array(2 * K0 + 1), mt(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new Uint16Array(2 * K0 + 1), mt(this.depth), this.sym_buf = 0, this.lit_bufsize = 0, this.sym_next = 0, this.sym_end = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
}
const en = (e) => {
  if (!e)
    return 1;
  const r = e.state;
  return !r || r.strm !== e || r.status !== cr && //#ifdef GZIP
  r.status !== Ei && //#endif
  r.status !== V0 && r.status !== q0 && r.status !== G0 && r.status !== Z0 && r.status !== Ht && r.status !== kr ? 1 : 0;
}, il = (e) => {
  if (en(e))
    return zt(e, Qe);
  e.total_in = e.total_out = 0, e.data_type = d1;
  const r = e.state;
  return r.pending = 0, r.pending_out = 0, r.wrap < 0 && (r.wrap = -r.wrap), r.status = //#ifdef GZIP
  r.wrap === 2 ? Ei : (
    //#endif
    r.wrap ? cr : Ht
  ), e.adler = r.wrap === 2 ? 0 : 1, r.last_flush = -2, t1(r), ge;
}, al = (e) => {
  const r = il(e);
  return r === ge && S1(e.state), r;
}, F1 = (e, r) => en(e) || e.state.wrap !== 2 ? Qe : (e.state.gzhead = r, ge), sl = (e, r, t, n, o, i) => {
  if (!e)
    return Qe;
  let c = 1;
  if (r === s1 && (r = 6), n < 0 ? (c = 0, n = -n) : n > 15 && (c = 2, n -= 16), o < 1 || o > h1 || t !== so || n < 8 || n > 15 || r < 0 || r > 9 || i < 0 || i > u1 || n === 8 && c !== 1)
    return zt(e, Qe);
  n === 8 && (n = 9);
  const s = new D1();
  return e.state = s, s.strm = e, s.status = cr, s.wrap = c, s.gzhead = null, s.w_bits = n, s.w_size = 1 << s.w_bits, s.w_mask = s.w_size - 1, s.hash_bits = o + 7, s.hash_size = 1 << s.hash_bits, s.hash_mask = s.hash_size - 1, s.hash_shift = ~~((s.hash_bits + Z - 1) / Z), s.window = new Uint8Array(s.w_size * 2), s.head = new Uint16Array(s.hash_size), s.prev = new Uint16Array(s.w_size), s.lit_bufsize = 1 << o + 6, s.pending_buf_size = s.lit_bufsize * 4, s.pending_buf = new Uint8Array(s.pending_buf_size), s.sym_buf = s.lit_bufsize, s.sym_end = (s.lit_bufsize - 1) * 3, s.level = r, s.strategy = i, s.method = t, al(e);
}, T1 = (e, r) => sl(e, r, so, x1, p1, f1), R1 = (e, r) => {
  if (en(e) || r > Ja || r < 0)
    return e ? zt(e, Qe) : Qe;
  const t = e.state;
  if (!e.output || e.avail_in !== 0 && !e.input || t.status === kr && r !== Me)
    return zt(e, e.avail_out === 0 ? w0 : Qe);
  const n = t.last_flush;
  if (t.last_flush = r, t.pending !== 0) {
    if (Oe(e), e.avail_out === 0)
      return t.last_flush = -1, ge;
  } else if (e.avail_in === 0 && es(r) <= es(n) && r !== Me)
    return zt(e, w0);
  if (t.status === kr && e.avail_in !== 0)
    return zt(e, w0);
  if (t.status === cr && t.wrap === 0 && (t.status = Ht), t.status === cr) {
    let o = so + (t.w_bits - 8 << 4) << 8, i = -1;
    if (t.strategy >= En || t.level < 2 ? i = 0 : t.level < 6 ? i = 1 : t.level === 6 ? i = 2 : i = 3, o |= i << 6, t.strstart !== 0 && (o |= m1), o += 31 - o % 31, Er(t, o), t.strstart !== 0 && (Er(t, e.adler >>> 16), Er(t, e.adler & 65535)), e.adler = 1, t.status = Ht, Oe(e), t.pending !== 0)
      return t.last_flush = -1, ge;
  }
  if (t.status === Ei) {
    if (e.adler = 0, ee(t, 31), ee(t, 139), ee(t, 8), t.gzhead)
      ee(
        t,
        (t.gzhead.text ? 1 : 0) + (t.gzhead.hcrc ? 2 : 0) + (t.gzhead.extra ? 4 : 0) + (t.gzhead.name ? 8 : 0) + (t.gzhead.comment ? 16 : 0)
      ), ee(t, t.gzhead.time & 255), ee(t, t.gzhead.time >> 8 & 255), ee(t, t.gzhead.time >> 16 & 255), ee(t, t.gzhead.time >> 24 & 255), ee(t, t.level === 9 ? 2 : t.strategy >= En || t.level < 2 ? 4 : 0), ee(t, t.gzhead.os & 255), t.gzhead.extra && t.gzhead.extra.length && (ee(t, t.gzhead.extra.length & 255), ee(t, t.gzhead.extra.length >> 8 & 255)), t.gzhead.hcrc && (e.adler = he(e.adler, t.pending_buf, t.pending, 0)), t.gzindex = 0, t.status = V0;
    else if (ee(t, 0), ee(t, 0), ee(t, 0), ee(t, 0), ee(t, 0), ee(t, t.level === 9 ? 2 : t.strategy >= En || t.level < 2 ? 4 : 0), ee(t, E1), t.status = Ht, Oe(e), t.pending !== 0)
      return t.last_flush = -1, ge;
  }
  if (t.status === V0) {
    if (t.gzhead.extra) {
      let o = t.pending, i = (t.gzhead.extra.length & 65535) - t.gzindex;
      for (; t.pending + i > t.pending_buf_size; ) {
        let s = t.pending_buf_size - t.pending;
        if (t.pending_buf.set(t.gzhead.extra.subarray(t.gzindex, t.gzindex + s), t.pending), t.pending = t.pending_buf_size, t.gzhead.hcrc && t.pending > o && (e.adler = he(e.adler, t.pending_buf, t.pending - o, o)), t.gzindex += s, Oe(e), t.pending !== 0)
          return t.last_flush = -1, ge;
        o = 0, i -= s;
      }
      let c = new Uint8Array(t.gzhead.extra);
      t.pending_buf.set(c.subarray(t.gzindex, t.gzindex + i), t.pending), t.pending += i, t.gzhead.hcrc && t.pending > o && (e.adler = he(e.adler, t.pending_buf, t.pending - o, o)), t.gzindex = 0;
    }
    t.status = q0;
  }
  if (t.status === q0) {
    if (t.gzhead.name) {
      let o = t.pending, i;
      do {
        if (t.pending === t.pending_buf_size) {
          if (t.gzhead.hcrc && t.pending > o && (e.adler = he(e.adler, t.pending_buf, t.pending - o, o)), Oe(e), t.pending !== 0)
            return t.last_flush = -1, ge;
          o = 0;
        }
        t.gzindex < t.gzhead.name.length ? i = t.gzhead.name.charCodeAt(t.gzindex++) & 255 : i = 0, ee(t, i);
      } while (i !== 0);
      t.gzhead.hcrc && t.pending > o && (e.adler = he(e.adler, t.pending_buf, t.pending - o, o)), t.gzindex = 0;
    }
    t.status = G0;
  }
  if (t.status === G0) {
    if (t.gzhead.comment) {
      let o = t.pending, i;
      do {
        if (t.pending === t.pending_buf_size) {
          if (t.gzhead.hcrc && t.pending > o && (e.adler = he(e.adler, t.pending_buf, t.pending - o, o)), Oe(e), t.pending !== 0)
            return t.last_flush = -1, ge;
          o = 0;
        }
        t.gzindex < t.gzhead.comment.length ? i = t.gzhead.comment.charCodeAt(t.gzindex++) & 255 : i = 0, ee(t, i);
      } while (i !== 0);
      t.gzhead.hcrc && t.pending > o && (e.adler = he(e.adler, t.pending_buf, t.pending - o, o));
    }
    t.status = Z0;
  }
  if (t.status === Z0) {
    if (t.gzhead.hcrc) {
      if (t.pending + 2 > t.pending_buf_size && (Oe(e), t.pending !== 0))
        return t.last_flush = -1, ge;
      ee(t, e.adler & 255), ee(t, e.adler >> 8 & 255), e.adler = 0;
    }
    if (t.status = Ht, Oe(e), t.pending !== 0)
      return t.last_flush = -1, ge;
  }
  if (e.avail_in !== 0 || t.lookahead !== 0 || r !== Bt && t.status !== kr) {
    let o = t.level === 0 ? ol(t, r) : t.strategy === En ? k1(t, r) : t.strategy === l1 ? C1(t, r) : Sr[t.level].func(t, r);
    if ((o === jt || o === hr) && (t.status = kr), o === Ae || o === jt)
      return e.avail_out === 0 && (t.last_flush = -1), ge;
    if (o === dr && (r === o1 ? n1(t) : r !== Ja && ($0(t, 0, 0, !1), r === i1 && (mt(t.head), t.lookahead === 0 && (t.strstart = 0, t.block_start = 0, t.insert = 0))), Oe(e), e.avail_out === 0))
      return t.last_flush = -1, ge;
  }
  return r !== Me ? ge : t.wrap <= 0 ? Qa : (t.wrap === 2 ? (ee(t, e.adler & 255), ee(t, e.adler >> 8 & 255), ee(t, e.adler >> 16 & 255), ee(t, e.adler >> 24 & 255), ee(t, e.total_in & 255), ee(t, e.total_in >> 8 & 255), ee(t, e.total_in >> 16 & 255), ee(t, e.total_in >> 24 & 255)) : (Er(t, e.adler >>> 16), Er(t, e.adler & 65535)), Oe(e), t.wrap > 0 && (t.wrap = -t.wrap), t.pending !== 0 ? ge : Qa);
}, O1 = (e) => {
  if (en(e))
    return Qe;
  const r = e.state.status;
  return e.state = null, r === Ht ? zt(e, a1) : ge;
}, I1 = (e, r) => {
  let t = r.length;
  if (en(e))
    return Qe;
  const n = e.state, o = n.wrap;
  if (o === 2 || o === 1 && n.status !== cr || n.lookahead)
    return Qe;
  if (o === 1 && (e.adler = $r(e.adler, r, t, 0)), n.wrap = 0, t >= n.w_size) {
    o === 0 && (mt(n.head), n.strstart = 0, n.block_start = 0, n.insert = 0);
    let u = new Uint8Array(n.w_size);
    u.set(r.subarray(t - n.w_size, t), 0), r = u, t = n.w_size;
  }
  const i = e.avail_in, c = e.next_in, s = e.input;
  for (e.avail_in = t, e.next_in = 0, e.input = r, lr(n); n.lookahead >= Z; ) {
    let u = n.strstart, a = n.lookahead - (Z - 1);
    do
      n.ins_h = Ct(n, n.ins_h, n.window[u + Z - 1]), n.prev[u & n.w_mask] = n.head[n.ins_h], n.head[n.ins_h] = u, u++;
    while (--a);
    n.strstart = u, n.lookahead = Z - 1, lr(n);
  }
  return n.strstart += n.lookahead, n.block_start = n.strstart, n.insert = n.lookahead, n.lookahead = 0, n.match_length = n.prev_length = Z - 1, n.match_available = 0, e.next_in = c, e.input = s, e.avail_in = i, n.wrap = o, ge;
};
var N1 = T1, H1 = sl, z1 = al, L1 = il, U1 = F1, M1 = R1, P1 = O1, W1 = I1, j1 = "pako deflate (from Nodeca project)", Rr = {
  deflateInit: N1,
  deflateInit2: H1,
  deflateReset: z1,
  deflateResetKeep: L1,
  deflateSetHeader: U1,
  deflate: M1,
  deflateEnd: P1,
  deflateSetDictionary: W1,
  deflateInfo: j1
};
const $1 = (e, r) => Object.prototype.hasOwnProperty.call(e, r);
var K1 = function(e) {
  const r = Array.prototype.slice.call(arguments, 1);
  for (; r.length; ) {
    const t = r.shift();
    if (t) {
      if (typeof t != "object")
        throw new TypeError(t + "must be non-object");
      for (const n in t)
        $1(t, n) && (e[n] = t[n]);
    }
  }
  return e;
}, V1 = (e) => {
  let r = 0;
  for (let n = 0, o = e.length; n < o; n++)
    r += e[n].length;
  const t = new Uint8Array(r);
  for (let n = 0, o = 0, i = e.length; n < i; n++) {
    let c = e[n];
    t.set(c, o), o += c.length;
  }
  return t;
}, co = {
  assign: K1,
  flattenChunks: V1
};
let cl = !0;
try {
  String.fromCharCode.apply(null, new Uint8Array(1));
} catch {
  cl = !1;
}
const Kr = new Uint8Array(256);
for (let e = 0; e < 256; e++)
  Kr[e] = e >= 252 ? 6 : e >= 248 ? 5 : e >= 240 ? 4 : e >= 224 ? 3 : e >= 192 ? 2 : 1;
Kr[254] = Kr[254] = 1;
var q1 = (e) => {
  if (typeof TextEncoder == "function" && TextEncoder.prototype.encode)
    return new TextEncoder().encode(e);
  let r, t, n, o, i, c = e.length, s = 0;
  for (o = 0; o < c; o++)
    t = e.charCodeAt(o), (t & 64512) === 55296 && o + 1 < c && (n = e.charCodeAt(o + 1), (n & 64512) === 56320 && (t = 65536 + (t - 55296 << 10) + (n - 56320), o++)), s += t < 128 ? 1 : t < 2048 ? 2 : t < 65536 ? 3 : 4;
  for (r = new Uint8Array(s), i = 0, o = 0; i < s; o++)
    t = e.charCodeAt(o), (t & 64512) === 55296 && o + 1 < c && (n = e.charCodeAt(o + 1), (n & 64512) === 56320 && (t = 65536 + (t - 55296 << 10) + (n - 56320), o++)), t < 128 ? r[i++] = t : t < 2048 ? (r[i++] = 192 | t >>> 6, r[i++] = 128 | t & 63) : t < 65536 ? (r[i++] = 224 | t >>> 12, r[i++] = 128 | t >>> 6 & 63, r[i++] = 128 | t & 63) : (r[i++] = 240 | t >>> 18, r[i++] = 128 | t >>> 12 & 63, r[i++] = 128 | t >>> 6 & 63, r[i++] = 128 | t & 63);
  return r;
};
const G1 = (e, r) => {
  if (r < 65534 && e.subarray && cl)
    return String.fromCharCode.apply(null, e.length === r ? e : e.subarray(0, r));
  let t = "";
  for (let n = 0; n < r; n++)
    t += String.fromCharCode(e[n]);
  return t;
};
var Z1 = (e, r) => {
  const t = r || e.length;
  if (typeof TextDecoder == "function" && TextDecoder.prototype.decode)
    return new TextDecoder().decode(e.subarray(0, r));
  let n, o;
  const i = new Array(t * 2);
  for (o = 0, n = 0; n < t; ) {
    let c = e[n++];
    if (c < 128) {
      i[o++] = c;
      continue;
    }
    let s = Kr[c];
    if (s > 4) {
      i[o++] = 65533, n += s - 1;
      continue;
    }
    for (c &= s === 2 ? 31 : s === 3 ? 15 : 7; s > 1 && n < t; )
      c = c << 6 | e[n++] & 63, s--;
    if (s > 1) {
      i[o++] = 65533;
      continue;
    }
    c < 65536 ? i[o++] = c : (c -= 65536, i[o++] = 55296 | c >> 10 & 1023, i[o++] = 56320 | c & 1023);
  }
  return G1(i, o);
}, Y1 = (e, r) => {
  r = r || e.length, r > e.length && (r = e.length);
  let t = r - 1;
  for (; t >= 0 && (e[t] & 192) === 128; )
    t--;
  return t < 0 || t === 0 ? r : t + Kr[e[t]] > r ? t : r;
}, Vr = {
  string2buf: q1,
  buf2string: Z1,
  utf8border: Y1
};
function X1() {
  this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
}
var ll = X1;
const ul = Object.prototype.toString, {
  Z_NO_FLUSH: J1,
  Z_SYNC_FLUSH: Q1,
  Z_FULL_FLUSH: ep,
  Z_FINISH: tp,
  Z_OK: Vn,
  Z_STREAM_END: rp,
  Z_DEFAULT_COMPRESSION: np,
  Z_DEFAULT_STRATEGY: op,
  Z_DEFLATED: ip
} = Qr;
function Ai(e) {
  this.options = co.assign({
    level: np,
    method: ip,
    chunkSize: 16384,
    windowBits: 15,
    memLevel: 8,
    strategy: op
  }, e || {});
  let r = this.options;
  r.raw && r.windowBits > 0 ? r.windowBits = -r.windowBits : r.gzip && r.windowBits > 0 && r.windowBits < 16 && (r.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new ll(), this.strm.avail_out = 0;
  let t = Rr.deflateInit2(
    this.strm,
    r.level,
    r.method,
    r.windowBits,
    r.memLevel,
    r.strategy
  );
  if (t !== Vn)
    throw new Error(sr[t]);
  if (r.header && Rr.deflateSetHeader(this.strm, r.header), r.dictionary) {
    let n;
    if (typeof r.dictionary == "string" ? n = Vr.string2buf(r.dictionary) : ul.call(r.dictionary) === "[object ArrayBuffer]" ? n = new Uint8Array(r.dictionary) : n = r.dictionary, t = Rr.deflateSetDictionary(this.strm, n), t !== Vn)
      throw new Error(sr[t]);
    this._dict_set = !0;
  }
}
Ai.prototype.push = function(e, r) {
  const t = this.strm, n = this.options.chunkSize;
  let o, i;
  if (this.ended)
    return !1;
  for (r === ~~r ? i = r : i = r === !0 ? tp : J1, typeof e == "string" ? t.input = Vr.string2buf(e) : ul.call(e) === "[object ArrayBuffer]" ? t.input = new Uint8Array(e) : t.input = e, t.next_in = 0, t.avail_in = t.input.length; ; ) {
    if (t.avail_out === 0 && (t.output = new Uint8Array(n), t.next_out = 0, t.avail_out = n), (i === Q1 || i === ep) && t.avail_out <= 6) {
      this.onData(t.output.subarray(0, t.next_out)), t.avail_out = 0;
      continue;
    }
    if (o = Rr.deflate(t, i), o === rp)
      return t.next_out > 0 && this.onData(t.output.subarray(0, t.next_out)), o = Rr.deflateEnd(this.strm), this.onEnd(o), this.ended = !0, o === Vn;
    if (t.avail_out === 0) {
      this.onData(t.output);
      continue;
    }
    if (i > 0 && t.next_out > 0) {
      this.onData(t.output.subarray(0, t.next_out)), t.avail_out = 0;
      continue;
    }
    if (t.avail_in === 0) break;
  }
  return !0;
};
Ai.prototype.onData = function(e) {
  this.chunks.push(e);
};
Ai.prototype.onEnd = function(e) {
  e === Vn && (this.result = co.flattenChunks(this.chunks)), this.chunks = [], this.err = e, this.msg = this.strm.msg;
};
const An = 16209, ap = 16191;
var sp = function(r, t) {
  let n, o, i, c, s, u, a, l, h, d, f, x, v, w, _, p, g, y, b, A, m, C, S, E;
  const k = r.state;
  n = r.next_in, S = r.input, o = n + (r.avail_in - 5), i = r.next_out, E = r.output, c = i - (t - r.avail_out), s = i + (r.avail_out - 257), u = k.dmax, a = k.wsize, l = k.whave, h = k.wnext, d = k.window, f = k.hold, x = k.bits, v = k.lencode, w = k.distcode, _ = (1 << k.lenbits) - 1, p = (1 << k.distbits) - 1;
  e:
    do {
      x < 15 && (f += S[n++] << x, x += 8, f += S[n++] << x, x += 8), g = v[f & _];
      t:
        for (; ; ) {
          if (y = g >>> 24, f >>>= y, x -= y, y = g >>> 16 & 255, y === 0)
            E[i++] = g & 65535;
          else if (y & 16) {
            b = g & 65535, y &= 15, y && (x < y && (f += S[n++] << x, x += 8), b += f & (1 << y) - 1, f >>>= y, x -= y), x < 15 && (f += S[n++] << x, x += 8, f += S[n++] << x, x += 8), g = w[f & p];
            r:
              for (; ; ) {
                if (y = g >>> 24, f >>>= y, x -= y, y = g >>> 16 & 255, y & 16) {
                  if (A = g & 65535, y &= 15, x < y && (f += S[n++] << x, x += 8, x < y && (f += S[n++] << x, x += 8)), A += f & (1 << y) - 1, A > u) {
                    r.msg = "invalid distance too far back", k.mode = An;
                    break e;
                  }
                  if (f >>>= y, x -= y, y = i - c, A > y) {
                    if (y = A - y, y > l && k.sane) {
                      r.msg = "invalid distance too far back", k.mode = An;
                      break e;
                    }
                    if (m = 0, C = d, h === 0) {
                      if (m += a - y, y < b) {
                        b -= y;
                        do
                          E[i++] = d[m++];
                        while (--y);
                        m = i - A, C = E;
                      }
                    } else if (h < y) {
                      if (m += a + h - y, y -= h, y < b) {
                        b -= y;
                        do
                          E[i++] = d[m++];
                        while (--y);
                        if (m = 0, h < b) {
                          y = h, b -= y;
                          do
                            E[i++] = d[m++];
                          while (--y);
                          m = i - A, C = E;
                        }
                      }
                    } else if (m += h - y, y < b) {
                      b -= y;
                      do
                        E[i++] = d[m++];
                      while (--y);
                      m = i - A, C = E;
                    }
                    for (; b > 2; )
                      E[i++] = C[m++], E[i++] = C[m++], E[i++] = C[m++], b -= 3;
                    b && (E[i++] = C[m++], b > 1 && (E[i++] = C[m++]));
                  } else {
                    m = i - A;
                    do
                      E[i++] = E[m++], E[i++] = E[m++], E[i++] = E[m++], b -= 3;
                    while (b > 2);
                    b && (E[i++] = E[m++], b > 1 && (E[i++] = E[m++]));
                  }
                } else if (y & 64) {
                  r.msg = "invalid distance code", k.mode = An;
                  break e;
                } else {
                  g = w[(g & 65535) + (f & (1 << y) - 1)];
                  continue r;
                }
                break;
              }
          } else if (y & 64)
            if (y & 32) {
              k.mode = ap;
              break e;
            } else {
              r.msg = "invalid literal/length code", k.mode = An;
              break e;
            }
          else {
            g = v[(g & 65535) + (f & (1 << y) - 1)];
            continue t;
          }
          break;
        }
    } while (n < o && i < s);
  b = x >> 3, n -= b, x -= b << 3, f &= (1 << x) - 1, r.next_in = n, r.next_out = i, r.avail_in = n < o ? 5 + (o - n) : 5 - (n - o), r.avail_out = i < s ? 257 + (s - i) : 257 - (i - s), k.hold = f, k.bits = x;
};
const tr = 15, ts = 852, rs = 592, ns = 0, _0 = 1, os = 2, cp = new Uint16Array([
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
]), lp = new Uint8Array([
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
]), up = new Uint16Array([
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
]), fp = new Uint8Array([
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
]), dp = (e, r, t, n, o, i, c, s) => {
  const u = s.bits;
  let a = 0, l = 0, h = 0, d = 0, f = 0, x = 0, v = 0, w = 0, _ = 0, p = 0, g, y, b, A, m, C = null, S;
  const E = new Uint16Array(tr + 1), k = new Uint16Array(tr + 1);
  let T = null, R, z, H;
  for (a = 0; a <= tr; a++)
    E[a] = 0;
  for (l = 0; l < n; l++)
    E[r[t + l]]++;
  for (f = u, d = tr; d >= 1 && E[d] === 0; d--)
    ;
  if (f > d && (f = d), d === 0)
    return o[i++] = 1 << 24 | 64 << 16 | 0, o[i++] = 1 << 24 | 64 << 16 | 0, s.bits = 1, 0;
  for (h = 1; h < d && E[h] === 0; h++)
    ;
  for (f < h && (f = h), w = 1, a = 1; a <= tr; a++)
    if (w <<= 1, w -= E[a], w < 0)
      return -1;
  if (w > 0 && (e === ns || d !== 1))
    return -1;
  for (k[1] = 0, a = 1; a < tr; a++)
    k[a + 1] = k[a] + E[a];
  for (l = 0; l < n; l++)
    r[t + l] !== 0 && (c[k[r[t + l]]++] = l);
  if (e === ns ? (C = T = c, S = 20) : e === _0 ? (C = cp, T = lp, S = 257) : (C = up, T = fp, S = 0), p = 0, l = 0, a = h, m = i, x = f, v = 0, b = -1, _ = 1 << f, A = _ - 1, e === _0 && _ > ts || e === os && _ > rs)
    return 1;
  for (; ; ) {
    R = a - v, c[l] + 1 < S ? (z = 0, H = c[l]) : c[l] >= S ? (z = T[c[l] - S], H = C[c[l] - S]) : (z = 96, H = 0), g = 1 << a - v, y = 1 << x, h = y;
    do
      y -= g, o[m + (p >> v) + y] = R << 24 | z << 16 | H | 0;
    while (y !== 0);
    for (g = 1 << a - 1; p & g; )
      g >>= 1;
    if (g !== 0 ? (p &= g - 1, p += g) : p = 0, l++, --E[a] === 0) {
      if (a === d)
        break;
      a = r[t + c[l]];
    }
    if (a > f && (p & A) !== b) {
      for (v === 0 && (v = f), m += h, x = a - v, w = 1 << x; x + v < d && (w -= E[x + v], !(w <= 0)); )
        x++, w <<= 1;
      if (_ += 1 << x, e === _0 && _ > ts || e === os && _ > rs)
        return 1;
      b = p & A, o[b] = f << 24 | x << 16 | m - i | 0;
    }
  }
  return p !== 0 && (o[m + p] = a - v << 24 | 64 << 16 | 0), s.bits = f, 0;
};
var Or = dp;
const hp = 0, fl = 1, dl = 2, {
  Z_FINISH: is,
  Z_BLOCK: xp,
  Z_TREES: Bn,
  Z_OK: $t,
  Z_STREAM_END: pp,
  Z_NEED_DICT: gp,
  Z_STREAM_ERROR: Pe,
  Z_DATA_ERROR: hl,
  Z_MEM_ERROR: xl,
  Z_BUF_ERROR: yp,
  Z_DEFLATED: as
} = Qr, lo = 16180, ss = 16181, cs = 16182, ls = 16183, us = 16184, fs = 16185, ds = 16186, hs = 16187, xs = 16188, ps = 16189, qn = 16190, ot = 16191, b0 = 16192, gs = 16193, m0 = 16194, ys = 16195, ws = 16196, vs = 16197, _s = 16198, Cn = 16199, kn = 16200, bs = 16201, ms = 16202, Es = 16203, As = 16204, Bs = 16205, E0 = 16206, Cs = 16207, ks = 16208, ie = 16209, pl = 16210, gl = 16211, wp = 852, vp = 592, _p = 15, bp = _p, Ss = (e) => (e >>> 24 & 255) + (e >>> 8 & 65280) + ((e & 65280) << 8) + ((e & 255) << 24);
function mp() {
  this.strm = null, this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new Uint16Array(320), this.work = new Uint16Array(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
}
const Gt = (e) => {
  if (!e)
    return 1;
  const r = e.state;
  return !r || r.strm !== e || r.mode < lo || r.mode > gl ? 1 : 0;
}, yl = (e) => {
  if (Gt(e))
    return Pe;
  const r = e.state;
  return e.total_in = e.total_out = r.total = 0, e.msg = "", r.wrap && (e.adler = r.wrap & 1), r.mode = lo, r.last = 0, r.havedict = 0, r.flags = -1, r.dmax = 32768, r.head = null, r.hold = 0, r.bits = 0, r.lencode = r.lendyn = new Int32Array(wp), r.distcode = r.distdyn = new Int32Array(vp), r.sane = 1, r.back = -1, $t;
}, wl = (e) => {
  if (Gt(e))
    return Pe;
  const r = e.state;
  return r.wsize = 0, r.whave = 0, r.wnext = 0, yl(e);
}, vl = (e, r) => {
  let t;
  if (Gt(e))
    return Pe;
  const n = e.state;
  return r < 0 ? (t = 0, r = -r) : (t = (r >> 4) + 5, r < 48 && (r &= 15)), r && (r < 8 || r > 15) ? Pe : (n.window !== null && n.wbits !== r && (n.window = null), n.wrap = t, n.wbits = r, wl(e));
}, _l = (e, r) => {
  if (!e)
    return Pe;
  const t = new mp();
  e.state = t, t.strm = e, t.window = null, t.mode = lo;
  const n = vl(e, r);
  return n !== $t && (e.state = null), n;
}, Ep = (e) => _l(e, bp);
let Ds = !0, A0, B0;
const Ap = (e) => {
  if (Ds) {
    A0 = new Int32Array(512), B0 = new Int32Array(32);
    let r = 0;
    for (; r < 144; )
      e.lens[r++] = 8;
    for (; r < 256; )
      e.lens[r++] = 9;
    for (; r < 280; )
      e.lens[r++] = 7;
    for (; r < 288; )
      e.lens[r++] = 8;
    for (Or(fl, e.lens, 0, 288, A0, 0, e.work, { bits: 9 }), r = 0; r < 32; )
      e.lens[r++] = 5;
    Or(dl, e.lens, 0, 32, B0, 0, e.work, { bits: 5 }), Ds = !1;
  }
  e.lencode = A0, e.lenbits = 9, e.distcode = B0, e.distbits = 5;
}, bl = (e, r, t, n) => {
  let o;
  const i = e.state;
  return i.window === null && (i.wsize = 1 << i.wbits, i.wnext = 0, i.whave = 0, i.window = new Uint8Array(i.wsize)), n >= i.wsize ? (i.window.set(r.subarray(t - i.wsize, t), 0), i.wnext = 0, i.whave = i.wsize) : (o = i.wsize - i.wnext, o > n && (o = n), i.window.set(r.subarray(t - n, t - n + o), i.wnext), n -= o, n ? (i.window.set(r.subarray(t - n, t), 0), i.wnext = n, i.whave = i.wsize) : (i.wnext += o, i.wnext === i.wsize && (i.wnext = 0), i.whave < i.wsize && (i.whave += o))), 0;
}, Bp = (e, r) => {
  let t, n, o, i, c, s, u, a, l, h, d, f, x, v, w = 0, _, p, g, y, b, A, m, C;
  const S = new Uint8Array(4);
  let E, k;
  const T = (
    /* permutation of code lengths */
    new Uint8Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15])
  );
  if (Gt(e) || !e.output || !e.input && e.avail_in !== 0)
    return Pe;
  t = e.state, t.mode === ot && (t.mode = b0), c = e.next_out, o = e.output, u = e.avail_out, i = e.next_in, n = e.input, s = e.avail_in, a = t.hold, l = t.bits, h = s, d = u, C = $t;
  e:
    for (; ; )
      switch (t.mode) {
        case lo:
          if (t.wrap === 0) {
            t.mode = b0;
            break;
          }
          for (; l < 16; ) {
            if (s === 0)
              break e;
            s--, a += n[i++] << l, l += 8;
          }
          if (t.wrap & 2 && a === 35615) {
            t.wbits === 0 && (t.wbits = 15), t.check = 0, S[0] = a & 255, S[1] = a >>> 8 & 255, t.check = he(t.check, S, 2, 0), a = 0, l = 0, t.mode = ss;
            break;
          }
          if (t.head && (t.head.done = !1), !(t.wrap & 1) || /* check if zlib header allowed */
          (((a & 255) << 8) + (a >> 8)) % 31) {
            e.msg = "incorrect header check", t.mode = ie;
            break;
          }
          if ((a & 15) !== as) {
            e.msg = "unknown compression method", t.mode = ie;
            break;
          }
          if (a >>>= 4, l -= 4, m = (a & 15) + 8, t.wbits === 0 && (t.wbits = m), m > 15 || m > t.wbits) {
            e.msg = "invalid window size", t.mode = ie;
            break;
          }
          t.dmax = 1 << t.wbits, t.flags = 0, e.adler = t.check = 1, t.mode = a & 512 ? ps : ot, a = 0, l = 0;
          break;
        case ss:
          for (; l < 16; ) {
            if (s === 0)
              break e;
            s--, a += n[i++] << l, l += 8;
          }
          if (t.flags = a, (t.flags & 255) !== as) {
            e.msg = "unknown compression method", t.mode = ie;
            break;
          }
          if (t.flags & 57344) {
            e.msg = "unknown header flags set", t.mode = ie;
            break;
          }
          t.head && (t.head.text = a >> 8 & 1), t.flags & 512 && t.wrap & 4 && (S[0] = a & 255, S[1] = a >>> 8 & 255, t.check = he(t.check, S, 2, 0)), a = 0, l = 0, t.mode = cs;
        case cs:
          for (; l < 32; ) {
            if (s === 0)
              break e;
            s--, a += n[i++] << l, l += 8;
          }
          t.head && (t.head.time = a), t.flags & 512 && t.wrap & 4 && (S[0] = a & 255, S[1] = a >>> 8 & 255, S[2] = a >>> 16 & 255, S[3] = a >>> 24 & 255, t.check = he(t.check, S, 4, 0)), a = 0, l = 0, t.mode = ls;
        case ls:
          for (; l < 16; ) {
            if (s === 0)
              break e;
            s--, a += n[i++] << l, l += 8;
          }
          t.head && (t.head.xflags = a & 255, t.head.os = a >> 8), t.flags & 512 && t.wrap & 4 && (S[0] = a & 255, S[1] = a >>> 8 & 255, t.check = he(t.check, S, 2, 0)), a = 0, l = 0, t.mode = us;
        case us:
          if (t.flags & 1024) {
            for (; l < 16; ) {
              if (s === 0)
                break e;
              s--, a += n[i++] << l, l += 8;
            }
            t.length = a, t.head && (t.head.extra_len = a), t.flags & 512 && t.wrap & 4 && (S[0] = a & 255, S[1] = a >>> 8 & 255, t.check = he(t.check, S, 2, 0)), a = 0, l = 0;
          } else t.head && (t.head.extra = null);
          t.mode = fs;
        case fs:
          if (t.flags & 1024 && (f = t.length, f > s && (f = s), f && (t.head && (m = t.head.extra_len - t.length, t.head.extra || (t.head.extra = new Uint8Array(t.head.extra_len)), t.head.extra.set(
            n.subarray(
              i,
              // extra field is limited to 65536 bytes
              // - no need for additional size check
              i + f
            ),
            /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
            m
          )), t.flags & 512 && t.wrap & 4 && (t.check = he(t.check, n, f, i)), s -= f, i += f, t.length -= f), t.length))
            break e;
          t.length = 0, t.mode = ds;
        case ds:
          if (t.flags & 2048) {
            if (s === 0)
              break e;
            f = 0;
            do
              m = n[i + f++], t.head && m && t.length < 65536 && (t.head.name += String.fromCharCode(m));
            while (m && f < s);
            if (t.flags & 512 && t.wrap & 4 && (t.check = he(t.check, n, f, i)), s -= f, i += f, m)
              break e;
          } else t.head && (t.head.name = null);
          t.length = 0, t.mode = hs;
        case hs:
          if (t.flags & 4096) {
            if (s === 0)
              break e;
            f = 0;
            do
              m = n[i + f++], t.head && m && t.length < 65536 && (t.head.comment += String.fromCharCode(m));
            while (m && f < s);
            if (t.flags & 512 && t.wrap & 4 && (t.check = he(t.check, n, f, i)), s -= f, i += f, m)
              break e;
          } else t.head && (t.head.comment = null);
          t.mode = xs;
        case xs:
          if (t.flags & 512) {
            for (; l < 16; ) {
              if (s === 0)
                break e;
              s--, a += n[i++] << l, l += 8;
            }
            if (t.wrap & 4 && a !== (t.check & 65535)) {
              e.msg = "header crc mismatch", t.mode = ie;
              break;
            }
            a = 0, l = 0;
          }
          t.head && (t.head.hcrc = t.flags >> 9 & 1, t.head.done = !0), e.adler = t.check = 0, t.mode = ot;
          break;
        case ps:
          for (; l < 32; ) {
            if (s === 0)
              break e;
            s--, a += n[i++] << l, l += 8;
          }
          e.adler = t.check = Ss(a), a = 0, l = 0, t.mode = qn;
        case qn:
          if (t.havedict === 0)
            return e.next_out = c, e.avail_out = u, e.next_in = i, e.avail_in = s, t.hold = a, t.bits = l, gp;
          e.adler = t.check = 1, t.mode = ot;
        case ot:
          if (r === xp || r === Bn)
            break e;
        case b0:
          if (t.last) {
            a >>>= l & 7, l -= l & 7, t.mode = E0;
            break;
          }
          for (; l < 3; ) {
            if (s === 0)
              break e;
            s--, a += n[i++] << l, l += 8;
          }
          switch (t.last = a & 1, a >>>= 1, l -= 1, a & 3) {
            case 0:
              t.mode = gs;
              break;
            case 1:
              if (Ap(t), t.mode = Cn, r === Bn) {
                a >>>= 2, l -= 2;
                break e;
              }
              break;
            case 2:
              t.mode = ws;
              break;
            case 3:
              e.msg = "invalid block type", t.mode = ie;
          }
          a >>>= 2, l -= 2;
          break;
        case gs:
          for (a >>>= l & 7, l -= l & 7; l < 32; ) {
            if (s === 0)
              break e;
            s--, a += n[i++] << l, l += 8;
          }
          if ((a & 65535) !== (a >>> 16 ^ 65535)) {
            e.msg = "invalid stored block lengths", t.mode = ie;
            break;
          }
          if (t.length = a & 65535, a = 0, l = 0, t.mode = m0, r === Bn)
            break e;
        case m0:
          t.mode = ys;
        case ys:
          if (f = t.length, f) {
            if (f > s && (f = s), f > u && (f = u), f === 0)
              break e;
            o.set(n.subarray(i, i + f), c), s -= f, i += f, u -= f, c += f, t.length -= f;
            break;
          }
          t.mode = ot;
          break;
        case ws:
          for (; l < 14; ) {
            if (s === 0)
              break e;
            s--, a += n[i++] << l, l += 8;
          }
          if (t.nlen = (a & 31) + 257, a >>>= 5, l -= 5, t.ndist = (a & 31) + 1, a >>>= 5, l -= 5, t.ncode = (a & 15) + 4, a >>>= 4, l -= 4, t.nlen > 286 || t.ndist > 30) {
            e.msg = "too many length or distance symbols", t.mode = ie;
            break;
          }
          t.have = 0, t.mode = vs;
        case vs:
          for (; t.have < t.ncode; ) {
            for (; l < 3; ) {
              if (s === 0)
                break e;
              s--, a += n[i++] << l, l += 8;
            }
            t.lens[T[t.have++]] = a & 7, a >>>= 3, l -= 3;
          }
          for (; t.have < 19; )
            t.lens[T[t.have++]] = 0;
          if (t.lencode = t.lendyn, t.lenbits = 7, E = { bits: t.lenbits }, C = Or(hp, t.lens, 0, 19, t.lencode, 0, t.work, E), t.lenbits = E.bits, C) {
            e.msg = "invalid code lengths set", t.mode = ie;
            break;
          }
          t.have = 0, t.mode = _s;
        case _s:
          for (; t.have < t.nlen + t.ndist; ) {
            for (; w = t.lencode[a & (1 << t.lenbits) - 1], _ = w >>> 24, p = w >>> 16 & 255, g = w & 65535, !(_ <= l); ) {
              if (s === 0)
                break e;
              s--, a += n[i++] << l, l += 8;
            }
            if (g < 16)
              a >>>= _, l -= _, t.lens[t.have++] = g;
            else {
              if (g === 16) {
                for (k = _ + 2; l < k; ) {
                  if (s === 0)
                    break e;
                  s--, a += n[i++] << l, l += 8;
                }
                if (a >>>= _, l -= _, t.have === 0) {
                  e.msg = "invalid bit length repeat", t.mode = ie;
                  break;
                }
                m = t.lens[t.have - 1], f = 3 + (a & 3), a >>>= 2, l -= 2;
              } else if (g === 17) {
                for (k = _ + 3; l < k; ) {
                  if (s === 0)
                    break e;
                  s--, a += n[i++] << l, l += 8;
                }
                a >>>= _, l -= _, m = 0, f = 3 + (a & 7), a >>>= 3, l -= 3;
              } else {
                for (k = _ + 7; l < k; ) {
                  if (s === 0)
                    break e;
                  s--, a += n[i++] << l, l += 8;
                }
                a >>>= _, l -= _, m = 0, f = 11 + (a & 127), a >>>= 7, l -= 7;
              }
              if (t.have + f > t.nlen + t.ndist) {
                e.msg = "invalid bit length repeat", t.mode = ie;
                break;
              }
              for (; f--; )
                t.lens[t.have++] = m;
            }
          }
          if (t.mode === ie)
            break;
          if (t.lens[256] === 0) {
            e.msg = "invalid code -- missing end-of-block", t.mode = ie;
            break;
          }
          if (t.lenbits = 9, E = { bits: t.lenbits }, C = Or(fl, t.lens, 0, t.nlen, t.lencode, 0, t.work, E), t.lenbits = E.bits, C) {
            e.msg = "invalid literal/lengths set", t.mode = ie;
            break;
          }
          if (t.distbits = 6, t.distcode = t.distdyn, E = { bits: t.distbits }, C = Or(dl, t.lens, t.nlen, t.ndist, t.distcode, 0, t.work, E), t.distbits = E.bits, C) {
            e.msg = "invalid distances set", t.mode = ie;
            break;
          }
          if (t.mode = Cn, r === Bn)
            break e;
        case Cn:
          t.mode = kn;
        case kn:
          if (s >= 6 && u >= 258) {
            e.next_out = c, e.avail_out = u, e.next_in = i, e.avail_in = s, t.hold = a, t.bits = l, sp(e, d), c = e.next_out, o = e.output, u = e.avail_out, i = e.next_in, n = e.input, s = e.avail_in, a = t.hold, l = t.bits, t.mode === ot && (t.back = -1);
            break;
          }
          for (t.back = 0; w = t.lencode[a & (1 << t.lenbits) - 1], _ = w >>> 24, p = w >>> 16 & 255, g = w & 65535, !(_ <= l); ) {
            if (s === 0)
              break e;
            s--, a += n[i++] << l, l += 8;
          }
          if (p && !(p & 240)) {
            for (y = _, b = p, A = g; w = t.lencode[A + ((a & (1 << y + b) - 1) >> y)], _ = w >>> 24, p = w >>> 16 & 255, g = w & 65535, !(y + _ <= l); ) {
              if (s === 0)
                break e;
              s--, a += n[i++] << l, l += 8;
            }
            a >>>= y, l -= y, t.back += y;
          }
          if (a >>>= _, l -= _, t.back += _, t.length = g, p === 0) {
            t.mode = Bs;
            break;
          }
          if (p & 32) {
            t.back = -1, t.mode = ot;
            break;
          }
          if (p & 64) {
            e.msg = "invalid literal/length code", t.mode = ie;
            break;
          }
          t.extra = p & 15, t.mode = bs;
        case bs:
          if (t.extra) {
            for (k = t.extra; l < k; ) {
              if (s === 0)
                break e;
              s--, a += n[i++] << l, l += 8;
            }
            t.length += a & (1 << t.extra) - 1, a >>>= t.extra, l -= t.extra, t.back += t.extra;
          }
          t.was = t.length, t.mode = ms;
        case ms:
          for (; w = t.distcode[a & (1 << t.distbits) - 1], _ = w >>> 24, p = w >>> 16 & 255, g = w & 65535, !(_ <= l); ) {
            if (s === 0)
              break e;
            s--, a += n[i++] << l, l += 8;
          }
          if (!(p & 240)) {
            for (y = _, b = p, A = g; w = t.distcode[A + ((a & (1 << y + b) - 1) >> y)], _ = w >>> 24, p = w >>> 16 & 255, g = w & 65535, !(y + _ <= l); ) {
              if (s === 0)
                break e;
              s--, a += n[i++] << l, l += 8;
            }
            a >>>= y, l -= y, t.back += y;
          }
          if (a >>>= _, l -= _, t.back += _, p & 64) {
            e.msg = "invalid distance code", t.mode = ie;
            break;
          }
          t.offset = g, t.extra = p & 15, t.mode = Es;
        case Es:
          if (t.extra) {
            for (k = t.extra; l < k; ) {
              if (s === 0)
                break e;
              s--, a += n[i++] << l, l += 8;
            }
            t.offset += a & (1 << t.extra) - 1, a >>>= t.extra, l -= t.extra, t.back += t.extra;
          }
          if (t.offset > t.dmax) {
            e.msg = "invalid distance too far back", t.mode = ie;
            break;
          }
          t.mode = As;
        case As:
          if (u === 0)
            break e;
          if (f = d - u, t.offset > f) {
            if (f = t.offset - f, f > t.whave && t.sane) {
              e.msg = "invalid distance too far back", t.mode = ie;
              break;
            }
            f > t.wnext ? (f -= t.wnext, x = t.wsize - f) : x = t.wnext - f, f > t.length && (f = t.length), v = t.window;
          } else
            v = o, x = c - t.offset, f = t.length;
          f > u && (f = u), u -= f, t.length -= f;
          do
            o[c++] = v[x++];
          while (--f);
          t.length === 0 && (t.mode = kn);
          break;
        case Bs:
          if (u === 0)
            break e;
          o[c++] = t.length, u--, t.mode = kn;
          break;
        case E0:
          if (t.wrap) {
            for (; l < 32; ) {
              if (s === 0)
                break e;
              s--, a |= n[i++] << l, l += 8;
            }
            if (d -= u, e.total_out += d, t.total += d, t.wrap & 4 && d && (e.adler = t.check = /*UPDATE_CHECK(state.check, put - _out, _out);*/
            t.flags ? he(t.check, o, d, c - d) : $r(t.check, o, d, c - d)), d = u, t.wrap & 4 && (t.flags ? a : Ss(a)) !== t.check) {
              e.msg = "incorrect data check", t.mode = ie;
              break;
            }
            a = 0, l = 0;
          }
          t.mode = Cs;
        case Cs:
          if (t.wrap && t.flags) {
            for (; l < 32; ) {
              if (s === 0)
                break e;
              s--, a += n[i++] << l, l += 8;
            }
            if (t.wrap & 4 && a !== (t.total & 4294967295)) {
              e.msg = "incorrect length check", t.mode = ie;
              break;
            }
            a = 0, l = 0;
          }
          t.mode = ks;
        case ks:
          C = pp;
          break e;
        case ie:
          C = hl;
          break e;
        case pl:
          return xl;
        case gl:
        default:
          return Pe;
      }
  return e.next_out = c, e.avail_out = u, e.next_in = i, e.avail_in = s, t.hold = a, t.bits = l, (t.wsize || d !== e.avail_out && t.mode < ie && (t.mode < E0 || r !== is)) && bl(e, e.output, e.next_out, d - e.avail_out), h -= e.avail_in, d -= e.avail_out, e.total_in += h, e.total_out += d, t.total += d, t.wrap & 4 && d && (e.adler = t.check = /*UPDATE_CHECK(state.check, strm.next_out - _out, _out);*/
  t.flags ? he(t.check, o, d, e.next_out - d) : $r(t.check, o, d, e.next_out - d)), e.data_type = t.bits + (t.last ? 64 : 0) + (t.mode === ot ? 128 : 0) + (t.mode === Cn || t.mode === m0 ? 256 : 0), (h === 0 && d === 0 || r === is) && C === $t && (C = yp), C;
}, Cp = (e) => {
  if (Gt(e))
    return Pe;
  let r = e.state;
  return r.window && (r.window = null), e.state = null, $t;
}, kp = (e, r) => {
  if (Gt(e))
    return Pe;
  const t = e.state;
  return t.wrap & 2 ? (t.head = r, r.done = !1, $t) : Pe;
}, Sp = (e, r) => {
  const t = r.length;
  let n, o, i;
  return Gt(e) || (n = e.state, n.wrap !== 0 && n.mode !== qn) ? Pe : n.mode === qn && (o = 1, o = $r(o, r, t, 0), o !== n.check) ? hl : (i = bl(e, r, t, t), i ? (n.mode = pl, xl) : (n.havedict = 1, $t));
};
var Dp = wl, Fp = vl, Tp = yl, Rp = Ep, Op = _l, Ip = Bp, Np = Cp, Hp = kp, zp = Sp, Lp = "pako inflate (from Nodeca project)", st = {
  inflateReset: Dp,
  inflateReset2: Fp,
  inflateResetKeep: Tp,
  inflateInit: Rp,
  inflateInit2: Op,
  inflate: Ip,
  inflateEnd: Np,
  inflateGetHeader: Hp,
  inflateSetDictionary: zp,
  inflateInfo: Lp
};
function Up() {
  this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
}
var Mp = Up;
const ml = Object.prototype.toString, {
  Z_NO_FLUSH: Pp,
  Z_FINISH: Wp,
  Z_OK: qr,
  Z_STREAM_END: C0,
  Z_NEED_DICT: k0,
  Z_STREAM_ERROR: jp,
  Z_DATA_ERROR: Fs,
  Z_MEM_ERROR: $p
} = Qr;
function tn(e) {
  this.options = co.assign({
    chunkSize: 1024 * 64,
    windowBits: 15,
    to: ""
  }, e || {});
  const r = this.options;
  r.raw && r.windowBits >= 0 && r.windowBits < 16 && (r.windowBits = -r.windowBits, r.windowBits === 0 && (r.windowBits = -15)), r.windowBits >= 0 && r.windowBits < 16 && !(e && e.windowBits) && (r.windowBits += 32), r.windowBits > 15 && r.windowBits < 48 && (r.windowBits & 15 || (r.windowBits |= 15)), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new ll(), this.strm.avail_out = 0;
  let t = st.inflateInit2(
    this.strm,
    r.windowBits
  );
  if (t !== qr)
    throw new Error(sr[t]);
  if (this.header = new Mp(), st.inflateGetHeader(this.strm, this.header), r.dictionary && (typeof r.dictionary == "string" ? r.dictionary = Vr.string2buf(r.dictionary) : ml.call(r.dictionary) === "[object ArrayBuffer]" && (r.dictionary = new Uint8Array(r.dictionary)), r.raw && (t = st.inflateSetDictionary(this.strm, r.dictionary), t !== qr)))
    throw new Error(sr[t]);
}
tn.prototype.push = function(e, r) {
  const t = this.strm, n = this.options.chunkSize, o = this.options.dictionary;
  let i, c, s;
  if (this.ended) return !1;
  for (r === ~~r ? c = r : c = r === !0 ? Wp : Pp, ml.call(e) === "[object ArrayBuffer]" ? t.input = new Uint8Array(e) : t.input = e, t.next_in = 0, t.avail_in = t.input.length; ; ) {
    for (t.avail_out === 0 && (t.output = new Uint8Array(n), t.next_out = 0, t.avail_out = n), i = st.inflate(t, c), i === k0 && o && (i = st.inflateSetDictionary(t, o), i === qr ? i = st.inflate(t, c) : i === Fs && (i = k0)); t.avail_in > 0 && i === C0 && t.state.wrap > 0 && e[t.next_in] !== 0; )
      st.inflateReset(t), i = st.inflate(t, c);
    switch (i) {
      case jp:
      case Fs:
      case k0:
      case $p:
        return this.onEnd(i), this.ended = !0, !1;
    }
    if (s = t.avail_out, t.next_out && (t.avail_out === 0 || i === C0))
      if (this.options.to === "string") {
        let u = Vr.utf8border(t.output, t.next_out), a = t.next_out - u, l = Vr.buf2string(t.output, u);
        t.next_out = a, t.avail_out = n - a, a && t.output.set(t.output.subarray(u, u + a), 0), this.onData(l);
      } else
        this.onData(t.output.length === t.next_out ? t.output : t.output.subarray(0, t.next_out));
    if (!(i === qr && s === 0)) {
      if (i === C0)
        return i = st.inflateEnd(this.strm), this.onEnd(i), this.ended = !0, !0;
      if (t.avail_in === 0) break;
    }
  }
  return !0;
};
tn.prototype.onData = function(e) {
  this.chunks.push(e);
};
tn.prototype.onEnd = function(e) {
  e === qr && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = co.flattenChunks(this.chunks)), this.chunks = [], this.err = e, this.msg = this.strm.msg;
};
function Bi(e, r) {
  const t = new tn(r);
  if (t.push(e), t.err) throw t.msg || sr[t.err];
  return t.result;
}
function Kp(e, r) {
  return r = r || {}, r.raw = !0, Bi(e, r);
}
var Vp = tn, qp = Bi, Gp = Kp, Zp = Bi, Yp = Qr, Xp = {
  Inflate: Vp,
  inflate: qp,
  inflateRaw: Gp,
  ungzip: Zp,
  constants: Yp
};
const { Inflate: F2, inflate: Jp, inflateRaw: T2, ungzip: R2 } = Xp;
var Qp = Jp;
class O2 {
  static parseJavaByteArray(r) {
    const t = r.slice(1, -1).split(",").map((n) => {
      let o = parseInt(n.trim());
      return o < 0 && (o += 256), o;
    });
    return new Uint8Array(t);
  }
  static arrayBufferToWordArray(r) {
    const t = [];
    let n = 0;
    const o = r.length;
    for (; n < o; )
      t.push(
        r[n++] << 24 | r[n++] << 16 | r[n++] << 8 | r[n++]
      );
    return ue.lib.WordArray.create(t, r.length);
  }
  static wordArrayToUint8Array(r) {
    const t = r.words, n = r.sigBytes, o = new Uint8Array(n);
    let i = 0;
    for (let c = 0; c < n; c += 4) {
      const s = t[c / 4];
      for (let u = 0; u < Math.min(4, n - c); u++)
        o[i++] = s >>> 24 - u * 8 & 255;
    }
    return o;
  }
  static decryptData(r, t, n) {
    try {
      const o = this.arrayBufferToWordArray(r), i = this.arrayBufferToWordArray(t), c = ue.AES.decrypt(
        ue.lib.CipherParams.create({
          ciphertext: o
        }),
        n,
        {
          iv: i,
          mode: ue.mode.CBC,
          padding: ue.pad.Pkcs7
        }
      );
      return this.wordArrayToUint8Array(c);
    } catch (o) {
      throw console.error("Decryption error:", o), new Error("Failed to decrypt data - invalid password");
    }
  }
  static generateDeterministicSecret(r, t, n) {
    const o = e2(r, t), i = Buffer.from(n, "hex"), c = ae.generateRandomAddress(i, o.secret, (s) => {
      if (o.prng) {
        const u = s.length, a = o.prng.nextBytes(u);
        s.set(a);
      }
    });
    return { secret: o.secret, address: c };
  }
  static async decode(r, t) {
    try {
      let n = 0;
      const o = new Uint8Array(r), i = Buffer.from(o.slice(0, 32)).toString("hex");
      n += 32;
      const c = new DataView(o.buffer).getUint32(n);
      n += 4;
      const s = o.slice(n, n + c), u = JSON.parse(
        new TextDecoder().decode(s)
      );
      n += c;
      const a = this.parseJavaByteArray(u["pbkdf2 salt"]), l = ue.PBKDF2(
        t,
        this.arrayBufferToWordArray(a),
        {
          keySize: 128 / 32,
          iterations: parseInt(u["pbkdf2 iteration"]),
          hasher: ue.algo.SHA1
        }
      ), h = o.slice(n, n + 16);
      n += 16;
      const d = new DataView(o.buffer).getUint32(n);
      n += 4;
      const f = o.slice(n, n + d);
      n += d;
      const x = this.decryptData(f, h, l);
      let v = 0;
      for (; v < x.length && x[v] !== 125; )
        v++;
      v++;
      const w = JSON.parse(
        new TextDecoder().decode(x.slice(0, v))
      ), _ = [];
      for (; n < o.length; ) {
        const p = o.slice(n, n + 16);
        n += 16;
        const g = new DataView(o.buffer).getUint32(n);
        n += 4;
        const y = o.slice(n, n + g);
        n += g;
        const b = this.decryptData(y, p, l), A = Qp(b);
        let m = 0;
        for (; m < A.length && A[m] !== 125; )
          m++;
        m++;
        const C = JSON.parse(
          new TextDecoder().decode(A.slice(0, m))
        );
        C.address = Buffer.from(
          this.parseJavaByteArray(C.address)
        ).toString("hex"), C.secret = Buffer.from(
          this.parseJavaByteArray(C.secret)
        ).toString("hex"), _.push(C);
      }
      return { publicHeader: u, privateHeader: w, entries: _ };
    } catch (n) {
      throw console.error("MCM decoding error:", n), n instanceof Error ? new Error(`Failed to decode MCM file: ${n.message}`) : new Error("Failed to decode MCM file");
    }
  }
}
function e2(e, r) {
  const t = fc(r), n = [...e, ...t], o = ue.lib.WordArray.create(new Uint8Array(n)), i = ue.SHA512(o), c = li(i), s = new Un();
  return s.addSeedMaterial(c), { secret: new Uint8Array(s.nextBytes(32)), prng: s };
}
function X0(e) {
  const r = [];
  for (let t = 0; t < e.length; t += 4)
    r.push(
      e[t] << 24 | (e[t + 1] || 0) << 16 | (e[t + 2] || 0) << 8 | (e[t + 3] || 0)
    );
  return Qn.lib.WordArray.create(r, e.length);
}
function El(e) {
  const r = e.words, t = e.sigBytes, n = new Uint8Array(t);
  for (let o = 0; o < t; o++) {
    const i = r[o >>> 2] >>> 24 - o % 4 * 8 & 255;
    n[o] = i;
  }
  return n;
}
function I2(e) {
  const r = X0(e), t = Qn.SHA256(r);
  return El(t);
}
function Ts(e, r) {
  const t = X0(e), n = X0(r), o = Qn.HmacSHA256(n, t);
  return El(o);
}
const t2 = (process.env.NODE_ENV === "test", 1e5);
async function Ci(e, r, t) {
  return Al(e, r, t);
}
async function r2(e, r) {
  const t = new TextEncoder().encode(`account_${r}`);
  return Ci(e, r, {
    salt: t,
    keyLength: 32
    // WOTS secret must be 32 bytes
  });
}
async function n2(e, r) {
  const t = new TextEncoder().encode(`wots_${r}`);
  return Ci(e, r, {
    salt: t,
    keyLength: 32
    // WOTS secret must be 32 bytes
  });
}
const Rs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
async function o2(e, r) {
  const t = new TextEncoder().encode(`tag_${r}`), n = await Ci(e, r, {
    salt: t,
    keyLength: 32,
    iterations: 1e4
  }), o = new Uint8Array(12);
  for (let i = 0; i < 12; i++) {
    const c = n[i] % Rs.length;
    o[i] = Rs.charCodeAt(c);
  }
  return o;
}
async function N2(e, r, t, n = `Account ${r} - WOTS ${t}`) {
  const o = await r2(e, r), i = await o2(e, r), c = await n2(o, t);
  try {
    return Mt.create(n, c, i);
  } finally {
    Tn(o);
  }
}
async function H2(e, r, t) {
  return Al(e, r, t);
}
function Al(e, r, t) {
  const o = new TextEncoder().encode(r.toString()), i = e.length + o.length + t.salt.length, c = new Uint8Array(i);
  c.set(e), c.set(o, e.length), c.set(t.salt, e.length + o.length);
  try {
    let s = c;
    const u = Math.ceil((t.iterations || t2) / 100);
    for (let a = 0; a < u; a++)
      s = Ts(s, t.salt), s = Ts(s, c);
    return t.keyLength && t.keyLength !== s.length && (s = s.slice(0, t.keyLength)), s;
  } finally {
    Tn(c);
  }
}
export {
  d2 as BaseNetworkService,
  It as Derivation,
  Un as DigestRandomGenerator,
  O2 as MCMDecoder,
  ve as MasterSeed,
  x2 as MeshNetworkService,
  B2 as MochimoWalletProvider,
  Hr as NetworkProvider,
  Wl as ProxyNetworkService,
  _e as SessionManager,
  be as StorageProvider,
  N2 as createWOTSWallet,
  Nl as decrypt,
  Nr as decryptAccount,
  r2 as deriveAccountSeed,
  o2 as deriveAccountTag,
  Ci as deriveKey,
  H2 as deriveKeyCrypto,
  Al as deriveKeyFast,
  e2 as deriveSecret,
  c2 as deriveSubkey,
  n2 as deriveWotsSeed,
  Il as encrypt,
  Q0 as encryptAccount,
  jl as fetchRecentActivity,
  s2 as generateRandomKey,
  l2 as getApiEndpoints,
  Ml as getCurrentApiEndpoint,
  Ts as hmacSHA256,
  fc as intToBytes,
  Pl as setApiEndpoint,
  I2 as sha256,
  ix as store,
  wx as useAccounts,
  u2 as useApiEndpoint,
  k2 as useNetwork,
  vx as useNetworkSync,
  f2 as useRecentActivity,
  D2 as useStorage,
  S2 as useTransaction,
  C2 as useWallet,
  Hs as validateApiEndpoint,
  li as wordArrayToBytes
};
