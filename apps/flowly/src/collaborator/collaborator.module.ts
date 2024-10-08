import { Module } from '@nestjs/common';
import { CollaboratorService } from './collaborator.service';
import { CollaboratorController } from './collaborator.controller';
import { CollaboratorRepository } from './collaborator.repository';
import { Collaborator, DatabaseModule, Team } from '@app/common/database';
import { JwtStrategy } from '@app/common/strategies';
import { TeamRepository } from '../team/team.repository';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  providers: [
    CollaboratorService,
    CollaboratorRepository,
    JwtStrategy,
    TeamRepository,
  ],
  controllers: [CollaboratorController],
  imports: [
    DatabaseModule.forFeature([Collaborator, Team]),
    ClientsModule.registerAsync([
      {
        name: 'AUTH_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL')],
            queue: 'auth_queue',
            queueOptions: {
              durable: false,
            },
          },
        }),
        inject: [ConfigService],
        imports: [ConfigModule],
      },
    ]),
  ],
})
export class CollaboratorModule {}
