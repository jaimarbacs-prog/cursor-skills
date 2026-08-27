---
name: review
description: >-
  Reviews pasted git diffs or new-dev code changes and prints a structured
  safety review (what was hit, syntax/logic bugs, percent affected, cruciality,
  suggestions). Use when the user types @review, @review -t, "review",
  "review changes", pastes a git diff/patch, or asks if a new developer's
  changes are safe. @review is English. @review -t is Tagalog.
---

# Review (@review)

Review pasted changes (git diff, patch, or file contents). Do **not** implement fixes unless the user asks.

Lead with the verdict. Be specific: file + function + why it breaks.

## Language

| Trigger | Output language |
|---|---|
| `@review` (no `-t`) | **English** — headings, labels, and body |
| `@review -t` | **Tagalog** — headings, labels, and body |

Also treat as Tagalog: `@review -t`, `review -t`, `@review -T` (anywhere in the first line before the paste).

Keep file paths, function names, table names, and code identifiers in English in both modes.

Do **not** mix languages. Do **not** follow the rest of the chat language — the flag wins.

## Input

Accept any of:

- `@review` or `@review -t` + pasted `git diff` / `git show` / patch
- `@review` or `@review -t` + pasted file contents
- `@review` or `@review -t` with no paste → review current uncommitted git changes (`git diff` + `git diff --cached`)

If the paste is incomplete, still review it. If the files exist in the workspace, read callers and surrounding code before judging. Do not invent hunks that are not in the paste or git output.

## Workflow

```
- [ ] Detect language (@review vs @review -t)
- [ ] Parse the diff (files, +/-, before/after)
- [ ] Open hit files and related callers (controllers, UI, save paths)
- [ ] Score: syntax, logic, behavior change, data/schema, side effects
- [ ] Estimate percent affected
- [ ] Set cruciality
- [ ] Print the matching language template — nothing else before it
```

## Percent affected

Estimate, label it as estimate:

1. **Files:** `changed files / files in the same feature folder` (or module).
2. **Lines:** `(added + removed) / current file line count` when the file is in the workspace.
3. Report the **higher** of the two as the headline percent, and mention both.

Never invent a precise number. Round to a sensible range (`~10%`, `~25%`, `~40%`).

## Cruciality

Pick **one**:

| English | Tagalog | When |
|---|---|---|
| **Critical** | **Kritikal** | Wrong data written, payroll/attendance/money wrong, auth bypass, data loss, silent corrupt save |
| **High** | **Mataas** | Real logic bug on a main user path; easy to hit; wrong records created |
| **Medium** | **Katamtaman** | Edge case (pagination, empty state, race); behavior change; misleading UX |
| **Low** | **Mababa** | Style, copy, comments, unused code, naming |

## Verdict

Pick **one**:

| English | Tagalog | When |
|---|---|---|
| **Safe** | **Ligtas** | No logic/syntax bugs; no risky behavior change |
| **Mostly safe** | **Medyo ligtas** | OK to ship with notes, or a real bug that is edge-only |
| **Not safe** | **Hindi ligtas** | Main-path logic bug, data risk, or Critical/High that must be fixed first |

**Ship:** English `Yes` / `Fix first` / `Do not ship` — Tagalog `Oo` / `Ayusin muna` / `Huwag i-ship`

## Output — English (`@review`)

```markdown
## Review

> **Verdict:** [Safe | Mostly safe | Not safe]
> **Cruciality:** [Critical | High | Medium | Low]
> **Affected:** ~[N]% of [feature/module] ([files], [lines])
> **Ship:** [Yes | Fix first | Do not ship]

### What changed
[3–6 bullets]

### What was hit
- **Files:** …
- **Screen / flow:** …
- **API / save path:** …
- **Tables / data:** … (or None)
- **Callers still assuming old behavior:** … (or None)

### Scorecard
| Check | Result |
|---|---|
| Syntax bugs | None / N found |
| Logic bugs | None / N found |
| Behavior change | Yes / No — [one line] |
| Data / schema risk | None / Yes — [one line] |
| Auto-save / side effects | … |
| Security | None / … |

### Syntax bugs
None

### Logic bugs
None

### Suggestions
1. …

### Test
- [ ] …
```

## Output — Tagalog (`@review -t`)

```markdown
## Review

> **Hatol:** [Ligtas | Medyo ligtas | Hindi ligtas]
> **Tindi:** [Kritikal | Mataas | Katamtaman | Mababa]
> **Naapektuhan:** ~[N]% ng [feature/module] ([files], [lines])
> **I-ship:** [Oo | Ayusin muna | Huwag i-ship]

### Ano ang binago
[3–6 bullets]

### Ano ang natamaan
- **Files:** …
- **Screen / flow:** …
- **API / save path:** …
- **Tables / data:** … (o Wala)
- **Callers na umaasa pa sa luma:** … (o Wala)

### Scorecard
| Check | Result |
|---|---|
| Syntax bugs | Wala / N nahanap |
| Logic bugs | Wala / N nahanap |
| Behavior change | Oo / Hindi — [isang linya] |
| Data / schema risk | Wala / Oo — [isang linya] |
| Auto-save / side effects | … |
| Security | Wala / … |

### Syntax bugs
Wala

### Logic bugs
Wala

### Mungkahi
1. …

### Test
- [ ] …
```

## Extra checks (always consider)

- Default value flipped (checked vs unchecked, null vs 0)
- Multi-page / selected-row state vs current-page-only loops
- Client flag vs what Create/Update actually persists
- Soft delete vs hard delete
- `company_id` / employee scope missing
- Trusting client `is_*` flags without server check
- Toast/copy overstating what the button does

## Do not

- Do not implement or edit files unless asked.
- Do not rubber-stamp “LGTM” without naming what was hit.
- Do not skip logic review because syntax is clean.
- Do not treat “no save until Create” as automatically safe if Create will persist the wrong flags.

## Example

`@review` (English):

```markdown
## Review

> **Verdict:** Mostly safe
> **Cruciality:** Medium
> **Affected:** ~20% of Dashboard Face Log create form
> **Ship:** Fix first if users select across pages

### Logic bugs
1. **Selected rows on other pages stay unlimited** — Apply to all only mutates current page; `getTableData` restores selected rows from `selected_employee` and skips apply-all.
```

`@review -t` (Tagalog):

```markdown
## Review

> **Hatol:** Medyo ligtas
> **Tindi:** Katamtaman
> **Naapektuhan:** ~20% ng Dashboard Face Log create form
> **I-ship:** Ayusin muna kung may select sa ibang page

### Logic bugs
1. **Naka-select sa ibang page, unlimited pa rin** — Current page lang ang ina-update ng Apply to all; bine-restore ng `getTableData` ang `selected_employee` at hindi ina-apply ang apply-all.
```

For a longer gold sample, see [examples.md](examples.md).
