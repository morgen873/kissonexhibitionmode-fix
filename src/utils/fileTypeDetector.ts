export type TransitionFileType = 'gif' | 'mp4' | 'webm' | 'unknown';

export const detectTransitionFileType = (url: string): TransitionFileType => {
  if (!url) return 'unknown';
  
  const urlLower = url.toLowerCase();
  
  if (urlLower.includes('.gif')) return 'gif';
  if (urlLower.includes('.mp4')) return 'mp4';
  if (urlLower.includes('.webm')) return 'webm';
  
  return 'unknown';
};

export const isVideoFile = (fileType: TransitionFileType): boolean => {
  return fileType === 'mp4' || fileType === 'webm';
};