'use strict';

class Presentation extends React.Component {
    constructor(props) {
        super(props);
        this.state = { active: 0 };
        this.handleRepeat = this.handleRepeat.bind(this);
        this.handleWheel = this.handleWheel.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);
        this.isScrollLocked = false;
        this.swipeStart = null;

        this.slides = [
            { content: 'Hey! Wanna hire me?' },
            { content: "I'm a developer" },
            { content: 'A good one' },
            { content: React.createElement("div", null, "I made this site ", 
                React.createElement("span", { className: "bold" }, "myself")) },
            { content: 'Yes, that "myself" was bold' },
            { content: 'And I can do more' },
            { content: React.createElement("div", { className: "container" }, "I can do it old school ", 
                React.createElement("span", { className: "marquee" }, "Who the hell deprecated marquee?!")), classes: 'cringe' },
            { content: React.createElement(React.Fragment, null, "Or classy ", 
                React.createElement("img", { id: "infinity", src: "./assets/infinity.svg" })) },
            { content: 'I can change the background!', classes: 'white' },
            { content: 'How cool is that?' },
            { content: "Ok, if you're still thinking" },
            { content: 'Here is the last one' },
            { content: 'Ready?' },
            { content: 'Ok' },
            { content: 'Randomly directed nyan cat!', classes: 'nyan-block', hideArrow: true, nyanimate: true },
            { content: "Yes, you do wanna hire me", classes: 'finalize', hideArrow: true, autoSwitch: true },
            { content: <FinalSlide />, classes: 'final', hideArrow: true, showRepeater: true },
        ]
    }

    handleRepeat() {
        var rootDiv = document.getElementById('app');
        var anim = rootDiv.animate([ {'opacity': 1, easing: 'ease-in-out'}, {'opacity': 0} ], 
            { duration: 400, iterations: 1 });
        anim.onfinish = function() {
            location.href='/';
        }
    }

    handleWheel(e) {
        this.changeSlide(e.deltaY > 0);
    }

    handleKeyDown(e) {
        if (e.key == 'ArrowUp') {
            this.changeSlide(false, 700);
        } else if (e.key == 'ArrowDown') {
            this.changeSlide(true, 700);
        }
    }

    handleClick(e) {
        this.changeSlide(true, 700);
    }

    handleTouchStart(e) {
        this.swipeStart = e.changedTouches[0];
    }

    handleTouchEnd(e) {
        var swipeEnd = e.changedTouches[0];
        if (swipeEnd.screenY - this.swipeStart.screenY > 0) {
            this.changeSlide(false);
        }
        else if (swipeEnd.screenY - this.swipeStart.screenY < 0) {
            this.changeSlide(true);
        }
    }

    updateState(newActive) {
        var rootDiv = document.getElementById('app');
        var anim = rootDiv.animate([ {'opacity': 1, easing: 'ease-in-out'}, {'opacity': 0} ], 
            { duration: 400, iterations: 1 });
        var that = this;
        anim.onfinish = function() {
            that.setState({showArrow: false, active: newActive});
            rootDiv.animate([ {'opacity': 0, easing: 'ease-in-out'}, {'opacity': 1} ], 
                { duration: 400, iterations: 1 });
        }
    }

    changeSlide(forward, timeout) {
        if (this.isScrollLocked || this.state.active == this.slides.length - 1) {
            return false;
        }

        this.isScrollLocked = true;
        clearTimeout(this.scrollHintTimeout);
        clearTimeout(this.autoSwitchTimeout);

        if (forward) {
            if (this.state.active < this.slides.length - 1) {
                this.updateState(this.state.active + 1);
            } else {
                this.isScrollLocked = false;
                return false;
            }
        } else {
            if (this.state.active > 0) {
                this.updateState(this.state.active - 1);
            } else {
                this.isScrollLocked = false;
                return false;
            }
        }

        setTimeout(() => {this.isScrollLocked = false;}, timeout || 1000);
    }

    componentDidMount() {
        this.showScrollHint();
        document.getElementById('main').focus();
        document.addEventListener("keydown", this.handleKeyDown);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyDown);
    }

    componentDidUpdate() {
        if (!this.activeSlide.hideArrow) {
            this.showScrollHint();
        }

        if (this.activeSlide.nyanimate) {
            setTimeout(() => {nyanimate(document.getElementById('nyanBlock'));}, 700);
        }

        if (this.activeSlide.autoSwitch) {
            this.autoSwitchTimeout = setTimeout(() => {this.isScrollLocked = false; this.changeSlide(true)}, 1500);
        }
    }

    showScrollHint() {
        this.scrollHintTimeout = setTimeout(() => { this.setState({showArrow: true}) }, 2000);
    }

    renderSlideClasses(classes) {
        var res = 'slide';
        if (classes) {
            res += ' ' + classes;
        }
        return res;
    }

    render() {
        this.activeSlide = this.slides[this.state.active];

        return (
            <div id="main" 
            tabindex="0"
            onWheel={ (e) => this.handleWheel(e) }
            onKeyDown={ (e) => this.handleKeyDown(e) }
            onClick={ (e) => this.handleClick(e) }
            onTouchStart={ (e) => this.handleTouchStart(e) }
            onTouchEnd={ (e) => this.handleTouchEnd(e) }
            className={ this.renderSlideClasses(this.activeSlide.classes) }>
                <div className="container">
                    { this.activeSlide.content } 
                    { this.activeSlide.showRepeater && <Repeater onRepeat={ this.handleRepeat } /> }
                    { this.activeSlide.nyanimate && <div id="nyanBlock" className="nyan-block"></div> }
                    { this.state.showArrow && <div className="arrow"></div> }
                </div>
            </div>
        );
    }
}

class Repeater extends React.Component {
    constructor(props) {
        super(props);
        this.state = { text: 'Again?' }
        this.handleMouseOver = this.handleMouseOver.bind(this);
        this.handleMouseOut = this.handleMouseOut.bind(this);
    }

    handleMouseOver() {
        this.setState({text: 'Seriously?'});
    }

    handleMouseOut() {
        this.setState({text: 'Again?'});
    }

    render() {
        return (
            <div id="repeat" onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut} onClick={this.props.onRepeat} >
                <img className="icon" src="./assets/repeat.svg" />
                <span id="repeat-text">{this.state.text}</span>
            </div>
        );
    }
}

class FinalSlide extends React.Component {
    render() {
        return (
            <div className="container">
                <div className="inner">
                    <div className="row">
                        <img className="icon" src="./assets/so.svg" />
                        <a target="_blank" href="https://stackoverflow.com/story/smileek">Read my CV</a>
                    </div>
                </div>
                <div className="inner">
                    <div className="row">
                        <img className="icon" src="./assets/github.svg" />
                        <a target="_blank" href="https://github.com/Smileek/frontend-cv">See this code on GitHub</a>
                    </div>
                    <p className="small">jQuery, Vue.js and React versions</p>
                </div>
                <div className="inner">
                    <div className="row">
                        <img className="icon" src="./assets/gmail.svg" />
                        <a target="_blank" href="mailto:smileek@gmail.com?subject=Hey%20Andrew,%20let&#39;s%20work%20together">Email me</a>
                    </div>
                </div>
            </div>
        )
    }
}

ReactDOM.render(<Presentation />, document.getElementById('app'));