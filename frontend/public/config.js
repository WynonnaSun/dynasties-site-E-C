// 自动检测环境
window.APP_CONFIG = {
  API_URL: window.location.hostname === 'localhost' 
    ? 'http://localhost:8000' 
    : 'https://your-backend-api.com'  // 部署时改成实际的后端地址
};