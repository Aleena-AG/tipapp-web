# Deployment Guide

## Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager
- Git for version control
- Docker and Docker Compose (optional, for containerized deployment)

## Environment Setup

1. Clone the repository:

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the root directory and set the following variables:
   - `VITE_API_BASE_URL`: Backend API URL
   - `VITE_FIREBASE_API_KEY`: Firebase API key
   - `VITE_FIREBASE_AUTH_DOMAIN`: Firebase auth domain
   - `VITE_FIREBASE_PROJECT_ID`: Firebase project ID
   - Other Firebase configuration variables as needed

## Building the Application

1. Build the application for production:
   ```bash
   npm run build
   ```
   This command will generate optimized production files in the `dist` directory.

## Running Locally (Development)

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:5173` (or the port specified in the console output).

## Previewing the Build

1. After building the application, preview the production build locally:
   ```bash
   npm run preview
   ```

2. Open your browser and navigate to `http://localhost:4173` (or the port specified in the console output).

## Docker Deployment

### Using Docker Compose (Recommended)

1. Ensure Docker and Docker Compose are installed on your system.

2. Create a `docker-compose.yml` file in the project root (if not already present):
   ```yaml
   version: '3.8'
   services:
     tipapp-fe:
       build: .
       ports:
         - "8080:80"
       environment:
         - NODE_ENV=production
   ```

3. Start the application:
   ```bash
   docker-compose up -d
   ```

4. The application will be available at `http://localhost:8080`.

5. To stop the application:
   ```bash
   docker-compose down
   ```

### Manual Docker Build

1. Build the Docker image:
   ```bash
   docker build -t tipapp-fe-users .
   ```

2. Run the container:
   ```bash
   docker run -p 8080:80 tipapp-fe-users
   ```

3. The application will be available at `http://localhost:8080`.

## Manual Deployment (Without Docker)

1. After running `npm run build`, the `dist` directory contains the production-ready files.

2. Serve the `dist` directory using a web server such as Nginx, Apache, or any static file server.

   ### Example with Nginx:

   - Install Nginx on your server.

   - Copy the contents of the `dist` directory to `/var/www/html` or your preferred web root directory.

   - Configure Nginx to serve the static files. Create or edit the configuration file (e.g., `/etc/nginx/sites-available/default`):
     ```nginx
     server {
         listen 80;
         server_name your-domain.com;
         root /var/www/html;
         index index.html;

         location / {
             try_files $uri $uri/ /index.html;
         }

         # Cache static assets
         location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
             expires 1y;
             add_header Cache-Control "public, immutable";
         }
     }
     ```

   - Test the configuration:
     ```bash
     sudo nginx -t
     ```

   - Restart Nginx:
     ```bash
     sudo systemctl restart nginx
     ```

3. The application will be accessible at your server's IP address or domain name.

## Environment Variables

The application uses the following environment variables (defined in `.env` file):

- `VITE_API_BASE_URL`: The base URL for the backend API
- `VITE_FIREBASE_API_KEY`: Firebase API key
- `VITE_FIREBASE_AUTH_DOMAIN`: Firebase authentication domain
- `VITE_FIREBASE_PROJECT_ID`: Firebase project ID
- `VITE_FIREBASE_STORAGE_BUCKET`: Firebase storage bucket
- `VITE_FIREBASE_MESSAGING_SENDER_ID`: Firebase messaging sender ID
- `VITE_FIREBASE_APP_ID`: Firebase app ID
- `NODE_ENV`: Set to `production` for production builds

Ensure these variables are set appropriately for your deployment environment. For production, use secure values and never commit sensitive information to version control.

## Additional Notes

- This is a single-page application (SPA). Ensure your web server is configured to handle client-side routing by serving `index.html` for all routes that don't match static files.
- For production deployments, consider using a Content Delivery Network (CDN) for static assets to improve performance.
- Implement proper SSL/TLS certificates for secure HTTPS connections.
- Monitor application logs for runtime errors and ensure backend APIs are accessible and properly configured.
- Regularly update dependencies and monitor for security vulnerabilities.
- Consider implementing error tracking (e.g., Sentry) and analytics (e.g., Google Analytics) in production.
