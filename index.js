const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;

//Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ac-9lu1yzb-shard-00-00.u4ewrvk.mongodb.net:27017,ac-9lu1yzb-shard-00-01.u4ewrvk.mongodb.net:27017,ac-9lu1yzb-shard-00-02.u4ewrvk.mongodb.net:27017/?ssl=true&replicaSet=atlas-jcd1z5-shard-0&authSource=admin&appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get("/", (req, res) => {
  res.send("Hello Smart Dealer");
});

async function run() {
  try {
    await client.connect();


    const db = client.db('smart_db')
    const productsCollection = db.collection('products')
    const bidsCollection = db.collection('bids')

    //Create Product
    app.post('/products',async(req,res)=>{
        const newProduct = req.body;
        const result = await productsCollection.insertOne(newProduct)
        res.send(result)
    })

    //Read/Get Product
    app.get('/products',async(req,res)=>{
        const cursor = productsCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })

    //Read/Get a Specific Product
    app.get('/products/:id',async(req,res)=>{
        const id = req.params.id
        const query = {_id: new ObjectId(id)}
        const result = await productsCollection.findOne(query)
        res.send(result)
    })

    //Update Product
    app.patch('/products/:id',async(req,res)=>{
        const id = req.params.id
        const updatedProduct = req.body
        const query = {_id: new ObjectId(id)}
        const update = {
            $set: {
                name : updatedProduct.name,
                price: updatedProduct.price
            }
        }
        const result = await productsCollection.updateOne(query,update)
        res.send(result)
    })

    //Delete Products
    app.delete('/products/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await productsCollection.deleteOne(query)
        res.send(result)
    })


    //Bids Related APIs
    app.get('/bids',async(req,res)=>{
      const email = req.query.email
      const query = {}
      if(email){
        query.buyer_email = email
      }


      const cursor = bidsCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })


    app.get('/bids/:id',async(req,res)=>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await bidsCollection.findOne(query)
      res.send(result)
    })

    app.post('/bids',async(req,res)=>{
      const newBid = req.body
      const result = await bidsCollection.insertOne(newBid)
      res.send(result)
    })

    app.delete('/bids/:id',async(req,res)=>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await bidsCollection.deleteOne(query)
      res.send(result)
    })



    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, (req, res) => {
  console.log(`Smart server is running in port: ${port}`);
});
