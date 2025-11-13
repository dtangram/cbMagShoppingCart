const express = require('express');
const path = require('path');
const createDebug = require('debug');

const log = createDebug('reactjs:logging');

const app = express();
const port = parseInt(process.env.PORT || '5000', 10);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'reactjs/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'reactjs/build', 'index.html'));
});

app.listen(port, () => {
  log(`Listening on port ${port}`);
  console.log(`Listening on port ${port}`);
});