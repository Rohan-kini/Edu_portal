const express= require('express')
const app=express();

const db=require('./db')
const stud=require('./models/stud')


const bodyParser=require('body-parser');
app.use(bodyParser.json());
// .json ke jagah kuch aur format likha toh usme kar dega

app.get('/',function(req,res){
    res.send('This is a student portal')
})

app.post('/signup', async (req, res) => {
    try {
        const data = req.body; // Assuming the request body contains the person data
        const username = data.user;
        
        // Check if the username already exists
        const existingUser = await stud.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "Username already exists" });
        }

        // Check if an admin user already exists
        if (data.role === 'admin') {
            const adminUser = await stud.findOne({ role: 'admin' });
            if (adminUser) {
                return res.status(400).json({ error: 'Admin user already exists' });
            }
        }

        // Create a new student document using the Mongoose model
        const newstud = new stud(data);
  
        // Save the new student to the database
        const response = await newstud.save();
  
        console.log('Data saved');
        res.status(200).json(response);
  
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


//chat gpt ache se bataya kyu query mei pass nhi karneka username and password unsafe practice hai vaise toh ....url sabko dikhta h na so...
app.post('/login', async (req, res) => {
    try {
        const { user, password } = req.body;

        const userRecord = await stud.findOne({ user, password });
        if (!userRecord) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // If user is admin, provide admin functionalities
        if (userRecord.role === 'admin') {
            // You can implement admin functionalities here
            return res.status(200).json({ message: 'Admin login successful', user: userRecord });
        } else {
            // For student, just return login success
            return res.status(200).json({ message: 'Student login successful', user: userRecord });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


const studentroutes=require("./routes/studentroutes");
app.use('/login',studentroutes);

const adminroutes=require("./routes/adminroutes");
app.use('/login',adminroutes);



app.listen(3000,()=> {
    console.log('Server is listening ')
})

