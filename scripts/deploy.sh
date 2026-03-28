#!/bin/bash

# Deployment script for Dropship Ecommerce Platform
# This script handles the complete deployment process

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="dropship-ecommerce"
ENVIRONMENT=${1:-production}
REGION=${2:-us-east-1}
BACKUP_DIR="./backups/$(date +%Y%m%d_%H%M%S)"

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    # Check if kubectl is installed (for Kubernetes deployment)
    if command -v kubectl &> /dev/null; then
        KUBERNETES_AVAILABLE=true
    else
        KUBERNETES_AVAILABLE=false
        print_warning "kubectl not found. Kubernetes deployment will be skipped."
    fi
    
    # Check if AWS CLI is installed (for AWS deployment)
    if command -v aws &> /dev/null; then
        AWS_AVAILABLE=true
    else
        AWS_AVAILABLE=false
        print_warning "AWS CLI not found. AWS deployment will be skipped."
    fi
    
    print_status "Prerequisites check completed."
}

# Function to backup existing data
backup_data() {
    print_status "Creating backup of existing data..."
    mkdir -p "$BACKUP_DIR"
    
    # Backup MongoDB data if container exists
    if docker ps -q -f name=dropship-mongodb | grep -q .; then
        docker exec dropship-mongodb mongodump --out /tmp/backup
        docker cp dropship-mongodb:/tmp/backup "$BACKUP_DIR/mongodb"
        print_status "MongoDB backup created."
    fi
    
    # Backup Redis data if container exists
    if docker ps -q -f name=dropship-redis | grep -q .; then
        docker exec dropship-redis redis-cli BGSAVE
        sleep 5
        docker cp dropship-redis:/data/dump.rdb "$BACKUP_DIR/redis.rdb"
        print_status "Redis backup created."
    fi
    
    print_status "Backup completed: $BACKUP_DIR"
}

# Function to deploy with Docker Compose
deploy_docker_compose() {
    print_status "Deploying with Docker Compose..."
    
    # Set environment variables
    export NODE_ENV=$ENVIRONMENT
    
    # Build and start services
    docker-compose down
    docker-compose build --no-cache
    docker-compose up -d
    
    # Wait for services to be healthy
    print_status "Waiting for services to be healthy..."
    sleep 30
    
    # Check service health
    if docker-compose ps | grep -q "Up"; then
        print_status "Docker Compose deployment completed successfully."
        
        # Show service URLs
        print_status "Service URLs:"
        echo "Frontend: http://localhost:3000"
        echo "Backend API: http://localhost:5000"
        echo "MongoDB: localhost:27017"
        echo "Redis: localhost:6379"
    else
        print_error "Docker Compose deployment failed. Check logs with 'docker-compose logs'."
        exit 1
    fi
}

# Function to deploy to Kubernetes
deploy_kubernetes() {
    if [ "$KUBERNETES_AVAILABLE" = false ]; then
        print_warning "Skipping Kubernetes deployment (kubectl not available)."
        return
    fi
    
    print_status "Deploying to Kubernetes..."
    
    # Create namespace if it doesn't exist
    kubectl create namespace dropship --dry-run=client -o yaml | kubectl apply -f -
    
    # Apply secrets (you need to create these first)
    if [ -f "kubernetes/secrets.yaml" ]; then
        kubectl apply -f kubernetes/secrets.yaml
    else
        print_warning "secrets.yaml not found. Please create Kubernetes secrets first."
    fi
    
    # Deploy databases
    kubectl apply -f kubernetes/database-deployment.yaml
    
    # Wait for databases to be ready
    print_status "Waiting for databases to be ready..."
    kubectl wait --for=condition=ready pod -l app=mongodb -n dropship --timeout=300s
    kubectl wait --for=condition=ready pod -l app=redis -n dropship --timeout=300s
    
    # Deploy backend
    kubectl apply -f kubernetes/backend-deployment.yaml
    
    # Wait for backend to be ready
    print_status "Waiting for backend to be ready..."
    kubectl wait --for=condition=ready pod -l app=dropship-backend -n dropship --timeout=300s
    
    # Deploy frontend
    kubectl apply -f kubernetes/frontend-deployment.yaml
    
    # Wait for frontend to be ready
    print_status "Waiting for frontend to be ready..."
    kubectl wait --for=condition=ready pod -l app=dropship-frontend -n dropship --timeout=300s
    
    print_status "Kubernetes deployment completed successfully."
    
    # Show service information
    print_status "Service information:"
    kubectl get services -n dropship
    kubectl get ingress -n dropship
}

# Function to deploy to AWS ECS
deploy_aws_ecs() {
    if [ "$AWS_AVAILABLE" = false ]; then
        print_warning "Skipping AWS deployment (AWS CLI not available)."
        return
    fi
    
    print_status "Deploying to AWS ECS..."
    
    # Build and push Docker images
    print_status "Building and pushing Docker images..."
    
    # Frontend
    aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $(aws sts get-caller-identity --query Account --output text).dkr.ecr.$REGION.amazonaws.com
    docker build -t $PROJECT_NAME-frontend:latest ./frontend
    docker tag $PROJECT_NAME-frontend:latest $(aws sts get-caller-identity --query Account --output text).dkr.ecr.$REGION.amazonaws.com/$PROJECT_NAME-frontend:latest
    docker push $(aws sts get-caller-identity --query Account --output text).dkr.ecr.$REGION.amazonaws.com/$PROJECT_NAME-frontend:latest
    
    # Backend
    docker build -t $PROJECT_NAME-backend:latest ./backend
    docker tag $PROJECT_NAME-backend:latest $(aws sts get-caller-identity --query Account --output text).dkr.ecr.$REGION.amazonaws.com/$PROJECT_NAME-backend:latest
    docker push $(aws sts get-caller-identity --query Account --output text).dkr.ecr.$REGION.amazonaws.com/$PROJECT_NAME-backend:latest
    
    # Update ECS service
    print_status "Updating ECS services..."
    aws ecs update-service --cluster $PROJECT_NAME --service frontend-service --force-new-deployment --region $REGION
    aws ecs update-service --cluster $PROJECT_NAME --service backend-service --force-new-deployment --region $REGION
    
    print_status "AWS ECS deployment completed successfully."
}

# Function to run health checks
run_health_checks() {
    print_status "Running health checks..."
    
    # Check frontend
    if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
        print_status "Frontend health check: ✅ PASSED"
    else
        print_error "Frontend health check: ❌ FAILED"
    fi
    
    # Check backend
    if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
        print_status "Backend health check: ✅ PASSED"
    else
        print_error "Backend health check: ❌ FAILED"
    fi
    
    # Check database connections (if available)
    if docker ps -q -f name=dropship-mongodb | grep -q .; then
        if docker exec dropship-mongodb mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
            print_status "MongoDB health check: ✅ PASSED"
        else
            print_error "MongoDB health check: ❌ FAILED"
        fi
    fi
    
    if docker ps -q -f name=dropship-redis | grep -q .; then
        if docker exec dropship-redis redis-cli ping > /dev/null 2>&1; then
            print_status "Redis health check: ✅ PASSED"
        else
            print_error "Redis health check: ❌ FAILED"
        fi
    fi
}

# Function to show logs
show_logs() {
    print_status "Showing recent logs..."
    
    echo "=== Frontend Logs ==="
    docker-compose logs --tail=50 frontend
    
    echo "=== Backend Logs ==="
    docker-compose logs --tail=50 backend
    
    echo "=== MongoDB Logs ==="
    docker-compose logs --tail=50 mongodb
    
    echo "=== Redis Logs ==="
    docker-compose logs --tail=50 redis
}

# Function to rollback deployment
rollback() {
    print_status "Rolling back deployment..."
    
    # Stop current services
    docker-compose down
    
    # Restore from backup if available
    if [ -d "$BACKUP_DIR" ]; then
        print_status "Restoring from backup: $BACKUP_DIR"
        
        # Restore MongoDB
        if [ -d "$BACKUP_DIR/mongodb" ]; then
            docker-compose up -d mongodb
            sleep 10
            docker cp "$BACKUP_DIR/mongodb" dropship-mongodb:/tmp/
            docker exec dropship-mongodb mongorestore --drop /tmp/mongodb/dropship_ecommerce
            print_status "MongoDB restored."
        fi
        
        # Restore Redis
        if [ -f "$BACKUP_DIR/redis.rdb" ]; then
            docker-compose up -d redis
            sleep 5
            docker cp "$BACKUP_DIR/redis.rdb" dropship-redis:/data/dump.rdb
            docker-compose restart redis
            print_status "Redis restored."
        fi
    fi
    
    print_status "Rollback completed."
}

# Main deployment function
main() {
    print_status "Starting deployment of Dropship Ecommerce Platform..."
    print_status "Environment: $ENVIRONMENT"
    print_status "Region: $REGION"
    
    # Check prerequisites
    check_prerequisites
    
    # Create backup
    backup_data
    
    # Deploy based on available tools
    if command -v docker-compose &> /dev/null; then
        deploy_docker_compose
    fi
    
    if [ "$KUBERNETES_AVAILABLE" = true ]; then
        deploy_kubernetes
    fi
    
    if [ "$AWS_AVAILABLE" = true ] && [ "$ENVIRONMENT" = "production" ]; then
        deploy_aws_ecs
    fi
    
    # Run health checks
    sleep 10
    run_health_checks
    
    # Show logs
    show_logs
    
    print_status "Deployment completed successfully! 🚀"
    print_status "Access your application at: http://localhost:3000"
}

# Handle script arguments
case "${1:-deploy}" in
    deploy)
        main
        ;;
    rollback)
        rollback
        ;;
    health)
        run_health_checks
        ;;
    logs)
        show_logs
        ;;
    backup)
        backup_data
        ;;
    *)
        echo "Usage: $0 {deploy|rollback|health|logs|backup} [environment] [region]"
        echo "  deploy  - Deploy the application (default)"
        echo "  rollback - Rollback to previous version"
        echo "  health  - Run health checks"
        echo "  logs    - Show service logs"
        echo "  backup  - Create backup of data"
        exit 1
        ;;
esac
