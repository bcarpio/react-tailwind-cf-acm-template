.PHONY: help fmt validate clean all

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

fmt: ## Format terraform code
	@echo "Formatting Terraform code..."
	@cd terraform && terraform fmt -recursive

validate: ## Validate Terraform configuration
	@echo "Validating Terraform..."
	@cd terraform && terraform init -backend=false > /dev/null && terraform validate

clean: ## Clean build artifacts
	@echo "Cleaning build artifacts..."
	@rm -rf ui/dist ui/dist-server 2>/dev/null || true
	@echo "Clean complete"

all: fmt validate ## Run fmt and validate
	@echo "All checks passed!"
