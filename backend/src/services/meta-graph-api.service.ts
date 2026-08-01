const GRAPH_BASE_URL = 'https://graph.facebook.com/v19.0';

export interface MetaGraphErrorDetails {
  httpStatus: number;
  code?: number;
  errorSubcode?: number;
  message: string;
  type?: string;
  fbtraceId?: string;
  requestUrl: string;
  responseBody: string;
}

export class MetaGraphError extends Error {
  public details: MetaGraphErrorDetails;

  constructor(details: MetaGraphErrorDetails) {
    super(`Meta Graph API Error [${details.code || details.httpStatus}]: ${details.message}`);
    this.name = 'MetaGraphError';
    this.details = details;
  }
}

export function logMetaEvent(eventType: string, details: Record<string, any> = {}) {
  const timestamp = new Date().toISOString();
  console.log(`[META_GRAPH_LOG] [${timestamp}] ${eventType}:`, JSON.stringify(details, null, 2));
}

export class MetaGraphApiService {
  private appId: string;
  private appSecret: string;

  constructor() {
    this.appId = process.env.FACEBOOK_APP_ID || process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '1712255293083461';
    this.appSecret = process.env.FACEBOOK_APP_SECRET || 'fadc1ae30941d9573ec85c9fe27dc784';
  }

  private async requestGraphApi(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = endpoint.startsWith('http') ? endpoint : `${GRAPH_BASE_URL}${endpoint}`;
    
    let response: Response;
    let textBody = '';

    // Retry with exponential backoff for transient 5xx or rate limit (code 1, 2, 4, 17) errors
    const maxRetries = 3;
    let attempt = 0;

    while (true) {
      attempt++;
      try {
        response = await fetch(url, options);
        textBody = await response.text();
        
        let data: any = {};
        try {
          data = JSON.parse(textBody);
        } catch (e) {
          data = { raw: textBody };
        }

        if (!response.ok || data.error) {
          const errObj = data.error || {};
          const errDetails: MetaGraphErrorDetails = {
            httpStatus: response.status,
            code: errObj.code,
            errorSubcode: errObj.error_subcode,
            message: errObj.message || `Graph API request failed with status ${response.status}`,
            type: errObj.type,
            fbtraceId: errObj.fbtrace_id,
            requestUrl: url,
            responseBody: textBody,
          };

          logMetaEvent('Meta Graph API Error', errDetails);

          // Transient error code retry check
          const isTransient = errObj.code === 1 || errObj.code === 2 || errObj.code === 4 || errObj.code === 17 || response.status >= 500;
          if (isTransient && attempt < maxRetries) {
            await new Promise((res) => setTimeout(res, 1000 * Math.pow(2, attempt - 1)));
            continue;
          }

          throw new MetaGraphError(errDetails);
        }

        return data;
      } catch (err: any) {
        if (err instanceof MetaGraphError) {
          throw err;
        }
        if (attempt >= maxRetries) {
          const errDetails: MetaGraphErrorDetails = {
            httpStatus: 500,
            message: err.message || 'Failed to connect to Meta Graph API network endpoint',
            requestUrl: url,
            responseBody: textBody || err.stack || '',
          };
          logMetaEvent('Meta Network Connection Error', errDetails);
          throw new MetaGraphError(errDetails);
        }
        await new Promise((res) => setTimeout(res, 1000 * Math.pow(2, attempt - 1)));
      }
    }
  }

  async exchangeCodeForToken(code: string, redirectUri: string) {
    logMetaEvent('Authorization Code Received', { code: code.substring(0, 10) + '...', redirectUri });
    
    const url = `/oauth/access_token?client_id=${this.appId}&client_secret=${this.appSecret}&redirect_uri=${encodeURIComponent(redirectUri)}&code=${encodeURIComponent(code)}`;
    const data = await this.requestGraphApi(url);

    logMetaEvent('Short-Lived Token Exchanged', {
      tokenType: data.token_type,
      expiresIn: data.expires_in,
      hasToken: Boolean(data.access_token),
    });

    return data;
  }

  async getLongLivedToken(shortLivedToken: string) {
    const url = `/oauth/access_token?grant_type=fb_exchange_token&client_id=${this.appId}&client_secret=${this.appSecret}&fb_exchange_token=${encodeURIComponent(shortLivedToken)}`;
    const data = await this.requestGraphApi(url);

    logMetaEvent('Long-Lived Token Exchanged', {
      tokenType: data.token_type,
      expiresIn: data.expires_in,
      hasLongLivedToken: Boolean(data.access_token),
    });

    return data;
  }

  async getUserProfile(accessToken: string) {
    const url = `/me?fields=id,name,email,picture&access_token=${encodeURIComponent(accessToken)}`;
    const data = await this.requestGraphApi(url);

    logMetaEvent('User Profile Found', {
      id: data.id,
      name: data.name,
      email: data.email,
    });

    return data;
  }

  async getBusinesses(accessToken: string) {
    const url = `/me/businesses?fields=id,name,verification_status,primary_page&access_token=${encodeURIComponent(accessToken)}`;
    const data = await this.requestGraphApi(url);
    const businesses = data.data || [];

    logMetaEvent('Businesses Found', {
      count: businesses.length,
      businesses: businesses.map((b: any) => ({ id: b.id, name: b.name })),
    });

    return businesses;
  }

  async getPages(accessToken: string) {
    const url = `/me/accounts?fields=id,name,category,access_token,fan_count,picture,tasks&access_token=${encodeURIComponent(accessToken)}`;
    const data = await this.requestGraphApi(url);
    const pages = data.data || [];

    logMetaEvent('Pages Found', {
      count: pages.length,
      pages: pages.map((p: any) => ({ id: p.id, name: p.name, hasAccessToken: Boolean(p.access_token) })),
    });

    return pages;
  }

  async getLeadForms(pageId: string, pageAccessToken: string) {
    const url = `/${pageId}/leadgen_forms?fields=id,name,status,leads_count,questions,created_time&access_token=${encodeURIComponent(pageAccessToken)}`;
    const data = await this.requestGraphApi(url);
    const forms = data.data || [];

    logMetaEvent('Lead Forms Found', {
      pageId,
      count: forms.length,
      forms: forms.map((f: any) => ({ id: f.id, name: f.name, status: f.status, leadsCount: f.leads_count })),
    });

    return forms;
  }

  async getLeadDetails(leadgenId: string, pageAccessToken: string) {
    const url = `/${leadgenId}?access_token=${encodeURIComponent(pageAccessToken)}`;
    const data = await this.requestGraphApi(url);

    logMetaEvent('Lead Details Retrieved', {
      leadgenId: data.id,
      createdTime: data.created_time,
      fieldsCount: data.field_data?.length || 0,
    });

    return data;
  }

  async getInstagramBusinessAccount(pageId: string, pageAccessToken: string) {
    try {
      const url = `/${pageId}?fields=instagram_business_account{id,username,name,profile_picture_url,followers_count}&access_token=${encodeURIComponent(pageAccessToken)}`;
      const data = await this.requestGraphApi(url);
      if (data.instagram_business_account) {
        logMetaEvent('Instagram Business Account Found', {
          pageId,
          instagram: data.instagram_business_account,
        });
        return data.instagram_business_account;
      }
    } catch (e: any) {
      logMetaEvent('Instagram Business Query Info', { pageId, message: e.message });
    }
    return null;
  }

  async getWhatsAppBusinessAccounts(accessToken: string) {
    try {
      const url = `/me/businesses?fields=id,name,client_whatsapp_business_accounts{id,name,currency,timezone_id}&access_token=${encodeURIComponent(accessToken)}`;
      const data = await this.requestGraphApi(url);
      const businesses = data.data || [];
      const whatsapps: any[] = [];
      for (const b of businesses) {
        if (b.client_whatsapp_business_accounts?.data) {
          for (const waba of b.client_whatsapp_business_accounts.data) {
            whatsapps.push({
              ...waba,
              businessId: b.id,
              businessName: b.name,
            });
          }
        }
      }
      logMetaEvent('WhatsApp Business Accounts Found', { count: whatsapps.length });
      return whatsapps;
    } catch (e: any) {
      logMetaEvent('WhatsApp Business Query Info', { message: e.message });
      return [];
    }
  }

  async getOwnedPages(businessId: string, accessToken: string) {
    try {
      const url = `/${businessId}/owned_pages?fields=id,name,category,access_token,fan_count,picture,tasks&access_token=${encodeURIComponent(accessToken)}`;
      const data = await this.requestGraphApi(url);
      return data.data || [];
    } catch (e: any) {
      logMetaEvent('Owned Pages Query Info', { businessId, message: e.message });
      return [];
    }
  }

  async getClientPages(businessId: string, accessToken: string) {
    try {
      const url = `/${businessId}/client_pages?fields=id,name,category,access_token,fan_count,picture,tasks&access_token=${encodeURIComponent(accessToken)}`;
      const data = await this.requestGraphApi(url);
      return data.data || [];
    } catch (e: any) {
      logMetaEvent('Client Pages Query Info', { businessId, message: e.message });
      return [];
    }
  }

  async getOwnedWhatsAppAccounts(businessId: string, accessToken: string) {
    try {
      const url = `/${businessId}/owned_whatsapp_business_accounts?fields=id,name,currency,timezone_id,phone_numbers{id,display_phone_number,verified_name,quality_rating}&access_token=${encodeURIComponent(accessToken)}`;
      const data = await this.requestGraphApi(url);
      return data.data || [];
    } catch (e: any) {
      logMetaEvent('Owned WhatsApp Accounts Query Info', { businessId, message: e.message });
      return [];
    }
  }

  async sendWhatsAppCloudMessage(phoneNumberId: string, accessToken: string, payload: any) {
    const url = `/${phoneNumberId}/messages?access_token=${encodeURIComponent(accessToken)}`;
    const data = await this.requestGraphApi(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    logMetaEvent('WhatsApp Cloud API Message Sent', {
      phoneNumberId,
      recipient: payload.to,
      type: payload.type,
      messageId: data.messages?.[0]?.id,
    });

    return data;
  }

  async subscribePageWebhook(pageId: string, pageAccessToken: string) {
    const url = `/${pageId}/subscribed_apps?subscribed_fields=leadgen,messages,feed&access_token=${encodeURIComponent(pageAccessToken)}`;
    const data = await this.requestGraphApi(url, { method: 'POST' });

    logMetaEvent('Webhook Subscribed', {
      pageId,
      success: data.success || data.result === 'success',
      response: data,
    });

    return data;
  }

  async getPermissions(accessToken: string) {
    const url = `/me/permissions?access_token=${encodeURIComponent(accessToken)}`;
    const data = await this.requestGraphApi(url);
    const permissions = data.data || [];

    logMetaEvent('Permissions Granted', {
      count: permissions.length,
      permissions: permissions.map((p: any) => `${p.permission}:${p.status}`),
    });

    return permissions;
  }
}
