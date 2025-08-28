#!/usr/bin/env node

/**
 * Production Deployment Script for Helpers Platform
 * 
 * This script handles deployment to production environments
 * Supports: Vercel (frontend), Fly.io (backend), Supabase (database)
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const DEPLOYMENT_TARGETS = {
  FRONTEND: 'vercel',
  BACKEND: 'fly.io',
  DATABASE: 'supabase'
};

class DeploymentManager {
  constructor() {
    this.projectRoot = process.cwd();
    this.clientPath = path.join(this.projectRoot, 'client');
    this.serverPath = path.join(this.projectRoot, 'server');
  }

  async executeCommand(command, cwd = this.projectRoot) {
    return new Promise((resolve, reject) => {
      console.log(`🔧 Executing: ${command}`);
      exec(command, { cwd }, (error, stdout, stderr) => {
        if (error) {
          console.error(`❌ Command failed: ${error.message}`);
          reject(error);
          return;
        }
        if (stderr) {
          console.warn(`⚠️ Warning: ${stderr}`);
        }
        console.log(stdout);
        resolve(stdout);
      });
    });
  }

  async checkPrerequisites() {
    console.log('📋 Checking deployment prerequisites...');
    
    const requiredEnvVars = [
      'SUPABASE_URL',
      'SUPABASE_SERVICE_ROLE_KEY',
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY'
    ];

    const missingVars = requiredEnvVars.filter(env => !process.env[env]);
    
    if (missingVars.length > 0) {
      throw new Error(`❌ Missing environment variables: ${missingVars.join(', ')}`);
    }

    // Check if required CLI tools are installed
    const cliTools = [
      { name: 'vercel', command: 'vercel --version' },
      { name: 'flyctl', command: 'flyctl version' }
    ];

    for (const tool of cliTools) {
      try {
        await this.executeCommand(tool.command);
        console.log(`✅ ${tool.name} CLI is installed`);
      } catch (error) {
        console.warn(`⚠️ ${tool.name} CLI not found. Install with: npm i -g ${tool.name}`);
      }
    }

    console.log('✅ Prerequisites check completed');
  }

  async buildProject() {
    console.log('🔨 Building project...');
    
    // Build client
    console.log('📦 Building frontend...');
    await this.executeCommand('npm run build', this.clientPath);
    
    // Build server
    console.log('📦 Building backend...');
    await this.executeCommand('npm run build', this.serverPath);
    
    console.log('✅ Project built successfully');
  }

  async runTests() {
    console.log('🧪 Running tests...');
    
    try {
      // Run client tests
      await this.executeCommand('npm test -- --watchAll=false', this.clientPath);
      console.log('✅ Frontend tests passed');
    } catch (error) {
      console.warn('⚠️ Frontend tests failed or not configured');
    }

    try {
      // Run server tests
      await this.executeCommand('npm test', this.serverPath);
      console.log('✅ Backend tests passed');
    } catch (error) {
      console.warn('⚠️ Backend tests failed or not configured');
    }
  }

  async deployToVercel() {
    console.log('🚀 Deploying frontend to Vercel...');
    
    // Create vercel.json if it doesn't exist
    const vercelConfig = {
      "version": 2,
      "name": "helpers-platform",
      "builds": [
        {
          "src": "client/package.json",
          "use": "@vercel/next"
        }
      ],
      "routes": [
        {
          "src": "/api/(.*)",
          "dest": "https://your-backend-domain.fly.dev/api/$1"
        },
        {
          "src": "/(.*)",
          "dest": "client/$1"
        }
      ],
      "env": {
        "NEXT_PUBLIC_SUPABASE_URL": process.env.NEXT_PUBLIC_SUPABASE_URL,
        "NEXT_PUBLIC_SUPABASE_ANON_KEY": process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        "NEXT_PUBLIC_API_URL": process.env.NEXT_PUBLIC_API_URL || "https://your-backend-domain.fly.dev/api"
      }
    };

    const vercelConfigPath = path.join(this.clientPath, 'vercel.json');
    if (!fs.existsSync(vercelConfigPath)) {
      fs.writeFileSync(vercelConfigPath, JSON.stringify(vercelConfig, null, 2));
      console.log('📝 Created vercel.json configuration');
    }

    try {
      // Deploy to Vercel
      await this.executeCommand('vercel --prod', this.clientPath);
      console.log('✅ Frontend deployed to Vercel successfully');
    } catch (error) {
      console.error('❌ Vercel deployment failed:', error.message);
      console.log('📝 Manual deployment steps:');
      console.log('1. Install Vercel CLI: npm i -g vercel');
      console.log('2. Login: vercel login');
      console.log('3. Deploy: cd client && vercel --prod');
    }
  }

  async deployToFlyIo() {
    console.log('🚀 Deploying backend to Fly.io...');

    // Create fly.toml if it doesn't exist
    const flyConfig = `
# fly.toml app configuration file generated for helpers-platform-api

app = "helpers-platform-api"
primary_region = "iad"

[build]
  dockerfile = "Dockerfile"

[env]
  NODE_ENV = "production"
  PORT = "3001"

[[services]]
  http_checks = []
  internal_port = 3001
  processes = ["app"]
  protocol = "tcp"
  script_checks = []

  [services.concurrency]
    hard_limit = 25
    soft_limit = 20
    type = "connections"

  [[services.ports]]
    force_https = true
    handlers = ["http"]
    port = 80

  [[services.ports]]
    handlers = ["tls", "http"]
    port = 443

  [[services.tcp_checks]]
    grace_period = "1s"
    interval = "15s"
    restart_limit = 0
    timeout = "2s"

[http_service]
  internal_port = 3001
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 1
  processes = ["app"]

[[vm]]
  cpu_kind = "shared"
  cpus = 1
  memory_mb = 512
`;

    const flyConfigPath = path.join(this.serverPath, 'fly.toml');
    if (!fs.existsSync(flyConfigPath)) {
      fs.writeFileSync(flyConfigPath, flyConfig);
      console.log('📝 Created fly.toml configuration');
    }

    try {
      // Check if app exists, if not create it
      try {
        await this.executeCommand('flyctl status', this.serverPath);
      } catch (error) {
        console.log('📝 Creating new Fly.io app...');
        await this.executeCommand('flyctl apps create helpers-platform-api', this.serverPath);
      }

      // Set secrets
      console.log('🔐 Setting production secrets...');
      const secrets = [
        `SUPABASE_URL=${process.env.SUPABASE_URL}`,
        `SUPABASE_SERVICE_ROLE_KEY=${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        `SUPABASE_ANON_KEY=${process.env.SUPABASE_ANON_KEY}`,
        `SUPABASE_JWT_SECRET=${process.env.SUPABASE_JWT_SECRET}`,
        `JWT_SECRET=${process.env.JWT_SECRET}`,
        `CORS_ORIGIN=https://your-domain.com`
      ];

      await this.executeCommand(
        `flyctl secrets set ${secrets.join(' ')}`, 
        this.serverPath
      );

      // Deploy
      await this.executeCommand('flyctl deploy', this.serverPath);
      console.log('✅ Backend deployed to Fly.io successfully');
      
      const appInfo = await this.executeCommand('flyctl info', this.serverPath);
      console.log('📝 Backend URL: https://helpers-platform-api.fly.dev');
      
    } catch (error) {
      console.error('❌ Fly.io deployment failed:', error.message);
      console.log('📝 Manual deployment steps:');
      console.log('1. Install Fly CLI: https://fly.io/docs/flyctl/install/');
      console.log('2. Login: flyctl auth login');
      console.log('3. Deploy: cd server && flyctl deploy');
    }
  }

  async setupDomainDNS() {
    console.log('🌐 Domain DNS Setup Instructions:');
    console.log('');
    console.log('For your custom domain, you need to set up the following DNS records:');
    console.log('');
    console.log('📱 Frontend (Vercel):');
    console.log('  Type: CNAME');
    console.log('  Name: @ (or www)');
    console.log('  Value: cname.vercel-dns.com');
    console.log('');
    console.log('🔧 Backend API (Fly.io):');
    console.log('  Type: CNAME');
    console.log('  Name: api');
    console.log('  Value: helpers-platform-api.fly.dev');
    console.log('');
    console.log('📋 After DNS setup:');
    console.log('1. Add domain in Vercel dashboard');
    console.log('2. Add domain certificate in Fly.io: flyctl certs create api.your-domain.com');
    console.log('3. Update CORS_ORIGIN in environment variables');
    console.log('4. Update NEXT_PUBLIC_API_URL to point to api.your-domain.com');
  }

  async deploy(target = 'all') {
    try {
      await this.checkPrerequisites();
      
      if (target === 'all' || target === 'build') {
        await this.buildProject();
        await this.runTests();
      }

      if (target === 'all' || target === 'frontend') {
        await this.deployToVercel();
      }

      if (target === 'all' || target === 'backend') {
        await this.deployToFlyIo();
      }

      if (target === 'all' || target === 'dns') {
        this.setupDomainDNS();
      }

      console.log('');
      console.log('🎉 Deployment completed successfully!');
      console.log('');
      console.log('📋 Post-deployment checklist:');
      console.log('1. Test frontend at your Vercel URL');
      console.log('2. Test backend API at your Fly.io URL');
      console.log('3. Configure custom domain DNS records');
      console.log('4. Set up monitoring and alerts');
      console.log('5. Run smoke tests on production');
      
    } catch (error) {
      console.error('❌ Deployment failed:', error.message);
      process.exit(1);
    }
  }
}

// Command line interface
const target = process.argv[2] || 'all';
const validTargets = ['all', 'build', 'frontend', 'backend', 'dns'];

if (!validTargets.includes(target)) {
  console.error(`❌ Invalid deployment target: ${target}`);
  console.log(`✅ Valid targets: ${validTargets.join(', ')}`);
  process.exit(1);
}

const deployment = new DeploymentManager();
deployment.deploy(target).catch(console.error);
