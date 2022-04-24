
  require('dotenv').config();

  const mongoose = require('mongoose');
  //mongoose.Promise = global.Promise
  mongoose.connect(process.env.DB_URI, {
    maxPoolSize: 100,
    socketTimeoutMS: 6000000,
    useNewUrlParser: true,
    useUnifiedTopology : true
  });
  // mongoose.set('useCreateIndex', true);
  // mongoose.set('useFindAndModify', false);
  
  
  // CONNECTION EVENTS
  // When successfully connected
  mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open');
  });
  
  // If the connection throws an error
  mongoose.connection.on('error',function (err) {
    console.log('Mongoose default connection error: ' + err);
  });
  
  // When the connection is disconnected
  mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
  });
  
  // If the Node process ends, close the Mongoose connection
  process.on('SIGINT', function() {
    mongoose.connection.close(function () {
      console.log('Mongoose default connection disconnected through app termination');
      process.exit(0);
    });
  });
  