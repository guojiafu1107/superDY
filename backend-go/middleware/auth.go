package middleware

import (
	"net/http"
	"strings"
	"github.com/gin-gonic/gin"
	"superdy-backend/utils"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"code": 40100, "message": "missing authorization header"})
			c.Abort()
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if !(len(parts) == 2 && parts[0] == "Bearer") {
			c.JSON(http.StatusUnauthorized, gin.H{"code": 40100, "message": "invalid authorization format"})
			c.Abort()
			return
		}

		claims, err := utils.ParseToken(parts[1])
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"code": 40100, "message": "invalid token"})
			c.Abort()
			return
		}

		c.Set("userID", claims.UserID)
		c.Set("planType", claims.PlanType)
		c.Next()
	}
}

func PlanMiddleware(requiredPlan string) gin.HandlerFunc {
	return func(c *gin.Context) {
		planType, exists := c.Get("planType")
		if !exists {
			c.JSON(http.StatusForbidden, gin.H{"code": 40300, "message": "pro plan required"})
			c.Abort()
			return
		}

		if planType != "pro" && planType != "team" {
			c.JSON(http.StatusForbidden, gin.H{"code": 40300, "message": "pro plan required"})
			c.Abort()
			return
		}

		c.Next()
	}
}
