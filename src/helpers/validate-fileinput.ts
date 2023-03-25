import { FILEINPUT_ALLOWEDFILES, FILEINPUT_ALLOWEDTYPES, FILEINPUT_MAXSIZE } from './constants';

/**
 * Validates a file from the fileinput on filetype and filesiez
 * @param file The file to be validated
 * @returns An object with validation status and message {valid: boolean, message: string}
 */
export const validateFileinput = (file: File) => {
  let validation: { valid: boolean; message: string } = { valid: true, message: '' };

  if (!file.type.match(FILEINPUT_ALLOWEDTYPES)) {
    return (validation = { valid: false, message: `Falsches Dateiformat - Erlaubt sind ${FILEINPUT_ALLOWEDFILES}` });
  }
  if (file.size > FILEINPUT_MAXSIZE) {
    return (validation = { valid: false, message: `Maximale Dateigrösse ist ${FILEINPUT_MAXSIZE / 1024 / 1024} MB` });
  }

  return validation;
};
