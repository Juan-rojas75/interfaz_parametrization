from pymongo import MongoClient
from config import MONGO_URI, MONGO_DB_NAME

class MongoDB:
    def __init__(self):
        # Conectar a la base de datos
        self.client = MongoClient(MONGO_URI)
        self.db = self.client[MONGO_DB_NAME]

    def get_collection(self, collection_name):
        """Obtiene una colección específica de la base de datos."""
        return self.db[collection_name]

    def find_all(self, collection_name, query={}):
        """Obtiene todos los documentos de una colección con un filtro opcional."""
        collection = self.get_collection(collection_name)
        return list(collection.find(query, {"_id": 0}))  # Excluir _id para evitar problemas con JSON

    def find_one(self, collection_name, query):
        """Obtiene un solo documento que coincida con el filtro."""
        collection = self.get_collection(collection_name)
        return collection.find_one(query, {"_id": 0})

    def find_many_id(self, collection_name, query):
        """Obtiene un solo documento que coincida con el filtro."""
        collection = self.get_collection(collection_name)
        return collection.find(query,{"_id": 0, "template": 0,"createdAt": 0,"updatedAt": 0})

    def insert_one(self, collection_name, data):
        """Inserta un documento en la colección."""
        collection = self.get_collection(collection_name)
        return collection.insert_one(data).inserted_id

    def close_connection(self):
        """Cierra la conexión a la base de datos."""
        self.client.close()
