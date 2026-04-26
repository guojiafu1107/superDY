'use client';

import { useState } from 'react';
import { Button, Card, Typography, Space, Tag } from 'antd';
import {
  VideoCameraOutlined,
  ThunderboltOutlined,
  BarChartOutlined,
  RocketOutlined,
  CheckCircleFilled,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const features = [
  { icon: <ThunderboltOutlined />, title: '热点灵感', desc: '实时追踪抖音热点，AI拆解爆款' },
  { icon: <VideoCameraOutlined />, title: 'AI创作', desc: '智能生成脚本，学习你的风格' },
  { icon: <RocketOutlined />, title: '智能排期', desc: '最佳时间推荐，自动发布管理' },
  { icon: <BarChartOutlined />, title: '数据洞察', desc: '深度数据分析，复盘优化' },
];

const plans = [
  {
    name: '免费版',
    price: '¥0',
    period: '/月',
    features: ['每日3次AI脚本生成', '基础热点榜单', '个人数据看板', '基础发布排期'],
    current: false,
  },
  {
    name: '高级版',
    price: '¥99',
    period: '/月',
    features: ['无限AI创作', '算法预估评分', '竞品监控', '高级数据分析', '自动化规则'],
    current: false,
    popular: true,
  },
  {
    name: '团队版',
    price: '¥299',
    period: '/月',
    features: ['多账号管理', '团队协作', '批量排期', 'API接入', '专属客服'],
    current: false,
  },
];

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleDouyinLogin = () => {
    setLoading(true);
    // Redirect to Douyin OAuth
    window.location.href = '/api/v1/auth/douyin';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#161823] via-[#1f2937] to-[#161823] flex">
      {/* Left Side - Hero */}
      <div className="hidden lg:flex flex-1 flex-col justify-center items-center text-white p-12">
        <div className="max-w-xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#fe2c55] to-[#25f4ee] flex items-center justify-center">
              <span className="text-2xl font-bold">S</span>
            </div>
            <Title level={2} className="!text-white !m-0">SuperDY</Title>
          </div>
          
          <Title level={1} className="!text-white !text-5xl !font-bold mb-6">
            抖音创作者<br />
            <span className="bg-gradient-to-r from-[#fe2c55] to-[#25f4ee] bg-clip-text text-transparent">
              AI增长工作台
            </span>
          </Title>
          
          <Paragraph className="!text-gray-400 text-lg mb-12">
            一站式AI增长工作台，覆盖热点发现、AI脚本创作、智能排期与数据分析全链路
          </Paragraph>

          <div className="grid grid-cols-2 gap-6">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-[#25f4ee]">
                  {feature.icon}
                </div>
                <div>
                  <Text className="!text-white !font-medium block">{feature.title}</Text>
                  <Text className="!text-gray-500 text-sm">{feature.desc}</Text>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Login */}
      <div className="flex-1 flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#fe2c55] to-[#25f4ee] flex items-center justify-center">
              <span className="text-xl font-bold text-white">S</span>
            </div>
            <Title level={3} className="!text-white !m-0">SuperDY</Title>
          </div>

          {/* Login Card */}
          <Card className="shadow-2xl border-0">
            <div className="text-center mb-8">
              <Title level={3} className="!mb-2">欢迎回来</Title>
              <Text className="text-gray-500">使用抖音账号快速登录</Text>
            </div>

            <Button
              type="primary"
              size="large"
              block
              loading={loading}
              onClick={handleDouyinLogin}
              className="h-12 bg-gradient-to-r from-[#fe2c55] to-[#25f4ee] border-none text-lg font-medium"
            >
              <VideoCameraOutlined className="mr-2" />
              抖音账号登录
            </Button>

            <div className="mt-6 text-center">
              <Text className="text-gray-400 text-sm">
                登录即表示同意 <a className="text-[#fe2c55]">用户协议</a> 和 <a className="text-[#fe2c55]">隐私政策</a>
              </Text>
            </div>
          </Card>

          {/* Pricing Cards */}
          <div className="mt-8 grid grid-cols-1 gap-4">
            {plans.map((plan, idx) => (
              <Card
                key={idx}
                size="small"
                className={`border transition-all hover:border-[#fe2c55] ${
                  plan.popular ? 'border-[#fe2c55] bg-[#fe2c55]/5' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Text strong className="text-lg">{plan.name}</Text>
                      {plan.popular && (
                        <Tag color="#fe2c55" className="text-xs">热门</Tag>
                      )}
                    </div>
                    <div className="flex items-baseline gap-1 mt-1">
                      <Text className="text-2xl font-bold text-[#fe2c55]">{plan.price}</Text>
                      <Text className="text-gray-400 text-sm">{plan.period}</Text>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="space-y-1">
                      {plan.features.slice(0, 2).map((f, i) => (
                        <div key={i} className="flex items-center gap-1 text-xs text-gray-500">
                          <CheckCircleFilled className="text-green-500 text-xs" />
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
