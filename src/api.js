export const loadTicker = tickerNames => {
        tickerNames = tickerNames.map(t=> t.name.toUpperCase())
        return new Promise((res, rej) => {
                fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${tickerNames}&tsyms=USD&api_key=a0e8185127e74fcd2fc6614e285325cf231018e1b50e3184fa7b0064e49cc669`)
                    .then(text => text.json())
                    .then(text => text.Response === 'Error' ? res(null) : text)
                    .then(resp => res(resp));
        })
}
export const loadList = () => {
        return new Promise(res => {
                fetch('https://min-api.cryptocompare.com/data/blockchain/list?api_key=a0e8185127e74fcd2fc6614e285325cf231018e1b50e3184fa7b0064e49cc669')
                    .then(text => text.json())
                    .then(text => text.Response === 'Error' ? res(null) : text)
                    .then(text => res(Object.keys(text['Data'])))
        })
}
