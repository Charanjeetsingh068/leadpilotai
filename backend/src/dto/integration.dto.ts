import { IntegrationProviderEnum, IntegrationStateEnum } from '../enums/integration-state.enum';

export interface ConnectIntegrationDto {
  provider: IntegrationProviderEnum;
  authCode?: string;
  redirectUri?: string;
}

export interface DisconnectIntegrationDto {
  provider: IntegrationProviderEnum;
  accountId?: string;
}

export interface TriggerSyncDto {
  provider: IntegrationProviderEnum;
  syncType?: string;
}

export interface IntegrationStatusResponseDto {
  provider: IntegrationProviderEnum;
  state: IntegrationStateEnum;
  connectedAt?: Date | string | null;
  lastSyncAt?: Date | string | null;
  errorMessage?: string | null;
}
