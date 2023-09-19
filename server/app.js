require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');

const postRoutes = require('./routes/post');
const commentRoutes = require('./routes/comment');

const app = express();
const PORT = 8080;

app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/post', postRoutes);
app.use('/comment', commentRoutes);
app.use('/live', (req, res) => res.status(200).send({success: true, result: 'SERVER LIVES'}));

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

app.use(express.static('public'));

const startApp = async (port=PORT) => {
  app.listen(port, async () => {
    console.log(`Example app listening at http://localhost:${port}`);
    // await runDbTests();
  })
  
};

const stopApp = async () => {
  console.log('APP STOPED');
}

module.exports = {startApp, stopApp, PORT};
