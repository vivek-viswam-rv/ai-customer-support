FROM python:3.13-slim

WORKDIR /app

RUN apt-get update && apt-get install -y awscli

COPY . /app/

RUN pip install uv
RUN uv sync

CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]
