const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
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
