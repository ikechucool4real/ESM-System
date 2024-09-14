import React, { useEffect, useState } from "react";
import ParticipantNavBar from "../components/ParticipantNavBar";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { HStack } from "@chakra-ui/react";

interface Question {
  id: number;
  text: string;
  task: number;
}

const ParticipantResponses: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [replies, setReplies] = useState<{ [key: number]: string }>({});
  const navigate = useNavigate();

  const location = useLocation();
  const { user, study, task } = location.state;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get<Question[]>(
          "http://127.0.0.1:8000/app/questions/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setQuestions(
          response.data.filter((question) => question.task === task.id)
        );
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch questions");
      }
    };
    fetchQuestions();
  }, [task.id]);

  const handleInputChange = (questionId: number, answer: string) => {
    setReplies((prevReplies) => ({
      ...prevReplies,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await Promise.all(
        Object.entries(replies).map(([questionId, answer]) => {
          const reply = {
            answer,
            participant: user.id,
            question: parseInt(questionId),
          };
          return axios.post("http://127.0.0.1:8000/app/replies/", reply, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
        })
      );
      toast.success("Answers submitted successfully!");
      navigate("/ParticipantMessage", { state: { user, study, task } });
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit answers");
    }
  };

  const renderQuestions = () => {
    return questions.map((question) => (
      <div key={question.id}>
        <HStack>
          <h3>Question</h3>
          <input type="text" value={question.text} readOnly />
        </HStack>
        <p></p>
        <HStack>
          <h3>Answer</h3>
          <input
            type="text"
            id="reply"
            value={replies[question.id] || ""}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            required
          />
        </HStack>
        <p></p>
      </div>
    ));
  };

  return (
    <div className="loggedin">
      <ParticipantNavBar />
      <div className="content">
        <h2>Task</h2>
        <div>
          <form onSubmit={handleSubmit} autoComplete="off">
            {renderQuestions()}
            <input type="submit" value="Submit" id="rounded-submit" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ParticipantResponses;
