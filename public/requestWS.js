self.onconnect = ({ports: [port]}) => {
    ports.push(port)
    port.onmessage = (e) => {
        if (e.data.remove) {
            if (e.data.name === 'BTC') {
                return
            }
            sendToWS('SubRemove', e.data.name, 'USD')
            sendToWS('SubRemove', e.data.name, 'BTC')
        }
        else {
            sendToWS("SubAdd", e.data.name, 'USD')
        }
    }
}


