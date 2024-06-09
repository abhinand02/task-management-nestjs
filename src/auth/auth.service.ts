import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bycrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload-interface';

@Injectable()
export class AuthService {
    constructor(private usersRepository: UsersRepository, private jwtService: JwtService) { }

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {

        return this.usersRepository.createUser(authCredentialsDto);
    }

    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
        const { username, password } = authCredentialsDto;
        const user = await this.usersRepository.findOne({ where: { username: username } });

        if (user && (await bycrypt.compare(password, user.password))) {
            const pyalod: JwtPayload = { username };
            const accessToken: string = await this.jwtService.sign(pyalod);
            return { accessToken };
        } else {
            throw new UnauthorizedException('Please check your login credentials');
        }
        // return this.usersRepository.createUser(authCredentialsDto);
    }
}
