<template>
  <div id="example-section" data-theme="dark" class="flex:jc-center">
    <div
      class="[ playground@bg:primary ] [ iphoneX-frame flex! ]"
      style="padding: 1rem; gap: 1rem"
    >
      <div class="text-center">
        Les images sans l'attribut ALT (ou vide) sont floutées
      </div>

      <div class="flex:jc-center" style="gap: 1rem">
        <img src="/test.png" />
        <img src="/test.png" alt="Icône utilisateur" />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({ name: "Example" });
</script>
