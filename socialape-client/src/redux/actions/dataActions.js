import {
  SET_SCREAMS,
  LOADING_DATA,
  LIKE_SCREAM,
  UNLIKE_SCREAM,
  DELETE_SCREAM,
  SET_ERRORS,
  CLEAR_ERRORS,
  POST_SCREAM,
  LOADING_UI,
  SET_SCREAM,
  STOP_LOADING_UI,
  SUBMIT_COMMENT
} from "../types";
import axios from "axios";

//get all screams
export const getScreams = () => dispatch => {
  dispatch({ type: LOADING_DATA });
  axios
    .get("/screams")
    .then(res => {
      dispatch({ type: SET_SCREAMS, payload: res.data });
    })
    .catch(err => {
      console.log(err);
      dispatch({
        type: SET_SCREAMS,
        payload: null
      });
    });
};

//like a scream
export const likeScream = screamId => dispatch => {
  axios
    .get(`/scream/${screamId}/like`)
    .then(res => {
      dispatch({ type: LIKE_SCREAM, payload: res.data });
    })
    .catch(err => {
      console.log(err);
    });
};

//unlike scream
export const unlikeScream = screamId => dispatch => {
  axios
    .get(`/scream/${screamId}/unlike`)
    .then(res => {
      dispatch({ type: UNLIKE_SCREAM, payload: res.data });
    })
    .catch(err => {
      console.log(err);
    });
};

//submit a comment
export const submitComment = (screamId, commentData) => dispatch => {
  axios
    .post(`/scream/${screamId}`, commentData)
    .then(res => {
      dispatch({
        type: SUBMIT_COMMENT,
        payload: res.data
      });
      dispatch(clearErrors());
    })
    .catch(err => {
      dispatch({ type: SET_ERRORS, payload: err.response.data });
    });
};

//Post a Scream
export const postScream = newScream => dispatch => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/scream", newScream)
    .then(res => {
      dispatch({
        type: POST_SCREAM,
        payload: res.data
      });
      dispatch(clearErrors());
    })
    .catch(err => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data
      });
    });
};

//Delete a scream
export const deleteScream = screamId => dispatch => {
  axios
    .delete(`/scream/${screamId}`)
    .then(() => {
      dispatch({ type: DELETE_SCREAM, payload: screamId });
    })
    .catch(err => {
      console.log(err);
    });
};

export const getScream = screamId => dispatch => {
  dispatch({ type: LOADING_UI });
  axios
    .get(`/scream/${screamId}`)
    .then(res => {
      dispatch({ type: SET_SCREAM, payload: res.data });
      dispatch({ type: STOP_LOADING_UI });
    })
    .catch(err => {
      console.log(err);
    });
};

//For profile page
export const getUserData = userHandle => dispatch => {
  dispatch({ type: LOADING_DATA });
  axios
    .get(`/user/${userHandle}`)
    .then(res => {
      dispatch({
        type: SET_SCREAMS,
        payload: res.data.screams
      });
    })
    .catch(() => {
      dispatch({
        type: SET_SCREAMS,
        payload: null
      });
    });
};

// action creator, only dispatches a function
export const clearErrors = () => dispatch => {
  dispatch({ type: CLEAR_ERRORS });
};
