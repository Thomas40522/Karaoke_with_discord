'use client';
import Image from "next/image";
import { backend_endpoint_default } from "@/endpoints";
import styles from "./page.module.css";
import React, { useState, useEffect } from 'react';
import YouTube from "react-youtube";
import './page.css';
import { useSearchParams } from 'next/navigation';


export default function Client() {
  const searchParams = useSearchParams();
  const backend_endpointTemp = searchParams.get('backend');

  const [songName, setSongName] = useState("");
  const [songUrl, setSongUrl] = useState("");
  const [text, setText] = useState("");
  const [backend_endpoint, setBackend_endpoint] = useState(backend_endpoint_default)

  useEffect(() => {
  
    if (backend_endpointTemp != null) {
      setBackend_endpoint(backend_endpointTemp)
    }
  },[])


  function Request_Song() {
    fetch(backend_endpoint + '/request_song', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      body: JSON.stringify({ song_name: songName, song_url: songUrl }),
    })
    .then(
      response => {
        if (!response.ok) {
          return response.json().then(err => {
            throw new Error(err.error);
          });
        }
        return response.json();
      }
    )
    .then(data => {
      console.log('Fetched Data:', data);
      setSongName("")
      setSongUrl("")
    })
    .catch(error => {
      console.error('Error Setting Maxsong:', error);
    });
  }

  function Send_Text() {
    fetch(backend_endpoint + '/send_text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      body: JSON.stringify({ text: text }),
    })
    .then(
      response => {
        if (!response.ok) {
          return response.json().then(err => {
            throw new Error(err.error);
          });
        }
        return response.json();
      }
    )
    .then(data => {
      console.log('Fetched Data:', data);
      setText("")
    })
    .catch(error => {
      console.error('Error Setting Maxsong:', error);
    });
  }


  function handle_request() {
    Request_Song()
  }

  function handle_send() {
    Send_Text()
  }


  return (
    <>
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Request Song</h2>
          <label>
            Song Name:
            <input type="string" value={songName}  onChange={(e) => setSongName(e.target.value)}/>
          </label>
          <label>
            Song URL:
            <input type="string" value={songUrl} onChange={(e) => setSongUrl(e.target.value)}
            />
          </label>
          <button className="settings-button" onClick={handle_request}>Request</button>
          <div className="boarder"></div>
          <label>
            Text:
            <input type="string" value={text} onChange={(e) => setText(e.target.value)}
            />
          </label>
          <button className="settings-button" onClick={handle_send}>Send</button>
        </div>
      </div>
    </>
  
  );
}
