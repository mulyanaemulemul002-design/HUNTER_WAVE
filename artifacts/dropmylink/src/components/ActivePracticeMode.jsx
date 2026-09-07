import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  Code2,
  Coins,
  Compass,
  ExternalLink,
  FileCode2,
  Gauge,
  Globe2,
  Info,
  Layers3,
  LockKeyhole,
  MoveRight,
  Network,
  Palette,
  Play,
  Plus,
  RefreshCw,
  Rocket,
  Save,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Tags,
  Target,
  Timer,
  TrendingDown,
  TrendingUp,
  Users,
  WalletCards,
  Waves,
  Zap,
} from "lucide-react";

export const PRACTICE_STORAGE_KEY = "hw_beginner_practice_v1";

const ACCENT_STYLES = {
  blue: {
    icon: "bg-sky-300/10 text-sky-100 ring-sky-200/20",
    line: "bg-sky-200/80",
    eyebrow: "text-sky-100/70",
    button: "bg-sky-200 text-[#08141a] hover:bg-sky-100",
    soft: "border-sky-200/20 bg-sky-200/[0.06]",
    tint: "sky",
  },
  cyan: {
    icon: "bg-cyan-300/10 text-cyan-100 ring-cyan-200/20",
    line: "bg-cyan-200/80",
    eyebrow: "text-cyan-100/70",
    button: "bg-cyan-200 text-[#071315] hover:bg-cyan-100",
    soft: "border-cyan-200/20 bg-cyan-200/[0.06]",
    tint: "cyan",
  },
  amber: {
    icon: "bg-amber-300/10 text-amber-100 ring-amber-200/20",
    line: "bg-amber-200/80",
    eyebrow: "text-amber-100/70",
    button: "bg-amber-200 text-[#171108] hover:bg-amber-100",
    soft: "border-amber-200/20 bg-amber-200/[0.06]",
    tint: "amber",
  },
  violet: {
    icon: "bg-violet-300/10 text-violet-100 ring-violet-200/20",
    line: "bg-violet-200/80",
    eyebrow: "text-violet-100/70",
    button: "bg-violet-200 text-[#100b1b] hover:bg-violet-100",
    soft: "border-violet-200/20 bg-violet-200/[0.06]",
    tint: "violet",
  },
};

export const PRACTICE_CATEGORIES = [
  {
    id: "social-quest-wl",
    index: "01",
    label: "Social Quest / WL",
    shortLabel: "Social / WL",
    title: "Ikuti jejak campaign, bukan hype-nya",
    accent: "blue",
    summary: "Buka papan campaign fiktif dan pelajari bagaimana task, sumber resmi, serta eligibility saling terhubung.",
    explanation: "Mulai dengan membaca brief. Klik kartu di papan untuk melihat bukti yang perlu dicari, lalu tandai apa yang sudah kamu pahami.",
    context: "Whitelist atau eligibility bukan janji alokasi. Selalu periksa domain, tanggal snapshot, aturan multi-akun, dan siapa yang menerbitkan pengumuman.",
    icon: Users,
    actionOptions: [
      { id: "social", label: "Social task", description: "Ikuti kontribusi publik dan simpan bukti yang relevan." },
      { id: "whitelist", label: "Whitelist", description: "Bedakan syarat masuk dari alokasi yang sudah pasti." },
    ],
    fields: [{ key: "campaignName", label: "Nama campaign latihan", placeholder: "Community round", required: true }],
    steps: [
      { id: "source", label: "Sumber resmi dan domain benar" },
      { id: "rules", label: "Aturan, periode, dan syarat dipahami" },
      { id: "risk", label: "Risiko link dan klaim hasil ditandai" },
    ],
  },
  {
    id: "dex-swap",
    index: "02",
    label: "DEX / Swap",
    shortLabel: "DEX / Swap",
    title: "Baca quote sebelum menekan swap",
    accent: "cyan",
    summary: "Jelajahi layar exchange mini: pilih token, bandingkan quote, dan lihat jalur yang akan dipakai.",
    explanation: "Quote adalah informasi yang berubah, bukan janji harga. Perhatikan network, fee, slippage, price impact, dan permission.",
    context: "Angka di layar ini adalah demo. Tidak ada approval, saldo, wallet, atau transaksi yang dikirim.",
    icon: Waves,
    actionOptions: [
      { id: "quote", label: "Baca quote", description: "Bandingkan jumlah masuk, jumlah keluar, fee, dan price impact." },
      { id: "route", label: "Cek route", description: "Lihat jalur swap dan kontrak demo yang akan dipanggil." },
    ],
    fields: [{ key: "pair", label: "Pair yang diamati", placeholder: "TESTA / TESTB", required: true }],
    steps: [
      { id: "network", label: "Aset dan network cocok" },
      { id: "quote", label: "Fee, slippage, impact, dan minimum dibaca" },
      { id: "permission", label: "Permission dibaca sebelum sign" },
    ],
  },
  {
    id: "defi",
    index: "03",
    label: "DeFi",
    shortLabel: "DeFi",
    title: "Masuk ke permukaan DeFi yang berbeda",
    accent: "blue",
    summary: "Pindah tab antara lending, borrowing, liquidity pool, dan supply untuk melihat istilah yang berubah.",
    explanation: "Empat permukaan ini punya input dan risiko berbeda. Klik tab, lihat metriknya, lalu ikuti satu alur demo.",
    context: "APY bukan hasil pasti. Di lab ini tidak ada saldo, bunga, jaminan, lock, atau posisi yang benar-benar bergerak.",
    icon: Layers3,
    actionOptions: [
      { id: "landing", label: "Landing", description: "Kenali halaman protokol dan kontrak yang dirujuk." },
      { id: "borrowing", label: "Borrowing", description: "Baca collateral, health factor, bunga, dan likuidasi." },
      { id: "lp", label: "LP", description: "Bandingkan pair, fee pool, dan impermanent loss." },
      { id: "supply", label: "Supply", description: "Catat aset setoran, lock, dan cara penarikan." },
    ],
    fields: [{ key: "surface", label: "Permukaan yang dipelajari", placeholder: "Lending pool", required: true }],
    steps: [
      { id: "asset", label: "Aset masuk, keluar, atau collateral dikenali" },
      { id: "terms", label: "Bunga, fee, lock, dan impact dibaca" },
      { id: "exit", label: "Kondisi berhenti dan cara keluar ditentukan" },
    ],
  },
  {
    id: "meme-launchpad",
    index: "04",
    label: "Meme Launchpad",
    shortLabel: "Meme Launchpad",
    title: "Lihat apa yang disembunyikan oleh hype",
    accent: "amber",
    summary: "Preview launch token fiktif dengan bonding curve, distribusi, dan liquidity yang bisa kamu bongkar.",
    explanation: "Launchpad membuat token terlihat mudah dibuat. Simulasi ini memperlambat langkah agar tokenomics dan risiko exit terbaca.",
    context: "Meme asset sangat volatil dan popularitas bukan due diligence. Periksa supply, konsentrasi holder, liquidity, dan hak admin.",
    icon: Rocket,
    actionOptions: [
      { id: "launch", label: "Preview launch", description: "Baca parameter token, distribusi, dan mekanisme peluncuran." },
      { id: "trade", label: "Baca market", description: "Amati liquidity, volume, holder concentration, dan risiko exit." },
    ],
    fields: [{ key: "launchpad", label: "Nama launchpad latihan", placeholder: "Launchpad latihan", required: true }],
    steps: [
      { id: "tokenomics", label: "Supply, distribusi, unlock, dan admin dicatat" },
      { id: "liquidity", label: "Sumber dan aturan liquidity diperiksa" },
      { id: "volatility", label: "Skenario terburuk ditulis tanpa hype" },
    ],
  },
  {
    id: "bridge",
    index: "05",
    label: "Bridge",
    shortLabel: "Bridge",
    title: "Ikuti rute aset lintas-network",
    accent: "cyan",
    summary: "Susun perjalanan TEST token dari satu network demo ke network lain dan lihat titik risikonya.",
    explanation: "Bridge menambah lapisan kontrak, validator, liquidity, dan finality. Baca seluruh rute sebelum membayangkan tombol transfer.",
    context: "Tidak ada message lintas-chain atau perpindahan aset. Token pada layar hanyalah representasi demo.",
    icon: Network,
    actionOptions: [
      { id: "route", label: "Baca route", description: "Petakan asal, tujuan, token, fee, dan finalisasi." },
      { id: "message", label: "Baca message", description: "Pahami pesan dan kontrak yang terlibat lintas-network." },
    ],
    fields: [
      { key: "sourceNetwork", label: "Network asal", placeholder: "Sepolia", required: true },
      { key: "destinationNetwork", label: "Network tujuan", placeholder: "Base Sepolia", required: true },
    ],
    steps: [
      { id: "networks", label: "Network asal, tujuan, dan kontrak cocok" },
      { id: "asset", label: "Native, wrapped, atau representasi dikenali" },
      { id: "finality", label: "Fee, waktu tunggu, dan kondisi gagal dicatat" },
    ],
  },
  {
    id: "perps-trading",
    index: "06",
    label: "Perps Trading",
    shortLabel: "Perps",
    title: "Ukur risiko sebelum membuka posisi",
    accent: "amber",
    summary: "Gunakan trade ticket demo untuk melihat hubungan entry, margin, leverage, funding, dan liquidation.",
    explanation: "Perpetual contract dapat memperbesar rugi. Simulasi ini memprioritaskan liquidation price, bukan sensasi entry.",
    context: "Tidak ada saldo, PnL nyata, order, atau posisi yang dibuka. Leverage tinggi bukan shortcut belajar.",
    icon: Gauge,
    actionOptions: [
      { id: "long", label: "Skenario long", description: "Pelajari dampak harga naik dan harga turun." },
      { id: "short", label: "Skenario short", description: "Pelajari dampak harga turun dan harga naik." },
    ],
    fields: [{ key: "market", label: "Market latihan", placeholder: "TEST-PERP", required: true }],
    steps: [
      { id: "margin", label: "Margin, notional, leverage, dan collateral dibedakan" },
      { id: "funding", label: "Funding rate dan fee dibaca" },
      { id: "liquidation", label: "Liquidation price dan batas berhenti ditentukan" },
    ],
  },
  {
    id: "nft",
    index: "07",
    label: "NFT",
    shortLabel: "NFT",
    title: "Lihat collection di balik sebuah gambar",
    accent: "violet",
    summary: "Masuk ke halaman mint collection fiktif, lihat metadata, supply, royalty, dan ownership.",
    explanation: "NFT bukan cuma gambar. Jelajahi preview token lalu bedakan metadata, contract, mint condition, dan marketplace permission.",
    context: "Tidak ada mint, listing, atau token ID yang benar-benar dibuat. Semua artwork dan metadata di sini adalah demo.",
    icon: Palette,
    actionOptions: [
      { id: "mint", label: "Baca mint", description: "Periksa supply, mint price, allowlist, dan fungsi contract." },
      { id: "market", label: "Baca marketplace", description: "Periksa listing, royalty, transfer permission, dan provenance." },
    ],
    fields: [{ key: "collection", label: "Nama collection latihan", placeholder: "Night Lab Objects", required: true }],
    steps: [
      { id: "contract", label: "Contract dan token standard dicocokkan" },
      { id: "metadata", label: "Lokasi dan sifat metadata diperiksa" },
      { id: "ownership", label: "Ownership, royalty, dan permission dipahami" },
    ],
  },
  {
    id: "onchain-interaction",
    index: "08",
    label: "On-chain Interaction",
    shortLabel: "On-chain",
    title: "Terjemahkan klik menjadi contract call",
    accent: "blue",
    summary: "Gunakan console kontrak lokal untuk memilih read/write function, melihat parameter, dan mem-preview receipt.",
    explanation: "DApp biasanya menerjemahkan sebuah klik menjadi calldata. Latih mata untuk membaca target, function, parameter, dan event.",
    context: "Ini hanya transaction brief. Belum ada wallet, RPC, gas, signature, nonce, atau receipt sungguhan.",
    icon: Code2,
    actionOptions: [
      { id: "read", label: "Read function", description: "Bedakan fungsi baca yang tidak mengubah state." },
      { id: "write", label: "Write function", description: "Catat parameter, value, permission, dan state yang berubah." },
    ],
    fields: [{ key: "contractFunction", label: "Contract dan function", placeholder: "0xDEMO · claim()", required: true }],
    steps: [
      { id: "target", label: "Contract address dan network diverifikasi" },
      { id: "parameters", label: "Parameter, value, dan permission dibaca" },
      { id: "receipt", label: "Event dan status receipt dipahami" },
    ],
  },
  {
    id: "smart-contract-activity",
    index: "09",
    label: "Smart Contract Activity",
    shortLabel: "Smart Contract",
    title: "Rakit blueprint contract dari nol",
    accent: "violet",
    summary: "Pilih tipe contract, susun parameter, dan baca preview source tanpa menyentuh compiler atau deployer.",
    explanation: "Contract yang baik dimulai dari scope, state, permission, event, dan test. Preview ini membantu menghubungkan istilah ke bentuknya.",
    context: "Belum ada source yang di-compile, address yang di-deploy, token, peg, atau transaksi nyata.",
    icon: FileCode2,
    actionOptions: [
      { id: "token", label: "Token sederhana", description: "Susun nama, symbol, decimals, dan initial supply." },
      { id: "stablecoin", label: "Stablecoin latihan", description: "Susun mint/burn dengan catatan peg belum ada." },
      { id: "faucet", label: "Faucet testnet", description: "Susun batas claim dan cooldown token latihan." },
    ],
    fields: [
      { key: "contractName", label: "Nama contract", placeholder: "NightLab Token", required: true },
      { key: "symbol", label: "Symbol", placeholder: "NLT", required: true },
      { key: "initialSupply", label: "Initial supply", placeholder: "1000000", required: true },
    ],
    steps: [
      { id: "scope", label: "Fungsi dan caller contract ditentukan" },
      { id: "state", label: "State, supply, event, dan admin dicatat" },
      { id: "tests", label: "Skenario test disiapkan sebelum deploy" },
    ],
  },
  {
    id: "rwa-special-type",
    index: "10",
    label: "RWA Special Type",
    shortLabel: "RWA",
    title: "Verifikasi hak di balik token RWA",
    accent: "amber",
    summary: "Buka data room aset dunia nyata fiktif dan periksa issuer, custodian, legal wrapper, serta redemption.",
    explanation: "Tokenisasi tidak otomatis berarti kepemilikan legal. Ikuti dokumen dan pihak yang bertanggung jawab sebelum melihat tokennya.",
    context: "Semua issuer, dokumen, dan angka di sini adalah demo. Jangan membuat klaim aset tanpa bukti yang bisa diverifikasi.",
    icon: ScanLine,
    actionOptions: [
      { id: "treasury", label: "Treasury", description: "Baca issuer, reserve, attestation, dan hak redemption." },
      { id: "real-estate", label: "Real estate", description: "Baca wrapper legal, SPV, ownership, dan batas transfer." },
      { id: "commodity", label: "Commodity", description: "Baca custody, audit, serialisasi, dan klaim." },
    ],
    fields: [{ key: "assetTheme", label: "Tema aset latihan", placeholder: "Treasury bill latihan", required: true }],
    steps: [
      { id: "issuer", label: "Issuer, custodian, dan penanggung jawab dikenali" },
      { id: "rights", label: "Hak token holder dan batas transfer dibaca" },
      { id: "evidence", label: "Reserve, wrapper legal, audit, dan redemption dicari" },
    ],
  },
];

function getDefaultCategoryState(category) {
  return {
    platform: "",
    action: category.actionOptions[0].id,
    inputs: Object.fromEntries(category.fields.map((field) => [field.key, ""])),
    steps: Object.fromEntries(category.steps.map((step) => [step.id, false])),
    simulator: {},
    notes: "",
    completed: false,
    updatedAt: 0,
  };
}

function normalizePracticeState(raw) {
  const empty = { version: 1, activeCategoryId: PRACTICE_CATEGORIES[0].id, categories: {} };
  if (!raw || typeof raw !== "object") return empty;
  const categories = Object.fromEntries(PRACTICE_CATEGORIES.map((category) => {
    const defaults = getDefaultCategoryState(category);
    const saved = raw.categories?.[category.id];
    if (!saved || typeof saved !== "object") return [category.id, defaults];
    return [category.id, {
      ...defaults,
      platform: typeof saved.platform === "string" ? saved.platform : "",
      action: category.actionOptions.some((option) => option.id === saved.action) ? saved.action : defaults.action,
      inputs: Object.fromEntries(category.fields.map((field) => [field.key, typeof saved.inputs?.[field.key] === "string" ? saved.inputs[field.key] : ""])),
      steps: Object.fromEntries(category.steps.map((step) => [step.id, saved.steps?.[step.id] === true])),
      simulator: saved.simulator && typeof saved.simulator === "object" ? saved.simulator : {},
      notes: typeof saved.notes === "string" ? saved.notes : "",
      completed: saved.completed === true,
      updatedAt: Number.isFinite(saved.updatedAt) ? saved.updatedAt : 0,
    }];
  }));
  return {
    version: 1,
    activeCategoryId: PRACTICE_CATEGORIES.some((category) => category.id === raw.activeCategoryId) ? raw.activeCategoryId : empty.activeCategoryId,
    categories,
  };
}

export function readPracticeState(storage = window.localStorage) {
  try {
    const saved = storage.getItem(PRACTICE_STORAGE_KEY);
    return normalizePracticeState(saved ? JSON.parse(saved) : null);
  } catch {
    return normalizePracticeState(null);
  }
}

function PracticeCategoryRow({ category, active, completed, unlocked, onSelect }) {
  const style = ACCENT_STYLES[category.accent];
  const Icon = category.icon;
  return (
    <button
      type="button"
      onClick={() => unlocked && onSelect(category.id)}
      disabled={!unlocked}
      aria-current={active ? "step" : undefined}
      aria-disabled={!unlocked}
      data-testid={`button-practice-category-${category.id}`}
      className={`flex min-h-14 w-full items-center gap-3 border-b border-white/[0.07] px-3 py-3 text-left transition last:border-b-0 ${active ? "bg-white/[0.07]" : unlocked ? "hover:bg-white/[0.04]" : "cursor-not-allowed opacity-35"}`}
    >
      <span className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-[10px] font-black ring-1 ${style.icon}`}>
        {completed ? <Check className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-white/35">{category.index}</span>
        <span className={`mt-0.5 block truncate text-xs font-semibold ${active ? "text-white" : "text-white/65"}`}>{category.label}</span>
      </span>
      {!unlocked && <LockKeyhole className="h-3.5 w-3.5 flex-shrink-0 text-white/25" />}
      {completed && <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-emerald-300/75" />}
    </button>
  );
}

function DemoPill({ children, tone = "sky" }) {
  const tones = {
    sky: "border-sky-200/20 bg-sky-200/10 text-sky-100/75",
    cyan: "border-cyan-200/20 bg-cyan-200/10 text-cyan-100/75",
    amber: "border-amber-200/20 bg-amber-200/10 text-amber-100/75",
    violet: "border-violet-200/20 bg-violet-200/10 text-violet-100/75",
    green: "border-emerald-200/20 bg-emerald-200/10 text-emerald-100/75",
  };
  return <span className={`inline-flex items-center rounded-full border px-2 py-1 text-[9px] font-bold uppercase tracking-[0.14em] ${tones[tone]}`}>{children}</span>;
}

function SimButton({ children, onClick, active = false, tone = "sky", testId, icon: Icon = Play }) {
  const toneClasses = {
    sky: "border-sky-200/20 text-sky-100 hover:bg-sky-200/10",
    cyan: "border-cyan-200/20 text-cyan-100 hover:bg-cyan-200/10",
    amber: "border-amber-200/20 text-amber-100 hover:bg-amber-200/10",
    violet: "border-violet-200/20 text-violet-100 hover:bg-violet-200/10",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={testId}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border px-3 text-[11px] font-bold transition ${toneClasses[tone]} ${active ? "bg-white/[0.12] ring-1 ring-white/15" : "bg-black/10"}`}
    >
      <Icon className="h-3.5 w-3.5" /> {children}
    </button>
  );
}

function WindowBar({ category, children }) {
  const style = ACCENT_STYLES[category.accent];
  return (
    <div className={`overflow-hidden rounded-2xl border border-white/[0.11] bg-[#0d141d] practice-window ${category.id === "social-quest-wl" ? "practice-grid" : ""}`}>
      <div className="flex items-center justify-between border-b border-white/[0.08] bg-black/20 px-3 py-2.5">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${style.line}`} />
          <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/45">HUNTER LAB / {category.shortLabel}</span>
        </div>
        <DemoPill tone={style.tint}>DEMO · TEST</DemoPill>
      </div>
      {children}
    </div>
  );
}

function SimHeader({ eyebrow, title, detail, icon: Icon = Sparkles, tone = "sky" }) {
  const toneStyles = {
    sky: "text-sky-100/60 border-sky-200/20 bg-sky-200/10 text-sky-100/75",
    cyan: "text-cyan-100/60 border-cyan-200/20 bg-cyan-200/10 text-cyan-100/75",
    amber: "text-amber-100/60 border-amber-200/20 bg-amber-200/10 text-amber-100/75",
    violet: "text-violet-100/60 border-violet-200/20 bg-violet-200/10 text-violet-100/75",
  };
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className={`text-[9px] font-bold uppercase tracking-[0.18em] ${toneStyles[tone].split(" ")[0]}`}>{eyebrow}</p>
        <h4 className="mt-1.5 text-xl font-black tracking-[-0.04em] text-white sm:text-2xl">{title}</h4>
        {detail && <p className="mt-1.5 max-w-xl text-xs leading-5 text-white/45">{detail}</p>}
      </div>
      <span className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border ${toneStyles[tone].split(" ").slice(1).join(" ")}`}>
        <Icon className="h-4 w-4" />
      </span>
    </div>
  );
}

function SocialSimulator({ data, interact }) {
  const selected = data.simulator?.selectedCard || "source";
  const cards = [
    { id: "source", label: "Official source", title: "Read the announcement", meta: "astradrop.example / announcements", icon: Globe2, body: "The project domain, author, and publish date should agree before you follow a task." },
    { id: "rules", label: "Eligibility", title: "Understand the rules", meta: "Snapshot · 24 MAY 2025", icon: ClipboardIcon, body: "A task can make you eligible to be reviewed. It never proves an allocation." },
    { id: "risk", label: "Safety check", title: "Spot the red flags", meta: "No seed phrase required", icon: ShieldCheck, body: "Unknown links, urgency, and requests for secrets are reasons to stop." },
  ];
  return (
    <WindowBar category={PRACTICE_CATEGORIES[0]}>
      <div className="p-4 sm:p-6">
        <SimHeader eyebrow="ASTRADROP COMMUNITY BOARD" title="A campaign is a trail of evidence." detail="Follow the three cards from source to safety. Each click reveals one word you will meet in a real campaign." icon={Users} />
        <div className="mt-5 grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-xl border border-sky-200/15 bg-sky-200/[0.05] p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-200/15 text-sky-100"><Users className="h-4 w-4" /></span><div><p className="text-xs font-bold text-white/85">AstraDrop</p><p className="text-[10px] text-white/35">Community round · TEST</p></div></div>
              <DemoPill>FICTIONAL</DemoPill>
            </div>
            <p className="mt-5 text-sm leading-6 text-white/70">“Contribute in public. Verify in private.”</p>
            <div className="mt-5 grid grid-cols-3 gap-2 border-t border-white/[0.08] pt-3">
              <Stat label="Snapshot" value="24 MAY" /><Stat label="Tasks" value="03" /><Stat label="Status" value="Open" />
            </div>
          </div>
          <div className="grid gap-2">
            {cards.map((card) => {
              const Icon = card.icon;
              const open = selected === card.id;
               return (
                <button type="button" key={card.id} onClick={() => interact("selectedCard", [card.id === "source" ? "source" : card.id === "rules" ? "rules" : "risk"], card.id)} data-testid={`button-practice-social-${card.id}`} className={`rounded-xl border p-3 text-left transition ${open ? "border-sky-200/30 bg-sky-200/[0.10]" : "border-white/[0.09] bg-black/10 hover:bg-white/[0.04]"}`}>
                  <div className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06] text-sky-100/80"><Icon className="h-4 w-4" /></span><span className="min-w-0 flex-1"><span className="block text-[9px] font-bold uppercase tracking-[0.14em] text-white/35">{card.label}</span><span className="mt-1 block text-xs font-semibold text-white/75">{card.title}</span></span><ChevronDown className={`h-3.5 w-3.5 text-white/30 transition-transform ${open ? "rotate-180" : ""}`} /></div>
                  {open && <p className="mt-3 border-t border-white/[0.08] pt-3 text-[11px] leading-5 text-white/50">{card.meta} — {card.body}</p>}
                </button>
              );
            })}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-[10px] text-white/35"><BadgeCheck className="h-3.5 w-3.5 text-emerald-200/70" /> Click each card to build your source trail <MoveRight className="h-3 w-3 opacity-40" /> no points, no guaranteed WL</div>
      </div>
    </WindowBar>
  );
}

function Stat({ label, value }) {
  return <div><p className="text-[9px] uppercase tracking-[0.12em] text-white/30">{label}</p><p className="mt-1 text-xs font-bold text-white/75">{value}</p></div>;
}

function ClipboardIcon(props) {
  return <Tags {...props} />;
}

function DexSimulator({ data, interact }) {
  const quoted = data.simulator?.quoted;
  const route = data.simulator?.route;
  return (
    <WindowBar category={PRACTICE_CATEGORIES[1]}>
      <div className="p-4 sm:p-6">
        <SimHeader eyebrow="NOVASWAP / SWAP" title="Preview a quote, not a promise." detail="The large button is deliberately a preview. Read what sits around it: network, route, impact, and minimum received." icon={Waves} tone="cyan" />
        <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_0.85fr]">
          <div className="rounded-xl border border-cyan-200/15 bg-cyan-200/[0.04] p-3">
            <div className="flex items-center justify-between px-1 pb-2"><span className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/35">You pay</span><span className="text-[10px] text-white/35">Balance 4,200.00 TESTA</span></div>
            <TokenInput token="TESTA" amount="125.00" />
            <div className="relative z-10 -my-2 flex justify-center"><button type="button" onClick={() => interact("flipped", [], !data.simulator?.flipped)} data-testid="button-practice-swap-flip" className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-200/25 bg-[#111a22] text-cyan-100 transition hover:rotate-180"><RefreshCw className="h-3.5 w-3.5" /></button></div>
            <div className="flex items-center justify-between px-1 pb-2 pt-2"><span className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/35">You receive</span><span className="text-[10px] text-white/35">Minimum changes with slippage</span></div>
            <TokenInput token="TESTB" amount={quoted ? "248.36" : "—"} />
            <div className="mt-3 grid grid-cols-2 gap-2"><MiniMetric label="Network" value="TESTNET DEMO" /><MiniMetric label="Route" value={route ? "2 hops" : "Not checked"} /></div>
            <SimButton tone="cyan" onClick={() => interact("quoted", ["network", "quote"])} testId="button-practice-swap-quote" icon={Zap}>{quoted ? "Quote refreshed" : "Generate demo quote"}</SimButton>
          </div>
          <div className="space-y-2">
            <QuoteRow label="Rate" value="1 TESTA = 1.9869 TESTB" />
            <QuoteRow label="LP fee" value="0.30% · 0.38 TESTA" />
            <QuoteRow label="Price impact" value={quoted ? "0.42% · low" : "Tap quote to reveal"} accent />
            <QuoteRow label="Slippage tolerance" value="0.50%" />
            <QuoteRow label="Minimum received" value={quoted ? "247.12 TESTB" : "—"} />
            <div className="rounded-xl border border-amber-200/15 bg-amber-200/[0.05] p-3"><div className="flex gap-2"><Info className="h-3.5 w-3.5 flex-shrink-0 text-amber-100/75" /><p className="text-[11px] leading-5 text-amber-50/60">Approval is a separate permission step. It is not the swap itself.</p></div></div>
            <SimButton tone="cyan" onClick={() => interact("route", ["permission"])} testId="button-practice-swap-route" icon={Compass}>{route ? "Route inspected" : "Inspect route"}</SimButton>
          </div>
        </div>
        {route && <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl border border-cyan-200/15 bg-cyan-200/[0.04] p-3 text-[11px] text-white/60"><span className="rounded-lg bg-white/[0.07] px-2 py-1 font-mono">TESTA</span><MoveRight className="h-3.5 w-3.5 text-cyan-100/60" /><span className="rounded-lg bg-white/[0.07] px-2 py-1 font-mono">DemoPool 0x7A…21</span><MoveRight className="h-3.5 w-3.5 text-cyan-100/60" /><span className="rounded-lg bg-white/[0.07] px-2 py-1 font-mono">TESTB</span><span className="ml-auto text-[10px] text-cyan-100/65">2 hops · TEST</span></div>}
      </div>
    </WindowBar>
  );
}

function TokenInput({ token, amount }) {
  return <div className="flex items-center gap-3 rounded-xl border border-white/[0.09] bg-[#0a1118] p-3"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-200/15 text-[10px] font-black text-cyan-100">{token.slice(-1)}</div><div className="min-w-0 flex-1"><p className="text-[9px] uppercase tracking-[0.14em] text-white/30">Token · TEST</p><p className="mt-0.5 text-sm font-bold text-white/85">{token}</p></div><p className="text-lg font-black tracking-[-0.04em] text-white/85">{amount}</p></div>;
}

function MiniMetric({ label, value }) {
  return <div className="rounded-lg border border-white/[0.07] bg-white/[0.025] p-2"><p className="text-[9px] uppercase tracking-[0.12em] text-white/30">{label}</p><p className="mt-1 truncate text-[10px] font-bold text-white/65">{value}</p></div>;
}

function QuoteRow({ label, value, accent = false }) {
  return <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] py-2.5 text-[11px]"><span className="text-white/40">{label}</span><span className={accent ? "font-bold text-amber-100/75" : "text-white/70"}>{value}</span></div>;
}

function DefiSimulator({ data, interact }) {
  const active = data.simulator?.tab || data.action || "landing";
  const surfaces = {
    landing: { title: "Protocol overview", desc: "Read the map before picking a surface.", stat: "TVL · $8.42M DEMO", cta: "Open protocol map", icon: Layers3 },
    borrowing: { title: "Borrow against collateral", desc: "Health factor tells you how close a position is to liquidation.", stat: "Health factor · 1.84", cta: "Preview borrow terms", icon: Gauge },
    lp: { title: "Provide liquidity", desc: "Two assets enter a pool; fees come with impermanent loss risk.", stat: "Pool fee · 0.30%", cta: "Preview LP position", icon: Waves },
    supply: { title: "Supply to earn", desc: "Depositing is one action; understanding withdrawal is another.", stat: "Supply APY · 4.72%", cta: "Preview supply", icon: Coins },
  };
  const surface = surfaces[active];
  return (
    <WindowBar category={PRACTICE_CATEGORIES[2]}>
      <div className="p-4 sm:p-6">
        <SimHeader eyebrow="NOVA FINANCE · DEFI DESK" title="One protocol, four different decisions." detail="Switch surfaces and watch the vocabulary change. Every number is a TEST/DEMO value." icon={Layers3} />
        <div className="mt-5 flex gap-1 overflow-x-auto rounded-xl border border-white/[0.08] bg-black/15 p-1">
          {Object.keys(surfaces).map((key) => <button type="button" key={key} onClick={() => interact("tab", key === "landing" ? ["asset"] : ["asset", "terms"], key)} data-testid={`button-practice-defi-tab-${key}`} className={`min-h-10 flex-1 whitespace-nowrap rounded-lg px-3 text-[10px] font-bold uppercase tracking-[0.12em] transition ${active === key ? "bg-sky-200/15 text-sky-100" : "text-white/35 hover:text-white/65"}`}>{key}</button>)}
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_0.78fr]">
          <div className="rounded-xl border border-sky-200/15 bg-sky-200/[0.04] p-4">
            <div className="flex items-start justify-between gap-3"><div><p className="text-[9px] font-bold uppercase tracking-[0.16em] text-sky-100/55">SURFACE · {active.toUpperCase()}</p><h5 className="mt-2 text-lg font-bold text-white/90">{surface.title}</h5><p className="mt-2 max-w-md text-xs leading-5 text-white/50">{surface.desc}</p></div><surface.icon className="h-5 w-5 text-sky-100/70" /></div>
            <div className="mt-6 flex items-end justify-between border-t border-white/[0.08] pt-4"><div><p className="text-[9px] uppercase tracking-[0.13em] text-white/30">Live metric · fake</p><p className="mt-1 text-xl font-black text-white/85">{surface.stat}</p></div><DemoPill>TEST</DemoPill></div>
             <SimButton onClick={() => interact("opened", active === "landing" ? ["asset"] : ["asset", "terms"])} testId={`button-practice-defi-open-${active}`} icon={surface.icon}>{surface.cta}</SimButton>
             <SimButton onClick={() => interact("exitReviewed", ["exit"])} testId="button-practice-defi-exit" icon={ArrowLeft}>Review exit path</SimButton>
          </div>
          <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
            <InfoTile icon={WalletCards} title="Asset" value={active === "lp" ? "TESTA + TESTB" : "TEST USD"} />
            <InfoTile icon={TrendingDown} title="Risk lens" value={active === "borrowing" ? "Liquidation" : active === "lp" ? "Impermanent loss" : "Smart contract"} />
            <InfoTile icon={Timer} title="Exit" value={active === "supply" ? "Anytime · demo" : "Read terms first"} />
          </div>
        </div>
      </div>
    </WindowBar>
  );
}

function InfoTile({ icon: Icon, title, value }) {
  return <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-black/10 p-3"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06] text-sky-100/70"><Icon className="h-3.5 w-3.5" /></span><div><p className="text-[9px] uppercase tracking-[0.12em] text-white/30">{title}</p><p className="mt-1 text-xs font-semibold text-white/65">{value}</p></div></div>;
}

function MemeSimulator({ data, interact }) {
  const launched = data.simulator?.preview;
  return (
    <WindowBar category={PRACTICE_CATEGORIES[3]}>
      <div className="p-4 sm:p-6">
        <SimHeader eyebrow="LAUNCHPAD / MEME LAB" title="The launch is easy. The questions are not." detail="Read the launch preview like a risk dashboard: supply, curve, holders, and liquidity." icon={Rocket} tone="amber" />
        <div className="mt-5 grid gap-4 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="relative overflow-hidden rounded-xl border border-amber-200/20 bg-[#19130d] p-5"><div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-amber-200/10 blur-2xl" /><div className="relative"><DemoPill tone="amber">FICTIONAL TOKEN</DemoPill><div className="mt-8 flex h-20 w-20 items-center justify-center rounded-2xl border border-amber-200/25 bg-amber-200/10 text-3xl font-black text-amber-100">NL</div><h5 className="mt-4 text-2xl font-black tracking-[-0.05em] text-white">NIGHT LEMUR</h5><p className="mt-1 font-mono text-xs text-amber-100/60">$NLEM · TEST</p><button type="button" onClick={() => interact("preview", ["tokenomics", "liquidity"])} data-testid="button-practice-meme-preview" className="mt-6 inline-flex min-h-10 items-center gap-2 rounded-lg bg-amber-200 px-3 text-[11px] font-bold text-[#211507] transition hover:bg-amber-100"><Rocket className="h-3.5 w-3.5" />{launched ? "Preview refreshed" : "Preview launch"}</button></div></div>
          <div className="rounded-xl border border-white/[0.09] bg-black/15 p-4"><div className="flex items-center justify-between"><p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/35">Launch parameters</p><span className="text-[10px] text-amber-100/60">BONDING CURVE</span></div><div className="mt-5 h-24 rounded-lg border border-amber-200/10 bg-amber-200/[0.04] p-2"><div className="flex h-full items-end gap-1">{[22, 28, 34, 42, 48, 58, 70, 84, 93].map((height, index) => <div key={height} className="flex-1 rounded-t-sm bg-amber-200/50" style={{ height: `${height}%`, opacity: 0.4 + index / 16 }} />)}</div></div><div className="mt-4 grid grid-cols-2 gap-2"><MiniMetric label="Total supply" value="1,000,000 NLEM" /><MiniMetric label="Curve reserve" value="2.40 TEST" /><MiniMetric label="Top holders" value="41.8% · watch" /><MiniMetric label="Liquidity lock" value={launched ? "Preview only" : "Unknown"} /></div><div className="mt-4 rounded-lg border border-amber-200/15 bg-amber-200/[0.05] p-3 text-[11px] leading-5 text-amber-50/60">A rising curve is not proof of demand. Ask who can mint, remove liquidity, or change fees.</div><SimButton tone="amber" onClick={() => interact("market", ["volatility"])} testId="button-practice-meme-market" icon={BarChart3}>{data.simulator?.market ? "Market inspected" : "Inspect market risk"}</SimButton></div>
        </div>
      </div>
    </WindowBar>
  );
}

function BridgeSimulator({ data, interact }) {
  const inspected = data.simulator?.route;
  return (
    <WindowBar category={PRACTICE_CATEGORIES[4]}>
      <div className="p-4 sm:p-6">
        <SimHeader eyebrow="PORTAL BRIDGE / ROUTE PLANNER" title="Follow the message across two worlds." detail="A bridge is not a teleport button. Read where the asset starts, what is locked, and what appears at the destination." icon={Network} tone="cyan" />
        <div className="mt-6 grid gap-3 md:grid-cols-[1fr_auto_1fr] md:items-center">
          <NetworkCard label="SOURCE" network="Sepolia · TEST" token="TEST USD" value="250.00" icon={Globe2} />
          <div className="flex items-center justify-center gap-2 text-cyan-100/70 md:flex-col"><span className="h-px w-10 bg-cyan-200/30 md:h-10 md:w-px" /><button type="button" onClick={() => interact("route", ["networks", "asset"])} data-testid="button-practice-bridge-route" className="flex h-9 w-9 items-center justify-center rounded-full border border-cyan-200/25 bg-cyan-200/10 transition hover:scale-105"><MoveRight className="h-4 w-4 md:rotate-90" /></button><span className="h-px w-10 bg-cyan-200/30 md:h-10 md:w-px" /></div>
          <NetworkCard label="DESTINATION" network="Base Sepolia · TEST" token="TEST USD.e" value={inspected ? "249.40" : "—"} icon={Compass} />
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-3"><MiniMetric label="Bridge fee" value="0.60 TEST USD" /><MiniMetric label="Est. finality" value="~4 min · demo" /><MiniMetric label="Representation" value="Wrapped / .e" /></div>
        {inspected && <div className="mt-4 flex items-start gap-2 rounded-xl border border-cyan-200/15 bg-cyan-200/[0.05] p-3 text-[11px] leading-5 text-cyan-50/65"><BadgeCheck className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" /> Source lock → validator message → destination mint. If a step is delayed, the asset may be pending, not gone.</div>}
        <div className="mt-4 flex flex-wrap gap-2"><SimButton tone="cyan" onClick={() => interact("message", ["finality"])} testId="button-practice-bridge-message" icon={Code2}>{data.simulator?.message ? "Message inspected" : "Inspect cross-network message"}</SimButton></div>
      </div>
    </WindowBar>
  );
}

function NetworkCard({ label, network, token, value, icon: Icon }) {
  return <div className="rounded-xl border border-cyan-200/15 bg-cyan-200/[0.04] p-4"><div className="flex items-center justify-between"><span className="text-[9px] font-bold uppercase tracking-[0.16em] text-cyan-100/55">{label}</span><Icon className="h-4 w-4 text-cyan-100/60" /></div><p className="mt-4 text-sm font-bold text-white/85">{network}</p><div className="mt-4 flex items-center justify-between rounded-lg border border-white/[0.08] bg-black/15 p-2.5"><span className="text-[11px] text-white/55">{token}</span><span className="text-sm font-black text-white/80">{value}</span></div></div>;
}

function PerpsSimulator({ data, interact }) {
  const side = data.simulator?.side || data.action || "long";
  const entered = data.simulator?.entered;
  return (
    <WindowBar category={PRACTICE_CATEGORIES[5]}>
      <div className="p-4 sm:p-6">
        <SimHeader eyebrow="NIGHTFALL PERPS / TRADE TICKET" title="Liquidation is part of the order." detail="Toggle long or short, then read the margin and liquidation panel before previewing entry." icon={Gauge} tone="amber" />
        <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_0.92fr]">
          <div className="rounded-xl border border-amber-200/15 bg-amber-200/[0.04] p-4"><div className="flex items-center justify-between"><div><p className="text-[9px] uppercase tracking-[0.16em] text-white/35">MARKET · TEST-PERP</p><p className="mt-1 text-2xl font-black text-white/90">$2,481.20</p></div><span className="flex items-center gap-1 text-xs font-bold text-emerald-200/75"><TrendingUp className="h-3.5 w-3.5" /> +2.14%</span></div><div className="mt-6 flex h-20 items-end gap-1 border-b border-white/[0.08]">{[28,42,38,52,45,64,57,76,69,88,74,94].map((height, index) => <div key={height + index} className="flex-1 rounded-t-sm bg-amber-200/45" style={{ height: `${height}%` }} />)}</div><div className="mt-4 flex gap-2"><button type="button" onClick={() => interact("side", ["margin"], "long")} data-testid="button-practice-perps-long" className={`min-h-10 flex-1 rounded-lg border text-[11px] font-bold transition ${side === "long" ? "border-emerald-200/30 bg-emerald-200/15 text-emerald-100" : "border-white/[0.1] text-white/40"}`}>Long / Buy</button><button type="button" onClick={() => interact("side", ["margin"], "short")} data-testid="button-practice-perps-short" className={`min-h-10 flex-1 rounded-lg border text-[11px] font-bold transition ${side === "short" ? "border-rose-200/30 bg-rose-200/15 text-rose-100" : "border-white/[0.1] text-white/40"}`}>Short / Sell</button></div></div>
          <div className="rounded-xl border border-white/[0.09] bg-black/15 p-4"><div className="flex items-center justify-between"><p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/35">Position preview</p><DemoPill tone="amber">{side.toUpperCase()}</DemoPill></div><div className="mt-4 grid gap-2"><QuoteRow label="Entry / mark" value="$2,481.20" /><QuoteRow label="Margin" value="50.00 TEST" /><QuoteRow label="Leverage" value="5×" /><QuoteRow label="Notional" value="250.00 TEST" /><QuoteRow label="Funding" value="+0.012% / 8h" /></div><div className="mt-4 rounded-lg border border-rose-200/20 bg-rose-200/[0.06] p-3"><div className="flex items-center gap-2 text-rose-100/80"><TrendingDown className="h-3.5 w-3.5" /><p className="text-[10px] font-bold uppercase tracking-[0.12em]">Liquidation price</p></div><p className="mt-1 text-lg font-black text-white/85">{side === "long" ? "$2,009.77" : "$2,952.63"}</p><p className="mt-1 text-[10px] leading-4 text-white/40">Demo estimate — isolated margin</p></div><SimButton tone="amber" onClick={() => interact("entered", ["funding", "liquidation"])} testId="button-practice-perps-preview" icon={Gauge}>{entered ? "Risk review complete" : "Preview risk review"}</SimButton></div>
        </div>
      </div>
    </WindowBar>
  );
}

function NftSimulator({ data, interact }) {
  const minted = Number(data.simulator?.minted || 0);
  return (
    <WindowBar category={PRACTICE_CATEGORIES[6]}>
      <div className="p-4 sm:p-6">
        <SimHeader eyebrow="NIGHT LAB OBJECTS / COLLECTION" title="A mint screen is also a contract screen." detail="Preview the collection, open the metadata card, and see how a token ID would be assigned — locally only." icon={Palette} tone="violet" />
        <div className="mt-5 grid gap-4 lg:grid-cols-[0.78fr_1fr]">
          <div className="rounded-xl border border-violet-200/20 bg-gradient-to-br from-violet-300/15 via-sky-300/10 to-amber-200/10 p-3"><div className="flex aspect-square items-center justify-center rounded-lg border border-white/15 bg-[#1d2032]"><div className="relative h-36 w-36 rounded-[34%] border border-violet-100/30 bg-gradient-to-br from-violet-200/40 via-sky-100/20 to-amber-100/30 shadow-2xl"><span className="absolute left-8 top-7 h-8 w-8 rounded-full bg-[#0c121c]/80" /><span className="absolute right-8 top-7 h-8 w-8 rounded-full bg-[#0c121c]/80" /><span className="absolute bottom-8 left-1/2 h-2 w-14 -translate-x-1/2 rounded-full bg-violet-100/55" /></div></div><div className="flex items-center justify-between px-1 pt-3"><div><p className="text-sm font-bold text-white/85">Object #031</p><p className="text-[10px] text-violet-100/60">Night Lab Objects · TEST</p></div><DemoPill tone="violet">ERC-721</DemoPill></div></div>
          <div className="rounded-xl border border-white/[0.09] bg-black/15 p-4"><div className="flex items-center justify-between"><div><p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/35">MINT PREVIEW</p><p className="mt-1 text-lg font-black text-white/85">0.015 TEST ETH</p></div><p className="text-[10px] text-white/35">0 / 333 claimed</p></div><div className="mt-5 grid grid-cols-2 gap-2"><InfoTile icon={Tags} title="Metadata" value="ipfs://demo…" /><InfoTile icon={ShieldCheck} title="Royalty" value="3.5% · stated" /><InfoTile icon={WalletCards} title="Owner" value={minted ? "Local learner" : "Not assigned"} /><InfoTile icon={ExternalLink} title="Provenance" value="View contract" /></div><div className="mt-4 rounded-lg border border-violet-200/15 bg-violet-200/[0.05] p-3 text-[11px] leading-5 text-violet-50/60">A mint would create a token ID and ownership record. Here it only advances a local preview counter.</div><SimButton tone="violet" onClick={() => interact("minted", ["contract", "ownership"])} testId="button-practice-nft-mint" icon={Plus}>{minted ? `Preview token #${31 + minted}` : "Preview local mint"}</SimButton><SimButton tone="violet" onClick={() => interact("metadata", ["metadata"])} testId="button-practice-nft-metadata" icon={ScanLine}>Inspect metadata</SimButton></div>
        </div>
      </div>
    </WindowBar>
  );
}

function OnchainSimulator({ data, interact }) {
  const mode = data.simulator?.mode || data.action || "read";
  const previewed = data.simulator?.preview;
  return (
    <WindowBar category={PRACTICE_CATEGORIES[7]}>
      <div className="p-4 sm:p-6">
        <SimHeader eyebrow="CONTRACT CONSOLE / DEMO" title="Turn an action into a transaction brief." detail="Read target, function, parameters, and expected event in order. The console never signs or broadcasts." icon={Code2} />
         <div className="mt-5 grid gap-4 lg:grid-cols-[0.75fr_1.25fr]">
           <div className="rounded-xl border border-sky-200/15 bg-sky-200/[0.04] p-3"><p className="px-1 text-[9px] font-bold uppercase tracking-[0.16em] text-white/35">FUNCTION TYPE</p><div className="mt-3 grid gap-2"><button type="button" onClick={() => interact("mode", ["target"], "read")} data-testid="button-practice-contract-read" className={`rounded-lg border p-3 text-left ${mode === "read" ? "border-sky-200/30 bg-sky-200/10" : "border-white/[0.08] bg-black/10"}`}><p className="text-xs font-bold text-white/80">Read function</p><p className="mt-1 text-[10px] text-white/40">balanceOf(address)</p></button><button type="button" onClick={() => interact("mode", ["target"], "write")} data-testid="button-practice-contract-write" className={`rounded-lg border p-3 text-left ${mode === "write" ? "border-sky-200/30 bg-sky-200/10" : "border-white/[0.08] bg-black/10"}`}><p className="text-xs font-bold text-white/80">Write function</p><p className="mt-1 text-[10px] text-white/40">claim(uint256 amount)</p></button></div><div className="mt-4 rounded-lg border border-emerald-200/15 bg-emerald-200/[0.05] p-3 text-[10px] leading-5 text-emerald-50/60"><ShieldCheck className="mb-1 h-3.5 w-3.5 text-emerald-100/70" />Read calls do not change state. Write calls ask for permission in a real DApp.</div></div>
          <div className="rounded-xl border border-white/[0.09] bg-[#090f16] p-4 font-mono"><div className="flex items-center justify-between border-b border-white/[0.08] pb-3"><span className="text-[9px] uppercase tracking-[0.16em] text-white/35">transaction brief · TEST</span><span className="text-[10px] text-sky-100/70">network: demo</span></div><div className="mt-4 space-y-3 text-[11px]"><CodeLine label="target" value="0xDEMO…BEEF" /><CodeLine label="function" value={mode === "read" ? "balanceOf(address)" : "claim(uint256)"} /><CodeLine label="value" value="0 TEST ETH" /><CodeLine label="params" value={mode === "read" ? "0xLEARNER…" : "250 TEST"} /><CodeLine label="permission" value={mode === "read" ? "none · read-only" : "write · review first"} /></div><div className="mt-5 flex flex-wrap gap-2"><SimButton onClick={() => interact("preview", ["parameters"])} testId="button-practice-contract-preview" icon={Play}>{previewed ? "Call preview ready" : "Preview call"}</SimButton><SimButton onClick={() => interact("receipt", ["receipt"])} testId="button-practice-contract-receipt" icon={BadgeCheck}>Show expected event</SimButton></div>{previewed && <div className="mt-4 rounded-lg border border-sky-200/15 bg-sky-200/[0.05] p-3 text-[10px] leading-5 text-sky-50/60">Expected event: <span className="font-bold text-sky-100/80">{mode === "read" ? "Return value · 250" : "Claimed(address,uint256)"}</span>. This is a screen preview, not a receipt.</div>}</div>
        </div>
      </div>
    </WindowBar>
  );
}

function CodeLine({ label, value }) {
  return <div className="grid grid-cols-[82px_1fr] gap-2"><span className="text-white/30">{label}</span><span className="break-all text-sky-100/70">{value}</span></div>;
}

function ContractSimulator({ data, interact }) {
  const action = data.simulator?.archetype || data.action || "token";
  const compiled = data.simulator?.compiled;
  const labels = { token: "Token", stablecoin: "Stablecoin", faucet: "Faucet" };
  return (
    <WindowBar category={PRACTICE_CATEGORIES[8]}>
      <div className="p-4 sm:p-6">
        <SimHeader eyebrow="CONTRACT BUILDER / BLUEPRINT" title="Build the shape before the source." detail="Choose a contract archetype and read the generated preview. A blueprint is safer than pretending a deploy already happened." icon={FileCode2} tone="violet" />
        <div className="mt-5 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
           <div className="rounded-xl border border-violet-200/15 bg-violet-200/[0.04] p-4"><p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/35">ARCHETYPE</p><div className="mt-3 grid gap-2">{Object.entries(labels).map(([key, label]) => <button type="button" key={key} onClick={() => interact("archetype", ["scope"], key)} data-testid={`button-practice-builder-${key}`} className={`flex items-center justify-between rounded-lg border px-3 py-3 text-left text-xs font-bold transition ${action === key ? "border-violet-200/30 bg-violet-200/10 text-violet-100" : "border-white/[0.08] text-white/45 hover:bg-white/[0.04]"}`}>{label}<ArrowRight className="h-3.5 w-3.5 opacity-40" /></button>)}</div><div className="mt-4 rounded-lg border border-violet-200/15 bg-violet-200/[0.05] p-3 text-[10px] leading-5 text-violet-50/60">Builder mode explains <span className="text-violet-100/80">{action === "faucet" ? "cooldown and claim limits" : action === "stablecoin" ? "mint, burn, and the missing peg" : "supply and admin permissions"}</span>.</div></div>
           <div className="rounded-xl border border-white/[0.09] bg-[#0a0c14] p-4"><div className="flex items-center justify-between border-b border-white/[0.08] pb-3"><span className="font-mono text-[10px] text-violet-100/65">NightLab_{labels[action]}</span><DemoPill tone="violet">SOURCE PREVIEW</DemoPill></div><pre className="mt-4 overflow-x-auto text-[10px] leading-6 text-white/55"><code>{`contract NightLab${labels[action]} {\n  // local blueprint · not deployed\n  ${action === "faucet" ? "uint256 claimCooldown = 24 hours;" : action === "stablecoin" ? "function mint(address to, uint256 amount)" : "uint256 initialSupply = 1_000_000;"}\n  event ${action === "faucet" ? "Claimed(address user)" : action === "stablecoin" ? "Minted(address to)" : "Transfer(address from, address to)"};\n}`}</code></pre><div className="mt-4 flex flex-wrap gap-2"><SimButton tone="violet" onClick={() => interact("compiled", ["state", "tests"])} testId="button-practice-builder-preview" icon={Code2}>{compiled ? "Blueprint checked" : "Check blueprint"}</SimButton></div>{compiled && <p className="mt-3 text-[10px] leading-5 text-emerald-100/60">Scope, state, and test placeholders are visible. No compiler or deployer was called.</p>}</div>
        </div>
      </div>
    </WindowBar>
  );
}

function RwaSimulator({ data, interact }) {
  const tab = data.simulator?.tab || data.action || "treasury";
  const verified = data.simulator?.verified;
  const docs = tab === "treasury" ? ["Issuer · Northstar Treasury Ltd.", "Custodian · Harbor Desk", "Reserve attestation · 30 APR 2025"] : tab === "real-estate" ? ["Issuer · Parcel SPV 04", "Legal wrapper · Delaware SPV", "Transfer rule · KYC list"] : ["Issuer · Meridian Metals", "Custody · Vault 7 / Zurich", "Audit trail · serialised bars"];
  return (
    <WindowBar category={PRACTICE_CATEGORIES[9]}>
      <div className="p-4 sm:p-6">
        <SimHeader eyebrow="RWA DATA ROOM / VERIFICATION" title="Verify the right, not just the token." detail="Open each document layer and ask who is responsible when the screen says “redeem”." icon={ScanLine} tone="amber" />
        <div className="mt-5 flex gap-1 overflow-x-auto rounded-xl border border-white/[0.08] bg-black/15 p-1">{["treasury", "real-estate", "commodity"].map((key) => <button type="button" key={key} onClick={() => interact("tab", ["issuer"], key)} data-testid={`button-practice-rwa-tab-${key}`} className={`min-h-10 flex-1 whitespace-nowrap rounded-lg px-3 text-[10px] font-bold uppercase tracking-[0.1em] transition ${tab === key ? "bg-amber-200/15 text-amber-100" : "text-white/35 hover:text-white/60"}`}>{key}</button>)}</div>
        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_0.95fr]"><div className="rounded-xl border border-amber-200/15 bg-amber-200/[0.04] p-4"><div className="flex items-start justify-between"><div><DemoPill tone="amber">RIGHTS RECORD · DEMO</DemoPill><h5 className="mt-4 text-xl font-black text-white/90">{tab === "treasury" ? "90-day Treasury Note" : tab === "real-estate" ? "Harbor House SPV" : "Vaulted Silver Batch 07"}</h5><p className="mt-1 text-xs text-white/40">Token reference · RWA-031 · TEST</p></div><CircleDollarSign className="h-5 w-5 text-amber-100/70" /></div><div className="mt-6 grid grid-cols-2 gap-2"><MiniMetric label="Claim value" value="1.00 unit · demo" /><MiniMetric label="Redemption" value="Issuer review" /><MiniMetric label="Jurisdiction" value={tab === "real-estate" ? "US · SPV" : "Demo record"} /><MiniMetric label="Transfer" value="Restricted" /></div><SimButton tone="amber" onClick={() => interact("verified", ["rights", "evidence"])} testId="button-practice-rwa-verify" icon={ScanLine}>{verified ? "Verification pass reviewed" : "Review rights record"}</SimButton></div><div className="rounded-xl border border-white/[0.09] bg-black/15 p-4"><p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/35">Evidence stack</p><div className="mt-3 space-y-2">{docs.map((doc, index) => <button type="button" key={doc} onClick={() => interact(`doc${index}`, index === 0 ? ["issuer"] : index === 1 ? ["rights"] : ["evidence"])} data-testid={`button-practice-rwa-doc-${index}`} className="flex w-full items-center gap-3 rounded-lg border border-white/[0.08] bg-white/[0.025] p-3 text-left hover:bg-white/[0.05]"><span className={`flex h-7 w-7 items-center justify-center rounded-lg ${data.simulator?.[`doc${index}`] ? "bg-emerald-200/15 text-emerald-100" : "bg-amber-200/10 text-amber-100/70"}`}>{data.simulator?.[`doc${index}`] ? <Check className="h-3.5 w-3.5" /> : <FileCode2 className="h-3.5 w-3.5" />}</span><span className="text-[11px] text-white/60">{doc}</span><ExternalLink className="ml-auto h-3 w-3 text-white/25" /></button>)}</div><p className="mt-4 text-[10px] leading-5 text-amber-50/50">A legal wrapper describes rights. It does not make those rights true without a responsible issuer and evidence.</p></div></div>
      </div>
    </WindowBar>
  );
}

function Simulator({ category, data, interact }) {
  if (category.id === "social-quest-wl") return <SocialSimulator data={data} interact={interact} />;
  if (category.id === "dex-swap") return <DexSimulator data={data} interact={interact} />;
  if (category.id === "defi") return <DefiSimulator data={data} interact={interact} />;
  if (category.id === "meme-launchpad") return <MemeSimulator data={data} interact={interact} />;
  if (category.id === "bridge") return <BridgeSimulator data={data} interact={interact} />;
  if (category.id === "perps-trading") return <PerpsSimulator data={data} interact={interact} />;
  if (category.id === "nft") return <NftSimulator data={data} interact={interact} />;
  if (category.id === "onchain-interaction") return <OnchainSimulator data={data} interact={interact} />;
  if (category.id === "smart-contract-activity") return <ContractSimulator data={data} interact={interact} />;
  return <RwaSimulator data={data} interact={interact} />;
}

 function PracticeFields({ category, data, onUpdate }) {
  return (
    <details className="mt-4 rounded-xl border border-white/[0.08] bg-black/10">
       <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">Konteks tambahan · opsional <ChevronDown className="h-3.5 w-3.5" /></summary>
      <div className="grid gap-3 border-t border-white/[0.07] p-3 sm:grid-cols-2">
        <label className="block sm:col-span-2"><span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.12em] text-white/35">Referensi aplikasi / protokol</span><input id={`practice-platform-${category.id}`} type="text" value={data.platform} onChange={(event) => onUpdate({ platform: event.target.value })} placeholder="Latihan umum" data-testid={`input-practice-platform-${category.id}`} className="min-h-10 w-full rounded-lg border border-white/[0.1] bg-black/20 px-3 text-xs text-white outline-none transition placeholder:text-white/20 focus:border-sky-200/45" /><p className="mt-1 text-[10px] text-white/25">Label lokal saja, bukan koneksi atau verifier.</p></label>
        {category.fields.map((field) => <label key={field.key} className="block"><span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.12em] text-white/35">{field.label}</span><input type="text" value={data.inputs[field.key] || ""} onChange={(event) => onUpdate({ inputs: { ...data.inputs, [field.key]: event.target.value } })} placeholder={field.placeholder} data-testid={`input-practice-${field.key}-${category.id}`} className="min-h-10 w-full rounded-lg border border-white/[0.1] bg-black/20 px-3 text-xs text-white outline-none transition placeholder:text-white/20 focus:border-sky-200/45" /></label>)}
      </div>
    </details>
  );
}

function ActionSelector({ category, selected, onSelect }) {
  return <div className="mt-4 flex flex-wrap items-center gap-2"><span className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/30">Lens</span>{category.actionOptions.map((option) => <button key={option.id} type="button" onClick={() => onSelect(option.id)} aria-pressed={selected === option.id} data-testid={`button-practice-action-${category.id}-${option.id}`} className={`min-h-9 rounded-lg border px-3 text-[10px] font-bold transition ${selected === option.id ? "border-white/20 bg-white/[0.1] text-white" : "border-white/[0.08] text-white/40 hover:text-white/70"}`}>{option.label}</button>)}</div>;
}

function LearningRail({ category, data, onToggleStep }) {
  return <fieldset className="mt-5 rounded-xl border border-white/[0.08] bg-black/10 p-3"><legend className="px-1 text-[9px] font-bold uppercase tracking-[0.16em] text-white/35">Your learning trail</legend><div className="mt-2 grid gap-2 sm:grid-cols-3">{category.steps.map((step, index) => <label key={step.id} className={`flex cursor-pointer items-start gap-2 rounded-lg border p-2.5 transition ${data.steps[step.id] ? "border-emerald-200/20 bg-emerald-200/[0.06]" : "border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.04]"}`}><input type="checkbox" checked={data.steps[step.id] === true} onChange={() => onToggleStep(step.id)} data-testid={`checkbox-practice-step-${category.id}-${step.id}`} className="mt-0.5 h-3.5 w-3.5 accent-emerald-300" /><span><span className="block text-[9px] font-bold text-white/25">0{index + 1}</span><span className={`mt-1 block text-[10px] leading-4 ${data.steps[step.id] ? "text-emerald-100/80" : "text-white/50"}`}>{step.label}</span></span></label>)}</div><p className="mt-2 text-[10px] text-white/25">Klik tombol di simulator untuk menandai otomatis, atau centang setelah kamu memahami istilahnya.</p></fieldset>;
}

function PracticePanel({ category, data, onUpdate, onToggleStep, onComplete, canComplete, onPrevious, onNext, hasPrevious, hasNext }) {
  const style = ACCENT_STYLES[category.accent];
  const [showContext, setShowContext] = useState(false);
   const interact = (key, steps = [], value = true) => {
    const nextSteps = { ...data.steps };
    steps.forEach((step) => { nextSteps[step] = true; });
     onUpdate({ simulator: { ...data.simulator, [key]: key === "minted" ? Number(data.simulator?.minted || 0) + 1 : value }, steps: nextSteps });
  };
  return (
    <section className="min-w-0" data-testid={`practice-panel-${category.id}`}>
      <div className="rounded-2xl border border-white/[0.09] bg-white/[0.025] p-3 sm:p-5">
        <div className="flex items-start justify-between gap-4"><div className="min-w-0"><p className={`text-[10px] font-bold uppercase tracking-[0.16em] ${style.eyebrow}`}>{category.index} · {category.label}</p><h3 className="mt-2 text-2xl font-black tracking-[-0.05em] text-white sm:text-3xl">{category.title}</h3><p className="mt-2 max-w-2xl text-sm leading-6 text-white/50">{category.explanation}</p></div><span className={`hidden h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ring-1 sm:flex ${style.icon}`}><Target className="h-4 w-4" /></span></div>
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-200/15 bg-amber-200/[0.035] p-3" data-testid="practice-local-notice"><Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-100/75" /><p className="text-xs leading-5 text-amber-50/60"><strong className="font-bold text-amber-50/85">Simulasi lokal.</strong> Tidak ada wallet, RPC, Sepolia, signature, approval, gas, saldo, atau transaksi nyata.</p></div>
        <div className="mt-5"><Simulator category={category} data={data} interact={interact} /></div>
        <ActionSelector category={category} selected={data.action} onSelect={(action) => onUpdate({ action })} />
        <PracticeFields category={category} data={data} onUpdate={onUpdate} />
        <LearningRail category={category} data={data} onToggleStep={onToggleStep} />
        <button type="button" onClick={() => setShowContext((current) => !current)} aria-expanded={showContext} aria-controls={`practice-context-${category.id}`} data-testid={`button-practice-context-${category.id}`} className="mt-3 inline-flex min-h-9 items-center gap-2 text-[10px] font-bold text-white/35 transition hover:text-white/70">Lihat konteks dan risiko <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showContext ? "rotate-180" : ""}`} /></button>
        {showContext && <p id={`practice-context-${category.id}`} className="mt-2 rounded-xl border border-white/[0.07] bg-black/15 p-3 text-xs leading-6 text-white/45">{category.context}</p>}
        <label className="mt-3 block"><span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-white/30">Catatan untuk nanti</span><textarea value={data.notes} onChange={(event) => onUpdate({ notes: event.target.value })} placeholder="Apa yang ingin kamu cek lagi saat fase testnet?" rows={2} data-testid={`textarea-practice-notes-${category.id}`} className="w-full resize-none rounded-xl border border-white/[0.1] bg-black/20 px-3 py-2.5 text-xs leading-5 text-white outline-none transition placeholder:text-white/20 focus:border-sky-200/45" /></label>
        <div className={`mt-4 flex flex-col gap-3 rounded-xl border p-3 sm:flex-row sm:items-center sm:justify-between ${style.soft}`}><div className="flex items-start gap-2.5">{data.completed ? <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-200/75" /> : <Save className="mt-0.5 h-4 w-4 flex-shrink-0 text-sky-100/60" />}<p className="text-xs leading-5 text-white/50" aria-live="polite" data-testid={`status-practice-save-${category.id}`}>{data.completed ? "Simulasi selesai dan tersimpan di browser ini." : "Perubahan tersimpan otomatis di browser ini."}</p></div><button type="button" onClick={onComplete} disabled={!canComplete} data-testid={`button-practice-complete-${category.id}`} className={`inline-flex min-h-10 flex-shrink-0 items-center justify-center gap-2 rounded-lg px-4 text-[11px] font-bold transition ${data.completed ? "bg-emerald-300/10 text-emerald-100 ring-1 ring-emerald-200/20 hover:bg-emerald-300/15" : style.button} disabled:cursor-not-allowed disabled:opacity-35`}>{data.completed ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" />}{data.completed ? "Simulasi selesai" : "Simpan & buka berikutnya"}</button></div>
         {!canComplete && !data.completed && <p className="mt-2 text-right text-[10px] text-white/25">Ikuti semua langkah di mini-app untuk membuka kategori berikutnya.</p>}
      </div>
      <div className="mt-3 flex items-center justify-between gap-3"><button type="button" onClick={onPrevious} disabled={!hasPrevious} data-testid="button-practice-previous" className="inline-flex min-h-10 items-center gap-2 rounded-lg px-2 text-[11px] font-bold text-white/40 transition hover:text-white/75 disabled:invisible"><ArrowLeft className="h-3.5 w-3.5" /> Sebelumnya</button><button type="button" onClick={onNext} disabled={!hasNext || !data.completed} data-testid="button-practice-next" className="inline-flex min-h-10 items-center gap-2 rounded-lg px-2 text-[11px] font-bold text-white/40 transition hover:text-white/75 disabled:invisible">Berikutnya <ArrowRight className="h-3.5 w-3.5" /></button></div>
    </section>
  );
}

export default function ActivePracticeMode() {
  const [state, setState] = useState(readPracticeState);
  const [saveTick, setSaveTick] = useState(0);
  const activeCategory = PRACTICE_CATEGORIES.find((category) => category.id === state.activeCategoryId) || PRACTICE_CATEGORIES[0];
  const activeIndex = PRACTICE_CATEGORIES.findIndex((category) => category.id === activeCategory.id);
  const activeData = state.categories[activeCategory.id] || getDefaultCategoryState(activeCategory);
  const completedCount = useMemo(() => PRACTICE_CATEGORIES.filter((category) => state.categories[category.id]?.completed).length, [state.categories]);
  const percent = Math.round((completedCount / PRACTICE_CATEGORIES.length) * 100);

  useEffect(() => {
    try { window.localStorage.setItem(PRACTICE_STORAGE_KEY, JSON.stringify(state)); setSaveTick((current) => current + 1); } catch { /* local memory remains usable */ }
  }, [state]);

  function updateActiveCategory(patch) {
    setState((current) => {
      const currentData = current.categories[activeCategory.id] || getDefaultCategoryState(activeCategory);
      return { ...current, categories: { ...current.categories, [activeCategory.id]: { ...currentData, ...patch, updatedAt: Date.now() } } };
    });
  }
  function toggleStep(stepId) { updateActiveCategory({ steps: { ...activeData.steps, [stepId]: !activeData.steps[stepId] } }); }
  function isUnlocked(index) { return index === 0 || state.categories[PRACTICE_CATEGORIES[index - 1].id]?.completed === true; }
  function selectCategory(id) { const index = PRACTICE_CATEGORIES.findIndex((category) => category.id === id); if (index < 0 || !isUnlocked(index)) return; setState((current) => ({ ...current, activeCategoryId: id })); }
  function completeActive() {
    const checklistDone = activeCategory.steps.every((step) => activeData.steps[step.id]);
     if (!checklistDone) return;
    updateActiveCategory({ completed: true });
    const nextCategory = PRACTICE_CATEGORIES[activeIndex + 1];
    if (nextCategory) setState((current) => ({ ...current, activeCategoryId: nextCategory.id }));
  }
  function moveBy(offset) { const next = PRACTICE_CATEGORIES[activeIndex + offset]; if (next && isUnlocked(activeIndex + offset)) selectCategory(next.id); }
   const canComplete = Boolean(activeCategory.steps.every((step) => activeData.steps[step.id]));

  return (
    <div data-testid="active-practice-mode">
      <section className="border-b border-white/[0.1] pb-7"><div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-200/65">A guided learning lab</p><h2 className="mt-3 max-w-2xl text-3xl font-black leading-[1.02] tracking-[-0.05em] text-white sm:text-5xl">Klik dulu. Pahami istilahnya.</h2><p className="mt-4 max-w-2xl text-sm leading-7 text-white/50">Sepuluh mini-app fiktif untuk melihat bagaimana Web3 terasa sebelum kamu menyentuh wallet atau testnet.</p></div><div className="min-w-[170px] border-l border-sky-300/20 pl-4"><div className="flex items-center justify-between gap-3"><span className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">Lab progress</span><span className="text-sm font-semibold text-sky-100/80" data-testid="text-practice-progress">{completedCount}/{PRACTICE_CATEGORIES.length}</span></div><div className="mt-3 h-1 overflow-hidden bg-white/[0.09]"><div className="h-full bg-sky-200/80 transition-all duration-500" style={{ width: `${percent}%` }} /></div><p className="mt-3 text-xs text-white/40" data-testid="text-practice-progress-label">{percent}% tersimpan di browser ini</p></div></div><div className="mt-5 flex items-start gap-3 rounded-xl border border-sky-200/15 bg-sky-200/[0.035] p-3.5"><ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-sky-100/70" /><p className="text-xs leading-5 text-sky-50/55">Setiap layar bertanda <strong className="text-sky-100/75">DEMO / TEST</strong>. Tidak ada address, token, saldo, signature, gas, atau hasil yang dibuat.</p></div></section>
      <div className="mt-7 md:hidden"><label htmlFor="practice-category-select" className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">Pilih mini-app</label><select id="practice-category-select" value={activeCategory.id} onChange={(event) => selectCategory(event.target.value)} data-testid="select-practice-category" className="min-h-11 w-full rounded-xl border border-white/[0.1] bg-[#111823] px-3 text-sm text-white outline-none focus:border-sky-200/45">{PRACTICE_CATEGORIES.map((category, index) => <option key={category.id} value={category.id} disabled={!isUnlocked(index)}>{category.index} · {category.shortLabel}{isUnlocked(index) ? "" : " · terkunci"}</option>)}</select></div>
      <div className="mt-7 grid gap-5 md:grid-cols-[220px_minmax(0,1fr)] md:items-start"><aside className="hidden overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] md:block" aria-label="Urutan mini-app latihan"><div className="border-b border-white/[0.08] px-3 py-3"><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/35">Mini-app trail</p><p className="mt-1 text-[11px] leading-5 text-white/35">Buka satu layar per satu.</p></div>{PRACTICE_CATEGORIES.map((category, index) => <PracticeCategoryRow key={category.id} category={category} active={activeCategory.id === category.id} completed={state.categories[category.id]?.completed === true} unlocked={isUnlocked(index)} onSelect={selectCategory} />)}</aside><PracticePanel category={activeCategory} data={activeData} onUpdate={updateActiveCategory} onToggleStep={toggleStep} onComplete={completeActive} canComplete={canComplete} onPrevious={() => moveBy(-1)} onNext={() => moveBy(1)} hasPrevious={activeIndex > 0} hasNext={activeIndex < PRACTICE_CATEGORIES.length - 1} /></div>
      <div className="mt-5 flex items-center gap-2 text-[10px] text-white/25" aria-live="polite" data-testid="status-practice-autosave"><Save className="h-3 w-3" /> Autosave lokal aktif {saveTick >= 0 ? "· tersimpan" : ""}</div>
    </div>
  );
}