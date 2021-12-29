function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function getTan(degrees) {
    return Math.tan(degrees * Math.PI / 180);
}

function nyanimate(currentSlide) {
    var nyanBlocks = Array.from(document.querySelectorAll('.nyan-block'))
        .filter(s => window.getComputedStyle(s).getPropertyValue('display') != 'none');

    if (!nyanBlocks.length) {
        return;
    }

    var img = document.createElement("img");
    img.src = './assets/nyan.gif';
    img.className = 'nyan';
    var nyan = currentSlide.appendChild(img);
    var quadrant = getRandomInt(7);
    var rotate = getRandomInt(44);
    var tan = getTan(rotate);
    var tanAdd = getTan(45 - rotate);
    rotate += quadrant * 45;
    var start = (getRandomInt(30) + ([0, 1, 3, 6].includes(quadrant) ? 50 : 20)) / 100;
    var startTop, startLeft, finishTop, finishLeft;
    var catMaxLen = nyan.offsetWidth * 1.1;
    var screenWidth = window.innerWidth;
    var screenHeight = window.innerHeight;

    switch (quadrant) {
        case 0:
            startTop = Math.round(start * screenHeight);
            startLeft = screenWidth + catMaxLen;
            finishTop = Math.round(startTop - (screenWidth + 2 * catMaxLen) * tan);
            finishLeft = -catMaxLen;
            break;
        case 1:
            startTop = screenHeight + catMaxLen;
            startLeft = Math.round(start * screenWidth);
            finishTop = -catMaxLen;
            finishLeft = Math.round(startLeft - (screenHeight + 2 * catMaxLen) * tanAdd);
            break;
        case 2:
            startTop = screenHeight + catMaxLen;
            startLeft = Math.round(start * screenWidth);
            finishTop = -catMaxLen;
            finishLeft = Math.round(startLeft + (screenHeight + 2 * catMaxLen) * tan);
            break;
        case 3:
            startTop = Math.round(start * screenHeight);
            startLeft = -catMaxLen;
            finishTop = Math.round(startTop - (screenWidth + 2 * catMaxLen) * tanAdd);
            finishLeft = screenWidth + catMaxLen;
            break;
        case 4:
            startTop = Math.round(start * screenHeight);
            startLeft = -catMaxLen;
            finishTop = Math.round(startTop + (screenWidth + 2 * catMaxLen) * tan);
            finishLeft = screenWidth + catMaxLen;
            break;
        case 5:
            startTop = -catMaxLen;
            startLeft = Math.round(start * screenWidth);
            finishTop = screenHeight + catMaxLen;
            finishLeft = Math.round(startLeft + (screenHeight + 2 * catMaxLen) * tanAdd);
            break;
        case 6:
            startTop = -catMaxLen;
            startLeft = Math.round(start * screenWidth);
            finishTop = screenHeight + catMaxLen;
            finishLeft = Math.round(startLeft - (screenHeight + 2 * catMaxLen) * tan);
            break;
        case 7:
            startTop = Math.round(start * screenHeight);
            startLeft = screenWidth + catMaxLen;
            finishTop = Math.round(startTop + (screenWidth + 2 * catMaxLen) * tanAdd);
            finishLeft = -catMaxLen;
            break;
    }

    nyan.style.transform = 'rotate(' + rotate + 'deg)';
    var anim = nyan.animate([
            {'left': startLeft + 'px', 'top': startTop + 'px'}, 
            {'left': finishLeft + 'px', 'top': finishTop + 'px'}
        ], 
        { duration: 3000, iterations: 1 });
    anim.onfinish = function() { nyan.remove(); };

    setTimeout(() => {nyanimate(currentSlide);}, 1000);
}