![PHP](https://img.shields.io/badge/php-%23777BB4.svg?style=for-the-badge&logo=php&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Laravel](https://img.shields.io/badge/laravel-%23FF2D20.svg?style=for-the-badge&logo=laravel&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)

# Kiroku - Sistema de Gestión de Activos

Un sistema web moderno y robusto para la gestión del ciclo de vida de los activos de hardware y su mantenimiento dentro de una organización. Construido con Laravel 12, React (TypeScript) e Inertia.js.

-----

## Índice

1.  [Descripción](https://www.google.com/search?q=%23Descripci%C3%B3n)
2.  [Funcionalidades Principales](https://www.google.com/search?q=%23Funcionalidades-Principales)
3.  [Instalación y Puesta en Marcha](https://www.google.com/search?q=%23Instalaci%C3%B3n-y-Puesta-en-Marcha)
4.  [Estructura del Proyecto](https://www.google.com/search?q=%23Estructura-del-Proyecto)
5.  [Tecnologías Utilizadas](https://www.google.com/search?q=%23Tecnolog%C3%ADas-Utilizadas)
6.  [Autor](https://www.google.com/search?q=%23Autor)
7.  [Licencia](https://www.google.com/search?q=%23Licencia)

-----

## Descripción

**Kiroku** es una aplicación web diseñada para centralizar y optimizar la gestión de activos de TI (hardware) de una organización. Permite un seguimiento detallado del ciclo de vida de cada dispositivo, desde su adquisición hasta su mantenimiento y eventual desecho.

El sistema está diseñado para roles específicos (Administrador, Agente Técnico, Supervisor de TI), asegurando un control de acceso granular y una interfaz de usuario productiva construida como una SPA (Single Page Application) moderna.

-----

## Funcionalidades Principales

  * **Gestión de Inventario (CRUD):** Administración completa de dispositivos (`Devices`), incluyendo sus marcas, modelos y categorías.
  * **Seguimiento de Mantenimiento:** Registro de mantenimientos preventivos y correctivos para cada activo.
  * **Gestión de Fallas:** Reporte y seguimiento de fallas de dispositivos.
  * **Pista de Auditoría (Audit Log):** Un sistema de auditoría robusto que rastrea automáticamente las creaciones, actualizaciones y eliminaciones en modelos clave, así como los inicios de sesión (`Login`).
  * **Gestión de Roles y Permisos:** Uso de `spatie/laravel-permission` para un control de acceso detallado.
  * **Multi-Tenancy (Organizaciones):** Los usuarios y activos están vinculados a organizaciones (`Organizations`).
  * **Experiencia SPA:** Interfaz de usuario reactiva construida con React, TypeScript e Inertia.js.

-----

## Instalación y Puesta en Marcha

Para ejecutar este proyecto en tu entorno local, sigue estos pasos:

### Requisitos Previos

  * PHP \>= 8.2
  * Composer
  * Node.js & npm
  * Docker (Recomendado)
  * Una base de datos (MySQL, PostgreSQL, etc.)

### Pasos de Instalación (Local)

1.  **Clonar el repositorio:**

    ```bash
    git clone https://github.com/joseenrique61/kiroku.git
    cd kiroku
    ```

2.  **Instalar dependencias:**

    ```bash
    # Backend (PHP)
    composer install

    # Frontend (JavaScript)
    npm install
    ```

3.  **Configurar el entorno:**
    Crea tu archivo de configuración y genera la clave de la aplicación.

    ```bash
    cp .env.example .env
    php artisan key:generate
    ```

    *No olvides actualizar las credenciales de la base de datos (`DB_*`) y la `APP_URL` en tu archivo `.env`.*

4.  **Preparar la base de datos:**
    Ejecuta las migraciones para crear las tablas y los seeders para poblarlas con datos de prueba.

    ```bash
    php artisan migrate --seed
    ```

5.  **Ejecutar el proyecto:**
    Abre dos terminales y ejecuta los siguientes comandos:

    ```bash
    # Terminal 1: Servidor de Laravel
    php artisan serve

    # Terminal 2: Compilador de Vite
    npm run dev
    ```

¡Listo\! Ahora puedes acceder a la aplicación desde `http://localhost:8000`.

### Instalación (Docker)

El proyecto incluye una configuración de Docker Compose para desarrollo.

1.  **Clonar y configurar el `.env`:**

    ```bash
    git clone https://github.com/joseenrique61/kiroku.git
    cd kiroku
    cp .env.docker.development .env
    ```

    *(Asegúrate de que los puertos y servicios en `.env` no entren en conflicto con otros servicios locales)*.

2.  **Construir y levantar los contenedores:**

    ```bash
    docker-compose -f compose.dev.yaml up -d --build
    ```

3.  **Instalar dependencias (dentro del contenedor):**

    ```bash
    docker-compose -f compose.dev.yaml exec app composer install
    docker-compose -f compose.dev.yaml exec app npm install
    ```

4.  **Ejecutar migraciones y seeders (dentro del contenedor):**

    ```bash
    docker-compose -f compose.dev.yaml exec app php artisan key:generate
    docker-compose -f compose.dev.yaml exec app php artisan migrate --seed
    ```

La aplicación estará disponible en `http://localhost` (o el puerto que hayas configurado en tu `.env`).

-----

## Tecnologías Utilizadas

Este proyecto combina un robusto backend en PHP con un frontend moderno y reactivo.

| Tecnología | Rol |
| :--- | :--- |
| **Laravel 12** | Framework backend para la lógica de negocio, rutas y seguridad. |
| **React + TypeScript** | Biblioteca para construir la interfaz de usuario con tipado estático. |
| **Inertia.js** | Conector que permite crear una SPA sin necesidad de una API REST. |
| **Docker** | Plataforma de contenedores para un entorno de desarrollo y despliegue consistente. |
| **Spatie/Permission** | Manejo de roles y permisos en el backend. |
| **Laravel Fortify** | Lógica de autenticación de backend. |
| **Tailwind CSS** | Framework CSS (base para los componentes de UI). |
| **Pest + PHPUnit** | Frameworks para Pruebas Unitarias y de Features. |
| **Ziggy** | Permite el uso de las rutas nombradas de Laravel en JavaScript. |

-----

## Estructura del Proyecto

La estructura del código está organizada para separar claramente las responsabilidades.

```bash
kiroku/
├── app/
│   ├── Http/Controllers/
│   │   ├── Admin/       # Controladores de admin (Users, Roles, Logs)
│   │   └── Inventory/   # Controladores del Core (Devices, Failures)
│   ├── Listeners/       # Listeners de eventos (Ej. LogSuccessfulLogin)
│   ├── Models/          # Modelos de Eloquent (Device, Maintenance, AuditLog)
│   └── Traits/          # Traits reusables (Ej. Auditable)
├── database/
│   ├── factories/       # Factories para testing y seeding
│   ├── migrations/      # Migraciones de la base de datos
│   └── seeders/         # Seeders para poblar la BD
├── resources/
│   ├── js/
│   │   ├── Pages/       # Componentes de página React (Vistas de Inertia)
│   │   ├── Layouts/     # Plantillas de diseño (AppLayout)
│   │   └── types/       # Definiciones de TypeScript
│   └── views/           # Vista raíz app.blade.php
├── routes/              # Definición de rutas (web.php, auth.php)
└── tests/
    └── Feature/         # Pruebas de la aplicación (Pest)
```

-----

## Autor

<img src="https://github.com/joseenrique61.png" width="100" alt="Foto de Jose">

**joseenrique61** — Ingeniero de Software

<img src="https://github.com/Arieloou.png" width="100" alt="Foto de Arielo">

**Arieloou** — Ingeniero de Software

-----

## Licencia

Este proyecto se distribuye bajo la **Licencia MIT**. Eres libre de usarlo, modificarlo y compartirlo.
