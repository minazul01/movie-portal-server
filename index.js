const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const app = express()
const cors = require('cors');
const { title } = require('process');
require('dotenv').config()
const port = process.env.PORT || 8000;


// pass: vLR4FHAhmW38Pvwp

// midleware
app.use(cors());
app.use(express.json());


// console.log(process.env.pass, process.env.user)

const uri = `mongodb+srv://${process.env.user}:${process.env.pass}@cluster0.eyk5ydv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


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

    const movieCollection = client.db("movie-feature").collection("feature");
    const favouriteCollection = client.db("movie-feature").collection("favourites");

    // all movie add to postman creation 12 data
  app.post('/features', async (req, res) => {
      const data = req.body;
      const result = await movieCollection.insertOne(data);
      res.send(result);
  })
  // all movie data client site show
  app.get('/features', async (req, res) => {
    const {searchParams} = req.query;
    let option = {};
    if(searchParams){
      option = {title: {$regex: searchParams, $options: 'i'}};
    }
   
    const result = await movieCollection.find(option).toArray();
    res.send(result);
  })

  // all movie delete add
  app.delete('/features/:id', async (req, res) => {
    const id = req.params.id;
    const query = {_id: new ObjectId(id)};
    const result = await movieCollection.deleteOne(query);
    res.send(result);
    
  });

  // update movie

  app.get("/features/:id", async(req, res) => {
     const id = req.params.id;
    const query = {_id: new ObjectId(id)};
    const result = await movieCollection.findOne(query);
    res.send(result);
  })
  
  // put methode apply
  app.patch("/features/:id", async (req, res) => {
    const id = req.params.id;
    const quire = req.body;
    const filter = {_id: new ObjectId(id)};
    // const option = { upsert : false}
    const updateDocs = {
      $set: {
        title: quire?.title,
        genre: quire?.genre,
        duration: quire.duration,
        releaseYear: quire.releaseYear,
        rating: quire.rating,
        poster: quire.poster,
        description: quire.description
      }
    };
    const result = await movieCollection.updateOne(filter, updateDocs);
    res.send(result);
  })



  // favourite added movie
  app.post('/favourites', async(req, res) => {
       const data = req.body;
       const result = await favouriteCollection.insertOne(data);
       res.send(result);
  })
  // favourite movie show favourite pages
  app.get('/favourites', async(req, res) => {
    const result = await favouriteCollection.find().toArray();
    res.send(result);
  })

  // favourite movie delete
  app.delete('/favourites/:id', async (req, res) => {
    const id = req.params.id;
    const query = {_id:id};
    const result = await favouriteCollection.deleteOne(query);
    console.log(result)
    res.send(result);
    
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



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})