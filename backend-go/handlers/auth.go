package handlers

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"superdy-backend/database"
	"superdy-backend/models"
	"superdy-backend/utils"
)

func DouyinAuth(c *gin.Context) {
	// Redirect to Douyin OAuth
	clientID := "your-douyin-client-id"
	redirectURI := "http://localhost:8080/api/v1/auth/douyin/callback"
	authURL := "https://open.douyin.com/platform/oauth/connect/"
	
	c.Redirect(http.StatusFound, authURL+"?client_key="+clientID+"&response_type=code&scope=user_info&redirect_uri="+redirectURI)
}

func DouyinCallback(c *gin.Context) {
	code := c.Query("code")
	if code == "" {
		c.JSON(http.StatusBadRequest, gin.H{"code": 40001, "message": "authorization code required"})
		return
	}

	// TODO: Exchange code for access token with Douyin API
	// For demo, create mock user
	user := models.User{
		DouyinOpenID: "douyin_" + code,
		Nickname:     "测试用户",
		AvatarURL:    "https://example.com/avatar.jpg",
		PlanType:     "free",
	}

	// Check if user exists
	var existingUser models.User
	result := database.DB.Where("douyin_open_id = ?", user.DouyinOpenID).First(&existingUser)
	if result.Error != nil {
		// Create new user
		database.DB.Create(&user)
		existingUser = user
	}

	// Generate JWT token
	token, err := utils.GenerateToken(existingUser.ID.String(), existingUser.PlanType)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 50000, "message": "failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"code": 0,
		"data": gin.H{
			"token": token,
			"user":  existingUser,
		},
	})
}

func RefreshToken(c *gin.Context) {
	// TODO: Implement token refresh logic
	c.JSON(http.StatusOK, gin.H{"code": 0, "message": "token refreshed"})
}

func GetCurrentUser(c *gin.Context) {
	userID, _ := c.Get("userID")
	
	var user models.User
	if err := database.DB.First(&user, "id = ?", userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"code": 40400, "message": "user not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"code": 0, "data": user})
}

func BindAccount(c *gin.Context) {
	// TODO: Implement account binding logic
	c.JSON(http.StatusOK, gin.H{"code": 0, "message": "account bound"})
}
