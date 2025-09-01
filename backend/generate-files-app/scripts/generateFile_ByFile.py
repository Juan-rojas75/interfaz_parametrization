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

            print(record_id_obj)
            print(customer_id)  

            # OBTENER INFO BASE
            cliente = mongo.find_one("customers", {"_id": customer_id})
            template = mongo.find_one("templates", {"_id": record_id_obj})
            dataTemplateAll = list(mongo.find_many_id("datatemplates", {"template": self.idTemplate} ))
            # Ordenar por index
            dataTemplateAll.sort(key=lambda x: x["index"])
            dataTemplate = [item for item in dataTemplateAll if item.get("first_line") == False]
            dataTemplateFirstLine = [item for item in dataTemplateAll if item.get("first_line") == True]

            # Procesar el archivo con pandas
            df = pd.read_excel(self.pathFile)
            data = df.to_dict(orient="records")

            dfFinal_data = []  # Lista para almacenar las filas formateadas

            # Recorrer filas del DataFrame original
            print(data, flush=True)
            print("-----", flush=True)
            for row in data:
                new_row = {}  # Diccionario para la nueva fila formateada
                rowTotal = ""
                for column in dataTemplate:
                    link_name = column["link_name"]
                    print(column, flush=True)
                    print("-----", flush=True)
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

            # Primera linea
            rowInit = ""
            # Agregar la primera linea si existe
            if len(dataTemplateFirstLine) > 0:
                
                for column in dataTemplateFirstLine:
                    link_name = column["link_name"]

                    value = "12"
                    if column["first_line"]:
                        if(column["type_calcule"] == "sum"):
                            value = "1"
                            # value = data[link_name].sum()
                        elif(column["type_calcule"] == "count"):
                            value = "2"
                            # value = data[link_name].count()
                    # Aplicar formateo según la configuración
                    formatted_value = self.format_value_txt(value, column)

                    # Guardar el valor formateado en la nueva fila
                    
                    rowInit = rowInit + str(formatted_value)
            
            output_path = f"{cliente['name']}_{template['name']}.txt"
            return output_path , dfFinal , rowInit

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
            if default is None:
                value = ""
            else:
                value = default
        if value == "nan":
            value = ""
            
        if field_type == "auto-number":
            self.count += 1
            value = self.count

        # Aplicar transformaciones de valor si existen
        if values_transform:
            for transform in values_transform:
                if str(value) == transform.get("default"):
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
        
        if value is None:
            value = ""
        if value == "nan":
            value = ""
        return value
    
    def format_value_txt(self, value, config):
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
        
        if value is None or value == "":
            if default is None:
                value = ""
            else:
                value = default
        if value == "nan":
            value = ""
            
        if field_type == "auto-number":
            self.count += 1
            value = self.count

        # Aplicar transformaciones de valor si existen
        if values_transform:
            for transform in values_transform:
                if str(value) == transform.get("default"):
                    value = transform.get("replace", value)

       # Convertir al tipo adecuado
        if field_type == "string" or field_type == "string-inverted":
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
                if field_type == "string-inverted":
                    # Tomar los últimos `length` caracteres
                    value = value[-length:]
                    if align == "left":
                        value = value.ljust(length, fill_char)
                    elif align == "right":
                        value = value.rjust(length, fill_char)
                    elif align == "center":
                        value = value.center(length, fill_char)
                else:
                    # Tomar los primeros `length` caracteres
                    value = value[:length]
                    if align == "left":
                        value = value.ljust(length, fill_char)
                    elif align == "right":
                        value = value.rjust(length, fill_char)
                    elif align == "center":
                        value = value.center(length, fill_char)

                    
        return value

