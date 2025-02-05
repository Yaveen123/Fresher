import { account } from './appwrite.js'
const divHTML = `
    <div class="feed-outline-info ">
        <!-- Feed image -->
        <img class="feed-outline-info-image" src="../images/rss.jpeg" alt="Icon of this feed">
        <div class="feed-outline-info-content">
            <div class="feed-outline-info-content-titlecontainer">
                <!-- Feed title -->
                <p class="feed-outline-info-content-titlecontainer-text">Feed title</p>
            </div>
            <!-- Feed description -->
            <p class="feed-outline-info-content-description">Functional</p>
        </div>
    </div>
    <!-- Buttons -->
    <div class="feed-outline-actions">
        <!-- Edit button -->
        <a id="edit-button" href="../html/settings-rss-feed.html" title="Edit this feed">
            <img class="feed-outline-info-content-titlecontainer-icon" src="../icons/rss/edit rss.svg" alt="Edit RSS feed button">
        </a>
        <!-- Delete button -->
        <a id="delete-button" title="Delete this feed">
            <img class="feed-outline-info-content-titlecontainer-icon" src="../icons/rss/delete rss.svg" alt="Delete RSS feed button">
        </a>
    </div>
`

async function getImageUrl(description) {
    const imgTagMatch = description.match(/<img[^>]+src="([^">]+)"/);
    if (imgTagMatch && imgTagMatch[1]) {
        return imgTagMatch[1];
    } else {
        return false;
    }
}


function createFeedOptions (feedsToCreate) {
    console.log(feedsToCreate);
    if (Object.keys(feedsToCreate).length === 0) {
        console.log("none");
        document.getElementById("no_items_to_show").style.display = "flex";
    }

    for (let itemKey in feedsToCreate) {
        let item = feedsToCreate[itemKey];

        try {
            if (item.functionality === "true") {
                const newItem = document.createElement("div");
                newItem.className = "feed-outline functional";
                newItem.id = item.feed_id;
                newItem.innerHTML = divHTML;
                newItem.querySelector('.feed-outline-info-content-titlecontainer-text').innerHTML = item.feed_name; // 'CSCH' (2016) Finding child element of parent with JavaScript https://stackoverflow.com/questions/16302045/finding-child-element-of-parent-with-javascript 
                newItem.querySelector('.feed-outline-info-content-description').innerHTML = 'Functional';
                newItem.querySelector('#edit-button').href = `../html/settings-rss-feed.html?feed=${item.feed_id}`;
                newItem.querySelector('#delete-button').onclick = function() {
                    deleteRSSFeedWithParam(item.feed_id);
                };
                                //Fetching images is problematic and requires a try statement. 
                try {

                    // Strip domain from URL
                    // "User4227915" (2015) Remove everything after domain and http in url javascript, Accessed on Jan 30, 2025 https://stackoverflow.com/questions/31941899/remove-everything-after-domain-and-http-in-url-javascript
                    const regex = /\/\/([^\/,\s]+\.[^\/,\s]+?)(?=\/|,|\s|$|\?|#)/g;
                    let match;
                    let strippedURL;
                    while (match = regex.exec(item.feed_url)) {
                        strippedURL = match[1];
                    }
                    newItem.querySelector('.feed-outline-info-image').src = `https://icons.feedercdn.com/${strippedURL}`;
                    console.log(`https://icons.feedercdn.com/${item.feed_url}`)
                } catch (error) {
                    console.log("Couldn't get image", error);
                }
                document.getElementById("rss-settings-container").appendChild(newItem);
                
            } else {
                const newItem = document.createElement("div");
                newItem.className = "feed-outline broken";
                newItem.id = item.feed_id;
                newItem.innerHTML = divHTML;
                newItem.querySelector('.feed-outline-info-content-titlecontainer-text').innerHTML = item.feed_name; // 'CSCH' (2016) Finding child element of parent with JavaScript https://stackoverflow.com/questions/16302045/finding-child-element-of-parent-with-javascript 
                newItem.querySelector('.feed-outline-info-content-description').innerHTML = "Couldn't get RSS feed";
                newItem.querySelector('#edit-button').href = `../html/settings-rss-feed.html?feed=${item.feed_id}`;
                newItem.querySelector('#delete-button').onclick = function() {
                    deleteRSSFeedWithParam(item.feed_id);
                };
                //Fetching images is problematic and requires a try statement. 
                try {
                    newItem.querySelector('.feed-outline-info-image').src = item.extraData.feedData.image.url;
                } catch (error) {
                    console.log("Couldn't get image", error);
                }
                document.getElementById("rss-settings-container").appendChild(newItem);
            }
        } catch (error) {
            console.log(error)
            const newItem = document.createElement("div");
            newItem.className = "feed-outline requiresrefresh";
            newItem.id = item.feed_id;
            newItem.innerHTML = divHTML;
            newItem.querySelector('.feed-outline-info-content-titlecontainer-text').innerHTML = item.feed_name; // 'CSCH' (2016) Finding child element of parent with JavaScript https://stackoverflow.com/questions/16302045/finding-child-element-of-parent-with-javascript 
            newItem.querySelector('.feed-outline-info-content-description').innerHTML = "An internal error occurred";
            newItem.querySelector('#edit-button').href = `../html/settings-rss-feed.html?feed=${item.feed_id}`;
            newItem.querySelector('#delete-button').onclick = function() {
                deleteRSSFeedWithParam(item.feed_id);
            };            //Fetching images is problematic and requires a try statement. 
            try {
                newItem.querySelector('.feed-outline-info-image').src = item.extraData.feedData.image.url;
            } catch (error) {
                console.log("Couldn't get image", error);
            }
            document.getElementById("rss-settings-container").appendChild(newItem);
        }
    }
    document.getElementById("showOnLoad").style.display = "flex";
    document.getElementById("loader").style.display = "none";
}

async function checkFeed(item) {
    return fetch(`/api/rssFeedChecker?feedToCheck=${item.feed_url}`) //Send to server for checking
    .then(response => response.json())
    .then(data => {  
        console.log("data", data); 
        return data              
    })
}

// Checks if the feed is functioanl or not
async function checkFeedFunctionality(feedsToCheck) {
    const feedsDict = {};
    var isFeedFunctional;
    for (let item of feedsToCheck) {
        feedsDict[item.feed_id] = item; //All feed rows can expect to have a feed_id in the db, so it indexes by it. 
        const data = await checkFeed(item);
        isFeedFunctional = data.result.toString();
        feedsDict[item.feed_id].functionality = isFeedFunctional; //"Functionality" is true/false based on if the RSS feed is broken or not.
        feedsDict[item.feed_id].extraData = data;
        // "Flambino" (2011) How to create dictionary and add key-value pairs dynamically, Accessed Jan 15 2025, https://stackoverflow.com/questions/7196212/how-to-create-a-dictionary-and-add-key-value-pairs-dynamically-in-javascript
    }
    return feedsDict;
}

async function getRSSFeedsFromServer () {
    try {
        const user = await account.get(); // Get the account and then get their google ID
        const googleID = user.$id; 

        fetch(`/api/rssFeeds?google_id=${googleID}`) 
            .then(response => response.json())
            .then(async data => {
                createFeedOptions(await checkFeedFunctionality(data))
            })

    } catch (error) {
        console.error('Error in rss-settings.js: ', error);
    }
};


document.body.onload = getRSSFeedsFromServer;