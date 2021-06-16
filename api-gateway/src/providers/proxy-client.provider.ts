import { Injectable } from "@nestjs/common";
import { ClientProxy, ClientProxyFactory, Transport } from "@nestjs/microservices";

@Injectable()
export class ProxyClientProvider {
    private clientAdminBackend: ClientProxy;

    constructor() {
        this.clientAdminBackend = ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: ['amqp://guest:guest@127.0.0.1:5672/smartranking'],
            queue: 'admin-backend',
          },
        });
      }

    exec() {
        return this.clientAdminBackend;
    }
}