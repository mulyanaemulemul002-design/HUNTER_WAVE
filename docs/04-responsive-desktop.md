# Plan 04 — Responsive Layout (Desktop/Wide Screen)

## Masalah
App bisa diakses siapa saja (public), tapi layoutnya full mobile-pattern: bottom nav bar 5 tab, semua konten single-column lebar penuh. Kalau dibuka dari browser desktop/layar lebar, bottom nav dan layout single-column akan terasa aneh dan buang-buang ruang.

## Requirement
- Di breakpoint lebar (misal >= 1024px), ganti bottom nav bar jadi sidebar nav atau top nav horizontal.
- Konten utama di layar lebar dibatasi max-width (misal 480px–600px, seperti tampilan mobile-container di tengah) ATAU dibuat grid multi-kolom untuk list (Airdrop List, Discover), pilih salah satu — sebutkan alasan yang dipilih di akhir.
- Di breakpoint mobile (< 1024px), behavior tetap seperti sekarang (bottom nav, single column) — tidak ada regresi.
- PWA install prompt tetap berfungsi normal di kedua breakpoint.

## Prompt Siap Pakai untuk Replit AI Agent

```
Saya mau app HUNTER WAVE (PWA airdrop hunter dashboard) tetap enak dipakai kalau diakses dari browser desktop/layar lebar, bukan cuma mobile. Sekarang app ini pakai bottom nav bar dengan 5 tab (Intro, Info Terkini, Airdrop, Bookmark, Discover) dan konten single-column lebar penuh, yang didesain mobile-first.

Tolong lakukan ini, murni UI/UX, tanpa ubah logic data:
1. Tambahkan breakpoint responsif untuk layar lebar (>= 1024px). Di breakpoint ini, ganti bottom nav bar jadi sidebar nav vertikal di kiri (atau top nav horizontal — pilih salah satu yang lebih mudah diimplementasikan dengan struktur komponen nav yang sudah ada, lalu jelaskan alasannya).
2. Untuk konten utama di layar lebar, terapkan salah satu dari dua opsi ini (pilih yang lebih cocok dengan struktur komponen sekarang, lalu jelaskan alasannya):
   - Opsi A: tetap satu kolom tapi dengan max-width sekitar 480–600px, dipusatkan di tengah layar (seperti tampilan "mobile frame" di tengah desktop).
   - Opsi B: ubah list (Airdrop List, Discover P2P Seller, Discover Platform & Tools) jadi grid 2–3 kolom di layar lebar.
3. Pastikan behavior di layar mobile (< 1024px) tidak berubah sama sekali dari sekarang — bottom nav dan single-column tetap seperti semula.
4. Pastikan PWA install prompt/banner tetap muncul dan berfungsi normal di kedua breakpoint.

Setelah selesai, jelaskan opsi mana yang dipakai untuk nav dan layout konten, dan kenapa.
```
