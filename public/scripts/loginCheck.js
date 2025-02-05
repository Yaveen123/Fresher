import { account } from './appwrite.js';




async function checkIfLoggedIn() {
    try {
        const user = await account.get();
        console.log(user);

        try {
            document.getElementById("google-id").value = user.$id;
        } catch (error) {
            console.log("Page does not have G-ID element.")
        }
    } catch (error) {
        window.location.href = "../";
    }
}

checkIfLoggedIn();