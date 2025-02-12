# Automated Deployment Script

# Configuration
$VM_IP = "140.245.227.88"
$VM_USER = "ubuntu"
$SSH_KEY = "ssh-key.key"
$LOCAL_JAR = "../Backend/target/The_Clique_Backend-0.0.1-SNAPSHOT.jar"
$REMOTE_PATH = "/home/ubuntu/backend/"

# Build Project (Commented out)
# Write-Host "Building project..."
# Set-Location ../Backend
# mvn clean package

# Transfer JAR
Write-Host "Transferring JAR to VM..."
scp -i "$SSH_KEY" "$LOCAL_JAR" "${VM_USER}@${VM_IP}:$REMOTE_PATH"

# Optional: Restart Backend Service
#ssh -i "$SSH_KEY" "${VM_USER}@${VM_IP}" "sudo systemctl restart backend-service"

Write-Host "Deployment complete!"