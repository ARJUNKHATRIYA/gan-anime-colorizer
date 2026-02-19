# # # # Use Python slim image
# # # FROM python:3.10-slim

# # # # Prevent Python from writing pyc files
# # # ENV PYTHONDONTWRITEBYTECODE=1
# # # ENV PYTHONUNBUFFERED=1

# # # # Set working directory
# # # WORKDIR /app

# # # # Install system dependencies (opencv needs these)
# # # RUN apt-get update && apt-get install -y \
# # #     libgl1 \
# # #     libglib2.0-0 \
# # #     && rm -rf /var/lib/apt/lists/*

# # # # Copy requirements first (better layer caching)
# # # COPY requirements.txt .

# # # # Install Python dependencies
# # # RUN pip install --upgrade pip \
# # #     && pip install --no-cache-dir -r requirements.txt

# # # # Copy project files
# # # COPY . .

# # # # Flask environment variables
# # # ENV FLASK_APP=app.py
# # # ENV FLASK_RUN_HOST=0.0.0.0
# # # ENV FLASK_RUN_PORT=5000

# # # # Expose port
# # # EXPOSE 5000

# # # # Run Flask
# # # CMD ["flask", "run"]


# # # Use Python slim image
# # FROM python:3.10-slim

# # # Standard Python environment variables
# # ENV PYTHONDONTWRITEBYTECODE=1
# # ENV PYTHONUNBUFFERED=1
# # ENV HOME=/home/user

# # # Install system dependencies (OpenCV requirements)
# # RUN apt-get update && apt-get install -y \
# #     libgl1 \
# #     libglib2.0-0 \
# #     && rm -rf /var/lib/apt/lists/*

# # # Create a non-root user (Hugging Face requirement)
# # RUN useradd -m -u 1000 user
# # USER user
# # ENV PATH="/home/user/.local/bin:${PATH}"

# # WORKDIR $HOME/app

# # # Copy requirements and install
# # COPY --chown=user requirements.txt .
# # RUN pip install --upgrade pip && \
# #     pip install --no-cache-dir -r requirements.txt

# # # Copy project files with correct ownership
# # COPY --chown=user . .

# # # Create needed directories with user permissions
# # RUN mkdir -p uploads fragments

# # # Hugging Face uses port 7860 by default
# # ENV PORT=7860
# # EXPOSE 7860

# # # Run with Gunicorn (Better for production/Spaces than 'flask run')
# # CMD ["gunicorn", "--bind", "0.0.0.0:7860", "--timeout", "120", "app:app"]

# FROM python:3.10-slim

# # Standard setup
# ENV PYTHONDONTWRITEBYTECODE=1
# ENV PYTHONUNBUFFERED=1
# WORKDIR /app

# # Install system dependencies (OpenCV needs these)
# RUN apt-get update && apt-get install -y \
#     libgl1 \
#     libglx-mesa0 \
#     libglib2.0-0 \
#     && rm -rf /var/lib/apt/lists/*

# # Create a user Hugging Face likes
# RUN mkdir -p uploads fragments
# RUN useradd -m -u 1000 user
# USER user
# ENV HOME=/home/user \
#     PATH=/home/user/.local/bin:$PATH

# # Copy files
# COPY --chown=user . .

# # Install dependencies directly to the user's local path
# RUN pip install --no-cache-dir --upgrade pip && \
#     pip install --no-cache-dir flask flask-cors gunicorn torch torchvision opencv-python-headless numpy Pillow

# # Create required folders

# # THE FIX: Run gunicorn through python -m
# # This prevents the "executable not found" error
# CMD ["python3", "-m", "gunicorn", "--bind", "0.0.0.0:7860", "--timeout", "120", "app:app"]

# Use a lightweight Python base
FROM python:3.10-slim

# Prevent Python from writing .pyc files and enable real-time logging
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# 1. Install system dependencies for OpenCV (Debian Trixie compatible)
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglx-mesa0 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# 2. Set up the working directory
WORKDIR /app

# 3. Create the Hugging Face user (UID 1000)
RUN useradd -m -u 1000 user

# 4. PRE-CREATE FOLDERS as Root and transfer ownership
# This is the "Resume-Ready" fix for your Permission Error
RUN mkdir -p uploads fragments && \
    chown -R user:user /app && \
    chmod -R 777 /app/uploads /app/fragments

# 5. Switch to the non-root user
USER user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

# 6. Copy your project files with correct ownership
COPY --chown=user . .

# 7. Install Python dependencies 
# Using CPU-only Torch to keep the image size under the 10GB limit
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir --index-url https://download.pytorch.org/whl/cpu torch torchvision && \
    pip install --no-cache-dir flask flask-cors gunicorn opencv-python-headless numpy Pillow

# 8. Run the app using Gunicorn via the python module path
# This is more robust for production-style environments
CMD ["python3", "-m", "gunicorn", "--bind", "0.0.0.0:7860", "--timeout", "120", "app:app"]