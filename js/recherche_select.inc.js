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
  
    CacherFiltres();  
  }