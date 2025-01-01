## Movie Database App

Go to the [Movie Database App](https://movie.alanrayelangos.cloud/)

# Setup

This documentation will guide you through the setup of the Movie Database application. The server uses FeathersJS 5, the frontend is built with Next.js, and the database is PostgreSQL.

In production, the following technologies are used:
- **Object Storage**: AWS S3
- **App Hosting**: AWS EC2 Ubuntu with PM2 process manager
- **Routing**: Cloudflare Tunnels

## Prerequisites

Ensure you have the following installed on your machine:
- Node.js (v22.12.0 or higher)
- npm or yarn
- PostgreSQL

## Backend Setup (FeathersJS 5)

1. Navigate to the backend directory:
    ```sh
    cd /movie-database/backend
    ```

2. Install dependencies:
    ```sh
    yarn
    ```

3. Configure the environment variables by creating a `.env` file in the `/backend` directory:
    ```sh
    touch .env
    ```

4. Add the following environment variables to the `.env` file:
    ```env
    BUCKET_ACCESS_KEY=your_bucket_access_key
    BUCKET_SECRET_KEY=your_bucket_secret_key
    BUCKET_REGION=your_bucket_region
    BUCKET_NAME=your_bucket_name
    BUCKET_ENDPOINT=your_bucket_endpoint

    POSTGRESQL_CLIENT=pg
    DB_USERNAME=your_db_username
    DB_PASSWORD=your_db_password
    DB_HOST=your_db_host
    DB_PORT=your_db_port
    DB_NAME=your_db_name
    DB_CA="your_db_ca_certificate"

    PORT=3030
    HOSTNAME=localhost
    FEATHERS_SECRET=your_secret_key
    PUBLIC=./public/
    ORIGINS=http://localhost:3030
    AUTH_ENTITY=user
    AUTH_SERVICE=users
    AUTH_STRATEGIES=jwt,local
    JWT_HEADER_TYP=access
    JWT_AUDIENCE=https://yourdomain.com
    JWT_ALGORITHM=HS256
    JWT_EXPIRES_IN=1d
    LOCAL_USERNAME_FIELD=email
    LOCAL_PASSWORD_FIELD=password
    ```

5. Start the development backend server:
    ```sh
    yarn dev
    ```

## Frontend Setup (Next.js)

1. Navigate to the frontend directory:
    ```sh
    cd /movie-database/frontend
    ```

2. Install dependencies:
    ```sh
    yarn install
    ```

3. Configure the environment variables by creating a `.env.local` file in the `/frontend` directory:
    ```sh
    touch .env.local
    ```

4. Add the following environment variables to the `.env.local` file:
    ```env
    NEXT_PUBLIC_SERVER_ENDPOINT="http://localhost:3030"
    ```

5. Start the development frontend server:
    ```sh
    yarn dev
    ```

You have successfully set up the Movie Database App.
