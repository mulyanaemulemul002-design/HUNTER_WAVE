import { useMemo, useState } from "react";
import {
  AppWindow,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Gift,
  Landmark,
  Layers3,
  LockKeyhole,
  LogOut,
  Rocket,
  ShieldCheck,
  Sparkles,
  WalletCards,
  Zap,
} from "lucide-react";

const MODULES = [
  {
    id: "web3",
    eyebrow: "START HERE",
    title: "Web3 101",
    shortTitle: "Dasar Web3",
    description: "Kenali cara internet terbuka bekerja, tanpa istilah rumit.",
    icon: BookOpen,
    tone: "blue",
    available: true,
    lessons: ["Web2 vs Web3", "Blockchain secara sederhana", "Wallet bukan bank"],
  },
  {
    id: "wallet",
    eyebrow: "FOUNDATION",
    title: "Crypto & Wallet",
    shortTitle: "Crypto & Wallet",
    description: "Pahami aset digital dan cara menjaga wallet tetap aman.",
    icon: WalletCards,
    tone: "cyan",
    available: true,
    lessons: ["Coin, token, dan network", "Seed phrase", "Approval dan signature"],
  },
  {
    id: "airdrop",
    eyebrow: "YOUR FIRST QUEST",
    title: "Airdrop Basics",
    shortTitle: "Airdrop",
    description: "Mulai berburu campaign dengan checklist yang lebih aman.",
    icon: Gift,
    tone: "amber",
    available: true,
    lessons: ["Cara membaca campaign", "Cek link resmi", "DYOR dan anti-scam"],
  },
  {
    id: "dapp",
    eyebrow: "NEXT STEP",
    title: "Berinteraksi dengan DApp",
    shortTitle: "DApp",
    description: "Pelajari apa yang terjadi saat wallet terhubung ke aplikasi.",
    icon: AppWindow,
    tone: "violet",
    available: false,
    lessons: ["Connect wallet", "Signature vs transaction", "Membaca permission"],
  },
  {
    id: "defi",
    eyebrow: "ON-CHAIN FINANCE",
    title: "DeFi & DEX",
    shortTitle: "DeFi / DEX",
    description: "Kenali swap, liquidity pool, slippage, dan risiko protokol.",
    icon: Layers3,
    tone: "green",
    available: false,
    lessons: ["Swap dan liquidity", "Price impact", "Rug pull dan smart contract risk"],
  },
  {
    id: "perps",
    eyebrow: "ADVANCED",
    title: "Perps & Risk",
    shortTitle: "Perps",
    description: "Pahami leverage sebelum menyentuh produk derivatif.",
    icon: Zap,
    tone: "rose",
    available: false,
    lessons: ["Leverage", "Margin dan liquidation", "Risk management"],
  },
  {
    id: "smart-contract",
    eyebrow: "LAB COMING SOON",
    title: "Smart Contract",
    shortTitle: "Smart Contract",
    description: "Baca dan pahami transaksi contract sebelum membuat interaksi.",
    icon: Landmark,
    tone: "slate",
    available: false,
    lessons: ["Contract address", "Read vs write", "Gas dan confirmation"],
  },
];

const TONE_STYLES = {
  blue: {
    icon: "bg-blue-500/15 text-blue-300 ring-blue-400/25",
    glow: "from-blue-500/20 to-transparent",
    chip: "bg-blue-500/10 text-blue-200 ring-blue-400/20",
  },
  cyan: {
    icon: "bg-cyan-500/15 text-cyan-300 ring-cyan-400/25",
    glow: "from-cyan-500/20 to-transparent",
    chip: "bg-cyan-500/10 text-cyan-200 ring-cyan-400/20",
  },
  amber: {
    icon: "bg-amber-500/15 text-amber-300 ring-amber-400/25",
    glow: "from-amber-500/20 to-transparent",
    chip: "bg-amber-500/10 text-amber-200 ring-amber-400/20",
  },
  violet: {
    icon: "bg-violet-500/15 text-violet-300 ring-violet-400/25",
    glow: "from-violet-500/20 to-transparent",
    chip: "bg-violet-500/10 text-violet-200 ring-violet-400/20",
  },
  green: {
    icon: "bg-emerald-500/15 text-emerald-300 ring-emerald-400/25",
    glow: "from-emerald-500/20 to-transparent",
    chip: "bg-emerald-500/10 text-emerald-200 ring-emerald-400/20",
  },
  rose: {
    icon: "bg-rose-500/15 text-rose-300 ring-rose-400/25",
    glow: "from-rose-500/20 to-transparent",
    chip: "bg-rose-500/10 text-rose-200 ring-rose-400/20",
  },
  slate: {
    icon: "bg-white/[0.08] text-white/60 ring-white/15",
    glow: "from-white/10 to-transparent",
    chip: "bg-white/[0.06] text-white/55 ring-white/10",
  },
};

function ModuleIcon({ module, className = "h-4 w-4" }) {
  const Icon = module.icon;
  return <Icon className={className} />;
}

function BeginnerModuleCard({ module, active, completed, onSelect }) {
  const style = TONE_STYLES[module.tone];
  return (
    <button
      type="button"
      onClick={() => onSelect(module.id)}
      data-testid={`button-beginner-module-${module.id}`}
      className={`group relative w-full overflow-hidden rounded-2xl border p-3 text-left transition-all ${
        active
          ? "border-blue-400/45 bg-blue-500/[0.11] shadow-lg shadow-blue-950/20"
          : "border-white/[0.08] bg-white/[0.035] hover:border-white/[0.18] hover:bg-white/[0.07]"
      }`}
    >
      <div className={`absolute inset-x-0 top-0 h-20 bg-gradient-to-b ${style.glow} opacity-40`} />
      <div className="relative flex items-center gap-3">
        <span className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ring-1 ${style.icon}`}>
          <ModuleIcon module={module} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-1.5">
            <span className="truncate text-xs font-bold text-white/90">{module.shortTitle}</span>
            {completed && <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-emerald-300" />}
          </span>
          <span className="mt-1 block text-[10px] text-white/35">{module.available ? "Materi tersedia" : "Segera hadir"}</span>
        </span>
        {module.available ? <ChevronRight className="h-4 w-4 flex-shrink-0 text-white/25 transition group-hover:translate-x-0.5 group-hover:text-white/60" /> : <LockKeyhole className="h-3.5 w-3.5 flex-shrink-0 text-white/25" />}
      </div>
    </button>
  );
}

function BeginnerMode({ onExit }) {
  const [activeId, setActiveId] = useState("web3");
  const [completed, setCompleted] = useState([]);
  const activeModule = MODULES.find((module) => module.id === activeId) || MODULES[0];
  const activeStyle = TONE_STYLES[activeModule.tone];
  const completedCount = completed.length;
  const progress = Math.round((completedCount / 3) * 100);
  const unlockedModules = useMemo(() => MODULES.filter((module) => module.available), []);

  function selectModule(id) {
    const selected = MODULES.find((module) => module.id === id);
    if (selected?.available) setActiveId(id);
  }

  function completeActiveModule() {
    if (!activeModule.available) return;
    setCompleted((current) => current.includes(activeModule.id) ? current : [...current, activeModule.id]);
  }

  return (
    <div className="fixed inset-0 z-[500] overflow-y-auto bg-[#07090e] text-white" data-testid="beginner-mode">
      <div className="min-h-full bg-[radial-gradient(circle_at_15%_0%,rgba(37,99,235,0.20),transparent_28%),radial-gradient(circle_at_90%_30%,rgba(14,165,233,0.09),transparent_24%)]">
        <header className="sticky top-0 z-30 border-b border-white/[0.08] bg-[#07090e]/90 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <img src="/logo.jpg" alt="HUNTER WAVE" className="h-9 w-9 flex-shrink-0 rounded-xl object-cover ring-1 ring-blue-400/30" />
              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-blue-300/70">HUNTER WAVE</p>
                <h1 className="truncate text-sm font-black tracking-wide text-white sm:text-base">BEGINNER MODE</h1>
              </div>
              <span className="hidden rounded-full bg-emerald-500/10 px-2 py-1 text-[9px] font-bold text-emerald-200 ring-1 ring-emerald-400/20 sm:inline-flex">SAFE START</span>
            </div>
            <button
              type="button"
              onClick={onExit}
              data-testid="button-exit-beginner-mode"
              className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-white/[0.07] px-3 text-xs font-bold text-white/70 ring-1 ring-white/10 transition hover:bg-white/[0.13] hover:text-white"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Kembali ke HUNTER WAVE</span>
              <span className="sm:hidden">Keluar</span>
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-6 pb-12 sm:px-6 sm:py-8 lg:px-8">
          <section className="relative overflow-hidden rounded-[2rem] border border-blue-400/25 bg-gradient-to-br from-blue-950/75 via-[#101727] to-[#0b111d] p-5 shadow-2xl shadow-blue-950/20 sm:p-8">
            <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-blue-500/15 blur-3xl" />
            <div className="relative grid gap-6 lg:grid-cols-[1fr_280px] lg:items-end">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-200 ring-1 ring-blue-300/20">
                  <Sparkles className="h-3 w-3" /> Jalur belajar pemula
                </span>
                <h2 className="mt-4 max-w-xl text-3xl font-black leading-[1.02] tracking-[-0.04em] text-white sm:text-5xl">
                  Pelan-pelan memahami Web3, tanpa takut salah langkah.
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-blue-100/55 sm:text-base">
                  Mulai dari konsep paling dasar, kenali risikonya, lalu naik level saat kamu sudah siap. Tidak ada wallet yang perlu disambungkan di sini.
                </p>
                <div className="mt-6 flex flex-wrap gap-2 text-[10px] text-white/45">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-2.5 py-1.5 ring-1 ring-white/10"><ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />Safety first</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-2.5 py-1.5 ring-1 ring-white/10"><BookOpen className="h-3.5 w-3.5 text-blue-300" />Bahasa sederhana</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-2.5 py-1.5 ring-1 ring-white/10"><Rocket className="h-3.5 w-3.5 text-amber-300" />Berbasis praktik</span>
                </div>
              </div>
              <div className="rounded-2xl border border-white/[0.10] bg-black/20 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">Progress kamu</span>
                  <span className="text-sm font-black text-blue-200">{progress}%</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.08]">
                  <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-300 transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
                <p className="mt-3 text-xs leading-relaxed text-white/45">{completedCount} dari {unlockedModules.length} materi dasar selesai</p>
                <div className="mt-4 flex items-center gap-2 text-[10px] text-emerald-200/70"><ShieldCheck className="h-3.5 w-3.5" />Tidak ada transaksi nyata</div>
              </div>
            </div>
          </section>

          <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
            <aside>
              <div className="mb-3 flex items-center justify-between px-1">
                <div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-300/60">Learning path</p><h3 className="mt-1 text-base font-bold text-white">Peta perjalananmu</h3></div>
                <span className="text-[10px] text-white/30">{MODULES.length} modul</span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 lg:block lg:space-y-2 lg:overflow-visible">
                {MODULES.map((module) => <BeginnerModuleCard key={module.id} module={module} active={activeId === module.id} completed={completed.includes(module.id)} onSelect={selectModule} />)}
              </div>
            </aside>

            <section className="min-w-0">
              <div className={`relative overflow-hidden rounded-[2rem] border border-white/[0.10] bg-gradient-to-br ${activeStyle.glow} via-white/[0.025] to-white/[0.02] p-5 sm:p-7`}>
                <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/[0.03] blur-2xl" />
                <div className="relative">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl ring-1 ${activeStyle.icon}`}><ModuleIcon module={activeModule} className="h-5 w-5" /></div>
                      <div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">{activeModule.eyebrow}</p><h3 className="mt-1 text-2xl font-black tracking-[-0.03em] text-white">{activeModule.title}</h3></div>
                    </div>
                    {activeModule.available ? <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-200 ring-1 ring-emerald-400/20">Materi tersedia</span> : <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-2.5 py-1 text-[10px] font-bold text-white/45 ring-1 ring-white/10"><LockKeyhole className="h-3 w-3" />Segera hadir</span>}
                  </div>
                  <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/55">{activeModule.description}</p>

                  {activeModule.available ? (
                    <>
                      <div className="mt-6 rounded-2xl border border-white/[0.08] bg-black/15 p-4">
                        <div className="flex items-start gap-3"><CircleHelp className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-300/80" /><div><p className="text-xs font-bold text-white/80">Yang akan kamu pelajari</p><ul className="mt-3 space-y-2">{activeModule.lessons.map((lesson) => <li key={lesson} className="flex items-center gap-2 text-xs text-white/50"><span className={`h-1.5 w-1.5 rounded-full ${activeStyle.icon.split(" ")[1] || "bg-blue-300"}`} />{lesson}</li>)}</ul></div></div>
                      </div>
                      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                        <p className="text-[10px] text-white/30">Materi interaktif akan ditambahkan bertahap.</p>
                        <button type="button" onClick={completeActiveModule} data-testid={`button-complete-beginner-${activeModule.id}`} className={`inline-flex min-h-11 items-center gap-2 rounded-xl px-4 text-xs font-bold transition ${completed.includes(activeModule.id) ? "bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-400/25" : "bg-blue-500 text-white hover:bg-blue-400"}`}>
                          {completed.includes(activeModule.id) ? <Check className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
                          {completed.includes(activeModule.id) ? "Materi selesai" : "Tandai untuk selesai"}
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="mt-6 rounded-2xl border border-dashed border-white/[0.12] bg-black/15 p-5">
                      <div className="flex items-start gap-3"><LockKeyhole className="mt-0.5 h-5 w-5 flex-shrink-0 text-white/30" /><div><p className="text-sm font-bold text-white/75">Modul ini sedang dipersiapkan</p><p className="mt-2 text-xs leading-relaxed text-white/40">Interface dan materi dasarnya sudah disiapkan lebih dulu. Interaksi wallet, DApp, DeFi, DEX, Perps, dan smart contract akan dibangun setelah jalur pemula ini selesai.</p><span className="mt-4 inline-flex rounded-full bg-white/[0.06] px-2.5 py-1 text-[10px] font-bold text-white/35 ring-1 ring-white/10">Coming soon · tanpa transaksi nyata</span></div></div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-emerald-400/15 bg-emerald-500/[0.05] p-4"><div className="flex items-center gap-2 text-xs font-bold text-emerald-100/80"><ShieldCheck className="h-4 w-4 text-emerald-300" />Safety checkpoint</div><p className="mt-2 text-[11px] leading-relaxed text-white/40">Jangan pernah memberikan seed phrase atau private key kepada siapa pun, termasuk website yang terlihat meyakinkan.</p></div>
                <div className="rounded-2xl border border-amber-400/15 bg-amber-500/[0.05] p-4"><div className="flex items-center gap-2 text-xs font-bold text-amber-100/80"><CircleHelp className="h-4 w-4 text-amber-300" />Belum paham?</div><p className="mt-2 text-[11px] leading-relaxed text-white/40">Kamu bisa kembali ke materi sebelumnya kapan saja. Tidak ada urutan yang mengharuskan kamu terburu-buru.</p></div>
              </div>
            </section>
          </div>

          <section className="mt-6 flex flex-col gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-300/70" /><p className="text-[11px] leading-relaxed text-white/35">Beginner Mode saat ini adalah ruang belajar. Wallet connection dan smart contract belum aktif, jadi kamu bisa mengenal konsepnya dengan tenang.</p></div>
            <button type="button" onClick={onExit} data-testid="button-beginner-back-to-app" className="inline-flex min-h-10 flex-shrink-0 items-center justify-center gap-2 rounded-xl bg-white/[0.06] px-3.5 text-xs font-bold text-white/65 ring-1 ring-white/10 hover:bg-white/[0.11] hover:text-white"><ArrowLeft className="h-3.5 w-3.5" />Kembali</button>
          </section>
        </main>
      </div>
    </div>
  );
}

export default BeginnerMode;