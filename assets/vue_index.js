window.onload = function () {
    const App = {
        data() {
            return {
                index: 0,
                slides: [ 
                    {content: 'Hey! Wanna hire me?'},
                    {content: "I'm a developer"},
                    {content: 'A good one'},
                    {content: '<div>I made this site <span class="bold">myself</span></div>'},
                    {content: 'Yes, that "myself" was bold'},
                    {content: 'And I can do more'},
                    {content: '<div class="container">I can do it old school <span class="marquee">Who the hell deprecated marquee?!</span></div>', classes: 'cringe'},
                    {content: 'Or classy <img id="infinity" src="./assets/infinity.svg">'},
                    {content: 'I can change the background!', classes: 'white'},
                    {content: 'How cool is that?'},
                    {content: "Ok, if you're still thinking"},
                    {content: 'Here is the last one'},
                    {content: 'Ready?'},
                    {content: 'Ok'},
                    {content: 'Randomly directed nyan cat!', classes: 'no-scroll-hint nyan-block', onEnter: 'nyanimate'},
                    {content: "Yes, you do wanna hire me", classes: 'finalize no-scroll-hint',  onEnter: 'autoSwitch'},
                    {content: '<div class="inner"><div class="row"><img class="icon" src="./assets/so.svg">' + 
                        '<a target="_blank" href="https://stackoverflow.com/story/smileek">Read my CV</a></div></div>' +
                        '<div class="inner"><div class="row"><img class="icon" src="./assets/github.svg">' + 
                        '<a target="_blank" href="https://github.com/Smileek/frontend-cv">See this code on GitHub</a></div>' +
                        '<p class="small">jQuery, Vue.js and React versions </p></div>' +
                        '<div class="inner"><div class="row"><img class="icon" src="./assets/gmail.svg">' +
                        '<a target="_blank" href="mailto:smileek@gmail.com?subject=Hey%20Andrew,%20let&#39;s%20work%20together">Email me</a></div></div>' +
                        '<div id="repeat"><img class="icon" src="./assets/repeat.svg"><span id="repeat-text">Again?</span></div>', 
                        classes: 'no-scroll-hint final',  onEnter: 'setRepeater'},
                ]
            }
        },
        created() {
            window.addEventListener('wheel', this.onWheel);
            window.addEventListener('keydown', this.onKeyDown);
            window.addEventListener('click', this.onClick);
            window.addEventListener('touchstart', this.onTouchStart);
            window.addEventListener('touchend', this.onTouchEnd);
        },
        destroyed() {
            window.removeEventListener('wheel', this.onWheel);
            window.removeEventListener('keydown', this.onKeyDown);
            window.removeEventListener('click', this.onClick);
            window.removeEventListener('touchstart', this.onTouchStart);
            window.removeEventListener('touchend', this.onTouchEnd);
        },
        methods: {
            changeSlide (forward, timeout) {
                if (isScrollLocked || this.index == this.slides.length - 1) {
                    return false;
                }

                isScrollLocked = true;

                if (forward) {
                    if (this.index < this.slides.length - 1) {
                        this.index++;                        
                    } else {
                        isScrollLocked = false;
                        return false;
                    }
                } else {
                    if (this.index > 0) {
                        this.index--;
                    } else {
                        isScrollLocked = false;
                        return false;
                    }
                }

                var arrows = document.getElementsByClassName('arrow');
                for (i = 0; i < arrows.length; i++) {
                    arrows[i].remove();
                }
                clearTimeout(scrollHintTimeout);
                showScrollHint();
                setTimeout(() => {isScrollLocked = false;}, timeout || 1000);
            },
            onWheel(e) {
                this.changeSlide(e.deltaY > 0);
            },
            onKeyDown(e) {
                if (e.key == 'ArrowUp') {
                    this.changeSlide(false, 700);
                } else if (e.key == 'ArrowDown') {
                    this.changeSlide(true, 700);
                }
            },
            onClick(e) {
                this.changeSlide(true, 700);
            },
            onTouchStart(e) {
                swipeStart = e.changedTouches[0];
            },
            onTouchEnd(e) {
                var swipeEnd = e.changedTouches[0];
                if (swipeEnd.screenY - swipeStart.screenY > 0) {
                    this.changeSlide(false);
                }
                else if (swipeEnd.screenY - swipeStart.screenY < 0) {
                    this.changeSlide(true);
                }
            },
            autoSwitch() {
                setTimeout(() => {this.changeSlide (true)}, 1500);
            },
            setRepeater() {
                var repeater = document.getElementById('repeat');
                var repeaterText = document.getElementById('repeat-text');
                repeater.addEventListener('mouseover', function() { 
                    repeaterText.innerText = 'Seriously?';
                });
                repeater.addEventListener('mouseout', function() { 
                    repeaterText.innerText = 'Again?';
                });
                repeater.addEventListener('click', function() { 
                    var root = document.getElementById('app');
                    var anim = root.animate([{opacity: 1}, {opacity: 0}], {duration: 500});
                    anim.onfinish = function() { root.style.display = 'none'; location.href = 'react.html';};
                });
            },
            afterLeave() {
                var f = this.slides[this.index].onEnter;
                if (!f) {
                    return;
                }

                switch (f) {
                    case 'nyanimate':
                        return setTimeout(() => {nyanimate(document.getElementById('main'));}, 700);
                    case 'autoSwitch':
                        return this.autoSwitch();
                    case 'setRepeater':
                        return this.setRepeater();
                }
            }
        }
    }

    Vue.createApp(App).mount('#app')

    var isScrollLocked = false;
    var scrollHintTimeout;
    var swipeStart = null;

    function showScrollHint() {
        scrollHintTimeout = setTimeout(() => {document.getElementById('main').insertAdjacentHTML('beforeend', '<div class="arrow"></div>')}, 2000);
    }
    showScrollHint();
}