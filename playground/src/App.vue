<template>
  <div class="[ scroll[hidden] scroll ]">
    <h1>Playground</h1>

    <details>
      <summary>Texte section</summary>
      <TextSection />
    </details>

    <details>
      <summary>Frame iPhone</summary>
      <FrameiPhone />
    </details>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import TextSection from "./Example/TextSection.vue";
import FrameiPhone from "./Example/FrameiPhone.vue";

export default defineComponent({
  name: "App",

  components: {
    TextSection,
    FrameiPhone,
  },
});
</script>
