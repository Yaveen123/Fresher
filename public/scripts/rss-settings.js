import { account } from './appwrite.js'

function checkFeedFunctionality(feedsToCheck) {
    const feedsDict = [];
    const feedsLen = feedsToCheck.length;
    
    for (let item of feedsToCheck) {
        console.log(item);
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