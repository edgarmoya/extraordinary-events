# Frontend: Hechos Extraordinarios
Este es el frontend de la aplicación Hechos Extraordinarios desarrollado en React. La aplicación interactúa con el backend para mostrar los datos y resultados.

## Requisitos

Antes de comenzar, asegúrate de tener instalado lo siguiente en tu sistema:
* Node.js v22.12.0
* npm v10.9.0

## Instalación local
Para instalar y configurar el frontend de la aplicación, sigue los siguientes pasos:

1. **Clonar el repositorio**

    Si ya clonaste el proyecto para configurar el backend solo diríjase a la carpeta llamada ``frontend`` 

    Sino, clona el repositorio a tu máquina local:

    ```bash
    git clone https://gitlab.azcuba.cu/python/hechos-extraordinarios-nuevo.git
    cd hechos-extraordinarios-nuevo
    cd frontend
    ```

2. **Instalar dependencias**
Si ya se encuentra en el directorio del proyecto ejecuta el siguiente comando para instalar todas las dependencias necesarias:

    ```bash
    npm install
    ```

3. **Variables de entorno**
Configura las variables de entorno necesarias para la aplicación. Crea un archivo .env en la raíz del proyecto y define las variables de entorno necesarias:

    ```plaintext
    REACT_APP_BACKEND_URL=http://localhost:8000
    ```
    Asegúrate de cambiar http://localhost:8000 a la URL de tu backend si está en producción.

4. **Ejecutar la aplicación en desarrollo**
Una vez que las dependencias estén instaladas y las variables de entorno configuradas, puedes ejecutar la aplicación en modo desarrollo:

    ```bash
    npm start
    ```

    Esto iniciará un servidor de desarrollo y abrirá la aplicación en tu navegador. Normalmente, estará disponible en http://localhost:3000.