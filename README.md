<div align="center">

# WFH Attendance Backend

A NestJS-based backend system for managing employee attendance.

</div>

## Overview

This repository contains the backend implementation of the WFH Attendance System. Built with **NestJS** and **TypeScript**, this project provides a structured and scalable REST API with Prisma ORM, JWT authentication, and Cloudinary integration.

## Tech Stack

- NestJS
- TypeScript
- Prisma ORM
- JWT (Authentication)
- Cloudinary
- Swagger (API Documentation)

## ERD

The diagram below represents the database design of the system. It shows the relationships between users, employees, and attendance records.

<div align="center" style="display: flex; justify-content: center;">
    <img align="center" src="erd.png" alt="ERD" style="width: 100%; height: auto">
</div>

## Prerequisites

Before running this project, make sure you have installed:

1. Node.js v18 or higher
2. pnpm (**Required** — do **not** use `npm` or `yarn`)

## Installation

1. Clone the repository

   ```bash
   git clone https://github.com/Brilliahib/attendance-backend.git
   ```

2. Navigate to the project directory

   ```bash
   cd attendance-backend
   ```

3. Install dependencies

   > ⚠️ **Important:** You **MUST** use `pnpm`. The use of `npm` or `yarn` is **strictly prohibited** to maintain consistency of the `pnpm-lock.yaml` file.

   ```bash
   pnpm install
   ```

4. Configure environment variables

   Create a `.env` file in the root directory and fill in the required variables. Alternatively, you can copy the values from the `.env.example` file.

   ```env
   DATABASE_URL="mysql://root:root@localhost:3306/attendance_db?allowPublicKeyRetrieval=true&ssl=false"
   JWT_SECRET="CHANGETHISPLEASE"
   PORT=9000
   ```

5. Start the database with Docker

   If you are using Docker, run:

   ```bash
   pnpm run db:up
   ```

   If you are using Laragon or another local database setup, you can skip this step.

6. Run database migrations

   ```bash
   pnpm prisma migrate dev
   ```

7. Run database seeder

   ```bash
   pnpm prisma db seed
   ```

8. Run the development server

   ```bash
   pnpm run start:dev
   ```

9. Open the app in your browser

   ```
   http://localhost:9000
   ```

## Available Scripts

| Script                    | Description                             |
| ------------------------- | --------------------------------------- |
| `pnpm run start:dev`      | Run the app in development (watch) mode |
| `pnpm run start:prod`     | Start the production server             |
| `pnpm run build`          | Build the app for production            |
| `pnpm run lint`           | Run ESLint                              |
| `pnpm run test`           | Run unit tests                          |
| `pnpm run test:e2e`       | Run end-to-end tests                    |
| `pnpm prisma migrate dev` | Run Prisma migrations in development    |
| `pnpm prisma db seed`     | Seed the database with initial data     |
| `pnpm prisma studio`      | Open Prisma Studio                      |

## API Documentation

Once the application is running, access the Swagger API documentation at:

```
http://localhost:9000/docs
```

## Workflow

### 1. Git

Git is used as the version control system. Please use a branching workflow when working on new features or fixes.

### 2. Branching Strategy

This project uses three main branches:

| Branch        | Purpose                    |
| ------------- | -------------------------- |
| `main`        | Production branch          |
| `staging`     | Staging branch for testing |
| `development` | Active development branch  |

For every new feature or task, create a new branch from the `development` branch.

### 3. Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/).

Example commit messages:

```
feat: add attendance endpoint
fix: handle jwt expiration error
chore: update prisma schema
```

### 4. Pull Request

All changes to the main branches (`main`, `staging`, and `development`) must go through a Pull Request flow. Do not push or merge directly into those branches.

## Folder Structure

```
.
└── attendance-backend/
    ├── prisma/              # Database schema and Prisma migrations
    ├── src/                 # Main application source code
    │   ├── common/          # Global decorators, exceptions, guards, & interceptors
    │   ├── infra/           # Infrastructure config (Auth, Config, Database)
    │   ├── modules/         # Feature modules
    │   │   ├── attendance/  # Attendance logic and endpoints
    │   │   ├── auth/        # Authentication and authorization logic
    │   │   ├── dashboard/   # Summary and statistics logic
    │   │   └── employee/    # Employee management logic
    │   ├── utils/           # Shared utility functions
    │   ├── main.ts          # Application entry point
    │   └── app.module.ts    # Root module
    ├── test/                # E2E testing files
    └── ...                  # Nest CLI, ESLint, Prettier, TypeScript configs
```

### Folder Explanation

| Folder                   | Description                                                                                                         |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| `prisma/`                | Database schema definitions and migration files                                                                     |
| `src/`                   | Main application source code                                                                                        |
| `src/common`             | Reusable logic such as pagination, response interfaces, and global error handling                                   |
| `src/infra`              | Third-party integrations and system configurations (Cloudinary, JWT strategies, Database)                           |
| `src/modules`            | Feature modules — each subfolder represents a specific business domain with its own controllers, services, and DTOs |
| `src/modules/attendance` | Attendance logic and endpoints                                                                                      |
| `src/modules/auth`       | Authentication and authorization logic                                                                              |
| `src/modules/dashboard`  | Summary and statistics logic                                                                                        |
| `src/modules/employee`   | Employee management logic                                                                                           |
| `src/utils`              | Shared utility functions used across modules                                                                        |
| `test/`                  | End-to-end testing files                                                                                            |

## Default Accounts

After running the database seeder, the following accounts are available for testing:

### Admin Account

| Field    | Value            |
| -------- | ---------------- |
| Email    | `admin@mail.com` |
| Password | `password123`    |

### Employee Account

| Field    | Value                   |
| -------- | ----------------------- |
| Email    | `budi.santoso@mail.com` |
| Password | `password123`           |
