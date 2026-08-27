---
name: review
description: >-
  Reviews pasted git diffs or new-dev code changes and prints a structured
  safety review (what was hit, syntax/logic bugs, percent affected, cruciality,
  suggestions). Use when the user types @review, "review", "review changes",
  pastes a git diff/patch, or asks if a new developer's changes are safe.
---

# Review (@review)

Review pasted changes (git diff, patch, or file contents). Do **not** implement fixes unless the user asks.

Match the user's language (English or Taglish). Lead with the verdict. Be specific: file + function + why it breaks.

## Input

Accept any of:

- `@review` + pasted `git diff` / `git show` / patch
- `@review` + pasted file contents
- `@review` with no paste → review current uncommitted git changes (`git diff` + `git diff --cached`)

If the paste is incomplete, still review it. If the files exist in the workspace, read callers and surrounding code before judging. Do not invent hunks that are not in the paste or git output.

## Workflow

```
- [ ] Parse the diff (files, +/-, before/after)
- [ ] Open hit files and related callers (controllers, UI, save paths)
- [ ] Score: syntax, logic, behavior change, data/schema, side effects
- [ ] Estimate percent affected
- [ ] Set cruciality
- [ ] Print the template — nothing else before it
```

## Percent affected

Estimate, label it as estimate:

1. **Files:** `changed files / files in the same feature folder` (or module).
2. **Lines:** `(added + removed) / current file line count` when the file is in the workspace.
3. Report the **higher** of the two as the headline percent, and mention both.

Example: `~18% of Dashboard Face Log create flow (1/6 files in the folder, ~80/734 lines in information.vue)`

Never invent a precise number. Round to a sensible range (`~10%`, `~25%`, `~40%`).

## Cruciality

Pick **one**:

| Level | When |
|---|---|
| **Critical** | Wrong data written, payroll/attendance/money wrong, auth bypass, data loss, silent corrupt save |
| **High** | Real logic bug on a main user path; easy to hit; wrong records created |
| **Medium** | Edge case (pagination, empty state, race); behavior change; misleading UX |
| **Low** | Style, copy, comments, unused code, naming |

## Verdict

Pick **one**:

| Verdict | When |
|---|---|
| **Safe** | No logic/syntax bugs; no risky behavior change |
| **Mostly safe** | OK to ship with notes, or a real bug that is edge-only |
| **Not safe** | Main-path logic bug, data risk, or Critical/High that must be fixed first |

## Output template

Use this structure every time. Omit an empty bugs subsection only if you write `None`.

```markdown
## Review

> **Verdict:** [Safe | Mostly safe | Not safe]
> **Cruciality:** [Critical | High | Medium | Low]
> **Affected:** ~[N]% of [feature/module] ([files], [lines])
> **Ship:** [Yes | Fix first | Do not ship]

### What changed
[3–6 bullets: what the new code actually does vs old]

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

or numbered items with `file:line` (or symbol) and expected break.

### Logic bugs
None

or numbered items: **title** — steps to hit it — wrong vs intended result.

### Suggestions
1. [Concrete fix, smallest change]
2. …

### Test
- [ ] [Main path]
- [ ] [The bug path]
- [ ] [Empty / disabled / other-page / unselected]
```

## Extra checks (always consider)

Add a bullet under **What was hit** or **Scorecard** when relevant:

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

User: `@review` + git diff that adds Apply-to-all on a paginated table.

Gold shape (short):

```markdown
## Review

> **Verdict:** Mostly safe
> **Cruciality:** Medium
> **Affected:** ~20% of Dashboard Face Log create form
> **Ship:** Fix first if users select across pages

### What changed
- Apply to all checks Limited Devices on the current page and later pages when loaded.
- Create still persists. Default for employees with no face-log row is now unlimited.

### Logic bugs
1. **Selected rows on other pages stay unlimited** — Apply to all only mutates current page; `getTableData` restores selected rows from `selected_employee` and skips apply-all. Create then saves those as `NO_BIND`.

### Suggestions
1. Also run setDeviceLimit on `selected_employee`, or honor apply-all even when a matched selected row exists (unless manually overridden).
```

For a longer gold sample, see [examples.md](examples.md).
