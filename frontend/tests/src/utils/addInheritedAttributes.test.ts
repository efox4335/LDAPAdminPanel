import { describe, test, expect } from 'vitest';

import addInheritedAttributes from '../../../src/utils/addInheritedAttributes';
import type { attributeTypeSchemaMap, objectClassSchemaMap } from '../../../src/utils/types';

describe('addInheritedAttributes.ts tests', () => {
  test('circular inheritence', () => {
    const testObjectClassSchemas: objectClassSchemaMap = {
      objectClassSchemas: [
        {
          oid: '1',
          obsolete: false,
          superiorObjectClasses: [
            '2', '3'
          ],
          reqAttributes: [
            '1'
          ],
          type: 'ABSTRACT',
          names: undefined,
          description: undefined,
          optAttributes: undefined
        },
        {
          oid: '2',
          obsolete: false,
          superiorObjectClasses: [
            '1', '3'
          ],
          reqAttributes: [
            '2'
          ],
          type: 'ABSTRACT',
          names: undefined,
          description: undefined,
          optAttributes: undefined
        },
        {
          oid: '3',
          obsolete: false,
          superiorObjectClasses: [
            '1', '2'
          ],
          reqAttributes: [
            '3'
          ],
          type: 'ABSTRACT',
          names: undefined,
          description: undefined,
          optAttributes: undefined
        }
      ],
      nameMap: {
        '1': 0,
        '2': 1,
        '3': 2
      }
    };

    const testAttributTypeSchemas: attributeTypeSchemaMap = {
      attributeTypes: [
        {
          oid: '1',
          name: undefined
        },
        {
          oid: '2',
          name: undefined
        },
        {
          oid: '3',
          name: undefined
        }
      ],
      nameMap: {
        '1': 0,
        '2': 1,
        '3': 2
      }
    };

    const result = addInheritedAttributes(testObjectClassSchemas, testAttributTypeSchemas);

    result.objectClassSchemas.forEach((schema) => {
      expect(schema.reqAttributes).toBeDefined();

      if (schema.reqAttributes !== undefined) {
        expect(schema.reqAttributes.find((attribute) => attribute === '1')).toBeDefined();
        expect(schema.reqAttributes.find((attribute) => attribute === '2')).toBeDefined();
        expect(schema.reqAttributes.find((attribute) => attribute === '3')).toBeDefined();
      }
    });
  });

  test('attribute with different names is only included once', () => {
    const testObjectClassSchemas: objectClassSchemaMap = {
      objectClassSchemas: [
        {
          oid: '1',
          names: undefined,
          description: undefined,
          obsolete: false,
          superiorObjectClasses: undefined,
          type: 'ABSTRACT',
          reqAttributes: [
            '1'
          ],
          optAttributes: undefined
        },
        {
          oid: '2',
          names: undefined,
          description: undefined,
          obsolete: false,
          superiorObjectClasses: [
            '1'
          ],
          type: 'ABSTRACT',
          reqAttributes: [
            'testAttribute'
          ],
          optAttributes: undefined
        }
      ],
      nameMap: {
        '1': 0,
        '2': 1
      }
    };

    const testAttributTypeSchemas: attributeTypeSchemaMap = {
      attributeTypes: [
        {
          oid: '1',
          name: [
            'testAttribute'
          ]
        }
      ],
      nameMap: {
        '1': 0,
        'testattribute': 0
      }
    };

    const result = addInheritedAttributes(testObjectClassSchemas, testAttributTypeSchemas);

    const testKey = result.nameMap['2'];

    expect(testKey).toBeDefined();

    if (testKey !== undefined) {
      expect(result.objectClassSchemas[testKey].reqAttributes).toBeDefined();

      if (result.objectClassSchemas[testKey].reqAttributes !== undefined) {
        expect(result.objectClassSchemas[testKey].reqAttributes.length).toStrictEqual(1);
      }
    }
  });

  test('object classes included by name', () => {
    const testObjectClassSchemas: objectClassSchemaMap = {
      objectClassSchemas: [
        {
          oid: '1',
          names: [
            'testObjectClass'
          ],
          description: undefined,
          obsolete: false,
          superiorObjectClasses: undefined,
          type: 'ABSTRACT',
          reqAttributes: [
            'testAttribute'
          ],
          optAttributes: undefined
        },
        {
          oid: '2',
          names: undefined,
          description: undefined,
          obsolete: false,
          superiorObjectClasses: [
            'testObjectClass'
          ],
          type: 'ABSTRACT',
          reqAttributes: undefined,
          optAttributes: undefined
        }
      ],
      nameMap: {
        '1': 0,
        'testobjectclass': 0,
        '2': 1
      }
    };

    const testAttributTypeSchemas: attributeTypeSchemaMap = {
      attributeTypes: [
        {
          oid: '1',
          name: [
            'testAttribute'
          ]
        }
      ],
      nameMap: {
        '1': 0,
        'testattribute': 0
      }
    };

    const result = addInheritedAttributes(testObjectClassSchemas, testAttributTypeSchemas);

    const testKey = result.nameMap['2'];

    expect(testKey).toBeDefined();

    if (testKey !== undefined) {
      expect(result.objectClassSchemas[testKey].reqAttributes).toBeDefined();

      if (result.objectClassSchemas[testKey].reqAttributes !== undefined) {
        expect(result.objectClassSchemas[testKey].reqAttributes.length).toStrictEqual(1);
      }
    }
  });

  test('if attribute is in both reqAttributes and optAttributes it is included in reqAttributes only', () => {
    const testObjectClassSchemas: objectClassSchemaMap = {
      objectClassSchemas: [
        {
          oid: '1',
          names: undefined,
          description: undefined,
          obsolete: false,
          superiorObjectClasses: undefined,
          type: 'ABSTRACT',
          reqAttributes: [
            '1'
          ],
          optAttributes: undefined
        },
        {
          oid: '2',
          names: undefined,
          description: undefined,
          obsolete: false,
          superiorObjectClasses: [
            '1'
          ],
          type: 'ABSTRACT',
          reqAttributes: [
            'testAttribute'
          ],
          optAttributes: undefined
        }
      ],
      nameMap: {
        '1': 0,
        '2': 1
      }
    };

    const testAttributTypeSchemas: attributeTypeSchemaMap = {
      attributeTypes: [
        {
          oid: '1',
          name: [
            'testAttribute'
          ]
        }
      ],
      nameMap: {
        '1': 0,
        'testattribute': 0
      }
    };

    const result = addInheritedAttributes(testObjectClassSchemas, testAttributTypeSchemas);

    const testKey = result.nameMap['2'];

    expect(testKey).toBeDefined();

    if (testKey !== undefined) {
      expect(result.objectClassSchemas[testKey].reqAttributes).toBeDefined();

      if (result.objectClassSchemas[testKey].reqAttributes !== undefined) {
        expect(result.objectClassSchemas[testKey].reqAttributes[0]).toStrictEqual('testAttribute');
      }
    }
  });

  test('if attribute is included by oid and has name name is used', () => {
    const testObjectClassSchemas: objectClassSchemaMap = {
      objectClassSchemas: [
        {
          oid: '1',
          names: [
            'testObjectClass'
          ],
          description: undefined,
          obsolete: false,
          superiorObjectClasses: undefined,
          type: 'ABSTRACT',
          reqAttributes: [
            '1'
          ],
          optAttributes: undefined
        },
        {
          oid: '2',
          names: undefined,
          description: undefined,
          obsolete: false,
          superiorObjectClasses: [
            'testObjectClass'
          ],
          type: 'ABSTRACT',
          reqAttributes: undefined,
          optAttributes: undefined
        }
      ],
      nameMap: {
        '1': 0,
        'testobjectclass': 0,
        '2': 1
      }
    };

    const testAttributTypeSchemas: attributeTypeSchemaMap = {
      attributeTypes: [
        {
          oid: '1',
          name: [
            'testAttribute'
          ]
        }
      ],
      nameMap: {
        '1': 0,
        'testattribute': 0
      }
    };

    const result = addInheritedAttributes(testObjectClassSchemas, testAttributTypeSchemas);

    const testKey = result.nameMap['2'];

    expect(testKey).toBeDefined();

    if (testKey !== undefined) {
      expect(result.objectClassSchemas[testKey].reqAttributes).toBeDefined();

      if (result.objectClassSchemas[testKey].reqAttributes !== undefined) {
        expect(result.objectClassSchemas[testKey].reqAttributes.length).toStrictEqual(1);

        expect(result.objectClassSchemas[testKey].reqAttributes[0]).toStrictEqual('testAttribute');
      }
    }
  });
});
