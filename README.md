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
| `/gs` | Generate a professional English reply from a pasted client question |
| `@professional-client-communication` | Rewrite informal notes into a short client-ready message |

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

Restart Cursor or open a new chat. Then type `@review`, `@tr -e "..."`, or `/gs` plus the client's message.

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
`~/.cursor/skills/gs/`  
`~/.cursor/skills/professional-client-communication/`

Windows:

`%USERPROFILE%\.cursor\skills\review\`  
`%USERPROFILE%\.cursor\skills\tr\`  
`%USERPROFILE%\.cursor\skills\gs\`  
`%USERPROFILE%\.cursor\skills\professional-client-communication\`

## Uninstall

```bash
npx --yes . uninstall --ai cursor --global
```

Remove only `@tr`:

```bash
npx --yes . uninstall --ai cursor --global --skill tr
```
