const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000

app.use(express.json());
app.use(cors());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.user_name}:${process.env.password}@cluster0.t8f7yaj.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection

        const displayCollection = client.db("headphones").collection("display");
        const wiredCollection = client.db("headphones").collection("wiredHeadphone");

        app.get('/display', async (req, res) => {
            const result = await displayCollection.find().toArray();
            res.send(result);
        })

        app.get('/wired', async (req, res) => {
            const result = await wiredCollection.find().toArray();
            res.send(result);
        })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send(`shopcart server is running at ${port}`)
})

app.listen(port, () => {
    console.log(`shopcart server is running at ${port}`)
})