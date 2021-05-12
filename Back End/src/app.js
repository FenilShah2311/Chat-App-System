const express = require('express');
const app = express();
const cors = require('cors');
const routes = require('./routes');
const dotenv = require('dotenv');
const crypto = require('crypto');

const alice = crypto.getDiffieHellman('modp15');
const bob = crypto.getDiffieHellman('modp15');
console.log(alice.getPrime().toString('hex'));
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(routes);

let port = process.env.PORT;
let server = app.listen(port, () => {
    console.log(`Listening to PORT ${process.env.PORT}`);
});
let broadcaster;

const io = require('./socket').init(server);
io.on('connection',async socket => {
    broadcaster = socket.id;
    console.log("socket connected");
    //socket.on('add_message',(i))
});
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/test.html');
});

module.exports = app;