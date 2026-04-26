package models

import (
	"time"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	ID                    uuid.UUID      `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	DouyinOpenID          string         `json:"douyinOpenId" gorm:"uniqueIndex;not null"`
	UnionID               string         `json:"unionId"`
	Nickname              string         `json:"nickname"`
	AvatarURL             string         `json:"avatarUrl"`
	PlanType              string         `json:"planType" gorm:"default:'free'"`
	SubscriptionExpiresAt *time.Time     `json:"subscriptionExpiresAt"`
	CreatedAt             time.Time      `json:"createdAt"`
	UpdatedAt             time.Time      `json:"updatedAt"`
	DeletedAt             gorm.DeletedAt `json:"-" gorm:"index"`

	Accounts []UserAccount `json:"accounts,omitempty" gorm:"foreignKey:UserID"`
}

type UserAccount struct {
	ID             uuid.UUID  `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	UserID         uuid.UUID  `json:"userId" gorm:"not null"`
	DouyinAccountID string    `json:"douyinAccountId"`
	AccountNickname string    `json:"accountNickname"`
	AccessToken    string     `json:"-"`
	RefreshToken   string     `json:"-"`
	TokenExpiresAt *time.Time `json:"tokenExpiresAt"`
	FollowersCount int        `json:"followersCount" gorm:"default:0"`
	IsPrimary      bool       `json:"isPrimary" gorm:"default:false"`
	CreatedAt      time.Time  `json:"createdAt"`
	UpdatedAt      time.Time  `json:"updatedAt"`
}
