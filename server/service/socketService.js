module.exports = (io) => {

    const file2SocketList = new Map()
    const socket2File = new Map()

    io.on('connection', socket => {
        const fileId = socket.handshake.query['fileId']
        socket2File.set(socket.id, fileId)

        let socketList = file2SocketList.get(fileId)
        if (!socketList) {
            socketList = []
            file2SocketList.set(fileId, socketList)
        }
        socketList.push(socket.id)

        io.to(socket.id).emit('msg', 'succeed')

        socket.on('change', delta => {
            let file = socket2File.get(socket.id)
            let peerSockets = file2SocketList.get(file)
            if (peerSockets) {
                for (let i = 0; i < peerSockets.length; i++) {
                    if (peerSockets[i] !== socket.id) io.to(peerSockets[i]).emit('change', delta)
                }
            }
        })
    })
}