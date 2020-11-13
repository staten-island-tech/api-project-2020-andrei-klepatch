const DOMSelectors = {
  display: document.querySelector(".Display"),
  generateButton: document.querySelector(".generate-btn"),
};

const key = "4659533f-c4cf-4f80-a136-2b5ac16ef280";
const query = `https://api.thecatapi.com/v1/images/search?api_key=${key}`;
async function getImage() {
  try {
    const response = await fetch(query);
    const data = await response.json();
    DOMSelectors.display.innerHTML = "";
    DOMSelectors.display.insertAdjacentHTML(
      "afterbegin",
      `<h1 class="item-image"><img class="item-image"src="${data[0]["url"]}"alt=""/></h1>`
    );
  } catch (error) {
    console.log(error);
  }
}
async function init() {
  DOMSelectors.generateButton.addEventListener("click", function (e) {
    getImage();
  });
}

init();
