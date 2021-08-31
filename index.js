const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser')
require('dotenv').config();
const cors = require('cors');
app.use(bodyParser.json())
app.use(cors())

console.log(process.env.DB_USER);

const { MongoClient, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tx9ov.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {

  const userCollection = client.db("Curd_App").collection("userInfo");
  console.log('connect');

  // Add user API
  app.post('/addUser', (req, res) => {
    const userInfo = req.body;
    console.log(userInfo);
    userCollection.insertOne(userInfo)
      .then(result => {
        console.log(result);
        res.send(result)
      })

  })
  // Show all user API
  app.get('/allUser', (req, res) => {
    userCollection.find({})
      .toArray((err, documents) => {
        res.send(documents)
      })
  })
// Delete user API
  app.delete('/deleteUser', (req, res) => {
    const { _id } = req.body;
    userCollection.deleteOne({ _id: ObjectId(_id) })
      .then(result => {
        res.send(result.deletedCount > 0)
      })

  })
  // Update User API
  app.patch('/updateOne', (req, res) => {
    const { _id, updateNewInfo } = req.body;
    console.log(updateNewInfo.name);
    userCollection.updateOne({ _id: ObjectId(_id) },
      {
        $set: { name: updateNewInfo.name, email: updateNewInfo.email, phoneNo: updateNewInfo.phoneNo, hobbies: updateNewInfo.hobbies }
      })
      .then(result => {
        res.send(result.modifiedCount > 0)
        //   console.log(result);
      })
  })

});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port)