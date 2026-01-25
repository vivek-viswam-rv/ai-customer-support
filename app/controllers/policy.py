import os
from uuid import uuid4

from dotenv import load_dotenv
from fastapi import APIRouter, Depends
from langchain_community.document_loaders import S3FileLoader
from langchain_openai import OpenAIEmbeddings
from langchain_pinecone import PineconeVectorStore
from pinecone import Pinecone, ServerlessSpec

from app.dependencies import authentication
from app.routes import POLICY_REINDEX
from .constants import EMBEDDING_MODEL, PINECONE_DIM, PINECONE_METRIC

load_dotenv()

router = APIRouter(dependencies=[Depends(authentication)])

@router.post(POLICY_REINDEX)
def reindex():
    ids, documents = _get_policy_documents()
    index = _get_policy_index()
    embeddings = OpenAIEmbeddings(model=EMBEDDING_MODEL)
    vector_store = PineconeVectorStore(index=index, embedding=embeddings)

    vector_store.add_documents(documents=documents, ids=ids)

    return {"message": "success"}


def _get_policy_documents():
    loader = S3FileLoader(
        os.getenv("AWS_S3_BUCKET"),
        os.getenv("POLICY_FILE"),
        aws_access_key_id=os.getenv("AWS_ACCESS_ID"),
        aws_secret_access_key=os.getenv("AWS_SECRET_KEY")
    )

    return [ str(uuid4()) ], loader.load()

def _get_policy_index():
    INDEX_NAME = os.getenv("PINECONE_INDEX")

    pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
    if not pc.has_index(INDEX_NAME):
        pc.create_index(
            name=INDEX_NAME,
            dimension=PINECONE_DIM,
            metric=PINECONE_METRIC,
            spec=ServerlessSpec(
                cloud=os.getenv("PINECONE_CLOUD"),
                region=os.getenv("PINECONE_REGION")
            )
        )

    return pc.Index(INDEX_NAME)
