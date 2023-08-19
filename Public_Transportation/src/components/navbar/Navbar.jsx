import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const handelClick = () => {
    navigate("/login");
  };
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handelLogout = () => {
    localStorage.removeItem("user");
    window.location.reload();
    navigate("/");
  };

  return (
    <div className="navbar">
      <div className="navContainer">
        <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
          <span className="logo">Transport.Tn </span>
        </Link>

        {user ? (
          <div className="User">
            <div className="user-container">
              <button className="logoutButton" onClick={handelLogout}>
                Logout{" "}
              </button>
              <Link to="/setting">
                {user ? (
                  <div className="userImg">
                    <img src={user.user.imageUrl} alt="img" />
                  </div>
                ) : (
                  <div>
                    <img
                      src="https://i.ibb.co/MBtjqXQ/no-avatar.gif"
                      alt="img"
                      className="userImg"
                    />
                  </div>
                )}
              </Link>
            </div>
          </div>
        ) : (
          <div className="navItems">
            <Link to="/register">
              <button className="navButton">Register</button>
            </Link>
            <button className="navButtonL" onClick={handelClick}>
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
