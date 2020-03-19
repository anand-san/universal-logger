const express = require('express')
const bodyParser = require('body-parser');
const {transports, createLogger, format} = require('winston');
const fs = require('fs');
const readline = require('readline');
var cors = require('cors')

const app = express()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())

app.post('/', (req, res) => {
    try{
        const logger = createLogger({
            format: format.combine(
                format.timestamp(),
                format.json()
            ),
            transports: [
                new transports.File({
                    filename: `logs/${req.body.ORG}/${req.body.Service}/${new Date().toLocaleDateString().replace(/\//g, "-")}/log.log`
                })
            ]
        });
        logger[req.body.logType](req.body.logData)
        res.status(200).json({ Status: 'Success' })
    }catch(e){
        const logger = createLogger({
            format: format.combine(
                format.timestamp(),
                format.json()
            ),
            transports: [
                new transports.File({
                    filename: `logs/server/${new Date().toLocaleDateString().replace(/\//g, "-")}/log.log`
                })
            ]
        });
        logger[req.body.logType](req.body.logData)
        res.status(500).json({ Status: 'Error' })
    }

})

app.get('/', async(req, res) => {
    try{
        var currentPage = req.query.page ? req.query.page : 1
        currentPage = currentPage <= 0 ? 1 : currentPage
        if(!req.query.id){
            throw "Id is required to get logs"
        }
        const sourceDir = `logs/${req.query.id}`
        if(fs.existsSync(sourceDir)){
            const subDirectories = (fs.readdirSync(sourceDir, { withFileTypes: true }).filter(dirent => dirent.isDirectory()).map(dirent => dirent.name))
            if(!req.query.subProj){
                throw `Please Provide a Sub Project to filter, Available Sub Projects : ${subDirectories.toString()}`
            }
            const filteredDirectory = `logs/${req.query.id}/${req.query.subProj}`
            if(fs.existsSync(`${sourceDir}/${req.query.subProj}`)){
                const availableDates = (fs.readdirSync(filteredDirectory, { withFileTypes: true }).filter(dirent => dirent.isDirectory()).map(dirent => dirent.name))
                if(!req.query.date){
                    throw `Please Provide a date to filter, Available Dates : ${availableDates.toString()}`
                }
                if(fs.existsSync(`${sourceDir}/${req.query.subProj}/${req.query.date}`)){
                    const fileStream = fs.createReadStream(`logs/${req.query.id}/${req.query.subProj}/${req.query.date}/log.log`);
                    const rl = readline.createInterface({
                        input: fileStream,
                        crlfDelay: Infinity
                      });
                    var newData = []
                    for await(const line of rl) {
                        try{
                            newData.push(JSON.parse(line))
                        }catch(e){
                            console.log(line)
                        }
                    }
                    try{
                        let count = 0
                        var paginatedData = newData.reduce((a,c) => {
                            if(count > ((currentPage - 1) * 500) && count < currentPage*500)
                                a.push(c)
                            count++
                            return a
                        }, [])
                    }catch(e){
                        throw "Error occoured while handling your request"
                    }

                    finalResponse = [{Total : newData.length, Page: currentPage, Logs : paginatedData}]
                    res.status(200).json({ Status: "Success", Message: finalResponse })
                }else{
                    throw `Invalid Date, Available Dates Are : ${availableDates.toString()}`
                }
            }else{
                throw `Invalid Sub Project, Available Sub Projects Are : ${subDirectories.toString()}`
            }
        }
        else
            throw "Invalid Id"
    }catch(e){
        console.log(e)
        const logger = createLogger({
            format: format.combine(
                format.timestamp(),
                format.json()
            ),
            transports: [
                new transports.File({
                    filename: `logs/server/${new Date().toLocaleDateString().replace(/\//g, "-")}/log.log`
                })
            ]
        });
        logger["error"](e)
        res.status(500).json({ Status: 'Error', Message: e })
    }
})
app.listen(11500, () => console.log(`Logger app listening on port 11500!`))