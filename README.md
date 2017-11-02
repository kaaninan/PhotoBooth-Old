# PhotoBooth
Electron.js Application which takes your photos and publishes on Twitter using a Raspberry Pi 3

## How to Setup

### Raspiban on Raspberry Pi 3

1. sudo apt-get update
2. sudo apt-get upgrade
3. sudo apt-get install fswebcam npm
4. git clone https://github.com/kaaninan/PhotoBooth
5. cd PhotoBooth
6. npm install
7. npm start

Create file named twitter.json (as you see below) for twitter api connection. You can create keys from [https://apps.twitter.com](https://apps.twitter.com)

```json
{
	"consumer_key": "",
	"consumer_secret": "",
	"access_token": "",
	"access_token_secret": ""
}
```
