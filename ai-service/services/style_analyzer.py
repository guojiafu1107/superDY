from typing import Dict, Any, List
import random

class StyleAnalyzer:
    """Analyze user's content style from historical videos"""
    
    STYLE_TAGS = [
        "幽默口语", "知识密度高", "亲切自然", "数据支撑",
        "故事性强", "观点鲜明", "干货满满", "轻松搞笑",
        "温暖治愈", "激情澎湃", "悬疑好奇", "理性分析"
    ]
    
    TONE_WORDS_POOL = [
        "你知道吗", "其实", "重点来了", "总结一下",
        "说实话", "我发现", "最重要的是", "简单来说",
        "不得不说", "注意看", "记住", "问题来了"
    ]
    
    def analyze(self, recent_videos: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze style from recent videos"""
        
        if not recent_videos:
            return self._default_profile()
        
        # Calculate metrics
        total_videos = len(recent_videos)
        avg_duration = sum(v.get("duration", 30) for v in recent_videos) / total_videos
        
        # Analyze text features
        all_text = " ".join([v.get("text", "") for v in recent_videos])
        word_count = len(all_text)
        sentence_count = all_text.count("。") + all_text.count("！") + all_text.count("？")
        avg_sentence_length = word_count / max(sentence_count, 1)
        
        # Determine sentence length category
        if avg_sentence_length < 15:
            sentence_category = "short"
        elif avg_sentence_length < 30:
            sentence_category = "medium"
        else:
            sentence_category = "long"
        
        # Extract frequently used tone words
        tone_words = []
        for word in self.TONE_WORDS_POOL:
            if word in all_text:
                tone_words.append(word)
        tone_words = tone_words[:4]  # Top 4
        
        # Generate style tags
        tags = random.sample(self.STYLE_TAGS, k=min(4, len(self.STYLE_TAGS)))
        
        # Calculate scores
        humor_score = self._calculate_humor_score(all_text)
        knowledge_score = self._calculate_knowledge_score(all_text)
        
        return {
            "tags": tags,
            "features": {
                "sentenceLength": sentence_category,
                "avgSentenceLength": round(avg_sentence_length, 1),
                "toneWords": tone_words,
                "jargonFrequency": self._calculate_jargon_frequency(all_text),
                "humorLevel": humor_score,
                "knowledgeDensity": knowledge_score,
            },
            "stats": {
                "analyzedVideos": total_videos,
                "avgDuration": round(avg_duration, 1),
                "totalWordCount": word_count,
            }
        }
    
    def _default_profile(self) -> Dict[str, Any]:
        """Return default style profile"""
        return {
            "tags": ["专业干货", "知识密度高"],
            "features": {
                "sentenceLength": "medium",
                "avgSentenceLength": 20.0,
                "toneWords": ["重点来了", "总结一下"],
                "jargonFrequency": "medium",
                "humorLevel": 5,
                "knowledgeDensity": 7,
            },
            "stats": {
                "analyzedVideos": 0,
                "avgDuration": 30.0,
                "totalWordCount": 0,
            }
        }
    
    def _calculate_humor_score(self, text: str) -> int:
        """Calculate humor level (1-10)"""
        humor_markers = ["哈哈", "搞笑", "有趣", "笑死", "绝了", "太逗了"]
        count = sum(text.count(m) for m in humor_markers)
        return min(10, max(1, 3 + count))
    
    def _calculate_knowledge_score(self, text: str) -> int:
        """Calculate knowledge density (1-10)"""
        knowledge_markers = ["首先", "其次", "第一", "第二", "原因", "结果", "建议", "方法"]
        count = sum(text.count(m) for m in knowledge_markers)
        return min(10, max(1, 5 + count // 2))
    
    def _calculate_jargon_frequency(self, text: str) -> str:
        """Calculate jargon frequency"""
        jargon_markers = ["算法", "流量", "转化", "ROI", "CTR", "DAU", "MAU", "UV", "PV"]
        count = sum(text.count(m) for m in jargon_markers)
        if count < 3:
            return "low"
        elif count < 8:
            return "medium"
        return "high"
