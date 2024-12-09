const Course = require("../models/Course-Model.js");

module.exports.addCourse = (req, res) => {
    let{name, description, price} = req.body;
    let newCourse = new Course({
        name: name,
        description: description,
        price: price
    })

    return newCourse.save().then(result => {
        return res.send({
            code: "COURSE-ADDED",
            message: "The course is now posted in the applicaiton.",
            result: result
        })   
    })
    .catch(error => {
        res.send({
            code: "SERVER-ERROR",
            message: "We've encountered an error while adding the course. Please try again!",
            result: error
        })
    })
}

// Get all courses
module.exports.getAllCourses = (req, res) => {
    return Course.find({}).then(result => {
        if(result == null || result.length === 0){
            return res.send({
                code: "COURSE-EMPTY",
                message: "There is no added course yet."
            })
        }else{
            return res.send({
                code: "ALL-COURSES-RESULT",
                message: "Here are the list of courses.",
                result: result
            })
        }
    })
}

// Get all active courses
module.exports.getAllActiveCourses = (req, res) => {
    return Course.find({isActive: true}).then(result => {
        if(result == null || result.length === 0){
            return res.send({
                code: "COURSE-EMPTY",
                message: "There is no added course yet."
            })
        }else{
            return res.send({
                code: "ALL-ACTIVE-COURSES-RESULT",
                message: "Here are the list of active courses.",
                result: result
            })
        }
    })
}

// Get all inactive courses
module.exports.getAllInactiveCourses = (req, res) => {
    return Course.find({isActive: false}).then(result => {
        if(result == null || result.length === 0){
            return res.send({
                code: "COURSE-EMPTY",
                message: "There is no added course yet."
            })
        }else{
            return res.send({
                code: "ALL-INACTIVE-COURSES-RESULT",
                message: "Here are the list of inactive courses.",
                result: result
            })
        }
    })
}

// Get specific course
module.exports.getSpecificCourse = (req, res) => {
    const {courseId} = req.params;
    return Course.findById(courseId).then(result => {
        if(result == null || result.length === 0){
            return res.send({
                code: "COURSE-NOT-FOUND",
                message: "The course cannot be found."
            })
        }else{
            return res.send({
                code: "COURSE-FOUND",
                message: `The data from ${courseId.toUpperCase()}`,
                result: result
            })
        }
    })
}

// Archive course
module.exports.archiveCourse = (req,res) => {
    const {courseId} = req.params;
    const updateField = {
        isActive: false
    }

    return Course.findByIdAndUpdate(courseId, updateField).then(result => {
        if(result === null || result.length === 0){
            res.send({
                code: "COURSE-NOT-FOUND",
                message: "Cannot found course with the provided ID."
            })
        }else{
            res.send({
                code: "COURSE-ARCHIVED-SUCCESSFULLY",
                message: "The couse is now in archives.",
                result: result
            })
        }
    })
}

// Unarchive course
module.exports.activateCourse = (req,res) => {
    const {courseId} = req.params;
    const updateField = {
        isActive: true
    }

    return Course.findByIdAndUpdate(courseId, updateField).then(result => {
        if(result === null || result.length === 0){
            res.send({
                code: "COURSE-NOT-FOUND",
                message: "Cannot found course with the provided ID."
            })
        }else{
            res.send({
                code: "COURSE-ACTIVATED-SUCCESSFULLY",
                message: `${result.name} is now activated.`,
                result: result
            })
        }
    })
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports.updateCourse = async (req, res) => {
try {

    
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId);
    const { courseName, courseDescription, status } =req.body;
    if(!course) {
        return res.status(404).json({message: "Course not found"});
    }

    course.courseName = courseName || course.courseName;
    course.courseDescription = courseDescription || course.courseDescription;
    course.status = status || course.status;

    await course.save();

    res.status(200).json({message:"Course updated successfully", course});
}catch (err){
    res.status(400).json({error: err.message});
}
};
