  
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var cookie = require('cookie-parser');
const session = require('express-session');
const static = require('serve-static');
const path = require('path');
const flash = require('connect-flash');

const api = require('./routes/index');


const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('views', __dirname + "/views");
app.set('view engine', 'ejs');
app.use('/public', static(path.join(__dirname, 'public')));

app.use(flash());
app.use(cookie());


app.use(session({
    secret: 'my_key',
    resave: false,
    saveUninitialized: true,
    rolling: true,
    cookie: { maxAge: 1000 * 60 * 60 },
}));

app.use('/', api);

app.listen(port, () => {
    console.log("서버 시작! : " + app.get('port'));

    connectDB();
});

function connectDB() {
    const dbUrl = "mongodb+srv://dyair_user:dyair_password@dyairproject-e40op.mongodb.net/test?retryWrites=true&w=majority";

    console.log('db연결을 시도합니다.');
    mongoose.Promise = global.Promise;
    mongoose.connect(dbUrl);
    const db = mongoose.connection;

    db.on('error', console.error.bind(console, 'mongoose connections error'));
    db.on('open', function () {
        console.log('db 연결 성공!! : ' + dbUrl);
    })
}