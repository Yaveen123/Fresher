import { account } from './appwrite.js';

//MARK: HTML templates
// Used as blueprints to append information into the feed
// Template for the feed title
const template_header = `
    <!-- Contains the title of the feed -->
    <div class="comp-header">
        <p class="comp-header-text" id="test-feed-title">Feed title</p>  <!-- Title of the feed -->
        
    </div>
`
// Template for an article
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


// MARK: getImageUrl(...)
// Tries to search inside some HTML and get an image
// "MikeM" (2013) Extract image src from a string, Accessed Jan 30 2025 https://stackoverflow.com/questions/14939296/extract-image-src-from-a-string 
async function getImageUrl(description) {
    const imgTagMatch = description.match(/<img[^>]+src="([^">]+)"/); // Regex matching
    
    // If it found an image, return it, else return false.
    if (imgTagMatch && imgTagMatch[1]) { 
        return imgTagMatch[1];
    } else {
        return false;
    }
}

// MARK: trimString(...)
// Trims a string to a certain amount of characters.
// "Will" (2011) How to trim a string to N chars in javascript? Accessed 30 Jan 2025 https://stackoverflow.com/questions/7463658/how-to-trim-a-string-to-n-chars-in-javascript 
async function trimString(string, length) {
    return string.length > length ? string.substring(0, length - 3) + "..." : string.substring(0, length);
}

// MARK: makeArticleImageHeightResponsive()
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


// MARK: displayContent(...)
// Displays the content into the feed
async function displayContent(dataToDisplay, settingsForFeed) {
    // Sets the amount of articles to be generated to be equal or less than the maximum amount specified in the feed settings. 
    const numOfArticles = dataToDisplay.items.length > settingsForFeed.feed_article_num ? settingsForFeed.feed_article_num : dataToDisplay.items.length  //Num of articles   = IF the amt of articles in feed > amount specified in settings THEN return amount specified in settings ELSE return amount inside feed

    // Check if at least one article has a title (if not then don't render the header)
    let allArticlesHaveTitles = false;
    for (let i = 0; i < numOfArticles; i++) {
        const article = dataToDisplay.items[i];
        const articleTitle = await trimString(article.title, 60).then(allArticlesHaveTitles = true);
    }
    
    // If no articles inside the RSS feed has a title, Fresher won't display that feed at all
    if (allArticlesHaveTitles == false) {
        console.log("Feed has no articles with a title, ", dataToDisplay);

    } else {
        // Creates the title of the feed
        const domTitle = document.createElement("section");
        domTitle.className = "feed-container";
        domTitle.innerHTML = template_header;
        domTitle.id = settingsForFeed.feed_id;
        domTitle.querySelector('.comp-header-text').innerHTML = settingsForFeed.feed_name;
        document.getElementById("truebody").appendChild(domTitle);

        // Creates the articles
        for (let i = 0; i < numOfArticles; i++) {

            // variable "article" is this specific article inside items[i]
            const article = dataToDisplay.items[i];

            // Tries to get the article image using the function getImageUrl
            try {
                var articleImage = await getImageUrl(article.content); 
                if (articleImage == false) {
                    try { articleImage = await getImageUrl(article['content:encoded']);} // Sometimes the image will be inside content:encoded
                    catch (error) { console.log("Failed to get image url: ", error); }
                }
            } catch (error) { console.log("Failed to get image url: ", error); }

            // Trims the title of the article to 100 characters
            const articleTitle = await trimString(article.title, 100).catch(error => {
                console.log("Error with article title", error);
                return false;
            });
            
            // Trims the description of the article to 200 characters
            const articleDescription = await trimString(article.contentSnippet, 200).catch(error => {
                console.log("Error with article description", error);
                return false;
            });

            // Sets href of article to '#' if no link available.
            const articleLink = article.link || '#'; 

            // Create an article element
            const domArticle = document.createElement("a");
            domArticle.className = "card";
            domArticle.id = settingsForFeed.feed_id + "mark" + i;
            domArticle.href = articleLink;
            domArticle.target = "_blank"; //open link in new tab
            domArticle.innerHTML = template_article;

            // When all information necessesary is present
            // Create a full article
            if (articleImage != false && articleDescription != false && settingsForFeed.feed_show_description != "never" && settingsForFeed.feed_show_image != "never") {
                domArticle.querySelector('.card-content-title').innerHTML = articleTitle;
                domArticle.querySelector('.card-content-image').src = articleImage;
                domArticle.querySelector('.card-description').innerHTML = articleDescription;

            // When description is missing
            // Create article WITHOUT description
            } else if (articleImage != false && settingsForFeed.feed_show_image != "never") {
                domArticle.querySelector('.card-content-title').innerHTML = articleTitle;
                domArticle.querySelector('.card-content-image').src = articleImage;
                domArticle.querySelector('.card-description').remove();

            // When image is missing
            // Create article WITHOUT image 
            } else if (articleDescription != false && settingsForFeed.feed_show_description != "never") {
                domArticle.querySelector('.card-content-title').innerHTML = articleTitle;
                domArticle.querySelector('.card-content-image').remove();
                domArticle.querySelector('.card-description').innerHTML = articleDescription;
            
            // When both image and description is missing
            // Create article with just the title
            } else {
                domArticle.querySelector('.card-content-title').innerHTML = articleTitle;
                domArticle.querySelector('.card-content-image').remove();
                domArticle.querySelector('.card-description').remove();
            }
            
            // Add the article to the feed
            document.getElementById(settingsForFeed.feed_id).appendChild(domArticle);

            // Wait 10ms before loading the next article (transition animation)
            await new Promise(resolve => setTimeout(resolve, 10)); 
        }
    }
}


// MARK: retrieveDataFromFeed(...)
// Get the server to ping the rss-parser module to return the rss feed data back. 
async function retrieveDataFromFeed(feed_url) { 
    return fetch(`/api/rssFeedChecker?feedToCheck=${feed_url}`) // Server api call
        .then(response => response.json())
        .then(data => {
            // Checks if the server can or cannot reach the feed
            if (data.result == true) { 
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


// MARK: getFeedsFromServer(...)
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
                await displayContent(dataToDisplay, feed);
                successfulFeeds++; // Increment counter for each successful feed
            } else {
                failedFeeds++; // Incrememnt counter for each unsuccessful feed (differentiate between what err message to show)
            }
        }

        // If at least 1 feed showed successfully, console log a success message
        if (successfulFeeds > 0) {
            console.log(`${successfulFeeds} RSS feeds successfully displayed.`);

            // If at least 1 feed failed, show the notice text the bottom "Some RSS feeds weren't able to be displayed..."
            if (failedFeeds > 0) {
                document.getElementById("some_broken").parentNode.appendChild(document.getElementById("some_broken")); //Kinal, R (2010) Moving a div element to bottom of parent as last child, accessed Feb 6 2025 https://stackoverflow.com/questions/3415480/moving-a-div-element-to-bottom-of-parent-as-last-child 
                document.getElementById("some_broken").style.display = "block";
            }
        
        // If no feeds were showed successfully, it could be because...
        } else {
            console.log("No RSS feeds were successfully displayed.");
            
            //... all of them are broken.  
            if (failedFeeds > 0) {
                document.getElementById("all_broken").style.display = "block";
            } else {
            //... or there aren't any to display. 
                document.getElementById("none_available").style.display = "block";
            } 
            // Shows appropriate image sizes
        }

        // Makes the article images match article sizes on mobile
        await makeArticleImageHeightResponsive();
    
    } catch (error) {
        console.log("Couldn't get feeds list from server: ", error);
    }
}


// MARK: mainFeed()
// The main function
async function mainFeed() {
    try {
        // Get google ID from user
        const user = await account.get();
        const google_id = user.$id;

        // Gets the feeds to display from the server
        await getFeedsFromServer(google_id);

        // Shows/hides the top progress bar
        document.getElementById("hideonload").className = "progress hidden";
        await new Promise(resolve => setTimeout(resolve, 500));
        document.getElementById("showonload").className = "visible";
        
    } catch (error) {
        console.error('Error fetching user:', error);
    }
}

mainFeed();


