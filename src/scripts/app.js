"use strict";

// Création d'un oscillateur et gain avec la web audio API
window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();

var o = context.createOscillator();
var g = context.createGain();
g.gain.value = 0;
o.frequency.value = 0;
o.type = "triangle";

g.connect(context.destination);
o.connect(g);

var frq = 0,
    gain = 0;

var root = document.documentElement;

// Défini la bon event à écouter - touch ou mouse
var eventStart = "";
var eventEnd = "";
if (window.matchMedia("(min-width: 900px)").matches) {
    // Desktop - mouseevent
    eventStart = 'mousedown';
    eventEnd = 'mouseup';
} else {
    // Tablet - touchevent
    eventStart = 'touchstart';
    eventEnd = 'touchend';
}


///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////// VARIABLES ///////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////

var defaultEase = 0.1;

//////////////////////////////////////
//////////// INTRODUCTION ////////////
//////////////////////////////////////

const sectionIntro = document.querySelector('.section-intro'),
      letters = document.querySelectorAll('.h1-letter');

var count = 1;

const playedColors = document.querySelector('.played-color');


//////////////////////////////////////
//////////// NAVIGUATION /////////////
//////////////////////////////////////

const body = document.querySelector('body'),
      navBtn = document.querySelectorAll('.menu-btn'),
      pianoSvg = document.querySelector('.section-piano-svg'),
      infoSection = document.querySelector('.section-info'),
      creditBtn = document.querySelectorAll('.section-header-creditBtn'),
      transition = document.querySelector('.transition');


//////////////////////////////////////
//////// ECOUTE D'UNE COULEUR ////////
////////////////////////////////////// 

var colorInput = document.querySelectorAll('.colorInput'),
    colorSpan = document.querySelectorAll('.colorSpan'),
    actualNote = document.getElementById('playedColor');

const color = document.getElementById('module-color');

var colorInputs = [],
    colorSpans = [];


//////////////////////////////////////
//////// ECOUTE D'UNE IMAGE //////////
//////////////////////////////////////

var speed = 120;
const playRate = document.getElementById('playRate'),
      playRateSpan = document.getElementById('playRateSpan'),
      colorNumberSpan = document.getElementById('colorNumberSpan'),
      colorNumber = document.getElementById('colorNumber');

const playImageBtn = document.getElementById('getColors'),
      imgToListen = document.querySelector('.section-module-image1'),
      backgroundImg = document.querySelector('.section-module-image2'),
      imageModule = document.querySelector('.section-image .section-module'),
      btnUpload = document.getElementById('uploadBtn'),
      btnOpenSelection = document.getElementById('btnOpenSelection'),
      imageSelection = document.querySelectorAll('.selection-image-el'),
      inputUpload = document.getElementById('uploadInput'),
      colorList = document.querySelector('.color-list');

const colorThief = new ColorThief();


//////////////////////////////////////
//////////////// PAD /////////////////
////////////////////////////////////// 

const padBtn = document.querySelectorAll('.pad-btn'),
      tuto = document.querySelector('.pad-tuto'),
      closeTuto = document.getElementById('closeTuto'),
      confirmEdit = document.getElementById('confirmEdit'),
      editBtn = document.querySelector('.btn-edit'),
      randomBtn = document.querySelector('.btn-random'),
      editDiv = document.querySelector('.pad-editor'),
      editDivIndicator = document.querySelector('.editor-indicator'),
      saveBtn = document.querySelector('.btn-save'),
      editInput = document.querySelector('.editor-slider'),
      sectionPad = document.querySelector('.section-pad');
      
var h = 0;


//////////////////////////////////////
////////////// PIANO /////////////////
////////////////////////////////////// 

const pianoColor = document.querySelector('.section-piano-color');

var h = 0,
    s = 0,
    l = 0,
    down = false;


//////////////////////////////////////
////NAVIGATION DE LA SECTION INFO/////
//////////////////////////////////////

const navBtnOpen = document.querySelector('.nav-btn-open'),
      navBtnClose = document.querySelector('.nav-btn-close'),
      nav = document.getElementById('nav'),
      gist = document.querySelectorAll('.container-code .gist'),
      anchors = document.querySelectorAll('.anchor'),
      navElements = document.querySelectorAll('.navigation-list-el');



///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
////////////////// INTRODUCTION + START API ///////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////

sectionIntro.addEventListener('click', (event) => {
    
    let frqs = [],
        gains = [],
        hsls = [];

    o.start(0);
    
    sectionIntro.classList.add('play');
    let randomH = randomMinMax(0, 360);
    letters.forEach(element => {

        //Crée la couleur en HSL pour jouer la note plus tard
        let h = (randomH + (randomMinMax(30, 40) * count)) % 360,
            s = randomMinMax(80, 100),
            l = randomMinMax(50, 60);
                        
        let gain = setGain(l, s),
            frq = setFrequency( h, s, l);

        gains.push(gain);
        frqs.push(frq);
        hsls.push([h, s, l]);

        root.style.setProperty('--h1l-'+count, "hsl("+ h +", "+ s +"%, "+ l +"%)");
        
        element.addEventListener('animationend', (e) => {
            element.style.opacity = 1;
            element.classList.add('end');
        });

        count++;
    });

    for (let i = 1; i < letters.length; i++) {
        setTimeout(() => {
            playArrayWithoutColor(i, 110, gains, frqs);
        }, 280);
    }

    // Après que toutes les lettres aient joué.
    setTimeout(() => {
        stopGain(defaultEase);
        sectionIntro.classList.add('hide');
        sectionIntro.addEventListener('animationend', (e) => {
            sectionIntro.style.display = "none";
            for (let i = 1; i < letters.length+1; i++) {
                root.style.removeProperty('--h1l-'+i);
                console.log(i);
            }
        });
    }, (letters.length * 100) + 1500);
});



///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
/////////////////////////// NAVIGUATION ///////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////

navBtn.forEach(element => {
    element.addEventListener('click', (e) => {
        
        // Actualise le bouton du menu
        let target = e.currentTarget;
        var pastTarget = document.querySelector('.menu-btn.active');
        pastTarget != null ? pastTarget.classList.remove('active') : pastTarget = pastTarget;
        target.classList.add('active');
        
        let page = target.getAttribute('id');
        
        if (pastTarget.getAttribute('id') == page) {
            console.log('page déjà ouverte');
        } else {
            body.classList.remove('show-credits');

            // Change la page
            body.classList.add('hiding');
            let h = randomMinMax(0, 360);
            
            ///transition.style.backgroundColor = "hsl("+h+", 100%, 50%)";
            root.style.setProperty("--tr-c", "hsl("+h+", 100%, 50%)");
    
            body.addEventListener('animationend', (e) => {
                if(e.animationName === 'animationChangeListener'){
                    body.setAttribute('data-page', page);
                    body.classList.remove('hiding');
                    body.classList.add('showing');
                } else if(e.animationName === 'animationEndListener'){
                    body.classList.remove('showing');
                }
            });
    
            if (page == "piano") {
                // Refais apparaître le message du piano
                pianoSvg.style.opacity = "1";
            }else if (page == "info") {
                // Reset le scroll de la page malgré l'ancre
                infoSection.scrollTop = 0;
            }
        }

    });
});

creditBtn.forEach(btn => { 
    btn.addEventListener('click', (e) => {
        body.classList.toggle('show-credits');
    });
});


///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////// ECOUTE D'UNE COULEUR ////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////

colorInput.forEach((input) => {
    colorInputs.push(input);
});

colorSpan.forEach((colorSpan) => {
    colorSpans.push(colorSpan);
});


//Lorsqu'un slider bouge :
for (let i = 0; i < colorInputs.length; i++) {
    colorInputs[i].addEventListener('input', (e) => {

        let h = colorInputs[0].value,
            s = colorInputs[1].value,
            l = colorInputs[2].value;

        // Joue les paramètres et acualise la couleur du "played-color"
        playNote(h,s,l);

        // Affiche la fréquence jouée
        actualNote.innerHTML = setFrequency(h,s,l) + "Hz";
        
        // Affiche la valeur du slider 
        colorSpans[i].innerHTML = colorInputs[i].value;
        
        // Affiche la couleur jouée
        h = Number(h);
        l = Number(l);
        
        let h2 = h+20,
            l2 = l-5;

        h2 = h2 > 359 ? 359 : h2;
        l2 = l2 < 0 ? 0 : l2;

        color.style.background = "linear-gradient(hsl("+h+", "+s+"%, "+l+"%), hsl("+h2+", "+s+"%, "+l2+"%))";
    });

    colorInputs[i].addEventListener(eventEnd, (e) => {
        stopGain(defaultEase);
    });
};



///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////// ECOUTE D'UNE IMAGE //////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////

// Affiche le bon message en fonction du device
let deviceAction2 = window.matchMedia("(min-width: 900px)").matches ? "l'explorateur de fichiers" : "ma galerie";
btnUpload.innerHTML = "Ouvrir " + deviceAction2;

// Présélectionne une image
imageSelection[0].classList.add('selected');
createPalette(imgToListen);

// Réglage de la vitesse de lecture
playRate.addEventListener('input', (e) => {
    speed = playRate.value * -1;
    playRateSpan.innerHTML = playRate.value * -1;
});



// Réglage du nombre de couleurs
colorNumber.addEventListener(eventStart, (e) => {
    colorList.classList.add('edition');
});

colorNumber.addEventListener('input', (e) => {
    colorNumberSpan.innerHTML = colorNumber.value;
    let width = 'calc((5rem + 0.5rem) * '+colorNumber.value+')';

    if (window.matchMedia("(min-width: 900px)").matches == false) {
        if (colorNumber.value > 5) {
            width = 'calc((15vw + 0.5rem) * 5)';
            colorList.classList.add('big');
        }else {
            width = 'calc('+colorNumber.value+' * (15vw + 0.5rem))';
            colorList.classList.remove('big');
        }
    }

    colorList.style.width = width;
});

colorNumber.addEventListener(eventEnd, (e) => {
    createPalette(imgToListen);
    colorList.classList.remove('edition');
});



// Ouvre la sélection
btnOpenSelection.addEventListener('click', (e) => {
    btnOpenSelection.classList.toggle('selection-open');
});



// Change l'image avec l'image sélectionnée
imageSelection.forEach(image => {
    image.addEventListener('click', (e) => {
        let currentTarget = e.currentTarget;
        let pastTarget = document.querySelector('.selected');
        currentTarget.classList.add('selected');
        
        // Vérifie si ils sont null avant d'ajouter ou retirer la class
        pastTarget != null ? pastTarget.classList.remove('selected') : console.log('selection added');
        
        // Children[0] car currentTarget est "li" et non "li > img"
        let imgName = currentTarget.children[0].currentSrc.slice(-16);
        
        if (imgName.includes("@2x") == true) {
            imgName = imgName.slice(0, imgName.length - 7);
        }else {
            imgName = imgName.slice(3, imgName.length - 4);
        }

        // Change les liens et crée une palette - (nom de l'image, image externe)
        changeImageToListen(imgName, false);
    });
});



// Upload d'une image
btnUpload.addEventListener('click', (e) => {
     inputUpload.click();
     //Actualise l'image uploadée
     inputUpload.addEventListener('change', (e) => {
        // Retire la class "selected" de l'image précédement sélectionnée
        let pastTarget = document.querySelector('.selected');
        pastTarget != null ? pastTarget.classList.remove('selected') : console.log('selection removed');

        let imgLink = URL.createObjectURL(e.target.files[0]);        

        // Change les liens et crée une palette - (nom de l'image, image externe)
        changeImageToListen(imgLink, true);
    });
});



//Récupère les couleurs de l'image et les joue
playImageBtn.addEventListener('click', (e) => {
    let gains = [],
        frqs = [],
        hsls = [];

    for (let i = 0; i < colorList.childNodes.length; i++) {
        let htmlEl = colorList.childNodes[i],
            rgbColor = htmlEl.getAttribute('style').match(/\d+/g).map(Number),
            hslColor = RGBToHSL(rgbColor[0], rgbColor[1], rgbColor[2]);

        hsls.push(hslColor);
        
        let gain = setGain(hslColor[1],hslColor[2]),
            frq = setFrequency(hslColor[0],hslColor[1],hslColor[2]);

        gains.push(gain);
        frqs.push(frq);

        setTimeout(() => {
            playArray(i, speed, gains, frqs, hsls);
        }, speed);
    }

    setTimeout(() => {
        stopGain(defaultEase);
    }, (speed * colorList.childNodes.length) + speed);
});


///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
////////////////////////////// PAD ////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////

// Permets de rentreret sortir en mode "modification" des boutons 
editBtn.addEventListener('click', (e) => {
    sectionPad.classList.add('pad-modify');   
});

saveBtn.addEventListener('click', (e) => {
    confirmEdit.click();
    sectionPad.classList.remove('pad-modify');
});

// Pour chaque touches du piano
padBtn.forEach(btn => {
    // Assigne une couleur à chaque touche
    h = h + 39;
    actualisePadBtnColor(btn, h);

    btn.addEventListener(eventStart, (e) => {
        
        //Récupère la couleur appuyée
        let targetBtn = e.currentTarget;

        // Récupère la couleur de la touche
        let h = getColorFromAttribute(targetBtn),
            s = 100,
            l = 50;

        // LE PAD EST EN MODE "MODIFICATION"
        if (sectionPad.classList.contains('pad-modify') == true) {
            
            // Affiche et déplace le slider de modification en dessous de la touche sélectionnée
            sectionPad.classList.add('edition');
            editDiv.style.top = (targetBtn.offsetTop + editDiv.offsetHeight) + "px";
            editDivIndicator.style.left = targetBtn.offsetLeft + "px";

            // Sélection d'une couleur
            if (targetBtn.classList.contains('pad-btn-active') == false) {
                // Actualise le bouton actif
                let pastTarget = document.querySelector('.pad-btn-active');
                targetBtn.classList.add('pad-btn-active');
                pastTarget != null ? pastTarget.classList.remove('pad-btn-active') : console.log('No pastTarget');
                
                // Actualise les valeurs du slider avec la couleur actuelle du bouton
                h = getColorFromAttribute(targetBtn);
                editInput.value = h;
            }
        // LE PAD N'EST PAS EN MODE "MODIFICATION"
        }else{
            playNote(h,s,l);
            btn.addEventListener(eventEnd, (e) => {
                stopGain(defaultEase);
            });

            // Vérifie que l'on soit sur desktop et ue le bouton appuyé soit bien une touche du pad
            if (window.matchMedia("(min-width: 900px)").matches && btn.classList.contains('pad-btn')) {                    
                body.addEventListener("mouseup", (e) => {
                    stopGain(defaultEase);
                });
            }
        }
    });
    
});

// L'orsqu'un slider bouge - modifie la couleur active
editInput.addEventListener('input', (e) => {
    let h = editInput.value;
    let actualBtn = document.querySelector('.pad-btn-active');
    
    actualBtn.style.backgroundColor = "hsl("+h+", 100%, 50%)";

    playNote(h, 100, 50);
    
});

// Bouton permettant de masquer le slider et changer la variable de couleur
confirmEdit.addEventListener('click', (e) => {
    // Obligé de redéclarer les variables utilisées dans la boucle si dessus
    let actualBtn = document.querySelector('.pad-btn-active');
    let h = editInput.value;

    sectionPad.classList.remove('edition');
    actualBtn.classList.remove('pad-btn-active');
    actualisePadBtnColor(actualBtn, h);
    actualBtn.removeAttribute('style');
});

editInput.addEventListener(eventEnd, (e) => {
    stopGain(defaultEase);
});

if (window.matchMedia("(min-width: 900px)").matches) {
    randomBtn.addEventListener("mouseenter", (e) => {
        randomBtn.classList.add('hover');
        randomBtn.addEventListener('animationend', (e) => {
            randomBtn.classList.remove('hover');
        });
    });
}

randomBtn.addEventListener("click", (e) => {
    randomBtn.classList.add('spin');
    randomBtn.addEventListener('animationend', (e) => {
        randomBtn.classList.remove('spin');
    });
    let h = randomMinMax(0, 360);
    padBtn.forEach(btn => {
        h = (h + randomMinMax(30, 50)) % 360;
        actualisePadBtnColor(btn, h);
    });
});

///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
/////////////////////////// Piano /////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////

// Assiciation d'une fréquence à chaque touches
var notes = {
    "a": "160",
    "z": "175",
    "e": "190",
    "r": "205",
    "t": "220",
    "y": "235",
    "u": "250",
    "i": "265",
    "o": "280",
    "p": "290",
    "q": "305",
    "s": "320",
    "d": "335",
    "f": "350",
    "g": "365",
    "h": "380",
    "j": "390",
    "k": "405",
    "l": "420",
    "m": "435",
    "w": "450",
    "x": "465",
    "c": "480",
    "v": "490",
    "b": "505",
    "n": "520",
    ",": "535",
    ";": "550", 
    ":": "565",
    "=": "580",
    "!": "595"
};

// Récupère la touche jouée et joue la fréquence qui lui est associée
document.addEventListener('keydown', (e) => {
    let key = e.key;

    // Si la page est celle du piano clavier, on prends en compte l'appuis clavier
    if(body.getAttribute('data-page') == 'piano') {

        // Permet de ne pas répéter l'événement 'keydown' lors d'un appuis enfoncé
        if(down) return;
        down = true;

        // Si une fréquence est assigné à la touche, on la joue
        if (notes[key] != null) {
            let frq = notes[key],
                color = 0;

            // Assigne la valeur de gain et fréquence
            o.frequency.setValueAtTime(frq, context.currentTime);
            g.gain.setTargetAtTime(1, context.currentTime, 0.002);
            
            
            // Cherche une couleur correspondant à la fréquence
            do {
                h = randomMinMax(0, 360);
                s = 100;
                l = randomMinMax(45, 60);
                color = setFrequency(h, s, l);
            } while (frq != color);

            // Assignation de la couleur et d'un class de transition
            let size = randomMinMax(25, 60),
                blur = size * 3,
                top = randomMinMax(-(size/2), (100 - (size/2))),
                left = randomMinMax(-(size/2), (100 - (size/2)));

            let colorDiv = document.createElement('div');

            colorDiv.style.backgroundColor = 'hsl('+h+', '+s+'%, '+l+'%)';
            colorDiv.style.filter = 'blur('+blur+'px)';

            colorDiv.style.left = left + 'vw';
            colorDiv.style.bottom = top + 'vh';

            colorDiv.style.width = size + 'vw';
            colorDiv.style.height = size + 'vw';
            colorDiv.classList.add('piano-color-el');
            pianoColor.appendChild(colorDiv);

            // Cache le message
            pianoSvg.style.opacity = 0;


            // Lorsqu'on lâche la touche, le son s'arrête et la couleur passe au blanc
            document.addEventListener('keyup', (e) => {
                colorDiv.classList.add('piano-color-el-fadeOut');
                colorDiv.addEventListener('animationend', (e) => {
                    colorDiv.remove();
                });

                stopGain(0.2);
            
                down = false;
            }, false);
        }
    }
}, false);



///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
//////////////////////////// INFO MENU ////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////

// Ouvrir/fermer le menu
navBtnOpen.addEventListener('click', (e) => {
    nav.classList.add('open');
});
navBtnClose.addEventListener('click', (e) => {
    nav.classList.remove('open');
});

navElements.forEach(element => {
    element.addEventListener('click', (e) => {
        nav.classList.toggle('open');
    });
});

// Actualise le menu en fonction du scroll
infoSection.addEventListener('scroll', () => {
    for (let i = 0; i < anchors.length; i++) {  
        if (infoSection.scrollTop >= anchors[i].offsetTop - (window.innerHeight/2)) {
            navElements.forEach(element => {
                element.classList.remove('current');
            });
            if(navElements[i].classList.contains('current') == false) {
                navElements[i].classList.add('current');
            }
        }

    }

    if (window.matchMedia("(min-width: 900px)").matches) {
        // Peut être optimisé
        if (isCollide(nav, gist[0]) == false &&
            isCollide(nav, gist[1]) == false &&
            isCollide(nav, gist[2]) == false) {
            nav.classList.remove('hide');
        }else {
            nav.classList.add('hide')
        }
    }
});

///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////// MY FUNCTIONS ////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////

// Permet de jouer un tableau de notes sans actualiser "played color"
function playArrayWithoutColor(i, speed, gains, frqs) {
    setTimeout(function() {
        g.gain.setTargetAtTime(gains[i], context.currentTime, 0.002);
        o.frequency.setValueAtTime(frqs[i], context.currentTime);
        
        g.gain.setTargetAtTime(0, context.currentTime+0.002, speed/1500);
    }, i*speed);
}

// Permet de jouer un tableau de notes
function playArray(i, speed, gains, frqs, hsls) {
    setTimeout(function() {
        g.gain.setTargetAtTime(gains[i], context.currentTime, 0.002);
        o.frequency.setValueAtTime(frqs[i], context.currentTime);

        actualisePlayedColor(hsls[i][0], hsls[i][1], hsls[i][2], gains[i]);
        
        g.gain.setTargetAtTime(0, context.currentTime+0.002, speed/1500);
    }, i*speed);
}

// Permet de jouer une note
function playNote(h,s,l) {
    let frq = setFrequency(h,s,l),
        gain = setGain(l,s);

    g.gain.setTargetAtTime(gain, context.currentTime, 0.002);
    o.frequency.setValueAtTime(frq, context.currentTime);

    actualisePlayedColor(h, s, l, gain);
}

function actualisePlayedColor(h, s, l, gain) {
    if (window.matchMedia("(min-width: 900px)").matches) {        
        playedColors.classList.remove('hide');
        playedColors.children[0].style.backgroundColor = 'hsla('+ h +', '+ s +'%, '+ l +'%, '+gain+')';
        playedColors.children[1].style.backgroundColor = 'hsla('+ h +', '+ s +'%, '+ l +'%, '+gain+')';
    }
}

function actualisePadBtnColor(btn, h) {
    let id = btn.getAttribute('id').slice(-1);
    root.style.setProperty('--pb-'+id, h);
}

// Stop le gain et cache "played color"
function stopGain(ease) {
    g.gain.setTargetAtTime(0, context.currentTime, ease);
    playedColors.classList.add('hide');
}


// Récupère les valeurs h s et l depuis les attributs de l'élément
function getColorFromAttribute(element) {
    let id = element.getAttribute('id').slice(-1);
    let h = root.style.getPropertyValue('--pb-' + id);
    return h;
}

// Calcule le gain
function setGain(lum, sat) {
    if(lum >= 50) {
        lum = 100 - lum;
    }

    let gainValue = (sat/100)*(lum/100);
    
    gainValue = (Math.round(gainValue * 100) / 100)*2;

    return gainValue;
}

// Calcule la fréquence
function setFrequency(h, s, l) {
    
    h = Number(h);
    s = Number(s);
    l = Number(l);
    
    // Convertis la couleur HSL en RGB sans tenir compte de la saturation - celle-ci est gérée apprès
    let rgbColor = HSLtoRGB(h, 75, l);
    
    // Donne une ordre d'importance au R G et B
    frq = Math.round(rgbColor[0]*0.9 + rgbColor[1]*2 + rgbColor[2]*0.3);

    // Prise en compte de la saturation - elle influe sur le gain et s'ajoute à la valeur de la fréquence
    frq = (frq * (s/100));

    frq = Math.round(frq);

    // Empêche de descendre dans des valeurs négatives
    if (frq < 0 || s == 0 || l == 0) {
        frq = 0;
    }

    return frq;
}

// Vérifie que l'image soit chargée avant de créer la pallette
function createPalette(image) {
    if (image.complete) {
        createPaletteOnLoad(image);
    }else {
        image.addEventListener('load', function() {
            createPaletteOnLoad(image);
        });
    }
}

// Crée une pallette avec une image
function createPaletteOnLoad(image) {
    colorList.innerHTML = "";
    
    const palette = colorThief.getPalette(image, Number(colorNumber.value));
    
    for (let i = 0; i < colorNumber.value; i++) {

        let hslColor = RGBToHSL(palette[i][0], palette[i][1], palette[i][2]);
        
        // Création de la fréquence à l'interieur de la couleur
        let frequency = document.createElement('p');
        frequency.classList.add('color-list-el-frq');
        frequency.innerHTML = setFrequency(hslColor[0], hslColor[1], hslColor[2]) + "Hz";

        // Crée un élement HTML auquel il assigne la couleur
        let color = document.createElement('li');
        color.classList.add('color-list-el');
        color.style.backgroundColor = 'hsl('+ hslColor[0] +', '+ hslColor[1] +'%, '+ hslColor[2] +'%)';
        
        color.addEventListener('animationend', (e) => {
            color.classList.add('animationend');
        });

        color.appendChild(frequency);
        colorList.appendChild(color);
    }
}

function changeImageToListen(imgLink, external) {
    // animations
    imageModule.classList.add('change');
    imgToListen.addEventListener('animationend', (e) => {
        // à la fin du fadeOut on change l'image
        if(e.animationName === 'fadeOut'){
            if (external == false) {  
                backgroundImg.setAttribute('src', 'assets/images/toListen/'+ imgLink +'.jpg');
                imgToListen.setAttribute('src', 'assets/images/toListen/'+ imgLink +'.jpg');
        
                backgroundImg.setAttribute('srcset', 'assets/images/toListen/'+ imgLink +'@2x.jpg 2x');
                imgToListen.setAttribute('srcset', 'assets/images/toListen/'+ imgLink +'@2x.jpg 2x');
                imageModule.classList.remove('change');
                imageModule.classList.add('loading');  
            }else{
                backgroundImg.setAttribute('src', imgLink);
                imgToListen.setAttribute('src', imgLink);
                backgroundImg.setAttribute('srcset', "");
                imgToListen.setAttribute('srcset', "");
                imageModule.classList.remove('change');
                imageModule.classList.add('loading');
            }
        }

        if (imgToListen.complete) {
            createPaletteOnLoad(imgToListen);
            imageModule.classList.remove('loading');
            imageModule.classList.add('changeDone');
        }else {
            imgToListen.addEventListener('load', function() {
                createPaletteOnLoad(imgToListen);
                imageModule.classList.remove('loading');
                imageModule.classList.add('changeDone');
            });
        }

        // retire les classes d'animations lorsqu'elles sont terminées
        if(e.animationName === 'bounceIn'){
            imageModule.classList.remove('changeDone');
            createPalette(imgToListen);
        }
    });
}


///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////// OTHERS FUNCTIONS ////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////

//source: https://gist.github.com/brunomonteiro3/27af6d18c2b0926cdd124220f83c474d
function randomMinMax(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}

// https://codepen.io/dropinks/pen/MrzPXB
function isCollide(el1, el2) {
    var element1 = el1.getBoundingClientRect();
    var element2 = el2.getBoundingClientRect();

    return !(
        ((element1.top + element1.height) < (element2.top + 50)) ||
        (element1.top > (element2.top + element2.height - 50))
    );
}

// CSS TRICK LICENCE  -  https://css-tricks.com/license/
//source: https://css-tricks.com/converting-color-spaces-in-javascript/
//Convertit ma valeur HSL vers RGB
function HSLtoRGB(h,s,l) {

    // doit être une fraction de 1
    s /= 100;
    l /= 100;

    let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs((h / 60) % 2 - 1)),
        m = l - c/2,
        r = 0,
        g = 0,
        b = 0;


    if (0 <= h && h < 60) {
    r = c; g = x; b = 0;  
    } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
    }

    return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
}

  function RGBToHSL(r,g,b) {
    // Make r, g, and b fractions of 1
    r /= 255;
    g /= 255;
    b /= 255;
  
    // Find greatest and smallest channel values
    let cmin = Math.min(r,g,b),
        cmax = Math.max(r,g,b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;

    // Calculate hue
    // No difference
    if (delta == 0)
    h = 0;
    // Red is max
    else if (cmax == r)
    h = ((g - b) / delta) % 6;
    // Green is max
    else if (cmax == g)
    h = (b - r) / delta + 2;
    // Blue is max
    else
    h = (r - g) / delta + 4;

    h = Math.round(h * 60);
    
    // Make negative hues positive behind 360°
    if (h < 0)
    h += 360;

    // Calculate lightness
    l = (cmax + cmin) / 2;

    // Calculate saturation
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
        
    // Multiply l and s by 100
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return [Math.round(h), Math.round(s), Math.round(l)];
  }

//SMOOTH SCROLL ONLY ON ANCHOR BUTTONS - Permet de reset le scroll de la page info sans l'animation du smooth scroll
//source: https://stackoverflow.com/questions/7717527/smooth-scrolling-when-clicking-an-anchor-link
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
  
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});