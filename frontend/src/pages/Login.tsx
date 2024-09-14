import React, { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../static/style.css";
import "@fortawesome/fontawesome-free/css/all.css";

interface Researcher {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [user, setUser] = useState<Researcher>({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    axios
      .post("http://127.0.0.1:8000/app/login/", user)
      .then((res) => {
        setUser({ email: "", password: "" });
        toast.success("Logged in Successfully!");
        navigate("/ResearcherDashboard", { state: { user: res.data.user } });
      })
      .catch((err) => {
        if (axios.isAxiosError(err)) {
          if (err.response && err.response.data) {
            toast.error(
              `Error: ${err.response.data.detail || err.response.data.message}`
            );
          } else {
            toast.error("Invalid email or password");
          }
        } else {
          toast.error("An unknown error occurred. Please try again.");
        }
      });
  };

  return (
    <div className="loginbody">
      <ToastContainer />
      <div className="header">
        <h1>Xperience</h1>
      </div>
      <div className="description">
        <p>
          Welcome to Xperience, the innovative application designed to
          revolutionize the way researchers gather and analyze data. Xperience
          harnesses the power of the Experience Sampling Method (ESM), a
          renowned research technique that captures participants' behaviors,
          emotions, and experiences as they occur in their natural environments.
        </p>
      </div>
      <div className="login">
        <h1>Researcher</h1>
        <div className="links">
          <Link to="/register"> Register </Link>
          <Link to="/login" className="active">
            {" "}
            Login{" "}
          </Link>
        </div>
        <form onSubmit={handleSubmit} autoComplete="off">
          <label htmlFor="email">
            <i className="fas fa-envelope"></i>
          </label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            id="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            required
          />
          <label htmlFor="password">
            <i className="fas fa-lock"></i>
          </label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            id="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            required
          />
          <input type="submit" value="Login" />
        </form>
      </div>
    </div>
  );
};

export default Login;
