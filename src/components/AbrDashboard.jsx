import React, { useEffect, useState } from 'react';

const AbrDashboard = ({ player }) => {
  const [stats, setStats] = useState({
    bitrate: 0,
    resolution: 'N/A',
    estBandwidth: 0,
    bufferLength: 0,
    variantSwitches: 0,
    bufferingTime: 0,
    playbackTime: 0,
  });

  useEffect(() => {
    if (!player) return;

    const interval = setInterval(() => {
      const statsObj = player.getStats();
      const variantTrack = player.getVariantTracks().find(t => t.active);

      setStats({
        bitrate: variantTrack ? Math.round(variantTrack.bandwidth / 1000) : 0,
        resolution: variantTrack ? `${variantTrack.width}x${variantTrack.height}` : 'N/A',
        estBandwidth: Math.round(player.getBandwidthEstimate() / 1000), // kbps
        bufferLength: statsObj.buffering ? 0 : Math.round(statsObj.bufferingTime),
        variantSwitches: statsObj.switchHistory.length,
        bufferingTime: Math.round(statsObj.totalBufferingTime),
        playbackTime: Math.round(statsObj.playTime),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [player]);

  return (
    <div style={{ fontFamily: 'monospace', color: 'lime', background: '#333', padding: '1rem', borderRadius: '8px', width: 'fit-content' }}>
      <strong>ABR Dashboard</strong><br />
      Bitrate: {stats.bitrate} kbps<br />
      Resolution: {stats.resolution}<br />
      Est. Bandwidth: {stats.estBandwidth} kbps<br />
      Buffer Length: {stats.bufferLength} s<br />
      Variant Switches: {stats.variantSwitches}<br />
      Buffering Time: {stats.bufferingTime} s<br />
      Playback Time: {stats.playbackTime} s
    </div>
  );
};

export default AbrDashboard;