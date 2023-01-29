const express = require('express');
const cors = require('cors');  
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

//midlleware
app.use(express.json())
app.use(cors())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.6ke0m0t.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const postsCollection = client.db('postifydb').collection('postsCollection')
        
        //post new activity
        app.post('/newpost', async(req, res) => {
            const postbody = req.body;
            const result = await postsCollection.insertOne(postbody)
            res.send(result)
        });

        //get all the posts
        app.get('/allposts', async(req, res) => {
            const query = {};
            const result = await postsCollection.find(query).toArray();
            res.send(result)
        })

        //to delete post
        app.delete('/mypost', async(req, res) => {
            const id = req.query.id;
            const query = {_id: ObjectId(id)}
            const result = await postsCollection.deleteOne(query)
            res.send(result)
        })

        //my profile page 
        app.post('/myprofile', async(req, res) => {
            const prorfilebody
        })
    }
    finally{}
}
run().catch(e => console.error(e))

app.get('/', (req, res) => {
    res.send(`Postify server is running`)
})

app.listen(port, () => {
    console.log(`postify server is running at ${port}`);
})