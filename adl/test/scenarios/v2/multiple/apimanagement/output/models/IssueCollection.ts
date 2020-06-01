import { IssueContract } from './IssueContract';
/**
 * @description Paged Issue list representation.
 * @since 2019-12-01
 */
export interface IssueCollection {
    /**
     * @description Issue values.
     * @since 2019-12-01
     */
    readonly value: Array<IssueContract>;
    /**
     * @description Next page link if any.
     * @since 2019-12-01
     */
    readonly nextLink: string & ;
}
