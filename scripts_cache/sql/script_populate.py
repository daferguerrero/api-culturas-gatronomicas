import uuid
import random
import string


def generar_nombre(prefix="city_", longitud_min=5, longitud_max=20):
    longitud_sufijo = random.randint(longitud_min, longitud_max)
    caracteres = string.ascii_letters
    sufijo_aleatorio = ''.join(random.choices(caracteres, k=longitud_sufijo))

    return f"{prefix}{sufijo_aleatorio}"


def generar_random_description():
    longitud_sufijo = random.randint(5, 100)
    caracteres = string.ascii_letters
    sufijo_aleatorio = ''.join(random.choices(caracteres, k=longitud_sufijo))

    return f"{sufijo_aleatorio}"


def generar_url(prefix="city_", longitud_min=5, longitud_max=20):
    longitud_sufijo = random.randint(longitud_min, longitud_max)
    caracteres = string.ascii_letters
    sufijo_aleatorio = ''.join(random.choices(caracteres, k=longitud_sufijo))

    return f"http://{prefix}{sufijo_aleatorio}.com"


def generar_random_date():
    year = random.randint(1900, 2021)
    month = random.randint(1, 12)
    day = random.randint(1, 28)
    return f"{year}-{month}-{day}"


def generar_random_number():
    return random.randint(1, 10)


def generar_random_year():
    return random.randint(1900, 2021)


def generar_insert_sql(nombre_tabla, columnas, numero_insert, archivo_salida, prefix):
    """Genera sentencias INSERT en un archivo SQL."""
    with open(archivo_salida, 'w', encoding='utf-8') as archivo:
        for _ in range(numero_insert):
            valores = []
            for columna in columnas:
                column_value_generators = {
                    'id': lambda: f"'{uuid.uuid4()}'",
                    'name': lambda: f"'{generar_nombre(prefix)}'",
                    'url': lambda: f"'{generar_url(prefix)}'",
                    'date': lambda: f"'{generar_random_date()}'",
                    'number': lambda: f"'{generar_random_number()}'",
                    'year': lambda: f"'{generar_random_year()}'",
                    "mainImage": lambda: f"'{generar_url(prefix)}'",
                    "description": lambda: f"'{generar_random_description()}'",
                    "type": lambda: f"'{generar_nombre(prefix)}'",
                    "photo": lambda: f"'{generar_url(prefix)}'",
                    "preparation": lambda: f"'{generar_random_description()}'",
                    "video": lambda: f"'{generar_url(prefix)}'",
                    "michelinStars": lambda: f"'{generar_random_number()}'",
                    "achievementDate": lambda: f"'{generar_random_date()}'",
                }

                valor = column_value_generators.get(columna, lambda: "'valor_por_defecto'")()
                valores.append(valor)
            #TODO ajuste para generar script para restaurantes
            #lista_con_comillas = ['"' + str(elemento) + '"' for elemento in columnas]
            #columnas_str = ", ".join(lista_con_comillas)
            columnas_str = ", ".join(columnas)
            valores_str = ", ".join(valores)
            sentencia = f"INSERT INTO {nombre_tabla} ({columnas_str}) VALUES ({valores_str});\n"
            archivo.write(sentencia)
    print(f"Archivo '{archivo_salida}' generado con {numero_insert} sentencias INSERT.")


def parse_arguments():
    import argparse

    parser = argparse.ArgumentParser(description='Generar sentencias INSERT en un archivo SQL.')
    parser.add_argument('nombre_tabla', type=str, help='Nombre de la tabla.')
    parser.add_argument('columnas', type=str, help='Columnas de la tabla separadas por comas.')
    parser.add_argument('numero_insert', type=int, help='Número de sentencias INSERT a generar.')

    return parser.parse_args()


if __name__ == "__main__":
    args = parse_arguments()

    NOMBRE_TABLA = args.nombre_tabla or "city_entity"
    COLUMNAS = args.columnas.split(',') or ["id", "name"]
    NUMERO_INSERT = args.numero_insert or 100
    ARCHIVO_SALIDA = f"scripts_cache/sql/inserts_{NOMBRE_TABLA}.sql"
    PREFIX = NOMBRE_TABLA.split('_')[0] + '_'

    if "id" not in COLUMNAS:
        COLUMNAS.insert(0, "id")

    generar_insert_sql(NOMBRE_TABLA, COLUMNAS, NUMERO_INSERT, ARCHIVO_SALIDA, PREFIX)
