import { presets } from '../model';

export default function AvatarImg({ id, imageUrl, className = '', ...props } = {}) {
  imageUrl = imageUrl || presets.get(id).avatar;
  return (
    <img className={`avatar-img ${className}`} src={imageUrl} {...props} />
  );
}
