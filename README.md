# cursor-skills

Install Cursor skills globally — all projects, no per-repo git files.

Repo: https://github.com/jaimarbacs-prog/cursor-skills

## Skills

| Mention | What it does |
|---|---|
| `@review` | Safety review of a git diff (English) |
| `@review -t` | Same review, Tagalog output |
| `@tr -e "text"` | Translate / rephrase to **professional software-engineering English** |
| `@tr -t "text"` | Translate / rephrase to professional Tagalog |

`@tr` uses a Sider-style technical translation pass: meaning first, then a native rewrite. It is not a word-for-word swap. Identifiers, paths, and code stay as written.

Example:

```
@tr -e "ayusin mo ito, nawala yung text"
```

Output:

```
Please restore the missing text.
```

## Other laptop

```bash
git clone https://github.com/jaimarbacs-prog/cursor-skills.git
cd cursor-skills
npx --yes . init --ai cursor --global
```

Restart Cursor or open a new chat. Then type `@review` or `@tr -e "..."`.

Update later:

```bash
git pull
npx --yes . init --ai cursor --global --force
```

Install only translation:

```bash
npx --yes . init --ai cursor --global --skill tr --force
```

## What it installs

`~/.cursor/skills/review/`  
`~/.cursor/skills/tr/`

Windows:

`%USERPROFILE%\.cursor\skills\review\`  
`%USERPROFILE%\.cursor\skills\tr\`

## Uninstall

```bash
npx --yes . uninstall --ai cursor --global
```

Remove only `@tr`:

```bash
npx --yes . uninstall --ai cursor --global --skill tr
```
