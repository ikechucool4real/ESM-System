import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ResearcherNavBar from "../components/ResearcherNavBar";
import { HStack } from "@chakra-ui/react";

interface Study {
  id: number;
  title: string;
  about: string;
  status: string;
  code: string;
  email: string;
}

const EditStudy: React.FC = () => {
  const { studyId } = useParams<{ studyId: string }>();
  const [study, setStudy] = useState<Study | null>(null);
  const navigate = useNavigate();

  const location = useLocation();
  const { user } = location.state;

  useEffect(() => {
    const fetchStudy = async () => {
      try {
        const response = await axios.get<Study>(
          `http://127.0.0.1:8000/app/studies/${studyId}/`
        );
        setStudy(response.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch study data");
      }
    };

    fetchStudy();
  }, [studyId]);

  const handleSave = async () => {
    if (study) {
      try {
        await axios.put(`http://127.0.0.1:8000/app/studies/${studyId}/`, study);
        toast.success("Study updated successfully!");
        navigate("/ResearcherStudyDetail", { state: { user, study } });
      } catch (error) {
        console.error(error);
        toast.error(
          "An error occurred while updating the study. Please try again."
        );
      }
    }
  };

  if (!study) {
    return <div>Loading...</div>;
  }

  return (
    <div className="loggedin">
      <ToastContainer />
      <ResearcherNavBar />
      <div className="content">
        <h2>Edit Study</h2>
        <div>
          <form autoComplete="off">
            <HStack>
              <h3>Title</h3>
              <input
                type="text"
                name="title"
                id="title"
                value={study.title}
                onChange={(e) => setStudy({ ...study, title: e.target.value })}
              />
            </HStack>
            <p></p>
            <HStack>
              <h3>About</h3>
              <input
                type="text"
                name="about"
                id="about"
                value={study.about}
                onChange={(e) => setStudy({ ...study, about: e.target.value })}
              />
            </HStack>
            <p></p>
            <HStack>
              <h3>Status</h3>
              <select
                id="status"
                value={study.status}
                onChange={(e) => setStudy({ ...study, status: e.target.value })}
                required
              >
                <option value="Pending">Pending</option>
                <option value="Current">Current</option>
                <option value="Completed">Completed</option>
              </select>
            </HStack>
            <p></p>
            <button type="button" className="rounded-add" onClick={handleSave}>
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditStudy;
