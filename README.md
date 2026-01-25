# AI-Powered Customer Support

### Work in progress!!!

This project is an LLM-powered customer support agent designed to automate the handling of support tickets and execute actions such as updating refund status and sending a response email based on a policy document. It will use LangChain and Retrieval-Augmented Generation (RAG) with Pinecone to ground responses. 

**Completed**:
- Authentication dependency.
- Sliding-window, counter-based API rate limiter implemented as FastAPI dependency with Redis for request tracking.
- Policy reindexing endpoint.

Note: Might convert authentication and rate limiter dependencies to middlewares, based on the requirement.


**Next step**: RAG test!

Technologies involved:
- FastAPI
- Redis
- SQLAlchemy
- LangChain
- Pinecone
- AWS S3
