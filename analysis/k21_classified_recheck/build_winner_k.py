"""Second method for the dashboard: K with the election winner in the numerator.

Method 1 (existing): conservative candidate in the numerator, K_P = (P2/M2)/(P1/M1).
Method 2 (this file): winner in the numerator, K = K_P if the conservative candidate won (18th, 20th), else 1/K_P (19th, 21st).

Reads corrected_data/ (same frames as Table 2 of the paper: 249 / 249 / 248 / 252 districts) and writes
summaries/k18_21_winner_k.json: per-election K (pooled with a district-clustered delta-method CI, district mean and median,
districts with K > 1) and an accounting of the winner's margin among classified and unclassified ballots, including the
margin if the unclassified ballots had split like the classified ones (K = 1) and the K at which the margin would be zero.

Usage (repository root): python analysis/k21_classified_recheck/build_winner_k.py
"""
import json
import math
from pathlib import Path

import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / "corrected_data"
OUT = ROOT / "summaries" / "k18_21_winner_k.json"


def frame(df, p1, m1, p2, m2):
    x = pd.DataFrame({"P1": df[p1], "M1": df[m1], "P2": df[p2], "M2": df[m2]}).astype(float)
    return x[(x > 0).all(axis=1)].reset_index(drop=True)


p18 = pd.read_csv(DATA / "pe18res_corrected.csv")
p19 = pd.read_csv(DATA / "pe19res_corrected.csv")
p20 = pd.read_csv(DATA / "pe20res_corrected.csv")
p20 = p20[p20["보정"].fillna("") != "제외 권고(복원 불가)"]
p21 = pd.read_csv(DATA / "k21_precinct_classified_recheck.csv")
p21 = p21[p21["판독방식"] != "제외"]
a21 = p21.groupby(["시도명", "구시군명"], as_index=False)[["분류_김문수", "분류_이재명", "재확인_김문수", "재확인_이재명"]].sum()

ELECTIONS = [
    dict(id="18대", year=2012, cons="박근혜", dem="문재인", cons_won=True, x=frame(p18, "P1", "M1", "P2", "M2")),
    dict(id="19대", year=2017, cons="홍준표", dem="문재인", cons_won=False, x=frame(p19, "H1", "M1", "H2", "M2")),
    dict(id="20대", year=2022, cons="윤석열", dem="이재명", cons_won=True, x=frame(p20, "Y1", "L1", "Y2", "L2")),
    dict(id="21대", year=2025, cons="김문수", dem="이재명", cons_won=False, x=frame(a21, "분류_김문수", "분류_이재명", "재확인_김문수", "재확인_이재명")),
]


def cluster_se_logk(x):
    """Delta method for the ratio of sums with districts as clusters (matches the paper's pooled K intervals)."""
    s = x.sum().to_numpy()
    g = np.array([-1 / s[0], 1 / s[1], 1 / s[2], -1 / s[3]])
    v = len(x) * np.cov(x.to_numpy().T)
    return math.sqrt(g @ v @ g)


# Method 1 intervals as already shown on the dashboard (summaries/k18_21_comparison.json); Method 2 inverts them when the Democrat won.
cmp_json = json.loads((ROOT / "summaries" / "k18_21_comparison.json").read_text(encoding="utf-8"))
NATIONAL = {el["id"]: el["national"] for el in cmp_json["elections"] if el.get("national")}

out = []
for e in ELECTIONS:
    x = e["x"]
    s = x.sum()
    kp = (x.P2 / x.M2) / (x.P1 / x.M1)
    pooled_p = (s.P2 / s.M2) / (s.P1 / s.M1)
    se = cluster_se_logk(x)
    sgn = 1 if e["cons_won"] else -1
    kw = kp ** sgn
    pooled_w = pooled_p ** sgn
    nat = NATIONAL[e["id"]]
    assert abs(nat["OR"] - pooled_p) < 5e-4, (e["id"], nat["OR"], pooled_p)       # same pooled K as Method 1
    ci = [nat["lo"], nat["hi"]] if e["cons_won"] else [1 / nat["hi"], 1 / nat["lo"]]
    # accounting on the two leading candidates (W = winner, L = runner-up)
    W1, L1, W2, L2 = (s.P1, s.M1, s.P2, s.M2) if e["cons_won"] else (s.M1, s.P1, s.M2, s.P2)
    T2 = W2 + L2
    N = W1 + L1 + T2
    m_class, m_unclass = W1 - L1, W2 - L2
    m_total = m_class + m_unclass
    w2_cf = T2 * W1 / (W1 + L1)
    m_cf = m_class + (2 * w2_cf - T2)
    s_tie = (L1 - W1 + T2) / (2 * T2)
    k_tie = (s_tie / (1 - s_tie)) / (W1 / L1) if 0 < s_tie < 1 else None
    out.append(dict(
        id=e["id"], year=e["year"],
        winner=e["cons"] if e["cons_won"] else e["dem"], runner_up=e["dem"] if e["cons_won"] else e["cons"],
        winner_is_conservative=e["cons_won"], n=int(len(x)),
        K_winner=dict(pooled=round(pooled_w, 4), lo=round(ci[0], 4), hi=round(ci[1], 4), mean=round(float(kw.mean()), 4),
                      median=round(float(kw.median()), 4), n_above1=int((kw > 1).sum())),
        K_conservative=dict(pooled=round(pooled_p, 4), mean=round(float(kp.mean()), 4), median=round(float(kp.median()), 4)),
        accounting=dict(two_candidate_votes=int(round(N)), unclassified_share_pct=round(100 * T2 / N, 2),
                        margin_classified=int(round(m_class)), margin_unclassified=int(round(m_unclass)), margin_total=int(round(m_total)),
                        margin_total_pct=round(100 * m_total / N, 2), margin_if_K1=int(round(m_cf)), margin_if_K1_pct=round(100 * m_cf / N, 2),
                        change_due_to_K=int(round(m_total - m_cf)), winner_leads_classified=bool(m_class > 0), winner_leads_if_K1=bool(m_cf > 0),
                        K_at_zero_margin=None if k_tie is None or k_tie < 0 else round(k_tie, 5)),
    ))
    print(e["id"], out[-1]["winner"], "n", len(x), "K pooled %.4f [%.4f, %.4f] mean %.4f median %.4f >1: %d" % (pooled_w, ci[0], ci[1], kw.mean(), kw.median(), (kw > 1).sum()),
          "| margins", int(m_class), int(m_unclass), int(m_total), int(m_cf))

meta = dict(
    title="두 번째 방법: 당선자를 분자로 둔 K / Second method: K with the winner in the numerator",
    built="2026-10-08",
    method1="K_P = (P2/M2)/(P1/M1), 보수 후보 분자 (기존 화면 전체) / conservative candidate in the numerator (rest of the dashboard)",
    method2="K = 당선자 분자: 18·20대는 K_P, 19·21대는 1/K_P / winner in the numerator: K_P in the 18th and 20th, 1/K_P in the 19th and 21st",
    frames="구·시·군 18대 249, 19대 249, 20대 248(제천 제외), 21대 252 / districts: 249, 249, 248 (Jecheon excluded), 252",
    accounting="두 후보 득표 기준. K = 1 기준: 미분류표 수를 고정하고 분류표와 같은 비율로 나눔. 회계 기준이지 조작에 대한 주장이 아님. / Two leading candidates; K = 1 benchmark splits the unclassified ballots like the classified ones; an accounting benchmark, not a claim about manipulation.",
)
OUT.write_text(json.dumps(dict(meta=meta, elections=out), ensure_ascii=False, indent=1), encoding="utf-8")
print("wrote", OUT)
