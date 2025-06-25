
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VideoUploader } from '@/utils/videoUploader';
import { Upload, Play, AlertCircle, CheckCircle } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/EnhancedAnimations';

interface VideoUploadInterfaceProps {
  onVideoUploaded?: (videoUrl: string) => void;
  onTestTransition?: (videoUrl: string) => void;
}

const VideoUploadInterface: React.FC<VideoUploadInterfaceProps> = ({
  onVideoUploaded,
  onTestTransition
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    console.log('Selected file:', file.name, 'Size:', file.size, 'Type:', file.type);
    
    setIsUploading(true);
    setUploadError(null);
    
    try {
      // Ensure bucket exists first
      const bucketExists = await VideoUploader.ensureBucketExists();
      if (!bucketExists) {
        throw new Error('Failed to create video storage bucket');
      }

      const result = await VideoUploader.uploadVideo(file);
      
      if (result.error) {
        setUploadError(result.error);
      } else {
        console.log('Video uploaded successfully:', result.url);
        setUploadedVideoUrl(result.url);
        onVideoUploaded?.(result.url);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Failed to upload video. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    
    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const testTransition = () => {
    if (uploadedVideoUrl) {
      onTestTransition?.(uploadedVideoUrl);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-black/90 border-green-400/30">
      <CardHeader>
        <CardTitle className="text-center text-green-400 font-mono">
          Video Upload Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,video/webm,video/ogg"
          onChange={handleFileInputChange}
          className="hidden"
        />

        {/* Drop Zone */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer ${
            dragOver
              ? 'border-green-400 bg-green-400/10'
              : 'border-green-400/50 hover:border-green-400'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={triggerFileInput}
        >
          {isUploading ? (
            <div className="flex flex-col items-center space-y-2">
              <LoadingSpinner size="lg" variant="spin" />
              <p className="text-green-400 font-mono">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <Upload className="w-8 h-8 text-green-400" />
              <p className="text-green-400 font-mono text-sm">
                Drag & drop video or click to select
              </p>
              <p className="text-green-400/70 font-mono text-xs">
                MP4, WebM, OGG (max 50MB)
              </p>
            </div>
          )}
        </div>

        {/* Upload Status */}
        {uploadError && (
          <div className="flex items-center space-x-2 text-red-400 bg-red-400/10 p-3 rounded-lg">
            <AlertCircle className="w-4 h-4" />
            <p className="font-mono text-sm">{uploadError}</p>
          </div>
        )}

        {uploadedVideoUrl && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-green-400 bg-green-400/10 p-3 rounded-lg">
              <CheckCircle className="w-4 h-4" />
              <p className="font-mono text-sm">Video uploaded successfully!</p>
            </div>
            
            {/* Video Preview */}
            <video
              src={uploadedVideoUrl}
              controls
              className="w-full rounded-lg"
              style={{ maxHeight: '200px' }}
            >
              Your browser does not support video playback.
            </video>

            {/* Test Transition Button */}
            <Button
              onClick={testTransition}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-mono"
            >
              <Play className="w-4 h-4 mr-2" />
              Test as Transition
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VideoUploadInterface;
