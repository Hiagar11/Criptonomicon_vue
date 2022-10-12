<template>
  <div class="flex bg-white shadow-md p-1 rounded-md shadow-md flex-wrap">
            <span
                v-for="option of filteredUniqOptions"
                :key="option"
                @click="addTicker(option)"
                class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer">
            {{ option }}
            </span>

  </div>
</template>

<script>
// import {loadList} from "../../public/webSocket";

export default {
  name: "addTickerOptions",
  data() {
    return {
      options: []
    }
  },
  methods: {
    async getListOptions() {
      this.options = JSON.parse(localStorage.getItem('options'));
      if (!this.options) {
        // this.options = await loadList();
        localStorage.setItem('options', JSON.stringify(this.options));
      }
      this.$emit('options', this.options)
    },
    addTicker(name) {
      this.$emit('nameOfOption', name)
    },
  },
  props: {
    tickers: {
      type: Array,
      required: false,
      default: []
    },
    tickerName: {
      type: String,
      required: false,
      default: ''
    }
  },
  emits: {
    'nameOfOption': v => typeof v === 'string',
    'options': v => typeof v === 'object'
  },
  computed: {
    filteredOptions() {
      return [...this.options].filter(o => o.startsWith(this.tickerName.toUpperCase()))
    },
    filteredUniqOptions() {
      let names = this.tickers.map(t => t.name);
      return _.difference(this.filteredOptions, names).slice(0, 4);
    },
  },
  created() {
    this.getListOptions()
  }
}
</script>

<style scoped>

</style>
