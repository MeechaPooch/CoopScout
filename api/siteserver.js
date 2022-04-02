import express from 'express'

export class SiteServer {
    bindApi(app) {
        // let app = express();
        // app.use(express.static('../site/file/*'));

        app.get('/', (req, res) => {
            res.sendFile('index.html',{root:'../site'})
        })
        app.get('/file/:resource', (req, res) => {
            res.sendFile(req.params.resource,{root:'../site/file'})
        })
        app.get('/img/:resource', (req, res) => {
            res.sendFile(req.params.resource,{root:'../site/img'})
        })
        app.get('/file/fonts/gotham/:resource', (req, res) => {
            res.sendFile(req.params.resource,{root:'../site/file/fonts/gotham'})
        })
    }
}