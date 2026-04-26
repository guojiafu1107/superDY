import random
from typing import Dict, Any, Optional, List

class ScriptGenerator:
    """AI-powered script generation service"""
    
    TONE_TEMPLATES = {
        "humorous": {
            "hooks": [
                "关于{topic}，我发现了一个超搞笑的事情...",
                "今天我要揭秘{topic}，可能会得罪很多人...",
                "你们猜{topic}最大的坑是什么？",
                "说实话，{topic}这件事我憋了很久了...",
            ],
            "transitions": ["关键是...", "更绝的是...", "你以为这就完了？", "最狠的来了..."],
            "ctas": [
                "觉得有用就点个赞吧，咱们下期见！",
                "关注我，带你发现更多有趣内容！",
                "评论区告诉我你的想法！",
            ]
        },
        "professional": {
            "hooks": [
                "{topic}的核心秘诀，只有1%的人知道",
                "做了3年{topic}，今天分享我的全部经验",
                "关于{topic}，99%的人都理解错了",
                "今天用3分钟讲清楚{topic}",
            ],
            "transitions": ["首先...", "其次...", "更重要的是...", "总结一下..."],
            "ctas": [
                "点赞收藏，下期分享更多干货！",
                "关注我，一起学习成长！",
                "有问题评论区交流！",
            ]
        },
        "warm": {
            "hooks": [
                "如果你也在纠结{topic}，这条视频一定要看完",
                "关于{topic}，我想和你聊聊心里话",
                "希望这个关于{topic}的分享能帮到你",
                "做{topic}这些年，我的真实感受是...",
            ],
            "transitions": ["其实...", "我想说的是...", "你会发现...", "记住..."],
            "ctas": [
                "如果对你有帮助，记得点赞支持哦~",
                "关注我，陪你一起成长~",
                "有任何问题随时找我~",
            ]
        },
        "excited": {
            "hooks": [
                "太激动了！{topic}终于被我搞定了！",
                "{topic}这个方法真的太牛了！",
                "刚刚发现一个{topic}的神操作！",
                "{topic}的这个技巧一定要学！",
            ],
            "transitions": ["重点来了！", "注意看！", "超级关键！", "千万别错过！"],
            "ctas": [
                "这个方法太棒了！赶紧点赞收藏！",
                "关注我，更多干货等着你！",
                "马上试试，效果惊人！",
            ]
        },
        "mysterious": {
            "hooks": [
                "{topic}的秘密，今天我要全部告诉你",
                "为什么{topic}这么难？真相是...",
                "{topic}背后不为人知的秘密",
                "大多数人不知道的{topic}真相",
            ],
            "transitions": ["其实...", "真相是...", "你发现了吗...", "最恐怖的是..."],
            "ctas": [
                "想知道更多秘密？关注我！",
                "点赞解锁更多隐藏内容！",
                "评论区有彩蛋！",
            ]
        },
    }
    
    VISUAL_SUGGESTIONS = [
        "特写镜头+紧张音乐",
        "数据图表展示",
        "真人出镜讲解",
        "素材混剪切换",
        "字幕强调重点",
        "B-roll画面插入",
        "转场特效过渡",
    ]
    
    def generate(self, topic: str, duration: int = 30, tone: str = "professional",
                 target_audience: Optional[str] = None, 
                 style_profile: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Generate a complete script"""
        
        templates = self.TONE_TEMPLATES.get(tone, self.TONE_TEMPLATES["professional"])
        
        # Calculate segment timing
        hook_duration = 3
        cta_duration = 5
        core_duration = duration - hook_duration - cta_duration
        segment_count = max(1, core_duration // 10)
        segment_length = core_duration // segment_count
        
        # Generate hook
        hook_template = random.choice(templates["hooks"])
        hook = {
            "timeRange": f"0-{hook_duration}s",
            "content": hook_template.format(topic=topic),
            "visualDesc": random.choice(self.VISUAL_SUGGESTIONS[:3]),
            "duration": hook_duration
        }
        
        # Generate core content
        core = []
        transitions = templates["transitions"]
        for i in range(segment_count):
            start = hook_duration + i * segment_length
            end = start + segment_length
            transition = transitions[i % len(transitions)]
            
            core.append({
                "timeRange": f"{start}-{end}s",
                "content": f"{transition}这里详细讲解{topic}的第{i+1}个要点，包含具体操作方法和注意事项...",
                "visualDesc": random.choice(self.VISUAL_SUGGESTIONS),
                "duration": segment_length
            })
        
        # Generate CTA
        cta_template = random.choice(templates["ctas"])
        cta = {
            "timeRange": f"{duration - cta_duration}-{duration}s",
            "content": cta_template,
            "visualDesc": "真人出镜+引导手势",
            "duration": cta_duration
        }
        
        return {
            "topic": topic,
            "duration": duration,
            "tone": tone,
            "targetAudience": target_audience,
            "content": {
                "hook": hook,
                "core": core,
                "cta": cta
            },
            "estimatedCompletionRate": random.uniform(0.45, 0.75),
        }
    
    def generate_variants(self, script: Dict[str, Any], count: int = 3) -> List[Dict[str, Any]]:
        """Generate script variants"""
        variants = []
        tones = ["humorous", "professional", "warm", "excited", "mysterious"]
        
        for i in range(count):
            tone = tones[i % len(tones)]
            if tone != script["tone"]:
                variant = self.generate(
                    topic=script["topic"],
                    duration=script["duration"],
                    tone=tone,
                    target_audience=script.get("targetAudience")
                )
                variant["variantType"] = f"different_{['tone', 'opening', 'angle'][i % 3]}"
                variants.append(variant)
        
        return variants
