package handlers

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"superdy-backend/database"
	"superdy-backend/models"
	"github.com/google/uuid"
)

// Mock trends data
var mockTrends = []gin.H{
	{"id": "1", "title": "这个AI工具让我一天写完100条脚本！", "category": "tech", "hotValue": 1250000, "rank": 1, "isRising": true, "tags": []string{"AI工具", "效率神器"}, "viewCount": 850000, "videoCount": 1200},
	{"id": "2", "title": "2024抖音算法大揭秘", "category": "knowledge", "hotValue": 980000, "rank": 2, "isRising": true, "tags": []string{"算法揭秘", "运营干货"}, "viewCount": 620000, "videoCount": 890},
	{"id": "3", "title": "挑战30天涨粉10万", "category": "life", "hotValue": 760000, "rank": 3, "isRising": false, "tags": []string{"涨粉挑战", "真实记录"}, "viewCount": 480000, "videoCount": 650},
}

func GetHotTrends(c *gin.Context) {
	category := c.Query("category")
	limit := 20
	offset := 0

	// Filter by category if provided
	var trends []gin.H
	for _, trend := range mockTrends {
		if category == "" || category == "all" || trend["category"] == category {
			trends = append(trends, trend)
		}
	}

	c.JSON(http.StatusOK, gin.H{"code": 0, "data": trends[:min(len(trends), limit)]})
}

func GetSubscribedTrends(c *gin.Context) {
	// Return user's subscribed trends
	c.JSON(http.StatusOK, gin.H{"code": 0, "data": mockTrends[:2]})
}

func AnalyzeVideo(c *gin.Context) {
	var req struct {
		ShareURL string `json:"shareUrl" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 40001, "message": err.Error()})
		return
	}

	// Create async analysis task
	taskID := uuid.New().String()
	
	// Store task in Redis
	database.RedisClient.Set(c, "analysis_task:"+taskID, "pending", 0)

	// TODO: Send to Kafka for AI processing

	c.JSON(http.StatusOK, gin.H{
		"code": 0,
		"data": gin.H{"taskId": taskID},
	})
}

func GetAnalysisResult(c *gin.Context) {
	taskID := c.Param("taskId")
	
	// Get task status from Redis
	status, err := database.RedisClient.Get(c, "analysis_task:"+taskID).Result()
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"code": 40400, "message": "task not found"})
		return
	}

	// Mock analysis result
	result := gin.H{
		"id":       taskID,
		"status":   status,
		"title":    "视频标题",
		"author":   "创作者",
		"golden3Sec": gin.H{
			"opening":      "直接抛出痛点，引发共鸣",
			"copywriting":  "你是不是也有这样的困扰...",
			"music":        "紧张悬疑背景音乐",
			"emotion":      "引发好奇+轻微焦虑",
		},
		"rhythmCurve": []gin.H{},
		"copyFeatures": gin.H{
			"title":         "爆款视频标题",
			"subtitleStyle": "黄色描边字幕",
			"hashtags":      []string{"#热门", "#推荐"},
			"keywords":      []string{"爆款", "技巧"},
		},
		"interactionTriggers": []string{"评论区提问", "引导点赞"},
	}

	c.JSON(http.StatusOK, gin.H{"code": 0, "data": result})
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}
