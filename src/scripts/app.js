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
      pianoMsg = document.querySelector('.piano-msg');


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

const color = document.querySelector('.container-tolisten-color');

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

        let frq = setFrequency(colorInputs[0].value, colorInputs[1].value, colorInputs[2].value);
        let gain = setGain(colorInputs[2].value, colorInputs[1].value);

        // Défini la fréquence
        o.frequency.setValueAtTime(frq, context.currentTime);
        // Défini l'intensité
        g.gain.setValueAtTime(gain, context.currentTime);
        // Affiche la fréquence jouée
        actualNote.innerHTML = o.frequency.value + " Hz";
        
        // Affiche la valeur du slider 
        colorSpans[i].innerHTML = colorInputs[i].value;
        
        // Affiche la couleur jouée
        setColors(colorInputs[0].value, colorInputs[1].value, colorInputs[2].value);


        //Applique le bon event listenner (mouse ou touch)
        colorInputs[i].addEventListener(event('end'), (e) => {
            g.gain.setTargetAtTime(0, context.currentTime, 0.3);
        });
    });
};



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
        let hslColor = getHslFromAttribute(targetBtn);
        
        // Défini le gain et la fréquence
        let frq = setFrequency(hslColor[0], hslColor[1], hslColor[2]),
            gain = setGain(hslColor[2], hslColor[1]);
        
        g.gain.setValueAtTime(gain, context.currentTime);
        o.frequency.setValueAtTime(frq, context.currentTime);
        
        // Si la modification est désactivée - ajoute la class active et coupe le son à la fin de l'event
        if (sectionPiano.classList.contains('pad-modify') == false) {
            btn.addEventListener(event('end'), (e) => {
                g.gain.setTargetAtTime(0, context.currentTime, 0.1);
            });
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
        let t = pianoFormInput[0].value,
            s = pianoFormInput[1].value,
            l = pianoFormInput[2].value;

        pianoFormSpan[i].innerHTML = pianoFormInput[i].value;
        
        let actualBtn = document.querySelector('.pad-btn-active');
        let hexColor = HSLToHex(t, s, l);
        
        // Actualise la couleur du bouton
        actualisePadBtnColor(actualBtn, hexColor);
        
        // Défini le gain et la fréquence
        let frq = setFrequency(t, s, l),
            gain = setGain(l, s);

        o.frequency.setValueAtTime(frq, context.currentTime);
        g.gain.setValueAtTime(gain, context.currentTime);

        pianoFormInput[i].addEventListener(event('end'), (e) => {
            g.gain.setTargetAtTime(0, context.currentTime, 0.1);
        });
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

var t = 0,
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
            g.gain.setValueAtTime(1, context.currentTime);
                
            // Cherche une couleur correspondant à la fréquence
            do {
                t = randomMinMax(0, 360);
                s = 100;
                l = randomMinMax(50, 60);
                color = setFrequency(t, s, l);
            } while (frq != color);

            // Convertis la couleur en hexadécimal pour l'assigner
            let hexColor = HSLToHex(t, s, l);

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
    g.gain.setTargetAtTime(0, context.currentTime, 0.1);

    down = false;
}, false);



///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////// ECOUTE D'UNE IMAGE //////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////

// Require de vibrant
require('../scripts/vibrant.js');
require("node-vibrant");


// VARIABLES
var speed = 150;
const playRate = document.getElementById('playRate'),
      playRateSpan = document.getElementById('playRateSpan');

const playImageBtn = document.getElementById('getColors'),
      imgToListen = document.querySelector('.img'),
      btnUpload = document.getElementById('uploadBtn'),
      btnOpenSelection = document.getElementById('btnOpenSelection'),
      imageSelection = document.querySelectorAll('.selection-image-el'),
      inputUpload = document.getElementById('uploadInput'),
      colorList = document.querySelector('.color-list'),
      backgroundImg = document.querySelector('.container-img');


// Affiche le bon message en fonction du device
let deviceAction2 = window.matchMedia("(min-width: 900px)").matches ? "mon explorateur de fichiers" : "ma galerie";
btnUpload.innerHTML = "Ouvrir " + deviceAction2;

// Réglage de la vitesse de lecture
playRate.addEventListener('input', (e) => {
    speed = playRate.value * -1;
    playRateSpan.innerHTML = playRate.value * -1;
});

// Présélectionne une image
imageSelection[0].classList.add('selected');

// Ouvre la sélection
btnOpenSelection.addEventListener('click', (e) => {
    btnOpenSelection.classList.toggle('selection-open');
});

// Change l'image avec l'image sélectionnée
imageSelection.forEach(image => {
    image.addEventListener('click', (e) => {
        let pastTarget = document.querySelector('.selected');
        if (pastTarget != null) {
            pastTarget.classList.remove('selected');
        }

        let currentTarget = e.currentTarget;
        if (currentTarget != null) {
            currentTarget.classList.add('selected');
        }


        let imgLink = currentTarget.children[0].currentSrc;
                
        backgroundImg.src = imgLink;
        imgToListen.src = imgLink;
    });
});



// Upload d'une image
btnUpload.addEventListener('click', (e) => {
     inputUpload.click();
     //Actualise l'image uploadée
     inputUpload.addEventListener('change', (e) => {
        let pastTarget = document.querySelector('.selected')
        pastTarget.classList.remove('selected');

        let imgLink = URL.createObjectURL(e.target.files[0]);
        backgroundImg.src = imgLink;
        imgToListen.src = imgLink;
     });
});

//Récupère les couleurs de l'image et les joue
playImageBtn.addEventListener('click', (e) => {
    colorList.innerHTML = "";

    let vibrant = new Vibrant(imgToListen);
    let colors = vibrant.swatches();

    let gains = [],
        frqs = [];

    for (var color in colors){
        if (colors.hasOwnProperty(color) && colors[color]){
            
            //Affiche la couleur dans le html
            var li = document.createElement('li');
            li.classList.add('color-list-el');
            li.style.backgroundColor = colors[color].getHex();
            colorList.appendChild(li);
            
            //Récupère les couleurs RGB (getHsl donne des valeurs inutilisable) - pour la fréquence
            let rgbColor = colors[color].getRgb();
        
            //Récupère les couleurs HSL - pour le gain
            let hslColor = RGBToHSL(rgbColor[0], rgbColor[1], rgbColor[2]);
            
            //Récupère une fréquence pour chaque couleurs
            let frq = setFrequency(hslColor[0], hslColor[1], hslColor[2])
            frqs.push(frq);
            
            //crée et récupère un gain
            let gain = setGain(hslColor[1], hslColor[2]);
            gains.push(gain);
        }
    }

    
    //Joue chaque paramètre les uns après les autres
    for(var i = 0; i < frqs.length; i++) {
        play(i);
    }
    
    //Les rejoue à l'envers pour deux fois plus de plaisir ( ͡° ͜ʖ ͡°)
    setTimeout(function() {
        frqs.reverse();
        gains.reverse();
        for(var i = 1; i < frqs.length; i++) {
            play(i);
        }
    }, (frqs.length - 1)*speed);


    function play(i) {
        setTimeout(function() {
            g.gain.setValueAtTime(gains[i], context.currentTime);
            o.frequency.setValueAtTime(frqs[i], context.currentTime);

            g.gain.setTargetAtTime(0, context.currentTime, speed/1550);
        }, i*speed);
    }
});


///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////// MY FUNCTIONS ////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////

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

    //Si couleur invisible -> son 0
    if(lum == 0 || lum == 100 || sat == 0) {
        gainValue = 0.0001;
    }

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


