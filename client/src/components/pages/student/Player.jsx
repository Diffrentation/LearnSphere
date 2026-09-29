import React, { useRef, useState, useEffect } from "react";

function Player({ lectures, currentLectureId, onLectureChange }) {
  const videoRef = useRef(null);
  const [currentLecture, setCurrentLecture] = useState(
    lectures.find((lec) => lec.id === currentLectureId) || lectures[0]
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);
  // Update currentLecture when prop changes
  useEffect(() => {
    const lec = lectures.find((l) => l.id === currentLectureId);
    if (lec) {
      setCurrentLecture(lec);
      setIsPlaying(false);
      setProgress(0);
    }
  }, [currentLectureId, lectures]);

  // Auto-play when lecture changes
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.load();
      video.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [currentLecture]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) video.pause();
    else video.play();
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video) {
      setCurrentTime(video.currentTime);
      setProgress((video.currentTime / video.duration) * 100);
    }
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    if (!video) return;
    const seekTime = (e.target.value / 100) * video.duration;
    video.currentTime = seekTime;
    setProgress(e.target.value);
  };

  const handleVolume = (e) => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = e.target.value;
    setVolume(e.target.value);
    setIsMuted(e.target.value === "0");
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
    if (!isMuted) setVolume(0);
    else setVolume(video.volume || 1);
  };

  const handleSpeedChange = (e) => {
    const rate = Number(e.target.value);
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const toggleFullscreen = () => {
    const container = containerRef.current; // create a ref for outer container
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const forward = () => {
    const video = videoRef.current;
    if (video) video.currentTime += 10;
  };

  const rewind = () => {
    const video = videoRef.current;
    if (video) video.currentTime -= 10;
  };

  const nextLecture = () => {
    const currentIndex = lectures.findIndex((l) => l.id === currentLecture.id);
    const nextIndex = (currentIndex + 1) % lectures.length;
    onLectureChange(lectures[nextIndex].id);
  };

  const prevLecture = () => {
    const currentIndex = lectures.findIndex((l) => l.id === currentLecture.id);
    const prevIndex = (currentIndex - 1 + lectures.length) % lectures.length;
    onLectureChange(lectures[prevIndex].id);
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes < 10 ? "0" + minutes : minutes}:${
      seconds < 10 ? "0" + seconds : seconds
    }`;
  };

  return (
    <div
      ref={containerRef}
      className="bg-black text-white rounded-lg overflow-hidden"
    >
      <video
        key={currentLecture.id}
        ref={videoRef}
        src={currentLecture.videoUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={(e) => setDuration(e.target.duration)}
        className="w-full h-auto bg-black"
        controls={false}
      />

      {/* Controls */}
      <div className="bg-black bg-opacity-70 p-3 flex flex-col space-y-2">
        <h2 className="text-lg font-semibold">{currentLecture.title}</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={prevLecture}
            className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600"
          >
            ⏮ Prev
          </button>
          <button
            onClick={rewind}
            className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600"
          >
            ⏪ 10s
          </button>
          <button
            onClick={togglePlay}
            className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700"
          >
            {isPlaying ? "⏸ Pause" : "▶ Play"}
          </button>
          <button
            onClick={forward}
            className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600"
          >
            10s ⏩
          </button>
          <button
            onClick={nextLecture}
            className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600"
          >
            ⏭ Next
          </button>
          <span className="text-sm">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleSeek}
          className="w-full"
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleMute}
              className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600"
            >
              {isMuted ? "🔇" : "🔊"}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolume}
              className="w-28"
            />
          </div>

          <div>
            <label className="mr-2">Speed</label>
            <select
              value={playbackRate}
              onChange={handleSpeedChange}
              className="bg-gray-800 p-1 rounded"
            >
              <option value="0.5">0.5x</option>
              <option value="1">1x</option>
              <option value="1.25">1.25x</option>
              <option value="1.5">1.5x</option>
              <option value="2">2x</option>
            </select>
          </div>

          <button
            onClick={toggleFullscreen}
            className="px-3 py-1 bg-green-600 rounded hover:bg-green-700"
          >
            ⛶ {isFullscreen ? "Exit" : "Fullscreen"}
          </button>
        </div>

        {/* Playlist inside player */}
        <div className="bg-gray-900 text-white p-3 space-y-2 mt-2">
          <h3 className="text-lg font-semibold">Lectures Playlist</h3>
          {lectures.map((lec) => (
            <div
              key={lec.id}
              onClick={() => onLectureChange(lec.id)}
              className={`p-2 rounded cursor-pointer hover:bg-gray-700 ${
                lec.id === currentLecture.id ? "bg-blue-600" : ""
              }`}
            >
              {lec.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Player;
