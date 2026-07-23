# Plan 03 — Status Badge & Legend

## Masalah
Ada banyak badge status tersebar di berbagai tab: "Active", "New", "Rumored", "Confirmed", "Soon", "TGE", "Snapshot", "DAO", "Testnet", "Launch", "Medium" (level effort), dsb. Warnanya beda-beda tapi tidak ada keterangan di mana pun yang jelasin arti tiap warna/badge ke user baru.

## Requirement
- Tambah komponen "Legend" kecil (bisa collapsible/expandable) yang menjelaskan arti tiap warna badge status, ditempatkan di tab Airdrop (dekat search bar) dan tab Discover > Kalender.
- Pastikan warna badge dengan makna sama dipakai konsisten di semua tab (misal "Active" harus selalu hijau di mana pun dia muncul — Airdrop List, Info Terkini, dsb).
- Tidak perlu ubah data/isi badge, cuma audit & rapikan konsistensi warna + tambah legend.

## Prompt Siap Pakai untuk Replit AI Agent

```
Saya mau rapikan konsistensi badge status di app HUNTER WAVE (PWA airdrop hunter dashboard) tanpa mengubah data yang sudah ada, murni UI/UX.

Badge status yang dipakai di app ini antara lain: Active, New, Rumored, Confirmed, Soon, TGE, Snapshot, DAO, Testnet, Launch, dan level effort seperti Medium.

Tolong lakukan ini:
1. Audit semua tempat badge status muncul (tab Airdrop List, tab Info Terkini, tab Discover > Kalender) dan pastikan badge dengan makna yang sama pakai warna yang sama persis di semua tempat itu (contoh: "Active" harus selalu hijau, "New" selalu warna yang sama, dst). Kalau ada inkonsistensi warna sekarang, samakan.
2. Tambahkan komponen "Legend" kecil yang collapsible (bisa expand/collapse) di tab Airdrop List, ditaruh dekat search bar "Cari airdrop...". Isinya daftar kecil warna + arti (contoh: hijau = Active, biru = New, dst).
3. Tambahkan komponen Legend yang sama juga di tab Discover > Kalender, dekat header "Discover".
4. Style legend mengikuti dark theme yang sudah ada, ukurannya kecil dan tidak mengganggu (bisa default collapsed, expand saat di-tap).

Setelah selesai, list semua warna badge dan arti yang dipakai supaya konsisten ke depannya.
```
