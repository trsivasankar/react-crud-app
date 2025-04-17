const fs = require('fs');
const express = require("express");

const users = require('./sample.json');
const cors = require('cors');



const app = express();
const port = 3000;




app.use(cors({
    origin: "https://react-crud-app-gamma.vercel.app/",
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  }));

app.use(express.json());

//getuser details

app.get('/users', (req, res) => {

    return res.json(users);
})

//delete user

app.delete('/users/:id', (req, res) => {

    let id = Number(req.params.id); 
    let filteredUsers =  users.filter((user)=> user.id !== id);
    fs.writeFile("./sample.json", JSON.stringify(filteredUsers),(err, data)=> {
        return res.json(filteredUsers);
    }) 

    
})

//add user

app.post('/users', (req, res) => {
    let {username, age, city} =  req.body;
    if(!username || !age || !city) {
        res.status(400).send({message: "All fields are required"});
    }

    let id = Date.now();

    const newUser = { id, username, age, city };
    const updatedUsers = [...users, newUser]; // use spread to create updated array

    fs.writeFile("./sample.json", JSON.stringify(users),(err, data)=> {
        return res.json(updatedUsers);
    }) 

    
})

app.patch('/users/:id', (req, res) => {
    const id = Number(req.params.id);
    const { username, age, city, id: newId } = req.body;
  
    const index = users.findIndex(user => user.id === id);
    if (index === -1) return res.status(404).send({ message: 'User not found' });
  
    users[index] = { id: newId ?? id, username, age, city };
  
    fs.writeFile("./sample.json", JSON.stringify(users, null, 2), (err) => {
      if (err) return res.status(500).send({ message: "Error updating user" });
      res.json(users);
    });
  });
  


app.listen(port, (err) => {
    console.log(`app is running in ${port}`);

});