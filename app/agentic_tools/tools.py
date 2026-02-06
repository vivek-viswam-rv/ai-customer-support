from langchain.tools import tool

from app.database import get_db
from app.models import Order, OrderHistory

from langchain_openai import OpenAIEmbeddings
from langchain_pinecone import PineconeVectorStore

from .utils import get_pinecone_index

EMBEDDING_MODEL = "text-embedding-3-small"
PINECONE_DIM = 1536
PINECONE_METRIC = "cosine"

@tool
def get_all_orders_of_user(user_id: str) -> str:
    """Fetches all orders for a given user ID."""
    db = next(get_db())
    orders = db.query(Order).filter(Order.user_id == user_id).all()
    if orders:
        order_list = ", ".join([f"Order id: {order.id}, product_name: {order.product_name}, status: {order.status}" for order in orders])
        return f"User {user_id} has the following orders: {order_list}."
    else:
        return f"No orders found for user with ID {user_id}."

@tool
def get_current_order_status(order_id: str) -> str:
    """Fetches the current status of an order given its ID."""
    db = next(get_db())
    order = db.query(Order).filter(Order.id == order_id).first()
    if order:
        return f"The current status of order {order.name} is {order.status}."
    else:
        return f"Order with ID {order_id} not found."

@tool
def get_track_of_events_happened_to_order(order_id: str) -> str:
    """Fetches the track of events happened to a given order ID. This can help track the progress of an order over time."""
    db = next(get_db())
    status_changes = db.query(OrderHistory).filter(OrderHistory.order_id == order_id).all()
    if status_changes:
        history = ", ".join([f"{change.status} on {change.created_at}" for change in status_changes])
        return f"Order {order_id} had following events: {history}."
    else:
        return f"No status change history found for order with ID {order_id}."

@tool
def return_or_refund(order_id: str, action: str) -> str:
    """Tool to return or refund an order. Set the action parameter to either 'returned' or 'refunded'."""
    db = next(get_db())
    order = db.query(Order).filter(Order.id == order_id).first()
    if order:
        print("Found order")
        order.status = action
        db.add(order)
        db.commit()

        return f"Order {order_id} status changed to {action}."
    else:
        return f"Order with ID {order_id} not found."

@tool
def retrieve_return_refund_policy_context(query: str) -> str:
    """Retrieves relevant context from Pinecone vector store that contains returns and refunds policy based on the query."""
    index = get_pinecone_index()
    embeddings = OpenAIEmbeddings(model=EMBEDDING_MODEL)
    vector_store = PineconeVectorStore(index=index, embedding=embeddings)

    retrieved_docs = vector_store.similarity_search(query, k=2)
    serialized = "\n\n".join(
        (f"Source: {doc.metadata}\nContent: {doc.page_content}")
        for doc in retrieved_docs
    )

    return serialized, retrieved_docs

TOOLS = [
    get_all_orders_of_user,
    get_current_order_status,
    get_track_of_events_happened_to_order,
    return_or_refund,
    retrieve_return_refund_policy_context
]
