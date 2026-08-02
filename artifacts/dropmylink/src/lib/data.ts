import { z } from "zod";

import rawAirdrops  from "../data/airdrops.json";
import rawAds       from "../data/ads.json";
import rawNews      from "../data/news.json";
import rawQinfo     from "../data/qinfo.json";
import rawTools     from "../data/tools.json";
import rawP2P       from "../data/p2p.json";
import rawCalendar  from "../data/calendar.json";
import rawTicker    from "../data/ticker.json";

// ─── ID VALIDATORS ────────────────────────────────────────────
//
// validateIds(file) — untuk semua array selain airdrops.
// Memastikan:
//   1. Setiap id adalah integer positif
//   2. Tidak ada id duplikat di dalam file yang sama
//   3. Id urut berurutan mulai dari 1 (1, 2, 3, ...)
// Validasi ini INDEPENDEN per file — id di satu file tidak
// bersinggungan sama sekali dengan id di file lain.
function validateIds(file: string) {
  return (items: { id: number }[], ctx: z.RefinementCtx) => {
    const seen = new Set<number>();

    items.forEach((item, index) => {
      // 1. Harus integer positif
      if (!Number.isInteger(item.id) || item.id < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [index, "id"],
          message: `[${file}] id[${index}] = ${item.id} — harus integer positif (≥ 1).`,
        });
        return;
      }

      // 2. Tidak boleh duplikat
      if (seen.has(item.id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [index, "id"],
          message: `[${file}] id ${item.id} duplikat — setiap id harus unik di dalam file ini.`,
        });
      }
      seen.add(item.id);
    });

    // 3. Harus urut berurutan mulai 1
    const ids = items.map(i => i.id).sort((a, b) => a - b);
    ids.forEach((id, i) => {
      const expected = i + 1;
      if (id !== expected) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `[${file}] id tidak urut — ditemukan id ${id} pada posisi urut ke-${expected}. ` +
                   `Pastikan id dimulai dari 1 dan tidak ada yang loncat.`,
        });
      }
    });
  };
}

// validateAirdropIds — KHUSUS airdrops.json.
// Hanya memastikan:
//   1. Setiap id adalah integer positif
//   2. Tidak ada id duplikat
// Id TIDAK harus urut/berurutan — boleh loncat (misal 1, 5, 12, 100).
// Urutan tampil ditentukan oleh field addedAt, bukan oleh nilai id.
function validateAirdropIds(items: { id: number }[], ctx: z.RefinementCtx) {
  const seen = new Set<number>();
  items.forEach((item, index) => {
    if (!Number.isInteger(item.id) || item.id < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [index, "id"],
        message: `[airdrops.json] id[${index}] = ${item.id} — harus integer positif (≥ 1).`,
      });
      return;
    }
    if (seen.has(item.id)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [index, "id"],
        message: `[airdrops.json] id ${item.id} DUPLIKAT — setiap id harus unik. ` +
                 `Gunakan id yang belum pernah dipakai di file ini.`,
      });
    }
    seen.add(item.id);
  });
}

// ─── SCHEMAS ──────────────────────────────────────────────────

export const AirdropSchema = z.object({
  id:                 z.number().int().positive(),
  icon:               z.string().default(""),
  title:              z.string().min(1),
  url:                z.string().min(1),
  customImage:        z.string().default(""),
  tags:               z.array(z.string()).default([]),
  description:        z.string().default(""),
  status:             z.enum(["Active", "Testnet", "Upcoming", "Mainnet", "Distributed"]),
  difficulty:         z.enum(["Easy", "Medium", "Hard"]),
  howToGuide:         z.array(z.string()).optional(),
  // Wajib diisi — menentukan sub-tab mana airdrop ini tampil:
  // "confirmed" = airdrop yang sudah pasti/resmi diumumkan
  // "rumored"   = masih spekulatif (potential/early access/beta/belum pasti)
  confirmationStatus: z.enum(["confirmed", "rumored"], {
    errorMap: () => ({ message: 'confirmationStatus wajib diisi dengan "confirmed" atau "rumored".' }),
  }),
  // Wajib diisi — datetime airdrop ini ditambahkan, format ISO: "YYYY-MM-DDTHH:mm:ss"
  // Digunakan untuk mengurutkan tampilan: yang paling baru muncul paling atas.
  // Gunakan datetime penuh (bukan hanya tanggal) supaya saat menambahkan banyak
  // airdrop sekaligus di hari yang sama, urutan tampil bisa dikontrol lewat jam/menit.
  // Id TIDAK perlu urut — cukup unik. Urutan ditentukan oleh addedAt, bukan id.
  addedAt:            z.string().min(1, { message: 'addedAt wajib diisi dengan format "YYYY-MM-DDTHH:mm:ss", misal "2026-07-27T10:05:00".' }),
});

export const AdSchema = z.object({
  id:         z.number().int().positive(),
  title:      z.string().min(1),
  subtitle:   z.string().default(""),
  imageUrl:   z.string().default(""),
  imageRatio: z.string().default("16:9"),
  buttonText: z.string().default(""),
  targetUrl:  z.string().default(""),
  active:     z.boolean().default(false),
});

export const NewsSchema = z.object({
  id:          z.number().int().positive(),
  title:       z.string().min(1),
  description: z.string().default(""),
  category:    z.string().default(""),
  time:        z.string().default(""),
  color:       z.string().default("from-blue-700/40 to-blue-900/20"),
  imageUrl:    z.string().default(""),
  imageRatio:  z.string().default("4:5"),
  targetUrl:   z.string().default(""),
});

export const QinfoSchema = z.object({
  id:        z.number().int().positive(),
  board:     z.enum(["garapan", "tge", "presale", "tokenomics"]),
  name:      z.string().min(1),
  date:      z.string().default(""),
  status:    z.enum(["Soon", "Confirmed", "Active", "Upcoming", "New", "Rumored"]),
  targetUrl: z.string().default(""),
});

export const ToolSchema = z.object({
  id:          z.number().int().positive(),
  icon:        z.string().default(""),
  title:       z.string().min(1),
  url:         z.string().min(1),
  customImage: z.string().default(""),
  category:    z.string().default(""),
  description: z.string().default(""),
  targetUrl:   z.string().default(""),
});

export const P2PSchema = z.object({
  id:       z.number().int().positive(),
  user:     z.string().min(1),
  selling:  z.string().min(1),
  price:    z.string().min(1),
  min:      z.string().default(""),
  methods:  z.array(z.string()).default([]),
  telegram: z.string().default(""),
  whatsapp: z.string().default(""),
  verified: z.boolean().default(false),
});

export const CalendarSchema = z.object({
  id:    z.number().int().positive(),
  date:  z.string().min(1),
  title: z.string().min(1),
  type:  z.string().default(""),
  color: z.string().default("bg-blue-500/20 text-blue-300"),
});

// ─── INFERRED TYPES ───────────────────────────────────────────

export type Airdrop  = z.infer<typeof AirdropSchema>;
export type Ad       = z.infer<typeof AdSchema>;
export type News     = z.infer<typeof NewsSchema>;
export type Qinfo    = z.infer<typeof QinfoSchema>;
export type Tool     = z.infer<typeof ToolSchema>;
export type P2P      = z.infer<typeof P2PSchema>;
export type Calendar = z.infer<typeof CalendarSchema>;

// ─── ARRAY SCHEMAS (dengan validasi ID independen per file) ───

const AirdropsArray  = z.array(AirdropSchema).superRefine(validateAirdropIds);
const AdsArray       = z.array(AdSchema).superRefine(validateIds("ads.json"));
const NewsArray      = z.array(NewsSchema).superRefine(validateIds("news.json"));
const QinfoArray     = z.array(QinfoSchema).superRefine(validateIds("qinfo.json"));
const ToolsArray     = z.array(ToolSchema).superRefine(validateIds("tools.json"));
const P2PArray       = z.array(P2PSchema).superRefine(validateIds("p2p.json"));
const CalendarArray  = z.array(CalendarSchema).superRefine(validateIds("calendar.json"));

// ─── LOADERS ──────────────────────────────────────────────────

export function getAirdrops(): Airdrop[] {
  const result = AirdropsArray.safeParse(rawAirdrops);
  if (!result.success) {
    console.error("[data] airdrops.json invalid:", result.error.flatten());
    throw new Error("airdrops.json validation failed — check console for details.");
  }
  return result.data;
}

export function getAds(): Ad[] {
  const result = AdsArray.safeParse(rawAds);
  if (!result.success) {
    console.error("[data] ads.json invalid:", result.error.flatten());
    throw new Error("ads.json validation failed — check console for details.");
  }
  return result.data;
}

export function getNews(): News[] {
  const result = NewsArray.safeParse(rawNews);
  if (!result.success) {
    console.error("[data] news.json invalid:", result.error.flatten());
    throw new Error("news.json validation failed — check console for details.");
  }
  return result.data;
}

export function getQinfo(): Qinfo[] {
  const result = QinfoArray.safeParse(rawQinfo);
  if (!result.success) {
    console.error("[data] qinfo.json invalid:", result.error.flatten());
    throw new Error("qinfo.json validation failed — check console for details.");
  }
  return result.data;
}

export function getTools(): Tool[] {
  const result = ToolsArray.safeParse(rawTools);
  if (!result.success) {
    console.error("[data] tools.json invalid:", result.error.flatten());
    throw new Error("tools.json validation failed — check console for details.");
  }
  return result.data;
}

export function getP2P(): P2P[] {
  const result = P2PArray.safeParse(rawP2P);
  if (!result.success) {
    console.error("[data] p2p.json invalid:", result.error.flatten());
    throw new Error("p2p.json validation failed — check console for details.");
  }
  return result.data;
}

export function getCalendar(): Calendar[] {
  const result = CalendarArray.safeParse(rawCalendar);
  if (!result.success) {
    console.error("[data] calendar.json invalid:", result.error.flatten());
    throw new Error("calendar.json validation failed — check console for details.");
  }
  return result.data;
}

export function getTicker(): string[] {
  const result = z.array(z.string().min(1)).safeParse(rawTicker);
  if (!result.success) {
    console.error("[data] ticker.json invalid:", result.error.flatten());
    return ["Selamat datang di HUNTER WAVE"];
  }
  return result.data;
}
