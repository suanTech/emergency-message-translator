declare module './dictionary' {
  const dictionary: {id: number, language: string, translation: {[key: string]: string}}[];
  export default dictionary;
}