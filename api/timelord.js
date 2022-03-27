export class TimeLord {
    static saveTo = "timelord.json"

    timeOverridden = true;
    match=10;
    status='waiting' // active or waiting

    robotsOverridden = false;
    red = []
    blue = []
}