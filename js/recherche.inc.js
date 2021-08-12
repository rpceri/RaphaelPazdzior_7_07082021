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
  return resultatRechercheConcateneeGroupees.sort();// retourne un tableau d'objet des recettes qui matchent, trié par ordre alpha
} // rechercheCroisee


