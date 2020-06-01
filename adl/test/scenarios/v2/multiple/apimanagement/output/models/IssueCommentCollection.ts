import { IssueCommentContract } from './IssueCommentContract';
/**
 * @description Paged Issue Comment list representation.
 * @since 2019-12-01
 */
export interface IssueCommentCollection {
    /**
     * @description Issue Comment values.
     * @since 2019-12-01
     */
    readonly value: Array<IssueCommentContract>;
    /**
     * @description Next page link if any.
     * @since 2019-12-01
     */
    readonly nextLink: string & ;
}
