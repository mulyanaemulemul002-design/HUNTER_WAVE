import { useState, useMemo, useRef, useEffect } from "react";
import { getAirdrops, getNews, getQinfo, getTools, getP2P, getCalendar, getTicker } from "./lib/data";
import {
  Home, LayoutGrid, Compass, Search, SlidersHorizontal,
  ExternalLink, Copy, Check, ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  Calendar, Users, Lightbulb, Zap, BookOpen,
  X, Shield, MessageCircle, Heart,
  Rocket, TrendingUp, BarChart2, Bookmark, AlertTriangle,
  Landmark, Phone, Send,
} from "lucide-react";

// ─── DONATE & FEEDBACK ────────────────────────────────────────
const DONATE_ADDRESS  = "0xfb0792130e2218fa7bef32eb5a023366f8b5d644";
const FEEDBACK_TG     = "https://t.me/otgdontcry";

// ─── STORAGE (IndexedDB — handles large images, no quota issues) ───
const DB_NAME    = "dropmylink_v1";
const STORE_NAME = "content";

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = (e) => { e.target.result.createObjectStore(STORE_NAME); };
    req.onsuccess  = (e) => resolve(e.target.result);
    req.onerror    = (e) => reject(e.target.error);
  });
}

async function idbGet(key, def) {
  try {
    const db  = await openDB();
    return new Promise((resolve) => {
      const tx  = db.transaction(STORE_NAME, "readonly");
      const req = tx.objectStore(STORE_NAME).get(key);
      req.onsuccess = () => resolve(req.result ?? def);
      req.onerror   = () => resolve(def);
    });
  } catch { return def; }
}

async function idbSet(key, value) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.objectStore(STORE_NAME).put(value, key);
      tx.oncomplete = () => resolve();
      tx.onerror    = () => reject(tx.error);
    });
  } catch {}
}

async function idbGetAll() {
  return Promise.all([
    idbGet("airdrops", null),
    idbGet("news",     null),
    idbGet("qinfo",    null),
    idbGet("tools",    null),
    idbGet("p2p",      null),
    idbGet("calendar", null),
    idbGet("ticker",   null),
  ]);
}

// ─── DEFAULT DATA (loaded & validated from src/data/*.json via Zod) ──
const DEF_AIRDROPS = getAirdrops();
const DEF_NEWS     = getNews();
const DEF_QINFO    = getQinfo();
const DEF_TOOLS    = getTools();
const DEF_P2P      = getP2P();
const DEF_CALENDAR = getCalendar();
const DEF_TICKER   = getTicker();

// ─── CONSTANTS ────────────────────────────────────────────────
const TAG_COLORS = {
  "Cross-chain":{ text:"text-blue-300",    bg:"bg-blue-500/20",    ring:"ring-blue-500/30" },
  DeFi:          { text:"text-sky-300",     bg:"bg-sky-500/20",     ring:"ring-sky-500/30" },
  Layer2:        { text:"text-cyan-300",    bg:"bg-cyan-500/20",    ring:"ring-cyan-500/30" },
  Layer1:        { text:"text-blue-200",    bg:"bg-blue-600/20",    ring:"ring-blue-600/30" },
  ZK:            { text:"text-indigo-300",  bg:"bg-indigo-500/20",  ring:"ring-indigo-500/30" },
  Beginner:      { text:"text-green-300",   bg:"bg-green-500/20",   ring:"ring-green-500/30" },
  Advanced:      { text:"text-red-300",     bg:"bg-red-500/20",     ring:"ring-red-500/30" },
  Strategy:      { text:"text-blue-300",    bg:"bg-blue-500/20",    ring:"ring-blue-500/30" },
  Security:      { text:"text-yellow-300",  bg:"bg-yellow-500/20",  ring:"ring-yellow-500/30" },
  Tips:          { text:"text-teal-300",    bg:"bg-teal-500/20",    ring:"ring-teal-500/30" },
  Saving:        { text:"text-emerald-300", bg:"bg-emerald-500/20", ring:"ring-emerald-500/30" },
  NFT:           { text:"text-indigo-300",  bg:"bg-indigo-500/20",  ring:"ring-indigo-500/30" },
  GameFi:        { text:"text-pink-300",    bg:"bg-pink-500/20",    ring:"ring-pink-500/30" },
  Testnet:       { text:"text-amber-300",   bg:"bg-amber-500/20",   ring:"ring-amber-500/30" },
};
const DEF_TAG = { text:"text-blue-300", bg:"bg-blue-500/15", ring:"ring-blue-500/25" };

// Unified badge style — dipakai di semua tab agar konsisten
const BADGE_ALL = {
  Active:      "bg-green-500/25 text-green-300 ring-green-500/30",
  New:         "bg-sky-500/25 text-sky-300 ring-sky-500/30",
  Confirmed:   "bg-blue-400/25 text-blue-200 ring-blue-400/30",
  Upcoming:    "bg-purple-500/25 text-purple-300 ring-purple-500/30",
  Soon:        "bg-amber-500/25 text-amber-300 ring-amber-500/30",
  Rumored:     "bg-gray-500/25 text-gray-300 ring-gray-500/30",
  Testnet:     "bg-yellow-500/20 text-yellow-400 ring-yellow-500/30",
  Mainnet:     "bg-blue-500/20 text-blue-300 ring-blue-500/30",
  Distributed: "bg-gray-500/15 text-gray-400 ring-gray-500/25",
  TGE:         "bg-amber-500/25 text-amber-300 ring-amber-500/30",
  Snapshot:    "bg-indigo-500/25 text-indigo-300 ring-indigo-500/30",
  DAO:         "bg-violet-500/25 text-violet-300 ring-violet-500/30",
  Launch:      "bg-emerald-500/25 text-emerald-300 ring-emerald-500/30",
};
// Alias ringkas untuk Airdrop list (tetap pakai ring)
const STATUS_STYLE = BADGE_ALL;

// section:"cepat" → Info Cepat carousel | section:"teknis" → Info Teknis carousel
const QINFO_BOARDS = [
  { id:"garapan",    label:"Garapan Baru", icon:Rocket,     accent:"text-sky-400",    color:"from-sky-500/20 to-sky-900/10",     ring:"ring-sky-500/25",    section:"cepat"  },
  { id:"tge",        label:"TGE",          icon:Zap,        accent:"text-amber-400",  color:"from-amber-500/20 to-amber-900/10", ring:"ring-amber-500/25",   section:"teknis" },
  { id:"presale",    label:"Presale",      icon:TrendingUp, accent:"text-green-400",  color:"from-green-500/20 to-green-900/10", ring:"ring-green-500/25",   section:"teknis" },
  { id:"tokenomics", label:"Tokenomics",   icon:BarChart2,  accent:"text-blue-300",   color:"from-blue-500/20 to-blue-900/10",  ring:"ring-blue-500/25",    section:"teknis" },
];

const STATUS_OPTIONS   = ["Active","Upcoming","Testnet","Mainnet","Distributed"];
const QINFO_STATUS     = ["Soon","Confirmed","Active","Upcoming","New","Rumored"];
const DIFFICULTY_OPTIONS = ["Easy","Medium","Hard"];
const NEWS_COLORS = [
  { label:"Biru Tua",  value:"from-blue-700/40 to-blue-900/20" },
  { label:"Biru",      value:"from-blue-600/35 to-blue-800/20" },
  { label:"Biru Muda", value:"from-blue-500/30 to-blue-900/20" },
  { label:"Navy",      value:"from-blue-800/40 to-blue-900/20" },
  { label:"Cyan",      value:"from-cyan-600/35 to-cyan-900/20" },
];

// ─── SHARED COMPONENTS ────────────────────────────────────────
function TagChip({ tag }) {
  const c = TAG_COLORS[tag] || DEF_TAG;
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ring-1 ${c.text} ${c.bg} ${c.ring}`}>{tag}</span>;
}

function Favicon({ url, customImage, size = 24 }) {
  const src = customImage || `https://www.google.com/s2/favicons?domain=${url}&sz=64`;
  return <img src={src} alt="" width={size} height={size} className="rounded-sm object-contain"
    onError={e => { e.currentTarget.style.display = "none"; }} />;
}

function FormInput({ label, ...props }) {
  return (
    <div>
      {label && <p className="text-[11px] text-white/40 mb-1 font-medium">{label}</p>}
      <input {...props} className="w-full bg-[#1E1E1E] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-blue-500/50 transition-all" />
    </div>
  );
}

function FormSelect({ label, value, onChange, options }) {
  return (
    <div>
      {label && <p className="text-[11px] text-white/40 mb-1 font-medium">{label}</p>}
      <select value={value} onChange={onChange}
        className="w-full bg-[#1E1E1E] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500/50 transition-all appearance-none">
        {options.map(o => <option key={typeof o==="string"?o:o.value} value={typeof o==="string"?o:o.value} className="bg-gray-900">{typeof o==="string"?o:o.label}</option>)}
      </select>
    </div>
  );
}

// File upload → base64
function ImageUpload({ label, value, onChange }) {
  const ref = useRef(null);
  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) { alert("Ukuran gambar maks 3MB"); return; }
    const reader = new FileReader();
    reader.onload = ev => onChange(ev.target.result);
    reader.readAsDataURL(file);
  }
  return (
    <div>
      {label && <p className="text-[11px] text-white/40 mb-1 font-medium">{label}</p>}
      <div className="flex items-center gap-3">
        {value && (
          <div className="relative w-14 h-14 flex-shrink-0">
            <img src={value} className="w-14 h-14 rounded-xl object-cover ring-1 ring-blue-500/30" />
            <button type="button" onClick={() => onChange("")} className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
              <X className="w-2.5 h-2.5 text-white" />
            </button>
          </div>
        )}
        <button type="button" onClick={() => ref.current?.click()}
          className="flex-1 py-2.5 rounded-xl bg-blue-500/10 ring-1 ring-blue-500/20 ring-dashed text-blue-400 text-xs font-semibold hover:bg-blue-500/20 transition-all">
          📎 {value ? "Ganti Foto" : "Pilih Foto dari Perangkat"}
        </button>
        <input ref={ref} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </div>
    </div>
  );
}

function Btn({ onClick, children, variant = "primary", className = "", type = "button" }) {
  const [ripples, setRipples] = useState([]);
  const s = {
    primary: "bg-blue-500 hover:bg-blue-400 text-white font-bold btn-glow",
    ghost:   "bg-[#1E1E1E] border border-white/[0.08] text-white/60 hover:bg-white/[0.06]",
    danger:  "bg-red-500/15 ring-1 ring-red-500/30 text-red-400 hover:bg-red-500/25",
  };
  function handleClick(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now() + Math.random();
    setRipples(r => [...r, { id, x, y }]);
    setTimeout(() => setRipples(r => r.filter(rp => rp.id !== id)), 600);
    onClick?.(e);
  }
  return (
    <button type={type} onClick={handleClick} className={`relative overflow-hidden px-4 py-2.5 rounded-xl text-sm transition-all active:scale-95 ${s[variant]} ${className}`}>
      {children}
      {ripples.map(rp => (
        <span key={rp.id} className={`ripple-dot ${variant==="primary"?"ripple-blue":""}`}
          style={{ left: rp.x, top: rp.y }} />
      ))}
    </button>
  );
}


// ─── DONATE & FEEDBACK CARD ───────────────────────────────────
function DonateFeedbackSection() {
  const [copied, setCopied] = useState(false);
  function copyAddr() {
    navigator.clipboard.writeText(DONATE_ADDRESS).catch(()=>{});
    setCopied(true);
    setTimeout(()=>setCopied(false), 2000);
  }
  return (
    <div className="px-5 mt-6 mb-2">
      <div className="rounded-2xl glass-card p-4 flex flex-col gap-3">
        {/* Donate */}
        <div className="flex items-center gap-2">
          <Heart className="w-3.5 h-3.5 text-white/20 flex-shrink-0" />
          <p className="text-[10px] text-white/30">Dukung via crypto (EVM)</p>
        </div>
        <div className="flex items-center gap-2 bg-black/30 border border-white/[0.06] rounded-xl px-3 py-2">
          <p className="text-[10px] font-mono text-white/30 flex-1 truncate">{DONATE_ADDRESS}</p>
          <button onClick={copyAddr} className="flex-shrink-0 flex items-center gap-1 text-[10px] text-white/30 hover:text-blue-400 transition-colors">
            {copied ? <><Check className="w-3 h-3 text-green-400"/> <span className="text-green-400">Tersalin</span></> : <><Copy className="w-3 h-3"/> Salin</>}
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-white/[0.06]"/>

        {/* Feedback */}
        <button onClick={()=>window.open(FEEDBACK_TG,"_blank","noopener,noreferrer")}
          className="flex items-center gap-2 text-left hover:opacity-80 active:scale-95 transition-all">
          <MessageCircle className="w-3.5 h-3.5 text-white/20 flex-shrink-0" />
          <span className="text-[10px] text-white/30">Kirim feedback dan masukan, hubungi founder <span className="text-blue-400/60">@otgdontcry</span></span>
        </button>
      </div>
    </div>
  );
}

// ─── AUTO-CAROUSEL HOOK ───────────────────────────────────────
function useCarousel(count, ms = 10000) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (count <= 1) return;
    const t = setInterval(() => setIdx(i => (i + 1) % count), ms);
    return () => clearInterval(t);
  }, [count, ms]);
  return [idx, setIdx];
}

// ─── CAROUSEL DOTS ────────────────────────────────────────────
function CarouselDots({ count, idx, onSelect }) {
  if (count <= 1) return null;
  return (
    <div className="flex justify-center gap-1.5 mt-2.5">
      {Array.from({ length: count }).map((_, i) => (
        <button key={i} onClick={() => onSelect(i)}
          className={`rounded-full transition-all duration-300 ${i === idx ? "w-4 h-1.5 bg-blue-400" : "w-1.5 h-1.5 bg-white/20 hover:bg-white/30"}`} />
      ))}
    </div>
  );
}

// ─── STATUS BADGE (unified) ───────────────────────────────────
function StatusBadge({ status }) {
  const cls = BADGE_ALL[status] || "bg-amber-500/25 text-amber-300";
  return <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ring-1 ${cls}`}>{status}</span>;
}

// ─── STATUS LEGEND (collapsible) ──────────────────────────────
const LEGEND_ITEMS = [
  { status:"Active",      desc:"Sedang berjalan" },
  { status:"New",         desc:"Baru ditambahkan" },
  { status:"Upcoming",    desc:"Segera mulai" },
  { status:"Confirmed",   desc:"Sudah dikonfirmasi" },
  { status:"Soon",        desc:"Dalam waktu dekat" },
  { status:"Testnet",     desc:"Fase testnet" },
  { status:"Mainnet",     desc:"Sudah mainnet" },
  { status:"Rumored",     desc:"Masih rumor" },
  { status:"Distributed", desc:"Token sudah dibagikan" },
];
function StatusLegend() {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-3">
      <button onClick={()=>setOpen(o=>!o)}
        className="flex items-center gap-1.5 text-[10px] text-white/35 hover:text-white/60 transition-colors">
        <span>📖 Keterangan Badge Status</span>
        {open ? <ChevronUp className="w-3 h-3"/> : <ChevronDown className="w-3 h-3"/>}
      </button>
      {open && (
        <div className="mt-2 p-3 rounded-xl glass-card">
          <div className="flex flex-wrap gap-x-3 gap-y-2">
            {LEGEND_ITEMS.map(({status,desc})=>(
              <div key={status} className="flex items-center gap-1.5">
                <StatusBadge status={status}/>
                <span className="text-[9px] text-white/35">{desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SIDEBAR NAV (desktop ≥ 1024px) ───────────────────────────
function SidebarNav({ active, onSelect }) {
  const tabs = [
    { id:"intro",    label:"Intro",        icon:Home },
    { id:"info",     label:"Info Terkini", icon:Zap },
    { id:"airdrops", label:"Airdrop",      icon:LayoutGrid },
    { id:"bookmark", label:"Bookmark",     icon:Bookmark },
    { id:"discover", label:"Discover",     icon:Compass },
  ];
  return (
    <div className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-56 bg-[#0A0A0A] border-r border-white/[0.06] z-40 py-5 px-3">
      <div className="flex items-center gap-2.5 px-3 mb-8 select-none">
        <img src="/logo.jpg" alt="logo" className="w-8 h-8 rounded-lg object-cover ring-1 ring-blue-500/30"/>
        <span className="text-sm font-bold text-white tracking-wide">HUNTER<span className="text-blue-500"> WAVE</span></span>
      </div>
      <nav className="flex flex-col gap-1 flex-1">
        {tabs.map(({id,label,icon:Icon})=>(
          <button key={id} onClick={()=>onSelect(id)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left
              ${active===id?"bg-blue-500/20 text-blue-300 ring-1 ring-blue-500/30":"text-white/40 hover:text-white/70 hover:bg-white/[0.05]"}`}>
            <Icon className="w-4 h-4 flex-shrink-0"/>{label}
          </button>
        ))}
      </nav>
    </div>
  );
}


// ─── NEWS CAROUSEL (4:5 portrait — Instagram style) ───────────
function NewsCarousel({ news }) {
  const [idx, setIdx] = useCarousel(news.length);
  if (!news.length) return null;
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between px-5 mb-3">
        <h2 className="text-sm font-bold text-white">📰 Berita Terkini</h2>
        <span className="text-[10px] text-blue-400/50">{idx + 1} / {news.length}</span>
      </div>
      <div className="px-5">
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.08]">
          {/* Slide strip */}
          <div className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${idx * 100}%)` }}>
            {news.map(item => (
              <div key={item.id} className="flex-none w-full flex flex-col bg-black">
                {/* Image — 4:5 portrait ratio */}
                <div className="relative w-full" style={{ paddingBottom: "125%" }}>
                  {item.imageUrl
                    ? <img src={item.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    : <div className={`absolute inset-0 bg-gradient-to-br ${item.color}`} />
                  }
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <span className="absolute top-3 left-3 text-[9px] font-bold px-2 py-1 rounded-full bg-blue-500/40 text-blue-200 backdrop-blur-sm ring-1 ring-blue-400/20">
                    {item.category}
                  </span>
                </div>
                {/* Description area */}
                <div className="px-4 py-3.5 flex flex-col gap-2 bg-[#1E1E1E]">
                  <p className="text-sm font-semibold text-white leading-snug line-clamp-2">{item.title}</p>
                  {item.description && (
                    <p className="text-[11px] text-white/40 leading-relaxed line-clamp-2">{item.description}</p>
                  )}
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-[10px] text-white/25">{item.time}</span>
                    {item.targetUrl && (
                      <button onClick={() => window.open(item.targetUrl,"_blank","noopener,noreferrer")}
                        className="px-5 py-1.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-xs font-bold active:scale-95 transition-all shadow-lg shadow-blue-500/30">
                        LIHAT
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {news.length > 1 && <>
            <button onClick={() => setIdx(i => (i - 1 + news.length) % news.length)}
              className="absolute left-2 top-[40%] -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm border border-white/15 flex items-center justify-center">
              <ChevronLeft className="w-4 h-4 text-white/70"/>
            </button>
            <button onClick={() => setIdx(i => (i + 1) % news.length)}
              className="absolute right-2 top-[40%] -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm border border-white/15 flex items-center justify-center">
              <ChevronRight className="w-4 h-4 text-white/70"/>
            </button>
          </>}
        </div>
        <CarouselDots count={news.length} idx={idx} onSelect={setIdx} />
      </div>
    </div>
  );
}

// ─── QINFO BOARD CARD (16:9) ──────────────────────────────────
function QinfoBoardCard({ board, items }) {
  const Icon = board.icon;
  return (
    <div className="w-full aspect-video rounded-2xl p-4 glass-card flex flex-col gap-3 overflow-hidden">
      <div className={`flex items-center gap-1.5 ${board.accent}`}>
        <Icon className="w-3.5 h-3.5" />
        <span className="text-xs font-bold tracking-wider uppercase">{board.label}</span>
        <span className="ml-auto text-[9px] text-white/25">{items.length} item</span>
      </div>
      <div className="flex flex-col gap-1.5 flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        {items.length === 0 && (
          <p className="text-[11px] text-white/25 italic">Belum ada data</p>
        )}
        {items.map(item => (
          <div key={item.id}
            className={`flex items-center justify-between py-0.5 ${item.targetUrl ? "cursor-pointer hover:opacity-80 active:opacity-60" : ""}`}
            onClick={() => item.targetUrl && window.open(item.targetUrl,"_blank","noopener,noreferrer")}>
            <span className="text-[11px] text-white/80 font-medium truncate mr-2 flex-1">{item.name}</span>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="text-[9px] text-white/30 hidden sm:block">{item.date}</span>
              <StatusBadge status={item.status} />
              {item.targetUrl && <ExternalLink className="w-2.5 h-2.5 text-white/20" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── INFO CEPAT CAROUSEL (16:9 — Garapan Baru) ───────────────
function InfoCepatCarousel({ qinfo }) {
  const boards = QINFO_BOARDS.filter(b => b.section === "cepat");
  const [idx, setIdx] = useCarousel(boards.length);
  if (!boards.length) return null;
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between px-5 mb-3">
        <h2 className="text-sm font-bold text-white">🚀 Info Cepat</h2>
        <CarouselDots count={boards.length} idx={idx} onSelect={setIdx} />
      </div>
      <div className="px-5">
        <div className="relative overflow-hidden rounded-2xl">
          <div className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${idx * 100}%)` }}>
            {boards.map(board => (
              <div key={board.id} className="flex-none w-full">
                <QinfoBoardCard board={board} items={qinfo.filter(q => q.board === board.id)} />
              </div>
            ))}
          </div>
          {boards.length > 1 && <>
            <button onClick={() => setIdx(i => (i - 1 + boards.length) % boards.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm border border-white/15 flex items-center justify-center">
              <ChevronLeft className="w-3.5 h-3.5 text-white/70"/>
            </button>
            <button onClick={() => setIdx(i => (i + 1) % boards.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm border border-white/15 flex items-center justify-center">
              <ChevronRight className="w-3.5 h-3.5 text-white/70"/>
            </button>
          </>}
        </div>
      </div>
    </div>
  );
}

// ─── INFO TEKNIS CAROUSEL (16:9 — TGE / Presale / Tokenomics) ─
function InfoTeknisCarousel({ qinfo }) {
  const boards = QINFO_BOARDS.filter(b => b.section === "teknis");
  const [idx, setIdx] = useCarousel(boards.length);
  if (!boards.length) return null;
  return (
    <div className="mb-2">
      <div className="flex items-center justify-between px-5 mb-3">
        <h2 className="text-sm font-bold text-white">📊 Info Teknis</h2>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-blue-400/50">{boards[idx]?.label}</span>
          <CarouselDots count={boards.length} idx={idx} onSelect={setIdx} />
        </div>
      </div>
      <div className="px-5">
        <div className="relative overflow-hidden rounded-2xl">
          <div className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${idx * 100}%)` }}>
            {boards.map(board => (
              <div key={board.id} className="flex-none w-full">
                <QinfoBoardCard board={board} items={qinfo.filter(q => q.board === board.id)} />
              </div>
            ))}
          </div>
          {boards.length > 1 && <>
            <button onClick={() => setIdx(i => (i - 1 + boards.length) % boards.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm border border-white/15 flex items-center justify-center">
              <ChevronLeft className="w-3.5 h-3.5 text-white/70"/>
            </button>
            <button onClick={() => setIdx(i => (i + 1) % boards.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm border border-white/15 flex items-center justify-center">
              <ChevronRight className="w-3.5 h-3.5 text-white/70"/>
            </button>
          </>}
        </div>
      </div>
    </div>
  );
}

// ─── BRAND SOCIAL ICONS (inline SVG — monochrome / blue accent) ──
function IconTelegram({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  );
}
function IconX({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.261 5.636 5.903-5.636zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}
function IconInstagram({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
    </svg>
  );
}
function IconTikTok({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  );
}

// ─── TICKER BANNER ────────────────────────────────────────────
function TickerBanner({ texts = [] }) {
  const separator = " ✦ ";
  const fullText = texts.join(separator) + separator;
  // Duplikat agar scroll seamless
  const display = fullText + fullText;
  return (
    <>
      <style>{`
        @keyframes hw-ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .hw-ticker-track {
          animation: hw-ticker 28s linear infinite;
          white-space: nowrap;
          display: inline-block;
          will-change: transform;
        }
        .hw-ticker-track:hover { animation-play-state: paused; }
      `}</style>
      <div className="w-full overflow-hidden border-b border-white/[0.06] py-2" style={{background:"linear-gradient(90deg,#080810,#0D0D1C,#080810)"}}>
        <div className="hw-ticker-track text-[12px] tracking-wide font-bold" style={{color:"rgba(147,197,253,0.92)"}}>
          {display}
        </div>
      </div>
    </>
  );
}

// ─── INTRO SCREEN ─────────────────────────────────────────────
const DYOR_TEXT = `Airdrop bersifat spekulatif tidak ada jaminan proyek bakal TGE, apalagi worth farming dalam jangka panjang. Prosesnya bisa makan waktu berbulan-bulan sampai tahunan, dan proyek bisa aja shutdown di tengah jalan tanpa distribusi apa pun.
Jangan jadikan airdrop sebagai sumber penghasilan utama. Disarankan fokus di lebih dari 5+ proyek sekaligus biar waktu dan effort lu gak kebagi terlalu tipis. Platform tidak bertanggung jawab atas kerugian waktu maupun aset yang timbul.`;

function PrivacyModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center px-0 sm:px-5">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}/>
      <div className="relative w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl bg-[#131313] border border-white/[0.08] p-6 pb-20 sm:pb-6 shadow-2xl max-h-[70vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-bold text-white">Privacy Policy</p>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-white/[0.05] flex items-center justify-center hover:bg-white/10">
            <X className="w-3.5 h-3.5 text-white/50"/>
          </button>
        </div>
        <div className="text-[11px] text-white/40 leading-relaxed space-y-3">
          <p>HUNTER WAVE tidak mengumpulkan data pribadi pengguna. Semua data seperti bookmark dan preferensi disimpan secara lokal di perangkat Anda (localStorage/IndexedDB) dan tidak dikirim ke server mana pun.</p>
          <p>Kami tidak menggunakan cookie pihak ketiga. Link ke platform eksternal (Telegram, X, Instagram, TikTok, dll) tunduk pada kebijakan privasi masing-masing platform tersebut.</p>
          <p>Favicon platform diambil dari layanan Google S2 Favicons. Selain itu, tidak ada request ke server eksternal dari aplikasi ini.</p>
          <p className="text-white/25">Terakhir diperbarui: Juli 2025</p>
        </div>
      </div>
    </div>
  );
}

function TermsModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center px-0 sm:px-5">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}/>
      <div className="relative w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl bg-[#131313] border border-white/[0.08] p-6 pb-20 sm:pb-6 shadow-2xl max-h-[70vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-bold text-white">Terms & Disclaimer</p>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-white/[0.05] flex items-center justify-center hover:bg-white/10">
            <X className="w-3.5 h-3.5 text-white/50"/>
          </button>
        </div>
        <div className="text-[11px] text-white/40 leading-relaxed space-y-3">
          <p>HUNTER WAVE adalah platform kurasi informasi independen yang tidak berafiliasi dengan proyek, tim, atau entitas crypto mana pun.</p>
          <p><span className="text-orange-400/70 font-semibold">Bukan Saran Investasi:</span> {DYOR_TEXT}</p>
          <p>Dengan menggunakan platform ini, Anda menyetujui bahwa segala keputusan finansial merupakan tanggung jawab penuh Anda sendiri. Platform tidak menjamin keakuratan, kelengkapan, atau ketepatan waktu informasi yang disajikan.</p>
          <p>Semua konten bersifat edukatif dan informatif semata. Gunakan dengan bijak dan selalu DYOR (Do Your Own Research).</p>
          <p className="text-white/25">Terakhir diperbarui: Juli 2025</p>
        </div>
      </div>
    </div>
  );
}

function IntroScreen({ airdrops = [], calendar = [] }) {
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms]     = useState(false);

  const SOCIAL = [
    { label:"X",         Icon:IconX,         url:"https://x.com/otgboys" },
    { label:"Instagram", Icon:IconInstagram, url:"https://www.instagram.com/airdrophunterwaveid?igsh=MTU5bmI5cXRtNmF3" },
    { label:"TikTok",    Icon:IconTikTok,    url:"https://www.tiktok.com/@airdrophunterwaveid?_r=1&_t=ZS-96oeh8Xs9zB" },
  ];

  return (
    <div className="pb-32">
      {/* ── HERO SECTION ── */}
      <div className="relative px-5 pt-8 pb-7 mb-2 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/40 via-blue-950/15 to-transparent pointer-events-none"/>
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-blue-500/[0.07] blur-3xl pointer-events-none"/>
        <span className="relative text-[10px] font-bold text-blue-400 tracking-widest uppercase">Web3 Airdrop Hub</span>
        <h1 className="relative text-3xl font-black text-white leading-tight mt-2">
          Jadilah Hunter<br/>
          <span className="text-blue-500">Terdepan</span> di Web3
        </h1>
        <p className="relative text-sm text-white/45 mt-2.5 leading-relaxed max-w-xs">
          Info airdrop, campaign, dan tools Web3 terkurasi untuk komunitas crypto Indonesia.
        </p>
        <button
          onClick={()=>window.open("https://t.me/+mkv5RT1Ov25kZmI1","_blank","noopener,noreferrer")}
          className="relative mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-500 hover:bg-blue-400 active:scale-95 transition-all shadow-xl shadow-blue-500/30 btn-glow">
          <IconTelegram className="w-4 h-4 text-white"/>
          <span className="text-sm font-bold text-white">Bergabung di Telegram</span>
        </button>
      </div>

      {/* ── SOCIAL PROOF ── */}
      <div className="px-5 mb-5">
        <div className="grid grid-cols-3 gap-3">
          {[
            { value:"2K+",            label:"Member Telegram", icon:"👥" },
            { value:airdrops.length,  label:"Proyek Airdrop",  icon:"🪂" },
            { value:calendar.length,  label:"Event Kalender",  icon:"📅" },
          ].map(({value,label,icon})=>(
            <div key={label} className="rounded-2xl glass-card p-3 text-center">
              <div className="text-base mb-0.5">{icon}</div>
              <p className="text-xl font-black text-white">{value}</p>
              <p className="text-[9px] text-white/35 mt-0.5 leading-tight">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── BRAND PROFILE CARD ── */}
      <div className="px-5 mb-4">
        <div className="rounded-2xl bg-gradient-to-br from-blue-600/20 to-blue-900/10 border border-blue-500/25 p-5">
          <p className="text-xs text-white/50 leading-relaxed">
            Platform kurasi informasi airdrop, campaign, dan tips Web3 untuk komunitas crypto Indonesia. Kami menyajikan info terkini secara mandiri dan tidak berafiliasi dengan proyek mana pun.
          </p>
          <div className="mt-3.5 flex gap-2 flex-wrap">
            {["Airdrop","Campaign","Web3","DeFi","Layer2"].map(t=>(
              <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 ring-1 ring-blue-500/20">{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── FOLLOW KAMI ── */}
      <div className="px-5 mb-4">
        <div className="rounded-2xl glass-card p-4">
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">Follow Kami</p>
          <div className="flex gap-2.5">
            {SOCIAL.map(({label,Icon,url})=>(
              <button key={label} onClick={()=>window.open(url,"_blank","noopener,noreferrer")}
                className="flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl bg-white/[0.04] ring-1 ring-white/[0.08] hover:bg-white/[0.08] hover:ring-white/[0.14] active:scale-95 transition-all">
                <Icon className="w-5 h-5 text-white/55"/>
                <span className="text-[9px] font-bold text-white/45">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── KEMANDIRIAN ── */}
      <div className="px-5 mb-4">
        <div className="rounded-2xl glass-card p-4">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-500/15 ring-1 ring-blue-500/25 flex items-center justify-center flex-shrink-0">
              <Shield className="w-3.5 h-3.5 text-blue-400"/>
            </div>
            <p className="text-xs font-bold text-white">Kemandirian HUNTER WAVE</p>
          </div>
          <p className="text-[11px] text-white/40 leading-relaxed">
            HUNTER WAVE adalah platform <span className="text-blue-400/80">independen</span> yang tidak memiliki afiliasi resmi, sponsor, atau kerja sama berbayar dengan proyek, tim, atau entitas mana pun. Semua konten disajikan murni berdasarkan riset dan kurasi komunitas.
          </p>
        </div>
      </div>

      {/* ── DYOR ── */}
      <div className="px-5 mb-4">
        <div className="rounded-2xl glass-card p-4">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-7 h-7 rounded-lg bg-white/[0.06] ring-1 ring-white/[0.10] flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-3.5 h-3.5 text-orange-400/70"/>
            </div>
            <p className="text-xs font-bold text-white/80">DYOR</p>
          </div>
          <p className="text-[11px] text-white/35 leading-relaxed">
           Airdrop bersifat spekulatif tidak ada jaminan proyek bakal TGE, apalagi worth farming dalam jangka panjang. Prosesnya bisa makan waktu berbulan-bulan sampai tahunan, dan proyek bisa aja shutdown di tengah jalan tanpa distribusi apa pun.
Jangan jadikan airdrop sebagai sumber penghasilan utama. Disarankan fokus di lebih dari 5+ proyek sekaligus biar waktu dan effort lu gak kebagi terlalu tipis. Platform tidak bertanggung jawab atas kerugian waktu maupun aset yang timbul.
          </p>
        </div>
      </div>

      <DonateFeedbackSection />

      {/* ── FOOTER ── */}
      <div className="px-5 pt-5 pb-4 mt-2 border-t border-white/[0.05]">
        <div className="flex items-center justify-center gap-4 mb-2.5">
          <button onClick={()=>setShowPrivacy(true)} className="text-[10px] text-white/30 hover:text-blue-400/70 transition-colors">
            Privacy Policy
          </button>
          <span className="text-white/10">·</span>
          <button onClick={()=>setShowTerms(true)} className="text-[10px] text-white/30 hover:text-blue-400/70 transition-colors">
            Terms & Disclaimer
          </button>
        </div>
        <p className="text-center text-[9px] text-white/20">© 2025 HUNTER WAVE · Indonesia · Independen &amp; Non-Profit</p>
      </div>

      {showPrivacy && <PrivacyModal onClose={()=>setShowPrivacy(false)}/>}
      {showTerms   && <TermsModal  onClose={()=>setShowTerms(false)}/>}
    </div>
  );
}

// ─── INFO TERKINI SCREEN ──────────────────────────────────────
function InfoTerkiniScreen({ news, qinfo }) {
  return (
    <div className="pb-32">
      <div className="px-5 pt-6 mb-6">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-blue-400"/>
          <h1 className="text-lg font-bold text-white">Info Terkini</h1>
        </div>
        <p className="text-xs text-white/30 mt-1">Berita, iklan, dan update teknis terbaru</p>
      </div>

      <NewsCarousel news={news} />
      <InfoCepatCarousel qinfo={qinfo} />
      <InfoTeknisCarousel qinfo={qinfo} />
    </div>
  );
}

// ─── BOOKMARK SCREEN ──────────────────────────────────────────
function BookmarkScreen({ airdrops, bookmarks, onToggleBookmark, tools, toolBookmarks, onToggleToolBookmark }) {
  const [section, setSection]               = useState("list1");
  const [expandedId, setExpandedId]         = useState(null);
  const [copiedId, setCopiedId]             = useState(null);
  const [expandedToolId, setExpandedToolId] = useState(null);
  const [copiedToolId, setCopiedToolId]     = useState(null);

  // ── Custom list names (localStorage) ──
  const [listNames, setListNames] = useState(() => {
    try {
      const raw = localStorage.getItem("hw_bookmark_names");
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  });
  const [editingName, setEditingName] = useState(null);
  const [tempName, setTempName]       = useState("");

  function startEditName(id, current) { setEditingName(id); setTempName(current); }
  function commitName(id, fallback) {
    const name = tempName.trim() || fallback;
    const next = { ...listNames, [id]: name };
    setListNames(next);
    try { localStorage.setItem("hw_bookmark_names", JSON.stringify(next)); } catch {}
    setEditingName(null);
  }

  function copyToolUrl(tool) {
    navigator.clipboard.writeText(tool.targetUrl || `https://${tool.url}`).catch(()=>{});
    setCopiedToolId(tool.id);
    setTimeout(()=>setCopiedToolId(null), 2000);
  }

  const DEFAULT_NAMES = { list1:"Daftar 1", list2:"Daftar 2", list3:"Daftar 3" };
  const GROUPS = [
    { id:"list1", level:1, label: listNames.list1 || "Daftar 1", emoji:"",
      activePill:"bg-yellow-500 text-white ring-yellow-500",
      activeBorder:"border-yellow-500/30",
      btn:"bg-yellow-500/20 ring-yellow-500/40",
      icon:"text-yellow-400 fill-yellow-400" },
    { id:"list2", level:2, label: listNames.list2 || "Daftar 2", emoji:"",
      activePill:"bg-blue-500 text-white ring-blue-500",
      activeBorder:"border-blue-500/30",
      btn:"bg-blue-500/20 ring-blue-500/40",
      icon:"text-blue-400 fill-blue-400" },
    { id:"list3", level:3, label: listNames.list3 || "Daftar 3", emoji:"",
      activePill:"bg-red-500 text-white ring-red-500",
      activeBorder:"border-red-500/30",
      btn:"bg-red-500/20 ring-red-500/40",
      icon:"text-red-400 fill-red-400" },
    { id:"platform", level:0, label:"Platform", emoji:"🔧",
      activePill:"bg-emerald-500 text-white ring-emerald-500",
      activeBorder:"border-emerald-500/30",
      btn:"bg-emerald-500/20 ring-emerald-500/40",
      icon:"text-emerald-400 fill-emerald-400" },
  ];

  function copyUrl(item) {
    navigator.clipboard.writeText(`https://${item.url}`).catch(()=>{});
    setCopiedId(item.id);
    setTimeout(()=>setCopiedId(null), 2000);
  }

  const totalSaved      = [...bookmarks.values()].filter(v=>v>0).length;
  const totalToolSaved  = toolBookmarks ? toolBookmarks.size : 0;
  const activeGroup     = GROUPS.find(g => g.id === section);
  const activeItems     = section === "platform"
    ? []
    : airdrops.filter(a => bookmarks.get(String(a.id)) === activeGroup.level);
  const savedTools      = section === "platform" && tools && toolBookmarks
    ? tools.filter(t => toolBookmarks.has(String(t.id)))
    : [];

  return (
    <div className="pb-32">
      {/* Header */}
      <div className="px-5 pt-6 mb-5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-blue-400"/>
            <h1 className="text-lg font-bold text-white">Bookmark</h1>
          </div>
          <div className="flex items-center gap-2">
            {(totalSaved + totalToolSaved) > 0 && (
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-300 ring-1 ring-blue-500/20 font-bold">
                {totalSaved + totalToolSaved} tersimpan
              </span>
            )}
          </div>
        </div>
        <p className="text-xs text-white/30">1× kuning · 2× biru · 3× merah · 4× hapus — ketuk nama daftar untuk ganti nama</p>
      </div>

      {/* Sub-tabs dengan rename */}
      <div className="flex gap-2 px-5 mb-5 overflow-x-auto" style={{scrollbarWidth:"none"}}>
        {GROUPS.map(g => {
          const count = g.id === "platform"
            ? (toolBookmarks ? toolBookmarks.size : 0)
            : airdrops.filter(a => bookmarks.get(String(a.id)) === g.level).length;
          const isActive = section === g.id;
          const isEditing = editingName === g.id && g.id !== "platform";
          return (
            <div key={g.id} className={`flex-none flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold ring-1 transition-all
              ${isActive ? g.activePill : "bg-blue-500/[0.08] ring-blue-500/20 text-white/50 hover:text-white/80"}`}>
              <span>{g.emoji}</span>
              {isEditing ? (
                <input
                  autoFocus
                  value={tempName}
                  onChange={e=>setTempName(e.target.value)}
                  onBlur={()=>commitName(g.id, DEFAULT_NAMES[g.id]||g.label)}
                  onKeyDown={e=>{if(e.key==="Enter")commitName(g.id,DEFAULT_NAMES[g.id]||g.label);if(e.key==="Escape")setEditingName(null);}}
                  className="bg-transparent border-b border-white/40 outline-none w-20 text-xs"
                  maxLength={18}
                />
              ) : (
                <button
                  onClick={()=>{
                    if(isActive && g.id!=="platform") { startEditName(g.id, g.label); }
                    else { setSection(g.id); setExpandedId(null); }
                  }}>
                  {g.label}
                </button>
              )}
              {count > 0 && !isEditing && (
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold
                  ${isActive?"bg-white/20 text-white":"bg-white/10 text-white/50"}`}>
                  {count}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Content per tab */}
      <div className="px-5">
        {/* Platform tab — saved tools */}
        {section === "platform" && (
          savedTools.length === 0 ? (
            <div className="rounded-2xl glass-card border-dashed p-10 flex flex-col items-center gap-3 text-center">
              <div className="w-14 h-14 rounded-2xl bg-white/[0.04] ring-1 ring-white/[0.08] flex items-center justify-center">
                <span className="text-2xl">🔧</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-white/50">Platform kosong</p>
                <p className="text-xs text-white/25 mt-1 leading-relaxed">
                  Belum ada platform tersimpan.<br/>Ketuk ikon bookmark di Discover → Platform & Tools.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {savedTools.map(tool => {
                const open = expandedToolId === tool.id;
                return (
                  <div key={tool.id} className={`rounded-2xl border bg-[#1E1E1E] transition-all duration-300 ${open?"border-emerald-500/40":"border-emerald-500/20 hover:border-emerald-500/35"}`}>
                    <div className="flex items-center gap-3 p-4 cursor-pointer select-none" onClick={()=>setExpandedToolId(open?null:tool.id)}>
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-500/10 ring-1 ring-blue-500/20 flex items-center justify-center overflow-hidden">
                        <Favicon url={tool.url} customImage={tool.customImage}/>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-white">{tool.title}</span>
                          {tool.category && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full ring-1 bg-blue-500/15 text-blue-300 ring-blue-500/25">{tool.category}</span>}
                        </div>
                      </div>
                      <button onClick={e=>{e.stopPropagation();onToggleToolBookmark(tool.id);}}
                        className="w-8 h-8 rounded-xl bg-emerald-500/20 ring-1 ring-emerald-500/40 flex items-center justify-center transition-all flex-shrink-0">
                        <Bookmark className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400"/>
                      </button>
                      <ChevronDown className={`w-4 h-4 text-emerald-400/50 flex-shrink-0 transition-transform duration-300 ${open?"rotate-180":""}`}/>
                    </div>
                    {open && (
                      <div className="px-4 pb-4 pt-3 border-t border-emerald-500/[0.12]">
                        <p className="text-[11px] text-blue-400/50 font-mono mb-3 truncate">🔗 {tool.url}</p>
                        {tool.description && <p className="text-xs text-white/50 leading-relaxed mb-3">{tool.description}</p>}
                        <div className="flex gap-2">
                          {tool.targetUrl && (
                            <button onClick={()=>window.open(tool.targetUrl,"_blank","noopener,noreferrer")}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-xs font-bold active:scale-95 transition-all">
                              <ExternalLink className="w-3.5 h-3.5"/> Buka Platform
                            </button>
                          )}
                          <button onClick={()=>copyToolUrl(tool)}
                            className="w-11 h-11 rounded-xl bg-blue-500/10 ring-1 ring-blue-500/20 flex items-center justify-center hover:bg-blue-500/20 transition-all">
                            {copiedToolId===tool.id?<Check className="w-4 h-4 text-green-400"/>:<Copy className="w-4 h-4 text-blue-400/60"/>}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )
        )}
        {/* Airdrop daftar tabs */}
        {section !== "platform" && activeItems.length === 0 ? (
          <div className="rounded-2xl glass-card border-dashed p-10 flex flex-col items-center gap-3 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.04] ring-1 ring-white/[0.08] flex items-center justify-center">
              <span className="text-2xl">{activeGroup.emoji}</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-white/50">{activeGroup.label} kosong</p>
              <p className="text-xs text-white/25 mt-1 leading-relaxed">
                Belum ada airdrop di daftar ini.<br/>Ketuk ikon bookmark di tab Airdrop.
              </p>
            </div>
          </div>
        ) : section !== "platform" && (
          <div className="flex flex-col gap-2.5">
            {activeItems.map(item => {
              const expanded = expandedId === item.id;
              return (
                <div key={item.id} className={`rounded-2xl border bg-[#1E1E1E] transition-all duration-300 ${expanded ? activeGroup.activeBorder : "border-white/[0.06] hover:border-white/[0.14]"}`}>
                  <div className="flex items-center gap-3 p-4 cursor-pointer select-none" onClick={()=>setExpandedId(expanded?null:item.id)}>
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-500/10 ring-1 ring-blue-500/20 flex items-center justify-center overflow-hidden">
                      {item.icon?<span className="text-lg">{item.icon}</span>:<Favicon url={item.url} customImage={item.customImage}/>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-white">{item.title}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ring-1 ${STATUS_STYLE[item.status]||STATUS_STYLE.Active}`}>{item.status}</span>
                      </div>
                    </div>
                    <button
                      onClick={e=>{e.stopPropagation();onToggleBookmark(item.id);}}
                      className={`w-8 h-8 rounded-xl flex items-center justify-center ring-1 transition-all flex-shrink-0 ${activeGroup.btn}`}>
                      <Bookmark className={`w-3.5 h-3.5 ${activeGroup.icon}`}/>
                    </button>
                  </div>
                  {expanded && (
                    <div className="px-4 pb-4 pt-3 border-t border-white/[0.06]">
                      <p className="text-[11px] text-blue-400/50 font-mono mb-3 truncate">🔗 {item.url}</p>
                      {item.description && <p className="text-xs text-white/50 leading-relaxed mb-3">{item.description}</p>}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {(item.tags||[]).map(tag=><TagChip key={tag} tag={tag}/>)}
                        {item.reward && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ring-1 text-blue-300 bg-blue-500/15 ring-blue-500/25">{item.reward}</span>}
                        {item.difficulty && <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ring-1 ${item.difficulty==="Easy"?"bg-green-500/15 text-green-400 ring-green-500/25":item.difficulty==="Hard"?"bg-red-500/15 text-red-400 ring-red-500/25":"bg-yellow-500/15 text-yellow-400 ring-yellow-500/25"}`}>{item.difficulty}</span>}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={()=>window.open(`https://${item.url}`,"_blank","noopener,noreferrer")}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-xs font-bold active:scale-95 transition-all">
                          <ExternalLink className="w-3.5 h-3.5"/> Buka Website
                        </button>
                        <button onClick={()=>copyUrl(item)}
                          className="w-11 h-11 rounded-xl bg-blue-500/10 ring-1 ring-blue-500/20 flex items-center justify-center hover:bg-blue-500/20 transition-all">
                          {copiedId===item.id?<Check className="w-4 h-4 text-green-400"/>:<Copy className="w-4 h-4 text-blue-400/60"/>}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── AIRDROP SCREEN ───────────────────────────────────────────
function AirdropScreen({ airdrops, bookmarks, onToggleBookmark }) {
  const [search, setSearch]         = useState("");
  const [activeTag, setActiveTag]   = useState("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [guideOpenId, setGuideOpenId] = useState(null);
  const [copiedId, setCopiedId]     = useState(null);
  const [burstId, setBurstId]       = useState(null);

  function handleToggleBookmark(id) {
    onToggleBookmark(id);
    setBurstId(id);
    setTimeout(() => setBurstId(null), 450);
  }

  const allTags = useMemo(()=>{
    const t=new Set();
    airdrops.forEach(a=>(a.tags||[]).forEach(tag=>t.add(tag)));
    return ["All",...Array.from(t)];
  },[airdrops]);

  const filtered = useMemo(()=>airdrops.filter(item=>{
    const matchTag = activeTag==="All"||(item.tags||[]).includes(activeTag);
    const q=search.toLowerCase();
    return matchTag&&(!q||item.title.toLowerCase().includes(q)||(item.description||"").toLowerCase().includes(q));
  }),[search,activeTag,airdrops]);

  function copyUrl(item) {
    navigator.clipboard.writeText(`https://${item.url}`).catch(()=>{});
    setCopiedId(item.id);
    setTimeout(()=>setCopiedId(null),2000);
  }

  return (
    <div className="pb-32">
      <div className="px-5 pt-6 mb-4">
        <h1 className="text-lg font-bold text-white">🪂 Airdrop List</h1>
        <p className="text-xs text-white/30 mt-0.5">{airdrops.length} proyek terdaftar</p>
      </div>

      {/* ── STICKY SEARCH BAR ── */}
      <div className="sticky top-[86px] lg:top-[34px] z-30 bg-[#0A0A0A]/90 backdrop-blur-md pb-3 px-5 pt-1 border-b border-white/[0.05]">
        <div className="relative mb-2.5">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400/50 pointer-events-none"/>
          <input type="search" placeholder="Cari airdrop..." value={search} onChange={e=>setSearch(e.target.value)}
            className="w-full bg-blue-500/[0.08] ring-1 ring-blue-500/25 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:ring-blue-400/50 transition-all"/>
        </div>
        <div>
          <button onClick={()=>setFilterOpen(!filterOpen)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ring-1 transition-all ${activeTag!=="All"?"bg-blue-500/20 ring-blue-400/40 text-blue-300":"bg-blue-500/[0.08] ring-blue-500/20 text-white/60"}`}>
            <SlidersHorizontal className="w-3.5 h-3.5"/>
            {activeTag!=="All"?`Filter: ${activeTag}`:"Filter Tag"}
            {filterOpen?<ChevronUp className="w-3.5 h-3.5"/>:<ChevronDown className="w-3.5 h-3.5"/>}
          </button>
          {filterOpen && (
            <div className="mt-2.5 glass-card rounded-2xl p-3 flex flex-wrap gap-2">
              {allTags.map(tag=>(
                <button key={tag} onClick={()=>{setActiveTag(tag);setFilterOpen(false);}}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${activeTag===tag?"bg-blue-500 border-blue-500 text-white":"bg-white/[0.04] border-white/[0.08] text-white/50 hover:text-white/80"}`}>
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="px-5 pt-3">
        <StatusLegend />
        <p className="text-[11px] text-white/25 mb-3">{filtered.length} hasil{activeTag!=="All"&&<> untuk <span className="text-blue-400">{activeTag}</span></>}</p>
        <div className="flex flex-col gap-3">
          {filtered.map(item=>{
            const expanded = expandedId===item.id;
            const bmLevel = bookmarks.get(String(item.id)) || 0;
            return (
              <div key={item.id} className={`card-shimmer rounded-2xl transition-all duration-300 ${expanded?"glass-card-blue":"glass-card hover:border-white/[0.18]"}`}>
                <div className="flex items-center gap-3 p-4 cursor-pointer select-none" onClick={()=>setExpandedId(expanded?null:item.id)}>
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-500/10 ring-1 ring-blue-500/20 flex items-center justify-center overflow-hidden">
                    {item.icon?<span className="text-lg">{item.icon}</span>:<Favicon url={item.url} customImage={item.customImage}/>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-white">{item.title}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ring-1 ${STATUS_STYLE[item.status]||STATUS_STYLE.Active}`}>{item.status}</span>
                    </div>
                  </div>
                  <button
                    onClick={e=>{e.stopPropagation();handleToggleBookmark(item.id);}}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center ring-1 transition-all flex-shrink-0
                      ${bmLevel===0?"bg-white/[0.04] ring-white/[0.08] hover:bg-white/[0.08]":
                        bmLevel===1?"bg-yellow-500/20 ring-yellow-500/40":
                        bmLevel===2?"bg-blue-500/20 ring-blue-500/40":
                        "bg-red-500/20 ring-red-500/40"}`}>
                    <Bookmark className={`w-3.5 h-3.5 transition-all ${burstId===item.id?"bm-burst":""}
                      ${bmLevel===0?"text-white/25":
                        bmLevel===1?"text-yellow-400 fill-yellow-400":
                        bmLevel===2?"text-blue-400 fill-blue-400":
                        "text-red-400 fill-red-400"}`}/>
                  </button>
                </div>
                {expanded && (
                  <div className="px-4 pb-4 pt-3 border-t border-blue-500/[0.12]">
                    <p className="text-[11px] text-blue-400/50 font-mono mb-3 truncate">🔗 {item.url}</p>
                    {item.description && <p className="text-xs text-white/50 leading-relaxed mb-3">{item.description}</p>}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {(item.tags||[]).map(tag=><TagChip key={tag} tag={tag}/>)}
                      {item.reward && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ring-1 text-blue-300 bg-blue-500/15 ring-blue-500/25">{item.reward}</span>}
                      {item.difficulty && <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ring-1 ${item.difficulty==="Easy"?"bg-green-500/15 text-green-400 ring-green-500/25":item.difficulty==="Hard"?"bg-red-500/15 text-red-400 ring-red-500/25":"bg-yellow-500/15 text-yellow-400 ring-yellow-500/25"}`}>{item.difficulty}</span>}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={()=>window.open(`https://${item.url}`,"_blank","noopener,noreferrer")}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-xs font-bold active:scale-95 transition-all">
                        <ExternalLink className="w-3.5 h-3.5"/> Buka Website
                      </button>
                      <button onClick={()=>copyUrl(item)}
                        className="w-11 h-11 rounded-xl bg-blue-500/10 ring-1 ring-blue-500/20 flex items-center justify-center hover:bg-blue-500/20 transition-all">
                        {copiedId===item.id?<Check className="w-4 h-4 text-green-400"/>:<Copy className="w-4 h-4 text-blue-400/60"/>}
                      </button>
                    </div>

                    {/* ── CARA MENGERJAKAN — hanya tampil kalau ada isinya ── */}
                    {item.howToGuide && item.howToGuide.length > 0 && (
                      <div className="mt-3">
                        <button
                          onClick={()=>setGuideOpenId(guideOpenId===item.id?null:item.id)}
                          className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl bg-white/[0.04] ring-1 ring-white/[0.08] hover:bg-white/[0.07] transition-all">
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-3.5 h-3.5 text-blue-400/70"/>
                            <span className="text-xs font-semibold text-white/70">Cara Mengerjakan</span>
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/25">
                              {item.howToGuide.length} langkah
                            </span>
                          </div>
                          {guideOpenId===item.id
                            ? <ChevronUp className="w-3.5 h-3.5 text-white/30 flex-shrink-0"/>
                            : <ChevronDown className="w-3.5 h-3.5 text-white/30 flex-shrink-0"/>}
                        </button>
                        {guideOpenId===item.id && (
                          <div className="mt-2 rounded-xl bg-[#111827]/60 ring-1 ring-blue-500/[0.12] px-3 py-3 flex flex-col gap-2">
                            {item.howToGuide.map((step, idx)=>(
                              <div key={idx} className="flex gap-2.5 items-start">
                                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/20 ring-1 ring-blue-500/30 flex items-center justify-center text-[10px] font-bold text-blue-400 mt-0.5">
                                  {idx+1}
                                </span>
                                <p className="text-xs text-white/60 leading-relaxed">{step}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── DISCOVER SCREEN ──────────────────────────────────────────
function DiscoverScreen({ tools, p2p, calendar, toolBookmarks, onToggleToolBookmark }) {
  const [section, setSection]       = useState("p2p");
  const [expandedItem, setExpandedItem] = useState(null);
  const [copiedToolId, setCopiedToolId] = useState(null);

  function copyToolUrl(tool) {
    navigator.clipboard.writeText(tool.targetUrl || `https://${tool.url}`).catch(()=>{});
    setCopiedToolId(tool.id);
    setTimeout(()=>setCopiedToolId(null), 2000);
  }
  return (
    <div className="pb-32">
      <div className="px-5 pt-6 mb-3">
        <h1 className="text-lg font-bold text-white">🧭 Discover</h1>
        <p className="text-xs text-white/30 mt-0.5">P2P, Kalender, dan Platform Tools</p>
      </div>

      {/* ── STICKY SECTION TABS ── */}
      <div className="sticky top-[86px] lg:top-[34px] z-30 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-white/[0.05] px-5 py-3">
        <div className="flex gap-2 overflow-x-auto" style={{scrollbarWidth:"none"}}>
          {[{id:"p2p",label:"P2P Seller",icon:Users},{id:"calendar",label:"Kalender",icon:Calendar},{id:"tools",label:"Platform & Tools",icon:Lightbulb}].map(({id,label,icon:Icon})=>(
            <button key={id} onClick={()=>setSection(id)}
              className={`flex-none flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold ring-1 transition-all ${section===id?"bg-blue-500 text-white ring-blue-500":"bg-blue-500/[0.08] ring-blue-500/20 text-white/50 hover:text-blue-300"}`}>
              <Icon className="w-3.5 h-3.5"/>{label}
            </button>
          ))}
        </div>
      </div>

      {section==="p2p" && (
        <div className="px-5 flex flex-col gap-3">
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-500/10 ring-1 ring-amber-500/20">
            <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0"/>
            <p className="text-[11px] text-amber-300/80 leading-relaxed">Lakukan transaksi dengan hati-hati. Platform tidak bertanggung jawab atas risiko P2P deal.</p>
          </div>
          {p2p.map(l=>(
            <div key={l.id} className="card-shimmer rounded-2xl glass-card p-4">
              {/* Header — avatar + nama + verified */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-blue-500/15 ring-1 ring-blue-500/20 flex items-center justify-center">
                    <Users className="w-4 h-4 text-blue-400/60"/>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-bold text-white">{l.user}</span>
                      {l.verified && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 ring-1 ring-blue-500/30 font-semibold">✓ Verified</span>
                      )}
                    </div>
                    {/* Payment method badges */}
                    <div className="flex items-center gap-1 mt-1 flex-wrap">
                      {(l.methods||[]).map(m => {
                        if (m === "DANA") return (
                          <span key={m} className="text-[9px] font-black px-1.5 py-0.5 rounded-md text-white"
                            style={{backgroundColor:"#0086E6"}}>DANA</span>
                        );
                        if (m === "GoPay") return (
                          <span key={m} className="text-[9px] font-black px-1.5 py-0.5 rounded-md text-white"
                            style={{backgroundColor:"#00AED6"}}>GoPay</span>
                        );
                        if (m === "OVO") return (
                          <span key={m} className="text-[9px] font-black px-1.5 py-0.5 rounded-md text-white"
                            style={{backgroundColor:"#4C2A86"}}>OVO</span>
                        );
                        if (m === "Bank") return (
                          <span key={m} className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md bg-white/[0.07] text-white/60 ring-1 ring-white/10 flex items-center gap-0.5 inline-flex">
                            <Landmark className="w-2.5 h-2.5"/>Bank
                          </span>
                        );
                        return (
                          <span key={m} className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md bg-white/[0.06] text-white/50 ring-1 ring-white/10">{m}</span>
                        );
                      })}
                    </div>
                  </div>
                </div>
                {/* Contact buttons */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {l.telegram && (
                    <button onClick={()=>window.open(l.telegram,"_blank","noopener,noreferrer")}
                      className="w-8 h-8 rounded-xl flex items-center justify-center ring-1 transition-all active:scale-90"
                      style={{backgroundColor:"rgba(41,182,246,0.12)",ringColor:"rgba(41,182,246,0.25)"}}>
                      <Send className="w-3.5 h-3.5" style={{color:"#29B6F6"}}/>
                    </button>
                  )}
                  {l.whatsapp && (
                    <button onClick={()=>window.open(`https://wa.me/${l.whatsapp}`,"_blank","noopener,noreferrer")}
                      className="w-8 h-8 rounded-xl flex items-center justify-center ring-1 transition-all active:scale-90"
                      style={{backgroundColor:"rgba(37,211,102,0.12)",ringColor:"rgba(37,211,102,0.25)"}}>
                      <Phone className="w-3.5 h-3.5" style={{color:"#25D366"}}/>
                    </button>
                  )}
                </div>
              </div>
              {/* Token info */}
              <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                <div>
                  <p className="text-sm font-bold text-white">{l.selling}</p>
                  <p className="text-[10px] text-white/30 mt-0.5">Min: {l.min}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-blue-400">{l.price}</p>
                  <p className="text-[10px] text-white/30">per token</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {section==="calendar" && (
        <div className="px-5 flex flex-col gap-3">
          <StatusLegend />
          {calendar.map(e=>(
            <div key={e.id} className="rounded-2xl glass-card p-4 flex items-center gap-4">
              <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-blue-500/15 ring-1 ring-blue-500/20 flex flex-col items-center justify-center">
                <span className="text-[9px] text-blue-400/60 uppercase font-bold">{e.date.split(" ")[0]}</span>
                <span className="text-xl font-bold text-white leading-none">{e.date.split(" ")[1]}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{e.title}</p>
                <span className={`text-[10px] px-2 py-0.5 rounded-full mt-1.5 inline-block font-semibold ${e.color}`}>{e.type}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {section==="tools" && (
        <div className="px-5 flex flex-col gap-3">
          {tools.map(tool=>{
            const open      = expandedItem === tool.id;
            const saved     = toolBookmarks && toolBookmarks.has(String(tool.id));
            return (
              <div key={tool.id} className={`card-shimmer rounded-2xl transition-all duration-300 ${open?"glass-card-blue":"glass-card hover:border-white/[0.18]"}`}>
                <div className="flex items-center gap-3 p-4 cursor-pointer select-none" onClick={()=>setExpandedItem(open?null:tool.id)}>
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-500/10 ring-1 ring-blue-500/20 flex items-center justify-center overflow-hidden">
                    <Favicon url={tool.url} customImage={tool.customImage}/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-white">{tool.title}</span>
                      {tool.category && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full ring-1 bg-blue-500/15 text-blue-300 ring-blue-500/25">{tool.category}</span>}
                    </div>
                  </div>
                  <button
                    onClick={e=>{e.stopPropagation();onToggleToolBookmark(tool.id);}}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center ring-1 transition-all flex-shrink-0
                      ${saved?"bg-emerald-500/20 ring-emerald-500/40":"bg-white/[0.04] ring-white/[0.08] hover:bg-white/[0.08]"}`}>
                    <Bookmark className={`w-3.5 h-3.5 transition-all ${saved?"text-emerald-400 fill-emerald-400 bm-burst":"text-white/25"}`}/>
                  </button>
                  <ChevronDown className={`w-4 h-4 text-blue-400/40 flex-shrink-0 transition-transform duration-300 ${open?"rotate-180":""}`}/>
                </div>
                {open && (
                  <div className="px-4 pb-4 pt-3 border-t border-blue-500/[0.12]">
                    <p className="text-[11px] text-blue-400/50 font-mono mb-3 truncate">🔗 {tool.url}</p>
                    {tool.description && <p className="text-xs text-white/50 leading-relaxed mb-3">{tool.description}</p>}
                    <div className="flex gap-2">
                      {tool.targetUrl && (
                        <button onClick={()=>window.open(tool.targetUrl,"_blank","noopener,noreferrer")}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-xs font-bold active:scale-95 transition-all">
                          <ExternalLink className="w-3.5 h-3.5"/> Buka Platform
                        </button>
                      )}
                      <button onClick={()=>copyToolUrl(tool)}
                        className="w-11 h-11 rounded-xl bg-blue-500/10 ring-1 ring-blue-500/20 flex items-center justify-center hover:bg-blue-500/20 transition-all">
                        {copiedToolId===tool.id?<Check className="w-4 h-4 text-green-400"/>:<Copy className="w-4 h-4 text-blue-400/60"/>}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── BOTTOM NAV ───────────────────────────────────────────────
function BottomNav({ active, onSelect }) {
  const [poppedId, setPoppedId] = useState(null);
  const tabs = [
    { id:"intro",    label:"Intro",       icon:Home },
    { id:"info",     label:"Info Terkini",icon:Zap },
    { id:"airdrops", label:"Airdrop",     icon:LayoutGrid },
    { id:"bookmark", label:"Bookmark",    icon:Bookmark },
    { id:"discover", label:"Discover",    icon:Compass },
  ];
  function handleSelect(id) {
    onSelect(id);
    setPoppedId(id);
    setTimeout(() => setPoppedId(null), 400);
  }
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-4 px-3">
      <div className="w-full max-w-lg flex items-center gap-0.5 px-2 py-1.5 rounded-2xl glass-nav shadow-2xl shadow-black/80">
        {tabs.map(({id,label,icon:Icon})=>(
          <button key={id} onClick={()=>handleSelect(id)}
            className={`flex-1 flex flex-col items-center gap-0.5 px-1 py-2 rounded-xl transition-all duration-200 ${active===id?"bg-blue-500 text-white":"text-white/30 hover:text-white/60 hover:bg-white/[0.04]"}`}>
            <Icon className={`w-[18px] h-[18px] ${poppedId===id ? "nav-pop" : ""}`}/>
            <span className="text-[8px] font-bold leading-none">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────
export default function App() {
  const [tab, setTab]           = useState("intro");
  const [airdrops, setAirdrops] = useState(DEF_AIRDROPS);
  const [news, setNews]         = useState(DEF_NEWS);
  const [qinfo, setQinfo]       = useState(DEF_QINFO);
  const [tools, setTools]       = useState(DEF_TOOLS);
  const [p2p, setP2p]           = useState(DEF_P2P);
  const [calendar, setCalendar] = useState(DEF_CALENDAR);
  const [ticker, setTicker]     = useState(DEF_TICKER);
  const [loaded, setLoaded]     = useState(false);

  // ─── TOOL BOOKMARKS on/off (localStorage) ─────────────────
  const [toolBookmarks, setToolBookmarks] = useState(() => {
    try {
      const raw = localStorage.getItem("hw_tool_bookmarks");
      if (!raw) return new Set();
      return new Set(JSON.parse(raw));
    } catch { return new Set(); }
  });

  function toggleToolBookmark(id) {
    setToolBookmarks(prev => {
      const next = new Set(prev);
      const key  = String(id);
      if (next.has(key)) next.delete(key); else next.add(key);
      try { localStorage.setItem("hw_tool_bookmarks", JSON.stringify([...next])); } catch {}
      return next;
    });
  }

  // ─── BOOKMARKS multi-level (localStorage) ─────────────────
  // level 1=kuning, 2=biru, 3=merah, 0/missing=tidak ada
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const raw = localStorage.getItem("hw_bookmarks_v2");
      if (!raw) return new Map();
      const obj = JSON.parse(raw);
      return new Map(Object.entries(obj).map(([k,v])=>[k,Number(v)]).filter(([,v])=>v>0));
    } catch { return new Map(); }
  });

  function toggleBookmark(id) {
    setBookmarks(prev => {
      const next = new Map(prev);
      const key  = String(id);
      const cur  = next.get(key) || 0;
      if (cur >= 3) next.delete(key); else next.set(key, cur + 1);
      try { localStorage.setItem("hw_bookmarks_v2", JSON.stringify(Object.fromEntries(next))); } catch {}
      return next;
    });
  }

  // Load all data from IndexedDB on mount (tapCount/handleLogoTap sudah dihapus bersama admin panel)
  useEffect(() => {
    idbGetAll().then(([a, n, q, t, p, cal, tick]) => {
      if (a)    setAirdrops(a);
      if (n)    setNews(n);
      if (q)    setQinfo(q);
      if (t)    setTools(t);
      if (p)    setP2p(p);
      if (cal)  setCalendar(cal);
      if (tick) setTicker(tick);
      setLoaded(true);
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white relative overflow-x-hidden">

      {/* ── SIDEBAR NAV (desktop ≥ 1024px) ── */}
      <SidebarNav active={tab} onSelect={setTab} />

      {/* ── MAIN COLUMN ── */}
      <div className="lg:ml-56">

        {/* Header logo — mobile only, fixed top-0 */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#0A0A0A] border-b border-white/[0.06]">
          <div className="max-w-lg mx-auto px-5 py-3 flex items-center">
            <div className="flex items-center gap-2 select-none">
              <img src="/logo.jpg" alt="logo" className="w-7 h-7 rounded-lg object-cover ring-1 ring-blue-500/30"/>
              <span className="text-sm font-bold text-white tracking-wide">HUNTER<span className="text-blue-500"> WAVE</span></span>
            </div>
          </div>
        </div>

        {/* Ticker — fixed di semua layar: di bawah header (mobile) atau paling atas (desktop) */}
        <div className="fixed top-[52px] left-0 right-0 lg:top-0 lg:left-56 z-[39]">
          <TickerBanner texts={ticker} />
        </div>

        {/* Loading overlay */}
        {!loaded && (
          <div className="fixed inset-0 z-[300] bg-black flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <img src="/logo.jpg" alt="logo" className="w-12 h-12 rounded-2xl object-cover ring-1 ring-blue-500/40 animate-pulse"/>
              <p className="text-xs text-blue-400/60">Memuat data...</p>
            </div>
          </div>
        )}

        {/* Content — pt untuk offset header(52) + ticker(34) = 86px mobile, ticker(34) desktop */}
        <div className="relative z-10 max-w-xl mx-auto pt-[86px] lg:pt-[34px]">
          {tab==="intro"    && <IntroScreen airdrops={airdrops} calendar={calendar} />}
          {tab==="info"     && <InfoTerkiniScreen news={news} qinfo={qinfo} />}
          {tab==="airdrops" && <AirdropScreen airdrops={airdrops} bookmarks={bookmarks} onToggleBookmark={toggleBookmark} />}
          {tab==="bookmark" && <BookmarkScreen airdrops={airdrops} bookmarks={bookmarks} onToggleBookmark={toggleBookmark} tools={tools} toolBookmarks={toolBookmarks} onToggleToolBookmark={toggleToolBookmark} />}
          {tab==="discover" && <DiscoverScreen tools={tools} p2p={p2p} calendar={calendar} toolBookmarks={toolBookmarks} onToggleToolBookmark={toggleToolBookmark} />}
        </div>

        <BottomNav active={tab} onSelect={setTab} />

      </div>{/* end lg:ml-56 */}

    </div>
  );
}
