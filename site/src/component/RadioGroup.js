import { useCallback } from 'react';

export default function RadioGroup({ name, values, selected, onSelect = () => {}, children, className = '', ...props }) {
  // TODO: put click handler on the parent element?
  return (
    <div className={`${name}-options${ className ? ` ${className}` : ''}`} {...props}>
    {
      values.map((value) => (
        <RadioOption key={`${value}`} name={name} value={value} selected={selected} onSelect={onSelect}>
          {
            children
          }
        </RadioOption>
      ))
    }
    </div>
  );
}

function RadioOption({ name, value, selected, onSelect = () => {}, children }) {
  // TODO: accept value as an object, take disabled, etc.
  return (
    <div className={`${name}-options__option${ selected === value ? ' selected' : ''}`} onClick={() => onSelect(value)}>
      {
        children(value)
      }
    </div>
  );
}
