# Project Overview

This is a 3-tier todo application consisting of a React frontend, a Node.js (Express) backend, and a PostgreSQL database. The application is designed to be deployed on AWS.

- **Frontend:** A React application that provides the user interface for managing todos. It is deployed to an S3 bucket.
- **Backend:** A Node.js (Express) application that provides a RESTful API for managing todos. It is deployed to an EC2 instance and managed by PM2.
- **Database:** A PostgreSQL database (likely RDS) that stores the todo items. The backend connects to the database using credentials stored in AWS Secrets Manager.

# Building and Running

## Frontend

- **Install dependencies:** `npm install`
- **Run locally:** `npm start`
- **Build for production:** `npm run build`
- **Run tests:** `npm test`

## Backend

- **Install dependencies:** `npm install`
- **Run locally:** `node app.js` (requires database connection and AWS credentials)

# Development Conventions

- The frontend code is located in the `frontend` directory.
- The backend code is located in the `backend` directory.
- The frontend communicates with the backend via a RESTful API.
- The backend connects to a PostgreSQL database using credentials from AWS Secrets Manager.
- The `buildspec.yml` file defines the build and deployment process for AWS.
- The backend is managed by `pm2`.