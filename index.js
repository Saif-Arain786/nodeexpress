const express = require("express");
const app = express();
const port = process.env.PORT || 5004;
const cors = require('cors');
const bodyParser = require('body-parser');
const mainRouter = require("./Router/mainRouter.js"); // Check the file name (capitalization matters)
const mongose = require('mongoose');
require("dotenv").config();

mongose.connect(process.env.connection_string, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
})
// .then(() => {
//     console.log("mongodb connected successfullys");

// }).catch((error) => {
//     console.log("error in connection to mongodb", error);

// });
const db = mongose.connection
db.once('open', () => {
    console.log('connected to database');
})
db.on('error', () => {
    console.log('error in connection to database');
})
// Middleware
app.use(cors({ origin: 'http://127.0.0.1:5500' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Use routers
app.use('', mainRouter)

// Test Route
app.get('/', (req, res) => {
    res.status(200).json({
        status: true,
        message: "Welcome to the API"
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: false,
        message: "Something went wrong!"
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
