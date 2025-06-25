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
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];

app.use(cors({
    origin: function(origin, callback){
        if(!origin) return callback(null, true);
        if(allowedOrigins.indexOf(origin) === -1){
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));

app.use(express.static('public'));

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }  
}));

app.use(router);

app.listen(3000,()=>{
    console.log("Server running in port 3000")
})
