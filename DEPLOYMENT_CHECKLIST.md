# 部署检查清单 (Deployment Checklist)

## 部署前准备

### 1. 域名和服务器
- [ ] 已购买域名
- [ ] 已配置 DNS 记录
  - [ ] 主域名 A 记录指向服务器 IP (例如：yourdomain.com)
  - [ ] API 子域名 A 记录指向服务器 IP (例如：api.yourdomain.com)
- [ ] 服务器已准备好（云服务器或 VPS）
- [ ] 服务器已安装必要软件：
  - [ ] Python 3.9+
  - [ ] Node.js 18+
  - [ ] Nginx 或 Apache
  - [ ] Git

### 2. SSL 证书（HTTPS）
- [ ] 已获取 SSL 证书（推荐 Let's Encrypt 免费证书）
- [ ] 已在 Nginx/Apache 中配置 HTTPS

### 3. 代码和配置
- [ ] 代码已上传到 GitHub
- [ ] `.gitignore` 文件已正确配置（不包含 .env 文件）

## 需要客户修改的配置项

### ⚠️ 必须修改的配置

#### 后端配置 (backend/.env)
```bash
# 1. 修改 CORS 源地址为实际域名
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# 2. 修改管理员密码为强密码
ADMIN_USERNAME=admin
ADMIN_PASSWORD=请设置一个强密码（至少16位，包含大小写字母、数字、特殊字符）

# 3. 生产数据库（可选，建议使用 PostgreSQL）
DATABASE_URL=postgresql://username:password@localhost:5432/dynasties
```

#### 前端配置 (frontend/.env)
```bash
# 修改为实际的后端 API 地址
VITE_API_BASE=https://api.yourdomain.com
```

#### Nginx 配置
需要将配置文件中的域名替换为实际域名：
- `yourdomain.com` → 替换为实际主域名
- `api.yourdomain.com` → 替换为实际 API 子域名

## 部署步骤

### 方案 A：传统服务器部署（推荐）

#### 第一步：部署后端

1. **克隆代码并安装依赖**
```bash
cd /var/www  # 或其他目录
git clone <github-repo-url> dynasties-site
cd dynasties-site/backend

# 创建虚拟环境
python3 -m venv .venv
source .venv/bin/activate

# 安装依赖
pip install -r requirements.txt
pip install gunicorn  # 生产环境服务器
```

2. **配置环境变量**
```bash
# 创建 .env 文件
nano .env

# 填入配置（参考上方"必须修改的配置"）
```

3. **测试运行**
```bash
# 测试后端是否能正常启动
uvicorn app:app --host 0.0.0.0 --port 8000

# 访问 http://your-server-ip:8000/health 检查是否返回 {"ok": true}
# Ctrl+C 停止
```

4. **配置 systemd 服务**（保持后端持续运行）
```bash
sudo nano /etc/systemd/system/dynasties-api.service
```

填入以下内容（修改路径为实际路径）：
```ini
[Unit]
Description=Dynasties API Service
After=network.target

[Service]
Type=notify
User=www-data
WorkingDirectory=/var/www/dynasties-site/backend
Environment="PATH=/var/www/dynasties-site/backend/.venv/bin"
ExecStart=/var/www/dynasties-site/backend/.venv/bin/gunicorn app:app -w 4 -k uvicorn.workers.UvicornWorker --bind 127.0.0.1:8000
Restart=always

[Install]
WantedBy=multi-user.target
```

启动服务：
```bash
sudo systemctl daemon-reload
sudo systemctl enable dynasties-api
sudo systemctl start dynasties-api
sudo systemctl status dynasties-api  # 检查状态
```

#### 第二步：部署前端

1. **配置并构建**
```bash
cd /var/www/dynasties-site/frontend

# 创建 .env 文件
nano .env
# 填入：VITE_API_BASE=https://api.yourdomain.com

# 安装依赖
npm install

# 构建生产版本
npm run build

# 构建后的文件在 dist/ 目录
```

2. **配置 Nginx**
```bash
sudo nano /etc/nginx/sites-available/dynasties
```

填入以下内容（修改域名为实际域名）：
```nginx
# 前端静态文件
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # 如果已配置 SSL，修改为：
    # listen 443 ssl;
    # ssl_certificate /path/to/cert.pem;
    # ssl_certificate_key /path/to/key.pem;

    root /var/www/dynasties-site/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

# 后端 API 反向代理
server {
    listen 80;
    server_name api.yourdomain.com;

    # 如果已配置 SSL，修改为：
    # listen 443 ssl;
    # ssl_certificate /path/to/cert.pem;
    # ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# HTTP 重定向到 HTTPS（如果配置了 SSL）
# server {
#     listen 80;
#     server_name yourdomain.com www.yourdomain.com api.yourdomain.com;
#     return 301 https://$server_name$request_uri;
# }
```

启用站点：
```bash
sudo ln -s /etc/nginx/sites-available/dynasties /etc/nginx/sites-enabled/
sudo nginx -t  # 测试配置
sudo systemctl reload nginx
```

#### 第三步：配置 SSL（HTTPS）

使用 Let's Encrypt 免费证书：
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com
```

按提示操作即可自动配置 HTTPS。

### 方案 B：Docker 部署

如果客户的技术团队熟悉 Docker：

1. 确保服务器已安装 Docker 和 Docker Compose
2. 在项目根目录创建 `docker-compose.yml`（参考 README.md 中的示例）
3. 创建 `.env` 文件配置环境变量
4. 运行：
```bash
docker-compose up -d
```

### 方案 C：云平台部署

#### 后端选项：
- **Railway.app**：连接 GitHub 仓库，自动部署
- **Render.com**：免费套餐可用，支持 Python
- **Fly.io**：全球 CDN，性能好

#### 前端选项：
- **Vercel**：推荐，支持 Vite，免费额度大
- **Netlify**：老牌静态托管平台
- **Cloudflare Pages**：速度快，免费

## 部署后检查

- [ ] 前端网站可以正常访问：https://yourdomain.com
- [ ] API 健康检查正常：https://api.yourdomain.com/health
- [ ] 前端表单提交功能正常
- [ ] 管理员后台可以登录查看数据（访问前端的 /admin.html 页面）
- [ ] HTTPS 证书有效
- [ ] 所有链接都是 HTTPS（无混合内容警告）

## 监控和维护

### 设置监控
- [ ] 配置服务器监控（CPU、内存、磁盘）
- [ ] 配置应用监控（API 可用性）
- [ ] 设置告警通知

### 定期维护
- [ ] 每周检查日志
- [ ] 每周备份数据库
- [ ] 每月更新依赖包
- [ ] SSL 证书自动续期（Let's Encrypt 默认自动）

### 备份策略
```bash
# 数据库备份脚本（可以用 cron 定时执行）
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
cp /var/www/dynasties-site/backend/emails.db /backups/emails_$DATE.db

# 保留最近30天的备份
find /backups -name "emails_*.db" -mtime +30 -delete
```

## 常见问题

### 1. 502 Bad Gateway
- 检查后端服务是否运行：`sudo systemctl status dynasties-api`
- 检查后端端口是否正确：`netstat -tlnp | grep 8000`

### 2. CORS 错误
- 确认 `backend/.env` 中的 `CORS_ORIGINS` 包含前端域名
- 重启后端服务：`sudo systemctl restart dynasties-api`

### 3. 无法提交邮箱
- 打开浏览器开发者工具查看网络请求
- 检查 API 地址是否正确
- 检查后端日志：`sudo journalctl -u dynasties-api -f`

### 4. 管理员登录失败
- 确认用户名密码与 `backend/.env` 一致
- 检查浏览器是否正确发送 Basic Auth 头

## 性能优化建议

- [ ] 启用 Gzip 压缩（Nginx）
- [ ] 配置浏览器缓存策略
- [ ] 使用 CDN 加速静态资源
- [ ] 数据库索引优化（如果数据量大）
- [ ] 考虑使用 Redis 做缓存

## 安全建议

- [ ] 定期更新服务器系统和软件包
- [ ] 配置防火墙，只开放 80、443 端口
- [ ] 限制 SSH 访问（使用密钥认证）
- [ ] 定期检查访问日志
- [ ] 使用强密码
- [ ] 考虑添加 IP 限流防止暴力攻击

## 支持联系

如果部署过程中遇到问题，可以联系：
- GitHub Issues: [repo-url]/issues
- Email: xinwang4173@gmail.com

---

**最后更新**: 2025年12月
