'use client';

import { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Tabs, List, Tag, Progress, Empty, Select, DatePicker } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  UserOutlined,
  PlayCircleOutlined,
  HeartOutlined,
  MessageOutlined,
  ShareAltOutlined,
  RiseOutlined,
  VideoCameraOutlined,
  FireOutlined,
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import Layout from '@/components/Layout';
import { DashboardOverview, AudienceProfile, VideoAnalytics } from '@/types';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

// Mock data
const mockDashboard: DashboardOverview = {
  followersCount: 125800,
  followersGrowth7d: 3250,
  totalPlays30d: 2850000,
  avgEngagementRate: 8.5,
};

const mockAudience: AudienceProfile = {
  ageDistribution: { '18-24': 25, '25-30': 35, '31-35': 25, '36-40': 10, '40+': 5 },
  genderRatio: { male: 42, female: 58 },
  cityTiers: { 'tier1': 30, 'tier2': 35, 'tier3': 20, 'tier4+': 15 },
  interestTags: [
    { tag: '科技数码', percentage: 35 },
    { tag: '生活方式', percentage: 28 },
    { tag: '职场成长', percentage: 22 },
    { tag: '教育学习', percentage: 15 },
  ],
};

const mockVideoAnalytics: VideoAnalytics[] = [
  {
    videoId: '1',
    playCount: 520000,
    likeCount: 28500,
    commentCount: 1850,
    shareCount: 3200,
    completionRateCurve: Array.from({ length: 30 }, (_, i) => ({
      second: i + 1,
      rate: Math.max(0.15, 0.95 - i * 0.025 + Math.random() * 0.05),
    })),
    trafficSources: { recommend: 65, search: 15, profile: 12, follow: 8 },
    audienceProfile: mockAudience,
    hotComments: [
      { word: '干货', count: 156, sentiment: 'positive' },
      { word: '学到了', count: 128, sentiment: 'positive' },
      { word: '收藏', count: 98, sentiment: 'positive' },
      { word: '不错', count: 87, sentiment: 'positive' },
      { word: '太短', count: 45, sentiment: 'neutral' },
    ],
  },
  {
    videoId: '2',
    playCount: 380000,
    likeCount: 18500,
    commentCount: 1200,
    shareCount: 2100,
    completionRateCurve: Array.from({ length: 30 }, (_, i) => ({
      second: i + 1,
      rate: Math.max(0.12, 0.88 - i * 0.028 + Math.random() * 0.05),
    })),
    trafficSources: { recommend: 58, search: 20, profile: 14, follow: 8 },
    audienceProfile: mockAudience,
    hotComments: [
      { word: '实用', count: 134, sentiment: 'positive' },
      { word: '感谢', count: 98, sentiment: 'positive' },
      { word: '明白', count: 76, sentiment: 'positive' },
    ],
  },
  {
    videoId: '3',
    playCount: 180000,
    likeCount: 8500,
    commentCount: 520,
    shareCount: 890,
    completionRateCurve: Array.from({ length: 30 }, (_, i) => ({
      second: i + 1,
      rate: Math.max(0.1, 0.82 - i * 0.03 + Math.random() * 0.05),
    })),
    trafficSources: { recommend: 55, search: 18, profile: 17, follow: 10 },
    audienceProfile: mockAudience,
    hotComments: [
      { word: '有用', count: 89, sentiment: 'positive' },
      { word: '试试', count: 67, sentiment: 'neutral' },
    ],
  },
];

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedVideo, setSelectedVideo] = useState<VideoAnalytics>(mockVideoAnalytics[0]);

  // Completion rate chart option
  const completionRateOption = {
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: selectedVideo.completionRateCurve.map(p => `${p.second}s`),
    },
    yAxis: {
      type: 'value',
      axisLabel: { formatter: '{value}%' },
    },
    series: [{
      name: '完播率',
      type: 'line',
      smooth: true,
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(254, 44, 85, 0.3)' },
            { offset: 1, color: 'rgba(254, 44, 85, 0.05)' },
          ],
        },
      },
      lineStyle: { color: '#fe2c55', width: 3 },
      itemStyle: { color: '#fe2c55' },
      data: selectedVideo.completionRateCurve.map(p => (p.rate * 100).toFixed(1)),
    }],
  };

  // Traffic source pie chart
  const trafficSourceOption = {
    tooltip: { trigger: 'item' },
    legend: { bottom: '5%' },
    series: [{
      name: '流量来源',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
      label: { show: false },
      data: [
        { value: selectedVideo.trafficSources.recommend, name: '推荐', itemStyle: { color: '#fe2c55' } },
        { value: selectedVideo.trafficSources.search, name: '搜索', itemStyle: { color: '#25f4ee' } },
        { value: selectedVideo.trafficSources.profile, name: '主页', itemStyle: { color: '#ffad1f' } },
        { value: selectedVideo.trafficSources.follow, name: '关注', itemStyle: { color: '#9747ff' } },
      ],
    }],
  };

  // Age distribution chart
  const ageDistributionOption = {
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: Object.keys(mockAudience.ageDistribution) },
    yAxis: { type: 'value', axisLabel: { formatter: '{value}%' } },
    series: [{
      data: Object.values(mockAudience.ageDistribution),
      type: 'bar',
      itemStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: '#fe2c55' },
            { offset: 1, color: '#25f4ee' },
          ],
        },
        borderRadius: [8, 8, 0, 0],
      },
    }],
  };

  return (
    <Layout>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">深度数据洞察</h1>
          <p className="text-gray-500">全维度数据分析，辅助策略决策</p>
        </div>
        <RangePicker defaultValue={[dayjs().subtract(30, 'day'), dayjs()]} />
      </div>

      {/* Overview Stats */}
      <Row gutter={[24, 24]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm">
            <Statistic
              title="粉丝总数"
              value={mockDashboard.followersCount}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
            <div className="flex items-center gap-1 mt-2 text-green-600">
              <ArrowUpOutlined />
              <span>+{mockDashboard.followersGrowth7d} (7日)</span>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm">
            <Statistic
              title="30天播放总量"
              value={mockDashboard.totalPlays30d}
              prefix={<PlayCircleOutlined />}
              valueStyle={{ color: '#fe2c55' }}
            />
            <div className="flex items-center gap-1 mt-2 text-green-600">
              <ArrowUpOutlined />
              <span>+23.5%</span>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm">
            <Statistic
              title="平均互动率"
              value={mockDashboard.avgEngagementRate}
              suffix="%"
              prefix={<HeartOutlined />}
              valueStyle={{ color: '#25f4ee' }}
            />
            <div className="flex items-center gap-1 mt-2 text-green-600">
              <ArrowUpOutlined />
              <span>+1.2%</span>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm">
            <Statistic
              title="作品总数"
              value={128}
              prefix={<VideoCameraOutlined />}
            />
            <div className="flex items-center gap-1 mt-2 text-gray-500">
              <span>本月发布 12 条</span>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Main Content Tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'overview',
            label: '账号概览',
            children: (
              <Row gutter={[24, 24]}>
                {/* Audience Demographics */}
                <Col xs={24} lg={12}>
                  <Card title="粉丝年龄分布" className="shadow-sm">
                    <ReactECharts option={ageDistributionOption} style={{ height: 300 }} />
                  </Card>
                </Col>
                <Col xs={24} lg={12}>
                  <Card title="粉丝性别比例" className="shadow-sm">
                    <div className="flex items-center justify-center h-[300px]">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-8">
                          <div className="text-center">
                            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                              <span className="text-3xl font-bold text-blue-600">
                                {mockAudience.genderRatio.male}%
                              </span>
                            </div>
                            <span className="text-gray-600">男性</span>
                          </div>
                          <div className="text-center">
                            <div className="w-24 h-24 rounded-full bg-pink-100 flex items-center justify-center mb-3">
                              <span className="text-3xl font-bold text-pink-600">
                                {mockAudience.genderRatio.female}%
                              </span>
                            </div>
                            <span className="text-gray-600">女性</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Col>
                {/* Interest Tags */}
                <Col xs={24}>
                  <Card title="粉丝兴趣标签" className="shadow-sm">
                    <div className="flex flex-wrap gap-3">
                      {mockAudience.interestTags.map((item) => (
                        <div key={item.tag} className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full">
                          <span className="font-medium">{item.tag}</span>
                          <Progress
                            percent={item.percentage}
                            size="small"
                            showInfo={false}
                            strokeColor="#fe2c55"
                            className="w-16"
                          />
                          <span className="text-sm text-gray-500">{item.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </Col>
              </Row>
            ),
          },
          {
            key: 'videos',
            label: '单视频复盘',
            children: (
              <Row gutter={[24, 24]}>
                {/* Video List */}
                <Col xs={24} lg={8}>
                  <Card title="作品列表" className="shadow-sm h-full">
                    <List
                      dataSource={mockVideoAnalytics}
                      renderItem={(video) => (
                        <List.Item
                          className={`cursor-pointer rounded-lg mb-2 p-3 ${
                            selectedVideo.videoId === video.videoId ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setSelectedVideo(video)}
                        >
                          <div className="flex items-center gap-4 w-full">
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                              <VideoCameraOutlined className="text-2xl text-gray-400" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium line-clamp-1">视频 {video.videoId}</p>
                              <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                <span><PlayCircleOutlined /> {(video.playCount / 10000).toFixed(1)}w</span>
                                <span><HeartOutlined /> {(video.likeCount / 1000).toFixed(1)}k</span>
                              </div>
                            </div>
                          </div>
                        </List.Item>
                      )}
                    />
                  </Card>
                </Col>
                {/* Video Analytics Detail */}
                <Col xs={24} lg={16}>
                  <Card title="完播率曲线" className="shadow-sm mb-6">
                    <ReactECharts option={completionRateOption} style={{ height: 300 }} />
                    <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <FireOutlined className="mr-2" />
                        <strong>分析建议：</strong>视频在5秒和18秒处有明显流失，建议优化开场节奏和中间转折点内容
                      </p>
                    </div>
                  </Card>
                  <Row gutter={[24, 24]}>
                    <Col xs={24} sm={12}>
                      <Card title="流量来源" className="shadow-sm">
                        <ReactECharts option={trafficSourceOption} style={{ height: 250 }} />
                      </Card>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Card title="热词评论云" className="shadow-sm">
                        <div className="flex flex-wrap gap-2 p-4">
                          {selectedVideo.hotComments.map((item) => (
                            <Tag
                              key={item.word}
                              color={item.sentiment === 'positive' ? 'green' : item.sentiment === 'negative' ? 'red' : 'default'}
                              style={{ fontSize: Math.max(12, Math.min(20, item.count / 10)) }}
                            >
                              {item.word} ({item.count})
                            </Tag>
                          ))}
                        </div>
                      </Card>
                    </Col>
                  </Row>
                </Col>
              </Row>
            ),
          },
        ]}
      />
    </Layout>
  );
}
