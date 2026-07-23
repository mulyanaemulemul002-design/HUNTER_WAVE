# Plan 01 — Landing Page / Intro

## Masalah
Halaman Intro sekarang isinya sudah oke (deskripsi, disclaimer independensi, DYOR, follow sosmed, donasi, kontak founder), tapi strukturnya masih terasa seperti kumpulan "card info" berurutan, bukan landing page yang niat. Tidak ada elemen kepercayaan (social proof) dan tidak ada footer legal.

## Requirement
- Tambah hero section yang lebih kuat di paling atas (di atas card HUNTER WAVE yang sudah ada): headline besar, sub-headline singkat, dan CTA jelas ("Bergabung di Telegram" bisa jadi CTA utama, dipindah lebih ke atas).
- Tambah section social proof: jumlah member Telegram, jumlah proyek airdrop terdaftar, jumlah event di kalender — ambil dari data yang sudah ada, jangan hardcode.
- Tambah footer di paling bawah halaman Intro berisi: link Privacy Policy, link Terms/Disclaimer (boleh reuse konten DYOR yang sudah ada), dan copyright.
- Section "Kemandirian HUNTER WAVE" dan "DYOR" yang sudah ada dipertahankan, tapi posisinya taruh setelah social proof, sebelum footer.
- Jangan ubah section "Dukung via crypto (EVM)" dan kontak founder — posisinya sudah pas di bawah.

## Prompt Siap Pakai untuk Replit AI Agent

```
Saya mau perbaiki halaman Intro di app HUNTER WAVE (PWA airdrop hunter dashboard) tanpa mengubah logic data yang sudah ada. Ini murni perbaikan UI/UX, jangan sentuh cara fetch data JSON dari GitHub.

Tolong lakukan ini di halaman Intro:
1. Tambahkan hero section baru di paling atas halaman (di atas card profil HUNTER WAVE yang sekarang), berisi: headline besar, satu kalimat sub-headline, dan tombol CTA "Bergabung di Telegram" yang menonjol.
2. Tambahkan section "social proof" berupa 3 angka ringkas: jumlah member Telegram, jumlah proyek airdrop terdaftar (hitung dari data airdrop yang sudah ada), dan jumlah event di kalender (hitung dari data kalender yang sudah ada). Jangan hardcode angka — ambil dari data real yang sudah dipakai di tab Airdrop dan tab Discover > Kalender.
3. Pindahkan section "Kemandirian HUNTER WAVE" dan "DYOR — Do Your Own Research" ke posisi setelah social proof, sebelum bagian dukungan crypto.
4. Tambahkan footer di paling bawah halaman Intro dengan link "Privacy Policy" dan "Terms & Disclaimer" (untuk sekarang boleh reuse teks DYOR yang sudah ada sebagai isi Terms/Disclaimer), plus baris copyright kecil.
5. Pertahankan tema warna gelap (dark navy/blue) dan gaya visual yang sudah ada, jangan ubah palet warna.

Setelah selesai, tunjukkan struktur komponen baru halaman Intro dari atas ke bawah.
```
