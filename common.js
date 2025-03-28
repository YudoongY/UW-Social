// 加载 Firebase SDK
function loadFirebaseSDK() {
  return new Promise((resolve, reject) => {
    // 检查是否已经加载
    if (window.firebase) {
      resolve();
      return;
    }

    // 加载 Firebase SDK
    const scripts = [
      'https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js',
      'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js',
      'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js'
    ];

    let loaded = 0;
    scripts.forEach(src => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        loaded++;
        if (loaded === scripts.length) {
          resolve();
        }
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  });
}

// 加载应用配置
function loadAppConfig() {
  return new Promise((resolve, reject) => {
    // 检查是否已经加载
    if (window.appConfig) {
      resolve();
      return;
    }

    // 加载配置文件
    const script = document.createElement('script');
    script.src = 'config.js';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// 初始化 Firebase
function initializeFirebase() {
  return new Promise((resolve, reject) => {
    // 检查是否已经初始化
    if (firebase.apps.length > 0) {
      resolve();
      return;
    }

    // 加载 Firebase 配置
    const script = document.createElement('script');
    script.src = 'firebase-config.js';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// 加载用户数据
function loadUserData() {
  return new Promise((resolve, reject) => {
    // 检查是否已经加载
    if (window.userData) {
      resolve();
      return;
    }

    // 加载用户数据
    const script = document.createElement('script');
    script.src = 'user-data.js';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// 加载导航栏
function loadNavbar() {
  return new Promise((resolve, reject) => {
    // 检查是否已经加载
    if (customElements.get('nav-bar')) {
      resolve();
      return;
    }

    // 加载导航栏
    const script = document.createElement('script');
    script.src = 'navbar.js';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// 初始化所有依赖
async function initializeDependencies() {
  try {
    await loadFirebaseSDK();
    await loadAppConfig();
    await initializeFirebase();
    await loadUserData();
    await loadNavbar();
  } catch (error) {
    console.error('Failed to initialize dependencies:', error);
  }
}

// 当 DOM 加载完成后初始化
document.addEventListener('DOMContentLoaded', initializeDependencies); 