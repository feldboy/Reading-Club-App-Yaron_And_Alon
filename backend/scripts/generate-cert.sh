#!/bin/bash

# Validate OpenSSL installation
if ! command -v openssl &> /dev/null; then
    echo "❌ OpenSSL could not be found. Please install it first."
    exit 1
fi

echo "🔐 Generating Self-Signed SSL Certificate..."

# Generate key and certificate
openssl req -nodes -new -x509 -keyout server.key -out server.cert -days 365 -subj "/C=IL/ST=RishonLetzion/L=RishonLetzion/O=CollegeManagement/OU=StudentDev/CN=localhost"

if [ -f "server.key" ] && [ -f "server.cert" ]; then
    echo "✅ Certificates generated successfully!"
    echo "📂 Files created:"
    echo "   - server.key"
    echo "   - server.cert"
    echo ""
    echo "⚠️  Important: Do not commit these files to Git!"
    chmod 600 server.key
else
    echo "❌ Failed to generate certificates."
    exit 1
fi
