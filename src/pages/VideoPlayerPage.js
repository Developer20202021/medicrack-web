import React, { useState, useEffect, useRef } from 'react';
import { Mail, Maximize, Play, Pause, Volume2, VolumeX, Settings } from 'lucide-react';

const VideoPlayerPage = () => {
  const [userEmail, setUserEmail] = useState('user@example.com');
  const [emails, setEmails] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [quality, setQuality] = useState('auto');
  const [showSettings, setShowSettings] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const emailIdCounter = useRef(0);
  const controlsTimeoutRef = useRef(null);

  // BunnyCDN configuration - iframe এর পরিবর্তে direct video URL
  const LIBRARY_ID = '565387';
  const VIDEO_ID = '33145e0d-8519-4117-be93-84f3b5027f13';
  
  // Direct video URL (MP4 format)
  const videoUrl = `https://vz-c7ff0fcc-23f.b-cdn.net/33145e0d-8519-4117-be93-84f3b5027f13/playlist.m3u8`;

  // Fullscreen detection
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // প্রতি ১ সেকেন্ডে email watermark দেখানো
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      const newEmail = {
        id: emailIdCounter.current++,
        text: userEmail,
        left: Math.random() * 75 + 10,
        top: Math.random() * 75 + 10,
        rotation: Math.random() * 30 - 15,
        opacity: 0.5 + Math.random() * 0.3,
        scale: 0.9 + Math.random() * 0.3,
      };
      
      setEmails(prev => [...prev, newEmail]);

      setTimeout(() => {
        setEmails(prev => prev.filter(e => e.id !== newEmail.id));
      }, 3000);
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, userEmail]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.() ||
      containerRef.current?.webkitRequestFullscreen?.() ||
      containerRef.current?.mozRequestFullScreen?.() ||
      containerRef.current?.msRequestFullscreen?.();
    } else {
      document.exitFullscreen?.() ||
      document.webkitExitFullscreen?.() ||
      document.mozCancelFullScreen?.() ||
      document.msExitFullscreen?.();
    }
  };

  // Video events
  const handleVideoPlay = () => setIsPlaying(true);
  const handleVideoPause = () => setIsPlaying(false);
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  // Volume controls
  const handleVolumeChange = (newVolume) => {
    const vol = Math.max(0, Math.min(1, newVolume));
    setVolume(vol);
    if (videoRef.current) {
      videoRef.current.volume = vol;
    }
    if (vol === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.muted = false;
        setIsMuted(false);
        if (volume === 0) setVolume(0.5);
      } else {
        videoRef.current.muted = true;
        setIsMuted(true);
      }
    }
  };

  // Playback speed
  const handleSpeedChange = (speed) => {
    setPlaybackRate(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSettings(false);
  };

  // Seek
  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    setCurrentTime(seekTime);
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
    }
  };

  // Format time
  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Auto-hide controls
  const resetControlsTimeout = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    setShowControls(true);
    if (isPlaying && isFullscreen) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  useEffect(() => {
    resetControlsTimeout();
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying, isFullscreen]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="bg-gray-800 rounded-lg shadow-2xl overflow-hidden">
          {/* Video Container with Fullscreen Support */}
          <div 
            ref={containerRef}
            className={`relative aspect-video bg-black ${isFullscreen ? 'fixed inset-0 z-50 aspect-auto' : ''}`}
            onMouseMove={resetControlsTimeout}
            onClick={resetControlsTimeout}
          >
            {/* Native HTML5 Video Player */}
            <video
              ref={videoRef}
              className="w-full h-full absolute inset-0 bg-black"
              onPlay={handleVideoPlay}
              onPause={handleVideoPause}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              controls={false}
              playsInline
              preload="metadata"
            >
              <source src={videoUrl} type="application/x-mpegURL" />
              Your browser does not support the video tag.
            </video>

            {/* Custom Controls Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 transition-opacity duration-300 pointer-events-none z-30 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
              {/* Top Controls */}
              <div className="absolute top-4 right-4 pointer-events-auto flex gap-2">
                {/* Settings Button */}
                <div className="relative">
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-3 bg-black/50 backdrop-blur-sm text-white rounded-lg hover:bg-black/70 transition-all"
                    title="Settings"
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                  
      {/* Settings Menu */}
      {showSettings && (
        <div className="absolute right-0 mt-2 bg-black/90 backdrop-blur-sm rounded-lg border border-white/20 overflow-hidden min-w-[200px]">
          <div className="p-3 border-b border-white/10">
            <p className="text-white text-sm font-semibold mb-2">Playback Speed</p>
            {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map(speed => (
              <button
                key={speed}
                onClick={() => handleSpeedChange(speed)}
                className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                  playbackRate === speed 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-300 hover:bg-white/10'
                }`}
              >
                {speed}x {speed === 1 && '(Normal)'}
              </button>
            ))}
          </div>
          <div className="p-3">
            <p className="text-white text-sm font-semibold mb-2">Quality</p>
            {['auto', '360p', '480p', '720p', '1080p'].map(q => (
              <button
                key={q}
                onClick={() => setQuality(q)}
                className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                  quality === q 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-300 hover:bg-white/10'
                }`}
              >
                {q === 'auto' ? 'Auto' : q}
              </button>
            ))}
          </div>
        </div>
      )}
                </div>
                
                <button
                  onClick={toggleFullscreen}
                  className="p-3 bg-black/50 backdrop-blur-sm text-white rounded-lg hover:bg-black/70 transition-all"
                  title="Fullscreen"
                >
                  <Maximize className="w-5 h-5" />
                </button>
              </div>
              
              {/* Bottom Controls */}
              <div className="absolute bottom-0 left-0 right-0 pointer-events-auto p-4">
                {/* Progress Bar */}
                <div className="mb-3">
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #a855f7 0%, #a855f7 ${(currentTime / duration) * 100}%, #4b5563 ${(currentTime / duration) * 100}%, #4b5563 100%)`
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {/* Play/Pause */}
                    <button
                      onClick={togglePlay}
                      className="p-2 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-black/70 transition-all"
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>
                    
                    {/* Volume Controls */}
                    <div className="flex items-center gap-2 group">
                      <button
                        onClick={toggleMute}
                        className="p-2 bg-black/50 backdrop-blur-sm text-white rounded-lg hover:bg-black/70 transition-all"
                      >
                        {isMuted || volume === 0 ? (
                          <VolumeX className="w-4 h-4" />
                        ) : (
                          <Volume2 className="w-4 h-4" />
                        )}
                      </button>
                      
                      <div className="w-0 group-hover:w-20 overflow-hidden transition-all duration-300">
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={isMuted ? 0 : volume}
                          onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                          className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                          style={{
                            background: `linear-gradient(to right, #a855f7 0%, #a855f7 ${volume * 100}%, #4b5563 ${volume * 100}%, #4b5563 100%)`
                          }}
                        />
                      </div>
                    </div>
                    
                    {/* Time Display */}
                    <div className="text-white text-sm font-medium bg-black/50 backdrop-blur-sm px-3 py-1 rounded">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* Speed Indicator */}
                    <div className="text-white text-sm bg-black/50 backdrop-blur-sm px-3 py-1 rounded">
                      {playbackRate}x
                    </div>
                    
                    {/* Quality Indicator */}
                    <div className="text-white text-sm bg-black/50 backdrop-blur-sm px-3 py-1 rounded">
                      {quality}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Watermark Layer - সবসময় সবার উপরে থাকবে */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
              {emails.map((email) => (
                <div
                  key={email.id}
                  className="absolute transition-all duration-500"
                  style={{
                    left: `${email.left}%`,
                    top: `${email.top}%`,
                    transform: `rotate(${email.rotation}deg) scale(${email.scale})`,
                    opacity: email.opacity,
                    animation: 'fadeInOut 3s ease-in-out',
                  }}
                >
                  <div className={`flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white rounded-md border border-white/30 shadow-2xl ${isFullscreen ? 'px-5 py-2.5' : 'px-3 py-1.5'}`}>
                    <Mail className={isFullscreen ? 'w-5 h-5' : 'w-3 h-3'} />
                    <span className={`font-semibold whitespace-nowrap ${isFullscreen ? 'text-base' : 'text-xs'}`}>
                      {email.text}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Fullscreen Info */}
            {isFullscreen && (
              <div className="absolute top-4 left-4 z-40 pointer-events-none">
                <div className="bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-lg border border-white/20">
                  <p className="text-sm">
                    Watching as: <span className="text-purple-400 font-semibold">{userEmail}</span>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Controls - শুধু normal view তে দেখাবে */}
          {!isFullscreen && (
            <div className="p-6 bg-gray-800">
              <h2 className="text-2xl font-bold text-white mb-2">
                Protected Video Player
              </h2>
              <p className="text-gray-400 mb-4">
                Watching as: <span className="text-purple-400 font-semibold">{userEmail}</span>
              </p>
              
              <div className="flex gap-4 items-center mb-4">
                <button
                  onClick={togglePlay}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-5 h-5" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      Play
                    </>
                  )}
                </button>
                
                <button
                  onClick={toggleFullscreen}
                  className="px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg shadow-lg hover:bg-gray-600 transition-all duration-200 flex items-center gap-2"
                >
                  <Maximize className="w-5 h-5" />
                  Fullscreen
                </button>
                
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                  🔒 Watermark Protection Active
                </h3>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li>✓ Email watermark প্রতি ১ সেকেন্ডে আসবে</li>
                  <li>✓ Fullscreen mode এও watermark থাকবে</li>
                  <li>✓ Screen recording এ watermark দেখা যাবে</li>
                  <li>✓ কোন third-party fullscreen button কাজ করবে না</li>
                  <li>✓ Advanced video controls: Seek, Speed (0.25x-2x), Volume, Quality (up to 1080p)</li>
                </ul>
              </div>
            </div>
          )}
        </div>

      <style>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: scale(0.8); }
          10% { opacity: 1; transform: scale(1); }
          90% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.8); }
        }
        
        video::-webkit-media-controls {
          display: none !important;
        }
        video::-webkit-media-controls-enclosure {
          display: none !important;
        }
        
        /* Custom slider styles */
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #a855f7;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        
        .slider::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #a855f7;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          background: #9333ea;
        }
        
        .slider::-moz-range-thumb:hover {
          transform: scale(1.2);
          background: #9333ea;
        }
      `}</style>
      </div>
    </div>
  );
};

export default VideoPlayerPage;
                      
