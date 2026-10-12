# Classified vs unclassified (recheck) ballots — comparison report, 18th–21st presidential elections

Prepared 2026-09-28 · data `summaries/k18_21_comparison.json`

## 1. Comparison method

All four elections use the **conservative candidate** as the numerator (18th Park Geun-hye, 19th Hong Joon-pyo, 20th Yoon Suk-yeol, 21st Kim Moon-soo).

| Metric | Definition |
|---|---|
| R1 | conservative / (conservative + democratic), classified ballots |
| R2 | conservative / (conservative + democratic), unclassified (recheck) ballots |
| K | (P2/M2) ÷ (P1/M1). P = conservative, M = democratic, 1 = classified, 2 = unclassified. The definition in Excel data18 column T, etc. |
| Ratio of shares | R2 / R1. Same scale as R_2 = a + b·R_1 in the fit |

Using the winner as the numerator makes K < 1 only in the 19th and 21st — the elections won by the democratic candidate — flipping the direction. Using the conservative candidate throughout, K > 1 in all four. The unit of analysis is the district (gu/si/gun); Sejong is placed under Chungnam as "Sejong City".

### K: definitions and aggregation

K and OR are the same formula. The value changes because of the **aggregation method**.
- **District mean:** compute K once in each of 249 districts, then average. This is the Excel-sheet and SAS method.
- **National pooled:** first sum P1·M1·P2·M2 nationwide, then compute K once.

| Election | Sheet | K district mean | K median | K pooled | Ratio of shares (mean) | Ratio of shares (pooled) |
|---|---|---|---|---|---|---|
| 18th | data18 (249) | **1.479** | 1.467 | 1.381 | 1.166 | 1.154 |
| 19th | data19 (249) | **1.600** | 1.619 | 1.606 | 1.278 | 1.315 |
| 20th | data20 (248, Jecheon excluded) | **1.281** | 1.278 | 1.198 | 1.091 | 1.090 |
| 21st | data21 (248) | **1.315** | 1.335 | 1.230 | 1.115 | 1.113 |

For the 20th, Jecheon was excluded from all calculations because the two candidates' classified sum equals total votes (87,091) and does not match the official result. Including Jecheon, the 20th district-mean K is 1.285.

The 18th's district mean (1.479) exceeds its pooled value (1.381) for two reasons.
- **Weighting:** the mean counts all 249 districts equally. Weighting by recheck-ballot count gives 1.445.
- **Pooling effect:** merging regions with different R1 into one lowers the OR. The 18th's K correlates with R1 at 0.43.


## 2. Results by election

![18th–21st overlaid fit plot and OR by province](/analysis/k18_k21_overlay.png)

| Election | Conservative candidate | Winner | n | Fit R_2 = a + b·R_1 | R² | K district mean | K pooled [95%] | Ratio of shares (pooled) |
|---|---|---|---|---|---|---|---|---|
| 18th (2012) | Park Geun-hye | Park Geun-hye | 249 | 0.042 + 1.062·R1 | 0.982 | 1.479 | 1.38 [1.33, 1.44] | 1.154 |
| 19th (2017) | Hong Joon-pyo | Moon Jae-in | 249 | 0.053 + 1.112·R1 | 0.970 | 1.600 | 1.61 [1.56, 1.65] | 1.315 |
| 20th (2022, corrected) | Yoon Suk-yeol | Yoon Suk-yeol | 248 | −0.002 + 1.107·R1 | 0.985 | 1.281 | 1.20 [1.14, 1.25] | 1.090 |
| 21st (2025) | Kim Moon-soo | Lee Jae-myung | 252 | 0.004 + 1.117·R1 | 0.982 | 1.315 | 1.23 [1.19, 1.27] | 1.113 |

Difference tests against the 20th (HC3):

| Election | Slope diff | Level diff at R1 = 0.5 |
|---|---|---|
| 18th | −0.045 (p < 0.001) | +0.022 (p < 0.001) |
| 19th | +0.005 (p = 0.79) | +0.057 (p < 0.001) |
| 21st | +0.010 (p = 0.40) | +0.011 (p < 0.001) |

- The 19th, 20th and 21st share the same slope (~1.11) and differ only in level.
- The 18th has a lower slope (1.06) but a larger intercept, so its whole line sits above the 20th/21st.
- Province-level log OR correlations are 0.93 (19th–20th) and 0.88 (20th–21st), but the 18th is lower at 0.52–0.73 with the other elections.
- In the 18th the Honam region also has high OR (Jeonnam 1.36, Jeonbuk 1.34, Gwangju 1.40); in the 20th/21st Honam is about 1.0. The 18th had a larger region-independent component leaning conservative.

## 3. Characteristics by election

![18th fit diagnostics](/analysis/k18_fit_diagnostics.png)

- **Curvature:** the quadratic term is −0.369 (t −13.0) for the 18th, −0.619 (t −19.4) for the 19th, −0.265 for the 20th and −0.247 for the 21st. It is curvature from proportions bounded in 0–1, and it is strongest in the 19th.
- **Recurring outliers:** districts with high R1 or in the Gangnam area — Gangnam-gu (18th K 0.99, 21st 0.97), Gunwi-gun, Seongju-gun — sit below the fit line in all four elections.
- **18th K near 1.5:** these are Honam values (Suncheon 1.497, Jeonju Wansan 1.476, Yeosu 1.446). Park Geun-hye's classified share there is low (0.07–0.12), so the same skew yields a large K. The 18th K is 1.479 (district mean), 1.381 (pooled).

## 4. Data checks

**18th (pe18res2.csv)**
- The district names in the CSV were stored as "?", so they were restored from the matching-index 19th-election names. Index, region code and character count all match across 249 rows.
- The P1·M1·P2·M2 in the data18 tab match pe18res2 across all 249 rows, and the column-T K mean of 1.479 is identical.
- Checked against Newstapa's published 18th-election classifier results (NEC, 251 districts). That data splits total votes into hand count + classifier count, and total votes match the published final tally across all 249 districts.
  - 158 districts: identical to data18.
  - 31 districts: per-candidate totals identical, with a few votes (up to 54) shifted between classified and unclassified. 9 districts show other minor differences (up to 56 votes).
  - 51 districts: data18 added hand-counted votes (absentee, etc.) to classified/unclassified (median inclusion share 92%).
- The entire shortfall below the published figure is hand count. The 9 districts previously read as "missing precincts" (Yeoncheon, Geochang, Gyeongsan, Yeonje, Incheon Dong-gu, Ongjin, Wando, Muju, Imsil) are simply places with a large hand-count share (Yeoncheon 60%, Muju 46%, Ongjin 39%).
- K is nearly identical. District means are 1.479 (data18) and 1.481 (Newstapa, 251 rows); pooled values are 1.381 and 1.394. The fits are 0.042 + 1.062·R1 and 0.041 + 1.064·R1.
- Even excluding the 8 districts that fall short by 10%+, the fit is 0.044 + 1.061·R1, R² 0.982 — unchanged.
- Bucheon's vote_all of 500,000 and age ratios 0.64/0.20/0.15 are placeholder values. The vote counts are in the normal range.
- Matches the SAS result (n 249, R² 0.9823).

**19th (pe19res)**
- Five names were corrected: blank name = Bucheon, Yeoju-gun → Yeoju-si, Jin-gu → Busanjin-gu, Cheongwon-gun → Cheongju Cheongwon-gu, Cheongju Heungdeok-gu row = Heungdeok + Seowon.
- 236 districts differ from the published figure by less than 2%, and 13 fall short by 2%+. Excluding the 13 does not change the result.
- For Bonghwa-gun, the NEC district subtotal row omitted part of the counting units (2,159 classifier-passed votes), so it was replaced with the counting-unit total (22,808). This matches the published turnout of 22,947, and K changes from 1.5327 to 1.5345.
- The SAS n of 254 mixes in 5 summary-statistic rows (mean/sd/median/min/max) that sat below data19 as observations. The correct n is 249 and R² is 0.9698.

**19th cross-check with NEC classifier statistics**
- Compared data19 with the NEC data (250 districts, 6 candidates). The 9 columns — Moon/Hong/Ahn classified and unclassified votes, invalid-within-unclassified, and totals — match across all 249 districts (Heungdeok = Heungdeok + Seowon).
- The 13 districts that fall short of the published figure are places with many ballots that did not pass the classifier (Ongjin 29%, Sunchang 17%, Jangsu 15%, etc.).
- K by candidate (vs Moon Jae-in, pooled) is Hong Joon-pyo 1.61, Ahn Cheol-soo 1.23, Yoo Seung-min 0.92, Sim Sang-jung 0.74, and other candidates 2.56.
  - Even among conservative candidates, Yoo Seung-min has K < 1.
  - The skew fits voters' marking habits better than ideology. The data is aggregated by district, so individual behavior cannot be observed.
- All 130,598 invalid ballots fall into the unclassified pile (9.6% of unclassified).

**20th (pe20res: NEC FOI tally sheets entered into Excel)**
- Compared 249 districts against the official final tally (province sheets in 20thKelection.xlsx). Classified + unclassified match exactly in 130 districts and within 0.5% in 100.
- For Osan, the classified column held the final tally, so classified was restored as final − unclassified.
- For Jecheon, the two candidates' classified sum (87,091) equals total votes and cannot be recovered, so it was excluded from all calculations. The 20th district-mean K changes from 1.285 to 1.281.
- The other 18 districts differ by more than 0.5%, apparently from manual-entry error (Pohang Nam-gu up to 50%, Yeongam, Gwangsan-gu, Ulju-gun, Dobong-gu, Asan, etc.). Excluding these 18, the K mean is 1.279 and the fit is unchanged at −0.002 + 1.106·R1.
- In the 20elec_old sheet of 20thKelection.xlsx, the unclassified columns (L2·Y2·S2·U2) match the 19th data19 unclassified values in 247 of 250 districts. The 19th values appear to have been copied, and they were not used in this analysis.

## 5. K normality (18th–21st)

![18th/19th K distribution and normal QQ](/analysis/k18_k19_normality.png)

![20th/21st K distribution and normal QQ](/analysis/k20_k21_normality.png)

| K | n | Mean | Median | Skew | Kurtosis | Shapiro-Wilk p | Anderson-Darling (5% crit. 0.75) | Verdict |
|---|---|---|---|---|---|---|---|---|
| 18th Park/Moon | 251 | 1.481 | 1.467 | 0.42 | 0.45 | 0.019 | 0.92 | Reject |
| 18th log K | 251 | 0.383 | 0.383 | −0.04 | 0.24 | 0.66 | 0.41 | **Normal** |
| 19th Hong/Moon | 250 | 1.600 | 1.620 | −0.27 | 0.66 | 0.020 | 1.07 | Reject |
| 19th log K | 250 | 0.459 | 0.482 | −0.87 | 1.39 | < 0.001 | 3.16 | Reject |
| 20th Yoon/Lee | 248 | 1.281 | 1.278 | 0.65 | 2.89 | < 0.001 | 0.86 | Reject |
| 20th log K | 248 | 0.234 | 0.246 | −0.09 | 0.32 | 0.001 | 1.48 | Reject |
| 21st Kim/Lee | 252 | 1.315 | 1.335 | −0.12 | −0.45 | 0.053 | 1.19 | Borderline |
| 21st log K | 252 | 0.260 | 0.289 | −0.50 | −0.20 | < 0.001 | 2.40 | Reject |

| | 18th | 19th | 20th | 21st |
|---|---|---|---|---|
| Std. value SD (exp. 1) | 3.72 | 2.81 | 4.93 | 3.51 |
| I² | 93% | 87% | 96% | 92% |
| log K–R1 corr. | 0.43 | 0.44 | 0.71 | 0.68 |
| Districts K < 1 | 2 | 2 | 25 | 20 |

- The 18th's K fits a log-normal distribution. The 19th and 20th are rejected; the 21st is borderline (Shapiro-Wilk and D'Agostino accept it, only Anderson-Darling rejects).
- The 20th has outliers at both tails (Yeongdeok 2.48, Ulleung 1.92, Osan 1.79 / Jangheung 0.80).
- In all four elections, 87–96% of the spread in K is real regional variation. In the 20th/21st, K moves more strongly with R1.

**Why test normality**
1. Choosing a test: t-tests, confidence intervals and regression p-values assume roughly normal data. With a K mean of 1.28–1.60 and very few districts below 1, a small departure from normality does not change the "K > 1" conclusion.
2. Finding outliers: you need the distribution's shape to judge whether a value like Yeongdeok's 2.48 is chance.
3. One cause or many: if a single cause acted on every region by the same amount, K would scatter only by sampling error. The actual spread is 3–5x sampling error and moves with R1.
4. Normality is not evidence of fraud, and non-normality is not evidence of legitimacy. What separates causes is the relationship between K and other variables.

## 6. K by candidate (18th/19th/21st)

K = (unclassified candidate / democratic candidate) ÷ (classified candidate / democratic candidate). There is no per-candidate data for the 20th.

![Two facts that explain K](/analysis/k_age_mechanism.png)

- **B. Older regions have higher unclassified rates.** Per 10%p of residents aged 60+, the unclassified rate rises +1.28%p (18th), +1.08%p (19th), +1.78%p (20th), +0.63%p (21st) (correlation 0.63–0.80).
- **A. The more a candidate's support concentrates in older regions, the larger that candidate's K.** Across 11 candidates, the correlation between "vote share–share aged 60+" and log K is 0.92, and 0.91 even without the minor candidates.
- When the two facts overlap, K > 1 appears. Even conservative candidates with strong younger-voter support — Yoo Seung-min (0.92), Lee Jun-seok (0.97) — have K ≤ 1, while minor candidates strong in older regions have K 2.6–4.7.

| Election | Candidate | Camp | Classified | Unclassified | K pooled | K > 1 districts |
|---|---|---|---|---|---|---|
| 18th | Park Geun-hye | Conservative | 51.5% | 59.0% | 1.394 | 249 / 251 |
| 18th | Other (4) | Minor | 0.37% | 1.42% | 4.72 | 251 / 251 |
| 19th | Hong Joon-pyo | Conservative | 23.8% | 32.4% | 1.606 | 248 / 250 |
| 19th | Ahn Cheol-soo | Centrist | 21.4% | 22.3% | 1.232 | 236 / 250 |
| 19th | Yoo Seung-min | Conservative | 6.8% | 5.3% | 0.916 | 73 / 250 |
| 19th | Sim Sang-jung | Progressive | 6.3% | 3.9% | 0.736 | 5 / 250 |
| 19th | Other | Minor | 0.49% | 1.07% | 2.56 | 250 / 250 |
| 21st | Kim Moon-soo | Conservative | 41.4% | 46.5% | 1.230 | 232 / 252 |
| 21st | Lee Jun-seok | Conservative | 8.3% | 7.3% | 0.971 | 136 / 252 |
| 21st | Kwon Young-guk | Progressive | 0.98% | 0.83% | 0.926 | 115 / 252 |
| 21st | Song Jin-ho | Minor | 0.10% | 0.29% | 3.34 | 233 / 252 |

- Conservative candidates with strong older-voter support have K > 1, while conservative candidates with strong younger-voter support (Yoo Seung-min, Lee Jun-seok) have K ≤ 1.
- Minor candidates have the largest K in all three elections, and it grows where the share aged 60+ is higher (per 10%p, log K +0.14 to +0.22, t 6–9).
- The main candidates' K does not grow in older regions. In the 19th, Hong Joon-pyo's actually shrinks (per 10%p, −0.07, t −6.7). This may be because the age gap between the two camps is smaller in older regions, but district data cannot resolve it.
- The skew is explained by voters' marking habits and the classifier's reading behavior rather than by "dumping votes to the conservative candidate".

## 7. Interpretation and limits

- Using the conservative candidate as the numerator, **unclassified (recheck) ballots lean toward the conservative candidate in all four elections.** Because the 18th and 20th (won by the conservative) and the 19th and 21st (lost by the conservative) point the same way, this skew is independent of who won.
- The magnitude differs by election (OR 1.38 for the 18th, 1.61 for the 19th, 1.20 for the 20th, 1.23 for the 21st). The 18th also differs in slope and regional distribution. Multi-candidate fields, classifier model and reading criteria, and differences in recheck rate may all contribute, but this data alone cannot separate them.
- As the 21st analysis showed, a higher recheck rate dilutes the skew. So comparisons of magnitude across elections must also account for differences in recheck rate.
