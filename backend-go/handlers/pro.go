package handlers

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

func GetCompetitors(c *gin.Context) {
	competitors := []gin.H{
		{
			"id":             "1",
			"nickname":       "创作达人小王",
			"followersCount": 850000,
			"posts7d":        12,
			"avgLikes":       25000,
			"growth7d":       15000,
		},
		{
			"id":             "2",
			"nickname":       "运营笔记",
			"followersCount": 520000,
			"posts7d":        8,
			"avgLikes":       18000,
			"growth7d":       8200,
		},
	}

	c.JSON(http.StatusOK, gin.H{"code": 0, "data": competitors})
}

func GetCompetitorReport(c *gin.Context) {
	id := c.Param("id")
	_ = id

	report := gin.H{
		"competitorId": id,
		"period":       "7d",
		"summary": gin.H{
			"totalPosts":    12,
			"totalViews":    2800000,
			"totalLikes":    185000,
			"avgEngagement": 12.5,
		},
	}

	c.JSON(http.StatusOK, gin.H{"code": 0, "data": report})
}

func GetLiveRealtime(c *gin.Context) {
	id := c.Param("id")
	_ = id

	realtime := gin.H{
		"onlineUsers": 2580,
		"peakUsers":   3200,
		"totalGifts":  1250,
		"duration":    45,
	}

	c.JSON(http.StatusOK, gin.H{"code": 0, "data": realtime})
}

func GetLiveReview(c *gin.Context) {
	id := c.Param("id")
	_ = id

	review := gin.H{
		"liveId":      id,
		"duration":    120,
		"peakViewers": 12000,
		"avgViewers":  8500,
		"totalGifts":  5200,
		"highlights": []gin.H{
			{"time": "15:30", "event": "人气峰值", "viewers": 12000},
			{"time": "45:20", "event": "礼物高峰", "amount": 800},
		},
	}

	c.JSON(http.StatusOK, gin.H{"code": 0, "data": review})
}
