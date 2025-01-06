//‘Appwrite’ (2024) Setup Google OAuth sign in 6 minutes, Accessed 6 Jan 2025 https://youtu.be/tgO_ADSvY1I

const client = new Appwrite.Client();
client
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject("677b9d6a003b20df0022"); // Replace with your project ID

export const account = new Appwrite.Account(client);
export const databases = new Appwrite.Databases(client);
 