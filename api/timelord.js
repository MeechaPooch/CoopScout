export class TimeLord {
    static saveTo = "timelord.json"

    timeOverridden = true;
    match=10;
    status='waiting' // active or waiting
    demo = false;

    robotsOverridden = false;
    red = []
    blue = []

    bindApi(app) {
        app.put('/timelord',(req,res)=>{
            console.log(req.body)
            this.timeOverridden = req.body.override;
            this.match = req.body.match;
            this.status = req.body.status;
            this.robotsOverridden = req.body.robotsOverride;
            this.red = req.body.red;
            this.blue = req.body.blue;
            this.demo = req.body.demo;
            console.log(this);
            res.end()
        })
    }

}