import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  // Generate random account number
  private generateAccountNumber(): string {
    return 'REV' + Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  async create(userId: string, dto: CreateAccountDto) {
    const accountNumber = dto.accountNumber || this.generateAccountNumber();

    const account = await this.prisma.account.create({
      data: {
        accountNumber,
        accountType: dto.accountType,
        userId,
        balance: 0,
      },
    });

    return account;
  }

  async findAll(userId: string) {
    return this.prisma.account.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, accountId: string) {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (account.userId !== userId) {
      throw new ForbiddenException('You can only access your own accounts');
    }

    return account;
  }

  async update(userId: string, accountId: string, dto: UpdateAccountDto) {
    // Cek ownership
    await this.findOne(userId, accountId);

    const account = await this.prisma.account.update({
      where: { id: accountId },
      data: dto,
    });

    return account;
  }

  async remove(userId: string, accountId: string) {
    // Cek ownership
    await this.findOne(userId, accountId);

    await this.prisma.account.delete({
      where: { id: accountId },
    });

    return { message: 'Account deleted successfully' };
  }
}