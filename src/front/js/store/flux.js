const getState = ({ getStore, getActions, setStore }) => {
	return {
	  store: {
		token: null,
		demo: [
		  {
			title: "FIRST",
			background: "white",
			initial: "white",
		  },
		  {
			title: "SECOND",
			background: "white",
			initial: "white",
		  },
		],
		posts: [],
		userData: null,
	  },
	  actions: {
		register: async (email, password) => {
		  try {
			const response = await fetch(
			  process.env.BACKEND_URL + "/api/signup",
			  {
				method: "POST",
				headers: {
				  "Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			  }
			);
			if (!response.ok) {
			  return false;
			}
			const data = response.json();
			return data;
		  } catch (error) {
			console.log(error);
		  }
		},
		login: async (email, password) => {
		  try {
			const response = await fetch(
			  process.env.BACKEND_URL + "/api/signin",
			  {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			  }
			);
			if (!response.ok) {
			  return false;
			}
			const data = await response.json();
			localStorage.setItem("token", data.token);
			setStore({ token: data.token });
			return true;
			//   console.log("esto es data", data);
			// return data;
		  } catch (error) {
			console.log(error);
		  }
		},
		getPosts: async () => {
		  const jwtToken = localStorage.getItem("token");
		  try {
			const response = await fetch(
			  process.env.BACKEND_URL + "/api/post/me",
			  {
				headers: {
				  authorization: `Bearer ${jwtToken}`,
				},
			  }
			);
			if (!response.ok) {
			  return false;
			}
			const data = await response.json();
			console.log("posts------", data);
			setStore({ posts: data.posts });
		  } catch (error) {
			console.log(error);
		  }
		},
		createPost: async (content) => {
		  const jwtToken = localStorage.getItem("token");
		  console.log("jwtToken......", jwtToken);
		  try {
			const response = await fetch(process.env.BACKEND_URL + "/api/post", {
			  method: "POST",
			  headers: {
				"Content-Type": "application/json",
				authorization: `Bearer ${jwtToken}`,
			  },
			  body: JSON.stringify({ content }),
			});
			if (!response.ok) {
			  return false;
			}
			const data = await response.json();
			console.log("data desde flux", data);
			return data;
		  } catch (error) {
			console.log(error);
		  }
		},
		addPostToStore: (post) => {
		  const store = getStore();
		  console.log("Esto es store.post....", store.post);
		  setStore({
			posts: [...store.posts, post],
		  });
		},
		getUserData: async () => {
		  const jwtToken = localStorage.getItem("token");
		  const response = await fetch(process.env.BACKEND_URL + "/api/me", {
			headers: {
			  authorization: `Bearer ${jwtToken}`,
			},
		  });
		  if (!response.ok) return false;
		  const data = await response.json();
		  setStore({ userData: data });
		},
		logout: () => {
		  localStorage.removeItem("token");
		  setStore({ userData: null });
		},
	  },
	};
  };
  
  export default getState;
  