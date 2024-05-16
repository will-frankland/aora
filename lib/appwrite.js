import { Account, Avatars, Client, Databases, ID, Query } from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.wf.aora",
  // projectId: process.env.APPWRITE_PROJECT_ID,
  // databaseId: process.env.APPWRITE_DATABASE_ID,
  // userCollectionId: process.env.APPWRITE_USER_COLLECTION_ID,
  // videoCollectionId: process.env.APPWRITE_VIDEO_COLLECTION_ID,
  // storageId: process.env.APPWRITE_STORAGE_ID,
  projectId: '6643ab750000a5f38adb',
  databaseId: '6643ac6e00118cad2759',
  userCollectionId: '6643ac81002fa9e1bdd5',
  videoCollectionId: '6643ac6e00118cad2759',
  storageId: '6643adf600155f02e065',
};

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUser = async (email, password, username) => {
  try {
    // Create new account
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );
    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      }
    );

    return newUser;

  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const signIn = async (email, password) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (error) {
    throw new Error(error);
  }
}

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    if(!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
    )

    if (!currentUser) throw Error;

    return currentUser.documents[0]

  } catch (error) {
    console.log(error)
  }
}
