import { account } from './appwrite.js';

const template_header = `
    <!-- Contains the title of the feed -->
    <div class="comp-header">
        <p class="comp-header-text" id="test-feed-title">Feed title</p>  <!-- Title of the feed -->
        
    </div>
`
const template_article = `
<!-- Article -->
<div class="card-content">
    <!-- Article image -->
    <img src="../images/placeholder.png" class="card-content-image" alt="An image for this article.">
    <!-- Article title -->
    <p class="card-content-title">Article title</p>
</div>
<!-- Article description -->
<p class="card-description"> Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nam autem neque vel aperiam et officiis sequi ratione dicta recusandae numquam reiciendis praesentium, blanditiis optio soluta tempora alias. Dolore, omnis aliquid!</p>
`



// "MikeM" (2013) Extract image src from a string, Accessed Jan 30 2025 https://stackoverflow.com/questions/14939296/extract-image-src-from-a-string 
async function getImageUrl(description) {
    const imgTagMatch = description.match(/<img[^>]+src="([^">]+)"/);
    if (imgTagMatch && imgTagMatch[1]) {
        return imgTagMatch[1];
    } else {
        return false;
    }
}

//Trims a string to a certain amount of characters.
// "Will" (2011) How to trim a string to N chars in javascript? Accessed 30 Jan 2025 https://stackoverflow.com/questions/7463658/how-to-trim-a-string-to-n-chars-in-javascript 
async function trimString(string, length) {
    return string.length > length ? string.substring(0, length - 3) + "..." : string.substring(0, length);
}

// Changes the height of images based on the text available on mobile devices.
async function makeArticleImageHeightResponsive() {
    if (document.documentElement.clientWidth < 600) { // When the width of the screen is less than 600 (mobile)...
        const images = document.querySelectorAll(".card-content-image"); // Get all images
        const titles = document.querySelectorAll(".card-content-title"); // Get all title objects
        images.forEach(async (image, index) => { // For all of the images...
            image.style.height = titles[index].offsetHeight + 'px'; // Set their height to be equal to the height of the title
        });
    }
    window.addEventListener('resize', async () => { // When the window resizes, do it all again
        if (document.documentElement.clientWidth < 600) {
            const images = document.querySelectorAll(".card-content-image");
            const titles = document.querySelectorAll(".card-content-title");
            images.forEach(async (image, index) => {
                image.style.height = titles[index].offsetHeight + 'px';
            });
        } else { // except if the device is desktop/tablet...
            const images = document.querySelectorAll(".card-content-image"); // then get all images
            images.forEach(async (image) => { // and set their height to 278 px
                image.style.height = '278px';
            });
        }
    });
}



async function displayContent(dataToDisplay, settingsForFeed) {
    // Sets the amount of articles to be generated to be equal or less than the maximum amount specified in the feed settings. 
    const numOfArticles = dataToDisplay.items.length > settingsForFeed.feed_article_num ? settingsForFeed.feed_article_num : dataToDisplay.items.length 
    //Num of articles   = IF the amt of articles in feed > amount specified in settings THEN return amount specified in settings ELSE return amount inside feed
    // Tenary operator.

    // Check if at least one article has a title (if not then don't render the header)
    let allArticlesHaveTitles = false;
    for (let i = 0; i < numOfArticles; i++) {
        const article = dataToDisplay.items[i];
        const articleTitle = await trimString(article.title, 60).then(allArticlesHaveTitles = true);
    }
    
    if (allArticlesHaveTitles == false) {
        console.log("Feed has no articles with a title, ", dataToDisplay);
    } else {

        const domTitle = document.createElement("section");
        domTitle.className = "feed-container";
        domTitle.innerHTML = template_header;
        domTitle.id = settingsForFeed.feed_id;
        domTitle.querySelector('.comp-header-text').innerHTML = settingsForFeed.feed_name;
        document.getElementById("truebody").appendChild(domTitle);

        for (let i = 0; i < numOfArticles; i++) {
            // Get all article content
            const article = dataToDisplay.items[i];
            try {
                var articleImage = await getImageUrl(article.content);
                if (articleImage == false) {
                    try { articleImage = await getImageUrl(article['content:encoded']);} 
                    catch (error) { console.log(error); }
                }
            } catch (error) { console.log(error); }

            const articleTitle = await trimString(article.title, 100).catch(error => {
                console.log("Error with article title", error);
                return false;
            });
            const articleDescription = await trimString(article.contentSnippet, 200).catch(error => {
                console.log("Error with article description", error);
                return false;
            });
            const articleLink = article.link || '#'; // Sets href to '#' if no link available.

            //Create an article
            const domArticle = document.createElement("a");
            domArticle.className = "card";
            domArticle.id = settingsForFeed.feed_id + "mark" + i;
            domArticle.href = articleLink;
            domArticle.target = "_blank"; //open link in new tab
            domArticle.innerHTML = template_article;

            if (articleImage != false && articleDescription != false && settingsForFeed.feed_show_description != "never" && settingsForFeed.feed_show_image != "never") {
                // Create a full article
                domArticle.querySelector('.card-content-title').innerHTML = articleTitle;
                domArticle.querySelector('.card-content-image').src = articleImage;
                domArticle.querySelector('.card-description').innerHTML = articleDescription;

            } else if (articleImage != false && settingsForFeed.feed_show_image != "never") {
                // Create article WITHOUT description
                domArticle.querySelector('.card-content-title').innerHTML = articleTitle;
                domArticle.querySelector('.card-content-image').src = articleImage;
                domArticle.querySelector('.card-description').remove();

            } else if (articleDescription != false && settingsForFeed.feed_show_description != "never") {
                // Create article WITHOUT image 
                domArticle.querySelector('.card-content-title').innerHTML = articleTitle;
                domArticle.querySelector('.card-content-image').remove();
                domArticle.querySelector('.card-description').innerHTML = articleDescription;
            } else {
                // Create article with just the title
                domArticle.querySelector('.card-content-title').innerHTML = articleTitle;
                domArticle.querySelector('.card-content-image').remove();
                domArticle.querySelector('.card-description').remove();
            }
            document.getElementById(settingsForFeed.feed_id).appendChild(domArticle);
            await new Promise(resolve => setTimeout(resolve, 10)); // Transition animation
        }
    }
}


// Get the server to ping the rss-parser module to return the rss feed data back. 
async function retrieveDataFromFeed(feed_url) { 
    return fetch(`/api/rssFeedChecker?feedToCheck=${feed_url}`) // Server api call
        .then(response => response.json())
        .then(data => {
            if (data.result == true) { // Checks if the server can or cannot reach the feed
                return data.feedData; 
            } else {
                console.log("Server couldn't obtain RSS feed data for feed: ", data);
                return false;
            }
        })
        .catch(error => {
            console.log("Couldn't get RSS data from server: ", error);
            return false;
        });
}



// Get the list of feeds from the server
async function getFeedsFromServer(google_id) {
    try {
        const response = await fetch(`/api/rssFeeds?google_id=${google_id}`);
        const data = await response.json();

        
        
        let successfulFeeds = 0; // Counter for successful feeds
        let failedFeeds = 0;

        for (let feed of data) { // Loop through all of the feeds 
            const dataToDisplay = await retrieveDataFromFeed(feed.feed_url); // Gets the feed data

            if (dataToDisplay != false) { // Does not continue if the RSS feed failed.
                console.log(dataToDisplay);
                await displayContent(dataToDisplay, feed);
                successfulFeeds++; // Increment counter for each successful feed
            } else {
                failedFeeds++; // Incrememnt counter for each unsuccessful feed (differentiate between what err message to show)
            }
        }

        if (successfulFeeds > 0) {
            console.log(`${successfulFeeds} RSS feeds successfully displayed.`);
            if (failedFeeds > 0) {
                document.getElementById("some_broken").parentNode.appendChild(document.getElementById("some_broken")); //Kinal, R (2010) Moving a div element to bottom of parent as last child, accessed Feb 6 2025 https://stackoverflow.com/questions/3415480/moving-a-div-element-to-bottom-of-parent-as-last-child 
                document.getElementById("some_broken").style.display = "block";
            }
        } else {
            console.log("No RSS feeds were successfully displayed.");
            if (failedFeeds > 0) {
                document.getElementById("all_broken").style.display = "block";
            } else {
                document.getElementById("none_available").style.display = "block";
            } 
        }

        await makeArticleImageHeightResponsive();
    } catch (error) {
        console.log("Couldn't get feeds list from server: ", error);
    }
}



async function mainFeed() {
    try {
        const user = await account.get();
        const google_id = user.$id;

        await getFeedsFromServer(google_id);

        

        document.getElementById("hideonload").className = "progress hidden";
        await new Promise(resolve => setTimeout(resolve, 500));
        document.getElementById("showonload").className = "visible";
        
    } catch (error) {
        console.error('Error fetching user:', error);
    }
}

mainFeed();


