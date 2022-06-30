global.nodemailer = require('nodemailer');
global.bcrypt = require('bcrypt');
global.mongoose = require('mongoose');
global.config = require('../config/db_config');
global.session = require('express-session');
global.mongoStore = require('connect-mongo')(session);
global.schema  = mongoose.Schema;
global.ejs = require("ejs");
global.fetch = require('node-fetch');
global.lodash = require('lodash');
global.paypal= require('paypal-rest-sdk');

global.fs = require('fs');

  
let stripeAPI =  { secretKey: 'sk_test_51KnhTJGAX1ovFy7TMDtGCPVy0UOnaZWO0cdMcS5cytztE0a1sw3S2jSEytJfmWzI6SvWNROc7TGoGze41AbIgFsx00szySNDGm'};

global.stripe= require('stripe')(stripeAPI.secretKey);



paypal.configure({
    'mode': 'sandbox', //sandbox or live    
    'client_id': 'AQCApKV7adW0kyMNrVLUrEYaXT5NOfB4LkyLuhygjvlTyswou_xrtmdvdAIOgGtEg6EgcZSXqK84-0Sp',
    'client_secret': 'EFzba5tSihQ6UPq9BqpmQk6Bhc5TxGUDXgSR4Jb1yymu2R4TEnXdDEj9rxTQsvvKaq5P1UMOgAaGK7R3'
});



global.transporter = nodemailer.createTransport({
    service: 'gmail.com',
    host: 'smtp.gmail.com',
    auth: {
        user: 'developer01000@gmail.com',
        pass: 'eecwpreoiljnggbl'
    }
});
