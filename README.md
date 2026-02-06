# AI-Powered Customer Support

[![Status: WIP](https://img.shields.io/badge/Status-Work%20in%20Progress-yellow)]()
[![Python 3.9+](https://img.shields.io/badge/python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![Node 18+](https://img.shields.io/badge/node-18+-green.svg)](https://nodejs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19+-61DAFB.svg)](https://react.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

**App demo**: https://ai-customer-support-vivek.vercel.app/

An LLM-powered customer support agent designed to automate the handling of support tickets and execute actions such as updating refund status and sending response emails based on policy document. Uses LangChain and Retrieval-Augmented Generation (RAG) with Pinecone to ground responses.

[Link to the policy document](/refund_return_policy.txt).

## Table of Contents

- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Project Status](#project-status)
- [License](#license)

## Architecture

### Backend

- **FastAPI** - High-performance async API framework
- **SQLAlchemy** - ORM for database operations
- **Redis** - Rate limiting and caching
- **LangChain** - LLM orchestration
- **Pinecone** - Vector database for RAG
- **Amazon S3** - Document storage
- **Amazon RDS** - Database
- **Amazon ECS & Load Balancer** - Backend server
- **pwlib[argon2]** - Password hashing
- **SSE Event Streaming** - AI response streaming

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
- Redis server
- Pinecone account
- AWS account

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
   # Backend
   uv run uvicorn app.main:app --reload

   # Frontend (in another terminal)
   pnpm dev
   ```

## Project Status

### ✅ Completed

- Authentication dependency implementation
- Sliding-window, counter-based API rate limiter with Redis
- Policy reindexing on Amazon Lambda
- Frontend UI
- Support ticket creation and retrieval
- Order management models and endpoints
- Agentic tools for order tracking, refund, return and Pinecone RAG
- Streaming LLM responses for ticket queries using OpenAI model

### 🚀 In Progress

- Handling very large policy documents.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
