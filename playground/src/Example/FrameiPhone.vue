<template>
  <section id="frame-iphone">
    <h2>Frame iPhone</h2>

    <div class="[ scroll:x flex ]" style="gap: 0.5rem">
      <div data-theme="dark">
        <div class="playground@bg:primary [ iphone5-frame ]">
          <div>
            {{ `
            <div class="[ iphone5-frame ]">...</div>
            ` }}
          </div>
        </div>
      </div>

      <div data-theme="dark">
        <div class="playground@bg:secondary [ iphone8-frame ]">
          <div>
            {{ `
            <div class="[ iphone6-frame ]">...</div>
            ` }}
          </div>
          <div>
            {{ `
            <div class="[ iphone7-frame ]">...</div>
            ` }}
          </div>
          <div>
            {{ `
            <div class="[ iphone8-frame ]">...</div>
            ` }}
          </div>
        </div>
      </div>

      <div data-theme="light">
        <div class="playground@bg:primary [ iphoneX-frame ]">
          <div>
            {{ `
            <div class="[ iphoneX-frame ]">...</div>
            ` }}
          </div>
        </div>
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
