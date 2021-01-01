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

    <details open>
      <summary>Exemple</summary>
      <Example />
    </details>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import TextSection from "./Section/Text.vue";
import FrameiPhone from "./Section/FrameiPhone.vue";
import Example from "./Section/Example.vue";

export default defineComponent({
  name: "App",

  components: {
    TextSection,
    FrameiPhone,
    Example,
  },
});
</script>
