let db = {
  users: [
    {
      userId: "dh234324324234234g",
      email: "user@email.com",
      handle: "user",
      createdAt: "2019-11-13T08:31:12.584Z",
      imageUrl: "image/dsdfsdfsdfsdf/sdfsdfs",
      bio: "Hello, my name is user, nice to meet you",
      website: "user.com",
      location: "London, UK"
    }
  ],
  screams: [
    {
      userHandle: "user",
      body: "this is a scream body",
      createdAt: "2019-11-13T08:31:12.584Z",
      likeCount: 5,
      commentCount: 2
    }
  ],
  comments: [
    {
      userHandle: "user",
      screamId: "asdfasdfasdfasdf",
      body: "Nice one mate",
      createdAt: "2019-11-13T08:31:12.584Z"
    }
  ],

  notifications: [
    {
      recipient: "user",
      sender: "john",
      read: "true | false",
      screamId: "sasdfasdfasdf",
      type: "like | comment",
      createdAt: "2019-11-13T08:31:12.584Z"
    }
  ]
};

const userDetails = {
  //redux data
  credentials: {
    userId: "dh234324324234234g",
    email: "user@email.com",
    handle: "user",
    createdAt: "2019-11-13T08:31:12.584Z",
    imageUrl: "image/dsdfsdfsdfsdf/sdfsdfs",
    bio: "Hello, my name is user, nice to meet you",
    website: "http://user.com",
    location: "London, UK"
  },
  likes: [
    {
      userHandle: "user",
      screamId: "hh120JWMF9ie0rjd"
    },
    {
      userHandle: "user2",
      screamId: "ahsic8sjAJDS9jcms9IS9"
    }
  ]
};

sampleUserId = "tIgAygqHbmSkE6mA1kx18KeIuwZ2"; //newuser
sampleScreamId = "Vs5VwYdUINNHSapxTHhZ"; //newuser2 just joined
sampleCommentId = "uxxBc9iQaFeTsIZuczou"; //newuser commented welcome to ^ scream
