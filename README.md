# Khrysmar 2026

Static website refresh for Khrysmar Music Studio.

## Local preview

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000/`.

## Content source

Content is maintained from [khrysmar/khrysmar.github.io](https://github.com/khrysmar/khrysmar.github.io), while this repository owns the redesign.

Last incorporated on November 19, 2026, from source commit `4e24f9125dd7ac5441b9528fb6ff63d7d6bab917` (November 15, 2026). This includes the June 7, 2026 recital, studio location and map, Da Capo affiliation, lesson and trio details, and site icons.

The 2026 recital videos and posters are stored in `assets/video/recital-2026/`; the group photo is resized to 1800 pixels and stored as WebP in `assets/images/`. Videos load only when played. Older photos and YouTube performances retain their existing source links.

Updates are applied manually: compare the source pages and shared footer, carry the content into the current layouts, and copy any new media. There is no automatic content sync.
