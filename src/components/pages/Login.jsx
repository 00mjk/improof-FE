import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { host } from "../../api/host.jsx";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../elements/Footer.jsx";

// COMPONENTS
import { LogoL } from "../Logo.jsx";

const Login = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({});
  const handleInput = (event) => {
    setLoginData({
      ...loginData,
      profile: {
        ...loginData.profile,
        [event.target.name]: event.target.value,
      },
    });
  };

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const sendData = async () => {
      await fetch(`${host}/users/login`, {
        credentials: "include",
        method: "POST",
        body: JSON.stringify(loginData),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((response) => response.json())
        .then((json) => {
          console.log(json);
          if (!json.status) {
            toast("invalid password");
          } else {
            navigate("/");
          }
        });
    };
    sendData();
  };

  return (
    <div className="maxHH central">
      <div className="">
        <div className="mb2">
          <LogoL />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="col">
            <div className="mb2 col">
              <input
                type="text"
                name="email"
                placeholder="email"
                className="shadow-s"
                onChange={handleInput}
              />
              <input
                type="password"
                name="password"
                placeholder="password"
                className="mt05 shadow-s"
                onChange={handleInput}
              />
            </div>
            <button className={`bg-FAV mb2`} type="submit">
              login
            </button>
            <div className="col central">
              <p>Not registered yet?</p>
              <p>
                <NavLink to="/registration">click here</NavLink>
              </p>
            </div>
          </div>
        </form>

        <ToastContainer />
      </div>
    </div>
  );
};

export default Login;
