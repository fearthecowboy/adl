export interface Vaults {
    /**
     * @description Gets the specified Azure key vault.
     * @http GET /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.KeyVault/vaults/{vaultName}
     * @tag Vaults
     * @since 2019-09-01
     */
    Get(resourceGroupName: Http.Path<string>, vaultName: Http.Path<string>, api_version: Http.Query<string, 'api-version'>, subscriptionId: Http.Path<string>);
    /**
     * @description Create or update a key vault in the specified subscription.
     * @http PUT /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.KeyVault/vaults/{vaultName}
     * @tag Vaults
     * @since 2019-09-01
     */
    CreateOrUpdate(resourceGroupName: Http.Path<string>, vaultName: Http.Path<string & RegularExpression<"^[a-zA-Z0-9-]{3,24}$">>, api_version: Http.Query<string, 'api-version'>, subscriptionId: Http.Path<string>);
    /**
     * @description Deletes the specified Azure key vault.
     * @http DELETE /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.KeyVault/vaults/{vaultName}
     * @tag Vaults
     * @since 2019-09-01
     */
    Delete(resourceGroupName: Http.Path<string>, vaultName: Http.Path<string>, api_version: Http.Query<string, 'api-version'>, subscriptionId: Http.Path<string>);
    /**
     * @description Update a key vault in the specified subscription.
     * @http PATCH /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.KeyVault/vaults/{vaultName}
     * @tag Vaults
     * @since 2019-09-01
     */
    Update(resourceGroupName: Http.Path<string>, vaultName: Http.Path<string & RegularExpression<"^[a-zA-Z0-9-]{3,24}$">>, api_version: Http.Query<string, 'api-version'>, subscriptionId: Http.Path<string>);
    /**
     * @description Update access policies in a key vault in the specified subscription.
     * @http PUT /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.KeyVault/vaults/{vaultName}/accessPolicies/{operationKind}
     * @tag Vaults
     * @since 2019-09-01
     */
    UpdateAccessPolicy(resourceGroupName: Http.Path<string>, vaultName: Http.Path<string & RegularExpression<"^[a-zA-Z0-9-]{3,24}$">>, operationKind: Http.Path<AccessPolicyUpdateKind>, api_version: Http.Query<string, 'api-version'>, subscriptionId: Http.Path<string>);
    /**
     * @description The List operation gets information about the vaults associated with the subscription and within the specified resource group.
     * @http GET /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.KeyVault/vaults
     * @tag Vaults
     * @since 2019-09-01
     */
    ListByResourceGroup(resourceGroupName: Http.Path<string>, __top?: Http.Query<int32, '$top'>, api_version: Http.Query<string, 'api-version'>, subscriptionId: Http.Path<string>);
    /**
     * @description The List operation gets information about the vaults associated with the subscription.
     * @http GET /subscriptions/{subscriptionId}/providers/Microsoft.KeyVault/vaults
     * @tag Vaults
     * @since 2019-09-01
     */
    ListBySubscription(__top?: Http.Query<int32, '$top'>, api_version: Http.Query<string, 'api-version'>, subscriptionId: Http.Path<string>);
    /**
     * @description Gets information about the deleted vaults in a subscription.
     * @http GET /subscriptions/{subscriptionId}/providers/Microsoft.KeyVault/deletedVaults
     * @tag Vaults
     * @since 2019-09-01
     */
    ListDeleted(api_version: Http.Query<string, 'api-version'>, subscriptionId: Http.Path<string>);
    /**
     * @description Gets the deleted Azure key vault.
     * @http GET /subscriptions/{subscriptionId}/providers/Microsoft.KeyVault/locations/{location}/deletedVaults/{vaultName}
     * @tag Vaults
     * @since 2019-09-01
     */
    GetDeleted(vaultName: Http.Path<string>, location: Http.Path<string>, api_version: Http.Query<string, 'api-version'>, subscriptionId: Http.Path<string>);
    /**
     * @description Permanently deletes the specified vault. aka Purges the deleted Azure key vault.
     * @http POST /subscriptions/{subscriptionId}/providers/Microsoft.KeyVault/locations/{location}/deletedVaults/{vaultName}/purge
     * @tag Vaults
     * @since 2019-09-01
     */
    PurgeDeleted(vaultName: Http.Path<string>, location: Http.Path<string>, api_version: Http.Query<string, 'api-version'>, subscriptionId: Http.Path<string>);
    /**
     * @description The List operation gets information about the vaults associated with the subscription.
     * @http GET /subscriptions/{subscriptionId}/resources
     * @tag Vaults
     * @since 2019-09-01
     */
    List(__filter: Http.Query<"resourceType eq 'Microsoft.KeyVault/vaults'", '$filter'>, __top?: Http.Query<int32, '$top'>, api_version: Http.Query<"2015-11-01", 'api-version'>, subscriptionId: Http.Path<string>);
    /**
     * @description Checks that the vault name is valid and is not already in use.
     * @http POST /subscriptions/{subscriptionId}/providers/Microsoft.KeyVault/checkNameAvailability
     * @tag Vaults
     * @since 2019-09-01
     */
    CheckNameAvailability(api_version: Http.Query<string, 'api-version'>, subscriptionId: Http.Path<string>);
}
