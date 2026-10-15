# Opportunity stages: add Signed, Lost and Parked

- **Why not the manifest:** Stage is a standard Twenty field. An app can add fields to a standard object but cannot change the options of a field it does not own. The automation (W4, W7, W8) and the opportunity views (`runbooks/05-views.md`) use the API values `SIGNED`, `LOST` and `PARKED`, defined in `kuec/app/src/constants/opportunity-stage.ts`.
- **Written against:** Twenty 2.48.0.
- **Prerequisites:** the ED's Admin account (Data model permission). Do this before the first `app:install` of `kuec-bd-ops` 0.2.0 or later: the app's views filter on these values, and install rejects a view filter that names a stage option that does not exist.

## Steps

1. Settings > **Data model** > **Opportunities** > field **Stage**.
2. Under Options, **Add option** three times, keeping the existing options (removing an option clears it from every record that has it):

   | Label | API value | Colour |
   | --- | --- | --- |
   | Signed | `SIGNED` | Green |
   | Lost | `LOST` | Red |
   | Parked | `PARKED` | Gray |

   The API value is shown under the label when **Advanced mode** is on (toggle at the bottom of Settings). Type it exactly; the automation compares it as written.
3. Drag the three options to the end of the list. **Save**.

## Expected result

Opportunity > Stage offers the new options after the existing ones. The kanban view groups by them.

## Verify

1. With the app installed, create a test opportunity, set Stage to Lost with no lost reason. Within a minute: Stage entered at is set, and a task "Record lost reason: <name>" is assigned to the owner.
2. With Advanced mode on, Settings > Data model > Opportunities > Stage shows the API values `SIGNED`, `LOST`, `PARKED`.
3. Delete the test opportunity and its task.

## Undo

Do not delete the options: records in those stages would lose their stage, W4 would start flagging closed opportunities, and the Lost with reasons, Parked and open-pipeline views would stop matching. To retire one, relabel it with a `(deprecated)` suffix and note the date and reason here.
