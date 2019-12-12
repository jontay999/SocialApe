import {
  SET_USER,
  SET_UNAUTHENTICATED,
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
  LOADING_USER,
  MARK_NOTIFICATIONS_READ
} from "../types";
import axios from "axios";

export const loginUser = (userData, history) => dispatch => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/login", userData)
    .then(res => {
      setAuthorizationHeader(res.data.token);
      dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS });
      history.push("/");
      //push state to url and go to it
    })
    .catch(err => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data
      });
    });
};

export const signupUser = (newUserData, history) => dispatch => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/signup", newUserData)
    .then(res => {
      setAuthorizationHeader(res.data.token);
      dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS });
      history.push("/");
      //push state to url and go to it
    })
    .catch(err => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data
      });
    });
};

export const logoutUser = () => dispatch => {
  localStorage.removeItem("FBIdToken");
  delete axios.defaults.headers.common["Authorization"];
  dispatch({ type: SET_UNAUTHENTICATED });
};

export const getUserData = () => dispatch => {
  dispatch({ type: LOADING_USER });
  axios
    .get("/user")
    .then(res => {
      dispatch({ type: SET_USER, payload: res.data });
    })
    .catch(err => {
      console.error(err);
    });
};

const setAuthorizationHeader = token => {
  const FBIdToken = `Bearer ${token}`;
  localStorage.setItem(`FBIdToken`, FBIdToken);
  axios.defaults.headers.common["Authorization"] = FBIdToken;
};

export const editUserDetails = userDetails => dispatch => {
  dispatch({ type: LOADING_USER });
  axios
    .post("./user", userDetails)
    .then(() => {
      dispatch(getUserData());
    })
    .catch(err => {
      console.log(err);
    });
};

export const uploadImage = formData => dispatch => {
  dispatch({ type: LOADING_USER });
  axios
    .post("/user/image/", formData)
    .then(() => {
      dispatch(getUserData());
    })
    .catch(err => {
      console.log(err);
    });
};

export const markNotificationsRead = notificationIds => dispatch => {
  axios
    .post("/notifications", notificationIds)
    .then(res => {
      dispatch({ type: MARK_NOTIFICATIONS_READ });
      // getUserData();
    })
    .catch(err => {
      console.log(err);
    });
};
