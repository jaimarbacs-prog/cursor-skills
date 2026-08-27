# cursor-review-skill

Install the **@review** Cursor skill globally — all projects, no per-repo git files.

Repo: https://github.com/jaimarbacs-prog/cursor-skills

## Other laptop

```bash
git clone https://github.com/jaimarbacs-prog/cursor-skills.git
cd cursor-skills
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
