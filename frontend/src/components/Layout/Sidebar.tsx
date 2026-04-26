'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  BulbOutlined,
  EditOutlined,
  CalendarOutlined,
  BarChartOutlined,
  TeamOutlined,
  VideoCameraOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CrownOutlined,
} from '@ant-design/icons';
import { Menu, Badge, Tooltip } from 'antd';
import { useUserStore } from '@/stores/userStore';

const menuItems = [
  {
    key: '/',
    icon: <BulbOutlined />,
    label: '热点灵感',
    path: '/',
  },
  {
    key: '/create',
    icon: <EditOutlined />,
    label: 'AI创作工坊',
    path: '/create',
  },
  {
    key: '/publish',
    icon: <CalendarOutlined />,
    label: '发布排期',
    path: '/publish',
  },
  {
    key: '/analytics',
    icon: <BarChartOutlined />,
    label: '数据中心',
    path: '/analytics',
  },
  {
    key: '/competitor',
    icon: <TeamOutlined />,
    label: '竞品监控',
    path: '/competitor',
    badge: 'PRO',
  },
  {
    key: '/live',
    icon: <VideoCameraOutlined />,
    label: '直播复盘',
    path: '/live',
    badge: 'PRO',
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { user } = useUserStore();
  
  const isPro = user?.planType === 'pro' || user?.planType === 'team';

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-[#161823] transition-all duration-300 z-50 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#fe2c55] to-[#25f4ee] flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-white font-semibold text-lg">SuperDY</span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-white/70 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </button>
      </div>

      {/* Menu */}
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[pathname]}
        inlineCollapsed={collapsed}
        className="bg-transparent border-none pt-4"
        items={menuItems.map((item) => ({
          key: item.key,
          icon: item.icon,
          label: (
            <Link href={item.path} className="flex items-center justify-between">
              <span>{item.label}</span>
              {item.badge && (
                isPro ? (
                  <CrownOutlined className="text-yellow-400 text-xs" />
                ) : (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-gradient-to-r from-[#fe2c55] to-[#25f4ee] text-white">
                    PRO
                  </span>
                )
              )}
            </Link>
          ),
        }))}
      />

      {/* User Card */}
      {!collapsed && user && (
        <div className="absolute bottom-4 left-4 right-4 p-4 bg-white/5 rounded-xl">
          <div className="flex items-center gap-3">
            <img
              src={user.avatarUrl || '/default-avatar.png'}
              alt={user.nickname}
              className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
            />
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">{user.nickname}</p>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  user.planType === 'pro' 
                    ? 'bg-yellow-500/20 text-yellow-400' 
                    : user.planType === 'team'
                    ? 'bg-purple-500/20 text-purple-400'
                    : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {user.planType === 'free' ? '免费版' : user.planType === 'pro' ? '高级版' : '团队版'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
