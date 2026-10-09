# Guía de Despliegue en Render (H2derm Tienda Oficial)

Todo el proyecto ya está preparado y configurado para desplegarse en **Render** sin configuraciones complejas.

---

### Opción 1: Despliegue Automático con Blueprint (Recomendada - 1 Clic)

Render detectará automáticamente el archivo `render.yaml` incluido en el repositorio:

1. Ve a [dashboard.render.com](https://dashboard.render.com/) e inicia sesión.
2. Haz clic en el botón **New +** y selecciona **Blueprint**.
3. Conecta tu repositorio de GitHub o GitLab donde subiste este código.
4. Render leerá automáticamente el archivo `render.yaml` y configurará:
   - **Nombre:** `h2derm-tienda-oficial`
   - **Entorno:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Health Check Path:** `/api/health`
5. Haz clic en **Apply** y tu tienda estará online en 2 minutos con certificado SSL HTTPS gratuito.

---

### Opción 2: Como Web Service (Node.js)

Si prefieres crearlo manualmente:

1. En el panel de Render, haz clic en **New +** ➔ **Web Service**.
2. Conecta tu repositorio.
3. Configura los siguientes campos:
   - **Name:** `h2derm-tienda-oficial`
   - **Language / Runtime:** `Node`
   - **Branch:** `main` (o tu rama por defecto)
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free`
4. En **Advanced**:
   - **Health Check Path:** `/api/health`
5. Haz clic en **Create Web Service**.

---

### Opción 3: Como Static Site (Sitio Estático)

Si sólo deseas servir el frontend estático:

1. En el panel de Render, haz clic en **New +** ➔ **Static Site**.
2. Conecta tu repositorio.
3. Configura:
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
4. En **Redirects / Rewrites**:
   - Añade una regla: Source `/*` ➔ Destination `/index.html` (Action: `Rewrite`)
5. Haz clic en **Create Static Site**.
