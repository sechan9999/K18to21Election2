'use client';

import React from 'react';
import { useLanguage } from './LanguageProvider';

// Method 2: K with the election winner in the numerator. Data: summaries/k18_21_winner_k.json
// (built by analysis/k21_classified_recheck/build_winner_k.py). Method 1 (conservative numerator) is the rest of the dashboard.

export type WinnerKData = {
  meta: { title: string; built: string; method1: string; method2: string; frames: string; accounting: string };
  elections: {
    id: string; year: number; winner: string; runner_up: string; winner_is_conservative: boolean; n: number;
    K_winner: { pooled: number; lo: number; hi: number; mean: number; median: number; n_above1: number };
    K_conservative: { pooled: number; mean: number; median: number };
    accounting: {
      two_candidate_votes: number; unclassified_share_pct: number; margin_classified: number; margin_unclassified: number;
      margin_total: number; margin_total_pct: number; margin_if_K1: number; margin_if_K1_pct: number; change_due_to_K: number;
      winner_leads_classified: boolean; winner_leads_if_K1: boolean; K_at_zero_margin: number | null;
    };
  }[];
};

const COLORS: Record<string, string> = { '18대': '#9b59b6', '19대': '#1baf7a', '20대': '#2a78d6', '21대': '#eb6834' };
const kTone = (k: number) => (k > 1 ? 'text-rose-300' : 'text-emerald-300');
const num = (v: number) => (v < 0 ? '−' : '') + Math.abs(Math.round(v)).toLocaleString('en-US');
const sgn = (v: number) => (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(Math.round(v)).toLocaleString('en-US');

const TXT = {
  ko: {
    title: '방법 2: 당선자를 분자로 둔 K',
    intro: '방법 1(이 화면의 나머지)은 보수 후보를 분자에 둔 K_P = (P2/M2)/(P1/M1)입니다. 방법 2는 2012년 연구와 같이 당선자를 분자에 둔 K입니다. 보수 후보가 당선한 18·20대에서는 K = K_P, 민주당 후보가 당선한 19·21대에서는 K = 1/K_P이며, 자료와 오즈비는 같고 방향만 다릅니다. 당선자 K > 1은 당선자의 투표지가 상대보다 더 자주 거부되었다는 뜻이고, 당선자에게 유리한 미분류 흐름이라면 모든 선거에서 K > 1이어야 합니다.',
    t1: '당선자 분자 K',
    cols: ['선거', '당선자 / 2위', 'K 전국 합산 [95% CI]', 'K 구·시·군 평균', 'K 중앙값', 'K > 1 구·시·군', '참고: K_P 전국 합산'],
    t2: '승패 회계: 미분류표가 당선자 마진을 얼마나 바꿨나',
    cols2: ['선거', '당선 진영', '미분류 비중', '마진, 분류표', '마진, 미분류표', '합계 마진', 'K = 1일 때 마진', 'K에 기인', '마진 0이 되는 K'],
    cons: '보수', dem: '민주',
    none: '없음',
    reading: '읽는 법',
    bullets: (e22: WinnerKData['elections'][number] | undefined) => [
      '네 선거 모두 당선자가 분류표에서 이미 앞섰고, 미분류표가 분류표와 같은 비율로 갈렸어도(K = 1) 당선자는 같습니다.',
      e22
        ? `2022년은 민감합니다. 합계 마진 ${num(e22.accounting.margin_total)}표(${e22.accounting.margin_total_pct.toFixed(2)}%) 중 ${num(e22.accounting.change_due_to_K)}표가 K > 1에 기인하고, K가 ${e22.accounting.K_at_zero_margin?.toFixed(2)} 아래로 내려가면 분류표 우위(${num(e22.accounting.margin_classified)}표)가 사라집니다. 2022년은 후보 수준 자료가 없어 연령 모형을 보정할 수 없으므로 네 선거 중 가장 덜 검증된 값입니다.`
        : '',
      '민주당 후보가 당선한 19·21대에서 당선자 K < 1은 당선자 우대 방식과 맞지 않습니다. 다만 유권자 연령 구성만으로도 이 방향이 나오므로(고령 유권자가 더 많은 보수 후보의 표가 더 자주 거부됨) 개입이 없었다는 증명은 아니며, K는 개표의 검정이 아닙니다.',
      '회계 값은 두 후보 득표 기준의 산술 비교입니다. K = 1은 유권자 연령이 다를 때의 기대값이 아니며 조작에 대한 주장이 아닙니다.',
    ],
  },
  en: {
    title: 'Method 2: K with the winner in the numerator',
    intro: 'Method 1 (the rest of this dashboard) puts the conservative candidate in the numerator, K_P = (P2/M2)/(P1/M1). Method 2 follows the 2012 study and puts the election winner in the numerator. K = K_P when the conservative candidate won (18th, 20th) and K = 1/K_P when the Democratic candidate won (19th, 21st): same data and same odds ratio, opposite direction. Winner K > 1 means the winner’s ballots are rejected more often than the runner-up’s; a scheme favoring winners in the unclassified stream would produce K > 1 in every election.',
    t1: 'K with the winner in the numerator',
    cols: ['Election', 'Winner / runner-up', 'K pooled [95% CI]', 'K district mean', 'K median', 'Districts K > 1', 'Ref.: K_P pooled'],
    t2: 'Who won: how much the unclassified ballots changed the winner’s margin',
    cols2: ['Election', 'Winner’s camp', 'Unclassified share', 'Margin, classified', 'Margin, unclassified', 'Total margin', 'Margin if K = 1', 'Due to K', 'K at zero margin'],
    cons: 'Conservative', dem: 'Democratic',
    none: 'none',
    reading: 'How to read this',
    bullets: (e22: WinnerKData['elections'][number] | undefined) => [
      'In all four elections the winner already led among machine-classified ballots, and the winner would be the same if the unclassified ballots had split like the classified ones (K = 1).',
      e22
        ? `2022 is the sensitive case. Of the total margin of ${num(e22.accounting.margin_total)} votes (${e22.accounting.margin_total_pct.toFixed(2)}%), ${num(e22.accounting.change_due_to_K)} votes are attributable to K > 1, and a K below ${e22.accounting.K_at_zero_margin?.toFixed(2)} would erase the lead among classified ballots (${num(e22.accounting.margin_classified)} votes). Candidate-level counts are unavailable for 2022, so the age model cannot be calibrated and its K is the least tested of the four.`
        : '',
      'In the Democratic wins (19th, 21st) the winner’s K < 1 is inconsistent with a winner-favoring scheme. Voter age composition alone also produces this direction (ballots of older voters, who lean conservative, are rejected more often), so it does not prove that nothing happened, and K is not a test of the count.',
      'The accounting is arithmetic on the two leading candidates’ votes. K = 1 is not the expected value when electorates differ in age, and nothing here is a claim of manipulation.',
    ],
  },
} as const;

export default function WinnerKPanel({ data }: { data: WinnerKData }) {
  const { locale } = useLanguage();
  const t = TXT[locale];
  // JSON notes are stored as "한국어 / English"; show the part for the current language.
  const pick = (s: string) => { const p = s.split(' / '); return p.length < 2 ? s : locale === 'ko' ? p[0] : p.slice(1).join(' / '); };
  const e22 = data.elections.find((e) => e.id === '20대');
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-teal-500/20 bg-teal-500/5 p-6">
        <h2 className="text-lg font-bold text-white">{t.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">{t.intro}</p>
        <p className="mt-2 text-[11px] text-slate-500">{pick(data.meta.frames)}</p>
      </section>

      <section className="rounded-3xl border border-white/5 bg-slate-900/40 p-6 shadow-xl">
        <h3 className="mb-3 text-base font-bold text-white">{t.t1}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400">
                {t.cols.map((c, i) => (
                  <th key={c} className={`px-2 py-1.5 ${i < 2 ? 'text-left' : 'text-right'}`}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.elections.map((e) => (
                <tr key={e.id} className="border-b border-white/5 text-slate-300">
                  <td className="px-2 py-1.5 font-semibold" style={{ color: COLORS[e.id] }}>{e.id} <span className="font-normal text-slate-500">{e.year}</span></td>
                  <td className="px-2 py-1.5">{e.winner} / {e.runner_up}</td>
                  <td className={`px-2 py-1.5 text-right font-bold ${kTone(e.K_winner.pooled)}`}>
                    {e.K_winner.pooled.toFixed(3)} <span className="font-normal text-slate-400">[{e.K_winner.lo.toFixed(2)}, {e.K_winner.hi.toFixed(2)}]</span>
                  </td>
                  <td className="px-2 py-1.5 text-right">{e.K_winner.mean.toFixed(3)}</td>
                  <td className="px-2 py-1.5 text-right">{e.K_winner.median.toFixed(3)}</td>
                  <td className="px-2 py-1.5 text-right">{e.K_winner.n_above1} / {e.n}</td>
                  <td className="px-2 py-1.5 text-right text-slate-400">{e.K_conservative.pooled.toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-3xl border border-white/5 bg-slate-900/40 p-6 shadow-xl">
        <h3 className="mb-3 text-base font-bold text-white">{t.t2}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400">
                {t.cols2.map((c, i) => (
                  <th key={c} className={`px-2 py-1.5 ${i < 2 ? 'text-left' : 'text-right'}`}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.elections.map((e) => {
                const a = e.accounting;
                return (
                  <tr key={e.id} className="border-b border-white/5 text-slate-300">
                    <td className="px-2 py-1.5 font-semibold" style={{ color: COLORS[e.id] }}>{e.id}</td>
                    <td className="px-2 py-1.5">{e.winner_is_conservative ? t.cons : t.dem}</td>
                    <td className="px-2 py-1.5 text-right">{a.unclassified_share_pct.toFixed(1)}%</td>
                    <td className="px-2 py-1.5 text-right">{num(a.margin_classified)}</td>
                    <td className="px-2 py-1.5 text-right">{num(a.margin_unclassified)}</td>
                    <td className="px-2 py-1.5 text-right font-bold text-white">{num(a.margin_total)} <span className="font-normal text-slate-400">({a.margin_total_pct.toFixed(2)}%)</span></td>
                    <td className="px-2 py-1.5 text-right">{num(a.margin_if_K1)} <span className="text-slate-400">({a.margin_if_K1_pct.toFixed(2)}%)</span></td>
                    <td className="px-2 py-1.5 text-right">{sgn(a.change_due_to_K)}</td>
                    <td className="px-2 py-1.5 text-right">{a.K_at_zero_margin == null ? t.none : a.K_at_zero_margin.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <h4 className="mb-1 mt-4 text-xs font-bold uppercase tracking-wider text-slate-500">{t.reading}</h4>
        <ul className="list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-400">
          {t.bullets(e22).filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}
        </ul>
        <p className="mt-3 text-[11px] text-slate-500">{pick(data.meta.accounting)}</p>
      </section>
    </div>
  );
}
