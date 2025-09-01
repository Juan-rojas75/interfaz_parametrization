from flask import Flask, request, jsonify, send_file
from bson import ObjectId
import os
import threading
import time
from datebase.datebase import MongoDB
from scripts.generateFile_ByFile import GenerateFileByFile
from config import MONGO_URI, MONGO_DB_NAME
import pandas as pd

app = Flask(__name__)

mongo = MongoDB()

UPLOAD_FOLDER = "uploads"
DOWNLOAD_FOLDER = "downloads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["DOWNLOAD_FOLDER"] = DOWNLOAD_FOLDER


def delayed_delete(file_path, output_path):
    time.sleep(5)  # Espera 5 segundos antes de eliminar
    try:
        os.remove(file_path)
        os.remove(output_path)
        print("Archivos eliminados correctamente")
    except Exception as e:
        print(f"Error eliminando archivos: {e}")
        
@app.route("/")
def home():
    return f"Conectado a la BD: {MONGO_DB_NAME}, URI: {MONGO_URI}"

@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No se envió ningún archivo"}), 400
    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "Nombre de archivo vacío"}), 400

    if not file.filename.endswith((".xls", ".xlsx")):
        return jsonify({"error": "Formato no permitido. Sube un archivo .xls o .xlsx"}), 400

    # Guardar archivo temporalmente
    file_path = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
    file.save(file_path)

    # Obtener datos adicionales
    record_id = request.form.get("id_template")
    customer_id = request.form.get("id_customer")

    if not record_id or not customer_id:
        return jsonify({"error": "Faltan datos requeridos"}), 400

    # Obtener de la base de datos el template
    record_id_obj = ObjectId(record_id)
    template = mongo.find_one("templates", {"_id": record_id_obj})
    extension = template["extension"]
    extension = extension.lower()
    # Generar el archivo de salida
    generate_ = GenerateFileByFile(record_id, customer_id, file_path)
    if extension == "xlsx" : 
        print("xlsx")
        output_filename, dfFinal = generate_.generateFileByFileExcel()
        
        # Reemplaza tanto NaT como NaN por None
        dfFinal.replace({pd.NaT: None}, inplace=True)
        dfFinal = dfFinal.where(pd.notnull(dfFinal), None)
        # Guardar el archivo de salida en el servidor
        output_path = os.path.join(app.config["DOWNLOAD_FOLDER"], output_filename)
        dfFinal.to_excel(output_path, index=False)
        
        # Inicia un hilo para eliminar los archivos después de un tiempo
        threading.Thread(target=delayed_delete, args=(file_path, output_path)).start()
        
        response = send_file(output_path, as_attachment=True, download_name=output_filename)
        response.headers["Access-Control-Allow-Origin"] = "*"  
        response.headers["Content-Disposition"] = f'attachment; filename="{output_filename}"'  # 👈 Enviar el nombre del archivo
        return response
    elif (extension == "txt") :
        print("entro en txt")
        print(record_id)
        print(customer_id)
        print(file_path)
        output_filename, dfFinal, firstLineTxt = generate_.generateFileByFileTXT()
        # Guardar el archivo de salida en el servidor
        output_path = os.path.join(app.config["DOWNLOAD_FOLDER"], output_filename)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            if firstLineTxt != "" :
                f.write(firstLineTxt + '\n')  # Escribe cada valor en una nueva línea
            for index, row in dfFinal.iterrows():
                f.write(str(row["txt"]) + '\n')  # Escribe cada valor en una nueva línea
        
        # # Inicia un hilo para eliminar los archivos después de un tiempo
        threading.Thread(target=delayed_delete, args=(file_path, output_path)).start()
        
        response = send_file(output_path, as_attachment=True, download_name=output_filename)
        response.headers["Access-Control-Allow-Origin"] = "*"  
        response.headers["Content-Disposition"] = f'attachment; filename="{output_filename}"'  # 👈 Enviar el nombre del archivo
        return response
        # return jsonify({"message": "Archivo generado exitosamente"}), 200
    

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
