// EXPRESS CONFIG
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
var cors = require('cors')
var logger = require('morgan');
var permittedCrossDomainPolicies = require('helmet-crossdomain');
var  dotenv = require('dotenv');
// const fileUpload = require('express-fileupload');
require('./global/variables')
require('./global/schema')


var socket = require('./socket-io/socket');

var app = express();


//  LOAD ENV FILe
dotenv.config()
// VIEW ENGINE  SETUP
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.static('public'));
app.use(express.static(__dirname));

app.use(express.json({limit:'5000mb'}));

app.use(express.urlencoded({ extended: true,limit:'5000mb'}));



app.use(cookieParser());

app.set('trust proxy', 1);

app.use(cors());

app.use(session({
  secret: 'your-secret-key',
  expires: new Date(Date.now() + 3600000),
  resave: false,
  saveUninitialized: true,
  store: new mongoStore({

    url: process.env.DB_URI,
    ttl: 14 * 24 * 60 * 60,
    autoRemove: 'native'
  })

}));

app.use(bodyParser.json({limit:'5000mb'}));
app.use(bodyParser.urlencoded({
  extended: true,
  limit: '5000mb'
}));



// routes
require('./routes')(app); 

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
  
    // Request methods you wish to allow
    //res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
   
    // Pass to next layer of middleware
    next();
  });
  


app.disable('x-powered-by');



// app.use(fileUpload());
app.use(permittedCrossDomainPolicies())


// app.use(function (req, res, next) {
//     next(createError(404));
// });
  

const port = process.env.PORT || 9002;
const socketPort = process.env.SOCKET_PORT || 9090;
app.listen(port, () => {
    console.log('Server running at ' + port)
});

socket.listen(socketPort, ()=>{
  console.log('Socket running at ' + 9090)
});

module.exports = app;