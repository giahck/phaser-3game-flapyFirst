package com.ThreeGame.ThreeGame.cv.service;

import com.ThreeGame.ThreeGame.cv.dto.cvDto;
import com.ThreeGame.ThreeGame.cv.dto.mapper.CvMapper;
import com.ThreeGame.ThreeGame.cv.entity.Cv;
import com.ThreeGame.ThreeGame.cv.repository.CvRepository;
import com.ThreeGame.ThreeGame.users.entity.Users;
import com.ThreeGame.ThreeGame.users.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CvService {
    @Autowired
    private CvRepository cvRepository;

    @Autowired
    private CvMapper cvMapper;

    @Autowired
    private UserRepository userRepository;

    public cvDto saveCv(cvDto cvDto) {
        Users user = userRepository.findById((int) cvDto.getId()).orElseThrow(() -> new RuntimeException("Utente non trovato"));

        Cv cvExisting = user.getCv();
        if (cvExisting != null) {
            Cv updateCv = cvMapper.toEntity(cvDto);
            cvExisting.setNome(cvDto.getNome());
            cvExisting.setCognome(cvDto.getCognome());
            cvExisting.setEmail(cvDto.getEmail());
            cvExisting.setTelefono(cvDto.getTelefono());
            cvExisting.setIndirizzo(cvDto.getIndirizzo());
            cvExisting.setTitolo(cvDto.getTitolo());

            cvExisting.getEsperienze().clear();
            cvExisting.getFormazioni().clear();
            updateCv.getEsperienze().forEach(esperienza -> esperienza.setCv(cvExisting));
            updateCv.getFormazioni().forEach(formazione -> formazione.setCv(cvExisting));
            cvExisting.getEsperienze().addAll(updateCv.getEsperienze());
            cvExisting.getFormazioni().addAll(updateCv.getFormazioni());
            cvExisting.setUsers(user);

            return cvMapper.toDto(cvRepository.save(cvExisting));
        }else {
        Cv cvNew = cvMapper.toEntity(cvDto);
        cvNew.setUsers(user);
        cvNew.getEsperienze().forEach(esperienza -> esperienza.setCv(cvNew));
        cvNew.getFormazioni().forEach(formazione -> formazione.setCv(cvNew));
        return cvMapper.toDto(cvRepository.save(cvNew));
        }
    }

    public List<cvDto> findAll() {
        List<Cv> cvs = cvRepository.findAll();
        return cvs.stream()
                .map(cvMapper::toDto)
                .toList();
    }
    public cvDto findByUserId(Long userId) {
        Users user = userRepository.findById(Math.toIntExact(userId)).orElseThrow(() -> new RuntimeException("Utente non trovato"));
        Cv cv = user.getCv();
        return cvMapper.toDto(cv);
    }

}
