
const title = document.querySelector(".title")


class Timer{

    constructor(root,userTime, optionalTime=-1) {

        const currentDate = new Date()

        const userDate = new Date(userTime)

        root.innerHTML = Timer.getHTML()

        this.el = {
            days: root.querySelector(".days"), 
            hours: root.querySelector(".hours"),
            minutes: root.querySelector(".minutes"),
            seconds: root.querySelector(".seconds"),
            colon1: root.querySelector(".colon1"),
            colon2: root.querySelector(".colon2"),
            colon3: root.querySelector(".colon3")
        }

        this.remainingSeconds = (userDate - currentDate) / 1000

        if (optionalTime != -1) {

            const hours = optionalTime[0]
            const minutes = optionalTime[1]
            const time = optionalTime[2]

            if (time == "PM" || time == "Pm" || time=="pM" || time=="pm") {
                this.remainingSeconds = this.remainingSeconds + ((hours + 12)* 3600) + (minutes * 60) 
            } else{
                this.remainingSeconds =  this.remainingSeconds + (hours * 3600) + (minutes * 60)
            }

        }

        this.start() 

    
    }


    updateTime() { 
        let days = Math.floor(this.remainingSeconds / 86400)
        let hours = Math.floor(this.remainingSeconds / 3600)
        let minutes = Math.floor(this.remainingSeconds / 60)
        let seconds = Math.floor(this.remainingSeconds % 60)

        if (minutes > 59) {
            minutes = minutes % 60
            hours = hours + Math.floor(minutes / 60)

        }

        if (hours > 23) {
            hours = hours % 24
            days = days + Math.floor(hours / 24)
        }

        this.el.days.innerHTML = days.toString().padStart(2,"0")
        this.el.hours.innerHTML = hours.toString().padStart(2,"0")
        this.el.minutes.innerHTML = minutes.toString().padStart(2,"0")
        this.el.seconds.innerHTML = seconds.toString().padStart(2,"0")
        this.el.colon1.innerHTML = ":"
        this.el.colon2.innerHTML = ":"
        this.el.colon3.innerHTML = ":"



    }



    stop() {
        clearInterval(this.interval)
    }




    start() {
        if (this.remainingSeconds==0) {
            return
        }

        this.interval = setInterval(()=> {
            this.remainingSeconds--
            this.updateTime()


            if (this.remainingSeconds==0) {
                this.stop()
            }
        },1000)

    }


    static getHTML() {
        return ` 

        <span class="time days"></span>
        <span class="time colon1"></span>
        <span class="time hours"></span>
        <span class="time colon2">Loading</span>
        <span class="time minutes"></span>
        <span class="time colon3"></span>
        <span class="time seconds"></span>

        `
    }
}

var userTime = ""

async function loadPage() {
    const getTitle = await chrome.storage.session.get(["title"])
    title.innerHTML = getTitle.title

    const response = await chrome.storage.session.get(["time"])
    userTime = response.time

    const optional = await chrome.storage.session.get(["optional"])

    new Timer(document.querySelector(".timer"),userTime, optional.optional)
}

const editClock = () => {
    localStorage.setItem("called",true)
    window.location.href = "popup.html"
}

document.querySelector(".edit").addEventListener("click", editClock)

loadPage()



