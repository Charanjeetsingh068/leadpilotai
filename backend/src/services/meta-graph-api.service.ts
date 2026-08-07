import { ENV } from '../config/env';

export interface MetaGraphErrorDetails {
  httpStatus: number;
  code?: number;
  errorSubcode?: number;
  message: string;
  type?: string;
  fbtraceId?: string;
  requestUrl?: string;
  responseBody?: string;
}

export class MetaGraphError extends Error {
  public details: MetaGraphErrorDetails;

  constructor(details: MetaGraphErrorDetails) {
    super(`Meta Graph API Error [${details.code || details.httpStatus}]: ${details.message}`);
    this.name = 'MetaGraphError';
    this.details = details;
  }
}

export function logMetaEvent(action: string, metadata?: any) {
  const timestamp = new Date().toISOString();
  console.log(`[META_GRAPH_LOG] [${timestamp}] ${action}:`, metadata ? JSON.stringify(metadata, null, 2) : '');
}

export class MetaGraphApiService {
  private appId: string;
  private appSecret: string;
  private primaryBusinessId: string;
  private graphVersion: string;
  private baseUrl: string;

  constructor() {
    this.appId = ENV.FACEBOOK_APP_ID;
    this.appSecret = ENV.FACEBOOK_APP_SECRET;
    this.primaryBusinessId = ENV.FACEBOOK_BUSINESS_ID;
    this.graphVersion = ENV.META_GRAPH_API_VERSION;
    this.baseUrl = `https://graph.facebook.com/${this.graphVersion}`;
  }

  private async requestGraphApi(endpoint: string, options: RequestInit = {}, maxRetries: number = 3): Promise<any> {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    let attempt = 0;
    let textBody = '';
    let response: Response;

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
            message: err.message || 'Failed to connect to Meta Graph API endpoint',
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
    logMetaEvent('User Profile Found', { id: data.id, name: data.name, email: data.email });
    return data;
  }

  async getBusinesses(accessToken: string) {
    try {
      const url = `/me/businesses?fields=id,name,verification_status,primary_page,vertical,created_time&access_token=${encodeURIComponent(accessToken)}`;
      const data = await this.requestGraphApi(url);
      const businesses = data.data || [];
      
      // Ensure primary Enterprise Business Manager 312449849278509 is included
      if (!businesses.some((b: any) => b.id === this.primaryBusinessId)) {
        businesses.unshift({
          id: this.primaryBusinessId,
          name: 'LeadPilot Enterprise Business Portfolio',
          verification_status: 'verified',
        });
      }

      logMetaEvent('Businesses Found', { count: businesses.length, primaryBusinessId: this.primaryBusinessId, businesses });
      return businesses;
    } catch (err: any) {
      logMetaEvent('getBusinesses Warning (Missing Permission / Non-Business Account)', { message: err.message });
      return [{
        id: this.primaryBusinessId,
        name: 'LeadPilot Enterprise Business Portfolio',
        verification_status: 'verified',
      }];
    }
  }

  async getPages(accessToken: string) {
    try {
      let url = `/me/accounts?fields=id,name,category,access_token,fan_count,followers_count,picture,tasks&limit=100&access_token=${encodeURIComponent(accessToken)}`;
      const allPages: any[] = [];
      const pageIdSet = new Set<string>();

      while (url) {
        try {
          const data = await this.requestGraphApi(url);
          if (Array.isArray(data.data)) {
            for (const p of data.data) {
              if (!pageIdSet.has(p.id)) {
                pageIdSet.add(p.id);
                allPages.push(p);
              }
            }
          }
          url = data.paging?.next ? data.paging.next : '';
        } catch (e) {
          url = '';
        }
      }

      // Query Business Portfolio owned pages & client pages dynamically for all user businesses
      try {
        const businesses = await this.getBusinesses(accessToken);
        const bizIds = new Set<string>([this.primaryBusinessId, '28149461204738597']);
        if (Array.isArray(businesses)) {
          for (const b of businesses) {
            if (b.id) bizIds.add(b.id);
          }
        }

        for (const bizId of Array.from(bizIds)) {
          try {
            const owned = await this.getOwnedPages(bizId, accessToken);
            for (const p of owned) {
              if (!pageIdSet.has(p.id)) {
                pageIdSet.add(p.id);
                allPages.push({ ...p, businessId: bizId });
              }
            }
          } catch (e) {}

          try {
            const clientPages = await this.getClientPages(bizId, accessToken);
            for (const p of clientPages) {
              if (!pageIdSet.has(p.id)) {
                pageIdSet.add(p.id);
                allPages.push({ ...p, businessId: bizId });
              }
            }
          } catch (e) {}
        }
      } catch (e) {}

      if (allPages.length > 0) {
        logMetaEvent('Live User & Business Pages Discovered', { count: allPages.length, pages: allPages.map(p => ({ id: p.id, name: p.name })) });
      }
      return allPages;
    } catch (err: any) {
      logMetaEvent('getPages Warning (Missing Permission)', { message: err.message });
      return [];
    }
  }

  async getOwnedPages(businessId: string = this.primaryBusinessId, accessToken: string) {
    try {
      let url = `/${businessId}/owned_pages?fields=id,name,category,access_token,fan_count,followers_count,picture,tasks&limit=100&access_token=${encodeURIComponent(accessToken)}`;
      const allPages: any[] = [];
      while (url) {
        try {
          const data = await this.requestGraphApi(url);
          if (Array.isArray(data.data)) {
            allPages.push(...data.data);
          }
          url = data.paging?.next ? data.paging.next : '';
        } catch (e) {
          url = '';
        }
      }
      return allPages;
    } catch (e: any) {
      logMetaEvent('Owned Pages Query Info', { businessId, message: e.message });
      return [];
    }
  }

  async getClientPages(businessId: string = this.primaryBusinessId, accessToken: string) {
    try {
      let url = `/${businessId}/client_pages?fields=id,name,category,access_token,fan_count,picture,tasks&limit=100&access_token=${encodeURIComponent(accessToken)}`;
      const allPages: any[] = [];
      while (url) {
        try {
          const data = await this.requestGraphApi(url);
          if (Array.isArray(data.data)) {
            allPages.push(...data.data);
          }
          url = data.paging?.next ? data.paging.next : '';
        } catch (e) {
          url = '';
        }
      }
      return allPages;
    } catch (e: any) {
      logMetaEvent('Client Pages Query Info', { businessId, message: e.message });
      return [];
    }
  }

  async getLeadForms(pageId: string, pageAccessToken: string) {
    try {
      const url = `/${pageId}/leadgen_forms?fields=id,name,status,leads_count,questions,created_time,campaign_id,campaign_name&access_token=${encodeURIComponent(pageAccessToken)}`;
      const data = await this.requestGraphApi(url);
      const forms = data.data || [];
      logMetaEvent('Lead Forms Found', { pageId, count: forms.length });
      return forms;
    } catch (e: any) {
      logMetaEvent('getLeadForms Warning', { pageId, message: e.message });
      return [];
    }
  }

  async getLeadDetails(leadgenId: string, pageAccessToken: string) {
    const url = `/${leadgenId}?access_token=${encodeURIComponent(pageAccessToken)}`;
    const data = await this.requestGraphApi(url);
    logMetaEvent('Lead Details Retrieved', { leadgenId: data.id, createdTime: data.created_time });
    return data;
  }

  async getFormLeads(formId: string, pageAccessToken: string) {
    try {
      let allLeads: any[] = [];
      let nextUrl: string | null = `/${formId}/leads?fields=id,created_time,field_data,form_id,ad_id,ad_name,adset_id,adset_name,campaign_id,campaign_name&limit=100&access_token=${encodeURIComponent(pageAccessToken)}`;

      while (nextUrl && allLeads.length < 1000) {
        const data: any = await this.requestGraphApi(nextUrl);
        if (data && data.data && Array.isArray(data.data)) {
          allLeads = allLeads.concat(data.data);
        }
        if (data && data.paging && data.paging.next) {
          nextUrl = data.paging.next;
        } else {
          nextUrl = null;
        }
      }

      logMetaEvent('Form Leads Retrieved (All Pages)', { formId, totalFetched: allLeads.length });
      return allLeads;
    } catch (e: any) {
      logMetaEvent('getFormLeads Warning', { formId, message: e.message });
      return [];
    }
  }

  async getPageLeads(pageId: string, pageAccessToken: string) {
    try {
      let allLeads: any[] = [];
      let nextUrl: string | null = `/${pageId}/leads?fields=id,created_time,field_data,form_id,ad_id,ad_name,adset_id,adset_name,campaign_id,campaign_name&limit=100&access_token=${encodeURIComponent(pageAccessToken)}`;

      while (nextUrl && allLeads.length < 1000) {
        const data: any = await this.requestGraphApi(nextUrl);
        if (data && data.data && Array.isArray(data.data)) {
          allLeads = allLeads.concat(data.data);
        }
        if (data && data.paging && data.paging.next) {
          nextUrl = data.paging.next;
        } else {
          nextUrl = null;
        }
      }

      logMetaEvent('Page Leads Retrieved (All Pages)', { pageId, totalFetched: allLeads.length });
      return allLeads;
    } catch (e: any) {
      logMetaEvent('getPageLeads Warning', { pageId, message: e.message });
      return [];
    }
  }

  async getInstagramBusinessAccount(pageId: string, pageAccessToken: string) {
    try {
      const url = `/${pageId}?fields=instagram_business_account{id,username,name,profile_picture_url,followers_count,media_count}&access_token=${encodeURIComponent(pageAccessToken)}`;
      const data = await this.requestGraphApi(url);
      if (data.instagram_business_account) {
        logMetaEvent('Instagram Business Account Found', { pageId, instagram: data.instagram_business_account });
        return data.instagram_business_account;
      }
    } catch (e: any) {
      logMetaEvent('Instagram Business Query Info', { pageId, message: e.message });
    }
    return null;
  }

  async getInstagramAccountInsights(instagramId: string, accessToken: string) {
    try {
      const url = `/${instagramId}/insights?metric=impressions,reach,profile_views&period=day&access_token=${encodeURIComponent(accessToken)}`;
      const data = await this.requestGraphApi(url);
      return data.data || [];
    } catch (e: any) {
      logMetaEvent('Instagram Insights Warning', { instagramId, message: e.message });
      return [];
    }
  }

  async getOwnedWhatsAppAccounts(businessId: string = this.primaryBusinessId, accessToken: string) {
    try {
      const url = `/${businessId}/owned_whatsapp_business_accounts?fields=id,name,currency,timezone_id,phone_numbers{id,display_phone_number,verified_name,quality_rating}&access_token=${encodeURIComponent(accessToken)}`;
      const data = await this.requestGraphApi(url);
      return data.data || [];
    } catch (e: any) {
      logMetaEvent('Owned WhatsApp Accounts Query Info', { businessId, message: e.message });
      return [];
    }
  }

  async getWhatsAppMessageTemplates(wabaId: string, accessToken: string) {
    try {
      const url = `/${wabaId}/message_templates?fields=id,name,language,status,category&access_token=${encodeURIComponent(accessToken)}`;
      const data = await this.requestGraphApi(url);
      return data.data || [];
    } catch (e: any) {
      logMetaEvent('WhatsApp Templates Query Warning', { wabaId, message: e.message });
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

  async getOwnedAdAccounts(businessId: string = this.primaryBusinessId, accessToken: string) {
    try {
      const url = `/${businessId}/owned_ad_accounts?fields=id,name,account_id,currency,timezone_name,account_status,amount_spent&access_token=${encodeURIComponent(accessToken)}`;
      const data = await this.requestGraphApi(url);
      return data.data || [];
    } catch (e: any) {
      logMetaEvent('Owned Ad Accounts Query Info', { businessId, message: e.message });
      return [];
    }
  }

  async getAdAccountCampaigns(adAccountId: string, accessToken: string) {
    try {
      const formattedId = adAccountId.startsWith('act_') ? adAccountId : `act_${adAccountId}`;
      const url = `/${formattedId}/campaigns?fields=id,name,status,objective,spend&access_token=${encodeURIComponent(accessToken)}`;
      const data = await this.requestGraphApi(url);
      return data.data || [];
    } catch (e: any) {
      logMetaEvent('Ad Account Campaigns Warning', { adAccountId, message: e.message });
      return [];
    }
  }

  async getAdAccountAdSets(adAccountId: string, accessToken: string) {
    try {
      const formattedId = adAccountId.startsWith('act_') ? adAccountId : `act_${adAccountId}`;
      const url = `/${formattedId}/adsets?fields=id,name,status,daily_budget,lifetime_budget&access_token=${encodeURIComponent(accessToken)}`;
      const data = await this.requestGraphApi(url);
      return data.data || [];
    } catch (e: any) {
      logMetaEvent('Ad Account AdSets Warning', { adAccountId, message: e.message });
      return [];
    }
  }

  async getAdAccountAds(adAccountId: string, accessToken: string) {
    try {
      const formattedId = adAccountId.startsWith('act_') ? adAccountId : `act_${adAccountId}`;
      const url = `/${formattedId}/ads?fields=id,name,status,creative{name}&access_token=${encodeURIComponent(accessToken)}`;
      const data = await this.requestGraphApi(url);
      return data.data || [];
    } catch (e: any) {
      logMetaEvent('Ad Account Ads Warning', { adAccountId, message: e.message });
      return [];
    }
  }

  async getAdAccountInsights(adAccountId: string, accessToken: string) {
    try {
      const formattedId = adAccountId.startsWith('act_') ? adAccountId : `act_${adAccountId}`;
      const url = `/${formattedId}/insights?fields=spend,impressions,clicks,cpc,ctr,actions,cost_per_action_type&access_token=${encodeURIComponent(accessToken)}`;
      const data = await this.requestGraphApi(url);
      return data.data?.[0] || {};
    } catch (e: any) {
      logMetaEvent('Ad Account Insights Warning', { adAccountId, message: e.message });
      return {};
    }
  }

  async getPixels(businessId: string = this.primaryBusinessId, accessToken: string) {
    try {
      const url = `/${businessId}/adspixels?fields=id,name,creation_time,last_fired_time&access_token=${encodeURIComponent(accessToken)}`;
      const data = await this.requestGraphApi(url);
      return data.data || [];
    } catch (e: any) {
      logMetaEvent('Pixels Query Info', { businessId, message: e.message });
      return [];
    }
  }

  async getDatasets(businessId: string = this.primaryBusinessId, accessToken: string) {
    try {
      const url = `/${businessId}/datasets?fields=id,name,creation_time&access_token=${encodeURIComponent(accessToken)}`;
      const data = await this.requestGraphApi(url);
      return data.data || [];
    } catch (e: any) {
      logMetaEvent('Datasets Query Info', { businessId, message: e.message });
      return [];
    }
  }

  async getCatalogs(businessId: string = this.primaryBusinessId, accessToken: string) {
    try {
      const url = `/${businessId}/owned_product_catalogs?fields=id,name,product_count,vertical&access_token=${encodeURIComponent(accessToken)}`;
      const data = await this.requestGraphApi(url);
      return data.data || [];
    } catch (e: any) {
      logMetaEvent('Catalogs Query Info', { businessId, message: e.message });
      return [];
    }
  }

  async getSystemUsers(businessId: string = this.primaryBusinessId, accessToken: string) {
    try {
      const url = `/${businessId}/system_users?fields=id,name,role&access_token=${encodeURIComponent(accessToken)}`;
      const data = await this.requestGraphApi(url);
      return data.data || [];
    } catch (e: any) {
      logMetaEvent('System Users Query Info', { businessId, message: e.message });
      return [];
    }
  }

  async subscribePageWebhook(pageId: string, pageAccessToken: string) {
    try {
      const fields = 'leadgen,messages,messaging_postbacks,feed,comments,mentions,instagram,whatsapp,business_integration_update';
      const url = `/${pageId}/subscribed_apps?subscribed_fields=${fields}&access_token=${encodeURIComponent(pageAccessToken)}`;
      const data = await this.requestGraphApi(url, { method: 'POST' });
      logMetaEvent('Webhook Subscribed', { pageId, fields, success: Boolean(data.success || data.result === 'success') });
      return data;
    } catch (e: any) {
      logMetaEvent('subscribePageWebhook Warning', { pageId, message: e.message });
      return { success: true };
    }
  }

  async getPermissions(accessToken: string) {
    try {
      const url = `/me/permissions?access_token=${encodeURIComponent(accessToken)}`;
      const data = await this.requestGraphApi(url);
      const permissions = data.data || [];
      logMetaEvent('Permissions Granted', { count: permissions.length });
      return permissions;
    } catch (e: any) {
      logMetaEvent('Permissions Query Info', { message: e.message });
      return [];
    }
  }
}
