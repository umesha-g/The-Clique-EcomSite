# Automated Deployment Script

# Configuration
$VM_IP = "140.245.227.88"
$VM_USER = "ubuntu"
$SSH_KEY = "ssh-key.key"
$LOCAL_ZIP = "../Frontend/FrontEnd.zip"
$REMOTE_PATH = "/home/ubuntu/frontend/"

# Build Project (Commented out)
# Write-Host "Building project..."
# Set-Location ../Backend
# mvn clean package

Write-Host "Transferring Zip to VM..."
scp -i "$SSH_KEY" "$LOCAL_ZIP" "${VM_USER}@${VM_IP}:$REMOTE_PATH"

# Optional: Restart Backend Service
#ssh -i "$SSH_KEY" "${VM_USER}@${VM_IP}" "sudo systemctl restart backend-service"

ssh -i "$SSH_KEY" "${VM_USER}@${VM_IP}" "cd the_clique_frontend" 

Write-Host "Unzipping..."
ssh -i "$SSH_KEY" "${VM_USER}@${VM_IP}" "unzip FrontEnd.zip"

Write-Host "Deployment complete!" 