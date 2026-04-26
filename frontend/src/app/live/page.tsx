'use client';

import { useState } from 'react';
import { Card, Button, Tabs, Statistic, Row, Col, Tag, Empty, List, Badge } from 'antd';
import {
  CrownOutlined,
  VideoCameraOutlined,
  TeamOutlined,
  GiftOutlined,
  MessageOutlined,
  ClockCircleOutlined,
  RiseOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import Layout from '@/components/Layout';
import ReactECharts from 'echarts-for-react';

// Mock live data
const mockLiveRooms = [
  {
    id: '1',
    title: '新人主播首播！分享创作经验',
    status: 'live',
    viewers: 2580,
    peakViewers: 3200,
    duration: 45,
    gifts: 1250,
    comments: 850,
  },
  {
    id: '2',
    title: '抖音运营干货分享',
    status: 'ended',
    viewers: 8500,
    peakViewers: 12000,
    duration: 120,
    gifts: 5200,
    comments: 3200,
    sales: 8500,
  },
];

export default function LivePage() {
  const [activeTab, setActiveTab] = useState('realtime');

  // Mock real-time viewer chart
  const viewerChartOption = {
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: Array.from({ length: 20 }, (_, i) => `${i * 3}min`),
    },
    yAxis: { type: 'value' },
    series: [{
      name: '在线人数',
      type: 'line',
      smooth: true,
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(254, 44, 85, 0.4)' },
            { offset: 1, color: 'rgba(254, 44, 85, 0.05)' },
          ],
        },
      },
      lineStyle: { color: '#fe2c55', width: 3 },
      itemStyle: { color: '#fe2c55' },
      data: [100, 280, 450, 620, 850, 1200, 1580, 1850, 2100, 2380, 2580, 2650, 2480, 2350, 2580, 2420, 2380, 2450, 2580, 2600],
    }],
  };

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
              <h3 className="text-lg font-semibold text-gray-900">高级版功能：直播复盘</h3>
              <p className="text-gray-500">实时直播看板、自动复盘报告、GMV数据分析</p>
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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">直播复盘</h1>
        <p className="text-gray-500">实时监控直播数据，自动生成复盘报告</p>
      </div>

      {/* Live Rooms */}
      <Row gutter={[24, 24]} className="mb-6">
        {mockLiveRooms.map((room) => (
          <Col key={room.id} xs={24} lg={12}>
            <Card
              className="shadow-sm"
              title={
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <VideoCameraOutlined />
                    <span>{room.title}</span>
                  </div>
                  {room.status === 'live' ? (
                    <Badge status="processing" text={<span className="text-[#fe2c55]">直播中</span>} />
                  ) : (
                    <Tag>已结束</Tag>
                  )}
                </div>
              }
            >
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Statistic
                    title="在线人数"
                    value={room.viewers}
                    prefix={<TeamOutlined />}
                    valueStyle={{ color: room.status === 'live' ? '#fe2c55' : '#666' }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="峰值人数"
                    value={room.peakViewers}
                    prefix={<RiseOutlined />}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="直播时长"
                    value={room.duration}
                    suffix="分钟"
                    prefix={<ClockCircleOutlined />}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="礼物收入"
                    value={room.gifts}
                    prefix={<GiftOutlined />}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="评论数"
                    value={room.comments}
                    prefix={<MessageOutlined />}
                  />
                </Col>
                {room.sales && (
                  <Col span={8}>
                    <Statistic
                      title="销售额"
                      value={room.sales}
                      prefix="¥"
                      valueStyle={{ color: '#25f4ee' }}
                    />
                  </Col>
                )}
              </Row>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Real-time Chart */}
      <Card title="实时在线人数趋势" className="shadow-sm mb-6">
        <ReactECharts option={viewerChartOption} style={{ height: 300 }} />
      </Card>

      {/* Empty State */}
      <Card className="shadow-sm">
        <Empty
          description="暂无更多直播数据"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button type="primary" className="bg-gradient-to-r from-[#fe2c55] to-[#ff6b8a] border-none">
            开始直播
          </Button>
        </Empty>
      </Card>
    </Layout>
  );
}
