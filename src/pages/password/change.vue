<template>
	<view class="change-password-container">
		<view class="navbar">
			<view class="back-btn" @click="goBack">&lt;</view>
			<view class="navbar-title">修改密码</view>
			<view class="placeholder"></view>
		</view>

		<view class="form-wrapper">
			<view class="input-item">
				<input type="password" v-model="passwords.oldPassword" placeholder="请输入旧密码" />
			</view>
			<view class="input-item">
				<input type="password" v-model="passwords.newPassword" placeholder="请输入新密码（不少于6位）" />
			</view>
			<view class="input-item">
				<input type="password" v-model="passwords.confirmPassword" placeholder="请确认新密码" />
			</view>
		</view>

		<view class="submit-btn-wrapper">
			<button class="submit-btn" @click="handleChangePassword">确认修改</button>
		</view>
	</view>
</template>

<script setup>
import { reactive } from 'vue';

const passwords = reactive({
	oldPassword: '',
	newPassword: '',
	confirmPassword: ''
});

const handleChangePassword = () => {
	if (!passwords.oldPassword || !passwords.newPassword || !passwords.confirmPassword) {
		uni.showToast({ title: '请填写所有字段', icon: 'none' });
		return;
	}
	if (passwords.newPassword.length < 6) {
		uni.showToast({ title: '新密码长度不能少于6位', icon: 'none' });
		return;
	}
	if (passwords.newPassword !== passwords.confirmPassword) {
		uni.showToast({ title: '两次输入的新密码不一致', icon: 'none' });
		return;
	}

	uni.showLoading({ title: '提交中...' });

	// --- API 调用点 (2): 修改密码 ---
	// 调用 uni.request 将 passwords 发送给后端
	setTimeout(() => {
		uni.hideLoading();
		uni.showToast({ title: '密码修改成功，请重新登录', icon: 'success' });
		
		// 清除本地登录状态
		uni.removeStorageSync('token');
		uni.removeStorageSync('userProfile');

		// 跳转到登录页
		setTimeout(() => {
			uni.reLaunch({
				url: '/pages/login/login'
			});
		}, 1500);
	}, 1500);
};

const goBack = () => {
	uni.navigateBack();
};
</script>

<style lang="scss" scoped>
@import '@/common/styles/variables.scss';

.change-password-container {
	min-height: 100vh;
	background-color: $primary-bg;
	padding-top: 88rpx;
}

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

.form-wrapper {
	margin-top: 20rpx;
	background-color: $secondary-bg;
	padding: 0 30rpx;
}

.form-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 100rpx;
	border-bottom: 1px solid $card-bg;
	font-size: 30rpx;

	.label {
		width: 150rpx;
		color: $font-color-primary;
	}

	.input-field, .picker-value {
		flex: 1;
		text-align: right;
		color: $font-color-secondary;
	}
}

.form-wrapper {
	padding: 40rpx 30rpx;
	.input-item {
		background-color: $card-bg;
		border-radius: 20rpx;
		padding: 30rpx;
		margin-bottom: 40rpx;
		input {
			color: $font-color-primary;
		}
	}
}

.submit-btn-wrapper {
	padding: 60rpx 30rpx;
	.submit-btn {
		height: 90rpx;
		line-height: 90rpx;
		background: linear-gradient(90deg, $accent-color-start, $accent-color-end);
		color: white;
		border-radius: 45rpx;
	}
}
</style>