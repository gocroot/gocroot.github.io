# Golang Cheat Sheet

## Pre-requisite

Please learn first :
1. Mongodb
2. Golang Struct
3. Golang function

[Go Fiber Based](https://gocroot.github.io/alwaysdata/)

[Net HTTP Based](https://github.com/domyid/domyikado)

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
5. reqHeader : use as HTTP header name in Request, like Authorization, Token, Content-Type, Origin, Login

## Net HTTP Controller
This is net http controller:
```go
func Homepage(w http.ResponseWriter, r *http.Request) {
	//Controller Catcher
		//your logic
	//Controller return
}
```
### Controller Cather
Get JSON Body
```go
var tasklists []report.TaskList
err := json.NewDecoder(r.Body).Decode(&tasklists)
```

Get Header From Client Request
```go
secret = r.Header.Get("secret")
```

Get URL Param e.g: localhost/:login
```go
login := at.GetParam(r)
//or
login := r.URL.Path[strings.LastIndex(r.URL.Path, "/")+1:]
```

Get URL Query using Example struct above e.g: localhost/?id=bagong
```go
id := r.URL.Query().Get("id")
```

Get File Upload by FormFile using *image* as parameter name
```go
_, header, err := r.FormFile("image")
```

### Controller return
Using Example struct above.
```go
at.WriteJSON(w, http.StatusOK, Example)
```

## Go Fiber Controller
This is Go Fiber Controller:
```go
func Homepage(ctx *fiber.Ctx) error {
	//Controller Catcher
		//your logic
	//Controller return
}
```
### Controller Catcher
Get JSON Body
```go
var userreq models.UserReq
err := ctx.BodyParser(&userreq)
```

Get Header From Client Request
```go
var h models.Header
err := ctx.ReqHeaderParser(&h)
```

Get URL Param e.g: localhost/:login
```go
login := ctx.Params("login")
```

Get URL Query using Example struct above e.g: localhost/?id=bagong
```go
p := new(Example)
err := ctx.QueryParser(p)
```

Get File Upload by FormFile using *image* as parameter name
```go
file, err := ctx.FormFile("image")
```
### Controller return

return status and json
```go
return ctx.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{"error": "id tidak valid"})
```

```go
return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
```

```go
return ctx.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{"error": "id tidak valid"})
```

```go
return ctx.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Tidak ada data laporan ditemukan"})
```

```go
return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"error": errstr, "update": res.ModifiedCount, "wa": resp.Response})
```
## Mongodb
string to primitive.ObjectID

```go
objectId, err := primitive.ObjectIDFromHex(strid)
```

Primitive.ObjectID to string

```go
strid:=objectId.Hex()
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
