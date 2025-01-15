import { account } from './appwrite.js'
const divHTML = `
<div class="feed-outline functional">
    <div class="feed-outline-info ">
        <!-- Feed image -->
        <img class="feed-outline-info-image" src="../images/placeholder.png" alt="Icon of this feed">
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
        <a href="../html/settings-rss-feed.html">
            <img class="feed-outline-info-content-titlecontainer-icon" src="../icons/rss/edit rss.svg" alt="Edit RSS feed button">
        </a>
        <!-- Delete button -->
        <a href="https://google.com">
            <img class="feed-outline-info-content-titlecontainer-icon" src="../icons/rss/delete rss.svg" alt="Delete RSS feed button">
        </a>
    </div>
</div>
`

function createFeedOptions (feedsToCreate) {
    console.log(feedsToCreate);
    for (let itemKey in feedsToCreate) {
        let item = feedsToCreate[itemKey];
        console.log(item);
        console.log("functional? ", item.functionality);
        try {
            if (item.functionality === "true") {
                console.log("functional");
            } else {
                console.log("broken");
            }
        } catch (error) {
            console.log(error)
        }
    }
}


// Checks if the feed is functioanl or not
function checkFeedFunctionality(feedsToCheck) {
    const feedsDict = {};
    var isFeedFunctional;
    for (let item of feedsToCheck) {
        feedsDict[item.feed_id] = item; //All feed rows can expect to have a feed_id in the db, so it indexes by it. 
        fetch(`/api/rssFeedChecker?feedToCheck=${item.feed_url}`) //Send to server for checking
            .then(response => response.json())
            .then(data => {                
                isFeedFunctional = data.result.toString();
                feedsDict[item.feed_id].functionality = isFeedFunctional; //"Functionality" is true/false based on if the RSS feed is broken or not.
            })
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
            .then(data => {
                createFeedOptions(checkFeedFunctionality(data))
            })

    } catch (error) {
        console.error('Error in rss-settings.js: ', error);
    }
};


getRSSFeedsFromServer ();