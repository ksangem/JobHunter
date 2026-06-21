# ai-worker — FastAPI + LLM/embedding worker (Python 3.11).
FROM python:3.11-slim
WORKDIR /app
ENV PYTHONUNBUFFERED=1 PYTHONDONTWRITEBYTECODE=1

COPY apps/services/ai-worker/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY apps/services/ai-worker/app ./app
EXPOSE 3011
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "3011"]
