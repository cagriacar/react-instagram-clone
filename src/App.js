import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./components/post/Post";
import { db, auth } from "./components/firebase/firebase";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { Button, Input } from "@material-ui/core";
import ImageUpload from "./components/imageUpload/ImageUpload";
import Avatar from '@material-ui/core/Avatar';
import InstagramEmbed from 'react-instagram-embed';

/* Modal Tasarımı */
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 300,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  /*  Kullanıcı Bilgileri Tutulması */
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  /* User State / Kullanıcı Durum Bilgisi (login-Logout) */
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);

  /* Modal Stili */
  /* Sign Up - Kullanıcı Girişi - Modal Tasarımı */
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  /* Post - State / Post Bilgisi */
  const [posts, setPosts] = useState([]);

  /* Hooks - useEffect */
  useEffect(() => {
    /* Oturum Durumunu Kontrol Et */
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user logged in
        setUser(authUser);
      } else {
        // user logged out
        setUser(null);
      }
    });
    return () => {
      /* Temizleme işlemi */
      unsubscribe();
    };
  }, [user, username]);

  /* useEffect belirli bir koşuna göre çalıştıracağımız kodlar. Veritabanından bilgileri almak istiyorum. postlar değiştiğinde useEffect tekrar tekrar çalışacak.*/

  /* Firebase'den verileri state çekme */
  useEffect(() => {
    // veritabanı kod bloğu
    db.collection("posts").orderBy('timestamp','desc').onSnapshot((snapshot) => {
      setPosts(
        snapshot.docs.map(doc => ({
          id: doc.id,
          post: doc.data(),
        }))
      );
    });
  }, []); // [] sayfa yenilendiğinde 1 kere çalışsın

  /* Events */
  /* Sign Up - onCLick Event*/

  const signUp = (event) => {
    event.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        });
      })
      .catch((error) => alert(error.message));

    setOpen(false);
  };

  /* Sign In - onClick Event */

  const signIn = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setOpenSignIn(false);
  };

  return (
    /* NOTE Container */
    <div className="app">

   

      {/* Modal - Kullanıcı Girişi */}
      <Modal open={open} onClose={() => setOpen(false)}>
        
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="instagram"
              />
            </center>
            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signUp}>
              {" "}
              Sign Up
            </Button>
          </form>
        </div>
      </Modal>


         {/* Modal - Kullanıcı Girişi */}
      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="instagram"
              />
            </center>
            
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn}>
              Sign In
            </Button>
          </form>
        </div>
      </Modal>


      {/* NOTE Header */}
      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt="instagram"
        />


 {/* NOTE Kullanıcı Giriş - Çıkış  */}
      {user ? (
        <Button onClick={() => auth.signOut()}> Logout</Button>
      ) : (
        <div className="app__loginContainer">
          <Button onClick={() => setOpenSignIn(true)}> Sign In</Button>
          <Button onClick={() => setOpen(true)}> Sign Up</Button>
        </div>
      )}
      </div>

            {/* NOTE  STORİES  */}
            <div className="app__stories">
            <Avatar
      className="post__avatar post__avatarstory" 
      alt="+"/* {username} */ 
      src="/static/images/avatar/1.jpg" />
              <Avatar
      className="post__avatar post__avatarstory" 
      alt="CagriAcar"/* {username} */ 
      src="/static/images/avatar/1.jpg" />
     
      <Avatar
      className="post__avatar post__avatarstory" 
      alt="B"/* {username} */ 
      src="/static/images/avatar/1.jpg" />

      </div>

     
      {/* NOTE Posts */}
      {/* State'deki değerleri Post sayfasına map fonksiyonu ile gönderiyoruz. */}
        <div className="app__posts">
          <div className="app__postLeft">

             {posts.map(({ id, post }) => (
            <Post
              key={id}
              postId={id}
              user={user}
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
            />
          ))}
          </div>
     <div className="app__postRight">
            <InstagramEmbed
            url='https://www.instagram.com/p/B0N8QKuJZBV/'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
             />

     </div>

        </div>
        
         {/* Resim Yükleme */}
         {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3>Sorry you need to login to upload</h3>
      )}
    </div>
  );
}

export default App;
