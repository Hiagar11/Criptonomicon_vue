socket.onmessage = (e) => {
    const {
        PARAMETER: param,
        MESSAGE: msg,
        TYPE: type,
        PRICE: price,
        FROMSYMBOL: from,
        TOSYMBOL: to
    } = JSON.parse(e.data);
    if (type === '5' && price) {
        if (to === 'USD') {
            ports.forEach(port => {
                port.postMessage({name: from, price})
            });
        }
        if (to === 'BTC') {
            coins.push({name: from, price: price});
        }
    }
    if (msg === 'INVALID_SUB') {
        let from_param = param.match(/~(.+)~(.+)~/i)[2]
        let to_param = param.match(/~(.+)~(.+)~(.+)/i)[3]
        if (to_param === 'USD') {
            sendToWS("SubAdd", from_param, 'BTC')
        }
        if (to_param === 'BTC') {
            coins.push({name: from_param, price: 0})
        }
    }
    if (from === 'BTC' && to === 'USD' && price) {
        ports.forEach(port => {
            coins.forEach(coin => {
                port.postMessage({name: coin.name, price: coin.price * price})
            })
        });
    }
}
