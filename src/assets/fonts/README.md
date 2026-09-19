# Fonts

JANGAN komit font proprietary (mis. Arial / Microsoft) ke repo ini.

OG image memakai **Inter (SIL Open Font License)** dari paket npm
`@expo-google-fonts/inter` — file TTF dibaca langsung dari `node_modules`
saat build, jadi tidak ada biner font di repo.

Kalau ganti font OG: pilih font berlisensi OFL, install via npm,
arahkan `fonts: [...]` di `src/pages/og/[...slug].png.ts` ke file TTF/OTF-nya
(Satori/CanvasKit tidak mendukung woff2), dan samakan `families`.
