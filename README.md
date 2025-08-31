# Introduction
[Growchief](https://growchief.com) is a powerful social media automation tool that allows you to automate your social like connecting, messaging, liking, visting profiles, etc.

You can use n8n to automate your workflow and post to multiple social media platforms at once.

You can [self-host](https://docs.growchief.com/introduction) Growchief or use our [cloud version](https://platform.growchief.com).
For example: New lead in the system >> Connect on social media >> Send a message.

Growchief supports: X, LinkedIn at the moment.

---

> Note
> If you are self-hosting Growchief on port 5000 (reverse proxy),
> Your host must end with /api for example:
> http://yourdomain.com/api

Alternatively, you can use the SDK with curl, check the [Growchief API documentation](https://docs.growchief.com/public-api) for more information.

---

## Installation (quick installation)

- Click on settings
- Click on Community Nodes
- Click on Install
- Add "n8n-nodes-growchief" to "npm Package Name"
- Click on Install

![community-node.png](community-node.png)

---

## Installation (non-docker - manual installation)
Go to your n8n installation usually located at `~/.n8n`.
Check if you have the `custom` folder, if not create it and create a new package.json file inside.
```bash
mkdir -p ~/.n8n/custom
npm init -y
```

Then install the Growchief node package:
```
npm install n8n-nodes-growchief
```

## For docker users (manual installation)
Create a new folder on your host machine, for example `~/n8n-custom-nodes`, and create a new package.json file inside:
```bash
mkdir -p ~/n8n-custom-nodes
npm init -y
```

install the Growchief node package:
```bash
npm install n8n-nodes-growchief
```

When you run the n8n docker container, mount the custom nodes folder to the container:
Add the following environment variable to your docker run command:
```
N8N_CUSTOM_EXTENSIONS="~/n8n-custom-nodes"
```
