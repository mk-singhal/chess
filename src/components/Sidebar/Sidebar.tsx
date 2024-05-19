import "./Sidebar.css";

import { ReactComponent as Globe } from "../../Images/globe.svg";
import { ReactComponent as Friend } from "../../Images/friend.svg";
import { ReactComponent as Brain } from "../../Images/brain.svg";
import { ReactComponent as About } from "../../Images/about.svg";
import { ReactComponent as Logo } from "../../Images/chess.svg";
import { ReactComponent as Theme } from "../../Images/theme.svg";
import { useState } from "react";

export default function Sidebar() {
  const [hamburgerOpen, setHamburgerOpen] = useState(false);

  function sidebarButton() {
    setHamburgerOpen(!hamburgerOpen);
  }

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <button onClick={sidebarButton}>
          <div id="hamburger" className={`${hamburgerOpen ? " open" : ""}`}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
        <a className="active" href="#home">
          <Logo />
          <span style={{ paddingLeft: "6px" }}>Shatranj</span>
        </a>
      </div>
      <div
        className={`sidebar-items${
          hamburgerOpen ? " sidebar-mobile" : " hidden"
        }`}
      >
        <a className="active" href="#home">
          <Globe />
          <span style={{ paddingLeft: "6px" }}>Play vs Online</span>
        </a>
        <a href="#news">
          <Friend />
          <span>Play vs Friend</span>
        </a>
        <a href="#contact">
          <Brain />
          <span style={{ paddingLeft: "6px" }}>Play vs AI</span>
        </a>
        <a href="#about">
          <About />
          {/* <img src="/assets/images/pawn_w.png" width={"30px"} /> */}
          <span style={{ paddingLeft: "6px" }}>About</span>
        </a>
      </div>
      <div className="sidebar-bottom">
        <a href="#home">
          <Theme />
          <span style={{ paddingLeft: "2px" }}>Theme</span>
        </a>
      </div>
    </div>
  );
}
