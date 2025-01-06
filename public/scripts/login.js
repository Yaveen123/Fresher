//‘Appwrite’ (2024) Setup Google OAuth sign in 6 minutes, Accessed 6 Jan 2025 https://youtu.be/tgO_ADSvY1I

import { account } from './appwrite.js';

const loginBtn = document.getElementById("login-button");
const logoutBtn = document.getElementById("logout-button");
const profileScreen = document.getElementById("profile-screen");
const loginScreen = document.getElementById("login-screen");

loginBtn.addEventListener("click", handleLogin, false);
logoutBtn.addEventListener("click", handleLogout, false);

async function handleLogin() {
    console.log("helo");
    account.createOAuth2Session(
        Appwrite.OAuthProvider.Google,
        'http://localhost:8000/',
        'http://localhost:8000/fail'
    );
}

async function getUser() {
    try {
        const user = await account.get();
        renderProfileScreen(user);
    } catch (error) {
        renderLoginScreen();
    }
}

function renderLoginScreen() {
    loginScreen.style.display = '';
}

async function renderProfileScreen(user) {
    console.log(user);
    document.getElementById("temp-login-status").innerHTML = user.name;
    profileScreen.style.display = ''; //‘Blackus’ (2015) Remove Style on Element, Accessed 6 Jan 2025 https://stackoverflow.com/questions/18691655/remove-style-on-element 
}
async function handleLogout() {
    account.deleteSession('current');
    profileScreen.style.display = 'none';
    renderLoginScreen();
}

getUser();