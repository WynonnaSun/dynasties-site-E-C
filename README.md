# 快速部署
## 前提条件
- ✅ Ubuntu 22.04 服务器 (2核2G+)
- ✅ 域名已购买
- ✅ DNS 已配置 A 记录指向服务器 IP

## 1️ 克隆代码
```bash
git clone <your-repo-url> /var/www/dynasties-site
cd /var/www/dynasties-site
```

## 2️ 后端部署
```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt gunicorn

# 配置
cp .env.example .env
nano .env
```

**编辑 `.env` 填入：**
```bash
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
ADMIN_USERNAME=admin
ADMIN_PASSWORD=你的强密码
DATABASE_URL=sqlite:///./emails.db
```

## 3️ 前端部署
```bash
cd /var/www/dynasties-site/frontend
npm install

# 配置
cp .env.example .env
nano .env
```

**编辑 `.env` 填入：**
```bash
VITE_API_BASE=https://api.yourdomain.com
```

```bash
npm run build
```

## 4️ systemd 服务
```bash
sudo nano /etc/systemd/system/dynasties-api.service
```

**复制以下内容（修改路径）：**
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

**启动服务：**
```bash
sudo systemctl daemon-reload
sudo systemctl enable dynasties-api
sudo systemctl start dynasties-api
sudo systemctl status dynasties-api  # 检查状态
```

## 5️ Nginx 配置
```bash
sudo nano /etc/nginx/sites-available/dynasties
```

**复制以下内容（将所有 `yourdomain.com` 改为实际域名）：**
```nginx
# 前端
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    root /var/www/dynasties-site/frontend/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# 后端 API
server {
    listen 80;
    server_name api.yourdomain.com;
    
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

**启用配置：**
```bash
sudo ln -s /etc/nginx/sites-available/dynasties /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 6️ HTTPS 证书
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com
```

按提示输入邮箱，同意条款即可。

## 完成！

访问 `https://yourdomain.com` 测试网站  
管理后台：`https://yourdomain.com/admin.html`

## 常用命令

```bash
# 查看后端日志
sudo journalctl -u dynasties-api -f

# 重启后端
sudo systemctl restart dynasties-api

# 重新构建前端（代码更新后）
cd /var/www/dynasties-site/frontend
npm run build
sudo systemctl reload nginx

# 查看 Nginx 错误日志
sudo tail -f /var/log/nginx/error.log
```

## ⚠️ 必改配置清单

| 位置 | 必须修改的内容 |
|------|----------------|
| `backend/.env` | `CORS_ORIGINS` → 你的域名 |
| `backend/.env` | `ADMIN_PASSWORD` → 强密码 |
| `frontend/.env` | `VITE_API_BASE` → https://api.你的域名.com |
| `systemd service` | `WorkingDirectory` → 实际路径 |
| `systemd service` | `ExecStart` → 实际路径 |
| `Nginx 配置` | 所有 `yourdomain.com` → 你的域名 |
| `Nginx 配置` | `root` 路径 → 实际路径 |

**详细文档请查看DEPLOYMENT_CHECKLIST.md**
