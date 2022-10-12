const API_KEY = `7901e3b83a8343a16903ceb7e8abe2f374967d490aa1bcf99b6d787308181da7`;
const socket = new WebSocket(`wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`)

socket.addEventListener('open', () => {
    sendToWS('SubAdd', 'BTC', 'USD')
    ports.forEach(port => {
        port.postMessage('opened')
    })
}, {once: true})

let ports = [];
let coins = [];

importScripts('responseWS.js')
importScripts('requestWS.js')


function sendToWS(action, name, coin) {
    let obj = {
        "action": action,
        "subs": [`5~CCCAGG~${name}~${coin}`]
    }
    let stringifiedObj = JSON.stringify(obj);
    socket.send(stringifiedObj)
}
