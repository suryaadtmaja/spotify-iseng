<template>
  <div class="mx-auto w-full flex py-8 items-center justify-center">
    <div class="w-full flex flex-col items-center justify-center space-y-4">
      <div
        v-if="loggedIn"
        style="
          width: 1080px;
          height: 1920px;
          background-color: #0b5563;
          color: #edfafd;
        "
        ref="screenshotArea"
        class="py-8 border border-gray-400 rounded border-opacity-25"
      >
        <div
          v-if="profile"
          class="profile mb-16 pt-20"
          style="margin-left: 124px"
        >
          <h3 class="text-4xl font-semibold tracking-wide">
            {{ profile.display_name }}
          </h3>
          <h3
            class="text-xl font-light tracking-wide mt-4"
            style="color: #c8f1f9"
          >
            Spotify Showcase
          </h3>
        </div>
        <div
          class="flex flex-col justify-center items-center space-y-16 w-full"
        >
          <div class="artists">
            <h3 class="text-2xl mb-6 font-semibold tracking-wide">
              Top Artists
            </h3>
            <div class="grid grid-cols-3 gap-x-8 gap-y-10">
              <template v-for="(artist, index) in artists.items" :key="index">
                <div class="flex flex-col">
                  <img
                    :src="artist.images[0].url"
                    class="h-64 w-64 bg-cover rounded-lg mb-4 drop-shadow-lg"
                  />
                  <div class="flex flex-col space-y-1 tracking-wide">
                    <h3 class="font-medium text-xl">{{ artist.name }}</h3>
                  </div>
                </div>
              </template>
            </div>
          </div>

          <div class="tracks">
            <h3 class="text-2xl mb-6 font-semibold tracking-wide">
              Top Tracks
            </h3>
            <div class="grid grid-cols-3 gap-x-8 gap-y-10">
              <template v-for="(song, index) in tracks.items" :key="index">
                <div class="flex flex-col">
                  <img
                    :src="song.album.images[0].url"
                    class="w-64 h-64 bg-cover rounded-lg mb-4 drop-shadow-lg"
                  />
                  <div class="flex flex-col space-y-1 tracking-wide">
                    <h3 class="font-medium text-xl">
                      {{ song.artists[0].name }}
                    </h3>
                    <h3 class="text-xs tracking-wider" style="color: #b6ecf7">
                      {{ song.name }}
                    </h3>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
      <h3 class="text-2xl">Spotify Showcase</h3>
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
      <button
        v-if="loggedIn"
        class="px-4 py-3 rounded text-base text-white hover:cursor-pointer bg-green-600 hover:bg-green-500"
        @click="generateImage"
      >
        <div class="flex space-x-1">
          <h3>Generate Image</h3>
        </div>
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import html2canvas from "html2canvas";
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();
    const screenshotArea = ref(null);
    const loggedIn = ref(false);
    const profile = ref([]);
    const client_id = import.meta.env.VITE_CLIENT_ID;
    const redirect_uri = import.meta.env.VITE_REDIRECT_URL;
    const scope = "user-read-private user-top-read";

    const tracks = ref([]);
    const artists = ref([]);

    const generateRandomString = (length) => {
      let text = "";
      const possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }

      return text;
    };

    const generateImage = () => {
      const captureArea = screenshotArea.value;
      html2canvas(captureArea, {
        allowTaint: true,
        useCORS: true,
        width: 1080,
        height: 1920,
        scale: 2,
        removeContainer: true,
      }).then((canvas) => {
        const img = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = img;
        link.download = "screenshot.png";
        link.click();
      });
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

    const fetchProfile = async () => {
      try {
        const request = await fetch("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: "Bearer " + getHashParams().access_token,
          },
        });
        const data = await request.json();
        profile.value = data;
        if (request.status == 401) {
          router.push("/");
          loggedIn.value = false;
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchTopsong = async () => {
      try {
        const request = await fetch(
          "https://api.spotify.com/v1/me/top/tracks?limit=6",
          {
            headers: {
              Authorization: "Bearer " + getHashParams().access_token,
            },
          }
        );
        const data = await request.json();
        tracks.value = data;
      } catch (error) {
        console.log(error);
      }
    };
    const fetchTopArtists = async () => {
      try {
        const request = await fetch(
          "https://api.spotify.com/v1/me/top/artists?limit=6",
          {
            headers: {
              Authorization: "Bearer " + getHashParams().access_token,
            },
          }
        );
        const data = await request.json();
        artists.value = data;
      } catch (error) {
        console.log(error);
      }
    };

    onMounted(() => {
      const params = getHashParams();
      if (params.access_token) {
        localStorage.setItem("access_token", params.access_token);
        localStorage.setItem("refresh_token", params.refresh_token);
        loggedIn.value = true;
        fetchProfile();
        fetchTopsong();
        fetchTopArtists();
      } else {
        loggedIn.value = false;
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      }
    });
    return {
      screenshotArea,
      profile,
      generateImage,
      tracks,
      artists,
      loggedIn,
      login,
    };
  },
};
</script>
