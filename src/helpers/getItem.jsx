export function getItem(label1, key, icon, children, type, disabled, inactive) {
  const label = inactive ? <div style={{color: '#969696'}}>{label1}</div> : label1;
  return { key, icon, children, label, type, disabled };
}