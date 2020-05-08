import { common } from '@azure-tools/openapi';
import { use } from '@azure-tools/sourcemap';
import { Contact, ContactRole } from '../../../model/contact';
import { License } from '../../../model/license';
import { Metadata } from '../../../model/metadata';
import { Reference } from '../../../model/Reference';
import { Context, is, OAIModel } from '../../../support/visitor';
import { addExtensionsToAttic } from '../common';

async function *processContact<TModel extends OAIModel>(contact: common.Contact, $: Context<TModel>) {
  const result = new Contact(ContactRole.Author, {
    name: contact.name,
    email: contact.email,
    url: contact.url,
  });

  // add remaining extensions to attic. 
  await addExtensionsToAttic(result, contact);

  yield result;
}

async function *processLicense<TModel extends OAIModel>(license: common.License, $: Context<TModel>) {
  const result = new License(license.name, {
    url: license.url
  });
  // add remaining extensions to attic. 
  await addExtensionsToAttic(result, license);

  yield result;
}

export async function *processInfo<TModel extends OAIModel>(info: common.Info, $: Context<TModel>): AsyncGenerator<Metadata> {

  // create the metadata 
  const metadata = new Metadata(info.title, {
    description: info.description,
    termsOfService: info.termsOfService
  });

  // add the author contact
  if (is(info.contact)) {
    for await (const c of $.process(processContact, info.contact)) {
      metadata.contacts.push(c)  ;
    }
    //metadata.contacts.push(await $.process2(processContact, info.contact));
  }

  // add license
  if (is(info.license)) {
    for await (const l of $.process(processLicense, info.license) ) {
      metadata.licenses.push(l);
    }
    //metadata.licenses.push(await $.process(processLicense, info.license));
  }

  // add remaining extensions to attic. 
  await addExtensionsToAttic(metadata, info);

  // we handled version much earler.
  use(info.version);

  yield metadata;
}


export async function *processExternalDocs<TModel extends OAIModel>(externalDocs: common.ExternalDocumentation|undefined, $: Context<TModel>): AsyncGenerator<Reference> {
  if( externalDocs ) {
  // external docs are just a kind of reference. 
    const reference = new Reference('external-documentation', {
      location: externalDocs.url,
      description: externalDocs.description,
    });
    await addExtensionsToAttic(reference, externalDocs);

    yield reference;
  }
}


export async function *processTag<TModel extends OAIModel>(tag: common.Tag, $: Context<TModel>): AsyncGenerator<Reference> {
  const reference = new Reference(tag.name, {
    summary: tag.description,
    location: tag.externalDocs ? tag.externalDocs.url : undefined,
    description: tag.externalDocs ? tag.externalDocs.description : undefined,
  });
  use(tag.externalDocs);

  await addExtensionsToAttic(reference, tag);

  yield reference;
}