from bson import ObjectId
import pandas as pd

from datebase.datebase import MongoDB

mongo = MongoDB()

class GenerateFileByFile:
    def __init__(self, idTemplate, idCustomer, pathFile):
        self.idTemplate = idTemplate
        self.idCustomer = idCustomer
        self.pathFile = pathFile
        self.count = 0
    
    def generateFileByFileExcel(self):
        try:
            record_id_obj = ObjectId(self.idTemplate)  
            customer_id = ObjectId(self.idCustomer)  

            # OBTENER INFO BASE
            cliente = mongo.find_one("customers", {"_id": customer_id})
            template = mongo.find_one("templates", {"_id": record_id_obj})
            dataTemplate = list(mongo.find_many_id("datatemplates", {"template": self.idTemplate}))
            # Ordenar por index
            dataTemplate.sort(key=lambda x: x["index"])

            # Procesar el archivo con pandas
            df = pd.read_excel(self.pathFile)
            data = df.to_dict(orient="records")

            dfFinal_data = []  # Lista para almacenar las filas formateadas

            # Recorrer filas del DataFrame original
            for row in data:
                new_row = {}  # Diccionario para la nueva fila formateada
                for column in dataTemplate:
                    column_name = column["name"]
                    link_name = column["link_name"]

                    # Obtener el valor original de la fila o None si no existe
                    original_value = row.get(link_name, None)

                    # Aplicar formateo según la configuración
                    formatted_value = self.format_value(original_value, column)

                    # Guardar el valor formateado en la nueva fila
                    new_row[column_name] = formatted_value

                dfFinal_data.append(new_row)  # Agregar la nueva fila a la lista

            # Convertir la lista de diccionarios en DataFrame
            dfFinal = pd.DataFrame(dfFinal_data)

            output_path = f"{cliente['name']}_{template['name']}.xlsx"
            return output_path , dfFinal

        except Exception as e:
            print("Error:", e)
            
    def generateFileByFileTXT(self):
        try:
            record_id_obj = ObjectId(self.idTemplate)  
            customer_id = ObjectId(self.idCustomer)  

            # OBTENER INFO BASE
            cliente = mongo.find_one("customers", {"_id": customer_id})
            template = mongo.find_one("templates", {"_id": record_id_obj})
            dataTemplate = list(mongo.find_many_id("datatemplates", {"template": self.idTemplate}))
            # Ordenar por index
            dataTemplate.sort(key=lambda x: x["index"])

            print("ENTRA A TXT")
            # Procesar el archivo con pandas
            df = pd.read_excel(self.pathFile)
            data = df.to_dict(orient="records")

            dfFinal_data = []  # Lista para almacenar las filas formateadas

            # Recorrer filas del DataFrame original
            for row in data:
                print(row)
                new_row = {}  # Diccionario para la nueva fila formateada
                rowTotal = ""
                for column in dataTemplate:
                    link_name = column["link_name"]

                    # Obtener el valor original de la fila o None si no existe
                    original_value = row.get(link_name, "")

                    # Aplicar formateo según la configuración
                    formatted_value = self.format_value_txt(original_value, column)

                    # Guardar el valor formateado en la nueva fila
                    
                    rowTotal = rowTotal + str(formatted_value)
                new_row["txt"] = rowTotal
                dfFinal_data.append(new_row)  # Agregar la nueva fila a la lista
            # Convertir la lista de diccionarios en DataFrame
            dfFinal = pd.DataFrame(dfFinal_data)
            
            output_path = f"{cliente['name']}_{template['name']}.txt"
            return output_path , dfFinal

        except Exception as e:
            print("Error:", e)
    def format_value(self,value, config):
        """
        Formatea un valor según la configuración dada.

        :param value: El valor original del campo.
        :param config: Diccionario con la configuración del campo.
        :return: Valor formateado según la configuración.
        """
        # Obtener configuración
        length = config.get("length", None)
        field_type = config.get("type", "string")
        complete_with = config.get("complete_with", "space")
        align = config.get("align", "left")
        values_transform = config.get("valuesTransform", [])
        default = config.get("default", "")
        
        
        if value is None:
            value = default
        if value is "nan":
            value = ""
            
        if field_type == "auto-number":
            self.count += 1
            value = self.count

        print(values_transform)
        # Aplicar transformaciones de valor si existen
        if values_transform:
            for transform in values_transform:
                print("Valor original:", value)
                print("Transformación default:", transform.get("default"))
                print("Transformación replace:", transform.get("replace"))
                if value == transform.get("default"):
                    value = transform.get("replace", value)

    
        # Convertir al tipo adecuado
        if field_type == "string":
            value = str(value)
        elif field_type == "number":
            if isinstance(value, (int, float)):  # Verifica si ya es número
                value = value  # No hacer nada, ya es correcto
            else:
                try:
                    value = int(value) if str(value).isdigit() else 0
                except Exception as e:
                    print(f"Error convirtiendo el valor: {value}. Error: {e}")
                    value = 0  # Valor por defecto en caso de error
        elif field_type == "float":
            value = float(value) if str(value).replace(".", "").isdigit() else 0.0
        elif field_type == "date":
            format_date = config.get("format_date", "%Y-%m-%d")
            try:
                value = pd.to_datetime(value).strftime(format_date)
            except Exception as e:
                print(f"Error convirtiendo el valor: {value}. Error: {e}")
                value = None
                
        # Aplicar longitud y alineación
        if length:
            if complete_with == "space":
                fill_char = " "
            elif complete_with == "zero":
                fill_char = "0"
            else:
                fill_char = complete_with

            if field_type != "date" and field_type != "number" and field_type != "auto-number":
                value = value[:length]
                if align == "left":
                    value = value.ljust(length, fill_char)
                elif align == "right":
                    value = value.rjust(length, fill_char)
                elif align == "center":
                    value = value.center(length, fill_char)
            
        return value
    
    def format_value_txt(self, value, config):
        """
        Formatea un valor según la configuración dada.

        :param value: El valor original del campo.
        :param config: Diccionario con la configuración del campo.
        :return: Valor formateado según la configuración.
        """
        # Obtener configuración
        length = config.get("length", None)  # Longitud máxima del campo
        field_type = config.get("type", "string")  # Tipo de dato
        complete_with = config.get("complete_with", "space")  # Caracter de relleno
        align = config.get("align", "left")  # Alineación
        values_transform = config.get("valuesTransform", [])  # Transformaciones de valores
        default = config.get("default", "")  # Valor por defecto

        # Asignar valor por defecto si es None
        if value is None:
            value = default
        
            
        # Aplicar transformaciones de valor si existen
        if values_transform:
            for transform in values_transform:
                if value == transform.get("default"):
                    value = transform.get("replace", value)

        # Convertir el valor al tipo adecuado
        if field_type == "string":
            value = str(value)
        elif field_type == "number":
            value = str(int(value)) if str(value).isdigit() else "0"
        elif field_type == "float":
            value = f"{float(value):.2f}" if str(value).replace(".", "").isdigit() else "0.00"

        # Determinar el caracter de relleno
        fill_char = " " if complete_with == "space" else "0"

        # Aplicar longitud y alineación
        if length:
            value = value[:length]  # Recortar si es más largo
            if align == "left":
                value = value.ljust(length, fill_char)
            elif align == "right":
                value = value.rjust(length, fill_char)
            elif align == "center":
                value = value.center(length, fill_char)

        return value

