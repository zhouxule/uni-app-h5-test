<template>
	<view class="chat-container">
		<view class="sidebar" :class="{ 'is-open': isSidebarOpen }">
			<view class="sidebar-header">
				<text class="sidebar-title">历史记录</text>
				<text class="close-btn" @click="toggleSidebar">×</text>
			</view>
			<scroll-view class="history-list" scroll-y>
				<view class="history-item" v-for="item in chatHistory" :key="item.id" @click="loadHistoryChat(item.id)">
					<text class="history-title">{{ item.title }}</text>
				</view>
				<view v-if="historyLoading" class="loading-state">加载中...</view>
				<view v-if="!historyLoading && chatHistory.length === 0" class="empty-state">暂无历史记录</view>
			</scroll-view>
		</view>
		<view class="overlay" v-if="isSidebarOpen" @click="toggleSidebar"></view>

		<view class="main-chat" :class="{ 'sidebar-open': isSidebarOpen }">
			<view class="navbar">
				<view class="menu-btn" @click="toggleSidebar">
					<view class="line"></view>
					<view class="line"></view>
					<view class="line"></view>
				</view>
				<view class="navbar-title">Gemini Bot</view>
				<view class="user-center-btn" @click="navigateToUserCenter">
					<text>我的</text>
				</view>
			</view>

			<scroll-view class="messages-area" scroll-y :scroll-into-view="lastMessageId" scroll-with-animation>
				<view class="message-list">
					<view v-for="(message, index) in messages" :key="index" class="message-item" :class="[message.role]" :id="'msg-' + index">
						<view class="avatar">{{ message.role === 'user' ? '我' : 'G' }}</view>
						<view class="content">
							<text>{{ message.content }}</text>
						</view>
					</view>
				</view>
			</scroll-view>

			<view class="input-area">
				<view class="upload-btn" @click="handleFileUpload">
					<text>+</text>
				</view>
				<input class="input-field" v-model="userInput" placeholder="请输入您的问题..." @confirm="sendMessage" confirm-type="send" />
				<button class="send-btn" @click="sendMessage">发送</button>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';

// --- 响应式状态 ---
const isSidebarOpen = ref(false); // 侧边栏是否展开
const historyLoading = ref(false); // 历史记录是否加载中
const chatHistory = ref([]); // 历史记录列表
const messages = ref([]); // 当前聊天消息列表
const userInput = ref(''); // 用户输入的内容
const lastMessageId = ref(''); // 用于滚动到最后一条消息

// --- 生命周期钩子 ---
onMounted(() => {
	// 页面加载时获取历史记录
	fetchChatHistory();
	// 初始化欢迎消息
	messages.value.push({ role: 'assistant', content: '您好！我是您的专属金融助手，请问有什么可以帮您？' });
});

// --- 方法 ---

// 切换侧边栏显示/隐藏
const toggleSidebar = () => {
	isSidebarOpen.value = !isSidebarOpen.value;
};

// 获取历史聊天记录 (模拟API调用)
const fetchChatHistory = () => {
	historyLoading.value = true;
	console.log("正在从后端获取历史记录...");
	// 模拟网络请求
	setTimeout(() => {
		// --- API 调用点 (1) ---
		// 在这里使用 uni.request 从您的后端获取历史记录列表
		// 假设后端返回的数据格式为: [{ id: 'conv1', title: '关于A公司的财报分析' }, { id: 'conv2', title: '市场趋势预测' }]
		const mockHistory = [
			{ id: 'conv1', title: '关于A公司的财报分析' },
			{ id: 'conv2', title: '2025年第一季度市场趋势' },
			{ id: 'conv3', title: '如何评估一只股票' },
		];
		chatHistory.value = mockHistory;
		historyLoading.value = false;
	}, 1500);
};

// 加载指定的历史聊天 (模拟API调用)
const loadHistoryChat = (conversationId) => {
	console.log(`加载会话: ${conversationId}`);
	toggleSidebar(); // 关闭侧边栏
	messages.value = []; // 清空当前消息
	// --- API 调用点 (2) ---
	// 在这里使用 uni.request 根据 conversationId 获取该会话的详细消息
	// 模拟返回数据
	const mockMessages = [
		{ role: 'user', content: '帮我分析一下A公司的最新财报' },
		{ role: 'assistant', content: '好的，正在为您分析... A公司的最新财报显示其营收同比增长了15%。' }
	];
	messages.value = mockMessages;
};

// 发送消息
const sendMessage = async () => {
	if (!userInput.value.trim()) return;

	// 1. 将用户消息添加到列表中
	const userMessage = { role: 'user', content: userInput.value };
	messages.value.push(userMessage);
	const currentInput = userInput.value;
	userInput.value = ''; // 清空输入框

	// 滚动到底部
	await scrollToBottom();

	// 2. 模拟机器人回复
	// --- API 调用点 (3) ---
	// 在这里调用 uni.request 将用户的消息(currentInput)发送给后端，并获取机器人的回复
	messages.value.push({ role: 'assistant', content: '正在思考...' });
	await scrollToBottom();
	
	setTimeout(() => {
		// 假设后端返回了机器人的回复
		const botResponse = `关于“${currentInput}”这个问题，我的分析如下：...`;
		// 更新最后一条消息（"正在思考..."）
		messages.value[messages.value.length - 1].content = botResponse;
	}, 2000);
};

// 处理文件上传
const handleFileUpload = () => {
	// --- 文件上传逻辑 ---
	uni.chooseFile({
		count: 1, // 默认1
		success: (res) => {
			console.log('选择的文件:', res.tempFiles[0]);
			const tempFilePath = res.tempFiles[0].path;
			uni.showLoading({ title: '上传分析中...' });
			
			// --- API 调用点 (4) ---
			// 在这里使用 uni.uploadFile 将文件上传到您的服务器
			// uni.uploadFile({ url: '...', filePath: tempFilePath, name: 'file', ... })
			setTimeout(() => {
				uni.hideLoading();
				messages.value.push({ role: 'user', content: `[文件] ${res.tempFiles[0].name}` });
				messages.value.push({ role: 'assistant', content: '文件已收到，正在为您分析财报...' });
				scrollToBottom();
			}, 2000);
		}
	});
};

// 滚动到聊天底部
const scrollToBottom = () => {
	// nextTick 确保DOM更新后再执行滚动
	return new Promise(resolve => {
		nextTick(() => {
			lastMessageId.value = `msg-${messages.value.length - 1}`;
			resolve();
		});
	});
};


// 跳转到用户中心
const navigateToUserCenter = () => {
	uni.navigateTo({
		url: '/pages/user/user' // 假设您的用户中心页面路径
	});
};

</script>

<style lang="scss" scoped>
@import '@/common/styles/variables.scss';

.chat-container {
	position: relative;
	width: 100vw;
	height: 100vh;
	overflow: hidden;
	background-color: $primary-bg;
}

/* --- 侧边栏 --- */
.sidebar {
	position: fixed;
	top: 0;
	left: -70vw; // 初始状态隐藏在左侧
	width: 70vw;
	height: 100%;
	background-color: $secondary-bg;
	transition: left 0.3s ease;
	z-index: 1001;
	display: flex;
	flex-direction: column;

	&.is-open {
		left: 0;
	}

	.sidebar-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx;
		border-bottom: 1px solid $card-bg;
		.sidebar-title {
			font-size: 36rpx;
			color: $font-color-primary;
			font-weight: bold;
		}
		.close-btn {
			font-size: 50rpx;
			color: $font-color-secondary;
			cursor: pointer;
		}
	}

	.history-list {
		flex: 1;
		.history-item {
			padding: 30rpx;
			border-bottom: 1px solid $card-bg;
			.history-title {
				color: $font-color-primary;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
		}
		.loading-state, .empty-state {
			text-align: center;
			padding: 40rpx;
			color: $font-color-secondary;
		}
	}
}

/* --- 遮罩层 --- */
.overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 1000;
}

/* --- 主聊天界面 --- */
.main-chat {
	height: 100%;
	display: flex;
	flex-direction: column;
	transition: transform 0.3s ease;
	&.sidebar-open {
		transform: translateX(70vw);
	}
}

/* --- 顶部导航栏 --- */
.navbar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx;
	height: 88rpx;
	background-color: $secondary-bg;
	box-sizing: border-box;
	.menu-btn {
		width: 60rpx;
		height: 60rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		padding: 10rpx 0;
		.line {
			width: 100%;
			height: 4rpx;
			background-color: $font-color-primary;
		}
	}
	.navbar-title {
		font-size: 36rpx;
		color: $font-color-primary;
		font-weight: bold;
	}
	.user-center-btn {
		width: 60rpx;
		text-align: center;
		color: $font-color-primary;
	}
}

/* --- 聊天消息区 --- */
.messages-area {
	flex: 1;
	padding: 20rpx;
	overflow-y: auto;
	.message-item {
		display: flex;
		margin-bottom: 30rpx;
		&.user {
			flex-direction: row-reverse;
			.content {
				background: linear-gradient(90deg, $accent-color-start, $accent-color-end);
				color: #FFFFFF;
			}
		}
		&.assistant {
			.content {
				background-color: $card-bg;
				color: $font-color-primary;
			}
		}
		.avatar {
			width: 70rpx;
			height: 70rpx;
			border-radius: 50%;
			background-color: $card-bg;
			text-align: center;
			line-height: 70rpx;
			margin: 0 20rpx;
			font-weight: bold;
		}
		.content {
			max-width: 65%;
			padding: 20rpx;
			border-radius: 20rpx;
			line-height: 1.5;
		}
	}
}

/* --- 底部输入区 --- */
.input-area {
	display: flex;
	align-items: center;
	padding: 20rpx;
	background-color: $secondary-bg;
	border-top: 1px solid $card-bg;
	.upload-btn {
		width: 70rpx;
		height: 70rpx;
		background-color: $card-bg;
		border-radius: 50%;
		text-align: center;
		line-height: 65rpx;
		font-size: 50rpx;
		color: $font-color-primary;
		margin-right: 20rpx;
	}
	.input-field {
		flex: 1;
		height: 80rpx;
		padding: 0 20rpx;
		background-color: $card-bg;
		border-radius: 40rpx;
		color: $font-color-primary;
	}
	.send-btn {
		width: 120rpx;
		height: 80rpx;
		line-height: 80rpx;
		margin-left: 20rpx;
		background: linear-gradient(90deg, $accent-color-start, $accent-color-end);
		color: white;
		border-radius: 40rpx;
		font-size: 28rpx;
	}
}
</style>