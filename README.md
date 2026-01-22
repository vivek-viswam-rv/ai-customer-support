# AI-Powered Customer Support

### Work in progress!!!

This project is an LLM-powered customer support agent designed to automate the handling of support tickets and execute actions such as updating refund status and sending a response email based on a policy document. It will use LangChain and Retrieval-Augmented Generation (RAG) with ChromaDB to ground responses. 

**Current status**: Implemented a sliding-window, counter-based API rate limiter implemented as FastAPI middleware with Redis for request tracking.  
**Next step**: LangChain integration.

Tools and packages used:
- FastAPI
- Redis
- SQLAlchemy
- LangChain
- ChromaDB
