import { account } from './appwrite.js';

async function fetchAccountSettings() {
    try {
        const user = await account.get();
        const googleId = user.$id;

        fetch(`/api/accountSettings?google_id=${googleId}`)
            .then(response => response.json())
            .then(data => {
                document.getElementById("acc-name").value = data[0].account_name;
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    } catch (error) {
        console.error('Error fetching user:', error);
    }
}

fetchAccountSettings();