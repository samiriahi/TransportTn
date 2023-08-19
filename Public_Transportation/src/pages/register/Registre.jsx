import { useState } from "react";
import "./Registre.css";
import { Link, useNavigate } from "react-router-dom";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import axios from "axios";
import { Button } from "@mui/material";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Registre = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [is_admin, setIs_admin] = useState("False");
  const [isLoading, setIsLoading] = useState(false);


  const handelClick = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    let newUser;

    if (file) {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "upload");

      try {
        const uploadRes = await axios.post(
          "https://api.cloudinary.com/v1_1/dhb7jpopr/image/upload",
          data
        );

        const { public_id, url } = uploadRes.data;
        newUser = {
          username,
          password,
          email,
          is_admin,
          imageUrl: url,
          public_id,
        };
      } catch (err) {
        console.log(err);
        setIsLoading(false);
        return;
      }
    } else {
      newUser = {
        username,
        password,
        email,
      };
    }

      try {
        const res = await axios.post(
          "http://127.0.0.1:8000/signup",
          newUser
        );
        console.log(res);
        setIsLoading(false);
        setRegistrationSuccess(true);
        navigate("/login" , { state: { registrationSuccess: true } });
      } catch (err) {
        console.log(err);
        toast.error('An error occurred. Please try again.');
        setIsLoading(false);
      }
    };

  return (
    <div className="regitre">
      <header>
      <ToastContainer />
        <Link to={"/"} style={{ color: "inherit", textDecoration: "none" }}>
        <h2 className="bigTitle" style={{ color: "#e46904" }}>Transport.Tn</h2>
        </Link>
      </header>
      <h1 className="rCreate">Create Your Account</h1>
      <form onSubmit={handelClick} className="registre">
        <div className="imgText">
          <div className="left">
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
              className="rimg"
            />
          </div>
          <div className="formInput">
            <label htmlFor="file">
              image : <DriveFolderUploadOutlinedIcon className="icon" />
            </label>
            <input
              type="file"
              id="file"
              onChange={(e) => setFile(e.target.files[0])}
              style={{ display: "none" }}
            />
          </div>
        </div>
        <div className="ritem">
          <input
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            type="text"
            placeholder="UserName"
            className="inpt"
            autoComplete="off"
            required
          />
        </div>
        <div className="ritem">
          <input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            type="email"
            placeholder="Email"
            className="inpt"
            required
          />
        </div>

        <div className="ritem">
          <input
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            type="password"
            placeholder="Password"
            className="inpt"
            required
          />
        </div>
        {is_admin === "True" && (
          <div className="ritem">
            <input
            value={is_admin}
            onChange={(e) => {
             setIs_admin(e.target.value);
           }}
             type="text"
             placeholder="text"
             className="inpt"
            required
          />
        </div>
        )}

         
        <Button
          variant="contained"
          color="primary"
          type="submit"
          className="rbtn"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Sign Up"}
        </Button> 
      </form>
    </div>
  );
};
export default Registre;
