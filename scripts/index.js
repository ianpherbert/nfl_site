getNews();
getScores();
//Ajax call to Get the News from the ESPN Server
// Takes no parameters
// Returns nothing
function getNews() {
  // Url to get the news from the ESPN Server
  const newsUrl = baseURL + "news";

  const xhttp = new XMLHttpRequest();
  let response;
  xhttp.onload = function () {
    response = JSON.parse(this.responseText);
    //passes only the first article object to the featured DOM object
    domFeatured(response.articles[0]);
    // passes all articles to the domNews function
    domNews(response.articles);
  };
  xhttp.open("GET", newsUrl, true);
  xhttp.send();
}

//Loads the top story into the news section of the DOM
// takes js object as a parameter
// returns nothing
function domFeatured(featured) {
  let graphic = document.getElementById("featuredGraphic");
  graphic.src = featured.images[0].url;
  graphic.alt = featured.images[0].name;
  document.getElementById("featuredHeadline").textContent = featured.headline;
  document.getElementById("featuredByline").textContent = featured.description;
  document.getElementById("featuredLink").href = featured.links.web.href;
}

//Loads all stories into the more news section of the DOM
// takes js object as a parameter
// returns nothing
function domNews(data) {
  let newsList = document.getElementById("moreNews");
  data.forEach((item) => {
    let newsItem = createElement("li");
    let newsLink = createElement("a", undefined, item.headline);
    newsLink.href = item.links.web.href;
    newsItem.appendChild(newsLink);
    newsList.appendChild(newsItem);
  });
}

function getScores() {
  // Url to get the news from the ESPN Server
  const newsUrl = baseURL + "scoreboard";

  const xhttp = new XMLHttpRequest();
  let response;
  xhttp.onload = function () {
    response = JSON.parse(this.responseText);
    loadScoreboard(response.events);
  };
  xhttp.open("GET", newsUrl, true);
  xhttp.send();
}

function loadScoreboard(data) {
  //DOM <ul> element that will contain the games that will be loaded through the following for loop:
  let gameList = document.getElementsByClassName("schedule")[0];
  // Only display 5 of the most recent games, reverse for loop through them
  const max = data.length - 1;
  const min = data.length - 6;
  for (let n = max; n > min; n--) {
    const game = data[n];
    let li = createElement("li");
    let div = createElement("div", "game");
    li.appendChild(div);
    game.competitions[0].competitors.forEach((team) => {
      let teamDiv = createElement("div");
      let name = createElement("p", undefined, team.team.shortDisplayName);
      let score = createElement("p", undefined, team.score);
      teamDiv.appendChild(name);
      teamDiv.appendChild(score);
      div.append(teamDiv);
    });
    //Clock displays "Final" if the game is completed, the date of the game if it is upcoming, displays clock and quarter if the game is currently being played
    let clock =
      game.status.type.completed == true
        ? "Final"
        : game.status.state === "pre"
        ? moment(game.date).format("ddd")
        : game.status.displayClock + " " + game.status.period;
    let clockDiv = createElement("div");
    clockDiv.appendChild(createElement("span", undefined, clock));
    div.appendChild(clockDiv);
    gameList.appendChild(li);
  }
}
