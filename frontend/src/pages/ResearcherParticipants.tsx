import React, { useEffect, useState } from "react";
import ResearcherNavBar from "../components/ResearcherNavBar";
import { HStack } from "@chakra-ui/react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface getParticipant {
  id: number;
  email: string;
  code: string;
  study: number;
}

interface postParticipant {
  email: string;
  code: string;
  study: number;
}

const ResearcherParticipants: React.FC = () => {
  const [participants, setParticipants] = useState<getParticipant[]>([]);
  const [newParticipants, setNewParticipants] = useState<postParticipant[]>([]);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const { user, study } = location.state;

  const [guest, setGuest] = useState<postParticipant>({
    email: "",
    code: study.code,
    study: study.id,
  });

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await axios.get<getParticipant[]>(
          "http://127.0.0.1:8000/app/participants/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setParticipants(response.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch Participants");
      }
    };
    fetchParticipants();
  }, [study.id]);

  const createNewParticipant = async () => {
    if (guest.email.trim()) {
      try {
        setLoading(true);
        const response = await axios.post(
          "http://127.0.0.1:8000/app/participants/",
          guest,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        toast.success("Participant added successfully!");
        setNewParticipants([...newParticipants, response.data]);
        setGuest({ ...guest, email: "" }); // Clear the input field after adding
        setLoading(false);
      } catch (err) {
        console.error(err);
        toast.error("Failed to add Participant");
        setLoading(false);
      }
    }
  };

  const renderParticipants = () => {
    return (
      <>
        {participants
          .filter((participant) => participant.study === study.id)
          .map((participant) => (
            <HStack key={participant.id}>
              <h3>Email Address</h3>
              <input
                type="text"
                name="email"
                id="email"
                value={participant.email}
                readOnly
              />
            </HStack>
          ))}
        {newParticipants.map((participant, index) => (
          <HStack key={`new-${index}`}>
            <h3>Email Address</h3>
            <input
              type="text"
              name="email"
              id="newemail1"
              value={participant.email}
              readOnly
            />
          </HStack>
        ))}
      </>
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (guest.email.trim()) {
      await createNewParticipant();
    }
    navigate("/ResearcherStudyDetail", { state: { user, study } });
  };

  return (
    <div className="loggedin">
      <ResearcherNavBar />
      <div className="content">
        <h2>Participants</h2>
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
            <div>
              {renderParticipants()}
              <HStack>
                <h3>New Email Address</h3>
                <input
                  type="text"
                  name="email"
                  id="newemail"
                  value={guest.email}
                  onChange={(e) =>
                    setGuest({ ...guest, email: e.target.value })
                  }
                  required
                />
              </HStack>
              <button
                type="button"
                className="rounded-add"
                onClick={createNewParticipant}
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

export default ResearcherParticipants;
