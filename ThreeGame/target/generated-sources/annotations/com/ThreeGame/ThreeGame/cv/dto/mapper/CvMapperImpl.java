package com.ThreeGame.ThreeGame.cv.dto.mapper;

import com.ThreeGame.ThreeGame.cv.dto.cvDto;
import com.ThreeGame.ThreeGame.cv.entity.Cv;
import com.ThreeGame.ThreeGame.cv.entity.EsperienzaCv;
import com.ThreeGame.ThreeGame.cv.entity.FormazioneCv;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-08-23T14:06:58+0200",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 22.0.2 (Oracle Corporation)"
)
@Component
public class CvMapperImpl implements CvMapper {

    @Override
    public Cv toEntity(cvDto dto) {
        if ( dto == null ) {
            return null;
        }

        Cv cv = new Cv();

        cv.setEsperienze( esperienzaListToEsperienzaCvList( dto.getEsperienze() ) );
        cv.setFormazioni( formazioneListToFormazioneCvList( dto.getFormazioni() ) );
        cv.setNome( dto.getNome() );
        cv.setCognome( dto.getCognome() );
        cv.setEmail( dto.getEmail() );
        cv.setTelefono( dto.getTelefono() );
        cv.setIndirizzo( dto.getIndirizzo() );
        cv.setTitolo( dto.getTitolo() );

        return cv;
    }

    @Override
    public cvDto toDto(Cv cv) {
        if ( cv == null ) {
            return null;
        }

        cvDto cvDto = new cvDto();

        cvDto.setEsperienze( esperienzaCvListToEsperienzaList( cv.getEsperienze() ) );
        cvDto.setFormazioni( formazioneCvListToFormazioneList( cv.getFormazioni() ) );
        cvDto.setNome( cv.getNome() );
        cvDto.setCognome( cv.getCognome() );
        cvDto.setEmail( cv.getEmail() );
        cvDto.setTelefono( cv.getTelefono() );
        cvDto.setIndirizzo( cv.getIndirizzo() );
        cvDto.setTitolo( cv.getTitolo() );

        return cvDto;
    }

    @Override
    public EsperienzaCv toEntity(cvDto.Esperienza dto) {
        if ( dto == null ) {
            return null;
        }

        EsperienzaCv esperienzaCv = new EsperienzaCv();

        esperienzaCv.setNome( dto.getNome() );
        esperienzaCv.setLuogo( dto.getLuogo() );
        esperienzaCv.setDataInizio( dto.getDataInizio() );
        esperienzaCv.setDataFine( dto.getDataFine() );
        esperienzaCv.setDescrizione( dto.getDescrizione() );

        return esperienzaCv;
    }

    @Override
    public cvDto.Esperienza toDto(EsperienzaCv esperienza) {
        if ( esperienza == null ) {
            return null;
        }

        cvDto.Esperienza esperienza1 = new cvDto.Esperienza();

        esperienza1.setNome( esperienza.getNome() );
        esperienza1.setLuogo( esperienza.getLuogo() );
        esperienza1.setDataInizio( esperienza.getDataInizio() );
        esperienza1.setDataFine( esperienza.getDataFine() );
        esperienza1.setDescrizione( esperienza.getDescrizione() );

        return esperienza1;
    }

    @Override
    public FormazioneCv toEntity(cvDto.Formazione dto) {
        if ( dto == null ) {
            return null;
        }

        FormazioneCv formazioneCv = new FormazioneCv();

        formazioneCv.setNome( dto.getNome() );
        formazioneCv.setLuogo( dto.getLuogo() );
        formazioneCv.setDataInizio( dto.getDataInizio() );
        formazioneCv.setDataFine( dto.getDataFine() );
        formazioneCv.setDescrizione( dto.getDescrizione() );

        return formazioneCv;
    }

    @Override
    public cvDto.Formazione toDto(FormazioneCv formazione) {
        if ( formazione == null ) {
            return null;
        }

        cvDto.Formazione formazione1 = new cvDto.Formazione();

        formazione1.setNome( formazione.getNome() );
        formazione1.setLuogo( formazione.getLuogo() );
        formazione1.setDataInizio( formazione.getDataInizio() );
        formazione1.setDataFine( formazione.getDataFine() );
        formazione1.setDescrizione( formazione.getDescrizione() );

        return formazione1;
    }

    protected List<EsperienzaCv> esperienzaListToEsperienzaCvList(List<cvDto.Esperienza> list) {
        if ( list == null ) {
            return null;
        }

        List<EsperienzaCv> list1 = new ArrayList<EsperienzaCv>( list.size() );
        for ( cvDto.Esperienza esperienza : list ) {
            list1.add( toEntity( esperienza ) );
        }

        return list1;
    }

    protected List<FormazioneCv> formazioneListToFormazioneCvList(List<cvDto.Formazione> list) {
        if ( list == null ) {
            return null;
        }

        List<FormazioneCv> list1 = new ArrayList<FormazioneCv>( list.size() );
        for ( cvDto.Formazione formazione : list ) {
            list1.add( toEntity( formazione ) );
        }

        return list1;
    }

    protected List<cvDto.Esperienza> esperienzaCvListToEsperienzaList(List<EsperienzaCv> list) {
        if ( list == null ) {
            return null;
        }

        List<cvDto.Esperienza> list1 = new ArrayList<cvDto.Esperienza>( list.size() );
        for ( EsperienzaCv esperienzaCv : list ) {
            list1.add( toDto( esperienzaCv ) );
        }

        return list1;
    }

    protected List<cvDto.Formazione> formazioneCvListToFormazioneList(List<FormazioneCv> list) {
        if ( list == null ) {
            return null;
        }

        List<cvDto.Formazione> list1 = new ArrayList<cvDto.Formazione>( list.size() );
        for ( FormazioneCv formazioneCv : list ) {
            list1.add( toDto( formazioneCv ) );
        }

        return list1;
    }
}
