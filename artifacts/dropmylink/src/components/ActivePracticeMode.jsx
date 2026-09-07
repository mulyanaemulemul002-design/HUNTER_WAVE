import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  FileCode2,
  Info,
  LockKeyhole,
  Save,
  ShieldCheck,
  Target,
} from "lucide-react";

export const PRACTICE_STORAGE_KEY = "hw_beginner_practice_v1";

const ACCENT_STYLES = {
  blue: {
    icon: "bg-blue-400/10 text-blue-200 ring-blue-300/20",
    line: "bg-blue-300/70",
    eyebrow: "text-blue-200/70",
    button: "bg-blue-400 text-[#08101c] hover:bg-blue-300",
    soft: "border-blue-300/20 bg-blue-300/[0.06]",
  },
  cyan: {
    icon: "bg-cyan-300/10 text-cyan-100 ring-cyan-200/20",
    line: "bg-cyan-200/70",
    eyebrow: "text-cyan-100/70",
    button: "bg-cyan-200 text-[#071315] hover:bg-cyan-100",
    soft: "border-cyan-200/20 bg-cyan-200/[0.06]",
  },
  amber: {
    icon: "bg-amber-300/10 text-amber-100 ring-amber-200/20",
    line: "bg-amber-200/70",
    eyebrow: "text-amber-100/70",
    button: "bg-amber-200 text-[#171108] hover:bg-amber-100",
    soft: "border-amber-200/20 bg-amber-200/[0.06]",
  },
  violet: {
    icon: "bg-violet-300/10 text-violet-100 ring-violet-200/20",
    line: "bg-violet-200/70",
    eyebrow: "text-violet-100/70",
    button: "bg-violet-200 text-[#100b1b] hover:bg-violet-100",
    soft: "border-violet-200/20 bg-violet-200/[0.06]",
  },
};

export const PRACTICE_CATEGORIES = [
  {
    id: "social-quest-wl",
    index: "01",
    label: "Social Quest / WL",
    shortLabel: "Social / WL",
    title: "Baca brief dan buktikan sumbernya",
    accent: "blue",
    summary: "Latihan memetakan aktivitas sosial atau whitelist tanpa menganggap aktivitas sebagai jaminan alokasi.",
    explanation: "Mulai dari pengumuman resmi, pahami tugasnya, lalu pisahkan bukti partisipasi dari klaim hasil.",
    context: "Periksa domain, tanggal snapshot, aturan multi-akun, dan apakah project pernah menjelaskan kriteria WL secara terbuka.",
    actionOptions: [
      { id: "social", label: "Social task", description: "Catat platform, jenis kontribusi, dan bukti yang diminta." },
      { id: "whitelist", label: "Whitelist", description: "Petakan syarat masuk dan bedakan daftar tunggu dari alokasi pasti." },
    ],
    fields: [
      { key: "campaignName", label: "Nama campaign atau komunitas", placeholder: "Contoh: Community round", required: true },
    ],
    steps: [
      { id: "source", label: "Temukan sumber resmi dan domain yang benar." },
      { id: "rules", label: "Tulis ulang aturan, periode, dan syaratnya dengan bahasamu sendiri." },
      { id: "risk", label: "Tandai risiko link, multi-akun, dan klaim hasil yang belum pasti." },
    ],
  },
  {
    id: "dex-swap",
    index: "02",
    label: "DEX / Swap",
    shortLabel: "DEX / Swap",
    title: "Baca quote sebelum menukar aset",
    accent: "cyan",
    summary: "Latihan membaca pair, network, fee, price impact, dan permission sebelum sebuah swap nyata.",
    explanation: "Sebuah quote bukan janji harga. Bandingkan aset, network, slippage, dan kontrak yang akan menerima izin.",
    context: "Pada fase Sepolia nanti, aksi dapat diuji dengan token latihan. Untuk sekarang semua angka dan keputusan hanya catatan lokal.",
    actionOptions: [
      { id: "quote", label: "Baca quote", description: "Bandingkan jumlah masuk, jumlah keluar, fee, dan price impact." },
      { id: "route", label: "Cek route", description: "Lihat jalur swap dan kontrak mana yang akan dipanggil." },
    ],
    fields: [
      { key: "pair", label: "Pair yang ingin dipelajari", placeholder: "Contoh: TESTA / TESTB", required: true },
    ],
    steps: [
      { id: "network", label: "Pastikan aset dan network yang dipilih memang cocok." },
      { id: "quote", label: "Catat fee, slippage, price impact, dan jumlah minimum." },
      { id: "permission", label: "Baca permission yang diminta sebelum menekan sign." },
    ],
  },
  {
    id: "defi",
    index: "03",
    label: "DeFi",
    shortLabel: "DeFi",
    title: "Kenali landing, borrowing, LP, dan supply",
    accent: "blue",
    summary: "Satu ruang latihan untuk membandingkan empat permukaan DeFi dengan risiko dan input yang berbeda.",
    explanation: "Landing, borrowing, liquidity pool, dan supply tidak sama. Pahami aset, jaminan, bunga, dan risiko smart contract.",
    context: "Jangan menyamakan APY dengan hasil pasti. Pada fase lokal ini tidak ada saldo, bunga, jaminan, atau posisi yang benar-benar bergerak.",
    actionOptions: [
      { id: "landing", label: "Landing", description: "Petakan halaman project, sumber resmi, dan kontrak yang dirujuk." },
      { id: "borrowing", label: "Borrowing", description: "Baca collateral, health factor, bunga, dan kondisi likuidasi." },
      { id: "lp", label: "LP", description: "Bandingkan pair, fee pool, dan risiko impermanent loss." },
      { id: "supply", label: "Supply", description: "Catat aset yang disetor, masa lock, dan cara penarikan." },
    ],
    fields: [
      { key: "surface", label: "Permukaan DeFi yang dipelajari", placeholder: "Contoh: lending pool", required: true },
    ],
    steps: [
      { id: "asset", label: "Identifikasi aset yang masuk, keluar, atau menjadi jaminan." },
      { id: "terms", label: "Catat bunga, fee, lock, health factor, atau price impact." },
      { id: "exit", label: "Tentukan kondisi berhenti dan cara keluar sebelum mulai." },
    ],
  },
  {
    id: "meme-launchpad",
    index: "04",
    label: "Meme Launchpad",
    shortLabel: "Meme Launchpad",
    title: "Bedakan peluncuran dan spekulasi",
    accent: "amber",
    summary: "Latihan membaca token launch, bonding curve, liquidity, dan risiko volatilitas ekstrem.",
    explanation: "Launchpad dapat membuat proses terlihat sederhana, tetapi tokenomics, liquidity, dan distribusi tetap harus dibaca.",
    context: "Meme asset bisa bergerak sangat cepat dan tidak punya nilai yang dapat dipastikan. Jangan menganggap popularitas sebagai due diligence.",
    actionOptions: [
      { id: "launch", label: "Baca launch", description: "Petakan parameter token, distribusi, dan mekanisme peluncuran." },
      { id: "trade", label: "Baca market", description: "Amati liquidity, volume, holder concentration, dan risiko exit." },
    ],
    fields: [
      { key: "launchpad", label: "Nama launchpad atau project", placeholder: "Contoh: Launchpad latihan", required: true },
    ],
    steps: [
      { id: "tokenomics", label: "Catat supply, distribusi, unlock, dan hak admin." },
      { id: "liquidity", label: "Periksa sumber liquidity dan aturan penarikannya." },
      { id: "volatility", label: "Tulis skenario terburuk tanpa menjadikan hype sebagai bukti." },
    ],
  },
  {
    id: "bridge",
    index: "05",
    label: "Bridge",
    shortLabel: "Bridge",
    title: "Pahami perpindahan antar-network",
    accent: "cyan",
    summary: "Latihan mengecek network asal, tujuan, aset representasi, waktu tunggu, dan risiko bridge.",
    explanation: "Bridge memperkenalkan lapisan risiko tambahan: kontrak, validator, liquidity, dan kemungkinan aset terbungkus.",
    context: "Pada integrasi Sepolia nanti, kita akan memakai aset latihan yang tidak bernilai. Sekarang tidak ada perpindahan aset atau message lintas-chain.",
    actionOptions: [
      { id: "route", label: "Baca route", description: "Petakan asal, tujuan, token, fee, dan waktu finalisasi." },
      { id: "message", label: "Baca message", description: "Pahami pesan lintas-network dan kontrak yang terlibat." },
    ],
    fields: [
      { key: "sourceNetwork", label: "Network asal", placeholder: "Contoh: Sepolia", required: true },
      { key: "destinationNetwork", label: "Network tujuan", placeholder: "Contoh: Base Sepolia", required: true },
    ],
    steps: [
      { id: "networks", label: "Cocokkan network asal, tujuan, dan alamat kontraknya." },
      { id: "asset", label: "Pastikan apakah aset tujuan native, wrapped, atau representasi." },
      { id: "finality", label: "Catat fee, waktu tunggu, dan kondisi gagal atau tertunda." },
    ],
  },
  {
    id: "perps-trading",
    index: "06",
    label: "Perps Trading",
    shortLabel: "Perps",
    title: "Latihan membaca posisi dan leverage",
    accent: "amber",
    summary: "Baca market, margin, funding, liquidation price, dan risiko leverage tanpa membuka posisi nyata.",
    explanation: "Perpetual contract bisa memperbesar untung dan rugi. Latihan pertama harus berfokus pada kondisi likuidasi, bukan entry.",
    context: "Simulasi ini tidak memegang saldo, tidak menghitung PnL nyata, dan tidak mengirim order. Leverage tinggi bukan shortcut belajar.",
    actionOptions: [
      { id: "long", label: "Skenario long", description: "Tulis apa yang terjadi jika harga naik dan jika harga turun." },
      { id: "short", label: "Skenario short", description: "Tulis apa yang terjadi jika harga turun dan jika harga naik." },
    ],
    fields: [
      { key: "market", label: "Market latihan", placeholder: "Contoh: TEST-PERP", required: true },
    ],
    steps: [
      { id: "margin", label: "Bedakan margin, notional, leverage, dan collateral." },
      { id: "funding", label: "Catat funding rate, fee, dan kapan biaya dapat berubah." },
      { id: "liquidation", label: "Tentukan liquidation price dan batas berhenti sebelum entry." },
    ],
  },
  {
    id: "nft",
    index: "07",
    label: "NFT",
    shortLabel: "NFT",
    title: "Baca mint, ownership, dan metadata",
    accent: "violet",
    summary: "Latihan memahami collection, mint condition, metadata, royalty, dan permission marketplace.",
    explanation: "NFT bukan cuma gambar. Periksa contract, token standard, metadata, creator authority, dan cara ownership dicatat.",
    context: "Nanti kita dapat membuat collection latihan di testnet. Untuk sekarang tidak ada mint, listing, atau token ID yang benar-benar dibuat.",
    actionOptions: [
      { id: "mint", label: "Baca mint", description: "Periksa supply, mint price, allowlist, dan fungsi contract." },
      { id: "market", label: "Baca marketplace", description: "Periksa listing, royalty, transfer permission, dan provenance." },
    ],
    fields: [
      { key: "collection", label: "Nama collection latihan", placeholder: "Contoh: Night Lab Objects", required: true },
    ],
    steps: [
      { id: "contract", label: "Cocokkan alamat contract dan token standard." },
      { id: "metadata", label: "Cari tahu lokasi metadata dan apakah bisa berubah." },
      { id: "ownership", label: "Pastikan arti ownership, royalty, dan permission marketplace." },
    ],
  },
  {
    id: "onchain-interaction",
    index: "08",
    label: "On-chain Interaction",
    shortLabel: "On-chain",
    title: "Terjemahkan aksi menjadi transaksi",
    accent: "blue",
    summary: "Latihan membaca contract address, function, parameter, value, dan hasil transaksi.",
    explanation: "Setiap klik pada DApp biasanya diterjemahkan menjadi calldata yang ditandatangani wallet lalu diproses network.",
    context: "Di fase lokal kita hanya menyusun transaction brief. Belum ada wallet, RPC, gas, signature, nonce, atau receipt.",
    actionOptions: [
      { id: "read", label: "Read function", description: "Pisahkan fungsi baca yang tidak mengubah state dari fungsi tulis." },
      { id: "write", label: "Write function", description: "Catat parameter, value, permission, dan state yang berubah." },
    ],
    fields: [
      { key: "contractFunction", label: "Contract dan function", placeholder: "Contoh: 0x... · claim()", required: true },
    ],
    steps: [
      { id: "target", label: "Verifikasi contract address dan network sebelum menyusun aksi." },
      { id: "parameters", label: "Baca setiap parameter, value, dan permission yang diminta." },
      { id: "receipt", label: "Pahami event, status receipt, dan cara memverifikasinya." },
    ],
  },
  {
    id: "smart-contract-activity",
    index: "09",
    label: "Smart Contract Activity",
    shortLabel: "Smart Contract",
    title: "Rancang contract dari nol",
    accent: "violet",
    summary: "Susun blueprint token, stablecoin latihan, atau faucet sebelum nanti dibuat dan diuji di Sepolia.",
    explanation: "Mulai dari tujuan contract, state, permission admin, event, dan batasan. Stablecoin latihan tidak otomatis memiliki peg atau nilai.",
    context: "Fase berikutnya dapat menghasilkan source Solidity, compile, test, deploy ke Sepolia, dan verifikasi address. Fase ini baru menyimpan spesifikasi.",
    actionOptions: [
      { id: "token", label: "Token sederhana", description: "Susun nama, symbol, decimals, dan initial supply." },
      { id: "stablecoin", label: "Stablecoin latihan", description: "Susun mint/burn dan catatan bahwa peg belum ada." },
      { id: "faucet", label: "Faucet testnet", description: "Susun batas claim dan cooldown untuk token latihan." },
    ],
    fields: [
      { key: "contractName", label: "Nama contract atau token", placeholder: "Contoh: NightLab Token", required: true },
      { key: "symbol", label: "Symbol", placeholder: "NLT", required: true },
      { key: "initialSupply", label: "Initial supply", placeholder: "1000000", required: true },
    ],
    steps: [
      { id: "scope", label: "Tentukan fungsi contract dan siapa yang boleh memanggilnya." },
      { id: "state", label: "Tulis state, decimals, supply, event, dan permission admin." },
      { id: "tests", label: "Siapkan skenario test sebelum source dibuat dan di-deploy." },
    ],
  },
  {
    id: "rwa-special-type",
    index: "10",
    label: "RWA Special Type",
    shortLabel: "RWA",
    title: "Pisahkan aset dunia nyata dari tokennya",
    accent: "amber",
    summary: "Latihan membaca issuer, legal wrapper, custody, redemption, dan bukti aset di balik token RWA.",
    explanation: "RWA membutuhkan lebih dari contract. Periksa penerbit, hak pemegang, kustodian, yurisdiksi, dan mekanisme redemption.",
    context: "Tokenisasi tidak sama dengan kepemilikan legal otomatis. Jangan membuat klaim aset tanpa dokumen dan pihak yang dapat diverifikasi.",
    actionOptions: [
      { id: "treasury", label: "Treasury", description: "Baca issuer, reserve, attestation, dan hak redemption." },
      { id: "real-estate", label: "Real estate", description: "Baca wrapper legal, SPV, kepemilikan, dan batas transfer." },
      { id: "commodity", label: "Commodity", description: "Baca custody, audit, serialisasi, dan proses klaim." },
    ],
    fields: [
      { key: "assetTheme", label: "Tema aset dunia nyata", placeholder: "Contoh: Treasury bill latihan", required: true },
    ],
    steps: [
      { id: "issuer", label: "Identifikasi issuer, custodian, dan pihak yang bertanggung jawab." },
      { id: "rights", label: "Tulis hak token holder dan batas transfernya." },
      { id: "evidence", label: "Cari bukti reserve, legal wrapper, audit, dan redemption." },
    ],
  },
];

function getDefaultCategoryState(category) {
  return {
    platform: "",
    action: category.actionOptions[0].id,
    inputs: Object.fromEntries(category.fields.map((field) => [field.key, ""])),
    steps: Object.fromEntries(category.steps.map((step) => [step.id, false])),
    notes: "",
    completed: false,
    updatedAt: 0,
  };
}

function normalizePracticeState(raw) {
  const empty = {
    version: 1,
    activeCategoryId: PRACTICE_CATEGORIES[0].id,
    categories: {},
  };
  if (!raw || typeof raw !== "object") return empty;

  const categories = Object.fromEntries(PRACTICE_CATEGORIES.map((category) => {
    const defaults = getDefaultCategoryState(category);
    const saved = raw.categories?.[category.id];
    if (!saved || typeof saved !== "object") return [category.id, defaults];
    return [category.id, {
      ...defaults,
      platform: typeof saved.platform === "string" ? saved.platform : "",
      action: category.actionOptions.some((option) => option.id === saved.action) ? saved.action : defaults.action,
      inputs: Object.fromEntries(category.fields.map((field) => [
        field.key,
        typeof saved.inputs?.[field.key] === "string" ? saved.inputs[field.key] : "",
      ])),
      steps: Object.fromEntries(category.steps.map((step) => [step.id, saved.steps?.[step.id] === true])),
      notes: typeof saved.notes === "string" ? saved.notes : "",
      completed: saved.completed === true,
      updatedAt: Number.isFinite(saved.updatedAt) ? saved.updatedAt : 0,
    }];
  }));

  return {
    version: 1,
    activeCategoryId: PRACTICE_CATEGORIES.some((category) => category.id === raw.activeCategoryId)
      ? raw.activeCategoryId
      : empty.activeCategoryId,
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
  return (
    <button
      type="button"
      onClick={() => unlocked && onSelect(category.id)}
      disabled={!unlocked}
      aria-current={active ? "step" : undefined}
      aria-disabled={!unlocked}
      data-testid={`button-practice-category-${category.id}`}
      className={`flex min-h-14 w-full items-center gap-3 border-b border-white/[0.07] px-3 py-3 text-left transition last:border-b-0 ${
        active ? "bg-white/[0.06]" : unlocked ? "hover:bg-white/[0.035]" : "cursor-not-allowed opacity-35"
      }`}
    >
      <span className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-[10px] font-black ring-1 ${style.icon}`}>
        {completed ? <Check className="h-3.5 w-3.5" /> : category.index}
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

function PracticeFields({ category, data, onUpdate }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {category.fields.map((field) => (
        <label key={field.key} className="block">
          <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.12em] text-white/40">
            {field.label} {field.required && <span className="text-blue-200/60">*</span>}
          </span>
          <input
            type="text"
            value={data.inputs[field.key] || ""}
            onChange={(event) => onUpdate({ inputs: { ...data.inputs, [field.key]: event.target.value } })}
            placeholder={field.placeholder}
            data-testid={`input-practice-${field.key}-${category.id}`}
            className="min-h-11 w-full rounded-xl border border-white/[0.10] bg-black/20 px-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-blue-300/45 focus:ring-2 focus:ring-blue-300/10"
          />
        </label>
      ))}
    </div>
  );
}

function ActionSelector({ category, selected, onSelect }) {
  const style = ACCENT_STYLES[category.accent];
  const selectedOption = category.actionOptions.find((option) => option.id === selected) || category.actionOptions[0];
  return (
    <fieldset>
      <legend className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">Jenis aksi yang dilatih</legend>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {category.actionOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelect(option.id)}
            aria-pressed={selected === option.id}
            data-testid={`button-practice-action-${category.id}-${option.id}`}
            className={`min-h-14 rounded-xl border px-3 py-2.5 text-left transition ${
              selected === option.id ? `${style.soft} ring-1 ring-white/10` : "border-white/[0.08] bg-white/[0.025] hover:bg-white/[0.05]"
            }`}
          >
            <span className={`block text-xs font-semibold ${selected === option.id ? "text-white" : "text-white/60"}`}>{option.label}</span>
            <span className="mt-1 block text-[10px] leading-4 text-white/35">{option.description}</span>
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs leading-5 text-white/45" data-testid={`text-practice-action-description-${category.id}`}>
        {selectedOption.description}
      </p>
    </fieldset>
  );
}

function ContractBlueprint({ category, data }) {
  if (category.id !== "smart-contract-activity") return null;
  const action = category.actionOptions.find((option) => option.id === data.action);
  return (
    <div className="mt-4 rounded-2xl border border-violet-200/15 bg-violet-200/[0.035] p-4" data-testid="practice-contract-blueprint">
      <div className="flex items-start gap-3">
        <FileCode2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-violet-100/75" />
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-violet-100/60">Blueprint lokal · {action?.label}</p>
          <p className="mt-2 break-words font-mono text-xs leading-6 text-white/60">
            {data.inputs.contractName || "ContractName"} · {data.inputs.symbol || "SYM"} · supply {data.inputs.initialSupply || "0"}
          </p>
          <p className="mt-2 text-[11px] leading-5 text-violet-100/45">
            Ini baru spesifikasi. Belum ada source, compile, deploy, address, token, peg, atau transaksi nyata.
          </p>
        </div>
      </div>
    </div>
  );
}

function PracticePanel({ category, data, onUpdate, onToggleStep, onComplete, canComplete, onPrevious, onNext, hasPrevious, hasNext }) {
  const style = ACCENT_STYLES[category.accent];
  const [showContext, setShowContext] = useState(false);
  const allStepsComplete = category.steps.every((step) => data.steps[step.id]);

  return (
    <section className="min-w-0" data-testid={`practice-panel-${category.id}`}>
      <div className="rounded-2xl border border-white/[0.09] bg-white/[0.025] p-4 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className={`text-[10px] font-bold uppercase tracking-[0.16em] ${style.eyebrow}`}>{category.index} · {category.label}</p>
            <h3 className="mt-2 text-2xl font-black tracking-[-0.04em] text-white sm:text-3xl">{category.title}</h3>
          </div>
          <span className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ring-1 ${style.icon}`}>
            <Target className="h-4 w-4" />
          </span>
        </div>

        <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-200/15 bg-amber-200/[0.035] p-3.5" data-testid="practice-local-notice">
          <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-100/75" />
          <p className="text-xs leading-5 text-amber-50/60">
            <strong className="font-bold text-amber-50/80">Simulasi lokal.</strong> Tidak ada wallet, RPC, Sepolia, signature, approval, gas, saldo, atau transaksi nyata.
          </p>
        </div>

        <p className="mt-5 text-sm leading-7 text-white/55">{category.explanation}</p>
        <button
          type="button"
          onClick={() => setShowContext((current) => !current)}
          aria-expanded={showContext}
          aria-controls={`practice-context-${category.id}`}
          data-testid={`button-practice-context-${category.id}`}
          className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-lg text-xs font-bold text-white/45 transition hover:text-white/75"
        >
          Lihat konteks dan risiko
          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showContext ? "rotate-180" : ""}`} />
        </button>
        {showContext && (
          <p id={`practice-context-${category.id}`} className="mt-2 rounded-xl border border-white/[0.07] bg-black/15 p-3 text-xs leading-6 text-white/45">
            {category.context}
          </p>
        )}

        <div className="mt-6 space-y-5">
          <div>
            <label htmlFor={`practice-platform-${category.id}`} className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">
              Protokol atau platform yang ingin dipelajari
            </label>
            <input
              id={`practice-platform-${category.id}`}
              type="text"
              value={data.platform}
              onChange={(event) => onUpdate({ platform: event.target.value })}
              placeholder="Tulis nama protokol atau “latihan umum”"
              data-testid={`input-practice-platform-${category.id}`}
              className="min-h-11 w-full rounded-xl border border-white/[0.10] bg-black/20 px-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-blue-300/45 focus:ring-2 focus:ring-blue-300/10"
            />
            <p className="mt-1.5 text-[10px] text-white/25">Ini hanya label referensi lokal, bukan verifier atau koneksi.</p>
          </div>
          <PracticeFields category={category} data={data} onUpdate={onUpdate} />
          <ActionSelector category={category} selected={data.action} onSelect={(action) => onUpdate({ action })} />
        </div>

        <ContractBlueprint category={category} data={data} />

        <fieldset className="mt-6">
          <legend className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">Checklist persiapan</legend>
          <div className="mt-2 space-y-2">
            {category.steps.map((step) => (
              <label key={step.id} className={`flex min-h-12 cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${
                data.steps[step.id] ? "border-emerald-300/20 bg-emerald-300/[0.05]" : "border-white/[0.08] bg-white/[0.025] hover:bg-white/[0.045]"
              }`}>
                <input
                  type="checkbox"
                  checked={data.steps[step.id] === true}
                  onChange={() => onToggleStep(step.id)}
                  data-testid={`checkbox-practice-step-${category.id}-${step.id}`}
                  className="mt-0.5 h-4 w-4 accent-blue-300"
                />
                <span className={`text-xs leading-5 ${data.steps[step.id] ? "text-emerald-100/80" : "text-white/55"}`}>{step.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <label className="mt-6 block">
          <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">Catatan latihan</span>
          <textarea
            value={data.notes}
            onChange={(event) => onUpdate({ notes: event.target.value })}
            placeholder="Tulis hal yang ingin kamu cek lagi saat fase testnet dimulai..."
            rows={3}
            data-testid={`textarea-practice-notes-${category.id}`}
            className="w-full resize-none rounded-xl border border-white/[0.10] bg-black/20 px-3 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/20 focus:border-blue-300/45 focus:ring-2 focus:ring-blue-300/10"
          />
        </label>

        <div className={`mt-6 flex flex-col gap-3 rounded-xl border p-3.5 sm:flex-row sm:items-center sm:justify-between ${style.soft}`}>
          <div className="flex items-start gap-2.5">
            {data.completed ? <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-200/75" /> : <Save className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-100/60" />}
            <p className="text-xs leading-5 text-white/50" aria-live="polite" data-testid={`status-practice-save-${category.id}`}>
              {data.completed ? "Latihan lokal selesai dan tersimpan di browser ini." : "Input tersimpan otomatis di browser ini."}
            </p>
          </div>
          <button
            type="button"
            onClick={onComplete}
            disabled={!canComplete}
            data-testid={`button-practice-complete-${category.id}`}
            className={`inline-flex min-h-11 flex-shrink-0 items-center justify-center gap-2 rounded-xl px-4 text-xs font-bold transition ${
              data.completed ? "bg-emerald-300/10 text-emerald-100 ring-1 ring-emerald-200/20 hover:bg-emerald-300/15" : style.button
            } disabled:cursor-not-allowed disabled:opacity-35`}
          >
            {data.completed ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" />}
            {data.completed ? "Latihan lokal selesai" : "Tandai latihan lokal selesai"}
          </button>
        </div>
        {!canComplete && !data.completed && (
          <p className="mt-2 text-right text-[10px] text-white/30">
            Isi referensi dan centang semua checklist{allStepsComplete ? "." : " sebelum menandai selesai."}
          </p>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onPrevious}
          disabled={!hasPrevious}
          data-testid="button-practice-previous"
          className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-xs font-bold text-white/45 transition hover:text-white/75 disabled:invisible"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Sebelumnya
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!hasNext || !data.completed}
          data-testid="button-practice-next"
          className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-xs font-bold text-white/45 transition hover:text-white/75 disabled:invisible"
        >
          Berikutnya <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </section>
  );
}

export default function ActivePracticeMode() {
  const [state, setState] = useState(readPracticeState);
  const [saveTick, setSaveTick] = useState(0);
  const activeCategory = PRACTICE_CATEGORIES.find((category) => category.id === state.activeCategoryId) || PRACTICE_CATEGORIES[0];
  const activeIndex = PRACTICE_CATEGORIES.findIndex((category) => category.id === activeCategory.id);
  const activeData = state.categories[activeCategory.id] || getDefaultCategoryState(activeCategory);
  const completedCount = useMemo(
    () => PRACTICE_CATEGORIES.filter((category) => state.categories[category.id]?.completed).length,
    [state.categories],
  );
  const percent = Math.round((completedCount / PRACTICE_CATEGORIES.length) * 100);

  useEffect(() => {
    try {
      window.localStorage.setItem(PRACTICE_STORAGE_KEY, JSON.stringify(state));
      setSaveTick((current) => current + 1);
    } catch {
      // The practice path remains usable in memory if browser storage is blocked.
    }
  }, [state]);

  function updateActiveCategory(patch) {
    setState((current) => {
      const currentData = current.categories[activeCategory.id] || getDefaultCategoryState(activeCategory);
      return {
        ...current,
        categories: {
          ...current.categories,
          [activeCategory.id]: { ...currentData, ...patch, updatedAt: Date.now() },
        },
      };
    });
  }

  function toggleStep(stepId) {
    updateActiveCategory({
      steps: { ...activeData.steps, [stepId]: !activeData.steps[stepId] },
    });
  }

  function isUnlocked(index) {
    return index === 0 || state.categories[PRACTICE_CATEGORIES[index - 1].id]?.completed === true;
  }

  function selectCategory(id) {
    const index = PRACTICE_CATEGORIES.findIndex((category) => category.id === id);
    if (index < 0 || !isUnlocked(index)) return;
    setState((current) => ({ ...current, activeCategoryId: id }));
  }

  function completeActive() {
    const requiredFields = activeCategory.fields.every((field) => (activeData.inputs[field.key] || "").trim());
    const checklistDone = activeCategory.steps.every((step) => activeData.steps[step.id]);
    if (!activeData.platform.trim() || !requiredFields || !checklistDone) return;
    updateActiveCategory({ completed: true });
    const nextCategory = PRACTICE_CATEGORIES[activeIndex + 1];
    if (nextCategory) setState((current) => ({ ...current, activeCategoryId: nextCategory.id }));
  }

  function moveBy(offset) {
    const nextIndex = activeIndex + offset;
    const nextCategory = PRACTICE_CATEGORIES[nextIndex];
    if (nextCategory && isUnlocked(nextIndex)) selectCategory(nextCategory.id);
  }

  const canComplete = Boolean(
    activeData.platform.trim()
      && activeCategory.fields.every((field) => (activeData.inputs[field.key] || "").trim())
      && activeCategory.steps.every((step) => activeData.steps[step.id]),
  );

  return (
    <div data-testid="active-practice-mode">
      <section className="border-b border-white/[0.10] pb-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200/65">Mulai dari simulasi lokal</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-black leading-[1.02] tracking-[-0.05em] text-white sm:text-5xl">
              Dari membaca brief ke memahami aksi.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/50">
              Satu kategori, satu latihan, satu keputusan pada satu waktu. Wallet dan testnet baru masuk setelah fondasi ini siap.
            </p>
          </div>
          <div className="min-w-[170px] border-l border-blue-300/20 pl-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">Latihan aktif</span>
              <span className="text-sm font-semibold text-blue-100/80" data-testid="text-practice-progress">{completedCount}/{PRACTICE_CATEGORIES.length}</span>
            </div>
            <div className="mt-3 h-1 overflow-hidden bg-white/[0.09]">
              <div className="h-full bg-blue-300/80 transition-all duration-500" style={{ width: `${percent}%` }} />
            </div>
            <p className="mt-3 text-xs text-white/40" data-testid="text-practice-progress-label">{percent}% tersimpan di browser ini</p>
          </div>
        </div>
        <div className="mt-5 flex items-start gap-3 rounded-xl border border-blue-200/15 bg-blue-200/[0.035] p-3.5">
          <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-100/70" />
          <p className="text-xs leading-5 text-blue-50/55">
            Mode ini belum terhubung ke smart contract. Tidak ada address, token, stablecoin, gas, signature, atau klaim hasil yang dibuat.
          </p>
        </div>
      </section>

      <div className="mt-8 md:hidden">
        <label htmlFor="practice-category-select" className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">Pilih kategori latihan</label>
        <select
          id="practice-category-select"
          value={activeCategory.id}
          onChange={(event) => selectCategory(event.target.value)}
          data-testid="select-practice-category"
          className="min-h-11 w-full rounded-xl border border-white/[0.10] bg-[#111823] px-3 text-sm text-white outline-none focus:border-blue-300/45"
        >
          {PRACTICE_CATEGORIES.map((category, index) => (
            <option key={category.id} value={category.id} disabled={!isUnlocked(index)}>
              {category.index} · {category.shortLabel}{isUnlocked(index) ? "" : " · terkunci"}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-[220px_minmax(0,1fr)] md:items-start">
        <aside className="hidden overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] md:block" aria-label="Urutan kategori latihan">
          <div className="border-b border-white/[0.08] px-3 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/35">Urutan aksi</p>
            <p className="mt-1 text-[11px] leading-5 text-white/35">Selesaikan satu per satu.</p>
          </div>
          {PRACTICE_CATEGORIES.map((category, index) => (
            <PracticeCategoryRow
              key={category.id}
              category={category}
              active={activeCategory.id === category.id}
              completed={state.categories[category.id]?.completed === true}
              unlocked={isUnlocked(index)}
              onSelect={selectCategory}
            />
          ))}
        </aside>

        <PracticePanel
          category={activeCategory}
          data={activeData}
          onUpdate={updateActiveCategory}
          onToggleStep={toggleStep}
          onComplete={completeActive}
          canComplete={canComplete}
          onPrevious={() => moveBy(-1)}
          onNext={() => moveBy(1)}
          hasPrevious={activeIndex > 0}
          hasNext={activeIndex < PRACTICE_CATEGORIES.length - 1}
        />
      </div>

      <div className="mt-5 flex items-center gap-2 text-[10px] text-white/25" aria-live="polite" data-testid="status-practice-autosave">
        <Save className="h-3 w-3" /> Autosave lokal aktif {saveTick >= 0 ? "· tersimpan" : ""}
      </div>
    </div>
  );
}