
// Changes the height of images based on the text available on mobile devices.
function makeArticleImageHeightResponsive() {
    if (document.documentElement.clientWidth < 600) { // When the width of the screen is less than 600 (mobile)...
            const images = document.querySelectorAll(".card-content-image"); // Get all images
            const titles = document.querySelectorAll(".card-content-title"); // Get all title objects
            images.forEach((image, index) => { // For all of the images...
                image.style.height = titles[index].offsetHeight + 'px'; // Set their height to be equal to the height of the title
            });
        }
    window.addEventListener('resize', () => { // When the window resizes, do it all again
        if (document.documentElement.clientWidth < 600) {
            const images = document.querySelectorAll(".card-content-image");
            const titles = document.querySelectorAll(".card-content-title");
            images.forEach((image, index) => {
                image.style.height = titles[index].offsetHeight + 'px';
            });
        } else { // except if the device is desktop/tablet...
        const images = document.querySelectorAll(".card-content-image"); // then get all images
        images.forEach((image) => { // and set their height to 278 px
            image.style.height = '278px';
        });
        }
    });
}

function testFetch() {
    fetch('/api/data1')
    .then(response => response.json())
    .then(data => {
        console.log(data); // Output: { message: 'Hello from the server!' }
        document.getElementsByClassName("comp-header-text")[0].innerHTML = data[0].google_token;
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}

