import SocketIO from 'socket.io-client'
import SailsIO from 'sails.io.js'

const io = SailsIO(SocketIO)

export default io

