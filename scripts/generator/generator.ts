import { existsSync, readFileSync, readdirSync, writeFileSync } from 'fs';

export default function generator() {
  if (process.argv.length < 5) {
    console.error('Folder and name is required');
    return;
  }
  const folder = process.argv[2];
  const name = process.argv[3];
  const outputFolder = process.argv[4];

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
  
  export class ${name}StructureDTO {
  `;

  for (const file of files) {
    const name = file.replace('.csv', '');
    schemaCode += `\n'${name}': [],`;
    dtoCode += `\n
    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @IsNotEmptyObject({}, { each: true })
    '${name}': any[] | String;\n`;
  }
  dtoCode += '}';
  schemaCode += '});';

  const nameLowerCase = name.toLowerCase();
  writeFileSync(
    `src/Mongo/Schemas/${nameLowerCase}.base.schema.ts`,
    schemaCode,
  );
  writeFileSync(`src/DTO/${nameLowerCase}.base.dto.ts`, dtoCode);

  const indexFile = readFileSync('src/Mongo/Schemas/index.ts').toString();
  if (!indexFile.includes(`${nameLowerCase}`)) {
  }

  //Adiciona o tipo do schema no arquivo types.interface.ts
  const types = readFileSync(
    'src/Mongo/Interface/types.inteface.ts',
  ).toString();
  if (!types.includes(`'${nameLowerCase}'`)) {
    const index = types.indexOf(';');
    const newTypes =
      types.slice(0, index) + ` | '${nameLowerCase}'` + types.slice(index);
    writeFileSync('src/Mongo/Interface/types.inteface.ts', newTypes);
  }

  //Adiciona o schema no arquivo base.schemas.ts
  const base = readFileSync('src/Mongo/Schemas/base.schemas.ts').toString();
  if (!base.includes(`${nameLowerCase}`)) {
    const index = base.indexOf('parameters: ');
    const newBase =
      base.slice(0, index + 12) + `${name}Schema || ` + base.slice(index + 12);
    writeFileSync('src/Mongo/Schemas/base.schemas.ts', newBase);
  }

  const structures = readFileSync(
    'src/modules/base/structures.object.ts',
  ).toString();
  if (!structures.includes(`${name}Structure`)) {
    let newStructure =
      structures +
      `\n
    export const ${name}Structure: StructuresInterface = {
      name: '${name}',
      states: [
      ],
      type_parameters: {`;
    for (const file of files) {
      const name = file.replace('.csv', '');
      newStructure += `\n        '${name}': [],`;
    }
    newStructure += `\n},
      defaultSearch: [],
      outputFolder: '${outputFolder}',
    };`;
    writeFileSync('src/modules/base/structures.object.ts', newStructure);
  }
}

generator();
