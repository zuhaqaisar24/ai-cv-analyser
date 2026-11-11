# CVAnalyser

A CV and a job advert go in. A structured profile comes out: skills, roles, and education, checked against a schema before the page ever sees them.

The npm package and repository name stay `ai-cv-analyser`. The name on the page is CVAnalyser.

The match score, the gap list, rewritten bullets, and study links are stubbed on purpose. [LESSON_PLAN.md](LESSON_PLAN.md) is the build order for those pieces. The results page already has a place for each one.

Jordan Hale, the person you see in test mode, is fictional. Without `OPENAI_API_KEY`, CVAnalyser shows that sample profile and also the text it actually read from your file.

## What works today

| Step | Status |
| --- | --- |
| Paste a CV, or upload a text PDF | Works |
| Extract a CV profile with the OpenAI API, validated by Zod | Works |
| Run with no API key (fixed sample profile, no network call) | Works |
| Job advert extraction | Lesson 1 |
| Match score, including embeddings | Lesson 2 |
| Gap analysis | Lesson 3 |
| Bullet rewrites | Lesson 4 |
| Learning resources | Lesson 5 |
| Prompt-injection guard for CV text | Lesson 6 |

Update this table when a lesson is finished. It is the first thing a reader should trust.

## Screenshots

The form, with the sample CV and advert loaded. The test-mode note sits above the fields:

![CVAnalyser home page with the sample CV loaded and a test-mode note](docs/screenshots/home.png)

Test mode on the results page. The banner says the profile is a sample, and the text read from the file is shown first:

![CVAnalyser results in test mode, with the extracted CV text above the sample profile](docs/screenshots/results.png)

The rest of that page keeps the job advert and the lesson slots:

![CVAnalyser results page continuing into the job advert and lesson cards](docs/screenshots/results-full.png)

## How it fits together

```mermaid
flowchart TD
  form[Form: PDF or pasted CV, plus the job advert]
  api["POST /api/analyse"]
  pdf[unpdf reads the PDF]
  guard[guardUntrustedText]
  cv[extractCvProfile]
  key{API key set?}
  sample[Sample CV profile]
  llm["OpenAI chat.completions.parse"]
  zod[Zod cvProfileSchema]
  stubs[Lesson stubs, null until you build them]
  page[Results page in this browser tab]

  form --> api
  api --> pdf
  pdf --> guard
  guard --> cv
  cv --> key
  key -->|no| sample
  key -->|yes| llm
  llm --> zod
  sample --> page
  zod --> page
  api --> stubs
  stubs --> page
```

The browser keeps the last result in `sessionStorage` for this tab. There is no database. With an API key, the CV text is sent to OpenAI with `store: false`. Test mode does not make that call.

## Setup

You need Node.js 22 or newer. The PDF reader (`unpdf`) requires it. The same commands work in Command Prompt, PowerShell, and a macOS or Linux terminal.

```bash
npm install
npm run dev
```

Open [http://localhost:43123](http://localhost:43123).

Click **Load sample**, then **Analyse CV**. You should land on a profile for Jordan Hale, with the other sections marked as lessons. To try the PDF path, open the Upload PDF tab and click **Use sample PDF**. The file on disk is `public/samples/sample-cv.pdf`.

### A real extraction

```bash
copy .env.example .env.local
```

On macOS or Linux, use `cp .env.example .env.local`.

Put your key in `OPENAI_API_KEY`. The default model is `gpt-4o-mini`, which supports the JSON schema this project sends. Change `OPENAI_MODEL` if your account uses a different model that still accepts structured outputs. Restart `npm run dev` after you edit `.env.local`.

Do not commit `.env.local`. `.gitignore` ignores `.env*` and keeps `.env.example`.

Set `MOCK_LLM=true` to force the sample profile even when a key is present.

## Tech highlights

- **Structured outputs, not a hopeful `JSON.parse`.** `lib/cv/extract-cv-profile.ts` calls `chat.completions.parse` with `zodResponseFormat`. The Zod schema is the contract for both the model and the page. Optional fields are not used: strict mode rejects them, so missing text is an empty string.
- **The model is told the CV is data.** The document sits inside `<cv>` markers in the user message. Lesson 6 is the code-side guard, because a prompt is not a control. That matters for a tool whose input is written by the candidate.
- **PDF text stays on the server.** `unpdf` runs in the route handler. Scanned pages fail with a clear message instead of an empty profile.
- **Test mode is obvious.** With no API key the results banner says you are seeing a sample profile, not your CV, and the text read from the file is shown above that profile.
- **Later steps cannot take down the profile.** If a lesson function throws, `lib/analyse.ts` keeps the CV profile and puts the error on the page.
- **Embeddings are part of the design, not a keyword hack.** Lesson 2 scores exact matches in ordinary TypeScript, then uses embeddings only for the names that did not join. The catalogue in lesson 5 is a real list of docs, so the app is not asked to invent URLs.

## Project layout

```
app/
  api/analyse/route.ts          POST handler
  page.tsx                      form
  results/page.tsx              profile and lesson slots
lib/
  cv/extract-cv-profile.ts      the working model call
  job/extract-job-advert.ts     lesson 1
  match/                        lesson 2, score and embeddings
  gaps/analyse-gaps.ts          lesson 3
  rewrites/rewrite-bullets.ts   lesson 4
  resources/                    lesson 5, catalogue plus stub
  safety/guard-input.ts         lesson 6
  schemas/                      Zod contracts
  samples.ts                    mock payloads
  analyse.ts                    wires the steps together
public/samples/                 CV, advert, PDF, injection fixture
LESSON_PLAN.md
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server on port 43123 |
| `npm run lint` | ESLint |
| `npm run build` | Production build |
| `npm start` | Serve the production build on port 43123 |
