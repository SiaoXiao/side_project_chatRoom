<script setup lang="ts">
import Modal from "../components/modal.vue";
import { ref, watch, onMounted, nextTick } from "vue";
import {
  sendMessageToRoom,
  requireAuth,
  subscribeToRoom,
  getRoom,
  updateRoomName,
} from "../firebase/firebase";
import { useRoute } from "vue-router";

const route = useRoute();
const roomId = ref<string>(route.query.roomId as string | "");
const roomTitle = ref("");
const isEdit = ref<boolean>(false);
const inputRef = ref<HTMLInputElement | null>(null);
const messageRef = ref<HTMLInputElement | null>(null);
const inputMessage = ref<string>("");
const messagesArr = ref<any>([]);
const isOpen = ref<boolean>(false);

const handleEditTitle = async () => {
  isEdit.value = false;
  updateRoomName(roomTitle.value ,roomId.value)
};

const enableEdit = async () => {
  isEdit.value = true;
  await nextTick(); // 確保 DOM 更新完成
  inputRef.value?.focus(); // 自動聚焦
};

const handleSendMessage = () => {
  if (inputMessage.value === "") return;

  sendMessageToRoom(roomId.value, inputMessage.value);

  inputMessage.value = "";
};

const goToBottom = () => {
  if (!messageRef.value) return;
  messageRef.value.scrollTop =
    messageRef.value?.scrollHeight - messageRef.value?.clientHeight;
};

const messageIds = new Set();
const handleUpdateMessage = (messages: any[]) => {
  messages.forEach((message) => {
    if (!messageIds.has(message.id)) {
      messageIds.add(message.id);
    }
  });

  messagesArr.value = messages;
  goToBottom();
};

const loadRoomName = async (roomId: string) => {
  const room = await getRoom(roomId);
  roomTitle.value = room?.name;
};

onMounted(() => {
  requireAuth().then((user) => {
    console.log(user);

    loadRoomName(roomId.value);
    subscribeToRoom(handleUpdateMessage, roomId.value);
  });
});

watch(
  () => route.query.roomId,
  (newRoomId) => {
    roomId.value = newRoomId as string;
  }
);
</script>

<template>
  <div class="min-w-lg">
    <div class="flex items-center justify-between border px-5 py-2.5">
      <div class="w-full flex items-center justify-between">
        <input
          v-if="isEdit"
          ref="inputRef"
          type="text"
          v-model="roomTitle"
          @keyup.enter="handleEditTitle"
          @blur="handleEditTitle"
        />
        <template v-else>
          <div class="flex gap-2">
            <h1 class="text-3xl font-bold tracking-wider">{{ roomTitle }}</h1>
            <div class="w-4 h-4 cursor-pointer" @click.stop="enableEdit">
              <img src="../assets/edit-3-svgrepo-com.svg" alt="Edit" />
            </div>
          </div>
        </template>

        <div class="flex gap-4">
          <img
            src="../assets/home-svgrepo-com.svg"
            alt="Home"
            class="w-5 h-5 block cursor-pointer"
            @click="$router.push('/')"
          />
          <img
            src="../assets/add-profile-svgrepo-com.svg"
            alt="Add"
            class="w-5 h-5 block cursor-pointer"
            @click="isOpen = true"
          />
        </div>
      </div>
    </div>

    <div class="border min-w-lg m-auto h-[500px] flex flex-col justify-between p-3">
      <div ref="messageRef" class="flex flex-col overflow-y-auto">
        <template v-for="message in messagesArr" :key="message.id">
          <div
            v-if="message.isSelt"
            class="mt-3 rounded-xl text-gray-900 flex flex-col items-end"
          >
            <div class="text-sm text-white w-fit">{{ message.senderName }}</div>
            <div class="py-1 px-3 rounded-3xl mt-1 w-fit text-white bg-blue-600">
              {{ message.content }}
            </div>
          </div>

          <div v-else class="mt-3 rounded-xl text-gray-900 flex flex-col items-start">
            <div class="text-sm text-white w-fit">{{ message.senderName }}</div>
            <div class="py-1 px-3 rounded-3xl w-fit mt-1 bg-gray-200">
              {{ message.content }}
            </div>
          </div>
        </template>
      </div>
      <div class="bg-gray-500 rounded-3xl flex justify-between mt-10">
        <input
          v-model="inputMessage"
          type="text"
          placeholder="enter message"
          class="w-full border-0 bg-transparent py-2.5 px-5 outline-none"
          @keyup.enter="handleSendMessage"
        />
        <button
          type="button"
          class="bg-blue-600 border-0 text-white rounded-3xl py-2.5 px-5 font-bold cursor-pointer"
          @click="handleSendMessage"
        >
          Send
        </button>
      </div>
    </div>
  </div>
  <Modal v-model="isOpen" />
</template>

<style scoped></style>
