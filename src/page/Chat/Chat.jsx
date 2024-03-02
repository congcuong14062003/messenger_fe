import { useCallback, useEffect, useRef, useState } from "react";
import "./Chat.scss";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import getToken from "../../utils/GetToken/GetToken";
import TokenInfo from "../../utils/TokenInfor/TokenInfor";
import LogOutBtn from "../../Component/LogOutBtn/LogOutBtn";
import { useSocket } from "../../useSocket/useSocket";

function ChatMessenger() {
  const { user_id } = useParams();
  const decodedToken = TokenInfo(getToken());
  const myId = decodedToken.user_id;
  const socket = useSocket();
  const [listuser, setListUser] = useState([]);
  const [dataUserActive, setDataUserActive] = useState({});
  const [listMessage, setListMessage] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesContainerRef = useRef(null);
  const [inforUser, setInforUser] = useState();

  useEffect(() => {
    // Fetch danh sách người dùng và thông tin người nhắn
    fetchUserList();
    fetchUserActive(user_id);

    if (socket) {
      socket.emit("online", { myId });

      socket.on("messagePrivate", handleReceivedMessage);
      messagesContainerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }

    return () => {
      if (socket) {
        socket.off("messagePrivate", handleReceivedMessage);
      }
    };
  }, [socket, user_id]);

  useEffect(() => {
    fetchMessages()
      .then(() => {
        messagesContainerRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      })
      .catch((error) =>
        console.error("There was a problem with the fetch operation:", error)
      );
  }, [user_id]);

  const fetchUserList = () => {
    fetch("https://messenger-be.vercel.app/list/list_user")
      .then((response) => response.json())
      .then((data) => setListUser(data))
      .catch((error) =>
        console.error("There was a problem with the fetch operation:", error)
      );
  };

  const fetchUserActive = (userId) => {
    fetch(`https://messenger-be.vercel.app/list/list_user/${userId}`)
      .then((response) => response.json())
      .then((data) => setDataUserActive(data))
      .catch((error) =>
        console.error("There was a problem with the fetch operation:", error)
      );
  };

  const fetchMessages = () => {
    return fetch(`https://messenger-be.vercel.app/chatroom/message/${user_id}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((response) => {
        if (response.ok === false) {
          setListMessage([]);
          throw new Error("Lỗi");
        }
        return response.json(); // return promise ở đây
      })
      .then((data) => {
        setListMessage(data);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
      });
  };

  const handleReceivedMessage = (data) => {
    fetchMessages();
  };

  const handleMessageChange = useCallback((e) => {
    setNewMessage(e.target.value);
  }, []);

  const handleSubmitMessage = useCallback(
    (e) => {
      e.preventDefault();
      fetch(`https://messenger-be.vercel.app/chatroom/partner/${user_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          sender_id: myId,
          receiver_id: user_id,
          message_text: newMessage,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setListMessage((prevMessages) => [...prevMessages, data]);
          socket.emit("messagePrivate", {
            socket_id: socket.id,
            sender_id: myId,
            receiver_id: user_id,
            message_text: newMessage,
          });
          setNewMessage("");
        })
        .catch((error) =>
          console.error("There was a problem with the fetch operation:", error)
        );
    },
    [user_id, myId, newMessage, socket]
  );

  // lây thông tin của mình
  useEffect(() => {
    fetch(`https://messenger-be.vercel.app/list/list_user/${myId}`)
      .then(
        (response) => response.json() // return promise ở đây
      )
      .then((data) => {
        setInforUser(data);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
      });
  }, [myId]);
  console.log(dataUserActive);

  return (
    <div className="main-wrapper">
      <div className="container">
        <div className="page-content">
          <div className="container mt-5">
            <div className="row">
              <div className="col-md-4 col-12 card-stacked">
                <div className="card shadow-line mb-3 chat">
                  <div className="p-3 chat-header">
                    <div className="d-flex">
                      <div className="w-100 d-flex pl-0 profile-user">
                        <span
                          style={{ display: "flex", alignItems: "flex-start" }}
                        >
                          <img
                            alt=""
                            className="user-detail-trigger rounded-circle shadow avatar-sm mr-3 chat-profile-picture"
                            src={inforUser?.avatar_url}
                          />
                          <span>
                            <p style={{ margin: "0" }}>{inforUser?.username}</p>
                            <p
                              style={{
                                margin: "0",
                                fontSize: "12px",
                                fontWeight: "400",
                              }}
                            >
                             {inforUser?.email}
                            </p>
                          </span>
                        </span>
                        <LogOutBtn />
                      </div>
                    </div>
                  </div>
                  <div className="chat-search pl-3 pr-3">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search a conversation"
                      />
                      <div className="input-group-append prepend-white">
                        <span className="input-group-text pl-2 pr-2">
                          <i className="fs-17 las la-search drop-shadow"></i>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="chat-user-panel">
                    <div className="pb-3  d-flex flex-column navigation-mobile pagination-scrool chat-user-scroll">
                      {listuser &&
                        listuser?.map((data, index) => {
                          if (data.user_id !== myId)
                            return (
                              <Link to={"/chat/" + data.user_id} key={index}>
                            
                                <div
                                  className="chat-item d-flex pl-3 pr-0 pt-3 pb-3"
                                  key={index}
                                >
                                  <div className="w-100">
                                    <div className="d-flex pl-0">
                                      <img
                                        alt=""
                                        className="rounded-circle shadow avatar-sm mr-3"
                                        src={data.avatar_url}
                                      />
                                      <div>
                                        <p className="margin-auto fw-400 text-dark-75">
                                          {data.username}
                                        </p>
                                        <div className="d-flex flex-row mt-1">
                                          <span className="message-shortcut margin-auto text-muted fs-13 ml-1 mr-4">
                                            <span
                                              style={{
                                                color: "#0fff0f",
                                                fontSize: "large",
                                              }}
                                            >
                                              &#x2022;
                                            </span>{" "}
                                            Online
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            );
                        })}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-8 col-12 card-stacked">
                <div className="card shadow-line mb-3 chat chat-panel">
                  <div className="p-3 chat-header">
                    <div className="d-flex">
                      <div className="w-100 d-flex pl-0">
                        <img
                          alt=""
                          className="rounded-circle shadow avatar-sm mr-3 chat-profile-picture"
                          src={dataUserActive && dataUserActive.avatar_url}
                        />
                        <div className="mr-3">
                          <a href="!#">
                            <p className="fw-400 mb-0 text-dark-75">
                              {dataUserActive && dataUserActive.username}
                            </p>
                          </a>
                          <p className="sub-caption text-muted text-small mb-0">
                            <i className="la la-clock mr-1"></i>last seen today
                            at 09:15 PM
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex flex-row mb-3 navigation-mobile scrollable-chat-panel chat-panel-scroll">
                    <div className="w-100 p-3 chat-list-box">
                      {listMessage &&
                        listMessage?.map((data, index) => {
                          const sentAtTimestamp = data.sent_at;
                          const sentAtDate = new Date(sentAtTimestamp);
                          const hour = sentAtDate.getHours();
                          const minute = sentAtDate.getMinutes();

                          return data.sender_id === myId ? (
                            <div
                              className="d-flex flex-row-reverse mb-2"
                              key={index}
                            >
                              <div className="right-chat-message fs-13 mb-2">
                                <div className="mb-0 mr-3 pr-4">
                                  <div className="d-flex flex-row">
                                    <div className="pr-2">
                                      {data.message_text}
                                    </div>
                                    <div className="pr-4"></div>
                                  </div>
                                </div>
                                <div className="message-options dark">
                                  <div className="message-time">
                                    <div className="d-flex flex-row">
                                      <div className="mr-2">
                                        {hour}:{minute < 10 ? "0" : ""}
                                        {minute}
                                      </div>
                                      <div className="svg15 double-check"></div>
                                    </div>
                                  </div>
                                  <div className="message-arrow">
                                    <i className="text-muted la la-angle-down fs-17"></i>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div
                              className="left-chat-message fs-13 mb-2"
                              key={index}
                            >
                              <p className="mb-0 mr-3 pr-4">
                                {data.message_text}
                              </p>
                              <div className="message-options">
                                <div className="message-time">
                                  {hour}:{minute < 10 ? "0" : ""}
                                  {minute}
                                </div>
                                <div className="message-arrow">
                                  <i className="text-muted la la-angle-down fs-17"></i>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      <div
                        className="p-end-chat"
                        ref={messagesContainerRef}
                      ></div>
                    </div>
                  </div>
                  <div className="chat-search pl-3 pr-3">
                    <form action="" onSubmit={handleSubmitMessage}>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          value={newMessage}
                          onChange={handleMessageChange}
                          placeholder="Write a message"
                        />
                        <div className="input-group-append prepend-white">
                          <span className="input-group-text pl-2 pr-2">
                            <button type="submit">
                              {" "}
                              <i className="fs-19 bi bi-cursor ml-2 mr-2"></i>
                            </button>
                          </span>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatMessenger;
