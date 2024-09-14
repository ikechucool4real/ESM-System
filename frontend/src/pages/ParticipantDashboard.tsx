import React, { useEffect, useState } from "react";
import ParticipantNavBar from "../components/ParticipantNavBar";
import axios from "axios";
import { useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";

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
  study: Study; // Ensure Task includes related Study details
}

interface User {
  id: number;
  email: string;
  code: string;
  study: number;
}

const ParticipantDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const location = useLocation();
  const user = location.state?.user as User;

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get<Task[]>(
          "http://127.0.0.1:8000/app/participanttasks/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setTasks(response.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch tasks");
      }
    };
    fetchTasks();
  }, []);

  const renderTasks = (status: string) => {
    return tasks
      .filter((task) => task.study.code === user.code)
      .filter((task) => task.study.status === status)
      .map((task) => (
        <div key={task.id}>
          <table>
            <tbody>
              <tr>
                <td>Title:</td>
                <td>
                  {status === "Current" ? (
                    <Link
                      to={"/ParticipantResponses"}
                      state={{ user, study: task.study, task }}
                    >
                      {task.title}
                    </Link>
                  ) : (
                    task.title
                  )}
                </td>
              </tr>
              <tr>
                <td>Study:</td>
                <td>{task.study.title}</td>
              </tr>
              <tr>
                <td>About:</td>
                <td>{task.study.about}</td>
              </tr>
              <tr>
                <td>Contact Email:</td>
                <td>{task.study.email}</td>
              </tr>
            </tbody>
          </table>
          <p></p>
        </div>
      ));
  };

  return (
    <div className="loggedin">
      <ParticipantNavBar />
      <div className="content">
        <h1>Study</h1>

        <h2>Not yet Started</h2>
        <div>{renderTasks("Pending")}</div>

        <h2>Started</h2>
        <div>{renderTasks("Current")}</div>

        <h2>Finished</h2>
        <div>{renderTasks("Completed")}</div>
      </div>
    </div>
  );
};

export default ParticipantDashboard;
