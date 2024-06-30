import { Client, Account, ID, Avatars, Databases, Query } from 'react-native-appwrite'

export const config = {
  endpoint: 'https://cloud.appwrite.io/v1',
  platform: 'com.borisyu.aora',
  projectId: '667f75ec000c82fed972',
  databaseId: '667f7b76003322cb2d35',
  userCollectionId: '667f7b9400069f238838',
  videoCollectionId: '667f7baf002df07285cf',
  storageId: '667f7e8b00204ec74b25',
}

// Init your React Native SDK
const client = new Client()
client.setEndpoint(config.endpoint).setProject(config.projectId).setPlatform(config.platform)

const account = new Account(client)
const avatars = new Avatars(client)
const databases = new Databases(client)

export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(ID.unique(), email, password, username)

    if (!newAccount) {
      throw Error
    }

    const avatarUrl = avatars.getInitials(username)

    await signIn(email, password)

    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        username,
        email,
        avatar: avatarUrl,
      }
    )

    return newUser
  } catch (error) {
    console.log(error)
    throw new Error(error)
  }
}

export const signIn = async (email, password) => {
  try {
    const session = await account.createEmailPasswordSession(email, password)

    return session
  } catch (error) {
    throw new Error(error)
  }
}

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get()

    if (!currentAccount) {
      throw Error
    }

    const currentUser = await databases.listDocuments(config.databaseId, config.userCollectionId, [
      Query.equal('accountId', currentAccount.$id),
    ])

    if (!currentUser) throw Error

    return currentUser.documents[0]
  } catch (error) {
    throw new Error(error)
  }
}

export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(config.databaseId, config.videoCollectionId)

    return posts.documents
  } catch (error) {
    throw new Error(error)
  }
}

export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(config.databaseId, config.videoCollectionId, [
      Query.orderDesc('$createdAt', Query.limit(7)),
    ])

    return posts.documents
  } catch (error) {
    throw new Error(error)
  }
}

export const searchPosts = async (query) => {
  try {
    const posts = await databases.listDocuments(config.databaseId, config.videoCollectionId, [
      Query.search('title', query),
    ])

    return posts.documents
  } catch (error) {
    throw new Error(error)
  }
}
