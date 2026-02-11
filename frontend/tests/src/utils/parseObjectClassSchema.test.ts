import { test, describe } from 'vitest';

import parseObjectClassSchema from '../../../src/utils/parseObjectClassSchema';
import type { objectClassSchema } from '../../../src/utils/types';

const testData: {
  rawSchema: string,
  expectedResult: objectClassSchema
}[] = [
    {
      rawSchema: '( 2.5.6.6 NAME \'person\' SUP top STRUCTURAL MUST ( sn $ cn) MAY ( userPassword $ telephoneNumber $ seeAlso $ description ) )',

      expectedResult: {
        oid: '2.5.6.6',
        names: [
          'person'
        ],
        description: undefined,
        obsolete: false,
        superiorObjectClasses: [
          'top'
        ],
        type: 'STRUCTURAL',
        reqAttributes: [
          'cn',
          'sn'
        ],
        optAttributes: [
          'userPassword',
          'telephoneNumber',
          'seeAlso',
          'description'
        ]
      }
    },
    {
      rawSchema: '( 2.5.6.6 NAME \'person\' SUP top STRUCTURAL MUST ( sn $cn ) MAY (userPassword$telephoneNumber$seeAlso$description))',

      expectedResult: {
        oid: '2.5.6.6',
        names: [
          'person'
        ],
        description: undefined,
        obsolete: false,
        superiorObjectClasses: [
          'top'
        ],
        type: 'STRUCTURAL',
        reqAttributes: [
          'cn',
          'sn'
        ],
        optAttributes: [
          'userPassword',
          'telephoneNumber',
          'seeAlso',
          'description'
        ]
      }
    },
    {
      rawSchema: '( 2.5.6.6 NAME \'person\' SUP (top $tops) STRUCTURAL MUST ( sn $ cn) MAY ( userPassword $ telephoneNumber $ seeAlso $ description ) )',

      expectedResult: {
        oid: '2.5.6.6',
        names: [
          'person'
        ],
        description: undefined,
        obsolete: false,
        superiorObjectClasses: [
          'top',
          'tops'
        ],
        type: 'STRUCTURAL',
        reqAttributes: [
          'cn',
          'sn'
        ],
        optAttributes: [
          'userPassword',
          'telephoneNumber',
          'seeAlso',
          'description'
        ]
      }
    },
    {
      rawSchema: '( 2.5.6.6 NAME \'person\' STRUCTURAL MUST ( sn $ cn) MAY ( userPassword $ telephoneNumber $ seeAlso $ description ) )',

      expectedResult: {
        oid: '2.5.6.6',
        names: [
          'person'
        ],
        description: undefined,
        obsolete: false,
        superiorObjectClasses: undefined,
        type: 'STRUCTURAL',
        reqAttributes: [
          'cn',
          'sn'
        ],
        optAttributes: [
          'userPassword',
          'telephoneNumber',
          'seeAlso',
          'description'
        ]
      }
    },
    {
      rawSchema: '( 2.5.6.6 NAME \'person\' SUP (top $tops) ABSTRACT MUST ( sn $ cn) MAY ( userPassword $ telephoneNumber $ seeAlso $ description ) )',

      expectedResult: {
        oid: '2.5.6.6',
        names: [
          'person'
        ],
        description: undefined,
        obsolete: false,
        superiorObjectClasses: [
          'top',
          'tops'
        ],
        type: 'ABSTRACT',
        reqAttributes: [
          'cn',
          'sn'
        ],
        optAttributes: [
          'userPassword',
          'telephoneNumber',
          'seeAlso',
          'description'
        ]
      }
    },
    {
      rawSchema: '( 2.5.6.6 NAME \'person\' SUP (top $tops) AUXILIARY MUST ( sn $ cn) MAY ( userPassword $ telephoneNumber $ seeAlso $ description ) )',

      expectedResult: {
        oid: '2.5.6.6',
        names: [
          'person'
        ],
        description: undefined,
        obsolete: false,
        superiorObjectClasses: [
          'top',
          'tops'
        ],
        type: 'AUXILIARY',
        reqAttributes: [
          'cn',
          'sn'
        ],
        optAttributes: [
          'userPassword',
          'telephoneNumber',
          'seeAlso',
          'description'
        ]
      }
    },
    {
      rawSchema: '( 2.5.6.6 NAME \'person\' SUP top MUST ( sn $ cn) MAY ( userPassword $ telephoneNumber $ seeAlso $ description ) )',

      expectedResult: {
        oid: '2.5.6.6',
        names: [
          'person'
        ],
        description: undefined,
        obsolete: false,
        superiorObjectClasses: [
          'top'
        ],
        type: 'INPARENT',
        reqAttributes: [
          'cn',
          'sn'
        ],
        optAttributes: [
          'userPassword',
          'telephoneNumber',
          'seeAlso',
          'description'
        ]
      }
    },
    {
      rawSchema: '( 2.5.6.6 NAME \'person\' OBSOLETE SUP (top $tops) ABSTRACT MUST ( sn $ cn) MAY ( userPassword $ telephoneNumber $ seeAlso $ description ) )',

      expectedResult: {
        oid: '2.5.6.6',
        names: [
          'person'
        ],
        description: undefined,
        obsolete: true,
        superiorObjectClasses: [
          'tops',
          'top'
        ],
        type: 'ABSTRACT',
        reqAttributes: [
          'cn',
          'sn'
        ],
        optAttributes: [
          'userPassword',
          'telephoneNumber',
          'seeAlso',
          'description'
        ]
      }
    },
    {
      rawSchema: '( 2.5.6.6 NAME \'person\' OBSOLETE SUP (top $tops) ABSTRACT MUST cn MAY ( userPassword $ telephoneNumber $ seeAlso $ description ) )',

      expectedResult: {
        oid: '2.5.6.6',
        names: [
          'person'
        ],
        description: undefined,
        obsolete: true,
        superiorObjectClasses: [
          'tops',
          'top'
        ],
        type: 'ABSTRACT',
        reqAttributes: [
          'cn',
        ],
        optAttributes: [
          'userPassword',
          'telephoneNumber',
          'seeAlso',
          'description'
        ]
      }
    },
    {
      rawSchema: '( 2.5.6.16 NAME \'certificationAuthority\' DESC \'RFC2256: a certificate authority\' SUP top AUXILIARY MUST ( authorityRevocationList $ certificateRevocationList $ cACertificate ) MAY crossCertificatePair )',

      expectedResult: {
        oid: '2.5.6.16',
        names: [
          'certificationAuthority'
        ],
        description: 'RFC2256: a certificate authority',
        superiorObjectClasses: [
          'top'
        ],
        obsolete: false,
        type: 'AUXILIARY',
        reqAttributes: [
          'authorityRevocationList',
          'certificateRevocationList',
          'cACertificate'
        ],
        optAttributes: [
          'crossCertificatePair'
        ]
      }
    },
    {
      rawSchema: '( 0.9.2342.19200300.100.4.4 NAME ( \'pilotPerson\' \'newPilotPerson\' ) SUP person STRUCTURAL MAY ( userid $ textEncodedORAddress $ rfc822Mailbox $ favouriteDrink $ roomNumber $ userClass $ homeTelephoneNumber $ homePostalAddress $ secretary $ personalTitle $ preferredDeliveryMethod $ businessCategory $ janetMailbox $ otherMailbox $ mobileTelephoneNumber $ pagerTelephoneNumber $ organizationalStatus $ mailPreferenceOption $ personalSignature ) )',

      expectedResult: {
        oid: '0.9.2342.19200300.100.4.4',
        names: [
          'pilotPerson',
          'newPilotPerson'
        ],
        description: undefined,
        obsolete: false,
        superiorObjectClasses: [
          'person'
        ],
        type: 'STRUCTURAL',
        reqAttributes: undefined,
        optAttributes: [
          'userid',
          'textEncodedORAddress',
          'rfc822Mailbox',
          'favouriteDrink',
          'roomNumber',
          'userClass',
          'homeTelephoneNumber',
          'homePostalAddress',
          'secretary',
          'personalTitle',
          'preferredDeliveryMethod',
          'businessCategory',
          'janetMailbox',
          'otherMailbox',
          'mobileTelephoneNumber',
          'pagerTelephoneNumber',
          'organizationalStatus',
          'mailPreferenceOption',
          'personalSignature'
        ]
      }
    },
    {
      rawSchema: '( 2.5.6.6 SUP top STRUCTURAL MUST ( sn $ cn) MAY ( userPassword $ telephoneNumber $ seeAlso $ description ) )',

      expectedResult: {
        oid: '2.5.6.6',
        names: undefined,
        description: undefined,
        obsolete: false,
        superiorObjectClasses: [
          'top'
        ],
        type: 'STRUCTURAL',
        reqAttributes: [
          'cn',
          'sn'
        ],
        optAttributes: [
          'userPassword',
          'telephoneNumber',
          'seeAlso',
          'description'
        ]
      }
    },
    {
      rawSchema: '( 2.5.6.6 NAME \'person\' SUP top STRUCTURAL MUST ( sn $ cn) )',

      expectedResult: {
        oid: '2.5.6.6',
        names: [
          'person'
        ],
        description: undefined,
        obsolete: false,
        superiorObjectClasses: [
          'top'
        ],
        type: 'STRUCTURAL',
        reqAttributes: [
          'cn',
          'sn'
        ],
        optAttributes: undefined
      }
    },
  ];

const assertSchemaArraysEqual = (schemaOneArr: string[] | undefined, schemaTwoArr: string[] | undefined, arrName: string) => {
  if (schemaOneArr === undefined) {
    if (schemaTwoArr !== undefined) {
      throw new Error(`schema one ${arrName} undefined but schema two was not`);
    }
  } else {
    if (schemaTwoArr === undefined) {
      throw new Error(`schema one ${arrName} was not undefined but schema two was`);
    }

    if (schemaOneArr.length !== schemaTwoArr.length) {
      throw new Error(`schema one ${arrName} array was of length ${schemaOneArr.length} but schema two was of length ${schemaTwoArr.length}`);
    }

    for (const schemaOneArrElement of schemaOneArr) {
      const found = schemaTwoArr.find((schemaTwoArrElement) => schemaTwoArrElement === schemaOneArrElement);

      if (found === undefined) {
        throw new Error(`schema one ${arrName} array element ${schemaOneArrElement} not found in schema two array`);
      }
    }
  }
};

const assertObjectClassSchemaEqual = (schemaOne: objectClassSchema, schemaTwo: objectClassSchema) => {
  if (schemaOne.oid !== schemaTwo.oid) {
    throw new Error(`oid ${schemaOne.oid} did not equal ${schemaTwo.oid}`);
  }

  assertSchemaArraysEqual(schemaOne.names, schemaTwo.names, 'names');

  if (schemaOne.description === undefined) {
    if (schemaTwo.description !== undefined) {
      throw new Error(`schema one descriptions was undefined but schema two description was ${schemaTwo.description}`);
    }
  } else {
    if (schemaTwo.description === undefined) {
      throw new Error(`schema one description was ${schemaOne.description} but schema two description was undefined`);
    }
  }

  if (schemaOne.obsolete !== schemaTwo.obsolete) {
    throw new Error(`schema one obsolete was ${schemaOne.obsolete.toString()} but schema two obsolete was ${schemaTwo.obsolete.toString()}`);
  }

  assertSchemaArraysEqual(schemaOne.superiorObjectClasses, schemaTwo.superiorObjectClasses, 'superior object classes');

  if (schemaOne.type !== schemaTwo.type) {
    throw new Error(`schema one type was ${schemaOne.type} but schema two type was ${schemaTwo.type}`);
  }

  assertSchemaArraysEqual(schemaOne.reqAttributes, schemaTwo.reqAttributes, 'required attributes');

  assertSchemaArraysEqual(schemaOne.optAttributes, schemaTwo.optAttributes, 'optional arributes');
};

describe('parseObjectClassSchema.ts tests', () => {
  test('parse tests', () => {
    testData.forEach((testSchema) => {
      const computedSchema = parseObjectClassSchema(testSchema.rawSchema);

      assertObjectClassSchemaEqual(computedSchema, testSchema.expectedResult);
    });
  });
});
