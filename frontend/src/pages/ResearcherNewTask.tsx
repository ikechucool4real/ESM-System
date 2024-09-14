import React, { FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ResearcherNavBar from "../components/ResearcherNavBar";
import { HStack } from "@chakra-ui/react";

interface Task {
  title: string;
  type: string;
  delivery_time: string;
  start_date: string;
  end_date: string;
  study: number;
}

const ResearcherNewTask: React.FC = () => {
  const location = useLocation();
  const { user, study } = location.state;

  const [task, setTask] = useState<Task>({
    title: "",
    type: "Interval-Contingent (daily)",
    delivery_time: "",
    start_date: "",
    end_date: "",
    study: study.id,
  });

  const navigate = useNavigate();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const formattedTask = {
      ...task,
      delivery_time: task.delivery_time,
      start_date: task.start_date,
      end_date: task.end_date,
    };

    axios
      .post("http://127.0.0.1:8000/app/tasks/", formattedTask)
      .then((res) => {
        setTask({
          title: "",
          type: "Interval-Contingent (daily)",
          delivery_time: "",
          start_date: "",
          end_date: "",
          study: study.id,
        });
        toast.success("task created successfully!");
        navigate("/ResearcherQuestions", {
          state: { user, study, task: res.data },
        });
      })
      .catch((err) => {
        if (axios.isAxiosError(err)) {
          if (err.response && err.response.data) {
            toast.error(
              `Error: ${err.response.data.detail || err.response.data.message}`
            );
          } else {
            toast.error("An error occurred. Please try again.");
          }
        } else {
          toast.error("An unknown error occurred. Please try again.");
        }
      });
  };

  return (
    <div className="loggedin">
      <ToastContainer />
      <ResearcherNavBar />
      <div className="content">
        <h2>Task</h2>
        <div>
          <table>
            <tbody>
              <tr>
                <td>Study :</td>
                <td>{study.title}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <form onSubmit={handleSubmit} autoComplete="off">
            <HStack>
              <h3>Title</h3>
              <input
                type="text"
                name="taskname"
                id="name"
                value={task.title}
                onChange={(e) => setTask({ ...task, title: e.target.value })}
                required
              />
            </HStack>
            <p></p>
            <HStack>
              <h3>Type</h3>
              <select
                name="type"
                id="type"
                value={task.type}
                onChange={(e) => setTask({ ...task, type: e.target.value })}
                required
              >
                <option value="Interval-Contingent (daily)">
                  Interval-Contingent (daily)
                </option>
              </select>
            </HStack>
            <p></p>
            <HStack>
              <h3>Delivery Time</h3>
              <input
                type="time"
                name="deliveryTime"
                id="deliveryTime"
                value={task.delivery_time}
                placeholder="HH:MM"
                onChange={(e) =>
                  setTask({ ...task, delivery_time: e.target.value })
                }
                required
              />
            </HStack>
            <p></p>
            <HStack>
              <h3>Start Date</h3>
              <input
                type="date"
                name="startDate"
                id="startDate"
                value={task.start_date}
                placeholder="DD/MM/YYYY"
                onChange={(e) =>
                  setTask({ ...task, start_date: e.target.value })
                }
                required
              />
            </HStack>
            <p></p>
            <HStack>
              <h3>End Date</h3>
              <input
                type="date"
                name="endDate"
                id="endDate"
                value={task.end_date}
                placeholder="DD/MM/YYYY"
                onChange={(e) => setTask({ ...task, end_date: e.target.value })}
                required
              />
            </HStack>
            <p></p>
            <input type="submit" value="Submit" id="rounded-submit" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResearcherNewTask;
