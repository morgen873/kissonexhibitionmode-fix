
import { supabase } from '@/integrations/supabase/client';

export interface VideoFile {
  name: string;
  url: string;
  size: number;
  created_at: string;
  updated_at: string;
}

export class VideoRetriever {
  private static readonly BUCKET_NAME = 'videos';

  static async getAvailableVideos(): Promise<VideoFile[]> {
    try {
      const { data: files, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list('', {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) {
        console.error('Error fetching videos:', error);
        return [];
      }

      if (!files || files.length === 0) {
        console.log('No videos found in bucket');
        return [];
      }

      // Filter for video files only and get public URLs
      const videoFiles: VideoFile[] = [];
      
      for (const file of files) {
        if (file.metadata && this.isVideoFile(file.name)) {
          const { data: urlData } = supabase.storage
            .from(this.BUCKET_NAME)
            .getPublicUrl(file.name);

          videoFiles.push({
            name: file.name,
            url: urlData.publicUrl,
            size: file.metadata.size || 0,
            created_at: file.created_at || '',
            updated_at: file.updated_at || ''
          });
        }
      }

      return videoFiles;
    } catch (error) {
      console.error('Failed to retrieve videos:', error);
      return [];
    }
  }

  static async deleteVideo(fileName: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([fileName]);

      if (error) {
        console.error('Error deleting video:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Failed to delete video:', error);
      return false;
    }
  }

  private static isVideoFile(fileName: string): boolean {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
    const extension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
    return videoExtensions.includes(extension);
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
