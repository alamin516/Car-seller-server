const express = require('express');
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()

const port = process.env.PORT || 5000;


// Middle-wear
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASSWORD}@cluster0.ts14m7y.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send('Unauthorized access')
    }

    const token = authHeader.split(' ')[1]

    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'Forbidden Access' })
        }
        req.decoded = decoded;

        next()
    })

}


async function run(){
    try{
        const carsCollection = client.db('CarSeller').collection('cars');
        const categoriesCollection = client.db('CarSeller').collection('categories');
        const usersCollection = client.db('CarSeller').collection('users');



        app.post('/cars', async(req, res)=>{
            const car = {}
            const result = await carsCollection.insertOne(car);
            res.send(result)
            console.log(result);

        })

        app.get('/cars', async(req, res)=>{
            const query = {}
            const result = await carsCollection.find(query).toArray();
            res.send(result)
        })

        

        app.get('/categories', async(req, res)=>{
            const query = {}
            const result = await categoriesCollection.find(query).toArray();
            res.send(result)
        })


        app.get('/jwt', async(req, res)=>{
            const email = req.query.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            if (user) {
                const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, { expiresIn: '1h' })
                return res.send({ accessToken: token });
            }
            res.status(403).send({ accessToken: '' })
        })


        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await usersCollection.insertOne(user);
            res.send(result);
        });
        
        app.get('/users', async (req, res) => {
            const user = {}
            const result = await usersCollection.find(user).toArray();
            res.send(result);
        });

        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            console.log(query)
            const user = await usersCollection.findOne(query);
            res.send({ isAdmin: user?.role === 'admin' });
        })

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



