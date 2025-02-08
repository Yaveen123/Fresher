import { account } from './appwrite.js';

// Fetch the account settings from the server to show to the user.
async function fetchAccountSettings() {
    // Tries to get the user
    try {
        // Get the user's google ID
        const user = await account.get();
        const googleId = user.$id;

        // Fetch the settings using a GET request to the API
        fetch(`/api/accountSettings?google_id=${googleId}`)
            .then(response => response.json())
            .then(data => {
                // This returns the username of the user and adds it into the page via DOM manipulation
                document.getElementById("acc-name").value = data[0].account_name;
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
        
        // Shows everything that needs to be visible like the settings
        for (let item of document.getElementsByClassName('loadable-content')) {
            item.style.visibility = "visible";
        }

        // Hides the loader 
        document.getElementById("loader").style.display = "none";
    
    // Otherwise throw an error into the client console. 
    } catch (error) {
        console.error('Error fetching user:', error);
    }
}

fetchAccountSettings();




    