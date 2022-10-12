<template>
  <div class="flex">
    <div class="max-w-xs">
      <label for="wallet" class="block text-sm font-medium text-gray-700"
      >Тикер</label
      >
      <div class="mt-1 relative rounded-md shadow-md">
        <input
            @keydown.enter="addTicker(tickerName)"
            v-model="tickerName"
            type="text"
            name="wallet"
            id="wallet"
            class="block p-2 w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
            placeholder="Например DOGE"
        />
      </div>
     <add-ticker-options
         :tickers="tickers"
         :tickerName="tickerName"
         @nameOfOption="addTicker"
         @options="getOptions"
     />
      <div
          v-if="valid"
          class="text-sm text-red-600">{{ valid }}
      </div>
    </div>
  </div>
  <button
      @click="addTicker(tickerName)"
      type="button"
      class="my-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
  >

    <svg
        class="-ml-0.5 mr-2 h-6 w-6"
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="#ffffff"
    >
      <path
          d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
      ></path>
    </svg>
    Добавить
  </button>
</template>

<script>
import addTickerOptions from "@/components/addTickerOptions";
export default {
  name: "addTicker",
  components: {
    addTickerOptions
  },
  props: {
    tickers: {
      type: Array,
      required: false,
      default: []
    },
  },
  emits: {
    "addTicker": v => typeof v === "string",
  },
  data() {
    return {
      tickerName: '',
      valid: false,
      options:[],
    }
  },
  methods:{
    addTicker(tickerName) {
      tickerName = tickerName.toUpperCase();
      this.valid = this.validated(tickerName);
      if(!this.valid) {
        this.$emit('addTicker', tickerName);
      }
      this.tickerName = '';
    },
    getOptions(arrOpt) {
      this.options = [...this.options, ...arrOpt];
    },
    validated(name) {
      name = name.toUpperCase();
      if (this.options.includes(name)) {
        if (this.tickers.find(t => t.name === name)) {
          return 'Данная пара уже записана'
        } else {
          return false
        }
      } else {
        return 'Не найдена данная пара'
      }
    },
  },
  watch: {
    tickerName() {
      this.valid = false
    },
  }
}
</script>

<style scoped>

</style>
