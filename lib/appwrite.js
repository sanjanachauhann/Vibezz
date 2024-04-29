import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";
import { Platform } from "react-native";
const client = new Client();

export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_ENDPOINT,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  databaseId: process.env.EXPO_PUBLIC_DATABASE_ID,
  userCollectionId: process.env.EXPO_PUBLIC_USER_COLLECTION_ID,
  videoCollectionId: process.env.EXPO_PUBLIC_VIDEO_COLLECTION_ID,
  bookmarkCollectionId: process.env.EXPO_PUBLIC_BOOKMARK_COLLECTION_ID,
  photosCollectionId: process.env.EXPO_PUBLIC_PHOTOS_COLLECTION_ID,
  storageId: process.env.EXPO_PUBLIC_STORAGE_ID,
  storageIDfilephoto: process.env.EXPO_PUBLIC_STORAGE_ID_FILE_PHOTO,
  latestVideoCollectionId: process.env.EXPO_PUBLIC_LATEST_COLLECTION_ID,
};
let platformID;
if (Platform.OS === "ios") {
  // Platform is iOS
  platformID = process.env.EXPO_PUBLIC_PLATFORM_IOS;
} else if (Platform.OS === "android") {
  // Platform is Android
  platformID = process.env.EXPO_PUBLIC_PLATFORM_ANDROID;
}

client
  .setEndpoint(appwriteConfig.endpoint) // Appwrite Endpoint
  .setProject(appwriteConfig.projectId) //  Project ID
  .setPlatform(platformID);

const account = new Account(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

// Register User
export async function createUser(email, password, username) {
  try {
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
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
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
    throw new Error(error);
  }
}

// Sign In
export async function signIn(email, password) {
  try {
    const session = await account.createEmailSession(email, password);

    return session;
  } catch (error) {
    throw new Error(error);
  }
}

// Get Account
export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    throw new Error(error);
  }
}

// Get Current User
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

// Sign Out
export async function signOut() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    throw new Error(error);
  }
}

// Upload File
export async function uploadFile(file, type) {
  if (!file) return;
  const asset = {
    name: file.fileName,
    type: file.mimeType,
    size: file.fileSize,
    uri: file.uri,
  };
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      asset
    );
    if (uploadedFile) {
      const fileUrl = await getFilePreview(uploadedFile.$id, type);

      return fileUrl;
    }
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

// Get File Preview
export async function getFilePreview(fileId, type) {
  let fileUrl;
  try {
    if (type === "video") {
      fileUrl = storage.getFileView(appwriteConfig.storageId, fileId);
    } else if (type === "image" || type === "photo") {
      fileUrl = storage.getFilePreview(
        appwriteConfig.storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}

// Modify getAllPosts function to retrieve both photos and videos
export async function getAllPosts(dataType) {
  let collectionID;
  collectionID = appwriteConfig.videoCollectionId;

  if (dataType === "bookmarks")
    collectionID = appwriteConfig.bookmarkCollectionId;
  try {
    const videos = await databases.listDocuments(
      appwriteConfig.databaseId,
      collectionID,
      [Query.orderDesc("$createdAt")]
    );

    // Combine photos and videos into a single array
    const allPosts = [...videos.documents];
    return allPosts;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

// Get video posts created by user
export async function getUserPosts(userId) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
    );
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

// Get video posts that matches search query
export async function searchPosts(query) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.search("title", query)]
    );

    if (!posts) throw new Error("Something went wrong");

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

// Get latest created video posts
export async function getLatestPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.latestVideoCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(7)]
    );

    return posts.documents;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

//To fetch the bookmarked posts
export async function getBookmarkedPosts(userId) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

// Import necessary functions and variables

export async function createPost(form) {
  try {
    let postUrl;
    let thumbnailurl;

    if (form.postType === "Photo") {
      const [photoUrl] = await Promise.all([uploadFile(form.photo, "image")]);
      postUrl = photoUrl;
    } else if (form.postType === "video") {
      const [thumbnailUrl, videoUrl] = await Promise.all([
        uploadFile(form.thumbnail, "image"),
        uploadFile(form.video, "video"),
      ]);
      postUrl = videoUrl;
      thumbnailurl = thumbnailUrl;
    } else return;

    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: form.postType === "Photo" ? null : thumbnailurl,
        video: form.postType === "Photo" ? null : postUrl,
        photo: form.postType === "Photo" ? postUrl : null,
        prompt: form.prompt,
        creator: form.userId,
      }
    );

    return newPost;
  } catch (error) {
    throw new Error(error);
  }
}

//To bookmark a post
export async function createBookmark(docsID, isBookmarked) {
  try {
    // Fetch the document by its ID
    const response = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      docsID
    );

    // If the document exists, update its bookmark status
    if (response) {
      const updateData = {
        bookmark: isBookmarked,
      };

      // Update the document with the new bookmark status
      const updateDocument = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.videoCollectionId,
        docsID,
        updateData
      );
    }
  } catch (error) {
    throw new Error(error);
  }
}

// Function to filter documents in the collection
export async function filterDocuments(userID) {
  try {
    // Call the Appwrite SDK method to filter documents
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.equal("bookmark", true)],
      Query.equal("creator", userID)
    );
    return response.documents; // Return the filtered documents
  } catch (error) {
    throw error;
  }
}
