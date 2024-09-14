import React, { useEffect, useState } from "react";
import ResearcherNavBar from "../components/ResearcherNavBar";
import { HStack } from "@chakra-ui/react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface getQuestion {
  id: number;
  text: string;
  task: number;
}

interface postQuestion {
  text: string;
  task: number;
}

const ResearcherQuestions: React.FC = () => {
  const [questions, setQuestions] = useState<getQuestion[]>([]);
  const [newQuestions, setNewQuestions] = useState<postQuestion[]>([]);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const { user, study, task } = location.state;

  const [data, setData] = useState<postQuestion>({
    text: "",
    task: task.id,
  });

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get<getQuestion[]>(
          "http://127.0.0.1:8000/app/questions/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setQuestions(response.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch Questions");
      }
    };
    fetchQuestions();
  }, [task.id]);

  const createNewQuestion = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/app/questions/",
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Question created successfully!");
      setNewQuestions([...newQuestions, response.data]);
      setData({ ...data, text: "" }); // Clear the input field after adding
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create Question");
      setLoading(false);
    }
  };

  const renderQuestions = () => {
    return (
      <>
        {questions
          .filter((question) => question.task === task.id)
          .map((question) => (
            <HStack key={question.id}>
              <h3>Question</h3>
              <textarea
                name="question"
                id="question"
                value={question.text}
                readOnly
              />
            </HStack>
          ))}
        {newQuestions.map((question, index) => (
          <>
            <HStack key={`new-${index}`}>
              <h3>Question</h3>
              <input
                type="text"
                name="question"
                id="question"
                value={question.text}
                readOnly
              />
            </HStack>
            <p></p>
          </>
        ))}
      </>
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (data.text.trim()) {
      await createNewQuestion();
    }
    navigate("/ResearcherStudyDetail", { state: { user, study, task } });
  };

  return (
    <div className="loggedin">
      <ResearcherNavBar />
      <div className="content">
        <h2>Data</h2>
        <div>
          <table>
            <tbody>
              <tr>
                <td>Task :</td>
                <td>{task.title}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <form onSubmit={handleSubmit} autoComplete="off">
            <div>
              {renderQuestions()}
              <HStack>
                <h3>New Question</h3>
                <input
                  type="text"
                  name="question"
                  id="newquestion"
                  value={data.text}
                  onChange={(e) => setData({ ...data, text: e.target.value })}
                  required
                />
              </HStack>
              <button
                type="button"
                className="rounded-add"
                onClick={createNewQuestion}
                disabled={loading}
              >
                Add
              </button>
              <p></p>
            </div>
            <input
              type="submit"
              value="Submit"
              id="rounded-submit"
              disabled={loading}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResearcherQuestions;
