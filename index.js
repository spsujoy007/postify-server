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
        const usersCollection = client.db('postifydb').collection('usersCollection')
        
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

        //get only my post
        app.get('/mypost', async(req, res) => {
            const email = req.query.email;
            const query = {email: email}
            const result = await postsCollection.find(query).toArray()
            res.send(result)
        })

        //edit my post 
        app.patch('/editpost', async(req, res) => {
            const id = req.query.id;
            const query = { _id: ObjectId(id)};
            const result = postsCollection.updateOne(query);
            res.send(result)
        })

        //to delete post
        app.delete('/mypost', async(req, res) => {
            const id = req.query.id;
            const query = {_id: ObjectId(id)}
            const result = await postsCollection.deleteOne(query)
            res.send(result)
        })

        //save users to backend
        app.post('/saveuser', async(req, res) => {
            const userinfo = req.body;
            const result = await usersCollection.insertOne(userinfo)
            res.send(result)
        })

        // get all users 
        app.get('/allusers', async(req, res) => {
            const query = {};
            const result = await usersCollection.find(query).toArray()
            res.send(result)
        })

        //get my profile page
        app.get('/myprofile', async(req, res) => {
            const myemail = req.query.email;
            const query = {email: myemail};
            const result = await usersCollection.findOne(query);
            res.send(result)
        })

        app.get('/profile', async(req,res) => {
            const email = req.query.email;
            const query =  {email: email};
            const result = await usersCollection.findOne(query);
            res.send(result)
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