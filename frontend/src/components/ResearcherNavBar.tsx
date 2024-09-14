import React from "react";
import { Link } from "react-router-dom";

const ResearcherNavBar: React.FC = () => {
  return (
    <div className="loggedin">
      <nav className="navtop">
        <h1 className="navheader">Xperience</h1>
        <div className="nav-links">
          <Link to="/">
            <i className="fa fa-sign-out"></i>Logout
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default ResearcherNavBar;
