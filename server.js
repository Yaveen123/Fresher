const sdk = require('node-appwrite');
const express = require("express");
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
app.use(express.static(path.join(__dirname, "public")));
let Parser = require('rss-parser');
let parser = new Parser({ timeout: 1000 });

app.use(bodyParser.urlencoded({ extended: true }));

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



// Get account settings
const getForSpecificUser = 'SELECT * FROM account WHERE google_id = ?'; //SQL query
app.get('/api/accountSettings', (req, res) => {                            // the callback function runs
    const googleId = req.query.google_id; // Get google_id from query parameters

    console.log(googleId);
    db.all(                                                                  //Retrieve the data from the database
    getForSpecificUser,                                                    //run the SQL query 
    [googleId],                                                               // with the following parameters
    (err, rows) => {                                                       // callback function for the database retrival function
        if (err) return console.error(err.message);
        console.log(rows);
        res.json(rows);                                                    // The data is posted to the endpoint
    }
);
});
// Get advanced settings
app.get('/api/advancedSettings', (req, res) => {                            // the callback function runs
    const googleId = req.query.google_id; // Get google_id from query parameters

    db.all(                                                                  //Retrieve the data from the database
    getForSpecificUser,                                                    //run the SQL query 
    [googleId],                                                               // with the following parameters
    (err, rows) => {                                                       // callback function for the database retrival function
        if (err) return console.error(err.message);
        res.json(rows);                                                    // The data is posted to the endpoint
    }
);
});

// Get RSS feeds
const getRSSForSpecificUser = 'SELECT * FROM feed WHERE google_id = ?'; //SQL query
app.get('/api/rssFeeds', (req, res) => {                            // the callback function runs
    const googleId = req.query.google_id; // Get google_id from query parameters

    db.all(                                                                  //Retrieve the data from the database
    getRSSForSpecificUser,                                                    //run the SQL query 
    [googleId],                                                               // with the following parameters
    (err, rows) => {                                                       // callback function for the database retrival function
        if (err) return console.error(err.message);
        res.json(rows);                                                    // The data is posted to the endpoint
    }
);
});




// When user logs in, this runs. Creates a new account whenever a new user logs in. 
// Insert a record into the google_id column of the account table, then give the value, set account_id to an increment of the previous, and insert only if there isn't a record found.
// 'systempunttoout' (2010) SQL: How to properly check if a record exists Accessed 7 Jan 2025 https://stackoverflow.com/questions/4253960/sql-how-to-properly-check-if-a-record-exists 
// 'norman' (2012) insert into table select max(column_name)_1 accessed Jan 7 2025 https://stackoverflow.com/questions/13282116/insert-into-table-select-maxcolumn-name1 
const checkUserExistsOnDB = `
INSERT INTO account (google_id, account_id, advanced_show_provider, advanced_show_age, account_name)
SELECT ?, (SELECT IFNULL(MAX(account_id), 0) + 1 FROM account), 'auto', 'auto', ?
WHERE NOT EXISTS (SELECT 1 FROM account WHERE google_id = ?)
`;
// Same as above but inserts sample data for feed.
const addDemoFeed = `
INSERT INTO feed (feed_id, google_id, feed_name, feed_url, feed_article_num, feed_view_type, feed_show_image, feed_show_description)
SELECT (SELECT IFNULL(MAX(feed_id), 0) + 1 FROM feed), ?, 'The Verge',  'https://www.theverge.com/rss/creators/index.xml', 6, 'auto', 'auto', 'auto'
WHERE NOT EXISTS (SELECT 1 FROM feed WHERE google_id = ?)
`;
app.use(express.json()); //Middleware that parses incoming rquires with JSON things inside.
app.post('/api/logUserIn', (req, res) => {
    const { title } = req.body;
    res.json({ message: "User logged in", data: req.body });

    db.run(
        checkUserExistsOnDB,
        [req.body.$id, req.body.name, req.body.$id],
        function(err) {
            if (err) return console.error(err.message);
            console.log(`SQL checkUserExistsOnDB, Rows inserted ${this.changes}`);

            db.run(
                addDemoFeed,
                [req.body.$id, req.body.$id],
                function(err) {
                    if (err) return console.error(err.message);
                    console.log(`SQL addDemoFeed, Rows inserted ${this.changes}`);
                });
        });
});


// Get RSS feed settings
const addNewFeed = `
INSERT INTO feed (feed_id, google_id, feed_name, feed_url, feed_article_num, feed_view_type, feed_show_image, feed_show_description)
VALUES ((SELECT IFNULL(MAX(feed_id), 0) + 1 FROM feed), ?, 'Unnamed feed', 'Add URL here', 6, 'auto', 'auto', 'auto')
`;

const getSettingsForFeed = 'SELECT * FROM feed WHERE feed_id = ?';
app.get('/api/feedSettings', (req, res) => {                            // the callback function runs
    const feedID = req.query.feed; // Get feed id from query parameters
    const google_id = req.query.googleid;
    let lastcreatedid;

    if (feedID === "new") { // If this is the create new function
        db.run( // Add a new feed
            addNewFeed,
            [google_id],
            function(err) {
                if (err) return console.error(err.message);
                console.log(`SQL addNewFeed, Rows inserted ${this.changes}`);
                lastcreatedid = this.lastID; // Get last ID. From sqlite3 docs. https://github.com/TryGhost/node-sqlite3/wiki/API#databaserun:~:text=If%20execution%20was%20successful%2C%20the%20this,.get()%20don%27t%20retrieve%20these%20values. 
                
                db.all(                                                                    // We can then retrieve the data from the database to open as usual...
                    getSettingsForFeed,                                                    //run the SQL query 
                    [lastcreatedid],                                                       // with the following parameters
                    (err, rows) => {                                                       // callback function for the database retrival function
                        if (err) return console.error(err.message);
                        res.json(rows);                                                    // The data is posted to the endpoint
                    }
                );
            }
        );
    } else {
        db.all(                                                                  //Retrieve the data from the database
            getSettingsForFeed,                                                    //run the SQL query 
            [feedID],                                                               // with the following parameters
            (err, rows) => {                                                       // callback function for the database retrival function
                if (err) return console.error(err.message);
                console.log(rows);
                res.json(rows);                                                    // The data is posted to the endpoint
            }
        );
    }
});


//Edit account details
const editUserAccountDetails = `
UPDATE account
SET account_name = ?
WHERE google_id = ?
`; //SQL query

app.post('/api/editAccountSettings', (req, res) => {                           //"Alexander" (2016) How to get data passed from a form in Express (Node.js), accessed Jan 6 2025 https://stackoverflow.com/questions/9304888/how-to-get-data-passed-from-a-form-in-express-node-js  
    const { account_name, account_image, google_id } = req.body;
    console.log(account_image);
    db.run(
        editUserAccountDetails,
        [account_name, google_id],
        function(err) {
            if (err) return console.error(err.message);
            console.log(`SQL editUserAccountDetails, Rows updated ${this.changes}`);
    });
    res.statusCode = 302;                                                       // Redirects back.
    res.setHeader("Location", "/html/settings-account.html");                   // Nagle, D. (2016) How to res.send to a new URL in Node.js/Express?, Accessed Jan 6 2025 https://stackoverflow.com/questions/40497534/how-to-res-send-to-a-new-url-in-node-js-express#:~:text=You%20want%20to%20redirect%20the%20request%20by%20setting,permanent%20redirect.%20res.statusCode%20%3D%20302%3B%20res.setHeader%28%22Location%22%2C%20%22http%3A%2F%2Fwww.url.com%2Fpage%22%29%3B%20res.end%28%29%3B 
    res.end();
});

//Edit account details
const editAdvancedSettings = `
UPDATE account
SET advanced_show_provider = ?, advanced_show_age = ?
WHERE google_id = ?
`; //SQL query

app.post('/api/editAdvancedSettings', (req, res) => {                           //"Alexander" (2016) How to get data passed from a form in Express (Node.js), accessed Jan 6 2025 https://stackoverflow.com/questions/9304888/how-to-get-data-passed-from-a-form-in-express-node-js  
    const { advanced_show_provider, advanced_show_age, google_id } = req.body;
    db.run(
        editAdvancedSettings,
        [advanced_show_provider, advanced_show_age, google_id],
        function(err) {
            if (err) return console.error(err.message);
            console.log(`SQL editAdvancedSettings, Rows updated ${this.changes}`);
    });
    res.statusCode = 302;                                                       // Redirects back.
    res.setHeader("Location", "/html/settings-advanced.html");                   // Nagle, D. (2016) How to res.send to a new URL in Node.js/Express?, Accessed Jan 6 2025 https://stackoverflow.com/questions/40497534/how-to-res-send-to-a-new-url-in-node-js-express#:~:text=You%20want%20to%20redirect%20the%20request%20by%20setting,permanent%20redirect.%20res.statusCode%20%3D%20302%3B%20res.setHeader%28%22Location%22%2C%20%22http%3A%2F%2Fwww.url.com%2Fpage%22%29%3B%20res.end%28%29%3B 
    res.end();
});

//Edit account details
const editRSSFeedSettings = `
UPDATE feed
SET feed_name = ?, feed_url = ?, feed_article_num = ?, feed_view_type = ?, feed_show_image = ?, feed_show_description = ?
WHERE feed_id = ?
`; //SQL query
app.post('/api/editRSSFeedSettings', (req, res) => {                           //"Alexander" (2016) How to get data passed from a form in Express (Node.js), accessed Jan 6 2025 https://stackoverflow.com/questions/9304888/how-to-get-data-passed-from-a-form-in-express-node-js  

    const { feed_name, feed_url, feed_article_num, feed_view_type, feed_show_image, feed_show_description, feed_id } = req.body;
    
        db.run(
            editRSSFeedSettings,
            [feed_name, feed_url, feed_article_num, feed_view_type, feed_show_image, feed_show_description, feed_id],
            function(err) {
                if (err) return console.error(err.message);
                console.log(`SQL editAdvancedSettings, Rows updated ${this.changes}`);
        });
    
    
    res.statusCode = 302;                                                       // Redirects back.
    res.setHeader("Location", `/html/settings-rss-feed.html?feed=${feed_id}`);                   // Nagle, D. (2016) How to res.send to a new URL in Node.js/Express?, Accessed Jan 6 2025 https://stackoverflow.com/questions/40497534/how-to-res-send-to-a-new-url-in-node-js-express#:~:text=You%20want%20to%20redirect%20the%20request%20by%20setting,permanent%20redirect.%20res.statusCode%20%3D%20302%3B%20res.setHeader%28%22Location%22%2C%20%22http%3A%2F%2Fwww.url.com%2Fpage%22%29%3B%20res.end%28%29%3B 
    res.end();
});

//Edit account details
const deleteRSSFeed = `
DELETE FROM feed WHERE feed_id = ?
`; //SQL query
app.get('/api/deleteFeed', (req, res) => {                           //"Alexander" (2016) How to get data passed from a form in Express (Node.js), accessed Jan 6 2025 https://stackoverflow.com/questions/9304888/how-to-get-data-passed-from-a-form-in-express-node-js  

    const feed_id = req.query.feed_id;

    db.run(
        deleteRSSFeed,
        [feed_id],
        function(err) {
            if (err) return console.error(err.message);
            console.log(`SQL deleteRSSFeed, Rows updated ${this.changes}`);
    });
    res.send({ redirectto: `/html/settings-rss-feed.html`});
});


//Get the username
const getUsername = `SELECT account_name FROM account WHERE google_id = ?`; //SQL query
app.post('/api/getUsername', (req, res) => {                                //"Alexander" (2016) How to get data passed from a form in Express (Node.js), accessed Jan 6 2025 https://stackoverflow.com/questions/9304888/how-to-get-data-passed-from-a-form-in-express-node-js  
    const { account_name, account_image, google_id } = req.body;
    db.all(
        getUsername,
        [req.body.account_id],
        (err, rows) => {                                                    // callback function for the database retrival function
            if (err) return console.error(err.message);
            res.send(rows);                                                 // The data is posted to the endpoint
        }
    );
});



// Checks the feed if it's working or not.
//Async/await promise script from rss-parser https://www.npmjs.com/package/rss-parser 
app.get(`/api/rssFeedChecker`, (req, res) => {                            // the callback function runs
    const feedToCheck = req.query.feedToCheck; // Get google_id from query parameters
    (async () => {
        try {
            var check = true;

            // Check if the link works (doesn't return any errors)
            const forceAwait = await fetch(feedToCheck, { signal: AbortSignal.timeout(2000) }) // Try to fetch it. The fetch function returns a promise that resolves to Response
                .then(function(response) {
                    if (!response.ok) {
                        // The promise auto rejects didn't resolve a 2xx response
                        throw new Error("Not 2xx response", {cause: response});
                    }
                }).catch(function(err) {
                    console.log("Failed to check feed", err);
                    check = false; // Change 'check' to false and return it if the promise is broken.
                });
            // "jfriend00" (2016) Fetch resolves even if 404? Accessed Jan 13 2025 https://stackoverflow.com/questions/39297345/fetch-resolves-even-if-404 
            // "Matthew-e-brown" (2020) how to make js wait for the result and treatment of fetch request to continous on? Accessed Jan 13 2025, https://stackoverflow.com/questions/60200798/how-to-make-js-wait-for-the-result-and-treatment-of-fetch-request-to-continuous
            // 'Endless' (2018) Fetch API request timeout? Accessed Jan 13 2025 https://stackoverflow.com/questions/46946380/fetch-api-request-timeout

            // Check if the link is an actual RSS feed. 
            var feedToReturn;
            (async () => {
                try {
                    let feed = await parser.parseURL(feedToCheck); //Tries to fetch RSS feed using the rss-parser module
                    feedToReturn = feed;
                    
                    feed.items.forEach(item => {
                        
                    });
                    
                } catch (error) { 
                    console.log("Failed to parse RSS feed", error);
                    check = false;
                }
                res.json({ 
                    feed: feedToCheck,
                    result: check,
                    feedData: feedToReturn
                });
            })();
            // rss-parser docs - https://www.npmjs.com/package/rss-parser   
        } catch (error) {
            console.log("Failed to finish feed check", error);
            res.json({ 
                feed: feedToCheck,
                result: false 
            }); 
        }       
    })();
});
