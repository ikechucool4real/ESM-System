import React, { useEffect, useState } from "react";
import ResearcherNavBar from "../components/ResearcherNavBar";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { HStack } from "@chakra-ui/react";

interface Study {
  id: number;
  title: string;
  about: string;
  status: string;
  code: string;
  email: string;
}

interface Task {
  id: number;
  title: string;
  type: string;
  delivery_time: string;
  start_date: string;
  end_date: string;
  study: number;
}

interface Participant {
  id: number;
  email: string;
  code: string;
  study: number;
}

interface Reply {
  id: number;
  participant: number;
  question: string;
  date: string;
  answer: string;
}

interface User {
  id: number;
  email: string;
}

const ResearcherStudyDetail: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [replies, setReplies] = useState<Reply[]>([]);

  const location = useLocation();
  const study = location.state?.study as Study;
  const user = location.state?.user as User;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get<Task[]>(
          "http://127.0.0.1:8000/app/tasks/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setTasks(response.data.filter((task) => task.study === study.id));
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch tasks");
      }
    };
    fetchTasks();
  }, [study.id]);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await axios.get<Participant[]>(
          "http://127.0.0.1:8000/app/participants/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setParticipants(
          response.data.filter((participant) => participant.study === study.id)
        );
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch participants");
      }
    };
    fetchParticipants();
  }, [study.id]);

  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const response = await axios.get<Reply[]>(
          "http://127.0.0.1:8000/app/getreplies/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setReplies(response.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch replies");
      }
    };
    fetchReplies();
  }, [study.id]);

  const downloadReplies = () => {
    const studyReplies = replies.filter((reply) =>
      participants.some((participant) => participant.id === reply.participant)
    );

    const csvData = studyReplies.map((reply) => ({
      Participant: reply.participant,
      Question: reply.question,
      Date: reply.date,
      Answer: reply.answer,
    }));

    const csvContent = [
      ["Participant", "Date", "Question", "Answer"],
      ...csvData.map((row) => [
        row.Participant,
        row.Date,
        row.Question,
        row.Answer,
      ]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "Study_Responses.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadParticipants = () => {
    const studyParticipants = participants.filter(
      (participant) => participant.study === study.id
    );

    const csvData = studyParticipants.map((participant) => ({
      id: participant.id,
      EmailAddress: participant.email,
    }));

    const csvContent = [
      ["id", "EmailAddress"],
      ...csvData.map((row) => [row.id, row.EmailAddress]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "Study_Participants.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const homepage = () => {
    navigate("/ResearcherDashboard", { state: { user, study } });
  };

  const handleNewTask = () => {
    navigate("/ResearcherNewTask", { state: { user, study } });
  };

  const handleNewParticipant = () => {
    navigate("/ResearcherParticipants", { state: { user, study } });
  };

  const renderTasks = () => {
    return tasks.map((task) => (
      <tr key={task.id}>
        <td>{task.title}</td>
        <td>{task.type}</td>
        <td>{task.delivery_time}</td>
        <td>{task.start_date}</td>
        <td>{task.end_date}</td>
      </tr>
    ));
  };

  const renderParticipants = () => {
    return participants.map((participant) => (
      <tr key={participant.id}>
        <td>{participant.id}</td>
        <td>{participant.email}</td>
      </tr>
    ));
  };

  return (
    <div className="loggedin">
      <ResearcherNavBar />
      <div className="content">
        <h2>Study Details</h2>
        <div>
          <table>
            <tbody>
              <tr>
                <td>Title :</td>
                <td>{study.title}</td>
              </tr>
              <tr>
                <td>About : </td>
                <td>{study.about}</td>
              </tr>
              <tr>
                <td>Code : </td>
                <td>{study.code}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <button type="button" className="rounded-add" onClick={homepage}>
          Back to Home
        </button>
        <h2>Tasks</h2>
        <div>
          <table className="equal-spacing-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Delivery Time</th>
                <th>Start Date</th>
                <th>End Date</th>
              </tr>
            </thead>
            <tbody>{renderTasks()}</tbody>
          </table>
          <button type="button" className="rounded-add" onClick={handleNewTask}>
            New
          </button>
        </div>
        <h2>Participants</h2>
        <div>
          <table className="equal-spacing-table">
            <thead>
              <tr>
                <th>ID </th>
                <th>Email Address</th>
              </tr>
            </thead>
            <tbody>{renderParticipants()}</tbody>
          </table>
          <HStack>
            <button
              type="button"
              className="rounded-add"
              onClick={handleNewParticipant}
            >
              New
            </button>
            <button
              type="button"
              className="rounded-add"
              onClick={downloadParticipants}
            >
              Download Participants
            </button>
          </HStack>
        </div>
        <button type="button" className="rounded-add" onClick={downloadReplies}>
          Download Responses
        </button>
      </div>
    </div>
  );
};

export default ResearcherStudyDetail;
