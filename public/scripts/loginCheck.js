import { account } from './appwrite.js';

// This code is designed to check if the user is still logged in, by seeing if Appwrite has a valid auth token in the user's sessionStorage 
async function checkIfLoggedIn() {
    // Tries to get the account settings 
    try { 
        const user = await account.get();

        // Gets the google ID and shoves it into any google-id element 
        // This is typically for forms, as when the client pushes queries via an action it can just put the google ID as a well hidden imposter field (shh...)
        try {
            document.getElementById("google-id").value = user.$id;
        } catch (error) {
            console.log("Page does not have G-ID element.")
        }
    // If there isn't an account available then go back to login page
    } catch (error) {
        window.location.href = "../";
    }
}

checkIfLoggedIn();