import React from "react";
import ParticipantNavBar from "../components/ParticipantNavBar";
import { useLocation, useNavigate } from "react-router-dom";

const ParticipantMessage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, study, task } = location.state;

  const homepage = () => {
    navigate("/ParticipantDashboard", { state: { user, study, task } });
  };

  return (
    <div className="loggedin">
      <ParticipantNavBar />
      <div className="content">
        <h2>Task</h2>
        <h4>
          You have completed your task.
          <br />
          You do not need to do it again today.
        </h4>
        <button type="button" className="rounded-add" onClick={homepage}>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default ParticipantMessage;
