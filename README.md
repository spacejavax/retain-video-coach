# Retain

Retain is an English-language AI coach for short-form creators. Upload a draft TikTok, Instagram Reel, or YouTube Short and get structured, timestamped feedback on the hook, pacing, clarity, visual engagement, audio delivery, payoff, and audience fit. Scores describe creative and retention potential; they do not predict views or guarantee performance.

## Technology

- Next.js App Router, React, TypeScript, Tailwind CSS
- Zod validation and structured Gemini JSON output
- Google GenAI JavaScript SDK with a replaceable provider interface
- Gemini Files API resumable uploads
- Vitest

## Local setup

1. Install Node.js 22.13 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local`.
4. Add your Gemini API key, then run `npm run dev`.
5. Open the local URL printed in the terminal.

Environment variables:

```env
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.5-flash
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Get a Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey). Keep it only in `.env.local` or your host's secret manager. Never prefix it with `NEXT_PUBLIC_`.

## How uploading works

The browser validates MIME type, size (maximum 50 MB), and duration (maximum 90 seconds). The server validates upload metadata again and creates a resumable Gemini Files API session. The browser uploads directly to that short-lived Google upload URL, avoiding normal serverless request-body limits while keeping the API key out of browser code. The server analyses the private file reference and deletes the Gemini file in a `finally` block whether analysis succeeds or fails. No database or permanent video library is used.

Supported MIME types are MP4 (`video/mp4`), MOV (`video/quicktime`), and WebM (`video/webm`). Validation uses the browser-provided MIME type and decoded media duration, not the filename. A higher-security production tier should add server-side magic-byte inspection through a dedicated storage/processing service.

## Demo mode

When `GEMINI_API_KEY` is empty, the UI clearly displays Demo mode. Real upload analysis is disabled, and reviewers can open a bundled typed sample report. The sample is explicitly labelled; the app never implies that an uploaded video was analysed.

## Verification

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

Tests cover upload rules, schema validation, score-label normalization, user-facing error mapping, and demo behavior.

## Deployment

Deploy to a Node.js/Next.js-capable host, configure the three environment variables above, and run `npm run build`. The Gemini Files API must be reachable from the server and user browser. `NEXT_PUBLIC_APP_URL` should be the final HTTPS origin. The included Sites/Vinext configuration produces a Cloudflare Worker-compatible artifact.

The in-memory limiter allows five analysis requests per IP per hour. It is suitable for a single MVP process; replace it with a shared provider such as Cloudflare KV or Upstash for multi-instance deployments.

## Privacy

Videos are sent temporarily to the Gemini Files API, processed for the requested analysis, and then deleted. Cleanup failures are logged without raw video data. Users should avoid content they are not permitted to process. AI feedback is guidance and should be reviewed by the creator.

## Known MVP limitations

- No accounts, history, database, subscriptions, teams, or social connections.
- One video per analysis; maximum 50 MB and 90 seconds.
- Client duration validation varies with browser codec support.
- In-memory rate limiting is not shared across server instances.
- An interrupted upload that never reaches analysis may remain in Gemini's temporary Files storage until Google's automatic retention expires.
- Gemini latency, quotas, availability, and cost depend on the configured account.

## Recommended next features (not implemented)

- Server-verified media signatures and transcoding
- Shared durable rate limiting and abuse controls
- Optional accounts with private analysis history
- Revision comparison and exportable edit decision lists
- Caption-safe-area previews and multi-language coaching
