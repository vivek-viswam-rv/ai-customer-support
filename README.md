# AI-Powered Customer Support

[![Status: WIP](https://img.shields.io/badge/Status-Work%20in%20Progress-yellow)]()
[![Python 3.9+](https://img.shields.io/badge/python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![Node 18+](https://img.shields.io/badge/node-18+-green.svg)](https://nodejs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19+-61DAFB.svg)](https://react.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

**App demo**: https://ai-customer-support-vivek.vercel.app/

**The app now runs entirely on Vercel (frontend + backend) with Supabase as the database. It was originally built and deployed on AWS; the move was made to cut infrastructure costs. See [Architecture](#architecture) for both setups.**

An LLM-powered customer support agent designed to automate the handling of support tickets and execute actions such as updating refund status and sending response emails based on policy document. Uses LangChain and Retrieval-Augmented Generation (RAG) with Pinecone to ground responses.

[Link to the policy document](/refund_return_policy.txt).

## Table of Contents

- [Architecture](#architecture)
  - [Current architecture (cost-optimised)](#current-architecture-cost-optimised)
  - [Previous architecture (AWS)](#previous-architecture-aws)
  - [Frontend](#frontend)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Deployment](#deployment)
- [Project Status](#project-status)
- [License](#license)

## Architecture

The application code (FastAPI, SQLAlchemy, LangChain, Pinecone RAG, SSE streaming) is the same in both setups. What changed is where it runs.

### Current architecture (cost-optimised)

The AWS setup below was reliable but expensive to keep running for a demo project (always-on ECS tasks, a load balancer, RDS and ElastiCache all bill by the hour). As a cost-cutting measure the backend was first moved to render.com, and is now consolidated onto Vercel and Supabase, both of which have usage-based free tiers.

- **Vercel** - Hosts both the frontend and the backend in a single project
  - The Vite build (`ui/dist`) is served as static files from Vercel's CDN
  - The FastAPI app runs as a single Python Vercel Function (`api/index.py`), and every `/api/*` request is rewritten to it (see `vercel.json`)
  - Frontend and backend share an origin, so no CORS setup or API URL is needed in production
- **Supabase (Postgres)** - Database, replacing Amazon RDS
  - Accessed through SQLAlchemy using Supabase's transaction pooler (Supavisor, port `6543`)
  - The SQLAlchemy engine uses `NullPool`, since serverless function instances shouldn't hold their own connection pools
- **FastAPI** - High-performance async API framework
- **SQLAlchemy** - ORM for database operations
- **LangChain** - LLM orchestration
- **Pinecone** - Vector database for RAG
- **pwlib[argon2]** - Password hashing
- **SSE Event Streaming** - AI response streaming (Vercel's Python runtime streams responses)
- **Amazon S3 + AWS Lambda** - Still used for policy reindexing. Uploading a policy document to the S3 bucket triggers `lambda/reindexer.py`, which embeds it into Pinecone. Both are pay-per-use and cost practically nothing at this scale, so they were not moved.
- **Redis rate limiter** - The rate limiter dependency (`app/dependencies/rate_limiter.py`) is still in the codebase, but it is not attached to any route at the moment since ElastiCache was retired. To bring it back, point `REDIS_HOST`/`REDIS_PORT` at any hosted Redis and add `Depends(rate_limiter)` to the routes.

### Previous architecture (AWS)

This is how the project was originally built and deployed. The `Dockerfile` in the repo is from this setup and still works for container-based hosting.

- **Amazon ECS & Elastic Load Balancing (ELB)** - Backend server (Dockerised FastAPI app)
- **Amazon RDS** - Postgres database
- **Amazon ElastiCache (Redis)** - Counter-based API rate limiting
- **Amazon S3** - Policy document storage
- **AWS Lambda** - Policy reindexing into Pinecone on S3 upload
- **Pinecone** - Vector database for RAG
- **Vercel** - Frontend only

### Frontend

- **React 19** - UI framework
- **Tailwind CSS** - Utility-first CSS
- **Shadcn/ui** - Component library
- **Axios** - API requests
- **Ramda** - Functional library of JavaScript
- **TanStack Query (React Query)** - Data fetching
- **Formik & Yup** - Form management and validation

## Getting Started

### Prerequisites

- Python 3.9 or higher
- Node.js 18 or higher
- [uv](https://docs.astral.sh/uv/) - Python package manager
- A Postgres database ([Supabase](https://supabase.com/) project, or a local Postgres for development)
- Pinecone account
- OpenAI API key
- AWS account (only for the S3 + Lambda policy reindexer)
- Redis server (optional, only if you re-enable the rate limiter)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/vivek-viswam-rv/ai-customer-support.git
   cd ai-customer-support
   ```

2. **Backend Setup**

   ```bash
   # Install dependencies with uv
   uv sync

   # Configure environment
   cp env.sample .env
   # Edit .env with your configuration
   ```

3. **Frontend Setup**

   ```bash
   pnpm install
   ```

4. **Run the application**

   ```bash
   # Backend (http://localhost:8000)
   uv run uvicorn app.main:app --reload

   # Frontend (in another terminal, http://localhost:5173)
   pnpm dev
   ```

   The Vite dev server proxies `/api` to `http://localhost:8000`, so the frontend talks to the backend on the same origin just like it does on Vercel. Set `VITE_API_URL` only if the backend lives on a different origin.

## Deployment

### Supabase

1. Create a Supabase project.
2. Open **Connect** and copy the **Transaction pooler** connection string (port `6543`). It looks like:

   ```
   postgresql://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres
   ```

3. Use it as `DATABASE_URL`. Tables are created automatically on startup (`Base.metadata.create_all`).
4. The app only talks to Supabase as a plain Postgres database. Since the tables live in the `public` schema, either disable the Supabase Data API (**Project Settings → API**) or enable Row Level Security on the tables, so they aren't exposed through Supabase's auto-generated REST API.

### Vercel

1. Import the repository as a Vercel project. `vercel.json` already sets the framework (Vite), the output directory (`ui/dist`), the Python function config and the rewrites.
2. Add the environment variables: `OPENAI_API_KEY`, `PINECONE_API_KEY`, `PINECONE_INDEX`, `PINECONE_CLOUD`, `PINECONE_REGION` and `DATABASE_URL`. `VITE_API_URL` and `FRONTEND_URL` can be left unset because both halves share an origin.
3. Deploy. `GET /api/health` should respond with `App's healthy!`.

Python dependencies are installed from `pyproject.toml`/`uv.lock`. The packages needed only by the Lambda reindexer are kept in the `lambda` dependency group so that they stay out of the Vercel function bundle (`uv sync --group lambda` installs them locally).

## Project Status

### ✅ Completed

- Authentication dependency implementation
- Counter-based API rate limiter with Redis (currently not attached to routes, see [Architecture](#current-architecture-cost-optimised))
- Migration from AWS (ECS, RDS, ElastiCache) to Vercel + Supabase to cut infrastructure costs
- Policy reindexing on Amazon Lambda
- Frontend UI
- Support ticket creation and retrieval
- Order management models and endpoints
- Agentic tools for order tracking, refund, return and Pinecone RAG
- Streaming LLM responses for ticket queries using OpenAI model

## License

This project is licensed under the MIT License - see the LICENSE file for details.
