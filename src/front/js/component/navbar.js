import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const Navbar = () => {
  const navigate = useNavigate();
  const { store, actions } = useContext(Context);

  const handleLogout = () => {
    actions.logout();
    navigate("/");
  };

  useEffect(() => {
    const jwt = localStorage.getItem("token");
    if (!jwt) {
      // se redirecciona a usuarios si no están autenticados
      navigate("/");
      return;
    }
    actions.getUserData();
    actions.getPosts();
  }, []);

  return (
    <nav className="navbar navbar-light bg-light">
      <div className="container">
        <Link to="/">
          <span className="navbar-brand mb-0 h1">Autenticación</span>
        </Link>
        <p>{store.userData ? `Hola! ${store.userData.email}` : ""}</p>
        <div className="ml-auto">
          <button onClick={handleLogout} className="btn btn-primary">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};
