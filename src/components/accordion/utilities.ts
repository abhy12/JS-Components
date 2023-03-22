export const PREFIX: string = 'jsc';

export const ACCORDIONSELECTOR: string = `[data-${PREFIX}-accCon]`;

/// https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
export function randomIdGenerator( length: number = 8 ): string  {
   const characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   const charactersLength: number = characters.length;
   let result: string = '';

   for( let i = 0; i < length; i++ )  {
      result += characters.charAt( Math.floor( Math.random() * charactersLength ) );
   }

   return result;
}
