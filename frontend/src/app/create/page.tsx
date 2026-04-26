'use client';

import { useState, useEffect } from 'react';
import { Row, Col, Card, Tag, Button, Empty, message } from 'antd';
import {
  BulbOutlined,
  HistoryOutlined,
  UserOutlined,
  TagsOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import Layout from '@/components/Layout';
import ScriptEditor from '@/components/Create/ScriptEditor';
import { useScriptStore } from '@/stores/scriptStore';
import { scriptApi, styleApi } from '@/lib/api';
import { Script, StyleProfile } from '@/types';

// Mock style profile
const mockStyleProfile: StyleProfile = {
  userId: '1',
  tags: ['幽默口语', '知识密度高', '亲切自然', '数据支撑'],
  features: {
    sentenceLength: 'medium',
    toneWords: ['你知道吗', '其实', '重点来了', '总结一下'],
    jargonFrequency: 'medium',
    humorLevel: 7,
    knowledgeDensity: 8,
  },
};

// Mock inspirations
const mockInspirations = [
  { id: '1', title: '爆款视频拆解：AI工具创作秘籍', category: '脚本参考' },
  { id: '2', title: '30天涨粉10万的核心方法', category: '追热点' },
  { id: '3', title: '短视频剪辑转场技巧100个', category: '运镜参考' },
];

export default function CreatePage() {
  const [styleProfile, setStyleProfile] = useState<StyleProfile | null>(mockStyleProfile);
  const [isAnalyzingStyle, setIsAnalyzingStyle] = useState(false);
  
  const {
    currentScript,
    setCurrentScript,
    isGenerating,
    setIsGenerating,
    addScript,
  } = useScriptStore();

  const handleAnalyzeStyle = async () => {
    setIsAnalyzingStyle(true);
    // Mock API call
    setTimeout(() => {
      setStyleProfile(mockStyleProfile);
      setIsAnalyzingStyle(false);
      message.success('风格分析完成');
    }, 2000);
  };

  const handleGenerateScript = async (params: {
    topic: string;
    duration: number;
    tone: string;
    targetAudience?: string;
    useWebSearch: boolean;
  }) => {
    setIsGenerating(true);
    
    // Mock generation
    setTimeout(() => {
      const newScript: Script = {
        id: Date.now().toString(),
        userId: '1',
        topic: params.topic,
        duration: params.duration,
        tone: params.tone,
        targetAudience: params.targetAudience,
        content: {
          hook: {
            timeRange: '0-3s',
            content: generateHook(params.topic, params.tone),
            visualDesc: '特写镜头+悬念背景音乐',
            duration: 3,
          },
          core: generateCoreContent(params.topic, params.duration),
          cta: {
            timeRange: `${params.duration - 5}s-${params.duration}s`,
            content: generateCTA(params.tone),
            visualDesc: '真人出镜+引导手势',
            duration: 5,
          },
        },
        status: 'draft',
        createdAt: new Date().toISOString(),
      };
      
      setCurrentScript(newScript);
      setIsGenerating(false);
      message.success('脚本生成成功');
    }, 3000);
  };

  const generateHook = (topic: string, tone: string): string => {
    const hooks: Record<string, string[]> = {
      humorous: [
        `关于${topic}，我发现了一个超搞笑的事情...`,
        `今天我要揭秘${topic}，可能会得罪很多人...`,
      ],
      professional: [
        `${topic}的核心秘诀，只有1%的人知道`,
        `做了3年${topic}，今天分享我的全部经验`,
      ],
      warm: [
        `如果你也在纠结${topic}，这条视频一定要看完`,
        `关于${topic}，我想和你聊聊心里话`,
      ],
      excited: [
        `太激动了！${topic}终于被我搞定了！`,
        `${topic}这个方法真的太牛了！`,
      ],
    };
    const toneHooks = hooks[tone] || hooks.professional;
    return toneHooks[Math.floor(Math.random() * toneHooks.length)];
  };

  const generateCoreContent = (topic: string, duration: number): Script['content']['core'] => {
    const segments: Script['content']['core'] = [];
    const segmentCount = Math.floor(duration / 10);
    
    for (let i = 0; i < segmentCount; i++) {
      const start = 3 + i * ((duration - 8) / segmentCount);
      const end = start + ((duration - 8) / segmentCount);
      
      segments.push({
        timeRange: `${Math.floor(start)}-${Math.floor(end)}s`,
        content: `第${i + 1}部分：${topic}的关键要点${i + 1}，这里详细展开说明...`,
        visualDesc: ['素材混剪', '数据图表展示', '真人演示', '字幕强调'][i % 4],
        duration: Math.floor((duration - 8) / segmentCount),
      });
    }
    
    return segments;
  };

  const generateCTA = (tone: string): string => {
    const ctas: Record<string, string[]> = {
      humorous: ['觉得有用就点个赞吧，咱们下期见！', '关注我，带你发现更多有趣内容！'],
      professional: ['点赞收藏，下期分享更多干货！', '关注我，一起学习成长！'],
      warm: ['如果对你有帮助，记得点赞支持哦~', '关注我，陪你一起成长~'],
      excited: ['这个方法太棒了！赶紧点赞收藏！', '关注我，更多干货等着你！'],
    };
    const toneCTAs = ctas[tone] || ctas.professional;
    return toneCTAs[Math.floor(Math.random() * toneCTAs.length)];
  };

  const handleSaveScript = (script: Script) => {
    addScript(script);
    message.success('脚本已保存');
  };

  const handleGenerateVariants = () => {
    message.info('多版本生成功能开发中...');
  };

  return (
    <Layout>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">AI智能创作工坊</h1>
        <p className="text-gray-500">基于你的风格，AI辅助生成高质量脚本</p>
      </div>

      <Row gutter={[24, 24]}>
        {/* Left Column - Settings & Editor */}
        <Col xs={24} lg={16}>
          <ScriptEditor
            script={currentScript}
            isGenerating={isGenerating}
            onGenerate={handleGenerateScript}
            onSave={handleSaveScript}
            onGenerateVariants={handleGenerateVariants}
          />
        </Col>

        {/* Right Column - Style & Inspirations */}
        <Col xs={24} lg={8}>
          <div className="space-y-6">
            {/* Style Profile */}
            <Card
              title={
                <div className="flex items-center gap-2">
                  <UserOutlined />
                  <span>我的风格档案</span>
                </div>
              }
              extra={
                <Button
                  size="small"
                  loading={isAnalyzingStyle}
                  onClick={handleAnalyzeStyle}
                >
                  重新分析
                </Button>
              }
              className="shadow-sm"
            >
              {styleProfile ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">风格标签</p>
                    <div className="flex flex-wrap gap-2">
                      {styleProfile.tags.map((tag) => (
                        <Tag key={tag} color="#fe2c55">{tag}</Tag>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">幽默程度</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#fe2c55] to-[#25f4ee]"
                            style={{ width: `${styleProfile.features.humorLevel * 10}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{styleProfile.features.humorLevel}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">知识密度</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#25f4ee] to-[#fe2c55]"
                            style={{ width: `${styleProfile.features.knowledgeDensity * 10}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{styleProfile.features.knowledgeDensity}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-2">高频用词</p>
                    <div className="flex flex-wrap gap-1">
                      {styleProfile.features.toneWords.map((word) => (
                        <Tag key={word} className="text-xs">{word}</Tag>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Empty description="暂无风格数据">
                  <Button type="primary" onClick={handleAnalyzeStyle} loading={isAnalyzingStyle}>
                    分析我的风格
                  </Button>
                </Empty>
              )}
            </Card>

            {/* Inspiration Library */}
            <Card
              title={
                <div className="flex items-center gap-2">
                  <BulbOutlined />
                  <span>灵感素材</span>
                </div>
              }
              extra={<Button type="link" size="small">查看全部</Button>}
              className="shadow-sm"
            >
              <div className="space-y-3">
                {mockInspirations.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <p className="font-medium text-sm text-gray-900 line-clamp-2">{item.title}</p>
                    <Tag size="small" className="mt-2">{item.category}</Tag>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Scripts */}
            <Card
              title={
                <div className="flex items-center gap-2">
                  <HistoryOutlined />
                  <span>最近创作</span>
                </div>
              }
              className="shadow-sm"
            >
              <Empty description="暂无历史脚本" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </Card>
          </div>
        </Col>
      </Row>
    </Layout>
  );
}
