function fetchAccountSettings() {
    fetch('/api/accountSettings')
    .then(response => response.json())
    .then(data => {
        console.log(data); // Output: { message: 'Hello from the server!' }
        document.getElementById("acc-name").value = data[0].account_name;
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}