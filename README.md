# Upload Speed Test

**Upload-Speed-Test** is a JavaScript-based upload speed test that provides detailed information about the upload speed and file hash. This project is designed to work seamlessly with **Cloudflare Workers**.

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

## Contributing
If you'd like to contribute to this project, feel free to fork the repository, create a branch, and submit a pull request. Contributions are always welcome!

## License
This project is open-source and available under the [MIT License](LICENSE).
