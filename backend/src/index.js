import express from 'express'
import Connection from './database/Connection.js';
import router from './router/web.js';
import cors from 'cors';
import session from 'express-session';
import MongoStore from 'connect-mongo';

const app=express();
new Connection();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

app.use(express.static('public'));
app.use(router);

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }  
}));


app.listen(3000,()=>{
    console.log("Server running in port 3000")
})