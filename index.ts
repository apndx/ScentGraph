const express = require('express')
//import Neode from 'neode'
// Create a new express application instance
//const app: express.Application = express();

const app = express()

app.get('/', function (req, res) {
  res.send('Hello ScentGraph!');
})

app.listen(3001, function () {
  console.log('Initial server app listening on port 3001!');
})