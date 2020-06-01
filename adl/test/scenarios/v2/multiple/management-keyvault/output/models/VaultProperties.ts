import { Sku } from './Sku';
import { AccessPolicyEntry } from './AccessPolicyEntry';
import { NetworkRuleSet } from './NetworkRuleSet';
import { PrivateEndpointConnectionItem } from './PrivateEndpointConnectionItem';
/**
 * @description Properties of the vault
 * @since 2019-09-01
 */
export interface VaultProperties {
    /**
     * @description The Azure Active Directory tenant ID that should be used for authenticating requests to the key vault.
     * @since 2019-09-01
     */
    tenantId?: uuid;
    /**
     * @description SKU details
     * @since 2019-09-01
     */
    sku?: Sku;
    /**
     * @description An array of 0 to 16 identities that have access to the key vault. All identities in the array must use the same tenant ID as the key vault's tenant ID. When `createMode` is set to `recover`, access policies are not required. Otherwise, access policies are required.
     * @since 2019-09-01
     */
    accessPolicies: Array<AccessPolicyEntry>;
    /**
     * @description The URI of the vault for performing operations on keys and secrets.
     * @since 2019-09-01
     */
    vaultUri: string;
    /**
     * @description Property to specify whether Azure Virtual Machines are permitted to retrieve certificates stored as secrets from the key vault.
     * @since 2019-09-01
     */
    enabledForDeployment: boolean;
    /**
     * @description Property to specify whether Azure Disk Encryption is permitted to retrieve secrets from the vault and unwrap keys.
     * @since 2019-09-01
     */
    enabledForDiskEncryption: boolean;
    /**
     * @description Property to specify whether Azure Resource Manager is permitted to retrieve secrets from the key vault.
     * @since 2019-09-01
     */
    enabledForTemplateDeployment: boolean;
    /**
     * @description Property to specify whether the 'soft delete' functionality is enabled for this key vault. If it's not set to any value(true or false) when creating new key vault, it will be set to true by default. Once set to true, it cannot be reverted to false.
     * @since 2019-09-01
     */
    enableSoftDelete: boolean;
    /**
     * @description softDelete data retention days. It accepts >=7 and <=90.
     * @since 2019-09-01
     */
    softDeleteRetentionInDays: int32;
    /**
     * @description Property that controls how data actions are authorized. When true, the key vault will use Role Based Access Control (RBAC) for authorization of data actions, and the access policies specified in vault properties will be  ignored (warning: this is a preview feature). When false, the key vault will use the access policies specified in vault properties, and any policy stored on Azure Resource Manager will be ignored. If null or not specified, the vault is created with the default value of false. Note that management actions are always authorized with RBAC.
     * @since 2019-09-01
     */
    enableRbacAuthorization: boolean;
    /**
     * @description The vault's create mode to indicate whether the vault need to be recovered or not.
     * @since 2019-09-01
     */
    createMode: CreateMode;
    /**
     * @description Property specifying whether protection against purge is enabled for this vault. Setting this property to true activates protection against purge for this vault and its content - only the Key Vault service may initiate a hard, irrecoverable deletion. The setting is effective only if soft delete is also enabled. Enabling this functionality is irreversible - that is, the property does not accept false as its value.
     * @since 2019-09-01
     */
    enablePurgeProtection: boolean;
    /**
     * @description Rules governing the accessibility of the key vault from specific network locations.
     * @since 2019-09-01
     */
    networkAcls: NetworkRuleSet;
    /**
     * @description List of private endpoint connections associated with the key vault.
     * @since 2019-09-01
     */
    readonly privateEndpointConnections: Array<PrivateEndpointConnectionItem>;
}
