"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminProductQueueController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const product_service_1 = require("../../product/product.service");
const review_product_dto_1 = require("../../product/dto/review-product.dto");
let AdminProductQueueController = class AdminProductQueueController {
    constructor(productService) {
        this.productService = productService;
    }
    getPendingProducts(page = 1, limit = 20) {
        return this.productService.getPendingProducts(Number(page), Number(limit));
    }
    reviewProduct(id, req, dto) {
        return this.productService.reviewProduct(id, req.user.id, dto);
    }
};
exports.AdminProductQueueController = AdminProductQueueController;
__decorate([
    (0, common_1.Get)('pending'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AdminProductQueueController.prototype, "getPendingProducts", null);
__decorate([
    (0, common_1.Patch)(':id/review'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, review_product_dto_1.ReviewProductDto]),
    __metadata("design:returntype", void 0)
], AdminProductQueueController.prototype, "reviewProduct", null);
exports.AdminProductQueueController = AdminProductQueueController = __decorate([
    (0, common_1.Controller)('admin/products'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __metadata("design:paramtypes", [product_service_1.ProductService])
], AdminProductQueueController);
//# sourceMappingURL=product-queue.controller.js.map