FROM python:3.8


# Install system dependencies
RUN apt-get update && apt-get install -y \
    libgl1-mesa-dev \
    libssl-dev \
    wget

# Download and install libssl1.1 package
RUN wget http://archive.ubuntu.com/ubuntu/pool/main/o/openssl/libssl1.1_1.1.0g-2ubuntu4_amd64.deb && \
    dpkg -i libssl1.1_1.1.0g-2ubuntu4_amd64.deb && \
    rm libssl1.1_1.1.0g-2ubuntu4_amd64.deb

WORKDIR /app

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY . .

EXPOSE 8001

CMD ["python", "main.py"]
