const express = require('express'); 

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public')); // al files in static are served by default

const server = require('http').createServer(app);

// Socket.io communication betwen live instances
const io = require('socket.io')(server); // we add server in argument here to be able to share the same port for express and socket.io.
// this is because repl.it does not allow us to use 2 ports (or I could not find out how)
// see https://www.npmjs.com/package/socket.io for more info on running socket.io with express

io.on('connection', socket => {
  // subscribe to event for sketchId
  // we do that by joining a room
	socket.on('subscribe', data => {
    if (data.username && data.sketchId) {
      const room = data.username + '_' + data.sketchId
      // join the room called sketchId
      socket.join(room, () => {
        // console.log(`${socket.id} has joined ${room}`)
      }); 
    }
  });
  // if we receive a reload message with a username and sketchId
  // we send a reload message to all subscribers in the associated room
	socket.on('reload', data => {
    if (data.username && data.sketchId) {
      const room = data.username + '_' + data.sketchId
      socket.to(room).emit('reload');
		  // console.log(`${room} is being reloaded`);
    }
  });
});


// Usage logs
// We only log the number of times any sketch is requested in p5live to get a rough sense of usage. We do not track username or sketchId, nor any IP or other related event. 
// We also do not use any anlytics on the html page we serve, no Google analytics or any other similar tracking.
// You can download the entire database at https://p5live.jgrizou.repl.co/db/
const Client =  require("@replit/database");
const client = new Client()

function logUsage() {
  (async () => {
    // key is the day in YYYY-MM-DD format
    // current timestamp in milliseconds
    var datetime = new Date();
    var key = datetime.toISOString().slice(0,10)
    let value = await client.get(key);
    if (value == null) {
      // undefined yet, we start at 1
      await client.set(key, 1);
    } else {
      // we increment by one
      await client.set(key, value + 1);
    }
  })();
}

// Note that we do not need to specify the root path because we made /public static and /punlic contains a index.html file.
app.get('/db', (req, res) => {
  (async () => {
    let data = await client.getAll();
    res.json(data)
  })();
})

// Route to return live sketch given a sketch id defined in url
app.get('/:username/:sketchId', (req, res) => {
    // log a request was made
    logUsage()
    // Retrieve the username and sketchId from the URL path
    var username = req.params.username;
    var sketchId = req.params.sketchId;
    // ideally do some test to check the sketchId page exists in p5js.org
    // NOT IMPLEMENTED
    // if valid render it
    res.render('p5livesketch', { username: username, sketchId: sketchId });
});

app.get('/*', (req, res) => {
  // if request not handled by above route, default to 404
  res.status(404);
  // default to plain-text. send()
  res.type('txt').send('This page does not exist, please go to https://p5live.jgrizou.repl.co');
})

// start the server
server.listen(3000, () => {
  console.log('server started')
});
