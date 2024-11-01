# Learn MongoDB Website Builder API

Welcome to the MongoDB Website Builder API learning guide! This document will help you understand the core concepts and functionalities of the project.

## Table of Contents

- [Introduction](#introduction)
- [Project Structure](#project-structure)
- [Core Concepts](#core-concepts)
- [Endpoints](#endpoints)
- [Logging](#logging)
- [Error Handling](#error-handling)
- [Database Schema](#database-schema)

## Introduction

The MongoDB Website Builder API is a Node.js-based server that allows you to create, read, update, and delete website data stored in a MongoDB database. It uses Express for handling HTTP requests and Mongoose for interacting with MongoDB.

## Project Structure

The project has the following structure:

```
/home/mezba/mongo-webserver
├── index.js
├── .env
├── package.json
```

- `index.js`: The main server file.
- `.env`: Environment variables.
- `package.json`: Project dependencies and scripts.

## Core Concepts

### Express

Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. In this project, it is used to handle HTTP requests and define API endpoints.

### Mongoose

Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It manages relationships between data, provides schema validation, and translates between objects in code and the representation of those objects in MongoDB.

### Environment Variables

Environment variables are used to configure the application. They are stored in a `.env` file and loaded using the `dotenv` package.

## Endpoints

### Root Endpoint

- **URL**: `/`
- **Method**: `GET`
- **Description**: Returns project information.

### Build Endpoint

- **URL**: `/build/:siteId`
- **Method**: `POST`
- **Description**: Builds and stores a website.
- **Request Body**: JSON containing `html` and `metadata`.

### Serve HTML Endpoint

- **URL**: `/sites/:siteId`
- **Method**: `GET`
- **Description**: Serves the HTML content of a site.

### Site Information Endpoint

- **URL**: `/sites/:siteId/info`
- **Method**: `GET`
- **Description**: Returns metadata and timestamps for a site.

### List All Sites Endpoint

- **URL**: `/sites`
- **Method**: `GET`
- **Description**: Returns a list of all sites (excluding HTML content).

### Delete Site Endpoint

- **URL**: `/sites/:siteId`
- **Method**: `DELETE`
- **Description**: Deletes a site.

## Logging

The project includes custom logging functions to log information, warnings, and errors. These logs include timestamps and component names for better traceability.

- `logInfo(component, message)`: Logs informational messages.
- `logError(component, message, error)`: Logs error messages along with error details.
- `logWarning(component, message)`: Logs warning messages.

## Error Handling

Error handling is implemented using try-catch blocks in asynchronous functions. Errors are logged using the `logError` function, and appropriate HTTP status codes and error messages are returned to the client.

## Database Schema

The MongoDB schema for the site data is defined using Mongoose. It includes fields for `siteId`, `html`, and `metadata`, along with timestamps for creation and updates.

```javascript
const siteSchema = new mongoose.Schema({
    siteId: {
        type: String,
        required: true,
        unique: true,
        index: true,
        validate: {
            validator: function(v) {
                return /^[a-zA-Z0-9-_]+$/.test(v);
            },
            message: 'Site ID can only contain letters, numbers, hyphens, and underscores'
        }
    },
    html: {
        type: String,
        required: true
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
});
```

This schema ensures that each site has a unique `siteId`, HTML content, and optional metadata.

Happy learning!