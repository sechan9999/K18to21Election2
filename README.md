# K18to21 Elections Analysis

This repository contains a comprehensive analysis of the 18th to 21st Korean presidential elections. It includes original data, corrected datasets, audit reports, visualizations, and a final analysis report.

## Repository Structure

The files are organized into the following directories:

| Directory | Description |
| :--- | :--- |
| `original_data/` | Contains the initial Excel and PowerPoint files provided for analysis. |
| `corrected_data/` | Contains the audited and corrected version of the election data Excel file. |
| `reports/` | Includes audit reports for both the Excel and PowerPoint files, the final election analysis report, and the new analysis presentation (PPTX and PDF). |
| `visualizations/` | Contains PNG images of key charts: voter turnout, major party vote share, and regional party strength. |
| `summaries/` | Contains JSON files with structured data summaries of the election results and regional analysis. |

## Key Contents

### Data and Analysis
- **Original Data**: `K18to21charts.xlsx`, `18to21Kelection.pptx`
- **Corrected Data**: `K18to21charts_corrected.xlsx` (Fixed visibility issues and unhidden columns).
- **Final Report**: `election_analysis_report.md` provides a detailed breakdown of trends across the four election cycles.
- **New Presentation**: `18__21.pptx` and `18__21.pdf` summarize the findings in a professional format.

### Audit Reports
- **Excel Audit**: `excel_audit_report.md` details the checks performed on the spreadsheet.
- **Presentation Audit**: `presentation_audit_report.md` identifies formatting and layout improvements for the original presentation.

### Visualizations
- `voter_turnout.png`: Trends in voter engagement from the 18th to 21st elections.
- `major_party_vote_share.png`: Comparison of Democratic and Conservative party performance.
- `regional_strength_21st.png`: Regional breakdown of party support in the 21st election.

## Public Data Archives (18th–21st Presidential Elections)

The source records behind this analysis are published in full, so that anyone can verify the figures against the original documents. Each archive provides browsable tables plus the original workbook (XLSX) and a CSV export.

### 18th Presidential Election (December 19, 2012)

**[18th Ballot-Classifier Results Archive](https://storage.googleapis.com/k18-archive/index.html)**

Ballot-classifier operation results at district level (251 districts): classified / unclassified / hand-count tallies, candidate votes, age-band turnout, and the unclassified-ballot odds ratio (K). The archive also includes the NEC precinct-level official results (17,871 counting-unit rows) as tables, workbook, and CSV.

### 19th Presidential Election (May 9, 2017)

**[19th Ballot-Classifier Operation-Log Archive](https://storage.googleapis.com/k19-archive/index.html)**

The ballot-classifier operation log as 13,949 counting-unit (precinct) rows: ballots passed through the classifier, ballots classified by candidate, unclassified ballots, and classifier-start / chair-announcement times, in per-province tables. The NEC precinct-level official results (22,214 rows) are included in the same archive.

### 20th Presidential Election (March 9, 2022)

**[20th Tally-Sheet Originals Archive](https://storage.googleapis.com/k20-tally-archive/index.html)**

17,377 original ballot tally sheets (개표상황표) obtained from National Election Commission public releases and information-disclosure requests, browsable by province → district → individual sheet for the 224 districts collected (some regions, including all of Busan, Jeju, and Sejong, are absent because no originals were obtained), with the original image of every sheet and district-level original PDFs. The NEC precinct-level official results (22,752 rows) are included.

### 21st Presidential Election (June 3, 2025)

**[21st Tally-Sheet Originals Archive](https://storage.googleapis.com/k21-tally-archive/index.html)**

The 21st-election figures in this repository were transcribed from the official ballot tally sheets. The archive holds all 18,949 tally sheets, obtained from National Election Commission public releases and information-disclosure requests. Sheets are browsable by province → district → individual sheet, with the original image of every sheet and the district-level original PDF available for direct download, so the transcription can be checked against the source documents. The NEC precinct-level official results (22,685 rows) are included as tables, workbook, and CSV.

## Usage
This repository is intended for researchers and analysts interested in Korean electoral trends. The data is structured to be easily accessible for further analysis or presentation.

---

## Interactive Dashboard (Next.js)

This project also includes an interactive dashboard built with [Next.js](https://nextjs.org), bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

### Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

### Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Cloud Run 배포

Vercel 대신 Cloud Run에서 돌릴 수 있습니다(`next.config.ts`의 `output: 'standalone'` + 루트 `Dockerfile`).

- **콘솔:** Cloud Run → Create service → *Continuously deploy from a repository* → 이 레포, 브랜치 `^main$`, Build type **Dockerfile** (`/Dockerfile`) → Allow public access, 포트 `8080`.
- **CLI:**
  ```bash
  gcloud run deploy ehub-staging --source . --region us-central1 --allow-unauthenticated --port 8080
  ```
- **빌드 시 BigQuery 동기화(선택):** `SYNC_FROM_BIGQUERY=1`이면 prebuild 훅(`scripts/prebuild.mjs`)이 `scripts/sync-summaries.ts`로 `summaries/*.json`을 BigQuery `electoral_hub`에서 다시 만듭니다. 기본값(0)은 커밋된 JSON을 그대로 씁니다. 헤더의 run ID는 `summaries/_run.json`에서 옵니다.
- BigQuery 스키마·백필·대조: `bigquery/schema.sql`, `scripts/backfill_bigquery.py`, `npm run check:parity`. 전체 순서는 [docs/MIGRATION_CHECKLIST.md](docs/MIGRATION_CHECKLIST.md).
