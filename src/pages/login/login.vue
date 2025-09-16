<template>
	<view class="login-container">
		<view class="logo-wrapper">
			<text class="logo-text">G</text>
		</view>

		<view class="title-wrapper">
			<text class="main-title">欢迎登录</text>
			<text class="sub-title">使用您的账户继续</text>
		</view>

		<view class="form-wrapper">
			<view class="input-item">
				<text class="input-label">用户名</text>
				<input class="input-field" v-model="formData.username" placeholder="请输入用户名" placeholder-class="input-placeholder" />
			</view>
			<view class="input-item">
				<text class="input-label">密码</text>
				<input class="input-field" :password="!isPasswordVisible" v-model="formData.password" placeholder="请输入密码" placeholder-class="input-placeholder" />
				<text class="password-toggle" @click="togglePasswordVisibility">{{ isPasswordVisible ? '隐藏' : '显示' }}</text>
			</view>

			<button class="login-button" @click="handleLogin">登 录</button>
		</view>

		<view class="register-section">
			<text class="no-account-text">没有账号?</text>
			<text class="register-link" @click="navigateToRegister">立即注册</text>
		</view>
		
		<view class="footer">
			<text>© 2025 Gemini Financial Bot</text>
		</view>
	</view>
</template>

<script setup>
import { ref, reactive } from 'vue';

// 响应式表单数据
const formData = reactive({
	username: '',
	password: ''
});

// 控制密码可见性
const isPasswordVisible = ref(false);

const togglePasswordVisibility = () => {
	isPasswordVisible.value = !isPasswordVisible.value;
};

// 处理登录逻辑
const handleLogin = () => {
	if (!formData.username || !formData.password) {
		uni.showToast({
			title: '请输入用户名和密码',
			icon: 'none'
		});
		return;
	}
	
	console.log('登录信息:', formData);
	// 显示加载提示
	uni.showLoading({
		title: '登录中...'
	});

	// 在这里添加您的API调用和认证逻辑
	// 模拟一个网络请求
	setTimeout(() => {
		uni.hideLoading();
		uni.showToast({
			title: '登录成功',
			icon: 'success'
		});
			uni.reLaunch({
			url: '/pages/chat/chat' // <-- 修改跳转地址
		});
	}, 1500);
};

// 跳转到注册页面
const navigateToRegister = () => {
	uni.navigateTo({
		// 请确保您的注册页面路径正确
		url: '/pages/register/register' 
	});
};
</script>

<style lang="scss" scoped>
@import '@/common/styles/variables.scss';

.login-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
	min-height: 100vh;
	padding: 80rpx 50rpx;
	background: linear-gradient(180deg, $secondary-bg 0%, $primary-bg 100%);
	box-sizing: border-box;
}

.logo-wrapper {
	width: 150rpx;
	height: 150rpx;
	background-color: rgba(255, 255, 255, 0.05);
	border-radius: 30rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 60rpx;
	margin-bottom: 40rpx;
	.logo-text {
		font-size: 80rpx;
		font-weight: bold;
		color: $font-color-primary;
	}
}

.title-wrapper {
	text-align: center;
	margin-bottom: 80rpx;
	display: flex;          /* <-- 新增：启用 Flexbox 布局 */
	flex-direction: column; /* <-- 新增：设置主轴为垂直方向 */
	align-items: center;    /* <-- 新增：使子元素在交叉轴（水平）上居中 */

	.main-title {
		font-size: 52rpx;
		font-weight: bold;
		color: $font-color-primary;
	}
	.sub-title {
		font-size: 28rpx;
		color: $font-color-secondary;
		margin-top: 15rpx;
	}
}

.form-wrapper {
	width: 100%;
}

.input-item {
	background-color: $card-bg;
	border-radius: 20rpx;
	padding: 20rpx 30rpx;
	margin-bottom: 40rpx;
	display: flex;
	align-items: center;
	border: 1px solid transparent; // 用于聚焦时变色
	transition: border-color 0.3s;

	&:focus-within {
		border-color: $accent-color-start;
	}

	.input-label {
		font-size: 30rpx;
		color: $font-color-secondary;
		width: 120rpx; // 固定标签宽度
	}
	
	.input-field {
		flex: 1;
		font-size: 30rpx;
		color: $font-color-primary;
		height: 60rpx;
	}
	
	.input-placeholder {
		color: #666;
	}
	
	.password-toggle {
		font-size: 28rpx;
		color: $accent-color-start;
		cursor: pointer;
	}
}

.login-button {
	width: 100%;
	height: 100rpx;
	line-height: 100rpx;
	border-radius: 50rpx;
	font-size: 32rpx;
	font-weight: bold;
	color: #FFFFFF;
	background: linear-gradient(90deg, $accent-color-start, $accent-color-end);
	border: none;
	margin-top: 30rpx;
	box-shadow: 0 10rpx 20rpx rgba(58, 124, 244, 0.2);
}

.register-section {
	display: flex;
	justify-content: center;
	margin-top: 60rpx;
	font-size: 28rpx;
	
	.no-account-text {
		color: $font-color-secondary;
	}
	
	.register-link {
		color: $accent-color-start;
		margin-left: 10rpx;
		font-weight: bold;
	}
}

.footer {
	position: absolute;
	bottom: 50rpx;
	width: 100%;
	text-align: center;
	font-size: 24rpx;
	color: $font-color-secondary;
}

</style>