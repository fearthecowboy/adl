import { ErrorResponseBody } from './ErrorResponseBody';
import { OperationResultLogItemContract } from './OperationResultLogItemContract';
/**
 * @description Operation Result.
 * @since 2019-12-01
 */
export interface OperationResultContract {
    /**
     * @description Operation result identifier.
     * @since 2019-12-01
     */
    id: string;
    /**
     * @description Status of an async operation.
     * @since 2019-12-01
     */
    status: AsyncOperationStatus;
    /**
     * @description Start time of an async operation. The date conforms to the following format: `yyyy-MM-ddTHH:mm:ssZ` as specified by the ISO 8601 standard.
     * @since 2019-12-01
     */
    started: dateTime;
    /**
     * @description Last update time of an async operation. The date conforms to the following format: `yyyy-MM-ddTHH:mm:ssZ` as specified by the ISO 8601 standard.
     * @since 2019-12-01
     */
    updated: dateTime;
    /**
     * @description Optional result info.
     * @since 2019-12-01
     */
    resultInfo: string;
    /**
     * @description Error Body Contract
     * @since 2019-12-01
     */
    error: ErrorResponseBody;
    /**
     * @description This property if only provided as part of the TenantConfiguration_Validate operation. It contains the log the entities which will be updated/created/deleted as part of the TenantConfiguration_Deploy operation.
     * @since 2019-12-01
     */
    readonly actionLog: Array<OperationResultLogItemContract>;
}
