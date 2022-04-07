// Modules
require('dotenv').config();
const express = require('express');
const httpStatus = require('http-status');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Express - Instance
const app = express();

// Route
const route = require('./src/module/orquestrator/assistant.route');

// Setting's default
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// Setting's view engine
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

// GET's
app.get('/health-check', (req, res) => res.status(httpStatus.OK).send('OK'));

app.get('/', (req, res) => {
    res.render('index', {});
});

app.get('/chat', (req, res) => {
    res.render('chat', {});
});

app.get('/mobile', (req, res) => {
    res.render('mobile', {});
});

// Router /api/message
app.use('/', route);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Backend is running on port ${port}...🚀 https://localhost:${port}/`);
});
