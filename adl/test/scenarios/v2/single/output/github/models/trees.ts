import { tree } from './tree';
/**
 * @since v3
 */
export interface trees {
    /**
     * @since v3
     */
    base_tree: string;
    /**
     * @description SHA1 checksum ID of the object in the tree.
     * @since v3
     */
    sha: string;
    /**
     * @since v3
     */
    tree: Array<tree>;
    /**
     * @since v3
     */
    url: string;
}
