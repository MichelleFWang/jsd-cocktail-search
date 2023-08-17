//global
const cocktailBaseUrl = 'https://www.thecocktaildb.com/api/json/v2/9973533/';

//global selector nodes
const resultsParent = document.querySelector( '#searchResults' );
const searchFormNode = document.querySelector( '#searchForm' );
const backButton = document.querySelector( '#backButton');
const userSearchInput = document.querySelector( '#cocktailQuery' );
const cocktailDetails = document.querySelector( '#cocktailDetails' );
const ingredientsNode = document.querySelectorAll( '.ingredients' );
const ingredientInput = document.querySelector( '#ingredientQuery' );
const ingredientFormNode = document.querySelector( '#ingredientForm' );
const chosenIngredientsNode = document.querySelector( '#chosen' );
const favouriteButton = document.querySelector( '#favourite');
const showFavourite = document.querySelector ( '#showFavourites');
const modeBody = document.querySelector ( '#model-body' );
const showFavouritesDetails = document.querySelector ( '#a' );
const clearButton = document.querySelector ( '#clear' );
//global arrays
const searchTerms = [];
const favourites = [];

//search by ingredient form handler
ingredientFormNode.addEventListener( 'submit', ev => {
    ev.preventDefault();
    searchByIngredients( ingredientInput.value );
   
    chosenIngredientsNode.innerHTML = searchTerms;
    ingredientFormNode.reset();
});


//search by clicking provided ingredients
ingredientsNode.forEach( ingredient => {
    ingredient.addEventListener( 'click', ev => {
        console.log('clicked:' + ingredient.id );
        searchByIngredients(ingredient.id)
        
        chosenIngredientsNode.innerHTML = searchTerms;
    })
});

//search by ingredients function and details page via id
const searchByIngredients = (searchIngredients) => {
    console.log(searchIngredients);

    if(!searchTerms.includes(searchIngredients)){
        searchTerms.push(searchIngredients);
    }
    resultsParent.replaceChildren();
    
    axios.get(`https://www.thecocktaildb.com/api/json/v2/9973533/filter.php?i=${searchTerms}`)
    .then(res => {
        renderSearchResults( res.data.drinks );

        resultsParent.addEventListener( 'click', ev =>{
            console.log( 'clicked!', ev.target );
            console.log('ID:', ev.target.dataset.cocktailId);
            resultsParent.style.display = "none";
            
            
            const id = ev.target.dataset.cocktailId;
        
            axios.get(`https://www.thecocktaildb.com/api/json/v2/9973533/lookup.php?i=${id}`)
            .then( res =>{
                cocktailDetails.style.display = "block";
                cocktailDetails.replaceChildren();
                renderDetailsResults (res.data.drinks);
            })

            .catch( err => {
                console.log( 'Error loading search results', err );
            })
        });
    })
    .catch( err => {
        console.log( 'Error loading search results', err );
        const pTag = document.createElement('p');
        pTag.innerHTML = 'Opps! There are no results.';
        cocktailDetails.appendChild(pTag);
    })
}

//search by name handler
searchFormNode.addEventListener( 'submit', ev => {
    console.log( 'Form submitted!', userSearchInput.value );
    ev.preventDefault();
    loadSearchResults( userSearchInput.value );
});

//Load search results via cocktail name and details via id
const loadSearchResults = (searchText) => {

    resultsParent.replaceChildren();

    axios.get(`https://www.thecocktaildb.com/api/json/v2/9973533/search.php?s=${searchText}`)
        .then( res => {
        renderSearchResults( res.data.drinks );

        resultsParent.addEventListener( 'click', ev =>{
            console.log( 'clicked!', ev.target );
            console.log('ID:', ev.target.dataset.cocktailId);
            resultsParent.style.display = "none";
            
            
            const id = ev.target.dataset.cocktailId;
        
            axios.get(`https://www.thecocktaildb.com/api/json/v2/9973533/lookup.php?i=${id}`)
            .then( res =>{
                cocktailDetails.style.display = "block";
                cocktailDetails.replaceChildren();
                renderDetailsResults (res.data.drinks);
            })

            .catch( err => {
                console.log( 'Error loading search results', err );
            })
        });

        })
        .catch( err => {
            console.warn( 'Error loading search results:', err );
        });

        backButton.addEventListener('click', ev => { 
            resultsParent.style.display = "grid";
            cocktailDetails.style.display = "none";
        });

} //loadsearchresults()

//clear button handler
clearButton.addEventListener('click', ev => {
    searchTerms.length=0;
    chosenIngredientsNode.innerHTML = searchTerms;
    
    // resultsParent.style.display = "grid";
    // cocktailDetails.style.display = "none";
})

//render search results either from search by name or ingredients
const renderSearchResults = (results) => {

    results.forEach( drinks => {
        console.log( drinks.idDrink, drinks.strDrinkThumb );

        const imgTag = document.createElement('img')
        imgTag.src = drinks.strDrinkThumb;
        imgTag.alt = drinks.strDrink;
        imgTag.dataset.cocktailId = drinks.idDrink;
        resultsParent.appendChild( imgTag );

        const divTag = document.createElement('div');
        divTag.innerHTML = drinks.strDrink;
        divTag.dataset.cocktailId = drinks.idDrink;
        resultsParent.appendChild( divTag );

    }); //foreach 
}; // renderSearchResults()

//show favourite button handler
showFavourite.addEventListener ('click', ev =>{
    showFavouritesDetails.innerHTML = favourites;
})

//push favourites into favourites array
const favouritesPush = (data) => {
    if(!favourites.includes(data)){
        favourites.push(data);
        console.log(favourites);
    }   
}

//render the details of drinks
const renderDetailsResults = (results) => {

    results.forEach( drinks => {
        console.log( drinks.idDrink, drinks.strDrinkThumb );

        const imgTag = document.createElement('img')
        imgTag.src = drinks.strDrinkThumb;
        imgTag.alt = drinks.strDrink;
        imgTag.dataset.cocktailId = drinks.idDrink;
        imgTag.style.width = '300px';
        imgTag.style.padding = '10px';
        cocktailDetails.appendChild( imgTag );
        
        const divTag = document.createElement('div');
        divTag.innerHTML = drinks.strDrink;
        divTag.innerHTML = 'Instructions: '+ drinks.strInstructions;
        divTag.dataset.cocktailId = drinks.idDrink;
        cocktailDetails.appendChild( divTag );

        const pTag1 = document.createElement('p');
        if(drinks.strIngredient1 != null && drinks.strMeasure1 != null){
            pTag1.innerHTML = "Ingredients: " + drinks.strMeasure1 + " " + drinks.strIngredient1;
        }
        else if (drinks.strIngredient1 !=null && drinks.strMeasure1 == null) {
            pTag1.innerHTML = "Ingredients: " + drinks.strIngredient1;
        }
        cocktailDetails.appendChild( pTag1 );

        const pTag2 = document.createElement('p');
        if(drinks.strIngredient2 != null && drinks.strMeasure2 != null){
            pTag2.innerHTML = drinks.strMeasure2 + " " + drinks.strIngredient2;
        }
        else if (drinks.strIngredient2 !=null && drinks.strMeasure2 == null) {
            pTag2.innerHTML = drinks.strIngredient2;
        }
        cocktailDetails.appendChild( pTag2 );

        const pTag3 = document.createElement('p');
        if(drinks.strIngredient3 != null && drinks.strMeasure3 != null){
            pTag3.innerHTML = drinks.strMeasure3 + " " + drinks.strIngredient3;
        }
        else if (drinks.strIngredient3 !=null && drinks.strMeasure3 == null) {
            pTag3.innerHTML = drinks.strIngredient3;
        }
        cocktailDetails.appendChild( pTag3 );

        const pTag4 = document.createElement('p');
        if(drinks.strIngredient4 != null && drinks.strMeasure4 != null){
            pTag4.innerHTML =  drinks.strMeasure4 + " " + drinks.strIngredient4;
        }
        else if (drinks.strIngredient4 !=null && drinks.strMeasure4 == null) {
            pTag4.innerHTML = drinks.strIngredient4;
        }
        cocktailDetails.appendChild( pTag4);

        const pTag5 = document.createElement('p');
        if(drinks.strIngredient5 != null && drinks.strMeasure5 != null){
            pTag5.innerHTML = drinks.strMeasure5 + " " + drinks.strIngredient5;
        }
        else if (drinks.strIngredient5 !=null && drinks.strMeasure5 == null) {
            pTag5.innerHTML = drinks.strIngredient5;
        }
        cocktailDetails.appendChild( pTag5 );

        const pTag6 = document.createElement('p');
        if(drinks.strIngredient6 != null && drinks.strMeasure6 != null){
            pTag6.innerHTML = drinks.strMeasure6 + " " + drinks.strIngredient6;
        }
        else if (drinks.strIngredient6 !=null && drinks.strMeasure6 == null) {
            pTag6.innerHTML = drinks.strIngredient6;
        }
        cocktailDetails.appendChild( pTag6 );


        favouriteButton.style.display = 'flex';
        favouriteButton.style.left = '47%';
        favouriteButton.style.position = 'absolute';
        favouriteButton.style.backgroundColor = '#FFCCCC';
        favouriteButton.style.color = 'red';
        favouriteButton.id = drinks.strDrink;
        cocktailDetails.appendChild(favouriteButton);
        
        favouriteButton.addEventListener('click',ev =>{
            ev.preventDefault();
            favouritesPush(favouriteButton.id)
            
        })
        
        // const favouriteButton = document.createElement('button');
        // favouriteButton.innerText = 'Add favourite';
        // favouriteButton.id = drinks.strDrink;
        // cocktailDetails.appendChild(favouriteButton);

    }); //foreach 
}; // renderSearchResults()

