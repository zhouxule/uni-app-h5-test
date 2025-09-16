import {
	createSSRApp
} from "vue";
import App from "./App.vue";
export function createApp() {
	const app = createSSRApp(App);
	return {
		app,
	};
}

// 待添加uni.addInterceptor导航拦截器防止跳过登录