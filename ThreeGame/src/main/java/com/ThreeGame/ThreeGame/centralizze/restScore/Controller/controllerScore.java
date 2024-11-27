package com.ThreeGame.ThreeGame.centralizze.restScore.Controller;

import com.ThreeGame.ThreeGame.centralizze.restScore.dto.ScoreDto;
import com.ThreeGame.ThreeGame.centralizze.serviceRabit.ScorePublisher;
import com.ThreeGame.ThreeGame.cv.dto.cvDto;
import com.ThreeGame.ThreeGame.exeptions.exeptions.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class controllerScore {
    @Autowired
    private ScorePublisher scorePublisher;
    @PostMapping("/score")
    public ScoreDto postScore(@RequestBody @Validated ScoreDto score, BindingResult bindingResult) throws InterruptedException {
        if (bindingResult.hasErrors()) {
            throw new BadRequestException(bindingResult.getAllErrors().stream().map(objectError -> objectError.getDefaultMessage()).
                    reduce("", (s, s2) -> s + s2));
        }
        scorePublisher.sendData(score);
        return score;
    }
}
