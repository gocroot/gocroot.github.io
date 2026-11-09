# **GoCroot: Greatly Optimized Cloud Resource Operation and Orchestration Transformer**
**Unlock the Full Potential of Cost-Effective Cloud Infrastructure**

Elevate your cloud operations with **GoCroot**, a lightweight Go backend skeleton for businesses and developers seeking high performance and cost-efficiency. GoCroot is built on the Go standard library (`net/http`) and runs both as a local server and as a **Google Cloud Run function**, so you only pay when requests come in.

- **Eco-Friendly:** Operate with a low carbon footprint, scale to zero when idle.
- **Efficient:** No web framework, just `net/http` and a few small helper packages.
- **Reliable:** The same code runs locally and in the cloud.

🚀 **Ready to scale efficiently? Start with [GoCroot Core](https://github.com/gocroot/core).**

---

## **Ecosystem**

| Repository | Purpose |
|---|---|
| [**gocroot/core**](https://github.com/gocroot/core) | **Recommended starting point.** Backend skeleton for Google Cloud Run functions and local development |
| [gocroot/mgdb](https://github.com/gocroot/mgdb) | MongoDB helper (connect, CRUD, generic queries) |
| [gocroot/jsonapi](https://github.com/gocroot/jsonapi) | JSON API HTTP helper |
| [whatsauth/watoken](https://github.com/whatsauth/watoken) | PASETO token encode/decode, used for login |

## **GoCroot Modes**

[**GoCroot Core**](https://github.com/gocroot/core) is the recommended mode for new projects. Other modes are still available for existing projects:

1. [**Net HTTP-Based**](https://github.com/gocroot/gcp)
   - Full application template for [**Google Cloud Functions**](https://github.com/gocroot/gcp), the predecessor of core.

2. **Fiber-Based**
   - For platforms like [**fly.io**](https://github.com/gocroot/gocroot) and [**alwaysdata**](https://github.com/gocroot/alwaysdata). See [Fiber Example](#fiber-example) below.

---

## **Quick Start**

Requirements: Go 1.27 or newer.

### 1. Create your project from the template

[gocroot/core](https://github.com/gocroot/core) is a **template repository**. Click **Use this template → Create a new repository** on GitHub, then clone *your* new repository:

```sh
git clone https://github.com/username/myapi.git
cd myapi
```

Or with the GitHub CLI: `gh repo create myapi --template gocroot/core --private --clone`.

### 2. Rename the Go module

Core is a skeleton you own and modify, not a library you import. Change the module path from `github.com/gocroot/core` to your own, so your imports become `github.com/username/myapi/controller`, `github.com/username/myapi/models`, and so on:

```sh
go mod edit -module github.com/username/myapi
grep -rl 'github.com/gocroot/core' --include='*.go' . | xargs sed -i 's#github.com/gocroot/core#github.com/username/myapi#g'
go build ./...
```

On macOS use `sed -i ''` instead of `sed -i`. On Windows (PowerShell):

```powershell
go mod edit -module github.com/username/myapi
Get-ChildItem -Recurse -Filter *.go | ForEach-Object {
    (Get-Content $_.FullName -Raw) -replace 'github.com/gocroot/core', 'github.com/username/myapi' | Set-Content $_.FullName -NoNewline
}
go build ./...
```

Your code still calls `controller.Login`, `models.LoginAuth`, `config.PublicKey`. Only the import lines change.

### 3. Run it

```sh
export PRIVATEKEY=... PUBLICKEY=... MONGOSTRING=...
go run ./run          # http://localhost:3000
```

On Windows (PowerShell): `go run .\run\main.go`.

To generate a `PRIVATEKEY`/`PUBLICKEY` pair, clone [whatsauth/watoken](https://github.com/whatsauth/watoken) and run `go test`.

Try it:

```sh
curl http://localhost:3000/
curl -X POST http://localhost:3000/login -d '{"username":"admin","password":"admin123"}'
curl http://localhost:3000/login -H "Token: <token from login>"
```

> The `admin`/`admin123` login is a dummy for demonstration only. Replace it with a real user lookup before going to production.

---

## **Project Structure**

```
core/
├── gcf.go           # Cloud function entry point: functions.HTTP("WebHook", routes.HandleRoutes)
├── run/main.go      # Local server on config.Port (:3000)
├── config/
│   ├── config.go    # SetEnv(): reads MONGOSTRING, PRIVATEKEY, PUBLICKEY
│   └── cors.go      # Allowed origins and preflight handling
├── routes/routes.go # HandleRoutes: switch on method, then on path
├── controller/      # HTTP handlers
└── models/          # Request/response/document structs
```

Request flow: `gcf.go` or `run/main.go` → `routes.HandleRoutes` → CORS check → `controller.*`.

---

## **Type Declaration**

Data structures are Go `struct`s. Here's an example:

```go
type Example struct {
	ID       primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty" query:"id" url:"_id,omitempty" reqHeader:"token"`
	Messages string             `json:"messages" bson:"messages" query:"messages" url:"messages" reqHeader:"token"`
}
```

### Explanation of Tags:
- `json`: Used for JSON payloads in REST APIs (core and Fiber).
- `bson`: MongoDB field name (core and Fiber).
- `query`: URL query parameters, e.g., `https://domain.com/?messages=example` (Fiber `QueryParser`).
- `url`: URL generator for queries (Fiber).
- `reqHeader`: HTTP headers, e.g., `Authorization`, `Token` (Fiber `ReqHeaderParser`).

With core (`net/http`) only `json` and `bson` are read automatically. Query parameters and headers are read manually, see [Common operations](#common-operations).

Quick inline struct:

```go
var request struct {
	Token string `json:"token"`
}
```

---

## **Routing**

Routes live in `routes/routes.go` as a plain `switch`. CORS runs first and answers preflight requests:

```go
func HandleRoutes(w http.ResponseWriter, r *http.Request) {
	if config.SetAccessControlHeaders(w, r) {
		return // preflight (OPTIONS) already answered
	}

	switch r.Method {
	case http.MethodGet:
		switch {
		case r.URL.Path == "/":
			controller.GetHome(w, r)
		case strings.HasPrefix(r.URL.Path, "/data/user/"):
			controller.GetUserByID(w, r) // path parameter, see below
		default:
			controller.NotFound(w, r)
		}
	case http.MethodPost:
		switch r.URL.Path {
		case "/login":
			controller.Login(w, r)
		default:
			controller.NotFound(w, r)
		}
	default:
		controller.NotFound(w, r)
	}
}
```

**With URL Parameter** (e.g. `/webhook/nomor/:nomorwa`)
```go
case r.Method == http.MethodPost && strings.HasPrefix(r.URL.Path, "/webhook/nomor/"):
	controller.PostInboxNomor(w, r)
```

**Without URL Parameter**
```go
case r.Method == http.MethodGet && r.URL.Path == "/data/phone/all":
	controller.GetBotList(w, r)
```

These `case` lines go inside a tagless `switch { ... }` in `HandleRoutes`.

When you add a method (`PUT`, `DELETE`) or a custom request header, also add it to `Access-Control-Allow-Methods` / `Access-Control-Allow-Headers` in `config/cors.go`. Frontend domains go into `allowedOrigins` in the same file.

---

## **Controller**

A controller is a standard `net/http` handler:

```go
func GetHome(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, map[string]string{"status": "success", "message": "Welcome"})
}

// helper: set header, status code, then encode the body
func writeJSON(w http.ResponseWriter, status int, body any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(body)
}
```

Use `json.NewEncoder` instead of building JSON with `fmt.Sprintf`, so values are escaped correctly.

A shared response struct keeps error messages consistent (add it to `models/`):

```go
type Response struct {
	Status   string `json:"status"`
	Info     string `json:"info,omitempty"`
	Location string `json:"location,omitempty"`
	Response string `json:"response,omitempty"`
}
```

### Common operations

- Decode the token to a user ID (e.g. phone number) and get the user document from MongoDB:
  ```go
  userID, err := watoken.DecodeGetId(config.PublicKey, r.Header.Get("Token"))
  user, err := mgdb.GetOneDoc[models.User](config.MongoDB, "user", bson.M{"phonenumber": userID})
  ```
  Furthermore, to protect every endpoint with authentication:
  ```go
  var respn models.Response
  userID, err := watoken.DecodeGetId(config.PublicKey, r.Header.Get("Token"))
  if err != nil {
  	respn.Status = "Error : Token Tidak Valid"
  	respn.Location = "Decode Token Error"
  	respn.Response = err.Error()
  	writeJSON(w, http.StatusForbidden, respn)
  	return
  }
  _, err = mgdb.GetOneDoc[models.User](config.MongoDB, "user", bson.M{"phonenumber": userID})
  if err != nil {
  	respn.Status = "Error : User tidak ada di database"
  	respn.Location = userID
  	writeJSON(w, http.StatusNotFound, respn)
  	return
  }
  ```
- Parse JSON body:
  ```go
  var login models.LoginAuth
  err := json.NewDecoder(r.Body).Decode(&login)
  // or a list
  var tasklists []models.TaskList
  err = json.NewDecoder(r.Body).Decode(&tasklists)
  ```
- Extract header:
  ```go
  token := r.Header.Get("Token")
  //or
  secret := r.Header.Get("Secret")
  ```
- Get URL parameter (route `/data/pelanggan/one/:id`):
  ```go
  id := strings.TrimPrefix(r.URL.Path, "/data/pelanggan/one/")
  //or
  id := r.URL.Path[strings.LastIndex(r.URL.Path, "/")+1:]
  ```
  Furthermore, with get data logic using MongoDB object ID:
  ```go
  // get param
  objectID, err := primitive.ObjectIDFromHex(id)
  if err != nil {
  	respn.Status = "Error : object ID tidak valid"
  	respn.Response = err.Error()
  	writeJSON(w, http.StatusPreconditionFailed, respn)
  	return
  }
  // get database
  datapelanggan, err := mgdb.GetOneDoc[models.DataPelanggan](config.MongoDB, "pelanggan", bson.M{"_id": objectID})
  if err != nil {
  	respn.Status = "Error : data tidak ditemukan"
  	respn.Response = err.Error()
  	writeJSON(w, http.StatusExpectationFailed, respn)
  	return
  }
  writeJSON(w, http.StatusOK, datapelanggan)
  ```
- Parse query parameter (`/data?id=123`):
  ```go
  id := r.URL.Query().Get("id")
  ```
- Handle file upload:
  ```go
  file, header, err := r.FormFile("image")
  ```

**Return JSON Response:**
```go
writeJSON(w, http.StatusOK, Example)
```

---

## **Fiber Example**

For the Fiber-based mode ([gocroot/gocroot](https://github.com/gocroot/gocroot), [gocroot/alwaysdata](https://github.com/gocroot/alwaysdata)), not used in core:

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

## **Authentication with Token**

Login issues a PASETO token, and protected endpoints read it from the `Token` header:

```go
// login: issue a token for the user id
token, err := watoken.Encode(login.UserName, config.PrivateKey)

// protected endpoint: validate the token
userID, err := watoken.DecodeGetId(config.PublicKey, r.Header.Get("Token"))
if err != nil {
	writeJSON(w, http.StatusForbidden, map[string]string{"status": "Forbidden", "message": "invalid token"})
	return
}
```

---

## **MongoDB with mgdb**

```sh
go get github.com/gocroot/mgdb
```

Connect once in `config.SetEnv()` and keep the database handle in a global variable:

```go
var (
	MongoDB  *mongo.Database
	MongoErr error
)

func SetEnv() {
	once.Do(func() {
		// ...
		MongoString = os.Getenv("MONGOSTRING")
		MongoDB, MongoErr = mgdb.MongoConnect(mgdb.DBInfo{
			DBString: MongoString,
			DBName:   "mydatabase",
		})
	})
}
```

> Make sure `MONGOSTRING` is set to a valid `mongodb://` or `mongodb+srv://` URI. An empty or malformed value can make the app crash at startup.

Then use the generic helpers in controllers:

```go
// get one document by ObjectID
objectID, err := primitive.ObjectIDFromHex(id)
user, err := mgdb.GetOneDoc[models.User](config.MongoDB, "user", bson.M{"_id": objectID})

// get all documents
users, err := mgdb.GetAllDoc[[]models.User](config.MongoDB, "user", bson.M{})

// insert
insertedID, err := mgdb.InsertOneDoc(config.MongoDB, "user", newUser)

// update
_, err = mgdb.UpdateOneDoc(config.MongoDB, "user", bson.M{"_id": objectID}, bson.M{"name": "New Name"})
```

### ObjectID conversion

```go
objectID, err := primitive.ObjectIDFromHex(strID) // string → ObjectID
strID := objectID.Hex()                            // ObjectID → string
```

### Insert without a struct

```go
doc := bson.D{
	{Key: "username", Value: "user1"},
	{Key: "createdAt", Value: time.Now()},
}
```

See the [mgdb README](https://github.com/gocroot/mgdb) for all helpers.

---

## **Testing and Code Coverage**

1. **Write test cases** in `*_test.go` files:
   ```go
   func TestSum(t *testing.T) {
   	if got := Sum(2, 3); got != 5 {
   		t.Errorf("expected 5, got %d", got)
   	}
   }
   ```
2. **Run checks and tests:**
   ```sh
   go build ./... && go vet ./... && go test -cover ./...
   ```
3. **Generate an HTML coverage report:**
   ```sh
   go test -coverprofile=coverage.out ./...
   go tool cover -html=coverage.out
   ```

---

## **Deployment**

- **Google Cloud Run functions (recommended):** entry point `WebHook`, runtime `go127`. A ready-to-copy GitHub Actions workflow is in the [core README](https://github.com/gocroot/core#ci--cd-to-google-cloud-function). Check the [runtime schedule](https://docs.cloud.google.com/functions/docs/runtime-support) regularly, because older Go runtimes are deprecated.
- **Quick public URL from your machine:** `cloudflared tunnel --url 127.0.0.1:3000`.
- **VPS or web hosting:** see the [deployment guide](./deploy/).

### Publishing a module version

Set up your Go environment:
```sh
export GOPROXY=proxy.golang.org
```

Update dependencies and publish packages:
```sh
go get -u all
go mod tidy
git tag v0.1.0
git push origin --tags
```
