
export const testImageAccess = async (imageUrl: string) => {
  console.log('🧪 ENHANCED IMAGE ACCESS TEST');
  console.log('Testing URL:', imageUrl);
  
  try {
    // Test 1: Basic fetch with HEAD request
    console.log('📡 Test 1: HEAD request...');
    const headResponse = await fetch(imageUrl, { 
      method: 'HEAD',
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });
    
    console.log('HEAD Response:', {
      status: headResponse.status,
      statusText: headResponse.statusText,
      ok: headResponse.ok,
      headers: Object.fromEntries(headResponse.headers.entries())
    });
    
    if (headResponse.ok) {
      console.log('✅ HEAD request successful');
    } else {
      console.log('❌ HEAD request failed');
    }
    
    // Test 2: CORS test
    console.log('📡 Test 2: CORS test with GET request...');
    try {
      const getResponse = await fetch(imageUrl, {
        method: 'GET',
        signal: AbortSignal.timeout(10000)
      });
      
      console.log('GET Response:', {
        status: getResponse.status,
        statusText: getResponse.statusText,
        ok: getResponse.ok,
        type: getResponse.type,
        headers: Object.fromEntries(getResponse.headers.entries())
      });
      
      if (getResponse.ok) {
        console.log('✅ CORS test successful');
        const contentLength = getResponse.headers.get('content-length');
        if (contentLength) {
          console.log('📏 Content size:', Math.round(parseInt(contentLength) / 1024), 'KB');
        }
      } else {
        console.log('❌ CORS test failed');
      }
    } catch (corsError) {
      console.log('❌ CORS test error:', corsError.message);
    }
    
    // Test 3: Image loading test
    console.log('📡 Test 3: Browser image loading test...');
    return new Promise((resolve) => {
      const testImg = new Image();
      
      testImg.onload = () => {
        console.log('✅ Browser image loading successful');
        console.log('Image dimensions:', {
          width: testImg.naturalWidth,
          height: testImg.naturalHeight
        });
        resolve(true);
      };
      
      testImg.onerror = (error) => {
        console.log('❌ Browser image loading failed:', error);
        resolve(false);
      };
      
      // Add timeout for image loading
      setTimeout(() => {
        console.log('⏰ Image loading test timeout');
        resolve(false);
      }, 15000);
      
      testImg.src = imageUrl;
    });
    
  } catch (error) {
    console.log('❌ Image access test failed:', error.message);
    console.log('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    return false;
  }
};

export const debugImageLoad = (imgElement: HTMLImageElement, url: string) => {
  console.log('🔍 ENHANCED IMAGE LOAD DEBUG');
  console.log('Image element debug info:', {
    src: imgElement.src,
    alt: imgElement.alt,
    naturalWidth: imgElement.naturalWidth,
    naturalHeight: imgElement.naturalHeight,
    width: imgElement.width,
    height: imgElement.height,
    complete: imgElement.complete,
    currentSrc: imgElement.currentSrc,
    loading: imgElement.loading
  });
  
  console.log('Expected URL:', url);
  console.log('Actual src:', imgElement.src);
  console.log('URLs match:', imgElement.src === url);
  
  // Additional browser compatibility info
  console.log('Browser info:', {
    userAgent: navigator.userAgent,
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine
  });
  
  // Network timing if available
  if ('connection' in navigator) {
    const connection = (navigator as any).connection;
    console.log('Connection info:', {
      effectiveType: connection?.effectiveType,
      downlink: connection?.downlink,
      rtt: connection?.rtt
    });
  }
};
