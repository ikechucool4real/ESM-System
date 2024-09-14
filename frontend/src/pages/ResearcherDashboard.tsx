import React, { useEffect, useState } from "react";
import ResearcherNavBar from "../components/ResearcherNavBar";
import axios from "axios";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

interface Study {
  id: number;
  title: string;
  about: string;
  status: string;
  code: string;
  email: string;
}

interface User {
  email: string;
  id: number;
}

const ResearcherDashboard: React.FC = () => {
  const [studies, setStudies] = useState<Study[]>([]);

  const location = useLocation();
  const navigate = useNavigate();

  const user = location.state?.user as User;

  useEffect(() => {
    const fetchStudies = async () => {
      try {
        const response = await axios.get<Study[]>(
          "http://127.0.0.1:8000/app/studies/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setStudies(response.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch studies");
      }
    };
    fetchStudies();
  }, []);

  const createNewStudy = () => {
    navigate("/ResearcherNewStudy", { state: { user } });
  };

  const renderStudies = (status: string) => {
    return studies
      .filter((study) => study.email === user.email)
      .filter((study) => study.status === status)
      .map((study) => (
        <>
          <table key={study.id}>
            <tbody>
              <tr>
                <td>Title:</td>
                <td>
                  <Link to={`/EditStudy/${study.id}`} state={{ user }}>
                    {study.title}
                  </Link>
                </td>
              </tr>
              <tr>
                <td>About:</td>
                <td>{study.about}</td>
              </tr>
              <tr>
                <td>Code:</td>
                <td>{study.code}</td>
              </tr>
              <tr>
                <td>Contact Email:</td>
                <td>{study.email}</td>
              </tr>
            </tbody>
          </table>
          <p></p>
        </>
      ));
  };

  return (
    <div className="loggedin">
      <ResearcherNavBar />
      <div className="content">
        <h1>Study</h1>
        <h4>
          When a study has been created, click on the link to change to CURRENT
          when it has started or to COMPLETED when it has ended.
          <br />
          This feature is not automatic.
        </h4>
        <button type="button" className="rounded-add" onClick={createNewStudy}>
          {" "}
          Create a New Study{" "}
        </button>
        <h2>Pending</h2>
        <div>{renderStudies("Pending")}</div>

        <h2>Current</h2>
        <div>{renderStudies("Current")}</div>

        <h2>Completed</h2>
        <div>{renderStudies("Completed")}</div>
      </div>
    </div>
  );
};

export default ResearcherDashboard;
