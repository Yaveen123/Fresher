import { account } from './appwrite.js'

function checkFeedFunctionality(feedsToCheck) {
    const feedsDict = [];
    const feedsLen = feedsToCheck.length;
    var inputIntoFeedsDict = []
    for (let item of feedsToCheck) {
        inputIntoFeedsDict = [];
        fetch(`/api/rssFeedChecker?feedToCheck=${item.feed_url}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
            })
    }
}

async function getRSSFeedsFromServer () {
    try {
        const user = await account.get(); // Get the account and then get their google ID
        const googleID = user.$id; 

        fetch(`/api/rssFeeds?google_id=${googleID}`) 
            .then(response => response.json())
            .then(data => {
                const feedsDict = checkFeedFunctionality(data);
            })
    } catch (error) {
        console.error('Error in rss-settings.js: ', error);
    }
};


getRSSFeedsFromServer ();