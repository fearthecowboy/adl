import { NamedElement, Rule, RuleResult } from '@azure-tools/adl.core';
import { camelCase } from '../utils';

export default <Rule>{
  activation: 'edit',
  meta: {
    severity: 'warning',
    description: 'PLACEHOLDER',
    documentationUrl: 'PLACEHOLDER',
  },
  onParameter: (model, parameter) => checkCamelCaseIdentifier('parameter', parameter),
  onProperty: (model, property) => checkCamelCaseIdentifier('property', property),
  onEnumValue: (model, enumValue) => checkCamelCaseIdentifier('enumValue', enumValue),
};

function checkCamelCaseIdentifier(type: string, element: NamedElement<any>): RuleResult | undefined {
  const camelCaseRegex = /^[a-z]+(?:[A-Z][a-z]+)*$/g;
  if (!element.name.toString().match(camelCaseRegex)) {
    return {
      message: `The ${type} '${element.name.toString()}' must follow camel case style.`,
      suggestions: [
        {
          description: 'Rename to follow camel case style.',
          fix: () => {
            element.name = camelCase(element.name.toString());
          }
        }
      ]
    };
  }

  return;
}
