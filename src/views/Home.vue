<template>
  <div class="mx-auto w-full py-8">
    <div class="flex flex-col items-center justify-center space-y-4">
      <h3 class="text-4xl">Spotify Iseng</h3>
      <button
        v-if="!loggedIn"
        class="px-4 py-3 rounded text-base text-white hover:cursor-pointer bg-green-600 hover:bg-green-500"
        @click="login"
      >
        <div class="flex space-x-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="currentColor"
            class="text-gray-100"
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path
              d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.55 2 12 2zm3.75 14.65c-2.35-1.45-5.3-1.75-8.8-.95-.35.1-.65-.15-.75-.45-.1-.35.15-.65.45-.75 3.8-.85 7.1-.5 9.7 1.1.35.15.4.55.25.85-.2.3-.55.4-.85.2zm1-2.7c-2.7-1.65-6.8-2.15-9.95-1.15-.4.1-.85-.1-.95-.5-.1-.4.1-.85.5-.95 3.65-1.1 8.15-.55 11.25 1.35.3.15.45.65.2 1s-.7.5-1.05.25zM6.3 9.75c-.5.15-1-.15-1.15-.6-.15-.5.15-1 .6-1.15 3.55-1.05 9.4-.85 13.1 1.35.45.25.6.85.35 1.3-.25.35-.85.5-1.3.25C14.7 9 9.35 8.8 6.3 9.75z"
            />
          </svg>
          <h3>Login</h3>
        </div>
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";

export default {
  setup() {
    const loggedIn = ref(false);
    const client_id = import.meta.env.VITE_CLIENT_ID;
    const redirect_uri = import.meta.env.VITE_REDIRECT_URL;
    const scope =
      "user-read-private user-read-email user-library-read user-library-modify";

    const generateRandomString = (length) => {
      let text = "";
      const possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }

      return text;
    };

    const login = () => {
      let state = generateRandomString(16);
      const url = `https://accounts.spotify.com/authorize?response_type=token&client_id=${client_id}&scope=${scope}&redirect_uri=${redirect_uri}&state=${state}`;
      window.location.href = url;
    };

    const getHashParams = () => {
      let hashParams = {};
      let e,
        r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
      while ((e = r.exec(q))) {
        hashParams[e[1]] = decodeURIComponent(e[2]);
      }
      return hashParams;
    };

    onMounted(() => {
      const params = getHashParams();
      if (params.access_token) {
        localStorage.setItem("access_token", params.access_token);
        localStorage.setItem("refresh_token", params.refresh_token);
        loggedIn.value = true;
      } else {
        loggedIn.value = false;
        login();
      }
    });
    return {
      loggedIn,
      login,
    };
  },
};
</script>
