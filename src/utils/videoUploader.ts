
import { supabase } from '@/integrations/supabase/client';

export interface VideoUploadResult {
  url: string;
  path: string;
  error?: string;
}

export class VideoUploader {
  private static readonly BUCKET_NAME = 'transition_videos';
  private static readonly MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
  private static readonly ALLOWED_TYPES = ['video/mp4', 'video/webm', 'video/ogg'];

  static async uploadVideo(
    videoFile: File,
    filename?: string
  ): Promise<VideoUploadResult> {
    try {
      // Validate file size
      if (videoFile.size > this.MAX_FILE_SIZE) {
        return { 
          url: '', 
          path: '', 
          error: 'Video file is too large. Maximum size is 50MB.' 
        };
      }

      // Validate file type
      if (!this.ALLOWED_TYPES.includes(videoFile.type)) {
        return { 
          url: '', 
          path: '', 
          error: 'Invalid video format. Supported formats: MP4, WebM, OGG.' 
        };
      }

      const timestamp = Date.now();
      const fileExtension = videoFile.name.split('.').pop();
      const path = `${filename || 'transition'}-${timestamp}.${fileExtension}`;

      console.log(`Uploading video: ${path}, Size: ${videoFile.size} bytes`);

      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(path, videoFile, {
          contentType: videoFile.type,
          upsert: true
        });

      if (error) {
        console.error('Video upload error:', error);
        return { url: '', path: '', error: error.message };
      }

      const { data: urlData } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(path);

      return {
        url: urlData.publicUrl,
        path: path,
      };

    } catch (error) {
      console.error('Video upload failed:', error);
      return { 
        url: '', 
        path: '', 
        error: 'Failed to upload video. Please try again.' 
      };
    }
  }

  static async ensureBucketExists(): Promise<boolean> {
    try {
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();
      
      if (listError) {
        console.error('Error listing buckets:', listError);
        return false;
      }

      const bucketExists = buckets?.some(bucket => bucket.id === this.BUCKET_NAME);
      
      if (!bucketExists) {
        const { error: createError } = await supabase.storage.createBucket(this.BUCKET_NAME, {
          public: true,
          allowedMimeTypes: this.ALLOWED_TYPES,
          fileSizeLimit: this.MAX_FILE_SIZE
        });

        if (createError) {
          console.error('Error creating video bucket:', createError);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Error ensuring bucket exists:', error);
      return false;
    }
  }
}
