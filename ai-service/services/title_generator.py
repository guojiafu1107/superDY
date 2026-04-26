import random
from typing import List, Dict

class TitleGenerator:
    """Generate engaging titles for videos"""
    
    TITLE_TEMPLATES = {
        "suspense": [
            "{topic}的秘密，今天我要全部告诉你",
            "关于{topic}，99%的人都理解错了",
            "{topic}的真相，可能会得罪很多人",
            "为什么{topic}这么难？原因竟是...",
            "{topic}背后不为人知的秘密",
        ],
        "number": [
            "{topic}的5个核心技巧，学会就能涨粉",
            "做{topic}必知的3个关键点",
            "30天掌握{topic}的完整攻略",
            "关于{topic}的10个真相",
            "月入过万的{topic}方法，只有这3步",
        ],
        "pain_point": [
            "{topic}总是做不好？试试这个方法",
            "还在被{topic}困扰？看完这条视频",
            "{topic}太难了？那是你没掌握这个技巧",
            "如果你也在纠结{topic}，一定要看",
            "{topic}总是失败？问题出在这里",
        ],
        "curiosity": [
            "{topic}还能这样做？太神奇了",
            "这个方法让{topic}效率提升10倍",
            "{topic}的核心秘诀，只有1%的人知道",
            "我发现了一个{topic}的神操作",
            "{topic}这样做，效果惊人！",
        ],
        "benefit": [
            "学会{topic}，粉丝轻松破万",
            "掌握{topic}，播放量翻10倍",
            "{topic}做到这3点，必定爆款",
            "这样学{topic}，少走3年弯路",
            "{topic}的正确姿势，建议收藏",
        ],
    }
    
    def generate(self, topic: str, content: str, count: int = 10) -> List[Dict]:
        """Generate title suggestions"""
        titles = []
        
        # Generate titles from each category
        for category, templates in self.TITLE_TEMPLATES.items():
            for template in templates:
                if len(titles) >= count:
                    break
                
                title = template.format(topic=topic)
                score = self._calculate_score(title, category, content)
                
                titles.append({
                    "title": title,
                    "type": category,
                    "score": score,
                })
        
        # Sort by score and return top N
        titles.sort(key=lambda x: x["score"], reverse=True)
        return titles[:count]
    
    def _calculate_score(self, title: str, category: str, content: str) -> int:
        """Calculate title quality score (0-100)"""
        score = 70  # Base score
        
        # Category bonus
        category_scores = {
            "suspense": 8,
            "number": 6,
            "pain_point": 7,
            "curiosity": 9,
            "benefit": 8,
        }
        score += category_scores.get(category, 5)
        
        # Length bonus (optimal: 15-25 characters)
        length = len(title)
        if 15 <= length <= 25:
            score += 8
        elif 10 <= length <= 30:
            score += 4
        
        # Contains numbers bonus
        if any(c.isdigit() for c in title):
            score += 5
        
        # Contains power words bonus
        power_words = ["秘密", "真相", "秘诀", "核心", "关键", "必知", "干货"]
        if any(word in title for word in power_words):
            score += 5
        
        # Random variation
        score += random.randint(-5, 5)
        
        return min(100, max(50, score))
