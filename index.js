const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();


app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mswof.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    await client.connect();
    const productCollection = client.db("parts_manufacturer").collection("products");
    const bookingCollection = client.db("parts_manufacturer").collection("booking");
    const updateCollection = client.db("parts_manufacturer").collection("update");
    const reviewCollection = client.db("parts_manufacturer").collection("review");
    const emailCollection = client.db("parts_manufacturer").collection("email");

    // for booking 
    app.get('/product', async (req, res) => {
      const query = {};
      const cursor = productCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });

    // get for one item 
    app.get('/product/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await productCollection.findOne(query);
      res.send(product);
    })

    // table for data 
    // this code need 
    app.get('/booking', async (req, res) => {
      const customerEmail = req.query.customerEmail;
      const query = { customerEmail: customerEmail };
      const bookings = await bookingCollection.find(query).toArray();
      res.send(bookings);
    })
    // bookin code 
    app.post('/booking', async (req, res) => {
      const booking = req.body;
      const result = await bookingCollection.insertOne(booking);
      res.send(result);
    })

    app.get('/update', async (req, res) => {
      const phoneNumber = req.query.phoneNumber;
      const query = { phoneNumber: phoneNumber };
      const update = await updateCollection.find(query).toArray();
      res.send(update);
    })

    app.post('/update', async (req, res) => {
      const booking = req.body;
      const result = await updateCollection.insertOne(booking);
      res.send(result);
    })
    // get customer review 
    app.get('/review', async (req, res) => {
      const query = {};
      const cursor = reviewCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });
    //  customer review code 
    app.post('/review', async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    })

    app.delete('/booking/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bookingCollection.deleteOne(query);
      res.send(result);
    });

  } finally {

  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send(' parts site is running')
})

app.listen(port, () => {
  console.log(`parts server is connected ${port}`)
})