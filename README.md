# Golang Cheat Sheet

## Type Declaration
```go
type Example struct {
	ID        primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty" query:"id" url:"_id,omitempty" reqHeader:"token"`
	Messages  string             `json:"messages" bson:"messages" query:"messages" url:"messages" reqHeader:"token"`
}
```
1. json : for content/type json in RestFul
2. bson : using in mongoDB as name of field
3. query : use as variabel name in url query, like : https://domain.com/?messages=oaus098ji
4. url : use as variabel name for generate url query, like : https://domain.com/?messages=oaus098ji
5. reqHeader : use as HTTP header name in Request, like Authorization, Token, Content-Type, Origin

## Controller Cather
Get JSON Body
```go
var userreq models.UserReq
err := c.BodyParser(&userreq)
```

Get Header From Client Request
```go
var h models.Header
err := c.ReqHeaderParser(&h)
```

Get URL Qery e.g: localhost/?kueri=bagong
```go
p := new(Example)
err := c.QueryParser(p)
```

## Publish Package
Commit all of your work.  
Set ENV variabel in your OS : GOPROXY=proxy.golang.org  
![image](https://github.com/gocroot/gocroot.github.io/assets/11188109/b9d02250-bc4a-488e-a6be-ffe3e743d1bb)

```sh
go get -u all					#update existing package
go mod tidy					#generate go mod
git tag                                 	#check current version
git tag v0.0.3                          	#set tag version
git push origin --tags                  	#push tag version to repo
go list -m github.com/aiteung/presensi@v0.0.3   #publish to pkg dev, replace ORG/URL with your repo URL
```

## Deploy Go

Go to [deploy page](./deploy/)
