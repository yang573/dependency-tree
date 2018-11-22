const http = require('http');
const fs = require('fs');
const express = require('express');
const app = express();

const hostname = '127.0.0.1';
const port = 3000;

app.get('/', (req, res) => {
  res.send('Dependency Tree!')
});

app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
