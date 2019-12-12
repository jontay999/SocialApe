const { db } = require("../util/admin.js");
const { validateScream } = require("../util/validators");

exports.getAllScreams = (req, res) => {
  db.collection("screams")
    .orderBy("createdAt", "desc")
    .get()
    .then(data => {
      let screams = [];
      data.forEach(doc => {
        screams.push({
          screamId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt,
          commentCount: doc.data().commentCount,
          likeCount: doc.data().likeCount,
          userImage: doc.data().userImage
        });
      });
      return res.json(screams);
    })
    .catch(err => console.error(err));
};

exports.postOneScream = (req, res) => {
  const newScream = {
    body: req.body.body,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl,
    createdAt: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0
  };

  const { valid, errors } = validateScream(newScream);

  if (!valid) {
    return res.status(400).json(errors);
  }

  let post = db.collection("screams").add(newScream);
  post
    .then(doc => {
      const resScream = newScream;
      resScream.screamId = doc.id;
      res.json(resScream);
    })
    .catch(err => {
      console.log("failed");
      res.status(500).json({ error: `something went wrong` });
      console.error(err);
    });
};

//get scream and comments
exports.getScream = (req, res) => {
  let screamData = {};
  db.doc(`/screams/${req.params.screamId}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Scream not found" });
      }
      screamData = doc.data();
      screamData.screamId = doc.id;
      return db
        .collection("comments")
        .orderBy("createdAt", "desc")
        .where("screamId", "==", req.params.screamId)
        .get()
        .then(data => {
          screamData.comments = [];
          data.forEach(doc => {
            screamData.comments.push(doc.data());
          });
          return res.json(screamData);
        })
        .catch(err => {
          console.error(err);
          return res.status(500).json({ error: err.code });
        });
    });
};

//get comments
exports.commentOnScream = (req, res) => {
  if (req.body.body.trim() == "") {
    return res.status(400).json({ comment: "Must not be empty" });
  }

  const newComment = {
    body: req.body.body,
    createdAt: new Date().toISOString(),
    screamId: req.params.screamId,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl
  };

  db.doc(`/screams/${req.params.screamId}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Scream not found" });
      }
      doc.ref
        .update({ commentCount: doc.data().commentCount + 1 })
        .then(() => {
          return db.collection("comments").add(newComment);
        })
        .then(() => {
          res.json(newComment);
        })
        .catch(err => {
          console.error(err);
          res.status(500).json({ error: "Something went wrong" });
        });
    });
};

//like scream
exports.likeScream = (req, res) => {
  const likeDocument = db
    .collection("likes")
    .where("userHandle", "==", req.user.handle)
    .where("screamId", "==", req.params.screamId);

  const screamDocument = db.doc(`/screams/${req.params.screamId}`);
  let screamData;

  screamDocument.get().then(doc => {
    if (doc.exists) {
      screamData = doc.data();
      screamData.screamId = doc.id;
      likeDocument
        .get()
        .then(data => {
          if (data.empty) {
            //like not created yet
            return db
              .collection("likes")
              .add({
                screamId: req.params.screamId,
                userHandle: req.user.handle,
                createdAt: new Date().toISOString()
              })
              .then(() => {
                screamData.likeCount++;
                return screamDocument.update({
                  likeCount: screamData.likeCount
                });
              })
              .then(() => {
                return db
                  .collection("comments")
                  .orderBy("createdAt", "desc")
                  .where("screamId", "==", req.params.screamId)
                  .get()
                  .then(data => {
                    screamData.comments = [];
                    data.forEach(doc => {
                      screamData.comments.push(doc.data());
                    });
                    return res.json(screamData);
                  });
              });
          } else {
            //like created already
            return res.status(400).json({ error: "Scream already liked" });
          }
        })
        .catch(err => {
          console.error(err);
          res.status(500).json({ error: err.code });
        });
    } else {
      return res.status(404).json({ error: "Scream not found" });
    }
  });
};

//unlike scream
exports.unlikeScream = (req, res) => {
  const likeDocument = db
    .collection("likes")
    .where("userHandle", "==", req.user.handle)
    .where("screamId", "==", req.params.screamId);

  const screamDocument = db.doc(`/screams/${req.params.screamId}`);
  let screamData;

  screamDocument.get().then(doc => {
    if (doc.exists) {
      screamData = doc.data();
      screamData.screamId = doc.id;
      likeDocument
        .get()
        .then(data => {
          if (data.empty) {
            //scream not liked, cannot unlike
            return res.status(400).json({ error: "Scream not liked" });
          } else {
            //like created already, go and unlike
            return db
              .doc(`/likes/${data.docs[0].id}`)
              .delete()
              .then(() => {
                screamData.likeCount--;
                return screamDocument.update({
                  likeCount: screamData.likeCount
                });
              })
              .then(() => {
                return db
                  .collection("comments")
                  .orderBy("createdAt", "desc")
                  .where("screamId", "==", req.params.screamId)
                  .get()
                  .then(data => {
                    screamData.comments = [];
                    data.forEach(doc => {
                      screamData.comments.push(doc.data());
                    });
                    return res.json(screamData);
                  });
              });
          }
        })
        .catch(err => {
          console.error(err);
          res.status(500).json({ error: err.code });
        });
    } else {
      return res.status(404).json({ error: "Scream not found" });
    }
  });
};

//delete scream
exports.deleteScream = (req, res) => {
  const document = db.doc(`/screams/${req.params.screamId}`);
  document
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Scream not found" });
      }

      if (doc.data().userHandle !== req.user.handle) {
        return res.status(403).json({ error: "unauthorized" });
      } else {
        document.delete().then(() => {
          res.json({ message: "Scream deleted successfully" });
        });
      }
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
