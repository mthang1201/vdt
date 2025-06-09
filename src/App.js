import React from 'react';
import ShakaPlayer from './components/ShakaPlayer';

function App() {
  const manifestUri = 'https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd';

  return (
    <div className="App">
      <h1 className="text-center text-2xl font-bold my-4">ABR Comparison Demo</h1>
      <div className="flex justify-around p-4" 
      style={{
      display: 'flex',
      justifyContent: 'space-around',
      padding: '1rem', // p-4
    }}>
        <ShakaPlayer manifestUri={manifestUri} useCustomAbr={false} />
        <ShakaPlayer manifestUri={manifestUri} useCustomAbr={true} />
      </div>
    </div>
  );
}

export default App;