import { ExtendedSourceFile, isInline, Rule } from '@azure-tools/adl.core';

export default <Rule>{
  activation: 'edit',
  meta: {
    severity: 'error',
    description: 'Inline/anonymous models must not be used, instead define a schema. This allows operations to share the models.',
    documentationUrl: 'https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md#r2026-avoidanonymoustypes',
  },
  data: {

  },
  onProperty: (model, property, data) => {
    const type = property.type;
    if (isInline(type)) {
      return {
        message: `The type of the property '${property.name}' is inlined.`,
        suggestions: [
          {

            description: 'Extract contents and create a model definition for this type.',
            fix: async () => {
              const typeReference = model.createModelType(property.name, { text: type.declaration.text });
              property.type = typeReference;
              await model.fileSystem.writeFile((<ExtendedSourceFile>typeReference.node.getSourceFile()).relativePath, typeReference.node.getSourceFile().getFullText());
            }
          }
        ]
      };
    }

    return;
  }
};