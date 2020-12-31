<template>
  <section id="text-section">
    <h2>Texte Section</h2>

    <div data-theme="dark">
      <h3>Dark theme</h3>

      <p class="example-text">
        {{ exampleText }}
      </p>
    </div>

    <div data-theme="light">
      <h3>Light theme</h3>

      <p class="example-text light:example-text">
        {{ exampleText }}
      </p>
    </div>

    <div data-theme="custom-theme">
      <h3>Custom theme</h3>

      <p class="example-text light:example-text">
        {{ exampleText }}
      </p>
    </div>

    <div data-theme="dark">
      <div data-theme="custom-theme">
        <h3>Custom theme (dark)</h3>

        <p class="example-text dark:example-text">
          {{ exampleText }}
        </p>
      </div>
    </div>

    <div data-theme="light">
      <div data-theme="custom-theme">
        <h3>Custom theme (light)</h3>

        <p class="example-text light:example-text">
          {{ exampleText }}
        </p>
      </div>
    </div>
  </section>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "TextSection",

  data() {
    return {
      exampleText: [
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Delectus",
        "adipisci quae odit voluptates laborum minus recusandae debitis, iusto",
        "temporibus accusamus ullam quasi in fugit consequatur assumenda saepe",
        "fugiat hic harum!",
      ].join("\n"),
    };
  },
});
</script>
