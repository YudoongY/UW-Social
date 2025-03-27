// 用户数据结构
class UserData {
    constructor(userId) {
        this.userId = userId;
        this.nickname = '';
        this.tags = [];
        this.achievements = [];
        this.holdingEvents = [];
        this.bio = '';
        this.profileImage = '';
        this.createdAt = new Date().toISOString();
        this.lastUpdated = new Date().toISOString();
    }
}

// 用户数据管理类
class UserDataManager {
    constructor() {
        this.db = firebase.database();
    }

    // 创建新用户数据
    async createUserData(userId) {
        const userData = new UserData(userId);
        try {
            await this.db.ref(`users/${userId}`).set(userData);
            return userData;
        } catch (error) {
            console.error('创建用户数据失败:', error);
            throw error;
        }
    }

    // 获取用户数据
    async getUserData(userId) {
        try {
            const snapshot = await this.db.ref(`users/${userId}`).once('value');
            return snapshot.val();
        } catch (error) {
            console.error('获取用户数据失败:', error);
            throw error;
        }
    }

    // 更新用户数据
    async updateUserData(userId, updates) {
        try {
            updates.lastUpdated = new Date().toISOString();
            await this.db.ref(`users/${userId}`).update(updates);
            return true;
        } catch (error) {
            console.error('更新用户数据失败:', error);
            throw error;
        }
    }

    // 添加标签
    async addTag(userId, tag) {
        try {
            const userRef = this.db.ref(`users/${userId}/tags`);
            await userRef.push(tag);
            return true;
        } catch (error) {
            console.error('添加标签失败:', error);
            throw error;
        }
    }

    // 添加成就
    async addAchievement(userId, achievement) {
        try {
            const userRef = this.db.ref(`users/${userId}/achievements`);
            await userRef.push({
                ...achievement,
                earnedDate: new Date().toISOString()
            });
            return true;
        } catch (error) {
            console.error('添加成就失败:', error);
            throw error;
        }
    }

    // 添加举办的活动
    async addHoldingEvent(userId, eventId) {
        try {
            const userRef = this.db.ref(`users/${userId}/holdingEvents`);
            await userRef.push(eventId);
            return true;
        } catch (error) {
            console.error('添加举办的活动失败:', error);
            throw error;
        }
    }
}

// 初始化用户数据管理器
const userDataManager = new UserDataManager();

// 监听用户登录状态
firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
        try {
            // 检查用户数据是否存在
            const userData = await userDataManager.getUserData(user.uid);
            if (!userData) {
                // 如果用户数据不存在，创建新用户数据
                await userDataManager.createUserData(user.uid);
            }
        } catch (error) {
            console.error('用户数据初始化失败:', error);
        }
    }
}); 