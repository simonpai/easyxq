import Avatar from './Avatar.js';
import { RadioGroup } from './util/index.js';
import { usePseudorandom } from '../hook/index.js';
import { bots } from '../model/index.js';

const PRESETS = bots.presets.map(p => p.id);

export default function BotOptions({ values = PRESETS, ...props }) {
  const rand = usePseudorandom({ salt: 'bot-options' });
  return (
    <RadioGroup name="bot" values={values} {...props} >
      {
        (value) => (
          <Avatar imageUrl={`img/avatar/${bots.get(value).avatar}`} tilt={tilt(rand())} />
        )
      }
    </RadioGroup>
  );
}

const MAX_TILT = 5;

function tilt(n) {
  return (n * 2 - 1) * MAX_TILT;
}
