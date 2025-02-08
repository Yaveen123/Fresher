import { account } from './appwrite.js';

// Function to retrieve the settings for the user for the advanced settings section
async function fetchAdvancedSettings() {
    try {

        // Gets the user's google ID 
        const user = await account.get();
        const googleId = user.$id;

        // Fetches the settings for the user via a GET request on the API
        fetch(`/api/advancedSettings?google_id=${googleId}`)
            .then(response => response.json())
            .then(data => {

                // DOM manipulates the information into the settings.
                // DOM manipulates the settings for a dropdown. From Evangelista, A (2023) How to set default selected value in dropdown using JS. Accessed 6 Jan 2025 https://itsourcecode.com/javascript-tutorial/how-to-set-default-selected-value-in-dropdown-using-javascript/ 
                // Show provider dropdown
                for (let option of document.getElementById("adv-prov").options) {
                    if (option.value === data[0].advanced_show_provider) {
                        option.selected = true;
                        break;
                    }
                }
                // Show article age dropdown
                document.getElementById("adv-prov").style.display = '';
                for (let option of document.getElementById("adv-age").options) {
                    if (option.value === data[0].advanced_show_age) {
                        option.selected = true;
                        break;
                    }
                }

                // Unhides all the elements when finished loading
                document.getElementById("adv-age").style.display = '';
                for (let item of document.getElementsByClassName('loadable-content')) {
                    item.style.visibility = "visible";
                }
                document.getElementById("loader").style.display = "none";
            
            })
            .catch(error => {
                // Error catcher!! Relays server errors here
                console.error('Error fetching data:', error);
            });

    } catch (error) {
        // Error catcher, for relaying client errors
        console.error('Error fetching user:', error);
    }
}

fetchAdvancedSettings();

