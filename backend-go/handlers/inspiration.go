package handlers

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"superdy-backend/database"
	"superdy-backend/models"
	"github.com/google/uuid"
)

func GetInspirations(c *gin.Context) {
	userID, _ := c.Get("userID")
	category := c.Query("category")

	var inspirations []models.Inspiration
	query := database.DB.Where("user_id = ?", userID)
	if category != "" {
		query = query.Where("category = ?", category)
	}
	query.Find(&inspirations)

	c.JSON(http.StatusOK, gin.H{
		"code": 0,
		"data": gin.H{
			"data":      inspirations,
			"total":     len(inspirations),
			"page":      1,
			"page_size": 20,
		},
	})
}

func CreateInspiration(c *gin.Context) {
	userID, _ := c.Get("userID")
	
	var inspiration models.Inspiration
	if err := c.ShouldBindJSON(&inspiration); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 40001, "message": err.Error()})
		return
	}

	inspiration.UserID = uuid.MustParse(userID.(string))
	database.DB.Create(&inspiration)

	c.JSON(http.StatusOK, gin.H{"code": 0, "data": inspiration})
}

func UpdateInspiration(c *gin.Context) {
	id := c.Param("id")
	userID, _ := c.Get("userID")

	var inspiration models.Inspiration
	if err := database.DB.Where("id = ? AND user_id = ?", id, userID).First(&inspiration).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"code": 40400, "message": "inspiration not found"})
		return
	}

	var updates models.Inspiration
	if err := c.ShouldBindJSON(&updates); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 40001, "message": err.Error()})
		return
	}

	database.DB.Model(&inspiration).Updates(updates)
	c.JSON(http.StatusOK, gin.H{"code": 0, "data": inspiration})
}

func DeleteInspiration(c *gin.Context) {
	id := c.Param("id")
	userID, _ := c.Get("userID")

	if err := database.DB.Where("id = ? AND user_id = ?", id, userID).Delete(&models.Inspiration{}).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"code": 40400, "message": "inspiration not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"code": 0, "message": "deleted"})
}

func SearchInspirations(c *gin.Context) {
	q := c.Query("q")
	
	var inspirations []models.Inspiration
	database.DB.Where("title ILIKE ?", "%"+q+"%").Find(&inspirations)

	c.JSON(http.StatusOK, gin.H{"code": 0, "data": inspirations})
}
