package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"time"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// JSONB for PostgreSQL JSONB type
type JSONB map[string]interface{}

func (j JSONB) Value() (driver.Value, error) {
	if j == nil {
		return nil, nil
	}
	return json.Marshal(j)
}

func (j *JSONB) Scan(value interface{}) error {
	if value == nil {
		*j = nil
		return nil
	}
	switch v := value.(type) {
	case []byte:
		return json.Unmarshal(v, j)
	case string:
		return json.Unmarshal([]byte(v), j)
	default:
		return errors.New("unsupported type for JSONB")
	}
}

// PublishTask model
type PublishTask struct {
	ID            uuid.UUID      `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	UserID        uuid.UUID      `json:"userId" gorm:"not null"`
	AccountID     uuid.UUID      `json:"accountId" gorm:"not null"`
	ScriptID      *uuid.UUID     `json:"scriptId"`
	VideoURL      string         `json:"videoUrl"`
	Title         string         `json:"title"`
	Hashtags      []string       `json:"hashtags" gorm:"type:text[]"`
	ScheduledAt   *time.Time     `json:"scheduledAt"`
	PublishedAt   *time.Time     `json:"publishedAt"`
	DouyinVideoID string         `json:"douyinVideoId"`
	Status        string         `json:"status" gorm:"default:'pending'"`
	CreatedAt     time.Time      `json:"createdAt"`
	UpdatedAt     time.Time      `json:"updatedAt"`
	DeletedAt     gorm.DeletedAt `json:"-" gorm:"index"`
}

// Inspiration model
type Inspiration struct {
	ID          uuid.UUID      `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	UserID      uuid.UUID      `json:"userId" gorm:"not null"`
	Title       string         `json:"title"`
	SourceURL   string         `json:"sourceUrl"`
	Category    string         `json:"category"`
	Tags        []string       `json:"tags" gorm:"type:text[]"`
	Notes       string         `json:"notes"`
	Analysis    JSONB          `json:"analysis" gorm:"type:jsonb"`
	ThumbnailURL string        `json:"thumbnailUrl"`
	CreatedAt   time.Time      `json:"createdAt"`
	UpdatedAt   time.Time      `json:"updatedAt"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`
}

// VideoAnalytics model
type VideoAnalytics struct {
	ID                 uuid.UUID `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	VideoID            string    `json:"videoId"`
	AccountID          uuid.UUID `json:"accountId"`
	SnapshotDate       time.Time `json:"snapshotDate"`
	PlayCount          int64     `json:"playCount"`
	LikeCount          int64     `json:"likeCount"`
	CommentCount       int64     `json:"commentCount"`
	ShareCount         int64     `json:"shareCount"`
	CompletionRateCurve JSONB    `json:"completionRateCurve" gorm:"type:jsonb"`
	TrafficSources     JSONB     `json:"trafficSources" gorm:"type:jsonb"`
	AudienceProfile    JSONB     `json:"audienceProfile" gorm:"type:jsonb"`
	UpdatedAt          time.Time `json:"updatedAt"`
}
