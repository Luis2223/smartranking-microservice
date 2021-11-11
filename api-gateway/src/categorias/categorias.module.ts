import { Module } from '@nestjs/common';
import { ProxyRMQModule } from 'src/proxyrmq/proxyrmq.module';
// import { ProxyClientProvider } from 'src/providers/proxy-client.provider';
import { CategoriasController } from './categorias.controller';

@Module({
    imports: [ProxyRMQModule],
    controllers: [CategoriasController],
    // providers: [ProxyClientProvider]
})
export class CategoriasModule { }
