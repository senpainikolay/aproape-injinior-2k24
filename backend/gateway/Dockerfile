FROM python:3.8


WORKDIR /gateway

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY . .

EXPOSE 8069

CMD ["python", "main.py"]
