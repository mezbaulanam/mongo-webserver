const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Logging functions
const logInfo = (component, message) => console.log(`[${new Date().toISOString()}] [INFO] [${component}] ${message}`);
const logError = (component, message, error) => console.error(`[${new Date().toISOString()}] [ERROR] [${component}] ${message}`, error);
const logWarning = (component, message) => console.warn(`[${new Date().toISOString()}] [WARNING] [${component}] ${message}`);

// MongoDB Schema
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

const Site = mongoose.model('Site', siteSchema);

// Express setup
const app = express();
app.use(cors());

// Request logger middleware
const requestLogger = (req, res, next) => {
    const start = Date.now();
    const originalSend = res.send;
    res.send = function() {
        const duration = Date.now() - start;
        logInfo('API', `${req.method} ${req.url} - Response sent - Status: ${res.statusCode} - Duration: ${duration}ms`);
        return originalSend.apply(res, arguments);
    };
    next();
};

app.use(requestLogger);

// Validate site ID middleware
const validateSiteId = (req, res, next) => {
    const { siteId } = req.params;
    if (!siteId || !/^[a-zA-Z0-9-_]+$/.test(siteId)) {
        return res.status(400).json({ error: 'Invalid site ID' });
    }
    next();
};

// Root endpoint
app.get('/', (req, res) => {
    logInfo('API', 'Root endpoint accessed');
    res.json({
        project: "Dynamic Website Builder",
        description: "MongoDB-based website builder API",
        endpoints: {
            "/": "Project information",
            "/build/:siteId": "Build and store website",
            "/sites/:siteId": "Serve website content",
            "/sites/:siteId/info": "Get site information"
        }
    });
});

// Build endpoint
app.post('/build/:siteId', validateSiteId, async (req, res) => {
    try {
        const { siteId } = req.params;
        const { html, metadata = {} } = req.body;
        logInfo('Build', `Attempting to build site: ${siteId}`);

        if (!html) {
            logWarning('Build', `Missing HTML content for site: ${siteId}`);
            return res.status(400).json({ error: 'HTML content is required' });
        }

        // Create or update the site
        const site = await Site.findOneAndUpdate(
            { siteId },
            { html, metadata },
            { 
                new: true,
                upsert: true,
                runValidators: true
            }
        );

        logInfo('Build', `Successfully built site: ${siteId}`);
        res.status(201).json({
            message: 'Site built successfully',
            siteId,
            metadata,
            created: site.createdAt,
            updated: site.updatedAt
        });

    } catch (error) {
        logError('Build', `Failed to build site: ${req.params.siteId}`, error);
        res.status(500).json({ error: 'Failed to build site' });
    }
});

// Serve HTML endpoint
app.get('/sites/:siteId', validateSiteId, async (req, res) => {
    try {
        const { siteId } = req.params;
        logInfo('Serve', `Attempting to serve site: ${siteId}`);

        const site = await Site.findOne({ siteId });
        if (!site) {
            logWarning('Serve', `Site not found: ${siteId}`);
            return res.status(404).json({ error: 'Site not found' });
        }

        logInfo('Serve', `Successfully served site: ${siteId}`);
        res.setHeader('Content-Type', 'text/html');
        res.send(site.html);

    } catch (error) {
        logError('Serve', `Failed to serve site: ${req.params.siteId}`, error);
        res.status(500).json({ error: 'Failed to serve site' });
    }
});

// Site information endpoint
app.get('/sites/:siteId/info', validateSiteId, async (req, res) => {
    try {
        const { siteId } = req.params;
        logInfo('Info', `Fetching info for site: ${siteId}`);

        const site = await Site.findOne({ siteId });
        if (!site) {
            logWarning('Info', `Site not found: ${siteId}`);
            return res.status(404).json({ error: 'Site not found' });
        }

        res.json({
            siteId: site.siteId,
            metadata: site.metadata,
            created: site.createdAt,
            updated: site.updatedAt
        });

    } catch (error) {
        logError('Info', `Failed to fetch site info: ${req.params.siteId}`, error);
        res.status(500).json({ error: 'Failed to fetch site information' });
    }
});

// List all sites endpoint
app.get('/sites', async (req, res) => {
    try {
        logInfo('List', 'Fetching all sites');
        const sites = await Site.find({}, { html: 0 }); // Exclude HTML content
        res.json(sites);
    } catch (error) {
        logError('List', 'Failed to fetch sites', error);
        res.status(500).json({ error: 'Failed to fetch sites' });
    }
});

// Delete site endpoint
app.delete('/sites/:siteId', validateSiteId, async (req, res) => {
    try {
        const { siteId } = req.params;
        logInfo('Delete', `Attempting to delete site: ${siteId}`);

        const result = await Site.findOneAndDelete({ siteId });
        if (!result) {
            logWarning('Delete', `Site not found: ${siteId}`);
            return res.status(404).json({ error: 'Site not found' });
        }

        logInfo('Delete', `Successfully deleted site: ${siteId}`);
        res.json({ message: 'Site deleted successfully' });

    } catch (error) {
        logError('Delete', `Failed to delete site: ${req.params.siteId}`, error);
        res.status(500).json({ error: 'Failed to delete site' });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    logInfo('Server', `Server starting on port ${PORT}`);
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        logInfo('MongoDB', 'Successfully connected to MongoDB');
        logInfo('Server', `Server is running on port ${PORT}`);
    } catch (error) {
        logError('Server', 'Failed to start server properly', error);
        process.exit(1);
    }
});
