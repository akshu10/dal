import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import { createRouter } from "./router";

const app = createApp(App);

console.log("origin", window.location.origin);

app.use(createPinia());
app.use(createRouter(app));

app.mount("#app");
