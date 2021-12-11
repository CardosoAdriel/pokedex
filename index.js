const containerCardPokedex = document.querySelector("#container-card")
const inputPokemonSearch = document.querySelector("#pokemon-search")
const modalPokemonDetail = document.querySelector('.modalDetailPokemon')

const getPokemonUrl = (id) => `https://pokeapi.co/api/v2/pokemon/${id}`

const fetchPokemon = () => {

  const pokemonPromises = []

  for (let i = 1; i <= 150; i++) {
    pokemonPromises.push(fetch(getPokemonUrl(i)).then((res) => res.json()))
  }

  Promise.all(pokemonPromises).then((pokemons) => {
    const lisPokemons = pokemons.reduce((accumulator, pokemon) => {
      const types = pokemon.types.map(typeInfo => typeInfo.type.name)

      accumulator += `
        <li class="card ${types[0]}" onclick="getPokemonSelected(${pokemon.id})">
          <img src="assets/${pokemon.id}.png" alt="Foto do pokemon ${pokemon.name}">
          <div class="card-content">
            <h2 class="card-name">${pokemon.id}. ${pokemon.name}</h2>
            <span class="card-types">${types.join(' | ')}<span>
          </div>
        </li>
      `

      return accumulator
    }, "")
    containerCardPokedex.innerHTML = lisPokemons
  })
}

fetchPokemon()


inputPokemonSearch.addEventListener('input', (event) => {
  const inputValue = event.target.value.toLowerCase()
  const pokemons = document.querySelectorAll('.card')

  pokemons.forEach(card => {
    const cardName = card.querySelector('.card-name').textContent.toLowerCase()
    const cardTypes = card.querySelector('.card-types').textContent.toLocaleLowerCase()
    const nameOrTypesMatchPokemons = cardName.includes(inputValue) || cardTypes.includes(inputValue)

    if(nameOrTypesMatchPokemons) {
      card.style.display = 'flex'
      return
    }

    card.style.display = 'none'
  })
})


/** INÍCIO LÓGICA PARA APRESENTAR MODAL COM POKEMON SELECIONADO **/
const closeModal = () => {
  containerCardPokedex.style.display = "flex"
  modalPokemonDetail.style.display = "none"
}

const openCardModal = contentModal => {
  modalPokemonDetail.innerHTML = contentModal
  modalPokemonDetail.style.display = "flex"
  containerCardPokedex.style.display = "none"
}

const insertDataPokemonIntoModal = pokemon => {
  const type = pokemon.types.map(typeInfo => typeInfo.type.name)
  const pokemonName = pokemon.forms[0].name.toUpperCase()
  const statsPokemon = pokemon.stats.map(stat => ({value: stat.base_stat, name: stat.stat.name}))
  

  const contentDataPokemonModal = `
  <div class="card-modal ${type[0]}" >
    <img class="card-modal-img_pokemon" src="assets/${pokemon.id}.png" alt="">
    <img class="card-modal-type" src="assets/types/${type[0]}.png" alt="" onclick="closeModal()">
    <h2 class="card-modal-title">${pokemon.id} - ${pokemonName}</h2>
    <ul class="card-modal-infos">
      <li>
        <img src="assets/${statsPokemon[0].name}.png" alt="Logo de Vida">
        <p>${statsPokemon[0].name.toUpperCase()} - <strong>${statsPokemon[0].value}</strong></p>          
      </li>
      <li>
        <img src="assets/${statsPokemon[1].name}.svg" alt="Logo de Ataque">
        <p>${statsPokemon[1].name} - <strong>${statsPokemon[1].value}</strong> / 
          ${statsPokemon[3].name} - <strong>${statsPokemon[3].value}</strong>
        </p>          
      </li>
      <li>
        <img src="assets/${statsPokemon[2].name}.png" alt="Logo de Defesa">
        <p>${statsPokemon[2].name} - <strong>${statsPokemon[2].value}</strong> / 
          ${statsPokemon[4].name} - <strong>${statsPokemon[4].value}</strong>
        </p>          
      </li>
      <li>
        <img src="assets/${statsPokemon[5].name}.png" alt="Logo de Velocidade">
        <p>${statsPokemon[5].name} - <strong>${statsPokemon[5].value}</strong></p>          
      </li>
    </ul>
    <img src="assets/poke-ball.png" class="btn-escolher"></img>
  </div>
  `
  openCardModal(contentDataPokemonModal)

}

const getPokemonSelected = async id => {
  const dataPokemonDetails = await fetch(getPokemonUrl(id)).then(pokemon => pokemon.json())
  insertDataPokemonIntoModal(dataPokemonDetails)
}





