# SnapEats-Backend

This is the backend service for the SnapEats food delivery application. It is built using Node.js, Express, and Prisma, with TypeScript for type safety.

## Table of Contents

- [SnapEats-Backend](#snapeats-backend)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [Setup](#setup)
  - [Environment Variables](#environment-variables)
  - [Scripts](#scripts)
  - [API Documentation](#api-documentation)

## Features

- User authentication (registration, login, logout)
- Profile management
- Restaurant management
- Menu management
- Order management
- Review system

## Tech Stack

- **Backend**: Node.js, Express
- **Database**: PostgreSQL, Prisma ORM
- **Authentication**: Passport.js, JWT
- **Validation**: Zod
- **Deployment**: Render (backend), Vercel (frontend)
- **Other**: TypeScript, Stripe

## Setup

To set up the project locally, follow these steps:

1. Clone the repository:
    ```sh
    git clone https://github.com/ShivamDev412/SnapEats-Backend.git
    cd SnapEats-Backend
    ```

2. Install the dependencies:
    ```sh
    pnpm install
    ```

3. Set up the environment variables:
    - Create a `.env` file in the root directory.
    - Add the following environment variables:
        ```env
        PORT=4000
        DATABASE_URL=your_postgresql_database_url
        JWT_SECRET=your_jwt_secret
        CORS_ORIGIN=http://localhost:5173
        ```

4. Apply the Prisma migrations:
    ```sh
    npx prisma migrate dev --name init
    ```

5. Start the development server:
    ```sh
    npm run dev
    ```
## Environment Variables

- `PORT`: The port on which the server runs.
- `DATABASE_URL`: The connection string for your PostgreSQL database.
- `JWT_SECRET`: Secret key for signing JWT tokens.
- `CORS_ORIGIN`: The origin URL for CORS configuration.

## Scripts

- `npm run dev`: Run the development server.
- `npm run build`: Build the project.
- `npm run start`: Start the production server.
- `npx prisma migrate dev --name <migration-name>`: Apply migrations.
- `npx prisma studio`: Open Prisma Studio to view and edit the database.

## API Documentation

- `https://snapeats-backend.onrender.com/api-docs`

