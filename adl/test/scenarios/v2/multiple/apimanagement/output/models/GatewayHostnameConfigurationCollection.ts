import { GatewayHostnameConfigurationContract } from './GatewayHostnameConfigurationContract';
/**
 * @description Paged Gateway hostname configuration list representation.
 * @since 2019-12-01
 */
export interface GatewayHostnameConfigurationCollection {
    /**
     * @description Page values.
     * @since 2019-12-01
     */
    readonly value: Array<GatewayHostnameConfigurationContract>;
    /**
     * @description Next page link if any.
     * @since 2019-12-01
     */
    readonly nextLink: string & ;
}
