const input = document.querySelector('.header__input')
const dictionaryWord = document.querySelector('.dictionary__word');
const dictionaryPhonetics = document.querySelector('.dictionary__phonetics')
const source = document.querySelector('.dictionary__link')
const sourceTitle = document.querySelector('.dictionary__source')
const sourceImg = document.querySelector('.dictionary__source-img')
const playButton = document.querySelector('.dictionary__play')
const parent = document.querySelector('.dictionary__parentElement')
const audio = document.querySelector('.audio')
const fontSelect = document.querySelector('.header__fonts')
const body = document.querySelector('body')
const toggleBtn = document.querySelector('#switch');
const inputWrapper = document.querySelector('.input-wrapper')
const header = document.querySelector('.dictionary__head')
const logo = document.querySelector('.header__logo')
const searchBtn = document.querySelector('.header__search')

//function for fonts changing
fontSelect.addEventListener('change', function() {
 const addFont1 = () => {
    body.classList.add('font1')
    body.classList.remove('font2')
    body.classList.remove('font3')
 }
 const addFont2 = () => {
    body.classList.add('font2')
    body.classList.remove('font1')
    body.classList.remove('font3')
 }
 const addFont3 = () => {
    body.classList.add('font3')
    body.classList.remove('font1')
    body.classList.remove('font2')
 } 
if (this.value === 'Mono') addFont1();
if (this.value === 'Sans Serif') addFont2();
if (this.value === 'Serif') addFont3();
  });
// toggle for dark mode
const toggle = () => {
    toggleBtn.checked ? (body.classList.add('dark'))
    : body.classList.remove('dark');
}
toggleBtn.oninput = toggle

//if toggle is on dark, switch to dark
toggleBtn.checked ? body.classList.add('dark') : null
//function for reset
function clearInput() {
    dictionaryWord.innerText = '';
    dictionaryPhonetics.innerText = '';
    source.innerText = '';
    input.value = '';
}
//reload when press logo
const reloadOnLogo = () => {
    window.location = window.location
}
logo.addEventListener('click', reloadOnLogo)
const catchWord = (e) => {
    e.preventDefault();
    //if enter or search button is pressed
    if (e.keyCode === 13 || e.button === 0) {
    const resetParent = () => {
     while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
            }
        }
    const inputValue = input.value
    if (!inputValue){
return
    } else {
        resetParent(); clearInput();
            }
        axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${inputValue}`)
  .then(response => {
    let { word, phonetic, phonetics, sourceUrls, meanings } = response.data[0];

    const openSourceInNewWindow = () => {
        return window.open(source.innerText)
    }
    sourceImg.addEventListener('click', openSourceInNewWindow)
    // main word
    dictionaryWord.innerText = word

    // deleting error message when everything is ok
    if(document.querySelector('.dictionary__error') !== null) {
        inputWrapper.removeChild(document.querySelector('.dictionary__error'));
        header.removeChild(document.querySelector('.dictionary__img-wrapper'));
        playButton.style.display = "block"
        sourceTitle.style.display = "block"
        sourceImg.style.display = "block"
    }
    // making url, if sourceurl has more than one value, put to innerText just one value.
    source.innerText = sourceUrls
    sourceUrls.length > 1 ? (source.innerText = sourceUrls[1], source.setAttribute('href', sourceUrls[1])) : (source.innerText = sourceUrls, source.setAttribute('href', sourceUrls))

    // if phonetics is undefined return nothing
    dictionaryPhonetics.innerText = phonetic
    if (dictionaryPhonetics.innerText === 'undefined') {
        dictionaryPhonetics.innerText = ''
    }
    phonetics.forEach(data => {
        if (!data.audio || audio.src === '/starter-code/500-milliseconds-of-silence.mp3'){
            playButton.style.filter = "grayscale(100%)";
            playButton.style.cursor = "default";
        } else {
            playButton.style.filter = "grayscale(0%)";
            playButton.style.cursor = "pointer";
        }
    });
// audio
    const playAudio = () => {
    audio.pause();
    audio.currentTime = 0;
    playButton.style.cursor = 'pointer'
    audio.src = '/starter-code/500-milliseconds-of-silence.mp3'; 
    if (phonetics[0].audio){
        audio.src = phonetics[0].audio;
    } else if (audio.src === phonetics[1].audio){
        audio.src = phonetics[1].audio
    } else if (audio.src === phonetics[2].audio){
        audio.src = phonetics[2].audio
    }
    else
    playButton.style.cursor = "default";
    audio.play();
    
}
    meanings.forEach(data => {
        //wrapper of content
        const partOfSpeechDiv = document.createElement('div');
        partOfSpeechDiv.setAttribute('class', `title-wrapper`)
        parent.appendChild(partOfSpeechDiv)

        //making wrapper for title
        const partOfSpeechElement = document.createElement('div');
        partOfSpeechElement.setAttribute('class', `dictionary__partOfSpeech-element`)
        partOfSpeechDiv.appendChild(partOfSpeechElement)

        //making title with line
        const partofSpeechTitle = document.createElement('div');
        partofSpeechTitle.setAttribute('class', `dictionary__partOfSpeech`);
        const line = document.createElement('div');
        line.setAttribute('class', `dictionary__line`);

        //add title to DOM
        partOfSpeechElement.appendChild(partofSpeechTitle);
        partOfSpeechElement.appendChild(line)
        //inner text of title to json.data
        partofSpeechTitle.innerText = data.partOfSpeech;

        // add word 'meaning' to DOM
        const meaningText = document.createElement('div');
        meaningText.setAttribute('class', `dictionary__meaning`)
        partOfSpeechDiv.appendChild(meaningText)
        meaningText.innerText = 'Meaning'

        // list for definitions
        const definitonslist = document.createElement('ul')
        definitonslist.setAttribute('class', 'dictionary__list')
        partOfSpeechDiv.appendChild(definitonslist)

        data.definitions.forEach(object => {
        //adding definitions to lists
        const definitonsText = document.createElement('li');
        definitonsText.setAttribute('class', 'dictionary__definition');
        definitonslist.appendChild(definitonsText)
        definitonsText.innerText = object.definition
        const definitonExample = document.createElement('p');
        definitonExample.setAttribute('class', 'dictionary__example');
        definitonsText.appendChild(definitonExample)
        //if definition is not undefined, add definiton to innerText
        if (object.example !== undefined) {
            definitonExample.innerText = `"${object.example}"`
        }
        }  )
        //function of making antonyms and synonyms with title
    const synonymAntonymMaker = (kindOf, titleOf) => {
        let list = [];
        //creating synonyms element
        const element = document.createElement('p');
        element.setAttribute('class', 'dictionary__synonyms-antonyms');
        const title = document.createElement('p');
        //creating synonyms title
        title.setAttribute('class', 'dictionary__synonyms-antonyms-title');        
        definitonslist.appendChild(title);
        data[kindOf].forEach(object => {
        list.push(object);
        if (element) {
        title.innerText = `${titleOf}`;
        }
        });
        
        element.innerText = list.join(', ');
        definitonslist.appendChild(element);
    }
    synonymAntonymMaker('synonyms', 'Synonyms')
    synonymAntonymMaker('antonyms', 'Antonyms')
    }); 
playButton.addEventListener('click', playAudio)


  })

  //getting error
  .catch(error => {
    //if there is not error
    if (!document.querySelector('.dictionary__error')) {
        //create error elements and remove DOM elements
        const msg = document.createElement('p');
        sourceTitle.style.display = "none"
        sourceImg.style.display = "none"
        msg.setAttribute('class', 'dictionary__error');
        inputWrapper.appendChild(msg)
        msg.innerText = 'Please write the correct word';
        const errorImg = document.createElement('img');
        errorImg.setAttribute('src', './starter-code/assets/images/404-error.png');
        errorImg.setAttribute('class', 'dictionary__errorImg');
        // header.appendChild(errorImg)
        const wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'dictionary__img-wrapper');
        wrapper.appendChild(errorImg)
        header.appendChild(wrapper)
        
        playButton.style.display = "none"

    }
  });
    }

}
input.addEventListener('keyup', e => catchWord(e))
searchBtn.addEventListener('mouseup', e => catchWord(e))

