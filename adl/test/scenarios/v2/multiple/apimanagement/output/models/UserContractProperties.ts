import { UserEntityBaseParameters } from './UserEntityBaseParameters';
import { GroupContractProperties } from './GroupContractProperties';
/**
 * @description User profile.
 * @since 2019-12-01
 */
export interface UserContractProperties extends UserEntityBaseParameters {
    /**
     * @description First name.
     * @since 2019-12-01
     */
    firstName: string;
    /**
     * @description Last name.
     * @since 2019-12-01
     */
    lastName: string;
    /**
     * @description Email address.
     * @since 2019-12-01
     */
    email: string;
    /**
     * @description Date of user registration. The date conforms to the following format: `yyyy-MM-ddTHH:mm:ssZ` as specified by the ISO 8601 standard.
     * @since 2019-12-01
     */
    registrationDate: dateTime;
    /**
     * @description Collection of groups user is part of.
     * @since 2019-12-01
     */
    readonly groups: Array<GroupContractProperties>;
}
