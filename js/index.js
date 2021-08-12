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




  //modification du contenu des objets présents dans recipes.js :
  // première lettre des ustensils en maj
  recipes.map((element) => {
    for (let i = 0; i < element.ustensils.length; i++) {
      let modif = element.ustensils[i].charAt(0).toUpperCase() + element.ustensils[i].slice(1);
      element.ustensils[i] =  modif;    
    }
  });
  //console.log(recipes) //tableau contenant un objet par recette = contenue de recpies.js



  // affichage des recettes
  const resultatSection = document.querySelector('.resultat'); // sert plus en dessous de ce script
  resultatSection.innerHTML = retourneBalisesArticlesContenantRecettesTriees(recipes); // trie des recettes par ordre alpha et retourne autant de balise <article que nécessaire



  const rechercheInput = document.querySelector('#rechercheInput');

  
  var inputSansCarSpeciaux = '';

  // on inhibe la saisie de la touche entrée
  rechercheInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') e.preventDefault();
  });

  // écouteur saisie sur la zone de saisie
  rechercheInput.addEventListener('input', (e) => { //keypress ne suffit pas car ca ne se déclecnhe pas lors de l'appui sur la touche suppr
    const input = e.target.value;
    inputSansCarSpeciaux = remplaceCarSpeciaux(input); // suppr des accents et autres signes diacritiques génériques 


  
    if (inputSansCarSpeciaux.length > 2) { // on verifie si plus de 2 lettres ont été saisies
      globalrecherche = rechercheCroisee(); // lancement fct qui effectue la recherche
      if (globalrecherche.length < 1) { // si aucun resultat
        resultatSection.innerHTML = `<p class='erreur-resultat'>Aucune recette ne correspond à votre critère... vous pouvez chercher « tarte aux pommes », « poisson », etc. .</p>`;

      } else {
        resultatSection.innerHTML = retourneBalisesArticlesContenantRecettesTriees(globalrecherche); // trie des recettes par ordre alpha et retourne autant de balise <article que nécessaire
      }
    } else { // si moins de 3 lettres saisies....
      resultatSection.innerHTML = retourneBalisesArticlesContenantRecettesTriees(recipes); // trie des recettes par ordre alpha et retourne autant de balise <article que nécessaire
    }
  });
