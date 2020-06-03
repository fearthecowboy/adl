/**  
 * Prepares a string for use as a TypeScript identifier.
 * 
 * if the string contains non alphanumeric characters, it is quoted.
 * 
*/
export function normalizeIdentifier(value: string) {
  return /[^\w]/g.exec(value) ? `'${value.replace(/'/g, '\\\'')}'` : value;
}

export function literal(value: string | number | boolean | null | undefined) {
  if (value === null) {
    return 'null';
  }
  if (value === undefined) {
    return 'undefined';
  }
  if (typeof value == 'string') {
    return stringLiteral(value);
  }
  return value.toString();
}

export function stringLiteral(value: string) {
  return JSON.stringify(value || '');

}

export function normalizeName(value: string ) {
  if (/^[^a-zA-Z]/.test(value)) {
    // \w matches digits, but we can't lead with a digit
    value = `_${value}`;
  }

  return value.replace(/[^\w]+/g, '_');
}