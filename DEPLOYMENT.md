# Deployment Guide for Taikai.network Clone

This guide provides step-by-step instructions for deploying the application to an Ubuntu server on AWS EC2.

## 1. Prerequisites

- An AWS account.
- A registered domain name (optional, but recommended for production and required for HTTPS).
- A Git client to clone the repository.
- An SSH client to connect to your server.

## 2. EC2 Instance Setup

1.  **Launch a new EC2 Instance:**
    -   In the AWS EC2 console, click "Launch Instance".
    -   **AMI:** Choose "Ubuntu Server" (e.g., Ubuntu Server 22.04 LTS).
    -   **Instance Type:** Select `t2.micro` (this is eligible for the AWS Free Tier).
    -   **Key Pair:** Create a new key pair or choose an existing one. You will need the `.pem` file to SSH into your instance.
    -   **Network Settings / Security Group:**
        -   Create a new security group.
        -   Allow SSH traffic from your IP address (port 22).
        -   Allow HTTP traffic from anywhere (port 80).
        -   Allow HTTPS traffic from anywhere (port 443).
    -   **Storage:** The default storage is usually sufficient for a small application.
    -   Launch the instance.

2.  **Elastic IP (Recommended):**
    -   Allocate a new Elastic IP address and associate it with your new EC2 instance. This gives you a static public IP address that won't change if you stop and restart the instance.

## 3. Server Configuration

1.  **Connect to your instance via SSH:**
    ```bash
    ssh -i /path/to/your-key.pem ubuntu@<your_ec2_public_ip>
    ```

2.  **Update System Packages:**
    ```bash
    sudo apt update && sudo apt upgrade -y
    ```

3.  **Install Node.js using NVM (Node Version Manager):**
    ```bash
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
    # Reload your shell to use nvm
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    # Install a recent LTS version of Node.js
    nvm install --lts
    ```

4.  **Install pnpm:**
    ```bash
    npm install -g pnpm
    ```

5.  **Install PostgreSQL:**
    ```bash
    sudo apt install postgresql postgresql-contrib -y
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
    ```

6.  **Install Nginx:**
    ```bash
    sudo apt install nginx -y
    ```

7.  **Install PM2 (Process Manager):**
    ```bash
    pnpm install -g pm2
    ```

## 4. Database Setup

1.  **Switch to the `postgres` user:**
    ```bash
    sudo -i -u postgres
    ```

2.  **Create a database and user for your application:**
    ```sql
    psql
    -- Create a new database
    CREATE DATABASE taikai_clone;
    -- Create a new user (replace 'your_password' with a strong password)
    CREATE USER taikai_user WITH PASSWORD 'your_password';
    -- Grant privileges to the user on the new database
    GRANT ALL PRIVILEGES ON DATABASE taikai_clone TO taikai_user;
    -- Exit psql
    \q
    ```
    Exit the `postgres` user session by typing `exit`.

## 5. Application Deployment

1.  **Clone the Repository:**
    ```bash
    git clone <your_repository_url>
    cd <repository_directory>
    ```

2.  **Set up Environment Variables for the Backend:**
    -   Create a `.env` file in the `apps/api` directory:
        ```bash
        nano apps/api/.env
        ```
    -   Add the following content, replacing the placeholder values:
        ```
        # Database Configuration
        DB_USER=taikai_user
        DB_HOST=localhost
        DB_NAME=taikai_clone
        DB_PASSWORD=your_password
        DB_PORT=5432

        # JWT Secret
        JWT_SECRET=your_super_secret_and_long_jwt_key
        ```

3.  **Run the Database Schema Script:**
    -   Use the `psql` command to execute the `schema.sql` file and create all the necessary tables.
    ```bash
    psql -U taikai_user -d taikai_clone -h localhost -f apps/api/schema.sql
    ```
    You will be prompted for the password you created for `taikai_user`.

4.  **Install Dependencies:**
    ```bash
    pnpm install
    ```

5.  **Build the Applications:**
    ```bash
    pnpm --filter web build
    pnpm --filter api build
    ```

## 6. Running the Application with PM2

1.  **Start the Backend API:**
    -   The `api` build output is in `apps/api/dist`.
    ```bash
    pm2 start apps/api/dist/index.js --name "taikai-api"
    ```

2.  **Start the Frontend Next.js App:**
    -   Next.js requires the `next start` command.
    ```bash
    pm2 start "pnpm --filter web start" --name "taikai-web"
    ```

3.  **Save the PM2 process list and configure it to start on boot:**
    ```bash
    pm2 save
    pm2 startup
    ```
    Follow the command output by `pm2 startup` to complete the setup.

## 7. Configure Nginx as a Reverse Proxy

1.  **Create a new Nginx configuration file:**
    ```bash
    sudo nano /etc/nginx/sites-available/taikai
    ```

2.  **Add the following configuration.** Replace `your_domain.com` with your domain name (or your EC2's public IP if you don't have a domain).
    ```nginx
    server {
        listen 80;
        server_name your_domain.com;

        # Handle frontend requests
        location / {
            proxy_pass http://localhost:3000; # Next.js app runs on port 3000
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }

        # Handle backend API requests
        location /api/ {
            proxy_pass http://localhost:3001; # Backend API runs on port 3001
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
    }
    ```

3.  **Enable the new site by creating a symbolic link:**
    ```bash
    sudo ln -s /etc/nginx/sites-available/taikai /etc/nginx/sites-enabled/
    ```

4.  **Test the Nginx configuration and restart Nginx:**
    ```bash
    sudo nginx -t
    sudo systemctl restart nginx
    ```

At this point, your application should be accessible via your server's IP address or domain name.

## 8. (Optional) Secure with HTTPS using Let's Encrypt

1.  **Install Certbot:**
    ```bash
    sudo apt install certbot python3-certbot-nginx -y
    ```

2.  **Obtain and install an SSL certificate:**
    -   Make sure your domain name is pointing to your server's IP address.
    ```bash
    sudo certbot --nginx -d your_domain.com
    ```
    Follow the on-screen prompts. Certbot will automatically update your Nginx configuration to handle HTTPS and set up automatic certificate renewal.

Your application is now deployed and accessible securely over HTTPS!
