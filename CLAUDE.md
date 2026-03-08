# CLAUDE.md - AI Assistant Context

## Project Overview
This is a **React + Tailwind CSS + AWS CloudFront + ACM** template for deploying static sites with:
- React 19 + TypeScript + Vite (SSR/SSG)
- Tailwind CSS v4
- AWS CloudFront CDN with S3 origin
- ACM SSL certificates with DNS validation
- Route53 DNS management
- Auto-discovered blog system

## Architecture

### Infrastructure (Terraform)
- **Dual-region AWS setup**: Primary region for resources, us-east-1 for CloudFront ACM certificates
- **Environment strategy**: `dev` (dev.example.com) and `prd` (example.com) via Terraform workspaces
- **S3 buckets**: Frontend site (CloudFront OAC) + root redirect (apex -> www)
- **CloudFront**: URL rewriting function (.html extension), response headers policy for static assets
- **Route53**: DNS zone created in prd only, shared via SSM parameter with dev
- **SSM Parameters**: Cross-environment reference for bucket names, distribution IDs, zone IDs
- **Modules used**: terraform-aws-modules for s3-bucket and cloudfront

### Frontend (ui/)
- **Build pipeline**: `vite build` (client) -> `vite build --ssr` (server) -> `node scripts/generate-static.js` (SSG + sitemap)
- **Blog auto-discovery**: Drop a `.tsx` file in `src/pages/blogs/` with exported `metadata` object -> automatically included in blog index, sitemap, and SSG
- **Environment-aware**: robots.txt (dev=noindex, prd=index), meta tags injected at build time
- **Deploy via npm scripts**: `npm run publish:dev` or `npm run publish:prd` (build -> S3 sync -> CloudFront invalidation)

## Key Patterns

### Adding a New Blog Post
1. Create `ui/src/pages/blogs/my-post-slug.tsx`
2. Export `metadata: BlogMetadata` with title, description, date, slug, author, tags
3. Export default component with the blog content
4. The post is auto-discovered at build time and runtime (via `import.meta.glob`)

### Adding a New Page
1. Create component in `ui/src/pages/`
2. Add route in `ui/src/main.tsx` and `ui/src/entry-server.tsx`
3. Add to `staticRoutes` and `routeMeta` in `ui/scripts/generate-static.js`

### Deployment
```bash
# Infrastructure (see docs/setup-guide.md for first-time setup)
cd terraform
terraform workspace select prd
terraform apply -var-file=prd.tfvars

# Frontend
cd ui
export SITE_DOMAIN="yourdomain.com"
npm run publish:prd
```

### Customization Checklist
1. Copy `terraform/dev.tfvars.example` -> `terraform/dev.tfvars` and fill in your domain
2. Copy `terraform/prd.tfvars.example` -> `terraform/prd.tfvars` and fill in your domain
3. Copy `terraform/backend.tf.example` -> `terraform/backend.tf` and set your S3 state bucket
4. Update `ui/src/components/Navbar.tsx` with your site name and nav links
5. Update `ui/src/components/Footer.tsx` with your site info
6. Update `ui/src/pages/Home.tsx` with your content
7. Update `ui/src/pages/Contact.tsx` with your real contact info
8. Update `ui/index.html` with your site title and description
9. Update `ui/scripts/generate-static.js` CANONICAL_ORIGIN and routeMeta
10. Update `ui/public/robots.prod.txt` with your sitemap URL

## Commands
- `make fmt` - Format Terraform
- `make validate` - Validate Terraform
- `make clean` - Clean build artifacts
- `npm run dev` (in ui/) - Local dev server
- `npm run publish:dev` (in ui/) - Build and deploy to dev
- `npm run publish:prd` (in ui/) - Build and deploy to prd

## File Structure
```
├── terraform/          # AWS infrastructure (S3, CloudFront, ACM, Route53)
├── ui/                 # React frontend
│   ├── src/
│   │   ├── pages/blogs/  # Auto-discovered blog posts
│   │   ├── components/   # Shared components (Navbar, Footer)
│   │   ├── utils/        # Blog discovery utilities
│   │   └── types/        # TypeScript interfaces
│   └── scripts/          # SSG and sitemap generation
├── docs/               # Setup guide
└── Makefile            # Development automation
```
