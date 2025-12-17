import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Mail, Maximize, Play, Pause, Volume2, VolumeX, Settings, ChevronDown, ChevronRight, Check, Lock, PlayCircle } from 'lucide-react';

const API_BASE_URL = 'https://medicrack-web-exam-496984660515.asia-south1.run.app/api';

const VideoPlayer = ({ videoUrl, userEmail, lectureTitle }) => {
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
  const [emails, setEmails] = useState([]);
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const emailIdCounter = useRef(0);
  const controlsTimeoutRef = useRef(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

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
      containerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  const handleVolumeChange = (newVolume) => {
    const vol = Math.max(0, Math.min(1, newVolume));
    setVolume(vol);
    if (videoRef.current) {
      videoRef.current.volume = vol;
    }
    setIsMuted(vol === 0);
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

  const handleSpeedChange = (speed) => {
    setPlaybackRate(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSettings(false);
  };

  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    setCurrentTime(seekTime);
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
    <div 
      ref={containerRef}
      className={`relative bg-black ${isFullscreen ? 'fixed inset-0 z-50' : 'w-full aspect-video'}`}
      onMouseMove={resetControlsTimeout}
      onClick={resetControlsTimeout}
    >
      <video
        ref={videoRef}
        className="w-full h-full"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={() => videoRef.current && setCurrentTime(videoRef.current.currentTime)}
        onLoadedMetadata={() => videoRef.current && setDuration(videoRef.current.duration)}
        controls={false}
        playsInline
        preload="metadata"
      >
        <source src={videoUrl} type="application/x-mpegURL" />
      </video>

      <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 transition-opacity duration-300 pointer-events-none z-30 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute top-4 right-4 pointer-events-auto flex gap-2">
          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-3 bg-black/50 backdrop-blur-sm text-white rounded-lg hover:bg-black/70 transition-all"
            >
              <Settings className="w-5 h-5" />
            </button>
            
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
              </div>
            )}
          </div>
          
          <button
            onClick={toggleFullscreen}
            className="p-3 bg-black/50 backdrop-blur-sm text-white rounded-lg hover:bg-black/70 transition-all"
          >
            <Maximize className="w-5 h-5" />
          </button>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 pointer-events-auto p-4">
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
              <button
                onClick={togglePlay}
                className="p-2 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-black/70 transition-all"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              
              <div className="flex items-center gap-2 group">
                <button
                  onClick={toggleMute}
                  className="p-2 bg-black/50 backdrop-blur-sm text-white rounded-lg hover:bg-black/70 transition-all"
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
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
                  />
                </div>
              </div>
              
              <div className="text-white text-sm font-medium bg-black/50 backdrop-blur-sm px-3 py-1 rounded">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
            
            <div className="text-white text-sm bg-black/50 backdrop-blur-sm px-3 py-1 rounded">
              {playbackRate}x
            </div>
          </div>
        </div>
      </div>

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

      {!isFullscreen && lectureTitle && (
        <div className="absolute top-4 left-4 z-40 pointer-events-none max-w-[60%]">
          <div className="bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-lg border border-white/20">
            <p className="text-sm font-semibold truncate">{lectureTitle}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const BatchModuleViewer = () => {
  const { batchId } = useParams(); // URL থেকে batchId নিবে
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});
  const [currentVideo, setCurrentVideo] = useState(null);
  const [completedLectures, setCompletedLectures] = useState({});
  const [lastWatchedLecture, setLastWatchedLecture] = useState(null);
  
  const userId = localStorage.getItem('userId') || 'user';
  const userEmail = `${userId}@medicrack.online`;

  useEffect(() => {
    if (batchId) {
      fetchModules();
      loadProgress();
    }
  }, [batchId]);

  const fetchModules = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/batch/${batchId}/modules`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) throw new Error('Failed to fetch modules');
      
      const data = await response.json();
      setModules(data.modules || []);
      
      if (data.modules && data.modules.length > 0) {
        setExpandedModules({ [data.modules[0].id]: true });
        if (data.modules[0].lectures && data.modules[0].lectures.length > 0) {
          setCurrentVideo({
            videoUrl: data.modules[0].lectures[0].videoUrl,
            title: data.modules[0].lectures[0].title,
            moduleId: data.modules[0].id,
            lectureIndex: 0
          });
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadProgress = () => {
    const saved = localStorage.getItem(`lectureProgress_${batchId}`);
    if (saved) {
      const progress = JSON.parse(saved);
      setCompletedLectures(progress.completed || {});
      setLastWatchedLecture(progress.lastWatched || null);
    }
  };

  const saveProgress = (moduleId, lectureIndex) => {
    const key = `${moduleId}_${lectureIndex}`;
    const newCompleted = { ...completedLectures, [key]: true };
    const progress = {
      completed: newCompleted,
      lastWatched: { moduleId, lectureIndex }
    };
    localStorage.setItem(`lectureProgress_${batchId}`, JSON.stringify(progress));
    setCompletedLectures(newCompleted);
    setLastWatchedLecture({ moduleId, lectureIndex });
  };

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const canAccessLecture = (moduleId, lectureIndex) => {
    if (lectureIndex === 0) return true;
    
    const prevKey = `${moduleId}_${lectureIndex - 1}`;
    return completedLectures[prevKey] === true;
  };

  const handleLectureClick = (module, lectureIndex) => {
    if (!canAccessLecture(module.id, lectureIndex)) {
      return;
    }

    const lecture = module.lectures[lectureIndex];
    setCurrentVideo({
      videoUrl: lecture.videoUrl,
      title: lecture.title,
      moduleId: module.id,
      lectureIndex
    });
  };

  const handleVideoComplete = () => {
    if (currentVideo) {
      saveProgress(currentVideo.moduleId, currentVideo.lectureIndex);
      
      const currentModule = modules.find(m => m.id === currentVideo.moduleId);
      if (currentModule && currentVideo.lectureIndex < currentModule.lectures.length - 1) {
        const nextLectureIndex = currentVideo.lectureIndex + 1;
        const nextLecture = currentModule.lectures[nextLectureIndex];
        setCurrentVideo({
          videoUrl: nextLecture.videoUrl,
          title: nextLecture.title,
          moduleId: currentModule.id,
          lectureIndex: nextLectureIndex
        });
      }
    }
  };

  const isLectureCompleted = (moduleId, lectureIndex) => {
    return completedLectures[`${moduleId}_${lectureIndex}`] === true;
  };

  const isLastWatched = (moduleId, lectureIndex) => {
    return lastWatchedLecture?.moduleId === moduleId && lastWatchedLecture?.lectureIndex === lectureIndex;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading modules...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-500 text-xl">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="flex flex-col lg:flex-row h-screen">
        {/* Video Player Section */}
        <div className="lg:flex-1 flex flex-col">
          <div className="flex-1 flex items-center justify-center bg-black p-4">
            {currentVideo ? (
              <div className="w-full max-w-5xl">
                <VideoPlayer 
                  videoUrl={currentVideo.videoUrl}
                  userEmail={userEmail}
                  lectureTitle={currentVideo.title}
                />
                <div className="mt-4 flex justify-between items-center">
                  <h2 className="text-white text-xl font-semibold">{currentVideo.title}</h2>
                  <button
                    onClick={handleVideoComplete}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    Mark Complete
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-white text-center">
                <p className="text-xl mb-2">No video selected</p>
                <p className="text-gray-400">Select a lecture from the list to start watching</p>
              </div>
            )}
          </div>
        </div>

        {/* Module List Section */}
        <div className="lg:w-96 bg-gray-800 overflow-y-auto border-t lg:border-t-0 lg:border-l border-gray-700">
          <div className="p-4 bg-gray-700 border-b border-gray-600 sticky top-0 z-10">
            <h2 className="text-white text-lg font-bold">Course Modules</h2>
            <p className="text-gray-400 text-sm mt-1">
              {Object.keys(completedLectures).length} lectures completed
            </p>
          </div>

          <div className="p-4 space-y-3">
            {modules.map((module, moduleIndex) => (
              <div key={module.id} className="bg-gray-700 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-600 transition-all"
                >
                  <div className="flex items-center gap-3">
                    {expandedModules[module.id] ? (
                      <ChevronDown className="w-5 h-5 text-purple-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-purple-400" />
                    )}
                    <div className="text-left">
                      <h3 className="text-white font-semibold text-sm">{module.moduleName}</h3>
                      <p className="text-gray-400 text-xs mt-1">
                        {module.lectures?.length || 0} lectures
                      </p>
                    </div>
                  </div>
                </button>

                {expandedModules[module.id] && (
                  <div className="border-t border-gray-600">
                    {module.lectures?.map((lecture, lectureIndex) => {
                      const isCompleted = isLectureCompleted(module.id, lectureIndex);
                      const isLocked = !canAccessLecture(module.id, lectureIndex);
                      const isCurrentlyWatching = isLastWatched(module.id, lectureIndex);
                      const isActive = currentVideo?.moduleId === module.id && currentVideo?.lectureIndex === lectureIndex;

                      return (
                        <button
                          key={lectureIndex}
                          onClick={() => handleLectureClick(module, lectureIndex)}
                          disabled={isLocked}
                          className={`w-full flex items-center gap-3 p-3 transition-all ${
                            isActive 
                              ? 'bg-purple-600 text-white' 
                              : isCompleted 
                                ? 'bg-green-900/30 hover:bg-green-900/50 text-white' 
                                : isLocked
                                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                  : 'hover:bg-gray-600 text-gray-300'
                          }`}
                        >
                          <div className="flex-shrink-0">
                            {isCompleted ? (
                              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            ) : isLocked ? (
                              <Lock className="w-5 h-5 text-gray-500" />
                            ) : (
                              <PlayCircle className="w-5 h-5 text-purple-400" />
                            )}
                          </div>
                          
                          <div className="flex-1 text-left">
                            <p className="text-sm font-medium">{lecture.title}</p>
                            <p className="text-xs opacity-75 mt-1">{lecture.duration}</p>
                          </div>

                          {isCurrentlyWatching && !isCompleted && (
                            <div className="flex-shrink-0">
                              <span className="text-xs bg-yellow-500 text-black px-2 py-1 rounded-full font-semibold">
                                Watching
                              </span>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
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
      `}</style>
    </div>
  );
};

export default BatchModuleViewer;