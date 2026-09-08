# Experiment-222 upload package

This adds a controlled 2 × 2 × 2 marketplace experiment to the existing Next.js app without changing the current homepage or blockchain prototype.

## Files to add

- `app/experiment/layout.tsx`
- `app/experiment/[condition]/page.tsx`

Do not replace `app/page.tsx`.

## Fixed condition coding

| Condition | Transparency (T) | Expert identity (E) | Immutability cue (I) |
|---|---:|---:|---:|
| 1 | 0 | 0 | 0 |
| 2 | 0 | 0 | 1 |
| 3 | 0 | 1 | 0 |
| 4 | 0 | 1 | 1 |
| 5 | 1 | 0 | 0 |
| 6 | 1 | 0 | 1 |
| 7 | 1 | 1 | 0 |
| 8 | 1 | 1 | 1 |

Participant-facing URLs after deployment: `/experiment/1` through `/experiment/8`.

## Manipulations

1. Transparency: low = result only; high = date, checks, reference match and outcome.
2. Expert identity: low = generic specialist; high = fictional named specialist plus neutral credentials.
3. Immutability: low = ordinary marketplace record with no blockchain/immutable/hash/Polygon language; high = blockchain ledger, permanence/resistance-to-alteration wording, record identifier and timestamp.

All other product, seller, price, visual, page structure, typography, button placement and marketplace information are held constant as far as practical.

## Research safeguards

- Each participant sees only one condition.
- Do not expose condition labels or numbers inside Qualtrics.
- Do not send participants to the normal homepage because it contains authentication/blockchain cues that can contaminate low conditions.
- `Maison Aurelia`, `LuxeMarket`, and `Emma Clarke` are fictional.
- The experiment is marked `noindex`/`nofollow`.
- The stimulus does not require the blockchain backend.

## Upload on GitHub

1. Open `yasin48/A-Capp-Project`.
2. Switch to branch `Experiment-222`.
3. Add the two files above in the exact paths shown.
4. Commit to `Experiment-222` only.
5. Do not merge into `main` until testing is complete.

If using GitHub's web editor, choose **Add file → Create new file** and type the complete path, e.g. `app/experiment/layout.tsx`.

## Test all 8 URLs

Verify:
- 1 = T0 E0 I0
- 2 = T0 E0 I1
- 3 = T0 E1 I0
- 4 = T0 E1 I1
- 5 = T1 E0 I0
- 6 = T1 E0 I1
- 7 = T1 E1 I0
- 8 = T1 E1 I1

Check both desktop and mobile before data collection.
