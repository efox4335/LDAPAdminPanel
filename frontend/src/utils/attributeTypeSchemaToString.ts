import type { attributeTypeSchema } from './types';
import createLdapSchemaList from './createLdapSchemaList';

const attributeTypeSchemaToString = (schema: attributeTypeSchema): string => {
  let attributeTypeString = `( ${schema.oid}`;

  if (schema.name !== undefined) {
    attributeTypeString = attributeTypeString.concat(' NAME');

    if (schema.name.length === 1) {
      attributeTypeString = attributeTypeString.concat(` '${schema.name[0]}'`);
    } else {
      attributeTypeString = attributeTypeString.concat(` ${createLdapSchemaList(schema.name.map((name) => '\''.concat(name).concat('\'')), false)}`);
    }
  }

  if (schema.description !== undefined) {
    attributeTypeString = attributeTypeString.concat(` DESC '${schema.description}'`);
  }

  if (schema.obsolete) {
    attributeTypeString = attributeTypeString.concat(' OBSOLETE');
  }

  if (schema.superiorAttributeType !== undefined) {
    attributeTypeString = attributeTypeString.concat(` SUP ${schema.superiorAttributeType}`);
  }

  if (schema.eqMatchingRule !== undefined) {
    attributeTypeString = attributeTypeString.concat(` EQUALITY ${schema.eqMatchingRule}`);
  }

  if (schema.ordMatchingRule !== undefined) {
    attributeTypeString = attributeTypeString.concat(` ORDERING ${schema.ordMatchingRule}`);
  }

  if (schema.subStrMatchingRule !== undefined) {
    attributeTypeString = attributeTypeString.concat(` SUBSTR ${schema.subStrMatchingRule}`);
  }

  if (schema.attributeSyntax !== undefined) {
    attributeTypeString = attributeTypeString.concat(` SYNTAX ${schema.attributeSyntax.oid}`);

    if (schema.attributeSyntax.size !== undefined) {
      attributeTypeString = attributeTypeString.concat(`{${schema.attributeSyntax.size}}`);
    }
  }

  if (schema.singleValue) {
    attributeTypeString = attributeTypeString.concat(' SINGLE-VALUE');
  }

  if (schema.collective) {
    attributeTypeString = attributeTypeString.concat(' COLLECTIVE');
  }

  if (schema.noUserMod) {
    attributeTypeString = attributeTypeString.concat(' NO-USER-MODIFICATION');
  }

  if (schema.usage !== undefined) {
    attributeTypeString = attributeTypeString.concat(' USAGE');

    switch (schema.usage) {
      case 'DIRECTORYOPERATION':
        attributeTypeString = attributeTypeString.concat(' directoryOperation');

        break;
      case 'DISTRIBUTEDOPERATION':
        attributeTypeString = attributeTypeString.concat(' distributedOperation');

        break;
      case 'DSAOPERATION':
        attributeTypeString = attributeTypeString.concat(' dSAOperation');

        break;
      case 'USERAPPLICATIONS':
        attributeTypeString = attributeTypeString.concat(' userApplications');

        break;
    }
  }

  if (schema.extensions !== undefined) {
    schema.extensions.forEach((extension) => {
      attributeTypeString = attributeTypeString.concat(` ${extension.name}`);

      if (extension.value.length === 1) {
        attributeTypeString = attributeTypeString.concat(` '${extension.value[0]}'`);
      } else {
<<<<<<< HEAD
        attributeTypeString = attributeTypeString.concat(` ${createLdapSchemaList(extension.value.map((value) => '\''.concat(value).concat('\'')), false)}`);
=======
        attributeTypeString = attributeTypeString.concat(` ${createLdapSchemaList(extension.value.map((name) => '\''.concat(name).concat('\'')), false)}`);
>>>>>>> refs/remotes/origin/main
      }
    });
  }

  attributeTypeString = attributeTypeString.concat(' )');

  return attributeTypeString;
};

export default attributeTypeSchemaToString;
