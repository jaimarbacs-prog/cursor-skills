# @review examples

## Trigger

English (default):

```
@review

[paste git diff or file here]
```

Tagalog:

```
@review -t

[paste git diff or file here]
```

No paste → review `git diff` + staged diff in the current repo.

## Gold output — `@review` (English)

```markdown
## Review

> **Verdict:** Mostly safe
> **Cruciality:** Medium
> **Affected:** ~20% of Dashboard Face Log create flow (information.vue + all() SQL)
> **Ship:** Fix first if users select employees across pages

### What changed
- Apply to all checks Limited Devices on the current page, and on other pages when those rows load.
- Nothing is saved until Create.
- Skips employees who already have devices (`is_disabled`).
- SQL default: no `employee_dashboard_face_logs` row → unlimited (`NO_BIND` if saved).

### What was hit
- **Files:** `resources/js/pages/employee_dashboard_face_log/steps/information.vue`, `app/Http/Controllers/EmployeeDashboardFaceLogController.php`
- **Screen / flow:** Dashboard Face Log → Create employee picker
- **API / save path:** `create()` still uses `is_limited_devices` from selected rows
- **Tables / data:** `employee_dashboard_face_logs` only after Create (`NO_BIND` vs `UNBINDED`)
- **Callers still assuming old behavior:** Create form default was limited-checked; now unchecked

### Scorecard
| Check | Result |
|---|---|
| Syntax bugs | None |
| Logic bugs | 1 found |
| Behavior change | Yes — no face-log row now defaults unlimited |
| Data / schema risk | None |
| Auto-save / side effects | No — Create still saves |
| Security | None new (client still sends `is_limited_devices`) |

### Syntax bugs
None

### Logic bugs
1. **Selected employees on other pages stay unlimited** — `applyLimitedDevicesAll()` only updates the current page. `getTableData` restores selected rows from `selected_employee` and returns before apply-all. Create then saves those as `NO_BIND`.

### Suggestions
1. Loop `selected_employee` in Apply to all (`setDeviceLimit`), or honor apply-all for matched rows unless `limited_devices_overrides` exists.
2. Soften the toast: it does not check row selection, only Limited Devices.

### Test
- [ ] Apply to all on page 1, select, Create → limited / `UNBINDED`
- [ ] Select page 1 + page 2, Apply to all on page 1, Create → both limited (this is the bug today)
- [ ] Employee with existing devices stays disabled
- [ ] Manual uncheck after Apply to all sticks after pagination
```

## Gold output — `@review -t` (Tagalog)

```markdown
## Review

> **Hatol:** Medyo ligtas
> **Tindi:** Katamtaman
> **Naapektuhan:** ~20% ng Dashboard Face Log create flow (information.vue + all() SQL)
> **I-ship:** Ayusin muna kung may select sa ibang page

### Ano ang binago
- Naka-check ang Limited Devices sa current page, at sa ibang page kapag na-load.
- Walang save hanggang Create.
- Nilalaktawan ang employees na may devices na (`is_disabled`).
- SQL default: walang `employee_dashboard_face_logs` row → unlimited (`NO_BIND` kung ise-save).

### Ano ang natamaan
- **Files:** `resources/js/pages/employee_dashboard_face_log/steps/information.vue`, `app/Http/Controllers/EmployeeDashboardFaceLogController.php`
- **Screen / flow:** Dashboard Face Log → Create employee picker
- **API / save path:** `create()` gumagamit pa rin ng `is_limited_devices` mula sa selected rows
- **Tables / data:** `employee_dashboard_face_logs` pagkatapos ng Create (`NO_BIND` vs `UNBINDED`)
- **Callers na umaasa pa sa luma:** Dati naka-check ang limited; ngayon unchecked

### Scorecard
| Check | Result |
|---|---|
| Syntax bugs | Wala |
| Logic bugs | 1 nahanap |
| Behavior change | Oo — walang face-log row, unlimited na ang default |
| Data / schema risk | Wala |
| Auto-save / side effects | Hindi — Create pa rin ang nagsa-save |
| Security | Wala (client pa rin ang nagpapadala ng `is_limited_devices`) |

### Syntax bugs
Wala

### Logic bugs
1. **Naka-select sa ibang page, unlimited pa rin** — Current page lang ang ina-update ng `applyLimitedDevicesAll()`. Bine-restore ng `getTableData` ang `selected_employee` at hindi ina-apply ang apply-all. Create: `NO_BIND`.

### Mungkahi
1. I-loop din ang `selected_employee` sa Apply to all (`setDeviceLimit`), o i-honor ang apply-all kahit may matched row maliban kung may `limited_devices_overrides`.
2. Baguhin ang toast: Limited Devices lang ang ni-check, hindi ang row selection.

### Test
- [ ] Apply to all sa page 1, select, Create → limited / `UNBINDED`
- [ ] Select page 1 + page 2, Apply to all sa page 1, Create → parehong limited (bug ngayon)
- [ ] Employee na may devices, disabled pa rin
- [ ] Manual uncheck pagkatapos ng Apply to all, naka-stick after pagination
```
