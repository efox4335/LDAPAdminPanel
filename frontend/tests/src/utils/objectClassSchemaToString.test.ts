import { test, expect, describe } from 'vitest';

import type { objectClassSchema } from '../../../src/utils/types';
import objectClassSchemaToString from '../../../src/utils/objectClassSchemaToString';

const testData: {
  rawSchema: objectClassSchema,
  expectedResult: string
}[] = [
    {
      expectedResult: '( 2.5.6.6 NAME \'person\' SUP top STRUCTURAL MUST ( cn $ sn ) MAY ( userPassword $ telephoneNumber $ seeAlso $ description ) )',

      rawSchema: {
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
      expectedResult: '( 2.5.6.6 NAME \'person\' SUP top STRUCTURAL MUST ( cn $ sn ) MAY ( userPassword $ telephoneNumber $ seeAlso $ description ) )',

      rawSchema: {
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
      expectedResult: '( 2.5.6.6 NAME \'person\' SUP ( top $ tops ) STRUCTURAL MUST ( cn $ sn ) MAY ( userPassword $ telephoneNumber $ seeAlso $ description ) )',

      rawSchema: {
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
      expectedResult: '( 2.5.6.6 NAME \'person\' STRUCTURAL MUST ( cn $ sn ) MAY ( userPassword $ telephoneNumber $ seeAlso $ description ) )',

      rawSchema: {
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
      expectedResult: '( 2.5.6.6 NAME \'person\' SUP ( top $ tops ) ABSTRACT MUST ( cn $ sn ) MAY ( userPassword $ telephoneNumber $ seeAlso $ description ) )',

      rawSchema: {
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
      expectedResult: '( 2.5.6.6 NAME \'person\' SUP ( top $ tops ) AUXILIARY MUST ( cn $ sn ) MAY ( userPassword $ telephoneNumber $ seeAlso $ description ) )',

      rawSchema: {
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
      expectedResult: '( 2.5.6.6 NAME \'person\' SUP top MUST ( cn $ sn ) MAY ( userPassword $ telephoneNumber $ seeAlso $ description ) )',

      rawSchema: {
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
      expectedResult: '( 2.5.6.6 NAME \'person\' OBSOLETE SUP ( tops $ top ) ABSTRACT MUST ( cn $ sn ) MAY ( userPassword $ telephoneNumber $ seeAlso $ description ) )',

      rawSchema: {
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
      expectedResult: '( 2.5.6.6 NAME \'person\' OBSOLETE SUP ( tops $ top ) ABSTRACT MUST cn MAY ( userPassword $ telephoneNumber $ seeAlso $ description ) )',

      rawSchema: {
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
      expectedResult: '( 2.5.6.16 NAME \'certificationAuthority\' DESC \'RFC2256: a certificate authority\' SUP top AUXILIARY MUST ( authorityRevocationList $ certificateRevocationList $ cACertificate ) MAY crossCertificatePair )',

      rawSchema: {
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
      expectedResult: '( 0.9.2342.19200300.100.4.4 NAME ( \'pilotPerson\' \'newPilotPerson\' ) SUP person STRUCTURAL MAY ( userid $ textEncodedORAddress $ rfc822Mailbox $ favouriteDrink $ roomNumber $ userClass $ homeTelephoneNumber $ homePostalAddress $ secretary $ personalTitle $ preferredDeliveryMethod $ businessCategory $ janetMailbox $ otherMailbox $ mobileTelephoneNumber $ pagerTelephoneNumber $ organizationalStatus $ mailPreferenceOption $ personalSignature ) )',

      rawSchema: {
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
      expectedResult: '( 2.5.6.6 SUP top STRUCTURAL MUST ( cn $ sn ) MAY ( userPassword $ telephoneNumber $ seeAlso $ description ) )',

      rawSchema: {
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
      expectedResult: '( 2.5.6.6 NAME \'person\' SUP top STRUCTURAL MUST ( cn $ sn ) )',

      rawSchema: {
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

describe('objectClassSchemaToString.ts tests', () => {
  test('tests', () => {
    testData.forEach((schema) => {
      const result = objectClassSchemaToString(schema.rawSchema);

      expect(result).toStrictEqual(schema.expectedResult);
    });
  });
});
