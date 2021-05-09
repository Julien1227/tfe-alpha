/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/scripts/app.js":
/*!****************************!*\
  !*** ./src/scripts/app.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

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
var root = document.documentElement; // Défini la bon event à écouter - touch ou mouse

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
} ///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////// VARIABLES ///////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
//////////////////////////////////////
//////////// INTRODUCTION ////////////
//////////////////////////////////////


var startBtn = document.getElementById('begin'),
    sectionIntro = document.querySelector('.section-intro'),
    letters = document.querySelectorAll('.h1-letter');
var count = 1;
var randomColorstart = randomMinMax(0, 120);
var playedColors = document.querySelector('.played-color'); //////////////////////////////////////
///////// GESTION DU SLIDER //////////
//////////////////////////////////////

var body = document.querySelector('body'),
    navBtn = document.querySelectorAll('.section-header-creditBtn, .menu-btn'),
    pianoMsg = document.querySelector('.section-piano-msg'),
    infoSection = document.querySelector('.section-info'),
    colorBtn = document.querySelector('.menu-btn[id="color"]'),
    creditBtn = document.querySelectorAll('.section-header-creditBtn'),
    closeCreditBtn = document.getElementById('.closeCreditSection'); //////////////////////////////////////
//////// ECOUTE D'UNE COULEUR ////////
////////////////////////////////////// 

var colorInput = document.querySelectorAll('.colorInput'),
    colorSpan = document.querySelectorAll('.colorSpan'),
    actualNote = document.getElementById('playedColor');
var color = document.getElementById('module-color');
var colorInputs = [],
    colorSpans = []; //////////////////////////////////////
//////// ECOUTE D'UNE IMAGE //////////
//////////////////////////////////////

var speed = 120;
var playRate = document.getElementById('playRate'),
    playRateSpan = document.getElementById('playRateSpan'),
    colorNumberSpan = document.getElementById('colorNumberSpan'),
    colorNumber = document.getElementById('colorNumber');
var playImageBtn = document.getElementById('getColors'),
    imgToListen = document.querySelector('.img'),
    imageModule = document.querySelector('.section-image .module'),
    btnUpload = document.getElementById('uploadBtn'),
    btnOpenSelection = document.getElementById('btnOpenSelection'),
    imageSelection = document.querySelectorAll('.selection-image-el'),
    inputUpload = document.getElementById('uploadInput'),
    colorList = document.querySelector('.color-list'),
    backgroundImg = document.querySelector('.container-img');
var colorThief = new ColorThief(); //////////////////////////////////////
//////////////// PAD /////////////////
////////////////////////////////////// 

var pianoBtn = document.querySelectorAll('.pad-btn'),
    tuto = document.querySelector('.pad-tuto'),
    closeTuto = document.getElementById('closeTuto'),
    confirmEdit = document.getElementById('confirmEdit'),
    editBtn = document.querySelector('.btn-edit'),
    editDiv = document.querySelector('.edit'),
    editDivIndicator = document.querySelector('.edit-indicator'),
    saveBtn = document.querySelector('.btn-save'),
    editInput = document.querySelector('.edit-slider'),
    sectionPiano = document.querySelector('.section-pad');
var btnColors = [];
var h = 0; //////////////////////////////////////
////////////// PIANO /////////////////
////////////////////////////////////// 

var pianoColor = document.querySelector('.section-piano-color');
var h = 0,
    s = 0,
    l = 0,
    down = false; //////////////////////////////////////
////NAVIGATION DE LA SECTION INFO/////
//////////////////////////////////////

var navBtnOpen = document.querySelector('.nav-btn-open'),
    navBtnClose = document.querySelector('.nav-btn-close'),
    nav = document.getElementById('nav'),
    gist = document.querySelectorAll('.container-code .gist'),
    anchors = document.querySelectorAll('.anchor'),
    navElements = document.querySelectorAll('.navigation-list-el'); ///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
////////////////// INTRODUCTION + START API ///////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
// Affiche le bon message en fonction du device

var deviceAction = window.matchMedia("(min-width: 900px)").matches ? "Cliquez" : "Appuyez";
startBtn.innerHTML = deviceAction + " pour commencer.";
sectionIntro.addEventListener('click', function (event) {
  var frqs = [],
      gains = [],
      hsls = [];
  o.start(0);
  sectionIntro.classList.add('play');
  letters.forEach(function (element) {
    //Crée la couleur en HSL pour jouer la note plus tard
    var h = randomColorstart + count * 20,
        s = randomMinMax(70, 100),
        l = randomMinMax(50, 60);
    var gain = setGain(l, s),
        frq = setFrequency(h, s, l);
    gains.push(gain);
    frqs.push(frq);
    hsls.push([h, s, l]);
    root.style.setProperty('--h1letter-' + count, "hsl(" + h + ", " + s + "%, " + l + "%)");
    element.addEventListener('animationend', function (e) {
      element.style.opacity = 1;
      element.classList.add('end');
    });
    count++;
  });

  var _loop = function _loop(i) {
    setTimeout(function () {
      playArrayWithoutColor(i, 110, gains, frqs);
    }, 280);
  };

  for (var i = 1; i < letters.length; i++) {
    _loop(i);
  } // Après que toutes les lettres aient joué.


  setTimeout(function () {
    stopGain();
    sectionIntro.classList.add('hide');
    sectionIntro.addEventListener('animationend', function (e) {
      sectionIntro.style.display = "none";
    });
  }, letters.length * 100 + 1500);
}); ///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////// GESTION DU SLIDER ///////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////

navBtn.forEach(function (element) {
  element.addEventListener('click', function (e) {
    var target = e.currentTarget;
    var pastTarget = document.querySelector('.menu-btn.active');
    pastTarget != null ? pastTarget.classList.remove('active') : console.log('No pastTarget');
    target.classList.add('active');
    var page = target.getAttribute('id');
    body.setAttribute('data-page', page); // Refais apparaître le message du piano

    if (page != "piano") {
      pianoMsg.style.opacity = "1";
      pianoMsg.style.display = "inherit";
    } // Reset le scroll de la page malgré l'ancre


    if (page == "info") {
      infoSection.scrollTop = 0;
    }
  });
});
creditBtn.forEach(function (element) {
  element.addEventListener('click', function (e) {
    if (element.getAttribute('id') == "closeCreditSection") {
      colorBtn.classList.add('active');
      body.setAttribute('data-page', 'color');
    } else {
      body.setAttribute('data-page', 'credits');
    }
  });
}); ///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////// ECOUTE D'UNE COULEUR ////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////

colorInput.forEach(function (input) {
  colorInputs.push(input);
});
colorSpan.forEach(function (colorSpan) {
  colorSpans.push(colorSpan);
}); //Lorsqu'un slider bouge :

var _loop2 = function _loop2(i) {
  colorInputs[i].addEventListener('input', function (e) {
    var h = colorInputs[0].value,
        s = colorInputs[1].value,
        l = colorInputs[2].value; // Joue les paramètres et acualise la couleur du "played-color"

    playNote(h, s, l); // Affiche la fréquence jouée

    actualNote.innerHTML = o.frequency.value + " Hz"; // Affiche la valeur du slider 

    colorSpans[i].innerHTML = colorInputs[i].value; // Affiche la couleur jouée

    h = Number(h);
    l = Number(l);
    var h2 = h + 20,
        l2 = l - 5;
    h2 = h2 > 359 ? 359 : h2;
    l2 = l2 < 0 ? 0 : l2;
    color.style.background = "linear-gradient(hsl(" + h + ", " + s + "%, " + l + "%), hsl(" + h2 + ", " + s + "%, " + l2 + "%))";
  });
  stopGain(colorInputs[i]);
};

for (var i = 0; i < colorInputs.length; i++) {
  _loop2(i);
}

; ///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////// ECOUTE D'UNE IMAGE //////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
// Affiche le bon message en fonction du device

var deviceAction2 = window.matchMedia("(min-width: 900px)").matches ? "l'explorateur de fichiers" : "ma galerie";
btnUpload.innerHTML = "Ouvrir " + deviceAction2; // Réglage de la vitesse de lecture

playRate.addEventListener('input', function (e) {
  speed = playRate.value * -1;
  playRateSpan.innerHTML = playRate.value * -1;
}); // Réglage du nombre de couleurs

colorNumber.addEventListener('input', function (e) {
  colorNumberSpan.innerHTML = colorNumber.value;
  colorList.style.height = "calc(60px + 0.45rem)";

  if (window.matchMedia("(min-width: 900px)").matches) {
    // Desktop
    colorList.style.width = "calc(" + 0.5 * colorNumber.value + 'rem + ' + 60 * colorNumber.value + 'px';
    colorList.style.height = "calc(60px + 0.5rem)";
  } else {
    colorList.style.maxWidth = "calc(" + 0.5 * 5 + 'rem + ' + 60 * 5 + 'px';

    if (colorNumber.value > 5) {
      colorList.style.width = "calc(" + 0.5 * colorNumber.value + 'rem + ' + 60 * colorNumber.value + 'px';
      colorList.style.height = "calc(120px + 1rem)";
    } else {
      colorList.style.width = "calc(" + 0.5 * colorNumber.value + 'rem + ' + 60 * colorNumber.value + 'px';
      colorList.style.height = "calc(60px + 0.45rem)";
    }
  }
});
colorNumber.addEventListener(eventEnd, function (e) {
  createPalette(imgToListen);
  colorList.classList.remove('edition');
});
colorNumber.addEventListener(eventStart, function (e) {
  colorList.style.width = "calc(" + 0.5 * colorNumber.value + 'rem + ' + 60 * colorNumber.value + 'px';
  colorList.style.height = "calc(60px + 0.50rem)";
  colorList.innerHTML = "";
  colorList.classList.add('edition');

  for (var _i = 0; _i < 10; _i++) {
    var _color = document.createElement('li');

    _color.classList.add('color-list-el');

    colorList.appendChild(_color);
  }
}); // Présélectionne une image

imageSelection[0].classList.add('selected');
createPalette(imgToListen); // Ouvre la sélection

btnOpenSelection.addEventListener('click', function (e) {
  btnOpenSelection.classList.toggle('selection-open');
}); // Change l'image avec l'image sélectionnée

imageSelection.forEach(function (image) {
  image.addEventListener('click', function (e) {
    var currentTarget = e.currentTarget;
    var pastTarget = document.querySelector('.selected');
    currentTarget.classList.add('selected'); // Vérifie si ils sont null avant d'ajouter ou retirer la class

    pastTarget != null ? pastTarget.classList.remove('selected') : console.log('selection added'); // Children[0] car currentTarget est "li" et non "li > img"

    var imgName = currentTarget.children[0].currentSrc.slice(-16);

    if (imgName.includes("@2x") == true) {
      imgName = imgName.slice(0, imgName.length - 7);
    } else {
      imgName = imgName.slice(3, imgName.length - 4);
    }

    changeImageToListen(imgName, false);
  });
}); // Upload d'une image

btnUpload.addEventListener('click', function (e) {
  inputUpload.click(); //Actualise l'image uploadée

  inputUpload.addEventListener('change', function (e) {
    // Retire la class "selected" de l'image précédement sélectionnée
    var pastTarget = document.querySelector('.selected');
    pastTarget != null ? pastTarget.classList.remove('selected') : console.log('selection removed');
    var imgLink = URL.createObjectURL(e.target.files[0]);
    changeImageToListen(imgLink, true);
  });
}); //Récupère les couleurs de l'image et les joue

playImageBtn.addEventListener('click', function (e) {
  var gains = [],
      frqs = [],
      hsls = [];

  var _loop3 = function _loop3(_i2) {
    var color = root.style.getPropertyValue('--palette-color-' + (_i2 + 1)).match(/\d+/g).map(Number);
    hsls.push(color);
    var gain = setGain(color[1], color[2]),
        frq = setFrequency(color[0], color[1], color[2]);
    gains.push(gain);
    frqs.push(frq);
    setTimeout(function () {
      playArray(_i2, speed, gains, frqs, hsls);
    }, 280);
  };

  for (var _i2 = 0; _i2 < colorList.childNodes.length; _i2++) {
    _loop3(_i2);
  }

  setTimeout(function () {
    stopGain();
  }, colorList.childNodes.length * 280);
  console.log(colorList.childNodes.length * 280);
}); ///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
////////////////////////////// PAD ////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
// Assigne une couleur légèrement aléatoire à chaque touche (chacune compris dans une transche de 40 deg)

pianoBtn.forEach(function (btn) {
  h = h + 40;
  actualisePadBtnColor(btn, h);
}); // Permets de rentrer en mode "modification" des boutons 

editBtn.addEventListener('click', function (e) {
  sectionPiano.classList.add('pad-modify');
}); // Permets de quitter le mode "modification" des boutons 

saveBtn.addEventListener('click', function (e) {
  sectionPiano.classList.remove('pad-modify');
}); // Pour chaque touches du piano

pianoBtn.forEach(function (btn) {
  btn.addEventListener(eventStart, function (e) {
    //Récupère la couleur appuyée
    var targetBtn = e.currentTarget; // Convertis les valeurs rgb en tsl pour les rendre utilisable par mes fonctions

    var hslColor = getHslFromAttribute(targetBtn),
        h = hslColor[0],
        s = hslColor[1],
        l = hslColor[2]; // LE PAD EST EN MODE "MODIFICATION"

    if (sectionPiano.classList.contains('pad-modify') == true) {
      // Affiche et déplace le slider de modification en dessous de la touche sélectionnée
      sectionPiano.classList.add('edition');
      editDiv.style.top = targetBtn.offsetTop + editDiv.offsetHeight + "px";
      editDivIndicator.style.left = targetBtn.offsetLeft + "px"; // Bouton permettant de masquer le slider

      confirmEdit.addEventListener('click', function (e) {
        sectionPiano.classList.remove('edition');
        targetBtn.classList.remove('pad-btn-active');
      });
      playNote(h, s, l);
      stopGain(); // Sélection d'une couleur

      if (targetBtn.classList.contains('pad-btn-active') == false) {
        // Actualise le bouton actif
        var pastTarget = document.querySelector('.pad-btn-active');
        targetBtn.classList.add('pad-btn-active');
        pastTarget != null ? pastTarget.classList.remove('pad-btn-active') : console.log('No pastTarget'); // Récupère les couleurs tsl depuis l'attibut style du boutton

        hslColor = getHslFromAttribute(targetBtn); // Actualise les valeurs du slider avec la couleur actuelle du bouton

        editInput.value = hslColor[0];
      } // LE PAD N'EST PAS EN MODE "MODIFICATION"

    } else {
      playNote(h, s, l);
      stopGain(btn);
    }
  });
}); // L'orsqu'un slider bouge - modifie la couleur active

editInput.addEventListener('input', function (e) {
  var h = editInput.value;
  var actualBtn = document.querySelector('.pad-btn-active'); // Actualise la couleur du bouton

  actualisePadBtnColor(actualBtn, h);
  playNote(h, 100, 50);
});
stopGain(editInput); ///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
/////////////////////////// Piano /////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
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
  "=": "690"
}; // Récupère la touche jouée et joue la fréquence qui lui est associée

document.addEventListener('keydown', function (e) {
  var key = e.key; // Si la page est celle du piano clavier, on prends en compte l'appuis clavier

  if (body.getAttribute('data-page') == "piano") {
    // Permet de ne pas répéter l'événement 'keydown' lors d'un appuis enfoncé
    if (down) return;
    down = true; // Si une fréquence est assigné à la touche, on la joue

    if (notes[key] != null) {
      var _frq = notes[key],
          _color2 = 0; // Assigne la valeur de gain et fréquence

      o.frequency.setValueAtTime(_frq, context.currentTime);
      g.gain.setTargetAtTime(1, context.currentTime, 0.002); // Cherche une couleur correspondant à la fréquence

      do {
        h = randomMinMax(0, 360);
        s = 100;
        l = randomMinMax(50, 60);
        _color2 = setFrequency(h, s, l);
      } while (_frq != _color2); // Assignation de la couleur et d'un class de transition


      var size = randomMinMax(20, 50),
          blur = size * 3,
          top = randomMinMax(size, 100) - size,
          left = randomMinMax(size, 100) - size;
      var colorDiv = document.createElement('div');
      colorDiv.style.backgroundColor = 'hsl(' + h + ', ' + s + '%, ' + l + '%)';
      colorDiv.style.filter = 'blur(' + blur + 'px)';
      colorDiv.style.left = left + 'vw';
      colorDiv.style.bottom = top + 'vh';
      colorDiv.style.width = size + 'vw';
      colorDiv.style.height = size + 'vw';
      colorDiv.classList.add('piano-color-el', 'piano-color-el-fadeIn');
      pianoColor.appendChild(colorDiv); // Cache le message

      pianoMsg.style.opacity = 0; // Lorsqu'on lâche la touche, le son s'arrête et la couleur passe au blanc

      document.addEventListener('keyup', function (e) {
        colorDiv.classList.add('piano-color-el-fadeOut');
        colorDiv.addEventListener('animationend', function (e) {
          colorDiv.remove();
        });
        stopGain();
        down = false;
      }, false);
    }
  }
}, false); ///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
//////////////////////////// INFO MENU ////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
// Ouvrir/fermer le menu

navBtnOpen.addEventListener('click', function (e) {
  nav.classList.add('open');
});
navBtnClose.addEventListener('click', function (e) {
  nav.classList.remove('open');
});
navElements.forEach(function (element) {
  element.addEventListener('click', function (e) {
    nav.classList.toggle('open');
  });
}); // Actualise le menu en fonction du scroll

infoSection.addEventListener('scroll', function () {
  for (var _i3 = 0; _i3 < anchors.length; _i3++) {
    if (infoSection.scrollTop >= anchors[_i3].offsetTop - window.innerHeight / 2) {
      navElements.forEach(function (element) {
        element.classList.remove('current');
      });

      if (navElements[_i3].classList.contains('current') == false) {
        navElements[_i3].classList.add('current');
      }
    }
  }

  if (window.matchMedia("(min-width: 900px)").matches) {
    // Peut être optimisé
    if (isCollide(nav, gist[0]) == false && isCollide(nav, gist[1]) == false && isCollide(nav, gist[2]) == false) {
      nav.classList.remove('hide');
    } else {
      nav.classList.add('hide');
    }
  }
}); ///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////// MY FUNCTIONS ////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////

function changeImageToListen(imgLink, external) {
  // animations
  imageModule.classList.add('change');
  imgToListen.addEventListener('animationend', function (e) {
    // à la fin du fadeOut on change l'image
    if (e.animationName === 'fadeOut') {
      if (external == false) {
        backgroundImg.setAttribute('src', 'assets/images/toListen/' + imgLink + '.jpg');
        imgToListen.setAttribute('src', 'assets/images/toListen/' + imgLink + '.jpg');
        backgroundImg.setAttribute('srcset', 'assets/images/toListen/' + imgLink + '@2x.jpg 2x');
        imgToListen.setAttribute('srcset', 'assets/images/toListen/' + imgLink + '@2x.jpg 2x');
        imageModule.classList.remove('change');
        imageModule.classList.add('loading');
      } else {
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
    } else {
      imgToListen.addEventListener('load', function () {
        createPaletteOnLoad(imgToListen);
        imageModule.classList.remove('loading');
        imageModule.classList.add('changeDone');
      });
    } // retire les classes d'animations lorsqu'elles sont terminées


    if (e.animationName === 'bounceIn') {
      imageModule.classList.remove('changeDone');
      createPalette(imgToListen);
    }
  });
} // Permet de jouer un tableau de notes sans actualiser "played color"


function playArrayWithoutColor(i, speed, gains, frqs) {
  setTimeout(function () {
    g.gain.setTargetAtTime(gains[i], context.currentTime, 0.002);
    o.frequency.setValueAtTime(frqs[i], context.currentTime);
    g.gain.setTargetAtTime(0, context.currentTime + 0.002, speed / 1500);
  }, i * speed);
} // Permet de jouer un tableau de notes


function playArray(i, speed, gains, frqs, hsls) {
  setTimeout(function () {
    g.gain.setTargetAtTime(gains[i], context.currentTime, 0.002);
    o.frequency.setValueAtTime(frqs[i], context.currentTime);
    playedColors.classList.remove('hide');
    root.style.setProperty('--played-color', 'hsla(' + hsls[i][0] + ', ' + hsls[i][1] + '%, ' + hsls[i][2] + '%, ' + gains[i] + ')');
    g.gain.setTargetAtTime(0, context.currentTime + 0.002, speed / 1500);
  }, i * speed);
} // Permet de jouer une note


function playNote(h, s, l) {
  var frq = setFrequency(h, s, l),
      gain = setGain(l, s);
  g.gain.setTargetAtTime(gain, context.currentTime, 0.002);
  o.frequency.setValueAtTime(frq, context.currentTime);
  playedColors.classList.remove('hide');
  root.style.setProperty('--played-color', 'hsla(' + h + ', ' + s + '%, ' + l + '%, ' + gain + ')');
}

function actualisePadBtnColor(btn, h) {
  var id = btn.getAttribute('id').slice(-1);
  root.style.setProperty('--pad-btn-color-' + id, 'hsl(' + h + ', 100%, 50%)');
} // Stop le gain et cache "played color"


function stopGain(elementToListen) {
  if (elementToListen == undefined) {
    g.gain.setTargetAtTime(0, context.currentTime, 0.2);
    playedColors.classList.add('hide');
  } else {
    elementToListen.addEventListener(eventEnd, function (e) {
      g.gain.setTargetAtTime(0, context.currentTime, 0.2);
      playedColors.classList.add('hide');
    });
  }
} // Vérifie que l'image soit chargée avant de créer la pallette


function createPalette(image) {
  if (image.complete) {
    createPaletteOnLoad(image);
  } else {
    image.addEventListener('load', function () {
      createPaletteOnLoad(image);
    });
  }
} // Crée une pallette avec une image


function createPaletteOnLoad(image) {
  colorList.innerHTML = "";
  var palette = colorThief.getPalette(image, Number(colorNumber.value));

  var _loop4 = function _loop4(_i4) {
    var hslColor = RGBToHSL(palette[_i4][0], palette[_i4][1], palette[_i4][2]); // Crée un élement HTML auquel il assigne la couleur

    var color = document.createElement('li');
    color.classList.add('color-list-el');
    root.style.setProperty('--palette-color-' + (_i4 + 1), 'hsl(' + hslColor[0] + ', ' + hslColor[1] + '%, ' + hslColor[2] + '%)');
    color.addEventListener('animationend', function (e) {
      color.style.opacity = 1;
    });
    colorList.appendChild(color);
  };

  for (var _i4 = 0; _i4 < palette.length; _i4++) {
    _loop4(_i4);
  }
} // Récupère les valeurs h s et l depuis les attributs de l'élément


function getHslFromAttribute(element) {
  var id = element.getAttribute('id').slice(-1);
  var hsls = root.style.getPropertyValue('--pad-btn-color-' + id).match(/\d+/g).map(Number);
  return hsls;
} // Calcule le gain


function setGain(lum, sat) {
  if (lum >= 50) {
    lum = 100 - lum;
  }

  var gainValue = sat / 100 * (lum / 100);
  gainValue = Math.round(gainValue * 100) / 100 * 2;
  return gainValue;
} // Calcule la fréquence


function setFrequency(h, s, l) {
  h = Number(h);
  s = Number(s);
  l = Number(l); // Convertis la couleur HSL en RGB sans tenir compte de la saturation - celle-ci est gérée apprès

  var rgbColor = HSLtoRGB(h, 80, l); // Donne une ordre d'importance au R G et B

  frq = Math.round(rgbColor[0] * 0.9 + rgbColor[1] * 2 + rgbColor[2] * 0.3); // Prise en compte de la saturation - elle influe sur le gain et s'ajoute à la valeur de la fréquence

  frq = frq - 100 + s;
  frq = Math.round(frq); // Empêche de descendre dans des valeurs négatives

  if (frq < 0) {
    frq = 0;
  }

  return frq;
} ///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////// OTHERS FUNCTIONS ////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
//source: https://gist.github.com/brunomonteiro3/27af6d18c2b0926cdd124220f83c474d


function randomMinMax(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
} // https://codepen.io/dropinks/pen/MrzPXB


function isCollide(el1, el2) {
  var element1 = el1.getBoundingClientRect();
  var element2 = el2.getBoundingClientRect();
  return !(element1.top + element1.height < element2.top + 50 || element1.top > element2.top + element2.height - 50);
} // CSS TRICK LICENCE  -  https://css-tricks.com/license/
//source: https://css-tricks.com/converting-color-spaces-in-javascript/
//Convertit ma valeur HSL vers RGB


function HSLtoRGB(h, s, l) {
  // doit être une fraction de 1
  s /= 100;
  l /= 100;
  var c = (1 - Math.abs(2 * l - 1)) * s,
      x = c * (1 - Math.abs(h / 60 % 2 - 1)),
      m = l - c / 2,
      r = 0,
      g = 0,
      b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
}

function RGBToHSL(r, g, b) {
  // Make r, g, and b fractions of 1
  r /= 255;
  g /= 255;
  b /= 255; // Find greatest and smallest channel values

  var cmin = Math.min(r, g, b),
      cmax = Math.max(r, g, b),
      delta = cmax - cmin,
      h = 0,
      s = 0,
      l = 0; // Calculate hue
  // No difference

  if (delta == 0) h = 0; // Red is max
  else if (cmax == r) h = (g - b) / delta % 6; // Green is max
    else if (cmax == g) h = (b - r) / delta + 2; // Blue is max
      else h = (r - g) / delta + 4;
  h = Math.round(h * 60); // Make negative hues positive behind 360°

  if (h < 0) h += 360; // Calculate lightness

  l = (cmax + cmin) / 2; // Calculate saturation

  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1)); // Multiply l and s by 100

  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);
  return [Math.round(h), Math.round(s), Math.round(l)];
} //SMOOTH SCROLL ONLY ON ANCHOR BUTTONS - Permet de reset le scroll de la page info sans l'animation du smooth scroll
//source: https://stackoverflow.com/questions/7717527/smooth-scrolling-when-clicking-an-anchor-link


document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

/***/ }),

/***/ "./src/styles/app.scss":
/*!*****************************!*\
  !*** ./src/styles/app.scss ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 0:
/*!********************************************************!*\
  !*** multi ./src/scripts/app.js ./src/styles/app.scss ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! C:\Users\Julien\Documents\TFE\tfe-alpha\src\scripts\app.js */"./src/scripts/app.js");
module.exports = __webpack_require__(/*! C:\Users\Julien\Documents\TFE\tfe-alpha\src\styles\app.scss */"./src/styles/app.scss");


/***/ })

/******/ });
//# sourceMappingURL=app.js.map