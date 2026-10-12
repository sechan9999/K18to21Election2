# 21st presidential election — classified / recheck ballot analysis report

Prepared 2026-09-28 · data `summaries/k21_classified_recheck.json`, `corrected_data/k21_precinct_classified_recheck.csv`

## 1. What was compared

We compared ballots the sorting machine classified by candidate (classified) with ballots the machine could not read and a person re-verified (recheck-target). The recheck-target count is the published final tally minus the classified count.

| Metric | Definition |
|---|---|
| R1 | Kim Moon-soo / (Lee Jae-myung + Kim Moon-soo), classified ballots |
| R2 | Kim Moon-soo / (Lee Jae-myung + Kim Moon-soo), recheck-target ballots |
| K | R2 / R1 |
| OR | (recheck Kim/Lee) ÷ (classified Kim/Lee) |

The numerator is the conservative candidate (21st Kim Moon-soo, 20th Yoon Suk-yeol). If K or OR exceeds 1, the conservative's share is higher among recheck-target ballots than among classified ballots.

The K in the existing `summaries/k21_recount*.json` is out-of-district-early vote share ÷ in-district vote share (Lee basis), a different metric from this report's K. For example, that file's Lee R2 of 59.0% equals the 21st out-of-district-early final share (58.98%).

## 2. Data and validation

- Transcribed the tally-sheet PDFs for all 17 provinces. Of 18,847 precinct rows, 763 (residence, shipboard, overseas, misdelivered, etc.) were flagged for cross-check only and excluded from the analysis.
- Transcription method: 17,522 rows automatic, 527 manually verified, 34 completed arithmetically.
- Three checks were run on every row:
  - Sum of the 5 candidates = total
  - Total + recheck-target = published turnout
  - Across all 18,040 precincts joined with published invalid ballots, classified + recheck + invalid = votes

## 3. National results

| Ballot type | R1 | R2 | K | OR [95% CI] |
|---|---|---|---|---|
| All | 0.456 | 0.508 | 1.113 | 1.230 [1.210, 1.251] |
| In-district early | 0.285 | 0.353 | 1.236 | 1.364 [1.333, 1.395] |
| Election day | 0.580 | 0.639 | 1.100 | 1.278 [1.264, 1.292] |
| Out-of-district early | 0.314 | 0.342 | 1.090 | 1.137 [1.103, 1.172] |

On a 5-candidate basis, the classified split is Lee Jae-myung 49.29%, Kim Moon-soo 41.36%, Lee Jun-seok 8.27%; the recheck-target split is 45.04%, 46.50%, 7.34% respectively.

Province OR ranges from Jeonnam 1.01, Jeonbuk 1.02 and Seoul 1.11 up to Gyeongnam 1.57 and Gyeongbuk 1.59.

## 4. R2 = a + b·R1 regression (district level)

![20th/21st overlaid fit plot](/analysis/k20_k21_fitplot_overlay.png)

| Model | n | Fit | R² |
|---|---|---|---|
| 20th (corrected) | 248 | −0.002 + 1.107·R1 | 0.985 |
| 21st | 252 | 0.004 + 1.117·R1 | 0.982 |

- The slope difference between the two elections is +0.010 (p = 0.40). The shape of the relationship is the same.
- At R1 = 0.5 the 21st is +0.011 higher (p < 0.001). The 21st line is shifted slightly upward in parallel.
- Both elections have a negative quadratic term (about −0.25) — curvature from proportions bounded between 0 and 1.
- The residual distributions are the same across elections (KS p = 0.61). Only the 21st has a slightly longer left tail because of Gangnam-gu and Gunwi-gun (Shapiro p = 0.035). Excluding those two, normality is not rejected.
- In both elections the districts below the fit line are Gangnam-gu, Seocho-gu (K ≈ 1), and Gunwi-gun (highest R1, ceiling effect).

![21st fit diagnostics](/analysis/k21_fit_diagnostics.png)

## 5. In-district early vs election day

![21st fit plot by ballot type](/analysis/k21_fitplot_by_type.png)

| 21st | Fit | R2 at R1 = 0.5 | Mean K |
|---|---|---|---|
| In-district early | 0.020 + 1.190·R1 | 0.615 | 1.245 |
| Election day | −0.007 + 1.089·R1 | 0.538 | 1.060 |

- In paired comparison within the same district, the in-district-early OR is about 1.19x higher than election day. The direction is the same in 219 of 252 districts.
- Adding district fixed effects to the precinct-level model shrinks the in-district-early effect from log 0.189 to 0.019 (not significant). The result depends on the level of analysis, so interpret with care.
- The 20th data (pe20res) has no classified/recheck values by ballot type, so the 20th cannot be split this way.

## 6. Invalid ballots · recheck rate · age

![Invalid ballots, recheck rate and OR](/analysis/invalid_recheck_or.png)

- The invalid rate is unrelated to OR. Even if the invalid rate doubles, OR is ×0.99 [0.98, 1.00].
- The higher the recheck rate, the closer OR is to 1. If the recheck rate doubles, OR is ×0.92 [0.90, 0.94]. This looks like a dilution effect: the stricter the sorter, the more ordinary ballots end up in the recheck pile, weakening the skew.
- At the district level, the share aged 60+ is associated with the recheck rate (r = 0.64) and the invalid rate (r = 0.43). After controlling for R1, invalid rate and recheck rate, a 10%p higher share aged 60+ gives OR ×1.058 [1.021, 1.096]. Significant, but it explains only part of the overall skew.
- These are area-level correlations, so they cannot be carried over to individual-level conclusions (how older individuals mark ballots) — the ecological fallacy.

## 7. 20th data (pe20res) corrections

| Unit | Issue | Action |
|---|---|---|
| Osan, Gyeonggi | the classified column held the published final tally | restored as classified = final − recheck. The recheck column also disagreed with U_all by 950 votes, so reliability is low even after restoration |
| Jecheon, Chungbuk | Y1 + L1 = total votes; both classified and recheck disagree with published values | excluded |

- Other units with large gaps from published values are Yeongdeok-gun, Pohang Nam-gu, Gwangsan-gu, Dobong-gu, Yeongam-gun, Asan-si, Taean-gun, Cheongju Heungdeok-gu, and Chungju-si.
- After correction, the 20th residual kurtosis drops from 2.33 to 0.38, matching the 21st shape. The slope (1.107) barely changes.
- The low OR for Gunpo-si in the 21st is not a transcription error. A single out-of-district-early row accounts for 55% of Gunpo's recheck ballots — a Simpson's-paradox effect; stratified, the OR is 1.25.

## 8. With the winner (Lee Jae-myung) as the numerator

Putting the winner in the numerator as in the 18th–20th gives R1 = Lee Jae-myung / (Lee Jae-myung + Kim Moon-soo), with R2 the same ratio for recheck-target ballots.

![Winner-numerator fit plot and K comparison](/analysis/k21_winner_numerator_fitplot.png)

| 21st, Lee numerator | R1 | R2 | K | OR |
|---|---|---|---|---|
| All | 0.544 | 0.492 | 0.905 | 0.813 |
| In-district early | 0.715 | 0.647 | 0.906 | 0.733 |
| Election day | 0.420 | 0.361 | 0.861 | 0.783 |
| Out-of-district early | 0.686 | 0.658 | 0.959 | 0.880 |

- K < 1 in 232 of 252 districts. K ranges 0.60–1.06 with a mean of 0.864.
- The lowest province K values are Gyeongbuk 0.70, Daegu 0.74 and Gyeongnam 0.76; Seoul is 0.95 and Honam is about 1.0.
- Regression R_2 = −0.121 + 1.117·R_1 (R² 0.9824). Because this is a two-candidate ratio, R_Lee = 1 − R_Kim, so the slope, R² and residuals are identical to the Kim numerator; only the intercept differs.
- K's magnitude becomes asymmetric with the numerator candidate's base vote share. Where Lee's R1 is 0.25, a drop in the recheck share to 0.15 makes K = 0.6; the same change seen from Kim's side is 0.75 → 0.85, so K = 1.13. OR becomes exactly the reciprocal when you switch the numerator (1.230 ↔ 0.813), so OR is better for comparing regions and elections.
- For the 18th, the winner (Park Geun-hye) is also the conservative candidate, so the two definitions are the same calculation. When comparing with the 18th/19th results, check whether R1/R2 are classified/recheck ballots or out-of-district-early/in-district vote shares. The existing dashboard's K ≈ 0.6 (Kim 0.616) is out-of-district-early ÷ in-district vote share.

## 9. Interpretation and limits

- Recheck-target ballots have a systematically higher conservative share than classified ballots in the 20th and 21st, across every province and ballot type (OR about 1.1–1.6).
- This pattern fits structural causes such as how voters mark ballots, the ballot/print format, and the sorter's reading criteria. The dilution effect with the recheck rate ties the skew to the sorter's threshold.
- This data alone cannot separate the cause (age, paper format, candidate-number position, etc.), and it cannot be read as evidence of deliberate adjustment during the recheck process.
- The recheck rate fell from about 5.0% in 2022 to about 2.35% in 2025, less than half. The two elections may have used different classification criteria, so compare levels with care.

## Appendix: files

- `summaries/k21_classified_recheck.json`: national/province/district metrics, regression, invalid ballots and age, correction log
- `corrected_data/k21_precinct_classified_recheck.csv`: transcription of 18,847 precinct rows
- `corrected_data/pe20res_corrected.csv`: corrected 20th data (Osan restored, Jecheon excluded as recommended, checks flagged)
- `analysis/k21_classified_recheck/`: analysis scripts (Python, SAS)
- `public/analysis/*.png`: 11 figures
