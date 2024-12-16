import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";

const Login = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    const isLoggedIn = await actions.login(email, password);
    if (isLoggedIn) {
      navigate("/private");
    }

    // const response = await actions.login(email, password);
    // console.log(response);
    // console.log("email-password desde login", email, password);
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <form
        className="container card"
        style={{ width: "100%", maxWidth: "500px" }}
        onSubmit={handleSubmitLogin}
      >
        <div className="card-body">
          <h2 className="text-center">Login</h2>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              value={email}
              aria-describedby="emailHelp"
              onChange={(e) => setEmail(e.target.value)}
            />
            <div id="emailHelp" className="form-text">
              We'll never share your email with anyone else.
            </div>
          </div>
          <div className="mb-3">
            <label hmtlFor="exampleInputPassword1" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="exampleInputPassword1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
          <hr className="my-3" />
          <Link to={"/"}>
            ¿You don't have a register? {""}
            <span className="text-primary"> Click here </span>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
