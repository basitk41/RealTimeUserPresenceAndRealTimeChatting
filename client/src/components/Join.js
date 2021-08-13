import React, { useState } from "react";
import { Link } from "react-router-dom";
const Join = () => {
  const [name, setName] = useState("");
  return (
    <div className="row">
      <div className="col-sm-4"></div>
      <div className="col-sm-4">
        <h1 align="center">Join</h1>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            className="form-control"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <br />
        <div className="form-group">
          <Link
            onClick={(e) => (!name ? e.preventDefault() : null)}
            to={`/chat?name=${name}`}
          >
            <button className="btn btn-info">Sign in</button>
          </Link>
        </div>
      </div>
      <div className="col-sm-4"></div>
    </div>
  );
};
export default Join;
