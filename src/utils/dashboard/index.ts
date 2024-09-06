export const retrieveIconPath = (iconName: string) => {
  return `${process.env['REACT_APP_FILES_URL']}${iconName}`;
};

export * from './constants';
export * from './units';
