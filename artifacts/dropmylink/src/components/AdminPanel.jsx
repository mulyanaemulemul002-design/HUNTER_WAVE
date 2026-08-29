import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  Check,
  ChevronDown,
  ChevronUp,
  Clock3,
  Cloud,
  ExternalLink,
  Eye,
  EyeOff,
  FilePlus2,
  Github,
  LockKeyhole,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Settings2,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { AirdropSchema } from "../lib/data";

const ADMIN_PASSWORD = "HUNTERWAVE_ADMIN";
const TOKEN_STORAGE_KEY = "hw_admin_gh_token";
const CONFIG_STORAGE_KEY = "hw_admin_github_config";
const STAGING_STORAGE_KEY = "hw_admin_staging";
const GITHUB_API_ROOT = "https://api.github.com";

const STATUS_OPTIONS = ["Active", "Testnet", "Upcoming", "Mainnet", "Distributed"];
const DIFFICULTY_OPTIONS = ["Easy", "Medium", "Hard"];
const CONFIRMATION_OPTIONS = [
  { value: "confirmed", label: "Confirmed" },
  { value: "rumored", label: "Potensial" },
];

const DEFAULT_GITHUB_CONFIG = {
  owner: "mulyanaemulemul002-design",
  repo: "HUNTER_WAVE",
  path: "artifacts/dropmylink/src/data/airdrops.json",
  branch: "main",
};

function readStoredJson(key, fallback) {
  try {
    const storage = key === STAGING_STORAGE_KEY ? sessionStorage : localStorage;
    const raw = storage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function createEmptyForm() {
  return {
    title: "",
    url: "",
    icon: "",
    customImage: "",
    tags: "",
    description: "",
    status: "Active",
    difficulty: "Easy",
    confirmationStatus: "confirmed",
    howToGuide: "",
  };
}

function formFromAirdrop(item) {
  return {
    title: item.title || "",
    url: item.url || "",
    icon: item.icon || "",
    customImage: item.customImage || "",
    tags: Array.isArray(item.tags) ? item.tags.join(", ") : "",
    description: item.description || "",
    status: item.status || "Active",
    difficulty: item.difficulty || "Easy",
    confirmationStatus: item.confirmationStatus || "confirmed",
    howToGuide: Array.isArray(item.howToGuide) ? item.howToGuide.join("\n") : "",
  };
}

function splitTags(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitGuide(value) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatAddedAt(date = new Date()) {
  return date.toISOString().slice(0, 19);
}

function toFieldErrors(error) {
  if (!error?.issues) return {};
  return error.issues.reduce((result, issue) => {
    const key = String(issue.path?.[0] || "form");
    if (!result[key]) result[key] = issue.message;
    return result;
  }, {});
}

function validateAirdropList(items) {
  if (!Array.isArray(items)) throw new Error("Isi file GitHub bukan array airdrop.");
  const seen = new Set();
  const parsed = [];
  for (const item of items) {
    const result = AirdropSchema.safeParse(item);
    if (!result.success) {
      const firstIssue = result.error.issues[0];
      throw new Error(`Data GitHub tidak valid pada id ${item?.id ?? "?"}: ${firstIssue?.message || "format tidak sesuai schema."}`);
    }
    if (seen.has(result.data.id)) throw new Error(`ID duplikat ditemukan di GitHub: ${result.data.id}.`);
    seen.add(result.data.id);
    parsed.push(result.data);
  }
  return parsed;
}

function encodeBase64(value) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (let index = 0; index < bytes.length; index += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
  }
  return btoa(binary);
}

function decodeBase64(value) {
  const binary = atob(value.replace(/\s/g, ""));
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function githubFileUrl(config) {
  return `${GITHUB_API_ROOT}/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repo)}/contents/${config.path
    .split("/")
    .map(encodeURIComponent)
    .join("/")}?ref=${encodeURIComponent(config.branch)}`;
}

function githubHeaders(token) {
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function errorMessage(response, fallback) {
  return response
    .json()
    .then((body) => body?.message || fallback)
    .catch(() => fallback);
}

function AdminField({ label, error, hint, children, className = "" }) {
  return (
    <div className={className}>
      <label className="block text-[11px] font-semibold text-white/55 mb-1.5">{label}</label>
      {children}
      {hint && !error && <p className="mt-1 text-[10px] text-white/25">{hint}</p>}
      {error && (
        <p className="mt-1 text-[10px] text-red-300" data-testid={`error-${label.toLowerCase().replace(/\s+/g, "-")}`}>
          {error}
        </p>
      )}
    </div>
  );
}

const AdminInput = forwardRef(function AdminInput({ className = "", ...props }, ref) {
  return (
    <input
      ref={ref}
      {...props}
      className={`w-full rounded-xl bg-[#111827] border border-white/[0.10] px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none transition-colors focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/15 ${className}`}
    />
  );
});

function AdminTextarea({ className = "", ...props }) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-xl bg-[#111827] border border-white/[0.10] px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none transition-colors focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/15 resize-y ${className}`}
    />
  );
}

function AdminSelect({ value, onChange, options, ...props }) {
  return (
    <select
      {...props}
      value={value}
      onChange={onChange}
      className="w-full appearance-none rounded-xl bg-[#111827] border border-white/[0.10] px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/15"
    >
      {options.map((option) => {
        const item = typeof option === "string" ? { value: option, label: option } : option;
        return (
          <option key={item.value} value={item.value} className="bg-[#111827]">
            {item.label}
          </option>
        );
      })}
    </select>
  );
}

function StatusPill({ children, tone = "blue" }) {
  const tones = {
    blue: "bg-blue-500/15 text-blue-200 ring-blue-400/25",
    green: "bg-emerald-500/15 text-emerald-200 ring-emerald-400/25",
    amber: "bg-amber-500/15 text-amber-200 ring-amber-400/25",
    gray: "bg-white/[0.07] text-white/50 ring-white/10",
    red: "bg-red-500/15 text-red-200 ring-red-400/25",
  };
  return <span className={`inline-flex items-center rounded-full px-2 py-1 text-[10px] font-bold ring-1 ${tones[tone] || tones.blue}`}>{children}</span>;
}

function GitHubState({ state, error }) {
  if (state === "pushed") {
    return <StatusPill tone="green"><Check className="mr-1 h-3 w-3" />Pushed</StatusPill>;
  }
  if (state === "failed") {
    return <span className="inline-flex flex-col items-start gap-1"><StatusPill tone="red">Failed</StatusPill>{error && <span className="max-w-[170px] truncate text-[10px] text-red-300/70" title={error}>{error}</span>}</span>;
  }
  if (state === "pushing") return <StatusPill tone="amber"><RefreshCw className="mr-1 h-3 w-3 animate-spin" />Pushing</StatusPill>;
  return <StatusPill tone="gray">Not pushed</StatusPill>;
}

function AdminPasswordGate({ onUnlock }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    if (checking) return;
    setChecking(true);
    window.setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        onUnlock();
        return;
      }
      setPassword("");
      setError("Akses tidak dapat diverifikasi.");
      setChecking(false);
      window.setTimeout(() => setError(""), 2200);
    }, 180);
  }

  return (
    <div className="fixed inset-0 z-[700] flex items-center justify-center overflow-y-auto bg-[#050608]/95 px-5 py-10 backdrop-blur-xl" role="dialog" aria-modal="true" aria-labelledby="admin-gate-title">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-3xl border border-blue-400/20 bg-gradient-to-b from-blue-950/35 to-[#0d1018] p-6 shadow-2xl shadow-black/60">
        <div className="mb-6 flex items-center gap-3">
          <img src="/logo.jpg" alt="HUNTER WAVE" className="h-12 w-12 rounded-2xl object-cover ring-1 ring-blue-400/35" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-300/70">Restricted area</p>
            <h1 id="admin-gate-title" className="text-lg font-bold text-white">Admin access</h1>
          </div>
        </div>
        <div className="mb-4 flex items-center gap-2 rounded-2xl border border-amber-400/15 bg-amber-500/[0.07] px-3 py-2.5 text-[11px] leading-relaxed text-amber-100/65">
          <LockKeyhole className="h-4 w-4 flex-shrink-0 text-amber-300/70" />
          <span>Panel ini hanya untuk pengelolaan data Airdrop List.</span>
        </div>
        <AdminField label="Password" error={error}>
          <AdminInput
            ref={inputRef}
            type="password"
            value={password}
            onChange={(event) => { setPassword(event.target.value); setError(""); }}
            placeholder="Masukkan password admin"
            autoComplete="current-password"
            data-testid="input-admin-password"
            aria-label="Password admin"
          />
        </AdminField>
        <button
          type="submit"
          disabled={checking || !password}
          data-testid="button-admin-unlock"
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <LockKeyhole className="h-4 w-4" />
          {checking ? "Memverifikasi..." : "Buka Admin Panel"}
        </button>
        <p className="mt-4 text-center text-[10px] leading-relaxed text-white/25">Sesi admin hanya aktif selama panel ini terbuka.</p>
      </form>
    </div>
  );
}

export default function AdminPanel({ airdrops, onAirdropsChange, onClose }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [staging, setStaging] = useState(() => readStoredJson(STAGING_STORAGE_KEY, []));
  const [latestAirdrops, setLatestAirdrops] = useState(airdrops);
  const [githubSha, setGithubSha] = useState("");
  const [token, setToken] = useState(() => {
    try { return localStorage.getItem(TOKEN_STORAGE_KEY) || ""; } catch { return ""; }
  });
  const [config, setConfig] = useState(() => readStoredJson(CONFIG_STORAGE_KEY, DEFAULT_GITHUB_CONFIG));
  const [syncing, setSyncing] = useState(false);
  const [pushing, setPushing] = useState(false);
  const [lastSync, setLastSync] = useState("");
  const [panelError, setPanelError] = useState("");
  const [pushError, setPushError] = useState("");
  const [commitUrl, setCommitUrl] = useState("");
  const [formOpen, setFormOpen] = useState(true);
  const [form, setForm] = useState(createEmptyForm);
  const [editingId, setEditingId] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [formSummary, setFormSummary] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [confirmationFilter, setConfirmationFilter] = useState("all");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    try {
      sessionStorage.setItem(STAGING_STORAGE_KEY, JSON.stringify(staging));
    } catch {}
  }, [staging]);

  useEffect(() => {
    try {
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
    } catch {}
  }, [config]);

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape" && !deleteTarget && !formOpen) onClose();
    }
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [deleteTarget, formOpen, onClose]);

  const fetchLatest = useCallback(async () => {
    if (!config.owner || !config.repo || !config.path || !config.branch) {
      setPanelError("Lengkapi konfigurasi repository GitHub terlebih dahulu.");
      return;
    }
    setSyncing(true);
    setPanelError("");
    try {
      const response = await fetch(githubFileUrl(config), { headers: githubHeaders(token) });
      if (!response.ok) throw new Error(await errorMessage(response, `GitHub mengembalikan status ${response.status}.`));
      const body = await response.json();
      const parsed = validateAirdropList(JSON.parse(decodeBase64(body.content)));
      setLatestAirdrops(parsed);
      setGithubSha(body.sha || "");
      setLastSync(new Date().toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }));
      setNotice(`${parsed.length} data berhasil disinkronkan dari GitHub.`);
    } catch (error) {
      setPanelError(error.message || "Gagal mengambil data terbaru dari GitHub.");
    } finally {
      setSyncing(false);
    }
  }, [config, token]);

  useEffect(() => {
    if (authenticated) fetchLatest();
  }, [authenticated]);

  const nextId = useMemo(() => {
    const ids = [...latestAirdrops, ...airdrops, ...staging].map((item) => Number(item.id)).filter(Number.isFinite);
    return (ids.length ? Math.max(...ids) : 0) + 1;
  }, [airdrops, latestAirdrops, staging]);

  const visibleStaging = useMemo(() => {
    const query = search.trim().toLowerCase();
    return staging
      .filter((item) => !query || `${item.id} ${item.title} ${item.url} ${(item.tags || []).join(" ")}`.toLowerCase().includes(query))
      .filter((item) => statusFilter === "all" || item.status === statusFilter)
      .filter((item) => difficultyFilter === "all" || item.difficulty === difficultyFilter)
      .filter((item) => confirmationFilter === "all" || item.confirmationStatus === confirmationFilter)
      .sort((a, b) => String(b.addedAt).localeCompare(String(a.addedAt)));
  }, [confirmationFilter, difficultyFilter, search, staging, statusFilter]);

  function updateConfig(key, value) {
    setConfig((current) => ({ ...current, [key]: value }));
  }

  function updateForm(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
    setFormErrors((current) => ({ ...current, [key]: "" }));
    setFormSummary("");
  }

  function openAddForm() {
    setEditingId(null);
    setForm(createEmptyForm());
    setFormErrors({});
    setFormSummary("");
    setFormOpen(true);
  }

  function openEditForm(item) {
    setEditingId(item.id);
    setForm(formFromAirdrop(item));
    setFormErrors({});
    setFormSummary("");
    setFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function submitForm(event) {
    event.preventDefault();
    const existing = editingId === null ? null : staging.find((item) => item.id === editingId);
    const payload = {
      id: existing?.id ?? nextId,
      title: form.title.trim(),
      url: form.url.trim(),
      icon: form.icon.trim(),
      customImage: form.customImage.trim(),
      tags: splitTags(form.tags),
      description: form.description.trim(),
      status: form.status,
      difficulty: form.difficulty,
      confirmationStatus: form.confirmationStatus,
      addedAt: existing?.addedAt || formatAddedAt(),
    };
    const guide = splitGuide(form.howToGuide);
    if (guide.length) payload.howToGuide = guide;

    const result = AirdropSchema.safeParse(payload);
    if (!result.success) {
      setFormErrors(toFieldErrors(result.error));
      setFormSummary("Periksa field yang masih belum valid.");
      return;
    }

    setStaging((current) => editingId === null
      ? [...current, result.data]
      : current.map((item) => item.id === editingId ? result.data : item));
    setNotice(editingId === null ? `${result.data.title} ditambahkan ke staging.` : `${result.data.title} diperbarui di staging.`);
    setForm(createEmptyForm());
    setEditingId(null);
    setFormErrors({});
    setFormSummary("");
    setFormOpen(false);
  }

  function requestDelete(item) {
    setDeleteTarget(item);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    setStaging((current) => current.filter((item) => item.id !== deleteTarget.id));
    setNotice(`${deleteTarget.title} dihapus dari staging.`);
    setDeleteTarget(null);
  }

  async function pushAll() {
    if (!staging.length || pushing) return;
    if (!token.trim()) {
      setPushError("Masukkan GitHub Personal Access Token sebelum melakukan push.");
      setSettingsOpen(true);
      return;
    }
    if (!githubSha) {
      setPushError("Data GitHub belum berhasil disinkronkan. Tekan Refresh lalu coba lagi.");
      return;
    }

    setPushing(true);
    setPushError("");
    setCommitUrl("");
    try {
      const merged = validateAirdropList([...latestAirdrops, ...staging]);
      const response = await fetch(`${GITHUB_API_ROOT}/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repo)}/contents/${config.path
        .split("/")
        .map(encodeURIComponent)
        .join("/")}`, {
        method: "PUT",
        headers: { ...githubHeaders(token), "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Add ${staging.length} airdrop${staging.length === 1 ? "" : "s"} via HUNTER WAVE Admin`,
          content: encodeBase64(`${JSON.stringify(merged, null, 2)}\n`),
          sha: githubSha,
          branch: config.branch,
        }),
      });
      if (!response.ok) throw new Error(await errorMessage(response, `Push GitHub gagal dengan status ${response.status}.`));
      const body = await response.json();
      setLatestAirdrops(merged);
      setGithubSha(body.content?.sha || githubSha);
      setCommitUrl(body.commit?.html_url || "");
      setStaging([]);
      onAirdropsChange(merged);
      setNotice(`${merged.length} data tersimpan ke GitHub.`);
    } catch (error) {
      setPushError(error.message || "Push ke GitHub gagal. Data staging tetap dipertahankan.");
    } finally {
      setPushing(false);
    }
  }

  if (!authenticated) {
    return <AdminPasswordGate onUnlock={() => setAuthenticated(true)} />;
  }

  return (
    <div className="fixed inset-0 z-[650] overflow-y-auto bg-[#080a0f] text-white" role="dialog" aria-modal="true" aria-labelledby="admin-panel-title">
      <div className="min-h-full bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.12),transparent_35%)]">
        <header className="sticky top-0 z-20 border-b border-white/[0.08] bg-[#080a0f]/95 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-blue-500/15 ring-1 ring-blue-400/25">
                <Settings2 className="h-4 w-4 text-blue-300" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-300/60">HUNTER WAVE</p>
                <h1 id="admin-panel-title" className="truncate text-base font-bold text-white sm:text-lg">Airdrop staging</h1>
              </div>
              <StatusPill tone={staging.length ? "amber" : "gray"}>{staging.length} staged</StatusPill>
            </div>
            <div className="flex flex-shrink-0 items-center gap-2">
              <button onClick={onClose} data-testid="button-close-admin-panel" aria-label="Tutup Admin Panel" className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06] text-white/60 ring-1 ring-white/10 transition hover:bg-white/[0.12] hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-5 pb-16 sm:px-6 lg:px-8">
          {notice && (
            <div className="mb-4 flex items-start gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-500/[0.08] px-3 py-2.5 text-xs text-emerald-100/80" role="status" aria-live="polite" data-testid="status-admin-notice">
              <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-300" />
              <span className="flex-1">{notice}</span>
              <button onClick={() => setNotice("")} data-testid="button-dismiss-admin-notice" aria-label="Tutup notifikasi"><X className="h-3.5 w-3.5" /></button>
            </div>
          )}
          {panelError && (
            <div className="mb-4 flex items-start gap-2 rounded-2xl border border-red-400/20 bg-red-500/[0.08] px-3 py-3 text-xs text-red-100/85" role="alert" data-testid="alert-admin-panel">
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-300" />
              <span className="flex-1">{panelError}</span>
              <button onClick={fetchLatest} disabled={syncing} data-testid="button-retry-github-sync" className="font-bold text-red-200 underline underline-offset-2 disabled:opacity-40">Coba lagi</button>
            </div>
          )}
          {pushError && (
            <div className="mb-4 flex items-start gap-2 rounded-2xl border border-red-400/20 bg-red-500/[0.08] px-3 py-3 text-xs text-red-100/85" role="alert" data-testid="alert-github-push">
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-300" />
              <span className="flex-1">{pushError}</span>
              <button onClick={() => setPushError("")} data-testid="button-dismiss-push-error" aria-label="Tutup error push"><X className="h-3.5 w-3.5" /></button>
            </div>
          )}
          {commitUrl && (
            <div className="mb-4 flex items-center gap-2 rounded-2xl border border-blue-400/20 bg-blue-500/[0.08] px-3 py-3 text-xs text-blue-100/85" role="status" data-testid="status-github-commit">
              <Github className="h-4 w-4 flex-shrink-0 text-blue-300" />
              <span className="flex-1">Push berhasil dibuat.</span>
              <a href={commitUrl} target="_blank" rel="noreferrer" data-testid="link-github-commit" className="inline-flex items-center gap-1 font-bold text-blue-200 underline underline-offset-2">Lihat commit <ExternalLink className="h-3 w-3" /></a>
            </div>
          )}

          <section className="mb-5 rounded-3xl border border-white/[0.09] bg-white/[0.035] p-4 sm:p-5" aria-labelledby="github-settings-title">
            <button onClick={() => setSettingsOpen((open) => !open)} data-testid="button-toggle-github-settings" className="flex w-full items-center gap-3 text-left">
              <Github className="h-4 w-4 text-blue-300/80" />
              <div className="flex-1">
                <h2 id="github-settings-title" className="text-sm font-bold text-white">GitHub connection</h2>
                <p className="mt-0.5 text-[10px] text-white/35">{config.owner}/{config.repo} · {lastSync ? `Sinkron ${lastSync}` : "Belum disinkronkan"}</p>
              </div>
              {settingsOpen ? <ChevronUp className="h-4 w-4 text-white/40" /> : <ChevronDown className="h-4 w-4 text-white/40" />}
            </button>
            {settingsOpen && (
              <div className="mt-4 border-t border-white/[0.07] pt-4">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <AdminField label="Owner">
                    <AdminInput value={config.owner} onChange={(event) => updateConfig("owner", event.target.value)} data-testid="input-github-owner" />
                  </AdminField>
                  <AdminField label="Repository">
                    <AdminInput value={config.repo} onChange={(event) => updateConfig("repo", event.target.value)} data-testid="input-github-repository" />
                  </AdminField>
                  <AdminField label="File path">
                    <AdminInput value={config.path} onChange={(event) => updateConfig("path", event.target.value)} data-testid="input-github-file-path" />
                  </AdminField>
                  <AdminField label="Branch">
                    <AdminInput value={config.branch} onChange={(event) => updateConfig("branch", event.target.value)} data-testid="input-github-branch" />
                  </AdminField>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                  <AdminField label="GitHub Personal Access Token" hint="Disimpan hanya di localStorage browser dengan key terpisah. Gunakan scope repo.">
                    <div className="relative">
                      <AdminInput
                        type="password"
                        value={token}
                        onChange={(event) => {
                          setToken(event.target.value);
                          try { localStorage.setItem(TOKEN_STORAGE_KEY, event.target.value); } catch {}
                        }}
                        placeholder="ghp_..."
                        autoComplete="off"
                        data-testid="input-github-token"
                        className="pr-10"
                      />
                      <LockKeyhole className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
                    </div>
                  </AdminField>
                  <button onClick={fetchLatest} disabled={syncing} data-testid="button-refresh-github" className="flex h-[42px] items-center justify-center gap-2 rounded-xl bg-white/[0.07] px-4 text-xs font-bold text-white/75 ring-1 ring-white/10 transition hover:bg-white/[0.12] disabled:cursor-wait disabled:opacity-50">
                    <RefreshCw className={`h-3.5 w-3.5 ${syncing ? "animate-spin" : ""}`} /> {syncing ? "Sync..." : "Refresh data"}
                  </button>
                </div>
              </div>
            )}
          </section>

          <section className="mb-5 rounded-3xl border border-blue-400/20 bg-gradient-to-br from-blue-950/30 to-white/[0.025] p-4 sm:p-5" aria-labelledby="airdrop-form-title">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/15 ring-1 ring-blue-400/25">
                <FilePlus2 className="h-4 w-4 text-blue-300" />
              </div>
              <div className="flex-1">
                <h2 id="airdrop-form-title" className="text-sm font-bold text-white">{editingId === null ? "Tambah airdrop" : `Edit airdrop #${editingId}`}</h2>
                <p className="text-[10px] text-white/35">Validasi schema dijalankan sebelum masuk staging.</p>
              </div>
              <button onClick={() => setFormOpen((open) => !open)} data-testid="button-toggle-airdrop-form" aria-label={formOpen ? "Tutup form airdrop" : "Buka form airdrop"} className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.06] text-white/50 ring-1 ring-white/10">
                {formOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            </div>
            {formOpen && (
              <form onSubmit={submitForm} data-testid="form-airdrop-staging">
                {formSummary && <p className="mb-3 rounded-xl border border-red-400/20 bg-red-500/[0.08] px-3 py-2 text-xs text-red-200" role="alert" data-testid="error-airdrop-form-summary">{formSummary}</p>}
                <div className="grid gap-3 sm:grid-cols-2">
                  <AdminField label="Title" error={formErrors.title} className="sm:col-span-2">
                    <AdminInput value={form.title} onChange={(event) => updateForm("title", event.target.value)} placeholder="Nama project airdrop" data-testid="input-airdrop-title" />
                  </AdminField>
                  <AdminField label="URL" error={formErrors.url}>
                    <AdminInput type="url" value={form.url} onChange={(event) => updateForm("url", event.target.value)} placeholder="https://..." data-testid="input-airdrop-url" />
                  </AdminField>
                  <AdminField label="Status" error={formErrors.status}>
                    <div className="relative"><AdminSelect value={form.status} onChange={(event) => updateForm("status", event.target.value)} options={STATUS_OPTIONS} data-testid="select-airdrop-status" /><ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" /></div>
                  </AdminField>
                  <AdminField label="Icon" error={formErrors.icon} hint="Boleh dikosongkan. Bisa berupa emoji/simbol teks.">
                    <AdminInput value={form.icon} onChange={(event) => updateForm("icon", event.target.value)} placeholder="Contoh: ✦" data-testid="input-airdrop-icon" />
                  </AdminField>
                  <AdminField label="Custom image URL" error={formErrors.customImage} hint="Boleh dikosongkan.">
                    <AdminInput value={form.customImage} onChange={(event) => updateForm("customImage", event.target.value)} placeholder="https://..." data-testid="input-airdrop-custom-image" />
                  </AdminField>
                  <AdminField label="Difficulty" error={formErrors.difficulty}>
                    <div className="relative"><AdminSelect value={form.difficulty} onChange={(event) => updateForm("difficulty", event.target.value)} options={DIFFICULTY_OPTIONS} data-testid="select-airdrop-difficulty" /><ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" /></div>
                  </AdminField>
                  <AdminField label="Confirmation" error={formErrors.confirmationStatus}>
                    <div className="relative"><AdminSelect value={form.confirmationStatus} onChange={(event) => updateForm("confirmationStatus", event.target.value)} options={CONFIRMATION_OPTIONS} data-testid="select-airdrop-confirmation" /><ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" /></div>
                  </AdminField>
                  <AdminField label="Tags" error={formErrors.tags} hint="Pisahkan dengan koma.">
                    <AdminInput value={form.tags} onChange={(event) => updateForm("tags", event.target.value)} placeholder="DeFi, Layer2, Beginner" data-testid="input-airdrop-tags" />
                  </AdminField>
                  <AdminField label="Description" error={formErrors.description} className="sm:col-span-2">
                    <AdminTextarea rows={3} value={form.description} onChange={(event) => updateForm("description", event.target.value)} placeholder="Ringkasan singkat airdrop" data-testid="textarea-airdrop-description" />
                  </AdminField>
                  <AdminField label="How-to guide" error={formErrors.howToGuide} hint="Satu langkah per baris. Boleh dikosongkan." className="sm:col-span-2">
                    <AdminTextarea rows={4} value={form.howToGuide} onChange={(event) => updateForm("howToGuide", event.target.value)} placeholder={"Buka website project\nHubungkan wallet\nSelesaikan task"} data-testid="textarea-airdrop-guide" />
                  </AdminField>
                </div>
                <div className="mt-4 grid gap-2 rounded-2xl border border-white/[0.07] bg-black/15 px-3 py-3 text-[10px] text-white/40 sm:grid-cols-2">
                  <span>ID otomatis: <strong className="text-blue-200/80">{editingId ?? nextId}</strong></span>
                  <span>addedAt otomatis: <strong className="text-blue-200/80">{editingId === null ? "Saat ditambahkan" : "Dipertahankan"}</strong></span>
                </div>
                <div className="mt-4 flex flex-wrap justify-end gap-2">
                  {editingId !== null && <button type="button" onClick={openAddForm} data-testid="button-cancel-airdrop-edit" className="rounded-xl bg-white/[0.06] px-4 py-2.5 text-xs font-bold text-white/60 ring-1 ring-white/10 transition hover:bg-white/[0.11]">Batal edit</button>}
                  <button type="submit" data-testid="button-stage-airdrop" className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-blue-400">
                    <Plus className="h-3.5 w-3.5" /> {editingId === null ? "Tambah ke staging" : "Simpan perubahan"}
                  </button>
                </div>
              </form>
            )}
          </section>

          <section aria-labelledby="staging-title">
            <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 id="staging-title" className="text-base font-bold text-white">Staging review</h2>
                  <StatusPill tone={staging.length ? "amber" : "gray"}>{staging.length}</StatusPill>
                </div>
                <p className="mt-1 text-[10px] text-white/35">{visibleStaging.length} dari {staging.length} data tampil · belum masuk GitHub</p>
              </div>
              <button onClick={openAddForm} data-testid="button-add-another-airdrop" className="inline-flex items-center gap-2 rounded-xl bg-white/[0.07] px-3.5 py-2.5 text-xs font-bold text-white/75 ring-1 ring-white/10 transition hover:bg-white/[0.12]">
                <Plus className="h-3.5 w-3.5" /> Tambah data
              </button>
            </div>

            <div className="mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              <div className="relative sm:col-span-2 lg:col-span-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/25" />
                <AdminInput value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari title, ID, tag..." data-testid="input-search-staging" className="pl-9" />
              </div>
              <AdminSelect value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} options={[{ value: "all", label: "Semua status" }, ...STATUS_OPTIONS]} data-testid="select-filter-status" />
              <AdminSelect value={difficultyFilter} onChange={(event) => setDifficultyFilter(event.target.value)} options={[{ value: "all", label: "Semua difficulty" }, ...DIFFICULTY_OPTIONS]} data-testid="select-filter-difficulty" />
              <AdminSelect value={confirmationFilter} onChange={(event) => setConfirmationFilter(event.target.value)} options={[{ value: "all", label: "Semua confirmation" }, ...CONFIRMATION_OPTIONS]} data-testid="select-filter-confirmation" />
            </div>

            {staging.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/[0.12] bg-white/[0.025] px-5 py-12 text-center" data-testid="empty-staging">
                <Cloud className="mx-auto h-8 w-8 text-white/20" />
                <h3 className="mt-3 text-sm font-bold text-white/65">Belum ada data staging</h3>
                <p className="mx-auto mt-1 max-w-xs text-xs leading-relaxed text-white/30">Tambahkan satu atau beberapa airdrop, review di sini, lalu push semuanya sekaligus ke GitHub.</p>
                <button onClick={openAddForm} data-testid="button-empty-add-airdrop" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-400"><Plus className="h-3.5 w-3.5" /> Tambah airdrop</button>
              </div>
            ) : visibleStaging.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/[0.12] bg-white/[0.025] px-5 py-12 text-center" data-testid="empty-filtered-staging">
                <Search className="mx-auto h-8 w-8 text-white/20" />
                <h3 className="mt-3 text-sm font-bold text-white/65">Tidak ada hasil filter</h3>
                <p className="mt-1 text-xs text-white/30">Ubah kata kunci atau filter untuk melihat data staging.</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-3xl border border-white/[0.09] bg-white/[0.025]">
                <div className="hidden overflow-x-auto lg:block">
                  <table className="w-full min-w-[850px] text-left">
                    <caption className="sr-only">Daftar airdrop yang menunggu push ke GitHub</caption>
                    <thead className="border-b border-white/[0.08] bg-white/[0.03] text-[10px] font-bold uppercase tracking-wider text-white/35">
                      <tr>
                        <th className="px-4 py-3">Entry</th>
                        <th className="px-3 py-3">Status</th>
                        <th className="px-3 py-3">Confirmation</th>
                        <th className="px-3 py-3">Difficulty</th>
                        <th className="px-3 py-3">addedAt</th>
                        <th className="px-3 py-3">GitHub</th>
                        <th className="px-4 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.06]">
                      {visibleStaging.map((item) => (
                        <tr key={item.id} data-testid={`row-airdrop-${item.id}`} className="align-top">
                          <td className="max-w-[260px] px-4 py-3">
                            <p className="truncate text-xs font-bold text-white/85" data-testid={`text-airdrop-title-${item.id}`}>{item.title}</p>
                            <p className="mt-1 truncate text-[10px] text-white/30">ID {item.id} · {(item.tags || []).join(", ") || "Tanpa tag"}</p>
                          </td>
                          <td className="px-3 py-3"><StatusPill tone="blue">{item.status}</StatusPill></td>
                          <td className="px-3 py-3"><StatusPill tone={item.confirmationStatus === "confirmed" ? "green" : "amber"}>{item.confirmationStatus === "confirmed" ? "Confirmed" : "Potensial"}</StatusPill></td>
                          <td className="px-3 py-3 text-xs text-white/55">{item.difficulty}</td>
                          <td className="whitespace-nowrap px-3 py-3 text-[10px] text-white/35">{item.addedAt}</td>
                          <td className="px-3 py-3"><GitHubState state={pushing ? "pushing" : "not-pushed"} /></td>
                          <td className="px-4 py-3">
                            <div className="flex justify-end gap-1.5">
                              <button onClick={() => openEditForm(item)} data-testid={`button-edit-airdrop-${item.id}`} className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.06] text-white/55 ring-1 ring-white/10 transition hover:bg-blue-500/15 hover:text-blue-200"><Pencil className="h-3.5 w-3.5" /></button>
                              <button onClick={() => requestDelete(item)} data-testid={`button-delete-airdrop-${item.id}`} className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/[0.07] text-red-300/70 ring-1 ring-red-400/15 transition hover:bg-red-500/15 hover:text-red-200"><Trash2 className="h-3.5 w-3.5" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="divide-y divide-white/[0.07] lg:hidden">
                  {visibleStaging.map((item) => (
                    <article key={item.id} data-testid={`card-airdrop-${item.id}`} className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-lg ring-1 ring-blue-400/20">{item.icon || "—"}</div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="truncate text-sm font-bold text-white/85">{item.title}</h3>
                              <p className="mt-0.5 text-[10px] text-white/35">ID {item.id}</p>
                            </div>
                            <GitHubState state={pushing ? "pushing" : "not-pushed"} />
                          </div>
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            <StatusPill tone="blue">{item.status}</StatusPill>
                            <StatusPill tone={item.confirmationStatus === "confirmed" ? "green" : "amber"}>{item.confirmationStatus === "confirmed" ? "Confirmed" : "Potensial"}</StatusPill>
                            <StatusPill tone="gray">{item.difficulty}</StatusPill>
                          </div>
                          <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-black/15 px-3 py-2.5 text-[10px]">
                            <span className="text-white/30">Tags <strong className="block truncate text-white/60">{(item.tags || []).join(", ") || "—"}</strong></span>
                            <span className="text-white/30">addedAt <strong className="block truncate text-white/60">{item.addedAt}</strong></span>
                          </div>
                          <div className="mt-3 grid grid-cols-2 gap-2">
                            <button onClick={() => openEditForm(item)} data-testid={`button-edit-airdrop-${item.id}`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white/[0.07] text-xs font-bold text-white/70 ring-1 ring-white/10"><Pencil className="h-3.5 w-3.5" /> Edit</button>
                            <button onClick={() => requestDelete(item)} data-testid={`button-delete-airdrop-${item.id}`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-red-500/[0.08] text-xs font-bold text-red-200/80 ring-1 ring-red-400/15"><Trash2 className="h-3.5 w-3.5" /> Hapus</button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {staging.length > 0 && (
              <div className="mt-4 rounded-3xl border border-blue-400/20 bg-blue-500/[0.07] p-4 sm:flex sm:items-center sm:gap-4 sm:p-5">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-500/15 ring-1 ring-blue-400/25"><Upload className="h-4 w-4 text-blue-300" /></div>
                <div className="mt-3 flex-1 sm:mt-0">
                  <h3 className="text-sm font-bold text-white">Siap push {staging.length} data ke GitHub?</h3>
                  <p className="mt-1 text-[10px] leading-relaxed text-white/40">Data terbaru akan diambil, digabung dengan staging, lalu ditulis kembali ke file target. Staging tidak dihapus jika gagal.</p>
                </div>
                <button onClick={pushAll} disabled={pushing || syncing} data-testid="button-push-all-github" className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-500 px-4 text-xs font-bold text-white transition hover:bg-blue-400 disabled:cursor-wait disabled:opacity-45 sm:mt-0 sm:w-auto">
                  {pushing ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                  {pushing ? "Mendorong..." : "Push Semua ke GitHub"}
                </button>
              </div>
            )}
          </section>
        </main>
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-[720] flex items-center justify-center bg-black/75 px-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="delete-airdrop-title">
          <div className="w-full max-w-sm rounded-3xl border border-red-400/20 bg-[#11131a] p-5 shadow-2xl shadow-black/60">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-red-500/10 ring-1 ring-red-400/20"><Trash2 className="h-4 w-4 text-red-300" /></div>
              <div>
                <h2 id="delete-airdrop-title" className="text-sm font-bold text-white">Hapus dari staging?</h2>
                <p className="mt-1 text-xs leading-relaxed text-white/45"><strong className="text-white/75">{deleteTarget.title}</strong> (ID {deleteTarget.id}) akan dihapus dari daftar staging. Data yang sudah ada di GitHub tidak terpengaruh.</p>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setDeleteTarget(null)} data-testid="button-cancel-delete-airdrop" className="rounded-xl bg-white/[0.06] px-4 py-2.5 text-xs font-bold text-white/60 ring-1 ring-white/10">Batal</button>
              <button onClick={confirmDelete} data-testid={`button-confirm-delete-airdrop-${deleteTarget.id}`} className="rounded-xl bg-red-500/85 px-4 py-2.5 text-xs font-bold text-white hover:bg-red-400">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}