# Formulario de Autoobservación (Fullstack)

Este proyecto es una aplicación fullstack diseñada para la recolección de datos mediante un formulario, con capacidades de guardado automático en local (drafts) y un panel de administración seguro para gestionar la información recopilada.

## 🚀 Características Principales

*   **Formulario Dinámico Frontend:** Interfaz de usuario amigable para enviar respuestas.
*   **Guardado en Borrador (Local Storage):** Evita la pérdida de datos si el usuario cierra el navegador o recarga la página antes de enviar el formulario.
*   **Panel de Administración Seguro:** Acceso restringido mediante autenticación basada en tokens, que permite:
    *   Ver todas las respuestas enviadas.
    *   Eliminar registros.
    *   Exportar los datos recopilados en formato JSON.
*   **Backend Robusto:** Desarrollado con Node.js y Express.js.
*   **Base de Datos SQLite:** Almacenamiento local, ligero y fácil de configurar para los datos del formulario.

## 🛠️ Tecnologías Utilizadas

*   **Frontend:** HTML5, CSS3, JavaScript (Vanilla).
*   **Backend:** Node.js, Express.js.
*   **Base de Datos:** SQLite.
*   **Autenticación:** JSON Web Tokens (JWT) / Tokens seguros de administrador.

## 📁 Estructura del Proyecto

```text
Formularios/
├── public/                 # Archivos estáticos servidos al cliente
│   ├── css/
│   │   └── style.css       # Estilos generales del formulario y panel
│   ├── js/
│   │   ├── main.js         # Lógica del formulario (envío, borradores)
│   │   └── admin.js        # Lógica del panel de control
│   ├── index.html          # Vista pública del formulario
│   └── admin.html          # Vista protegida del panel de administración
├── src/                    # Código fuente del servidor
│   ├── routes/
│   │   └── api.js          # Definición de rutas del API (envíos, admin, exportación)
│   ├── db.js               # Conexión e inicialización de SQLite
│   └── server.js           # Archivo principal de Express y configuración
├── database.sqlite         # Base de datos SQLite (Generada automáticamente - Ignorada en Git)
├── package.json            # Dependencias y scripts de Node.js
├── .env                    # Variables de entorno (Tokens, configuraciones)
├── .gitignore              # Archivos y carpetas omitidas en el control de versiones
└── README.md               # Documentación del proyecto
```

## ⚙️ Instalación y Uso Local

Sigue estos pasos para correr el proyecto en tu entorno local:

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/marianodanielvolino-hash/Formulariodeautoobservacion.git
    cd Formulariodeautoobservacion
    ```

2.  **Instalar las dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar Variables de Entorno:**
    Renombra o crea un archivo `.env` en la raíz del proyecto y define tu token secreto de administrador:
    ```env
    ADMIN_TOKEN=tu_token_secreto_aqui
    PORT=3000
    ```

4.  **Iniciar el Servidor:**
    ```bash
    npm start
    ```
    *(Alternativamente puedes usar `npm run dev` si tienes configurado nodemon).*

5.  **Acceder a la Aplicación:**
    *   **Formulario Público:** Abre tu navegador y ve a `http://localhost:3000`
    *   **Panel de Administración:** Ve a `http://localhost:3000/admin.html` (Te solicitará el Token configurado en el archivo `.env`).

## 🔒 Seguridad

*   La ruta del panel de administración está protegida del lado del cliente y las peticiones al API (borrar, exportar, listar) están resguardadas en el backend verificando el token provisto.
*   La base de datos SQLite y las credenciales del archivo `.env` se encuentran excluidas del repositorio gracias a `.gitignore`.
