import express from 'express'

export class SiteServer {
    bindApi(app) {
        // let app = express();
        // app.use(express.static('../site/file/*'));

        app.get('/', (req, res) => {
            res.sendFile('index.html',{root:'../pages/site'})
        })
        app.get('/file/:resource', (req, res) => {
            res.sendFile(req.params.resource,{root:'../pages/site/file'})
        })
        app.get('/img/:resource', (req, res) => {
            res.sendFile(req.params.resource,{root:'../pages/site/img'})
        })
        app.get('/file/fonts/gotham/:resource', (req, res) => {
            res.sendFile(req.params.resource,{root:'../pages/site/file/fonts/gotham'})
        })


        /// Admin
        app.get('/admin/:resource', (req, res) => {
            res.sendFile(req.params.resource,{root:'../pages/admin'})
        })
    }
}