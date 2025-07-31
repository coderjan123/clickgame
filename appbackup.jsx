import { useEffect, useState, useRef } from 'react';
import './App.css';

function App() {
  const [lautstärke, setLautstärke] = useState(0);
  const [maxlautstärke, setMaxLautstärke] = useState(0);
  const [avglautstärke, setavglautstärke] = useState(0);
  const [listening, setlistening] = useState(false);

  const maxLautstärkeRef = useRef(0);
  const lautstärkegesRef = useRef(0);
  const rundenRef = useRef(0);
  const listeningRef = useRef(listening); // Ref für aktuelles listening
  const timeoutRef = useRef(null);

  // Ref updaten, wenn State sich ändert
  useEffect(() => {
    listeningRef.current = listening;
  }, [listening]);

  useEffect(() => {
    if (!listening) {
      // Stoppe Tick falls aktiv
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      return; // nicht starten, wenn nicht "listening"
    }

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        const audioCtx = new AudioContext();
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        source.connect(analyser);

        analyser.fftSize = 256;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const tick = () => {
          analyser.getByteFrequencyData(dataArray);
          const avg = dataArray.reduce((a, b) => a + b) / dataArray.length;

          setLautstärke(Math.round(avg));

          lautstärkegesRef.current += avg;
          rundenRef.current += 1;
          const durchschnitt = lautstärkegesRef.current / rundenRef.current;
          setavglautstärke(Math.round(durchschnitt));

          if (avg > maxLautstärkeRef.current) {
            maxLautstärkeRef.current = avg;
            setMaxLautstärke(Math.round(avg));
          }

          // Nur weiter machen, wenn listening noch true ist
          if (listeningRef.current) {
            timeoutRef.current = setTimeout(tick, 100);
          }
        };

        tick();

        return () => {
          // Cleanup wenn Komponente unmountet oder listening false wird
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          audioCtx.close();
        };
      })
      .catch((err) => {
        console.error("Kein Zugriff aufs Mikrofon:", err);
      });
  }, [listening]);

  return (
    <>
      <div>Aktuelle Lautstärke: {lautstärke}</div>
      <div>Maximale Lautstärke: {maxlautstärke}</div>
      <div>Durchschnittliche Lautstärke: {avglautstärke}</div>
      <button onClick={() => setlistening(true)}>Start Listening</button>
      <button onClick={() => setlistening(false)}>Stop Listening</button>
    </>
  );
}

export default App;
