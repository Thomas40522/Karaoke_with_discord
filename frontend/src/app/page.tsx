'use client';
import Image from "next/image";
import styles from "./page.module.css";
import React, { useState, useEffect } from 'react';
import YouTube from "react-youtube";
import './page.css';

const backend_endpoint = "http://127.0.0.1:3758"
// const backend_endpoint = "http://47.254.65.42:3758"

export default function Home() {
  const [queue, setQueue] = useState<any[]>([]);
  const [maxSong, setMaxSong] = useState<number>(20);
  const [scrollText, setScrollText] = useState('');
  const [key, setKey] = useState(0); // Used to retrigger animation
  const [showSettings, setShowSettings] = useState(false);
  const [videoHeight, setVideoHeight] = useState('640')
  const [videoWidth, setVideoWidth] = useState('1200')
  const [videoHeightTemp, setVideoHeightTemp] = useState(videoHeight)
  const [videoWidthTemp, setVideoWidthTemp] = useState(videoWidth)
  const [maxSongTemp, setMaxSongTemp] = useState<number>(maxSong)

  useEffect(() => {
    Get_Queue()
    Get_Max_Song()
    Get_Video_Dimension()
    showScrollMessage()
    const interval1 = setInterval(Get_Queue, 30000);
    const interval2 = setInterval(Get_Max_Song, 300000);
    const interval3 = setInterval(showScrollMessage, 20000);
    return () => {
      clearInterval(interval1);
      clearInterval(interval2);
      clearInterval(interval3);
    };
  },[])

  function Get_Max_Song() {
    fetch(backend_endpoint + '/get_max_song', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors'
    })
    .then(response => response.json())
    .then(data => {
      console.log('Fetched Data:', data);
      setMaxSong(data)
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });  
  }

  function Get_Video_Dimension() {
    fetch(backend_endpoint + '/get_video_dimension', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors'
    })
    .then(response => response.json())
    .then(data => {
      console.log('Fetched Data:', data);
      setVideoHeight(data[0])
      setVideoWidth(data[1])
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });  
  }

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

  function refresh() {
    Get_Queue()
    Get_Max_Song()
    showScrollMessage()
    Get_Video_Dimension()
  }

  function Push_Top(index:Number) {
    fetch(backend_endpoint + '/push_to_top', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      body: JSON.stringify({ index: index }),
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
      setQueue(data)
    })
    .catch(error => {
      console.error('Error Dequeu:', error);
    });
  }

  function showScrollMessage() {
    fetch(backend_endpoint + '/fire_text', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
    })
    .then(response => response.json())
    .then(data => {
      console.log('Fetched Data:', data);
      if (data != null) {
        setScrollText(data);
        setKey(prev => prev + 1);    
      }
    })
    .catch(error => {
      console.error('Error Dequeu:', error);
    });
  }

  function Set_MaxSong() {
    fetch(backend_endpoint + '/set_max_song', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      body: JSON.stringify({ max_song: maxSongTemp }),
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
      setMaxSong(data)
      setMaxSongTemp(data)
    })
    .catch(error => {
      console.error('Error Setting Maxsong:', error);
    });
  }

  function Set_Video_Dimension() {
    fetch(backend_endpoint + '/set_video_dimension', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      body: JSON.stringify({ video_height: videoHeightTemp, video_width: videoWidthTemp }),
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
      setVideoHeight(data[0])
      setVideoHeightTemp(data[0])
      setVideoWidth(data[1])
      setVideoWidthTemp(data[1])
    })
    .catch(error => {
      console.error('Error Setting Maxsong:', error);
    });
  }

  const opts = {
    height: videoHeight,
    width: videoWidth,
    playerVars: {
      autoplay: 1,
    },
  };

  function extract_link() {
    const default_link = "N6gICr1IVuQ"
    if (queue.length > 0) {
      const match = queue[0][1].match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
      return match ? match[1]: default_link
    } else {
      return default_link;
    }
  }

  function handle_save() {
    setVideoHeight(videoHeightTemp)
    setVideoWidth(videoWidthTemp)
    Set_MaxSong()
    Set_Video_Dimension()
  }

  function handle_setting_show() {
    setVideoHeightTemp(videoHeight)
    setVideoWidthTemp(videoWidth)
    setMaxSongTemp(maxSong)
    setShowSettings(true)
  }


  return (
    <div className="app-container">
      {/* Top bar */}
      <div className="top-bar">
        <h1>Karaoke</h1>
        <button className="settings-button" onClick={handle_setting_show}>Settings</button>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="modal-overlay" onClick={() => setShowSettings(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Settings</h2>
            <label>
              Max Songs:
              <input type="number" value={maxSongTemp}  onChange={(e) => setMaxSongTemp(Number(e.target.value))}/>
            </label>
            <label>
              Video Height:
              <input type="string" value={videoHeightTemp} onChange={(e) => setVideoHeightTemp(e.target.value)}
              />
            </label>
            <label>
              Video Width:
              <input type="string" value={videoWidthTemp} onChange={(e) => setVideoWidthTemp(e.target.value)}/>
            </label>
            <button className="settings-button" onClick={handle_save}>Save</button>
          </div>
        </div>
      )}


      {/* Main layout */}
      <div className="main-content">
        {/* Song list */}
        <div className="song-list">
          <h2>Song Queue ({queue.length}/{maxSong})</h2>
          <div id="queue-container">
            {queue.length > 0 ? (
              queue.map((item, index) => (
                <div key={index} className="song-item">
                  <strong className="name-item">{item[0]}</strong>
                  <span
                    className="song-action"
                    title="Move to top"
                    onClick={()=>Push_Top(index)}
                  >
                    ↑
                  </span>
                </div>
              ))
            ) : (
              <p>No songs in the queue.</p>
            )}
          </div>
        </div>

        {/* Video */}
        <div className="video-section">
          <YouTube videoId={extract_link()} opts={opts} onEnd={Dequeue} />
        </div>
      </div>

      {/* Bottom buttons */}
      <div className="button-bar">
        <button onClick={refresh} className="action-button">Refresh</button>
        <button onClick={Dequeue} className="action-button">Skip</button>
        <div className="scroll-message-container">
        <div className="scroll-message" id="scrollMessage" key={key}>
          {scrollText}
        </div>
      </div>
      </div>
    </div>
  
  );
}
