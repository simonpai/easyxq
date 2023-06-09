import { bot } from '@easyxq/sdk';
import Avatar from './Avatar.js';
import RadioGroup from './RadioGroup.js';

const BOT_OPTIONS = bot.factory.presets.map(p => p.preset);

export default function BotOptions({ values = BOT_OPTIONS, ...props }) {
  return (
    <RadioGroup name="bot" values={values} {...props} >
      {
        (value) => (
          <Avatar className="bronze" imageUrl={`img/avatar/${value}.png`} />
        )
      }
    </RadioGroup>
  );
}
