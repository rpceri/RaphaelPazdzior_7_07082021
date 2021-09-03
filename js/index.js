  retourneBlocHtmlConteneurFiltre = (string) => {
    //console.log('retourneBlocHtmlConteneurFiltre')
    return `
    <div class=conteneur-filtre-${string}>
      <div class="recherche__filtre__element ${string}">
          <span class="recherche__filtre__label" id="currentFilter">${string}</span>
          <input id="${string}Input" type="text" class="recherche__filtre__input ${string}" placeholder="${string}" />
          <div class="bt-affiche-ou-masque"></div>
      </div>
      <ul id="list${string}" class="recherche__filtre__list ${string}"></ul>
    </div>`;
  }

  // utilisée par retourneBalisesArticlesContenantRecettesTriees et recherche.inc
   // suppr des accents et autres signes diacritiques génériques (https://fr.wikipedia.org/wiki/Table_des_caract%C3%A8res_Unicode/U0300)
  remplaceCarSpeciaux = (str) => {
    if(str.length > 0) {
      let modif = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(); // normalize renvoye la forme normalisée Unicode d'une chaîne de caractères, NFD : Normalization Form Canonical Decomposition.
      //if(modif != str) console.log(modif + ' : ' + str)
      // toLowerCase utile, verif faite
      return modif;
    } else return '';
  }

  // uitlisée par recherche.inc
  // on va faire un tableau d'ingrédient idem a l'original, auquel on normalise les entrées pour les comparer,
  // si on trouve ensuite des termes semblables, on mémorise les indices pour pouvoir ensuite les supprimer du tableau original avant de le retourner
  SupprDoublonDunArray = (array) => {
    const arrayNormalise =  array.map((element) => remplaceCarSpeciaux(element));
    let tabIndicesASuppr = [];
    
    for (const posIndex in arrayNormalise) {
      for (const posIndex2 in arrayNormalise) { // seconde boucle qui permet de comparer l'élément courant avec tout les suivants
        // verifie si l'élément courant du 1er tableau n'a pas déjà été traité (auquel cas il est vide), auqel cas on vérifie si l'element courant du 2d tabelau n'est pas sembllable, à partir de l'indice au dessus
        if(arrayNormalise[posIndex] != '' && posIndex2 > posIndex &&  arrayNormalise[posIndex] ==  arrayNormalise[posIndex2]) {
          //console.log(`${arrayNormalise[posIndex]} premier occ @ ${posIndex} trouvé @ ${posIndex2}`);
          tabIndicesASuppr.push(posIndex2);
          arrayNormalise[posIndex2] = ''; // pour que la première boucle n'y repasse pas dessus inutilement
        }
      }
    }
    // on construit le taeblau final a partir de l'original, en écartant les éléments dont les index ont été retenus car en doublon
    let tabFinal = []
    for (const posIndex3 in array) {
      if (tabIndicesASuppr.indexOf(posIndex3) === -1) tabFinal.push(array[posIndex3]);
    }

    return tabFinal;
  }
  
  abregUnits = (str) => {
    return str.replace('grammes', 'gr');
  }

  // trie des recettes par ordre alpha et retourne autant de balise <article que nécessaire
  retourneBalisesArticlesContenantRecettesTriees = (array) => {    
    const arraySorted = array.sort(function (a, b) {
      let aname = remplaceCarSpeciaux(a.name); // suppr des accents et autres signes diacritiques génériques 
      let bname = remplaceCarSpeciaux(b.name); // suppr des accents et autres signes diacritiques génériques 
      if (aname > bname) return 1;
      if (aname < bname) return -1;
      return 0;
    });

    const recipeResult = arraySorted.map((element) => {
        const name = element.name;
        const time = element.time;
        const intstruction = element.description;

        const ingredients = element.ingredients.map((elIngred) => {
            const ingredient = elIngred.ingredient;
            const quantity = elIngred.quantity;
            const unit = elIngred.unit; // optionnel

            // return un ingredient avec ces quantités/unites dans un <p>
            if(quantity != undefined && unit != undefined)  return`<p><b>${ingredient}:</b> ${quantity} ${abregUnits(unit)}</p>` // grammes sera converti engr
            else if(quantity != undefined) return `<p><b>${ingredient}:</b> ${quantity}</p>`;
            else return `<p><b>${ingredient}</b></p>`;
            
          })
          .join('');
        return `<article class="fiche-recette">
                  <div class="fiche-recette__image"></div>
                  <div class="fiche-recette__info">
  
                    <div class="fiche-recette__info__first-element">
                      <h2 class="fiche-recette__info__first-element__nom-recette">${name}</h2>
                      <span class="fiche-recette__info__first-element__temps"><i class="far fa-clock"></i> ${time} minutes</span>
                    </div>
  
                    <div class="fiche-recette__info__second-element">
                      <div class="fiche-recette__info__second-element__ingredients">${ingredients}</div>
                      <p class="fiche-recette__info__second-element__instructions">${intstruction}</p>
                    </div>  
                  </div>
                </article>`;
    }).join('')
    return recipeResult;
  } // retourneBalisesArticlesContenantRecettesTriees



  //window.onload = function () { // desactive pour le moment prose problème ordonnancement sinon
  //modification du contenu des objets présents dans recipes.js :
  recipes.map((element) => {
      // création d'une propriété supplémentaire dans chaque element de recipes pour avoir les name normalisé (sasna ccent ni maj)
      let nameNormalise = remplaceCarSpeciaux(element.name);
      element.nameNormalise =  nameNormalise;    
    
    // première lettre des ustensils en maj, pour homogénéhiser, impacte visuel seulement
    for (let i = 0; i < element.ustensils.length; i++) {
      let modif = element.ustensils[i].charAt(0).toUpperCase() + element.ustensils[i].slice(1);
      element.ustensils[i] =  modif;    
    }
  });
  //console.log(recipes) //tableau contenant un objet par recette = contenue de recpies.js

  // affichage des filtres de recherche
  const rechercheFilter = document.querySelector('.recherche__filtre'); // bloc contenant tous les filtres
  rechercheFilter.insertAdjacentHTML('beforeend', retourneBlocHtmlConteneurFiltre('ingredients')); //beforeend : Juste à l'intérieur de l'element , après son dernier enfant,  afterbegin aurait pu fctionner aussi
  rechercheFilter.insertAdjacentHTML('beforeend', retourneBlocHtmlConteneurFiltre('appareils'));
  rechercheFilter.insertAdjacentHTML('beforeend', retourneBlocHtmlConteneurFiltre('ustenciles'));

  // affichage des recettes
  const resultatSection = document.querySelector('.resultat'); // sert plus en dessous de ce script
  resultatSection.innerHTML = retourneBalisesArticlesContenantRecettesTriees(recipes); // trie des recettes par ordre alpha et retourne autant de balise <article que nécessaire



  const rechercheInput = document.querySelector('#rechercheInput');
 
  const tagSection = document.querySelector('.recherche__tags__ingredients');
  const listIngredient = document.querySelector('.recherche__filtre__list.ingredients');
  const listAppliance = document.querySelector('.recherche__filtre__list.appareils');
  const listUstenciles = document.querySelector('.recherche__filtre__list.ustenciles');
  
  var ingredientTagsArray = []; // tableaux qui contiendront tous les tags choisis
  var applianceTagsArray = [];
  var ustensilTagsArray = [];
  var inputSansCarSpeciaux = '';
  var globalrecherche = recipes; // tableau de "recipes" issue de filtre (rechercheCroisee, rechercheIngredient), contient toutes les recettes matchant les filtres (= tout au premier chargement)
  var globalIngredient = ''; // contendra tout les ingredients possibles : tableau d'objet, 1 objet contient les propriétés ingredient, quantity et unit
  var globalAppliance = ''; //contiendra tout les objets possibles avec id name, servings etc et donc appliance
  var globalUstensil = '';//contiendra tout les objets possibles avec id name, servings etc et donc ustensils
  // on inhibe la saisie de la touche entrée
  rechercheInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') e.preventDefault();
  });

  // écouteur saisie sur la zone de saisie
  rechercheInput.addEventListener('input', (e) => { //keypress ne suffit pas car ca ne se déclecnhe pas lors de l'appui sur la touche suppr
    const input = e.target.value;
    inputSansCarSpeciaux = remplaceCarSpeciaux(input); // suppr des accents et autres signes diacritiques génériques 
    tagSection.innerHTML = '';
    ingredientTagsArray = []; // tableaux qui contiendront tous les tags choisis
    applianceTagsArray = [];
    ustensilTagsArray = [];
  
    if (inputSansCarSpeciaux.length > 2) { // on verifie si plus de 2 lettres ont été saisies
      globalrecherche = rechercheCroisee(); // lancement fct qui effectue la recherche
      if (globalrecherche.length < 1) { // si aucun resultat
        resultatSection.innerHTML = `<p class='erreur-resultat'>Aucune recette ne correspond à votre critère... vous pouvez chercher « tarte aux pommes », « poisson », etc. .</p>`;
        listIngredient.innerHTML =  listAppliance.innerHTML = listUstenciles.innerHTML = ''; // rien ne doit être porposé dans les filtres
      } else {
        resultatSection.innerHTML = retourneBalisesArticlesContenantRecettesTriees(globalrecherche); // trie des recettes par ordre alpha et retourne autant de balise <article que nécessaire
        globalIngredient = globalrecherche.flatMap((element) => element.ingredients);
        GereBlocHtmlUnFiltre(globalIngredient, 'ingredient', '', 'ingredients'); // affiche les filtres
  
        globalAppliance = globalrecherche;
        GereBlocHtmlUnFiltre(globalAppliance, 'appliance', '', 'appareils');
  
        globalUstensil = globalrecherche;
        GereBlocHtmlUnFiltre(globalUstensil, 'ustensils', '', 'ustenciles');
      }
    } else { // si moins de 3 lettres saisies....
      resultatSection.innerHTML = retourneBalisesArticlesContenantRecettesTriees(recipes); // trie des recettes par ordre alpha et retourne autant de balise <article que nécessaire
      listIngredient.innerHTML =  listAppliance.innerHTML = listUstenciles.innerHTML = ''; // rien ne doit être porposé dans les filtres
    }
  });
  // au chargement de la page, on rempli les 3 filtres avec toutes les occurences possibles :
  GereBlocHtmlUnFiltre(globalrecherche.flatMap((element) => element.ingredients), 'ingredient', '', 'ingredients'); // permet d'appliquer une fonction à chaque élément du tableau puis d'aplatir le résultat en un tableau
  GereBlocHtmlUnFiltre(globalrecherche, 'appliance', '', 'appareils');
  GereBlocHtmlUnFiltre(globalrecherche, 'ustensils', '', 'ustenciles');
//}