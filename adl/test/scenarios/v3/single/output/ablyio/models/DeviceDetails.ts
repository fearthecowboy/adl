import { Recipient } from './Recipient';
/**
 *
 * @since 1.1.0
 */
export interface DeviceDetails {
    /**
     * @description Optional trusted client identifier for the device.
     * @since 1.1.0
     */
    clientId?: string;
    /**
     * @description Secret value for the device.
     * @since 1.1.0
     */
    deviceSecret?: string;
    /**
     * @description Form factor of the push device.
     * @since 1.1.0
     */
    formFactor?: "phone" | "tablet" | "desktop" | "tv" | "watch" | "car" | "embedded";
    /**
     * @description Unique identifier for the device generated by the device itself.
     * @since 1.1.0
     */
    id?: string;
    /**
     * @description Optional metadata object for this device. The metadata for a device may only be set by clients with push-admin privileges and will be used more extensively in the future with smart notifications.
     * @since 1.1.0
     */
    metadata?: {};
    /**
     * @description Platform of the push device.
     * @since 1.1.0
     */
    platform?: "ios" | "android";
    /**
     *
     * @since 1.1.0
     */
    'push.recipient'?: Recipient;
    /**
     * @description the current state of the push device.
     * @since 1.1.0
     */
    readonly 'push.state'?: "Active" | "Failing" | "Failed";
}
