
const express = require('express');
const uuid = require('uuid')
const path = require('path')
const members = require('./Members')

const app = express();
const PORT = process.env.PORT || 5000;

//creating middleware
const logger = (req, res, next) => {
console.log(`${req.protocol}://${req.get('host')}${req.originalUrl}}`);
    next()
}
//init middleware
app.use(logger)

//body parser middleware (post request)
app.use(express.json())
app.use(express.urlencoded({extended: false}))


app.get('/api/members', (req, res) => {
    res.json(members)
})

app.get('/api/members/:id', (req, res) => {
    const found = members.some(member => member.id === parseInt(req.params.id))
    if (found) {res.json(members.filter(member => member.id === parseInt(req.params.id)))
    } else {
        res.status(400).json({msg: `No member with the id ${req.params.id}`})
    }
    
})

app.post('/api/members', (req, res) => {
    const newMember = {
        id: uuid.v4(),
        name: req.body.name,
        email: req.body.email
    }

    if(!newMember.name || !newMember.email) {
      return res.status(400).json({msg: "Missing information"})   
    } members.push(newMember)
    res.json(members)
})


app.put('/api/members/:id', (req, res) => {
    const found = members.some(member => member.id === parseInt(req.params.id))
    if (found) {
    const updMember = req.body;
    members.forEach(member => {
        if(member.id===parseInt(req.params.id)){
            member.name= updMember.name? updMember : member.name
            member.email=updMember.email? updMember :member.email
        }
        res.json({msg: 'Member updated', member})
    })    
    } else {
        res.status(400).json({msg: `No member with the id ${req.params.id}`})
    }
    
})

app.delete('/api/members/:id', (req, res) => {
    const found = members.some(member => member.id === parseInt(req.params.id))
    if (found) {res.json({msg:'Member deleted', members: members.filter(member => member.id !== parseInt(req.params.id))}) // retrun all BUT the deleted one
    } else {
        res.status(400).json({msg: `No member with the id ${req.params.id}`})
    }
    
})





//Set Static folder with middleware

app.use(express.static(path.join(__dirname, 'public')))

/*
app.get('/', (req, res) => {
res.sendFile(path.join(__dirname, 'public', 'index.html'))
})
*/



app.listen(PORT, () => console.log(`Server started on port ${PORT}`))


