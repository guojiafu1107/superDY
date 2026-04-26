'use client';

import { useState } from 'react';
import { Card, Button, Input, List, Avatar, Tag, Statistic, Row, Col, Empty, Tooltip } from 'antd';
import {
  PlusOutlined,
  CrownOutlined,
  RiseOutlined,
  FireOutlined,
  EyeOutlined,
  HeartOutlined,
  TeamOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import Layout from '@/components/Layout';

// Mock competitor data
const mockCompetitors = [
  {
    id: '1',
    nickname: '创作达人小王',
    avatar: '',
    followersCount: 850000,
    posts7d: 12,
    avgLikes: 25000,
    growth7d: 15000,
    recentHotVideo: {
      title: '这个技巧让我一周涨粉5万',
      playCount: 2800000,
      likeCount: 185000,
    },
  },
  {
    id: '2',
    nickname: '运营笔记',
    avatar: '',
    followersCount: 520000,
    posts7d: 8,
    avgLikes: 18000,
    growth7d: 8200,
    recentHotVideo: {
      title: '2024抖音算法大揭秘',
      playCount: 1500000,
      likeCount: 95000,
    },
  },
  {
    id: '3',
    nickname: '短视频干货',
    avatar: '',
    followersCount: 380000,
    posts7d: 15,
    avgLikes: 12000,
    growth7d: 6500,
    recentHotVideo: {
      title: '新手必看！剪辑入门100招',
      playCount: 980000,
      likeCount: 62000,
    },
  },
];

export default function CompetitorPage() {
  const [competitors, setCompetitors] = useState(mockCompetitors);
  const [newCompetitorUrl, setNewCompetitorUrl] = useState('');

  return (
    <Layout>
      {/* Upgrade Prompt */}
      <div className="mb-6 p-6 bg-gradient-to-r from-[#fe2c55]/10 to-[#25f4ee]/10 rounded-2xl border border-[#fe2c55]/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#fe2c55] to-[#25f4ee] flex items-center justify-center">
              <CrownOutlined className="text-2xl text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">高级版功能：竞品监控</h3>
              <p className="text-gray-500">追踪竞品动态，发现爆款机会，自动推送分析简报</p>
            </div>
          </div>
          <Button
            type="primary"
            size="large"
            className="bg-gradient-to-r from-[#fe2c55] to-[#ff6b8a] border-none"
          >
            升级高级版
          </Button>
        </div>
      </div>

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">竞品监控</h1>
        <p className="text-gray-500">添加对标账号，追踪竞品数据表现</p>
      </div>

      {/* Add Competitor */}
      <Card className="mb-6 shadow-sm">
        <div className="flex gap-4">
          <Input
            placeholder="输入竞品抖音主页链接..."
            value={newCompetitorUrl}
            onChange={(e) => setNewCompetitorUrl(e.target.value)}
            size="large"
            className="flex-1"
            disabled
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            disabled
            className="bg-gradient-to-r from-[#fe2c55] to-[#ff6b8a] border-none"
          >
            添加监控
          </Button>
        </div>
        <p className="text-sm text-gray-400 mt-2">高级版可监控最多10个对标账号</p>
      </Card>

      {/* Competitor List */}
      <Row gutter={[24, 24]}>
        {competitors.map((competitor) => (
          <Col key={competitor.id} xs={24} lg={12}>
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <Avatar
                  size={64}
                  src={competitor.avatar}
                  className="bg-gradient-to-br from-[#fe2c55] to-[#25f4ee]"
                >
                  {competitor.nickname[0]}
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">{competitor.nickname}</h3>
                    <Tag color="green" icon={<RiseOutlined />}>
                      +{(competitor.growth7d / 1000).toFixed(1)}k/7天
                    </Tag>
                  </div>
                  
                  <Row gutter={16} className="mb-4">
                    <Col span={8}>
                      <Statistic
                        title="粉丝数"
                        value={competitor.followersCount}
                        suffix="万"
                        formatter={(v) => (Number(v) / 10000).toFixed(1)}
                        valueStyle={{ fontSize: 16 }}
                      />
                    </Col>
                    <Col span={8}>
                      <Statistic
                        title="7天发布"
                        value={competitor.posts7d}
                        suffix="条"
                        valueStyle={{ fontSize: 16 }}
                      />
                    </Col>
                    <Col span={8}>
                      <Statistic
                        title="平均点赞"
                        value={competitor.avgLikes}
                        formatter={(v) => (Number(v) / 1000).toFixed(1) + 'k'}
                        valueStyle={{ fontSize: 16 }}
                      />
                    </Col>
                  </Row>

                  {/* Recent Hot Video */}
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <FireOutlined className="text-[#fe2c55]" />
                      <span className="text-sm font-medium">近期爆款</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2 line-clamp-1">
                      {competitor.recentHotVideo.title}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span><EyeOutlined /> {(competitor.recentHotVideo.playCount / 10000).toFixed(0)}w播放</span>
                      <span><HeartOutlined /> {(competitor.recentHotVideo.likeCount / 1000).toFixed(0)}k点赞</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Empty State */}
      {competitors.length === 0 && (
        <Empty
          description="暂无监控账号"
          className="py-20"
        />
      )}
    </Layout>
  );
}
