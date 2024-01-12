document.addEventListener("DOMContentLoaded", function () {
    const calendarBody = document.getElementById("calendar-body");
    const currentMonth = document.getElementById("currentMonth");


    let currentYear, currentMonthIndex;
    let createEventClicked=false;
    const now = new Date();
   
    currentYear = now.getFullYear();
    currentMonthIndex = now.getMonth();
    generateCalendar(now.getFullYear(), now.getMonth());


    const prevButton = document.querySelector('button[data-action="previous"]');
    const nextButton = document.querySelector('button[data-action="next"]');

    prevButton.addEventListener("click", previousMonth);
    nextButton.addEventListener("click", nextMonth);

        function generateCalendar(year, month) {
            const lastDay = new Date(year, month + 1, 0).getDate();
            
            const firstDay = new Date(year, month, 1).getDay();
            
            currentMonth.textContent = new Date(year, month, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
            calendarBody.innerHTML = "";
    
            let currentDay = 1;
    
            for(let row=0;row<6;row++){
                const tr = document.createElement("tr");
                

               if(currentDay<=lastDay){
                
                for (let col = 0; col < 7; col++) {
                    const td = document.createElement("td");
                    if (row === 0 && col < firstDay) {
                        td.textContent = "";
                    } 
                    else if (currentDay <= lastDay) {
                        td.textContent = currentDay;
                        currentDay++;
                    } else {
                        td.textContent = "";
                    }
                    tr.appendChild(td);
            }
        }
                calendarBody.appendChild(tr);
            }


    }

    function previousMonth() {
    currentMonthIndex--;
    if (currentMonthIndex < 0) {
        currentMonthIndex = 11; 
        currentYear--;
    }
    generateCalendar(currentYear, currentMonthIndex);
}

function nextMonth() {
    currentMonthIndex++;
    if (currentMonthIndex > 11) {
        currentMonthIndex = 0; 
        currentYear++;
    }
    generateCalendar(currentYear, currentMonthIndex);
}


const popup = document.getElementById("popup");
// const openPopupButton = document.querySelectorAll(".calendar-table td");
const calendarContainer = document.querySelector(".calendar-container");
const popupDateMonth = document.getElementById("popup-date-month");
const sidepopup = document.getElementById("side-popup");

function resetPopup() {
    document.getElementById("event-time-select").selectedIndex = 0; 
    document.getElementById("event-name").value = ""; 
    document.getElementById("event-email").value = ""; 
    document.getElementById("event-comments").value = ""; 
}

let selectedDateCell = null;


calendarContainer.addEventListener("click", function (event) {
   
    const selectedDate = event.target.textContent;
        if (event.target.tagName === "TD") {
            selectedDateCell = event.target; 
            

        const backgroundColor = getComputedStyle(selectedDateCell).backgroundColor;
        if (backgroundColor === "rgb(0, 128, 0)") {
            sidepopup.style.display = "block";
            loadEvents(selectedDate);
           

        }else{
        popupDateMonth.textContent = `${selectedDate} ${currentMonth.textContent}`;
        resetPopup();
        popup.style.display = "block";
        }
        }
     
        
    });


const closePopupButton = document.getElementById("close-popup");
const saveEventButton = document.getElementById("save-event");
const closePopupButtonSide = document.getElementById("close-popup-side");


saveEventButton.addEventListener("click", () => {
    const eventTime = document.getElementById("event-time-select").value;
    const eventName = document.getElementById("event-name").value;
    const eventEmail = document.getElementById("event-email").value;
    const eventComments = document.getElementById("event-comments").value;

    const selectedDate = popupDateMonth.textContent.split(' ')[0];


    popup.style.display = "none";

    if (selectedDateCell) {
        selectedDateCell.style.backgroundColor = 'green';
    }
    


    const event = {
        time: eventTime,
        name: eventName,
        email: eventEmail,
        comments: eventComments
    };
    const eventKey = `${selectedDate}-${eventTime}`;
    

    localStorage.setItem(eventKey, JSON.stringify(event));

    console.log(sidepopup.style.display);


    if(sidepopup.style.display == "block"){
        loadEvents(selectedDate);
    }



    
});


closePopupButton.addEventListener("click", () => {
    // console.log("pop-up");
    popup.style.display = "none";
});

closePopupButtonSide.addEventListener("click", () => {
    sidepopup.style.display = "none";
});



// localStorage.clear();

function loadEvents(selectedDate) {

    // console.log("inside a loadevent");
    const sidePopupContent = document.querySelector(".side-content");
    sidePopupContent.innerHTML = "";
    sidePopupContent.innerHTML = `<h2> Your Events For  ${selectedDate} ${currentMonth.textContent} </h2>` ;




    const createEventButton = document.createElement("button");
    createEventButton.id = "create-event-button";
    createEventButton.textContent = "Create New Event";
    createEventButton.addEventListener("click", () => {
        // Handle the click event for the button

        createEventClicked = true;
        popupDateMonth.textContent = ""; // Clear the date initially
        popupDateMonth.textContent = `${selectedDate} ${currentMonth.textContent}`;
        resetPopup();
        popup.style.display = "block";
    });


    for (let i = 0; i < localStorage.length; i++) {
        // console.log(localStorage.length);
        const key = localStorage.key(i);



        if (key.startsWith(selectedDate)) {
    const event = JSON.parse(localStorage.getItem(key));
            const eventDiv = document.createElement("div");
            eventDiv.classList.add("event-details");

        eventDiv.innerHTML = `
            <h3>Event: ${event.name}</h3>
            <p>Time: ${event.time}</p>
            <p>Email: ${event.email}</p>
            <p>Comments: ${event.comments}</p>
        `;

        sidePopupContent.appendChild(eventDiv);

       
        }
    }

    sidePopupContent.appendChild(createEventButton);
}


});
