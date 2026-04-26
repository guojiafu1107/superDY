# SuperDY Web 应用

面向抖音创作者的一站式AI增长工作台，覆盖热点发现、AI脚本创作、智能排期与数据分析全链路。

## 功能特性

### Phase 1 (MVP) 核心功能
- **热点灵感引擎**: 实时热点榜单、爆款视频拆解、灵感收藏夹
- **AI智能创作工坊**: 风格学习、脚本生成、多版本改写
- **智能发布排期**: 可视化日历、最佳时间推荐
- **深度数据洞察**: 账号概览、粉丝画像、单视频复盘
- **用户体系**: 抖音OAuth登录、免费/高级/团队订阅

### Phase 2 (高级版)
- 算法预估评分与A/B对比
- 竞品监控模块
- 直播实时看板与复盘
- 团队协作功能

## 技术架构

### 前端
- React 18 + Next.js 14 (App Router)
- Ant Design 5 + Tailwind CSS 3
- Zustand (状态管理) + React Query (数据获取)
- ECharts 5 (数据可视化)

### 后端
- **Web BFF**: Go (Gin) - API聚合、业务逻辑
- **AI服务**: Python (FastAPI) - 脚本生成、视频分析
- **数据库**: PostgreSQL 15 (主库) + Redis 7 (缓存)
- **消息队列**: Apache Kafka
- **搜索引擎**: Elasticsearch 8

## 快速开始

### 环境要求
- Docker & Docker Compose
- Node.js 20+
- Go 1.21+
- Python 3.11+

### 本地开发

1. 克隆项目
```bash
git clone <repository-url>
cd superdy-web
```

2. 启动基础设施
```bash
docker-compose up -d postgres redis kafka
```

3. 启动后端服务
```bash
cd backend-go
go mod download
go run main.go
```

4. 启动AI服务
```bash
cd ai-service
pip install -r requirements.txt
python main.py
```

5. 启动前端
```bash
cd frontend
npm install
npm run dev
```

6. 访问应用
- 前端: http://localhost:3000
- 后端API: http://localhost:8080
- AI服务: http://localhost:8000

### Docker Compose 一键启动

```bash
docker-compose up -d
```

## 项目结构

```
superdy-web/
├── frontend/          # Next.js 前端应用
│   ├── src/
│   │   ├── app/       # 页面路由
│   │   ├── components/# React组件
│   │   ├── stores/    # Zustand状态管理
│   │   ├── lib/       # 工具函数
│   │   └── types/     # TypeScript类型定义
│   └── package.json
├── backend-go/        # Go后端服务
│   ├── handlers/      # API处理器
│   ├── models/        # 数据模型
│   ├── middleware/    # 中间件
│   ├── routes/        # 路由配置
│   └── main.go
├── ai-service/        # Python AI服务
│   ├── services/      # AI模型服务
│   └── main.py
└── docker-compose.yml
```

## API 文档

### 认证相关
- `GET /api/v1/auth/douyin` - 抖音OAuth授权
- `GET /api/v1/auth/douyin/callback` - OAuth回调
- `GET /api/v1/users/me` - 获取当前用户信息

### 热点灵感
- `GET /api/v1/trends/hot` - 热点榜单
- `POST /api/v1/trends/analyze` - 视频拆解分析

### AI创作
- `POST /api/v1/scripts/generate` - 生成脚本
- `POST /api/v1/style/analyze` - 分析风格

### 发布排期
- `GET /api/v1/publish/calendar` - 获取日历
- `POST /api/v1/publish/tasks` - 创建发布任务

### 数据分析
- `GET /api/v1/analytics/dashboard` - 仪表盘数据
- `GET /api/v1/analytics/videos/:id` - 单视频分析

## 开发规范

- 分支策略: `main` (生产) / `develop` (开发) / `feature/*` (功能分支)
- API规范: RESTful，统一响应格式 `{code, message, data}`
- 数据库: 使用GORM，迁移使用自动迁移

## License

MIT
