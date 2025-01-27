import { account } from './appwrite.js';

// Check if the feed belongs to a specific user
async function checkIfFeedBelongsToUser(googleId, data) {
    try {
        if (googleId != data[0].google_id) { // if the feed does not belong to the user...
            console.log("THIS FEED DOES NOT BELONG TO YOU!!")
            window.location.replace("/html/settings-rss.html"); // go back to the rss settings page
            while (true) {
                await new Promise(resolve => setTimeout(resolve, 5000)); // force a wait for 5 seconds while the browser loads the page
            }
        }
    } catch (error) {
        console.log(error); // can be used for breakpoints
        window.location.replace("/html/settings-rss.html");
    }
}

async function fetchFeedSettings() {
    try {
        const user = await account.get();
        const googleId = user.$id;

        let feedID;
        try {
            const urlParams = new URLSearchParams(window.location.search);
            feedID = urlParams.get("feed");
            console.log(feedID);
        } catch (error) {
            console.log(error);
        }
        
        console.log("-------------")
        console.log(feedID);

        fetch(`/api/feedSettings?feed=${feedID}&googleid=${googleId}`)
            .then(response => response.json())
            .then(async data => {
                console.log(data);

                await checkIfFeedBelongsToUser(googleId, data);

                document.getElementById("srf-name").value = data[0].feed_name;
                document.getElementById("srf-url").value = data[0].feed_url;
                document.getElementById("srf-articlenum").value = data[0].feed_article_num;
                document.getElementById("feed-name-header").textContent = data[0].feed_name;
                for (let option of document.getElementById("srf-view").options) {
                    if (option.value === data[0].feed_view_type) {
                        option.selected = true;
                        break;
                    }
                }
                for (let option of document.getElementById("srf-image").options) {
                    if (option.value === data[0].feed_show_image) {
                        option.selected = true;
                        break;
                    }
                }
                for (let option of document.getElementById("srf-description").options) {
                    if (option.value === data[0].feed_show_description) {
                        option.selected = true;
                        break;
                    }
                }
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

