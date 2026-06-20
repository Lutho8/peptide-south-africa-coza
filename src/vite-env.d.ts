/// <reference types="vite/client" />

declare module '@revenuecat/purchases-capacitor' {
  export const LOG_LEVEL: {
    WARN: unknown;
  };

  export const Purchases: {
    setLogLevel(options: { level: unknown }): Promise<void>;
    configure(options: { apiKey: string; appUserID?: string }): Promise<void>;
    logIn(options: { appUserID: string }): Promise<unknown>;
    getOfferings(): Promise<unknown>;
    purchasePackage(options: { aPackage: unknown }): Promise<unknown>;
    restorePurchases(): Promise<unknown>;
    getCustomerInfo(): Promise<unknown>;
  };
}
