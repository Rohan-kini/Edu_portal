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

app.get('/login',function(req,res){
    res.send('This is a Login page')
})

// app.post('/signup',function(req,res){
//     es.send('Singup successful')
// })

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
// app.post('/datasp',(req,res)=>{
//     console.log('datass')
// })


// Endpoint to get data of all signed-up students (admin functionality)...must pass admin user,pwd in query parameter
app.get('/login/data', async (req, res) => {
    try {
        // Check if the requesting user is an admin
        const { username, password } = req.query; // Assuming username and password are passed as query parameters
        const adminUser = await stud.findOne({ username, password, role: 'admin' });
        if (!adminUser) {
            return res.status(403).json({ error: 'Forbidden: Only admin users can access this endpoint' });
        }

        // If user is admin, retrieve data of all students
        const allStudents = await stud.find({});
        return res.status(200).json({ students: allStudents });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


//End point and passing user,pwd of admin to delete record of student with student ID in url too ....
app.delete('/login/data/:id', async (req, res) => {
    try {
        // Check if the requesting user is an admin
        const { username, password } = req.query; // Assuming username and password are passed as query parameters
        const adminUser = await stud.findOne({ username, password, role: 'admin' });
        if (!adminUser) {
            return res.status(403).json({ error: 'Forbidden: Only admin users can access this endpoint' });
        }

        // Get the student ID from the request parameters
        const studentId = req.params.id;

        // Find and delete the student record
        const deletedStudent = await stud.findByIdAndDelete(studentId);
        if (!deletedStudent) {
            return res.status(404).json({ error: 'Student not found' });
        }

        return res.status(200).json({ message: 'Student record deleted successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/login/student/:id', async (req, res) => {
    try {
        const studentId = req.params.id; // Extract the id from the URL parameter
        const updatedStudentData = req.body; // Updated data for the student

        const response = await stud.findByIdAndUpdate(studentId, updatedStudentData, {
            new: true, // Return the updated document
            runValidators: true, // Run Mongoose validation
        });

        if (!response) {
            return res.status(404).json({ error: 'Student not found' });
        }

        console.log('Data updated');
        res.status(200).json(response);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});










app.listen(3000,()=> {
    console.log('Server is listening ')
})

