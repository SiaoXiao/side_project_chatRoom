<template>
  <transition>
    <div
      v-if="isOpen"
      class="fixed z-10 top-0 left-0 w-full h-full bg-black/40 flex justify-center items-center"
    >
      <div
        class="bg-slate-800 p-4 border border-[#888] w-[80%] rounded-2xl flex flex-col gap-4 max-w-[500px] relative"
      >
        <h2 class="m-0 text-xl font-bold tracking-wider">Invite</h2>
        <input v-model="currentUrl" type="text" readonly />
        <button
          type="button"
          class="bg-blue-600 border-0 text-white rounded-3xl py-2.5 px-5 font-bold cursor-pointer"
          @click.prevent="handleCopyLink"
        >
          複製連結
        </button>
        <img
          src="../assets/close-circle-svgrepo-com.svg"
          alt="Close"
          class="w-5 h-5 absolute top-4 right-4 cursor-pointer"
          @click="isOpen = false"
        />
      </div>
    </div>
  </transition>
</template>
<script setup lang="ts">
import { ref } from "vue";

const isOpen = defineModel({ type: Boolean, default: false });

const currentUrl = ref<string>(window.location.href);

const handleCopyLink = async() => {
  try {
    await navigator.clipboard.writeText(currentUrl.value);
    alert("連結已複製！");
  } catch (err) {
    console.error("複製失敗:", err);
    alert("複製失敗，請手動複製");
  }
}
</script>
