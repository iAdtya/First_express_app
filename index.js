const express = require('express');
const path = require('path');
const port = 8080;


const db = require('./config/mongoose')

const Contact = require('./models/contact');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: true}));
app.use(express.static('assets'));

var contactList = [
    {
        name: "Arpan",
        phone: "1111111111"
    },
    {
        name: "Tony Stark",
        phone: "1234567890"
    },
    {
        name: "Coding Ninjas",
        phone: "12131321321"
    }
]

app.get('/practise', function(req, res){
    return res.render('practise', {
        title: "Let us play with ejs"
    });
});

//todo  fetch data from database
app.get('/', async function(req, res) {
    try {
        const contacts = await Contact.find({});
        return res.render('home', {
            title: "Contact List",
            contact_list: contacts
        });
    } catch (err) {
        console.log('Error in fetching contacts from db', err);
        return res.status(500).send('Error fetching contacts');
    }
});

app.post('/create-contact', async function(req, res) {
    try {
        const newContact = await Contact.create({
            name: req.body.name,
            phone: req.body.phone
        });

        console.log('New contact:', newContact);
        return res.redirect('back');
    } catch (err) {
        console.log('Error in creating a contact!', err);
        return res.status(500).send('Error creating contact');
    }
});


app.listen(port, function(err){
    if (err) {
        console.log("Error in running the server", err);
    }
    console.log('Yup!My Server is running on Port', port);
})

// app.get('/delete-contact/', function(req, res){
//     console.log(req.query);
//     let id = req.query.id

//     Contact.findByIdAndDelete(id,function(err){
//         if(err){
//             console.log('Error in deleting an object from database');
//             return;
//         }
        
//         return res.redirect('back');
//     });
// });
//todo when we use async await we dont need to use callback function

app.get('/delete-contact/', async function(req, res){
    console.log(req.query);
    let id = req.query.id

    const result = await Contact.findByIdAndDelete(id);

    if (result) {
        console.log('Contact deleted successfully');
        return res.redirect('back');
    } else {
        console.log('Error in deleting an object from database');
        return;
    }
});