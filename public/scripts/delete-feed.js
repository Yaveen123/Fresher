// This logic is in a seperate file as it can't be imported as a module

// Function to delete a feed when the feed ID is in the URL (i.e. deleting when inside the feed settings)
function deleteRSSFeed() {
    // Finds the feed ID from the URL 
    const urlParams = new URLSearchParams(window.location.search);
    const feedID = urlParams.get("feed");

    fetch(`/api/deleteFeed?feed_id=${feedID}`) // Sends a request to the server to delete the RSS feed
        .then(response => response.json())
        .then(async data => { 
            window.location.replace(data.redirectto); //Redirects to the specified redirect page
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// Function to delete a feed when the feed ID is NOT in the URL and instead is inside the fetch params (i.e. deleting feed when viewing all feeds in rss settings)
function deleteRSSFeedWithParam(feedID) {
    fetch(`/api/deleteFeed?feed_id=${feedID}`) // Sends a request to the server to delete the RSS feed
        .then(response => response.json())
        .then(async data => { 
            history.go(0);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}