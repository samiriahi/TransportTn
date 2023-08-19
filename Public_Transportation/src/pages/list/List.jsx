import "./list.css";
import Navbar from "../../components/navbar/Navbar";
import SearchItem from "../../components/searchItem/SearchItem";
import { useContext, useState } from "react";
import { faTrain, faPlug} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AuthContext } from "../../context/AuthContext";
import useFetch from "../../hooks/fetch";
import { SearchContext } from "../../context/SearchContext";


const List = () => {
  const [destinations, setDestination] = useState("");
  const [selectedTime, setSelectedTime] = useState("00:00");
  const {user}=useContext(AuthContext); 
  const isAdmin = user && user.role === "true";
 
  const { data } = useFetch("http://127.0.0.1:8000/buss");

  const [isSearchClicked, setIsSearchClicked] = useState(false);

  const { depart, destination, working_hours, dispatch } = useContext(SearchContext);
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    const searchParams = {
      type: "bus",
      depart,
      destination,
      working_hours  ,
    };

    try {
      const response = await fetch("http://localhost:8000/api/search/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(searchParams),
      });

      const data = await response.json();
      setSearchResults(data); 
      setIsSearchClicked(true);
      console.log(data)
    } catch (error) {
      console.error("Error searching:", error);
    }
  };
  const displayData = isSearchClicked ? searchResults : data;
 
  return (
    <div>
      <Navbar />
      <div className="ListsSearch">
      <div className="ListsSearchItem">
          {isAdmin && (
            <button className="ListsBtn">
              <FontAwesomeIcon icon={faPlug} className="ListsIcon" />
            </button>
          )}
        </div>
        <div className="ListsSearchItem">
          <FontAwesomeIcon icon={faTrain} className="ListsIcon" />
          <input
            type="text"
            placeholder="From?"
            className="ListsSearchInput"
            onChange={(e) => {
              const capitalizedValue = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);
              dispatch({ type: "NEW_SEARCH", payload: { depart: capitalizedValue } });
            }}
          />
        </div>
        <div className="ListsSearchItem">
          <FontAwesomeIcon icon={faTrain} className="ListsIcon" />
          <input
            type="text"
            placeholder="To?"
            className="ListsSearchInput"
            onChange={(e) => {
              const capitalizedValue = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);
              dispatch({ type: "NEW_SEARCH", payload: { destination: capitalizedValue } });
            }}
          />
        </div>
        
        <input
          onChange={(e) => dispatch({ type: "NEW_SEARCH", payload: {  working_hours: e.target.value } })}
          type="time"
          className="searchTime"
        />
        <div className="ListsSearchItem">
          <button className="ListsBtn" onClick={handleSearch}>Search</button>
        </div>
      </div>
      <div className="listContainer">
        <div className="listWrapper">
          {displayData.map((item) => (
          <SearchItem item={item} key={item._id}/>
           ))}
        </div>
      </div>
    </div>
  );
};

export default List;
