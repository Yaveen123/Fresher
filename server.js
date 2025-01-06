
const sdk = require('node-appwrite');
const express = require("express");
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
app.use(express.static(path.join(__dirname, "public")));








// let client = new sdk.Client();

// client
//     .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
//     .setProject('677b9d6a003b20df0022') // Your project ID
//     .setKey('standard_70a78eb68a7cc00b5be270fe76efc1b5a5796330f98c939dd1589c13f145adb26558d5aeb5df05cbccac82ccf682ffd675897aa88ca9f5e86695fc991f39024a4cf57785748472edb9e7f15b6d7643305884088dbb9db42f23de8ee35728324663b5af27f4f8f0ae678ee2963d6980acd83e642dc4fb40f477ab3578f15c1297') // Your secret API key
//     .setSelfSigned() // Use only on dev mode with a self-signed SSL cert
// ;

// let users = new sdk.Users(client);
// let promise = users.create(sdk.ID.unique(), "email@example.com", "+123456789", "password", "Walter O'Brien");

// promise.then(function (response) {
//     console.log(response);
// }, function (error) {
//     console.log(error);
// });








app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(8000, () => console.log("Server is running on Port 8000, visit http://localhost:8000/ or http://127.0.0.1:8000 to access your website") );

// I use inline functions here
// Connect to database 
const db = new sqlite3.Database('./.database/datasource.db', sqlite3.OPEN_READWRITE,(err) => {
  if (err) return console.error(err.message); // If connection unsuccessful, then return error message

    console.log('Successful connection');
})


/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////

// Get account settings
const getForSpecificUser = 'SELECT * FROM account WHERE account_name = ?'; //SQL query
app.get('/api/accountSettings', (req, res) => {                            // the callback function runs
  db.all(                                                                  //Retrieve the data from the database
    getForSpecificUser,                                                    //run the SQL query 
    ["Yav"],                                                               // with the following parameters
    (err, rows) => {                                                       // callback function for the database retrival function
        if (err) return console.error(err.message);
        res.json(rows);                                                    // The data is posted to the endpoint
    }
);
});


//Edit account details
const editUserAccountDetails = 'SELECT * FROM account WHERE account_name = ?'; //SQL query
app.post('/api/editAccountSettings', (req, res) => {                           //"Alexander" (2016) How to get data passed from a form in Express (Node.js), accessed Jan 6 2025 https://stackoverflow.com/questions/9304888/how-to-get-data-passed-from-a-form-in-express-node-js  
    const { account_name, account_image } = req.body;
    console.log("----\nEdit account settings request")
    console.log(req.body);
    res.statusCode = 302;                                                       // Redirects back.
    res.setHeader("Location", "/html/settings-account.html");                   // Nagle, D. (2016) How to res.send to a new URL in Node.js/Express?, Accessed Jan 6 2025 https://stackoverflow.com/questions/40497534/how-to-res-send-to-a-new-url-in-node-js-express#:~:text=You%20want%20to%20redirect%20the%20request%20by%20setting,permanent%20redirect.%20res.statusCode%20%3D%20302%3B%20res.setHeader%28%22Location%22%2C%20%22http%3A%2F%2Fwww.url.com%2Fpage%22%29%3B%20res.end%28%29%3B 
    res.end();
});


