import {  useNavigate, } from "react-router-dom";
import "./featured.css";


const Featured = () => {

  const navigate = useNavigate();
  const handleClick = (destination) => () => {
    const userIsLoggedIn = localStorage.getItem("user") !== null;

    if (userIsLoggedIn) {
      navigate(destination);
    } else {
      navigate('/login');
    }
  };

  const featuredItems = [
    {
      imgSrc: "https://thumbs.dreamstime.com/b/white-intercity-bus-rides-highway-271969260.jpg",
      title: "Bus",
      num: "+ 123",
      destination: "/list"
    },
    {
      imgSrc: "https://images.pexels.com/photos/2275288/pexels-photo-2275288.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      title: "Metro",
      num: "+ 533",
      destination: "/listMetro"
    },
    {
      imgSrc: "https://images.pexels.com/photos/2790396/pexels-photo-2790396.jpeg?auto=compress&cs=tinysrgb&w=1600",
      title: "Train",
      num: "+ 532",
      destination: "/listTrain"
    }
  ];

  return (
    <div className="featured">
      {featuredItems.map((item, index) => (
        <div className="featuredItem" key={index} onClick={handleClick(item.destination)}>
          <img src={item.imgSrc} alt="" className="featuredImg" />
          <div className="featuredTitles">
            <h1>{item.title}</h1>
            <h2 className="Fnum">{item.num}</h2>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Featured;
