<template>
  <div class="w-full mx-auto">
    <div class="flex items-center justify-center">
      <div class="flex flex-col space-y-4 justify-center items-center">
        <img class="max-w-2xl" v-if="previewImage" :src="previewImage" />
        <input
          v-if="!previewImage"
          type="file"
          @change="previewFiles"
          multiple
        />
        <button
          v-if="previewImage"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          @click="removeFile"
        >
          remove
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import piexif from "piexifjs";
import exif from "exif-js";
import { ref } from "vue";

export default {
  setup() {
    const previewImage = ref(null);
    const blobToBase64 = (blob) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    };
    const previewFiles = async (e) => {
      let base64 = await blobToBase64(e.target.files[0]);
      previewImage.value = base64;
      console.log(piexif.load(base64));
    };

    const removeFile = () => {
      previewImage.value = null;
    };

    return {
      previewImage,
      previewFiles,
      removeFile,
    };
  },
};
</script>
