# Production Deployment Guide: Numero Sansar

Taking Numero Sansar from a local XAMPP environment to a live production server requires several critical steps to ensure security, performance, and reliability.

## 1. Backend Deployment (CodeIgniter 4)

### A. Environment Configuration
On your production server, navigate to the `backend/` directory and update the `.env` file:
*   **CI_ENVIRONMENT:** Change from `development` to `production`.
*   **app.baseURL:** Set this to your live API domain (e.g., `https://api.numerosansar.com/`).
*   **Database:** Update with your production MySQL credentials.
*   **Security:** Generate a strong secret key for `JWT_SECRET`.

### B. Directory Permissions
Ensure the `writable/` directory has write permissions for the web server (e.g., `www-data` on Ubuntu):
```bash
chmod -R 775 writable
chown -R www-data:www-data writable
```

### C. Public Folder Setup
Your domain's document root should point to the `backend/public/` folder, NOT the root `backend/` directory. This prevents access to your system files.

---

## 2. Frontend Deployment (Next.js)

Next.js requires a build step for production to optimize performance.

### A. Environment Variables
Create a `.env.production` file in the `frontend/` directory:
```env
NEXT_PUBLIC_API_URL=https://api.numerosansar.com
```

### B. Build & Run
Run the following commands in the `frontend/` directory:
```bash
npm install
npm run build
```
To keep the application running, it is recommended to use a process manager like **PM2**:
```bash
pm2 start npm --name "numero-sansar-frontend" -- start
```

---

## 3. Server Configuration (Nginx Example)

It is highly recommended to use **Nginx** as a reverse proxy for the frontend and a handler for the backend.

### Sample Nginx Config:
```nginx
server {
    listen 80;
    server_name numerosansar.com;

    # Frontend (Reverse Proxy to Next.js)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }

    # Backend API (CodeIgniter)
    location /api {
        alias /var/www/numersansar/backend/public;
        try_files $uri $uri/ /index.php?$query_string;

        location ~ \.php$ {
                include snippets/fastcgi-php.conf;
                fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        }
    }
}
```

---

## 4. Security Checklist

*   **SSL/TLS:** Use [Certbot (Let's Encrypt)](https://certbot.eff.org/) to enable HTTPS. This is mandatory for modern web apps.
*   **CORS:** In `backend/app/Config/Filters.php`, ensure your CORS policy only allows requests from your frontend domain.
*   **Database:** Disable remote root access to your MySQL server. Use a dedicated user with limited permissions.
*   **Error Reporting:** In production mode, CodeIgniter will hide detailed error messages from users, which is essential for security.

## 5. Deployment Options

1.  **Shared Hosting (CPanel):** Possible but not recommended for Next.js. Better for the PHP backend only.
2.  **VPS (DigitalOcean / AWS / Linode):** Recommended. Provides full control over the Next.js process and Nginx.
3.  **Vercel (Frontend) + VPS (Backend):** A popular modern choice. Deploy the frontend to Vercel and the backend to a dedicated server.

---
*For specific help with a particular host, please consult their technical documentation.*
