# Use a lightweight Python base
FROM python:3.10-slim

# Prevent Python from writing .pyc files and enable real-time logging
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies required by OpenCV
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglx-mesa0 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Create HuggingFace user
RUN useradd -m -u 1000 user

# Create required folders and fix permissions
RUN mkdir -p uploads fragments && \
    chown -R user:user /app && \
    chmod -R 777 /app/uploads /app/fragments

# Switch to non-root user
USER user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

# Copy project files
COPY --chown=user . .

# Install dependencies (CPU Torch + Flask + Gradio)
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir --index-url https://download.pytorch.org/whl/cpu torch torchvision && \
    pip install --no-cache-dir \
        flask \
        flask-cors \
        gunicorn \
        opencv-python-headless \
        numpy \
        Pillow \
        gradio \
        requests

# Start Gradio UI (Frontend)
CMD ["python3", "app.py"]
