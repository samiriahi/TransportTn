import React, { useState } from "react";
import FaqModal from "./modal";
import "./mailList.css";

const MailList = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="mail">
      <h1 className="mailTitle">FAQ && SUPPORT !</h1>
      <span className="mailDesc">
        Sign up and we'll send the best deals to you
      </span>
      <div className="mailInputContainer">
        <button onClick={openModal}>choose a question</button>
      </div>
      <FaqModal isOpen={modalIsOpen} closeModal={closeModal} />
    </div>
  );
};

export default MailList;