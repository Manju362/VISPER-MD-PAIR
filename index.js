const express = require('express');
const app = express();
const __path = process.cwd(); // Fixed: Use process.cwd() for root path
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 8000;

let server = require('./qr'), // QR routes
    code = require('./pair'); // Pair routes

require('events').EventEmitter.defaultMaxListeners = 500;

// Routes
app.use('/server', server);
app.use('/code', code);
app.use('/pair', async (req, res, next) => {
  res.sendFile(__path + '/pair.html'); // Serve pair.html
});
app.use('/qr', async (req, res, next) => {
  res.sendFile(__path + '/qr.html'); // Serve qr.html
});
app.use('/', async (req, res, next) => {
  res.sendFile(__path + '/main.html'); // Serve main.html (landing page)
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, () => {
    console.log(`
Don't Forgot To Give Star

 Server running on http://localhost:${PORT}`);
});

module.exports = app;
