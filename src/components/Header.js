import React from "react";

const Header = (props) => (
  <header style={{marginBottom: 10}}>
    <div>
      <span className="header"> {props.title} </span>
    </div>

    <div className="subheader-body">
      <span className="subheader">
        {" "}
        Powered by{" "}
        <a
          className="link"
          rel="noopener noreferrer"
          target="_blank"
          href="https://cryptocompare.com"
        >
          CRYPTOCOMPARE
        </a>
        .{" "}
      </span>
    </div>
  </header>
);

export default Header;
