import { defineStore } from 'pinia';
import { ref } from 'vue';
import { 
  ref as storageRef, 
  uploadBytesResumable, 
  getDownloadURL 
} from 'firebase/storage';
import { storage } from '@/config/firebase';

export const useStorageStore = defineStore('storage', () => {
  const uploadProgress = ref<number>(0);
  const uploading = ref<boolean>(false);
  const error = ref<string | null>(null);

  /**
   * Uploads a file to Firebase Storage and returns the download URL
   * @param file The file to upload
   * @param path The path in storage (e.g., 'posts/uid/filename')
   */
  const uploadFile = async (file: File, path: string): Promise<string> => {
    uploading.value = true;
    uploadProgress.value = 0;
    error.value = null;

    try {
      const fileRef = storageRef(storage, path);
      const uploadTask = uploadBytesResumable(fileRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            uploadProgress.value = progress;
          },
          (err) => {
            error.value = err.message;
            uploading.value = false;
            reject(err);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              uploading.value = false;
              resolve(downloadURL);
            } catch (err: any) {
              error.value = err.message;
              uploading.value = false;
              reject(err);
            }
          }
        );
      });
    } catch (err: any) {
      error.value = err.message;
      uploading.value = false;
      throw err;
    }
  };

  return {
    uploadProgress,
    uploading,
    error,
    uploadFile
  };
});
