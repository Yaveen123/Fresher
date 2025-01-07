import { account } from './appwrite.js';

async function checkIfLoggedIn() {
    try {
        const user = await account.get();
    } catch (error) {
        window.location.href = "../";
    }
}
checkIfLoggedIn();