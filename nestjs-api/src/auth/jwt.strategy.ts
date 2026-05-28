import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKeyProvider: passportJwtSecret({
                cache: true,
                rateLimit: true,
                jwksRequestsPerMinute: 5,
                jwksUri: 'http://localhost:8080/realms/estudo/protocol/openid-connect/certs',
            }),
            issuer: 'http://localhost:8080/realms/estudo',
            algorithms: ['RS256'],
        });
    }

    async validate(payload: any) {
        return {
            sub: payload.sub,
            email: payload.email,
            username: payload.preferred_username,
            roles: payload.realm_access?.roles ?? [],
        };
    }
}