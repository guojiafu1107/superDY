'use client';

import { FireOutlined, RiseOutlined, PlayCircleOutlined, HeartOutlined } from '@ant-design/icons';
import { Card, Tag, Badge } from 'antd';
import { TrendItem } from '@/types';

interface TrendCardProps {
  trend: TrendItem;
  onClick?: (trend: TrendItem) => void;
  onCollect?: (trend: TrendItem) => void;
}

export default function TrendCard({ trend, onClick, onCollect }: TrendCardProps) {
  const getHotColor = (rank: number) => {
    if (rank === 1) return 'from-red-500 to-orange-500';
    if (rank === 2) return 'from-orange-400 to-yellow-400';
    if (rank === 3) return 'from-yellow-400 to-amber-300';
    return 'from-gray-400 to-gray-300';
  };

  const getRankIcon = (rank: number) => {
    if (rank <= 3) {
      return (
        <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${getHotColor(rank)} flex items-center justify-center text-white text-xs font-bold`}>
          {rank}
        </div>
      );
    }
    return (
      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-medium">
        {rank}
      </div>
    );
  };

  return (
    <Card
      className="trend-card cursor-pointer overflow-hidden"
      onClick={() => onClick?.(trend)}
      bodyStyle={{ padding: 0 }}
    >
      <div className="relative">
        {/* Cover Image */}
        <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
          {trend.coverUrl ? (
            <img
              src={trend.coverUrl}
              alt={trend.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <PlayCircleOutlined className="text-4xl text-gray-300" />
            </div>
          )}
          
          {/* Hot Badge */}
          {trend.isRising && (
            <div className="absolute top-2 left-2">
              <Badge.Ribbon
                text="🔥 快追"
                color="#fe2c55"
                className="hot-badge"
              />
            </div>
          )}

          {/* Rank Badge */}
          <div className="absolute top-2 right-2">
            {getRankIcon(trend.rank)}
          </div>

          {/* Overlay Stats */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
            <div className="flex items-center gap-4 text-white text-xs">
              <span className="flex items-center gap-1">
                <PlayCircleOutlined />
                {(trend.viewCount || 0).toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <HeartOutlined />
                {(trend.videoCount || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-medium text-gray-900 line-clamp-2 mb-2 hover:text-[#fe2c55] transition-colors">
            {trend.title}
          </h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FireOutlined className="text-[#fe2c55]" />
              <span className="text-sm text-gray-600">
                {(trend.hotValue / 10000).toFixed(1)}w 热度
              </span>
            </div>
            
            {trend.isRising && (
              <div className="flex items-center gap-1 text-green-500 text-xs">
                <RiseOutlined />
                <span>飙升</span>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mt-3">
            {trend.tags.slice(0, 3).map((tag) => (
              <Tag key={tag} className="text-xs bg-gray-100 text-gray-600 border-none">
                #{tag}
              </Tag>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
