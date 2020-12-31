<template>
  <div class="[ scroll[hidden] scroll ]">
    <h1>Playground</h1>

    <details open>
      <summary>Texte section</summary>
      <TextSection />
    </details>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import TextSection from "./Example/TextSection.vue";

export default defineComponent({
  name: "App",

  components: {
    TextSection,
  },
});
</script>
