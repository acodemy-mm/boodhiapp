# Dictionary data

| Path | Purpose |
|------|---------|
| `tipitaka-abidan.db` | SQLite index for Abhidhamma dictionary search (~18MB) |
| `tipitaka-abidan-credit.txt` | Attribution for the Tipitaka Abidan source |
| `abidan-books/` | Cached PDF volumes (downloaded on demand) |
| `abidan-pages/` | Cached MuPDF page renders (downloaded on demand) |

Place `tipitaka-abidan.db` in this folder for local dictionary search. The file is gitignored because of size; keep `tipitaka-abidan-credit.txt` in git.
