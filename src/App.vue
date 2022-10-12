<template>
  <div class="container mx-auto flex flex-col items-center bg-gray-100 p-4">
    <div class="fixed w-0 h-0 opacity-0 bg-purple-800 inset-0 z-50 flex items-center justify-center">
      <svg class="animate-spin -ml-1 mr-3 h-12 w-12 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
           viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
    <div class="container">
      <section>
        <add-ticker
            @addTicker="addTicker"
            :tickers="tickers"
        />
        <div class="flex items-baseline">
          <label class="" for="filter">Фильтр:
            <input
                id="filter"
                class="mx-2 p-2 pl-4 rounded-full border-indigo-800 border-2"
                type="text"
                v-model="filter"
            >
          </label>
          <button
              v-if="page > 1"
              class="mx-2 bg-gray-600 hover:bg-indigo-600 text-white py-2 px-4 rounded-full"
              @click="page > 1 ? --page : page = 1"
          >Предыдущая
          </button>
          <button
              class=" mx-2 bg-gray-600 hover:bg-indigo-600 text-white py-2 px-4 rounded-full"
              @click="page++"
              v-if="isNextPage"
          >Следующая
          </button>
        </div>
      </section>
      <hr class="w-full border-t border-gray-600 my-4"/>
      <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div
            v-for="(ticker) of slicedTickers"
            :key="ticker.name"
            @click="selectedTicker = ticker"
            class=" overflow-hidden shadow rounded-lg  border-purple-800 border-solid cursor-pointer"
            :class="{'border-4': selectedTicker=== ticker, 'bg-red-100': ticker.blocked}"
        >
          <div class="px-4 py-5 sm:p-6 text-center">
            <dt class="text-sm font-medium text-gray-500 truncate">
              {{ ticker.name }} - USD
            </dt>
            <dd class="mt-1 text-3xl font-semibold text-gray-900">
              {{ ticker.price || '-' }}
            </dd>
          </div>
          <div class="w-full border-t border-gray-200"></div>
          <button
              @click.stop="removeTicker(ticker.name)"
              class="flex items-center justify-center font-medium w-full bg-gray-100 px-4 py-4 sm:px-6 text-md text-gray-500 hover:text-gray-600 hover:bg-gray-200 hover:opacity-20 transition-all focus:outline-none"
          >
            <svg
                class="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="#718096"
                aria-hidden="true"
            >
              <path
                  fill-rule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clip-rule="evenodd"
              ></path>
            </svg>
            Удалить
          </button>
        </div>
      </dl>
      <hr class="w-full border-t border-gray-600 my-4"/>
    <view-graph
        :selectedTicker="selectedTicker"
        :price="price"
    />
    </div>
  </div>
</template>

<style>

</style>
<script>
import addTicker from "@/components/addTicker";
import viewGraph from "@/components/graph";
import {sharedWorker} from "@/api/ConnectToSharedWorker";

export default {
  data() {
    return {
      tickers: [],
      price: 0,

      selectedTicker: null,
      filter: '',
      page: 1,

      ELEM_ON_PAGE: 6,
    }
  },
  components: {
    addTicker,
    viewGraph,
  },
  methods: {
    addTicker(tickerName) {
      this.tickers = [...this.tickers, {name: tickerName}];
      this.setLSDataTickers(this.tickers);
      sharedWorker.port.postMessage({name: tickerName})
    },
    updatePrice(ticker, price) {
      price = eval(price);
      let tick = this.tickers.find(t => t.name === ticker);
      if (tick) {
        if (tick === this.selectedTicker) {
          this.price = price;
        }
        if (!price) {
          tick.price = '-'
          tick.blocked = true;
        } else {
          tick.price = price
        }
      }
    },
    removeTicker(name) {
      if (this.selectedTicker && this.selectedTicker.name === name) {
        this.selectedTicker = null;
      }
      sharedWorker.port.postMessage({name: name, remove: true})
      let index = this.tickers.findIndex(t => t.name === name)
      this.tickers.splice(index, 1);
      this.setLSDataTickers(this.tickers);
    },
    getURLParams() {
      let params = new URL(window.location).searchParams;
      this.filter = params.get('filter') || '';
      this.page = params.get('page') || 1
    },
    getLSDataTickers() {
      this.tickers.push(...JSON.parse(localStorage.getItem('tickers')));
    },
    setLSDataTickers(arr) {
      localStorage.setItem('tickers', JSON.stringify(arr));
    },
    toSubscribe() {
      this.tickers.forEach(t => {
            sharedWorker.port.postMessage({name: t.name})
          }
      )
    },
  },
  computed: {
    params() {
      return {
        filter: this.filter,
        page: this.page
      }
    },
    slicedTickers() {
      let start = (this.page - 1) * this.ELEM_ON_PAGE;
      let end = (this.page * this.ELEM_ON_PAGE);
      return this.filteredTickers.slice(start, end);
    },
    filteredTickers() {
      return this.tickers.filter(t => t.name.includes(this.filter.toUpperCase()))
    },
    isNextPage() {
      return this.filteredTickers.length > this.page * this.ELEM_ON_PAGE;
    },
  },
  watch: {
    slicedTickers(v) {
      if (v.length === 0 && this.page > 1) {
        this.page--
      }
    },
    filter() {
      this.page = 1;
    },
    params(v) {
      window.history.pushState(null, document.title, window.location.pathname + `?filter=${v.filter}&page=${v.page}`)
    }
  },
  created() {
    this.getURLParams()
    this.getLSDataTickers()
    sharedWorker.port.onmessage = (e) => {
      if (e.data === 'opened') {
        this.toSubscribe()
      }
      if (typeof e.data === 'object') {
        let name = e.data.name;
        let price = e.data.price;
        this.updatePrice(name, price.toFixed(3))
      }
    }
  },

}
</script>
