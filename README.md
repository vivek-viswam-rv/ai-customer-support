# AI Customer Support

Demo: https://ai-customer-support-vivek.vercel.app/

A customer support agent that handles support tickets on its own. A user describes their problem, and the agent looks up their orders, checks the [return and refund policy](/refund_return_policy.txt), and if needed updates the order (return or refund). The reply is streamed back to the user as it's generated.

Built with FastAPI, LangChain and React. The policy document is embedded into Pinecone, and the agent pulls the relevant parts of it while answering (RAG).

## How it's hosted

The whole thing runs on Vercel, with Supabase as the database.

- The React frontend is served as static files.
- The FastAPI backend runs as a Python function (`api/index.py`). Requests to `/api/*` go there, everything else goes to the frontend.
- Supabase Postgres is used through its connection pooler. SQLAlchemy pooling is turned off since the function is serverless.
- Policy reindexing still happens on AWS: uploading a new policy file to S3 triggers a Lambda (`lambda/reindexer.py`) that embeds it into Pinecone.

### Earlier setup on AWS

The project was originally deployed on AWS:

- ECS behind a load balancer for the backend (see `Dockerfile`)
- RDS for Postgres
- ElastiCache (Redis) for API rate limiting
- S3 + Lambda for policy reindexing
- Vercel for the frontend only

That was overkill for a demo. ECS, the load balancer, RDS and ElastiCache all bill by the hour whether or not anyone is using the app, so I moved it to Vercel and Supabase to cut costs. The backend spent some time on Render in between.

The Redis rate limiter (`app/dependencies/rate_limiter.py`) is still in the code but isn't attached to any route now that there's no Redis. Set `REDIS_HOST`/`REDIS_PORT` and add `Depends(rate_limiter)` to the routes to bring it back.

## Stack

Backend: FastAPI, SQLAlchemy, LangChain, OpenAI, Pinecone, pwdlib (argon2), SSE for streaming.

Frontend: React 19, Vite, Tailwind CSS, shadcn/ui, TanStack Query, Axios, Formik + Yup, Ramda.

## Running locally

You need Python 3.12+, [uv](https://docs.astral.sh/uv/), Node 18+ and pnpm, plus a Postgres database, an OpenAI API key and a Pinecone account.

```bash
git clone https://github.com/vivek-viswam-rv/ai-customer-support.git
cd ai-customer-support

uv sync
pnpm install

cp env.sample .env   # fill in the values
```

Then in two terminals:

```bash
uv run uvicorn app.main:app --reload   # backend on :8000
pnpm dev                               # frontend on :5173
```

The Vite dev server proxies `/api` to the backend, so no extra config is needed.

The Lambda's dependencies aren't installed by default. Run `uv sync --group lambda` if you want to work on it.

## Deploying

Supabase: create a project, and use the **Transaction pooler** connection string (port 6543) as `DATABASE_URL`. Tables are created on first start. Since the tables end up in the `public` schema, disable the Data API in the project settings (or turn on RLS) so they aren't exposed through Supabase's REST API.

Vercel: import the repo and set `DATABASE_URL`, `OPENAI_API_KEY`, `PINECONE_API_KEY`, `PINECONE_INDEX`, `PINECONE_CLOUD` and `PINECONE_REGION`. `vercel.json` takes care of the build and routing. `/api/health` should respond once it's up.

## License

MIT, see [LICENSE](/LICENSE).
