<template>
  <div id="example-section" data-theme="dark" class="[ flex:jc-center ]">
    <div
      class="[ playground@bg:primary ] [ iphoneX-frame ] [ flex! gap=2 p=2 border:radius=2 ]"
    >
      <div class="flex">
        <div class="[ flex-grow ] [ placeholder text-center ]">Topic</div>
        <div>
          <button
            class="[ btn:reset color:red opacity=.5 opacity:hover=1 c-pointer ]"
          >
            &times;
          </button>
        </div>
      </div>

      <div class="[ flex-grow flex! scroll:y gap=2 ]">
        <div
          class="playground@example:item [ p=1 gap=2 ]"
          v-for="(t, i) in n"
          :key="i"
        >
          <div class="[ flex:jc-center gap=2 ]">
            <img
              :alt="i % 2 === 0 ? 'Avatar utilisateur' : null"
              :title="
                i % 2 === 0
                  ? null
                  : `Cette image est floue car l'élément n'a pas d'attribut 'alt'.`
              "
              src="/test.png"
              class="[ size=3 ]"
            />
          </div>

          <div class="[ flex gap=1 ]">
            <span class="[ text-small v-align:top color:yellow ]"
              >[ Mon status]</span
            >
            <span class="color:red-300 color:hover:red-800">Mon pseudo</span>
          </div>

          <div class="[ empty ]"></div>
          <div class="[ empty ]"></div>

          <div class="[ flex gap=1 ]">
            {{
              t ||
              `Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam
            dolores facere omnis labore ea accusamus recusandae voluptates optio
            aspernatur reprehenderit unde, harum fuga ut dolor laborum
            cupiditate voluptate voluptatum expedita?`
            }}
          </div>

          <div class="playground@example:input">
            <button class="[ btn:reset ]">?</button>
          </div>
        </div>
      </div>

      <form
        action="#"
        method="POST"
        class="playground@example:input [ flex gap=1 h=6 ]"
        @submit.prevent="
          n.push(text);
          text = '';
        "
      >
        <input
          v-model="text"
          type="text"
          class="playground@bg:secondary [ flex-grow ] [ input:reset h:full px=1 ]"
          placeholder="Entrer un message"
        />
        <button type="submit" class="[ btn:reset ]">Envoyer</button>
      </form>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "Example",

  data() {
    return {
      text: "",
      n: ["", ""],
    };
  },
});
</script>

<style lang="scss" scoped>
.playground\@example\:item {
  display: grid;
  grid-template-columns: 32px auto 32px;
}

.playground\@example\:input {
  justify-self: center;
}
</style>
