//Controls the loading of data into the DOM
//The team id is located in the url in the form of ?team={teamId} OR ?team={3 letter abbreviation}
//When coming from the standings page it will be in the form of the teamId
//The page is largely static once the page is loaded, however all data is loaded via ajax calls
//The only user interaction with this page is the toggle of the different rtoster teams
const params = new URL(document.location).searchParams;
const teamId = params.get("team");
const teamSlug = params.get("name");
const url = baseURL + "/teams/" + teamId;

getTeamInfo();
getRoster();
getStats();
getGames();

//Ajax call to get the basic info of the team
//Passes data to loadStats()
//NO return value
function getTeamInfo() {
  const xhttp = new XMLHttpRequest();
  let response;
  xhttp.onload = function () {
    response = JSON.parse(this.responseText);
  };
  xhttp.open("GET", url, true);
  xhttp.send();

  let timeOut = setInterval(() => {
    if (response != undefined) {
      setTeam(response.team);
      clearInterval(timeOut);
    }
  }, 50);
}

// Loads the data array passed to it into the .title element on the DOM
// Changes the background style of the .styledTitle, and ( #title, #division, #record) innerText
//  No return value
function setTeam(data) {
  //set H1 and title to name of team
  document.getElementById("title").innerText = data.displayName;
  document.getElementById("teamName").innerText = data.displayName;
  // The two colors are in lowercase in order to compare them so that the contrast is clear on the page
  const primaryColor = data.color.toLowerCase();
  const altColor = data.alternateColor.toLowerCase();
  //   set the style of the head background to a gradient of the team's two colors
  const headBackground =
    "linear-gradient(336deg, #" + altColor + " 0%, #" + primaryColor + " 45%)";
  document.getElementsByClassName("styledTitle")[0].style =
    "background: " + headBackground;
  // set division rank
  document.getElementById("division").innerText = data.standingSummary;
  //   set record
  document.getElementById("record").innerText = data.record.items[0].summary;
  //   set logo
  let logo = document.getElementById("logo");
  logo.src = data.logos[0].href;
  logo.alt = data.displayName;
  //set favicon
  document.getElementById("favicon").href = data.logos[3].href;
}

//Ajax call to get the team Roster
//Passes data to loadStats()
//NO return value
function getRoster() {
  const rosterUrl = url + "/roster";
  const xhttp = new XMLHttpRequest();
  let response;
  xhttp.onload = function () {
    response = JSON.parse(this.responseText);
  };
  xhttp.open("GET", rosterUrl, true);
  xhttp.send();
  // The loadStats() function will only be called once the ajax call is completed
  let timeOut = setInterval(() => {
    if (response != undefined) {
      setRoster(response);
      clearInterval(timeOut);
    }
  }, 50);
}

// Controls the setting of the three different "teams" in the roster DOM element
// takes Data from the AJAX call to pass to the fillRoster() function;
// adds the event listeners for the three buttons that control the view of the three different teams
// returns Nothing
function setRoster(data) {
  const off = data.athletes[0];
  fillRoster(off, "offense");
  const def = data.athletes[1];
  fillRoster(def, "defense");
  const spe = data.athletes[2];
  fillRoster(spe, "special");
  //Add event listeners for the buttons that will show/hide the different "teams"
  document
    .getElementById("rosterToggles")
    .querySelectorAll("button")
    .forEach((button) => {
      button.addEventListener("click", (e) => {
        document.querySelectorAll("button").forEach((button) => {
          //Enable the buttons
          button.disabled = false;
        });
        //disable the button that was triggered the event
        e.currentTarget.disabled = true;
        // hide the team that is currently shown
        document.getElementsByClassName("active")[0].classList.remove("active");
        //Create the id for the div that will be shown
        target = e.currentTarget.innerText.split(" ")[0].toLowerCase();
        // add the .active class, which will reveal the target div
        document.getElementById(target + "Div").classList.add("active");
      });
    });
  //sort players by position
  document.querySelectorAll("select").forEach((select) => {
    select.addEventListener("change", (e) => {
      const pos = select.options[select.selectedIndex].value;
      let rows = select.parentNode.parentNode
        .querySelector("tbody")
        .querySelectorAll("tr");
      rows.forEach((row) => {
        if (row.classList[0] == pos || pos == "all") {
          row.hidden = false;
        } else {
          row.hidden = true;
        }
      });
    });
  });
}

// Creates <tr> and <td> elements to fill the different "teams" in the roster DOM table
// takes Player data array and the id of the table that is to be filled
// (array, string)
// No return value
function fillRoster(team, tableId) {
  const players = team.items;
  // sort players by jersey Number by default
  players.sort((a, b) => (parseInt(a.jersey) > parseInt(b.jersey) ? 1 : -1));
  // select the appropriate table element based on the string that is passed to the function
  // select the tbody of the selected table
  let table = document.getElementById(tableId).querySelector("tbody");
  // forEach loop of each player in the team array
  players.forEach((player) => {
    const pos = player.position.abbreviation.toLowerCase();
    let row = createElement("tr", pos);
    // The try block prevents a bug that crashes the script when an img's src element does not conform to its address on the ESPN server
    // If this error occurs, a generic "no photo available" img element will be created instead
    try {
      let playerCell = createElement("td");
      let photo = createElement("img", "playerPhoto");
      photo.src = player.headshot.href;
      photo.alt = player.displayName;
      playerCell.appendChild(photo);
      row.appendChild(playerCell);
    } catch {
      let playerCell = createElement("td");
      let photo = createElement("img", "playerPhoto");
      photo.src = "/graphics/no_photo.png";
      photo.alt = player.displayName;
      playerCell.appendChild(photo);
      row.appendChild(playerCell);
    }
    // Player Name
    row.appendChild(createElement("td", undefined, player.displayName));
    // Player position and number
    const playerNum = player.jersey == undefined ? "" : " #" + player.jersey;
    row.appendChild(
      createElement("td", undefined, player.position.displayName + playerNum)
    );
    // player's college
    // not all players have the college prop
    // the try/catch block prevents trying to read a prop that is inexistant
    try {
      row.appendChild(createElement("td", undefined, player.college.name));
    } catch {
      //If a player does not have college data display N/A
      row.appendChild(createElement("td", undefined, "N/A"));
    }

    // append row to table
    table.appendChild(row);
  });
  //end of forEach Loop
}

//Ajax call to get the stats of the team
//Passes data to loadStats()
//NO return value
function getStats() {
  const statsUrl = url + "/statistics";
  const xhttp = new XMLHttpRequest();
  let response;
  xhttp.onload = function () {
    response = JSON.parse(this.responseText);
  };
  xhttp.open("GET", statsUrl, true);
  xhttp.send();
  // The loadStats() function will only be called once the ajax call is completed
  let timeOut = setInterval(() => {
    if (response != undefined) {
      // passes data to the loadStats()Function
      loadStats(response.results.stats.categories);
      clearInterval(timeOut);
    }
  }, 50);
}

// takes stats data array and creates an object that is passed to the setStatRow() function that will load that data into the DOM
// recieves an Array[]
// Returns nothing
function loadStats(data) {
  // The data does not contain a third down %, only a string of the successes-tries
  // the percentage is calculated by splitting the string via the "-" and casting the two resulting values into numbers
  // Numbers are divided, rounded to 2 decimals, and multiplied by 100 in order to get the percentage
  // result is a string, because of the "%" at the end
  const thirdDownPct =
    (
      parseInt(data[3].stats[21].displayValue.split("-")[0]) /
      parseInt(data[3].stats[21].displayValue.split("-")[1])
    ).toFixed(2) *
      100 +
    "%";

  // This object takes selected values from the data in order to easily pass it to the setStatRow function
  const stats = {
    gamesPlayed: data[6].stats[4].value,
    passingTotal: data[0].stats[14].displayValue,
    passingPerGame: data[0].stats[14].perGameDisplayValue,
    giveaways: data[3].stats[18].displayValue,
    takeaways: data[3].stats[17].displayValue,
    thirdDownEff: data[3].stats[21].displayValue,
    thirdDownPct: thirdDownPct,
    rushingTotal: data[1].stats[1].displayValue,
    rushingPerGame: data[1].stats[1].perGameDisplayValue,
    totalPoints: data[10].stats[7].displayValue,
    pointsPerGame: data[10].stats[8].displayValue,
  };
  // Select the stat table from the DOM
  let table = document.getElementById("stats").querySelectorAll("tr");

  //The setStatRow() function is called once for each row, in order to ensure that the data is loaded into the correct row
  // // points
  setStatRow(table[1], stats.totalPoints, stats.pointsPerGame);
  // // passing stats
  setStatRow(table[2], stats.passingTotal, stats.passingPerGame);
  // // rushing stats
  setStatRow(table[3], stats.rushingTotal, stats.rushingPerGame);
  // // third down stats, first as a xx-xx string, then as a percentage
  setStatRow(table[4], stats.thirdDownEff, stats.thirdDownPct);
  // // turnovers, second value is calculated by dividing the total by the number of games played
  setStatRow(
    table[5],
    stats.giveaways,
    (stats.giveaways / stats.gamesPlayed).toFixed(2)
  );
  // // takeaways, second value is calculated by dividing the total by the number of games played
  setStatRow(
    table[6],
    stats.takeaways,
    (stats.takeaways / stats.gamesPlayed).toFixed(2)
  );
}

// Loads the first, and second strings into the correct <td> within the <tr> that is passed
// takes <tr> object, string, string
// returns nothing
function setStatRow(row, first, second) {
  let cells = row.querySelectorAll("td");
  cells[0].innerText = first;
  cells[1].innerText = second;
}

//Ajax call to get the schedule of the team
//Passes data to loadGames()
//NO return value
function getGames() {
  const gameUrl = url + "/schedule";
  const xhttp = new XMLHttpRequest();
  let response;
  xhttp.onload = function () {
    response = JSON.parse(this.responseText);
  };
  xhttp.open("GET", gameUrl, true);
  xhttp.send();
  // The loadGames() function will only be called once the ajax call is completed
  let timeOut = setInterval(() => {
    if (response != undefined) {
      // passes data to the loadgames()Function
      loadGames(response.events);
      clearInterval(timeOut);
    }
  }, 50);
}

function loadGames(data) {
  let finals = data.filter((game) => {
    if (game.competitions[0].status.type.completed) {
      return true;
    } else {
      return false;
    }
  });
  let upcoming = data.filter((game) => {
    if (game.competitions[0].status.type.completed) {
      return false;
    } else {
      return true;
    }
  });

  let showGames = [];

  //if there are three previous games and two upcoming games
  if (finals.length >= 3 && upcoming.length >= 2) {
    for (let n = finals.length - 3; n < finals.length; n++) {
      showGames.push(finals[n]);
    }
    for (let n = 0; n < 2; n++) {
      showGames.push(upcoming[n]);
    }
  }
  // If there are more than 3 upcoming games but less than 2 upcoming games
  else if (finals.length > 3 && upcoming.length < 2) {
    for (let n = data.length; n > data.length - 6; n--) {
      showGames.push(data[n]);
    }
  }
  // If there are less than 3 previous games
  else if (finals.length < 3) {
    for (let n = 0; n < 5; n++) {
      showGames.push(data[n]);
    }
  }

  let rows = document
    .getElementById("recentGames")
    .querySelector("tbody")
    .querySelectorAll("tr");

  for (let n = 0; n < rows.length; n++) {
    let row = rows[n];
    const game = showGames[n];
    const formattedGame = formatGame(game);
    row.querySelector("th").innerHTML = moment(game.date).format("ddd M/D");
    row.querySelectorAll("td")[0].innerHTML = formattedGame.title;

    if (formattedGame.status == "final") {
      row.querySelectorAll("td")[1].innerHTML = formattedGame.win
        ? " W " + formattedGame.score
        : " L " + formattedGame.score;
    } else {
      row.querySelectorAll("td")[1].innerHTML = formattedGame.status;
    }
  }
}

function formatGame(game) {
  let formatGame = {};
  let home;
  const results = game.competitions[0];
  // Format the short title of the game, if the team's slug is after the @ symbol then they are the away team, otherwise they are the home team
  if (game.shortName.split(" @ ")[0] == teamSlug) {
    formatGame.title = "@ " + game.shortName.split(" @ ")[1];
    home = false;
  } else {
    formatGame.title = game.shortName.split(" @ ")[0];
    home = true;
  }

  // if the game is not completed he status will be used as its result, and a score of 0 - 0
  if (results.status.type.completed == false) {
    formatGame.status = results.status.type.description;
    formatGame.score = false;
    formatGame.win = undefined;
  }
  // Otherwise the scoree will be given, as well as whether or not the current team won
  else {
    formatGame.status = "final";
    const teams = results.competitors;
    const score =
      teams[0].score.displayValue + " - " + teams[1].score.displayValue;
    formatGame.score = score;
    if (home) {
      formatGame.win = teams[0].winner;
    } else {
      formatGame.win = teams[1].winner;
    }
  }

  return formatGame;
}
