let pokemonList;

sendRequest("GET","https://pokeapi.co/api/v2/pokemon?limit=100&offset=0")
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
                    loadArr(arr);
                    let loader = document.querySelector(".loader");
                    loader.classList.add("close");
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

async function loadArr(pokemmonList){

    const formSearch = document.createElement("form");
    formSearch.id = "form-search";
    formSearch.style.maxWidth = "350px";
    formSearch.style.minWidth = "250px";
    formSearch.style.margin = "auto";
    
    const formGroup = document.createElement("div");
    formGroup.className = 'formgroup-controll';
    formGroup.style.position = "relative";

    const formInput = document.createElement("input");
    formInput.className = "form-input";
    formInput.style.width = "100%";
    formInput.style.height = "100%";
    formInput.style.padding = "10px 15px";
    formInput.style.color = "#444444";
    formInput.style.outline = "1px solid #444444";
    formInput.style.border = "none";
    formInput.style.borderRadius = "10px";
    formInput.style.fontSize = "15px";
    formInput.style.fontWeight = "700";
    
    const formSearchBtn = document.createElement("button");
    formSearchBtn.style.display = "flex";
    formSearchBtn.style.justifyContent = "center";
    formSearchBtn.style.alignItems = "center";
    formSearchBtn.style.position = "absolute";
    formSearchBtn.style.top = "50%";
    formSearchBtn.style.right = "-15px";
    formSearchBtn.style.transform = "translateY(-50%)";
    formSearchBtn.style.outline = "none";
    formSearchBtn.style.border = "none";
    formSearchBtn.style.backgroundColor = "transparent";
    formSearchBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
</svg>`
    formGroup.appendChild(formInput);
    formGroup.appendChild(formSearchBtn);
    formSearch.appendChild(formGroup);


    const logoContainer = document.createElement('div');
    logoContainer.style.textAlign = 'center';
    logoContainer.style.padding = '20px';

    const logo = document.createElement('img')
    logo.src = './assets/pokemon-logo.png';
    logo.style.maxWidth = "350px";
    logo.style.width = "100%";
    logo.style.aspectRatio = "2.5 / 1";

    logoContainer.appendChild(logo);
    await document.body.appendChild(logoContainer);
    await document.body.appendChild(formSearch);
    formSearch.addEventListener("submit", (event) => {
        event.preventDefault();
    })

    formInput.addEventListener("input", debounce((event)=>{
        event.preventDefault();
        let input = escapeHTML(event.target.value);
        let array = pokemmonList.filter(pokemon => {
            return pokemon.name.toLowerCase().includes(input);
        });
        let oldList = document.querySelector(".pokemon-list");
        oldList && oldList.remove();
        render(array);
    }, 300))

    render(pokemmonList);
    
}

function debounce(fn, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
}

function escapeHTML(str) {
    return str.replace(/[&<>"']/g, function (m) {
        return ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        })[m];
    });
}

async function render(pokemmonList){
    const list = document.createElement('div');
    list.className = "pokemon-list";
    list.style.display = "flex";
    list.style.flexWrap = "wrap";
    list.style.justifyContent = "center";
    list.style.gap = "30px";
    list.style.listStyle = "none";
    list.style.margin = "auto";
    list.style.maxWidth = "90vw";
    list.style.width = "80%";
    list.style.scrollBehavior = "smooth";
    list.style.padding = "20px";

    // const fragment = document.createDocumentFragment(); // Sử dụng fragment
    // fragment.className = "pokemon-fragment";
    // fragment.style.display = "flex";
    // fragment.style.flexWrap = "wrap";
    // fragment.style.justifyContent = "center";
    // fragment.style.gap = "30px";
    // fragment.style.fragmentStyle = "none";
    // fragment.style.margin = "auto";
    // fragment.style.maxWidth = "90vw";
    // fragment.style.width = "80%";
    // fragment.style.scrollBehavior = "smooth";
    // fragment.style.padding = "20px";

    await pokemmonList.forEach(pokemon => {
        if(pokemon){
            const item = document.createElement('li');
            item.className = 'pokemon';
            item.style.border = `3px solid ${getTypeColor(pokemon.types[0].type.name)}`;
            item.style.borderRadius = "15px";
            
            
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
                    type.className = "pokemon-type";
                    type.style.backgroundColor = getTypeColor(pokemonType.type.name)
                    
                    type.style.color = "white";
                    type.style.border = `1px solid ${getTypeColor(pokemonType.type.name)}`;
                    type.style.borderRadius = "10px";
                    type.textContent = pokemonType.type.name;
                    type.style.textTransform = 'capitalize';
                    type.style.fontWeight = '600';
        
                    itemType.appendChild(type);
                })
            }
            itemRedirect.appendChild(itemType);

            item.appendChild(itemRedirect);
            list.appendChild(item);
            // fragment.appendChild(item);
        }
        
    })

    await document.body.appendChild(list);
    // await document.body.appendChild(fragment);
    document.body.style.backgroundColor = 'crimson';
}