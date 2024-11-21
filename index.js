// By Domi Adiwijaya

const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">
    <title>Secure File Upload</title>
    <style>
        body { 
            background: linear-gradient(135deg, #f6f8f9 0%, #e5ebee 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
        }
        .upload-container {
            background: rgba(255,255,255,0.9);
            border-radius: 15px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
        }
        .upload-container:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 35px rgba(0,0,0,0.15);
        }
        #progressBar {
            height: 5px;
            transition: width 0.5s ease;
        }
        .hash-details {
            word-break: break-all;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8 col-lg-6">
                <div class="upload-container p-4">
                    <h2 class="text-center mb-4">
                        <i class="bi bi-cloud-upload text-primary"></i> 
                        Secure File Upload
                    </h2>
                    <form id="upload_form" enctype="multipart/form-data">
                        <div class="mb-3">
                            <input type="file" class="form-control" id="file" name="file" onchange="uploadFile(this)">
                        </div>
                        <div id="result" class="mt-3" style="display:none;">
                            <div class="progress mb-3" style="height: 5px;">
                                <div id="progressBar" class="progress-bar bg-primary" role="progressbar"></div>
                            </div>
                            <div id="fileDetails" class="card bg-light p-3">
                                <div id="status" class="text-center"></div>
                                <div id="hashDetails" class="mt-2 hash-details"></div>
                                <div id="uploadStats" class="mt-2 small text-muted"></div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <script src="/script.js"></script>
</body>
</html>`;


const script = `
function _(e) { return document.getElementById(e) }

// Generate a unique GUID
function generateGUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, 
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Convert bytes to human-readable format
function niceBytes(bytes) {
    const units = ['bytes', 'KiB', 'MiB', 'GiB', 'TiB'];
    let unitIndex = 0;
    while (bytes >= 1024 && unitIndex < units.length - 1) {
        bytes /= 1024;
        unitIndex++;
    }
    return \`\${bytes.toFixed(2)} \${units[unitIndex]}/s\`;
}

function uploadFile(input) {
    const file = input.files[0];
    if (!file) return;

    _('result').style.display = 'block';
    _('status').innerHTML = 'Starting upload...';

    const formData = new FormData();
    formData.append('file', file);

    const startTime = Date.now();
    const xhr = new XMLHttpRequest();

    // Speed tracking variables
    let speedMeasurements = [];
    let minSpeed = Infinity;
    let maxSpeed = 0;

    xhr.upload.onprogress = (event) => {
        const percentComplete = (event.loaded / event.total) * 100;
        const currentTime = Date.now();
        const elapsedTime = (currentTime - startTime) / 1000;
        const uploadSpeed = event.loaded / elapsedTime;

        // Track speeds
        speedMeasurements.push(uploadSpeed);
        minSpeed = Math.min(minSpeed, uploadSpeed);
        maxSpeed = Math.max(maxSpeed, uploadSpeed);

        const avgSpeed = speedMeasurements.reduce((a, b) => a + b, 0) / speedMeasurements.length;

        _('progressBar').style.width = \`\${percentComplete}%\`;
        _('status').innerHTML = \`Uploading: \${percentComplete.toFixed(2)}%\`;
        _('uploadStats').innerHTML = \`
            <div>Current Speed: \${niceBytes(uploadSpeed)}</div>
            <div>Minimum Speed: \${niceBytes(minSpeed)}</div>
            <div>Maximum Speed: \${niceBytes(maxSpeed)}</div>
            <div>Average Speed: \${niceBytes(avgSpeed)}</div>
            <div>Elapsed Time: \${elapsedTime.toFixed(2)} seconds</div>
        \`;
    };

    xhr.onload = () => {
        const response = JSON.parse(xhr.responseText);
        
        // Calculate final speed statistics
        const avgSpeed = speedMeasurements.reduce((a, b) => a + b, 0) / speedMeasurements.length;

        _('hashDetails').innerHTML = \`
            <div>
                <strong>File Details:</strong>
                <div>Name: \${response.name}</div>
                <div>Size: \${niceBytes(response.size)}</div>
                <div>Type: \${response.type}</div>
                
                <hr>
                <strong>File Hashes:</strong>
                <div><strong>SHA-1:</strong> <code>\${response.sha1Hash}</code></div>
                <div><strong>SHA-256:</strong> <code>\${response.sha256Hash}</code></div>
                <div><strong>SHA-384:</strong> <code>\${response.sha384Hash}</code></div>
                <div><strong>SHA-512:</strong> <code>\${response.sha512Hash}</code></div>
                
                <hr>
                <strong>Additional Information:</strong>
                <div>File GUID: <code>\${generateGUID()}</code></div>
                
                <hr>
                <strong>Upload Speed Statistics:</strong>
                <div>Minimum Speed: \${niceBytes(minSpeed)}</div>
                <div>Maximum Speed: \${niceBytes(maxSpeed)}</div>
                <div>Average Speed: \${niceBytes(avgSpeed)}</div>
            </div>
        \`;
    };

    xhr.onerror = () => _('status').innerHTML = 'Upload Failed';
    xhr.open('POST', '/');
    xhr.send(formData);
}
`;


export default {
    async fetch(request, env, ctx) {
        return handleRequest(request);
    },
};


async function handleRequest(request) {
    const path = new URL(request.url).pathname;

    
    if (request.method === 'GET') {
        if (path === '/') {
            return new Response(html, { 
                headers: { "content-type": "text/html;charset=UTF-8" } 
            });
        } else if (path === '/script.js') {
            return new Response(script, { 
                headers: { "content-type": "application/javascript;charset=UTF-8" } 
            });
        }
        return new Response('Not found', { status: 404 });
    }

    
    if (request.method === 'POST' && path === '/') {
        const formData = await request.formData();
        const file = formData.get('file');
        const data = await file.arrayBuffer();

        return new Response(JSON.stringify({
            name: file.name,
            type: file.type,
            size: file.size,
            sha1Hash: await generateHash(data, 'SHA-1'),
            sha256Hash: await generateHash(data, 'SHA-256'),
            sha384Hash: await generateHash(data, 'SHA-384'),
            sha512Hash: await generateHash(data, 'SHA-512')
        }), { headers: { 'Content-Type': 'application/json' } });
    }

    return new Response('Method not allowed', { status: 405 });
}


async function generateHash(data, algorithm) {
    const digest = await crypto.subtle.digest(algorithm, data);
    return Array.from(new Uint8Array(digest))
        .map(b => b.toString(16).padStart(2, '0')).join('');
}
