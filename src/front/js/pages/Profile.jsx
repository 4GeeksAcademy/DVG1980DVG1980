import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

const Profile = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [content, setContent] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const data = await actions.createPost(content);
    console.log("DATA....", data); // Para verificar lo que  tiene 'data'
    if (data && data.post) {
      actions.addPostToStore(data.post);
    }
    setContent("");
  }

  useEffect(() => {
    const jwt = localStorage.getItem("token");
    if (!jwt) {
      // se redirecciona a usuarios si no estan autenticados
      navigate("/");
      return;
    }
    actions.getPosts();
    actions.getUserData();
  }, []);
  //   console.log("esto es jwt", jwt);
  return (
    <div className="container">
      <div>
        <div className="mb-3 mt-3">
          <h1 className="text-center">Private page</h1>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Content</label>
              <textarea
                placeholder="content"
                className="form-control"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
        </div>
      </div>
      <div className="my-5">
        <ol>
          {store.posts.map((post) => {
            return (
              <li key={post.id + post.user_id}>
                {post.content}
                <hr />
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
};

export default Profile;
