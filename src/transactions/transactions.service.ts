import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { TransferDto } from './dto/transfer.dto';
import { TransactionType } from '@prisma/client';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  // Helper: Verify account ownership
  private async verifyAccountOwnership(userId: string, accountId: string) {
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

  async deposit(userId: string, dto: DepositDto) {
    const account = await this.verifyAccountOwnership(userId, dto.accountId);

    // Update balance
    const updatedAccount = await this.prisma.account.update({
      where: { id: dto.accountId },
      data: {
        balance: {
          increment: dto.amount,
        },
      },
    });

    // Create transaction record
    const transaction = await this.prisma.transaction.create({
      data: {
        type: TransactionType.DEPOSIT,
        amount: dto.amount,
        description: dto.description || 'Deposit',
        toAccountId: dto.accountId,
      },
    });

    return {
      message: 'Deposit successful',
      transaction,
      newBalance: updatedAccount.balance,
    };
  }

  async withdraw(userId: string, dto: WithdrawDto) {
    const account = await this.verifyAccountOwnership(userId, dto.accountId);

    // Check sufficient balance
    if (Number(account.balance) < dto.amount) {
      throw new BadRequestException('Insufficient balance');
    }

    // Update balance
    const updatedAccount = await this.prisma.account.update({
      where: { id: dto.accountId },
      data: {
        balance: {
          decrement: dto.amount,
        },
      },
    });

    // Create transaction record
    const transaction = await this.prisma.transaction.create({
      data: {
        type: TransactionType.WITHDRAW,
        amount: dto.amount,
        description: dto.description || 'Withdrawal',
        fromAccountId: dto.accountId,
      },
    });

    return {
      message: 'Withdrawal successful',
      transaction,
      newBalance: updatedAccount.balance,
    };
  }

  async transfer(userId: string, dto: TransferDto) {
    // Verify both accounts belong to user
    const fromAccount = await this.verifyAccountOwnership(userId, dto.fromAccountId);
    await this.verifyAccountOwnership(userId, dto.toAccountId);

    // Check sufficient balance
    if (Number(fromAccount.balance) < dto.amount) {
      throw new BadRequestException('Insufficient balance');
    }

    // Execute transfer in transaction
    const result = await this.prisma.$transaction(async (prisma) => {
      // Deduct from sender
      await prisma.account.update({
        where: { id: dto.fromAccountId },
        data: { balance: { decrement: dto.amount } },
      });

      // Add to receiver
      await prisma.account.update({
        where: { id: dto.toAccountId },
        data: { balance: { increment: dto.amount } },
      });

      // Create transaction record
      const transaction = await prisma.transaction.create({
        data: {
          type: TransactionType.TRANSFER,
          amount: dto.amount,
          description: dto.description || 'Transfer',
          fromAccountId: dto.fromAccountId,
          toAccountId: dto.toAccountId,
        },
      });

      return transaction;
    });

    return {
      message: 'Transfer successful',
      transaction: result,
    };
  }

  async findAll(userId: string) {
    // Get all user's accounts
    const accounts = await this.prisma.account.findMany({
      where: { userId },
      select: { id: true },
    });

    const accountIds = accounts.map(a => a.id);

    // Get transactions involving user's accounts
    return this.prisma.transaction.findMany({
      where: {
        OR: [
          { fromAccountId: { in: accountIds } },
          { toAccountId: { in: accountIds } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      include: {
        fromAccount: { select: { accountNumber: true } },
        toAccount: { select: { accountNumber: true } },
      },
    });
  }

  async findOne(userId: string, transactionId: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        fromAccount: true,
        toAccount: true,
      },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    // Verify user owns one of the accounts in transaction
    const accounts = await this.prisma.account.findMany({
      where: { userId },
      select: { id: true },
    });
    const accountIds = accounts.map(a => a.id);

    const isOwner = 
      (transaction.fromAccountId && accountIds.includes(transaction.fromAccountId)) ||
      (transaction.toAccountId && accountIds.includes(transaction.toAccountId));

    if (!isOwner) {
      throw new ForbiddenException('You can only view your own transactions');
    }

    return transaction;
  }
}