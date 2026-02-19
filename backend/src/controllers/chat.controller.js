const Enrollment = require("../models/enrollment.model");
const Message = require("../models/message.model");
const Course = require("../models/course.model");
const User = require("../models/user.model");
const mongoose = require("mongoose");

// ─── Student: get list of teachers whose courses they enrolled in ────────────
exports.getMyTeachers = async (req, res) => {
    try {
        const studentId = req.user._id;

        // Get all courses this student is enrolled in, populate the teacher
        const enrollments = await Enrollment.find({ student: studentId }).populate({
            path: "course",
            select: "createdBy title",
            populate: { path: "createdBy", select: "name email avatar" },
        });

        // Deduplicate teachers
        const teacherMap = new Map();
        for (const e of enrollments) {
            const teacher = e.course?.createdBy;
            if (teacher && !teacherMap.has(teacher._id.toString())) {
                teacherMap.set(teacher._id.toString(), teacher);
            }
        }

        const teachers = Array.from(teacherMap.values());

        // Get unread counts from each teacher to this student
        const unreadCounts = await Message.aggregate([
            {
                $match: {
                    receiver: studentId,
                    read: false,
                    sender: {
                        $in: teachers.map((t) => new mongoose.Types.ObjectId(t._id)),
                    },
                },
            },
            { $group: { _id: "$sender", count: { $sum: 1 } } },
        ]);

        const unreadMap = {};
        for (const u of unreadCounts) {
            unreadMap[u._id.toString()] = u.count;
        }

        const result = teachers.map((t) => ({
            _id: t._id,
            name: t.name,
            email: t.email,
            avatar: t.avatar,
            unread: unreadMap[t._id.toString()] || 0,
        }));

        res.json(result);
    } catch (err) {
        console.error("getMyTeachers error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// ─── Teacher: get list of students enrolled in their courses ─────────────────
exports.getMyStudents = async (req, res) => {
    try {
        const teacherId = req.user._id;

        // Get all courses created by this teacher
        const courses = await Course.find({ createdBy: teacherId }).select("_id");
        const courseIds = courses.map((c) => c._id);

        // Get all enrollments for those courses
        const enrollments = await Enrollment.find({
            course: { $in: courseIds },
        }).populate("student", "name email avatar");

        // Deduplicate students
        const studentMap = new Map();
        for (const e of enrollments) {
            const student = e.student;
            if (student && !studentMap.has(student._id.toString())) {
                studentMap.set(student._id.toString(), student);
            }
        }

        const students = Array.from(studentMap.values());

        // Get unread counts from each student to this teacher
        const unreadCounts = await Message.aggregate([
            {
                $match: {
                    receiver: teacherId,
                    read: false,
                    sender: {
                        $in: students.map((s) => new mongoose.Types.ObjectId(s._id)),
                    },
                },
            },
            { $group: { _id: "$sender", count: { $sum: 1 } } },
        ]);

        const unreadMap = {};
        for (const u of unreadCounts) {
            unreadMap[u._id.toString()] = u.count;
        }

        const result = students.map((s) => ({
            _id: s._id,
            name: s.name,
            email: s.email,
            avatar: s.avatar,
            unread: unreadMap[s._id.toString()] || 0,
        }));

        res.json(result);
    } catch (err) {
        console.error("getMyStudents error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// ─── Get message history between current user and target user ─────────────────
exports.getHistory = async (req, res) => {
    try {
        const me = req.user._id;
        const other = new mongoose.Types.ObjectId(req.params.userId);

        const messages = await Message.find({
            $or: [
                { sender: me, receiver: other },
                { sender: other, receiver: me },
            ],
        })
            .sort({ createdAt: 1 })
            .limit(200)
            .lean();

        res.json(messages);
    } catch (err) {
        console.error("getHistory error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// ─── Mark all messages from sender as read ────────────────────────────────────
exports.markRead = async (req, res) => {
    try {
        const me = req.user._id;
        const sender = new mongoose.Types.ObjectId(req.params.userId);

        await Message.updateMany(
            { sender, receiver: me, read: false },
            { $set: { read: true } }
        );

        res.json({ success: true });
    } catch (err) {
        console.error("markRead error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
