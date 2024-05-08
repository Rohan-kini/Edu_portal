const express=require('express');
const router=express.Router();

const stud=require("./../models/stud");

router.put('/student/:id', async (req, res) => {
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

module.exports=router;

