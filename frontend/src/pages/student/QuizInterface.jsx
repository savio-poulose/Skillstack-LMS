import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import toast from "react-hot-toast";
import { ArrowLeft, CheckCircle, XCircle, AlertCircle } from "react-feather";
import api from "../../api";
import StudentSidebar from "../../components/studentComponents/StudentSidebar";

// ─── Circular Timer ────────────────────────────────────────────────────────────
const TimerRing = ({ timeLeft, total }) => {
    const pct = (timeLeft / total) * 100;
    const color =
        timeLeft <= 5 ? "#DC2626" : timeLeft <= 10 ? "#D97706" : "#2563EB";
    return (
        <div className="w-14 h-14 flex-shrink-0">
            <CircularProgressbar
                value={pct}
                text={`${timeLeft}`}
                styles={buildStyles({
                    textSize: "30px",
                    textColor: color,
                    pathColor: color,
                    trailColor: "#DBEAFE",
                    pathTransitionDuration: 0.8,
                })}
            />
        </div>
    );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const QuizInterface = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();

    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [quizFinished, setQuizFinished] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const answersRef = useRef([]);

    // ── Fetch quiz ─────────────────────────────────────────────────────────────
    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const { data } = await api.get(`/student/quiz/${quizId}`);
                setQuiz(data);
                setTimeLeft(data.perQuestionTime || 30);
            } catch {
                toast.error("Failed to load quiz or course not completed.");
                navigate("/student/quizzes");
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [quizId, navigate]);

    // ── Per-question countdown ─────────────────────────────────────────────────
    useEffect(() => {
        if (!quiz || isAnswered || quizFinished) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    handleTimeUp();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [quiz, isAnswered, quizFinished, currentQuestionIndex]);

    const handleTimeUp = () => {
        setIsAnswered(true);
        answersRef.current[currentQuestionIndex] = {
            questionIndex: currentQuestionIndex,
            selectedIndex: -1,
        };
        toast("⏰ Time's up!", { duration: 1500 });
    };

    const currentQuestion = quiz?.questions[currentQuestionIndex];

    const handleOptionSelect = (idx) => {
        if (isAnswered) return;
        setSelectedOption(idx);
    };

    const handleSubmitAnswer = () => {
        if (selectedOption === null) return;
        setIsAnswered(true);
        answersRef.current[currentQuestionIndex] = {
            questionIndex: currentQuestionIndex,
            selectedIndex: selectedOption,
        };
        if (selectedOption === currentQuestion.correctIndex) {
            setScore((p) => p + 1);
            toast.success("✓ Correct!", { duration: 1200 });
        } else {
            toast.error("✗ Incorrect!", { duration: 1200 });
        }
    };

    const handleNextQuestion = async () => {
        const isLast = currentQuestionIndex + 1 === quiz.questions.length;
        if (isLast) {
            quiz.questions.forEach((_, idx) => {
                if (!answersRef.current[idx])
                    answersRef.current[idx] = { questionIndex: idx, selectedIndex: -1 };
            });
            setQuizFinished(true);
            await submitResults();
        } else {
            setCurrentQuestionIndex((p) => p + 1);
            setSelectedOption(null);
            setIsAnswered(false);
            setTimeLeft(quiz.perQuestionTime || 30);
        }
    };

    const submitResults = async () => {
        setSubmitting(true);
        try {
            await api.post(`/student/quiz/${quizId}/submit`, {
                answers: answersRef.current,
            });
            setSubmitted(true);
        } catch {
            toast.error("Could not save your score.");
        } finally {
            setSubmitting(false);
        }
    };

    // ── Loading state ──────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="flex h-screen overflow-hidden">
                <StudentSidebar />
                <div className="flex-1 flex items-center justify-center bg-[#EFF6FF]">
                    <div className="text-center space-y-3">
                        <div className="w-12 h-12 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="text-[#374151] font-medium">Loading Quiz...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!quiz) return null;

    // ── Result screen ──────────────────────────────────────────────────────────
    if (quizFinished) {
        const percentage = Math.round((score / quiz.questions.length) * 100);
        const passed = percentage >= 60;

        return (
            <div className="flex h-screen overflow-hidden">
                <StudentSidebar />
                <div className="flex-1 flex items-center justify-center bg-[#EFF6FF] overflow-y-auto p-6">
                    <div className="bg-white rounded-3xl shadow-lg border border-blue-100 p-10 max-w-md w-full text-center space-y-6">
                        {/* Circular score */}
                        <div className="w-36 h-36 mx-auto">
                            <CircularProgressbar
                                value={percentage}
                                text={`${percentage}%`}
                                styles={buildStyles({
                                    textSize: "18px",
                                    pathColor: passed ? "#16A34A" : "#DC2626",
                                    textColor: "#1E293B",
                                    trailColor: "#DBEAFE",
                                })}
                            />
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-[#1E293B] mb-1">
                                {passed ? "🎉 Great Job!" : "😅 Keep Practicing!"}
                            </h2>
                            <p className="text-[#374151]">
                                You scored{" "}
                                <span className="font-bold text-[#1E293B]">
                                    {score}/{quiz.questions.length}
                                </span>{" "}
                                correct
                            </p>
                        </div>

                        {/* Save Status */}
                        <span
                            className={`inline-block text-sm font-medium px-4 py-1.5 rounded-full ${submitting
                                    ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                                    : submitted
                                        ? "bg-green-50 text-green-700 border border-green-200"
                                        : "bg-red-50 text-red-600 border border-red-200"
                                }`}
                        >
                            {submitting
                                ? "⏳ Saving score..."
                                : submitted
                                    ? "✓ Score saved!"
                                    : "⚠ Could not save score"}
                        </span>

                        <div className="flex flex-col gap-3 pt-1">
                            <button
                                onClick={() => navigate("/student/quizzes")}
                                className="w-full py-3 bg-[#2563EB] text-white rounded-xl font-semibold hover:bg-[#1D4ED8] transition"
                            >
                                Back to Quizzes
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full py-3 border-2 border-[#BFDBFE] text-[#1E40AF] rounded-xl font-semibold hover:bg-[#DBEAFE] transition"
                            >
                                Retake Quiz
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ── Quiz question screen ───────────────────────────────────────────────────
    const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

    return (
        <div className="flex h-screen overflow-hidden">
            <StudentSidebar />

            <div className="flex-1 flex flex-col bg-[#EFF6FF] overflow-y-auto">
                {/* ── Top Bar ── */}
                <div className="sticky top-0 z-10 bg-white border-b border-blue-100 px-6 py-3 flex items-center justify-between shadow-sm">
                    <button
                        onClick={() => navigate("/student/quizzes")}
                        className="p-2 rounded-lg hover:bg-[#DBEAFE] text-[#1E40AF] transition"
                    >
                        <ArrowLeft size={20} />
                    </button>

                    <div className="text-center">
                        <p className="text-xs text-[#64748B] font-medium uppercase tracking-wider">
                            Question
                        </p>
                        <p className="text-xl font-bold text-[#1E293B]">
                            {currentQuestionIndex + 1}
                            <span className="text-[#94A3B8] text-sm font-normal">
                                {" "}/ {quiz.questions.length}
                            </span>
                        </p>
                    </div>

                    <TimerRing timeLeft={timeLeft} total={quiz.perQuestionTime || 30} />
                </div>

                {/* ── Progress Bar ── */}
                <div className="h-1.5 bg-[#DBEAFE]">
                    <div
                        className="h-full bg-[#2563EB] transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* ── Content ── */}
                <div className="flex-1 flex items-start justify-center p-6">
                    <div className="w-full max-w-2xl">
                        {/* Question */}
                        <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-8 mb-5">
                            <p className="text-xs font-semibold text-[#2563EB] uppercase tracking-widest mb-3">
                                Question {currentQuestionIndex + 1}
                            </p>
                            <h2 className="text-xl font-semibold text-[#1E293B] leading-snug">
                                {currentQuestion.question}
                            </h2>
                        </div>

                        {/* Options */}
                        <div className="space-y-3 mb-5">
                            {currentQuestion.options.map((option, idx) => {
                                const isSelected = selectedOption === idx;
                                const isCorrect = idx === currentQuestion.correctIndex;

                                let cls =
                                    "bg-white border-blue-100 text-[#1E293B] hover:border-[#2563EB] hover:bg-[#EFF6FF] cursor-pointer";

                                if (isAnswered) {
                                    if (isCorrect)
                                        cls =
                                            "bg-green-50 border-green-400 text-green-800 cursor-default";
                                    else if (isSelected)
                                        cls =
                                            "bg-red-50 border-red-400 text-red-700 cursor-default";
                                    else
                                        cls =
                                            "bg-white border-blue-50 text-[#94A3B8] opacity-60 cursor-default";
                                } else if (isSelected) {
                                    cls =
                                        "bg-[#EFF6FF] border-[#2563EB] text-[#1E293B] cursor-pointer";
                                }

                                return (
                                    <button
                                        key={idx}
                                        onClick={() => handleOptionSelect(idx)}
                                        disabled={isAnswered}
                                        className={`w-full p-4 border-2 rounded-xl text-left flex justify-between items-center transition-all duration-200 ${cls}`}
                                    >
                                        <span className="flex items-center gap-3 font-medium text-sm">
                                            <span className="w-7 h-7 flex-shrink-0 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold">
                                                {String.fromCharCode(65 + idx)}
                                            </span>
                                            {option}
                                        </span>
                                        {isAnswered && isCorrect && (
                                            <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                                        )}
                                        {isAnswered && isSelected && !isCorrect && (
                                            <XCircle size={18} className="text-red-500 flex-shrink-0" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Action Button */}
                        <div className="flex justify-end">
                            {!isAnswered ? (
                                <button
                                    onClick={handleSubmitAnswer}
                                    disabled={selectedOption === null}
                                    className={`px-8 py-3 rounded-xl font-bold text-sm transition-colors ${selectedOption !== null
                                            ? "bg-[#2563EB] text-white hover:bg-[#1D4ED8] shadow-md shadow-blue-200"
                                            : "bg-[#DBEAFE] text-[#93C5FD] cursor-not-allowed"
                                        }`}
                                >
                                    Submit Answer
                                </button>
                            ) : (
                                <button
                                    onClick={handleNextQuestion}
                                    className="px-8 py-3 bg-[#1E40AF] text-white rounded-xl font-bold text-sm hover:bg-[#1E3A8A] transition-colors shadow-md shadow-blue-300 flex items-center gap-2"
                                >
                                    {currentQuestionIndex + 1 === quiz.questions.length
                                        ? "Finish Quiz 🏁"
                                        : "Next Question →"}
                                </button>
                            )}
                        </div>

                        {/* Explanation */}
                        {isAnswered && currentQuestion.explanation && (
                            <div className="mt-5 p-4 bg-[#EFF6FF] rounded-xl border border-blue-200">
                                <div className="flex items-start gap-3">
                                    <AlertCircle size={18} className="text-[#2563EB] shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-[#1E40AF] text-sm mb-0.5">
                                            Explanation
                                        </p>
                                        <p className="text-[#374151] text-sm leading-relaxed">
                                            {currentQuestion.explanation}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizInterface;
