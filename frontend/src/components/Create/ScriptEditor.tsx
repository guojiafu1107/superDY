'use client';

import { useState } from 'react';
import {
  Card,
  Input,
  Select,
  Button,
  Slider,
  Tag,
  Radio,
  Space,
  Divider,
  Tooltip,
  message,
} from 'antd';
import {
  EditOutlined,
  ClockCircleOutlined,
  FireOutlined,
  GlobalOutlined,
  ThunderboltOutlined,
  CopyOutlined,
  ExportOutlined,
  RedoOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { Script, ScriptSegment } from '@/types';

const { TextArea } = Input;
const { Option } = Select;

interface ScriptEditorProps {
  script: Script | null;
  isGenerating: boolean;
  onGenerate: (params: {
    topic: string;
    duration: number;
    tone: string;
    targetAudience?: string;
    useWebSearch: boolean;
  }) => void;
  onSave: (script: Script) => void;
  onGenerateVariants: () => void;
}

const toneOptions = [
  { value: 'humorous', label: '幽默搞笑', emoji: '😄' },
  { value: 'professional', label: '专业干货', emoji: '📚' },
  { value: 'warm', label: '温暖治愈', emoji: '💝' },
  { value: 'excited', label: '激情澎湃', emoji: '🔥' },
  { value: 'mysterious', label: '悬疑好奇', emoji: '🤔' },
  { value: 'emotional', label: '情感共鸣', emoji: '💭' },
];

const durationOptions = [
  { value: 15, label: '15秒', desc: '黄金短视频' },
  { value: 30, label: '30秒', desc: '热门时长' },
  { value: 60, label: '60秒', desc: '中视频' },
  { value: 120, label: '2分钟+', desc: '深度内容' },
];

export default function ScriptEditor({
  script,
  isGenerating,
  onGenerate,
  onSave,
  onGenerateVariants,
}: ScriptEditorProps) {
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState(30);
  const [tone, setTone] = useState('professional');
  const [targetAudience, setTargetAudience] = useState('');
  const [useWebSearch, setUseWebSearch] = useState(false);

  const handleGenerate = () => {
    if (!topic.trim()) {
      message.error('请输入创作主题');
      return;
    }
    onGenerate({
      topic,
      duration,
      tone,
      targetAudience,
      useWebSearch,
    });
  };

  const handleCopy = () => {
    if (script) {
      const text = formatScriptToText(script);
      navigator.clipboard.writeText(text);
      message.success('已复制到剪贴板');
    }
  };

  const formatScriptToText = (script: Script): string => {
    let text = `主题：${script.topic}\n`;
    text += `时长：${script.duration}秒\n`;
    text += `风格：${toneOptions.find(t => t.value === script.tone)?.label}\n\n`;
    
    if (script.content.hook) {
      text += `【黄金3秒 - 钩子】\n`;
      text += `${script.content.hook.timeRange} ${script.content.hook.content}\n`;
      text += `画面：${script.content.hook.visualDesc}\n\n`;
    }
    
    text += `【核心内容】\n`;
    script.content.core.forEach((segment, idx) => {
      text += `${segment.timeRange} ${segment.content}\n`;
      text += `画面：${segment.visualDesc}\n\n`;
    });
    
    if (script.content.cta) {
      text += `【互动引导】\n`;
      text += `${script.content.cta.timeRange} ${script.content.cta.content}\n`;
      text += `画面：${script.content.cta.visualDesc}\n`;
    }
    
    return text;
  };

  return (
    <div className="space-y-6">
      {/* Settings Panel */}
      <Card className="bg-white shadow-sm">
        <div className="space-y-6">
          {/* Topic Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <EditOutlined className="mr-2" />
              创作主题 / 关键词
            </label>
            <TextArea
              placeholder="输入你想创作的主题，例如：如何30天涨粉10万..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              rows={3}
              className="text-base"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <ClockCircleOutlined className="mr-2" />
              目标时长
            </label>
            <Radio.Group
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              optionType="button"
              buttonStyle="solid"
              className="w-full"
            >
              <div className="grid grid-cols-4 gap-3">
                {durationOptions.map((opt) => (
                  <Radio.Button
                    key={opt.value}
                    value={opt.value}
                    className="text-center h-auto py-2"
                  >
                    <div className="font-medium">{opt.label}</div>
                    <div className="text-xs text-gray-500">{opt.desc}</div>
                  </Radio.Button>
                ))}
              </div>
            </Radio.Group>
          </div>

          {/* Tone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FireOutlined className="mr-2" />
              情绪基调
            </label>
            <div className="flex flex-wrap gap-2">
              {toneOptions.map((opt) => (
                <Tag
                  key={opt.value}
                  color={tone === opt.value ? '#fe2c55' : 'default'}
                  className="cursor-pointer px-4 py-2 text-base"
                  onClick={() => setTone(opt.value)}
                >
                  <span className="mr-1">{opt.emoji}</span>
                  {opt.label}
                </Tag>
              ))}
            </div>
          </div>

          {/* Target Audience */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <ThunderboltOutlined className="mr-2" />
              目标受众（可选）
            </label>
            <Input
              placeholder="例如：25-35岁职场女性、新手短视频创作者..."
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
            />
          </div>

          {/* Web Search Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GlobalOutlined className="text-blue-500" />
              <span className="text-sm text-gray-700">联网搜索</span>
              <Tooltip title="开启后AI会融入最新资讯作为内容依据">
                <span className="text-gray-400 cursor-help">ⓘ</span>
              </Tooltip>
            </div>
            <Button
              type={useWebSearch ? 'primary' : 'default'}
              size="small"
              onClick={() => setUseWebSearch(!useWebSearch)}
            >
              {useWebSearch ? '已开启' : '未开启'}
            </Button>
          </div>

          {/* Generate Button */}
          <Button
            type="primary"
            size="large"
            block
            loading={isGenerating}
            onClick={handleGenerate}
            className="bg-gradient-to-r from-[#fe2c55] to-[#ff6b8a] border-none h-12 text-lg font-medium"
          >
            <ThunderboltOutlined className="mr-2" />
            {isGenerating ? 'AI生成中...' : '生成脚本'}
          </Button>
        </div>
      </Card>

      {/* Script Preview */}
      {script && (
        <Card
          title={
            <div className="flex items-center justify-between">
              <span className="font-semibold">脚本预览</span>
              <Space>
                <Button icon={<CopyOutlined />} onClick={handleCopy}>
                  复制
                </Button>
                <Button icon={<SaveOutlined />} onClick={() => onSave(script)}>
                  保存
                </Button>
                <Button icon={<ExportOutlined />}>
                  导出
                </Button>
              </Space>
            </div>
          }
          className="bg-white shadow-sm"
        >
          <div className="space-y-4">
            {/* Hook Section */}
            <div className="p-4 bg-gradient-to-r from-[#fe2c55]/5 to-transparent rounded-lg border-l-4 border-[#fe2c55]">
              <div className="flex items-center gap-2 mb-2">
                <Tag color="#fe2c55">黄金3秒</Tag>
                <span className="text-xs text-gray-500">{script.content.hook?.timeRange}</span>
              </div>
              <p className="text-gray-900 font-medium mb-2">{script.content.hook?.content}</p>
              <p className="text-sm text-gray-500">
                <span className="text-gray-400">画面建议：</span>
                {script.content.hook?.visualDesc}
              </p>
            </div>

            {/* Core Content */}
            {script.content.core.map((segment, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Tag color="blue">段落 {idx + 1}</Tag>
                  <span className="text-xs text-gray-500">{segment.timeRange}</span>
                </div>
                <p className="text-gray-900 mb-2">{segment.content}</p>
                <p className="text-sm text-gray-500">
                  <span className="text-gray-400">画面建议：</span>
                  {segment.visualDesc}
                </p>
              </div>
            ))}

            {/* CTA Section */}
            <div className="p-4 bg-gradient-to-r from-[#25f4ee]/5 to-transparent rounded-lg border-l-4 border-[#25f4ee]">
              <div className="flex items-center gap-2 mb-2">
                <Tag color="#25f4ee">互动引导</Tag>
                <span className="text-xs text-gray-500">{script.content.cta?.timeRange}</span>
              </div>
              <p className="text-gray-900 font-medium mb-2">{script.content.cta?.content}</p>
              <p className="text-sm text-gray-500">
                <span className="text-gray-400">画面建议：</span>
                {script.content.cta?.visualDesc}
              </p>
            </div>

            {/* Action Buttons */}
            <Divider />
            <div className="flex gap-3">
              <Button icon={<RedoOutlined />} onClick={onGenerateVariants}>
                生成多版本
              </Button>
              <Button>生成标题建议</Button>
              <Button>生成话题标签</Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
