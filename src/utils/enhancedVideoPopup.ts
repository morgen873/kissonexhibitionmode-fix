// Enhanced popup video utilities with fullscreen and multi-monitor support

interface ScreenInfo {
  width: number;
  height: number;
  availWidth: number;
  availHeight: number;
  left?: number;
  top?: number;
}

interface PopupConfig {
  width: number;
  height: number;
  left: number;
  top: number;
  features: string;
}

export class EnhancedVideoPopup {

  private static calculatePopupConfig(): PopupConfig {
    const screen = window.screen;
    
    // For 32-inch screens and large displays, use 16:9 aspect ratio
    // Calculate optimal size based on screen resolution
    let width: number, height: number;
    
    if (screen.availWidth >= 2560) {
      // Large 32-inch+ screens (4K or higher)
      width = Math.min(1920, Math.floor(screen.availWidth * 0.75));
      height = Math.floor(width * 9 / 16); // 16:9 aspect ratio
    } else if (screen.availWidth >= 1920) {
      // Standard large screens
      width = Math.min(1600, Math.floor(screen.availWidth * 0.8));
      height = Math.floor(width * 9 / 16);
    } else {
      // Smaller screens
      width = Math.floor(screen.availWidth * 0.85);
      height = Math.floor(width * 9 / 16);
    }
    
    // Ensure height doesn't exceed screen height
    if (height > screen.availHeight * 0.9) {
      height = Math.floor(screen.availHeight * 0.9);
      width = Math.floor(height * 16 / 9);
    }

    // Center on screen
    const left = Math.floor((screen.availWidth - width) / 2);
    const top = Math.floor((screen.availHeight - height) / 2);

    const features = [
      `width=${width}`,
      `height=${height}`,
      `left=${left}`,
      `top=${top}`,
      'resizable=yes',
      'scrollbars=no',
      'menubar=no',
      'toolbar=no',
      'location=no',
      'status=no'
    ].join(',');

    return { width, height, left, top, features };
  }

  private static createEnhancedVideoHTML(videoUrl: string, recipeTitle: string): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>360° Recipe Video - ${recipeTitle}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            background: #000;
            color: #fff;
            font-family: Arial, sans-serif;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            height: 100vh;
        }
        
        .video-container {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
        }
        
        video {
            width: 100%;
            height: 100%;
            object-fit: contain; /* Show entire video without cropping */
            background: #000;
        }
        
        .controls {
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 10px;
            background: rgba(0,0,0,0.7);
            padding: 10px 20px;
            border-radius: 25px;
            backdrop-filter: blur(10px);
        }
        
        .control-btn {
            background: rgba(255,255,255,0.2);
            border: 1px solid rgba(255,255,255,0.3);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.3s ease;
        }
        
        .control-btn:hover {
            background: rgba(255,255,255,0.3);
            transform: scale(1.05);
        }
        
        .title {
            position: absolute;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.7);
            padding: 10px 20px;
            border-radius: 20px;
            font-size: 18px;
            font-weight: bold;
            backdrop-filter: blur(10px);
        }
        
        .loading {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
        }
        
        .spinner {
            width: 50px;
            height: 50px;
            border: 3px solid rgba(255,255,255,0.3);
            border-top: 3px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .hidden {
            display: none;
        }
    </style>
</head>
<body>
    <div class="title">360° Recipe Video - ${recipeTitle}</div>
    
    <div class="loading" id="loading">
        <div class="spinner"></div>
        <p>Loading video...</p>
    </div>
    
    <div class="video-container">
        <video id="mainVideo" controls autoplay loop muted>
            <source src="${videoUrl}" type="video/mp4">
            <source src="${videoUrl}" type="video/webm">
            Your browser does not support the video tag.
        </video>
        
        <div class="controls">
            <button class="control-btn" onclick="toggleFullscreen()">⛶ Fullscreen</button>
            <button class="control-btn" onclick="togglePlay()">⏯ Play/Pause</button>
            <button class="control-btn" onclick="window.close()">✕ Close</button>
        </div>
    </div>

    <script>
        const video = document.getElementById('mainVideo');
        const loading = document.getElementById('loading');
        
        // Auto-enter fullscreen when video loads
        video.addEventListener('loadeddata', () => {
            loading.classList.add('hidden');
            setTimeout(() => {
                requestFullscreen();
            }, 500);
        });
        
        // Handle fullscreen changes
        document.addEventListener('fullscreenchange', () => {
            if (!document.fullscreenElement) {
                // Exited fullscreen
                console.log('Exited fullscreen');
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'Escape':
                    if (document.fullscreenElement) {
                        document.exitFullscreen();
                    } else {
                        window.close();
                    }
                    break;
                case ' ':
                    e.preventDefault();
                    togglePlay();
                    break;
                case 'f':
                case 'F':
                    toggleFullscreen();
                    break;
            }
        });
        
        function requestFullscreen() {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) {
                document.documentElement.msRequestFullscreen();
            }
        }
        
        function toggleFullscreen() {
            if (!document.fullscreenElement) {
                requestFullscreen();
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            }
        }
        
        function togglePlay() {
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        }
        
        // Error handling
        video.addEventListener('error', (e) => {
            loading.innerHTML = '<p>Error loading video. Please try again.</p>';
        });
    </script>
</body>
</html>`;
  }

  public static openEnhancedVideo(
    videoUrl: string, 
    recipeTitle: string
  ): Window | null {
    try {
      const config = this.calculatePopupConfig();
      const popup = window.open('', '_blank', config.features);
      
      if (!popup) {
        alert('Popup blocked! Please allow popups for this site and try again.');
        return null;
      }

      const htmlContent = this.createEnhancedVideoHTML(videoUrl, recipeTitle);
      popup.document.write(htmlContent);
      popup.document.close();
      popup.focus();
      
      return popup;
    } catch (error) {
      console.error('Error opening enhanced video popup:', error);
      return null;
    }
  }
}