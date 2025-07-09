# Postiz N8N custom node

This is the N8N custom node for [Postiz](https://postiz.com).

## Installation (non-docker)
Go to your n8n installation usually located at `~/.n8n`.
Check if you have the `custom` folder, if not create it and create a new package.json file inside.
```bash
mkdir -p ~/.n8n/custom
npm init -y
```

Then install the Postiz node package:
```
npm install @postiz/n8n
```

## For docker users
Create a new folder on your host machine, for example `~/n8n-custom-nodes`, and create a new package.json file inside:
```bash
mkdir -p ~/n8n-custom-nodes
npm init -y
```

install the Postiz node package:
```bash
npm install @postiz/n8n
```

When you run the n8n docker container, mount the custom nodes folder to the container:
Add the following environment variable to your docker run command:
```
N8N_CUSTOM_EXTENSIONS="~/n8n-custom-nodes"
```


Alternatively, you can use the SDK with curl, check the [Postiz API documentation](https://docs.postiz.com/public-api) for more information.
