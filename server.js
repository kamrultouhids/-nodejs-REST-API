const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var cors = require('cors');
const knex = require('knex')(require('./knexfile')[process.env.NODE_ENV]);

require('dotenv').config();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var registration = require('./routes/registration');
var login = require('./routes/login');
var task = require('./routes/task');


app.use('/api/register',registration);
app.use('/api/login',login);
app.use('/api/task',task);


app.get('/', (req, res) => {
    return res.json({ code: 200, message: 'Your app is running.', data: null});
});

app.all("*", (req, res, next) => {
    return res.json('page not found');
    next();
});

app.listen(8080, () => {
    console.log('Node app is running on port: 8080');
});