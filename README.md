<div align="center">

<img alt="goindex-license" src="https://img.shields.io/badge/Open_source-MIT-red.svg?logo=git&logoColor=green"/>
<img src="https://img.shields.io/github/last-commit/Elcapitanoe/Upload-Speed-Test.svg?logo=Sublime+Text&logoColor=green&label=Active"/>
<img alt="GitHub Release Date" src="https://img.shields.io/github/release-date/Elcapitanoe/Upload-Speed-Test">
<img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/Elcapitanoe/Upload-Speed-Test">
<img alt="GitHub repo size" src="https://img.shields.io/github/repo-size/Elcapitanoe/Upload-Speed-Test">
<img src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2FElcapitanoe%2FUpload-Speed-Test&count_bg=%2379C83D&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=Views&edge_flat=false"/>

</div>

## Upload Speed Test
A JavaScript-based upload speed test that provides detailed information about the upload speed and file hash. This project is designed to work seamlessly with **Cloudflare Workers**.

## Demo
[https://uploadtest.pambi.workers.dev](https://uploadtest.pambi.workers.dev)


## Features
- Measures upload speed in real-time
- Displays detailed upload speed and file hash
- Easy to deploy on Cloudflare Workers

## Installation
To get started with this project, you need to deploy it on **Cloudflare Workers**. Follow the steps below:
1. Fork this repository or clone it to your local machine:
   ```bash
   git clone https://github.com/Elcapitanoe/Upload-Speed-Test.git
   ```
2. Install [Cloudflare Workers CLI](https://developers.cloudflare.com/workers/platform/cli-wrangler/) if you haven’t already.
3. Authenticate with Cloudflare Workers using:
   ```bash
   wrangler login
   ```
4. Set up your environment by configuring your `wrangler.toml` file with your Cloudflare account details.
5. Deploy the project to Cloudflare Workers:
   ```bash
   wrangler publish
   ```
6. Visit the provided URL to run the upload speed test.

## Usage
Once deployed, the upload speed test will allow users to upload a file to the server. After the upload is complete, it will display:
- **Upload Speed**: The speed at which the file was uploaded.
- **File Hash**: A unique identifier of the file, typically generated using a hashing algorithm (like SHA-256).
You can test the speed by uploading files and checking the result directly from the Cloudflare Workers URL.

## Example Output
Once the test is complete, the following information will be displayed:
- Upload Speed: `XX Mbps`
- File Hash: `XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`


## License
This project is open-source and available under the [MIT License](LICENSE).
