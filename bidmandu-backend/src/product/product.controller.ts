import {
  Controller, Post, Body, UseGuards, UseInterceptors, UploadedFiles, Req, Param, Patch, Get,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SELLER')
  @UseInterceptors(FilesInterceptor('images', 5, { storage: memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } }))
  createProduct(
    @UploadedFiles() images: Express.Multer.File[],
    @Body() dto: CreateProductDto,
    @Req() req,
  ) {
    return this.productService.create(req.user.id, dto, images);
  }

  @Patch(':id/submit')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SELLER')
  submitForApproval(@Param('id') id: string, @Req() req) {
    return this.productService.submitForApproval(id, req.user.id);
  }

  // NEW: Get seller's own products
  @Get('my')
  @UseGuards(JwtAuthGuard)
  async getMyProducts(@Req() req) {
    return this.productService.getMyProducts(req.user.id);
  }
}