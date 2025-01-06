const client = new Appwrite.Client();
client
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject("677b9d6a003b20df0022"); // Replace with your project ID

export const account = new Appwrite.Account(client);
export const databases = new Appwrite.Databases(client);