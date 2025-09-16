<template>
	<view class="edit-container">
		<view class="navbar">
			<view class="back-btn" @click="goBack" v-if="pageMode === 'edit'">&lt;</view>
			<view class="placeholder" v-else></view>
			<view class="navbar-title">{{ pageTitle }}</view>
			<view class="placeholder"></view>
		</view>

		<view class="form-wrapper">
			<view class="form-item">
				<text class="label">昵称</text>
				<input class="input-field" v-model="formData.username" placeholder="请输入您的昵称" />
			</view>
			<view class="form-item">
				<text class="label">性别</text>
				<picker @change="bindGenderChange" :value="genderIndex" :range="genderArray">
					<view class="picker-value">{{ genderArray[genderIndex] }}</view>
				</picker>
			</view>
			<view class="form-item">
				<text class="label">生日</text>
				<picker mode="date" :value="formData.birthday" @change="bindDateChange">
					<view class="picker-value">{{ formData.birthday || '请选择您的生日' }}</view>
				</picker>
			</view>
		</view>

		<view class="submit-btn-wrapper">
			<button class="submit-btn" @click="handleSubmit">保存信息</button>
		</view>

	</view>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

// --- 页面控制 ---
const pageMode = ref('complete'); // 'complete' (完善信息) 或 'edit' (修改信息)
const pageTitle = computed(() => pageMode.value === 'complete' ? '完善个人信息' : '修改个人信息');

// --- 表单数据 ---
const formData = reactive({
	username: '',
	gender: '',
	birthday: ''
});

// 性别选择器
const genderArray = ['保密', '男', '女'];
const genderIndex = ref(0);

// --- 页面加载 ---
onLoad((options) => {
	// 通过 options.mode 判断页面用途
	if (options.mode === 'edit') {
		pageMode.value = 'edit';
		// 如果是编辑模式，从缓存或API加载现有用户信息
		const profile = uni.getStorageSync('userProfile');
		if (profile) {
			formData.username = profile.username;
			formData.birthday = profile.birthday;
			formData.gender = profile.gender;
			genderIndex.value = genderArray.indexOf(profile.gender) > -1 ? genderArray.indexOf(profile.gender) : 0;
		}
	}
});

// --- 事件处理 ---
const bindGenderChange = (e) => {
	genderIndex.value = e.detail.value;
	formData.gender = genderArray[genderIndex.value];
};

const bindDateChange = (e) => {
	formData.birthday = e.detail.value;
};

// 提交表单
const handleSubmit = () => {
	console.log("提交的表单数据:", formData);
	if (!formData.username) {
		uni.showToast({ title: '昵称不能为空', icon: 'none' });
		return;
	}

	uni.showLoading({ title: '保存中...' });

	// --- API 调用点 (1): 更新用户信息 ---
	// 在这里调用 uni.request 将 formData 发送给后端
	setTimeout(() => {
		uni.hideLoading();
		uni.showToast({ title: '保存成功', icon: 'success' });
		
		// 更新本地缓存
		const profile = uni.getStorageSync('userProfile') || {};
		Object.assign(profile, formData);
		uni.setStorageSync('userProfile', profile);
		uni.$emit('profileUpdated'); // 发出全局通知

		// 根据模式决定下一步操作
		if (pageMode.value === 'complete') {
			// 完善信息后，跳转到主页
			uni.reLaunch({
				url: '/pages/chat/chat'
			});
		} else {
			// 修改信息后，返回上一页
			setTimeout(() => {
				uni.navigateBack();
			}, 1000);
		}
	}, 1500);
};

// 返回
const goBack = () => {
	uni.navigateBack();
};
</script>

<style lang="scss" scoped>
@import '@/common/styles/variables.scss';

.edit-container {
	min-height: 100vh;
	background-color: $primary-bg;
	color: $font-color-primary;
	padding-top: 88rpx;
}

// ... 复制 user.vue 的 navbar 样式 ...
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