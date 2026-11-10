# **GoCroot: Greatly Optimized Cloud Resource Operation and Orchestration Transformer**
**Unlock the Full Potential of Cost-Effective Cloud Infrastructure**

Elevate your cloud operations with **GoCroot**, a lightweight Go backend skeleton for businesses and developers seeking high performance and cost-efficiency. GoCroot is built on the Go standard library (`net/http`), and **one codebase runs everywhere**: as a **Google Cloud Run function** (pay only when requests come in), as a single binary on a **VPS** or **web hosting**, or in a small **Docker** image.

- **Eco-Friendly:** Operate with a low carbon footprint, scale to zero when idle.
- **Efficient:** No web framework, just `net/http` and a few small helper packages.
- **Portable:** The same code runs locally, serverless, on a VPS, and in containers.

🚀 **Ready to scale efficiently? Start with [GoCroot Core](https://github.com/gocroot/core).**

---

## **Ecosystem**

| Repository | Purpose |
|---|---|
| [**gocroot/core**](https://github.com/gocroot/core) | **The starting point for every project.** Backend skeleton for Cloud Run functions, VPS, web hosting, and Docker |
| [gocroot/mgdb](https://github.com/gocroot/mgdb) | MongoDB helper (connect, CRUD, generic queries) |
| [gocroot/jsonapi](https://github.com/gocroot/jsonapi) | JSON API HTTP helper |
| [whatsauth/watoken](https://github.com/whatsauth/watoken) | PASETO token encode/decode, used for login |

## **One Core, Every Hosting**

[GoCroot Core](https://github.com/gocroot/core) is the only template you need. The same code has two entry points:

| Hosting | Entry point | How |
|---|---|---|
| **Google Cloud Run functions** (recommended for cost) | `gcf.go` → `WebHook` | `gcloud functions deploy`, see [Deployment](#deployment) |
| **VPS** | `run/main.go` | Static binary + systemd, see the [deployment guide](./deploy/#deploy-binary-to-vps) |
| **Web hosting** (Apache `.htaccess` proxy) | `run/main.go` | Static binary, see the [deployment guide](./deploy/#deploy-binary-on-web-hosting) |
| **Docker** | `run/main.go` | ~10 MB `scratch` image (binary + CA certificates), see the [deployment guide](./deploy/#deploy-with-docker) |
| **Local development** | `run/main.go` | `go run ./run` |

The binary never includes the Cloud Functions framework. It reads `PORT` from the environment and shuts down gracefully on `SIGINT`, `SIGTERM`, `SIGHUP`, `SIGUSR1`, and `SIGUSR2` (Ctrl+C, `docker stop`, `systemctl restart`, a hosting panel's *Hot restart*): requests in flight get up to 8 seconds to finish, then the process always exits so the new binary takes over.

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
export DEMO_USER=admin DEMO_PASSWORD=choose-a-password   # optional, enables the demo login
go run ./run          # http://localhost:3000
```

On Windows (PowerShell): `go run .\run\main.go`.

To generate a `PRIVATEKEY`/`PUBLICKEY` pair, clone [whatsauth/watoken](https://github.com/whatsauth/watoken) and run `go test`.

Try it:

```sh
curl http://localhost:3000/
curl -X POST http://localhost:3000/login -d '{"username":"admin","password":"choose-a-password"}'
curl http://localhost:3000/login -H "Token: <token from login>"
```

> The demo login is **off by default**: without `DEMO_USER` and `DEMO_PASSWORD` it answers `503`. Don't set them in production. Replace `controller.Login` with a real user lookup instead. An invalid or expired token answers `401`, so the frontend knows to ask the user to log in again.

---

## **Project Structure**

```
core/
├── gcf.go           # Cloud function entry point: functions.HTTP("WebHook", routes.HandleRoutes)
├── run/main.go      # Local server on config.Port (:3000)
├── config/
│   ├── config.go    # SetEnv(): reads PORT, MONGOSTRING, PRIVATEKEY, PUBLICKEY, ALLOWED_ORIGINS
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
	ID       primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Messages string             `json:"messages" bson:"messages"`
}
```

### Explanation of Tags:
- `json`: field name in the JSON payload of the REST API.
- `bson`: field name in MongoDB.

Query parameters, path parameters, and headers are read in the controller, see [Common operations](#common-operations).

Quick inline struct:

```go
var request struct {
	Token string `json:"token"`
}
```

---

## **Routing**

Routes live in `routes/routes.go` as a plain `switch` on method, then on path. It is the fastest option on Cloud Run functions (benchmarked against `http.ServeMux`) and needs no router dependency. CORS runs first and answers preflight requests.

### Routes that ship with core

```go
func HandleRoutes(w http.ResponseWriter, r *http.Request) {
	if config.SetAccessControlHeaders(w, r) {
		return // preflight (OPTIONS) already answered
	}

	switch r.Method {
	case http.MethodGet:
		switch r.URL.Path {
		case "/":
			controller.GetHome(w, r)
		case "/login":
			controller.GetUserName(w, r)
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
		controller.MethodNotAllowed(w, r)
	}
}
```

| Request | Response |
|---|---|
| `GET /` | `200` `{"status":"success","message":"Welcome"}` |
| `POST /login` | `200` with `token` (demo login, needs `DEMO_USER`/`DEMO_PASSWORD`), `404` wrong credentials, `503` demo login off |
| `GET /login` with header `Token` | `200` with `username`, `401` invalid or expired token |
| `GET`/`POST` to an unknown path | `404` JSON |
| Any other method (`PUT`, `DELETE`, `HEAD`, …) on any path | `405` JSON |
| `OPTIONS` from an allowed origin | `204` CORS preflight |

### Adding routes

1. **Static path:** add a `case` under the right method.
2. **Path parameter** (`/data/user/{id}`): put it in `default`, after the static paths, using `controller.PathParam`.
3. **New method** (`PUT`, `DELETE`): add a `case http.MethodPut:` block with its own `default: controller.NotFound(w, r)`. `PUT` and `DELETE` are already allowed for CORS. Any other method or custom header must be added to `Access-Control-Allow-Methods` / `Access-Control-Allow-Headers` in `config/cors.go`.

```go
	case http.MethodGet:
		switch r.URL.Path {
		case "/":
			controller.GetHome(w, r)
		case "/login":
			controller.GetUserName(w, r)
		case "/data/user/me": // static paths first, so "me" is never read as an id
			controller.GetMyProfile(w, r)
		default:
			if _, ok := controller.PathParam(r.URL.Path, "/data/user/"); ok {
				controller.GetUserByID(w, r) // /data/user/{id}
				return
			}
			controller.NotFound(w, r)
		}

	case http.MethodPut:
		if _, ok := controller.PathParam(r.URL.Path, "/data/user/"); ok {
			controller.UpdateUser(w, r) // PUT /data/user/{id}
			return
		}
		controller.NotFound(w, r)
```

Read the parameter in the controller with the **same prefix**, so routing and reading can never disagree:

```go
func GetUserByID(w http.ResponseWriter, r *http.Request) {
	id, ok := PathParam(r.URL.Path, "/data/user/")
	if !ok {
		NotFound(w, r)
		return
	}
	// ... look up id
}
```

`controller.PathParam(path, prefix)` returns the single path segment after `prefix` and `true`, or `false` if the path doesn't start with `prefix`, the segment is empty, or it contains another `/` (so `/data/user/1/x` is a `404`). It runs in a few nanoseconds without allocating. For more than one value, use query parameters (`/data/order?user=1&status=paid`, read with `r.URL.Query().Get`) or a dedicated prefix per resource.

### CORS origins

Set the frontend domains with the `ALLOWED_ORIGINS` environment variable, comma separated, for example `https://app.example.com,https://admin.example.com`. Without it, the default list in `config/cors.go` is used. Requests without an `Origin` header (server-to-server, `curl`) are always processed, they just get no CORS headers.

---

## **Controller**

A controller is a standard `net/http` handler:

```go
func GetHome(w http.ResponseWriter, r *http.Request) {
	WriteJSON(w, http.StatusOK, models.Response{Status: "success", Message: "Welcome"})
}
```

Core ships two helpers in `controller/controller.go`:

```go
// WriteJSON sets Content-Type, writes the status code, then encodes the body.
func WriteJSON(w http.ResponseWriter, status int, body any)

// DecodeJSON reads a JSON body into dst, limited to 1 MiB.
func DecodeJSON(w http.ResponseWriter, r *http.Request, dst any) error
```

Use them instead of building JSON with `fmt.Sprintf`, so values are escaped correctly and oversized bodies are rejected.

Core's `models.Response` has `status`, `message`, `token`, and `username`. For richer error details, extend it in `models/`:

```go
type Response struct {
	Status   string `json:"status"`
	Message  string `json:"message"`
	Token    string `json:"token,omitempty"`
	Username string `json:"username,omitempty"`
	// tambahan untuk detail error
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
  	WriteJSON(w, http.StatusUnauthorized, respn)
  	return
  }
  _, err = mgdb.GetOneDoc[models.User](config.MongoDB, "user", bson.M{"phonenumber": userID})
  if err != nil {
  	respn.Status = "Error : User tidak ada di database"
  	respn.Location = userID
  	WriteJSON(w, http.StatusNotFound, respn)
  	return
  }
  ```
- Parse JSON body:
  ```go
  var login models.LoginAuth
  err := DecodeJSON(w, r, &login)
  // or a list
  var tasklists []models.TaskList
  err = DecodeJSON(w, r, &tasklists)
  ```
- Extract header:
  ```go
  token := r.Header.Get("Token")
  //or
  secret := r.Header.Get("Secret")
  ```
- Get URL parameter (route `/data/pelanggan/one/{id}`):
  ```go
  id, ok := PathParam(r.URL.Path, "/data/pelanggan/one/")
  if !ok {
  	NotFound(w, r)
  	return
  }
  ```
  Furthermore, with get data logic using MongoDB object ID:
  ```go
  // get param
  objectID, err := primitive.ObjectIDFromHex(id)
  if err != nil {
  	respn.Status = "Error : object ID tidak valid"
  	respn.Response = err.Error()
  	WriteJSON(w, http.StatusPreconditionFailed, respn)
  	return
  }
  // get database
  datapelanggan, err := mgdb.GetOneDoc[models.DataPelanggan](config.MongoDB, "pelanggan", bson.M{"_id": objectID})
  if err != nil {
  	respn.Status = "Error : data tidak ditemukan"
  	respn.Response = err.Error()
  	WriteJSON(w, http.StatusExpectationFailed, respn)
  	return
  }
  WriteJSON(w, http.StatusOK, datapelanggan)
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
WriteJSON(w, http.StatusOK, Example)
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
	WriteJSON(w, http.StatusUnauthorized, models.Response{Status: "Unauthorized", Message: "invalid or expired token"})
	return
}
```

An invalid or expired token is answered with `401`, so the frontend knows the user must log in again.

### Why PASETO, not JWT

GoCroot uses [PASETO](https://paseto.io) v4.public (Ed25519) through `watoken`, not JWT:

- **No `alg` header to tamper with.** A JWT tells the server which algorithm to verify with, and that design led to well-known attacks: `alg: none` tokens accepted without a signature, and RS256/HS256 confusion where the public key is used as an HMAC secret. A PASETO token has a fixed version and purpose (`v4.public`), so there is nothing for an attacker to choose.
- **Cryptography is locked per version.** v4.public is always Ed25519. Programmers cannot pick a weak algorithm or misconfigure one.
- **Verification without a central auth server.** Tokens are signed with `PRIVATEKEY` and checked with `PUBLICKEY`, so any service that holds the public key can verify a token on its own. This comes from asymmetric signing (JWT with RS256/EdDSA can do the same), and PASETO makes it the only option.

Like any stateless token, a PASETO token cannot be revoked before it expires. Keep the lifetime short (`watoken.Encode` gives 2 hours). If you need forced logout, add a denylist instead of making tokens last longer.

Keep `PRIVATEKEY` only on the service that issues tokens (login). Services that only check tokens need `PUBLICKEY` alone.

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
>
> Don't call `log.Fatal` or `panic` when the connection fails. On Cloud Functions that kills the container at startup and the deploy fails with *Container Healthcheck failed*. Keep the error and answer `503` from endpoints that need the database:
>
> ```go
> if config.MongoErr != nil {
> 	WriteJSON(w, http.StatusServiceUnavailable, models.Response{Status: "Error", Message: "Database unavailable"})
> 	return
> }
> ```

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
- **Cost tip:** each deploy builds a large image in Artifact Registry, while the free tier is only 0.5 GB. The core workflow deletes `gcf-artifacts` after every deploy to keep storage near zero. See the [free tier limits](https://cloud.google.com/free/docs/free-cloud-features#free-tier-usage-limits).
- **Quick public URL from your machine:** `cloudflared tunnel --url 127.0.0.1:3000`.
- **VPS, web hosting, or Docker:** build the static binary from `./run`, see the [deployment guide](./deploy/).

### Free and low-cost hosting

Ready-to-copy GitHub Actions workflows (test → build → deploy on every push to `main`) are in the [deployment guide](./deploy/#cicd-dengan-github-actions). Status as of November 2026, free tiers change often:

| Hosting | Cost | Sleeps when idle? | CI/CD |
|---|---|---|---|
| Google Cloud Run functions | Free up to 2M requests/month (billing account required) | Scales to zero | [core workflow](https://github.com/gocroot/core#ci--cd-to-google-cloud-function) |
| alwaysdata | Free plan: 1 GB disk, 256 MB RAM, 1/4 CPU | No | [workflow](./deploy/#deploy-ke-alwaysdata) |
| Render | Free 750 instance hours/month | After 15 min idle (~1 min to wake) | [render.yaml](./deploy/#deploy-ke-render) |
| Oracle Cloud Always Free / any VPS | Free VMs (AMD micro 1 GB, or Ampere up to 2 OCPU / 12 GB) | No | [workflow](./deploy/#deploy-ke-vps-oracle-cloud-always-free-dll) |
| Fly.io | Not free for new accounts, ~$2.19/month for 256 MB | Optional auto stop | [workflow](./deploy/#deploy-ke-flyio) |

Core reads `PORT` and `IP` from the environment, so the same binary works on all of them without code changes.

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
