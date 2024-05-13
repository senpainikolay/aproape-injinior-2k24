FROM python:3.8


WORKDIR /app3

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY . .

EXPOSE 8002

CMD ["python", "main.py"]
