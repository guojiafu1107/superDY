package database

import (
	"fmt"
	"log"
	"superdy-backend/config"
	"superdy-backend/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"github.com/redis/go-redis/v9"
)

var DB *gorm.DB
var RedisClient *redis.Client

func InitDB() {
	cfg := config.AppConfig.Database
	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		cfg.Host, cfg.Port, cfg.User, cfg.Password, cfg.Name, cfg.SSLMode)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Auto migrate models
	db.AutoMigrate(
		&models.User{},
		&models.UserAccount{},
		&models.Script{},
		&models.PublishTask{},
		&models.VideoAnalytics{},
		&models.Inspiration{},
	)

	DB = db
	log.Println("Database connected successfully")
}

func InitRedis() {
	cfg := config.AppConfig.Redis
	RedisClient = redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%s:%s", cfg.Host, cfg.Port),
		Password: cfg.Password,
		DB:       cfg.DB,
	})

	log.Println("Redis connected successfully")
}
