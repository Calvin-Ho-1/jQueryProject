let gameArray = [];
 
 //Changed GameObject to VideoGame
 let VideoGame = function (pTitle, pYear, pPlaytime, pGenre) {
    this.ID = Math.random().toString(16).slice(5)  // tiny chance could get duplicates!
    this.title = pTitle;
    this.year = pYear;
    this.playtime = pPlaytime;
    this.genre = pGenre;
     //this.creator = pCreator;
 }
let selectedGenre = "None right now";


 //PLAN FOR ADDING PLAYTIME
 //Adding the inital playtime counter will be with the other inputs
 //UPDATING the playtime can possibly be on the List all video games when clicked on a specific game
 
 
 
 
 // //A very real game with a very real creator
 // // Also planning to remove year and creator with something else
 // gameArray.push(new GameObject("A real game", "2022", "A real creator"));
 // gameArray.push(new GameObject("Something creative", "2014", "A gamer"));
 // gameArray.push(new GameObject("Play vid game", "2018", "Someone"));
 //  console.log(gameArray);

 
 
 document.addEventListener("DOMContentLoaded", function () {

     createGameList();

    //buttons====================================================================================
     document.getElementById("newGame").addEventListener("click", function () {

         let newGame = new VideoGame ( 
         document.getElementById("title").value, 
         document.getElementById("year").value,
         document.getElementById("playtime").value,
         selectedGenre);
        
 
             
         $.ajax({
             url : "/add",
             type: "POST",
             data: JSON.stringify(newGame),
             contentType: "application/json; charset=utf-8",
 
             success: function (result) {
                 console.log(result);
             }, 
         });

         //Clearing data that was inputted
         document.getElementById("title").value = "";
         document.getElementById("year").value = "";
         document.getElementById("playtime").value = "";
     });

     //
    $(document).bind("change", "#select-genre", function (event, ui) {
        selectedGenre = $('#select-genre').val();
    });  

    document.getElementById("delete").addEventListener("click", function () {
        let localID = localStorage.getItem('parm'); // read back the value stored when we created the list
        deleteGame(localID);
        createGameList();  // recreate li list after removing one
        document.location.href = "index.html#list";  // go back to game list 
    });

    //*********************
    // let pointer = 0;
    // document.getElementById("updateButton").addEventListener("click", function(){
    //     let which = document.getElementById("confirmUpdate").value

    //     gameArray.forEach(function(item,index){
    //         if (item.title === which)
    //         {
    //             document.getElementById("addPlaytime").value = item.playtime
    //             pointer = index;
    //             alert("Please adjust your playtime hours");
    //         }
    //     });
    // });
    // //************************* 
        
    // document.getElementById("updatePlaytime").addEventListener("click", function (){
    //     gameArray[pointer].playtime = document.getElementById("addPlaytime").value;
    //     console.log(gameArray[pointer]);

    //     $.ajax({
    //         url : "/updatedHours/" + gameArray[pointer].ID,
    //         type: "PUT",
    //         data: JSON.stringify(gameArray[pointer]),
    //         contentType: "application/json; charset=utf-8",

    //         success: function (result) {
    //             console.log(result);
    //         },    
    //         error:function(XMLHttpRequest, textStatus, errorThrown){
    //             alert("Status: " + textStatus); alert ("Error: " + errorThrown);
    //         } 
    //     });
        
          
    // });   

    //*****************
    
    
    

    
    //==============================
    // 2 sort button event methods
    // document.getElementById("buttonSortTitle").addEventListener("click", function () {
    //     gameArray.sort(extraSort("title"));
    //     createGameList();
    //     document.location.href = "index.html#list";
    //     console.log(gameArray);
    // });

    // document.getElementById("buttonSortGenre").addEventListener("click", function () {
    //     //gameArray.sort(extraSort("genre"));
    //     createGameList();
    //     document.location.href = "index.html#list";
    //     console.log(gameArray);
    // });



            //------------------------------------------------------------------------------------------

    document.getElementById("fpsgenre").addEventListener("click", function () {
       
        createListSubset("FPS");  // recreate li list after removing one
    });

    document.getElementById("openworldgenre").addEventListener("click", function () {
       
        createListSubset("OpenWorld");  
       
    });

    document.getElementById("genreother").addEventListener("click", function () {
       
        createListSubset("OtherGenres");  
        
    });

     //page before show
    $(document).on('pagebeforeshow', '#list', function () {
        var gameList = document.getElementById("gameList");
        while (gameList.firstChild) {    // remove any old data so don't get duplicates
            gameList.removeChild(gameList.firstChild);
        };
        createGameList();
    });

    $(document).on("pagebeforeshow", "#sort", function (event) {   // have to use jQuery 
        // clear prior data
        var gameList = document.getElementById("gameListSort");
        while (gameList.firstChild) {    // remove any old data so don't get duplicates
            gameList.removeChild(gameList.firstChild);
        };
    });

    $(document).on("pagebeforeshow", "#details", function (event) {   // have to use jQuery 
        let localID = localStorage.getItem('parm');  // get the unique key back from the dictionairy

        // next step to avoid bug in jQuery Mobile,  force the movie array to be current
        gameArray = JSON.parse(localStorage.getItem('gameArray'));  
  
        let arrayPointer = GetArrayPointer(localID);
        document.getElementById("onetitle").innerHTML = "The title is: " + gameArray[arrayPointer].title;
        document.getElementById("oneyear").innerHTML = "Year released: " + gameArray[arrayPointer].year;
        document.getElementById("oneplaytime").innerHTML = "Your current playtime: " + gameArray[arrayPointer].playtime;
        document.getElementById("onegenre").innerHTML = "Game genre: " + gameArray[arrayPointer].genre;

    });
// document.getElementById("oneID").innerHTML = "The unique ID for this game is: " + gameArray[arrayPointer].element.ID;
});
    


//===============================================
 function createGameList(){
     $.get("/getAllVideoGames", function(data, status){  // AJAX get
        gameArray = data;  // put the returned server json data into our local array


     let gameList = document.getElementById("gameList");
     while (gameList.firstChild) {    // remove any old data so don't get duplicates
        gameList.removeChild(gameList.firstChild);
     };
 
     let ul = document.createElement('ul');
 
     gameArray.forEach(function (element,) {   // use handy array forEach method
        let li = document.createElement('li');
        // adding a class name to each one as a way of creating a collection
        li.classList.add('oneVideoGame'); 
        // use the html5 "data-parm" to encode the ID of this particular data object
        // that we are building an li from
        li.setAttribute("data-parm", element.ID);
        
        li.innerHTML = "The game's title is " + element.title + " and its release year is " + element.year;
        ul.appendChild(li);
    }); 
     gameList.appendChild(ul)

     // now we have the HTML done to display out list, 
    // next we make them active buttons
    // set up an event for each new li item, 
    var liArray = document.getElementsByClassName("oneVideoGame");
    Array.from(liArray).forEach(function (element) {
        element.addEventListener('click', function () {
        // get that data-parm we added for THIS particular li as we loop thru them
        var parm = this.getAttribute("data-parm");  // passing in the record.Id
         
        // get our encoded value and save THIS ID value in the localStorage "dictionairy"
        localStorage.setItem('parm', parm);
        // but also, to get around a "bug" in jQuery Mobile, take a snapshot of the
        // current game array and save it to localS    torage as well.
        let stringGameArray = JSON.stringify(gameArray); // convert array to "string"
        localStorage.setItem('gameArray', stringGameArray);

        document.location.href = "index.html#details";
        });
    });
    });
 }
 
 
 function deleteGame(ID) {
    console.log(ID);
    $.ajax({
        type: "DELETE",
        url: "/DeleteGame/" +ID,
        success: function(result){
            alert(result);
        },
        error: function (xhr, textStatus, errorThrown) {  
            alert("Server could not delete Game with ID " + ID)
        }  
    });
}

// cycles thru the array to find the array element with a matching ID
function GetArrayPointer(localID) {
    for (let i = 0; i < gameArray.length; i++) {
        if (localID === gameArray[i].ID) {
            return i;
        }
    }
}
   


function createListSubset(whichType) {
    // clear prior data
    var divGameList = document.getElementById("gameListSort");
    while (divGameList.firstChild) {    // remove any old data so don't get duplicates
        divGameList.removeChild(divGameList.firstChild);
    };

    var ul = document.createElement('ul');

    gameArray.forEach(function (element,) {
    
        if (element.genre === whichType) {
            // use handy array forEach method
            var li = document.createElement('li');
            // adding a class name to each one as a way of creating a collection
            li.classList.add('oneVideoGame');
            // use the html5 "data-parm" to encode the ID of this particular data object
            // that we are building an li from
            li.setAttribute("data-parm", element.ID);
            li.innerHTML = element.ID + ":  " + element.title + "  " + element.genre;
            ul.appendChild(li);
        }
    }); 
    divGameList.appendChild(ul)

    // now we have the HTML done to display out list, 
    // next we make them active buttons
    // set up an event for each new li item, 
    var liArray = document.getElementsByClassName("oneVideoGame");
    Array.from(liArray).forEach(function (element) {
        element.addEventListener('click', function () {
        // get that data-parm we added for THIS particular li as we loop thru them
        var parm = this.getAttribute("data-parm");  // passing in the record.Id
          
        // get our encoded value and save THIS ID value in the localStorage "dictionairy"
        localStorage.setItem('parm', parm);
        // but also, to get around a "bug" in jQuery Mobile, take a snapshot of the
        // current game array and save it to localStorage as well.
        let stringGameArray = JSON.stringify(gameArray); // convert array to "string"
        localStorage.setItem('gameArray', stringGameArray);
        
         document.location.href = "index.html#details";
        });
    });

};

/**
 *  https://ourcodeworld.com/articles/read/764/how-to-sort-alphabetically-an-array-of-objects-by-key-in-javascript
* Function to sort alphabetically an array of objects by some specific key.
* 
* @param {string} prop Key of the object to sort.
*/
// function extraSort(prop) {
//     var sortOrder = 1;

//     if (title[0] === "-") {
//         sortOrder = -1;
//         prop = prop.substr(1);
//     }

//     return function (a, b) {
//         if (sortOrder == -1) {
//             return b[prop].localeCompare(a[prop]);
//         } else {
//             return a[prop].localeCompare(b[prop]);
//         }
//     }
// }






