const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());


const uri = process.env.DB_PATH;
let client = new MongoClient(uri ,{ useNewUrlParser:true })



app.get('/' , (req, res) => {
    res.send("Welcome to Red Onion Server");
})


app.get('/foods' , (req, res) => {
    client = new MongoClient(uri ,{ useNewUrlParser:true });
    client.connect(err => {
            const collection = client.db('redOnion').collection('foods');
            collection.find().toArray((err, documents) => {
                if(err){
                    console.log(err);
                    res.status(500).send("Failed to Fetch Data ");
                }else{
                    res.send(documents);
                }
                
            });
            client.close();
    });
});

app.get('/food/:id', (req,res) => {
    client = new MongoClient(uri,{ useNewUrlParser:true })
    const foodId = Number(req.params.id)

    client.connect(err => {
        const collection = client.db('redOnion').collection('foods');
        console.log(foodId);
        collection.find({id:foodId}).toArray((err, documents) => {
            if(err){
                console.log(err);
            }else{
                res.send(documents[0]);
            }
            
        });
        client.close();
    });
});

app.get('/features' , (req, res) => {
    client = new MongoClient(uri , { useNewUrlParser:true });
    client.connect(err => {
        const collection = client.db('redOnion').collection('features');
        collection.find().toArray((rej,documents) => {
            if(rej){
                res.status(500).send("Failed to fetch data");
            }else{
                res.send(documents);
            }
        }); 
        client.close();
    });

});

// Post
app.post('/submitorder' , (req,res) => {
    const data = req.body;
    console.log(data);
    client = new MongoClient(uri , {useNewUrlParser:true , useUnifiedTopology: true});
    client.connect(err => {
        const collection = client.db('redOnion').collection('orders');
        collection.insert(data , (rej, result) =>  {
            if(rej){
                res.status(500).send("Failed to insert")
            }else{
                res.send(result.ops[0])
            }
        })
    })
})

// Bellows are dummy post method used just one time
app.post('/addfood' , (req,res) => {
    const data = req.body;
    console.log(data);
    client = new MongoClient(uri , { useNewUrlParser:true });
    client.connect(err => {
        const collection = client.db('redOnion').collection('foods');
        collection.insert(data , (rej, documents) =>  {
            if(rej){
                res.status(500).send("Failed to insert");
            }else{
                res.send(documents);
            }
        });
        client.close();
    });
});

app.post('/addfeatures' , (req,res) => {
    const data = req.body;
    console.log(data);
    client = new MongoClient(uri , { useNewUrlParser:true });
    client.connect(err => {
        const collection = client.db('redOnion').collection('features');
        collection.insert(data , (err, documents) =>  {
            if(err){
                res.status(500).send("Failed to insert");
            }else{
                res.send(documents);
            }
        });
        client.close();
    });
});


const port = process.env.PORT || 3200;
app.listen(port, err => {
    err ? console.log(err) : console.log("Listing for port :" , port);
})