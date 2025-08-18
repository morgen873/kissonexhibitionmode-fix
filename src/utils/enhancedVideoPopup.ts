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
  private static detectScreens(): ScreenInfo[] {
    const screens: ScreenInfo[] = [];
    
    // Primary screen
    screens.push({
      width: screen.width,
      height: screen.height,
      availWidth: screen.availWidth,
      availHeight: screen.availHeight,
      left: 0,
      top: 0
    });

    // Try to detect secondary screens using Screen API if available
    if ('getScreenDetails' in window) {
      // Modern Screen API (experimental)
      try {
        (window as any).getScreenDetails().then((screenDetails: any) => {
          if (screenDetails.screens && screenDetails.screens.length > 1) {
            screenDetails.screens.forEach((screen: any, index: number) => {
              if (index > 0) { // Skip primary screen
                screens.push({
                  width: screen.width,
                  height: screen.height,
                  availWidth: screen.availWidth,
                  availHeight: screen.availHeight,
                  left: screen.left,
                  top: screen.top
                });
              }
            });
          }
        });
      } catch (error) {
        console.log('Screen API not available');
      }
    }

    return screens;
  }

  private static calculatePopupConfig(preferSecondaryScreen = true): PopupConfig {
    const screens = this.detectScreens();
    let targetScreen = screens[0]; // Default to primary

    // Use secondary screen if available and preferred
    if (preferSecondaryScreen && screens.length > 1) {
      targetScreen = screens[1];
    }

    // Calculate size (90% of screen)
    const width = Math.floor(targetScreen.availWidth * 0.9);
    const height = Math.floor(targetScreen.availHeight * 0.9);

    // Center on target screen
    const left = (targetScreen.left || 0) + Math.floor((targetScreen.availWidth - width) / 2);
    const top = (targetScreen.top || 0) + Math.floor((targetScreen.availHeight - height) / 2);

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
            max-width: 100%;
            max-height: 100%;
            width: auto;
            height: auto;
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
    recipeTitle: string, 
    preferSecondaryScreen = true
  ): Window | null {
    try {
      const config = this.calculatePopupConfig(preferSecondaryScreen);
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