<template>
  <section id="frame-iphone">
    <h2>Frame iPhone</h2>

    <div class="[ scroll:x flex ]" style="gap: 0.5rem">
      <div data-theme="dark">
        <span>.iphone5-frame</span>
        <div class="playground@bg:primary [ iphone5-frame ]"></div>
      </div>

      <div data-theme="dark">
        <span>.iphone6-frame, .iphone7-frame, .iphone8-frame</span>
        <div class="playground@bg:secondary [ iphone8-frame ]"></div>
      </div>

      <div data-theme="light">
        <span>.iphoneX-frame</span>
        <div class="playground@bg:primary [ iphoneX-frame ]"></div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "FrameiPhone",
});
</script>
