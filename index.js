const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1i934d1.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
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

        const productCollection = client.db('productDB').collection('product')
        const cartCollection = client.db('productDB').collection('cart')

        app.get('/product', async (req, res) => {
            const cursor = productCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/product/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await productCollection.findOne(query)
            res.send(result)
        })

        app.get('/view-product/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await productCollection.findOne(query)
            res.send(result)
        })

        app.post('/product', async (req, res) => {
            const newProduct = req.body
            console.log(newProduct)
            const result = await productCollection.insertOne(newProduct)
            res.send(result)
        })

        
        app.get('/allCartData', async (req, res) => {
            const result = await cartCollection.find().toArray()
            res.send(result)
        })

        app.get('/brand/:brandName', async (req, res) => {
            const brandName = req.params.brandName
            const query = { brandName : brandName }
            const product = await productCollection.find(query).toArray()

            res.send(product)

            // const cursor = productCollection.find()
            // const product = await cursor.toArray()
        })

        app.put('/product/:id', async (req, res) => {
            const id = req.params.id
            console.log(id);
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updateProduct = req.body
            console.log(updateProduct);
            const product = {
                $set: {
                    name : updateProduct.name,
                    brandName : updateProduct.brandName,
                    price : updateProduct.price,
                    rating : updateProduct.rating,
                    image : updateProduct.image,
                    cars : updateProduct.cars,
                    message : updateProduct.message,
                }
            }
            const result = await productCollection.updateOne(filter, product, options)
            res.send(result)
        })

        app.post('/add-cart', async(req, res) => {
            const add = req.body
            const result = await cartCollection.insertOne(add)
            res.send(result)
        })

        app.delete('/product/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await cartCollection.deleteOne(query)
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







app.get('/', (req, res) => {
    res.send("Server is Running")
})

app.listen(port, () => {
    console.log(`Server is Running on : ${port}`);
})