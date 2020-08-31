import fs = require('fs');
import path = require('path');
import yaml = require('js-yaml');
import plist = require('plist')

enum Language {
  Adl = "adl",
}

enum Extension {
  TmLanguage = "tmLanguage",
  TmTheme = "tmTheme",
  YamlTmLanguage = "YAML-tmLanguage",
  YamlTmTheme = "YAML-tmTheme"
}

function file(language: Language, extension: Extension) {
  return path.join(__dirname, '..', `${language}.${extension}`);
}

function writePlistFile(grammar: TmGrammar | TmTheme, fileName: string) {
  const text = plist.build(grammar);
  fs.writeFileSync(fileName, text);
}

function readYaml(fileName: string) {
  const text = fs.readFileSync(fileName, "utf8");
  return yaml.safeLoad(text);
}

function transformGrammarRule(rule: any, propertyNames: string[], transformProperty: (ruleProperty: string) => string) {
  for (const propertyName of propertyNames) {
    const value = rule[propertyName];
    if (typeof value === 'string') {
      rule[propertyName] = transformProperty(value);
    }
  }

  for (var propertyName in rule) {
    const value = rule[propertyName];
    if (typeof value === 'object') {
      transformGrammarRule(value, propertyNames, transformProperty);
    }
  }
}

function transformGrammarRepository(grammar: TmGrammar, propertyNames: string[], transformProperty: (ruleProperty: string) => string) {
  const repository = grammar.repository;
  for (let key in repository) {
    transformGrammarRule(repository[key], propertyNames, transformProperty);
  }
}

function getGrammar(getVariables: (grammarVariables: MapLike<string>) => MapLike<string>) {
  const grammarBeforeTransformation = readYaml(file(Language.Adl, Extension.YamlTmLanguage)) as TmGrammar;
  return updateGrammarVariables(grammarBeforeTransformation, getVariables(grammarBeforeTransformation.variables));
}

function replacePatternVariables(pattern: string, variableReplacers: VariableReplacer[]) {
  let result = pattern;
  for (const [variableName, value] of variableReplacers) {
    result = result.replace(variableName, value);
  }
  return result;
}

type VariableReplacer = [RegExp, string];
function updateGrammarVariables(grammar: TmGrammar, variables: MapLike<string>) {
  delete grammar.variables;
  const variableReplacers: VariableReplacer[] = [];
  for (const variableName in variables) {
    // Replace the pattern with earlier variables
    const pattern = replacePatternVariables(variables[variableName], variableReplacers);
    variableReplacers.push([new RegExp(`{{${variableName}}}`, "gim"), pattern]);
    variableReplacers.push([new RegExp('\\$' + `{${variableName}}`, "gim"), pattern]);
  }
  transformGrammarRepository(
    grammar,
    ["begin", "end", "match"],
    pattern => replacePatternVariables(pattern, variableReplacers)
  );
  return grammar;
}

function buildGrammar() {
  const grammar = getGrammar(grammarVariables => grammarVariables);
  writePlistFile(grammar, file(Language.Adl, Extension.TmLanguage));
}


function buildTheme() {
  const theme = readYaml(file(Language.Adl, Extension.YamlTmTheme)) as TmTheme;
  writePlistFile(theme, file(Language.Adl, Extension.TmTheme));
}

buildGrammar();
//buildTheme();