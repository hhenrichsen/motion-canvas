import {makeProject} from '@motion-canvas/core';
import {Vector2} from '@motion-canvas/core/lib/types';

import example from './scenes/example?scene';

export default makeProject({
  scenes: [example],
  background: '#141414',
  size: new Vector2(2560, 1440),
});
