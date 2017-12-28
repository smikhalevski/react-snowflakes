# React Snowflakes

![Frank Sinatra](sinatra.png)

> “Let it snow on your React website!” – Frank Sinatra<sup><a href="https://www.youtube.com/watch?v=aQzlJRjXSGY">1</a></sup>

## How to use?

```jsx
import {DepthOfFieldSnowfall} from 'react-snowflakes';

// Insert anywhere in your code and that's it!
<DepthOfFieldSnowfall count={50}
                      style={{
                        // Position must be relative or absolute,
                        // because snowflakes are positioned absolutely.
                        position: 'relative',
                        width: '300px',
                        height: '300px'
                      }}/>
```

You can have more control over snowflakes with `Snowfall`:

```jsx
import {Snowfall, Snowflake} from 'react-snowflakes';

<Snowfall count={50}
          style={{
            position: 'relative',
            width: '300px',
            height: '300px'
          }}
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
                           backgroundColor: 'white',
                           opacity: .2 + .8 * size,
                           filter: `blur(${Math.round(Math.max(size - .5, 0) * 15)}px)`
                         }}/>
            )
          }}/>
```

## License

The code is available under [MIT licence](LICENSE).
