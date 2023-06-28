import React, { useState, useEffect } from "react";

export const useAudio = url => {
  const [audio] = useState(new Audio(url));
  const [playing, setPlaying] = useState(false);

  const toggle = () => setPlaying(!playing);

  useEffect(() => {
      playing ? audio.play() : audio.pause();
    },
    [playing]
  );

  useEffect(() => {
    audio.addEventListener('ended', () => setPlaying(false));
    return () => {
      audio.removeEventListener('ended', () => setPlaying(false));
    };
  }, []);

  return [playing, toggle];
};

export const RunAudio = ({ url, click}) => {
  const [playing, toggle] = useAudio(url);
  useEffect(() => {
    click && document.querySelector('#play-sound').click()
  }, [click]);
  return (
    <button onClick={toggle} id='play-sound' className="d-none">
      {playing ? 'Pause' : 'Play'}
    </button>
  );
}
