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

      <h3>Taille du texte</h3>
      <div class="playground@bg:primary">
        <p class="text-normal">.text-normal (16px, default)</p>
        <p class="text-small">.text-small (12px)</p>

        <p v-for="i in 15" :key="i" :class="{ [`f-size=${i + 10}`]: true }">
          .f-size={{ i + 10 }}
        </p>

        <p class="text-small">
          Je fais un <span class="text-normal">test</span> !!!!
        </p>
      </div>

      <h3>Alignement du texte</h3>
      <div class="playground@bg:primary">
        <p class="v-align:top">.v-align:top</p>
        <p class="v-align:middle">.v-align:middle</p>
        <p class="v-align:bottom">.v-align:bottom</p>

        <hr />

        <p class="text-large">
          <span class="v-align:top [ text-small ]">TOP.</span>
          Je fais un test
        </p>
        <p class="text-large">
          <span class="v-align:middle [ text-small ]">MIDDLE.</span>
          Je fais un test
        </p>
        <p class="text-large">
          <span class="v-align:bottom [ text-small ]">BOTTOM.</span>
          Je fais un test
        </p>
      </div>

      <h3>Format de texte</h3>
      <div class="playground@bg:primary">
        <p class="text-bold">.text-bold</p>
        <p class="text-italic">.text-italic</p>
        <p class="text-underline">.text-underline</p>

        <hr />

        <p>
          Je
          <span class="text-underline"
            >fais u<span class="text-italic"
              >n <span class="text-bold">test</span> !</span
            >!</span
          >!!
        </p>
      </div>

      <h3>Sélection du texte</h3>
      <div class="playground@bg:primary">
        <p class="u-select:none">.u-select:none</p>
        <p class="u-select:text">.u-select:text</p>
        <p class="u-select:all">.u-select:all</p>

        <hr />

        <p class="u-select:none">Ce texte ne peut pas être sélectionné.</p>
        <p class="u-select:text">
          Ce texte est
          <span class="u-select:none">partiellement</span> sélectionnable
        </p>
        <p class="u-select:all">
          Ce texte est
          <span class="u-select:none">partiellement</span> sélectionnable au
          clique.
        </p>
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

.text-large {
  font-size: 24px;
}
</style>
