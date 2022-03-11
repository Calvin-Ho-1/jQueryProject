var express = require('express');
var router = express.Router();

let ServerGameArray = [];

// Changed GameObject to VideoGame
let VideoGame = function (pTitle, pYear, pPlaytime, pGenre) {
    this.ID = Math.random().toString(16).slice(5)  // tiny chance could get duplicates!
    this.title = pTitle;
    this.year = pYear;
    this.playtime = pPlaytime;
    this.genre = pGenre;
    //this.creator = pCreator;
}

//A very real game with a very real creator
// Also planning to remove year and creator with something else
ServerGameArray.push(new VideoGame("A real game", 2022, 694, "Action"));
ServerGameArray.push(new VideoGame("Something creative", 2014, 234, "FPS"));
ServerGameArray.push(new VideoGame("Play vid game", 2018, 99999, "OpenWorld"));


console.log(ServerGameArray);

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.sendFile('index.html');
});


//shows all game data
router.get('/getAllVideoGames', function(req, res) {
  res.status(200).json(ServerGameArray);
});

//add a video game
router.post('/add', function(req, res) {
  const newGame = req.body;  // get object from req object sent from browser
  console.log(newGame);
  ServerGameArray.push(newGame); //adds to the array  
  
  //prepares a reply to the browser
  var response = {
    status  : 200,
    success : 'This has been updated successfully'
  }
  res.end(JSON.stringify(response)); // sends a reply
});

//added
router.delete('/DeleteGame/:ID', (req, res) => {
  const ID = req.params.ID;
  let found = false;
  console.log(ID);    

  for(var i = 0; i < ServerGameArray.length; i++) // find the match
  {
      if(ServerGameArray[i].ID === ID){
        ServerGameArray.splice(i,1);  // remove object from array
          found = true;
          break;
      }
  }

  if (!found) {
    console.log("not found");
    return res.status(500).json({
      status: "error"
    });
  } else {
  res.send('Game ' + ID + ' deleted!');
  }
});

module.exports = router;
