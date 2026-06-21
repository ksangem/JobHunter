# analytics-service — FastAPI (Python 3.11).
FROM python:3.11-slim
WORKDIR /app
ENV PYTHONUNBUFFERED=1 PYTHONDONTWRITEBYTECODE=1

COPY apps/services/analytics-service/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY apps/services/analytics-service/app ./app
EXPOSE 3008
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "3008"]
