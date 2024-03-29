import { PIECE } from '@easyxq/sdk';
import Piece from './Piece';
import { SvgSprite, RadioGroup } from './util';

const COLOR_OPTIONS = [
  'red',
  'black',
  'random',
];

export default function ColorOptions({ values = COLOR_OPTIONS, ...props }) {
  return (
    <RadioGroup name="color" values={values} {...props} >
      {
        (value) => value === 'random' ? (
          <Piece className="black ringless">
            <SvgSprite className="piece--char" file="icons" id="colored-dice" />
          </Piece>
        ) : (
          <Piece piece={value === 'red' ? PIECE.RK : PIECE.BK} />
        )
      }
    </RadioGroup>
  );
}
