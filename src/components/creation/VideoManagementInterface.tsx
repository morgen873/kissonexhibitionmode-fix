import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { VideoRetriever, VideoFile } from '@/utils/videoRetriever';
import { VideoUploader } from '@/utils/videoUploader';
import { Upload, Play, Trash2, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/EnhancedAnimations';
import VideoTransition from './VideoTransition';

interface VideoManagementInterfaceProps {
  onVideoSelect?: (videoUrl: string) => void;
  onTestTransition?: (videoUrl: string) => void;
}

const VideoManagementInterface: React.FC<VideoManagementInterfaceProps> = ({
  onVideoSelect,
  onTestTransition
}) => {
  const [availableVideos, setAvailableVideos] = useState<VideoFile[]>([]);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isTestingTransition, setIsTestingTransition] = useState(false);
  const [testVideoUrl, setTestVideoUrl] = useState<string>('');

  const loadVideos = async () => {
    setIsLoading(true);
    try {
      const videos = await VideoRetriever.getAvailableVideos();
      setAvailableVideos(videos);
    } catch (error) {
      console.error('Failed to load videos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadVideos();
  }, []);

  const handleFileSelect = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);
    
    try {
      const bucketExists = await VideoUploader.ensureBucketExists();
      if (!bucketExists) {
        throw new Error('Failed to create video storage bucket');
      }

      const result = await VideoUploader.uploadVideo(file);
      
      if (result.error) {
        setUploadError(result.error);
      } else {
        console.log('Video uploaded successfully:', result.url);
        await loadVideos(); // Refresh the list
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Failed to upload video. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteVideo = async (fileName: string) => {
    setIsDeleting(fileName);
    try {
      const success = await VideoRetriever.deleteVideo(fileName);
      if (success) {
        await loadVideos(); // Refresh the list
        if (selectedVideoUrl?.includes(fileName)) {
          setSelectedVideoUrl(null);
        }
      }
    } catch (error) {
      console.error('Failed to delete video:', error);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleVideoSelect = (videoUrl: string) => {
    setSelectedVideoUrl(videoUrl);
    onVideoSelect?.(videoUrl);
  };

  const handleTestTransition = (videoUrl: string) => {
    setTestVideoUrl(videoUrl);
    setIsTestingTransition(true);
    onTestTransition?.(videoUrl);
  };

  const handleTransitionComplete = () => {
    setIsTestingTransition(false);
    setTestVideoUrl('');
  };

  const formatFileSize = (bytes: number) => {
    return VideoRetriever.formatFileSize(bytes);
  };

  const getVideoType = (fileName: string) => {
    if (fileName.toLowerCase().includes('step')) return 'Creation Step';
    if (fileName.toLowerCase().includes('kisson')) return 'Intro Transition';
    return 'Custom';
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="bg-black/90 border-green-400/30">
        <CardHeader>
          <CardTitle className="text-green-400 font-mono">Upload New Video</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <input
              type="file"
              accept="video/mp4,video/webm,video/ogg"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(file);
              }}
              className="hidden"
              id="video-upload"
            />
            <label
              htmlFor="video-upload"
              className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 ${
                isUploading
                  ? 'border-yellow-400 bg-yellow-400/10'
                  : 'border-green-400/50 hover:border-green-400 hover:bg-green-400/5'
              }`}
            >
              {isUploading ? (
                <div className="flex flex-col items-center space-y-2">
                  <LoadingSpinner size="lg" variant="spin" />
                  <p className="text-yellow-400 font-mono">Uploading...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-2">
                  <Upload className="w-8 h-8 text-green-400" />
                  <p className="text-green-400 font-mono">Click to upload MP4 video</p>
                  <p className="text-green-400/70 font-mono text-xs">Max 50MB</p>
                </div>
              )}
            </label>

            {uploadError && (
              <div className="flex items-center space-x-2 text-red-400 bg-red-400/10 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                <p className="font-mono text-sm">{uploadError}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Video Library */}
      <Card className="bg-black/90 border-green-400/30">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-green-400 font-mono">Video Library</CardTitle>
          <Button
            onClick={loadVideos}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="border-green-400/50 text-green-400 hover:bg-green-400/10"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner size="lg" variant="spin" />
            </div>
          ) : availableVideos.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-green-400/70 font-mono">No videos found</p>
              <p className="text-green-400/50 font-mono text-sm">Upload some videos to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {availableVideos.map((video) => (
                <div
                  key={video.name}
                  className={`border rounded-lg p-4 transition-all duration-200 ${
                    selectedVideoUrl === video.url
                      ? 'border-green-400 bg-green-400/10'
                      : 'border-green-400/30 hover:border-green-400/50'
                  }`}
                >
                  <div className="flex items-start justify-between space-x-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-green-400 font-mono text-sm font-medium truncate">
                          {video.name}
                        </h3>
                        <Badge variant="outline" className="text-xs border-green-400/50 text-green-400">
                          {getVideoType(video.name)}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-green-400/70 font-mono">
                        <span>{formatFileSize(video.size)}</span>
                        <span>{new Date(video.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => handleVideoSelect(video.url)}
                        size="sm"
                        variant={selectedVideoUrl === video.url ? "default" : "outline"}
                        className={
                          selectedVideoUrl === video.url
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : "border-green-400/50 text-green-400 hover:bg-green-400/10"
                        }
                      >
                        {selectedVideoUrl === video.url ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          'Select'
                        )}
                      </Button>
                      
                      <Button
                        onClick={() => handleTestTransition(video.url)}
                        size="sm"
                        variant="outline"
                        className="border-blue-400/50 text-blue-400 hover:bg-blue-400/10"
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        onClick={() => handleDeleteVideo(video.name)}
                        disabled={isDeleting === video.name}
                        size="sm"
                        variant="outline"
                        className="border-red-400/50 text-red-400 hover:bg-red-400/10"
                      >
                        {isDeleting === video.name ? (
                          <LoadingSpinner size="sm" variant="spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selected Video Info */}
      {selectedVideoUrl && (
        <Card className="bg-black/90 border-blue-400/30">
          <CardHeader>
            <CardTitle className="text-blue-400 font-mono">Selected Video</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-blue-400/70 font-mono text-xs break-all">
                {selectedVideoUrl}
              </p>
              <div className="flex space-x-2">
                <Button
                  onClick={() => handleTestTransition(selectedVideoUrl)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-mono"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Test Transition
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Video Transition Test */}
      <VideoTransition
        videoUrl={testVideoUrl}
        isVisible={isTestingTransition}
        onComplete={handleTransitionComplete}
        duration={2000}
        fallbackVariant="geometric"
      />
    </div>
  );
};

export default VideoManagementInterface;