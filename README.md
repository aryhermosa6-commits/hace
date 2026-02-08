# Ponorogo Hardcore Web (v3.1)

Rebuild dari chat: **gas semua** fitur tambahan, **kecuali #16 & #19**.

## Termux run
```bash
pkg update -y
pkg install nodejs -y
cd ~
unzip ponorogo-hardcore-web-v3.1.zip
cd ponorogo-hardcore-web
npm install
npm run dev
```
Buka: http://127.0.0.1:3000

## Admin
- /admin
- Default PIN: 1337 (ubah di .env.local)

## Env (opsional)
Buat `.env.local`:
```
ADMIN_PIN=1337
SESSION_SECRET=change-this
IMG_SECRET=change-this-too
```

## Ganti asset kamu
- public/images/logo.png
- public/images/baju-depan.png
- public/images/baju-belakang.png
- public/images/longsleeve-depan.png
- public/images/longsleeve-belakang.png
- public/lookbook/1.png s/d 6.png
- optional hero video: public/media/hero.mp4

## Deploy Cloudflare Workers (gratis) via OpenNext
Project ini sudah disiapkan untuk Cloudflare Workers pakai OpenNext.

File yang ditambahkan:
- `wrangler.jsonc`
- `open-next.config.ts`

Script baru di `package.json`:
- `npm run preview`
- `npm run deploy`

Langkah singkat (disarankan pakai PC / CI):
```bash
npm install
npm run preview
npm run deploy
```

Catatan:
- `wrangler.jsonc` → ganti field `name` sesuai nama Worker kamu di Cloudflare.
- Env di Workers harus di-set lewat Dashboard (Workers & Pages → Worker → Settings → Variables & Secrets).
