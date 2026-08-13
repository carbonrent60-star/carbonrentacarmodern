"use client";

import {
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";

type CarbonVideoProps = {
  src: string;
  className?: string;
  title?: string;
};

function formatTime(value: number) {
  if (!Number.isFinite(value) || value < 0) return "0:00";

  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function CarbonVideo({
  src,
  className = "",
  title = "Carbon video",
}: CarbonVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [muted, setMuted] = useState(false);
  const [poster, setPoster] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleExternalPlay = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail;

      if (detail !== src && !video.paused) {
        video.pause();
      }
    };

    window.addEventListener("carbon-video-play", handleExternalPlay);

    return () => {
      window.removeEventListener("carbon-video-play", handleExternalPlay);
    };
  }, [src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;
    let generated = false;

    const capturePoster = () => {
      if (
        cancelled ||
        generated ||
        !video.videoWidth ||
        !video.videoHeight
      ) {
        return;
      }

      try {
        const canvas = document.createElement("canvas");

        const maxWidth = 1280;
        const scale = Math.min(1, maxWidth / video.videoWidth);

        canvas.width = Math.max(
          1,
          Math.round(video.videoWidth * scale)
        );

        canvas.height = Math.max(
          1,
          Math.round(video.videoHeight * scale)
        );

        const context = canvas.getContext("2d");

        if (!context) return;

        context.drawImage(
          video,
          0,
          0,
          canvas.width,
          canvas.height
        );

        const image = canvas.toDataURL("image/jpeg", 0.86);

        generated = true;
        setPoster(image);
      } catch {
        // Video itself remains the fallback.
      }
    };

    const seekForPoster = () => {
      if (
        cancelled ||
        generated ||
        !Number.isFinite(video.duration) ||
        video.duration <= 0
      ) {
        return;
      }

      const target = Math.min(
        Math.max(video.duration * 0.12, 0.45),
        Math.max(video.duration - 0.1, 0)
      );

      if (Math.abs(video.currentTime - target) < 0.05) {
        capturePoster();
        return;
      }

      try {
        video.currentTime = target;
      } catch {
        // Ignore seek failures and retain video fallback.
      }
    };

    const onLoadedMetadata = () => {
      setDuration(video.duration || 0);
      seekForPoster();
    };

    const onLoadedData = () => {
      setReady(true);

      if (!generated) {
        if (
          Number.isFinite(video.duration) &&
          video.duration > 0 &&
          video.currentTime < 0.1
        ) {
          seekForPoster();
        } else {
          capturePoster();
        }
      }
    };

    const onSeeked = () => {
      if (!generated && !started) {
        capturePoster();
      }
    };

    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("loadeddata", onLoadedData);
    video.addEventListener("seeked", onSeeked);

    if (video.readyState >= 1) {
      onLoadedMetadata();
    }

    if (video.readyState >= 2) {
      onLoadedData();
    }

    return () => {
      cancelled = true;

      video.removeEventListener(
        "loadedmetadata",
        onLoadedMetadata
      );

      video.removeEventListener(
        "loadeddata",
        onLoadedData
      );

      video.removeEventListener("seeked", onSeeked);
    };
  }, [src, started]);

  const playVideo = async () => {
    const video = videoRef.current;
    if (!video) return;

    setStarted(true);

    window.dispatchEvent(
      new CustomEvent("carbon-video-play", {
        detail: src,
      })
    );

    try {
      await video.play();
    } catch {
      // Browser can reject playback in unusual environments.
    }
  };

  const togglePlay = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      await playVideo();
    } else {
      video.pause();
    }
  };

  const toggleMute = (
    event: ReactMouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();

    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setMuted(video.muted);
  };

  const seek = (
    event: ReactPointerEvent<HTMLDivElement>
  ) => {
    event.stopPropagation();

    const video = videoRef.current;
    if (!video || !duration) return;

    const rect =
      event.currentTarget.getBoundingClientRect();

    const ratio = Math.min(
      1,
      Math.max(
        0,
        (event.clientX - rect.left) / rect.width
      )
    );

    video.currentTime = ratio * duration;
    setCurrentTime(video.currentTime);
  };

  const handlePointerMove = (
    event: ReactPointerEvent<HTMLDivElement>
  ) => {
    if (event.pointerType !== "mouse") return;

    const frame = frameRef.current;
    if (!frame) return;

    const rect = frame.getBoundingClientRect();

    const x =
      (event.clientX - rect.left) / rect.width - 0.5;

    const y =
      (event.clientY - rect.top) / rect.height - 0.5;

    frame.style.setProperty("--video-x", `${x * 7}px`);
    frame.style.setProperty("--video-y", `${y * 7}px`);

    frame.style.setProperty(
      "--glow-x",
      `${((x + 0.5) * 100).toFixed(2)}%`
    );

    frame.style.setProperty(
      "--glow-y",
      `${((y + 0.5) * 100).toFixed(2)}%`
    );
  };

  const resetPointer = () => {
    const frame = frameRef.current;
    if (!frame) return;

    frame.style.setProperty("--video-x", "0px");
    frame.style.setProperty("--video-y", "0px");
    frame.style.setProperty("--glow-x", "50%");
    frame.style.setProperty("--glow-y", "50%");
  };

  const progress =
    duration > 0
      ? Math.min(100, (currentTime / duration) * 100)
      : 0;

  return (
    <div
      ref={frameRef}
      className={`carbon-video ${className}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
      data-playing={playing ? "true" : "false"}
      data-started={started ? "true" : "false"}
      data-ready={ready ? "true" : "false"}
    >
      <button
        type="button"
        className="carbon-video-surface"
        onClick={togglePlay}
        aria-label={
          playing ? `${title} videonu dayandır` : `${title} videonu oynat`
        }
      >
        <div className="carbon-video-media">
          <video
            ref={videoRef}
            src={src}
            playsInline
            preload="metadata"
            muted={muted}
            poster={poster || undefined}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => {
              setPlaying(false);
              setCurrentTime(0);
            }}
            onTimeUpdate={(event) =>
              setCurrentTime(event.currentTarget.currentTime)
            }
            onDurationChange={(event) =>
              setDuration(event.currentTarget.duration || 0)
            }
          />

          {poster && !started && (
            <img
              className="carbon-video-poster"
              src={poster}
              alt=""
              draggable={false}
            />
          )}
        </div>

        <span className="carbon-video-shade" />
        <span className="carbon-video-reflection" />

        <span className="carbon-video-center">
          <span className="carbon-video-play">
            {playing ? (
              <Pause size={20} strokeWidth={1.7} />
            ) : (
              <Play
                size={21}
                strokeWidth={1.7}
                fill="currentColor"
              />
            )}
          </span>
        </span>
      </button>

      <div className="carbon-video-controls">
        <div
          className="carbon-video-progress"
          role="slider"
          tabIndex={0}
          aria-label="Video gedişatı"
          aria-valuemin={0}
          aria-valuemax={Math.max(duration, 0)}
          aria-valuenow={Math.max(currentTime, 0)}
          onPointerDown={seek}
          onKeyDown={(event) => {
            const video = videoRef.current;
            if (!video) return;

            if (event.key === "ArrowRight") {
              event.preventDefault();
              video.currentTime = Math.min(
                duration,
                video.currentTime + 5
              );
            }

            if (event.key === "ArrowLeft") {
              event.preventDefault();
              video.currentTime = Math.max(
                0,
                video.currentTime - 5
              );
            }
          }}
        >
          <span className="carbon-video-progress-track" />

          <span
            className="carbon-video-progress-fill"
            style={{ width: `${progress}%` }}
          />

          <span
            className="carbon-video-progress-knob"
            style={{ left: `${progress}%` }}
          />
        </div>

        <div className="carbon-video-meta">
          <button
            type="button"
            className="carbon-video-control-button"
            onClick={togglePlay}
            aria-label={playing ? "Dayandır" : "Oynat"}
          >
            {playing ? (
              <Pause size={14} />
            ) : (
              <Play size={14} fill="currentColor" />
            )}
          </button>

          <span className="carbon-video-time">
            {formatTime(currentTime)}
            <i>/</i>
            {formatTime(duration)}
          </span>

          <button
            type="button"
            className="carbon-video-control-button carbon-video-volume"
            onClick={toggleMute}
            aria-label={muted ? "Səsi aç" : "Səsi bağla"}
          >
            {muted ? (
              <VolumeX size={15} />
            ) : (
              <Volume2 size={15} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
