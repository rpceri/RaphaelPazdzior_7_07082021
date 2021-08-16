// recherche principale de l'input: dans le nom, les ingredients ou la description
// retourne un nouveau tableau de "recipes"
rechercheCroisee = () => {
  //filtre par "name"
  //console.log('rechercheCroisee');
  const rechercheByName = recipes.filter((element) => { // filter pour ne sortir que les name d'element contenant inputSansCarSpeciaux  = chaine recherchée
    return remplaceCarSpeciaux(element.name).includes(inputSansCarSpeciaux); // remplaceCarSpeciaux suppr des accents et autres signes diacritiques génériques
  });
  
  //filtre par "ingrédient"
  // pour chaque element, on va vérifier les ingredients qui matches
  //cela retournee un tableau avec les ingredients qui correspondent, ex si 2 correspondent : Array [ "Lait de coco", "Crème de coco" ]
  // SI PAS DE CORRESPONDANCe pour 1 recette, il y a quand meme un tabelau vide
  const recipesIngredients = recipes.map((element) => {
    const  ingredients  = element.ingredients; // equivalent :  const { ingredients } = element; retourn un tabl d'objet, ex : Object { ingredient: "Vin blanc sec", quantity: 30, unit: "cl" }
    const allIngredient = ingredients.map((el) => el.ingredient); // map() crée un nouveau tableau avec les résultats de l'appel d'une fonction fournie sur chaque élément du tableau appelant.
    return allIngredient.filter((item) => {
      return remplaceCarSpeciaux(item).includes(inputSansCarSpeciaux);
    });
  });
 
  // pour chacun des ingrédients trouvés,on mémorise dans rechercheParIngredient la recette correspondante (retourne un tabelau d'objet des recettes)
 // const tabIndexQuiMatchentTmp = [];
  const rechercheParIngredient = [];
  //const EstRempli = (element) => element.length > 0; // pour vérifier si un élément est renseigné (idem https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex)
  //console.log(recipesIngredients)
  for (const ingredienCourant of recipesIngredients) {
    if (ingredienCourant.length> 0) { // ingredienCourant.findIndex(EstRempli) === 0 findIndex renvoie l'indice du premier élément du tableau qui satisfait une condition donnée par une fonction
      let indiceRecetteAyantIngredient = recipesIngredients.indexOf(ingredienCourant);
      //console.log(indiceRecetteAyantIngredient + ' pour ' + ingredienCourant) //19 pour Lait de coco,Crème de coco  et 26 pour Lait de coco
      //tabIndexQuiMatchentTmp.push(recipesIngredients.indexOf(ingredienCourant)); // ajout dans tabIndexQuiMatchentTmp des indices de chaque recette ayant l'ingrédient
      rechercheParIngredient.push(recipes[indiceRecetteAyantIngredient]);
    }
  }
/*
  const rechercheParIngredient = [];
  for (const i of tabIndexQuiMatchentTmp) {
    rechercheParIngredient.push(recipes[i]);
  }
*/
  //filtre par description, l'appel a rechercheByDescription retourne un tabelau d'objet des recettes
  const rechercheByDescription = recipes.filter((element) => {
    return remplaceCarSpeciaux(element.description).includes(inputSansCarSpeciaux);
  });
  //console.log(rechercheParIngredient)
  let resultatRechercheConcatenee = rechercheByName.concat(rechercheParIngredient, rechercheByDescription); //regroupement des resultats

  //suppr des doublons :
  const resultatRechercheConcateneeGroupees = [...new Set(resultatRechercheConcatenee)];  //L'objet Set (Ensemble en fr) permet de stocker des valeurs uniques, de n'importe quel type, que ce soit des valeurs d'un type primitif ou des objets.
  // nb : Set converti un tableau en ensemble, le fait de mettre .... fait la manip inverse (conversion  de l'ensemble en tableau)
  return resultatRechercheConcatenee.sort();// retourne un tableau d'objet des recettes qui matchent, trié par ordre alpha
} // rechercheCroisee


// affiche les filtres
//arr = tableau d'objet de recettes ou des ingredient dans le cas des ingredients seulement
//type vaut ingredient  ou appliance ou ustensils, name ingredients ou appareils ou ustenciles
GereBlocHtmlUnFiltre = (arr, type, input, name) => {
  //console.log(arr) // tableau d'objet de recettes oud es ingredient dans le cas des ingredient seulement
  var tabElements = arr.flatMap((element) => element[type]); // permet d'appliquer une fonction à chaque élément du tableau puis d'aplatir le résultat en un tableau
  //console.log(tabElements) // tableau d'objet de recettes
  tabElements.sort();
  // console.log(tabElements) // retour un tableau des elements, ex : [ "Cuillère en bois", "Fouet", "Saladier", "Moule à gateaux", "Fouet", "Casserolle", "Cuillère"] AVEC DOUBLONS
  //console.log('GereBlocHtmlUnFiltre pour type : ' + type + ' input : ' + input + 'name : ' + name) // 'arr : ' + arr + 
  if (input !== '') { // si quelque chose a été saisi dans le filtre de la liste courante
    const tabElementsFiltered = tabElements.filter((element) => {
      //console.log(remplaceCarSpeciaux(element).includes(input))
      return remplaceCarSpeciaux(element).includes(input); //true ou false
    });
    const GereBlocHtelementrechercheResultSansDoublon = SupprDoublonDunArray(tabElementsFiltered);
    const LeResultat = GereBlocHtelementrechercheResultSansDoublon.map((element) => `<li class='recherche__filtre__list__item ${name}'>${element}</li>` ).join('');
    const listElement = document.querySelector(`.recherche__filtre__list.${name}`);
    if (LeResultat.length > 0) listElement.innerHTML = LeResultat;
    else listElement.innerHTML = `<li class="recherche__filtre__list__item__erreur ${name}">Pas de résultats</li>`;
  } // si une entré de la liste a été selectionnée
  else {
    //tabElements = tabElements.map((element) => remplaceCarSpeciaux(element)); // pour éviter d'avoir des roblème de doublona vec la crme fraiche par exemple remplaceCarSpeciaux
    //tabElements = tabElements.map((element) => element.toLowerCase()); // idèm ci dessus moins invasif, inutile, totuest géré dans SupprDoublonDunArray
    const GereBlocHtelementrechercheResultSansDoublon = SupprDoublonDunArray(tabElements); // retourne un tabelau avec occurence unique :[ "Bol", "Casserolle", "Cocotte minute", "Couteau",
    //console.log(GereBlocHtelementrechercheResultSansDoublon)
    
    const LeResultat = GereBlocHtelementrechercheResultSansDoublon.map((element) => `<li class='recherche__filtre__list__item ${name}'>${element}</li>`).join('');
    let cible = `.recherche__filtre__list.${name}`;
    const listElement = document.querySelector(cible);
    listElement.innerHTML = LeResultat;
    //console.log(cible + ' :' + LeResultat)
  }
} // GereBlocHtmlUnFiltre