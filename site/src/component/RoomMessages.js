import { ROOM, COLOR, colors, pids, Ply } from '@easyxq/sdk';
import { useScrollTo } from '../hook';
import Piece from './Piece.js';
import SvgSprite from './SvgSprite.js';
import { resultMessage } from './utils.js';

const { EVENT } = ROOM;

export default function RoomMessages({ t, mirror, events }) {
  const [ref] = useScrollTo([events.length]);
  return [
    <div key="top" className="messages-top-shadow" />,
    <ul key="messages" className="messages">
      {
        events.flatMap((event, i) => {
          const { name } = event;
          switch (name) {
            case EVENT.START:
              return [
                <Message key={`${i}`} from="narrator">{ t('game-starts') }</Message>,
              ];
            case EVENT.END:
              const { result } = event;
              return [
                <Message key={`${i}`} from="narrator">{ resultMessage(t, result) }</Message>,
              ];
            case EVENT.MOVE:
              const { ply, check, revoked } = event;
              const { color, captured } = Ply.decode(ply);
              const from = (color === COLOR.RED) ^ mirror ? 'lower' : 'upper';
              let j = 0;

              const entries = [
                [event.notation],
              ];
              pids.isPiece(captured) && entries.push([ t('capture'), <Piece key="piece" pid={captured} className="flat" /> ]);
              check && entries.push([ t('check') ]);
              return entries.map(children => <Message key={`${i}-${j++}`} color={color} from={from} revoked={revoked}>{ children }</Message>);
            default:
              return [];
          }
        })
      }
      <li className="messages__bottom" ref={ref} />
    </ul>,
    <div key="bottom" className="messages-bottom-shadow" />,
  ];
}

function Message({ from, color, revoked = false, children }) {
  return from === 'narrator' ?
    <NarrativeMessage revoked={revoked}>{ children }</NarrativeMessage> :
    <BubbleMessage from={from} color={color} revoked={revoked}>{ children }</BubbleMessage>;
}

function NarrativeMessage({ revoked, children }) {
  const classNames = ['message'];
  revoked && classNames.push('revoked');
  return (
    <li className={classNames.join(' ')} data-from="narrator">
      <div className="message__inner">
        { children }
      </div>
    </li>
  );
}

function BubbleMessage({ from, color, revoked, children }) {
  const classNames = ['message'];
  revoked && classNames.push('revoked');
  return (
    <li className={classNames.join(' ')} data-from={from} data-color={colors.en(color)}>
      <div className="message__inner">
        <div className="message__bubble">
          { children }
        </div>
        <SvgSprite className="message__tail" file="icons" id="speech-bubble-tail" />
      </div>
    </li>
  );
}