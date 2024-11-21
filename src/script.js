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

// Cloudflare Worker Handler
export default {
    async fetch(request, env, ctx) {
        return handleRequest(request);
    },
};

// Main request handler
async function handleRequest(request) {
    const path = new URL(request.url).pathname;

    // Handle GET requests
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

    // Handle POST requests
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

// Hash generation function
async function generateHash(data, algorithm) {
    const digest = await crypto.subtle.digest(algorithm, data);
    return Array.from(new Uint8Array(digest))
        .map(b => b.toString(16).padStart(2, '0')).join('');
}
