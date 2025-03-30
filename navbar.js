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
          <li><a href="profile.html">🧑‍🎓 Me</a></li>
          
          <li id="auth-buttons" class="login-item">
            <a href="#" onclick="googleLogin(); return false;" class="login-link"> 🔑 Login</a>
          </li>

          <li id="user-profile" style="display: none;">
            <a href="profile.html">🧍 Profile</a>
          </li>
        </ul>
      </nav>
      <div class="header-space"></div>
      
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
  
  provider.addScope('https://www.googleapis.com/auth/userinfo.email');
  provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
  
  provider.setCustomParameters({
    prompt: 'select_account'
  });

  firebase.auth().signInWithPopup(provider)
    .then((result) => {
      const user = result.user;
      console.log('Login successful:', user);
      document.getElementById('user-name').textContent = user.displayName;
      
      // 准备要发送到后端的用户数据
      const userData = {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        // 将当前时间转换为 ISO 字符串格式
        lastLogin: new Date().toISOString()
      };

      // 调用后端 API，将用户数据保存到 MySQL 数据库中
      fetch('http://localhost:8080/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })
      .then(response => response.json())
      .then(data => {
        console.log('User data stored in backend:', data);
      })
      .catch(error => {
        console.error('Error storing user data:', error);
      });
      
    })
    .catch((error) => {
      console.error('Login failed:', error);
      alert('Login failed: ' + error.message);
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

// 注册导航栏组件
if (!customElements.get('nav-bar')) {
  customElements.define('nav-bar', Navbar);
}