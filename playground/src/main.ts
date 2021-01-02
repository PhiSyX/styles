import { loadStyle, setStyle } from "./invalid-css.ts";

import "./index.scss";

import { createApp, nextTick } from "vue";

import Playground from "./App.vue";

const app = createApp(Playground);

app.mount("#playground");

nextTick(() => {
  loadStyle("/invalid.css")
    .then(() => setStyle("#playground"));
});
