const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const connectToMongo = require('./db');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome To iTodo Backend!!!');
});
app.use('/api/auth', require('./Routes/auth'));
app.use('/api/todos', require('./Routes/todos'));

app.listen(port, () => {
    console.log(`iTodo's Backend running at http://localhost:${ port }`);
});
connectToMongo();
