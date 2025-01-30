




function testFetch() {
    console.log("OWOWOWOOWWOWOW");
    fetch('/api/data1')
    .then(response => response.json())
    .then(data => {
        document.getElementsByClassName("comp-header-text")[0].innerHTML = data[0].google_token;
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}



