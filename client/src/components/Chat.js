import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import { Link } from "react-router-dom";
import axios from "axios";
import { Offline, Online } from "react-detect-offline";
import ScrollToBottom from "react-scroll-to-bottom";
import { css } from "@emotion/css";
let socket;
const Chat = ({ location }) => {
  const ENDPOINT = "http://localhost:5000";
  const [username, setName] = useState("");
  const [users, setUsers] = useState([]);
  const [msg, setMsg] = useState("");
  const [msgs, setMsgs] = useState([]);
  //   const [focus, setFocus] = useState(null);
  useEffect(() => {
    socket = io(ENDPOINT);
    const { name } = queryString.parse(location.search);
    setName(name);
    socket.emit("join", { name }, () => {});
    console.log(socket);
    socket.on("response", (users) => {
      console.log("users update");
      setUsers(users);
    });
    // const cleanup = () => {
    //   socket.emit("offline", { name });
    //   socket.off();
    // };
    // window.addEventListener("beforeunload", function (e) {
    //   socket.emit("offline", { name });
    //   socket.off();
    // });
    window.onbeforeunload = () => {
      socket.emit("offline", { name });
      socket.off();
    };
    // document.addEventListener("visibilitychange", function () {
    //   if (document.visibilityState === "hidden") {
    //     socket.emit("offline", { name });
    //     socket.off();
    //   }
    // });
    //////////////////
    // const root = document.getElementById("root");
    // root.onmouseleave = () => {
    //   if (focus) setFocus(false);
    // };
    // root.onmouseover = () => {
    //   if (!focus) setFocus(true);
    // };
    // if (!focus) {
    //   socket.emit("offline", { name });
    //   //   socket.off();
    // } else {
    //   socket.emit("join", { name }, () => {});
    // }
    return () => {
      socket.emit("offline", { name });
      socket.off();
    };
  }, [ENDPOINT, location.search]);
  //   console.log(focus);
  //   function call1(){
  //     setTimeout(() => {
  //       if (document.visibilityState) {
  //         console.log("blur");
  //         call1();
  //     }
  // }, 2000);
  // };
  // getting users and msgs
  useEffect(() => {
    axios.get("http://localhost:5000/api/data").then((res) => {
      setUsers(res.data.users);
      setMsgs(res.data.msgs);
    });
  }, []);
  const style = {
    fontSize: "10px",
  };
  // style
  const messageCSS = css({
    border: "1px solid pink",
    borderRadius: "10px",
    height: "170px",
    padding: "10px",
    marginBottom: "0px",
  });
  // sending msg
  const sendMsg = () => {
    socket.emit("msg", { msg, username }, () => {});
    const data = [...msgs];
    data.push({ msg, username });
    setMsgs(data);
    setMsg("");
  };
  useEffect(() => {
    socket.on("sendmsg", (msgs) => {
      console.log(msgs);
      setMsgs(msgs);
    });
  });
  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-5">
          <h3>
            {username} <span style={style}>(You)</span>{" "}
            <span style={style} className="text text-success">
              Online
            </span>
          </h3>
          <hr></hr>
          <ScrollToBottom mode={"bottom"} className={messageCSS}>
            <p></p>
            {/* <p style={{ display: "flex" }}>
              <p
                style={{
                  backgroundColor: "#F9E79F",
                  padding: "10px",
                  borderRadius: "20px",
                }}
              >
                <span>Name</span>
                <span>Hi</span>
              </p>
            </p> */}
            {msgs.map((msg, i) => {
              return msg.username === username ? (
                <p key={i} style={{ textAlign: "right" }}>
                  <span
                    style={{
                      backgroundColor: "#85C1E9",
                      padding: "10px",
                      borderRadius: "20px",
                    }}
                  >
                    <span>{msg.msg}</span>
                  </span>
                </p>
              ) : (
                <p key={i}>
                  <span
                    style={{
                      backgroundColor: "#F9E79F",
                      padding: "10px",
                      borderRadius: "20px",
                    }}
                  >
                    <span style={{ color: "blue" }}>{msg.username}:</span>
                    <span>{msg.msg}</span>
                  </span>
                </p>
              );
            })}
          </ScrollToBottom>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Message"
              aria-label="Message"
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              aria-describedby="button-addon2"
            />
            <button
              className="btn btn-outline-success"
              type="button"
              id="button-addon2"
              onClick={sendMsg}
            >
              Send
            </button>
          </div>
        </div>
        <div
          className="col-sm-5"
          style={{ border: "2px solid blue", borderRadius: "10px" }}
        >
          <h3>Users</h3>
          <hr></hr>
          {users
            .filter((user) => user.name !== username)
            .map((user, i) => {
              return (
                <h3 key={i} style={{ boxShadow: "1px 1px" }}>
                  {user.name}{" "}
                  {user.status === "online" ? (
                    <span style={style} className="text text-success">
                      Online
                    </span>
                  ) : (
                    <span style={style} className="text text-danger">
                      Offline
                    </span>
                  )}
                </h3>
              );
            })}
        </div>
        <div className="col-sm-2">
          <br></br>
          <Link to="/">
            <button className="btn btn-info">Logout</button>
          </Link>
        </div>
      </div>
      <hr></hr>
      <div>
        <Online>Only shown when you're online</Online>
        <Offline>Only shown offline (surprise!)</Offline>
      </div>
    </div>
  );
};
export default Chat;
