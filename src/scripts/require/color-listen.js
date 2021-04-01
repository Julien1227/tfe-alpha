// VARIABLES
const colorInput = document.querySelectorAll('.colorInput'),
    colorSpan = document.querySelectorAll('.colorSpan'),
    actualNote = document.getElementById('playedColor'),
    input = document.querySelectorAll('.colorIpnut');

const color = document.querySelector('.container-tolisten-color');

var colorInputs = [],
colorSpans = [];

// COULEUR
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
        
        // Affiche la fréquence jouée
        actualNote.innerHTML = o.frequency.value + " Hz";
        
        // Affiche la valeur du slider 
        colorSpans[i].innerHTML = colorInputs[i].value;

        // Défini la fréquence
        o.frequency.setValueAtTime(frq, context.currentTime);
        
        // Défini l'intensité
        g.gain.setValueAtTime(gain, context.currentTime);
        
        // Affiche la couleur jouée
        setColors(color, colorInputs[0].value, colorInputs[1].value, colorInputs[2].value);


        // Applique le bon event listenner (mouse ou touch) pour faire un fondu du son
        if (window.matchMedia("(min-width: 900px)").matches) {
            // Desktop
            colorInputs[i].addEventListener('mouseup', (e) => {
                g.gain.setTargetAtTime(0, context.currentTime, 0.3);
            });
        } else {
            // Tablet - mobile
            colorInputs[i].addEventListener('touchend', (e) => {
                g.gain.setTargetAtTime(0, context.currentTime, 0.3);
            });
        }
    });
};

function setColors(element, h, s, l) {
    h = Number(h);
    l = Number(l);
    
    let h2 = h+20,
        l2 = l-5;

    h2 = h2 > 359 ? 359 : h2;
    l2 = l2 < 0 ? 0 : l2;

    let color1 = HSLToHex(h, s, l),
        color2 = HSLToHex(h2, s, l2);

    //if(h2 > 360) {h2 = 360}
    element.setAttribute(
        'style',
        "background: linear-gradient("
        +color1+", "
        +color2+")"
    );
}