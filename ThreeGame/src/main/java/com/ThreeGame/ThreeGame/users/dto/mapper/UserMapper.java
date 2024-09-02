package com.ThreeGame.ThreeGame.users.dto.mapper;

import com.ThreeGame.ThreeGame.users.dto.LoginDto;
import com.ThreeGame.ThreeGame.users.dto.LoginRDto;
import com.ThreeGame.ThreeGame.users.dto.RegisterUserDto;
import com.ThreeGame.ThreeGame.users.entity.Users;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UserMapper {


    @Mapping(source = "ruolo", target = "ruolo")
    LoginRDto toLoginRDto(Users user);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "password", ignore = true)
    Users toEntity(RegisterUserDto registerUserDto);
}
