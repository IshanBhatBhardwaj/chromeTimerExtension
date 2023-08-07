const titleID = document.getElementById("titleInput")
const timeID = document.getElementById("timeInput")
const optionalID= document.getElementById("optionalInput")
const errorTitle = document.getElementById("error-title")
const errorTime = document.getElementById("error-time")
const errorOptional = document.getElementById("error-optional")
let timeArray = [0,0,0]

const setPage = async() => {

    const title_ = await chrome.storage.session.get(["title"])
    const time_ = await chrome.storage.session.get(["time"])


    if (title_.title && time_.time) {
            window.location.href = "clockpopup.html"
            // localStorage.setItem("ran", true)
            return
    }


}

const valDate = (date) => {



    // document.getElementById("button").addEventListener("click",enterName)
    let dateformat = /^(0?[1-9]|1[0-2])[\/](0?[1-9]|[1-2][0-9]|3[01])[\/]\d{4}$/;
    
        // Matching the date through regular expression      
        if (date.match(dateformat)) {

            let operator = date.split('/');
    
            // Extract the string into month, date and year      
            let datepart = [];
            if (operator.length > 1) {
                datepart = date.split('/');
    
            }
            let month = parseInt(datepart[0]);
            let day = parseInt(datepart[1]);
            let year = parseInt(datepart[2]);

        

    
    
            // Create a list of days of a month      
            let ListofDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            if (month == 1 || month > 2) {
                if (day > ListofDays[month - 1]) {
                    //to check if the date is out of range  
                    return false;
                }
            } else if (month == 2) {
                let leapYear = false;
                if ((!(year % 4) && year % 100) || !(year % 400)) leapYear = true;
                if ((leapYear == false) && (day >= 29)) return false;
                else
                    if ((leapYear == true) && (day > 29)) {
                        return false;
                    }
            }

            const dateNow = new Date()
            const datez = `${month}/${day}/${year}`
            const dateEntered = new Date(datez)
    
            if (dateEntered - dateNow < 0) {
                return false
            }

            
        } else {
            return false;
        }


        return true;
    
}

const valOptional = (option) => {

    let hours = null
    let minutes = null 
    let time = null

    try {
        let sliced = option.split(":")
        hours = parseInt(sliced[0])
        sliced = sliced[1].split(" ")
        minutes = parseInt(sliced[0])
        time = sliced[1]
        console.log(hours, minutes, time)
    }

    catch (error) {
        errorOptional.style.display = "block"
        return false
    }


    if (isNaN(hours) || hours > 12 || hours < 1) {
        errorOptional.style.display = "block"
        return false
    } else{
        errorOptional.style.display = "none"
    }

    if (isNaN(minutes) || minutes > 59 || minutes < 0) {
        errorOptional.style.display = "block"
        return false
    } else{
        errorOptional.style.display = "none"
        }
    
    if (time != "AM" && time != "PM" && time!= "aM" && time!="Am" && time!="pm" && time!= "Pm" && time!= "pM" && time!="am") {
        errorOptional.style.display = "block"
        console.log(time)
        return false;
    } else {
        timeArray[0] = hours
        timeArray[1] = minutes
        timeArray[2] = time
        return true
    }

}

const enterName = () =>  {

    let date = valDate(timeID.value)
    let title = titleID.value
    let optional = null
    
    if(optionalID.value == "") {
        optional = true
    } else{
        optional = valOptional(optionalID.value)
    }
    

    if (title=="") {
        errorTitle.style.display = "block"
    }else{
        errorTitle.style.display = "none"

    }

    if (!date) {
        errorTime.style.display = "block"
    }else{
        errorTime.style.display = "none"
    }


    if (date && titleID.value!="" && optional) {

        chrome.storage.session.set({"title": titleID.value})
        chrome.storage.session.set({"time": timeID.value})
        chrome.storage.session.set({"optional": timeArray})
    
        setPage()
        return 
    }



}

document.getElementById("button").addEventListener("click",enterName)

const load = async() => {

    const callPage = await localStorage.getItem("called")

    if (callPage == null) {
        setPage()
    } else {


        async function getValuesForInputField() {
            const title = await chrome.storage.session.get(["title"])
            const time = await chrome.storage.session.get(["time"])
            const optional = await chrome.storage.session.get(["optional"])

            titleID.value = title.title
            timeID.value = time.time
            if (optional.optional[2] == 0) {
                optionalID.value = ""
            } else {
                optionalID.value = `${optional.optional[0]}:${optional.optional[1]} ${optional.optional[2]}`
            }
        }

        getValuesForInputField()


        localStorage.removeItem("called")
    }
    
}

// titleID.value = "hello"
load()






