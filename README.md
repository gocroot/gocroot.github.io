# Golang Cheat Sheet

## Type Declaration
```go
type Example struct {
	ID        primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty" url:"_id,omitempty"`
	Messages  string             `json:"messages" bson:"messages" url:"messages"`
}
```
