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
    profileScreen.style.display = '';
}

async function handleLogout() {
    account.deleteSession('current');
    profileScreen.style.display = 'none';
    renderLoginScreen();
}

getUser();