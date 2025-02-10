import { createRouter, createWebHistory } from "vue-router";

// 你的頁面元件
import Home from "../views/index.vue";
import ChatRoom from "../views/ChatRoom.vue";

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/chat-room", name: "ChatRoom", component: ChatRoom },
];

const router = createRouter({
  history: createWebHistory(), // 使用 HTML5 History 模式
  routes,
});

export default router;
