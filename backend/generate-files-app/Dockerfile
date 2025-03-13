# Usa Python como base
FROM python:3.10-slim

WORKDIR /app

# Copia los archivos de dependencias
COPY requirements.txt .

# Instala las dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Copia el código fuente
COPY . .

# Expone el puerto del backend
EXPOSE 5000

# Comando para ejecutar FastAPI con Uvicorn
# Usa Gunicorn en lugar de Python simple
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]

