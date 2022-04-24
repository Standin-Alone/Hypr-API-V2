global.nodemailer = require('nodemailer');
global.bcrypt = require('bcrypt');
global.mongoose = require('mongoose');
global.config = require('../config/db_config');
global.session = require('express-session');
global.mongoStore = require('connect-mongo')(session);
global.schema  = mongoose.Schema;
global.ejs = require("ejs");
global.fetch = require('node-fetch');
global.transporter = nodemailer.createTransport({
    service: 'gmail.com',
    host: 'smtp.gmail.com',
    auth: {
        user: 'developer01000@gmail.com',
        pass: '01000webdeveloper'
    }
});
