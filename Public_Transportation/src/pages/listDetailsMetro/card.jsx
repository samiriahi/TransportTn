import React, { useContext, useState } from "react";
import "./card.css";
import Navbar from "../../components/navbar/Navbar";
import useFetch from "../../hooks/fetch";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faLocationPin,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";

const Card = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const { data} = useFetch(`http://127.0.0.1:8000/get/${id}/`);
  const [list, setList] = useState([]);
  
  useEffect(() => {
    if (data && data.comments) {
      setList(data.comments);
    }
  }, [data]);
    

  const addComment = () => {
    const commentInput = document.getElementById("commentInput");
    const commentContent = commentInput.value;
  
    const newComment = {
      content: commentContent,
      username: user.user.username,
      metro_id: data.id,
    };

    console.log("this id ="+ data.id);
  
    fetch("http://127.0.0.1:8000/post-comment/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newComment),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Comment added:", data);
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error adding comment:", error);
      });
  };

  return (
    <div>
      <Navbar />
      <div className="card">
        <div className="cardDetails">
          <div className="cardImage">
            <img
              src="https://images.pexels.com/photos/2275288/pexels-photo-2275288.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt=""
              className="caImg"
            />
          </div>
          <div className="caDesc">
            <h1 className="caTitle">{data.name}</h1>
            <div className="caDis">
            <FontAwesomeIcon icon={faLocationPin} bounce style={{color: "#1b0b93",}} />
              <span className="caDistance">{data.depart}</span>
              To
              <span className="caDistance1">{data.destination} </span>
            </div>
            {data.stations && data.stations.length > 0 ? (
              <div className="stationsList">
                <span className="caTaxiOp">
                  {data.stations.map((station, index) => (
                    <span key={index} className="stationItem">
                      <FontAwesomeIcon
                        icon={faLocationPin}
                        className="stationIcon"
                      />{" "}
                      {station}
                    </span>
                  ))}
                </span>
              </div>
            ) : (
              <p>No stations available</p>
            )}
            {data.working_hours && data.working_hours.length > 0 ? (
              <div className="workingHours">
                <FontAwesomeIcon icon={faClock} className="caTime" />
                {data.working_hours.map((hour, index) => (
                  <span key={index} className="workingHourItem">
                    {hour}
                  </span>
                ))}
              </div>
            ) : (
              <p>No working hours available</p>
            )}

            <span className="tarif">Tarif :{data.ticketTarif}</span>
          </div>
        </div>
        <div className="commentSection">
          <h3 className="commentTitle">Comments</h3>
          <ul className="commentList">
            {data   ? (
              list.map((comment, index) => (
                <li key={index} className="commentItem">
                  <FontAwesomeIcon icon={faXmark}  className="crois"/>
                  <div className="commentUser">
                    <img src="https://th.bing.com/th/id/OIP.bfbNmLdRBSXVwsUOnlKNsgHaHa?w=219&h=219&c=7&r=0&o=5&dpr=1.3&pid=1.7" alt="User Avatar" />
                    <span style={{ color: "#6a99cb" }}>{comment.username}</span>
                    <span className="commentSpace"></span>
                    <span style={{ color: "#6a99cb" }} className="ldate">{comment.created_at}</span>
                  </div>
                  <p className="commentContent"><span style={{ color: "#050505" }}>{comment.content}</span></p>
                </li>
              ))
            ) : (
              <p>No comments available.</p>
            )}
          </ul>
          <div className="addComment">
          <input
            type="text"
            placeholder="Add a comment..."
            id="commentInput"
            className="commentInput"
          />
            <button onClick={addComment}  className="commentButton"> Add Comment </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;



