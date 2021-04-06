"use strict";

// Création d'un oscillateur et gain avec la web audio API
window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var myBuffer;

var request = new XMLHttpRequest();
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

const beginBtn = document.querySelector('.section-intro');

beginBtn.addEventListener('click', (e) => {
    o.start(0);
    gsap.to(beginBtn, {opacity: 0, onComplete: hide, onCompleteParams: [beginBtn]});
});

function hide(element) {
    element.style.display = "none";
}


///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////// GESTION DU SLIDER ///////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////

// VARIABLES
const body = document.querySelector('body'),
      sliderBtn = document.querySelectorAll('.menu-btn');

sliderBtn.forEach(element => {
    element.addEventListener('click', (e) => {
        let target = e.currentTarget;
        
        let page = target.getAttribute('id');
        body.setAttribute('data-page', page);
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
////////////////////////////// PIANO //////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////

// Variables
const pianoBtn = document.querySelectorAll('.piano-btn'),
      bgColors = document.querySelectorAll('.bg-color'),
  
      sectionPiano = document.querySelector('.section-piano'),
      pianoFormInput = document.querySelectorAll('.pianoInput'),
      pianoFormSpan = document.querySelectorAll('.pianoSpan'),
      editBtn = document.querySelector('.btn-edit'),
      saveBtn = document.querySelector('.btn-save');

var btnColors = [];

// Assigne une couleur aléatoire à chaque touche (tons bleu)
pianoBtn.forEach(btn => {
    let btnColor = [randomMinMax(120, 250), randomMinMax(80, 90), randomMinMax(50, 70)];
    btn.style.backgroundColor = 'hsl('+btnColor[0]+', '+btnColor[1]+'%, '+btnColor[2]+'%)';
});

// Reporte les couleurs aléatoires au bg
for (let i = 0; i < pianoBtn.length; i++) {
    let color = getHslFromAttribute(pianoBtn[i]);
    bgColors[i].style.backgroundColor = 'hsl('+color[0]+', '+color[1]+'%, '+color[2]+'%)';
}

// Permets de rentrer en mode "modification" des boutons 
editBtn.addEventListener('click', (e) => {
    // Sélectionne la première touche par défaut
    sectionPiano.classList.add('piano-modify');   
    pianoBtn[0].classList.add('piano-btn-active');
    let hslColor = getHslFromAttribute(pianoBtn[0]);
    for (let i = 0; i < pianoFormInput.length; i++) {
        pianoFormInput[i].value = hslColor[i];
        pianoFormSpan[i].innerHTML = hslColor[i];
    }
});

saveBtn.addEventListener('click', (e) => {
    sectionPiano.classList.remove('piano-modify');
    pianoBtn.forEach(btn => {
        btn.classList.remove('piano-btn-active');
    });
});

// Pour chaque touches du piano
pianoBtn.forEach(btn => {
    btn.addEventListener(event('start'), (e) => {
        let targetBtn = e.currentTarget;
        
        // Applique la couleur sur le BG
        let bgNum = targetBtn.getAttribute('id').slice(4);
        let bgToEdit = document.getElementById('bg-'+bgNum);
        
        // Convertis les valeurs rgb en tsl pour les rendre utilisable par mes fonctions
        let hslColor = getHslFromAttribute(targetBtn);
        
        // jouer les sons des couleuirs
        let frq = setFrequency(hslColor[0], hslColor[1], hslColor[2]);
        let gain = setGain(hslColor[2], hslColor[1]);
        
        g.gain.setValueAtTime(gain, context.currentTime);
        o.frequency.setValueAtTime(frq, context.currentTime);
        
        // Si la modification est désactivée - ajoute la class active et coupe le son à la fin de l'event
        if (sectionPiano.classList.contains('piano-modify') == false) {
            bgToEdit.classList.add('bg-color-active');
            btn.addEventListener(event('end'), (e) => {
                g.gain.setTargetAtTime(0, context.currentTime, 0.1);
                bgToEdit.classList.remove('bg-color-active');
            });
        } else {
            g.gain.setTargetAtTime(0, context.currentTime+0.1, 0.3);
        }
    });
});

//Si le piano est en mode "modification"
pianoBtn.forEach(btn => {
    btn.addEventListener('click', (e) => {
        if (sectionPiano.classList.contains('piano-modify') == true) {
            //Récupère la couleur appuyée
            let targetBtn = e.currentTarget;
            
            // Dans le cas ou l'utilisateur re sélectionne la couleur active
            if (targetBtn.classList.contains('piano-btn-active') == true) {
                console.log('pas de double sélection possible');
            // Si il sélectionne une autre couleur
            }else{
                let pastTarget = document.querySelector('.piano-btn-active');

                // Actualise le bouton actif
                targetBtn.classList.add('piano-btn-active');
                pastTarget.classList.remove('piano-btn-active');

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
        
        let actualBtn = document.querySelector('.piano-btn-active');
        actualBtn.style.backgroundColor = 'hsl('+t+', '+s+'%, '+l+'%)';
        
        // Applique la couleur sur le BG
        let bgNum = actualBtn.getAttribute('id').slice(4),
            bgToEdit = document.getElementById('bg-'+bgNum);

        bgToEdit.style.backgroundColor = 'hsl('+t+', '+s+'%, '+l+'%)';
        
        // Donne un aperçu du son de la couleur
        let frq = setFrequency(t, s, l),
            gain = setGain(l, s);
        // Défini la fréquence
        o.frequency.setValueAtTime(frq, context.currentTime);
        // Défini l'intensité
        g.gain.setValueAtTime(gain, context.currentTime);


        pianoFormInput[i].addEventListener(event('end'), (e) => {
            g.gain.setTargetAtTime(0, context.currentTime, 0.1);
        });
    })
}





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
      inputUpload = document.getElementById('uploadInput'),
      colorList = document.querySelector('.color-list'),
      backgroundImg = document.querySelector('.container-img');



// Réglage de la vitesse de lecture

playRate.addEventListener('input', (e) => {
    speed = playRate.value * -1;
    playRateSpan.innerHTML = playRate.value * -1;
});

// Upload d'une image
btnUpload.addEventListener('click', (e) => {
     inputUpload.click();
     //Actualise l'image uploadée
     inputUpload.addEventListener('change', (e) => {
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
    let rgbColor = HSLtoRGB(h, 60, 60);

    h = Number(h);
    s = Number(s);
    l = Number(l);

    frq = Math.round(rgbColor[0]*0.9 + rgbColor[1]*1.7 + rgbColor[2]*0.4);

    frq = frq + Math.round(s/2) + Math.round(l/4) - 100;

    return frq;
}

// Défini la bon event à écouter
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


