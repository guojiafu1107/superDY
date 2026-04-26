package handlers

import (
	"net/http"
	"time"
	"github.com/gin-gonic/gin"
	"superdy-backend/database"
	"superdy-backend/models"
	"github.com/google/uuid"
)

func GetPublishCalendar(c *gin.Context) {
	userID, _ := c.Get("userID")
	month := c.Query("month")
	if month == "" {
		month = time.Now().Format("2006-01")
	}

	var tasks []models.PublishTask
	database.DB.Where("user_id = ? AND DATE_TRUNC('month', scheduled_at) = ?", userID, month).Find(&tasks)

	c.JSON(http.StatusOK, gin.H{"code": 0, "data": tasks})
}

func CreatePublishTask(c *gin.Context) {
	userID, _ := c.Get("userID")

	var task models.PublishTask
	if err := c.ShouldBindJSON(&task); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 40001, "message": err.Error()})
		return
	}

	task.UserID = uuid.MustParse(userID.(string))
	task.Status = "pending"

	database.DB.Create(&task)

	c.JSON(http.StatusOK, gin.H{"code": 0, "data": task})
}

func GetBestPublishTime(c *gin.Context) {
	slots := []gin.H{
		{"time": "07:30", "score": 85, "reason": "早高峰通勤时段"},
		{"time": "12:00", "score": 92, "reason": "午休高峰"},
		{"time": "18:30", "score": 95, "reason": "晚高峰黄金时段"},
		{"time": "21:00", "score": 88, "reason": "睡前浏览高峰"},
	}

	c.JSON(http.StatusOK, gin.H{"code": 0, "data": gin.H{"slots": slots}})
}

func GetLiveStats(c *gin.Context) {
	id := c.Param("id")
	_ = id

	// Mock live stats
	stats := gin.H{
		"viewCount":    5200,
		"likeCount":    2800,
		"commentCount": 520,
		"shareCount":   180,
	}

	c.JSON(http.StatusOK, gin.H{"code": 0, "data": stats})
}
