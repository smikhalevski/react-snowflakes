import React from 'react';
import {number, func} from 'prop-types';

export function DepthOfFieldSnowfall({count = 50, ...props}) {
  return (
    <Snowfall {...props}
              count={count}
              snowflakeFactory={index => {
                const size = index / count;
                const w = 5 + 10 * size + 'px';
                return (
                  <Snowflake speed={.05 + size * 2}
                             xSpeedPrc={.3 * size}
                             ySpeedPrc={.1 * size}
                             style={{
                               width: w,
                               height: w,
                               borderRadius: '50%',
                               backgroundColor: 'currentColor',
                               opacity: .2 + .8 * size,
                               filter: `blur(${Math.round(Math.max(size - .5, 0) * 15)}px)`
                             }}/>
                )
              }}/>
  );
}

export class Snowflake extends React.Component {

  static propTypes = {
    speed: number,
    xSpeedPrc: number,
    ySpeedPrc: number,
    timeFactor: number,
  };

  static defaultProps = {
    speed: .02 + Math.random() * 3,
    xSpeedPrc: .3,
    ySpeedPrc: .1,
    timeFactor: 1e3
  };

  node;
  x;
  y = 1 / 0;
  sign = Math.random() - 1;

  setNode = node => this.node = node;

  animate(time, vw, vh) {
    const {speed, xSpeedPrc, ySpeedPrc, timeFactor} = this.props;
    if (time === 0) {
      this.x = Math.random() * vw;
      this.y = Math.random() * vh;
    }
    if (this.y > vh) {
      this.x = Math.random() * vw;
      this.y = -this.node.offsetHeight;
    } else {
      this.x += this.sign * speed * xSpeedPrc * Math.cos(time / timeFactor);
      this.y += speed     + speed * ySpeedPrc * Math.sin(time / timeFactor);
    }
    this.node.style.transform = `translate(${this.x}px, ${this.y}px)`;
  }

  render() {
    const {style, children, speed, xSpeedPrc, ySpeedPrc, timeFactor, ...props} = this.props;
    return (
      <div {...props}
           ref={this.setNode}
           style={{
             pointerEvents: 'none',
             ...style,
             position: 'absolute',
             top: 0,
             left: 0
           }}>
        {children}
      </div>
    );
  }
}

export class Snowfall extends React.Component {

  static propTypes = {
    count: number,
    snowflakeFactory: func
  };

  static defaultProps = {
    count: 50,
    snowflakeFactory: i => <Snowflake/>
  };

  state = {
    renderPermitted: false
  };

  node;
  snowflakes = [];
  animationFrame;

  pushSnowflake = snowflake => this.snowflakes.push(snowflake);
  setNode = node => this.node = node;

  componentDidMount() {
    this.setState({renderPermitted: true});
    this.forceUpdate(this.startAnimation);
  }

  componentWillUnmount() {
    this.stopAnimation();
  }

  animateSnowfall = (time = Date.now()) => {
    this.animationFrame = requestAnimationFrame(this.animateSnowfall);
    if (this.snowflakes.length > 0) {
      const {offsetWidth, offsetHeight} = this.node;
      this.snowflakes.forEach(snowflake =>
        snowflake.animate(time, offsetWidth, offsetHeight)
      );
    }
  };

  startAnimation = () => this.animateSnowfall(0);
  stopAnimation = () => cancelAnimationFrame(this.animationFrame);

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const {snowflakeFactory, count, ...props} = this.props;
    if (this.state.renderPermitted) {
      this.snowflakes = [];
      const snowflakeElements = [];
      for (let i = 0; i < count; ++i) {
        snowflakeElements.push(React.cloneElement(snowflakeFactory(i), {
          key: i,
          ref: this.pushSnowflake
        }));
      }
      return (
        <div {...props} ref={this.setNode}>
          {snowflakeElements}
        </div>
      );
    }
    return null;
  }
}
