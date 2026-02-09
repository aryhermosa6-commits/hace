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
