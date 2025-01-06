import {account} from '../scripts/appwrite.js';
import '../css/components/comp-buttons.css';

const loginBtn = document.getElementById("login-button");
const logoutBtn = document.getElementById("logout-button");
const profileScreen = document.getElementById("profile-screen");
const loginScreen = document.getElementById("login-screen");

document.getElementById("login-button").addEventListener ("click", test(), false);

function test() {
    console.log("WHAT")
}

async function handleLogin() {
    console.log("helo")
    account.createOAuth2Session(
        OAuthProvider.Google,
        'http://localhost:8000/',
        'http://localhost:8000/fail'
    )
}

async function getUser() {
    try {
        const user = await account.get()
        renderProfileScreen(user);
    } catch(error) {
        renderLoginScreen();
    }
}

function renderLoginScreen() {
    loginScreen.style.display = '';
}

async function renderProfileScreen (user) {
    document.getElementById("temp-login-status").innerHTML = user;
    profileScreen.style.display = '';
}

async function handleLogout () {
    account.deleteSession('current');
    profileScreen.style.display = 'none';
    renderLoginScreen;
}

getUser()