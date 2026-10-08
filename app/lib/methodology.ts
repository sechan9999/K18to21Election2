import lastRun from '../../summaries/_run.json';

// Methodology, provenance, and pipeline metadata for the Electoral Insights Hub.
// This file is the single source of truth for "how metrics are computed" and
// "where the data came from" — referenced by the Methodology panel and by
// per-metric provenance badges shown in the UI.

export interface MetricDefinition {
  id: string;
  label: string;
  formula: string;
  description: string;
  units: string;
  caveats?: string[];
  /** Korean text shown when the UI language is Korean; fields fall back to English when absent. */
  ko?: Partial<Pick<MetricDefinition, 'label' | 'formula' | 'description' | 'units' | 'caveats'>>;
}

export interface DataSource {
  id: string;
  name: string;
  file: string;
  version: string;
  lastModified: string; // ISO date
  origin: string; // upstream authority, e.g. NEC (중앙선거관리위원회)
  rowCount?: number;
  notes?: string;
}

export interface PipelineRun {
  runId: string;
  startedAt: string; // ISO timestamp
  completedAt: string; // ISO timestamp
  gitSha?: string;
  builders: string[]; // scripts invoked
  rowsIn: number;
  rowsOut: number;
  dedupDroppedRows: number;
}

export const METRICS: MetricDefinition[] = [
  {
    id: 'margin',
    label: 'Margin (표차)',
    formula: 'margin_votes = winner.votes − runnerUp.votes;   margin_pct_points = winner.share − runnerUp.share',
    description:
      'Displayed in two complementary units: absolute votes (aggregate vote difference between first and second place) and percentage points (difference of vote shares as a fraction of total valid votes). Percentage-point margin is NOT a ratio of shares; it is the arithmetic difference of two percentages.',
    units: 'votes · percentage points',
    caveats: [
      'Excludes invalid/blank ballots — these are counted in Voters but not in Total Votes.',
      'Province-level margin uses province-level vote shares, not a reweighted national margin.',
    ],
  },
  {
    id: 'turnout',
    label: 'Turnout (투표율)',
    formula: 'turnout_rate = Turnout / Voters',
    description:
      'Numerator = Turnout (total ballots cast, including invalid). Denominator = Voters (eligible registered voters on the final electoral roll published by NEC). We do not use Total Votes in the denominator because that would exclude invalid ballots and inflate the rate.',
    units: 'percent of eligible voters',
    caveats: [
      'Overseas absentee ballots are included in Turnout when published by NEC.',
      'Military/hospital/correctional facility ballots are allocated to the registered residence district, not the polling location.',
    ],
  },
  {
    id: 'kvalue',
    label: 'K_P — Method 1: conservative candidate in the numerator (odds ratio of machine rejection)',
    formula:
      'K_P = (P2 / M2) / (P1 / M1)   where P = main conservative candidate, M = Democratic candidate; 1 = classified (machine-sorted) ballots, 2 = unclassified (hand-confirmed) ballots',
    description:
      'Ratio of the conservative-to-Democratic vote ratio among unclassified ballots (the ballots the sorting machine rejected and counting staff confirmed by hand) to the same ratio among classified ballots, computed within a counting unit (district) or from national sums (pooled K_P). This is Method 1, used for most of this dashboard so that elections can be compared in one direction; Method 2 below puts the election winner in the numerator. K_P is an odds ratio of machine rejection: with u_c = P2/(P1 + P2) the share of a candidate’s ballots that the machine rejects, K_P = [u_c/(1 − u_c)] / [u_d/(1 − u_d)] ≈ u_c/u_d. If rejection is unrelated to vote choice, K_P ≈ 1; K_P > 1 means only that the conservative candidate’s ballots are rejected more often.',
    units: 'ratio (unitless)',
    caveats: [
      'The numerator is always the main conservative candidate (Park 2012, Hong 2017, Yoon 2022, Kim 2025). The 2012 study put the winner in the numerator, which gives the reciprocal in 2017 and 2025; that second form is shown as Method 2 (Compare tab), and the two describe the same data and the same odds ratio.',
      'Pooled K (ratio of national sums), the district mean, and the district median differ when K varies across districts; always state which one is shown. The share ratio R2/R1 with R1 = P1/(P1 + M1) and R2 = P2/(P2 + M2) is a different quantity that is always closer to 1 than K.',
      'The sampling variance of log K is approximately 1/P1 + 1/M1 + 1/P2 + 1/M2, so districts with few unclassified ballots are noisy.',
      'K > 1 is not evidence of manipulation by itself. Older voters’ ballots are rejected more often, and a voter-age model calibrated per election reproduces K for the major candidates from the age composition of their electorates (Chun et al.). Treat K as a screening statistic.',
    ],
    ko: {
      label: 'K_P — 방법 1: 보수 후보를 분자로 (기계 거부의 오즈비)',
      formula:
        'K_P = (P2 / M2) / (P1 / M1)   (P = 주요 보수 후보, M = 민주당 후보; 1 = 분류표(기계 분류), 2 = 미분류표(수작업 확인))',
      description:
        'K는 같은 개표 단위(구·시·군) 안에서, 미분류표(분류기가 거부해 개표 요원이 수작업으로 확인한 투표지)의 보수 후보 대 민주당 후보 득표비를 분류표의 같은 득표비로 나눈 값이다. 전국 합계로 한 번 계산하면 통합 K_P이다. 이것이 방법 1이며, 선거를 한 방향으로 비교하려고 이 화면 대부분에서 쓴다. 당선자를 분자로 둔 방법 2는 아래에 있다. K_P는 기계 거부의 오즈비이다. u_c = P2/(P1 + P2)를 후보 c의 투표지 중 기계가 거부한 비율이라 하면 K_P = [u_c/(1 − u_c)] / [u_d/(1 − u_d)] ≈ u_c/u_d이다. 기계의 거부가 투표 선택과 무관하면 K_P ≈ 1이고, K_P > 1은 보수 후보의 투표지가 더 자주 거부된다는 뜻일 뿐이다.',
      units: '비율(단위 없음)',
      caveats: [
        '분자는 항상 주요 보수 후보이다(2012년 박근혜, 2017년 홍준표, 2022년 윤석열, 2025년 김문수). 2012년 연구는 당선자를 분자에 두었으며 이 경우 2017년과 2025년에는 역수가 된다. 이 두 번째 형태가 방법 2(비교 탭)이며, 두 방법은 같은 자료와 같은 오즈비를 서로 다른 방향으로 표현한다.',
        'K가 선거구마다 다르면 통합 K(전국 합계의 비), 선거구 평균, 선거구 중앙값이 서로 달라진다. 어느 값인지 항상 밝혀야 한다. 점유율 비 R2/R1(R1 = P1/(P1 + M1), R2 = P2/(P2 + M2))은 다른 양이며 항상 K보다 1에 가깝다.',
        'log K의 표집분산은 대략 1/P1 + 1/M1 + 1/P2 + 1/M2이므로 미분류표가 적은 선거구는 잡음이 크다.',
        'K > 1만으로는 조작의 증거가 아니다. 고령 유권자의 투표지가 더 자주 거부되며, 선거별로 보정한 유권자 연령 모형이 지지층의 연령 구성만으로 주요 후보의 K를 재현한다(Chun et al.). K는 선별용 통계량으로 다뤄야 한다.',
      ],
    },
  },
  {
    id: 'kvalue_winner',
    label: 'K — Method 2: election winner in the numerator (as in the 2012 study)',
    formula:
      'K = (W2 / L2) / (W1 / L1)   where W = election winner, L = runner-up; 1 = classified, 2 = unclassified.   K = K_P if the conservative candidate won (18th, 20th), K = 1 / K_P if the Democratic candidate won (19th, 21st)',
    description:
      'Same data and same odds ratio as Method 1, with the winner first: K > 1 means the winner’s ballots were rejected more often than the runner-up’s. It answers whether the winner gained from the unclassified stream; a scheme favoring winners would produce K > 1 in every election. Shown on the Compare tab (Method 2) together with an accounting of the winner’s margin among classified and unclassified ballots and under a K = 1 benchmark.',
    units: 'ratio (unitless)',
    caveats: [
      'Pooled K, district mean, and median are all reported; K for the Democratic wins is the reciprocal of Method 1’s pooled value, and its interval is the inverted interval.',
      'In all four elections the winner led among machine-classified ballots, and would still have won under K = 1. The 2022 margin is sensitive: most of it is attributable to K > 1, and 2022 has no candidate-level data to calibrate the age model.',
      'K < 1 for a Democratic winner is inconsistent with a winner-favoring scheme but is also what voter age composition alone predicts; it does not prove that the count was untouched, and K is not a test of the count.',
      'The accounting uses the two leading candidates’ votes; K = 1 is a benchmark, not the expected value when electorates differ in age.',
    ],
    ko: {
      label: 'K — 방법 2: 당선자를 분자로 (2012년 연구와 같음)',
      formula:
        'K = (W2 / L2) / (W1 / L1)   (W = 당선자, L = 2위; 1 = 분류표, 2 = 미분류표).   보수 후보가 당선한 18·20대는 K = K_P, 민주당 후보가 당선한 19·21대는 K = 1 / K_P',
      description:
        '방법 1과 같은 자료, 같은 오즈비이며 당선자를 먼저 둔다. K > 1은 당선자의 투표지가 2위보다 더 자주 거부되었다는 뜻이다. 당선자가 미분류 흐름에서 이득을 보았는지를 묻는 값이며, 당선자 우대 방식이라면 모든 선거에서 K > 1이어야 한다. 비교 탭(방법 2)에 당선자의 분류표·미분류표 마진과 K = 1 기준 마진 회계와 함께 표시된다.',
      units: '비율(단위 없음)',
      caveats: [
        '통합 K, 선거구 평균, 중앙값을 모두 보고한다. 민주당 당선 선거의 K는 방법 1 통합값의 역수이고 구간도 뒤집은 것이다.',
        '네 선거 모두 당선자가 분류표에서 앞섰고 K = 1이어도 당선자는 같다. 2022년 마진은 민감하다. 마진 대부분이 K > 1에 기인하며, 2022년은 연령 모형을 보정할 후보 수준 자료가 없다.',
        '민주당 당선자의 K < 1은 당선자 우대 방식과 맞지 않지만 유권자 연령 구성만으로도 예측되는 방향이다. 개표가 손대지 않았다는 증명이 아니며 K는 개표의 검정이 아니다.',
        '회계는 두 후보 득표 기준이다. K = 1은 기준값이며 유권자 연령이 다를 때의 기대값이 아니다.',
      ],
    },
  },
  {
    id: 'absentee_ratio',
    label: 'Absentee-to-in-precinct share ratio (관외사전/관내 득표율 비, R2/R1) — not the paper’s K',
    formula: 'ratio = 관외사전 득표율 ÷ 관내 득표율   (same candidate, same district)',
    description:
      'Ratio of a candidate’s absentee-sort vote share to their in-precinct vote share within the same district. It is shown on the 21st-election absentee-ratio tab and drives the OLS-based anomaly flags. This is NOT the K statistic defined above: it compares two voting methods, not machine-classified with hand-confirmed ballots. The classified/unclassified K appears on the Classified and Compare tabs.',
    units: 'ratio (unitless)',
    caveats: [
      'Small absentee pools produce naturally high variance. We report 95% prediction intervals from an OLS fit of the absentee share on the in-precinct share across districts.',
      'A screening heuristic, not a test statistic. Use anomaly flags in conjunction with residual magnitude and sample size.',
    ],
    ko: {
      label: '관외사전/관내 득표율 비 (R2/R1) — 논문의 K와 다름',
      description:
        '같은 선거구에서 후보의 관외사전 득표율을 관내 득표율로 나눈 값이다. 21대 관외/관내 비 탭에 표시되며 OLS 기반 이상 플래그에 쓰인다. 위에서 정의한 K 통계량이 아니다. 이 값은 두 투표 방식을 비교하는 것이며, 기계가 분류한 투표지와 수작업으로 확인한 투표지를 비교하는 것이 아니다. 분류/미분류 K는 분류·비교 탭에 표시된다.',
      units: '비율(단위 없음)',
      caveats: [
        '관외사전 표본이 작으면 변동이 자연히 크다. 선거구 전체에서 관외사전 득표율을 관내 득표율에 OLS로 적합한 95% 예측구간을 보고한다.',
        '선별용 휴리스틱이지 검정 통계량이 아니다. 이상 플래그는 잔차 크기와 표본 크기와 함께 해석해야 한다.',
      ],
    },
  },
  {
    id: 'swing',
    label: 'Swing (스윙)',
    formula: 'swing_r,c = share_r,c,t − share_r,c,t-1',
    description:
      'Change in vote share for party block c in region r between consecutive election cycles. We compute swing on the Conservative/Democratic two-block aggregation because minor-party coalitions shift between cycles; the aggregation keeps the time series comparable.',
    units: 'percentage points',
    caveats: [
      '18th → 19th swing spans a change in the number of major parties on the ballot — treat with care.',
      'Swings are NOT normalized by turnout; use Turnout Decomposition for that view.',
    ],
  },
  {
    id: 'dedup',
    label: 'Data cleaning / deduplication',
    formula: 'drop rows where (district_id, polling_station_id, candidate) already seen; keep latest revision_seq',
    description:
      'The NEC publishes multiple revisions of precinct totals as recounts and corrections arrive. We keep only the highest revision_seq per (district, station, candidate) tuple. Revision history is preserved in the audit log but excluded from aggregates.',
    units: 'rows',
  },
  {
    id: 'recount',
    label: 'Recount / revision handling',
    formula: 'on revision: replace prior row; recompute district aggregates; bump pipeline run_id',
    description:
      'When NEC publishes a correction, we re-ingest the full precinct file for that district and replace affected rows atomically. Dashboard KPIs always reflect the latest revision. The Methodology panel shows the last refresh timestamp and the pipeline run ID so users can cite a specific snapshot.',
    units: 'rows / events',
  },
];

export const DATA_SOURCES: DataSource[] = [
  {
    id: 'nec_18th',
    name: '18대 대통령선거 개표자료',
    file: 'K21.xlsx (sheet: 18th)',
    version: '2012-12-19 final',
    lastModified: '2026-04-14',
    origin: '중앙선거관리위원회 (NEC)',
    notes: 'Precinct-level totals, post-certification.',
  },
  {
    id: 'nec_19th',
    name: '19대 대통령선거 개표자료',
    file: 'K21.xlsx (sheet: 19th)',
    version: '2017-05-10 final',
    lastModified: '2026-04-14',
    origin: '중앙선거관리위원회 (NEC)',
  },
  {
    id: 'nec_20th',
    name: '20대 대통령선거 개표자료',
    file: 'K21.xlsx (sheet: 20th)',
    version: '2022-03-10 final',
    lastModified: '2026-04-14',
    origin: '중앙선거관리위원회 (NEC)',
  },
  {
    id: 'nec_21st',
    name: '21대 대통령선거 개표자료',
    file: 'K21.xlsx (sheet: 21st)',
    version: '2025 final + 재확인표 재집계본 v2',
    lastModified: '2026-04-22',
    origin: '중앙선거관리위원회 (NEC)',
    notes: 'Includes 관내/관외사전 split and 253-district recount cross-check.',
  },
  {
    id: 'recount_21st',
    name: '21대 관외사전/관내 득표율 비 (R2/R1) dataset',
    file: 'summaries/k21_recount.json',
    version: 'build 2026-04-15 (OLS fit, 95% PI)',
    lastModified: '2026-04-15',
    origin: 'Derived from nec_21st via build_recount_summary.py',
    rowCount: 253,
    notes: 'Prediction intervals are from an OLS regression of R2 on R1 across all 253 districts. The ratio here is 관외사전 share ÷ 관내 share (이재명), not the classified-vs-unclassified K defined in the Methodology panel.',
  },
  {
    id: 'classified_recheck_21st',
    name: '21대 분류/재확인 투표지 (개표상황표 판독)',
    file: 'summaries/k21_classified_recheck.json',
    version: 'build 2026-09-28 (17개 시도, 18,847행)',
    lastModified: '2026-09-28',
    origin: '개표상황표 PDF OCR + 수동 확인, 공개 최종득표와 검산',
    rowCount: 18847,
    notes: 'R1/R2 = 김문수/(이재명+김문수), 분류표/재확인대상. 투표구 CSV: corrected_data/k21_precinct_classified_recheck.csv',
  },
  {
    id: 'winner_k_18_21',
    name: '18–21대 당선자 분자 K와 마진 회계 (방법 2)',
    file: 'summaries/k18_21_winner_k.json',
    version: 'build 2026-10-08 (구·시·군 249/249/248/252)',
    lastModified: '2026-10-08',
    origin: 'corrected_data (pe18res, pe19res, pe20res 보정본, 21대 개표상황표 판독)에서 build_winner_k.py로 계산',
    rowCount: 998,
    notes: 'K = 당선자 분자. 보수 분자 K_P와 같은 자료·같은 오즈비이며 방향만 다르다. 회계는 두 후보 득표 기준.',
  },
  {
    id: 'classified_18_21',
    name: '18–21대 분류/미분류 비교 (보수 후보 분자)',
    file: 'summaries/k18_21_comparison.json',
    version: 'build 2026-09-28 (19대 pe19res 249곳, 20대 pe20res 보정 248곳, 21대 판독 252곳)',
    lastModified: '2026-09-28',
    origin: 'pe19res.xlsx, pe20res.xlsx (구·시·군 분류/미분류), 21대 개표상황표 판독. 18대는 SAS 결과 요약만',
    rowCount: 749,
    notes: '19대 이름 5곳 보정, 공개 최종득표 대조 235곳 2% 미만. 보정본: corrected_data/pe19res_corrected.csv',
  },
];

export const LAST_PIPELINE_RUN: PipelineRun & { dataHash: string; sourceDesc: string } = {
  runId: lastRun.runId,
  startedAt: lastRun.completedAt, // BigQuery runs table records completion time only
  completedAt: lastRun.completedAt,
  gitSha: 'repo@main',
  builders: ['bigquery:electoral_hub', 'scripts/sync-summaries.ts'],
  rowsIn: 262_441,
  rowsOut: 261_893,
  dedupDroppedRows: lastRun.dedupDroppedRows,
  dataHash: lastRun.dataHash,
  sourceDesc: lastRun.sourceDesc,
};

// Which data source(s) back each displayed metric. Used to render a tiny
// provenance badge next to KPIs and chart titles.
export const METRIC_PROVENANCE: Record<string, string[]> = {
  totalVotes: ['nec_18th', 'nec_19th', 'nec_20th', 'nec_21st'],
  turnout: ['nec_18th', 'nec_19th', 'nec_20th', 'nec_21st'],
  winner: ['nec_18th', 'nec_19th', 'nec_20th', 'nec_21st'],
  margin: ['nec_18th', 'nec_19th', 'nec_20th', 'nec_21st'],
  regionalShare: ['nec_18th', 'nec_19th', 'nec_20th', 'nec_21st'],
  kValue: ['recount_21st'],
  swing: ['nec_18th', 'nec_19th', 'nec_20th', 'nec_21st'],
};

export function sourceById(id: string): DataSource | undefined {
  return DATA_SOURCES.find((s) => s.id === id);
}
