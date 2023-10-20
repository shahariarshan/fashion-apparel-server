const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000


// middlewares
app.use(cors())
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const cartCollection = client.db('ProductsBd').collection('Cart')


    app.get('/products', async (req, res) => {
      const cursor = productCollection.find()
      const result = await cursor.toArray();
      res.send(result)
    })

    app.get('/carts',async(req,res) =>{
      const cursor =cartCollection.find()
      const result=await cursor.toArray()
      res.send(result)
    })

    // app.get('/carts/:id', async (req,res)=>{
    //   const id =req.params.id;
    //   const query = { _id: new ObjectId(id) }
    //   console.log(query)
    //   const result=await cartCollection.findOne(query)
    //   res.send(result)

    // })

    app.get('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }

      console.log(query);
      const result = await productCollection.findOne(query)
      res.send(result)
    })


    app.post('/products', async (req, res) => {
      const newProduct = req.body
      console.log(newProduct)
      const result = await productCollection.insertOne(newProduct)
      res.send(result)

    })

    app.post('/carts',async(req,res)=>{
      const newCart =req.body
      console.log(newCart);
      const result = await cartCollection.insertOne(newCart);
      res.send(result)
    })

    app.delete('/carts/:id',async(req,res)=>{
      const id = req.params.id;
      console.log(id);
      const query= { _id: id}
      const result= await cartCollection.deleteOne(query);
      res.send(result);
    })

    app.put('/products/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const updateProduct = req.body
      const product = {
        $set: {
          name: updateProduct.name,
          bName: updateProduct.bName,
          type: updateProduct.type,
          description: updateProduct.description,
          price: updateProduct.price,
          rating: updateProduct.rating,
          photo: updateProduct.photo,
        }
      }
      const result = await productCollection.updateOne(filter, product, options)
      res.send(result)

    })



    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
   
    // await client.close();
  }
}
run().catch(console.dir);


// CURD section   
app.get('/', (req, res) => {
  res.send("Fashion  server is running soon")
})

app.listen(port, () => {
  console.log(`Fashion server running on port ${port}`)
})