const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000


// middlewares
app.use(cors())
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hoyasjp.mongodb.net/?retryWrites=true&w=majority`;

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


    const productCollection = client.db('ProductsBd').collection('Products')


    app.get('/products', async (req, res) =>{
      const cursor = productCollection.find()
      const result =await cursor.toArray();
      res.send(result)
    })
   

    app.post('/products', async (req, res) => {
      const newProduct = req.body
      console.log(newProduct)
      const result = await productCollection.insertOne(newProduct)
      res.send(result)

    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


// CURD section 
app.get('/', (req, res) => {
  res.send("technology-electronics-devices-server is running soon")
})

app.listen(port, () => {
  console.log(`technology-electronics-devices-server running on port ${port}`)
})