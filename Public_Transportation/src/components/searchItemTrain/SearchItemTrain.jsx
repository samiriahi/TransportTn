import "./searchItemTrain.css";
import { Link } from "react-router-dom";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SearchItemTrain = ({item}) => {
  return (
    <div className="searchItem">
      <img
        src="https://images.pexels.com/photos/2790396/pexels-photo-2790396.jpeg?auto=compress&cs=tinysrgb&w=1600"
        alt=""
        className="siImg"
      />
      <div className="siDesc">
        <h1 className="siTitle">{item.name}</h1>

        <h4 className="textPostion">
          Depart :<span className="siTaxiOp">{item.depart}</span>
        </h4>
        <h4 className="textPostion">
          Destination : <span className="siTaxiOp1">{item.destination}</span>
        </h4>
         {item.working_hours && item.working_hours.length > 0 ? (
          <div className="siSubtitle">
            <FontAwesomeIcon
              icon={faClock}
              spin
              style={{ color: "#0e429a" }}
              className="sim"
            />
            {item.working_hours.map((hour, index) => (
              <span key={index} className="workingHourItem">
                {hour}
              </span>
            ))}
          </div>
        ) : (
          <p>No working hours available</p>
        )} 

        <span className="siCancelOp">Free cancellation </span>
        <span className="siCancelOpSubtitle">
          You can cancel later, so lock in this great price today!
        </span>
      </div>
      <div className="siDetails">
        <Link to={`/detailsTrain/${item.id}`} style={{ textDecoration: "none" }}>
          <div className="siDetailTexts">
            <button className="siCheckButton">Details</button>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default SearchItemTrain;
