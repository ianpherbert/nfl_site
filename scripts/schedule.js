getGames();

// Add event listener to the select that changes the week number
document.querySelector("select").addEventListener("input", (e) => {
  let select = document.querySelector("select");
  const pos = select.options[select.selectedIndex].value.split("/");
  // the value of each option is {seasonType}/{weekNumber}
  // Therefore after splitting the value we get the season type as [0] and week as [1]
  const seasonType = parseInt(pos[0]);
  const weekNumber = parseInt(pos[1]);

  //   pass seasonType and weekNumber to the getGames function
  getGames(seasonType, weekNumber);
});

function formatWeek(seasonType, weekNumber) {
  let weekRead;
  switch (seasonType) {
    case 1:
      weekRead = "Preseason Week #" + weekNumber;
      break;
    case 2:
      weekRead = "Regular Season Week #" + weekNumber;
      break;
    case 3:
      switch (weekNumber) {
        case 1:
          weekRead = "Wild Card Round";
          break;
        case 2:
          weekRead = "Divisional Round";
          break;
        case 3:
          weekRead = "Conference Championships";
          break;
        case 4:
          weekRead = "Super Bowl";
          break;
      }
      break;
  }
  document.getElementById("weekNum").innerText = weekRead;
}

//Ajax call to the server to retrieve the games for the week specified
// takes either number or string(as long as the string only contains numbers)
function getGames(seasonType, weekNumber) {
  //remove previous games and display loading message
  document.getElementById("schedule").innerHTML = loading();
  let url = baseURL + "scoreboard?";
  if (weekNumber != undefined && seasonType != undefined) {
    url += "seasontype=" + seasonType + "&week=" + weekNumber;
  }

  const xhttp = new XMLHttpRequest();
  let response;
  xhttp.onload = function () {
    response = JSON.parse(this.responseText);
  };
  xhttp.open("GET", url, true);
  xhttp.send();

  let timeOut = setInterval(() => {
    if (response != undefined) {
      formatWeek(response.season.type, response.week.number);
      document.getElementById("weekN").value =
        response.season.type + "/" + response.week.number;
      loadGames(response.events);
      clearInterval(timeOut);
    }
  }, 50);
}

function loadGames(games) {
  const url = "team.html?";

  let list = document.getElementById("schedule");
  list.innerHTML = "";
  games.forEach((game) => {
    const hTeamName = game.competitions[0].competitors[0].team.shortDisplayName;
    const hTeamScore = game.competitions[0].competitors[0].score;
    const hTeamUrl =
      url +
      "team=" +
      game.competitions[0].competitors[0].id +
      "&name=" +
      game.competitions[0].competitors[0].team.abbreviation;
    const vTeamName = game.competitions[0].competitors[1].team.shortDisplayName;
    const vTeamScore = game.competitions[0].competitors[1].score;
    const vTeamUrl =
      url +
      "team=" +
      game.competitions[0].competitors[1].id +
      "&name=" +
      game.competitions[0].competitors[1].team.abbreviation;
    let li = createElement("li");
    let div = createElement("div", "game");

    let awayDiv = createElement("div");
    let awayLogo = createElement("img");
    if (vTeamName == "TBD") {
      awayLogo.src = "/graphics/nfl_logo.png";
      awayLogo.alt = game.competitions[0].competitors[1].team.shortDisplayName;
    } else {
      awayLogo.src = game.competitions[0].competitors[1].team.logo;
      awayLogo.alt = game.competitions[0].competitors[1].team.shortDisplayName;
    }
    awayDiv.appendChild(awayLogo);
    let awayLink = createElement("a", undefined, vTeamName);
    awayLink.href = vTeamUrl;
    awayDiv.appendChild(awayLink);
    awayDiv.appendChild(createElement("p", undefined, vTeamScore));
    div.appendChild(awayDiv);

    let atDiv = createElement("div");
    atDiv.appendChild(createElement("p", undefined, "@"));
    div.appendChild(atDiv);

    let homeDiv = createElement("div");
    let homeLogo = createElement("img");
    if (hTeamName == "TBD") {
      homeLogo.src = "/graphics/nfl_logo.png";
      homeLogo.alt = game.competitions[0].competitors[0].team.shortDisplayName;
    } else {
      homeLogo.src = game.competitions[0].competitors[0].team.logo;
      homeLogo.alt = game.competitions[0].competitors[0].team.shortDisplayName;
    }

    homeDiv.appendChild(homeLogo);
    let homeLink = createElement("a", undefined, hTeamName);
    homeLink.href = hTeamUrl;
    homeDiv.appendChild(homeLink);
    homeDiv.appendChild(createElement("p", undefined, hTeamScore));
    div.appendChild(homeDiv);

    let statusDiv = createElement("div");
    const status = game.status.type.completed
      ? game.status.type.detail
      : moment(game.date).format("M/D");
    statusDiv.appendChild(createElement("span", undefined, status));
    div.appendChild(statusDiv);
    li.appendChild(div);
    list.appendChild(li);
  });
}
