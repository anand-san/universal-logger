

<h1 align="center">UINIVERSAL LOGGER</h1>

<div align="center">

[![ExpressJS](https://img.shields.io/badge/ExpressJS-black.svg?style=for-the-badge)](https://expressjs.com)
[![Discord](https://img.shields.io/badge/discord-chat-green.svg?style=for-the-badge)](https://discord.gg/5mwNujH)
[![](https://img.shields.io/badge/LICENSE-GNU-orange.svg?style=for-the-badge)](./LICENSE)
[![Contribution](https://img.shields.io/badge/contribute-green.svg?style=for-the-badge)](https://github.com/seanjin17/universal-logger/pulls)


<h6>Universal logger is an open source project that solves the basic need of having a centralised logging system which can be invoked via API. Logs can be Stored/Fetched via APIs. This is a file based logger. Filters and pagination can be done while fetching the logs</h6>
</div>

------------------------------------------
### Prerequisites
[Nodejs](https://nodejs.org/en)

## Installation
`git clone https://github.com/seanjin17/universal-logger.git`

`cd universal-logger && npm install`

`node index.js`

**Consider using a process manager (like PM2) in production environment**

------------------------------------------
## Usage
After you run the code, An api will be exposed with GET and POST methods on the port you have provided (default 11500)

**The POST method requires 4 Mandatory parameters in order to post a log to the server :**

```
1. `ORG` - Unique Identifier for the Log Group, Ex: The project you are working on
2. `Service` - You can define multiple services under an Organisation. Ex: UI Logs, Server Logs
3. `logData` - is the log message you actually want to LOG
4. `logTyoe` - is the log Level for the log. Ex: info, error
```

**Below is a sample request body to POST a log to the server**

```
{ 
	"ORG": "MyOrganisationName", 
	"Service": "My1stLogService", 
	"logData" : "Hi, This the my first Log", 
	"logType" : "info" #Log Level 
}
```

**The GET endpoint accepts 3 required query-string parameters**

```
1. id - This the value of "ORG" mentioned while posting the logs
2. subProj - This the value of "Service" mentioned while posting the logs
3. date - The date for which you want to fetch the logs <M-D-YY>
```

**Below is a sample GET request**

```
GET : http://localhost:11500/?id=MyOrganisationName&subProj=My1stLogService&date=3-18-2020&page=1
```


By default only 500 logs can be fetched at once and can be accessed via `page` parameter in query-string


------------------------------------------
### Workflow

```
After you post a log a new folder will be created with the "ORG" name 
and another subFolder will be created under "ORG" folder with the "Service" name. 
Inside that folder different sets of subfolders will be automatically created based 
on current date when the log is posted.

Ex: If i post a log on 18th March 2020. The code will look for a folder with value 3-12-2020, 
If its there it will append my new log into the logs that came on this date, 
Otherwise it will create a new folder and store the logs inside it.

When you post the log for the first time with a new ORG/Service name, 
A new folder will be created for that ORG/Service and all the logs will be stored 
under its specific folder only.
```

------------------------------------------
### Contributing

 * This project is open to `enhancements` & `bug-fixes` :smile:.
 * Feel free to add issues and submit patches

------------------------------------------
### Author
Anand - [GIT](https://github.com/seanjin17) - [Website](https://my.anandks.com) - [Discord](https://discord.gg/5mwNujH)

------------------------------------------
### License
This project is licensed under the MIT - see the [LICENSE](./LICENSE) file for details

