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



///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////// START API ///////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////

// Variables

const beginBtn = document.querySelector('.section-intro'),
      message = document.querySelector('.section-intro-msg');
  
// Affiche le bon message en fonction du device
let deviceAction = window.matchMedia("(min-width: 900px)").matches ? "Cliquez" : "Appuyez";
message.innerHTML = deviceAction + " pour commencer.";

// Lance l'API et fade out la section d'introdution
beginBtn.addEventListener('click', (e) => {
    o.start(0);
    gsap.to(beginBtn, {opacity: 0, onComplete: hide, onCompleteParams: [beginBtn]});
});


///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////// GESTION DU SLIDER ///////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////

// VARIABLES
const body = document.querySelector('body'),
      sliderBtn = document.querySelectorAll('.menu-btn'),
      pianoMsg = document.querySelector('.piano-msg'),
      infoSection = document.querySelector('.section-info');


sliderBtn.forEach(element => {
    element.addEventListener('click', (e) => {
        let target = e.currentTarget;
        
        let page = target.getAttribute('id');
        body.setAttribute('data-page', page);

        // Refais apparaître le message du piano
        if (page != "piano") {
            pianoMsg.style.opacity = "1";
            pianoMsg.style.display = "inherit";
        }

        // Reset le scroll de la page malgré l'ancre
        if (page == "info") {
            infoSection.scrollTop = 0;
            console.log('ok');
        }
    });
});

///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////// ECOUTE D'UNE COULEUR ////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////

// VARIABLES
var colorInput = document.querySelectorAll('.colorInput'),
    colorSpan = document.querySelectorAll('.colorSpan'),
    actualNote = document.getElementById('playedColor');

const color = document.getElementById('module-color');

var colorInputs = [],
    colorSpans = [];

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

        let frq = setFrequency(h, s, l);
        let gain = setGain(l, s);

        actualiseListenerColor(h,s,l ,gain)

        // Défini la fréquence
        o.frequency.setValueAtTime(frq, context.currentTime);
        // Défini l'intensité
        g.gain.setTargetAtTime(gain, context.currentTime, 0.002);
        // Affiche la fréquence jouée
        actualNote.innerHTML = o.frequency.value + " Hz";
        
        // Affiche la valeur du slider 
        colorSpans[i].innerHTML = colorInputs[i].value;
        
        // Affiche la couleur jouée
        setColors(h, s, l);

        stopGain(colorInputs[i]);
    });
};



///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////// ECOUTE D'UNE IMAGE //////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////


// VARIABLES
var speed = 120;
const playRate = document.getElementById('playRate'),
      playRateSpan = document.getElementById('playRateSpan'),
      colorNumberSpan = document.getElementById('colorNumberSpan'),
      colorNumber = document.getElementById('colorNumber');

const playImageBtn = document.getElementById('getColors'),
      imgToListen = document.querySelector('.img'),
      btnUpload = document.getElementById('uploadBtn'),
      btnOpenSelection = document.getElementById('btnOpenSelection'),
      imageSelection = document.querySelectorAll('.selection-image-el'),
      inputUpload = document.getElementById('uploadInput'),
      colorList = document.querySelector('.color-list'),
      backgroundImg = document.querySelector('.container-img');

const colorThief = new ColorThief();

// Affiche le bon message en fonction du device
let deviceAction2 = window.matchMedia("(min-width: 900px)").matches ? "mon explorateur de fichiers" : "ma galerie";
btnUpload.innerHTML = "Ouvrir " + deviceAction2;

// Réglage de la vitesse de lecture
playRate.addEventListener('input', (e) => {
    speed = playRate.value * -1;
    playRateSpan.innerHTML = playRate.value * -1;
});

// Réglage du nombre de couleurs
colorNumber.addEventListener('input', (e) => {
    colorNumberSpan.innerHTML = colorNumber.value;
});

// Présélectionne une image
imageSelection[0].classList.add('selected');

// Crée la palette de l'image présélectionnée
// S'assure que l'image est chargée
createPalette(imgToListen);

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
        let imgName = currentTarget.children[0].currentSrc.slice(-13);
        imgName = imgName.slice(0, imgName.length - 4);


        backgroundImg.setAttribute('src', 'assets/images/toListen/'+ imgName +'.jpg');
        imgToListen.setAttribute('src', 'assets/images/toListen/'+ imgName +'.jpg');

        backgroundImg.setAttribute('srcset', 'assets/images/toListen/'+ imgName +'@2x.jpg 2x');
        imgToListen.setAttribute('srcset', 'assets/images/toListen/'+ imgName +'@2x.jpg 2x');
        createPalette(imgToListen);
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
        console.log(imgLink);
        backgroundImg.setAttribute('srcset', imgLink);
        imgToListen.setAttribute('srcset', imgLink);

        createPalette(imgToListen);
     });
});

//Récupère les couleurs de l'image et les joue
playImageBtn.addEventListener('click', (e) => {
    colorList.innerHTML = "";

    let gains = [],
        frqs = [],
        hsls = [];
    
    let palette = colorThief.getPalette(imgToListen, Number(colorNumber.value));

    for (let i = 0; i < palette.length; i++) {

        let hslColor = RGBToHSL(palette[i][0], palette[i][1], palette[i][2]);

        let h = hslColor[0],
            s = hslColor[1],
            l = hslColor[2];           
        
        // Crée un élement HTML auquel il assigne la couleur
        let color = document.createElement('li');
        color.classList.add('color-list-el');
        color.style.backgroundColor = "hsl("+ h +", "+ s +"%, "+ l +"%)";
        
        colorList.appendChild(color);

        // Génère un gain et une fréquence pour chaque couleur
        let gain = setGain(l, s);
        let frq = setFrequency(h, s, l);

        gains.push(gain);
        frqs.push(frq);
        hsls.push(hslColor);
    }
    
    //Joue chaque paramètre les uns après les autres
    for(var i = 0; i < frqs.length; i++) {
        play(i);
        setTimeout(() => {
            stopGain();
        }, frqs.length * speed);
    }
    
    function play(i) {
        setTimeout(function() {
            g.gain.setTargetAtTime(gains[i], context.currentTime, 0.002);
            o.frequency.setValueAtTime(frqs[i], context.currentTime);
            actualiseListenerColor(hsls[i][0],hsls[i][1],hsls[i][2] ,gains[i])
            
            g.gain.setTargetAtTime(0, context.currentTime+0.002, speed/1500);
        }, i*speed);
    }
});



///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
////////////////////////////// PAD ////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////

// Variables
const pianoBtn = document.querySelectorAll('.pad-btn'),

      tuto = document.querySelector('.pad-tuto'),
      closeTuto = document.getElementById('closeTuto'),
  
      sectionPiano = document.querySelector('.section-pad'),
      pianoFormInput = document.querySelectorAll('.padInput'),
      pianoFormSpan = document.querySelectorAll('.padSpan'),
      editBtn = document.querySelector('.btn-edit'),
      saveBtn = document.querySelector('.btn-save');

var root = document.documentElement;

var btnColors = [];

// Assigne une couleur légèrement aléatoire à chaque touche (chacune compris dans une transche de 40 deg)
var h = 0;
pianoBtn.forEach(btn => {
    h = h + 40;
    let btnColor = HSLToHex(randomMinMax(h, h - 40), 100, 50);
    actualisePadBtnColor(btn, btnColor);
});

// Permets de rentrer en mode "modification" des boutons 
editBtn.addEventListener('click', (e) => {

    // Montre le tuto
    tuto.classList.add('show-tuto');

    // Cache le tuto à jamais   
    closeTuto.addEventListener('click', (e) => {
        gsap.to(tuto, {duration: 0.3, opacity: 0, onComplete: hide, onCompleteParams: [tuto]});
    });

    // Sélectionne la première touche par défaut
    sectionPiano.classList.add('pad-modify');   
    pianoBtn[0].classList.add('pad-btn-active');
    let hslColor = getHslFromAttribute(pianoBtn[0]);
    for (let i = 0; i < pianoFormInput.length; i++) {
        pianoFormInput[i].value = hslColor[i];
        pianoFormSpan[i].innerHTML = hslColor[i];
    }
});

saveBtn.addEventListener('click', (e) => {
    sectionPiano.classList.remove('pad-modify');
    pianoBtn.forEach(btn => {
        btn.classList.remove('pad-btn-active');
    });
});

// Pour chaque touches du piano
pianoBtn.forEach(btn => {
    btn.addEventListener(event('start'), (e) => {
        let targetBtn = e.currentTarget;

        
        // Convertis les valeurs rgb en tsl pour les rendre utilisable par mes fonctions
        let hslColor = getHslFromAttribute(targetBtn),
            h = hslColor[0],
            s = hslColor[1],
            l = hslColor[2];

        // Défini le gain et la fréquence
        let frq = setFrequency(h, s, l),
            gain = setGain(l, s);

        actualiseListenerColor(h,s,l, gain);
        
        g.gain.setTargetAtTime(gain, context.currentTime, 0.002);
        o.frequency.setValueAtTime(frq, context.currentTime);
        
        // Si la modification est désactivée - ajoute la class active et coupe le son à la fin de l'event
        if (sectionPiano.classList.contains('pad-modify') == false) {
            stopGain(btn);
        } else {
            g.gain.setTargetAtTime(0, context.currentTime+0.1, 0.3);
        }
    });
});

//Si le piano est en mode "modification"
pianoBtn.forEach(btn => {
    btn.addEventListener('click', (e) => {
        if (sectionPiano.classList.contains('pad-modify') == true) {
            //Récupère la couleur appuyée
            let targetBtn = e.currentTarget;
            
            // Dans le cas ou l'utilisateur re sélectionne la couleur active
            if (targetBtn.classList.contains('pad-btn-active') == true) {
                console.log('pas de double sélection possible');
            // Si il sélectionne une autre couleur
            }else{
                let pastTarget = document.querySelector('.pad-btn-active');

                // Actualise le bouton actif
                targetBtn.classList.add('pad-btn-active');
                pastTarget.classList.remove('pad-btn-active');

                let hslColor = getHslFromAttribute(targetBtn);
                
                // Récupère les couleurs tsl depuis l'attibut style du boutton
                hslColor = getHslFromAttribute(targetBtn);
                btnColors.push(hslColor);

                // Actualise les valeurs du slider avec la couleur actuelle du bouton
                for (let i = 0; i < pianoFormInput.length; i++) {
                    pianoFormInput[i].value = hslColor[i];
                    pianoFormSpan[i].innerHTML = hslColor[i];
                }

            }
        }
    });
});


// L'orsqu'un slider bouge - modifie la couleur active
for (let i = 0; i < pianoFormInput.length; i++) {
    pianoFormInput[i].addEventListener('input', (e) => {
        let h = pianoFormInput[0].value,
            s = pianoFormInput[1].value,
            l = pianoFormInput[2].value;

        pianoFormSpan[i].innerHTML = pianoFormInput[i].value;
        
        let actualBtn = document.querySelector('.pad-btn-active');
        let hexColor = HSLToHex(h, s, l);
        
        // Actualise la couleur du bouton
        actualisePadBtnColor(actualBtn, hexColor);

        
        // Défini le gain et la fréquence
        let frq = setFrequency(h, s, l),
        gain = setGain(l, s);
        
        o.frequency.setValueAtTime(frq, context.currentTime);
        g.gain.setTargetAtTime(gain, context.currentTime, 0.002);
    })
}


///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
/////////////////////////// Piano/// //////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////


// Empêche le "keydown" event de se répéter lorsqu'on maintiens la touche
// https://stackoverflow.com/questions/17514798/how-to-disable-repetitive-keydown-in-javascript

// Variables
const pianoColor = document.querySelector('.piano-color');

var h = 0,
    s = 0,
    l = 0,
    down = false;
    
// Assiciation d'une fréquence à chaque touches
var notes = {
    "a": "150",
    "z": "170",
    "e": "190",
    "r": "210",
    "t": "230",
    "y": "250",
    "u": "270",
    "i": "290",
    "o": "310",
    "p": "330",
    "q": "350",
    "s": "370",
    "d": "390",
    "f": "410",
    "g": "430",
    "h": "450",
    "j": "470",
    "k": "490",
    "l": "510",
    "m": "530",
    "w": "550",
    "x": "570",
    "c": "590",
    "v": "610",
    "b": "630",
    "n": "650",
    ",": "670",
    ";": "690", 
    // De plus hautes fréquences ne sont pas associable avec les paramètres de couleur actuels
    ":": "690",
    "=": "690"};

// Récupère la touche jouée et joue la fréquence qui lui est associée
document.addEventListener('keydown', (event) => {
    let key = event.key;

    // Si la page est celle du piano clavier, on prends en compte l'appuis clavier
    if(body.getAttribute('data-page') == "piano") {

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
                l = randomMinMax(50, 60);
                color = setFrequency(h, s, l);
            } while (frq != color);
            

            // Convertis la couleur en hexadécimal pour l'assigner
            let hexColor = HSLToHex(h, s, l);

            // Assignation de la couleur et d'un class de transition
            pianoColor.style.backgroundColor = hexColor;
            pianoColor.classList.add('piano-color-active');

            // Cache le message
            gsap.to(pianoMsg, {duration: 0.3, opacity: 0, onComplete: hide, onCompleteParams: [pianoMsg]});
        }
    }
}, false);

// Lorsqu'on lâche la touche, le son s'arrête et la couleur passe au blanc
document.addEventListener('keyup', (event) => {
    pianoColor.classList.remove('piano-color-active');
    pianoColor.style.backgroundColor = "#fff";
    
    stopGain();

    down = false;
}, false);


///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
//////////////////////////// INFO MENU ////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////

const navBtnOpen = document.querySelector('.nav-btn-open'),
      navBtnClose = document.querySelector('.nav-btn-close'),
      nav = document.getElementById('nav'),
      gist = document.querySelectorAll('.container-code .gist'),
      anchors = document.querySelectorAll('.anchor'),
      navElements = document.querySelectorAll('.navigation-list-el');

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

///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////// MY FUNCTIONS ////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////

const playedColors = document.querySelector('.played');
function actualiseListenerColor(h,s,l ,gain) {
    let color = HSLtoRGB(h,s,l),
        r = color[0],
        g = color[1],
        b = color[2];
    playedColors.classList.remove('hide');
    root.style.setProperty('--played-color', 'rgba('+ r +', '+ g +', '+ b +', '+gain+')');
}

function stopGain(elementToListen) {
    if (elementToListen == "" || elementToListen == null || elementToListen == undefined) {
        g.gain.setTargetAtTime(0, context.currentTime, 0.3);
        playedColors.classList.add('hide');
    }else{
        elementToListen.addEventListener(event('end'), (e) => {
            g.gain.setTargetAtTime(0, context.currentTime, 0.3);
            playedColors.classList.add('hide');
        });
    }
}

function createPalette(image) {
    if (image.complete) {
        createPaletteOnLoad(image);
    }else {
        image.addEventListener('load', function() {
            createPaletteOnLoad(image);
        });
    }
}

function createPaletteOnLoad(image) {
    colorList.innerHTML = "";
    const palette = colorThief.getPalette(image, Number(colorNumber.value));
    
    for (let i = 0; i < palette.length; i++) {
    
        let hslColor = RGBToHSL(palette[i][0], palette[i][1], palette[i][2]);
    
        let h = hslColor[0],
            s = hslColor[1],
            l = hslColor[2];           
        
        // Crée un élement HTML auquel il assigne la couleur
        let color = document.createElement('li');
        color.classList.add('color-list-el');
        color.style.backgroundColor = "hsl("+ h +", "+ s +"%, "+ l +"%)";
        
        colorList.appendChild(color);
    }
}

function actualisePadBtnColor(btn, color) {
    btn.style.backgroundColor = color;
    let id = btn.getAttribute('id').slice(-1);
    root.style.setProperty('--pad-btn-color-'+id, color);
}

function getHslFromAttribute(element) {
    //récupère les nombres (t, s et l) de l'attribu background-color
    let rgbColor = element.getAttribute('style').match(/\d+/g).map(Number);
                
    // Convertis les valeurs rgb en tsl pour les rendre utilisable par mes fonctions
    return RGBToHSL(rgbColor[0], rgbColor[1], rgbColor[2]);
}

//source: https://gist.github.com/brunomonteiro3/27af6d18c2b0926cdd124220f83c474d
function randomMinMax(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}

function deleteElement(element) {
    element.remove();
}

function hide(element) {
    element.style.display = "none";
}

function setColors(h, s, l) {
    h = Number(h);
    l = Number(l);
    
    let h2 = h+20,
        l2 = l-5;

    h2 = h2 > 359 ? 359 : h2;
    l2 = l2 < 0 ? 0 : l2;

    let color1 = HSLToHex(h, s, l),
        color2 = HSLToHex(h2, s, l2);

    //if(h2 > 360) {h2 = 360}
    color.setAttribute(
        'style',
        "background: linear-gradient("
        +color1+", "
        +color2+")"
    );
}

// Calcule le gain
function setGain(lum, sat) {
    //Si la couleur est lumineuse, alors le son s'estompe également
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
    let rgbColor = HSLtoRGB(h, 80, l);
    
    // Donne une ordre d'importance au R G et B
    frq = Math.round(rgbColor[0]*0.9 + rgbColor[1]*2 + rgbColor[2]*0.3);

    // Prise en compte de la saturation - elle influe sur le gain et s'ajoute à la valeur de la fréquence
    frq = frq - 100 + s;

    frq = Math.round(frq);

    // Empêche de descendre dans des valeurs négatives
    if (frq < 0) {
        frq = 0;
    }

    return frq;
}

// Défini la bon event à écouter - touch ou mouse
function event(param) {
    let event;
    if (window.matchMedia("(min-width: 900px)").matches) {
        // Desktop - mouseevent
        if(param == 'start') {
            event = 'mousedown';
        }else if(param == 'end'){
            event = 'mouseup';
        }
    } else {
        // Tablet - touchevent
        if(param == 'start') {
            event = 'touchstart';
        }else if(param == 'end'){
            event = 'touchend';
        }
    }
    return event;
}




///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////// OTHERS FUNCTIONS ////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////

// https://codepen.io/dropinks/pen/MrzPXB
function isCollide(el1, el2) {
    var element1 = el1.getBoundingClientRect();
    var element2 = el2.getBoundingClientRect();

    return !(
        ((element1.top + element1.height) < (element2.top + 50)) ||
        (element1.top > (element2.top + element2.height - 50))
    );
}

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

function HSLToHex(h,s,l) {
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
    // Having obtained RGB, convert channels to hex
    r = Math.round((r + m) * 255).toString(16);
    g = Math.round((g + m) * 255).toString(16);
    b = Math.round((b + m) * 255).toString(16);
  
    // Prepend 0s, if necessary
    if (r.length == 1)
      r = "0" + r;
    if (g.length == 1)
      g = "0" + g;
    if (b.length == 1)
      b = "0" + b;
  
    return "#" + r + g + b;
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

    return [h, s, l];
  }