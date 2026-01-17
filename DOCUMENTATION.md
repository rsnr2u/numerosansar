# Numerology Project Documentation

## 1. Project Overview
This project is a comprehensive **Full-Stack Numerology Application** designed to perform various numerology calculations and manage client data. It features a modern, responsive frontend built with **Next.js** and a robust backend API powered by **CodeIgniter 4**.

The application includes modules for:
- **Name Numerology**: Calculating numbers based on names using Chaldean and Pythagorean systems.
- **Business Numerology**: Evaluating business names for auspiciousness.
- **Mobile Numerology**: analyzing mobile phone numbers.
- **Vehicle Numerology**: Checking vehicle registration numbers.
- **Client Management**: A dedicated admin panel to manage registered clients and their history of checks.
- **System Configuration**: Admin tools to manage letter values, planet meanings, and number meanings.

## 2. Technology Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State/Data**: React Hooks
- **PDF Generation**: jsPDF
- **Excel Export**: XLSX

### Backend
- **Framework**: [CodeIgniter 4](https://codeigniter.com/)
- **Language**: PHP 8.1+
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens) via `firebase/php-jwt`

## 3. Directory Structure

```
/ (Root)
├── backend/            # CodeIgniter 4 Backend Application
│   ├── app/            # Application Logic (Controllers, Models, Config)
│   ├── public/         # Publicly accessible folder (index.php)
│   ├── tests/          # Unit tests
│   ├── writable/       # Logs, cache, and uploads
│   ├── .env            # Environment configuration (Database, URLs)
│   └── spark           # CI4 Command Line Tool
│
└── frontend/           # Next.js Frontend Application
    ├── src/
    │   ├── app/        # App Router Pages & Layouts
    │   │   ├── admin/  # Admin Panel Routes
    │   │   └── ...     # Public Routes
    │   ├── components/ # Reusable React Components
    │   └── lib/        # Utility functions (API clients, formatting)
    ├── public/         # Static Assets (Images, Icons)
    └── package.json    # Dependencies and Scripts
```

## 4. Setup and Installation

### Prerequisites
- **Node.js**: v18 or higher
- **PHP**: v8.1 or higher
- **Composer**: Dependency Manager for PHP
- **MySQL**: Database Server

### Backend Setup
1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Install PHP dependencies:
    ```bash
    composer install
    ```
3.  Configure Environment:
    - Copy `env` to `.env`.
    - Set your database credentials (`database.default.hostname`, `database.default.database`, `database.default.username`, `database.default.password`).
    - Set the `app.baseURL` (e.g., `http://localhost:8080/`).
4.  Run Migrations (to set up the database schema):
    ```bash
    php spark migrate
    ```
5.  Start the Development Server:
    ```bash
    php spark serve
    ```
    The backend API will be available at `http://localhost:8080`.

### Frontend Setup
1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install Node.js dependencies:
    ```bash
    npm install
    ```
3.  Configure Environment:
    - Ensure the API base URL matches your backend server (usually configured in a `.env.local` or environment config file if applicable, or hardcoded in `src/lib/api.ts` or similar).
4.  Start the Development Server:
    ```bash
    npm run dev
    ```
    The frontend application will be available at `http://localhost:3000`.

## 5. Key Features & Modules

### Admin Panel (`/admin`)
-   **Dashboard**: Overview of system statistics (Total Clients, Checks, etc.).
-   **Check Numerology**: Tools to perform quick checks for generic inputs.
-   **Clients**: Full CRUD for clients. View history of Name, Mobile, and Vehicle checks for each client.
-   **Business Numerology**: dedicated tool for analyzing business names.
-   **Mobile Numerology**: Analyze mobile numbers with detailed status tracking.
-   **Vehicle Numerology**: Check vehicle numbers for compatibility.
-   **Compounds**: Manage meanings for compound numbers (10-99).
-   **Settings**: Global app settings (e.g., default calculation values).

### Numerology Logic
-   **Chaldean System**: default mapping for letters to numbers.
-   **Pythagorean System**: Alternative mapping supported.
-   **Calculations**: Includes Life Path, Destiny, Soul Urge, and Personality numbers.

## 6. API Endpoints Overview
The backend provides a RESTful API under the `api/` prefix.

-   `POST /api/login`: Admin authentication.
-   `POST /api/calculate`: General numerology calculation.
-   `GET /api/meanings/{number}`: Retrieve meaning for a specific number.
-   `GET /api/admin/clients`: List all clients.
-   `GET /api/admin/clients/{id}/history`: Get checking history for a client.
-   `POST /api/admin/business-numerology/check`: Perform business check.
-   `POST /api/admin/mobile-numerology/check`: Perform mobile check.

## 7. Database Schema Highlights
-   **clients**: Stores client personal info (Name, DOB, Time of Birth, Gender, etc.).
-   **numerology_check_records**: Stores history of general name checks.
-   **client_mobile_checks**: Stores history of mobile number analyses.
-   **settings**: Stores application-wide configuration.
-   **auspicious_numbers**: Lists lucky numbers for reference.

---
*Created by Antigravity*
