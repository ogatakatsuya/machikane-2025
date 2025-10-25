package dto

// QuestionStatus represents the state of a question answer
type QuestionStatus string

const (
	QuestionStatusUnanswered QuestionStatus = "unanswered"
	QuestionStatusCorrect    QuestionStatus = "correct"
	QuestionStatusIncorrect  QuestionStatus = "incorrect"
)

// QuestionState represents the state of an individual question
type QuestionState struct {
	ID     int            `json:"id"`
	Status QuestionStatus `json:"status"`
	Answer *string        `json:"answer,omitempty"`
}

// SerializedQuizContext represents the quiz context data from frontend
// This matches the TypeScript SerializedQuizContext type
type SerializedQuizContext struct {
	GroupID        string          `json:"groupId"`
	StartedAt      string          `json:"startedAt"` // ISO 8601 string
	TotalQuestions int             `json:"totalQuestions"`
	QuestionStates []QuestionState `json:"questionStates"`
}
