import { Body, Controller, Post } from "@nestjs/common";
import { AuthDto } from "src/dto";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService){}

    @Post("signin")
    signin(@Body() dto: AuthDto){
        console.log({dto,});
        return this.authService.signin();
    }

    @Post("signup")
    signup(){
        return this.authService.signup();
    }
}