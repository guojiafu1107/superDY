'use client';

import { useState } from 'react';
import {
  Drawer,
  Tabs,
  Timeline,
  Tag,
  Button,
  Input,
  message,
  Skeleton,
} from 'antd';
import {
  SaveOutlined,
  CopyOutlined,
  RocketOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  VideoCameraOutlined,
  MessageOutlined,
  TagsOutlined,
} from '@ant-design/icons';
import { TrendItem, VideoAnalysis } from '@/types';

interface InspirationDrawerProps {
  visible: boolean;
  trend: TrendItem | null;
  analysis: VideoAnalysis | null;
  loading: boolean;
  onClose: () => void;
  onCollect: (trend: TrendItem, category: string, notes?: string) => void;
  onCreateScript: (trend: TrendItem) => void;
}

const { TextArea } = Input;

export default function InspirationDrawer({
  visible,
  trend,
  analysis,
  loading,
  onClose,
  onCollect,
  onCreateScript,
}: InspirationDrawerProps) {
  const [activeTab, setActiveTab] = useState('breakdown');
  const [category, setCategory] = useState('脚本参考');
  const [notes, setNotes] = useState('');

  const handleCollect = () => {
    if (trend) {
      onCollect(trend, category, notes);
      message.success('已收藏到灵感夹');
    }
  };

  const categories = ['追热点', '脚本参考', '运镜参考', '音乐参考'];

  return (
    <Drawer
      title={
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold">爆款视频拆解</span>
          {trend?.isRising && (
            <Tag color="#fe2c55" className="hot-badge">🔥 快追</Tag>
          )}
        </div>
      }
      placement="right"
      width={600}
      onClose={onClose}
      open={visible}
      extra={
        <div className="flex gap-2">
          <Button
            icon={<SaveOutlined />}
            onClick={handleCollect}
          >
            收藏
          </Button>
          <Button
            type="primary"
            icon={<RocketOutlined />}
            className="bg-gradient-to-r from-[#fe2c55] to-[#25f4ee] border-none"
            onClick={() => trend && onCreateScript(trend)}
          >
            创作同款
          </Button>
        </div>
      }
    >
      {loading ? (
        <Skeleton active paragraph={{ rows: 10 }} />
      ) : (
        <>
          {/* Video Info */}
          {trend && (
            <div className="mb-6 p-4 bg-gray-50 rounded-xl">
              <h3 className="font-medium text-lg mb-2">{trend.title}</h3>
              <div className="flex flex-wrap gap-2">
                {trend.tags.map((tag) => (
                  <Tag key={tag} color="blue">#{tag}</Tag>
                ))}
              </div>
            </div>
          )}

          {/* Collection Settings */}
          <div className="mb-6 p-4 bg-blue-50 rounded-xl">
            <h4 className="text-sm font-medium text-gray-700 mb-3">收藏设置</h4>
            <div className="flex flex-wrap gap-2 mb-3">
              {categories.map((cat) => (
                <Tag
                  key={cat}
                  color={category === cat ? '#fe2c55' : 'default'}
                  className="cursor-pointer"
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </Tag>
              ))}
            </div>
            <TextArea
              placeholder="添加备注..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="bg-white"
            />
          </div>

          {/* Analysis Tabs */}
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              {
                key: 'breakdown',
                label: '视频拆解',
                children: analysis ? (
                  <Timeline
                    mode="left"
                    items={[
                      {
                        label: '黄金3秒',
                        dot: <RocketOutlined className="text-[#fe2c55]" />,
                        children: (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p><strong>开场：</strong>{analysis.golden3Sec.opening}</p>
                            <p><strong>文案：</strong>{analysis.golden3Sec.copywriting}</p>
                            <p><strong>音乐：</strong>{analysis.golden3Sec.music}</p>
                            <p><strong>情绪：</strong>{analysis.golden3Sec.emotion}</p>
                          </div>
                        ),
                      },
                      {
                        label: '文案特征',
                        dot: <FileTextOutlined className="text-blue-500" />,
                        children: (
                          <div className="space-y-2">
                            <p><strong>标题：</strong>{analysis.copyFeatures.title}</p>
                            <p><strong>字幕样式：</strong>{analysis.copyFeatures.subtitleStyle}</p>
                            <div className="flex flex-wrap gap-1">
                              {analysis.copyFeatures.hashtags.map((tag) => (
                                <Tag key={tag} color="blue">{tag}</Tag>
                              ))}
                            </div>
                          </div>
                        ),
                      },
                      {
                        label: '互动诱因',
                        dot: <MessageOutlined className="text-green-500" />,
                        children: (
                          <ul className="list-disc list-inside space-y-1">
                            {analysis.interactionTriggers.map((trigger, idx) => (
                              <li key={idx} className="text-gray-700">{trigger}</li>
                            ))}
                          </ul>
                        ),
                      },
                    ]}
                  />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <VideoCameraOutlined className="text-4xl mb-4" />
                    <p>暂无拆解数据</p>
                  </div>
                ),
              },
              {
                key: 'rhythm',
                label: '完播率曲线',
                children: (
                  <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center">
                    <p className="text-gray-500">完播率曲线图表</p>
                  </div>
                ),
              },
            ]}
          />
        </>
      )}
    </Drawer>
  );
}
