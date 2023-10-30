# Golang Cheat Sheet

## Type Declaration
```go
type Example struct {
	ID        primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty" url:"_id,omitempty"`
	Messages  string             `json:"messages" bson:"messages" url:"messages"`
}
```
## Publish Package
Set ENV variabel in your OS : GOPROXY=proxy.golang.org  
![image](https://github.com/gocroot/gocroot.github.io/assets/11188109/78f4c4c2-3b13-4fef-8f1a-92201a3cb494)

```sh
go get -u all					#update existing package
go mod tidy					#generate go mod
git tag                                 	#check current version
git tag v0.0.3                          	#set tag version
git push origin --tags                  	#push tag version to repo
go list -m github.com/aiteung/presensi@v0.0.3   #publish to pkg dev, replace ORG/URL with your repo URL
```
