import React, { useEffect, useRef } from 'react';
import shaka from 'shaka-player';
import WishAbrManager from './WishAbrManager';
import AbrDashboard from './AbrDashboard';

const ShakaPlayer = ({ manifestUri, useCustomAbr }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    // Install polyfills
    shaka.polyfill.installAll();

    if (!shaka.Player.isBrowserSupported()) {
      console.error('Browser not supported!');
      return;
    }

    // Initialize player
    const video = videoRef.current;
    const player = new shaka.Player(video);
    playerRef.current = player;

    // Listen for errors
    player.addEventListener('error', event => {
      console.error('[ShakaPlayer] Error event:', event.detail);
    });

    if (!useCustomAbr) {
      player.configure({
        abr: {
          enabled: true,
          defaultBandwidthEstimate: 5000000,
          switchInterval: 8.0,
          bandwidthUpgradeTarget: 0.85,
          bandwidthDowngradeTarget: 0.95,
        },
        streaming: {
          bufferingGoal: 30,
        },
      });
    } else {
      player.configure({
        abrFactory: () => {
          const wishAbr = new WishAbrManager();
          return wishAbr;
        },
      });
    }

    // Load the manifest
    player.load(manifestUri).then(() => {
      console.log('[ShakaPlayer] The video has been loaded!');
      console.log(player.getVariantTracks());
    }).catch(error => {
      console.error('[ShakaPlayer] Error loading manifest:', error);
    });

    // Cleanup on unmount
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [manifestUri, useCustomAbr]);

  return (
    <div>
      <video
        ref={videoRef}
        width="640"
        height="auto"
        controls
        autoPlay
      />
      {/* {playerRef.current && <AbrDashboard player={playerRef.current} />} */}
      <AbrDashboard player={playerRef.current} />
    </div>
  );
};

export default ShakaPlayer;
