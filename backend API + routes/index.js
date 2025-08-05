const express = require ('express');
const mongoose = require ('mongoose')
const cors = require ('cors')
const app = express ();

let productsRouter = require ('./routes/product.js');

let db=mongoose.connection;

app.use(cors());

app.use(express.json());

app.use((req,res,next) => {
req.db=db;
next();
});

app.use('/products',productsRouter);

app.get('/', (req,res) =>  {
    res.writeHead(200,{"Content-Type": "text/html"});
    res.end('<p>Hello Wolrd !</p>');
});

app.get('/home', (req,res) =>  {
    res.writeHead(200,{"Content-Type": "text/html"});
    res.end('<p>Page Home!</p>');
});

app.get('/json', (req,res) =>  {
    res.json({message :"Hellow World" });
});


const start = async () => {
    try{
        await mongoose.connect("mongodb://localhost:27017/products")

        app.listen(8000,() => {
        console.log('Example app listening on port 8000!')
    });
}catch(e) {
        console.log(e.message);
    console.log(e)
    }
}
start ();



