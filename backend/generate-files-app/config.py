import os
from dotenv import load_dotenv


# Cargar variables de entorno desde el archivo .env
load_dotenv()

# Configuración de MongoDB
MONGO_URI = os.getenv("MONGO_URI")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME")
