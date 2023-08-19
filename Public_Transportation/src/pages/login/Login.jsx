import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./login.css";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Login = () => {
  const [credentials, setCredentials] = useState({
    username: undefined,
    password: undefined,
  });

  const { loading, error, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [notificationDisplayed, setNotificationDisplayed] = useState(false);

  useEffect(() => {
    if (location.state && location.state.registrationSuccess) {
      toast.success('Registration successful! You can now log in.');
      console.log("11111");
      setNotificationDisplayed(true); // Mettre à jour l'état
    }
  }, []); // Laissez la liste des dépendances vide
  

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/login",
        credentials
      );
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
      navigate("/");
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE", payload: err.response.data });
    }
  };

  return (
    <div className="login">
      <header>
      <ToastContainer />
        <Link to={"/"} style={{ color: "inherit", textDecoration: "none" }}>
        <h2 className="bigTitle" style={{ color: "#e46904" }}>Transport.Tn</h2>
        </Link>
      </header>
      <h3 className="signText">Sign in or create an account</h3>
      <div className="lContainer">
        <input
          type="text"
          placeholder="username"
          id="username"
          onChange={handleChange}
          className="loginInput"
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          onChange={handleChange}
          className="loginInput"
        />
        <button disabled={loading} onClick={handleClick} className="lButton">
          Login
        </button>
        <div className="rrtext">
          <Link to={"/register"}>create account</Link>
        </div>
        {error && <span>{error.message}</span>}
        <div className="ft">
          <p className="logindesc">
            By signing in or creating an account, you agree with our Terms &
            Conditions and Privacy Statement
          </p>
          <p className="cr">All rights reserved. Copyright – Transport.Tn™</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
