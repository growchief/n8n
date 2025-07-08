import type {
	IExecuteFunctions,
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';
import { postizApiRequest } from './GenericFunctions';
import FormData from 'form-data';

export class Postiz implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Postiz',
		name: 'postiz',
		// eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
		icon: 'file:postiz.png',
		group: ['output'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Consume Postiz API',
		defaults: {
			name: 'Postiz',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'postizApi',
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
						name: 'Create Post',
						value: 'createPost',
						description: 'Schedule a post to Postiz',
						action: 'Schedule a post to postiz',
					},
					{
						name: 'Delete Post',
						value: 'deletePost',
						description: 'Delete a post by ID',
						action: 'Delete a post by id',
					},
					{
						name: 'Get Integrations',
						value: 'getIntegrations',
						description: 'Get a list of connected channels',
						action: 'Get a list of connected channels',
					},
					{
						name: 'Get Posts',
						value: 'getPosts',
						description: 'Get a list of posts',
						action: 'Get a list of posts',
					},
					{
						name: 'Upload File',
						value: 'uploadFile',
						description: 'Upload a file to Postiz',
						action: 'Upload a file to postiz',
					},
				],
				default: 'createPost',
			},
			// CreatePost parameters
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				displayOptions: {
					show: {
						operation: ['createPost'],
					},
				},
				options: [
					{
						name: 'Draft',
						value: 'draft',
					},
					{
						name: 'Schedule',
						value: 'schedule',
					},
					{
						name: 'Now',
						value: 'now',
					},
				],
				default: 'now',
				required: true,
				description: 'Type of post to create',
			},
			{
				displayName: 'Short Link',
				name: 'shortLink',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['createPost'],
					},
				},
				default: false,
				required: true,
				description: 'Whether to use short links',
			},
			{
				displayName: 'Date',
				name: 'date',
				type: 'dateTime',
				displayOptions: {
					show: {
						operation: ['createPost'],
					},
				},
				default: '',
				required: true,
				description: 'Date and time for the post',
			},
			{
				displayName: 'Tags',
				name: 'tags',
				placeholder: 'Add Tag',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				displayOptions: {
					show: {
						operation: ['createPost'],
					},
				},
				default: {},
				options: [
					{
						name: 'tag',
						displayName: 'Tag',
						values: [
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								required: true,
								description: 'Tag value',
							},
							{
								displayName: 'Label',
								name: 'label',
								type: 'string',
								default: '',
								required: true,
								description: 'Tag label',
							},
						],
					},
				],
				description: 'Tags for the post',
			},
			{
				displayName: 'Posts',
				name: 'posts',
				placeholder: 'Add Post',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				displayOptions: {
					show: {
						operation: ['createPost'],
					},
				},
				default: {},
				options: [
					{
						name: 'post',
						displayName: 'Post',
						values: [
							{
								displayName: 'Integration ID',
								name: 'integrationId',
								type: 'string',
								default: '',
								required: true,
								description: 'ID of the integration/channel',
							},
							{
								displayName: 'Group',
								name: 'group',
								type: 'string',
								default: '',
								description: 'Post group',
							},
							{
								displayName: 'Settings',
								name: 'settings',
								placeholder: 'Add Setting',
								type: 'fixedCollection',
								typeOptions: {
									multipleValues: true,
								},
								default: {},
								options: [
									{
										name: 'setting',
										displayName: 'Setting',
										values: [
											{
												displayName: 'Key',
												name: 'key',
												type: 'string',
												default: '',
												required: true,
												description: 'Setting key',
											},
											{
												displayName: 'Value',
												name: 'value',
												type: 'string',
												default: '',
												required: true,
												description: 'Setting value',
											},
										],
									},
								],
								description: 'Provider-specific settings',
							},
							{
								displayName: 'Content Items',
								name: 'value',
								placeholder: 'Add Content Item',
								type: 'fixedCollection',
								typeOptions: {
									multipleValues: true,
								},
								default: {},
								options: [
									{
										name: 'contentItem',
										displayName: 'Content Item',
										values: [
											{
												displayName: 'Content',
												name: 'content',
												type: 'string',
												typeOptions: {
													rows: 4,
												},
												default: '',
												required: true,
												description: 'Content text',
											},
											{
												displayName: 'ID',
												name: 'id',
												type: 'string',
												default: '',
												description: 'Content ID (optional)',
											},
											{
												displayName: 'Images',
												name: 'image',
												placeholder: 'Add Image',
												type: 'fixedCollection',
												typeOptions: {
													multipleValues: true,
												},
												default: {},
												options: [
													{
														name: 'imageItem',
														displayName: 'Image',
														values: [
															{
																displayName: 'ID',
																name: 'id',
																type: 'string',
																default: '',
																required: true,
																description: 'Image ID',
															},
															{
																displayName: 'Path',
																name: 'path',
																type: 'string',
																default: '',
																required: true,
																description: 'Image path/URL',
															},
														],
													},
												],
												description: 'Images for this content item',
											},
										],
									},
								],
								description: 'Content items (value array)',
							},
						],
					},
				],
				description: 'Posts array (required for non-draft)',
			},
			// GetPosts parameters
			{
				displayName: 'Week',
				name: 'week',
				type: 'number',
				typeOptions: {
					minValue: 1,
					maxValue: 52,
				},
				displayOptions: {
					show: {
						operation: ['getPosts'],
					},
				},
				default: 1,
				description: 'Week number for filtering posts (1-52)',
			},
			{
				displayName: 'Day',
				name: 'day',
				type: 'number',
				typeOptions: {
					minValue: 0,
					maxValue: 6,
				},
				displayOptions: {
					show: {
						operation: ['getPosts'],
					},
				},
				default: 0,
				description: 'Day number for filtering posts (0-6, where 0 is Sunday)',
			},
			{
				displayName: 'Display',
				name: 'display',
				type: 'options',
				displayOptions: {
					show: {
						operation: ['getPosts'],
					},
				},
				options: [
					{
						name: 'Day',
						value: 'day',
					},
					{
						name: 'Week',
						value: 'week',
					},
					{
						name: 'Month',
						value: 'month',
					},
				],
				default: 'day',
				description: 'Display mode for posts',
			},
			{
				displayName: 'Month',
				name: 'month',
				type: 'number',
				default: (new Date().getMonth() + 1) as number,
				typeOptions: {
					minValue: 1,
					maxValue: 12,
				},
				displayOptions: {
					show: {
						operation: ['getPosts'],
					},
				},
				description: 'Month number for filtering posts (1-12)',
			},
			{
				displayName: 'Year',
				name: 'year',
				type: 'number',
				typeOptions: {
					minValue: 2022,
					maxValue: new Date().getFullYear() + 10,
				},
				displayOptions: {
					show: {
						operation: ['getPosts'],
					},
				},
				default: new Date().getFullYear(),
				description: 'Year for filtering posts',
			},
			{
				displayName: 'Customer',
				name: 'customer',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['getPosts'],
					},
				},
				default: '',
				description: 'Customer ID for filtering posts',
			},
			// UploadFile parameters
			{
				displayName: 'Binary Property',
				name: 'binaryPropertyName',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['uploadFile'],
					},
				},
				default: '',
				required: true,
				description: 'Name of the binary property that contains the file data',
			},
			{
				displayName: 'Extension (Png / Jpg / Mp4 / etc.)',
				name: 'extension',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['uploadFile'],
					},
				},
				default: '',
				required: true,
				description: 'Extension of the file being uploaded (e.g., png, jpg, mp4)',
			},
			// DeletePost parameters
			{
				displayName: 'Post ID',
				name: 'postId',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['deletePost'],
					},
				},
				default: '',
				required: true,
				description: 'ID of the post to delete',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const length = items.length;
		let responseData: any = undefined;

		for (let i = 0; i < length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i);

				if (operation === 'createPost') {
					// Map CreatePostDto fields exactly
					const type = this.getNodeParameter('type', i) as string;
					const shortLink = this.getNodeParameter('shortLink', i) as boolean;
					const date = this.getNodeParameter('date', i) as string;

					// Get array parameters
					const tagsParam = this.getNodeParameter('tags', i, {}) as any;
					const postsParam = this.getNodeParameter('posts', i, {}) as any;

					// Process tags array
					const tags = tagsParam.tag
						? tagsParam.tag.map((tag: any) => ({
								value: tag.value,
								label: tag.label,
							}))
						: [];

					// Process posts array
					const posts = postsParam.post
						? postsParam.post.map((post: any) => {
								// Process settings for this post
								const settings: any = {};

								if (post.settings?.setting && post.settings.setting.length > 0) {
									post.settings.setting.forEach((setting: any) => {
										settings[setting.key] = setting.value;
									});
								}

								// Process value array (PostContent[])
								const value = post.value?.contentItem
									? post.value.contentItem.map((item: any) => ({
											content: item.content,
											id: item.id || '',
											image: item.image?.imageItem
												? item.image.imageItem.map((img: any) => ({
														id: img.id,
														path: img.path,
													}))
												: [],
										}))
									: [];

								return {
									integration: {
										id: post.integrationId,
									},
									value,
									group: post.group || '',
									settings,
								};
							})
						: [];

					const body = {
						type,
						shortLink,
						date,
						tags,
						posts,
					};

					responseData = await postizApiRequest.call(this, 'POST', '/posts', body);
				}

				if (operation === 'getPosts') {
					const week = this.getNodeParameter('week', i) as number;
					const day = this.getNodeParameter('day', i) as number;
					const display = this.getNodeParameter('display', i) as string;
					const month = this.getNodeParameter('month', i) as number;
					const year = this.getNodeParameter('year', i) as number;
					const customer = this.getNodeParameter('customer', i) as string;

					const query = {
						week,
						day,
						display,
						month,
						year,
						...(customer && { customer }),
					};

					responseData = await postizApiRequest.call(this, 'GET', '/posts', {}, query);
				}

				if (operation === 'uploadFile') {
					const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
					const extension = this.getNodeParameter('extension', i) as string;

					const formData = new FormData();
					formData.append('file', Buffer.from(binaryPropertyName, 'base64'), {
						filename: `file.${extension}`,
					});

					responseData = await postizApiRequest.call(this, 'POST', '/upload', formData);
				}

				if (operation === 'getIntegrations') {
					responseData = await postizApiRequest.call(this, 'GET', '/integrations');
				}

				if (operation === 'deletePost') {
					const postId = this.getNodeParameter('postId', i) as string;
					responseData = await postizApiRequest.call(this, 'DELETE', `/posts/${postId}`);
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData as IDataObject[]),
					{ itemData: { item: i } },
				);

				returnData.push(...executionData);
			} catch (error) {
				console.log(error);
				// if (this.continueOnFail()) {
				const executionErrorData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray({ error: error?.description || error?.message || error }),
					{ itemData: { item: i } },
				);
				returnData.push(...executionErrorData);
				// continue;
				// }
				// throw error;
			}
		}

		return [returnData];
	}
}
