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
         // use constructor, build new object and put it in array
         //
         let newGame = new VideoGame ( 
         document.getElementById("title").value, 
         document.getElementById("year").value,
         document.getElementById("playtime").value);
         document.getElementById("genre").value,
        
 
             
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

     //??????????????????????????????????????/
    $(document).bind("change", "#select-genre", function (event, ui) {
        selectedGenre = $('#select-genre').val();
    });  

    document.getElementById("delete").addEventListener("click", function () {
        let localID = localStorage.getItem('parm'); // read back the value stored when we created the list
        deleteGame(localID);
        createGameList();  // recreate li list after removing one
        document.location.href = "index.html#list";  // go back to game list 
    });

    //==============================
    // 2 sort button event methods
    // document.getElementById("buttonSortTitle").addEventListener("click", function () {
    //     movieArray.sort(dynamicSort("title"));
    //     createGameList();
    //     document.location.href = "index.html#list";
    // });

    // document.getElementById("buttonSortGenre").addEventListener("click", function () {
    //     gameArray.sort(dynamicSort("genre"));
    //     createGameList();
    //     document.location.href = "index.html#list";
    // });



            //-------------------------------------------------------------------------------------------
    // document.getElementById("buttonHundredHours").addEventListener("click", function () {
       
    //     createListSort("Over a hundred hours");  // recreate li list after removing one
    //     //document.location.href = "index.html#ListSome";  // go back to movie list 
    // });

    // document.getElementById("buttonShowGameBefore").addEventListener("click", function () {
       
    //     createListSort("After 2010");  // recreate li list after removing one
    //     //document.location.href = "index.html#ListSome";  // go back to movie list 
    // });

    // document.getElementById("buttonShowGameAfter").addEventListener("click", function () {
       
    //     createListSort("Before 2010");  // recreate li list after removing one
    //     //document.location.href = "index.html#ListSome";  // go back to movie list 
    // });


     //page before show
    $(document).on('pagebeforeshow', '#list', function () {
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
        document.getElementById("oneplaytime").innerHTML = "Your playtime hours: " + gameArray[arrayPointer].playtime;
        document.getElementById("onegenre").innerHTML = "Genre: " + gameArray[arrayPointer].genre;

    });



    




});
    


//Reference from MovieNode================================================
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
        li.classList.add('oneGame'); 
        // use the html5 "data-parm" to encode the ID of this particular data object
        // that we are building an li from
        li.setAttribute("data-parm", element.ID);
        //add ID later
        li.innerHTML = element.ID + ":  " + element.title + "'s release year was " + element.year + " and you have played for " + element.playtime + " hours";
        ul.appendChild(li);
    }); 
     gameList.appendChild(ul)

     // now we have the HTML done to display out list, 
    // next we make them active buttons
    // set up an event for each new li item, 
    var liArray = document.getElementsByClassName("oneGame");
    Array.from(liArray).forEach(function (element) {
        element.addEventListener('click', function () {
        // get that data-parm we added for THIS particular li as we loop thru them
        var parm = this.getAttribute("data-parm");  // passing in the record.Id
         
        // get our encoded value and save THIS ID value in the localStorage "dictionairy"
        localStorage.setItem('parm', parm);
        // but also, to get around a "bug" in jQuery Mobile, take a snapshot of the
        // current movie array and save it to localStorage as well.
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
    
        //Might have problems
        if (element.year === whichType) {
            // use handy array forEach method
            var li = document.createElement('li');
            // adding a class name to each one as a way of creating a collection
            li.classList.add('oneMovie');
            // use the html5 "data-parm" to encode the ID of this particular data object
            // that we are building an li from
            li.setAttribute("data-parm", element.ID);
            li.innerHTML = element.ID + ":  " + element.Title + "  " + element.Genre;
            ul.appendChild(li);
        }
    });
    divGameList.appendChild(ul)

    // now we have the HTML done to display out list, 
    // next we make them active buttons
    // set up an event for each new li item, 
    var liArray = document.getElementsByClassName("oneMovie");
    Array.from(liArray).forEach(function (element) {
        element.addEventListener('click', function () {
        // get that data-parm we added for THIS particular li as we loop thru them
        var parm = this.getAttribute("data-parm");  // passing in the record.Id
          
        // get our encoded value and save THIS ID value in the localStorage "dictionairy"
        localStorage.setItem('parm', parm);
        // but also, to get around a "bug" in jQuery Mobile, take a snapshot of the
        // current movie array and save it to localStorage as well.
        let stringMovieArray = JSON.stringify(movieArray); // convert array to "string"
        localStorage.setItem('movieArray', stringMovieArray);
        
         document.location.href = "index.html#details";
        });
    });

};


// }
 //  $(document).on('pagebeforeshow', '#add', function () {
 //     document.getElementById("title").value = ""; 
 //     document.getElementById("year").value = ""; 
 //     document.getElementById("creator").value  = ""; 
 // });