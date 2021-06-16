import { Module } from '@nestjs/common';
// import { ProxyClientProvider } from 'src/providers/proxy-client.provider';
import { CategoriasController } from './categorias.controller';

@Module({
    controllers: [CategoriasController],
    // providers: [ProxyClientProvider]
})
export class CategoriasModule { }
