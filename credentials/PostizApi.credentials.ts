import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class PostizApi implements ICredentialType {
	name = 'postizApi';
	displayName = 'Postiz API';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
		{
			displayName: 'Host',
			name: 'host',
			type: 'string',
			default: 'https://api.postiz.com',
		},
	];

	// This credential is currently not used by any node directly
	// but the HTTP Request node can use it to make requests.
	// The credential is also testable due to the `test` property below
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '={{$credentials.apiKey}}',
			}
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.host}}',
			url: '=/public/v1/is-connected',
		},
	};
}
