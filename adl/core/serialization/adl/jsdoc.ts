import { IterableWithLinq, linq } from '@azure-tools/linq';
import { JSDocableNode } from 'ts-morph';

export interface TagInfo {
  tag: string;
  fullText?: string;
  value?: string;
  message?: string;
}

export function getTags(node: JSDocableNode, name: string): IterableWithLinq<TagInfo> {
  return linq.values(node.getJsDocs()).selectMany(each => linq.values(each.getTags()).where(each => each.getTagName() === name)).select(each => {
    const fullText = each.getComment();
    const s = fullText?.split(' ', 2);
    return {
      tag: name,
      fullText,
      value: s?.[0],
      message: s?.[1]
    };
  });
}