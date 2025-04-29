const mailSender = require('../utils/mailSender');
const { courseEnrollmentEmail } = require('../mail/templates/courseEnrollmentEmail');
require('dotenv').config();

const User = require('../models/user');
const Course = require('../models/course');
const CourseProgress = require("../models/courseProgress");

const { default: mongoose } = require('mongoose');


// ================ Simulate a payment and enroll the user ================
exports.capturePayment = async (req, res) => {
    const { coursesId } = req.body;
    const userId = req.user.id;

    if (!coursesId || coursesId.length === 0) {
        return res.json({ success: false, message: "Please provide Course Id" });
    }

    for (const course_id of coursesId) {
        try {
            const course = await Course.findById(course_id);
            if (!course) {
                return res.status(404).json({ success: false, message: "Could not find the course" });
            }

            const uid = new mongoose.Types.ObjectId(userId);
            if (course.studentsEnrolled.includes(uid)) {
                return res.status(400).json({ success: false, message: "Student is already Enrolled" });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    // Simulate successful payment
    try {
        await enrollStudents(coursesId, userId, res);
        return res.status(200).json({
            success: true,
            message: "Payment simulated successfully. User enrolled.",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Enrollment failed" });
    }
};


// ================ enroll Students to course after "payment" ================
const enrollStudents = async (courses, userId, res) => {
    if (!courses || !userId) {
        return res.status(400).json({ success: false, message: "Please Provide data for Courses or UserId" });
    }

    for (const courseId of courses) {
        try {
            const enrolledCourse = await Course.findOneAndUpdate(
                { _id: courseId },
                { $push: { studentsEnrolled: userId } },
                { new: true },
            );

            if (!enrolledCourse) {
                return res.status(500).json({ success: false, message: "Course not Found" });
            }

            const courseProgress = await CourseProgress.create({
                courseID: courseId,
                userId: userId,
                completedVideos: [],
            });

            const enrolledStudent = await User.findByIdAndUpdate(
                userId,
                {
                    $push: {
                        courses: courseId,
                        courseProgress: courseProgress._id,
                    },
                },
                { new: true }
            );

            await mailSender(
                enrolledStudent.email,
                `Successfully Enrolled into ${enrolledCourse.courseName}`,
                courseEnrollmentEmail(enrolledCourse.courseName, `${enrolledStudent.firstName}`)
            );
        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: error.message });
        }
    }
};


// ================ (Optional) Mock Payment Success Email ================
exports.sendPaymentSuccessEmail = async (req, res) => {
    const { orderId = "MOCK_ORDER_ID", paymentId = "MOCK_PAYMENT_ID", amount = 99900 } = req.body;
    const userId = req.user.id;

    if (!orderId || !paymentId || !amount || !userId) {
        return res.status(400).json({ success: false, message: "Please provide all the fields" });
    }

    try {
        const enrolledStudent = await User.findById(userId);
        await mailSender(
            enrolledStudent.email,
            `Payment Received`,
            `Hi ${enrolledStudent.firstName}, your payment of ₹${amount / 100} (Order ID: ${orderId}, Payment ID: ${paymentId}) was successful.`
        );
        return res.status(200).json({ success: true, message: "Email sent successfully" });
    } catch (error) {
        console.log("error in sending mail", error);
        return res.status(500).json({ success: false, message: "Could not send email" });
    }
};
