# Plan 02 — Bookmark Management

## Masalah
Tab Bookmark punya 4 daftar berwarna (kuning, biru, merah, + tombol tools/hapus) yang dinamakan generik "Daftar 1", "Daftar 2", "Daftar 3". Nama generik ini bikin bingung setelah user nyimpen banyak item — user gak inget daftar mana isinya apa.

## Requirement
- User bisa rename tiap daftar (misal "Watchlist Utama", "Testnet", "Prioritas Tinggi") dengan tap nama daftar atau lewat opsi edit kecil di sebelahnya.
- Nama custom disimpan di localStorage bareng data bookmark yang sudah ada (tetap localStorage, tidak ubah arsitektur data).
- Warna tab (kuning/biru/merah) tetap dipertahankan sebagai penanda visual, tapi teksnya sekarang mengikuti nama custom user, bukan "Daftar N" lagi. Kalau user belum kasih nama, fallback ke "Daftar 1/2/3" seperti sekarang.
- Tambah tombol export (download JSON) dan import (upload JSON) di tab Bookmark, supaya user bisa backup manual sebelum ganti device atau clear cache browser.

## Prompt Siap Pakai untuk Replit AI Agent

```
Saya mau perbaiki tab Bookmark di app HUNTER WAVE (PWA airdrop hunter dashboard). Bookmark sekarang disimpan di localStorage dengan 4 daftar berwarna (kuning, biru, merah, dan satu tombol tools/hapus), diberi nama generik "Daftar 1", "Daftar 2", "Daftar 3".

Tolong lakukan ini di tab Bookmark, tanpa mengubah cara bookmark disimpan (tetap localStorage):
1. Izinkan user rename tiap daftar dengan tap nama daftar (munculkan input text kecil atau modal rename). Nama custom disimpan di localStorage.
2. Kalau user belum pernah rename, tampilkan default "Daftar 1", "Daftar 2", "Daftar 3" seperti sekarang. Warna tab (kuning/biru/merah) tidak berubah, cuma teksnya yang dinamis ikut nama custom.
3. Tambahkan dua tombol kecil di header tab Bookmark: "Export" (download semua data bookmark termasuk nama daftar custom sebagai file .json) dan "Import" (upload file .json untuk restore data bookmark). Taruh di dekat badge "3 tersimpan" yang sudah ada.
4. Validasi saat import: kalau format JSON tidak sesuai skema bookmark yang dipakai app, tampilkan pesan error, jangan crash atau timpa data lama.

Pertahankan gaya visual dark theme yang sudah ada. Setelah selesai, jelaskan struktur data localStorage baru yang menyimpan nama custom daftar.
```
