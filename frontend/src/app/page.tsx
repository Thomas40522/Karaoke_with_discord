'use client';
import Image from "next/image";
import styles from "./page.module.css";
import React, { useState, useEffect } from 'react';
import YouTube from "react-youtube";

const backend_endpoint = "http://127.0.0.1:3758"

export default function Home() {
  const [queue, setQueue] = useState<any[]>([]);
  useEffect(() => {
    Get_Queue()
    const intervalId = setInterval(Get_Queue, 30000);
    return () => {
      clearInterval(intervalId);
    };
  },[])

  function Get_Queue() {
    fetch(backend_endpoint + '/get_queue', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors'
    })
      .then(response => response.json())
      .then(data => {
        console.log('Fetched Data:', data);
        setQueue(data)
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });  
  }

  function Dequeue() {
    fetch(backend_endpoint + '/dequeue', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors'
    })
      .then(response => response.json())
      .then(data => {
        console.log('Fetched Data:', data);
        setQueue(data)
      })
      .catch(error => {
        console.error('Error Dequeu:', error);
      });
  }

  const opts = {
    height: "390",
    width: "640",
    playerVars: {
      autoplay: 1,
    },
  };

  function extract_link() {
    const default_link = "N6gICr1IVuQ"
    if (queue.length > 0) {
      const match = queue[0][1].match(/v=([a-zA-Z0-9_-]+)/);
      return match ? match[1]: default_link
    } else {
      return default_link;
    }
  }


  return (
    <>
      <button 
        onClick={Get_Queue}
      >
        refresh
      </button>
      <button 
        onClick={Dequeue}
      >
        Next
      </button>
      <div>
        <h1>Song Queue</h1>
        <div id="queue-container">
          {queue.length > 0 ? (
            queue.map((item, index) => (
              <div key={index}>
                <strong >{item[0]}</strong>
              </div>
            ))
          ) : (
            <p>No songs in the queue.</p>
          )}
        </div>
      </div>
      <YouTube videoId={
        extract_link()
      } opts={opts} onEnd={Dequeue} />
    </>
  );
}
