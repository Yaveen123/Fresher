import { account } from './appwrite.js';

// Check if the feed belongs to a specific user
// MARK: checkIfFeedBelongsToUser(...)
async function checkIfFeedBelongsToUser(googleId, data) {
    try {
        if (googleId != data[0].google_id) { // if the feed does not belong to the user...
            console.log("You attempted to access a feed that does not belong to you.")
            window.location.replace("/html/settings-rss.html"); // go back to the rss settings page
            while (true) {
                await new Promise(resolve => setTimeout(resolve, 5000)); // force a wait for 5 seconds while the browser loads the page
            }
        }
    } catch (error) {
        console.log("Check if feeds belong to user: ", error); // can be used for breakpoints
        window.location.replace("/html/settings-rss.html");
    }
}


// MARK: fetchFeedSettings()
async function fetchFeedSettings() {
    try {
        // Gets the user's google ID
        const user = await account.get();
        const googleId = user.$id;

        // Fetch the feed settings for the feed that is in the URL
        let feedID;
        try {
            const urlParams = new URLSearchParams(window.location.search);
            feedID = urlParams.get("feed");
        } catch (error) {
            console.log("Error fetching feed settings: ", error);
        }

        // Fetches feed settings for a specific feed from the server
        // Passes in googleID to check if the feed belongs to that specific user
        fetch(`/api/feedSettings?feed=${feedID}&googleid=${googleId}`)
            .then(response => response.json())
            .then(async data => {

                //Checks if this feed belongs to this specific user
                await checkIfFeedBelongsToUser(googleId, data);

                // Adds the feed name
                document.getElementById("srf-name").value = data[0].feed_name;
                document.getElementById("srf-url").value = data[0].feed_url;
                document.getElementById("srf-articlenum").value = data[0].feed_article_num;
                document.getElementById("feed-name-header").textContent = data[0].feed_name;

                // Dropdown for view type
                for (let option of document.getElementById("srf-view").options) {
                    if (option.value === data[0].feed_view_type) {
                        option.selected = true;
                        break;
                    }
                }

                // Dropdown for image visual type
                for (let option of document.getElementById("srf-image").options) {
                    if (option.value === data[0].feed_show_image) {
                        option.selected = true;
                        break;
                    }
                }

                // Dropdown for description type
                for (let option of document.getElementById("srf-description").options) {
                    if (option.value === data[0].feed_show_description) {
                        option.selected = true;
                        break;
                    }
                }

                // Hides the loader
                for (let item of document.getElementsByClassName('loadable-content')) {
                    item.style.visibility = "visible";
                }
                document.getElementById("loader").style.display = "none";
                document.getElementById("feed-id").value = data[0].feed_id;
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    } catch (error) {
        console.error('Error fetching user:', error);
    }
}



fetchFeedSettings();

