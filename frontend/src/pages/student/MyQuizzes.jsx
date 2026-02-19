import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Award, BookOpen, Clock } from "react-feather";
import api from "../../api";
import StudentSidebar from "../../components/studentComponents/StudentSidebar";
import StudentHeader from "../../components/studentComponents/StudentHeader";

const MyQuizzes = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            const { data } = await api.get("/student/quizzes/available");
            setQuizzes(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen overflow-hidden">
            <StudentSidebar />

            <div className="flex flex-col flex-1 bg-[#EFF6FF]">
                <StudentHeader />

                <main className="flex-1 overflow-y-auto p-6">
                    {/* Page Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-[#1E293B]">My Quizzes</h1>
                        <p className="text-sm text-[#374151] mt-1">
                            Quizzes unlock automatically when you complete 100% of a course.
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="w-10 h-10 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : quizzes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-blue-100 shadow-sm">
                            <div className="text-5xl mb-4">🎓</div>
                            <p className="text-[#1E293B] text-lg font-semibold mb-1">
                                No quizzes available yet
                            </p>
                            <p className="text-[#374151] text-sm">
                                Complete a course to unlock its quiz!
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {quizzes.map((quiz) => (
                                <div
                                    key={quiz._id}
                                    className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden hover:shadow-md hover:border-blue-300 transition-all duration-200 flex flex-col"
                                >
                                    {/* Thumbnail */}
                                    <div className="h-40 relative flex-shrink-0 bg-gradient-to-br from-[#DBEAFE] to-[#BFDBFE]">
                                        {quiz.courseThumbnail ? (
                                            <img
                                                src={quiz.courseThumbnail}
                                                alt={quiz.courseTitle}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[#1E40AF] font-extrabold text-5xl opacity-30 select-none">
                                                {quiz.courseTitle?.[0]?.toUpperCase()}
                                            </div>
                                        )}

                                        {/* Status badge */}
                                        <span
                                            className={`absolute top-3 right-3 text-white text-xs px-2.5 py-1 rounded-full font-semibold shadow ${quiz.attempted ? "bg-[#7C3AED]" : "bg-[#16A34A]"
                                                }`}
                                        >
                                            {quiz.attempted ? "Attempted" : "Unlocked ✓"}
                                        </span>

                                        {/* Best Score */}
                                        {quiz.attempted && (
                                            <div className="absolute bottom-3 left-3 bg-white/95 text-[#1E40AF] text-xs px-3 py-1.5 rounded-full font-semibold flex items-center gap-1 shadow-sm border border-blue-100">
                                                <Award size={12} />
                                                Best: {quiz.bestPercentage}%
                                            </div>
                                        )}
                                    </div>

                                    {/* Card body */}
                                    <div className="p-5 flex flex-col flex-1">
                                        <h2 className="text-[#1E293B] font-bold text-base mb-3 line-clamp-2 leading-snug">
                                            {quiz.courseTitle}
                                        </h2>

                                        <div className="flex items-center gap-4 text-xs text-[#64748B] mb-5">
                                            <span className="flex items-center gap-1">
                                                <BookOpen size={13} />
                                                {quiz.questionsCount} Questions
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock size={13} />
                                                {quiz.perQuestionTime || 30}s / Q
                                            </span>
                                        </div>

                                        <div className="mt-auto">
                                            <Link
                                                to={`/student/quiz/${quiz._id}`}
                                                className={`block w-full py-2.5 text-center rounded-xl font-semibold text-sm transition-colors ${quiz.attempted
                                                        ? "bg-[#EDE9FE] text-[#7C3AED] hover:bg-[#DDD6FE]"
                                                        : "bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                                                    }`}
                                            >
                                                {quiz.attempted ? "Retake Quiz" : "Start Quiz"}
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default MyQuizzes;
