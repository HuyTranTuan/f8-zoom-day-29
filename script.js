let pokemonList;

sendRequest("GET","https://pokeapi.co/api/v2/pokemon?limit=1100&offset=0")
    .then((listPokemon) => {
        pokemonList = listPokemon ? JSON.parse(listPokemon).results : [];
        Promise.all(pokemonList.map(item => {
            return sendRequest("GET", item.url);
        }))
        .then(results => {
            Promise.all(results.map(item => {
                return sendRequest("GET", JSON.parse(item).sprites.front_default);
            }))
                .then(poke => {
                    let arr = results.map(item => JSON.parse(item))
                    arr.forEach((item, index) => {
                        item.img = poke[index];
                    })
                    render(arr);
                })
        })
    })




function sendRequest(method, url){
    let promise =  new Promise((resolve, reject) => {
        try {
            const xhr = new XMLHttpRequest();
            xhr.open(method, url, true);
            xhr.send();
            xhr.onload = function(){
                if(xhr.status >= 200 && xhr.status < 400){
                    resolve(xhr.responseText);
                } else {
                    reject("Network Error!");
                }
            }
        } catch (error) {
        console.error("An error occured while fetching Pokemon data:", error);
        return false;
        }
    });

    return promise;
}

function getTypeColor(type){
    switch(type){
        case "normal": return "#A8A77A"
        case "fire": return "#EE8130"
        case "water": return "#6390F0"
        case "electric": return "#F7D02C"
        case "grass": return "#7AC74C"
        case "ice": return "#96D9D6"
        case "fighting": return "#C22E28"
        case "poison": return "#A33EA1"
        case "ground": return "#E2BF65"
        case "flying": return "#A98FF3"
        case "psychic": return "#F95587"
        case "bug": return "#A6B91A"
        case "rock": return "#B6A136"
        case "ghost": return "#735797"
        case "dragon": return "#6F35FC"
        case "dark": return "#705746"
        case "steel": return "#B7B7CE"
        case "fairy": return "#D685AD"
    }
}

async function render(pokemmonList){

    const logoContainer = document.createElement('div');
    logoContainer.style.textAlign = 'center';
    logoContainer.style.padding = '20px';

    const logo = document.createElement('img')
    logo.src = './assets/pokemon-logo.png';
    logo.style.maxWidth = "350px";
    logo.style.width = "100%";
    logo.style.aspectRatio = "2.5 / 1";

    logoContainer.appendChild(logo);
    

    const list = document.createElement('div');
    list.className = "pokemon-list";
    list.style.display = "flex";
    list.style.flexWrap = "wrap";
    list.style.justifyContent = "center";
    list.style.gap = "30px";
    list.style.listStyle = "none";
    list.style.margin = "auto";
    list.style.height = "70vh";
    list.style.maxWidth = "90vw";
    list.style.width = "80%";
    list.style.overflow = "auto";
    list.style.scrollBehavior = "smooth";
    list.style.padding = "20px";

    await pokemmonList.forEach(pokemon => {
        if(pokemon){
            const item = document.createElement('li');
            item.className = 'pokemon';
            item.style.border = `3px solid ${getTypeColor(pokemon.types[0].type.name)}`;
            item.style.borderRadius = "15px";
            item.style.flex = "1 1 15%";
            item.style.backgroundColor = "white";
            
            const itemRedirect = document.createElement('a')
            itemRedirect.href = `./pokemon.html?id=${pokemon.id}`
            itemRedirect.style.textDecoration = "none";
            itemRedirect.style.padding = "10px";
            
            const imgContainer = document.createElement('div');
            imgContainer.style.width = 'fit-content';
            imgContainer.style.aspectRatio = '1';
            imgContainer.style.textAlign = 'center';
            imgContainer.style.margin = 'auto';
            imgContainer.style.width = '70%';
            const img = document.createElement('img');
            img.src = pokemon.sprites.front_default;
            img.style.width = "100%";
            img.style.height = "100%";
            img.style.objectFit = "cover";
            img.style.objectPosition = "center";
            imgContainer.appendChild(img);
            itemRedirect.appendChild(imgContainer);
            
            const itemName = document.createElement('h2');
            itemName.textContent = pokemon.name;
            itemName.style.display = "block";
            itemName.style.fontSize = "20px";
            itemName.style.fontWeight = "700";
            itemName.style.textAlign = "center";
            itemName.style.textTransform = "capitalize";
            itemName.style.color = "#444444";
            itemRedirect.appendChild(itemName);
            
            const itemType = document.createElement("div");
            itemType.style.display = "flex";
            itemType.style.justifyContent = "center";
            itemType.style.gap = "10px";

            if(pokemon.types){
                pokemon.types.forEach(pokemonType => {
                    const type = document.createElement("span");
                    type.style.backgroundColor = getTypeColor(pokemonType.type.name)
                    type.style.fontSize = "16px";
                    type.style.fontWeight = "500";
                    type.style.color = "white";
                    type.style.border = `1px solid ${getTypeColor(pokemonType.type.name)}`;
                    type.style.borderRadius = "10px";
                    type.style.padding = "10px 15px";
                    type.textContent = pokemonType.type.name;
                    type.style.textTransform = 'capitalize';
                    type.style.fontWeight = '600';
        
                    itemType.appendChild(type);
                })
            }
            itemRedirect.appendChild(itemType);

            item.appendChild(itemRedirect);
            list.appendChild(item);
        }
        
    })
    await document.body.appendChild(logoContainer);
    await document.body.appendChild(list);
    document.body.style.backgroundColor = 'crimson';
}
