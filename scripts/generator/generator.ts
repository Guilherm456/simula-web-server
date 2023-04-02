import { existsSync, readdirSync, writeFileSync } from 'fs';

export default function generator() {
  if (process.argv.length < 4) {
    console.error('Folder and name is required');
    return;
  }
  const folder = process.argv[2];
  const name = process.argv[3];

  if (!existsSync(folder)) {
    console.error('Folder does not exist');
    return;
  }

  const files = readdirSync(folder);
  let schemaCode = `import { Schema } from 'mongoose';

  export const ${name}Schema = new Schema({`;

  let dtoCode = `import {
    ArrayMinSize,
    ArrayNotEmpty,
    IsArray,
    IsNotEmptyObject,
    ValidateNested,
  } from 'class-validator';
  
  export class ${name}DTO {
  `;

  for (const file of files) {
    const name = file.replace('.csv', '');
    schemaCode += `\n'${name}': [],`;
    dtoCode += `\n@IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsNotEmptyObject({}, { each: true })
    '${name}': any[] | String;\n`;
  }
  dtoCode += '}';
  schemaCode += '});';

  writeFileSync(
    `src/Mongo/Schemas/${name.toLowerCase()}.base.schema.ts`,
    schemaCode,
  );
  writeFileSync(`src/DTO/${name.toLowerCase()}.base.dto.ts`, dtoCode);
}

generator();
