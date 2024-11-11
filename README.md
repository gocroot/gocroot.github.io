# Golang for Green Computing and Cloud Optimation
Backend framework to make sure on low cost deployment

## Pre-requisite

Please learn first :
1. Mongodb for database
2. Golang Struct
3. Golang function

## Type Declaration
In Golang, every piece of data we use acts as a struct. 

```go
type Example struct {
	ID        primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty" query:"id" url:"_id,omitempty" reqHeader:"token"`
	Messages  string             `json:"messages" bson:"messages" query:"messages" url:"messages" reqHeader:"token"`
}
```

Inside of backtick, is the type of data used by. 
1. json: for content/type json in RestFul
2. bson: using as the name of a field in MongoDB
3. query: use as variable name in URL query, like: https://domain.com/?messages=oaus098ji
4. url: use as the variable name for generating URL query, like: https://domain.com/?messages=oaus098ji
5. reqHeader: use as HTTP header name in Request, like Authorization, Token, Content-Type, Origin, Login

## Net HTTP Controller

[Net HTTP Based Example](https://github.com/domyid/domyikado) compatible with Google Cloud Function.

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

[Go Fiber Based Example](https://gocroot.github.io/alwaysdata/)


This is Go Fiber Controller:
```go
func Homepage(ctx *fiber.Ctx) error {
	//Controller Catcher section
		//your logic section
	//Controller return section
}
```
### Controller Catcher Section
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
### Controller return section

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

## Testing and Code Coverage
To measure code coverage in Go, you can use the built-in `go test` command, which has a `-cover` option. Here’s a basic example:

### 1. Create a Simple Go Program
Let’s create a simple program with a function to test:

**`main.go`**
```go
package main

import "fmt"

// Sum returns the sum of two integers.
func Sum(a, b int) int {
    return a + b
}

func main() {
    fmt.Println("Sum of 2 and 3 is:", Sum(2, 3))
}
```

### 2. Write a Test File
Now, create a test file for this function.

**`main_test.go`**
```go
package main

import "testing"

func TestSum(t *testing.T) {
    result := Sum(2, 3)
    expected := 5
    if result != expected {
        t.Errorf("Sum(2, 3) = %d; want %d", result, expected)
    }
}
```

### 3. Run Tests with Coverage
Run the test with code coverage using the `-cover` flag:

```bash
go test -cover
```

This will output the coverage percentage, such as:

```
PASS
coverage: 100.0% of statements
ok      yourmodule      0.001s
```

### 4. Generate a Detailed Coverage Report
You can generate a more detailed report with the `-coverprofile` flag:

```bash
go test -coverprofile=coverage.out
```

Then, to view it in a human-readable format, use:

```bash
go tool cover -html=coverage.out
```

This opens a browser window showing detailed coverage information, highlighting which lines were executed during the tests.

## Deploy Go

Go to [deploy page](./deploy/)
