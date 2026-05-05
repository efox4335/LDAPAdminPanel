import { test, expect, describe } from 'vitest';

import attributeTypeSchemaToString from '../../../src/utils/attributeTypeSchemaToString';
import type { attributeTypeSchema } from '../../../src/utils/types';

const testData: {
  result: string,
  schema: attributeTypeSchema
}[] = [
    {
      result: '( 2.5.18.3 NAME \'creatorsName\' DESC \'RFC4512: name of creator\' EQUALITY distinguishedNameMatch SYNTAX 1.3.6.1.4.1.1466.115.121.1.12 SINGLE-VALUE NO-USER-MODIFICATION USAGE directoryOperation )',
      schema: {
        oid: '2.5.18.3',
        name: [
          'creatorsName'
        ],
        description: 'RFC4512: name of creator',
        obsolete: false,
        superiorAttributeType: undefined,
        eqMatchingRule: 'distinguishedNameMatch',
        ordMatchingRule: undefined,
        subStrMatchingRule: undefined,
        attributeSyntax: {
          oid: '1.3.6.1.4.1.1466.115.121.1.12',
          size: undefined
        },
        singleValue: true,
        collective: false,
        noUserMod: true,
        usage: 'DIRECTORYOPERATION',
        extensions: undefined
      }
    },
    {
      result: '( 2.5.18.3 NAME ( \'creatorsName\' \'nameB\' ) DESC \'RFC4512: name of creator\' EQUALITY distinguishedNameMatch SYNTAX 1.3.6.1.4.1.1466.115.121.1.12 SINGLE-VALUE NO-USER-MODIFICATION USAGE directoryOperation )',
      schema: {
        oid: '2.5.18.3',
        name: [
          'creatorsName',
          'nameB',
        ],
        description: 'RFC4512: name of creator',
        obsolete: false,
        superiorAttributeType: undefined,
        eqMatchingRule: 'distinguishedNameMatch',
        ordMatchingRule: undefined,
        subStrMatchingRule: undefined,
        attributeSyntax: {
          oid: '1.3.6.1.4.1.1466.115.121.1.12',
          size: undefined
        },
        singleValue: true,
        collective: false,
        noUserMod: true,
        usage: 'DIRECTORYOPERATION',
        extensions: undefined
      }
    },
    {
      result: '( 2.5.18.3 NAME ( \'creatorsName\' \'nameB\' ) DESC \'RFC4512: name of creator\' OBSOLETE EQUALITY distinguishedNameMatch SYNTAX 1.3.6.1.4.1.1466.115.121.1.12 SINGLE-VALUE NO-USER-MODIFICATION USAGE directoryOperation )',
      schema: {
        oid: '2.5.18.3',
        name: [
          'creatorsName',
          'nameB',
        ],
        description: 'RFC4512: name of creator',
        obsolete: true,
        superiorAttributeType: undefined,
        eqMatchingRule: 'distinguishedNameMatch',
        ordMatchingRule: undefined,
        subStrMatchingRule: undefined,
        attributeSyntax: {
          oid: '1.3.6.1.4.1.1466.115.121.1.12',
          size: undefined
        },
        singleValue: true,
        collective: false,
        noUserMod: true,
        usage: 'DIRECTORYOPERATION',
        extensions: undefined
      }
    },
    {
      result: '( 2.5.18.3 NAME ( \'creatorsName\' \'nameB\' ) DESC \'RFC4512: name of creator\' OBSOLETE SUP name EQUALITY distinguishedNameMatch SYNTAX 1.3.6.1.4.1.1466.115.121.1.12 SINGLE-VALUE NO-USER-MODIFICATION USAGE directoryOperation )',
      schema: {
        oid: '2.5.18.3',
        name: [
          'creatorsName',
          'nameB',
        ],
        description: 'RFC4512: name of creator',
        obsolete: true,
        superiorAttributeType: 'name',
        eqMatchingRule: 'distinguishedNameMatch',
        ordMatchingRule: undefined,
        subStrMatchingRule: undefined,
        attributeSyntax: {
          oid: '1.3.6.1.4.1.1466.115.121.1.12',
          size: undefined
        },
        singleValue: true,
        collective: false,
        noUserMod: true,
        usage: 'DIRECTORYOPERATION',
        extensions: undefined
      }
    },
    {
      result: '( 2.5.18.3 NAME ( \'creatorsName\' \'nameB\' ) DESC \'RFC4512: name of creator\' OBSOLETE SUP name EQUALITY distinguishedNameMatch ORDERING 1.2.3.4 SYNTAX 1.3.6.1.4.1.1466.115.121.1.12 SINGLE-VALUE NO-USER-MODIFICATION USAGE directoryOperation )',
      schema: {
        oid: '2.5.18.3',
        name: [
          'creatorsName',
          'nameB',
        ],
        description: 'RFC4512: name of creator',
        obsolete: true,
        superiorAttributeType: 'name',
        eqMatchingRule: 'distinguishedNameMatch',
        ordMatchingRule: '1.2.3.4',
        subStrMatchingRule: undefined,
        attributeSyntax: {
          oid: '1.3.6.1.4.1.1466.115.121.1.12',
          size: undefined
        },
        singleValue: true,
        collective: false,
        noUserMod: true,
        usage: 'DIRECTORYOPERATION',
        extensions: undefined
      }
    },
    {
      result: '( 2.5.18.3 NAME ( \'creatorsName\' \'nameB\' ) DESC \'RFC4512: name of creator\' OBSOLETE SUP name EQUALITY distinguishedNameMatch ORDERING 1.2.3.4 SUBSTR 1.5.4.3 SYNTAX 1.3.6.1.4.1.1466.115.121.1.12 SINGLE-VALUE NO-USER-MODIFICATION USAGE directoryOperation )',
      schema: {
        oid: '2.5.18.3',
        name: [
          'creatorsName',
          'nameB',
        ],
        description: 'RFC4512: name of creator',
        obsolete: true,
        superiorAttributeType: 'name',
        eqMatchingRule: 'distinguishedNameMatch',
        ordMatchingRule: '1.2.3.4',
        subStrMatchingRule: '1.5.4.3',
        attributeSyntax: {
          oid: '1.3.6.1.4.1.1466.115.121.1.12',
          size: undefined
        },
        singleValue: true,
        collective: false,
        noUserMod: true,
        usage: 'DIRECTORYOPERATION',
        extensions: undefined
      }
    },
    {
      result: '( 2.5.18.3 NAME ( \'creatorsName\' \'nameB\' ) DESC \'RFC4512: name of creator\' OBSOLETE SUP name EQUALITY distinguishedNameMatch ORDERING 1.2.3.4 SUBSTR 1.5.4.3 SYNTAX 1.3.6.1.4.1.1466.115.121.1.12{67} SINGLE-VALUE NO-USER-MODIFICATION USAGE directoryOperation )',
      schema: {
        oid: '2.5.18.3',
        name: [
          'creatorsName',
          'nameB',
        ],
        description: 'RFC4512: name of creator',
        obsolete: true,
        superiorAttributeType: 'name',
        eqMatchingRule: 'distinguishedNameMatch',
        ordMatchingRule: '1.2.3.4',
        subStrMatchingRule: '1.5.4.3',
        attributeSyntax: {
          oid: '1.3.6.1.4.1.1466.115.121.1.12',
          size: 67
        },
        singleValue: true,
        collective: false,
        noUserMod: true,
        usage: 'DIRECTORYOPERATION',
        extensions: undefined
      }
    },
    {
      result: '( 2.5.18.3 NAME ( \'creatorsName\' \'nameB\' ) DESC \'RFC4512: name of creator\' OBSOLETE SUP name EQUALITY distinguishedNameMatch ORDERING 1.2.3.4 SUBSTR 1.5.4.3 SYNTAX 1.3.6.1.4.1.1466.115.121.1.12{67} NO-USER-MODIFICATION USAGE directoryOperation )',
      schema: {
        oid: '2.5.18.3',
        name: [
          'creatorsName',
          'nameB',
        ],
        description: 'RFC4512: name of creator',
        obsolete: true,
        superiorAttributeType: 'name',
        eqMatchingRule: 'distinguishedNameMatch',
        ordMatchingRule: '1.2.3.4',
        subStrMatchingRule: '1.5.4.3',
        attributeSyntax: {
          oid: '1.3.6.1.4.1.1466.115.121.1.12',
          size: 67
        },
        singleValue: false,
        collective: false,
        noUserMod: true,
        usage: 'DIRECTORYOPERATION',
        extensions: undefined
      }
    },
    {
      result: '( 2.5.18.3 NAME ( \'creatorsName\' \'nameB\' ) DESC \'RFC4512: name of creator\' OBSOLETE SUP name EQUALITY distinguishedNameMatch ORDERING 1.2.3.4 SUBSTR 1.5.4.3 SYNTAX 1.3.6.1.4.1.1466.115.121.1.12{67} COLLECTIVE NO-USER-MODIFICATION USAGE directoryOperation )',
      schema: {
        oid: '2.5.18.3',
        name: [
          'creatorsName',
          'nameB',
        ],
        description: 'RFC4512: name of creator',
        obsolete: true,
        superiorAttributeType: 'name',
        eqMatchingRule: 'distinguishedNameMatch',
        ordMatchingRule: '1.2.3.4',
        subStrMatchingRule: '1.5.4.3',
        attributeSyntax: {
          oid: '1.3.6.1.4.1.1466.115.121.1.12',
          size: 67
        },
        singleValue: false,
        collective: true,
        noUserMod: true,
        usage: 'DIRECTORYOPERATION',
        extensions: undefined
      }
    },
    {
      result: '( 2.5.18.3 NAME ( \'creatorsName\' \'nameB\' ) DESC \'RFC4512: name of creator\' OBSOLETE SUP name EQUALITY distinguishedNameMatch ORDERING 1.2.3.4 SUBSTR 1.5.4.3 SYNTAX 1.3.6.1.4.1.1466.115.121.1.12{67} COLLECTIVE USAGE directoryOperation )',
      schema: {
        oid: '2.5.18.3',
        name: [
          'creatorsName',
          'nameB',
        ],
        description: 'RFC4512: name of creator',
        obsolete: true,
        superiorAttributeType: 'name',
        eqMatchingRule: 'distinguishedNameMatch',
        ordMatchingRule: '1.2.3.4',
        subStrMatchingRule: '1.5.4.3',
        attributeSyntax: {
          oid: '1.3.6.1.4.1.1466.115.121.1.12',
          size: 67
        },
        singleValue: false,
        collective: true,
        noUserMod: false,
        usage: 'DIRECTORYOPERATION',
        extensions: undefined
      }
    },
    {
      result: '( 2.5.18.3 NAME ( \'creatorsName\' \'nameB\' ) DESC \'RFC4512: name of creator\' OBSOLETE SUP name EQUALITY distinguishedNameMatch ORDERING 1.2.3.4 SUBSTR 1.5.4.3 SYNTAX 1.3.6.1.4.1.1466.115.121.1.12{67} COLLECTIVE )',
      schema: {
        oid: '2.5.18.3',
        name: [
          'creatorsName',
          'nameB',
        ],
        description: 'RFC4512: name of creator',
        obsolete: true,
        superiorAttributeType: 'name',
        eqMatchingRule: 'distinguishedNameMatch',
        ordMatchingRule: '1.2.3.4',
        subStrMatchingRule: '1.5.4.3',
        attributeSyntax: {
          oid: '1.3.6.1.4.1.1466.115.121.1.12',
          size: 67
        },
        singleValue: false,
        collective: true,
        noUserMod: false,
        usage: undefined,
        extensions: undefined
      }
    },
    {
      result: '( 2.5.18.3 DESC \'RFC4512: name of creator\' OBSOLETE SUP name EQUALITY distinguishedNameMatch ORDERING 1.2.3.4 SUBSTR 1.5.4.3 SYNTAX 1.3.6.1.4.1.1466.115.121.1.12{67} COLLECTIVE )',
      schema: {
        oid: '2.5.18.3',
        name: undefined,
        description: 'RFC4512: name of creator',
        obsolete: true,
        superiorAttributeType: 'name',
        eqMatchingRule: 'distinguishedNameMatch',
        ordMatchingRule: '1.2.3.4',
        subStrMatchingRule: '1.5.4.3',
        attributeSyntax: {
          oid: '1.3.6.1.4.1.1466.115.121.1.12',
          size: 67
        },
        singleValue: false,
        collective: true,
        noUserMod: false,
        usage: undefined,
        extensions: undefined
      }
    },
    {
      result: '( 2.5.18.3 OBSOLETE SUP name EQUALITY distinguishedNameMatch ORDERING 1.2.3.4 SUBSTR 1.5.4.3 SYNTAX 1.3.6.1.4.1.1466.115.121.1.12{67} COLLECTIVE )',
      schema: {
        oid: '2.5.18.3',
        name: undefined,
        description: undefined,
        obsolete: true,
        superiorAttributeType: 'name',
        eqMatchingRule: 'distinguishedNameMatch',
        ordMatchingRule: '1.2.3.4',
        subStrMatchingRule: '1.5.4.3',
        attributeSyntax: {
          oid: '1.3.6.1.4.1.1466.115.121.1.12',
          size: 67
        },
        singleValue: false,
        collective: true,
        noUserMod: false,
        usage: undefined,
        extensions: undefined
      }
    },
    {
      result: '( 2.5.18.3 OBSOLETE SUP name ORDERING 1.2.3.4 SUBSTR 1.5.4.3 SYNTAX 1.3.6.1.4.1.1466.115.121.1.12{67} COLLECTIVE )',
      schema: {
        oid: '2.5.18.3',
        name: undefined,
        description: undefined,
        obsolete: true,
        superiorAttributeType: 'name',
        eqMatchingRule: undefined,
        ordMatchingRule: '1.2.3.4',
        subStrMatchingRule: '1.5.4.3',
        attributeSyntax: {
          oid: '1.3.6.1.4.1.1466.115.121.1.12',
          size: 67
        },
        singleValue: false,
        collective: true,
        noUserMod: false,
        usage: undefined,
        extensions: undefined
      }
    },
    {
      result: '( 2.5.18.3 OBSOLETE SUP name ORDERING 1.2.3.4 SUBSTR 1.5.4.3 COLLECTIVE )',
      schema: {
        oid: '2.5.18.3',
        name: undefined,
        description: undefined,
        obsolete: true,
        superiorAttributeType: 'name',
        eqMatchingRule: undefined,
        ordMatchingRule: '1.2.3.4',
        subStrMatchingRule: '1.5.4.3',
        attributeSyntax: undefined,
        singleValue: false,
        collective: true,
        noUserMod: false,
        usage: undefined,
        extensions: undefined
      }
    },
    {
      result: '( 2.5.18.3 OBSOLETE SUP name ORDERING 1.2.3.4 SUBSTR 1.5.4.3 COLLECTIVE X-SINGLE-VALUE \'abcdef\' )',
      schema: {
        oid: '2.5.18.3',
        name: undefined,
        description: undefined,
        obsolete: true,
        superiorAttributeType: 'name',
        eqMatchingRule: undefined,
        ordMatchingRule: '1.2.3.4',
        subStrMatchingRule: '1.5.4.3',
        attributeSyntax: undefined,
        singleValue: false,
        collective: true,
        noUserMod: false,
        usage: undefined,
        extensions: [
          {
            name: 'X-SINGLE-VALUE',
            value: [
              'abcdef'
            ]
          }
        ]
      }
    },
    {
      result: '( 2.5.18.3 OBSOLETE SUP name ORDERING 1.2.3.4 SUBSTR 1.5.4.3 COLLECTIVE USAGE userApplications X-SINGLE-VALUE \'abcdef\' )',
      schema: {
        oid: '2.5.18.3',
        name: undefined,
        description: undefined,
        obsolete: true,
        superiorAttributeType: 'name',
        eqMatchingRule: undefined,
        ordMatchingRule: '1.2.3.4',
        subStrMatchingRule: '1.5.4.3',
        attributeSyntax: undefined,
        singleValue: false,
        collective: true,
        noUserMod: false,
        usage: 'USERAPPLICATIONS',
        extensions: [
          {
            name: 'X-SINGLE-VALUE',
            value: [
              'abcdef'
            ]
          }
        ]
      }
    },
    {
      result: '( 2.5.18.3 OBSOLETE SUP name ORDERING 1.2.3.4 SUBSTR 1.5.4.3 COLLECTIVE USAGE directoryOperation X-SINGLE-VALUE \'abcdef\' )',
      schema: {
        oid: '2.5.18.3',
        name: undefined,
        description: undefined,
        obsolete: true,
        superiorAttributeType: 'name',
        eqMatchingRule: undefined,
        ordMatchingRule: '1.2.3.4',
        subStrMatchingRule: '1.5.4.3',
        attributeSyntax: undefined,
        singleValue: false,
        collective: true,
        noUserMod: false,
        usage: 'DIRECTORYOPERATION',
        extensions: [
          {
            name: 'X-SINGLE-VALUE',
            value: [
              'abcdef'
            ]
          }
        ]
      }
    },
    {
      result: '( 2.5.18.3 OBSOLETE SUP name ORDERING 1.2.3.4 SUBSTR 1.5.4.3 COLLECTIVE USAGE distributedOperation X-SINGLE-VALUE \'abcdef\' )',
      schema: {
        oid: '2.5.18.3',
        name: undefined,
        description: undefined,
        obsolete: true,
        superiorAttributeType: 'name',
        eqMatchingRule: undefined,
        ordMatchingRule: '1.2.3.4',
        subStrMatchingRule: '1.5.4.3',
        attributeSyntax: undefined,
        singleValue: false,
        collective: true,
        noUserMod: false,
        usage: 'DISTRIBUTEDOPERATION',
        extensions: [
          {
            name: 'X-SINGLE-VALUE',
            value: [
              'abcdef'
            ]
          }
        ]
      }
    },
    {
      result: '( 2.5.18.3 OBSOLETE SUP name ORDERING 1.2.3.4 SUBSTR 1.5.4.3 COLLECTIVE USAGE dSAOperation X-SINGLE-VALUE \'abcdef\' )',
      schema: {
        oid: '2.5.18.3',
        name: undefined,
        description: undefined,
        obsolete: true,
        superiorAttributeType: 'name',
        eqMatchingRule: undefined,
        ordMatchingRule: '1.2.3.4',
        subStrMatchingRule: '1.5.4.3',
        attributeSyntax: undefined,
        singleValue: false,
        collective: true,
        noUserMod: false,
        usage: 'DSAOPERATION',
        extensions: [
          {
            name: 'X-SINGLE-VALUE',
            value: [
              'abcdef'
            ]
          }
        ]
      }
    },
    {
      result: '( 2.5.18.3 OBSOLETE SUP name ORDERING 1.2.3.4 SUBSTR 1.5.4.3 COLLECTIVE X-SINGLE-VALUE \'abcdef\' X-LIST-VALUE ( \'why\' \'are\' \'ldap\' \'arrays\' \'so\' \'strange\' ) )',
      schema: {
        oid: '2.5.18.3',
        name: undefined,
        description: undefined,
        obsolete: true,
        superiorAttributeType: 'name',
        eqMatchingRule: undefined,
        ordMatchingRule: '1.2.3.4',
        subStrMatchingRule: '1.5.4.3',
        attributeSyntax: undefined,
        singleValue: false,
        collective: true,
        noUserMod: false,
        usage: undefined,
        extensions: [
          {
            name: 'X-SINGLE-VALUE',
            value: [
              'abcdef'
            ]
          },
          {
            name: 'X-LIST-VALUE',
            value: [
              'why',
              'are',
              'ldap',
              'arrays',
              'so',
              'strange'
            ]
          }
        ]
      }
    }
  ];

describe('attributeTypeSchemaToString.ts tests', () => {
  test('tests', () => {
    testData.forEach((value) => {
      const curResult = attributeTypeSchemaToString(value.schema);

      expect(curResult).toStrictEqual(value.result);
    });
  });
});
