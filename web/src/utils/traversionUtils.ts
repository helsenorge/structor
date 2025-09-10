import { OrderItem } from "src/store/treeStore/treeStore";

export function buildLinkIdIndexSet(qOrder: OrderItem[]): ReadonlySet<string> {
  const set = new Set<string>();
  const stack = [...qOrder];

  while (stack.length) {
    const node = stack.pop();
    if (node?.linkId) {
      set.add(node.linkId);
    }
    if (node?.items?.length) {
      for (let i = 0; i < node.items.length; i++) stack.push(node.items[i]);
    }
  }
  return set;
}
export function getDuplicateLinkIds(qOrder: OrderItem[]): string[] {
  const seen = new Set<string>();
  const dupesSet = new Set<string>();
  const dupes: string[] = [];

  const stack: OrderItem[] = Array.isArray(qOrder) ? [...qOrder] : [];
  while (stack.length) {
    const node = stack.pop()!;
    const id = (node.linkId ?? "").trim();
    if (id) {
      if (seen.has(id)) {
        if (!dupesSet.has(id)) {
          dupesSet.add(id);
          dupes.push(id);
        }
      } else {
        seen.add(id);
      }
    }
    const children = node.items;
    if (children && children.length) {
      for (let i = 0; i < children.length; i++) stack.push(children[i]);
    }
  }
  return dupes;
}
