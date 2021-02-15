import { useEffect, useState } from 'react'
import Cotter from 'cotter'
import Head from 'next/head'

import styles from '../styles/Home.module.css'

export default function Home() {

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [publicResource, setPublicResource] = useState(null);
  const [privateResource, setPrivateResource] = useState(null);

  useEffect(() => {
    const cotter = new Cotter(process.env.ApiKeyId);

    if (localStorage.getItem("ACCESS_TOKEN") != null) {
      setIsLoggedIn(true);
    }

    if(isLoggedIn === false){
      cotter
        .signInWithOTP()
        .showEmailForm()
        .then(payload => {
          localStorage.setItem("ACCESS_TOKEN", payload.oauth_token.access_token);
          setIsLoggedIn(true);
        })
        .catch(err => console.error(err));
      }
      
  }, []);

  const logOut = () => {
    localStorage.removeItem("ACCESS_TOKEN");
    setIsLoggedIn(false);
    window.location.reload(true)
  };


  
  // Get Public Resource
  const getPublicResource = async () => {
    var resp = await fetch("/api/public");
    setPublicResource(await resp.text());
  };
    
  // Get Private Resource
  const getPrivateResource = async () => {
    var token = localStorage.getItem("ACCESS_TOKEN");
    if (token == null) {
      setPrivateResource("Token doesn't exist, you're logged-out");
      return;
    }
    var resp = await fetch("/api/private", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setPrivateResource(await resp.text());
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
      <h1 className="title">Passwordless App.</h1>

      {/* 1️⃣ TODO: Setup a div to contain the form */}
      {
        isLoggedIn === false &&
        <div id="cotter-form-container" style={{ width: 300, height: 300 }} />
      }
      
      
      <p>
        {isLoggedIn ? "✅ You are logged in" : "❌ You are not logged in"}
      </p>

      {isLoggedIn ? (
        <div
            className="card"
            style={{ padding: 10, margin: 5, cursor: 'pointer' }}
            onClick={logOut}
        >
          Log Out
        </div>
      ) : null}

        {/* 1️⃣ TODO: Setup a div to contain the form */}
        
        <div className="grid">
          <div className="card" onClick={getPublicResource} style={{cursor: 'pointer'}}>
              <h3>Public Endpoint</h3>
              <p>{publicResource}</p>
          </div>

          <div className="card" style={{cursor: 'pointer'}} onClick={getPrivateResource}>
              <h3>Private Endpoint</h3>
              <p>{privateResource}</p>
          </div>
      </div>
      </main>
    </div>
  )
}
