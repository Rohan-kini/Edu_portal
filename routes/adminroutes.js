const express=require('express');
const router=express.Router();

const stud=require("./../models/stud");

// Endpoint to get data of all signed-up students (admin functionality)...must pass admin user,pwd in query parameter
router.get('/data', async (req, res) => {
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
router.delete('/data/:id', async (req, res) => {
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

module.exports=router;