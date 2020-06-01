import { IssueAttachmentContract } from './IssueAttachmentContract';
/**
 * @description Paged Issue Attachment list representation.
 * @since 2019-12-01
 */
export interface IssueAttachmentCollection {
    /**
     * @description Issue Attachment values.
     * @since 2019-12-01
     */
    readonly value: Array<IssueAttachmentContract>;
    /**
     * @description Next page link if any.
     * @since 2019-12-01
     */
    readonly nextLink: string & ;
}
