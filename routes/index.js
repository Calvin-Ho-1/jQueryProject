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


// console.log(ServerGameArray);

var fs = require("fs")

fileManager  = {

  // this will read a file and put the data in our ServerGameArray 
  // NOTE: both read and write files are synchonous, we really can't do anything
  // useful until they are done.  If they were async, we would have to use call backs.
  read: function() {
    const stat = fs.statSync('gameData.json');
    if (stat.size !== 0) {                           
    var thedata = fs.readFileSync('gameData.json'); // read disk file
    ServerGameArray = JSON.parse(thedata);  // turn the file data into JSON format and overwrite our array
    }
    else {
      //A very real game with a very real creator
      // Also planning to remove year and creator with something else

      // ServerGameArray.push(new VideoGame("A real game", 2022, 694, "SinglePlayer"));
      // ServerGameArray.push(new VideoGame("Something creative", 2014, 234, "FPS"));
      // ServerGameArray.push(new VideoGame("Play vid game", 2018, 99999, "OpenWorld"));
      fileManager.write();
    }
  },
  
  write: function() {
    let data = JSON.stringify(ServerGameArray);    // take our object data and make it writeable
    fs.writeFileSync('gameData.json', data);  // write it
  },
}



/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.sendFile('index.html');
});


//shows all game data
router.get('/getAllVideoGames', function(req, res) {

  // need to get persisted data from disk before returning array
  fileManager.read();
  res.status(200).json(ServerGameArray);
});

//add a video game
router.post('/add', function(req, res) {
  const newGame = req.body;  // get object from req object sent from browser
  console.log(newGame);
  ServerGameArray.push(newGame); //adds to the array  

  //update data to disk file

  fileManager.write();
  
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

        //update data to disk file

          fileManager.write();

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

function indexOfbyKey(obj_list, key, value) {
  for (index in obj_list) {
      if (obj_list[index][key] === value) return index;
  }
  return -1;
}

// router.put('/updatedHours/:ID', (req, res) => {

// const IDKey = req.params.ID;
// const updatedGamehours = req.body;
// let found = true;
// console.log(IDKey);
// console.log(updatedGamehours);

// const gameindex = indexOfbyKey(ServerGameArray, "playtime", IDKey);
// if(gameindex < 0) {
//   found = false;
// }
// else{
//   ServerGameArray.splice(gameindex, 1, updatedGamehours)

// fileManager.write();
// }

//   if (!found){
//     console.log("Didn't update")
//     return res.status(500).json({
//       status: "error"
//     });
//   } else {
//   res.send('Your playtime is now ' + updatedgamehours);
//   }

// });


module.exports = router;
