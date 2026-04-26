package models

import (
	"time"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Script struct {
	ID             uuid.UUID      `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	UserID         uuid.UUID      `json:"userId" gorm:"not null"`
	AccountID      *uuid.UUID     `json:"accountId"`
	InspirationID  *uuid.UUID     `json:"inspirationId"`
	Topic          string         `json:"topic"`
	Duration       int            `json:"duration"`
	Tone           string         `json:"tone"`
	TargetAudience string         `json:"targetAudience"`
	Content        JSONB          `json:"content" gorm:"type:jsonb;not null"`
	Variants       JSONB          `json:"variants" gorm:"type:jsonb"`
	Titles         JSONB          `json:"titles" gorm:"type:jsonb"`
	Hashtags       JSONB          `json:"hashtags" gorm:"type:jsonb"`
	Status         string         `json:"status" gorm:"default:'draft'"`
	AITaskID       string         `json:"aiTaskId"`
	CreatedAt      time.Time      `json:"createdAt"`
	UpdatedAt      time.Time      `json:"updatedAt"`
	DeletedAt      gorm.DeletedAt `json:"-" gorm:"index"`
}

type ScriptContent struct {
	Hook ScriptSegment   `json:"hook"`
	Core []ScriptSegment `json:"core"`
	CTA  ScriptSegment   `json:"cta"`
}

type ScriptSegment struct {
	TimeRange  string `json:"timeRange"`
	Content    string `json:"content"`
	VisualDesc string `json:"visualDesc"`
	Duration   int    `json:"duration"`
}

type ScriptVariant struct {
	ID                      string          `json:"id"`
	Type                    string          `json:"type"`
	Content                 ScriptContent   `json:"content"`
	EstimatedCompletionRate float64         `json:"estimatedCompletionRate"`
}

type TitleSuggestion struct {
	Title string  `json:"title"`
	Type  string  `json:"type"`
	Score float64 `json:"score"`
}
