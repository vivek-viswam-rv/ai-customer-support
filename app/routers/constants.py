from app.schemas import OrderStatus

DUMMY_PRODUCTS = [
    { "name": "Wireless Mouse", "status": OrderStatus(status="Delivered").status },
    { "name": "Bluetooth Headphones", "status": OrderStatus(status="Refunded").status },
    { "name": "USB-C Charger", "status": OrderStatus(status="Returned").status },
]
