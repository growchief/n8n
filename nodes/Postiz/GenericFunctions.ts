import type {
	IDataObject,
	IExecuteFunctions,
	ILoadOptionsFunctions,
	IHookFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	IWebhookFunctions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

export async function postizApiRequest(
	this: IExecuteFunctions | IWebhookFunctions | IHookFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	resource: string,

	body: any = {},
	query: IDataObject = {},
	option: IDataObject = {},
): Promise<any> {
	const credentials = await this.getCredentials('postizApi');

	let options: IHttpRequestOptions = {
		baseURL: credentials.host + '/public/v1' as string,
		method,
		body,
		qs: query,
		url: resource,
	};

	if (!Object.keys(query).length) {
		delete options.qs;
	}
	
	options = Object.assign({}, options, option);
	try {
		return await this.helpers.httpRequestWithAuthentication.call(this, 'postizApi', options);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}
