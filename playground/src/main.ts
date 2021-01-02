import { loadStyle, setStyle } from "./invalid-css.ts";
import { __DEV__ } from "./helpers/node/env.ts";

import "./index.scss";

import { createApp, nextTick } from "vue";

import Playground from "./App.vue";

const app = createApp(Playground);

app.mount("#playground");

nextTick(() => {
  loadStyle(
    __DEV__ ? "/invalid.css" : "/styles/invalid.css",
  )
    .then(() => setStyle("#playground"));
});
