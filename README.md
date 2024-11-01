# MongoDB Website Builder API

Welcome to the MongoDB Website Builder API! This project is a Node.js-based server that allows you to create, read, update, and delete website data stored in a MongoDB database. It's built using Express and Mongoose.

## Table of Contents

- [Getting Started](#getting-started)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [Examples](#examples)
- [Contributing](CONTRIBUTING.md)
- [License](LICENSE)
## Getting Started

### Prerequisites

Make sure you have Node.js (>= 18.0.0) installed on your machine.

### Installation

1. Clone the repository:
    ```properties
    git clone https://github.com/mezbaulanam/mongo-webserver.git
    cd mongo-webserver
    ```

2. Install the dependencies:
    ```properties
    npm install
    ```

3. Create a `.env` file in the root directory and add the following environment variables:
    ```properties
    # MongoDB Configuration
    MONGODB_URI=mongodb+srv://..............

    # Server Configuration
    PORT=3000
    ```

## Usage

1. Start the server:
    ```sh
    npm start
    ```

2. For development, you can use:
    ```sh
    npm run dev
    ```

3. The server will start on the port specified in the `.env` file (default is `3000`).

## Environment Variables

- `MONGODB_URI`: The URI for connecting to the MongoDB database.
- `PORT`: The port on which the server will run.

## Examples

### Root Endpoint
Get project information:
```properties
curl -X GET http://localhost:3000/
```

### Build Endpoint
```properties
curl -X POST http://localhost:3000/build/<siteId> \
    -H "Content-Type: application/json" \
    -d '{
        "html": "<html><body><h1>Hello World</h1></body></html>",
        "metadata": {
            "author": "Mezbaul Anam",
            "description": "Sample website"
        }
    }'
```
### Serve HTML Endpoint
Get the HTML content of a site:
```properties
curl -X GET http://localhost:3000/sites/<siteId>
```

### Site Information Endpoint
Get metadata and timestamps for a site:
```properties
curl -X GET http://localhost:3000/sites/<siteId>/info
```

### List All Sites Endpoint
Get a list of all sites (excluding HTML content):
```properties
curl -X GET http://localhost:3000/sites
```

### Delete Site Endpoint
Delete a site:
```properties
curl -X DELETE http://localhost:3000/sites/<siteId>
```