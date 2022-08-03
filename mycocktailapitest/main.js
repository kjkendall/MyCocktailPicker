/* this block of code displays drink options matching the value in 
   the search field and hides the options that does not match     
*/
const searchInput = document.querySelector("[data-search]");

let drinks = [];

searchInput.addEventListener("input", e => {
  const value = e.target.value.toLowerCase();
  if (value !== drinks) {
    drinkCardContainer.textContent = `No drinks found for ${value}`;
  };
  drinkCardContainer.classList.toggle("hide", false);
  drinks.forEach( drink => {
    const isVisible = drink.drinkOptions.toLowerCase().includes(value);
    drink.element.classList.toggle("hide", !isVisible);
  });
  debounceFetch (); 
});

//this block of code sets a time out before executing the getFetch
let timeOut;

function debounceFetch () {
  clearTimeout(timeOut);  
  timeOut = setTimeout (getFetch, 1000);
};

/* this function initializes the extraction of data from the API
   which then maps said data and return an object to 'drinks' variable */
function getFetch () {
  const choice = document.querySelector("input").value;
  const url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${choice}`;
  
  const drinkCardTemplate = document.querySelector("[data-drink-template]");
  
  fetch (url)
    .then (res => res.json())
    .then (data => {
      if (data) {
        while (drinkCardContainer.firstChild) {   
          drinkCardContainer.firstChild.remove();
        };
        const drinkVariety = data.drinks;
        drinks = drinkVariety.map (key => {
          const drinkOptions = key.strDrink;
          const card = drinkCardTemplate.content.cloneNode(true).children[0];
          const dataDrinkName = card.querySelector("[data-drink-name]");
          dataDrinkName.textContent = drinkOptions;
          drinkCardContainer.append(card);
          return {drinkOptions, element: card, drinkVariety};
        });
      }
    })
    .catch (err => {
      console.log (`error ${err}`)
    });
};

/* this block of code shows the text of the selected card in 
   the search field and then hides the rest of the cards 
*/
let option;

const drinkCardContainer = document.querySelector("[data-drink-cards-container]");
drinkCardContainer.addEventListener ('click', (event) => {
  option = event.target.innerText;
  searchInput.value = option;
  drinkCardContainer.classList.toggle("hide")
});

/* the following block of code does these tasks: 
1 clears the input field
2 inserts the result or drink name to designated 'name' section in HTML (done)
3 inserts the image of drink in the img 'src'  section in HTML (done)
4 inserts the instructions in the 'instructions' section in HTML (done)
5 inserts the recipe in the 'ingredients' section in HTML   (done)
*/

const button = document.querySelector('button');
button.addEventListener ('click', () => {
  // TASK 1: clear input field
  searchInput.value = "";   
  getValues (); 
});

function getValues () {
  for (let key in drinks) {
    drinkVarietyObject = drinks[key].drinkVariety[key];
    drinkName = drinkVarietyObject.strDrink; 
    drinkImage = drinkVarietyObject.strDrinkThumb;
    drinkInstructions = drinkVarietyObject.strInstructions;
    checkValues ();  
  };
};

function checkValues () {
  if (option === drinkName) {
    // TASK 2: get name
    const title = document.getElementById('name');
    title.innerText = option; 
    const image = document.getElementById('image');
      image.src = drinkImage;
      screenChange(screen);
    // TASK 4: get instructions
    const instructions = document.getElementById('instructions');
    instructions.innerText = drinkInstructions;
    // TASK 5: get recipe
    getRecipe ();
  };
};

function getRecipe () {
  const selectedKeys = Object.keys (drinkVarietyObject) 
                             .filter (key => key.includes("strIngredient") || 
                                             key.includes("strMeasure"));

  const ingredients = document.getElementById('ingredients');
  while (ingredients.lastChild) {
    ingredients.removeChild(ingredients.lastChild);
  };

  let drinkMeasure = []; 
  let drinkIngredient = []; 

  selectedKeys.map (key => {
    if (drinkVarietyObject[key] !== null && key.includes("strMeasure")) {
      measureList = drinkVarietyObject[key];
      drinkMeasure.push(measureList)
    } else if (drinkVarietyObject[key] !== null && key.includes("strIngredient")) {
      ingredientList = drinkVarietyObject[key];
      drinkIngredient.push(ingredientList)
    }
  });

  const recipeContainer = document.createElement('ul');
  const recipeElements = drinkIngredient.forEach ((ingredient, index) => {
        const lists = document.createElement('li');
              lists.textContent = `${drinkMeasure[index] || ' ' } ${ drinkIngredient[index]}`;
               recipeContainer.appendChild(lists);
  });

  ingredients.appendChild(recipeContainer);

};
// The following block of code will make the page responsive //    

const screen = window.matchMedia("(max-width: 400px)");
screen.addEventListener('change', screenChange);//

const mediaQuery = document.querySelector('[data-media-query]');

function screenChange (x) {
  if (x.matches || window.innerWidth < 400) {
    for (let key in drinks) {
      drinkVarietyObject = drinks[key].drinkVariety[key];
      drinkName = drinkVarietyObject.strDrink;
      drinkImageX = drinkVarietyObject.strDrinkThumb;
      if (option === drinkName) {
        drinkImage = drinkImageX;
        mediaQuery.style.backgroundImage = `url(${drinkImageX})`;
      };
    };
  } else {
    mediaQuery.style.background = ``;
  };
};