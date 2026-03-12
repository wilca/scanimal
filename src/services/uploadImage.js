import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { signInAnonymously } from 'firebase/auth'
import imageCompression from 'browser-image-compression'
import { auth, storage } from './firebase'

/**
 * Compresses and uploads an image to Firebase Storage.
 * Signs in anonymously if no Firebase session exists (required by Storage rules).
 * @param {File} file - The image file to upload.
 * @param {string} path - Storage path, e.g. "animals/1234_photo.jpg"
 * @returns {Promise<string>} The public download URL.
 */
export async function uploadImage(file, path) {
  // Firebase Storage requires an authenticated user — sign in anonymously if needed
  if (!auth.currentUser) {
    await signInAnonymously(auth)
  }

  const compressed = await imageCompression(file, {
    maxSizeMB: 0.8,
    maxWidthOrHeight: 1024,
    useWebWorker: true,
  })
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, compressed)
  return getDownloadURL(storageRef)
}
