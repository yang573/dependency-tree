// Packages
const http = require('http');
const https = require('https');
const path = require('path');
const express = require('express');

// Setup
const api = require('./github-api');
const app = express();

// POST Parser Setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, '../../../dist/dependency-tree/')));

app.use('/', api);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../../dist/dependency-tree/index.html'));
  // res.send({
  //   status: 200,
  //   redirect: '/home'
  // });
});

const port = process.env.PORT || '3000';
app.set('port', port);

//const server = http.createServer(app);

app.listen(port, () => console.log(`Scratch running on http://localhost:${port}/`));
