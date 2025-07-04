import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter<RpcException> {
    
    catch(exception: RpcException, host: ArgumentsHost) {
        
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        const rpcError = exception.getError();
        console.log({rpcError});
        
        if ( rpcError.toString().includes('Empty response')) {
            return response.status(500).json({
                status: 500,
                message: rpcError.toString().substring(0, rpcError.toString().indexOf('(') - 1)
            });
        }

        if (
            typeof rpcError === 'object' &&
            'status' in rpcError &&
            'message' in rpcError) {

            const status = typeof rpcError.status === 'number' ? 400 : rpcError.status;
            return response.status(status).json(rpcError);
        }

        response.status(400).json({
            status: 400,
            message: rpcError
        });
    }

}