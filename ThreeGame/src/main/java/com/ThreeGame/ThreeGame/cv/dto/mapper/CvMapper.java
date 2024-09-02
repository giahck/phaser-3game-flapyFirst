package com.ThreeGame.ThreeGame.cv.dto.mapper;

import com.ThreeGame.ThreeGame.cv.dto.cvDto;
import com.ThreeGame.ThreeGame.cv.entity.Cv;
import com.ThreeGame.ThreeGame.cv.entity.EsperienzaCv;
import com.ThreeGame.ThreeGame.cv.entity.FormazioneCv;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface CvMapper {
    CvMapper INSTANCE = Mappers.getMapper(CvMapper.class);

    // Mappa da cvDto a Cv
    @Mapping(target = "esperienze", source = "esperienze")
    @Mapping(target = "formazioni", source = "formazioni")
    Cv toEntity(cvDto dto);

    // Mappa da Cv a cvDto
    @Mapping(target = "esperienze", source = "esperienze")
    @Mapping(target = "formazioni", source = "formazioni")
    cvDto toDto(Cv cv);

    // Mappa da cvDto.Esperienza a EsperienzaCv
    EsperienzaCv toEntity(cvDto.Esperienza dto);

    // Mappa da EsperienzaCv a cvDto.Esperienza
    cvDto.Esperienza toDto(EsperienzaCv esperienza);

    // Mappa da cvDto.Formazione a FormazioneCv
    FormazioneCv toEntity(cvDto.Formazione dto);

    // Mappa da FormazioneCv a cvDto.Formazione
    cvDto.Formazione toDto(FormazioneCv formazione);

}
