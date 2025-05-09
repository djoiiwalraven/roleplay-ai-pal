# Use an official Python runtime as a parent image
FROM python:3

# Set the working directory inside the container
WORKDIR /code

# Copy the requirements.txt (or install dependencies directly)
COPY requirements.txt /code/

# Install the app dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Expose port 8000 (FastAPI default)
EXPOSE 8000

# Start the FastAPI app using Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]