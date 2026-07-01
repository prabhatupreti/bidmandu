import { Controller, Get, Patch, Param, Query, UseGuards, Req, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ProductService } from '../../product/product.service';
import { ReviewProductDto } from '../../product/dto/review-product.dto';

@Controller('admin/products')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminProductQueueController {
  constructor(private productService: ProductService) {}

  @Get('pending')
  getPendingProducts(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.productService.getPendingProducts(Number(page), Number(limit));
  }

  @Patch(':id/review')
  reviewProduct(@Param('id') id: string, @Req() req, @Body() dto: ReviewProductDto) {
    return this.productService.reviewProduct(id, req.user.id, dto);
  }
}