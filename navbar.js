// Navbar Component
class Navbar extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
      <nav>
        <ul class="navbar">
          <li>
            <img src="images/logo1.png" alt="UW Social Logo" class="logo">
          </li>
          <li><a href="index.html">🏠 HOME</a></li>
          <li><a href="events.html">🎪 Events</a></li>
          <li><a href="publish.html">🚀 Publish New</a></li>
          <li><a href="achievements.html">🏆 Achievements</a></li>
          <li id="auth-buttons">
            <a href="#" onclick="googleLogin(); return false;">🔑 Login</a>
          </li>
          <li id="user-profile" style="display: none;">
            <a href="profile.html">🧍 Profile</a>
          </li>
        </ul>
      </nav>

      <!-- User Info Display -->
      <div id="user-info" style="display: none; position: fixed; top: 80px; right: 20px; background: white; padding: 10px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
        <p>Welcome, <span id="user-name"></span>!</p>
        <a href="#" onclick="logout(); return false;" class="logout-link">Logout</a>
      </div>
    `;
  }
}

// Auth functions
function googleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();
  
  // Add scopes if needed
  provider.addScope('https://www.googleapis.com/auth/userinfo.email');
  provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
  
  // Set custom parameters
  provider.setCustomParameters({
    prompt: 'select_account'
  });

  firebase.auth().signInWithPopup(provider)
    .then((result) => {
      const user = result.user;
      console.log('Login successful:', user);
      document.getElementById('user-name').textContent = user.displayName;
    })
    .catch((error) => {
      console.error('Login failed:', error);
      let errorMessage = 'Login failed: ';
      
      switch (error.code) {
        case 'auth/popup-blocked':
          errorMessage += 'Popup was blocked by the browser. Please allow popups for this site.';
          break;
        case 'auth/popup-closed-by-user':
          errorMessage += 'Login was cancelled.';
          break;
        case 'auth/cancelled-popup-request':
          errorMessage += 'Another login attempt is in progress.';
          break;
        case 'auth/network-request-failed':
          errorMessage += 'Network error. Please check your internet connection.';
          break;
        default:
          errorMessage += error.message;
      }
      
      alert(errorMessage);
    });
}

function logout() {
  firebase.auth().signOut()
    .then(() => {
      console.log('Logout successful');
    })
    .catch((error) => {
      console.error('Logout failed:', error);
    });
}

// Monitor auth state
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    document.getElementById('auth-buttons').style.display = 'none';
    document.getElementById('user-profile').style.display = 'block';
    document.getElementById('user-info').style.display = 'block';
    document.getElementById('user-name').textContent = user.displayName;
  } else {
    document.getElementById('auth-buttons').style.display = 'block';
    document.getElementById('user-profile').style.display = 'none';
    document.getElementById('user-info').style.display = 'none';
  }
});

// 确保 Firebase 初始化完成后再注册导航栏组件
function initializeNavbar() {
  if (firebase.apps.length > 0 && !customElements.get('nav-bar')) {
    customElements.define('nav-bar', Navbar);
  } else {
    // 如果 Firebase 还没有初始化完成，等待一下再试
    setTimeout(initializeNavbar, 100);
  }
}

// 开始初始化
initializeNavbar(); 