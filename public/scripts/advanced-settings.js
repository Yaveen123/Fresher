import { account } from './appwrite.js';

async function fetchAdvancedSettings() {
    try {
        const user = await account.get();
        const googleId = user.$id;

        fetch(`/api/advancedSettings?google_id=${googleId}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                // Evangelista, A (2023) How to set default selected value in dropdown using JS. Accessed 6 Jan 2025 https://itsourcecode.com/javascript-tutorial/how-to-set-default-selected-value-in-dropdown-using-javascript/ 
                for (let option of document.getElementById("adv-prov").options) {
                    if (option.value === data[0].advanced_show_provider) {
                        option.selected = true;
                        break;
                    }
                }
                document.getElementById("adv-prov").style.display = '';
                for (let option of document.getElementById("adv-age").options) {
                    if (option.value === data[0].advanced_show_age) {
                        option.selected = true;
                        break;
                    }
                }
                document.getElementById("adv-age").style.display = '';
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    } catch (error) {
        console.error('Error fetching user:', error);
    }
}

fetchAdvancedSettings();

