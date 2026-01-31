import os
from uuid import uuid4

from langchain_community.document_loaders import S3FileLoader
from langchain_openai import OpenAIEmbeddings
from langchain_pinecone import PineconeVectorStore
from pinecone import Pinecone, ServerlessSpec

EMBEDDING_MODEL = "text-embedding-3-small"
PINECONE_DIM = 1536
PINECONE_METRIC = "cosine"


def lambda_handler(event, _):
    record = event["Records"][0]
    bucket = record['s3']['bucket']['name']
    key = record['s3']['object']['key']

    print(f"Processing S3 upload: s3://{bucket}/{key}")
    reindex(bucket, key)



def reindex(bucket, key):
    ids, documents = _get_documents(bucket, key)
    index = _get_pinecone_index()
    embeddings = OpenAIEmbeddings(model=EMBEDDING_MODEL)
    vector_store = PineconeVectorStore(index=index, embedding=embeddings)

    vector_store.add_documents(documents=documents, ids=ids)


def _get_documents(bucket, key):
    loader = S3FileLoader(
        bucket,
        key,
        aws_access_key_id=os.getenv("AWS_ACCESS_ID"),
        aws_secret_access_key=os.getenv("AWS_SECRET_KEY")
    )

    return [str(uuid4())], loader.load()


def _get_pinecone_index():
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
