package handlers

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"superdy-backend/database"
	"superdy-backend/models"
	"github.com/google/uuid"
)

func AnalyzeStyle(c *gin.Context) {
	userID, _ := c.Get("userID")
	
	// Create async analysis task
	taskID := uuid.New().String()
	database.RedisClient.Set(c, "style_task:"+taskID, "processing", 0)
	
	// TODO: Send to AI service

	c.JSON(http.StatusOK, gin.H{"code": 0, "data": gin.H{"taskId": taskID}})
}

func GetStyleProfile(c *gin.Context) {
	// Mock style profile
	profile := gin.H{
		"userId": "1",
		"tags":   []string{"幽默口语", "知识密度高", "亲切自然"},
		"features": gin.H{
			"sentenceLength":   "medium",
			"toneWords":        []string{"你知道吗", "其实", "重点来了"},
			"jargonFrequency":  "medium",
			"humorLevel":       7,
			"knowledgeDensity": 8,
		},
	}

	c.JSON(http.StatusOK, gin.H{"code": 0, "data": profile})
}

func GenerateScript(c *gin.Context) {
	userID, _ := c.Get("userID")

	var req struct {
		Topic          string `json:"topic" binding:"required"`
		Duration       int    `json:"duration"`
		Tone           string `json:"tone"`
		TargetAudience string `json:"targetAudience"`
		UseWebSearch   bool   `json:"useWebSearch"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 40001, "message": err.Error()})
		return
	}

	// Create script
	script := models.Script{
		UserID:         uuid.MustParse(userID.(string)),
		Topic:          req.Topic,
		Duration:       req.Duration,
		Tone:           req.Tone,
		TargetAudience: req.TargetAudience,
		Status:         "draft",
		Content: models.JSONB{
			"hook": gin.H{
				"timeRange":  "0-3s",
				"content":    "钩子文案...",
				"visualDesc": "特写镜头+悬念音乐",
				"duration":   3,
			},
			"core": []gin.H{
				{
					"timeRange":  "3-10s",
					"content":    "核心内容...",
					"visualDesc": "素材混剪",
					"duration":   7,
				},
			},
			"cta": gin.H{
				"timeRange":  "25-30s",
				"content":    "互动引导...",
				"visualDesc": "真人出镜",
				"duration":   5,
			},
		},
	}

	database.DB.Create(&script)

	// Create AI task
	taskID := uuid.New().String()
	database.RedisClient.Set(c, "script_task:"+taskID, "pending", 0)

	c.JSON(http.StatusOK, gin.H{
		"code": 0,
		"data": gin.H{
			"scriptId": script.ID,
			"taskId":   taskID,
		},
	})
}

func GetScript(c *gin.Context) {
	id := c.Param("id")
	userID, _ := c.Get("userID")

	var script models.Script
	if err := database.DB.Where("id = ? AND user_id = ?", id, userID).First(&script).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"code": 40400, "message": "script not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"code": 0, "data": script})
}

func GenerateVariants(c *gin.Context) {
	id := c.Param("id")
	_ = id
	
	// Create variant generation task
	taskID := uuid.New().String()
	database.RedisClient.Set(c, "variant_task:"+taskID, "processing", 0)

	c.JSON(http.StatusOK, gin.H{"code": 0, "data": gin.H{"taskId": taskID}})
}

func GenerateTitles(c *gin.Context) {
	titles := []gin.H{
		{"title": "震惊！这个方法让我一天涨粉1万", "type": "suspense", "score": 95},
		{"title": "5个技巧教你快速涨粉", "type": "number", "score": 88},
		{"title": "你还在为涨粉发愁吗？试试这个方法", "type": "pain_point", "score": 82},
	}

	c.JSON(http.StatusOK, gin.H{"code": 0, "data": gin.H{"titles": titles}})
}

func ExportScript(c *gin.Context) {
	format := c.Query("format")
	if format == "" {
		format = "json"
	}

	// TODO: Generate and return file
	c.JSON(http.StatusOK, gin.H{"code": 0, "message": "export generated"})
}
