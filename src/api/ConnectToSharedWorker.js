export const sharedWorker = new SharedWorker('./webSocket.js', {type: 'module'})
sharedWorker.port.start()

