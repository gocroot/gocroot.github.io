# **GoCroot: Greatly Optimized Cloud Resource Operation and Orchestration Transformer**  
**Unlock the Full Potential of Cost-Effective Cloud Infrastructure**  

Elevate your cloud operations with **GoCroot**, the ultimate solution for businesses and developers seeking high performance and cost-efficiency. Designed to optimize backend infrastructure, GoCroot streamlines resource management and orchestration, ensuring seamless scalability and reduced overhead.  

- **Eco-Friendly:** Operate with a low carbon footprint.  
- **Efficient:** Simplify complex cloud architectures.  
- **Reliable:** Enhance operational stability.  

🚀 **Ready to scale efficiently? Try GoCroot today!**

---

## **GoCroot Modes**  
We offer two production modes tailored for different platforms:  
1. [**Net HTTP-Based**](https://github.com/gocroot/gcp)  
   - Fully compatible with [**Google Cloud Functions**](https://github.com/gocroot/gcp)  
   - **Recommended** for most use cases.  

2. **Fiber-Based**  
   - Ideal for platforms like [**fly.io**](https://github.com/gocroot/gocroot) and [**alwaysdata**](https://github.com/gocroot/alwaysdata).  

---

## **Type Declaration in Go**  
In Go, data structures are defined as `struct`. Here’s an example:

```go
type Example struct {
	ID       primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty" query:"id" url:"_id,omitempty" reqHeader:"token"`
	Messages string             `json:"messages" bson:"messages" query:"messages" url:"messages" reqHeader:"token"`
}
```

### Explanation of Tags:
- `json`: Used for JSON payloads in REST APIs.  
- `bson`: MongoDB field name.  
- `query`: URL query parameters, e.g., `https://domain.com/?messages=example`.  
- `url`: URL generator for queries.  
- `reqHeader`: HTTP headers, e.g., `Authorization`, `Token`.  

Quick struct declaration:  
```go
var request struct {
   Token string `json:"token"`
}
```

---

## **Routing with Net HTTP**  
Define routes in a simple `switch` statement. Example:

**With URL Parameter**  
```go
case method == "POST" && at.URLParam(path, "/webhook/nomor/:nomorwa"):
	controller.PostInboxNomor(w, r)
```

**Without URL Parameter**  
```go
case method == "GET" && path == "/data/phone/all":
	controller.GetBotList(w, r)
```

---

## **Controller Implementation**  
Controllers handle API logic. Below is a sample for Net HTTP and Fiber:

### **Net HTTP Example**  
```go
func Homepage(w http.ResponseWriter, r *http.Request) {
	// Your logic here
}
```

#### Common Operations:  
- Decode WhatsAuth Token to PhoneNumber and get Document by Phonenumber in MongoDB:
  ```go
  payload, err := watoken.Decode(config.PublicKeyWhatsAuth, at.GetLoginFromHeader(r))
  Example, err := atdb.GetOneDoc[model.Userdomyikado](config.Mongoconn, "user", primitive.M{"phonenumber": payload.Id})
  ```
  Furthermore, to protect every endpoint with authentication.
  ```go
  var respn model.Response
  payload, err := watoken.Decode(config.PublicKeyWhatsAuth, at.GetLoginFromHeader(r))
  if err != nil {
	respn.Status = "Error : Token Tidak Valid "
	respn.Info = at.GetSecretFromHeader(r)
	respn.Location = "Decode Token Error: " + at.GetLoginFromHeader(r)
	respn.Response = err.Error()
	at.WriteJSON(w, http.StatusForbidden, respn)
	return
  }
  _, err = atdb.GetOneDoc[model.Userdomyikado](config.Mongoconn, "user", primitive.M{"phonenumber": payload.Id})
  if err != nil {
  	respn.Status = "Error : User tidak ada di database "
	respn.Info = payload.Alias
	respn.Location = payload.Id
	at.WriteJSON(w, http.StatusNotFound, respn)
	return
  }
  ```
- Parse JSON body:  
  ```go
  var tasklists []report.TaskList
  err := json.NewDecoder(r.Body).Decode(&tasklists)
  ```
- Extract header:  
  ```go
  login := at.GetLoginFromHeader(r)
  //or
  secret := r.Header.Get("Secret")
  ```
- Get URL parameter:
  at.URLParam(path, "/data/pelanggan/one/:id")
  ```go
  id:=at.GetParam(r)
  //or
  id := r.URL.Path[strings.LastIndex(r.URL.Path, "/")+1:]
  ```
  Furthermore, with get data logic using mongoDB object ID
  ```go
	// get param
	objectId, err := primitive.ObjectIDFromHex(at.GetParam(r))
	if err != nil {
		respn.Status = "Error : object ID tidak valid"
		respn.Response = err.Error()
		at.WriteJSON(w, http.StatusPreconditionFailed, respn)
		return
	}
	//get database
	datapelanggan, err := atdb.GetOneDoc[model.DataPelanggan](config.Mongoconn, "pelanggan", primitive.M{"_id": objectId})
	if err != nil {
		respn.Status = "Error : gagal input database"
		respn.Response = err.Error()
		at.WriteJSON(w, http.StatusExpectationFailed, respn)
		return
	}
  ```
- Parse query parameter:  
  ```go
  id := r.URL.Query().Get("id")
  ```
- Handle file upload:  
  ```go
  _, header, err := r.FormFile("image")
  ```

**Return JSON Response:**  
```go
at.WriteJSON(w, http.StatusOK, Example)
```

---

### **Fiber Example**  
```go
func Homepage(ctx *fiber.Ctx) error {
	// Your logic here
	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"message": "success"})
}
```

#### Common Operations:  
- Parse JSON body:  
  ```go
  var userreq models.UserReq
  err := ctx.BodyParser(&userreq)
  ```
- Extract header:  
  ```go
  var h models.Header
  err := ctx.ReqHeaderParser(&h)
  ```
- Get URL parameter:  
  ```go
  login := ctx.Params("login")
  ```
- Parse query parameter:  
  ```go
  p := new(Example)
  err := ctx.QueryParser(p)
  ```
- Handle file upload:  
  ```go
  file, err := ctx.FormFile("image")
  ```

**Return JSON Response:**  
```go
return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"status": "success"})
```

---

## **MongoDB Integration**  
Easily log or manage documents in MongoDB:  

### Insert Document without Struct:  
```go
document := bson.D{
    {Key: "username", Value: "user1"},
    {Key: "createdAt", Value: time.Now()},
}
```

### Convert `ObjectID`:  
- String to `primitive.ObjectID`:  
  ```go
  objectId, err := primitive.ObjectIDFromHex(strid)
  ```
- `ObjectID` to String:  
  ```go
  strid := objectId.Hex()
  ```

---

## **Testing and Code Coverage**  
Ensure code quality with Go’s built-in testing tools.

1. **Write Test Cases:**  
   **`main_test.go`**  
   ```go
   func TestSum(t *testing.T) {
       result := Sum(2, 3)
       if result != 5 {
           t.Errorf("Expected 5, got %d", result)
       }
   }
   ```

2. **Run Tests with Coverage:**  
   ```bash
   go test -cover
   ```

3. **Generate Detailed Report:**  
   ```bash
   go test -coverprofile=coverage.out
   go tool cover -html=coverage.out
   ```

---

## **Deployment**  
Set up your Go environment:  
```bash
export GOPROXY=proxy.golang.org
```

Update dependencies and publish packages:  
```bash
go get -u all
go mod tidy
git tag v0.1.0
git push origin --tags
```

Deploy your application following our [deployment guide](./deploy/).

