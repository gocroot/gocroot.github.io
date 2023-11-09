# Golang Cheat Sheet

## Type Declaration
```go
type Example struct {
	ID        primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty" url:"_id,omitempty" reqHeader:"token"`
	Messages  string             `json:"messages" bson:"messages" url:"messages" reqHeader:"token"`
}
```
1. json : for content/type json in RestFul
2. bson : using in mongoDB as name of field
3. url : use as variabel name in url query, like : https://domain.com/?messages=oaus098ji
4. reqHeader : use as HTTP header name in Request, like Authorization, Token, Content-Type, Origin


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

## Deploy Binary on Web Hosting
Create run.sh and stop.sh file. run.sh file  
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
.htaccess file  
```config
Options +FollowSymLinks -Indexes
IndexIgnore *
DirectoryIndex
<IfModule mod_rewrite.c>
RewriteEngine on
RewriteRule ^(.*)$ http://127.0.0.1:8080/api/$1 [P]
</IfModule>
```
## Deploy Binary to VPS
### build

```sh
$env:GOOS = 'linux'
$env:CGO_ENABLED = '1'
go build
scp -P 24520 api root@103.155.250.23:/root/apinew
ssh -p 24520 root@103.155.250.23 chmod +x /root/apinew
ssh -p 24520 root@103.155.250.23 ls -l
ssh -p 24520 root@103.155.250.23 systemctl status api
ssh -p 24520 root@103.155.250.23 systemctl stop api
ssh -p 24520 root@103.155.250.23 systemctl status api
ssh -p 24520 root@103.155.250.23 mv /root/apinew /root/api
ssh -p 24520 root@103.155.250.23 systemctl start api
ssh -p 24520 root@103.155.250.23 systemctl status api

```

### disable not used services

```sh
systemctl disable exim4
systemctl disable apache2
systemctl disable xinetd
```

### Create Service

```sh
vim /lib/systemd/system/api.service
```

```conf
[Unit]
Description=API Server

[Service]
Type=simple
Restart=always
RestartSec=10s
ExecStart=/root/api

[Install]
WantedBy=multi-user.target
```

```sh
systemctl enable api
systemctl start api
reboot
```

### ENV

```sh
vim /etc/environment
```

### NGINX Conf

```conf
server {
    listen 443 ssl;

    server_name api.wa.my.id;

    ssl_certificate /etc/letsencrypt/live/api.wa.my.id/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.wa.my.id/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
	
	client_max_body_size 999M;
    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header X-Real-IP  $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_set_header X-Forwarded-Port 443;
        proxy_set_header Host $host;
    }
}
```
