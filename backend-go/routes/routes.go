package routes

import (
	"github.com/gin-gonic/gin"
	"superdy-backend/handlers"
	"superdy-backend/middleware"
)

func SetupRoutes(r *gin.Engine) {
	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// API v1
	v1 := r.Group("/api/v1")
	{
		// Auth routes
		auth := v1.Group("/auth")
		{
			auth.GET("/douyin", handlers.DouyinAuth)
			auth.GET("/douyin/callback", handlers.DouyinCallback)
			auth.POST("/refresh", handlers.RefreshToken)
		}

		// Protected routes
		authorized := v1.Group("/")
		authorized.Use(middleware.AuthMiddleware())
		{
			// Users
			authorized.GET("/users/me", handlers.GetCurrentUser)
			authorized.POST("/users/accounts", handlers.BindAccount)

			// Trends
			authorized.GET("/trends/hot", handlers.GetHotTrends)
			authorized.GET("/trends/subscribed", handlers.GetSubscribedTrends)
			authorized.POST("/trends/analyze", handlers.AnalyzeVideo)
			authorized.GET("/trends/analyze/:taskId", handlers.GetAnalysisResult)

			// Inspirations
			authorized.GET("/inspirations", handlers.GetInspirations)
			authorized.POST("/inspirations", handlers.CreateInspiration)
			authorized.PUT("/inspirations/:id", handlers.UpdateInspiration)
			authorized.DELETE("/inspirations/:id", handlers.DeleteInspiration)
			authorized.GET("/inspirations/search", handlers.SearchInspirations)

			// Style
			authorized.POST("/style/analyze", handlers.AnalyzeStyle)
			authorized.GET("/style/profile", handlers.GetStyleProfile)

			// Scripts
			authorized.POST("/scripts/generate", handlers.GenerateScript)
			authorized.GET("/scripts/:id", handlers.GetScript)
			authorized.POST("/scripts/:id/variants", handlers.GenerateVariants)
			authorized.POST("/scripts/:id/titles", handlers.GenerateTitles)
			authorized.GET("/scripts/:id/export", handlers.ExportScript)

			// Publish
			authorized.GET("/publish/calendar", handlers.GetPublishCalendar)
			authorized.POST("/publish/tasks", handlers.CreatePublishTask)
			authorized.GET("/publish/best-time", handlers.GetBestPublishTime)
			authorized.GET("/publish/:id/live-stats", handlers.GetLiveStats)

			// Analytics
			authorized.GET("/analytics/dashboard", handlers.GetDashboard)
			authorized.GET("/analytics/audience", handlers.GetAudienceProfile)
			authorized.GET("/analytics/videos/:id", handlers.GetVideoAnalytics)

			// Pro features
			pro := authorized.Group("/")
			pro.Use(middleware.PlanMiddleware("pro"))
			{
				pro.GET("/competitors", handlers.GetCompetitors)
				pro.GET("/competitors/:id/report", handlers.GetCompetitorReport)
				pro.GET("/live/:id/realtime", handlers.GetLiveRealtime)
				pro.GET("/live/:id/review", handlers.GetLiveReview)
			}
		}
	}
}
