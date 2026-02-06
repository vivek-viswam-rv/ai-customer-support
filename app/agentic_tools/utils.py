import os

from pinecone import Pinecone, ServerlessSpec

from .constants import PINECONE_DIM, PINECONE_METRIC

def get_pinecone_index():
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
