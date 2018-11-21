export const isPrintableChar = event => event.key.length === 1;

export const isCtrlOrCmd = event => event.ctrlKey || event.metaKey;

export const isSpace = event => event.key === " ";
