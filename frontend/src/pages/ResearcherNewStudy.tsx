import React, { FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ResearcherNavBar from "../components/ResearcherNavBar";
import { HStack } from "@chakra-ui/react";

interface Study {
  title: string;
  about: string;
  status: string;
  email: number;
}

const ResearcherNewStudy: React.FC = () => {
  const location = useLocation();
  const { user } = location.state;

  const [study, setStudy] = useState<Study>({
    title: "",
    about: "",
    status: "Pending",
    email: user.id,
  });

  const navigate = useNavigate();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    axios
      .post("http://127.0.0.1:8000/app/newstudies/", study)
      .then((res) => {
        setStudy({
          title: "",
          about: "",
          status: "Pending",
          email: user.id,
        });
        toast.success("Study created successfully!");
        navigate("/ResearcherStudyDetail", {
          state: { user, study: res.data },
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
        <h2>Study </h2>
        <div>
          <form onSubmit={handleSubmit} autoComplete="off">
            <HStack>
              <h3>Title</h3>
              <input
                type="text"
                name="name"
                id="name"
                value={study.title}
                onChange={(e) => setStudy({ ...study, title: e.target.value })}
                required
              />
            </HStack>
            <p></p>
            <HStack>
              <h3>About</h3>
              <textarea
                name="about"
                id="about"
                value={study.about}
                onChange={(e) => setStudy({ ...study, about: e.target.value })}
                required
              />
            </HStack>
            <input type="submit" value="Submit" id="rounded-submit" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResearcherNewStudy;
