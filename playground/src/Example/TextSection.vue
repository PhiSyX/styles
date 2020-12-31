<template>
  <section id="text-section">
    <h2>Texte section</h2>

    <div data-theme="dark">
      <h3>Typographie (responsive)</h3>

      <div class="playground@bg:primary">
        <h1>
          {{ `
          <h1>Texte</h1>
          ` }}
        </h1>
        <h2>
          {{ `
          <h2>Texte</h2>
          ` }}
        </h2>
        <h3>
          {{ `
          <h3>Texte</h3>
          ` }}
        </h3>
        <h4>
          {{ `
          <h4>Texte</h4>
          ` }}
        </h4>
        <h5>
          {{ `
          <h5>Texte</h5>
          ` }}
        </h5>
        <h6>
          {{ `
          <h6>Texte</h6>
          ` }}
        </h6>
      </div>
    </div>

    <div data-theme="dark">
      <h3>Dark theme (inclus par défaut)</h3>

      <div class="playground@bg:secondary [ flex ]">
        <pre>{{
`<div data-theme="dark">
  <p class="example-text">
    ${exampleText}
  </p>
</div>` }}</pre>

        <div class="playground@bg:primary">
          <p class="example-text">
            {{ exampleText }}
          </p>
        </div>
      </div>
    </div>

    <div data-theme="light">
      <h3>Light theme (inclus par défaut)</h3>

      <div class="playground@bg:secondary [ flex ]">
        <pre>{{
`<div data-theme="light">
  <p class="example-text [ light:example-text ]">
    ${exampleText}
  </p>
</div>`
        }}</pre>

        <div class="playground@bg:primary">
          <p class="example-text [ light:example-text ]">
            {{ exampleText }}
          </p>
        </div>
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
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit.",
        "Delectus adipisci quae odit voluptates laborum minus recusandae debitis,",
        "iusto temporibus accusamus ullam quasi in fugit consequatur assumenda",
        "saepe fugiat hic harum!",
      ].join("\n    "),
    };
  },
});
</script>

<style scoped>
h3 {
  min-width: 250px;
}
</style>
