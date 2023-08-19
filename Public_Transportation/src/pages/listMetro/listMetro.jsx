import "./listMetro.css";
import Navbar from "../../components/navbar/Navbar";
import SearchItemMetro from "../../components/searchItemMertro/SearchItemMetro";
import { useContext, useState } from "react";

import { faTrain, faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useFetch from "../../hooks/fetch";
import "react-time-picker/dist/TimePicker.css";
import { AuthContext } from "../../context/AuthContext";
import { SearchContext } from "../../context/SearchContext";

const ListMetro = () => {
  const { user } = useContext(AuthContext);
  const { data } = useFetch("http://127.0.0.1:8000/metros");

  const [isSearchClicked, setIsSearchClicked] = useState(false);

  const isAdmin = user.user.is_admin === true;

  const { depart, destination, working_hours, dispatch } =
    useContext(SearchContext);
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    const searchParams = {
      type: "metro",
      depart,
      destination,
      working_hours,
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
      console.log(searchParams); //
      setSearchResults(data);
      setIsSearchClicked(true);
      console.log(data);
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
            <FontAwesomeIcon
              icon={faCirclePlus}
              fade
              style={{ color: "#08337d" }}
              className="listIcon"
            />
          )}
        </div>
        <div className="ListsSearchItem">
          <FontAwesomeIcon icon={faTrain} className="ListsIcon" />
          <input
            type="text"
            placeholder="From?"
            className="ListsSearchInput"
            onChange={(e) => {
              dispatch({
                type: "NEW_SEARCH",
                payload: { depart: e.target.value },
              });
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
              dispatch({
                type: "NEW_SEARCH",
                payload: { destination: e.target.value },
              });
            }}
          />
        </div>

        <input
          onChange={(e) =>
            dispatch({
              type: "NEW_SEARCH",
              payload: { working_hours: e.target.value },
            })
          }
          type="time"
          className="searchTime"
        />
        <div className="ListsSearchItem">
          <button className="ListsBtn" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>
      <div className="listContainer">
        <div className="listWrapper">
          {displayData.map((item) => (
            <SearchItemMetro item={item} key={item._id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListMetro;
