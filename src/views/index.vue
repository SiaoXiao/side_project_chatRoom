<script setup lang="ts">
import { createRoom, requireAuth } from "../firebase/firebase";
import { useRouter } from "vue-router";
const router = useRouter();

const handleCreateRoom = () => {
  requireAuth().then(async () => {
    const roomId = await createRoom();
    router.push({ path: "/chat-room", query: { roomId } });
  });
};
</script>

<template>
  <div class="chat-container">
    <button
      type="button"
      class="bg-blue-600 border-0 text-white rounded-3xl py-2.5 px-5 font-bold cursor-pointer"
      @click="handleCreateRoom()"
    >
      建立聊天室
    </button>
  </div>
</template>
