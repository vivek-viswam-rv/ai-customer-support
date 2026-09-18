# AI Customer Support

Demo: https://ai-customer-support-vivek.vercel.app/

A customer support agent that handles support tickets on its own. A user describes their problem, and the agent looks up their orders, checks the [return and refund policy](/refund_return_policy.txt), and if needed updates the order (return or refund). The reply is streamed back to the user as it's generated.

Built with FastAPI, LangChain and React. The policy document is embedded into Pinecone, and the agent pulls the relevant parts of it while answering (RAG).

## Stack

### Backend

| Tool | Used for |
|---|---|
| FastAPI | API framework |
| SQLAlchemy | ORM |
| LangChain | Agent and tool orchestration |
| OpenAI | LLM (`gpt-5-nano`) and embeddings (`text-embedding-3-small`) |
| Pinecone | Vector database for the policy document (RAG) |
| pwdlib (argon2) | Password hashing |
| SSE | Streaming the agent's reply to the browser |

### Frontend

| Tool | Used for |
|---|---|
| React 19 + Vite | UI |
| Tailwind CSS + shadcn/ui | Styling and components |
| TanStack Query + Axios | Data fetching |
| Formik + Yup | Forms and validation |
| Ramda | Utility functions |

## Infrastructure

The project was originally deployed on AWS. That was overkill for a demo: ECS, the load balancer, RDS and ElastiCache all bill by the hour whether or not anyone is using the app. To cut costs the backend was moved to Render for a while, and now everything runs on Vercel with Supabase as the database.

| | Originally (AWS) | Now |
|---|---|---|
| Backend | ECS + Elastic Load Balancing, Dockerised FastAPI (see `Dockerfile`) | Vercel Python function (`api/index.py`) |
| Frontend | Vercel | Vercel, same project as the backend |
| Database | Amazon RDS (Postgres) | Supabase (Postgres) |
| Rate limiting | ElastiCache (Redis) | None, see note below |
| Policy document storage | Amazon S3 | Amazon S3 |
| Policy reindexing | AWS Lambda | AWS Lambda |
| Vector database | Pinecone | Pinecone |

How the current setup works:

- Requests to `/api/*` go to the FastAPI function, everything else is served from the static React build (`vercel.json`).
- Supabase is used through its connection pooler. SQLAlchemy pooling is turned off since the function is serverless.
- Uploading a new policy file to S3 triggers the Lambda (`lambda/reindexer.py`), which embeds it into Pinecone. S3 and Lambda are pay-per-use and cost almost nothing at this scale, so they stayed on AWS.
- The Redis rate limiter (`app/dependencies/rate_limiter.py`) is still in the code but isn't attached to any route now that there's no Redis. Set `REDIS_HOST`/`REDIS_PORT` and add `Depends(rate_limiter)` to the routes to bring it back.

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
