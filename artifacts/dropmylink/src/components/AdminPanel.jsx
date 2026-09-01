import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronUp,
  Cloud,
  Database,
  ExternalLink,
  Eye,
  EyeOff,
  FilePlus2,
  Github,
  Layers3,
  LockKeyhole,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Upload,
  Wrench,
  X,
} from "lucide-react";
import { AirdropSchema, CalendarSchema, ToolSchema } from "../lib/data";

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
const EVENT_COLORS = [
  { value: "bg-blue-500/20 text-blue-300", label: "Biru" },
  { value: "bg-amber-500/20 text-amber-300", label: "Amber" },
  { value: "bg-emerald-500/20 text-emerald-300", label: "Hijau" },
  { value: "bg-rose-500/20 text-rose-300", label: "Rose" },
  { value: "bg-violet-500/20 text-violet-300", label: "Violet" },
];
const PLATFORM_CATEGORIES = ["Quest Platform", "Wallet", "Dashboard", "Marketplace", "SocialFi"];

const RESOURCE_DEFS = {
  airdrops: {
    collection: "airdrops",
    label: "Airdrop",
    file: "airdrops.json",
    path: "artifacts/dropmylink/src/data/airdrops.json",
    icon: Layers3,
    schema: AirdropSchema,
  },
  calendar: {
    collection: "calendar",
    label: "EVENT",
    file: "calendar.json",
    path: "artifacts/dropmylink/src/data/calendar.json",
    icon: CalendarDays,
    schema: CalendarSchema,
  },
  platform: {
    collection: "tools",
    label: "Platform",
    file: "tools.json",
    path: "artifacts/dropmylink/src/data/tools.json",
    icon: Database,
    schema: ToolSchema,
    defaultCategory: "Quest Platform",
  },
  tools: {
    collection: "tools",
    label: "Tools",
    file: "tools.json",
    path: "artifacts/dropmylink/src/data/tools.json",
    icon: Wrench,
    schema: ToolSchema,
    defaultCategory: "Tools",
  },
};

const RESOURCE_TABS = ["airdrops", "calendar", "platform", "tools"];

const DEFAULT_GITHUB_CONFIG = {
  owner: "mulyanaemulemul002-design",
  repo: "HUNTER_WAVE",
  branch: "main",
  paths: {
    airdrops: RESOURCE_DEFS.airdrops.path,
    calendar: RESOURCE_DEFS.calendar.path,
    tools: RESOURCE_DEFS.tools.path,
  },
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

function normalizeConfig(raw) {
  const stored = raw && typeof raw === "object" ? raw : {};
  const legacyPath = typeof stored.path === "string" && stored.path.trim() ? stored.path : "";
  return {
    owner: stored.owner || DEFAULT_GITHUB_CONFIG.owner,
    repo: stored.repo || DEFAULT_GITHUB_CONFIG.repo,
    branch: stored.branch || DEFAULT_GITHUB_CONFIG.branch,
    paths: {
      ...DEFAULT_GITHUB_CONFIG.paths,
      ...(stored.paths && typeof stored.paths === "object" ? stored.paths : {}),
      ...(legacyPath ? { airdrops: legacyPath } : {}),
    },
  };
}

function createEmptyForm(resource) {
  if (resource === "calendar") {
    return {
      title: "",
      date: "",
      type: "Snapshot",
      color: EVENT_COLORS[0].value,
    };
  }
  if (resource === "platform" || resource === "tools") {
    return {
      title: "",
      url: "",
      icon: "",
      customImage: "",
      category: RESOURCE_DEFS[resource].defaultCategory,
      description: "",
      targetUrl: "",
    };
  }
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

function formFromItem(resource, item) {
  if (resource === "calendar") {
    return {
      title: item.title || "",
      date: item.date || "",
      type: item.type || "Snapshot",
      color: item.color || EVENT_COLORS[0].value,
    };
  }
  if (resource === "platform" || resource === "tools") {
    return {
      title: item.title || "",
      url: item.url || "",
      icon: item.icon || "",
      customImage: item.customImage || "",
      category: item.category || RESOURCE_DEFS[resource].defaultCategory,
      description: item.description || "",
      targetUrl: item.targetUrl || "",
    };
  }
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
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function splitGuide(value) {
  return value.split("\n").map((item) => item.trim()).filter(Boolean);
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

function normalizeStaging(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((entry) => {
      if (entry && entry.item && entry.resource && RESOURCE_DEFS[entry.resource]) return entry;
      return entry ? { resource: "airdrops", item: entry } : null;
    })
    .filter(Boolean);
}

function validateList(collection, items) {
  const definition = RESOURCE_DEFS[collection];
  if (!definition) throw new Error(`Jenis data tidak dikenal: ${collection}.`);
  if (!Array.isArray(items)) throw new Error(`Isi file ${definition.file} bukan array.`);

  const seen = new Set();
  return items.map((item) => {
    const result = definition.schema.safeParse(item);
    if (!result.success) {
      const firstIssue = result.error.issues[0];
      throw new Error(`Data ${definition.file} tidak valid pada id ${item?.id ?? "?"}: ${firstIssue?.message || "format tidak sesuai schema."}`);
    }
    if (seen.has(result.data.id)) throw new Error(`ID duplikat ditemukan di ${definition.file}: ${result.data.id}.`);
    seen.add(result.data.id);
    return result.data;
  });
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

function githubFileUrl(config, path) {
  return `${GITHUB_API_ROOT}/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repo)}/contents/${path
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
  return response.json().then((body) => body?.message || fallback).catch(() => fallback);
}

function AdminField({ label, error, hint, children, className = "" }) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-[11px] font-semibold text-white/55">{label}</label>
      {children}
      {hint && !error && <p className="mt-1 text-[10px] text-white/25">{hint}</p>}
      {error && <p className="mt-1 text-[10px] text-red-300">{error}</p>}
    </div>
  );
}

const AdminInput = forwardRef(function AdminInput({ className = "", ...props }, ref) {
  return (
    <input
      ref={ref}
      {...props}
      className={`w-full rounded-xl border border-white/[0.10] bg-[#111827] px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/20 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/15 ${className}`}
    />
  );
});

function AdminTextarea({ className = "", ...props }) {
  return (
    <textarea
      {...props}
      className={`w-full resize-y rounded-xl border border-white/[0.10] bg-[#111827] px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/20 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/15 ${className}`}
    />
  );
}

function AdminSelect({ value, onChange, options, ...props }) {
  return (
    <select
      {...props}
      value={value}
      onChange={onChange}
      className="w-full appearance-none rounded-xl border border-white/[0.10] bg-[#111827] px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/15"
    >
      {options.map((option) => {
        const item = typeof option === "string" ? { value: option, label: option } : option;
        return <option key={item.value} value={item.value} className="bg-[#111827]">{item.label}</option>;
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

function GitHubState({ state }) {
  if (state === "pushed") return <StatusPill tone="green"><Check className="mr-1 h-3 w-3" />Pushed</StatusPill>;
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
    <div className="fixed inset-0 z-[700] flex items-center justify-center overflow-y-auto bg-[#050608]/95 px-5 py-10 backdrop-blur-xl" role="dialog" aria-modal="true">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-3xl border border-blue-400/20 bg-gradient-to-b from-blue-950/35 to-[#0d1018] p-6 shadow-2xl shadow-black/60">
        <div className="mb-6 flex items-center gap-3">
          <img src="/logo.jpg" alt="HUNTER WAVE" className="h-12 w-12 rounded-2xl object-cover ring-1 ring-blue-400/35" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-300/70">Restricted area</p>
            <h1 className="text-lg font-bold text-white">Admin access</h1>
          </div>
        </div>
        <div className="mb-4 flex items-center gap-2 rounded-2xl border border-amber-400/15 bg-amber-500/[0.07] px-3 py-2.5 text-[11px] leading-relaxed text-amber-100/65">
          <LockKeyhole className="h-4 w-4 flex-shrink-0 text-amber-300/70" />
          <span>Panel ini untuk mengelola Airdrop, EVENT, Platform, dan Tools.</span>
        </div>
        <AdminField label="Password" error={error}>
          <AdminInput ref={inputRef} type="password" value={password} onChange={(event) => { setPassword(event.target.value); setError(""); }} placeholder="Masukkan password admin" autoComplete="current-password" />
        </AdminField>
        <button type="submit" disabled={checking || !password} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-40">
          <LockKeyhole className="h-4 w-4" />{checking ? "Memverifikasi..." : "Buka Admin Panel"}
        </button>
        <p className="mt-4 text-center text-[10px] leading-relaxed text-white/25">Sesi admin hanya aktif selama panel ini terbuka.</p>
      </form>
    </div>
  );
}

export default function AdminPanel({
  airdrops = [],
  calendar = [],
  tools = [],
  onDataChange,
  onClose,
}) {
  const [authenticated, setAuthenticated] = useState(false);
  const [activeResource, setActiveResource] = useState("airdrops");
  const [staging, setStaging] = useState(() => normalizeStaging(readStoredJson(STAGING_STORAGE_KEY, [])));
  const [latestByCollection, setLatestByCollection] = useState({ airdrops, calendar, tools });
  const [githubShaByCollection, setGithubShaByCollection] = useState({});
  const [token, setToken] = useState(() => {
    try { return localStorage.getItem(TOKEN_STORAGE_KEY) || ""; } catch { return ""; }
  });
  const [config, setConfig] = useState(() => normalizeConfig(readStoredJson(CONFIG_STORAGE_KEY, DEFAULT_GITHUB_CONFIG)));
  const [syncing, setSyncing] = useState(false);
  const [pushing, setPushing] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [lastSyncByCollection, setLastSyncByCollection] = useState({});
  const [panelError, setPanelError] = useState("");
  const [pushError, setPushError] = useState("");
  const [commitUrl, setCommitUrl] = useState("");
  const [formOpen, setFormOpen] = useState(true);
  const [form, setForm] = useState(() => createEmptyForm("airdrops"));
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

  const activeDef = RESOURCE_DEFS[activeResource];
  const collection = activeDef.collection;
  const collectionItems = latestByCollection[collection] || [];
  const stagingScope = activeResource === "platform" || activeResource === "tools"
    ? ["platform", "tools"]
    : [activeResource];
  const visibleStaging = useMemo(() => {
    const query = search.trim().toLowerCase();
    return staging
      .filter((entry) => stagingScope.includes(entry.resource))
      .filter((entry) => {
        const item = entry.item;
        return !query || `${item.id} ${item.title} ${item.url || ""} ${item.category || ""} ${item.type || ""}`.toLowerCase().includes(query);
      })
      .filter((entry) => activeResource !== "airdrops" || statusFilter === "all" || entry.item.status === statusFilter)
      .filter((entry) => activeResource !== "airdrops" || difficultyFilter === "all" || entry.item.difficulty === difficultyFilter)
      .filter((entry) => activeResource !== "airdrops" || confirmationFilter === "all" || entry.item.confirmationStatus === confirmationFilter)
      .sort((a, b) => String(b.item.addedAt || b.item.id).localeCompare(String(a.item.addedAt || a.item.id)));
  }, [activeResource, confirmationFilter, difficultyFilter, search, staging, stagingScope, statusFilter]);

  const scopedStagingCount = staging.filter((entry) => stagingScope.includes(entry.resource)).length;
  const nextId = useMemo(() => {
    const ids = [
      ...collectionItems,
      ...staging.filter((entry) => stagingScope.includes(entry.resource)).map((entry) => entry.item),
    ].map((item) => Number(item.id)).filter(Number.isFinite);
    return (ids.length ? Math.max(...ids) : 0) + 1;
  }, [collectionItems, staging, stagingScope]);

  useEffect(() => {
    try { sessionStorage.setItem(STAGING_STORAGE_KEY, JSON.stringify(staging)); } catch {}
  }, [staging]);

  useEffect(() => {
    try { localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config)); } catch {}
  }, [config]);

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape" && !deleteTarget && !formOpen) onClose();
    }
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [deleteTarget, formOpen, onClose]);

  const fetchLatest = useCallback(async (resource = activeResource) => {
    const definition = RESOURCE_DEFS[resource];
    const targetPath = config.paths[definition.collection];
    if (!config.owner || !config.repo || !targetPath || !config.branch) {
      setPanelError("Lengkapi konfigurasi repository GitHub terlebih dahulu.");
      return;
    }
    setSyncing(true);
    setPanelError("");
    try {
      const response = await fetch(githubFileUrl(config, targetPath), { headers: githubHeaders(token) });
      if (!response.ok) throw new Error(await errorMessage(response, `GitHub mengembalikan status ${response.status}.`));
      const body = await response.json();
      const parsed = validateList(definition.collection, JSON.parse(decodeBase64(body.content)));
      setLatestByCollection((current) => ({ ...current, [definition.collection]: parsed }));
      setGithubShaByCollection((current) => ({ ...current, [definition.collection]: body.sha || "" }));
      setLastSyncByCollection((current) => ({ ...current, [definition.collection]: new Date().toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }) }));
      setNotice(`${parsed.length} data ${definition.label} berhasil disinkronkan dari GitHub.`);
    } catch (error) {
      setPanelError(error.message || `Gagal mengambil ${definition.file} dari GitHub.`);
    } finally {
      setSyncing(false);
    }
  }, [activeResource, config, token]);

  useEffect(() => {
    if (authenticated) fetchLatest(activeResource);
  }, [authenticated, activeResource]);

  function selectResource(resource) {
    setActiveResource(resource);
    setEditingId(null);
    setForm(createEmptyForm(resource));
    setFormErrors({});
    setFormSummary("");
    setFormOpen(true);
    setPanelError("");
    setPushError("");
  }

  function updateConfig(key, value) {
    setConfig((current) => ({ ...current, [key]: value }));
  }

  function updatePath(collectionKey, value) {
    setConfig((current) => ({ ...current, paths: { ...current.paths, [collectionKey]: value } }));
  }

  function updateForm(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
    setFormErrors((current) => ({ ...current, [key]: "" }));
    setFormSummary("");
  }

  function openAddForm(resource = activeResource) {
    setActiveResource(resource);
    setEditingId(null);
    setForm(createEmptyForm(resource));
    setFormErrors({});
    setFormSummary("");
    setFormOpen(true);
  }

  function openEditForm(entry) {
    setActiveResource(entry.resource);
    setEditingId(entry.item.id);
    setForm(formFromItem(entry.resource, entry.item));
    setFormErrors({});
    setFormSummary("");
    setFormOpen(true);
  }

  function buildPayload() {
    const existing = editingId === null
      ? null
      : staging.find((entry) => entry.resource === activeResource && entry.item.id === editingId)?.item;
    if (activeResource === "calendar") {
      return {
        id: existing?.id ?? nextId,
        title: form.title.trim(),
        date: form.date.trim(),
        type: form.type.trim(),
        color: form.color,
      };
    }
    if (activeResource === "platform" || activeResource === "tools") {
      return {
        id: existing?.id ?? nextId,
        title: form.title.trim(),
        url: form.url.trim(),
        icon: form.icon.trim(),
        customImage: form.customImage.trim(),
        category: form.category.trim(),
        description: form.description.trim(),
        targetUrl: form.targetUrl.trim(),
      };
    }
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
    return payload;
  }

  function submitForm(event) {
    event.preventDefault();
    const result = RESOURCE_DEFS[activeResource].schema.safeParse(buildPayload());
    if (!result.success) {
      setFormErrors(toFieldErrors(result.error));
      setFormSummary("Periksa field yang masih belum valid.");
      return;
    }
    setStaging((current) => {
      if (editingId === null) return [...current, { resource: activeResource, item: result.data }];
      return current.map((entry) => entry.resource === activeResource && entry.item.id === editingId
        ? { resource: activeResource, item: result.data }
        : entry);
    });
    setNotice(editingId === null
      ? `${result.data.title} ditambahkan ke staging ${activeDef.label}.`
      : `${result.data.title} diperbarui di staging ${activeDef.label}.`);
    setForm(createEmptyForm(activeResource));
    setEditingId(null);
    setFormErrors({});
    setFormSummary("");
    setFormOpen(false);
  }

  function requestDelete(entry) {
    setDeleteTarget(entry);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    setStaging((current) => current.filter((entry) => !(entry.resource === deleteTarget.resource && entry.item.id === deleteTarget.item.id)));
    setNotice(`${deleteTarget.item.title} dihapus dari staging.`);
    setDeleteTarget(null);
  }

  async function pushAll() {
    const entriesToPush = staging.filter((entry) => stagingScope.includes(entry.resource));
    if (!entriesToPush.length || pushing) return;
    if (!token.trim()) {
      setPushError("Masukkan GitHub Personal Access Token sebelum melakukan push.");
      setSettingsOpen(true);
      return;
    }
    if (!githubShaByCollection[collection]) {
      setPushError(`Data ${activeDef.file} belum berhasil disinkronkan. Tekan Refresh lalu coba lagi.`);
      return;
    }

    setPushing(true);
    setPushError("");
    setCommitUrl("");
    try {
      const merged = validateList(collection, [
        ...collectionItems,
        ...entriesToPush.map((entry) => entry.item),
      ]);
      const targetPath = config.paths[collection];
      const response = await fetch(`${GITHUB_API_ROOT}/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repo)}/contents/${targetPath
        .split("/")
        .map(encodeURIComponent)
        .join("/")}`, {
        method: "PUT",
        headers: { ...githubHeaders(token), "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Update ${activeDef.file} via HUNTER WAVE Admin`,
          content: encodeBase64(`${JSON.stringify(merged, null, 2)}\n`),
          sha: githubShaByCollection[collection],
          branch: config.branch,
        }),
      });
      if (!response.ok) throw new Error(await errorMessage(response, `Push ${activeDef.file} gagal dengan status ${response.status}.`));
      const body = await response.json();
      setLatestByCollection((current) => ({ ...current, [collection]: merged }));
      setGithubShaByCollection((current) => ({ ...current, [collection]: body.content?.sha || current[collection] }));
      setStaging((current) => current.filter((entry) => !stagingScope.includes(entry.resource)));
      setCommitUrl(body.commit?.html_url || "");
      onDataChange?.(collection, merged);
      setNotice(`${merged.length} data ${activeDef.label} tersimpan ke GitHub.`);
    } catch (error) {
      setPushError(error.message || "Push ke GitHub gagal. Data staging tetap dipertahankan.");
    } finally {
      setPushing(false);
    }
  }

  if (!authenticated) return <AdminPasswordGate onUnlock={() => setAuthenticated(true)} />;

  const ActiveIcon = activeDef.icon;
  const lastSync = lastSyncByCollection[collection];
  const pathForCollection = config.paths[collection];

  return (
    <div className="fixed inset-0 z-[650] overflow-y-auto bg-[#080a0f] text-white" role="dialog" aria-modal="true" aria-labelledby="admin-panel-title">
      <div className="min-h-full bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.12),transparent_35%)]">
        <header className="sticky top-0 z-20 border-b border-white/[0.08] bg-[#080a0f]/95 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-blue-500/15 ring-1 ring-blue-400/25"><ActiveIcon className="h-4 w-4 text-blue-300" /></div>
              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-300/60">HUNTER WAVE</p>
                <h1 id="admin-panel-title" className="truncate text-base font-bold text-white sm:text-lg">Content staging · {activeDef.label}</h1>
              </div>
              <StatusPill tone={staging.length ? "amber" : "gray"}>{staging.length} staged</StatusPill>
            </div>
            <button onClick={onClose} aria-label="Tutup Admin Panel" className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-white/60 ring-1 ring-white/10 transition hover:bg-white/[0.12] hover:text-white"><X className="h-4 w-4" /></button>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-5 pb-16 sm:px-6 lg:px-8">
          {notice && <div className="mb-4 flex items-start gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-500/[0.08] px-3 py-2.5 text-xs text-emerald-100/80" role="status"><Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-300" /><span className="flex-1">{notice}</span><button onClick={() => setNotice("")}><X className="h-3.5 w-3.5" /></button></div>}
          {panelError && <div className="mb-4 flex items-start gap-2 rounded-2xl border border-red-400/20 bg-red-500/[0.08] px-3 py-3 text-xs text-red-100/85" role="alert"><AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-300" /><span className="flex-1">{panelError}</span><button onClick={() => fetchLatest(activeResource)} disabled={syncing} className="font-bold text-red-200 underline disabled:opacity-40">Coba lagi</button></div>}
          {pushError && <div className="mb-4 flex items-start gap-2 rounded-2xl border border-red-400/20 bg-red-500/[0.08] px-3 py-3 text-xs text-red-100/85" role="alert"><AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-300" /><span className="flex-1">{pushError}</span><button onClick={() => setPushError("")}><X className="h-3.5 w-3.5" /></button></div>}
          {commitUrl && <div className="mb-4 flex items-center gap-2 rounded-2xl border border-blue-400/20 bg-blue-500/[0.08] px-3 py-3 text-xs text-blue-100/85" role="status"><Github className="h-4 w-4 flex-shrink-0 text-blue-300" /><span className="flex-1">Push berhasil dibuat.</span><a href={commitUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-bold text-blue-200 underline">Lihat commit <ExternalLink className="h-3 w-3" /></a></div>}

          <section className="mb-5 rounded-3xl border border-blue-400/20 bg-blue-500/[0.06] p-3">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {RESOURCE_TABS.map((resource) => {
                const definition = RESOURCE_DEFS[resource];
                const Icon = definition.icon;
                const isActive = activeResource === resource;
                const count = staging.filter((entry) => entry.resource === resource).length;
                return (
                  <button key={resource} onClick={() => selectResource(resource)} className={`flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-xs font-bold ring-1 transition ${isActive ? "bg-blue-500 text-white ring-blue-400/60" : "bg-white/[0.04] text-white/45 ring-white/[0.08] hover:bg-white/[0.08] hover:text-white/75"}`}>
                    <Icon className="h-4 w-4" />{definition.label}{count > 0 && <span className={`rounded-full px-1.5 py-0.5 text-[9px] ${isActive ? "bg-white/20" : "bg-amber-500/20 text-amber-200"}`}>{count}</span>}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-center text-[10px] text-white/30">Platform dan Tools tetap tersimpan bersama di `tools.json`, dibedakan melalui kategori.</p>
          </section>

          <section className="mb-5 rounded-3xl border border-white/[0.09] bg-white/[0.035] p-4 sm:p-5" aria-labelledby="github-settings-title">
            <button onClick={() => setSettingsOpen((open) => !open)} className="flex w-full items-center gap-3 text-left">
              <Github className="h-4 w-4 text-blue-300/80" />
              <div className="flex-1"><h2 id="github-settings-title" className="text-sm font-bold text-white">GitHub connection</h2><p className="mt-0.5 text-[10px] text-white/35">{config.owner}/{config.repo} · {lastSync ? `Sinkron ${lastSync}` : "Belum disinkronkan"}</p></div>
              {settingsOpen ? <ChevronUp className="h-4 w-4 text-white/40" /> : <ChevronDown className="h-4 w-4 text-white/40" />}
            </button>
            {settingsOpen && (
              <div className="mt-4 border-t border-white/[0.07] pt-4">
                <div className="grid gap-3 sm:grid-cols-3">
                  <AdminField label="Owner"><AdminInput value={config.owner} onChange={(event) => updateConfig("owner", event.target.value)} /></AdminField>
                  <AdminField label="Repository"><AdminInput value={config.repo} onChange={(event) => updateConfig("repo", event.target.value)} /></AdminField>
                  <AdminField label="Branch"><AdminInput value={config.branch} onChange={(event) => updateConfig("branch", event.target.value)} /></AdminField>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  {["airdrops", "calendar", "tools"].map((key) => <AdminField key={key} label={`File path · ${RESOURCE_DEFS[key].file}`}><AdminInput value={config.paths[key]} onChange={(event) => updatePath(key, event.target.value)} /></AdminField>)}
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                  <AdminField label="GitHub Personal Access Token" hint="Fine-grained token: Contents Read and write. Disimpan hanya di localStorage browser.">
                    <div className="relative"><AdminInput type={showToken ? "text" : "password"} value={token} onChange={(event) => { setToken(event.target.value); try { localStorage.setItem(TOKEN_STORAGE_KEY, event.target.value); } catch {} }} placeholder="github_pat_..." autoComplete="off" className="pr-10" /><button type="button" onClick={() => setShowToken((value) => !value)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-white/30">{showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div>
                  </AdminField>
                  <button onClick={() => fetchLatest(activeResource)} disabled={syncing} className="flex h-[42px] items-center justify-center gap-2 rounded-xl bg-white/[0.07] px-4 text-xs font-bold text-white/75 ring-1 ring-white/10 transition hover:bg-white/[0.12] disabled:cursor-wait disabled:opacity-50"><RefreshCw className={`h-3.5 w-3.5 ${syncing ? "animate-spin" : ""}`} />{syncing ? "Sync..." : `Refresh ${activeDef.label}`}</button>
                </div>
                <p className="mt-2 truncate text-[10px] text-white/25">Target aktif: {pathForCollection}</p>
              </div>
            )}
          </section>

          <section className="mb-5 rounded-3xl border border-blue-400/20 bg-gradient-to-br from-blue-950/30 to-white/[0.025] p-4 sm:p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/15 ring-1 ring-blue-400/25"><FilePlus2 className="h-4 w-4 text-blue-300" /></div>
              <div className="flex-1"><h2 className="text-sm font-bold text-white">{editingId === null ? `Tambah ${activeDef.label}` : `Edit ${activeDef.label} #${editingId}`}</h2><p className="text-[10px] text-white/35">Validasi schema dijalankan sebelum masuk staging.</p></div>
              <button onClick={() => setFormOpen((open) => !open)} aria-label={formOpen ? "Tutup form" : "Buka form"} className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.06] text-white/50 ring-1 ring-white/10">{formOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</button>
            </div>
            {formOpen && (
              <form onSubmit={submitForm}>
                {formSummary && <p className="mb-3 rounded-xl border border-red-400/20 bg-red-500/[0.08] px-3 py-2 text-xs text-red-200" role="alert">{formSummary}</p>}
                {activeResource === "airdrops" && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <AdminField label="Title" error={formErrors.title} className="sm:col-span-2"><AdminInput value={form.title} onChange={(event) => updateForm("title", event.target.value)} placeholder="Nama project airdrop" /></AdminField>
                    <AdminField label="URL" error={formErrors.url}><AdminInput value={form.url} onChange={(event) => updateForm("url", event.target.value)} placeholder="domain.com atau https://..." /></AdminField>
                    <AdminField label="Status" error={formErrors.status}><div className="relative"><AdminSelect value={form.status} onChange={(event) => updateForm("status", event.target.value)} options={STATUS_OPTIONS} /><ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" /></div></AdminField>
                    <AdminField label="Icon" hint="Emoji/simbol teks, boleh dikosongkan."><AdminInput value={form.icon} onChange={(event) => updateForm("icon", event.target.value)} placeholder="Contoh: ✦" /></AdminField>
                    <AdminField label="Custom image URL" hint="Boleh dikosongkan."><AdminInput value={form.customImage} onChange={(event) => updateForm("customImage", event.target.value)} placeholder="https://..." /></AdminField>
                    <AdminField label="Difficulty"><div className="relative"><AdminSelect value={form.difficulty} onChange={(event) => updateForm("difficulty", event.target.value)} options={DIFFICULTY_OPTIONS} /><ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" /></div></AdminField>
                    <AdminField label="Confirmation"><div className="relative"><AdminSelect value={form.confirmationStatus} onChange={(event) => updateForm("confirmationStatus", event.target.value)} options={CONFIRMATION_OPTIONS} /><ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" /></div></AdminField>
                    <AdminField label="Tags" hint="Pisahkan dengan koma."><AdminInput value={form.tags} onChange={(event) => updateForm("tags", event.target.value)} placeholder="DeFi, Layer2, Beginner" /></AdminField>
                    <AdminField label="Description" className="sm:col-span-2"><AdminTextarea rows={3} value={form.description} onChange={(event) => updateForm("description", event.target.value)} placeholder="Ringkasan singkat airdrop" /></AdminField>
                    <AdminField label="How-to guide" hint="Satu langkah per baris. Boleh dikosongkan." className="sm:col-span-2"><AdminTextarea rows={4} value={form.howToGuide} onChange={(event) => updateForm("howToGuide", event.target.value)} placeholder={"Buka website project\nHubungkan wallet\nSelesaikan task"} /></AdminField>
                  </div>
                )}
                {activeResource === "calendar" && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <AdminField label="Judul event" error={formErrors.title} className="sm:col-span-2"><AdminInput value={form.title} onChange={(event) => updateForm("title", event.target.value)} placeholder="Contoh: Monad Testnet Phase 3" /></AdminField>
                    <AdminField label="Tanggal" error={formErrors.date} hint="Format tampilan, contoh: Juni 12"><AdminInput value={form.date} onChange={(event) => updateForm("date", event.target.value)} placeholder="Juni 12" /></AdminField>
                    <AdminField label="Tipe event" error={formErrors.type}><AdminInput value={form.type} onChange={(event) => updateForm("type", event.target.value)} placeholder="Snapshot, TGE, Launch..." /></AdminField>
                    <AdminField label="Warna badge" error={formErrors.color}><div className="relative"><AdminSelect value={form.color} onChange={(event) => updateForm("color", event.target.value)} options={EVENT_COLORS} /><ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" /></div></AdminField>
                  </div>
                )}
                {(activeResource === "platform" || activeResource === "tools") && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <AdminField label="Nama" error={formErrors.title} className="sm:col-span-2"><AdminInput value={form.title} onChange={(event) => updateForm("title", event.target.value)} placeholder={activeResource === "tools" ? "Nama tool Web3" : "Nama platform Web3"} /></AdminField>
                    <AdminField label="URL" error={formErrors.url}><AdminInput value={form.url} onChange={(event) => updateForm("url", event.target.value)} placeholder="domain.com" /></AdminField>
                    <AdminField label="Target URL" hint="URL referral atau link tujuan saat tombol dibuka."><AdminInput value={form.targetUrl} onChange={(event) => updateForm("targetUrl", event.target.value)} placeholder="https://..." /></AdminField>
                    <AdminField label="Kategori" error={formErrors.category} hint={activeResource === "tools" ? "Gunakan kategori Tools agar tampil di sub-tab Tools." : "Kategori selain Tools tampil di sub-tab Platform."}><AdminInput value={form.category} onChange={(event) => updateForm("category", event.target.value)} list="admin-platform-categories" placeholder={activeResource === "tools" ? "Tools" : "Quest Platform"} /></AdminField>
                    <datalist id="admin-platform-categories">{PLATFORM_CATEGORIES.map((category) => <option key={category} value={category} />)}<option value="Tools" /></datalist>
                    <AdminField label="Icon" hint="Emoji/simbol teks, boleh dikosongkan."><AdminInput value={form.icon} onChange={(event) => updateForm("icon", event.target.value)} placeholder="Contoh: ✦" /></AdminField>
                    <AdminField label="Custom image URL" hint="Boleh dikosongkan."><AdminInput value={form.customImage} onChange={(event) => updateForm("customImage", event.target.value)} placeholder="https://..." /></AdminField>
                    <AdminField label="Deskripsi" className="sm:col-span-2"><AdminTextarea rows={4} value={form.description} onChange={(event) => updateForm("description", event.target.value)} placeholder="Deskripsi singkat platform atau tool" /></AdminField>
                  </div>
                )}
                <div className="mt-4 grid gap-2 rounded-2xl border border-white/[0.07] bg-black/15 px-3 py-3 text-[10px] text-white/40 sm:grid-cols-2"><span>ID otomatis: <strong className="text-blue-200/80">{editingId ?? nextId}</strong></span><span>{activeResource === "airdrops" ? "addedAt" : "File target"}: <strong className="text-blue-200/80">{activeResource === "airdrops" ? (editingId === null ? "Saat ditambahkan" : "Dipertahankan") : activeDef.file}</strong></span></div>
                <div className="mt-4 flex flex-wrap justify-end gap-2">{editingId !== null && <button type="button" onClick={() => openAddForm(activeResource)} className="rounded-xl bg-white/[0.06] px-4 py-2.5 text-xs font-bold text-white/60 ring-1 ring-white/10">Batal edit</button>}<button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-blue-400"><Plus className="h-3.5 w-3.5" />{editingId === null ? "Tambah ke staging" : "Simpan perubahan"}</button></div>
              </form>
            )}
          </section>

          <section aria-labelledby="staging-title">
            <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
              <div><div className="flex items-center gap-2"><h2 id="staging-title" className="text-base font-bold text-white">Staging review · {activeDef.label}</h2><StatusPill tone={scopedStagingCount ? "amber" : "gray"}>{scopedStagingCount}</StatusPill></div><p className="mt-1 text-[10px] text-white/35">{visibleStaging.length} dari {scopedStagingCount} data tampil · belum masuk GitHub</p></div>
              <button onClick={() => openAddForm(activeResource)} className="inline-flex items-center gap-2 rounded-xl bg-white/[0.07] px-3.5 py-2.5 text-xs font-bold text-white/75 ring-1 ring-white/10 transition hover:bg-white/[0.12]"><Plus className="h-3.5 w-3.5" />Tambah data</button>
            </div>
            <div className="mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              <div className="relative sm:col-span-2 lg:col-span-1"><Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/25" /><AdminInput value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari title, ID, kategori..." className="pl-9" /></div>
              {activeResource === "airdrops" && <><AdminSelect value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} options={[{ value: "all", label: "Semua status" }, ...STATUS_OPTIONS]} /><AdminSelect value={difficultyFilter} onChange={(event) => setDifficultyFilter(event.target.value)} options={[{ value: "all", label: "Semua difficulty" }, ...DIFFICULTY_OPTIONS]} /><AdminSelect value={confirmationFilter} onChange={(event) => setConfirmationFilter(event.target.value)} options={[{ value: "all", label: "Semua confirmation" }, ...CONFIRMATION_OPTIONS]} /></>}
            </div>
            {scopedStagingCount === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/[0.12] bg-white/[0.025] px-5 py-12 text-center"><Cloud className="mx-auto h-8 w-8 text-white/20" /><h3 className="mt-3 text-sm font-bold text-white/65">Belum ada data staging</h3><p className="mx-auto mt-1 max-w-xs text-xs leading-relaxed text-white/30">Tambahkan data {activeDef.label}, review di sini, lalu push ke GitHub.</p><button onClick={() => openAddForm(activeResource)} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-400"><Plus className="h-3.5 w-3.5" />Tambah {activeDef.label}</button></div>
            ) : visibleStaging.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/[0.12] bg-white/[0.025] px-5 py-12 text-center"><Search className="mx-auto h-8 w-8 text-white/20" /><h3 className="mt-3 text-sm font-bold text-white/65">Tidak ada hasil filter</h3><p className="mt-1 text-xs text-white/30">Ubah kata kunci atau filter untuk melihat data staging.</p></div>
            ) : (
              <div className="overflow-hidden rounded-3xl border border-white/[0.09] bg-white/[0.025]">
                <div className="hidden overflow-x-auto lg:block"><table className="w-full min-w-[850px] text-left"><thead className="border-b border-white/[0.08] bg-white/[0.03] text-[10px] font-bold uppercase tracking-wider text-white/35"><tr><th className="px-4 py-3">Entry</th><th className="px-3 py-3">Kategori / Detail</th><th className="px-3 py-3">ID</th><th className="px-3 py-3">GitHub</th><th className="px-4 py-3 text-right">Action</th></tr></thead><tbody className="divide-y divide-white/[0.06]">{visibleStaging.map((entry) => <tr key={`${entry.resource}-${entry.item.id}`} className="align-top"><td className="max-w-[300px] px-4 py-3"><p className="truncate text-xs font-bold text-white/85">{entry.item.title}</p><p className="mt-1 truncate text-[10px] text-white/30">{RESOURCE_DEFS[entry.resource].label} · {entry.item.url || entry.item.date || "Tanpa detail"}</p></td><td className="px-3 py-3"><StatusPill tone={entry.resource === "tools" ? "amber" : "blue"}>{entry.item.category || entry.item.type || entry.item.status || "Data"}</StatusPill></td><td className="px-3 py-3 text-xs text-white/55">{entry.item.id}</td><td className="px-3 py-3"><GitHubState state={pushing ? "pushing" : "not-pushed"} /></td><td className="px-4 py-3"><div className="flex justify-end gap-1.5"><button onClick={() => openEditForm(entry)} className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.06] text-white/55 ring-1 ring-white/10 transition hover:bg-blue-500/15 hover:text-blue-200"><Pencil className="h-3.5 w-3.5" /></button><button onClick={() => requestDelete(entry)} className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/[0.07] text-red-300/70 ring-1 ring-red-400/15 transition hover:bg-red-500/15 hover:text-red-200"><Trash2 className="h-3.5 w-3.5" /></button></div></td></tr>)}</tbody></table></div>
                <div className="divide-y divide-white/[0.07] lg:hidden">{visibleStaging.map((entry) => <article key={`${entry.resource}-${entry.item.id}`} className="p-4"><div className="flex items-start gap-3"><div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-lg ring-1 ring-blue-400/20">{entry.item.icon || (entry.resource === "calendar" ? "📅" : entry.resource === "tools" ? "🛠️" : "✦")}</div><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><div><h3 className="truncate text-sm font-bold text-white/85">{entry.item.title}</h3><p className="mt-0.5 text-[10px] text-white/35">{RESOURCE_DEFS[entry.resource].label} · ID {entry.item.id}</p></div><GitHubState state={pushing ? "pushing" : "not-pushed"} /></div><div className="mt-3 flex flex-wrap gap-1.5"><StatusPill tone={entry.resource === "tools" ? "amber" : "blue"}>{entry.item.category || entry.item.type || entry.item.status || "Data"}</StatusPill></div><div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-black/15 px-3 py-2.5 text-[10px]"><span className="text-white/30">Detail<strong className="block truncate text-white/60">{entry.item.url || entry.item.date || "—"}</strong></span><span className="text-white/30">File<strong className="block truncate text-white/60">{RESOURCE_DEFS[entry.resource].file}</strong></span></div><div className="mt-3 grid grid-cols-2 gap-2"><button onClick={() => openEditForm(entry)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white/[0.07] text-xs font-bold text-white/70 ring-1 ring-white/10"><Pencil className="h-3.5 w-3.5" />Edit</button><button onClick={() => requestDelete(entry)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-red-500/[0.08] text-xs font-bold text-red-200/80 ring-1 ring-red-400/15"><Trash2 className="h-3.5 w-3.5" />Hapus</button></div></div></div></article>)}</div>
              </div>
            )}
            {scopedStagingCount > 0 && <div className="mt-4 rounded-3xl border border-blue-400/20 bg-blue-500/[0.07] p-4 sm:flex sm:items-center sm:gap-4 sm:p-5"><div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-500/15 ring-1 ring-blue-400/25"><Upload className="h-4 w-4 text-blue-300" /></div><div className="mt-3 flex-1 sm:mt-0"><h3 className="text-sm font-bold text-white">Siap push {scopedStagingCount} data ke {activeDef.file}?</h3><p className="mt-1 text-[10px] leading-relaxed text-white/40">Data terbaru akan diambil, digabung dengan staging, lalu ditulis kembali ke file target.</p></div><button onClick={pushAll} disabled={pushing || syncing} className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-500 px-4 text-xs font-bold text-white transition hover:bg-blue-400 disabled:cursor-wait disabled:opacity-45 sm:mt-0 sm:w-auto">{pushing ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}{pushing ? "Mendorong..." : "Push ke GitHub"}</button></div>}
          </section>
        </main>
      </div>

      {deleteTarget && <div className="fixed inset-0 z-[720] flex items-center justify-center bg-black/75 px-5 backdrop-blur-sm" role="dialog" aria-modal="true"><div className="w-full max-w-sm rounded-3xl border border-red-400/20 bg-[#11131a] p-5 shadow-2xl shadow-black/60"><div className="flex items-start gap-3"><div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-red-500/10 ring-1 ring-red-400/20"><Trash2 className="h-4 w-4 text-red-300" /></div><div><h2 className="text-sm font-bold text-white">Hapus dari staging?</h2><p className="mt-1 text-xs leading-relaxed text-white/45"><strong className="text-white/75">{deleteTarget.item.title}</strong> (ID {deleteTarget.item.id}) akan dihapus dari staging. Data yang sudah ada di GitHub tidak terpengaruh.</p></div></div><div className="mt-5 flex justify-end gap-2"><button onClick={() => setDeleteTarget(null)} className="rounded-xl bg-white/[0.06] px-4 py-2.5 text-xs font-bold text-white/60 ring-1 ring-white/10">Batal</button><button onClick={confirmDelete} className="rounded-xl bg-red-500/85 px-4 py-2.5 text-xs font-bold text-white hover:bg-red-400">Hapus</button></div></div></div>}
    </div>
  );
}