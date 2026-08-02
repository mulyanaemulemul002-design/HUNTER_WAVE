# Panduan Menambahkan Airdrop Baru

File ini adalah template untuk menambahkan entry baru ke `artifacts/dropmylink/src/data/airdrops.json`.

---

## Aturan Penting Sebelum Mulai

- **`id`** — Pilih angka integer positif yang **belum pernah dipakai** di file. Tidak harus urut, boleh loncat (misal 7, 15, 100). Jika duplikat, app akan error.
- **`addedAt`** — Format wajib: `"YYYY-MM-DDTHH:mm:ss"`. Airdrop dengan `addedAt` terbesar tampil **paling atas**. Kalau menambahkan banyak sekaligus, beda-kan menit untuk mengontrol urutan (lihat contoh di bawah).
- **Posisi di array JSON tidak berpengaruh** ke urutan tampil — `addedAt` yang menentukan.

---

## Field Wajib

| Field | Tipe | Keterangan |
|---|---|---|
| `id` | number | Integer unik, belum pernah dipakai |
| `title` | string | Nama proyek |
| `url` | string | Domain tanpa `https://`, misal `"scroll.io"` |
| `status` | string | Lihat pilihan di bawah |
| `difficulty` | string | `"Easy"` / `"Medium"` / `"Hard"` |
| `confirmationStatus` | string | `"confirmed"` atau `"rumored"` |
| `addedAt` | string | Format `"YYYY-MM-DDTHH:mm:ss"` |

**Pilihan `status`:** `"Active"` · `"Testnet"` · `"Upcoming"` · `"Mainnet"` · `"Distributed"`

**Pilihan `confirmationStatus`:**
- `"confirmed"` → muncul di sub-tab **Confirmed** (airdrop sudah resmi diumumkan)
- `"rumored"` → muncul di sub-tab **Rumored** (masih spekulatif / belum pasti)

---

## Field Opsional

| Field | Tipe | Keterangan |
|---|---|---|
| `icon` | string | Emoji sebagai ikon, misal `"🔷"`. Kosongkan jika tidak ada (`""`) |
| `customImage` | string | URL gambar custom untuk ikon. Kosongkan jika tidak ada (`""`) |
| `tags` | array | Kategori tag, misal `["Layer2", "ZK"]`. Kosongkan dengan `[]` |
| `description` | string | Deskripsi singkat 1–2 kalimat tentang proyek |
| `howToGuide` | array | Langkah-langkah cara farming. Lihat format di template |

---

## Template Lengkap (copy-paste ini)

```json
{
  "id": 99,
  "icon": "",
  "title": "Nama Proyek",
  "url": "domain.io",
  "customImage": "",
  "tags": ["Layer1", "DeFi"],
  "description": "Deskripsi singkat proyek, 1–2 kalimat.",
  "status": "Active",
  "difficulty": "Medium",
  "confirmationStatus": "confirmed",
  "addedAt": "2026-08-02T10:00:00",
  "howToGuide": [
    "Langkah pertama — misal kunjungi website dan hubungkan wallet.",
    "Langkah kedua — misal lakukan bridge atau swap.",
    "Langkah ketiga — misal pantau pengumuman di Twitter/X resmi."
  ]
}
```

### Template Minimal (tanpa howToGuide dan icon)

```json
{
  "id": 99,
  "icon": "",
  "title": "Nama Proyek",
  "url": "domain.io",
  "customImage": "",
  "tags": ["Layer1"],
  "description": "Deskripsi singkat proyek.",
  "status": "Testnet",
  "difficulty": "Easy",
  "confirmationStatus": "rumored",
  "addedAt": "2026-08-02T10:00:00"
}
```

---

## Contoh: Menambahkan 5 Airdrop Sekaligus dengan Urutan Tertentu

Kalau ingin urutan tampil dari atas ke bawah: **A → B → C → D → E**,
isi `addedAt` dengan datetime **menurun** (A paling besar, E paling kecil):

```json
{ "id": 7,  "title": "A — tampil paling atas", "addedAt": "2026-08-02T10:05:00", ... }
{ "id": 8,  "title": "B",                      "addedAt": "2026-08-02T10:04:00", ... }
{ "id": 9,  "title": "C",                      "addedAt": "2026-08-02T10:03:00", ... }
{ "id": 10, "title": "D",                      "addedAt": "2026-08-02T10:02:00", ... }
{ "id": 11, "title": "E — tampil paling bawah","addedAt": "2026-08-02T10:01:00", ... }
```

> Beda 1 menit per entry sudah cukup. Posisi di dalam array JSON tidak berpengaruh.

---

## Checklist Sebelum Save

- [ ] `id` belum pernah dipakai di `airdrops.json`
- [ ] `url` tanpa `https://`
- [ ] `status` sesuai pilihan yang valid
- [ ] `confirmationStatus` diisi `"confirmed"` atau `"rumored"`
- [ ] `addedAt` format `"YYYY-MM-DDTHH:mm:ss"`
- [ ] Kalau menambahkan banyak sekaligus: setiap entry punya `addedAt` yang berbeda
