import AvatarImg from './AvatarImg';
import { Polaroid } from './ui';
import { RadioGroup, CheckLgIcon } from './util';
import { usePseudorandom } from '../hook';
import { presets } from '../model';

export default function BotOptions({ values = presets.ids, ...props }) {
  const rand = usePseudorandom({ salt: 'bot-options' });
  return (
    <RadioGroup name="bot" values={values} {...props} >
      {
        (value) => (
          <Polaroid className="avatar" tilt={tilt(rand())}>
            <AvatarImg id={value} />
            <CheckLgIcon className="avatar__check" />
          </Polaroid>
        )
      }
    </RadioGroup>
  );
}

const MAX_TILT = 5;

function tilt(n) {
  return (n * 2 - 1) * MAX_TILT;
}
