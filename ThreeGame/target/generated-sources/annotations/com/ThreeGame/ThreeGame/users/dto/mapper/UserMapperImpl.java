package com.ThreeGame.ThreeGame.users.dto.mapper;

import com.ThreeGame.ThreeGame.users.dto.LoginRDto;
import com.ThreeGame.ThreeGame.users.dto.RegisterUserDto;
import com.ThreeGame.ThreeGame.users.entity.Users;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-08-23T14:06:58+0200",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 22.0.2 (Oracle Corporation)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public LoginRDto toLoginRDto(Users user) {
        if ( user == null ) {
            return null;
        }

        LoginRDto loginRDto = new LoginRDto();

        loginRDto.setRuolo( user.getRuolo() );
        loginRDto.setId( user.getId() );
        loginRDto.setCognome( user.getCognome() );
        loginRDto.setNome( user.getNome() );
        loginRDto.setEmail( user.getEmail() );
        loginRDto.setEnabled( user.getEnabled() );
        loginRDto.setRememberMe( user.getRememberMe() );

        return loginRDto;
    }

    @Override
    public Users toEntity(RegisterUserDto registerUserDto) {
        if ( registerUserDto == null ) {
            return null;
        }

        Users users = new Users();

        users.setCognome( registerUserDto.getCognome() );
        users.setNome( registerUserDto.getNome() );
        users.setEmail( registerUserDto.getEmail() );
        users.setEnabled( registerUserDto.getEnabled() );

        return users;
    }
}
