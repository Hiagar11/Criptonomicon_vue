<template>
  <section
      ref="graph"
      v-if="selectedTicker"
      class="relative"
  >
    <h3 class="text-lg leading-6 font-medium text-gray-900 my-8">
      {{ selectedTicker.name }} - USD
    </h3>
    <div class="flex items-end border-gray-600 border-b border-l h-64">
      <div
          ref="col"
          v-for="(col, ind) of normalizeGraph"
          :key="ind"
          class="bg-purple-800 border w-10"
          :style="`height:${col}%`"
      ></div>

    </div>
    <button
        @click="selectedTicker = null"
        type="button"
        class="absolute top-0 right-0"
    >
      <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          x="0"
          y="0"
          viewBox="0 0 511.76 511.76"
          style="enable-background:new 0 0 512 512"
          xml:space="preserve"
      >
          <g>
            <path
                d="M436.896,74.869c-99.84-99.819-262.208-99.819-362.048,0c-99.797,99.819-99.797,262.229,0,362.048    c49.92,49.899,115.477,74.837,181.035,74.837s131.093-24.939,181.013-74.837C536.715,337.099,536.715,174.688,436.896,74.869z     M361.461,331.317c8.341,8.341,8.341,21.824,0,30.165c-4.16,4.16-9.621,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    l-75.413-75.435l-75.392,75.413c-4.181,4.16-9.643,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    c-8.341-8.341-8.341-21.845,0-30.165l75.392-75.413l-75.413-75.413c-8.341-8.341-8.341-21.845,0-30.165    c8.32-8.341,21.824-8.341,30.165,0l75.413,75.413l75.413-75.413c8.341-8.341,21.824-8.341,30.165,0    c8.341,8.32,8.341,21.824,0,30.165l-75.413,75.413L361.461,331.317z"
                fill="#718096"
                data-original="#000000"
            ></path>
          </g>
        </svg>
    </button>
  </section>
</template>

<script>
export default {
  name: "graph",
  data() {
    return {
      graph: [],

      graphLength: 1,
      widthCol: 0,
    }
  },
  props: {
    selectedTicker: {
      type: Object || null
    },
    price: {
      type: Number
    }

  },
  methods: {
    getLengthGraph() {
      if (this.$refs.graph) {
        this.graphLength = Math.floor(this.$refs.graph.offsetWidth / this.widthCol);
        this.slicedGraph();
      }
    },
    slicedGraph() {
      if (this.graphLength < this.graph.length) {
        this.graph = this.graph.splice(-this.graphLength)
      }
    },
  },
  computed:{
    normalizeGraph() {
      let min = Math.min(...this.graph);
      let max = Math.max(...this.graph);
      return this.graph.map(price => {
            if (max === min) {
              return 50
            }
            return ((price - min) * 100 / (max - min))+5
          }
      );

    },
  },
  watch: {
    price(v) {
      this.graph = [...this.graph, v];
      this.slicedGraph();
      if (!this.widthCol && this.$refs.col) {
        this.widthCol = this.$refs.col[0].offsetWidth
        this.getLengthGraph()

      }
    },
    selectedTicker() {
      this.graph = [];

      this.$nextTick().then(() =>
          this.getLengthGraph()
      )
    },
  },
  mounted() {
    window.addEventListener('resize', this.getLengthGraph);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.getLengthGraph);
  }
}
</script>

<style scoped>

</style>
