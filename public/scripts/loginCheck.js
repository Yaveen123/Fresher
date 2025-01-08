import { account } from './appwrite.js';

async function checkIfLoggedIn() {
    try {
        const user = await account.get();
        document.getElementById("google-id").value = user.$id;
    } catch (error) {
        window.location.href = "../";
    }
}
checkIfLoggedIn();