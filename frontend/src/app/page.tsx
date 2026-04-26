'use client';

import { useState, useEffect } from 'react';
import { Tabs, Row, Col, Empty, Button, Skeleton, Tag } from 'antd';
import {
  FireOutlined,
  RocketOutlined,
  TrophyOutlined,
  ThunderboltOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import Layout from '@/components/Layout';
import TrendCard from '@/components/Trends/TrendCard';
import InspirationDrawer from '@/components/Trends/InspirationDrawer';
import { useTrendStore } from '@/stores/trendStore';
import { trendApi, inspirationApi } from '@/lib/api';
import { TrendItem, VideoAnalysis } from '@/types';

const categories = [
  { key: 'all', label: '全部', icon: <FireOutlined /> },
  { key: 'hot', label: '热点榜', icon: <FireOutlined /> },
  { key: 'rising', label: '飙升榜', icon: <RocketOutlined /> },
  { key: 'challenge', label: '挑战榜', icon: <TrophyOutlined /> },
  { key: 'entertainment', label: '娱乐', icon: <ThunderboltOutlined /> },
  { key: 'knowledge', label: '知识', icon: <ThunderboltOutlined /> },
  { key: 'life', label: '生活', icon: <ThunderboltOutlined /> },
  { key: 'fashion', label: '时尚', icon: <ThunderboltOutlined /> },
  { key: 'food', label: '美食', icon: <ThunderboltOutlined /> },
  { key: 'tech', label: '科技', icon: <ThunderboltOutlined /> },
];

// Mock data for demo
const mockTrends: TrendItem[] = [
  {
    id: '1',
    title: '这个AI工具让我一天写完100条脚本！创作者必备',
    category: 'tech',
    hotValue: 1250000,
    rank: 1,
    isRising: true,
    tags: ['AI工具', '效率神器', '创作技巧'],
    viewCount: 850000,
    videoCount: 1200,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: '2024抖音算法大揭秘，这条视频可能会被删...',
    category: 'knowledge',
    hotValue: 980000,
    rank: 2,
    isRising: true,
    tags: ['算法揭秘', '运营干货', '抖音技巧'],
    viewCount: 620000,
    videoCount: 890,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: '挑战30天涨粉10万，第15天我就放弃了...',
    category: 'life',
    hotValue: 760000,
    rank: 3,
    isRising: false,
    tags: ['涨粉挑战', '真实记录', '心态'],
    viewCount: 480000,
    videoCount: 650,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: '全网最全！短视频剪辑100个转场技巧',
    category: 'knowledge',
    hotValue: 650000,
    rank: 4,
    isRising: true,
    tags: ['剪辑教程', '转场技巧', '剪辑干货'],
    viewCount: 380000,
    videoCount: 520,
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    title: '月薪3千vs月薪3万的短视频运营差在哪？',
    category: 'knowledge',
    hotValue: 540000,
    rank: 5,
    isRising: false,
    tags: ['运营思维', '职场干货', '能力提升'],
    viewCount: 320000,
    videoCount: 410,
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    title: '我的第一条视频就爆了！新手小白快速起号攻略',
    category: 'knowledge',
    hotValue: 480000,
    rank: 6,
    isRising: true,
    tags: ['起号攻略', '新手必看', '经验分享'],
    viewCount: 280000,
    videoCount: 360,
    createdAt: new Date().toISOString(),
  },
  {
    id: '7',
    title: '直播间从0到10000人的核心秘籍',
    category: 'entertainment',
    hotValue: 420000,
    rank: 7,
    isRising: false,
    tags: ['直播运营', '流量密码', '变现'],
    viewCount: 240000,
    videoCount: 310,
    createdAt: new Date().toISOString(),
  },
  {
    id: '8',
    title: '这个文案公式让我每条视频都能破10万播放',
    category: 'knowledge',
    hotValue: 380000,
    rank: 8,
    isRising: true,
    tags: ['文案技巧', '爆款公式', '写作方法'],
    viewCount: 210000,
    videoCount: 280,
    createdAt: new Date().toISOString(),
  },
];

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedTrend, setSelectedTrend] = useState<TrendItem | null>(null);
  const [analysis, setAnalysis] = useState<VideoAnalysis | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  
  const { hotTrends, setHotTrends, isLoading, setIsLoading } = useTrendStore();

  useEffect(() => {
    // Load mock data
    setIsLoading(true);
    setTimeout(() => {
      setHotTrends(mockTrends);
      setIsLoading(false);
    }, 500);
  }, []);

  const filteredTrends = activeCategory === 'all' 
    ? hotTrends 
    : hotTrends.filter(t => t.category === activeCategory || (activeCategory === 'rising' && t.isRising));

  const handleTrendClick = async (trend: TrendItem) => {
    setSelectedTrend(trend);
    setDrawerVisible(true);
    setAnalysisLoading(true);
    
    // Mock analysis data
    setTimeout(() => {
      setAnalysis({
        id: trend.id,
        videoUrl: '',
        title: trend.title,
        author: '创作者',
        golden3Sec: {
          opening: '直接抛出痛点，引发共鸣',
          copywriting: '"你是不是也有这样的困扰..."',
          music: '紧张悬疑背景音乐',
          emotion: '引发好奇+轻微焦虑',
        },
        rhythmCurve: Array.from({ length: 30 }, (_, i) => ({
          second: i + 1,
          retentionRate: Math.max(0.3, 1 - i * 0.02),
        })),
        copyFeatures: {
          title: trend.title,
          subtitleStyle: '黄色描边字幕，配合画面节奏出现',
          hashtags: trend.tags.map(t => `#${t}`),
          keywords: ['爆款', '技巧', '干货'],
        },
        interactionTriggers: [
          '评论区提问："你遇到过这种情况吗？"',
          '引导点赞："点赞收藏，下期分享更多"',
          '制造争议：留下争议性观点引发讨论',
        ],
      });
      setAnalysisLoading(false);
    }, 1500);
  };

  const handleCollect = async (trend: TrendItem, category: string, notes?: string) => {
    await inspirationApi.createInspiration({
      title: trend.title,
      category,
      tags: trend.tags,
      notes,
      sourceUrl: `https://douyin.com/video/${trend.id}`,
    });
  };

  const handleCreateScript = (trend: TrendItem) => {
    // Navigate to create page with trend data
    window.location.href = `/create?inspiration=${trend.id}`;
  };

  return (
    <Layout>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">热点灵感引擎</h1>
        <p className="text-gray-500">实时追踪抖音热点，发现爆款创作灵感</p>
      </div>

      {/* Category Tabs */}
      <Tabs
        activeKey={activeCategory}
        onChange={setActiveCategory}
        className="mb-6"
        items={categories.map(cat => ({
          key: cat.key,
          label: (
            <span className="flex items-center gap-1">
              {cat.icon}
              {cat.label}
            </span>
          ),
        }))}
      />

      {/* Filter Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Tag color="#fe2c55" className="px-3 py-1">
            <FireOutlined className="mr-1" />
            实时更新
          </Tag>
          <span className="text-sm text-gray-500">每30分钟自动刷新</span>
        </div>
        <Button icon={<FilterOutlined />}>筛选</Button>
      </div>

      {/* Trends Grid */}
      {isLoading ? (
        <Row gutter={[24, 24]}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Col key={i} xs={24} sm={12} lg={8} xl={6}>
              <Skeleton active avatar paragraph={{ rows: 4 }} />
            </Col>
          ))}
        </Row>
      ) : filteredTrends.length > 0 ? (
        <Row gutter={[24, 24]}>
          {filteredTrends.map((trend) => (
            <Col key={trend.id} xs={24} sm={12} lg={8} xl={6}>
              <TrendCard
                trend={trend}
                onClick={handleTrendClick}
                onCollect={handleCollect}
              />
            </Col>
          ))}
        </Row>
      ) : (
        <Empty
          description="暂无数据"
          className="py-20"
        />
      )}

      {/* Inspiration Drawer */}
      <InspirationDrawer
        visible={drawerVisible}
        trend={selectedTrend}
        analysis={analysis}
        loading={analysisLoading}
        onClose={() => setDrawerVisible(false)}
        onCollect={handleCollect}
        onCreateScript={handleCreateScript}
      />
    </Layout>
  );
}
