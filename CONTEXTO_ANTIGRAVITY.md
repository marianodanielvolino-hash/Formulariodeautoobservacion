# Contexto de Proyecto: Formulario de Autoobservación 360° (Fullstack)

Este documento fue generado para **preservar el contexto** de la instancia de trabajo y permitir que otra sesión de **Antigravity** o cualquier agente de IA pueda entender rápidamente el estado del proyecto, la arquitectura y las decisiones tomadas hasta el momento.

---

## 1. Objetivo del Proyecto
Se construyó un sistema **Fullstack** diseñado para recolectar datos a través de un extenso Formulario de Autoobservación 360°. El sistema cuenta con:
*   Un **Frontend interactivo** que guarda borradores localmente (`localStorage`).
*   Un **Backend robusto** desarrollado en Node.js y Express.
*   Una conexión a **Base de Datos** mediante Supabase (PostgreSQL), donde se guarda el JSON completo de cada respuesta.
*   Un **Panel de Administración** (`/admin.html`) protegido por un token de acceso, para visualizar, eliminar y exportar las respuestas recopiladas a un archivo `.json`.

---

## 2. Arquitectura y Estructura de Archivos

El proyecto se encuentra en `c:\Users\Mariano Volino\OneDrive\Escritorio\Formularios` y sigue esta estructura:

```text
Formularios/
├── public/                 # Archivos estáticos servidos por Express
│   ├── index.html          # Frontend oficial (Yo Real-Actual). Contiene estilos, html y el JS para enviar al backend.
│   ├── admin.html          # Vista del Panel de Administración.
│   ├── css/style.css       # Estilos globales (aplica al panel de admin y vistas base).
│   ├── js/admin.js         # Lógica del Panel de Administración (fetches al backend, verificación de token).
│   └── js/main.js          # (Mantenido por legacy, aunque index.html maneja su propia lógica internamente).
├── src/                    # Código fuente del backend
│   ├── server.js           # Archivo de entrada del servidor Express. Define middlewares estáticos y carga rutas.
│   ├── db.js               # Configuración del cliente Supabase usando @supabase/supabase-js y variables de entorno.
│   └── routes/
│       └── api.js          # Controladores (Rutas): POST /respuestas, GET /respuestas, DELETE /respuestas/:id, GET /exportar.
├── .env                    # (IGNORADO EN GIT) Credenciales locales: SUPABASE_URL, SUPABASE_KEY, ADMIN_TOKEN, PORT.
├── .gitignore              # Ignora node_modules, .env, y bases de datos locales.
├── package.json            # Dependencias: express, @supabase/supabase-js, dotenv.
└── README.md               # Documentación pública sobre instalación del proyecto.
```

---

## 3. Decisiones de Desarrollo y Estado Actual

*   **Integración Frontend-Backend:** El archivo HTML original del cliente (`formulario_yo_real_actual_corregido_html (1).html`) se renombró y movió a `public/index.html`. Se le inyectó una función `submitData()` asíncrona que hace un `POST` al endpoint `/api/respuestas`, tomando todo el objeto `collectData()` y enviándolo en el body.
*   **Modelo de Datos:** Dado que el formulario es extenso y dinámico, se optó por guardar toda la información estructurada como un objeto en una columna tipo `JSONB` en la tabla `respuestas` de Supabase.
*   **Seguridad:** Las rutas críticas del backend (GET/DELETE/EXPORTAR) están protegidas en `api.js` por el middleware `adminAuth`, el cual lee el `ADMIN_TOKEN` desde las variables de entorno (`.env`) y requiere que este venga en los headers (`Authorization: Bearer <token>`).
*   **Control de Versiones:** Todo el código actual ya está en un repositorio remoto de GitHub (`https://github.com/marianodanielvolino-hash/Formulariodeautoobservacion.git`) en la rama `main`.
*   **Despliegue:** Hay un archivo `vercel.json` presente en la raíz de la carpeta, por lo que la arquitectura actual (Node + public dir) puede ser fácilmente desplegada en Vercel.

---

## 4. Instrucciones para la nueva instancia de Antigravity (Agente)

Si necesitas continuar el trabajo, ten en cuenta lo siguiente:
1.  **Levantar el entorno local:** Para iniciar, revisa que existan las dependencias (`npm install`). Ejecuta el backend localmente usando `node src/server.js` (o `npm start`). El proyecto corre en `http://localhost:3000`.
2.  **Archivos Sensibles:** Verifica que el usuario tenga su archivo `.env` configurado. Supabase necesita credenciales activas para no dar error en `db.js`.
3.  **Próximos pasos posibles:** Las siguientes iteraciones pueden involucrar estilos del panel de administración, validaciones de los datos antes del submit, o ajustar el sistema de exportación PDF / Dashboard de métricas a partir del JSON que retorna la API.

```json
// Ejemplo del payload que envía index.html
{
  "coachee": "Pedro Thompson",
  "coach": "Juan",
  "fecha": "2026-05-13",
  "etapa": "Yo Real-Actual",
  "respuestas": {
    "satisfaccion_general_score": "7",
    "pulso_datos": "...",
    "etc": "..."
  }
}
```
