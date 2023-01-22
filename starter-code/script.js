const input = document.querySelector('.header__input')
const dictionaryWord = document.querySelector('.dictionary__word');
const dictionaryPhonetics = document.querySelector('.dictionary__phonetics')
const nounList = document.querySelector('.dictionary__list-noun');
const verbList = document.querySelector('.dictionary__list-verb');
const adjectiveList = document.querySelector('.dictionary__list-adjective');
const adjectiveElement = document.querySelector('.adjective');
const verbElement = document.querySelector('.verb');
const nounElement = document.querySelector('.noun');
const source = document.querySelector('.dictionary__link')
const playButton = document.querySelector('.dictionary__play')
const verbSynonyms = document.querySelector('.verb-synonyms')
const nounSynonyms = document.querySelector('.noun-synonyms')
const adjectiveSynonyms = document.querySelector('.adjective-synonyms')
const synonyms = document.querySelectorAll('.dictionary__synonyms')

const catchWord = (e) => {
    e.preventDefault();
    if (e.keyCode === 13) {
        const inputValue = input.value
    // Clear any existing data
         dictionaryWord.innerText = ''
         dictionaryPhonetics.innerText = ''
         source.innerText = ''
         input.value = ''
         source.setAttribute('href', '');
         while (nounList.firstChild) {
             nounList.removeChild(nounList.firstChild);
         }
         while (verbList.firstChild) {
             verbList.removeChild(verbList.firstChild);
         }
         while (adjectiveList.firstChild) {
             adjectiveList.removeChild(adjectiveList.firstChild);
         }

         nounElement.style.display = 'none'
         verbElement.style.display = 'none'
         adjectiveElement.style.display = 'none'
         nounSynonyms.innerHTML = ''
         verbSynonyms.innerHTML = ''
         adjectiveSynonyms.innerHTML = ''
        
        
        axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${inputValue}`)
  .then(response => {
    let { word, phonetic, sourceUrls, meanings } = response.data[0];
    // main word
    dictionaryWord.innerText = word

    // making url
    source.innerText = sourceUrls
    source.setAttribute('href', sourceUrls);

    // if phonetics is undefined return nothing
    dictionaryPhonetics.innerText = phonetic
    if (dictionaryPhonetics.innerText === 'undefined') {
        dictionaryPhonetics.innerText = ''
    }
// const play = () => {

//     let audio = response.data[0].phonetics[1].audio
//     if (response.data[0].phonetics[2].audio !== undefined) {
//         audio = new Audio(response.data[0].phonetics[2].audio);
//     } else {
//         audio = new Audio(response.data[0].phonetics[0].audio);
//     }
//     console.log(audio)

//     audio.play();
// }
// playButton.addEventListener('click', play)
console.log(synonyms)
//getting synonims from json
const synonymMaker = (number, div, place) => {
    //if object in json exist set display block
    if (meanings[number] && meanings[number].synonyms) { 
        div.style.display = "block";
        //if object in json exist, first make a title
        if (meanings[number].synonyms.length > 0) {
          const title = document.createElement('p');
          title.setAttribute('class', 'dictionary__synonym-name');
          place.appendChild(title);
          title.innerText = "Synonyms";
        }
        //create list to push synonyms
        const list = [];
        for (const synonyms of meanings[number].synonyms) {
          list.push(synonyms)
        }
        //if synonyms in list exist make DOM element
        if (list.length > 0) {
          const element = document.createElement('p');
          element.setAttribute('class', 'dictionary__synonym');
          place.appendChild(element);
          element.innerText = list.join(', '); 
        }
        //if not exist set display to none
    } else {
        div.style.display = "none";
    }
}
//function ignition for synonyms
synonymMaker(2, adjectiveSynonyms, adjectiveSynonyms)
synonymMaker(1, verbSynonyms, verbSynonyms);
 synonymMaker(0, nounSynonyms, nounSynonyms)
 
// function for making noun and verb lists
const definitionMaker = (number, list, div) => {
    for (const [key, value] of Object.entries(meanings[number].definitions)) {
        div.style.display = "block"
        const element = document.createElement('li');
        element.setAttribute('class', 'dictionary__definition');
        list.appendChild(element)
        element.innerText = value.definition}  
}
definitionMaker(0, nounList, nounElement); 
definitionMaker(1, verbList, verbElement);
definitionMaker(2, adjectiveList, adjectiveElement);



  })
  .catch(error => {
    console.log(error);
  });
    }
}
input.addEventListener('keyup', e => catchWord(e))
