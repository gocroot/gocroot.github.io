# Deploy Golang

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