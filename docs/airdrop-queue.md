# Airdrop Queue — Daftar Airdrop Baru

Isi file ini dengan airdrop yang ingin ditambahkan, lalu bilang ke agent:
**"proses airdrop queue"** — agent akan membaca file ini dan langsung menambahkan
semua entry ke `airdrops.json` dengan urutan tampil sesuai urutan di sini (entry
paling atas = tampil paling atas di app).

Kamu **tidak perlu** mengisi `addedAt` atau `id` — agent yang mengaturnya otomatis.

---

## Cara Mengisi

Isi bagian `## Queue` di bawah. Satu entry = satu airdrop.
Salin blok `### [ ]` dan isi fieldnya. Tandai `[x]` kalau sudah diproses.

**Field wajib:** `title`, `url`, `status`, `difficulty`, `confirmationStatus`
**Field opsional:** `icon`, `tags`, `description`, `howToGuide`

**Pilihan `status`:** `Active` · `Testnet` · `Upcoming` · `Mainnet` · `Distributed`
**Pilihan `difficulty`:** `Easy` · `Medium` · `Hard`
**Pilihan `confirmationStatus`:** `confirmed` · `rumored`

---

## Queue

<!-- Salin blok di bawah untuk setiap airdrop baru. Hapus baris yang tidak dipakai. -->

### [ ] CONTOH — Hapus setelah dibaca

```
title: Nama Proyek
url: domain.io
icon: 🔷
tags: Layer1, DeFi
description: Deskripsi singkat 1–2 kalimat tentang proyek ini.
status: Active
difficulty: Medium
confirmationStatus: confirmed
howToGuide:
  - Langkah pertama, misal kunjungi website dan connect wallet.
  - Langkah kedua, misal lakukan bridge atau swap minimal 3x.
  - Langkah ketiga, misal pantau Twitter/X resmi untuk pengumuman snapshot.
```

---

<!-- Tambahkan entry baru di bawah garis ini -->
