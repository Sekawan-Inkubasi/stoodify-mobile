import React, { useRef, useState, useEffect } from 'react';
import { X, Camera, RefreshCw, AlertCircle } from 'lucide-react';
import { TaskAttachment } from '../../types';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (attachment: TaskAttachment) => void;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [hasError, setHasError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Start camera stream when modal opens
  useEffect(() => {
    if (!isOpen) {
      stopStream();
      return;
    }

    let currentStream: MediaStream | null = null;
    setIsLoading(true);
    setHasError(null);

    const startCamera = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Kamera tidak didukung pada browser ini.');
        }

        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        });

        currentStream = mediaStream;
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          await videoRef.current.play();
        }
        setIsLoading(false);
      } catch (err: any) {
        console.error('Camera access error:', err);
        setHasError(
          err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
            ? 'Izin kamera ditolak. Harap izinkan akses kamera di pengaturan browser.'
            : 'Gagal mengakses kamera perangkat. Gunakan opsi pilih file/galeri.'
        );
        setIsLoading(false);
      }
    };

    startCamera();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen, facingMode]);

  const stopStream = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const handleClose = () => {
    stopStream();
    onClose();
  };

  const toggleCamera = () => {
    stopStream();
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

    // Approximate size in MB
    const head = 'data:image/jpeg;base64,';
    const fileSizeInBytes = Math.round((dataUrl.length - head.length) * 3 / 4);
    const sizeFormatted = fileSizeInBytes < 1024 * 1024 
      ? `${(fileSizeInBytes / 1024).toFixed(1)} KB` 
      : `${(fileSizeInBytes / (1024 * 1024)).toFixed(1)} MB`;

    const now = new Date();
    const timestamp = `${now.getHours()}${now.getMinutes()}${now.getSeconds()}`;
    const filename = `foto-tugas-${timestamp}.jpg`;

    stopStream();
    onCapture({
      name: filename,
      sizeFormatted,
      type: 'image',
      previewUrl: dataUrl,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black flex flex-col justify-between select-none">
      {/* Top Bar */}
      <div className="p-4 flex items-center justify-between z-10 bg-gradient-to-b from-black/80 to-transparent">
        <button
          type="button"
          onClick={handleClose}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center cursor-pointer active:scale-90"
        >
          <X className="w-5 h-5" />
        </button>

        <span className="text-white text-xs font-semibold tracking-wide">
          Foto Lembar Soal / Tugas
        </span>

        <button
          type="button"
          onClick={toggleCamera}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center cursor-pointer active:scale-90"
          title="Putar Kamera"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Main Viewfinder */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-black">
        {isLoading && (
          <div className="text-white text-xs flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Menghubungkan ke kamera...</span>
          </div>
        )}

        {hasError ? (
          <div className="p-6 text-center text-white max-w-xs space-y-3">
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
            <p className="text-xs font-medium text-slate-200">{hasError}</p>
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-white text-slate-900 rounded-full text-xs font-bold"
            >
              Kembali
            </button>
          </div>
        ) : (
          <video
            ref={videoRef}
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        )}

        {/* Viewfinder frame overlay */}
        {!hasError && !isLoading && (
          <div className="absolute inset-8 border border-white/40 rounded-3xl pointer-events-none flex flex-col justify-between p-4">
            <div className="flex justify-between">
              <span className="w-4 h-4 border-t-2 border-l-2 border-[#0062FF]" />
              <span className="w-4 h-4 border-t-2 border-r-2 border-[#0062FF]" />
            </div>
            <div className="flex justify-between">
              <span className="w-4 h-4 border-b-2 border-l-2 border-[#0062FF]" />
              <span className="w-4 h-4 border-b-2 border-r-2 border-[#0062FF]" />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Shutter Controls */}
      <div className="p-6 pb-8 bg-black flex items-center justify-center z-10">
        {!hasError && (
          <button
            type="button"
            onClick={capturePhoto}
            className="w-18 h-18 rounded-full border-4 border-white p-1 flex items-center justify-center active:scale-95 transition-all cursor-pointer shadow-lg shadow-white/20"
          >
            <div className="w-full h-full bg-white rounded-full hover:bg-slate-100 flex items-center justify-center">
              <Camera className="w-6 h-6 text-slate-900" />
            </div>
          </button>
        )}
      </div>
    </div>
  );
};
