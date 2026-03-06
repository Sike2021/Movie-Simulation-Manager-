const SOUNDS = {
  click: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  success: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
  notification: 'https://assets.mixkit.co/active_storage/sfx/2357/2357-preview.mp3',
  money: 'https://assets.mixkit.co/active_storage/sfx/2017/2017-preview.mp3',
};

export const playSound = (soundName: keyof typeof SOUNDS) => {
  const audio = new Audio(SOUNDS[soundName]);
  audio.volume = 0.3;
  audio.play().catch(e => console.log('Audio play blocked', e));
};
