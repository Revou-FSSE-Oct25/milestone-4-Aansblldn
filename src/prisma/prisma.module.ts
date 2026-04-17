import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()  // ← Penting! Bikin PrismaService bisa diakses di semua module
@Module({
  providers: [PrismaService],
  exports: [PrismaService],  // ← Export supaya module lain bisa pakai
})
export class PrismaModule {}