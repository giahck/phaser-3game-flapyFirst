package com.ThreeGame.ThreeGame.cv.service;

import com.ThreeGame.ThreeGame.cv.dto.cvDto;
import com.ThreeGame.ThreeGame.cv.dto.mapper.CvMapper;
import com.ThreeGame.ThreeGame.cv.entity.Cv;
import com.ThreeGame.ThreeGame.cv.repository.CvRepository;
import com.ThreeGame.ThreeGame.users.entity.Users;
import com.ThreeGame.ThreeGame.users.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CvService {
    @Autowired
    private CvRepository cvRepository;

    @Autowired
    private CvMapper cvMapper;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Cv saveCv(cvDto cvDto) {
        try {
            Cv cv = cvMapper.toEntity(cvDto);
            Users user = userRepository.findById((int) cvDto.getId()).orElseThrow(() -> new RuntimeException("Utente non trovato"));
            cv.setUsers(user);
            cv.getEsperienze().forEach(esperienza -> esperienza.setCv(cv));
            cv.getFormazioni().forEach(formazione -> formazione.setCv(cv));
            return cvRepository.save(cv);
        } catch (ObjectOptimisticLockingFailureException e) {
            throw new RuntimeException("Conflitto di aggiornamento: " + e.getMessage(), e);
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
