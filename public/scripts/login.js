//‘Appwrite’ (2024) Setup Google OAuth sign in 6 minutes, Accessed 6 Jan 2025 https://youtu.be/tgO_ADSvY1I 
// Vendor provided code created to manage OAuth sign in w/ google
import { account } from './appwrite.js';

// Setup all elements
const loginBtn = document.getElementById("login-button");
const logoutBtn = document.getElementById("logout-button");
const profileScreen = document.getElementById("profile-screen");
const loginScreen = document.getElementById("login-screen");

// Add listeners to see if the buttons where clicked or not
loginBtn.addEventListener("click", handleLogin, false);
logoutBtn.addEventListener("click", handleLogout, false);

// MARK: handleLogin()
async function handleLogin() {
    //Creates an OAuth session for the user, and initates Sign in with Google
    account.createOAuth2Session(
        Appwrite.OAuthProvider.Google,
        'http://localhost:8000/',
        'http://localhost:8000/fail',
    );
}

//MARK: getUser()
async function getUser() {
    try {
        // Gets the user profile from Appwrite SDK
        const user = await account.get();

        // Shows the profile screen
        renderProfileScreen(user);
    
    // If there was a problem, show the login screen
    } catch (error) {
        renderLoginScreen();
    }
}

// MARK: renderLoginScreen()
// Shows the login screen
function renderLoginScreen() {
    loginScreen.style.display = '';
}

//MARK: renderProfileScreen(...)
async function renderProfileScreen(user) {
    //Gets the username from the server
    fetch('/api/getUsername', {
        method: "POST",
        body: JSON.stringify({ 'account_id': user.$id }), // Send the Google ID
        headers: { //Set the endpoint to support this
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .then((response) => response.json())
    .then((json) => {
        // Shows the username
        document.getElementById("temp-login-status").innerHTML = json[0].account_name;
    });
    
    // Displays the launch screen and hides the login screen
    profileScreen.style.display = ''; //‘Blackus’ (2015) Remove Style on Element, Accessed 6 Jan 2025 https://stackoverflow.com/questions/18691655/remove-style-on-element 
    loginScreen.style.display = 'none';

    //Logs the user in
    fetch('/api/logUserIn', {
        method: "POST",
        body: JSON.stringify(user), // Send the user data from google
        headers: { //Set the endpoint to support this
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .then((response) => response.json())
}

// MARK: handleLogout()
async function handleLogout() {
    // Deletes the current session from the user, hides the launch screen, and shows the login screen
    account.deleteSession('current');
    profileScreen.style.display = 'none';
    renderLoginScreen();
}

getUser();