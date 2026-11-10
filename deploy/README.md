# Deploy Golang

<!-- {% raw %} -->

Semua cara di bawah memakai **GoCroot Core** yang sama. Untuk Google Cloud Run functions (paling hemat), lihat [panduan workflow di core](https://github.com/gocroot/core#ci--cd-to-google-cloud-function). Untuk VPS, web hosting, dan Docker, yang dijalankan adalah binary dari folder `run`:

```sh
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -trimpath -ldflags="-s -w" -o api ./run
```

Binary ini statis (sekitar 7 MB), tidak membawa framework Cloud Functions, membaca port dari env `PORT` (default `3000`), dan berhenti dengan rapi saat menerima `SIGINT`, `SIGTERM`, `SIGHUP`, `SIGUSR1`, atau `SIGUSR2`.

## Berhenti dengan Rapi (Graceful Shutdown)

Setiap hosting menghentikan proses dengan mengirim sinyal. Tanpa penanganan sinyal, proses berhenti seketika di tengah request yang sedang berjalan, sehingga data bisa terputus separuh tertulis. Sebaliknya, proses yang tidak pernah benar-benar keluar akan terus melayani dengan kode lama meski binary baru sudah terunggah: restart dilaporkan berhasil, tetapi tidak ada yang berubah.

`run/main.go` di GoCroot Core menutup kedua celah itu: request yang sedang jalan diberi waktu selesai (maksimal 8 detik), lalu proses dipastikan keluar.

| Sinyal | Dikirim oleh |
|---|---|
| `SIGINT` | Ctrl+C saat `go run ./run` |
| `SIGTERM` | `systemctl stop/restart`, `docker stop`, Cloud Run, Render, Fly.io |
| `SIGHUP`, `SIGUSR1`, `SIGUSR2` | Fitur *Hot restart* di panel hosting. Di alwaysdata sinyalnya bisa dipilih di antara ketiganya. Tanpa penanganan, ketiganya membunuh proses Go seketika |

Batas 8 detik sengaja lebih pendek dari jeda sebelum supervisor mengirim `SIGKILL` (Docker dan Cloud Run 10 detik, systemd 90 detik). Jika Anda membuat server atau worker sendiri (misalnya consumer antrean), pakai pola yang sama. `SIGUSR1` dan `SIGUSR2` tidak ada di Windows, jadi daftar sinyal di core dipisah per OS (`run/sinyal_unix.go` dan `run/sinyal_other.go`) supaya `go run ./run` tetap jalan di Windows:

```go
// run/sinyal_unix.go (//go:build unix)
var sinyalBerhenti = []os.Signal{os.Interrupt, syscall.SIGTERM, syscall.SIGHUP, syscall.SIGUSR1, syscall.SIGUSR2}

// run/main.go
berhenti := make(chan os.Signal, 1)
signal.Notify(berhenti, sinyalBerhenti...)
s := <-berhenti
log.Printf("sinyal %v diterima, menutup dengan rapi (maks %s)", s, masaTutup)

ctx, cancel := context.WithTimeout(context.Background(), masaTutup)
defer cancel()
if err := srv.Shutdown(ctx); err != nil {
	log.Println("penutupan tidak tuntas:", err)
	srv.Close() // koneksi tersisa ditutup paksa, proses tetap keluar
}
```

## Siapkan SSH dan Script Deploy

### SSH tanpa password
sebelum membuat script deply.bat kita pastikan dulu ssh kita tanpa password. Sehingga tidak perlu memasukkan password
setiap kali menjalankan script deploy.  
Using git bash create yout key, you dont have to do this if you already have a key
```sh
ssh-keygen -t rsa -b 4096 -C "rolly@awang.ga"
```

send key to the server
```sh
cat ~/.ssh/id_rsa.pub | ssh -p 123 usernya@hostnya.com 'cat >> .ssh/authorized_keys'
```
ssh into server and change permission
```sh
chmod 700 .ssh; chmod 640 .ssh/authorized_keys
```
### Script Deploy
script deploy (PowerShell) untuk proyek hasil clone GoCroot Core. Binary dibangun dari folder `run` dengan nama `api`:
```sh
$env:GOOS = 'linux'
$env:GOARCH = 'amd64'
$env:CGO_ENABLED = '0'
go build -o api ./run
scp -P 123 api user@domain:/root/apinew
ssh -p 123 user@domain chmod +x /root/apinew
ssh -p 123 user@domain ls -l
ssh -p 123 user@domain systemctl status api
ssh -p 123 user@domain systemctl stop api
ssh -p 123 user@domain systemctl status api
ssh -p 123 user@domain mv /root/apinew /root/api
ssh -p 123 user@domain systemctl start api
ssh -p 123 user@domain systemctl status api

```


## Deploy Binary on Web Hosting
Buat dulu folder dan chmod folder tersebut ke 755
```sh
chmod -R 755 namafolder
```
buat file run.sh dan stop.sh file. run.sh file  
```sh
#!/bin/bash

if ! pgrep -f 'binary_app'
then
    nohup /home/file_path/binary_app && echo "baru running" > ./out_test.txt
else
    echo "udah di-run" > ./out_test.txt
fi
```
stop.sh file  
```sh
#!/bin/bash

if pgrep -f 'binary_app'
then
    pgrep -f 'binary_app' | xargs kill &&  echo "baru stop" > ./out_test.txt
else
    echo "udah di-stop" > ./out.txt
fi
```
pastikan dua file tersebut bisa di eksekusi dengan perintah chmod
```sh
chmod a+x run.sh stop.sh
```

buat .htaccess file di dalam folder
```config
Options +FollowSymLinks -Indexes
IndexIgnore *
DirectoryIndex
<IfModule mod_rewrite.c>
RewriteEngine on
RewriteRule ^(.*)$ http://127.0.0.1:3000/$1 [P]
</IfModule>
```
## Deploy Binary to VPS

GoCroot Core mendengarkan di port `:3000` (`config.Port`). Sesuaikan port di bawah jika kamu mengubahnya.

### disable not used services

```sh
systemctl disable exim4
systemctl disable apache2
systemctl disable xinetd
```

### Create Service

```sh
vim /etc/systemd/system/api.service
```

```conf
[Unit]
Description=API Server
After=network-online.target

[Service]
Type=simple
Restart=always
RestartSec=10s
EnvironmentFile=/root/api.env
ExecStart=/root/api

[Install]
WantedBy=multi-user.target
```

```sh
systemctl daemon-reload
systemctl enable --now api
systemctl status api
```

### ENV

Service systemd **tidak** membaca `/etc/environment`. Simpan env var di file yang dirujuk `EnvironmentFile=`:

```sh
vim /root/api.env
chmod 600 /root/api.env
```

```conf
MONGOSTRING=mongodb+srv://user:pass@cluster.example.net/mydatabase
PRIVATEKEY=...
PUBLICKEY=...
```

Setelah mengubah file ini, jalankan `systemctl restart api`.

### NGINX Conf

```conf
server {
    listen 443 ssl;

    server_name api.example.com;

    ssl_certificate /etc/letsencrypt/live/api.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.example.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
	
	client_max_body_size 999M;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header X-Real-IP  $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_set_header X-Forwarded-Port 443;
        proxy_set_header Host $host;
    }
}
```

## Deploy with Docker

Simpan sebagai `Dockerfile` di root proyek (hasil template core):

```dockerfile
# syntax=docker/dockerfile:1
FROM golang:1.27 AS build
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
# timetzdata menanam data zona waktu ke binary (scratch tidak punya /usr/share/zoneinfo)
RUN CGO_ENABLED=0 go build -tags timetzdata -trimpath -ldflags="-s -w" -o /api ./run

FROM scratch
# sertifikat CA wajib untuk koneksi TLS keluar (MongoDB Atlas, API HTTPS)
COPY --from=build /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=build /api /api
# scratch tidak punya /etc/passwd, jadi user non-root ditulis sebagai UID
USER 65532:65532
ENV PORT=8080
EXPOSE 8080
ENTRYPOINT ["/api"]
```

Build dan jalankan:

```sh
docker build -t myapi .
docker run -d --name myapi -p 8080:8080 \
  -e PRIVATEKEY=... -e PUBLICKEY=... -e MONGOSTRING=... \
  myapi
curl http://localhost:8080/
```

Catatan:
- Image akhir sekitar 10 MB: hanya binary (berisi data zona waktu) dan sertifikat CA, tanpa shell, package manager, atau library lain. Berjalan sebagai user non-root (UID 65532).
- **Jangan hapus baris `COPY` sertifikat CA.** Tanpa itu, koneksi ke MongoDB Atlas dan API HTTPS lain gagal dengan `x509: failed to verify certificate`.
- Build tag `timetzdata` menanam data zona waktu ke binary (sekitar 450 KB), karena `scratch` tidak punya `/usr/share/zoneinfo`. Tanpa itu, `time.LoadLocation("Asia/Jakarta")` di kode proyek akan mengembalikan error.
- Versi di `GET /version` diambil dari folder `.git` saat build. Jika `.git` dikecualikan lewat `.dockerignore`, isi saat menjalankan: `docker run -e VERSION=$(git rev-parse HEAD) ...`.
- `docker stop` memicu graceful shutdown: request yang sedang berjalan diberi waktu selesai (maksimal 8 detik, di bawah batas default `docker stop` 10 detik).
- Simpan secret di env atau secret manager platform, jangan di dalam image atau `Dockerfile`.

## CI/CD dengan GitHub Actions

Semua workflow di bawah memakai binary dari `./run` milik GoCroot Core. Simpan file workflow di `.github/workflows/` repo proyekmu, dan isi secret di *Settings → Secrets and variables → Actions*. Setiap workflow menjalankan `go vet` dan `go test` dulu, jadi kode yang gagal test tidak akan di-deploy.

### Pilih hosting

Kondisi per November 2026. Free tier sering berubah, jadi cek lagi halaman resminya sebelum memilih.

| Hosting | Biaya | Tidur saat sepi? | Cara deploy |
|---|---|---|---|
| [Google Cloud Run functions](https://cloud.google.com/free/docs/free-cloud-features#free-tier-usage-limits) | Gratis sampai 2 juta request/bulan (butuh billing account) | Ya, scale to zero (cold start singkat) | [Workflow di core](https://github.com/gocroot/core#ci--cd-to-google-cloud-function) |
| [alwaysdata](https://www.alwaysdata.com/en/pricing/) | Paket gratis: 1 GB disk, 256 MB RAM, 1/4 CPU | Tidak | [Workflow alwaysdata](#deploy-ke-alwaysdata) |
| [Render](https://render.com/docs/free) | Gratis 750 jam instance/bulan | Ya, setelah 15 menit tanpa request, bangun sekitar 1 menit | [Render](#deploy-ke-render) |
| [Oracle Cloud Always Free](https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm) atau VPS lain | Gratis: 2 VM AMD micro (1 GB RAM) atau Ampere setara 2 OCPU / 12 GB, egress 10 TB/bulan | Tidak (VM yang menganggur 7 hari bisa diambil kembali oleh Oracle) | [Workflow VPS](#deploy-ke-vps-oracle-cloud-always-free-dll) |
| [Fly.io](https://docs.fly.io/about/pricing) | **Tidak gratis** untuk akun baru (trial $1 selama 7 hari), mesin 256 MB sekitar $2,19/bulan | Bisa (auto stop) | [Workflow Fly.io](#deploy-ke-flyio) |

Tidak disarankan untuk proyek baru: **Koyeb** (paket gratis ditutup untuk pengguna baru sejak Februari 2026) dan **Railway** (hanya trial dan kredit kecil).

### Deploy ke alwaysdata

Persiapan di panel alwaysdata:

1. **Web → Sites → Add a site**, pilih tipe **User program**.
   - *Command*: `./api`
   - *Working directory*: folder tempat binary diunggah, misalnya `www/myapi`
   - *Environment*: `PRIVATEKEY=...`, `PUBLICKEY=...`, `MONGOSTRING=...` (satu per baris)
   - Catat ID site (angka di judul halaman).
   - alwaysdata memberi alamat `IP` dan `PORT` lewat environment. GoCroot Core membaca keduanya otomatis, jadi tidak perlu diisi.
2. **Remote access → SSH**: aktifkan SSH, lalu tambahkan public key deploy ke `~/.ssh/authorized_keys` di akun alwaysdata. Buat pasangan key khusus untuk deploy dengan `ssh-keygen -t ed25519 -f deploy_key -N ""`.
3. **Profile → Managing tokens**: buat API token untuk restart site.
4. Isi secret GitHub: `SSH_HOST` (misalnya `ssh-namaakun.alwaysdata.net`), `SSH_USERNAME`, `SSH_KEY` (isi file `deploy_key`), `APP_DIR` (path lengkap folder site, misalnya `/home/namaakun/www/myapi`), `ALWAYSDATA_TOKEN`, `ALWAYSDATA_SITE_ID`.
5. Isi *repository variable* (Settings → Secrets and variables → Actions → **Variables**) `SITE_URL`, misalnya `https://namaakun.alwaysdata.net`. Ini bukan secret, jadi disimpan sebagai variable.

`.github/workflows/deploy-alwaysdata.yml`:

```yaml
name: Deploy alwaysdata

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read

concurrency:
  group: deploy-alwaysdata
  cancel-in-progress: false

jobs:
  deploy:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with:
          persist-credentials: false

      - uses: actions/setup-go@b7ad1dad31e06c5925ef5d2fc7ad053ef454303e # v7.0.0
        with:
          go-version-file: go.mod

      - name: Test & build
        env:
          CGO_ENABLED: "0"
          GOOS: linux
          GOARCH: amd64
        run: |
          go vet ./...
          go test ./...
          go build -trimpath -ldflags="-s -w" -o api.new ./run

      - name: Upload binary
        uses: appleboy/scp-action@ff85246acaad7bdce478db94a363cd2bf7c90345 # v1.0.0
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          source: api.new
          target: ${{ secrets.APP_DIR }}

      - name: Swap binary
        uses: appleboy/ssh-action@0ff4204d59e8e51228ff73bce53f80d53301dee2 # v1.2.5
        env:
          APP_DIR: ${{ secrets.APP_DIR }}
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          envs: APP_DIR
          script: |
            set -e
            cd "$APP_DIR"
            chmod +x api.new
            mv -f api.new api

      - name: Restart site
        env:
          ALWAYSDATA_TOKEN: ${{ secrets.ALWAYSDATA_TOKEN }}
          SITE_ID: ${{ secrets.ALWAYSDATA_SITE_ID }}
        run: curl -fsS -X POST --user "${ALWAYSDATA_TOKEN}:" "https://api.alwaysdata.com/v1/site/${SITE_ID}/restart/"

      - name: Verify deployed version
        env:
          SITE_URL: ${{ vars.SITE_URL }}
        run: |
          # restart bisa "berhasil" padahal proses lama masih melayani; tunggu sampai /version = commit ini
          for i in $(seq 1 30); do
            live=$(curl -fsS -m 10 "$SITE_URL/version" | sed -n 's/.*"message":"\([^"]*\)".*/\1/p' || true)
            echo "percobaan $i: server melayani '${live:-tidak diketahui}'"
            [ "$live" = "$GITHUB_SHA" ] && { echo "versi baru sudah hidup"; exit 0; }
            sleep 10
          done
          echo "Binary terunggah, tetapi proses lama masih melayani."; exit 1
```

Catatan:
- Binary diunggah sebagai `api.new` lalu diganti dengan `mv`. Menimpa binary yang sedang berjalan secara langsung akan gagal (*Text file busy*).
- Restart dipanggil dari runner GitHub, jadi API token tidak pernah dikirim ke server.
- Langkah *Verify deployed version* memastikan proses baru benar-benar melayani. Restart alwaysdata berjalan di belakang layar, jadi bisa dilaporkan berhasil padahal proses lama belum berhenti. `GET /version` di GoCroot Core menampilkan SHA commit yang ditanam otomatis oleh `go build` dari folder `.git` hasil checkout, jadi tidak perlu `-ldflags` tambahan. Jangan menanam secret ke binary lewat `-ldflags -X`: siapa pun yang mendapat file binary bisa membacanya.
- Tombol *Hot restart* di panel alwaysdata mengirim sinyal yang dipilih di pengaturan site: `SIGHUP`, `SIGUSR1`, atau `SIGUSR2`. GoCroot Core menangani ketiganya. Semuanya diperlakukan seperti `SIGTERM`: request yang sedang berjalan diselesaikan dulu, lalu proses keluar dan alwaysdata menjalankan binary yang baru.
- Jika memakai password SSH, ganti `key: ${{ secrets.SSH_KEY }}` dengan `password: ${{ secrets.SSH_PASSWORD }}`. SSH key lebih aman.

### Deploy ke Render

Render bisa deploy otomatis setiap ada push ke GitHub, jadi tidak perlu workflow GitHub Actions. Simpan `render.yaml` di root repo, lalu di dashboard Render pilih **New → Blueprint** dan hubungkan repo-nya:

```yaml
services:
  - type: web
    name: myapi
    runtime: go
    plan: free
    region: singapore
    buildCommand: go build -trimpath -ldflags="-s -w" -o app ./run
    startCommand: ./app
    healthCheckPath: /
    envVars:
      - key: PRIVATEKEY
        sync: false
      - key: PUBLICKEY
        sync: false
      - key: MONGOSTRING
        sync: false
```

Catatan:
- Render memberi `PORT` lewat environment, dan GoCroot Core membacanya otomatis.
- `sync: false` membuat Render meminta nilai secret di dashboard, jadi nilainya tidak tersimpan di repo.
- Paket gratis tidur setelah 15 menit tanpa request. Request pertama setelah itu menunggu sekitar 1 menit.

### Deploy ke VPS (Oracle Cloud Always Free, dll.)

Siapkan server sesuai bagian [Deploy Binary to VPS](#deploy-binary-to-vps) di atas: service systemd `api` dengan `ExecStart=/opt/myapi/api` dan `EnvironmentFile=/opt/myapi/api.env`. Lalu:

1. Buat user khusus deploy yang memiliki folder `/opt/myapi`, dan izinkan hanya perintah restart service tanpa password (`sudo visudo -f /etc/sudoers.d/deploy`):
   ```
   deploy ALL=(root) NOPASSWD: /usr/bin/systemctl restart api
   ```
2. Tambahkan public key deploy ke `/home/deploy/.ssh/authorized_keys`.
3. Isi secret GitHub: `SSH_HOST`, `SSH_USERNAME` (`deploy`), `SSH_KEY`, dan *repository variable* `SITE_URL` (URL publik API, misalnya `https://api.domainmu.com`).

`.github/workflows/deploy-vps.yml`:

```yaml
name: Deploy VPS

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read

concurrency:
  group: deploy-vps
  cancel-in-progress: false

jobs:
  deploy:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with:
          persist-credentials: false

      - uses: actions/setup-go@b7ad1dad31e06c5925ef5d2fc7ad053ef454303e # v7.0.0
        with:
          go-version-file: go.mod

      - name: Test & build
        env:
          CGO_ENABLED: "0"
          GOOS: linux
          GOARCH: amd64 # ganti arm64 untuk VM Ampere (Oracle A1)
        run: |
          go vet ./...
          go test ./...
          go build -trimpath -ldflags="-s -w" -o api.new ./run

      - name: Upload binary
        uses: appleboy/scp-action@ff85246acaad7bdce478db94a363cd2bf7c90345 # v1.0.0
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          source: api.new
          target: /opt/myapi

      - name: Swap binary & restart
        uses: appleboy/ssh-action@0ff4204d59e8e51228ff73bce53f80d53301dee2 # v1.2.5
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            set -e
            cd /opt/myapi
            chmod +x api.new
            mv -f api.new api
            sudo systemctl restart api
            sleep 2
            systemctl is-active api

      - name: Verify deployed version
        env:
          SITE_URL: ${{ vars.SITE_URL }}
        run: |
          # restart bisa "berhasil" padahal proses lama masih melayani; tunggu sampai /version = commit ini
          for i in $(seq 1 30); do
            live=$(curl -fsS -m 10 "$SITE_URL/version" | sed -n 's/.*"message":"\([^"]*\)".*/\1/p' || true)
            echo "percobaan $i: server melayani '${live:-tidak diketahui}'"
            [ "$live" = "$GITHUB_SHA" ] && { echo "versi baru sudah hidup"; exit 0; }
            sleep 10
          done
          echo "Binary terunggah, tetapi proses lama masih melayani."; exit 1
```

Catatan:
- `systemctl restart` memicu graceful shutdown di GoCroot Core, jadi request yang sedang berjalan diberi waktu selesai.
- VM Oracle Ampere memakai CPU ARM, jadi build dengan `GOARCH: arm64`. VM AMD micro memakai `amd64`.

### Deploy ke Fly.io

Fly.io membangun image dari `Dockerfile` (lihat bagian [Deploy with Docker](#deploy-with-docker)). Simpan juga `fly.toml` di root repo:

```toml
app = "myapi"
primary_region = "sin"

[env]
  PORT = "8080"

[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = "stop"
  auto_start_machines = true
  min_machines_running = 0

  [[http_service.checks]]
    grace_period = "5s"
    interval = "30s"
    method = "GET"
    path = "/"
    timeout = "5s"

[[vm]]
  cpu_kind = "shared"
  cpus = 1
  memory_mb = 256
```

Persiapan sekali saja di komputer lokal:

```sh
fly launch --no-deploy          # membuat app sesuai fly.toml
fly secrets set PRIVATEKEY=... PUBLICKEY=... MONGOSTRING=...
fly tokens create deploy        # simpan hasilnya sebagai secret GitHub FLY_API_TOKEN
# lalu isi repository variable SITE_URL, misalnya https://myapi.fly.dev
```

`.github/workflows/deploy-fly.yml`:

```yaml
name: Deploy Fly.io

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read

concurrency:
  group: deploy-fly
  cancel-in-progress: false

jobs:
  deploy:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with:
          persist-credentials: false

      - uses: actions/setup-go@b7ad1dad31e06c5925ef5d2fc7ad053ef454303e # v7.0.0
        with:
          go-version-file: go.mod

      - name: Test
        run: |
          go vet ./...
          go test ./...

      - uses: superfly/flyctl-actions/setup-flyctl@fc53c09e1bc3be6f54706524e3b82c4f462f77be # 1.5

      - name: Deploy
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
        run: flyctl deploy --remote-only --env VERSION=${{ github.sha }}

      - name: Verify deployed version
        env:
          SITE_URL: ${{ vars.SITE_URL }}
        run: |
          # restart bisa "berhasil" padahal proses lama masih melayani; tunggu sampai /version = commit ini
          for i in $(seq 1 30); do
            live=$(curl -fsS -m 10 "$SITE_URL/version" | sed -n 's/.*"message":"\([^"]*\)".*/\1/p' || true)
            echo "percobaan $i: server melayani '${live:-tidak diketahui}'"
            [ "$live" = "$GITHUB_SHA" ] && { echo "versi baru sudah hidup"; exit 0; }
            sleep 10
          done
          echo "Binary terunggah, tetapi proses lama masih melayani."; exit 1
```

Catatan:
- `auto_stop_machines = "stop"` dan `min_machines_running = 0` mematikan mesin saat tidak ada request, jadi biaya hanya dihitung saat aktif. Gantinya ada cold start singkat.
- Secret disimpan dengan `fly secrets set`, jadi tidak masuk ke image maupun repo.
- `--env VERSION=...` mengisi versi untuk `GET /version`. Ini perlu karena `.dockerignore` sering mengecualikan `.git`, sehingga revisi git tidak ikut ter-build.

<!-- {% endraw %} -->
