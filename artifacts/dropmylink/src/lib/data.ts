import { z } from "zod";

import rawAirdrops  from "../data/airdrops.json";
import rawAds       from "../data/ads.json";
import rawNews      from "../data/news.json";
import rawQinfo     from "../data/qinfo.json";
import rawTools     from "../data/tools.json";

// ─── SCHEMAS ──────────────────────────────────────────────────

export const AirdropSchema = z.object({
  id:          z.number(),
  icon:        z.string().default(""),
  title:       z.string().min(1),
  url:         z.string().min(1),
  customImage: z.string().default(""),
  tags:        z.array(z.string()).default([]),
  description: z.string().default(""),
  status:      z.enum(["Active", "Testnet", "Upcoming", "Mainnet", "Distributed"]),
  reward:      z.string().default(""),
  difficulty:  z.enum(["Easy", "Medium", "Hard"]),
});

export const AdSchema = z.object({
  id:         z.number(),
  title:      z.string().min(1),
  subtitle:   z.string().default(""),
  imageUrl:   z.string().default(""),
  imageRatio: z.string().default("16:9"),
  buttonText: z.string().default(""),
  targetUrl:  z.string().default(""),
  active:     z.boolean().default(false),
});

export const NewsSchema = z.object({
  id:          z.number(),
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
  id:        z.number(),
  board:     z.enum(["garapan", "tge", "presale", "tokenomics"]),
  name:      z.string().min(1),
  date:      z.string().default(""),
  status:    z.enum(["Soon", "Confirmed", "Active", "Upcoming", "New", "Rumored"]),
  targetUrl: z.string().default(""),
});

export const ToolSchema = z.object({
  id:          z.number(),
  icon:        z.string().default(""),
  title:       z.string().min(1),
  url:         z.string().min(1),
  customImage: z.string().default(""),
  category:    z.string().default(""),
  description: z.string().default(""),
  targetUrl:   z.string().default(""),
});

// ─── INFERRED TYPES ───────────────────────────────────────────

export type Airdrop = z.infer<typeof AirdropSchema>;
export type Ad      = z.infer<typeof AdSchema>;
export type News    = z.infer<typeof NewsSchema>;
export type Qinfo   = z.infer<typeof QinfoSchema>;
export type Tool    = z.infer<typeof ToolSchema>;

// ─── LOADERS ──────────────────────────────────────────────────

export function getAirdrops(): Airdrop[] {
  const result = z.array(AirdropSchema).safeParse(rawAirdrops);
  if (!result.success) {
    console.error("[data] airdrops.json invalid:", result.error.flatten());
    throw new Error("airdrops.json validation failed — check console for details.");
  }
  return result.data;
}

export function getAds(): Ad[] {
  const result = z.array(AdSchema).safeParse(rawAds);
  if (!result.success) {
    console.error("[data] ads.json invalid:", result.error.flatten());
    throw new Error("ads.json validation failed — check console for details.");
  }
  return result.data;
}

export function getNews(): News[] {
  const result = z.array(NewsSchema).safeParse(rawNews);
  if (!result.success) {
    console.error("[data] news.json invalid:", result.error.flatten());
    throw new Error("news.json validation failed — check console for details.");
  }
  return result.data;
}

export function getQinfo(): Qinfo[] {
  const result = z.array(QinfoSchema).safeParse(rawQinfo);
  if (!result.success) {
    console.error("[data] qinfo.json invalid:", result.error.flatten());
    throw new Error("qinfo.json validation failed — check console for details.");
  }
  return result.data;
}

export function getTools(): Tool[] {
  const result = z.array(ToolSchema).safeParse(rawTools);
  if (!result.success) {
    console.error("[data] tools.json invalid:", result.error.flatten());
    throw new Error("tools.json validation failed — check console for details.");
  }
  return result.data;
}
