import { useEffect, useMemo, useState } from "react";
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

const STORAGE_KEY = "dropmylink_beginner_progress_v1";

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
    lessons: [
      {
        title: "Web2 vs Web3",
        intro: "Web3 bukan internet yang sepenuhnya baru. Ia adalah cara berbeda untuk mengatur kepemilikan, identitas, dan kepercayaan di internet.",
        points: [
          "Di Web2, akun dan data biasanya dikelola oleh satu platform. Di Web3, wallet dapat menjadi identitas yang kamu bawa antar aplikasi.",
          "Web3 memakai jaringan terbuka seperti blockchain agar catatan kepemilikan dapat diverifikasi tanpa harus percaya pada satu perusahaan.",
          "Desentralisasi bukan berarti tanpa aturan. Setiap jaringan tetap memiliki aturan, biaya, dan risiko yang perlu dipahami.",
        ],
        takeaway: "Anggap Web3 sebagai lapisan kepemilikan dan verifikasi tambahan di atas internet yang sudah kamu kenal.",
      },
      {
        title: "Blockchain secara sederhana",
        intro: "Blockchain adalah buku catatan digital yang disalin dan diperiksa oleh banyak komputer dalam sebuah jaringan.",
        points: [
          "Transaksi dikumpulkan ke dalam blok, lalu blok-blok tersebut dihubungkan secara berurutan.",
          "Setelah tercatat, perubahan pada riwayat transaksi menjadi sulit karena jaringan harus menyetujui catatan baru.",
          "Blockchain bisa membantu memverifikasi bahwa suatu aset berpindah, tetapi tidak otomatis menjamin bahwa setiap proyek itu jujur.",
        ],
        takeaway: "Blockchain memverifikasi catatan on-chain. Kamu tetap perlu memeriksa proyek, link, dan konteks di luar chain.",
      },
      {
        title: "Wallet bukan bank",
        intro: "Wallet adalah alat untuk mengelola kunci yang memberi akses ke aset on-chain. Asetnya sendiri tercatat di jaringan, bukan disimpan di aplikasi wallet.",
        points: [
          "Alamat wallet boleh dibagikan untuk menerima aset. Private key dan seed phrase tidak boleh dibagikan kepada siapa pun.",
          "Jika kehilangan seed phrase, tidak ada customer service blockchain yang dapat mereset aksesmu.",
          "Wallet hanya menandatangani tindakan. Selalu baca apa yang akan kamu setujui sebelum menekan tombol confirm.",
        ],
        takeaway: "Kekuatan utama wallet adalah kontrol langsung. Karena itu, keamanan kunci menjadi tanggung jawabmu.",
      },
    ],
    quests: [
      { id: "web3-map", title: "Buat peta Web3 pertamamu", kind: "Learn", description: "Bedakan website biasa, wallet, blockchain, dan aplikasi Web3.", points: 10 },
      { id: "web3-blockchain", title: "Susun blok transaksi", kind: "Practice", description: "Simulasi sederhana bagaimana transaksi dicatat dan diverifikasi.", points: 15 },
      { id: "web3-checkpoint", title: "Lulus checkpoint Web3", kind: "Checkpoint", description: "Jawab pertanyaan singkat untuk membuka materi wallet.", points: 20 },
    ],
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
    lessons: [
      {
        title: "Coin, token, dan network",
        intro: "Sebelum memindahkan aset, kenali perbedaan coin, token, dan network agar tidak salah tujuan.",
        points: [
          "Coin adalah aset native milik sebuah network dan biasanya dipakai untuk membayar gas, seperti ETH di Ethereum.",
          "Token dibuat di atas network yang sudah ada. Satu nama token dapat tersedia di beberapa network dengan alamat contract berbeda.",
          "Network pengirim dan penerima harus cocok. Mengirim aset lewat network yang salah dapat membuat dana sulit dipulihkan.",
        ],
        takeaway: "Selalu cek network, alamat contract, dan biaya gas sebelum mengirim atau menerima aset.",
      },
      {
        title: "Seed phrase adalah kunci utama",
        intro: "Seed phrase adalah rangkaian kata yang dapat memulihkan wallet. Siapa pun yang memilikinya dapat menguasai aset di wallet tersebut.",
        points: [
          "Tulis seed phrase secara offline dan simpan di tempat aman yang hanya kamu akses.",
          "Jangan memotretnya, menyimpannya di cloud, atau mengetikkannya ke website, chat, atau formulir apa pun.",
          "Pesan yang mengaku dari support dan meminta seed phrase adalah penipuan, tanpa pengecualian.",
        ],
        takeaway: "Tidak ada alasan yang sah untuk membagikan seed phrase. Jika diminta, berhenti dan tutup halaman itu.",
      },
      {
        title: "Approval dan signature",
        intro: "Interaksi wallet bisa berupa signature atau transaction. Keduanya perlu dibaca, tetapi dampaknya tidak selalu sama.",
        points: [
          "Signature biasanya membuktikan bahwa kamu menyetujui sebuah pesan. Signature gratis bukan berarti selalu aman.",
          "Approval memberi izin contract untuk menggunakan token tertentu atas namamu. Periksa jumlah dan contract yang diberi izin.",
          "Kamu dapat meninjau dan mencabut approval yang tidak lagi diperlukan. Hindari menyetujui unlimited tanpa alasan jelas.",
        ],
        takeaway: "Jangan menandatangani sesuatu yang tidak kamu mengerti. Berhenti jika detail di wallet terlihat berbeda dari tujuanmu.",
      },
    ],
    quests: [
      { id: "wallet-assets", title: "Kenali coin, token, dan network", kind: "Learn", description: "Pahami kenapa satu token bisa punya beberapa network dan biaya gas.", points: 15 },
      { id: "wallet-safety", title: "Temukan red flag wallet", kind: "Safety", description: "Latihan membedakan permintaan aman dan permintaan yang mencurigakan.", points: 20 },
      { id: "wallet-signature", title: "Baca sebelum sign", kind: "Practice", description: "Simulasi membaca signature dan approval tanpa menghubungkan wallet.", points: 25 },
    ],
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
    lessons: [
      {
        title: "Cara membaca campaign",
        intro: "Airdrop adalah distribusi token yang sering dipakai proyek untuk memberi insentif atau mengenalkan network. Tidak semua campaign membagikan hadiah.",
        points: [
          "Cari tahu siapa tim atau proyeknya, apa tujuannya, dan apakah pengumuman berasal dari kanal resmi.",
          "Baca syarat, snapshot, deadline, network, dan biaya yang mungkin muncul sebelum melakukan apa pun.",
          "Hadiah tidak pernah dijamin hanya karena kamu menyelesaikan sebuah task. Anggap waktu dan gas sebagai risiko yang mungkin tidak kembali.",
        ],
        takeaway: "Campaign yang baik menjelaskan aturan dan sumber resminya dengan jelas, bukan hanya menjanjikan hadiah besar.",
      },
      {
        title: "Cek link resmi",
        intro: "Banyak scam memakai nama dan tampilan yang mirip dengan proyek asli. Verifikasi alamat website sebelum menghubungkan wallet.",
        points: [
          "Buka link dari dokumentasi, akun resmi yang terverifikasi, atau komunitas tepercaya. Jangan mengandalkan iklan atau hasil pencarian teratas.",
          "Periksa ejaan domain, HTTPS, akun media sosial, dan apakah link itu konsisten di beberapa kanal resmi.",
          "Jangan pernah memasukkan seed phrase ke halaman claim. Halaman claim yang meminta seed phrase bukan halaman resmi.",
        ],
        takeaway: "Berhenti sejenak untuk memeriksa domain. Satu menit verifikasi dapat menyelamatkan seluruh isi wallet.",
      },
      {
        title: "DYOR dan anti-scam",
        intro: "DYOR berarti Do Your Own Research. Tujuannya bukan mencari kepastian, tetapi membuat keputusan dengan informasi yang cukup.",
        points: [
          "Waspadai urgency, giveaway yang meminta deposit, profit pasti, admin yang menghubungi duluan, dan kontrak yang tidak jelas.",
          "Gunakan wallet terpisah dengan saldo kecil untuk eksperimen, tetapi ingat: burner wallet tidak membuat link berbahaya menjadi aman.",
          "Sebelum confirm, cocokkan nama contract, network, nominal, dan permission. Jika ragu, jangan lanjut.",
        ],
        takeaway: "Tidak ikut campaign selalu lebih baik daripada kehilangan aset karena terburu-buru.",
      },
    ],
    quests: [
      { id: "airdrop-anatomy", title: "Baca anatomi sebuah airdrop", kind: "Learn", description: "Kenali eligibility, task, snapshot, dan distribusi dalam satu campaign.", points: 20 },
      { id: "airdrop-safety", title: "Validasi link campaign", kind: "Safety", description: "Gunakan checklist HUNTER WAVE sebelum membuka atau connect ke website.", points: 25 },
      { id: "airdrop-plan", title: "Susun rencana hunting", kind: "Practice", description: "Buat urutan task yang realistis tanpa mengejar semua campaign sekaligus.", points: 30 },
    ],
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
    quests: [
      { id: "dapp-connect", title: "Simulasi connect wallet", kind: "Simulation", description: "Pahami data apa yang boleh terlihat oleh sebuah DApp.", points: 30 },
      { id: "dapp-sign", title: "Bedakan signature dan transaction", kind: "Simulation", description: "Kenali kapan tindakan hanya sign dan kapan benar-benar mengirim transaksi.", points: 35 },
      { id: "dapp-permission", title: "Audit permission DApp", kind: "Checkpoint", description: "Latihan membaca permission sebelum membuka akses token.", points: 40 },
    ],
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
    quests: [
      { id: "defi-swap", title: "Simulasi swap pertama", kind: "Simulation", description: "Pelajari alur token masuk, token keluar, dan biaya tanpa transaksi nyata.", points: 35 },
      { id: "defi-liquidity", title: "Temukan sumber liquidity", kind: "Learn", description: "Kenali liquidity pool dan kenapa harga bisa bergerak saat swap.", points: 40 },
      { id: "defi-risk", title: "Risk scan protokol", kind: "Safety", description: "Gunakan checklist untuk membaca risiko kontrak dan liquidity.", points: 45 },
    ],
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
    quests: [
      { id: "perps-leverage", title: "Pahami leverage", kind: "Learn", description: "Lihat bagaimana leverage memperbesar peluang sekaligus kerugian.", points: 45 },
      { id: "perps-liquidation", title: "Simulasi liquidation", kind: "Simulation", description: "Eksperimen dengan margin dalam lingkungan latihan yang aman.", points: 50 },
      { id: "perps-risk", title: "Buat batas risiko", kind: "Checkpoint", description: "Tentukan kapan tidak boleh membuka posisi dan kapan harus berhenti.", points: 55 },
    ],
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
    quests: [
      { id: "contract-address", title: "Baca contract address", kind: "Learn", description: "Kenali identitas contract sebelum berinteraksi.", points: 50 },
      { id: "contract-read-write", title: "Bedakan read dan write", kind: "Simulation", description: "Pahami mana aksi yang gratis dibaca dan mana yang membutuhkan transaksi.", points: 60 },
      { id: "contract-lab", title: "Smart contract lab", kind: "On-chain lab", description: "Akan dibuka setelah lingkungan testnet HUNTER WAVE tersedia.", points: 75 },
    ],
  },
];

const BEGINNER_PROGRESS_KEY = "hw_beginner_progress_v1";

function readQuestProgress() {
  try {
    const raw = window.localStorage.getItem(BEGINNER_PROGRESS_KEY);
    if (!raw) return { completedQuestIds: [], points: 0 };
    const parsed = JSON.parse(raw);
    return {
      completedQuestIds: Array.isArray(parsed.completedQuestIds) ? parsed.completedQuestIds : [],
      points: Number.isFinite(parsed.points) ? parsed.points : 0,
    };
  } catch {
    return { completedQuestIds: [], points: 0 };
  }
}

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

const AVAILABLE_MODULES = MODULES.filter((module) => module.available);

function getInitialProgress() {
  const empty = {
    completed: {},
    currentLesson: {},
    lastModule: "web3",
  };

  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "null");
    if (!saved || typeof saved !== "object") return empty;
    return {
      completed: saved.completed && typeof saved.completed === "object" ? saved.completed : {},
      currentLesson: saved.currentLesson && typeof saved.currentLesson === "object" ? saved.currentLesson : {},
      lastModule: AVAILABLE_MODULES.some((module) => module.id === saved.lastModule) ? saved.lastModule : "web3",
    };
  } catch {
    return empty;
  }
}

function ModuleIcon({ module, className = "h-4 w-4" }) {
  const Icon = module.icon;
  return <Icon className={className} />;
}

function BeginnerModuleCard({ module, active, completedCount, completedQuestCount, onSelect }) {
  const style = TONE_STYLES[module.tone];
  const lessonCount = module.available ? module.lessons.length : 3;
  const complete = module.available && completedCount === lessonCount;
  const progressPercent = module.available ? Math.round((completedCount / lessonCount) * 100) : 0;

  return (
    <button
      type="button"
      onClick={() => onSelect(module.id)}
      disabled={!module.available}
      aria-label={`${module.shortTitle}${module.available ? `, ${completedCount} dari ${lessonCount} lesson selesai` : ", segera hadir"}`}
      data-testid={`button-beginner-module-${module.id}`}
      className={`group relative w-full overflow-hidden rounded-2xl border p-3 text-left transition-all ${
        active
          ? "border-blue-400/45 bg-blue-500/[0.11] shadow-lg shadow-blue-950/20"
          : "border-white/[0.08] bg-white/[0.035] hover:border-white/[0.18] hover:bg-white/[0.07]"
      } ${!module.available ? "cursor-not-allowed opacity-70 hover:border-white/[0.08] hover:bg-white/[0.035]" : ""}`}
    >
      <div className={`absolute inset-x-0 top-0 h-20 bg-gradient-to-b ${style.glow} opacity-40`} />
      <div className="relative flex items-center gap-3">
        <span className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ring-1 ${style.icon}`}>
          <ModuleIcon module={module} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-1.5">
            <span className="truncate text-xs font-bold text-white/90">{module.shortTitle}</span>
            {complete && <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-emerald-300" />}
          </span>
          <span className="mt-1 block text-[10px] text-white/35">
            {module.available ? `${completedCount}/${lessonCount} lesson · ${completedQuestCount}/${module.quests.length} quest` : "Segera hadir"}
          </span>
          {module.available && (
            <span className="mt-2 block h-1 overflow-hidden rounded-full bg-white/[0.08]">
              <span className="block h-full rounded-full bg-emerald-400/80 transition-all" style={{ width: `${progressPercent}%` }} />
            </span>
          )}
        </span>
        {module.available ? (
          <ChevronRight className="h-4 w-4 flex-shrink-0 text-white/25 transition group-hover:translate-x-0.5 group-hover:text-white/60" />
        ) : (
          <LockKeyhole className="h-3.5 w-3.5 flex-shrink-0 text-white/25" />
        )}
      </div>
    </button>
  );
}

function BeginnerMode({ onExit }) {
  const [progress, setProgress] = useState(getInitialProgress);
  const [questProgress, setQuestProgress] = useState(readQuestProgress);
  const [activeId, setActiveId] = useState(() => getInitialProgress().lastModule);
  const activeModule = MODULES.find((module) => module.id === activeId) || MODULES[0];
  const activeStyle = TONE_STYLES[activeModule.tone];
  const activeLessonIndex = Math.min(
    Math.max(Number.isInteger(progress.currentLesson?.[activeId]) ? progress.currentLesson[activeId] : 0, 0),
    activeModule.lessons.length - 1,
  );
  const activeLesson = activeModule.available ? activeModule.lessons[activeLessonIndex] : null;
  const totalLessons = useMemo(() => AVAILABLE_MODULES.reduce((total, module) => total + module.lessons.length, 0), []);
  const completedTotal = useMemo(
    () => AVAILABLE_MODULES.reduce((total, module) => total + getCompletedLessons(progress, module.id).length, 0),
    [progress],
  );
  const progressPercent = Math.round((completedTotal / totalLessons) * 100);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Progress remains available for this session when storage is blocked.
    }
  }, [progress]);

  function updateProgress(updater) {
    setProgress((current) => updater(current));
  }

  function selectModule(id) {
    const selected = MODULES.find((module) => module.id === id);
    if (!selected?.available) return;
    setActiveId(id);
    updateProgress((current) => ({ ...current, lastModule: id }));
  }

  function selectLesson(index) {
    updateProgress((current) => ({
      ...current,
      lastModule: activeId,
      currentLesson: { ...current.currentLesson, [activeId]: index },
    }));
  }

  function toggleLessonComplete(index = activeLessonIndex) {
    if (!activeModule.available) return;
    updateProgress((current) => {
      const completed = getCompletedLessons(current, activeId);
      const nextCompleted = completed.includes(index)
        ? completed.filter((lessonIndex) => lessonIndex !== index)
        : [...completed, index].sort((a, b) => a - b);
      return {
        ...current,
        lastModule: activeId,
        completed: { ...current.completed, [activeId]: nextCompleted },
      };
    });
  }

  function goNext() {
    if (!activeModule.available) return;
    const isComplete = getCompletedLessons(progress, activeId).includes(activeLessonIndex);
    if (!isComplete) toggleLessonComplete(activeLessonIndex);
    if (activeLessonIndex < activeModule.lessons.length - 1) selectLesson(activeLessonIndex + 1);
  }

  function goBack() {
    if (activeLessonIndex > 0) selectLesson(activeLessonIndex - 1);
  }

  const activeCompleted = activeModule.available && getCompletedLessons(progress, activeId).includes(activeLessonIndex);
  const moduleCompletedCount = activeModule.available ? getCompletedLessons(progress, activeId).length : 0;
  const completedQuestIds = questProgress.completedQuestIds;
  const points = questProgress.points;

  useEffect(() => {
    try {
      window.localStorage.setItem(BEGINNER_PROGRESS_KEY, JSON.stringify(questProgress));
    } catch {
      // Quest progress remains available for this session when storage is blocked.
    }
  }, [questProgress]);

  function completeQuest(quest) {
    if (!activeModule.available || completedQuestIds.includes(quest.id)) return;
    setQuestProgress((current) => ({
      completedQuestIds: [...current.completedQuestIds, quest.id],
      points: current.points + quest.points,
    }));
  }

  function moduleQuestCount(module) {
    return module.quests.filter((quest) => completedQuestIds.includes(quest.id)).length;
  }

  return (
    <div className="fixed inset-0 z-[500] w-full max-w-full overflow-x-hidden overflow-y-auto overscroll-x-none bg-[#07090e] text-white" style={{ touchAction: "pan-y" }} data-testid="beginner-mode">
      <div className="min-h-full w-full max-w-full overflow-x-hidden bg-[radial-gradient(circle_at_15%_0%,rgba(37,99,235,0.20),transparent_28%),radial-gradient(circle_at_90%_30%,rgba(14,165,233,0.09),transparent_24%)]">
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

        <main className="mx-auto min-w-0 max-w-6xl px-4 py-6 pb-12 sm:px-6 sm:py-8 lg:px-8">
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
                  <span className="text-sm font-black text-blue-200">{progressPercent}%</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.08]">
                  <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-300 transition-all duration-500" style={{ width: `${progressPercent}%` }} />
                </div>
                <p className="mt-3 text-xs leading-relaxed text-white/45">{completedTotal} dari {totalLessons} lesson dasar selesai</p>
                <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px] text-emerald-200/70">
                  <span className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5" />Tidak ada transaksi nyata</span>
                  <span className="flex items-center gap-1.5 text-amber-200/70"><Sparkles className="h-3.5 w-3.5" />{points} Wave Points</span>
                </div>
              </div>
            </div>
          </section>

          <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
            <aside>
              <div className="mb-3 flex items-center justify-between px-1">
                <div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-300/60">Learning path</p><h3 className="mt-1 text-base font-bold text-white">Peta perjalananmu</h3></div>
                <span className="text-[10px] text-white/30">{MODULES.length} modul</span>
              </div>
              <div className="grid min-w-0 gap-2 sm:grid-cols-2 lg:block lg:space-y-2">
                {MODULES.map((module) => (
                  <BeginnerModuleCard
                    key={module.id}
                    module={module}
                    active={activeId === module.id}
                    completedCount={getCompletedLessons(progress, module.id).length}
                    completedQuestCount={moduleQuestCount(module)}
                    onSelect={selectModule}
                  />
                ))}
              </div>
            </aside>

            <section className="min-w-0">
              <div className={`relative overflow-hidden rounded-[2rem] border border-white/[0.10] bg-gradient-to-br ${activeStyle.glow} via-white/[0.025] to-white/[0.02] p-5 sm:p-7`}>
                <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/[0.03] blur-2xl" />
                <div className="relative">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl ring-1 ${activeStyle.icon}`}><ModuleIcon module={activeModule} className="h-5 w-5" /></div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">{activeModule.eyebrow}</p>
                        <h3 className="mt-1 text-2xl font-black tracking-tight text-white">{activeModule.title}</h3>
                        <p className="mt-1 max-w-xl text-sm leading-relaxed text-white/45">{activeModule.description}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ring-1 ${activeModule.available ? activeStyle.chip : "bg-white/[0.06] text-white/40 ring-white/10"}`}>
                      {activeModule.available ? <BookOpen className="h-3 w-3" /> : <LockKeyhole className="h-3 w-3" />}
                      {activeModule.available ? `${moduleCompletedCount}/${activeModule.lessons.length} selesai` : "Coming soon"}
                    </span>
                  </div>

                  {activeModule.available ? (
                    <>
                      <div className="mt-6 flex items-center gap-2" aria-label="Pilih lesson">
                        {activeModule.lessons.map((lesson, index) => {
                          const completed = getCompletedLessons(progress, activeId).includes(index);
                          return (
                            <button
                              key={lesson.title}
                              type="button"
                              onClick={() => selectLesson(index)}
                              aria-label={`Buka lesson ${index + 1}: ${lesson.title}`}
                              aria-current={index === activeLessonIndex ? "step" : undefined}
                              data-testid={`button-beginner-lesson-${activeId}-${index + 1}`}
                              className={`group flex min-w-0 flex-1 items-center gap-2 text-left ${index === activeLessonIndex ? "text-blue-200" : "text-white/35 hover:text-white/60"}`}
                            >
                              <span className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-black ring-1 transition ${completed ? "bg-emerald-500/15 text-emerald-200 ring-emerald-400/35" : index === activeLessonIndex ? "bg-blue-500 text-white ring-blue-300/50" : "bg-white/[0.06] ring-white/10"}`}>
                                {completed ? <Check className="h-3.5 w-3.5" /> : index + 1}
                              </span>
                              <span className="hidden truncate text-[10px] font-bold sm:block">{lesson.title}</span>
                              {index < activeModule.lessons.length - 1 && <span className="mx-1 hidden h-px flex-1 bg-white/[0.10] sm:block" />}
                            </button>
                          );
                        })}
                      </div>

                      <article className="mt-6 rounded-2xl border border-white/[0.09] bg-black/20 p-5 sm:p-6" aria-live="polite">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-300/70">Lesson {activeLessonIndex + 1} dari {activeModule.lessons.length}</p>
                            <h4 className="mt-2 text-xl font-black tracking-tight text-white sm:text-2xl">{activeLesson.title}</h4>
                          </div>
                          <BookOpen className="mt-1 h-5 w-5 flex-shrink-0 text-blue-300/50" />
                        </div>
                        <p className="mt-4 text-sm leading-7 text-white/65">{activeLesson.intro}</p>
                        <ul className="mt-5 space-y-3">
                          {activeLesson.points.map((point) => (
                            <li key={point} className="flex items-start gap-3 text-sm leading-6 text-white/55">
                              <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-300/80" />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-6 rounded-xl border border-emerald-400/15 bg-emerald-500/[0.06] p-4">
                          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-200/70">Inti lesson</p>
                          <p className="mt-2 text-sm leading-6 text-emerald-50/70">{activeLesson.takeaway}</p>
                        </div>
                      </article>

                      <div className="mt-5 rounded-2xl border border-white/[0.08] bg-black/15 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-amber-300" />
                            <p className="text-xs font-bold text-white/80">Quest dalam modul</p>
                          </div>
                          <span className="text-[10px] text-white/35">{moduleQuestCount(activeModule)}/{activeModule.quests.length} selesai</span>
                        </div>
                        <div className="mt-3 grid gap-2 sm:grid-cols-3">
                          {activeModule.quests.map((quest) => {
                            const done = completedQuestIds.includes(quest.id);
                            return (
                              <div key={quest.id} className={`rounded-xl border p-3 transition ${done ? "border-emerald-400/20 bg-emerald-500/[0.06]" : "border-white/[0.07] bg-white/[0.025]"}`}>
                                <div className="flex items-start gap-2">
                                  <span className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-[10px] font-black ring-1 ${done ? "bg-emerald-500/15 text-emerald-300 ring-emerald-400/25" : activeStyle.icon}`}>
                                    {done ? <Check className="h-3.5 w-3.5" /> : quest.points}
                                  </span>
                                  <div className="min-w-0 flex-1">
                                    <p className={`text-[11px] font-bold leading-snug ${done ? "text-emerald-100/80" : "text-white/75"}`}>{quest.title}</p>
                                    <span className={`mt-1 inline-flex rounded-full px-1.5 py-0.5 text-[9px] font-bold ring-1 ${activeStyle.chip}`}>{quest.kind}</span>
                                  </div>
                                </div>
                                <p className="mt-2 text-[10px] leading-relaxed text-white/35">{quest.description}</p>
                                <button
                                  type="button"
                                  onClick={() => completeQuest(quest)}
                                  disabled={done}
                                  data-testid={`button-complete-quest-${quest.id}`}
                                  className={`mt-3 min-h-9 w-full rounded-lg px-2.5 text-[10px] font-bold transition ${done ? "cursor-default bg-emerald-500/10 text-emerald-200/70" : "bg-blue-500/15 text-blue-200 ring-1 ring-blue-400/20 hover:bg-blue-500/25"}`}
                                >
                                  {done ? "Selesai" : `+${quest.points} XP`}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                        <p className="mt-3 text-[10px] text-white/30">Quest dan point ini hanya untuk latihan, bukan token dan tidak mengirim transaksi.</p>
                      </div>

                      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => toggleLessonComplete()}
                          data-testid={`button-complete-beginner-${activeId}-${activeLessonIndex + 1}`}
                          className={`inline-flex min-h-11 items-center gap-2 rounded-xl px-4 text-xs font-bold transition ${activeCompleted ? "bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-400/25 hover:bg-emerald-500/25" : "bg-blue-500 text-white hover:bg-blue-400"}`}
                        >
                          {activeCompleted ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" />}
                          {activeCompleted ? "Lesson selesai" : "Tandai lesson selesai"}
                        </button>
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={goBack} disabled={activeLessonIndex === 0} data-testid="button-beginner-lesson-back" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-white/[0.06] px-3.5 text-xs font-bold text-white/60 ring-1 ring-white/10 transition hover:bg-white/[0.11] hover:text-white disabled:cursor-not-allowed disabled:opacity-30">
                            <ArrowLeft className="h-3.5 w-3.5" />Kembali
                          </button>
                          <button type="button" onClick={goNext} data-testid="button-beginner-lesson-next" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-white/[0.10] px-3.5 text-xs font-bold text-white/80 ring-1 ring-white/15 transition hover:bg-white/[0.16] hover:text-white">
                            {activeLessonIndex === activeModule.lessons.length - 1 ? (activeCompleted ? "Selesai" : "Tandai selesai") : (activeCompleted ? "Berikutnya" : "Selesai & lanjut")}
                            {activeLessonIndex < activeModule.lessons.length - 1 && <ArrowRight className="h-3.5 w-3.5" />}
                          </button>
                        </div>
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
                <div className="rounded-2xl border border-amber-400/15 bg-amber-500/[0.05] p-4"><div className="flex items-center gap-2 text-xs font-bold text-amber-100/80"><CircleHelp className="h-4 w-4 text-amber-300" />Belum paham?</div><p className="mt-2 text-[11px] leading-relaxed text-white/40">Kamu bisa kembali ke materi sebelumnya kapan saja. Progress lesson tersimpan otomatis di browser ini.</p></div>
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

function getCompletedLessons(progress, moduleId) {
  const raw = progress?.completed?.[moduleId];
  if (!Array.isArray(raw)) return [];
  return raw.filter((index) => Number.isInteger(index) && index >= 0);
}

export default BeginnerMode;