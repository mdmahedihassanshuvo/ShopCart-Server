const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000

app.use(express.json());
app.use(cors());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const wirelessCollection = client.db("headphones").collection("wirelessHeadphone");
        const addToCartCollection = client.db("headphones").collection("addToCart");

        app.get('/display', async (req, res) => {
            const result = await displayCollection.find().toArray();
            res.send(result);
        })

        app.get('/wired', async (req, res) => {
            const result = await wiredCollection.find().toArray();
            res.send(result);
        })

        app.get('/wireless', async (req, res) => {
            const result = await wirelessCollection.find().toArray();
            res.send(result);
        })

        app.post('/addCart', async (req, res) => {
            const product = req.body;
            const query = req.params.email
            const result = await addToCartCollection.insertOne(product);
            res.send(result);
        })

        app.get('/addCart', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const result = await addToCartCollection.find(query).toArray();
            res.send(result);
        })

        app.get('/addCart/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const query = { _id: id };
                const result = await addToCartCollection.findOne(query);

                if (!result) {
                    return res.status(404).send("No matching document found.");
                }

                res.send(result);
            } catch (err) {
                console.error("Error fetching data:", err);
                res.status(500).send("Internal Server Error");
            }
        });

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