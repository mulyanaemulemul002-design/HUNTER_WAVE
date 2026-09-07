import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  Coins,
  FlaskConical,
  Globe2,
  LockKeyhole,
  LogOut,
  Network,
  ShieldCheck,
} from "lucide-react";
import ActivePracticeMode from "./ActivePracticeMode";

const LEARNING_STORAGE_KEY = "hw_beginner_learning_v2";
const LEGACY_STORAGE_KEYS = [
  "dropmylink_beginner_progress_v1",
  "hw_beginner_progress_v1",
];

const LEARNING_STEPS = [
  {
    id: "web3",
    index: "01",
    label: "Dasar Web3",
    title: "Internet berubah bentuk",
    summary: "Mulai dari tiga era internet: membaca, berpartisipasi, dan memiliki.",
    icon: Globe2,
    accent: "blue",
    sections: [
      {
        label: "Web1 · read",
        title: "Perpustakaan di layar",
        body: "Website awal terutama menyajikan informasi. Pemilik website menentukan isinya, sementara pengunjung membaca.",
        examples: ["Homepage statis", "Blog personal", "Direktori online"],
      },
      {
        label: "Web2 · read + write",
        title: "Internet sosial",
        body: "Platform memungkinkan orang membuat konten, berkomentar, bekerja, dan berbelanja. Akun serta data biasanya dikelola oleh platform.",
        examples: ["Feed sosial", "Dokumen cloud", "Marketplace"],
      },
      {
        label: "Web3 · read + write + own",
        title: "Lapisan kepemilikan terbuka",
        body: "Wallet dapat menjadi identitas portabel, sementara blockchain menyimpan catatan bersama yang bisa dibaca aplikasi.",
        examples: ["Wallet dan DApp", "Network terbuka", "Smart contract"],
      },
    ],
    takeaway:
      "Web3 is not a replacement for the whole internet. It is an ownership and verification layer that can sit beside the web you already use.",
  },
  {
    id: "crypto",
    index: "02",
    label: "Dasar Crypto",
    title: "Kenali bagian-bagiannya",
    summary: "Pahami coin, token, wallet, network, dan gas sebelum melihat sebuah aplikasi.",
    icon: Coins,
    accent: "cyan",
    sections: [
      {
        label: "Coin",
        title: "Aset bawaan network",
        body: "Coin adalah aset milik network-nya sendiri dan dapat dipakai untuk membayar pekerjaan yang diproses network tersebut.",
        examples: ["ETH di Ethereum", "Aset native network", "Sering dipakai untuk gas"],
      },
      {
        label: "Token",
        title: "Dibuat di atas network",
        body: "Token adalah aset yang dibuat melalui contract di network yang sudah ada. Simbol yang sama dapat muncul di lebih dari satu network.",
        examples: ["Stablecoin", "Kredit aplikasi", "Aset governance"],
      },
      {
        label: "Wallet · network · gas",
        title: "Kunci, jalan, dan eksekusi",
        body: "Wallet mengelola kunci untuk sign, network membawa instruksi, dan gas adalah biaya network untuk menjalankannya.",
        examples: ["Rahasiakan seed phrase", "Cocokkan network", "Baca sebelum sign"],
      },
    ],
    takeaway:
      "A wallet is not a bank account. Keep the key private, verify the network, and treat every signature as a decision.",
  },
  {
    id: "airdrop",
    index: "03",
    label: "Dasar Airdrop",
    title: "Baca aturan sebelum membuka link",
    summary: "Pahami campaign, task, eligibility, snapshot, dan risiko tanpa terburu-buru.",
    icon: Network,
    accent: "amber",
    sections: [
      {
        label: "Campaign",
        title: "Sekumpulan aturan yang dipublikasikan",
        body: "Campaign adalah rencana publik sebuah project untuk mengajak partisipasi. Baca sumber, tanggal, network, dan syaratnya terlebih dahulu.",
        examples: ["Pengumuman resmi", "Periode yang jelas", "Network yang disebutkan"],
      },
      {
        label: "Task · eligibility",
        title: "Aktivitas bukan jaminan",
        body: "Task adalah aktivitas yang dijelaskan oleh project. Eligibility adalah keputusan project tentang siapa yang memenuhi aturannya.",
        examples: ["Baca dokumentasi", "Gunakan aplikasi", "Cek kriterianya"],
      },
      {
        label: "Snapshot · risiko",
        title: "Catatan dan ketidakpastiannya",
        body: "Snapshot adalah catatan yang diambil pada waktu tertentu. Snapshot tidak menjanjikan hasil, dan setiap link atau biaya membawa risiko.",
        examples: ["Pastikan batas waktunya", "Cek domain", "Berhenti jika detail berubah"],
      },
    ],
    takeaway:
      "Do your own research. No campaign is worth giving away a seed phrase, approving an unknown contract, or ignoring a warning sign.",
  },
  {
    id: "lab",
    index: "04",
    label: "Lab latihan",
    title: "Pelajari dua project fiktif",
    summary: "Gunakan AstraDrop dan NovaSwap sebagai contoh latihan. Tidak ada bagian yang terhubung ke product nyata.",
    icon: FlaskConical,
    accent: "violet",
    sections: [
      {
        label: "AstraDrop · fiktif",
        title: "Baca contoh campaign",
        body: "Bayangkan AstraDrop menerbitkan campaign dengan task membaca, tanggal snapshot, dan checklist eligibility.",
        examples: ["Cari sumber resmi", "Pisahkan task dari hasil", "Catat risikonya"],
      },
      {
        label: "NovaSwap · fiktif",
        title: "Baca contoh swap",
        body: "Bayangkan NovaSwap menampilkan quote antara dua aset rekaan. Baca network, biaya, permission, dan price impact sebelum memutuskan.",
        examples: ["Bandingkan network", "Baca permission", "Perhatikan price impact"],
      },
    ],
    takeaway:
      "AstraDrop and NovaSwap are analogies for practice only. This lab does not connect a wallet, use a token, or send a real transaction.",
  },
];

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

function readLearningState() {
  const empty = { completed: [] };
  try {
    const saved = JSON.parse(window.localStorage.getItem(LEARNING_STORAGE_KEY) || "null");
    if (!saved || typeof saved !== "object" || !Array.isArray(saved.completed)) return empty;
    return {
      completed: saved.completed.filter((id) => LEARNING_STEPS.some((step) => step.id === id)),
    };
  } catch {
    return empty;
  }
}

function removeLegacyState() {
  try {
    LEGACY_STORAGE_KEYS.forEach((key) => window.localStorage.removeItem(key));
  } catch {
    // The learning path still works for this session if browser storage is blocked.
  }
}

function StepButton({ step, stepIndex, open, completed, unlocked, onClick }) {
  const Icon = step.icon;
  const style = ACCENT_STYLES[step.accent];
  return (
    <button
      type="button"
      onClick={() => unlocked && onClick(step.id)}
      disabled={!unlocked}
      aria-expanded={open}
      aria-controls={`beginner-drawer-content-${step.id}`}
      data-testid={`button-beginner-drawer-${step.id}`}
      className={`group relative flex min-h-[76px] w-full items-center gap-3 border-b border-white/[0.09] px-1 py-4 text-left transition last:border-b-0 ${
        unlocked ? "hover:bg-white/[0.025]" : "cursor-not-allowed opacity-35"
      }`}
    >
      <span className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ring-1 ${style.icon}`}>
        {completed ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-white/30">
          {step.index} / {step.label}
        </span>
        <span className="mt-1 block text-sm font-semibold text-white/85">{step.title}</span>
      </span>
      {completed && <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-300/80" />}
      {!unlocked && <LockKeyhole className="h-4 w-4 flex-shrink-0 text-white/30" />}
      {unlocked && (
        <ChevronDown className={`h-4 w-4 flex-shrink-0 text-white/30 transition-transform ${open ? "rotate-180" : ""}`} />
      )}
    </button>
  );
}

function InnerSectionButton({ section, index, open, style, onClick, stepId }) {
  return (
    <button
      type="button"
      onClick={() => onClick(index)}
      aria-expanded={open}
      aria-controls={`beginner-inner-content-${stepId}-${index}`}
      data-testid={`button-beginner-inner-${stepId}-${index}`}
      className={`flex min-h-14 w-full items-center gap-3 px-3 py-3 text-left transition ${
        open ? "bg-white/[0.045]" : "hover:bg-white/[0.025]"
      }`}
    >
      <span className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-[10px] font-black ring-1 ${style.icon}`}>
        0{index + 1}
      </span>
      <span className="min-w-0 flex-1">
        <span className={`block text-[10px] font-bold uppercase tracking-[0.14em] ${style.eyebrow}`}>{section.label}</span>
        <span className="mt-1 block text-xs font-semibold text-white/75">{section.title}</span>
      </span>
      <ChevronDown className={`h-4 w-4 flex-shrink-0 text-white/30 transition-transform ${open ? "rotate-180" : ""}`} />
    </button>
  );
}

function DrawerContent({ step, completed, onComplete }) {
  const style = ACCENT_STYLES[step.accent];
  const isLab = step.id === "lab";
  const [openSectionIndex, setOpenSectionIndex] = useState(null);
  const openSection = openSectionIndex === null ? null : step.sections[openSectionIndex];
  const labCopy = {
    "AstraDrop · fiktif": {
      name: "AstraDrop",
      kicker: "Contoh campaign fiktif",
      description:
        "AstraDrop adalah contoh rekaan. Anggap brief publiknya meminta kamu membaca panduan, mencatat tanggal snapshot, dan memeriksa aturan eligibility.",
      checklist: ["Cari sumber yang menerbitkan brief", "Pisahkan task dari hasil", "Berhenti jika link meminta rahasia"],
    },
    "NovaSwap · fiktif": {
      name: "NovaSwap",
      kicker: "Contoh exchange fiktif",
      description:
        "NovaSwap adalah contoh rekaan. Anggap layarnya menampilkan quote antara dua aset rekaan agar kamu bisa berlatih membaca network, permission, dan price impact.",
      checklist: ["Cek network yang disebutkan", "Baca permission yang diminta", "Anggap quote sebagai informasi, bukan janji"],
    },
  }[openSection?.label];

  return (
    <div id={`beginner-drawer-content-${step.id}`} data-testid={`beginner-drawer-content-${step.id}`} className="pb-6 pl-12 pr-1 pt-1">
      <p className="max-w-2xl text-sm leading-7 text-white/60">{step.summary}</p>
      <div className="mt-5 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d131e]">
        <div className="border-b border-white/[0.08] px-3 py-2.5">
          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/30">Materi di dalam bagian ini</p>
          <p className="mt-1 text-[11px] text-white/40">Buka satu topik kecil agar fokus tetap singkat.</p>
        </div>
        <div className="divide-y divide-white/[0.08]">
          {step.sections.map((section, index) => {
            const open = openSectionIndex === index;
            return (
              <div key={section.label} data-testid={`beginner-inner-drawer-${step.id}-${index}`}>
                <InnerSectionButton
                  section={section}
                  index={index}
                  open={open}
                  style={style}
                  stepId={step.id}
                  onClick={(nextIndex) => setOpenSectionIndex((current) => current === nextIndex ? null : nextIndex)}
                />
                {open && (
                  <article
                    id={`beginner-inner-content-${step.id}-${index}`}
                    data-testid={`beginner-inner-content-${step.id}-${index}`}
                    className="border-t border-white/[0.07] bg-black/10 px-3 pb-4 pt-3 sm:px-4"
                  >
                    <p className="text-xs leading-6 text-white/50">{section.body}</p>
                    <ul className="mt-3 grid gap-2 sm:grid-cols-3">
                      {section.examples.map((example) => (
                        <li key={example} className="flex items-start gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] p-2.5 text-[11px] leading-5 text-white/55">
                          <span className={`mt-2 h-1 w-1 flex-shrink-0 rounded-full ${style.line}`} />
                          {example}
                        </li>
                      ))}
                    </ul>
                    {isLab && labCopy && (
                      <div className="mt-4 rounded-xl border border-violet-200/15 bg-violet-200/[0.035] p-3.5" data-testid="fictional-practice-lab">
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-violet-200/10 text-violet-100 ring-1 ring-violet-200/15">
                            <FlaskConical className="h-3.5 w-3.5" />
                          </span>
                          <div>
                            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-violet-100/55">{labCopy.kicker}</p>
                            <h4 className="mt-0.5 text-base font-semibold text-white/90">{labCopy.name}</h4>
                          </div>
                        </div>
                        <p className="mt-3 text-xs leading-6 text-white/50">{labCopy.description}</p>
                        <div className="mt-3 grid gap-2 sm:grid-cols-3">
                          {labCopy.checklist.map((item, checklistIndex) => (
                            <div key={item} className="rounded-lg border border-white/[0.07] bg-black/15 p-2.5">
                              <span className="text-[9px] font-bold text-violet-100/50">0{checklistIndex + 1}</span>
                              <p className="mt-1.5 text-[10px] leading-5 text-white/55">{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </article>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className={`mt-5 flex flex-col gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between ${style.soft}`}>
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-300/75" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-100/65">Tetap offline</p>
            <p className="mt-1 max-w-xl text-xs leading-5 text-white/45">
              Ini hanya latihan membaca. Tidak ada wallet connection, token, atau transaksi nyata.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onComplete(step.id)}
          data-testid={`button-complete-beginner-${step.id}`}
          className={`inline-flex min-h-10 flex-shrink-0 items-center justify-center gap-2 rounded-xl px-4 text-xs font-bold transition ${completed ? "bg-emerald-300/10 text-emerald-100 ring-1 ring-emerald-200/20 hover:bg-emerald-300/15" : style.button}`}
        >
          {completed ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" />}
          {completed ? "Sudah dibaca" : "Tandai selesai dibaca"}
        </button>
      </div>
    </div>
  );
}

function BeginnerMode({ onExit }) {
  const [progress, setProgress] = useState(readLearningState);
  const [openId, setOpenId] = useState(null);
  const [activeMode, setActiveMode] = useState("read");

  useEffect(() => {
    removeLegacyState();
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(LEARNING_STORAGE_KEY, JSON.stringify({ completed: progress.completed }));
    } catch {
      // Completion remains available in memory when browser storage is blocked.
    }
  }, [progress]);

  const completedSet = useMemo(() => new Set(progress.completed), [progress.completed]);
  const completedCount = progress.completed.length;
  const percent = Math.round((completedCount / LEARNING_STEPS.length) * 100);

  function isUnlocked(index) {
    return index === 0 || completedSet.has(LEARNING_STEPS[index - 1].id);
  }

  function toggleDrawer(id) {
    const index = LEARNING_STEPS.findIndex((step) => step.id === id);
    if (index < 0 || !isUnlocked(index)) return;
    setOpenId((current) => (current === id ? null : id));
  }

  function completeStep(id) {
    setProgress((current) => (
      current.completed.includes(id)
        ? current
        : { completed: [...current.completed, id] }
    ));
    setOpenId(null);
  }

  return (
    <div className="fixed inset-0 z-[500] w-full max-w-full overflow-x-hidden overflow-y-auto bg-[#070a10] text-white" data-testid="beginner-mode">
      <div className="min-h-full bg-[radial-gradient(circle_at_78%_0%,rgba(30,64,175,0.13),transparent_30%)]">
        <header className="sticky top-0 z-30 border-b border-white/[0.08] bg-[#070a10]/90 backdrop-blur-xl">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <img src="/logo.jpg" alt="HUNTER WAVE" className="h-9 w-9 flex-shrink-0 rounded-xl object-cover ring-1 ring-blue-300/25" />
              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-blue-200/65">HUNTER WAVE</p>
                <h1 className="truncate text-sm font-black tracking-[0.08em] text-white sm:text-base">BEGINNER MODE</h1>
              </div>
            </div>
            <button type="button" onClick={onExit} data-testid="button-exit-beginner-mode" className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-white/[0.06] px-3 text-xs font-bold text-white/65 ring-1 ring-white/10 transition hover:bg-white/[0.11] hover:text-white">
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Kembali ke HUNTER WAVE</span>
              <span className="sm:hidden">Keluar</span>
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-8 pb-14 sm:px-6 sm:py-12">
          <div className="mb-8 flex rounded-2xl border border-white/[0.08] bg-white/[0.025] p-1" role="tablist" aria-label="Mode belajar">
            <button
              type="button"
              role="tab"
              aria-selected={activeMode === "read"}
              onClick={() => setActiveMode("read")}
              data-testid="button-beginner-mode-read-only"
              className={`min-h-11 flex-1 rounded-xl px-3 text-xs font-bold transition ${activeMode === "read" ? "bg-white/[0.10] text-white" : "text-white/40 hover:text-white/70"}`}
            >
              Read Only
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeMode === "practice"}
              onClick={() => setActiveMode("practice")}
              data-testid="button-beginner-mode-active-practice"
              className={`min-h-11 flex-1 rounded-xl px-3 text-xs font-bold transition ${activeMode === "practice" ? "bg-blue-300/15 text-blue-100" : "text-white/40 hover:text-white/70"}`}
            >
              Active Practice
            </button>
          </div>

          {activeMode === "practice" ? (
            <ActivePracticeMode />
          ) : (
            <>
          <section className="grid gap-8 border-b border-white/[0.10] pb-10 lg:grid-cols-[1fr_240px] lg:items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200/65">Mulai dengan tenang</p>
              <h2 className="mt-4 max-w-2xl text-4xl font-black leading-[0.98] tracking-[-0.05em] text-white sm:text-6xl">
                Kenali bahasanya sebelum membaca petanya.
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-white/50 sm:text-base">
                 Empat bagian singkat membawamu dari sejarah internet ke lab latihan fiktif. Buka laci kecil di dalam setiap bagian agar belajar tetap fokus.
              </p>
            </div>
            <div className="border-l border-blue-300/20 pl-4 lg:mb-1">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">Jalur belajar</span>
                <span className="text-sm font-semibold text-blue-100/80" data-testid="text-beginner-progress">{percent}%</span>
              </div>
              <div className="mt-3 h-1 overflow-hidden bg-white/[0.09]">
                <div className="h-full bg-blue-300/80 transition-all duration-500" style={{ width: `${percent}%` }} />
              </div>
              <p className="mt-3 text-xs leading-5 text-white/40" data-testid="text-beginner-progress-label">
                {completedCount} dari {LEARNING_STEPS.length} bagian selesai
              </p>
            </div>
          </section>

          <section className="mt-10" data-testid="beginner-learning-path">
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">Urutan belajar</p>
                <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-white/90">Buka bagian berikutnya saat siap.</h3>
              </div>
               <span className="hidden text-[10px] text-white/30 sm:block">Laci kecil terbuka satu per satu</span>
            </div>
            <div className="border-y border-white/[0.09]">
              {LEARNING_STEPS.map((step, index) => {
                const open = openId === step.id;
                const completed = completedSet.has(step.id);
                return (
                  <div key={step.id} data-testid={`beginner-drawer-${step.id}`}>
                    <StepButton
                      step={step}
                      stepIndex={index}
                      open={open}
                      completed={completed}
                      unlocked={isUnlocked(index)}
                      onClick={toggleDrawer}
                    />
                    {open && (
                      <DrawerContent
                        step={step}
                        completed={completed}
                        onComplete={completeStep}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          <section className="mt-10 grid gap-3 border-t border-white/[0.09] pt-5 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.035] p-4">
              <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-200/70" />
              <p className="text-xs leading-6 text-white/45">Progress belajar tersimpan di browser ini. Jauhkan seed phrase dan private key dari setiap website.</p>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
              <CircleHelp className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-200/65" />
              <p className="text-xs leading-6 text-white/45">Bagian yang sudah selesai bisa dibaca kembali. Bagian berikutnya terbuka setelah bagian saat ini selesai dibaca.</p>
            </div>
          </section>

          <button type="button" onClick={onExit} data-testid="button-beginner-back-to-app" className="mt-6 inline-flex min-h-10 items-center gap-2 rounded-xl px-1 text-xs font-bold text-white/45 transition hover:text-white/80">
            <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke aplikasi
            <ArrowRight className="h-3.5 w-3.5 opacity-40" />
          </button>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default BeginnerMode;