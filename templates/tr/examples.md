# @tr examples

## Trigger

English (default):

```
@tr -e "ayusin mo ito, nawala yung text"
```

or:

```
@tr -e

ayusin mo ito, nawala yung text
```

Tagalog:

```
@tr -t "The save fails when company_id is missing."
```

## Gold output — `@tr -e`

| Source | Output |
|---|---|
| ayusin mo ito, nawala yung text | Please restore the missing text. |
| hindi nagse-save pag walang `company_id` | Save fails when `company_id` is missing. |
| yung button disabled pa rin after save | The button remains disabled after a successful save. |
| di gumagana yung filter pag empty yung date | The filter does not work when the date is empty. |
| nagdo-double insert pag double click sa Save | A double-click on Save creates duplicate records. |
| yung modal hindi nagsasara after success | The modal does not close after a successful save. |
| i-rebase mo muna bago mag-PR | Rebase onto the latest base branch before opening the PR. |
| mali yung total kasi hindi kasama yung overtime | The total is incorrect because overtime is excluded. |
| please fix this, text is gone | Please restore the missing text. |

## Gold output — `@tr -t`

| Source | Output |
|---|---|
| Please restore the missing text. | Ibalik ang nawawalang text. |
| Save fails when `company_id` is missing. | Hindi nagse-save kapag walang `company_id`. |
| The button remains disabled after a successful save. | Naka-disable pa rin ang button pagkatapos ng successful save. |

## Ambiguous source

`@tr -e "ayusin mo yung sa taas"`

```markdown
Please fix the issue in the section above.

Assumed: "sa taas" refers to the UI section currently under discussion.
```
