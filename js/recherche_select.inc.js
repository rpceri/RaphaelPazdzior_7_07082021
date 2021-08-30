////////pour que les selects se ferment dès que besoin modif RP ok
CacherFiltres = () => {
    console.log('CacherFiltres pour que les select se ferment dès que besoin')
  
    tabListSelect.forEach(function(i) {
      let conteneurFiltre = document.querySelector('.conteneur-filtre-' + i);
      if (conteneurFiltre !== null) {
        document.addEventListener('click', function (event) {
          if (!conteneurFiltre.contains(event.target)) {
            conteneurFiltre.classList.remove('larger');
            let rechercheFilterElement = document.querySelector('.recherche__filtre__element.' + i);
            rechercheFilterElement.classList.remove('visible');
          }
        });
      }
    })
  }
  
  // ecouteur permettant d'attraper les selections effectuées depuis les filtres
  //MutationObserver fournit un moyen d’intercepter les changements dans le DOM  
  const observerFiltres = new MutationObserver(() => {
    console.log('MutationObserver sur les filtres')
    majDesFiltres(); // affiche les éléments dans les filtres
  })
  
  // affiche les éléments dans les filtres
  majDesFiltres = () => {
    console.log('majDesFiltres')
    var tags = document.querySelectorAll(`.recherche__filtre__list__item.ingredients`);

    var tags = document.querySelectorAll(`.recherche__filtre__list__item.appareils`);
    for (const item of tags) {
      item.addEventListener('click', () => {
        applianceTagsArray.push(item.innerText); // tableau qui contiendra tous les tags choisis, defini dans index.js
        applianceTagsArray = SupprDoublonDunArray(applianceTagsArray);
  
        document.querySelector('.recherche__tags__appareils').innerHTML = applianceTagsArray.map((element) => {
          return `<span class='recherche__tags__item appareils'>${element}<i id="ferme" class="far fa-times-circle"></i></span>`;
        }).join('');
  
        const tagInput = remplaceCarSpeciaux(item.innerText);
        globalrecherche = rechercheAppliance(globalrecherche, tagInput);  
        resultatSection.innerHTML = retourneBalisesArticlesContenantRecettesTriees(globalrecherche); // trie des recettes par ordre alpha et retourne autant de balise <article que nécessaire
        
        for (let i of applianceTagsArray) { // tabelau qui contiendra tous les tags choisis, defini dans index.js
          globalAppliance = globalrecherche.filter((element) => element.appliance !== i);
        }
        GereBlocHtmlUnFiltre(globalAppliance, 'appliance', '', 'appareils');
        
        let ustensil = globalrecherche.flatMap((element) => element.ustensils);
        for (let i of ustensilTagsArray) {
          ustensil = ustensil.filter((element) => element !== i);
        }
        globalUstensil = [{ ustensils: ustensil }]
        GereBlocHtmlUnFiltre(globalUstensil, 'ustensils', '', 'ustenciles');
  
        globalIngredient = globalrecherche.flatMap((element) => element.ingredients);
        for (let i of ingredientTagsArray) {
          globalIngredient = globalIngredient.filter((element) => element.ingredient !== i);
        }
        GereBlocHtmlUnFiltre(globalIngredient, 'ingredient', '', 'ingredients');
    });
    }
    //**
    var tags = document.querySelectorAll(`.recherche__filtre__list__item.ustenciles`);
    for (const item of tags) {
      item.addEventListener('click', () => {// tableau qui contiendra tous les tags choisis, defini dans index.js
          ustensilTagsArray.push(item.innerText);
          ustensilTagsArray = SupprDoublonDunArray(ustensilTagsArray);
  
        document.querySelector('.recherche__tags__ustenciles').innerHTML = ustensilTagsArray.map((element) => {
          return `<span class='recherche__tags__item ustenciles'>${element}<i id="ferme" class="far fa-times-circle"></i></span>`;
        }).join('');
        const tagInput = remplaceCarSpeciaux(item.innerText);
        globalrecherche = rechercheUstensil(globalrecherche, tagInput);
        resultatSection.innerHTML = retourneBalisesArticlesContenantRecettesTriees(globalrecherche); // trie des recettes par ordre alpha et retourne autant de balise <article que nécessaire
  
        let ustensil = globalrecherche.flatMap((element) => element.ustensils);
        for (let i of ustensilTagsArray) {
          ustensil = ustensil.filter((element) => element !== i);
        }
        globalUstensil = [{ ustensils: ustensil }]
  
        GereBlocHtmlUnFiltre(globalUstensil, 'ustensils', '', 'ustenciles');
        
        globalIngredient = globalrecherche.flatMap((element) => element.ingredients);
        for (let i of ingredientTagsArray) {
          globalIngredient = globalIngredient.filter((element) => element.ingredient !== i);
        }
        GereBlocHtmlUnFiltre(globalIngredient, 'ingredient', '', 'ingredients');
  
        globalAppliance = globalrecherche;
        GereBlocHtmlUnFiltre(globalAppliance, 'appliance', '', 'appareils')
  
      });
    }
  } // majDesFiltres
  
  
  // écouteurs sur la saisie dans chaque filtre :
  EcouteursSurInputFiltre = () => {
    const rechercheInputIngredient = document.querySelector('#ingredientsInput');
    const rechercheInputAppliance = document.querySelector('#appareilsInput');
    const rechercheInputUstensil = document.querySelector('#ustencilesInput');
  
    rechercheInputIngredient.addEventListener('input', (e) => {
      let globalIngredient = globalrecherche.flatMap((element) => element.ingredients);
  
      for (let i of ingredientTagsArray) {
        globalIngredient = globalIngredient.filter((element) => element.ingredient !== i);
      }
      GereBlocHtmlUnFiltre(globalIngredient, 'ingredient', remplaceCarSpeciaux(e.target.value), 'ingredients');
    });
  
    rechercheInputAppliance.addEventListener('input', (e) => {
      let globalAppliance = globalrecherche.flatMap((element) => element);
      for (let i of applianceTagsArray) {
        globalAppliance = globalrecherche.filter((element) => element.appliance !== i); // appareil est le plus simple car toujours un seul appreil par recette
      }
      GereBlocHtmlUnFiltre(globalAppliance, 'appliance', remplaceCarSpeciaux(e.target.value), 'appareils');
    });
  
    rechercheInputUstensil.addEventListener('input', (e) => {
      let ustensil = globalrecherche.flatMap((element) => element.ustensils);
      for (let i of ustensilTagsArray) {
          ustensil = ustensil.filter((element) => element !== i);
      }
      globalUstensil = [{ ustensils: ustensil }];
      GereBlocHtmlUnFiltre(globalUstensil, 'ustensils', remplaceCarSpeciaux(e.target.value), 'ustenciles');
    });
  } //EcouteursSurInputFiltre
  

  
  
  
  window.onload = function () {  
    tabListSelect = ["ingredients", "appareils", "ustenciles"]
    //ecouteur clic sur les filtres pour les ouvrir ou les fermer
    tabListSelect.forEach(function(i) {
        let filtre = document.querySelector('.recherche__filtre__element.' + i);
        filtre.addEventListener('click', () => {
          console.log('clic sur filtre ' + i)
          let listeDuFiltre = document.querySelectorAll('.recherche__filtre__list__item.' + i);
          if (listeDuFiltre.length > 0) {
            document.querySelector('.conteneur-filtre-'+i).classList.toggle('larger');
            filtre.classList.toggle('visible');
            //articleAppliance.classList.remove('larger');
          // articleUstensil.classList.remove('larger');
          document.querySelector('#' + i + 'Input').value = '';
          document.querySelector('#' + i + 'Input').focus();
          }
        });
    })
  

  
    majDesFiltres(); //affiche les éléments dans les filtres (tous au chargement)
  
    //ecouteur sur .recherche__filtre permettant d'attraper les selections effectuées depuis les filtres
    const IngredientList = document.querySelector(`.recherche__filtre`); // .recherche__filtre__list.ingredients
    observerFiltres.observe(IngredientList, {subtree: true, childList: true}); // MutationObserver : https://developer.mozilla.org/fr/docs/Web/API/MutationObserver
    
  
    EcouteursSurInputFiltre();  // écouteurs sur la saisie dans chaque filtre
  }