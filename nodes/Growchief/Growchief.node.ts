import {
	IExecuteFunctions,
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	ILoadOptionsFunctions,
	INodePropertyOptions,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';
import { growchiefApiRequest } from './GenericFunctions';

export class Growchief implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Growchief',
		name: 'growchief',
		// eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
		icon: 'file:growchief.png',
		group: ['output'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Consume Growchief API',
		defaults: {
			name: 'Growchief',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'growchiefApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Get Workflows',
						value: 'getWorkflows',
						description: 'Get a list of available workflows',
						action: 'Get a list of workflows',
					},
					{
						name: 'Start Workflow',
						value: 'startWorkflow',
						description: 'Start a workflow with enrichment data',
						action: 'Start a workflow',
					},
				],
				default: 'getWorkflows',
			},
			// Start Workflow parameters
			{
				displayName: 'Workflow Name or ID',
				name: 'workflowId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getWorkflows',
				},
				displayOptions: {
					show: {
						operation: ['startWorkflow'],
					},
				},
				default: '',
				required: true,
				description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			{
				displayName: 'Organization Name',
				name: 'organizationName',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['startWorkflow'],
					},
				},
				default: '',
				description: 'Organization name (required if email and URLs not provided)',
			},
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['startWorkflow'],
					},
				},
				default: '',
				description: 'First name (required if email and URLs not provided)',
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['startWorkflow'],
					},
				},
				default: '',
				description: 'Last name (required if email and URLs not provided)',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				displayOptions: {
					show: {
						operation: ['startWorkflow'],
					},
				},
				default: '',
				description: 'Email address (required if organization details and URLs not provided)',
			},
			{
				displayName: 'URLs',
				name: 'urls',
				type: 'string',
				typeOptions: {
					multipleValues: true,
				},
				displayOptions: {
					show: {
						operation: ['startWorkflow'],
					},
				},
				default: [],
				description: 'List of URLs (required if organization details and email not provided)',
			},
		],
	};

	methods = {
		loadOptions: {
			async getWorkflows(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				try {
					const workflows = await growchiefApiRequest.call(this, 'GET', '/workflows');
					return workflows.map((workflow: any) => ({
						name: workflow.name,
						value: workflow.id,
						description: workflow.description || `Workflow ID: ${workflow.id}`,
					}));
				} catch (error) {
					return [];
				}
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const length = items.length;
		let responseData: any = undefined;

		for (let i = 0; i < length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i);

				if (operation === 'getWorkflows') {
					responseData = await growchiefApiRequest.call(this, 'GET', '/workflows');
				}

				if (operation === 'startWorkflow') {
					const workflowId = this.getNodeParameter('workflowId', i) as string;
					const organizationName = this.getNodeParameter('organizationName', i) as string;
					const firstName = this.getNodeParameter('firstName', i) as string;
					const lastName = this.getNodeParameter('lastName', i) as string;
					const email = this.getNodeParameter('email', i) as string;
					const urls = this.getNodeParameter('urls', i) as string[];

					// Build the enrichment body according to EnrichmentDto
					const body: any = {};

					if (organizationName) body.organization_name = organizationName;
					if (firstName) body.firstName = firstName;
					if (lastName) body.lastName = lastName;
					if (email) body.email = email;
					if (urls && urls.length > 0) body.urls = urls;

					responseData = await growchiefApiRequest.call(
						this,
						'POST',
						`/workflow/${workflowId}`,
						body,
					);
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData as IDataObject[]),
					{ itemData: { item: i } },
				);

				returnData.push(...executionData);
			} catch (error) {
				const executionErrorData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray({ error: error?.description || error?.message || error }),
					{ itemData: { item: i } },
				);
				returnData.push(...executionErrorData);
			}
		}

		return [returnData];
	}
}
