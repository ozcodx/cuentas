# 📊 Cuentas - Gestión de Contabilidad Personal

Aplicación web para llevar el control de tus finanzas personales día a día. Desarrollada con React, TypeScript y Firebase, con autenticación de Google para mantener tus datos seguros.

## 📱 Funcionalidades Principales

- Registro de transacciones diarias
- Categorización de gastos e ingresos
- Balance general
- Reportes mensuales
- Gráficos y estadísticas
- Exportación de datos

## ⚡️ Características

- Autenticación con Google
- Almacenamiento seguro en Firebase
- Registro de ingresos y gastos
- Categorización de transacciones
- Reportes y estadísticas
- Interfaz moderna y fácil de usar
- Diseño responsive

## 📁 Estructura del Proyecto

```
src/
├── components/     # Componentes reutilizables de la aplicación
│   ├── Main.tsx
│   └── NotFound.tsx
├── styles/        # Archivos CSS globales
│   └── App.css
├── pages/         # Páginas principales de la aplicación
├── services/      # Servicios de Firebase y Google Auth
├── types/         # Tipos de TypeScript
├── hooks/         # Hooks personalizados
├── utils/         # Utilidades y helpers
└──  App.tsx        # Configuración de rutas
```

## 🚀 Inicio Rápido

1. **Clona el repositorio**
```bash
git clone [URL_DEL_REPO]
cd cuentas
```

2. **Instala las dependencias**
```bash
npm install
```

3. **Configura las variables de entorno**
```bash
cp .env.example .env
```
Edita el archivo `.env` con tus credenciales de Firebase y Google Auth

4. **Inicia el servidor de desarrollo**
```bash
npm run dev
```

## 📦 Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm run preview`: Vista previa de la build de producción
- `npm run deploy`: Despliega la aplicación en Firebase Hosting

## 🔧 Configuración de Firebase y Google Auth

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com)
2. Copia las credenciales en tu archivo `.env`
3. Instala Firebase CLI: `npm install -g firebase-tools`
4. Inicia sesión: `firebase login`
5. Inicializa Firebase: `firebase init`
6. Habilita Authentication con Google
7. Configura Cloud Firestore
8. Copia las credenciales en tu archivo `.env`
9. Configura las reglas de seguridad en Firestore

## Configuración del Proyecto

1. Crea un archivo `.env` en la raíz del proyecto y añade las variables de entorno necesarias
2. Modifica el archivo `firebase.json` y actualiza el campo "site" con el ID de tu proyecto de Firebase:
   ```json
   {
     "hosting": {
       "site": "tu-proyecto-id",
       // ... resto de la configuración
     }
   }
   ```
   Este paso es crucial para que Firebase Hosting sepa a qué proyecto debe desplegar tu aplicación.

## 📄 Licencia

MIT License - ver el archivo [LICENSE](LICENSE) para más detalles

---

Desarrollado por [OzCodeX](https://github.com/ozcodex)
