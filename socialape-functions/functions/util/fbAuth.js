const { admin, db } = require("./admin.js");

//authenticate that user is logged in, middleware
module.exports = (req, res, next) => {
  let idToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    idToken = req.headers.authorization.split("Bearer ")[1];
  } else {
    console.error("No id token found");
    return res.status(403).json({ error: "Unauthorized" });
  }

  admin
    .auth()
    .verifyIdToken(idToken)
    .then(decodedToken => {
      req.user = decodedToken;
      return db
        .collection("users")
        .where("userId", "==", req.user.uid)
        .limit(1)
        .get();
      //returns a promise which contains an array of data
    })
    .then(data => {
      req.user.handle = data.docs[0].data().handle;
      req.user.imageUrl = data.docs[0].data().imageUrl;
      console.log("Current User:", req.user.handle);
      return next();
    })
    .catch(err => {
      console.error("Error while verifying token,", err);
      if (err.code === "auth/id-token-expired") {
        return res
          .status(400) //403 is unauthorized
          .json({ error: "Token has expired. Please login again" });
      } else {
        return res.status(403).json(err);
      }
    });
};
