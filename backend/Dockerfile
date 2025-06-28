# --- /hechos-extraordinarios-nuevo/backend/Dockerfile ---

# Utiliza una imagen base de Python oficial
FROM python:3.11-slim-buster

# Configuración de locale para es_ES.UTF-8
RUN apt-get update && apt-get install -y locales \
    && sed -i -e 's/# es_ES.UTF-8 UTF-8/es_ES.UTF-8 UTF-8/' /etc/locale.gen \
    && dpkg-reconfigure --frontend=noninteractive locales \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Establecer variables de entorno para el locale
ENV LANG es_ES.UTF-8
ENV LANGUAGE es_ES:es
ENV LC_ALL es_ES.UTF-8

# Instala las dependencias de compilación de PostgreSQL y otras necesarias (si todavía las necesitas para psycopg2)
# Si estás usando psycopg2-binary, estas líneas de gcc, etc., podrían no ser estrictamente necesarias
# pero no harán daño y pueden ser útiles para otras dependencias.
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    python3-dev \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de requisitos e instala las dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia el resto de los archivos de la aplicación backend al directorio de trabajo
COPY . .

# Exponer el puerto en el que se ejecutará Gunicorn
EXPOSE 8000

# Comando para ejecutar la aplicación con Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "config.wsgi:application"]