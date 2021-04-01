require('vibrant.min.js');
require('vibrant.js');

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

//ECOUTE D'UNE IMAGE
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
    
    //Les rejoue à l'envers pour deux fois plus de plaisir  
    setTimeout(function() {
        frqs.reverse();
        gains.reverse();
        for(var i = 1; i < frqs.length; i++) {
            play(i);
        }
    }, (frqs.length - 1)*speed);

    
    //Arrête le son après que les couleurs aient joué deux fois
    setTimeout(function() {
        o.frequency.value = 0;
        g.gain.value = 0;
    }, ((frqs.length*2)-1)*speed);


    function play(i) {
        setTimeout(function() {
            g.gain.setValueAtTime(gains[i], context.currentTime);
            o.frequency.setValueAtTime(frqs[i], context.currentTime);

            g.gain.setTargetAtTime(0, context.currentTime, speed/1550);
        }, i*speed);
    }
});