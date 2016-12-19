import React from 'react';

const {number, string} = React.PropTypes;

export default class Snowflakes extends React.Component {

  static propTypes = {
    numberOfSnowflakes: number,
    snowflakeColor: string,
    snowflakeChar: string
  };

  static defaultProps = {
    numberOfSnowflakes: 50,
    snowflakeColor: 'rgba(0,0,0,.2)',
    snowflakeChar: '*'
  };

  componentDidMount() {
    const requestAnimationFrame = window.requestAnimationFrame ||
                                  window.mozRequestAnimationFrame ||
                                  window.webkitRequestAnimationFrame ||
                                  window.msRequestAnimationFrame;

    var snowflakes = [];

    var browserWidth;
    var browserHeight;

    var numberOfSnowflakes = this.props.numberOfSnowflakes;

    var resetPosition = false;

    function Snowflake(element, radius, speed, xPos, yPos) {

      // set initial snowflake properties
      this.element = element;
      this.radius = radius;
      this.speed = speed;
      this.xPos = xPos;
      this.yPos = yPos;

      // declare variables used for snowflake's motion
      this.counter = 0;
      this.sign = Math.random() < 0.5 ? 1 : -1;

      // setting an initial opacity and size for our snowflake
      this.element.style.opacity = .1 + Math.random();
      this.element.style.fontSize = 12 + Math.random() * 50 + 'px';
    }

    Snowflake.prototype.update = function () {

      // using some trigonometry to determine our x and y position
      this.counter += this.speed / 5000;
      this.xPos += this.sign * this.speed * Math.cos(this.counter) / 40;
      this.yPos += Math.sin(this.counter) / 40 + this.speed / 30;

      // setting our snowflake's position
      setTranslate3DTransform(this.element, Math.round(this.xPos), Math.round(this.yPos));

      // if snowflake goes below the browser window, move it back to the top
      if (this.yPos > browserHeight) {
        this.yPos = -50;
      }
    };

    function setTranslate3DTransform(element, xPosition, yPosition) {
      element.style.left = xPosition + 'px';
      element.style.top = yPosition + 'px';
    }

    const generateSnowflakes = () => {

      // get our snowflake element from the DOM and store it
      const originalSnowflake = this.refs.snowflake;

      // access our snowflake element's parent container
      const snowflakeContainer = originalSnowflake.parentNode;

      // get our browser's size
      browserWidth = document.documentElement.clientWidth;
      browserHeight = document.documentElement.clientHeight;

      // create each individual snowflake
      for (let i = 0; i < numberOfSnowflakes; i++) {

        // clone our original snowflake and add it to snowflakeContainer
        const snowflakeCopy = originalSnowflake.cloneNode(true);
        snowflakeContainer.appendChild(snowflakeCopy);

        // set our snowflake's initial position and related properties
        const initialXPos = getPosition(50, browserWidth);
        const initialYPos = getPosition(50, browserHeight);
        const speed = 5 + Math.random() * 40;
        const radius = 4 + Math.random() * 10;

        // create our Snowflake object
        snowflakes.push(new Snowflake(snowflakeCopy,
          radius,
          speed,
          initialXPos,
          initialYPos));
      }

      // remove the original snowflake because we no longer need it visible
      snowflakeContainer.removeChild(originalSnowflake);

      // call the moveSnowflakes function every 30 milliseconds
      moveSnowflakes();
    };

    function moveSnowflakes() {
      for (let i = 0; i < snowflakes.length; i++) {
        snowflakes[i].update();
      }

      // Reset the position of all the snowflakes to a new value
      if (resetPosition) {
        browserWidth = document.documentElement.clientWidth;
        browserHeight = document.documentElement.clientHeight;

        for (let i = 0; i < snowflakes.length; i++) {
          const snowflake = snowflakes[i];

          snowflake.xPos = getPosition(50, browserWidth);
          snowflake.yPos = getPosition(50, browserHeight);
        }

        resetPosition = false;
      }

      requestAnimationFrame(moveSnowflakes);
    }

    function getPosition(offset, size) {
      return Math.round(-1 * offset + Math.random() * (size + 2 * offset));
    }

    function setResetFlag(e) {
      resetPosition = true;
    }

    generateSnowflakes();
    window.addEventListener('resize', setResetFlag, false);
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div style={{position: 'absolute', left: 0, top: 0}}>
        <div ref="snowflake"
             style={{
               paddingLeft: '15px',
               fontFamily: 'Cambria, Georgia, serif',
               fontSize: '14px',
               lineHeight: '24px',
               position: 'fixed',
               color: this.props.snowflakeColor,
               userSelect: 'none',
               zIndex: 1000,
               opacity: 0
             }}>
          *
        </div>
      </div>
    );
  }
}
