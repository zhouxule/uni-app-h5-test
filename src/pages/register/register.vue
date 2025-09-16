<template>
	<view class="register-container">
		<view class="logo-wrapper">
			<text class="logo-text">G</text>
		</view>

		<view class="title-wrapper">
			<text class="main-title">创建您的账户</text>
			<text class="sub-title">填写信息以完成注册</text>
		</view>

		<view class="form-wrapper">
			<view class="input-item">
				<text class="input-label">用户名</text>
				<input class="input-field" v-model="formData.username" placeholder="请输入用户名" placeholder-class="input-placeholder" />
			</view>
			<view class="input-item">
				<text class="input-label">设置密码</text>
				<input class="input-field" :password="!isPasswordVisible" v-model="formData.password" placeholder="请输入密码" placeholder-class="input-placeholder" />
				<text class="password-toggle" @click="togglePasswordVisibility">{{ isPasswordVisible ? '隐藏' : '显示' }}</text>
			</view>
			<view class="input-item">
				<text class="input-label">确认密码</text>
				<input class="input-field" :password="!isConfirmPasswordVisible" v-model="formData.confirmPassword" placeholder="请再次输入密码" placeholder-class="input-placeholder" />
				<text class="password-toggle" @click="toggleConfirmPasswordVisibility">{{ isConfirmPasswordVisible ? '隐藏' : '显示' }}</text>
			</view>

			<button class="register-button" @click="handleRegister">注 册</button>
		</view>

		<view class="login-section">
			<text class="has-account-text">已有账号?</text>
			<text class="login-link" @click="navigateToLogin">返回登录</text>
		</view>
		
		<view class="footer">
			<text>© 2025 Gemini Financial Bot</text>
		</view>
	</view>
</template>

<script setup>
import { reactive, ref } from 'vue';

// 响应式表单数据
const formData = reactive({
	username: '',
	password: '',
	confirmPassword: ''
});

// 控制密码可见性
const isPasswordVisible = ref(false);
const isConfirmPasswordVisible = ref(false);

const togglePasswordVisibility = () => {
	isPasswordVisible.value = !isPasswordVisible.value;
};
const toggleConfirmPasswordVisibility = () => {
	isConfirmPasswordVisible.value = !isConfirmPasswordVisible.value;
};

// 处理注册逻辑
const handleRegister = () => {
	// 1. 前端基础校验
	if (!formData.username || !formData.password || !formData.confirmPassword) {
		uni.showToast({ title: '请填写所有字段', icon: 'none' });
		return;
	}
	if (formData.password !== formData.confirmPassword) {
		uni.showToast({ title: '两次输入的密码不一致', icon: 'none' });
		return;
	}
	if (formData.password.length < 6) {
		uni.showToast({ title: '密码长度不能少于6位', icon: 'none' });
		return;
	}

	uni.showLoading({ title: '注册中...' });

	// 2. 在这里发起 API 请求 (详见下文说明)
	console.log('准备提交的注册信息:', {
		username: formData.username,
		password: formData.password
	});
	
	// 模拟一个网络请求
	setTimeout(() => {
		uni.hideLoading();
		uni.showToast({
			title: '注册成功！',
			icon: 'success'
		});
		
		// 注册成功后，也要保存 token 和基本信息
		// uni.setStorageSync('token', res.data.token);
		// uni.setStorageSync('userProfile', res.data.userProfile);

		// 跳转到完善信息页 (模式为 complete)
		setTimeout(() => {
			uni.reLaunch({
				url: '/pages/user/edit?mode=complete' // <-- 强制跳转到这里
			});
		}, 1500);

	}, 2000);
};

// 跳转到登录页面
const navigateToLogin = () => {
	// 使用 navigateBack 比 navigateTo 体验更好，因为它会返回上一页
	uni.navigateBack();
};
</script>

<style lang="scss" scoped>
@import '@/common/styles/variables.scss';

// 大部分样式与登录页复用，这里只写出结构
.register-container {
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
	margin-top: 20rpx;
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
	display: flex;
	flex-direction: column;
	align-items: center;
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
	border: 1px solid transparent;
	transition: border-color 0.3s;

	&:focus-within {
		border-color: $accent-color-start;
	}

	.input-label {
		font-size: 30rpx;
		color: $font-color-secondary;
		width: 150rpx;
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

.register-button {
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

.login-section {
	display: flex;
	justify-content: center;
	margin-top: 60rpx;
	font-size: 28rpx;
	
	.has-account-text {
		color: $font-color-secondary;
	}
	
	.login-link {
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