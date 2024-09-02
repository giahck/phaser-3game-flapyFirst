package com.ThreeGame.ThreeGame.cv.repository;

import com.ThreeGame.ThreeGame.cv.entity.Cv;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CvRepository extends JpaRepository<Cv,Long> {

}
