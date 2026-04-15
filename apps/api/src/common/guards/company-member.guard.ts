import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from '@core/prisma/prisma.service'

@Injectable()
export class CompanyMemberGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const user = request.user
    const companyId = request.params.companyId

    if (!companyId) return true

    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    })

    if (!company) {
      throw new NotFoundException('Empresa no encontrada')
    }

    if (user.companyId !== companyId) {
      throw new ForbiddenException('No tienes acceso a esta empresa')
    }

    request.company = company

    return true
  }
}