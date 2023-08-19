import Modal from "react-modal";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./modal.css";
import { useState } from "react";

const FaqModal = ({ isOpen, closeModal }) => {
  const faqData = [
    {
      question: "What is the purpose of this application?",
      answer: "The main purpose of this application is to facilitate the movement of residents and visitors in the Greater Tunis area by providing information about available public transportation options, including metro, train, and buses.",
    },
  ];
  
  const faqData1 = [
    {
      question: "How do I change my password?",
      answer: `To change your password, follow these steps:
        - Open the application and go to the profile settings page.
        - Locate the 'Password' input field and enter your new password.
        - Click on the 'Save Changes' button.`,
    },
  ];
  
  const faqData2 = [
    {
      question: "What types of transportation options are available in the app?",
      answer: `The application offers several public transportation options to travel within the Greater Tunis area:
        - Metro: Use the metro for quick and efficient travel across different parts of the city.
        - Train: Benefit from the train service for longer and intercity trips.
        - Bus: Buses provide broader coverage and allow you to reach specific destinations not served by other modes of transportation.`,
    },
  ];
  
  const faqData3 = [
    {
      question: "How do I provide feedback on the cleanliness and condition of vehicles?",
      answer: `To provide feedback on the cleanliness and condition of vehicles:
        - Log in to your account in the application.
        - Select the option to provide feedback on vehicles.
        - Your feedback will be taken into consideration to improve the quality of service.`,
    },
  ];
  


  const [expanded, setExpanded] = useState(null);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : null);
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={closeModal} className="faq-modal">
      <h2 className="modText">Frequently Asked Questions :</h2>
      <Accordion className="modalDiv">
        {faqData.map((faq, index) => (
          <AccordionSummary
          key={index}
          expandIcon={<ExpandMoreIcon />}
          onClick={handleAccordionChange(index)}
          aria-controls={"panel" + index + "d-content"}
          id={"panel" + index + "d-header"}
        >
          <h5 className="question" >{faq.question}</h5>
        </AccordionSummary>
        
        ))}
        {faqData.map((faq, index) => (
          <AccordionDetails
            key={index}
            id={"panel" + index + "d-content"}
            className={expanded === index ? "answer-open" : "answer-closed"}
          >
            <h6 className="answer" >{faq.answer}</h6>
          </AccordionDetails>
        ))}
      </Accordion>


      <Accordion className="modalDiv">
        {faqData1.map((faq, index) => (
          <AccordionSummary
          key={index}
          expandIcon={<ExpandMoreIcon />}
          onClick={handleAccordionChange(index)}
          aria-controls={"panel" + index + "d-content"}
          id={"panel" + index + "d-header"}
        >
          <h5 className="question" >{faq.question}</h5>
        </AccordionSummary>
        
        ))}
        {faqData1.map((faq, index) => (
          <AccordionDetails
            key={index}
            id={"panel" + index + "d-content"}
            className={expanded === index ? "answer-open" : "answer-closed"}
          >
             <h6 className="answer" >{faq.answer}</h6>
          </AccordionDetails>
        ))}
      </Accordion>

      <Accordion className="modalDiv"> 
        {faqData2.map((faq, index) => (
          <AccordionSummary
          key={index}
          expandIcon={<ExpandMoreIcon />}
          onClick={handleAccordionChange(index)}
          aria-controls={"panel" + index + "d-content"}
          id={"panel" + index + "d-header"}
        >
          <h5 className="question" >{faq.question}</h5>
        </AccordionSummary>
        
        ))}
        {faqData2.map((faq, index) => (
          <AccordionDetails
            key={index}
            id={"panel" + index + "d-content"}
            className={expanded === index ? "answer-open" : "answer-closed"}
          >
            <h6 className="answer" >{faq.answer}</h6>
          </AccordionDetails>
        ))}
      </Accordion>

      <Accordion className="modalDiv">
        {faqData3.map((faq, index) => (
          <AccordionSummary
          key={index}
          expandIcon={<ExpandMoreIcon />}
          onClick={handleAccordionChange(index)}
          aria-controls={"panel" + index + "d-content"}
          id={"panel" + index + "d-header"}
        >
         <h5 className="question" >{faq.question}</h5>
        </AccordionSummary>
        
        ))}
        {faqData3.map((faq, index) => (
          <AccordionDetails
            key={index}
            id={"panel" + index + "d-content"}
            className={expanded === index ? "answer-open" : "answer-closed"}
          >
             <h6 className="answer" >{faq.answer}</h6>
          </AccordionDetails>
        ))}
      </Accordion>


      <button className="close-button" onClick={closeModal}>
        Close
      </button>
    </Modal>
  );
};

export default FaqModal;