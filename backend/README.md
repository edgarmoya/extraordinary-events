# Backend: Hechos Extraordinarios

Este proyecto es una API creada con Django que proporciona información sobre hechos extraordinarios, permitiendo realizar operaciones CRUD sobre los datos.

## Requisitos
* Python 3.11.7
* PostgreSQL 14 o superior
* Locale ``es_ES.utf8`` (para asegurar que la configuración regional de España esté disponible en el sistema)

## Instalación local
Sigue estos pasos para configurar y ejecutar el proyecto Django:

1. **Clona el repositorio**
Primero, clona el repositorio de GitHub a tu máquina local:

    ```bash
    git clone https://gitlab.azcuba.cu/python/hechos-extraordinarios-nuevo.git
    cd hechos-extraordinarios-nuevo
    cd backend
    ```

2. **Crea un entorno virtual**
Es recomendable crear un entorno virtual para aislar las dependencias:

    ```bash
    sudo apt install python3-pip
    sudo apt install python3.11-venv
    python3.11 -m venv venv
    source venv/bin/activate  # En Windows usa venv\Scripts\activate
    ```
3. **Instala las dependencias**
Con el entorno virtual activado, instala todas las dependencias necesarias:

    ```bash
    pip install -r requirements.txt
    ```

4. **Configura el locale es_ES.utf8**
Es necesario tener el locale es_ES.utf8 instalado en el sistema. Si no lo tienes, sigue estos pasos:

    En sistemas Linux (Debian/Ubuntu):
    Ejecuta el siguiente comando para generar el locale:

    ```bash
    sudo locale-gen es_ES.UTF-8
    ```

    Luego, actualiza la configuración de los locales:

    ```bash
    sudo update-locale
    ```

5. **Configura la base de datos**
Configura la base de datos en el archivo ``config/settings.py`` de Django. Si usas PostgreSQL, asegúrate de haber creado una base de datos y modifica las credenciales de conexión:

    ```python
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql_psycopg2',
            'NAME': 'nombre_de_tu_base_de_datos',
            'USER': 'usuario',
            'PASSWORD': 'contraseña',
            'HOST': 'localhost',
            'PORT': '5432',
        }
    }
    ```

6. **Realiza las migraciones**
Aplica las migraciones para crear las tablas en la base de datos:

    ```bash
    python manage.py migrate
    ```

7. **Cargar datos**
Los datos de las provincias, municipios, grados y roles se pueden cargar en la base de datos, puedes hacerlo con el siguiente comando:

    ```bash
    python manage.py loaddata apps/locations/fixtures/provinces.json
    python manage.py loaddata apps/locations/fixtures/municipality.json
    python manage.py loaddata apps/grades/fixtures/grades.json
    ```

8. **Crea un superusuario**
Para acceder al panel de administración de Django, crea un superusuario con el siguiente comando:

    ```bash
    python manage.py createsuperuser
    ```

    Sigue las instrucciones en pantalla para definir el nombre de usuario, correo electrónico y contraseña.

9. **Ejecuta el servidor**
Inicia el servidor de desarrollo de Django:

    ```bash
    python manage.py runserver
    ```

    La API estará disponible en http://127.0.0.1:8000/ y la documentación en http://127.0.0.1:8000/docs/