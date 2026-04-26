package handlers

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

func GetDashboard(c *gin.Context) {
	dashboard := gin.H{
		"followersCount":      125800,
		"followersGrowth7d":   3250,
		"totalPlays30d":       2850000,
		"avgEngagementRate":   8.5,
	}

	c.JSON(http.StatusOK, gin.H{"code": 0, "data": dashboard})
}

func GetAudienceProfile(c *gin.Context) {
	audience := gin.H{
		"ageDistribution": gin.H{
			"18-24": 25,
			"25-30": 35,
			"31-35": 25,
			"36-40": 10,
			"40+":   5,
		},
		"genderRatio": gin.H{
			"male":   42,
			"female": 58,
		},
		"cityTiers": gin.H{
			"tier1":  30,
			"tier2":  35,
			"tier3":  20,
			"tier4+": 15,
		},
		"interestTags": []gin.H{
			{"tag": "科技数码", "percentage": 35},
			{"tag": "生活方式", "percentage": 28},
			{"tag": "职场成长", "percentage": 22},
			{"tag": "教育学习", "percentage": 15},
		},
	}

	c.JSON(http.StatusOK, gin.H{"code": 0, "data": audience})
}

func GetVideoAnalytics(c *gin.Context) {
	id := c.Param("id")
	_ = id

	analytics := gin.H{
		"videoId":       id,
		"playCount":     520000,
		"likeCount":     28500,
		"commentCount":  1850,
		"shareCount":    3200,
		"trafficSources": gin.H{
			"recommend": 65,
			"search":    15,
			"profile":   12,
			"follow":    8,
		},
		"hotComments": []gin.H{
			{"word": "干货", "count": 156, "sentiment": "positive"},
			{"word": "学到了", "count": 128, "sentiment": "positive"},
			{"word": "收藏", "count": 98, "sentiment": "positive"},
		},
	}

	c.JSON(http.StatusOK, gin.H{"code": 0, "data": analytics})
}
