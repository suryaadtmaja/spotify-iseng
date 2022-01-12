<template>
  <div class="w-full mx-auto">
    <div class="flex items-center justify-center">
      <div class="flex flex-col space-y-4 justify-center items-center"></div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";

export default {
  setup() {
    onMounted(() => {
      console.log(import.meta.env.VITE_CLIENT_ID);
    });
  },
};
</script>
