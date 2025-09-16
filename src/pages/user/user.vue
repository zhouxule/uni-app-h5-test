<template>
	<view class="user-center-container">
		<view class="navbar">
			<view class="back-btn" @click="goBack">&lt;</view>
			<view class="navbar-title">个人中心</view>
			<view class="placeholder"></view> </view>

		<view class="profile-section">
			<image 
				class="avatar" 
				:src="userInfo.avatar || defaultAvatar" 
				@click="changeAvatar"
				mode="aspectFill"
			></image>
			<text class="username">{{ userInfo.username || '请设置昵称' }}</text>
		</view>

		<view class="info-list">
			<view class="info-item" @click="navigateToEdit">
				<text class="label">手机号</text>
				<text class="value">{{ userInfo.phone || '未绑定' }}</text>
			</view>
			<view class="info-item" @click="navigateToEdit">
				<text class="label">性别</text>
				<text class="value">{{ userInfo.gender || '未设置' }}</text>
			</view>
			<view class="info-item" @click="navigateToEdit">
				<text class="label">生日</text>
				<text class="value">{{ userInfo.birthday || '未设置' }}</text>
			</view>
			<view class="info-item" @click="navigateToChangePassword">
				<text class="label">修改密码</text>
				<text class="arrow">&gt;</text>
			</view>
		</view>

		<view class="logout-btn-wrapper">
			<button class="logout-btn" @click="handleLogout">退出登录</button>
		</view>

	</view>
</template>

<script setup>
import { reactive, onMounted } from 'vue';

// 默认头像路径
const defaultAvatar = '/static/default-avatar.png';

// 用户信息
const userInfo = reactive({
	avatar: '',
	username: '',
	phone: '',
	gender: '',
	birthday: ''
});

// 页面加载时获取用户信息
onMounted(() => {
	fetchUserProfile();
});

// 获取用户个人资料 (模拟API)
const fetchUserProfile = () => {
	console.log("正在获取用户资料...");
	uni.showLoading({ title: '加载中...' });
	// --- API 调用点 (1): 获取用户资料 ---
	// 在这里通过 uni.request 请求后端接口获取用户信息
	setTimeout(() => {
		const mockData = {
			avatar: '', // 故意留空来测试默认头像
			username: 'Gemini-User',
			phone: '188****8888',
			gender: '保密',
			birthday: '2000-01-01'
		};
		Object.assign(userInfo, mockData);
		uni.hideLoading();
	}, 1000);
};

// 更换头像
const changeAvatar = () => {
	uni.chooseImage({
		count: 1,
		sizeType: ['compressed'],
		sourceType: ['album', 'camera'],
		success: (res) => {
			const tempFilePath = res.tempFilePaths[0];
			console.log('选择的图片路径:', tempFilePath);
			
			// --- API 调用点 (2): 上传新头像 ---
			// 在这里使用 uni.uploadFile 将图片上传到服务器
			uni.showLoading({ title: '上传中...' });
			// 模拟上传成功
			setTimeout(() => {
				// 假设服务器返回了新的头像URL
				const newAvatarUrl = tempFilePath; // 实际场景应为服务器返回的URL
				userInfo.avatar = newAvatarUrl;
				uni.hideLoading();
				uni.showToast({ title: '头像更新成功', icon: 'success' });
			}, 1500);
		}
	});
};

// 新增跳转到编辑页的方法
const navigateToEdit = () => {
    uni.navigateTo({
        url: '/pages/user/edit?mode=edit' // <-- 携带模式参数
    });
};

// 跳转到修改密码页面
const navigateToChangePassword = () => {
	uni.navigateTo({
		url: '/pages/password/change' // 假设的修改密码页面路径
	});
};

// 退出登录
const handleLogout = () => {
	uni.showModal({
		title: '提示',
		content: '您确定要退出登录吗？',
		success: (res) => {
			if (res.confirm) {
				console.log('用户点击确定');
				// 清理本地存储的 token 或用户信息
				// uni.removeStorageSync('token');
				// reLaunch 到登录页，关闭所有其他页面
				uni.reLaunch({
					url: '/pages/login/login'
				});
			}
		}
	});
};

// 返回上一页
const goBack = () => {
	uni.navigateBack();
};
</script>

<style lang="scss" scoped>
@import '@/common/styles/variables.scss';

.user-center-container {
	min-height: 100vh;
	background-color: $primary-bg;
	color: $font-color-primary;
	padding-top: 88rpx; // 为自定义导航栏留出空间
}

// 自定义导航栏
.navbar {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 88rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 30rpx;
	background-color: $secondary-bg;
	z-index: 99;
	box-sizing: border-box;

	.back-btn, .placeholder {
		width: 60rpx;
		font-size: 40rpx;
	}
	.navbar-title {
		font-size: 36rpx;
		font-weight: bold;
	}
}

.profile-section {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 60rpx 0;
	background-color: $secondary-bg;
	
	.avatar {
		width: 160rpx;
		height: 160rpx;
		border-radius: 50%;
		border: 4rpx solid $accent-color-start;
		margin-bottom: 20rpx;
	}

	.username {
		font-size: 36rpx;
		font-weight: bold;
	}
}

.info-list {
	margin-top: 20rpx;
	background-color: $secondary-bg;

	.info-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx;
		border-bottom: 1px solid $card-bg;
		font-size: 30rpx;

		&:last-child {
			border-bottom: none;
		}

		.label {
			color: $font-color-primary;
		}

		.value {
			color: $font-color-secondary;
		}
		
		.arrow {
			color: $font-color-secondary;
			font-size: 36rpx;
		}
	}
}

.logout-btn-wrapper {
	padding: 60rpx 30rpx;
	
	.logout-btn {
		height: 90rpx;
		line-height: 90rpx;
		background-color: #e54d4233; // 红色半透明背景
		color: #e54d42; // 红色文字
		border: 1px solid #e54d42;
		border-radius: 45rpx;
		font-size: 32rpx;
	}
}
</style>