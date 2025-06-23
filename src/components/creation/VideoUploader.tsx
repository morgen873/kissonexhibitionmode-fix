
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Video, X } from 'lucide-react';

interface VideoUploaderProps {
  onVideoUpload: (videoUrl: string) => void;
  onVideoRemove: (videoUrl: string) => void;
  uploadedVideos: string[];
}

const VideoUploader: React.FC<VideoUploaderProps> = ({
  onVideoUpload,
  onVideoRemove,
  uploadedVideos
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('video/mp4')) {
      alert('Please select an MP4 video file');
      return;
    }

    // Validate file size (limit to 50MB)
    if (file.size > 50 * 1024 * 1024) {
      alert('Video file must be smaller than 50MB');
      return;
    }

    setUploading(true);
    try {
      // Create object URL for the video
      const videoUrl = URL.createObjectURL(file);
      onVideoUpload(videoUrl);
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('Failed to upload video');
    } finally {
      setUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveVideo = (videoUrl: string) => {
    URL.revokeObjectURL(videoUrl); // Clean up object URL
    onVideoRemove(videoUrl);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Transition Videos</h3>
        <Button
          onClick={handleUploadClick}
          disabled={uploading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Upload className="w-4 h-4 mr-2" />
          {uploading ? 'Uploading...' : 'Add Video'}
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4"
        onChange={handleFileSelect}
        className="hidden"
      />

      {uploadedVideos.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {uploadedVideos.map((videoUrl, index) => (
            <Card key={index} className="relative bg-black/20 border-white/20">
              <CardContent className="p-3">
                <div className="relative">
                  <video
                    src={videoUrl}
                    className="w-full h-20 object-cover rounded"
                    muted
                    playsInline
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded">
                    <Video className="w-6 h-6 text-white" />
                  </div>
                  <Button
                    onClick={() => handleRemoveVideo(videoUrl)}
                    className="absolute -top-2 -right-2 w-6 h-6 p-0 bg-red-600 hover:bg-red-700 rounded-full"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {uploadedVideos.length === 0 && (
        <Card className="border-dashed border-white/30 bg-black/10">
          <CardContent className="p-6 text-center">
            <Video className="w-12 h-12 text-white/50 mx-auto mb-3" />
            <p className="text-white/70 text-sm">
              No transition videos uploaded yet.<br />
              Click "Add Video" to upload MP4 files.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VideoUploader;
