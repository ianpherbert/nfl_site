const baseURL = "https://site.api.espn.com/apis/site/v2/sports/football/nfl/";

function createElement(type, className, textContent) {
  if (type == undefined) {
    type = "p";
  }
  if (textContent == undefined) {
    textContent = "";
  }

  let element = document.createElement(type);
  //check if the className is an array, a string, or undefined
  if (className != undefined) {
    if (typeof className == "object") {
      className.forEach((classN) => {
        element.classList.add(classN);
      });
    } else {
      element.classList.add(className);
    }
  }
  //check if there is text to add
  if (textContent != undefined) {
    element.textContent = textContent;
  }
  return element;
}

function loading() {
  return "<div class='loading'><p>Loading</p><span></span></div>";
}
