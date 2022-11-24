const express = require('express');
const cors = require('cors');
const app = express()
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()

const port = process.env.PORT || 5000;


// Middle-wear
app.use(cors())
app.use(express())


// carUser
// SBbT8Rd5OaVJFhvB


const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASSWORD}@cluster0.ts14m7y.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

console.log(uri)
async function run(){
    try{

    }
    finally{

    }
}

run().catch(error => console.log(error))



app.get('/', (req, res)=>{
    res.send("Car seller server is running")
})

app.listen(port, ()=>{
    console.log(`Car seller server is running on ${port}`)
})



