# cursor-review-skill

Install the **@review** Cursor skill globally — all projects, no per-repo git files.

## This laptop (after clone)

```bash
cd cursor-review-skill
npx --yes . init --ai cursor --global
```

Restart Cursor or open a new chat. Type `@review` and paste a git diff.

Update later:

```bash
git pull
npx --yes . init --ai cursor --global --force
```

## What it installs

`~/.cursor/skills/review/`  
Windows: `%USERPROFILE%\.cursor\skills\review\`

## Uninstall

```bash
npx --yes . uninstall --ai cursor --global
```
