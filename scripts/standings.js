const url = baseURL + "teams?limit=32";
const xhttp = new XMLHttpRequest();
let response;
xhttp.onload = function () {
  response = JSON.parse(this.responseText);
};
xhttp.open("GET", url, true);
xhttp.send();

let timeOut = setInterval(() => {
  if (response != undefined) {
    const data = response.sports[0].leagues[0].teams;

    const teams = setTeams(data);

    setdivisions(teams.divisional);
    setConferences(teams.conference);

    clearInterval(timeOut);
  }
}, 50);

function setTeams(data) {
  let teams = {
    an: [],
    ae: [],
    as: [],
    aw: [],
    nn: [],
    ne: [],
    ns: [],
    nw: [],
  };

  const divisions = {
    ARI: "nw",
    ATL: "ns",
    BUF: "ae",
    CHI: "nn",
    CIN: "an",
    CLE: "an",
    DAL: "ne",
    DEN: "aw",
    DET: "nn",
    GB: "nn",
    IND: "as",
    KC: "aw",
    LV: "aw",
    LAC: "aw",
    LAR: "nw",
    MIA: "ae",
    MIN: "nn",
    NE: "ae",
    NO: "ns",
    NYG: "ne",
    NYJ: "ae",
    PHI: "ne",
    PIT: "an",
    SF: "nw",
    TEN: "as",
    BAL: "an",
    CAR: "ns",
    HOU: "as",
    JAX: "as",
    SEA: "nw",
    TB: "ns",
    WSH: "ne",
  };

  const conferences = {
    nfc: [],
    afc: [],
  };

  data.forEach((teamData) => {
    const team = teamData.team;
    teamObject = {
      name: team.shortDisplayName,
      abbreviation: team.abbreviation,
      id: team.id,
      record:
        team.record.items[0].stats[1].value +
        "-" +
        team.record.items[0].stats[2].value +
        "-" +
        team.record.items[0].stats[5].value,
      seed: team.record.items[0].stats[0].value,
      winPct: team.record.items[0].stats[3].value,
      divWinPct: team.record.items[0].stats[16].value,
    };

    teams[divisions[team.abbreviation]].push(teamObject);

    if (divisions[team.abbreviation][0] == "n") {
      conferences.nfc.push(teamObject);
    } else {
      conferences.afc.push(teamObject);
    }
  });

  for (key in teams) {
    teams[key].sort((a, b) => (a.seed > b.seed ? 1 : -1));
  }

  for (key in conferences) {
    conferences[key].sort((a, b) => (a.seed > b.seed ? 1 : -1));
  }
  return { divisional: teams, conference: conferences };
}

function setConferences(teams) {
  let afcTable = document.getElementById("afcConf").querySelectorAll("tr");
  const afc = teams.afc;
  setConferenceTable(afcTable, afc);
  let nfcTable = document.getElementById("nfcConf").querySelectorAll("tr");
  const nfc = teams.nfc;
  setConferenceTable(nfcTable, nfc);
}

function setConferenceTable(table, teams) {
  for (let n = 0; n < 16; n++) {
    let row = table[n + 1].childNodes;
    row[1].textContent = teams[n].name;
    row[3].textContent = teams[n].record;
    row[5].textContent = teams[n].seed;
  }
}

function setdivisions(teams) {
  for (key in teams) {
    let division = document
      .getElementById(key)
      .querySelector("tbody")
      .querySelectorAll("tr");
    const teamsArray = teams[key];

    for (let n = 0; n < 4; n++) {
      let row = division[n].querySelectorAll("td");
      let team = teamsArray[n];

      let link = createElement("a", undefined, team.name);

      link.href = "team.html?team=" + team.id + "&name=" + team.abbreviation;

      row[0].appendChild(link);
      row[1].textContent = team.record;
      row[2].textContent = Math.round(team.winPct * 100) + "%";
      row[3].textContent = Math.round(team.divWinPct * 100) + "%";
    }
  }
}
