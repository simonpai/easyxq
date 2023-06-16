import { useTranslation } from 'react-i18next';
import { ROOM, COLOR, colors, pids, Ply } from '@easyxq/sdk';
import { useScrollTo } from '../hook';
import Piece from './Piece.js';
import SvgSprite from './SvgSprite.js';
import { resultMessage } from './utils.js';

const { EVENT } = ROOM;

export default function RoomMessages({ mirror, events }) {
  const { t } = useTranslation();
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
                <Message key={`${i}`} from="narrator">
                  { t('game-starts') }
                </Message>,
              ];
            case EVENT.END:
              const { result } = event;
              return [
                <Message key={`${i}`} from="narrator">
                  { resultMessage(t, result) }
                </Message>,
              ];
            case EVENT.MOVE:
              const { ply, check } = event;
              const { color, captured } = Ply.decode(ply);
              const from = (color === COLOR.RED) ^ mirror ? 'lower' : 'upper';
              let j = 0;
              const messages = [
                <Message key={`${i}-${j++}`} color={color} from={from}>
                  { event.takeback ? <s>{ event.notation }</s> : event.notation }
                </Message>
              ];
              if (pids.isPiece(captured)) {
                // TODO: takeback
                messages.push(
                  <Message key={`${i}-${j++}`} color={color} from={from}>
                    { t('capture') }
                    <Piece pid={captured} />
                  </Message>
                );
              }
              if (check) {
                // TODO: takeback
                messages.push(
                  <Message key={`${i}-${j++}`} color={color} from={from}>
                    { t('check') }
                  </Message>
                );
              }
              return messages;
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

function Message({ from, color, children }) {
  return from === 'narrator' ?
    <NarrativeMessage>{ children }</NarrativeMessage> :
    <BubbleMessage from={from} color={color}>{ children }</BubbleMessage>;
}

function NarrativeMessage({ children }) {
  return (
    <li className="message" data-from="narrator">
      <div className="message__inner">
        { children }
      </div>
    </li>
  );
}

function BubbleMessage({ from, color, children }) {
  return (
    <li className="message" data-from={from} data-color={colors.en(color)}>
      <div className="message__inner">
        <div className="message__bubble">
          { children }
        </div>
        <SvgSprite className="message__tail" file="icons" id="speech-bubble-tail" />
      </div>
    </li>
  );
}