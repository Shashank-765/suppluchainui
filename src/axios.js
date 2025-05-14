import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user")) || null;
    if (user?.token) {
      config.headers["Authorization"] = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    console.log(error.response?.status, 'status')
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/refreshtoken/newtoken")
    ) {
      originalRequest._retry = true;
      const userBeforeRefresh = JSON.parse(localStorage.getItem("user")) || {};
      try {
        const { data } = await api.post("/refreshtoken/newtoken");
        const updatedUser = { ...userBeforeRefresh, token: data.accessToken };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        api.defaults.headers.common["Authorization"] = `Bearer ${data.accessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("user");
        document.cookie.split(";").forEach(cookie => {
          const name = cookie.trim().split("=")[0];
          document.cookie = `${name}=; Max-Age=0; path=/;`;
          document.cookie = `${name}=; Max-Age=0; path=/; SameSite=None; Secure`;
        });
        window.location.href = "/auth";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
