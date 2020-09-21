/**
 * A simple Book Store API
 */
export interface BookStoreOperations {
    CheckAvailability(Name: string): [(code: 200) => {
        body: boolean;
    }];
}
