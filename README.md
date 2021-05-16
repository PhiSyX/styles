# Mes utilitaires pour CSS (écrit en SCSS).

  - [Guide de Style](#styleguide)



## Récupérer ce projet ?
  - Projet existant **sans** git d'initialisé ?

    Télécharger le projet depuis un terminal en utilisant [git](https://git-scm.com), ou en téléchargeant le zip.

    Ligne de commande:
    > $   git clone https://github.com/PhiSyX/styles

    Créer un [lien symbolique](https://fr.wikipedia.org/wiki/Lien_symbolique) vers votre projet.

  - Projet existant **avec** git d'initialisé ?

    > $   git submodule add https://github.com/PhiSyX/styles **PROJECT_TARGET**
    > > **PROJECT_TARGET**  "/mon/super/projet/personnel/styles" 
    >
    > $ git submodule update --init --recursive


## Utiliser ce code pour les autres projets ?
  - Requiert d'avoir un projet pouvant compiler le scss.

  - Importer les utilitaires spécifiques dans les différents projets et les utiliser.



## Playground :
  Lancer le terrain de jeu avec `npm` ou `yarn`
  > ```bash
  > $ cd playground/
  > $ npm install # or yarn
  > $ npm run dev # or yarn dev (dev server)
  > $ npm run build # or yarn build (build files)
  > ```



---
---
---
---
---



# STYLEGUIDE
## Le CSS pour ce projet :
### Les noms des variables doivent suivre cette nomenclature :
  - Termes:
    - `separator` est soit "`_`" soit "`-`".
    - `module` doit être nommé en "`kebab-case`".
    - `selector` doit être nommé en "`kebab-case`".
    - `propalias` doit être nommé en "`kebab-case`".
    - `propalias` veut dire "`Propriété ou alias`".
    - `state` sont les états du sélecteur. (`:hover`, `:focus`, etc.)

  - Nomenclatures:
    1. --{`selector`}{`propalias`}
      > Exemple:
      > ```css
      > --btn_border-color: white;
      > --a_py: 8px;
      > ```

    2. --{`selector`}{`state`}{`propalias`}
      > Exemple:
      > ```css
      > --btn_onhover_border-color: black;
      > --btn_onfocus_border-color: blue;
      > --btn_onhover-onfocus_border-color: green;
      > ```

    3. --{`module`}{`selector`}**[{`state`}]**{`propalias`}
      > Exemple:
      > ```css
      > --auth_p_color: red; -> {module}{selector}{propalias}
      > --auth_p_onhover_color: blue; {module}{selector}{state}{propalias}
      > ```

  - Les noms des classes suivent une certaine nomenclature :

    1. les sélecteurs doivent être nommés en "`kebab-case`" :
        > #page-id, .class-name

    2. les classes peuvent suivre certaine nomenclature en plus: (non obligatoire)
        - **Règle**_**: .[theme:][module@][breakpoint:][propalias:]class-name[:state&]
          Tous les [] ne sont pas obligatoires.

        - Général: "`.class-name`"
          > &lt;p class="`my-class-name`">

        - Theme: ".class-name [ `.theme:`class-name ]"
          > &lt;p class="my-class-name [ `dark:`my-class-name `light:`my-class-name ]">

        - Module: "`.module`", "`.module@`class-name-of-module"
          > &lt;p class="`auth`"> \
          > &lt;p class="`auth@`v-stack"> \
          > &lt;p class="`auth@`btn [ light:`auth@`btn dark:`auth@`btn ]">

        - Breakpoint: "`.breakpoint:`class-name"
          > &lt;p class="h-stack [ `md:`v-stack ]"> \
          > &lt;p class="`md:`auth@v-stack [ light:`md:`auth@v-stack ] ">

        - Propalias + className: "`.propalias:`class-name"
          > &lt;p class="`p:`reset `my:`reset">
            - `p`  = alias de la propriété `padding`.
            - `my` = alias des propriétés `margin-top` && `margin-bottom`.
          > &lt;p class="`padding:`reset `position:`full-size">

        - Propalias + number value: "`.propalias`**=number-class-name**"
          > &lt;p class="`py`**=2** `px`**=10** `w`**=30** `min-h`**=25** `h`**=30** `max-h`**=50**">

        - Propalias + value: "`.propalias`**=value-class-name**" | "`.propalias`**-value-class-name**"
          > &lt;p class="flex `flex`**=wrap** `flex`**=grow** `pos`**=r**"> \
          > &lt;p class="flex `flex`**-wrap** `flex`**-grow** `pos`**-r**">

        - State:  ".class-name`:state`"
          > &lt;p class="[ app@btn`:hover` app@btn`:focus` ] [ light:app@btn`:hover` light:app@btn`:focus` ]">



### Ordre des propriétés: (liste non-exhaustive)
  - box-sizing [content-box|border-box|inherit|initial|unset]
    - `box-sizing`

  - Position & Layout
    - `display`
    - `position`
    - `top`
    - `right`
    - `bottom`
    - `left`

  - float
    - `float`
    - `clear`

  - flex-*
    - `flex`
    - `flex-basis`
    - `flex-direction`
    - `flex-flow`
    - `flex-grow`
    - `flex-shrink`
    - `flex-wrap`

  - grid-*
    - `grid`
    - `grid-area`
    - `grid-template`
    - `grid-template-areas`
    - `grid-template-rows`
    - `grid-template-columns`
    - `grid-row`
    - `grid-row-start`
    - `grid-row-end`
    - `grid-column`
    - `grid-column-start`
    - `grid-column-end`
    - `grid-auto-rows`
    - `grid-auto-columns`
    - `grid-auto-flow`
    - `grid-gap`
    - `grid-row-gap`
    - `grid-column-gap`

  - align-*
    - `align-content`
    - `align-items`
    - `align-self`

  - justify-*
    - `justify-content`
    - `justify-items`
    - `justify-self`

  - order
    - `order`

  - column*
    - `columns`
    - `column-gap`
    - `column-fill`
    - `column-rule`
    - `column-rule-width`
    - `column-rule-style`
    - `column-rule-color`
    - `column-span`
    - `column-count`
    - `column-width`

  - Display & Visibility
    - `backface-visibility`
    - `perspective`
    - `perspective-origin`
    - `transform`
    - `transform-origin`
    - `transform-style`

  - transition
    - `transition`
    - `transition-delay`
    - `transition-duration`
    - `transition-property`
    - `transition-timing-function`

  - visibility
    - `visibility`
    - `opacity`
    - `z-index`

  - margin
    - `margin`
    - `margin-top`
    - `margin-right`
    - `margin-bottom`
    - `margin-left`

  - outline
    - `outline`
    - `outline-offset`
    - `outline-width`
    - `outline-style`
    - `outline-color`

  - border
    - `border`
    - `border-top`
    - `border-right`
    - `border-bottom`
    - `border-left`
    - `border-width`
    - `border-top-width`
    - `border-right-width`
    - `border-bottom-width`
    - `border-left-width`

  - border-style
    - `border-style`
    - `border-top-style`
    - `border-right-style`
    - `border-bottom-style`
    - `border-left-style`

  - border-radius
    - `border-radius`
    - `border-top-left-radius`
    - `border-top-right-radius`
    - `border-bottom-left-radius`
    - `border-bottom-right-radius`

  - border-color
    - `border-color`
    - `border-top-color`
    - `border-right-color`
    - `border-bottom-color`
    - `border-left-color`

  - border-image
    - `border-image`
    - `border-image-source`
    - `border-image-width`
    - `border-image-outset`
    - `border-image-repeat`
    - `border-image-slice`

  - box-shadow
    - `box-shadow`

  - background
    - `background`
    - `background-attachment`
    - `background-clip`
    - `background-color`
    - `background-image`
    - `background-origin`
    - `background-position`
    - `background-repeat`
    - `background-size`

  - cursor
    - `cursor`

  - padding
    - `padding`
    - `padding-top`
    - `padding-right`
    - `padding-bottom`
    - `padding-left`

  - width / height
    - `width`
    - `min-width`
    - `max-width`
    - `height`
    - `min-height`
    - `max-height`

  - overflow
    - `overflow`
    - `overflow-x`
    - `overflow-y`
    - `resize`

  - list-style
    - `list-style`
    - `list-style-type`
    - `list-style-position`
    - `list-style-image`
    - `caption-side`

  - tables
    - `table-layout`
    - `border-collapse`
    - `border-spacing`
    - `empty-cells`

  - animation
    - `animation`
    - `animation-name`
    - `animation-duration`
    - `animation-timing-function`
    - `animation-delay`
    - `animation-iteration-count`
    - `animation-direction`
    - `animation-fill-mode`
    - `animation-play-state`

  - vertical-aligment
    - `vertical-align`

  - text-alignment & decoration
    - `direction`
    - `tab-size`
    - `text-align`
    - `text-align-last`
    - `text-justify`
    - `text-indent`
    - `text-transform`
    - `text-decoration`
    - `text-decoration-color`
    - `text-decoration-line`
    - `text-decoration-style`
    - `text-rendering`
    - `text-shadow`
    - `text-overflow`

  - text-spacing
    - `line-height`
    - `word-spacing`
    - `letter-spacing`
    - `white-space`
    - `word-break`
    - `word-wrap`
    - `color`

  - font
    - `font`
    - `font-family`
    - `font-size`
    - `font-size-adjust`
    - `font-stretch`
    - `font-weight`
    - `font-smoothing`
    - `osx-font-smoothing`
    - `font-variant`
    - `font-style`

  - content
    - `content`
    - `quotes`

  - counters
    - `counter-reset`
    - `counter-increment`

  - breaks
    - `page-break-before`
    - `page-break-after`
    - `page-break-inside`



## Le SCSS pour ce projet:
  Les noms des fonctions doivent être séparé par des "`_`". Pourquoi ? \
  Les noms des fonctions qu'offre sass sont séparé par des "`-`". \
  Pour faire le distinguo entre les deux, il est préférable, pour nous, d'utiliser une autre nomenclature.



---
---
---
---
---



# Niveau de transparence des couleurs HEX:
  #??????**00**  ->  #ff00ff**00**  ->    0% \
  #??????**0C**  ->  #ff00ff**0C**  ->    5% \
  #??????**19**  ->  #ff00ff**19**  ->   10% \
  #??????**26**  ->  #ff00ff**26**  ->   15% \
  #??????**33**  ->  #ff00ff**33**  ->   20% \
  #??????**3F**  ->  #ff00ff**3F**  ->   25% \
  #??????**4C**  ->  #ff00ff**4C**  ->   30% \
  #??????**59**  ->  #ff00ff**59**  ->   35% \
  #??????**66**  ->  #ff00ff**66**  ->   40% \
  #??????**72**  ->  #ff00ff**72**  ->   45% \
  #??????**7F**  ->  #ff00ff**7F**  ->   50% \
  #??????**8C**  ->  #ff00ff**8C**  ->   55% \
  #??????**99**  ->  #ff00ff**99**  ->   60% \
  #??????**A5**  ->  #ff00ff**A5**  ->   65% \
  #??????**B2**  ->  #ff00ff**B2**  ->   70% \
  #??????**BF**  ->  #ff00ff**BF**  ->   75% \
  #??????**CC**  ->  #ff00ff**CC**  ->   80% \
  #??????**D8**  ->  #ff00ff**D8**  ->   85% \
  #??????**E5**  ->  #ff00ff**E5**  ->   90% \
  #??????**F2**  ->  #ff00ff**F2**  ->   95% \
  #??????**FF**  ->  #ff00ff**FF**  ->  100%


