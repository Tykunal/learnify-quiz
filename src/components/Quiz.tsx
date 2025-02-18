// 'use client';

// import React, { useEffect, useState } from "react";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Question from "@/components/Question";
// import { useRouter } from 'next/navigation';

// type QuestionType = {
//   _id: string;
//   question: string;
//   options: string[];
//   correctAnswerIndex: number;
// };

// const Quiz: React.FC = () => {
//   const [quizData, setQuizData] = useState<QuestionType[]>([]);
//   const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: number | null }>({});
//   const [score, setScore] = useState<number | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [submitted, setSubmitted] = useState(false); // Track quiz submission status

//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(0);
//   const questionsPerPage = 10;

//   // Initialize the router
//   const router = useRouter();

//   useEffect(() => {
//     const fetchQuestions = async () => {
//       try {
//         const res = await fetch("/api/quiz");
//         if (!res.ok) throw new Error(`Failed to fetch questions: ${res.status}`);

//         let data   = await res.json();

//         // Shuffle questions before setting them
//         data = shuffleArray(data);

//         // Shuffle options for each question
//         data = data.map((question) => {
//           const shuffledOptions = shuffleArray(question.options);
//           return {
//             ...question,
//             options: shuffledOptions,
//             correctAnswerIndex: shuffledOptions.indexOf(question.options[question.correctAnswerIndex]),
//           };
//         });

//         setQuizData(data);
//         setSelectedAnswers(
//           data.reduce((acc: { [key: string]: number | null }, question: QuestionType) => {
//             acc[question._id] = null;
//             return acc;
//           }, {})
//         );
//       } catch (err) {
//         console.error(err);
//         setError("Error loading quiz data. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchQuestions();
//   }, []);

//   const shuffleArray = (array: QuestionType[]) => {
//     const shuffled = [...array];
//     for (let i = shuffled.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
//     }
//     return shuffled;
//   };

//   const handleAnswerChange = (questionId: string, answerIndex: number) => {
//     setSelectedAnswers((prev) => ({
//       ...prev,
//       [questionId]: answerIndex,
//     }));
//   };

//   const handleSubmit = async () => {
//     let totalScore = 0;

//     // Calculate score based on selected answers
//     quizData.forEach((question) => {
//       if (selectedAnswers[question._id] === question.correctAnswerIndex) {
//         totalScore += 1;
//       }
//     });

//     setScore(totalScore);

//     const email = localStorage.getItem('userEmail');
//     if (!email) {
//       toast.error('Please login to submit the quiz.');
//       return;
//     }

//     try {
//       const response = await fetch('/api/quiz/saveScore', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, score: totalScore }),
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to save score: ${response.statusText}`);
//       }

//       const result = await response.json();

//       toast.success('Your score has been saved!', {
//         position: 'top-right',
//         autoClose: 3000,
//       });

//       setSubmitted(true); // Mark quiz as submitted

//       // Redirect to the home page after 3 seconds (when toast disappears)
//       setTimeout(() => {
//         router.push('/');
//       }, 3000);

//     } catch (error) {
//       console.error('Error:', error);
//       toast.error('An error occurred while saving your score.');
//     }
//   };

//   const startIndex = currentPage * questionsPerPage;
//   const endIndex = startIndex + questionsPerPage;
//   const currentQuestions = quizData.slice(startIndex, endIndex);

//   const nextPage = () => {
//     if (endIndex < quizData.length) {
//       setCurrentPage(currentPage + 1);
//       window.scrollTo(0, 0); // Scroll to the top of the page
//     }
//   };

//   const prevPage = () => {
//     if (currentPage > 0) {
//       setCurrentPage(currentPage - 1);
//       window.scrollTo(0, 0); // Scroll to the top of the page
//     }
//   };

//   if (loading) return <p className="text-center text-gray-500">Loading questions...</p>;
//   if (error) return <p className="text-center text-red-500">{error}</p>;

//   return (
//     <div className="bg-gradient-to-br from-indigo-500 to-purple-500 min-h-screen flex justify-center items-center px-4 py-10">
//       <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl min-h-[700px] flex flex-col justify-between">
//         <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Quiz</h1>

//         <div className="flex-grow grid grid-cols-1 gap-4">
//           {currentQuestions.map((question) => (
//             <Question
//               key={question._id}
//               question={question}
//               selectedAnswer={selectedAnswers[question._id] ?? null}
//               onAnswerChange={handleAnswerChange}
//             />
//           ))}
//         </div>

//         {/* Pagination Controls */}
//         <div className="flex justify-between mt-6">
//           <button
//             onClick={prevPage}
//             disabled={currentPage === 0}
//             className={`px-4 py-2 rounded-lg font-bold transition ${currentPage === 0 ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
//           >
//             Previous
//           </button>

//           <button
//             onClick={nextPage}
//             disabled={endIndex >= quizData.length}
//             className={`px-4 py-2 rounded-lg font-bold transition ${endIndex >= quizData.length ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
//           >
//             Next
//           </button>
//         </div>

//         <button
//           onClick={handleSubmit}
//           className="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition"
//         >
//           Submit Quiz
//         </button>

//         {/* Display Score */}
//         {score !== null && (
//           <div className="mt-6 text-center">
//             <p className="text-xl font-semibold text-gray-800">
//               Your Score: {score} / {quizData.length}
//             </p>
//           </div>
//         )}
//       </div>
//       <ToastContainer />
//     </div>
//   );
// };

// export default Quiz;


'use client';

import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Question from "@/components/Question";
import { useRouter } from 'next/navigation';

type QuestionType = {
  _id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
};

const Quiz: React.FC = () => {
  const [quizData, setQuizData] = useState<QuestionType[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: number | null }>({});
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false); // Track quiz submission status

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const questionsPerPage = 10;

  // Initialize the router
  const router = useRouter();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch("/api/quiz");
        if (!res.ok) throw new Error(`Failed to fetch questions: ${res.status}`);

        let data = await res.json();

        // Shuffle questions and options
        data = shuffleArray(data).map((question: QuestionType) => {
          const shuffledOptions = shuffleArray(question.options);
          return {
            ...question,
            options: shuffledOptions,
            correctAnswerIndex: shuffledOptions.indexOf(question.options[question.correctAnswerIndex]),
          };
        });

        setQuizData(data);
        setSelectedAnswers(
          data.reduce((acc: { [key: string]: number | null }, question: QuestionType) => {
            acc[question._id] = null;
            return acc;
          }, {})
        );
      } catch (err) {
        console.error(err);
        setError("Error loading quiz data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const shuffleArray = (array: string[]): string[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };
  
  
  

  // const shuffleArray = (array: any[]) => {
  //   const shuffled = [...array];
  //   for (let i = shuffled.length - 1; i > 0; i--) {
  //     const j = Math.floor(Math.random() * (i + 1));
  //     [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  //   }
  //   return shuffled;
  // };

  const handleAnswerChange = (questionId: string, answerIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };

  const handleSubmit = async () => {
    let totalScore = 0;

    // Calculate score based on selected answers
    quizData.forEach((question) => {
      if (selectedAnswers[question._id] === question.correctAnswerIndex) {
        totalScore += 1;
      }
    });

    setScore(totalScore);
    setSubmitted(true); // Mark quiz as submitted

    const email = localStorage.getItem('userEmail');
    if (!email) {
      toast.error('Please login to submit the quiz.');
      return;
    }

    try {
      const response = await fetch('/api/quiz/saveScore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, score: totalScore }),
      });

      if (!response.ok) {
        throw new Error(`Failed to save score: ${response.statusText}`);
      }

      toast.success('Your score has been saved!', { position: 'top-right', autoClose: 3000 });

      // Redirect to the home page after 3 seconds
      setTimeout(() => {
        router.push('/');
      }, 3000);

    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while saving your score.');
    }
  };

  const startIndex = currentPage * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const currentQuestions = quizData.slice(startIndex, endIndex);

  const nextPage = () => {
    if (endIndex < quizData.length) {
      setCurrentPage(currentPage + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      window.scrollTo(0, 0);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading questions...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="bg-gradient-to-br from-indigo-500 to-purple-500 min-h-screen flex justify-center items-center px-4 py-10">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl min-h-[700px] flex flex-col justify-between">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Quiz</h1>

        <div className="flex-grow grid grid-cols-1 gap-4">
          {currentQuestions.map((question) => (
            <Question
              key={question._id}
              question={question}
              selectedAnswer={selectedAnswers[question._id] ?? null}
              onAnswerChange={handleAnswerChange}
            />
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between mt-6">
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className={`px-4 py-2 rounded-lg font-bold transition ${
              currentPage === 0 ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Previous
          </button>

          <button
            onClick={nextPage}
            disabled={endIndex >= quizData.length}
            className={`px-4 py-2 rounded-lg font-bold transition ${
              endIndex >= quizData.length ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Next
          </button>
        </div>

        {/* Submit Button (Disabled after submission) */}
        <button
          onClick={handleSubmit}
          disabled={submitted}
          className={`mt-6 w-full font-bold py-3 px-4 rounded-lg transition ${
            submitted ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700 text-white"
          }`}
        >
          {submitted ? "Quiz Submitted" : "Submit Quiz"}
        </button>

        {/* Display Score */}
        {score !== null && (
          <div className="mt-6 text-center">
            <p className="text-xl font-semibold text-gray-800">
              Your Score: {score} / {quizData.length}
            </p>
          </div>
        )}

        {/* Show Success Message After Submission */}
        {submitted && (
          <p className="mt-4 text-center text-green-600 font-bold">
            Your quiz has been submitted successfully!
          </p>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Quiz;
