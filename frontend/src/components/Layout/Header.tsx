'use client';

import { useState } from 'react';
import {
  BellOutlined,
  SearchOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { Input, Badge, Button, Dropdown, Avatar, Tooltip } from 'antd';
import { useUserStore } from '@/stores/userStore';

export default function Header() {
  const { user, logout } = useUserStore();
  const [searchQuery, setSearchQuery] = useState('');

  const userMenuItems = [
    {
      key: 'profile',
      label: '个人设置',
    },
    {
      key: 'accounts',
      label: '账号管理',
    },
    {
      key: 'subscription',
      label: '订阅管理',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: '退出登录',
      danger: true,
      onClick: logout,
    },
  ];

  return (
    <header className="h-16 bg-white border-b border-gray-200 fixed top-0 right-0 left-64 z-40 flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex-1 max-w-xl">
        <Input
          prefix={<SearchOutlined className="text-gray-400" />}
          placeholder="搜索灵感素材、脚本、发布历史..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-gray-50 border-none rounded-full"
          size="large"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Quick Create */}
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="bg-gradient-to-r from-[#fe2c55] to-[#ff6b8a] border-none rounded-full"
        >
          快速创作
        </Button>

        {/* Notifications */}
        <Badge count={5} size="small">
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <BellOutlined className="text-xl text-gray-600" />
          </button>
        </Badge>

        {/* Help */}
        <Tooltip title="帮助中心">
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <QuestionCircleOutlined className="text-xl text-gray-600" />
          </button>
        </Tooltip>

        {/* User Avatar */}
        {user && (
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
              <Avatar
                src={user.avatarUrl}
                size="large"
                className="border-2 border-[#fe2c55]/20"
              />
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">{user.nickname}</p>
                <p className="text-xs text-gray-500">创作者</p>
              </div>
            </div>
          </Dropdown>
        )}
      </div>
    </header>
  );
}
