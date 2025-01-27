function deleteRSSFeed() {
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

function deleteRSSFeedWithParam(feedID) {
    fetch(`/api/deleteFeed?feed_id=${feedID}`) // Sends a request to the server to delete the RSS feed
        .then(response => response.json())
        .then(async data => { 
            window.location.replace(data.redirectto); //Redirects to the specified redirect page
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}