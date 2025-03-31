function showSection(sectionId) {
    // 隐藏所有内容
    document.querySelectorAll('.profile-section').forEach(section => {
      section.classList.add('hidden');
    });
  
    // 显示选中的内容
    document.getElementById(sectionId).classList.remove('hidden');
  }

  document.addEventListener("DOMContentLoaded", function () {
    let eventsPosted = 3; // 假设用户已发布 3 个活动
    let friendsMade = 5; // 假设用户交了 5 个新朋友
  
    let achievementsContainer = document.querySelector(".achievements");
  
    if (eventsPosted >= 3) {
      let badge = document.createElement("div");
      badge.classList.add("achievement-badge");
      badge.innerHTML = `<img src="images/logo.png"><p>🎉 你已发布 3 个活动！</p>`;
      achievementsContainer.appendChild(badge);
    }
  
    if (friendsMade >= 5) {
      let badge = document.createElement("div");
      badge.classList.add("achievement-badge");
      badge.innerHTML = `<img src="images/logo.png"><p>🤝 你已结交 5 位新朋友！</p>`;
      achievementsContainer.appendChild(badge);
    }
  });